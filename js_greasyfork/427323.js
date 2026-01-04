// ==UserScript==
// @name         百度贴吧签到
// @namespace    zimore
// @version      0.91
// @description  进入贴吧个人主页,找到签到按钮点击即可签到,签到结果会在右下角窗口提示,具体操作请看使用说明
// @include      *://tieba.baidu.com/home*
// @author       zimore
// @connect      *
// @match        none
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_cookie
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/427323/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427323/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(async () => {
  'use strict'
  const zimore = {
    canCusTomer: false,
    request: async (...args) => {
      return new Promise(async (resolve, reject) => {
        try {
          GM_xmlhttpRequest({
            method: args[0]["method"],
            url: args[0]["url"],
            headers: args[0]["headers"] || "",
            data: args[0]["data"] || "",
            onload: function (res) {
              resolve(res.response);
            }
          });
        } catch (error) {
          reject(0);
        };

      });
    },
    sleep: async ms => {
      return new Promise(async (resolve, reject) => { var timeOut = setTimeout(() => { clearTimeout(timeOut); return resolve(0); }, ms); });
    },
    tiebaSign: async (groups) => {
      return new Promise(async (resolve, reject) => {
        var signResult = [];
        try {
          for (let i = 0; i < groups.length; i++) {
            //
            try {
              var html = await zimore.request({ method: "GET", url: `https://tieba.baidu.com/f?kw=${groups[i]}&fr=home`, headers: "", data: "" });
              var PageDataStart = html.indexOf("PageData =");
              var PageDataTemp = html.substr(PageDataStart, html.length);
              var PageDataEnd = PageDataTemp.indexOf(";");
              var tbsData = html.substr(PageDataStart, PageDataEnd).replace("PageData =", "").trim();
              tbsData = tbsData.replace(/\s+/g, "");
              tbsData = tbsData.replace(/<\/?.+?>/g, "");
              tbsData = tbsData.replace(/[\r\n]/g, "");
              tbsData = tbsData.replace(`{'tbs':"`, "");
              var tbs = tbsData.replace(`"}`, "");
              //console.log(`tbs ${tbs}`);
              var singInfo = await zimore.request(
                {
                  method: "POST", url: "https://tieba.baidu.com/sign/add",
                  headers: {
                    "Origin": "https://tieba.baidu.com",
                    "Referer": `https://tieba.baidu.com/f?kw=${encodeURIComponent(groups[i])}fr=home`,
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                  data: `ie=utf-8&kw=${encodeURIComponent(groups[i])}&tbs=${tbs + ""}`
                });
              console.log(singInfo);
              signResult.push(singInfo);
              await zimore.sleep(1000);
            } catch (error) {
              continue;
            };
          };
        } catch (error) {
          //
        } finally {
          resolve(signResult);
        };
      });
    },
  };

  try {
    document.querySelector(".userinfo_username").style.display = "flex";
    document.querySelector(".userinfo_username").style.whiteSpace = "noWarp";
    var TBsingBox = document.createElement("span");
    TBsingBox.style = `margin-left:15px;font-size:13px;color:#fff;display:flex;
    justify-content: center;align-items: center;background:rgb(7, 117, 241);
    cursor: pointer;border-radius: 5px;width:80px ;height:auto;font-weight:bold;
    letter-spacing: 1px;
    `;
    TBsingBox.innerText = "签到✏️";
    document.querySelector(".userinfo_username ").appendChild(TBsingBox);
  } catch (error) {
    alert("请检查是否登录");
  };

  TBsingBox.addEventListener("click", async function (e) {
    if (e && e.stopPropagation) {
      e.stopPropagation()
    };
    if (e && e.defaultPrevented) {
      e.defaultPrevented();
    };
    if (zimore.canCusTomer) {
      alert("正在签到中...");
      // console.log("正在签到中...");
      return false;
    } else {
      alert("开始签到,完成后右下角有提示");
      zimore.canCusTomer = true;
    };
    try {
      var html = document.querySelector("html").innerHTML;
      var forumIndex = html.indexOf(`{"forumArr":`);
      html = html.slice(forumIndex, html.length);
      var forumEnd = html.indexOf(`);`);
      html = JSON.parse(html.slice(0, forumEnd));
      var groups = [];
      html["forumArr"].forEach(item => {
        groups.push(item["forum_name"].trim());
      });
      await zimore.tiebaSign(groups)
        .then(signRes => {
          console.log(signRes);
          GM_notification({
            text: `本次共签到🏷️ ${signRes.length} 个贴吧`,
            title: "🚀签到完成",
            highlight: true,
            silent: false,
            timeout: 10000,
          });
        });
      zimore.canCusTomer = false;
      return false;
    } catch (e) {
      console.log(e);
      alert("签到出错了~");
      return false;
    };
  });

})();
































