// ==UserScript==
// @name         FF14-JP官网优化
// @namespace    https://greasyfork.org/zh-CN/users/325815-monat151
// @version      1.0.7
// @description  修改官网的古早字体,并提供一个快速编辑的按钮
// @author       monat151
// @license      MIT
// @match        https://jp.finalfantasyxiv.com/lodestone/*
// @match        https://jp.finalfantasyxiv.com/blog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=finalfantasyxiv.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486364/FF14-JP%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/486364/FF14-JP%E5%AE%98%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 在这里查看介绍：https://docs.qq.com/doc/DUmtUYk5LcFZNZG9H

(function() {
    'use strict';
    let module

    // 动态引入jQuery
    module = '[FF14-JP.LoadJQuery]'
    if (typeof window.$ === 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js'
        script.onload = function() {
            myConsole('jQuery was just loaded from ', script.src);
            modify()
        }
        document.head.appendChild(script);
    } else {
        modify()
    }

    function modify() {
        const $ = window.$
        const page_url = document.location.href

        // 修改字体
        module = '[FF14-JP.ChangePageFont]'
        const pageUiTargets = ['html.ja', '.jp .blog']
        myForEach(pageUiTargets, target => {
            $(target).css('font-family', '"思源黑体 CN Light","Microsoft YaHei"')
        })

        // 增加编辑按钮
        module = '[FF14-JP.AppendEditBtn]'
        let editAppendTar = $('.brand__logo:first'), btnStyle = 'padding: 2px 0 0 5px;', color = '#bddbff'
        try {
            const btnClass = 'monat-edit-btn'
            editAppendTar.append(`<a class="${btnClass}" href="javascript:void(0)" style="${btnStyle}">[进入编辑模式]</a>`)
            $('.'+btnClass).click(function(e) {
                const btn = $('.'+btnClass)
                if (!window.monatEditBtnStatus) {
                    btn.text('[退出编辑模式]')
                    document.body.contentEditable = true
                    window.monatEditBtnStatus = 'editing'
                } else {
                    btn.text('[进入编辑模式]')
                    document.body.contentEditable = 'inherit'
                    window.monatEditBtnStatus = null
                }
            })
            $('.'+btnClass).css('color', color)
        } catch(e) {
            myConsoleError('Append failed due to\n', e)
        }
    }

    // 通用工具函数
    function cHref() { return ['%c ' + module,'color:blue;'] }
    function myConsole(...array) { console.log(...cHref(), ...array) }
    function myConsoleWarn(...array) { console.warn(...cHref(), ...array) }
    function myConsoleError(...array) { console.error(...cHref(), ...array) }
    function myForEach(array,cb){if(!array||!array.length||!cb){return}for(let i=0;i<array.length;i++){cb(array[i])}}
})();