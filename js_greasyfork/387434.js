// ==UserScript==
// @name         自動填PPT.cc圖床的密碼
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在dcard輸入預設密碼，進入ppt.cc圖床時自動以這個密碼開啟圖片/影片
// @author       You
// @match        https://ppt.cc/*
// @include    https://www.dcard.tw/f/sex*
// @include    https://www.dcard.tw/*
// @grant GM_setValue
//@grant GM_getValue
// @grant       GM_addStyle
// @grant       GM_getResourceText
//@require https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/387434/%E8%87%AA%E5%8B%95%E5%A1%ABPPTcc%E5%9C%96%E5%BA%8A%E7%9A%84%E5%AF%86%E7%A2%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/387434/%E8%87%AA%E5%8B%95%E5%A1%ABPPTcc%E5%9C%96%E5%BA%8A%E7%9A%84%E5%AF%86%E7%A2%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf("ppt.cc")>-1){
        autoSendPassword();
    }

    //如果是dcard,增加一個輸入密碼的浮動視窗
    if(window.location.href.indexOf("dcard.tw")>-1){
        waitForKeyElements ("[class^=Header_logo]", DcardProcess);
    }


})();

function autoSendPassword(){
   // 增加一個post request的語法
$.extend(
{
    redirectPost: function(location, args)
    {
        var form = '';
        $.each( args, function( key, value ) {
            form += '<input type="hidden" name="'+key+'" value="'+value+'">';
        });
        $('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
    }
});

   //取得預設密碼
    var password = "";
    var StoredPassword = GM_getValue("PPTCCPassword");
    if(StoredPassword){
         password = StoredPassword;
    }

    var isSend =  getParameterByName("send");
    var prevSendValue = GM_getValue("prevSendValue");//用來防止輸入密碼失敗的無窮迴圈
    var cleanUrl = window.location.href.split('?')[0];//取得目前的網址
    var preventLoopKey = cleanUrl+password;
        console.log("目前的key: "+preventLoopKey+"  prevSendValue:"+prevSendValue);
    if(password && !isSend && preventLoopKey != prevSendValue)
    {
        GM_setValue("prevSendValue", preventLoopKey);
        $.redirectPost(window.location.href+"?send=1", { t:2,p:password,ga:1,url:cleanUrl,cleanUrl:"我要通關" } );
    }

    //如果密碼輸入正確，清掉prevSendValue
    if(isSend && $(document.documentElement.innerHTML).indexOf("您輸入的密碼並不正確，請再做檢查")===-1){
        GM_setValue("prevSendValue", "");
    }
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

//Dcard的主要進入點
function DcardProcess(){
    waitForKeyElements ("[class^=PostPage_content]", generateConfigButton);
}

function generateConfigButton(){
   $("[class^=PostBar__Operators]").parent().append('<button id="PPTPassword" style="width:100px;margin-left:20px">設置PTT.CC預設密碼</button>');

    $("#PPTPassword").click(function() {
        var Password = prompt("請輸入PPT.CC的預設密碼", GM_getValue("PPTCCPassword"));
        if (Password != null) {
            GM_setValue("PPTCCPassword", Password);
        }
    });

}

