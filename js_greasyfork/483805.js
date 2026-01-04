// ==UserScript==
// @name         进化（Evolve）自动建造(含自定义倍速)
// @version      1.0.1
// @description  通过劫持Worker.prototype.postMessage方法进行加速
// @author       Wushigejiajia
// @match        https://pmotschmann.github.io/Evolve/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1242980
// @downloadURL https://update.greasyfork.org/scripts/483805/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%87%AA%E5%8A%A8%E5%BB%BA%E9%80%A0%28%E5%90%AB%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/483805/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%87%AA%E5%8A%A8%E5%BB%BA%E9%80%A0%28%E5%90%AB%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==
/* eslint-env jquery */
/*
更新说明
基于大佬DreamNya 的脚本改造
在原有基础上增加自动点击工建造功能
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

const skipList = ['收集食物','收集木材','收集石头'] // 自定义要跳过的建筑
let timer = setInterval(() => {
    if (typeof $ == "function" && $("#versionLog").length > 0) {
        clearInterval(timer)
        $("#versionLog").before(`<span id="customSpeed" class="version">自定义倍速</span>`)
        $("#customSpeed").before(`<span id="customBuild" class="version">自动建造</span>`)
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

        $("#customBuild").on("click", () => {
           autoBuild();
        })
        vueMethod = document.querySelector("#topBar").__vue__
    }
}, 100)

function autoBuild () {
    console.log(`${new Date().toLocaleString()} 开始获取建筑列表----------`)
    const node = document.querySelector('#mainTabs');
    // 建筑列表
    const list = node.querySelectorAll('.action');
    for (const [i, childNode] of list.entries()) {
        // 跳过采集的三个建筑
        if (skipControl(childNode)) {
            continue
        }

        if (childNode.classList.value.includes('cna') || childNode.classList.value.includes('cnam')) {
            console.log(`${new Date().toLocaleString()} 不满足建造条件, 跳过:`, childNode.textContent.split('description')[0].trim())
            continue
       }

       console.log(`${new Date().toLocaleString()} 升级: `, childNode.textContent , ' , MaggotScheduler running.')
       childNode.click()
       break
    }

    // 研究列表
    // const nodeList = document.querySelector('#mainTabs').querySelector('#tech').querySelectorAll('.action');
}

function skipControl (node) {
    const buildName = node.textContent;
    if (skipList.some((word) => buildName.includes(word))){
        console.log(`${new Date().toLocaleString()}`,' 跳过【自定义的建筑】：', buildName)
        return true;
    }
}





