// ==UserScript==
// @name         微信开放平台第三方小程序自动删除模版库
// @namespace    http://tampermonkey.net/
// @version      2024-10-28
// @description  微信开放平台代开发小程序中小程序模版库中第三方小程序自动删除普通模版库
// @author       xiayukun
// @match        https://open.weixin.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514586/%E5%BE%AE%E4%BF%A1%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E7%AC%AC%E4%B8%89%E6%96%B9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%A8%A1%E7%89%88%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/514586/%E5%BE%AE%E4%BF%A1%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%E7%AC%AC%E4%B8%89%E6%96%B9%E5%B0%8F%E7%A8%8B%E5%BA%8F%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%A8%A1%E7%89%88%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let canStart = true
    function click_xiangqing(){
        canStart=false
        const tables = document.querySelectorAll('.weui-desktop-table')
        if(!tables||!tables[2]){
            alert('没找到表格')
            canStart = true
            return
        }
        const a = tables[2].querySelector('a')
        if(!a){
            alert('没找到按钮')
            canStart = true
            return
        }
        if(!a.innerHTML||a.innerHTML!=='详情'){
            alert('没找到详情按钮')
            canStart = true
            return
        }
        a.click()
        setTimeout(()=>{
            const h3 = [...document.querySelectorAll('.weui-desktop-dialog__wrp h3').values()].find(i=>i.innerHTML.includes('小程序模板详情'))
            if(!h3){
                alert('没找到弹窗标题')
                canStart = true
                return
            }
            const dialog = h3.parentNode.parentNode.parentNode
            if(!dialog){
                alert('没找到弹窗')
                canStart = true
                return
            }
            if(dialog.style.display==='none'){
                alert('弹窗还在隐藏中')
                setTimeout(click_xiangqing,5000)
                return
            }
            const btn = dialog.querySelector('.weui-desktop-btn.weui-desktop-btn_warn')
            if(!btn||btn.innerHTML!=='从模版库删除'){
                alert('没找到删除按钮')
                canStart = true
                return
            }
            btn.click()
            setTimeout(()=>{
                const h4 = [...document.querySelectorAll('.weui-desktop-dialog__wrp h4').values()].find(i=>i.innerHTML.includes('确定删除此代码？'))
                if(!h4){
                    alert('没找到弹窗标题')
                    canStart = true
                    return
                }
                const dialog2 = h4.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                if(!dialog2){
                    alert('没找到确认弹窗')
                    canStart = true
                    return
                }
                if(dialog2.style.display==='none'){
                    alert('确认弹窗还在隐藏中')
                    setTimeout(click_xiangqing,5000)
                    return
                }
                const btn2 = dialog2.querySelector('.weui-desktop-btn.weui-desktop-btn_primary')
                if(!btn2||btn2.innerHTML!=='确定'){
                    alert('没找到确认删除按钮')
                    canStart = true
                    return
                }
                btn2.click()
                setTimeout(click_xiangqing,3000)
            },1000)
        },1000)
    }
    setInterval(()=>{
        if(document.querySelector('.weui-desktop-panel__title button')){
            return
        }
        const title = [...document.querySelectorAll('.weui-desktop-panel__title').values()].find(i=>i.innerHTML.includes('小程序模板库'))
        if(!title){
            return
        }
        title.innerHTML='小程序模板库<button style="margin-left: 10px;color: red;border: 1px solid red;">删除普通模版库</button>'
        title.querySelector('button').onclick = ()=>{
            if(!canStart){
                return
            }
            click_xiangqing()
        }
    },1000)
    // Your code here...
})();