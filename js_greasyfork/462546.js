// ==UserScript==
// @name         steam商店便捷按钮
// @icon      	 https://store.steampowered.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      2.0.2
// @description  steam商店页面添加特殊跳转按钮
// @author       wsz987/修改
// @match        https://store.steampowered.com/app/*
// @match        https://store.steampowered.com/sub/*
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_openInTab
// @supportURL   https://keylol.com/t615154-1-1
// @downloadURL https://update.greasyfork.org/scripts/462546/steam%E5%95%86%E5%BA%97%E4%BE%BF%E6%8D%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/462546/steam%E5%95%86%E5%BA%97%E4%BE%BF%E6%8D%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*窗口聚焦
    true:窗口切换到打开页面
    false 新页面打开但保持当前页面显示 */
    let appid = location.pathname.split('/')[2]
    const setting = {
        窗口聚焦: true,
        DOM: [{
                btn_id: 'keyloltag_btn',
                href: `https://keylol.com/misc.php?mod=tag&appid=${appid}`,
                name:'其乐Tag',
                icon:'https://keylol.com/favicon.ico'
            },
            {
                btn_id: 'help_btn',
                href: `https://help.steampowered.com/zh-cn/wizard/HelpWithGame/?appid=${appid}`,
                name:'steam客服',
                icon:'https://store.steampowered.com/favicon.ico',
            },
            {
                btn_id: 'points_btn',
                href: `https://store.steampowered.com/points/shop/app/${appid}`,
                name:'点数商店',
                icon:'https://store.steampowered.com/favicon.ico',
            },
            {
                btn_id: 'friendhave_btn',
                href: `https://steamcommunity.com/id/demonke/friendsthatplay/${appid}`,
                name:'好友拥有',
                icon:'https://store.steampowered.com/favicon.ico',
            },
            {
                btn_id: 'tracker_btn',
                href: `https://steam-tracker.com/app/${appid}`,
                name:'steam-tracker',
                icon:'https://steam-tracker.com/images/favicon.png',
            },
             ]
    }
    // 网页上方快捷功能
    if (location.host == "store.steampowered.com" || location.host == "steamcommunity.com") {
        $('.supernav_container').append("<a class='menuitem' href='https://store.steampowered.com/account/registerkey' target='_blank'>激活页面</a>")//key激活
        $('.supernav_container').append("<a class='menuitem' href='https://help.steampowered.com/zh-cn/wizard/HelpCannotCompletePurchase' target='_blank'>近期购买</a>")//客服购买失败页面、卡单
        $('.supernav_container').append("<a class='menuitem' href='https://steamcommunity.com/market/' target='_blank'>市场</a>")//市场
        $('.supernav_container').append("<a class='menuitem' href='https://steamcommunity.com/my/inventory' target='_blank'>库存</a>")//库存
        $('.supernav_container').append("<a class='menuitem' href='https://steamcommunity.com/my/recommended' target='_blank'>评测</a>")//评测
    }
    //app网页
    new Promise(resolve => {
        let content = ''
        setting.DOM.forEach(el => {
            content += `
            <a class='btnv6_blue_hoverfade btn_medium' id='${el.btn_id}' href='${setting.窗口聚焦?el.href:'javascript:void(0)'}' ${setting.窗口聚焦?"target = '_blank'":''}
            title='跳转到对应${el.name}'>
              <span data-tooltip-text="View on ${el.name}"><i Style="background: url(${el.icon});background-size: contain;" class="ico16" ></i></span>
           </a>
            `
            if (!setting.窗口聚焦)
                $('body').on("click", `#${el.btn_id}`, () => {
                    GM_openInTab(el.href)
                })
        })
        resolve(content)
    }).then(str_DOM => $("div.apphub_OtherSiteInfo > a:last-child").before(str_DOM))

    //sub网页
    new Promise(resolve => {
        let content2 = ''
        setting.DOM.forEach(el => {
            content2 += `
            <a class='btnv6_blue_hoverfade btn_medium es_app_btn itad_ico' id='${el.btn_id}' href='${setting.窗口聚焦?el.href:'javascript:void(0)'}' ${setting.窗口聚焦?"target = '_blank'":''}
            title='跳转到对应${el.name}'>
              <span data-tooltip-text="View on ${el.name}"><i Style="background: url(${el.icon});background-size: contain;" class="ico16" ></i>在 ${el.name} 上查看 </span>
           </a>
            `
            if (!setting.窗口聚焦)
                $('body').on("click", `#${el.btn_id}`, () => {
                    GM_openInTab(el.href)
                })
        })
        resolve(content2)
    }).then(str_DOM => $("div.share > a:last-child").after(str_DOM))
})();



