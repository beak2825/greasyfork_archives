// ==UserScript==
// @name         白话文转文言文
// @namespace    https://tkanx.github.io
// @version      1.0.0
// @description  将网页中的白话文转换为文言文
// @author       Tony Kan
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/507536/%E7%99%BD%E8%AF%9D%E6%96%87%E8%BD%AC%E6%96%87%E8%A8%80%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/507536/%E7%99%BD%E8%AF%9D%E6%96%87%E8%BD%AC%E6%96%87%E8%A8%80%E6%96%87.meta.js
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
    "span",
    "div",
    "footer",
    "header",
    "nav",
    "form",
    "label",
    "button",
  ];

  /**
   * @param {Element} root
   */
  function replace(root) {
    const replacer = (str) =>
      str
        .replace(/我们/g, "吾等")
        .replace(/大家/g, "诸君")
        .replace(/你们/g, "汝等")
        .replace(/你/g, "汝")
        .replace(/我/g, "吾")
        .replace(/是/g, "乃")
        .replace(/的/g, "之")
        .replace(/吗/g, "乎")
        .replace(/吧/g, "矣")
        .replace(/了/g, "已")
        .replace(/这/g, "此")
        .replace(/那/g, "彼")
        .replace(/一个/g, "一")
        .replace(/现在/g, "今")
        .replace(/已经/g, "已然")
        .replace(/如果/g, "若")
        .replace(/因为/g, "因")
        .replace(/所以/g, "故")
        .replace(/什么/g, "何")
        .replace(/如何/g, "若何")
        .replace(/可以/g, "可")
        .replace(/非常/g, "甚")
        .replace(/但是/g, "然则")
        .replace(/然后/g, "遂")
        .replace(/希望/g, "冀")
        .replace(/来/g, "至")
        .replace(/去/g, "往")
        .replace(/要/g, "欲")
        .replace(/觉得/g, "以为")
        .replace(/只是/g, "但")
        .replace(/而且/g, "且")
        .replace(/虽然/g, "虽")
        .replace(/怎样/g, "如何")
        .replace(/怎么/g, "何以")
        .replace(/很/g, "甚")
        .replace(/没有/g, "无")
        .replace(/很少/g, "罕")
        .replace(/看到/g, "见")
        .replace(/听到/g, "闻")
        .replace(/对/g, "于")
        .replace(/错/g, "谬")
        .replace(/对不起/g, "歉")
        .replace(/不/g, "不")
        .replace(/与/g, "与")
        .replace(/会/g, "会")
        .replace(/未来/g, "来")
        .replace(/过去/g, "昔")
        .replace(/想/g, "欲")
        .replace(/需要/g, "需")
        .replace(/想要/g, "欲")
        .replace(/一会儿/g, "片刻")
        .replace(/再见/g, "再会")
        .replace(/朋友/g, "友")
        .replace(/告诉/g, "告")
        .replace(/知道/g, "知")
        .replace(/为什么/g, "何故")
        .replace(/给/g, "与")
        .replace(/这儿/g, "此处")
        .replace(/那里/g, "彼地")
        .replace(/慢/g, "徐")
        .replace(/快/g, "疾")
        .replace(/好/g, "善")
        .replace(/坏/g, "恶")
        .replace(/真的/g, "诚然")
        .replace(/特别/g, "特别")
        .replace(/有/g, "有")
        .replace(/更多/g, "更多")
        .replace(/一些/g, "一些")
        .replace(/人/g, "人")
        .replace(/工作/g, "工作")
        .replace(/学习/g, "学")
        .replace(/生活/g, "生");

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
