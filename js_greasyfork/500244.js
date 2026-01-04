// ==UserScript==
// @name         _ Modao-Add-Pin
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  墨刀菜单active定位居中!
// @author       You
// @match        https://modao.cc/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modao.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500244/_%20Modao-Add-Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/500244/_%20Modao-Add-Pin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function run(wrapper){
        wrapper.style.overflow = 'unset';
        document.querySelector('.rn-list-item.active').scrollIntoView({ behavior: "instant", block:'center', inline: "nearest" })
        wrapper.style.overflow = 'hidden';
    }
    function createDom(wrapper){
        // 创建一个新的 button 元素
        var button = document.createElement('button');

        // 设置按钮的文本内容为 "Pin"
        button.textContent = 'Pin';

        // 可以添加一些内联样式，例如：
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.backgroundColor = '#1684fc';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        //button.style.position = 'fixed';
        //button.style.left = '332px';
        //button.style.top = '230px';
        button.style.zIndex = '999';

        // 或者添加一个样式类
        button.className = 'pin-button';

        // 绑定一个事件
        button.addEventListener('click',function(){
            run(wrapper)
        })
        return button
    }
    var itv = setInterval(()=>{
        if(document.querySelector('#workspace').children.length>0){
            clearInterval(itv)
            const wrapper = document.querySelector('.preview-content-container')
            setTimeout(()=>{
                run(wrapper)

                const btnDom = createDom(wrapper)

                // 先copy个分割线，加进去
                const lineDom = document.querySelector('.wrapper-padding').cloneNode()
                document.querySelector('#preview-setting-list div.wrapper').appendChild(lineDom);
                // 将按钮添加到页面的 body 元素中
                document.querySelector('#preview-setting-list div.wrapper').appendChild(btnDom);
            },200)
        }
    },500)
})();