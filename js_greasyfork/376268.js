// ==UserScript==
// @name         Dark++
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CSS 实现夜间模式; 代码是从贴吧抄的, 嗯 ... over; 由于该实现本质上是覆盖一层, 可能会有未知问题出现: 如 sortTable.js 拖拽无效
// @description  v0.5 增加 file://* 协议支持
// @description  v0.6 通过修改 run-at: docuemnt-body 实现无感知增加遮罩层
// @description  v0.7 增加延迟设置, 应对延迟载入内容的页面
// @description  v0.8 修复因精度问题导致的透明度设置无效的问题
// @description  v1.0 增加亮度同步功能, 在单个页面修改后在所有页面生效
// @icon         https://gss0.baidu.com/7Ls0a8Sm2Q5IlBGlnYG/sys/portraith/item/feb81406?t=1435668917
// @author       sven
// @include      https://*
// @include      http://*
// @include      file://*
// @match        .*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/376268/Dark%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/376268/Dark%2B%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const LOCAL_OPACITY_FIELD_NAME = 'dark_model_opacity' // 保存到本地的亮度 key
    const m = document.createElement('div')
    m.style.zIndex = '999999'
    m.style.position = 'absolute'
    m.style.height = '100vh'
    m.style.width = '100vw'
    m.style.position = 'fixed'
    m.style.top = '0'
    m.style.left = '-9999px'
    m.id = 'dark-modal'
    let opacity = GM_getValue(LOCAL_OPACITY_FIELD_NAME) || 0.4
    const step = 0.05
    const updateOpacity = opacityVal => m.style.outline = `rgba(0, 0, 0, ${opacity = opacityVal}) solid 10000px`
    const setOpacity = ({ opa, add, sub } = {}) => {
        let _opa = Number(opa || opacity) || 0
        _opa = add
            ? _opa + step
            : (sub ? (_opa - step) : _opa)
        _opa = Math.max(0, _opa)
        _opa = Math.min(1, _opa)
        GM_setValue(LOCAL_OPACITY_FIELD_NAME, _opa.toFixed(2))
        console.log('%c[Dark++ plugin] %copacity: ' + _opa.toFixed(2), 'color: teal;', 'color: #FFF;')
        updateOpacity(_opa)
    }
    const init = () => {
        let delay = localStorage.getItem('DARK_PLUS_PLUS_DELAY')
        if (delay === null) {
            document.body.append(m)
            setOpacity()
        } else {
            delay = Number(delay)
            delay = (isNaN(delay) || delay < 0 || !Number.isInteger(delay)) ? 0 : delay
            setTimeout(() => {
                document.body.append(m)
                setOpacity()
            }, delay)
        }
        // 增加监听函数, 当其他页面修改亮度时在当前页面同步更新
        GM_addValueChangeListener(LOCAL_OPACITY_FIELD_NAME, (name, oldVal, val) => updateOpacity(val))
        console.log(`%c[Dark++ plugin] delay: ${delay} | %c设置延迟载入遮罩层: %clocalStorage.setItem('DARK_PLUS_PLUS_DELAY', 200)`, 'color: teal', 'color: #FFF', 'color: #AAA')
    }
    const keyMap = {
        81: () => setOpacity({ add: true }),
        87: () => setOpacity({ sub: true })
    }
    init()
    document.addEventListener('keydown', evt => {
        keyMap[evt.keyCode] && keyMap[evt.keyCode](evt)
    })
})();