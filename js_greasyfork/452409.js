// ==UserScript==
// @name         Restore Removed Posts
// @version      0.1
// @namespace    liquid5925.scripts
// @description  Script tries to restore images/videos from removed posts. If post couldn't be restored that means it had been also removed from servers.
// @author       liquid5925
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452409/Restore%20Removed%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/452409/Restore%20Removed%20Posts.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    const shouldBeExecuted = [...document.getElementsByClassName("status-notice")].filter(e => e.innerText.includes("This post was deleted."));
    if(shouldBeExecuted.length == 0) return;

    const getParams = function() {
        let e = location.search.substr(1).split("&");
        let returnable = {};
        e.forEach(function(r) {
            let ob = r.split("=");
            returnable[ob[0]] = ob[1];
        });
        return returnable;
    }

    const getParam = function(key) {
        let params = getParams();
        return params[key] || null;
    }

    const id = getParam("id");
    let resp;
    try{
        resp = await fetch(`https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&id=${id}&json=1&limit=1`).then(async function(r) { return (await r.json())[0] });
    }catch{
        let text = shouldBeExecuted[0].innerText;
        shouldBeExecuted[0].innerText = `${text}\n[SCRIPT] No file found.`;
    }
    if(!resp) return;
    let file_url = resp.file_url;
    let file_ext = file_url.split(".")[file_url.split(".").length-1];
    let isVideo = ['webm','mp4'].includes(file_ext.toLowerCase());
    let appendable = document.getElementById('fit-to-screen');
    let elem = document.createElement(isVideo ? 'video' : 'img');
    elem.src = file_url;
    if(isVideo){
        elem.loop = true;
        elem.controls = true;
    }
    appendable.prepend(elem);
    shouldBeExecuted[0].remove();
})();