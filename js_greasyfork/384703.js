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
// @name Nicovideo Search Antispam
// @name:ja Nicovideo Search Antispam「ニコ動タグロック数フィルター」
// @namespace https://greasyfork.org/users/305181-nonoji-fukushima
// @version 0.0.5-pre+20190611nightly
// @description Hide videos with too many locked tags from Niconico Video search results.
// @description:ja ニコニコ動画の検索結果からタグロック過多の動画を隠します。
// @author nonoji fukushima
// @license Mozilla Public License 2.0
// @contributionURL bitcoin:1EirWMuwt4PQwCYxsTafRFGJG5DxQt6cCV
// @contributionAmount 0.0001 BTC
// @grant GM.xmlHttpRequest
// @connect ext.nicovideo.jp
// @match https://www.nicovideo.jp/search/*
// @match https://www.nicovideo.jp/tag/*
// @downloadURL https://update.greasyfork.org/scripts/384703/Nicovideo%20Search%20Antispam.user.js
// @updateURL https://update.greasyfork.org/scripts/384703/Nicovideo%20Search%20Antispam.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    "use strict";

    const IS_JAPANESE = document.documentElement.lang.startsWith("ja");
    const WARN_TITLE = (IS_JAPANESE ?
        "詐欺動画の恐れがあります" :
        "This video may be fraudulent"
    );
    const WARN_DESC = (IS_JAPANESE ?
        "タグロック過多" :
        "Too many locked tags"
    );
    const WARN_UNHIDE = (IS_JAPANESE ?
        "一時的に表示する" :
        "Unhide temporarily"
    );

    {
        const videoListElem = document.querySelector("ul[data-video-list]");
        const videoList = [...videoListElem.children];
        const PRIOR_ON_VIEWPORT = true;
        if (PRIOR_ON_VIEWPORT) {
            const [priorStart, priorEnd] = calcVisibleItemRangeInViewport();
            console.time(`fetch ${videoList.length} thumbs`);
            console.log("# prior %d..%d", priorStart, priorEnd);
            Promise.all(videoList.slice(priorStart, priorEnd).map(judgeFraudulent))
                .then(lastResult => {
                    console.log(lastResult);
                    console.log("# after %d..", priorEnd);
                    return Promise.all(videoList.slice(priorEnd, videoList.length).map(judgeFraudulent));
                }).then(lastResult => {
                    console.log(lastResult);
                    console.log("# before ..%d", priorStart);
                    return Promise.all(videoList.slice(0, priorStart).map(judgeFraudulent));
                }).then(lastResult => {
                    console.log(lastResult);
                    console.timeEnd(`fetch ${videoList.length} thumbs`);
                }).catch(reason => {
                    console.error(reason);
                });
        } else {
            videoList.forEach(judgeFraudulent);
        }
        // handle autopagers
        new MutationObserver(mutations => mutations.forEach(mut =>
            mut.addedNodes.forEach(judgeFraudulent)
        )).observe(videoListElem, { childList: true });
    }
    return;

    function calcVisibleItemRangeInViewport() {
        try {
            let start = 0, end = -1;
            const videoListElem = document.querySelector("ul[data-video-list-skeleton]");
            const videoList = [...videoListElem.children];
            for (let i = 0; i < videoList.length; i++) {
                const rect = videoList[i].getBoundingClientRect();
                if (rect.bottom < 0) {
                    start = i;
                }
                if (rect.top > innerHeight) {
                    end = i;
                    break;
                }
            }
            return [start, end];
        } catch (error) {
            console.error(error);
            return [0, -1];
        }
    }

    function judgeFraudulent(/** @type {!Element} */ elem) {
        const vid = elem.getAttribute && elem.getAttribute("data-video-id");
        if (!vid) {
            return null;
        }
        const dataListElem = elem.querySelector(".itemData > .list");
        const parseDecimal = s => parseInt(s.replace(/,/g, ""), 10);
        const views = parseDecimal(dataListElem.querySelector(".view > .value").textContent);
        const mylists = parseDecimal(dataListElem.querySelector(".mylist > .value").textContent);
        if (views > 999 && mylists > 9) {
            console.log("skipping " + vid);
            return Promise.resolve("ignore");
        }
        console.log("fetching " + vid);
        return fetchThumbInfo(vid).then(responseXML => {
            const taglocks = responseXML.querySelectorAll("tag[lock]:not([category])").length;
            // const uid = responseXML.querySelector("user_id").textContent;
            // dataListElem.querySelectorAll(".x-taglocks").forEach(oldElem => oldElem.remove());
            // dataListElem.insertAdjacentHTML("beforeend", `
            //     <li class="count x-taglocks">
            //         ロック<span class="value">${taglocks}</span>
            //     </li>
            //     <li class="count x-taglocks">
            //         uid<span class="value">
            //             <a href="https://www.nicovideo.jp/user/${uid}">${
            //                 parseInt(uid, 10).toLocaleString("ja-JP")
            //             }</a>
            //         </span>
            //     </li>
            // `);
            console.log("%s has %d locked tags", vid, taglocks);
            if (taglocks > 9) {
                showFraudWarning(elem);
                return "FRAUD";
            }
            return "safe";
        });
    }

    function fetchThumbInfo(/** @type {string} */ vid) {
        return new Promise((resolve, reject) => {
            console.time("loaded " + vid);
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://ext.nicovideo.jp/api/getthumbinfo/${vid}`,
                onload: response => {
                    console.timeEnd("loaded " + vid);
                    resolve(response.responseXML);
                },
                onabort: _response => reject("abort"),
                onerror: _response => reject("error"),
                ontimeout: _response => reject("timeout")
            });
        });
    }

    function showFraudWarning(/** @type {!Element} */ elem) {
        elem.querySelectorAll(".x-fraud-warning").forEach(oldElem => oldElem.remove());
        const thumbElem = (elem.querySelector(".itemThumb"));
        thumbElem.querySelector(".itemThumbWrap").style.display = "none";
        thumbElem.insertAdjacentHTML("afterbegin", `
            <a class="itemThumbWrap x-fraud-warning">
                <img class="thumb" src="https://nicovideo.cdn.nimg.jp/web/img/common/no_thumbnail_M.jpg" />
            </a>
        `);
        const contentElem = elem.querySelector(".itemContent");
        contentElem.insertAdjacentHTML("afterbegin", `
            <p class="itemDescription x-fraud-warning"
               style="text-align: center; padding-bottom: 4px; line-height: 24px">
                <a class="x-fraud-unhide" style="color: #999">${WARN_UNHIDE}</a>
            </p>
        `);
        if (contentElem.querySelector(".wrap > .itemDescription")) {
            contentElem.querySelector(".wrap").style.display = "none";
            contentElem.insertAdjacentHTML("afterbegin", `
                <p class="itemDescription x-fraud-warning"
                   style="text-align: center">${WARN_DESC}</p>
            `);
        }
        contentElem.querySelector(".itemTitle").style.display = "none";
        contentElem.insertAdjacentHTML("afterbegin", `
            <p class="itemTitle x-fraud-warning" style="text-align: center">${
                WARN_TITLE
            }</p>
        `);
        const unhideElem = /** @type {!HTMLAnchorElement} */
            (contentElem.querySelector(".x-fraud-unhide"));
        unhideElem.href = document.documentURI;
        unhideElem.addEventListener("click", onClickUnhide, false);
    }

    function onClickUnhide(/** @type {!Event} */ event) {
        event.preventDefault();
        const itemElem = /** @type {!Element} */ (event.target).closest("li");
        itemElem.querySelectorAll(".x-fraud-warning").forEach(elem => elem.remove());
        itemElem.querySelectorAll(".itemThumbWrap, .itemTitle, .wrap").forEach(elem => {
            elem.style.display = null;
        });
    }
})();
