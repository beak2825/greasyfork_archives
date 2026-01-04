// ==UserScript==
// @name         "ビュアー"に訂正するUserScript
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Viewerの日本語を正しいものに訂正します。Webサイトが意図しない動作をする可能性があります。使用する際はご注意ください。
// @author       Midra(@mdr_anm)
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435266/%22%E3%83%93%E3%83%A5%E3%82%A2%E3%83%BC%22%E3%81%AB%E8%A8%82%E6%AD%A3%E3%81%99%E3%82%8BUserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/435266/%22%E3%83%93%E3%83%A5%E3%82%A2%E3%83%BC%22%E3%81%AB%E8%A8%82%E6%AD%A3%E3%81%99%E3%82%8BUserScript.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const viewer_re = /ビューワー|ビューワ|ビュワー|ビューアー|ビューア/g;
  const viewer_ja = 'ビュアー';

  const replaceViewerToCorectViewer = (node) => {
    if (!node || node.nodeType !== 3) return false;
    node.textContent = node.textContent.replace(viewer_re, viewer_ja);
    return true;
  };

  const replaceAllTextNode = (nodes) => {
    if (nodes?.length) {
      nodes.forEach((node) => {
       if (!replaceViewerToCorectViewer(node)) {
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

  document.title = document.title.replace(viewer_re, viewer_ja);
})();