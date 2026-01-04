// ==UserScript==
// @name         必应Rewards古诗词
// @version      1.1.2
// @description  必应Rewards当日任务自动完成工具
// @author       lakeside
// @match        https://www.bing.com/*
// @match        https://www*.bing.com/*
// @match        https://cn.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/33418
// @downloadURL https://update.greasyfork.org/scripts/460900/%E5%BF%85%E5%BA%94Rewards%E5%8F%A4%E8%AF%97%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/460900/%E5%BF%85%E5%BA%94Rewards%E5%8F%A4%E8%AF%97%E8%AF%8D.meta.js
// ==/UserScript==

var max_rewards = 30; /*每次重复执行的次数*/

let menu1 = GM_registerMenuCommand('开始', function () {
    GM_setValue('Cnt', 0);
    location.href="https://www.bing.com/?br_msg=Please-Wait"
}, 'o');

let menu2 = GM_registerMenuCommand('停止', function () {
    GM_setValue('Cnt', max_rewards + 10);
}, 'o');

let menu3 = GM_registerMenuCommand('切换文学', function () {
    GM_setValue('Type', 'd');
}, 'o');

let menu4 = GM_registerMenuCommand('切换诗词', function () {
    GM_setValue('Type', 'i');
}, 'o');

let menu5 = GM_registerMenuCommand('切换网易云', function () {
    GM_setValue('Type', 'j');
}, 'o');

let menu6 = GM_registerMenuCommand('切换哲学', function () {
    GM_setValue('Type', 'k');
}, 'o');

function GenWords(n) {
    var t = new XMLHttpRequest();
    t.open("get", n),
        (t.withCredentials = false),
        t.send(),
        (t.onreadystatechange = function (n) {
        if (4 === t.readyState) {
            var o = JSON.parse(t.responseText);
        //    console.log(o.data);
        //alert(o.data);
            GM_setValue('query_data', o.hitokoto);
        }
    });
}

(function() {
    'use strict';

    if(GM_getValue('Cnt') == null){GM_setValue('Cnt', max_rewards + 10);}

    //alert(GM_getValue('Cnt'));
    if(GM_getValue('Cnt') < max_rewards){

        if (GM_getValue('Type') == null) {
            GenWords('https://v1.hitokoto.cn/?encode=json');
        } else if (GM_getValue('Type') == 'd') {
            GenWords('https://v1.hitokoto.cn/?c=d&encode=json');
        } else if (GM_getValue('Type') == 'i') {
            GenWords('https://v1.hitokoto.cn/?c=i&encode=json');
        } else if (GM_getValue('Type') == 'j') {
            GenWords('https://v1.hitokoto.cn/?c=j&encode=json');
        } else if (GM_getValue('Type') == 'k') {
            GenWords('https://v1.hitokoto.cn/?c=k&encode=json');
        }

        let tt = document.getElementsByTagName("title")[0];
        tt.innerHTML = "[" + GM_getValue('Cnt') + " / " + max_rewards + "] " + tt.innerHTML;

        setTimeout(function(){
            GM_setValue('Cnt', GM_getValue('Cnt') + 1);
            location.href = "https://www.bing.com/search?q=" + encodeURI( GM_getValue('query_data') );
        }, 3000);
    }
})();