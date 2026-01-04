// ==UserScript==
// @name         拉卡尼休（Rakanishu）暴露内置变量到全局
// @version      1.0
// @description  通过劫持webpack4打包代码方法，暴露游戏内置变量到全局window.game
// @author       DreamNya
// @match        https://g1tyx.github.io/rakanishu/
// @match        https://yx.g8hh.com/rakanishu
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/809466
// @downloadURL https://update.greasyfork.org/scripts/452056/%E6%8B%89%E5%8D%A1%E5%B0%BC%E4%BC%91%EF%BC%88Rakanishu%EF%BC%89%E6%9A%B4%E9%9C%B2%E5%86%85%E7%BD%AE%E5%8F%98%E9%87%8F%E5%88%B0%E5%85%A8%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/452056/%E6%8B%89%E5%8D%A1%E5%B0%BC%E4%BC%91%EF%BC%88Rakanishu%EF%BC%89%E6%9A%B4%E9%9C%B2%E5%86%85%E7%BD%AE%E5%8F%98%E9%87%8F%E5%88%B0%E5%85%A8%E5%B1%80.meta.js
// ==/UserScript==
/*
【原理详解】
webpack4打包代码劫持方法探究
https://bbs.tampermonkey.net.cn/thread-2950-1-1.html
*/
let value;
let hooked = false;
Object.defineProperty(window, "webpackChunkrakanishu", {
    get() {
        return value
    },
    set(newValue) {
        value = newValue
        if (!hooked && window.webpackChunkrakanishu.push && window.webpackChunkrakanishu.push != window.Array.prototype.push) {
            window.webpackChunkrakanishu.realPush = window.webpackChunkrakanishu.push
            window.webpackChunkrakanishu.push = function (...args) {
                if (typeof args[0]?.[1]?.[952] == "function") {
                    let fucText = args[0][1][952].toString()

                    //replace去头+slice去尾
                    fucText = fucText.replace("(me,_e,L)=>{", "").slice(0, -1)
                    //暴露闭包对象到全局
                    fucText = fucText.replace("function Pd(t,n,e,i,r){", "function Pd(t,n,e,i,r){if(!window.game && n?.[15]?.[15]?.[8].data){window.game=n[15][15][8].data}")
                    //构造劫持函数
                    args[0][1][952] = new Function("me,_e,L", fucText)

                    //劫持成功后还原劫持
                    this.push = this.realPush
                }
                this.realPush(...args)
            }
            hooked = true
        }
    }
})