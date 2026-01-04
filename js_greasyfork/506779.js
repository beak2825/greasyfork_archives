// ==UserScript==
// @name         SteamDB Price History Enhancer
// @name:zh      SteamDB价格页面加强模块
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  优化SteamDB的价格页面，支持自定义显示部分地区的价格；手机端自动显示完整价格表格。Customize only want show regions on SteamDB price table.The full price table is automatically displayed on the mobile layout.
// @description:en  Customize only want show regions on SteamDB price table.The full price table is automatically displayed on the mobile layout.
// @description:zh  优化SteamDB的价格页面，支持自定义显示部分地区的价格；手机端自动显示完整价格表格。
// @author       ZhuSun
// @license      AGPL-3.0
// @match        https://steamdb.info/app/*
// @match        https://steamdb.info/sub/*
// @match        https://steamdb.info/bundle/*
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_removeValueChangeListener
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/506779/SteamDB%20Price%20History%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/506779/SteamDB%20Price%20History%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    .region-selector {
        display: none;
        flex-wrap: wrap;
        margin-bottom: 20px
    }

    .region-selector.shown {
        display: flex
    }

    .region-selector .btn {
        flex: 0 0 20%;
        border: 0;
        justify-content: flex-start;
    }
    #js-region-selector {
        margin-right:10px;
    }
    .panel.region-selector > .panel-heading,
    .panel.currency-selector > .panel-heading{
        width: calc(100% + 30px);
    }
    @media (max-width: 980px) {
        #js-region-selector {
            width: 100%;
            margin-right:0;
        }

        .region-selector .btn {
            flex-basis: 50%;
            padding-left: 5px;
            padding-right: 5px
        }
    }
    @media (min-width: 981px) {
        .prices-header>div {
            align-self: center;
        }
    }
    `);

    const prices_header = document.querySelector("#prices > div.prices-header");
    const prices_div = document.querySelector("#prices");
    const price_table = document.querySelector('#prices > div.multiple-prices > div.table-responsive');

    // 添加自定义地区按钮
    let region_btn = document.createElement("div");
    region_btn.innerHTML = '<button class="btn btn-outline" id="js-region-selector">Set visible regions<svg width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-chevron-down" aria-hidden="true"><path d="M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0Z"></path></svg></button>';
    prices_header?.insertBefore(region_btn, document.querySelector('h2').nextSibling);

    // 添加自定义地区panel
    let selector_div = document.createElement("div");
    selector_div.className = 'region-selector panel';
    selector_div.innerHTML = '<div class="panel-heading"><span>Set visible regions</span></div><button class="btn btn-outline" data-cc="us"><img src="/static/country/us.svg" class="flag" alt="" width="18" height="18"> U.S. Dollar</button><button class="btn btn-outline" data-cc="eu"><img src="/static/country/eu.svg" class="flag" alt="" width="18" height="18"> Euro</button><button class="btn btn-outline" data-cc="ar"><img src="/static/country/ar.svg" class="flag" alt="" width="18" height="18"> LATAM - U.S. Dollar</button><button class="btn btn-outline" data-cc="au"><img src="/static/country/au.svg" class="flag" alt="" width="18" height="18"> Australian Dollar</button><button class="btn btn-outline" data-cc="br"><img src="/static/country/br.svg" class="flag" alt="" width="18" height="18"> Brazilian Real</button><button class="btn btn-outline" data-cc="uk"><img src="/static/country/uk.svg" class="flag" alt="" width="18" height="18"> British Pound</button><button class="btn btn-outline" data-cc="ca"><img src="/static/country/ca.svg" class="flag" alt="" width="18" height="18"> Canadian Dollar</button><button class="btn btn-outline" data-cc="cl"><img src="/static/country/cl.svg" class="flag" alt="" width="18" height="18"> Chilean Peso</button><button class="btn btn-outline" data-cc="cn"><img src="/static/country/cn.svg" class="flag" alt="" width="18" height="18"> Chinese Yuan</button><button class="btn btn-outline" data-cc="az"><img src="/static/country/cis.svg" class="flag" alt="" width="18" height="18"> CIS - U.S. Dollar</button><button class="btn btn-outline" data-cc="co"><img src="/static/country/co.svg" class="flag" alt="" width="18" height="18"> Colombian Peso</button><button class="btn btn-outline" data-cc="cr"><img src="/static/country/cr.svg" class="flag" alt="" width="18" height="18"> Costa Rican Colon</button><button class="btn btn-outline" data-cc="hk"><img src="/static/country/hk.svg" class="flag" alt="" width="18" height="18"> Hong Kong Dollar</button><button class="btn btn-outline" data-cc="in"><img src="/static/country/in.svg" class="flag" alt="" width="18" height="18"> Indian Rupee</button><button class="btn btn-outline" data-cc="id"><img src="/static/country/id.svg" class="flag" alt="" width="18" height="18"> Indonesian Rupiah</button><button class="btn btn-outline" data-cc="il"><img src="/static/country/il.svg" class="flag" alt="" width="18" height="18"> Israeli New Shekel</button><button class="btn btn-outline" data-cc="jp"><img src="/static/country/jp.svg" class="flag" alt="" width="18" height="18"> Japanese Yen</button><button class="btn btn-outline" data-cc="kz"><img src="/static/country/kz.svg" class="flag" alt="" width="18" height="18"> Kazakhstani Tenge</button><button class="btn btn-outline" data-cc="kw"><img src="/static/country/kw.svg" class="flag" alt="" width="18" height="18"> Kuwaiti Dinar</button><button class="btn btn-outline" data-cc="my"><img src="/static/country/my.svg" class="flag" alt="" width="18" height="18"> Malaysian Ringgit</button><button class="btn btn-outline" data-cc="mx"><img src="/static/country/mx.svg" class="flag" alt="" width="18" height="18"> Mexican Peso</button><button class="btn btn-outline" data-cc="nz"><img src="/static/country/nz.svg" class="flag" alt="" width="18" height="18"> New Zealand Dollar</button><button class="btn btn-outline" data-cc="no"><img src="/static/country/no.svg" class="flag" alt="" width="18" height="18"> Norwegian Krone</button><button class="btn btn-outline" data-cc="pe"><img src="/static/country/pe.svg" class="flag" alt="" width="18" height="18"> Peruvian Sol</button><button class="btn btn-outline" data-cc="ph"><img src="/static/country/ph.svg" class="flag" alt="" width="18" height="18"> Philippine Peso</button><button class="btn btn-outline" data-cc="pl"><img src="/static/country/pl.svg" class="flag" alt="" width="18" height="18"> Polish Zloty</button><button class="btn btn-outline" data-cc="qa"><img src="/static/country/qa.svg" class="flag" alt="" width="18" height="18"> Qatari Riyal</button><button class="btn btn-outline" data-cc="ru"><img src="/static/country/ru.svg" class="flag" alt="" width="18" height="18"> Russian Ruble</button><button class="btn btn-outline" data-cc="sa"><img src="/static/country/sa.svg" class="flag" alt="" width="18" height="18"> Saudi Riyal</button><button class="btn btn-outline" data-cc="sg"><img src="/static/country/sg.svg" class="flag" alt="" width="18" height="18"> Singapore Dollar</button><button class="btn btn-outline" data-cc="za"><img src="/static/country/za.svg" class="flag" alt="" width="18" height="18"> South African Rand</button><button class="btn btn-outline" data-cc="pk"><img src="/static/country/pk.svg" class="flag" alt="" width="18" height="18"> South Asia - USD</button><button class="btn btn-outline" data-cc="kr"><img src="/static/country/kr.svg" class="flag" alt="" width="18" height="18"> South Korean Won</button><button class="btn btn-outline" data-cc="ch"><img src="/static/country/ch.svg" class="flag" alt="" width="18" height="18"> Swiss Franc</button><button class="btn btn-outline" data-cc="tw"><img src="/static/country/tw.svg" class="flag" alt="" width="18" height="18"> Taiwan Dollar</button><button class="btn btn-outline" data-cc="th"><img src="/static/country/th.svg" class="flag" alt="" width="18" height="18"> Thai Baht</button><button class="btn btn-outline" data-cc="tr"><img src="/static/country/tr.svg" class="flag" alt="" width="18" height="18"> MENA - U.S. Dollar</button><button class="btn btn-outline" data-cc="ae"><img src="/static/country/ae.svg" class="flag" alt="" width="18" height="18"> U.A.E. Dirham</button><button class="btn btn-outline" data-cc="ua"><img src="/static/country/ua.svg" class="flag" alt="" width="18" height="18"> Ukrainian Hryvnia</button><button class="btn btn-outline" data-cc="uy"><img src="/static/country/uy.svg" class="flag" alt="" width="18" height="18"> Uruguayan Peso</button><button class="btn btn-outline" data-cc="vn"><img src="/static/country/vn.svg" class="flag" alt="" width="18" height="18"> Vietnamese Dong</button>';
    prices_div?.insertBefore(selector_div, prices_header.nextSibling);

    // 为原切换地区添加panel属性
    const currency_div = document.querySelector('#js-currency-selector');
    const region_div = document.querySelector('.region-selector');
    currency_div.className = 'currency-selector panel';
    let currency_div_heading = document.createElement("div");
    currency_div_heading.className = 'panel-heading';
    currency_div_heading.innerHTML = '<span>Set your currency</span>';
    currency_div?.insertBefore(currency_div_heading, currency_div.firstChild);

    // 添加切换panel功能
    document.querySelector('#js-region-selector').addEventListener('click', function() {
        if (currency_div.classList.contains('shown')) {
            currency_div.classList.remove('shown');
        }
        region_div.classList.toggle('shown');
    });

    document.querySelector('#js-currency-selector').addEventListener('click', function() {
        if (region_div.classList.contains('shown')) {
            region_div.classList.remove('shown');
        }
    });

    // 为每个 button 添加点击事件监听器
    const cc_btn = document.querySelector('.region-selector').querySelectorAll('button');
    cc_btn.forEach(button => {
        button.addEventListener('click', function () {
            switchVisible(button.getAttribute('data-cc'));
        });
    });

    // 初始化每个地区可见性
    price_table.querySelectorAll('[data-cc]').forEach(element => {
        init(element.getAttribute('data-cc'));
    });

    // 自动显示手机版表格
    document.getElementsByClassName("single-price-mobile")[0].remove()

    function switchVisible(cc) {
        const tr = document.querySelector('#prices > div.multiple-prices > div.table-responsive').querySelector('td[data-cc="' + cc + '"]').closest('tr');
        const cc_btn = document.querySelector('.region-selector').querySelector('button[data-cc="' + cc + '"]');
        let is_show = GM_getValue(cc);
        if (is_show == true) {
            if (tr) {
                tr.style.display = 'none';
                cc_btn.classList.add('btn-outline');
                cc_btn.classList.remove('btn-primary');
            }
        }
        else {
            if (tr) {
                tr.style.display = 'table-row';
                cc_btn.classList.remove('btn-outline');
                cc_btn.classList.add('btn-primary');
            }
        }
        is_show = !is_show;
        GM_setValue(cc, is_show)
        console.log("[switchVisible]" + cc + " is show :" + is_show);
    }
    function init(cc) {
        const tr = document.querySelector('#prices > div.multiple-prices > div.table-responsive').querySelector('td[data-cc="' + cc + '"]').closest('tr');
        const cc_btn = document.querySelector('.region-selector').querySelector('button[data-cc="' + cc + '"]');
        let is_show = GM_getValue(cc);
        if (is_show == undefined) {
            GM_setValue(cc, true);
            is_show = true;
        }
        if (is_show == true) {
            if (tr) {
                tr.style.display = 'table-row';
                cc_btn.classList.remove('btn-outline');
                cc_btn.classList.add('btn-primary');
            }
        }
        else {
            if (tr) {
                tr.style.display = 'none';
                cc_btn.classList.add('btn-outline');
                cc_btn.classList.remove('btn-primary');
            }
        }
        console.log("[init]" + cc + " is show :" + is_show);
    }
})();