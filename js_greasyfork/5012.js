// ==UserScript==
// @name           My HKG Style
// @namespace      https://greasyfork.org/users/1006-peach
// @version        1.1.12
// @description    My Style using at HKGolden
// @homepageURL    https://greasyfork.org/users/1006-peach
// @include        http://*.hkgolden.com/topics.aspx*
// @include        http://*.hkgolden.com/view.aspx*
// @include        http://*.hkgolden.com/*rofile*age.aspx*
// @include        http://*.hkgolden.com/*earch*.aspx*
// @include        http://*.hkgolden.com/secondHand.aspx*
// @include        http://*.hkgolden.com/addSecondHand.aspx*
// @include        http://*.hkgolden.com/post.aspx*
// @include        http://*.hkgolden.com/login.aspx*
// @include        https://*.hkgolden.com/topics.aspx*
// @include        https://*.hkgolden.com/view.aspx*
// @include        https://*.hkgolden.com/*rofile*age.aspx*
// @include        https://*.hkgolden.com/*earch*.aspx*
// @include        https://*.hkgolden.com/secondHand.aspx*
// @include        https://*.hkgolden.com/addSecondHand.aspx*
// @include        https://*.hkgolden.com/post.aspx*
// @include        https://*.hkgolden.com/login.aspx*
// @include        https://*.hkgolden.com/SendPM.aspx*
// @require        http://code.jquery.com/jquery-1.10.2.min.js
// @copyright      2015-2017, Peach
// @downloadURL https://update.greasyfork.org/scripts/5012/My%20HKG%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/5012/My%20HKG%20Style.meta.js
// ==/UserScript==

var currentServer;
currentServer = window.location.href.match(/(forum\d+|forum|search|profile|archive)/)[0];

setTimeout(function() {

// 頂部藍啡黃BRA + Logo
  jQuery('#aspnetForm > table:eq(0)').remove();

// 頂部空白
  jQuery('.PageMiddleFunctions').remove();
  jQuery('.PageMiddleBox').css('padding', '0 4px').css('width', '947px');
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div[style="height:5px"]:eq(0)').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(2)').css('height', '0');

// 頂部斷行
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > br:eq(0)').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > br:last').remove();
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > br:last').remove();

  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > br:eq(0)').remove();
  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > br:last').remove();
  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > br:last').remove();

// 頂部闊度
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0)').css('width', '100%');
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(1)').css('width', '0%');

// 閣下膠名
  jQuery('.ContentPanel a[href^="ProfilePage.aspx?userid="]:eq(0)').css('font-size', '16px').css('font-weight', 'bold');

// [公司模式-關]
  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0)').css('font-size', '12px').css('font-weight', 'normal');

// 您現在聚腳在
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0)').css('font-size', '12px').css('font-weight', 'normal');
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > span:eq(0)').css('font-size', '16px').css('font-weight', 'bold');
  jQuery('.ContentPanel > table:eq(0) > tbody:eq(0) > tr:eq(0) > td:eq(0) > div:eq(0) > b:eq(0)').css('font-size', '12px').css('font-weight', 'normal');

  jQuery('#ctl00_ContentPlaceHolder1_view_form > table:eq(0) > tbody > tr:eq(0) > td:eq(0) > div:eq(0) > b:eq(0)').css('font-weight', 'normal');

// 搜尋BRA
  jQuery('.Topic_FunctionPanel > div:eq(0) > br:eq(0)').remove();
  jQuery('.Topic_FunctionPanel > div:eq(0) > br:eq(0)').remove();
  jQuery('.Topic_FunctionPanel > div:eq(1) > br:eq(0)').remove();
  jQuery('.Topic_FunctionPanel > div:eq(0) > a > img[alt="New"]').css('border-width', '0px').css('vertical-align', 'bottom');
  jQuery('.HitSearchText').css('font-size', '12px');
  jQuery('a.hitsearch_link').css('font-size', '12px');
  jQuery('.Topic_FunctionPanel').css('margin', '0');

