// ==UserScript==
// @name        DSperson humanity
// @namespace   Violentmonkey Scripts
// @match       https://testnet.humanity.org/dashboard*
// @grant       none
// @license     GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @version     1.2.1
// @author      DSperson
// @description 2024/10/15 下午9:02:54
// @downloadURL https://update.greasyfork.org/scripts/527307/DSperson%20humanity.user.js
// @updateURL https://update.greasyfork.org/scripts/527307/DSperson%20humanity.meta.js
// ==/UserScript==
console.log("开始加载");

function checkAndClickButton() {
  const buttons = Array.from(document.querySelectorAll('button'));
  const claimButton = buttons.find(btn => btn.textContent.trim() === 'Claim');

  if (claimButton) {
    console.log('找到 Claim 按钮，正在点击...');
    claimButton.click();

    const delay = Math.floor(Math.random() * 10000 + 200000); // 20~30 秒
    console.log(`将在 ${delay / 1000} 秒后再次检查`);
    setTimeout(checkAndClickButton, delay);
  } else {
    console.log('未找到 Claim 按钮，继续监听 DOM 变化...');
  }
}

// 初始检查
const delay = Math.floor(Math.random() * 10000 + 20000); // 20~30 秒
setTimeout(checkAndClickButton, delay);