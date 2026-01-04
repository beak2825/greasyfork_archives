// ==UserScript==
// @name        破解复制登录、去除复制后缀、网页全局可选、新增code标签代码复制
// @name:en     Cracking replication login, removing replication suffixes, web page global Optional
// @name:zh-CN   破解复制登录、去除复制后缀、网页全局可选、新增code标签代码复制
// @description   可以破解禁止登录和复制的限制。它可以让你在网页上自由复制和粘贴，而不会受到版权声明的限制。
// @description:en     You can circumvent the restrictions that prohibit login and replication. It allows you to copy and paste freely on web pages without being restricted by copyright notices.
// @description:zh-CN  可以破解禁止登录和复制的限制。它可以让你在网页上自由复制和粘贴，而不会受到版权声明的限制。
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  破解复制登录、去除复制后缀、网页全局可选、新增code标签代码复制
// @author       zzailianlian
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meitun-test.com
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/459509/%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%E3%80%81%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%80%E5%8F%AF%E9%80%89%E3%80%81%E6%96%B0%E5%A2%9Ecode%E6%A0%87%E7%AD%BE%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/459509/%E7%A0%B4%E8%A7%A3%E5%A4%8D%E5%88%B6%E7%99%BB%E5%BD%95%E3%80%81%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%90%8E%E7%BC%80%E3%80%81%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%80%E5%8F%AF%E9%80%89%E3%80%81%E6%96%B0%E5%A2%9Ecode%E6%A0%87%E7%AD%BE%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let initCount = 0;
  let flag = false;



  const initMountHandle = item => {
    if (!item.tagName) return;


    // 替换所有的'面试'、'面经'、‘一面’、‘二面’、‘三面’、‘四面’、‘五面’、‘初面’、‘终面’、‘最终面’替换为'JS'字样
    // 替换offer为'js奖章'
    // 遍历所有文本节点并替换符合要求的内容
    var textNodes = getTextNodes(document.body);
    for (var i = 0, len = textNodes.length; i < len; ++i) {
      var node = textNodes[i];
      var newText = node.textContent.replace(/(面试|面经|一面|二面|三面|四面|五面|初面|终面|最终面|offer)/g, "js").replace(/美团/g, 'mt').replace(/阿里/g, 'al').replace(/字节跳动/g, 'zjtd').replace(/前端/g, 'qd').replace(/华为/, 'hw');
      if (newText != node.textContent) {
        node.textContent = newText;
      }
    }
    if (window.location.href.includes('nowcoder.com')) {
      document.title = 'js-test'
      document.querySelector('.logo').style.display = 'none'
    }

    // 给所有的代码块加上复制按钮
    // 新增一个按钮悬浮定位到body顶部，如果点击，咋flag为true，再次点击flag为false

    if (initCount < 1) {
      const flagButton = document.createElement('button');
      flagButton.innerText = '开/关code代码块复制';
      flagButton.style.position = 'fixed';
      flagButton.style.top = '0';
      flagButton.style.right = '10px';
      flagButton.style.zIndex = '9999';
      flagButton.style.padding = '6px 10px';
      flagButton.style.borderRadius = '4px';
      flagButton.style.color = 'black';
      // flagButton.style.background = 'red';
      flagButton.style.background = 'rgba(255, 255, 255, 0.8)';
      flagButton.style.cursor = 'pointer';
      document.body.appendChild(flagButton);



      flagButton.addEventListener('click', () => {
        flag = !flag;
        console.log('Flag:', flag);
      });
    }
    initCount++;

    if (item.tagName === 'PRE' && !item.innerHTML.includes('new_add_crack_copy_login_eg')) {
      // 在code区域右上角创建一个固定定位的div框
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = '0';
      // div.style.top = '-22px';
      div.style.left = '50%';
      div.style.minWidth = '24px';
      div.style.transform = 'translate(-50%,0)';
      div.style.padding = '2px 8px';
      div.style.borderRadius = '6px';
      div.setAttribute('new_add_crack_copy_login_eg', true);
      // div.style.backgroundColor = 'red';
      div.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
      div.style.color = 'white';
      div.style.userSelect = 'none';
      div.style.cursor = 'pointer';
      div.innerText = '复制';
      div.style.display = 'none';
      div.style.whiteSpace = 'nowrap';
      div.onclick = () => {
        copyText(item.innerText.slice(0, -2));
      };
      item.appendChild(div);
      item.style.position = 'relative';
      item.onmouseenter = () => {
        // console.log('出发了mouseenter事件,flag', flag, div, div.style.display, item)
        flag && (div.style.display = 'block');
        // div.style.display = 'block'
      };
      item.onmouseleave = () => {
        div.style.display = 'none';
      };
    }
    // 复制时删除版权声明，打破复制限制
    item.oncopy = function (e) {
      e.stopPropagation();
    };
    item.addEventListener(
      'copy',
      function (e) {
        e.stopPropagation();
      },
      true
    );
    // 全局可选择
    item.style.setProperty('user-select', 'auto');
    //   const removedNodes = mutation.removedNodes;
    // 处理新增或删除的DOM元素
  };

  // 获取 body 元素
  const targetNode = document.querySelector('body');

  // 创建新 observer 对象并传入回调函数
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;

        if (addedNodes instanceof NodeList) {
          // const flag = [...addedNodes].every(node => node.getAttribute('new_add_crack_copy_login_eg'))
          // if (flag) {
          //   return;
          // }
          [...addedNodes].forEach(item => {
            if (!item.tagName) return;
            [...item.children].forEach(child => {
              initMountHandle(child, 'add');
            });
          });
        }
      }
    });
  });

  // 配置观察选项（可选择监听属性、子孙节点等）
  const config = { attributes: false, childList: true, subtree: true, characterData: true };

  // 将配置选项和 callback 函数都传入 observer 实例, 然后开始观察
  observer.observe(targetNode, config);

  // 停止观察
  // observer.disconnect();

  function copyText(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('new_add_crack_copy_login_eg', true);
    document.body.appendChild(textArea);
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? '已成功复制到剪贴板！' : '无法复制所选文本';
      console.log(msg);
    } catch (err) {
      console.error('无法复制所选文本', err);
    }
    document.body.removeChild(textArea);
  }
  [...document.querySelectorAll('*')].forEach(item => {
    initMountHandle(item);
  });

  // 获取所有文本节点
  function getTextNodes(node) {
    var nodes = [];
    if (node.nodeType == 3) { // 文本节点
      nodes.push(node);
    } else {
      var children = node.childNodes;
      for (var i = 0, len = children.length; i < len; ++i) {
        nodes.push.apply(nodes, getTextNodes(children[i]));
      }
    }
    return nodes;
  }

  /** 针对钉钉文档不让复制的问题，考虑有以下解决办法
   * 1. 通过charles代理重写接口绕开权限校验
   * 2. 通过浏览器打开钉钉文档，然后通过谷歌插件重写权限接口，绕开权限校验
   * 3. 本地把网页保存到本地文件 ， 这个是ok的
   * 4. 重写复制功能
   * 5. 选中时触发自定义复制功能
   * 6. 筛选dom元素通过innerText获取内容并且拼接字符串
   * 7. 通过截图文件截长图
   */
})();

