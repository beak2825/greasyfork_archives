// ==UserScript==
// @name         bangumi ep信息框隐藏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  当鼠标不在ep格上或ep提示框上时，ep提示框即消失
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in).*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37168/bangumi%20ep%E4%BF%A1%E6%81%AF%E6%A1%86%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/37168/bangumi%20ep%E4%BF%A1%E6%81%AF%E6%A1%86%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    var mouse_in_infbox = false;
    var mouse_in_btn = false;
    $("#cluetip").mouseenter(function() {
        mouse_in_infbox = true;
    }).mouseleave(function() {
        mouse_in_infbox = false;
    });
    $("a.load-epinfo").mouseenter(function(){
        mouse_in_btn = true;
    }).mouseleave(function() {
        mouse_in_btn = false;
    });
    $("body").mousemove(function(){
        if(!mouse_in_btn && !mouse_in_infbox){
            $("#cluetip").css("display","none");
        }
    });
})();