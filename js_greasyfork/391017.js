// ==UserScript==
// @name         ShowCssStyle
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  show css style
// @author       Roastwind
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391017/ShowCssStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/391017/ShowCssStyle.meta.js
// ==/UserScript==

(function() {
'use strict';
// 创意来源: https://juejin.im/pin/5d80b839e51d456cecc4a8e4
// 按钮id
var _id = 'show-css-style'
// style id
var _style_id = 'add-style'
var _btn_id = 'show-css-btn'
var _outline_css = `html * { outline: 1px solid red }#${_id}{outline: none;}#${_id} * {outline: none;}`
var _text_show = 'show'
var _text_hide = 'hide'

var init = function() {
    // 容器
    var btnWrap = document.createElement('div')
    btnWrap.style.position = 'fixed'
    btnWrap.style.zIndex = '99999'
    btnWrap.style.width = '42px'
    // btnWrap.style.height = '60px'
    btnWrap.style.left = '0'
    btnWrap.style.top = '200px'
    btnWrap.style.display = 'flex'
    btnWrap.style.flexDirection = 'column'
    btnWrap.setAttribute('id', _id)

    // 展示按钮
    var btn = document.createElement('btn')
    btn.style.width = '40px'
    btn.style.height = '20px'
    btn.style.lineHeight = '20px'
    btn.style.border = '1px solid gray'
    btn.style.marginBottom = '10px'
    btn.style.borderRadius = '5px'
    btn.style.textAlign = 'center'
    btn.style.cursor = 'pointer'
    btn.style.userSelect = 'none'
    btn.style.fontSize = '14px'
    btn.innerText = _text_show
    btn.setAttribute('id', _btn_id)
    btn.addEventListener('click', function() {
        if (hasShow()) {
            removeCssLine()
            setBtnText(_text_show)
        }
        else {
            addCssLine()
            setBtnText(_text_hide)
        }
    })

    btnWrap.appendChild(btn)
    document.body.appendChild(btnWrap)
}
// 是否已添加
var hasShow = function() {
    var btn = document.querySelector(`#${_btn_id}`)
    return btn && btn.innerText === _text_hide
}
// 设置按钮文本
var setBtnText = function(text) {
    var btn = document.querySelector(`#${_btn_id}`)
    if (btn) {
        btn.innerText = text
    }
}
// 添加样式红线
var addCssLine = function() {
    var hasAddStyle = document.querySelector(`#${_style_id}`)
    if (hasAddStyle) { return }

    var style = document.createElement('style')
    style.textContent = _outline_css
    style.setAttribute('id', _style_id)
    document.body.appendChild(style)
}
// 移除样式红线
var removeCssLine = function() {
    var addStyle = document.querySelector(`#${_style_id}`)
    if (addStyle) {
        addStyle.remove()
    }
}
if (window === parent) {
    init()
}
})();