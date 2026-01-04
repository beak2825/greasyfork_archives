// ==UserScript==
// @name         百度文库净化·解禁继续阅读·开启 VIP
// @version      0.12
// @description  解除继续阅读限制，净化弹窗、广告，开启百度文库本地 VIP，完全适配移动端如 Kiwi 等浏览器
// @author       Hyun
// @license      MIT
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/718868
// @downloadURL https://update.greasyfork.org/scripts/449702/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%C2%B7%E8%A7%A3%E7%A6%81%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB%C2%B7%E5%BC%80%E5%90%AF%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/449702/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%87%80%E5%8C%96%C2%B7%E8%A7%A3%E7%A6%81%E7%BB%A7%E7%BB%AD%E9%98%85%E8%AF%BB%C2%B7%E5%BC%80%E5%90%AF%20VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pageData, pureViewPageData;
    Object.defineProperty(unsafeWindow, 'pageData', {
      set: v=>pageData = v,
      get() {
        if(!pageData) return pageData;

        // 启用 VIP
        pageData.vipInfo.global_svip_status = 1;
        pageData.vipInfo.global_vip_status = 1;
        pageData.vipInfo.isVip = 1;
        pageData.vipInfo.isWenkuVip = 1;

        if('appUniv' in pageData) {
          // 取消百度文库对谷歌、搜狗浏览器 referrer 的屏蔽
          pageData.appUniv.blackBrowser = [];

          // 隐藏 APP 下载按钮
          pageData.viewBiz.docInfo.needHideDownload = true;
        }

        return pageData
      }
    })
    Object.defineProperty(unsafeWindow, 'pureViewPageData', {
      set: v=>pureViewPageData = v,
      get() {
        if(!pureViewPageData) return pureViewPageData;

        // 去除水印，允许继续阅读
        pureViewPageData.customParam.noWaterMark = 1;
        pureViewPageData.customParam.visibleFoldPage = 1;
        pureViewPageData.readerInfo2019.freePage = pureViewPageData.readerInfo2019.page;

        return pureViewPageData
      }
    })

    // 注册个 MutationObserver，根治各种垃圾弹窗
    let count = 0;
    const blackListSelector = [
      '.vip-pay-pop-v2-wrap',
      '.reader-pop-manager-view-containter',
      '.fc-ad-contain',
      '.shops-hot',
      '.video-rec-wrap',
      '.pay-doc-marquee',
      '.card-vip',
      '.vip-privilege-card-wrap',
      '.doc-price-voucher-wrap',
      '.vip-activity-wrap-new',
      '.creader-root .hx-warp',
      '.hx-recom-wrapper',
      '.hx-bottom-wrapper',
      '.hx-right-wrapper.sider-edge'
    ]

    const killTarget = (item)=>{
      if(item.nodeType !== Node.ELEMENT_NODE) return false;
      let el = item;
      if(blackListSelector.some(i=>(item.matches(i) || (el=item.querySelector(i)))))
        el?.remove(), count ++;
      return true
    }
    const observer = new MutationObserver((mutationsList)=> {
      for(let mutation of mutationsList) {
        killTarget(mutation.target)
        for (const item of mutation.addedNodes) {
          killTarget(item)
        }
      }
  });
  observer.observe(document, { childList: true, subtree: true });
  window.addEventListener ("load", ()=>{
    console.log(`[-] 文库净化：共清理掉 ${count} 个弹窗~`);
  });
})();
