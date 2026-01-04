// ==UserScript==
// @name         显示B站视频av号、BV号、弹幕CID
// @namespace    http://s.xmcp.ml/
// @version      0.2
// @description  B站强推bvid，不知道在搞什么飞机
// @author       xmcp
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398496/%E6%98%BE%E7%A4%BAB%E7%AB%99%E8%A7%86%E9%A2%91av%E5%8F%B7%E3%80%81BV%E5%8F%B7%E3%80%81%E5%BC%B9%E5%B9%95CID.user.js
// @updateURL https://update.greasyfork.org/scripts/398496/%E6%98%BE%E7%A4%BAB%E7%AB%99%E8%A7%86%E9%A2%91av%E5%8F%B7%E3%80%81BV%E5%8F%B7%E3%80%81%E5%BC%B9%E5%B9%95CID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elem=document.querySelector('#viewbox_report>.video-data:last-child');
    if(!elem) return;

    let showtxt='';

    function add(pref,txt) {
        if(txt) {
            showtxt+=(pref+txt+' · ').replace(/"/g,'\\"');
        }
    }

    add('av',window.aid);
    add('',window.bvid);
    add('cid=',window.cid);

    if(showtxt) {
        // some hack to avoid conflict with virtual dom

        // first put a content to ::before psuedo element, keeping virtual dom happy
        let style=document.createElement('style');
        style.textContent='#viewbox_report>.video-data:last-child::before {margin-right: .5em; visibility: hidden; content: "'+showtxt+'"}';
        document.head.appendChild(style);

        // but text in pseudo element is not selectable
        // we solve this by overlaying another div which is out of virtual dom
        let overlay=document.createElement('div');
        overlay.textContent=showtxt;
        overlay.style.color='#999';
        overlay.style.position='absolute';
        overlay.style.paddingRight='.5em';
        document.body.appendChild(overlay);
        console.log(overlay);

        // remember to keep it in the right position
        function repos() {
            let pos=elem.getBoundingClientRect();
            overlay.style.top=pos.y+'px';
            overlay.style.left=pos.x+'px';
        }
        repos();
        setTimeout(repos,100);
        setTimeout(repos,500);
        window.addEventListener('resize',()=>{
            repos();
            // if something is happening async
            setTimeout(repos,100);
        });
    }
})();
