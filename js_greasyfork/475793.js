// ==UserScript==
// @name        bilibili对于10倍速经常卡圈圈的一种解决方法 - bilibili.com
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/9/21 05:03:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475793/bilibili%E5%AF%B9%E4%BA%8E10%E5%80%8D%E9%80%9F%E7%BB%8F%E5%B8%B8%E5%8D%A1%E5%9C%88%E5%9C%88%E7%9A%84%E4%B8%80%E7%A7%8D%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%20-%20bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/475793/bilibili%E5%AF%B9%E4%BA%8E10%E5%80%8D%E9%80%9F%E7%BB%8F%E5%B8%B8%E5%8D%A1%E5%9C%88%E5%9C%88%E7%9A%84%E4%B8%80%E7%A7%8D%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%20-%20bilibilicom.meta.js
// ==/UserScript==
/**
 * Simulate a key event.
 * @param {Number} keyCode The keyCode of the key to simulate
 * @param {String} type (optional) The type of event : down, up or press. The default is down
 * @param {Object} modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 */
//https://gist.github.com/GlauberF/d8278ce3aa592389e6e3d4e758e6a0c2
//从github找的模拟键盘输出
function simulateKey (keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

// Setup some tests

var onKeyEvent = function (event) {
	var state = "pressed";

	if (event.type !== "keypress") {
		state = event.type.replace("key", "");
	}

	console.log("Key with keyCode " + event.keyCode + " is " + state);
};

document.addEventListener("keypress", onKeyEvent, false);
document.addEventListener("keydown", onKeyEvent, false);
document.addEventListener("keyup", onKeyEvent, false);
// Using the function
//simulateKey(38);
//simulateKey(38, "up");
//simulateKey(45, "press");
//键值
//https://developer.mozilla.org/zh-CN/docs/Web/API/UI_Events/Keyboard_event_key_values
var a=0;
const video=document.querySelector("video");
video.addEventListener("waiting", (event) => {
  ++a;
  console.log("Video is waiting for more data.");
   if (a==3){
  simulateKey(39);
  simulateKey(39, "up");
  a=0;
     a+2;
}
  console.log(a);


});

