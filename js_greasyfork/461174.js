// ==UserScript==
// @name        test评论
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  評論到盡頭，衝！
// @author       Bonbon
// @match        https://weibo.com/*
// @downloadURL https://update.greasyfork.org/scripts/461174/test%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461174/test%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==


//2.0
//更新了第二轮后没有等待10分钟的问题，原因是在loop完后没有clearinterval。
//更新了暂停后，点几commentbutton依然会自动运行的错误。原因是没有加pause funtion
//需要更新频繁操作没有自动停止，在后面版本再处理

//3.0
//不再评论大号，而是自动读取主页名称作为NAME记录，并评论小号。
//频繁会自动停止
//禁止了连点start的问题

//3.1
//修改了秒数，恢复630000ms

//3.2
//修改了顺序，只有点了start才会跳出prompt

//3.3
//新增總評論數，顯示一共跑了多少條評論在右下角

//3.4
//解决commentcounter在最后一条会自动归0的问题。
//修正秒数，发送第一条评论后不会无故吞掉楼中楼
//修正总评论数位置，在评论后才会增加总评论数。尽量减少计算无效评论

//4.0
//掛機時，樓中樓過100就會非常慢，添加了判斷。過100則會自動reload the page。
//把非自動的variable都改成locastorage。
//totalcommentcounter在刷新後也不會消失

//5.0 2023-04-10
//添加了点赞功能，每条评论后都会同步点赞
//修改了异步问题，把async和await功能把每一步都改为按顺序执行
//在步骤中加入settimeout，确保有一定的等待时间
//把load的window.addEventListener('load' 后的istarted改成true，确保每次刷新都会自动运行。但用户需要自己手动点击暂停才可以停止，否则会一直运行。
// 下次需要把totalcommentcounter重新修改，确保在重新点击start之后可以重新计算。

//5.1 2023-04-14
//因为interval时间过短导致有异步出现，已修改秒数。

//5.2 2023-04-21
//修改了countdown的判定，防止因為interval產生延遲後觸發多個postcomment

//5.3 2023-04-21
//增加了backtozero的按鈕，可以把總評論數在手動歸零
//增加terms，dw死開


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


  function firstComment(comment) {

    // 发布评论
    var commentInput = document.querySelector("textarea[placeholder='发布你的评论'].Form_input_3JT2Q");
    if (commentInput) {
      // 输入评论内容
      commentInput.value = comment;
      console.log("Comment posted: " + comment);

      // 触发 oninput 事件
      var inputEvent = new Event("input", { bubbles: true });
      commentInput.dispatchEvent(inputEvent);

       setTimeout(function(){
     // 点击提交按钮
      var submitButton = [...document.querySelectorAll('button')].find(button => button.textContent.trim() === '评论');
      if (submitButton) {
        submitButton.click();
        console.log("Comment submitted");
      }
    },1000);
  }
}

async function postComment(comment, maxCount) {
 clearInterval(countdownId);
    console.log('postcomment了')

async function louzhonglou() {
    timerId = setInterval(async function() {

    // Click the comment button that contains NAME
    var commentButton = Array.from(document.querySelectorAll('a'))
      .find(a => a.textContent.includes(NAME));
    if (commentButton) {
      var parentElement = commentButton.parentElement.parentElement;
      var commentElement = parentElement.querySelector(".woo-font.woo-font--comment");
      if (commentElement) {
        commentElement.click();
      }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 3 秒钟

    // Enter the comment
    var commentInput = document.querySelector("textarea[placeholder='发布你的回复'].Form_input_3JT2Q");
    if (commentInput) {
      // Generate random emoji
      var emoji1 = String.fromCodePoint(getRandomInt(0x1F300, 0x1F64F));
      var emoji2 = String.fromCodePoint(getRandomInt(0x1F300, 0x1F64F));
      // Input the comment
      commentInput.value = emoji1 + comment + emoji2 + commentCounter;

      // Dispatch an input event to trigger the textarea's oninput event
      var inputEvent = new Event("input", { bubbles: true });
      commentInput.dispatchEvent(inputEvent);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 3 秒钟

    // Click the submit button
    var submitButton = document.querySelector(".disabled:nth-child(4)");
    console.log("Comment posted: " + emoji1 + comment + emoji2 + commentCounter);

if (submitButton) {
  submitButton.click();
}

// 等待 0.5 秒钟
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


var successMessage = document.evaluate("//span[contains(text(),'回复评论成功')]", document, null, XPathResult.ANY_TYPE, null);
var successElement = successMessage.iterateNext();
var successDisplayed = false; // 标志变量
while (successElement) {
  // 显示成功回复评论的弹窗
  console.log("成功回复评论！");
  successDisplayed = true; // 更新标志变量
  successElement = successMessage.iterateNext();
}

if (!successDisplayed) { // 如果成功回复评论的弹窗没有显示，则不增加评论计数器
  console.log("回复评论失败，重新进行相同轮次的评论");
} else {
  // Increment the counter
  commentCounter++;
  loopcommentcounter++ //用來識別是否過100條
  totalcommentcounter++;//計算總評論數

    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 3 秒钟

    const likeButton = document.querySelector('#scroller > div.vue-recycle-scroller__item-wrapper > div:nth-child(1) > div > div > div > div.list2 > div:nth-child(1) > div > div.info.woo-box-flex.woo-box-alignCenter.woo-box-justifyBetween > div.opt.woo-box-flex > div.wbpro-iconbed.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter.optHover.IconList_autoIcon_a6R6k > button > span');
    if (likeButton) {
      likeButton.click();
      console.log('已点赞' + (commentCounter - 1));
    }
  }

    console.log('第幾輪：' + (commentCounter - 1))
    localStorage.setItem('totalcommentcounter', totalcommentcounter);

   counter_div.innerText = '總評論數: ' + totalcommentcounter;



      // Check if maxCount comments have been posted
        if (commentCounter >= maxCount) {
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
        //if (remainingTime === 0) {
          commentCounter = 1;
        if (loopcommentcounter >= 47) {
          loopcommentcounter = 0;
    //refresh the page and auto start the program again
// Set isReloadedByProgram to true and then reload the page
isReloadedByProgram = true
console.log('beforereload:', isReloadedByProgram);
location.reload();

        } else {
    postComment(comment, maxCount);
     console.log('倒計時結束，已出發新一輪評論')
        }
      //}
      }
    }, 1000);
            }
        }, 4000);
    }
await louzhonglou();
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

  firstComment(comment);
  postComment(comment, maxCount);
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
    postComment(localStorage.getItem('comment'), localStorage.getItem('maxCount'));
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