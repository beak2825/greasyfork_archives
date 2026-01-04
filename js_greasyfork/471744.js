// ==UserScript==
// @name         B站视频时长统计
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471744/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/471744/B%E7%AB%99%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
 const box = document.querySelector("#multi_page");

const totalTime = document.createElement('div');
totalTime.textContent='0:0:0';
const button = document.createElement('button');
button.textContent='总时长'
const all = document.createElement('button');
all.textContent='全选'
box.insertBefore(totalTime,box.children[0]);
box.insertBefore(all,box.children[0]);
box.insertBefore(button,box.children[0]);
const targets = document.querySelectorAll("#multi_page > div.cur-list > ul > li > a");

for (let i = 0; i < targets.length; i++) {
    let check = document.createElement('input');
	check.type='checkbox';
    check.onclick=function (e) {
    e.stopPropagation();
}
    targets[i].appendChild(check);
}


function addTimes(timeString1, timeString2) {
  // 辅助函数，用于将时间字符串转换为总秒数
  function timeToSeconds(timeString) {
    const times = timeString.split(':').map(Number);
    const [hours, minutes, seconds] = times;
    if (times.length === 3) {
      return hours * 3600 + minutes * 60 + seconds;
    } else if (times.length === 2) {
      return times[0] * 60 + times[1];
    } else {
      return 0;
    }
  }

  let totalSeconds = timeToSeconds(timeString1) + timeToSeconds(timeString2);

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

button.onclick=function(){
    totalTime.textContent='0:0:0';
    for (let i = 0; i < targets.length; i++) {
    if(targets[i].children[1].checked==true){
        totalTime.textContent=addTimes(totalTime.textContent, targets[i].children[0].children[1].textContent)
    }
}
}

        all.onclick=function(){
    for (let i = 0; i < targets.length; i++) {
        targets[i].children[1].checked=true;

}
}
   all.oncontextmenu=function(e){
       e.preventDefault();
    for (let i = 0; i < targets.length; i++) {
        targets[i].children[1].checked=false;

}
}
},1000);
   

})();