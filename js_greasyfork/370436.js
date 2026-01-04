// ==UserScript==
// @name         旧参谋下拉关键字
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Just for myself!
// @author       pealpool
// @match        https://sycm.taobao.com/mq/industry/rank/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370436/%E6%97%A7%E5%8F%82%E8%B0%8B%E4%B8%8B%E6%8B%89%E5%85%B3%E9%94%AE%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/370436/%E6%97%A7%E5%8F%82%E8%B0%8B%E4%B8%8B%E6%8B%89%E5%85%B3%E9%94%AE%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    $("body").on("click",function(){
        if($(".table-search input").attr("list")!="mymylist"){
            $(".table-search input").attr("list","mymylist");
            $(".table-search input").after("<datalist id='mymylist'><option value='卫生间瓷砖'><option value='小白砖'></option><option value='六'></option><option value='马卡龙'></option><option value='仿古砖地板砖'></option></datalist>");
        }
    });
})();
