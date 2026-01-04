// ==UserScript==
// @name         修改某网站logo
// @namespace    http://tampermonkey.net/
// @version      2024-11-04
// @description  修改某网站logo及名称
// @author       mars
// @match        http://admin.leapthinking.com/*
// @icon         http://science.z3cloud.com.cn/jldata/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515712/%E4%BF%AE%E6%94%B9%E6%9F%90%E7%BD%91%E7%AB%99logo.user.js
// @updateURL https://update.greasyfork.org/scripts/515712/%E4%BF%AE%E6%94%B9%E6%9F%90%E7%BD%91%E7%AB%99logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const editInfo = () => {
        const domLogo = document.querySelector('.bl-sidebar-logo-link')
        domLogo.style.background = '#1778ff'
        const domImg = domLogo.children[0]
        domImg.style.background = 'transparent'
        domImg.src = 'http://science.z3cloud.com.cn/jldata/assets/logo2-659788f2.png'

        const domName = document.querySelector('.bl-avatar-wrapper').querySelector('.bl-user-name')
        domName.innerText = '巨灵财经'

        const domViceName = document.querySelector('.bl-user-dropdown_name')
        domViceName.innerText = '巨灵财经'

        const icon = document.createElement('link')
        icon.setAttribute('rel', 'icon')
        icon.href = 'http://science.z3cloud.com.cn/jldata/favicon.ico'
    }

    setInterval(() => {
        if (document.querySelector('.bl-avatar-wrapper')){
            const name = document.querySelector('.bl-avatar-wrapper').querySelector('.bl-user-name')
            if (name.innerText !== '巨灵财经') {
                editInfo()
            }
        }
    }, 200)

    // 修改icon
    setInterval(() => {
      const icon = document.querySelector('link[rel="shortcut icon"]')
      if (icon && icon.href !== 'http://science.z3cloud.com.cn/jldata/favicon.ico') {
         icon.href = 'http://science.z3cloud.com.cn/jldata/favicon.ico'
      }
    }, 100)

})();