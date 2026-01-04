// ==UserScript==
// @name         ShadyNyaaan
// @author       mrNull
// @version      1.0
// @description  Save a shaders from Shadertoy.
// @description  This Script adds a "Save" button to the page with shaders on Shadertoy site.
// @description  Now you can experiment in your own IDE.
// @description  Developed for experimenting purpose.
// @match        https://www.shadertoy.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shadertoy.com
// @grant        none
// @namespace    ShadyNyaaan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462347/ShadyNyaaan.user.js
// @updateURL https://update.greasyfork.org/scripts/462347/ShadyNyaaan.meta.js
// ==/UserScript==

(function () {
    var shadID = window.location.href.split('/');
    shadID = shadID[shadID.length - 1] || shadID[shadID.length - 2];
    function code(s) {
        return 's=' + escape(JSON.stringify({ shaders: [s] }));
    }
    var req = code(shadID);
    /* Downloader */
    function saveData(json) {
        new JavascriptDataDownloader(json).download();
    }
    class JavascriptDataDownloader {
        constructor(data = {}) {
            this.data = data;
        }
        download(type_of = "text/plain", filename = shadID + ".json") {
            let body = document.body;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
                type: type_of
            }));
            a.setAttribute("download", filename);
            body.appendChild(a);
            a.click();
            body.removeChild(a);
        }
    };
    /* Button */
    var but = document.createElement('span');
    but.innerText = '💾';
    but.className = 'uiButtonNew';
    but.style = "margin-right:12px;font-size: 18px;position: relative;top: -4px;";
    but.addEventListener('click', saveShader);
    let container=document.querySelector('#shaderInfo>.shaderInfoA>div:nth-child(2)');
    container.insertBefore(but,container.firstElementChild);
    /* Request */
    async function saveShader() {
        await fetch("https://www.shadertoy.com/shadertoy", {
            "credentials": "include",
            "headers": {
                "Accept": "*/*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "referrer": "https://www.shadertoy.com/view/" + shadID,
            "body": req,
            "method": "POST",
            "mode": "cors"
        }).then(res => res.json()).then(saveData);
    }
})();