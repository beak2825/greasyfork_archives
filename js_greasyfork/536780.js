// ==UserScript==

// @name         青蛙PT一键认领
// @namespace    https://www.qingwapt.com/
// @version      1.0
// @description  一键认领青蛙PT站点的所有当前做种种子
// @author       zzvdl
// @match        https://www.qingwapt.com/userdetails.php?id=*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536780/%E9%9D%92%E8%9B%99PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536780/%E9%9D%92%E8%9B%99PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    siteName: '青蛙PT',
    maxClaim: 1000,
    buttonText: '一键认领',
    insertKeyword: '当前做种',
    fetchSelector: 'button[data-action="addClaim"]',
    claimUrl: '/ajax.php',
    postDataTemplate: (id) => `action=addClaim&params%5Btorrent_id%5D=${id}`,
    successCheck: (responseText) => responseText.includes("success") || responseText.includes("认领成功")
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 function waitForSeedingTableAndInsertButton() {
  const target = document.getElementById("ka1"); // seeding 的div
  if (target && target.querySelector("table")) {
    if (!document.getElementById("claimAllTorrents")) {
      const btn = document.createElement("a");
      btn.id = "claimAllTorrents";
      btn.href = "javascript:void(0);";
      btn.innerText = CONFIG.buttonText;
      btn.style = "margin-left:10px;font-weight:bold;color:red";
      btn.title = "认领全部当前做种（运行后请耐心等待）";
      btn.onclick = unsafeWindow.manualClaimTorrents;
      target.prepend(btn);// 插入在ka1顶部
    }
  } else {
    // 如果表格还没加载出来，500ms 后再检查一次
    setTimeout(waitForSeedingTableAndInsertButton, 500);
  }
}

// 原来的 window.onload 替换为这个：
waitForSeedingTableAndInsertButton();


  unsafeWindow.manualClaimTorrents = async function () {
    const list = Array.from(document.querySelectorAll(CONFIG.fetchSelector)).filter(el => el.style.display !== 'none');
    if (list.length === 0) {
      alert('未检测到可认领的种子，请确认是否在“当前做种”页面且尚有未认领种子。');
      return;
    }

    if (!confirm(`是否认领 ${CONFIG.siteName} 上的全部种子？\n最多认领 ${CONFIG.maxClaim} 个，运行期间请勿重复点击。`)) return;

    let total = 0, success = 0;

    for (let el of list) {
      if (success >= CONFIG.maxClaim) {
        alert(`达到最大认领数量上限：${CONFIG.maxClaim} 个`);
        break;
      }

      total += 1;
      const claimId = el.dataset.torrent_id;

        try {
            await fetch(CONFIG.claimUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: CONFIG.postDataTemplate(claimId)
            });

            el.style.background = 'lightgreen';
            el.innerText = '成功';
            success += 1;

        } catch (e) {
            el.style.background = 'orange';
            el.innerText = '异常';
            console.error(e);
        }


      await sleep(300); // 节流，防止频率过高被封
    }

    alert(`认领完成：共识别 ${total} 个种子，成功认领 ${success} 个。`);
  };

})();
