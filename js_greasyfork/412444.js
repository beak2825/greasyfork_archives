// ==UserScript==
// @name         Hiện Join date
// @namespace    idmresettrial
// @version      2021.05.18.03
// @description  như tên
// @author       You
// @match        https://voz.vn/t/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @antifeature  tracking
// @downloadURL https://update.greasyfork.org/scripts/412444/Hi%E1%BB%87n%20Join%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/412444/Hi%E1%BB%87n%20Join%20date.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const warningDate = new Date(new Date() - 3 * 30 * 86400 * 1000);

    let cachedIds = GM_getValue("cachedIds", {});
    let dataVersion = 1;
    if (GM_getValue("dataVersion", 0) < dataVersion) {
        cachedIds = {};
        GM_setValue("dataVersion", dataVersion);
    }

    function gnsJd(id) {
        if (Object.keys(cachedIds).includes(id)) {
            showJd(id);
            return;
        }

        let token = document.getElementsByName("_xfToken")[0].value;
        let queryUrl = "https://voz.vn/u/{username}.{id}/?tooltip=true&_xfRequestUri={requestUri}&_xfWithData=1&_xfToken={token}&_xfResponseType=json";
        let username = document.querySelector(".message-userDetails a.username[data-user-id='" + id + "']").innerText;
        queryUrl = queryUrl
            .replace("{username}", encodeURIComponent(username))
            .replace("{id}", id)
            .replace("{requestUri}", document.location.pathname)
            .replace("{token}", token);

        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === XMLHttpRequest.DONE && httpRequest.status === 200) {
                let joindate = JSON.parse(httpRequest.responseText).html.content.match(/data-time=\"(.*?)\"/);
                if (joindate && !isNaN(Number(joindate[1]))) {
                    cachedIds[id] = Number(joindate[1]);
                    showJd(id);
                }
            }
        }

        httpRequest.open("GET", queryUrl);
        httpRequest.send();
    }

    let done = [];
    function showJd(id) {
        if (done.includes(id)) {
            return;
        }

        let els = document.querySelectorAll(".message-userDetails a.username[data-user-id='" + id + "']");
        els.forEach(el => {
            let jd = new Date(cachedIds[id]*1000)
            jd = jd.toLocaleDateString("vi-VN") + (jd < warningDate ? "" : " *");

            let jdEl = ('<h5 class="message-userTitle joindate" dir="auto" itemprop="joindate">Joined: {jd}</h5>{br}')
            .replace("{jd}", jd);
            let parent = el.parentElement.parentElement;
            let userBanners = parent.querySelectorAll(".userBanner");

            jdEl = jdEl.replace("{br}", (userBanners.length >= 2)? "<br/>" : "");
            parent.querySelector("[itemProp=jobTitle]").insertAdjacentHTML('afterend', jdEl);
        });

        done.push(id);
    }

    window.addEventListener("beforeunload", function() {
        GM_setValue("cachedIds", cachedIds);
    });

    function inoHandler(entries, observer) {
        entries.forEach(entry => {
            let id = entry.target.getAttribute("data-user-id");
            if (Object.keys(cachedIds).includes(id)) {
                observer.unobserve(entry.target);
            }
            gnsJd(id);
        });
    }
    let observer = new IntersectionObserver(inoHandler);

    let els = document.querySelectorAll(".message-userDetails a.username");
    els.forEach(el => observer.observe(el));

    let style = document.createElement('style');
    style.innerHTML = '@media (max-width: 751px) { .message-userTitle.joindate:before {content: ". "} }' +
                      '@media (min-width: 752px) { .message-userTitle.joindate + br {display: none;}  }';
    document.head.appendChild(style);


});