// Google自訂搜尋
  jQuery('.Topic_FunctionPanel > div:eq(1) > div:eq(0)').css('float', 'left').css('margin-right', '5px').css('margin-bottom', '0');
  jQuery('.Topic_FunctionPanel > div:eq(1) > div:eq(1)').css('float', 'right').css('margin-bottom', '0');

// » 高登主頁 »
  jQuery('#ctl00_ContentPlaceHolder1_view_form > div:eq(1)').css('float', 'left').css('padding', '0');
  jQuery('#ctl00_ContentPlaceHolder1_view_form > div:eq(2)').css('float', 'right').css('padding', '0');
  jQuery('#ctl00_ContentPlaceHolder1_view_form > div:eq(3)').css('clear', 'both');

// 投票站
  var $voting=jQuery('#ctl00_ContentPlaceHolder1_votingThreadMsg').html();
  if($voting){
      jQuery('#ctl00_ContentPlaceHolder1_votingThreadMsg').remove();
      jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;['+$voting+'] ');
  }

// 提名每月之星
  var $nominate=jQuery('#ctl00_ContentPlaceHolder1_nominateLabel').html();
  if($nominate){
      jQuery('#ctl00_ContentPlaceHolder1_nominateLabel').remove();
      jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;['+$nominate+'] ');
  }

// 精選文章
  if (jQuery('#Iframe1').length !== 0) {
    var t=0;
    jQuery('#Iframe1').parent().css({'display': 'block'});
    jQuery('#Iframe1').parent().css({'height': '0px'});
    jQuery('#Iframe1').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topart" href="#">精選文章</a>] ');
    jQuery('.topart').click(function(){
      if(t===0){
        jQuery('#Iframe1').animate({'height':'240px'});
        jQuery('#Iframe1').parent().animate({'height':'255px'});
        t=1;
      }else{
        jQuery('#Iframe1').animate({'height':'0px'});
        jQuery('#Iframe1').parent().animate({'height':'0px'});
        t=0;
      }
    });
  }

// 高登指數
  if (jQuery('#ddtabs1').length !== 0) {
    var gi=0;
    jQuery('#ddtabs1').parent().css({'display': 'block'});
    jQuery('#ddtabs1').parent().css({'height': '0px'});
    var ddtabsH=jQuery('.tabcontainer').height()+40;
    jQuery('#ddtabs1').hide();
    jQuery('#ddtabs1').parent().find('.tabcontainer').hide();
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="goldenIndex" href="#">高登指數</a>] ');
    jQuery('.goldenIndex').click(function(){
      if(gi===0){
        jQuery('#ddtabs1 .current').removeClass('current');
        jQuery('#ddtabs1 [rel="sc2"]').addClass('current');
        jQuery('#sc1').hide();
        jQuery('#sc3').hide();
        jQuery('#sc2').show();
        jQuery('#ddtabs1').parent().animate({'height':ddtabsH});
        jQuery('#ddtabs1').show();
        jQuery('#ddtabs1').parent().find('.tabcontainer').show();
        gi=1;
      }else{
        jQuery('#ddtabs1').parent().animate({'height':'0px'});
        jQuery('#ddtabs1').hide();
        jQuery('#ddtabs1').parent().find('.tabcontainer').hide();
        gi=0;
      }
    });
  }

// 直播台
  if (jQuery('[style="height:255px;"] > iframe').length !== 0) {
    var jt=0;
    jQuery('[style="height:255px;"] > iframe').addClass('jt');
    jQuery('.jt').parent().css({'display': 'block'});
    jQuery('.jt').parent().css({'height': '0px'});
    jQuery('.jt').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topjt" href="#">直播台活動表</a>] ');
    jQuery('.topjt').click(function(){
      if(jt===0){
        jQuery('.jt').animate({'height':'260px'});
        jQuery('.jt').parent().animate({'height':'260px'});
        jt=1;
      }else{
        jQuery('.jt').animate({'height':'0px'});
        jQuery('.jt').parent().animate({'height':'0px'});
        jt=0;
      }
    });
  }

