// ==UserScript==
// @name         Linux Do Translate
// @namespace    linux-do-translate
// @version      0.2.4
// @author       delph1s
// @license      MIT
// @description  对回复进行翻译
// @match        https://linux.do/t/topic/*
// @connect      *
// @icon         https://cdn.linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/514961/Linux%20Do%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/514961/Linux%20Do%20Translate.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const REQUIRED_CHARS = 6;
  const SPACE_PRESS_COUNT = 3; // 连按次数
  const SPACE_PRESS_TIMEOUT = 1500; // 连续按键的最大时间间隔（毫秒）
  const TRANSLATE_PROVIDERS = [
    {
      text: 'LinuxDo Deeplx',
      value: 'deeplx-linuxdo',
    },
    {
      text: 'Deeplx',
      value: 'deeplx',
    },
    {
      text: 'Deepl',
      value: 'deepl',
    },
    {
      text: 'OpenAI',
      value: 'oai',
    },
    {
      text: 'OpenAI Proxy',
      value: 'oai-proxy',
    },
  ];
  const NOT_CUSTOM_URL_PROVIDERS = ['oai', 'deepl', 'deeplx-linuxdo'];
  const TRANSLATE_TARGET_LANG = {
    EN: { oai: 'English', deepl: 'EN' },
    ZH: { oai: 'Chinese', deepl: 'ZH' },
  };
  const TRANSLATE_TARGET_LANG_OPTIONS = [
    {
      text: 'English(英文)',
      value: 'EN',
    },
    {
      text: '中文(Chinese)',
      value: 'ZH',
    },
  ];
  const DEFAULT_CONFIG = {
    maxRetryTimes: 5,
    customUrl: '',
    authKey: '',
    enableTranslate: false,
    translateSourceLang: 'ZH',
    translateTargetLang: 'EN',
    translateProvider: 'deeplx-linuxdo',
    translateModel: 'gpt-4o',
    translateLayout: 'top',
    translateSize: 80,
    translateItalics: true,
    translateBold: false,
    translateReference: false,
    closeConfigAfterSave: true,
  };

  const uiIDs = {
    replyControl: 'reply-control',
    configButton: 'multi-lang-say-config-button',
    configPanel: 'multi-lang-say-config-panel',
    customUrlInput: 'custom-url-input',
    authKeyInput: 'auth-key-input',
    enableTranslateSwitch: 'enable-translate-switch',
    translateSourceLangSelect: 'translate-source-lang-select',
    translateTargetLangSelect: 'translate-target-lang-select',
    translateProviderSelect: 'translate-provider-select',
    translateModelInput: 'translate-model-input',
    translateLayoutSelect: 'translate-layout-select',
    translateSizeInput: 'translate-size-input',
    translateItalicsSwitch: 'translate-italics-switch',
    translateBoldSwitch: 'translate-bold-switch',
    translateReferenceSwitch: 'translate-reference-switch',
    closeConfigAfterSaveSwitch: 'close-after-save-switch',
  };

  let config = {
    maxRetryTimes: GM_getValue('maxRetryTimes', DEFAULT_CONFIG.maxRetryTimes),
    customUrl: GM_getValue('customUrl', DEFAULT_CONFIG.customUrl),
    authKey: GM_getValue('authKey', DEFAULT_CONFIG.authKey),
    enableTranslate: GM_getValue('enableTranslate', DEFAULT_CONFIG.enableTranslate),
    translateSourceLang: GM_getValue('translateSourceLang', DEFAULT_CONFIG.translateSourceLang),
    translateTargetLang: GM_getValue('translateTargetLang', DEFAULT_CONFIG.translateTargetLang),
    translateProvider: GM_getValue('translateProvider', DEFAULT_CONFIG.translateProvider),
    translateModel: GM_getValue('translateModel', DEFAULT_CONFIG.translateModel),
    translateLayout: GM_getValue('translateLayout', DEFAULT_CONFIG.translateLayout),
    translateSize: GM_getValue('translateSize', DEFAULT_CONFIG.translateSize),
    translateItalics: GM_getValue('translateItalics', DEFAULT_CONFIG.translateItalics),
    translateBold: GM_getValue('translateBold', DEFAULT_CONFIG.translateBold),
    translateReference: GM_getValue('translateReference', DEFAULT_CONFIG.translateReference),
    closeConfigAfterSave: GM_getValue('closeConfigAfterSave', DEFAULT_CONFIG.closeConfigAfterSave),
  };

  const genFormatDateTime = d => {
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const genFormatNow = () => {
    return genFormatDateTime(new Date());
  };

  /**
   * 获取随机整数
   *
   * @param {number} start 范围开始
   * @param {number} end 范围结束
   * @returns
   */
  const randInt = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  };

  /**
   * 随机睡眠（毫秒）
   *
   * @param {number} start 范围开始
   * @param {number} end 范围结束
   */
  const randSleep = async (start = 2000, end = 3000) => {
    // 生成随机整数 randSleepTime，范围在 start 到 end 之间
    const randSleepTime = getRandomInt(start, end);
    // 睡眠时间
    return await new Promise(resolve => setTimeout(resolve, randSleepTime));
  };

  /**
   * 是否相同
   *
   * @param a
   * @param b
   * @returns
   */
  const isEqual = (a, b) => {
    if (a === null || a === undefined || b === null || b === undefined) {
      return a === b;
    }

    if (typeof a !== typeof b) {
      return false;
    }

    if (typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean') {
      return a === b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }

      return a.every((item, index) => isEqual(item, b[index]));
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a || {});
      const keysB = Object.keys(b || {});

      if (keysA.length !== keysB.length) {
        return false;
      }

      return keysA.every(key => isEqual(a[key], b[key]));
    }

    return false;
  };

  /**
   * 判断字符串中是否包含中文字符
   * @param {string} text
   * @returns {boolean}
   */
  const containsChinese = text => {
    return /[\u4e00-\u9fa5]/.test(text);
  };

  const getInvertColor = hex => {
    // 去掉前面的“#”字符
    hex = hex.replace('#', '');

    // 如果输入的是3位的hex值，转换为6位的
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    // 计算相反的颜色
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
  };

  const deeplxReq = text => {
    return {
      url: config.authKey ? `${config.customUrl}?token=${config.authKey}` : config.customUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        text: text,
        target_lang: TRANSLATE_TARGET_LANG[config.translateTargetLang].deepl,
        source_lang: 'auto',
      }),
      responseType: 'json',
    };
  };

  const deeplxLinuxdoReq = text => {
    return {
      url: `https://api.deeplx.org/${config.authKey}/translate`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        text: text,
        target_lang: TRANSLATE_TARGET_LANG[config.translateTargetLang].deepl,
        source_lang: 'auto',
      }),
      responseType: 'json',
    };
  };

  const deeplReq = text => {
    const authKey = config.authKey;
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', TRANSLATE_TARGET_LANG[config.translateTargetLang].deepl);
    params.append('source_lang', TRANSLATE_TARGET_LANG[config.translateSourceLang].deepl);
    return {
      url: 'https://api.deepl.com/v2/translate', // DeepL Pro API
      headers: {
        Authorization: `DeepL-Auth-Key ${authKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: params.toString(),
      responseType: 'json',
    };
  };

  const deeplRes = res => {
    return res?.translations?.[0]?.text;
  };

  const oaiReq = (
    text,
    model = 'gpt-3.5-turbo',
    url = 'https://api.openai.com/v1/chat/completions',
    temperature = 0.5,
    maxTokens = 32000
  ) => {
    const authKey = config.authKey;
    return {
      url: url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authKey}`,
      },
      data: JSON.stringify({
        model: model, // 或者您订阅的其他模型，例如 'gpt-4'
        messages: [
          {
            role: 'system',
            content:
              'You are a highly skilled translation engine. Your function is to translate texts accurately into the target {{to}}, maintaining the original format, technical terms, and abbreviations. Do not add any explanations or annotations to the translated text.',
          },
          {
            role: 'user',
            content: `Translate the following source text to ${
              TRANSLATE_TARGET_LANG[config.translateTargetLang].oai
            }, Output translation directly without any additional text.\nSource Text: ${text}\nTranslated Text:`,
          },
        ],
        temperature: temperature, // 控制生成内容的随机性，范围是 0 到 1
        max_tokens: maxTokens, // 响应的最大标记数
      }),
      responseType: 'json',
    };
  };

  const oaiRes = res => {
    return res.choices[0].message.content.trim();
  };

  const translateText = text => {
    const isDeepl = config.translateProvider === 'deepl';
    const isOAI = config.translateProvider === 'oai' || config.translateProvider === 'oai-proxy';

    let reqData;

    if (!config.authKey) {
      if (!config.customUrl) return '';
      if (config.translateProvider === 'deeplx') {
        reqData = deeplxReq(text);
      } else {
        return '';
      }
    } else if (isDeepl) {
      reqData = deeplReq(text);
    } else if (isOAI) {
      reqData = oaiReq(
        text,
        config.translateModel,
        NOT_CUSTOM_URL_PROVIDERS.includes(config.translateProvider)
          ? 'https://api.openai.com/v1/chat/completions'
          : config.customUrl,
        0.5,
        1600
      );
    } else {
      reqData = deeplxLinuxdoReq(text);
    }

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'POST',
        url: reqData.url,
        headers: reqData.headers,
        data: reqData.data,
        responseType: reqData.responseType,
        onload: function (res) {
          console.log('Translation response:', res);
          console.log('Request details:', reqData);

          if (res.status === 200) {
            try {
              const response = typeof res.response === 'string' ? JSON.parse(res.response) : res.response;
              console.log('Parsed response:', response);

              let translation;

              if (isDeepl) {
                // Pro API 返回格式
                translation = deeplRes(response);
                console.log('DeepL translation:', translation);
              } else if (isOAI) {
                translation = oaiRes(response);
                console.log('OAI translation:', translation);
              } else {
                translation = response?.data;
                console.log('DeepLX translation:', translation);
              }

              resolve(translation || '');
            } catch (error) {
              console.error('Error parsing response:', error);
              resolve('');
            }
          } else {
            console.error('Translation failed:', {
              status: res.status,
              statusText: res.statusText,
              response: res.response,
              responseText: res.responseText,
              finalUrl: res.finalUrl,
              headers: res.responseHeaders,
            });
            resolve('');
          }
        },
        onerror: function (err) {
          console.error('Translation error details:', {
            error: err,
            errorText: err.toString(),
            status: err.status,
            statusText: err.statusText,
            responseText: err.responseText,
          });
          resolve('');
        },
      });
    });
  };

  const processTranslateText = async text => {
    // 定义需要保护的块的正则表达式
    const protectedBlocks = [
      // Markdown 代码块
      {
        regex: /```[\s\S]*?```/g,
        type: 'code',
      },
      // BBCode 标签块 (处理嵌套标签)
      {
        regex: /\[(size|spoiler|center|color|grid).*?\][\s\S]*?\[\/\1\]/g,
        type: 'bbcode',
      },
      // 已有的 ruby 标签
      {
        regex: /<ruby>[\s\S]*?<\/ruby>/g,
        type: 'ruby',
      },
      // HTML 标签块
      {
        regex: /<[^>]+>[\s\S]*?<\/[^>]+>/g,
        type: 'html',
      },
      // 图片标签
      {
        regex: /!\[image\]\(.*?\)/g,
        type: 'image',
      },
    ];

    // 创建占位符映射
    let placeholders = new Map();
    let placeholderCounter = 0;

    // 保护特殊块
    let processedText = text;
    for (const block of protectedBlocks) {
      processedText = processedText.replace(block.regex, match => {
        const placeholder = `__PROTECTED_${block.type}_${placeholderCounter++}__`;
        placeholders.set(placeholder, match);
        return placeholder;
      });
    }

    // 处理剩余文本
    const segments = processedText.split(/(\n)/);
    let translatedSegments = [];

    for (const segment of segments) {
      if (!segment.trim() || segment === '\n') {
        translatedSegments.push(segment);
        continue;
      }

      // 检查是否是占位符
      if (segment.startsWith('__PROTECTED_')) {
        translatedSegments.push(placeholders.get(segment));
        continue;
      }

      // 翻译普通文本
      let segmentTranslate = await translateText(segment);
      if (segmentTranslate === '') {
        return segmentTranslate;
      }

      if (config.translateItalics) {
        segmentTranslate = `[i]${segmentTranslate}[/i]`;
      }

      if (config.translateBold) {
        segmentTranslate = `[b]${segmentTranslate}[/b]`;
      }

      if (config.translateReference) {
        segmentTranslate = `> [size=${config.translateSize}]${segmentTranslate}[/size]`;
      } else {
        segmentTranslate = `[size=${config.translateSize}]${segmentTranslate}[/size]`;
      }

      if (config.translateLayout === 'bottom') {
        translatedSegments.push(`${segment}\n${config.translateReference ? "\n" : ""}${segmentTranslate}`);
      } else if (config.translateLayout === 'top') {
        translatedSegments.push(
          `${segmentTranslate}\n${config.translateReference ? "\n" : ""}${segment}`
        );
      }
    }

    // 合并结果
    return translatedSegments.join('');
  };

  const processTextArea = () => {
    let textarea = document.querySelector(`#${uiIDs.replyControl} textarea`);
    let text = textarea.value.trim();
    let originalLength = text.length;

    if (text.length !== 0 && originalLength >= REQUIRED_CHARS) {
      // 检查是否已存在拼音
      // const rubyRegex = /(<ruby>[\s\S]*?<\/ruby>)/g;

      // 为中文加入翻译
      if (config.enableTranslate) {
        textarea.value = '开始翻译...';

        processTranslateText(text).then(res => {
          textarea.value = res;

          // 创建并触发 input 事件
          const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          // 触发事件
          textarea.dispatchEvent(inputEvent);
        });
        return;
      }

      textarea.value = text;

      // 创建并触发 input 事件
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      // 触发事件
      textarea.dispatchEvent(inputEvent);
    }
  };

  const handleClick = event => {
    // 修复翻译两次的 BUG
    if (config.enableTranslate) {
      return;
    }

    if (event.target && event.target.closest('button.create')) {
      processTextArea();
    }
  };

  let spacePresses = 0;
  let lastKeyTime = 0;
  let timeoutHandle = null;

  const handleKeydown = event => {
    // console.log(`KeyboardEvent: key='${event.key}' | code='${event.code}'`);

    if (event.ctrlKey && event.key === 'Enter') {
      processTextArea();
      return;
    }

    // 使用 Alt+D 触发翻译
    if (event.altKey && event.keyCode === 68) {
      event.preventDefault(); // 阻止默认行为
      processTextArea();
      return;
    }

    const currentTime = Date.now();
    if (event.code === 'Space') {
      // 如果时间间隔太长，重置计数
      if (currentTime - lastKeyTime > SPACE_PRESS_TIMEOUT) {
        spacePresses = 1;
      } else {
        spacePresses += 1;
      }

      lastKeyTime = currentTime;

      // 清除之前的定时器
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      // 设置新的定时器，如果在 SPACE_PRESS_TIMEOUT 毫秒内没有新的按键，则重置计数
      timeoutHandle = setTimeout(() => {
        spacePresses = 0;
      }, SPACE_PRESS_TIMEOUT);

      // 检查是否达到了按键次数
      if (spacePresses === SPACE_PRESS_COUNT) {
        spacePresses = 0; // 重置计数

        // 执行翻译操作
        processTextArea();
      }
    } else {
      // 如果按下了其他键，重置计数
      spacePresses = 0;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
        timeoutHandle = null;
      }
    }
  };

  const saveConfig = () => {
    const customUrlInput = document.getElementById(uiIDs.customUrlInput);
    config.customUrl = customUrlInput.value.trim();
    const authKeyInput = document.getElementById(uiIDs.authKeyInput);
    config.authKey = authKeyInput.value.trim();
    const translateModelInput = document.getElementById(uiIDs.translateModelInput);
    config.translateModel = translateModelInput.value;
    const transalteSizeInput = document.getElementById(uiIDs.translateSizeInput);
    config.translateSize = transalteSizeInput.value;
    console.log(config);

    GM_setValue('customUrl', config.customUrl);
    GM_setValue('authKey', config.authKey);
    GM_setValue('enableTranslate', config.enableTranslate);
    GM_setValue('translateModel', config.translateModel);
    GM_setValue('translateSize', config.translateSize);
    GM_setValue('translateItalics', config.translateItalics);
    GM_setValue('translateBold', config.translateBold);
    GM_setValue('translateReference', config.translateReference);
    GM_setValue('closeConfigAfterSave', config.closeConfigAfterSave);

    if (config.closeConfigAfterSave) {
      const panel = document.getElementById(uiIDs.configPanel);
      toggleConfigPanelAnimation(panel);
    }
  };

  const restoreDefaults = () => {
    if (confirm('确定要将所有设置恢复为默认值吗？')) {
      config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
      GM_setValue('maxRetryTimes', config.maxRetryTimes);
      GM_setValue('customUrl', config.customUrl);
      GM_setValue('authKey', config.authKey);
      GM_setValue('enableTranslate', config.enableTranslate);
      GM_setValue('translateSourceLang', config.translateSourceLang);
      GM_setValue('translateTargetLang', config.translateTargetLang);
      GM_setValue('translateModel', config.translateModel);
      GM_setValue('translateLayout', config.translateLayout);
      GM_setValue('translateSize', config.translateSize);
      GM_setValue('translateItalics', config.translateItalics);
      GM_setValue('translateBold', config.translateBold);
      GM_setValue('translateReference', config.translateReference);
      GM_setValue('closeConfigAfterSave', config.closeConfigAfterSave);

      const panel = document.getElementById(uiIDs.configPanel);
      if (panel) {
        updateConfigPanelContent(panel);
      }
    }
  };

  const createFormGroup = (labelText, element) => {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = labelText;

    group.appendChild(label);
    group.appendChild(element);

    return group;
  };

  const createSelect = (eleId, configId, options, defaultValue, onChange = undefined) => {
    const select = document.createElement('select');
    select.className = 'modern-select';
    select.id = eleId;

    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      select.appendChild(optionElement);
    });

    select.value = defaultValue;

    if (onChange !== undefined) {
      select.addEventListener('change', e => onChange(e));
    } else {
      select.addEventListener('change', e => {
        config[configId] = e.target.value;
        console.log(`[存储配置] ${configId}: ${config[configId]}`);
        GM_setValue(configId, config[configId]);
      });
    }

    return select;
  };

  const createInput = (eleId, value, type = 'text', placeholder = '') => {
    const input = document.createElement('input');
    input.className = 'modern-input';
    input.id = eleId;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    return input;
  };

  const createSwitch = (eleId, configId, checked, labelText) => {
    const container = document.createElement('div');
    container.className = 'switch-container';

    const label = document.createElement('span');
    label.className = 'form-label';
    label.style.margin = '0';
    label.textContent = labelText;

    const switchEl = document.createElement('div');
    switchEl.id = eleId;
    switchEl.className = `modern-switch${checked ? ' active' : ''}`;
    switchEl.addEventListener('click', () => {
      switchEl.classList.toggle('active');
      config[configId] = switchEl.classList.contains('active');
      console.log(`[存储配置] ${configId}: ${config[configId]}`);
      GM_setValue(configId, config[configId]);
    });

    container.appendChild(label);
    container.appendChild(switchEl);
    return container;
  };

  const createButton = (text, onClick, variant = 'secondary') => {
    const button = document.createElement('button');
    button.className = `modern-button ${variant}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
  };

  // const createTextArea = (id, value, labelText, placeholder) => {
  //   const container = document.createElement('div');
  //   container.style.marginBottom = '15px';

  //   const label = document.createElement('label');
  //   label.textContent = labelText;
  //   label.style.display = 'block';
  //   label.style.marginBottom = '5px';
  //   container.appendChild(label);

  //   const textarea = document.createElement('textarea');
  //   textarea.id = id;
  //   if (typeof value === 'string') {
  //     textarea.value = value;
  //   } else {
  //     textarea.value = JSON.stringify(value, null, 2);
  //   }
  //   textarea.placeholder = placeholder;
  //   textarea.rows = 5;
  //   textarea.style.width = '100%';
  //   textarea.style.padding = '5px';
  //   textarea.style.border = '1px solid var(--panel-border)';
  //   textarea.style.borderRadius = '4px';
  //   textarea.style.backgroundColor = 'var(--panel-bg)';
  //   textarea.style.color = 'var(--panel-text)';
  //   container.appendChild(textarea);

  //   return [container, textarea];
  // };

  const updateConfigPanelContent = (panel, panelContent) => {
    panelContent.innerHTML = '';

    // 添加表单元素
    const translateProviderSelect = createSelect(
      uiIDs.translateProviderSelect,
      'translateProvider',
      TRANSLATE_PROVIDERS,
      config.translateProvider,
      e => {
        config.translateProvider = e.target.value;

        const notCustomUrl = NOT_CUSTOM_URL_PROVIDERS.includes(config.translateProvider);
        const urlInput = document.getElementById(uiIDs.customUrlInput);
        if (notCustomUrl) {
          if (urlInput) {
            urlInput.disabled = true;
          }
        } else {
          if (urlInput) {
            urlInput.disabled = false;
          }
        }
        console.log(`[存储配置] translateProvider: ${config.translateProvider}`);

        GM_setValue('translateProvider', config.translateProvider);
      }
    );
    panelContent.appendChild(createFormGroup('翻译服务商(Provider)', translateProviderSelect));

    const customUrlInput = createInput(uiIDs.customUrlInput, config.customUrl, 'text', '填写自定义请求地址');
    const notCustomUrl = NOT_CUSTOM_URL_PROVIDERS.includes(config.translateProvider);
    if (notCustomUrl) {
      customUrlInput.disabled = true;
    }
    panelContent.appendChild(createFormGroup('自定义链接(Custom URL)', customUrlInput));

    const authKeyInput = createInput(uiIDs.authKeyInput, config.authKey, 'password', '输入认证密钥');
    panelContent.appendChild(createFormGroup('认证密钥(Auth Key)', authKeyInput));

    const modelInput = createInput(uiIDs.translateModelInput, config.translateModel, 'text', '输入翻译模型');
    panelContent.appendChild(createFormGroup('翻译模型(AI Model)', modelInput));

    const targetSourceSelect = createSelect(
      uiIDs.translateSourceLangSelect,
      'translateSourceLang',
      TRANSLATE_TARGET_LANG_OPTIONS,
      config.translateSourceLang
    );
    const targetLangSelect = createSelect(
      uiIDs.translateTargetLangSelect,
      'translateTargetLang',
      TRANSLATE_TARGET_LANG_OPTIONS,
      config.translateTargetLang
    );
    panelContent.appendChild(createFormGroup('源语言(Source Language)', targetSourceSelect));
    panelContent.appendChild(createFormGroup('目标语言(Target Language)', targetLangSelect));

    const sizeInput = createInput(
      uiIDs.translateSizeInput,
      config.translateSize,
      'number',
      '默认值为150(字体大小为原始的150%)'
    );
    panelContent.appendChild(createFormGroup('翻译字体大小(百分比)', sizeInput));

    const layoutSelect = createSelect(
      uiIDs.translateLayoutSelect,
      'translateLayout',
      [
        { text: '翻译在上(Translation On Top)', value: 'top' },
        { text: '翻译在下(Translation On Bottom)', value: 'bottom' },
      ],
      config.translateLayout
    );
    panelContent.appendChild(createFormGroup('翻译布局(Layout)', layoutSelect));
    TRANSLATE_TARGET_LANG_OPTIONS;
    // 添加开关
    panelContent.appendChild(
      createSwitch(uiIDs.enableTranslateSwitch, 'enableTranslate', config.enableTranslate, '启用翻译(Enable Translate)')
    );
    panelContent.appendChild(
      createSwitch(uiIDs.translateItalicsSwitch, 'translateItalics', config.translateItalics, '启用斜体(Enable Italic)')
    );
    panelContent.appendChild(
      createSwitch(uiIDs.translateBoldSwitch, 'translateBold', config.translateBold, '启用粗体(Enable Bold)')
    );
    panelContent.appendChild(
      createSwitch(uiIDs.translateReferenceSwitch, 'translateReference', config.translateReference, '转为引用(Convert to Quote)')
    );

    panelContent.appendChild(
      createSwitch(
        uiIDs.closeConfigAfterSaveSwitch,
        'closeConfigAfterSave',
        config.closeConfigAfterSave,
        '保存后自动关闭(Close Panel After Save)'
      )
    );

    // 创建按钮组
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    buttonGroup.appendChild(createButton('恢复默认', restoreDefaults));
    buttonGroup.appendChild(createButton('保存设置', saveConfig, 'primary'));
    buttonGroup.appendChild(
      createButton(
        '翻译（Translate）',
        processTextArea, // Call translate function directly
        'primary'
      )
    );
    buttonGroup.appendChild(
      createButton(
        '关闭',
        () => {
          toggleConfigPanelAnimation(panel);
        },
        'ghost'
      )
    );

    panelContent.appendChild(buttonGroup);
  };

  const createConfigPanel = () => {
    // 获取页面的 <meta name="theme-color"> 标签
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    let themeColor = '#DDDDDD'; // 默认白色背景
    let invertedColor = '#222222'; // 默认黑色字体

    if (themeColorMeta) {
      themeColor = themeColorMeta.getAttribute('content');
      invertedColor = getInvertColor(themeColor); // 计算相反颜色
    }

    // 设置样式变量
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --panel-bg: ${themeColor};
        --panel-text: ${invertedColor};
        --panel-border: ${invertedColor};
        --button-bg: ${invertedColor};
        --button-text: ${themeColor};
        --button-hover-bg: ${getInvertColor(invertedColor)};
        --button-hover-text: ${getInvertColor(themeColor)};
      }

      .modern-panel {
        position: fixed;
        top: 80px;
        right: 20px;
        width: 360px;
        background: color-mix(in srgb, var(--panel-bg) 85%, transparent);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        border: 1px solid color-mix(in srgb, var(--panel-border) 30%, transparent);
        overflow: hidden;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        color: var(--panel-text);
      }

      .modern-panel.show {
        opacity: 1;
        transform: translateY(0);
      }

      .modern-panel-header {
        padding: 20px 24px;
        border-bottom: 1px solid color-mix(in srgb, var(--panel-border) 10%, transparent);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modern-panel-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--panel-text);
        margin: 0;
      }

      .modern-panel-content {
        padding: 24px;
        max-height: calc(80vh - 140px);
        overflow-y: auto;
      }

      .modern-panel-content::-webkit-scrollbar {
        width: 6px;
      }

      .modern-panel-content::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--panel-border) 20%, transparent);
        border-radius: 3px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: var(--panel-text);
        margin-bottom: 8px;
      }

      .modern-select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid color-mix(in srgb, var(--panel-border) 20%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--panel-bg) 90%, transparent);
        color: var(--panel-text);
        font-size: 14px;
        transition: all 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        cursor: pointer;
      }

      .modern-select:hover {
        border-color: color-mix(in srgb, var(--panel-border) 40%, transparent);
      }

      .modern-select:focus {
        outline: none;
        border-color: var(--button-bg);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--button-bg) 10%, transparent);
      }

      .modern-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid color-mix(in srgb, var(--panel-border) 20%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--panel-bg) 90%, transparent);
        color: var(--panel-text);
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .modern-input:hover {
        border-color: color-mix(in srgb, var(--panel-border) 40%, transparent);
      }

      .modern-input:focus {
        outline: none;
        border-color: var(--button-bg);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--button-bg) 10%, transparent);
      }

      .switch-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .modern-switch {
        position: relative;
        width: 44px;
        height: 24px;
        background: color-mix(in srgb, var(--panel-border) 20%, transparent);
        border-radius: 12px;
        padding: 2px;
        transition: background 0.3s ease;
        cursor: pointer;
      }

      .modern-switch.active {
        background: var(--button-bg);
      }

      .modern-switch::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: var(--panel-bg);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        transform: translateY(1px) translateX(2px);
      }

      .modern-switch.active::after {
        transform: translateY(1px) translateX(22px);
      }

      .button-group {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid color-mix(in srgb, var(--panel-border) 10%, transparent);
      }

      .modern-button {
        flex: 1;
        padding: 2px 8px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      .modern-button.primary {
        background: var(--button-bg);
        color: var(--button-text);
      }

      .modern-button.primary:hover {
        background: var(--button-hover-bg);
        color: var(--button-hover-text);
      }

      .modern-button.secondary {
        background: color-mix(in srgb, var(--panel-border) 10%, transparent);
        color: var(--panel-text);
      }

      .modern-button.secondary:hover {
        background: color-mix(in srgb, var(--panel-border) 20%, transparent);
      }

      .modern-button.ghost {
        background: transparent;
        color: var(--panel-text);
      }

      .modern-button.ghost:hover {
        background: color-mix(in srgb, var(--panel-border) 10%, transparent);
      }
    }`;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = uiIDs.configPanel;
    panel.className = 'modern-panel';
    panel.style.display = 'none';

    // 创建头部
    const header = document.createElement('div');
    header.className = 'modern-panel-header';

    const title = document.createElement('h3');
    title.className = 'modern-panel-title';
    title.textContent = '设置';
    header.appendChild(title);

    // 创建内容区域
    const content = document.createElement('div');
    content.className = 'modern-panel-content';

    console.log();
    updateConfigPanelContent(panel, content);

    panel.appendChild(header);
    panel.appendChild(content);
    document.body.appendChild(panel);

    return panel;
  };

  const toggleConfigPanelAnimation = panel => {
    if (panel.style.display === 'none') {
      panel.classList.add('show');
      setTimeout(() => {
        panel.style.display = 'block';
      }, 10);
    } else {
      panel.classList.remove('show');
      setTimeout(() => {
        panel.style.display = 'none';
      }, 300);
    }
  };

  const toggleConfigPanel = () => {
    let panel = document.getElementById(uiIDs.configPanel);
    panel = panel || createConfigPanel();
    toggleConfigPanelAnimation(panel);
  };

  const createConfigButton = () => {
    const toolbar = document.querySelector('.d-editor-button-bar');
    if (!toolbar || document.getElementById(uiIDs.configButton)) return;

    const configButton = document.createElement('button');
    configButton.id = uiIDs.configButton;
    configButton.className = 'btn btn-flat btn-icon no-text user-menu-tab active';
    configButton.title = '配置';
    configButton.innerHTML =
      '<svg class="fa d-icon d-icon-discourse-other-tab svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#discourse-other-tab"></use></svg>';
    configButton.onclick = toggleConfigPanel;

    toolbar.appendChild(configButton);
  };

  const watchReplyControl = () => {
    const replyControl = document.getElementById(uiIDs.replyControl);
    if (!replyControl) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (replyControl.classList.contains('closed')) {
            const panel = document.getElementById(uiIDs.configPanel);
            if (panel) {
              panel.style.display = 'none';
            }
          } else {
            // 当 reply-control 重新打开时，尝试添加配置按钮
            setTimeout(createConfigButton, 500); // 给予一些时间让编辑器完全加载
          }
        }
      });
    });

    observer.observe(replyControl, { attributes: true });
  };

  const watchForEditor = () => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const addedNodes = mutation.addedNodes;
          for (let node of addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('d-editor')) {
              createConfigButton();
              return;
            }
          }
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const init = () => {
    const container = document.getElementById(uiIDs.replyControl);
    container.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeydown, true);
    if (!document.getElementById(uiIDs.configButton)) {
      createConfigButton();
    }
    watchReplyControl();
    watchForEditor();
  };

  // 初始化
  setTimeout(() => {
    init();
  }, 1000);
})();
