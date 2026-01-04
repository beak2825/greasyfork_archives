// ==UserScript==
// @name         QuHouLibary
// @namespace    http://quhou.net/
// @version      0.1
// @description  QuHou's Libary
// @match        http://*/*
// @match        https://*/*
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个对象来存储我们的工具函数
    const qq = {
        /**
     * @param {string} selector
     * @return {HTMLElement}
     * */
        findDom(selector,parent = document) {
            const startTime = new Date().getTime()
            return new Promise((resolve, reject) => {
                const id = setInterval(() => {
                    const dom = parent.querySelector(selector)
                    if (dom) {
                        clearInterval(id)
                        resolve(dom)
                    } else if (new Date().getTime() - startTime > 1000 * 30) {
                        clearInterval(id)
                        reject(`无法找到此dom元素: ${selector}`)
                    }
                }, 200)
                })
        },
        /**
     * @param {string} selector
     * @return {HTMLElement[]}
     * */
        findAllDom(selector,parent = document) {
            const startTime = new Date().getTime()
            return new Promise((resolve, reject) => {
                const id = setInterval(() => {
                    const doms = [...new Set(parent.querySelectorAll(selector))]
                    if (doms.length > 0) {
                        clearInterval(id)
                        resolve(doms)
                    } else if (new Date().getTime() - startTime > 1000 * 30) {
                        clearInterval(id)
                        reject(`无法找到此dom元素: ${selector}`)
                    }
                }, 200)
                }).catch(err => console.log(err))
        },
        findShadowDom(selector,parent=document) {
            const startTime = new Date().getTime()
            return new Promise((resolve, reject) => {
                const id = setInterval(() => {
                    const result = parent.querySelector(selector);
                    if (result) return result;
                    const shadowRoots = parent.querySelectorAll('*');
                    for (const root of shadowRoots) {
                        if (root.shadowRoot) {
                            const found = this.findShadowDom(selector,root.shadowRoot);
                            if (found){
                                clearInterval(id)
                                resolve(found)
                            }else if (new Date().getTime() - startTime > 1000 * 30) {
                                clearInterval(id)
                                reject(`无法找到此dom元素: ${selector}`)
                            }
                        }
                    }
                }, 200)
          }).catch(err => console.log(err))
        },
        randomNum(start, end) {
            return Math.floor(Math.random() * (end - start + 1)) + start
        },
        isNumber(v) {
            return typeof v === 'number' && isFinite(v);
        }
    }
    qq.log = true
    window.qq = qq;
    qq.log && console.log("qq tool is loaded")
})();