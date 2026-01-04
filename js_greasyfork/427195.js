// ==UserScript==
// @name         打字网英文打字语音朗读
// @namespace    yslaoyi
// @version      0.2
// @description  在练习英文打字的时候想多认识一点单词，知道它的读音的话应该对打字和英文都有帮助，她诞生了帮助我好好的学两个单词提高打字速度
// @author       yslaoyi   dazi.kukuw.com
// @match        *://*.kukuw.com/typing.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427195/%E6%89%93%E5%AD%97%E7%BD%91%E8%8B%B1%E6%96%87%E6%89%93%E5%AD%97%E8%AF%AD%E9%9F%B3%E6%9C%97%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/427195/%E6%89%93%E5%AD%97%E7%BD%91%E8%8B%B1%E6%96%87%E6%89%93%E5%AD%97%E8%AF%AD%E9%9F%B3%E6%9C%97%E8%AF%BB.meta.js
// ==/UserScript==

// 播放器状态
let playStatus = false;
// 目标单词
let targetWord = 'English typing plug-in is online';
//   创建一个Audio对象用于播放声音
let ttsAudio = new Audio();
// audioNode(); //初始化插入播放节点
// 初始操作
(function main() {
  // 外挂上线提示，并开始工作
  doTTS(targetWord);
  let firstWord = getWord();
  firstWord = 'typing Start ' + firstWord;
  setTimeout(() => {
    doTTS(firstWord);
  }, 3000);

  document.onkeydown = function (element) {
    if (element.keyCode == 32 && !playStatus) {
      targetWord = getWord(); // 当按下空格的时候获取目标单词
      doTTS(targetWord); // 单词朗读
      playStatus = true; //更新播放状态
    }
  };
})();

// 一 、获取当前单词
// 获取当前输入行，然后对空格计数，当用户按下空格时，
// 空格数量加一，获取单词数组对应的单词
function getWord() {
  const words = document.querySelector('.typing_on>input[type]').value.split(' ');
  const rightInputWords = document.querySelectorAll('.typing_on > div > span > span');
  // 空格数
  let spaceNum = 1;
  rightInputWords.forEach(item => {
    if (item.innerHTML == ' ') {
      spaceNum++;
    }
  });
  // 当空格数等于单词组长度时，为换行状态
  console.log(spaceNum, words.length);
  if (spaceNum == words.length - 1) {
    setTimeout(() => {
      lineHeaderAction();
    }, 800);
    return;
  }
  //   当未输入单词时获取第一个单词
  if (rightInputWords.length == 0) {
    spaceNum = 0;
  }
  return words[spaceNum];
}

// 二 、 发送请求到文字转声音的ai
function doTTS(ttsText) {
  if (ttsText == undefined) {
    return 0;
  }
  ttsAudio.src = `http://tts.baidu.com/text2audio?lan=en&ie=UTF-8&spd=5&text=' + ${ttsText}`;
  ttsAudio.play();
}
// 每行开头初始操作
function lineHeaderAction() {
  let firstWord = getWord();
  doTTS(firstWord);
}
// 播放器状态
ttsAudio.addEventListener('ended', function () {
  playStatus = false;
});

