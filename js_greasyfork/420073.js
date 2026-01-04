// ==UserScript==
// @name         NTU Kaltura Downloader
// @namespace    https://greasyfork.org/en/users/86284-benjababe
// @version      1.1.9
// @description  Fuck kaltura. It's shit
// @author       Benjababe
// @license      MIT

// @match        https://ntulearn.ntu.edu.sg/webapps/*
// @match        https://ntulearnv.ntu.edu.sg/media/*
// @match        https://ntulearnv1.ntu.edu.sg/media/*
// @match        https://ntulearnv.ntu.edu.sg/playlist/dedicated/*
// @match        https://ntulearnv1.ntu.edu.sg/playlist/dedicated/*
// @match        https://ntulearnv1.ntu.edu.sg/browseandembed/index/media-redirect/entryid/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420073/NTU%20Kaltura%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/420073/NTU%20Kaltura%20Downloader.meta.js
// ==/UserScript==

// jshint esversion: 8
(function () {
    const partnerID = "117";
    const sourceTemplate = `https://api.sg.kaltura.com/p/${partnerID}/sp/${partnerID}00/playManifest/entryId/%ENTRY_ID_HERE%/format/download/protocol/https/flavorParamIds/0`;
    const entryPrefix = "/entry_id/";

    window.onload = () => {
        // regular blackboard page with embedded player
        if (location.pathname.indexOf("/webapps/blackboard/") == 0) {
            genBlackBoard();
        }

        // kaltura single media
        if (location.pathname.includes("/media/t/")) {
            genKPage(false);
        }

        // kaltura playlist
        if (location.pathname.includes("/playlist/dedicated/")) {
            genKPage(true);
        }

        // embedded single video player
        if (location.pathname.includes("/browseandembed/")) {
            genEmbeddedVideo();
        }
    };

    let genBlackBoard = () => {
        console.log("NTU Kaltura Downloader running...");

        genEmbeddedVideos();
        genLinks();
    };

    // generates download button for single video
    const genEmbeddedVideo = () => {
        const iframe = document.querySelector("#kplayer_ifp");
        const regex = /\/browseandembed\/index\/media-redirect\/entryid\/(.+?)\//;
        const match = location.pathname.match(regex);

        if (!match) {
            return;
        }

        const entryID = match[1];
        const sourceURL = sourceTemplate.replace("%ENTRY_ID_HERE%", entryID);
        appendDownloadButton(iframe, sourceURL);
    }

    // generates download button for embedded kaltura videos in blackboard page (eg. CZ1106)
    const genEmbeddedVideos = () => {
        let iframes = Array.from(document.getElementsByTagName("iframe"));
        iframes.forEach((iframe) => {
            let src = iframe.src;
            const sIndex = src.indexOf(entryPrefix);

            //stops if it isn't a kultura video iframe
            if (sIndex != -1) {
                const eidIndex = src.indexOf(entryPrefix) + entryPrefix.length;
                src = src.substring(eidIndex);
                const entryID = src.substring(0, src.indexOf("/"));
                const sourceURL = sourceTemplate.replace("%ENTRY_ID_HERE%", entryID);

                appendDownloadButton(iframe, sourceURL);
            }
        });
    };

    // generated download button for <a> tags to kaltura videos in blackboard page (eg. CZ2002)
    const genLinks = () => {
        const links = Array.from(document.querySelectorAll("a[target]"));
        links.forEach((link) => {
            if (link.href.indexOf("https://api.sg.kaltura.com") == 0) {
                const url = link.href;
                const entryID = url.split("entry_id=")[1];
                const sourceURL = sourceTemplate.replace("%ENTRY_ID_HERE%", entryID);

                appendDownloadButton(link, sourceURL);
            }
        });
    };


    // generates download button in the kaltura media gallery (eg. CZ2005)
    const genKPage = (playlist = false) => {
        const sourceURL = getSourceURL(playlist);
        listenDOM(playlist);
    };


    // returns video source URL using entry ID in current URL
    const getSourceURL = (playlist = false) => {
        const path = location.pathname;
        const pathSpl = path.replace("/media/t/", "").split("/");
        let entryID, sourceURL;

        if (playlist) {
            entryID = pathSpl[pathSpl.length - 1];
        }

        else {
            entryID = pathSpl[0];
        }

        sourceURL = sourceTemplate.replace("%ENTRY_ID_HERE%", entryID);
        return sourceURL;
    };


    // appends download button with sourceURL to whatever element is passed through sibling argument
    const appendDownloadButton = (sibling, sourceURL) => {
        const dlBtn = document.createElement("button");
        dlBtn.innerText = "Download";
        dlBtn.style.position = "absolute";
        dlBtn.style.userSelect = "none";
        dlBtn.style.marginLeft = "10px";
        dlBtn.onclick = (e) => { window.location.href = sourceURL; e.target.blur(); };

        sibling.parentNode.appendChild(dlBtn);
    };


    // larger video should have a poster attribute with entry_id
    const getLargerVidEntryID = (kVideo) => {
        const posterURL = kVideo.getAttribute("poster");
        const posterRegex = /entry_id\/([\w]+)\//;
        const match = posterURL.match(posterRegex);

        return match[1];
    };


    // appends download to action list when it is detected in MutationObserver
    // whole page doesn't load in at once in this scenario
    const listenDOM = (playlist = false) => {
        const observer = new window.MutationObserver(function (mutations, observer) {
            const ul = document.querySelector("ul#entryActionsMenu");

            // only appends when the "ACTIONS" dropdown list is loaded in
            if (ul != undefined) {
                const btnDl = document.querySelectorAll(".btn-dl");

                // remove previously added download buttons
                if (btnDl != undefined) {
                    for (let i = 0; i < btnDl.length; i++) {
                        btnDl[i].remove();
                    }
                }

                // needs to look into inner iframe context to search for video element
                const kplayerIFrame = document.querySelector("#kplayer_ifp"),
                    kplayerIFrameDOM = kplayerIFrame.contentWindow.document.body,
                    kVideos = Array.from(kplayerIFrameDOM.getElementsByTagName("video"));

                // for each video, insert a download button
                for (let i = 0; i < kVideos.length; i++) {
                    const kVideo = kVideos[i];
                    let entryID = 0;

                    // this should be the smaller video by default
                    if (kVideo.hasAttribute("kentryid")) {
                        entryID = kVideo.getAttribute("kentryid");
                    }

                    // this should be the bigger video by default
                    else {
                        entryID = getLargerVidEntryID(kVideo);
                    }

                    const sourceURL = sourceTemplate.replace("%ENTRY_ID_HERE%", entryID);

                    // inserts download button into dropdown list
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    const span = document.createElement("span");

                    span.innerText = `Download Source ${i + 1}`;
                    a.appendChild(span);
                    a.href = sourceURL;
                    li.appendChild(a);
                    li.className = "btn-dl";
                    li.setAttribute("role", "presentation");
                    ul.appendChild(li);
                }
            }
        });

        observer.observe(document, {
            subtree: true,
            attributes: true
        });
    };

})();









