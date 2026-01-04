// ==UserScript==
// @name         Mastodon の閲覧注意を自動で表示するやつ
// @name:ja      Mastodon の閲覧注意を自動で表示するやつ
// @name:en      Mastodon auto spoiler opener
// @namespace    http://tampermonkey.net/
// @version      0.11
// @author       Eskey Easy
// @license MIT
// @description  閲覧注意ボタンを自動でクリックしてコンテンツを表示させます。ログインしていないインスタンスでも動作します。
// @description:ja  閲覧注意ボタンを自動でクリックしてコンテンツを表示させます。ログインしていないインスタンスでも動作します。
// @description:en  Automatically clicks on the spoiler buttons to display content. This works even in instances where you are not logged in.
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mstdn.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459987/Mastodon%20%E3%81%AE%E9%96%B2%E8%A6%A7%E6%B3%A8%E6%84%8F%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/459987/Mastodon%20%E3%81%AE%E9%96%B2%E8%A6%A7%E6%B3%A8%E6%84%8F%E3%82%92%E8%87%AA%E5%8B%95%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////// SETTING START /////////////////////////////////////////////////

    /**
      マストドンページ判定期間。ミリ秒
    */
    const SITE_CHECK_WAIT_MS = 60 * 1000;

    /**
      マストドンページ判定間隔。ミリ秒
      Mastodon page check interval(milliseconds)
    */
    const SITE_CHECK_INTERVAL = 100;

    /**
      更新間隔。ミリ秒
      Check interval(milliseconds)
    */
    const TOOT_CHECK_INTERVAL_MS = 300;

    ////// SETTING END ///////////////////////////////////////////////////

    checkSitePromise(SITE_CHECK_WAIT_MS, SITE_CHECK_INTERVAL)
        .then(() => openSpoilerLoop(TOOT_CHECK_INTERVAL_MS))
        .catch(()=> {});

    function checkSitePromise(waitMs, interval) {
        return new Promise((resolve, reject) => {
            const maxSiteCheckCount = waitMs / interval;
            let siteCheckLoop;
            let siteCheckIndex = 0;
            siteCheckLoop = setInterval(function(){
                if(siteCheckIndex == maxSiteCheckCount) {
                    // finish loop;
                    clearInterval(siteCheckLoop);
                    reject();
                }
                if(document.querySelector('div.media-gallery')) {
                    console.log('This is mastodon here.');
                    // break
                    clearInterval(siteCheckLoop);
                    resolve();
                }
                siteCheckIndex++;
            }, interval);
        })
    }

    // div of spoiler: div.spoiler-button
    // opened image: .spoiler-button--minified
    // opened video: .spoiler-button--hidden
    const selector = "div.spoiler-button:not(.spoiler-button--minified):not(.spoiler-button--hidden) > button";
    function openSpoilerLoop(interval) {
        setInterval(function(){
            document.querySelectorAll(selector).forEach(e => {
                e.click();
            })
        },interval);
    }
})();