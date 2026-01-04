// ==UserScript==
// @name mtest
// @version 3.8.2
// @antifeature membership
// @description .......................................
// @author zwstart
// @match https://*.mexc.com/*
// @namespace https://greasyfork.org/users/1153795
// @downloadURL https://update.greasyfork.org/scripts/473331/mtest.user.js
// @updateURL https://update.greasyfork.org/scripts/473331/mtest.meta.js
// ==/UserScript==

let intervalId;
let inputValue;
let outputValue;

function startTimer() {
// 弹出对话框，获取抄底值
inputValue = prompt("请输入您的抄底值:");
// 弹出对话框，获取跑路值
outputValue = prompt("请输入您的跑路值:");

intervalId = setInterval(() => {
// 查询targetElement的值
const targetElement = document.querySelector('span.components-pricetext-index-text').innerText;
// 检查targetElement的值
if (targetElement) {
// 如果targetElement存在，执行你的逻辑
console.log(targetElement);
// 将inputValue和targetElement转换为数值类型
const inputValueNumber = parseFloat(inputValue);
const targetElementNumber = parseFloat(targetElement);
// 比较inputValueNumber和targetElementNumber的大小
if (inputValueNumber == targetElementNumber) {
speak("到最低啦");
} else if (outputValue == targetElementNumber) {
speak("该跑路了");
} else {
speak("啥也不是");
}
} else {
// 如果targetElement不存在，执行你的逻辑
console.log('targetElement不存在');
// 在这里可以进行你的操作
}
}, 800);
}

function stopTimer() {
clearInterval(intervalId);
}

document.addEventListener('keydown', (event) => {
// 按下k键，开启定时器
if (event.key === 'k') {
startTimer();
}
// 按下Esc键，关闭定时器
if (event.key === 'Escape') {
stopTimer();
}
});

function speak(text) {
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance(text);
synth.speak(utterance);
}