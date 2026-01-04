// ==UserScript==
// @name         超星隐藏显示正确答案
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  通过单击键盘左上方的~/`/·键来隐藏/显示正确答案，用于期末复习
// @author       LeonYew-SWPU
// @match        https://mooc1.chaoxing.com/mooc-ans/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @projectURL   https://github.com/LeonYew-SWPU/HideShowChaoXingAnswer
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483510/%E8%B6%85%E6%98%9F%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483510/%E8%B6%85%E6%98%9F%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BA%E6%AD%A3%E7%A1%AE%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 引入iconfont
    var link = document.createElement('link');
    link.href = 'https://at.alicdn.com/t/c/font_4394726_ifn084x1vh.css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);    // 将link元素添加到head元素中、

    // 初始化，获取元素
    var answersWindow = document.getElementsByClassName('mark_answer'); // 获取答案框div
    var answersChoice = document.getElementsByClassName('mark_key clearfix'); // 获取答案选择题div
    var answerFill = {
        'colorDeep': document.getElementsByClassName('mark_fill colorDeep'), // 获取填空题我的答案
        'colorGreen': document.getElementsByClassName('mark_fill colorGreen') // 填空题正确答案
    }
    var answerStatuses = document.getElementsByClassName('mark_score'); // 获取答案状态div（对错+分数）
    var lightGrey = '#f9f9f9'; // 浅灰色
    var isHidden = false; // 答案隐藏指标

    // 遍历答案框div,添加遮罩层，初始化Status
    for (var i = 0; i < answersWindow.length; i++) {
        addCover(answersWindow[i]);
    }

    document.onkeydown = function (e) {
        if (e.key == '`') {
            flipAns();
        }
    }

    function flipAns(){
        // 改变答案隐藏指标
        isHidden = !isHidden;
        // 遍历答案div
        // 如果遍历窗口div的话，遇到简答题会找不到answers[i].style，也找不到answerStatuses[i].style
        for (var i = 0; i < answersWindow.length; i++) {
            // 每个answerWindow一定有的元素
            answersWindow[i].getElementsByClassName('cover')[0].style.display = (isHidden) ? 'block' : 'none'; // 显示遮罩层
            answersWindow[i].getElementsByClassName('icon-hide')[0].style.display = (isHidden) ? 'none' : 'inline'; // 隐藏眼睛图标
            answersWindow[i].getElementsByClassName('icon-eye')[0].style.display = (isHidden) ? 'inline' : 'none'; // 显示闭眼图标
            answersWindow[i].style.backgroundColor = (isHidden) ? lightGrey : ''; // 背景调灰
            answerStatuses[i].style.display = (isHidden) ? 'none' : 'block'; // 隐藏答案状态div

            // 每个answerWindow可能有的元素：选择题答案
            if (answersChoice[i]) {
                answersChoice[i].style.display = (isHidden) ? 'none' : 'block'; // 隐藏选择题答案
            }
            // 每个answerWindow可能有的元素：选择题答案、填空答案
            if (answerFill.colorDeep[i]) {
                answerFill.colorDeep[i].style.display = (isHidden) ? 'none' : 'block'; // 隐藏填空题我的答案
                answerFill.colorGreen[i].style.display = (isHidden) ? 'none' : 'block'; // 隐藏填空题正确答案
            }
            
        }
        // 后台提示
        console.log((isHidden) ? '答案已隐藏' : '答案已显示');
    }

    function addCover(answersWindow){
        // 修改answersWindow的布局方式为flex
        answersWindow.style.display = 'flex';
        answersWindow.style.flexDirection = 'row';

        // 添加遮罩层
        var cover = document.createElement('a');
        cover.className = 'cover';
        cover.href = '#'; // 做成超链接，表示可点击
        cover.style.textDecoration = 'underline'; // 添加下划线
        cover.style.display='none';
        cover.style.textAlign = 'left';
        cover.textContent = '答案已隐藏';
        cover.onclick = function(e){
            e.preventDefault(); // 阻止超链接的默认行为
            flipAns();
        }
        answersWindow.appendChild(cover);

        // 添加眼睛图标
        var eye = document.createElement('i');
        eye.className = 'iconfont icon-eye';
        eye.style.display = 'none'; // 最开始为隐藏状态
        eye.style.fontSize = '20px';
        eye.style.marginRight = '15px';
        eye.style.verticalAlign = 'middle';
        eye.style.fontStyle = 'normal';
        eye.onclick = function(e){
            flipAns();
        }
        answersWindow.prepend(eye);

        // 添加闭眼图标
        var eyeInvisible = document.createElement('i');
        eyeInvisible.className = 'iconfont icon-hide';
        eyeInvisible.style.fontSize = eye.style.fontSize;
        eyeInvisible.style.marginRight = eye.style.marginRight;
        eyeInvisible.style.verticalAlign = eye.style.verticalAlign;
        eyeInvisible.style.fontStyle = eye.style.fontStyle;
        eyeInvisible.onclick = eye.onclick;
        answersWindow.prepend(eyeInvisible);
    }
})();