// ==UserScript==
// @name         Bing Copilot Image auto-downloader
// @namespace    http://tampermonkey.net/
// @version      0.30
// @license      MIT
// @description  Automatic image downloader for Bing Copilot Image Creator.
// @match        https://www.bing.com/images/create*autosavetimer=*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/472861/Bing%20Copilot%20Image%20auto-downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/472861/Bing%20Copilot%20Image%20auto-downloader.meta.js
// ==/UserScript==
//
// I just pasted this together from things found scattered around the internet.  Starting with: https://github.com/Emperorlou/MidJourneyTools
//
// To enable periodic downloading of newly-created images, go to a 'recent creations' page and just leave the tab open, where it will
// periodically refresh the list of recent creations and download anything it hasn't seen before.
// Use a link like: `https://www.bing.com/images/create/-/1234?autosavetimer=45`
//
// This implementation is designed to be left unattended - periodically reloading itself.  It may be slightly annoying if you try to use
// the page while the plugin is enabled; and it may try to stop you clicking links if it's in the middle of downloading a new set of files.

var $ = window.jQuery;

(function() {
    'use strict';
    const filenamePrefix = "bing/";
    const downloadables = "img[src$='&pid=ImgGn']";
    const referrerPath = "/images/create/";
    const authReloadLanding = "https://www.bing.com/images/create/";
    const reauthPrefix = "https://www.bing.com/fd/auth/signin" +
          "?action=interactive&provider=windows_live_id" +
          "&cobrandid=03f1ec5e-1843-43e5-a2f6-e60ab27f6b91" +
          "&noaadredir=1&FORM=GENUS1";
    const downloadInterval = 300;
    const recordExpiryTime = 31 * 24 * 60 * 60 * 1000;
    const downloadTimeout = 60 * 1000;
    const tagPrefix = "CopilotImageDownloader";
    const rootTagId = /^[a-z]+$/;
    var pollRate = 45 * 1000;
    var activeDownloads = 0;
    var loadErrors = 0;
    var lastReload = 0;
    var lastReauth = Date.now();
    var sourcePage = null;
    var realContentID = null;
    var statusTimeoutID = null;
    var statusBufferID = null;
    var reloadTimerID = null;
    var reauthWindowID = null;

    function jitter(x) {
        return (Math.random() * 0.4 + 0.8) * x;
    }

    $(document).ready(() => {
        // If this is just the auth page we fell through to, then do nothing.
        if (location.href == authReloadLanding) {
            console.log("Attempted re-authentication.");
            return;
        }

        var params = new URLSearchParams(window.location.search);
        console.log("params:", params, "win.loc.search", window.location.search);
        if (params.get('autosavetimer')) {
            pollRate = params.get('autosavetimer') * 1000;
        } else {
            console.log("This wasn't supposed to run.");
            return;
        }
        sourcePage = window.location.href;
        sourcePage = window.location.href.replace('autosavetimer=', '_junk=');
        const newbody = `<body>
                <iframe id="real_content" title="my-inline-frame" width="100%" height="90%" src="${sourcePage}"> iframe body </iframe>
                <div id="logmessage"></div>
                </body>`;
        document.body.innerHTML = newbody;

        statusBufferID = top.document.getElementById("logmessage");
        realContentID = top.document.getElementById("real_content");

        setTimeout(retryMissedDownloads, downloadTimeout);

        lastReload = Date.now();
        reloadTimerID = setTimeout(rescan, jitter(5000));

        logger("Automatic image downloader is active.");
    });

    window.addEventListener('beforeunload', function(event) {
        if (reloadTimerID) {
            clearTimeout(reloadTimerID);
            reloadTimerID = null;
        }
        if (activeDownloads > 0) {
            event.preventDefault();
            event.renertValue = "";
            return "Downloads are still in progress; wait a second...";
        }
    });

    GM_registerMenuCommand("Recheck missed downloads", function() {
        const count = retryMissedDownloads();
        if (count > 0) {
            logger("rescheduled " + count + " downloads");
        } else {
            logger("nothing to do");
        }
    });

    function getKnownImages() {
        var result = [];
        for (const key of GM_listValues()) {
            if (key.startsWith(tagPrefix + "_info_")) {
                const value = GM_getValue(key);
                var img = new Image(value);
                if (img) {
                    result.push(img);
                } else {
                    console.log("problem with GM_getValue:", key, value);
                }
            }
        }
        return result;
    }

    GM_registerMenuCommand("Clean up expired records", function() {
        const images = getKnownImages();
        var expired = [];
        for (const img of images) {
            if (Date.now() - img.stamp > recordExpiryTime) {
                expired.push(img);
                GM_deleteValue(img.infoTag);
                GM_deleteValue(img.busyTag);
            }
        }
        if (expired.length > 0) {
            logger("Found " + expired.length + " old files");
            saveImageLog(expired);
        } else {
            logger("nothing to do");
        }
    });

    GM_registerMenuCommand("Download all records", function() {
        // You could just copy-paste this out of the Tampermonkey storage tab.
        const images = getKnownImages();
        if (images.length > 0) {
            saveImageLog(images);
        } else {
            logger("nothing to do");
        }
    });

    function retryMissedDownloads() {
        const images = getKnownImages();
        var retries = [];
        for (const img of images) {
            if (img.isReady) retries.push(img);
        }
        scheduleDownloads(retries, 100);
        return retries.length;
    }

    function rescan() {
        reloadTimerID = null;
        logger("Rescanning...");
        if (activeDownloads > 0) {
            logger("There are " + activeDownloads + " already outstanding.");
        }

        var delay = 100;
        var content = $(realContentID).contents();
        var imagelist = $(content.find(downloadables).get());
        { /* canonicalise and de-dup */
            let imageset = new Map();
            for (let img of imagelist) {
                img = new Image(img);
                imageset.set(img.id, img);
            }
            imagelist = Array.from(imageset.values());
        }
        logger("found " + imagelist.length + " candidate images");
        if (imagelist.length < 10) {
            console.log("Scan buffer doesn't have many images.  Is something wrong?");
            if (loadErrors == 0) {
                console.log("all images:", content.find("img").get().reverse());
            }
            incLoadErrors();
        } else {
            closeauthwindow();
            loadErrors = 0;
        }

        delay += scheduleDownloads(imagelist, delay);
        updateSource(imagelist);

        if (activeDownloads == 0) {
            logger(null);
        }
        realContentID.contentWindow.location.reload();
        lastReload = Date.now();
        if (reloadTimerID) clearTimeout(reloadTimerID);
        reloadTimerID = setTimeout(rescan, jitter(pollRate) + delay);
    }

    function incLoadErrors() {
        if (loadErrors > 0) {
            logger("previous failures: " + loadErrors);
        }
        loadErrors++;
        if (loadErrors > 3) {
            reauthenticate();
            loadErrors = 1;
        }
    }

    function closeauthwindow() {
        if (reauthWindowID) {
            console.log("closing old re-auth window");
            reauthWindowID.close();
            reauthWindowID = null;
        }
        return true;
    }

    function reauthenticate() {
        if (reauthWindowID && Date.now() - lastReauth < 600000) {
            console.log("too soon to try reauthenticating");
            return false;
        } else {
            closeauthwindow();
            // TODO: determine this link automatically
            var reauthLink = reauthPrefix +
                "&return_url=" + encodeURIComponent(authReloadLanding);
            // really want the return_url to be something that lets us close the window, but I don't know how to do that.
            console.log("Loading re-authentication link:", reauthLink);
            reauthWindowID = GM_openInTab(reauthLink, { insert: true });
            if (reauthWindowID) {
                lastReauth = Date.now();
            } else {
                console.log("reauth failed");
            }
            return true;
        }
    }

    function scheduleDownloads(images, initialDelay) {
        var delay = initialDelay;
        for (const img of images) {
            if (img.scheduleDownload(delay)) {
                delay += jitter(downloadInterval);
            }
        }
        return delay - initialDelay;
    }

    function updateSource(images) {
        var refs = [];
        for (const img of images) {
            if (img.ref) refs.push(img.ref);
        }
        if (refs.length > 40) {
            refs.sort();
            // Pick another base URL from which to scan for updates,
            // in case the initial one eventually expires.
            // Taking the middle of a sorted list minimises the risk
            // of accidentally picking up an outlier that doesn't fit
            // the pattern.
            var middleref = refs[Math.floor(refs.length / 2)];
            // TODO: do something with this information
        }
    }

    function findRootElement(start) {
        const images = $(start).find(downloadables);
        const limit = Math.max(Math.floor(images.length * 2 / 3), 5);
        console.log('looking for container of at least', limit, 'images out of', images.length);
        var pop = new Map;
        for (let elem of images) {
            while (elem) {
                const count = $(elem).find(downloadables).length;
                if (count >= limit) {
                    if (!elem.id) {
                        console.log("element has no id:", elem);
                        // Or faff around with some kind of getPath() method
                    } else {
                        pop.set(elem, (pop.get(elem) ?? 0) + 1);
                        break;
                    }
                }
                elem = elem.parentElement;
            }
        }
        let best = 0;
        let root = null;
        for (const [elem, count] of pop) {
            if (best < count) {
                root = elem;
                best = count;
            }
        }
        console.log("root found:", root);
        if (root == null) return root;

        // Walk up the tree until we find an id that looks plausible.
        while (root && !(root.id && root.id.match(rootTagId))) {
            console.log("element id looks sus:", root.id);
            root = root.parentElement;
            console.log("switched to:", root);
        }
        // if (root == null) {
        //     console.log("can't find suitable element");
        //     root = document.createElement("div");
        //     root.setAttribute("id", "girrc"); // It used to be called this?
        //     root.setAttribute("hidden", "");
        //     document.body.append(root);
        // }
        return root;
    }

    function saveImageLog(images) {
        const json = JSON.stringify(images, function(k, v) {
            if (k == 'stamp') return new Date(v).toJSON();
            return v;
        }, 2);
        const blob = encodeURIComponent(json);
        const data = "data:application/json;charset=UTF-8," + blob;
        GM_download({
            url: data,
            name: "image_downloads.txt",
            saveAs: true,
            conflictAction: "uniquify",
            onload: function() {
                console.log("saved images");
            },
            onerror: function(e) {
                console.log("error saving log:", e);
            },
            ontimeout: function(e) {
                console.log("timeout saving log:", e);
            }
        });
    }

    function logger(text) {
        if (statusTimeoutID) {
            statusBufferID.innerHTML = "";
            clearTimeout(statusTimeoutID);
            statusTimeoutID = null;
        }
        if (text) {
            statusBufferID.innerHTML += "<p>" + text + "</p>";
        } else {
            statusTimeoutID = setTimeout(function() {
                statusBufferID.innerHTML = "";
                statusTimeoutID = null;
            }, 20000);
        }
    }

    class Image {
        #element = null;
        constructor(img) {
            this.stamp = Date.now();
            this.done = false;
            if ('stamp' in img && 'id' in img && 'url' in img) {
                Object.assign(this, img);
                if (!(this.id && this.url && this.ref)) {
                    return undefined;
                }
            } else {
                this.url = get_download_url(img);
                this.id = get_img_id(this.url);
                this.ref = get_href(img);
                this.alt = img.getAttribute("alt", null);
                this.#element = img;
            }
            if (!this.isSaved) {
                // TODO: race condition where successful download might be forgotten.
                GM_setValue(this.infoTag);
            }
        }
        get element() {
            return this.#element;
        }
        get filename() {
            const src_filename = this.id;
            const pageid = get_page_id(this.ref) || "page";
            const desc = get_page_prompt(this.ref) || this.alt || "image";

            return filenamePrefix + this.id + "_" + pageid + "_" + desc + ".jpg";
        }
        scheduleDownload(delay) {
            if (!this.setBusy()) return false;
            logger("downloading: " + this.filename);
            setTimeout(function() {
                const download = GM_download({
                    url: this.url,
                    name: this.filename,
                    saveAs: false,
                    conflictAction: "uniquify",
                    onload: function() {
                        this.setSaved();
                    }.bind(this),
                    onerror: function(e) {
                        logger("error downloading: " + this.filename, e);
                        this.clearBusy();
                    }.bind(this),
                    ontimeout: function(e) {
                        logger("timeout downloading: " + this.filename, e);
                        this.clearBusy();
                    }.bind(this)
                });
            }.bind(this), delay);
            return true;
        }
        get infoTag() { return tagPrefix + "_info_" + this.id; }
        get busyTag() { return tagPrefix + "_busy_" + this.id; }
        setBusy() {
            if (!this.isReady) return false;
            GM_setValue(this.busyTag, Date.now());
            activeDownloads++;
            return true;
        }
        clearBusy() {
            GM_deleteValue(this.busyTag);
            activeDownloads--;
            if (activeDownloads == 0) {
                logger(null);
            } else if (activeDownloads < 0) {
                logger("Oops, download count underflow!");
                activeDownloads = 0;
            }
        }
        setSaved() {
            this.done = true;
            GM_setValue(this.infoTag, this);
            this.clearBusy();
        }
        get isSaved() {
            const stored = GM_getValue(this.infoTag) || this;
            this.done = stored.done;
            if (this.done) GM_deleteValue(this.busyTag);
            return this.done;
        }
        get isReady() {
            if (this.isSaved) return false;
            const stamp = GM_getValue(this.busyTag, null);
            if (!stamp) return true;
            if (Date.now() - stamp > downloadTimeout) {
                console.log("file has been busy too long (lost event?): " + this.id);
                GM_deleteValue(this.busyTag);
                return true;
            }
            console.log("download already scheduled:", this.id);
            return false;
        }
    }

    // sample: https://tse4.mm.bing.net/th?id=OIG2.AbCdEfGhIjKlMnOp123.&w=100&h=100&c=6&o=5&pid=ImgGn
    function get_img_id(src) {
        var url = new URL(src);
        var id = url.searchParams.get('id') || url.pathname.split('/').pop();
        if (id == null || id.length < 20) {
            console.log("couldn't parse image id from:", src, " got:", id);
        }
        return id;
    }

    // sample: /images/create/kebab-case-prompt/1-0123456789abcedf0123456789abcdef?FORM=GUH2CR
    //         https://copilot.microsoft.com/images/create?q=prompt%20with%20spaces&rt=4&FORM=GENCRE&id=1-0123456789abcedf0123456789abcdef
    function get_page_id(ref) {
        var url = new URL(ref);
        var id = url.searchParams.get('id') || url.searchParams.get('pageId');
        if (id == null) {
            var path = url.pathname.split('/');
            while (path.length && path.shift() != 'create')
                ;
            if (path.length == 2 && path[1].length >= 32) id = path[1];
        }
        if (id == null) {
            console.log("couldn't parse referrer id from:", ref);
        }
        return id;
    }

    // sample: /images/create/kebab-case-prompt/1-0123456789abcedf0123456789abcdef?FORM=GUH2CR
    function get_page_prompt(ref) {
        var url = new URL(ref);
        var q = url.searchParams.get('q');
        if (q == null) {
            var path = url.pathname.split('/');
            while (path.length && path.shift() != 'create')
                ;
            if (path.length == 2 && path[1].length >= 32) q = path[0];
        }
        if (q == null) {
            console.log("couldn't parse referrer prompt from:", ref);
        }
        return q;
    }

    function get_download_url(img) {
      var url = new URL(img.src);
      url.searchParams.delete("w");
      url.searchParams.delete("h");
      url.searchParams.delete("c");
      url.searchParams.delete("o");
      return url.href;
    }

    function get_href(elem) {
        while (elem) {
            if (elem.hasAttribute('href')) return elem.href;
            elem = elem.parentElement;
        }
        return null;
    }
})();
