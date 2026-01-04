// ==UserScript==
// @name        compressjpeg.com dark theme night mode compress jpeg jpg
// @namespace   english
// @description compressjpeg.com dark theme night mode compress jpeg jpg - simple dark theme 
// @include     http*://*compressjpeg.com*
// @version     1.4
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371268/compressjpegcom%20dark%20theme%20night%20mode%20compress%20jpeg%20jpg.user.js
// @updateURL https://update.greasyfork.org/scripts/371268/compressjpegcom%20dark%20theme%20night%20mode%20compress%20jpeg%20jpg.meta.js
// ==/UserScript==

 

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '          /*\n*/html, body {/*\n*//*\n*/    font-family: Helvetica, Arial, sans-serif;/*\n*/    font-size: 15px;/*\n*/    background-color: #303030;/*\n*/    color: #cfcfcf;/*\n*//*\n*/}#main {/*\n*/    margin-bottom: 30px;/*\n*/    background-color: #666;/*\n*/    padding: 30px 0 0 0;/*\n*/    overflow: hidden;/*\n*/    border-top: 2px solid #47A4A5;/*\n*/    border-bottom: 2px solid #47A4A5;/*\n*/}.more-tools-title a:hover {/*\n*/    color: #efa5a5;/*\n*/}.more-tools-title a {/*\n*/    color: #a5e5ef;/*\n*/}  #header-right {     display: none !important;} #carousel-wrapper {/*\n*/   /*\n*/    background-image: none;/*\n*/    background: #505050;/*\n*/}#carousel-prev.ui-button {/*\n*/      filter: invert(100%);/*\n*/}#carousel-prev-wrapper, #carousel-next-wrapper {/*\n*/     /*\n*/    background-color: #393939;/*\n*/}#carousel-next.ui-button {/*\n*/    filter: invert(100%);/*\n*/}#pls a.current:link, #pls a.current:visited, #pls a.current:active {/*\n*/    position: relative;/*\n*/    border: 1px solid #3C3C3C;/*\n*/    border-radius: 3px;/*\n*/    overflow: hidden;/*\n*/    background-color: #626262;/*\n*/}#pls a {/*\n*/   /*\n*/    color: #c6c6c6;/*\n*/   /*\n*/}#pls ul.dropdown {/*\n*/  /*\n*/    background-color: #353535;/*\n*/   /*\n*/}#pls a.current:link, #pls a.current:visited, #pls a.current:active {/*\n*/  /*\n*/    border: 1px solid #3C3C3C;/*\n*/  /*\n*/    background-color: #626262;/*\n*/}#pls a {/*\n*/    /*\n*/    color: #c6c6c6;/*\n*/   /*\n*/}#header-wrapper {/*\n*/    margin: 10px 0 0 0;/*\n*/}      ';

document.getElementsByTagName('head')[0].appendChild(style);
