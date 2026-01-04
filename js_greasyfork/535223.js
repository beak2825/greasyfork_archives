// ==UserScript==
// @name        nexus.xyz
// @namespace   Violentmonkey Scripts
// @match       https://app.nexus.xyz/*
// @grant       none
// @version     1.1
// @author      DSperson
// @description 2025/2/19 上午9:04:58
// @user_url  https://x.com/asd576895195
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/535223/nexusxyz.user.js
// @updateURL https://update.greasyfork.org/scripts/535223/nexusxyz.meta.js
// ==/UserScript==


function getElementValueByXPath(xpath, index) {
    // 使用 document.evaluate 获取元素
    const result = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    if (result.snapshotLength > index) {
       const element = result.snapshotItem(index);
       return element;
    } else {
      return null;
    }
}

function gogogo() {
  const element = getElementValueByXPath('//*[@id="connect-toggle-button"]', 1)
  if (element) {
     if (element.className === "relative w-24 h-[3.75rem] rounded-full cursor-pointer transition-colors duration-300 ease-in-out border-2 border-gray-400 bg-black") {
        element.click();
     }
  }
  const canvasElement = document.querySelector('.mapboxgl-canvas');

   // 检查元素是否存在
  if (canvasElement) {
    // 如果存在，则隐藏该元素
     canvasElement.remove();
  }

}


setTimeout(() => {

  gogogo()

}, 1000* 5)



setInterval(() => {

  gogogo()

}, 1000* 10)