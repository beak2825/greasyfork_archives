// ==UserScript==
// @name         better_spell_novelai_dev
// @namespace    http://leizingyiu.net/
// @version      1.0
// @description  按alt+x 加 鼠标左键点击 ，对点击的文本进行unicode转换 ； 按alt+c 加 鼠标左键点击 ，对点击的文本进行json美化
// @author       leizingyiu & Kimi
// @match        *://*/*
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/528709/better_spell_novelai_dev.user.js
// @updateURL https://update.greasyfork.org/scripts/528709/better_spell_novelai_dev.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义功能函数
  const functions = {
    KeyX: unicodeToChar, // Unicode 转换
    KeyC: beautifyText, // JSON 美化
  };

  // Unicode 转换函数
  function unicodeToChar(text) {
    return text.replace(/\\u([\dA-Fa-f]{4})/g, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16));
    });
  }

  function _beautifyText(text) {
    try {
      const parsedJson = JSON.parse(text);
      return JSON.stringify(parsedJson, null, 2).replace(
        /(\[.*?\])/gs,
        (match) => {
          // 检查是否是最内层的数组（没有嵌套的数组）
          if (!match.includes("[") || !match.includes("]")) {
            return match.replace(/\n\s+/g, ""); // 去掉换行和缩进
          }
          return match; // 保留嵌套数组的格式
        },
      );
    } catch (error) {
      console.warn("输入的文本不是有效的 JSON，无法进行格式化。", error);
      return text;
    }
  }

  function beautifyText(text) {
    try {
      const parsedJson = JSON.parse(text);

      // 自定义格式化函数
      function customStringify(value, indent = 0) {
        const space = " ".repeat(indent); // 当前缩进
        const nextIndent = indent + 2; // 下一层缩进

        if (Array.isArray(value)) {
          // 如果数组内部没有嵌套的 [] 或 {}
          if (value.every((item) => !/[\[\]\{\}]/.test(JSON.stringify(item)))) {
            return `[${value.join(", ")}]`; // 不换行
          } else {
            // 有嵌套结构，正常换行
            return `[${value.map((item) => `\n${" ".repeat(nextIndent)}${customStringify(item, nextIndent)}`).join(",\n")}\n${space}]`;
          }
        } else if (value && typeof value === "object") {
          // 如果对象内部没有嵌套的 [] 或 {}
          if (
            Object.values(value).every(
              (val) => !/[\[\]\{\}]/.test(JSON.stringify(val)),
            )
          ) {
            return `{${Object.entries(value)
              .map(([key, val]) => `"${key}": ${customStringify(val, indent)}`)
              .join(", ")}}`; // 不换行
          } else {
            // 有嵌套结构，正常换行
            return `{${Object.entries(value)
              .map(
                ([key, val]) =>
                  `\n${" ".repeat(nextIndent)}"${key}": ${customStringify(val, nextIndent)}`,
              )
              .join(",\n")}\n${space}}`;
          }
        } else {
          // 基本类型直接返回
          return JSON.stringify(value);
        }
      }

      return customStringify(parsedJson);
    } catch (error) {
      console.warn("输入的文本不是有效的 JSON，无法进行格式化。", error);
      return text;
    }
  }

  // 通用处理函数
  function processNodeContent(event, transformFunction) {
    const targetNode = event.target;
    if (targetNode.nodeType === Node.ELEMENT_NODE && targetNode.textContent) {
      const originalText = targetNode.textContent;
      const transformedText = transformFunction(originalText);
      targetNode.textContent = transformedText;
      console.log("内容已处理：", transformFunction.name);
    }
  }

  // 当前按下的键
  let activeKey = null;

  // 监听键盘按下事件
  document.addEventListener("keydown", function (event) {
    if (event.altKey && functions[event.code]) {
      activeKey = event.code;
      console.log(
        `Alt + ${String.fromCharCode(event.keyCode)} 已按下，绑定点击事件`,
      );
      document.addEventListener("click", (e) =>
        processNodeContent(e, functions[activeKey]),
      );
    }
  });

  // 监听键盘松开事件
  document.addEventListener("keyup", function (event) {
    if (event.altKey || activeKey) {
      console.log(
        `Alt + ${String.fromCharCode(event.keyCode)} 已松开，解绑点击事件`,
      );
      document.removeEventListener("click", (e) =>
        processNodeContent(e, functions[activeKey]),
      );
      activeKey = null;
    }
  });
})();
