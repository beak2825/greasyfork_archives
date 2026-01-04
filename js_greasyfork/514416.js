// ==UserScript==
// @name         fufugal Helper
// @namespace    https://yinr.cc/
// @version      0.4
// @description  初音的青葱小助手
// @author       Yinr
// @license      MIT
// @icon         https://fufugal.com/images/icon.jpg
// @match        http*://fufugal.com/*
// @match        http*://*.fufugal.com/*
// @match        http*://yngal.com/*
// @match        http*://*.yngal.com/*
// @match        http*://yygal.com/*
// @match        http*://*.yygal.com/*
// @match        http*://ffgal.com/*
// @match        http*://*.ffgal.com/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/514416/fufugal%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/514416/fufugal%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getHeader = (text = false) => {
        const headerEl = document.querySelector('#app .cont .cont-left.details > h2')
        if (text) {
            return headerEl.textContent
        } else {
            return headerEl
        }
    }

    const goto = (url) => {
        window.location.href = url
    }

    const getResourceType = (path) => {
        if (path == undefined) {
            path = window.location.pathname
        }
        if (path.startsWith('/detail')) {
            return 'game'
        } else if (path.startsWith('/rpgDetail')) {
            return 'rpg'
        } else if (path.startsWith('/exDetail')) {
            return '本子'
        } else if (path.startsWith('/vrDetail')) {
            return '3D/3ds'
        }
        return 'rpg'
    }

    const gotoResource = (line = 1) => {
        let host = ''
        switch (line) {
            case 5:
                host = 'https://mm.llgal.xyz'; break;
            case 4:
                host = 'https://cc.llgal.xyz'; break;
            case 3:
                host = 'https://xx.llgal.xyz'; break;
            case 2:
                host = 'https://vv.llgal.xyz'; break;
            case 1:
            default:
                host = 'https://qq.llgal.xyz'; break;
        }

        const url = prompt('修改跳转网址', `${host}/${getResourceType()}/${getHeader(true)}/`)
        if (url) goto(url)
    }

    window.galHelper = {
        getHeader,
        goto,
        gotoResource,
    }

    GM_registerMenuCommand('Goto Resource', gotoResource)
})();