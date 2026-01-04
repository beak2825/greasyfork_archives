// ==UserScript==
// @name         CSDN 一键替换
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  CSDN 能有一个自动替换文章中`英文单词`与`数字`为红的标识的功能，用于美化博客，感谢Nyaasu66的支持实现了文字标色，实现自动点击按钮
// @author       QQ858715831
// @match        https://editor.csdn.net/md/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/449290/CSDN%20%E4%B8%80%E9%94%AE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/449290/CSDN%20%E4%B8%80%E9%94%AE%E6%9B%BF%E6%8D%A2.meta.js
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

    function addButton(){//增加按钮
        let buttonList = document.querySelector(".article-bar__user-box");
        if (buttonList) {
            //向页面加入一键替换按钮
            let b = document.createElement("span");
            b.innerHTML =`<input type="color" class="color-input-y" value="#ff0000" />`
      buttonList.appendChild(b);
            b = document.createElement("span");
            b.innerHTML =`<button class="color-btn-y" style="padding: 0 16px;font-size: 16px;height:36px;color: #fff;border: none;border-radius: 18px;white-space: nowrap;background: #fc5531;">颜色替换</button>`
      buttonList.appendChild(b);
            b = document.createElement("span");
            b.innerHTML =`<button class="replace-btn-y" style="padding: 0 16px;font-size: 16px;height:36px;color: #fff;border: none;border-radius: 18px;white-space: nowrap;background: #fc5531;">一键替换</button>`;
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
            let p = editor.querySelectorAll(".cledit-section>.token.p");
            for (const iterator of p) {
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
        })
    }
    function printSth(){
        console.log(`我是卷心菜，
        这个脚本的功能:
        1、一键替换markdown中英文数字
        2、提供文字标红动能
        3、自动点击`);
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