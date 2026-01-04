// ==UserScript==
// @name         小红书增强
// @name:zh-CN   小红书增强
// @name:zh-TW   小紅書增強
// @name:en      Xiaohongshu enhancement
// @version      1.1.3
// @author       DD2333
// @description  深色模式；更适合web大屏的三栏模式(图/文/评)；支持显示emoji表情；Tag可点击；
// @description:zh-TW  深色模式；更適合web大屏的三欄模式(圖/文/評)；支持顯示emoji表情；Tag可點擊；
// @description:en  This shit has non-chinese users Huh?
// @run-at       document-start
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GPL-3.0 License
// @supportURL   https://github.com/Duoduo23333333/XiaoHongShu_UserScript
// @homepageURL  https://github.com/Duoduo23333333/XiaoHongShu_UserScript
// @namespace https://greasyfork.org/users/1035963
// @downloadURL https://update.greasyfork.org/scripts/463833/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463833/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


// 4.21更新说明 4.21更新说明 4.21更新说明 4.21更新说明 4.21更新说明 4.21更新说明 4.21更新说明
//
// 网页又有变，想死，又重新适配了下深色模式样式。


// 4.19更新说明 4.19更新说明 4.19更新说明 4.19更新说明 4.19更新说明 4.19更新说明 4.19更新说明
//
// 1. 右上角月亮图标：修复了月亮图标偶尔缺席的bug。
// 2. 笔记独立页面(非悬浮窗)：优化加载速度，修复了两栏变三栏闪烁的bug，增加了官方红薯表情在中间栏只能显示成文本的bug。
// 3. 增加了脚本列表里的菜单选项，点击油猴图标可见。
// 4. 这两天忙毕设，上面的问题我忙完了会尽快解决，有问题QQ联系我 1243738449 。


