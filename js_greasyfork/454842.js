// ==UserScript==
// @name         莘野起始页扩展
// @namespace 	 seclusion
// @version      1.0.1
// @description  用于为起始页添加跨域请求：因搜索聚合需要进行跨域请求，而使用服务器代理的话会被封，所以使用扩展进行跨域请求；
// @author       wythe

// @run-at       document-start
// @inject-into  content
// @grant        unsafeWindow
// @grant        GM.xmlHttpRequest

// @match        http://127.0.0.1:5173/*
// @match        *://seclusion.life/*

// @connect      *

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/454842/%E8%8E%98%E9%87%8E%E8%B5%B7%E5%A7%8B%E9%A1%B5%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/454842/%E8%8E%98%E9%87%8E%E8%B5%B7%E5%A7%8B%E9%A1%B5%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

;(function () {
    'use strict'

    const type = GM.info.scriptHandler
    if (type === 'Userscripts') {
        window.addEventListener('message', event => {
            if (event.source !== window) return
            if (event?.data?.type === 'seclusion-request') {
                const { key, data: url } = event.data
                GM.xmlHttpRequest({
                    method: 'GET',
                    url,
                    onload: function (response) {
                        window.postMessage({ type: 'seclusion-response', key, data: response }, '*')
                    },
                    onerror: function (response) {
                        window.postMessage({ type: 'seclusion-response', key, data: response }, '*')
                    },
                })
            }
        })

        const $request = function (url) {
            return new Promise(resolve => {
                const key = Math.random().toString(36) + Date.now()
                $request.callback.set(key, resolve)
                window.postMessage({ type: 'seclusion-request', key, data: url }, '*')
            })
        }
        const str = [`$request = ${$request.toString()}`, '$request.callback = new Map()']
        str.push(`
            window.addEventListener('message', e => {
                if (e.data.type === 'seclusion-response') {
                    const { key, data } = e.data
                    const callback = $request.callback.get(key)
                    if (callback) {
                        callback(data)
                        $request.callback.delete(key)
                    }
                }
            })
        `)
        const script = document.createElement('script')
        script.textContent = str.join('\n')
        document.body.appendChild(script)
    } else if (type === 'Tampermonkey') {
        unsafeWindow.$request = url => {
            return new Promise(resolve => {
                GM.xmlHttpRequest({ method: 'GET', url, onload: resolve, onerror: resolve })
            })
        }
    }
})()
