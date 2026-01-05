// ==UserScript==
// @name       Gmail UI Customize
// @namespace  http://use.i.E.your.homepage/
// @version    0.2
// @description  enter something useful
// @match      https://mail.google.com/mail/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/10173/Gmail%20UI%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/10173/Gmail%20UI%20Customize.meta.js
// ==/UserScript==

document.addEventListener("DOMNodeInserted", function(){
    if (top.document == document) { // Only run this script in the top-most frame (there are multiple frames in Gmail)
        //if($('.inboxsdk__navItem_container').length && $('.inboxsdk__navMenu').length){
            //var loadedCheckAndExec = setInterval(function(){
                //if(typeof jQuery != "undefined" ){
                    $('.inboxsdk__navItem_container, .inboxsdk__navMenu').hide();

                    console.log("complete hide | Gmail UI Customize")
                //    clearInterval(loadedCheckAndExec);
                //}
            //}, 500);
        //}
    }
    
    /* 붙여넣기 후, margin-left:15px 추가 사항 자동 삭제 */
    jQuery('.editable div [style^="margin-left"]').css('margin-left', '');
}, false);