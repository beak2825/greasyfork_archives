// ==UserScript==
// @name        Boost.org - Source Highlight
// @namespace   uk.jixun
// @match       https://www.boost.org/doc/*
// @grant       none
// @version     1.0
// @author      Jixun
// @description Add code highlight to boost.org pages.
// @run-at      document-start
// @license     apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/444618/Boostorg%20-%20Source%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/444618/Boostorg%20-%20Source%20Highlight.meta.js
// ==/UserScript==

function main() {
  const codeBlocks = Array.from(document.querySelectorAll('pre'));
  if (codeBlocks.length === 0) return;

  const stylesheet = document.createElement('link');
  Object.assign(stylesheet, {
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/styles/default.min.css',
  });
  document.head.appendChild(stylesheet);

  const hljsScript = document.createElement('script');
  Object.assign(hljsScript, {
    src: 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/highlight.min.js',
    onload: () => {
      hljs.configure({
        languages: ['cpp'],
        ignoreUnescapedHTML: true, // anchors
      });
      for(const codeBlock of codeBlocks) {
        const anchors = codeBlock.querySelectorAll('a');
        hljs.highlightElement(codeBlock);
        
        if (anchors.length === 0) continue;
        const urlMap = new Map(Array.from(anchors, anchor => [anchor.textContent, anchor.href]));
        console.info(urlMap);

        for (const strEl of codeBlock.querySelectorAll('.hljs-string')) {
          const fileName = strEl.textContent.slice(1, -1);
          console.info('searching for %s...', fileName);
          if (urlMap.has(fileName)) {
            const newAnchor = document.createElement('a');
            newAnchor.href = urlMap.get(fileName);
            newAnchor.style.borderBottom = '1px dotted';
            strEl.insertAdjacentElement('afterend', newAnchor);
            newAnchor.appendChild(strEl);
          }
        }
      }
    },
  });
  document.head.appendChild(hljsScript);
}

if (document.readyState === 'loading' && !document.head) {
  addEventListener('DOMContentLoaded', main);  
} else {
  main();
}
