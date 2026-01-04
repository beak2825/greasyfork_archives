// ==UserScript==
// @name         nT-Exporter
// @namespace    https://www.newtumbl.com/
// @version      1.3
// @description  Export content URLs from newTumbl blog
// @author       ceodoe
// @license      GPLv3
// @match        https://*.newtumbl.com/
// @match        https://newtumbl.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=newtumbl.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467744/nT-Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/467744/nT-Exporter.meta.js
// ==/UserScript==

window.setTimeout(function() {
    let nav = document.querySelector("div.nav > ul");
    let dumpBtn = document.createElement("li");
    dumpBtn.innerText = "Export";

    dumpBtn.onclick = function() {
        let urlArray = [];
        let outputString = "";

        let imgs = document.querySelectorAll("img");
        let mediaRegex = new RegExp(/^https:\/\/dn[0-9]\.newtumbl\.com\/img\/[0-9]+\/[0-9]+\/[0-9]\/[0-9]+\/nT_[A-Za-z0-9_]+\.jpg|gif|mp4$/);
        let thumbnailRegex = new RegExp(/(_150|_300|_600)\.(jpg|gif|mp4)$/);
        let avatarRegex = new RegExp(/^https:\/\/dn[0-9]\.newtumbl\.com\/img\/[0-9]+\/0\/0\//);

        for(let i = 0; i < imgs.length; i++) {
            // Ignore avatars
            if(!avatarRegex.test(imgs[i].src)) {
                if(mediaRegex.test(imgs[i].src)) {
                    // Replace thumbnails with full version of the image
                    if(thumbnailRegex.test(imgs[i].src)) {
                        urlArray.push(imgs[i].src.replace(thumbnailRegex, ".$2"));
                    } else {
                        urlArray.push(imgs[i].src);
                    }
                }
            }
        }

        let vids = document.querySelectorAll("video > source");
        for(let i = 0; i < vids.length; i++) {
            if(mediaRegex.test(vids[i].src)) {
                // If video hasn't been played yet, there is a .jpg video thumbnail with the same filename
                // loaded on top of it, which will have been included in the imgs loop, so we remove it

                let vidThumb = vids[i].src.slice(0, -3) + "jpg";
                if(urlArray.includes(vidThumb)) {
                    urlArray.splice(urlArray.indexOf(vidThumb), 1);
                }
                
                urlArray.push(vids[i].src);
            }
        }

        let urlSet = [...new Set(urlArray)];

        if(urlSet.length > 0) {
            for(let i = 0; i < urlSet.length; i++) {
                outputString += urlSet[i] + "\n";
            }
    
            let filePrefix = "newTumbl";
    
            // Are we on....
            if(new RegExp(/^https:\/\/.+\.newtumbl\.com/).test(window.location.href)) {
                // A subdomain? Put blog url in prefix
                filePrefix = window.location.host.split(".")[0];
            } else if(new RegExp(/^https:\/\/newtumbl\.com\/search/).test(window.location.href)) {
                // On the search page? Put search term in prefix
                filePrefix = decodeURIComponent(window.location.hash.substring(3)).replace(" ", "-");
            } else if(new RegExp(/^https:\/\/newtumbl\.com\/blog\//).test(window.location.href)) {
                // On a /blog/ page? Put drafts or queue in prefix
                if(window.location.href.includes("/drafts")) {
                    filePrefix = "drafts";
                } else if(window.location.href.includes("/queue")) {
                    filePrefix = "queue";
                }
            } else if(new RegExp(/^https:\/\/newtumbl\.com\/feed/).test(window.location.href)) {
                // On the feed? Put feed in prefix
                filePrefix = "feed";
            } else if(new RegExp(/^https:\/\/newtumbl\.com\/dashboard/).test(window.location.href)) {
                // On the dashboard? Put dashboard in prefix
                filePrefix = "dashboard";
            }

            let element = document.createElement('a');
            element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(outputString));
            element.setAttribute("download", `${filePrefix}_${GM_info.script.name}-${Date.now()}.txt`);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            alert("Success! " + GM_info.script.name + " found " + urlSet.length + " unique media elements on this page, and saved their URLs to a text file. In order to download the actual media files, feed the downloaded text file into your favourite downloader, such as wget or JDownloader 2.");
        } else {
            alert("No posts found on the current page.");
        }
    };

    nav.append(dumpBtn);
}, 1500);
