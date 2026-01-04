// ==UserScript==
// @name         快乐学习盒子
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快乐学习
// @author       张太难
// @match        https://www.cisp.cn/p/t_pc/course_pc_detail/video/*
// @icon         https://cdn.jsdelivr.net/gh/ZhangTainan/Drawing-bed/imgs/small.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471087/%E5%BF%AB%E4%B9%90%E5%AD%A6%E4%B9%A0%E7%9B%92%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/471087/%E5%BF%AB%E4%B9%90%E5%AD%A6%E4%B9%A0%E7%9B%92%E5%AD%90.meta.js
// ==/UserScript==


(function() {
    'use strict';
const $ = document.querySelector.bind(document);

const box = document.createElement("div");
box.style.cssText = `
  width: 200px;
  height: 100px;
  position: fixed;
  left: 10px;
  top: 10px;
  background-color: #008c8c;
  border-radius: 10px;
  transform-origin:0 0;
  transition: transform 1s;
  z-index: 999999;
`;
box.innerHTML = `
  <div id="title">快乐学习盒子</div>
  <div id="hide_btn">隐藏&lt;&lt;</div>
  <div id="rate">
    <span id="label">当前倍速:</span>
    <input id="input" type="number" value="2"/>
  </div>
`;

document.body.appendChild(box);

const title = $("#title");
const hide_btn = $("#hide_btn");
const rate = $("#rate");
const label = $("#label");
const input = $("#input");

title.style.cssText = `
  font-size: 20px;
  text-align:center;
  font-weight: bold;
`;

hide_btn.style.cssText = `
  font-size: 12px;
  width:30px;
  position:absolute;
  right:1px;
  top:0;
  border-radius:5px;
  background-color: #42b9fa;
  text-align:center;
`;

rate.style.cssText = `
  height:30px;
  color:orange;
  display:flex;
  justify-content: center;
  margin-top:20px;
  align-self: center;
`;

label.style.cssText = `
  height:30px;
  font-size:18px;
  font-weight: bold;
  width:100px;
`;

input.style.cssText = `
  width:50px;
  text-align:center;
  font-size:18px;
`;

input.min = "0.1";
input.max = "16";
input.step = "0.1";

hide_btn.addEventListener("mouseover", function () {
  hide_btn.style.backgroundColor = "#327eef";
  hide_btn.style.cursor = "pointer";
});

hide_btn.addEventListener("mouseout", function () {
  hide_btn.style.backgroundColor = "#1593fa";
  hide_btn.style.cursor = "default";
});
hide_btn.addEventListener("click", function (e) {
  box.style.transform = "scale(0.1)";
  box.style.cursor = "pointer";
  e.stopPropagation();
  box.addEventListener("click", function () {
    box.style.transform = "scale(1)";
  });
});

input.addEventListener("change", function (e) {
  const video = $("video");
  if (!video) {
    alert("元素获取失败,耶稣也救不了你！");
  }
  const rate = e.target.value;
  if (rate >= 16) {
    alert("现在的我已经飙到极限啦！");
    input.value = 16;
  }
  video.playbackRate = rate;
});

    // Your code here...
})();