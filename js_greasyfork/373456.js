// ==UserScript==
// @name         baidu_translate_hot_key_tool
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  v0.1.0 百度翻译快捷键插件;支持聚焦/搜索内容发音/翻译结果发音
// @description  v1.0.0 整理代码, 移除兼容部分代码
// @description  v1.1.0 为了方便纯键盘操作(使用 vimium 插件), 在发音时使输入框失去焦点
// @description  v1.2.0 支持自定义 group keys, 包含 ctrl, alt, shift, meta; 详情见 log
// @icon         http://fanyi.bdstatic.com/static/translation/img/favicon/favicon_d87cd2a.ico
// @author       sven
// @include      https://fanyi.baidu.com/*
// @match        <$URL$>
// @downloadURL https://update.greasyfork.org/scripts/373456/baidu_translate_hot_key_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/373456/baidu_translate_hot_key_tool.meta.js
// ==/UserScript==

; (function () {
    if (location.href.indexOf('https://fanyi.baidu.com/#') !== 0) return false
    const input = document.getElementById('baidu_translate_input')
    const Handler = {
        _originBtn: null,
        _resultBtn: null,
        _defaultTriggerKeys: ['ctrl', 'meta'],
        get triggerKeys() {
            const cache = localStorage.getItem('triggerKeys')
            return JSON.parse(cache) || this._defaultTriggerKeys
        },
        get originBtn() {
            return this._originBtn || (this._originBtn = document.querySelector('.input-operate .operate-btn.op-sound'))
        },
        get resultBtn() {
            return this._resultBtn || (this._resultBtn = document.querySelector('.output-operate .operate-btn.op-sound'))
        },
        init() {
            Handler.listenKeyup()
            Handler.addTips()
            console.log('%c[baidu_translate_hot_key_tool] %c可以使用例如 `%clocalStorage.setItem("triggerKeys", \'["ctrl", "alt"]\')%c` 方式修改默认快捷键(user settings), 只支持 ctrl, alt, meta, shift', 'color: teal', 'color: auto', 'color: #FFF', 'color: auto')
            const userTriggerKeys = localStorage.getItem('triggerKeys');
            if (Array.isArray(JSON.parse(userTriggerKeys))) {
                console.log('%c[baidu_translate_hot_key_tool] %c已使用自定义快捷键: ' + userTriggerKeys, 'color: teal', 'color: #FFF')
            }
        },
        /**
         * 监听键盘事件
         * ctrl+meta+up(focus) 聚焦并选中
         * ctrl+meta+left(say) 发音[输入内容]
         * ctrl+meta+right(say) 发音[翻译结果]
         * Mac 下 meta 键换为 alt 键
         */
        listenKeyup() {
            document.addEventListener('keyup', evt => {
                const {
                    altKey, ctrlKey, shiftKey, keyCode, metaKey
                } = evt
                const trigger = this.triggerKeys.every(t => evt[t + 'Key'])
                if (!trigger) return false
                const originBtn = document.querySelector('.input-operate .operate-btn.op-sound')
                const resultBtn = document.querySelector('.output-operate .operate-btn.op-sound')
                switch (keyCode) {
                    case 38: // up
                        if (evt.target.tagName === 'TEXTAREA') return false;
                        input.focus()
                        input.select()
                        break
                    case 37: // left
                        originBtn && originBtn.click()
                        input.blur()
                        break
                    case 39: // right
                        resultBtn && resultBtn.click()
                        input.blur()
                        break
                }
            })
        },
        addTips() {
            // window.addEventListener('load', evt => {
            //    if (this.originBtn) this.originBtn.innerHTML += '<div>ctrl+meta+left</div>'
            //    if (this.resultBtn) this.resultBtn.innerHTML += '<div>ctrl+meta+right</div>'
            // })
        }
    }
    Handler.init()
})();