// ==UserScript==
// @name         "断捨離®"に訂正するUserScript
// @namespace    https://midra.me/
// @version      1.0
// @description  断捨離を登録商標マーク付きに訂正します。Webサイトが意図しない動作をする可能性があります。使用する際はご注意ください。
// @author       Midra(@mdr_anm)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436491/%22%E6%96%AD%E6%8D%A8%E9%9B%A2%C2%AE%22%E3%81%AB%E8%A8%82%E6%AD%A3%E3%81%99%E3%82%8BUserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/436491/%22%E6%96%AD%E6%8D%A8%E9%9B%A2%C2%AE%22%E3%81%AB%E8%A8%82%E6%AD%A3%E3%81%99%E3%82%8BUserScript.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const dansyari_re = /断捨離(?![®|Ⓡ])/g;
  const dansyari_ja = '断捨離®';

  const replaceCorrectWord = (node) => {
    if (!node || node.nodeType !== 3) return false;
    node.textContent = node.textContent.replace(dansyari_re, dansyari_ja);
    return true;
  };

  const replaceAllTextNode = (nodes) => {
    if (nodes?.length) {
      nodes.forEach((node) => {
       if (!replaceCorrectWord(node)) {
         replaceAllTextNode(node.childNodes);
       }
      });
    }
  };

  const obs_target = document.body;
  const obs_config = {
    childList: true,
    subtree: true,
  };
  const obs = new MutationObserver((event) => {
    obs.disconnect();
    for (const evt of event) {
      const {addedNodes} = evt;
      if (!addedNodes || !addedNodes.length) continue;
      replaceAllTextNode(evt.target.childNodes);
    }
    obs.observe(obs_target, obs_config);
  });
  obs.observe(obs_target, obs_config);

  document.title = document.title.replace(dansyari_re, dansyari_ja);
})();