// ==UserScript==
// @name        京东一键好评
// @description 京东评价页面添加一键好评按钮
// @version     1.5.2
// @author      lee-
// @namespace   lee
// @grant       unsafeWindow
// @include     https://club.jd.com/myJdcomments/*
// @downloadURL https://update.greasyfork.org/scripts/25774/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/25774/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

var host = window.location.host;
var isTB = host === 'club.jd.com';
var isTM = host === 'club.jd11.com';

// 淘宝一键好评
function taobaoFun() {
  var tbParentElem = document.querySelector('.f-btnbox');
  var tbSubmitBtn = document.querySelector('.f-btnbox [class="btn-submit"]');
  var tbNewDir = document.createElement('button');
  tbNewDir.innerHTML = '一键好评';
  tbNewDir.className = 'tb-rate-btn type-primary tb-rate-btn haoping';
  tbNewDir.style.marginLeft = '50px';
  tbNewDir.onclick = function() {
    var tbGoodRate = document.querySelectorAll('.good-rate');
    for (var i = 0, a; a = tbGoodRate[i++];) {
      a.click();
    }

    var tbStar = document.querySelectorAll('.star star5 active');
    tbStar[4].click();
    tbStar[9].click();
    tbStar[14].click();

    tbSubmitBtn.click();
  };

  tbParentElem.appendChild(tbNewDir);
}

// 天猫一键好评
function tmallFun() {
  var tmParentElem = document.querySelector('.f-btnbox');
  var tmSubmitBtn = document.querySelector('.f-btnbox [class="btn-submit"]');
  var tmNewDir = document.createElement('button');
  tmNewDir.innerHTML = '一键好评';
  tmNewDir.className = 'tb-rate-btn type-primary tb-rate-btn haoping';
  tmNewDir.style.background = 'white';
  tmNewDir.style.color = '#c40000';
  tmNewDir.style.border = 'inset 1px #c40000';
  tmNewDir.onclick = function() {
    var tmStar = document.querySelectorAll('[star star5 active]');
    for (var i = 0, a; a = tmStar[i++];) {
      a.click();
    }

    tmSubmitBtn.click();
  };

  console.log(tmParentElem);
  console.log(tmNewDir);
  tmParentElem.appendChild(tmNewDir);
}

if (isTB) {
  taobaoFun();
} else if (isTM) {
  var timer = setInterval(detection, 1000);
  detection();
}

function detection() {
  var haoping = document.querySelector('.haoping');
  if (!haoping) {
    tmallFun();
  } else {
    clearInterval(timer);
  }
}
