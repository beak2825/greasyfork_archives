// ==UserScript==
// @name         DeepSeek 对话导出成 JSON
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  读取 IndexedDB 内容并导出到 JSON
// @author       Charles Chan
// @license MIT
// @match        https://*.deepseek.com/a/chat/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526435/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E6%88%90%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/526435/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E6%88%90%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dbName = 'deepseek-chat'; // 数据库名称
    const storeName = 'history-message'; // 对象存储空间名称

    const buttonStyles = {
        padding: '5px 0', // 调整内边距
        backgroundColor: 'rgb(180, 98, 175)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px', // 修改为 marginBottom 以实现竖排
        width: '30px', // 设置按钮宽度
        height: 'auto', // 设置按钮高度
        writingMode: 'vertical-rl', // 设置文字垂直排列
        textOrientation: 'upright' // 设置文字方向
    };

    const buttonContainer = document.createElement('div');
  	buttonContainer.id = 'DownloadButtonContainer';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '45%';
    buttonContainer.style.right = '10px';
    buttonContainer.style.transform = 'translateY(-50%)';
    document.body.appendChild(buttonContainer);
  
  	var selectedTitle = '';

  	function createDownloadButtons(json) {
      const button = document.createElement('button');

      button.id = 'downloadButton';
      button.innerText = json.data.chat_session.title.substring(0, 10) + '.json';
      Object.assign(button.style, buttonStyles);

      button.onclick = function() {
        try {
          const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          window.open(url);
        } catch (e) {
          console.log('打开过程中出错:', e);
        }
      };

      var buttonContainer = document.getElementById('DownloadButtonContainer');
      buttonContainer.appendChild(button);
  	}

  	function fetchDataAndCreateButtons() {
      const request = window.indexedDB.open(dbName);

      request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);

        const request = store.getAll();

        request.onsuccess = function(event) {
            var buttonContainer = document.getElementById('DownloadButtonContainer');
            buttonContainer.innerHTML = '';
            const data = event.target.result;
            for(var i=0;i<data.length;i++) {
              if(selectedTitle == data[i].data.chat_session.title) {
                createDownloadButtons(data[i]);
                break;
              }
            }
        };
      };

      request.onerror = function(event) {
          console.error('打开数据库出错：', event.target.error);
      };
    }

  	// 监控左侧的会话列表的变化情况
    const targetNode = document.body; // 监控整个文档
    // 配置观察选项
    const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] };
    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('b64fb9ae')) {
                    selectedTitle = target.getElementsByClassName('c08e6e93')[0].innerHTML;
                    console.log('目标节点发生变化:', selectedTitle);
                    fetchDataAndCreateButtons();
                }
            }
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

})();
