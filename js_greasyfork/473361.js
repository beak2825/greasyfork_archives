// ==UserScript==
// @name        XML Http Request Interceptor
// @namespace   xml-http-request-interceptor
// @version     1.0.0
// @description XHR网络请求拦截器
// @author      如梦Nya
// @license     MIT
// @match       *://*/*
// ==/UserScript==

class XHRIntercept {
    /** @type {XHRIntercept} */
    static _self

    /**
     * 初始化
     * @returns {XHRIntercept}
     */
    constructor() {
        if (XHRIntercept._self) return XHRIntercept._self
        XHRIntercept._self = this

        // 修改EventListener方法
        let rawXhrAddEventListener = XMLHttpRequest.prototype.addEventListener
        XMLHttpRequest.prototype.addEventListener = function (key, func) {
            if (key === "progress") {
                this.onprogress = func
            } else {
                rawXhrAddEventListener.apply(this, arguments)
            }
        }
        let rawXhrRemoveEventListener = XMLHttpRequest.prototype.removeEventListener
        XMLHttpRequest.prototype.removeEventListener = function (key, func) {
            if (key === "progress") {
                this.onprogress = undefined
            } else {
                rawXhrRemoveEventListener.apply(this, arguments)
            }
        }

        // 修改send方法
        /** @type {function[]} */
        this.sendIntercepts = []
        this.rawXhrSend = XMLHttpRequest.prototype.send
        XMLHttpRequest.prototype.send = function () { XHRIntercept._self._xhrSend(this, arguments) }
    }

    /**
     * 添加Send拦截器
     * @param {function} func 
     */
    onSend(func) {
        if (this.sendIntercepts.indexOf(func) >= 0) return
        this.sendIntercepts.push(func)
    }

    /**
     * 删除Send拦截器
     * @param {function | undefined} func 
     */
    offSend(func) {
        if (typeof func === "function") {
            let index = this.sendIntercepts.indexOf(func)
            if (index < 0) return
            this.sendIntercepts.splice(index, 1)
        } else {
            this.sendIntercepts = []
        }
    }


    /**
     * 发送拦截器
     * @param {XMLHttpRequest} self 
     * @param {IArguments} args
     */
    _xhrSend(self, args) {
        let complete = () => { this.rawXhrSend.apply(self, args) }
        for (let i = 0; i < this.sendIntercepts.length; i++) {
            let flag = this.sendIntercepts[i](self, args, complete)
            if (flag) return
        }
        complete()
    }
}
