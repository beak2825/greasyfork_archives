// ==UserScript==
// @name         痒痒鼠魔方 Helper.js
// @namespace    yyshub.top
// @description  直接加载 CBG 数据到痒痒鼠魔方。
// @license      GPT
// @version      2025-01-06
// @author       清明月见 & LingErEd
// @homepage     http://yyshub.top/
// @iconURL      http://yyshub.top/static/img/favicon.png
// @match        https://yys.cbg.163.com/*
// @match        http://yyshub.top/*
// @run-at       document-idle
// @require      https://update.greasyfork.org/scripts/448197/1478721/ElementGetter20.js
// @require      https://update.greasyfork.org/scripts/465643/1421695/ajaxHookerLatest.js
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/518093/%E7%97%92%E7%97%92%E9%BC%A0%E9%AD%94%E6%96%B9%20Helperjs.user.js
// @updateURL https://update.greasyfork.org/scripts/518093/%E7%97%92%E7%97%92%E9%BC%A0%E9%AD%94%E6%96%B9%20Helperjs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YYSHUB_URL = "http://yyshub.top";
    const CBG_URL = "https://yys.cbg.163.com";
    const CBG_DETAIL_URL_MATCH = "/cgi/api/get_equip_detail";
    const CBG_DESC_URL_MATCH = "/cgi/api/get_equip_desc";
    const KEY_OF_CBG_DATA = "cbg_data";

    console.log('load Tampermonkey of 痒痒鼠魔方 Helper');
    GM_setValue(KEY_OF_CBG_DATA, '');

    if (unsafeWindow.location.href.startsWith(YYSHUB_URL)) {
        console.log('load 4 YYSHub');
        GM_addValueChangeListener(KEY_OF_CBG_DATA, function(name, old_value, new_value, remote) {
            if (remote && new_value) {
                // console.log(name, old_value, new_value, remote)
                elmGetter.get('#yys4tampermonkey').then(e => {
                    console.log('# 魔方 # 加载数据')
                    e.click(new_value);
                });
            }
            GM_setValue(KEY_OF_CBG_DATA, '');
            console.log('GM_setValue reset to EMPTY success');
        })
    }

    const loadMofang = (data) => {
        if (data) {
            elmGetter.get('.site-navbar .right .navbar-menu')
                .then(navbarMenu => {
                    // 安装 CBG Helper.js 的情况下, 会重复获取御魂数据
                    // 这里做下兜底
                    if (!document.getElementById('mofang')) {
                        let b = document.createElement('a');
                        b.innerText = "# 魔方 #";
                        b.title = "如果有帮到你，可以请作者喝一杯咖啡 ☕️";
                        b.className = "navbar-menu";
                        b.id = "mofang"
                        b.style.cursor = "pointer";
                        b.style.color = "rgb(236, 209, 107)";
                        b.onclick = function() {
                            GM_setValue(KEY_OF_CBG_DATA, data) // open close
                            console.log('GM_setValue success');
                        }
                        const navbar = navbarMenu.parentElement;
                        navbar.insertBefore(b, navbar.children[0]);
                        console.log('# 魔方 # inject success')
                    }
                });
        }
    }

    if (unsafeWindow.location.href.startsWith(CBG_URL)) {
        console.log('load 4 CBG');
        ajaxHooker.hook(request => {
            let originalResponse = request.response;
            if (request.url.startsWith(CBG_DESC_URL_MATCH)) {
                request.response = res => {
                    if (res.status == 200) {
                        loadMofang(res.json)
                    }
                    // 用于兼容 CBGHelper.js from LingErEd
                    if(originalResponse) try {originalResponse.apply(this, [res]);} catch (error) {}
                };
            }
            if (request.url.startsWith(CBG_DETAIL_URL_MATCH)) {
                request.response = res => {
                    if (res.status == 200) {
                        const data = JSON.parse(res.responseText)
                        if (data?.equip?.equip_desc) {
                            loadMofang(data)
                        }
                    }
                    // 用于兼容 CBGHelper.js from LingErEd
                    if(originalResponse) try {originalResponse.apply(this, [res]);} catch (error) {}
                }
            }
        })
    }
})();