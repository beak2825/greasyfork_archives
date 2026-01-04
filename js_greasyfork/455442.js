// ==UserScript==
// @name 		Library Eins
// @description Never install it.
// @author 		Sakura
// @namespace 	http://extensions.fenrir-inc.com/list/author/Sakura_Kocho/
// @version 	0.0.1
// @match 		http://*/*
// @match 		https://*/*
// @downloadURL https://update.greasyfork.org/scripts/455442/Library%20Eins.user.js
// @updateURL https://update.greasyfork.org/scripts/455442/Library%20Eins.meta.js
// ==/UserScript==

var css = function(){/*
.go2333016382 {
 color:rgb(232, 234, 237);
 color-scheme:dark;
 font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
 font-size:13px;
 line-height:1.5;
}
.go2333016382 *,
.go2333016382 *::before,
.go2333016382 *::after {
 box-sizing:border-box;
}
.go3826439780 {
 align-items:center;
 background:rgba(0, 0, 0, 0.6);
 display:flex;
 justify-content:center;
 height:100%;
 left:0;
 position:fixed;
 top:0;
 width:100%;
 z-index:100000;
}
.go1742019026 {
 color: #FFF;
 background:rgb(41, 42, 45);
 border-radius:8px;
 box-shadow:0 0 16px rgba(0, 0, 0, 0.12), 0 16px 16px rgba(0, 0, 0, 0.24);
 max-height:100%;
 max-width:100%;
 outline:none;
 overflow-y:auto;
 padding:1.5em;
 width:80%;
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 z-index:2147483646;
}
.go1043490243 {
 word-break:break-all;
}
.go1918864833 {
 margin-bottom:1em;
}
.go1103109428 {
 font-size:1.125em;
 font-weight:normal;
 margin:0;
}
.go297108182 {
 align-items:center;
 display:flex;
 flex-wrap:nowrap;
 justify-content:flex-start;
}
.go297108182:not(:first-child) {
 margin-top:1em;
}
.go3308260910 {
 flex-grow:0;
 flex-shrink:0;
 min-width:0;
}
.go3308260910:not(:first-child) {
 margin-left:0.625em;
}
.go504329284 {
 flex-grow:1;
 flex-shrink:1;
 min-width:0;
}
.go504329284:not(:first-child) {
 margin-left:0.625em;
}
.go2939226367 {
 cursor:pointer;
 outline:none;
}
.go2939226367:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go2939226367:focus:not(:focus-visible) {
 box-shadow:none;
}
.go2939226367:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go3433268835 {
 margin-top:1em;
}
.go389740541 {
 margin-bottom:0.5em;
 opacity:1;
}
.go435145941 {
 color:rgb(232, 234, 237);
 cursor:pointer;
}
.go758480430 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(232, 234, 237);
 display:block;
 font:inherit;
 height:calc(1.5em * 2 + 1em + 2px);
 line-height:1.5;
 padding:0.5em 0.625em;
 resize:none;
 width:100%;
 word-break:break-all;
}
.go758480430:disabled {
 opacity:0.38;
}
.go758480430:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
 outline:none;
}
.go758480430:read-only {
 color:rgb(154, 160, 166);
}
.go2658119172 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(232, 234, 237);
 display:block;
 font:inherit;
 height:calc(1.5em * 2 + 1em + 2px);
 line-height:1.5;
 padding:0.5em 0.625em;
 resize:none;
 width:100%;
 word-break:normal;
}
.go2658119172:disabled {
 opacity:0.38;
}
.go2658119172:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
 outline:none;
}
.go2658119172:read-only {
 color:rgb(154, 160, 166);
}
.go3433279036 {
 margin-top:2em;
}
.go3755328674 {
 align-items:center;
 display:flex;
 flex-wrap:wrap;
 justify-content:flex-end;
}
.go3755328674:not(:first-child) {
 margin-top:1em;
}
.go1741954662 {
 background:transparent;
 border:none;
 color:rgb(138, 180, 248);
 cursor:pointer;
 display:inline;
 font:inherit;
 outline:none;
 padding:0;
}
.go1741954662:disabled {
 cursor:default;
}
.go1741954662:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1741954662:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1741954662:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go1001709306 {
 background:transparent;
 border:solid 1px rgb(95, 99, 104);
 border-radius:4px;
 color:rgb(138, 180, 248);
 cursor:pointer;
 font:inherit;
 height:2.5em;
 outline:none;
 padding:calc(0.5em - 1px) 1em;
}
.go1001709306:active {
 background:rgba(138, 180, 248, 0.16);
}
.go1001709306:disabled {
 background:transparent;
 color:rgb(128, 134, 139);
 cursor:default;
}
.go1001709306:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1001709306:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1001709306:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go1001709306:hover:not(:active):not(:disabled) {
 background:rgba(138, 180, 248, 0.08);
}
.go1680006790 {
 background:rgb(138, 180, 248);
 border:none;
 border-radius:4px;
 color:rgb(32, 33, 36);
 cursor:pointer;
 font:inherit;
 height:2.5em;
 outline:none;
 padding:0.5em 1em;
}
.go1680006790:active {
 background:rgba(138, 180, 248, 0.8);
}
.go1680006790:disabled {
 background:rgb(60, 64, 67);
 color:rgb(128, 134, 139);
 cursor:default;
}
.go1680006790:focus {
 box-shadow:0 0 0 2px rgba(138, 180, 248, 0.5);
}
.go1680006790:focus:not(:focus-visible) {
 box-shadow:none;
}
.go1680006790:focus:not(:-moz-focusring) {
 box-shadow:none;
}
.go1680006790:hover:not(:active):not(:disabled) {
 background:rgba(138, 180, 248, 0.9);
}
.go2348475077 {
 align-items:center;
 background:rgba(0, 0, 0, 0.6);
 display:none;
 justify-content:center;
 height:100%;
 left:0;
 position:fixed;
 top:0;
 width:100%;
 z-index:100000;
}
.GoodByeApril {
 display: none;
}
.ElementCheck {
 border-style: solid;
 border-width: thin;
 border-color: #ff007f;
}
*/}.toString().match(/\n([\s\S]*)\n/)[1];

var style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

function ButtonParent() {
  if (!!TargetSelector.parentElement) {
    for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
      document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
    }
    TargetSelector = TargetSelector.parentElement;
    var A_attribute = "";
    for (var i = 0 ; i < TargetSelector.attributes.length ; i++){
      if (TargetSelector.attributes[i].name != "style") {
        A_attribute = A_attribute + "[" + TargetSelector.attributes[i].name  + "=\"" + TargetSelector.attributes[i].value  + "\"]";
      }
    }
    XPath = getPath(TargetSelector);
    Domain = window.location.hostname;
    BlockElement = TargetSelector.tagName + A_attribute;
    document.querySelector('div[class="go1742019026"]').remove();
    DialogCreate ();
  }
}
function ButtonCancel() {
  document.getElementById('SakuraCanvas').remove();
  document.querySelector('div[class="go1742019026"]').remove();
  for (var i = 0 ; i < document.querySelectorAll(".ElementCheck").length ; i++){
    document.querySelectorAll(".ElementCheck")[i].classList.remove("ElementCheck");
  }
  ScriptRun();
}
function ButtonBlock() {
  console.log("test");
}