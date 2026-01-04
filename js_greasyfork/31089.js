// ==UserScript==
// @name         网易云音乐屏蔽指定人动态
// @namespace    undefined
// @version      0.1.2
// @description  初始加载和滚动时，搜索指定人动态并屏蔽；若要修改名单，在开头的NetEaseBlockedAccountList中修改对象的id即可
// @author       Sora Shiro
// @match        http://music.163.com/*
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/31089/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BA%BA%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/31089/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E4%BA%BA%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard

var NetEaseBlockedAccountList = ["9003","201586"]; //云音乐小秘书，原创君id

$(document).ready(function(){
  deleteMessage(NetEaseBlockedAccountList);
});

$(window).scroll(function(event){
  deleteMessage(NetEaseBlockedAccountList);
});

function deleteMessage(ids) {
  var allItems = $(".itm");
  var allItemsLength = allItems.length;
  allItems.each(function(index, element){
    var linkToCheck = $(this).find(".gcnt").find(".dcntc").find(".type").find(".s-fc7");
    var nowItem = this;
    ids.map(function(val) {
      if(linkToCheck.attr("href") == ("/user/home?id="+val)){
        nowItem.remove();
      }
    });
  });
}