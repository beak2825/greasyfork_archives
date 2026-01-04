// ==UserScript==
// @name         box3pvpscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  goodpvpscript
// @author       bluebuff
// @match        https://box3.codemao.cn/p/*
// @icon       https://static.box3.codemao.cn/img/QmRZQhZa1XBHCVD8hXwukTpyYeGUqVDxPg6TGZCTcMseCz_272_272_cover.avif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469336/box3pvpscript.user.js
// @updateURL https://update.greasyfork.org/scripts/469336/box3pvpscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function IsNum(s)
{
    if(s!=null){
        var r,re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = s.match(re);
        return (r==s)?true:false;
    }
    return false;
}
document.onkeydown = function(event){
	if(!IsNum(event.key)){return}
	if(event.key!='0'){document.func.state.box3.chat.sendMessage(event.key);}
}
})();