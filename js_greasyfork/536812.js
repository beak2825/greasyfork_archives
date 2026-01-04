// ==UserScript==
// @name         多站通用PT一键认领（自动提取种子ID）
// @namespace    https://www.qingwapt.com
// @version      2.1
// @description  自动认领当前做种的种子，支持青蛙PT、UBits 和 HDtime等，通过解析页面提取种子ID，无需依赖原页面按钮结构。
// @author       zzvdl
// @match        https://www.qingwapt.com/userdetails.php?id=*
// @match        https://ubits.club/userdetails.php?id=*
// @match        https://hdtime.org/userdetails.php?id=*
// @match        https://pt.btschool.club/userdetails.php?id=*
// @match        https://carpt.net/userdetails.php?id=*
// @match        https://pthome.net/userdetails.php?id=*
// @match        https://rousi.zip/userdetails.php?id=*
// @match        https://zmpt.cc/userdetails.php?id=*
// @match        https://pt.0ff.cc/userdetails.php?id=*
// @match        https://springsunday.net/userdetails.php?id=*
// @match        https://audiences.me/userdetails.php?id=*
// @match        https://nanyangpt.com/userdetails.php?id=*
// @match        https://bilibili.download/userdetails.php?id=*
// @match        https://nanyangpt.com/userdetails.php?id=*
// @match        https://discfan.net/userdetails.php?id=*
// @match        https://www.hxpt.org/userdetails.php?id=*
// @match        https://www.ptskit.org/userdetails.php?id=*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingwapt.com
// @license      MIT
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536812/%E5%A4%9A%E7%AB%99%E9%80%9A%E7%94%A8PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86%EF%BC%88%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E7%A7%8D%E5%AD%90ID%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536812/%E5%A4%9A%E7%AB%99%E9%80%9A%E7%94%A8PT%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86%EF%BC%88%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E7%A7%8D%E5%AD%90ID%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HOST_CONFIG = {
      "nanyangpt.com": {
      name: "南洋pt",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
       "springsunday.net": {
      name: "ssd",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "www.qingwapt.com": {
      name: "青蛙PT",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "rousi.zip": {
      name: "rousi",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "zmpt.cc": {
      name: "织梦PT",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "pt.0ff.cc": {
      name: "自由农场",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "audiences.me": {
      name: "renren",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "pthome.net": {
      name: "铂金家",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "carpt.net": {
      name: "车站",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
      "pt.btschool.club": {
      name: "比特学校",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "ubits.club": {
      name: "UBits",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "hdtime.org": {
      name: "高清时间",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "bilibili.download": {
      name: "railgunpt",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "www.ptskit.org": {
      name: "ptskit",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "discfan.net": {
      name: "碟粉",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    },
    "www.hxpt.org": {
      name: "好学",
      claimUrl: "/ajax.php",
      postData: id => `action=addClaim&params%5Btorrent_id%5D=${id}`,
      rowSelector: "#ka1 table tbody tr",
      idExtractor: row => row.querySelector("a[href*='details.php?id=']")?.href?.match(/id=(\d+)/)?.[1],
      insertTarget: () => document.getElementById("ka1"),
    }
  };

  const host = location.hostname;
  const CONFIG = HOST_CONFIG[host];
  if (!CONFIG) return;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function insertButton() {
    const container = CONFIG.insertTarget();
    if (container && !document.getElementById("claimAllTorrents")) {
      const btn = document.createElement("a");
      btn.id = "claimAllTorrents";
      btn.href = "javascript:void(0);";
      btn.innerText = "一键认领";
      btn.style = "margin-left:10px;font-weight:bold;color:red";
      btn.title = `认领全部当前做种（${CONFIG.name}）`;
      btn.addEventListener('click', manualClaimTorrents);
      container.prepend(btn);
    }
  }

  function waitForReady() {
    if (document.querySelector(CONFIG.rowSelector)) {
      insertButton();
    } else {
      setTimeout(waitForReady, 500);
    }
  }

  async function manualClaimTorrents() {
    const rows = Array.from(document.querySelectorAll(CONFIG.rowSelector));
    const ids = rows.map(CONFIG.idExtractor).filter(id => !!id);

    if (ids.length === 0) {
      alert("未检测到可认领的种子，请确认是否在“当前做种”页面");
      return;
    }

    if (!confirm(`是否认领 ${CONFIG.name} 上的全部种子？\n共 ${ids.length} 个，过程请勿重复点击。`)) return;

    let total = 0, success = 0;

    for (const id of ids) {
      total++;
      try {
        await fetch(CONFIG.claimUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: CONFIG.postData(id)
        });
        success++;
      } catch (e) {
        console.error("认领失败：", e);
      }
      await sleep(300);
    }

    alert(`认领完成：共识别 ${total} 个种子，成功认领 ${success} 个。`);
  }

  waitForReady();
})();