// 4.14更新说明 4.14更新说明 4.14更新说明 4.14更新说明 4.14更新说明 4.14更新说明 4.14更新说明
//
// 1. 刚发现网页有变，深色模式/夜间模式有地方失效了。重新适配了下，更新完脚本记得刷新网页。
// 2. 下次出问题/有什么需要的功能， github 或 greasyfork 给我留个言，或者QQ联系我都行 1243738449 。


  // emoji
  (function () {

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.jsdelivr.net/npm/twemoji@14.0.2/dist/twemoji.min.js";
    script.async = false;
    document.body.appendChild(script);
    script.onload = function () {
      twemoji.parse(document.body, { className: "emoji" });
      var styles = document.createElement("style");
      styles.type = "text/css";
      styles.innerHTML = ".emoji { height: 1em; width: 1em; margin: 0 .05em 0 .1em; vertical-align: -0.1em; }";
      document.head.appendChild(styles);
      var observer = new MutationObserver(mutationHandler);
      observer.observe(document.body, { childList: true, subtree: true });
    };

    function mutationHandler(mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            twemoji.parse(node, { className: "emoji" });
          }
        });
      });
    }

  })();

  // 其他增强
  (function () {
    "use strict";
    //fuck函数
    function fuck() {
      // 创建新div
      const newDiv = document.createElement("div");
      newDiv.setAttribute("id", "dd233");
      newDiv.style.width = "400px";
      newDiv.style.height = "100%";
      newDiv.style.overflow = "auto";
      newDiv.style.padding = "24px 35px 30px 40px";
      // 隐藏divB防止闪烁
      const divA = document.querySelector(".note-scroller");
      const divB = divA.querySelector(".note-content");
      divB.style.display = "none";
      // 日期样式
      const dateDiv = divB.querySelector(".date");
      dateDiv.style.fontSize = "16px";
      dateDiv.style.marginBottom = "16px";
      dateDiv.style.paddingBottom = "6px";
      dateDiv.style.borderBottom = "0.5px solid rgba(200,200,200,.1)";
      dateDiv.parentNode.removeChild(dateDiv);
      divB.insertBefore(dateDiv, divB.children[1]);

      // 标题样式
      const titleDiv = divB.querySelector(".title");
      if (titleDiv) {
        titleDiv.style.marginBottom = "0";
      }

      // tag
      const descDivs = divB.querySelectorAll(".desc");
      // tag区前置及样式
        if (descDivs.length >= 2) {
            const firstDescElem = descDivs[0];
            const secondDescElem = descDivs[1];
            firstDescElem.parentNode.insertBefore(secondDescElem, firstDescElem);
            secondDescElem.style.marginBottom = '16px';
            secondDescElem.style.paddingBottom = '6px';
            secondDescElem.style.borderBottom = '0.5px solid rgba(200, 200, 200, 0.1)';
        }
      descDivs.forEach((descDiv) => {
        const spans = descDiv.querySelectorAll("span");

        spans.forEach((span) => {
          const text = span.textContent.trim();

          if (text.startsWith("#")) {
            const keyword = text.substring(1);

            // 把tag从span转成link
            const link = document.createElement("a");
            link.href = `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(keyword)}`;
            link.textContent = text;
            link.style.display = "inline-block";
            link.style.padding = "0.1em 0.5em";
            link.style.margin = "0.1px";
            link.style.fontSize = "85%";
            link.style.whiteSpace = "break-spaces";
            link.style.color = "#5e9ada";
            span.parentNode.replaceChild(link, span);
          }
        });
      });

      // 将此时的divB放到新div中
      const container = document.querySelector(".note-container");
      container.insertBefore(newDiv, container.children[1]);
      if (x == 1) {
        //什么都不做
      } else {
        container.style.position = "absolute";
        container.style.left = "-14%";
        container.style.transition = "none";
      }

      newDiv.innerHTML = divB.innerHTML;
      newDiv.style.display = "block";

      // 检测desc是否存在"["，如果不存在则不需要检测图片
      let hasBracket = false;
      const descDiv = divB.querySelector(".desc");
      if (descDiv && descDiv.textContent.indexOf("[") !== -1) {
        hasBracket = true;
      }

      if (!hasBracket) {
        // 不需要检测图片
        divB.parentNode.removeChild(divB);
        return;
      }

      // xhs表情文本是否已经变成img标签
      let checkImgInterval = setInterval(() => {
        const img = divB.querySelector("img");
        if (img) {
          newDiv.innerHTML = divB.innerHTML;
          divB.parentNode.removeChild(divB);

          clearInterval(checkImgInterval); // xhs表情转换完毕，清除定时器
        }
      }, 200);
    }

    //执行函数
var x = 0;
if ((window.location.href.indexOf("https://www.xiaohongshu.com/explore/") != -1 ||
     window.location.href.indexOf("https://www.xiaohongshu.com/search_result/") != -1) &&
    window.location.href.indexOf("https://www.xiaohongshu.com/search_result/?ke") == -1) {


    document.addEventListener('DOMContentLoaded', () => {
        x=1;
        fuck();
      });


return;
}
 else {
      const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (
            mutation.type === "childList" &&
            mutation.target.classList.contains("note-scroller")
          ) {
            fuck(); // 执行fuck函数
              console.log('112');
              console.log(window.location.href);
            observer.disconnect(); // 断开监听
            setTimeout(() => {
              observer.observe(document.body, { childList: true, subtree: true }); // 200毫秒后重新开始监听
            }, 200);
            return;
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  })();

  // 深浅色模式
(function () {
"use strict";

/* 判断浏览器是否支持localStorage */
if (typeof localStorage === 'undefined') {
 alert('当前浏览器不支持localStorage\n无法切换颜色模式\n\n除以下浏览器外均支持localStorage\nIE7及更低版本 ;\nSafari 4.0及更低版本 ;\nOpera Mini 和 Opera Mobile的某些版本; \n\n换用其他浏览器即可');
}

/* 记录当前的深浅色模式状态 */
let isDarkMode = false;

/* 获取localStorage中存储的主题模式偏好 */
const getThemePreference = () => {
  const theme = localStorage.getItem('xhs_theme_preference');
  return theme === 'dark' ? 'dark' : 'light';
};

/* 存储主题模式偏好到localStorage */
const setThemePreference = (theme) => {
  localStorage.setItem('xhs_theme_preference', theme);
};

/* 应用指定的CSS文件 */
const applyCss = (url) => {
  if (localStorage.getItem(url)) {

    GM_addStyle(localStorage.getItem(url));

  } else {
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        localStorage.setItem(url, text);
        GM_addStyle(text);
      })
      .catch((error) => console.error(`Error fetching CSS: ${error}`));
  }
};

/* 切换深浅色模式 */
const toggleTheme = () => {
  isDarkMode = !isDarkMode;
  const themePreference = isDarkMode ? 'dark' : 'light';
  if (themePreference === 'dark') {
    applyCss('https://cdn.jsdelivr.net/gh/Duoduo23333333/XiaoHongShu_UserScript@1.1.2/darkmode.css');
  } else {
    const existingLink = document.querySelector('link[href="https://cdn.jsdelivr.net/gh/Duoduo23333333/XiaoHongShu_UserScript@1.1.2/darkmode.css"]');
    if (existingLink) {
      existingLink.remove();
    }
      alert('已换回浅色模式，请手动刷新网页。');

  }
  setThemePreference(themePreference);
};

/* 主程序 */
const main = () => {

  const themePreference = getThemePreference();
  isDarkMode = themePreference === 'dark';

  applyCss(isDarkMode ? 'https://cdn.jsdelivr.net/gh/Duoduo23333333/XiaoHongShu_UserScript@1.1.2/darkmode.css' : '');

  /* 初次加载时，提示用户切换到深色模式 */
  if (typeof localStorage !== 'undefined' && !localStorage.getItem('xhs_theme_preference')) {
    alert('使用说明\n---------------------------------------\n· 右上角图标切换夜间模式\n· tag 可点击\n· 支持 emoji 显示\n· 三栏显示(图/文/评)\n· 如需调整比例，Ctrl+鼠标滚轮或键盘+-');
    setThemePreference('dark');
  }

  /* 监听小红书切换主题事件，用来更新localStorage中的主题偏好 */
  const observeThemeChanges = () => {
    const body = document.querySelector('body');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const themePreference = body.classList.contains('theme-dark') ? 'dark' : 'light';
          setThemePreference(themePreference);
        }
      });
    });
    observer.observe(body, { attributes: true });
  };
  observeThemeChanges();



};

