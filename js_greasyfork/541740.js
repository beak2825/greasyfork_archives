// ==UserScript==
// @name         Modubox HTML JavaScript注入器
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Renders HTML code blocks on modubox.ai chat pages.
// @author       You
// @match        https://modubox.ai/*
// @match        https://www.sexyai.top/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/541740/Modubox%20HTML%20JavaScript%E6%B3%A8%E5%85%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541740/Modubox%20HTML%20JavaScript%E6%B3%A8%E5%85%A5%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- 免责声明和使用协议 ---
  // 1. 本脚本按“原样”提供，不作任何明示或暗示的保证。
  // 2. 用户需自行承担使用本脚本可能带来的所有风险，包括但不限于数据丢失、账户安全问题或与目标网站的服务条款发生冲突。
  // 3. 脚本作者不对因使用或无法使用本脚本而导致的任何直接或间接损害负责。
  // 4. 脚本渲染的所有内容均来自用户输入，其内容的合法性、安全性及可能产生的后果由内容提供者和脚本使用者承担。
  // 5. 请勿将本脚本用于任何非法用途。继续使用本脚本即表示您同意并接受以上所有条款。
  // --- 结束 ---


  // --- Configuration ---
  const APP_READY_SELECTOR = 'uni-app'; // A selector for an element that exists when the app is ready
  const RENDER_TARGET_SELECTOR = 'pre:not([data-rendered]) code';

  console.log('Modubox HTML Renderer: Script started.');

  // --- Styles ---
  GM_addStyle(`
        .rendered-html-container {
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            background-color: #fff;
        }
        .render-toggle-button {
            display: block;
            margin-top: 10px;
            font-size: 12px;
            cursor: pointer;
            padding: 2px 8px;
            border: 1px solid #ccc;
            background-color: #f0f0f0;
            border-radius: 4px;
        }

        .rendered-html-iframe {
            width: 100%;
            border: 1px solid #ddd;
            background-color: #fff;
            margin: 10px 0;
        }
        #modubox-renderer-settings-btn {
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 10001;
            padding: 8px 12px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #modubox-renderer-settings-panel {
            position: fixed;
            top: 200px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            z-index: 10000;
            display: none;
            border-radius: 5px;
        }
    `);

  let displayMode = GM_getValue('displayMode', 'hide'); // 'hide' or 'show'

  function applyDisplayModeForElement(preElement) {
    if (displayMode === 'hide') {
      preElement.hide();
    } else {
      preElement.show();
    }
  }

  function applyDisplayModeToAll() {
    $('.rendered-html-container').each(function () {
      applyDisplayModeForElement($(this).find('pre'));
    });
  }

  function createSettingsPanel() {
    if ($('#modubox-renderer-settings-btn').length) return;

    const panel = $(`
            <div id="modubox-renderer-settings-panel">
                <h4>HTML渲染器设置</h4>
                <div>
                    <label><input type="radio" name="displayMode" value="hide"> 隐藏原始代码</label><br>
                    <label><input type="radio" name="displayMode" value="show"> 显示原始代码</label>
                </div>
                <button id="close-settings" style="margin-top: 10px;">关闭</button>
            </div>
        `);

    const settingsButton = $('<button id="modubox-renderer-settings-btn">HTML渲染器</button>');

    $('body').append(settingsButton).append(panel);

    panel.find(`input[name="displayMode"][value="${displayMode}"]`).prop('checked', true);

    settingsButton.on('click', () => panel.toggle());
    panel.find('#close-settings').on('click', () => panel.hide());
    panel.find('input[name="displayMode"]').on('change', function () {
      displayMode = $(this).val();
      GM_setValue('displayMode', displayMode);
      console.log(`Modubox HTML Renderer: 显示模式已设置为: ${displayMode}`);
      applyDisplayModeToAll();
    });
    console.log('Modubox HTML Renderer: 设置面板已创建。');
  }

  // This function processes a collection of code elements to render them.
  function processElements(elements) {
    elements.each(function () {
      try {
        const codeElement = $(this);
        const codeText = codeElement.text();
        const codeHtml = codeElement.html();

        // We check the raw HTML for an escaped version of <!DOCTYPE html> which highlight.js might create,
        // or the plain text version.
        const isHtmlBlock = /&lt;!DOCTYPE html&gt;/i.test(codeHtml) || /<!DOCTYPE html>/i.test(codeText);

        if (isHtmlBlock) {
          const preElement = codeElement.closest('pre');
          if (preElement.attr('data-rendered')) return;

          console.log('Modubox HTML Renderer: Found HTML block to render.');
          let htmlContent = codeElement.text();
          preElement.attr('data-rendered', 'true');

          // --- SMARTER FIX for escaped HTML by highlight.js ---
          if (htmlContent.includes('&lt;') && htmlContent.includes('&gt;')) {
            console.log('Modubox HTML Renderer: Detected escaped HTML, decoding entities...');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            htmlContent = tempDiv.textContent || tempDiv.innerText || '';
          } else {
            console.log('Modubox HTML Renderer: Content appears to be raw HTML, skipping decoding.');
          }
          // --- END FIX ---

          // --- FIX for malformed HTML: Use a TreeWalker to find all CSS rules in text nodes and move them to a <style> tag in the <head> ---
          try {
            const docParser = new DOMParser();
            const tempDoc = docParser.parseFromString(htmlContent, 'text/html');
            const bodyNode = tempDoc.body;
            let cssContent = '';
            const nodesToRemove = [];

            const filter = {
              acceptNode: function (node) {
                if (
                  node.parentNode &&
                  (node.parentNode.nodeName.toUpperCase() === 'SCRIPT' ||
                    node.parentNode.nodeName.toUpperCase() === 'STYLE')
                ) {
                  return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
              },
            };

            const walker = tempDoc.createTreeWalker(bodyNode, NodeFilter.SHOW_TEXT, filter, false);
            let node;
            while ((node = walker.nextNode())) {
              const trimmedValue = node.nodeValue.trim();
              if (
                trimmedValue.length > 5 &&
                trimmedValue.includes('{') &&
                trimmedValue.includes('}') &&
                (trimmedValue.includes(':') || trimmedValue.startsWith('@'))
              ) {
                cssContent += trimmedValue + '\n';
                nodesToRemove.push(node);
              }
            }

            if (cssContent) {
              console.log('Modubox HTML Renderer: Found and extracted potential CSS from text nodes.');
              nodesToRemove.forEach(node => {
                if (node.parentNode) {
                  node.parentNode.removeChild(node);
                }
              });

              const styleTag = tempDoc.createElement('style');
              styleTag.textContent = cssContent;
              tempDoc.head.appendChild(styleTag);

              htmlContent = tempDoc.documentElement.outerHTML;
              console.log('Modubox HTML Renderer: Injected corrected CSS into head.');
            }
          } catch (e) {
            console.error('Modubox HTML Renderer: Failed during HTML correction.', e);
          }
          // --- END FIX ---

          // --- CSP WORKAROUND: Use a Blob URL instead of srcdoc ---
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);

          const iframe = $(`<iframe class="rendered-html-iframe"></iframe>`);
          iframe.attr('src', url);

          // Clean up the object URL when the iframe is removed to prevent memory leaks.
          iframe.on('remove', function () {
            URL.revokeObjectURL(url);
          });

          iframe.on('load', function () {
            const iframeEl = this;
            console.log('Modubox HTML Renderer: Iframe loaded with srcdoc (unsandboxed).');

            let isAdjusting = false;

            const adjustHeight = () => {
                if (isAdjusting) return;
                isAdjusting = true;

                try {
                    const doc = iframeEl.contentWindow.document;
                    if (!doc || !doc.documentElement) return;

                    const newHeight = Math.ceil(doc.documentElement.scrollHeight);
                    const currentHeight = Math.ceil(parseFloat(iframeEl.style.height || '0'));

                    if (currentHeight !== newHeight) {
                        iframeEl.style.height = newHeight + 'px';
                    }
                } catch (e) {
                    console.error('Modubox HTML Renderer: Failed to calculate iframe height.', e);
                }

                // Use requestAnimationFrame to wait for the next frame before allowing another adjustment.
                requestAnimationFrame(() => {
                    isAdjusting = false;
                });
            };

            // --- ROBUST DYNAMIC HEIGHT ADJUSTMENT (REPLACES RESIZEOBSERVER) ---
            const setupHeightAdjustment = () => {
                const win = iframeEl.contentWindow;
                const doc = win.document;

                if (!win || !doc || !doc.body) {
                    console.error('Modubox HTML Renderer: Iframe content window or document not ready for height adjustment setup.');
                    return;
                }

                // 1. Initial adjustment
                adjustHeight();

                // 2. Adjust after all initial resources (like images) are loaded.
                win.addEventListener('load', adjustHeight);

                // 3. Use MutationObserver for dynamic content changes (e.g., from scripts).
                const mutationObserver = new MutationObserver(adjustHeight);
                mutationObserver.observe(doc.body, { childList: true, subtree: true, attributes: true });

                // 4. Fallback for images that might load later or be added dynamically.
                const images = doc.getElementsByTagName('img');
                for (const img of images) {
                    img.addEventListener('load', adjustHeight);
                    img.addEventListener('error', adjustHeight); // Also adjust if an image fails to load
                }
            };

            // The 'load' event on the iframe itself is the entry point.
            setupHeightAdjustment();
          });

          const container = $('<div class="rendered-html-container" data-renderer-managed></div>');
          const toggleButton = $('<button class="render-toggle-button">显示/隐藏原始代码</button>');

          // Append the iframe and button to the new container
          container.append(iframe).append(toggleButton);

          // Insert the container *after* the original <pre> element instead of replacing it.
          preElement.after(container);

          // The button now toggles the original pre element.
          toggleButton.on('click', () => preElement.toggle());

          // Apply the initial display mode to the original pre element.
          applyDisplayModeForElement(preElement);
        }
      } catch (e) {
        console.error('Modubox HTML Renderer: Error processing a code block.', e);
      }
    });
  }

  function startObserver() {
    console.log('Modubox HTML Renderer: Starting MutationObserver.');
    const observer = new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        // --- Defensive check: Ignore mutations within our own rendered containers ---
        if (mutation.target && $(mutation.target).closest('[data-renderer-managed]').length) {
          continue;
        }

        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && !$(node).closest('[data-renderer-managed]').length) {
              // ELEMENT_NODE and not inside our container
              const newCodeElements = $(node).find(RENDER_TARGET_SELECTOR).addBack(RENDER_TARGET_SELECTOR);
              if (newCodeElements.length > 0) {
                console.log('Modubox HTML Renderer: Detected new code blocks via MutationObserver.');
                processElements(newCodeElements);
              }
            }
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('Modubox HTML Renderer: MutationObserver is now observing the document body.');
  }

  function initialize() {
    console.log('Modubox HTML Renderer: 初始化...');
    try {
      createSettingsPanel();
      // Process any elements that are already on the page
      processElements($(RENDER_TARGET_SELECTOR));
      // Start observing for future changes
      startObserver();
      console.log('Modubox HTML Renderer: 初始化完成，观察者已启动。');
    } catch (e) {
      console.error('Modubox HTML Renderer: 初始化失败。', e);
    }
  }

  // --- Robust Initialization for SPA ---
  console.log(`Modubox HTML Renderer: Waiting for app to be ready ('${APP_READY_SELECTOR}')...`);
  const initInterval = setInterval(() => {
    if ($(APP_READY_SELECTOR).length) {
      console.log('Modubox HTML Renderer: App is ready!');
      clearInterval(initInterval);
      // A small delay can still be helpful for everything to settle.
      setTimeout(initialize, 500);
    }
  }, 500);
})();
