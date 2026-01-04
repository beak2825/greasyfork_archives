// ==UserScript==
// @name        harry potter methods rationality dark
// @namespace   english
// @description harry potter methods rationality dark large fonts
// @include     http*://*hpmor.com*
// @version     1.10
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/39470/harry%20potter%20methods%20rationality%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/39470/harry%20potter%20methods%20rationality%20dark.meta.js
// ==/UserScript==

 

var style2 = document.createElement('style');
style2.type = 'text/css';

style2.innerHTML =  '                  #invertable {     background: black !important ;      color: #ccc !important ;      font-size: 150% !important ;  font-family:"PT Mono" !important ; }#invertable a{color:#8de7fd;}#content h1, #chapter-title, h1 {    color: #616161 !important ;  font-family:"PT Mono" !important ; } /* width *//*\n*/::-webkit-scrollbar {/*\n*/    min-width: 5px;/*\n*/}/*\n*//*\n*//* Track *//*\n*/::-webkit-scrollbar-track {/*\n*/    box-shadow: inset 0 0 5px grey; /*\n*/    border-radius: 3px;/*\n*/    background:#999/*\n*/}/*\n*/ /*\n*//* Handle *//*\n*/::-webkit-scrollbar-thumb {/*\n*/    background: #666;  /*\n*/}/*\n*//*\n*//* Handle on hover *//*\n*/::-webkit-scrollbar-thumb:hover {/*\n*/    background: #444; /*\n*/}                     '  ; 

document.getElementsByTagName('head')[0].appendChild(style2);


