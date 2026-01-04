// ==UserScript==
// @name         快速筛选下单(内部使用)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一个用于内部下单的小插件
// @author       LC-Eaker
// @match        https://tps.ybj.hunan.gov.cn/tps-local/trade/drug/plan-manage/creat-list?gCode=dTrans
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hunan.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459375/%E5%BF%AB%E9%80%9F%E7%AD%9B%E9%80%89%E4%B8%8B%E5%8D%95%28%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459375/%E5%BF%AB%E9%80%9F%E7%AD%9B%E9%80%89%E4%B8%8B%E5%8D%95%28%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%29.meta.js
// ==/UserScript==
(function() {
const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        const xhr = this;
        if(arguments[1].startsWith('/tps-local/web/trans/hosp_prod/drug/plan/query')) {
            console.log(arguments)
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
        Object.defineProperty(xhr, 'responseText', {
          get: () => {
            let result = getter.call(xhr);
              const v = JSON.parse(result)
              const list = v.data.records
              for (let i =0;i<list.length;i++) {
                  const d = list[i]
                  const delventpInfos = d.delventpInfo
                 if(delventpInfos.find(s=>s.delvEntpCode === '1527170271868358656')) {
                      d.delventpCode = '1527170271868358656'
                      d.delventpName = decodeURIComponent("%E5%9B%BD%E8%8D%AF%E6%8E%A7%E8%82%A1%E6%B0%B8%E5%B7%9E%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8") 
                 }
              }
            return JSON.stringify(v);
          }
        });
        }
      return xhrOpen.apply(xhr, arguments);
    };
})();