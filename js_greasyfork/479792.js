// ==UserScript==
// @name         B站首页换一换(内测版网页可用),返回上一次刷新的内容
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  B站首页换一换，返回上一次刷新的内容
// @author       虚世梦人
// @match        https://www.bilibili.com
// @match        *://www.bilibili.com/**
// @match        *://search.bilibili.com/**
// @match        *://space.bilibili.com/**
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479792/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8D%A2%E4%B8%80%E6%8D%A2%28%E5%86%85%E6%B5%8B%E7%89%88%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%94%A8%29%2C%E8%BF%94%E5%9B%9E%E4%B8%8A%E4%B8%80%E6%AC%A1%E5%88%B7%E6%96%B0%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/479792/B%E7%AB%99%E9%A6%96%E9%A1%B5%E6%8D%A2%E4%B8%80%E6%8D%A2%28%E5%86%85%E6%B5%8B%E7%89%88%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%94%A8%29%2C%E8%BF%94%E5%9B%9E%E4%B8%8A%E4%B8%80%E6%AC%A1%E5%88%B7%E6%96%B0%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        console.log('换一换脚本已运行');

        // 添加按钮样式
        let last_style = document.createElement('style')
        last_style.innerHTML = `
            .feed-roll-btn .Change_Btn{
                margin-top: 10px;
            }
            .clone_dom_point{
                display:none;
            }
        `
        document.body.appendChild(last_style)

        // 往页面添加新的按钮
        let last_change_button_dom = document.getElementsByClassName('feed-roll-btn')[0];
        let last_change_button = document.createElement('button')
        last_change_button.className = 'prev_change_btn Change_Btn primary-btn roll-btn'
        last_change_button.innerHTML = '<span>切换上一次刷新</span>'
        last_change_button_dom.appendChild(last_change_button)
        let recover_button = document.createElement('button')
        recover_button.className = 'recover_btn Change_Btn primary-btn roll-btn'
        recover_button.innerHTML = `<span>恢复</span>`
        last_change_button_dom.appendChild(recover_button)

        // 获取到内容所在节点
        let container = document.querySelector('.feed2 .container')

        // 克隆节点用于展示存放数据
        let clone_dom_point = document.createElement('div')
        clone_dom_point.classList=container.classList
        clone_dom_point.classList.add("clone_dom_point")
        document.querySelector('.feed2 .recommended-container_floor-aside').appendChild(clone_dom_point)

        let clone_dom=document.querySelector('.feed2 .clone_dom_point')

        let is_prev = false

        let last_change_arr = []
        // 点击换一换
        document.getElementsByClassName('roll-btn')[0].addEventListener('mousedown', function () {
            if(is_prev){
                clone_dom.style.display="none"
                container.style.display="grid"
                is_prev=false
            }
            last_change_arr.push(container.innerHTML)
            if(last_change_arr.length >= 20){
                last_change_arr.unshift()
            }
        }, true)

        // 点击切换上一个
        document.getElementsByClassName('prev_change_btn')[0].addEventListener('click', function () {
            if(!is_prev){
                clone_dom.style.display="grid"
                container.style.display="none"
                is_prev=!is_prev
            }
            if (last_change_arr.length <= 0) {
                alert('没有更多上一个的刷新了')
            } else {
                clone_dom.innerHTML = last_change_arr[last_change_arr.length - 1]
                last_change_arr.pop()
            }
        })

        // 恢复
        document.querySelector(".recover_btn").addEventListener('click',function(){
            if(is_prev){
                clone_dom.style.display="none"
                container.style.display="grid"
                is_prev=false
            }
        })

        //隐藏右下角分区和内测窗口
        document.querySelector('.palette-button-outer .palette-button-inner .palette-button-wrap').style.display='none'
    }
})()