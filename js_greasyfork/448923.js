// ==UserScript==
// @name         哔哩哔哩虚拟大会员
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  虚拟的超级无敌大会员
// @author       倚栏听风
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @match        *://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/448923/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%99%9A%E6%8B%9F%E5%A4%A7%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/448923/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%99%9A%E6%8B%9F%E5%A4%A7%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

(function () {
    'use strict'

    let timeout = 1000


    setTimeout(() => {
        let level = $('.h-level.m-level')
        let vip = $('.h-vipType')
        if (vip.length > 0) {
            if (vip.hasClass('disable')) {
                level.remove()
                vip.removeClass('disable')
                vip.html('<strong style="color:#ffff00">超级</strong><strong style="color:green">无敌</strong><strong style="color:black">大</strong>会员')
                vip.before('<div class="h-vipType">Lv999+</div>')
            }
        } else {
            level.after('<div class="h-vipType"><strong style="color:#ffff00">超级</strong><strong style="color:green">无敌</strong><strong style="color:black">大</strong>会员</div>')
            level.remove()
            let vip = $('.h-vipType')
            vip.before('<div class="h-vipType">Lv999+</div>')
        }

    }, timeout)

})()