// ==UserScript==
// @name         维基百科优先简体中文（或繁体）
// @version      0.15
// @description  Wikipedia 维基百科中文优先选择地区 简/繁 中文。
// @author       Erimus
// @include      http*://zh.wikipedia.org/*
// @namespace    https://greasyfork.org/users/46393
// @downloadURL https://update.greasyfork.org/scripts/25678/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%EF%BC%88%E6%88%96%E7%B9%81%E4%BD%93%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/25678/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E4%BC%98%E5%85%88%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%EF%BC%88%E6%88%96%E7%B9%81%E4%BD%93%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================================================
    // 请优先使用维基百科自带的语言选择功能，需要登陆账号。
    // 在参数设置里选择，不同的地区语言，链接可能不同。
    // https://zh.wikipedia.org/wiki/Special:参数设置
    // ==================================================

    console.log('自动切换维基语言')

    let langs = {
            'zh-cn': '大陆简体',
            'zh-hk': '香港繁體',
            'zh-mo': '澳門繁體',
            'zh-my': '大马简体',
            'zh-sg': '新加坡简体',
            'zh-tw': '臺灣正體'
        },
        target_lang = 'zh-cn',  // 在这里输入你需要的语言
        target_lang_name = langs[target_lang]

    let url = document.URL
    console.log('Url:', url)

    // 当前语言非目标语言
    if (url.includes(target_lang)) {
        console.log('当前语言:', target_lang, '无需变更')
    } else {
        let find_current_lang = setInterval(function() {
            let current_lang = document.querySelector('#mw-head #p-variants-label span').innerHTML
            console.log('当前语言:', current_lang)
            if (current_lang) {
                clearInterval(find_current_lang)
                // 简体默认为【简体】，而不是【大陆简体】。所以判断includes。
                if (target_lang_name == current_lang) {
                    console.log('当前语言:', current_lang, '无需变更')
                } else {
                    switch_to_target_lang()
                }
            }
        }, 500)
    }

    let switch_to_target_lang = function() {
        let pieces = url.split('/'),
            lang = pieces[3],
            word = pieces[pieces.length - 1],
            new_url = 'https://zh.wikipedia.org/' + target_lang + '/' + word
        console.log('变更语言', lang, '->', target_lang)
        console.log('跳转到:', new_url)
        window.location = new_url
    }

})();
