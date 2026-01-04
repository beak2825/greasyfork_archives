// ==UserScript==
// @name         PTLSP Batch Claim
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  PTLSP批量认领脚本
// @author       CosmoGao, COLA7704
// @match        https://*.ptlsp.com/special.php*
// @match        https://*.ptlsp.com/torrents.php*
// @match        https://*.ptlsp.com/userdetails.php*
// @match        https://*.ptlsp.com/claim.php*
// @icon         https://ptlsp.com/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/xtiper@2.7.0/xtiper.lite.js
// @resource     IMPORTED_CSS https://s3-sg.leaves.red/43014140289a4509bd21a5fd7b0b9330:red/js/xtiper_.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478217/PTLSP%20Batch%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/478217/PTLSP%20Batch%20Claim.meta.js
// ==/UserScript==

/**
 * 改自红叶一键认领 v0.4.3, 原网址: https://greasyfork.org/zh-CN/scripts/454732-red-leaves-batch-claim
 * 感谢 Rey @ RedLeaves !
 */

(async function () {
  "use strict";
  let url = window.location.href;
  console.log(url);
  let btn = `<input class="btn" type="button" value="批量认领" id="_lsp_auto_claim" style="margin-left:8px;margin-right:4px;"/>`;
  if (url.includes("torrents") || url.includes("special")) {
    let td = document.querySelector(".btn[type=submit]").parentElement;
    if (td) {
      td.innerHTML = btn + td.innerHTML;
    }
  } else if (url.includes("user")) {
    let td = Array.from(document.querySelectorAll(".rowhead")).find(
      (el) => el.textContent === "当前做种"
    );
    if (td) {
      td.innerHTML += btn;
    }
    let table = td.parentElement.parentElement;
    let newTR = document.createElement('tr');
    newTR.innerHTML = `<td width="1%" class="rowhead nowrap" valign="top" align="right">批量认领脚本</td><td><input class="btn" type="button" value="认领此账号所有做种的种子" id="_lsp_claim_all" style="margin-left:16px;margin-right:4px;transform:scale(1.2);"/></td>`;
    table.append(newTR);
  } else if (url.includes("claim")) {
    btn = `<input class="btn" type="button" value="批量取消认领" id="_lsp_auto_claim" style="margin-top:1em;margin-bottom:1em;transform:scale(1.2);"/>`;
    let span = document.createElement("div");
    let td = document.querySelector("h1").append(span);
    if (span) {
      span.innerHTML = btn;
    }

    console.log("PTLSP batch remove claim injected");
  }
  let claim_btn = document.querySelector("#_lsp_auto_claim");
  let claim_all_btn = document.querySelector("#_lsp_claim_all");
  if (claim_btn) claim_btn.onclick = claimCurrentPage;
  if (claim_all_btn) claim_all_btn.onclick = claimAll;
  const css = GM_getResourceText("IMPORTED_CSS");
  GM_addStyle(css);

  // Your code here...
})();
let timeout = 0;
function claimTorrent(torrent_id) {
  timeout += 300;
  console.log(`timeout = ${timeout}`);
  return new Promise((resolve, reject) => {
    let data = {
      action: "addClaim",
      "params[torrent_id]": torrent_id,
    };
    let s = new URLSearchParams(Object.entries(data)).toString();
    setTimeout(() => {
      GM_xmlhttpRequest({
        url: `/ajax.php`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;",
        },
        data: s,
        method: "post",
        onload: (res) => {
          if (res.status == 200) {
            resolve(JSON.parse(res.response));
          }
          reject();
        },
        onerror: () => {
          reject();
        },
      });
    }, timeout);
  });
}
function claimAll() {
  xtip.confirm(
    `你确定要认领你所有做种的种子吗？<br><br><font color="red"><b>这可能会对站点造成压力<br>请不要频繁使用该功能！</b></font>`,
    {
      title: "PTLSP 批量认领",
      icon: "a",
      btn: ["确定", "取消"],
      btn1: async () => {
        let page = 0;
        let loadid = xtip.load(
          `<style>textarea::-webkit-scrollbar {
    width: 4px;
}
textarea::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0,0,0,0.2);
}
textarea::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0,0,0,0.1);
}</style><p id="_lsp_label" style="margin-top:10px;color:black;font-weight:bold;font-size:1.3em;text-shadow:0px 2px 5px rgba(255,255,255,0.6);">正在认领 第1页...</p><textarea style="padding: 10px;
    overflow-y: scroll;
    width: 257px;
    color: red;
    height: 80px;
    margin-top: 1em;background:rgab(255,255,255,0.38);box-shadow:2px 2px 6px rgba(0,0,0,0.3);border-radius:6px;border:none;" id="_lsp_res"></textarea>`,
          { lock: true }
        );
        const sleep = (delay) =>
          new Promise((resolve) => setTimeout(resolve, delay));
        let msg = ``;
        let total = 0;
        let userid = window.location.href.match(/id=(\d+)/)[1];
        let s = 0,
          f = 0;
        let a = document.querySelector("#_lsp_res");
        while (true) {
          let i = 0;
          timeout = 0;
          var res = await fetch(
            `https://ptlsp.com/getusertorrentlistajax.php?userid=${userid}&type=seeding&page=${page}`
          );
          res = await res.text();
          var torrents_link = res
            .match(/details\.php\?id=\d+/g)
            .map((a) => a.split("=")[1]);
          var all_count = parseInt(res.match(/<b>(\d+)<\/b>/)[1]);
          for (let t of torrents_link) {
            claimTorrent(t).then((res) => {
              if (res.ret !== 0) {
                msg += `\n种子 ${t} 失败，原因：${res.msg}`;
                f++;
              } else {
                msg += `\n种子 ${t} 认领成功`;
                s++;
              }
              total++;

              a.value = msg;
              a.scrollTo(0, a.scrollHeight);
              i++;
              document.querySelector("#_lsp_label").innerText = `正在认领...第${
                page + 1
              }页 [${i}/${torrents_link.length}]`;
            });
          }
          while (true) {
            await sleep(1000);
            if (i == torrents_link.length) break;
            console.log(i, torrents_link.length);
          }
          page++;
          if (total >= all_count) break;
        }
        xtip.alert(
          `批量认领执行完毕！<br><br>共处理${total}个种子<br><i>成功${s}个种子，失败${f}个种子</i><br>`,
          "s"
        );
        xtip.close(loadid);
      },
    }
  );
}
function removeClaim(claim_id) {
  timeout += 500;
  return new Promise((resolve, reject) => {
    let data = {
      action: "removeClaim",
      "params[id]": claim_id,
    };
    let s = new URLSearchParams(Object.entries(data)).toString();
    setTimeout(() => {
      GM_xmlhttpRequest({
        url: `/ajax.php`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;",
        },
        data: s,
        method: "post",
        onload: (res) => {
          if (res.status == 200) {
            resolve(JSON.parse(res.response));
          }
          reject();
        },
        onerror: () => {
          reject();
        },
      });
    }, timeout);
  });
}
async function claimCurrentPage() {
  const url = window.location.href;
  timeout = 0;
  let torrents_link,
    claims_id,
    is_remove = false;
  if (url.includes("torrents") || url.includes("special")) {
    torrents_link = document.querySelectorAll(
      ".torrentname td.embedded:nth-child(2) a"
    );
  } else if (url.includes("user")) {
    torrents_link = document.querySelectorAll("button[data-action='addClaim']");
    if (!torrents_link || torrents_link.length === 0) {
      return xtip.alert("请先展开做种列表，再点击本脚本~", { icon: "e" });
    }
  } else {
    is_remove = true;
    torrents_link = document.querySelectorAll(
      "#claim-table tr:not(:first-child) td:nth-child(3) a"
    );
    claims_id = document.querySelectorAll(
      "#claim-table tr:not(:first-child) td:nth-child(1)"
    );
  }
  if (!torrents_link || torrents_link.length == 0) {
    return xtip.alert("没有找到种子列表~", { icon: "e" });
  }
  xtip.confirm(
    `确定${is_remove ? "取消" : ""}认领本页 ${torrents_link.length} 个种子吗？`,
    {
      title: "PTLSP 批量认领",
      icon: "a",
      btn: ["确定", "取消"],
      btn1: async () => {
        let loadid = xtip.load(
          `<p id="_lsp_label" style="margin-top:10px;color:black;font-weight:bold;font-size:1.3em;text-shadow:0px 2px 5px rgba(255,255,255,0.6);">正在${
            is_remove ? "取消" : ""
          }认领...</p>`,
          { lock: true }
        );
        let i = 0;
        let _index = 0;
        let msg = ``;
        for (let t of torrents_link) {
          let tid, cid;
          if (t.dataset && t.dataset.hasOwnProperty("torrent_id")) {
            tid = t.dataset.torrent_id;
          } else {
            tid = parseInt(t.href.substr(34).replace("&hit=1", ""));
          }
          if (!is_remove) {
            claimTorrent(tid)
              .then((res) => {
                if (res.ret !== 0) {
                  msg += `<br>种子 ${tid} 失败，原因：${res.msg}`;
                }
              })
              .finally(() => {
                i++;
                if (i == torrents_link.length) {
                  xtip.alert("批量认领执行完毕！<br>" + msg, {
                    icon: msg.length ? "w" : "s",
                  });
                  xtip.close(loadid);
                }
                document.querySelector(
                  "#_lsp_label"
                ).innerText = `正在认领...[${i}/${torrents_link.length}]`;
              });
            console.log(`种子 ${t.innerText} 已提交(id ${tid})`);
          } else {
            cid = claims_id[_index++].innerText;
            removeClaim(cid)
              .then((res) => {})
              .catch((res) => {
                msg += `<br>种子 ${t.innerText}(TID:${tid} ID:${cid}) 取消认领失败}`;
              })
              .finally(() => {
                i++;
                if (i == torrents_link.length) {
                  xtip.alert("批量取消认领执行完毕！<br>" + msg, {
                    icon: msg.length ? "w" : "s",
                  });
                  xtip.close(loadid);
                  location.reload();
                }
                document.querySelector(
                  "#_lsp_label"
                ).innerText = `正在取消认领...[${i}/${torrents_link.length}]`;
              });
            console.log(`种子 ${t.innerText} 已提交(id ${cid})`);
          }
        }
      },
    }
  );
}
