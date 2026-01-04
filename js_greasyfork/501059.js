// ==UserScript==
// @name ハーメルン　マウスオーバーで特殊タグを解除
// @namespace https://greasyfork.org/ja/users/942894
// @version 20240718
// @description ハーメルンの特殊タグ等をマウスオーバーした時だけ解除する。対応しているのは「ぼかし」「文字色変更（透明文字）」「フォント変更」
// @author _Hiiji
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://syosetu.org/novel/*
// @downloadURL https://update.greasyfork.org/scripts/501059/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E7%89%B9%E6%AE%8A%E3%82%BF%E3%82%B0%E3%82%92%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/501059/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%80%80%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%E3%81%A7%E7%89%B9%E6%AE%8A%E3%82%BF%E3%82%B0%E3%82%92%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
let css = `
/*ぼかし解除*/
span.tag_blur:hover
{filter:blur(0px) !important;}
/*色変え解除*/
body.night span.color:hover
{color: rgb(255, 255, 255) !important;}
body:not(.night) span.color:hover
{color: rgb(0, 0, 0) !important;}
/*フォント変更解除*/
span.webfont_subset:hover
{font-family:f-1 !important;}
/*輪郭線変更解除*/
body.night span.strokecolor:hover
{-webkit-text-stroke: 0px rgb(255, 255, 255) !important;}
body:not(.night) span.strokecolor:hover
{-webkit-text-stroke: 0px rgb(0, 0, 0) !important;}
/*文字隠し解除*/
span.tag_opacity:hover
{filter:opacity(1.0) !important;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
