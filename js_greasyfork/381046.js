// ==UserScript==
// @name         Beautiful Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  美化你的知乎
// @author       Boseny
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381046/Beautiful%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/381046/Beautiful%20Zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log('hhhhh')
    // Your code here...
    // 设置主题颜色
    function SetTheme(color) {
        let themecolor = color || '#fff'
        try {
            document.querySelector(".AppHeader").style.backgroundColor = themecolor
            document.querySelector(".Card").style.backgroundColor = themecolor
            clearAll(".TopstoryItem",themecolor)
            clearAll(".ContentItem-actions",themecolor)
            clearAll(".Card", themecolor)
        } catch (error) {
            // console.log(error)
        }
    }
    //修改所有该选择器样式
    function clearAll (querySelector, color) {
        let list = document.querySelectorAll(querySelector)
        for(let item of list) {
            item.style.backgroundColor = color || "#fff"
        }
    }
    //创建一个菜单
    function CreateLayout () {
        let root = document.getElementById("root")
        let fragment = document.createDocumentFragment()
        let Container = CreateWarp()
        let ColorInput = CreateInput()
        let Btn = CreateButton()

        fragment.appendChild(ColorInput)
        fragment.appendChild(Btn)
        
        Container.appendChild(fragment)
      
        root.appendChild(Container)

    }
    function CreateButton() {
        let Button = document.createElement('button')
        Button.innerText = '点我'
        Button.onclick = Setcolor
        return Button
    }
    function Setcolor() {
        let color = document.getElementById('selector-color').value
        SetTheme(color)
    }
    function CreateInput() {
        let Input = document.createElement('input')
        Input.type = 'color'
        Input.id = 'selector-color'
        return Input
    }
    //创建一个Warp
    function CreateWarp() {
        let Container = document.createElement('div')
        Container.style.width = '200px'
        Container.style.height = '200px'
        Container.style.position = 'fixed'
        Container.style.bottom = '20px'
        Container.style.right = '20px'
        Container.style.zIndex = '99999'
        Container.style.backgroundColor = 'white'
       
        Container.id = 'beautiful-zhihu-warp'
        return Container
    }
    //初始化
    function Init() {
        CreateLayout()
       
        // setTimeout(function() {
        //     SetTheme("#eee")
        // },3000)
    }
    Init()
})();