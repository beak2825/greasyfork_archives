// ==UserScript==
// @name         SG屏蔽用户帖子
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  基德基德
// @author       You
// @match        *://bbs.sgamer.com/forum*
// @grant        unsafewindow
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386518/SG%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/386518/SG%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
var $ = window.jQuery;
var ums = new Array('屏蔽1','屏蔽2','屏蔽3') //此处修改屏蔽用户名，数量可自行添加
var list = $("tbody[id^='normalthread']")
var user = list.find('cite').find('a')
    for (var i = 0 ; i< list.length ; i++){
        for (var n = 0 ; n < ums.length ; n++){
        if(user.eq(i*2).text()==ums[n]){
            list.eq(i).remove()
        }
        }
    }
})();