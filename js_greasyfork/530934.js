// ==UserScript==
// @name         H5视频调速器
// @namespace    https://viayoo.com/
// @version      0.1
// @description  示例脚本
// @homepageURL  https://app.viayoo.com/addons/62
// @author       MrNullNull
// @run-at       document-start
// @match        *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530934/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530934/H5%E8%A7%86%E9%A2%91%E8%B0%83%E9%80%9F%E5%99%A8.meta.js
// ==/UserScript==

/*H5视频调速器，作者：Mr.NullNull*/
(function () {
'use strict';

var IntPbr = 1;

const IntPbrMax = 16;
const IntPbrMin = 0.1;
const IntPbrStep = 0.25;

function Main() {
if (document.querySelector("myPbrMain")) return;

var myCss = document.createElement("style");
myCss.innerHTML = `
div#myPbrMain {
padding: 0;
margin: 0;
width: 1px;
position: fixed;
bottom: 28vw;
right: 5vw;
z-index: 2147483647;
}

div#myPbrMain>* {
float: right;
}

div#myPbrMain>div.myPbrBtns {
width: 1px;
margin-bottom: 2.2vw;
}

div.myPbrBtns {
opacity: 0;
}

div.myPbrBtn {
font: 4vw/1 '微软雅黑';
float: right;
height: 4vw;
padding: 2vw;
margin-bottom: 0.8vw;
border-radius: 20vw;
color: #eee;
background-color: rgba(0, 0, 0, 0.65);
}

div#myPbrMain>div.myPbrBtn {
width: auto;
}

div#myPbrMain * {
box-sizing: content-box;
word-break: normal;
}

div.show {
animation: shower 0.3s;
opacity: 1;
display: block;
}

div.hidden {
animation: hiddener 0.3s;
opacity: 0;
display: none;
}


@keyframes shower {
from {
opacity: 0;
}
to {
opacity: 1;
}
}

@keyframes hiddener {
from {
opacity: 1;
}
to {
opacity: 0;
}
}
`;
document.head.appendChild(myCss);

var mainDivTop = document.createElement("div");
mainDivTop.id = "myPbrMain";
mainDivTop.innerHTML = `
<div class="myPbrBtns hidden">
<div class="myPbrBtn" id="myPbrBtn_800">x8.00</div>
<div class="myPbrBtn" id="myPbrBtn_300">x3.00</div>
<div class="myPbrBtn" id="myPbrBtn_200">x2.00</div>
<div class="myPbrBtn" id="myPbrBtn_150">x1.50</div>
<div class="myPbrBtn" id="myPbrBtn_125">x1.25</div>
<div class="myPbrBtn" id="myPbrBtn_100">x1.00</div>
<div class="myPbrBtn" id="myPbrBtn_075">x0.75</div>
<div class="myPbrBtn" id="myPbrBtn_050">x0.50</div>
<div class="myPbrBtn" id="myPbrBtn_Add">+${IntPbrStep.toFixed(2)}</div>
<div class="myPbrBtn" id="myPbrBtn_Cut">-${IntPbrStep.toFixed(2)}</div>
</div>
<div class="myPbrBtn" id="myPbrBtn_Main">x1.XX</div>
`;
document.body.appendChild(mainDivTop);

var mainBtn = mainDivTop.querySelector("#myPbrBtn_Main");
var mainDiv = mainDivTop.querySelector(".myPbrBtns");


setMainBtnTxt();


mainBtn.onclick = function () {
if (mainDiv.className == "myPbrBtns hidden") {
setMainDivShow();
} else {
setMainDivNone();
}
};

mainDiv.querySelector("#myPbrBtn_800").onclick = function () {
IntPbr = 8;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_300").onclick = function () {
IntPbr = 3;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_200").onclick = function () {
IntPbr = 2.00;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_150").onclick = function () {
IntPbr = 1.50;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_125").onclick = function () {
IntPbr = 1.25;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_100").onclick = function () {
IntPbr = 1.00;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_075").onclick = function () {
IntPbr = 0.75;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};
mainDiv.querySelector("#myPbrBtn_050").onclick = function () {
IntPbr = 0.50;
setVideoPBR();
setMainBtnTxt();
setMainDivNone();
};

mainDiv.querySelector("#myPbrBtn_Add").onclick = function () {
IntPbr += IntPbrStep;
setVideoPBR();
setMainBtnTxt();
};
mainDiv.querySelector("#myPbrBtn_Cut").onclick = function () {
IntPbr -= IntPbrStep;
setVideoPBR();
setMainBtnTxt();
};


function setVideoPBR() {
if (IntPbr > IntPbrMax) {
IntPbr = IntPbrMax;
}
if (IntPbr < IntPbrMin) {
IntPbr = IntPbrMin;
}

var tmps = document.querySelectorAll("video");
for (let i = 0; i < tmps.length; i++) {
const element = tmps[i];
element.playbackRate = IntPbr;
}
console.log("PBR = " + IntPbr);
}

function setMainBtnTxt() {
mainBtn.innerHTML = "x" + IntPbr.toFixed(2);
}

function setMainDivShow() {
mainDiv.className = "myPbrBtns show";
}

function setMainDivNone() {
mainDiv.className = "myPbrBtns hidden";
}
};

function Padding(num, length) {
return (Array(length).join("0") + num).slice(-length);
}


var sli = setInterval(() => {
if (document.querySelector("video")) {
Main();
clearInterval(sli);
}
}, 1000);
setTimeout(() => {
clearInterval(sli);
}, 10000);
})();
