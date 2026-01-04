// ==UserScript==
// @name        安全教育平台20220523
// @namespace   Violentmonkey Scripts
// @match       *://*.xueanquan.com/*
// @grant       none
// @version     1.1
// @author      -
// @license      GPL
// @description 安全教育平台 自动答题
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/445456/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B020220523.user.js
// @updateURL https://update.greasyfork.org/scripts/445456/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B020220523.meta.js
// ==/UserScript==
document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
    window.addEventListener ("load", pageFullyLoaded);

    function DOM_ContentReady () {
        // 2ND PART OF SCRIPT RUN GOES HERE.
        // This is the equivalent of @run-at document-end
        console.log ("==> 2nd part of script run.", new Date() );
    }

    function pageFullyLoaded () {
     am=setTimeout(function(){
       /*作业视频学习*/
        if(window.location.href.indexOf("student/SeeVideo.html?",0)>0)
  {
   if(window.document.getElementById("buzhou2s").attributes["style"].value=="")
{
window.opener=null;
window.open('','_self');
window.close();

}

       ShowTestPaper()
start = new Date().getTime();
  while (new Date().getTime() < start +6000);
mm=window.document.getElementsByTagName("input");
for(i=0;i<mm.length;i++)
{
if(mm.item(i).value==1)
{
mm.item(i).click();
};
};
start = new Date().getTime();
  while (new Date().getTime() < start +10000);
window.document.getElementsByClassName("btn_submit")[0].click();
   };    
       /*防溺水教育*/
         if(window.location.href.indexOf("2022yfns/jiating",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 3000);
    
    
    
    
    window.document.getElementsByClassName("btn btnOnpage btn-warning")[0].click();
  }
if(window.location.href.indexOf("022yfns/wenjuan.html?",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
    if(window.document.getElementsByClassName("layui-layer-content").length>0)
{
window.opener=null;
window.open('','_self');
window.close();

};
$("#radio_0_1").attr("checked","checked").click();
$("#radio_0_2").attr("checked","checked").click();
$("#radio_2_3").attr("checked","checked").click();
$("#radio_1_4").attr("checked","checked").click();
$("#radio_4_5").attr("checked","checked").click();
$("#radio_0_6").attr("checked","checked").click();
$("#radio_2_7").attr("checked","checked").click();
$("#radio_0_8").attr("checked","checked").click();
$("#radio_1_9").attr("checked","checked").click();
$("#radio_1_10").attr("checked","checked").click();
$("#radio_0_11").attr("checked","checked").click();
$("#radio_1_12").attr("checked","checked").click();
$("#radio_0_13").click();
$("#radio_1_13").click();
$("#radio_2_13").click();
$("#radio_3_13").click();
$("#radio_4_13").click();
$("#radio_5_13").click();
$("#radio_6_13").click();
$("#radio_0_14").click();
$("#radio_3_14").click();
$("#radio_5_14").click();
$("#radio_8_14").click();
$("#radio_1_15").attr("checked","checked").click();
$("#radio_0_16").click();
$("#radio_1_16").click();
$("#radio_5_16").click();
$("#radio_1_17").attr("checked","checked").click();
$("#radio_0_18").attr("checked","checked").click();
$("#radio_0_19").attr("checked","checked").click();
$("#radio_1_20").attr("checked","checked").click();
$("#radio_1_21").attr("checked","checked").click();
$("#radio_0_22").click();
$("#radio_1_22").click();
$("#radio_2_22").click();
$("#radio_4_22").click();
$("#radio_6_22").click();
$("#radio_2_23").click();
$("#radio_3_23").click();
$("#radio_4_23").click();
$("#radio_2_24").attr("checked","checked").click();
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
    window.document.getElementsByClassName("btn")[0].click()
  };
  /*消防安全主题教育*/
    if(window.location.href.indexOf("2022zkxfaq/shipin",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 3000);
    window.document.getElementsByClassName("btn btnOnpage btn-warning")[0].click();
  }
if(window.location.href.indexOf("2022zkxfaq/wenjuan.html?",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
     if(window.document.getElementsByClassName("layui-layer-content").length>0)
{
window.opener=null;
window.open('','_self');
window.close();

};
$("#radio_0_1").attr("checked","checked").click();
$("#radio_0_2").attr("checked","checked").click();
$("#radio_0_3").attr("checked","checked").click();
$("#radio_1_4").attr("checked","checked").click();
$("#radio_0_5").attr("checked","checked").click();
$("#radio_1_6").attr("checked","checked").click();
$("#radio_0_7").attr("checked","checked").click();
$("#radio_0_8").attr("checked","checked").click();
$("#radio_0_9").attr("checked","checked").click();
$("#radio_0_10").attr("checked","checked").click();
$("#radio_0_11").attr("checked","checked").click();
$("#radio_0_12").attr("checked","checked").click();
$("#radio_0_13").attr("checked","checked").click();
$("#radio_0_14").attr("checked","checked").click();
$("#radio_0_15").attr("checked","checked").click();
$("#radio_0_16").attr("checked","checked").click();
$("#radio_0_17").attr("checked","checked").click();
$("#radio_2_18").attr("checked","checked").click();
$("#radio_0_19").attr("checked","checked").click();
$("#radio_0_20").attr("checked","checked").click();
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
    window.document.getElementsByClassName("btn")[0].click()     
  }; 
/*512减灾防灾*/
    if(window.location.href.indexOf("2022fzjz/jiating",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 3000);
    window.document.getElementsByClassName("btn btnOnpage btn-warning")[0].click();
  }
if(window.location.href.indexOf("2022fzjz/test.html?",0)>0)
  {
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
     if(window.document.getElementsByClassName("layui-layer-content").length>0)
{
window.opener=null;
window.open('','_self');
window.close();

};
$("#radio_2_1").attr("checked","checked").click();
$("#radio_0_2").attr("checked","checked").click();
$("#radio_0_3").attr("checked","checked").click();
$("#radio_1_4").attr("checked","checked").click();
$("#radio_1_5").attr("checked","checked").click();
$("#radio_2_6").attr("checked","checked").click();
$("#radio_0_7").attr("checked","checked").click();
$("#radio_1_8").attr("checked","checked").click();
$("#radio_2_9").attr("checked","checked").click();
$("#radio_0_10").attr("checked","checked").click();
$("#radio_2_11").attr("checked","checked").click();
$("#radio_0_12").click();
$("#radio_1_12").click();
$("#radio_2_12").click();
$("#radio_3_12").click();
$("#radio_0_13").click();
$("#radio_1_13").click();
$("#radio_2_13").click();
$("#radio_0_14").click();
$("#radio_1_14").click();
$("#radio_2_14").click();
$("#radio_3_15").click();
    start = new Date().getTime();
  while (new Date().getTime() < start + 6000);
    window.document.getElementsByClassName("btn")[0].click()
  };
    },10000);
                 };     