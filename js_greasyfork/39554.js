// ==UserScript==
// @name         Pocket select all
// @name:zh-CN   Pocket全选
// @namespace    hoothin
// @version      0.1
// @description  Select all item on getpocket.com
// @description:zh-CN  在Pocket列表页内添加全选按钮
// @author       hoothin
// @include      https://getpocket.com/a/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39554/Pocket%20select%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/39554/Pocket%20select%20all.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($(".bulkedit-status>p").length<1)return;
    var selectBtn=document.createElement("a");
    selectBtn.href="#";
    selectBtn.innerHTML="Select All";
    selectBtn.style="position: absolute;left: -100px;top: 15px;";
    selectBtn.onclick=function(e){$(".item_content").click();};
    $(".bulkedit-status>p").after(selectBtn);
})();