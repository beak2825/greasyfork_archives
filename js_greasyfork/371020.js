// ==UserScript==
// @name         Kekeke Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Kekeke Set Blacklist to Block Unwanted Pics & Night Mode
// @author       Johann
// @icon         http://www.google.com/s2/favicons?domain=https://kekeke.cc/
// @include      https://kekeke.cc/*
// @grant	     GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371020/Kekeke%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/371020/Kekeke%20Enhancer.meta.js
// ==/UserScript==



setTimeout(function(){


   GM_addStyle('.SquareCssResource-chatNameHover, .SquareCssResource-chatContent:hover {background:#eef !important;}');
   GM_addStyle('.SquareCssResource-message:hover, .SquareCssResource-chatDate:hover {background:#eef !important; color:#cf3a3a !important; font-weight:bold !important; text-shadow:none !important}');
   GM_addStyle('.SquareCssResource-chatContent.SquareCssResource-replyToMe.SquareCssResource-even:hover {background:#eef !important; color:#cf3a3a !important; font-weight:bold !important; text-shadow:none !important}');
   GM_addStyle('.SquareCssResource-chatContent.SquareCssResource-replyToMe:hover {background:#eef !important; color:#cf3a3a !important; font-weight:bold !important; text-shadow:none !important}');


   $('<td class="gwt-MenuItem" id="gwt-uid-l" role="menuitem" title="檢視在黑名單中的用戶，點擊用戶名即可對其解除封鎖。">檢視名單</td>').insertAfter('.gwt-MenuItem:contains("Q & A")');
   $('<td class="gwt-MenuItemSeparator"><div class="menuSeparatorInner"></div></td>').insertAfter('.gwt-MenuItem:contains("Q & A")');
   $('<td class="gwt-MenuItem" id="gwt-uid-b" role="menuitem" title="在圖片區塊的用戶名側邊添加黑名單鍵，點擊可封鎖該位用戶。">黑名單</td>').insertAfter('.gwt-MenuItem:contains("Q & A")');
   $('<td class="gwt-MenuItemSeparator"><div class="menuSeparatorInner"></div></td>').insertAfter('.gwt-MenuItem:contains("Q & A")');
   $('<td class="gwt-MenuItem" id="gwt-uid-d" role="menuitem" title="開關黑夜模式。">關燈</td>').insertAfter('.gwt-MenuItem:contains("Q & A")');
   $('<td class="gwt-MenuItemSeparator"><div class="menuSeparatorInner"></div></td>').insertAfter('.gwt-MenuItem:contains("Q & A")');

    function Hover() {

          $('.gwt-MenuItem').hover(function(){

            $(this).addClass("gwt-MenuItem-selected");

        }, function () {

            $(this).removeClass("gwt-MenuItem-selected");

   }); }


   $('.gwt-MenuItem:contains("關燈")').click(function(){
     $(this).toggleClass('init');
     if($(this).hasClass('init')){ $(this).html('開燈');  $('#gwt-uid-b').css('color','#f5deb3'); $('#gwt-uid-b.gwt-MenuItem.init').css('color','#c00');
        $('td').has('.SquareCssResource-squareHeader.GlobalCssResource-zhFont').css('background','#333'); $('.SquareCssResource-squareHeader.GlobalCssResource-zhFont').css('background','#333');
        if($('.gwt-Image[title*="統一暱稱"]').length < 1) {
        $('<td><div><img src="https://kekeke.cc/com.liquable.hiroba/emoji/emoji_one/1f60e_2x.png" class="gwt-Image" title="統一暱稱顏色" style="cursor: pointer; width:21px; height:21px; margin:1.5px;"></div></td>')
        .insertBefore('.SquareCssResource-submitInputButton'); } Hover();
        $('.gwt-Image[title*="統一暱稱"]').click(function(){ $(this).toggleClass('init');
        if($(this).hasClass('init') && $('#gwt-uid-d').hasClass('init')) {
           GM_addStyle('.GlobalCssResource-colorNickname {color: #999 !important}'); $(this).attr('src','https://kekeke.cc/com.liquable.hiroba/emoji/emoji_one/1f60e_2x.png'); } else location.reload(true); });

     // custom
     GM_addStyle('#gwt-uid-b {color: #f5deb3} \
                  #gwt-uid-b.gwt-MenuItem.init {color: #c00} \
                  #new-line {background: #333} \
                  .SquareCssResource-chatContent {cursor:pointer}');

     // global
     GM_addStyle('a, a *, a, a:visited {color: #409B9B}');

     // header
     GM_addStyle('.SquareCssResource-squareHeader .GlobalCssResource-colorBox .GlobalCssResource-noOfCrowd {background: #333} \
                  .GlobalCssResource-statusPanel.gwt-MenuBar table>tbody>tr {background: #333} \
                  .GlobalCssResource-statusPanel.gwt-MenuBar table td {color: #f5deb3} \
                  .gwt-MenuBar .gwt-MenuItem-selected {background:#999}');

     // table
     GM_addStyle('table[style*="rgb(255, 255, 170)"] {background:#333 !important} \
                 .google-visualization-table-table th, .google-visualization-table-table td {background:#333 !important}');

     // selector
     GM_addStyle('.SquareCssResource-eventSection .SquareCssResource-eventSectionModeSelector {background: #222; color: #fff}');

     // poster
     GM_addStyle('.gwt-InlineHTML, .gwt-viz-container, .gwt-Label.SquareCssResource-posterContent {color: #fff} \
                  .SquareCssResource-posterPanel {background: #222} \
                  .SquareCssResource-eventSection {background: #333}\
                  .KmarkCssResource-kmark p, .KmarkCssResource-kmark ol, .KmarkCssResource-kmark ul {color: #999} \
                  .SquareCssResource-mediaFlow .SquareCssResource-mediaHeader {background: #333; color: #409B9B}');

     // float-box
     GM_addStyle('.SquareCssResource-smileyTabPane {background: #444; color:#eee} \
                  .gwt-DialogBox .dialogMiddleCenter {background: #333; color:#eee} \
                  .gwt-ListBox, input[type=text], textarea {background: #444; color: #fff}');

     // room-title
     GM_addStyle('.SquareCssResource-squareHeader .SquareCssResource-squareHeaderAddress {color: #409B9B; background: #333}');

     // input-area
     GM_addStyle('.SquareCssResource-chatRoom .SquareCssResource-inputArea {background: #333; color: #409B9B} \
                  .SquareCssResource-inputArea .SquareCssResource-messageInputField, .SquareCssResource-chatRoom .SquareCssResource-nicknameField {background: #444; color: #fff}');

     // chat-room
     GM_addStyle('.SquareCssResource-chatRoom .SquareCssResource-replyToMe {background: #222 !important} \
                  table.SquareCssResource-chatRoom, .SquareCssResource-chatRoom .SquareCssResource-chatContent, .SquareCssResource-dockPanelCenter, .SquareCssResource-dockPanelRight {background: #333} \
                  .SquareCssResource-chatRoom .SquareCssResource-chatContent, .SquareCssResource-chatRoom .SquareCssResource-chatContent.SquareCssResource-even {background: #333; font-weight: bold; font-size: 14px} \
                  .SquareCssResource-chatRoom .SquareCssResource-chatContent .SquareCssResource-message {color: #999;}'); //text-shadow: 0 0 3px #000

                                 }
     if ($('.gwt-Image[title*="統一暱稱"]').hasClass('init')) { location.reload(true); }

     if(!$(this).hasClass('init')) { $(this).html('關燈'); $('#gwt-uid-b').css('color','initial'); $('#gwt-uid-b.gwt-MenuItem.init').css('color','#c00'); $('.gwt-Image[title*="統一暱稱"]').remove();
            $('td').has('.SquareCssResource-squareHeader.GlobalCssResource-zhFont').css('background','#fff'); $('.SquareCssResource-squareHeader.GlobalCssResource-zhFont').css('background','#fff');

     // custom
     GM_addStyle('#gwt-uid-b {color: initial} \
                  #gwt-uid-b.gwt-MenuItem.init {color: #c00} \
                  #new-line {background: initial} \
                  .SquareCssResource-chatContent {cursor:default}');

     // global
     GM_addStyle('a, a *, a, a:visited {color: #0c4a8a}');

     // header
     GM_addStyle('.SquareCssResource-squareHeader .GlobalCssResource-colorBox .GlobalCssResource-noOfCrowd {background: initial} \
                  .GlobalCssResource-statusPanel.gwt-MenuBar table>tbody>tr {background: initial} \
                  .GlobalCssResource-statusPanel.gwt-MenuBar table td {color: initial} \
                  .gwt-MenuBar .gwt-MenuItem-selected {background: #E0EDFE}');

     // table
     GM_addStyle('table[style*="rgb(255, 255, 170)"] {background:#ffffaa !important} \
                 .google-visualization-table-table th, .google-visualization-table-table td {background:#fff !important}');

     // selector
     GM_addStyle('.SquareCssResource-eventSection .SquareCssResource-eventSectionModeSelector {background: #fff; color: #333}');

     // poster
     GM_addStyle('.gwt-InlineHTML, .gwt-viz-container, .gwt-Label.SquareCssResource-posterContent {color: initial} \
                  .SquareCssResource-posterPanel {background: #f6efe4} \
                  .SquareCssResource-eventSection {background: #fff} \
                  .KmarkCssResource-kmark p, .KmarkCssResource-kmark ol, .KmarkCssResource-kmark ul {color: #333} \
                  .SquareCssResource-mediaFlow .SquareCssResource-mediaHeader {background: #eaf6e5; color: #2b8f00}');

     // float-box
     GM_addStyle('.SquareCssResource-smileyTabPane {background: #fff; color:#333} \
                  .gwt-DialogBox .dialogMiddleCenter {background: #fff; color:#333} \
                  .gwt-ListBox, input[type=text], textarea {background: #fff; color: #333}');

     // room-title
     GM_addStyle('.SquareCssResource-squareHeader .SquareCssResource-squareHeaderAddress {color: #0c4a8a; background: #fff}');

     // input-area
     GM_addStyle('.SquareCssResource-chatRoom .SquareCssResource-inputArea {background: #e8eef5; color: #333} \
                  .SquareCssResource-inputArea .SquareCssResource-messageInputField, .SquareCssResource-chatRoom .SquareCssResource-nicknameField {background: #fff; color: #333}');

     // chat-room
     GM_addStyle('.SquareCssResource-chatRoom .SquareCssResource-replyToMe {background: #fdfdba!important} \
                  table.SquareCssResource-chatRoom, .SquareCssResource-chatRoom .SquareCssResource-chatContent, .SquareCssResource-dockPanelCenter, .SquareCssResource-dockPanelRight {background: initial} \
                  .SquareCssResource-chatRoom .SquareCssResource-chatContent {background: #eaf6e5; font-weight: initial; font-size: 13px} \
                  .SquareCssResource-chatRoom .SquareCssResource-chatContent.SquareCssResource-even {background: #fff; font-weight: initial; font-size: 13px} \
                  .SquareCssResource-chatRoom .SquareCssResource-chatContent .SquareCssResource-message {color:#333;}'); //text-shadow:none

          }
   });

   $('.gwt-MenuItem:contains("黑名單")').click(function(){
     $(this).toggleClass('init');
     if($(this).hasClass('init')){ append(); block(); $(this).css('color','#c00'); }
     else { $('.blocked').remove(); if($('#gwt-uid-d').hasClass('init')){ $(this).css('color','#f5deb3'); } else $(this).css('color','initial'); }
   });

   $('.gwt-MenuItem:contains("檢視名單")').click(function(){
     var headline = $('.gwt-MenuBar.gwt-MenuBar-horizontal.GlobalCssResource-statusPanel.SquareCssResource-squareStatusPanel');
     $(this).toggleClass('init');
     if($(this).hasClass('init')){
        $('<table id="new-line" style="border-top:1px solid #bbb"></table>').appendTo(headline);
        $(JSON.parse(localStorage.getItem("blacklistValues"))).each(function () {
        $('<td class="gwt-MenuItem banned" role="menuitem" title="' + '將『' + this + '』從黑名單中剔除' + '" style="cursor:pointer">' + this + '</td>').appendTo('#new-line');
        });
        $('<a style="margin-left:10px">黑名單：</a>').insertBefore('.gwt-MenuItem.banned:first');
        $('.gwt-MenuItem.banned:contains("removed")').remove();

              $('.gwt-MenuItem.banned').hover(function(){

            $(this).addClass("gwt-MenuItem-selected");

        }, function () {

            $(this).removeClass("gwt-MenuItem-selected");

   });

        }
     else { $('#new-line').remove(); }

      $('.gwt-MenuItem.banned').click(function() {
      var user = $(this)[0].innerText; console.log("解除封鎖 " + user);
      if(localStorage.getItem("blacklistValues") !== null) localStorage.setItem('blacklistValues', localStorage.getItem("blacklistValues").replace(user,'removed'));
      $(this).html('已解除');
      });

   });

}, 1000);


