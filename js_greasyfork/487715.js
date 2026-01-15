// ==UserScript==
// @name         📄百度文库下载|VIP文档免费下载
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  百度文库破解免费下载
// @author       mounui
// @antifeature  ads
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487715/%F0%9F%93%84%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%7CVIP%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/487715/%F0%9F%93%84%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%7CVIP%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (location.hostname.endsWith(".baidu.com")) {
        const id = ("wk" + Date.now()).slice(0, 8);
        const html = `
            <div id="${id}">
                <style>
                    #${id}{
                        /* box-shadow: 0 0 24px #00000080, 0 0 50px #0003; */
                        z-index: 9999999999;
                        bottom: 66px;
                        position: fixed;
                        left: 288px;
                        border-radius: 6px;
                        cursor: pointer;
                        text-align: center;
                        font-size: 17px;
                        padding: 10px 15px;
                        transition: 0.1s;
                        background: #4e6ef2;
                        color: #efefef;
                        border: 1.5px solid #e77717;
                    }
                    #${id}:hover {
                        background: #4662d9;
                    }
                </style>
                    免费下载文档
            </div>
            `;
        onload(() => {
            document.body.insertAdjacentHTML("afterbegin", html);
            const btn = document.getElementById(id);
            btn.addEventListener("click", () => {
                window.open(
                    "https://doc.idjams.top?url=" +
                    encodeURIComponent(location.href)
                );
            });
            setInterval(() => {
                btn.style.setProperty(
                    "display",
                    location.pathname.startsWith("/view/") ? "block" : "none"
                );
            }, 500);
        });
    }
    function onload(cb) {
        cb = cb || new Function();
        if (document.readyState !== "loading") {
            cb();
        } else {
            document.addEventListener("DOMContentLoaded", cb);
        }
    }
})();