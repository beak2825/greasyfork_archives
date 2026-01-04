// ==UserScript==
// @name         D button m.youtube
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description add a download button on mobile YouTube
// @author       Maxy
// @match        https://m.youtube.com/watch?v=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436164/D%20button%20myoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/436164/D%20button%20myoutube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let postForm = function() {
        // Remove origin node
        let post = document.getElementById("download-post");
        if(post && post !== undefined) {
            post.remove();
        }
        // Create form for post herf
        let form = function() {
            let form = document.createElement("form");
            form.id = "download-post";
            form.name = "post";
            form.method = "post";
            form.target = "_blank";
            form.action = "https://yt1s.com/result";
            return form;
        }();
        document.body.appendChild(form);
        // Add url input
        form.appendChild(function() {
            let inputUrl = document.createElement("input");
            inputUrl.type = "hidden";
            inputUrl.name = "url";
            inputUrl.value = window.location.href;
            return inputUrl;
        }());
        // Add proxy input
        form.appendChild(function() {
            let inputProxy = document.createElement("input");
            inputProxy.type = "hidden";
            inputProxy.name = "proxy";
            inputProxy.value = "Random";
            return inputProxy;
        }());
        form.submit();
    }
    setInterval(function() {
        let ads = ["item GoogleActiveViewElement", "companion-ad-container"];
        let bCompacts = document.getElementsByClassName("button-renderer compact ");
        let isInject = false;
        // Remove ads
        for(let idx = 0; idx < ads.length; ++idx) {
            let nodes = document.getElementsByClassName(ads[idx]);
            if(nodes && nodes.length > 0) {
                nodes[0].remove();
            }
        }
        // Test if injected already
        for(let idx = 0; idx < bCompacts.length; ++idx) {
            if(bCompacts[idx].innerText.trim() === "下载") {
                isInject = true;
            }
        }
        if(!isInject && bCompacts.length >= 5) {
            let bReport = bCompacts[4];
            if(bReport && bReport !== undefined) {
                let bParent = bReport.parentElement;
                let bDown = bReport.cloneNode(true);
                bDown.getElementsByClassName("button-renderer-text")[0].innerText = "下载";
                bDown.getElementsByTagName("svg")[0].outerHTML = `<svg t="1613792186988" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1434" width="200" height="200"><path d="M514 114.4c-220 0-398.8 178.9-398.8 398.8S294 912 514 912s398.8-178.9 398.8-398.8S734 114.4 514 114.4z m0 754.9c-196.4 0-356.1-159.8-356.1-356.1S317.6 157.1 514 157.1c196.4 0 356.1 159.8 356.1 356.1S710.4 869.3 514 869.3z" p-id="1435"></path><path d="M540.8 614.7c-1.7 1.7-3.5 3.2-5.5 4.5V252.1h-42.7v367.2c-1.9-1.3-3.8-2.8-5.5-4.5L368.9 496.5l-30.2 30.2L457 644.9c15.7 15.7 36.4 23.6 57 23.6 20.7 0 41.3-7.9 57-23.6l118.3-118.3-30.2-30.2-118.3 118.3zM358.6 697.4h310.7v42.7H358.6z" p-id="1436"></path></svg>`;
                bDown.onclick = postForm;
                bParent.appendChild(bDown);
            }
        }
    }, 500);
})();