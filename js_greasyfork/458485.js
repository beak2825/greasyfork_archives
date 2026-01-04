// ==UserScript==
// @name         打印助手
// @namespace    http://tampermonkey.net/
// @namespace    https://greasyfork.org/zh-CN/scripts/458485
// @version      0.1.2
// @description  适用于知乎和CSDN打印工具
// @author       Snape-max
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domin=zhuanlan.zhihu.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458485/%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458485/%E6%89%93%E5%8D%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 知乎
    if (window.location.href.includes('zhuanlan.zhihu.com')) {
        var floatingButton = document.createElement('button');
        floatingButton.innerHTML = '保存为PDF';
        // 设置按钮样式
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '5px';
        floatingButton.style.left = '20px';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.padding = '10px';
        floatingButton.style.backgroundColor = '#3498db'; // 背景色
        floatingButton.style.color = '#fff'; // 文字颜色
        floatingButton.style.border = 'none'; // 去除边框
        floatingButton.style.borderRadius = '5px'; // 圆角
        document.body.appendChild(floatingButton);
        floatingButton.addEventListener('click', function() {
            var titlebar = document.querySelector('.ColumnPageHeader-Wrapper');
            var sidebar = document.querySelector('.Post-SideActions');
            var buttombar = document.querySelector('.Sticky.RichContent-actions.is-bottom');
            var loginber = document.querySelector('.css-woosw9');
            var topicbar = document.querySelector('.Post-Sub.Post-NormalSub');
            var connerbar = document.querySelector('.CornerButtons');
            if (titlebar){
                titlebar.remove();
            }
            if (sidebar){
                sidebar.remove();
            }
            if (buttombar){
                buttombar.remove();
            }
            if (loginber){
                loginber.remove();
            }
            if (topicbar){
                topicbar.remove();
            }
            if (connerbar){
                connerbar.remove();
            }
            window.print();
            window.addEventListener('afterprint', function () {
                location.reload();
            });
        });

    }

    // csdn
    if (window.location.href.includes('blog.csdn.net')) {
        var floatingButton = document.createElement('button');
        floatingButton.innerHTML = '保存为PDF';
        // 设置按钮样式
        floatingButton.style.position = 'fixed';
        floatingButton.style.top = '5px';
        floatingButton.style.left = '20px';
        floatingButton.style.zIndex = '9999';
        floatingButton.style.padding = '10px';
        floatingButton.style.backgroundColor = '#fc5531'; // 背景色
        floatingButton.style.color = '#fff'; // 文字颜色
        floatingButton.style.border = 'none'; // 去除边框
        floatingButton.style.borderRadius = '5px'; // 圆角
        document.body.appendChild(floatingButton);
        floatingButton.addEventListener('click', function() {
            var selectedElement = document.getElementsByClassName('blog-content-box'); // 替换为实际元素的ID

            var allElements = document.body.getElementsByTagName('*');
            for (var j = 0; j < allElements.length; j++) {
                if (!selectedElement[0].contains(allElements[j])) {
                    allElements[j].style.display = 'none';
                }
            }



            for (var i = 0; i < selectedElement.length; i++) {
                selectedElement[i].style.display = "block";

                var currenteleme  = selectedElement[i];
                while (currenteleme != null) {
                    currenteleme.style.display='block';
                    currenteleme = currenteleme.parentElement;
                }
            }

            window.print();
            window.addEventListener('afterprint', function () {
                location.reload();
            });
        });

    }

})();


