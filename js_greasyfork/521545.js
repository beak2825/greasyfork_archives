// ==UserScript==
// @name         优慕课-章节测试题目抓取复制
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  优慕课-章节测试题目抓取复制-复制整个章节测试题目内容
// @author       Sweek
// @match        *://wvpn.ahu.edu.cn/*/meol/test/*
// @license      GPLv3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_addStyle
// @grant      	 GM_setValue
// @grant      	 GM_getValue
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/521545/%E4%BC%98%E6%85%95%E8%AF%BE-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%E9%A2%98%E7%9B%AE%E6%8A%93%E5%8F%96%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521545/%E4%BC%98%E6%85%95%E8%AF%BE-%E7%AB%A0%E8%8A%82%E6%B5%8B%E8%AF%95%E9%A2%98%E7%9B%AE%E6%8A%93%E5%8F%96%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


function getTestTopics() {
  try {
    const testDoms = window.top.document.querySelectorAll(".test_checkq_question_qBody");
    if (!testDoms.length) {
      console.warn('没有找到任何测试项');
      return [];
    }
    return Array.from(testDoms).map(test => {
      const test_num = test.querySelector('.test_checkq_question_num')?.innerText || '无编号';
      const test_title = test.querySelector('.title input')?.getAttribute('value') || '无标题';
      const test_answer = test.querySelector('.item')?.innerText || '无答案';

      return { test_num, test_title, test_answer };
    });
  } catch (error) {
    console.error('获取测试项时出错:', error);
    return [];
  }
}

// 创建弹窗并显示数据
function showTestData(tests) {
  // 创建并设置元素样式的辅助函数
  function createStyledElement(tag, styles, textContent = '') {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    element.textContent = textContent;
    return element;
  }

  // 创建弹窗外层容器
  const modal = createStyledElement('div', {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  // 弹窗内容区域
  const modalContent = createStyledElement('div', {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '80%',
    overflowY: 'auto',
    width: '60%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    position: 'relative'
  });

  // 添加标题
  const header = createStyledElement('h2', {}, '测试题数据');
  modalContent.appendChild(header);

  // 复制所有题目和答案按钮
  const copyAllButton = createStyledElement('button', {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px'
  }, '复制所有题目和答案');

  copyAllButton.addEventListener('click', () => {
    const allText = tests.map(test => 
      `${test.test_num}\n${test.test_title.replace(/<\/?[^>]+(>|$)/g, "")}\n${test.test_answer}\n\n`
    ).join('');
    navigator.clipboard.writeText(allText)
      .then(() => alert('所有题目和答案已复制！'))
      .catch(err => console.error('复制失败:', err));
  });

  modalContent.appendChild(copyAllButton);

  // 使用文档片段来批量添加元素
  const fragment = document.createDocumentFragment();

  tests.forEach(test => {
    const testDiv = createStyledElement('div', {
      marginBottom: '20px',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
    });

    const testNum = createStyledElement('p', {
      fontSize: '18px',
      fontWeight: 'bold'
    }, test.test_num);

    const testTitle = createStyledElement('div', {
      fontSize: '16px',
      color: '#333'
    }, test.test_title.replace(/<\/?[^>]+(>|$)/g, ""));

    const testAnswer = createStyledElement('pre', {
      fontSize: '14px',
      color: '#555',
      padding: '5px 0px',
      backgroundColor: '#fafafa',
      borderRadius: '5px'
    }, test.test_answer);

    const copyButton = createStyledElement('button', {
      marginTop: '10px',
      padding: '5px 10px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '4px'
    }, '复制题目和答案');

    copyButton.addEventListener('click', () => {
      const fullText = `${test.test_num}\n${test.test_title.replace(/<\/?[^>]+(>|$)/g, "")}\n${test.test_answer}`;
      navigator.clipboard.writeText(fullText)
        .then(() => alert('题目和答案已复制！'))
        .catch(err => console.error('复制失败:', err));
    });

    testDiv.appendChild(testNum);
    testDiv.appendChild(testTitle);
    testDiv.appendChild(testAnswer);
    testDiv.appendChild(copyButton);
    fragment.appendChild(testDiv);
  });

  modalContent.appendChild(fragment);

  // 关闭按钮
  const closeButton = createStyledElement('button', {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '16px',
    backgroundColor: '#FF5C5C',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    padding: '5px 10px'
  }, '关闭');

  // 最小化按钮
  const minimizeButton = createStyledElement('button', {
    position: 'fixed',
    top: '10px',
    right: '10px',
    fontSize: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px',
    padding: '5px 10px',
    display: 'none' // 初始隐藏
  }, '显示测试题目');

  // 关闭弹窗事件
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // 隐藏弹窗
    minimizeButton.style.display = 'block'; // 显示最小化按钮
  });

  // 恢复弹窗事件
  minimizeButton.addEventListener('click', () => {
    modal.style.display = 'flex'; // 显示弹窗
    minimizeButton.style.display = 'none'; // 隐藏最小化按钮
  });

  modal.appendChild(modalContent);
  modalContent.appendChild(closeButton);
  document.body.appendChild(modal);
  document.body.appendChild(minimizeButton);
}

function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100%';
  loadingDiv.style.height = '100%';
  loadingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  loadingDiv.style.zIndex = '10000';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.color = 'white';
  loadingDiv.style.fontSize = '20px';
  loadingDiv.textContent = '加载中...';
  document.body.appendChild(loadingDiv);
}

function hideLoading() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) {
    document.body.removeChild(loadingDiv);
  }
}



(function() {
  if (window.top === window) {      
    showLoading(); // 显示加载动画
    // 只有在主页面中才执行的代码
    window.addEventListener('load', function() {
      const tests = getTestTopics();
      console.log('tests：：：+ ', tests);
      showTestData(tests); // 在弹窗显示后隐藏加载动画
      hideLoading()
    });
  }
})();
