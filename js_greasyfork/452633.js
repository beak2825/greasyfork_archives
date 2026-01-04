// ==UserScript==
// @name Bigger echo360
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match https://echo360.org.uk/lesson*
// @downloadURL https://update.greasyfork.org/scripts/452633/Bigger%20echo360.user.js
// @updateURL https://update.greasyfork.org/scripts/452633/Bigger%20echo360.meta.js
// ==/UserScript==

(function() {
let css = `
    /*.video.media-screen.focused{top: -20px!important;left: -120px!important}
    video{width:135%!important;height:135%!important;}
    /*.video.media-screen{top: -20px!important;left: -50px!important}
    video{width:120%!important;height:120%!important;}*/
    .transcript-cues > p > span{font-size: 140%;}
    .tttthighlight > span {font-size: 140%!important}
    .screen-loader{display:none!important}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
