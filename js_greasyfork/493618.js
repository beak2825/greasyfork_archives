// ==UserScript==
// @name         百度文库一键提取脚本
// @namespace    http://tampermonkey.net/
// @version      v0.1(2024/4/27 23:20)
// @description  我的QQ 150762275  欢迎交流
// @author       明月清风
// @match        https://wenku.baidu.com/view/*
// @icon         https://ewaaa.gitee.io/flappy-bird/main/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493618/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493618/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mainDialog = document.createElement("dialog")
const minDialog = document.createElement("dialog")

mainDialog.innerHTML = `
        <div style="width: 250px;
    height: 450px;position: relative;" class="content">
            <div>
                <span>欢迎使用百度文库一键提取脚本~~~</span><br>
                <span><button>点击获取页面文本</button></span>
            </div>
            <textarea name="" id="" cols="32" rows="25" readonly style="resize:none;overflow: auto;">点击上面按钮获取页面文本
            </textarea>
            <p>注意！ 如果页面未显示全部文本，请在点击查看剩余全文后，再次提取文本复制</p>
        </div>
        <div class="min" style="position: absolute;top: 0;right: 0;"><button>最小化</button></div>
`
minDialog.innerHTML = `
   <span style="cursor: pointer;position: relative;width: 70%;height: 70%;display: block;margin: auto;transform: translateY(25%);">最大化悬浮窗</span>
`

mainDialog.style.position = "fixed"
mainDialog.style.top = "20%"
mainDialog.style.right = "-400px"
mainDialog.style.background = " rgba(255, 165, 255, .5)"
mainDialog.style.borderRadius = "15px"

minDialog.style.width = "78px"
minDialog.style.height = "78px"
minDialog.style.backgroundColor = "rgba(255, 165, 255, .8)"
minDialog.style.borderRadius = "50%"
minDialog.style.position = "fixed"
minDialog.style.top = "240px"
minDialog.style.right = "-400px"
minDialog.style.overflow = "hidden"
minDialog.style.boxSizing = "border-box"
minDialog.style.padding = "0"
minDialog.style.zIndex = "9999"

document.body.appendChild(mainDialog)
document.body.appendChild(minDialog)

mainDialog.showModal()
// minDialog.showModal()

const textarea = mainDialog.querySelector("textarea")
const getTextButton = mainDialog.querySelector(".content button")
const getMinButton = mainDialog.querySelector(".min button")

function getText(){
    textarea.value = ""
    //p[class^='ql']    .ql
    document.querySelectorAll("p[class^='ql']").forEach(item => {
        item.children.forEach(item2 => {
            textarea.value += (item2.innerText + "\n")
        })
    })
    document.querySelectorAll("p[class^='is']").forEach(item => {
        item.children.forEach(item2 => {
            textarea.value += (item2.innerText + "\n")
        })
    })
}

getTextButton.addEventListener('click',getText)

function getMin() {
    mainDialog.close()
    minDialog.show()
}

getMinButton.addEventListener('click',getMin)

function getMain(){
    mainDialog.showModal()
    minDialog.close()
}

minDialog.querySelector("span").addEventListener('click',getMain)

    // Your code here...
})();