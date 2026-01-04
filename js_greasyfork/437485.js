// ==UserScript==
// @name         BatchOpenBilibiliComicWeb
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  批量打开bilibili漫画工具。使用键盘x打开隐藏工具，在输入框输入需要打开的网页数量后点击按钮
// @author       HalfRain
// @match        https://manga.bilibili.com/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437485/BatchOpenBilibiliComicWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/437485/BatchOpenBilibiliComicWeb.meta.js
// ==/UserScript==


//--- Use jQuery to add the form in a "popup" dialog.
$("body").append ( '                                                          \
    <div id="gmPopupContainer">                                               \
    <form> <!-- For true form use method="POST" action="YOUR_DESIRED_URL" --> \
        <input type="text" id="needOpenCount" value="10">                           \
                                                                              \
        <button id="openMultiWeb" type="button">批量打开未购买漫画</button>  \
        <button id="gmCloseDlgBtn" type="button">隐藏界面</button>         \
    </form>                                                                   \
    </div>                                                                    \
' );


//--- Use jQuery to activate the dialog buttons.
$("#openMultiWeb").click ( function () {
    var needOpenCount = $("#needOpenCount").val ();
    console.log(needOpenCount);

    let list = document.querySelector("body > div.app-layout > div.size-ruler.p-relative.border-box > div.manga-detail > div.section > div.section-list.layout > div.episode-list-component.episode-list > div.episode-list")
    if (list == null) {
        return;
    }

    let buttons = $(list).find("button");

    let count = 0;
    for (var i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        if (button != null) {
            if ($(button).find("div[class='tag lock-icon locked']").length != 0) {
                buttons[i].click();
                count++;
            }

            if(count >= needOpenCount){
                return;
            }
        }
    }
} );

$("#gmCloseDlgBtn").click ( function () {
    $("#gmPopupContainer").hide ();
} );


//--- CSS styles make it work...
GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               fixed;                          \
        top:                    30%;                            \
        left:                   50%;                            \
        padding:                1em;                            \
        background:             #66ccff;                        \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        border:                 1px outset buttonface;          \
    }                                                           \
" );

(function () {
    'use strict';

    //使用
    window.document.addEventListener("keydown", function(event) {
        const keyName = event.key;
        if (keyName == 'x' || keyName == 'X') {
            if($("#gmPopupContainer").is(":hidden")){
                $("#gmPopupContainer").show ();
            }
            else
            {
                $("#gmPopupContainer").hide ();
            }
        }
    } )
})();
