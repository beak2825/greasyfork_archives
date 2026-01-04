// ==UserScript==
// @name         Reddit Video Downloader
// @namespace    https://lawrenzo.com/p/reddit-video-downloader
// @version      0.7.1
// @description  Adds button to direct link or download the stupidly hard to save or share directly reddit videos. Designed to work on new Reddit only. Buttons appear when viewing the specific post -- does not work on preview/expand on post listing pages.
// @author       Lawrence Sim
// @license      WTFPL (http://www.wtfpl.net)
// @grant        unsafeWindow
// @match        https://www.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/503343/Reddit%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/503343/Reddit%20Video%20Downloader.meta.js
// ==/UserScript==
'use strict';
(function() {
    var defaultStyles = {
        "margin":        "0.4em",
        "font-size":     "0.8em",
        "padding":       "0.4em 0.6em",
        "border-radius": "4px",
        "border":        "1px solid #d9d9d9",
        "background":    "#fff",
        "cursor":        "pointer",
        "color":         "#000",  // Ensure text color is set
        "text-align":    "center" // Center text within the button
    };

    function createBtn(parent, opts) {
        let btn = document.createElement("button");
        btn.innerHTML = opts.html;
        Object.assign(btn.style, defaultStyles);
        if(opts.disabled) {
            btn.disabled = true;
            btn.style.background = "#bbb";
            btn.style.cursor = "wait";
        }
        if(opts.href) btn.addEventListener('click', () => window.open(opts.href));
        parent.append(btn);
        return btn;
    }

    function addLinks() {
        let contentDiv = document.querySelector("shreddit-post"),
            videoElem = contentDiv && contentDiv.querySelector("video") || contentDiv && contentDiv.querySelector("shreddit-player-2");

        if(!videoElem) return;

        if(videoElem.getAttribute("vlinked")) return;
        videoElem.setAttribute("vlinked", 1);

        let source = videoElem.querySelector("source");
        if(source && source.src && (~source.src.search(".gif") || ~source.src.search(".mp4"))) {
            let buttonRow = document.createElement("div");
            contentDiv.append(buttonRow);
            createBtn(buttonRow, {
                href: source.src,
                html: "Download"
            });
            return;
        }

        let buttonRow = document.createElement("div");
        contentDiv.append(buttonRow);
        let directBtn = createBtn(buttonRow, {
            html: "Sourcing video...",
            disabled: true
        });
        createBtn(buttonRow, {
            href: window.location.href.replace(/reddit.com\//, "redditsave.com/info?url="),
            html: "Download via RedditSave"
        });
        createBtn(buttonRow, {
            href: window.location.href.replace(/reddit.com/, "reddit.tube"),
            html: "Download via Reddit.Tube"
        });

        let i = 0,
            animateBtn = setInterval(() => {
                i = ++i > 3 ? 1 : i;
                directBtn.innerHTML = "Sourcing video"+(".".repeat(i)) + "&nbsp;".repeat(3-i);
            }, 750);

        fetch(window.location.href.split("?")[0].replace(/\/$/, "")+".json")
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(json => {
                let postData = json[0].data.children[0].data,
                    vidData = postData.secure_media && postData.secure_media.reddit_video;
                clearInterval(animateBtn);
                if(!vidData) {
                    directBtn.innerHTML = "Error pulling source";
                    directBtn.style.cursor = "default";
                    console.log(postData || json);
                } else {
                    directBtn.innerHTML = "Direct Video Link (no sound)";
                    directBtn.addEventListener('click', () => window.open(vidData.fallback_url));
                    directBtn.disabled = false;
                    Object.assign(directBtn.style, defaultStyles);
                }
            })
            .catch(err => {
                clearInterval(animateBtn);
                console.error(err);
            });
    }

    document.addEventListener('DOMContentLoaded', addLinks);

    let redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher);
    if(redditWatcher) {
        redditWatcher.body.onUpdate(addLinks);
        redditWatcher.feed.onChange(() => {});
    }

    new MutationObserver(() => {
        addLinks();
        let firstPost = document.querySelector(".ListingLayout-outerContainer div[data-testid='post-container']");
        if(firstPost) firstPost.addEventListener('DOMNodeRemoved', addLinks);
    }).observe(document.body, {childList: true, subtree: true});
})();
