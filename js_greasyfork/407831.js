// ==UserScript==
// @name        MOTD video links
// @namespace   motd-times.com
// @match       https://www.motd-times.com/*
// @grant       GM.xmlHttpRequest
// @inject-into auto
// @version     1.0
// @author      0xuivil
// @description Show video links in a popup (openable with mpv player)
// @downloadURL https://update.greasyfork.org/scripts/407831/MOTD%20video%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/407831/MOTD%20video%20links.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
let createPlaceHolder = (linkEl) => {
    let div = document.createElement("div"),
        header = document.createElement("div");
    header.style.cssText = "height: 50px; background-color: black;";
    header.addEventListener("click", function(e) {
        this.parentNode.style.display = "none";
    });
    div.style.cssText = `position: absolute; margin-left: 300px; border: 1px solid;`;
    div.classList.add("videolinks");
    div.appendChild(header);
    linkEl.parentNode.insertBefore(div, linkEl);
    return div;
};

let showVideoLink = (link, parentEl) => {

    let linkDOM = document.createElement("a");
    linkDOM.href = link;
    linkDOM.textContent = link;
    linkDOM.style.cssText = "display: block;";
    parentEl.appendChild(linkDOM);

};

let fetchVidia = (url, callback, placeHolder) => {
    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/xml"
        },
        onload: function(response) {
            let data = response.responseText,
                dom = new DOMParser().parseFromString(response.responseText, "text/html"),
                regexpHash = /\|srt\|(.*?)\|play\|/gm,
                hash = regexpHash.exec(data)[1],
                regexpHost = /img src="(.*?)"/gm,
                host = new URL(regexpHost.exec(data)[1]).host,
                videoLink = `https://${host}/dash/,${hash},.urlset/manifest.mpd`;

            callback(videoLink, placeHolder);
        }
    });
};

let handleLink = (linkEl) => {
    let url = linkEl.href.replace("www.reddit", "old.reddit"),
        placeHolder = createPlaceHolder(linkEl);
    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "text/xml"
        },
        onload: function(response) {
            let redditDOM = new DOMParser().parseFromString(response.responseText, "text/html");

            let allowedVideoDomains = ["fullmatch24.com", "footballhighlightspro.com", "fullmatchesandshows.com"];
                spamLinks = Array.from(redditDOM.querySelectorAll("a")).filter(link => {
                    return allowedVideoDomains.findIndex(avd => link.href.includes(avd)) !== -1;

                });
            spamLinks.forEach(link => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: link.href,
                    headers: {
                        "User-Agent": "Mozilla/5.0",
                        "Accept": "text/xml"
                    },
                    onload: function(response) {
                        let vTLDCallbacks = {
                                "vidia.tv": fetchVidia
                            },
                            videosDOM = new DOMParser().parseFromString(response.responseText, "text/html"),
                            videoTLD = Array.from(videosDOM.querySelectorAll("iframe")).map(link => link.src);
                        for (let v of videoTLD) {
                            let tld = new URL(v)?.host;
                            if (tld && vTLDCallbacks[tld])
                                vTLDCallbacks[tld](v, showVideoLink, placeHolder);
                            showVideoLink(v, placeHolder);
                        }
                    }
                });
            });
        }
    });

};


(() => {
    document.querySelectorAll("a.reddit-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            let vlDOM = this.parentNode.querySelector(".videolinks");
            if (vlDOM)
                vlDOM.style.display = "block";
            else
                handleLink(this);
        });
    });
})()
