// ==UserScript==
// @name         B站首页换一换,返回上一次刷新的内容
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  B站首页换一换，返回上一次刷新的内容
// @author       You
// @include      https://www.bilibili.com
// @include        *://www.bilibili.com/**
// @include      *://search.bilibili.com/**
// @include      *://space.bilibili.com/**
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477011/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8D%A2%E4%B8%80%E6%8D%A2%2C%E8%BF%94%E5%9B%9E%E4%B8%8A%E4%B8%80%E6%AC%A1%E5%88%B7%E6%96%B0%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/477011/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8D%A2%E4%B8%80%E6%8D%A2%2C%E8%BF%94%E5%9B%9E%E4%B8%8A%E4%B8%80%E6%AC%A1%E5%88%B7%E6%96%B0%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        console.log('换一换脚本已运行');

        // 添加按钮样式
        let last_style = document.createElement('style')
        last_style.innerHTML = `
            .roll-btn-wrap .Last_Change_Btn{
                flex-direction: column;
                margin-top: 10px;
                margin-left: 0;
                height: auto;
                width: 40px;
                padding: 9px;
            }
            .gray{
        filter: none !important;
        -webkit-filter: none !important;
        -moz-filter: none !important;
        -ms-filter: none !important;
        -o-filter: none !important;
        filter: none !important;
        filter: none !important;
        -webkit-filter: none !important;
    }
        `
        document.body.appendChild(last_style)

        // 往页面添加新的按钮
        let last_change_button_dom = document.getElementsByClassName('roll-btn-wrap')[0];
        let last_change_button = document.createElement('button')
        last_change_button.className = 'last_change_btn primary-btn Last_Change_Btn'
        last_change_button.innerHTML = '<span>切换上一次刷新</span>'
        last_change_button_dom.appendChild(last_change_button)

        let recover_button = document.createElement('button')
        recover_button.className = 'recover_btn primary-btn Last_Change_Btn'
        recover_button.innerHTML = `<span>恢复</span>`
        last_change_button_dom.appendChild(recover_button)

        document.getElementsByClassName("recommend-container__2-line")[0].className='recommend-container__2-line parent_ele'

        // 复制一个新的节点
        let copy_parent_ele= document.createElement('div')
        copy_parent_ele.className='recommend-container__2-line copy_parent_ele'
        insertAfter(copy_parent_ele, document.getElementsByClassName("parent_ele")[0]);


        let is_last_change = null

        let last_change_arr = []
        document.getElementsByClassName('roll-btn')[0].addEventListener('mousedown', function () {
            if (is_last_change) {
                document.getElementsByClassName("copy_parent_ele")[0].innerHTML=''
                document.getElementsByClassName("parent_ele")[0].style.display='grid'
                is_last_change = false
            }
            last_change_arr.push(document.getElementsByClassName("parent_ele")[0].innerHTML)
        }, true)

        document.getElementsByClassName('last_change_btn')[0].addEventListener('click', function () {
            if (last_change_arr.length <= 0) {
                alert('没有更多上一个的刷新了')
            } else {
                if (!is_last_change) {
                    document.getElementsByClassName("parent_ele")[0].style.display='none'
                    // document.getElementsByClassName("copy_parent_ele")[0].style.display='block'
                    is_last_change = true
                }
                document.getElementsByClassName("copy_parent_ele")[0].innerHTML = last_change_arr[last_change_arr.length - 1]
                last_change_arr.pop()
            }
        })

        document.querySelector(".recover_btn").addEventListener('click',function(){
            document.getElementsByClassName("copy_parent_ele")[0].innerHTML=''
            document.getElementsByClassName("parent_ele")[0].style.display='grid'
        })


        // 在指定元素后面追加元素
        function insertAfter(newElement, targetElement) {
            var parent = targetElement.parentNode;
            if (parent.lastChild == targetElement) {
                parent.appendChild(newElement, targetElement);
            } else {
                parent.insertBefore(newElement, targetElement.nextSibling);
            };
        };

        //隐藏分区和内测右侧窗口
        document.querySelector('.palette-button-outer .palette-button-inner .palette-button-wrap').style.display='none'
    }
})()