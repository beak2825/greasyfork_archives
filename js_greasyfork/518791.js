// ==UserScript==
// @name         Pinterest Copy Links
// @namespace    http://leizingyiu.net/
// @version      20241125
// @description  点击复制到剪贴板，多次点击多次累积；右下角问号出重置，点重置清理剪贴板。
// @author       leizingyiu
// @match        *://*.pinterest.*/*
// @grant        GM_setClipboard
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/518791/Pinterest%20Copy%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/518791/Pinterest%20Copy%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clipboardContent = ''; // 用于累积复制的链接

  // let hoverstyle = document.createElement('style');
  // hoverstyle.innerText=`
  // [data-test-id]:hover .copy-link-btn{
  // opacity:1;
  // }`;
  // document.body.appendChild(hoverstyle);

    var 样式名称='yiu_pin_copying';
    // 为每个项目添加复制链接按钮
    function addCopyButton() {
      if(!document.body.classList.contains(样式名称)){
        return ;
      }
        const items = document.querySelectorAll('[data-test-id="pin"]'); // 定位到瀑布流项
        items.forEach((item) => {
            // 检查是否已添加按钮
            if (item.querySelector('.copy-link-btn')) return;

            // 获取超链接
            const linkElement = item.querySelector('a[href]');
            if (!linkElement) return;

            const href = linkElement.href;

            // 创建按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制链接';
            copyButton.className = 'copy-link-btn';

            copyButton.style.display = 'block';
            copyButton.style.marginTop = '8px';
            copyButton.style.backgroundColor = '#E60023';
            copyButton.style.color = 'white';
            copyButton.style.border = 'none';
            copyButton.style.borderRadius = '26px';
            copyButton.style.padding = '6px 12px';
            copyButton.style.cursor = 'pointer';
            copyButton.style.fontSize = '14px';
            copyButton.style.opacity=0;
            copyButton.style.transition='opacity ease 0.4s';

            // 按钮点击逻辑
            copyButton.addEventListener('click', (e) => {
                // clipboardContent += clipboardContent ? `\n${href}` : href; // 累积链接
              clipboardContent=clipboardContent.split('\n');
              clipboardContent.push(href);
              clipboardContent=[...new Set(clipboardContent)];
              clipboardContent=clipboardContent.join('\n');


               copyButton.style.opacity='0!important';
              copyButton.textContent = '复制链接✅';
              console.log(copyButton,copyButton.style.opacity);
            setTimeout(()=>{
              copyButton.style.opacity='1!important';
              copyButton.textContent = '复制链接';
              console.log(copyButton,copyButton.style.opacity);
            },500);
               GM_setClipboard(clipboardContent); // 复制到剪贴板
                // alert(`链接已复制：\n${href}`);
            });

            // 将按钮插入到项目中
            const saveButton = item.querySelector('button'); // 保存按钮
            if (saveButton) {
                saveButton.parentNode.appendChild(copyButton);
            }
          setTimeout(()=>{
            copyButton.style.opacity=1;
                      },1);
        });
    }

    // 创建问号和重置按钮
    function createResetButton() {
        // 问号容器
        const helpContainer = document.createElement('div');
        helpContainer.style.position = 'fixed';
        helpContainer.style.bottom = '20px';
        helpContainer.style.right = '20px';
        helpContainer.style.zIndex = '9999';
        helpContainer.style.cursor = 'pointer';

        const helpIcon = document.createElement('div');
        helpIcon.textContent = '?';
        helpIcon.style.width = '40px';
        helpIcon.style.height = '40px';
        helpIcon.style.borderRadius = '50%';
        helpIcon.style.backgroundColor = '#E60023';
        helpIcon.style.color = 'white';
        helpIcon.style.display = 'flex';
        helpIcon.style.justifyContent = 'center';
        helpIcon.style.alignItems = 'center';
        helpIcon.style.fontSize = '24px';
        helpIcon.style.fontWeight = 'bold';
        helpIcon.style.transition = 'all 0.3s';

        // 重置按钮
        const resetButton = document.createElement('button');
        resetButton.textContent = '重置剪贴板';
        resetButton.style.position = 'absolute';
        resetButton.style.width = '10em';
        resetButton.style.right = '60px';
        resetButton.style.bottom = '0';
        resetButton.style.backgroundColor = '#FF4500';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.padding = '8px 12px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.fontSize = '14px';
        resetButton.style.opacity = '0';
        resetButton.style.transition = 'opacity 0.3s';
        resetButton.style.pointerEvents = 'none';

        // 问号 hover 显示按钮
        helpIcon.addEventListener('mouseover', () => {
            resetButton.style.opacity = '1';
            resetButton.style.pointerEvents = 'auto';
        });
        helpIcon.addEventListener('mouseout', () => {
            setTimeout(() => {
                if (!resetButton.matches(':hover')) {
                    resetButton.style.opacity = '0';
                    resetButton.style.pointerEvents = 'none';
                }
            }, 200);
        });

        // 鼠标移到按钮上保持显示
        resetButton.addEventListener('mouseover', () => {
            resetButton.style.opacity = '1';
            resetButton.style.pointerEvents = 'auto';
        });

        // 重置按钮点击逻辑
        resetButton.addEventListener('click', () => {
            clipboardContent = '';
            // alert('剪贴板已清空');
        });

        helpContainer.appendChild(helpIcon);
        helpContainer.appendChild(resetButton);
        document.body.appendChild(helpContainer);
    }

    // 初始化
    function init() {
        createResetButton();
        setInterval(addCopyButton, 250); // 定时检查新加载的项目


      // 监听键盘按键事件
    document.addEventListener('keydown', function (event) {
         if (event.altKey && event.code === 'KeyC') {
            const body = document.body;
            if (body.classList.contains(样式名称)) {
                body.classList.remove(样式名称);
             } else {
                body.classList.add(样式名称);
             }
             event.preventDefault();
        }
    });
document.body.classList.add(样式名称);


    }

    // 延迟等待页面加载完成
    window.addEventListener('load', init);
})();
