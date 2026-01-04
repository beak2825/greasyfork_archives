// ==UserScript==
// @name        orochi.network
// @namespace   Violentmonkey Scripts
// @match       https://onprover.orochi.network/*
// @grant       none
// @version     1.0
// @author      DSperson
// @description 5/7/2025, 8:29:35 PM
// @user_url  https://x.com/asd576895195
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/535239/orochinetwork.user.js
// @updateURL https://update.greasyfork.org/scripts/535239/orochinetwork.meta.js
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

setInterval(() => {

  const gg = getElementValueByXPath('//*[@id="root"]/div/div/div[2]/main/div/div/div[1]/div[1]/div[2]/button/span/div', 0)
  if (gg === null) {
      const bt = getElementValueByXPath('//*[@id="root"]/div/div/div[2]/main/div/div/div[1]/div[1]/div[2]/button', 0)	
      if (bt) {
	 bt.click()
      }
   }
}, 1000* 10)