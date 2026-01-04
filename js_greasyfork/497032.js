// ==UserScript==
// @name            巴蜀OJ窗口可拖动化
// @namespace       https://greasyfork.org/users/1265383
// @version         1.4.1
// @description     支持拖动巴蜀OJ的窗口，兼容 巴蜀OJ自动发信机+自动删信机(https://greasyfork.org/zh-CN/scripts/488385)
// @author          123asdf123(luogu 576074)
// @match           https://oj.bashu.com.cn/*/problempage.*
// @match           https://oj.bashu.com.cn/*/mail.*
// @match           https://oj.bashu.com.cn/*/ranklist.*
// @icon            https://oj.bashu.com.cn/favicon.ico
// @license         SATA
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/497032/%E5%B7%B4%E8%9C%80OJ%E7%AA%97%E5%8F%A3%E5%8F%AF%E6%8B%96%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497032/%E5%B7%B4%E8%9C%80OJ%E7%AA%97%E5%8F%A3%E5%8F%AF%E6%8B%96%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var o,mx, my, ox, oy;
    function e(event){
        if( !event){
            event = window.event;
            event.target = event.srcElement;
            event.layerX = event.offsetX;
            event.layerY = event.offsetY;
        }
        event.mx = event.pageX || event.clientX + document.body.scrollLeft;
        event.my = event.pageY || event.clientY + document.body.scrollTop;
        return event;
    }
    document.onmousedown = function(event){
//		console.log(event)
		if(event.target.offsetParent.id!="SubmitModal"&&event.target.offsetParent.id!="NoteModal"&&event.target.offsetParent.id!="MailModal"&&event.target.offsetParent.id!="UserModal"){
			return;
		}
        event = e(event);
        o = event.target.offsetParent;
        ox = parseInt(o.offsetLeft);
        oy = parseInt(o.offsetTop);
        mx = event.mx;
        my = event.my;
        document.onmousemove = move;
        document.onmouseup = stop;
    }
    function move(event){
        event = e(event);
   	    o.style.left = ox + event.mx - mx+ o.offsetWidth/2 + "px";
        o.style.top = oy + event.my - my + "px";
		o.style.position = "absolute";
    }
    function stop(event){
       event = e(event);
       ox = parseInt(o.offsetLeft);
       oy = parseInt(o.offsetTop);
       mx = event.mx ;
       my = event.my ;
       o = document.onmousemove = document.onmouseup = null;
    }
})();