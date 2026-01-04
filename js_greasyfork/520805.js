// ==UserScript==
// @name         全都变猫娘喵！
// @namespace    https://penyo.ru/
// @version      1.0.8
// @description  变！
// @author       Penyo&lyx
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/520805/%E5%85%A8%E9%83%BD%E5%8F%98%E7%8C%AB%E5%A8%98%E5%96%B5%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/520805/%E5%85%A8%E9%83%BD%E5%8F%98%E7%8C%AB%E5%A8%98%E5%96%B5%EF%BC%81.meta.js
// ==/UserScript==

/**
 * 是否影响输入框
 *
 * 警告！除非你知道改动此项会引发什么结果，否则不应改动！
 */

const affectInput = false;

(function () {
  "use strict";

  const elementToMatch = [
    "title",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "article",
    "section",
    "blockquote",
    "li",
    "a",
    "CC",
  ];

  /**
   * @param {Element} root
   */
  function replace(root) {
    const replacer = (str) =>
      str
        .replace(/我们/g, "咱喵和其它猫猫们")
        .replace(/大家/g, "各位猫猫们")
        .replace(/本人|(?<!自|本)我/g, "咱喵")
        .replace(/你们/g, "汝等")
        .replace(/你|您/g, "汝")
        .replace(/孝子|xz|卫兵|小丑|资本|水军|海军|二游|节奏/, "杂鱼")
        .replace(/恋爱|溜冰|爆改|白嫖|洗白|抄袭|借鉴|退坑|好似/, "援交")
        .replace(
          /([也矣兮乎者焉哉]|[啊吗呢吧哇呀哦嘛喔咯呜捏])([ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|$)/g,
          (_, $1, $2) => `喵${$2}`
        )
        .replace(
          /([的了辣])([!"#$%&'()*+,-./:;/,=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|\s+(?!<|\w)|$)/g,
          (_, $1, $2) => `${$1}喵${$2}`
        )
        // 新增句末添加“蝶思喵~”
        .replace(/([^。！？])$/g, "$1蝶思喵~");

    requestIdleCallback(() => {
      root
        .querySelectorAll(
          elementToMatch
            .concat(elementToMatch.map((name) => name + " *"))
            .concat(affectInput ? ["input"] : [])
            .join(",")
        )
        .forEach((candidate) => {
          if (candidate.nodeName == "INPUT") {
            candidate.value = replacer(candidate.value);
          } else if (
            candidate.textContent &&
            candidate.textContent == candidate.innerHTML.trim()
          ) {
            candidate.textContent = replacer(candidate.textContent);
          } else if (
            Array.from(candidate.childNodes).filter((c) => c.nodeName == "BR")
          ) {
            Array.from(candidate.childNodes).forEach((maybeText) => {
              if (maybeText.nodeType == Node.TEXT_NODE) {
                maybeText.textContent = replacer(maybeText.textContent);
              }
            });
          }
        });
    });
  }
})();