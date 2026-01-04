// ==UserScript==
// @name        选译替换器TransReplace
// @namespace   vurses
// @license     Mit
// @author      layenh
// @match       https://web.telegram.org/*
// @match       https://webk.telegram.org/*
// @match       https://webz.telegram.org/*
// @match       https://fanyi.sogou.com/*
// @match       *://*/*
// @grant       GM.xmlhttpRequest
// @grant       GM_xmlhttpRequest
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @connect     fanyi.sogou.com
// @run-at      document-end
// @version     1.0
// @noframes
// @require     https://update.greasyfork.org/scripts/533087/1572495/WbiSign.js
// @require     https://update.greasyfork.org/scripts/534967/1583188/langSwitcher.js
// @description 翻译选中的文本并替换
// @downloadURL https://update.greasyfork.org/scripts/534970/%E9%80%89%E8%AF%91%E6%9B%BF%E6%8D%A2%E5%99%A8TransReplace.user.js
// @updateURL https://update.greasyfork.org/scripts/534970/%E9%80%89%E8%AF%91%E6%9B%BF%E6%8D%A2%E5%99%A8TransReplace.meta.js
// ==/UserScript==

// 获取cookie和secretCode
let sogouCookie = GM_getValue("sogouCookie", "");
let secretCode = GM_getValue("secretCode", "");
if (location.href.includes("fanyi.sogou.com")) {
  sogouCookie = document.cookie;
  GM_setValue("sogouCookie", sogouCookie);
  window.addEventListener("load", () => {
    secretCode = unsafeWindow.__INITIAL_STATE__.common.CONFIG.secretCode;
    GM_setValue("secretCode", secretCode);
  });
}
// 注入语言菜单
window.addEventListener("load", () => {
  document.documentElement.appendChild(createLangSwitcher(GM_setValue, GM_getValue));
});
// uuid生成
function uuidGen() {
  let t,
    n,
    r = "";
  for (t = 0; t < 32; t++) {
    (n = (16 * Math.random()) | 0),
      (8 !== t && 12 !== t && 16 !== t && 20 !== t) || (r += "-");
    const e = 3 & n,
      o = 16 === t ? 8 | e : n;
    r += (12 === t ? 4 : o).toString(16);
  }
  return r;
}
// 简易封装xhr
const gm_xhr = function (data) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://fanyi.sogou.com/api/transpc/text/result",
      data: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      cookie: sogouCookie,
      onload: resolve,
      onerror: reject,
    });
  }).then((response) => {
    return response.responseText;
  });
};
// 监听是否替换翻译文本
document.addEventListener("keydown", (event) => {
  if (event.shiftKey) {
    const activeElement = document.activeElement;
    console.log(activeElement)
    if (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable
    ) {
      const selectedText = window.getSelection().toString().trim();
      console.log(selectedText)
      if (selectedText) {
        // 初始语言类型，可以是auto
        const from = "auto";
        // 目标语言类型
        const to = GM_getValue("selectedLang", "zh-CHS");
        // 初始语言内容
        const text = selectedText;
        const keyS = SparkMD5.hash(
          "".concat(from).concat(to).concat(text).concat(secretCode)
        );
        const uuid = uuidGen();
        const data = {
          client: "pc",
          exchange: false,
          fr: "browser_pc",
          from,
          needQc: 1,
          s: keyS,
          text,
          to: GM_getValue("selectedLang", "zh-CHS"),
          uuid: uuid,
        };
        gm_xhr(data)
          .then((res) => {
            const translatedText = JSON.parse(res).data.translate.dit || "";
            if (translatedText === "") throw "api 错误";
            if (
              activeElement.tagName === "INPUT" ||
              activeElement.tagName === "TEXTAREA"
            ) {
              const start = activeElement.selectionStart;
              const end = activeElement.selectionEnd;
              const originalValue = activeElement.value;
              activeElement.value =
                originalValue.slice(0, start) +
                translatedText +
                originalValue.slice(end);
              // 可选：重新设置光标位置
              activeElement.selectionStart = activeElement.selectionEnd =
                start + translatedText.length;
              // ✅ 触发 input 事件（使得 Vue/React 等响应变化）
              const event = new Event("input", { bubbles: true });
              activeElement.dispatchEvent(event);
            } else if (activeElement.isContentEditable) {
              const selection = window.getSelection();
              if (!selection.rangeCount) return;
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(translatedText));
              // 可选：移动光标到插入后的位置
              range.collapse(false);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          })
          .catch((e) => {
            console.log(e);
            location.href = "https://fanyi.sogou.com";
          });
      }
    }
  }
});
