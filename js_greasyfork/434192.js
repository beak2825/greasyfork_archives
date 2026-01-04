// ==UserScript==
// @name         Chao Xing Fucker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  fuck Chao Xing
// @author       Paper Folding
// @match        https://mooc1.chaoxing.com/**
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434192/Chao%20Xing%20Fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/434192/Chao%20Xing%20Fucker.meta.js
// ==/UserScript==

let anwserSelect = 0;

(function () {
    'use strict';
    window.addEventListener('load', () => {
        let videoTab = document.querySelector("li[title='视频']");
        if (videoTab)
            videoTab.click();
        let playBtn;
        let i = setInterval(() => {
            playBtn = grabIframeItem("button.vjs-big-play-button");
            if (playBtn && typeof playBtn === 'object') {
                clearInterval(i);
                // auto click play button
                playBtn.click();
                let video = grabIframeItem('#video_html5_api');
                video.volume = 0;
                // read course list data
                let allCourseList = document.querySelectorAll('.posCatalog_level .posCatalog_select');
                let curSelectedIndex = 0;
                let k = setInterval(() => {
                    allCourseList = document.querySelectorAll('.posCatalog_level .posCatalog_select');
                    if (allCourseList && allCourseList.length !== 0 && typeof allCourseList === 'object') {
                        clearInterval(k);
                        let j = setInterval(() => {
                            let curSelected = document.querySelector('.posCatalog_level .posCatalog_select.posCatalog_active');
                            if (curSelected && typeof curSelected === 'object') {
                                clearInterval(j);
                                for (; curSelectedIndex < allCourseList.length; curSelectedIndex++) {
                                    if (allCourseList[curSelectedIndex].id === curSelected.id)
                                        break;
                                }
                            }
                        }, 1000);
                    }
                }, 1000);

                // if playback is over
                video.addEventListener('ended', () => {
                    let to = allCourseList[++curSelectedIndex].querySelector('span').getAttribute('onclick').split('\'')[5];
                    location.href = updateURLParameter(location.href, 'chapterId', to);
                })

                // loop check if question is popped out
                setInterval(() => {
                    let right = Math.floor(Math.random()*2) === 0 ? grabIframeItem('ul.ans-videoquiz-opts>li input') : grabIframeItem('ul.ans-videoquiz-opts>li:last-of-type input');
                    if (right && typeof right === 'object') {
                        right.checked = true;
                        let submit = grabIframeItem('.ans-videoquiz-submit');
                        submit.click();
                    }
                }, 1000);
            }
        }, 1000);
    })
})();

// detect if wrong anwser alert is popped out
var alertScope;
if (typeof unsafeWindow === "undefined") {
    alertScope = window;
} else {
    alertScope = unsafeWindow;
}

alertScope.alert = function () {
};

function grabIframeItem(selector) {
    return top?.frames?.[0]?.frames?.[0]?.document?.querySelector?.(selector);
}

function updateURLParameter(url, key, value) {
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var params = additionalURL.split('&');
    var result = baseURL + '?';
    for (var param of params) {
        let temp = param.split('=');
        if (temp[0] === key)
            temp[1] = value;
        result += temp[0] + '=' + temp[1] + '&';
    }
    return result.substring(0, result.lastIndexOf('&'));
}