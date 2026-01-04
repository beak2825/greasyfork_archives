// ==UserScript==
// @name PybGen dark mode
// @namespace https://jurkourko.net/
// @version 2.1.0
// @description none
// @description PybGen dark mode
// @author Jurkourko
// @grant GM_addStyle
// @run-at document-start
// @match https://romw314.com/priv0/pybgen0/*
// @downloadURL https://update.greasyfork.org/scripts/522021/PybGen%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522021/PybGen%20dark%20mode.meta.js
// ==/UserScript==

(function() {
let css = `

.blocklyToolboxDiv {
    background-color: #676767;
}
.blocklyTreeSeparator {
    border-bottom: solid #373737 1px;
}
.blocklyMainBackground{
    fill: #0d0d0d !important;
    outline-color: #000 !important;
}
.blocklyFlyoutBackground{
    fill: #444;
}
/* .blocklyScrollbarHandle{
    fill: #313131;
} */
.blocklyScrollbarHandle{
    fill: #4d4d4d;
    outline-color: #4d4d4d;
    padding: 0px
}
.blocklyScrollbarHandle:hover{
    fill: #6a6a6a;
    outline-color: #6a6a6a;
    opacity: 60
}
html:has(body:not([data-theme=dark])) body {
    background-color: #606060;
}
#generatedCode{
    background-color: #221f00;
    outline-color: #000;
    color: #fff
/*     resize: vertical; */
}
/* .blocklyFieldRect{ */
/*     background-color: #221f00; */
/*     outline-color: #000;
    color: #fff
} */
.control{
    background-color: #1c421e !important;
}
.blocklyFlyoutButtonBackground {
    fill: #313131;
}
.blocklyHtmlInput{
    background-color: #000;
    color: #fff;
}
.blocklyFlyoutLabelText{
    fill: #fff !important;
}
/* .blocklyDropdownText{
    color: #fff !important;
} */
.symbol{
    color: #f00 !important;
}
/* .blocklyDropdownText{
    color: #fff !important;
} */
/* .blocklyFieldRect{
    fill: #000 !important;
} */
.blocklyDropdownRect{
    fill: #b0b0b0 !important;
}
/* .blocklyPath:hover{
    cursor: url(https://jurkourko.net/static/data/Cursor-Hovered.png), pointer;
} */
.blocklyDisabled{
    opacity: 1
}
.blocklyDropDownDiv{
    background-color: #494949 !important;
}
.control{
    fill: #000
}
.blocklyMenuItemContent{
    color: #fff
}
.blocklyMenu{
    background-color: #494949 !important;
}
.blocklyMutatorBackground{
   background-color: #7a7a7a !important; 
}
.blocklyMenuItemCheckbox{
    filter: invert(96%) sepia(4%) saturate(16%) hue-rotate(154deg) brightness(104%) contrast(107%);
}
/* .pixelButton{
    border: 1px solid #fff;
    background-color: #000 !important;
} */
.g-loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  background: linear-gradient(0deg, rgba(255, 61, 0, 0.2) 33%, #ff3d00 100%);
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.g-loader::after {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #606060;
}
@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg)}
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
