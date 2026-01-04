// ==UserScript==
// @name        BaskinBros Theme for EzcapeChat
// @namespace   BaskinBros Scripts
// @version     1.2
// @author      thebranmaster
// @description BaskinBros EzcapeChat Theme | Redirects to SWF | Sets chat width to 80% | [WIP]
// @license MIT
// @include     *://*.ezcapechat.com/rooms/*
// @include       *://*.ezcapechat.com/rooms/*/swf
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/421168/BaskinBros%20Theme%20for%20EzcapeChat.user.js
// @updateURL https://update.greasyfork.org/scripts/421168/BaskinBros%20Theme%20for%20EzcapeChat.meta.js
// ==/UserScript==

// Run at document start and end
// Start Script
var oldUrlPath  = window.location.pathname;
 
// Test that "/swf" is at end of url
if ( ! /\/swf$/.test (oldUrlPath) ) {
 
    var newURL  = window.location.protocol + "//"
                + window.location.host
                + oldUrlPath + "/swf"
                + window.location.search
                + window.location.hash
                ;
    // Replace url
    window.location.replace (newURL);
}

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

function DOM_ContentReady () {
    // End Script
    // This is the equivalent of @run-at document-end
    //Add styles
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//addGlobalStyle('#swf_chat_normal{height:99% !important;width:80% !important}');
addGlobalStyle('#container,#content{height:100%;background-color: #111111 !important}');
addGlobalStyle('#swf_chat_login_mask,#swf_chat_normal{border:1px solid #404040 !important}');
addGlobalStyle('.fc button,.fc input,.fc input[type=text],.fc select{background-color:#202020;border:1px solid #404040 !important}');
addGlobalStyle('.fc button, .fc select {background-color: #202020;color:#ccc !important}');
addGlobalStyle('.fc .tb{background-color: #202020 !important}');
addGlobalStyle('.fc button, .msk button, .fc select, .fccb input[type="checkbox"] + label span, .fc .usermenu button, .fc .cam_c .camstart, .fc .cam_c .unpause {background-color: #202020;color: #fff;border-color: #404040 !important}');
addGlobalStyle('.fc button:hover, .msk button:hover, .fc select:hover, .fccb input[type="checkbox"]:hover + label span:hover, .fc .usermenu button:hover, .fc .cam_c .camstart:hover, .fc .cam_c .unpause:hover {background-color: #202020;color: #fff;border-color: #404040 !important}');
addGlobalStyle('.fc .usermenu {border: 1px solid #404040 !important}');
addGlobalStyle('.fc .usermenu button{background-color:#202020;border:1px solid #404040 !important}');
addGlobalStyle('.fc .tooltip {background-color:#202020;border: 1px solid #404040 !important}');
addGlobalStyle('.fc .cam_c .camstart{border:1px solid #404040 !important}');
addGlobalStyle('.fc .cam_c .unpause{border:1px solid #404040 !important}');
addGlobalStyle('.fc .cam_c .topbar{border:1px solid #404040 !important}');
addGlobalStyle('.fc .cam_c .bottombar{border:1px solid #404040 !important}');
addGlobalStyle('.fc .chatbox{background-color:#202020;border:1px solid #404040 !important;color:#ccc !important}');
addGlobalStyle('.fc .userlist{border:1px solid #404040 !important;background-color:#202020 !important}');
addGlobalStyle('.fc .userlist p{background-color:#202020 !important}');
addGlobalStyle('.fc .userlist p:hover{background-color:#404040 !important}');
addGlobalStyle('.fc .gridbox_list{border:1px solid #404040 !important;background-color:#202020 !important}');
addGlobalStyle('.fc .fcwnd,.fc .fcwnd_focused{background-color:#202020;border:1px solid #404040 !important}');
addGlobalStyle('.fc .fctopic{color:#99cc33 !important}');
addGlobalStyle('.fc .fcts{color:#ccc !important}');
addGlobalStyle('.fc .fcsys{color:#ccc !important}');
addGlobalStyle('.fc .fcguest{color:#505050 !important}');
addGlobalStyle('.fc .fcuser{color:#3399cc !important}');
addGlobalStyle('.fc .fcmod{color:#99cc33 !important}');
addGlobalStyle('.fc .fcsuper{color:#6633cc !important}');
addGlobalStyle('.fc .fcowner{color:#cc3399 !important}');
addGlobalStyle('.fc .fcadmin{color:#f00 !important}');

// 80% width chat
addGlobalStyle('#swf_chat_normal{width:80% !important}');

//full width chat
//addGlobalStyle('#container,#content,#chat,#swf_chat_login_mask,#swf_chat_normal{width:100% !important}');

//unused
//addGlobalStyle('#swf{border:1px solid #404040 !important}');
//addGlobalStyle('#chat{border:0px solid #99cc33}');
//addGlobalStyle('#room_header, #room_footer, #swf_version_link, #swf_chat_progress .progress_bar, .progress_bar .progress_bar_sq, .progress_bar .progress_bar_sq_done {background-color: #202020;color: #99cc33;border-color: #404040; !important}');
//addGlobalStyle('.msk {border:1px solid #404040}');
//addGlobalStyle('.fc .gridbox_cams{background-color:#202020;border:1px solid #404040}');
//addGlobalStyle('.fc .chatbox p.debugmsg {color: #bbb}');
//addGlobalStyle('.fc .fcwnd_focused .fcwnd_header{background-color:#aaf}');
//addGlobalStyle('.fc .wndpm .pmgridbox_bottom textarea{background-color:#fff;border:1px solid #000}');
//addGlobalStyle('');
}