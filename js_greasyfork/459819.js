// ==UserScript==
// @name         百度翻译文本域优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       glk
// @match        https://fanyi.baidu.com/*
// @grant        none
// @description  显示百度翻译文本域当前文本数量、增加最大输入值等。
// @downloadURL https://update.greasyfork.org/scripts/459819/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC%E5%9F%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459819/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E6%96%87%E6%9C%AC%E5%9F%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TEXTAREA_MAXLEN = 5000;

  window.onload = function () {
    let curLen = 0;
    const bd_trans_input_wrap =
      document.getElementsByClassName("trans-input-wrap")[0];
    const bd_trans_right = document.getElementsByClassName("trans-right")[0];
    const bd_textareael = document.getElementsByClassName("textarea")[0];
    const input_wordCount_el = document.createElement("span");
    const output_wordCount_el = document.createElement("span");

    Object.assign(input_wordCount_el.style, {
      position: "absolute",
      bottom: "11px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "rgb(102, 102, 102)",
      background: "#ccc",
      zIndex: "9999",
      background: "#f0f1f6",
      borderRadius: "10px",
      padding: "2px 6px",
      zIndex: 99999
    });
    Object.assign(output_wordCount_el.style, {
      position: "absolute",
      bottom: "11px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "rgb(102, 102, 102)",
      background: "#d9dded",
      borderRadius: "10px",
      padding: "2px 6px",
      zIndex: 99999
    });

    bd_trans_input_wrap.appendChild(input_wordCount_el);
    bd_trans_right.appendChild(output_wordCount_el);

    // 设置输入字数
    if (bd_textareael) {
      const curlen = bd_textareael.value.length;
      input_wordCount_el.innerText = `${curlen} / ${TEXTAREA_MAXLEN} ❤`;
      bd_textareael.setAttribute("maxlength", TEXTAREA_MAXLEN);
      bd_textareael.oninput = function () {
        console.log("this value", this.value);
        input_wordCount_el.innerText = `${this.value.length} / ${TEXTAREA_MAXLEN} ❤`;
      };
    }

    // 设置输出字数
    setInterval(() => {
      curLen = 0;
      let bd_target_output_els = Array.from(
        document.getElementsByClassName("target-output")
      );
      bd_target_output_els.forEach((i) => {
        curLen += i.innerText.length;
      });
      output_wordCount_el.innerText = `${curLen || 0} 🍭`;
    }, 1000);
  };
})();
