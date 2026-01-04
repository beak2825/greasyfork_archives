// ==UserScript==
// @name         Marvel-ous Links 2099 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make CMRO links open in Marvel Unlimited app, only on mobile devices
// @author       Arthur but really Aron did all the hard work
// @license      MIT
// @match        *://cmro.travis-starnes.com/*
// @match        *://read.marvel.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/496777/Marvel-ous%20Links%202099.user.js
// @updateURL https://update.greasyfork.org/scripts/496777/Marvel-ous%20Links%202099.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the user agent indicates a mobile device
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) {
        return; // Exit the script if not on a mobile device
    }

    const BUTTON_PREFIX = "https://read.marvel.com";
    const SHARE_LINK_PREFIX = "https://share.marvel.com/sharing/legacy/";
    const DEEPLINK_PREFIX = "marvelunlimited://issue/";

    if (window.location.href.includes("cmro.travis-starnes.com")) {
        const button = getButtonElement();
        if (button) {
            const digitalId = getDigitalId(button.href);
            updateButton(digitalId);
        }
    } else if (window.location.href.includes("read.marvel.com")) {
        const INSERT_POINT = "span.allPages";
        const observer = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.querySelector(INSERT_POINT)) {
                            updatePage();
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    function getButtonElement() {
        const links = document.body.querySelectorAll("a");
        for (let i = 0; i < links.length; i++) {
            const url = links[i].href;
            if (url.startsWith(BUTTON_PREFIX)) {
                return links[i];
            }
        }
        return null;
    }

    function getDigitalId(url) {
        const digitalIdPos  = url.lastIndexOf("/");
        return url.slice(digitalIdPos + 1, url.length);
    }

    function updateButton(digitalId) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: SHARE_LINK_PREFIX + digitalId,
            onload: function(response) {
                const regex = /drn=(.*)&amp/gm;
                const match = regex.exec(response.responseText);
                if (match) {
                    const data = match[1];
                    const newUrl = DEEPLINK_PREFIX + data;
                    const button = getButtonElement();
                    if (button) {
                        button.setAttribute("href", newUrl);
                    }
                }
            }
        });
    }

    function updatePage() {
        teardown();
        insertLink();
    }

    function teardown() {
        const element = document.querySelector("#marvelous-link");
        if (element !== null) {
            element.parentNode.removeChild(element);
        }
    }

    function insertLink() {
        const loc = window.location.toString();
        const digitalIdPos  = loc.lastIndexOf("/");
        const digitalId = loc.slice(digitalIdPos + 1, loc.length);
        const dataUrl = SHARE_LINK_PREFIX + digitalId;

        GM_xmlhttpRequest({
            method: 'GET',
            url: dataUrl,
            onload: function(response) {
                const regex = /drn=(.*)&amp/gm;
                const match = regex.exec(response.responseText);
                if (match) {
                    const data = match[1];
                    const newUrl = DEEPLINK_PREFIX + data;

                    const span = document.createElement("span");
                    span.id="marvelous-link";
                    span.style="float:left; overflow: visible; top: 0px; text-indent: 20%;";
                    const anchor = document.createElement("a");
                    anchor.setAttribute("href", newUrl);
                    anchor.innerText = "Open in app";
                    anchor.style = "color:white";
                    span.appendChild(anchor);

                    const header = document.body.querySelector(INSERT_POINT);
                    header.after(span);
                }
            }
        });
    }
})();
