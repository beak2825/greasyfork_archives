// ==UserScript==
// @name         翻译移除换行符
// @namespace    https://github.com/yzx9/
// @version      0.0.5
// @description  移除谷歌翻译框中的换行符，尤其适用于PDF复制文字
// @author       yuan.zx@outlook.com
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441730/%E7%BF%BB%E8%AF%91%E7%A7%BB%E9%99%A4%E6%8D%A2%E8%A1%8C%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/441730/%E7%BF%BB%E8%AF%91%E7%A7%BB%E9%99%A4%E6%8D%A2%E8%A1%8C%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const validLineReg = [/^\s*$/, /\.\s*$/, /。\s*$/]
    const removeNewline = text => text
        .split('\n')
        .reduce((arr, val) => {
            arr[arr.length-1] += val + ' '
            if (validLineReg.some(r => r.test(val))) arr.push('')
            return arr
        }, [''])
        .join('\n')

    const listener = () => {
        const state = window.location.search
            .substring(1)
            .split("&")
            .map(a => a.split('='))
            .reduce((q, [k, ...v]) => ({ ...q, [k]: v.join('=') }), {})

        if (!state.text) return

        const text = removeNewline(decodeURIComponent(state.text))
        if (text === state.text) return

        const newState = { ...state, text }
        const query = Reflect.ownKeys(newState)
            .map(k => [k, encodeURIComponent(newState[k])])
            .map(([k, v]) => `${k}=${v}`)
            .join('&')
        const href = window.location.href.split('?')[0]
        window.location.href = `${href}?${query}`
    }

    window.addEventListener('paste', () => setTimeout(listener, 5));
})();