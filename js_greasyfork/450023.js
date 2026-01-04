// ==UserScript==
// @name         无尽矿石（More Ore）自定义倍速及暴露全局变量
// @version      1.0-Demo
// @description  通过劫持方法暴露游戏内置变量到window.game，并可自定义游戏内置倍速。【测试版，不保证无BUG】
// @author       DreamNya
// @match        https://file.u77.games/zh-cn/*/more-ore-v3/index.html
// @grant        none
// @license      MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/450023/%E6%97%A0%E5%B0%BD%E7%9F%BF%E7%9F%B3%EF%BC%88More%20Ore%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%8F%8A%E6%9A%B4%E9%9C%B2%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450023/%E6%97%A0%E5%B0%BD%E7%9F%BF%E7%9F%B3%EF%BC%88More%20Ore%EF%BC%89%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E5%8F%8A%E6%9A%B4%E9%9C%B2%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F.meta.js
// ==/UserScript==
const customSpeed = 10; //自定义倍速，默认10倍，影响实际计算，不影响动画效果；动态调整倍速方法：控制台修改game.State.settings.gameSpeed

const realDef = window.Object.defineProperty;
const realAssign = window.Object.assign;

let objHooked = false;
let speedHooked = false;


window.Object.assign = function (...args) {
    if (args[1]?.settings) {
        args[1].settings.gameSpeed = customSpeed
        window.Object.assign = realAssign
    }
    return realAssign.call(this, ...args)
}

window.Object.defineProperty = function (...args) {
    if (args[1] == '__esModule') {
        watchObject(args[0])
    }
    realDef.call(this, ...args)
}

function watchObject(obj) {
    let value
    realDef(obj, "State", {
        get() {
            return value
        },
        set(newValue) {
            value = newValue
            if (!objHooked) {
                window.game = obj
                objHooked = true
                window.Object.defineProperty = realDef
            }
        }
    })
}