// ==UserScript==
// @name         展示av bv号
// @namespace    http://tampermonkey.net/
// @version      0.1.3.2
// @description  在视频上方展示av bv号
// @author       桜wuxin
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407383/%E5%B1%95%E7%A4%BAav%20bv%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/407383/%E5%B1%95%E7%A4%BAav%20bv%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        var path = window.location.pathname;
        var all = path.split('/',-1);
        var av = window.aid;
        var bv = window.bvid;
        var cv = window.cid;
        if(all[1] == 'video'){
            var des = document.querySelector('.l-con');
            var div = des.querySelector('#viewbox_report')
            var span = document.createElement('span');
            des.insertBefore(span,div);
            span.innerHTML = '当前视频的av号:av'+ av + ';bv号:'+ bv + ';cv号:' + cv + '<a href="https://space.bilibili.com/29058270" target="_blank" style="color:blue;fontsize:20px" title="点击进入作者主页">.By 桜ミクSakuraMikku </a>' ;
            span.style.color = 'pink';
            span.style.fontSize = '20px';
        }else if(all[1] == 'bangumi'){
            div = document.querySelector('.plp-l');
            span = document.createElement('span');
            div.insertBefore(span,div.childNodes[0]);
            span.innerHTML = '当前番剧或放映厅的av号:av'+ av + ';bv号:'+ bv + ';cv号:' + cv + '<a href="https://space.bilibili.com/29058270" target="_blank" style="color:blue;fontsize:20px" title="点击进入作者主页">.By 桜ミクSakuraMikku </a>' ;
            span.style.color = 'pink';
            span.style.fontSize = '20px';
        }
    },3000)
})();