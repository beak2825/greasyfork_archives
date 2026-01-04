// ==UserScript==
// @name         2024年智慧中小学暑假教师研修秒过
// @namespace    http://tampermonkey.net/
// @version      1145117.0
// @author       Alcex
// @description  已打赢复活赛
// @license      MIT
// @match        https://basic.smartedu.cn/*
// @match        https://www.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/501679/2024%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/501679/2024%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A7%92%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function skip() {
        let video = document.getElementsByTagName('video');
        if (video.length > 0) {
            video[0].play().catch(function() {});
            video[0].pause();
            video[0].currentTime = video[0].duration;
            video[0].play().catch(function() {});
        }
    }

    function removeModal() {
        try {
            var f = document.querySelector(".fish-modal-root");
            if (f) {
                f.remove();
            }
        } catch (e) {
            console.error("Error in removeModal function:", e);
        }
    }

    setInterval(skip, 100);
    setInterval(removeModal, 1000);
})();