// ==UserScript==
// @name        真白萌新站添加全部订阅按钮
// @description 在真白萌新站作品目录页添加全部订阅按钮，一键订阅所有章节
// @namespace   https://blog.bgme.me
// @match       *://masiro.me/admin/novelView?*
// @grant       none
// @version     1.2
// @author      bgme
// @license     AGPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/439276/%E7%9C%9F%E7%99%BD%E8%90%8C%E6%96%B0%E7%AB%99%E6%B7%BB%E5%8A%A0%E5%85%A8%E9%83%A8%E8%AE%A2%E9%98%85%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/439276/%E7%9C%9F%E7%99%BD%E8%90%8C%E6%96%B0%E7%AB%99%E6%B7%BB%E5%8A%A0%E5%85%A8%E9%83%A8%E8%AE%A2%E9%98%85%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

async function payAll() {
  const pays = Array.from(document.querySelectorAll("a.to-read")).filter(
    (a) => {
      const txt = a.querySelector("small")?.innerText.trim() ?? "";
      return txt !== "" && txt !== "已购";
    }
  );
  const pm = pays.map((a) => {
    const id = a.getAttribute("data-id");
    const cost = a.getAttribute("data-cost");
    return {
      id,
      cost,
    };
  });
  const sum = pm.reduce((s, cur) => {
    s = s + parseInt(cur.cost, 10);
    return s;
  }, 0);
  if (sum === 0) {
    alert("未发现付费章节！");
    return;
  }
  const c = confirm(`订阅全部章节需支付${sum}G`);
  if (c) {
    const token = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    for (const { id: object_id, cost } of pm) {
      await fetch("https://masiro.me/admin/pay", {
        credentials: "include",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-CSRF-TOKEN": token,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: new URLSearchParams({
          type: 2,
          object_id,
          cost,
        }).toString(),
        method: "POST",
        mode: "cors",
      })
        .then((resp) => resp.json())
        .then(console.log);
    }
    alert("已订阅全部章节！");
    window.location.reload();
  }
}

function main(ev) {
  if (ev) {
    document.removeEventListener(ev.type, main);
  }
  const btnBox = document.querySelector(".btn-box");
  const span = document.createElement("span");
  span.innerText = "全部订阅";
  span.className = "n-btn btn-read btn-font";
  span.addEventListener("click", payAll);
  const readingBtn = document.querySelector(".btn-box > input.csrf");
  btnBox.insertBefore(span, readingBtn);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}
