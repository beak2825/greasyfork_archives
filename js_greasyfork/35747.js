// ==UserScript==
// @name        X Marks the Scot background remove minimalist
// @namespace   english
// @description X Marks the Scot background remove minimalist xmarksthescot.com
// @include     http*://*xmarksthescot.com*
// @version     1.6
// @run-at document-end
// @license MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/35747/X%20Marks%20the%20Scot%20background%20remove%20minimalist.user.js
// @updateURL https://update.greasyfork.org/scripts/35747/X%20Marks%20the%20Scot%20background%20remove%20minimalist.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media

 
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '       #header{display: none    !important ;}/*\n*/.above_body{    padding-top: 2em  !important ;background: none !important ;}/*\n*/html{    background: #ccc !important ;}/*\n*//*\n*/.navtabs {/*\n*/background: #457f9f !important ; /*\n*/}/*\n*//*\n*/.toolsmenu {/*\n*/background: #255372 !important ;}/*\n*//*\n*/.threadlisthead { /*\n*/border: 1px solid #333a3f !important ;/*\n*/background: #1E425A !important ;}/*\n*//*\n*/.newcontent_textcontrol {/*\n*/background: #1D5E89 !important ;/*\n*/_background-image: none !important ;/*\n*/-moz-border-radius: 3px !important ;/*\n*/-webkit-border-radius: 3px !important ;/*\n*/border-radius: 3px !important ;}/*\n*//*\n*//*\n*/.forum_info .blockhead { /*\n*/color: rgb(255,255,255) !important ;/*\n*/background: #23455C !important ;/*\n*/_background-image: none !important ;/*\n*/border: 1px solid #323232 !important ; }/*\n*//*\n*/.navtabs li.selected a.navtab {/*\n*/color: #ececec !important ;/*\n*/background: #2f3336 !important ;/*\n*/_background-image: none !important ;/*\n*/position: relative !important ;/*\n*/top: -4px !important ;/*\n*/padding-top: 4px !important ;/*\n*/z-index: 10 !important ;/*\n*/}/*\n*//*\n*/.navtabs li a.navtab { /*\n*/display: block !important ;/*\n*/background: #4f6977 !important ;/*\n*/}/*\n*//*\n*/.blockhead {/*\n*//*\n*/background: #263A47 !important ;/*\n*/_background-image: none !important ;/*\n*/padding: 4px 10px 4px 10px !important ;/*\n*/border: 1px solid #353738 !important ;}.newcontent_textcontrol:hover {    background: #264960 !important; }      ';



document.getElementsByTagName('head')[0].appendChild(style);