// 熱門著數
  if (jQuery('[style="height:291px;"] > iframe').length !== 0) {
    var hj=0;
    jQuery('[style="height:291px;"] > iframe').addClass('hj');
    jQuery('.hj').parent().css({'display': 'block'});
    jQuery('.hj').parent().css({'height': '0px'});
    jQuery('.hj').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="tophj" href="#">熱門著數</a>] ');
    jQuery('.tophj').click(function(){
      if(hj===0){
        jQuery('.hj').animate({'height':'260px'});
        jQuery('.hj').parent().animate({'height':'260px'});
        hj=1;
      }else{
        jQuery('.hj').animate({'height':'0px'});
        jQuery('.hj').parent().animate({'height':'0px'});
        hj=0;
      }
    });
  }

// 熱門著數@view.aspx
  if (jQuery('[style="height:290px;"] > iframe').length !== 0) {
    var hj2=0;
    jQuery('[style="height:290px;"] > iframe').addClass('hj2');
    jQuery('.hj2').parent().css({'display': 'block'});
    jQuery('.hj2').parent().css({'height': '0px'});
    jQuery('.hj2').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="tophj2" href="#">熱門著數</a>] ');
    jQuery('.tophj2').click(function(){
      if(hj2===0){
        jQuery('.hj2').animate({'height':'260px'});
        jQuery('.hj2').parent().animate({'height':'260px'});
        hj2=1;
      }else{
        jQuery('.hj2').animate({'height':'0px'});
        jQuery('.hj2').parent().animate({'height':'0px'});
        hj2=0;
      }
    });
  }

// MTGamer
  if (jQuery('#mtblock').length !== 0) {
    var mt=0;
    jQuery('#mtblock').addClass('mt');
    jQuery('.mt').css({'display': 'block', 'overflow': 'hidden'});
    jQuery('.mt').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topmt" href="#">MTGamer</a>] ');
    jQuery('.topmt').click(function(){
      if(mt===0){
        jQuery('.mt').animate({'height':'260px'});
        mt=1;
      }else{
        jQuery('.mt').animate({'height':'0px'});
        mt=0;
      }
    });
  }

// MTGamer@20161113
  if (jQuery('[style="height:291px;"] > .container').length !== 0) {
    var mt2=0;
    jQuery('[style="height:291px;"] > .container').addClass('mt2');
    jQuery('.mt2').parent().css({'display': 'block', 'overflow': 'hidden'});
    jQuery('.mt2').parent().css({'height': '0px'});
    jQuery('.mt2').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topmt2" href="#">MTGamer</a>] ');
    jQuery('.topmt2').click(function(){
      if(mt2===0){
        jQuery('.mt2').animate({'height':'260px'});
        jQuery('.mt2').parent().animate({'height':'260px'});
        mt2=1;
      }else{
        jQuery('.mt2').animate({'height':'0px'});
        jQuery('.mt2').parent().animate({'height':'0px'});
        mt2=0;
      }
    });
  }

// MTGamer@20161114
  if (jQuery('#mtblock1').length !== 0) {
    var mt3=0;
    jQuery('#mtblock1').addClass('mt3');
    jQuery('.mt3').css({'display': 'block', 'overflow': 'hidden'});
    jQuery('.mt3').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topmt3" href="#">MTGamer</a>] ');
    jQuery('.topmt3').click(function(){
      if(mt3===0){
        jQuery('.mt3').animate({'height':'260px'});
        mt3=1;
      }else{
        jQuery('.mt3').animate({'height':'0px'});
        mt3=0;
      }
    });
  }

