// ==UserScript==
// @name         TLS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tls.auroralearning.com/**
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/389339/TLS.user.js
// @updateURL https://update.greasyfork.org/scripts/389339/TLS.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body { background-color: #363636; }');
addGlobalStyle('.ContentPart { background-color: #363636; }');
addGlobalStyle('.DashBoardHeader { background-color: #1f1f1f; }');
addGlobalStyle('.LeftMenu { background-color: #363636; }');
addGlobalStyle('.intranetheader { COLOR: #878787; }');
addGlobalStyle('.LeftMenuLable { COLOR: #878787; }');
addGlobalStyle('A:link { COLOR: #878787; }');
addGlobalStyle('A:visited { COLOR: #878787; }');
addGlobalStyle('#ctrlPageLeftMenu_divLeftMenu { background-color: #363636; }');
addGlobalStyle('#ctl00_ctrlPageLeftMenu_divLeftMenu{ background-color: #363636; }');
addGlobalStyle('#ctl00_MainBody_lblCourseName { COLOR: #878787; }');
addGlobalStyle('#ctl00_MainBody_dgCourseLessonInfo.DataGridBody { border-color: #000000; }');


//document.getElementById('#ctl00_MainBody_dgCourseLessonInfo_ctl02_lblLessonTest').style.backgroundColor="red";

window.addEventListener('load', function() {
var images = document.getElementsByTagName('img');
for (var i = 0; i < images.length; i++) {
images[i].src = images[i].src.replace('https://tls.auroralearning.com/Images/plus.gif', 'https://i.imgur.com/h80Jhqu.png');
images[i].src = images[i].src.replace('https://tls.auroralearning.com/SchoolFiles/34/PublicPages/Images/SchoolLogo.jpg', 'https://i.imgur.com/q4Sc86d.png');
images[i].src = images[i].src.replace('https://tls.auroralearning.com/Images/blue_dot.jpg', 'https://i.imgur.com/h5cSKHK.png');
}
}, false);