// ==UserScript==
//@icon
// @name         金融界读书频道页面洁净
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  清理页面多余元素
// @author       蛋大官人
// @match      *://book.jrj.com.cn/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/377757/%E9%87%91%E8%9E%8D%E7%95%8C%E8%AF%BB%E4%B9%A6%E9%A2%91%E9%81%93%E9%A1%B5%E9%9D%A2%E6%B4%81%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377757/%E9%87%91%E8%9E%8D%E7%95%8C%E8%AF%BB%E4%B9%A6%E9%A2%91%E9%81%93%E9%A1%B5%E9%9D%A2%E6%B4%81%E5%87%80.meta.js
// ==/UserScript==

(function() {
h();
function h(){
    var leftdiv = $('[class="left"]');
    var ad = $('[class$="ad"]');
    var rightdiv = $('[class$="wrap"]');
    leftdiv.hide();
    ad.hide();
    //alert(rightdiv.length);
    rightdiv.css('width','955px');
}
})();