// ==UserScript==
// @name         Bilibili Crack For m
// @namespace    https://t.me/bili_bi
// @version      0.2.1
// @description  解锁大会员专享番剧及电影
// @author       MMMM
// @include      *//www.bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419880/Bilibili%20Crack%20For%20m.user.js
// @updateURL https://update.greasyfork.org/scripts/419880/Bilibili%20Crack%20For%20m.meta.js
// ==/UserScript==

// Original script from https://greasyfork.org/zh-CN/scripts/406301-bilibili-crack-for-m
(function() {
    'use strict';
    function modifyGlobalValue(name, modifyFn) {
        const name_origin = `${name}_origin`
            window[name_origin] = window[name]
        let value = undefined
        Object.defineProperty(window, name, {
            configurable: true,
            enumerable: true,
            get: () => {
                return value
            },
            set: (val) => {
                value = modifyFn(val)
            }
        })
        if (window[name_origin]) {
            window[name] = window[name_origin]
        }
    }
    function replaceInitialState() {
        modifyGlobalValue('__INITIAL_STATE__', (value) => {
            for (let ep of [value.epInfo, ...value.epList]) {
                if (ep.epStatus === 13) {
                    ep.epStatus = 2
                }
            }
            return value
        })
    }
    function replaceUserState() {
        modifyGlobalValue('__PGC_USERSTATE__', (value) => {
            if (value) {
                // 区域限制
                // todo      : 调用areaLimit(limit), 保存区域限制状态
                // 2019-08-17: 之前的接口还有用, 这里先不保存~~
                value.area_limit = 0
                // 会员状态
                value.vip_info.status = 1
                value.vip_info.type = 2
            }
            return value
        })
    }
    function replacePlayInfo() {
        window.__playinfo__origin = window.__playinfo__
        let playinfo = undefined
        Object.defineProperty(window, '__playinfo__', {
            configurable: true,
            enumerable: true,
            get: () => {
                return playinfo
            },
            set: (value) => {
                // debugger
                // 原始的playinfo为空, 且页面在loading状态, 说明这是html中对playinfo进行的赋值, 这个值可能是有区域限制的, 不能要
                if (!window.__playinfo__origin && window.document.readyState === 'loading') {
                    window.__playinfo__origin = value
                    return
                }
                playinfo = value
            },
        })
    }
    replaceUserState()
    replaceInitialState()
    if (!document.getElementById('mmmmm')) {
        replacePlayInfo();
        let $script = document.createElement('script')
        $script.id = 'mmmmm'
        document.head.appendChild($script)
    }
})();