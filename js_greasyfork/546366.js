// ==UserScript==
// @name         FunHPC脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动登录funhpc、快速复制SSH和密码
// @license      MIT
// @match        https://funhpc.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand

// @grant        GM_xmlhttpRequest
// @connect      api.day.app

// @downloadURL https://update.greasyfork.org/scripts/546366/FunHPC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/546366/FunHPC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function AutoLogin() {

      // 注册菜单命令，让用户设置账号密码
      GM_registerMenuCommand('设置账号密码', async () => {
          const username = prompt('请输入手机号：', await GM_getValue('username', ''));
          if (username !== null) await GM_setValue('username', username);

          const password = prompt('请输入密码：', await GM_getValue('password', ''));
          if (password !== null) await GM_setValue('password', password);

          alert('账号密码已保存，刷新页面后生效');
      });

      const username = GM_getValue('username', '');
      const password = GM_getValue('password', '');

      if (!username || !password) {
          console.log('账号或密码未设置');
          return;
      }

      const interval = setInterval(() => {
          const inputs = document.querySelectorAll('input.el-input__inner');
          const parent = document.querySelector('div.Login');
          if (inputs.length >= 2 && parent.contains(inputs[0])) {
              console.log("start input");

              inputs[0].value = username;
              inputs[1].value = password;

              inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
              inputs[1].dispatchEvent(new Event('input', { bubbles: true }));

              const loginBtn = document.querySelector('input.logbtn');
              if (loginBtn) {
                  setTimeout(() => {
                      loginBtn.click();
                  }, 500);
              }

              clearInterval(interval);
          }
      }, 300);

    })();

    (function EasyCopy() {

      // 创建悬浮按钮容器
      const floatContainer = document.createElement('div');
      Object.assign(floatContainer.style, {
          position: 'fixed',
          bottom: '40px',
          left: '40px',
          display: 'flex',
          flexDirection: 'row',
          gap: '15px',
          zIndex: '9999'
      });

      // 主要按钮样式
      const btnStyle = `
          width: 120px;
          height: 60px;
          border-radius: 25px;
          border: none;
          color: white;
          font-weight: bold;
          font-size: 12px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
          line-height: 1.3;
      `;

      // 查找目标按钮的函数
      const findTargetButton = (matchText) => {
          // 使用XPath精准定位
          const xpath = matchText;
          const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue;
      };

      // 创建复制按钮
      const createButton = (textContent, matchText) => {
          const btn = document.createElement('button');
          btn.textContent = textContent;
          btn.style.cssText = btnStyle;

          // 悬停效果
          btn.addEventListener('mouseenter', () => {
              btn.style.transform = 'scale(1.1)';
              btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.25)';
          });
          btn.addEventListener('mouseleave', () => {
              btn.style.transform = 'none';
              btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          });

          // 点击事件处理
          btn.addEventListener('click', () => {
              // 脉冲动画
              btn.style.transition = 'none';
              btn.style.boxShadow = '0 0 0 10px rgba(255,255,255,0.6)';
              setTimeout(() => {
                  btn.style.transition = 'all 0.3s ease';
                  btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }, 300);

              // 精确查找目标按钮
              const targetBtn = findTargetButton(matchText);
              if (targetBtn) {
                  targetBtn.click();
                  console.log('已成功触发按钮');
              } else {
                  console.warn('未找到目标按钮');
                  btn.style.animation = 'shake 0.5s';
                  setTimeout(() => btn.style.animation = '', 500);
              }
          });

          return btn;
      };


      // 添加全局样式
      const style = document.createElement('style');
      style.textContent = `
          @keyframes shake {
              0%, 100% { transform: translateX(0); }
              20%, 60% { transform: translateX(-5px); }
              40%, 80% { transform: translateX(5px); }
          }
      `;
      document.head.appendChild(style);

      // 添加悬浮按钮
      floatContainer.appendChild(createButton('CDP', `//li[@class='li5']/p[contains(., '跳转')]//a[contains(., 'code-server')]`));
      floatContainer.appendChild(createButton('CPW', `//li[@class='li5']/p[contains(., '默认密码：******')]//i[contains(@class, 'el-icon-document-copy')]`));
      floatContainer.appendChild(createButton('SSH', `//li[@class='li6']/p[contains(., 'SSH：')]//i[contains(@class, 'el-icon-document-copy')]`));
      floatContainer.appendChild(createButton('PW', `//li[@class='li6']/p[contains(., '默认密码：******')]//i[contains(@class, 'el-icon-document-copy')]`));

      document.body.appendChild(floatContainer);

      // 响应式调整位置
      window.addEventListener('resize', () => {
          floatContainer.style.right = '40px';
      });




    })();


    (function Bark() {
      const barkKey = '3W8PuapAYbPptUYwwC2WjT';
      const barkTitle = '主机已启动';
      const barkBody = '请尽快回到FunHPC';

      const signXPath = "//li[@class='li8'/p[contains(., '实例运行中')]]"

      let notified = false;

      const checkInterval = 1000;

      const getElementByXPath = (xpath) => {
          return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const checkStatus = () => {
        console.log("检查");
        if (!notified && getElementByXPath(signXPath)) {
          console.log("检查成功");
            sendBarkNotification();
            notified = true;
            clearInterval(intervalId)
        }
      };

      const sendBarkNotification = () => {
          GM_xmlhttpRequest({
              method: "GET",
              url: `https://api.day.app/${barkKey}/${encodeURIComponent(barkTitle)}/${encodeURIComponent(barkBody)}/?level=timeSensitive`,
              onload: function(response) {
                  console.log("Bark 通知已发送：", response.responseText);
              },
              onerror: function(err) {
                  console.error("Bark 通知失败：", err);
              }
          });
      };
      const intervalId = setInterval(checkStatus, checkInterval);
    });
})();