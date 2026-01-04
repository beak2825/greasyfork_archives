// ==UserScript==
// @name         No-Bilibili-AdBlock-Tips
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  去除bilibili一些不需要的东西
// @author       Moear
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486836/No-Bilibili-AdBlock-Tips.user.js
// @updateURL https://update.greasyfork.org/scripts/486836/No-Bilibili-AdBlock-Tips.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var isAdBlockEnabled = true;
    var observer = null;
    var videoTitlesToRemove = new Set(['纪录片','添加你想要的视频名']); // Add video titles to remove here
    var authorNamesToRemove = new Set(['老师好我叫何同学','添加你不想看到的up主名字']); // Add author names to remove here


    function toggleAdBlock() {
        if (isAdBlockEnabled) {
            observer = new MutationObserver(function(mutations) {
                var adblockTips = document.querySelector('.adblock-tips'); //移除tips
                if (adblockTips) {
                    adblockTips.parentNode.removeChild(adblockTips);
                }

                // Remove elements with class 'floor-card single-card'
                var floorCards = document.querySelectorAll('.floor-card.single-card'); //移除楼层推荐
                floorCards.forEach(function(card) {
                    card.parentNode.removeChild(card);
                });

                var liveCards = document.querySelectorAll('.bili-live-card.is-rcmd'); //移除直播推荐
                liveCards.forEach(function(card) {
                    card.parentNode.removeChild(card);
                });

                // Add code to remove elements with class 'recommended-swipe grid-anchor'
                var recommendedSwipe = document.querySelectorAll('.recommended-swipe.grid-anchor');
                recommendedSwipe.forEach(function(element) {
                    element.parentNode.removeChild(element);
                });

                if (!adblockTips && floorCards.length === 0 && liveCards.length === 0 && recommendedSwipe.length === 0) {
                    observer.disconnect(); // Once we've found and removed the elements, we don't need to observe anymore
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        } else if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function removeChildByClassName(className, parentLevels) {
        var observer = new MutationObserver(function(mutations) {
            var element = document.querySelector(className);
            if (element) {
                var targetParent = element;
                for (var i = 0; i < parentLevels; i++) {
                    if (targetParent.parentNode) {
                        targetParent = targetParent.parentNode;
                    } else {
                        console.log("The element doesn't have " + parentLevels + " levels of parents.");
                        return;
                    }
                }
                console.log('remove element: ' + element.textContent);
                targetParent.parentNode.removeChild(targetParent);
                observer.disconnect(); // Once we've found and removed the element, we don't need to observe anymore
            } else {

            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    function removeElementsByContent(className, contentSet, parentLevels) {
        var observer = new MutationObserver(function(mutations) {
            var elements = document.querySelectorAll(className);
            elements.forEach(function(element) {
                if (contentSet.has(element.textContent)) {
                    var targetParent = element;
                    for (var i = 0; i < parentLevels; i++) {
                        if (targetParent.parentNode) {
                            targetParent = targetParent.parentNode;
                        } else {
                            return;
                        }
                    }
                    console.log('remove element: ' + element.textContent);
                    targetParent.parentNode.removeChild(targetParent);
                }
            });
            if (elements.length === 0) {
                observer.disconnect(); // Once we've found and removed the elements, we don't need to observe anymore
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    function allinone(){
        toggleAdBlock();
        removeChildByClassName('.bili-video-card__info--creative-ad', 6); //移除创作推广
        removeChildByClassName('bili-live-card__info--living',6); //移除直播推广
        removeChildByClassName('recommended-swipe grid-anchor',1);//移除首页大推荐
        removeElementsByContent('.bili-video-card__info--tit', videoTitlesToRemove, 4);//根据视频标题移除
        removeElementsByContent('.bili-video-card__info--author', authorNamesToRemove, 6);//根据视频作者名字正则匹配移除
    }
    allinone();//一加载进去就启动一次 去掉恶心人的东西
    window.addEventListener('scroll', function() { //每次滚动就加载一次
        if (window.scrollY > 1) {
            allinone();
        }
    });

})();