// ==UserScript==
// @name         S1论坛已读已阅提示
// @namespace    http://www.saraba1st.com/
// @version      0.8
// @description  S1论坛已阅提示,ignore old thread on saraba1st
// @author       不能放过孩子
// @match        *.saraba1st.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394367/S1%E8%AE%BA%E5%9D%9B%E5%B7%B2%E8%AF%BB%E5%B7%B2%E9%98%85%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394367/S1%E8%AE%BA%E5%9D%9B%E5%B7%B2%E8%AF%BB%E5%B7%B2%E9%98%85%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var prevUrl =localStorage.getItem("prevUrl");
    var prevUrlTime =localStorage.getItem("prevUrlTime"); ;
    var curUrl =  window.location.href;
    localStorage.setItem("prevUrl",curUrl);;
    localStorage.setItem("prevUrlTime",new Date().getTime());;
    
        var ignoreIdList = localStorage.getItem("ignoreIdList");
        ignoreIdList = ignoreIdList ? ignoreIdList : '';
        if (ignoreIdList && ignoreIdList.length / 1024 > 20) {//限制最大20kb后重置
            ignoreIdList = '';
        }
        ignoreIdList = ignoreIdList.replace(/\"/g, '');
        ignoreIdList = ignoreIdList.replace(/\\/g, '');
        if (ignoreIdList) {
            var ignore = ignoreIdList.split(',');
            if (typeof (ignore) !== 'object' || ignore.length <= 0) {
                ignore = [];
            }
        } else {
            var ignore = [];
        }
        var pushList = [];
        var threadlist = document.getElementsByClassName('xst');
        for (var index in threadlist) {
            var href = threadlist[index].href;
            if (href) {
                var threadMatch = href.match(/thread\-[0-9]+\-/g);
                var threadStr = threadMatch && threadMatch.length > 0 ? threadMatch[0] : '';
                var treadIdMatch = threadStr.match(/[0-9]+/g);
                var idStr = threadStr && threadStr.length > 0 ? treadIdMatch[0] : '';
                if (idStr) {
                    var patt = null;
                    var exist = false;
                    for (var i in ignore) {
                        if (typeof (ignore[i]) === 'string') {
                            var ignoreId = ignore[i];
                            patt = new RegExp(ignoreId, "g");
                            if (patt.test(idStr)) {
                                exist = true;
                            }
                        }
                    }
                    if (exist) {
                        threadlist[index].style.color = 'gray';
                    } else {
                        pushList.push(idStr);
                    }
                }
            }
        }
        var newIgnore = ignore.concat(pushList);
        var ignoreIdList = newIgnore.join(',');
    debugger;
    if( (prevUrl === undefined || prevUrl === null) || prevUrl === curUrl || new Date().getTime() - prevUrlTime > 24 * 60 * 60 * 100){
        //refresh 刷新、第一次加载的时候不启用
        return
    }else{
        localStorage.setItem("ignoreIdList", JSON.stringify(ignoreIdList));
    }
    
})();