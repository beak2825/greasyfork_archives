// ==UserScript==
// @name         0x3f-problem-solution
// @namespace    https://greasyfork.org//zh-CN/scripts/501134-0x3f-problem-solution
// @version      0.0.5.9
// @author       wuxin0011
// @description  自定义分数区间显示题目 标记题目状态 配合灵茶山艾府题单解题
// @license      MIT
// @icon         https://assets.leetcode.cn/aliyun-lc-upload/users/endlesscheng/avatar_1690721039.png
// @source       https://github.com/wuxin0011/tampermonkey-script/tree/main/0x3f-leetcode
// @supportURL   https://greasyfork.org//zh-CN/scripts/501134-0x3f-problem-solution/feedback
// @match        https://leetcode.cn/circle/discuss/*
// @match        https://leetcode.cn/discuss/*
// @match        https://leetcode.cn/
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.cn/contest/*/problems/*
// @match        https://leetcode.com
// @match        https://leetcode.com/circle/discuss/*
// @match        https://leetcode.com/discuss/*
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.com/contest/*/problems/*
// @require      https://unpkg.com/vue@3.4.31/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://unpkg.com/element-plus@2.7.6/dist/index.full.js
// @resource     elementPlusCss  https://unpkg.com/element-plus@2.7.6/dist/index.css
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/501134/0x3f-problem-solution.user.js
// @updateURL https://update.greasyfork.org/scripts/501134/0x3f-problem-solution.meta.js
// ==/UserScript==

(t=>{if(typeof GM_addStyle=="function"){GM_addStyle(t);return}const n=document.createElement("style");n.textContent=t,document.head.append(n)})(" h2[data-v-6b5a9c54]{color:#000!important;margin:10px 0!important;font-size:20px!important}.m-setting-button[data-v-3d821394]{position:fixed;top:200px;right:0;z-index:100000}.m-button[data-v-3d821394]{margin-left:16px!important;padding:5px!important;font-size:14px!important}.processs-flex[data-v-3d821394]{display:flex;justify-content:center;align-items:center}.m-setting-button[data-v-6868725a]{position:fixed;top:200px;right:0;z-index:100000}.m-button[data-v-6868725a]{margin-left:16px!important;padding:5px!important;font-size:14px!important}.processs-flex[data-v-6868725a]{display:flex;justify-content:center;align-items:center} ");

(function (ElementPlus, vue) {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  let Cache$1 = class Cache2 {
    set(k, v) {
      _GM_setValue(k, v);
    }
    get(k, parse = true, name = String.name) {
      try {
        let v = _GM_getValue(k);
        switch (name) {
          case String.name:
            if (v == null) {
              return "null";
            }
            return v;
          case Object.name:
            if (v == null || v == void 0 || typeof v != "object") {
              return {};
            }
            return v;
          case Boolean.name:
            if (v === null || v == void 0) {
              return false;
            }
            if (v == false || v == "false" || v == "" || v == "null") {
              return false;
            }
            return v;
          case Array.name:
            if (v === null || v == void 0 || !Array.isArray(v)) {
              return [];
            }
            return v;
          default:
            return v;
        }
      } catch (E) {
        return null;
      }
    }
    remove(k) {
      _GM_deleteValue(k);
    }
  };
  const Cache$2 = new Cache$1();
  function isEnglishENV() {
    return window.location.href.indexOf("https://leetcode.com") != -1;
  }
  const isHttp = (url) => /^https?:\/\/.*$/.test(url);
  const isLeetCodeCircleUrl = (url = window.location.href) => /^https?:\/\/leetcode\.(com|cn).*\/discuss\/.*/i.test(url);
  const isProblem = (url = window.location.href) => /^https?:\/\/leetcode\.(com|cn)\/problems\/.*/i.test(url);
  const isContest = (url = window.location.href) => /^https?:\/\/leetcode\.(com|cn)\/contest\/.*\/problems\/.*/.test(url);
  const isBilibili = (url = window.location.href) => /.*bilibili.*/.test(url);
  const isHome = () => window.location.href == "https://leetcode.cn/" || window.location.href == "https://leetcode.com/";
  const isZH = (url = window.location.href) => /^https?:\/\/leetcode\.cn/.test(url);
  const sleep = async (time = 500) => new Promise((resolove) => setTimeout(resolove, time));
  const EN_URL = "https://leetcode.com";
  const ZH_URL = "https://leetcode.cn";
  const LC_COPY_HTML_PLUGIN = "https://greasyfork.org//zh-CN/scripts/491969-lc-to-markdown-txt-html";
  const EN_SOLUTION_DEMO = "https://leetcode.com/discuss/interview-question/6032972/leetcode";
  const CUR_URL = isEnglishENV() ? EN_URL : ZH_URL;
  const isDev = () => JSON.parse("false");
  const width = 14;
  const height = 14;
  const svg_css_style = () => isNewUI() ? "display:inline;margin-bottom:3px;" : "";
  const bilibiliSVG = () => {
    return `<svg width="${width}px" height="${height}px" style="${svg_css_style()}" status="bilibili" title="bilibili" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#00a3d9">
  <path fill="none" d="M0 0h24v24H0z"></path>
  <path d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.75h1.166L5.775 4.855a1.25 1.25 0 1 1 1.767-1.768l2.652 2.652q.119.119.198.257h3.213q.08-.14.199-.258l2.651-2.652a1.25 1.25 0 0 1 1.768 0m.027 5.42H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.199 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.25-1.25-1.25zm-10 2.5c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25m7.5 0c.69 0 1.25.56 1.25 1.25v1.25a1.25 1.25 0 1 1-2.5 0v-1.25c0-.69.56-1.25 1.25-1.25"></path>
</svg>
`;
  };
  const problemContenst = () => `
<svg width="${width}px" height="${height}px" style="${svg_css_style()}" status="contest" title="竞赛题目专属图标" viewBox="-3.5 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.73795 18.8436L12.9511 20.6987L6.42625 32L4.55349 27.8233L9.73795 18.8436Z" fill="#CE4444"/>
<path d="M9.73795 18.8436L6.52483 16.9885L0 28.2898L4.55349 27.8233L9.73795 18.8436Z" fill="#983535"/>
<path d="M14.322 18.8436L11.1088 20.6987L17.6337 32L19.5064 27.8233L14.322 18.8436Z" fill="#983535"/>
<path d="M14.322 18.8436L17.5351 16.9885L24.0599 28.2898L19.5064 27.8233L14.322 18.8436Z" fill="#CE4444"/>
<path d="M22.9936 11.0622C22.9936 17.1716 18.0409 22.1243 11.9314 22.1243C5.82194 22.1243 0.869249 17.1716 0.869249 11.0622C0.869249 4.9527 5.82194 0 11.9314 0C18.0409 0 22.9936 4.9527 22.9936 11.0622Z" fill="url(#paint0_linear_103_1801)"/>
<path d="M20.5665 11.0621C20.5665 15.8311 16.7004 19.6972 11.9315 19.6972C7.16247 19.6972 3.29645 15.8311 3.29645 11.0621C3.29645 6.29315 7.16247 2.42713 11.9315 2.42713C16.7004 2.42713 20.5665 6.29315 20.5665 11.0621Z" fill="#A88300"/>
<path d="M21.0477 11.984C21.0477 16.7641 17.1727 20.6391 12.3926 20.6391C7.61251 20.6391 3.73748 16.7641 3.73748 11.984C3.73748 7.20389 7.61251 3.32887 12.3926 3.32887C17.1727 3.32887 21.0477 7.20389 21.0477 11.984Z" fill="#C28B37"/>
<path d="M20.5868 11.0621C20.5868 15.8422 16.7118 19.7172 11.9317 19.7172C7.15159 19.7172 3.27656 15.8422 3.27656 11.0621C3.27656 6.28205 7.15159 2.40702 11.9317 2.40702C16.7118 2.40702 20.5868 6.28205 20.5868 11.0621Z" fill="#C09525"/>
<path d="M11.9781 5.04096L13.8451 8.77502L17.5792 9.24178L15.0151 12.117L15.7122 16.2431L11.9781 14.3761L8.24404 16.2431L8.94729 12.117L6.37701 9.24178L10.1111 8.77502L11.9781 5.04096Z" fill="url(#paint1_linear_103_1801)"/>
<defs>
<linearGradient id="paint0_linear_103_1801" x1="11.1804" y1="4.03192" x2="12.6813" y2="31.965" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFC600"/>
<stop offset="1" stop-color="#FFDE69"/>
</linearGradient>
<linearGradient id="paint1_linear_103_1801" x1="11.9783" y1="5.04096" x2="11.9783" y2="16.2431" gradientUnits="userSpaceOnUse">
<stop stop-color="#FFFCDD"/>
<stop offset="1" stop-color="#FFE896"/>
</linearGradient>
</defs>
</svg>

`;
  const problemFinsh = () => `

<svg width="${width}px" height="${height}px" style="${svg_css_style()}" status="ac" title="AC专属图标" viewBox="0 0 1024 1024"  version="1.1"
xmlns="http://www.w3.org/2000/svg">
<path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#4CAF50" />
<path
    d="M738.133333 311.466667L448 601.6l-119.466667-119.466667-59.733333 59.733334 179.2 179.2 349.866667-349.866667z"
    fill="#CCFF90" />
</svg>

`;
  const problemsTry = () => `
<svg width="${width}px" height="${height}px"  style="${svg_css_style()}" status="notac" title="尝试过" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
style="enable-background:new 0 0 512 512;" xml:space="preserve">
<path style="fill:#FEDEA1;" d="M256,12.8C121.899,12.8,12.8,121.899,12.8,256S121.899,499.2,256,499.2S499.2,390.101,499.2,256
S390.101,12.8,256,12.8z" />
<g>
    <path style="fill:#573A32;" d="M256,115.2c-49.271,0-92.561,25.353-117.726,63.676l18.859,18.859
C177.178,163.806,213.734,140.8,256,140.8c63.625,0,115.2,51.567,115.2,115.2h-38.4l51.2,51.2l51.2-51.2h-38.4
C396.8,178.244,333.764,115.2,256,115.2z" />
    <path style="fill:#573A32;" d="M256,0C114.62,0,0,114.62,0,256s114.62,256,256,256s256-114.62,256-256S397.38,0,256,0z M256,486.4
C128.956,486.4,25.6,383.044,25.6,256S128.956,25.6,256,25.6S486.4,128.956,486.4,256S383.044,486.4,256,486.4z" />
    <path style="fill:#573A32;" d="M256,371.2c-63.625,0-115.2-51.567-115.2-115.2h38.4L128,204.8L76.8,256h38.4
c0,77.756,63.036,140.8,140.8,140.8c49.272,0,92.561-25.353,117.726-63.676l-18.859-18.859
C334.822,348.194,298.266,371.2,256,371.2z" />
</g>
</svg>

`;
  const resetSVG = (size = 20) => `
<svg width="${size}px" height="${size}px" style="${svg_css_style()} 'cursor':'pointer'; " viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><path d="m4.5 1.5c-2.4138473 1.37729434-4 4.02194088-4 7 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/><path d="m4.5 5.5v-4h-4"/></g></svg>

`;
  const updateSVG = (size = 20) => `
<svg width="${size}px" height="${size}px" style="${svg_css_style()} 'cursor':'pointer'; " viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<path d="M16.592 1.152c-0.053-0.010-1.321-0.244-2.981-0.244-2.105 0-3.828 0.366-5.125 1.088-1.518-0.765-3.264-1.152-5.196-1.152-1.681 0-2.866 0.302-2.915 0.315l-0.375 0.098 0.001 13.906 0.624-0.161c0.011-0.002 1.12-0.283 2.665-0.283 1.447 0 2.771 0.24 3.96 0.703v0.828h2.5v-0.856c1.281-0.488 2.747-0.611 3.86-0.611 1.562 0 2.786 0.225 2.798 0.227l0.592 0.11v-13.891l-0.408-0.077zM1 13.907v-11.858c0.451-0.084 1.277-0.205 2.29-0.205 1.761 0 3.339 0.36 4.71 1.044v11.776c-1.403-0.617-2.977-0.945-4.71-0.945-0.969 0-1.773 0.101-2.29 0.188zM16 13.938c-0.536-0.070-1.393-0.154-2.39-0.154-1.848 0-3.381 0.298-4.61 0.855v-11.773c1.422-0.78 3.271-0.958 4.61-0.958 1.023 0 1.902 0.097 2.39 0.164v11.866z" fill="#121212" />
</svg>
`;
  const problemsNo = () => install_pos() ? `
<svg width="${width}px" height="${height}px" style="${svg_css_style()}" status="null" title="未尝试" viewBox="0 0 24 24" id="meteor-icon-kit__regular-circle" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#758CA3"/></svg>
` : ``;
  const createStatus = (status, link, removeSvg = false) => {
    var _a;
    let node;
    if (!link) {
      return;
    }
    const curUrl = (link == null ? void 0 : link.href) ?? ((_a = link.querySelector("a")) == null ? void 0 : _a.href);
    node = link instanceof HTMLAnchorElement ? link.parentElement : link;
    if (node) {
      node.status = status;
    }
    if (removeSvg) {
      let svg2 = node.querySelector("svg");
      if (svg2) {
        svg2.remove();
      }
    }
    let installSVG = "";
    if (isContest(curUrl)) {
      installSVG = problemContenst();
    } else if (isLeetCodeCircleUrl(curUrl)) ;
    else if (isBilibili(curUrl)) {
      installSVG = bilibiliSVG();
    } else {
      if (status == STATUS["AC"]) {
        installSVG = problemFinsh();
      } else if (status == STATUS["notac"]) {
        installSVG = problemsTry();
      } else if (status == STATUS["NO"]) {
        installSVG = problemsNo();
      }
    }
    let svg = node.querySelector("svg");
    if (svg) {
      if (svg.getAttribute("status") == status || svg.getAttribute("status") == STATUS["AC"]) {
        return false;
      }
      svg.remove();
    }
    if (isBilibili(curUrl)) {
      node.innerHTML = node.innerHTML + "&nbsp;" + installSVG;
    } else {
      node.innerHTML = install_pos() ? installSVG + node.innerHTML : node.innerHTML + installSVG;
    }
    return true;
  };
  function Message(title = "确认操作", callback = () => {
  }, canlcelCallback = () => {
  }) {
    ElementPlus.ElMessageBox.confirm(
      `${title} ?`,
      "警告",
      {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      }
    ).then(() => {
      callback();
    }).catch(() => {
      ElementPlus.ElMessage({
        type: "info",
        message: "已取消"
      });
      canlcelCallback();
    });
  }
  function tips_message() {
    if (isEnglish() && isZH() && Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type_tips__"]) == "OK") {
      ElementPlus.ElMessageBox.alert(
        `<div>
              <p>检查到当前环境为国服,如果需要同步功能需要切换到美服，或者复制一份题单到美服自己使用 否则仅保留替换链接功能，没有同步功能 </p>
              <ul>
                <li>你可以使用<a style="color:blue;" target="_blank" href="${LC_COPY_HTML_PLUGIN}">lc-to-markdown-txt-html</a> 来复制题单 </li>
                <li><a style="color:red;" target="_blank" href="${EN_SOLUTION_DEMO}">查看美服题单示例</a> </li>
              <ul>
             <div>`,
        "提示",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          cancelButtonText: "下次再说",
          confirmButtonText: "不再提示"
        }
      ).then((e) => {
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type_tips__"], "NO");
      }).catch((e) => {
        if (e == "cancel") {
          Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type_tips__"]) == "OK_1";
          ElementPlus.ElMessage.warning({
            message: "下次切换到美服环境提示"
          });
        }
      });
    }
  }
  function update_version() {
    _GM_registerMenuCommand(`更新脚本🔗`, () => {
      ElementPlus.ElMessageBox.alert(
        `<div>
              <p>📣 提示:最近油猴需要科学工具才能访问，如果你使用油猴，可以到脚本猫中找到源代码，复制覆盖当前脚本也能更新  </p>
              <br/>
              <p><a style="color:blue;" target="_blank" href="https://scriptcat.org/zh-CN/script-show-page/1967/"> 脚本猫🐱 </a></p>
              <p><a style="color:blue;" target="_blank" href="https://greasyfork.org//zh-CN/scripts/501134-0x3f-problem-solution"> 油猴🐒 </a>【需要科学工具访问】</p>
              <p><a style="color:blue;" target="_blank" href="https://gfork.dahi.icu/zh-CN/scripts/501134/"> 油猴镜像🐒  </a> 【不保证镜像存在】</p>
              <p><a style="color:blue;" target="_blank" href="https://github.com/wuxin0011/tampermonkey-script/blob/main/0x3f-leetcode/dist/0x3f-leetcode-problems.js"> github 源代码更新 </a> 【最直接方式】</p>
             
             <div>`,
        "更新☕",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "确认"
        }
      );
    }, { title: "点击更新更新脚本" });
  }
  function stop_disscuss_command() {
    if (isLeetCodeCircleUrl()) {
      let is_stop = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_stop_discuss_"], true, String.name);
      is_stop = is_stop != "false" && is_stop != false;
      if (is_stop) {
        _GM_addStyle(".t6Fde{ display:none !important;}");
      }
      if (isDev()) {
        console.log("is_stop ", is_stop);
      }
      _GM_registerMenuCommand(`${is_stop ? "开启" : "关闭"}右侧讨论区📣`, () => {
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_stop_discuss_"], !is_stop);
        window.location.reload();
      }, { title: "如果认为右侧讨论区太难看可以直接屏蔽😅" });
    }
  }
  const inf = 5e3;
  const mi = 800;
  const __0X3F_PROBLEM_KEYS__$1 = {
    "__0x3f_problmes_solution__": "__0x3f_problmes_solution__",
    // 基本信息
    "__0x3f_problmes_urls__": "__0x3f_problmes_urls__",
    // 题单key
    "__0x3f_problmes_update__": "__0x3f_problmes_update__",
    // 是否修改了默认题单key
    "__0x3f_problmes_button_is_none__": "__is_none_0x3f_problmes_button__",
    // 是否隐藏设置按钮
    "__0x3f_problmes_insert_pos__": "__0x3f_problmes_insert_pos__",
    // 安装位置
    "__0x3f_problmes_status_update__": "__0x3f_problmes_status_update__",
    "__0x3f_problmes_plugin_load_ok__": "__0x3f_problmes_plugin_load_ok__",
    // 是否使用插件
    "__0x3f_problmes_add_cur__": "__0x3f_problmes_add_cur__",
    // 添加 url
    "__0x3f_problmes_ac_key__": "__local_ok_problem_key__",
    // ac key
    "__0x3f_problmes_ac_version__": "__0x3f_problmes_ac_version__",
    // TODO ac key version
    "__0x3f_problmes_all_problems__": "__0x3f_problmes_all_problems__",
    // all problems
    "__0x3f_problmes_random_problems_key__": "__0x3f_problmes_random_problems_key__",
    //随机题目快捷键
    "__0x3f_problmes_random_problems__": "__0x3f_problmes_random_problems__",
    //随机题目
    "__0x3f_problme_support_type__": "__0x3f_problme_support_type__",
    //是否替换到com 默认cn
    "__0x3f_problme_support_type_tips__": "__0x3f_problme_support_type_tips__",
    //是否替换到com 默认cn 不再提示key
    "__0x3f_problme_stop_discuss_": "__0x3f_problme_default_stop_discuss_",
    //屏蔽讨论区 默认屏蔽
    "__0x3f_problme_score_": "__0x3f_problme_score_",
    // 显示题目分数 默认不显示
    "__0x3f_problme_score_tot_key": "__0x3f_problme_score_tot_key",
    // 题目分数 缓存
    "__0x3f_problme_rating": "__0x3f_problme_rating"
    // 0神分数rating
  };
  const STATUS = {
    "AC": "ac",
    "NO": "null",
    "notac": "notac",
    "Accepted": "ac",
    "Wrong Answer": "notac"
  };
  const defaultUrls = [
    { "title": "数学算法（数论/组合/概率期望/博弈/计算几何/随机算法", "link": "https://leetcode.cn/discuss/post/3584388/fen-xiang-gun-ti-dan-shu-xue-suan-fa-shu-gcai/", "tot": 0, "ac": 0, "id": 1, "disabled": false, "select": true, "version": 1 },
    { "title": "常用数据结构（前缀和/差分/栈/队列/堆/字典树/并查集/树状数组/线段树）", "link": "https://leetcode.cn/discuss/post/3583665/fen-xiang-gun-ti-dan-chang-yong-shu-ju-j-bvmv/", "tot": 0, "ac": 0, "id": 2, "disabled": false, "select": true, "version": 1 },
    { "title": "动态规划（入门/背包/状态机/划分/区间/状压/数位/树形/数据结构优化）", "link": "https://leetcode.cn/discuss/post/3581838/fen-xiang-gun-ti-dan-dong-tai-gui-hua-ru-007o/", "tot": 0, "ac": 0, "id": 3, "disabled": false, "select": true, "version": 1 },
    { "title": "图论算法（DFS/BFS/拓扑排序/最短路/最小生成树/二分图/基环树/欧拉路径）", "link": "https://leetcode.cn/discuss/post/3581143/fen-xiang-gun-ti-dan-tu-lun-suan-fa-dfsb-qyux/", "tot": 0, "ac": 0, "id": 4, "disabled": false, "select": true, "version": 1 },
    { "title": "位运算（基础/性质/拆位/试填/恒等式/贪心/脑筋急转弯）", "link": "https://leetcode.cn/discuss/post/3580371/fen-xiang-gun-ti-dan-wei-yun-suan-ji-chu-nth4/", "tot": 0, "ac": 0, "id": 5, "disabled": false, "select": true, "version": 1 },
    { "title": "网格图（DFS/BFS/综合应用)", "link": "https://leetcode.cn/discuss/post/3580371/fen-xiang-gun-ti-dan-wei-yun-suan-ji-chu-nth4/", "tot": 0, "ac": 0, "id": 6, "disabled": false, "select": true, "version": 1 },
    { "title": "单调栈（矩形面积/贡献法/最小字典序", "link": "https://leetcode.cn/discuss/post/3579480/ti-dan-dan-diao-zhan-ju-xing-xi-lie-zi-d-u4hk/", "tot": 0, "ac": 0, "id": 7, "disabled": false, "select": true, "version": 1 },
    { "title": "二分算法（二分答案/最小化最大值/最大化最小值/第K小", "link": "https://leetcode.cn/discuss/post/3579164/ti-dan-er-fen-suan-fa-er-fen-da-an-zui-x-3rqn/", "tot": 0, "ac": 0, "id": 8, "disabled": true, "select": true, "version": 1 },
    { "title": "滑动窗口（定长/不定长/多指针", "link": "https://leetcode.cn/discuss/post/3578981/ti-dan-hua-dong-chuang-kou-ding-chang-bu-rzz7/", "tot": 0, "ac": 0, "id": 9, "disabled": false, "select": true, "version": 1 },
    { "title": "贪心算法（基本贪心策略/反悔/区间/字典序/数学/思维/构造）", "link": "https://leetcode.cn/discuss/post/3091107/fen-xiang-gun-ti-dan-tan-xin-ji-ben-tan-k58yb/", "tot": 0, "ac": 0, "id": 10, "disabled": false, "select": true, "version": 1 },
    { "title": "链表、二叉树与一般树（前后指针/快慢指针/DFS/BFS/直径/LCA）", "link": "https://leetcode.cn/discuss/post/3142882/fen-xiang-gun-ti-dan-lian-biao-er-cha-sh-6srp/", "tot": 0, "ac": 0, "id": 11, "disabled": false, "select": true, "version": 1 },
    { "title": "字符串（KMP/Z函数/Manacher/字符串哈希/AC自动机/后缀数组/子序列自动机）", "link": "https://leetcode.cn/discuss/post/3144832/fen-xiang-gun-ti-dan-zi-fu-chuan-kmpzhan-ugt4/", "tot": 0, "ac": 0, "id": 12, "disabled": false, "select": true, "version": 1 }
    // { 'title': '灵茶题单完成情况', 'link': 'https://leetcode.cn/u/endlesscheng/', 'tot': 0, 'ac': 0, 'id': 0x3f3f3f3f,'disabled':true,'select':false },
  ];
  const old_url_map = {
    "https://leetcode.cn/circle/discuss/IYT3ss/": "https://leetcode.cn/discuss/post/3584388/fen-xiang-gun-ti-dan-shu-xue-suan-fa-shu-gcai/",
    "https://leetcode.cn/circle/discuss/mOr1u6/": "https://leetcode.cn/discuss/post/3583665/fen-xiang-gun-ti-dan-chang-yong-shu-ju-j-bvmv/",
    "https://leetcode.cn/circle/discuss/tXLS3i/": "https://leetcode.cn/discuss/post/3581838/fen-xiang-gun-ti-dan-dong-tai-gui-hua-ru-007o/",
    "https://leetcode.cn/circle/discuss/01LUak/": "https://leetcode.cn/discuss/post/3581143/fen-xiang-gun-ti-dan-tu-lun-suan-fa-dfsb-qyux/",
    "https://leetcode.cn/circle/discuss/dHn9Vk/": "https://leetcode.cn/discuss/post/3580371/fen-xiang-gun-ti-dan-wei-yun-suan-ji-chu-nth4/",
    "https://leetcode.cn/circle/discuss/YiXPXW/": "https://leetcode.cn/discuss/post/3580195/fen-xiang-gun-ti-dan-wang-ge-tu-dfsbfszo-l3pa/",
    "https://leetcode.cn/circle/discuss/9oZFK9/": "https://leetcode.cn/discuss/post/3579480/ti-dan-dan-diao-zhan-ju-xing-xi-lie-zi-d-u4hk/",
    "https://leetcode.cn/circle/discuss/SqopEo/": "https://leetcode.cn/discuss/post/3579164/ti-dan-er-fen-suan-fa-er-fen-da-an-zui-x-3rqn/",
    "https://leetcode.cn/circle/discuss/0viNMK/": "https://leetcode.cn/discuss/post/3578981/ti-dan-hua-dong-chuang-kou-ding-chang-bu-rzz7/",
    "https://leetcode.cn/circle/discuss/g6KTKL/": "https://leetcode.cn/discuss/post/3091107/fen-xiang-gun-ti-dan-tan-xin-ji-ben-tan-k58yb/",
    "https://leetcode.cn/circle/discuss/K0n2gO/": "https://leetcode.cn/discuss/post/3142882/fen-xiang-gun-ti-dan-lian-biao-er-cha-sh-6srp/",
    "https://leetcode.cn/circle/discuss/SJFwQI/": "https://leetcode.cn/discuss/post/3144832/fen-xiang-gun-ti-dan-zi-fu-chuan-kmpzhan-ugt4/"
  };
  const defaultObj = {
    min: mi,
    max: inf,
    visiableMember: true,
    onlyUrls: false,
    useDefaultSetting: true,
    hiddenAc: false,
    showAcConfig: true,
    sortedType: 0
  };
  function install_pos() {
    return !Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_insert_pos__"], false, Boolean.name);
  }
  function isShow(text, min, max) {
    if (!text) {
      return true;
    }
    let res = text.match(/\d+/ig);
    if (!res) {
      return true;
    }
    if (Array.isArray(res) && res.length < 2) {
      return true;
    }
    let s = 0;
    for (let i = res.length - 1; i >= 0; i--) {
      s = res[i];
      if (s >= mi && s <= inf) {
        return s >= min && s <= max;
      }
    }
    return true;
  }
  let A = void 0;
  const isNewUI = () => !document.querySelector(isEnglishENV() ? ".discuss-markdown-container" : '#lc-content [class*="CollapsibleMarkdownContent"] [class*="MarkdownContent"]');
  const linkCssSelector_pre = () => {
    if (isEnglishENV()) {
      return isNewUI() ? ".break-words" : ".discuss-markdown-container";
    }
    return isNewUI() ? ".break-words" : `#lc-content [class*="CollapsibleMarkdownContent"] [class*="MarkdownContent"]`;
  };
  const linkCssSelector = `${linkCssSelector_pre()} li>a`;
  const queryProblem = () => Array.from(document.querySelectorAll(linkCssSelector)).filter((item) => item && item instanceof HTMLAnchorElement && (isProblem(item.href) || isContest(item.href)));
  function loadProblems() {
    A = queryProblem();
    return A;
  }
  function handlerProblem(data) {
    var _a;
    try {
      loadProblems();
      let { min, max, visiableMember, useDefaultSetting, onlyUrls, hiddenAc } = data;
      if (isNaN(min) || isNaN(max)) {
        min = mi;
        max = inf;
      }
      if (min < mi) {
        min = mi;
      }
      if (max < min) {
        max = inf;
      }
      min = Number(min);
      max = Number(max);
      data.min = min;
      data.max = max;
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_solution__"], data);
      const cache = getLocalProblemStatus();
      if (isDev()) {
        console.log("data", data.hiddenAc);
      }
      for (let i = 0; i < A.length; i++) {
        if (!(A[i] instanceof HTMLAnchorElement)) {
          continue;
        }
        let d = (_a = A[i]) == null ? void 0 : _a.parentNode;
        if (!d) {
          continue;
        }
        let Nohidden = isShow(d.textContent, min, max);
        d.style.display = Nohidden ? "" : "none";
        if (!Nohidden) {
          continue;
        }
        if (hiddenAc) {
          const a = d.querySelector("a");
          const svg = d.querySelector("svg");
          d.style.display = a && a.href && STATUS["AC"] == cache[getId(a.href)] || svg && svg.getAttribute("status") && svg.getAttribute("status") == STATUS["AC"] ? "none" : "";
        } else {
          d.style.display = "";
        }
        let c = d.textContent && d.textContent.indexOf("会员") != -1;
        if (!c) {
          continue;
        }
        d.style.display = visiableMember ? "" : "none";
      }
    } catch (e) {
      console.log("error", e);
    }
  }
  function computeAcInfo(saveUrls = [], deleteOk = true) {
    let infos = [];
    let set = /* @__PURE__ */ new Set();
    for (let i = 0, u = null; Array.isArray(saveUrls) && i < saveUrls.length; i++) {
      try {
        u = saveUrls[i];
        if (!(u == null ? void 0 : u.link) || !(u == null ? void 0 : u.title) || !(u == null ? void 0 : u.id) || set.has(u.link)) {
          continue;
        }
        if (u["select"] == void 0) u.select = true;
        if (u["loading"] == void 0 || u["loading"]) u["loading"] = false;
        let s = Object.values(u).join("");
        if (s == "null" || !Cache$2.get(u.link) || !getAcCountKey(u.link) || !Cache$2.get(getAcCountKey(u.link))) {
          continue;
        }
        let o = Cache$2.get(getAcCountKey(u.link));
        u["ac"] = isNaN(o["ac"]) ? 0 : parseInt(o["ac"]);
        u["tot"] = isNaN(o["tot"]) ? 0 : parseInt(o["tot"]);
        u["version"] = isNaN(u["version"]) ? 1 : parseInt(u["version"]);
        set.add(u.link);
      } catch (e) {
      }
      infos.push(Object.assign({}, u));
    }
    if (deleteOk) {
      for (let i = 0; i < saveUrls[i]; i++) {
        delete saveUrls[i];
      }
      for (let info of infos) {
        saveUrls.push(info);
      }
    }
    if (isDev()) {
      console.log("{{ scope.row }}", infos);
    }
    return infos;
  }
  const initUrls = () => {
    var _a;
    let saveUrls = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_update__"], true, Boolean.name) ? Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], true, Array.name) : defaultUrls;
    for (let i = 0; i < saveUrls.length; i++) {
      if (((_a = saveUrls[i]) == null ? void 0 : _a.link) && old_url_map[`${saveUrls[i].link}`]) {
        saveUrls[i].link = old_url_map[saveUrls[i].link];
      }
    }
    return computeAcInfo(saveUrls);
  };
  const initObj = () => {
    let obj = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_solution__"]) ? Object.assign(defaultObj, Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_solution__"])) : defaultObj;
    if (obj["showAcConfig"] == null || obj["showAcConfig"] == void 0) {
      obj.showAcConfig = true;
    }
    if (obj["sortedType"] == null || obj["sortedType"] == void 0) {
      obj.sortedType = 0;
    }
    let temp = {};
    for (let key of Object.keys(obj)) {
      if (!isNaN(key) || defaultObj[`${key}`] == void 0) continue;
      temp[`${key}`] = obj[`${key}`];
    }
    return temp;
  };
  const support_plugins = () => {
    const u = initObj();
    if (!u || !u.onlyUrls) return true;
    let url = window.location.href;
    if (isLeetCodeCircleUrl(url) && url.indexOf("view") != -1) {
      try {
        url = url.split("view")[0];
      } catch (e) {
        url = window.location.href;
      }
    }
    const urls = initUrls();
    for (let info of urls) {
      if (!info || !(info == null ? void 0 : info.link)) {
        continue;
      }
      if (info.link.indexOf(url) != -1) {
        return true;
      }
    }
    return false;
  };
  function getId(problemUrl) {
    if (isContest(problemUrl) || isProblem(problemUrl)) {
      try {
        return problemUrl.split("problems")[1].split("/")[1];
      } catch (e) {
        return "";
      }
    }
    return "";
  }
  function postData(ID2) {
    return {
      "query": "\n    query userQuestionStatus($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    status\n  }\n}\n    ",
      "variables": {
        "titleSlug": ID2
      },
      "operationName": "userQuestionStatus"
    };
  }
  async function queryStatus(ID2 = "", cache = {}, cur = void 0, watch2 = false) {
    var _a, _b, _c;
    if (!ID2) {
      return;
    }
    if (cache[ID2] == void 0 || cache[ID2] != STATUS["AC"]) {
      const response = await getProblemAcInfo(ID2);
      if (isDev()) {
        console.log("query result response:", response);
      }
      if ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.question) {
        const status = (_c = (_b = response == null ? void 0 : response.data) == null ? void 0 : _b.question) == null ? void 0 : _c.status;
        if (cache[ID2] == void 0 || cache[ID2] != status) {
          cache[ID2] = status == null ? "null" : status;
          if (watch2) {
            if (isDev()) {
              console.log("save local status :", cache[ID2], "status = ", status, "get local status :", Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"])[ID2]);
            }
            watchSaveStatus(ID2, cache[ID2]);
          }
          createStatus(cache[ID2], cur);
        }
      } else {
        console.warn("query result is undefined");
        createStatus(cache[ID2], cur);
      }
    }
  }
  async function addProcess(reload = true, doms = void 0, asyncAc = false) {
    var _a;
    let problems_doms = Array.isArray(doms) ? doms : loadProblems();
    const cache = getLocalProblemStatus();
    let uid = 0, query_cnt = 0;
    const isReplaceEnglish = isEnglish();
    for (let i = 0; i < problems_doms.length; i++) {
      let cur = problems_doms[i].parentElement;
      if (!(cur instanceof HTMLElement)) {
        continue;
      }
      const ID2 = getId((_a = problems_doms[i]) == null ? void 0 : _a.href);
      if (!ID2) {
        continue;
      }
      if (install_pos()) {
        cur.style.listStyleType = "none";
      }
      if (isReplaceEnglish && problems_doms[i].href) {
        problems_doms[i].href = problems_doms[i].href.replace("leetcode.cn", "leetcode.com");
      }
      if (!cache[ID2] || cache[ID2] != STATUS["AC"] && asyncAc) {
        await sleep(20);
        await queryStatus(ID2, cache, cur, false);
        query_cnt++;
        if (query_cnt % 10 == 0) {
          Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], cache);
        }
      } else {
        let status = cache[ID2];
        uid++;
        createStatus(status, cur);
      }
    }
    if (isDev()) {
      console.log("cache num :", uid, ",tot:", A.length);
    }
    getProcess();
    Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], cache);
    let other = Array.from(document.querySelectorAll(`${linkCssSelector_pre()} p>a`)).filter((item) => item && item instanceof HTMLAnchorElement && isBilibili(item.href));
    for (let i = 0; i < other.length; i++) {
      createStatus("null", other[i]);
    }
  }
  const submitProblems = (url = window.location.href, timeout = 500) => {
    const ID2 = getId(url);
    if (!ID2) {
      return;
    }
    setTimeout(() => {
      const cache = getLocalProblemStatus();
      if (isDev()) {
        console.log("ID:", ID2, "query status: ", cache[ID2]);
      }
      queryStatus(ID2, cache, void 0, true);
    }, timeout);
  };
  const watchSaveStatus = (ID2, status) => {
    const cache = getLocalProblemStatus();
    if (cache[ID2] != "ac") {
      cache[ID2] = status;
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], cache);
      window.localStorage.setItem(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_status_update__"], JSON.stringify({
        "id": ID2,
        "status": status
      }));
    }
    showProblemSolve();
  };
  const watchLinkStatusUpdate = (e) => {
    var _a;
    if (e.key != __0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_status_update__"]) {
      return;
    }
    let { id, status } = JSON.parse(e.newValue);
    if (!id || !status) {
      return;
    }
    let thisLink = `${CUR_URL}/problems/${id}`;
    if (isDev()) {
      console.log("update", thisLink, "status", status);
    }
    let link = document.querySelector(`${linkCssSelector}[href^="${CUR_URL}/problems/${id}"]`);
    if (!link || !(link == null ? void 0 : link.parentElement)) {
      let doms = loadProblems();
      for (let i = 0; i < doms.length; i++) {
        if (!doms[i] || !((_a = doms[i]) == null ? void 0 : _a.parentElement)) {
          continue;
        }
        if (doms[i].href.indexOf(thisLink) != -1) {
          link = doms[i];
          break;
        }
      }
    }
    createStatus(status, link);
  };
  function getAcCountKey(k) {
    if (!k) return "";
    return `0x3f_ac_key_${k}`;
  }
  async function getProcess() {
    var _a;
    loadProblems();
    const cache = getLocalProblemStatus();
    const config = initObj();
    const response = await githubProblem(true);
    const mapInfo = response[1];
    let cnt = 0;
    let tot = 0;
    for (let i = 0; i < A.length; i++) {
      let ID2 = getId(A[i].href);
      if (!(config == null ? void 0 : config.visiableMember) && ((_a = mapInfo.get(ID2)) == null ? void 0 : _a.member)) {
        continue;
      }
      if (ID2 && cache[ID2] == STATUS["AC"]) {
        cnt++;
      }
      tot++;
    }
    let url = window.location.href;
    if (A.length > 0 && getAcCountKey(url)) {
      Cache$2.set(getAcCountKey(url), { "tot": tot, "ac": cnt });
    }
    return [cnt, tot];
  }
  function getLocalProblemStatus() {
    return Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], true, Object.name);
  }
  function getRandomInfo(array) {
    if (!Array.isArray(array)) return void 0;
    return array[Math.floor(Math.random() * array.length)];
  }
  function isEnglish() {
    return Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type__"], Boolean.name) == true;
  }
  function changeEnglishType() {
    Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type__"], !isEnglish());
    if (Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type_tips__"], String.name) != "NO") {
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_support_type_tips__"], "OK");
    }
    window.location.reload();
  }
  function installEnglishLinkChangeCommand() {
    if (!isLeetCodeCircleUrl() || isEnglishENV()) {
      return;
    }
    _GM_registerMenuCommand(`题目链接切换到${isEnglish() ? "国服🎈" : "美服🌎"}`, () => {
      changeEnglishType();
    }, { title: "将题单链接替换为国服或者替换为美服" });
  }
  async function githubProblem(not_filter_member = true) {
    let allProbmems;
    if (!Array.isArray(allProbmems) || allProbmems.length == 0) {
      let response = await getProblemsJSON();
      if (Array.isArray(response)) {
        allProbmems = [...response];
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_all_problems__"], [...response]);
      }
      if (isDev()) {
        console.log("response allProbmems", response, allProbmems);
      }
    } else {
      allProbmems = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_all_problems__"], true, Array.name);
      if (isDev()) {
        console.log("else allProbmems", allProbmems);
      }
    }
    if (!Array.isArray(allProbmems)) {
      ElementPlus.ElMessage({
        type: "error",
        message: "随机题目失败获取不到任何信息 ！请如果出现这种情况，请前往 https://github.com/wuxin0011/tampermonkey-script/issues 反馈",
        duration: 6e3
      });
      return;
    }
    let config = initObj();
    let urlsData = initUrls();
    let set = /* @__PURE__ */ new Set();
    for (let info of urlsData) {
      if (info.link && info.select) {
        set.add(info.link);
      }
    }
    let acMap = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], true, Object.name);
    if (isDev()) {
      console.log("config and set", config, set);
      console.log("acMap", acMap);
    }
    let infos = [];
    let mapInfo = /* @__PURE__ */ new Map();
    let totInfo = [];
    for (let info of allProbmems) {
      if (!(info == null ? void 0 : info.problemUrl) || !set.has(info == null ? void 0 : info.problemUrl) || !Array.isArray(info.problems) || info.problems.length == 0) {
        continue;
      }
      if (isDev()) {
        console.log("check2");
      }
      let cur_infos = [];
      for (let i = 0; Array.isArray(info.problems) && i < info.problems.length; i++) {
        try {
          let { title, url, member, score, titleSlug: titleSlug2 } = info.problems[i];
          if (!url || !title) continue;
          if (!(config == null ? void 0 : config.visiableMember) && member || !not_filter_member && member) {
            continue;
          }
          let new_obj = { title, url, member, score, titleSlug: titleSlug2, "status": acMap[titleSlug2] };
          infos.push(new_obj);
          cur_infos.push(new_obj);
          mapInfo.set(titleSlug2, new_obj);
        } catch (e) {
          console.log("error", e);
        }
      }
      info.problems = cur_infos;
      totInfo.push(info);
    }
    return [infos, mapInfo, totInfo];
  }
  async function randomProblem() {
    let responseDatas = await githubProblem();
    let acMap = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], true, Object.name);
    let config = initObj();
    let problems = responseDatas[0];
    let infos = [];
    for (let i = 0; Array.isArray(problems) && i < problems.length; i++) {
      try {
        let { title, url, member, score, titleSlug: titleSlug2 } = problems[i];
        if (!url || !title) continue;
        if (isDev()) {
        }
        if (!(config == null ? void 0 : config.showAcConfig) && acMap[titleSlug2] == "ac") {
          continue;
        }
        if (!(config == null ? void 0 : config.visiableMember) && member) {
          continue;
        }
        if (score != 0 && (score < (config == null ? void 0 : config.min) || score > (config == null ? void 0 : config.max))) {
          continue;
        }
        infos.push({ title, url, member, score, titleSlug: titleSlug2, "status": acMap[titleSlug2] });
      } catch (e) {
        console.log("error", e);
      }
    }
    let data = getRandomInfo(infos);
    if (data.url && isEnglish()) {
      data.url = data.url.replace(ZH_URL, EN_URL);
    }
    ElementPlus.ElMessage({
      dangerouslyUseHTMLString: !!(data && (data == null ? void 0 : data.url) && (data == null ? void 0 : data.title)),
      type: (data == null ? void 0 : data.url) && (data == null ? void 0 : data.title) ? "success" : "error",
      message: (data == null ? void 0 : data.url) && (data == null ? void 0 : data.title) ? `<div>随机题目☕：&nbsp;<a href="${data.url}" target="_blank" style="color:#5d99f2;">${data.title}</a> ${(data == null ? void 0 : data.score) && (data == null ? void 0 : data.score) > 0 ? `&nbsp;分值${data.score}` : ""}</div>` : `没有符合条件的题目，请重新配置条件!`,
      duration: 6e3
    });
  }
  function getDom() {
    for (let target of ["easy", "medium", "hard"]) {
      let t = document.querySelector(`.gap-1 .text-difficulty-${target}`);
      if (t) return t;
    }
    return void 0;
  }
  async function handlerScore() {
    let ok = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_score_"], true, String.name);
    ok = ok != "false" && ok != false;
    _GM_registerMenuCommand(`${ok ? "关闭" : "显示"} 题目分数 🍳`, function() {
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_score_"], !ok);
      window.location.reload();
    }, { title: "默认显示题目分数" });
    if (!ok) return;
    let url = window.location.href;
    if (!isProblem(url)) return;
    await sleep(1e3);
    let problemDom = getDom();
    if (!problemDom) return;
    let id = getId(url);
    let score = 0;
    let contestUrl = isEnglishENV() ? `https://leetcode.com/contest/` : `https://leetcode.cn/contest/`;
    let contestUrlFind = false;
    let curRating = null;
    try {
      let problemMap = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_score_tot_key"], true) ?? {};
      let problem = problemMap[id];
      if (!problem) {
        let p = await githubProblem(true);
        let new_temp = {};
        for (let obj of p[1]) {
          let k = obj[0];
          let v = obj[1];
          new_temp[k] = v;
        }
        problemMap = Object.assign({}, new_temp);
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_score_tot_key"], problemMap);
        if (isDev()) {
          console.log("save __0x3f_problme_score_tot_key : 😺");
        }
      }
      problem = problemMap[id];
      score = problem == null ? void 0 : problem.score;
      let rating = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_rating"], true) ?? {};
      if (!rating[id]) {
        let p = await getRating();
        let temp = {};
        for (let i = 0; Array.isArray(p) && i < p.length; i++) {
          temp[p[i]["TitleSlug"]] = p[i];
        }
        rating = Object.assign({}, temp);
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problme_rating"], rating);
        if (isDev()) {
          console.log("save __0x3f_problme_rating : 😺");
        }
      }
      if (rating[id]) {
        curRating = rating[id];
        contestUrlFind = true;
        contestUrl = contestUrl + rating[id]["ContestSlug"];
        if (!score) {
          score = Math.floor(rating[id]["Rating"]);
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (isDev()) {
      console.log("problemDom", problemDom);
      console.log("score", score);
    }
    if (score != void 0 && score != null && score > 0 && problemDom) {
      if (contestUrlFind) {
        problemDom.innerHTML = `<a href="${contestUrl}" target="_blank" title="${isEnglishENV() ? curRating.ContestID_en : curRating.ContestID_zh} ${curRating.ProblemIndex}">${score}</a>`;
      } else {
        problemDom.textContent = score;
      }
    }
  }
  const LANG_LIST = [
    "java",
    "cpp",
    "python",
    "python3",
    "go",
    "javascript",
    "js",
    "c",
    "C",
    "C++",
    "ts",
    "typescript",
    "TypeScript",
    "Rust",
    "rust",
    "Go",
    "php",
    "PHP",
    "C#",
    "Python3",
    "Java",
    "Swift",
    "swift",
    "Kotion",
    "kotion",
    "dart",
    "Dart",
    "Ruby",
    "ruby",
    "scala",
    "Scala",
    "Racket",
    "racket",
    "Erlang",
    "erlang",
    "Elixir",
    "elixir",
    "Cangjie",
    "cangjie"
  ];
  function showProblemSolve() {
    let url = window.location.href;
    if (!isProblem(url)) return;
    let t = document.querySelector("#qd-content .text-body.flex.flex-none.items-center");
    if (isDev()) {
      console.log("show", t.textContent);
    }
    if (!t) return;
    let c = getLocalProblemStatus();
    let id = getId(url);
    if ((c[id] == "null" || c[id] == null) && t.textContent == "已解答") {
      t.style.display = "none";
    } else {
      t.style.display = "inline-block";
    }
  }
  async function resetProblemStatus(url, click) {
    showProblemSolve();
    function deleteAcLocalStorage(title) {
      try {
        let No = title.match(/\d+/)[0];
        let keys = [];
        for (let lang of LANG_LIST) {
          keys.push(`${No}_0_${lang}`);
        }
        for (let key of keys) {
          window.localStorage.removeItem(key);
        }
      } catch (_) {
      }
    }
    async function fun(discuss_url, force = false) {
      var _a;
      let cache = getLocalProblemStatus();
      if (isLeetCodeCircleUrl()) {
        let problems_doms = loadProblems();
        for (let i = 0; i < problems_doms.length; i++) {
          let cur = problems_doms[i].parentElement;
          if (!(cur instanceof HTMLElement)) {
            continue;
          }
          const ID2 = getId((_a = problems_doms[i]) == null ? void 0 : _a.href);
          if (!ID2) continue;
          if (force) {
            delete cache[ID2];
          } else {
            cache[ID2] = "null";
            deleteAcLocalStorage(problems_doms[i].textContent);
          }
        }
      } else {
        let tot = await githubProblem();
        tot = tot[0];
        for (let p of tot) {
          if (p["problemUrl"].indexOf(discuss_url) == -1) continue;
          for (let info of p["problems"]) {
            if (!(info == null ? void 0 : info.titleSlug)) continue;
            let ID2 = titleSlug;
            if (force) {
              delete cache[ID2];
            } else {
              cache[ID2] = "null";
              deleteAcLocalStorage(info == null ? void 0 : info.title);
            }
          }
          break;
        }
      }
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], cache);
    }
    if (isLeetCodeCircleUrl()) {
      _GM_registerMenuCommand(`重置进度 ⏱`, () => {
        Message("确认重置进度?该操作不可恢复", async () => {
          await fun(window.location.href, false);
          window.location.reload();
        });
      }, { title: "如果需要重做题单，可以执行该操作" });
      let tag = document.querySelector(".flex .flex-wrap.gap-1 .no-underline");
      if (!tag) {
        await sleep(3e3);
        tag = document.querySelector(".flex .flex-wrap.gap-1 .no-underline");
      }
      if (tag) {
        let createTag = function() {
          let a = document.createElement("a");
          a.className = `no-underline truncate bg-sd-accent text-sd-muted-foreground hover:text-sd-foreground dark:hover:text-sd-foreground items-center rounded-full px-2 py-1 text-xs`;
          return a;
        };
        let p = tag.parentElement;
        let reset = createTag();
        reset.innerHTML = resetSVG(16);
        reset.style.cursor = "pointer";
        reset.title = "重置题单进度，如果需要多刷可以试试";
        reset.addEventListener("click", async (e) => {
          e.preventDefault();
          Message("确认重置进度?该操作不可恢复", async () => {
            await fun(window.location.href, false);
            window.location.reload();
          });
        });
        p.appendChild(reset);
        let update = createTag();
        update.innerHTML = updateSVG(16);
        update.title = "强制更新题单,该操作会将历史ac记录统计其中";
        update.style.cursor = "pointer";
        update.addEventListener("click", async (e) => {
          e.preventDefault();
          Message("确认强制更新进度？", async () => {
            await fun(window.location.href, true);
            window.location.reload();
          });
        });
        p.appendChild(update);
      }
      let dom = document.querySelector(".break-words");
      if (dom) {
        let get = function(index, runClear) {
          var _a;
          if (index + 1 >= titles.length) return;
          let curCache = getLocalProblemStatus();
          const currentH2 = titles[index];
          const nextH2 = titles[index + 1];
          const aLinks = [];
          let nextSibling = currentH2.nextElementSibling;
          while (nextSibling && nextSibling !== nextH2) {
            if (nextSibling.tagName === "A") {
              if (isProblem(nextSibling.href)) {
                aLinks.push(nextSibling);
              }
            } else {
              for (let a of Array.from(nextSibling.querySelectorAll("a") ?? { length: 0 })) {
                if (a && isProblem(a.href)) {
                  aLinks.push(a);
                }
              }
            }
            nextSibling = nextSibling.nextElementSibling;
          }
          if (aLinks.length > 0 && runClear) {
            for (let i = 0; i < aLinks.length; i++) {
              const ID2 = getId((_a = aLinks[i]) == null ? void 0 : _a.href);
              if (!ID2) continue;
              curCache[ID2] = "null";
              createStatus("null", aLinks[i], true);
              deleteAcLocalStorage(aLinks[i].textContent);
            }
            Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], curCache);
          }
          return aLinks;
        };
        let titles = Array.from(dom.querySelectorAll("h2"));
        let uls = Array.from(dom.querySelectorAll("ul"));
        if (isDev()) {
          console.log("titles", titles.length, "uls", uls.length);
        }
        for (let i = 0; i < titles.length - 1; i++) {
          let aLinks = get(i, false);
          if (aLinks.length != 0) {
            const span = document.createElement("span");
            span.style.cursor = "pointer";
            span.style.marginLeft = "20px";
            span.title = `重刷《${titles[i].textContent}》章节 `;
            span.addEventListener("click", () => {
              Message(`确认${span.title}进度?该操作不可恢复`, () => {
                get(i, true);
              });
            });
            span.innerHTML = resetSVG(17);
            titles[i].appendChild(span);
          }
        }
      }
    }
    if (click) {
      await fun(url, false);
    }
  }
  async function GetHubJSONInfo(url) {
    return fetch(url, {
      method: "get",
      mode: "cors"
    }).then((res) => res.json());
  }
  async function getProblemsJSON() {
    return GetHubJSONInfo("https://raw.githubusercontent.com/wuxin0011/tampermonkey-script/main/0x3f-leetcode/new_0x3f.json");
  }
  async function getRating() {
    return GetHubJSONInfo("https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/main/data.json");
  }
  const LEETCODE_PROBLEM_API = `${CUR_URL}/graphql/`;
  async function PostLeetCodeApi(data) {
    return fetch(LEETCODE_PROBLEM_API, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then((res) => res.json());
  }
  async function getProblemAcInfo(titleSlug2) {
    return PostLeetCodeApi(postData(titleSlug2));
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {};
  const _withScopeId = (n) => (vue.pushScopeId("data-v-6b5a9c54"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = /* @__PURE__ */ vue.createStaticVNode('<h2 data-v-6b5a9c54> 🎈必读内容 </h2><ul data-v-6b5a9c54><li style="color:red !important;" data-v-6b5a9c54> 同步功能使用前请确保为登录状态 </li></ul><h2 data-v-6b5a9c54> ❓ 题单进度不一致 </h2><ul data-v-6b5a9c54><li data-v-6b5a9c54> 防止一次性访问题单太多，对服务器产生压力，所以采用单个题单访问然后保存状态 , 这样避免访问量问题 </li><li data-v-6b5a9c54> 默认情况下会缓存访问的题单情况，对于没有访问的题单，可以手动在对应题单中同步 </li><li data-v-6b5a9c54> 题目状态根据用户提交题目情况会实时更新，只会在提交访问一次 </li></ul><h2 data-v-6b5a9c54> ❓ 如何使用随机题目？ </h2><ul data-v-6b5a9c54><li data-v-6b5a9c54> 这个可以根据自己要求，配置好之后，可以使用 <em data-v-6b5a9c54> ctrl + alt + j </em> 触发 </li><li data-v-6b5a9c54> 如果这个快捷键影响，可以在命令设置中关闭 </li></ul><h2 data-v-6b5a9c54> ❓ 如何使用美服 </h2>', 7);
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("h2", null, " 🔗 反馈更新 ", -1));
  function _sfc_render(_ctx, _cache) {
    const _component_el_link = vue.resolveComponent("el-link");
    return vue.openBlock(), vue.createElementBlock("div", null, [
      _hoisted_1$1,
      vue.createElementVNode("ul", null, [
        vue.createElementVNode("li", null, [
          vue.createTextVNode(" 处于网络安全策略，对于不同网站请求有 "),
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS",
            type: "primary",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("跨域机制保护")
            ]),
            _: 1
          }),
          vue.createTextVNode(" 美服和国服是两个不同网站，因此无法实现不同网站题单同步 。 ")
        ]),
        vue.createElementVNode("li", null, [
          vue.createTextVNode(" 如果想使用美服，请复制一份题单到美服中 "),
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://greasyfork.org//zh-CN/scripts/491969-lc-to-markdown-txt-html",
            type: "primary",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("lc-to-markdown-txt-html")
            ]),
            _: 1
          }),
          vue.createTextVNode(" 这个插件来复制题单 ")
        ]),
        vue.createElementVNode("li", null, [
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://leetcode.com/discuss/interview-question/6032972/leetcode",
            type: "primary",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("美服题单演示")
            ]),
            _: 1
          })
        ])
      ]),
      _hoisted_8,
      vue.createElementVNode("ul", null, [
        vue.createElementVNode("li", null, [
          vue.createTextVNode(" 你可以在 "),
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://greasyfork.org//zh-CN/scripts/501134-0x3f-problem-solution/feedback",
            type: "success",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("油猴")
            ]),
            _: 1
          }),
          vue.createTextVNode("   "),
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://scriptcat.org/zh-CN/script-show-page/1967",
            type: "success",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("脚本猫")
            ]),
            _: 1
          }),
          vue.createTextVNode(" 中更新或下载 ")
        ]),
        vue.createElementVNode("li", null, [
          vue.createVNode(_component_el_link, {
            underline: false,
            href: "https://greasyfork.org//zh-CN/scripts/501134-0x3f-problem-solution/feedback",
            type: "primary",
            target: "_blank"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("点击")
            ]),
            _: 1
          }),
          vue.createTextVNode("这里反馈 或者 "),
          vue.createVNode(_component_el_link, {
            target: "_blank",
            underline: false,
            href: "https://github.com/wuxin0011/tampermonkey-script/issues",
            type: "primary"
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("issues")
            ]),
            _: 1
          })
        ])
      ])
    ]);
  }
  const Q1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-6b5a9c54"]]);
  const _hoisted_1 = { class: "dialog-footer" };
  const _hoisted_2 = { class: "processs-flex" };
  const _hoisted_3 = { style: { "text-align": "center", "color": "#121212" } };
  const TARGET_URL = "https://leetcode.cn/u/endlesscheng/";
  const formLabelWidth = "44px";
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const fromData = vue.reactive(initObj());
      const tableButtonSize = vue.ref("default");
      let tableData = vue.reactive(initUrls());
      const keywords = vue.ref("");
      const dialogTableVisible = vue.ref(false);
      const showAddLocalButton = vue.computed(() => isLeetCodeCircleUrl());
      let urlsData = vue.computed(() => {
        let map = /* @__PURE__ */ new Map();
        let infos = tableData.filter((info2) => {
          if ((info2 == null ? void 0 : info2.title) && (info2 == null ? void 0 : info2.link) && !map.has(info2.link)) {
            map.set(info2.link, info2);
            return info2 && (info2.title && info2.title.indexOf(keywords.value) != -1 || info2.link && info2.link.indexOf(keywords.value) != -1);
          } else {
            return false;
          }
        });
        let tot = 0, ac = 0;
        for (let i = 0, c = info.length; i < infos.length; i++) {
          let info2 = infos[i];
          if (info2["ac"] && info2["tot"]) {
            tot += info2["tot"];
            ac += info2["ac"];
          }
          if (!info2["id"]) {
            info2["id"] = c + 1;
            c++;
          }
        }
        let type = isNaN(fromData.sortType) ? 0 : fromData.sortType;
        if (type == 0) {
          infos.sort((info1, info2) => info2.id - info1.id);
        } else if (type == 1) {
          infos.sort((info1, info2) => info2.tot - info1.tot);
        } else if (type == 2) {
          infos.sort((info1, info2) => info2.ac - info1.ac);
        } else if (type == 3) {
          infos.sort((info1, info2) => computeProcess(info2.ac, info2.tot) - computeProcess(info1.ac, info1.tot));
        }
        infos.unshift({ "title": "灵茶题单完成情况", "link": TARGET_URL, "tot": tot, "ac": ac, "id": 67108863, "version": 1 });
        return infos;
      });
      const rowIsDisabled = vue.computed(() => (info2) => asyncButtonLoad.value || info2 && info2.link == TARGET_URL);
      const isDisabbled = vue.computed(() => !!tableData.find((v) => (v == null ? void 0 : v.link) && (v == null ? void 0 : v.link.indexOf(window.location.href)) != -1));
      const dialogFormVisible = vue.ref(false);
      const computeProcess = (ac = 0, tot = 0) => {
        if (isNaN(ac) || isNaN(tot) || tot === 0) return 0;
        let p = 0;
        if (tot == ac) {
          return 100;
        }
        const s = String(ac / tot);
        try {
          let x1 = s.split(".")[1] || "";
          x1 = x1.padEnd(3, "0").substring(0, 3);
          p = Math.min(100, Number(x1) / 10);
        } catch (e) {
          console.log("calc error", e.message, s == void 0, ac, tot);
          p = (ac / tot).toFixed(3) * 100;
        }
        return isNaN(p) ? 0 : p;
      };
      const processColors = [
        { color: "#f56c6c", percentage: 20 },
        { color: "#1989fa", percentage: 40 },
        { color: "#e6a23c", percentage: 60 },
        { color: "#6f7ad3", percentage: 80 },
        { color: "#67c23a", percentage: 100 }
      ];
      vue.watch(fromData, () => {
        handlerProblem(vue.toRaw(Object.assign({}, fromData)));
      });
      const info = vue.reactive({
        title: "",
        link: "",
        status: "add"
      });
      const addlocal = async () => {
        if (!isDisabbled) {
          return;
        }
        let [cur, tot] = await getProcess();
        tableData.unshift({ title: document.title, link: window.location.href, "ac": cur, "tot": tot, "id": tableData.length + 10 });
      };
      const updateIndex = vue.ref(-1);
      const handlerProblems = (status, updateInfo = { title: "", link: "", id: 0 }, index = -1) => {
        dialogFormVisible.value = true;
        info.status = status;
        updateIndex.value = updateInfo.id;
        Object.assign(info, updateInfo);
      };
      const handlerMessage = (u, title, link) => {
        const a = u ? "添加" : "修改";
        const error = !(!!title && isHttp(link));
        if (error) {
          ElementPlus.ElMessage.error(`${a} 失败 请保证标题或者链接有效 `);
        } else {
          ElementPlus.ElMessage.success(`${a} 成功 `);
        }
        return !error;
      };
      const addOrUpdate = () => {
        if (!handlerMessage(info.status == "add", info.title, info.link)) {
          return;
        }
        if (info.status == "add") {
          tableData.unshift({ title: info.title, link: info.link, "ac": 0, "tot": 0, "id": tableData.length + 10 });
        } else {
          let id = updateIndex.value;
          for (let i = 0; i < tableData.length; i++) {
            if (tableData[i] && tableData[i].id && tableData[i]["id"] == id) {
              tableData[i]["title"] = info.title;
              tableData[i]["link"] = info.link;
              break;
            }
          }
        }
        dialogFormVisible.value = false;
      };
      const deleteProblems = (id) => {
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i] && tableData[i].id && tableData[i]["id"] == id) {
            delete tableData[i];
            break;
          }
        }
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], vue.toRaw(tableData));
      };
      const handlerDefault = () => {
        Message("确认使用默认题单，将会重置题单", () => {
          for (let i = 0; i < tableData.length; i++) {
            delete tableData[i];
          }
          let infos = computeAcInfo(defaultUrls);
          for (let item of infos) {
            tableData.unshift(item);
          }
          ElementPlus.ElMessage({
            type: "success",
            message: "重置成功"
          });
        });
      };
      window.addEventListener("beforeunload", () => {
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], vue.toRaw(tableData).filter((u) => u != null && u != void 0));
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_update__"], true);
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_add_cur__"], false);
      });
      vue.onMounted(async () => {
        if (support_plugins()) {
          let times = 30;
          let loadTimeId = setInterval(() => {
            let a = queryProblem();
            times--;
            if (Array.isArray(a) && a.length > 0) {
              handlerProblem(vue.toRaw(Object.assign({}, fromData)));
              addProcess();
              window.clearInterval(loadTimeId);
            }
            if (times == 0) {
              window.clearInterval(loadTimeId);
            }
          }, 200);
        }
        window.addEventListener("storage", (e) => {
          watchLinkStatusUpdate(e);
        });
      });
      _GM_registerMenuCommand(`题单配置信息🛠`, () => {
        dialogTableVisible.value = !dialogTableVisible.value;
      }, { title: "AC标记安装位置，默认左侧，刷新生效" });
      const selectHandlerChange = (row) => {
        let infos = [];
        for (let i = 0; i < urlsData.value.length; i++) {
          if (urlsData.value[i]["link"] == TARGET_URL) continue;
          infos.push(vue.toRaw(Object.assign({}, urlsData.value[i])));
        }
        for (let i = 0; i < tableData.length; i++) {
          if (row.id == tableData[i].id) {
            tableData[i].select = row.select;
            break;
          }
        }
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], infos);
      };
      const asyncButtonLoad = vue.ref(false);
      const asyncButtonLoadBreak = vue.ref(false);
      const showProcess = vue.ref(false);
      const allProblemNum = vue.ref(0);
      const asyncProblemNum = vue.ref(0);
      const asyncVisableDialog = vue.ref(false);
      const showProblemsProcessInfo = vue.reactive({
        title: "",
        link: "",
        cnt: "",
        ac: "",
        id: "",
        select: true
      });
      const showProblemsInfo = (info2 = {}) => {
        asyncVisableDialog.value = !asyncVisableDialog.value;
        Object.assign(showProblemsProcessInfo, info2);
      };
      const loadProcess = vue.computed(() => computeProcess(asyncProblemNum.value, allProblemNum.value));
      const asyncProblemStatus = async (row = {}) => {
        if (!(row == null ? void 0 : row.link)) return;
        let callback = async () => {
          var _a, _b, _c, _d, _e;
          let rowData = void 0;
          let asyncAll = (row == null ? void 0 : row.link) == TARGET_URL;
          let cache = Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], true, Object.name);
          if (isDev()) {
            console.log("async ac cache:", cache);
          }
          let map = /* @__PURE__ */ new Map();
          try {
            for (let info2 of tableData) {
              if ((info2 == null ? void 0 : info2.link) && (info2 == null ? void 0 : info2.title) && (info2 == null ? void 0 : info2.id)) {
                if (rowData == void 0 && (info2 == null ? void 0 : info2.id) == row.id) {
                  rowData = info2;
                }
                if (!map.has(info2.link)) {
                  map.set(info2.link, info2);
                }
              }
            }
            if (rowData) {
              rowData.loading = true;
            }
            asyncButtonLoad.value = true;
            asyncButtonLoadBreak.value = false;
            allProblemNum.value = 0;
            asyncProblemNum.value = 0;
            showProcess.value = true;
            await sleep(500);
            let githubInfo = await githubProblem(fromData.visiableMember);
            let jsonInfo = githubInfo[2];
            if (isDev()) {
              console.log("githubInfo", githubInfo);
            }
            let datas = [];
            for (let i = 0; Array.isArray(jsonInfo) && i < jsonInfo.length; i++) {
              let key = `${(_a = jsonInfo[i]) == null ? void 0 : _a.problemUrl}`;
              let origin = map.get(key);
              if (!origin) {
                continue;
              }
              if (asyncAll) {
                for (let p of jsonInfo[i].problems) {
                  datas.push(Object.assign({ "origin": jsonInfo[i].problemUrl }, p));
                }
                origin.tot = Math.max(jsonInfo[i].problems.length, 0);
                origin.ac = 0;
              } else if (jsonInfo[i].problemUrl == row.link) {
                for (let p of jsonInfo[i].problems) {
                  datas.push(Object.assign({ "origin": jsonInfo[i].problemUrl }, p));
                }
                origin.tot = Math.max(jsonInfo[i].problems.length, 0);
                origin.ac = 0;
                break;
              }
            }
            if (Array.isArray(datas) && datas.length > 0) {
              allProblemNum.value = datas.length;
              asyncProblemNum.value = 0;
              let pre = 0;
              for (let i = 0; i < datas.length; i++) {
                let info2 = datas[i];
                try {
                  if (asyncButtonLoadBreak.value) {
                    break;
                  }
                  await sleep(20);
                  let ID2 = info2.titleSlug;
                  let key = `${info2.origin}`;
                  let origin = map.get(key);
                  if (cache[ID2] != "ac") {
                    let response = await getProblemAcInfo(ID2);
                    const status = (_c = (_b = response == null ? void 0 : response.data) == null ? void 0 : _b.question) == null ? void 0 : _c.status;
                    cache[ID2] = status == null ? "null" : status;
                  }
                  if (origin) {
                    if (cache[ID2] == "ac") {
                      origin.ac = origin.ac + 1;
                    }
                  }
                  asyncProblemNum.value += 1;
                  if (loadProcess.value < pre && isDev()) {
                    console.warn("calc result is error");
                  }
                  pre = loadProcess.value;
                } catch (e) {
                  if (isDev()) {
                    console.log("process error", e.message, "asyncProblemNum.value", asyncProblemNum.value, "all", allProblemNum.value);
                  }
                }
                if (i % 100 == 0) {
                  Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], Object.assign({}, cache));
                }
              }
            }
          } catch (e) {
            console.log("error", e);
          } finally {
            if (rowData) {
              rowData.loading = false;
            }
            asyncButtonLoad.value = false;
            Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], vue.toRaw(tableData));
            Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_ac_key__"], Object.assign({}, cache));
            if (isDev()) {
              console.log("同步完成🥰", asyncProblemNum.value, allProblemNum.value, loadProcess.value);
            }
            await sleep(500);
            ElementPlus.ElMessage({
              type: allProblemNum.value == asyncProblemNum.value ? "success" : asyncButtonLoadBreak.value ? "error" : "warning",
              message: allProblemNum.value == asyncProblemNum.value ? `同步完成🥰` : asyncButtonLoadBreak.value ? `同步中断 ${loadProcess.value}% ` : `同步率 ${loadProcess.value}% `,
              duration: 3e3
            });
            await sleep(6e3);
            allProblemNum.value = 0;
            asyncProblemNum.value = 0;
            showProcess.value = false;
            asyncButtonLoadBreak.value = false;
            for (let i = 0; i < tableData.length; i++) {
              if (getAcCountKey((_d = tableData[i]) == null ? void 0 : _d.link)) {
                Cache$2.set(getAcCountKey(tableData[i].link), { "tot": tableData[i].tot, "ac": tableData[i].ac });
              }
              if ((_e = tableData[i]) == null ? void 0 : _e.loading) {
                tableData[i].loading = false;
              }
            }
          }
        };
        if (row.link == TARGET_URL) {
          Message("该操作将同步所有题单，耗时可能较长 确认操作?", callback);
        } else {
          callback();
        }
      };
      const q1 = vue.ref(false);
      vue.ref(false);
      return (_ctx, _cache) => {
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_progress = vue.resolveComponent("el-progress");
        const _component_el_col = vue.resolveComponent("el-col");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_tooltip = vue.resolveComponent("el-tooltip");
        const _component_el_row = vue.resolveComponent("el-row");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_table = vue.resolveComponent("el-table");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_dialog, {
            modelValue: q1.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => q1.value = $event)
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(Q1)
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogFormVisible.value,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => dialogFormVisible.value = $event),
            title: `${info.status == "add" ? "添加" : "编辑"}`,
            width: "700"
          }, {
            footer: vue.withCtx(() => [
              vue.createElementVNode("div", _hoisted_1, [
                vue.createVNode(_component_el_button, {
                  onClick: _cache[3] || (_cache[3] = ($event) => dialogFormVisible.value = false)
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("取消")
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_button, { onClick: addOrUpdate }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(" 确认 ")
                  ]),
                  _: 1
                })
              ])
            ]),
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form, null, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_form_item, {
                    label: "标题",
                    "label-width": formLabelWidth
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: info.title,
                        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => info.title = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, {
                    label: "链接",
                    "label-width": formLabelWidth
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: info.link,
                        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => info.link = $event),
                        autocomplete: "off"
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue", "title"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogTableVisible.value,
            "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => dialogTableVisible.value = $event),
            title: asyncButtonLoadBreak.value ? `同步已中断 ${asyncProblemNum.value}/${allProblemNum.value}` : showProcess.value ? loadProcess.value < 100 ? `同步中...${asyncProblemNum.value}/${allProblemNum.value}` : "统计完成" : "题单信息",
            width: "60%"
          }, {
            default: vue.withCtx(() => [
              showProcess.value ? (vue.openBlock(), vue.createBlock(_component_el_progress, {
                key: 0,
                color: processColors,
                percentage: loadProcess.value,
                "stroke-width": 15,
                striped: "",
                "striped-flow": "",
                style: { "margin-bottom": "20px" },
                status: `${loadProcess.value == 100 ? "success" : ""}`
              }, null, 8, ["percentage", "status"])) : vue.createCommentVNode("", true),
              vue.createVNode(_component_el_row, { gutter: 10 }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, { span: 4 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_input, {
                        modelValue: keywords.value,
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => keywords.value = $event),
                        placeholder: "请输入关键词过滤",
                        clearable: ""
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, { span: 20 }, {
                    default: vue.withCtx(() => [
                      showAddLocalButton.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                        key: 0,
                        plain: "",
                        onClick: addlocal,
                        disabled: isDisabbled.value,
                        size: tableButtonSize.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 添加本页 ")
                        ]),
                        _: 1
                      }, 8, ["disabled", "size"])) : vue.createCommentVNode("", true),
                      showAddLocalButton.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                        key: 1,
                        plain: "",
                        onClick: _cache[6] || (_cache[6] = ($event) => handlerProblems("add")),
                        size: tableButtonSize.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 自定义 ")
                        ]),
                        _: 1
                      }, 8, ["size"])) : vue.createCommentVNode("", true),
                      vue.createVNode(_component_el_select, {
                        modelValue: fromData.sortType,
                        "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => fromData.sortType = $event),
                        style: { "margin": "0 5px", "width": "100px" },
                        disabled: asyncButtonLoad.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_option, {
                            label: "默认排序",
                            value: 0
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("默认排序")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "题目数量",
                            value: 1
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("题目数量")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "AC数量",
                            value: 2
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("AC数量")
                            ]),
                            _: 1
                          }),
                          vue.createVNode(_component_el_option, {
                            label: "完成度",
                            value: 3
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("完成度")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["modelValue", "disabled"]),
                      vue.createVNode(_component_el_tooltip, { content: "同步所有题单" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            type: asyncButtonLoad.value ? "success" : "danger",
                            onClick: _cache[8] || (_cache[8] = ($event) => asyncProblemStatus({ "link": "https://leetcode.cn/u/endlesscheng/" })),
                            size: tableButtonSize.value,
                            loading: asyncButtonLoad.value
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(vue.toDisplayString(asyncButtonLoad.value ? "同步中" : "同步题单"), 1)
                            ]),
                            _: 1
                          }, 8, ["type", "size", "loading"])
                        ]),
                        _: 1
                      }),
                      asyncButtonLoad.value ? (vue.openBlock(), vue.createBlock(_component_el_tooltip, {
                        key: 2,
                        content: "点击中断同步"
                      }, {
                        default: vue.withCtx(() => [
                          asyncButtonLoad.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                            key: 0,
                            type: "warning",
                            text: "",
                            onClick: _cache[9] || (_cache[9] = ($event) => asyncButtonLoadBreak.value = !asyncButtonLoadBreak.value),
                            size: tableButtonSize.value
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 中断同步 ")
                            ]),
                            _: 1
                          }, 8, ["size"])) : vue.createCommentVNode("", true)
                        ]),
                        _: 1
                      })) : vue.createCommentVNode("", true),
                      vue.createVNode(_component_el_tooltip, { content: "随机一道灵茶题单中题目,快捷键 Ctrl + Alt + J 可以触发" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            type: "primary",
                            text: "",
                            onClick: vue.unref(randomProblem),
                            size: tableButtonSize.value
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 随机题目 ")
                            ]),
                            _: 1
                          }, 8, ["onClick", "size"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table, {
                data: vue.unref(urlsData),
                height: "300",
                style: { "width": "100%", "margin-top": "10px" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, { type: "index" }),
                  vue.createVNode(_component_el_table_column, {
                    label: "标题",
                    width: "auto",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_link, {
                        href: scope.row.link,
                        target: "_blank",
                        type: "default"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(scope.row.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["href"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "随机",
                    width: "70",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_switch, {
                        modelValue: scope.row.select,
                        "onUpdate:modelValue": ($event) => scope.row.select = $event,
                        onChange: ($event) => selectHandlerChange(scope.row),
                        disabled: rowIsDisabled.value(scope.row),
                        size: "small"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange", "disabled"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "AC",
                    width: "70",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_link, {
                        type: "success",
                        underline: false,
                        onClick: ($event) => showProblemsInfo(scope.row)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(isNaN(scope.row.ac) ? 0 : scope.row.ac), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "Total",
                    width: "70",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_link, {
                        type: "primary",
                        underline: false,
                        onClick: ($event) => showProblemsInfo(scope.row)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(isNaN(scope.row.tot) ? 0 : scope.row.tot), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "进度",
                    width: "70",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_link, {
                        onClick: ($event) => showProblemsInfo(scope.row),
                        type: "warning",
                        underline: false
                      }, {
                        default: vue.withCtx(() => {
                          var _a, _b, _c;
                          return [
                            vue.createTextVNode(vue.toDisplayString(((_a = scope == null ? void 0 : scope.row) == null ? void 0 : _a.tot) == 0 ? 0 : `${computeProcess((_b = scope == null ? void 0 : scope.row) == null ? void 0 : _b.ac, (_c = scope == null ? void 0 : scope.row) == null ? void 0 : _c.tot)}%`), 1)
                          ];
                        }),
                        _: 2
                      }, 1032, ["onClick"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    label: "操作",
                    width: "200px",
                    align: "center"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_button, {
                        loading: scope.row.loading,
                        onClick: ($event) => asyncProblemStatus(scope.row),
                        size: "small",
                        type: "success",
                        disabled: rowIsDisabled.value(scope.row),
                        link: ""
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(scope.row.loading ? "" : "同步"), 1)
                        ]),
                        _: 2
                      }, 1032, ["loading", "onClick", "disabled"]),
                      vue.createVNode(_component_el_button, {
                        onClick: ($event) => handlerProblems("update", scope.row, scope.$index),
                        size: "small",
                        type: "primary",
                        disabled: rowIsDisabled.value(scope.row),
                        link: ""
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("编辑")
                        ]),
                        _: 2
                      }, 1032, ["onClick", "disabled"]),
                      vue.createVNode(_component_el_button, {
                        onClick: ($event) => deleteProblems(scope.row.id),
                        size: "small",
                        type: "danger",
                        link: "",
                        disabled: rowIsDisabled.value(scope.row)
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode("删除")
                        ]),
                        _: 2
                      }, 1032, ["onClick", "disabled"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["data"]),
              vue.createVNode(_component_el_row, {
                gutter: 10,
                style: { "margin": "10px 0" }
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_col, { span: 10 }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(" 会员  "),
                      vue.createVNode(_component_el_tooltip, { content: "过滤会员题目，会员题不会出现在随机题目中和讨论区显示。另外会员题目将不参与进度统计，默认显示" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_switch, {
                            modelValue: fromData.visiableMember,
                            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => fromData.visiableMember = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      }),
                      showAddLocalButton.value ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        vue.createTextVNode(" 隐藏AC  "),
                        vue.createVNode(_component_el_tooltip, { content: "是否在讨论区显示AC题目，默认显示 " }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_el_switch, {
                              modelValue: fromData.hiddenAc,
                              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => fromData.hiddenAc = $event)
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                        })
                      ], 64)) : vue.createCommentVNode("", true),
                      vue.createTextVNode(" 随机ac  "),
                      vue.createVNode(_component_el_tooltip, { content: "随机题目配置: 过滤AC的题目,AC题目出现在随机题目中，默认不过滤" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_switch, {
                            modelValue: fromData.showAcConfig,
                            "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => fromData.showAcConfig = $event)
                          }, null, 8, ["modelValue"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, { span: 8 }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("   "),
                      vue.createVNode(_component_el_tooltip, { content: "随机题目和讨论区题目将会在这个区间（没有分数题目无法操作）" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_link, {
                            underline: false,
                            type: "primary"
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("分数区间")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      vue.createTextVNode("   "),
                      vue.createVNode(_component_el_input, {
                        modelValue: fromData.min,
                        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => fromData.min = $event),
                        "aria-placeholder": "",
                        placeholder: " min  ",
                        style: { "width": "60px" }
                      }, null, 8, ["modelValue"]),
                      vue.createTextVNode("- "),
                      vue.createVNode(_component_el_input, {
                        modelValue: fromData.max,
                        "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => fromData.max = $event),
                        "aria-placeholder": "",
                        placeholder: " max",
                        style: { "width": "60px" }
                      }, null, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_col, { span: 6 }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_tooltip, { content: "重置题单" }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_button, {
                            plain: "",
                            onClick: handlerDefault,
                            size: tableButtonSize.value,
                            disabled: showProcess.value
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 重置 ")
                            ]),
                            _: 1
                          }, 8, ["size", "disabled"])
                        ]),
                        _: 1
                      }),
                      vue.createVNode(_component_el_button, {
                        plain: "",
                        onClick: _cache[15] || (_cache[15] = ($event) => q1.value = !q1.value),
                        size: tableButtonSize.value
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(" 使用说明 ")
                        ]),
                        _: 1
                      }, 8, ["size"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue", "title"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: asyncVisableDialog.value,
            "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => asyncVisableDialog.value = $event),
            width: "35%"
          }, {
            default: vue.withCtx(() => [
              vue.createElementVNode("p", null, [
                vue.createVNode(_component_el_link, {
                  href: showProblemsProcessInfo.link,
                  type: "info",
                  underline: false
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode(vue.toDisplayString(showProblemsProcessInfo.title), 1)
                  ]),
                  _: 1
                }, 8, ["href"])
              ]),
              vue.createElementVNode("div", _hoisted_2, [
                vue.createVNode(_component_el_progress, {
                  type: "circle",
                  percentage: computeProcess(showProblemsProcessInfo.ac, showProblemsProcessInfo.tot),
                  color: processColors
                }, {
                  default: vue.withCtx(({ percentage }) => [
                    vue.createElementVNode("p", null, vue.toDisplayString(percentage) + "%", 1)
                  ]),
                  _: 1
                }, 8, ["percentage"])
              ]),
              vue.createElementVNode("p", _hoisted_3, vue.toDisplayString(showProblemsProcessInfo.ac) + " / " + vue.toDisplayString(showProblemsProcessInfo.tot), 1)
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3d821394"]]);
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("elementPlusCss");
  const stopRankingKey = "__is_stop_rating_ranking__";
  let conetstTimeId = null;
  function run$1() {
    const container = document.querySelector(".contest-question-info .list-group");
    if (!container) return;
    const ls = Array.from(container.querySelectorAll(".list-group-item .pull-right"));
    for (let i = 0; i < 4; i++) {
      if (i >= ls.length) {
        break;
      }
      if (ls[i] instanceof HTMLElement) {
        ls[i].textContent = "0";
      }
    }
    window.clearInterval(conetstTimeId);
  }
  function startStopRanking() {
    if (!isContest(window.location.href)) {
      return;
    }
    const isNext = !!document.querySelector("#__next");
    if (isNext) {
      return;
    }
    const use = Cache$2.get(stopRankingKey);
    if (use) {
      conetstTimeId = setInterval(() => {
        run$1();
      }, 10);
    }
    _GM_registerMenuCommand(`${use ? "使用" : "关闭"} 排行榜`, () => {
      Cache$2.set(stopRankingKey, !use);
      window.location.reload();
    }, { title: "对于不想看到排行榜的可以使用此功能 默认开启" });
  }
  const local_url$1 = window.location.href;
  let loadID = 0;
  let submitCnt = 0;
  let submitbutton = null;
  function watchDom(dom) {
    if (!(dom instanceof HTMLElement)) {
      return;
    }
    let m = new MutationObserver(() => {
      if (submitCnt % 2 == 1) {
        submitProblems(local_url$1);
      }
      submitCnt++;
    });
    m.observe(dom, {
      childList: true,
      attributes: true
    });
  }
  function handler() {
    loadID++;
    let findSubmitButton = function(sel) {
      if (!sel) return null;
      return Array.from(document.querySelectorAll(sel && { length: 0 })).find((e) => {
        return e && e.innerText == "提交解答" || e.innerText == "提交";
      });
    };
    const isNext = !!document.querySelector("#__next");
    submitbutton = findSubmitButton(isProblem(local_url$1) || isNext ? "" : ".question-detail-bottom  .pull-right button");
    if (!submitbutton) {
      submitbutton = document.querySelector('[data-e2e-locator="console-submit-button"]');
    }
    if (submitbutton) {
      watchDom(submitbutton);
      submitbutton.addEventListener("click", () => {
        submitProblems(local_url$1, 10 * 1e3);
      });
    } else if (loadID < 10) {
      setTimeout(() => {
        handlerNotFound();
      }, 3e3);
    }
  }
  function watchSubmit() {
    if (!isProblem()) {
      return;
    }
    try {
      if ((window == null ? void 0 : window.fetch) && (window == null ? void 0 : window.unsafeWindow)) {
        let originalFetch = window == null ? void 0 : window.fetch;
        window.unsafeWindow.fetch = function() {
          return originalFetch.apply(this, arguments).then(function(response) {
            let res = response.clone();
            res.text().then(function(bodyText) {
              let url = res.url;
              if (isDev()) {
                console.log("query result", bodyText);
              }
              if (!/https:\/\/leetcode\.(cn|com)\/submissions\/detail\/\d+\/check\/.*/.test(url)) {
                return;
              }
              if (res.status == 200 && res.ok) {
                let result = JSON.parse(bodyText);
                const ID2 = getId(local_url$1);
                const status = (result == null ? void 0 : result.status_msg) == "Accepted" ? "ac" : (result == null ? void 0 : result.status_msg) == "Wrong Answer" ? "notac" : "null";
                watchSaveStatus(ID2, status);
              }
              const cache = Cache.get(__0X3F_PROBLEM_KEYS__["__0x3f_problmes_ac_key__"], true, Object.name);
              if (cache[ID] == "null" || cache[ID] == null || cache[Id] == void 0) {
                submitProblems(local_url$1);
              }
            });
            return response;
          });
        };
      } else {
        console.warn("浏览器当前环境不支持 unsafeWindow 将做兼容处理  ");
        handler();
      }
    } catch (e) {
      console.error(e);
    }
  }
  const local_url = window.location.href;
  const randomProblemKey = () => Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_random_problems_key__"]) == void 0 ? true : Cache$2.get(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_random_problems_key__"]);
  let Container = null;
  if (isProblem() || isLeetCodeCircleUrl() || isHome()) {
    if (isDev()) {
      console.log("isHome================>");
    }
    const start = () => {
      Container = document.createElement("div");
      const body = document.querySelector("body");
      body.append(Container);
      Container.style.display = "block";
      return Container;
    };
    let dom = start();
    const VueApp = vue.createApp(App);
    VueApp.use(ElementPlus).mount(dom);
  }
  if (isProblem() || isLeetCodeCircleUrl() || isHome()) {
    _GM_registerMenuCommand(`随机一道题 ☕`, randomProblem, { title: "随机一道题目，你可以通过ctrl+atl+j显示一道题目" });
    _GM_registerMenuCommand(`${randomProblemKey() ? "关闭" : "启用"} 随机题目快捷键 ☕`, () => {
      Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_random_problems_key__"], !randomProblemKey());
      window.location.reload();
    }, { title: "该功能是随机一道题的快捷键，你可以通过ctrl+atl+j显示一道题目" });
    if (isLeetCodeCircleUrl()) {
      installEnglishLinkChangeCommand();
    }
    if (randomProblemKey()) {
      document.addEventListener("keydown", async function(event) {
        if (event.ctrlKey && event.altKey && event.key === "j") {
          randomProblem();
        }
      });
    }
  }
  async function run() {
    if (isProblem(local_url)) {
      await sleep(3e3);
    } else if (isLeetCodeCircleUrl(local_url)) {
      stop_disscuss_command();
      _GM_registerMenuCommand(`安装到${install_pos() ? "右侧" : "左侧"} 🎁`, () => {
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_insert_pos__"], install_pos());
        window.location.reload();
      }, { title: "AC标记安装位置，默认左侧，刷新生效" });
      _GM_registerMenuCommand(`同步题目状态 🚀`, () => {
        Message("确认同步题目状态", async () => {
          await addProcess(true, void 0, true);
        });
      }, { title: "如果不在同一个浏览器答题，会出现ac题目状态没有及时同步，可以使用此功能" });
      _GM_registerMenuCommand(`${initObj().onlyUrls ? "仅在收藏题单页面生效" : "所有题单生效"}`, () => {
        const u = initObj();
        u.onlyUrls = !u.onlyUrls;
        Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_solution__"], u);
      }, { title: "插件默认会在所有讨论发布页生效，如果只想在收藏链接生效，可以使用此功能" });
      _GM_registerMenuCommand(`添加本页`, () => {
        const urls = initUrls();
        let ok = false;
        let url = window.location.href;
        for (let info of urls) {
          if (!info || !(info == null ? void 0 : info.link)) {
            continue;
          }
          if (info.link.indexOf(url) != -1) {
            ok = true;
            break;
          }
        }
        if (ok) {
          ElementPlus.ElMessage({
            message: "收藏失败,链接已经存在！",
            type: "error"
          });
        } else {
          if (isLeetCodeCircleUrl(url) && url.indexOf("view") != -1) {
            try {
              url = url.split("view")[0];
            } catch (e) {
              url = window.location.href;
            }
          }
          urls.unshift({
            title: document.title,
            link: url
          });
          Container.style.display = "block";
          Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_urls__"], urls);
          Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_update__"], true);
          Cache$2.set(__0X3F_PROBLEM_KEYS__$1["__0x3f_problmes_add_cur__"], true);
          ElementPlus.ElMessage({
            message: "收藏成功！刷新生效",
            type: "success"
          });
        }
      });
    }
  }
  async function startMain() {
    for (let callback of [showProblemSolve, tips_message, update_version, watchSubmit, run, startStopRanking, handlerScore, resetProblemStatus]) {
      try {
        callback();
      } catch (_) {
        if (isDev()) {
          console.error(_);
        }
      }
    }
  }
  startMain();

})(ElementPlus, Vue);