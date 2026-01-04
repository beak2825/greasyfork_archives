// ==UserScript==
// @name         weibo time
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微博的时间显示非常不友好，显示多少分钟前，把显示多少分钟前换成真实时间
// @author       LSCD
// @match        https://*.weibo.com/*
// @match        https://*.weibo.cn/*
// @icon         https://weibo.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441954/weibo%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/441954/weibo%20time.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fuxk(){
        var list = document.getElementsByClassName('WB_from S_txt2');
        for(var i = 0; i < list.length; i++)
        {
            list[i].firstElementChild.innerHTML = list[i].firstElementChild.title;
        }

        var list2 = document.getElementsByClassName('ct');
        for(var j = 0; j < list2.length; j++)
        {
            if(list2[j].innerHTML.indexOf('前') > 0)
            {
                var minute = list2[j].innerHTML.substring(0, list2[j].innerHTML.indexOf('前')).replace('分钟', '');
                var d = new Date();
                d.setMinutes(d.getMinutes()-minute);
                list2[j].innerHTML = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
            }
        }
    }

    setInterval(fuxk, 1000);
})();