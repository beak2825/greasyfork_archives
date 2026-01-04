// ==UserScript==
// @name         PTT 隱藏廢文腳本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隱藏含有特定關鍵字文章
// @author       ciye
// @match        https://www.ptt.cc/bbs/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416196/PTT%20%E9%9A%B1%E8%97%8F%E5%BB%A2%E6%96%87%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/416196/PTT%20%E9%9A%B1%E8%97%8F%E5%BB%A2%E6%96%87%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

let title = document.querySelectorAll('.title');
let push = document.querySelectorAll('.push');
let board = document.querySelector('.bbs-content');
let Keyword = ['問題', '討論', '問卦']; // 過濾含有特定文字文章
let Keyword2 =['五樓', "樓上", "樓下"]; // 過濾含有特定文字推文

// 建立"已隱藏"字串
let textDiv = document.createElement("div");
textDiv.className = "text";
textDiv.textContent = '已隱藏:';
textDiv.onclick = Reset;
textDiv.style.display = "block";
textDiv.style.color = "red";
textDiv.style.padding = "0px";
textDiv.style.fontSize = "15px";
board.appendChild(textDiv);

if(title.length > 1) {
  HiddenTitle();
}
if(push.length > 1) {
  HiddenPush();
}

// 建立"顯示已隱藏"字串
let textA = document.createElement("a");
textA.className = "a";
textA.textContent = '解除隱藏';
textA.onclick = Reset;
textA.style.display = "block";
textA.style.color = "white";
textA.style.zIndex = "5000000";
textA.style.marginLeft = "10px";
textA.style.fontSize = "15px";
board.appendChild(textA);


// 建立"發文、推文數"字串
function buildDiv(item, item2) {
  let Title = document.createElement("div");
  Title.className = "num";
  Title.textContent = "發文:" + item;
  Title.style.display = "block";
  Title.style.color = "red";
  Title.style.padding = "0px";
  Title.style.fontSize = "10px";
  board.appendChild(Title);

  let Push = document.createElement("div");
  Push.className = "num";
  Push.textContent = "推文:" + item2;
  Push.style.display = "block";
  Push.style.color = "red";
  Push.style.paddingLeft = "5px";
  Push.style.fontSize = "10px";
  board.appendChild(Push);
}

// 恢復已隱藏發文，以半透明顯示
function Reset(){
  title.forEach((item) => {
    Keyword.forEach((item2) => {
      if (item.innerText.indexOf(item2) != -1 ) {
        item.parentNode.style.display = "block";
        item.parentNode.style.opacity = "0.5";
      }
    })
  })
  push.forEach((item) => {
    Keyword2.forEach((item2) => {
      if (item.innerText.indexOf(item2) != -1 ) {
        item.style.display = "block";
        item.style.opacity = "0.5";
      }
    })
  })
}
// 過濾文章關鍵字
function HiddenTitle() {
  let TitleNum = 0;
  title.forEach((item) => {
    Keyword.forEach((item2) => {
      if (item.innerText.indexOf(item2) != -1 ) {
        TitleNum += 1;
        item.parentNode.style.display = "none";
      }
    })
  })
  buildDiv(TitleNum,0);
}


// 過濾推文關鍵字
function HiddenPush() {
  let PushNum = 0;
  push.forEach((item) => {
    Keyword2.forEach((item2) => {
      if (item.innerText.indexOf(item2) != -1 ) {
        PushNum += 1;
        item.style.display = "none";
      }
    })
  })
  buildDiv(0,PushNum);
}
