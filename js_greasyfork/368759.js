// ==UserScript==
// @name        Drive Music Player  width 75%, new header banner
// @namespace   english
// @description Drive Music Player  width 75%  new header banner
// @include       http://driveplayer.com/*
// @include       *driveplayer.com/*
// @include       http://driveplayer.com*
// @version     1.27
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/368759/Drive%20Music%20Player%20%20width%2075%25%2C%20new%20header%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/368759/Drive%20Music%20Player%20%20width%2075%25%2C%20new%20header%20banner.meta.js
// ==/UserScript==




var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '             /*\n*/body .main-container { /*\n*/    width: 75% !important ;/*\n*/}/*\n*//*\n*/body .logo { background: url(https://i.imgur.com/MOk1qK5.png) !important ;/*\n*/    background-size: 55% !important ;/*\n*/    background-position: 1em 1em !important ;/*\n*/    width: 100% !important ;/*\n*/    height: 110px !important ;/*\n*/    background-color: #ccc !important ;/*\n*/    background-repeat: no-repeat !important ;/*\n*/}/*\n*//*\n*/body #footer {/*\n*/    /*\n*/  left: initial !important ;  /*\n*/    margin-left: initial !important ;/*\n*/       margin-top: 3em !important ;/*\n*/    width: 75% !important ;/*\n*/        display: inline-block !important ;/*\n*/    position: relative !important ;/*\n*/       clear: both !important ;/*\n*/}/*\n*//*\n*/.help div {/*\n*/    width: 44% !important ;/*\n*/    float: left !important ;/*\n*/    margin: 0 2em 0 0 !important ;/*\n*/}/*\n*/.help div div {/*\n*/      float: initial !important ;/*\n*/        margin: 0 2.5em 1.5em 0 !important ;/*\n*/}/*\n*/  @media (max-width: 650px){ html body .logo {      padding-top: 0 !important;      height: 80px !important;  background-size: 90% !important ;} }    @media (min-width: 1400px){ html body .logo {     background-size: 566px !important ;} }          ';
document.getElementsByTagName('head')[0].appendChild(style);
