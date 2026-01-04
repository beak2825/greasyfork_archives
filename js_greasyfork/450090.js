// ==UserScript==
// @name         AcFun首页进入“我的关注直播间”
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  首页点击所有与直播首页相关的UI都将进入到“我的关注直播间”页面
// @author       dareomaewa
// @match        https://www.acfun.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acfun.cn
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.0/jquery-1.8.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450090/AcFun%E9%A6%96%E9%A1%B5%E8%BF%9B%E5%85%A5%E2%80%9C%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E7%9B%B4%E6%92%AD%E9%97%B4%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/450090/AcFun%E9%A6%96%E9%A1%B5%E8%BF%9B%E5%85%A5%E2%80%9C%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E7%9B%B4%E6%92%AD%E9%97%B4%E2%80%9D.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function waitElement(selector, times, interval, flag=true){
        var _times = times || -1,
            _interval = interval || 1,
            _selector = selector,
            _iIntervalID,
            _flag = flag;
        return new Promise(function(resolve, reject){
            _iIntervalID = setInterval(function() {
                if(!_times) {
                    clearInterval(_iIntervalID);
                    reject();
                }
                _times <= 0 || _times--;
                var _self = $(_selector);
                if( (_flag && _self.length) || (!_flag && !_self.length) ) {
                    clearInterval(_iIntervalID);
                    resolve(_iIntervalID);
                }
            }, _interval);
        });
    }

    function replaceLiveUrl(selector) {
        waitElement(selector).then(function() {
            const nodeList = document.querySelectorAll(selector);
            nodeList.forEach(node => {
                node.setAttribute('href', 'https://live.acfun.cn/live/0.0');
            });
        });
    }

    replaceLiveUrl('a[href="//live.acfun.cn"]');
    replaceLiveUrl('a[href="https://live.acfun.cn/"]');
    replaceLiveUrl('a[href="https://live.acfun.cn"]');



})();