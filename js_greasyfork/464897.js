// ==UserScript==
// @name        主樓
// @namespace    http://tampermonkey.net/
// @version     1.0
// @description  評論到盡頭，衝！
// @author       Bonbon
// @match        https://weibo.com/*
// @downloadURL https://update.greasyfork.org/scripts/464897/%E4%B8%BB%E6%A8%93.user.js
// @updateURL https://update.greasyfork.org/scripts/464897/%E4%B8%BB%E6%A8%93.meta.js
// ==/UserScript==


(function() {
  'use strict';

    var NAME = null;

  // 等待大号元素加载完成后再获取它的属性
  var intervalId = setInterval(function() {
    var element = document.querySelector(".Ctrls_avatarItem_3LrJN[title]");
    if (element) {
      clearInterval(intervalId);
      NAME = element.getAttribute("title");
      console.log("大号是:" + NAME);
    }
  }, 100);

  var commentCounter = 1;
  var timerId = null;
  var countdownId = null;
  var countdownElement = null;
  var intervalIds = []; // 存储所有定时器 ID

  var loopcommentcounter = 0;
  var totalcommentcounter = localStorage.getItem('totalcommentcounter') || 0;
    console.log("total評論了:" + totalcommentcounter);

  // 读取变量的值
  var comment = localStorage.getItem('comment') || '';
  var maxCount = localStorage.getItem('maxCount') || 0;

// 定义一个全局变量来表示是否是通过location.reload()触发的reload
var isReloadedByProgram = false;
    let canLike = true;


async function firstComment(comment, maxCount) {

async function normalcomment() {
    timerId = setInterval(async function() {
     console.log(commentCounter)
    // 发布评论
    var commentInput = document.querySelector("textarea[placeholder='发布你的评论'].Form_input_3JT2Q");
   await new Promise(resolve => setTimeout(resolve, 1000));
       if (commentInput) {
      // Generate random emoji
      var emoji1 = String.fromCodePoint(getRandomInt(0x1F300, 0x1F64F));
      var emoji2 = String.fromCodePoint(getRandomInt(0x1F300, 0x1F64F));
      // Input the comment
      commentInput.value = emoji1 + comment + emoji2 + commentCounter;
      console.log("Comment posted: " + emoji1 + comment + emoji2 + commentCounter);
       }
      // 触发 oninput 事件
      var inputEvent = new Event("input", { bubbles: true });
      commentInput.dispatchEvent(inputEvent);
await new Promise(resolve => setTimeout(resolve, 1000));
     // 点击提交按钮
      var submitButton = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === '评论');
      if (submitButton) {
        submitButton.click();
        console.log("Comment submitted");
      }
  commentCounter++;
  loopcommentcounter++ //用來識別是否過100條
  totalcommentcounter++;//計算總評論數
   await new Promise(resolve => setTimeout(resolve, 1000));

    var frequentOperation = document.evaluate("//div[contains(@class,'woo-toast--error')]//span[contains(text(),'操作频繁，请您稍后再试')]", document, null, XPathResult.ANY_TYPE, null);
    var operationElement = frequentOperation.iterateNext();
    while (operationElement) {
      clearInterval(timerId);
      startButton.disabled = false; // 启用 start button
      isStarted = false;
      countdownElement.style.display = "none"; // 隐藏倒计时
      alert("操作太频繁，请稍后再试！");
      operationElement = frequentOperation.iterateNext();
    }
       await new Promise(resolve => setTimeout(resolve, 1000));

       const likeButton = document.evaluate('//*[@id="scroller"]/div[1]/div[1]/div/div/div/div[1]/div[2]/div[2]/div[2]/div[4]/button/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (canLike) {
    if (likeButton) {
      likeButton.click();
      console.log('已点赞' + (commentCounter - 1));
    }
      // 等待 0.5 秒钟
await new Promise(resolve => setTimeout(resolve, 1000));

var errorMessage = document.evaluate("//span[contains(text(), '点赞太快了，休息一下再试试吧')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
// 获取选中的第一个元素
var errorMessageNode = errorMessage.singleNodeValue;

if (errorMessageNode) {
  console.log("点赞太快了，已停止點贊");
  canLike = false;
}
      }
await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if maxCount comments have been posted
        if ((commentCounter - 1) >= maxCount) {
            console.log('大於maxcount了')
            clearInterval(countdownId);
            clearInterval(timerId);
           countdownElement.style.display = "block";
       var remainingTime = 600000; // 600000ms = 10 minutes
      var countdownEnded = false; // 标志变量，记录倒计时计时器是否已经结束
       countdownId = setInterval(function() {
      countdownElement.innerHTML = "等候" + remainingTime/1000 + " 秒开始下一轮";
      remainingTime -= 1000;
     if (remainingTime <= 0 && !countdownEnded) {
    countdownEnded = true; // 将计时器结束标志设置为 true
        clearInterval(countdownId);
          commentCounter = 1;
    firstComment(comment, maxCount)
     console.log('倒計時結束，已出發新一輪評論')
        }
    }, 1000);
            }
await new Promise(resolve => setTimeout(resolve, 1000));
}, 7000);
  }
    await normalcomment();
   }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

var termsButton = document.createElement("button");
termsButton.innerHTML = "僅限村粉使用";
termsButton.setAttribute("floatButton", "");
termsButton.style.zIndex = "9999999";
termsButton.style.position = "fixed";
termsButton.style.top = "30px";
termsButton.style.height = "30px";
termsButton.style.minWidth = "40px";
termsButton.style.fontSize = "16px";
termsButton.style.padding = "0 10px";
termsButton.style.border = "0";
termsButton.style.borderRadius = ".25em";
termsButton.style.background = "initial";
termsButton.style.backgroundColor = "#f53b5f";
termsButton.style.color = "#080304";


      // 定义一个变量来表示是否已经点击了start按钮
let isStarted = false;

var startButton = document.createElement("button");
startButton.innerHTML = "開始評論";
startButton.setAttribute("floatButton", "");
startButton.style.zIndex = "9999999";
startButton.style.position = "fixed";
startButton.style.top = "70px";
startButton.style.height = "30px";
startButton.style.minWidth = "40px";
startButton.style.fontSize = "16px";
startButton.style.padding = "0 10px";
startButton.style.border = "0";
startButton.style.borderRadius = ".25em";
startButton.style.background = "initial";
startButton.style.backgroundColor = "#ffd6de";
startButton.style.color = "#727bf7";
startButton.addEventListener("click", function() {

  // 读取变量的值
  var comment = localStorage.getItem('comment', '');
  var maxCount = localStorage.getItem('maxCount', 0);

  // 获取用户输入
  comment = prompt("評論文案", comment);
  maxCount = prompt("10分鐘能評論最大次數，不超過16條", maxCount);

  // 保存变量的值
  localStorage.setItem('comment', comment);
  localStorage.setItem('maxCount', maxCount);

  firstComment(comment, maxCount);
  //postComment(comment, maxCount);
  startButton.disabled = true;
  // 将isStarted变量设置为true
  isStarted = true;

});

// 每次页面加载时检查localStorage中的isStarted值
window.addEventListener('load', () => {
  if (localStorage.getItem('isStarted') === 'true' && localStorage.getItem('isReloadedByProgram') === 'true') {
  // 如果isStarted为true，且是通过location.reload()触发的reload，则自动运行postComment函数
  setTimeout(function(){
    firstComment(localStorage.getItem('comment'));
    console.log('運行了firstcomment');
    //postComment(localStorage.getItem('comment'), localStorage.getItem('maxCount'));
    isStarted = true;
    isReloadedByProgram = false;
  }, 5000);
} else {
  stopButton.click()
}
});

// 在页面关闭前保存isStarted的值到localStorage中
window.addEventListener('beforeunload', () => {
localStorage.setItem('isStarted', isStarted);
localStorage.setItem('isReloadedByProgram', isReloadedByProgram.toString());
console.log('isReloadedByProgram:', isReloadedByProgram); // 输出isReloadedByProgram的值
});


var stopButton = document.createElement("button");
stopButton.innerHTML = "暫停評論";
stopButton.setAttribute("floatButton", "");
stopButton.style.zIndex = "9999999";
stopButton.style.position = "fixed";
stopButton.style.top = "110px";
stopButton.style.height = "30px";
stopButton.style.minWidth = "40px";
stopButton.style.fontSize = "16px";
stopButton.style.padding = "0 10px";
stopButton.style.border = "0";
stopButton.style.borderRadius = ".25em";
stopButton.style.background = "initial";
stopButton.style.backgroundColor = "#ffd6de";
stopButton.style.color = "#727bf7";
  stopButton.addEventListener("click", function() {
    clearInterval(countdownId);
      clearInterval(timerId);
    startButton.disabled = false; // 启用 start button
      isStarted = false
    countdownElement.style.display = "none"; // 隐藏倒计时
  });

var backtozeroButton = document.createElement("button");
backtozeroButton.innerHTML = "重置总评数";
backtozeroButton.setAttribute("floatButton", "");
backtozeroButton.style.zIndex = "9999999";
backtozeroButton.style.position = "fixed";
backtozeroButton.style.top = "150px";
backtozeroButton.style.height = "30px";
backtozeroButton.style.minWidth = "40px";
backtozeroButton.style.fontSize = "16px";
backtozeroButton.style.padding = "0 10px";
backtozeroButton.style.border = "0";
backtozeroButton.style.borderRadius = ".25em";
backtozeroButton.style.background = "initial";
backtozeroButton.style.backgroundColor = "#ffd6de";
backtozeroButton.style.color = "#727bf7";
backtozeroButton.addEventListener("click", function() {
    totalcommentcounter = 0
    alert('總評論數已歸零！');
  });

document.body.appendChild(startButton);
document.body.appendChild(stopButton);
document.body.appendChild(backtozeroButton);
document.body.appendChild(termsButton);

  countdownElement = document.createElement("div");
  countdownElement.style.fontSize = "20px";
  countdownElement.style.display = "none";
  countdownElement.style.marginLeft = "10px";
  var navigationBar = document.querySelector(".Bar_bar_2wYyi");
  navigationBar.appendChild(countdownElement);

  var counter_div = document.createElement('div');
    counter_div.style.position = 'fixed';
    counter_div.style.zIndex = "9999999";
    counter_div.style.bottom = '10px';
    counter_div.style.right = '10px';
    counter_div.style.padding = '10px';
    counter_div.style.background = 'blue';
    counter_div.style.color = 'white';
    counter_div.style.fontSize = '16px';
    counter_div.style.borderRadius = '5px';
    document.body.appendChild(counter_div);

})();