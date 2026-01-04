// ==UserScript==
// @name         花瓣网搜索页屏蔽会员素材
// @namespace    /
// @version      1.0
// @description  在花瓣网搜索内容时，可以屏蔽来自“花瓣素材”的信息。
// @author       寒隙
// @match        https://huaban.com/search?*
// @icon         https://huaban.com/img/touch-icon-iphone-retina.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526057/%E8%8A%B1%E7%93%A3%E7%BD%91%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD%E4%BC%9A%E5%91%98%E7%B4%A0%E6%9D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/526057/%E8%8A%B1%E7%93%A3%E7%BD%91%E6%90%9C%E7%B4%A2%E9%A1%B5%E5%B1%8F%E8%94%BD%E4%BC%9A%E5%91%98%E7%B4%A0%E6%9D%90.meta.js
// ==/UserScript==
 
function deleteElements() {
  const elements = document.querySelectorAll('[data-content-type="素材采集"]');
  elements.forEach(element => {
    // 选择父级的父级 div
    const parentParentDiv = element.parentElement?.parentElement;
    if (parentParentDiv && parentParentDiv.tagName === 'DIV') {
        console.log(parentParentDiv); parentParentDiv.remove();
    }
  });
}
setInterval(deleteElements, 1000);