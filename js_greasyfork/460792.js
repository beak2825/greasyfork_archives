// ==UserScript==
// @name         别看题解
// @namespace    http://tampermonkey.net/
// @version      0.7.2.1
// @description  在你看洛谷题解的时候把自己挂到犇犇。
// @author       0x3b800001&Maxwell_dcc
// @match        https://www.luogu.com.cn/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/3.png
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/460792/%E5%88%AB%E7%9C%8B%E9%A2%98%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/460792/%E5%88%AB%E7%9C%8B%E9%A2%98%E8%A7%A3.meta.js
// ==/UserScript==

function mstt(ms) {
  ms = Number(ms);
  let res = "";
  res += String(Math.floor(ms / 86400000)) + "d ";
  res += String(Math.floor(ms % 86400000 / 3600000)) + "h ";
  res += String(Math.floor(ms % 3600000 / 60000)) + "min ";
  res += String(Math.floor(ms % 60000 / 1000)) + "s";
  return res;
}
(function () {
  'use strict';
  let f = () => {
    if (localStorage["bktj-format"] == undefined) {
      localStorage["bktj-format"] = "这个人在开题 bktjnumber bktjname 后 bktjtime 后看了题解\n\n![](https://cdn.luogu.com.cn/upload/image_hosting/3an86p0q.png) 警钟长鸣。";
    }
    if (localStorage["bktj-times"] == undefined) {
      localStorage["bktj-times"] = "2";
    }
    let lnk = window.location.href;
    if (lnk == "https://www.luogu.com.cn/user/setting#preference") {
      let r = prompt("格式（留空即为不变，具体使用方法见文档）：");
      if (r.length != 0) localStorage["bktj-format"] = r.replace(/\\n/g, "\n");
      r = prompt("询问次数（留空即为不变，具体使用方法见文档）：");
      if (r.length != 0) localStorage["bktj-times"] = r;
      if (confirm("是否清空重复挂 localStorage")) {
        let tmp = localStorage;
        for (let i = 0; i < localStorage.length; ++i) {
          if (localStorage.key(i).indexOf("bktj-problemcache-") != -1) {
            tmp.removeItem(localStorage.key(i));
          }
        }
        localStorage = tmp;
      }
    } else if (lnk.indexOf("https://www.luogu.com.cn/problem/solution/") != -1) {
      var name = (document.getElementsByClassName('lfe-h1'))[0].innerHTML;
      let P = (name.split(' '))[0];
      name = name.substring(P.length + 1, name.length).split(" 题解")[0];
      console.log(P);
      console.log(name);
      GM_xmlhttpRequest({
        url: "https://www.luogu.com.cn/problem/" + P + "?_contentOnly=1",
        method: "GET",
        onload: function (response) {
          let rp = response.responseText;
          let qwww = rp.split("recommendations")[0];
          if (qwww.indexOf("\"submitted\":true") == -1) {
            console.log("未通过");
            let see = true;
            for (let i = 1; i <= localStorage["bktj-times"]; ++i) {
              if (!confirm("您尚未通过" + P + "，确认要看题解吗？")) {
                see = false;
                break;
              }
            }
            if (see) {
              if (localStorage["bktj-problemcache-" + P] == undefined) {
                if (localStorage["bktj-opentime-" + P] == undefined) localStorage["bktj-opentime-" + P] = Date.now();
                GM_xmlhttpRequest({
                  url: "https://www.luogu.com.cn/api/feed/postBenben",
                  headers: {
                    "content-type": "application/json",
                    "referer": "https://www.luogu.com.cn/",
                    "x-csrf-token": document.querySelector("meta[name=csrf-token]").content
                  },
                  data: JSON.stringify({
                    content: String(localStorage["bktj-format"])
                      .replace(/bktjnumber/g, P)
                      .replace(/bktjname/g, name)
                      .replace(/bktjtime/g, mstt(Date.now() - Number(localStorage["bktj-opentime-" + P])))
                  }),
                  method: "POST",
                });
                localStorage["bktj-problemcache-" + P] = 1;
              } else {
                console.log("已经挂过了");
              }
            } else {
              document.getElementsByClassName("lfe-form-sz-middle")[0].click();
              return;
            }
          } else {
            console.log("已通过");
          }
        }
      });
    } else if (lnk.indexOf("https://www.luogu.com.cn/problem/") != -1) {
      let nm = lnk.substring(33);
      if (localStorage["bktj-opentime-" + nm] == undefined) {
        localStorage["bktj-opentime-" + nm] = Date.now();
      }
      console.log(nm);
    }
  };
  try {
    setTimeout(f, 1000);
  } catch (e) {
    window.location.reload();
  }
})();