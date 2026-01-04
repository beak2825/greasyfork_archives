// ==UserScript==
// @version        2017.11.03
// @name 记呗getJSON
// @description 记呗详单页面生出JSON复制粘贴给来贝用
// @namespace licai.p2peye.com
// @match http://licai.p2peye.com/member/assetsp2pLoan/?id=*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/34949/%E8%AE%B0%E5%91%97getJSON.user.js
// @updateURL https://update.greasyfork.org/scripts/34949/%E8%AE%B0%E5%91%97getJSON.meta.js
// ==/UserScript==
$(function(){
  var $ul=$(".plat-info-list.clearfix");  
  var $div=$(".palt-info-tips.clearfix");  
  //$div.css("background-color","green");
  //平台
  var website=$(".mod-title-word:eq(0)").text();
  //项目
  var project=$.trim($(".mod-title-tips:eq(0)").text()).substring(1,$(".mod-title-tips:eq(0)").text().length-1); 
  //金额
  var amount=$(".plat-info-number:eq(0)").text();
  //日期
  var investdate=$(".palt-info-tips-item-black:eq(1)").text();
  //投资期限
  var investterm=$(".palt-info-tips-item-black:eq(2)").text();
  //管理费
  var managementfee=$(".palt-info-tips-item-black:eq(3)").text();
  //年化利率
  var rate=$div.find("div.palt-info-tips-item:eq(5)").find("span:eq(1)").text().replace("%","");
  //还款方式
  var rembtype=$(".palt-info-tips-item-black:eq(6)").text();
  //奖励抵扣
  var reward=$(".palt-info-tips-item-black:eq(7)").text();
  
  var invest=new Object();
  invest.website=website;
  invest.project=project;
  invest.amount=amount;
  invest.investdate=investdate;
  invest.investterm=investterm;
  invest.managementfee=managementfee;
  invest.rate=rate;
  invest.rembtype=rembtype;
  invest.website=website;
  invest.reward=reward;
  var jsondata = JSON.stringify(invest);  
  //alert(jsondata);
  //{"name":"中国", "province":"黑龙江"}
  var showtext='<input id="showtext" type="text" style="width:100%;height:24px;color:green;"/>';
  $(".section-wrap:first").prepend(showtext);
  //$("#J_relative .mod-title-word")text(jsonstr);
  $("#showtext").val(jsondata);
  
});
