// ==UserScript==
// @name        discord.com
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/channels/@me/*
// @grant       none
// @version     1.1
// @author      ligg
// @description 2024/2/18 02:37:56
// @downloadURL https://update.greasyfork.org/scripts/487539/discordcom.user.js
// @updateURL https://update.greasyfork.org/scripts/487539/discordcom.meta.js
// ==/UserScript==

(function(){
  function set_lineheight(){
    //
    var divs = document.querySelectorAll('main div');
    // 遍历所有获取到的 div 元素
    divs.forEach(function(div) {
  // 设置行高为 34px
      div.style.lineHeight = '2em';
    });

    // 获取所有 class 为 "markup_a7e664 messageContent_abea64" 的 div 元素
    var elements = document.querySelectorAll('.markup_a7e664.messageContent_abea64');

    // 循环遍历每个选中的元素
    elements.forEach(function(element) {
        // 设置行高为 2.5
        element.sytle.height = '34px';
        element.style.lineHeight = '34px';
    });
}

  setInterval(set_lineheight, 5000);
})()


