// ==UserScript==
// @name         Record city express packaging
// @name:zh-CN   城市速瑞快递打包视频
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Record the packaging video of suruilogistics.com (ctexpress)
// @description:zh-CN  城市速瑞快递打包视频，更正方向、全屏、允许录制、允许开声音
// @author       dont-be-evil
// @match        https://ct.suruilogistics.com/mobile/users.php?act=out_show*
// @match        https://ct.suruilogistics.com/mobile/users.php?act=showDbVideo*
// @match        https://open.ys7.com/ezopen/h5/iframe*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suruilogistics.com
// @grant        none
// @run-at       document-start
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528222/Record%20city%20express%20packaging.user.js
// @updateURL https://update.greasyfork.org/scripts/528222/Record%20city%20express%20packaging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.includes("act=out_show")) {
        const params = new URLSearchParams(window.location.search);
        const order_id = params.get("order_id");
        // Intercept the click event on <a> elements with onclick="dbVideo()"
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll("a[onclick*='dbVideo']").forEach(anchor => {
                anchor.addEventListener("click", function (event) {
                    event.preventDefault(); // Stop original function
                    event.stopPropagation();
                    // Redirect to the second page
                    window.location.href = `https://ct.suruilogistics.com/mobile/users.php?act=showDbVideo&outcomeId=${order_id}`;
                });
            });
        });
    } else if (window.location.href.includes("act=showDbVideo")) {
        // Wait for page to load, then redirect again
        window.addEventListener("load", function () {
            const video_url = document.getElementById("ysopen")?.src;
            if (video_url) {
                window.location.href = video_url;
            }
        });
    } else if (window.location.href.includes("ezopen")) {
        const params = new URLSearchParams(window.location.search);
        const begin_at = params.get("begin");
        const end_at = params.get("end");

        function wait_stream() {
            try {
                const frame = document.getElementById("iframe-btn-container");
                frame.style.removeProperty('display');
                const original_height = frame.style.height;
                const original_width = frame.style.width;
                frame.style.height = original_width;
                frame.style.width = original_height;
                const toolbar = document.getElementById("iframe-btn-container");
                const open_sound = document.createElement("button");
                open_sound.textContent = "Open sound";
                open_sound.style.marginLeft = "1rem";
                open_sound.style.width = "3rem";
                open_sound.style.height = "2rem";
                open_sound.onclick = () => {
                    if (open_sound.textContent === "Open sound") {
                        decoder.openSound();
                        open_sound.textContent = "Close sound";
                    } else {
                        decoder.closeSound();
                        open_sound.textContent = "Open sound";
                    }
                };
                toolbar.appendChild(open_sound);
            } catch (error) {
                setTimeout(wait_stream, 50);
            }
        }

        wait_stream();
    }

})();