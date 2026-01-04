// ==UserScript==
// @name TL.net High Contrast Text
// @namespace tl.net
// @version 1.0.0
// @description Increases contrast of text.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tl.net/*
// @downloadURL https://update.greasyfork.org/scripts/407558/TLnet%20High%20Contrast%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/407558/TLnet%20High%20Contrast%20Text.meta.js
// ==/UserScript==

(function() {
let css = `

  .titelbalk .tooltip span.tt-userinfo
  {
    vertical-align: middle;
    color: #3f5370;
  }

  .titelbalk .tt-userinfo
  {
    color: #3f5370;
  }

  .titelhigh .tt-userinfo
  {
    color: #c4daec;
  }

  .titelhigh .submessage,.titelhigh .fpost-username
  {
    color: #fff!important;
  }

  .submessage
  {
    color: #373837 !important;
  }

  .lev-none
  {
    color: #373837;
  }

  .userarrow
  {
    display: inline-block;
    margin-left: 4px;
    background: transparent url("http://www.teamliquid.net/staff/wo1fwood/TL/topbannersprite.png") no-repeat scroll -43px -50px;
    vertical-align: middle;
    height: 10px;
    width: 10px;
  }

  .forumPost
  {
    color: #000;
  }

  .forumsig
  {
    color: #555;
  }

  .quote
  {
    color: #555;
  }

  .quote:hover
  {
    color: #000;
  }

  .sidebar_block .block-news_left_mid a.comments
  {
    color: #555 !important;
  }

  #main-left-sidebar
  {
    color: #000 !important;
  }

  .forumPost a:link
  {
    color: #669acc;
  }

  .forumPost a:visited
  {
    color: #336799;
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
