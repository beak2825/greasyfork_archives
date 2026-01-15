// ==UserScript==
// @name         蓝奏云优化
// @version      4.2
// @description  蓝奏云apk文件重定向域名，自动点击下载，记住分享密码自动填写
// @author       DeepSeek
// @include      *.lanosso.com/*
// @include      *.lanzn.com/*
// @include      *.lanzog.com/*
// @include      *.lanpw.com/*
// @include      *.lanpv.com/*
// @include      *.lanzv.com/*
// @include      *://*.lanz*.com/*
// @include      *://lanz*.com/*
// @run-at      document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/489281/%E8%93%9D%E5%A5%8F%E4%BA%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/489281/%E8%93%9D%E5%A5%8F%E4%BA%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 获取页面中所有的iframe元素
const iframes = document.getElementsByTagName('iframe');

// 如果有找到iframe
if (iframes.length > 0) {
  // 遍历所有iframe
  for (let i = 0; i < iframes.length; i++) {
    // 获取iframe的src属性（链接）
    const iframeSrc = iframes[i].src;
    
    // 检查src是否有效（非空且不是about:blank）
    if (iframeSrc && iframeSrc !== 'about:blank') {
      // 在当前标签页打开链接
      window.location.href = iframeSrc;
      break; // 只打开第一个有效的iframe链接
    }
  }
}

//当前标签打开
// 修改所有链接的target属性
function modifyLinks() {
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute('target', '_self');
  }
  
  // 处理base标签
  let base = document.getElementsByTagName('base')[0];
  if (base) {
    base.setAttribute('target', '_self');
  } else {
    const head = document.getElementsByTagName('head')[0];
    const newBase = document.createElement('base');
    newBase.setAttribute('target', '_self');
    head.appendChild(newBase);
  }
}

modifyLinks();

//重定向域名
// 检查页面是否包含"会员"文本
if (document.body.innerText.includes('会员')) {
    // 检查当前网址是否不包含目标域名
    if (!window.location.href.includes('https://www.lanzn.com/')) {
        // 创建一个URL对象以便于操作
        const currentUrl = new URL(window.location.href);
        
        // 替换域名部分
        currentUrl.hostname = 'www.lanzn.com';
        
        // 保留协议（http/https）
        const newUrl = currentUrl.toString();
        
        // 重定向到新URL
        window.location.href = newUrl;
        return; // 确保重定向后不再执行后续代码
    }
}

//自动下载 - 增加了0.5秒延迟重试
// 定义要点击的选择器数组
const selectorsToClick = [
  'a.appa',
  'a[href="javascript:filego();"]',
  'a[href^="/tp/"]'
];

// 执行点击操作的函数
function performAutoClick() {
  let clicked = false;
  
  // 遍历每个选择器并点击匹配的元素
  selectorsToClick.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      link.click();
      clicked = true;
    });
  });
  
  // 获取所有 href 包含 "/file/" 的 <a> 标签，并自动点击
  document.querySelectorAll('a[href*="/file/"]').forEach(link => {
    link.click();
    clicked = true;
  });
  
  // 查找具有 onclick='m_load();' 属性的父元素，并在该父元素中查找子元素 <a> 进行点击
  const mLoadLink = document.querySelector("[onclick='m_load();'] > a");
  if (mLoadLink) {
    mLoadLink.click();
    clicked = true;
  }
  
  return clicked;
}

// 初始执行点击
let hasClicked = performAutoClick();

// 如果初始没有点击到任何元素，延迟0.5秒后重试
if (!hasClicked) {
  setTimeout(() => {
    performAutoClick();
  }, 500); // 延迟500毫秒（0.5秒）
}

// 选择要监视的目标元素
const targetNode = document.body;

// 配置观察器的选项（监视子节点变动）
const config = { childList: true, subtree: true };

// 创建一个观察器实例并指定回调函数
const observer = new MutationObserver(function(mutationsList) {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.tagName && node.tagName.toLowerCase() === 'a') {
                    // 查找具有 onclick='m_load();' 属性的父元素，并在该父元素中查找子元素 <a> 进行点击
                    const mLoadLink = document.querySelector("[onclick='m_load();'] > a");
                    if (mLoadLink) {
                        mLoadLink.click();
                    }
                    
                    // 获取所有 href 包含 "/file/" 的 <a> 标签，并自动点击
                    document.querySelectorAll('a[href*="/file/"]').forEach(link => {
                        link.click();
                    });
                }
            });
        }
    }
});

