// ==UserScript==
// @name         粉笔题库页面优化
// @namespace    http://tampermonkey.net/
// @version      2025.04.06
// @description  备考刷题，加油快冲上岸
// @author       Foolworld
// @include      http*://*fenbi.com/*
// @include      http*://spa.fenbi.com/*
// @include      http*://www.fenbi.com/spa/tiku/exam/practice/*
// @include      https://www.fenbi.com/spa/tiku/exam/practice/*
// @match        http*://*fenbi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenbi.com
// @license      Fool
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524663/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524663/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    document.addEventListener("keydown", function(event) {//键盘快捷键
        var e = event || window.event
        if(e.altKey && e.ctrlKey) {//Ctrl+z
            console.log('altKey+ctrlKey');
            document.getElementsByClassName("tool-item undo")[0].click()
        }
    });
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    setTimeout(function(){
        addGlobalStyle(`
    /*题库首页*/
    #fenbi-web-header {display: none}/*隐藏头部*/
    #fenbi-web-footer {display: none}/*隐藏底部*/
    /*答题卡*/
    .answer-card-content {opacity:0.5}/*透明化*/
    .answer-card-content:hover {opacity:1}/*鼠标悬浮不透明化*/
    .answer-card-tag {margin-left:40%}/*答题卡居中*/
    /*申论题目页面*/
    .material-body {z-index: auto}/*材料悬浮自动*/
    .textarea-container {z-index: 123}/*输入框悬浮*/
    .nav-container {z-index: 123}/*题号选择悬浮*/
    .fly:hover {opacity:1}
    .fly {z-index: 123;position: absolute;opacity:0.5;
            background: var(--color-bg-label-blue);
            border-radius: 30px;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-blue);
            line-height: 22px;
            margin: 8px 88px;}/*材料悬浮按钮*/
    /*选择题目页面*/
    /*.materials-container img {
    width: -webkit-fill-available;
    float: left;}材料图片位置优化*/
    .materials-container[_ngcontent-ng-c2490745666] .material-body[_ngcontent-ng-c2490745666] {z-index: auto}/*材料悬浮自动*/
    .input-radio {z-index: 123}/*选项悬浮*/
    .input-checkbox {z-index: 123}/*多选项悬浮*/
    .arrow-bg {z-index: 123;position: sticky;}/*v资料题目下拉悬浮*/
    .title.sticky[_ngcontent-ng-c1988064342] {z-index: 123}/*资料题目的标记、草稿、收藏悬浮*/
    .title[_ngcontent-ng-c1988064342] .title-right[_ngcontent-ng-c1988064342] .tool[_ngcontent-ng-c1988064342] {
    width: 40px;
    height: 40px;
    margin-left: 40px;
    z-index: 123;}/*标记、草稿、收藏图标放大悬浮优化*/
    .title[_ngcontent-ng-c1988064342] .title-right[_ngcontent-ng-c1988064342] .tool-icon[_ngcontent-ng-c1988064342] {
    width: 40px;
    height: 40px;}/*标记、草稿、收藏图标放大优化*/
    `);

        setTimeout(function(){
            if (document.getElementsByClassName("materials-container")){
                var flybar = document.getElementsByClassName("materials-container")
                for(var b = 0;b<flybar.length;b++){
                    var newItem=document.createElement("a")
                    var textnode=document.createTextNode("悬 浮")
                    newItem.appendChild(textnode)
                    flybar[b].insertBefore(newItem,flybar[b].childNodes[1]);
                    newItem.setAttribute("class", "fly");
                    newItem.setAttribute("id", "fly"+b);
                    dragElement(document.getElementById("fly"+b));
                    let n=b
                    document.getElementsByClassName("fly")[b].onmouseup = function () {
                        document.getElementsByClassName("materials-container")[n].style.zIndex="123";}
                    document.getElementsByClassName("materials-container")[b].onmouseleave = function () {
                        document.getElementsByClassName("materials-container")[n].style.zIndex="auto";}
                }//材料添加切换悬浮按键
                for(var k=0;k<document.getElementsByClassName("materials-container").length;k++){
                    let t=k;
                    document.getElementsByClassName("tabs-container")[k].onmouseover = function () {
                        document.getElementsByClassName("materials-container")[t].style.zIndex="123";}
                    document.getElementsByClassName("materials-container")[k].onmouseleave = function () {
                        document.getElementsByClassName("materials-container")[t].style.zIndex="auto";}
                }//材料鼠标悬停自动悬浮
            }
        }, 3000);//延时优化

        var num = document.getElementsByClassName("answer-btn")
        var ti = document.getElementsByClassName("ti")
        for(var i = 0;i<num.length;i++){//点击题号，自动打开草稿
            let t=i;
            document.getElementsByClassName("answer-btn")[i].onclick=function(){
                for(var e = 0;e<document.getElementsByClassName("tool-item exit").length;e++){
                    document.getElementsByClassName("tool-item exit")[e].click();
                }
                setTimeout(function(){document.getElementsByClassName("draft")[t].click();}, 500);
            }

        }
        document.getElementsByClassName("answer-card-tag")[0].onclick=function(){//点击答题卡打开所有题目的草稿
            if(document.getElementsByClassName("tool-item exit").length == 0){
                for(var i = 0;i<num.length;i++){
                    let I = i
                    setTimeout(function(){document.getElementsByClassName("draft")[I].click();}, i*250);
                }
            }
        }

        document.addEventListener("keydown", function(event) {//键盘快捷键
            var e = event || window.event

            if(e.keyCode == 90 && e.ctrlKey) {//Ctrl+z
                console.log('Ctrl+z');
                document.getElementsByClassName("tool-item undo")[0].click()
            }
            if(e.keyCode == 89 && e.ctrlKey) {//Ctrl+y
                console.log('Ctrl+y');
                document.getElementsByClassName("tool-item redo")[0].click()
            }
            if(e.keyCode == 81 && e.ctrlKey) {//Ctrl+q
                console.log('Ctrl+q');
                document.getElementsByClassName("tool-item empty")[0].click()
            }
            if(e.keyCode == 81 && e.shiftKey) {//Shift+q
                console.log('Shift+q');
                document.getElementsByClassName("tool-item exit")[0].click()
            }
        });
    }, 3500);//延时优化
    function dragElement(elmnt) {//鼠标拖移功能
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let X = elmnt.offsetLeft, Y = elmnt.offsetTop;
        if (document.getElementById(elmnt.id + "header")) {
            // 如果存在，标题是您从中移动 DIV 的位置:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // 否则，从 DIV 内的任何位置移动 DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();


            // 在启动时获取鼠标光标位置:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 每当光标移动时调用一个函数:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置:

            pos1 = e.clientX - pos3;
            pos2 = e.clientY - pos4;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置:
            elmnt.style.left = (elmnt.offsetLeft - X + pos1) + "px";
            elmnt.style.top = (elmnt.offsetTop - Y + pos2) + "px";
        }

        function closeDragElement() {
            // 释放鼠标按钮时停止移动:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    //setTimeout(function(){
    //}, 1500);
    // console.log('!!!!!!!');

})();