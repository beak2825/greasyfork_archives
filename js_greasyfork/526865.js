// ==UserScript==
// @name         网页输入关键词提取链接列表
// @namespace    http://your-namespace/
// @version      6.0
// @description  提取网页中包含指定关键词的所有链接，并提供复制功能
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526865/%E7%BD%91%E9%A1%B5%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526865/%E7%BD%91%E9%A1%B5%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E6%8F%90%E5%8F%96%E9%93%BE%E6%8E%A5%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
  // 创建悬浮按钮
  const floatingButton = document.createElement('div');
  floatingButton.id = 'extractorButton';
  floatingButton.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999999;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  floatingButton.innerHTML = `
    <span>🔍 提取链接</span>
  `;
  floatingButton.addEventListener('click', () => {
    // 获取关键词
    const keyword = prompt('请输入你要搜索的关键词（默认：airlift）：',
      localStorage.getItem('linkKeyword') || 'airlift');
    if (!keyword) {
      alert('请输入关键词！');
      return;
    }
    localStorage.setItem('linkKeyword', keyword);

    // 提取链接
    const links = Array.from(document.querySelectorAll('a[href]'))
      .filter(link => {
        const text = link.textContent.toLowerCase();
        return text.includes(keyword.toLowerCase());
      })
      .map(link => link.href);

    // 创建结果窗口
    if (links.length > 0) {
      createOutputWindow(links);
    } else {
      alert(`未找到包含 "${keyword}" 的链接！`);
    }
  });

  // 将按钮添加到页面
  document.body.appendChild(floatingButton);

  // 创建结果窗口函数
  function createOutputWindow(links) {
    const output = document.createElement('div');
    output.id = 'extractorOutput';
    output.style = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: rgba(255, 255, 255, 0.9);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
      z-index: 999999;
      width: 600px;
      height: 80vh;
      overflow: auto;
    `;
    output.innerHTML = `
      <div style="margin-bottom: 15px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">
          找到 ${links.length} 个匹配的链接：
        </h3>
        <div style="float: right; margin-bottom: 10px;">
          <button
            id="copyAll"
            style="
              padding: 8px 16px;
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              margin-left: 10px;
            "
          >
            全选复制
          </button>
          <button
            id="closeWindow"
            style="
              padding: 8px 16px;
              background: #f44336;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            关闭
          </button>
        </div>
      </div>
      <textarea
        id="linkList"
        style="
          width: 100%;
          height: calc(100% - 120px);
          font-family: monospace;
          resize: none;
          margin-top: 10px;
        "
        readonly
      >${links.join('\n')}</textarea>
    `;

    // 绑定复制按钮
    output.querySelector('#copyAll').addEventListener('click', function() {
      const textarea = output.querySelector('#linkList');
      textarea.select();
      document.execCommand('copy');
      alert('链接已复制到剪贴板！');
    });

    // 绑定关闭按钮
    output.querySelector('#closeWindow').addEventListener('click', function() {
      output.remove();
    });

    // 将结果窗口添加到页面
    document.body.appendChild(output);
  }

  // 初始浮动按钮显示
  floatingButton.style.display = 'block';
})();