setInterval(function() {  blacklist();  }, 1000);


   function append() {

      $('.SquareCssResource-mediaHeaderLeft').each(function() { if ( $(this).find('.blocked').length < 1 ) {
      $(this).append('<a class="blocked" style="cursor:pointer" title="將此用戶加入黑名單，停止顯示其所發送的任何圖片。">加入黑名單</a>'); }

      });
   }

   function blacklist() {

       var blacklist = JSON.parse(localStorage.getItem("blacklistValues"));
       $(blacklist).each(function () {
       $('.SquareCssResource-media').has('.gwt-HTML:contains("' + this + '")').hide();

       });
   }

   function block() {

   $('.blocked').click(function() {

    var blacklistValues= $(this).parent().find('.gwt-HTML')[0].innerText.split("@")[0].trim(); console.log("黑名單 " + blacklistValues);
    var data;

    if (localStorage.getItem("blacklistValues") === null)
      data = [];
    else
      data = JSON.parse(localStorage.getItem("blacklistValues"));

      data.push(blacklistValues);

    localStorage.setItem("blacklistValues",JSON.stringify(data));

    $(JSON.parse(localStorage.getItem("blacklistValues"))).each(function () {   $('.SquareCssResource-media').has('.gwt-HTML:contains("' + this + '")').hide();   });

   });

   }