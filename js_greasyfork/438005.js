// ==UserScript==
// @name         Instagram Keyboard Shortcuts (custom)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      GNU AGPLv3
// @author       HongKongTony
// @description  Keyboard shortcuts for Instagram (when input focus is not on an input box or text input form field)
// @match        *://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438005/Instagram%20Keyboard%20Shortcuts%20%28custom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438005/Instagram%20Keyboard%20Shortcuts%20%28custom%29.meta.js
// ==/UserScript==

/* Keyboard shortcuts:
"∆" = follow/unfollow.
";" = pick first post on the page (if none is picked yet).
"O" = like/unlike post.
"P" = save/unsave post.
"W" and "2" = download post.
"Q" and "E", or "1" and "3" = previous and next posted picture/video. If there's no more, it'll navigate to previous/next post.
"[" and "]"= previous and next post (alternative for Left and Right arrow keys).
"K" = play/pause posted video.
"J" and "L" = rewind and fast forward posted video by 10 seconds.
"M" = mute/unmute posted video.
"?" = display keyboard shortcut list.
*/

(eHelp => {
  function getCurMedia(ele) {
    switch ((ele = document.querySelectorAll("._2dDPU .vi798 .Ckrof")).length) {
      case 3:
        return document.querySelector(".yiMZG ._6CZji") ? (document.querySelector(".yiMZG .POSa_") ? ele[1] : ele[0]) : ele[2];
      case 2:
        return document.querySelector(".yiMZG ._6CZji") ? ele[0] : ele[1];
      case 1:
        return ele[0];
      default:
        return document.querySelector("._2dDPU ._97aPb .OAXCp");
    }
  }
  addEventListener("keydown", function(ev, ele) {
    if (
      (document.activeElement &&
        ((/^(INPUT|TEXTAREA)$/).test(document.activeElement.tagName) || document.activeElement.isContentEditable)
      )
    ) {
      return;
    } else if (ev.ctrlKey || ev.altKey) {
      return;
    } if (ev.key === "?") {
      if (!eHelp) {
        (eHelp = document.createElement("DIV")).id = "iks_help";
        eHelp.innerHTML = `<style>
#iks_help{position:fixed;z-index:999999999;left:0;top:0;right:0;bottom:0;background:rgb(0,0,0,0.5);cursor:pointer}
#iks_pop{position:fixed;right:.5em;bottom:.5em;border:2px solid #000;border-radius:.5em;padding:.5em;background:#fff;font-size:12pt;line-height:normal}
#iks_title{margin-bottom:.5em;font-size:14pt;font-weight:bold;line-height:normal}
#iks_list tr:nth-child(2n+1){background:#eee}
#iks_list td{padding:.05em .3em;vertical-align:middle;font-size:12pt;font-weight:normal;line-height:normal}
#iks_list div{display:inline-block;border:1px solid #000;border-radius:.3em;min-width:1.6em;background:#fff;text-align:center;font-weight:bold;line-height:1.4em}
</style>
<div id="iks_pop">
  <div id="iks_title">Instagram Keyboard Shortcuts List</div>
  <table id="iks_list">
    <tr><td><div>I</div></td><td>Toggle follow / unfollow.</td></tr>
    <tr><td><div>;</div></td><td>Pick first post on the page (if none picked yet).</td></tr>
    <tr><td><div>O</div></td><td>Toggle like / unlike.</td></tr>
    <tr><td><div>P</div></td><td>Toggle save / unsave.</td></tr>
    <tr><td><div>[</div>, <div>]</div> or <div>A</div>, <div>D</div></td><td>Navigate to previous / next post.</td></tr>
    <tr><td><div>N</div>, <div>M</div></td><td>Navigate to previous / next media in the post.<br />If there's no more, navigate to previous / next post.</td></tr>
    <tr><td><div>K</div></td><td>Play / pause video in the post.</td></tr>
    <tr><td><div>J</div>, <div>L</div></td><td>Rewind / fast forward video in the post by 10 seconds.</td></tr>
    <tr><td><div>,</div></td><td>Mute / unmute video in the post.</td></tr>
    <tr><td><div>?</div></td><td>Display this list.</td></tr>
  </table>
</div>`;
        eHelp.onclick = () => eHelp.remove();
      }
      if (eHelp.parentNode) {
        eHelp.remove();
      } else document.documentElement.appendChild(eHelp);
      return;
    } else if (ev.shiftKey) return;
    switch (ev.key.toUpperCase()) {
      case ";": //pick first post on the page
        if (!document.querySelector(".L_LMM") && (ele = document.querySelector(".v1Nh3>a"))) ele.click();
        break;
	  case "2": //download post
	  case "W":
      if (ele = document.querySelector("button.downloadBtn")) ele.click();
        break;
      case "1": //previous post's picture/video
	  case "Q":
        if (ele = document.querySelector(".yiMZG .POSa_")) {
          ele.click();
        } else if (ele = document.querySelector(".ITLxV")) ele.click();
        break;
      case "3": //next post's picture/video
	  case "E":
        if (ele = document.querySelector(".yiMZG ._6CZji")) {
          ele.click();
        } else if (ele = document.querySelector("._65Bje")) ele.click();
        break;
	  case "[": //previous post
        if (ele = document.querySelector(".ITLxV")) ele.click();
        break;
      case "]": //next post
        if (ele = document.querySelector("._65Bje")) ele.click();
        break;
      case "K": //play/pause post's video
        if ((ele = getCurMedia()) && (ele = ele.querySelector(".fXIG0"))) ele.click();
        break;
      case ",": //rewind post's video by 10 seconds
        if ((ele = getCurMedia()) && (ele = ele.querySelector(".tWeCl"))) ele.currentTime -= 10;
        break;
      case ".": //fast forward post's video by 10 seconds
        if ((ele = getCurMedia()) && (ele = ele.querySelector(".tWeCl"))) ele.currentTime += 10;
        break;
      case "M": //mute/unmute video
        if ((ele = getCurMedia()) && (ele = ele.querySelector(".y2rAt"))) ele.click();
        break;
    }
  });
})();
