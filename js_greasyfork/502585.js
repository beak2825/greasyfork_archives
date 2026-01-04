// ==UserScript==
// @name         Edge Translator For code
// @namespace    http://tampermonkey.net/
// @version      2024-08-04
// @description  Fixed a bug where the contents of Microsoft Translate code tags were misaligned
// @description:zh-CN  修复了微软翻译代码标签内容不对齐的错误
// @author       bLanK-NULL
// @license      MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/502585/Edge%20Translator%20For%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/502585/Edge%20Translator%20For%20code.meta.js
// ==/UserScript==

(function() {
  'use strict';
  wrapSpan(document.body);

  function wrapSpan(from) {
      Array.from(from.querySelectorAll('code')).filter(code=> (code.childElementCount === 0) && (code.parentElement.childNodes.length>1)).forEach(code=>{
          const span = document.createElement('span')
          code.parentElement.insertBefore(span, code)
          span.appendChild(code)
      })
  }

  const observerInstance = new MutationObserver(function(mutations) {
      // console.log(mutations)
      const set = new Set
      mutations.forEach(mutation=> {
          mutation.addedNodes.forEach(newNode=>{
              if(newNode.nodeType !== 1)
                  return;
              if( newNode.tagName === 'CODE')
                  wrapSpan(newNode.parentElement)
              else
                  wrapSpan(newNode)
          })
      })
  });
  observerInstance.observe(document.body, {
      childList: true,
      subtree: true
  })

})();