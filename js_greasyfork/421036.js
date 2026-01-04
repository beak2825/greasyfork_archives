// ==UserScript==
// @name        Ezcape Plus BETA
// @namespace   FAT
// @version     2021
// @author      Kaze
// @description Adds convenient functions and changes room theme of Ezcapechat. Install and refresh. BETA BUILD. PRONE TO BUGS.
// @match       https://www.ezcapechat.com/rooms/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/421036/Ezcape%20Plus%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/421036/Ezcape%20Plus%20BETA.meta.js
// ==/UserScript==


document.body.appendChild(document.createElement('style')).textContent = `
#container {background: #000!important;}


 :root {
    --primary-color: #23272a!important;
    --heading-color: #292922!important;
    --secondary-color: #0a0a0c!important;
    --highlight-color: #7289da!important;
    --font-color: #ffffff!important;
    --bg-color: #000000!important;
--focus-color: #7289da!important;
}

[data-theme="alternate"] {
    --primary-color: #9A97F3!important;
    --secondary-color: #818cab!important;
    --font-color: #e1e1ff!important;
    --highlight-color: #7289da!important;
    --bg-color: #161625!important;
    --heading-color: #818cab!important;
}

* {border: 0!important;}

#chat {
background-color: #0a0a0c;}

#swf_chat_normal {
height: calc(100vh - 110px);
    box-sizing: border-box;}


.fc {
display: block;
}

.fc .gridbox_chat {
    width: 18%;
    float: right;
    height: 86%!important;
    margin-top: 60px;
    padding-right: 8%;
}


.fc .gridbox_topic {
    width: 26%;
    height: 50px;
    float: right;
    position: absolute;
    right: 0;
    top: 0;
}

.fc .gridbox_tools {
    width: 26%;
    height: 60px;
    float: right;
    position: absolute;
    right: 0;
    bottom: -30px;
}

.fc .gridbox_cams {
    overflow: hidden;
    height: 600px;
    width: 74%;
float: left;
    max-height: 100%;
}

.fc .maxcamcont {
    width: 70%;
}

.fc .gridbox_list {
    float: right;
    position: absolute;
    right: 0;
    width: 8%;
    top: 60px;
height: auto!important;
}

.fc .topicbar button.material-icons {
height: 80%;
vertical-align: center;}


.fc .tb input.chatmsg {
    font-size: 16px;
    padding: .05% 1%;
    vertical-align: top;
    height: 32px;
    width: calc(73% - 60px);
    outline: 0;
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: -52px;
    left: 0;
}

.fc .tb button.sendbtn {
    width: 60px;
    height: 50%;
    padding: .5%;
    font-size: 1.5em;
    outline: 0;
    box-sizing: border-box;
    position: absolute;
    top: -52px;
    right: 31%;
}


.fc .tb input.jscolor {
    margin-right: 1%;
}

.fc .tb select.sizesel {
    margin: 0 1%;
}

.fc .topicbar input[type=text] {
    height: 42px;
}

.fccb {
display: none;}

#container {
background: --bg-color;
min-height: 100vh!important;
}



#room_footer, #room_header, #swf_chat_normal {
    width: auto;
margin: 0;
padding: 0;}

#room_footer button {
display: none;}

#ftr {
display: none;}

#hdr_cnt #hdr {
height: 32px;
width: 90%;
display: flex;
place-content: space-between;
justify-content: space-between;
align-content: space-between;
}


#hdr #logo {
display: inline-flex;
height: 30px;
width: 30px;
background-size: 24px;
}

#hdr #logo h1, #hdr #logo p {display: none;}


#hdr #btntop {display: inline-flex;width:auto;padding:0;}

#btntop #rmsnav {;padding-top:8px;font-size: 0.8em;padding-right: 150px;}

#btntop #lgnsts p {font-size: 1em;padding-top: 5px;}

#btntop #allrms, #btntop #yourrms {height: 24px; padding: 0;}

#btntop #favrms {
    padding: 0;
margin-top: -2px;
height: 24px;
    line-height: 24px;
    font-size: 1.2em;}

#btntop #lgnsts {
    height: auto;
    position: absolute;
    right: 0;
}


#room_header {margin:0;padding:0 5%;background: #0a0a0c;min-height: 48px;max-height:48px;height:48px;}


#room_icon_img {
    height: 32px;
    width: 32px;
    margin-right: 5px;
    float: left;
    background-size: 32px!important;
    background-repeat: no-repeat;
    background-position: center;
}

.fc button, .msk button, .fc select, .fccb input[type="checkbox"] + label span, .fc .usermenu button, .fc .cam_c, .fc .cam_c .unpause {
background-color: #23272a!important;
}


.camstart {
background-color: #0a0a0c!important;}


#room_header, #room_footer, #swf_version_link, #swf_chat_progress .progress_bar, .progress_bar .progress_bar_sq, .progress_bar .progress_bar_sq_done {
background: #0a0a0c;
}

.fc, .msk, .fc .tb, .fc .maxcamcont {
background-color: #0a0a0c!important;}







`;