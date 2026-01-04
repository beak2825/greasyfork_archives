// ==UserScript==
// @name         心魔听书网去黄广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除网站不良信息，跳链，增加自动播放，自动下一首等功能
// @author       tang1jun
// @include      http://m.ixinmo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416899/%E5%BF%83%E9%AD%94%E5%90%AC%E4%B9%A6%E7%BD%91%E5%8E%BB%E9%BB%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/416899/%E5%BF%83%E9%AD%94%E5%90%AC%E4%B9%A6%E7%BD%91%E5%8E%BB%E9%BB%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
// alert("测试一下");
console.info("lyj", " 去广告！！！");
var judge = document.getElementsByTagName("h1");
// console.info("h1 info ", judge[1]);
if (judge[0].style.display == "") {
    for (var i = 0; i < judge.length; i++) {
        judge[i].style.display = "none";
        judge[i].remove(judge[i]);
    }
}
judge = document.getElementsByTagName("h1");
// console.info("h1 info111 ", judge);

judge[0].remove(judge[0]);
var thisNode = document.getElementById("undefined");
//console.info(thisNode.parentNode);

thisNode.parentNode.remove(thisNode.parentNode);
judge = document.getElementsByTagName("body");
document.getElementsByTagName("body")[0].style.padding = "1px 0 0 0";
var t = setTimeout(function() {
    console.info("测试settimeout");
},
1500);
console.log("settimeout id ", t);
for (var n = 1; n <= t; n++) {
    clearTimeout(n);
}
var t1 = setInterval(function() {
    console.info("setInterval 监控 停止");
},
100);

//console.log(t1);
for (var m = 1; m <= t1; m++) {
    clearInterval(m);
}
op.remove(op);
function sleep(time) {
    var timeStamp = new Date().getTime();
    var endTime = timeStamp + time;
    while (true) {
        if (new Date().getTime() > endTime) {
            return
        }
    }
}
var audioPlayer = document.querySelector("audio");
sleep(1000);
if (audioPlayer.paused) {
    console.info("暂停中...");
    audioPlayer.play()
} else {
    console.info("播放中...")
}
console.log(audioPlayer);
var at = document.getElementsByTagName("a");
console.info(at);
audioPlayer.addEventListener("ended",
function() {
    console.info("lyj", "音频播放结束了！！！！！！！！！");
    at[14].click()
},
false);