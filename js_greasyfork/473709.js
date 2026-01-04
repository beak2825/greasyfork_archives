// ==UserScript==
// @name               B站BV号添加超链接
// @name:en            Bilibili Linker
// @name:zh            B站BV号添加超链接
// @namespace          https://github.com/KumaTea
// @namespace          https://greasyfork.org/en/users/169784-kumatea
// @version            0.1.0.0
// @description        替换文本形式的B站BV号为超链接
// @description:en     Replaces BV codes with links to Bilibili videos
// @description:zh     替换文本形式的B站BV号为超链接
// @author             KumaTea
// @match              https://www.bilibili.com/*
// @match              https://bilibili.com/*
// @license            GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473709/B%E7%AB%99BV%E5%8F%B7%E6%B7%BB%E5%8A%A0%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/473709/B%E7%AB%99BV%E5%8F%B7%E6%B7%BB%E5%8A%A0%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


const BVPattern = /BV\w{10}/g;
const BVPrefix = "https://www.bilibili.com/video/";
const TextTags = "span, p, div";

function replace() {
  var elements = document.querySelectorAll(TextTags);

  for (var i = 0; i < elements.length; i++) {
    var html = elements[i].innerHTML;
    if (BVPattern.test(html)) {
      html = html.replace(BVPattern, function(match) {
        return "<a target='_blank' href='" + BVPrefix + match + "'>" + match + "</a>";
      });
      elements[i].innerHTML = html;
    }
  }
}

// replace();
window.addEventListener('load', replace, false);
