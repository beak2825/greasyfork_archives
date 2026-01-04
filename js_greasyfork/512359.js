// ==UserScript==
// @name         🔥「CSDN_Editor」编辑优化插件 | 一键美化
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  🔥「持续更新」，【美化博客】自动替换文章中`英文单词`为标红样式 | 替换`字母`与`数字`为行内公式样式 | `图片`居中并指定大小 | 防止对链接的误操作。
// @author       清流君
// @match        https://editor.csdn.net/md/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512359/%F0%9F%94%A5%E3%80%8CCSDN_Editor%E3%80%8D%E7%BC%96%E8%BE%91%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6%20%7C%20%E4%B8%80%E9%94%AE%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512359/%F0%9F%94%A5%E3%80%8CCSDN_Editor%E3%80%8D%E7%BC%96%E8%BE%91%E4%BC%98%E5%8C%96%E6%8F%92%E4%BB%B6%20%7C%20%E4%B8%80%E9%94%AE%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function findButtonNode(pointNode) {
        if(pointNode.nodeName=='BODY'){
            return ;
        }else if(pointNode.nodeName == 'BUTTON'){
            return pointNode;
        }
        return findButtonNode(pointNode.parentNode);
    }

    function makeEditableAndHighlight() {//文字标红
        const text = window.getSelection().toString();
        const colour = document.querySelector(".color-input-y").value;
        document.execCommand("insertText", "false", `<font color=${colour}>${text}</font>`);
    }

    function replacePictureWithCenter() {
        let editor = document.querySelector(".editor");
        let sections = editor.querySelectorAll(".cledit-section");
        sections.forEach(section => {
            // 匹配任何图片格式，但不包括后面紧跟着#pic_center的情况，并替换为相应的格式加上#pic_center =400x
            // 使用负向前瞻 (?!#pic_center) 来确保不匹配那些后面紧跟 #pic_center 的扩展名
            section.innerHTML = section.innerHTML.replace(
                /(\.png|\.jpg|\.jpeg|\.bmp)(?!#pic_center)/g,
                '$1#pic_center =400x'
            );
        });
    }

    function addButton(){//增加按钮
        let buttonList = document.querySelector(".article-bar__user-box");
        if (buttonList) {
            //向页面加入一键美化按钮
            let b = document.createElement("span");
            b.innerHTML =`<input type="color" class="color-input-y" value="#ff0000" />`
      buttonList.appendChild(b);
            b = document.createElement("span");
            b.innerHTML =`<button class="color-btn-y" style="padding: 0 16px;font-size: 16px;height:36px;color: #fff;border: none;border-radius: 18px;white-space: nowrap;background: #fc5531;">颜色替换</button>`
      buttonList.appendChild(b);
            b = document.createElement("span");
            b.innerHTML =`<button class="replace-btn-y" style="padding: 0 16px;font-size: 16px;height:36px;color: #fff;border: none;border-radius: 18px;white-space: nowrap;background: #fc5531;">一键美化</button>`;
            buttonList.appendChild(b);
            addEvent();
        }else {
            console.log("没有找到dom里的按钮栏")
        }
    }
    function addEvent(){//绑定事件
        let replaceBtn = document.querySelector(".replace-btn-y");
        let colorBtn = document.querySelector(".color-btn-y");
        //给按钮绑定替换事件
        colorBtn.addEventListener('click', (event)=> {
            makeEditableAndHighlight();

        })
        //给按钮绑定替换事件
        replaceBtn.addEventListener('click', function (event) {
            let editor = document.querySelector(".editor");
            let sections = editor.querySelectorAll(".cledit-section");

            let p = editor.querySelectorAll(".cledit-section>.token.p");


            for (const iterator of p) {
                // 检查当前段落是否包含链接
                if (iterator.innerHTML.includes("http://") || iterator.innerHTML.includes("https://")) {
                    continue; // 如果包含链接，则跳过当前段落
                }

                iterator.innerHTML = iterator.innerHTML.replace(
                    /\b[A-Za-z]+(?:_[A-Za-z]+)*\b|\d+(\.\d+)?(\s*[A-Za-z]+)?/g,
                    function rep(match) {
                        // 检查是否是数字，包括带小数点的数字
                        if (/\d+(\.\d+)?/.test(match)) {
                            return ' $' + match.trim() + '$ '; // 数字替换格式
                        }
                        // 检查是否是单个字母
                        else if (/[A-Za-z]/.test(match) && match.length === 1) {
                            return ' $' + match + '$ '; // 单个字母替换格式
                        }
                        // 其他情况，认为是英文单词
                        else {
                            return ' `' + match + '` '; // 英文单词替换格式
                        }
                    }
                );
            }

            let p2 = editor.querySelectorAll(".blockquote>.token.p");
            for (const iterator of p2) {
                iterator.innerHTML = iterator.innerHTML.replace(
                    /([A-Za-z0-9_$]*[A-Za-z0-9\s=_$\+\-\*/=@&!@#$%^&||*/(/):.\'\"]+)/g,
                    function rep(str) {
                        //只有一个下列符号不替换
                        if (['-', '+','=', '/', '(',')',''].includes(str.trim())) {
                            return str;
                        }
                        return ' `' + `${str}` + '` ';
                    });
            }
            // 替换.png为.png#pic_center =400x
            replacePictureWithCenter();
        })
    }
    function printSth(){
        console.log(`我是清流君，
        本脚本功能:
        1、一键美化markdown中英文数字，其中数字包含整数、小数、带单位的数字，英文包括单个字母、无下划线单词、有下划线单词
        2、文字替换为任意颜色
        3、自动点击
        4、图片居中并指定大小`);
    }
    //加入自动点击按钮
    function addAuto() {
        let drag = document.createElement('div');
        drag.innerText = '自动';
        drag.classList.add('drag-y');
        document.body.appendChild(drag);
        drag.addEventListener('mousedown', (e) => {
            //鼠标按下，计算鼠标触点距离元素左侧和顶部的距离
            let disX = e.clientX - drag.offsetLeft;
            let disY = e.clientY - drag.offsetTop;
            document.onselectstart =function(){
                return false;
            }
            document.onmousemove = function (e) {
                //计算需要移动的距离
                let tX = e.clientX - disX;
                let tY = e.clientY - disY;
                //移动当前元素
                if (tX >= 0 && tX <= window.innerWidth - drag.offsetWidth) {
                    drag.style.left = tX + 'px';
                }
                if (tY >= 0 && tY <= window.innerHeight - drag.offsetHeight) {
                    drag.style.top = tY + 'px';
                }
            };
            //鼠标松开时，注销鼠标事件，停止元素拖拽。
            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
                document.onselectstart =null;
                drag.style.visibility = 'hidden'
                let pointNode = document.elementFromPoint(drag.offsetLeft, drag.offsetTop);
                drag.style.visibility = 'visible'
                //判断覆盖的是否是一个button

                if (pointNode) {
                    pointNode = findButtonNode(pointNode);
                    if(pointNode){
                        document.onmouseup=function addEvent(event) {
                            setTimeout(() => {
                                pointNode.click();
                            }, 100);
                        };
                    }else{
                        console.log('移除绑定按钮或者没有找到按钮');
                        document.onmouseup=null;

                    }
                }
            };
        })
    }
    // 加入class
    function addAutoClass() {
        const style = document.createElement('style');
        style.innerHTML = `
    .drag-y {
    position: fixed;
    top: 50px;
    left: 100px;
    z-index: 999;
    color: white;
    background: black;
    font-size: 12px;
    height: 24px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: -3px 0px 6px 0px #a9a9a980, 3px 0px 6px 0px #a9a9a980;
    border-radius: 4px;
    cursor: pointer;
  }`
    document.head.appendChild(style);
    }


    setTimeout(() => {
        printSth();//打印something
        addButton();//添加按钮绑定事件
        addAutoClass();//添加class
        addAuto();//添加自动点击按钮
    }, 2000);
})();