// 通过观察器实例与目标节点绑定
observer.observe(targetNode, config);

function extractAndNavigateURL() {
  // 获取整个页面的 HTML 源码，包括 script 标签中的内容
  var htmlSource = document.documentElement.innerHTML;
  // 使用正则表达式匹配并提取 vkjxld 和 hyggid 变量的值
  var vkjxldMatch = htmlSource.match(/\nvar vkjxld\s*=\s*['"]([^'"]+)['"];/);
  var hyggidMatch = htmlSource.match(/var hyggid\s*=\s*['"]([^'"]+)['"];/);
  // 确保匹配并提取成功
  if (vkjxldMatch && hyggidMatch) {
    // 分别获取匹配到的值
    var vkjxldValue = vkjxldMatch[1];
    var hyggidValue = hyggidMatch[1];
    // 拼接得到完整 URL
    var completeURL = vkjxldValue + hyggidValue;
    // 在当前标签页打开拼接好的 URL
    window.location.href = completeURL;
  } else {
    (function() {
      // 获取整个页面的 HTML 源码，包括 script 标签中的内容
      var htmlSource = document.documentElement.innerHTML;
      // 使用正则表达式匹配并提取 link 变量的值
      var urlptMatch = htmlSource.match(/var urlpt\s*=\s*['"]([^'"]+)['"];/);
      var linkMatch = htmlSource.match(/var link\s*=\s*['"]([^'"]+)['"];/);
      if (urlptMatch && linkMatch) {
        // 获取当前页面的域名，包括协议部分
        let urlptValue = urlptMatch[1];
        if(urlptValue === '/' ) urlptValue = window.location.origin;
        // 获取匹配到的 link 变量的值
        var linkValue = linkMatch[1];
        // 拼接当前域名和 link 变量的值
        var completeURL = urlptValue + '/' + linkValue;
        // 在当前标签页打开拼接好的 URL
        window.location.href = completeURL;
      } else {
      }
    })();
  }
}
extractAndNavigateURL();

//记住密码
(function() {
    'use strict';

    function init() {
        retrieveAndFill();
        monitorChanges();
    }

    function retrieveAndFill() {
        document.querySelectorAll('input[type="text"], textarea').forEach(function(element) {
            const id = getElementIdentifier(element);
            const storedValue = localStorage.getItem(id);
            if (storedValue) {
                element.value = storedValue;
            }
        });
    }

    function monitorChanges() {
        document.querySelectorAll('input[type="text"], textarea').forEach(function(element) {
            element.removeEventListener('input', handleInputChange); // 防止重复监听
            element.addEventListener('input', handleInputChange);
        });
    }

    function handleInputChange(event) {
        const element = event.target;
        const id = getElementIdentifier(element);
        localStorage.setItem(id, element.value);
    }

    function getElementIdentifier(element) {
        // 使用页面URL、元素的name、id或类名的组合作为唯一标识符
        let identifier = window.location.hostname + window.location.pathname;
        identifier += ':' + (element.name || element.id || element.classList[0] || getXPathForElement(element));
        return identifier;
    }

    function getXPathForElement(element) {
        const paths = [];
        for (; element && element.nodeType === Node.ELEMENT_NODE; element = element.parentNode) {
            let index = 0;
            let hasFollowingSiblings = false;
            for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) continue;
                if (sibling.nodeName === element.nodeName) ++index;
            }
            for (let sibling = element.nextSibling; sibling && !hasFollowingSiblings; sibling = sibling.nextSibling) {
                if (sibling.nodeName === element.nodeName) hasFollowingSiblings = true;
            }
            const tagName = element.nodeName.toLowerCase();
            const pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }
        return paths.length ? "/" + paths.join("/") : null;
    }

    // 监听DOM变化来支持动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                init(); // 如果检测到新增节点，则重新初始化
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    init(); // 初始执行
})();

//会员文件提示
document.querySelector('div.fbox').textContent = "会员文件，需要开桌面模式下载";