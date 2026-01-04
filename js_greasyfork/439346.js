// ==UserScript==
// @name         B站直播屏蔽底端弹幕
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  B站屏蔽底端弹幕
// @author       神洛/你失散已久的父亲向晚
// @license      MIT
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439346/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BD%E5%BA%95%E7%AB%AF%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/439346/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%B1%8F%E8%94%BD%E5%BA%95%E7%AB%AF%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //获取底端弹幕的父级元素
    //注册监听子元素增加的事件
    //将新增的底端弹幕隐藏
    var time = setInterval(function () {
        let point1 = document.getElementsByTagName('iframe');
        if (point1.length === 1) {
            let point2 = document.querySelector('.danmaku-item-container');
            if (point2 !== null && point2 !== undefined) {
                point2.addEventListener('DOMNodeInserted', function (e) {
                    if (e.relatedNode.className == ' bilibili-danmaku mode-bottomMiddleFLoat') {
                        e.relatedNode.style.visibility = 'hidden';
                        //console.log('清除弹幕');
                    }
                });
                clearInterval(time);
                //console.log('document屏蔽底端弹幕载入成功');
            }
        }
        else {
            if (point1[1] !== null && point1[1] !== undefined) {
                let point3 = point1[1].contentDocument;
                if (point3 !== null && point3 !== undefined) {
                    let point4 = point3.querySelector('.danmaku-item-container');
                    if (point4 !== null && point4 !== undefined) {
                        point4.addEventListener('DOMNodeInserted', function (e) {
                            if (e.relatedNode.className == ' bilibili-danmaku mode-bottomMiddleFLoat') {
                                e.relatedNode.style.visibility = 'hidden';
                                //console.log('清除弹幕');
                            }
                        });
                        clearInterval(time);
                        //console.log('iframe屏蔽底端弹幕载入成功');
                    }
                }
            }
        }
    }, 100);
})();