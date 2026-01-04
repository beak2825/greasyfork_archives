// ==UserScript==
// @name         努努电视剧连播
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  努努影视中电视剧自动下一集
// @author       uzck
// @match        https://nnyy.in/dianshiju/*
// @match        https://nnyy.in/dongman/*
// @match https://www.dandanzan10.top/dongman/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446483/%E5%8A%AA%E5%8A%AA%E7%94%B5%E8%A7%86%E5%89%A7%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/446483/%E5%8A%AA%E5%8A%AA%E7%94%B5%E8%A7%86%E5%89%A7%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onload = function() {
        let video = document.querySelector('video')
        video.onended = function () {
            let curPlayLi = document.querySelector('li.on')
            let nextPlayLi = curPlayLi.nextElementSibling
            nextPlayLi.getElementsByTagName("a")[0].click();
        }
    }
})();