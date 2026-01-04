// ==UserScript==
// @name        keyToShowClass | 快捷键启动自定义样式
// @namespace   https://leizingyiu.net
// @match       http*://*/*
// @grant       none
// @version     20250309
// @author      leizingyiu
// @description Press a shortcut key to activate the specified host's custom styling. | 点击某个快捷键，来启动你指定的host的自定义的样式
// @license     GNU AGPLv3

// @downloadURL https://update.greasyfork.org/scripts/529304/keyToShowClass%20%7C%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%90%AF%E5%8A%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529304/keyToShowClass%20%7C%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%90%AF%E5%8A%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

prefix = "yiu_lib_show_info_";
// 定义样式模板字典
const dict = {
  "example":"⬇️",
  "liblib.art": {
    KeyC: `
      .${prefix}$/{code/} [class^=ImageCard_mask],
      .${prefix}$/{code/} [class^=ImageCard_imageCard] {
        opacity: 1 !important;
        background: #00000000 !important;
        color: #000 !important;
      }

      .${prefix}$/{code/} [class^=ImageCard_nickName],
      .${prefix}$/{code/} [class^=ImageGenerateInfoPopover_generateBtn] {
        color: #fff !important;
        text-shadow: unset !important;
        mix-blend-mode: difference;
      }

      .${prefix}$/{code/} [class^=ImageCard_drawBtn],
      .${prefix}$/{code/} .opacity-0 {
        opacity: 1 !important;
      }

      [class^=ImageCard_mask],
      [class^=ImageCard_imageCard] {
        transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease !important;
      }

      [class^=ImageCard_nickName],
      [class^=ImageGenerateInfoPopover_generateBtn] {
        transition: text-shadow 0.2s ease, color 0.2s ease !important;
      }

      [class^=ImageCard_drawBtn], .opacity-0 {
        transition: opacity 0.2s ease;
      }
    `,
  },
  // 可以扩展其他主机和按键
};

// 获取当前主机名
const currentHost = window.location.host;

function hasSetting(host) {
  for (const [hostKey, styles] of Object.entries(dict)) {
    if (host.includes(hostKey)) {
      return true; // 如果当前主机包含字典中的主机名，则返回对应的样式模板
    }
  }
  return false; // 如果没有匹配的主机名，返回 null
}

// 根据主机名获取对应的样式模板
function getHostStyles(host) {
  for (const [hostKey, styles] of Object.entries(dict)) {
    if (host.includes(hostKey)) {
      return styles; // 如果当前主机包含字典中的主机名，则返回对应的样式模板
    }
  }
  return null; // 如果没有匹配的主机名，返回 null
}

// 动态生成样式内容
function generateStyleContent(template, code) {
  return template.replace(/\$\/\{code\/\}/g, code); // 替换所有 $/{code/} 占位符
}

// 初始化样式
function initializeStyles() {
  const hostStyles = getHostStyles(currentHost); // 获取当前主机的样式模板

  if (!hostStyles) {
    console.error(`未找到与主机 ${currentHost} 匹配的样式模板`);
    return;
  }

  // 遍历主机的所有按键样式模板
  for (const [key, styleTemplate] of Object.entries(hostStyles)) {
    const styleContent = generateStyleContent(styleTemplate, key); // 替换占位符

    const styleElement = document.createElement("style");
    styleElement.textContent = styleContent; // 设置样式内容
    document.head.appendChild(styleElement); // 添加到 <head>
  }
}

// 初始化事件监听器
function initializeEventListeners() {
  const hostStyles = getHostStyles(currentHost); // 获取当前主机的样式模板

  if (!hostStyles) {
    console.error(`未找到与主机 ${currentHost} 匹配的样式模板`);
    return;
  }

  const toggleClass = (e) => {
    const key = e.code; // 获取按键代码
    console.log("key to show class : toggleClass : start");

    const isKeySupported = hostStyles.hasOwnProperty(key); // 检查按键是否在样式模板中

    if (isKeySupported) {
      console.log("key to show class : toggleClass : KeySupported");

      if (e.type === "keydown") {
        document.body.classList.add(`${prefix}${key}`); // 添加动态类名
      } else if (e.type === "keyup") {
        document.body.classList.remove(`${prefix}${key}`); // 移除动态类名
      }
    }
  };

  window.addEventListener("keydown", toggleClass);
  window.addEventListener("keyup", toggleClass);
}

// 主函数：初始化样式和事件监听器
function main() {
  console.log("key to show class : main : start");

  initializeStyles(); // 初始化样式
  initializeEventListeners(); // 初始化事件监听器

  console.log("key to show class : main : end ");
}

// window.addEventListener('load',function(){
//   if(hasSetting(currentHost)==true){
//     main();
//   }
// })

/**
 * 监听页面状态变化的函数
 * @param {Object} options - 配置对象，用于启用或禁用特定事件监听
 * @param {boolean} options.onUrlChange - 是否监听地址栏变化（hashchange 和 popstate）
 * @param {boolean} options.onPageNavigation - 是否监听页面前进或后退（popstate）
 * @param {boolean} options.onPageLoad - 是否监听页面加载完成（DOMContentLoaded 和 load）
 * @param {Function} [options.commonCallback] - 通用回调函数，适用于所有事件
 * @param {Object} callbacks - 回调函数对象（可选）
 * @param {Function} callbacks.onUrlChangeCallback - 地址栏变化时的回调
 * @param {Function} callbacks.onPageNavigationCallback - 页面前进或后退时的回调
 * @param {Function} callbacks.onPageLoadCallback - 页面加载完成时的回调
 */
function listenPageStateChanges(options = {}, callbacks = {}) {
  const {
    onUrlChange = false,
    onPageNavigation = false,
    onPageLoad = false,
    commonCallback, // 通用回调函数
  } = options;

  const {
    onUrlChangeCallback = commonCallback,
    onPageNavigationCallback = commonCallback,
    onPageLoadCallback = commonCallback,
  } = callbacks;

  // 1. 地址栏变化（hashchange 和 popstate）
  if (onUrlChange && typeof onUrlChangeCallback === "function") {
    window.addEventListener("hashchange", () => {
       onUrlChangeCallback(window.location.href);
    });

    window.addEventListener("popstate", () => {
       onUrlChangeCallback(window.location.href);
    });
  }

  // 2. 页面前进或后退（popstate）
  if (onPageNavigation && typeof onPageNavigationCallback === "function") {
    window.addEventListener("popstate", () => {
       onPageNavigationCallback(window.location.href);
    });
  }

  // 3. 页面加载完成（DOMContentLoaded 和 load）
  if (onPageLoad && typeof onPageLoadCallback === "function") {
    document.addEventListener("DOMContentLoaded", () => {
       onPageLoadCallback("DOMContentLoaded");
    });

    window.addEventListener("load", () => {
       onPageLoadCallback("load");
    });
  }
}

console.log("key to show class", hasSetting(currentHost));

if (hasSetting(currentHost) == true) {
  listenPageStateChanges(
    {
      onUrlChange: true, // 启用地址栏变化监听
      onPageNavigation: true, // 启用页面导航监听
      onPageLoad: true, // 启用页面加载完成监听
      commonCallback: (data) => {
        main(data);
      },
    },
    {
      // 如果需要单独定义某个事件的回调，可以在这里覆盖 commonCallback
      // 例如：
      // onUrlChangeCallback: (newUrl) => {
      //   console.log('单独处理地址栏变化:', newUrl);
      // },
    },
  );
}
