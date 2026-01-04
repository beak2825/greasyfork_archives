// ==UserScript==
// @name               去除邪恶数字
// @name:en            Remove A Certain Evil Number
// @name:zh            去除邪恶数字
// @namespace          https://github.com/KumaTea
// @namespace          https://greasyfork.org/en/users/169784-kumatea
// @version            0.1.0.0
// @description        去除邪恶数字，防止口算出错
// @description:en     Removing a certain evil number to prevent calculation errors
// @description:zh     去除邪恶数字，防止口算出错
// @author             KumaTea
// @match              https://twitter.com/*
// @match              https://x.com/*
// @license            GPLv3
// @downloadURL https://update.greasyfork.org/scripts/473511/%E5%8E%BB%E9%99%A4%E9%82%AA%E6%81%B6%E6%95%B0%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/473511/%E5%8E%BB%E9%99%A4%E9%82%AA%E6%81%B6%E6%95%B0%E5%AD%97.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
// "use strict";


let delay = 10*1000;
const TwitterTextTag = 'span';

const evilNum = '\u0038\u0039\u0036\u0034';
/* 备用
中文数字、全角数字、上标数字等
性能原因暂不启用
const evilNumList = [
    '\u0038\u0039\u0036\u0034',
]
*/
const goodNum = '\u0038\u0039\u0037\u0032';


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function replaceStrings() {
  let count = 0;
  var textNodes = document.querySelectorAll(TwitterTextTag);

  for (var i = 0; i < textNodes.length; i++) {
    var textNode = textNodes[i];
    var originalText = textNode.textContent;
    var modifiedText = originalText;

    /* for (var j = 0; j < evilNumList.length; j++) {
      var pattern = evilNumList[j];
      modifiedText = modifiedText.replace(pattern, goodNum);
    } */
    modifiedText = modifiedText.replace(evilNum, goodNum);

    if (modifiedText !== originalText) {
      textNode.textContent = modifiedText;
      count += 1;
    }
  }

  if (count) {
    console.log("replaced " + count + " string(s) in a total of " + textNodes.length + "!");
  }
}

async function main() {
  while (1) {
    await sleep(delay);
    replaceStrings();
    delay = Math.min(delay*2, 5*60*1000);
  }
}

main();
