// ==UserScript==
// @name         色花堂美化
// @description  色花堂/98堂论坛网页桌面端美化
// @namespace    https://www.sehuatang.net
// @version      1.1
// @author       kitawa
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @match        http://127.0.0.1/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/526660/%E8%89%B2%E8%8A%B1%E5%A0%82%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526660/%E8%89%B2%E8%8A%B1%E5%A0%82%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

// ==================== 页面延迟显示 ====================
// #region 页面延迟显示模块
// 简单的1秒延迟显示
(function () {
  "use strict";

  // 添加延迟显示样式 - 页面隐藏但仍可渲染
  const delayStyle = document.createElement("style");
  delayStyle.textContent = `
        body {
            visibility: hidden !important;
            opacity: 0 !important;
            transition: opacity 0.25s ease !important;
        }
        body.page-ready {
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;

  if (document.head) {
    document.head.appendChild(delayStyle);
  } else {
    document.documentElement.appendChild(delayStyle);
  }

  // 1秒后显示已渲染完成的页面
  setTimeout(() => {
    document.body.classList.add("page-ready");
  }, 800);

  // 创建背景层
  function createBackground() {
    if (window.self !== window.top) return; // iframe中不创建背景

    if (!document.querySelector(".gradient-background")) {
      const gradientDiv = document.createElement("div");
      gradientDiv.className = "gradient-background";

      if (document.body) {
        document.body.appendChild(gradientDiv);
      } else {
        // body不存在时，等待DOM加载
        document.addEventListener("DOMContentLoaded", () => {
          if (!document.querySelector(".gradient-background")) {
            document.body.appendChild(gradientDiv);
          }
        });
      }
    }
  }

  // 立即创建背景
  createBackground();
})();
// #endregion

// #region
// 1. 立即保存原始函数，防止被其他脚本覆盖
(function preserveOriginalFunctions() {
  let checkCount = 0;
  const maxChecks = 200; // 最多检查10秒

  const checkAndSave = () => {
    checkCount++;

    // 决策理由：确保原始函数被正确保存，支持多种函数名变体
    if (window.showcalendar && !window.originalShowcalendar) {
      window.originalShowcalendar = window.showcalendar;
    }

    if (window.viewhot && !window.originalViewhot) {
      window.originalViewhot = window.viewhot;
    }

    // 尝试保存可能的函数变体
    if (window.viewHot && !window.originalViewHot) {
      window.originalViewHot = window.viewHot;
    }

    // 如果函数还没有加载且未超过最大检查次数，继续等待
    if ((!window.showcalendar || !window.viewhot) && checkCount < maxChecks) {
      setTimeout(checkAndSave, 50);
    } else if (checkCount >= maxChecks) {
    }
  };

  // 立即尝试保存
  checkAndSave();

  // 也在DOM加载时再次尝试
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkAndSave);
  }

  // 在window load事件时最后一次尝试
  window.addEventListener("load", checkAndSave);
})();

// 2. 创建和插入基础样式（立即执行，不依赖DOM）
const baseStyle = document.createElement("style");
baseStyle.type = "text/css";
baseStyle.innerHTML = `
html, body {
  margin: 0;
  background: none !important;
  background-image: none !important;
  position: relative;
}

.gradient-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: var(--background);
  filter: saturate(var(--saturation-level));
}

.gradient-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--background-overlay);
  z-index: 1;
}

/* 自定义颜色背景样式 */
.gradient-background.custom-color {
  background: var(--custom-background) !important;
}

/* 亮色模式下隐藏颜色背景的遮罩层 */
.theme-light .gradient-background.custom-color::before {
  display: none;
}

/* 暗色模式下为颜色背景显示遮罩层 */
.theme-dark .gradient-background.custom-color::before {
  display: block;
  background: rgba(0, 0, 0, var(--dark-overlay-opacity, 0.5));
}

/* 拖拽光标样式 */
.sht-cursor-move {
  cursor: move !important;
}
  `;
document.documentElement.appendChild(baseStyle);

// 3. 立即应用主题
(function () {
  let theme = null;
  try {
    if (typeof GM_getValue === "function") {
      theme = GM_getValue("sehuatang_theme", "light");
    } else {
      theme = localStorage.getItem("sehuatang_theme") || "light";
    }
  } catch (e) {
    // 主题读取错误，使用默认主题
  }

  // 应用主题 - 只保留亮色和暗色两个主题
  if (theme === "dark") {
    document.documentElement.classList.add("theme-dark");
    document.documentElement.classList.remove("theme-light");
  } else {
    document.documentElement.classList.add("theme-light");
    document.documentElement.classList.remove("theme-dark");
  }
})();

// 背景层管理系统
(function () {
  "use strict";
  // 定义 ready 函数
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // 待页面结构开始形成时，添加背景层
  const addBackgroundLayer = () => {
    // 如果在 iframe 中运行，则不添加背景层
    if (window.self !== window.top) {
      // Inside iframe, skipping background layer
      return false;
    }
    if (document.body) {
      if (!document.querySelector(".gradient-background")) {
        const gradientDiv = document.createElement("div");
        gradientDiv.className = "gradient-background";
        document.body.appendChild(gradientDiv);
      }
      return true;
    }
    return false;
  };

  // 尝试添加背景层，如果DOM还未准备好，则设置观察器
  if (!addBackgroundLayer()) {
    const bodyObserver = new MutationObserver(() => {
      if (addBackgroundLayer()) {
        bodyObserver.disconnect();
      }
    });
    bodyObserver.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
// #endregion

// #region 导航栏功能
// 移动搜索栏到导航栏
function moveSearchBarToNavigation() {
  // 检查是否已经处理过
  if (document.querySelector("#nv #scbar")) {
    return;
  }

  const scbar = document.getElementById("scbar");
  const navUl = document.querySelector("#nv ul");

  if (!scbar || !navUl) return;

  const scbarTxt = document.getElementById("scbar_txt");

  // 1. 添加 no-transition 类以禁用动画
  if (scbarTxt) {
    scbarTxt.classList.add("no-transition");
  }

  // 创建搜索栏容器
  const searchContainer = document.createElement("li");
  searchContainer.id = "mn_search_bar";

  // 移动搜索栏到容器中
  searchContainer.appendChild(scbar);

  // 插入到导航栏末尾
  navUl.appendChild(searchContainer);

  // 2. 移动完成后，添加moved-to-nav类显示搜索栏
  scbar.classList.add("moved-to-nav");

  // 3. 延迟移除 no-transition 类，恢复动画效果
  setTimeout(() => {
    if (scbarTxt) {
      scbarTxt.classList.remove("no-transition");
    }
  }, 50); // 减少延迟时间，加快显示
}

// 通用按钮查找函数
function findPostReplyButtons() {
  let postButton = null;
  let replyButton = null;

  // 1. 首先尝试从.pgs.mtm.mbm.cl元素中查找按钮（帖子内页）
  const pgsElement = document.querySelector(".pgs.mtm.mbm.cl");
  if (pgsElement) {
    postButton = pgsElement.querySelector("#newspecialtmp, #newspecial");
    replyButton = pgsElement.querySelector("#post_replytmp, #post_reply");
  }

  // 2. 如果没找到，在整个页面中查找
  if (!postButton) {
    postButton = document.querySelector('#newspecialtmp, #newspecial, a[href*="action=newthread"], a[href*="mod=post&action=newthread"]');
  }
  if (!replyButton) {
    replyButton = document.querySelector('#post_replytmp, #post_reply, a[href*="action=reply"], a[href*="mod=post&action=reply"]');
  }

  // 3. 如果还是没找到发帖按钮，尝试根据当前页面URL创建
  if (!postButton) {
    const currentUrl = window.location.href;
    const forumMatch = currentUrl.match(/forum-(\d+)-/) || currentUrl.match(/fid=(\d+)/);

    if (forumMatch) {
      const forumId = forumMatch[1];
      postButton = document.createElement("a");
      postButton.href = `forum.php?mod=post&action=newthread&fid=${forumId}`;
      postButton.textContent = "发帖";
      postButton.id = "custom_newthread";
    }
  }

  // 4. 如果在帖子页面但没找到回复按钮，尝试创建
  if (!replyButton) {
    const threadMatch = window.location.href.match(/thread-(\d+)-/) || window.location.href.match(/tid=(\d+)/);
    if (threadMatch) {
      const threadId = threadMatch[1];
      replyButton = document.createElement("a");
      replyButton.href = `forum.php?mod=post&action=reply&tid=${threadId}`;
      replyButton.textContent = "回复";
      replyButton.id = "custom_reply";
    }
  }

  return { postButton, replyButton };
}

// 分离发帖和回复按钮函数 - 移动到导航栏
function separatePostReplyButtons() {
  // 检查是否已经创建过按钮
  if (document.getElementById("mn_post_reply_buttons")) {
    return; // 已存在，避免重复创建
  }

  // 检查登录状态 - 只有登录后才创建此元素
  const userLink = document.querySelector(".vwmy a");
  if (!userLink) {
    return; // 用户未登录，不创建按钮
  }

  // 查找导航栏的ul元素
  const navUl = document.querySelector("#nv ul");
  if (!navUl) return;

  // 使用通用函数查找按钮
  const { postButton, replyButton } = findPostReplyButtons();

  if (!postButton && !replyButton) return;

  // 将按钮插入到mn_Neaf3后面，主题容器前面
  const mnNeaf3 = document.getElementById("mn_Neaf3");
  let insertTarget = null;

  if (mnNeaf3) {
    // 插入到mn_Neaf3后面
    insertTarget = mnNeaf3.nextSibling;
  } else {
    // 如果mn_Neaf3不存在，插入到ul的末尾
    insertTarget = null;
  }

  // 创建按钮容器li元素
  const buttonLi = document.createElement("li");
  buttonLi.className = "post-reply-buttons-container";
  buttonLi.id = "mn_post_reply_buttons";

  // 移动按钮到新容器，并转换为链接样式
  if (postButton) {
    const postLink = document.createElement("a");
    postLink.href = postButton.href || "javascript:void(0)";
    postLink.textContent = "发帖";
    postLink.onclick = postButton.onclick;
    buttonLi.appendChild(postLink);
  }
  if (replyButton) {
    const replyLink = document.createElement("a");
    replyLink.href = replyButton.href || "javascript:void(0)";
    replyLink.textContent = "回复";
    replyLink.onclick = replyButton.onclick;
    buttonLi.appendChild(replyLink);
  }

  // 插入到导航栏
  if (insertTarget) {
    navUl.insertBefore(buttonLi, insertTarget);
  } else {
    navUl.appendChild(buttonLi);
  }

  // 存储按钮容器引用
  window.postReplyButtonsContainer = buttonLi;
}

// 移动分页元素
function movePaginationElements() {
  const wp = document.getElementById("wp");
  if (!wp) return;

  document.querySelectorAll(".bm.bw0.pgs.cl, .pgs.mtm.mbm.cl").forEach((el) => {
    if (!el.hasAttribute("data-moved")) {
      wp.appendChild(el);
      el.setAttribute("data-moved", "1");
    }
  });
}

// 页面加载完成后初始化导航栏功能
document.addEventListener("DOMContentLoaded", function () {
  // 立即尝试移动搜索栏，减少延迟
  moveSearchBarToNavigation();

  // 延迟执行其他功能以确保所有元素都已加载
  setTimeout(() => {
    // 再次尝试移动搜索栏（防止第一次失败）
    moveSearchBarToNavigation();

    // 分离发帖和回复按钮到导航栏
    separatePostReplyButtons();

    // 移动分页元素
    movePaginationElements();
  }, 100); // 大幅减少延迟时间
});

// 如果页面已经加载完成，立即执行
if (document.readyState === "loading") {
  // 页面还在加载中，等待DOMContentLoaded事件
} else {
  // 页面已经加载完成，立即执行
  // 立即尝试移动搜索栏
  moveSearchBarToNavigation();

  setTimeout(() => {
    // 再次尝试移动搜索栏（防止第一次失败）
    moveSearchBarToNavigation();

    // 分离发帖和回复按钮到导航栏
    separatePostReplyButtons();

    // 移动分页元素
    movePaginationElements();
  }, 50); // 大幅减少延迟时间
}

// 添加 MutationObserver 来监听动态加载的内容
const layoutObserver = new MutationObserver((mutations) => {
  let shouldCheck = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && (node.querySelector?.(".bm.bw0.pgs.cl, .pgs.mtm.mbm.cl") || node.id === "wp" || node.classList?.contains("pgs"))) {
          shouldCheck = true;
        }
      });
    }
  });

  if (shouldCheck) {
    // 立即尝试移动搜索栏
    moveSearchBarToNavigation();

    setTimeout(() => {
      // 再次尝试移动搜索栏（防止第一次失败）
      moveSearchBarToNavigation();

      // 分离发帖和回复按钮到导航栏
      separatePostReplyButtons();

      // 移动分页元素
      movePaginationElements();
    }, 50); // 减少延迟时间
  }
});

// 开始观察 - 确保 document.body 存在
function startLayoutObserver() {
  if (document.body) {
    layoutObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  } else {
    // 如果 body 还不存在，等待 DOM 加载完成
    document.addEventListener("DOMContentLoaded", () => {
      if (document.body) {
        layoutObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
      }
    });
  }
}

// 启动观察器
startLayoutObserver();
// #endregion

// 默认头像 base64 数据
const DEFAULT_AVATAR_BASE64 =
  "data:image/gif;base64,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";

// #region css美化部分
(function () {
  "use strict";
  const STYLE_ID = "sehuatang-enhanced-styles";

  const customStyles = `
* {
  font-family: -apple-system, "PingFang SC", "Microsoft YaHei", Arial, sans-serif !important;
  text-decoration: none !important;
  font-weight: 500 !important;
}

body > * {
  border-radius: 0;
}

:root {
  --primary-color: rgba(0, 0, 0, 0.3);
  --Second-color: rgba(94, 96, 104, 0.05);
  --font-color: rgba(0, 0, 0, 0.8);
  --background: radial-gradient(at 30% 20%, rgba(200, 180, 177, 0.7) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(205, 160, 158, 0.6) 0px, transparent 50%), radial-gradient(at 10% 80%, rgba(130, 126, 160, 0.6) 0px, transparent 50%), radial-gradient(at 70% 70%, rgba(110, 140, 160, 0.7) 0px, transparent 50%);

  --avatar-border-1: rgba(0, 0, 0, 0.3);

  --backdrop-filter-1: blur(10px) saturate(120%);
  --backdrop-filter-3: blur(30px) saturate(140%);
  --backdrop-filter-5: blur(50px) saturate(160%);

  --button-background-1: rgba(0, 0, 0);

  --card-background-1: rgba(255, 255, 255, 0.5);
  --card-background-2: rgba(255, 255, 255, 0.7);
  --card-border-1: rgba(255, 255, 255, 0.3);
  --card-border-2: rgba(255, 255, 255);

  --code-background-1: rgba(255, 244, 222);
  --code-border-1: rgba(255, 230, 180);
  --code-background-2: rgba(0, 0, 0, 0.05);
  --code-font: rgba(151, 105, 77, 1);

  --edtbar: rgba(0, 0, 0, 0.05);

  --font-color-1: rgba(0, 0, 0, 0.8);
  --font-color-2: rgba(0, 0, 0, 0.5);
  --font-color-3: rgba(0, 0, 0, 0.2);
  --font-color-4: rgba(0, 0, 0, 0.1);

  --img-border-1: rgba(0, 0, 0, 0.1);

  --input-background-1: rgba(255, 255, 255, 0.7);
  --input-background-2: rgba(0, 0, 0, 0.1);
  --input-background-3: rgba(0, 0, 0, 0.05);
  --input-border-1: rgba(255, 255, 255, 0.5);
  --input-border-2: rgba(255, 255, 255, 0);
  --input-border-3: rgba(0, 0, 0, 0.1);

  --panel-background-1: rgba(255, 255, 255, 0.7);
  --panel-background-2: rgba(0, 0, 0, 0.05);
  --panel-border-1: rgba(255, 255, 255, 0.5);
  --panel-shadow: 0px 1px 50px rgba(0, 0, 0, 0.2);
  --panel-shadow-s: 0px 1px 20px rgba(0, 0, 0, 0.2);

  --radius4: 6px;
  --radius6: 6px;
  --radius8: 8px;
  --radius10: 10px;
  --radius12: 12px;
  --radius14: 14px;
  --radius16: 16px;

  --tag-background-1: rgba(0, 0, 0, 0.2);
  --tag-background-2: rgba(0, 0, 0, 0.3);
  --tag-background-3: rgba(0, 0, 0, 0.2);
  --tag-font-color: rgba(255, 255, 255);

  --tooltip-background: rgba(0, 0, 0, 0.8);
}

/* 暗色模式 */
.theme-dark {
  --primary-color: rgba(0, 0, 0, 0.4);
  --Second-color: rgba(255, 255, 255, 0.05);
  --font-color: rgba(255, 255, 255, 0.8);
  --background: #666;
  --background-overlay: rgba(0, 0, 0, var(--dark-overlay-opacity, 0.5));
  --saturation-level: 150%;

  --avatar-border-1: rgba(255, 255, 255, 0.3);

  --button-background-1: rgba(255, 255, 255, 0.1);

  --card-background-1: rgba(0, 0, 0, 0.5);
  --card-background-2: rgba(0, 0, 0, 0.5);
  --card-border-1: rgba(255, 255, 255, 0);
  --card-border-2: rgba(0, 0, 0, 0);

  --code-background-1: rgba(255, 255, 255, 0.05);
  --code-border-1: rgba(255, 230, 180, 0.1);
  --code-background-2: rgba(255, 255, 255, 0.1);
  --code-font: rgba(151, 105, 77, 0.8);
  --code-hover: rgba(255, 244, 222, 0.4);

  --edtbar: rgba(0, 0, 0, 0.2);

  --filter1: invert(1);
  --filter2: invert(0.85);
  --filter3: invert(0.2);

  --font-color-1: rgba(255, 255, 255, 0.8);
  --font-color-2: rgba(255, 255, 255, 0.5);
  --font-color-3: rgba(255, 255, 255, 0.1);
  --font-color-4: rgba(255, 255, 255, 0.05);

  --img-border-1: rgba(255, 255, 255, 0.3);

  --input-background-1: rgba(255, 255, 255, 0.1);
  --input-background-2: rgba(255, 255, 255, 0.1);
  --input-background-3: rgba(255, 255, 255, 0.1);
  --input-border-1: rgba(255, 255, 255, 0.1);
  --input-border-2: rgba(255, 255, 255, 0);
  --input-border-3: rgba(255, 255, 255, 0.1);

  --panel-background-1: rgba(25, 25, 25, 0.6);
  --panel-background-2: rgba(0, 0, 0, 0.4);
  --panel-border-1: rgba(255, 255, 255, 0);

  --tag-background-1: rgba(0, 0, 0, 0.5);
  --tag-background-2: rgba(255, 255, 255, 0.2);
  --tag-background-3: rgba(255, 255, 255, 0.2);
  --tag-font-color: rgba(255, 255, 255, 0.8);

  --tooltip-background: rgba(255, 255, 255, 0.2);
}

textarea:focus, input:focus {
  outline: none !important;
  caret-color: var(--font-color-1) !important;
}

button {
  cursor: pointer !important;
}

a {
  color: var(--font-color-1);
  text-decoration: none;
}

/* ------------------------------杂项-------------------------------------- */
.livethreadtitle img,
.title-preview-post-content .tattl.attm p,
#nv_search .forum-navigation,
#scrolltop,
#extcreditmenu_menu img,
#g_upmine_menu img,
.bm_h .o,
.pbg2,
#toptb,
.pob.cl,
.hm span img,
.ignore_notice,
.pi strong a sup,
.tb.cl.mbw a,
#f_pst,
#pgt,
.tfm th .rq,
#aimg_gGJyx,
#aimg_QTf3y,
.line,
.wp.mtn,
#wp > div:nth-child(8),
img[src*="static/image/hrline/"][src$=".gif"],
img[src*="static/image/common/pm-ico5.png"],
img[src*="static/image/common/qa.gif"],
img[src*="static/image/common/hot_"][src$=".gif"],
img[src*="static/image/filetype/"][src$=".gif"],
img[src*="static/image/hrline/"][src$=".gif"],
img[src*="static/image/common/close.gif"],
img[src*="static/image/common/forum_new.gif"],
img[src*="static/image/common/forum.gif"],
img[src*="static/image/common/agree.gif"],
img[src*="static/image/common/logo.png"],
img[src*="static/image/common/logo_sc_s.png"],
img[src*="static/image/common/nv_a.png"],
img[src*="static/image/common/pn_reply.png"],
img[src*="static/image/common/pn_post.png"],
img[src*="static/image/feed/thread.gif"],
img[src*="static/image/common/faq.gif"],
img[src*="static/image/feed/discuz.gif"],
img[src*="www.sehuatang.net/template/default/style/t1/bgimg.jpg"],
img[src*="tupian/forum/202502/02/121629ufzw3n4wvvinail2.gif"],
img[src*="tupian/forum/202502/02/122015fxzvv3xec1r9n75v.gif"],
img[src*="cdn.jsdelivr.net/gh/master-of-forums/master-of-forums/public/images/patch.gif"],
[id^="threadlisttableid"] > tbody:nth-child(1) > tr > td.icn > img,
[id^="stickthread"] > tr > td.icn > a > img,
[id^="normalthread_"] > tr > td.icn > a > img,
#scbar_btn_td,
#scbar_hot_td,
#scbar_hot,
#mn_portal,
#mn_Ne7b9,
#ajaxwaitid,
#ak_rate > i > img,
#ak_reportad,
#atarget,
#autopbn,
#diy_chart .frame-1-2-r::after,
#favatar34006704 > p.md_ctrl,
#fj,
#k_favorite > i > img,
#notice_8953983 > dd.ntc_body > div,
#postlist > table.plhin,
#qmenu,
.returnlist,
.replyfast,
#tip,
.ad,
.returnboard,
.notice_pm, .notice_mypost, .notice_interactive, .notice_system, .notice_manage, .notice_app, .alert_btnleft,
.forumrefresh,
.prompt_follower_0,
.prompt_news_0,
.sign,
.span.none,
.tip_4 .tip_horn,
.vwthd div.y,
span.ddpc_borderright,
div > div.card_mn > div.c > p > img,
div.i.y > div.imicn > a > img,
div:nth-child(1) > p:nth-child(2) > a:nth-child(2) > img,
div:nth-child(1) > p:nth-child(2) > a:nth-child(3) > img,
h2 > img {
   display: none !important;
}

html.theme-light body#nv_forum.pg_forumdisplay.page-ready div#append_parent div#fwin_dialog.fwinmask table.fwin tbody tr td.m_c div.c.altw div.alert_right p {
	font-size: 16px !important;
	padding: 0 25px !important;
}

.fastre, .replyadd, .replysubtract {
  background: none !important;
}

.alert_error, .notice, .unfold, .fold, .vwmy, .ct2_a, .ct3_a, #scform_tb .a, #myprompt.new, #nv li, #nv li a:hover, #nv li.hover a, #nv li.hover a:hover {
  background-image: none !important;
}

.hin {
  opacity: 0;
}

#separatorline > tr {
  visibility: hidden;
}

.ttp {
  padding-top: 10px;
  border: none !important;
  background: transparent;
}

.tl tr:hover th, .tl tr:hover td {
  background: transparent;
}

.tl th em, .tl th em a {
  color: #1598f5 !important;
}

.ts {
  background: transparent;
  font-weight: bold !important;
  color: var(--font-color-1);
}

#tbody > tr:nth-child(1) > td.plc {
  border-radius: 0 !important;
}

#ct > div.mn > div.fl.bm > div:nth-child(1) > div.bm_h.cl > h2 > a {
  margin-left: 10px;
  font-size: 14px;
  color: var(--font-color) !important;
}

table tbody tr td dl dt {
  font-size: 13px;
}

.rfm {
  margin: 10px auto;
  border-bottom: none;
}

.tip {
	border: var(--panel-border-1);
	background: var(--panel-background-1);
	backdrop-filter: var(--backdrop-filter-1);
	border-radius: 14px !important;
	box-shadow: var(--panel-shadow-s);
}

/* ----------原始头像-------- */
.pls .avatar {
  margin: 30px 30px 20px 30px;
  text-align: center;
}

.pls .avatar img {
  padding: 0px;
  width: 100px;
  outline: 4px solid var(--avatar-border-1);
  border-radius: 14px;
}

/* --- 防止.pls元素被错误定位的强制样式 --- */
.pls:not([id="post_1"] .pls) {
    position: static !important;
    top: auto !important;
    left: auto !important;
    bottom: auto !important;
    right: auto !important;
    transform: none !important;
}

/* 1楼楼主的.pls元素可以有特殊定位 */
[id="post_1"] .pls {
    /* 允许1楼有特殊定位，不强制覆盖 */
}

/* ---------看帖页背景-------------- */
.showmenu {
  padding-right: 10px;
  white-space: nowrap;
  position: relative;
  background: none;
}

.showmenu::after {
  content: "▼";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 7px;
  color: inherit;
}

.fl_icn a, .fl_icn_g a {
  display: inline-block;
  width: 25px;
  height: 25px;
  margin: 1px 0 0 5px;
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj4KICA8cGF0aCBkPSJNIDEzOCA0Mi4wMDEgQyAxMjkuMTY0IDQyLjAwMSAxMjIgNDkuMTY0IDEyMiA1OC4wMDEgTCAxMjIgMTIyLjAwMSBMIDk4IDEyMi4wMDEgQyA1OC4yNTQgMTIyLjA0NSAyNi4wNDUgMTU0LjI1NCAyNiAxOTQuMDAxIEwgMjYgMzg2LjAwMSBDIDI2LjA0NSA0MjUuNzQ3IDU4LjI1NCA0NTcuOTU5IDk4IDQ1Ny45OTkgTCA0MDIgNDU3Ljk5OSBDIDQ0MS43NDcgNDU3Ljk1OSA0NzMuOTU2IDQyNS43NDcgNDc0IDM4Ni4wMDEgTCA0NzQgMTk0LjAwMSBDIDQ3My45NTYgMTU0LjI1NCA0NDEuNzQ3IDEyMi4wNDUgNDAyIDEyMi4wMDEgTCAyMzkuNzQgMTIyLjAwMSBMIDE0OC4yNSA0NS43MTEgQyAxNDUuMzcxIDQzLjMxNiAxNDEuNzQ1IDQyLjAwNCAxMzggNDIuMDAxIFoiIHN0eWxlPSJ0cmFuc2Zvcm0tb3JpZ2luOiAyNTBweCAyNTBweDsiIHRyYW5zZm9ybT0ibWF0cml4KC0xLCAwLCAwLCAtMSwgLTAuMDAwMDE3LCAtMC4wMDAwMTcpIi8+Cjwvc3ZnPg==");
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
  filter: var(--filter1);
}

/*---- ---- ---- ---- ---- --- ---- ---- ---1.主页---- ---- --- ---- ---- --- ---- ---- ---- -------*/
#ls_fastloginfield_ctrl {
  background: var(--primary-color) !important;
  color: #fff !important;
  vertical-align: middle !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
}

body, ul, ol, li, dl, dd, p, h1, h2, h3, h4, h5, h6, form, fieldset, .pr, .pc {
  margin: 0;
  padding: 0;
  color: var(--font-color-1);
  vertical-align: baseline;
}

.rfm .px {
  width: 200px !important;
}

.fastlg_l {
  padding-right: 4px !important;
  border-right: 0px solid #e5edf2;
}

.fastlg_l, .psw_w {
  color: var(--font-color) !important;
}

.tbmu a {
  color: var(--font-color);
}

.th > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > a:nth-child(5), .th > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > th:nth-child(1) > a:nth-child(7), #threadlist > div.th > table > tbody:nth-child(1) > tr > th > a.a, #threadlist > div.th > table > tbody:nth-child(1) > tr > th > a:nth-child(3) {
  color: var(--font) !important;
}

#thread_types > li:nth-child(13) > a > font, #thread_types > li:nth-child(2) > a > b > font {
  color: #f99d9b;
}

#thread_types > li:nth-child(13) > a > font:hover, #thread_types > li:nth-child(2) > a > b > font:hover {
  color: #f26c4f;
}

/* 头像 */
.avt img {
  width: 48px;
  height: 48px;
  border: 3px solid var(--avatar-border-1);
  padding: 0;
  border-radius: 14px;
  margin: 0px 0px 0px 10px;
  object-fit: cover;
  background: transparent;
}

#uhd > div > div > a > img {
  margin: 0px 16px 0px 0px;
}

div > div.card_mn > div.avt > a > img {
  margin-left: 0px !important;
}

#um, #um a {
  color: var(--font-color);
  border: none;
  font-weight: 500;
  font-size: 13px;
}

#um, #um a:hover {
  background: none !important;
  border: none;
}

#pm_ntc.new {
  background-image: none !important;
  background: transparent !important;
  border-radius: 6px !important;
  padding: 2px 4px;
}

#qmenu, .fl .bm_h h2 a, .fl .bm_h h2 span, #um .new, .topnav .new, .sch .new, .el .ec .hot em, .pll .s a.joins, #diy_backup_tip .xi2 {
  color: var(--font-color);
}

#um .new, .topnav .new, .sch .new, #toptb .new {
  padding-left: 0px !important;
}

.xi1, .onerror {
  color: #f44646 !important;
}

.ignore_notice {
  background: none;
}

#pt .z a, #pt .z em, #pt .z span {
  color: #fff;
  background: var(--tag-background-1);
  border-radius: 10px !important;
  padding: 0px 8px;
  height: 24px;
  line-height: 24px;
}

#pt .z em {
  text-align: center;
  background: none;
  color: #fff;
}

#pt .z {
  color: var(--font);
}

.prompt_news, .prompt_follower, .prompt_news_0, .prompt_follower_0, .prompt_concern {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZGMyNjI2IiBkPSJNNy4yOSA0LjkwOGE1NC40IDU0LjQgMCAwIDEgOS40MiAwbDEuNTExLjEzYTIuODkgMi44OSAwIDAgMSAyLjMxMyAxLjU0NmEuMjM2LjIzNiAwIDAgMS0uMDkxLjMwN2wtNi4yNjYgMy44OGE0LjI1IDQuMjUgMCAwIDEtNC40LjA0NUwzLjQ3IDcuMDg4YS4yMzYuMjM2IDAgMCAxLS4xMDMtLjI5M0EyLjg5IDIuODkgMCAwIDEgNS43OCA1LjAzOXoiLz48cGF0aCBmaWxsPSIjZGMyNjI2IiBkPSJNMy4zNjIgOC43NjdhLjI0OC4yNDggMCAwIDAtLjM3My4xODdhMzAuNCAzMC40IDAgMCAwIC4xODQgNy41NkEyLjg5IDIuODkgMCAwIDAgNS43OCAxOC45NmwxLjUxLjEzMWMzLjEzNS4yNzMgNi4yODcuMjczIDkuNDIyIDBsMS41MS0uMTNhMi44OSAyLjg5IDAgMCAwIDIuNjA2LTIuNDQ5YTMwLjQgMzAuNCAwIDAgMCAuMTYxLTcuNzc5YS4yNDguMjQ4IDAgMCAwLS4zNzctLjE4MmwtNS42NDUgMy40OTRhNS43NSA1Ljc1IDAgMCAxLTUuOTUxLjA2MXoiLz48L3N2Zz4=)
    no-repeat;
  margin: 1px 0 0 0 !important;
}

/* --- ---- pop---- ---- ---  */
#extcreditmenu_menu {
  width: 80px !important;
  color: var(--font-color);
  margin-left: -9px !important;
  padding: 0px 10px 0px 10px;
}

#g_upmine_menu {
  width: 150px !important;
  margin-left: -9px !important;
  padding: 10px;
}

#myprompt_menu {
  width: auto;
  margin-left: -18px !important;
}

.p_pop a:hover, .p_pop a.a, #sctype_menu .sca {
  background: transparent;
  color: #f44646;
}

#myitem_menu {
  margin-left: -20px !important;
}

.bbda {
  border-bottom: none;
  margin-top: 6px;
}

/* 积分 */
#extcreditmenu_menu li {
  float: none;
  display: block;
  padding-left: 10px !important;
  line-height: 2;
}

#extcreditmenu, #g_upmine {
  margin-right: 1px !important;
  padding-top: 3px;
  padding-bottom: 3px;
  /* padding-left: 10px; */
}

#extcreditmenu.a, #g_upmine.a {
  position: relative;
  z-index: 302;
  border: none !important;
  border-bottom: none !important;
  background: transparent !important;
}

/* 通用弹窗动画 - 使用与.p_pop.bui相同的动画效果 */
[id^="fwin_"], .popup, .dialog, .modal, .tip, .menu_popup, [id$="_menu"], .tooltip, .dropdown, .popupmenu, .popupmenu_popup, #extcreditmenu_menu, #g_upmine_menu, #myprompt_menu, #myitem_menu, #sctype_menu, .fwinmask, #e_image_menu, #e_attach_menu {
  transition: opacity 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease !important;
  animation: fadeInUp 0.1s ease forwards !important;
  z-index: 1000 !important;
}

/* organizeModal特殊处理 - 使用居中动画避免定位冲突 */
#customModal, #organizeModal {
  transition: opacity 0.1s ease !important;
  animation: fadeInCentered 0.1s ease forwards !important;
}

/* pop弹窗 - 统一使用.p_pop.bui的动画效果 */
.p_pop, .p_pof, .sllt {
  background: var(--card-background-1) !important;
  backdrop-filter: var(--backdrop-filter-1) !important;
  border: none !important;
  box-shadow: var(--panel-shadow-s) !important;
  border-radius: 10px;
  transition: opacity 0.1s ease, transform 0.1s ease, box-shadow 0.1s ease !important;
  animation: fadeInUp 0.1s ease forwards !important;
}

/* 非bui类型的弹窗保持原有显示方式但添加动画 */
.p_pop:not(.bui), .p_pof:not(.bui), .sllt:not(.bui) {
  opacity: 1;
  transform: none;
  pointer-events: auto;
  padding: 5px !important;
  border-radius: var(--radius12) !important;
}

.p_pop a {
  border: none !important;
  text-align: center !important;
  white-space: nowrap;
  color: var(--font-color);
  border-radius: var(--radius8) !important;
}

/* --- ---- ---- ---- --- */
.pipe {
  color: transparent !important;
}

#nv {
  overflow: hidden;
  margin: 15px 0;
  position: static !important;
  background: var(--panel-background-1) !important;
  display: flex;
  align-items: center;
  border: 1px solid var(--panel-border-1) !important;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05) !important;
  border-radius: var(--radius16) !important;
  height: 50px;
  backdrop-filter: var(--backdrop-filter-1) !important;
}

#nv li.a {
  margin-left: -1px !important;
  background: none !important;
}

#nv li.a a, #nv li a {
  color: var(--font-color);
}

#nv li a {
  height: 33px;
  line-height: 33px;
}

/* 搜索栏*/
#scbar {
  background: none !important;
  border: none !important;
}

#scbar_type {
  width: 50px;
  color: var(--font-color) !important;
  text-align: center;
  font-size: 13px;
}

#scbar_btn {
  position: relative;
  background: var(--primary-color) !important;
  margin-top: -3px;
}

#scbar_btn::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xMi41OTMgMjMuMjU4bC0uMDExLjAwMmwtLjA3MS4wMzVsLS4wMi4wMDRsLS4wMTQtLjAwNGwtLjA3MS0uMDM1cS0uMDE2LS4wMDUtLjAyNC4wMDVsLS4wMDQuMDFsLS4wMTcuNDI4bC4wMDUuMDJsLjAxLjAxM2wuMTA0LjA3NGwuMDE1LjAwNGwuMDEyLS4wMDRsLjEwNC0uMDc0bC4wMTItLjAxNmwuMDA0LS4wMTdsLS4wMTctLjQyN3EtLjAwNC0uMDE2LS4wMTctLjAxOG0uMjY1LS4xMTNsLS4wMTMuMDAybC0uMTg1LjA5M2wtLjAxLjAxbC0uMDAzLjAxMWwuMDE4LjQzbC4wMDUuMDEybC4wMDguMDA3bC4yMDEuMDkzcS4wMTkuMDA1LjAyOS0uMDA4bC4wMDQtLjAxNGwtLjAzNC0uNjE0cS0uMDA1LS4wMTgtLjAyLS4wMjJtLS43MTUuMDAyYS4wMi4wMiAwIDAgMC0uMDI3LjAwNmwtLjAwNi4wMTRsLS4wMzQuNjE0cS4wMDEuMDE4LjAxNy4wMjRsLjAxNS0uMDAybC4yMDEtLjA5M2wuMDEtLjAwOGwuMDA0LS4wMTFsLjAxNy0uNDNsLS4wMDMtLjAxMmwtLjAxLS4wMXoiLz48cGF0aCBmaWxsPSIjZmZmZmZmIiBkPSJNNSAxMGE1IDUgMCAxIDEgMTAgMGE1IDUgMCAwIDEtMTAgMG01LTdhNyA3IDAgMSAwIDQuMTkyIDEyLjYwNmw1LjEgNS4xMDFhMSAxIDAgMCAwIDEuNDE1LTEuNDE0bC01LjEtNS4xQTcgNyAwIDAgMCAxMCAzIi8+PC9nPjwvc3ZnPg==");
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 透明背景*/
.scbar_txt_td, .scbar_type_td {
  background: none !important;
}

.scbar_icon_td, .__web-inspector-hide-shortcut__ {
  display: none !important;
}

/* 输入框*/
#scbar_txt {
  width: 300px;
  height: 28px;
  color: var(--font-color) !important;
  background: var(--input-background-1) !important;
  font-weight: 500;
  padding-left: 10px;
  border: 1px solid var(--input-border-1);
  border-radius: var(--radius12) !important;
  font-size: 12px;
}

input::placeholder {
  color: var(--font-color-4);
}

/* 搜索按钮*/
.scbar_btn_td {
  background: none !important;
}

#scbar_type_menu {
  margin-left: -7px;
  margin-top: 0px !important;
}

#pt {
  margin: 20px 0 10px;
  height: 29px;
  border: none;
  background: transparent;
  line-height: 29px;
}

/* ————————今日———————————*/
.chart {
  padding-left: 0px;
  background: none !important;
  color: var(--font-color-1) !important;
}

#chart {
  margin-bottom: 5px;
  padding: 15px 20px;
  border-radius: var(--radius12) !important;
  background: var(--card-background-2) !important;
  border: 1px solid var(--card-border-2) !important;
}

.chart em {
  color: var(--font-color-1);
}

#ancl > li, .cl > .z.xw1:first-child {
  display: none !important;
}

/*整体宽松*/
.temp {
  margin: 1px;
  padding: 5px;
}

/* ————————热门主题————————*/
#ct .frame {
  margin: 0;
  margin-bottom: 10px;
  background: none;
}

/* 标签*/
.tb a {
  display: block;
  padding: 0 20px;
  border: none !important;
  background: transparent;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  font-size: 13px;
  color: var(--font-color-1) !important;
}

#diy_chart .tb .a a {
  color: red !important;
}

.index-top-frame .frame-title, .index-top-frame .frametitle, .index-top-frame .tab-title {
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.1) !important;
  background: transparent;
}

.index-top-frame .tab-title {
  border-bottom: 0px solid var(--Second-color);
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0) !important;
}

.index-top-frame .frame-tab {
  margin-bottom: 0;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.03) !important;
  border-radius: var(--radius16) !important;
  overflow: hidden;
  background: var(--card-background-2) !important;
  border: 1px solid var(--card-border-2) !important;
  border: none;
  height: 275px;
}

.index-top-frame .frame-tab .tb-c {
  padding: 0 20px 2px;
}

#diy_chart .tb {
  padding-left: 0;
  padding-top: 5px;
}

.__web-inspector-hide-shortcut__ {
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.2) !important;
}

#ft {
  padding: 30px 0 0;
  border-top: none;
  color: var(--font-color);
}

#frt strong a, #flk a {
  color: var(--font-color-1);
}

tr > th > span {
  color: var(--font-color-1) !important;
}

.card_gender_1 {
  background: none;
}

#delform > table > tbody > tr.th {
  border-radius: 0 !important;
  background: transparent;
}

.fl .bm_c, #online .bm_c, .lk .bm_c {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.bm_c {
  padding: 20px;
}

.fl_row td {
  border-top: none !important;
}

div#diy_chart {
  width: 918px !important;
}

.frame-2-1-l, .frame-1-2-r {
  width: 65% !important;
}

dt a {
  font-weight: 600 !important;
  font-size: 13px;
  color: var(--font-color);
}

dd em, dd a, dl dd {
  color: var(--font-color-2);
}

.fl_g dl dd a, .fl_g dl dd em {
  color: var(--font-color-2) !important;
}

.lit {
  color: var(--font-color-1) !important;
}

#category_1 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > dl:nth-child(2) > dt:nth-child(1) > a:nth-child(1), #category_94 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > dl:nth-child(2) > dt:nth-child(1) > a:nth-child(1), #category_94 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > dl:nth-child(2) > dt:nth-child(1) > a:nth-child(1), #category_94 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3) > dl:nth-child(2) > dt:nth-child(1) > a:nth-child(1), #category_47 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > dl:nth-child(2) > dt:nth-child(1) > a:nth-child(1), html.theme-green body.page-ready#nv_forum.pg_index div#wp.wp div#ct.wp.cl div.mn div.fl.bm div.bm.bmw.flg.cl div#category_1.bm_c table.fl_tb tbody tr.fl_row td.fl_g dl dt a {
  color: var(--font-color) !important;
}

.xw0 {
  font-weight: 500 !important;
  font-size: 12px;
}

.slideshow {
  border-radius: var(--radius16) !important;
  overflow: hidden;
}

#diy_chart .slideshow li a img {
  object-fit: contain;
  background: #000;
}

.slidebar {
  top: 10px !important;
  transform: scale(0.9);
}

td h2 a {
  font-weight: 600 !important;
  font-size: 13px;
  color: var(--font-color);
}

.fl_tb tr td p span a, .fl_tb tr td p {
  color: var(--font-color-2) !important;
}

/*---- ---- ---- ---- ---- --- ---- ---- ---2.分区---- ---- --- ---- ---- --- ---- ---- ---- -------*/
.wp {
  border-radius: var(--radius16) !important;
}

/*子版块*/
#livethread {
  background: var(--card-background-2) !important;
  border: 1px solid var(--card-border-2) !important;
}

#livereplycontentout {
  border: none !important;
  background: rgba(0, 0, 0, 0.05) !important;
  padding: 5px;
  border-radius: 16px !important;
}

#livereplycontent dl {
  border: none !important;
}

#livereplycontent {
  padding: 0 15px;
  width: 835px !important;
}

#livefastcomment {
  line-height: 20px;
  height: 20px !important;
  border: none;
  background: transparent;
}

.livethreadtitle a {
  color: red !important;
}

.livethreadtitle .replynumber .xi1 {
  background: none !important;
}

.fl .bm {
  margin: 20px 0;
  overflow: hidden;
  background: var(--card-background-2) !important;
  border: 1px solid var(--card-border-2) !important;
  border-radius: var(--radius16) !important;
}

.fl .bm_h {
  border: none !important;
  background: none !important;
  background: var(--Second-color) !important;
  padding: 5px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

#ct > div > div.bm.bmw.fl > div.bm_h.cl > h2 {
  margin-left: 10px;
  color: var(--font-color) !important;
  font-size: 13px !important;
}

.fl {
  border: 0px solid #cdcdcd !important;
  border-top: none !important;
  background: none !important;
}

.bm_h .i {
  padding-left: 10px;
  color: var(--font-color-1) !important;
}

#thread_types > li:nth-child(14) > a > font, #thread_types > li:nth-child(3) > a > b > font {
  color: #f99d9b !important;
}

#um .showmenu {
  margin-right: 0;
  margin-right: 0;
}

/* 原创 BT 电影*/
.fl .bm_h h2 span {
  color: var(--font-color) !important;
  padding: 10px;
  font-weight: 700;
  font-size: 14px !important;
}

/* 屏蔽分区版主*/
.bmw .bm_h .y {
  display: none;
}

/* 虚线*/
.fl_row td {
  border-top: 1px dashed #f2f2f2;
}

/* 间距*/
.fl_tb td {
  padding: 20px 0;
}

/*  列表高度 */
.tl th, .tl td {
  padding: 10px 5px 10px 5px;
  border-bottom: 0px solid #c2d5e3 !important;
}

.tl .by {
  width: 95px;
  line-height: 1.2;
  text-align: center;
}

.tl .num {
  width: 59px;
  line-height: 14px;
  text-align: center;
}

.tl .icn {
  width: 25px;
  padding: 10px 0px !important;
}

.xst {
  font-size: 14px;
  text-align: center !important;
  color: var(--font-color-1) !important;
}

.tf a.xi2, .showmenu.xi2, .tl .th td, .tl .th th {
  color: #fff !important;
  font-size: 13px !important;
}

.cttp .unfold, .cttp .fold {
  color: var(--font-color-2);
}

.ntc_l.hm.xi2 {
  border-radius: var(--radius8) !important;
  background: #ffe9bf !important;
  border: 1px solid var(--Second-color);
}

#ct > div > div.bm.bml.pbn > div.bm_h.cl > h1 > a {
  color: var(--font-color-1);
}

.bm.bw0.pgs.cl {
  margin: 0 auto;
}

#number_favorite {
  color: var(--font-color) !important;
}

.fa_fav {
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyOCAxMjgiPjxwYXRoIGZpbGw9IiNmY2MyMWIiIGQ9Im04MS40OSA3NS4zbDYuOTEgMjguMTVMNjQgODhsLTI0LjM5IDE1LjQ1bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuM0w2NCAyOC4zNmwxMC44MSAyNi4zOGwyOC42NiAyLjN6Ii8+PHBhdGggZmlsbD0iI2Y3OTMyOSIgZD0iTTEyNy4xOSA0OS41MmEzLjI3IDMuMjcgMCAwIDAtMi44NC0yLjI3bC00MS42NC0zLjMyTDY3LjAzIDUuNjJBMy4yNyAzLjI3IDAgMCAwIDY0IDMuNmMtMS4zMiAwLTIuNTEuNzktMy4wMiAyLjAyTDQ1LjMgNDMuOTNMMy42NSA0Ny4yNUEzLjI5IDMuMjkgMCAwIDAgLjggNDkuNTJjLS4zOCAxLjI3LjAxIDIuNjUgMS4wMyAzLjVsMzEuOSAyNi40OWwtMTAuMDMgNDAuODVjLS4zMiAxLjI5LjE4IDIuNjUgMS4yNiAzLjQyYy41Ny40MiAxLjIzLjYyIDEuOS42MmMuNjEgMCAxLjIyLS4xNyAxLjc1LS41TDY0IDEwMS41bDM1LjM5IDIyLjM5YzEuMTMuNzIgMi41Ny42NyAzLjY1LS4xMWEzLjI0NSAzLjI0NSAwIDAgMCAxLjI2LTMuNDJMOTQuMjcgNzkuNTFsMzEuOS0yNi41YTMuMjMgMy4yMyAwIDAgMCAxLjAyLTMuNDlNODEuNDkgNzUuM2w2LjkyIDI4LjE1TDY0IDg4bC0yNC40IDE1LjQ0bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuMjlMNjQgMjguMzZsMTAuODEgMjYuMzhsMjguNjYgMi4yOXoiLz48L3N2Zz4=);
}

/*---- ---- ---- ---- ---- --- ---- ---- ---3.内页---- ---- --- ---- ---- --- ---- ---- ---- -------*/
/* 两边不遮住主体阴影 */
.mn {
  overflow: visible;
}

/* 主体阴影 */
.bmw {
  background: var(--card-background-2) !important;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.03) !important;
  border: 1px solid var(--card-border-2) !important;
  border-radius: var(--radius16);
}

.boardnav .bmw {
  padding: 2px 0;
}

#nv_forum #ct {
  background: var(--card-background-1) !important;
  padding: 20px;
  border: 1px solid var(--card-border-1) !important;
  margin: 10px 0;
  border-radius: var(--radius16) !important;
}

/* 综合讨论区 */
.bm.bml.pbn {
  padding: 10px !important;
  background: var(--card-background-2) !important;
  box-shadow: none !important;
  border: 1px solid var(--card-border-2) !important;
  border-radius: var(--radius16) !important;
}

.bm.bml.pbn * {
  font-size: 13px !important;
  color: var(--font-color-1);
}

#ct > div > div.bm.bml.pbn > div.bm_c.cl.pbn > div, #ct > div > div.bm.bml.pbn > div.bm_h.cl > h1 {
  text-align: left !important;
}

.ico_increase {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjE4IgogICBoZWlnaHQ9IjE4IgogICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHNvZGlwb2RpOmRvY25hbWU9IkJ4c1Vwdm90ZS5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuNCAoZTdjM2ZlYjEsIDIwMjQtMTAtMDkpIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOnpvb209IjU2LjA1NTU1NiIKICAgICBpbmtzY2FwZTpjeD0iOSIKICAgICBpbmtzY2FwZTpjeT0iOSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEyMDAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTE4OCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMjg2OSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iODgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcxIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iI2UxMWQ0OCIKICAgICBkPSJNNCAxNGg0djdhMSAxIDAgMCAwIDEgMWg2YTEgMSAwIDAgMCAxLTF2LTdoNGExLjAwMSAxLjAwMSAwIDAgMCAuNzgxLTEuNjI1bC04LTEwYy0uMzgxLS40NzUtMS4xODEtLjQ3NS0xLjU2MiAwbC04IDEwQTEuMDAxIDEuMDAxIDAgMCAwIDQgMTQiCiAgICAgaWQ9InBhdGgxIgogICAgIHN0eWxlPSJmaWxsOiNmZTAwMzg7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=)
    no-repeat center center;
  background-size: 14px;
  background-position: 0px 0px !important;
}

.ico_fall {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjE4IgogICBoZWlnaHQ9IjE4IgogICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzEiCiAgIHNvZGlwb2RpOmRvY25hbWU9IkJ4c0Rvd252b3RlLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iNTYuMDU1NTU2IgogICAgIGlua3NjYXBlOmN4PSI5IgogICAgIGlua3NjYXBlOmN5PSI5IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTIwMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTg4IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIzMDkzIgogICAgIGlua3NjYXBlOndpbmRvdy15PSI4MiIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEiIC8+CiAgPHBhdGgKICAgICBmaWxsPSIjZTExZDQ4IgogICAgIGQ9Ik0yMC45MDEgMTAuNTY2QTEgMSAwIDAgMCAyMCAxMGgtNFYzYTEgMSAwIDAgMC0xLTFIOWExIDEgMCAwIDAtMSAxdjdINGExLjAwMSAxLjAwMSAwIDAgMC0uNzgxIDEuNjI1bDggMTBhMSAxIDAgMCAwIDEuNTYyIDBsOC0xMGMuMjQtLjMwMS4yODYtLjcxMi4xMi0xLjA1OSIKICAgICBpZD0icGF0aDEiCiAgICAgc3R5bGU9ImZpbGw6I2ZlMDAzOTtmaWxsLW9wYWNpdHk6MSIgLz4KPC9zdmc+Cg==)
    no-repeat center center;
  background-size: 14px;
  background-position: 0px 0px !important;
}

.ptm {
  border-bottom-right-radius: var(--radius16) !important;
  border-top-right-radius: var(--radius16) !important;
  padding-top: 10px !important;
}

#tath img {
  border-radius: var(--radius8) !important;
  border: 2px solid var(--font-color-2) !important;
}

/* 发帖和回复按钮导航栏样式 */
#mn_post_reply_buttons {
  display: inline-block !important;
}

#mn_post_reply_buttons a {
  color: var(--font-color) !important;
  font-size: 14px !important;
  text-decoration: none !important;
  cursor: pointer !important;
}

/* 导航栏垂直居中样式 */
#nv ul {
  display: flex !important;
  align-items: center !important;
  height: auto !important;
  width: 100% !important;
  justify-content: flex-start !important;
}

#nv ul li {
  display: flex !important;
  align-items: center !important;
}

#nv a:hover {
  color: red !important;
}

/* 确保隐藏的导航元素保持隐藏状态 - 使用更高优先级 */
#nv #mn_portal, #nv #mn_Ne7b9 {
  display: none !important;
}

/* 主题切换容器样式 */
#theme-switch-container-sehuatang {
  display: flex;
  align-items: center;
}

/* 当#nv不存在时隐藏主题切换按钮 */
body:not(:has(#nv)) #theme-switch-container-sehuatang {
  display: none;
}

/* 搜索栏在导航栏中的样式 */
#mn_search_bar {
  margin-left: auto !important;
  padding-right: 15px !important;
}

/* 页数 */
.pg a.prev {
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0zMjEuOTQgOThMMTU4LjgyIDIzNy43OGEyNCAyNCAwIDAgMCAwIDM2LjQ0TDMyMS45NCA0MTRjMTUuNTcgMTMuMzQgMzkuNjIgMi4yOCAzOS42Mi0xOC4yMnYtMjc5LjZjMC0yMC41LTI0LjA1LTMxLjU2LTM5LjYyLTE4LjE4Ii8+PC9zdmc+);
	background-size: 16px !important;
	padding-right: 25px;
}

.pg a.nxt {
	background-position: 50% 50%;
	background-repeat: no-repeat;
	background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0zMjEuOTQgOThMMTU4LjgyIDIzNy43OGEyNCAyNCAwIDAgMCAwIDM2LjQ0TDMyMS45NCA0MTRjMTUuNTcgMTMuMzQgMzkuNjIgMi4yOCAzOS42Mi0xOC4yMnYtMjc5LjZjMC0yMC41LTI0LjA1LTMxLjU2LTM5LjYyLTE4LjE4Ii8+PC9zdmc+);
	background-size: 16px !important;
	padding-right: 25px;
  transform: scaleX(-1);
}

.pg a, .pg strong, .pgb a, .pg label {
  background: var(--tag-background-1);
  border-radius: 8px !important;
  border: none;
  color: var(--tag-font-color);
}

.pg strong {
  background: #f44646;
  color: #fff !important;
}

.pgb a {
  padding-left: 10px;
  border-radius: var(--radius8) !important;
  color: var(--tag-font-color);
  background: var(--tag-background-1);
}

.pg label .px {
  width: 30px;
  border: none !important;
  line-height: 16px;
  border-radius: var(--radius8) !important;
  text-align: center;
  background: transparent !important;
  color: var(--tag-font-color);
}

.tfm .pt, .tfm .px {
  background: var(--input-background-1) !important;
}

label {
  color: var(--font-color-1);
}

.pgs.pbm.cl.pm_op input {
  margin: 0 10px;
}

.pcbs table {
  box-shadow: none !important;
  background: none !important;
}

.ttp .a a {
  padding-right: 12px;
  padding-left: 12px;
  color: var(--tag-font-color) !important;
  border: none;
  border-radius: var(--radius10) !important;
  background: #f44646 !important;
}

.ttp .a .num {
  background: transparent;
  color: #fff !important;
}

.ttp a, .ttp strong {
  float: left;
  color: var(--tag-font-color);
  padding: 4px 8px;
  height: 18px;
  background: var(--tag-background-1);
  margin: 0 15px 5px 0;
  border-radius: var(--radius10) !important;
  border: none;
}

.ttp a:hover {
  color: #fff !important;
  border-color: #f44646;
}

.ttp .num {
  background: none;
  padding: 0;
  border-radius: var(--radius8) !important;
  margin-left: 5px;
  opacity: 0.7;
  color: var(--tag-font-color) !important;
}

.tl .th {
  margin: 8px;
  padding: 0 10px;
  border-bottom: 0px solid #b3ab9c;
  background: var(--primary-color);
  border-radius: var(--radius12) !important;
}

#thread_types > li:nth-child(3) > a:nth-child(1) > b:nth-child(1) > font:nth-child(1), #thread_types > li:nth-child(7) > a:nth-child(1) > font:nth-child(1) {
  color: var(--tag-font-color) !important;
}

.tf a.xi2, .showmenu.xi2, .tl .th td, .tl .th th {
  color: #fff !important;
}

/* ------主体------- */
#pgt .pg, #pgt .pgb {
  margin-top: 0px;
}

.tl #forumnewshow a {
  display: block;
  border-top: 0px solid #f4e4b4;
  border-bottom: 0px solid #f4e4b4;
  text-indent: 25px;
  height: 35px;
  line-height: 35px;
  background: #ffe5b8;
  color: #f26c4f;
  justify-content: center;
  margin-top: -10px;
}

.tl #forumnewshow {
  background: #fff;
  font-size: 12px;
  text-align: center;
}

#forumnewshow > tr > td {
  background: none !important;
}

.closeprev {
  display: none !important;
}

.tl th a:visited {
  color: #888;
}

.card_gender_0 {
  background: none;
}

.bui .m img {
  margin-bottom: 0px !important;
  width: 80px;
  outline: 4px solid var(--avatar-border-1);
  border-radius: var(--radius12) !important;
}

.card .o {
  padding: 0px;
  margin: 5px 16px 0px 12px;
}

.card .o a {
  float: left;
  padding: 5px 2px;
  color: #fff;
  border: none;
  background: none;
  background: var(--primary-color) !important;
  text-align: center;
}

/* 头像悬停弹窗中的用户操作按钮样式 */
.p_pop.bui .user-action-buttons {
  display: flex !important;
  gap: 8px;
  margin-top: 10px !important;
  flex-wrap: wrap !important;
}

.p_pop.bui .user-action-btn {
  display: inline-block;
  padding: 4px;
  background: var(--tag-background-2);
  color: #fff !important;
  font-size: 11px;
  cursor: pointer;
  height: 16px;
  width: 50px;
}

/* 现有头像悬停弹窗重新布局 - 恢复原始悬停显示 */
.p_pop.bui {
  padding: 10px !important;
  border-radius: 16px;
  background: var(--card-background-1) !important;
  backdrop-filter: var(--backdrop-filter-1) !important;
  margin: -140px -100px !important;
  width: 310px !important;
  box-shadow: 0 1px 50px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid var(--card-border-1) !important;
  transition: opacity 0.3s ease, transform 0.3s ease !important;
  animation: fadeInUp 0.3s ease forwards;
}

html.widthauto .p_pop.bui {
  margin: 0 150px !important;
}

/* 淡入动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

}

/* 设置界面专用淡入动画 - 保持居中定位 */
@keyframes fadeInCentered {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }

}

.theme-dark .bui {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* 左侧头像区域 */
.bui .avatar-section, .p_pop.bui .avatar-section {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 15px;
  padding: 10px 0;
  float: left;
  width: 90px;
  text-align: center;
}

.bui .avatar-section .m, .p_pop.bui .avatar-section .m, .bui .avatar-section .avatar, .p_pop.bui .avatar-section .avatar {
  margin: 0 !important;
  text-align: center !important;
}

.bui .avatar-section img, .p_pop.bui .avatar-section img {
  width: 64px !important;
  height: auto !important;
}

.info-section.sht-user-info-section {
  margin-left: 100px;
}

.bui .user-basic-info .username, .p_pop.bui .user-basic-info .username {
  font-size: 14px !important;
  color: var(--font-color) !important;
  margin-top: 5px;
}

/* 在线状态用户名橙色字体 */
.bui .user-basic-info .username em.online-status, .p_pop.bui .user-basic-info .username em.online-status {
  color: orange !important;
  opacity: 1 !important;
  font-size: 11px !important;
  padding-left: 10px;
}

.p_pop.bui .user-basic-info .username em {
  font-size: 11px;
  color: var(--font-color-2);
  padding-left: 10px;
}

/* 名字 */
.pls .pi {
  padding: 8px;
  text-align: center;
  color: var(--font-color) !important;
  font-size: 14px !important;
  margin: 5px 0;
}

.avatar {
  width: 100px;
}

.ad .pls {
  background: #369;
  height: 1px;
}

.pi {
  overflow: hidden;
  margin-bottom: 10px;
  padding: 10px 0;
  height: 16px;
  border-bottom: none;
  margin-top: 5px;
}

.ad td.pls {
  background: var(--Second-color) !important;
  border-radius: 0 !important;
}

.pls .tns {
  padding: 10px 10px 0 0;
  line-height: 2;
  margin-left: -10px;
}

.pm_c {
  padding-left: 40px;
  line-height: 22px;
}

.pl .blockcode {
  border: 1px solid var(--code-border-1) !important;
  background: var(--code-background-1) !important;
  color: var(--code-font);
  border-radius: var(--radius12) !important;
}

.pl .blockcode ol li:hover {
  background: var(--code-hover) !important;
  color: red !important;
  border-radius: 4px !important;
  width: 698px;
}

.pl .blockcode em {
	margin-left: 43px;
	color: #fff !important;
	font-size: 11px;
}

.zoom {
  margin: 30px auto !important;
  outline: 6px solid var(--img-border-1);
  border-radius: 14px;
  max-width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  display: block;
}

[id^="attach_"] {
  white-space: normal !important;
}

.zoominner p a {
  border-radius: 0 !important;
}

.zoominner {
  border-radius: 16px !important;
}

#imgzoom_zoom {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
  border-radius: 14px !important;
}

/* 关闭按钮 */
.flbc {
  width: 18px;
  height: 18px;
  background-image: url("data:image/svg+xml;utf8,<svg width='12' height='12' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M18 6L6 18M6 6l12 12' stroke='%23fff' stroke-width='4' stroke-linecap='round'/></svg>");
  background-color: var(--button-background-1);
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50% !important;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

.flbc:hover {
  background-position: center !important;
  background-color: red !important;
}

.t_l, .t_c, .t_r, .m_l, .m_r, .b_l, .b_c, .b_r {
  overflow: hidden;
  background: none;
  opacity: 0.2;
  filter: alpha(opacity=20);
}

.pn, .tb .o, .tb .o a {
  background-image: none;
}

.pn {
  color: #fff !important;
  border-radius: var(--radius8) !important;
  border: none;
  background: rgba(114, 194, 64, 1) !important;
  box-shadow: none !important;
}

.pns .pn {
  height: 25px !important;
  width: auto !important;
}

.pi strong a {
  float: right;
  padding: 2px 8px;
  background: var(--tag-background-2);
  border-radius: 8px !important;
  color: #fff;
  border: none !important;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  opacity: 0.8;
}

.pi strong a:hover {
  border: none;
}

.authi > .pipe, .authicn.vm {
  display: none;
}

.xg1, .xg1 a {
  color: var(--font-color-1) !important;
  font-size: 12px;
}

.pbw p {
  color: var(--font-color) !important;
  margin-bottom: 10px;
}

.ratl th, .ratl td, .ratc {
  padding: 10px 15px;
  border-bottom: none;
  border-radius: 0px !important;
}

.ratl .xw1 .xi1 {
  background: transparent;
}

.m_c .o {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  height: 26px;
  border: none !important;
  background: none;
}

.f_c .list {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0 !important;
}

.t_l, .t_r, .b_l, .b_r {
  display: none !important;
}

.flb em {
  float: left;
  font-size: 14px;
  font-weight: 700;
  color: var(--font-color-1);
}

#pid26441264 > tbody > tr:nth-child(1) > td.plc > div.pct > div > div.t_fsz > div > ignore_js_op:nth-child(4) > dl > dd {
  margin-left: 80px;
  color: var(--font-color);
}

.tattl dd {
  margin-left: 0px;
  color: var(--font-color-1);
  overflow: hidden;
  padding: 0 4px;
}

.tattl dt {
  padding: 0 !important;
  margin-right: 5px;
  width: 48px;
  height: 48px;
  line-height: 48px;
}

.tattl dt img {
  width: 48px;
}

.tattl strong, .tattl a {
  color: #f44646;
  padding: 0 5px;
}

/* 作者 */
.f_c a {
  color: var(--font-color-1);
}

.dd > p {
  width: 100px !important;
  color: #fff !important;
}

.xg2 {
  color: var(--font-color-1);
}

.viewpay {
  padding: 0;
  background: none;
}

.locked {
  border-radius: var(--radius8) !important;
  background-color: rgba(255, 0, 0, 0.05);
  border: 1px dashed rgba(255, 0, 0, 0.5);
  font-size: 12px;
  line-height: 1.5;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMy43MTQyODU3MTQyODU3MTQiIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjZWFiMzA4IiBkPSJNMTQ0IDE0NHY0OGgxNjB2LTQ4YzAtNDQuMi0zNS44LTgwLTgwLTgwcy04MCAzNS44LTgwIDgwbS02NCA0OHYtNDhDODAgNjQuNSAxNDQuNSAwIDIyNCAwczE0NCA2NC41IDE0NCAxNDR2NDhoMTZjMzUuMyAwIDY0IDI4LjcgNjQgNjR2MTkyYzAgMzUuMy0yOC43IDY0LTY0IDY0SDY0Yy0zNS4zIDAtNjQtMjguNy02NC02NFYyNTZjMC0zNS4zIDI4LjctNjQgNjQtNjR6Ii8+PC9zdmc+);
  padding: 5px 5px 5px 25px;
  background-repeat: no-repeat;
  background-position: 8px 6px !important;
}

.locked a, .attach_nopermission a {
  color: red;
  padding: 0 4px;
}

.pcb .vm {
  height: 48px;
  width: 48px;
}

.m_c {
  background: none;
}

.f_c .list th, .f_c .list td {
  padding: 11px 2px;
  height: auto;
  border-bottom: 1px dashed var(--img-border-1);
  width: 100px;
  border-radius: 0 !important;
}

#fwin_viewratings {
  background: var(--panel-background-1) !important;
  border: 1px solid var(--panel-border-1) !important;
  backdrop-filter: var(--backdrop-filter-3) !important;
  border-radius: var(--radius16) !important;
  box-shadow: var(--panel-shadow) !important;
}

.po .y {
  margin: 15px 0 0 5px;
}

#fwin_content_reply {
  background: transparent !important;
  width: 600px;
}

.dpbtn {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMSIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMzMzMzMzIiBkPSJNMTEuNDc1IDE0LjQ3NUw3Ljg1IDEwLjg1cS0uMDc1LS4wNzUtLjExMi0uMTYyVDcuNyAxMC41cTAtLjIuMTM4LS4zNVQ4LjIgMTBoNy42cS4yMjUgMCAuMzYzLjE1dC4xMzcuMzVxMCAuMDUtLjE1LjM1bC0zLjYyNSAzLjYyNXEtLjEyNS4xMjUtLjI1LjE3NVQxMiAxNC43dC0uMjc1LS4wNXQtLjI1LS4xNzUiLz48L3N2Zz4=)
    no-repeat;
  border: none;
  padding: 2px;
  background-position: center center !important;
}

#reasonselect {
  border: none !important;
  border-radius: 12px !important;
  padding: 10px;
}

#moreconf {
  background: transparent !important;
}

.tedt {
  border: 0.5px solid var(--img-border-1);
  border-radius: var(--radius12) !important;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.02);
}

.tedt .bar {
  padding: 0 10px 0 0;
  height: 25px;
  line-height: 25px;
  border-bottom: 0.5px solid var(--img-border-1);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  background: var(--edtbar);
}

.tedt .area {
  padding: 4px;
  zoom: 1;
  background: transparent;
}

.t_f a {
  color: #f26c4f;
}

.tedt .pt:focus, #pmform > div > div.area {
  border-radius: 0 0 6px 6px !important;
}

.z.noise {
  padding-top: 15px;
}

.tedt .pt {
  background: transparent !important;
}

.po {
  border: none !important;
}

.flb span a:hover {
  color: #f26c4f !important;
}

.tns th {
  border-right: 0px solid #ccc;
}

.pls p, .pls .o {
  margin: 20px;
  text-align: center;
}

.pls p em, .pls dt em {
  color: var(--tag-font-color);
  background: var(--primary-color);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  opacity: 0.8;
}

.pls p em a {
  color: var(--tag-font-color);
}

.pls p em a font {
  color: rgba(255, 254, 254, 0.8);
}

.pls dt {
  margin-left: 16px;
  margin-right: 0px;
  width: 55px;
  font-size: 12px;
}

#fastPMButton {
  background: none !important;
  color: #00000045;
  font-size: 11px;
  margin: 0;
  padding: 0;
}

.xi2, .xi2 a {
  color: var(--font-color-1);
}

#v_threads li, #v_forums li {
  padding-left: 20px;
  height: 20px;
  background: none;
  background-position: 0px 0px !important;
}

#visitedforums_menu a {
  white-space: normal !important;
  display: inline-block;
  overflow: hidden;
  height: 2.5em;
}

.pl .blockcode {
  padding: 10px 0 5px 10px;
  border: 1px solid #e5e5e5;
  background: #f7f7f7 url(/static/image/common/codebg.gif) repeat-y 0 0;
  overflow: hidden;
}

.icon_ring {
  background: #fff4dd;
  display: inline-block;
  width: 8px !important;
  height: 8px !important;
  margin-right: 5px;
  border: 2px solid #f26c4f;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

div.i.y > dl > dd > a {
  margin-left: 10px;
}

.ratl img {
  border-radius: 50%;
}

#postimg_param_3, #postimg_param_2, #postimg_param_1, #posturl_param_2, #posturl_param_1, #postcode_param_1, #postquote_param_1 {
  border: 1px solid var(--Second-color);
}

.psth {
  background: none !important;
}

/* ————————————————————搜索————————————————————*/
/* 搜索过于频繁，请10秒后再试*/
.nfl .f_c {
  background: var(--card-background-2);
  border-radius: 20px;
  border: 1px solid var(--card-border-2) !important;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1) !important;
}

.alert_right, .alert_error, .alert_info {
  padding: 0;
  min-height: 40px;
  line-height: 40px;
  font-size: 20px;
  font-weight: 500;
  color: var(--font-color-1);
  text-align: center;
  background: transparent;
}

.alert_error {
  color: red;
}

.pbw {
  padding-bottom: 20px !important;
  background: var(--card-background-2) !important;
  padding: 20px;
  border: 1px solid var(--card-border-1) !important;
  border-radius: var(--radius16) !important;
}

#threadlist .pbw {
  margin: 15px 0 !important;
}

#messagelogin {
  border-top: none;
}

h3.xs3 a {
  color: var(--font-color-1) !important;
  font-weight: 500;
}

.slst {
  width: auto !important;
  max-width: 1000px !important;
}

.slst p span a, .slst p span a:visited {
  color: var(--font-color) !important;
}

.slst p span {
  color: var(--font-color) !important;
}

#scform_tb a {
  margin: 0 15px 0 -15px;
  color: var(--font-color) !important;
}

#scform_tb > span > a:nth-child(2) {
  margin-left: 6px;
  margin-right: 32px;
}

#scform_tb > a:nth-child(3) {
  margin: 0 0 0 -5px;
}

#srchfid > option {
  background: transparent !important;
}

.pg a:hover, .pgb a:hover {
  color: #fff !important;
  background-color: #f44646 !important;
}

/* ———————————————————————————————————————设置—————————————————————————————————————————*/
/* ————————————左————————————————*/
#scform_srchtxt {
  padding: 0 10px;
  outline: none;
  width: 430px;
  font-weight: 500 !important;
  border-radius: var(--radius12) !important;
  background: var(--input-background-1) !important;
  color: var(--font-color) !important;
  border: 0.5px solid var(--input-border-1);
}

.sttl {
  margin: 10px 0;
  padding: 10px;
  border-radius: var(--radius12) !important;
  max-width: 980px !important;
  background: var(--card-background-2) !important;
  border: 1px solid var(--panel-border-1) !important;
}

#ct .mw {
  max-width: 1000px;
}

#scform_submit {
  width: 70px;
  opacity: 1;
  background: var(--primary-color);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  font-size: 15px;
  border-radius: var(--radius12) !important;
  color: var(--tag-font-color) !important;
}

.td_srchtxt, .td_srchbtn, #scform_form {
  background: none !important;
}

#scform {
  margin: 20px auto !important;
}

#scform_form {
  background: none !important;
  empty-cells: show;
  border-collapse: separate;
  padding-right: 20px;
  border-spacing: 10px 0;
  margin-left: -30px;
}

.xs0 {
  font-size: 12px;
  line-height: 1.8;
  padding: 5px;
}

.tb {
  margin-top: 10px;
  padding-left: 5px;
  line-height: 30px;
  border-bottom: 1px solid var(--sider-color);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.tb a:hover {
  background: transparent !important;
  color: red;
}

.tb .o, .tb .o a {
  height: 23px;
  line-height: 23px;
  background: none;
  color: var(--font-color-1);
  border: none !important;
}

.tb .o a {
  padding: 3px 15px;
}

.tbn {
  display: flex !important;
  text-align: center;
  flex-direction: column;
  align-items: center;
}

.tbn li {
  margin: 0;
  height: 33px;
  border: none;
}

.tbn ul a {
  width: 100px;
  color: var(--tag-font-color);
}

.tbn li.a {
  border: none;
  margin: 0;
  padding: 0;
  background: none;
}

.tbn .mt {
  font-size: 16px;
  padding: 10px;
  color: var(--tag-font-color);
}

.xlda dd a {
  color: red;
}

.pm_o .p_pop {
  text-align: left;
  margin-left: 31px;
  margin-top: 5px;
}

.notice_pm {
  background-image: none;
  margin-left: 14px !important;
}

.appl {
  float: left;
  overflow: hidden;
  padding: 0px 0px;
  margin-bottom: 0px;
  line-height: 2.5;
}

/* ----------------右----------------*/
.ct2_a .mn {
  display: inline;
  margin-right: 0px;
  width: 803px;
  min-height: 350px;
  background: var(--card-background-2);
  border-left: 0px solid var(--Second-color);
  padding: 10px;
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-radius: var(--radius16);
  color: var(--font);
}

.dt {
  border-top: 0px solid #cdcdcd;
  width: 100%;
}

.dt th {
  background: var(--sider-color);
}

tr:nth-child(1) > th:nth-child(1) {
  border-radius: var(--radius8) 0 0 6px;
}

tr:nth-child(1) > th:nth-child(4) {
  border-radius: 0 6px 6px 0;
}

.dt td, .dt th {
  padding: 7px 4px;
  border-bottom: 1px dashed var(--avatar-border-1) !important;
  border-radius: 0;
}

.tm_c .o {
  background: transparent !important;
}

.tpclg .pt {
  height: auto;
}

.px, .pt, .ps, select {
  border: 0.5px solid var(--input-border-3);
  background: var(--input-background-3) !important;
  border-radius: var(--radius8) !important;
  padding: 2px 6px;
  color: var(--font-color-1);
}

.pns .px {
  border: 1px solid var(--input-border-2);
  margin-right: 10px;
  width: 100px;
  background: var(--input-background-2) !important;
}

.px, .pt {
  padding: 4px;
}

.tbmu .a {
  color: var(--font-color-1);
  font-weight: 700;
}

.gacode_text {
  border: none !important;
  background: var(--input-background-1) !important;
  border-radius: 12px !important;
}

.exfm {
  border: 1px solid var(--Second-color);
  background: var(--sider-color) !important;
}

.pml dl {
  margin-left: 16px !important;
  margin-right: 16px !important;
  background: var(--input-background-1);
  border-radius: var(--radius16) !important;
  margin: 15px 0;
  border: 1px solid var(--panel-background-1) !important;
}

.pml .hover {
  background: var(--input-background-1);
}

.tf a.xi2, .showmenu.xi2, .tl .th td, .tl .th th {
  color: var(--font) !important;
}

.tfm .d {
  clear: both;
  margin: 5px 0;
  color: var(--font-color);
  text-align: left;
}

#selBox {
  padding: 15px;
  height: 140px;
  border: none;
  margin: 0;
  overflow-y: auto;
  border-radius: var(--radius12) !important;
}

.pmform .px {
  width: 400px;
  text-align: left;
}

.pgs.pbm.cl.pm_op {
  margin-left: 18px !important;
}

.un_selector input {
  width: 390px;
  height: 21px;
  outline: none;
  border: 0px solid var(--Second-color) !important;
  background: transparent;
}

.pmform .tedt {
  width: 600px;
}

#showSelectBox {
  color: var(--font-color) !important;
}

.nts dl {
  margin: 15px 0;
  background: var(--input-background-1);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05);
  border-radius: 12px !important;
  border: 1px solid var(--card-background-2) !important;
}

.nts {
  padding-left: 10px;
}

.xld dd {
  margin-bottom: 8px;
  margin-left: 80px;
}

dt > span {
  margin-left: 16px !important;
}

.pgs {
  padding: 5px 0 5px 0;
  margin-left: -6px;
  margin-top: 20px;
}

.tbmu {
  padding: 0 0 0 20px;
  border-bottom: none;
}

.bmw .bm_h {
  color: #fff;
  border-radius: var(--radius12) !important;
  margin: 10px;
  border-top-color: transparent;
  border-right: none;
  border-bottom-color: transparent !important;
  border-left: none;
  background: var(--Second-color);
}

#f_pst {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2) !important;
  overflow: hidden;
}

.bm_h {
  padding: 0 10px;
  height: 31px;
  border-top: 0px solid #fff;
  background: transparent;
  line-height: 31px;
  border-radius: 0;
  white-space: nowrap;
  color: var(--font-color-1) !important;
  overflow: hidden;
}

#f_pst .px {
  padding: 4px;
  background: var(--sider-color) !important;
  border: 1px solid var(--Second-color) !important;
}

.ftid a {
  display: block;
  overflow: hidden;
  padding: 4px;
  height: 17px;
  border-radius: var(--radius8) !important;
  line-height: 17px;
  font-size: 12px;
  font-weight: 500 !important;
  text-align: center !important;
  color: var(--font-color-1) !important;
  background: #f44646 !important;
}

.pl.bm {
  border: 0px solid var(--Second-color);
  background: transparent;
}

.plhin {
  overflow: hidden;
  background-image: none !important;
}

table {
  background: transparent;
}

.pls {
  width: 160px;
  overflow: hidden;
  border: none !important;
  background: none !important;
}

.plc {
  padding: 0 20px;
  background: #fff;
  background: var(--card-background-2) !important;
}

.pl .quote blockquote, .pl .quote {
  background: none !important;
  background: transparent !important;
}

.quote {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjY2NjY2NjIiBkPSJNNC41ODMgMTcuMzIxQzMuNTUzIDE2LjIyNyAzIDE1IDMgMTMuMDExYzAtMy41IDIuNDU3LTYuNjM3IDYuMDMtOC4xODhsLjg5MyAxLjM3OGMtMy4zMzUgMS44MDQtMy45ODcgNC4xNDUtNC4yNDcgNS42MjFjLjUzNy0uMjc4IDEuMjQtLjM3NSAxLjkyOS0uMzExYzEuODA0LjE2NyAzLjIyNiAxLjY0OCAzLjIyNiAzLjQ4OWEzLjUgMy41IDAgMCAxLTMuNSAzLjVhMy44NyAzLjg3IDAgMCAxLTIuNzQ4LTEuMTc5bTEwIDBDMTMuNTUzIDE2LjIyNyAxMyAxNSAxMyAxMy4wMTFjMC0zLjUgMi40NTctNi42MzcgNi4wMy04LjE4OGwuODkzIDEuMzc4Yy0zLjMzNSAxLjgwNC0zLjk4NyA0LjE0NS00LjI0NyA1LjYyMWMuNTM3LS4yNzggMS4yNC0uMzc1IDEuOTI5LS4zMTFjMS44MDQuMTY3IDMuMjI2IDEuNjQ4IDMuMjI2IDMuNDg5YTMuNSAzLjUgMCAwIDEtMy41IDMuNWEzLjg3IDMuODcgMCAwIDEtMi43NDgtMS4xNzkiLz48L3N2Zz4=)
    no-repeat 0 0;
}

.quote blockquote {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjY2NjY2NjIiBkPSJNMTkuNDE3IDYuNjc5QzIwLjQ0NyA3Ljc3MyAyMSA5IDIxIDEwLjk4OWMwIDMuNS0yLjQ1NiA2LjYzNy02LjAzIDguMTg4bC0uODkzLTEuMzc4YzMuMzM1LTEuODA0IDMuOTg3LTQuMTQ1IDQuMjQ4LTUuNjIxYy0uNTM3LjI3OC0xLjI0LjM3NS0xLjkzLjMxMWMtMS44MDQtLjE2Ny0zLjIyNi0xLjY0OC0zLjIyNi0zLjQ4OWEzLjUgMy41IDAgMCAxIDMuNS0zLjVjMS4wNzMgMCAyLjEuNDkgMi43NDggMS4xNzltLTEwIDBDMTAuNDQ3IDcuNzczIDExIDkgMTEgMTAuOTg5YzAgMy41LTIuNDU2IDYuNjM3LTYuMDMgOC4xODhsLS44OTMtMS4zNzhjMy4zMzUtMS44MDQgMy45ODctNC4xNDUgNC4yNDctNS42MjFjLS41MzcuMjc4LTEuMjQuMzc1LTEuOTI5LjMxMUM0LjU5MSAxMi4zMjMgMy4xNyAxMC44NDIgMy4xNyA5YTMuNSAzLjUgMCAwIDEgMy41LTMuNWMxLjA3MyAwIDIuMS40OSAyLjc0OCAxLjE3OSIvPjwvc3ZnPg==)
    no-repeat 100% 100%;
}

.ptn {
  padding-top: 0px !important;
  vertical-align: middle !important;
  padding-bottom: 0px !important;
}

.pl table {
  margin-bottom: 10px;
  border-radius: var(--radius16) !important;
  background: var(--panel-background-1);
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.03);
}

.pl table.t_table {
  table-layout: auto;
  border: none;
  box-shadow: none;
  background: transparent;
}

.showhide {
  padding: 20px;
  border-radius: var(--radius12) !important;
  background: var(--code-background-1);
  border: 1px dashed #ff9a9a8f;
}

.t_table td {
  border: none !important;
  padding: 5px 0 !important;
}

.t_table {
  background: transparent;
  margin: 20px 6px;
  padding: 1px;
  display: block;
}

.dd > table, .tns.xg2 > table, .ratl, .rate, .t_fsz > table {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  color: var(--font-color-1);
}

.rate {
  border-radius: 14px;
  background: var(--edtbar) !important;
}

.theme-dark .rate {
  background: rgba(255, 255, 255, 0.1) !important;
}

.vwthd {
  padding: 20px !important;
  vertical-align: middle !important;
  border-bottom-right-radius: var(--radius16) !important;
  border-top-right-radius: var(--radius16) !important;
}

#p_btn {
	margin: 40px !important;
	padding: 20px !important;
}

#p_btn a, #p_btn i {
  background: none;
}

#p_btn i {
  background: #f44646 !important;
  color: #fff;
  padding: 4px 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.5s ease !important;
  border-radius: var(--radius10) !important;
}

#p_btn span {
  padding-left: 6px;
  color: #fff;
}

.bmn, .pg a, .pgb a, .pg strong, .card, .card .o, div.exfm {
  border-color: var(--Second-color);
}

.pm_o .o {
  width: 17px;
  height: 17px;
  text-indent: 20px;
  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTSAxMiAyIEMgNi40OCAyIDIgNi40OCAyIDEyIEMgMiAxNy41MiA2LjQ4IDIyIDEyIDIyIEMgMTcuNTIgMjIgMjIgMTcuNTIgMjIgMTIgQyAyMiA2LjQ4IDE3LjUyIDIgMTIgMiBaIE0gMTAgMTYuNSBMIDEwIDcuNSBMIDE2IDEyIEwgMTAgMTYuNSBaIiBzdHlsZT0idHJhbnNmb3JtLWJveDogZmlsbC1ib3g7IHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7IGZpbGw6IHJnYigxNjgsIDg1LCA5NCk7IiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAxLCAtMSwgMCwgMC4wMDAwMDEsIDApIi8+Cjwvc3ZnPg==")
    no-repeat;
  background-position: 0px 1px !important;
}

.pml .newpm {
  background: #ffa7004d;
  border: 1px solid #ffa7004d !important;
}

.xlda dl {
  padding-left: 0;
}

.xld .m {
  margin: 8px 8px 10px 0;
}

.cl > dd > img {
  border: none;
}

.m.avt.mbn img {
  height: 42px;
  width: 42px;
  border: none;
}

.m.avt.mbn a img {
  border: 3px solid var(--avatar-border-1);
  border-radius: 12px;
}

#nv_home .buddy li {
  background: var(--card-background-2);
  border-radius: var(--radius12) !important;
  border: 1px solid var(--card-border-1) !important;
}

.ntc_body {
  color: var(--font-color-1) !important;
}

#friend_ul .avt.avtm img {
  height: 93px;
  width: 100px;
}

.z.ptn {
  color: red !important;
  margin-left: 10px;
}

.bbda.ptm.pbm {
  padding: 18px !important;
  background: var(--input-background-1);
  margin: 10px 0;
  font-size: 13px;
  border-radius: 14px !important;
  border: 1px solid var(--card-background-2) !important;
}

.bbda.ptm.pbm .y {
  color: #fff;
  background: #f44646;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 11px;
  margin: 0 0 0 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}

.mtm.pns input, .mtm.pns label {
  margin: 0 5px;
}

.pnc.vm {
  color: #fff !important;
  border-radius: var(--radius8) !important;
  border: none;
  background: var(--button-background-1) !important;
  padding: 3px 10px;
  font-size: 12px;
  margin-top: -1px;
}

#fwin_dialog_cover {
  background: none !important;
}

/* ————————————个人资料————————————————*/
.ct1.wp.cl {
  border: 0px solid var(--primary-color);
  border-top: 0 !important;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.1) !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  background: var(--card-background-1) !important;
}

.pf_l em {
  color: var(--font-color-1);
}

#avatarform img {
  border-radius: var(--radius16) !important;
}

#uhd {
  border: 0px solid var(--primary-color);
  border-bottom: none;
  background: var(--primary-color);
  border-radius: var(--radius16);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

#uhd .tb .a a {
  position: relative;
  margin-left: 16px;
  cursor: pointer;
  color: var(--tag-font-color) !important;
  transition: 0.2s;
  border-radius: var(--radius8) !important;
  height: 29px;
}

#uhd > ul > li:nth-child(1) > a::hover {
  color: var(--primary-color) !important;
}

.ct2_a, .ct3_a {
  background-image: none;
  border: 0px solid var(--Second-color);
  background: var(--primary-color);
  box-shadow: 0 1px 30px rgba(0, 0, 0, 0.1);
}

.tb {
  margin-top: 10px;
  padding-left: 5px;
  line-height: 30px;
  border-bottom: 0px solid var(--sider-color);
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.tb .a a, .tb a:hover {
  background: transparent !important;
  border: 0px solid var(--Second-color) !important;
  border-bottom: #fff !important;
}

.tb .current a {
  color: red !important;
  background: var(--edtbar) !important;
  border-radius: 8px !important;
}

#uhd > ul > li:nth-child(1) > a, #uhd .mt {
  color: var(--font-color-1) !important;
}

#uhd > ul > li:nth-child(1) > a, #uhd .mt {
  color: var(--tag-font-color) !important;
}

#uhd > div > p > a {
  color: #fff !important;
}

#calendar_week td, #calendar_header td {
  border-bottom: 0px solid #c2d5e3 !important;
}

#calendar {
  border: 0px solid #ddd !important;
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.15) !important;
}

.calendar_default, .calendar_default a:link, .calendar_default a:visited {
  color: var(--font-color-1) !important;
}

td.calendar_checked, span.calendar_checked {
  background: #ffffff !important;
}

td.calendar_checked, span.calendar_checked {
  background: #f26c4f !important;
}

.calendar_checked, .calendar_checked a:link, .calendar_checked a:visited {
  color: #ffffff !important;
}

#calendar_week a {
  color: var(--font-color-1) !important;
}

.pm_c .o {
  float: left;
  display: inline;
  margin: 5px 0 0 -25px;
  margin-top: 0;
}

.tfx .alt, .tfx .alt th, .tfx .alt td {
  background: var(--Second-color);
}

.tfx th, .tfx td {
  border-width: 0 3px !important;
  background: #fff;
}

.tdat th, .tdat td {
  padding: 4px 5px;
  border: 0px solid #cdcdcd;
  border-radius: 0 !important;
}

.tdat {
  border: 1px solid var(--Second-color);
}

.alt, .alt th, .alt td {
  background: var(--sider-color);
}

#normalthread_2514014 > tr > td:nth-child(3) > cite {
  color: #ff5733;
}

#uhd > ul > li:nth-child(1) > a {
  color: var(--tag-background-2) !important;
}

#uhd > ul > li:nth-child(2) > a:hover {
  color: var(—primary-font-color) !important;
}

.tl .bm_c {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* ————————————加为好友/发送消息————————————————*/
#uhd .mn .pm2 a, #uhd .mn .addf a {
  background: none;
  color: #fff;
  margin-left: 16px;
}

#uhd .mn {
  margin-right: 33px;
  margin-top: 14px;
  line-height: 30px;
}

#uhd .mn .pm2 a, #uhd .mn .addf a {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px 12px;
  border-radius: var(--radius8);
}

#uhd .tb a, #flw_header .bar {
  color: #fff;
}

.pm .flb {
  background: var(--Second-color);
  padding: 10px 10px 8px;
  border-radius: var(--radius12) !important;
}

.pm .c {
  padding: 0;
  background: transparent;
}

.pm .flb em {
  padding-left: 0px;
  background: none;
  text-shadow: none;
  color: var(--font-color-1);
  font-size: 13px;
}

#pmform_532461 > div.mtn.pns.cl > div > a {
  margin-top: -10px;
  color: var(--font-color-1);
  display: block;
}

.pm .flbc {
  background-image: none;
}

.pm_tac {
  padding: 5px 10px;
  background: #cdcdcd6b;
  border-radius: var(--radius10) !important;
}

.buddy .avt {
  position: absolute;
  margin-left: -70px;
}

p.mtm.cl.pns .z {
  color: #fff;
  line-height: 25px;
}

.avt.avtm img {
  height: 100px;
  width: 100px;
}

.tfm caption, .tfm th, .tfm td {
  vertical-align: top;
  padding: 7px 0;
  vertical-align: middle;
}

.bm.mtm > .bm_h {
  color: #fff;
  border: none;
}

.bm.mtm {
  overflow: hidden;
  background: var(--card-background-2);
  border-radius: var(--radius12) !important;
  border: 1px solid var(--card-border-1) !important;
}

.bm_h.cl a {
  color: var(--font-color-1);
}

.buddy_group li {
  overflow: hidden;
  padding: 5px 0;
  line-height: 20px;
  border-bottom: 1px dashed var(--Second-color);
  border-radius: 0;
}

/*---------消息提示-------- */
.pc_l, .pc_c, .pc_inner, .pc_r, .popuptext .pc_l, .popuptext .pc_c, .popuptext .pc_inner, .popuptext .pc_r {
  background: none;
}

.pc_c {
  backdrop-filter: var(--backdrop-filter-1) !important;
  background: rgba(0, 0, 0, 0.5) !important;
  font-weight: bold !important;
  color: #fff !important;
  border-radius: var(--radius16) !important;
  box-shadow: var(--panel-shadow-s) !important;
}

.pc_inner span em.desc {
	color: #fff !important;
}

.pc_inner i {
  font-size: 18px !important;
}

.pc_inner span {
  color: #fff !important;
	font-size: 16px !important;
}

/*---------- 瀑布流 -------- */
#frame8nZQJt {
  margin-bottom: 10px;
  border: 0px solid #ccc;
  background: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
}

.frame-title, .frametitle, .tab-title {
  background: none;
}

.frame-title, .frametitle, .tab-title {
  background: none;
  border-radius: 10px 10px 0 0;
  color: #fff;
}

.diy-m1 li {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15) !important;
}

/*---------- 小黑屋 -------- */
#darkroomtable {
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 13px;
  line-height: 2;
  border-radius: var(--radius16) !important;
  overflow: hidden !important;
  background: var(--card-background-2);
}

#darkroomtable > tbody > tr:nth-child(1) > th {
  border-radius: 0 !important;
  background: var(--primary-color) !important;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

#darkroomtable > tbody > tr:nth-child(1) > th:nth-child(1) {
  border-radius: var(--radius8) 0 0 0 !important;
  width: 130px !important;
}

#darkroomtable > tbody > tr:nth-child(1) > th:nth-child(5) {
  border-radius: 0 6px 0 0 !important;
}

#darkroomtable .alt td {
  background: var(--td-color);
}

/*---------- 签到 -------- */
.ddpc_sign_table {
  color: var(--font-color-1) !important;
  font-size: 13px !important;
  border-radius: var(--radius16) !important;
  overflow: hidden !important;
  background: var(--card-background-2) !important;
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05) !important;
}

.ddpc_sign_btn_red {
	border-radius: var(--radius12) !important;
	color: #fff !important;
}

.ddpc_sign_table table th {
	color: var(--font-color-1) !important;
	border-radius: 0 !important;
	background: rgba(0, 0, 0, 0.01) !important;
	font-weight: bold !important;
}

.ddpc_sign_table tr:nth-child(n + 2) > td {
  border-radius: 0 !important;
}

.dd_sign {
  overflow: visible !important;
}

.ddpc_sign_warp {
  overflow: visible !important;
}

.ddpc_sign_list {
  border-bottom: 0px solid #dedede !important;
  line-height: 40px;
  height: 40px;
  font-weight: 700;
}

.ddpc_sign_list ul li.ddpc_on a {
  border-bottom: none !important;
  color: #ba350f;
}

.ddpc_sign_table a {
  color: var(--font-color-1) !important;
  box-shadow: none !important;
}

.ddpc_sign_btn_grey {
  background: #000 !important;
  color: #fff !important;
  border-radius: var(--radius12) !important;
}

.ddpc_sign_continuity, .ddpc_sign_rule, .ddpc_sign_info {
  border: 1px solid var(--card-border-1) !important;
  border-radius: var(--radius16) !important;
  background: var(--card-background-2) !important;
}


.ddpc_sign_continuity ul li .ddpc_borderright {
  border-right: 1px solid var(--Second-color) !important;
}

.focus {
  border: none !important;
  border-radius: var(--radius8) !important;
  background: #ffffffed !important;
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: var(--backdrop-filter-1) !important;
}

.bm {
  border: none;
}

.plugin .bm_h {
  border: none;
  background: none;
}

.ddpc_sign_table table tr:nth-child(2n + 1) {
  background: var(--edtbar) !important;
}

/* ——————————————————————————————————高级发帖页—————————————————————————————————————————————————*/
#e_iframe {
  background: transparent !important;
}

.ct2_a.ct2_a_r.wp.cl {
  box-shadow: 0 1px 30px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin: 10px 0 0;
}

#postform #ct {
  padding: 0px !important;
}

#editorbox {
  padding: 10px 0 0 0;
}

#postbox {
  padding: 0px;
}

#postbox input {
  height: 18px;
  margin-right: 4px;
  background: var(--input-background-1) !important;
  border: 1px solid var(--input-border-1);
}

#postbox {
  padding: 10px 20px;
}

#editorbox > ul {
  margin: 10px 0 !important;
}

#editorbox > ul > a {
  width: 150px;
}

#postbox > div.pbt.cl {
  margin-bottom: 5px;
}

#typeid_ctrl {
  border: 0px solid var(--Second-color) !important;
  background: var(--tag-background-2) !important;
  color: #fff !important;
  padding: 6px !important;
}

#subject {
  width: 35em;
}

.bbs {
  border-bottom: 0px solid #cdcdcd !important;
}

#postsubmit {
  background: rgba(114, 194, 64, 1) !important;
}

/* ———提示小按钮—————*/
.ntc_l .d {
  float: right;
  width: 16px;
  height: 16px;
  overflow: hidden;
  text-indent: -9999px;
  border-radius: 50%;
  background: #ff1f35a3 !important;
  color: #fff !important;
  position: relative;
  transition: background 0.15s ease;
  background: none;
}

/* 关闭按钮悬停时的效果 */
.ntc_l .d:hover {
  background: red !important;
}

/* 伪元素，用来画出"X" */
.ntc_l .d::before, .ntc_l .d::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: background 0.15s ease;
}

.ntc_l .d::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.sltm {
  padding: 5px;
  border: none;
  background: var(--panel-background-1) !important;
  text-align: center;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius12) !important;
  backdrop-filter: var(--backdrop-filter-1) !important;
}

.sltm li.current, .sltm li {
  color: var(--font-color);
  text-align: center;
}

.sltm li:hover {
  color: #f44646;
  background: var(--sider-color);
  text-align: center;
  border-radius: var(--radius8) !important;
}

#quota, #imageCount, #videoCount, #resourceSize {
  width: 80px;
}

/* 更改 输入框 提示词的样式 */
#videoCount::placeholder, #imageCount::placeholder, #quota::placeholder, #resourceSize::placeholder {
  color: transparent;
}

.ct2_a .tb {
  margin-top: 0;
  padding: 0;
  border: none;
}

.ntc_l {
  background: #ffe9bf;
}

.edt {
  border: 0.5px solid var(--avatar-border-1) !important;
  overflow: hidden !important;
  border-radius: var(--radius12) !important;
}

.edt .bar {
  border-bottom: 1px solid var(--img-border-1) !important;
  border-radius: 0 !important;
  height: 55px !important;
  background: var(--edtbar) !important;
  backdrop-filter: var(--backdrop-filter-3) !important;
}

.edt .bar a {
  border: none !important;
  border-radius: 4px;
  margin: 3px;
}

.m_c .tedt {
  width: auto;
}

.edt .bar a:hover, .edt .bar a.hover {
  border-radius: 6px;
  background-color: var(--card-background-1) !important;
  border: none !important;
  margin: 3px;
  outline: 1px solid var(--card-border-2) !important;
}

.edt .area {
  background: var(--panel-background-1) !important;
  padding: 10px !important;
  backdrop-filter: var(--backdrop-filter-5) !important;
}

.edt .b2r a.dp {
  margin-right: 3px !important;
  background: var(--input-background-1) !important;
  border-radius: var(--radius8) !important;
  padding-left: 0px !important;
  text-align: center;
  height: 20px !important;
  padding-top: 2px;
  border: 0.5px solid var(--avatar-border-1) !important;
}

.edt .b2r a:hover.dp {
  outline: none !important;
}

#e_simple:hover, #e_fullswitcher:hover {
  outline: none !important;
}

.edt .b2r a {
  height: 23px !important;
}

.edt .btn, .edt .b1r, .edt .b2r {
  border: none !important;
}

.bar_swch {
  display: block;
  clear: both;
  margin-left: 4px !important;
  padding-top: 5px !important;
}

.edt .bbar {
  border-top: 0.5px solid var(--img-border-1) !important;
  color: var(--font-color) !important;
  border-radius: 0 !important;
  background: var(--edtbar) !important;
  height: 30px !important;
  line-height: 31px;
}

.edt .bbar a {
  color: var(--font-color) !important;
}

.edt .bbar em {
  height: 30px !important;
  margin-left: 6px;
}

.edt .pt {
  padding: 0 !important;
  width: 100% !important;
  height: 600px;
  border: none;
  font-size: 14px;
  border-radius: 0 !important;
}

.edt .b1r a {
  padding-top: 30px !important;
  font-size: 12px !important;
}

.ntc_l {
  padding: 5px 10px;
  background: #fefee9;
  border-radius: 0 !important;
}

.ntc_l.bbs {
  border-bottom: 0.5px solid var(--img-border-1-dark) !important;
  border-radius: 0 !important;
  background: #c2d5e30d;
  color: var(--font-color-1);
}

#attach_tblheader > tbody > tr > td.atna.pbn {
  padding-bottom: 0px !important;
}

#attach_tblheader {
  border-radius: var(--radius8) !important;
  height: 30px;
}

#post_extra_c .exfm {
  margin: 10px;
  background: var(--panel-background-1) !important;
  border: 1px solid var(--panel-background-1) !important;
  border-radius: var(--radius12) !important;
}

#post_extra_tb label.a {
  border-bottom-color: transparent;
  background: none;
  box-shadow: none;
}

#post_extra_tb label span {
  float: left;
  padding: 0 8px 0 8px;
  background: none;
  line-height: 25px;
  border: none !important;
  border-radius: var(--radius8) !important;
  color: #fff !important;
  background: var(--tag-background-2) !important;
}

#post_extra_tb label {
  border: none;
  margin-right: 6px;
  height: 25px !important;
}

.pnpost .pn {
  height: 28px;
  font-size: 13px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
}

.mbm {
  margin-bottom: 5px !important;
}

.simpleedt .bar {
  height: 29px !important;
}

#e_simple, #e_fullswitcher {
  padding: 2px 8px !important;
  background: none !important;
  border-radius: var(--radius8) !important;
  background: var(--input-background-1) !important;
  height: 18px;
  border: 0.5px solid var(--avatar-border-1) !important;
}

#fwin_dialog, #e_image_menu, #e_attach_menu {
  backdrop-filter: var(--backdrop-filter-3) !important;
  border: 1px solid rgba(255, 255, 255);
  box-shadow: 0 1px 100px rgba(0, 0, 0, 0.2), inset 0px 0px 90px 10px rgba(255, 255, 255, 0.93);
  background: rgba(244, 246, 248, 0.85);
  border-radius: 10px;
}

#spanButtonPlaceholder, #imgSpanButtonPlaceholder {
  background-image: none !important;
  background: #000;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  color: #fff;
  width: 90px !important;
  height: 25px !important;
  position: relative;
  padding: 2px 10px;
  border-radius: var(--radius8) !important;
}

#imgSpanButtonPlaceholder::before {
  content: "选择图片上传";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
}

#spanButtonPlaceholder::before {
  content: "选择文件上传";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 13px;
  white-space: nowrap;
}

.upfl table td {
  border-bottom: 0px dashed var(--Second-color);
  height: 30px;
  line-height: 24px;
  border-radius: 0 !important;
}

.atna p img, .attswf p img {
  border-radius: 0 !important;
}

#editorbox > ul > a:hover {
  background: transparent !important;
  color: var(--primary-color) !important;
}

#fwin_medal {
  position: fixed;
  z-index: 201;
  left: 460px;
  top: 494px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 10px !important;
  background: rgb(255, 255, 255) !important;
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease !important;
}

#delform > table > tbody > tr.th > td.num, #delform > table > tbody > tr.th > td.by, #delform > table > tbody > tr.th > td.icn, #delform > table > tbody > tr.th > td.frm, #delform > table > tbody > tr.th > th {
  background: var(--sider-color) !important;
  border-radius: 0 !important;
  color: var(--font-color-1) !important;
}

#delform > table > tbody > tr.th > td.icn {
  border-radius: var(--radius8) 0 0 8px !important;
}

#delform > table > tbody > tr.th > td.by {
  border-radius: 0 8px 8px 0 !important;
}

dl > dd > p:nth-child(4) > strong, dl > dd > p:nth-child(5) > a {
  color: var(--font-color-1) !important;
}

/* 进度条关闭按钮*/
a.progressCancel {
  display: block;
  float: right;
  width: 16px;
  height: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  background: #999;
  border-radius: 50%;
  position: relative;
  transition: background 0.15s ease;
}

.progressContainer {
  overflow: hidden;
  margin: 5px;
  padding: 5px 10px;
  border: none;
  background: var(--edtbar);
  border-radius: var(--radius10) !important;
}

a.progressCancel:hover {
  background: red;
}

a.progressCancel::before, a.progressCancel::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: background 0.15s ease;
}

a.progressCancel::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* 弹窗 */
.fwinmask {
  border: 1px solid var(--panel-border-1) !important;
  overflow: hidden;
  margin: 0 80px;
  backdrop-filter: var(--backdrop-filter-3) !important;
  border-radius: var(--radius16) !important;
  box-shadow: var(--panel-shadow) !important;
  background: var(--panel-background-1) !important;
  height: auto !important;
}

#e_image_menu {
  width: 700px !important;
}

.atds .px {
  width: 60px;
}

.ps, select {
  padding: 4px !important;
}

.imgf .px {
  padding: 4px 8px;
}

.popupfix .px {
  margin-bottom: 4px;
}

.atds .px, .ps, select, .imgf .px, .popupfix .px {
	background: var(--edtbar) !important;
	color: var(--font-color-2);
	border: 0.5px solid var(--input-border-3);
}

/* 附件关闭按钮*/
.xld a.d, .xl a.d, .attc a.d, .c a.d, .sinf a.d {
  float: right;
  width: 16px;
  height: 16px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  background: #333;
  border-radius: 50%;
  position: relative;
  transition: background 0.15s ease;
  margin-right: 10px;
  filter: var(--filter2) !important;
}

.xld a.d:hover, .xl a.d:hover, .attc a.d:hover, .c a.d:hover, .sinf a.d:hover {
  background: red;
}

.xld a.d::before, .xl a.d::before, .attc a.d::before, .c a.d::before, .sinf a.d::before, .xld a.d::after, .xl a.d::after, .attc a.d::after, .c a.d::after, .sinf a.d::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  background: white;
  transform: translate(-50%, -50%) rotate(45deg);
  transition: background 0.15s ease;
}

.xld a.d::after, .xl a.d::after, .attc a.d::after, .c a.d::after, .sinf a.d::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.tbms {
  border-radius: var(--radius8) !important;
}

/* 附件关闭按钮结束*/
#editorbox > ul > li:nth-child(1) > a, .upfl a, #imgattachlist a {
  color: var(--font-color-1) !important;
}

.upfl {
  max-height: 700px;
}

.imgl img {
  border: 3px solid var(--img-border-1);
  max-width: 110px;
  border-radius: var(--radius12) !important;
}

.imgl {
  border-radius: var(--radius12) !important;
}

.pnc, a.pnc {
  font-size: 13px;
}

.enter-btn {
  background: var(--card-background-2);
  border: 1px solid var(--panel-background-1) !important;
  border-radius: 16px !important;
  overflow: hidden;
}

#spanButtonPlaceholder *, #imgSpanButtonPlaceholder * {
  position: absolute;
  inset: 0;
  width: 110px;
  height: 30px;
  overflow: hidden;
}

.p_opt .txt, .p_opt .txtarea {
  border: 0.5px solid var(--input-border-3);
  border-radius: var(--radius10) !important;
  background: var(--input-background-3);
}

.xg1 .psave {
  padding: 4px 10px;
  border: none;
  font-size: 13px;
  color: #fff !important;
  background: red;
  border-radius: 8px;
  margin: 0 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2) !important;
}

#post_extra_tb span.a {
  background-image: none !important;
}

#rstnotice .xi2 {
  color: rgba(133, 192, 84, 1);
}

.fa_rss {
  height: 12px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpb25pY29uIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTEwOC41NiAzNDIuNzhhNjAuMzQgNjAuMzQgMCAxMDYwLjU2IDYwLjQ0IDYwLjYzIDYwLjYzIDAgMDAtNjAuNTYtNjAuNDR6Ii8+PHBhdGggZD0iTTQ4IDE4Ni42N3Y4Ni41NWM1MiAwIDEwMS45NCAxNS4zOSAxMzguNjcgNTIuMTFzNTIgODYuNTYgNTIgMTM4LjY3aDg2LjY2YzAtMTUxLjU2LTEyNS42Ni0yNzcuMzMtMjc3LjMzLTI3Ny4zM3oiLz48cGF0aCBkPSJNNDggNDh2ODYuNTZjMTg1LjI1IDAgMzI5LjIyIDE0NC4wOCAzMjkuMjIgMzI5LjQ0SDQ2NEM0NjQgMjM0LjY2IDI3Ny42NyA0OCA0OCA0OHoiLz48L3N2Zz4=);
  display: block;
  line-height: 12px;
  filter: var(--filter2);
  margin: 12px 0px 0px 0px;
  color: #333 !important;
}

.fpd a.fbld {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMS42MyA3LjgyQzEyLjQ2IDcuMjQgMTMgNi4zOCAxMyA1LjUgMTMgMy41NyAxMS40MyAyIDkuNSAySDR2MTJoNi4yNWMxLjc5IDAgMy4yNS0xLjQ2IDMuMjUtMy4yNSAwLTEuMy0uNzctMi40MS0xLjg3LTIuOTN6TTYuNSA0aDIuNzVjLjgzIDAgMS41LjY3IDEuNSAxLjVTMTAuMDggNyA5LjI1IDdINi41VjR6bTMuMjUgOEg2LjVWOWgzLjI1Yy44MyAwIDEuNS42NyAxLjUgMS41cy0uNjcgMS41LTEuNSAxLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

.b2r #e_attach, .b2r #e_image, .b2r #e_sml, .b2r #e_aud, .b2r #e_vid, .b2r #e_fls, .fpd a.fbld, #e_bold, #e_italic, #e_underline, .fpd a.fclr, .fpd a.flnk, .fpd a.fmg, .fpd a.fsml, .fpd a.fqt, .fpd a.fcd, #e_quote, #e_code, #e_forecolor, #e_backcolor, #e_autotypeset, #e_justifyleft, #e_tbl, #e_justifycenter, #e_justifyright, #e_insertorderedlist, #e_insertunorderedlist, #e_removeformat, #e_inserthorizontalrule, #e_free, #e_index, #e_page, #e_undo, #e_redo, #e_hide, #e_password, #e_postbg, #e_unlink, #e_floatleft, #e_floatright, #e_pasteword, #e_url, #e_cst1_sup, #e_cst1_sub, #fastposteditor #spanButtonPlaceholder {
  background-size: 14px;
  background-size: 14px !important;
  background-position: center center !important;
  filter: var(--filter1);
  outline: 1px solid transparent;
}

.b2r #e_attach, .b2r #e_image, .b2r #e_sml, .b2r #e_aud, .b2r #e_vid, .b2r #e_fls {
	background-position: 6px 4px !important;
	color: #222;
	padding: 5px 0;
}

#e_attach, #e_image, #e_sml, #e_aud, #e_vid, #e_fls {
  background-size: 25px !important;
  background-position: 6px 2px !important;
  filter: var(--filter1);
  color: #222;
  padding: 5px 0;
}

#e_bold {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMS42MyA3LjgyQzEyLjQ2IDcuMjQgMTMgNi4zOCAxMyA1LjUgMTMgMy41NyAxMS40MyAyIDkuNSAySDR2MTJoNi4yNWMxLjc5IDAgMy4yNS0xLjQ2IDMuMjUtMy4yNSAwLTEuMy0uNzctMi40MS0xLjg3LTIuOTN6TTYuNSA0aDIuNzVjLjgzIDAgMS41LjY3IDEuNSAxLjVTMTAuMDggNyA5LjI1IDdINi41VjR6bTMuMjUgOEg2LjVWOWgzLjI1Yy44MyAwIDEuNS42NyAxLjUgMS41cy0uNjcgMS41LTEuNSAxLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_italic {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik03IDJ2MmgyLjU4bC0zLjY2IDhIM3YyaDh2LTJIOC40MmwzLjY2LThIMTVWMnoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_underline {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik05IDEzYzIuNzYgMCA1LTIuMjQgNS01VjFoLTIuNXY3YzAgMS4zOC0xLjEyIDIuNS0yLjUgMi41UzYuNSA5LjM4IDYuNSA4VjFINHY3YzAgMi43NiAyLjI0IDUgNSA1em0tNiAydjJoMTJ2LTJIM3oiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

.fpd a.fclr {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTAgMUg4TDMuNSAxM2gybDEuMTItM2g0Ljc1bDEuMTIgM2gyTDEwIDF6TTcuMzggOEw5IDMuNjcgMTAuNjIgOEg3LjM4eiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

.fpd a.flnk {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xLjkgOWMwLTEuMTYuOTQtMi4xIDIuMS0yLjFoNFY1SDRDMS43OSA1IDAgNi43OSAwIDlzMS43OSA0IDQgNGg0di0xLjlINGMtMS4xNiAwLTIuMS0uOTQtMi4xLTIuMXpNMTQgNWgtNHYxLjloNGMxLjE2IDAgMi4xLjk0IDIuMSAyLjEgMCAxLjE2LS45NCAyLjEtMi4xIDIuMWgtNFYxM2g0YzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00em0tOCA1aDZWOEg2djJ6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

.fpd a.fmg {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

.fpd a.fsml {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

.fpd a.fqt {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMCA1djVoMi43NUwxMSAxM2gyLjI1TDE1IDEwVjVoLTV6bS03IDVoMi43NUw0IDEzaDIuMjVMOCAxMFY1SDN2NXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

.fpd a.fcd {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTkuNCAxNi42TDQuOCAxMmw0LjYtNC42TDggNmwtNiA2IDYgNiAxLjQtMS40em01LjIgMGw0LjYtNC42LTQuNi00LjZMMTYgNmw2IDYtNiA2LTEuNC0xLjR6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_quote {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0xMCA1djVoMi43NUwxMSAxM2gyLjI1TDE1IDEwVjVoLTV6bS03IDVoMi43NUw0IDEzaDIuMjVMOCAxMFY1SDN2NXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_code {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTkuNCAxNi42TDQuOCAxMmw0LjYtNC42TDggNmwtNiA2IDYgNiAxLjQtMS40em01LjIgMGw0LjYtNC42LTQuNi00LjZMMTYgNmw2IDYtNiA2LTEuNC0xLjR6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_forecolor {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTAgMUg4TDMuNSAxM2gybDEuMTItM2g0Ljc1bDEuMTIgM2gyTDEwIDF6TTcuMzggOEw5IDMuNjcgMTAuNjIgOEg3LjM4eiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

#e_backcolor {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjM2IiBkPSJNMCAxNWgxOHYzSDB6Ii8+CiAgICA8cGF0aCBkPSJNMTQuNSA4Ljg3UzEzIDEwLjQ5IDEzIDExLjQ5YzAgLjgzLjY3IDEuNSAxLjUgMS41czEuNS0uNjcgMS41LTEuNWMwLS45OS0xLjUtMi42Mi0xLjUtMi42MnptLTEuNzktMi4wOEw1LjkxIDAgNC44NSAxLjA2bDEuNTkgMS41OS00LjE1IDQuMTRjLS4zOS4zOS0uMzkgMS4wMiAwIDEuNDFsNC41IDQuNWMuMi4yLjQ1LjMuNzEuM3MuNTEtLjEuNzEtLjI5bDQuNS00LjVjLjM5LS4zOS4zOS0xLjAzIDAtMS40MnpNNC4yMSA3TDcuNSAzLjcxIDEwLjc5IDdINC4yMXoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_autotypeset {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDE2aDE0di0ySDJ2MnptMC00aDE0di0ySDJ2MnpNMiAydjJoMTRWMkgyem0wIDZoMTRWNkgydjJ6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDE4djE4SDB6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_justifyleft {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDE2aDEwdi0ySDJ2MnpNMTIgNkgydjJoMTBWNnpNMiAydjJoMTRWMkgyem0wIDEwaDE0di0ySDJ2MnoiLz4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMTh2MThIMHoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_tbl {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIA0KICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciDQogIHdpZHRoPSIyNCINCiAgaGVpZ2h0PSIyNCINCiAgdmlld0JveD0iMCAwIDI0IDI0Ig0KICBmaWxsPSJub25lIg0KICBzdHJva2U9IiMwMDAwMDAiDQogIHN0cm9rZS13aWR0aD0iMiINCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIg0KICBzdHJva2UtbGluZWpvaW49InJvdW5kIg0KPg0KICA8cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiIgLz4NCiAgPGxpbmUgeDE9IjMiIHkxPSI5IiB4Mj0iMjEiIHkyPSI5IiAvPg0KICA8bGluZSB4MT0iMyIgeTE9IjE1IiB4Mj0iMjEiIHkyPSIxNSIgLz4NCiAgPGxpbmUgeDE9IjkiIHkxPSI5IiB4Mj0iOSIgeTI9IjIxIiAvPg0KICA8bGluZSB4MT0iMTUiIHkxPSI5IiB4Mj0iMTUiIHkyPSIyMSIgLz4NCjwvc3ZnPg==)
    no-repeat center center;
}

#e_justifycenter {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik00IDE0djJoMTB2LTJINHptMC04djJoMTBWNkg0em0tMiA2aDE0di0ySDJ2MnpNMiAydjJoMTRWMkgyeiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

#e_justifyright {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik02IDE2aDEwdi0ySDZ2MnptLTQtNGgxNHYtMkgydjJ6TTIgMnYyaDE0VjJIMnptNCA2aDEwVjZINnYyeiIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxOHYxOEgweiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

#e_insertorderedlist {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0yIDEzaDJ2LjVIM3YxaDF2LjVIMnYxaDN2LTRIMnYxem0wLTVoMS44TDIgMTAuMXYuOWgzdi0xSDMuMkw1IDcuOVY3SDJ2MXptMS0yaDFWMkgydjFoMXYzem00LTN2Mmg5VjNIN3ptMCAxMmg5di0ySDd2MnptMC01aDlWOEg3djJ6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_insertunorderedlist {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik03IDEwaDlWOEg3djJ6bTAtN3YyaDlWM0g3em0wIDEyaDl2LTJIN3Yyem0tNC01aDJWOEgzdjJ6bTAtN3YyaDJWM0gzem0wIDEyaDJ2LTJIM3YyeiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

#e_removeformat {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHptMCAwaDE4djE4SDB6bTAgMGgxOHYxOEgweiIgZmlsbD0ibm9uZSIvPgogICAgPHBhdGggZD0iTTIuMjcgNC41NUw3LjQzIDkuNyA1IDE1aDIuNWwxLjY0LTMuNThMMTMuNzMgMTYgMTUgMTQuNzMgMy41NSAzLjI3IDIuMjcgNC41NXpNNS44MiAzbDIgMmgxLjc2bC0uNTUgMS4yMSAxLjcxIDEuNzFMMTIuMDggNUgxNlYzSDUuODJ6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_inserthorizontalrule {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICA8ZGVmcz4KICAgICAgICA8cGF0aCBpZD0iYSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+CiAgICA8L2RlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImIiPgogICAgICAgIDx1c2UgeGxpbms6aHJlZj0iI2EiIG92ZXJmbG93PSJ2aXNpYmxlIi8+CiAgICA8L2NsaXBQYXRoPgogICAgPHBhdGggY2xpcC1wYXRoPSJ1cmwoI2IpIiBkPSJNMjAgOUg0djJoMTZWOXpNNCAxNWgxNnYtMkg0djJ6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_sml {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_image {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

#e_attach {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==)
    no-repeat center center;
}

#e_aud {
	background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xMi41OTMgMjMuMjU4bC0uMDExLjAwMmwtLjA3MS4wMzVsLS4wMi4wMDRsLS4wMTQtLjAwNGwtLjA3MS0uMDM1cS0uMDE2LS4wMDUtLjAyNC4wMDVsLS4wMDQuMDFsLS4wMTcuNDI4bC4wMDUuMDJsLjAxLjAxM2wuMTA0LjA3NGwuMDE1LjAwNGwuMDEyLS4wMDRsLjEwNC0uMDc0bC4wMTItLjAxNmwuMDA0LS4wMTdsLS4wMTctLjQyN3EtLjAwNC0uMDE2LS4wMTctLjAxOG0uMjY1LS4xMTNsLS4wMTMuMDAybC0uMTg1LjA5M2wtLjAxLjAxbC0uMDAzLjAxMWwuMDE4LjQzbC4wMDUuMDEybC4wMDguMDA3bC4yMDEuMDkzcS4wMTkuMDA1LjAyOS0uMDA4bC4wMDQtLjAxNGwtLjAzNC0uNjE0cS0uMDA1LS4wMTgtLjAyLS4wMjJtLS43MTUuMDAyYS4wMi4wMiAwIDAgMC0uMDI3LjAwNmwtLjAwNi4wMTRsLS4wMzQuNjE0cS4wMDEuMDE4LjAxNy4wMjRsLjAxNS0uMDAybC4yMDEtLjA5M2wuMDEtLjAwOGwuMDA0LS4wMTFsLjAxNy0uNDNsLS4wMDMtLjAxMmwtLjAxLS4wMXoiLz48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTguNjcxIDMuMjA4QTIgMiAwIDAgMSAyMSA1LjE4VjE3YTQgNCAwIDEgMS0yLTMuNDY1VjkuMThMOSAxMC44NDdWMThxMCAuMDktLjAxNS4xNzRBMy41IDMuNSAwIDEgMSA3IDE1LjMzN3YtOC40OWEyIDIgMCAwIDEgMS42NzEtMS45NzN6TTkgOC44MmwxMC0xLjY2N1Y1LjE4TDkgNi44NDd6Ii8+PC9nPjwvc3ZnPg==) no-repeat center center;
}

#e_vid {
	background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTguNSAzaC0xM0ExLjUgMS41IDAgMCAwIDQgNC41djE1QTEuNSAxLjUgMCAwIDAgNS41IDIxaDEzYTEuNSAxLjUgMCAwIDAgMS41LTEuNXYtMTVBMS41IDEuNSAwIDAgMCAxOC41IDNtLTMuODMgOS43OWwtNC40NCAyLjU5YS45LjkgMCAwIDEtMS4zNS0uNzlWOS40MWEuOS45IDAgMCAxIDEuMzUtLjc5bDQuNDQgMi41OWEuOTEuOTEgMCAwIDEgMCAxLjU4TTEgNWExIDEgMCAwIDAtMSAxdjEyLjVhMSAxIDAgMCAwIDIgMFY2YTEgMSAwIDAgMC0xLTFtMjIgMGExIDEgMCAwIDAtMSAxdjEyLjVhMSAxIDAgMCAwIDIgMFY2YTEgMSAwIDAgMC0xLTEiLz48L3N2Zz4=) no-repeat center center;
}

#e_fls {
	background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNS45ODQzOTAyNDM5MDI0MzkiIHZpZXdCb3g9IjAgMCAxMDI1IDEwMjQiPjxwYXRoIGZpbGw9IiMwMDAwMDAiIGQ9Ik04OTYuNDI4IDEwMjRoLTc2OHEtNTMgMC05MC41LTM3LjVULjQyOCA4OTZWMTI4cTAtNTMgMzcuNS05MC41dDkwLjUtMzcuNWg3NjhxNTMgMCA5MC41IDM3LjV0MzcuNSA5MC41djc2OHEwIDUzLTM3LjUgOTAuNXQtOTAuNSAzNy41bS00ODAtNzY4aC0xOTJxLTEzIDAtMjIuNSA5LjV0LTkuNSAyMi41djQ0OHEwIDEzIDkuNSAyMi41dDIyLjUgOS41dDIyLjUtOS41dDkuNS0yMi41VjU5MnEwLTcgNC41LTExLjV0MTEuNS00LjVoODBxMTMgMCAyMi41LTkuNXQ5LjUtMjIuNXQtOS41LTIyLjV0LTIyLjUtOS41aC04MHEtNyAwLTExLjUtNC41dC00LjUtMTEuNVYzMzZxMC03IDQuNS0xMS41dDExLjUtNC41aDE0NHExMyAwIDIyLjUtOS41dDkuNS0yMi41dC05LjUtMjIuNXQtMjIuNS05LjVtMzg0IDQ0OGgtMTYwVjI4OHEwLTEzLTkuNS0yMi41dC0yMi41LTkuNXQtMjIuNSA5LjV0LTkuNSAyMi41djQ0OHEwIDEzIDkuNSAyMi41dDIyLjUgOS41aDE5MnExMyAwIDIyLjUtOS41dDkuNS0yMi41dC05LjUtMjIuNXQtMjIuNS05LjUiLz48L3N2Zz4=) no-repeat center center;
	background-position: 6px 4px !important;
	background-size: 20px !important;
}

#e_free {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGQ9Ik0wIDBoMjR2MjRIMFYweiIvPgogICAgPHBhdGggZD0iTTIwIDNINHYxMGMwIDIuMjEgMS43OSA0IDQgNGg2YzIuMjEgMCA0LTEuNzkgNC00di0zaDJjMS4xMSAwIDItLjkgMi0yVjVjMC0xLjExLS44OS0yLTItMnptMCA1aC0yVjVoMnYzek00IDE5aDE2djJINHoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_index {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik04IDEyaDh2LTJIOHYyem0wLTRoOFY2SDh2MnptOCA2SDJ2MmgxNHYtMnpNMiA5bDMuNSAzLjV2LTdMMiA5em0wLTd2MmgxNFYySDJ6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDE4djE4SDBWMHoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_page {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik01LjUgMTBIMnY1YzAgLjU1LjQ1IDEgMSAxaDV2LTMuNWwtMy41IDEgMS0zLjV6TTIgM3Y1aDMuNWwtMS0zLjUgMy41IDFWMkgzYy0uNTUgMC0xIC40NS0xIDF6bTEzLTFoLTV2My41bDMuNS0xLTEgMy41SDE2VjNjMC0uNTUtLjQ1LTEtMS0xem0tMS41IDExLjVsLTMuNS0xVjE2aDVjLjU1IDAgMS0uNDUgMS0xdi01aC0zLjVsMSAzLjV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDE4djE4SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_undo {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8dGl0bGU+dW5kbzwvdGl0bGU+CiAgPHBhdGggZD0iTTQ0OCAzODRRMzg5IDMzNiAzMzUgMzEyIDI4MCAyODggMjI0IDI4OEwyMjQgMzgwIDYwIDIxNiAyMjQgNTIgMjI0IDE0NFEzMjAgMTY2IDM3NCAyMjIgNDI4IDI3NyA0NDggMzg0WiIvPgo8L3N2Zz4=)
    no-repeat center center;
}

#e_redo {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8dGl0bGU+cmVkbzwvdGl0bGU+CiAgPHBhdGggZD0iTTY0IDM4NFE4NCAyNzcgMTM4IDIyMiAxOTIgMTY2IDI4OCAxNDRMMjg4IDUyIDQ1MiAyMTYgMjg4IDM4MCAyODggMjg4UTIzMiAyODggMTc4IDMxMiAxMjMgMzM2IDY0IDM4NFoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_hide {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+CiAgICA8ZyBpZD0iaW52aXNpYmxlX2JveCIgZGF0YS1uYW1lPSJpbnZpc2libGUgYm94Ij4KICAgICAgPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJub25lIi8+CiAgICA8L2c+CiAgICA8ZyBpZD0iTGF5ZXJfNyIgZGF0YS1uYW1lPSJMYXllciA3Ij4KICAgICAgPHBhdGggZD0iTTM5LDE4SDM1VjEzQTExLDExLDAsMCwwLDI0LDJIMjJBMTEsMTEsMCwwLDAsMTEsMTN2NUg3YTIsMiwwLDAsMC0yLDJWNDRhMiwyLDAsMCwwLDIsMkgzOWEyLDIsMCwwLDAsMi0yVjIwQTIsMiwwLDAsMCwzOSwxOFpNMTUsMTNhNyw3LDAsMCwxLDctN2gyYTcsNywwLDAsMSw3LDd2NUgxNVpNMTQsMzVhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDE0LDM1Wm05LDBhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDIzLDM1Wm05LDBhMywzLDAsMSwxLDMtM0EyLjksMi45LDAsMCwxLDMyLDM1WiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+)
    no-repeat center center;
}

#e_password {
	background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTAuNSAxNWgzbC0uNTc1LTMuMjI1cS41LS4yNS43ODgtLjcyNVQxNCAxMHEwLS44MjUtLjU4Ny0xLjQxMlQxMiA4dC0xLjQxMi41ODhUMTAgMTBxMCAuNTc1LjI4OCAxLjA1dC43ODcuNzI1em0xLjUgN3EtMy40NzUtLjg3NS01LjczOC0zLjk4OFQ0IDExLjFWNWw4LTNsOCAzdjYuMXEwIDMuOC0yLjI2MiA2LjkxM1QxMiAyMiIvPjwvc3ZnPg==) no-repeat center center;
}

#e_postbg {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjE4cHgiIHdpZHRoPSIxOHB4IiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj4KICA8Zz4KICAgIDxnPgogICAgICA8Zz4KICAgICAgICA8cGF0aCBkPSJNMjEuMzMzLDE5MmMxMS43OTcsMCwyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzM1YtMjEuMzMzYzAtMTEuNzc2LTkuNTM2LTIxLjMzMy0yMS4zMzMtMjEuMzMzIEM5LjUzNiwxMjgsMCwxMzcuNTU3LDAsMTQ5LjMzM3YyMS4zMzNDMCwxODIuNDQzLDkuNTM2LDE5MiwyMS4zMzMsMTkyeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0xOTIsNDIuNjY3aDIxLjMzM2MxMS43OTcsMCwyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzM1MyMjUuMTMxLDAsMjEzLjMzMywwSDE5MmMtMTEuNzk3LDAtMjEuMzMzLDkuNTU3LTIxLjMzMywyMS4zMzMgUzE4MC4yMDMsNDIuNjY3LDE5Miw0Mi42Njd6Ii8+CiAgICAgICAgPHBhdGggZD0iTTIxLjMzMyw4NS4zMzNjMTEuNzk3LDAsMjEuMzMzLTkuNTU3LDIxLjMzMy0yMS4zMzNWNDIuNjY3YzAtMTEuNzc2LTkuNTM2LTIxLjMzMy0yMS4zMzMtMjEuMzMzIEM5LjUzNiwyMS4zMzMsMCwzMC44OTEsMCw0Mi42NjdWNjRDMCw3NS43NzYsOS41MzYsODUuMzMzLDIxLjMzMyw4NS4zMzN6Ii8+CiAgICAgICAgPHBhdGggZD0iTTMyMCw4NS4zMzNjLTExLjc5NywwLTIxLjMzMyw5LjU1Ny0yMS4zMzMsMjEuMzMzVjEyOGMwLDExLjc3Niw5LjUzNiwyMS4zMzMsMjEuMzMzLDIxLjMzM3MyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzMyB2LTIxLjMzM0MzNDEuMzMzLDk0Ljg5MSwzMzEuNzk3LDg1LjMzMywzMjAsODUuMzMzeiIvPgogICAgICAgIDxwYXRoIGQ9Ik0yOTguNjY3LDQyLjY2N0gzMjBjMTEuNzk3LDAsMjEuMzMzLTkuNTU3LDIxLjMzMy0yMS4zMzNTMzMxLjc5NywwLDMyMCwwaC0yMS4zMzNjLTExLjc5NywwLTIxLjMzMyw5LjU1Ny0yMS4zMzMsMjEuMzMzIFMyODYuODY5LDQyLjY2NywyOTguNjY3LDQyLjY2N3oiLz4KICAgICAgICA8cGF0aCBkPSJNNDIuNjY3LDI1NmMwLTExLjc3Ni05LjUzNi0yMS4zMzMtMjEuMzMzLTIxLjMzM0M5LjUzNiwyMzQuNjY3LDAsMjQ0LjIyNCwwLDI1NnYyMS4zMzMgYzAsMTEuNzc2LDkuNTM2LDIxLjMzMywyMS4zMzMsMjEuMzMzYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzVjI1NnoiLz4KICAgICAgICA8cGF0aCBkPSJNMTA2LjY2NywwSDg1LjMzM0M3My41MzYsMCw2NCw5LjU1Nyw2NCwyMS4zMzNzOS41MzYsMjEuMzMzLDIxLjMzMywyMS4zMzNoMjEuMzMzYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzIFMxMTguNDY0LDAsMTA2LjY2NywweiIvPgogICAgICAgIDxwYXRoIGQ9Ik04NS4zMzMsMjk4LjY2N0g2NGMtMTEuNzk3LDAtMjEuMzMzLDkuNTU3LTIxLjMzMywyMS4zMzNTNTIuMjAzLDM0MS4zMzMsNjQsMzQxLjMzM2gyMS4zMzMgYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzUzk3LjEzMSwyOTguNjY3LDg1LjMzMywyOTguNjY3eiIvPgogICAgICAgIDxwYXRoIGQ9Ik00OTAuNjY3LDE3MC42NjdIMzIwYy0xMS43OTcsMC0yMS4zMzMsOS41NTctMjEuMzMzLDIxLjMzM3YyMS4zMzN2MjEuMzMzdjY0aC04NS4zMzNIMTkyaC0yMS4zMzMgYy0xMS43OTcsMC0yMS4zMzMsOS41NTctMjEuMzMzLDIxLjMzM3M5LjUzNiwyMS4zMzMsMjEuMzMzLDIxLjMzM3YxNDkuMzMzYzAsMTEuNzc2LDkuNTM2LDIxLjMzMywyMS4zMzMsMjEuMzMzaDI5OC42NjcgYzExLjc5NywwLDIxLjMzMy05LjU1NywyMS4zMzMtMjEuMzMzVjE5MkM1MTIsMTgwLjIyNCw1MDIuNDY0LDE3MC42NjcsNDkwLjY2NywxNzAuNjY3eiIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4=)
    no-repeat center center;
}

#e_unlink {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIj4KICA8Zz4KICAgIDxwYXRoIGQ9Ik0xNi4yMDEsMjAuMzg2bDkuNzE5LDkuNzIxYzEuMTIsMS4xMTgsMi45MzUsMS4xMTgsNC4wNTQsMGMxLjExOC0xLjEyMSwxLjExOC0yLjkzMywwLTQuMDU1bC05LjY3OS05LjY3NyBjLTAuMDAyLTAuMDAzLTAuMDA0LTAuMDA1LTAuMDA2LTAuMDA4cy0wLjAwNS0wLjAwNC0wLjAwOC0wLjAwNmwtMC4wMjYtMC4wMjZsLTAuMDAzLDAuMDAzYy0xLjEyMi0xLjA4NS0yLjkwOS0xLjA3Ny00LjAxNywwLjAzIGMtMS4xMDcsMS4xMDgtMS4xMTUsMi44OTUtMC4wMyw0LjAxNUwxNi4yMDEsMjAuMzg2eiIvPgogICAgPHBhdGggZD0iTTMyLjg5OCwxNi41NDZsMy41NTgsMTMuMjc3YzAuNDEsMS41MjksMS45ODEsMi40MzcsMy41MSwyLjAyNmMxLjUyNy0wLjQwOSwyLjQzNS0xLjk4MSwyLjAyNy0zLjUxbC0zLjU0NS0xMy4yMjQgYzAtMC4wMDIsMC0wLjAwNS0wLjAwMS0wLjAwN3MtMC4wMDItMC4wMDQtMC4wMDMtMC4wMDdsLTAuMDExLTAuMDRsLTAuMDA0LDAuMDAxYy0wLjQyOS0xLjUtMS45OC0yLjM4Ny0zLjQ5My0xLjk4MiBjLTEuNTEzLDAuNDA1LTIuNDEzLDEuOTQ5LTIuMDM1LDMuNDYzTDMyLjg5OCwxNi41NDZ6Ii8+CiAgICA8cGF0aCBkPSJNMTYuMDU0LDM5LjQyM2wtMC4wMDEsMC4wMDVsMC4wNDYsMC4wMTJjMCwwLDAuMDAxLDAsMC4wMDEsMGwwLjAwMSwwbDEzLjIyOSwzLjU0NGMxLjUzLDAuNDEsMy4xMDEtMC40OTgsMy41MTEtMi4wMjUgYzAuNDEtMS41MjktMC40OTgtMy4xMDEtMi4wMjYtMy41MUwxNy42LDMzLjkwOGMtMC4wMDUtMC4wMDItMC4wMS0wLjAwNS0wLjAxNi0wLjAwNnMtMC4wMTEtMC4wMDEtMC4wMTctMC4wMDNsLTAuMDMtMC4wMDggbC0wLjAwMSwwLjAwM2MtMS41MTUtMC4zNzctMy4wNTgsMC41MjMtMy40NjMsMi4wMzVDMTMuNjY4LDM3LjQ0MiwxNC41NTUsMzguOTkyLDE2LjA1NCwzOS40MjN6Ii8+CiAgICA8cGF0aCBkPSJNODMuNzk4LDc5LjYxM2wtOS43Mi05LjcyYy0xLjExOS0xLjExOS0yLjkzNC0xLjExOS00LjA1MywwYy0xLjExOCwxLjEyLTEuMTE4LDIuOTMzLDAsNC4wNTVsOS42NzksOS42NzcgYzAuMDAyLDAuMDAzLDAuMDA0LDAuMDA1LDAuMDA2LDAuMDA4YzAuMDAzLDAuMDAyLDAuMDA1LDAuMDA0LDAuMDA4LDAuMDA2bDAuMDI2LDAuMDI2bDAuMDAzLTAuMDAzIGMxLjEyMiwxLjA4NSwyLjkwOCwxLjA3Nyw0LjAxNy0wLjAzYzEuMTA3LTEuMTA4LDEuMTE1LTIuODk1LDAuMDMtNC4wMTZMODMuNzk4LDc5LjYxM3oiLz4KICAgIDxwYXRoIGQ9Ik02Ny4xMDEsODMuNDU0bC0zLjU1OS0xMy4yNzdjLTAuNDEtMS41MjktMS45OC0yLjQzNi0zLjUxLTIuMDI2Yy0xLjUzLDAuNDA5LTIuNDM2LDEuOTgxLTIuMDI3LDMuNTA5bDMuNTQ2LDEzLjIzMSBjMCwwLDAsMC4wMDEsMCwwLjAwMWMwLDAuMDAxLDAsMC4wMDEsMCwwLjAwMWwwLjAxMiwwLjA0NWwwLjAwNS0wLjAwMWMwLjQyOCwxLjUwMSwxLjk4LDIuMzg3LDMuNDkzLDEuOTgzIGMxLjUxMy0wLjQwNiwyLjQxMi0xLjk1LDIuMDM0LTMuNDYzTDY3LjEwMSw4My40NTR6Ii8+CiAgICA8cGF0aCBkPSJNODMuOTQzLDYwLjU3N2wwLjAwMS0wLjAwNGwtMC4wNDEtMC4wMTFjLTAuMDAyLDAtMC4wMDMtMC4wMDEtMC4wMDUtMC4wMDJjLTAuMDAyLDAtMC4wMDMsMC0wLjAwNS0wLjAwMWwtMTMuMjI2LTMuNTQ0IGMtMS41My0wLjQxLTMuMSwwLjQ5OS0zLjUxMSwyLjAyNmMtMC40MDksMS41MjksMC40OTgsMy4xLDIuMDI3LDMuNTExbDEzLjIyNCwzLjU0MmMwLjAwMiwwLjAwMSwwLjAwNCwwLjAwMiwwLjAwNiwwLjAwMiBjMC4wMDEsMC4wMDEsMC4wMDUsMCwwLjAwNywwLjAwMWwwLjA0LDAuMDExbDAuMDAxLTAuMDA0YzEuNTE0LDAuMzc4LDMuMDU4LTAuNTIyLDMuNDYyLTIuMDM1IEM4Ni4zMzEsNjIuNTU3LDg1LjQ0Myw2MS4wMDYsODMuOTQzLDYwLjU3N3oiLz4KICAgIDxwYXRoIGQ9Ik00OC4yMTIsNTEuNzU2Yy03LjU1Mi03LjU1Mi0xOS42NDgtNy43OS0yNy40ODYtMC43MTNsLTAuMDE5LTAuMDE5TDEwLjYxLDYxLjEyMWMtNy43OTcsNy43OTctNy43OTcsMjAuNDQsMCwyOC4yMzcgYzcuNzk3LDcuNzk4LDIwLjQzOSw3Ljc5OCwyOC4yMzcsMGwxMC4wOTgtMTAuMDk4bC0wLjAxOS0wLjAxOUM1Ni4wMDEsNzEuNDA0LDU1Ljc2NCw1OS4zMDgsNDguMjEyLDUxLjc1NnogTTQxLjY1OSw3Mi41NTggbC0wLjYxOSwwLjYxOWwtMC4wMDEsMC4wMDFsLTAuMDAxLDBsLTkuMDA1LDkuMDA1bC0wLjAwMSwwLjAwMWMtMy45MzUsMy45MzUtMTAuMzE0LDMuOTM1LTE0LjI0OCwwcy0zLjkzNS0xMC4zMTQsMC0xNC4yNDggbDAuMDAxLTAuMDAxbDkuMDA1LTkuMDA2bDAuMDAxLTAuMDAxbDAuMDAxLTAuMDAxbDAuNjE5LTAuNjE5bDAuMDI5LDAuMDI4YzMuOTU5LTMuMzI5LDkuODc0LTMuMTM0LDEzLjYsMC41OTEgYzMuNzI2LDMuNzI2LDMuOTIxLDkuNjQyLDAuNTkxLDEzLjZMNDEuNjU5LDcyLjU1OHoiLz4KICAgIDxwYXRoIGQ9Ik04OS4zODksMTAuNjQxYy03LjU1Mi03LjU1Mi0xOS42NDgtNy43OS0yNy40ODYtMC43MTNsLTAuMDE5LTAuMDE5TDUxLjc4NywyMC4wMDZjLTcuNzk3LDcuNzk3LTcuNzk3LDIwLjQ0LDAsMjguMjM3IGM3Ljc5Nyw3Ljc5OCwyMC40MzksNy43OTgsMjguMjM3LDBsMTAuMDk4LTEwLjA5OGwtMC4wMTktMC4wMTlDOTcuMTc4LDMwLjI4OSw5Ni45NDEsMTguMTkzLDg5LjM4OSwxMC42NDF6IE04Mi44MzYsMzEuNDQzIGwtMC42MTksMC42MTlsLTAuMDAxLDAuMDAxbC0wLjAwMSwwbC05LjAwNSw5LjAwNWwtMC4wMDEsMC4wMDFjLTMuOTM1LDMuOTM1LTEwLjMxNCwzLjkzNS0xNC4yNDgsMCBjLTMuOTM1LTMuOTM1LTMuOTM1LTEwLjMxNCwwLTE0LjI0OGwwLjAwMS0wLjAwMWw5LjAwNS05LjAwNmMwLDAsMCwwLDAuMDAxLTAuMDAxbDAuMDAxLTAuMDAxbDAuNjE5LTAuNjE5bDAuMDI5LDAuMDI4IGMzLjk1OS0zLjMyOSw5Ljg3NC0zLjEzNCwxMy42LDAuNTkxczMuOTIxLDkuNjQyLDAuNTkxLDEzLjZMODIuODM2LDMxLjQ0M3oiLz4KICA8L2c+Cjwvc3ZnPg==)
    no-repeat center center;
}

#e_floatleft {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTEuNSAwQzAuNjcxNTczIDAgMCAwLjY3MTU3MyAwIDEuNVY1LjVDMCA2LjMyODQzIDAuNjcxNTczIDcgMS41IDdINS41QzYuMzI4NDMgNyA3IDYuMzI4NDMgNyA1LjVWMS41QzcgMC42NzE1NzMgNi4zMjg0MyAwIDUuNSAwSDEuNVoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNOSAySDE1VjFIOVYyWiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik05IDZIMTVWNUg5VjZaIiBmaWxsPSIjMDAwMDAwIi8+CiAgPHBhdGggZD0iTTAgMTBIMTVWOUgwVjEwWiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0wIDE0SDE1VjEzSDBWMTRaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPg==)
    no-repeat center center;
  background-position: 4px 6px !important;
}

#e_floatright {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTUgMTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTTkuNSAwQzguNjcxNTcgMCA4IDAuNjcxNTczIDggMS41VjUuNUM4IDYuMzI4NDMgOC42NzE1NyA3IDkuNSA3SDEzLjVDMTQuMzI4NCA3IDE1IDYuMzI4NDMgMTUgNS41VjEuNUMxNSAwLjY3MTU3MyAxNC4zMjg0IDAgMTMuNSAwSDkuNVoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMCAySDZWMUgwVjJaIiBmaWxsPSIjMDAwMDAwIi8+CiAgPHBhdGggZD0iTTAgNkg2VjVIMFY2WiIgZmlsbD0iIzAwMDAwMCIvPgogIDxwYXRoIGQ9Ik0wIDEwSDE1VjlIMFYxMFoiIGZpbGw9IiMwMDAwMDAiLz4KICA8cGF0aCBkPSJNMCAxNEgxNUYxM0gwVjE0WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4=)
    no-repeat center center;
  background-position: 3px 6px !important;
}

#e_pasteword {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTkyIDE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSJub25lIj4KICA8cGF0aCBkPSJNNTYgMzBjMC0xLjY2MiAxLjMzOC0zIDMtM2gxMDhjMS42NjIgMCAzIDEuMzM4IDMgM3YxMzJjMCAxLjY2Mi0xLjMzOCAzLTMgM0g1OWMtMS42NjIgMC0zLTEuMzM4LTMtM3YtMzJtMC02OFYzMCIgc3R5bGU9ImZpbGwtb3BhY2l0eTouNDAyNjU4O3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDoxMjtzdHJva2UtbGluZWNhcDpyb3VuZDtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIi8+CiAgPHJlY3Qgd2lkdGg9IjY4IiBoZWlnaHQ9IjY4IiB4PSItNTguMSIgeT0iNDAuMyIgcng9IjMiIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5Oi40MDI2NTg7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjpzdHJva2UgZmlsbCBtYXJrZXJzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4MC4xIDIxLjcpIi8+CiAgPHBhdGggZD0iTTU1Ljk0NCA1OC43OTFIMTcwTTE3MCA5Nkg5MC4zMjhNMTY5IDEzMy4yMUg1NS45NDQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIvPgogIDxwYXRoIGQ9Im03MyA4Mi04LjUgMjhtMCAwTDU2IDgybC04LjUgMjhNMzkgODJsOC41IDI4IiBzdHlsZT0iZm9udC12YXJpYXRpb24tc2V0dGluZ3M6bm9ybWFsO3ZlY3Rvci1lZmZlY3Q6bm9uZTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2UtZGFzaG9mZnNldDowO3N0cm9rZS1vcGFjaXR5OjE7LWlua3NjYXBlLXN0cm9rZTpub25lO3N0b3AtY29sb3I6IzAwMCIvPgo8L3N2Zz4=)
    no-repeat center center;
}

#e_imagen, #e_attachn {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgZmlsbD0iIzAwMDAwMCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iQ2FwYV8xIgogICB3aWR0aD0iMTZweCIKICAgaGVpZ2h0PSIxNnB4IgogICB2aWV3Qm94PSIwIDAgNDM3LjY5OSA0MzcuNjk5IgogICBzb2RpcG9kaTpkb2NuYW1lPSIyMDI1LTAyLTEyLTYzMjU0LnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iMS4yNjEyNSIKICAgICBpbmtzY2FwZTpjeD0iMzk5LjYwMzU3IgogICAgIGlua3NjYXBlOmN5PSIzOTYuODI4NTQiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIyMTEyIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExODgiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjI4MTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ijk1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iQ2FwYV8xIiAvPgogIDxnCiAgICAgaWQ9ImcxIj4KICAgIDxwYXRoCiAgICAgICBkPSJNMzcyLjU3OCw2My4xMDFjLTQxLjE4LTMyLjMzMi05NS43NzUtNTAuMTM4LTE1My43MjctNTAuMTM4Yy01Ny45NTIsMC0xMTIuNTQ3LDE3LjgwNi0xNTMuNzI4LDUwLjEzOCBDMjMuMTI3LDk2LjA3MywwLDE0MC4xNjIsMCwxODcuMjQ0YzAsNDcuNjg4LDI0LjUzNiw5My4yNDYsNjcuNTg5LDEyNi4wMjdsLTIwLjgxLDk3LjY1NmMtMC44OTMsNC4xODYsMC42MjksOC41MTgsMy45NCwxMS4yMjcgYzIuMDc5LDEuNzAxLDQuNjQ1LDIuNTgyLDcuMjM3LDIuNTgyYzEuNTM4LDAsMy4wODctMC4zMTEsNC41NDgtMC45NDNsMTQ0LjA2My02Mi41MzljNC4xMDQsMC4xOCw4LjIyMywwLjI3MSwxMi4yODIsMC4yNzEgYzU3Ljk1MiwwLDExMi41NDUtMTcuODA3LDE1My43MjctNTAuMTM5YzQxLjk5Ni0zMi45NzMsNjUuMTIzLTc3LjA2MSw2NS4xMjMtMTI0LjE0NCBDNDM3LjcwMSwxNDAuMTYyLDQxNC41NzQsOTYuMDczLDM3Mi41NzgsNjMuMTAxeiBNMjE4Ljg1MiwzMDQuMzkzYy0xNS43MDksMC0yOC40OS0xMi43OC0yOC40OS0yOC40ODkgYzAtMTUuNzEsMTIuNzgxLTI4LjQ5MSwyOC40OS0yOC40OTFjMTUuNzA4LDAsMjguNDksMTIuNzgxLDI4LjQ5LDI4LjQ5MUMyNDcuMzQyLDI5MS42MTIsMjM0LjU2MSwzMDQuMzkzLDIxOC44NTIsMzA0LjM5M3ogTTI0MC43MjEsMjE1LjU3Yy0wLjc3MSwxMS40NDYtMTAuMzY3LDIwLjQxNy0yMS44NDQsMjAuNDE3Yy0wLjQ5OSwwLTEuMDAyLTAuMDE2LTEuNTA1LTAuMDUxIGMtMTAuODY3LTAuNzM3LTE5LjYyNC05LjQ5OC0yMC4zNTUtMjAuMzc2bC02LjkzMS0xMDIuMDU2Yy0wLjUyMi03LjY4NiwxLjk4LTE1LjExOCw3LjA0OS0yMC45MjYgYzUuMDY4LTUuODA2LDEyLjA5Mi05LjI5LDE5Ljc3OS05LjgxM2MwLjY1My0wLjA0NCwxLjMxMy0wLjA2NiwxLjk2Mi0wLjA2NmMxNS4xMSwwLDI3Ljc1NywxMS44MTMsMjguNzc4LDI2Ljg5NCBDMjQ4LjIwMiwxMTYuMiwyNDAuNzIxLDIxNS41NywyNDAuNzIxLDIxNS41N3oiCiAgICAgICBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMTk5LCAwKTsiCiAgICAgICBpZD0icGF0aDEiIC8+CiAgPC9nPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzOTUuMjQyODEsNDMwLjQwNjI2IGMgLTEyLjYxOTQxLC0xLjQzNDIzIC0yNC45Mjk3LC0xMC4xMTcyOSAtMzAuNzQzMjgsLTIxLjY4NDc1IC0zLjM2NjAxLC02LjY5NzQ3IC0zLjY5OTk3LC0xMC4xNDQ2OSAtMTAuMDk2NTEsLTEwNC4yMTk0OCAtMy40ODQ1OSwtNTEuMjQ4NDEgLTYuMzM1NjMsLTk2LjU4ODIzIC02LjMzNTYzLC0xMDAuNzU1MTYgMCwtOS4xMTcwNyAxLjM2Nzk2LC0xNC45MzA1MiA1LjQ5OTIyLC0yMy4zNzAyNiA5LjYyOTQ0LC0xOS42NzE5NSAzMi4zMzY4MSwtMzEuNTU2MzggNTMuOTAxMzUsLTI4LjIxMDUyIDE2LjUyMDM0LDIuNTYzMjEgMzEuMTU1MzEsMTMuMDYwNiAzOC45MDMxNywyNy45MDQ1MSA2Ljk3MzY1LDEzLjM2MDYyIDcuMDMwODUsMTYuOTYxODkgMS41NTM3MSw5Ny44MjgzMSAtNS42NDc1Miw4My4zODE3NyAtOC42MjQ3MSwxMTkuNzk5MDcgLTEwLjIxMzU2LDEyNC45MzMzIC01LjY3ODcyLDE4LjM1MDI1IC0yMy4yNDkxLDI5Ljc1ODM5IC00Mi40Njg0NywyNy41NzQwNSB6IgogICAgIGlkPSJwYXRoOSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMjA0NzksNTU0LjIyNjgxIGMgLTIwLjU0MjA3LC01LjM4NTQgLTM1LjIzNTAzLC0yMi4wMjkxNSAtMzguMzY5MTMsLTQzLjQ2MzM5IC0zLjQ4MDY1LC0yMy44MDQyNCAxMi4xNTY1OCwtNDguMjI4MDEgMzUuNzAzNDksLTU1Ljc2NTI2IDcuMzc2OSwtMi4zNjEzMSAxOC43ODEyMiwtMi44Mzk3MyAyNi41NDA3NCwtMS4xMTM0IDE2LjU2OTA4LDMuNjg2MjcgMzEuMjQ2OTcsMTYuNDIwMDIgMzcuMjIwNjUsMzIuMjkwNjUgMTIuNjUyNzQsMzMuNjE1MjMgLTEyLjY0MTgsNjkuODA5NDEgLTQ4LjYyNTU4LDY5LjU3ODc1IC0zLjk2OTMxLC0wLjAyNTQgLTkuMTcxODQsLTAuNjYyNjUgLTEyLjQ3MDE3LC0xLjUyNzM1IHoiCiAgICAgaWQ9InBhdGgxMCIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMDg4NjIsNTU0LjE5NzMgYyAtMjQuOTUzMjQsLTYuNTM3NzIgLTQxLjg5NDU1LC0zMS41MzI0OSAtMzguMjUyOTYsLTU2LjQzNzQzIDUuMjY0NTIsLTM2LjAwNDI4IDQzLjQ0NTkzLC01NS43OTYzMiA3NS4zMjMzMiwtMzkuMDQ1MjMgMTguNjIyMzksOS43ODU3OSAyOS45ODMzNCwzMS42ODIzMSAyNy4wMDUzNiw1Mi4wNDg3OCAtNC41MzkyNSwzMS4wNDQxNSAtMzQuMzE4NjcsNTEuMjMwMjEgLTY0LjA3NTcyLDQzLjQzMzg4IHoiCiAgICAgaWQ9InBhdGgxMSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgo8L3N2Zz4K)
    no-repeat center center !important;
}

#e_url {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xLjkgOWMwLTEuMTYuOTQtMi4xIDIuMS0yLjFoNFY1SDRDMS43OSA1IDAgNi43OSAwIDlzMS43OSA0IDQgNGg0di0xLjlINGMtMS4xNiAwLTIuMS0uOTQtMi4xLTIuMXpNMTQgNWgtNHYxLjloNGMxLjE2IDAgMi4xLjk0IDIuMSAyLjEgMCAxLjE2LS45NCAyLjEtMi4xIDIuMWgtNFYxM2g0YzIuMjEgMCA0LTEuNzkgNC00cy0xLjc5LTQtNC00em0tOCA1aDZWOEg2djJ6Ii8+Cjwvc3ZnPgo=)
    no-repeat center center;
}

#e_cst1_sup {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSA0My42NDQ1IDI4LjE0MDYgQyA0NC42OTkyIDI4LjE0MDYgNDUuMzU1NSAyNy40NjA5IDQ1LjM1NTUgMjYuNDc2NiBMIDQ1LjM1NTUgMTAuNDQ1MyBDIDQ1LjM1NTUgOS4yNzM1IDQ0LjY1MjQgOC41NzAzIDQzLjUwMzkgOC41NzAzIEMgNDIuNDcyNyA4LjU3MDMgNDEuOTU3MCA4Ljk0NTMgNDEuMjc3MyA5LjQzNzUgTCAzNy41MjczIDExLjk5MjIgQyAzNi44NzExIDEyLjQzNzUgMzYuNTg5OCAxMi44NTk0IDM2LjU4OTggMTMuMzc1MCBDIDM2LjU4OTggMTQuMTQ4NCAzNy4xNzU4IDE0LjczNDQgMzcuOTAyNCAxNC43MzQ0IEMgMzguMzcxMSAxNC43MzQ0IDM4LjY3NTggMTQuNTkzNyAzOS4xNDQ1IDE0LjI2NTcgTCA0MS44NjMzIDEyLjQzNzUgTCA0MS45MzM2IDEyLjQzNzUgTCA0MS45MzM2IDI2LjQ3NjYgQyA0MS45MzM2IDI3LjQ2MDkgNDIuNjM2NyAyOC4xNDA2IDQzLjY0NDUgMjguMTQwNiBaIE0gMTIuNzMwNSA0Ny40Mjk3IEMgMTMuOTAyNCA0Ny40Mjk3IDE0LjQ2NDkgNDYuOTYwOSAxNC45MzM2IDQ1LjY3MTkgTCAxNy45MzM2IDM3LjM3NTAgTCAzMS43NjE3IDM3LjM3NTAgTCAzNC43ODUxIDQ1LjY3MTkgQyAzNS4yMzA1IDQ2Ljk2MDkgMzUuODE2NCA0Ny40Mjk3IDM2Ljk4ODMgNDcuNDI5NyBDIDM4LjI1MzkgNDcuNDI5NyAzOS4wOTc2IDQ2LjY3OTcgMzkuMDk3NiA0NS41MDc4IEMgMzkuMDk3NiA0NS4xMDk0IDM5LjAyNzMgNDQuNzU3OCAzOC44Mzk4IDQ0LjI0MjIgTCAyNy44NDc2IDE0Ljk5MjIgQyAyNy4zMDg2IDEzLjUzOTEgMjYuMzQ3NiAxMi44MzU5IDI0Ljg0NzYgMTIuODM1OSBDIDIzLjM5NDUgMTIuODM1OSAyMi40MzM2IDEzLjUzOTEgMjEuOTE4MCAxNC45Njg4IEwgMTAuOTAyNCA0NC4yNjU2IEMgMTAuNzE0OSA0NC43ODEzIDEwLjY0NDUgNDUuMTMyOCAxMC42NDQ1IDQ1LjUzMTMgQyAxMC42NDQ1IDQ2LjcwMzEgMTEuNDQxNCA0Ny40Mjk3IDEyLjczMDUgNDcuNDI5NyBaIE0gMTkuMDgyMCAzMy43ODkxIEwgMjQuNzc3MyAxOC4wMTU3IEwgMjQuOTE4MCAxOC4wMTU3IEwgMzAuNTg5OCAzMy43ODkxIFoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

#e_cst1_sub {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgNTYgNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBhdGggZD0iTSA5LjQ4NDQgNDIuMzMyMCBDIDEwLjY1NjMgNDIuMzMyMCAxMS4yMTg4IDQxLjg2MzMgMTEuNjg3NSA0MC41NzQyIEwgMTQuNjg3NSAzMi4yNzc0IEwgMjguNTE1NiAzMi4yNzc0IEwgMzEuNTM5MCA0MC41NzQyIEMgMzEuOTg0NCA0MS44NjMzIDMyLjU3MDMgNDIuMzMyMCAzMy43NDIyIDQyLjMzMjAgQyAzNS4wMDc4IDQyLjMzMjAgMzUuODUxNiA0MS41ODIwIDM1Ljg1MTYgNDAuNDEwMiBDIDM1Ljg1MTYgNDAuMDExNyAzNS43ODEyIDM5LjY2MDIgMzUuNTkzNyAzOS4xNDQ1IEwgMjQuNjAxNiA5Ljg5NDUgQyAyNC4wNjI1IDguNDQxNCAyMy4xMDE2IDcuNzM4MyAyMS42MDE2IDcuNzM4MyBDIDIwLjE0ODQgNy43MzgzIDE5LjE4NzUgOC40NDE0IDE4LjY3MTkgOS44NzExIEwgNy42NTYzIDM5LjE2ODAgQyA3LjQ2ODggMzkuNjgzNiA3LjM5ODQgNDAuMDM1MiA3LjM5ODQgNDAuNDMzNiBDIDcuMzk4NCA0MS42MDU1IDguMTk1MyA0Mi4zMzIwIDkuNDg0NCA0Mi4zMzIwIFogTSAxNS44MzU5IDI4LjY5MTQgTCAyMS41MzEyIDEyLjkxODAgTCAyMS42NzE5IDEyLjkxODAgTCAyNy4zNDM3IDI4LjY5MTQgWiBNIDQ2Ljg5MDYgNDguMjYxNyBDIDQ3LjkyMTkgNDguMjYxNyA0OC42MDE2IDQ3LjU4MjEgNDguNjAxNiA0Ni41OTc3IEwgNDguNjAxNiAzMC41NjY0IEMgNDguNjAxNiAyOS4zOTQ1IDQ3Ljg5ODQgMjguNjkxNCA0Ni43MjY2IDI4LjY5MTQgQyA0NS42OTUzIDI4LjY5MTQgNDUuMjAzMSAyOS4wNjY0IDQ0LjUgMjkuNTU4NiBMIDQwLjc1IDMyLjExMzMgQyA0MC4wOTM3IDMyLjU4MjEgMzkuODM1OSAzMi45ODA1IDM5LjgzNTkgMzMuNDk2MSBDIDM5LjgzNTkgMzQuMjY5NSA0MC4zOTg0IDM0Ljg1NTUgNDEuMTI1MCAzNC44NTU1IEMgNDEuNTkzNyAzNC44NTU1IDQxLjg5ODQgMzQuNzE0OCA0Mi4zNjcyIDM0LjM4NjcgTCA0NS4wODU5IDMyLjU1ODYgTCA0NS4xNzk3IDMyLjU1ODYgTCA0NS4xNzk3IDQ2LjU5NzcgQyA0NS4xNzk3IDQ3LjU4MjEgNDUuODU5NCA0OC4yNjE3IDQ2Ljg5MDYgNDguMjYxNyBaIi8+Cjwvc3ZnPg==)
    no-repeat center center;
}

#fastposteditor #spanButtonPlaceholder {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==)
    no-repeat center center !important;
}

.b2r #e_sml {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMTh2MThIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik02IDhjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXptNiAwYy41NSAwIDEtLjQ1IDEtMXMtLjQ1LTEtMS0xLTEgLjQ1LTEgMSAuNDUgMSAxIDF6bS0zIDUuNWMyLjE0IDAgMy45Mi0xLjUgNC4zOC0zLjVINC42MmMuNDYgMiAyLjI0IDMuNSA0LjM4IDMuNXpNOSAxQzQuNTcgMSAxIDQuNTggMSA5czMuNTcgOCA4IDggOC0zLjU4IDgtOC0zLjU4LTgtOC04em0wIDE0LjVjLTMuNTkgMC02LjUtMi45MS02LjUtNi41UzUuNDEgMi41IDkgMi41czYuNSAyLjkxIDYuNSA2LjUtMi45MSA2LjUtNi41IDYuNXoiLz4KPC9zdmc+Cg==)
    no-repeat center center;
}

.b2r #e_image {
  background: transparent
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0yMSAxOVY1YzAtMS4xLS45LTItMi0ySDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMy41bDIuNSAzLjAxTDE0LjUgMTJsNC41IDZINWwzLjUtNC41eiIvPgo8L3N2Zz4K)
    no-repeat center center;
}

.b2r #e_attach {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjMDAwMDAwIiB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgZGF0YS1uYW1lPSJMYXllciAyIj4KICAgIDxnIGRhdGEtbmFtZT0iYXR0YWNoIj4KICAgICAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBvcGFjaXR5PSIwIi8+CiAgICAgIDxwYXRoIGQ9Ik05LjI5IDIxYTYuMjMgNi4yMyAwIDAgMS00LjQzLTEuODggNiA2IDAgMCAxLS4yMi04LjQ5TDEyIDMuMkE0LjExIDQuMTEgMCAwIDEgMTUgMmE0LjQ4IDQuNDggMCAwIDEgMy4xOSAxLjM1IDQuMzYgNC4zNiAwIDAgMSAuMTUgNi4xM2wtNy40IDcuNDNhMi41NCAyLjU0IDAgMCAxLTEuODEuNzUgMi43MiAyLjcyIDAgMCAxLTEuOTUtLjgyIDIuNjggMi42OCAwIDAgMS0uMDgtMy43N2w2LjgzLTYuODZhMSAxIDAgMCAxIDEuMzcgMS40MWwtNi44MyA2Ljg2YS42OC42OCAwIDAgMCAuMDguOTUuNzguNzggMCAwIDAgLjUzLjIzLjU2LjU2IDAgMCAwIC40LS4xNmw3LjM5LTcuNDNhMi4zNiAyLjM2IDAgMCAwLS4xNS0zLjMxIDIuMzggMi4zOCAwIDAgMC0zLjI3LS4xNUw2LjA2IDEyYTQgNCAwIDAgMCAuMjIgNS42NyA0LjIyIDQuMjIgMCAwIDAgMyAxLjI5IDMuNjcgMy42NyAwIDAgMCAyLjYxLTEuMDZsNy4zOS03LjQzYTEgMSAwIDEgMSAxLjQyIDEuNDFsLTcuMzkgNy40M0E1LjY1IDUuNjUgMCAwIDEgOS4yOSAyMXoiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==)
    no-repeat center center;
}

#e_imagen, #e_attachn {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgZmlsbD0iIzAwMDAwMCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iQ2FwYV8xIgogICB3aWR0aD0iMTZweCIKICAgaGVpZ2h0PSIxNnB4IgogICB2aWV3Qm94PSIwIDAgNDM3LjY5OSA0MzcuNjk5IgogICBzb2RpcG9kaTpkb2NuYW1lPSIyMDI1LTAyLTEyLTYzMjU0LnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iMS4yNjEyNSIKICAgICBpbmtzY2FwZTpjeD0iMzk5LjYwMzU3IgogICAgIGlua3NjYXBlOmN5PSIzOTYuODI4NTQiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIyMTEyIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExODgiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjI4MTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ijk1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iQ2FwYV8xIiAvPgogIDxnCiAgICAgaWQ9ImcxIj4KICAgIDxwYXRoCiAgICAgICBkPSJNMzcyLjU3OCw2My4xMDFjLTQxLjE4LTMyLjMzMi05NS43NzUtNTAuMTM4LTE1My43MjctNTAuMTM4Yy01Ny45NTIsMC0xMTIuNTQ3LDE3LjgwNi0xNTMuNzI4LDUwLjEzOCBDMjMuMTI3LDk2LjA3MywwLDE0MC4xNjIsMCwxODcuMjQ0YzAsNDcuNjg4LDI0LjUzNiw5My4yNDYsNjcuNTg5LDEyNi4wMjdsLTIwLjgxLDk3LjY1NmMtMC44OTMsNC4xODYsMC42MjksOC41MTgsMy45NCwxMS4yMjcgYzIuMDc5LDEuNzAxLDQuNjQ1LDIuNTgyLDcuMjM3LDIuNTgyYzEuNTM4LDAsMy4wODctMC4zMTEsNC41NDgtMC45NDNsMTQ0LjA2My02Mi41MzljNC4xMDQsMC4xOCw4LjIyMywwLjI3MSwxMi4yODIsMC4yNzEgYzU3Ljk1MiwwLDExMi41NDUtMTcuODA3LDE1My43MjctNTAuMTM5YzQxLjk5Ni0zMi45NzMsNjUuMTIzLTc3LjA2MSw2NS4xMjMtMTI0LjE0NCBDNDM3LjcwMSwxNDAuMTYyLDQxNC41NzQsOTYuMDczLDM3Mi41NzgsNjMuMTAxeiBNMjE4Ljg1MiwzMDQuMzkzYy0xNS43MDksMC0yOC40OS0xMi43OC0yOC40OS0yOC40ODkgYzAtMTUuNzEsMTIuNzgxLTI4LjQ5MSwyOC40OS0yOC40OTFjMTUuNzA4LDAsMjguNDksMTIuNzgxLDI4LjQ5LDI4LjQ5MUMyNDcuMzQyLDI5MS42MTIsMjM0LjU2MSwzMDQuMzkzLDIxOC44NTIsMzA0LjM5M3ogTTI0MC43MjEsMjE1LjU3Yy0wLjc3MSwxMS40NDYtMTAuMzY3LDIwLjQxNy0yMS44NDQsMjAuNDE3Yy0wLjQ5OSwwLTEuMDAyLTAuMDE2LTEuNTA1LTAuMDUxIGMtMTAuODY3LTAuNzM3LTE5LjYyNC05LjQ5OC0yMC4zNTUtMjAuMzc2bC02LjkzMS0xMDIuMDU2Yy0wLjUyMi03LjY4NiwxLjk4LTE1LjExOCw3LjA0OS0yMC45MjYgYzUuMDY4LTUuODA2LDEyLjA5Mi05LjI5LDE5Ljc3OS05LjgxM2MwLjY1My0wLjA0NCwxLjMxMy0wLjA2NiwxLjk2Mi0wLjA2NmMxNS4xMSwwLDI3Ljc1NywxMS44MTMsMjguNzc4LDI2Ljg5NCBDMjQ4LjIwMiwxMTYuMiwyNDAuNzIxLDIxNS41NywyNDAuNzIxLDIxNS41N3oiCiAgICAgICBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMTk5LCAwKTsiCiAgICAgICBpZD0icGF0aDEiIC8+CiAgPC9nPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzOTUuMjQyODEsNDMwLjQwNjI2IGMgLTEyLjYxOTQxLC0xLjQzNDIzIC0yNC45Mjk3LC0xMC4xMTcyOSAtMzAuNzQzMjgsLTIxLjY4NDc1IC0zLjM2NjAxLC02LjY5NzQ3IC0zLjY5OTk3LC0xMC4xNDQ2OSAtMTAuMDk2NTEsLTEwNC4yMTk0OCAtMy40ODQ1OSwtNTEuMjQ4NDEgLTYuMzM1NjMsLTk2LjU4ODIzIC02LjMzNTYzLC0xMDAuNzU1MTYgMCwtOS4xMTcwNyAxLjM2Nzk2LC0xNC45MzA1MiA1LjQ5OTIyLC0yMy4zNzAyNiA5LjYyOTQ0LC0xOS42NzE5NSAzMi4zMzY4MSwtMzEuNTU2MzggNTMuOTAxMzUsLTI4LjIxMDUyIDE2LjUyMDM0LDIuNTYzMjEgMzEuMTU1MzEsMTMuMDYwNiAzOC45MDMxNywyNy45MDQ1MSA2Ljk3MzY1LDEzLjM2MDYyIDcuMDMwODUsMTYuOTYxODkgMS41NTM3MSw5Ny44MjgzMSAtNS42NDc1Miw4My4zODE3NyAtOC42MjQ3MSwxMTkuNzk5MDcgLTEwLjIxMzU2LDEyNC45MzMzIC01LjY3ODcyLDE4LjM1MDI1IC0yMy4yNDkxLDI5Ljc1ODM5IC00Mi40Njg0NywyNy41NzQwNSB6IgogICAgIGlkPSJwYXRoOSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMjA0NzksNTU0LjIyNjgxIGMgLTIwLjU0MjA3LC01LjM4NTQgLTM1LjIzNTAzLC0yMi4wMjkxNSAtMzguMzY5MTMsLTQzLjQ2MzM5IC0zLjQ4MDY1LC0yMy44MDQyNCAxMi4xNTY1OCwtNDguMjI4MDEgMzUuNzAzNDksLTU1Ljc2NTI2IDcuMzc2OSwtMi4zNjEzMSAxOC43ODEyMiwtMi44Mzk3MyAyNi41NDA3NCwtMS4xMTM0IDE2LjU2OTA4LDMuNjg2MjcgMzEuMjQ2OTcsMTYuNDIwMDIgMzcuMjIwNjUsMzIuMjkwNjUgMTIuNjUyNzQsMzMuNjE1MjMgLTEyLjY0MTgsNjkuODA5NDEgLTQ4LjYyNTU4LDY5LjU3ODc1IC0zLjk2OTMxLC0wLjAyNTQgLTkuMTcxODQsLTAuNjYyNjUgLTEyLjQ3MDE3LC0xLjUyNzM1IHoiCiAgICAgaWQ9InBhdGgxMCIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMDg4NjIsNTU0LjE5NzMgYyAtMjQuOTUzMjQsLTYuNTM3NzIgLTQxLjg5NDU1LC0zMS41MzI0OSAtMzguMjUyOTYsLTU2LjQzNzQzIDUuMjY0NTIsLTM2LjAwNDI4IDQzLjQ0NTkzLC01NS43OTYzMiA3NS4zMjMzMiwtMzkuMDQ1MjMgMTguNjIyMzksOS43ODU3OSAyOS45ODMzNCwzMS42ODIzMSAyNy4wMDUzNiw1Mi4wNDg3OCAtNC41MzkyNSwzMS4wNDQxNSAtMzQuMzE4NjcsNTEuMjMwMjEgLTY0LjA3NTcyLDQzLjQzMzg4IHoiCiAgICAgaWQ9InBhdGgxMSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgo8L3N2Zz4K)
    no-repeat center center !important;
  background-size: 12px !important;
  background-position: 4px 4px !important;
  top: -1px !important;
  width: 24px !important;
  height: 24px !important;
  z-index: 1;
}

.b2r #e_imagen, .b2r #e_attachn {
  background: transparent
    url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgZmlsbD0iIzAwMDAwMCIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0iQ2FwYV8xIgogICB3aWR0aD0iMTZweCIKICAgaGVpZ2h0PSIxNnB4IgogICB2aWV3Qm94PSIwIDAgNDM3LjY5OSA0MzcuNjk5IgogICBzb2RpcG9kaTpkb2NuYW1lPSIyMDI1LTAyLTEyLTYzMjU0LnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iMS4yNjEyNSIKICAgICBpbmtzY2FwZTpjeD0iMzk5LjYwMzU3IgogICAgIGlua3NjYXBlOmN5PSIzOTYuODI4NTQiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIyMTEyIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExODgiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjI4MTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ijk1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iQ2FwYV8xIiAvPgogIDxnCiAgICAgaWQ9ImcxIj4KICAgIDxwYXRoCiAgICAgICBkPSJNMzcyLjU3OCw2My4xMDFjLTQxLjE4LTMyLjMzMi05NS43NzUtNTAuMTM4LTE1My43MjctNTAuMTM4Yy01Ny45NTIsMC0xMTIuNTQ3LDE3LjgwNi0xNTMuNzI4LDUwLjEzOCBDMjMuMTI3LDk2LjA3MywwLDE0MC4xNjIsMCwxODcuMjQ0YzAsNDcuNjg4LDI0LjUzNiw5My4yNDYsNjcuNTg5LDEyNi4wMjdsLTIwLjgxLDk3LjY1NmMtMC44OTMsNC4xODYsMC42MjksOC41MTgsMy45NCwxMS4yMjcgYzIuMDc5LDEuNzAxLDQuNjQ1LDIuNTgyLDcuMjM3LDIuNTgyYzEuNTM4LDAsMy4wODctMC4zMTEsNC41NDgtMC45NDNsMTQ0LjA2My02Mi41MzljNC4xMDQsMC4xOCw4LjIyMywwLjI3MSwxMi4yODIsMC4yNzEgYzU3Ljk1MiwwLDExMi41NDUtMTcuODA3LDE1My43MjctNTAuMTM5YzQxLjk5Ni0zMi45NzMsNjUuMTIzLTc3LjA2MSw2NS4xMjMtMTI0LjE0NCBDNDM3LjcwMSwxNDAuMTYyLDQxNC41NzQsOTYuMDczLDM3Mi41NzgsNjMuMTAxeiBNMjE4Ljg1MiwzMDQuMzkzYy0xNS43MDksMC0yOC40OS0xMi43OC0yOC40OS0yOC40ODkgYzAtMTUuNzEsMTIuNzgxLTI4LjQ5MSwyOC40OS0yOC40OTFjMTUuNzA4LDAsMjguNDksMTIuNzgxLDI4LjQ5LDI4LjQ5MUMyNDcuMzQyLDI5MS42MTIsMjM0LjU2MSwzMDQuMzkzLDIxOC44NTIsMzA0LjM5M3ogTTI0MC43MjEsMjE1LjU3Yy0wLjc3MSwxMS40NDYtMTAuMzY3LDIwLjQxNy0yMS44NDQsMjAuNDE3Yy0wLjQ5OSwwLTEuMDAyLTAuMDE2LTEuNTA1LTAuMDUxIGMtMTAuODY3LTAuNzM3LTE5LjYyNC05LjQ5OC0yMC4zNTUtMjAuMzc2bC02LjkzMS0xMDIuMDU2Yy0wLjUyMi03LjY4NiwxLjk4LTE1LjExOCw3LjA0OS0yMC45MjYgYzUuMDY4LTUuODA2LDEyLjA5Mi05LjI5LDE5Ljc3OS05LjgxM2MwLjY1My0wLjA0NCwxLjMxMy0wLjA2NiwxLjk2Mi0wLjA2NmMxNS4xMSwwLDI3Ljc1NywxMS44MTMsMjguNzc4LDI2Ljg5NCBDMjQ4LjIwMiwxMTYuMiwyNDAuNzIxLDIxNS41NywyNDAuNzIxLDIxNS41N3oiCiAgICAgICBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMTk5LCAwKTsiCiAgICAgICBpZD0icGF0aDEiIC8+CiAgPC9nPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzOTUuMjQyODEsNDMwLjQwNjI2IGMgLTEyLjYxOTQxLC0xLjQzNDIzIC0yNC45Mjk3LC0xMC4xMTcyOSAtMzAuNzQzMjgsLTIxLjY4NDc1IC0zLjM2NjAxLC02LjY5NzQ3IC0zLjY5OTk3LC0xMC4xNDQ2OSAtMTAuMDk2NTEsLTEwNC4yMTk0OCAtMy40ODQ1OSwtNTEuMjQ4NDEgLTYuMzM1NjMsLTk2LjU4ODIzIC02LjMzNTYzLC0xMDAuNzU1MTYgMCwtOS4xMTcwNyAxLjM2Nzk2LC0xNC45MzA1MiA1LjQ5OTIyLC0yMy4zNzAyNiA5LjYyOTQ0LC0xOS42NzE5NSAzMi4zMzY4MSwtMzEuNTU2MzggNTMuOTAxMzUsLTI4LjIxMDUyIDE2LjUyMDM0LDIuNTYzMjEgMzEuMTU1MzEsMTMuMDYwNiAzOC45MDMxNywyNy45MDQ1MSA2Ljk3MzY1LDEzLjM2MDYyIDcuMDMwODUsMTYuOTYxODkgMS41NTM3MSw5Ny44MjgzMSAtNS42NDc1Miw4My4zODE3NyAtOC42MjQ3MSwxMTkuNzk5MDcgLTEwLjIxMzU2LDEyNC45MzMzIC01LjY3ODcyLDE4LjM1MDI1IC0yMy4yNDkxLDI5Ljc1ODM5IC00Mi40Njg0NywyNy41NzQwNSB6IgogICAgIGlkPSJwYXRoOSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMjA0NzksNTU0LjIyNjgxIGMgLTIwLjU0MjA3LC01LjM4NTQgLTM1LjIzNTAzLC0yMi4wMjkxNSAtMzguMzY5MTMsLTQzLjQ2MzM5IC0zLjQ4MDY1LC0yMy44MDQyNCAxMi4xNTY1OCwtNDguMjI4MDEgMzUuNzAzNDksLTU1Ljc2NTI2IDcuMzc2OSwtMi4zNjEzMSAxOC43ODEyMiwtMi44Mzk3MyAyNi41NDA3NCwtMS4xMTM0IDE2LjU2OTA4LDMuNjg2MjcgMzEuMjQ2OTcsMTYuNDIwMDIgMzcuMjIwNjUsMzIuMjkwNjUgMTIuNjUyNzQsMzMuNjE1MjMgLTEyLjY0MTgsNjkuODA5NDEgLTQ4LjYyNTU4LDY5LjU3ODc1IC0zLjk2OTMxLC0wLjAyNTQgLTkuMTcxODQsLTAuNjYyNjUgLTEyLjQ3MDE3LC0xLjUyNzM1IHoiCiAgICAgaWQ9InBhdGgxMCIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtzdHJva2Utd2lkdGg6MC4wNzkyODY0O3BhaW50LW9yZGVyOnN0cm9rZSBmaWxsIG1hcmtlcnMiCiAgICAgZD0ibSAzODcuMDg4NjIsNTU0LjE5NzMgYyAtMjQuOTUzMjQsLTYuNTM3NzIgLTQxLjg5NDU1LC0zMS41MzI0OSAtMzguMjUyOTYsLTU2LjQzNzQzIDUuMjY0NTIsLTM2LjAwNDI4IDQzLjQ0NTkzLC01NS43OTYzMiA3NS4zMjMzMiwtMzkuMDQ1MjMgMTguNjIyMzksOS43ODU3OSAyOS45ODMzNCwzMS42ODIzMSAyNy4wMDUzNiw1Mi4wNDg3OCAtNC41MzkyNSwzMS4wNDQxNSAtMzQuMzE4NjcsNTEuMjMwMjEgLTY0LjA3NTcyLDQzLjQzMzg4IHoiCiAgICAgaWQ9InBhdGgxMSIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuNTQ3MTIzNzUpIiAvPgo8L3N2Zz4K)
    no-repeat center center !important;
  background-size: 10px !important;
  background-position: 10px 5px !important;
  top: -1px !important;
}

/* 主题切换按钮tooltip样式 - 与背景编辑面板保持一致 */
.theme-custom-tooltip {
  position: fixed !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  padding: 4px 12px !important;
  border-radius: 12px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  white-space: nowrap !important;
  z-index: 99999 !important;
  pointer-events: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: var(--backdrop-filter-1) !important;
  text-align: center !important;
  opacity: 0 !important;
  transform: translateY(-5px) !important;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out !important;
  display: block !important;
  visibility: visible !important;
}

.theme-custom-tooltip.show {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/*---------------------------- 帖子列表（卡片式）----------------------------------- */
/* 标签展开/折叠动画 */
.unfold, .fold {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.unfold:hover, .fold:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

/* 通用展开/折叠内容动画 */
.collapsible-item {
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.collapsible-item.collapsed {
  max-height: 0;
  opacity: 0;
}

/* 容器样式 */
.redesigned-thread-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 帖子卡片样式 */
.thread-card {
  display: flex;
  background: var(--card-background-2);
  padding: 18px;
  border: 1px solid var(--card-border-2);
  border-radius: var(--radius16) !important;
}

/* 置顶帖样式 */
.thread-card.sticky {
  background: var(--card-background-2);
  border-radius: var(--radius12) !important;
  padding: 10px;
  border: 1px solid var(--panel-border-1);
}

/* 置顶帖隐藏头像 */
.thread-card.sticky .thread-avatar {
  display: none;
}

/* 置顶帖内容垂直居中 */
.thread-card.sticky {
  align-items: center;
}

.thread-card.sticky .thread-content {
  display: flex;
  align-items: center;
}

/* 头像区域 */
.thread-avatar {
  margin-right: 15px;
  flex-shrink: 0;
}

.thread-avatar img {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 3px solid var(--button-background-1);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) !important;
  object-fit: cover !important;
}

/* 内容区域 */
.thread-content {
  flex-grow: 1;
}

.thread-title {
  font-size: 14px;
  font-weight: 500 !important;
}

.s.xst {
  background: transparent !important;
}

.thread-title em a {
  font-size: 10px;
  background: var(--primary-color) !important;
  padding: 2px 6px;
  border-radius: 6px !important;
  color: var(--tag-font-color) !important;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05) !important;
  margin-right: 5px;
  display: inline-block;
  opacity: 0.9;
}

.theme-dark .thread-title em a {
  background: var(--tag-background-2) !important;
}

/* 图标样式调整 */
.thread-title img {
  margin: 0 2px;
  vertical-align: middle;
}

/* New标记样式 */
.thread-title .xi1 {
  margin-left: 8px;
  color: #ff6b6b;
  font-size: 11px;
  text-decoration: none;
}

.thread-info {
  display: flex;
  font-size: 11px;
  color: var(--font-color-1);
  margin: 8px 0 0 0;
  opacity: 0.8;
}

.thread-info span {
  margin-right: 20px;
  display: inline-flex;
  align-items: center;
}

/* 图标样式 */
.thread-author::before {
  content: "" !important;
  margin-right: 4px !important;
  width: 14px !important;
  height: 14px !important;
  display: inline-block !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  vertical-align: middle !important;
  filter: var(--filter1) !important;
}

.thread-time::before {
  content: "" !important;
  margin-right: 4px !important;
  width: 14px !important;
  height: 14px !important;
  display: inline-block !important;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTkgNGgtMVYzYzAtLjYtLjQtMS0xLTFzLTEgLjQtMSAxdjFIOFYzYzAtLjYtLjQtMS0xLTFzLTEgLjQtMSAxdjFINUMzLjMgNCAyIDUuMyAyIDd2MWgyMFY3YzAtMS43LTEuMy0zLTMtM00yIDE5YzAgMS43IDEuMyAzIDMgM2gxNGMxLjcgMCAzLTEuMyAzLTN2LTlIMnptMTUtN2MuNiAwIDEgLjQgMSAxcy0uNCAxLTEgMXMtMS0uNC0xLTFzLjQtMSAxLTFtMCA0Yy42IDAgMSAuNCAxIDFzLS40IDEtMSAxcy0xLS40LTEtMXMuNC0xIDEtMW0tNS00Yy42IDAgMSAuNCAxIDFzLS40IDEtMSAxcy0xLS40LTEtMXMuNC0xIDEtMW0wIDRjLjYgMCAxIC40IDEgMXMtLjQgMS0xIDFzLTEtLjQtMS0xcy40LTEgMS0xbS01LTRjLjYgMCAxIC40IDEgMXMtLjQgMS0xIDFzLTEtLjQtMS0xcy40LTEgMS0xbTAgNGMuNiAwIDEgLjQgMSAxcy0uNCAxLTEgMXMtMS0uNC0xLTFzLjQtMSAxLTEiLz48L3N2Zz4=") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  opacity: 0.8;
  filter: var(--filter1) !important;
  background: var(--icon-color);
}

.thread-replies::before {
  content: "" !important;
  margin-right: 4px !important;
  width: 14px !important;
  height: 14px !important;
  display: inline-block !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z'/%3E%3C/svg%3E") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  vertical-align: middle !important;
  filter: var(--filter1) !important;
}

.thread-reply-time::before {
  content: "" !important;
  margin-right: 4px !important;
  width: 14px !important;
  height: 14px !important;
  display: inline-block !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z'/%3E%3C/svg%3E") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  vertical-align: middle !important;
  filter: var(--filter1) !important;
}

.thread-views::before {
  content: "" !important;
  margin-right: 4px !important;
  width: 14px !important;
  height: 14px !important;
  display: inline-block !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M3 14h5v6H3zm7-6h5v12h-5zm7-4h5v16h-5z'/%3E%3C/svg%3E") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  vertical-align: middle !important;
  filter: var(--filter1) !important;
}

/* 置顶标记 */
.sticky-tag {
  background: #f44646;
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 11px;
  margin-right: 6px;
}

/* 导航栏样式 */
.forum-navigation {
  background: var(--card-background-2);
  border-radius: var(--radius12) !important;
  padding: 5px 10px;
  margin: 10px 0;
  border: 1px solid var(--card-border-2) !important;
}

.forum-navigation .nav-row {
  display: flex;
  align-items: center;
}

.forum-navigation .nav-row:last-child {
  margin-bottom: 0;
}

.forum-navigation .nav-label {
  font-weight: 500;
  margin-right: 15px;
  min-width: 60px;
  color: var(--font-color-1);
}

.forum-navigation .nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  line-height: 2;
}

.forum-navigation .nav-links a {
  color: var(--font-color);
  padding: 0 8px;
  border-radius: var(--radius8) !important;
  font-size: 13px;
  transition: all 0.2s ease;
}

.forum-navigation .nav-links a:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--font-color-1);
}

.forum-navigation .nav-links a.current {
  background: #f44646;
  color: white;
}

.forum-navigation .nav-links .pipe {
  color: #ccc;
  margin: 0 4px;
}

/* 折叠功能样式 */
.forum-navigation .nav-row.collapsible {
  cursor: pointer;
  user-select: none;
}

.forum-navigation .nav-row.collapsible .nav-label::after {
  content: "▼";
  margin-left: 8px;
  font-size: 10px;
  transition: transform 0.2s ease;
  display: inline-block;
}

.forum-navigation.collapsed .nav-row.collapsible .nav-label::after {
  transform: rotate(-90deg);
}

.forum-navigation .nav-row.collapsible-content {
  overflow: hidden;
  max-height: 200px;
  margin-bottom: 5px;
}

.forum-navigation.collapsed .nav-row.collapsible-content {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

/* 内联热帖时间控件样式 */
.forum-navigation .inline-hot-time-controls {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }

}

.forum-navigation .inline-hot-time-controls #hottime-inline, .forum-navigation .inline-hot-time-controls .hottime-icon {
  width: 14px !important;
  height: 14px !important;
  cursor: pointer !important;
  opacity: 0.8 !important;
  transition: opacity 0.2s ease !important;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDAwMDAwIiBkPSJNMTkgNGgtMVYzYzAtLjYtLjQtMS0xLTFzLTEgLjQtMSAxdjFIOFYzYzAtLjYtLjQtMS0xLTFzLTEgLjQtMSAxdjFINUMzLjMgNCAyIDUuMyAyIDd2MWgyMFY3YzAtMS43LTEuMy0zLTMtM00yIDE5YzAgMS43IDEuMyAzIDMgM2gxNGMxLjcgMCAzLTEuMyAzLTN2LTlIMnptMTUtN2MuNiAwIDEgLjQgMSAxcy0uNCAxLTEgMXMtMS0uNC0xLTFzLjQtMSAxLTFtMCA0Yy42IDAgMSAuNCAxIDFzLS40IDEtMSAxcy0xLS40LTEtMXMuNC0xIDEtMW0tNS00Yy42IDAgMSAuNCAxIDFzLS40IDEtMSAxcy0xLS40LTEtMXMuNC0xIDEtMW0wIDRjLjYgMCAxIC40IDEgMXMtLjQgMS0xIDFzLTEtLjQtMS0xcy40LTEgMS0xbS01LTRjLjYgMCAxIC40IDEgMXMtLjQgMS0xIDFzLTEtLjQtMS0xcy40LTEgMS0xbTAgNGMuNiAwIDEgLjQgMSAxcy0uNCAxLTEgMXMtMS0uNC0xLTFzLjQtMSAxLTEiLz48L3N2Zz4=") !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  filter: var(--filter1) !important;
  margin-right: 6px !important;
  display: inline-block !important;
  vertical-align: middle !important;
  border: none !important;
  padding: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.forum-navigation .inline-hot-time-controls #hottime-inline:hover, .forum-navigation .inline-hot-time-controls .hottime-icon:hover {
  opacity: 1 !important;
}

.forum-navigation .inline-hot-time-controls #filter_dateline-inline {
  color: var(--font-color-1);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
  text-align: center;
  border-radius: 0 !important;
}

.forum-navigation .inline-hot-time-controls #filter_dateline-inline:hover {
  color: var(--font-color);
  background: none !important;
}

/* 日历弹窗样式 */
.sht-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sht-calendar-nav-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--font-color, #333);
  padding: 5px;
}

.sht-calendar-month-label {
  font-weight: bold;
}

.sht-calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
}

.sht-calendar-weekday {
  font-weight: 500;
  font-size: 12px;
}

.sht-calendar-day-cell {
  padding: 5px;
  cursor: pointer;
}

.sht-calendar-day-cell:hover {
  background: #f44646;
  border-radius: 50%;
  height: 18px;
  width: 18px;
  color: #fff;
}

/* 日历包装器样式 */
#sht-calendar-wrapper {
  position: absolute;
  z-index: 10001;
  background: var(--panel-background-1);
  border-radius: 16px;
  border: 1px solid var(--panel-background-1);
  box-shadow: var(--panel-shadow-s);
  backdrop-filter: var(--backdrop-filter-1) !important;
  padding: 10px;
  color: var(--font-color);
  width: 280px;
}

/* -------------------------作者主页容器样式 ---------------------- */
.author-thread-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

/* 版块信息样式 - 适用于所有thread-card */
.thread-card .thread-forum {
  color: var(--font-color-1);
  font-weight: 500;
}

/* 作者主页卡片特定调整 */
.author-thread-card .thread-forum {
  color: var(--font-color-1);
  font-weight: 500;
}

/* 版块图标 - 适用于所有thread-card */
.thread-card .thread-forum::before {
  content: "";
  margin-right: 4px;
  width: 14px;
  height: 14px;
  display: inline-block;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  filter: var(--filter1);
}

/* 版块图标 - 作者主页特定样式（保持兼容性） */
.author-thread-card .thread-forum::before {
  content: "";
  margin-right: 4px;
  width: 14px;
  height: 14px;
  display: inline-block;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  vertical-align: middle;
  filter: var(--filter1);
}

.thread-reply-content {
  margin-top: 12px;
}

.thread-reply-content .reply-body a {
  color: var(--font-color-2);
  font-size: 13px;
  line-height: 2;
}

/* -------------------------主题编辑面板 ------------------------- */
#background-settings-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease;
  pointer-events: none;
  background: transparent;
}

.bg-panel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  pointer-events: none;
}

.bg-panel-content {
  background: var(--panel-background-1);
  border-radius: 16px;
  width: 580px;
  overflow: hidden;
  box-shadow: var(--panel-shadow);
  position: relative;
  pointer-events: auto;
  backdrop-filter: var(--backdrop-filter-3) !important;
  border: 0.5px solid var(--panel-border-1) !important;
}

.bg-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: move;
  user-select: none;
}

.bg-panel-title {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	color: var(--font-color-1);
	cursor: pointer;
	font-size: 13px;
	font-weight: bold !important;
}

.bg-panel-title:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bg-panel-title-input {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	color: var(--font-color-1);
	background: transparent;
	border: none;
  font-size: 13px;
	text-align: center;
}

.bg-panel-close {
  border: none;
  color: #fff;
  cursor: pointer;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  margin-left: auto;
  z-index: 1;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2) !important;
  background: var(--button-background-1);
  padding: 3px;
}

.bg-panel-close:hover {
	background: red;
}

.bg-panel-body {
  padding: 0 24px 10px;
  height: calc(100% - 12px);
  overflow-y: auto;
}

.bg-panel-body::-webkit-scrollbar {
  width: 6px;
}

.bg-panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.bg-panel-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.bg-preset-title {
  font-weight: bold !important;
}

/* 卡片样式 */
.bg-card {
  background: var(--panel-background-2);
  border-radius: 16px;
  margin-bottom: 12px;
  border: 0.5px solid rgba(0, 0, 0, 0.05);
}

.bg-card-header {
  display: flex;
  gap: 5px;
  padding: 20px 20px 0;
  flex-direction: column;
  font-size: 13px;
  color: var(--font-color-1);
}

/* 样式预设标题行 */
.bg-preset-header-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

/* 样式预设操作按钮区域 */
.bg-preset-actions {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 10px;
}

/* 小尺寸按钮样式 */
.bg-btn-small {
  padding: 2px 8px !important;
  font-size: 10px !important;
  border-radius: var(--radius8) !important;
}

/* 样式预设标签 */
.bg-preset-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--font-color-1);
  margin-right: 8px;
}

/* 预设列表样式 */
.bg-preset-list {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bg-preset-dot {
	width: 13px;
	height: 13px;
	cursor: pointer;
	transition: all 0.2s ease;
	outline: 2px solid rgb(255, 255, 255);
	position: relative;
	background-size: 150%;
	background-position: center;
	background-repeat: no-repeat;
	pointer-events: auto;
	z-index: 1;
	border-radius: 50% !important;
	margin: 4px 8px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2) !important;
}

.bg-preset-dot.active {
  outline-color: var(--tag-font-color);
  transform: scale(1.3);
}

/* 拖动排序相关样式 */
.bg-preset-dot:not(.default) {
  cursor: grab;
}

.bg-preset-dot:not(.default):active {
  cursor: grabbing;
}

.bg-preset-dot.dragging {
  opacity: 0.5;
  transform: scale(1.1);
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

/* 拖动到元素前方的视觉提示 */
.bg-preset-dot.drag-over-before {
  border-left: 3px solid #007bff;
  margin-left: 6px;
  transform: translateX(-3px);
}

/* 拖动到元素后方的视觉提示 */
.bg-preset-dot.drag-over-after {
  border-right: 3px solid #007bff;
  margin-right: 6px;
  transform: translateX(3px);
}

/* 拖动时禁用tooltip */
.bg-preset-dot.dragging:hover::after {
  display: none !important;
}

/* 自定义tooltip样式 - 统一所有预设点的弹窗样式 */
.bg-preset-dot[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: tooltipFadeIn 0.2s ease-out;
  backdrop-filter: var(--backdrop-filter-1) !important;
  min-width: 60px;
  text-align: center;
}

/* 禁用所有预设点的原生弹窗，改用JavaScript自定义 */
.bg-preset-dot[title]:hover::after {
  display: none !important;
}

/* 确保span.pgb.y下面的返回按钮tooltip能正常显示 */
span.pgb.y a[title]:hover::after {
  content: attr(title) !important;
  position: absolute !important;
  bottom: 120% !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  padding: 4px 8px !important;
  border-radius: 4px !important;
  font-size: 11px !important;
  white-space: nowrap !important;
  z-index: 10000 !important;
  pointer-events: none !important;
  display: block !important;
}

/* 自定义弹窗样式 - 通过JavaScript创建，不受父元素缩放影响 */
.bg-custom-tooltip {
  position: fixed;
  background: var(--tooltip-background);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  backdrop-filter: var(--backdrop-filter-1) !important;
  text-align: center;
  opacity: 0;
  transform: translateY(-5px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.bg-custom-tooltip.show {
  opacity: 1;
  transform: translateY(0);
}

/* 上传区域 */
.bg-upload-area {
  position: relative;
  padding: 10px 0;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.bg-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 60px);
  height: 150px;
  margin: 0 30px;
  border: 3px dashed var(--img-border-1) !important;
  border-radius: var(--radius16);
  cursor: pointer;
  transition: all 0.3s ease;
}

.bg-upload-icon {
  font-size: 32px;
  opacity: 0.6;
}

.bg-upload-text {
  font-size: 14px;
  color: var(--font-color-1);
}

.bg-upload-hint {
  font-size: 12px;
  color: var(--font-color-2);
}

.bg-preview {
  position: relative;
  margin: 0 30px;
  width: calc(100% - 60px);
  height: 180px;
  overflow: hidden;
  box-sizing: border-box;
  border: 6px solid rgba(255, 255, 255, 0.7);
  border-radius: 30px;
}

.theme-dark .bg-preview {
  border: 6px solid rgba(255, 255, 255, 0.1);
}

/* 实际显示图片的内部元素 */
.bg-preview-inner {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.bg-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bg-preview:hover .bg-preview-overlay {
  opacity: 1;
}

.bg-preview-change {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 8px 16px;
  border-radius: var(--radius8) !important;
  font-size: 12px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bg-preview-change:hover {
  background: white;
  transform: scale(1.05);
}

.bg-color-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.bg-color-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--font-color-1);
}

.bg-color-hint {
  font-size: 11px;
  color: var(--font-color-2);
  opacity: 0.7;
}

.bg-color-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bg-color-input-group {
  display: flex;
  gap: 8px;
  flex: 1;
}

/* 主题颜色控制样式 */
.theme-color-controls {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 与 .bg-settings-row 一致：两列布局 */
  gap: 24px;
}

/* 扁平化行容器，使其子项直接作为网格项参与两列布局 */
.theme-color-row {
  display: contents;
}

.theme-color-control {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-color-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color-1);
}

.theme-color-input {
  height: 24px;
  padding: 0 10px;
  font-size: 12px;
  background: var(--input-background-2);
  color: var(--font-color-1);
  border-radius: var(--radius8) !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  border: 0.5px solid rgba(0, 0, 0, 0.05) !important;
}

/* 设置行布局 */
.bg-settings-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.bg-settings-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.bg-color-section .bg-settings-column {
	padding: 0 20px 20px;
}

.bg-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 控件组 */
.bg-control-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.bg-control-group-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.bg-control-group:last-child, .bg-control-group-2col:last-child {
  margin-bottom: 0;
}

.bg-control {
  display: flex;
  flex-direction: column;
}

.bg-control.hidden {
  display: none;
}

.bg-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--font-color-1);
  margin: 0;
}

.bg-input, .bg-select {
	width: 100%;
	border-radius: var(--radius8) !important;
	font-size: 12px;
	transition: all 0.2s ease;
	color: var(--font-color-1);
	border: none;
	background: var(--input-background-2) !important;
	margin-top: 5px;
	height: 28px;
	border: 1px solid rgba(0, 0, 0, 0.05) !important;
	padding: 0 10px !important;
}

.bg-input::placeholder {
  color: #ccc;
}

/* 输入组 */
.bg-input-group {
  display: flex;
  align-items: center;
  position: relative;
}

.bg-input-group .bg-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.bg-input-suffix {
  background: rgba(249, 250, 251, 0.8);
  border: 1.5px solid #e5e7eb;
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 滑块容器 */
.bg-slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bg-slider {
  flex: 1;
  height: 4px;
  background: var(--tag-background-2);
  outline: none;
  cursor: pointer;
  border-radius: 3px;
  -webkit-appearance: none;
  appearance: none;
  border: none;
}

/* chrome */
.bg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(140, 140, 140);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Firefox */
.bg-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: rgba(130, 130, 130);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bg-slider-value {
  font-size: 11px;
  color: #fff;
  min-width: 35px;
  text-align: center;
  background: var(--tag-background-2);
  padding: 2px 4px;
  border-radius: var(--radius8) !important;
}

/* 禁用状态的滑块样式 */
.bg-slider:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.bg-slider:disabled::-webkit-slider-thumb {
  background: #ccc;
  cursor: not-allowed;
}

.bg-slider:disabled::-moz-range-thumb {
  background: #ccc;
  cursor: not-allowed;
}

/* 操作按钮区域 */
.bg-actions {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bg-action-group {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.bg-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 4px 10px;
	border-radius: var(--radius10);
	font-size: 11px;
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	position: relative;
	overflow: hidden;
	background: var(--tag-background-3);
	color: var(--tag-font-color);
	border: 0.5px solid rgba(0, 0, 0, 0.05) !important;
}

.bg-btn-icon {
  font-size: 14px;
}

.bg-btn-primary {
  background: #52c51a;
  color: white;
  padding: 0 10px !important;
  box-shadow: 1px 1px 10px rgb(0, 0, 0, 0.15);
  height: 30px;
  font-size: 13px;
}

.bg-btn-secondary {
  background: rgb(100, 100, 100);
  color: white;
  padding: 0 10px !important;
  box-shadow: 1px 1px 10px rgb(0, 0, 0, 0.15);
  height: 30px;
  font-size: 13px;
}

/* 删除按钮特殊样式 */
#bg-delete-btn {
  background: #f44646;
  color: white;
  padding: 0 10px !important;
  box-shadow: 1px 1px 10px rgb(0, 0, 0, 0.15);
  height: 30px;
  font-size: 13px;
}

#bg-delete-btn:disabled {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: not-allowed;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
}

/* 自定义背景图片样式 - 使用伪元素实现旋转以解决尺寸问题 */
.gradient-background.custom-image {
  /* 清除原有背景 */
  background: none !important;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  overflow: hidden;
}

.gradient-background.custom-image::before {
  content: "";
  position: absolute;
  width: 120%;
  height: 120%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) var(--bg-transform, none);
  transform-origin: center center;
  background-image: var(--custom-background-image, none);
  background-size: var(--bg-background-size, var(--bg-size, cover));
  background-position: var(--bg-position-x, 50%) var(--bg-position-y, 50%);
  background-repeat: var(--bg-repeat, no-repeat);
  background-attachment: fixed;
  filter: var(--bg-filter, none);
  opacity: var(--bg-opacity, 1);
  isolation: isolate;
  will-change: filter, transform;
  z-index: -1;
}

/* 暗色模式遮罩层 */
.theme-dark .gradient-background.custom-image::after {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, var(--dark-overlay-opacity, 0.5));
  z-index: -1;
  pointer-events: none;
}

/* Firefox专用优化 - 解决backdrop-filter冲突 */
@supports (backdrop-filter: blur(1px)) {
  @-moz-document url-prefix() {
    .gradient-background.custom-image {
      transform-style: preserve-3d !important;
      backface-visibility: hidden !important;
      contain: layout style paint !important;
    }

    /* 确保backdrop-filter元素也有稳定的渲染层 */
    .bg-panel-content, [style*="backdrop-filter"] {
      transform-style: preserve-3d !important;
      backface-visibility: hidden !important;
      isolation: isolate !important;
    }
  }
}

/* Loading图标替换 - 通过CSS背景图片替换 */
*[style*="loading.gif"] {
  background-size: 20px 20px !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NiIgaGVpZ2h0PSI0NiIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiM1MzUyNTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBzdHJva2UtZGFzaGFycmF5PSIxNiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjE2IiBkPSJNMTIgM2M0Ljk3IDAgOSA0LjAzIDkgOSI+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZHVyPSIwLjNzIiB2YWx1ZXM9IjE2OzAiLz48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIGR1cj0iMS41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHR5cGU9InJvdGF0ZSIgdmFsdWVzPSIwIDEyIDEyOzM2MCAxMiAxMiIvPjwvcGF0aD48cGF0aCBzdHJva2UtZGFzaGFycmF5PSI2NCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjY0IiBzdHJva2Utb3BhY2l0eT0iLjMiIGQ9Ik0xMiAzYzQuOTcgMCA5IDQuMDMgOSA5YzAgNC45NyAtNC4wMyA5IC05IDljLTQuOTcgMCAtOSAtNC4wMyAtOSAtOWMwIC00Ljk3IDQuMDMgLTkgOSAtOVoiPjxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGR1cj0iMS4ycyIgdmFsdWVzPSI2NDswIi8+PC9wYXRoPjwvZz48L3N2Zz4=") !important;
}

/* 隐藏未加载的图片*/
img[style*="height: 1px"][style*="width: 1px"],
img[width="1"][height="1"],
img[style*="height:1px"][style*="width:1px"] {
  display: none !important;
}

#tbltips {
	width: 12px;
	margin-top: -2px;
	filter: var(--filter1);
}
.thread-title:visited {
	opacity: 0.5 !important;
	color: red !important;
}
`;
  // #endregion

  // #region 图标替换功能
  const imageMap = {
    "static/image/common/info_small.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48ZyBmaWxsPSIjNTM1MjU2Ij48cGF0aCBkPSJNOSA3djVIN1Y3ek04IDRhMSAxIDAgMSAwIDAgMmExIDEgMCAwIDAgMC0yIi8+PHBhdGggZD0iTTAgOGE4IDggMCAxIDEgMTYgMEE4IDggMCAwIDEgMCA4bTgtNmE2IDYgMCAxIDAgMCAxMkE2IDYgMCAwIDAgOCAyIi8+PC9nPjwvc3ZnPg==",
    "static/image/common/locked.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjNDI0MjQyIiBkPSJNMjQgNGMtNS41IDAtMTAgNC41LTEwIDEwdjRoNHYtNGMwLTMuMyAyLjctNiA2LTZzNiAyLjcgNiA2djRoNHYtNGMwLTUuNS00LjUtMTAtMTAtMTAiLz48cGF0aCBmaWxsPSIjRkI4QzAwIiBkPSJNMzYgNDRIMTJjLTIuMiAwLTQtMS44LTQtNFYyMmMwLTIuMiAxLjgtNCA0LTRoMjRjMi4yIDAgNCAxLjggNCA0djE4YzAgMi4yLTEuOCA0LTQgNCIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMzEiIHI9IjMiIGZpbGw9IiNDNzZFMDAiLz48L3N2Zz4=",
    "static/image/common/icon_quote_m_s.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjY2NjY2NjIiBkPSJNNC41ODMgMTcuMzIxQzMuNTUzIDE2LjIyNyAzIDE1IDMgMTMuMDExYzAtMy41IDIuNDU3LTYuNjM3IDYuMDMtOC4xODhsLjg5MyAxLjM3OGMtMy4zMzUgMS44MDQtMy45ODcgNC4xNDUtNC4yNDcgNS42MjFjLjUzNy0uMjc4IDEuMjQtLjM3NSAxLjkyOS0uMzExYzEuODA0LjE2NyAzLjIyNiAxLjY0OCAzLjIyNiAzLjQ4OWEzLjUgMy41IDAgMCAxLTMuNSAzLjVhMy44NyAzLjg3IDAgMCAxLTIuNzQ4LTEuMTc5bTEwIDBDMTMuNTUzIDE2LjIyNyAxMyAxNSAxMyAxMy4wMTFjMC0zLjUgMi40NTctNi42MzcgNi4wMy04LjE4OGwuODkzIDEuMzc4Yy0zLjMzNSAxLjgwNC0zLjk4NyA0LjE0NS00LjI0NyA1LjYyMWMuNTM3LS4yNzggMS4yNC0uMzc1IDEuOTI5LS4zMTFjMS44MDQuMTY3IDMuMjI2IDEuNjQ4IDMuMjI2IDMuNDg5YTMuNSAzLjUgMCAwIDEtMy41IDMuNWEzLjg3IDMuODcgMCAwIDEtMi43NDgtMS4xNzkiLz48L3N2Zz4=",
    "static/image/common/icon_quote_m_e.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjY2NjY2NjIiBkPSJNMTkuNDE3IDYuNjc5QzIwLjQ0NyA3Ljc3MyAyMSA5IDIxIDEwLjk4OWMwIDMuNS0yLjQ1NiA2LjYzNy02LjAzIDguMTg4bC0uODkzLTEuMzc4YzMuMzM1LTEuODA0IDMuOTg3LTQuMTQ1IDQuMjQ4LTUuNjIxYy0uNTM3LjI3OC0xLjI0LjM3NS0xLjkzLjMxMWMtMS44MDQtLjE2Ny0zLjIyNi0xLjY0OC0zLjIyNi0zLjQ4OWEzLjUgMy41IDAgMCAxIDMuNS0zLjVjMS4wNzMgMCAyLjEuNDkgMi43NDggMS4xNzltLTEwIDBDMTAuNDQ3IDcuNzczIDExIDkgMTEgMTAuOTg5YzAgMy41LTIuNDU2IDYuNjM3LTYuMDMgOC4xODhsLS44OTMtMS4zNzhjMy4zMzUtMS44MDQgMy45ODctNC4xNDUgNC4yNDctNS42MjFjLS41MzcuMjc4LTEuMjQuMzc1LTEuOTI5LjMxMUM0LjU5MSAxMi4zMjMgMy4xNyAxMC44NDIgMy4xNyA5YTMuNSAzLjUgMCAwIDEgMy41LTMuNWMxLjA3MyAwIDIuMS40OSAyLjc0OCAxLjE3OSIvPjwvc3ZnPg==",
    "static/image/filetype/zip.gif":
      "data:image/webp;base64,UklGRpAaAABXRUJQVlA4WAoAAAA0AAAAZwAAaQAASUNDUEgMAAAAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAABJzUkdCIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5jaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkZXNjAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAC5JRUMgNjE5NjYtMi4xIERlZmF1bHQgUkdCIGNvbG91ciBzcGFjZSAtIHNSR0IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGVzYwAAAAAAAAAsUmVmZXJlbmNlIFZpZXdpbmcgQ29uZGl0aW9uIGluIElFQzYxOTY2LTIuMQAAAAAAAAAAAAAALFJlZmVyZW5jZSBWaWV3aW5nIENvbmRpdGlvbiBpbiBJRUM2MTk2Ni0yLjEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHZpZXcAAAAAABOk/gAUXy4AEM8UAAPtzAAEEwsAA1yeAAAAAVhZWiAAAAAAAEwJVgBQAAAAVx/nbWVhcwAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAo8AAAACc2lnIAAAAABDUlQgY3VydgAAAAAAAAQAAAAABQAKAA8AFAAZAB4AIwAoAC0AMgA3ADsAQABFAEoATwBUAFkAXgBjAGgAbQByAHcAfACBAIYAiwCQAJUAmgCfAKQAqQCuALIAtwC8AMEAxgDLANAA1QDbAOAA5QDrAPAA9gD7AQEBBwENARMBGQEfASUBKwEyATgBPgFFAUwBUgFZAWABZwFuAXUBfAGDAYsBkgGaAaEBqQGxAbkBwQHJAdEB2QHhAekB8gH6AgMCDAIUAh0CJgIvAjgCQQJLAlQCXQJnAnECegKEAo4CmAKiAqwCtgLBAssC1QLgAusC9QMAAwsDFgMhAy0DOANDA08DWgNmA3IDfgOKA5YDogOuA7oDxwPTA+AD7AP5BAYEEwQgBC0EOwRIBFUEYwRxBH4EjASaBKgEtgTEBNME4QTwBP4FDQUcBSsFOgVJBVgFZwV3BYYFlgWmBbUFxQXVBeUF9gYGBhYGJwY3BkgGWQZqBnsGjAadBq8GwAbRBuMG9QcHBxkHKwc9B08HYQd0B4YHmQesB78H0gflB/gICwgfCDIIRghaCG4IggiWCKoIvgjSCOcI+wkQCSUJOglPCWQJeQmPCaQJugnPCeUJ+woRCicKPQpUCmoKgQqYCq4KxQrcCvMLCwsiCzkLUQtpC4ALmAuwC8gL4Qv5DBIMKgxDDFwMdQyODKcMwAzZDPMNDQ0mDUANWg10DY4NqQ3DDd4N+A4TDi4OSQ5kDn8Omw62DtIO7g8JDyUPQQ9eD3oPlg+zD88P7BAJECYQQxBhEH4QmxC5ENcQ9RETETERTxFtEYwRqhHJEegSBxImEkUSZBKEEqMSwxLjEwMTIxNDE2MTgxOkE8UT5RQGFCcUSRRqFIsUrRTOFPAVEhU0FVYVeBWbFb0V4BYDFiYWSRZsFo8WshbWFvoXHRdBF2UXiReuF9IX9xgbGEAYZRiKGK8Y1Rj6GSAZRRlrGZEZtxndGgQaKhpRGncanhrFGuwbFBs7G2MbihuyG9ocAhwqHFIcexyjHMwc9R0eHUcdcB2ZHcMd7B4WHkAeah6UHr4e6R8THz4faR+UH78f6iAVIEEgbCCYIMQg8CEcIUghdSGhIc4h+yInIlUigiKvIt0jCiM4I2YjlCPCI/AkHyRNJHwkqyTaJQklOCVoJZclxyX3JicmVyaHJrcm6CcYJ0kneierJ9woDSg/KHEooijUKQYpOClrKZ0p0CoCKjUqaCqbKs8rAis2K2krnSvRLAUsOSxuLKIs1y0MLUEtdi2rLeEuFi5MLoIuty7uLyQvWi+RL8cv/jA1MGwwpDDbMRIxSjGCMbox8jIqMmMymzLUMw0zRjN/M7gz8TQrNGU0njTYNRM1TTWHNcI1/TY3NnI2rjbpNyQ3YDecN9c4FDhQOIw4yDkFOUI5fzm8Ofk6Njp0OrI67zstO2s7qjvoPCc8ZTykPOM9Ij1hPaE94D4gPmA+oD7gPyE/YT+iP+JAI0BkQKZA50EpQWpBrEHuQjBCckK1QvdDOkN9Q8BEA0RHRIpEzkUSRVVFmkXeRiJGZ0arRvBHNUd7R8BIBUhLSJFI10kdSWNJqUnwSjdKfUrESwxLU0uaS+JMKkxyTLpNAk1KTZNN3E4lTm5Ot08AT0lPk0/dUCdQcVC7UQZRUFGbUeZSMVJ8UsdTE1NfU6pT9lRCVI9U21UoVXVVwlYPVlxWqVb3V0RXklfgWC9YfVjLWRpZaVm4WgdaVlqmWvVbRVuVW+VcNVyGXNZdJ114XcleGl5sXr1fD19hX7NgBWBXYKpg/GFPYaJh9WJJYpxi8GNDY5dj62RAZJRk6WU9ZZJl52Y9ZpJm6Gc9Z5Nn6Wg/aJZo7GlDaZpp8WpIap9q92tPa6dr/2xXbK9tCG1gbbluEm5rbsRvHm94b9FwK3CGcOBxOnGVcfByS3KmcwFzXXO4dBR0cHTMdSh1hXXhdj52m3b4d1Z3s3gReG54zHkqeYl553pGeqV7BHtje8J8IXyBfOF9QX2hfgF+Yn7CfyN/hH/lgEeAqIEKgWuBzYIwgpKC9INXg7qEHYSAhOOFR4Wrhg6GcobXhzuHn4gEiGmIzokziZmJ/opkisqLMIuWi/yMY4zKjTGNmI3/jmaOzo82j56QBpBukNaRP5GokhGSepLjk02TtpQglIqU9JVflcmWNJaflwqXdZfgmEyYuJkkmZCZ/JpomtWbQpuvnByciZz3nWSd0p5Anq6fHZ+Ln/qgaaDYoUehtqImopajBqN2o+akVqTHpTilqaYapoum/adup+CoUqjEqTepqaocqo+rAqt1q+msXKzQrUStuK4trqGvFq+LsACwdbDqsWCx1rJLssKzOLOutCW0nLUTtYq2AbZ5tvC3aLfguFm40blKucK6O7q1uy67p7whvJu9Fb2Pvgq+hL7/v3q/9cBwwOzBZ8Hjwl/C28NYw9TEUcTOxUvFyMZGxsPHQce/yD3IvMk6ybnKOMq3yzbLtsw1zLXNNc21zjbOts83z7jQOdC60TzRvtI/0sHTRNPG1EnUy9VO1dHWVdbY11zX4Nhk2OjZbNnx2nba+9uA3AXcit0Q3ZbeHN6i3ynfr+A24L3hROHM4lPi2+Nj4+vkc+T85YTmDeaW5x/nqegy6LzpRunQ6lvq5etw6/vshu0R7ZzuKO6070DvzPBY8OXxcvH/8ozzGfOn9DT0wvVQ9d72bfb794r4Gfio+Tj5x/pX+uf7d/wH/Jj9Kf26/kv+3P9t//9BTFBIHgMAAAEZMmkbsr3zr3giIvofI/mhBknXtp2R9AblGtu2bds2t8Zf4GpmZdu2bdue6R4b5cr3Db4vna55x3oTMQEM3DZS5O7uMeMbIFmNl4ebg05FCgJSa7ImKRwBqRXXRBxDcTFhIQEgccmtpHKKycdLxwEGcOAzYUhqTchVno84YgxxEe89d99151yShEm97BppJycD+NJhHjlpve2SpbKvqxaiAI7EXLfAYkmsc2uslwiAJzGnjLdZkEVZ9VIUwJUnZpriAUvy6YsB2BK2xFg3Wak9RAF8MSw2Usqy6SACEMYyVS4p8WskJ4AzQV2lY05TUmMAa4apRGcqsw4AWvkMkJUZhwrywItaqcPFRFrtEWIe/aVnMr2YnDCjOsrTSZwaAKj5tOIkn9IacKN6/ESK/JyQK6Q4hagEgJxPGZKSsCNbkh96BagEumzQy8FD/KVyQS89P5ECPQ8fcU0Mejo38e3NoecgiUNPoxOoAHoKjbhqBj2V5qtpxGVtDuDP1+ZrGJRG/+st3Penoe/NAEc/bKN/SS/2dS3P0Q/bd5y+lvUxhB4DRF9BI5Y4/I0BCGIMmJmvNyIKP3G9IQHohTGi19B7SyMOPILeE37iLEnQu8dB3OgN6N2kEV31FnIht6mAENtGLkmYQmxeOAK54zKSt7tXAGoRh7hJYs46BrUz4nQS5ok1QhCL2SgDBZASsM8eiB0W5mD2wUiyxANoPbdVRgoT3HuHLBSCVNQqOTkAsxieWGUdA0rcem/5KIBpVGlUMUJzKoR1r3FcFCkgTXpVDNKUE7rv6l4THGHhnOnSK6OftjJA9rnbYo4zXgEKCyWt/FrqoSgdHoY7llrPfiPOCtL4ZFZKG83lZOPAPLbTOuc9E2D1nla4pJVZMXXVUkQ6ii9+271zyyH7XfHMWxEcsByVRxppZZJfMYXllVk6LjqNihQggYfKAY4hiol457kkt1x111NvvRfCAOJAKnqcPGw3D9vLx3Zx0AklodUQRSEBQXZIhG0TAxQcSGVUOttBY9sKcYyCSwwFJ4wgxkAUF5PgP2sVIErksHRtrK+PAFZQOCBWBwAAECUAnQEqaABqAD5JHoxEIqGhmSu2eCgEhLE2nK0WF/LV8B+VXRi7/eFeemN/18fnvJV6QD9MuoV5gP2O9WP8gPd96B/9g/s3ogey5+zPsAfq76an7Y/C7+4uCKVtHg3v1/D3J3wBYAPqhxC9yZ6Sd8IZI0DfW/sHfrR1sFFNfvcvPfMQ3OPcwrxvxrtycD/CtFE9Nl1zdCxNBO7lHayxBBU/Bj7gNDLFFKJvMlcgWeV58JnE5TM1NCD1EReFMGvYK7En9sVnU5JTgi+uGa/SYv3/GdbcHBTZgRFeONA6CgpYIug7PAO5s8CJvFDRDSCEsu0ABaJ+ROna4Tr5N+aHBim1yvHueqJMG5a7dXUtHTHkWq6fHuf2yrOGLvdMNYXrd3I2oxLevmv6IhugwfvvE+AA/v4+7uo/W9lqRZdY/sIgtc/kdjBegP9CvuYgqkxfKwiw+ulb2tj5fOJGCz/5OCYXHjb4eX31u+9K+BxFR8G7h3/HP+A6j2AmunUI1plD+uQgzn5Q4k7yr2QQ8WRh0is69XLmqzuedS351oZ5Mb3f8B/84tx8VUFzhZnnElTGO1HgVzo47VjMy4X0aFHt9HSYiX/e039MrXVzzuc0HRTpS3vSC2evjhH0NRto02xkNcwcytGxzEKvaEO+GJ6sXgn4aWV340PowcTAObpwwlX/hfv+oIO8/mWzdEpz9WfDunbqq6iUrOIpCxXJ8I08CleyBCpXBkRQI3hEgzoqnsCDRBFbmqXfsh0K0lDRBrs4V/PkFvYkHMZW3PBV20f6PY0M375L9qNoeXoRFvJtV0Uq9LL6yHoh46o5wLf8UB3wcOfqG/29E0qepyrnGKvxg3f4nYa5+v1FKQKMGSn7Q5wlBIn2j+mxHAql590QRf6/oOzB4spHqUamnGt9nQczbW9xkGa+lH4yndHp1sKt1joV0CF8s0AMyzky2yua+kzSjrFrqPAjZ1C+zuYNfRLcQJzST0GZqkcGCyn7dH/CFm4i4rQpQuxaLoLjdfteyHYRNJK2VtLQT2IkSX8MV2uxs+EAuNjYSv3OCRRHP3/Rkta8CrWt/8XgQxixk6BdsxXdrrr1HW4TBy91/apuHGcHg3Vb6FnHHLQPc1RmqsvEnaNOK8jZFwW2ot5seSEWgk8TCyazfL30eG9e19mxw4nTNl7JW2HjzdMbNq3yZ///hor5lt7dBZa/whrTsv3ZFH/8WjBPy2XshH9/tfsPv8Ts5znZW330nz+cZSWB31E+4ELgl8laBx5B/BJXshz6Nd+xov+n8MWIQVmmKe7lkRk+HXA+Lv+uluOOeu/7dcjcn/+ALIT7I7VB2p1/6bz7vDVDh5jo6YjkKdvqR0YZ20Q6/Bln1zTf7XIF+njJt+h3gEr0aZNHO23wYVPYdDfiiF1WJeOnLpwm1xyx4MAcQjlDUBEdnc5+IsVF4JQMFFvdHCPz+qHLVuBezftyXgljAuRbR1zrcZ5sTs6uVI5+C33GscgX6HDc57EPivHA199X5Ow4HoHjlF7pNf63nm3BAAMqvQlBAIYEkpmODbLV/xHM3qKR4ABvW2kUnqjp+YiOMQQVF1lk2G0zL73Q6isdjhuLnwSfH4PoU7Xx9dP1CYyh1mOucEyPj1TXiM74y3EM6uZybqjtVdsnd8urtcYB8nlF99qeTYCyPOdA/+82pzRUDsd5ydiTbIKcefsQ9QN+s6Sbegq0NkV3j6R1T0FCrtVwDhsvRmKlrQID5SIepYO+P+Q2jr0l152m+EfSggtZDZGu7JcptA9Xy4c/zxNqlILBEV5nbFHGVrSyRPHCUsWikughTeReNGf+idlf85sT59wOOJ9z0XpnTm26hZ5+YccNKzHtP/uOOuQepkkt/F/p1WTEyi94M0f7AN6l+WHTHa0sf2wgBK3Zb+9DyYZU/14QWKO3aHiH9dIzhta+WV2VEmbhOGDs4YnYzmgok3cZzLo8or6C/NJd4pLC75g+mati1K8uANgeIIcuJtJU6C0We6MGMf86HIpfr4xmhLFciILW6kPDJcXQ3K4AG4fL9a6IOvl+5K+pTXrq8asufgEPt/KiG7n+nY7oy7mLz/r9eovhIyNNV+SDhpDwYTWzbv6Fa9f/0yXz2xTmjZlmDad6wQCZFZ3wUBcYG4sfkL92AHeb2pGn1felA9TfP/oQcZDr8wmp+jp3ZEEdxRL/pZbORijfAZDm1shQVbrtm065jg9I6LVkTbmRw36AXzNKnBub05x8iseZftIvz9dtDPp3qzWSHTvU2jJqmBmgeM8oZtJAAm0FYNCQ9+a/j58MtWb3Van3fhX7zV0YGJrfxXXQLADtJ1rQ0/TdRAu//CMDhkKMGNd2xCeWUL34V7Ye/wugYcWmn9gPu2XrtLS4gDShA4TmgKc1KEEpcHw0qSt6UB0sdtFZtl1VlZQS+INXfw6k5AQ9aiyu78WfeUKuHsR9Qm061j9Lgy7qKf84Sz3KQI8tZ5v39FMElCMEv63eb/8rj8CgAAAAWE1QIJ0DAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjEwNjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMDQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyNS0wNS0zMVQwMToxMjo1MSswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIFBybyAzLjYuMTc8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjUtMDUtMzFUMDE6MTE6MjMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAA==",
    "static/image/filetype/rar.gif":
      "data:image/webp;base64,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bj4xMDQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAyNS0wNS0zMVQwMToxMjo1MSswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5QaXhlbG1hdG9yIFBybyAzLjYuMTc8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHhtcDpDcmVhdGVEYXRlPjIwMjUtMDUtMzFUMDE6MTE6MjMrMDg6MDA8L3htcDpDcmVhdGVEYXRlPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAA==",
    "static/image/filetype/text.gif": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAMAAAC4uKf/AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURUdwTA8PDvO/VubQV9PT0gwKBLm4turp6AAAAN7e3JiPerikV/bbVN/dy/n59fb18f38+vv6+Pj38vvBNv7fWv3aUfzWSPzOPfDw7//lYu3t6rq6uqejnQpkoMkAAAAOdFJOUwAh/lv9DG3+A/9PKbecpCz8qAAAA+JJREFUaN7tWou2qiAQzRQBXyBlkd3//847PH13MsVz71ptjGFGZLdHtHPE0+nXQUgOiD9BFsOR6G2iPC6L4vrYgGtRlHFOfqTKY8uziU2jiPNXmk552bgvtwXuu17L/LSkj8SN6mUP0I2H22b8wTZ03AiPJibzslCxUdCsxgJNxUEKi92pNF0xSaXlanYvc2wEctg0+3OpMSGTZHgRKy61a2+oMR8FIf0kxiGIOsa4l0iSn4OSNefudkKIEnYbFFdtsn6wR+wTSfJ7c9No3NZVn9vGjaKMk6aE3bodHs1G23euThpM+zHP7mjc9Ec5ePfAxeYRsni7W9x87UMf4jZq30weIYtbR34HpSMbxS8hyMxJI9H5fhlg5O6Dc0TM7eMSHveLniEovxwCRUZIdgxZBjOEoNdk50mja59ftSdkSJOdD4El+3MILNnzEBiyNDkEqSGjqk1dcMZbF57vRB0ZADyofGPo0bG30OllOLXnLMH0+aQ4eT5Vw3tdmK4L9z3boP6cUYyTBGOqKvgaXWMmTCdh3AvT5bBNo2wxhg0+ra96ni6uYaBt25oPdkfYnsNB3EhSk5GUtQqydZDO60Jtf6ccOrJ3WNcYD8KsskpKyaSGNR0GcTaJT/zJAA6VVVazNyHZ56itMi7ePECsGFyMLLfKeCVMURUzDaY969pSLexng8awOFNxp6yqTelVpuG3rriqZ91n1FMXb7wy01uFNCrn197/yf7Yn3tlvA6PnrLwXF5Z/VX2VfYPKVtx/X5of0WZxB5tIItbOSULB+nvjRY1lBBWN/zv2QHofs8OIztGWf1V9lX2VfZV9lX2+q4vhIkZK3a3PWUiODpl4gB4ZeKr7L9TduQdBNMDgK2yuUdUu8P+RZxV9iIPYh2Eft5IMnbAHUQw83Azl0fcrmRuyHAdXBarsSI7oYiGv9AYpxHS62cJDy5M8ESTIVRy8FRMb2sse9OCshJpZb2nm8JWYuEJ5Wy/N/ozc2tUZJkULDCEzCwZnLTQZOqU6YVqBHkMTpYiZJf74UoLy2WvMpPHMrA0Xkbu1RpgCyutwp5LkaVVyKlYpx1Z4ESKXhINWcDpD9O+T6bYMhqIjdMsGr14BWxhtPFkzAW/15DJstp9mlRVqXI4fjVPsaWYV37pSnbLWHO+nO4cVlJNDZxGY11eW1RiztkSlVxFJTjHIGuOS2sDuixNJOfwT1R/bU6+WribYYI/tjmXSZoBFSJL79gqccBXJhS3krlVpxVPgms47bLFNCkV09zpGtBpPkWZZelHgAPtEOgVlaNzfJuAfqSyfIpQcX5UNGAMsuol6Q1YGPMvPL2gRgY4m54AAAAASUVORK5CYII=",
    "static/image/filetype/torrent.gif":
      "data:image/webp;base64,UklGRnQYAABXRUJQVlA4WAoAAAA0AAAAXwAAXwAASUNDUMgHAAAAAAfIYXBwbAIgAABtbnRyUkdCIFhZWiAH2QACABkACwAaAAthY3NwQVBQTAAAAABhcHBsAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAAG9kc2NtAAABeAAABYpjcHJ0AAAHBAAAADh3dHB0AAAHPAAAABRyWFlaAAAHUAAAABRnWFlaAAAHZAAAABRiWFlaAAAHeAAAABRyVFJDAAAHjAAAAA5jaGFkAAAHnAAAACxiVFJDAAAHjAAAAA5nVFJDAAAHjAAAAA5kZXNjAAAAAAAAABRHZW5lcmljIFJHQiBQcm9maWxlAAAAAAAAAAAAAAAUR2VuZXJpYyBSR0IgUHJvZmlsZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbWx1YwAAAAAAAAAfAAAADHNrU0sAAAAoAAABhGRhREsAAAAkAAABrGNhRVMAAAAkAAAB0HZpVk4AAAAkAAAB9HB0QlIAAAAmAAACGHVrVUEAAAAqAAACPmZyRlUAAAAoAAACaGh1SFUAAAAoAAACkHpoVFcAAAASAAACuGtvS1IAAAAWAAACym5iTk8AAAAmAAAC4GNzQ1oAAAAiAAADBmhlSUwAAAAeAAADKHJvUk8AAAAkAAADRmRlREUAAAAsAAADaml0SVQAAAAoAAADlnN2U0UAAAAmAAAC4HpoQ04AAAASAAADvmphSlAAAAAaAAAD0GVsR1IAAAAiAAAD6nB0UE8AAAAmAAAEDG5sTkwAAAAoAAAEMmVzRVMAAAAmAAAEDHRoVEgAAAAkAAAEWnRyVFIAAAAiAAAEfmZpRkkAAAAoAAAEoGhySFIAAAAoAAAEyHBsUEwAAAAsAAAE8HJ1UlUAAAAiAAAFHGVuVVMAAAAmAAAFPmFyRUcAAAAmAAAFZABWAWEAZQBvAGIAZQBjAG4A/QAgAFIARwBCACAAcAByAG8AZgBpAGwARwBlAG4AZQByAGUAbAAgAFIARwBCAC0AcAByAG8AZgBpAGwAUABlAHIAZgBpAGwAIABSAEcAQgAgAGcAZQBuAOgAcgBpAGMAQx6lAHUAIABoAOwAbgBoACAAUgBHAEIAIABDAGgAdQBuAGcAUABlAHIAZgBpAGwAIABSAEcAQgAgAEcAZQBuAOkAcgBpAGMAbwQXBDAEMwQwBDsETAQ9BDgEOQAgBD8EQAQ+BEQEMAQ5BDsAIABSAEcAQgBQAHIAbwBmAGkAbAAgAGcA6QBuAOkAcgBpAHEAdQBlACAAUgBWAEIAwQBsAHQAYQBsAOEAbgBvAHMAIABSAEcAQgAgAHAAcgBvAGYAaQBskBp1KABSAEcAQoJyX2ljz4/wx3y8GAAgAFIARwBCACDVBLhc0wzHfABHAGUAbgBlAHIAaQBzAGsAIABSAEcAQgAtAHAAcgBvAGYAaQBsAE8AYgBlAGMAbgD9ACAAUgBHAEIAIABwAHIAbwBmAGkAbAXkBegF1QXkBdkF3AAgAFIARwBCACAF2wXcBdwF2QBQAHIAbwBmAGkAbAAgAFIARwBCACAAZwBlAG4AZQByAGkAYwBBAGwAbABnAGUAbQBlAGkAbgBlAHMAIABSAEcAQgAtAFAAcgBvAGYAaQBsAFAAcgBvAGYAaQBsAG8AIABSAEcAQgAgAGcAZQBuAGUAcgBpAGMAb2ZukBoAUgBHAEJjz4/wZYdO9k4AgiwAIABSAEcAQgAgMNcw7TDVMKEwpDDrA5MDtQO9A7kDugPMACADwAPBA78DxgOvA7sAIABSAEcAQgBQAGUAcgBmAGkAbAAgAFIARwBCACAAZwBlAG4A6QByAGkAYwBvAEEAbABnAGUAbQBlAGUAbgAgAFIARwBCAC0AcAByAG8AZgBpAGUAbA5CDhsOIw5EDh8OJQ5MACAAUgBHAEIAIA4XDjEOSA4nDkQOGwBHAGUAbgBlAGwAIABSAEcAQgAgAFAAcgBvAGYAaQBsAGkAWQBsAGUAaQBuAGUAbgAgAFIARwBCAC0AcAByAG8AZgBpAGkAbABpAEcAZQBuAGUAcgBpAQ0AawBpACAAUgBHAEIAIABwAHIAbwBmAGkAbABVAG4AaQB3AGUAcgBzAGEAbABuAHkAIABwAHIAbwBmAGkAbAAgAFIARwBCBB4EMQRJBDgEOQAgBD8EQAQ+BEQEOAQ7BEwAIABSAEcAQgBHAGUAbgBlAHIAaQBjACAAUgBHAEIAIABQAHIAbwBmAGkAbABlBkUGRAZB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FUoAAFhNUCBXAwAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj45NjwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj45NjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpYUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDI1LTA1LTMxVDAxOjE2OjE3KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgUHJvIDMuNi4xNzwveG1wOkNyZWF0b3JUb29sPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAA==",
    "static/image/common/settop.png": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjZWE1ODBjIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMS4yOCAxLjIyYS43NS43NSAwIDAgMC0xLjI2LjdMNi42OSA1LjI1SDQuMjA2Yy0xLjExNCAwLTEuNjcxIDEuMzQ2LS44ODQgMi4xMzRsMS45MTEgMS45MTFsLTMuNzIgNC4xMzVBMiAyIDAgMCAwIDEgMTQuNzY4VjE1aC4yMzNhMiAyIDAgMCAwIDEuMzM3LS41MTNsNC4xMzUtMy43MjFsMS45MTEgMS45MWMuNzg4Ljc4OCAyLjEzNC4yMyAyLjEzNC0uODgzVjkuMzFsMy4zMy0zLjMzYS43NS43NSAwIDAgMCAuNy0xLjI2MWwtLjYwMy0uNjA0bC0yLjI5My0yLjI5M3oiIGNsaXAtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==",
    "static/image/stamp/001.small.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyOCAxMjgiPjxwYXRoIGZpbGw9IiNmY2MyMWIiIGQ9Im04MS40OSA3NS4zbDYuOTEgMjguMTVMNjQgODhsLTI0LjM5IDE1LjQ1bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuM0w2NCAyOC4zNmwxMC44MSAyNi4zOGwyOC42NiAyLjN6Ii8+PHBhdGggZmlsbD0iI2Y3OTMyOSIgZD0iTTEyNy4xOSA0OS41MmEzLjI3IDMuMjcgMCAwIDAtMi44NC0yLjI3bC00MS42NC0zLjMyTDY3LjAzIDUuNjJBMy4yNyAzLjI3IDAgMCAwIDY0IDMuNmMtMS4zMiAwLTIuNTEuNzktMy4wMiAyLjAyTDQ1LjMgNDMuOTNMMy42NSA0Ny4yNUEzLjI5IDMuMjkgMCAwIDAgLjggNDkuNTJjLS4zOCAxLjI3LjAxIDIuNjUgMS4wMyAzLjVsMzEuOSAyNi40OWwtMTAuMDMgNDAuODVjLS4zMiAxLjI5LjE4IDIuNjUgMS4yNiAzLjQyYy41Ny40MiAxLjIzLjYyIDEuOS42MmMuNjEgMCAxLjIyLS4xNyAxLjc1LS41TDY0IDEwMS41bDM1LjM5IDIyLjM5YzEuMTMuNzIgMi41Ny42NyAzLjY1LS4xMWEzLjI0NSAzLjI0NSAwIDAgMCAxLjI2LTMuNDJMOTQuMjcgNzkuNTFsMzEuOS0yNi41YTMuMjMgMy4yMyAwIDAgMCAxLjAyLTMuNDlNODEuNDkgNzUuM2w2LjkyIDI4LjE1TDY0IDg4bC0yNC40IDE1LjQ0bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuMjlMNjQgMjguMzZsMTAuODEgMjYuMzhsMjguNjYgMi4yOXoiLz48L3N2Zz4=",
    "static/image/common/digest_1.gif": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyOCAxMjgiPjxwYXRoIGZpbGw9IiNmY2MyMWIiIGQ9Im04MS40OSA3NS4zbDYuOTEgMjguMTVMNjQgODhsLTI0LjM5IDE1LjQ1bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuM0w2NCAyOC4zNmwxMC44MSAyNi4zOGwyOC42NiAyLjN6Ii8+PHBhdGggZmlsbD0iI2Y3OTMyOSIgZD0iTTEyNy4xOSA0OS41MmEzLjI3IDMuMjcgMCAwIDAtMi44NC0yLjI3bC00MS42NC0zLjMyTDY3LjAzIDUuNjJBMy4yNyAzLjI3IDAgMCAwIDY0IDMuNmMtMS4zMiAwLTIuNTEuNzktMy4wMiAyLjAyTDQ1LjMgNDMuOTNMMy42NSA0Ny4yNUEzLjI5IDMuMjkgMCAwIDAgLjggNDkuNTJjLS4zOCAxLjI3LjAxIDIuNjUgMS4wMyAzLjVsMzEuOSAyNi40OWwtMTAuMDMgNDAuODVjLS4zMiAxLjI5LjE4IDIuNjUgMS4yNiAzLjQyYy41Ny40MiAxLjIzLjYyIDEuOS42MmMuNjEgMCAxLjIyLS4xNyAxLjc1LS41TDY0IDEwMS41bDM1LjM5IDIyLjM5YzEuMTMuNzIgMi41Ny42NyAzLjY1LS4xMWEzLjI0NSAzLjI0NSAwIDAgMCAxLjI2LTMuNDJMOTQuMjcgNzkuNTFsMzEuOS0yNi41YTMuMjMgMy4yMyAwIDAgMCAxLjAyLTMuNDlNODEuNDkgNzUuM2w2LjkyIDI4LjE1TDY0IDg4bC0yNC40IDE1LjQ0bDYuOTItMjguMTVsLTIyLTE4LjI2bDI4LjY3LTIuMjlMNjQgMjguMzZsMTAuODEgMjYuMzhsMjguNjYgMi4yOXoiLz48L3N2Zz4=",
    "static/image/common/systempm.png":
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiCiAgIGhlaWdodD0iMjQiCiAgIHZpZXdCb3g9IjAgMCAyNCAyNCIKICAgd2lkdGg9IjI0IgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJtYXJrLWVtYWlsLXVucmVhZC1yb3VuZC0yNHB4LnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczEiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcxIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iNDAuNzE5MTU5IgogICAgIGlua3NjYXBlOmN4PSIxMi43OTQ5NiIKICAgICBpbmtzY2FwZTpjeT0iMTIuMDIxMzY4IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTg4IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIzMDM0IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxMjMiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJnMSIgLz4KICA8ZwogICAgIGlkPSJnMSI+CiAgICA8cmVjdAogICAgICAgZmlsbD0ibm9uZSIKICAgICAgIGhlaWdodD0iMjQiCiAgICAgICB3aWR0aD0iMjQiCiAgICAgICB4PSIwIgogICAgICAgaWQ9InJlY3QxIiAvPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMTksMTAgYyAxLjEzLDAgMi4xNiwtMC4zOSAzLC0xLjAyIFYgMTggYyAwLDEuMSAtMC45LDIgLTIsMiBIIDQgQyAyLjksMjAgMiwxOS4xIDIsMTggViA2IEMgMiw0LjkgMi45LDQgNCw0IEggMTQuMSBDIDE0LjA0LDQuMzIgMTQsNC42NiAxNCw1IGMgMCwxLjQ4IDAuNjUsMi43OSAxLjY3LDMuNzEgTCAxMiwxMSA1LjMsNi44MSBDIDQuNzMsNi40NiA0LDYuODYgNCw3LjUzIDQsNy44MiA0LjE1LDguMDkgNC40LDguMjUgbCA3LjA3LDQuNDIgYyAwLjMyLDAuMiAwLjc0LDAuMiAxLjA2LDAgTCAxNy4zLDkuNjkgQyAxNy44NCw5Ljg4IDE4LjQsMTAgMTksMTAgWiBNIDE2LDUgYyAwLDEuNjYgMS4zNCwzIDMsMyAxLjY2LDAgMywtMS4zNCAzLC0zIDAsLTEuNjYgLTEuMzQsLTMgLTMsLTMgLTEuNjYsMCAtMywxLjM0IC0zLDMgeiIKICAgICAgIGlkPSJwYXRoMSIKICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic2Nzc3Nzc3Njc2NjY3NjY2Njc3Nzc3NzIgogICAgICAgc3R5bGU9ImZpbGw6I2ZmY2MwMDtmaWxsLW9wYWNpdHk6MSIgLz4KICA8L2c+Cjwvc3ZnPgo=",
    "static/image/stamp/011.small.gif":
      "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjI0IgogICBoZWlnaHQ9IjI0IgogICB2aWV3Qm94PSIwIDAgMzYgMzYiCiAgIHZlcnNpb249IjEuMSIKICAgaWQ9InN2ZzIiCiAgIHNvZGlwb2RpOmRvY25hbWU9IjIwMjUtMDQtMzAtMTIyNzQxLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS40IChlN2MzZmViMSwgMjAyNC0xMC0wOSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnMKICAgICBpZD0iZGVmczIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcyIgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzAwMDAwMCIKICAgICBib3JkZXJvcGFjaXR5PSIwLjI1IgogICAgIGlua3NjYXBlOnNob3dwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiCiAgICAgaW5rc2NhcGU6em9vbT0iMzkuNTQwOTQxIgogICAgIGlua3NjYXBlOmN4PSI4LjU5ODY4MjYiCiAgICAgaW5rc2NhcGU6Y3k9IjExLjQ0MzgzNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE3OTIiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTEyNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMjgxNiIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iOTUiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPgogIDxwYXRoCiAgICAgZmlsbD0iI2UxMWQ0OCIKICAgICBkPSJtIDM1LjEwOTAwOSwyNi4wNjY1MzggLTMuOTIsLTcuMzcyODY5IDMuODgsLTcuMDcyMTYzIGMgMC40MDQ3MjksLTAuNzQwNDExIC0wLjA3MTY5LC0xLjY4OTI1NjcgLTAuODUsLTEuNjkyODYzOCBIIDUuMjM3MTk1NCBjIC00LjEzOTM5ODYsMCAtNC4yNzEzOTU4OCwyLjk2OTkxMjggLTQuMjc2MTIxODQsNC4yMDAwOTE4IGwgLTAuMDM3OTM1NCw5Ljg3NDY2MyBjIC0wLjAwNDcyNiwxLjIzMDE4IC0wLjAxNDQwNTksMy44MzExNTYgNC4wMTA1NzQzMSwzLjgyMDczOSBsIDI5LjMxNTI5NjUsLTAuMDc1ODcgYyAwLjc3NDg4MSwtMS41MWUtNCAxLjI1NTE4OSwtMC45MzkzOTIgMC44NiwtMS42ODE3MjcgbSAtMjMuNiwtMy42ODY0MzQgaCAtMS4xMiBMIDcuMTI5MDA4OSwxNy41NDY1MzEgdiA0Ljg0NDcxIGggLTEuMTMgdiAtNi44OTM5NjcgaCAxLjEzIGwgMy4yNzAwMDAxLDQuODQ0NzEgdiAtNC44NDQ3MSBoIDEuMTIgeiBtIDYuMzMsLTUuNzY5MTAzIGggLTMuNTMgdiAxLjY1OTQ1MiBoIDMuMiB2IDEuMTEzNzI3IGggLTMuMiB2IDEuNzkzMDk5IGggMy41MyB2IDEuMTEzNzI3IGggLTQuNjYgdiAtNi43OTM3MzIgaCA0LjY1IHogbSA4LjI5LDUuNzQ2ODI4IGggLTEuMTMgbCAtMS41NSwtNS4xMTIwMDQgLTEuNTUsNS4xMzQyNzkgaCAtMS4xMiBsIC0yLC02Ljg4MjgzIGggMS4yMiBsIDEuMzIsNC45MzM4MDkgMS41MiwtNC45MzM4MDkgaCAxLjIyIGwgMS40Niw0LjkzMzgwOSAxLjMzLC00LjkzMzgwOSBoIDEuMjMgeiIKICAgICBjbGFzcz0iY2xyLWktc29saWQgY2xyLWktc29saWQtcGF0aC0xIgogICAgIGlkPSJwYXRoMSIKICAgICBzdHlsZT0iZmlsbDojZmYwMDAwO3N0cm9rZS13aWR0aDoxLjA1NTMzIgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY3Nzc3NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjIiAvPgogIDxwYXRoCiAgICAgZmlsbD0ibm9uZSIKICAgICBkPSJNMCAwaDM2djM2SDB6IgogICAgIGlkPSJwYXRoMiIgLz4KPC9zdmc+Cg==",
  };
  // 替换函数，可被外部调用
  function replaceIcons(containerElement) {
    // 确保 containerElement 是一个可以查询的元素节点
    if (!containerElement || typeof containerElement.querySelectorAll !== "function") {
      return;
    }
    const images = containerElement.querySelectorAll("img");
    images.forEach((img) => {
      // 通用头像替换：将所有小头像替换为大头像
      // 匹配模式：/uc_server/data/avatar/xxx/xx/xx/xx_avatar_small.jpg -> xxx/xx/xx/xx_avatar_big.jpg
      if (img.src.includes("/uc_server/data/avatar/") && img.src.includes("_avatar_small.jpg")) {
        img.src = img.src.replace("_avatar_small.jpg", "_avatar_big.jpg");
        return; // 头像替换完成，跳过其他替换
      }

      // 其他图标的精确匹配替换
      for (const [originalSrc, newSrc] of Object.entries(imageMap)) {
        if (img.src.includes(originalSrc)) {
          img.src = newSrc;
          break; // 找到匹配后即可中断内层循环
        }
      }
    });
  }

  // 使用全局变量跟踪样式是否已注入 - 确保只注入一次
  let stylesInjected = false;

  // 样式注入函数，确保样式只被注入一次
  function injectStyles(styles, id) {
    try {
      // 全局检查样式是否已注入，无论通过什么方式
      if (stylesInjected) {
        return;
      }

      // 检查DOM中是否存在样式元素
      if (document.getElementById(id)) {
        stylesInjected = true;
        return;
      }

      // 直接创建style元素注入（最可靠的方法）
      const styleEl = document.createElement("style");
      styleEl.id = id;
      styleEl.textContent = styles;
      styleEl.type = "text/css";

      // 插入样式到head或documentElement
      if (document.head) {
        document.head.appendChild(styleEl);
      } else if (document.documentElement) {
        // 如果head不存在，则先添加到html元素
        document.documentElement.appendChild(styleEl);

        // 设置观察器，一旦head存在就移动过去
        const docObserver = new MutationObserver(() => {
          if (document.head) {
            if (styleEl.parentNode !== document.head) {
              document.head.appendChild(styleEl);
            }
            docObserver.disconnect();
          }
        });
        docObserver.observe(document.documentElement, { childList: true });
      }

      // 标记样式已注入
      stylesInjected = true;
    } catch (error) {
      // 样式应用失败，静默处理
    }
  }

  // DOM 操作函数
  function initializeDOMHandlers() {
    // 移除悬浮属性
    const specialElement = document.getElementById("newspecialtmp");
    if (specialElement) {
      specialElement.removeAttribute("onmouseover");
    }

    // 隐藏分页按钮的文字内容，只显示图标
    const hideButtonText = () => {
      const prevButtons = document.querySelectorAll(".pg a.prev");
      const nxtButtons = document.querySelectorAll(".pg a.nxt");

      prevButtons.forEach((btn) => {
        btn.textContent = "";
        btn.innerHTML = "";
      });

      nxtButtons.forEach((btn) => {
        btn.textContent = "";
        btn.innerHTML = "";
      });
    };

    // 立即执行一次
    hideButtonText();

    // 监听DOM变化，确保动态加载的分页按钮也被处理
    const observer = new MutationObserver(() => {
      hideButtonText();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 自动收起分类
    setTimeout(() => {
      const foldButton = document.querySelector("#thread_types .fold");
      if (foldButton) {
        foldButton.click();
      }
    }, 0);
  }

  // 立即注入主样式，不等待DOM加载
  injectStyles(customStyles, STYLE_ID);

  // 设置DOM内容修改处理
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeDOMHandlers);
  } else {
    initializeDOMHandlers();
  }

  // 初始全页面图标替换和动态内容监听
  function initIconReplacement() {
    // 初始替换一次
    if (document.body) {
      replaceIcons(document.body);
    }

    // 使用 MutationObserver 监听动态添加的内容
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            // 只处理元素节点
            if (node.nodeType === 1) {
              replaceIcons(node);
            }
          });
        }
      });
    });

    // 在 body 加载后启动观察器
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          replaceIcons(document.body);
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      });
    }
  }

  // 在DOM准备好后执行图标替换初始化
  initIconReplacement();
  // #endregion

  // #region iframe背景透明处理模块
  (function () {
    "use strict";

    // 定义 ready 函数
    function ready(fn) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
      } else {
        fn();
      }
    }

    // 处理iframe背景透明 - 保留核心功能，优化性能
    function makeIframeBackgroundTransparent() {
      const iframes = document.querySelectorAll("iframe");

      iframes.forEach((iframe) => {
        // 避免重复处理
        if (iframe.dataset.transparencyProcessed) return;
        iframe.dataset.transparencyProcessed = "true";

        // 监听iframe加载完成
        iframe.addEventListener("load", function () {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
              // 设置iframe内body背景透明
              iframeDoc.body.style.background = "transparent";
              iframeDoc.body.style.backgroundColor = "transparent";
              iframeDoc.body.style.backgroundImage = "none";

              // 设置文字颜色根据当前主题
              const isDarkTheme = document.documentElement.classList.contains("theme-dark");
              const textColor = isDarkTheme ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
              iframeDoc.body.style.color = textColor;

              // 优化：使用CSS样式表代替逐个设置，但排除编辑器文本区域
              const style = iframeDoc.createElement("style");
              style.textContent = `
                          body { color: ${textColor}; } }
                          textarea, input[type="text"], .pt { color: inherit !important; }
                      `;
              if (iframeDoc.head) {
                iframeDoc.head.appendChild(style);
              }

              // 设置html元素背景透明
              if (iframeDoc.documentElement) {
                iframeDoc.documentElement.style.background = "transparent";
                iframeDoc.documentElement.style.backgroundColor = "transparent";
              }
            }
          } catch (e) {
            // 跨域iframe无法访问，静默处理
          }
        });

        // 如果iframe已经加载完成，立即处理
        if (iframe.contentDocument) {
          try {
            const iframeDoc = iframe.contentDocument;
            if (iframeDoc && iframeDoc.body) {
              iframeDoc.body.style.background = "transparent";
              iframeDoc.body.style.backgroundColor = "transparent";
              iframeDoc.body.style.backgroundImage = "none";

              const isDarkTheme = document.documentElement.classList.contains("theme-dark");
              const textColor = isDarkTheme ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
              iframeDoc.body.style.color = textColor;

              // 优化：使用CSS样式表，但排除编辑器文本区域
              const style = iframeDoc.createElement("style");
              style.textContent = `
                          body { color: ${textColor}; }
                          div, span, p, a, td, th, li { color: ${textColor}; }
                          textarea, input[type="text"], .pt { color: inherit !important; }
                      `;
              if (iframeDoc.head) {
                iframeDoc.head.appendChild(style);
              }

              if (iframeDoc.documentElement) {
                iframeDoc.documentElement.style.background = "transparent";
                iframeDoc.documentElement.style.backgroundColor = "transparent";
              }
            }
          } catch (e) {
            // 静默处理
          }
        }
      });
    }

    // 页面加载完成后处理现有iframe
    ready(() => {
      // 延迟执行避免阻塞
      setTimeout(() => {
        makeIframeBackgroundTransparent();
      }, 100);

      // 简化的监听器 - 只监听iframe添加
      const observer = new MutationObserver((mutations) => {
        let hasNewIframe = false;
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === "IFRAME") {
              hasNewIframe = true;
            }
          });
        });

        if (hasNewIframe) {
          setTimeout(() => makeIframeBackgroundTransparent(), 50);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: false, // 只监听直接子元素，减少性能消耗
      });
    });
  })();
  // #endregion

  // #region 帖子列表重构功能
  (function () {
    "use strict";

    // 全局标志防止重复初始化
    let isInitialized = false;
    let isTransforming = false;
    let loadEventBound = false;

    // 重置状态函数（用于页面导航时）
    function resetState() {
      isInitialized = false;
      isTransforming = false;
      loadEventBound = false;
    }

    // 监听页面导航事件
    window.addEventListener("beforeunload", resetState);
    window.addEventListener("pagehide", resetState);

    // 简化的页面检查 - 只要有threadlist元素就生效
    function hasThreadListElement() {
      // 检查页面是否有帖子列表的关键元素
      const hasThreadList = document.getElementById("threadlist");
      return hasThreadList;
    }

    // 检测是否为搜索页面
    function isSearchPage() {
      const url = window.location.href;
      const pathname = window.location.pathname;
      return pathname.includes("search.php") || (url.includes("mod=forum") && pathname.includes("search.php"));
    }

    // 检测是否为导读页面
    function isForumDisplayPage() {
      const url = window.location.href;
      const pathname = window.location.pathname;

      return (
        // forum.php?mod=forumdisplay 格式
        (pathname.includes("forum.php") && url.includes("mod=forumdisplay")) ||
        // forum.php?mod=guide 格式
        (pathname.includes("forum.php") && url.includes("mod=guide")) ||
        // forum-数字-数字.html 格式
        /\/forum-\d+-\d+\.html/.test(pathname)
      );
    }

    // 完整的页面检查（包括DOM元素检查）
    function shouldApplyRedesign() {
      // 只在导读页面应用重构，排除搜索页面和帖子详情页面，并且未初始化过
      return isForumDisplayPage() && hasThreadListElement() && !isSearchPage() && !isInitialized;
    }

    // 等待DOM准备就绪的函数
    function waitForDOM(callback) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
      } else {
        callback();
      }
    }

    // 等待特定元素出现的函数
    function waitForElement(selector, callback, timeout = 10000) {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          callback(element);
        }
      });

      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });

      // 设置超时
      setTimeout(() => {
        observer.disconnect();
      }, timeout);
    }

    // 主初始化函数
    function initializeScript() {
      // 再次检查是否应该应用重构
      if (!shouldApplyRedesign()) {
        return;
      }

      // 设置初始化标志
      isInitialized = true;

      // 移除早期样式
      const earlyStyle = document.getElementById("discuz-redesign-early-styles");
      if (earlyStyle) {
        earlyStyle.remove();
      }

      // 基本样式
      const style = document.createElement("style");
      style.textContent = `
/* 隐藏原始列表 */
#threadlist {
    display: none;
}
    `;
      document.head.appendChild(style);
    } // 结束 initializeScript 函数

    // 设置管理
    function getSettings() {
      return {
        autoPagination: GM_getValue("autoPagination", true),
        excludePostOptions: GM_getValue("excludePostOptions", []),
        displayBlockedTips: GM_getValue("displayBlockedTips", true),
      };
    }

    // 创建导航栏
    function createForumNavigation() {
      const navigation = document.createElement("div");
      navigation.className = "forum-navigation collapsed"; // 默认折叠状态

      // 获取当前URL参数来确定当前选中的选项
      const urlParams = new URLSearchParams(window.location.search);
      const currentFilter = urlParams.get("filter") || "";
      const currentOrderby = urlParams.get("orderby") || "";
      const currentDateline = urlParams.get("dateline") || "";

      // 获取基础URL（不包含筛选参数）
      const baseParams = Array.from(urlParams.entries())
        .filter(([key]) => !["filter", "orderby", "dateline", "digest", "specialtype"].includes(key))
        .map(([key, value]) => `${key}=${value}`);

      const baseUrl = window.location.pathname + (baseParams.length > 0 ? "?" + baseParams.join("&") : "");

      // 构建URL的辅助函数
      const buildUrl = (params) => {
        const separator = baseUrl.includes("?") ? "&" : "?";
        return baseUrl + separator + params;
      };

      // 创建导航栏的基本结构
      navigation.innerHTML = `
            <div class="nav-row collapsible">
                <span class="nav-label">全部主题</span>
                <div class="nav-links">
                    <a href="${buildUrl("filter=lastpost&orderby=lastpost")}" ${currentFilter === "lastpost" && currentOrderby === "lastpost" ? 'class="current"' : ""}>最新</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("filter=heat&orderby=heats")}" ${currentFilter === "heat" && currentOrderby === "heats" ? 'class="current"' : ""}>热门</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("filter=hot")}" ${currentFilter === "hot" ? 'class="current hot-filter-link"' : 'class="hot-filter-link"'}>热帖</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("filter=digest&digest=1&orderby=dateline")}" ${currentFilter === "digest" ? 'class="current"' : ""}>精华</a>
                    <div class="inline-hot-time-controls" style="display: none;">
                        <!-- 热帖控件将动态插入这里 -->
                    </div>
                </div>
            </div>
            <div class="nav-row collapsible-content">
                <span class="nav-label">排序:</span>
                <div class="nav-links">
                    <a href="${buildUrl("filter=author&orderby=dateline")}" ${currentFilter === "author" && currentOrderby === "dateline" ? 'class="current"' : ""}>发帖时间</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("filter=reply&orderby=replies")}" ${currentFilter === "reply" && currentOrderby === "replies" ? 'class="current"' : ""}>回复/查看</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("filter=reply&orderby=views")}" ${currentFilter === "reply" && currentOrderby === "views" ? 'class="current"' : ""}>查看</a>
                </div>
            </div>
            <div class="nav-row collapsible-content">
                <span class="nav-label">时间:</span>
                <div class="nav-links">
                    <a href="${buildUrl("orderby=dateline&filter=dateline")}" ${!currentDateline ? 'class="current"' : ""}>全部时间</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("orderby=dateline&filter=dateline&dateline=86400")}" ${currentDateline === "86400" ? 'class="current"' : ""}>一天</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("orderby=dateline&filter=dateline&dateline=172800")}" ${currentDateline === "172800" ? 'class="current"' : ""}>两天</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("orderby=dateline&filter=dateline&dateline=604800")}" ${currentDateline === "604800" ? 'class="current"' : ""}>一周</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("orderby=dateline&filter=dateline&dateline=2592000")}" ${currentDateline === "2592000" ? 'class="current"' : ""}>一个月</a>
                    <span class="pipe">|</span>
                    <a href="${buildUrl("orderby=dateline&filter=dateline&dateline=7948800")}" ${currentDateline === "7948800" ? 'class="current"' : ""}>三个月</a>
                </div>
            </div>
        `;

      // --- 重用和处理原始热帖控件 ---
      const inlineHotTimeControls = navigation.querySelector(".inline-hot-time-controls");
      const originalHottime = document.getElementById("hottime");
      const originalFilterDateline = document.getElementById("filter_dateline");

      if (originalHottime && originalFilterDateline && inlineHotTimeControls) {
        // 将原始控件移动到新导航栏
        // 决策理由：删除竖线分隔符，让日历控件更简洁

        // 决策理由：创建新的div元素而不是克隆img，避免原始图片覆盖新图标
        const clonedHottime = document.createElement("div");
        clonedHottime.id = "hottime-inline";
        clonedHottime.className = "hottime-icon"; // 添加类名便于样式控制

        // 决策理由：确保新元素保留所有必要的属性
        // 保留原始的fid属性（论坛ID）
        if (originalHottime.getAttribute("fid")) {
          clonedHottime.setAttribute("fid", originalHottime.getAttribute("fid"));
        }
        // 保留原始的value属性（当前日期）
        if (originalHottime.getAttribute("value")) {
          clonedHottime.setAttribute("value", originalHottime.getAttribute("value"));
        }

        // 设置基本样式属性 - 移除内联样式，使用CSS类
        clonedHottime.setAttribute("align", "absmiddle");

        inlineHotTimeControls.appendChild(clonedHottime);

        // 克隆filter_dateline元素并设置新ID
        const clonedFilterDateline = originalFilterDateline.cloneNode(true);
        clonedFilterDateline.id = "filter_dateline-inline";

        // 决策理由：移除showmenu类和相关属性，去掉下拉箭头样式
        clonedFilterDateline.classList.remove("showmenu");
        clonedFilterDateline.removeAttribute("onclick");
        clonedFilterDateline.onclick = null;

        inlineHotTimeControls.appendChild(clonedFilterDateline);

        // 决策理由：移除所有原始事件处理器，绑定新的日历功能
        clonedHottime.removeAttribute("onclick");
        clonedHottime.onclick = null;

        // 绑定新的点击事件
        clonedHottime.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const triggerImg = this;
          createSHTCalendar(triggerImg, function (selectedDate) {
            if (selectedDate) {
              updateAndTriggerViewhot(selectedDate, triggerImg);
            }
          });
        });

        // 隐藏原始控件以避免重复显示
        if (originalHottime.parentNode) {
          originalHottime.style.display = "none";
        }
        if (originalFilterDateline.parentNode) {
          originalFilterDateline.style.display = "none";
        }
      }

      // 添加折叠/展开功能
      const collapsibleRow = navigation.querySelector(".nav-row.collapsible");
      if (collapsibleRow) {
        collapsibleRow.addEventListener("click", function (e) {
          if (e.target.tagName === "A" || e.target.closest(".nav-links")) return;
          navigation.classList.toggle("collapsed");
          GM_setValue("navigationCollapsed", navigation.classList.contains("collapsed"));
        });
      }

      // 处理热帖链接点击
      const hotFilterLink = navigation.querySelector(".hot-filter-link");
      if (hotFilterLink && inlineHotTimeControls) {
        hotFilterLink.addEventListener("click", () => {
          setTimeout(() => (inlineHotTimeControls.style.display = "inline-flex"), 100);
        });
      }

      // 检查当前是否是热帖页面，如果是则自动显示控件
      if (currentFilter === "hot" && inlineHotTimeControls) {
        inlineHotTimeControls.style.display = "inline-flex";
      }

      // 从本地存储恢复折叠状态
      const savedCollapsedState = GM_getValue("navigationCollapsed", true);
      if (savedCollapsedState) {
        navigation.classList.add("collapsed");
      } else {
        navigation.classList.remove("collapsed");
      }
      return navigation;
    }

    // 检查并显示热帖时间控件
    function checkAndShowHotTimeControls() {
      const urlParams = new URLSearchParams(window.location.search);
      const currentFilter = urlParams.get("filter") || "";

      // 决策理由：使用正确的time参数而不是date参数，与原始viewhot函数保持一致
      const currentTime = urlParams.get("time") || "";
      const currentDate = urlParams.get("date") || ""; // 保留作为备用

      if (currentFilter === "hot") {
        const inlineHotTimeControls = document.querySelector(".inline-hot-time-controls");
        if (inlineHotTimeControls) {
          inlineHotTimeControls.style.display = "inline-flex";

          // 更新当前日期显示
          const filterDatelineSpan = inlineHotTimeControls.querySelector("#filter_dateline-inline");
          if (filterDatelineSpan) {
            // 决策理由：检查是否已有用户选择的日期，如果有则不覆盖
            const isUserSelected = filterDatelineSpan.getAttribute("data-user-selected") === "true";
            const userSelectedDate = filterDatelineSpan.getAttribute("data-selected-date");

            if (isUserSelected && userSelectedDate && userSelectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
              return; // 不覆盖用户选择的日期
            }

            let dateStr;

            // 决策理由：优先使用URL中的time参数，然后是date参数，最后使用当前日期
            if (currentTime && currentTime.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dateStr = currentTime;
            } else if (currentDate && currentDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
              dateStr = currentDate;
            } else {
              // 尝试从原始hottime元素获取当前值
              const originalHottime = document.getElementById("hottime");
              if (originalHottime && originalHottime.getAttribute("value")) {
                const originalValue = originalHottime.getAttribute("value");
                if (originalValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
                  dateStr = originalValue;
                }
              }

              // 如果还是没有有效日期，使用当前日期
              if (!dateStr) {
                const now = new Date();
                dateStr = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
              }
            }

            filterDatelineSpan.textContent = dateStr;
            filterDatelineSpan.classList.add("current-date");

            // 同时更新hottime元素的value属性
            const hottimeElement = inlineHotTimeControls.querySelector("#hottime-inline");
            if (hottimeElement) {
              hottimeElement.setAttribute("value", dateStr);
              hottimeElement.value = dateStr; // 同时设置value属性
            }
          }
        } else {
        }
      } else {
        // 隐藏热帖时间控件
        const inlineHotTimeControls = document.querySelector(".inline-hot-time-controls");
        if (inlineHotTimeControls) {
          inlineHotTimeControls.style.display = "none";
        }
      }
    }

    // --- 轻量级日历组件 ---
    function createSHTCalendar(targetElement, callback) {
      // 防止重复创建
      if (document.getElementById("sht-calendar-wrapper")) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.id = "sht-calendar-wrapper";

      let currentDate = new Date();

      function renderCalendar(date) {
        wrapper.innerHTML = ""; // 清空内容

        const header = document.createElement("div");
        header.className = "sht-calendar-header";

        const prevMonthBtn = document.createElement("button");
        prevMonthBtn.textContent = "<";
        prevMonthBtn.className = "sht-calendar-nav-btn";
        prevMonthBtn.onclick = () => {
          currentDate.setMonth(currentDate.getMonth() - 1);
          renderCalendar(currentDate);
        };

        const monthYearLabel = document.createElement("span");
        monthYearLabel.textContent = `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
        monthYearLabel.className = "sht-calendar-month-label";

        const nextMonthBtn = document.createElement("button");
        nextMonthBtn.textContent = ">";
        nextMonthBtn.className = "sht-calendar-nav-btn";
        nextMonthBtn.onclick = () => {
          currentDate.setMonth(currentDate.getMonth() + 1);
          renderCalendar(currentDate);
        };

        header.appendChild(prevMonthBtn);
        header.appendChild(monthYearLabel);
        header.appendChild(nextMonthBtn);
        wrapper.appendChild(header);

        const daysGrid = document.createElement("div");
        daysGrid.className = "sht-calendar-days-grid";

        // 添加星期头部
        const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
        weekdays.forEach((day) => {
          const dayLabel = document.createElement("div");
          dayLabel.textContent = day;
          dayLabel.className = "sht-calendar-weekday";
          daysGrid.appendChild(dayLabel);
        });

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // 填充空白日期
        for (let i = 0; i < firstDayOfMonth; i++) {
          daysGrid.appendChild(document.createElement("div"));
        }

        // 填充日期
        for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement("div");
          dayCell.textContent = day;
          dayCell.className = "sht-calendar-day-cell";

          dayCell.onclick = () => {
            const selectedDate = new Date(year, month, day);
            const dateString = selectedDate.getFullYear() + "-" + String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" + String(selectedDate.getDate()).padStart(2, "0");
            if (typeof callback === "function") {
              callback(dateString);
            }
            closeCalendar();
          };
          daysGrid.appendChild(dayCell);
        }

        wrapper.appendChild(daysGrid);
      }

      function closeCalendar() {
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
        document.removeEventListener("click", handleOutsideClick, true);
      }

      function handleOutsideClick(event) {
        if (!wrapper.contains(event.target) && event.target !== targetElement) {
          closeCalendar();
        }
      }

      // 定位日历 - 动态位置使用内联样式是合理的
      const rect = targetElement.getBoundingClientRect();
      wrapper.style.top = `${rect.bottom + window.scrollY + 5}px`;
      wrapper.style.left = `${rect.left + window.scrollX}px`;

      document.body.appendChild(wrapper);
      renderCalendar(currentDate);

      // 延迟添加事件监听器以避免立即关闭
      setTimeout(() => {
        document.addEventListener("click", handleOutsideClick, true);
      }, 0);
    }

    // 更新日期并触发 viewhot
    function updateAndTriggerViewhot(selectedDate, triggerImg) {
      if (!selectedDate) return;

      // 格式化日期字符串
      let dateStr = selectedDate;
      if (typeof selectedDate !== "string" || !selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(selectedDate);
        if (!isNaN(date.getTime())) {
          dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
        }
      }

      // 决策理由：立即更新日期显示，防止被后续的checkAndShowHotTimeControls覆盖
      updateDateDisplay(dateStr);

      // 决策理由：完全模拟原始viewhot函数的行为
      // 原始viewhot: window.location.href = "forum.php?mod=forumdisplay&filter=hot&fid="+obj.getAttribute('fid')+"&time="+obj.value;

      // 首先尝试使用原始viewhot函数
      const viewhotFunc = window.originalViewhot || window.viewhot;
      if (viewhotFunc && typeof viewhotFunc === "function") {
        try {
          // 确保triggerImg有正确的属性
          if (triggerImg && triggerImg.getAttribute("fid")) {
            viewhotFunc(triggerImg);
            return;
          } else {
          }
        } catch (error) { }
      }

      // 备用方案：完全模拟原始viewhot的URL构建逻辑
      simulateOriginalViewhot(dateStr, triggerImg);
    }

    // 统一的日期显示更新函数
    function updateDateDisplay(dateStr) {
      // 决策理由：支持多种DOM元素查找方式，确保在不同布局下都能找到正确的日期显示元素
      let filterDatelineSpan = document.getElementById("filter_dateline");
      if (!filterDatelineSpan) {
        filterDatelineSpan = document.getElementById("filter_dateline-inline");
      }
      if (!filterDatelineSpan) {
        filterDatelineSpan = document.querySelector(".inline-hot-time-controls #filter_dateline-inline");
      }

      // 更新日期显示
      if (filterDatelineSpan) {
        filterDatelineSpan.textContent = dateStr;
        filterDatelineSpan.classList.add("current-date");
        // 设置一个标记，表示这是用户选择的日期
        filterDatelineSpan.setAttribute("data-user-selected", "true");
        filterDatelineSpan.setAttribute("data-selected-date", dateStr);
      }

      // 同时更新所有相关的hottime元素
      const hottimeElements = [document.getElementById("hottime"), document.getElementById("hottime-inline"), document.querySelector(".inline-hot-time-controls #hottime-inline")].filter((el) => el !== null);

      hottimeElements.forEach((element) => {
        element.setAttribute("value", dateStr);
        if (element.hasOwnProperty("value")) {
          element.value = dateStr;
        }
      });
    }

    // 模拟原始viewhot函数的行为
    function simulateOriginalViewhot(dateStr, triggerImg) {
      try {
        // 获取fid参数
        let fid = null;

        // 从triggerImg获取fid
        if (triggerImg && triggerImg.getAttribute("fid")) {
          fid = triggerImg.getAttribute("fid");
        }

        // 如果没有fid，尝试从URL获取
        if (!fid) {
          const urlParams = new URLSearchParams(window.location.search);
          fid = urlParams.get("fid");
        }

        // 如果还是没有fid，尝试从原始hottime元素获取
        if (!fid) {
          const originalHottime = document.getElementById("hottime");
          if (originalHottime) {
            fid = originalHottime.getAttribute("fid");
          }
        }

        if (!fid) {
          return;
        }

        // 决策理由：完全按照原始viewhot的URL格式构建
        const newUrl = `forum.php?mod=forumdisplay&filter=hot&fid=${fid}&time=${dateStr}`;

        // 跳转到新URL
        window.location.href = newUrl;
      } catch (error) {
        // 最后的备用方案
        fallbackDateFilter(dateStr);
      }
    }

    // 备用日期筛选方案
    function fallbackDateFilter(dateStr) {
      try {
        const currentUrl = new URL(window.location.href);
        const params = currentUrl.searchParams;

        // 获取fid参数
        let fid = params.get("fid");
        if (!fid) {
          const originalHottime = document.getElementById("hottime");
          if (originalHottime) {
            fid = originalHottime.getAttribute("fid");
          }
        }

        if (!fid) {
          return;
        }

        // 决策理由：使用正确的URL参数格式，与原始viewhot函数保持一致
        // 原始格式：forum.php?mod=forumdisplay&filter=hot&fid=X&time=YYYY-MM-DD
        params.set("mod", "forumdisplay");
        params.set("filter", "hot");
        params.set("fid", fid);
        params.set("time", dateStr); // 使用time而不是date

        // 移除可能冲突的参数
        params.delete("orderby");
        params.delete("page");
        params.delete("date"); // 删除错误的date参数
        params.delete("dateline");

        // 构建新URL并跳转
        const newUrl = currentUrl.origin + currentUrl.pathname + "?" + params.toString();

        // 使用replace而不是href，避免在历史记录中留下多个条目
        window.location.replace(newUrl);
      } catch (error) {
        // 最后的备用方案：使用相对路径
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const fid = urlParams.get("fid") || "2"; // 默认使用fid=2
          const fallbackUrl = `forum.php?mod=forumdisplay&filter=hot&fid=${fid}&time=${dateStr}`;

          window.location.replace(fallbackUrl);
        } catch (finalError) { }
      }
    }

    // 根据space-uid生成头像地址
    function generateAvatarUrl(spaceUid) {
      // 如果没有spaceUid，返回默认头像
      if (!spaceUid) {
        return DEFAULT_AVATAR_BASE64;
      }

      // 将uid转换为9位数字字符串，前面补0
      const uidStr = spaceUid.toString().padStart(9, "0");

      // 按每两位分组：000/42/81/19
      // 对于428119，补0后变成000428119，分组为：000/42/81/19
      const part1 = uidStr.slice(0, 3); // 000
      const part2 = uidStr.slice(3, 5); // 42
      const part3 = uidStr.slice(5, 7); // 81
      const part4 = uidStr.slice(7, 9); // 19

      // 构建头像URL
      const baseUrl = window.location.origin;
      return `${baseUrl}/uc_server/data/avatar/${part1}/${part2}/${part3}/${part4}_avatar_middle.jpg`;
    }

    // 提取space-uid
    function extractSpaceUid(row) {
      // 方法1: 查找作者链接中的space-uid（旧格式）
      const authorLink = row.querySelector("td.by cite a");
      if (authorLink && authorLink.href) {
        // 尝试匹配 space-uid-数字 格式
        let match = authorLink.href.match(/space-uid-(\d+)/);
        if (match) {
          const uid = parseInt(match[1]);
          return uid;
        }

        // 尝试匹配 uid=数字 格式（新格式）
        match = authorLink.href.match(/[?&]uid=(\d+)/);
        if (match) {
          const uid = parseInt(match[1]);
          return uid;
        }
      }

      // 方法2: 查找任何包含uid的链接
      const allLinks = row.querySelectorAll('a[href*="uid"]');
      for (const link of allLinks) {
        if (link.href) {
          // 尝试匹配 space-uid-数字 格式
          let match = link.href.match(/space-uid-(\d+)/);
          if (match) {
            const uid = parseInt(match[1]);
            return uid;
          }

          // 尝试匹配 uid=数字 格式
          match = link.href.match(/[?&]uid=(\d+)/);
          if (match) {
            const uid = parseInt(match[1]);
            return uid;
          }
        }
      }

      // 未找到任何uid
      return null;
    }

    // 提取帖子ID的函数
    function extractThreadId(link) {
      // 匹配 thread-123456-1-1.html 格式
      const threadMatch = link.match(/thread-(\d+)-/);
      if (threadMatch) {
        return threadMatch[1];
      }

      // 匹配 tid=123456 格式
      const tidMatch = link.match(/tid=(\d+)/);
      if (tidMatch) {
        return tidMatch[1];
      }

      return null;
    }

    // 处理帖子行函数
    function processThreadRow(row, isSticky = false) {
      // 提取帖子信息
      const titleElement = row.querySelector("a.xst") || row.querySelector("a.s.xst");
      if (!titleElement) return null;

      const title = titleElement.textContent;
      const link = titleElement.href;
      // 保留完整的链接HTML，包括样式
      const titleLinkHtml = titleElement.outerHTML;

      // 提取帖子ID用于唯一标识
      const threadId = extractThreadId(link);

      // 提取作者信息
      const authorElement = row.querySelector("td.by cite a");
      const author = authorElement ? authorElement.textContent : "未知作者";
      // 保留完整的作者链接HTML，但移除颜色样式
      let authorLinkHtml = author;
      if (authorElement) {
        // 克隆元素并移除style属性中的颜色
        const clonedElement = authorElement.cloneNode(true);
        clonedElement.removeAttribute("style");
        authorLinkHtml = clonedElement.outerHTML;
      }

      // 提取space-uid并生成头像地址
      const spaceUid = extractSpaceUid(row);
      const avatarUrl = generateAvatarUrl(spaceUid);

      // 提取版块信息
      let forumInfo = "";
      let forumLinkHtml = "";
      const forumElement = row.querySelector("td.by a[href*='mod=forumdisplay']");
      if (forumElement) {
        forumInfo = forumElement.textContent;
        forumLinkHtml = forumElement.outerHTML;
      }

      // 提取发帖时间和回复时间
      const byElements = row.querySelectorAll("td.by");
      let postTime = "";
      let replyTime = "";

      // 根据td.by元素的数量来判断页面类型
      if (byElements.length >= 3) {
        // 导读页面：第2个td.by是发表时间，第3个td.by是最后回复时间
        // 发表时间
        let postTimeElement = byElements[1].querySelector("em span") || byElements[1].querySelector("em");

        if (postTimeElement) {
          postTime = postTimeElement.textContent || postTimeElement.getAttribute("title") || "";
          if (!postTime) {
            const innerSpan = postTimeElement.querySelector("span[title]");
            if (innerSpan) {
              postTime = innerSpan.getAttribute("title") || innerSpan.textContent || "";
            }
          }
        }

        // 最后回复时间
        let replyTimeElement = byElements[2].querySelector("em a") || byElements[2].querySelector("em span span") || byElements[2].querySelector("em span") || byElements[2].querySelector("em");

        if (replyTimeElement) {
          replyTime = replyTimeElement.textContent || replyTimeElement.getAttribute("title") || "";
          if (!replyTime || replyTime.trim() === "") {
            const innerSpan = replyTimeElement.querySelector("span[title]");
            if (innerSpan) {
              replyTime = innerSpan.getAttribute("title") || innerSpan.textContent || "";
            }
          }
        }
      } else if (byElements.length >= 2) {
        // 普通论坛页面：第1个td.by是发表时间，第2个td.by是最后回复时间
        // 发表时间
        let postTimeElement = byElements[0].querySelector("em span") || byElements[0].querySelector("em");

        if (postTimeElement) {
          postTime = postTimeElement.textContent || postTimeElement.getAttribute("title") || "";
          if (!postTime) {
            const innerSpan = postTimeElement.querySelector("span[title]");
            if (innerSpan) {
              postTime = innerSpan.getAttribute("title") || innerSpan.textContent || "";
            }
          }
        }

        // 最后回复时间
        let replyTimeElement = byElements[1].querySelector("em a") || byElements[1].querySelector("em span span") || byElements[1].querySelector("em span") || byElements[1].querySelector("em");

        if (replyTimeElement) {
          replyTime = replyTimeElement.textContent || replyTimeElement.getAttribute("title") || "";
          if (!replyTime || replyTime.trim() === "") {
            const innerSpan = replyTimeElement.querySelector("span[title]");
            if (innerSpan) {
              replyTime = innerSpan.getAttribute("title") || innerSpan.textContent || "";
            }
          }
        }
      }

      // 提取回复数和查看数
      const replyElement = row.querySelector("td.num a");
      const viewElement = row.querySelector("td.num em");
      const replies = replyElement ? replyElement.textContent : "0";
      const views = viewElement ? viewElement.textContent : "0";

      // 提取分类标签并去掉方括号和字体颜色
      const categoryElement = row.querySelector("th em");
      let categoryHtml = "";
      if (categoryElement) {
        // 克隆元素以避免修改原始DOM
        const clonedElement = categoryElement.cloneNode(true);

        // 去除所有font标签的color属性
        const fontElements = clonedElement.querySelectorAll("font[color]");
        fontElements.forEach((font) => {
          font.removeAttribute("color");
        });

        // 获取处理后的HTML并去掉方括号
        categoryHtml = clonedElement.outerHTML.replace(/\[/g, "").replace(/\]/g, "");
      }

      // 提取所有图标（精华、附件、热度等）
      const titleCell = row.querySelector("th");
      const icons = titleCell ? titleCell.querySelectorAll("img") : [];
      let iconsHtml = "";
      icons.forEach((icon) => {
        if (icon.src && !icon.src.includes("folder_")) {
          // 排除文件夹图标
          iconsHtml += icon.outerHTML + " ";
        }
      });

      // 不显示页数链接
      const pagesHtml = "";

      // 提取New标记
      const newElement = row.querySelector("a.xi1");
      const newHtml = newElement ? newElement.outerHTML : "";

      // 创建卡片元素
      const card = document.createElement("div");
      card.className = "thread-card" + (isSticky ? " sticky" : "");

      // 添加唯一标识，用于防止重复
      if (threadId) {
        card.setAttribute("data-thread-id", threadId);
      }

      // 构建卡片HTML
      if (isSticky) {
        // 置顶帖：只显示标题，不显示其他信息
        card.innerHTML = `
                <div class="thread-avatar">
                    <img src="${avatarUrl}" alt="${author}" onerror="this.src='${DEFAULT_AVATAR_BASE64}'">
                </div>
                <div class="thread-content">
                    <div class="thread-title">
                        <span class="sticky-tag">置顶</span>
                        <a href="${link}">${title}</a>
                    </div>
                </div>
            `;
      } else {
        // 普通帖：包含完整信息
        card.innerHTML = `
                <div class="thread-avatar">
                    <img src="${avatarUrl}" alt="${author}" onerror="this.src='${DEFAULT_AVATAR_BASE64}'">
                </div>
                <div class="thread-content">
                    <div class="thread-title">
                        ${categoryHtml}
                        ${titleLinkHtml}
                        ${iconsHtml}
                        ${pagesHtml}
                        ${newHtml}
                    </div>
                    <div class="thread-info">
                        ${forumLinkHtml ? `<span class="thread-forum">${forumLinkHtml}</span>` : ""}
                        <span class="thread-author">${authorLinkHtml}</span>
                        <span class="thread-time">${postTime}</span>
                        <span class="thread-reply-time">${replyTime}</span>
                        <span class="thread-replies">回复: ${replies}</span>
                        <span class="thread-views">查看: ${views}</span>
                    </div>
                </div>
            `;
      }

      return card;
    }

    // 关键字屏蔽功能
    function blockContentByTitleInRedesignedLayout(settings) {
      const { excludePostOptions, displayBlockedTips } = settings;
      const threadCards = document.querySelectorAll(".thread-card");

      if (!excludePostOptions || excludePostOptions.length === 0) {
        return;
      }

      threadCards.forEach((card) => {
        // 跳过已经被屏蔽的卡片
        if (card.style.display === "none" || card.innerHTML.includes("已屏蔽主题")) {
          return;
        }

        const titleElement = card.querySelector(".thread-title a");
        if (!titleElement) return;

        const title = titleElement.textContent;

        // 检查标题是否包含屏蔽关键词
        const shouldBlock = excludePostOptions.some((keyword) => {
          if (keyword && keyword.trim()) {
            return title.toLowerCase().includes(keyword.toLowerCase().trim());
          }
          return false;
        });

        if (shouldBlock) {
          if (displayBlockedTips) {
            // 显示屏蔽提示
            card.innerHTML = `
                        <div class="thread-content" style="padding: 10px; color: #666; font-style: italic;">
                            已屏蔽主题关键词: ${excludePostOptions.filter((keyword) => keyword && title.toLowerCase().includes(keyword.toLowerCase().trim())).join(", ")}
                        </div>
                    `;
          } else {
            // 完全隐藏
            card.style.display = "none";
          }
        }
      });
    }

    // 主函数
    function transformThreadList() {
      // 防止重复执行
      if (isTransforming) {
        return;
      }

      // 检查是否已经存在重构后的列表
      if (document.querySelector(".redesigned-thread-list")) {
        return;
      }

      const originalThreadList = document.getElementById("threadlist");
      if (!originalThreadList) return;

      // 设置执行标志
      isTransforming = true;

      try {
        // 早期保存原始函数，确保在任何DOM操作之前
        if (window.showcalendar && !window.originalShowcalendar) {
          window.originalShowcalendar = window.showcalendar;
        }
        if (window.viewhot && !window.originalViewhot) {
          window.originalViewhot = window.viewhot;
        }

        // 早期保存原始函数，确保在任何DOM操作之前
        if (window.viewhot && !window.originalViewhot) {
          window.originalViewhot = window.viewhot;
        }

        // 创建导航栏
        const navigation = createForumNavigation();

        // 延迟检查并显示热帖时间控件（确保DOM已完全渲染）
        setTimeout(() => {
          checkAndShowHotTimeControls();
        }, 500);

        // 创建新的容器
        const newThreadList = document.createElement("div");
        newThreadList.className = "redesigned-thread-list";

        // 获取所有置顶帖子行
        const stickyThreadRows = originalThreadList.querySelectorAll('tbody[id^="stickthread_"]');

        // 处理置顶帖
        stickyThreadRows.forEach((row) => {
          const card = processThreadRow(row, true);
          if (card) newThreadList.appendChild(card);
        });

        // 获取所有普通帖子行
        const normalThreadRows = originalThreadList.querySelectorAll('tbody[id^="normalthread_"]');

        // 处理普通帖
        normalThreadRows.forEach((row) => {
          const card = processThreadRow(row, false);
          if (card) newThreadList.appendChild(card);
        });

        // 插入导航栏和新列表并隐藏原列表
        originalThreadList.parentNode.insertBefore(navigation, originalThreadList.nextSibling);
        originalThreadList.parentNode.insertBefore(newThreadList, navigation.nextSibling);

        // 导航栏插入DOM后，再次检查并显示热帖时间控件
        setTimeout(() => {
          checkAndShowHotTimeControls();
        }, 100);

        // 获取设置并应用功能
        const settings = getSettings();

        // 延迟执行，确保DOM元素已经完全渲染
        setTimeout(() => {
          // 应用关键字屏蔽功能
          blockContentByTitleInRedesignedLayout(settings);

          // 发送自定义事件通知其他脚本新布局已完成
          const event = new CustomEvent("discuzRedesignComplete", {
            detail: {
              message: "新布局已完成",
              timestamp: Date.now(),
              threadCount: document.querySelectorAll(".thread-card").length,
            },
          });
          document.dispatchEvent(event);
        }, 100);
      } catch (error) {
      } finally {
        // 重置执行标志
        isTransforming = false;
      }
    }

    // 页面加载完成后执行转换 - 确保只绑定一次
    if (!loadEventBound) {
      window.addEventListener("load", transformThreadList);
      loadEventBound = true;
    }

    // 等待DOM准备就绪后初始化脚本
    waitForElement("#threadlist", () => {
      if (!isInitialized && !isTransforming) {
        initializeScript();
      }
    });

    // 备用初始化（如果元素等待超时）
    waitForDOM(() => {
      setTimeout(() => {
        // 更严格的重复检查
        if (shouldApplyRedesign() && !document.querySelector(".redesigned-thread-list") && !isInitialized && !isTransforming) {
          initializeScript();
        }
      }, 1000);
    });
  })();
  // #endregion

  // #region DOM操作和主题切换功能
  // ====== 主题切换按钮创建函数 ======
  function createThemeSwitch() {
    // 检查当前是否在编辑器iframe内部
    const isInsideIframe = window.self !== window.top && window.location.href.includes("forum.php?mod=post");
    // 只在主页面上添加主题切换按钮，不在iframe内添加，且只在#nv存在时显示
    if (!isInsideIframe && document.querySelector("#nv")) {
      // 检查是否已经存在主题切换容器，防止重复创建
      if (document.getElementById("theme-switch-container-sehuatang")) {
        return; // 如果已存在，直接返回
      }
      // 检查是否已经存在主题切换容器，防止重复创建
      if (document.getElementById("theme-switch-container-sehuatang")) {
        return; // 如果已存在，直接返回
      }
      // 读取上次主题
      let lastTheme = null;
      if (typeof GM_getValue === "function") {
        lastTheme = GM_getValue("sehuatang_theme", "light");
      } else {
        lastTheme = localStorage.getItem("sehuatang_theme") || "light";
      }

      // 创建主题切换容器
      const themeContainer = document.createElement("li");
      themeContainer.id = "theme-switch-container-sehuatang";
      Object.assign(themeContainer.style, {
        display: "flex",
        flexDirection: "row", // 改为水平排列
        alignItems: "center",
      });

      // 创建"主题"文字标签，改为可点击的超链接
      const themeLabel = document.createElement("a");
      themeLabel.innerText = "主题"; // 显示"主题"文字
      themeLabel.href = "javascript:void(0)"; // 防止页面跳转
      Object.assign(themeLabel.style, {
        fontSize: "14px", // 减小字体
        color: "var(--font-color)",
        textDecoration: "none", // 移除下划线
        cursor: "pointer", // 显示手型光标
      });

      // 添加点击事件，打开背景图片设置面板
      themeLabel.addEventListener("click", function (e) {
        e.preventDefault();
        // 调用背景图片设置面板函数
        if (typeof window.openBackgroundPanel === "function") {
          window.openBackgroundPanel();
        }
      });

      // 添加悬停效果
      themeLabel.addEventListener("mouseenter", function () {
        this.style.color = "red";
      });
      themeLabel.addEventListener("mouseleave", function () {
        this.style.color = "var(--font-color)";
      });

      themeContainer.appendChild(themeLabel);

      // 创建圆点容器
      const dotsContainer = document.createElement("div");
      Object.assign(dotsContainer.style, {
        display: "flex",
        flexDirection: "row", // 改为水平排列
        marginLeft: "5px",
        gap: "20px", // 调整圆点间距
      });
      themeContainer.appendChild(dotsContainer);

      // 创建单个主题切换圆点
      const themeDot = document.createElement("div");
      themeDot.className = "theme-dot theme-switch-dot";
      Object.assign(themeDot.style, {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        cursor: "pointer",
        border: "1px solid #fff",
        transition: "background-color 0.3s ease", // 添加颜色过渡动画
      });

      // 根据当前主题设置圆点颜色和tooltip
      function updateThemeDotState() {
        const isDark = document.documentElement.classList.contains("theme-dark");
        if (isDark) {
          themeDot.style.background = "#000";
          themeDot.title = "当前：暗色模式";
        } else {
          themeDot.style.background = "#E5E7EB";
          themeDot.title = "当前：亮色模式";
        }
      }

      // 初始化圆点状态
      updateThemeDotState();

      // 为主题切换圆点添加tooltip事件
      function addThemeTooltip(element) {
        element.addEventListener("mouseenter", function (e) {
          const isDark = document.documentElement.classList.contains("theme-dark");
          const tooltipText = isDark ? "当前：暗色模式" : "当前：亮色模式";
          showThemeTooltip(e.target, tooltipText);
        });
        element.addEventListener("mouseleave", function () {
          hideThemeTooltip();
        });
      }

      // 添加tooltip到圆点
      addThemeTooltip(themeDot);

      // 点击圆点切换主题
      themeDot.onclick = function () {
        const isDark = document.documentElement.classList.contains("theme-dark");

        if (isDark) {
          // 当前是暗色模式，切换到亮色模式
          document.documentElement.classList.add("theme-light");
          document.documentElement.classList.remove("theme-dark");
          if (typeof GM_setValue === "function") {
            GM_setValue("sehuatang_theme", "light");
          } else {
            localStorage.setItem("sehuatang_theme", "light");
          }
        } else {
          // 当前是亮色模式，切换到暗色模式
          document.documentElement.classList.remove("theme-light");
          document.documentElement.classList.add("theme-dark");
          if (typeof GM_setValue === "function") {
            GM_setValue("sehuatang_theme", "dark");
          } else {
            localStorage.setItem("sehuatang_theme", "dark");
          }
        }

        // 更新圆点状态
        updateThemeDotState();

        // 更新主题编辑面板中暗色模式遮罩滑块的状态
        setTimeout(() => {
          if (typeof window.updateDarkOverlaySliderState === "function") {
            window.updateDarkOverlaySliderState();
          }
        }, 100);
      };

      // 移动原始的switchwidth按钮到主题切换容器
      function moveSwitchWidthButton() {
        const originalButton = document.getElementById("switchwidth");
        if (originalButton) {
          // 创建红色圆点样式的容器
          const widthDot = document.createElement("div");
          widthDot.className = "theme-dot width-switch-dot";
          Object.assign(widthDot.style, {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#ff0000",
            cursor: "pointer",
            border: "1px solid #fff",
            marginLeft: "4px",
          });

          // 添加tooltip - 为宽窄版切换创建专门的tooltip处理
          widthDot.title = "切换宽窄版";
          widthDot.addEventListener("mouseenter", function (e) {
            showThemeTooltip(e.target, "切换宽窄版");
          });
          widthDot.addEventListener("mouseleave", function () {
            hideThemeTooltip();
          });

          // 将原始按钮的点击事件绑定到红色圆点
          widthDot.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            originalButton.click();
          };

          // 隐藏原始按钮
          originalButton.style.display = "none";

          return widthDot;
        }
        return null;
      }

      // 添加圆点到容器
      dotsContainer.appendChild(themeDot);

      // 尝试移动按钮，添加到暗色模式圆点之后
      const widthDot = moveSwitchWidthButton();
      if (widthDot) {
        // 如果成功创建了红色圆点，添加到容器
        dotsContainer.appendChild(widthDot);
      }

      // 添加容器到导航栏
      let inserted = false;
      const navUl = document.querySelector("#nv ul");

      if (navUl) {
        // 首先尝试插入到搜索栏前面
        const searchBar = document.getElementById("mn_search_bar");
        if (searchBar) {
          navUl.insertBefore(themeContainer, searchBar);
          inserted = true;
        } else {
          // 如果搜索栏不存在，尝试插入到发帖回复按钮后面
          const postReplyButtons = document.getElementById("mn_post_reply_buttons");
          if (postReplyButtons) {
            navUl.insertBefore(themeContainer, postReplyButtons.nextSibling);
            inserted = true;
          } else {
            // 如果发帖回复按钮不存在，插入到mn_Neaf3后面
            const targetElement = document.getElementById("mn_Neaf3");
            if (targetElement) {
              navUl.insertBefore(themeContainer, targetElement.nextSibling);
              inserted = true;
            } else {
              // 如果mn_Neaf3也不存在，插入到ul的末尾
              navUl.appendChild(themeContainer);
              inserted = true;
            }
          }
        }
      }

      // 添加监听器来动态控制主题切换按钮的显示/隐藏
      function setupThemeButtonVisibilityObserver() {
        const themeContainer = document.getElementById("theme-switch-container-sehuatang");
        if (!themeContainer) return;

        // 创建观察器来监听#nv元素的变化
        const observer = new MutationObserver(() => {
          const nvElement = document.querySelector("#nv");
          if (nvElement) {
            // #nv存在，显示主题切换按钮
            themeContainer.style.display = "flex";
          } else {
            // #nv不存在，隐藏主题切换按钮
            themeContainer.style.display = "none";
          }
        });

        // 开始观察DOM变化
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // 立即检查一次当前状态
        const nvElement = document.querySelector("#nv");
        if (nvElement) {
          themeContainer.style.display = "flex";
        } else {
          themeContainer.style.display = "none";
        }
      }

      // 设置监听器
      setupThemeButtonVisibilityObserver();

      // 显示主题tooltip
      function showThemeTooltip(element, text) {
        // 移除已存在的tooltip
        hideThemeTooltip();

        // 创建tooltip元素
        const tooltip = document.createElement("div");
        tooltip.className = "theme-custom-tooltip";
        tooltip.textContent = text;
        tooltip.id = "theme-custom-tooltip";

        // 添加到body
        document.body.appendChild(tooltip);

        // 强制重新计算布局
        tooltip.offsetHeight;

        // 计算位置
        const elementRect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // 计算tooltip位置（在元素上方居中）
        const left = elementRect.left + elementRect.width / 2 - tooltipRect.width / 2;
        const top = elementRect.top - tooltipRect.height - 8; // 8px间距

        // 确保tooltip不超出屏幕边界
        const finalLeft = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
        const finalTop = Math.max(8, top);

        tooltip.style.left = finalLeft + "px";
        tooltip.style.top = finalTop + "px";

        // 使用setTimeout确保样式应用后再显示
        setTimeout(() => {
          tooltip.classList.add("show");
        }, 10);
      }

      // 隐藏主题tooltip
      function hideThemeTooltip() {
        const existingTooltip = document.getElementById("theme-custom-tooltip");
        if (existingTooltip) {
          existingTooltip.remove();
        }
      }
    }
  }
  // ====== 主题切换按钮创建函数 END ======

  // DOM内容加载完成后立即创建主题切换按钮
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createThemeSwitch);
  } else {
    createThemeSwitch();
  }

  // 页面完全加载后调用 - 移除样式检查，只保留DOM处理
  window.addEventListener("load", () => {
    // 移除对样式注入的检查，只执行DOM操作
    if (!stylesInjected) {
      // 如果样式尚未注入（极端情况），这里补充注入一次
      injectStyles(customStyles, STYLE_ID);
    }

    // 始终执行DOM处理
    initializeDOMHandlers();

    // 最终检查热帖时间控件
    setTimeout(() => {
      if (typeof checkAndShowHotTimeControls === "function") {
        checkAndShowHotTimeControls();
      }
    }, 1000);

    // 页面显示逻辑已由页面延迟显示模块处理

    // 拖拽相关的MutationObserver已移除
  });
  // #endregion

  // ====== 作者主页列表重构功能 ======
  (function () {
    "use strict";

    // 检测是否为作者主页
    function isAuthorHomePage() {
      const url = window.location.href;
      return url.includes("home.php?mod=space") && url.includes("do=thread");
    }

    // 检测是否有作者主页的表格
    function hasAuthorThreadTable() {
      const table = document.querySelector(".tl table");
      return table && table.querySelector("tr.th");
    }

    // 完整的页面检查
    function shouldApplyAuthorPageRedesign() {
      return isAuthorHomePage() && hasAuthorThreadTable();
    }

    // 等待DOM准备就绪的函数
    function waitForDOM(callback) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
      } else {
        callback();
      }
    }

    // 等待特定元素出现的函数
    function waitForElement(selector, callback, timeout = 10000) {
      const element = document.querySelector(selector);
      if (element) {
        callback(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          callback(element);
        }
      });

      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
      });

      // 设置超时
      setTimeout(() => {
        observer.disconnect();
      }, timeout);
    }

    // 提取帖子ID
    function extractThreadId(link) {
      const match = link.match(/tid[=\-](\d+)/);
      return match ? match[1] : null;
    }

    // 处理作者主页的帖子组（包括主帖行和回复内容行）
    function processAuthorThreadGroup(mainRow, replyRows = []) {
      // 提取帖子信息
      const titleElement = mainRow.querySelector("th a");
      if (!titleElement) return null;

      const title = titleElement.textContent;
      const link = titleElement.href;
      const titleLinkHtml = titleElement.outerHTML;

      // 提取帖子ID
      const threadId = extractThreadId(link);

      // 提取版块信息
      const forumElement = mainRow.querySelector("td a.xg1");
      const forum = forumElement ? forumElement.textContent : "未知版块";
      const forumLinkHtml = forumElement ? forumElement.outerHTML : forum;

      // 提取回复/查看数据
      const numElement = mainRow.querySelector("td.num");
      let replies = "0",
        views = "0";
      if (numElement) {
        const replyElement = numElement.querySelector("a.xi2");
        const viewElement = numElement.querySelector("em");
        replies = replyElement ? replyElement.textContent : "0";
        views = viewElement ? viewElement.textContent : "0";
      }

      // 提取最后回复信息
      const byElement = mainRow.querySelector("td.by");
      let lastReplyAuthor = "未知",
        lastReplyTime = "未知";
      if (byElement) {
        const authorElement = byElement.querySelector("cite a");
        const timeElement = byElement.querySelector("em a span") || byElement.querySelector("em a");
        lastReplyAuthor = authorElement ? authorElement.textContent : "未知";
        lastReplyTime = timeElement ? timeElement.textContent : "未知";
      }

      // 处理回复内容
      let replyContentHtml = "";
      if (replyRows.length > 0) {
        const replyContents = [];
        replyRows.forEach((replyRow) => {
          const replyCell = replyRow.querySelector('td.xg1[colspan="5"]');
          if (replyCell) {
            replyContents.push(replyCell.innerHTML);
          }
        });

        if (replyContents.length > 0) {
          replyContentHtml = `
                    <div class="thread-reply-content">
                        <div class="reply-body">
                            ${replyContents.join('<div class="reply-separator"></div>')}
                        </div>
                    </div>
                `;
        }
      }

      // 创建卡片（继承 thread-card 的所有样式）
      const card = document.createElement("div");
      card.className = "thread-card author-thread-card";
      card.setAttribute("data-thread-id", threadId);

      card.innerHTML = `
            <div class="thread-content">
                <div class="thread-title">
                    ${titleLinkHtml}
                </div>
                <div class="thread-info">
                    <span class="thread-forum">版块: ${forumLinkHtml}</span>
                    <span class="thread-replies">回复: ${replies}</span>
                    <span class="thread-reply-time">最后回复: by ${lastReplyAuthor} - ${lastReplyTime}</span>
                    <span class="thread-views">查看: ${views}</span>
                </div>
                ${replyContentHtml}
            </div>
        `;

      return card;
    }

    // 主转换函数 - 支持增量更新
    function transformAuthorThreadList() {
      const originalTable = document.querySelector(".tl table");
      if (!originalTable) return;

      // 检查是否已经存在转换后的列表
      let existingList = document.querySelector(".author-thread-list");
      let isFirstTime = !existingList;

      if (isFirstTime) {
        // 首次创建：创建新的容器
        existingList = document.createElement("div");
        existingList.className = "redesigned-thread-list author-thread-list";

        // 插入新列表并隐藏原表格
        originalTable.parentNode.insertBefore(existingList, originalTable.nextSibling);
        originalTable.style.display = "none";
      }

      // 获取所有帖子行（排除表头）
      const allRows = Array.from(originalTable.querySelectorAll("tr:not(.th)"));

      // 获取已处理的帖子ID集合
      const existingCards = existingList.querySelectorAll(".author-thread-card");
      const existingThreadIds = new Set();
      existingCards.forEach((card) => {
        const threadId = card.getAttribute("data-thread-id");
        if (threadId) existingThreadIds.add(threadId);
      });

      // 分组处理帖子行：将主帖行和其后续的回复行分组
      const threadGroups = [];
      let currentGroup = null;

      allRows.forEach((row) => {
        const titleElement = row.querySelector("th a");

        if (titleElement) {
          // 这是一个主帖行，开始新的分组
          if (currentGroup) {
            threadGroups.push(currentGroup);
          }
          currentGroup = {
            mainRow: row,
            replyRows: [],
            threadId: extractThreadId(titleElement.getAttribute("href")),
          };
        } else {
          // 这是一个回复行，添加到当前分组
          if (currentGroup) {
            currentGroup.replyRows.push(row);
          }
        }
      });

      // 添加最后一个分组
      if (currentGroup) {
        threadGroups.push(currentGroup);
      }

      // 只处理新的帖子组
      let newCardsAdded = 0;
      threadGroups.forEach((group) => {
        if (!group.threadId) return;

        // 如果已经存在，跳过
        if (existingThreadIds.has(group.threadId)) return;

        // 创建新卡片
        const card = processAuthorThreadGroup(group.mainRow, group.replyRows);
        if (card) {
          existingList.appendChild(card);
          newCardsAdded++;
        }
      });

      // 发送事件通知（根据是否有新内容决定）
      setTimeout(() => {
        const event = new CustomEvent("authorPageRedesignComplete", {
          detail: {
            message: isFirstTime ? "作者主页新布局已完成" : "作者主页内容已更新",
            timestamp: Date.now(),
            threadCount: document.querySelectorAll(".author-thread-card").length,
            newCardsAdded: newCardsAdded,
            isFirstTime: isFirstTime,
            needsImagePreviewReinit: newCardsAdded > 0, // 只有新增内容时才需要重新初始化图片预览
          },
        });
        document.dispatchEvent(event);

        // 只为新增的卡片初始化图片预览
        if (newCardsAdded > 0 && typeof window.displayThreadImagesInRedesignedLayout === "function") {
          setTimeout(() => {
            const settings = typeof window.getSettings === "function" ? window.getSettings() : { displayThreadImages: true };
            window.displayThreadImagesInRedesignedLayout(settings);
          }, 50);
        }
      }, 100);
    }

    // 暴露转换函数给其他脚本使用
    window.transformAuthorThreadList = transformAuthorThreadList;

    // 监听重新触发事件
    document.addEventListener("retriggerAuthorPageRedesign", function (event) {
      if (shouldApplyAuthorPageRedesign()) {
        transformAuthorThreadList();
      }
    });

    // 主初始化函数
    function initializeAuthorPageScript() {
      // 再次检查是否应该应用重构
      if (!shouldApplyAuthorPageRedesign()) {
        return;
      }

      // 添加作者主页完整样式（包含 thread-card 的完整定义）
      const style = document.createElement("style");
      style.textContent = `


        `;
      document.head.appendChild(style);

      // 页面加载完成后执行转换
      window.addEventListener("load", transformAuthorThreadList);
    }

    // 等待DOM准备就绪后初始化脚本
    waitForElement(".tl table", () => {
      initializeAuthorPageScript();
    });

    // 备用初始化（如果元素等待超时）
    waitForDOM(() => {
      setTimeout(() => {
        if (shouldApplyAuthorPageRedesign() && !document.querySelector(".author-thread-list")) {
          initializeAuthorPageScript();
        }
      }, 1000);
    });
  })();
  // #endregion

  // #region 背景图片上传功能
  (function () {
    "use strict";

    // 全局变量
    let currentPresetId = null; // 当前选中的预设ID
    let isModified = false; // 是否有未保存的修改

    // 添加油猴菜单命令
    if (typeof GM_registerMenuCommand === "function") {
      GM_registerMenuCommand("主题编辑面板", openBackgroundPanel);
    }

    // 背景图片相关的CSS变量
    const backgroundImageCSS = `
    `;

    // 添加背景图片样式
    const bgStyleElement = document.createElement("style");
    bgStyleElement.textContent = backgroundImageCSS;
    document.head.appendChild(bgStyleElement);

    // 打开主题编辑面板
    function openBackgroundPanel() {
      // 如果面板已存在，先移除
      const existingPanel = document.getElementById("background-settings-panel");
      if (existingPanel) {
        existingPanel.remove();
      }

      // 创建面板容器
      const panel = document.createElement("div");
      panel.id = "background-settings-panel";
      panel.innerHTML = `
            <div class="bg-panel-overlay">
                <div class="bg-panel-content">
                    <div class="bg-panel-header">
                        <div class="bg-panel-title" id="bg-panel-title">默认背景</div>
                        <button class="bg-panel-close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div class="bg-panel-body">
                        <!-- 背景图片切换 -->
                        <div class="bg-card">
                            <div class="bg-card-header">
                                <div class="bg-preset-header-row">
                                    <div class="bg-preset-title">主题列表</div>
                                    <div class="bg-preset-actions">
                                        <button id="bg-export-file-btn" class="bg-btn bg-btn-outline bg-btn-small">
                                            导出
                                        </button>
                                        <button id="bg-import-btn" class="bg-btn bg-btn-outline bg-btn-small">
                                            导入
                                        </button>
                                        <button id="bg-export-all-btn" class="bg-btn bg-btn-outline bg-btn-small">
                                            全部导出
                                        </button>
                                        <button id="bg-import-all-btn" class="bg-btn bg-btn-outline bg-btn-small">
                                            全部导入
                                        </button>
                                        <input type="file" id="bg-import-file" accept=".json" style="display: none;">
                                        <input type="file" id="bg-import-all-file" accept=".json" style="display: none;">
                                    </div>
                                </div>
                                <div class="bg-preset-list" id="bg-preset-list">
                                    <!-- 预设样式圆点将在这里动态生成 -->
                                </div>
                            </div>
                            <div class="bg-upload-area" id="bg-upload-area">
                                <input type="file" id="bg-file-input" accept="image/*" hidden>
                                <div class="bg-upload-content">
                                    <div class="bg-upload-text">点击或拖拽上传图片</div>
                                    <div class="bg-upload-hint">支持 JPG、PNG、GIF 格式，不支持大图片，建议大小控制在100kb以下</div>
                                </div>
                                <div class="bg-preview" id="bg-preview" style="display: none;">
                                    <div class="bg-preview-inner" id="bg-preview-inner"></div>
                                    <div class="bg-preview-overlay">
                                        <button class="bg-preview-change">更换图片</button>
                                    </div>
                                </div>
                            </div>

                            <!-- 主题颜色控制区域 -->
                            <div class="bg-color-section">
                                <div class="bg-settings-row">
                                    <div class="bg-settings-column">
                                        <div class="theme-color-control">
                                            <label class="theme-color-label">颜色背景（与图片背景二选一）</label>
                                            <input type="text" id="bg-color-text" class="theme-color-input" placeholder="输入颜色值 (如: #ffffff, rgba(255,255,255,0.8))">
                                        </div>
                                        <div class="theme-color-control">
                                            <label class="theme-color-label">次要颜色(second color)</label>
                                            <input type="text" id="second-color-input" class="theme-color-input" placeholder="rgba(94, 96, 104, 0.05)">
                                        </div>
                                    </div>
                                    <div class="bg-settings-column">
                                        <div class="theme-color-control">
                                            <label class="theme-color-label">主要颜色(primary color)</label>
                                            <input type="text" id="primary-color-input" class="theme-color-input" placeholder="rgba(0, 0, 0, 0.3)">
                                        </div>
                                        <div class="theme-color-control">
                                            <label class="theme-color-label">字体颜色(font color)</label>
                                            <input type="text" id="font-color-input" class="theme-color-input" placeholder="rgba(0, 0, 0, 0.8)">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 基础设置与滤镜效果 -->
                        <div class="bg-card">
                            <div class="bg-card-content">
                                <div class="bg-settings-row">
                                    <!-- 基础设置 -->
                                    <div class="bg-settings-column">
                                        <div class="bg-control">
                                            <label class="bg-label">重复方式 (background-repeat)</label>
                                            <select id="bg-repeat" class="bg-select">
                                                <option value="no-repeat">不重复</option>
                                                <option value="repeat">重复</option>
                                                <option value="repeat-x">水平重复</option>
                                                <option value="repeat-y">垂直重复</option>
                                            </select>
                                        </div>
                                       <div class="bg-control">
                                            <label class="bg-label">透明度 (opacity)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="bg-opacity" class="bg-slider" min="0" max="1" step="0.01" value="0.8">
                                                <span class="bg-slider-value" id="bg-opacity-value">100%</span>
                                            </div>
                                        </div>
                                                                              <div class="bg-control">
                                            <label class="bg-label">模糊 (filter: blur)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="blur-slider" class="bg-slider" min="0" max="200" step="1" value="0">
                                                <span class="bg-slider-value" id="blur-value">60px</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">水平位置 (position-x)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="bg-position-x" class="bg-slider" min="-100" max="100" step="1" value="0">
                                                <span class="bg-slider-value" id="bg-position-x-value">0%</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">垂直位置 (position-y)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="bg-position-y" class="bg-slider" min="-100" max="100" step="1" value="0">
                                                <span class="bg-slider-value" id="bg-position-y-value">0%</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">旋转角度 (rotate)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="bg-rotate" class="bg-slider" min="0" max="360" step="1" value="0">
                                                <span class="bg-slider-value" id="bg-rotate-value">0°</span>
                                            </div>
                                        </div>

                                    </div>

                                    <!-- 滤镜效果 -->
                                    <div class="bg-settings-column">
                                        <div class="bg-control">
                                            <label class="bg-label">背景模式 (background-size)</label>
                                            <select id="bg-size-mode" class="bg-select">
                                                <option value="custom">自定义尺寸</option>
                                                <option value="cover">填充视窗 (cover)</option>
                                                <option value="100% 100%">强制拉伸 (100% 100%)</option>
                                                <option value="contain">完整显示 (contain)</option>
                                                <option value="auto">原始尺寸 (auto)</option>
                                            </select>
                                        </div>
                                        <div class="bg-control" id="bg-size-custom-control">
                                            <label class="bg-label">自定义尺寸 (%)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="bg-size-slider" class="bg-slider" min="0" max="400" step="1" value="110">
                                                <span class="bg-slider-value" id="bg-size-value">100%</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">亮度 (filter: brightness)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="brightness-slider" class="bg-slider" min="0" max="200" step="1" value="100">
                                                <span class="bg-slider-value" id="brightness-value">100%</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">对比度 (filter: contrast)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="contrast-slider" class="bg-slider" min="0" max="200" step="1" value="100">
                                                <span class="bg-slider-value" id="contrast-value">100%</span>
                                            </div>
                                        </div>
                                        <div class="bg-control">
                                            <label class="bg-label">饱和度 (filter: saturate)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="saturate-slider" class="bg-slider" min="0" max="200" step="1" value="120">
                                                <span class="bg-slider-value" id="saturate-value">100%</span>
                                            </div>
                                        </div>

                                            <div class="bg-control">
                                            <label class="bg-label">暗色模式明暗度 (dark overlay)</label>
                                            <div class="bg-slider-container">
                                                <input type="range" id="dark-overlay" class="bg-slider" min="0" max="1" step="0.01" value="0.5">
                                                <span class="bg-slider-value" id="dark-overlay-value">50%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 操作按钮 -->
                        <div class="bg-actions">
                            <div class="bg-action-group">
                                <button id="bg-new-btn" class="bg-btn bg-btn-primary">
                                    新建主题
                                </button>
                                <button id="bg-delete-btn" class="bg-btn bg-btn-secondary">
                                    删除主题
                                </button>
                                <button id="bg-reset-btn" class="bg-btn bg-btn-secondary">
                                    重置参数
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

      // 添加面板样式
      const panelStyle = document.createElement("style");
      panelStyle.textContent = `
      `;

      document.head.appendChild(panelStyle);
      document.body.appendChild(panel);

      // 启用面板拖动功能 - 使用标题栏作为拖动句柄
      const panelContent = panel.querySelector(".bg-panel-content");
      const panelHeader = panel.querySelector(".bg-panel-header");
      if (panelContent && panelHeader) {
        enablePanelDrag(panelContent, panelHeader);
      }

      // 初始化面板功能
      initializePanelEvents();
      loadCurrentSettings();

      // 立即渲染预设列表，无需延迟
      renderPresetList();
      detectCurrentActivePreset(); // 检测当前生效的预设
      updateDeleteButtonState();
    }

    // 面板拖动功能
    function enablePanelDrag(panelElement, dragHandle) {
      let isDragging = false;
      let startX, startY;
      let initialLeft, initialTop;
      let hasBeenDragged = false;

      dragHandle.classList.add("sht-cursor-move");

      dragHandle.addEventListener("mousedown", startDragging);

      function startDragging(e) {
        // 检查是否点击在交互元素上
        const target = e.target;
        const isInteractive = target.tagName.match(/^(INPUT|TEXTAREA|BUTTON|SELECT|OPTION|LABEL|A|SVG|PATH)$/) || target.closest("button, a, input, textarea, select, svg") !== null || target.classList.contains("bg-panel-title") || target.closest(".bg-panel-title") !== null;

        if (isInteractive) {
          return;
        }

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // 获取当前位置
        const rect = panelElement.getBoundingClientRect();

        // 如果是第一次拖动，需要从flexbox居中转换为绝对定位
        if (!hasBeenDragged) {
          // 获取父容器
          const parentElement = panelElement.parentElement;

          // 设置父容器为相对定位，移除flexbox居中
          parentElement.style.position = "relative";
          parentElement.style.display = "block";
          parentElement.style.justifyContent = "unset";
          parentElement.style.alignItems = "unset";

          // 设置面板为绝对定位
          panelElement.style.position = "absolute";
          panelElement.style.left = `${rect.left}px`;
          panelElement.style.top = `${rect.top}px`;
          panelElement.style.transform = "none";
          panelElement.style.margin = "0";

          hasBeenDragged = true;
        }

        // 重新获取位置（因为可能刚刚改变了定位方式）
        const newRect = panelElement.getBoundingClientRect();
        initialLeft = newRect.left;
        initialTop = newRect.top;

        e.preventDefault();

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDragging);
      }

      function doDrag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;

        // 防止拖出屏幕边界
        const maxX = window.innerWidth - panelElement.offsetWidth;
        const maxY = window.innerHeight - panelElement.offsetHeight;

        const finalLeft = Math.max(0, Math.min(newLeft, maxX));
        const finalTop = Math.max(0, Math.min(newTop, maxY));

        panelElement.style.left = `${finalLeft}px`;
        panelElement.style.top = `${finalTop}px`;
      }

      function stopDragging() {
        isDragging = false;
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDragging);
      }
    }

    // 初始化面板事件
    function initializePanelEvents() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 关闭面板事件
      const closeBtn = panel.querySelector(".bg-panel-close");
      const cancelBtn = panel.querySelector("#bg-cancel-btn");

      [closeBtn, cancelBtn].forEach((btn) => {
        if (btn) {
          btn.addEventListener("click", () => panel.remove());
        }
      });

      // 文件选择事件
      const fileInput = panel.querySelector("#bg-file-input");
      const uploadArea = panel.querySelector("#bg-upload-area");
      const preview = panel.querySelector("#bg-preview");
      const uploadContent = uploadArea.querySelector(".bg-upload-content");

      // 点击上传区域触发文件选择 - 限制在bg-upload-content区域内
      uploadContent.addEventListener("click", () => {
        fileInput.click();
      });

      // 拖拽上传 - 限制在bg-upload-content区域内
      uploadContent.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = "#6366f1";
      });

      uploadContent.addEventListener("dragleave", (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = "var(--img-border-1)";
      });

      uploadContent.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadContent.style.borderColor = "var(--img-border-1)";

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          handleFileUpload(files[0]);
        }
      });

      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          handleFileUpload(file);
        }
      });

      // 更换图片按钮
      const changeBtn = panel.querySelector(".bg-preview-change");
      if (changeBtn) {
        changeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          fileInput.click();
        });
      }

      // 颜色背景相关事件
      const colorText = panel.querySelector("#bg-color-text");

      // 颜色文本输入事件
      if (colorText) {
        colorText.addEventListener("input", (e) => {
          const color = e.target.value.trim();
          if (color) {
            if (isValidColor(color)) {
              applyColorBackground(color);
              clearImageBackground(); // 清除图片背景
              // 禁用其他滑块控制，但保持暗色模式遮罩滑块可用
              toggleSlidersState(false, true);
              isModified = true;
              autoSaveCurrentPreset();
            }
          } else {
            // 颜色输入为空时，启用其他滑块控制
            toggleSlidersState(true);
            clearColorBackground();
            isModified = true;
            autoSaveCurrentPreset();
          }
        });
      }

      function handleFileUpload(file) {
        if (!file.type.startsWith("image/")) {
          // showMessage('请选择图片文件！', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target.result;

          // 显示预览
          const previewInner = panel.querySelector("#bg-preview-inner");
          if (previewInner) {
            previewInner.style.backgroundImage = `url(${imageData})`;
          }
          preview.style.display = "block";
          uploadContent.style.display = "none";

          // 存储图片数据
          if (typeof GM_setValue === "function") {
            GM_setValue("custom_background_image", imageData);
          } else {
            localStorage.setItem("custom_background_image", imageData);
          }

          // 清除颜色主题编辑
          clearColorBackground();
          const colorText = panel.querySelector("#bg-color-text");
          if (colorText) colorText.value = "";

          // 标记为已修改
          isModified = true;
          // 不清除当前预设ID，保持当前选中的预设

          // 实时应用主题编辑
          applyBackgroundSettings();

          // 如果有当前预设，自动保存到该预设（内部会调用updatePresetDotBackground）
          autoSaveCurrentPreset();

          // showMessage('图片上传成功！', 'success');
        };
        reader.readAsDataURL(file);
      }

      // 滑块配置和统一处理
      const sliderConfigs = {
        "bg-opacity": { valueId: "bg-opacity-value", suffix: "%", multiplier: 100, realtime: true },
        "blur-slider": { valueId: "blur-value", suffix: "px", realtime: false, isFilter: true },
        "brightness-slider": { valueId: "brightness-value", suffix: "%", realtime: false, isFilter: true },
        "contrast-slider": { valueId: "contrast-value", suffix: "%", realtime: false, isFilter: true },
        "saturate-slider": { valueId: "saturate-value", suffix: "%", realtime: false, isFilter: true },
        "bg-size-slider": { valueId: "bg-size-value", suffix: "%", realtime: true },
        "bg-position-x": { valueId: "bg-position-x-value", suffix: "%", realtime: true },
        "bg-position-y": { valueId: "bg-position-y-value", suffix: "%", realtime: true },
        "bg-rotate": { valueId: "bg-rotate-value", suffix: "°", realtime: true },
        "dark-overlay": { valueId: "dark-overlay-value", suffix: "%", multiplier: 100, realtime: true },
      };

      // 统一的滑块处理函数
      function handleSliderInput(e, config, sliderId) {
        const slider = e.target;
        const valueSpan = panel.querySelector(`#${config.valueId}`);

        updateSliderValue(slider, valueSpan, config);
        isModified = true;

        // 滤镜滑块实时更新预览，但不实时保存
        if (config.isFilter) {
          updatePreviewFilter();
          // 滤镜不实时保存，只更新预览
          return;
        }

        if (config.realtime) {
          applyBackgroundSettings();
          autoSaveCurrentPreset();
        }
      }

      function updateSliderValue(slider, valueSpan, config) {
        let value = slider.value;
        if (config.multiplier) {
          value = Math.round(value * config.multiplier);
        }
        valueSpan.textContent = value + config.suffix;
      }

      // 初始化所有滑块
      Object.entries(sliderConfigs).forEach(([sliderId, config]) => {
        const slider = panel.querySelector(`#${sliderId}`);
        const valueSpan = panel.querySelector(`#${config.valueId}`);

        if (slider && valueSpan) {
          updateSliderValue(slider, valueSpan, config);
          slider.addEventListener("input", (e) => handleSliderInput(e, config, sliderId));

          // 为滤镜滑块添加change事件，在拖拽结束时保存
          if (config.isFilter) {
            slider.addEventListener("change", () => {
              applyBackgroundSettings();
              autoSaveCurrentPreset();
            });
          }
        }
      });

      // 按钮事件配置
      const buttonConfigs = [
        { id: "#bg-new-btn", handler: handleNewSettings },
        { id: "#bg-delete-btn", handler: handleDeleteSettings },
        { id: "#bg-reset-btn", handler: resetBackground },
        { id: "#bg-export-file-btn", handler: exportToFile },
        { id: "#bg-export-all-btn", handler: exportAllConfigs },
        { id: "#bg-import-btn", handler: () => panel.querySelector("#bg-import-file").click() },
        { id: "#bg-import-all-btn", handler: () => panel.querySelector("#bg-import-all-file").click() },
      ];

      // 文件输入事件配置
      const fileInputConfigs = [
        { id: "#bg-import-file", handler: importFromFile },
        { id: "#bg-import-all-file", handler: importAllConfigs },
      ];

      // 统一绑定按钮事件
      buttonConfigs.forEach(({ id, handler }) => {
        const btn = panel.querySelector(id);
        if (btn) btn.addEventListener("click", handler);
      });

      // 统一绑定文件输入事件
      fileInputConfigs.forEach(({ id, handler }) => {
        const input = panel.querySelector(id);
        if (input) input.addEventListener("change", handler);
      });

      // 统一的设置变更处理函数
      function handleSettingChange() {
        isModified = true;
        applyBackgroundSettings();
        autoSaveCurrentPreset();
      }

      // 下拉框事件绑定
      const bgRepeat = panel.querySelector("#bg-repeat");
      if (bgRepeat) {
        bgRepeat.addEventListener("change", handleSettingChange);
      }

      // 背景模式选择器
      const bgSizeMode = panel.querySelector("#bg-size-mode");
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      if (bgSizeMode && bgSizeCustomControl) {
        toggleCustomSizeControl(bgSizeMode.value, bgSizeCustomControl);
        bgSizeMode.addEventListener("change", (e) => {
          toggleCustomSizeControl(e.target.value, bgSizeCustomControl);
          handleSettingChange();
        });
      }

      // 添加配置名称编辑功能 - 改为双击触发
      const panelTitle = panel.querySelector("#bg-panel-title");
      if (panelTitle) {
        panelTitle.addEventListener("dblclick", () => {
          if (currentPresetId && currentPresetId !== "default") {
            const presets = getPresets();
            const preset = presets[currentPresetId];
            if (preset) {
              // 创建输入框替换标题
              const input = document.createElement("input");
              input.type = "text";
              input.value = preset.name;
              input.className = "bg-panel-title-input";

              // 替换标题元素
              panelTitle.style.display = "none";
              panelTitle.parentNode.appendChild(input);
              input.focus();
              input.select();

              // 处理输入完成
              const finishEdit = () => {
                const newName = input.value.trim();
                if (newName && newName !== preset.name) {
                  // 更新预设名称
                  preset.name = newName;
                  savePreset(currentPresetId, preset.name, preset.settings);
                  // 更新标题显示
                  panelTitle.textContent = preset.name;
                  // 重新渲染预设列表以更新tooltip
                  renderPresetList();
                  // 重新设置活动状态
                  setTimeout(() => {
                    const activeDot = document.querySelector(`[data-preset-id="${currentPresetId}"]`);
                    if (activeDot) activeDot.classList.add("active");
                  }, 100);
                }
                // 恢复标题显示
                input.remove();
                panelTitle.style.display = "block";
              };

              // 监听回车和失焦事件
              input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                  finishEdit();
                } else if (e.key === "Escape") {
                  input.remove();
                  panelTitle.style.display = "block";
                }
              });

              input.addEventListener("blur", finishEdit);
            }
          } else {
            alert("请先选择一个配置才能修改名称！");
          }
        });
      }

      // 主题颜色控制配置
      const colorInputConfigs = [
        { id: "#primary-color-input", property: "--primary-color", defaultValue: "rgba(0, 0, 0, 0.3)" },
        { id: "#second-color-input", property: "--Second-color", defaultValue: "rgba(94, 96, 104, 0.05)" },
        { id: "#font-color-input", property: "--font-color", defaultValue: "rgba(0, 0, 0, 0.8)" },
      ];

      // 统一的颜色输入处理函数
      function handleColorInput(e, property, defaultValue) {
        const color = e.target.value.trim();
        if (color && isValidColor(color)) {
          applyThemeColor(property, color);
        } else if (!color) {
          applyThemeColor(property, defaultValue);
        }
        isModified = true;
        autoSaveCurrentPreset();
      }

      // 绑定主题颜色输入事件
      colorInputConfigs.forEach(({ id, property, defaultValue }) => {
        const input = panel.querySelector(id);
        if (input) {
          input.addEventListener("input", (e) => handleColorInput(e, property, defaultValue));
        }
      });
    }

    // 更新预览滤镜
    function updatePreviewFilter() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      const previewInner = panel.querySelector("#bg-preview-inner");
      const blurSlider = panel.querySelector("#blur-slider");
      const brightnessSlider = panel.querySelector("#brightness-slider");
      const contrastSlider = panel.querySelector("#contrast-slider");
      const saturateSlider = panel.querySelector("#saturate-slider");

      if (!previewInner || !blurSlider || !brightnessSlider || !contrastSlider || !saturateSlider) {
        return;
      }

      const blur = blurSlider.value;
      const brightness = brightnessSlider.value;
      const contrast = contrastSlider.value;
      const saturate = saturateSlider.value;

      const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
      previewInner.style.filter = filterValue;
    }

    // 统一存储函数
    function saveData(key, data) {
      const value = typeof data === "string" ? data : JSON.stringify(data);
      if (typeof GM_setValue === "function") {
        GM_setValue(key, value);
      } else {
        localStorage.setItem(key, value);
      }
    }

    function loadData(key, defaultValue = "") {
      let value;
      if (typeof GM_getValue === "function") {
        value = GM_getValue(key, defaultValue);
      } else {
        value = localStorage.getItem(key) || defaultValue;
      }

      // 尝试解析JSON，如果失败则返回原始值
      if (value && value !== defaultValue) {
        try {
          return JSON.parse(value);
        } catch (e) {
          return value;
        }
      }
      return defaultValue;
    }

    // 颜色验证函数
    function isValidColor(color) {
      if (!color) return false;

      // 检查渐变色
      if (/^(linear-gradient|radial-gradient|conic-gradient)\s*\(/i.test(color)) return true;

      // 检查十六进制颜色
      if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return true;

      // 检查rgba格式
      if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(color)) return true;

      // 检查CSS颜色名称
      const s = new Option().style;
      s.color = color;
      return s.color !== "";
    }

    function applyColorBackground(color) {
      const gradientBg = document.querySelector(".gradient-background");
      if (gradientBg) {
        gradientBg.classList.remove("custom-image");
        gradientBg.classList.add("custom-color");

        // 检查是否为渐变色
        if (/^(radial-gradient|linear-gradient)\s*\(/i.test(color)) {
          // 对于渐变色，直接设置为background属性
          document.documentElement.style.setProperty("--custom-background", color);
        } else {
          // 对于纯色，设置为background
          document.documentElement.style.setProperty("--custom-background", color);
        }

        // 清除图片相关的CSS变量
        document.documentElement.style.removeProperty("--custom-background-image");

        // 确保暗色模式遮罩层设置也应用到颜色背景
        const panel = document.getElementById("background-settings-panel");
        if (panel) {
          const darkOverlay = panel.querySelector("#dark-overlay");
          if (darkOverlay) {
            const darkOverlayOpacity = darkOverlay.value || 0.5;
            document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlayOpacity);
          }
        }
      }

      // 保存颜色主题编辑
      saveData("background_color_settings", { colorBackground: color });
    }

    function clearColorBackground() {
      const gradientBg = document.querySelector(".gradient-background");
      if (gradientBg) {
        gradientBg.classList.remove("custom-color");
        document.documentElement.style.removeProperty("--custom-background");
      }

      // 清除颜色主题编辑
      saveData("background_color_settings", {});
    }

    function clearImageBackground() {
      const gradientBg = document.querySelector(".gradient-background");
      if (gradientBg) {
        gradientBg.classList.remove("custom-image");
      }

      // 清除图片数据
      saveData("custom_background_image", "");

      // 隐藏图片预览，显示上传区域
      const panel = document.getElementById("background-settings-panel");
      if (panel) {
        const preview = panel.querySelector("#bg-preview");
        const uploadContent = panel.querySelector(".bg-upload-content");
        if (preview && uploadContent) {
          preview.style.display = "none";
          uploadContent.style.display = "flex";
        }
      }
    }

    // 应用主题颜色
    function applyThemeColor(property, color) {
      // 对所有主题都生效
      document.documentElement.style.setProperty(property, color);
    }

    // 清除所有主题颜色设置
    function clearThemeColors() {
      // 清除CSS变量，恢复默认值
      document.documentElement.style.removeProperty("--primary-color");
      document.documentElement.style.removeProperty("--Second-color");
      document.documentElement.style.removeProperty("--font-color");

      // 清空面板中的输入框
      const panel = document.getElementById("background-settings-panel");
      if (panel) {
        const primaryColorInput = panel.querySelector("#primary-color-input");
        const secondColorInput = panel.querySelector("#second-color-input");
        const fontColorInput = panel.querySelector("#font-color-input");

        if (primaryColorInput) primaryColorInput.value = "";
        if (secondColorInput) secondColorInput.value = "";
        if (fontColorInput) fontColorInput.value = "";
      }
    }

    // 控制滑块启用/禁用状态
    function toggleSlidersState(enabled, forceKeepDarkOverlay = false) {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 检查当前是否为暗色模式
      const isDarkMode = document.documentElement.classList.contains("theme-dark");

      // 需要控制的滑块列表（包括透明度滑块）
      // 注意：bg-size-slider 由 toggleCustomSizeControl 专门管理，不在这里控制
      const sliderIds = ["blur-slider", "brightness-slider", "contrast-slider", "saturate-slider", "bg-position-x", "bg-position-y", "bg-rotate", "bg-opacity", "dark-overlay"];

      // 需要控制的下拉框
      const selectIds = ["bg-repeat", "bg-size-mode"];

      // 控制滑块
      sliderIds.forEach((sliderId) => {
        const slider = panel.querySelector(`#${sliderId}`);
        if (slider) {
          // 特殊处理暗色模式遮罩滑块
          if (sliderId === "dark-overlay") {
            // 在亮色模式下，暗色模式遮罩滑块总是被禁用
            if (!isDarkMode) {
              slider.disabled = true;
              const container = slider.closest(".bg-control") || slider.closest(".bg-control-group") || slider.closest(".bg-settings-row") || slider.parentElement;
              if (container) {
                container.style.opacity = "0.5";
                container.style.pointerEvents = "none";
                container.style.filter = "grayscale(0.5)";
              }
              return;
            }
            // 在暗色模式下，如果需要强制保持可用，则跳过禁用
            else if (forceKeepDarkOverlay) {
              slider.disabled = false;
              const container = slider.closest(".bg-control") || slider.closest(".bg-control-group") || slider.closest(".bg-settings-row") || slider.parentElement;
              if (container) {
                container.style.opacity = "1";
                container.style.pointerEvents = "auto";
                container.style.filter = "none";
              }
              return;
            }
          }

          slider.disabled = !enabled;
          // 统一的视觉反馈样式
          const container = slider.closest(".bg-control") || slider.closest(".bg-control-group") || slider.closest(".bg-settings-row") || slider.parentElement;
          if (container) {
            if (enabled) {
              container.style.opacity = "1";
              container.style.pointerEvents = "auto";
              container.style.filter = "none";
            } else {
              container.style.opacity = "0.5";
              container.style.pointerEvents = "none";
              container.style.filter = "grayscale(0.5)";
            }
          }
        }
      });

      // 控制下拉框
      selectIds.forEach((selectId) => {
        const select = panel.querySelector(`#${selectId}`);
        if (select) {
          select.disabled = !enabled;
          // 统一的视觉反馈样式
          const container = select.closest(".bg-control") || select.closest(".bg-control-group") || select.closest(".bg-settings-row") || select.parentElement;
          if (container) {
            if (enabled) {
              container.style.opacity = "1";
              container.style.pointerEvents = "auto";
              container.style.filter = "none";
            } else {
              container.style.opacity = "0.5";
              container.style.pointerEvents = "none";
              container.style.filter = "grayscale(0.5)";
            }
          }
        }
      });

      // 控制自定义尺寸控件
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      if (bgSizeCustomControl) {
        const slider = bgSizeCustomControl.querySelector("#bg-size-slider");
        const label = bgSizeCustomControl.querySelector(".bg-label");

        if (enabled) {
          // 启用时，根据当前背景模式决定是否启用自定义尺寸控件
          const bgSizeMode = panel.querySelector("#bg-size-mode");
          const currentMode = bgSizeMode ? bgSizeMode.value : "custom";
          toggleCustomSizeControl(currentMode, bgSizeCustomControl);
        } else {
          // 禁用时，强制禁用自定义尺寸控件
          bgSizeCustomControl.style.opacity = "0.5";
          bgSizeCustomControl.style.pointerEvents = "none";
          bgSizeCustomControl.style.filter = "grayscale(0.5)";
          if (slider) slider.disabled = true;
          if (label) label.style.color = "#999";
        }
      }
    }

    // 更新预设圆点背景
    function updatePresetDotBackground() {
      // 如果没有当前预设ID，跳过更新
      if (!currentPresetId || currentPresetId === "default") return;

      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      const presetList = panel.querySelector("#bg-preset-list");
      if (!presetList) return;

      const activeDot = presetList.querySelector(`[data-preset-id="${currentPresetId}"]`);
      if (!activeDot) return;

      // 优先从面板输入框获取当前状态（实时数据）
      const colorText = panel.querySelector("#bg-color-text");
      const currentColor = colorText ? colorText.value.trim() : "";

      // 检查是否有图片预览显示（实时状态）
      const preview = panel.querySelector("#bg-preview");
      const previewInner = panel.querySelector("#bg-preview-inner");
      const hasImagePreview = preview && preview.style.display !== "none" && previewInner && previewInner.style.backgroundImage;

      // 更新圆点背景 - 优先使用实时状态
      if (hasImagePreview) {
        // 如果面板中有图片预览，使用预览中的图片
        const imageUrl = previewInner.style.backgroundImage;
        activeDot.style.backgroundImage = imageUrl;
        activeDot.style.backgroundColor = "";
        activeDot.style.backgroundSize = "cover";
        activeDot.style.backgroundPosition = "center";
      } else if (currentColor && isValidColor(currentColor)) {
        // 如果有颜色输入，使用颜色
        activeDot.style.backgroundImage = "";
        if (/^(radial-gradient|linear-gradient)\s*\(/i.test(currentColor)) {
          activeDot.style.background = currentColor;
          activeDot.style.backgroundColor = "";
        } else {
          activeDot.style.backgroundColor = currentColor;
        }
      } else {
        // 如果既没有图片也没有颜色，设置为默认灰色
        activeDot.style.backgroundImage = "";
        activeDot.style.backgroundColor = "#ccc";
        activeDot.style.background = "";
      }
    }

    // 应用主题编辑
    function applyBackgroundSettings() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 获取基础设置值
      const bgRepeat = panel.querySelector("#bg-repeat").value;
      const bgOpacity = panel.querySelector("#bg-opacity").value;

      // 获取位置设置值
      const bgPositionX = panel.querySelector("#bg-position-x").value;
      const bgPositionY = panel.querySelector("#bg-position-y").value;

      // 获取旋转角度
      const bgRotate = panel.querySelector("#bg-rotate").value;

      // 获取暗色模式遮罩透明度
      const darkOverlay = panel.querySelector("#dark-overlay").value;

      // 获取滤镜滑块值
      const blur = panel.querySelector("#blur-slider").value;
      const brightness = panel.querySelector("#brightness-slider").value;
      const contrast = panel.querySelector("#contrast-slider").value;
      const saturate = panel.querySelector("#saturate-slider").value;

      // 获取背景尺寸设置
      const bgSizeMode = panel.querySelector("#bg-size-mode").value;
      let bgSizeValue;
      if (bgSizeMode === "custom") {
        bgSizeValue = panel.querySelector("#bg-size-slider").value + "%";
      } else {
        bgSizeValue = bgSizeMode; // cover, contain, auto
      }

      // 优化模糊白边处理 - 只在有模糊时才扩展边距
      const blurValue = parseInt(blur) || 0;
      const edgeExpand = blurValue > 0 ? Math.max(10, blurValue * 1.5) : 0; // 只在有模糊时扩展，减少扩展量

      const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;

      // 获取图片数据
      let imageData = "";
      if (typeof GM_getValue === "function") {
        imageData = GM_getValue("custom_background_image", "");
      } else {
        imageData = localStorage.getItem("custom_background_image") || "";
      }

      // 获取颜色背景数据
      let colorData = "";
      try {
        const colorSettingsStr = typeof GM_getValue === "function" ? GM_getValue("background_color_settings", "{}") : localStorage.getItem("background_color_settings") || "{}";
        const colorSettings = JSON.parse(colorSettingsStr);
        colorData = colorSettings.colorBackground || "";
      } catch (e) {
        colorData = "";
      }

      // 获取面板中的颜色设置
      const colorText = panel.querySelector("#bg-color-text");
      const currentColor = colorText ? colorText.value.trim() : "";

      // 优先使用当前输入的颜色，其次使用保存的颜色
      const activeColor = currentColor || colorData;

      if (imageData) {
        // 应用背景图片
        const gradientBg = document.querySelector(".gradient-background");
        if (gradientBg) {
          gradientBg.classList.add("custom-image");

          // 设置CSS变量
          document.documentElement.style.setProperty("--custom-background-image", `url(${imageData})`);
          document.documentElement.style.setProperty("--bg-size", bgSizeValue);
          // 设置位置变量
          document.documentElement.style.setProperty("--bg-position-x", `${50 + parseInt(bgPositionX)}%`);
          document.documentElement.style.setProperty("--bg-position-y", `${50 + parseInt(bgPositionY)}%`);
          // 设置旋转变换
          document.documentElement.style.setProperty("--bg-transform", `rotate(${bgRotate}deg)`);
          document.documentElement.style.setProperty("--bg-repeat", bgRepeat);
          document.documentElement.style.setProperty("--bg-attachment", "fixed"); // 默认固定
          document.documentElement.style.setProperty("--bg-filter", filterValue);

          // 优化边距扩展 - 只在有模糊时才扩展
          if (edgeExpand > 0) {
            document.documentElement.style.setProperty("--bg-edge-expand", `-${edgeExpand}px`);
          } else {
            document.documentElement.style.setProperty("--bg-edge-expand", "0px");
          }

          document.documentElement.style.setProperty("--bg-background-size", bgSizeValue);
          if (bgOpacity) document.documentElement.style.setProperty("--bg-opacity", bgOpacity);

          // 设置暗色模式遮罩透明度
          document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlay);
        }

        // 保存设置（添加位置信息、背景模式和旋转角度）
        const settings = {
          size: bgSizeMode === "custom" ? panel.querySelector("#bg-size-slider").value + "%" : bgSizeMode,
          sizeMode: bgSizeMode, // 保存背景模式
          positionX: bgPositionX, // 保存X位置
          positionY: bgPositionY, // 保存Y位置
          rotate: bgRotate, // 保存旋转角度
          repeat: bgRepeat,
          attachment: "fixed", // 默认固定
          backgroundSize: bgSizeValue,
          opacity: bgOpacity,
          darkOverlay: darkOverlay, // 保存暗色模式遮罩透明度
          edgeExpand: edgeExpand, // 保存边距扩展值
          filter: {
            blur: blur,
            brightness: brightness,
            contrast: contrast,
            saturate: saturate,
          },
        };

        if (typeof GM_setValue === "function") {
          GM_setValue("background_settings", JSON.stringify(settings));
        } else {
          localStorage.setItem("background_settings", JSON.stringify(settings));
        }

        // 显示成功消息
        // showMessage('主题编辑已应用！', 'success');

        // 保持面板打开状态，不自动关闭
      } else if (activeColor && isValidColor(activeColor)) {
        // 应用颜色背景
        applyColorBackground(activeColor);

        // 保存颜色主题编辑
        const colorSettings = { colorBackground: activeColor };
        if (typeof GM_setValue === "function") {
          GM_setValue("background_color_settings", JSON.stringify(colorSettings));
        } else {
          localStorage.setItem("background_color_settings", JSON.stringify(colorSettings));
        }
      } else {
        // 清除所有背景
        const gradientBg = document.querySelector(".gradient-background");
        if (gradientBg) {
          gradientBg.classList.remove("custom-image", "custom-color");
        }
        // showMessage('请先选择一张图片或设置颜色背景！', 'error');
      }
    }

    // 重置背景参数（保留图片）
    function resetBackground() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 保存当前的图片数据
      let imageData = "";
      if (typeof GM_getValue === "function") {
        imageData = GM_getValue("custom_background_image", "");
      } else {
        imageData = localStorage.getItem("custom_background_image") || "";
      }

      // 保存当前的预设ID，用于后续更新预设
      const originalPresetId = currentPresetId;

      // 重置所有控件到默认值，但保持图片预览
      panel.querySelector("#bg-repeat").value = "no-repeat";
      panel.querySelector("#bg-opacity").value = 1;
      panel.querySelector("#bg-size-mode").value = "custom";
      panel.querySelector("#bg-size-slider").value = 100;
      panel.querySelector("#bg-position-x").value = 0;
      panel.querySelector("#bg-position-y").value = 0;
      panel.querySelector("#bg-rotate").value = 0;
      panel.querySelector("#blur-slider").value = 0;
      panel.querySelector("#brightness-slider").value = 100;
      panel.querySelector("#contrast-slider").value = 100;
      panel.querySelector("#saturate-slider").value = 100;
      panel.querySelector("#dark-overlay").value = 0.5;

      // 重置颜色主题编辑
      const colorText = panel.querySelector("#bg-color-text");
      if (colorText) colorText.value = "";
      clearColorBackground();

      // 启用其他滑块控制
      toggleSlidersState(true);

      // 显示自定义尺寸控件
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      if (bgSizeCustomControl) {
        bgSizeCustomControl.classList.remove("hidden");
      }

      // 更新所有显示值
      updateAllSliderValues();

      // 如果有图片，保持图片预览显示
      if (imageData) {
        const preview = panel.querySelector("#bg-preview");
        const previewInner = panel.querySelector("#bg-preview-inner");
        const uploadContent = panel.querySelector(".bg-upload-content");
        if (preview && uploadContent) {
          preview.style.display = "block";
          uploadContent.style.display = "none";
        }

        // 重置预览图片的滤镜效果为默认状态
        if (previewInner) {
          previewInner.style.filter = "none"; // 清除所有滤镜效果
        }

        // 保持背景图片类，但重置参数
        const gradientBg = document.querySelector(".gradient-background");
        if (gradientBg) {
          gradientBg.classList.add("custom-image");
        }
      } else {
        // 没有图片时隐藏预览，显示上传区域
        const preview = panel.querySelector("#bg-preview");
        const uploadContent = panel.querySelector(".bg-upload-content");
        if (preview && uploadContent) {
          preview.style.display = "none";
          uploadContent.style.display = "flex";
        }

        // 移除背景图片类
        const gradientBg = document.querySelector(".gradient-background");
        if (gradientBg) {
          gradientBg.classList.remove("custom-image");
        }
      }

      // 应用重置后的设置
      applyBackgroundSettings();

      // 创建重置后的设置对象
      const resetSettings = {
        imageData: imageData, // 保留图片数据
        size: "100%",
        sizeMode: "custom",
        positionX: 0,
        positionY: 0,
        rotate: 0,
        repeat: "no-repeat",
        opacity: 1,
        backgroundSize: "100%",
        darkOverlay: 0.5,
        filter: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturate: 100,
        },
      };

      // 保存到默认存储
      if (typeof GM_setValue === "function") {
        GM_setValue("background_settings", JSON.stringify(resetSettings));
      } else {
        localStorage.setItem("background_settings", JSON.stringify(resetSettings));
      }

      // 如果当前有活动的预设配置，将重置后的设置保存到该预设中
      if (originalPresetId && originalPresetId !== "default") {
        const presets = getPresets();
        const preset = presets[originalPresetId];
        if (preset) {
          // 保存重置后的设置到当前预设，保持预设名称不变
          savePreset(originalPresetId, preset.name, resetSettings);
          // 保持当前预设ID不变
          currentPresetId = originalPresetId;
          updateConfigTitle(preset.name);

          // 保持当前预设的活动状态
          document.querySelectorAll(".bg-preset-dot").forEach((d) => d.classList.remove("active"));
          const activeDot = document.querySelector(`[data-preset-id="${originalPresetId}"]`);
          if (activeDot) activeDot.classList.add("active");
        }
      } else {
        // 如果是默认配置或没有预设，按原来的逻辑处理
        currentPresetId = null;
        updateConfigTitle(imageData ? "自定义背景" : "默认背景");

        // 移除所有预设的活动状态
        document.querySelectorAll(".bg-preset-dot").forEach((d) => d.classList.remove("active"));

        // 如果没有图片，激活默认预设
        if (!imageData) {
          const defaultDot = document.querySelector('[data-preset-id="default"]');
          if (defaultDot) defaultDot.classList.add("active");
        }
      }

      // 更新删除按钮状态
      updateDeleteButtonState();

      isModified = false; // 标记为未修改，因为已经保存了

      // showMessage('参数已重置为默认值！', 'success');
    }

    // 切换自定义尺寸控件的显示状态
    function toggleCustomSizeControl(mode, customControl) {
      const slider = customControl.querySelector("#bg-size-slider");
      const label = customControl.querySelector(".bg-label");

      if (mode === "custom") {
        // 自定义模式：启用控件，正常颜色
        customControl.style.opacity = "1";
        customControl.style.pointerEvents = "auto";
        if (slider) slider.disabled = false;
        if (label) label.style.color = "";
      } else {
        // 非自定义模式（包括强制拉伸、填充视窗、完整显示、原始尺寸等）：禁用控件，灰色显示
        customControl.style.opacity = "0.5";
        customControl.style.pointerEvents = "none";
        if (slider) slider.disabled = true;
        if (label) label.style.color = "#999";
      }
    }

    // 加载当前设置到面板
    function loadCurrentSettings() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 加载图片
      let imageData = "";
      if (typeof GM_getValue === "function") {
        imageData = GM_getValue("custom_background_image", "");
      } else {
        imageData = localStorage.getItem("custom_background_image") || "";
      }

      if (imageData) {
        const preview = panel.querySelector("#bg-preview");
        const previewInner = panel.querySelector("#bg-preview-inner");
        const uploadContent = panel.querySelector(".bg-upload-content");

        if (preview && previewInner && uploadContent) {
          previewInner.style.backgroundImage = `url(${imageData})`;
          preview.style.display = "block";
          uploadContent.style.display = "none";
        }
      }

      // 加载设置
      let settings = {};
      try {
        const settingsStr = typeof GM_getValue === "function" ? GM_getValue("background_settings", "{}") : localStorage.getItem("background_settings") || "{}";
        settings = JSON.parse(settingsStr);
      } catch (e) {
        settings = {};
      }

      // 应用设置到面板控件
      if (settings.repeat) panel.querySelector("#bg-repeat").value = settings.repeat;
      if (settings.opacity) panel.querySelector("#bg-opacity").value = settings.opacity;

      // 加载背景模式和尺寸设置
      const bgSizeMode = panel.querySelector("#bg-size-mode");
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      const sizeSlider = panel.querySelector("#bg-size-slider");
      const sizeValueSpan = panel.querySelector("#bg-size-value");

      if (bgSizeMode && bgSizeCustomControl) {
        // 设置背景模式
        const mode = settings.sizeMode || "custom";
        bgSizeMode.value = mode;
        toggleCustomSizeControl(mode, bgSizeCustomControl);

        // 如果是自定义模式，设置滑块值
        if (mode === "custom" && sizeSlider && sizeValueSpan) {
          const sizeValue = settings.size || settings.backgroundSize;
          const value = sizeValue ? parseInt(sizeValue) : 100;
          sizeSlider.value = value;
          sizeValueSpan.textContent = value + "%";
        }
      }

      // 加载位置设置
      if (settings.positionX !== undefined) {
        const posXSlider = panel.querySelector("#bg-position-x");
        const posXValue = panel.querySelector("#bg-position-x-value");
        if (posXSlider && posXValue) {
          const value = parseInt(settings.positionX) || 0;
          posXSlider.value = value;
          posXValue.textContent = value + "%";
        }
      }

      if (settings.positionY !== undefined) {
        const posYSlider = panel.querySelector("#bg-position-y");
        const posYValue = panel.querySelector("#bg-position-y-value");
        if (posYSlider && posYValue) {
          const value = parseInt(settings.positionY) || 0;
          posYSlider.value = value;
          posYValue.textContent = value + "%";
        }
      }

      // 加载旋转角度设置
      if (settings.rotate !== undefined) {
        const rotateSlider = panel.querySelector("#bg-rotate");
        const rotateValue = panel.querySelector("#bg-rotate-value");
        if (rotateSlider && rotateValue) {
          const value = parseInt(settings.rotate) || 0;
          rotateSlider.value = value;
          rotateValue.textContent = value + "°";
        }
      }

      if (settings.filter) {
        const { blur = 0, brightness = 100, contrast = 100, saturate = 100 } = settings.filter;

        const blurSlider = panel.querySelector("#blur-slider");
        const blurValue = panel.querySelector("#blur-value");
        if (blurSlider && blurValue) {
          blurSlider.value = blur;
          blurValue.textContent = blur + "px";
        }

        const brightnessSlider = panel.querySelector("#brightness-slider");
        const brightnessValue = panel.querySelector("#brightness-value");
        if (brightnessSlider && brightnessValue) {
          brightnessSlider.value = brightness;
          brightnessValue.textContent = brightness + "%";
        }

        const contrastSlider = panel.querySelector("#contrast-slider");
        const contrastValue = panel.querySelector("#contrast-value");
        if (contrastSlider && contrastValue) {
          contrastSlider.value = contrast;
          contrastValue.textContent = contrast + "%";
        }

        const saturateSlider = panel.querySelector("#saturate-slider");
        const saturateValue = panel.querySelector("#saturate-value");
        if (saturateSlider && saturateValue) {
          saturateSlider.value = saturate;
          saturateValue.textContent = saturate + "%";
        }

        updatePreviewFilter();
      }

      // 更新透明度显示
      if (settings.opacity) {
        const opacitySlider = panel.querySelector("#bg-opacity");
        const opacityValue = panel.querySelector("#bg-opacity-value");
        if (opacitySlider && opacityValue) {
          opacitySlider.value = settings.opacity;
          opacityValue.textContent = Math.round(settings.opacity * 100) + "%";
        }
      }

      // 更新暗色模式遮罩透明度显示
      const darkOverlaySlider = panel.querySelector("#dark-overlay");
      const darkOverlayValue = panel.querySelector("#dark-overlay-value");
      if (darkOverlaySlider && darkOverlayValue) {
        const overlayOpacity = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
        darkOverlaySlider.value = overlayOpacity;
        darkOverlayValue.textContent = Math.round(overlayOpacity * 100) + "%";
        // 立即应用暗色模式遮罩设置
        document.documentElement.style.setProperty("--dark-overlay-opacity", overlayOpacity);
      }

      // 加载颜色主题编辑
      let colorData = "";
      try {
        const colorSettingsStr = typeof GM_getValue === "function" ? GM_getValue("background_color_settings", "{}") : localStorage.getItem("background_color_settings") || "{}";
        const colorSettings = JSON.parse(colorSettingsStr);
        colorData = colorSettings.colorBackground || "";
      } catch (e) {
        colorData = "";
      }

      // 设置颜色输入框的值
      if (colorData) {
        const colorText = panel.querySelector("#bg-color-text");
        if (colorText) {
          colorText.value = colorData;
          // 禁用其他滑块控制，但保持暗色模式遮罩滑块可用
          toggleSlidersState(false, true);
        }
      } else {
        // 启用其他滑块控制
        toggleSlidersState(true);
      }

      // 加载主题颜色设置（从当前CSS变量中读取）
      const primaryColorInput = panel.querySelector("#primary-color-input");
      const secondColorInput = panel.querySelector("#second-color-input");
      const fontColorInput = panel.querySelector("#font-color-input");

      // 检查当前主题模式
      const isDarkMode = document.documentElement.classList.contains("theme-dark");

      // 定义亮色和暗色模式的默认值（与CSS中的默认值保持一致）
      const lightModeDefaults = {
        primary: "rgba(0, 0, 0, 0.3)",
        second: "rgba(94, 96, 104, 0.05)",
        font: "rgba(0, 0, 0, 0.8)",
      };

      const darkModeDefaults = {
        primary: "rgba(0, 0, 0, 0.4)",
        second: "rgba(255, 255, 255, 0.05)",
        font: "rgba(255, 255, 255, 0.8)",
      };

      const currentDefaults = isDarkMode ? darkModeDefaults : lightModeDefaults;

      if (primaryColorInput) {
        const currentPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-color").trim();
        // 只有当颜色值不是当前主题的默认值时才显示
        if (currentPrimaryColor && currentPrimaryColor !== currentDefaults.primary && currentPrimaryColor !== lightModeDefaults.primary && currentPrimaryColor !== darkModeDefaults.primary) {
          primaryColorInput.value = currentPrimaryColor;
        } else {
          primaryColorInput.value = "";
        }
      }
      if (secondColorInput) {
        const currentSecondColor = getComputedStyle(document.documentElement).getPropertyValue("--Second-color").trim();
        // 只有当颜色值不是当前主题的默认值时才显示
        if (currentSecondColor && currentSecondColor !== currentDefaults.second && currentSecondColor !== lightModeDefaults.second && currentSecondColor !== darkModeDefaults.second) {
          secondColorInput.value = currentSecondColor;
        } else {
          secondColorInput.value = "";
        }
      }
      if (fontColorInput) {
        const currentFontColor = getComputedStyle(document.documentElement).getPropertyValue("--font-color").trim();
        // 只有当颜色值不是当前主题的默认值时才显示
        if (currentFontColor && currentFontColor !== currentDefaults.font && currentFontColor !== lightModeDefaults.font && currentFontColor !== darkModeDefaults.font) {
          fontColorInput.value = currentFontColor;
        } else {
          fontColorInput.value = "";
        }
      }

      // 确保预览图滤镜效果正确显示
      setTimeout(() => {
        updatePreviewFilter();
        // 更新暗色模式遮罩滑块状态
        updateDarkOverlaySliderState();
      }, 100);
    }

    // 检测当前生效的预设
    function detectCurrentActivePreset() {
      // 获取当前的图片数据
      let imageData = "";
      if (typeof GM_getValue === "function") {
        imageData = GM_getValue("custom_background_image", "");
      } else {
        imageData = localStorage.getItem("custom_background_image") || "";
      }

      // 获取当前的颜色背景数据
      let colorData = "";
      try {
        const colorSettingsStr = typeof GM_getValue === "function" ? GM_getValue("background_color_settings", "{}") : localStorage.getItem("background_color_settings") || "{}";
        const colorSettings = JSON.parse(colorSettingsStr);
        colorData = colorSettings.colorBackground || "";
      } catch (e) {
        colorData = "";
      }

      // 如果既没有图片数据也没有颜色数据，说明是默认背景
      if (!imageData && !colorData) {
        currentPresetId = null;
        updateConfigTitle("默认背景");
        // 设置默认预设为活动状态
        setTimeout(() => {
          const defaultDot = document.querySelector('[data-preset-id="default"]');
          if (defaultDot) defaultDot.classList.add("active");
        }, 100);
        return;
      }

      // 获取当前设置用于精确匹配
      let currentSettings = {};
      try {
        const settingsStr = typeof GM_getValue === "function" ? GM_getValue("background_settings", "{}") : localStorage.getItem("background_settings") || "{}";
        currentSettings = JSON.parse(settingsStr);
      } catch (e) {
        currentSettings = {};
      }

      // 检查是否匹配某个已保存的预设
      const presets = getPresets();
      let matchedPresetId = null;
      let bestMatchScore = 0;

      for (const [presetId, preset] of Object.entries(presets)) {
        if (preset.settings) {
          let matchScore = 0;
          let isValidMatch = false;

          // 首先检查基础匹配（图片或颜色背景）
          if (imageData && preset.settings.imageData === imageData) {
            isValidMatch = true;
            matchScore += 100; // 基础匹配分数
          } else if (colorData && preset.settings.colorBackground === colorData) {
            isValidMatch = true;
            matchScore += 100; // 基础匹配分数
          }

          // 如果基础匹配成功，进一步比较详细设置
          if (isValidMatch) {
            // 比较关键设置参数，每个匹配的参数增加分数
            const keySettings = ["repeat", "opacity", "sizeMode", "size", "backgroundSize", "positionX", "positionY", "rotate", "darkOverlay"];

            keySettings.forEach((key) => {
              if (preset.settings[key] !== undefined && currentSettings[key] !== undefined) {
                if (preset.settings[key] === currentSettings[key]) {
                  matchScore += 10; // 每个匹配的设置增加10分
                }
              }
            });

            // 比较滤镜设置
            if (preset.settings.filter && currentSettings.filter) {
              const filterKeys = ["blur", "brightness", "contrast", "saturate"];
              filterKeys.forEach((key) => {
                if (preset.settings.filter[key] !== undefined && currentSettings.filter[key] !== undefined) {
                  if (preset.settings.filter[key] === currentSettings.filter[key]) {
                    matchScore += 5; // 每个匹配的滤镜设置增加5分
                  }
                }
              });
            }

            // 如果这个配置的匹配分数更高，选择它
            if (matchScore > bestMatchScore) {
              bestMatchScore = matchScore;
              matchedPresetId = presetId;
            }
          }
        }
      }

      if (matchedPresetId) {
        // 找到匹配的预设
        currentPresetId = matchedPresetId;
        const preset = presets[matchedPresetId];
        updateConfigTitle(preset.name);
        // 设置对应预设为活动状态
        setTimeout(() => {
          const activeDot = document.querySelector(`[data-preset-id="${matchedPresetId}"]`);
          if (activeDot) activeDot.classList.add("active");
        }, 100);
      } else {
        // 没有找到匹配的预设，说明是自定义设置
        currentPresetId = null;
        updateConfigTitle("自定义背景");
        // 不设置任何预设为活动状态
      }
    }

    // 显示消息提示
    function showMessage(text, type = "info") {
      // 移除已存在的消息
      const existingMsg = document.getElementById("bg-message");
      if (existingMsg) existingMsg.remove();

      const message = document.createElement("div");
      message.id = "bg-message";
      message.textContent = text;

      const colors = {
        success: "#4CAF50",
        error: "#f44336",
        info: "#2196F3",
      };

      Object.assign(message.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: colors[type] || colors.info,
        color: "white",
        padding: "12px 20px",
        borderRadius: "6px",
        zIndex: "10001",
        fontSize: "14px",
        fontWeight: "500",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        transform: "translateX(100%)",
        transition: "opacity 0.3s ease, transform 0.3s ease, box-shadow 0.2s ease",
      });

      document.body.appendChild(message);

      // 动画显示
      setTimeout(() => {
        message.style.transform = "translateX(0)";
      }, 10);

      // 自动隐藏
      setTimeout(() => {
        message.style.transform = "translateX(100%)";
        setTimeout(() => message.remove(), 300);
      }, 3000);
    }

    // 配置字段映射
    const CONFIG_FIELDS = {
      "bg-repeat": { key: "repeat", default: "no-repeat" },
      "bg-opacity": { key: "opacity", default: 1, valueId: "bg-opacity-value", suffix: "%", multiplier: 100, realtime: true },
      "bg-size-mode": { key: "sizeMode", default: "custom" },
      "bg-position-x": { key: "positionX", default: 0, valueId: "bg-position-x-value", suffix: "%", realtime: true },
      "bg-position-y": { key: "positionY", default: 0, valueId: "bg-position-y-value", suffix: "%", realtime: true },
      "bg-rotate": { key: "rotate", default: 0, valueId: "bg-rotate-value", suffix: "°", realtime: true },
      "dark-overlay": { key: "darkOverlay", default: 0.5, valueId: "dark-overlay-value", suffix: "%", multiplier: 100, realtime: true },
      "blur-slider": { key: "blur", default: 0, parent: "filter", valueId: "blur-value", suffix: "px", realtime: false, isFilter: true },
      "brightness-slider": {
        key: "brightness",
        default: 100,
        parent: "filter",
        valueId: "brightness-value",
        suffix: "%",
        realtime: false,
        isFilter: true,
      },
      "contrast-slider": { key: "contrast", default: 100, parent: "filter", valueId: "contrast-value", suffix: "%", realtime: false, isFilter: true },
      "saturate-slider": { key: "saturate", default: 100, parent: "filter", valueId: "saturate-value", suffix: "%", realtime: false, isFilter: true },
    };

    // 统一收集当前配置
    function collectCurrentSettings() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return {};

      const settings = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        imageData: loadData("custom_background_image", ""),
        filter: {},
      };

      // 收集基础配置
      Object.entries(CONFIG_FIELDS).forEach(([id, config]) => {
        const element = panel.querySelector(`#${id}`);
        if (element) {
          let value = element.value;
          // 对于数值类型，转换为数字
          if (config.parent === "filter" || ["positionX", "positionY", "rotate", "opacity", "darkOverlay"].includes(config.key)) {
            value = parseFloat(value) || config.default;
          }

          if (config.parent) {
            settings[config.parent][config.key] = value;
          } else {
            settings[config.key] = value;
          }
        }
      });

      // 处理特殊字段
      const bgSizeMode = settings.sizeMode;
      if (bgSizeMode === "custom") {
        const sizeSlider = panel.querySelector("#bg-size-slider");
        settings.size = sizeSlider ? sizeSlider.value + "%" : "100%";
        settings.backgroundSize = settings.size;
      } else {
        settings.size = bgSizeMode;
        settings.backgroundSize = bgSizeMode;
      }

      // 收集颜色背景
      const colorText = panel.querySelector("#bg-color-text");
      settings.colorBackground = colorText ? colorText.value.trim() : "";

      // 收集主题颜色
      settings.themeColors = {
        primaryColor: panel.querySelector("#primary-color-input")?.value.trim() || "",
        secondColor: panel.querySelector("#second-color-input")?.value.trim() || "",
        fontColor: panel.querySelector("#font-color-input")?.value.trim() || "",
      };

      return settings;
    }

    // 统一文件下载
    function downloadFile(data, filename) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // 获取配置名称
    function getConfigName() {
      if (currentPresetId) {
        const presets = getPresets();
        const preset = presets[currentPresetId];
        if (preset?.name) return preset.name;
      }
      const userInput = prompt("请输入配置名称：", "导出配置");
      return userInput?.trim() || "未命名配置";
    }

    // 导出为文件（精简版）
    function exportToFile() {
      const settings = collectCurrentSettings();
      settings.name = getConfigName();
      downloadFile(settings, `${settings.name}-config.json`);
    }

    // 导出所有配置（精简版）
    function exportAllConfigs() {
      const presets = getPresets();
      const customPresets = Object.fromEntries(Object.entries(presets).filter(([id]) => id !== "default"));

      if (Object.keys(customPresets).length === 0) {
        alert("没有可导出的自定义配置！");
        return;
      }

      // 获取预设排序并过滤掉默认预设和不存在的预设
      const presetOrder = getPresetOrder().filter((id) => id !== "default" && customPresets[id]);

      // 确保所有自定义预设都在排序列表中
      const customPresetIds = Object.keys(customPresets);
      const missingIds = customPresetIds.filter((id) => !presetOrder.includes(id));

      // 将缺失的ID添加到排序列表末尾
      const finalOrder = [...presetOrder, ...missingIds];

      const exportData = {
        version: "1.0",
        type: "all_configs",
        timestamp: new Date().toISOString(),
        count: Object.keys(customPresets).length,
        configs: customPresets,
        preset_order: finalOrder, // 添加预设排序信息
      };

      const filename = `全部背景配置-${new Date().toISOString().split("T")[0]}.json`;
      downloadFile(exportData, filename);
    }

    // 统一文件读取
    function readFile(file, callback) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          callback(data);
        } catch (error) {
          alert("配置文件格式错误，无法解析！");
        }
      };
      reader.readAsText(file);
    }

    // 生成唯一名称
    function generateUniqueName(baseName, existingNames) {
      if (!existingNames.includes(baseName)) return baseName;

      let counter = 1;
      let newName = `${baseName}-导入${counter}`;
      while (existingNames.includes(newName)) {
        counter++;
        newName = `${baseName}-导入${counter}`;
      }
      return newName;
    }

    // 导入所有配置文件（精简版）
    function importAllConfigs(event) {
      const file = event.target.files[0];
      if (!file) return;

      readFile(file, (data) => {
        if (!data.version || data.type !== "all_configs" || !data.configs) {
          alert("无效的配置文件格式！请选择正确的所有配置导出文件。");
          return;
        }

        const configs = data.configs;
        const configCount = Object.keys(configs).length;

        if (configCount === 0) {
          alert("配置文件中没有可导入的配置！");
          return;
        }

        if (!confirm(`将导入 ${configCount} 个配置，是否继续？`)) return;

        const existingPresets = getPresets();
        const existingNames = Object.values(existingPresets).map((p) => p.name);

        // 创建旧ID到新ID的映射，用于更新排序
        const idMapping = {};

        // 导入所有配置
        Object.entries(configs).forEach(([oldId, config]) => {
          if (config.settings) {
            const newId = generatePresetId();
            const finalName = generateUniqueName(config.name, existingNames);
            savePreset(newId, finalName, config.settings);
            existingNames.push(finalName); // 避免后续重名

            // 记录ID映射关系
            idMapping[oldId] = newId;
          }
        });

        // 处理预设排序
        if (data.preset_order && Array.isArray(data.preset_order)) {
          // 获取当前排序
          const currentOrder = getPresetOrder();

          // 将导入的排序中的旧ID转换为新ID
          const importedOrder = data.preset_order
            .filter((oldId) => idMapping[oldId]) // 过滤掉没有映射的ID
            .map((oldId) => idMapping[oldId]); // 将旧ID转换为新ID

          // 保留当前排序中不在导入排序中的ID（如默认主题和之前已有的主题）
          const preservedOrder = currentOrder.filter((id) => !Object.values(idMapping).includes(id));

          // 合并排序并保存
          const newOrder = [...preservedOrder, ...importedOrder];
          savePresetOrder(newOrder);
        }

        renderPresetList();
      });

      event.target.value = "";
    }

    // 导入单个配置文件（精简版）
    function importFromFile(event) {
      const file = event.target.files[0];
      if (!file) return;

      readFile(file, (settings) => {
        if (!settings.version) return;

        applyImportedSettings(settings);

        const name = generateImportConfigName(settings.name);
        const id = generatePresetId();
        savePreset(id, name, settings);

        // 将新导入的主题添加到排序列表末尾
        const currentOrder = getPresetOrder();
        if (!currentOrder.includes(id)) {
          currentOrder.push(id);
          savePresetOrder(currentOrder);
        }

        renderPresetList();

        // 设置为当前活动预设
        currentPresetId = id;
        updateConfigTitle(name);
        document.querySelector(`[data-preset-id="${id}"]`)?.classList.add("active");
        isModified = false;
      });

      event.target.value = "";
    }

    // 生成导入配置名称
    function generateImportConfigName(originalName) {
      // 如果有原始名称，直接使用
      if (originalName && originalName.trim() !== "") {
        return originalName.trim();
      }

      // 没有名称时，按模板"导入配置-数字"命名
      const presets = getPresets();
      const existingNames = Object.values(presets).map((p) => p.name);

      let counter = 1;
      let newName = `导入配置-${counter}`;

      // 确保名称不重复
      while (existingNames.includes(newName)) {
        counter++;
        newName = `导入配置-${counter}`;
      }

      return newName;
    }

    // 统一设置应用到面板
    function applySettingsToPanel(settings) {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 应用基础配置
      Object.entries(CONFIG_FIELDS).forEach(([id, config]) => {
        const element = panel.querySelector(`#${id}`);
        if (element) {
          let value;
          if (config.parent) {
            // 处理嵌套配置（如filter）
            value = settings[config.parent] && settings[config.parent][config.key] !== undefined ? settings[config.parent][config.key] : config.default;
          } else {
            value = settings[config.key] !== undefined ? settings[config.key] : config.default;
          }
          element.value = value;
        }
      });

      // 处理特殊字段
      const bgSizeMode = panel.querySelector("#bg-size-mode");
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      if (bgSizeMode && bgSizeCustomControl) {
        const mode = settings.sizeMode || "custom";
        bgSizeMode.value = mode;
        toggleCustomSizeControl(mode, bgSizeCustomControl);

        if (mode === "custom") {
          const sizeSlider = panel.querySelector("#bg-size-slider");
          const sizeValue = settings.size || settings.backgroundSize;
          const value = sizeValue ? parseInt(sizeValue) : 100;
          if (sizeSlider) sizeSlider.value = value;
        }
      }

      // 更新所有滑块显示值
      updateAllSliderValues();
    }

    // 应用导入的设置（精简版）
    function applyImportedSettings(settings) {
      clearThemeColors();

      // 处理图片数据
      if (settings.imageData) {
        saveData("custom_background_image", settings.imageData);
        updateImagePreview(settings.imageData);
      }

      // 应用设置到面板
      applySettingsToPanel(settings);
      loadSettingsToPanel(settings);

      // 应用到背景
      applyImportedSettingsToBackground(settings);
      applyBackgroundSettings();

      // 清除预设状态
      currentPresetId = null;
      isModified = true;
      document.querySelectorAll(".bg-preset-dot").forEach((d) => d.classList.remove("active"));
    }

    // 更新图片预览
    function updateImagePreview(imageData) {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      const preview = panel.querySelector("#bg-preview");
      const previewInner = panel.querySelector("#bg-preview-inner");
      const uploadContent = panel.querySelector(".bg-upload-content");

      if (preview && previewInner && uploadContent) {
        previewInner.style.backgroundImage = `url(${imageData})`;
        preview.style.display = "block";
        uploadContent.style.display = "none";
      }
    }

    // 立即应用导入的设置到页面背景
    function applyImportedSettingsToBackground(settings) {
      // 获取图片数据
      let imageData = "";
      if (typeof GM_getValue === "function") {
        imageData = GM_getValue("custom_background_image", "");
      } else {
        imageData = localStorage.getItem("custom_background_image") || "";
      }

      // 获取颜色背景数据
      let colorData = "";
      try {
        const colorSettingsStr = typeof GM_getValue === "function" ? GM_getValue("background_color_settings", "{}") : localStorage.getItem("background_color_settings") || "{}";
        const colorSettings = JSON.parse(colorSettingsStr);
        colorData = colorSettings.colorBackground || "";
      } catch (e) {
        colorData = "";
      }

      const gradientBg = document.querySelector(".gradient-background");
      if (!gradientBg) return;

      if (imageData) {
        // 应用背景图片
        gradientBg.classList.add("custom-image");
        gradientBg.classList.remove("custom-color");

        // 设置CSS变量
        document.documentElement.style.setProperty("--custom-background-image", `url(${imageData})`);

        // 设置位置 - 支持新的位置格式
        if (settings.positionX !== undefined && settings.positionY !== undefined) {
          document.documentElement.style.setProperty("--bg-position-x", `${50 + parseInt(settings.positionX)}%`);
          document.documentElement.style.setProperty("--bg-position-y", `${50 + parseInt(settings.positionY)}%`);
        } else {
          // 兼容旧格式
          document.documentElement.style.setProperty("--bg-position-x", "50%");
          document.documentElement.style.setProperty("--bg-position-y", "50%");
        }

        // 设置旋转角度
        if (settings.rotate !== undefined) {
          document.documentElement.style.setProperty("--bg-transform", `rotate(${settings.rotate}deg)`);
        } else {
          document.documentElement.style.setProperty("--bg-transform", "none");
        }

        document.documentElement.style.setProperty("--bg-attachment", "fixed"); // 默认固定

        // 应用所有导入的设置
        if (settings.repeat) document.documentElement.style.setProperty("--bg-repeat", settings.repeat);

        // 设置背景尺寸 - 优先使用backgroundSize，然后是size
        const bgSize = settings.backgroundSize || settings.size || "100%";
        document.documentElement.style.setProperty("--bg-background-size", bgSize);

        if (settings.opacity) document.documentElement.style.setProperty("--bg-opacity", settings.opacity);

        // 设置暗色模式遮罩透明度
        const darkOverlayOpacity = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
        document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlayOpacity);

        // 优化边距扩展值 - 只在有模糊时才扩展
        if (settings.filter && settings.filter.blur) {
          const blurValue = parseInt(settings.filter.blur) || 0;
          const edgeExpand = blurValue > 0 ? Math.max(10, blurValue * 1.5) : 0;
          if (edgeExpand > 0) {
            document.documentElement.style.setProperty("--bg-edge-expand", `-${edgeExpand}px`);
          } else {
            document.documentElement.style.setProperty("--bg-edge-expand", "0px");
          }
        }

        // 应用滤镜效果
        if (settings.filter) {
          const { blur = 0, brightness = 100, contrast = 100, saturate = 100 } = settings.filter;
          const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
          document.documentElement.style.setProperty("--bg-filter", filterValue);
        }
      } else if (colorData && isValidColor(colorData)) {
        // 应用颜色背景
        gradientBg.classList.add("custom-color");
        gradientBg.classList.remove("custom-image");
        document.documentElement.style.setProperty("--custom-background", colorData);

        // 确保暗色模式遮罩层设置也应用到颜色背景
        const darkOverlayOpacity = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
        document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlayOpacity);
      }
    }

    // 页面加载时自动应用保存的主题编辑
    function autoApplyBackground() {
      const imageData = loadData("custom_background_image", "");

      // 获取颜色背景数据
      const colorSettings = loadData("background_color_settings", {});
      const colorData = colorSettings.colorBackground || "";

      // 获取当前活动的预设并应用主题颜色
      const currentPresetId = loadData("current_preset_id", "default");

      if (currentPresetId && currentPresetId !== "default") {
        const presets = getPresets();
        const preset = presets[currentPresetId];
        if (preset && preset.settings && preset.settings.themeColors) {
          const themeColors = preset.settings.themeColors;
          // 应用保存的主题颜色
          if (themeColors.primaryColor) {
            applyThemeColor("--primary-color", themeColors.primaryColor);
          }
          if (themeColors.secondColor) {
            applyThemeColor("--Second-color", themeColors.secondColor);
          }
          if (themeColors.fontColor) {
            applyThemeColor("--font-color", themeColors.fontColor);
          }
        }
      }

      // 如果既没有图片也没有颜色背景，直接返回
      if (!imageData && !colorData) return;

      // 加载设置
      const settings = loadData("background_settings", {});

      // 等待背景元素创建
      const checkBackground = () => {
        const gradientBg = document.querySelector(".gradient-background");
        if (gradientBg) {
          if (imageData) {
            // 应用图片背景
            gradientBg.classList.add("custom-image");
            gradientBg.classList.remove("custom-color");

            // 设置CSS变量
            document.documentElement.style.setProperty("--custom-background-image", `url(${imageData})`);

            // 设置背景尺寸 - 优先使用backgroundSize，然后是size
            const bgSize = settings.backgroundSize || settings.size || "100%";
            document.documentElement.style.setProperty("--bg-background-size", bgSize);

            // 设置位置 - 支持新的位置格式
            if (settings.positionX !== undefined && settings.positionY !== undefined) {
              document.documentElement.style.setProperty("--bg-position-x", `${50 + parseInt(settings.positionX)}%`);
              document.documentElement.style.setProperty("--bg-position-y", `${50 + parseInt(settings.positionY)}%`);
            } else {
              // 兼容旧格式或默认居中
              document.documentElement.style.setProperty("--bg-position-x", "50%");
              document.documentElement.style.setProperty("--bg-position-y", "50%");
            }

            // 设置旋转角度
            if (settings.rotate !== undefined) {
              document.documentElement.style.setProperty("--bg-transform", `rotate(${settings.rotate}deg)`);
            } else {
              document.documentElement.style.setProperty("--bg-transform", "none");
            }

            if (settings.repeat) document.documentElement.style.setProperty("--bg-repeat", settings.repeat);
            document.documentElement.style.setProperty("--bg-attachment", settings.attachment || "fixed"); // 默认固定
            if (settings.opacity) document.documentElement.style.setProperty("--bg-opacity", settings.opacity);

            // 设置暗色模式遮罩透明度
            const darkOverlayOpacity = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
            document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlayOpacity);

            // 优化边距扩展值 - 只在有模糊时才扩展
            if (settings.filter && settings.filter.blur) {
              const blurValue = parseInt(settings.filter.blur) || 0;
              const edgeExpand = blurValue > 0 ? Math.max(10, blurValue * 1.5) : 0;
              if (edgeExpand > 0) {
                document.documentElement.style.setProperty("--bg-edge-expand", `-${edgeExpand}px`);
              } else {
                document.documentElement.style.setProperty("--bg-edge-expand", "0px");
              }
            }

            if (settings.filter) {
              const { blur = 0, brightness = 100, contrast = 100, saturate = 100 } = settings.filter;
              const filterValue = `blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
              document.documentElement.style.setProperty("--bg-filter", filterValue);
            }
          } else if (colorData && isValidColor(colorData)) {
            // 应用颜色背景
            gradientBg.classList.add("custom-color");
            gradientBg.classList.remove("custom-image");
            document.documentElement.style.setProperty("--custom-background", colorData);

            // 确保暗色模式遮罩层设置也应用到颜色背景
            const darkOverlayOpacity = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
            document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlayOpacity);
          }
        } else {
          // 如果背景元素还没创建，等待一下再检查
          setTimeout(checkBackground, 100);
        }
      };

      checkBackground();
    }

    // 页面加载完成后自动应用背景
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoApplyBackground);
    } else {
      autoApplyBackground();
    }

    // ====== 预设管理功能 ======

    // 获取所有预设
    function getPresets() {
      return loadData("background_presets", {});
    }

    // 保存预设
    function savePreset(id, name, settings) {
      const presets = getPresets();
      presets[id] = {
        id: id,
        name: name,
        settings: settings,
        timestamp: new Date().toISOString(),
      };

      saveData("background_presets", presets);
      return presets[id];
    }

    // 删除预设
    function deletePreset(id) {
      const presets = getPresets();
      delete presets[id];
      saveData("background_presets", presets);

      // 同时从排序中移除
      const order = getPresetOrder();
      const newOrder = order.filter((presetId) => presetId !== id);
      savePresetOrder(newOrder);
    }

    // 生成预设ID
    function generatePresetId() {
      return "preset_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11);
    }

    // 获取预设排序
    function getPresetOrder() {
      return loadData("preset_order", []);
    }

    // 保存预设排序
    function savePresetOrder(order) {
      saveData("preset_order", order);
    }

    // 验证和清理预设排序
    function validatePresetOrder() {
      const presets = getPresets();
      const presetIds = Object.keys(presets);
      let order = getPresetOrder();

      // 过滤掉不存在的预设ID
      order = order.filter((id) => presetIds.includes(id));

      // 添加缺失的预设ID到排序末尾
      const missingIds = presetIds.filter((id) => !order.includes(id));
      order = [...order, ...missingIds];

      // 保存清理后的排序
      savePresetOrder(order);

      return order;
    }

    // 初始化拖动排序功能（仅支持鼠标拖动）
    function initDragSort() {
      const presetList = document.getElementById("bg-preset-list");
      if (!presetList) return;

      let draggedElement = null;

      // 为所有可拖动的圆点添加事件监听器
      const draggableDots = presetList.querySelectorAll(".bg-preset-dot:not(.default)");

      draggableDots.forEach((dot) => {
        // 拖动开始
        dot.addEventListener("dragstart", function (e) {
          draggedElement = this;
          this.classList.add("dragging");

          // 隐藏任何显示的tooltip
          hideCustomTooltip();

          // 设置拖动数据
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/html", this.outerHTML);
        });

        // 拖动结束
        dot.addEventListener("dragend", function () {
          this.classList.remove("dragging");

          // 清除所有拖动状态
          presetList.querySelectorAll(".bg-preset-dot").forEach((d) => {
            d.classList.remove("drag-over-before", "drag-over-after");
          });

          draggedElement = null;
        });
      });

      // 在整个预设列表上监听拖动事件，实现精确的位置判断
      presetList.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        if (!draggedElement) return;

        // 清除所有拖动状态
        presetList.querySelectorAll(".bg-preset-dot").forEach((d) => {
          d.classList.remove("drag-over-before", "drag-over-after");
        });

        // 获取鼠标位置下的元素
        const afterElement = getDragAfterElement(presetList, e.clientX);

        if (afterElement == null) {
          // 拖动到最后位置
          const lastDot = presetList.querySelector(".bg-preset-dot:last-child");
          if (lastDot && lastDot !== draggedElement) {
            lastDot.classList.add("drag-over-after");
          }
        } else if (afterElement !== draggedElement) {
          // 拖动到某个元素之前
          afterElement.classList.add("drag-over-before");
        }
      });

      // 在整个预设列表上监听放置事件
      presetList.addEventListener("drop", function (e) {
        e.preventDefault();

        if (!draggedElement) return;

        // 清除所有拖动状态
        presetList.querySelectorAll(".bg-preset-dot").forEach((d) => {
          d.classList.remove("drag-over-before", "drag-over-after");
        });

        // 获取插入位置
        const afterElement = getDragAfterElement(presetList, e.clientX);

        if (afterElement == null) {
          // 插入到最后
          presetList.appendChild(draggedElement);
        } else {
          // 插入到指定元素之前
          presetList.insertBefore(draggedElement, afterElement);
        }

        // 保存新的排序
        saveNewOrder();
      });
    }

    // 获取拖动位置后的元素
    function getDragAfterElement(container, x) {
      const draggableElements = [...container.querySelectorAll(".bg-preset-dot:not(.dragging)")];

      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = x - box.left - box.width / 2;

          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    }

    // 保存新的排序
    function saveNewOrder() {
      const presetList = document.getElementById("bg-preset-list");
      if (!presetList) return;

      const dots = presetList.querySelectorAll(".bg-preset-dot:not(.default)");
      const newOrder = Array.from(dots).map((dot) => dot.dataset.presetId);

      savePresetOrder(newOrder);
    }

    // 渲染预设列表
    function renderPresetList() {
      const presetList = document.getElementById("bg-preset-list");
      if (!presetList) return;

      const presets = getPresets();
      // 验证并获取有效的预设排序
      const validatedOrder = validatePresetOrder();
      presetList.innerHTML = "";

      // 添加默认预设圆点
      const defaultDot = document.createElement("div");
      defaultDot.className = "bg-preset-dot default";
      defaultDot.title = "默认背景";
      defaultDot.dataset.presetId = "default";
      presetList.appendChild(defaultDot);

      // 按照验证后的顺序排列预设
      const sortedPresets = [];

      // 按照验证后的顺序添加预设
      validatedOrder.forEach((presetId) => {
        const preset = presets[presetId];
        if (preset) {
          sortedPresets.push(preset);
        }
      });

      // 添加自定义预设圆点
      sortedPresets.forEach((preset) => {
        const dot = document.createElement("div");
        dot.className = "bg-preset-dot";
        dot.title = preset.name || "未命名配置"; // 确保有名称显示
        dot.dataset.presetId = preset.id;

        // 添加拖动属性
        dot.draggable = true;

        // 如果有图片数据，设置为背景
        if (preset.settings && preset.settings.imageData) {
          dot.style.backgroundImage = `url(${preset.settings.imageData})`;
          dot.style.backgroundColor = "";
          dot.style.backgroundSize = "cover";
          dot.style.backgroundPosition = "center";
        } else if (preset.settings && preset.settings.colorBackground && isValidColor(preset.settings.colorBackground)) {
          // 如果有颜色背景，设置为颜色
          dot.style.backgroundImage = "";
          dot.style.backgroundColor = preset.settings.colorBackground;
          // 对于渐变色，使用background而不是backgroundColor
          if (/^(radial-gradient|linear-gradient)\s*\(/i.test(preset.settings.colorBackground)) {
            dot.style.background = preset.settings.colorBackground;
            dot.style.backgroundColor = "";
          }
        } else {
          // 默认灰色
          dot.style.backgroundImage = "";
          dot.style.backgroundColor = "#ccc";
          dot.style.background = "";
        }

        presetList.appendChild(dot);
      });

      // 移除旧的事件监听器，避免重复绑定
      presetList.removeEventListener("click", handlePresetClick);
      // 添加点击事件
      presetList.addEventListener("click", handlePresetClick);

      // 为所有预设点添加自定义弹窗事件
      initCustomTooltips();

      // 初始化拖动排序功能
      initDragSort();
    }

    // 处理预设点击
    function handlePresetClick(e) {
      const dot = e.target.closest(".bg-preset-dot");
      if (!dot) return;

      const presetId = dot.dataset.presetId;

      // 如果点击的是当前已选中的预设，不做任何操作
      if (presetId === currentPresetId) return;

      // 在切换之前，先保存当前配置（如果有修改且不是默认配置）
      if (isModified && currentPresetId && currentPresetId !== "default") {
        autoSaveCurrentPreset();
      }

      // 移除所有活动状态
      document.querySelectorAll(".bg-preset-dot").forEach((d) => d.classList.remove("active"));
      // 添加当前活动状态
      dot.classList.add("active");

      if (presetId === "default") {
        // 加载默认设置
        loadDefaultSettings();
        currentPresetId = null;
        // 更新配置名称显示
        updateConfigTitle("默认背景");
      } else {
        // 加载预设
        loadPreset(presetId);
        currentPresetId = presetId;
        // 更新配置名称显示
        const presets = getPresets();
        const preset = presets[presetId];
        if (preset) {
          updateConfigTitle(preset.name);
        }
      }

      isModified = false;

      // 更新删除按钮状态
      updateDeleteButtonState();
    }

    // 初始化自定义弹窗系统
    function initCustomTooltips() {
      const presetDots = document.querySelectorAll(".bg-preset-dot[title]");

      presetDots.forEach((dot) => {
        // 移除原有的事件监听器（如果存在）
        dot.removeEventListener("mouseenter", showCustomTooltip);
        dot.removeEventListener("mouseleave", hideCustomTooltip);

        // 添加新的事件监听器
        dot.addEventListener("mouseenter", showCustomTooltip);
        dot.addEventListener("mouseleave", hideCustomTooltip);
      });
    }

    // 显示自定义弹窗
    function showCustomTooltip(e) {
      const dot = e.target;
      const title = dot.getAttribute("title");
      if (!title) return;

      // 移除已存在的弹窗
      hideCustomTooltip();

      // 创建弹窗元素
      const tooltip = document.createElement("div");
      tooltip.className = "bg-custom-tooltip";
      tooltip.textContent = title;
      tooltip.id = "bg-custom-tooltip";

      // 添加到body
      document.body.appendChild(tooltip);

      // 计算位置
      const dotRect = dot.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();

      // 计算弹窗位置（在预设点上方居中）
      const left = dotRect.left + dotRect.width / 2 - tooltipRect.width / 2;
      const top = dotRect.top - tooltipRect.height - 8; // 8px间距

      // 确保弹窗不超出屏幕边界
      const finalLeft = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));
      const finalTop = Math.max(8, top);

      tooltip.style.left = finalLeft + "px";
      tooltip.style.top = finalTop + "px";

      // 立即显示弹窗
      tooltip.classList.add("show");
    }

    // 隐藏自定义弹窗
    function hideCustomTooltip() {
      const existingTooltip = document.getElementById("bg-custom-tooltip");
      if (existingTooltip) {
        existingTooltip.remove();
      }
    }

    // 加载预设
    function loadPreset(presetId) {
      const presets = getPresets();
      const preset = presets[presetId];
      if (!preset) return;

      const settings = preset.settings;

      // 先清除所有主题颜色设置
      clearThemeColors();

      // 应用图片数据（包括清除图片的情况）
      if (settings.imageData) {
        saveData("custom_background_image", settings.imageData);
        clearColorBackground();
      } else {
        saveData("custom_background_image", "");
      }

      // 应用颜色背景数据
      if (settings.colorBackground) {
        saveData("background_color_settings", { colorBackground: settings.colorBackground });
      } else {
        clearColorBackground();
      }

      // 保存当前预设ID
      saveData("current_preset_id", presetId);

      // 直接应用设置到面板，不调用applyImportedSettings避免递归
      loadSettingsToPanel(settings);

      // 应用到背景
      applyBackgroundSettings();
    }

    // 加载默认设置
    function loadDefaultSettings() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 先清除所有主题颜色设置
      clearThemeColors();

      // 重置所有控件到默认值
      panel.querySelector("#bg-repeat").value = "no-repeat";
      panel.querySelector("#bg-opacity").value = 1;
      panel.querySelector("#bg-size-mode").value = "custom";
      panel.querySelector("#bg-size-slider").value = 100;
      panel.querySelector("#bg-position-x").value = 0;
      panel.querySelector("#bg-position-y").value = 0;
      panel.querySelector("#bg-rotate").value = 0;
      panel.querySelector("#blur-slider").value = 0;
      panel.querySelector("#brightness-slider").value = 100;
      panel.querySelector("#contrast-slider").value = 100;
      panel.querySelector("#saturate-slider").value = 100;

      // 重置颜色主题编辑
      const colorText = panel.querySelector("#bg-color-text");
      if (colorText) colorText.value = "";
      clearColorBackground();

      // 重置主题颜色设置
      const primaryColorInput = panel.querySelector("#primary-color-input");
      const secondColorInput = panel.querySelector("#second-color-input");
      const fontColorInput = panel.querySelector("#font-color-input");

      if (primaryColorInput) {
        primaryColorInput.value = "";
        applyThemeColor("--primary-color", "rgba(0, 0, 0, 0.3)"); // 恢复默认值
      }
      if (secondColorInput) {
        secondColorInput.value = "";
        applyThemeColor("--Second-color", "rgba(94, 96, 104, 0.05)"); // 恢复默认值
      }
      if (fontColorInput) {
        fontColorInput.value = "";
        applyThemeColor("--font-color", "rgba(0, 0, 0, 0.8)"); // 恢复默认值
      }

      // 启用其他滑块控制
      toggleSlidersState(true);

      // 确保自定义尺寸控件状态正确并显示
      const bgSizeCustomControl = panel.querySelector("#bg-size-custom-control");
      if (bgSizeCustomControl) {
        bgSizeCustomControl.classList.remove("hidden");
        toggleCustomSizeControl("custom", bgSizeCustomControl);
      }

      // 更新显示值
      updateAllSliderValues();

      // 清除图片
      saveData("custom_background_image", "");

      // 隐藏预览，显示上传区域
      const preview = panel.querySelector("#bg-preview");
      const uploadContent = panel.querySelector(".bg-upload-content");
      if (preview && uploadContent) {
        preview.style.display = "none";
        uploadContent.style.display = "flex";
      }

      // 重置背景（不递归调用）
      const gradientBg = document.querySelector(".gradient-background");
      if (gradientBg) {
        gradientBg.classList.remove("custom-image");
      }

      // 清除CSS变量
      document.documentElement.style.removeProperty("--custom-background-image");
      document.documentElement.style.removeProperty("--bg-position");
      document.documentElement.style.removeProperty("--bg-repeat");
      document.documentElement.style.removeProperty("--bg-attachment");
      document.documentElement.style.removeProperty("--bg-filter");
      document.documentElement.style.removeProperty("--bg-edge-expand");
      document.documentElement.style.removeProperty("--bg-background-size");
      document.documentElement.style.removeProperty("--bg-opacity");
    }

    // 加载设置到面板控件（精简版）
    function loadSettingsToPanel(settings) {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 更新图片预览
      if (settings.imageData) {
        updateImagePreview(settings.imageData);
      } else {
        const preview = panel.querySelector("#bg-preview");
        const uploadContent = panel.querySelector(".bg-upload-content");
        if (preview && uploadContent) {
          preview.style.display = "none";
          uploadContent.style.display = "flex";
        }
      }

      // 应用基础配置
      applySettingsToPanel(settings);

      // 特别处理滤镜设置（确保正确加载）
      if (settings.filter) {
        const { blur = 0, brightness = 100, contrast = 100, saturate = 100 } = settings.filter;

        const filterElements = [
          { id: "#blur-slider", valueId: "#blur-value", value: blur, suffix: "px" },
          { id: "#brightness-slider", valueId: "#brightness-value", value: brightness, suffix: "%" },
          { id: "#contrast-slider", valueId: "#contrast-value", value: contrast, suffix: "%" },
          { id: "#saturate-slider", valueId: "#saturate-value", value: saturate, suffix: "%" },
        ];

        filterElements.forEach(({ id, valueId, value, suffix }) => {
          const slider = panel.querySelector(id);
          const valueSpan = panel.querySelector(valueId);
          if (slider && valueSpan) {
            slider.value = value;
            valueSpan.textContent = value + suffix;
          }
        });
      }

      // 处理特殊字段
      const colorText = panel.querySelector("#bg-color-text");
      if (settings.colorBackground) {
        if (colorText) colorText.value = settings.colorBackground;
        toggleSlidersState(false, true);
      } else {
        if (colorText) colorText.value = "";
        toggleSlidersState(true);
      }

      // 应用主题颜色设置
      if (settings.themeColors) {
        const colorInputs = [
          { input: panel.querySelector("#primary-color-input"), color: settings.themeColors.primaryColor, property: "--primary-color" },
          { input: panel.querySelector("#second-color-input"), color: settings.themeColors.secondColor, property: "--Second-color" },
          { input: panel.querySelector("#font-color-input"), color: settings.themeColors.fontColor, property: "--font-color" },
        ];

        colorInputs.forEach(({ input, color, property }) => {
          if (input) {
            input.value = color || "";
            if (color) applyThemeColor(property, color);
          }
        });
      } else {
        ["#primary-color-input", "#second-color-input", "#font-color-input"].forEach((id) => {
          const input = panel.querySelector(id);
          if (input) input.value = "";
        });
      }

      // 应用暗色模式遮罩设置
      const darkOverlay = settings.darkOverlay !== undefined ? settings.darkOverlay : 0.5;
      document.documentElement.style.setProperty("--dark-overlay-opacity", darkOverlay);

      updatePreviewFilter();
    }

    // 更新所有滑块显示值（精简版）
    function updateAllSliderValues() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      // 使用完整的滑块配置
      const allSliderConfigs = {
        "bg-opacity": { valueId: "bg-opacity-value", suffix: "%", multiplier: 100 },
        "blur-slider": { valueId: "blur-value", suffix: "px" },
        "brightness-slider": { valueId: "brightness-value", suffix: "%" },
        "contrast-slider": { valueId: "contrast-value", suffix: "%" },
        "saturate-slider": { valueId: "saturate-value", suffix: "%" },
        "bg-size-slider": { valueId: "bg-size-value", suffix: "%" },
        "bg-position-x": { valueId: "bg-position-x-value", suffix: "%" },
        "bg-position-y": { valueId: "bg-position-y-value", suffix: "%" },
        "bg-rotate": { valueId: "bg-rotate-value", suffix: "°" },
        "dark-overlay": { valueId: "dark-overlay-value", suffix: "%", multiplier: 100 },
      };

      Object.entries(allSliderConfigs).forEach(([sliderId, config]) => {
        const slider = panel.querySelector(`#${sliderId}`);
        const valueSpan = panel.querySelector(`#${config.valueId}`);
        if (slider && valueSpan) {
          let value = slider.value;
          if (config.multiplier) {
            value = Math.round(value * config.multiplier);
          }
          valueSpan.textContent = value + config.suffix;
        }
      });
    }

    // 获取当前设置（精简版）
    function getCurrentSettings() {
      return collectCurrentSettings();
    }

    // 处理新建配置
    function handleNewSettings() {
      // 自动生成配置名称，不弹窗询问
      const name = generateNewConfigName();

      // 创建默认设置
      const defaultSettings = {
        imageData: "", // 空白图片
        size: "100%",
        sizeMode: "custom",
        positionX: 0,
        positionY: 0,
        rotate: 0, // 旋转角度
        repeat: "no-repeat",
        opacity: 1,
        darkOverlay: 0.5, // 默认暗色模式遮罩透明度
        backgroundSize: "100%",
        filter: {
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturate: 100,
        },
      };

      const id = generatePresetId();
      // 立即保存新配置
      savePreset(id, name, defaultSettings);

      // 将新配置添加到排序列表末尾
      const currentOrder = getPresetOrder();
      currentOrder.push(id);
      savePresetOrder(currentOrder);

      renderPresetList();

      // 设置为当前活动预设并加载默认设置
      currentPresetId = id;

      // 保存当前预设ID
      saveData("current_preset_id", id);

      loadDefaultSettings(); // 加载默认的空白设置
      updateConfigTitle(name); // 更新配置名称显示

      // 立即再次保存，确保当前状态与预设一致
      const currentSettings = getCurrentSettings();
      if (currentSettings) {
        savePreset(id, name, currentSettings);
      }

      // 立即设置活动状态
      const activeDot = document.querySelector(`[data-preset-id="${id}"]`);
      if (activeDot) activeDot.classList.add("active");

      // 立即更新小圆点背景（新建主题时显示默认灰色）
      updatePresetDotBackground();

      isModified = false;
    }

    // 生成新配置名称
    function generateNewConfigName() {
      const presets = getPresets();
      const existingNames = Object.values(presets).map((p) => p.name);

      let counter = 1;
      let newName = `新配置-${counter}`;

      // 确保名称不重复
      while (existingNames.includes(newName)) {
        counter++;
        newName = `新配置-${counter}`;
      }

      return newName;
    }

    // 处理删除配置
    function handleDeleteSettings() {
      if (!currentPresetId) {
        return; // 静默返回，没有选中的配置
      }

      // 保护默认背景不被删除
      if (currentPresetId === "default") {
        return; // 静默返回，默认背景不能删除
      }

      const presets = getPresets();
      const preset = presets[currentPresetId];
      if (!preset) {
        return; // 静默返回，配置不存在
      }

      // 在删除前，找到当前配置在列表中的位置，确定要跳转到的配置
      const targetPresetId = findPreviousPreset(currentPresetId);

      // 直接删除，无需确认
      deletePreset(currentPresetId);
      renderPresetList();

      // 跳转到目标配置
      if (targetPresetId) {
        if (targetPresetId === "default") {
          // 跳转到默认设置
          loadDefaultSettings();
          currentPresetId = null;
          updateConfigTitle("默认背景");
          // 设置默认预设为活动状态
          const defaultDot = document.querySelector('[data-preset-id="default"]');
          if (defaultDot) defaultDot.classList.add("active");
        } else {
          // 跳转到指定预设
          loadPreset(targetPresetId);
          currentPresetId = targetPresetId;
          const targetPreset = getPresets()[targetPresetId];
          if (targetPreset) {
            updateConfigTitle(targetPreset.name);
          }
          // 设置目标预设为活动状态
          const targetDot = document.querySelector(`[data-preset-id="${targetPresetId}"]`);
          if (targetDot) targetDot.classList.add("active");
        }
      } else {
        // 如果没有找到目标配置，回退到默认设置
        loadDefaultSettings();
        currentPresetId = null;
        updateConfigTitle("默认背景");
        const defaultDot = document.querySelector('[data-preset-id="default"]');
        if (defaultDot) defaultDot.classList.add("active");
      }

      isModified = false;
      updateDeleteButtonState();
    }

    // 查找要删除的配置左边的配置
    function findPreviousPreset(currentId) {
      // 获取当前预设列表中的所有圆点元素（按DOM顺序）
      const presetDots = document.querySelectorAll(".bg-preset-dot");
      const presetIds = Array.from(presetDots).map((dot) => dot.dataset.presetId);

      // 找到当前配置的索引
      const currentIndex = presetIds.indexOf(currentId);

      if (currentIndex > 0) {
        // 如果不是第一个，返回左边的配置ID
        return presetIds[currentIndex - 1];
      } else if (presetIds.length > 1) {
        // 如果是第一个但不是唯一的，返回第二个配置ID（删除后会变成第一个）
        return presetIds[1];
      } else {
        // 如果只有一个配置，返回默认配置
        return "default";
      }
    }

    // 自动保存当前预设
    function autoSaveCurrentPreset() {
      if (currentPresetId && currentPresetId !== "default") {
        const settings = getCurrentSettings();
        if (settings) {
          const presets = getPresets();
          const preset = presets[currentPresetId];
          if (preset) {
            // 静默保存，不显示提示（无论是否有图片都保存）
            savePreset(currentPresetId, preset.name, settings);

            // 保存当前预设ID
            saveData("current_preset_id", currentPresetId);

            // 立即更新小圆点背景
            updatePresetDotBackground();

            isModified = false;
          }
        }
      }
    }

    // 更新删除按钮状态
    function updateDeleteButtonState() {
      const deleteBtn = document.querySelector("#bg-delete-btn");
      if (deleteBtn) {
        if (currentPresetId && currentPresetId !== "default") {
          deleteBtn.disabled = false;
          deleteBtn.style.removeProperty("opacity");
          deleteBtn.style.removeProperty("cursor");
        } else {
          deleteBtn.disabled = true;
          // CSS中已经定义了disabled状态的样式
        }
      }
    }

    // 更新配置名称显示
    function updateConfigTitle(title) {
      const panelTitle = document.querySelector("#bg-panel-title");
      if (panelTitle) {
        panelTitle.textContent = title;
      }
    }

    // 更新暗色模式遮罩滑块状态
    function updateDarkOverlaySliderState() {
      const panel = document.getElementById("background-settings-panel");
      if (!panel) return;

      const darkOverlaySlider = panel.querySelector("#dark-overlay");
      if (!darkOverlaySlider) return;

      const isDarkMode = document.documentElement.classList.contains("theme-dark");
      const container = darkOverlaySlider.closest(".bg-control") || darkOverlaySlider.closest(".bg-control-group") || darkOverlaySlider.closest(".bg-settings-row") || darkOverlaySlider.parentElement;

      if (isDarkMode) {
        // 暗色模式下滑块应该可用
        darkOverlaySlider.disabled = false;
        if (container) {
          container.style.opacity = "1";
          container.style.pointerEvents = "auto";
          container.style.filter = "none";
        }
      } else {
        // 亮色模式下，禁用滑块
        darkOverlaySlider.disabled = true;
        if (container) {
          container.style.opacity = "0.5";
          container.style.pointerEvents = "none";
          container.style.filter = "grayscale(0.5)";
        }
      }
    }

    // 将函数暴露到全局作用域，以便主题切换代码可以调用
    window.openBackgroundPanel = openBackgroundPanel;
    window.updateDarkOverlaySliderState = updateDarkOverlaySliderState;
  })();
  // #endregion

  // #region 标题栏收起/展开功能
  function initTitleBarCollapse() {
    // 移除原按钮功能并添加标题栏点击功能
    addTitleBarClickEvents();
  }

  function addTitleBarClickEvents() {
    // 查找所有的.bm_h .cl元素（标题栏）
    const titleBars = document.querySelectorAll(".bm_h.cl");

    titleBars.forEach((titleBar) => {
      // 避免重复绑定事件
      if (titleBar.dataset.collapseEventAdded) return;
      titleBar.dataset.collapseEventAdded = "true";

      // 添加点击事件监听器
      titleBar.addEventListener("click", handleTitleBarClick);

      // 添加鼠标悬停效果，表明可点击
      titleBar.classList.add("sht-cursor-pointer");
    });
  }

  function handleTitleBarClick(event) {
    // 防止点击标题栏内的链接时触发收起/展开
    if (event.target.tagName === "A" || event.target.closest("a")) {
      return;
    }

    const titleBar = event.currentTarget;
    const bmContainer = titleBar.closest(".bm");

    if (!bmContainer) return;

    // 查找对应的收起/展开按钮来获取目标ID
    const collapseImg = titleBar.querySelector('.o img[onclick*="toggle_collapse"]');
    if (!collapseImg) return;

    // 从onclick属性中提取目标ID
    const onclickAttr = collapseImg.getAttribute("onclick");
    const idMatch = onclickAttr.match(/toggle_collapse\(['"]([^'"]+)['"]\)/);

    if (idMatch && idMatch[1]) {
      const targetId = idMatch[1];

      // 调用原有的toggle_collapse函数
      if (typeof window.toggle_collapse === "function") {
        window.toggle_collapse(targetId);
      } else if (typeof toggle_collapse === "function") {
        toggle_collapse(targetId);
      } else {
        // 如果原函数不存在，实现基本的收起/展开功能
        toggleElementCollapse(targetId);
      }
    }
  }

  function toggleElementCollapse(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // 检查当前显示状态，考虑多种可能的隐藏方式
    const isCurrentlyHidden = targetElement.style.display === "none" || targetElement.style.visibility === "hidden" || targetElement.classList.contains("collapsed") || window.getComputedStyle(targetElement).display === "none";

    // 切换显示/隐藏状态
    if (isCurrentlyHidden) {
      targetElement.style.display = "";
      targetElement.style.visibility = "";
      targetElement.classList.remove("collapsed");
    } else {
      targetElement.style.display = "none";
    }

    // 更新对应的图标状态
    updateCollapseIcon(targetId);
  }

  function updateCollapseIcon(targetId) {
    // 查找对应的收起/展开图标并更新其状态
    const collapseImgs = document.querySelectorAll(`img[onclick*="toggle_collapse('${targetId}')"], img[onclick*='toggle_collapse("${targetId}")']`);
    collapseImgs.forEach((img) => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const isHidden = targetElement.style.display === "none" || window.getComputedStyle(targetElement).display === "none";

        // 更新图标的src属性以反映当前状态
        if (isHidden) {
          // 收起状态，显示展开图标
          if (img.src.includes("collapsed_no.gif")) {
            img.src = img.src.replace("collapsed_no.gif", "collapsed_yes.gif");
          }
        } else {
          // 展开状态，显示收起图标
          if (img.src.includes("collapsed_yes.gif")) {
            img.src = img.src.replace("collapsed_yes.gif", "collapsed_no.gif");
          }
        }
      }
    });
  }

  // 页面加载完成后初始化标题栏收起/展开功能
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
      initTitleBarCollapse();
    }, 600); // 稍微延迟以确保其他初始化完成
  });
  // #endregion

  // 如果页面已经加载完成，立即执行
  if (document.readyState !== "loading") {
    setTimeout(() => {
      initTitleBarCollapse();
    }, 600);
  }

  // 扩展现有的MutationObserver以监听标题栏的动态加载
  const titleBarObserver = new MutationObserver((mutations) => {
    let shouldInitTitleBar = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (node.classList?.contains("bm") || node.querySelector?.(".bm_h.cl") || node.classList?.contains("bm_h"))) {
            shouldInitTitleBar = true;
          }
        });
      }
    });

    if (shouldInitTitleBar) {
      setTimeout(() => {
        initTitleBarCollapse();
      }, 100);
    }
  });

  // 启动标题栏观察器
  function startTitleBarObserver() {
    if (document.body) {
      titleBarObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          titleBarObserver.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      });
    }
  }

  // 启动标题栏观察器
  startTitleBarObserver();

  // #region 用户信息弹窗功能
  // 移动用户信息元素到现有的头像悬停弹窗
  function moveUserInfoToBui() {
    // 等待DOM加载完成
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", moveUserInfoToBui);
      return;
    }

    // 方法1：处理已存在的弹窗
    const existingBuiElements = document.querySelectorAll(".p_pop.bui:not([data-bui-processed])");
    existingBuiElements.forEach((buiElement) => {
      buiElement.setAttribute("data-bui-processed", "true");

      // 从弹窗ID中提取用户ID
      const userInfoId = buiElement.id;
      const userId = userInfoId.replace("userinfo", "");

      // 查找对应的.pls元素
      let pls = document.querySelector(`#favatar${userId} .pls`) || document.querySelector(`[id*="${userId}"] .pls`);

      if (pls) {
        reorganizeBuiLayout(buiElement, pls);
      }
    });

    // 方法2：查找所有.tns.xg2元素并处理
    const allTnsXg2 = document.querySelectorAll(".tns.xg2:not([data-moved])");
    allTnsXg2.forEach((tnsXg2) => {
      // 标记已处理
      tnsXg2.setAttribute("data-moved", "true");

      // 查找最近的用户信息容器
      const userContainer = tnsXg2.closest('[id^="post_"], tr, td');
      if (!userContainer) return;

      // 查找用户ID
      const userLink = userContainer.querySelector('a[href*="uid-"]');
      if (!userLink) return;

      const userId = userLink.href.match(/uid-(\d+)/)?.[1];
      if (!userId) return;

      // 查找对应的弹窗
      let buiElement = document.querySelector(`#userinfo${userId}`);

      if (buiElement) {
        // 如果弹窗还没有重新布局，先进行布局
        if (!buiElement.querySelector(".avatar-section")) {
          const pls = userContainer.querySelector(".pls");
          if (pls) {
            reorganizeBuiLayout(buiElement, pls);
          }
        } else {
          // 如果已经布局过，直接移动.tns.xg2
          const infoSection = buiElement.querySelector(".info-section");
          if (infoSection && !infoSection.querySelector(".tns.xg2")) {
            const clonedTns = tnsXg2.cloneNode(true);
            clonedTns.style.display = "block";
            infoSection.appendChild(clonedTns);
            tnsXg2.style.display = "none";
          }
        }
      }
    });
  }

  // 重新组织弹窗布局为左右结构
  function reorganizeBuiLayout(buiElement, pls) {
    // 检查是否已经重新布局过
    if (buiElement.querySelector(".avatar-section")) {
      return;
    }

    // 保存原有内容
    const originalContent = Array.from(buiElement.children);

    // 清空弹窗内容
    buiElement.innerHTML = "";

    // 创建左侧头像区域
    const avatarSection = document.createElement("div");
    avatarSection.className = "avatar-section sht-user-avatar-section";

    // 创建右侧信息区域
    const infoSection = document.createElement("div");
    infoSection.className = "info-section sht-user-info-section";

    // 查找头像相关元素
    const avatarImg = pls.querySelector(".avatar img, .avt img");

    // 从原始的.i.y元素中查找用户名和在线状态
    let userNameElement = null;
    let onlineStatusElement = null;

    originalContent.forEach((child) => {
      if (child.classList && child.classList.contains("i") && child.classList.contains("y")) {
        // 查找用户名
        const strongElement = child.querySelector("strong a");
        if (strongElement) {
          userNameElement = strongElement;
        }

        // 查找在线状态
        const statusEm = child.querySelector("em");
        if (statusEm && (statusEm.textContent.includes("当前在线") || statusEm.textContent.includes("当前离线"))) {
          onlineStatusElement = statusEm.cloneNode(true);
        }

        // 隐藏原始的.i.y元素，因为我们已经提取了需要的信息
        child.style.display = "none";
      }
    });

    // 查找.pm2元素（发送消息按钮）
    let pm2Element = null;

    // 方法1：从.xl元素中查找
    originalContent.forEach((child) => {
      if (child.classList && child.classList.contains("xl")) {
        const pm2Li = child.querySelector(".pm2");
        if (pm2Li) {
          pm2Element = pm2Li.cloneNode(true);
          // 隐藏原始的包含.pm2的.xl元素
          child.style.display = "none";
        }
      }
    });

    // 方法2：如果没找到，直接从pls中查找
    if (!pm2Element) {
      const pm2Li = pls.querySelector(".pm2");
      if (pm2Li) {
        pm2Element = pm2Li.cloneNode(true);
        pm2Li.style.display = "none";
      }
    }

    // 如果没有从.i.y中找到用户名，尝试从.pls中查找
    if (!userNameElement) {
      userNameElement = pls.querySelector(".pi strong a, .pi a, .username");
    }

    // 添加头像到左侧
    if (avatarImg) {
      const avatarContainer = document.createElement("div");
      avatarContainer.className = "m";
      const clonedAvatar = avatarImg.cloneNode(true);

      // 添加头像加载错误处理
      clonedAvatar.onerror = function () {
        this.src = DEFAULT_AVATAR_BASE64;
      };

      avatarContainer.appendChild(clonedAvatar);
      avatarSection.appendChild(avatarContainer);
    }

    // 保存pm2Element用于后续添加到用户信息区域
    let savedPm2Element = pm2Element;

    // 创建用户基本信息区域
    const userBasicInfo = document.createElement("div");
    userBasicInfo.className = "user-basic-info";

    // 添加用户名
    if (userNameElement) {
      const usernameDiv = document.createElement("div");
      usernameDiv.className = "username sht-user-username";

      // 创建用户名文本容器
      const usernameText = document.createElement("span");
      usernameText.textContent = userNameElement.textContent || userNameElement.innerText;
      usernameDiv.appendChild(usernameText);

      // 如果找到在线状态，添加到用户名后面
      if (onlineStatusElement) {
        // 检查是否为在线状态并添加相应的类名
        if (onlineStatusElement.textContent && onlineStatusElement.textContent.includes("当前在线")) {
          onlineStatusElement.classList.add("online-status");
        }
        usernameDiv.appendChild(onlineStatusElement);
      }

      userBasicInfo.appendChild(usernameDiv);
    }

    // 将用户基本信息添加到信息区域
    infoSection.appendChild(userBasicInfo);

    // 创建按钮容器并添加到用户基本信息下方
    if (savedPm2Element) {
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "user-action-buttons sht-user-action-buttons";

      // 从pm2元素中提取用户ID
      const pm2Link = savedPm2Element.querySelector("a");
      let userId = "";
      if (pm2Link && pm2Link.href) {
        const uidMatch = pm2Link.href.match(/touid=(\d+)/);
        if (uidMatch) {
          userId = uidMatch[1];
        }
      }

      // 创建发送消息按钮
      const sendMessageBtn = document.createElement("a");
      sendMessageBtn.href = pm2Link ? pm2Link.href : "#";
      sendMessageBtn.onclick = pm2Link ? pm2Link.onclick : null;
      sendMessageBtn.title = "发送消息";
      sendMessageBtn.className = "user-action-btn xi2";
      sendMessageBtn.textContent = "发送消息";

      // 创建加为好友按钮
      const addFriendBtn = document.createElement("a");
      addFriendBtn.href = `home.php?mod=spacecp&ac=friend&op=add&uid=${userId}&handlekey=addfriend_${userId}`;
      addFriendBtn.onclick = function () {
        showWindow("addfriend", this.href, "get", 0);
        return false;
      };
      addFriendBtn.title = "加为好友";
      addFriendBtn.className = "user-action-btn friend";
      addFriendBtn.textContent = "加为好友";

      // 将按钮添加到容器
      buttonContainer.appendChild(sendMessageBtn);
      buttonContainer.appendChild(addFriendBtn);

      // 将按钮容器添加到信息区域
      infoSection.appendChild(buttonContainer);
    }

    // 查找要移动的元素 - 扩大搜索范围
    let tnsXg2 = pls.querySelector(".tns.xg2");
    let pilCl = pls.querySelector(".pil.cl");
    const xlElements = pls.querySelectorAll(".xl.xl2.o.cl, .xl.o.cl");

    // 如果在pls中没找到，尝试在父级容器中查找
    if (!tnsXg2) {
      const parentTd = pls.closest("td");
      if (parentTd) {
        tnsXg2 = parentTd.querySelector(".tns.xg2");
      }

      // 如果还没找到，尝试在整个帖子容器中查找
      if (!tnsXg2) {
        const postContainer = pls.closest('[id^="post_"]');
        if (postContainer) {
          tnsXg2 = postContainer.querySelector(".tns.xg2");
        }
      }

      // 最后尝试在同级元素中查找（针对发帖者结构）
      if (!tnsXg2) {
        const parentRow = pls.closest("tr");
        if (parentRow) {
          tnsXg2 = parentRow.querySelector(".tns.xg2");
        }
      }
    }

    if (!pilCl) {
      const parentTd = pls.closest("td");
      if (parentTd) {
        pilCl = parentTd.querySelector(".pil.cl");
      }

      // 如果还没找到，尝试在整个帖子容器中查找
      if (!pilCl) {
        const postContainer = pls.closest('[id^="post_"]');
        if (postContainer) {
          pilCl = postContainer.querySelector(".pil.cl");
        }
      }

      // 最后尝试在同级元素中查找（针对发帖者结构）
      if (!pilCl) {
        const parentRow = pls.closest("tr");
        if (parentRow) {
          pilCl = parentRow.querySelector(".pil.cl");
        }
      }
    }

    // 隐藏.xl元素（不再移动到信息区域）
    xlElements.forEach((xl) => {
      xl.style.display = "none";
    });

    // 处理.tns.xg2和.pil.cl的合并
    if (tnsXg2) {
      const clonedTns = tnsXg2.cloneNode(true);

      // 如果有.pil.cl，提取积分信息并添加到.tns.xg2表格中
      if (pilCl) {
        const scoreElement = pilCl.querySelector("dd a");
        if (scoreElement) {
          const scoreValue = scoreElement.textContent.trim();
          const scoreHref = scoreElement.href;

          // 查找表格并添加积分列
          const table = clonedTns.querySelector("table");
          if (table) {
            const row = table.querySelector("tr") || table;

            // 创建积分列
            const scoreTd = document.createElement("td");
            scoreTd.innerHTML = `<p><a href="${scoreHref}" class="xi2">${scoreValue}</a></p>积分`;

            // 将积分列添加到评分列之后
            row.appendChild(scoreTd);
          }
        }
        // 隐藏原始的.pil.cl元素
        pilCl.style.display = "none";
      }

      infoSection.appendChild(clonedTns);
      tnsXg2.style.display = "none";
    } else if (pilCl) {
      // 如果只有.pil.cl没有.tns.xg2，直接移动
      const clonedPil = pilCl.cloneNode(true);
      infoSection.appendChild(clonedPil);
      pilCl.style.display = "none";
    }

    // 将原有内容添加到信息区域（如果有其他内容）
    originalContent.forEach((child) => {
      if (child.className && !child.className.includes("avatar") && !child.className.includes("m z") && !child.className.includes("i y") && !child.className.includes("xl") && !child.className.includes("pil cl") && !child.className.includes("tns xg2") && child.style.display !== "none") {
        infoSection.appendChild(child);
      }
    });

    // 将左右区域添加到弹窗
    buiElement.appendChild(avatarSection);
    buiElement.appendChild(infoSection);

    // 添加清除浮动的元素
    const clearDiv = document.createElement("div");
    clearDiv.className = "sht-clear-both";
    buiElement.appendChild(clearDiv);
  }

  // 监听动态内容加载
  function observeUserInfoChanges() {
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node.querySelector?.(".pls") || node.classList?.contains("pls") || node.querySelector?.(".tns.xg2, .pil.cl, .xl.xl2.o.cl") || node.classList?.contains("tns") || node.querySelector?.(".bui, .p_pop.bui") || node.classList?.contains("bui") || node.classList?.contains("p_pop") || (node.id && node.id.includes("userinfo")))) {
              shouldUpdate = true;
            }
          });
        }
      });

      if (shouldUpdate) {
        setTimeout(moveUserInfoToBui, 100);
      }
    });

    // 确保document.body存在后再开始观察
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } else {
      // 如果body还不存在，等待DOM加载完成
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          observer.observe(document.body, {
            childList: true,
            subtree: true,
          });
        }
      });
    }
  }

  // 添加鼠标悬停监听，确保弹窗出现时能被处理
  function addHoverListeners() {
    // 为所有头像元素添加悬停监听
    document.addEventListener("mouseover", function (e) {
      const target = e.target;

      // 检查是否是头像相关元素
      if (target.matches('.avatar img, .avtm img, a[onmouseover*="showauthor"]') || target.closest(".avatar, .avtm")) {
        // 延迟检查是否有新的弹窗出现
        setTimeout(() => {
          const newBuiElements = document.querySelectorAll(".p_pop.bui:not([data-bui-processed])");
          if (newBuiElements.length > 0) {
            moveUserInfoToBui();
          }
        }, 200);
      }
    });
  }

  // 启动悬停监听器
  addHoverListeners();

  function addHoverListeners() {
    // 监听所有用户名链接的悬停事件
    document.addEventListener("mouseover", function (e) {
      const target = e.target;
      if (target.tagName === "A" && (target.href?.includes("uid-") || target.closest(".pls") || target.classList.contains("xi2"))) {
        // 延迟检查弹窗是否出现
        setTimeout(() => {
          const buiElements = document.querySelectorAll(".p_pop.bui:not([data-reorganized])");
          buiElements.forEach((buiElement) => {
            // 查找对应的pls元素
            const allPls = document.querySelectorAll(".pls");
            for (const pls of allPls) {
              if (!pls.hasAttribute("data-bui-processed")) {
                buiElement.setAttribute("data-reorganized", "true");
                reorganizeBuiLayout(buiElement, pls);
                pls.setAttribute("data-bui-processed", "true");
                break;
              }
            }
          });
        }, 100);
      }
    });
  }

  // 添加弹窗显示/隐藏修复功能
  function addPopupFix() {
    // 用于跟踪当前显示的弹窗
    let currentPopup = null;
    let popupTimer = null;

    // 确保在DOM准备好后再初始化
    function initializeWhenReady() {
      if (!document.body) {
        setTimeout(initializeWhenReady, 100);
        return;
      }

      // 监听弹窗的显示
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              let popupElement = null;

              // 检查是否是 .p_pop.bui 弹窗
              if (node.classList && node.classList.contains("p_pop") && node.classList.contains("bui")) {
                popupElement = node;
              }
              // 检查是否包含 .p_pop.bui 弹窗
              else if (node.querySelector) {
                popupElement = node.querySelector(".p_pop.bui");
              }
              // 检查是否是以 userinfo 开头的ID
              else if (node.id && node.id.startsWith("userinfo")) {
                popupElement = node;
              }

              if (popupElement) {
                currentPopup = popupElement;

                // 清除之前的定时器
                if (popupTimer) {
                  clearTimeout(popupTimer);
                  popupTimer = null;
                }

                // 添加弹窗事件监听
                setupPopupEvents(popupElement);
              }
            }
          });

          // 检查样式变化
          if (mutation.type === "attributes" && mutation.attributeName === "style") {
            const target = mutation.target;
            if (target.classList && target.classList.contains("p_pop") && target.classList.contains("bui")) {
              const isVisible = target.style.display !== "none" && target.offsetWidth > 0;
              if (isVisible && target !== currentPopup) {
                currentPopup = target;
                setupPopupEvents(target);
              }
            }
          }
        });
      });

      // 开始观察DOM变化
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["style", "class"],
        });
      } catch (error) {
        // 静默处理错误
      }

      // 检查页面上已存在的弹窗
      function checkExistingPopups() {
        const existingPopups = document.querySelectorAll('.p_pop.bui, [id^="userinfo"]');
        existingPopups.forEach((popup) => {
          if (popup.offsetWidth > 0 && popup.offsetHeight > 0) {
            currentPopup = popup;
            setupPopupEvents(popup);
          }
        });
      }

      // 立即检查已存在的弹窗
      checkExistingPopups();

      // 定期检查，以防遗漏
      setTimeout(checkExistingPopups, 1000);
      setTimeout(checkExistingPopups, 3000);

      // 设置其他事件监听器
      setupGlobalEventListeners();
    }

    // 启动初始化
    initializeWhenReady();

    // 设置弹窗事件监听
    function setupPopupEvents(popup) {
      // 防止重复绑定事件
      if (popup.hasAttribute("data-events-bound")) {
        return;
      }
      popup.setAttribute("data-events-bound", "true");

      // 确保弹窗有正确的样式
      if (!popup.style.position) {
        popup.style.position = "absolute";
      }
      if (!popup.style.zIndex || parseInt(popup.style.zIndex) < 1000) {
        popup.style.zIndex = "9999";
      }

      // 鼠标进入弹窗时取消隐藏定时器
      popup.addEventListener("mouseenter", function () {
        if (popupTimer) {
          clearTimeout(popupTimer);
          popupTimer = null;
        }
      });

      // 鼠标离开弹窗时设置延迟隐藏
      popup.addEventListener("mouseleave", function () {
        if (popupTimer) {
          clearTimeout(popupTimer);
        }
        popupTimer = setTimeout(() => {
          hidePopup(popup);
        }, 500);
      });

      // 点击弹窗内部时阻止事件冒泡，防止意外关闭
      popup.addEventListener("click", function (e) {
        e.stopPropagation();

        // 取消任何待执行的隐藏定时器
        if (popupTimer) {
          clearTimeout(popupTimer);
          popupTimer = null;
        }
      });

      // 监听弹窗的触发元素
      const triggerId = popup.id ? popup.id.replace("userinfo", "") : null;
      if (triggerId) {
        const triggerElements = document.querySelectorAll(`a[onmouseover*="showauthor(this,${triggerId}"]`);
        triggerElements.forEach((trigger) => {
          if (!trigger.hasAttribute("data-popup-trigger-bound")) {
            trigger.setAttribute("data-popup-trigger-bound", "true");

            trigger.addEventListener("mouseleave", function () {
              setTimeout(() => {
                if (currentPopup === popup && !popup.matches(":hover")) {
                  if (popupTimer) {
                    clearTimeout(popupTimer);
                  }
                  popupTimer = setTimeout(() => {
                    hidePopup(popup);
                  }, 300);
                }
              }, 100);
            });
          }
        });
      }
    }

    // 隐藏弹窗函数
    function hidePopup(popup) {
      if (popup && popup.parentNode) {
        popup.style.display = "none";
        if (currentPopup === popup) {
          currentPopup = null;
        }
      }
    }

    // 设置全局事件监听器
    function setupGlobalEventListeners() {
      // 监听全局点击事件，点击弹窗外部时隐藏弹窗
      document.addEventListener(
        "click",
        function (e) {
          if (currentPopup && !currentPopup.contains(e.target)) {
            // 检查点击的是否是触发弹窗的元素
            const isAvatarClick = e.target.closest('.avatar, .avtm, a[onmouseover*="showauthor"], .pls');
            if (!isAvatarClick) {
              if (popupTimer) {
                clearTimeout(popupTimer);
                popupTimer = null;
              }
              hidePopup(currentPopup);
            }
          }
        },
        true
      );

      // 监听ESC键隐藏弹窗
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && currentPopup) {
          if (popupTimer) {
            clearTimeout(popupTimer);
            popupTimer = null;
          }
          hidePopup(currentPopup);
        }
      });

      // 监听页面滚动，滚动时隐藏弹窗
      document.addEventListener("scroll", function () {
        if (currentPopup) {
          if (popupTimer) {
            clearTimeout(popupTimer);
            popupTimer = null;
          }
          hidePopup(currentPopup);
        }
      });
    }

    // 修复原始论坛弹窗系统的错误
    function fixOriginalPopupSystem() {
      // 设置函数拦截
      function setupFunctionInterception() {
        if (window.showauthor && !window.showauthor._intercepted) {
          const originalShowauthor = window.showauthor;
          window.showauthor = function (obj, uid, username) {
            try {
              return originalShowauthor.call(this, obj, uid, username);
            } catch (error) {
              createFallbackPopup(obj, uid, username);
              return false;
            }
          };
          window.showauthor._intercepted = true;
        }

        if (window.authort && !window.authort._intercepted) {
          const originalAuthort = window.authort;
          window.authort = function (uid) {
            try {
              return originalAuthort.call(this, uid);
            } catch (error) {
              return false;
            }
          };
          window.authort._intercepted = true;
        }
      }

      // 立即尝试设置拦截
      setupFunctionInterception();

      // 监听脚本加载
      const scriptObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.tagName === "SCRIPT") {
              setTimeout(setupFunctionInterception, 100);
            }
          });
        });
      });

      if (document.head) {
        scriptObserver.observe(document.head, { childList: true });
      }

      // 创建备用弹窗
      function createFallbackPopup(obj, uid, username) {
        // 检查是否已有弹窗
        const existingPopup = document.getElementById("userinfo" + uid);
        if (existingPopup) {
          existingPopup.style.display = "block";
          return;
        }

        // 创建简单的用户信息弹窗
        const popup = document.createElement("div");
        popup.id = "userinfo" + uid;
        popup.className = "p_pop bui";
        popup.innerHTML = `
                <div class="avatar-section">
                    <div class="m">
                        <img src="${DEFAULT_AVATAR_BASE64}" alt="头像" onerror="this.src='${DEFAULT_AVATAR_BASE64}'">
                    </div>
                </div>
                <div class="info-section">
                    <div class="user-basic-info">
                        <div class="username">${username || "用户" + uid}</div>
                    </div>
                    <p>用户信息加载中...</p>
                </div>
                <div style="clear: both;"></div>
            `;

        // 设置弹窗样式和位置
        popup.className += " sht-fallback-popup";

        document.body.appendChild(popup);

        // 设置弹窗事件
        setupPopupEvents(popup);
        currentPopup = popup;

        // 定位弹窗
        if (obj && obj.getBoundingClientRect) {
          const rect = obj.getBoundingClientRect();
          popup.style.left = rect.right + 10 + "px";
          popup.style.top = rect.top - 50 + "px";
        }
      }

      // 添加全局错误处理，防止DOM访问错误
      function addGlobalErrorHandling() {
        // 拦截可能的jQuery错误
        const originalJQuery = window.$;
        if (originalJQuery) {
          window.$ = function (selector) {
            try {
              const result = originalJQuery(selector);
              // 为结果添加安全的innerHTML访问
              if (result && typeof result === "object") {
                const originalHtml = result.html;
                if (originalHtml) {
                  result.html = function (content) {
                    try {
                      if (arguments.length === 0) {
                        // getter
                        return this.length > 0 && this[0] ? originalHtml.call(this) : "";
                      } else {
                        // setter
                        return originalHtml.call(this, content);
                      }
                    } catch (error) {
                      return arguments.length === 0 ? "" : this;
                    }
                  };
                }
              }
              return result;
            } catch (error) {
              return originalJQuery(); // 返回空的jQuery对象
            }
          };

          // 保持jQuery的其他属性
          Object.setPrototypeOf(window.$, originalJQuery);
          Object.assign(window.$, originalJQuery);
        }
      }

      // 应用全局错误处理
      addGlobalErrorHandling();
    }

    // 应用修复
    fixOriginalPopupSystem();

    // 添加简单的错误预防措施
    function addSimpleErrorPrevention() {
      // 监听所有未捕获的错误
      window.addEventListener("error", function (e) {
        if (e.message && e.message.includes("innerHTML") && e.filename && e.filename.includes("forum_viewthread.js")) {
          e.preventDefault();
          return false;
        }
      });

      // 更安全的事件处理方式
      function setupSafeEventHandling() {
        const avatarLinks = document.querySelectorAll('a[onmouseover*="showauthor"]');

        avatarLinks.forEach((link) => {
          if (link.hasAttribute("data-safe-event-added")) return;

          const originalOnmouseover = link.getAttribute("onmouseover");
          if (originalOnmouseover) {
            // 提取用户ID和用户名
            const match = originalOnmouseover.match(/showauthor\(this,\s*(\d+),\s*'([^']*)'?\)/);
            if (match) {
              const uid = match[1];
              const username = match[2] || "";

              // 标记已处理
              link.setAttribute("data-safe-event-added", "true");

              // 添加安全的备用事件监听器
              link.addEventListener("mouseover", function () {
                // 如果原始事件失败，我们的备用事件会在短时间后触发
                setTimeout(() => {
                  const existingPopup = document.getElementById("userinfo" + uid);
                  if (!existingPopup || existingPopup.style.display === "none") {
                    createFallbackPopup(this, uid, username);
                  }
                }, 200);
              });
            }
          }
        });
      }

      // 立即设置，然后定期检查新添加的链接
      setupSafeEventHandling();
      setTimeout(setupSafeEventHandling, 1000);
      setTimeout(setupSafeEventHandling, 3000);
    }

    addSimpleErrorPrevention();
  }

  // 初始化 - 添加错误处理
  try {
    moveUserInfoToBui();
    observeUserInfoChanges();
    addHoverListeners();
    addPopupFix(); // 添加弹窗修复功能
  } catch (error) {
    // 静默处理初始化错误，避免影响其他功能
  }
})();
// #endregion
