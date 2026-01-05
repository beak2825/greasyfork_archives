// ==UserScript==
// @version        2016.12.27
// @name        网贷秘书简化页面操作 1.0
// @namespace   WangDaiMiShu
// @include      http://www.wangdaimishu.com/*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @description 网贷秘书简化页面
// @installurl Shined up real nice. https://greasyfork.org/en/scripts/25904-%E7%BD%91%E8%B4%B7%E7%A7%98%E4%B9%A6%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C-1-0
// @downloadURL https://update.greasyfork.org/scripts/25904/%E7%BD%91%E8%B4%B7%E7%A7%98%E4%B9%A6%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/25904/%E7%BD%91%E8%B4%B7%E7%A7%98%E4%B9%A6%E7%AE%80%E5%8C%96%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%2010.meta.js
// ==/UserScript==
$(function () { 
  $(".ui-grid-5").remove();
$("#tpl").removeAttr("checked");
  //hide laizhetou
  $(".red-bg").each(function(i,item){
    var vtd=$(item).find("td:eq(2)");
    var stitle=$(vtd).find("span:first").text();    
    if(stitle=="来这投"){
      $(item).hide();
    }
  });
  
  $(".change-status").each(function(i,item){
    $(item).parent().parent().prev().prev().prev().HIDE
    var dataID=$(item).attr("data-id");
    var repaymentDate=$(item).parent().parent().prev().prev().prev().find(".red:first").text();
    var longRepaymentDate=repaymentDate+" 15:00:00";
    $(item).find("span:first").text("【--否--】");    
    //点击回款状态，自动填写约定还款日而非today，自动点击确认post
     $(item).click(function(){
       $("#d"+dataID).val(longRepaymentDate);         
       $(".ui-button-sorange[data-id="+dataID+"]").click();      
     });   
  });

});
