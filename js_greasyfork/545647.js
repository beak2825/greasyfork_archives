// ==UserScript==
// @name         嘉立创PCB订单高清预览
// @namespace    jlc_hd_order_image
// @version      2025-08-13
// @description  已提交厂方未发货的订单也支持查看高清图
// @author       VMatrix
// @match        https://www.jlc.com/newOrder/
// @icon         https://www.jlc.com/newOrder/pcbtitle.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545647/%E5%98%89%E7%AB%8B%E5%88%9BPCB%E8%AE%A2%E5%8D%95%E9%AB%98%E6%B8%85%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545647/%E5%98%89%E7%AB%8B%E5%88%9BPCB%E8%AE%A2%E5%8D%95%E9%AB%98%E6%B8%85%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(() => {
    let show='showOrderPic',order='orderStatus',def=Object.defineProperty;
    Object.defineProperty=(J,L,C)=>(J._isVue&&J[show]&&(!J.fn&&(J.fn=J[show]),J[show]=e=>(e[order]==4?(e[order]=5,J.fn(e),e[order]=4):J.fn(e))),def(J,L,C))
})();