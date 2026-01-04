// ==UserScript==
// @name         讨论区屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  基于 lglg.top 的一个讨论区屏蔽插件。
// @author       0x3b800001
// @match        https://www.luogu.com.cn/discuss/*
// @match        https://www.luogu.com/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502336/%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/502336/%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

function getReply(reply) {
  return {
    "author": {
      "uid": reply.snapshots[0].author.userSnapshots[0].userId,
      "avatar": "https://cdn.luogu.com.cn/upload/usericon/" + String(reply.snapshots[0].author.userSnapshots[0].userId) + ".png",
      "badge": reply.snapshots[0].author.userSnapshots[0].badge,
      "color": reply.snapshots[0].author.userSnapshots[0].color,
      "ccfLevel": reply.snapshots[0].author.userSnapshots[0].ccfLevel,
      "isAdmin": reply.snapshots[0].author.userSnapshots[0].isAdmin,
      "isBanned": reply.snapshots[0].author.userSnapshots[0].isBanned,
      "slogan": null,
      "background": null,
      "name": reply.snapshots[0].author.userSnapshots[0].name,
    },
    "content": reply.snapshots[0].content,
    "time": Date.parse(new Date(reply.time).toString()) / 1000
  };
}

function OK(s) {
  // 此处可以自行定制，但是先前的数据需要自行按一次更新回复按钮来更新
  if (s.length <= 2) {
    return false;
  }
  return s.indexOf("qp") == -1 && (s.indexOf("main") == -1 || s.indexOf("包") == -1) && s.indexOf("前排") == -1 && s.indexOf("支持") == -1 && s.indexOf("zc") == -1 && s.indexOf("最前的一") && s.indexOf("这么前") == -1 && s.indexOf("那么前") == -1 && s.indexOf("后排") == -1 && s.indexOf("中排") == -1 && s.indexOf("兜售") == -1 && s.indexOf("资瓷") == -1 && s.indexOf("hp") == -1 && s.indexOf("楼上") == -1 && s.indexOf("楼下") == -1;
}

let nowpage = -1;
function main() {
  let match = /discuss\/(.*?)\?page=(.*?)&sort=time\-d/.exec(window.location);
  if (match == null) {
    return;
  }
  let Id = 1 * match[1], Page = 1 * match[2];
  _feInstance.currentData.replies.count = GM_getValue("discuss" + Id, undefined).length;
  console.log(nowpage, Page);
  if (nowpage == Page) {
    return;
  }
  nowpage = Page;
  let dells = GM_getValue("discuss" + Id, undefined), ls = [];
  console.log(dells.length);
  for (let i = (Page - 1) * 10; i < Page * 10; ++i) {
    if (i < dells.length) {
      ls.push(dells[i]);
    }
  }
  _feInstance.currentData.replies.result = ls;
}

function upd() {
  GM_xmlhttpRequest({
    method: "get",
    url: "https://lga.rotriw.com/" + _feInstance.currentData.post.id,
    data: {},
    onload: function () {
      GM_xmlhttpRequest({
        method: "get",
        url: "https://lglg.top/" + _feInstance.currentData.post.id + "/replies?limit=100000",
        data: {},
        onload: function (res) {
          let M = JSON.parse(res.responseText).replies, Q = [];
          for (let i = 0; i < M.length; ++i) {
            if (OK(getReply(M[i]).content)) {
              Q.push(getReply(M[i]));
            }
          }
          GM_setValue("discuss" + _feInstance.currentData.post.id, Q);
          alert("成功加载 " + GM_getValue("discuss" + _feInstance.currentData.post.id, undefined).length + " 条回复");
          nowpage = -1;
        }
      });
    }
  })
}

function Main() {
  if (document.getElementsByClassName("btn-actions")[0] == undefined || document.getElementById("update") != undefined) {
    return;
  }
  setInterval(main, 20);
  document.getElementsByClassName("btn-actions")[0].innerHTML += '<button data-v-7ade990c="" data-v-70c65cc7="" type="button" class="lfe-form-sz-middle" id="update" style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);" data-v-8b7f80ba="">更新回复</button>'
  document.getElementById("update").onclick = () => {
    if (confirm("是否更新帖子 " + _feInstance.currentData.post.id + " 内容？")) {
      upd();
    }
  }
}

(function () {
  'use strict';
  console.log(GM_getValue("discuss" + _feInstance.currentData.post.id, undefined));
  if (GM_getValue("discuss" + _feInstance.currentData.post.id, undefined) == undefined) {
    console.log("???");
    upd();
  }
  setInterval(Main, 500);
})();