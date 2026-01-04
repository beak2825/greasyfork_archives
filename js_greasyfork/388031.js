// ==UserScript==
// @name         qidan 小说朗读
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  qidian 朗读
// @author       sungf
// @compatible  html5
// @include https://vipreader.qidian.com/chapter/*
// @include https://read.qidian.com/chapter/*
// @include https://reader.qidian.com/chapter/*
// @downloadURL https://update.greasyfork.org/scripts/388031/qidan%20%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/388031/qidan%20%E5%B0%8F%E8%AF%B4%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
  const speechSynthesis = message => {
  const msg = new SpeechSynthesisUtterance(message);
  msg.voice = window.speechSynthesis.getVoices()[0];
  msg.onend = ()=> window.speechSynthesis.pending || document.getElementById('j_chapterNext').click();
  window.speechSynthesis.speak(msg);
  };
  for(let i=0;i<document.getElementsByClassName("read-content")[0].children.length;i++){
    speechSynthesis(document.getElementsByClassName("read-content")[0].children[i].innerText);
  }
})();