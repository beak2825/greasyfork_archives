// ==UserScript==
// @name         quizii组卷查重工具——取消收藏
// @namespace    http://jz.quizii.com/
// @version      0.1.1
// @description  批量取消收藏的习题
// @author       JinJunwei
// @match        http://jz.quizii.com/*/exams/new/shougong_paper?action=collect
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389568/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E5%8F%96%E6%B6%88%E6%94%B6%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389568/quizii%E7%BB%84%E5%8D%B7%E6%9F%A5%E9%87%8D%E5%B7%A5%E5%85%B7%E2%80%94%E2%80%94%E5%8F%96%E6%B6%88%E6%94%B6%E8%97%8F.meta.js
// ==/UserScript==


let referenceElement = document.querySelector('div#feedback_btn');
referenceElement=createFloatContainer(referenceElement);

referenceElement.appendChild(createFloatMenu());

setCss()

// 容器
function createFloatContainer(referenceElement){
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInjectContainer" ></div>';
    newElement = newElement.firstChild
    // 定位
    setPosition(referenceElement, newElement);
    // 插入元素
    referenceElement.parentElement.insertBefore(newElement, referenceElement.nextElementSibling);
    return newElement;
}

// 取消收藏
function createFloatMenu(referenceElement){
    let newElement = document.createElement('div');
    newElement.innerHTML = '<div class="myInject" title="油猴脚本，取消收藏" >取消收藏</div>';
    newElement = newElement.firstChild
    // 功能脚本
    newElement.onclick = function(){
        if(confirm("是否全部取消收藏")){
            // 全部取消收藏
            document.querySelectorAll("div.cancel_collect").forEach(el=>el.click());
            setTimeout(()=>location.reload(), 200); // 刷新页面
        }
    };
    return newElement;
}

function setCss(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `.myInjectContainer{
position: fixed;
top: 150px;
right: -1px;
width: 43px;
}
.myInject{
width: 24px;
padding:9px;
border:1px solid #ccc;
border-top-left-radius: 4px;
border-bottom-left-radius: 4px;
background-color: #fff;
line-height: 16px;
font-size: 12px;
color: #666;
cursor: pointer;
z-index: 9999;
}
.myInject:hover{
border-color: #1bbc9b;
background-position: center -48px;
background-color: #1bbc9b;
color: #fff;
}`;
    document.getElementsByTagName('head')[0].appendChild(style);
}

function setPosition(referenceElement, newElement){
    newElement.style.top = referenceElement.offsetTop+ referenceElement.offsetHeight+"px";
}