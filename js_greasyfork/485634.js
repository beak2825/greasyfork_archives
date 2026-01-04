// ==UserScript==
// @name         Youtube Live Feed ONLY
// @namespace    http://tampermonkey.net/
// @version      2024-01-253
// @description  Youtube Home Feed to Live Feed
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485634/Youtube%20Live%20Feed%20ONLY.user.js
// @updateURL https://update.greasyfork.org/scripts/485634/Youtube%20Live%20Feed%20ONLY.meta.js
// ==/UserScript==


// youtube.com/*で実行して、url遷移のトリガーを仕込む
// 動画urlからhome feedに移動したときも発火するように。
// 実際にlive feedをクリックするのは、youtube.com/のみ
(function() {
    'use strict';

    // firefox とsafari用のレガシー用
    /*
    const observeUrlChange = () => {
        // 普通のリロード
        clickLiveFeed();
        // jsによるurl書き換えをフックする
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                // Changed ! your code here
                clickLiveFeed();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };
    */

    function clickLiveFeed() {
        // alert('start clickLiveFeed: ' + document.location.href);
        //if (document.location.href !== 'https://www.youtube.com/') {
        //    return;
        //}

        var retryCount = 0;
        var maxRetry = 40;
        var intervalTime = 200; // in milliseconds
        let sucCount = 0

        // hideElement('ytd-feed-filter-chip-bar-renderer');
        hideElement('#primary');
        var intervalId = setInterval(function() {
            // alert('inner interval');
            // 別ページに遷移した場合もhome feedは裏でロードされるので、そのまま実行し続ければ良い
            // タブの切り替えボタンごと消す
            // hideElement('ytd-feed-filter-chip-bar-renderer');

            //hideAllElements();
            let selectedLiveButton = document.querySelector('yt-chip-cloud-chip-renderer[aria-selected="true"]>yt-formatted-string[title="ライブ"]');
            if (selectedLiveButton) {
                showElement('#primary');
                clearInerval(intervalId);
            }
            var element = document.querySelector('yt-formatted-string.yt-chip-cloud-chip-renderer[title="ライブ"]');
            if(element) {
                element.click();
                setTimeout(function() {
                    showElement('#primary');
                }, 2000);
                sucCount++;
                // load順の関係でクリックできてない時があるので、10回成功するまで続ける
                // 特に動画ページで再読込して、PinPでホームフィードに戻るときは、ホームフィード読み込みに時間がかかるので
                if (sucCount >= 10) {
                    clearInterval(intervalId); // stop retrying once the element is found and clicked
                }
            } else {
                hideElement('#primary');
                //alert('not found ライブ');
                console.log('tampermonkey youtube not found ライブタブ');
                retryCount++;
                if(retryCount >= maxRetry) {
                    clearInterval(intervalId); // stop retrying after maxRetry attempts
                }
            }
        }, intervalTime);
    }
    function hideAllElements() {
        var elements = document.querySelectorAll('ytd-rich-item-renderer');
        for (var i = 0; i < elements.length; i++) {
            elements[i].style.visibility = 'hidden';
        }
    }
    // display: falseだと要素が消えるので、復活させたときにズレがちなので避けた
    function hideElement(selector) {
        let element = document.querySelector(selector);
        if (element) {
            element.style.visibility = 'hidden';
        } else {
            console.log('Element not found');
        }
    }
    function showElement(selector) {
        let element = document.querySelector(selector);
        if (element) {
            element.style.visibility = 'visible';
        } else {
            console.log('Element not found');
        }
    }
    // URL遷移を補足。chromeでしか使えない。
    // navigateだと遷移開始を捉えてしまう。location.hrefが前のページのものになる
    // navigateでもe.destination.urlなら移動先のurlが取れるかも
    navigation.addEventListener('navigatesuccess', (e) => {
        /*setTimeout(
            clickLiveFeed,
            500
        );*/
        console.log(e);
        // alert('on navigate success');
        // alert('destination url: ' + e.target.currentEntry.url);
        if (e.target.currentEntry.url === 'https://www.youtube.com/') {
            clickLiveFeed();
        }
    });

    function startPoint() {
        // Home feedが見えないように、最速で発火する。
        if (document.location.href === 'https://www.youtube.com/') {
            clickLiveFeed();
        }
    }
    startPoint();

    // Youtubeボタンやhomeボタンで更新されると、home feedに戻ってしまう
    // とりあえず定期的にclickを実行する。
    // => この方式だと、1秒ごとにリロードされるのでダメ。

    setInterval(function() {
        let selectedLiveButton = document.querySelector('yt-chip-cloud-chip-renderer[aria-selected="true"]>yt-formatted-string[title="ライブ"]');
        if (selectedLiveButton) {
            return
        }
        var element = document.querySelector('yt-formatted-string.yt-chip-cloud-chip-renderer[title="ライブ"]');
            if(element) {
                element.click();
            }
    }, 1000);

    /* どれもPinPでYoutubeボタンやHomeボタンを押したときの遷移を、捉えられない */
    // タブ切り替え全体をmutationで監視して、変化があったら強制でタブをLiveに切り替える方式が良さそう */
    /*
    window.addEventListener('DOMContentLoaded', function() {
        alert('DOMContentLoaded');
        if (document.location.href === 'https://www.youtube.com/') {
            clickLiveFeed();
        }
    });
    window.addEventListener('load', function() {
        alert('load');
        if (document.location.href === 'https://www.youtube.com/') {
            clickLiveFeed();
        }
    });
    document.addEventListener("readystatechange", function() {
        alert('readystatechange');
    });
    */
})();