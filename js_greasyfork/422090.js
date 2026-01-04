// ==UserScript==
// @name            新浪视频mpeg解析
// @namespace       https://moive.sina.com.cn
// @version         0.2.1
// @description     解决新浪,优酷,爱奇艺mpeg格式解析问题
// @author          新浪
// @require         https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @match           *://v.youku.com/*
// @match           *://v.qq.com/*
// @match           *://*.iqiyi.com/v*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422090/%E6%96%B0%E6%B5%AA%E8%A7%86%E9%A2%91mpeg%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/422090/%E6%96%B0%E6%B5%AA%E8%A7%86%E9%A2%91mpeg%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const $ = window.jQuery
    const host = location.host
    const href = location.href
    const originList = [
        { name: '线路 1', url: 'https://jx.sigujx.com/?url=' },
        { name: '线路 2', url: 'https://jx.ivito.cn/?url=' },
        { name: '线路 3', url: 'http://jiexi.380k.com/?url=' }
    ]
    const playerList = [
        { domain: "v.youku.com", node: "#player" },
        { domain: "v.qq.com", node: "#mod_player" },
        { domain: "www.iqiyi.com", node: "#flashbox" }
    ]
 
    let node = ''
 
    for (let i = 0, len = playerList.length; i < len; i++) {
        const item = playerList[i]
        if (item.domain === host) {
            node = item.node
            break
        }
    }
 
    let html = ''
 
    html += '<div class="sjw">'
    html += '<ul class="sjw__list js-sjw-list">'
    originList.forEach((item, index) => {
        html += `<li data-index='${index}'>${item.name}</li>`
    })
    html += '</ul>'
    html += '<div class="sjw__btn js-sjw-btn">VIP</div>'
    html += '</div>'
 
    GM_addStyle(`
        .sjw { position: fixed; top: 100px; left: 0; z-index: 999999999999; font-size: 12px; font-family: inherit; display: flex; align-items: flex-start; }
        .sjw * { margin: 0; padding: 0; list-style: none; }
        .sjw__btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 12px 8px 8px; color: #5B3301; background: linear-gradient(to right, #FCE5AA, #E1B271); border-radius: 0 10em 10em 0; cursor: pointer;  margin: 8px 0 0 0; }
        .sjw__list { background: #fff; padding: 4px 0; min-width: 80px; display: none; border-radius: 0 6px 6px 0; }
        .sjw__list--show { display: block; }
        .sjw__list li { padding: 8px 12px; white-space: nowrap; transition: all .3s; cursor: pointer; }
        .sjw__list li:hover,
        .sjw__list li.sjw__list--active { background: rgba(0, 0, 0, .1); }
    `)
 
    $(function () {
        $('body').append(html)
 
        $('.js-sjw-btn').on('click', function () {
            $('.js-sjw-list').toggleClass('sjw__list--show')
        })
        $(document).on('click', function (e) {
            if (!$('.js-sjw-btn').is(e.target) && $('.js-sjw-btn').has(e.target).length === 0) {
                $('.js-sjw-list').removeClass('sjw__list--show')
            }
        })
        $('.js-sjw-list li').on('click', function () {
            const index = $(this).data('index')
            const origin = originList[index].url
            $(node).html(`<iframe frameborder="0" allowfullscreen="allowfullscreen" allowtransparency="true" width="100%" height="100%" scrolling="no" src="${origin}${href}"></iframe>`)
            $(this).addClass('sjw__list--active').siblings().removeClass('sjw__list--active')
        })
    })
 
})();