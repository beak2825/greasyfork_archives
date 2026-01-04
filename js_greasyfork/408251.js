// vim: set ts=4 sw=4 expandtab:

// ==UserScript==
// @name               Media mode for Twitter home
// @name:zh-CN         Twitter 主页上的媒体模式
// @name:zh-TW         Twitter 主頁上的媒體模式
// @name:zh-HK         Twitter 主頁上的媒體模式
// @description        Remove text-only tweets on the flow of Twitter home/list. It is currently Beta quality.
// @description:zh-CN  在 Twitter 的主页和列表时间流上删除纯文本 Tweet。当前是 Beta 质量
// @description:zh-TW  在 Twitter 的主頁和列表時間流上刪除純文字 Tweet。當前是 Beta 質量
// @description:zh-HK  在 Twitter 的主頁和列表時間流上刪除純文本 Tweet。當前是 Beta 質量
// @icon               https://i.imgur.com/bUIPv1O.jpg
// @namespace          https://github.com/UtopicPanther/userscript-twitter-home-media
// @supportURL         https://github.com/UtopicPanther/userscript-twitter-home-media/issues
// @version            0.7.1
// @author             UtopicPanther
// @license            GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @match              https://twitter.com/*
// @match              https://mobile.twitter.com/*
// @grant              GM_registerMenuCommand
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/408251/Media%20mode%20for%20Twitter%20home.user.js
// @updateURL https://update.greasyfork.org/scripts/408251/Media%20mode%20for%20Twitter%20home.meta.js
// ==/UserScript==

/*
 *  Copyright (C) 2020 UtopicPanther
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  This script contains an additional exemption. When this script is
 *  injected into the site with the original setting of `@match`, 
 *  other user scripts running in the same space are not required to
 *  be compatible with GPL 3.
 *
 *  这个脚本包含一个附加豁免。当此脚本被注入到原有设置 `@match` 的
 *  站点时，不要求同一空间中运行的其他用户脚本与 GPL 3 兼容。
 */

(function() {
    'use strict';

    let hide = true;

    const removeTweet = article => {
        article.classList.add('mmfth_hide');
        const div = article.parentElement.parentElement;
        div.style.background = "red";
        if (hide)
            div.style.display = "none";
    }

    const showTweet = article => {
        console.log("showTweet: %O", article)
        article.classList.remove('mmfth_hide');
        const div = article.parentElement.parentElement;
        div.style.background = "";
        div.style.display = "";
    }

    const isTweetOnlyText = i => {
        if (Array.from(i.querySelectorAll('img')).some(img => {
            if (!img.src.match(/^[a-z]*:\/\/[^\/]*\/profile_images/) &&
                !img.src.match(/^[a-z]*:\/\/[^\/]*\/emoji/)) {
                return true;
            }
        })) return false;

        if (i.querySelector('div[data-testid=tweetPhoto]') != null) return false;

        if (Array.from(i.querySelectorAll('a')).some(a => {
            if (a.getAttribute('href').match(/^\/[^\/]*\/status\/[0-9]*\/photo\//)) {
                return true;
            }
        })) return false;

        if (i.querySelector('video') != null) return false;

        if (i.querySelector('div[role=progressbar]') != null) return false;

        let emptyMiddle = true;

        try {
            const tweet = i.querySelector('div[data-testid=tweet]');
            const tmp = tweet.children[1].children[1];
            const middle = tmp.children[tmp.length - 2];

            if (middle.children.length > 0)
                emptyMiddle = false;
        } catch (e) {}

        return emptyMiddle;
    }

    const findTweetsForRemove = () => {
        if (location.pathname.startsWith('/home') ||
            location.pathname.startsWith('/i/lists/')) {
            document.querySelectorAll('article:not(.mmfth_hide)').forEach(i => {
                if (isTweetOnlyText(i)) {
                    removeTweet(i);
                }
            });
            document.querySelectorAll('.mmfth_hide').forEach(i => {
                if (!isTweetOnlyText(i)) {
                    showTweet(i);
                }
            });
        }
    }

    const startObserver = () => {
        //const targetNode = document.querySelector('article').parentElement.parentElement.parentElement.parentElement;
        const targetNode = document.documentElement || document.body;

        findTweetsForRemove();

        const config = { childList: true, subtree: true };
        const observer = new MutationObserver((mutationsList, observer) => {
            findTweetsForRemove();
        });
        observer.observe(targetNode, config);
    }

    GM_registerMenuCommand("Show/Hide text-only tweets", () => {
        hide = !hide;
        alert("Text-only tweers will be " + (hide ? "hidden" : "shown (with red background)"));
        document.querySelectorAll('.mmfth_hide').forEach(i => {
            i.parentElement.parentElement.style.display = (hide ? "none" : "");
        });
    });

    setTimeout(() => {
        startObserver();
    }, 6000);
})();
