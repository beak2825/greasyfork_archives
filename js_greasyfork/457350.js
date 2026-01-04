// ==UserScript==
// @name         不朽放置辅助脚本
// @namespace    http://bmqy.net/
// @version      1.0.0
// @description  不朽放置-Immortality Idle，辅助脚本：银两倍增、暴露游戏内置变量到全局window.game。
// @author       bmqy
// @match        https://gltyx.github.io/immortality-idle/*
// @match        https://yx.g8hh.com/immortality-idle/*
// @icon         https://gltyx.github.io/immortality-idle/assets/images/favicon.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457350/%E4%B8%8D%E6%9C%BD%E6%94%BE%E7%BD%AE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457350/%E4%B8%8D%E6%9C%BD%E6%94%BE%E7%BD%AE%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/*
【原理详解】
webpack4打包代码劫持方法探究
https://bbs.tampermonkey.net.cn/thread-2950-1-1.html
*/
let value;
let hooked = false;
let baseMoney = 9999999999;
Object.defineProperty(window, "webpackChunkimmortalityidle", {
    get() {
        return value
    },
    set(newValue) {
        value = newValue
        if (!hooked && window.webpackChunkimmortalityidle.push && window.webpackChunkimmortalityidle.push != window.Array.prototype.push) {
            window.webpackChunkimmortalityidle.realPush = window.webpackChunkimmortalityidle.push
            window.webpackChunkimmortalityidle.push = function (...args) {
                if (typeof args[0]?.[1]?.[857] == "function") {
                    let fucText = args[0][1][857].toString()
                    //replace去头+slice去尾
                    fucText = fucText.replace("(xa, Xm, eg) => {", "").slice(0, -1)
                    //暴露闭包对象到全局
                    fucText = fucText.replace("this.injector = e, this.characterService = n, this.homeService = r, this.autoBuyerSettingsUnlocked = !1, this.autoBuyerSettings = this.getDefaultSettings(), this.autobuyers = {", "if(!window.game&&n.characterState){window.game=n.characterState};this.injector = e, this.characterService = n, this.homeService = r, this.autoBuyerSettingsUnlocked = !1, this.autoBuyerSettings = this.getDefaultSettings(), this.autobuyers = {")
                    fucText = fucText.replace("this.characterService.characterState.dead || this.tick()", "this.characterService.characterState.money+="+ baseMoney +";this.characterService.characterState.dead || this.tick()")
                    //构造劫持函数
                    args[0][1][857] = new Function("xa, Xm, eg", fucText)

                    //劫持成功后还原劫持
                    this.push = this.realPush
                }
                this.realPush(...args)
            }
            hooked = true
        }
    }
})
