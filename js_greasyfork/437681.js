// ==UserScript==
// @name         AcFun Live Like
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @license      MIT
// @description  AcFun直播点赞,自动带牌,切换直播间和发送弹幕是带牌(之前版本会出现0级牌子的bug已修复,累计送礼acb 大于0且小于50时触发)
// @author       近卫昴 uid 32125507
// @match        *://live.acfun.cn/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437681/AcFun%20Live%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/437681/AcFun%20Live%20Like.meta.js
// ==/UserScript==

setTimeout(() =>{
    var like = function fireKeyEvent(el, evtType, keyCode) {
        var evtObj;
        if (document.createEvent) {
            if (window.KeyEvent) {//firefox 浏览器下模拟事件
                evtObj = document.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, window, true, false, false, false, keyCode, 0);
                Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                Object.defineProperty(evtObj, "key", { value: "KeyL" });
                Object.defineProperty(evtObj, "code", { value: "KeyL" });
                Object.defineProperty(evtObj, "which", { value: "76" });
                Object.defineProperty(evtObj, "target", { value: "notTEXTAREA" });
            } else {//chrome 浏览器下模拟事件 谷歌可用其他未测
                evtObj = document.createEvent('UIEvents');
                evtObj.initUIEvent(evtType, true, true, window, 1);
                delete evtObj.keyCode;
                if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                    Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                    Object.defineProperty(evtObj, "key", { value: "KeyL" });
                    Object.defineProperty(evtObj, "code", { value: "KeyL" });
                    Object.defineProperty(evtObj, "which", { value: "76" });
                    Object.defineProperty(evtObj, "target", { value: "notTEXTAREA" });
                } else {
                    evtObj.key = String.fromCharCode(keyCode);
                }
                if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                    Object.defineProperty(evtObj, "ctrlKey", { value: true });
                    Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                    Object.defineProperty(evtObj, "key", { value: "KeyL" });
                    Object.defineProperty(evtObj, "code", { value: "KeyL" });
                    Object.defineProperty(evtObj, "which", { value: "76" });
                    Object.defineProperty(evtObj, "target", { value: "notTEXTAREA" });
                } else {
                    evtObj.ctrlKey = true;
                }
            }
            el.dispatchEvent(evtObj);
        } else if (document.createEventObject) {//IE 浏览器下模拟事件
            evtObj = document.createEventObject();
            evtObj.keyCode = keyCode
            el.fireEvent('on' + evtType, evtObj);
        }

    };
    var moreverFun = function morevenFunction() {
        document.getElementsByClassName('like-btn')[0].click();
    }


    function currentPage() {
        var hiddenProperty = 'hidden' in document ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null;
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        var onVisibilityChange = function () {
            if (!document[hiddenProperty]) {
                clearInterval(moreoverDocument);
                thisDocument = setInterval(like, 1000 / 2, document.body, 'keyup', '76');
                fetch('https://www.acfun.cn/rest/pc-direct/fansClub/fans/medal/wear?uperId=' + window.location.href.split('live/')[1], {
                    method: 'post',
                    credentials: 'include',
                })
            } else {
                clearInterval(thisDocument);
                moreoverDocument = thisDocument = setInterval(moreverFun, 1000 / 2);
            }
        }
        document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    }
    thisDocument = setInterval(like, 1000 / 2, document.body, 'keyup', '76');
    //moreoverDocument = thisDocument = setInterval(moreverFun, 1000/2);
    currentPage();
    Array.prototype.forEach.call(document.getElementsByClassName('danmaku-input'), function (dom) {
        dom.onmousedown = function () {
            fetch('https://www.acfun.cn/rest/pc-direct/fansClub/fans/medal/wear?uperId=' + window.location.href.split('live/')[1], {
                method: 'post',
                credentials: 'include',
            })
        }
    })
}, 2000);
