// ==UserScript==
// @name         复制粘贴解锁器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  破除网页禁止复制粘贴的限制，特别优化学习通平台
// @author       pan
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531331/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%94%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531331/%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E8%A7%A3%E9%94%81%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 移除禁止复制粘贴的事件监听器
    function removeEventListeners() {
      const events = ['copy', 'cut', 'paste', 'select', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];
      
      // 移除document上的事件限制
      events.forEach(event => {
        document.addEventListener(event, function(e) {
          e.stopImmediatePropagation();
          return true;
        }, true);
        
        // 尝试直接覆盖原生onxxx属性
        Object.defineProperty(document, 'on' + event, {
          get: function() { return null; },
          set: function() { return true; },
          configurable: true
        });
        
        // 尝试覆盖window上的事件
        Object.defineProperty(window, 'on' + event, {
          get: function() { return null; },
          set: function() { return true; },
          configurable: true
        });
      });
      
      // 使用MutationObserver监听DOM变化，确保对新添加的元素也生效
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) { // 元素节点
                enableCopyPaste(node);
              }
            });
          }
        });
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
    
    // 对指定元素及其子元素启用复制粘贴
    function enableCopyPaste(element) {
      if (!element) return;
      
      // 尝试移除可能禁止复制的CSS属性
      const overrideStyles = {
        'user-select': 'auto !important',
        '-webkit-user-select': 'auto !important',
        '-moz-user-select': 'auto !important',
        '-ms-user-select': 'auto !important',
        'pointer-events': 'auto !important'
      };
      
      Object.keys(overrideStyles).forEach(property => {
        element.style.setProperty(property, overrideStyles[property], 'important');
      });
      
      // 防止默认的事件处理程序干扰复制粘贴
      const events = ['copy', 'cut', 'paste', 'select', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];
      events.forEach(event => {
        element.addEventListener(event, function(e) {
          e.stopImmediatePropagation();
          return true;
        }, true);
        
        // 移除元素上的事件处理函数
        element['on' + event] = null;
      });
      
      // 移除可能的复制粘贴限制属性
      element.removeAttribute('unselectable');
      element.removeAttribute('oncontextmenu');
      element.removeAttribute('oncopy');
      element.removeAttribute('oncut');
      element.removeAttribute('onpaste');
      element.removeAttribute('onselectstart');
      element.removeAttribute('onmousedown');
      element.removeAttribute('onkeydown');
      
      // 递归处理子元素
      if (element.children && element.children.length > 0) {
        Array.from(element.children).forEach(child => {
          enableCopyPaste(child);
        });
      }
    }
    
    // 专门处理学习通网站
    function handleChaoxing() {
      if (window.location.href.includes('chaoxing.com') || 
          window.location.href.includes('edu.cn') ||
          document.domain.includes('chaoxing') ||
          document.domain.includes('xueyitong') ||
          document.domain.includes('xuexitong')) {
        
        console.log('检测到学习通网站，应用特殊处理...');
        
        // 覆盖学习通特有的禁用复制粘贴的方法
        try {
          // 尝试覆盖学习通的禁止复制粘贴函数
          if (typeof window.forbidBackSpace === 'function') {
            window.forbidBackSpace = function() { return true; };
          }
          
          // 覆盖可能存在的学习通专有方法
          window.checkRight = function() { return true; };
          window.canCopy = function() { return true; };
          window.oncontextmenu = function() { return true; };
          
          // 覆盖更多可能存在的函数
          if (typeof window.removeSelect === 'function') {
            window.removeSelect = function() { return true; };
          }
          
          // 特别处理视频播放器内的限制
          if (typeof window.AntiCopy === 'function' || typeof window.AntiCopy === 'object') {
            window.AntiCopy = function() { return true; };
          }
        } catch (e) {
          console.log('尝试覆盖学习通方法时出错:', e);
        }
        
        // 针对iframe处理
        function handleIframes() {
          const iframes = document.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            try {
              if (iframe.contentDocument) {
                enableCopyPaste(iframe.contentDocument.body);
              }
            } catch (e) {
              // 跨域iframe会导致安全错误，忽略
            }
          });
        }
        
        // 立即处理iframe
        handleIframes();
        
        // 每秒检查一次iframe，因为学习通常常动态加载iframe
        setInterval(handleIframes, 1000);
        
        // 学习通在内容加载后可能会重新应用禁止复制，需要延迟处理
        setTimeout(function() {
          enableCopyPaste(document.body);
          console.log('针对学习通的延迟处理已执行');
        }, 3000);
        
        // 检测页面URL变化
        let lastUrl = location.href;
        const bodyObserver = new MutationObserver(() => {
          if (lastUrl !== location.href) {
            lastUrl = location.href;
            console.log("学习通页面URL变化，重新应用解锁...");
            setTimeout(() => {
              enableCopyPaste(document.body);
              handleIframes();
            }, 500);
          }
        });
        
        bodyObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // 处理学习通常见的文本选择区域
        const selectionAreas = document.querySelectorAll('.ans-reading, .ans-job-finished, .ans-attach-ct, .textHTML, .ans-cc');
        selectionAreas.forEach(area => {
          if (area) {
            enableCopyPaste(area);
          }
        });
      }
    }
    
    // 页面加载完成后执行
    function init() {
      console.log('复制粘贴解锁器初始化...');
      removeEventListeners();
      enableCopyPaste(document.body);
      handleChaoxing();
      
      // 创建提示消息
      const notification = document.createElement('div');
      notification.textContent = '复制粘贴限制已解除';
      notification.style.position = 'fixed';
      notification.style.bottom = '20px';
      notification.style.right = '20px';
      notification.style.padding = '10px 15px';
      notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      notification.style.color = 'white';
      notification.style.borderRadius = '4px';
      notification.style.zIndex = '9999';
      notification.style.opacity = '1';
      notification.style.transition = 'opacity 0.5s';
      
      document.body.appendChild(notification);
      
      // 2秒后隐藏提示
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, 2000);
      
      // 监听粘贴事件，辅助处理一些特殊情况
      document.addEventListener('paste', function(e) {
        // 确保粘贴事件能够正常进行
        if (e.isTrusted) {
          // 不做任何阻止
        }
      }, true);
      
      // 周期性重新应用解锁，以防网站在加载后动态应用限制
      setInterval(function() {
        enableCopyPaste(document.body);
        handleChaoxing();
      }, 5000);
      
      // 监听页面可见性变化，当页面从隐藏变为可见时重新应用解锁（例如从其他标签页切回）
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          console.log('页面可见性变化，重新应用解锁...');
          enableCopyPaste(document.body);
          handleChaoxing();
        }
      });
      
      // 劫持history API以检测页面导航
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;
      
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        console.log('检测到pushState导航，重新应用解锁...');
        setTimeout(() => {
          enableCopyPaste(document.body);
          handleChaoxing();
        }, 500);
      };
      
      history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        console.log('检测到replaceState导航，重新应用解锁...');
        setTimeout(() => {
          enableCopyPaste(document.body);
          handleChaoxing();
        }, 500);
      };
      
      // 监听hashchange事件（URL的锚点变化）
      window.addEventListener('hashchange', function() {
        console.log('URL锚点变化，重新应用解锁...');
        setTimeout(() => {
          enableCopyPaste(document.body);
          handleChaoxing();
        }, 500);
      });
      
      // 监听所有点击事件，处理可能导致页面内容变化的操作
      document.addEventListener('click', function(e) {
        // 检测是否点击了学习通常见的导航元素
        if (e.target && (
            e.target.classList.contains('navItem') || 
            e.target.classList.contains('ans-job-icon') || 
            e.target.parentElement?.classList.contains('navItem') ||
            e.target.tagName === 'A' || 
            e.target.closest('a')
        )) {
          console.log('检测到潜在的页面导航点击，将在延迟后重新应用解锁...');
          setTimeout(() => {
            enableCopyPaste(document.body);
            handleChaoxing();
          }, 1000);
        }
      }, true);
    }
    
    // 当DOM加载完成时执行初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
    
    // 在页面加载完成时再次执行，确保覆盖所有内容
    window.addEventListener('load', function() {
      console.log('页面完全加载，再次应用解锁...');
      enableCopyPaste(document.body);
      handleChaoxing();
    });
    
    // 重写可能被网站覆盖的原生函数
    // 这是处理复制粘贴限制的核心方法
    const originalDescriptors = {};
    
    // 保存原始方法，以便后续可能的恢复
    ['copy', 'cut', 'paste', 'contextmenu', 'selectstart'].forEach(function(event) {
      originalDescriptors['on' + event] = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'on' + event);
    });
    
    // 覆盖Document原型上的方法
    ['oncontextmenu', 'oncopy', 'oncut', 'onpaste', 'onselectstart', 'onmousedown', 'onkeydown', 'onkeyup'].forEach(function(prop) {
      Object.defineProperty(Document.prototype, prop, {
        get: function() {
          return function() { return true; };
        },
        set: function() {
          return true;
        },
        configurable: true
      });
    });
    
    // 覆盖HTMLElement原型上的方法
    ['oncontextmenu', 'oncopy', 'oncut', 'onpaste', 'onselectstart', 'onmousedown', 'onkeydown', 'onkeyup'].forEach(function(prop) {
      Object.defineProperty(HTMLElement.prototype, prop, {
        get: function() {
          return function() { return true; };
        },
        set: function() {
          return true;
        },
        configurable: true
      });
    });
    
    // 特别处理学习通的函数
    // 覆盖或禁用学习通常用来阻止复制粘贴的函数
    const knownFunctions = [
      'forbidBackSpace',
      'checkRight',
      'canCopy',
      'disableCopy',
      'disablePaste',
      'disableSelect',
      'disableContextMenu',
      'removeSelect',
      'disablePrint',
      'disableSave',
      'disableViewSource',
      'oncontextmenu',
      'preventDefault',
      'AntiCopy'
    ];
    
    knownFunctions.forEach(function(funcName) {
      try {
        if (typeof window[funcName] === 'function') {
          window[funcName] = function() { return true; };
        }
      } catch (e) {}
    });
    
    // 尝试破解动态添加的事件监听器
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (['copy', 'paste', 'cut', 'contextmenu', 'selectstart', 'mousedown', 'keydown'].includes(type)) {
        // 不添加这些可能会限制复制粘贴的事件
        console.log('阻止添加事件: ' + type);
        return;
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
    
    // 覆盖 document.oncontextmenu = null 这种直接赋值
    Object.defineProperty(document, 'oncontextmenu', {
      get: function() { return function() { return true; }; },
      set: function() { return true; }
    });
    
    // 处理在控制台中手动设置的 JS 限制
    setInterval(function() {
      try {
        document.oncontextmenu = function() { return true; };
        document.oncopy = function() { return true; };
        document.onpaste = function() { return true; };
        document.onselectstart = function() { return true; };
        document.ondragstart = function() { return true; };
        document.onmousedown = function() { return true; };
      } catch (e) {}
    }, 2000);
})(); 