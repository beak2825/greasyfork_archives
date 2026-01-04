// ==UserScript==
// @name        店小秘[速卖通]列表显示全部🛠
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://www.dianxiaomi.com/smtProduct/*
// @grant       GM_xmlhttpRequest
// @require https://update.greasyfork.org/scripts/499487/1427818/%E5%BA%97%E5%B0%8F%E7%A7%98%E9%80%9A%E7%94%A8%E5%87%BD%E6%95%B0.js
// @require https://update.greasyfork.org/scripts/522088/1512255/%E6%89%A9%E5%B1%95%E5%8A%9F%E8%83%BD.js
// @grant       none
// @version     1.13
// @author      -
// @description 2024/10/29 10:56
// @downloadURL https://update.greasyfork.org/scripts/504469/%E5%BA%97%E5%B0%8F%E7%A7%98%5B%E9%80%9F%E5%8D%96%E9%80%9A%5D%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%F0%9F%9B%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/504469/%E5%BA%97%E5%B0%8F%E7%A7%98%5B%E9%80%9F%E5%8D%96%E9%80%9A%5D%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%F0%9F%9B%A0.meta.js
// ==/UserScript==
var bnt = $(`<li class='showall'><a href="javascript:;">显示全部</a></li>`);
const pushBnt = function(){
  bnt.on("click",async function(){
    $('#loading').modal('show');
    var url = 'https://www.dianxiaomi.com/smtProduct/pageList.htm'
    var data = smtPageListSearchData();
    data.pageSize = '300';
    let book = await tool.getTotalPage(url,data,op='POST');
    pages = book[0];
    for (var i = 1;i<book.length;i++){
      pages.find("#goodsContent tbody.xianshishujudate").append(book[i].find("#goodsContent tr.content"));
    }
    var html = pages.map(function(){return this.outerHTML}).toArray().join("");
    $('#pageList').html(html)
    $('#loading').modal('hide');
  });
  var hasList = !!$("#pageList");
  if(hasList && !$("li.showall").length){
    $("#upPage:has(*),#downPage:has(*)").append(bnt);
  }
}

window.onload = function(){
  pushBnt();
  $(".in-container:eq(0)").append(single);
  const MYJ_PAGINATION_init_HOOK = unsafeWindow.MYJ_PAGINATION.init;
  unsafeWindow.MYJ_PAGINATION.init = function(option,id,call){
    MYJ_PAGINATION_init_HOOK(option,id,call);
    pushBnt();
  }
}
