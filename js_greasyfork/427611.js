// ==UserScript==
// @name         填表助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将input加select选项
// @author       You
// @include      http://*/*
// @include      https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427611/%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/427611/%E5%A1%AB%E8%A1%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    "use strict";
    //在此填入要用的选项 格式a=['包子叔','www.wangxinyang.xyz','66666']
    let a=['包子叔','www.wangxinyang.xyz','66666']






    //下面一般用户不要操作!!!!!!-------------------------------------------------------------

    let str=''
    for (let i = 0; i < a.length; i++) {
        str+=`<option value="${a[i]}">${a[i]}</option>`
    }
    let inputs = document.getElementsByTagName("input");

    for (let i = 0; i < inputs.length; i++) {
        // console.log(inputs[i].type);
        if (
            inputs[i].type != "text" &&
            inputs[i].type != undefined &&
            inputs[i].type != null &&
            inputs[i].type != ""
        ) {
            continue;
        }

        let a = document.createElement("select");
        a.click=( function(event){
            console.log("button-click");
            // 阻止事件冒泡到DOM树上
            event.stopPropagation(); // 只执行button的click，如果注释掉该行，将执行button、p和div的click （同类型的事件）
        } );

        a.onchange = function () {
            console.log(this.value);
            this.previousSibling.value = this.value;
        };

        a.style = "visibility:hidden;width:100px;z-index:999;padding: 5px 12px;font-size: 14px;line-height: 20px;color: var(--color-text-primary);vertical-align: middle;background-color: var(--color-input-bg);background-repeat: no-repeat;background-position: right 8px center;border: 1px solid var(--color-input-border);border-radius: 6px;outline: none;box-shadow: var(--color-shadow-inset);";
        a.innerHTML = str;
        insertAfter(a, inputs[i]);
        inputs[i].onfocus=function(){
            this.nextSibling.style.visibility = 'visible';
        }
        a.onblur=function(){
            this.style.visibility = 'hidden'
        }
    }


    function insertAfter(newElement, targetElement) {
        //   console.log(targetElement);
        // newElement是要追加的元素 targetElement 是指定元素的位置
        let parent = targetElement.parentNode; // 找到指定元素的父节点
        //   console.log("pr", parent);

        if (parent.lastChild == targetElement) {
            // 判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
            parent.appendChild(newElement, targetElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    console.log('正在使用包子填表小助手,欢迎来我博客玩~ www.wangxinyang.xyz')

    // Your code here...
})();