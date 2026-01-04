// ==UserScript==
// @name         西安欧亚学院线上考试反反作弊
// @namespace    1620535041@qq.com
// @version      0.1
// @description  西安欧亚学院线上考试反反作弊，双重保险，事件拦截+XHR请求拦截
// @author       AmazingPP
// @match        http://lms.eurasia.edu/exam/*
// @run-at		 document-start
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406367/%E8%A5%BF%E5%AE%89%E6%AC%A7%E4%BA%9A%E5%AD%A6%E9%99%A2%E7%BA%BF%E4%B8%8A%E8%80%83%E8%AF%95%E5%8F%8D%E5%8F%8D%E4%BD%9C%E5%BC%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/406367/%E8%A5%BF%E5%AE%89%E6%AC%A7%E4%BA%9A%E5%AD%A6%E9%99%A2%E7%BA%BF%E4%B8%8A%E8%80%83%E8%AF%95%E5%8F%8D%E5%8F%8D%E4%BD%9C%E5%BC%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截离开页面事件
    Window.prototype._addEventListener = Window.prototype.addEventListener;
    Window.prototype.addEventListener = function (eventName, fn, options) {
        if (eventName === 'blur' || eventName === 'pagehide') {
            console.log(`已拦截${eventName}事件!`);
            return;
        }

        this._addEventListener(eventName, fn, options);
    };

    // 拦截全屏检测事件
    Document.prototype._addEventListener = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (eventName, fn, options) {
        if (eventName === 'fullscreenchange'
            || eventName === 'mozfullscreenchange'
            || eventName === 'webkitfullscreenchange'
            || eventName === 'MSFullscreenChange') {
            console.log(`已拦截${eventName}事件!`);
            return;
        }

        this._addEventListener(eventName, fn, options);
    };

    function hookGetter(v,xhr){
        if (xhr.responseURL.indexOf('http://lms.eurasia.edu/api/exams/') > -1) {
            var json = JSON.parse(v);
            if (json.hasOwnProperty('enable_anti_cheat') && json.enable_anti_cheat === true) {
                json.enable_anti_cheat = false;
            }
            return JSON.stringify(json);
        }else return v;
    }

    // 勾住response的getter
    ah.hook({
        responseText: {
            getter:hookGetter
        },
        response: {
            getter:hookGetter
        }
    });

    // Your code here...
})();