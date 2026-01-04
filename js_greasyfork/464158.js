// ==UserScript==
// @name         chatgpt-tool
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  美化样式，增强前端功能
// @author       poeticalcode
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464158/chatgpt-tool.user.js
// @updateURL https://update.greasyfork.org/scripts/464158/chatgpt-tool.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle(`
    .m-auto{
      margin:unset !important;
      max-width:unset !important;
    }
  `);




  const addRightClick = function (dom) {

    dom && dom.addEventListener('contextmenu', function (event) {
      // 创建自定义的右键菜单项
      let customMenuItem = document.createElement('div');
      customMenuItem.id = "custom-menu-item"
      customMenuItem.innerHTML = '将回答导出图片';
      customMenuItem.style.cssText = 'cursor: pointer; padding: 5px; background-color: #ffffff; border: 1px solid #000000;color:black;display:none;border-radius: 8px;fontSize: 14px';
      customMenuItem.style.display = 'inline-block';
      customMenuItem.style.position = 'absolute';
      customMenuItem.style.left = event.clientX + 'px';
      customMenuItem.style.top = event.clientY + 'px';
      document.body.appendChild(customMenuItem);
      // 阻止默认的右键菜单弹出
      event.preventDefault();
      // 添加自定义菜单项点击事件监听
      customMenuItem.addEventListener('click', () => {
        // 在这里可以添加自定义菜单项的点击事件处理逻辑
        dom && html2canvas(dom).then(function (canvas) {
          let imgDataUrl = canvas.toDataURL('image/png');
          let downloadLink = document.createElement('a');
          downloadLink.href = imgDataUrl;
          // 下载的文件名，可以根据需要修改
          downloadLink.download = 'chatgpt.png';
          downloadLink.click();
        });
      });


    });

    // 添加点击事件监听，隐藏右键菜单
    document.addEventListener('click', function (event) {
      let dom = document.getElementById("custom-menu-item");
      dom && dom.remove()
    });
  }

  // 在这里引入第三方插件的脚本文件
  let scriptElement = document.createElement('script');
  scriptElement.src = 'https://github.com/niklasvh/html2canvas/releases/download/v1.4.1/html2canvas.min.js';
  document.body.appendChild(scriptElement);
  scriptElement.onload = function () {



    const addToImage = () => {
      document.querySelectorAll('main .items-center .group')
        .forEach((item, index) => {
          // 这是回答
          if (index % 2 === 1) {
            console.log(item);
            ((item) => { addRightClick(item) })(item)
          }
        });
    }
    // 选取需要监听的节点
    const targetNode = document.querySelector("main");

    // 创建一个新的 MutationObserver 对象，将回调函数传递给它
    const observer = new MutationObserver((mutationsList, observer) => {
      addToImage()
    });
    // 配置观察选项
    const config = { attributes: true, childList: true, subtree: true };
    // 传入目标节点和观察选项进行观察
    observer.observe(targetNode, config);
    addToImage()
  }

})();