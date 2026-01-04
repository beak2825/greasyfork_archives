// ==UserScript==
// @name         steam商店便捷按钮
// @icon      	 https://store.steampowered.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  steam商店页面添加点数商店,市场和截图页面跳转按钮,steam页面/社区导航栏添加网页key激活跳转
// @author       wsz987
// @match        https://store.steampowered.com/app/*
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_openInTab
// @supportURL   https://keylol.com/t615154-1-1
// @downloadURL https://update.greasyfork.org/scripts/406317/steam%E5%95%86%E5%BA%97%E4%BE%BF%E6%8D%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/406317/steam%E5%95%86%E5%BA%97%E4%BE%BF%E6%8D%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*窗口聚焦
    true:窗口切换到打开页面
    false 新页面打开但保持当前页面显示 */
    let appid = location.pathname.split('/')[2]
    const setting = {
        窗口聚焦: false,
        DOM: [{
                btn_id: 'screenshots_btn',
                href: `https://steamcommunity.com/app/${appid}/screenshots/`,
                name:'截图'
            },
            {
                btn_id: 'market_btn',
                href: `https://steamcommunity.com/market/search?appid=753&category_753_Game[]=tag_app_${appid}`,
                name:'市场'
            },
            {
                btn_id: 'points_btn',
                href: `https://store.steampowered.com/points/shop/app/${appid}`,
                name:'点数商店'
            }
        ]
    }
    // 网页key激活
    if (location.host == "store.steampowered.com" || location.host == "steamcommunity.com") {
        $('.supernav_container').append("<a class='menuitem' href='https://store.steampowered.com/account/registerkey' target='_blank'>key激活</a>")
    }
    new Promise(resolve => {
        let content = ''
        setting.DOM.forEach(el => {
            content += `
            <a class='btnv6_blue_hoverfade btn_medium' id='${el.btn_id}' href='${setting.窗口聚焦?el.href:'javascript:void(0)'}' style='margin:0 3px !important' ${setting.窗口聚焦?"target = '_blank'":''}
            title='跳转到对应${el.name}'>
               <span>${el.name}</span>
           </a>
            `
            if (!setting.窗口聚焦)
                $('body').on("click", `#${el.btn_id}`, () => {
                    GM_openInTab(el.href)
                })
        })
        resolve(content)
    }).then(str_DOM => $("div.apphub_OtherSiteInfo > a:last-child").before(str_DOM))
})();