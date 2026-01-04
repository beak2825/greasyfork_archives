// ==UserScript==
// @name         油猴4-IMMS添加直达按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  IMMS添加直达按钮
// @author       You
// @match        http://192.168.100.113/pcis/a/index*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503515/%E6%B2%B9%E7%8C%B44-IMMS%E6%B7%BB%E5%8A%A0%E7%9B%B4%E8%BE%BE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/503515/%E6%B2%B9%E7%8C%B44-IMMS%E6%B7%BB%E5%8A%A0%E7%9B%B4%E8%BE%BE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function 按钮() {
    'use strict';
    console.log('加载脚本中');
    const button1 = document.createElement("button");
    let yy = document.querySelector("#tabpanel > div > div.tabpanel_tab_content > div.tabpanel_move_content > ul") // 找到父元素

    yy.style.position = "relative"; // 添加相对定位，使下边的top和left可用
    yy.style.display = "inline-flex"; // 设置父元素为inline-flex布局，保持居中对齐并允许按钮随子元素的增减而自动调整位置
    yy.style.alignItems = "center"; //垂直居中对齐子元素。alignItems决定多行Flex项目在交叉轴上的对齐方式。

    const childStyles = window.getComputedStyle(yy.firstElementChild); //获取第一个子元素的样式
    button1.style.lineHeight = childStyles.lineHeight;//行距
    button1.style.fontFamily = childStyles.fontFamily
    //button1.style.flex = childStyles.flex //设置按钮分布
    button1.style.marginLeft = childStyles.marginLeft // 按钮间左间距
    button1.textContent = "检验";
    button1.style.fontSize = "12px";
    button1.style.border = "none"; // 设置边框样式为none
    button1.style.backgroundColor = "transparent"; // 设置背景色为透明
    button1.className="jianyan"

    const button2 = button1.cloneNode(true);

    yy.insertBefore(button1, yy.firstChild); // 将按钮插入到yy的子元素列表的开头位置
    yy.insertBefore(button2, yy.firstChild); // 将按钮插入到yy的子元素列表的开头位置
    yy.children[2].style.display='none'//去掉页面原本一个不常用按钮
    if (yy.children.length>3){
        yy.children[3].style.display='none'
    }//去掉页面原本一个不常用按钮
    button2.textContent = "文件";
    button2.className="wenjian"
    //绑定按键点击功能
    button1.onclick = function () {
        let xx = document.querySelector("#leftMenu > ul > li:nth-child(4)") // 绑定实验室管理
        xx.children[1].children[1].children[1].children[0].children[0].click() //点击手动检验订单
    };

    //绑定按键点击功能
    button2.onclick = function () {
        let xx = document.querySelector("#leftMenu > ul > li:nth-child(5)") // 绑定文件管理
        xx.children[1].children[8].children[1].children[0].children[0].click() //点击标准文件查看
    };

    button1.classList.add("effect4");
    button2.classList.add("effect4");

    const style = document.createElement('style');
    style.textContent = `
                @keyframes amSiza {
            0% {
                background-position: 0 0;
            }
            100% {
                background-position: 1000% 0;
            }
        }

        .effect4 {
            z-index: 1;
            color: white;
            position: relative; /* 添加相对定位 */ 使下边的top和left可用
        }

        .effect4::before {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px; /* 调整top值 */
            left:0px; /* 调整left值 */
            transition: all .35s;
            z-index: -1;
            background: linear-gradient(45deg, red, orange, yellow, green, cyan, blue, purple, red);
            background-size: 1000%;
            animation: amSiza 80s linear infinite;
            border-radius: 10px; /*圆角*/
            line-height: 60px !important; /* 调整行高以向上移动文字 */
        }
        `;
    document.head.appendChild(style);
})();