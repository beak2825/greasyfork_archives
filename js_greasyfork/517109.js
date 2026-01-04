// ==UserScript==
// @name         申请微博中译中
// @namespace    https://github.com/SomiaWhiteRing/chinese2chinese4weibo
// @version      0.2
// @description  将微博内容翻译成更易理解的中文 Github:https://github.com/SomiaWhiteRing/chinese2chinese4weibo
// @author       WhiteRing
// @match        https://*.weibo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517109/%E7%94%B3%E8%AF%B7%E5%BE%AE%E5%8D%9A%E4%B8%AD%E8%AF%91%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/517109/%E7%94%B3%E8%AF%B7%E5%BE%AE%E5%8D%9A%E4%B8%AD%E8%AF%91%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 存储设置的key
  const STORAGE_KEYS = {
    API_URL: 'openai_api_url',
    API_KEY: 'openai_api_key',
    PROMPT: 'default_prompt',
    MODEL: 'openai_model'
  };

  // 默认设置
  const DEFAULT_SETTINGS = {
    apiUrl: 'https://api.deepseek.com',
    apiKey: '',
    prompt: '总结并以第一人称复述这篇微博，复述要生动简洁且前后逻辑完整并突出重点细节：',
    model: 'deepseek-chat'
  };

  // 创建设置弹窗
  function createSettingsDialog() {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                      background: white; padding: 20px; border-radius: 8px; z-index: 9999;
                      box-shadow: 0 0 10px rgba(0,0,0,0.3);">
              <h3>设置</h3>
              <div style="margin: 10px 0;">
                  <label>API地址:</label><br>
                  <input id="apiUrl" style="width: 300px" type="text" value="${GM_getValue(STORAGE_KEYS.API_URL, DEFAULT_SETTINGS.apiUrl)}">
              </div>
              <div style="margin: 10px 0;">
                  <label>API Key:</label><br>
                  <input id="apiKey" style="width: 300px" type="password" value="${GM_getValue(STORAGE_KEYS.API_KEY, '')}">
              </div>
              <div style="margin: 10px 0;">
                  <label>模型:</label><br>
                  <input id="model" style="width: 300px" type="text" value="${GM_getValue(STORAGE_KEYS.MODEL, DEFAULT_SETTINGS.model)}">
              </div>
              <div style="margin: 10px 0;">
                  <label>默认提示词:</label><br>
                  <textarea id="prompt" style="width: 300px; height: 100px">${GM_getValue(STORAGE_KEYS.PROMPT, DEFAULT_SETTINGS.prompt)}</textarea>
              </div>
              <div style="text-align: right; margin-top: 10px;">
                  <button id="saveSettings">保存</button>
                  <button id="cancelSettings">取消</button>
              </div>
          </div>
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                      background: rgba(0,0,0,0.5); z-index: 9998;"></div>
      `;

    return dialog;
  }

  // 保存设置
  function saveSettings(dialog) {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const prompt = document.getElementById('prompt').value;
    const model = document.getElementById('model').value;

    GM_setValue(STORAGE_KEYS.API_URL, apiUrl);
    GM_setValue(STORAGE_KEYS.API_KEY, apiKey);
    GM_setValue(STORAGE_KEYS.PROMPT, prompt);
    GM_setValue(STORAGE_KEYS.MODEL, model);

    document.body.removeChild(dialog);
  }

  // 调用API并处理流式响应
  async function callOpenAI(text) {
    const apiUrl = GM_getValue(STORAGE_KEYS.API_URL);
    const apiKey = GM_getValue(STORAGE_KEYS.API_KEY);

    if (!apiUrl || !apiKey) {
        // 创建引导对话框
        const dialog = createTranslationDialog();
        document.body.appendChild(dialog);
        const contentDiv = dialog.querySelector('#translationContent');
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p>您还未配置 API 密钥，请先获取密钥：</p>
                <p><a href="https://platform.deepseek.com/api_keys"
                      target="_blank"
                      style="color: #1DA1F2; text-decoration: none;">
                    点击这里获取 DeepSeek API 密钥
                </a></p>
                <p>获取后请点击"翻译设置"按钮进行配置</p>
            </div>
        `;
        return;
    }

    const prompt = GM_getValue(STORAGE_KEYS.PROMPT);
    const model = GM_getValue(STORAGE_KEYS.MODEL, DEFAULT_SETTINGS.model);

    console.log('开始API调用...');

    // 创建对话框
    const dialog = createTranslationDialog();
    document.body.appendChild(dialog);
    const contentDiv = dialog.querySelector('#translationContent');
    let fullContent = '';

    try {
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: prompt + '\n\n' + text }
          ],
          temperature: 0.7,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const jsonStr = line.slice(6);
              const json = JSON.parse(jsonStr);
              const delta = json.choices[0]?.delta?.content || '';

              if (delta) {
                fullContent += delta;
                if (contentDiv) {
                  contentDiv.innerHTML = fullContent.split('\n').map(line =>
                    `<p style="margin: 0.5em 0;">${line}</p>`
                  ).join('');
                  contentDiv.scrollTop = contentDiv.scrollHeight;
                }
              }
            } catch (e) {
              console.log('解析数据出错:', e, '原始数据:', line);
            }
          }
        }
      }

      // 处理最后可能剩余的数据
      if (buffer) {
        console.log('处理剩余数据:', buffer);
      }

      return fullContent;

    } catch (error) {
      console.error('API调用失败:', error);
      throw error;
    }
  }

  // 获取微博正文内容
  function getWeiboContent() {
    // 尝试获取微博正文内容
    const contentSelectors = [
      '[class*="detail_wbtext"]', // 模糊匹配detail_wbtext
      '[class*="Feed_body"] [class*="wbtext"]', // Feed_body下的wbtext
      '.wbpro-feed-content' // 旧版微博正文class
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        content = element.innerText.trim();
        if (content) {
          console.log('找到微博正文:', selector);
          break;
        }
      }
    }

    if (!content) {
      throw new Error('未找到微博正文内容');
    }

    return content;
  }

  // 创建翻译结果对话框
  function createTranslationDialog() {
    const dialog = document.createElement('div');
    dialog.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                  background: white; border-radius: 8px; z-index: 9999;
                  box-shadow: 0 0 10px rgba(0,0,0,0.3); max-width: 80%; min-width: 300px;">
        <!-- 标题栏 -->
        <div style="padding: 16px 20px; display: flex; justify-content: space-between;
                    align-items: center; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; font-size: 16px; color: #333;">申请中译中！</h3>
          <button id="closeTranslation" style="border: none; background: none; cursor: pointer;
                                             font-size: 18px; color: #666; padding: 4px 8px;">✕</button>
        </div>
        <!-- 内容区域 -->
        <div style="padding: 20px;">
          <div id="translationContent" style="margin: 0; line-height: 1.6; font-size: 14px;
                                            max-height: 60vh; overflow-y: auto; padding-right: 10px;">
            <div class="loading" style="text-align: center;">
              <span>加载中...</span>
            </div>
          </div>
        </div>
      </div>
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                  background: rgba(0,0,0,0.5); z-index: 9998;"></div>
    `;

    // 添加关闭事件
    dialog.querySelector('#closeTranslation').onclick = () => {
      document.body.removeChild(dialog);
    };

    // 添加自定义滚动条样式
    const style = document.createElement('style');
    style.textContent = `
      #translationContent::-webkit-scrollbar {
        width: 8px;
      }
      #translationContent::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      #translationContent::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      #translationContent::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
    document.head.appendChild(style);

    return dialog;
  }

  // 替换关注按钮
  function replaceFollowButton() {
    const observer = new MutationObserver((mutations, obs) => {
      const ariaButtons = Array.from(document.querySelectorAll('button'))
        .filter(btn => btn.textContent.includes('无障碍'));

      ariaButtons.forEach(ariaBtn => {
        if (!ariaBtn.nextElementSibling?.hasAttribute('data-translate-btn')) {
          // 创建翻译按钮
          const translateBtn = document.createElement('button');
          translateBtn.innerHTML = '中译中';
          translateBtn.className = ariaBtn.className;
          translateBtn.setAttribute('data-translate-btn', 'true');
          translateBtn.onclick = async function () {
            try {
              console.log('点击翻译按钮');
              translateBtn.disabled = true;
              translateBtn.innerHTML = '翻译中...';

              const weiboText = getWeiboContent();
              console.log('获取到微博文本:', weiboText);

              if (!weiboText) {
                throw new Error('未获取到微博内容');
              }

              console.log('开始调用API');
              await callOpenAI(weiboText);

            } catch (error) {
              console.error('翻译失败:', error);
              const contentDiv = document.querySelector('#translationContent');
              if (contentDiv) {
                contentDiv.innerHTML = `<div style="color: red;">翻译失败: ${error.message || '请检查设置和网络连接'}</div>`;
              }
            } finally {
              translateBtn.disabled = false;
              translateBtn.innerHTML = '中译中';
            }
          };

          // 创建设置按钮
          const settingsBtn = document.createElement('button');
          settingsBtn.innerHTML = '翻译设置';
          settingsBtn.className = ariaBtn.className;
          settingsBtn.setAttribute('data-settings-btn', 'true');
          settingsBtn.onclick = function () {
            const dialog = createSettingsDialog();
            document.body.appendChild(dialog);

            document.getElementById('saveSettings').onclick = () => saveSettings(dialog);
            document.getElementById('cancelSettings').onclick = () => document.body.removeChild(dialog);
          };

          // 插入按钮
          ariaBtn.parentNode.insertBefore(translateBtn, ariaBtn.nextSibling);
          translateBtn.parentNode.insertBefore(settingsBtn, translateBtn.nextSibling);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初始化
  function init() {
    replaceFollowButton();
  }

  init();
})();

