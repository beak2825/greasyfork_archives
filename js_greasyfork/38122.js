// ==UserScript==
// @name         v2ex-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description v2ex小助手
// @author       ycz0926
// @match        https://www.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38122/v2ex-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38122/v2ex-helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /////////////////////////////////////////
    // 1、回到顶端按钮
    /////////////////////////////////////////
    document.body.innerHTML += '<a href="#" id="back-to-top">回到顶端</a>';
    var top_button = document.getElementById('back-to-top');

    //为按钮添加css样式
    top_button.style.position = 'fixed';
    top_button.style.bottom = '3em';
    top_button.style.right = '3em';
    top_button.style.textDecoration = 'none';
    top_button.style.color = '#EEEEEE';
    top_button.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    top_button.style.fontSize = '12px';
    top_button.style.padding = '1em';
    top_button.style.display = 'none';
    top_button.style.borderRadius = '3px';
    top_button.style.border = '1px solid #CCCCCC';

    // 滚动窗口来判断按钮显示或隐藏
    window.addEventListener('scroll', function () {
        if (window.scrollY > 1000) {
            document.getElementById('back-to-top').style.display = 'block';
        } else {
            document.getElementById('back-to-top').style.display = 'none';
        }
    });

    // 点击回到顶部
    document.getElementById('back-to-top').addEventListener('click', function (event) {
        event.preventDefault();

        window.scrollTo(0, 0);
        setTimeout(function () {
            document.getElementById('back-to-top').style.display = 'none';
        }, 100);
    });

    /////////////////////////////////////////
    // 2、新标签页打开帖子
    /////////////////////////////////////////
    document.body.addEventListener('mousedown', function (e) {
        var a = e.target;
        var parent = a.parentElement;
        if (parent.className !== 'item_title') return;
        a.target = '_blank';
    });

    /////////////////////////////////////////
    // 3、高亮作者回复
    /////////////////////////////////////////
    var author = document.getElementsByClassName('header')[0].children[0].children[0].getAttribute('href');
    var all_cell_div = document.getElementsByClassName('cell');

    for (var i in all_cell_div) {
        if (all_cell_div[i].id !== "") {
            try {
                var href = all_cell_div[i].children[0].children[0].children[0].children[2].children[2].children[0].getAttribute('href');
                var box = all_cell_div[i].children[0].children[0].children[0].children[2];
                if (author == href) {
                    box.style.backgroundColor = 'rgb(250, 255, 189)';
                }
            } catch (e) {
                //console.log(e);
                continue;
            }
        }
    }
})();