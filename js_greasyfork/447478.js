// ==UserScript==
// @name         雨课堂显示PPT-去掉"当前页面有动画"提示
// @namespace    https://github.com/hui-shao
// @homepage     https://greasyfork.org/zh-CN/scripts/447478
// @homepageURL  https://greasyfork.org/zh-CN/scripts/447478
// @license      GPLv3
// @version      0.3
// @description  自动移除"当前页面有动画，请听老师讲解"的遮罩（在雨课堂上课界面右上角也添加了按钮，也可手动点击）
// @author       hui-shao
// @match        https://*.yuketang.cn/lesson/fullscreen/v*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447478/%E9%9B%A8%E8%AF%BE%E5%A0%82%E6%98%BE%E7%A4%BAPPT-%E5%8E%BB%E6%8E%89%22%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%9C%89%E5%8A%A8%E7%94%BB%22%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447478/%E9%9B%A8%E8%AF%BE%E5%A0%82%E6%98%BE%E7%A4%BAPPT-%E5%8E%BB%E6%8E%89%22%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%9C%89%E5%8A%A8%E7%94%BB%22%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function createButton() {
        //alert("btn");
        var button = document.createElement("button");
        button.id = "btn001";
        button.textContent = "移除";
        button.style.color = "black";
        button.style.width = "100px";
        button.style.height = "80%";
        button.style.align = "center";
        button.style.marginTop = "0.2%";
        button.style.marginRight = "1.5%";
        document.querySelector(".lesson__header").appendChild(button);
        button.onclick = function () {
            console.log("[Script] Pressed the button.");
            myRemove();
        };
    }

    function myRemove() {
        console.log("[Script] Tried to remove.");
        document.querySelector(".slide__cmp").style.display="";
        document.querySelector(".ppt__modal.box-center").style.display="none";
    }

    document.onreadystatechange = ()=>{
        if(document.readyState == "complete") {
            console.log("[Script] Tried to Create Btn");
            createButton();

            const targetNode = document.querySelector(".slide__wrap.box-center");
            const config = { attributes: true, childList: true, subtree: true };
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        console.log('[Script] A child node has been added or removed.');
                    }
                    else if (mutation.type === 'attributes') {
                        console.log('[Script] The ' + mutation.attributeName + ' attribute was modified.');
                    }
                }
                myRemove(); // Auto Remove when DOM changes
            };

            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }
    };

})();