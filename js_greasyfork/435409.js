// ==UserScript==
// @name         Omegle Darkmode - Atsos
// @namespace    None
// @version      1.4
// @description  Adds darkmode to Omegle.
// @author       Atsos
// @include      /?omegle\.com/?/
// @icon         https://www.google.com/s2/favicons?domain=omegle.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/435409/Omegle%20Darkmode%20-%20Atsos.user.js
// @updateURL https://update.greasyfork.org/scripts/435409/Omegle%20Darkmode%20-%20Atsos.meta.js
// ==/UserScript==

(function() {
    'use strict';
})();

// Message Author Styles

GM_addStyle (`
.youmsg .msgsource {
color: #6940ff !important
}
.strangermsg .msgsource {
color: #7086ff !important
}
`);

// Message Styles

GM_addStyle (`
.youmsg {
font-style: italic !important;
color: white !important
}

.strangermsg {
font-style: normal !important;
color: white !important;
}
`)

GM_addStyle (`
#onlinecount {
bottom: 18px !important;
right: 1257px !important;
box-shadow: transparent 0px 0px 0px 0px !important;
background: transparent !important;
}

HTML > Body {
background: #585857 !important;
}

HTML > Body > div#header > h2#tagline > img {
margin-top: -130px !important;
position: absolute !important;
}

HTML > Body > div > div > p {
color: white !important;
}

HTML > Body > div > div {
background-color: #585857 !important;
}

HTML > Body > div#intro > div#introtext {
background: #525252 !important;
}

HTML > Body > div#intro > div#introtext > p > a {
color: #6161ff !important;
}

HTML > Body > div > div > p > input {
background: #535353 !important;
color: white !important;
}

HTML > Body > div#intro > div > img {
width: 0px !important;
}

HTML > Body > div.chatbox3 > div.chatbox2 > div.chatbox > div.logwrapper > divlogbox > div > div.logitem > div.logtopicsettings > label {
color: white !important;
}

HTML > body.inconversation > div.chatbox3 > div.chatbox2 > div.chatbox > div.logwrapper > divlogbox > div > div.logitem > div.logtopicsettings > label {
color: white !important;
}

HTML > Body > div#intro > table#chattypes > tbody > tr > td#topicsettingscell > div#topicsettingscontainer > div > div > div > a {
background: rgb(67, 67, 67) none repeat scroll 0% 0% !important;
color: white !important;
border: 1px solid rgb(0, 0, 0) !important;
}

HTML > Body > div.chatbox3 > div.chatbox2 > div.chatbox > div.logwrapper > div.logbox > div > div.logitem > div.statuslog > div.newchatbtnwrapper > img {
border-radius: 7px !important;
}

HTML > Body > div#footer > div#feedback.collapsed > div > p {
color: white !important;
font-style: italic !important;
}

HTML > Body > div#footer > div#feedback.collapsed > div > p > a {
color: #6161ff !important;
}

canvas {
margin-top: -99999999px !important;
width: 0px !important;
height: 0px !important;
}

#logo {
right: 50% !important;
width: 100% !important;
height: 100px;
}

.chatmsgwrapper {
background: #363636 !important;
border: #363636 !important
}

div.logwrapper {
border: solid !important;
border-color: #363636 !important;
border-radius: 6px !important;
}

div.newchatbtnwrapper {
color: white !important;
}

.sendbtn {
background: #3a3a3a !important;
color: white !important;
}

.disconnectbtn {
background: #3a3a3a !important;
color: white !important;
}

.chatmsg {
background: #525252 !important;
color: white !important;
}

.statuslog {
color: white !important;
}

.logtopicsettings {
color: white !important;
}

.disconnectbtn:hover {
background: #303030 !important;
color: #c1bbbb !important;
}

.sendbtn:hover {
background: #303030 !important;
color: #c1bbbb !important;
}

.disconnectbtnwrapper {
border: #363636 !important;
background: #363636 !important;
}

.sendbtnwrapper {
border: #363636 !important;
background: #363636 !important;
}

span.topictag {
background: #545454 !important;
color: white !important;
}

div#monitoringnotice {
width: 0px !important;
height: 0px !important;
margin-left: -500px;
display: block;
}

h2#intoheader {
margin-top: 41px !important;
font-weight: bold !important;
color: white !important;
}

div#intro {
-webkit-box-shadow: inset 0 0 .5em #474747 !important;
background: #525252 !important;
border: 1px solid #454545 !important;
color: white !important;
}

h2#startachat {
color: white !important;
}

img#textbtn {
border-radius: 5px !important;
}

img#videobtn {
border-radius: 5px !important;
}

a#videobtnunmoderated {
background: rgb(67, 67, 67) !important;
color: white !important;
}

p#mobilesitenote {
color: white !important;
}

div.topictageditor.needsclick {
background: #777 !important;
border: 1px solid #A2A2A2 !important;
color: white !important;
}

div#sharebuttons {
top: -2.5em !important;
}

div.logwrapper {
background: #3a3a3a !important;
}

div#header {
background: #565656 !important;
-webkit-box-shadow: 0 .25em .75em #3D3D3D !important;
}

img#videologo {
width: 0px !important;
height: 0px !important;
}
`)