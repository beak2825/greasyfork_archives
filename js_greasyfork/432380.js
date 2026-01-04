// ==UserScript==
// @name         修复阮一峰博客广告拦截器问题
// @version      0.6.2
// @description  修复阮一峰博客中广告拦截器导致的显示问题，并提供解决方案以移除提示信息。
// @author       kj863257
// @match        *://*.ruanyifeng.com/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/168722
// @supportURL   https://greasyfork.org/zh-CN/scripts/432380
// @downloadURL https://update.greasyfork.org/scripts/432380/%E4%BF%AE%E5%A4%8D%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/432380/%E4%BF%AE%E5%A4%8D%E9%98%AE%E4%B8%80%E5%B3%B0%E5%8D%9A%E5%AE%A2%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA%E5%99%A8%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

// 保存原始的getComputedStyle函数
var originalGetComputedStyle = window.getComputedStyle;

// 重写getComputedStyle
window.getComputedStyle = function(element) {
  // 调用原始的getComputedStyle获取样式对象
  var style = originalGetComputedStyle.apply(this, arguments);

  // 创建代理对象
  var styleProxy = new Proxy(style, {
    get: function(target, prop) {
      // 判断是否获取.display属性
      if (prop === 'display') {
        // 在这里可以添加自定义逻辑，例如判断元素类型并返回计算结果
        if (element.tagName.toLowerCase() === 'img') {
          // 对于img元素，返回计算后的display值
          return calculateDisplayForImg(element);
        } else if (element.parentElement) {
          // 对于父元素，返回计算后的display值
          return calculateDisplayForParent(element.parentElement);
        }
      }

      // 对于其他属性，返回原始样式对象中的值
      return target[prop];
    }
  });

  return styleProxy;
};

// 自定义逻辑：计算img元素的display值
function calculateDisplayForImg(imgElement) {
  if (imgElement.src.indexOf('wangbase.com') === -1) {
    return imgElement.display;
  }
  return 'inline';
}

// 自定义逻辑：计算父元素的display值
function calculateDisplayForParent(parentElement) {
  if (parentElement.parentElement.id === 'feed_icon') {
    return 'inline';
  }
  return parentElement.display;
}

// 移除检测脚本
document.querySelector('script[src*=checker]')?.remove();

// 保存原始的setTimeout函数
window._setTimeout = window.setTimeout;

// 重写setTimeout，过滤掉checker函数
var fun = (f, t) => {
  if (f.name !== 'checker') {
    window._setTimeout(f, t);
  }
};
window.setTimeout = fun;

// 克隆主内容元素
var content = document.querySelector('#main-content').cloneNode(true);

// 加载CSS文件
function loadjscssfile(filename) {
  var fileref = document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

// 修复阮一峰博客布局的函数
function ruanyifeng() {
  document.getElementsByClassName('asset-meta')[0].nextElementSibling.style = 'display:none';
  document.querySelector('article.hentry').insertBefore(content, document.querySelector('.asset-footer'));
}

// 设置各种动作的超时
setTimeout(() => {
  var feedIconLink = document.querySelector('#feed_icon > a');
  feedIconLink.innerHTML = '<img src="https://wangbase.com/blogimg/asset/202107/bg2021072117.png" alt="" style="border: 0pt none;">';
}, 200);

setTimeout(ruanyifeng, 800);
loadjscssfile('/static/themes/theme_scrapbook/theme_scrapbook.css');