/* 创建切换按钮并添加到指定元素 */
const addbutton = () => {
const createToggleButton = () => {
    const dropdownNav = document.querySelector('.dropdown-nav');
    if (!dropdownNav) {
      console.warn('未找到 class 为 dropdown-nav 的元素，无法添加深浅色模式切换按钮');
      return;
    }
    const button = document.createElement('button');
    button.setAttribute("id", "button");
    button.innerHTML = isDarkMode
      ?  '<svg t="1677925762871" class="icon" style="pointer-events:none;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20150" width="18" height="18" style="transform: translateY(1.5px)"><path d="M399.61 49.951C399.61 22.353 377.257 0 349.659 0 274.607 0 0 209.845 0 499.512 0 789.18 234.82 1024 524.488 1024 814.155 1024 1024 747.47 1024 674.341c0-27.598-22.353-49.95-49.951-49.95s-301.181 67.683-472.014-103.15C331.202 350.408 399.61 77.549 399.61 49.951z" p-id="20151" data-spm-anchor-id="a313x.7781069.0.i59" class="selected" fill="#707070"></path></svg>'
      : '<svg t="1677925762871" class="icon" style="pointer-events:none;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20150" width="18" height="18" style="transform: translateY(1.5px)"><path d="M399.61 49.951C399.61 22.353 377.257 0 349.659 0 274.607 0 0 209.845 0 499.512 0 789.18 234.82 1024 524.488 1024 814.155 1024 1024 747.47 1024 674.341c0-27.598-22.353-49.95-49.951-49.95s-301.181 67.683-472.014-103.15C331.202 350.408 399.61 77.549 399.61 49.951z" p-id="20151" data-spm-anchor-id="a313x.7781069.0.i59" class="selected" fill="#707070"></path></svg>';
    button.style.cursor = "pointer";
    button.style.opacity = "0.9";
  button.style.transform = 'translateY(3px)';
    button.style.borderRadius = "50%";
  button.style.marginLeft = "16px";
  button.style.width = "40px";
  button.style.height = "40px";

    button.addEventListener("mouseover", () => {
      button.style.opacity = "0.7";
    });
    button.addEventListener("mouseout", () => {
      button.style.opacity = "0.9";
    });
    button.addEventListener('click', toggleTheme);
    dropdownNav.appendChild(button);
  };

  window.onload = function () {
    createToggleButton();
};

};



addbutton();
main();

})();



function showUpdateLog() {
        alert('******************\n4.21更新说明\n******************\n\n网页又有变，想死，又重新适配了下深色模式样式。');
}

function huabing() {
    alert('******************\n未来更新计划\n******************\n\n1. 两栏or三栏可选\n2. 去除未登录状态下的登录弹窗提示\n3. 笔记一键分享按钮\n4. 无水印原视频下载\n5. 禁用原版过渡动画\n6. 想不到了');
}

function contactMe() {
    alert('qq 1243738449');
}


GM_registerMenuCommand('本次更新日志', showUpdateLog);
GM_registerMenuCommand('接下来的更新计划', huabing);
GM_registerMenuCommand('出问题联系我  QQ 1243738449', contactMe);