// ==UserScript==
// @name         小明找货报价批量下载
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  定制脚本
// @author       曦月
// @license      MIT
// @match        http://www.hkmt.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.hkmt.top
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsrsasign/10.8.6/jsrsasign-all-min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466903/%E5%B0%8F%E6%98%8E%E6%89%BE%E8%B4%A7%E6%8A%A5%E4%BB%B7%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/466903/%E5%B0%8F%E6%98%8E%E6%89%BE%E8%B4%A7%E6%8A%A5%E4%BB%B7%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  let url = location.href;
  if (!url.includes("pages/SearchProducts2/index")) {
    return;
  }

  let button = document.createElement("button");
  button.innerText = "下载报价";
  button.style.zIndex = 1000;
  button.style.position = "fixed";
  button.style.top = "60px";
  button.style.padding = "10px 20px";
  button.style.lerf = "20px";
  console.info(document.readyState);
  let loops = true;
  while (loops) {
    if (document.readyState == "complete") {
      document.body.appendChild(button);
      loops = false;
    }
    await new Promise((res) => setTimeout(res, 500));
  }

  function getSing(index) {
    let xy_vue = document.querySelector("[data-v-3e3d1628]").__vue__;
    let xy_key = xy_vue.key;

    var pub = KEYUTIL.getKey(`-----BEGIN PUBLIC KEY-----${xy_key}-----END PUBLIC KEY-----`);
    var encrypted = KJUR.crypto.Cipher.encrypt(
      JSON.stringify({
        TenBunk: xy_vue.searchShopName.toLowerCase(),
        State: 1,
        PageIndex: index,
        PageSize: 100,
        Ts: 1 * new Date(),
      }),
      pub
    );
    return hextob64(encrypted);
  }
  const getList = async () => {
    let xy_vue = document.querySelector("[data-v-3e3d1628]").__vue__;
    let arrs = [];
    let xy_pgIndex = 1;
    let xy_loop = true;
    while (xy_loop) {
      let xy_s = getSing(xy_pgIndex);
      button.innerHTML = `正在获取报价 ${xy_pgIndex}`;
      await xy_vue.$http
        .post("/AllProduct/PostSearchNew", {
          sign: xy_s,
          word: "",
          OpenID: uni.getStorageSync("openID"),
          Screen: "",
        })
        .then(async (t) => {
          console.info(t);
          if (t.Data && Array.isArray(t.Data) && t.Data.length) {
            arrs.push(...t.Data);
            xy_pgIndex++;
            await new Promise((res) => setTimeout(res, 1000));
          } else {
            xy_loop = false;
            xy_pgIndex = 1;
            console.info(arrs);
            let text = arrs.map((el) => `${el.CheckProductName} ${el.Price}`).join("\n");
            // copy(text);
            downloadTxt(
              text,
              `${
                document.querySelector(".poster-box-right-text1 [data-v-3e3d1628]:nth-child(2)").innerText
              }-${new Date().toLocaleString().replace(/\//g, ".")}-报价.txt`
            );
            button.innerHTML = `下载完成`;
          }
        })
        .catch((err) => {
          console.error("请求出错", err);
        });
    }
  };
  button.addEventListener("click", getList);

  function downloadTxt(text, fileName) {
    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", fileName);
    element.style.display = "none";
    element.click();
  }

  function copy(text) {
    if (navigator.clipboard) {
      // clipboard api 复制
      console.info("clipboard api 复制");
      navigator.clipboard.writeText(text);
      alert("复制成功");
    } else {
      console.info("传统 api 复制");
      var textarea = document.createElement("textarea");
      document.body.appendChild(textarea);
      // 隐藏此输入框
      textarea.style.position = "fixed";
      // textarea.style.clip = "rect(0 0 0 0)";
      textarea.style.top = "0";
      textarea.style.width = "100vw";
      textarea.style.height = "100vh";
      textarea.style.zIndex = "1100";
      // 赋值
      textarea.value = text;
      // 选中
      textarea.select();
      // 复制
      document.execCommand("copy", true);
    }
  }

  window.getList = getList;
  // Your code here...
})();
