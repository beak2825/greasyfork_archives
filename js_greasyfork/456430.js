// ==UserScript==
// @name         keywordFilter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  通过关键字过滤页面内容
// @author       wasdjkl
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/456430/keywordFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/456430/keywordFilter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 为防止激进的方法调用造成性能问题，这里可以设置一个延迟时间
  const wait = 500

  // 过滤的关键字（预设仅用于测试并不代表作者个人喜好）
  const blockWords = ["置顶", "利昂内尔·梅西", "LGD"]

  // 过滤层级手动配置
  const blockRules = [
    // B站 评论过滤
    {url: 'https://www.bilibili.com/video/', selector: 'div.reply-item'},
    // Score 文章列表过滤
    {url: 'https://www.scoregg.com', selector: 'div.article-item'},
    // 百度搜索 结果过滤
    {url: 'https://www.baidu.com/s', selector: 'div.c-container'},
    // 百度百科 百科星图过滤
    {url: 'https://baike.baidu.com/item/', selector: 'div.starmap-lemma-item'},
    // 通用兜底规则
    {url: '', selector: 'li'}, {url: '', selector: 'p'}, {url: '', selector: 'a'}, {url: '', selector: 'span'}
  ]

  function hasKeyword(node) {
    if (node.textContent === null) return true;
    return blockWords.find(keyword => node.textContent.includes(keyword))
  }

  function replaceContent(node) {
    if (!hasKeyword(node)) return;
    if (node.nodeName === "#text") {
      const rules = blockRules.filter(rule => location.href.startsWith(rule.url))
      rules.forEach(rule => {
        $(node).closest(rule.selector).remove()
      })
    }
    node.childNodes.forEach(replaceContent);
  }

  const debounceReplaceContent = _.debounce(replaceContent, wait)

  debounceReplaceContent(document);
  new MutationObserver(() => {
    debounceReplaceContent(document)
  }).observe(document, {
    childList: true, attributes: false, subtree: true,
  });
})();
