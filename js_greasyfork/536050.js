// ==UserScript==
// @name         knife4j文档 API文档增强工具(誉存版)
// @namespace    https://github.com/hyc8801/knife4j-api-enhancement
// @version      2.35
// @license      MIT
// @description  knife4j文档页面添加一键复制接口/文档按钮
// @author       @hyc
// @match        */**/doc.html
// @match        */**/doc.html**
// @match        */doc.html
// @match        */doc.html**
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/536050/knife4j%E6%96%87%E6%A1%A3%20API%E6%96%87%E6%A1%A3%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%28%E8%AA%89%E5%AD%98%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536050/knife4j%E6%96%87%E6%A1%A3%20API%E6%96%87%E6%A1%A3%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%28%E8%AA%89%E5%AD%98%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 新增：动态插入样式表
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/popular-message@1.2.0/index.css';
  document.head.appendChild(link);

  // 新增：动态插入 script 标签
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/popular-message@1.2.0/index.min.js';
  document.head.appendChild(script);
  // 添加自定义CSS样式
  GM_addStyle(`
      /* 主按钮样式 */
      .api-copy-btn-container {
        position: fixed;
        top: 63px;
        right: 20px;
        z-index: 9999;
      }

      .api-copy-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #1890ff, #096dd9);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
      }

      .api-copy-btn:hover {
        background: linear-gradient(135deg, #40a9ff, #1890ff);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-1px);
      }
      .api-copy-btn span:hover {
        text-decoration: underline;
      }
      .api-copy-btn:active {
        transform: translateY(0);
      }

      .api-copy-btn i {
        margin-right: 6px;
      }
      .api-copy-btn.loading .api-loading {
        display: inline-block;
      }
      /* 加载动画 */
      .api-loading {
        display: none;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-right: 8px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .treeTable .treeTable-icon:hover, .ant-table-tbody .ant-table-row .ant-table-row-cell-break-word:first-of-type:hover  {
        // 不添加下划线，有点丑，有更好的样式么，最好只是针对文字的,文字背景色
        // cursor: pointer;
        // text-decoration: none;
        // 放大
        transition: 0.3s;
        // transform: scale(1.2);
        color: #1890ff;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
      }
  `);
  function copyToClipboard(text) {
    // 创建一个临时文本域
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);

    // 选中并复制文本
    textarea.select();
    try {
      const success = document.execCommand('copy');
      if (!success) {
        console.error('复制失败');
      }
    } catch (err) {
      console.error('无法复制文本:', err);
    }

    // 清理临时元素
    document.body.removeChild(textarea);
  }

  // 创建主功能按钮
  function createMainButton() {
    const container = document.createElement('div');
    container.className = 'api-copy-btn-container';

    const btn = document.createElement('button');
    btn.className = 'api-copy-btn';
    // 为文件span添加可识别的class
    btn.innerHTML = `
      <div class="api-loading"></div>
      <span class="btn-text"><span>📋</span>复制接口</span>/
      <span class="copy-file-btn">文件</span>
    `;
    btn.id = 'main-copy-btn';

    btn.addEventListener('click', (e) => {
      // 判断点击的是主按钮还是文件按钮
      if (e.target.closest('.copy-file-btn')) {
        // 处理文件点击逻辑
        handleBttonFileClick();
        return;
      }
      handleButtonClick();
    });

    container.appendChild(btn);
    document.body.appendChild(container);

    return btn;
  }

  /**
   * 从URL中提取分组名称
   * @returns [groupName, tabName, operationId]
   */
  function getHashSegments() {
    const hash = window.location.hash;
    if (hash) {
      // 匹配 #/路径段1/路径段2/路径段3 的格式
      return hash
        .split('/')
        .filter((segment) => segment && segment !== '#') // 过滤空值和#
        .map((segment) => decodeURIComponent(segment));
    }

    return [
      document.querySelector('#sbu-group-sel').value,
      document.querySelector('.menuLi.active').parentElement.previousElementSibling.innerText.trim().split('\n')[0],
      undefined,
    ]
  }

  // 获取API文档数据
  function fetchApiDocs(groupName) {
    const btn = document.getElementById('main-copy-btn');
    btn.classList.add('loading'); // 添加loading状态
    const search = window.location.search.replace('?', '');
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `${window.location.origin}${window.location.pathname.replace('/doc.html', '')}/v2/api-docs?group=${encodeURIComponent(groupName)}${search? `&${search}` : ''}`,
        onload: function (response) {
          btn.classList.remove('loading');
          try {
            const data = JSON.parse(response.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('解析API文档失败'));
            showNotification('解析API文档失败', true);
          }
        },
        onerror: function (error) {
          btn.classList.remove('loading');
          reject(new Error(`请求失败: ${error.status}`));
          showNotification(`请求失败: ${error.status}`, true);
        },
      });
    });
  }

  // 显示通知
  function showNotification(message, isError = false) {
    const { $message } = unsafeWindow;
    if (typeof $message !== 'undefined') {
      const options = {
        position: 'top-right',
        duration: 2,
        theme: 'bubble',
      };
      isError ? $message.error(message, options) : $message.success(message, options);
    } else {
      console[isError ? 'error' : 'log'](message);
    }
  }

  // 生成请求函数代码
  function generateRequestFunction({ title, method, url, hasQuery, hasBody }) {
    // 路径处理逻辑
    let paths = url.split('/').filter((p) => p && !p.startsWith('{'));
    if (method.toLowerCase() === 'delete' && paths[paths.length - 1]?.toLowerCase() === 'delete') {
      paths = paths.slice(0, -1);
    }
    const specialSuffixes = ['page', 'list', 'detail', 'export'];

    // 函数名生成逻辑
    let baseIndex = paths.length - 1;
    while (specialSuffixes.includes(paths[baseIndex]?.toLowerCase()) && baseIndex > 0) {
      baseIndex--;
    }
    const baseName = paths
      .slice(baseIndex)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
    const functionName = `${method.toLowerCase()}${baseName}`;

    // URL参数处理
    const urlParams = [...new Set(url.match(/{(\w+)}/g) || [])];
    const processedUrl = url.replace(/{(\w+)}/g, '$${$1}');
    const paramsList = urlParams.map((p) => p.slice(1, -1));
    const allParams = [...paramsList, ...(hasBody ? ['data'] : []), ...(hasQuery ? ['params'] : [])].filter(
      (v, i, a) => a.indexOf(v) === i
    );
    const paramStr = allParams.length ? `(${allParams.join(', ')})` : '()';

    // 请求配置构建
    const config = [];
    const isBlob = /下载|导出/.test(title);
    const methodLower = method.toLowerCase();

    if (isBlob) config.push("responseType: 'blob'");
    if (hasQuery) config.push('params');
    if (hasBody && !['post', 'put'].includes(methodLower)) {
      config.push('data');
    }

    // 请求参数处理
    const requestParams = [];

    // 修复逻辑：POST/PUT方法必须保留data参数位置
    if (['post', 'put'].includes(methodLower)) {
      if (hasBody) {
        requestParams.push('data');
      } else if (hasQuery) {
        // 当没有body但有query参数时，显式添加undefined占位
        requestParams.push('undefined');
      }
    }

    if (config.length) {
      requestParams.push(`{ ${config.join(', ')} }`);
    }

    // 最终代码生成
    return `/** ${title} */
export const ${functionName} = ${paramStr} => {
  return request.${methodLower}(\`${processedUrl}\`${requestParams.length ? ', ' : ''}${requestParams.join(', ')});
}`;
  }

  // 优化后的工具函数
  function getRequestFCStr(apiURL, methodObj, method) {
    const { summary, parameters } = methodObj;
    const hasQuery = parameters?.some((p) => p.in === 'query');
    const hasBody = parameters?.some((p) => p.in === 'body');

    return generateRequestFunction({
      title: summary,
      method: method.toLowerCase(),
      url: apiURL,
      hasQuery,
      hasBody,
    });
  }

  // 按钮点击处理
  async function handleButtonClick() {
    const [groupName, , operationId] = getHashSegments();
    if (!groupName) throw new Error('无法获取分组名称');

    const apiDocs = await fetchApiDocs(groupName);
    let method;

    let apiURL = document.querySelector(
      '.ant-tabs-tabpane-active .ant-tabs-tabpane-active .knife4j-api-summary-path'
    )?.innerText

    if (!apiURL) {
      // 老版本兼容
      const id = document.querySelector('ul.layui-tab-title > li.layui-this[lay-id]').getAttribute("lay-id").replace('tab', '');
      apiURL = document.querySelector(`#contentDoc${id} p:first-of-type code`)?.textContent
      method = document.querySelector(`#contentDoc${id} p:nth-of-type(2) code`)?.textContent.toLocaleLowerCase()
    }
    const apiURLObjs = apiDocs.paths[apiURL];
    if (operationId) {
      method = Object.keys(apiURLObjs).find((method) => {
        if (operationId === apiURLObjs[method].operationId) {
          apiURLObjs[method].method = method;
          return true;
        }
        return false;
      });
    }
    const methodObj = apiURLObjs[method];

    if (apiURL && methodObj) {
      const code = getRequestFCStr(apiURL, methodObj, method);
      copyToClipboard(code);
      showNotification('接口代码已复制');
    }
  }

  // 文件点击处理
  async function handleBttonFileClick() {
    const [groupName, tabName] = getHashSegments();
    const apiDocs = await fetchApiDocs(groupName);
    const codes = Object.entries(apiDocs.paths)
      .filter(([, apiURLObjs]) => Object.values(apiURLObjs).some((m) => m.tags?.includes(tabName)))
      .map(([apiURL, apiURLObjs]) => {
        return Object.keys(apiURLObjs).map((method) => {
          const item = apiURLObjs[method];
          return getRequestFCStr(apiURL, item, method);
        });
      });

    const fullCode = `import request from 'src/utils/request';\n\n${codes.flat().join('\n\n')}`;
    copyToClipboard(fullCode);
    showNotification('文件代码已复制');
  }

  // 主初始化函数
  function init() {
    createMainButton();

    document.body.addEventListener('click', function(e) {
      if (!e.isTrusted) return; // 过滤掉由脚本触发的事件
      const oldSpan = e.target.closest('.treeTable .treeTable-icon');
      const newSpan = e.target.closest('.ant-table-tbody .ant-table-row .ant-table-row-cell-break-word:first-of-type');
      const span = oldSpan || newSpan;
      if (span) {
        const text = span.textContent.trim(); // 获取元素内的全部文本（包括子元素）
        e.stopImmediatePropagation();
        copyToClipboard(text);
        showNotification(`已复制：${text}`);
      }
    });

    console.log('API文档增强工具(专业版)已加载');
  }

  // 页面加载完成后执行
  window.addEventListener('load', function () {
    // 延迟执行确保所有元素加载完成
    setTimeout(init, 1000);
  });
})();
