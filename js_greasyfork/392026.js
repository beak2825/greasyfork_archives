// ==UserScript==
// @author          zhzLuke96
// @name            展开Google首页app列表
// @name:en         unfold google home page apps
// @version         0.2
// @description     展开google首页app列表.
// @description:en  unfold google homepage apps list.
// @namespace       https://github.com/zhzLuke96/
// @match           https://www.google.com/
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/392026/%E5%B1%95%E5%BC%80Google%E9%A6%96%E9%A1%B5app%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/392026/%E5%B1%95%E5%BC%80Google%E9%A6%96%E9%A1%B5app%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const $ = q => document.querySelector(q);

    const topBtnTpl = $("#gbw > div > div > div:nth-child(1) > div:nth-child(1)");

    const googleHomeAppLs = [{
        name: "🗺️GMaps",
        url: "https://maps.google.com/maps"
    }, {
        name: "📺youtube",
        url: "https://www.youtube.com/"
    }, {
        name: "🎮GPlay",
        url: "https://play.google.com/"
    }, {
        name: "📧Gmail",
        url: "https://mail.google.com/mail/"
    }, {
        name: "☁️drive",
        url: "https://drive.google.com/"
    }, {
        name: "🈸translate",
        url: "https://translate.google.com/"
    }, {
        name: "📅calender",
        url: "https://www.google.com/calendar"
    }, {
        name: "📄GDocs",
        url: "https://docs.google.com/document/"
    }, {
        name: "📊finance",
        url: "https://www.google.com/finance"
    }, {
        name: "🔥news",
        url: "https://news.google.com/nwshp"
    }, {
        name: "|",
        url: "#"
    }];

    (function (apps) {
        for (const app of apps) {
            const nxtChild = topBtnTpl.cloneNode(true);
            const aDom = nxtChild.querySelector("a");
            aDom.removeAttribute("data-pid");
            aDom.setAttribute("href", app.url);
            aDom.setAttribute("target", "_blank");
            aDom.innerText = app.name;
            topBtnTpl.parentNode.insertBefore(nxtChild, topBtnTpl);
        }
    })(googleHomeAppLs);
})();