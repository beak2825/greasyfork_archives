// ==UserScript==
// @name        BT Crossposter
// @description Modifies torrent hashes on-the-fly
// @namespace   BlackNullerNS
// @include     http*://baconbits.org/upload.php*
// @include     http*://waffles.fm/upload.php*
// @include     http*://bibliotik.org/upload*
// @include     https://tls.passthepopcorn.me/upload.php*
// @include     http://passthepopcorn.me/upload.php*
// @version     0.1
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_removeValue
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/13017-rusha/code/Rusha.js?version=79777
// @require     https://greasyfork.org/scripts/13016-bencode-encoder-decoder/code/Bencode%20encoderdecoder.js?version=79776
// @downloadURL https://update.greasyfork.org/scripts/13019/BT%20Crossposter.user.js
// @updateURL https://update.greasyfork.org/scripts/13019/BT%20Crossposter.meta.js
// ==/UserScript==

var trackers = {
    "baconbits.org": {
        getDomain: function () {
            return "baconbits.org";
        },
        isUploadForm: function(){
            return document.location.href.indexOf("://baconbits.org/upload.php") > -1;
        },
        fieldMapping: {
            artist: "author",
            bitrate: "encoding",
            remaster: function(data){
                return !!data.releaseTitle;
            },
            remaster_year: "releaseYear",
            remaster_title: "releaseTitle",
            album_desc: function(data){
                return ("contentInfo" in data && data.contentInfo) ? htmlToBBCode(data.contentInfo) : "";
            },
            release_desc: function(data){
                var desc = ("description" in data && data.description) ? htmlToBBCode(data.description) + "\n" : "";

                for (var i = 0; i < data.log.length; i++) {
                    desc += "[spoiler=LOG][pre]" + data.log[i] + "[/pre][/spoiler]\n";
                }

                desc = desc.trim();

                return desc;
            },
            desc: function(data){
                return (this.album_desc(data) + "\n" + this.release_desc(data)).trim();
            }
        },
        acceptedFormFillers: [
            "what.cd"
        ],
        onDataLoad: function(form, view, data, autoFill){
            if ("category" in data) {
                if (form.elements["type"].value !== data.category) {
                    if (!autoFill) {
                        alert("Select the " + data.category + " category first");
                    }
                    return false;
                }
            }

            if ("media" in data && data.media === "WEB") {
                data.media = "Web";
            }

            return true;
        },
        onFormFill: function(form){
            var fillBtn = form.querySelector("input#autofill");
            if (fillBtn) {
                fillBtn.click();
            }
        },
        onSubmit: function(response){
            if (response.responseText.indexOf('<p style="color: red;text-align:center;">') > -1) {
                var message = response.responseText.split('<p style="color: red;text-align:center;">')[1].split("</p>")[0];
                alert(message);
                return false;
            }

            return true;
        }
    },
    "waffles.fm": {
        getDomain: function() {
            return "waffles.fm";
        },
        isUploadForm: function(){
            return document.location.href.indexOf("://waffles.fm/upload.php") > -1;
        },
        fieldMapping: {
            type: function(data, select){
                if (!("tags" in data)) {
                    return 0;
                }

                var i, n;
                var tags = data.tags.map(function(tag){
                    return tag.replace(/[\.\-]/g, " ").toUpperCase();
                });
                var val, tagsLen = tags.length;

                for (n = 0; n < tagsLen; n++) {
                    for (i = 0, l = select.length; i < l; i++) {
                        val = select.options[i].text.toUpperCase().replace(/[\.\-]/g, " ");
                        if (val === tags[n]) {
                            return select.options[i].value;
                        }
                    }
                }

                return 0;
            },
            album: function(data){
                var album = data.title;

                if (data.releaseTitle) {
                    album += " (" + data.releaseTitle;
                    if (data.releaseYear && data.releaseYear !== data.year) {
                        album += ", " + data.releaseYear;
                    }
                    album += ")";
                }

                return album;
            },
            artist: "author",
            bitrate: function(data){
                return data.encoding.replace(" (VBR)", "");
            },
            vbrBool: function(data){
                return data.encoding.indexOf("VBR") > -1;
            },
            va: function(data){
                return data.author === "Various Artists";
            },
            sceneBool: "scene",
            logBool: function(data){
                return data.log.length > 0;
            },
            transCheck: function(data){
                return true;
            },
            descr: function(data){
                var desc = [];
                if ("image" in data && data.image) {
                    desc.push("[img]" + data.image + "[/img]");
                }
                if ("contentInfo" in data && data.contentInfo) {
                    desc.push(htmlToBBCode(data.contentInfo).trim());
                }
                if ("description" in data && data.description) {
                    desc.push(htmlToBBCode(data.description).trim());
                }

                desc = desc.join("\n\n");
                desc = desc.replace(/\[#]/g, "[*]");

                return desc;
            }
        },
        acceptedFormFillers: [
            "what.cd"
        ],
        logFiles: [],
        findRelated: function(view, data){
            var query = data.author + " " + data.title + " " + data.format;
            query = query.trim();

            var searchUrl = "https://waffles.fm/browse.php?q=" + encodeURIComponent(query);

            var relatedUploads = document.getElementById("crossposter-related");

            if (!relatedUploads) {
                relatedUploads = document.createElement("tr");
                relatedUploads.id = "crossposter-related";
                var leftCol = document.createElement("td");
                leftCol.style.textAlign = "right";
                leftCol.style.fontWeight = "bold";
                leftCol.style.verticalAlign ="top";

                var searchLink = document.createElement("a");
                searchLink.textContent = "Related uploads";
                searchLink.setAttribute("href", searchUrl);
                searchLink.setAttribute("target", "_blank");

                leftCol.appendChild(searchLink);

                var rightCol = document.createElement("td");
                rightCol.textContent = "Searching...";
                relatedUploads.appendChild(leftCol);
                relatedUploads.appendChild(rightCol);

                view.renderRow.parentNode.insertBefore(relatedUploads, view.renderRow.nextElementSibling);
            }

            GM_xmlhttpRequest({
                url: searchUrl,
                method: "GET",
                onload: function(response){
                    if (response.responseText.indexOf("download.php") === -1) {
                        rightCol.innerHTML = '<a href="' + searchUrl + '" target="_blank">No similar uploads found</a>';
                        return;
                    }

                    var dom = document.createElement("div");
                    dom.insertAdjacentHTML("afterbegin", response.responseText.replace(/<img /g, '<meta '));

                    var link, rows = dom.querySelectorAll("#browsetable tr");

                    if (rows.length < 2) return;

                    rightCol.textContent = "";
                    for (var i = 1; i < rows.length; i++) {
                        link = rows.item(i).querySelector("a[href*='details.php']");
                        if (!link) continue;
                        link.setAttribute("target", "_blank");
                        rightCol.appendChild(link);
                        rightCol.appendChild(document.createElement("br"));
                    }
                }
            });
        },
        logRow: null,
        onDataLoad: function(form, view, data, autoFill){
            if (!this.logRow) {
                this.logRow = view.renderRow.nextElementSibling;
            }

            if ("log" in data && data.log.length > 0) {
                this.logFiles = data.log;
                var logInfo = document.getElementById("imported-logs");
                if (!logInfo) {
                    logInfo = document.createElement("div");
                    logInfo.id = "imported-logs";
                    view.renderElement.appendChild(logInfo);
                    this.logRow.style.display = "none";
                }
                logInfo.innerHTML = "Attached <b>" + this.logFiles.length + " LOG file"+ (this.logFiles.length > 1 ? "s" : "") +"</b> ";

                var removeLink = document.createElement("a");
                removeLink.textContent = "[remove]";
                removeLink.setAttribute("href", "javascript:void(0);");
                var tracker = this;
                removeLink.onclick = function(){
                    tracker.logFiles = [];
                    logInfo.parentNode.removeChild(logInfo);
                    tracker.logRow.style.display = "";
                };

                logInfo.appendChild(removeLink);
            }

            if ("media" in data && data.media === "WEB") {
                data.media = "Web";
            }

            this.findRelated(view, data);

            return true;
        },
        onFormReset: function(){
            this.logFiles = [];
            var logInfo = document.getElementById("imported-logs");
            if (logInfo) {
                logInfo.closest("tr").nextElementSibling.style.display = "";
                logInfo.parentNode.removeChild(logInfo);
            }
            var relatedUploads = document.getElementById("crossposter-related");
            if (relatedUploads) {
                relatedUploads.parentNode.removeChild(relatedUploads);
            }
        },
        hasAttachedFiles: function(self){
            return self.logFiles.length > 0;
        },
        onFormData: function(self, form, formData, torrent){
            if (self.logFiles.length > 0) {
                var logBlob, tName;
                for (var i = 0, l = self.logFiles.length; i < l; i++) {
                    logBlob = new Blob([ "\ufeff" + self.logFiles[i] ], {type : "text/plain"});
                    tName = (torrent ? torrent.getName() + " " : "") + i + ".log";
                    if (i === 0) {
                        formData.set("logfile[]", logBlob, tName);
                    } else {
                        formData.append("logfile[]", logBlob, tName);
                    }
                }
            }
        },
        onFormFill: function(form, data){
            var yadg = document.getElementById("yadg_input");
            if (yadg) {
                var yadg_src = document.getElementById("yadg_scraper");
                if (yadg_src) {
                    yadg.value = 'artist:"' + data.author + '" AND release:"' + data.title + '"';
                    yadg_src.value = "musicbrainz";
                } else {
                    yadg.value = data.author + " " + data.title;
                }
                var yadg_submit = document.getElementById("yadg_submit");
                if (yadg_submit) {
                    yadg_submit.click();
                }
            }
        },
        onSubmit: function(response){
            if (response.finalUrl) {
                if (response.finalUrl.indexOf("/takeupload.php") > -1) {
                    alert("Fill all required fields");
                    return false;
                }
            }

            return true;
        }
    },
    "passthepopcorn.me": {
        getDomain: function() {
            return "passthepopcorn.me";
        },
        isUploadForm: function(){
            return document.location.href.indexOf("passthepopcorn.me/upload.php") > -1;
        },
        acceptedFormFillers: []
    },
    "bibliotik.org": {
        getDomain: function() {
            return "bibliotik.org";
        },
        isUploadForm: function(){
            return document.location.href.indexOf("bibliotik.org/upload") > -1;
        },
        onSubmit: function(response, form){
            if (response.responseText.indexOf('<ul id="formerrorlist">') > -1) {
                var message = response.responseText.split('<ul id="formerrorlist">')[1].split("</ul>")[0];
                message = message.replace(/<li>/g, "").replace(/<\/li>/g, "\n");
                alert(message);
                //var submit = form.querySelector("input[type=submit]");
                //if (submit) {
                //    submit.removeAttribute("disabled");
                //}
                return false;
            }

            return true;
        },
        fieldMapping: {
            TitleField: "title",
            AuthorsField: "author",
            PublishersField: "publisher",
            IsbnField: "catalogNumber",
            PagesField: "pages",
            YearField: "year",
            TagsField: "tags",
            ImageField: "image",
            DescriptionField: function(data){
                return (("contentInfo" in data ? htmlToBBCode(data.contentInfo) : "") + "\n" + ("description" in data ? htmlToBBCode(data.description) : "")).trim();
            },
            FormatField: "format"
        }
    },
    "what.cd": {
        getDomain: function() {
            return "what.cd";
        },
        getFormData: function(torrent, torrentUrl, autoFill){
            var url = "https://what.cd/ajax.php?action=torrent&hash=" + torrent.getOriginalHash();

            console.log(url);

        	var response = GM_xmlhttpRequest({
        		url: url,
        		method: "GET",
                synchronous: true,
        		onerror: function(response){
                    if (!autoFill) {
                        alert('What.CD request error!');
                    }
        		},
        		timeout: 7000,
        		ontimeout: function(response){
                    if (!autoFill) {
                        alert('What.CD request timed out!');
                    }
        		}
        	});

            try {
                var data = JSON.parse(response.responseText);

                if (data.status !== "success") {
                    if (!autoFill) {
                        alert('Release not found!');
                    }
                    console.log(data);
                    return null;
                }

                var author = "", r = data.response;

                if (r.group.musicInfo) {
                    if (r.group.musicInfo.artists.length > 2) {
                        author = 'Various Artists';
                    } else if (r.group.musicInfo.artists.length === 2) {
                        author = decodeHTML(r.group.musicInfo.artists[0].name) + ' & ' + decodeHTML(r.group.musicInfo.artists[1].name);
                    } else {
                        author = decodeHTML(r.group.musicInfo.artists[0].name);
                    }
                }

                var result = {
                    link: "https://what.cd/torrents.php?id=" + r.group.id + "&torrentid=" + r.torrent.id,
                    title: decodeHTML(r.group.name),
                    author: author,
                    category: r.group.categoryName,
                    image: r.group.wikiImage,
                    contentInfo: decodeHTML(r.group.wikiBody),
                    format: r.torrent.format,
                    encoding: r.torrent.encoding,
                    media: r.torrent.media,
                    year: r.group.year,
                    publisher: decodeHTML(r.group.recordLabel),
                    catalogNumber: decodeHTML(r.group.catalogueNumber),
                    description: decodeHTML(r.torrent.description),
                    tags: r.group.tags,
                    scene: r.torrent.scene,
                    releaseYear: r.torrent.remasterYear,
                    releaseTitle: decodeHTML(r.torrent.remasterTitle),
                    log: []
                };

                if (r.torrent.hasLog) {
                    var logUrl = 'https://what.cd/torrents.php?action=viewlog&torrentid='+ r.torrent.id +'&groupid=' + r.group.id;
                	var logResponse = GM_xmlhttpRequest({
                		url: logUrl,
                		method: 'GET',
                        synchronous: true,
                		timeout: 7000
                	});
                    if (logResponse.responseText.indexOf('log_file') !== -1) {
                        var dom = document.createElement("div");
                        dom.insertAdjacentHTML("afterbegin", logResponse.responseText.replace(/<img /g, '<meta '));
                        var logs = dom.getElementsByClassName("log_file");

                        if (logs.length > 0) {
                            for (var i = 0, l = logs.length; i < l; i++) {
                                result.log.push(decodeHTML(logs.item(i).textContent));
                            }
                        }
                    }
                }

                return result;

            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }
    /*
     "broadcasthe.net": {
     getDomain: function() {
     return "broadcasthe.net";
     },
     getFormData: function(torrent, torrentUrl){
     var id = torrentUrl.split("&id=")[1].split("&")[0];
     if (!id) return [];

     var response, apiKey = GM_getValue("btn_api_key", "");

     if (apiKey === "" || apiKey.length !== 32) {
     response = GM_xmlhttpRequest({
     url: "https://broadcasthe.net/user.php?action=edit",
     method: "GET",
     synchronous: true,
     timeout: 7000
     });

     if (response.responseText && response.responseText.indexOf('id="apikey" value="') > -1) {
     apiKey = response.responseText.split('id="apikey" value="')[1].split('"')[0];

     if (apiKey === "" || apiKey.length !== 32) {
     return;
     }

     GM_setValue("btn_api_key", apiKey);
     } else {
     return;
     }
     }

     var data = {
     method: "getTorrents",
     params: [apiKey, {
     "id": id
     },
     50
     ],
     id: Date.now()
     };

     response = GM_xmlhttpRequest({
     method: "POST",
     url: "http://api.btnapps.net/",
     synchronous: true,
     headers: {
     'Content-Type': 'application/json'
     },
     data: JSON.stringify(data)
     });

     try {
     data = JSON.parse(response.responseText);

     if (!data || !("result" in data) || !("torrents" in data.result) || !(id in data.result.torrents)) {
     return;
     }

     data = data.result.torrents[id];

     var source = data.Source === "Unknown" ? "" : data.Source + " / ";

     return {
     category: "TV",
     title: data.Series + " " + (data.Category === "Season" ? "- " : "") + data.GroupName + " [" + source + data.Codec + " / AUDIO / " + data.Container + " / " + data.Resolution + "]",
     image: data.SeriesPoster,
     scene: data.Origin === "Scene"
     }

     } catch (e) {}
     }
     },
     */
};

var rusha = new Rusha();

var UploadForm = function(tracker)
{
    var self = this;
    var fileInput = document.querySelector("input[type=file]");

    if (!fileInput) {
        console.log("File input not found.");
        return;
    }

    self.input = fileInput;
    self.form = self.input.closest("form");
    self.torrent = null;
    self.torrentUrl = null;
    self.tracker = tracker;
    self.formView = new FormView(self.input);
    self.modifyDisabled = GM_getValue("hash_mod_disabled", []);
    self.autoFill = GM_getValue("autofill", true);

    fileInput.onchange = function(ev) {
        if (ev.target.files[0].name.toLowerCase().indexOf(".torrent") === -1) {
            self.resetState();
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            self.addTorrent(e.target.result);
        };
        reader.readAsBinaryString(ev.target.files[0]);
    };

    self.addTorrent = function(binaryString)
    {
        try {
            self.resetState();
            self.render(new Torrent(binaryString));
        } catch (e) {
            console.log(e);
            self.resetState();
        }
    };

    self.passTorrent = function()
    {
        var metalink = document.getElementById("crossposter-torrent");
        if (!metalink || !metalink.getAttribute("torrent-url")) return;

        GM_xmlhttpRequest({
            url: metalink.getAttribute("torrent-url"),
            method: 'GET',
            timeout: 10000,
            synchronous: true,
            responseType: "arraybuffer",
            onload: function(response){
                var str = '';
                var data_str = new Uint8Array(response.response);
                for (var i = 0, l = data_str.length; i < l; ++i) {
                    str += String.fromCharCode(data_str[i]);
                }
                self.torrentUrl = self.finalUrl;
                self.addTorrent(str, true);
            }
        });
    };

    document.addEventListener('DOMContentLoaded', self.passTorrent, false);

    self.toggleAutofill = function(){
        self.autoFill = !self.autoFill;
        GM_setValue("autofill", self.autoFill);
        alert("Autofill " + (self.autoFill ? "enabled" : "disabled"));
    };

    GM_registerMenuCommand("BT Crossposter: Toggle autofill", self.toggleAutofill);

    self.render = function(torrent) {
        if (!self.isValidTorrent(torrent) || !self.formView.render()) {
            return self.resetState();
        }

        var view = self.formView;

        var domain = torrent.getTrackerId();

        view.setName(torrent.getName());
        view.setSource(domain);

        var trackerDomain = self.tracker.getDomain();

        view.modify.checked = self.modifyDisabled.indexOf(trackerDomain) === -1;

        view.modify.onchange = function(){
            if (this.checked) {
                torrent.changeHash();

                var announceUrl = "";
                if ("getAnnounceUrl" in self.tracker) {
                    announceUrl = self.tracker.getAnnounceUrl();
                } else {
                    var announceInput = document.querySelector("input[value*='/announce']");
                    if (announceInput) {
                        announceUrl = announceInput.value;
                    }
                }

                if (announceUrl) {
                    torrent.setAnnounceUrl(announceUrl);
                    view.showDownloadLink(torrent.getDownloadLink());
                } else {
                    view.showDownloadLink();
                }

                self.torrent = torrent;
                var pos = self.modifyDisabled.indexOf(trackerDomain);
                if (pos !== -1) {
                    self.modifyDisabled.splice(pos, 1);
                }
                this.parentNode.style.color = "green";
                //view.inputRow.style.display = "none";
            } else {
                view.hideDownloadLink();
                self.resetState(true);
                if (self.modifyDisabled.indexOf(trackerDomain) === -1) {
                    self.modifyDisabled.push(trackerDomain);
                }
                this.parentNode.style.color = "red";
            }
            if (self.torrentUrl) {
                this.setAttribute("disabled", "1");
            } else {
                this.removeAttribute("disabled");
            }
            GM_setValue("hash_mod_disabled", self.modifyDisabled);
        };

        view.modify.onchange();

        if (torrent.getTrackerId() in trackers && 'getFormData' in trackers[torrent.getTrackerId()] && (!("acceptedFormFillers" in self.tracker) || self.tracker.acceptedFormFillers.indexOf(torrent.getTrackerId()) !== -1)) {
            var autoFill = true;
            var fillFormText = "Autofill";
            var fillBtn = view.showFillButton(
                fillFormText,
                function(e){
                    e.preventDefault();
                    this.setAttribute("disabled", "1");
                    this.textContent = "Requesting " + domain;
                    self.fillForm(torrent, autoFill);
                    this.removeAttribute("disabled");
                    this.textContent = fillFormText;
                    return false;
                }
            );

            if (self.autoFill) {
                fillBtn.click();
            }

            autoFill = false;
        } else {
            view.hideFillButton();
        }

    };

    self.fillForm = function(torrent, autoFill){
        if (!torrent || !(torrent.getTrackerId() in trackers) || !('getFormData' in trackers[torrent.getTrackerId()])) {
            return;
        }

        var data = trackers[torrent.getTrackerId()].getFormData(torrent, self.torrentUrl, autoFill);

        if (data) {
            var form = self.form,
                map = "fieldMapping" in self.tracker ? self.tracker.fieldMapping : {};

            if ("link" in data && data.link) {
                self.formView.setName('<a href="' + data.link +'" target="_blank">' + torrent.getName() + '</a>');
            }

            if ("onDataLoad" in self.tracker) {
                if (!self.tracker.onDataLoad(form, self.formView, data, autoFill)) {
                    return;
                }
            }

            for (var i = 0, l = form.elements.length, el, key, val; i < l; i++) {
                el = form.elements.item(i);

                if (!el.getAttribute("name")) {
                    continue;
                }

                key = el.name in map ? map[el.name] : el.name;
                val = (key instanceof Function) ? key(data, el) : (key in data ? data[key] : null);

                if (val !== null) {
                    if (el.type === "checkbox") {
                        if (val) {
                            if (!el.checked) {
                                el.click();
                            }
                        } else if (el.checked) {
                            el.click();
                        }
                    } else {
                        el.value = Array.isArray(val) ? val.join(", ") : val;

                        if ("onchange" in el) {
                            try {
                                el.onchange();
                            } catch (e) {}
                        }
                    }
                }
            }

            if ("onFormFill" in self.tracker) {
                self.tracker.onFormFill(self.form, data, torrent);
            }
        }
    };

    self.isValidTorrent = function(torrent) {
        return (torrent instanceof Torrent && torrent.getTrackerId() !== tracker.getDomain());
    };

    self.resetState = function(onlyTorrent) {
        if (!onlyTorrent) {
            self.formView.reset();
            if ("onFormReset" in self.tracker) {
                self.tracker.onFormReset();
            }
        }

        //if (self.formView.inputRow) {
        //    self.formView.inputRow.style.display = "";
        //}

        self.torrent = null;
        self.torrentUrl = null;

        return false;
    };

    self.onSubmit = function (e) {
        if (!self.torrent && (!("hasAttachedFiles" in self.tracker) || !self.tracker.hasAttachedFiles(self.tracker))) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        var form = e.target;
        var formData = new FormData(form);

        var submit = form.querySelector("[type=submit]") || document.createElement("input");
        submit.setAttribute("disabled", "1");

        if (self.torrent) {
            formData.set(self.input.name, self.torrent.getBlob(), self.torrent.getName() + ".torrent");
        }

        if ("onFormData" in self.tracker) {
            self.tracker.onFormData(self.tracker, form, formData, self.torrent);
        }

        GM_xmlhttpRequest({
            url: form.getAttribute("action") ? form.getAttribute("action") : document.location.href,
            method: "POST",
            synchronous: true,
            data: formData,
            onerror: function(){
                alert("Request error");
                submit.removeAttribute("disabled");
            },
            timeout: 15000,
            ontimeout: function(){
                alert("Request timed out");
                submit.removeAttribute("disabled");
            },
            onload: function(response){
                submit.removeAttribute("disabled");

                if (response.finalUrl) {
                    if ("onSubmit" in self.tracker) {
                        if (!self.tracker.onSubmit(response, form)) {
                            return;
                        }
                    }

                    if (response.finalUrl !== document.location.href) {
                        document.location.href = response.finalUrl;
                        return;
                    }

                    alert("Fill all required fields");
                    return;
                }

                alert("Request error");
            }
        });

        return false;
    };

    self.form.addEventListener("submit", self.onSubmit);
};

var FormView = function(fileInput)
{
    var view = this;
    view.input = fileInput;
    view.inputRow = null;
    view.renderRow = null;

    view.reset = function(){
        view.renderElement = null;
        view.modify = null;
        view.source = null;
        view.hashes = null;
        view.download = null;
        view.fillBtn = null;
        view.torrentName = null;

        if (view.renderRow) {
            view.renderRow.parentNode.removeChild(view.renderRow);
            view.renderRow = null;
        }
    };

    view.render = function(){
        if (view.renderElement) {
            return view.renderElement;
        }

        var isTable = view.input.parentNode.parentNode.tagName === "TR";

        view.inputRow = isTable ? view.input.parentNode.parentNode : view.input;
        if (!view.inputRow) return null;

        view.renderElement = document.createElement(isTable ? "td" : "div");
        view.renderElement.innerHTML = '<b>Loaded torrent:</b> <span></span> (<span></span>)<br><label style="cursor:pointer;"><input type="checkbox" id="enable-crossposter" style="vertical-align:middle;position:relative;bottom:1px;"> Change hash</label>';

        view.torrentName = view.renderElement.firstElementChild.nextElementSibling;
        view.source = view.torrentName.nextElementSibling;
        view.modify = view.source.nextElementSibling.nextElementSibling.firstElementChild;

        if (isTable) {
            var table = view.inputRow.parentNode;
            if (!table) return null;

            var leftCol = document.createElement("td");
            leftCol.insertAdjacentHTML("afterbegin", "<b>BT Crossposter</b>");

            view.renderRow = document.createElement("tr");
            view.renderRow.appendChild(leftCol);
            view.renderRow.appendChild(view.renderElement);
            table.insertBefore(view.renderRow, view.inputRow.nextElementSibling);
        } else {
            view.renderElement.style.paddingBottom = "12px";
            view.input.parentNode.appendChild(view.renderElement);
            view.renderRow = view.renderElement;
        }

        return view.renderElement;
    };

    view.setName = function(name){
        view.torrentName.innerHTML = name;
    };

    view.setSource = function(value){
        if (view.source) {
            view.source.textContent = value;
        }
    };

    view.showDownloadLink = function(link){
        if (view.download) {
            view.hideDownloadLink();
        }

        view.download = document.createElement("span");

        if (link) {
            link.textContent = "download modified torrent";

            view.download.appendChild(document.createTextNode(" ("));
            view.download.appendChild(link);
            view.download.appendChild(document.createTextNode(" now or do it after upload)"));
        } else {
            view.download.appendChild(document.createTextNode(" (download the modified torrent after upload)"));
        }

        if (view.modify.parentNode.nextSibling) {
            view.renderElement.insertBefore(view.download, view.modify.parentNode.nextSibling);
        } else {
            view.renderElement.appendChild(view.download);
        }
    };

    view.hideDownloadLink = function(){
        if (view.download) {
            view.download.parentNode.removeChild(view.download);
            view.download = null;
        }
    };

    view.showFillButton = function (text, callback) {
        if (!view.fillBtn) {
            view.fillBtn = document.createElement("button");
            view.fillBtn.textContent = text;
            view.fillBtn.onclick = callback;
            view.fillBtn.style.float = "right";
            view.renderElement.insertBefore(view.fillBtn, view.renderElement.firstChild);
        }

        return view.fillBtn;
    };

    view.hideFillButton = function() {
        if (view.fillBtn) {
            view.fillBtn.parentNode.removeChild(view.fillBtn);
            view.fillBtn = null;
        }
    };

    view.emptyNode = function (node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        return node;
    };

    view.reset();
};

var Torrent = function(binaryString)
{
    var self = this;

    var uniqueStringChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var mimeType = "application/x-bittorrent";

    var data = bencode.decode(binaryString);
    var originalAnnounceUrl = "announce" in data ? data.announce : "";

    var calculateHash = function() {
        return rusha.digestFromBuffer(bencode.encode(data.info)).toUpperCase();
    };

    var originalHash = calculateHash();
    var hash = originalHash;

    self.getBinary = function() {
        return bencode.encode(data);
    };

    self.getName = function() {
        return decodeURIComponent(escape(data.info.name));
    };

    self.setAnnounceUrl = function(value) {
        data.announce = value;
        return this;
    };

    self.getAnnounceUrl = function() {
        return data.announce;
    };

    self.getOriginalAnnounceUrl = function() {
        return originalAnnounceUrl;
    };

    self.getHash = function() {
        return hash;
    };

    self.getOriginalHash = function() {
        return originalHash;
    };

    var randomString = function (length) {
        var text = "";

        for( var i=0; i < length; i++ ) {
            text += uniqueStringChars.charAt(Math.floor(Math.random() * uniqueStringChars.length));
        }

        return text;
    };

    self.changeHash = function() {
        data.info.private = 1;
        data.info.unique = randomString(30);
        hash = calculateHash();
        return hash;
    };

    self.getDownloadLink = function(text) {
        var a = document.createElement("a");
        a.setAttribute("href", "javascript:void(0);");
        a.textContent = text ? text : hash;
        a.style.cursor = "pointer";
        a.onclick = self.downloadTorrent;

        return a;
    };

    self.downloadTorrent = function(){
        var uri = "data:application/x-bittorrent;base64," + btoa(bencode.encode(data));

        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = self.getName() + ".torrent";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return false;
    };

    self.getTrackerId = function() {
        return originalAnnounceUrl.split('://')[1].split('/')[0].split(':')[0].replace(/^tracker\./, "").replace(/^please\./, "");
    };

    self.getTotalSize = function() {
		var files = data.info.files;
        var size = 0;

		if (files && files instanceof Array) {
			for (var i = 0, file; file = files[i]; i++) {
				if (file.length) {
					size += file.length;
				}
			}
		}

        return size;
    };

    self.getBlob = function() {
        var i, l, array,
            binary = self.getBinary();

        l = binary.length;
        array = new Uint8Array(l);

        for (i = 0; i < l; i++){
            array[i] = binary.charCodeAt(i);
        }

        return new Blob([array], {type: mimeType});
    }
};

var trackerDomains = Object.keys(trackers);

for (var i = 0, l = trackerDomains.length; i < l; i++) {
    if ("isUploadForm" in trackers[trackerDomains[i]] && trackers[trackerDomains[i]].isUploadForm()) {
        new UploadForm(trackers[trackerDomains[i]]);
        break;
    }
}

var decodeHTMLtextArea;
function decodeHTML(encodedString) {
    if (!decodeHTMLtextArea) {
        decodeHTMLtextArea = document.createElement("textarea");
    }
    decodeHTMLtextArea.innerHTML = encodedString;
    return decodeHTMLtextArea.value;
}

function htmlToBBCode(html)
{
    html = html.replace(/<a href="javascript:void\(0\);" onclick="BBCode\.spoiler\(this\);">Show<\/a>/g, '');
    html = html.replace(/<blockquote class="[^"]*?spoiler[^"]*?">([.\s\S]+?)<\/blockquote>/g, "[spoiler]$1[/spoiler]");
    html = html.replace(/<a.*?href="[a-z]+.php\?[^"]+".*?>(.+?)<\/a>/g, "$1");

    html = html.replace(/<a.*?href="([^"]+)".*?>(.+?)<\/a>/g, "[url=$1]$2[/url]");
    html = html.replace(/<img.*?src="([^"]+)".*?>/g, "[img]$1[/img]");
    html = html.replace(/<span class="size(\d+)">(.+?)<\/span>/g, "[size=$1]$2[/size]");
    html = html.replace(/<span style="color: ([^"]+?);">(.+?)<\/span>/g, "[color=$1]$2[/color]");

    html = html.replace(/<ol.*?>(.+?)<\/ol>/g, "[list=1]\n$1[/list]");
    html = html.replace(/<ul.*?>(.+?)<\/ul>/g, "[list]\n$1[/list]");
    html = html.replace(/<li.*?>(.+?)<\/li>/g, "[*]$1\n");

    html = html.replace(/<b>(.+?)<\/b>/g, "[b]$1[/b]");
    html = html.replace(/<strong>(.+?)<\/strong>/g, "[b]$1[/b]");
    html = html.replace(/<i>(.+?)<\/i>/g, "[i]$1[/i]");
    html = html.replace(/<em>(.+?)<\/em>/g, "[i]$1[/i]");
    html = html.replace(/<s>(.+?)<\/s>/g, "[s]$1[/s]");
    html = html.replace(/<u>(.+?)<\/u>/g, "[u]$1[/u]");

    html = html.replace(/\[hide/g, "[spoiler");
    html = html.replace(/\[\/hide\]/g, "[/spoiler]");

    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}