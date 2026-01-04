// ==UserScript==
// @name         今日热榜简化,知乎去广告,Quora去图片
// @namespace    https://greasyfork.org/zh-CN/script_versions/new
// @version      2024-10-24-1
// @description  热榜简化,知乎去广告,Quora去图片
// @author       James
// @license      MIT
// @match        https://tophub.today/**
// @match        https://www.zhihu.com/**
// @match        https://www.quora.com/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513773/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E7%AE%80%E5%8C%96%2C%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%2CQuora%E5%8E%BB%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/513773/%E4%BB%8A%E6%97%A5%E7%83%AD%E6%A6%9C%E7%AE%80%E5%8C%96%2C%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A%2CQuora%E5%8E%BB%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {


    var idsToRemove = ["node-1", "node-5", "node-3", "node-35059", "node-42","tabbar","appbar"];
idsToRemove.forEach(function(id) {
    var element = document.getElementById(id);
    if (element) {
        element.remove();
    }
});


var elements = document.querySelectorAll(".eb-fb");
elements.forEach(function(element) {
    element.remove();
});

    var abcdefgs = document.querySelectorAll(".abcdefg");
abcdefgs.forEach(function(element) {
    element.remove();
});
var elements2 = document.querySelectorAll(".alert.alert-warning");
elements2.forEach(function(element) {
    element.remove();
});
    var elements3 = document.querySelectorAll(".cq");
elements3.forEach(function(element) {
    element.remove();
});

    var elements4 = document.querySelectorAll(".c-d");
elements4.forEach(function(element) {
    element.style.paddingTop = "0";
});

var elements5 = document.querySelectorAll(".bc-cc");
elements5.forEach(function(element, index) {
    if (index !== 1&& index !== 4 ) {  // 保留第二个元素，索引为1
        element.remove();
    }
});


    var elements6 = document.querySelectorAll(".bc-tc");
elements6.forEach(function(element, index) {
   element.remove();
});
var elements7 = document.querySelectorAll("#Sortable");
elements7.forEach(function(element) {
    element.style.display = "inline";
});

var elements8 = document.querySelectorAll(".cc-cd");
elements8.forEach(function(element) {
    element.style.width = "30%";
});

    var elements9 = document.querySelectorAll(".cc-cd-cb.nano.has-scrollbar");
elements9.forEach(function(element) {
     element.style.height = "770px";
});
//知乎
var elements10 = document.querySelectorAll(".Question-sideColumn.Question-sideColumn--sticky.css-1qyytj7");
elements10.forEach(function(element) {
    element.remove();
});
//quora



    function clearClass(){
        var parentElements = document.querySelectorAll(".q-inlineBlock.qu-overflow--hidden");

parentElements.forEach(function(parent) {
    var childBox = parent.querySelector(".q-box");
    if (childBox) {
        childBox.style.backgroundImage = "none"; // 去掉背景图
        childBox.style.backgroundColor= 'white';
    }
});
var images = document.querySelectorAll("img.q-image.qu-display--block");
images.forEach(function(img) {
    img.remove(); // 删除每个符合条件的图片
});

        var images2 = document.querySelectorAll("img");
    images2.forEach(function(img) {
        img.remove(); // 删除每个图像元素
    });

      var divs = document.querySelectorAll("div");
divs.forEach(function(div) {
    // 检查背景图像是否存在
    if (getComputedStyle(div).backgroundImage !== 'none') {
        div.remove(); // 删除有背景图像的 <div>
        div.style.backgroundColor = 'white'; // 将背景设为白色
    }
});

    }

        let timeout;

    function timeoutRun(){
        clearTimeout(timeout);
        timeout=setTimeout(clearClass(),1000);
        console.log(1)
    }
     timeoutRun();

    // 监控鼠标滑动
//document.addEventListener("mousemove", timeoutRun);

// 监控鼠标点击
//document.addEventListener("click", timeoutRun);

// 监控鼠标滚轮滑动
document.addEventListener("wheel", timeoutRun);




})();