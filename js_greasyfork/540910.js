// ==UserScript==
// @name         Copy LaTeX in Gemini and ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Features: 1. Click formula to copy LaTeX 2. Copy text with formula converted to LaTeX
// @author       Cesar
// @match        https://gemini.google.com/app/*
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540910/Copy%20LaTeX%20in%20Gemini%20and%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/540910/Copy%20LaTeX%20in%20Gemini%20and%20ChatGPT.meta.js
// ==/UserScript==

'use strict';

/**
 * @description Set these to how you want inline and display math to be delimited.
 */
const defaultCopyDelimiters = {
    inline: ['$', '$'],    // alternative: ['\(', '\)']
    display: ['\\[ ', ' \\]'], // alternative: ['\[', '\]']
};

// use in Gemini
const allKatex = {};

function isGemini() {
  return document.domain == 'gemini.google.com';
}

if (isGemini()) {
  // 1. 先尝试 Hook window.katex 的赋值
  let originalKatex = window.katex;
  // 2. 如果 katex 已存在，直接 Hook
  if (originalKatex) {
      hookKatexRender(originalKatex);
  } else {
      Object.defineProperty(window, 'katex', {
          set: function(newKatex) {
              console.log('Detected katex assignment, hooking render...');
              originalKatex = newKatex;
              hookKatexRender(originalKatex); // 对新 katex 对象进行 Hook
              return originalKatex;
          },
          get: function() {
              return originalKatex;
          },
          configurable: true
      });
  }

  // 核心 Hook 函数
  function hookKatexRender(katexObj) {
      if (!katexObj || typeof katexObj.render !== 'function') {
          console.warn('katex.render not found, skipping hook');
          return;
      }

      const originalRender = katexObj.render;
      katexObj.render = new Proxy(originalRender, {
          apply: function(target, thisArg, args) {
              let result = target.apply(thisArg, args);
              if (args.length >= 2) {
                  const latexStr = args[0];
                  const element = args[1];
                  const katexHtml = element.querySelector('.katex-html');
                  if (element instanceof Element && katexHtml !== null) {
                      allKatex[katexHtml.outerHTML] = latexStr;
                  } else {
                      console.warn('katex.render: 2nd arg is not a DOM element');
                  }
              }
              return result;
          }
      });
      console.log('Successfully hooked katex.render');
  }
}

function getLatexOfLatexHtml(element) {
    if (element.outerHTML && allKatex[element.outerHTML]) {
        return allKatex[element.outerHTML];
    } else if (element.parentElement.querySelector('.katex-mathml annotation')) {
        // ChatGPT 因为同时渲染了 mathml 和 html 格式的公式，因此在 mathml 的 annotation 就可以拿到
        return element.parentElement.querySelector('.katex-mathml annotation').textContent;
    } else {
        return undefined;
    }
}

// 添加点击事件监听器
function handleKatexClick(event) {
    const katexHtmlElement = event.target.closest('.katex-html');
    if (katexHtmlElement) {
        const latexFormula = getLatexOfLatexHtml(katexHtmlElement);
        if (latexFormula) {
            navigator.clipboard.writeText(latexFormula).then(() => {
                console.log('LaTeX formula copied to clipboard:', latexFormula);
                // 可选：添加视觉反馈
                const originalNone = katexHtmlElement.cloneNode(true);
                katexHtmlElement.textContent = 'Copied!';
                setTimeout(() => {
                    katexHtmlElement.replaceWith(originalNone);
                }, 700);
            }).catch(err => {
                console.error('Failed to copy LaTeX formula:', err);
            });
        } else {
            console.warn('No LaTeX formula found for this element');
        }
    }
}

// 监听文档加载完成后添加点击事件
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', handleKatexClick);
    });
} else {
    document.addEventListener('click', handleKatexClick);
}


/**
 * @description Replace .katex elements with their TeX source (<annotation> element).
 * @param {DocumentFragment} fragment
 * @param {CopyDelimiters} copyDelimiters
 * @returns {DocumentFragment}
 */
function katexReplaceWithTex(
    fragment,
    copyDelimiters = defaultCopyDelimiters
) {
    // Replace .katex-html elements with their latex (by creating a new annotation element)
    // descendant, with inline delimiters.
    const katexHtml = fragment.querySelectorAll('.katex-html');
    for (let i = 0; i < katexHtml.length; i++) {
        const element = katexHtml[i];
        const texSource = document.createElement('annotation');
        const latexFormula = getLatexOfLatexHtml(element);
        if (!latexFormula) continue;
        texSource.textContent = latexFormula;

        // 如果不移除，复制出来的文本里会包含直接复制公式时的乱码
        if (element.parentElement.querySelector('.katex-mathml')) {
            element.parentElement.querySelector('.katex-mathml').remove();
        }
        if (texSource) {
            if (element.replaceWith) {
                element.replaceWith(texSource);
            } else if (element.parentNode) {
                element.parentNode.replaceChild(texSource, element);
            }
            if (texSource.closest('.katex-display')) {
                texSource.textContent = `\n${copyDelimiters.display[0]}${texSource.textContent}${copyDelimiters.display[1]}\n`;
            } else {
                texSource.textContent = `${copyDelimiters.inline[0]}${texSource.textContent}${copyDelimiters.inline[1]}`;
            }
        }
    }

    return fragment;
}


/**
 * @description Return <div class="katex"> element containing node, or null if not found.
 * @param {Node} node
 * @returns {Element|null}
 */
function closestKatex(node) {
    // If node is a Text Node, for example, go up to containing Element,
    // where we can apply the `closest` method.
    const element =
        (node instanceof Element ? node : node.parentElement);
    return element && element.closest('.katex');
}

/**
 * @description Global copy handler to modify behavior on/within .katex elements.
 * @param {ClipboardEvent} event
 */
document.addEventListener('copy', function(event) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !event.clipboardData) {
        return; // default action OK if selection is empty or unchangeable
    }
    const clipboardData = event.clipboardData;
    const range = selection.getRangeAt(0);

    // When start point is within a formula, expand to entire formula.
    const startKatex = closestKatex(range.startContainer);
    if (startKatex) {
        range.setStartBefore(startKatex);
    }

    // Similarly, when end point is within a formula, expand to entire formula.
    const endKatex = closestKatex(range.endContainer);
    if (endKatex) {
        range.setEndAfter(endKatex);
    }

    const fragment = range.cloneContents();
    if (!fragment.querySelector('.katex-html')) {
        return; // default action OK if no .katex-mathml elements
    }

    const htmlContents = Array.prototype.map.call(fragment.childNodes,
        (el) => (el instanceof Text ? el.textContent : el.outerHTML)
    ).join('');

    // Preserve usual HTML copy/paste behavior.
    clipboardData.setData('text/html', htmlContents);
    // Rewrite plain-text version.
    const textContent = katexReplaceWithTex(fragment).textContent;
    if (textContent) {
        clipboardData.setData('text/plain', textContent);
    }

    // 用于 debug 哪里的代码导致 setData 被覆盖
    // clipboardData.setData = new Proxy(clipboardData.setData, {
    //     apply: function(target, thisArg, args) {
    //         console.log('clipboardData.setData', args);
    //         return target.apply(thisArg, args);
    //     }
    // });
    // Prevent normal copy handling.
    event.preventDefault();
    // Gemini 的 copy 事件中会 setData，导致这里的 setData 被覆盖，所以需要 stopImmediatePropagation
    event.stopImmediatePropagation();
});