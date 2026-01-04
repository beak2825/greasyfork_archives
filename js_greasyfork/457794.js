// ==UserScript==
// @name                fast teaching evaluation of NJUST
// @name:zh-CN          南京理工大学快速评教
// @namespace           https://github.com/Freed-Wu
// @version             0.0.1
// @description         Evaluate teaching of NJUST.
// @description:zh-CN   快速评教（南京理工大学）
// @license             GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @author              Wu Zhenyu
// @match               *://202.119.81.113:9080/njlgdx/xspj/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/457794/fast%20teaching%20evaluation%20of%20NJUST.user.js
// @updateURL https://update.greasyfork.org/scripts/457794/fast%20teaching%20evaluation%20of%20NJUST.meta.js
// ==/UserScript==
let inputs = document.querySelectorAll("input[type=radio]");
let choices = [];
// count of evaluation metric is less than 20
for (let i = 0; i < 20; i++) {
  choices.push(Math.floor(Math.random() * 3));
}
let order = 0;
// every evaluation metric has 5 choices: very good, good, normal, bad, very bad
for (input of inputs) {
  if (choices[Math.floor(order / 5)] == order++ % 5) {
    input.checked = true;
  }
}
