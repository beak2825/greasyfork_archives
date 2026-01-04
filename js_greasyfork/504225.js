// ==UserScript==
// @name         全给我变成小南娘！
// @namespace    https://penyo.ru/
// @version      1.0.7
// @description  变！
// @author       Penyo
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/504225/%E5%85%A8%E7%BB%99%E6%88%91%E5%8F%98%E6%88%90%E5%B0%8F%E5%8D%97%E5%A8%98%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/504225/%E5%85%A8%E7%BB%99%E6%88%91%E5%8F%98%E6%88%90%E5%B0%8F%E5%8D%97%E5%A8%98%EF%BC%81.meta.js
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
        .replace(/(?<!每|个)人(?!类|民|口|性)/g, "顺÷")
        .replace(/孝子|xz|卫兵|小丑|资本|水军|海军|二游|节奏/, "杂鱼")
        .replace(/恋爱|溜冰|爆改|白嫖|洗白|抄袭|借鉴|退坑|好似/, "援交")
        .replace(
          /([也矣兮乎者焉哉]|[啊吗呢吧哇呀哦嘛喔咯呜捏])([ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|$)/g,
          (_, $1, $2) => `喵${orophilia()}${$2}`
        )
        .replace(
          /([的了辣])([!"#$%&'()*+,-./:;/,=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|\s+(?!<|\w)|$)/g,
          (_, $1, $2) => `${$1}喵${orophilia()}${$2}`
        );
    const orophilia = () => (Math.random() < 0.33 ? "です" : "");

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

  /**
   * @param {Element} root
   */
  async function afterDomLoaded(root) {
    if (!root) return;

    const fn = () => {
      replace(root);

      root.querySelectorAll("*").forEach(async (node) => {
        if (node.shadowRoot) {
          await afterDomLoaded(node.shadowRoot);
        }
      });
    };

    while (document.readyState == "loading") {
      await new Promise((r) => setTimeout(r, 1000));
    }
    fn();
  }

  afterDomLoaded(document);
  setInterval(() => afterDomLoaded(document), 2500);
})();
