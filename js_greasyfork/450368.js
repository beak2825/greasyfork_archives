// ==UserScript==
// @name        强制缩放与桌面模式
// @author      Lemon399
// @description 浏览器ua为手机ua时启用强制缩放，浏览器ua非手机ua时启用桌面模式，脚本菜单可以单独设置桌面模式宽度或全局宽度
// @match       *://*/*
// @exclude    https://sj.qq.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_unsetValue
// @version     9.2
// @run-at     document-start
// @namespace   https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/450368/%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE%E4%B8%8E%E6%A1%8C%E9%9D%A2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450368/%E5%BC%BA%E5%88%B6%E7%BC%A9%E6%94%BE%E4%B8%8E%E6%A1%8C%E9%9D%A2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

const domain = window.location.hostname;
let globalViewportWidth = GM_getValue('globalViewportWidth', 1080);
let viewportWidth = GM_getValue(`viewportWidth_${domain}`, globalViewportWidth);
let userAgent = navigator.userAgent;

// 检查脚本是否启用
let scriptEnabled = GM_getValue('scriptEnabled', true);

function setViewportWidth(width) {
  viewportWidth = width;
  GM_setValue(`viewportWidth_${domain}`, width); // 将视口宽度与域名关联存储
  autoChangeScale(); // 更新视口宽度后自动调整缩放比例
}

function setGlobalViewportWidth(width) {
  globalViewportWidth = width;
  GM_setValue('globalViewportWidth', width); // 设置全局视口宽度
  if (!GM_getValue(`viewportWidth_${domain}`)) {
    viewportWidth = width; // 更新当前网站的视口宽度，如果未单独设置过
  }
  autoChangeScale();
}

function autoChangeScale() {
  if (!scriptEnabled) return; // 如果脚本禁用，则不执行缩放调整

  const metaTag = document.querySelector('meta[name=viewport]');
  if (metaTag) {
    const isMobile =
      userAgent.indexOf('Mobile') < 0 &&
      userAgent.indexOf('SymbianOS') < 0 &&
      userAgent.indexOf('SearchCraft') < 0;

    metaTag.setAttribute('content', isMobile ? `width=${viewportWidth}` : 'width=device-width,initial-scale=1.0,maximum-scale=10.0,user-scalable=1');
  }
}

autoChangeScale();

//监听url变化执行
history.pushState = ( f => function pushState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('urlchange'));
    return ret;
  })(history.pushState);
history.replaceState = ( f => function replaceState(){
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('urlchange'));
    return ret;
  })(history.replaceState);
window.addEventListener('popstate',()=>{
    window.dispatchEvent(new Event('urlchange'))
});

window.addEventListener('urlchange', function(event) {
 window.setTimeout(autoChangeScale, 100);
});

//双指执行
document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 1) {
      autoChangeScale();
    }
  });

//监听宽度变化
const mediaQuery = window.matchMedia(`(width: ${viewportWidth}px)`);

function handleViewportChange(event) {
    if (!event.matches) {
        autoChangeScale();
    }
}

mediaQuery.addEventListener('change', handleViewportChange);
handleViewportChange(mediaQuery);

// 添加菜单命令
GM_registerMenuCommand('设置此网站视口宽度', function() {
  const inputWidth = prompt('请输入视口宽度：', viewportWidth);
  if (inputWidth) {
    const parsedWidth = parseInt(inputWidth, 10);
    if (!isNaN(parsedWidth)) {
      setViewportWidth(parsedWidth);
    } else {
      alert('输入的宽度无效，请输入一个有效的数字！');
    }
  }
});

GM_registerMenuCommand('设置全局视口宽度', function() {
  const inputWidth = prompt('请输入全局视口宽度：', globalViewportWidth);
  if (inputWidth) {
    const parsedWidth = parseInt(inputWidth, 10);
    if (!isNaN(parsedWidth)) {
      setGlobalViewportWidth(parsedWidth);
    } else {
      alert('输入的宽度无效，请输入一个有效的数字！');
    }
  }
});

// 启用/禁用脚本菜单命令
GM_registerMenuCommand(scriptEnabled ? '在此网站禁用' : '在此网站启用', function() {
  scriptEnabled = !scriptEnabled;
  GM_setValue('scriptEnabled', scriptEnabled);
  if (scriptEnabled) {
    autoChangeScale(); // 启用脚本并立即应用设置
    GM_registerMenuCommand('在此网站禁用', function() {
      GM_setValue('scriptEnabled', false);
      location.reload(); // 禁用脚本并刷新页面
    });
  } else {
    GM_registerMenuCommand('在此网站启用', function() {
      GM_setValue('scriptEnabled', true);
      autoChangeScale(); // 启用脚本并立即应用设置
    });
  }
});
