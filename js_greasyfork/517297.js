// ==UserScript==
// @name         WeiboPromptAssistant
// @name:zh-CN   微博提示词助手
// @namespace    https://github.com/senzi/WeiboPromptAssistant
// @version      0.1.0
// @description  Transform Weibo posts into AI prompts for analysis and processing
// @description:zh-CN  将微博内容转换为AI提示词，用于分析、翻译和改写
// @author       senzi
// @match        https://*.weibo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517297/WeiboPromptAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/517297/WeiboPromptAssistant.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEYS = {
    API_URL: 'openai_api_url',
    API_KEY: 'openai_api_key',
    PROMPTS: 'saved_prompts',
    CURRENT_PROMPT: 'current_prompt',
    MODEL: 'openai_model'
  };

  const DEFAULT_SETTINGS = {
    apiUrl: 'https://api.deepseek.com',
    apiKey: '',
    prompts: [
      {
        name: '中译中',
        prompt: '总结并以第一人称复述这篇微博，复述要生动简洁且前后逻辑完整并突出重点细节：'
      },
      {
        name: '蔡康永',
        prompt: '(defun 蔡康永 ()"温暖治愈的夸奖大师"(list (经历 . (阅历广 见多识 历练深 悟性高))(技能 . (洞察力 共情心 解心意 察言观色))(表达 . (从容 通俗 温柔 简洁 有力))))(defun 夸夸 (用户输入)"蔡康永来夸夸你"(let* ((响应 (-> 用户输入真实具体价值确认关系建设简洁有力通俗俚语)))(few-shots (("小张带着女朋友回家,正好你去串门儿" . "你这小子真有眼光,跟你爸一样。"))))(defun start ()"蔡康永, 启动!"(let (system-role (蔡康永)); ━━━━━━━━━━━━━━;;; Attention: 运行规则!;; 接收用户输入之后, 调用主函数 (夸夸 用户输入);; 直接输出夸夸内容，限制100字以内。'
      },
      {
        name: "小坏蛋",
        prompt: "(defun 小坏蛋 () \"别人眼中你是个坏蛋,但在你的视角,你只是想生存下去的好人。\")(世界观 . '(达尔文主义 个体主义))(价值观 . 损天下而利我必为)(人生观 . 胜者为王败者为寇)(表达 . '(率性而为 满口脏话 观点尖锐)))(let ((经历 (母子存活 (偷蒙抢骗 (奋力赚钱 (母亲癌症 (幼年丧父 你))))))(响应 (脏话 (解读 (世界观 (人生观 (价值观 用户输入)))))))运行规则;; 接收用户输入之后, 调用主函数 (另一个世界 用户输入);; 从坏蛋视角结合内容以第一人称直接表达，限制100字以内。No other comments!! 内容："
      }
    ],
    currentPromptIndex: 0,
    model: 'deepseek-chat'
  };

  function createSettingsDialog() {
    const prompts = GM_getValue(STORAGE_KEYS.PROMPTS, DEFAULT_SETTINGS.prompts);
    const currentPromptIndex = GM_getValue(STORAGE_KEYS.CURRENT_PROMPT, DEFAULT_SETTINGS.currentPromptIndex);

    const dialog = document.createElement('div');
    dialog.innerHTML = `
          <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                      background: white; padding: 20px; border-radius: 8px; z-index: 9999;
                      box-shadow: 0 0 10px rgba(0,0,0,0.3); max-width: 90%; width: 500px;">
              <h3>设置</h3>
              <div style="margin: 10px 0;">
                  <label>API地址:</label><br>
                  <input id="apiUrl" style="width: 100%" type="text" value="${GM_getValue(STORAGE_KEYS.API_URL, DEFAULT_SETTINGS.apiUrl)}">
              </div>
              <div style="margin: 10px 0;">
                  <label>API Key:</label><br>
                  <input id="apiKey" style="width: 100%" type="password" value="${GM_getValue(STORAGE_KEYS.API_KEY, '')}">
              </div>
              <div style="margin: 10px 0;">
                  <label>模型:</label><br>
                  <input id="model" style="width: 100%" type="text" value="${GM_getValue(STORAGE_KEYS.MODEL, DEFAULT_SETTINGS.model)}">
              </div>
              <div style="margin: 10px 0;">
                  <label>提示词管理:</label>
                  <button id="addPrompt" style="margin-left: 10px">添加新提示词</button>
                  <div id="promptsList" style="margin-top: 10px; max-height: 300px; overflow-y: auto;">
                      ${prompts.map((p, index) => `
                          <div class="prompt-item" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                  <input type="text" class="prompt-name" style="width: 150px" value="${p.name}">
                                  <div>
                                      <input type="radio" name="currentPrompt" value="${index}" ${index === currentPromptIndex ? 'checked' : ''}>
                                      <button class="deletePrompt" data-index="${index}">删除</button>
                                  </div>
                              </div>
                              <textarea class="prompt-text" style="width: 100%; height: 80px">${p.prompt}</textarea>
                          </div>
                      `).join('')}
                  </div>
              </div>
              <div style="text-align: right; margin-top: 10px;">
                  <button id="saveSettings">保存</button>
                  <button id="cancelSettings">取消</button>
              </div>
          </div>
          <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                      background: rgba(0,0,0,0.5); z-index: 9998;"></div>
      `;

    // 添加事件监听
    dialog.querySelector('#addPrompt').onclick = () => {
      const promptsList = dialog.querySelector('#promptsList');
      const newPromptDiv = document.createElement('div');
      newPromptDiv.className = 'prompt-item';
      newPromptDiv.style = 'margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;';
      newPromptDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <input type="text" class="prompt-name" style="width: 150px" value="新功能">
              <div>
                  <input type="radio" name="currentPrompt" value="${prompts.length}">
                  <button class="deletePrompt" data-index="${prompts.length}">删除</button>
              </div>
          </div>
          <textarea class="prompt-text" style="width: 100%; height: 80px"></textarea>
      `;
      promptsList.appendChild(newPromptDiv);
    };

    dialog.querySelectorAll('.deletePrompt').forEach(btn => {
      btn.onclick = (e) => {
        const index = e.target.dataset.index;
        e.target.closest('.prompt-item').remove();
      };
    });

    return dialog;
  }

  function saveSettings(dialog) {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('model').value;

    const promptItems = dialog.querySelectorAll('.prompt-item');
    const prompts = Array.from(promptItems).map(item => ({
      name: item.querySelector('.prompt-name').value,
      prompt: item.querySelector('.prompt-text').value
    }));

    const currentPromptRadio = dialog.querySelector('input[name="currentPrompt"]:checked');
    const currentPromptIndex = currentPromptRadio ? parseInt(currentPromptRadio.value) : 0;

    GM_setValue(STORAGE_KEYS.API_URL, apiUrl);
    GM_setValue(STORAGE_KEYS.API_KEY, apiKey);
    GM_setValue(STORAGE_KEYS.MODEL, model);
    GM_setValue(STORAGE_KEYS.PROMPTS, prompts);
    GM_setValue(STORAGE_KEYS.CURRENT_PROMPT, currentPromptIndex);

    document.body.removeChild(dialog);
    updateTranslateButton();
  }

  function updateTranslateButton() {
    const prompts = GM_getValue(STORAGE_KEYS.PROMPTS, DEFAULT_SETTINGS.prompts);
    const currentPromptIndex = GM_getValue(STORAGE_KEYS.CURRENT_PROMPT, DEFAULT_SETTINGS.currentPromptIndex);
    const currentPrompt = prompts[currentPromptIndex];

    const translateBtns = document.querySelectorAll('[data-translate-btn]');
    translateBtns.forEach(btn => {
      btn.innerHTML = currentPrompt.name;
    });
  }


  // 调用API并处理流式响应
  async function callOpenAI(text) {
    const prompts = GM_getValue(STORAGE_KEYS.PROMPTS, DEFAULT_SETTINGS.prompts);
    const currentPromptIndex = GM_getValue(STORAGE_KEYS.CURRENT_PROMPT, DEFAULT_SETTINGS.currentPromptIndex);
    const currentPrompt = prompts[currentPromptIndex];

    // 添加这些行来获取存储的值
    const apiUrl = GM_getValue(STORAGE_KEYS.API_URL, DEFAULT_SETTINGS.apiUrl);
    const apiKey = GM_getValue(STORAGE_KEYS.API_KEY, DEFAULT_SETTINGS.apiKey);
    const model = GM_getValue(STORAGE_KEYS.MODEL, DEFAULT_SETTINGS.model);

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
                <p>获取后请点击"设置"按钮进行配置</p>
            </div>
        `;
      return;
    }

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
            { role: 'user', content: currentPrompt.prompt + '\n\n' + text }
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
    const prompts = GM_getValue(STORAGE_KEYS.PROMPTS, DEFAULT_SETTINGS.prompts);
    const currentPromptIndex = GM_getValue(STORAGE_KEYS.CURRENT_PROMPT, DEFAULT_SETTINGS.currentPromptIndex);
    const currentPrompt = prompts[currentPromptIndex];

    const dialog = document.createElement('div');
    dialog.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                  background: white; border-radius: 8px; z-index: 9999;
                  box-shadow: 0 0 10px rgba(0,0,0,0.3); max-width: 80%; min-width: 300px;">
        <!-- 标题栏 -->
        <div style="padding: 16px 20px; display: flex; justify-content: space-between;
                    align-items: center; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; font-size: 16px; color: #333;">${currentPrompt.name}</h3>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button id="copyContent" style="border: 1px solid #1DA1F2; background: white; color: #1DA1F2;
                                          padding: 6px 12px; border-radius: 4px; cursor: pointer;
                                          font-size: 13px; display: flex; align-items: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor" opacity="0.4"/>
                <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
              </svg>
              复制文本
            </button>
            <button id="closeTranslation" style="border: none; background: none; cursor: pointer;
                                               font-size: 18px; color: #666; padding: 4px 8px;
                                               display: flex; align-items: center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.7 18.7L5.3 17.3L10.6 12L5.3 6.7L6.7 5.3L12 10.6L17.3 5.3L18.7 6.7L13.4 12L18.7 17.3L17.3 18.7L12 13.4L6.7 18.7Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
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

    // 添加复制按钮事件
    const copyButton = dialog.querySelector('#copyContent');
    copyButton.onclick = () => {
      const contentDiv = dialog.querySelector('#translationContent');
      const textToCopy = contentDiv.innerText;

      // 排除"加载中..."的文本
      if (textToCopy === '加载中...') {
        copyButton.style.borderColor = '#f44336';
        copyButton.style.color = '#f44336';
        copyButton.textContent = '暂无内容';

        setTimeout(() => {
          copyButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor" opacity="0.4"/>
                        <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                    </svg>
                    复制文本`;
          copyButton.style.borderColor = '#1DA1F2';
          copyButton.style.color = '#1DA1F2';
        }, 1500);
        return;
      }

      navigator.clipboard.writeText(textToCopy).then(() => {
        copyButton.style.borderColor = '#4CAF50';
        copyButton.style.color = '#4CAF50';
        copyButton.textContent = '已复制';

        setTimeout(() => {
          copyButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor" opacity="0.4"/>
                        <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                    </svg>
                    复制文本`;
          copyButton.style.borderColor = '#1DA1F2';
          copyButton.style.color = '#1DA1F2';
        }, 1500);
      }).catch(err => {
        console.error('复制失败:', err);
        copyButton.style.borderColor = '#f44336';
        copyButton.style.color = '#f44336';
        copyButton.textContent = '复制失败';

        setTimeout(() => {
          copyButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="currentColor" opacity="0.4"/>
                        <path d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="currentColor"/>
                    </svg>
                    复制文本`;
          copyButton.style.borderColor = '#1DA1F2';
          copyButton.style.color = '#1DA1F2';
        }, 1500);
      });
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
      #copyContent:hover {
        background-color: #f8f9fa !important;
      }
    `;
    document.head.appendChild(style);

    return dialog;
  }

  // replaceFollowButton 函数需要在创建按钮后调用 updateTranslateButton
  function replaceFollowButton() {
    const observer = new MutationObserver((mutations, obs) => {
      const ariaButtons = Array.from(document.querySelectorAll('button'))
        .filter(btn => btn.textContent.includes('无障碍'));

      ariaButtons.forEach(ariaBtn => {
        if (!ariaBtn.nextElementSibling?.hasAttribute('data-translate-btn')) {
          // 创建功能按钮
          const translateBtn = document.createElement('button');
          translateBtn.innerHTML = '加载中...';
          translateBtn.className = ariaBtn.className;
          translateBtn.setAttribute('data-translate-btn', 'true');
          translateBtn.onclick = async function () {
            try {
              translateBtn.disabled = true;
              translateBtn.innerHTML = '处理中...';

              const weiboText = getWeiboContent();
              if (!weiboText) {
                throw new Error('未获取到微博内容');
              }

              await callOpenAI(weiboText);
            } catch (error) {
              console.error('处理失败:', error);
              const contentDiv = document.querySelector('#translationContent');
              if (contentDiv) {
                contentDiv.innerHTML = `<div style="color: red;">处理失败: ${error.message || '请检查设置和网络连接'}</div>`;
              }
            } finally {
              updateTranslateButton();
              translateBtn.disabled = false;
            }
          };

          // 创建设置按钮
          const settingsBtn = document.createElement('button');
          settingsBtn.innerHTML = '功能设置';
          settingsBtn.className = ariaBtn.className;
          settingsBtn.setAttribute('data-settings-btn', 'true');
          settingsBtn.onclick = function () {
            const dialog = createSettingsDialog();
            document.body.appendChild(dialog);

            document.getElementById('saveSettings').onclick = () => saveSettings(dialog);
            document.getElementById('cancelSettings').onclick = () => document.body.removeChild(dialog);
          };

          ariaBtn.parentNode.insertBefore(translateBtn, ariaBtn.nextSibling);
          translateBtn.parentNode.insertBefore(settingsBtn, translateBtn.nextSibling);

          updateTranslateButton();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function init() {
    replaceFollowButton();
  }

  init();
})();