// MTGamer@20170317
  if (jQuery('#mtblock2').length !== 0) {
    var mt4=0;
    jQuery('#mtblock2').addClass('mt4');
    jQuery('.mt4').css({'display': 'block', 'overflow': 'hidden'});
    jQuery('.mt4').css({'height': '0px'});
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="topmt4" href="#">MTGamer</a>] ');
    jQuery('.topmt4').click(function(){
      if(mt4===0){
        jQuery('.mt4').animate({'height':'260px'});
        mt4=1;
      }else{
        jQuery('.mt4').animate({'height':'0px'});
        mt4=0;
      }
    });
  }

// 高登公告 in Topic page
  if (jQuery('.DivResizableBoxContainer').length !== 0) {
    var ann=0;
    var annHeight=jQuery('.DivResizableBoxContainer').height();
    jQuery('.DivResizableBoxContainer').css({'display': 'block'});
    jQuery('.DivResizableBoxContainer').css({'height': '0px'});
    jQuery('.DivResizableBoxContainer').hide();
    jQuery('#ctl00_ContentPlaceHolder1_lb_NewPM').prepend('&nbsp;[<a class="announce" href="#">高登公告</a>] ');
    jQuery('.announce').click(function(){
      if(ann===0){
        jQuery('.DivResizableBoxContainer').show();
        jQuery('.DivResizableBoxContainer').animate({'height':annHeight + 'px'});
        ann=1;
      }else{
        jQuery('.DivResizableBoxContainer').animate({'height':'0px'},400, function(){jQuery('.DivResizableBoxContainer').hide();});
        ann=0;
      }
    });
  }

//若果大家不想見到小圈子post (用日向的Ajax更新，更新後會再出現)
  if (jQuery('[style="background-color: #6EA0C4; color:white; font-family: Arial;"]').length !== 0) {
      jQuery('[style="background-color: #6EA0C4; color:white; font-family: Arial;"]').remove();
  }
/*
// 討論區守則 <- 會同二手區撞
  if (jQuery('.DivBoxContainer').length !== 0) {
      jQuery('.DivBoxContainer').remove();
  }
*/
// 伸延閱讀
  if (jQuery('#ctl00_ContentPlaceHolder1_view_form > iframe').length !== 0) {
      jQuery('#ctl00_ContentPlaceHolder1_view_form > iframe').remove();
  }

// 頂部文字廣告
  if (jQuery('[id="Top Textlink Zone 1"]').length !== 0) {
      jQuery('[id="Top Textlink Zone 1"]').parent().remove();
  }
  if (jQuery('[id="Top Textlink Zone 2"]').length !== 0) {
      jQuery('[id="Top Textlink Zone 2"]').parent().remove();
  }
  if (jQuery('[id="Top Textlink Zone 3"]').length !== 0) {
      jQuery('[id="Top Textlink Zone 3"]').parent().remove();
  }

// 右上圖形廣告
  if (jQuery('[id="Crazy Ads Zone"]').length !== 0) {
      jQuery('[id="Crazy Ads Zone"]').parent().remove();
  }
  if (jQuery('[id="Large Rectangle"]').length !== 0) {
      jQuery('[id="Large Rectangle"]').parent().remove();
  }
  if (jQuery('[id="Entry Point"]').length !== 0) {
      jQuery('[id="Entry Point"]').parent().remove();
  }

// 搜尋BRA下方文字廣告
 if (jQuery('[id="Right Textlink Zone"]').length !== 0) {
      jQuery('[id="Right Textlink Zone"]').parent().remove();
  }

// 文章列表廣告
     if (jQuery('#mainTopicTable tr:not([userid] > td)').length !== 0) {
      jQuery('#mainTopicTable tr:not([userid]) > td').parent().remove();
  }

// 底部廣告Code
  if (jQuery('.ContentPanel > center').length !== 0) {
      jQuery('.ContentPanel > center').remove();
  }

  if (jQuery('.FooterPanel').length !== 0) {
      jQuery('.FooterPanel').remove();
  }

