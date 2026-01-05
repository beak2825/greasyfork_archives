// ==UserScript==
// @name         网易漫画“猜你喜欢”侧边栏自动隐藏
// @namespace    https://greasyfork.org/zh-CN/scripts/28950-%E7%BD%91%E6%98%93%E6%BC%AB%E7%94%BB-%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2-%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F
// @version      0.3.1
// @description  按钮颜色变暗
// @author       MaiJZ
// @supportURL   http://github.com/maijz128
// @match        https://manhua.163.com/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28950/%E7%BD%91%E6%98%93%E6%BC%AB%E7%94%BB%E2%80%9C%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E2%80%9D%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/28950/%E7%BD%91%E6%98%93%E6%BC%AB%E7%94%BB%E2%80%9C%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E2%80%9D%E4%BE%A7%E8%BE%B9%E6%A0%8F%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var recommand = document.getElementById('J_BookRecommand');
    var panel_btns = document.getElementsByClassName('panel-btn');
    var btn = document.getElementById('J_RecommandTrigger');
    var mousePosition = { x: 0, y: 0 };
    document.body.onmousemove = function (e) {
        e = event || window.event;
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
    };


    function show() {
        recommand.style.left = '0px';
    }
    function hide() {
        recommand.style.left = '-132px';
        btn.style.padding = '0px';
        btn.style.color = '#333';
    }
    function isShow() {
        if (recommand) {
            if (recommand.style.left == '0px') {
                return true;
            }
        }
        return false;
    }
    function isMouseOnBar() {
        if (mousePosition.x < 132) {
            return true;
        }
        
        return false;
    }
    function autoHide() {
        setInterval(function () {
            if (isShow() && !isMouseOnBar()) {
                setTimeout(hide, 1000);
            }
        }, 1000);

    }

    var count = 0;
    var inter = setInterval(function () {
        recommand = document.getElementById('J_BookRecommand');
        panel_btns = document.getElementsByClassName('panel-btn');
        btn = document.getElementById('J_RecommandTrigger');


        if (panel_btns) {
            for (var i = 0; i < panel_btns.length; i++) {
                panel_btns[i].style.color = "#333";
                panel_btns[i].style.background = "transparent";
            }
        }

        if (btn) {
            btn.addEventListener('click', function () {
                console.log('click J_RecommandTrigger');
            });
            hide();
            autoHide();

            clearInterval(inter);
        }

        if (count > 100) {
            clearInterval(inter);
        } else {
            count++;
        }
    }, 50);

})();