// ==UserScript==
// @name        who.is Who Is Website Dark Night Mode Theme 
// @namespace   english
// @description who.is Who Is Website Dark Night Mode Theme  - currently undergoing build
// @include     http*://*who.is*
// @version     1.5
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371395/whois%20Who%20Is%20Website%20Dark%20Night%20Mode%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/371395/whois%20Who%20Is%20Website%20Dark%20Night%20Mode%20Theme.meta.js
// ==/UserScript==



var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '                                              body {/*\n*/    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;/*\n*/    font-size: 14px;/*\n*/    line-height: 1.42857143;/*\n*/    color: #333;/*\n*/    background-color: #8c8c8c;/*\n*/}.footer {/*\n*/    background-color: rgb(105, 105, 105);/*\n*/    border-top: 1px solid #393939;/*\n*/    padding: 30px 0;/*\n*/}/*\n*//*\n*/.footer a:focus, .footer a:hover {/*\n*/    color: #bed9f2;/*\n*/    text-decoration: underline;/*\n*/}.footer a{color: #95c3ec;}  /*\n*//*\n*/.alert-info {/*\n*/    color: #31708f;/*\n*/    background-color: #b8c4cb;/*\n*/    border-color: #5ab6c9;/*\n*/}.queryResponseHeader {/*\n*/    background-color: #aeaeae;/*\n*/    /*\n*/}pre {/*\n*/    /*\n*/    color: #333;/*\n*/   /*\n*/    background-color: #d7d7d7;/*\n*/    border: 1px solid #ccc;/*\n*/ /*\n*/}.queryResponseBody {/*\n*/    background-color: #aeaeae;/*\n*/}.queryResponseHeaderSide {/*\n*/    background-color: #b0b0b0;/*\n*/ }.queryResponseBodySide {/*\n*/    background-color: #c6c6c6;/*\n*/ } /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}                               ';
document.getElementsByTagName('head')[0].appendChild(style);



