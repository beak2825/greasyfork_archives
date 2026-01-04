// ==UserScript==
// @name         进化（Evolve）自定义倍速
// @version      1.1.1
// @description  通过劫持Worker.prototype.postMessage方法进行加速
// @author       DreamNya
// @match        https://g8hh.github.io/evolve/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/448539/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448539/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==
/* eslint-env jquery */
/*
更新说明
v1.1.1(2022-08-03):
优化代码

v1.1(2022-08-03):
现在支持游戏内动态调整倍速
初始默认1倍速，点击游戏右上角版本号左边可动态调整游戏倍速
且脚本会自动存储当前倍数到localStorage中，下次进入游戏会自动读取
如有bug欢迎反馈
*/

const getValue = function (key, defaultValue) {
    let value = JSON.parse(window.localStorage.getItem(key))
    return value || defaultValue
}

const setValue = function (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

let customSpeed = getValue("customSpeed", 1); //不需要手动修改，初始1倍速度，点击游戏右上角版本号左边可动态自定义倍速并储存，下次进入游戏自动读取

let fromScript = false;
let vueMethod;

const oldPost = Worker.prototype.postMessage;
Worker.prototype.postMessage = async function (...args) {
    let that = this
    async function hookPost(){
        if (args[0].period) {
            args[0].period = args[0].period / customSpeed
        }
        oldPost.apply(that, args)
    }
    let hookResult = await hookPost()
    if (fromScript) {
        vueMethod.pause()
        fromScript = false
    }
    return hookResult
}

let timer = setInterval(() => {
    if (typeof $ == "function" && $("#versionLog").length > 0) {
        clearInterval(timer)
        $("#versionLog").before(`<span id="customSpeed" class="version">自定义倍速</span>`)
        $("#customSpeed").text("自定义倍速x" + customSpeed)
        $("#customSpeed").on("click", () => {
            let input = prompt("自定义倍速（仅限正数）\n       存储在localStorage中，下次进入游戏自动读取\n暂停并取消后生效\n       非暂停状态修改倍数后脚本会自动暂停并取消\n       频繁修改倍速可能会导致游戏卡顿", customSpeed)
            if (isNaN(Number(input)) == false && Number(input) > 0) {
                customSpeed = input * 1
                setValue("customSpeed", customSpeed)
                $("#customSpeed").text("自定义倍速x" + customSpeed)
                if (!vueMethod._data.s.pause) {
                    fromScript = true
                    vueMethod.pause()
                }
            } else {
                alert("输入有误,仅限正数")
            }
        })
        vueMethod = document.querySelector("#topBar").__vue__
    }
}, 100)