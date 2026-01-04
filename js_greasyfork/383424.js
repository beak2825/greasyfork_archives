// ==UserScript==
// @name         Coursera subtitles(outside the video)
// @description  Coursera subtitles outside the video.
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       木杉
// @include      http://www.coursera.org/*
// @include      https://www.coursera.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383424/Coursera%20subtitles%28outside%20the%20video%29.user.js
// @updateURL https://update.greasyfork.org/scripts/383424/Coursera%20subtitles%28outside%20the%20video%29.meta.js
// ==/UserScript==
(function () {
    const contentStyle = `
    color: black;
    font-size: 18px;
    line-height: 25px;
    background: beige;
    padding: 12px;
  `;
    function main(target, panel) {
        panel.style.justifyContent = "center";
        const content = document.createElement("div");
        content.style.cssText = contentStyle;
        panel.innerHTML = "";
        panel.append(content);
        if (target && panel && document.querySelector("video")) {
            const options = {
                attributes: true,
                attributeFilter: ["class"],
                childList: true,
                subtree: true
            };
            const mb = new MutationObserver(() => {
                const active = target.querySelector(".active");
                content.innerHTML = active.innerHTML;
            });
            mb.observe(target, options);
        }
    }
    const interval = setInterval(() => {
        const target = document.querySelector(".rc-Transcript");
        const panel = document.querySelector(".rc-VideoToolbar.horizontal-box.align-items-spacebetween");
        if (target && panel) {
            main(target, panel);
            window.clearInterval(interval);
        }
    }, 500);
})();
