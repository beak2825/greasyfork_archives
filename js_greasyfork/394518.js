// ==UserScript==
// @name         笔趣阁 biqukan 小说朗读
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  笔趣阁 朗读
// @author       sungf
// @compatible  html5
// @include https://www.biqukan.com/*/*
// @downloadURL https://update.greasyfork.org/scripts/394518/%E7%AC%94%E8%B6%A3%E9%98%81%20biqukan%20%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394518/%E7%AC%94%E8%B6%A3%E9%98%81%20biqukan%20%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
  const speechSynthesis = message => {
  const msg = new SpeechSynthesisUtterance(message);
  msg.voice = window.speechSynthesis.getVoices()[0];
  msg.onend = ()=> window.speechSynthesis.pending || document.getElementsByClassName('page_chapter')[0].children[0].children[2].children[0].click();
  window.speechSynthesis.speak(msg);
  };
    let stra = document.getElementById("content").innerText.split('\n');
    let regex = /\(https:\/\/www.biqukan.com\/*/
    for (let i = 0; i < stra.length; i++){
        let s = stra[i];
        if (regex.test(s.trim())) {
            break
        }
        if (!s || s=='' || s.trim() == '') { 
            continue;
        }
        speechSynthesis(s);
    }
})();