// Topic page廣告
  if (jQuery('.myTestAd').parent().length !== 0) {
      jQuery('.myTestAd').parent().remove();
  }
  if (jQuery('[id^=MsgInLineAd]').parent().length !== 0) {
      jQuery('[id^=MsgInLineAd]').parent().remove();
  }
  if (jQuery('.repliers[border="1"]').parent().length !== 0) {
      jQuery('.repliers[border="1"]').parent().remove();
  }
  if (jQuery('.repliers > tr:not([userid] > td)').length !== 0) {
      jQuery('.repliers > tr:not([userid]) > td').remove();
  }
  if (jQuery('span[style="width:728px"]').length !== 0) {
      jQuery('span[style="width:728px"]').remove();
  }

// PM page廣告
  if (jQuery('[id^=PMInLineAd]').parent().parent().length !== 0) {
      jQuery('[id^=PMInLineAd]').parent().parent().remove();
  }
 // 發帖紀錄page廣告
  if (jQuery('#ctl00_ContentPlaceHolder1_dataLabel [id^=Span]').parent().parent().length !== 0) {
      jQuery('#ctl00_ContentPlaceHolder1_dataLabel [id^=Span]').parent().parent().remove();
  }

// Helianthus.annuus Menu
  setTimeout(function() {
      if (jQuery('#an').length !== 0) {
          jQuery('#an-mainmenu').css('top', '80px').css('font-size', '12px');
          jQuery('#an-buttons').css('left', 'initial').css('right', '5px').css('border-left', '0').css('padding-left', '0');
      }
  }, 500);

// 請選擇討論區
  jQuery('#forum_list').remove();

  jQuery('body').append('<div style="position: fixed;right:5px;top:5px;">\
  <a href="http://'+currentServer+'.hkgolden.com/ProfilePage.aspx?userid=166365" style="font-size:12px;text-decoration:none;color:#808080;">My Page</a>&nbsp;\
  <select style="margin-bottom: 3px;" name="forum_list" id="forum_list" onchange="javascript: window.location.href = \'topics.aspx?sensormode=N&filtermode=N&md=90&type=\' + value;">\
<option selected="selected" value="">請選擇討論區</option>\
<option value="HT">高登熱</option>\
<option value="NW">最　新</option>\
<option value="OP">考古台</option>\
<option value="ET">娛樂台</option>\
<option value="CA">時事台</option>\
<option value="FN">財經台</option>\
<option value="GM">遊戲台</option>\
<option value="HW">硬件台</option>\
<option value="IN">電訊台</option>\
<option value="SW">軟件台</option>\
<option value="MP">手機台</option>\
<option value="AP">Apps台</option>\
<option value="SP">體育台</option>\
<option value="LV">感情台</option>\
<option value="SY">講故台</option>\
<option value="ED">飲食台</option>\
<option value="BB">親子台</option>\
<option value="PT">寵物台</option>\
<option value="TR">旅遊台</option>\
<option value="CO">潮流台</option>\
<option value="AN">動漫台</option>\
<option value="TO">玩具台</option>\
<option value="MU">音樂台</option>\
<option value="VI">影視台</option>\
<option value="DC">攝影台</option>\
<option value="ST">學術台</option>\
<option value="SC">校園台</option>\
<option value="WK">上班台</option>\
<option value="TS">汽車台</option>\
<option value="RA">電　台</option>\
<option value="AU">成人台</option>\
<option value="MB">站務台</option>\
<option value="AC">活動台</option>\
<option value="JT">直播台</option>\
<option value="EP">創意台</option>\
<option value="BS">買賣台</option>\
<option value="BW">吹水台</option>\
</select></div>');

// 還原字體
jQuery('head').append('<style>body, td, input, textarea, select{font-family:Arial,sans-serif!important;}#lm-finder{display:block;}</style>');

// 簡化button
jQuery('head').append('<style>.btn{background:none!important;padding:4px!important;box-shadow:none!important;color:#808080!important;border:1px solid!important;border-radius:0!important;}.btn:hover{color:#9ACD32!important;}</style>');

}, 500);