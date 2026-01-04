// ==UserScript==
// @name         自动勾选temu卖家中心复选框
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自动勾选所有带有 SVG 复选框图标的项目，并自动选择“店铺账户资金”支付方式；在登录页自动切换到“账号登录”选项卡。
// @author       lemon
// @match        https://seller.kuajingmaihuo.com/login*
// @match        https://seller.kuajingmaihuo.com/settle/site-main*
// @match        https://seller.kuajingmaihuo.com/sc-finance/ws/cashier*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543826/%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89temu%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%A4%8D%E9%80%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/543826/%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89temu%E5%8D%96%E5%AE%B6%E4%B8%AD%E5%BF%83%E5%A4%8D%E9%80%89%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 登录页自动切换到“账号登录”
    function switchToAccountLogin() {
        if (!location.href.includes('/login')) return;

        // 找到新的选项卡容器
        const tabContainer = document.querySelector('div.password-login_tabItem__HmZ7F')?.parentElement;
        if (!tabContainer) return;

        const accountTab = Array.from(tabContainer.querySelectorAll('div.password-login_tabItem__HmZ7F'))
        .find(div => div.innerText.includes('账号登录'));

        // 如果存在“账号登录”标签，就直接点击
        if (accountTab) {
            accountTab.click();
            console.log('已切换到新版“账号登录”');
        }
    }

    // 自动勾选所有复选框
    function clickAllCheckboxes() {
        const svgList = document.querySelectorAll('svg[data-testid="beast-core-icon-check"]');
        svgList.forEach(svg => {
            const clickable = svg.closest('div, label, button');
            if (clickable && !clickable.dataset.checked) {
                clickable.click();
                clickable.dataset.checked = 'true';
                console.log('已点击一个复选框');
            }
        });
    }

    // 自动选择“店铺账户资金”
    function chooseShopAccountFund() {
        const modal = document.querySelector('div[data-testid="beast-core-modal-inner"]');
        if (!modal) return;

        const labels = modal.querySelectorAll('label[data-testid="beast-core-radio"]');
        labels.forEach(label => {
            if (label.innerText.includes('店铺账户资金') && label.getAttribute('data-checked') !== 'true') {
                label.click();
                console.log('已选择“店铺账户资金”');
            }
        });
    }

    // 监听DOM变化
    const observer = new MutationObserver(() => {
        switchToAccountLogin();
        clickAllCheckboxes();
        chooseShopAccountFund();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行一次
    switchToAccountLogin();
    clickAllCheckboxes();
    chooseShopAccountFund();
})();
