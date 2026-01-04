// ==UserScript==
// @name         复制天眼查和国家企业信息公示系统企业信息
// @namespace    http://www.patenthomes.com
// @version      0.2
// @description  在天眼查网站和国家企业信用信息公示系统的网页上增加复制企业信息的按钮，以方便地复制这些信息到剪贴板
// @author       北溟之鲲
// @match        *://www.tianyancha.com/company/*
// @match        *://*.gsxt.gov.cn/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490250/%E5%A4%8D%E5%88%B6%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%92%8C%E5%9B%BD%E5%AE%B6%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E5%85%AC%E7%A4%BA%E7%B3%BB%E7%BB%9F%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490250/%E5%A4%8D%E5%88%B6%E5%A4%A9%E7%9C%BC%E6%9F%A5%E5%92%8C%E5%9B%BD%E5%AE%B6%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF%E5%85%AC%E7%A4%BA%E7%B3%BB%E7%BB%9F%E4%BC%81%E4%B8%9A%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义选择器
    const currentDomain = window.location.hostname;
    var selectorName;
    var selectorDaima;
    var selectorDizhi;
    if(currentDomain.includes('tianyancha.com')) {
        selectorName = document.querySelector('#page-root > div.page-container.relative > div > div.layout_company-header__C4hcj > div.layout_company-header-main__nuikF > div.layout_company-header-right__oIUZw > div.index_company-header-content__Ayzr2 > div.index_header-top__JbFpN > div.index_header-top-content__Xt_KQ > div.index_header-wrap__YwG4E > div.index_header__uN4nR > h1').textContent;
        selectorDaima = document.querySelector('#page-root > div.page-container.relative > div > div.layout_company-header__C4hcj > div.layout_company-header-main__nuikF > div.layout_company-header-right__oIUZw > div.index_company-header-content__Ayzr2 > div.index_detail__JSmQM > div.index_detail-content__RCnTr > div.detail-item.index_detail-item-first__IS2_h > div:nth-child(1) > div > span').textContent;
        selectorDizhi = document.querySelector('#page-root > div.page-container.relative > div > div.layout_company-header__C4hcj > div.layout_company-header-main__nuikF > div.layout_company-header-right__oIUZw > div.index_company-header-content__Ayzr2 > div.index_detail__JSmQM > div.index_detail-content__RCnTr > div.detail-item.index_detail-item-second__0_Da1 > div:nth-child(4) > div > span.index_copy-text__ri7W6.index_detail-address-moretext__9R_Z1').textContent;
    } else {
        selectorName = document.querySelector('body > div.container > div.container1 > div.result > div.page > div.nameBox.clearfix > div.companyDetail.clearfix > div > h1').textContent.replace(/[\r\n\s\u00a0]/g, '');
        selectorDaima = document.querySelector('body > div.container > div.container1 > div.result > div.page > div.nameBox.clearfix > div.companyDetail.clearfix > span:nth-child(2) > span').textContent;
        selectorDizhi = document.querySelector('#primaryInfo > div > div.overview > dl:nth-child(9) > dd').textContent;
    }
    // 创建按钮
    const copyNameButton = document.createElement('button');
    copyNameButton.textContent = '复制企业名称';
    copyNameButton.style.position = 'fixed';
    copyNameButton.style.top = '85px';
    copyNameButton.style.right = '10px';
    copyNameButton.style.zIndex = '9999';
    copyNameButton.style.backgroundColor = '#4CAF50';
    copyNameButton.style.border = '1px solid blue';
    copyNameButton.style.color = 'white';
    copyNameButton.style.padding = '1px 5px 1px 5px';

    const copyDaimaButton = document.createElement('button');
    copyDaimaButton.textContent = '复制信用代码';
    copyDaimaButton.style.position = 'fixed';
    copyDaimaButton.style.top = '110px';
    copyDaimaButton.style.right = '10px';
    copyDaimaButton.style.zIndex = '9999';
    copyDaimaButton.style.backgroundColor = '#4CAF50';
    copyDaimaButton.style.border = '1px solid blue';
    copyDaimaButton.style.color = 'white';
    copyDaimaButton.style.padding = '1px 5px 1px 5px';

    const copyDizhiButton = document.createElement('button');
    copyDizhiButton.textContent = '复制企业地址';
    copyDizhiButton.style.position = 'fixed';
    copyDizhiButton.style.top = '135px';
    copyDizhiButton.style.right = '10px';
    copyDizhiButton.style.zIndex = '9999';
    copyDizhiButton.style.backgroundColor = '#4CAF50';
    copyDizhiButton.style.border = '1px solid blue';
    copyDizhiButton.style.color = 'white';
    copyDizhiButton.style.padding = '1px 5px 1px 5px';

    // Add an event listener to the button
    copyNameButton.addEventListener('click', () => {
        GM_setClipboard(selectorName);
    });
    // Add an event listener to the button
    copyDaimaButton.addEventListener('click', () => {
        GM_setClipboard(selectorDaima);
    });
    // Add an event listener to the button
    copyDizhiButton.addEventListener('click', () => {
        GM_setClipboard(selectorDizhi);
    });

    // Append the button to the body
    document.body.appendChild(copyNameButton);
    document.body.appendChild(copyDaimaButton);
    document.body.appendChild(copyDizhiButton);
})();