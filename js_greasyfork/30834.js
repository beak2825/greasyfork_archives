// ==UserScript==
// @name        Job fileter for inexperience
// @name:zh-CN  新人工作过滤器
// @namespace   gtihub.com/lancelovereading
// @description Remove jobs that require working experience. For personal use only.
// @description:zh-CN 去除需要工作经验的工作。个人使用，请勿滥用。
// @match       *://www.seek.com.au/*
// @version     2017.7.18
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30834/Job%20fileter%20for%20inexperience.user.js
// @updateURL https://update.greasyfork.org/scripts/30834/Job%20fileter%20for%20inexperience.meta.js
// ==/UserScript==
var unwantedElements = document.getElementsByTagName('article');
var i = unwantedElements.length;
var regex = new Array();

regex[0] = /(seeking|are you|(looking|available|start|(role|opportunity)( ideal)?) for) an experienced/i;
regex[1] = /[1-9](-[2-9])?( ?\+)? years?('s?)?( ?\+)? experience/i;

while (i--) {
  var r = regex.length;
  while (r--){
    if (unwantedElements[i].innerHTML.match(regex[r])) {
      unwantedElements[i].parentNode.removeChild(unwantedElements[i]);
    }
  }
}