// ==UserScript==
// @name        네이버 부동산 테스트
// @namespace   Violentmonkey Scripts
// @match       https://new.land.naver.com/complexes*
// @version     0.1
// @author      Maru
// @description Please use with violentmonkey
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.10/clipboard.min.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/458551/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%ED%85%8C%EC%8A%A4%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/458551/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EB%B6%80%EB%8F%99%EC%82%B0%20%ED%85%8C%EC%8A%A4%ED%8A%B8.meta.js
// ==/UserScript==

var gLastSelectedApt = "";

const disconnect = VM.observe(document.body, () => {
    // Find the target node
    let node = document.querySelector('#complexTitle');
    if (!node) {
        return;
    }
  
    if (node.innerText != gLastSelectedApt) {
        node.innerText += "(Hello)";
        gLastSelectedApt = node.innerText;
        console.error(gLastSelectedApt);
    }
  });
  
  // You can also disconnect the observer explicitly when it's not used any more
  //disconnect();

