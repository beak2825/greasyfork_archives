// ==UserScript==
// @name         risu download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  download risu.io file
// @author       Charles
// @match        https://risu.io/*
// @icon         https://www.google.com/s2/favicons?domain=risu.io
// @run-at       document-start
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/425073/risu%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/425073/risu%20download.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            // Do something
            let button_bar = document.getElementsByClassName('input-group-append')[0];
            let submit_button = button_bar.getElementsByClassName('btn')[0];
            let download_button = submit_button.cloneNode(true);
            download_button.type = "button";
            download_button.textContent = "Download";
            download_button.style.marginLeft = '5px';
            button_bar.appendChild(download_button);
            let metas = document.getElementsByTagName("meta");
            let token;
            for (let i = 0; i < metas.length; i++) {
                if (metas[i].getAttribute('name') === 'csrf-token') {
                    let content = metas[i].getAttribute("content");
                    token = content;
                    break;
                }
            }
            download_button.onclick = async function () {
                let header = new Headers({
                    "Content-Type": "application/json;charset=utf-8",
                    "X-CSRF-Token": token,
                    "Accept": "application/json, text/plain, */*",
                });
                let send_obj = {password: document.getElementsByClassName("page-password")[0].value};
                console.log("send obj : " + send_obj);
                let result_json = await fetch(window.location.href + "/confirm.json", {
                    method: 'POST',
                    body: JSON.stringify(send_obj),
                    credentials: "same-origin",
                    headers: header,
                }).then(response => response.json()).then(response => response).catch(error => alert("error "));
                if (result_json.lock === false) {
                    alert("password error");
                }
                for (let i = 0; i < result_json.file_infos.length; i++) {
                    let content = result_json.file_infos[i];
                    let file_name = content.filename;
                    const url = content.file_path;
                    GM_download(url, file_name);
                }

            };
        }
    }
})();