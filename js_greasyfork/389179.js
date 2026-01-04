// ==UserScript==
// @name         超星慕课 Tools
// @namespace    https://www.maxalex.tk
// @version      0.1
// @description  超星慕课的辅助播放工具，目前仅有不锁定
// @author       MaxAlex, aka zyf722
// @match        *://*/mycourse/studentstudy?*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389179/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/389179/%E8%B6%85%E6%98%9F%E6%85%95%E8%AF%BE%20Tools.meta.js
// ==/UserScript==

// Configuration Begin

var trytime = 1000; // 检测页面变化时间间隔（ms）
var waittime = 1500; // 等待页面加载完成的时间（ms）

// Configuration End

function getPlayer(){
    var doc = document;
    var player = doc.querySelector('object');
    while ((!player || player && !player.playMovie)){
        doc = doc.querySelector('iframe').contentDocument;
        player = doc.querySelector('object');
    }
    return player
}

setTimeout(
function (){

var doc = document;
var player = doc.querySelector('object');
var title = doc.getElementById("mainid").getElementsByTagName("h1")[0].innerHTML;
var oldtitle;
var id;

setInterval(function () {
    title = doc.getElementById("mainid").getElementsByTagName("h1")[0].innerHTML;
    if (title != oldtitle || player == null) {
        player = getPlayer();
        oldtitle = title;
    }
    player.playMovie()
},trytime);

},waittime)
