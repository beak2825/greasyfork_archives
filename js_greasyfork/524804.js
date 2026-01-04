// ==UserScript==
// @name         秒过2025年智慧中小学寒假教师研修，疯狂点鼠标左键。
// @namespace    http://tampermonkey.net/
// @version      0.01
// @author       hydrachs
// @description  2025年智慧中小学寒假教师研修，疯狂点鼠标左键。
// @license MIT
// @match        https://basic.smartedu.cn/*
// @match        https://www.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/524804/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E7%96%AF%E7%8B%82%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/524804/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E7%96%AF%E7%8B%82%E7%82%B9%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E3%80%82.meta.js
// ==/UserScript==

(function() {
    

    function removePopup() {
        var popup = document.querySelector('.fish-modal-confirm-btns');
        if (popup) {
            popup.parentNode.removeChild(popup);
        }
    }

    function removeNewPopup() {
        var newPopup = document.querySelector('.fish-modal-content');
        if (newPopup) {
            newPopup.parentNode.removeChild(newPopup);
        }
    }

    function skipVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
            video.pause();
            video.currentTime = video.duration;
            video.play();
            setTimeout(() => {}, 700); 
            video.currentTime = video.duration - 3;
            video.play();
            video.currentTime = video.duration - 5;
            video.play();
        }
    }

    function skipVideo2() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
        }
    }

    function rapidSkip(times, interval) {
        let count = 0;
        const intervalId = setInterval(() => {
            if (count >= times) {
                clearInterval(intervalId);
                return;
            }
            skipVideo();
            count++;
        }, interval);
    }

    let clickTimer;

    document.addEventListener('DOMContentLoaded', function() {
        removePopup();
        removeNewPopup();
    });

    document.addEventListener('click', function(event) {
        if (event.button === 0) {
            if (clickTimer) {
                clearInterval(clickTimer);
            }
            rapidSkip(4, 50);
            clickTimer = setInterval(() => {
                rapidSkip(4, 50);
            }, 8000);
        }
    });

})();