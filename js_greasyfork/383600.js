/**
 * @license
 * Copyright (C) 2019 nonoji fukushima.
 * https://greasyfork.org/users/305181-nonoji-fukushima
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// ==UserScript==
// @name Nicovideo Search Spam Reporter
// @name:ja Nicovideo Search Spam Reporter「ニコ動検索で違反通報」
// @namespace https://greasyfork.org/users/305181-nonoji-fukushima
// @version 0.3.0-pre2+20190928
// @description Open the report form easily from Niconico Video ranking/search results.
// @description:ja ニコニコ動画のランキング・検索結果から簡単に通報画面を開きます。
// @author nonoji fukushima
// @license Mozilla Public License 2.0
// @contributionURL bitcoin:1EirWMuwt4PQwCYxsTafRFGJG5DxQt6cCV
// @contributionAmount 0.0001 BTC
// @grant none
// @match https://www.nicovideo.jp/ranking*
// @match https://www.nicovideo.jp/search/*
// @match https://www.nicovideo.jp/tag/*
// @downloadURL https://update.greasyfork.org/scripts/383600/Nicovideo%20Search%20Spam%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/383600/Nicovideo%20Search%20Spam%20Reporter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    "use strict";

    const IS_JAPANESE = document.documentElement.lang.startsWith("ja");
    const REPORT_VIDEO = (IS_JAPANESE ? "動画<wbr/>通報" : "Report Video");
    const REPORT_TAG = (IS_JAPANESE ? "タグ<wbr/>通報" : "Report Tag");
    const REPORT_TAG_INQUIRY = (IS_JAPANESE ?
        "虚偽のタグ ${tag} が使われている" :
        "Using untrue tag ${tag}"
    );

    if (document.URL.startsWith("https://www.nicovideo.jp/ranking")) {
        document.querySelector("#MatrixRanking-app, .SpecifiedRanking-main")
            .querySelectorAll(".RankingMatrixVideosRow, .RankingMainVideo").forEach(elem => {
                [].forEach.call(elem.children, insertAllegationLinksRanking);
                new MutationObserver(mutations => mutations.forEach(mut => {
                    mut.addedNodes.forEach(insertAllegationLinksRanking);
                })).observe(elem, { childList: true });
            });
    } else {
        const videoListElem = document.querySelector("ul[data-video-list]");
        [].forEach.call(videoListElem.children, insertAllegationLinksSearch);
        // handle autopagers
        new MutationObserver(mutations => mutations.forEach(mut => {
            mut.addedNodes.forEach(insertAllegationLinksSearch);
        })).observe(videoListElem, { childList: true });
    }
    return;

    function insertAllegationLinksRanking(/** @type {!Element} */ elem) {
        const aElem = elem.querySelector("a");
        const vidMatch = aElem && aElem.href.match(/\/watch\/(\w+)/);
        if (!vidMatch) {
            return;
        }
        aElem.setAttribute("data-x-vid", vidMatch[1]);
        aElem.addEventListener("mouseenter", onMouseEnterRankingItem, false);
        aElem.addEventListener("mouseleave", onMouseLeaveRankingItem, false);
    }

    function onMouseEnterRankingItem(/** @type {!MouseEvent} */ event) {
        const aElem = /** @type {!HTMLAnchorElement} */ (event.currentTarget);
        const vid = aElem.getAttribute("data-x-vid");
        const destElem = aElem.querySelector(".VideoThumbnail");
        destElem.insertAdjacentHTML("beforeend", `
            <div class="DeflistButton x-allegation" style="top: 38px">
                <a href="https://www.nicovideo.jp/allegation/${vid}"
                   rel="noopener noreferrer" target="_blank"
                   class="DeflistButton-button"
                   style="background-image: none; color: white;
                          display: table-cell; font-size: 9px; line-height: 1;
                          text-align: center; vertical-align: middle;
                          word-break: keep-all">${REPORT_VIDEO}</a>
            </div>
            <div class="DeflistButton x-allegation" style="top: 71px">
                <a href="https://secure.nicovideo.jp/secure/comment_allegation/${vid}"
                   rel="noopener noreferrer" target="_blank"
                   class="DeflistButton-button x-tag-allegation"
                   style="background-image: none; color: white;
                          display: table-cell; font-size: 9px; line-height: 1;
                          text-align: center; vertical-align: middle;
                          word-break: keep-all">${REPORT_TAG}</a>
            </div>
        `);
        destElem.querySelector(".x-tag-allegation")
            .addEventListener("click", onClickTagAllegation, false);
    }

    function onMouseLeaveRankingItem(/** @type {!MouseEvent} */ event) {
        /** @type {!HTMLAnchorElement} */ (event.currentTarget)
            .querySelectorAll(".x-allegation").forEach(oldElem => oldElem.remove());
    }

    function insertAllegationLinksSearch(/** @type {!Element} */ elem) {
        const vid = elem.getAttribute && elem.getAttribute("data-video-id");
        if (!vid) {
            return;
        }
        const destElem = elem.querySelector(".itemData > .list");
        destElem.querySelectorAll(".x-allegation").forEach(oldElem => oldElem.remove());
        destElem.insertAdjacentHTML("beforeend", `
            <li class="count x-allegation" style="float: right">
                <span class="value" style="color: unset">
                    <a href="https://www.nicovideo.jp/allegation/${vid}"
                       rel="noopener noreferrer" target="_blank"
                       style="color: unset">${REPORT_VIDEO}</a>
                </span>
            </li>
            <li class="count x-allegation" style="float: right">
                <span class="value" style="color: unset">
                    <a href="https://secure.nicovideo.jp/secure/comment_allegation/${vid}"
                       rel="noopener noreferrer" target="_blank"
                       class="x-tag-allegation"
                       style="color: unset">${REPORT_TAG}</a>
                </span>
            </li>
        `);
        destElem.querySelector(".x-tag-allegation")
            .addEventListener("click", onClickTagAllegation, false);
    }

    function onClickTagAllegation(/** @type {!MouseEvent} */ event) {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        const url = /** @type {!HTMLAnchorElement} */ (event.currentTarget).href;
        const subjectTagElem = document.querySelector(`
            .tagCaption h1,
            li:nth-child(n+2) .RankingFilterTag_active
        `);
        openTagAllegation(url, subjectTagElem && subjectTagElem.textContent.trim());
        event.preventDefault();
    }

    function openTagAllegation(/** @type {string} */ url, /** @type {?string} */ tag) {
        const params = {
            "mode": "confirm",
            "target": "tag",
            "select_allegation": "search_interference",
            "inquiry": REPORT_TAG_INQUIRY.replace("${tag}", tag || "")
        };
        const formElem = document.createElement("form");
        formElem.action = url;
        formElem.method = "POST";
        formElem.target = "_blank";
        formElem.hidden = true;
        Object.keys(params).forEach(name => {
            const inputElem = document.createElement("input");
            inputElem.type = "hidden";
            inputElem.name = name;
            inputElem.value = params[name];
            formElem.appendChild(inputElem);
        });
        document.documentElement.appendChild(formElem);
        formElem.submit();
        formElem.remove();
    }
})();
