// ==UserScript==
// @name         ebay信息替换
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  修改页面昵称显示
// @author       rabbit9607
// @match        https://www.ebay.com/*
// @match        https://signin.ebay.com/*
// @match        https://accounts.ebay.com/*
// @match        https://accountsettings.ebay.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542547/ebay%E4%BF%A1%E6%81%AF%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/542547/ebay%E4%BF%A1%E6%81%AF%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

// 隐藏
if (document.readyState !== 'loading') {
    document.documentElement.style.cssText = 'opacity: 0 !important; transition: opacity 0.01s !important;';
}

(function () {
    'use strict';

    // 立即隐藏页面的多种方式
    const methods = [
        () => {
            if (document.documentElement) {
                document.documentElement.style.opacity = '0';
                document.documentElement.style.visibility = 'hidden';
            }
        },
        () => {
            if (document.body) {
                document.body.style.opacity = '0';
                document.body.style.visibility = 'hidden';
            }
        }
    ];

    methods.forEach(method => {
        try { method(); } catch (e) { }
    });

    // 把setInterval修改成requestAnimationFrame
    function loop() {
        // 获取第一个昵称元素并修改
        const name1 = document.querySelector('.gh-identity__greeting span:first-child');
        if (name1) {
            name1.innerHTML = '这是我修改后的昵称1';
        }
        // 获取第二个昵称元素并修改
        const name2 = document.querySelector('.gh-identity-signed-in__main-content div:nth-child(2) span:first-child');
        if (name2) {
            name2.innerHTML = '这是我修改后的昵称2';
        }
        // 邮箱 id为user-info
        const email = document.getElementById('user-info');
        if (email) {
            email.innerHTML = '这是我修改后的邮箱';
        }

        // 用户名 id = dispay_username
        const username = document.getElementById('dispay_username');
        if (username) {
            username.innerHTML = '这是我修改后的用户名';
        }

        // 帐户类型 id = business_display_account_type
        const accountType = document.getElementById('business_display_account_type');
        if (accountType) {
            accountType.innerHTML = '这是我修改后的帐户类型';
        }

        // 电子邮件地址 是所有id=contact_info_display的第一个元素
        const emailAddress = document.querySelectorAll('#contact_info_display')[0];
        if (emailAddress) {
            emailAddress.innerHTML = '这是我修改后的电子邮件地址';
        }
        // 电话号码 是所有id=contact_info_display的第二个元素
        const phoneNumber = document.querySelectorAll('#contact_info_display')[1];
        if (phoneNumber) {
            phoneNumber.innerHTML = '这是我修改后的电话号码';
        }

        // 公司名称 是所有id=business_name_value的第一个元素
        const companyName = document.querySelectorAll('#business_name_value')[0];
        if (companyName) {
            companyName.innerHTML = '这是我修改后的公司名称';
        }
        // 公司地址简称 是所有id=business_name_value的第二个元素
        const companyAddress = document.querySelectorAll('#business_name_value')[1];
        if (companyAddress) {
            companyAddress.innerHTML = '这是我修改后的公司地址简称';
        }
        // 公司类型 是id=business_entity_type_value下面的第一个span
        const companyType = document.getElementById('business_entity_type_value')?.querySelector('span:first-child');
        if (companyType) {
            companyType.innerHTML = '这是我修改后的公司类型';
        }
        // 统一社会信用代码 是id=business_id_value下面的第一个span
        const companyCode = document.getElementById('business_id_value')?.querySelector('span:first-child');
        if (companyCode) {
            companyCode.innerHTML = '这是我修改后的统一社会信用代码';
        }
        // 注册日期 是id=country_and_dor_value下面的第一个span
        const companyDate = document.getElementById('country_and_dor_value')?.querySelector('span:first-child');
        if (companyDate) {
            companyDate.innerHTML = '这是我修改后的注册日期';
        }
        // 商号 (DBA) - 可选 是id=business_dba_value下面的第一个span
        const companyDba = document.getElementById('business_dba_value')?.querySelector('span:first-child');
        if (companyDba) {
            companyDba.innerHTML = '这是我修改后的商号 (DBA) - 可选';
        }

        // 地址详细信息id=businessAddressView_address_display_line1
        const addressDetail = document.getElementById('businessAddressView_address_display_line1');
        if (addressDetail) {
            addressDetail.innerHTML = '这是我修改后的地址详细信息';
        }
        // 城市id=businessAddressView_address_display_city
        const city = document.getElementById('businessAddressView_address_display_city');
        if (city) {
            city.innerHTML = '这是我修改后的城市, ';
        }
        // 州/省/自治区/直辖市id=businessAddressView_address_display_state
        const state = document.getElementById('businessAddressView_address_display_state');
        if (state) {
            state.innerHTML = '这是我修改后的州/省/自治区/直辖市, ';
        }
        // 邮政编码id=businessAddressView_address_display_postal_code
        const postalCode = document.getElementById('businessAddressView_address_display_postal_code');
        if (postalCode) {
            postalCode.innerHTML = '这是我修改后的邮政编码';
        }
        // 国家/地区id=businessAddressView_address_display_country
        const country = document.getElementById('businessAddressView_address_display_country');
        if (country) {
            country.innerHTML = '这是我修改后的国家/地区';
        }

        // 地址详细信息（中文）localBusinessAddressView_address_display_line1
        const addressDetailCn = document.getElementById('localBusinessAddressView_address_display_line1');
        if (addressDetailCn) {
            addressDetailCn.innerHTML = '这是我修改后的地址详细信息（中文）';
        }
        // 城市（中文）localBusinessAddressView_address_display_city
        const cityCn = document.getElementById('localBusinessAddressView_address_display_city');
        if (cityCn) {
            cityCn.innerHTML = '这是我修改后的城市（中文）, ';
        }
        // 州/省/自治区/直辖市（中文）localBusinessAddressView_address_display_state
        const stateCn = document.getElementById('localBusinessAddressView_address_display_state');
        if (stateCn) {
            stateCn.innerHTML = '这是我修改后的州/省/自治区/直辖市（中文）, ';
        }
        // 邮政编码（中文）localBusinessAddressView_address_display_postal_code
        const postalCodeCn = document.getElementById('localBusinessAddressView_address_display_postal_code');
        if (postalCodeCn) {
            postalCodeCn.innerHTML = '这是我修改后的邮政编码（中文）';
        }
        // 国家/地区（中文）localBusinessAddressView_address_display_country
        const countryCn = document.getElementById('localBusinessAddressView_address_display_country');
        if (countryCn) {
            countryCn.innerHTML = '这是我修改后的国家/地区（中文）';
        }

        // Lucid 编号是所有id=business_id_value的第二个元素
        const lucidNumber = document.querySelectorAll('#business_id_value')[1];
        if (lucidNumber) {
            lucidNumber.innerHTML = '这是我修改后的Lucid 编号';
        }
        // WEEE 编号是所有id=business_id_value的第三个元素
        const weeeNumber = document.querySelectorAll('#business_id_value')[2];
        if (weeeNumber) {
            weeeNumber.innerHTML = '这是我修改后的WEEE 编号';
        }
        // EPR FR 编号是id=business_epr_id_list
        const eprFrNumber = document.getElementById('business_epr_id_list');
        if (eprFrNumber) {
            eprFrNumber.innerHTML = '这是我修改后的EPR FR 编号';
        }

        // 利益方名称
        // 用户英文名所有class=bizowner__name的第一个元素
        const userName = document.querySelectorAll('.bizowner__name')[0];
        if (userName) {
            userName.innerHTML = '这是我修改后的用户英文名';
        }
        // 用户中文名所有class=bizowner__name的第二个元素
        const userNameCn = document.querySelectorAll('.bizowner__name')?.[1];
        if (userNameCn) {
            userNameCn.innerHTML = '这是我修改后的用户中文名';
        }

        // 递归调用，实现持续循环
        requestAnimationFrame(loop);
    }
    // 启动循环
    requestAnimationFrame(loop);

    setTimeout(() => {
        if (document.documentElement) {
            document.documentElement.style.opacity = '1';
            document.documentElement.style.visibility = 'visible';
            document.documentElement.style.cssText = 'opacity: 1 !important; visibility: visible !important;';
        }
        if (document.body) {
            document.body.style.opacity = '1';
            document.body.style.visibility = 'visible';
            document.body.style.cssText = 'opacity: 1 !important; visibility: visible !important;';
        }
    }, 50);

})();


