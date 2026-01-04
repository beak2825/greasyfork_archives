// ==UserScript==
// @name         YunTech EClass 破解
// @namespace    Anonymous3356@TW
// @version      0.3
// @description  YunTech EClass，全螢幕事件攔截+XHR請求攔截+教材允許下載&快進
// @author       Anonymous Jerry
// @match        https://eclass.yuntech.edu.tw/*
// @run-at		 document-start
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435617/YunTech%20EClass%20%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/435617/YunTech%20EClass%20%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 攔截離開頁面事件
    Window.prototype._addEventListener = Window.prototype.addEventListener;
    Window.prototype.addEventListener = function (eventName, fn, options) {
        if (eventName === 'blur' || eventName === 'pagehide') {
            console.log(`已攔截${eventName}事件!`);
            return;
        }
        // console.log(`Window ${eventName}事件!`);

        this._addEventListener(eventName, fn, options);
    };

    // 攔截全螢幕事件
    Document.prototype._addEventListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (eventName, fn, options) {
        if (eventName === 'fullscreenchange'
            || eventName === 'mozfullscreenchange'
            || eventName === 'webkitfullscreenchange'
            || eventName === 'MSFullscreenChange') {
            console.log(`已攔截${eventName}事件!`);
            return;
        }
        // console.log(`Document ${eventName}事件!`);

        this._addEventListener(eventName, fn, options);
    };

    function hookGetter(v,xhr){
        if (xhr.responseURL.indexOf('https://eclass.yuntech.edu.tw/api/exams/') > -1) {
            var json = JSON.parse(v);
            if (json.hasOwnProperty('enable_anti_cheat') && json.enable_anti_cheat === true) {
                json.enable_anti_cheat = false;
                console.log('enable_anti_cheat = false');
            }
            if (json.hasOwnProperty('is_leaving_window_constrained') && json.is_leaving_window_constrained === true) {
                json.is_leaving_window_constrained = false;
                console.log('is_leaving_window_constrained  = false');
            }
            // console.log(JSON.stringify(json));
            return JSON.stringify(json);
        }
        else if (xhr.responseURL.indexOf('https://eclass.yuntech.edu.tw/api/course/') > -1) {
            json = JSON.parse(v);
            if (json.hasOwnProperty('enable_anti_cheat') && json.enable_anti_cheat === true) {
                json.enable_anti_cheat = false;
                console.log('enable_anti_cheat = false');
            }
            if (json.hasOwnProperty('is_leaving_window_constrained') && json.is_leaving_window_constrained === true) {
                json.is_leaving_window_constrained = false;
                console.log('is_leaving_window_constrained = false');
            }
            // console.log(JSON.stringify(json));
            return JSON.stringify(json);
        }
        else if (xhr.responseURL.indexOf('https://eclass.yuntech.edu.tw/api/activities/') > -1) {
            // console.log('Into activities');
            // 教材影片允許下載&快進
            var obj = JSON.parse(v, (key, value) => (key == 'allow_forward_seeking' && value == false ? true :value) ||
                                 (key == 'allow_download' && value == false ? true :value))
            console.log('allow_download & allow_forward_seeking = true');
            return JSON.stringify(obj);
        }
        else return v;
    }

    // hook response的getter
    ah.hook({
        responseText: {
            getter:hookGetter
        },
        response: {
            getter:hookGetter
        }
    });
})();