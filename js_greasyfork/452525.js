// ==UserScript==
// @name         Kemono Util
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Make your kemono.party life comfortable.
// @author       蝙蝠の目
// @license      MIT
// @match        https://kemono.party/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452525/Kemono%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/452525/Kemono%20Util.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchFavoriteUsers(callback, searchTimeThreshold = 0) {
        for (let i = 0; true; i += 25) {
            const pageSource = await (await fetch(`/favorites?util=active&order=desc&o=${i}`)).text();
            if (typeof pageSource !== "string") return;

            const articlesMatch = pageSource.match(/\<article[^]*?\<\/article\>/g);
            if (!articlesMatch) return;

            let usersCount = 0;
            for (const userInfoHTML of articlesMatch) {
                const hrefMatch = userInfoHTML.match(/href="(.*?)"/);
                const timeMatch = userInfoHTML.match(/datetime="(.*?)"/);
                if (hrefMatch && timeMatch) {
                    const href = hrefMatch[1];
                    const time = new Date(timeMatch[1]).getTime();
                    if (time < searchTimeThreshold) return;
                    usersCount++;
                    callback(href);
                }
            }
            if (usersCount === 0) return;
        }
    }

    async function fetchUserWorks(userPageUrl, callback) {
        const pageSource = await (await fetch(userPageUrl)).text();
        if (typeof pageSource !== "string") return;

        const articlesMatch = pageSource.match(/\<article[^]*?\<\/article\>/g);
        if (!articlesMatch) return;

        for (const workInfoHTML of articlesMatch) {
            callback(workInfoHTML);
        }
    }

    function initUtil() {
        document.querySelector("#page").remove();
        document.querySelector("#main").insertAdjacentHTML("beforeend", `
<div style="border-top: 1px solid hsl(0, 0%, 95%); padding: 10px 40px 20px;">
    <span style="float: left;">
        Kemono Util
        <span style="margin-left: 30px;">
            <input type="number" id="kemonoUtil-daysInput" min="1" style="width: 3em; text-align: right;" /> days
            <button id="kemonoUtil-searchButton" style="margin-left: 8px;">search</button>
        </span>
    </span>
    <span style="float: right;">
        <a href="/favorites?type=post">[Favorite Posts]</a>
    </span>
    <div style="clear: both;"></div>
</div>
<div class='card-list card-list--legacy'>
    <div class='card-list__items' id='divItems'>
    </div>
</div>`
        );

        const input = document.querySelector("#kemonoUtil-daysInput");
        const button = document.querySelector("#kemonoUtil-searchButton");

        input.value = localStorage.getItem("kemonoUtil-searchDays") || "7";

        button.addEventListener("click", e => {
            const searchDays = Number(input.value);
            if (searchDays < 0) return;
            localStorage.setItem("kemonoUtil-searchDays", searchDays.toString());
            showList(searchDays);
        });
    }

    let currentListId = -1;

    function showList(searchDays) {
        const listId = Math.random();
        currentListId = listId;

        const searchTimeThreshold = Date.now() - searchDays * 1000 * 60 * 60 * 24;

        const idTimeArray = [{id: null, time: -Infinity}];

        for (const elm of [...document.querySelector("#divItems").children]) {
            elm.remove();
        }

        fetchFavoriteUsers(userPageUrl => {
            if (currentListId !== listId) return;
            fetchUserWorks(userPageUrl, html => {
                if (currentListId !== listId) return;

                const id = html.match(/data-service="(.*?)"/)[1] + "-" + html.match(/data-user="(.*?)"/)[1] + "-" + html.match(/data-id="(.*?)"/)[1];
                const time = new Date(html.match(/datetime="(.*?)"/)[1]).getTime();
                if (time < searchTimeThreshold) return;

                html = html.replace("<article", `<article id="post-${id}"`);

                let insertTargetID = null;
                for (let i = 0; i < idTimeArray.length; i++) {
                    if (idTimeArray[i].time <= time) {
                        insertTargetID = idTimeArray[i].id;
                        idTimeArray.splice(i, 0, {id, time});
                        break;
                    }
                }

                if (insertTargetID) {
                    document.querySelector(`#post-${insertTargetID}`).insertAdjacentHTML("beforebegin", html);
                } else {
                    document.querySelector("#divItems").insertAdjacentHTML("beforeend", html);
                }
            });
        }, searchTimeThreshold);
    }

    function initLink() {
        for (const a of document.querySelectorAll("header a")) {
            const href = a.getAttribute("href");
            if (href === "/favorites") {
                a.setAttribute("href", href + "?util=active");
            }
        }
    }

    function init() {
        const params = new URLSearchParams(location.search);

        if (location.pathname === "/favorites" && params.get("util") === "active") {
            initUtil();
        }

        initLink();
    }

    init();
})();