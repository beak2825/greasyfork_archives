// ==UserScript==
// @name          武汉理工大学教务系统一键评教
// @namespace     aoaoao,个人博客不敢放上来
// @version       1.0.5
// @description  自己写的第一个脚本，自己比较懒，所以就直接写了一个简简单单程序的脚本，单纯是为了方便大家，打开武汉理工大学教务系统的评教，随便打开一个老师的评价页面，右上角会有一个一键评教页面，点击后会自动选所有非常好，然后提交退出，然后你就直接点下一个即可。
// @author       liushen
// @include      *://218.197.101.69:8080/edu/task/evaluate/*
// @include      *://218.197.101.69:8080/edu/task/evaluate/*
// @downloadURL https://update.greasyfork.org/scripts/464244/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/464244/%E6%AD%A6%E6%B1%89%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "一键评教"; //按钮内容
    button.style.width = "90px"; //按钮宽度
    button.style.height = "30px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#66CDAA"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener('click', () => {
        setTimeout(() => {
            // Find all instances of "非常好"
            const elements = document.querySelectorAll('span');

            // Click each element that contains "非常好"
            elements.forEach((element) => {
                if (element.innerText === 'A、非常好') {
                    element.click();
                    console.log(element)
                }
            });
            //console.log(document.getElementsByClassName('demo-btn big green edit-btn'))
            //document.getElementsByClassName('demo-btn big green edit-btn')[0].click();
            //console.log(document.querySelector('.btns-r').children[1])
            //document.querySelector('.btns-r').children[1].click();

            save('1');//这个是提交的函数，可以直接调用到
            setTimeout(() => {
                //console.log(document.querySelector('.btns-r').children[0])
                //document.querySelector('.btns-r').children[0].click();
                //document.getElementsByClassName('demo-btn big-line grayline')[0].click();

                closeTab();//这个是关闭页面的函数，也可以直接调用到
            },100) //等待0.5秒后再退出
        }, 100); // 等待 0.1 秒钟再执行评教操作
        //setTimeout(() => {
        //    window.location.reload(); // 刷新页面显示最新的内容，但是退出页面后，似乎就刷新不了了，所以功能没有实现
        //},500);
    });

    var bar = document.getElementsByClassName('btns-r')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
    bar.appendChild(button); //把按钮加入到 x 的子节点中

})(); //(function(){})() 表示该函数立即执行

//<a href="javascript:void(0);" class="demo-btn big green edit-btn" onclick="save('1')">提交</a>
//<a href="javascript:void(0)" onclick="closeTab()" class="demo-btn big-line grayline">关闭</a>
