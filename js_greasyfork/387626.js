/**
 * @license
 * Copyright (C) 2024 nonoji fukushima.
 * https://greasyfork.org/users/305181-nonoji-fukushima
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// ==UserScript==
// @name Shunga Thumbnail Unmask
// @name:ja Shunga Thumbnail Unmask「春画のサムネイルを隠さず表示」
// @namespace https://greasyfork.org/users/305181-nonoji-fukushima
// @version 0.2.2-pre+20241002
// @description Like general illusts unhides shunga thumbnails on Niconico Seiga search results.
// @description:ja ニコニコ静画の検索結果で春画を一般イラスト同様に中身の見えるサムネイルにします。
// @author nonoji fukushima
// @license Mozilla Public License 2.0
// @contributionURL bitcoin:1EirWMuwt4PQwCYxsTafRFGJG5DxQt6cCV
// @contributionAmount 0.0001 BTC
// @grant none
// @match *://seiga.nicovideo.jp/seiga/*
// @match *://seiga.nicovideo.jp/tag/*?*target=illust_all*
// @match *://seiga.nicovideo.jp/user/illust/*?*target=illust_all*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/387626/Shunga%20Thumbnail%20Unmask.user.js
// @updateURL https://update.greasyfork.org/scripts/387626/Shunga%20Thumbnail%20Unmask.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    "use strict";

    {
        const illustListElem = document.querySelector(".illust_list");
        if (!illustListElem) {
            return;
        }
        [].forEach.call(illustListElem.children, replaceThumbs);
        // handle autopagers
        new MutationObserver(mutations => mutations.forEach(mut =>
            mut.addedNodes.forEach(replaceThumbs)
        )).observe(illustListElem, { childList: true });
    }
    return;

    function replaceThumbs(/** @type {!Element} */ elem) {
        elem.querySelectorAll(".thum img").forEach(imgElem => {
            if (imgElem.naturalWidth === imgElem.naturalHeight) {
                imgElem.src = imgElem.src.replace(/(\/thumb\/[0-9]+[a-z])z/, "$1");
            }
        });
    }
})();
