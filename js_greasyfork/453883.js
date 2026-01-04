// ==UserScript==
// @name         yapi请求参数转JSONSchema并打印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自用，方便yapi转换请求参数并且打印
// @author       You
// @match        *yapi.lixinio.com/project/*/interface/api/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lixinio.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453883/yapi%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0%E8%BD%ACJSONSchema%E5%B9%B6%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453883/yapi%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0%E8%BD%ACJSONSchema%E5%B9%B6%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
   const copy = (text) => {
        navigator.clipboard.writeText(text).then(function() {
            /* clipboard successfully set */
        }, function() {
            /* clipboard write failed */
        });
    }
    const convertObjToJsonSchema = (obj) => {
        const result = {
            type: 'object',
            properties: {},
            required: []
        }
        obj.forEach(item => {
            result.properties[item.name] = {
                type: 'string',
                description: item.desc,
                example: item.example
            }
            if (item.required === '1') {
                result.required.push(item.name)
            }

        })
        console.log(JSON.stringify(result))
        return result
    }
    window.onload = function () {
        fetch(`https://yapi.lixinio.com/api/interface/get?id=${location.href.split('/').pop()}`, {
            method: 'GET',
        }).then(res => res.json()).then(res => {
            console.log(convertObjToJsonSchema(res.data.req_query))
            const button = document.createElement("button")
            button.textContent = '复制'
            button.onclick = function() {
                copy(JSON.stringify(convertObjToJsonSchema(res.data.req_query)))
            }
            setTimeout(() => {
                const dom = document.getElementsByClassName("colQuery")[0] || document.getElementsByClassName("colHeader")[0]
                dom.childNodes[0].append(button)
            }, 2000)
        })
    }
})();