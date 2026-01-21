// ==UserScript==
// @name         快速查包
// @namespace    fsh
// @version      1.0.16
// @description  快速跳转至指定包或指定分支
// @author       05128
// @match        *://ci.meitu.city/*
// @match        *://ios.meitu-int.com/ipa/*
// @match        *://jira.meitu.com/*
// @match        *://cf.meitu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.js
// @homepage     https://greasyfork.org/zh-CN/scripts/454567-%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454567/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/454567/%E5%BF%AB%E9%80%9F%E6%9F%A5%E5%8C%85.meta.js
// ==/UserScript==

// Auto-generated bundle - DO NOT EDIT DIRECTLY
// Generated at: 2026-01-21T03:28:57.881Z

// 兼容性函数
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ======== styles.js ========
/**
 * 样式管理器 - 优化版本
 * 使用CSS变量和合并相似样式，减少代码重复
 */
const StyleManager = {
  injectStyles() {
    const styles = `
      :root {
        --primary-color: #324B4E;
        --bg-color: #F9F0DA;
        --border-radius: 40px;
        --border-radius-small: 25px;
        --transition: .3s linear;
      }

      .search {
        position: relative;
        width: 220px;
      }

      .search input {
        height: 40px;
        width: 220px;
        border-radius: var(--border-radius);
        border: 2px solid var(--primary-color);
        background: var(--bg-color);
        transition: var(--transition);
        float: left;
        text-indent: 10px;
      }

      .search input:focus::placeholder {
        opacity: 0;
      }

      .search button {
        height: 37px;
        border-radius: 37px;
        border-right: 1px solid var(--primary-color);
        border-left: 0px;
        background: var(--bg-color);
        right: 0;
        position: absolute;
      }

      .btn_find_build {
        width: 40px;
        text-align: center;
      }

      .search_span {
        cursor: pointer;
        height: 16px;
        margin: 0px 10px;
        padding: 3px;
        border-radius: var(--border-radius-small);
      }

      .to_new_build {
        height: 30px;
        width: 120px;
        border-radius: 42px;
        border: 1px solid var(--primary-color);
        background: #fff;
        transition: var(--transition);
        color: #544d4d;
        margin: 0px 10px;
        font-size: 14px;
      }

      .myimg {
        height: 16px;
      }

      #input_last_build {
        border-radius: 30px;
        border: 1px solid var(--primary-color);
      }

      .search-btn {
        display: inline-block;
        margin-left: 8px;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
        color: #424242;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        outline: none;
        vertical-align: middle;
      }

      .search-btn:hover {
        background: #f5f5f5;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .search-btn:active {
        background: #e0e0e0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
    `;

    try {
      if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(styles);
      } else {
        $("head").append($(`<style>${styles}</style>`));
      }
    } catch (error) {
      const styleElement = document.createElement("style");
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }
};

// ======== config.js ========
/**
 * 配置管理器 - 优化版本
 * 统一配置结构，减少重复定义
 */
const ConfigManager = {
  CONSTANTS: {
    REFRESH_INTERVAL: 1000,
    DOMAINS: {
      JIRA: "jira.meitu.com",
    },
    JIRA_FIELD_IDS: {
      BUILD_ID: "customfield_10303",
      STEP_TEXT: "customfield_10203",
      PLATFORM: "customfield_10301",
      CREATE_DIALOG: "create-issue-dialog",
      CLOSE_DIALOG: "workflow-transition-21-dialog",
      REOPEN_DIALOG: "workflow-transition-31-dialog",
      COMMENT_TOOLBAR: "wiki-edit-wikiEdit0",
      SEARCH_BTN_CREATE: "search_btn_create",
      CHANGE_SIDE_BUTTON: "change_side_ios",
    },
    // LogWork 打卡标签类别配置
    LOG_WORK_CATEGORIES: [
      "海外",
      "闪传",
      "垂类",
      "美化",
      "美容",
      "拼图",
      "相机",
      "视频美化",
      "视频美容",
      "隐私整改",
      "live",
      "渠道协议适配",
      "证件照",
      "素材中心",
      "订阅",
      "商业化",
      "社区",
      "其他"
    ],

    // 对话框延迟（毫秒）
    DIALOG_DELAY_SHORT: 500,    // 用于评论工具栏
    DIALOG_DELAY_MEDIUM: 800,   // 用于关闭/重新打开对话框
    DIALOG_DELAY_LONG: 1000,    // 用于复杂操作

    // 自动填充设置
    AUTO_FILL_DELAY: 3000,      // 自动填充分支信息前的延迟（毫秒）
    AUTO_FILL_COUNTDOWN: 3      // 自动填充倒计时秒数
  },

  // 统一项目配置 - 避免Android/iOS重复定义
  PROJECT_CONFIG: {
    '美图秀秀': {
      name: 'mtxx',
      androidUid: 'hydsriakywi7a4wtukhxh6zt6q',
      iosUid: 'aze3897z9xi8g3dzvw8ce6thc5'
    },
    '美颜相机': {
      name: 'beautycam',
      androidUid: 'afpqgy5mqyiyejvj7tu5pvkb3s',
      iosUid: 'cd2z8rxy5uic9iaz6dbjv8xhw6'
    },
    '美拍': {
      name: 'meipai',
      androidUid: 'a3cat9d2fnieu5ghyjr6uvysd7',
      iosUid: 'e79mtyimnwixp46e6hvspus6v2'
    },
    '美妆相机': {
      name: 'makeup',
      androidUid: 'e69r7unz2bi2rm4d5hhmejunjt',
      iosUid: 'ffp224ksztiqhi58ud7n33fvs2'
    },
    '潮自拍': {
      name: 'selfiecity',
      androidUid: 'au89qds8ipjnfmq6y36yxrwwqr',
      iosUid: 'etiv8nbxjpihni6cr9qhba4u3r'
    },
    '设计室': {
      name: 'mtsjs',
      androidUid: 'e57ixjbvhjj3pkjtqbircekw4g',
      iosUid: 'gki88wa2nfiqxi7vhyf2xux6cw'
    },
    'wink': {
      name: 'wink',
      androidUid: 'a7wb9ngehrjhs5s6kbc8jhpmut',
      iosUid: 'bhks37k3uaizn4yvcspt4j3nma'
    },
    'BeautyPlus': {
      name: 'beautyplus',
      androidUid: 'b4ecchhcsgibw5kfamgxdr4z2f',
      iosUid: 'eprvgz2kwujgvmyt7bvw92fae7'
    },
    'AirBrush': {
      name: 'airbrush',
      androidUid: 'ap6s3sujqjjze3nzd8e46sgwg8',
      iosUid: 'e8new3bg3eiximneygeizjyrn6'
    },
    'eve': {
      name: 'eve',
      androidUid: 'bqn9z5twij9d3jqjgpg6dvws3',
      iosUid: 'b3huanjy32ipcmhkq6cfnvvspp'
    },
    'chic': {
      name: 'chic',
      androidUid: 'ajbmhzdremjtk5nkx9eezbc2ps',
      iosUid: 'hfkv4chfbgj56kuphtpe656t6g'
    },
    '美图宜肤V': {
      name: 'eveking',
      androidUid: 'cprbcrdb58jwxjne7z5daitprd',
      iosUid: 'dcjubb2t6ajvyjxaymkvtpp5az'
    },
    'EveNetAssist': {
      name: 'evenetassist',
      androidUid: 'epynw2drmbjyz5amwe4eirqm3f',
      iosUid: 'bqn9z5twij9d3jqjgpg6dvws3'
    },
    'VChat': {
      name: 'vchatbeauty',
      androidUid: 'envi6ei33biw7kn9zi42t2yqm2',
      iosUid: 'envi6ei33biw7kn9zi42t2yqm2'
    },
    'vcut': {
      name: 'vcut',
      androidUid: 'envi6ei33biw7kn9zi42t2yqm2',
      iosUid: 'envi6ei33biw7kn9zi42t2yqm2'
    },
    'Vmake': {
      name: 'beautyplusvideo',
      androidUid: 'b4ecchhcsgibw5kfamgxdr4z2f',
      iosUid: 'b4ecchhcsgibw5kfamgxdr4z2f'
    },
    'PixEngine': {
      name: 'pixengine',
      androidUid: 'pixengine',
      iosUid: 'pixengine'
    },
    '智肤APP': {
      name: 'skinar',
      androidUid: 'ecsgbwkuj5iffmjg3jzjq82ti4',
      iosUid: 'ecsgbwkuj5iffmjg3jzjq82ti4'
    },
    '美图秀秀Starii': {
      name: 'starii',
      androidUid: 'enri33faz6ibwj5t7f9jpq4cvi',
      iosUid: 'hmeb767rjnjh8i3vmy3rwmkxn7'
    }
  },

  // 获取项目配置的辅助方法
  getProjectConfig(projectName, platform) {
    const config = this.PROJECT_CONFIG[projectName];
    if (!config) return null;

    return {
      name: config.name,
      uid: platform === 'iOS' ? config.iosUid : config.androidUid
    };
  },

  // Jira表单字段配置
  FORM_FIELD_CONFIG: {
    summary: "#summary",
    platform: 'input[name="customfield_10301"]:checked',
    priority: "#priority-field",
    path0: "#selectCFLevel0",
    path1: "#selectCFLevel1",
    assignee: "#assignee-field",
    severity: "#customfield_10406",
    version: "#versions-textarea",
    bugType: "#customfield_10201",
    find: "#customfield_11801",
    howFind: "#customfield_10202",
    frequency: "#customfield_10204",
    branch: "#customfield_10303",
    step: "#customfield_10203",
    labels: "#labels-textarea",
  },

  // UI隐藏配置
  UI_HIDE_CONFIGS: [
    {
      name: "隐藏Starii项目UI",
      condition: () => Utils.ui.getPageInfo().projectName === "美图秀秀Starii",
      hideParentIds: [
        "customfield_10422", "customfield_10202", "customfield_10305",
        "customfield_11100", "customfield_11101", "customfield_11102",
        "customfield_10304", "fixVersions", "reporter", "customfield_13601"
      ],
    }
  ],

  // 企业微信文档API配置
  WECHAT_WORK_API: {
    CORPID: 'wxb7b291e71c4e8823',
    CORPSECRET: 'po-FCTwPK7lsu7UnWMCmVn4yuH8GdHHj_orCHf_s_B8',
    GETTOKEN_URL: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
    CREATE_DOC_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/create_doc',
    MOD_DOC_MEMBER_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/mod_doc_member',
    MOD_DOC_JOIN_RULE_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/mod_doc_join_rule',
    GET_SHEET_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/get_sheet',
    GET_FIELDS_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/get_fields',
    ADD_FIELDS_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/add_fields',
    DELETE_FIELDS_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/delete_fields',
    ADD_RECORDS_URL: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/smartsheet/add_records',

    // 通知人员配置（用于文档权限设置）
    // 这些用户会被自动添加到文档的 update_file_member_list 中
    // 支持为每个用户单独配置权限级别和类型
    NOTICE_MEMBERS: [
      { userid: 'hlp', type: 1, auth: 7 },      // 管理员权限
      { userid: '13630', type: 1, auth: 7 },    // 管理员权限
      { userid: 'ydr', type: 1, auth: 2 },      // 读写权限
      { userid: '16093', type: 1, auth: 2 },    // 读写权限
      // 在此处添加更多固定通知人员（可选）
    ],

    // 文档权限默认配置
    DOC_MEMBER_DEFAULT_TYPE: 1,  // type: 1 表示企业成员
    DOC_MEMBER_DEFAULT_AUTH: 2   // auth: 2 表示读写权限（非管理员），用于动态收集的用户
  }
};

// ======== utils.js ========
/**
 * DOM工具集 - 精简版本
 * 提供常用的DOM操作方法
 */
const Utils = {
  /**
   * DOM操作工具
   */
  dom: {
    safeGetElement(id) {
      try {
        return document.getElementById(id);
      } catch (error) {
        console.warn(`获取元素失败: ${id}`, error);
        return null;
      }
    },

    elementExists(id) {
      return this.safeGetElement(id) !== null;
    }
  },

  /**
   * 存储工具
   */
  storage: {
    setValue(key, value) {
      try {
        GM_setValue(key, value);
      } catch (error) {
        console.error(`存储失败: ${key}`, error);
      }
    },

    getValue(key, defaultValue = "") {
      try {
        return GM_getValue(key, defaultValue);
      } catch (error) {
        console.error(`读取失败: ${key}`, error);
        return defaultValue;
      }
    }
  },

  /**
   * URL工具
   */
  url: {
    isDomain(domain) {
      return location.href.indexOf(domain) > -1;
    }
  },

  /**
   * 事件工具
   */
  events: {
    addCaptureClick(selector, callback) {
      try {
        document.addEventListener("click", function (e) {
          const t = e.target && e.target.closest && e.target.closest(selector);
          if (!t) return;
          try {
            callback(t, e);
          } catch (err) {
            console.error("事件回调执行失败:", err);
          }
        }, true);
      } catch (e) {
        console.error("注册捕获监听失败:", e);
      }
    },

    safeCallChangeBugPlatform(platform) {
      try {
        const fn = typeof window !== "undefined" &&
                   typeof window.changeBugPlatform === "function" ?
                   window.changeBugPlatform :
                   typeof changeBugPlatform === "function" ?
                   changeBugPlatform : null;
        if (!fn) {
          console.warn("changeBugPlatform 未定义");
          return;
        }
        fn(platform);
      } catch (err) {
        console.error("changeBugPlatform 调用失败:", err);
      }
    },

    registerPlatformCapture(selector, platform) {
      this.addCaptureClick(selector, () => this.safeCallChangeBugPlatform(platform));
    }
  },

  /**
   * 按钮工具
   */
  button: {
    addLabelAfter(targetSelector, labelFor, buttonConfig = null) {
      const label = $(`<label for="${labelFor}"></label>`);
      $(targetSelector).after(label);

      if (buttonConfig) {
        const btn = $(`<input type="button" class="${buttonConfig.className || "aui-button"}" value="${buttonConfig.text}" id="${buttonConfig.id}">`);
        label.append(btn);
      }
      return label;
    },

    addButtonsToContainer(containerSelector, buttons) {
      const container = $(containerSelector);
      if (container.length === 0) {
        console.warn(`容器 ${containerSelector} 不存在`);
        return;
      }

      buttons.forEach((btnConfig) => {
        const btn = $(`<button class="${btnConfig.className || "aui-button"}" id="${btnConfig.id}" type="button">${btnConfig.text}</button>`);
        container.append(btn);
      });
    },

    addBranchButtons(containerSelector) {
      this.addButtonsToContainer(containerSelector, [
        { className: "aui-button", id: "get_branch_btn", text: "获取分支" },
        { className: "aui-button", id: "last_branch_btn", text: "上次分支" }
      ]);
    }
  },

  /**
   * 通用工具
   */
  common: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    showToast(message, backgroundColor = "#4CAF50") {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        padding: 10px; background: ${backgroundColor}; color: white;
        border-radius: 5px; z-index: 9999;
      `;
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
    }
  },

  /**
   * UI工具
   */
  ui: {
    hideParentById(childNodeId) {
      const element = document.getElementById(childNodeId);
      if (element && element.parentNode) {
        element.parentNode.style.display = "none";
      }
    },

    hideParentsByIds(childNodeIds) {
      childNodeIds.forEach((id) => this.hideParentById(id));
    },

    hideElement(selector) {
      const element = typeof selector === "string" ? document.querySelector(selector) : selector;
      if (element) {
        element.style.display = "none";
      }
    },

    hideElements(selectors) {
      selectors.forEach((selector) => this.hideElement(selector));
    },

    hideIf(condition, targets) {
      const shouldHide = typeof condition === "function" ? condition() : condition;
      if (!shouldHide) return;

      if (Array.isArray(targets)) {
        this.hideParentsByIds(targets);
      } else if (typeof targets === "object" && targets !== null) {
        const { hideIds = [], hideSelectors = [], hideParentIds = [] } = targets;

        if (hideIds.length > 0) {
          hideIds.forEach((id) => this.hideElement(`#${id}`));
        }

        if (hideSelectors.length > 0) {
          this.hideElements(hideSelectors);
        }

        if (hideParentIds.length > 0) {
          this.hideParentsByIds(hideParentIds);
        }
      } else if (typeof targets === "string") {
        this.hideParentById(targets);
      }
    },

    getProjectName() {
      const projectOptionsDiv = document.getElementById("project-options");
      if (projectOptionsDiv) {
        try {
          const dataSuggestionsValue = projectOptionsDiv.getAttribute("data-suggestions");
          const jsonObject = JSON.parse(dataSuggestionsValue);
          const project = jsonObject[0]["items"][0].label.trim();
          return project.replace(/\s*\([^)]*\)\s*/, "").trim();
        } catch (error) {
          console.warn("从 project-options 获取项目名失败:", error);
        }
      }

      const projectNameElement = $("#project-name-val");
      if (projectNameElement.length > 0) {
        return projectNameElement.text().trim();
      }

      return "";
    },

    getPageInfo() {
      return {
        projectName: this.getProjectName(),
        currentUrl: window.location.href,
        pageTitle: document.title,
        hasElement: (selector) => !!document.querySelector(selector),
        getElementText: (selector) => {
          const element = document.querySelector(selector);
          return element ? element.textContent.trim() : "";
        }
      };
    }
  }
};

// ======== field-fillers.js ========
/**
 * 字段填充工具集 - 优化版本
 * 统一字段填充逻辑，减少重复代码
 */
const FieldFillers = {
  // 通用字段填充方法
  fillField(selector, value, type = 'input') {
    const element = $(selector);
    if (element.length === 0) return false;

    try {
      switch (type) {
        case 'radio':
          element.prop("checked", true).trigger("change");
          break;
        case 'input':
          element.val(value).trigger("input").trigger("change");
          break;
        case 'select':
          element.val(value).trigger("change");
          // 验证是否设置成功
          if (element.val() !== value) {
            const option = element.find(`option:contains("${value}")`).first();
            if (option.length > 0) {
              element.val(option.val()).trigger("change");
            }
          }
          break;
        default:
          element.val(value).trigger("input").trigger("change");
      }
      return true;
    } catch (error) {
      console.error(`填充字段失败: ${selector}`, error);
      return false;
    }
  },

  // 多选下拉框填充（统一处理单值和多值）
  fillMultiSelect(containerSelector, textareaSelector, suggestionsSelector, value, options = {}) {
    const container = $(containerSelector);
    const textarea = $(textareaSelector);

    if (!textarea.length) return Promise.resolve(false);

    return new Promise((resolve) => {
      const config = {
        singleMode: false,
        maxRetries: 10,
        retryDelay: 100,
        selectDelay: 200,
        inputDelay: 80,
        ...options,
      };

      // 清空已选chips
      container.find(".representation em, .representation .icon-close").each((_, el) => $(el).click());

      const values = Array.isArray(value) ? value : [value];
      const targetValues = config.singleMode ? [values[0]] : values;

      if (config.singleMode && targetValues.length > 0) {
        // 单值模式处理
        const targetValue = targetValues[0];
        textarea.val("").focus().val(targetValue).trigger("input").trigger("keyup");

        setTimeout(() => {
          const $items = $(suggestionsSelector).find("li a, li .aui-list-item");
          const $hit = $items.filter((_, el) => $(el).text().trim() === targetValue).first();

          if ($hit.length) {
            $hit.click();
          } else {
            const e = $.Event("keydown", { which: 13, keyCode: 13 });
            textarea.trigger(e);
          }

          textarea.trigger("change").trigger("blur");
          resolve(true);
        }, 120);
        return;
      }

      // 多值模式处理
      let currentIndex = 0;
      const selectNext = () => {
        if (currentIndex >= targetValues.length) {
          setTimeout(() => {
            textarea.trigger("change").trigger("blur");
            resolve(true);
          }, 100);
          return;
        }

        const currentValue = targetValues[currentIndex];
        textarea.val("").focus().val(currentValue).trigger("input").trigger("keyup");

        setTimeout(() => {
          const $items = $(suggestionsSelector).find("li a, li .aui-list-item");
          const $hit = $items.filter((_, el) => $(el).text().trim() === currentValue).first();

          if ($hit.length) {
            $hit.click();
            currentIndex++;
            setTimeout(selectNext, config.selectDelay);
          } else {
            this.triggerMultipleEvents(textarea);
            currentIndex++;
            setTimeout(selectNext, 100);
          }
        }, config.inputDelay);
      };

      selectNext();
    });
  },

  // 触发多种事件
  triggerMultipleEvents(textarea) {
    const enterEvent = $.Event("keydown", { which: 13, keyCode: 13 });
    textarea.trigger(enterEvent);

    setTimeout(() => {
      const tabEvent = $.Event("keydown", { which: 9, keyCode: 9 });
      textarea.trigger(tabEvent);
    }, 50);

    setTimeout(() => {
      textarea.blur();
    }, 100);
  },

  // 经办人字段填充（简化版）
  fillAssignee(selector, value) {
    return new Promise((resolve) => {
      const assigneeInput = $(selector);
      if (!assigneeInput.length) {
        resolve(false);
        return;
      }

      assigneeInput.val("").focus();

      // 逐字符输入
      let currentIndex = 0;
      const typeCharacter = () => {
        if (currentIndex < value.length) {
          const currentValue = value.substring(0, currentIndex + 1);
          assigneeInput.val(currentValue);

          try {
            const el = assigneeInput[0];
            el && el.dispatchEvent(new Event("input", { bubbles: true }));
          } catch (e) {}
          assigneeInput.trigger("input").trigger("change");

          currentIndex++;
          setTimeout(typeCharacter, 50);
        } else {
          setTimeout(() => {
            this.selectAssigneeSuggestion(value, resolve);
          }, 1300);
        }
      };

      setTimeout(typeCharacter, 100);
    });
  },

  // 选择经办人建议项（简化版）
  selectAssigneeSuggestion(value, resolve) {
    const suggestions = $("#assignee-suggestions");

    setTimeout(() => {
      const suggestionItems = suggestions.find('[role="option"], li a, li .aui-list-item, .aui-list-item, li, a').filter(":visible");

      if (suggestionItems.length === 0) {
        this.setAssigneeFallback(value, resolve);
        return;
      }

      let matchedItem = null;
      let bestScore = 0;
      let bestMatch = null;

      suggestionItems.each((index, item) => {
        const $item = $(item);
        const text = $item.text().trim();
        const score = this.calculateMatchScore(text, value);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = $item;
        }

        if (score === 100) {
          matchedItem = $item;
          return false;
        }
      });

      if (!matchedItem && bestMatch && bestScore >= 20) {
        matchedItem = bestMatch;
      } else if (!matchedItem && suggestionItems.length > 0) {
        matchedItem = $(suggestionItems[0]);
      }

      if (matchedItem) {
        matchedItem.trigger("mousedown").trigger("mouseup").click();
        setTimeout(() => {
          resolve(true);
        }, 500);
      } else {
        this.setAssigneeFallback(value, resolve);
      }
    }, 200);
  },

  // 计算匹配分数
  calculateMatchScore(text, value) {
    if (text === value) return 100;
    if (text.startsWith(value)) return 80;
    if (text.includes(value)) return 60;
    if (text.toLowerCase().includes(value.toLowerCase())) return 40;

    const cleanValue = value.replace(/[\s\-_]/g, "").toLowerCase();
    const cleanText = text.replace(/[\s\-_]/g, "").toLowerCase();
    return cleanText.includes(cleanValue) ? 20 : 0;
  },

  // 经办人字段兜底设置
  setAssigneeFallback(value, resolve) {
    try {
      $.ajax({
        url: "/rest/api/2/user/picker",
        data: { query: value, maxResults: 20 },
        type: "GET",
        success: (data) => {
          try {
            const users = (data && (data.users || data.items || data)) || [];
            if (users.length > 0) {
              const pick = users.find((u) => (u.displayName || "").trim() === value) || users[0];
              const display = (pick.displayName || pick.name || pick.key || pick.accountId || value).toString();
              const idVal = (pick.name || pick.key || pick.accountId || display).toString();
              const avatar = pick.avatarUrl || (pick.avatarUrls && (pick.avatarUrls["16x16"] || pick.avatarUrls.small));

              const hidden = $('#assignee, input[name="assignee"], input#assignee');
              if (hidden.length) hidden.val(idVal).trigger("change");

              const assigneeInput = $("#assignee-field");
              assigneeInput.val(display).trigger("change").trigger("blur");

              const icon = $("#assignee-single-select .aui-ss-entity-icon");
              if (avatar) icon.attr("src", avatar);
              icon.attr("alt", display);

              resolve(true);
              return;
            }
          } catch (e) {
            console.warn("解析用户选择器返回失败", e);
          }

          const assigneeInput = $("#assignee-field");
          assigneeInput.val(value).trigger("change").trigger("blur");
          resolve(true);
        },
        error: () => {
          const assigneeInput = $("#assignee-field");
          assigneeInput.val(value).trigger("change").trigger("blur");
          resolve(true);
        }
      });
    } catch (e) {
      const assigneeInput = $("#assignee-field");
      assigneeInput.val(value).trigger("change").trigger("blur");
      resolve(true);
    }
  }
};

// ======== form-utils.js ========
/**
 * 表单工具集 - 简化版本
 * 处理表单数据的收集和填充
 */
const FormUtils = {
  // 安全获取元素值
  safeGetValue(selector, defaultValue = "") {
    try {
      const element = $(selector);
      if (element.length === 0) {
        console.warn(`元素不存在: ${selector}`);
        return defaultValue;
      }

      if (element.is('input[type="radio"]:checked') || element.is('input[type="checkbox"]:checked')) {
        return element.attr("id") || element.val();
      } else if (element.is("select")) {
        return element.find("option:selected").val() || element.val();
      } else if (element.is("input, textarea")) {
        return element.val();
      } else {
        return element.text().trim();
      }
    } catch (error) {
      console.error(`获取元素值失败: ${selector}`, error);
      return defaultValue;
    }
  },

  // 安全设置元素值
  safeSetValue(selector, value, retryCount = 3) {
    if (!value && value !== 0) return false;

    try {
      const element = $(selector);
      if (element.length === 0) {
        console.warn(`元素不存在: ${selector}`);
        return false;
      }

      if (element.is('input[type="radio"]') || element.is('input[type="checkbox"]')) {
        const targetElement = $(`input[id="${value}"], input[value="${value}"]`);
        if (targetElement.length > 0) {
          targetElement.prop("checked", true).trigger("change");
          return true;
        }
      } else if (element.is("select")) {
        element.val(value).trigger("change");
        if (element.val() !== value) {
          const option = element.find(`option:contains("${value}")`).first();
          if (option.length > 0) {
            element.val(option.val()).trigger("change");
          }
        }
        return element.val() === value;
      } else if (element.is("input, textarea")) {
        element.val(value).trigger("input").trigger("change");
        return true;
      }

      return false;
    } catch (error) {
      console.error(`设置元素值失败: ${selector}`, error);
      if (retryCount > 0) {
        setTimeout(() => this.safeSetValue(selector, value, retryCount - 1), 100);
      }
      return false;
    }
  },

  // 收集表单数据
  collectFormData() {
    const formConfig = ConfigManager.FORM_FIELD_CONFIG;
    const formData = {};
    let successCount = 0;
    let totalCount = 0;

    Object.entries(formConfig).forEach(([key, selector]) => {
      totalCount++;
      let value;

      if (key === "platform") {
        const platformElement = $(selector);
        if (platformElement.length > 0) {
          value = platformElement.attr("id");
          console.log(`平台字段获取: ${value}`);
        }
      } else if (key === "branch") {
        const branchElement = $(selector);
        if (branchElement.length > 0) {
          value = branchElement.val();
          console.log(`分支字段获取: ${value}`);
        }
      } else if (key === "version") {
        const chips = $("#versions-multi-select .representation .items .value-text");
        if (chips.length > 0) {
          value = $(chips[0]).text().trim();
          console.log(`版本字段获取: ${value}`);
        } else {
          value = this.safeGetValue(selector);
        }
      } else if (key === "labels") {
        const chips = $("#labels-multi-select .representation .items .value-text");
        if (chips.length > 0) {
          value = chips.map((i, el) => $(el).text().trim()).get();
          console.log("标签字段获取:", value);
        } else {
          value = this.safeGetValue(selector);
        }
      } else if (key === "assignee") {
        const assigneeInput = $(selector);
        if (assigneeInput.length > 0 && assigneeInput.val().trim()) {
          value = assigneeInput.val().trim();
          console.log("经办人字段获取:", value);
        } else {
          const entityIcon = $("#assignee-single-select .aui-ss-entity-icon");
          if (entityIcon.length > 0 && entityIcon.attr("alt")) {
            value = entityIcon.attr("alt");
            console.log("经办人字段从图标获取:", value);
          } else {
            value = this.safeGetValue(selector);
          }
        }
      } else {
        value = this.safeGetValue(selector);
        if (value) {
          console.log(`${key}字段获取: ${value}`);
        }
      }

      if (value) {
        formData[key] = value;
        successCount++;
      } else {
        console.warn(`字段 ${key} (${selector}) 获取失败或为空`);
      }
    });

    console.log(`表单数据收集完成: ${successCount}/${totalCount} 个字段成功`);
    console.log("收集到的表单数据:", formData);
    return formData;
  },

  // 填充表单数据
  fillFormData(formData) {
    if (!formData || typeof formData !== "object") {
      Utils.common.showToast("没有可用的表单数据", "#f44336");
      return;
    }

    const baseSelectors = ConfigManager.FORM_FIELD_CONFIG;
    let successCount = 0;
    let totalCount = 0;
    const promises = [];
    let deferredAssigneeValue = null;

    const entries = Object.entries(formData);
    entries.forEach(([key, value]) => {
      if (value && baseSelectors[key]) {
        totalCount++;

        if (key === "assignee") {
          deferredAssigneeValue = value;
          return;
        }

        let fillPromise;

        if (key === "platform") {
          const selector = `input[id="${value}"]`;
          fillPromise = Promise.resolve(FieldFillers.fillField(selector, value, 'radio'));
        } else if (key === "branch") {
          fillPromise = Promise.resolve(FieldFillers.fillField(baseSelectors[key], value, 'input'));
        } else if (key === "version") {
          fillPromise = FieldFillers.fillMultiSelect(
            "#versions-multi-select",
            baseSelectors[key],
            "#versions-suggestions",
            value,
            { singleMode: true }
          );
        } else if (key === "labels") {
          fillPromise = FieldFillers.fillMultiSelect(
            "#labels-multi-select",
            baseSelectors[key],
            "#labels-suggestions",
            value,
            { singleMode: false }
          );
        } else {
          fillPromise = Promise.resolve(this.safeSetValue(baseSelectors[key], value));
        }

        promises.push(
          fillPromise.then((success) => {
            if (success) {
              successCount++;
            } else {
              console.warn(`字段 ${key} (${baseSelectors[key]}) 填充失败`);
            }
            return success;
          }).catch((error) => {
            console.error(`字段 ${key} 填充出错:`, error);
            return false;
          })
        );
      }
    });

    Promise.all(promises).then(() => {
      if (deferredAssigneeValue && baseSelectors["assignee"]) {
        return FieldFillers.fillAssignee(baseSelectors["assignee"], deferredAssigneeValue).then((success) => {
          if (success) {
            successCount++;
          } else {
            console.warn(`字段 assignee (${baseSelectors["assignee"]}) 填充失败`);
          }
          return success;
        }).catch((error) => {
          console.error(`字段 assignee 填充出错:`, error);
          return false;
        });
      }
      return true;
    }).then(() => {
      const message = `表单填充完成: ${successCount}/${totalCount} 个字段成功`;
      Utils.common.showToast(
        message,
        successCount === totalCount ? "#4CAF50" : "#ff9800"
      );
      console.log(message, formData);
    }).catch((error) => {
      console.error("表单填充过程中出现错误:", error);
      Utils.common.showToast("表单填充过程中出现错误", "#f44336");
    });
  }
};

// ======== version-utils.js ========
/**
 * 版本管理工具 - 精简版本
 * 处理版本相关的逻辑
 */
const VersionUtils = {
  getCurrentMonthDays() {
    const dt = new Date();
    dt.setMonth(dt.getMonth() + 1);
    dt.setDate(0);
    return dt.getDate();
  },

  parseDateFromVersion(versionText) {
    const startNum = versionText.lastIndexOf("(") !== -1 ? versionText.lastIndexOf("(") : versionText.lastIndexOf("（");
    const endNum = versionText.lastIndexOf(")") !== -1 ? versionText.lastIndexOf(")") : versionText.lastIndexOf("）");

    const dateStr = versionText.slice(startNum + 1, endNum);
    let month = "";
    let date = "";

    if (dateStr.includes(".")) {
      const parts = dateStr.split(".");
      month = parts[0];
      date = parts[1];
    } else if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      month = parts[0];
      date = parts[1];
    } else {
      month = parseInt(dateStr.slice(4, 6));
      date = parseInt(dateStr.slice(6));
    }

    return { month: String(month), date: String(date) };
  },

  calculateDateDifference(month, date, currentMonth, currentDate) {
    const targetMonth = parseInt(month);
    const targetDate = parseInt(date);

    if (targetMonth < currentMonth && targetMonth !== 1) {
      return -1;
    }

    if (targetMonth === currentMonth) {
      const diff = targetDate - currentDate;
      return diff >= 0 ? diff : -1;
    }

    if (targetMonth === currentMonth + 1 || targetMonth === currentMonth - 11) {
      const monthDuration = this.getCurrentMonthDays();
      const daysToEnd = monthDuration - currentDate;
      return targetDate + daysToEnd;
    }

    return -1;
  },

  getClosestVersionDate(platform) {
    const date = new Date();
    const today = date.getDate();
    const currentMonth = date.getMonth() + 1;

    let minDiff = 99;
    let closestDate = "";

    const optgroup = $(".aui-field-versionspicker")
      .find(".multi-select-select")
      .find('[label="未发布版本"]')[0];

    if (!optgroup) {
      console.warn("未找到版本选择器");
      return "";
    }

    const options = optgroup.getElementsByTagName("option");

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const text = option.textContent.trim();

      if (text.toLowerCase().indexOf(platform.toLowerCase()) < 0) {
        continue;
      }

      try {
        const { month, date } = this.parseDateFromVersion(text);
        const diff = this.calculateDateDifference(month, date, currentMonth, today);

        if (diff !== -1 && diff < minDiff) {
          closestDate = text.slice(
            text.lastIndexOf("(") !== -1 ? text.lastIndexOf("(") + 1 : text.lastIndexOf("（") + 1,
            text.lastIndexOf(")") !== -1 ? text.lastIndexOf(")") : text.lastIndexOf("）")
          );
          minDiff = diff;
        }
      } catch (error) {
        console.warn(`解析版本日期失败: ${text}`, error);
      }
    }

    return closestDate;
  },

  clearSelectedVersions() {
    const div = document.getElementsByClassName("representation")[0];
    if (!div) return;

    const emarr = div.getElementsByTagName("em");
    for (let i = emarr.length - 1; i >= 0; i--) {
      setTimeout(() => {
        if (emarr[i]) emarr[i].click();
      }, 200 * (emarr.length - i));
    }
  },

  setVersionValue(platform, targetDate) {
    const optgroup = $(".aui-field-versionspicker")
      .find(".multi-select-select")
      .find('[label="未发布版本"]')[0];

    if (!optgroup) {
      console.warn("未找到版本选择器的未发布版本组");
      return;
    }

    const options = optgroup.getElementsByTagName("option");

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const text = option.textContent.trim();

      if (text.indexOf(targetDate) > 0 && text.toLowerCase().indexOf(platform.toLowerCase()) > 0) {
        // 使用FieldFillers的多选下拉框方法来选择版本
        FieldFillers.fillMultiSelect(
          "#versions-multi-select",           // 容器选择器
          "#versions-textarea",              // 输入框选择器
          "#versions-suggestions",           // 建议列表选择器
          text,                              // 要选择的版本文本
          { singleMode: true }               // 单值模式
        ).then((success) => {
          if (success) {
            console.log(`已通过多选下拉框选择版本: ${text}`);
          } else {
            console.warn(`版本选择失败: ${text}`);
            // 如果多选下拉框方法失败，尝试直接设置
            $("#versions-textarea").val(text).trigger("input").trigger("change");
          }
        });

        break;
      }
    }
  },

  autoSelectClosestVersion(platform) {
    try {
      this.clearSelectedVersions();

      const closestDate = this.getClosestVersionDate(platform);

      if (closestDate) {
        setTimeout(() => {
          this.setVersionValue(platform, closestDate);
          console.log(`已自动选择最接近的${platform}版本: ${closestDate}`);
        }, 500);
      } else {
        console.warn(`未找到合适的${platform}版本`);
      }
    } catch (error) {
      console.error("自动选择版本失败:", error);
    }
  }
};

// ======== branch-utils.js ========
/**
 * 分支相关功能 - 简化版本
 * 处理分支获取和填充逻辑
 */

// 获取分支名
async function get_branch(platform, build_id) {
  return new Promise((resolve, reject) => {
    const project_name = Utils.ui.getProjectName();
    const projectConfig = ConfigManager.getProjectConfig(project_name, platform);

    if (!projectConfig) {
      const result = `未找到项目配置: ${project_name}`;
      GM_setValue("branch_value", result);
      resolve(result);
      return;
    }

    const url = `https://omnibus.meitu-int.com/api/apps/${projectConfig.uid}/builds/${build_id}`;

    GM_xmlhttpRequest({
      url: url,
      method: "GET",
      onload: function (res) {
        if (res.status === 200) {
          const regex = /refs\/heads\/(.*?)B/;
          const match = res.responseText.match(regex);
          const branch = match ? match[1] : "";
          const result = branch.indexOf("$") !== -1 ? "" : `${branch}#${build_id}`;
          const finalResult = branch === "" ? `未找到该包的分支，${build_id}` : result;

          GM_setValue("branch_value", finalResult);
          console.log(GM_getValue("branch_value"));
          resolve(GM_getValue("branch_value"));
        } else {
          const result = `未找到该包的分支，${build_id}`;
          GM_setValue("branch_value", result);
          resolve(result);
        }
      },
      onerror: function (err) {
        const result = "接口请求失败，建议重新关闭开启脚本再试试";
        GM_setValue("branch_value", result);
        reject(err);
      },
    });
  });
}

// 填入分支到输入框
async function fillInBranch(selector) {
  var element = $(selector);
  element.val("").val(GM_getValue("branch_value"));
}

// 填入分支到文本区域
async function fillInBranchTextarea(selector) {
  return fillInBranch(selector);
}

// 全局set_branch函数
window.set_branch = async function set_branch(selfId, parentId) {
  if (selfId === "get_branch_btn") {
    switch (parentId) {
      case "create-issue-dialog":
      case "qf-field-customfield_10303":
        // 手动点击按钮时，取消自动填充倒计时
        BranchUtils.AutoFillManager.cancelAutoFill('create');

        var $platform = $('input:radio[name="customfield_10301"]:checked');
        var $buildId = $("#customfield_10303");

        var id = $platform.attr("id");
        var label = document.querySelector("label[for='" + id + "']");

        try {
          var platform = label.textContent;
        } catch (error) {
          GM_setValue("branch_value", "#请先选择Bug平台");
          fillInBranch("#customfield_10303");
          return;
        }

        var buildId = $buildId.val();
        if (buildId === undefined || buildId === "" || buildId === null) {
          GM_setValue("branch_value", "#请先填写Build号");
          fillInBranch("#customfield_10303");
          return;
        }

        await get_branch(platform, buildId);
        await fillInBranch("#customfield_10303");
        break;

      case "issue-workflow-transition":
      case "issue-comment-add":
        var $platform = $("#customfield_10301-val");
        var $buildId = parentId === "issue-workflow-transition" ? $("#build_id_close") : $("#input_text");

        var platform = $platform.text().trim();
        var buildId = $buildId.val();

        await get_branch(platform, buildId);
        await fillInBranchTextarea("div#comment-wiki-edit textarea#comment");

        Utils.common.sleep(500).then(() => {
          $("#comment-wiki-edit textarea").focus();
        });
        break;

      default:
    }
  } else if (selfId === "get_branch_btn_close" || selfId === "get_branch_btn_open") {
    // 关闭问题或重新打开问题的对话框 - 获取分支按钮

    // 手动点击按钮时，取消自动填充倒计时
    const scenario = selfId.includes("close") ? 'close' : 'reopen';
    BranchUtils.AutoFillManager.cancelAutoFill(scenario);

    var $platform = $("#customfield_10301-val");
    var buildIdInputId = selfId === "get_branch_btn_close" ? "#build_id_close" : "#build_id_open";
    var $buildId = $(buildIdInputId);

    var platform = $platform.text().trim();
    var buildId = $buildId.val();

    if (!buildId) {
      GM_setValue("branch_value", "#请先填写Build号");
      await fillInBranchTextarea("div#comment-wiki-edit textarea#comment");
      return;
    }

    await get_branch(platform, buildId);
    await fillInBranchTextarea("div#comment-wiki-edit textarea#comment");

    Utils.common.sleep(500).then(() => {
      $("#comment-wiki-edit textarea").focus();
    });
  } else if (selfId === "last_branch_btn") {
    switch (parentId) {
      case "create-issue-dialog":
      case "qf-field-customfield_10303":
        await fillInBranch("#customfield_10303");
        break;

      case "issue-workflow-transition":
      case "issue-comment-add":
        await fillInBranchTextarea("div#comment-wiki-edit textarea#comment");
        break;

      default:
    }
  } else if (selfId === "last_branch_btn_close" || selfId === "last_branch_btn_open") {
    // 关闭问题或重新打开问题的"上次分支"按钮

    // 手动点击按钮时，取消自动填充倒计时
    const scenario = selfId.includes("close") ? 'close' : 'reopen';
    BranchUtils.AutoFillManager.cancelAutoFill(scenario);

    await fillInBranchTextarea("div#comment-wiki-edit textarea#comment");
  }
};

/**
 * 从Jira字段值中提取build号
 * @param {string} elementId - Jira字段ID
 * @returns {string} build号
 */
function getBuildId(elementId) {
  var buildContent = document.getElementById(elementId).textContent.trim();
  var reg = /\d{4,}/g;
  var buildIdArray = buildContent.match(reg);
  var buildId = '';

  if (buildIdArray == null || buildIdArray.length === 0) {
    console.log("未识别到 build 号");
  } else {
    buildId = buildIdArray[0];
    var regNum = /\d{4,}/g;
    buildId = buildId.match(regNum)[0].replace('#', '');
  }

  return buildId;
}

/**
 * 根据项目名和平台获取Omnibus基础URL
 * @returns {string} Omnibus URL
 */
function getBaseUrl() {
  var baseUrl = '';
  var projectName = Utils.ui.getProjectName();
  var platform = $("#customfield_10301-val").text().trim();
  var projectConfig = ConfigManager.getProjectConfig(projectName, platform);

  if (!projectConfig) {
    console.error(`未找到项目配置: ${projectName} - ${platform}`);
    return '';
  }

  // 移除URL中的平台标识符，统一使用基础URL
  baseUrl = `https://omnibus.meitu-int.com/apps/${projectConfig.uid}/build/number/`;

  return baseUrl;
}

/**
 * 在Jira页面添加跳转到分支的按钮
 * 在"创建build"和"解决build"字段后添加跳转按钮
 *
 * 注意：事件绑定由 EventManager 统一管理（main.js），
 * 这里只负责创建按钮，避免重复绑定导致打开多个页面
 */
window.addButtonJira = function addButtonJira() {
  // 检查按钮是否已经存在
  if (document.getElementById("search_btn_create") || document.getElementById("search_btn_solved")) {
    return;
  }

  // 创建分支按钮添加 (创建build)
  var btnCreate = $('<button class="search-btn" id="search_btn_create">跳转</button>');
  $("#customfield_10303-val").after(btnCreate);

  // 解决分支按钮添加 (解决build)
  var btnSolved = $('<button class="search-btn" id="search_btn_solved">跳转</button>');
  $("#customfield_10304-val").after(btnSolved);

  // ⚠️ 事件绑定已移至 main.js 的 EventManager.bindEvent() 中统一管理
  // 避免重复绑定导致打开多个页面
};

/**
 * 分支工具命名空间
 * 统一管理分支相关的功能模块
 */
const BranchUtils = {
  /**
   * 自动填充管理器
   * 统一管理创建问题、关闭问题、重新打开问题对话框中的自动填充逻辑
   * 消除重复代码，提供统一的接口
   */
  AutoFillManager: {
    // 存储每个场景的状态
    scenarios: {},

    /**
     * 设置自动填充功能
     * @param {Object} config - 配置对象
     * @param {string} config.scenario - 场景标识（'create', 'close', 'reopen'）
     * @param {string} config.inputSelector - 输入框选择器
     * @param {string} config.buttonId - 按钮ID
     * @param {string} config.dialogId - 对话框ID
     */
    setupAutoFill(config) {
      const { scenario, inputSelector, buttonId, dialogId } = config;

      // 初始化场景状态
      if (!this.scenarios[scenario]) {
        this.scenarios[scenario] = {
          timer: null,
          countdownTimer: null,
          lastInputContent: ""
        };
      }

      const state = this.scenarios[scenario];
      const $input = $(inputSelector);

      if ($input.length === 0) {
        console.warn(`[AutoFillManager] 未找到输入框: ${inputSelector}`);
        return;
      }

      // 移除旧的监听器（如果存在）
      $input.off(`input.autofill-${scenario}`).on(`input.autofill-${scenario}`, () => {
        const buildNum = $input.val();

        // 如果内容没有变化，跳过
        if (state.lastInputContent === buildNum) {
          return;
        }
        state.lastInputContent = buildNum;

        // 检查是否是有效的 build ID（4位以上数字）
        const isValidBuildId = /^\d{4,}$/.test(buildNum);

        if (isValidBuildId) {
          this.scheduleAutoFill(scenario, buildNum, buttonId, dialogId);
        } else {
          this.cancelAutoFill(scenario);
        }
      });
    },

    /**
     * 调度自动填充
     * @param {string} scenario - 场景标识
     * @param {string} buildId - Build ID
     * @param {string} buttonId - 按钮ID
     * @param {string} dialogId - 对话框ID
     */
    scheduleAutoFill(scenario, buildId, buttonId, dialogId) {
      const state = this.scenarios[scenario];
      if (!state) return;

      // 取消之前的定时器
      this.cancelAutoFill(scenario);

      // 显示倒计时
      this.showCountdown(scenario, ConfigManager.CONSTANTS.AUTO_FILL_COUNTDOWN);

      // 设置自动填充定时器
      state.timer = setTimeout(() => {
        const config = this.getConfig(scenario);
        if (!config) return;

        const $input = $(config.inputSelector);
        const currentContent = $input.val();

        // 确认输入内容没有变化且仍然有效
        if (currentContent === buildId && /^\d{4,}$/.test(currentContent)) {
          if (typeof window.set_branch === "function") {
            window.set_branch(buttonId, dialogId);

            // 对于关闭和重新打开对话框，清空输入框
            if (scenario === 'close' || scenario === 'reopen') {
              $input.val('');
            }
          }
        }
        this.clearCountdown(scenario);
      }, ConfigManager.CONSTANTS.AUTO_FILL_DELAY);
    },

    /**
     * 取消自动填充
     * @param {string} scenario - 场景标识
     */
    cancelAutoFill(scenario) {
      const state = this.scenarios[scenario];
      if (!state) return;

      if (state.timer) {
        clearTimeout(state.timer);
        state.timer = null;
      }
      this.clearCountdown(scenario);
    },

    /**
     * 显示倒计时提示
     * @param {string} scenario - 场景标识
     * @param {number} seconds - 倒计时秒数
     */
    showCountdown(scenario, seconds) {
      const config = this.getConfig(scenario);
      if (!config) return;

      const state = this.scenarios[scenario];
      const $input = $(config.inputSelector);

      // 移除旧的提示
      $(`.auto-fill-hint-${scenario}`).remove();

      // 根据场景选择样式和位置
      if (scenario === 'close' || scenario === 'reopen') {
        // 对于关闭和重新打开对话框：使用行内样式，放在容器前面
        const $hint = $(`
          <div class="auto-fill-hint-${scenario}" style="
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            color: #1976d2;
            z-index: 1000;
            white-space: nowrap;
            display: inline-block;
          ">
            🔄 将在 <span class="countdown">${seconds}</span> 秒后自动获取分支
            <span class="cancel-btn" style="margin-left: 8px; cursor: pointer; color: #f44336;">✕</span>
          </div>
        `);

        // 绑定取消按钮
        $hint.find(".cancel-btn").click(() => {
          this.cancelAutoFill(scenario);
        });

        // 插入到容器的第一个元素前面
        const $container = $input.parent();
        $container.prepend($hint);
      } else {
        // 对于创建对话框：使用绝对定位，放在输入框下方
        const $hint = $(`
          <div class="auto-fill-hint-${scenario}" style="
            position: absolute;
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 12px;
            color: #1976d2;
            z-index: 1000;
            margin-top: 2px;
            white-space: nowrap;
          ">
            🔄 将在 <span class="countdown">${seconds}</span> 秒后自动获取分支
            <span class="cancel-btn" style="margin-left: 8px; cursor: pointer; color: #f44336;">✕</span>
          </div>
        `);

        // 绑定取消按钮
        $hint.find(".cancel-btn").click(() => {
          this.cancelAutoFill(scenario);
        });

        // 使用绝对定位在输入框下方
        $input.parent().css("position", "relative");
        $input.after($hint);
      }

      let remainingSeconds = seconds;
      state.countdownTimer = setInterval(() => {
        remainingSeconds--;
        $(`.auto-fill-hint-${scenario} .countdown`).text(remainingSeconds);

        if (remainingSeconds <= 0) {
          this.clearCountdown(scenario);
        }
      }, 1000);
    },

    /**
     * 清除倒计时
     * @param {string} scenario - 场景标识
     */
    clearCountdown(scenario) {
      const state = this.scenarios[scenario];
      if (!state) return;

      if (state.countdownTimer) {
        clearInterval(state.countdownTimer);
        state.countdownTimer = null;
      }
      $(`.auto-fill-hint-${scenario}`).fadeOut(200, function () {
        $(this).remove();
      });
    },

    /**
     * 获取场景配置
     * @param {string} scenario - 场景标识
     * @returns {Object|null} 配置对象
     */
    getConfig(scenario) {
      const configs = {
        'create': {
          inputSelector: "#customfield_10303"
        },
        'close': {
          inputSelector: "#build_id_close"
        },
        'reopen': {
          inputSelector: "#build_id_open"
        }
      };
      return configs[scenario] || null;
    }
  }
};

// ======== jira-module.js ========
/**
 * Jira模块核心逻辑 - 简化版本
 * 处理Jira相关的主要功能
 */
const JiraModule = {
  timerId: null,
  syncStopped: false,  // 创建停止标志
  wechatSyncChecked: false,  // 企业微信文档创建UI是否已检查过
  branchButtonAdded: false,  // 分支跳转按钮是否已添加
  platformButtonsAdded: false,  // 创建问题对话框中的平台切换按钮是否已添加

  /**
   * 初始化 Jira 模块
   * 必须在页面加载时调用，仅在 Jira 域名下运行
   * @public
   */
  init() {
    if (!Utils.url.isDomain(ConfigManager.CONSTANTS.DOMAINS.JIRA)) {
      console.error("❌ 不是Jira域名，退出初始化");
      return;
    }
    console.log('[企业微信] JiraModule初始化完成，添加企业微信文档创建功能');
    this.startMainLoop();
  },

  /**
   * 启动主循环，定期检查并添加页面元素
   * 使用 setInterval 轮询，间隔由 REFRESH_INTERVAL 控制
   * @private
   */
  startMainLoop() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.timerId = setInterval(() => {
      this.checkAndAddElements();
    }, ConfigManager.CONSTANTS.REFRESH_INTERVAL);
  },

  /**
   * 检查并添加各种 UI 元素
   * 这是主循环的核心方法，负责：
   * 1. 重置状态标志位（当按钮/对话框消失时）
   * 2. 添加分支跳转按钮
   * 3. 添加创建问题对话框的平台切换按钮
   * 4. 添加企业微信文档创建功能
   * 5. 添加关闭/重新打开对话框的按钮组（在主循环中检查）
   * @private
   */
  checkAndAddElements() {
    const elements = this.getPageElements();

    // 如果按钮已添加，但当前页面不存在按钮，重置标志位
    if (this.branchButtonAdded && !elements.searchBtnCreate) {
      this.branchButtonAdded = false;
    }

    // 重置平台按钮标志位当创建对话框关闭时
    // 使用 :visible 选择器更准确地检测对话框状态
    if (this.platformButtonsAdded) {
      const $createDialog = $("#create-issue-dialog");
      if ($createDialog.length === 0 || !$createDialog.is(":visible")) {
        console.log('[平台按钮] Dialog已关闭或不可见，重置标志位');
        this.platformButtonsAdded = false;
      }
    }

    // 如果分支按钮已经添加过，跳过分支按钮检测，但继续执行其他逻辑
    if (!this.branchButtonAdded) {
      if (!elements.searchBtnCreate) {
        this.addJiraBranchNavigationButton();
        Utils.storage.setValue("platform", $("#customfield_10301-val").text().trim());

        // 标记按钮已添加
        this.branchButtonAdded = true;
      } else {
        // 按钮已存在，也标记为已添加，避免后续检测
        this.branchButtonAdded = true;
      }
    }

    // 创建问题时添加按钮（函数内部会检查对话框是否打开）
    this.addCreateIssueButtons();

    if (elements.commentToolbar) {
      this.handleCommentToolbar();
    }

    // 添加LogWork标签功能
    this.addLogWorkDropdown();

    // 添加企业微信文档创建功能
    // 检查控件是否真的存在，如果不存在则重新添加
    const container = document.getElementById("wechat-sync-container");
    if (!container) {
      this.wechatSyncChecked = false;
    }

    if (!this.wechatSyncChecked) {
      // 只在Jira域名下尝试添加
      if (window.location.hostname.includes('jira.meitu.com')) {
        this.addWeChatSyncUI();
      }

      this.wechatSyncChecked = true;
    }

    // ⭐ 关键修复：在主循环中检查并添加关闭/重新打开对话框的按钮组
    // 恢复旧版本的稳定逻辑：不依赖点击事件，而是在主循环中检查对话框是否存在
    this.addCloseReopenButtons();

    this.bindEvents();
  },

  getPageElements() {
    const fieldIds = ConfigManager.CONSTANTS.JIRA_FIELD_IDS;
    return {
      searchBtnCreate: Utils.dom.safeGetElement(fieldIds.SEARCH_BTN_CREATE),
      changeSideButton: Utils.dom.safeGetElement(fieldIds.CHANGE_SIDE_BUTTON),
      buildId: Utils.dom.safeGetElement(fieldIds.BUILD_ID),
      stepText: Utils.dom.safeGetElement(fieldIds.STEP_TEXT),
      createDialog: Utils.dom.safeGetElement(fieldIds.CREATE_DIALOG),
      closeDialog: Utils.dom.safeGetElement(fieldIds.CLOSE_DIALOG),
      reopenDialog: Utils.dom.safeGetElement(fieldIds.REOPEN_DIALOG),
      commentToolbar: Utils.dom.safeGetElement(fieldIds.COMMENT_TOOLBAR),
    };
  },

  addJiraBranchNavigationButton() {
    if (typeof addButtonJira === "function") {
      addButtonJira();
    }
  },

  /**
   * 添加创建问题对话框中的平台切换按钮
   * 使用状态跟踪避免重复添加：
   * - 如果 platformButtonsAdded 为 true，跳过平台按钮添加，但继续执行其他逻辑
   * - 添加成功后设置 platformButtonsAdded = true
   * - 对话框关闭时重置标志位（在 checkAndAddElements 中）
   *
   * 添加的按钮：iOS, Android, Web, 再提一个
   * @private
   */
  addCreateIssueButtons() {
    // ⚠️ 关键检查：只在创建对话框真正打开时才执行
    const $createDialog = $("#create-issue-dialog");
    if ($createDialog.length === 0 || !$createDialog.is(":visible")) {
      // 对话框不存在或不可见，跳过所有操作
      return;
    }

    // 添加平台切换按钮（iOS、Android、Web、再提一个）
    // 如果已经添加过，跳过这一部分
    if (!this.platformButtonsAdded) {
      console.log('[平台按钮] 创建对话框已打开，开始添加平台切换按钮...');

      const iosBtn = Utils.dom.safeGetElement("change_side_ios");
      const androidBtn = Utils.dom.safeGetElement("change_side_android");
      const webBtn = Utils.dom.safeGetElement("change_side_web");
      const onceAgainBtn = Utils.dom.safeGetElement("once-again");

      // 检查所有按钮是否都已存在，任一不存在则重新添加
      if (!iosBtn || !androidBtn || !webBtn || !onceAgainBtn) {
        // 使用正确的选择器：在对话框内查找按钮容器
        const $buttonsContainer = $createDialog.find(".buttons-container.form-footer .buttons");

        if ($buttonsContainer.length > 0) {
          console.log('[创建对话框] 找到按钮容器');

          // 在"创建另一个"之前插入平台切换按钮
          const $createAnother = $createDialog.find("#qf-create-another");
          const buttons = [
            { className: "ios aui-button", id: "change_side_ios", text: "iOS" },
            { className: "android aui-button", id: "change_side_android", text: "Android" },
            { className: "web aui-button", id: "change_side_web", text: "Web" },
            { className: "once-again aui-button", id: "once-again", text: "再提一个" }
          ];

          buttons.forEach((btnConfig) => {
            // 只添加不存在的按钮
            if (!Utils.dom.safeGetElement(btnConfig.id)) {
              const btn = $(`<button class="${btnConfig.className}" id="${btnConfig.id}" type="button">${btnConfig.text}</button>`);
              if ($createAnother.length > 0) {
                $createAnother.parent().before(btn);
              } else {
                $buttonsContainer.append(btn);
              }
              console.log(`[平台按钮] 添加按钮: ${btnConfig.text}`);
            }
          });

          // 验证按钮是否成功添加，然后设置标志位
          if (Utils.dom.safeGetElement("change_side_ios")) {
            this.platformButtonsAdded = true;
            console.log('[平台按钮] 所有平台切换按钮已添加');
          }
        } else {
          console.warn('[创建对话框] 未找到按钮容器 .buttons-container.form-footer .buttons');
        }
      } else {
        // 所有按钮已存在，标记为已添加
        this.platformButtonsAdded = true;
        console.log('[平台按钮] 按钮已存在，标记为已添加');
      }
    }

    // 添加获取分支按钮（每次都检查，不使用状态跟踪）
    // ⚠️ 关键修复：在对话框内检查按钮是否存在，避免误判
    const buildIdField = Utils.dom.safeGetElement("customfield_10303");
    const $getBranchBtn = $createDialog.find("#get_branch_btn");

    if (buildIdField && $getBranchBtn.length === 0) {
      const branchSpan = Utils.button.addLabelAfter("#customfield_10303", "customfield_10304");
      Utils.button.addBranchButtons(branchSpan);
      console.log('[获取分支] 已添加获取分支和上个分支按钮');
    }

    // 添加重置步骤按钮（每次都检查，不使用状态跟踪）
    // ⚠️ 同样在对话框内检查按钮是否存在
    const stepTextField = Utils.dom.safeGetElement("customfield_10203");
    const $resetStepBtn = $createDialog.find("#reset_step");

    if (stepTextField && $resetStepBtn.length === 0) {
      Utils.button.addLabelAfter("#customfield_10203", "customfield_10204", {
        className: "aui-button",
        text: "重置步骤",
        id: "reset_step"
      });
      console.log('[重置步骤] 已添加重置步骤按钮');
    }

    this.hideUIForStarii();
    this.fillBuildIdAuto();
  },

  hideUIForStarii() {
    ConfigManager.UI_HIDE_CONFIGS.forEach((config) => {
      Utils.ui.hideIf(config.condition, config);
    });
  },

  fillBuildIdAuto() {
    BranchUtils.AutoFillManager.setupAutoFill({
      scenario: 'create',
      inputSelector: "#customfield_10303",
      buttonId: "get_branch_btn",
      dialogId: "create-issue-dialog"
    });
  },

  handleCloseReopenDialog() {
    setTimeout(() => {
      // 检查按钮是否已存在
      const isBtnClose = Utils.dom.safeGetElement("get_branch_btn_close");
      if (isBtnClose) {
        return;
      }

      // 创建所有控件元素
      const branchSpanClose = $('<span id="close_text">输入id：</span>');
      const inputTextClose = $('<input type="text" class="text medium-field" id="build_id_close">');
      const $container = $('<span></span>');

      // 将所有控件添加到容器中
      $container.append(branchSpanClose).append(inputTextClose);

      // 手动添加获取分支、上次分支和上次填写按钮，使用正确的 ID
      const getBranchBtn = $('<button class="aui-button" id="get_branch_btn_close" type="button">获取分支</button>');
      const lastBranchBtn = $('<button class="aui-button" id="last_branch_btn_close" type="button">上次分支</button>');
      const lastFillBtn = $('<button class="aui-button" id="last_fill_btn_close" type="button">上次填写</button>');
      $container.append(getBranchBtn).append(lastBranchBtn).append(lastFillBtn);

      // 为"上次填写"按钮添加右边距
      lastFillBtn.css("margin-right", "20px");

      // 在提交按钮之前一次性插入所有控件
      const $submitBtn = $("#issue-workflow-transition-submit");
      if ($submitBtn.length > 0) {
        $submitBtn.before($container);
      }

      // 设置自动填充
      BranchUtils.AutoFillManager.setupAutoFill({
        scenario: 'close',
        inputSelector: "#build_id_close",
        buttonId: "get_branch_btn_close",
        dialogId: "workflow-transition-21-dialog"
      });
    }, ConfigManager.CONSTANTS.DIALOG_DELAY_MEDIUM);
  },

  handleCommentToolbar() {
    const preTextSpan = $('<span id="pre_text">输入id：</span>');
    const preTextSpanElement = Utils.dom.safeGetElement("pre_text");
    const inputText = $('<input type="text" class="text medium-field" id="input_text">');

    setTimeout(() => {
      if (!preTextSpanElement && !Utils.dom.safeGetElement("workflow-transition-21-dialog")) {
        const branchSpan = $("<span></span>");
        branchSpan.append(preTextSpan).append(inputText);
        Utils.button.addBranchButtons(branchSpan);
        $(".security-level .current-level").after(branchSpan);
      }
    }, ConfigManager.CONSTANTS.DIALOG_DELAY_SHORT);
  },

  /**
   * 添加关闭/重新打开对话框的按钮组
   * ⭐ 恢复旧版本的稳定逻辑：在主循环中检查对话框是否存在
   * 而不是依赖点击事件来触发按钮添加
   *
   * 这样可以确保：
   * 1. 对话框打开时，按钮会被正确添加
   * 2. 即使对话框已经打开，也会在下次主循环时添加按钮
   * 3. 不依赖点击事件的时序
   * @private
   */
  addCloseReopenButtons() {
    // 检查关闭问题和重新打开对话框是否存在
    const $closeDialog = $("#workflow-transition-21-dialog");
    const $reopenDialog = $("#workflow-transition-31-dialog");

    // 如果对话框不存在，跳过
    if ($closeDialog.length === 0 && $reopenDialog.length === 0) {
      return;
    }

    // 处理关闭问题对话框
    if ($closeDialog.length > 0) {
      const isBtnClose = Utils.dom.safeGetElement("get_branch_btn_close");
      if (!isBtnClose) {
        // 对话框存在但按钮不存在，添加按钮
        // 使用 setTimeout 确保对话框完全打开
        setTimeout(() => {
          this.handleCloseReopenDialog();
        }, ConfigManager.CONSTANTS.DIALOG_DELAY_MEDIUM);
      }
    }

    // 处理重新打开问题对话框
    if ($reopenDialog.length > 0) {
      const isBtnOpen = Utils.dom.safeGetElement("get_branch_btn_open");
      if (!isBtnOpen) {
        // 对话框存在但按钮不存在，添加按钮
        // 使用 setTimeout 确保对话框完全打开
        setTimeout(() => {
          this.handleReopenDialog();
        }, ConfigManager.CONSTANTS.DIALOG_DELAY_MEDIUM);
      }
    }
  },

  bindEvents() {
    // 事件绑定已移至 EventManager.registerGlobalEvents() 中统一管理
    // 不需要在这里单独绑定关闭/重新打开对话框的点击事件
    // 因为按钮添加逻辑已改为主循环中的 addCloseReopenButtons()
  },

  /**
   * 处理重新打开问题的 dialog
   */
  handleReopenDialog() {
    setTimeout(() => {
      // 检查按钮是否已存在
      const isBtnOpen = Utils.dom.safeGetElement("get_branch_btn_open");
      if (isBtnOpen) {
        return;
      }

      // 创建所有控件元素
      const branchSpanOpen = $('<span id="open_text">输入id：</span>');
      const inputTextOpen = $('<input type="text" class="text medium-field" id="build_id_open">');
      const $container = $('<span></span>');

      // 将所有控件添加到容器中
      $container.append(branchSpanOpen).append(inputTextOpen);

      // 手动添加获取分支和上次分支按钮，使用正确的 ID
      const getBranchBtn = $('<button class="aui-button" id="get_branch_btn_open" type="button">获取分支</button>');
      const lastBranchBtn = $('<button class="aui-button" id="last_branch_btn_open" type="button">上次分支</button>');
      $container.append(getBranchBtn).append(lastBranchBtn);

      // 为"上次分支"按钮添加右边距
      lastBranchBtn.css("margin-right", "20px");

      // 在提交按钮之前一次性插入所有控件
      const $submitBtn = $("#issue-workflow-transition-submit");
      if ($submitBtn.length > 0) {
        $submitBtn.before($container);
      }

      // 设置自动填充
      BranchUtils.AutoFillManager.setupAutoFill({
        scenario: 'reopen',
        inputSelector: "#build_id_open",
        buttonId: "get_branch_btn_open",
        dialogId: "workflow-transition-31-dialog"
      });
    }, ConfigManager.CONSTANTS.DIALOG_DELAY_MEDIUM);
  },

  handleBranchButtonClick(event) {
    setTimeout(() => {
      let parentNode = event.target.parentNode;
      while (parentNode != null) {
        if (parentNode.hasAttribute("id")) {
          break;
        }
        parentNode = parentNode.parentNode;
      }

      const parentId = parentNode ? parentNode.getAttribute("id") : null;
      const selfId = event.target.id;

      if (typeof window.set_branch === "function") {
        window.set_branch(selfId, parentId);
      }
    }, 500);
  },

  handleResetStepClick() {
    const defaultText = "[预置条件]\n\n[步骤]\n\n[结果]\n\n[期望]\n\n[备注机型]\n\n[BUG出现频次]\n\n\n";
    const stepElement = Utils.dom.safeGetElement("customfield_10203");
    if (stepElement) {
      stepElement.value = defaultText;
    }
  },

  handleSearchSpanClick(fieldId) {
    if (typeof getBuildId === "function" && typeof getBaseUrl === "function") {
      const buildId = getBuildId(fieldId);
      Utils.storage.setValue("platform", $("#customfield_10301-val").text().trim());
      Utils.common.sleep(500).then(() => {
        const targetUrl = getBaseUrl() + buildId;
        window.open(targetUrl);
      });
    }
  },

  handlePreTextClick() {
    // 手动点击按钮时，取消关闭问题场景的自动填充倒计时
    BranchUtils.AutoFillManager.cancelAutoFill('close');

    const textArea = $(".jira-dialog-content #comment");

    if (!textArea.length) {
      console.warn("[上次填写] 未找到评论文本框");
      return;
    }

    const savedText = Utils.storage.getValue("closeText", "");
    textArea.val(savedText).focus();
    console.log("[上次填写] 已填充上次保存的内容");
  },

  handleWorkflowSubmit() {
    const submitButton = $("#issue-workflow-transition-submit");
    const buttonText = submitButton.val()?.trim() || "";

    if (buttonText !== "关闭问题") {
      return;
    }

    const textArea = $(".jira-dialog-content #comment");
    const content = textArea.val()?.trim() || "";

    if (content) {
      Utils.storage.setValue("closeText", content);
      console.log("[关闭问题] 已保存评论内容");
    }
  },

  /**
   * 添加 LogWork 打卡标签下拉框
   * 在记录工作时间对话框中添加类别选择下拉框
   * 选择类别后自动插入格式化文本到评论文本框
   * @private
   */
  addLogWorkDropdown() {
    // 查找"记录"按钮
    const logButton = Utils.dom.safeGetElement("log-work-submit");

    // 检查下拉框是否已存在
    const existingDropdown = Utils.dom.safeGetElement("work-hours-dropdown");

    // 只有当按钮存在且下拉框不存在时才创建
    if (logButton && !existingDropdown) {
      // 创建下拉框
      const dropdown = document.createElement("select");
      dropdown.id = "work-hours-dropdown";
      dropdown.className = "aui-button";
      dropdown.style.marginRight = "10px";

      // 从配置中获取类别
      const categories = ConfigManager.CONSTANTS.LOG_WORK_CATEGORIES;

      // 添加一个默认空选项
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "选择类别";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      dropdown.appendChild(defaultOption);

      // 添加"全部"选项
      const allOption = document.createElement("option");
      allOption.value = "all";
      allOption.text = "全部";
      dropdown.appendChild(allOption);

      // 添加类别选项
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.text = category;
        dropdown.appendChild(option);
      });

      // 将下拉框插入到按钮前面
      logButton.parentNode.insertBefore(dropdown, logButton);

      // 添加change事件监听器
      dropdown.addEventListener("change", function () {
        // 获取选中的值
        const selectedValue = this.value;

        // 更精确地定位当前工作记录对话框中的comment文本区域
        // 首先找到当前对话框，然后在其中查找textarea
        const dialogContainer = logButton.closest(".aui-dialog2, .jira-dialog");
        if (dialogContainer) {
          const commentTextarea = dialogContainer.querySelector(
            "textarea.textarea.long-field.wiki-textfield#comment"
          );
          if (commentTextarea) {
            // 获取当前光标位置
            const startPos = commentTextarea.selectionStart;
            const endPos = commentTextarea.selectionEnd;

            // 获取当前文本内容
            const currentText = commentTextarea.value;
            // 构建要插入的文本
            let insertedText;

            // 如果选择"全部"，则插入所有类别
            if (selectedValue === "all") {
              insertedText = "";
              categories.forEach((category) => {
                insertedText += "【" + category + "】" + ": h\n";
              });
              // 移除最后一个换行符
              insertedText = insertedText.trim();
            } else {
              insertedText = "【" + selectedValue + "】" + ": h";
            }

            // 在光标位置插入选中的值
            const newText =
              currentText.substring(0, startPos) +
              insertedText +
              currentText.substring(endPos);

            // 更新文本区域的值
            commentTextarea.value = newText;

            // 设置光标位置在插入文本之后，-1可以定位到"h"之前
            const newCursorPos = startPos + insertedText.length - 1;
            commentTextarea.setSelectionRange(newCursorPos, newCursorPos);

            // 聚焦文本区域
            commentTextarea.focus();

            // 重置下拉框为默认选项
            this.selectedIndex = 0;
          }
        }
      });
    }
  },

  /**
   * 添加企业微信文档创建 UI 组件
   * 在过滤器页面添加输入框和按钮，用于从 Jira 过滤器创建企业微信智能表格
   * 组件包括：URL 输入框、创建按钮、状态显示、结果链接
   * @private
   */
  addWeChatSyncUI() {
    // 检查是否已经添加过
    if (document.getElementById("wechat-sync-container")) {
      return;
    }

    // 查找收藏按钮（兼容已收藏和未收藏两种状态）
    const favoriteButton = document.querySelector('a.fav-link[original-title*="收藏过滤器"]');

    if (!favoriteButton) {
      // 未找到收藏按钮，静默返回（可能不在过滤器页面）
      return;
    }

    console.log('[企业微信] 找到收藏按钮，开始创建UI组件...');

    // 创建容器（使用flex布局横向排列）
    const container = document.createElement('div');
    container.id = 'wechat-sync-container';
    container.style.display = 'inline-flex';
    container.style.alignItems = 'center';
    container.style.marginLeft = '20px';

    // 创建按钮（移除输入框，直接使用当前页面URL）
    const button = document.createElement('button');
    button.id = 'wecom-sync-btn';
    button.innerText = '创建智能文档';
    button.style.marginLeft = '0';
    button.style.padding = '4px 10px';
    button.style.fontSize = '12px';
    button.style.backgroundColor = '#fff';
    button.style.color = '#424242';
    button.style.border = '1px solid #e0e0e0';
    button.style.borderRadius = '3px';
    button.style.cursor = 'pointer';

    // 创建问号提示图标
    const helpIcon = document.createElement('span');
    helpIcon.id = 'wecom-help-icon';
    helpIcon.innerText = '?';
    helpIcon.style.display = 'inline-block';
    helpIcon.style.marginLeft = '6px';
    helpIcon.style.width = '16px';
    helpIcon.style.height = '16px';
    helpIcon.style.lineHeight = '16px';
    helpIcon.style.textAlign = 'center';
    helpIcon.style.fontSize = '11px';
    helpIcon.style.backgroundColor = '#e0e0e0';
    helpIcon.style.color = '#757575';
    helpIcon.style.borderRadius = '50%';
    helpIcon.style.cursor = 'pointer';
    helpIcon.style.position = 'relative';

    // 创建tooltip
    const tooltip = document.createElement('span');
    tooltip.className = 'wecom-tooltip';
    tooltip.innerText = '点击生成高优先bug文档, 数据取自当前页面';
    tooltip.style.position = 'absolute';
    tooltip.style.bottom = '100%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.style.marginBottom = '8px';
    tooltip.style.padding = '6px 10px';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    tooltip.style.color = '#fff';
    tooltip.style.fontSize = '12px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.borderRadius = '4px';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
    tooltip.style.transition = 'opacity 0.2s, visibility 0.2s';
    tooltip.style.zIndex = '1000';

    // 添加小箭头
    const arrow = document.createElement('span');
    arrow.style.position = 'absolute';
    arrow.style.top = '100%';
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';
    arrow.style.border = '5px solid transparent';
    arrow.style.borderTopColor = 'rgba(0, 0, 0, 0.85)';
    tooltip.appendChild(arrow);

    helpIcon.appendChild(tooltip);

    // 鼠标悬停显示tooltip
    helpIcon.addEventListener('mouseenter', function() {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });

    helpIcon.addEventListener('mouseleave', function() {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });

    // 创建状态显示（显示在按钮右侧）
    const status = document.createElement('div');
    status.id = 'wecom-sync-status';
    status.style.marginLeft = '10px';
    status.style.padding = '4px 8px';
    status.style.fontSize = '12px';
    status.style.display = 'none';

    // 创建结果显示（显示在状态右侧）
    const result = document.createElement('div');
    result.id = 'wecom-sync-result';
    result.style.marginLeft = '10px';
    result.style.padding = '4px 8px';
    result.style.fontSize = '12px';
    result.style.display = 'none';

    // 组装组件（添加按钮、问号图标、状态和结果）
    const buttonWrapper = document.createElement('span');
    buttonWrapper.style.display = 'inline-block';
    buttonWrapper.appendChild(button);
    buttonWrapper.appendChild(helpIcon);

    container.appendChild(buttonWrapper);
    container.appendChild(status);
    container.appendChild(result);

    // 插入到收藏按钮后面
    favoriteButton.parentNode.insertBefore(container, favoriteButton.nextSibling);

    console.log('[企业微信] UI组件已创建并插入页面');

    // 绑定点击事件
    this.bindWeChatSyncEvents();
    console.log('[企业微信] 事件监听器已绑定');
  },

  /**
   * 绑定企业微信文档创建事件
   */
  bindWeChatSyncEvents() {
    const self = this;

    document.getElementById('wecom-sync-btn').addEventListener('click', async function() {
      var btn = document.getElementById('wecom-sync-btn');

      // 如果正在创建，点击则停止
      if (btn.innerText === '停止') {
        self.syncStopped = true;
        self.showSyncStatus('error', '正在停止创建...');
        btn.disabled = true;
        btn.innerText = '停止中...';
        return;
      }

      // 重置停止标志
      self.syncStopped = false;

      // 隐藏之前的打开文档链接
      var resultDiv = document.getElementById('wecom-sync-result');
      resultDiv.style.display = 'none';

      // 使用当前页面URL作为过滤器URL
      const filterUrl = window.location.href;

      // 验证URL格式
      if (filterUrl.indexOf('jira.meitu.com') === -1) {
        self.showSyncStatus('error', '当前页面不是有效的Jira过滤器页面');
        return;
      }

      // 设置按钮为停止状态（使用浅红色）
      btn.innerText = '停止';
      btn.style.backgroundColor = '#ef5350';
      btn.style.color = 'white';

      try {
        // 1. 爬取Bug信息
        self.showSyncStatus('info', '正在爬取Jira Bug信息...');

        var bugs = await JiraBugScraper.scrapeBugsFromFilter(
          filterUrl,
          function(progress) {
            self.showSyncStatus('info', progress);
          },
          function() { return self.syncStopped; }  // 停止检查函数
        );

        if (self.syncStopped) {
          throw new Error('用户取消创建');
        }

        if (bugs.length === 0) {
          throw new Error('未找到任何Bug');
        }

        self.showSyncStatus('success', '成功爬取 ' + bugs.length + ' 个Bug');

        // 2. 创建企业微信文档
        self.showSyncStatus('info', '正在创建企业微信智能表格...');

        // 从过滤器URL中提取过滤器名称
        var filterName = self._extractFilterName(filterUrl);
        var docTitle = filterName + ' - Bug统计表';

        var result = await WeChatWorkAPI.createSmartTableDoc(
          docTitle,
          bugs,
          function() { return self.syncStopped; }  // 停止检查函数
        );

        if (self.syncStopped) {
          throw new Error('用户取消创建');
        }

        // 显示成功结果
        self.showSyncStatus('success', '创建成功！');
        self.showSyncResult(result);

      } catch (error) {
        console.error('[企业微信文档创建] 错误:', error);

        if (error.message === '用户取消创建') {
          self.showSyncStatus('error', '已取消创建');
        } else {
          self.showSyncStatus('error', '创建失败: ' + error.message);
        }
      } finally {
        // 恢复按钮到初始白色状态
        var btn = document.getElementById('wecom-sync-btn');
        btn.disabled = false;
        btn.innerText = '创建智能文档';
        btn.style.backgroundColor = '#fff';
        btn.style.color = '#424242';
        self.syncStopped = false;
      }
    });
  },

  /**
   * 显示创建状态
   */
  showSyncStatus(type, message) {
    var status = document.getElementById('wecom-sync-status');
    status.innerText = message;
    status.style.display = 'block';

    // 根据类型设置样式
    if (type === 'error') {
      status.style.background = '#ffebee';
      status.style.color = '#c62828';
    } else if (type === 'success') {
      status.style.background = '#e8f5e9';
      status.style.color = '#2e7d32';
    } else {
      status.style.background = '#e3f2fd';
      status.style.color = '#1565c0';
    }
  },

  /**
   * 显示创建结果（文档链接）
   */
  showSyncResult(result) {
    var resultDiv = document.getElementById('wecom-sync-result');

    if (result.url) {
      resultDiv.innerHTML = '<a href="' + result.url + '" target="_blank" style="color: #2196f3; text-decoration: underline;">打开文档</a>';
      resultDiv.style.display = 'block';
    }
  },

  /**
   * 从URL中提取过滤器名称
   */
  _extractFilterName(url) {
    try {
      var urlObj = new URL(url);
      var searchParams = urlObj.searchParams;

      // 尝试获取过滤器名称
      var filterName = searchParams.get('filtername') ||
                      searchParams.get('name') ||
                      'Jira过滤器';

      return decodeURIComponent(filterName);
    } catch (error) {
      return 'Jira过滤器';
    }
  }
};

// 切换Bug平台的函数
window.changeBugPlatform = function changeBugPlatform(platform) {
  var project_name = $("#project-name-val").text().trim(); // 项目名
  switch (project_name) {
    case "美图秀秀":
      if (platform == "iOS") {
        document.getElementById("customfield_10301-2").checked = true;
      } else if (platform == "Android") {
        document.getElementById("customfield_10301-1").checked = true;
      } else if (platform == "Web") {
        document.getElementById("customfield_10301-3").checked = true;
      }
      break;
    case "美图秀秀Starii":
      if (platform == "iOS") {
        document.getElementById("customfield_10301-2").checked = true;
      } else if (platform == "Android") {
        document.getElementById("customfield_10301-1").checked = true;
      } else if (platform == "Web") {
        document.getElementById("customfield_10301-3").checked = true;
      }
      break;
    default:
      if (platform == "iOS") {
        document.getElementById("customfield_10301-2").checked = true;
      } else if (platform == "Android") {
        document.getElementById("customfield_10301-1").checked = true;
      } else if (platform == "Web") {
        document.getElementById("customfield_10301-3").checked = true;
      }
  }

  // 使用版本管理工具类自动选择最接近的版本
  VersionUtils.autoSelectClosestVersion(platform);
};


// ======== jira-bug-scraper.js ========
/**
 * Jira Bug信息爬虫模块
 * 用于爬取Jira过滤器页面中的Bug信息
 */

const JiraBugScraper = {
  // Jira自定义字段ID常量
  DEVELOPER_FIELD_ID: 'customfield_10821', // 开发人员字段的ID
  UNRESOLVED_STATUS: '未解决', // 未解决状态的默认值

  /**
   * 从Jira过滤器URL爬取所有Bug信息
   * @param {string} filterUrl - Jira过滤器URL
   * @param {Function} progressCallback - 进度回调函数
   * @param {Function} shouldStopCallback - 停止检查函数（返回 true 表示应该停止）
   * @returns {Promise<Array>} Bug信息数组
   */
  async scrapeBugsFromFilter(filterUrl, progressCallback, shouldStopCallback) {
    console.log('[Jira爬虫] 开始爬取过滤器页面:', filterUrl);

    try {
      const bugs = [];
      let currentPage = 1;
      let currentUrl = filterUrl;

      // 循环处理每一页
      while (true) {
        // 检查是否应该停止
        if (shouldStopCallback && shouldStopCallback()) {
          console.log('[Jira爬虫] 用户取消爬取');
          throw new Error('用户取消');
        }

        if (progressCallback) {
          progressCallback('正在处理第' + currentPage + '页...');
        }

        console.log('[Jira爬虫] 正在获取第' + currentPage + '页HTML:', currentUrl);

        // 直接获取当前页的HTML
        const html = await this._fetchPageHtml(currentUrl);

        // 解析HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 获取当前页的Bug列表
        const bugLinks = this._getBugLinksFromDocument(doc);
        console.log('[Jira爬虫] 第' + currentPage + '页发现' + bugLinks.length + '个Bug');

        if (bugLinks.length === 0) {
          console.warn('[Jira爬虫] 当前页没有找到Bug，可能已到最后一页');
          break;
        }

        // 逐个处理每个Bug
        for (let i = 0; i < bugLinks.length; i++) {
          // 检查是否应该停止
          if (shouldStopCallback && shouldStopCallback()) {
            console.log('[Jira爬虫] 用户取消爬取');
            throw new Error('用户取消');
          }

          if (progressCallback) {
            progressCallback('正在处理第' + (i + 1) + '/' + bugLinks.length + '个Bug...');
          }

          try {
            const bugInfo = await this._extractBugInfoFromHtml(bugLinks[i]);
            bugs.push(bugInfo);
            console.log('[Jira爬虫] 成功提取Bug: ' + bugInfo.key);
          } catch (error) {
            console.error('[Jira爬虫] 提取Bug失败:', error);
            // 继续处理下一个Bug
          }

          // 短暂延迟避免请求过快
          await this._sleep(300);
        }

        // 检查是否有下一页
        const nextPageUrl = this._getNextPageUrl(doc);
        if (!nextPageUrl) {
          console.log('[Jira爬虫] 没有下一页了，爬取完成');
          break;
        }

        currentUrl = nextPageUrl;
        currentPage++;
        await this._sleep(500);
      }

      console.log('[Jira爬虫] 爬取完成，共获取' + bugs.length + '个Bug');
      return bugs;
    } catch (error) {
      console.error('[Jira爬虫] 爬取异常:', error);
      throw error;
    }
  },

  /**
   * 从DOM文档中获取Bug链接列表
   * @private
   * @param {Document} doc - DOM文档对象
   * @returns {Array} Bug链接数组
   */
  _getBugLinksFromDocument(doc) {
    console.log('[Jira爬虫] 正在查找Bug链接...');

    // 尝试多个可能的选择器
    const selectors = [
      'td.issuekey a.issue-link',
      '.issue-list tr.issuerow td.issuekey a',
      '.results-issue-table tr.issuerow td.issuekey a',
      'a[href*="/browse/"]'
    ];

    let links = [];
    let usedSelector = '';

    // 尝试每个选择器直到找到链接
    for (const selector of selectors) {
      const found = Array.from(doc.querySelectorAll(selector));
      console.log('[Jira爬虫] 尝试选择器 "' + selector + '": 找到 ' + found.length + ' 个元素');

      if (found.length > 0) {
        links = found;
        usedSelector = selector;
        break;
      }
    }

    if (links.length === 0) {
      console.error('[Jira爬虫] 未找到任何Bug链接！');
      return [];
    }

    console.log('[Jira爬虫] 使用选择器 "' + usedSelector + '" 找到 ' + links.length + ' 个候选链接');

    // 验证：确保链接格式正确
    const validLinks = links.filter(a => {
      return a.href &&
             a.href.includes('/browse/') &&
             a.href.match(/\/browse\/[A-Z]+-\d+/);
    });

    console.log('[Jira爬虫] 验证后有效链接: ' + validLinks.length + ' 个');

    if (validLinks.length !== links.length) {
      console.warn('[Jira爬虫] 过滤掉 ' + (links.length - validLinks.length) + ' 个无效链接');
    }

    // 去重：使用 Map 按照 Bug key 去重（保留第一次出现的）
    const uniqueLinksMap = new Map();
    validLinks.forEach(a => {
      const match = a.href.match(/\/browse\/([A-Z]+-\d+)/);
      if (match) {
        const bugKey = match[1];
        if (!uniqueLinksMap.has(bugKey)) {
          uniqueLinksMap.set(bugKey, a);
        }
      }
    });

    const uniqueLinks = Array.from(uniqueLinksMap.values());
    console.log('[Jira爬虫] 去重后链接: ' + uniqueLinks.length + ' 个');

    if (uniqueLinks.length !== validLinks.length) {
      console.warn('[Jira爬虫] 过滤掉 ' + (validLinks.length - uniqueLinks.length) + ' 个重复链接');
    }

    return uniqueLinks;
  },

  /**
   * 提取单个Bug的详细信息（从HTML）
   * @private
   * @param {HTMLAnchorElement} bugLink - Bug链接元素
   * @returns {Promise<Object>} Bug信息
   */
  async _extractBugInfoFromHtml(bugLink) {
    // 获取Bug链接和标题
    const bugUrl = bugLink.href;
    const bugKeyMatch = bugUrl.match(/\/browse\/([A-Z]+-\d+)/);
    const bugKey = bugKeyMatch ? bugKeyMatch[1] : '';

    console.log('[Jira爬虫] 正在获取Bug详情:', bugKey);

    // 使用GM_xmlhttpRequest直接获取Bug详情页HTML
    const html = await this._fetchPageHtml(bugUrl);

    // 解析HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 提取Bug信息
    const bugInfo = this._parseBugDetails(doc, bugKey, bugUrl);

    return bugInfo;
  },

  /**
   * 获取下一页的URL
   * @private
   * @param {Document} doc - DOM文档对象
   * @returns {string|null} 下一页的URL，如果没有则返回null
   */
  _getNextPageUrl(doc) {
    // 查找下一页的链接
    const nextButton = doc.querySelector('a[aria-label="Next"], .pagination-next, .next-page, a.next');

    if (!nextButton) {
      return null;
    }

    // 检查是否禁用
    if (nextButton.hasAttribute('disabled') ||
        nextButton.classList.contains('disabled') ||
        nextButton.style.display === 'none') {
      return null;
    }

    // 获取href
    const nextUrl = nextButton.getAttribute('href');

    if (!nextUrl) {
      return null;
    }

    // 如果是相对路径，转换为绝对路径
    if (nextUrl.startsWith('/')) {
      return window.location.origin + nextUrl;
    }

    return nextUrl;
  },

  /**
   * 获取页面HTML内容
   * @private
   * @param {string} url - 页面URL
   * @returns {Promise<string>} HTML内容
   */
  _fetchPageHtml(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (response) => {
          resolve(response.responseText);
        },
        onerror: (error) => {
          reject(new Error('获取页面失败: ' + error.status));
        }
      });
    });
  },

  /**
   * 解析Bug详情页面
   * @private
   * @param {Document} doc - 文档对象
   * @param {string} bugKey - Bug编号
   * @param {string} bugUrl - Bug链接
   * @returns {Object} Bug信息
   */
  _parseBugDetails(doc, bugKey, bugUrl) {
    const bugInfo = {
      key: bugKey,
      url: bugUrl,
      created: '',
      resolved: '',
      found_time: '',
      summary: '',
      reporterAbbr: '',
      reporterName: '',
      developerAbbr: '',
      developerName: '',
      parseError: false // 标记解析是否成功
    };

    try {
      // 创建时间 - 只取日期部分
      const createdContainer = doc.getElementById('created-val');
      if (createdContainer) {
        const datetimeElem = createdContainer.querySelector('[datetime]');
        if (datetimeElem) {
          const datetime = datetimeElem.getAttribute('datetime');
          bugInfo.created = datetime ? datetime.split('T')[0] : '';
        }
      }

      // 解决时间 - 在 resolutiondate-val 节点下
      const resolvedContainer = doc.getElementById('resolutiondate-val');
      if (resolvedContainer) {
        const timeMatch = resolvedContainer.textContent.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}/);
        bugInfo.resolved = timeMatch ? timeMatch[0] : this.UNRESOLVED_STATUS;
      }

      // 发现时间 - 在 created-val 节点下的完整时间
      if (createdContainer) {
        const timeMatch = createdContainer.textContent.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}/);
        bugInfo.found_time = timeMatch ? timeMatch[0] : '';
      }

      // Bug主题 - 提取 summary-val 的 h1 内容
      const summaryContainer = doc.getElementById('summary-val');

      if (summaryContainer) {
        const h1Elem = summaryContainer.querySelector('h1');

        // 如果 h1 不存在，尝试其他方式提取
        if (h1Elem) {
          bugInfo.summary = h1Elem.textContent.trim();
        } else {
          // summary-val 本身可能就是 h1 标签，直接获取文本
          bugInfo.summary = summaryContainer.textContent.trim();
        }
      }

      // 测试人员信息 - 从 reporter-val
      const reporterContainer = doc.getElementById('reporter-val');
      if (reporterContainer) {
        const userHover = reporterContainer.querySelector('.user-hover');
        if (userHover) {
          // 提取缩写（rel 属性）
          const rel = userHover.getAttribute('rel') || '';
          if (rel) {
            bugInfo.reporterAbbr = rel.includes('@') ? rel.split('@')[0] : rel;
          }

          // 提取显示名称
          // 方式1: 从 data-user 属性
          const dataUserAttr = reporterContainer.getAttribute('data-user');
          if (dataUserAttr) {
            const nameMatch = dataUserAttr.match(/"displayName":"([^"]*)"/);
            if (nameMatch) {
              bugInfo.reporterName = nameMatch[1];
            }
          }

          // 方式2: 从文本内容（中文字符）
          if (!bugInfo.reporterName) {
            const chineseMatch = reporterContainer.textContent.match(/[一-龥]{2,4}/);
            if (chineseMatch) {
              bugInfo.reporterName = chineseMatch[0];
            }
          }
        }
      }

      // 开发人员信息 - 先尝试从 customfield_10821（开发人员字段）获取
      let devFound = false;
      const devContainer = doc.querySelector('[id*="' + this.DEVELOPER_FIELD_ID + '"]');
      if (devContainer) {
        const userHover = devContainer.querySelector('.user-hover');
        if (userHover) {
          // 提取缩写（rel 属性）
          const rel = userHover.getAttribute('rel') || '';
          if (rel) {
            bugInfo.developerAbbr = rel.includes('@') ? rel.split('@')[0] : rel;
          }

          // 提取显示名称
          bugInfo.developerName = userHover.textContent.trim();

          // 标记已找到开发者信息
          if (bugInfo.developerAbbr || bugInfo.developerName) {
            devFound = true;
            console.log('[Jira爬虫] 从 customfield_10821 获取到开发者:', bugInfo.developerName, bugInfo.developerAbbr);
          }
        }
      }

      // 如果没有找到开发者信息，尝试从 assignee（指派人）字段获取
      if (!devFound) {
        const assigneeContainer = doc.getElementById('assignee-val');
        if (assigneeContainer) {
          const userHover = assigneeContainer.querySelector('.user-hover');
          if (userHover) {
            // 提取缩写（rel 属性）
            const rel = userHover.getAttribute('rel') || '';
            if (rel) {
              bugInfo.developerAbbr = rel.includes('@') ? rel.split('@')[0] : rel;
            }

            // 提取显示名称
            bugInfo.developerName = userHover.textContent.trim();
          }
        }
      }

      console.log('[Jira爬虫] Bug详情:', JSON.stringify(bugInfo, null, 2));
    } catch (error) {
      console.error('[Jira爬虫] 解析Bug详情异常:', error);
      bugInfo.parseError = true; // 标记解析失败
    }

    return bugInfo;
  },

  /**
   * 延迟函数
   * @private
   * @param {number} ms - 毫秒数
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};


// ======== wechat-work-api.js ========
/**
 * 企业微信文档API模块
 * 处理与企业微信智能表格相关的API调用
 * 完整实现：创建文档 → 删除默认字段 → 添加新字段 → 获取人员ID → 填写记录 → 删除临时字段
 */

const WeChatWorkAPI = {
  /**
   * 带重试的 API 请求
   * @private
   * @param {Function} requestFn - 返回 Promise 的请求函数
   * @param {number} maxRetries - 最大重试次数（默认 3 次）
   * @param {number} delay - 初始延迟时间（毫秒，默认 1000ms）
   * @returns {Promise} 请求结果
   */
  async _requestWithRetry(requestFn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        console.log(`[企业微信] 第 ${attempt} 次请求失败，${delay}ms 后重试...`);
        await this._sleep(delay);
        delay *= 2; // 指数退避
      }
    }
  },

  /**
   * 创建企业微信 API 请求（自动添加匿名模式和禁用缓存）
   * @private
   * @param {Object} options - GM_xmlhttpRequest 配置对象
   * @returns {Promise} 请求结果
   */
  _makeRequest(options) {
    return new Promise((resolve, reject) => {
      // 自动添加 anonymous 和 nocache 参数
      const requestOptions = {
        ...options,
        // 【关键修改】匿名模式，不带浏览器Cookie，防止鉴权冲突
        anonymous: true,
        // 禁用缓存
        nocache: true
      };

      GM_xmlhttpRequest({
        ...requestOptions,
        onload: (response) => {
          let result;
          if (options.onload) {
            result = options.onload(response);
          }
          // 返回 onload 的结果（如果存在），否则返回原始 response
          resolve(result !== undefined ? result : response);
        },
        onerror: (error) => {
          if (options.onerror) {
            options.onerror(error);
          }
          reject(error);
        },
        ontimeout: () => {
          if (options.ontimeout) {
            options.ontimeout();
          }
          reject(new Error('请求超时'));
        }
      });
    });
  },

  /**
   * 获取access_token
   * @returns {Promise<string>} access_token
   */
  async getAccessToken() {
    const config = ConfigManager.WECHAT_WORK_API;

    console.log('[企业微信] =======================================');
    console.log('[企业微信] 步骤 1/8: 获取 access_token');
    console.log('[企业微信] =======================================');
    console.log('[企业微信] 正在获取access_token...');

    const url = config.GETTOKEN_URL + '?corpid=' + config.CORPID + '&corpsecret=' + config.CORPSECRET;
    console.log('[企业微信] 请求URL:', url);

    return this._makeRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        try {
          console.log('[企业微信] 响应状态:', response.status);
          console.log('[企业微信] 响应内容:', response.responseText);

          const data = JSON.parse(response.responseText);

          if (data.errcode === 0 && data.access_token) {
            console.log('[企业微信] ✅ access_token获取成功');
            console.log('[企业微信] Token:', data.access_token);
            console.log('');

            // 返回 access_token
            return data.access_token;
          } else {
            console.error('[企业微信] ❌ 获取access_token失败:', data.errmsg);
            throw new Error('获取access_token失败: ' + data.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析access_token响应异常:', error);
          throw error;
        }
      },
      onerror: function(error) {
        console.error('[企业微信] ❌ 获取access_token异常:', error);
        throw error;
      }
    });
  },

  /**
   * 创建企业微信智能表格文档并填充 Bug 数据
   *
   * @param {string} title - 文档标题
   * @param {Array} bugs - Bug 信息数组（由 JiraBugScraper 爬取）
   * @param {Function} shouldStopCallback - 停止检查函数（返回 true 表示应该停止）
   * @returns {Promise<Object>} 返回文档信息，包含 docid 和 url
   *
   * @example
   * const bugs = await JiraBugScraper.scrapeBugsFromFilter(jiraUrl);
   * const result = await WeChatWorkAPI.createSmartTableDoc("测试文档", bugs);
   * console.log(result.docid);  // 文档ID
   * console.log(result.url);    // 文档链接
   *
   * @throws {Error} 当 API 调用失败时抛出错误
   */
  async createSmartTableDoc(title, bugs, shouldStopCallback) {
    try {
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 开始创建智能文档并填充数据');
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 文档标题: ' + title);
      console.log('[企业微信] Bug数量: ' + bugs.length);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤1: 获取 access_token
      const accessToken = await this.getAccessToken();

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤2: 创建文档
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 2/9: 创建智能文档');
      console.log('[企业微信] =======================================');
      const docInfo = await this._createDoc(title, accessToken);
      const docid = docInfo.docid;

      // 等待文档创建完成
      console.log('[企业微信] 等待 2 秒，确保文档创建完成...');
      await this._sleep(2000);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤3: 设置文档权限
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 3/9: 设置文档权限');
      console.log('[企业微信] =======================================');
      await this._setDocAuth(docid, accessToken);

      // 等待权限设置完成
      console.log('[企业微信] 等待 2 秒，确保权限设置完成...');
      await this._sleep(2000);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤4: 获取子表ID
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 4/9: 获取子表ID');
      console.log('[企业微信] =======================================');
      const sheetId = await this._getFirstSheetId(docid, accessToken);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤5: 删除默认字段
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 5/9: 删除默认字段');
      console.log('[企业微信] =======================================');
      const reservedFieldId = await this._deleteDefaultFields(docid, sheetId, accessToken);

      // 等待字段删除完成
      console.log('[企业微信] 等待 2 秒，确保字段删除完成...');
      await this._sleep(2000);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤6: 添加自定义字段
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 6/9: 添加自定义字段');
      console.log('[企业微信] =======================================');
      await this._addCustomFields(docid, sheetId, accessToken);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤7: 获取并删除现有记录
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 7/9: 清理现有记录');
      console.log('[企业微信] =======================================');
      await this._clearExistingRecords(docid, sheetId, accessToken);

      if (bugs.length === 0) {
        console.log('[企业微信] ⚠️  没有找到 Bug，跳过记录添加');
        return docInfo;
      }

      // 步骤8: 构建 Bug 记录（获取用户 ID）
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 8/9: 构建 Bug 记录（' + bugs.length + ' 个）');
      console.log('[企业微信] =======================================');
      const { records, collectedUserIds } = await this._buildBugRecords(bugs, shouldStopCallback);

      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        throw new Error('用户取消');
      }

      // 步骤 8.5: 二次更新文档权限（添加收集到的测试和开发人员）
      if (collectedUserIds.length > 0) {
        console.log('[企业微信] =======================================');
        console.log('[企业微信] 步骤 8.5/9: 更新文档权限（添加收集到的用户）');
        console.log('[企业微信] =======================================');
        await this._updateDocAuthWithUsers(docid, accessToken, collectedUserIds);
      }

      // 步骤9: 添加记录到文档
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 步骤 9/9: 添加记录到文档');
      console.log('[企业微信] =======================================');
      await this._addRecords(docid, sheetId, accessToken, records);

      // 删除临时保留的字段
      if (reservedFieldId) {
        console.log('[企业微信] =======================================');
        console.log('[企业微信] 清理: 删除临时保留的字段');
        console.log('[企业微信] =======================================');
        await this._deleteReservedField(docid, sheetId, accessToken, reservedFieldId);
      }

      console.log('[企业微信] =======================================');
      console.log('[企业微信] ✅ 所有步骤完成！');
      console.log('[企业微信] =======================================');
      console.log('[企业微信] 文档ID:', docid);
      console.log('[企业微信] 文档链接:', docInfo.url);
      console.log('[企业微信] Bug数量:', bugs.length);
      console.log('');

      return docInfo;
    } catch (error) {
      console.error('[企业微信] ❌ 创建文档异常:', error);
      throw error;
    }
  },

  /**
   * 创建文档
   * @private
   */
  async _createDoc(title, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;

    const requestData = {
      doc_type: 10,
      doc_name: title
    };

    console.log('[企业微信] 请求数据:', JSON.stringify(requestData, null, 2));
    const url = config.CREATE_DOC_URL + '?access_token=' + accessToken + '&debug=1';

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 30000,
      onload: (response) => {
        console.log('[企业微信] 响应状态:', response.status);
        console.log('[企业微信] 响应内容:', response.responseText);

        try {
          const result = JSON.parse(response.responseText);

          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 文档创建成功');
            console.log('[企业微信] docid:', result.docid);
            console.log('');
            return result;
          } else {
            console.error('[企业微信] ❌ 创建文档失败:', result.errmsg);
            throw new Error('创建文档失败: ' + result.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析JSON失败:', error);
          throw error;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 请求失败:', error);
        throw error;
      },
      ontimeout: () => {
        throw new Error('请求超时');
      }
    });
  },

  /**
   * 删除默认字段（保留"文本"字段）
   * @private
   */
  async _deleteDefaultFields(docid, sheetId, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;

    // 获取字段列表
    console.log('[企业微信] 获取字段列表...');
    const fieldsInfo = await this._getFieldsInfo(docid, sheetId, accessToken);

    if (!fieldsInfo.allFields || fieldsInfo.allFields.length === 0) {
      console.log('[企业微信] ⚠️  没有找到默认字段');
      return null;
    }

    console.log('[企业微信] 现有字段数量:', fieldsInfo.allFields.length);
    fieldsInfo.allFields.forEach(field => {
      console.log(`  - ${field.field_title} [${field.field_id}]`);
    });

    // 找到"文本"字段（临时保留）
    const textField = fieldsInfo.allFields.find(f => f.field_title === '文本');
    const reservedFieldId = textField ? textField.field_id : null;

    if (reservedFieldId) {
      console.log('[企业微信] 临时保留的字段ID:', reservedFieldId);
    }

    // 获取要删除的字段ID（除了"文本"字段）
    const fieldIdsToDelete = fieldsInfo.allFields
      .filter(f => f.field_title !== '文本')
      .map(f => f.field_id);

    if (fieldIdsToDelete.length === 0) {
      console.log('[企业微信] ⚠️  没有需要删除的字段');
      return reservedFieldId;
    }

    console.log('[企业微信] 将要删除的字段IDs:', JSON.stringify(fieldIdsToDelete));

    // 删除字段
    const url = config.DELETE_FIELDS_URL + '?access_token=' + accessToken;
    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      field_ids: fieldIdsToDelete
    };

    console.log('[企业微信] 删除字段请求:', JSON.stringify(requestData, null, 2));

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        console.log('[企业微信] 响应:', response.responseText);
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 字段删除成功');
            console.log('');
            return reservedFieldId;
          } else {
            console.error('[企业微信] ❌ 字段删除失败:', result.errmsg);
            throw new Error('删除字段失败: ' + result.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析响应失败:', error);
          throw error;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 请求失败:', error);
        throw error;
      }
    });
  },

  /**
   * 添加自定义字段（9个字段）
   * @private
   */
  async _addCustomFields(docid, sheetId, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.ADD_FIELDS_URL + '?access_token=' + accessToken;

    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      fields: [
        {
          field_title: "测试说明/漏测人员说明（非必填）",
          field_type: "FIELD_TYPE_TEXT"
        },
        {
          field_title: "提前发现概率",
          field_type: "FIELD_TYPE_SINGLE_SELECT",
          property_single_select: {
            options: [
              {text: "高", style: 18},
              {text: "中", style: 22},
              {text: "低", style: 13}
            ]
          }
        },
        {
          field_title: "测试回溯",
          field_type: "FIELD_TYPE_TEXT"
        },
        {
          field_title: "测试",
          field_type: "FIELD_TYPE_USER",
          property_user: {
            is_multiple: true,
            is_notified: false
          }
        },
        {
          field_title: "开发回溯",
          field_type: "FIELD_TYPE_TEXT"
        },
        {
          field_title: "开发",
          field_type: "FIELD_TYPE_USER",
          property_user: {
            is_multiple: true,
            is_notified: false
          }
        },
        {
          field_title: "Bug链接",
          field_type: "FIELD_TYPE_URL",
          property_url: {
            type: "LINK_TYPE_PURE_TEXT"
          }
        },
        {
          field_title: "组别",
          field_type: "FIELD_TYPE_SINGLE_SELECT",
          property_single_select: {
            options: [
              {text: "美化", style: 12},
              {text: "美容", style: 18},
              {text: "拼图", style: 20},
              {text: "机动", style: 7}
            ]
          }
        },
        {
          field_title: "日期",
          field_type: "FIELD_TYPE_SINGLE_SELECT",
          property_single_select: {
            options: [
              {text: "周一", style: 12},
              {text: "周二", style: 18},
              {text: "周三", style: 20},
              {text: "周四", style: 7}
            ]
          }
        }
      ]
    };

    console.log('[企业微信] 请求数据:', JSON.stringify(requestData, null, 2));

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        console.log('[企业微信] 响应:', response.responseText);
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 字段添加成功');
            console.log('');
            return result;
          } else {
            console.error('[企业微信] ❌ 字段添加失败:', result.errmsg);
            throw new Error('添加字段失败: ' + result.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析响应失败:', error);
          throw error;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 请求失败:', error);
        throw error;
      }
    });
  },

  /**
   * 爬取Jira Bug信息并添加到文档
   * @private
   */

  /**
   * 获取用户ID
   * @private
   */
  async _getUserId(abbr, name) {
    if (!abbr || !name) return null;

    // 特殊test用户白名单
    const testUserWhitelist = {
      'lyltest2': 'network_1000606',
      'zsmtest': 'network_1000540',
      'yzq_test': 'network_1000639'
    };

    // 检查是否在白名单中
    if (testUserWhitelist[abbr]) {
      console.log('[企业微信] ✅ 使用白名单test用户:', abbr, '→', testUserWhitelist[abbr]);
      return testUserWhitelist[abbr];
    }

    // 检查是否包含test（不在白名单中的test用户跳过）
    if (abbr.toLowerCase().includes('test')) {
      console.log('[企业微信] ⚠️  缩写包含test但不在白名单中，跳过');
      return null;
    }

    const apiUrl = `http://172.18.33.244/api/lints/hook/wxuser/${abbr}`;
    console.log('[企业微信] 调用接口:', apiUrl);

    return this._makeRequest({
      method: 'GET',
      url: apiUrl,
      timeout: 15000,
      onload: (response) => {
        try {
          console.log('[企业微信] 接口响应:', response.responseText.substring(0, 500));
          const data = JSON.parse(response.responseText);

          // 查找匹配的用户
          const user = data.find(u => u.name === name);
          if (user && user.wx_user_id) {
            console.log('[企业微信] ✅ 找到用户ID:', user.wx_user_id);
            return user.wx_user_id;
          } else {
            console.log('[企业微信] ⚠️  未找到匹配的用户');
            return null;
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析用户信息失败:', error);
          return null;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 获取用户ID失败:', error);
        return null;
      }
    });
  },

  /**
   * 构建记录
   * @private
   */
  async _buildRecord(bugDetail, reporterId, developerId) {
    const record = {
      values: {
        "测试说明/漏测人员说明（非必填）": [{type: "text", text: ""}],
        "开发回溯": [{type: "text", text: "引入原因：\n解决方法：\n规避措施："}],
        "Bug链接": [{type: "url", text: bugDetail.summary, link: bugDetail.url}],
        "测试回溯": [{type: "text", text: `引入时间：\n发现时间：${bugDetail.resolved}\n解决时间：${bugDetail.resolved}`}]
      }
    };

    // 如果有测试人员ID
    if (reporterId) {
      record.values["测试"] = [{type: "user", user_id: reporterId}];
    }

    // 如果有开发人员ID
    if (developerId) {
      record.values["开发"] = [{type: "user", user_id: developerId}];
    }

    // 添加组别
    record.values["组别"] = [{type: "text", text: "美化"}];

    return record;
  },

  /**
   * 添加记录
   * @private
   */
  async _addRecords(docid, sheetId, accessToken, records) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.ADD_RECORDS_URL + '?access_token=' + accessToken + '&debug=1';

    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      key_type: "CELL_VALUE_KEY_TYPE_FIELD_TITLE",
      records: records
    };

    console.log('[企业微信] 准备添加 ' + records.length + ' 条记录');
    console.log('[企业微信] 请求数据:', JSON.stringify(requestData, null, 2));

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 30000,
      onload: (response) => {
        console.log('[企业微信] 响应:', response.responseText);
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 记录添加成功');
            console.log('');
            return result;
          } else {
            console.error('[企业微信] ❌ 记录添加失败:', result.errmsg);
            throw new Error('添加记录失败: ' + result.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析响应失败:', error);
          throw error;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 请求失败:', error);
        throw error;
      }
    });
  },

  /**
   * 删除临时保留的字段
   * @private
   */
  async _deleteReservedField(docid, sheetId, accessToken, fieldId) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.DELETE_FIELDS_URL + '?access_token=' + accessToken;

    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      field_ids: [fieldId]
    };

    console.log('[企业微信] 删除临时字段:', fieldId);

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        console.log('[企业微信] 响应:', response.responseText);
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 临时字段删除成功');
            console.log('');
            return result;
          } else {
            console.error('[企业微信] ❌ 临时字段删除失败:', result.errmsg);
            throw new Error('删除字段失败: ' + result.errmsg);
          }
        } catch (error) {
          console.error('[企业微信] ❌ 解析响应失败:', error);
          throw error;
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 请求失败:', error);
        throw error;
      }
    });
  },

  /**
   * 获取第一个子表的ID
   * @private
   */
  async _getFirstSheetId(docid, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.GET_SHEET_URL + '?access_token=' + accessToken + '&debug=1';

    const requestData = {
      docid: docid,
      need_all_type_sheet: true
    };

    console.log('[企业微信] 获取子表列表...');
    console.log('[企业微信] 请求URL:', url);
    console.log('[企业微信] 请求参数:', JSON.stringify(requestData, null, 2));

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        try {
          console.log('[企业微信] 响应状态:', response.status);
          console.log('[企业微信] 响应内容:', response.responseText);

          const result = JSON.parse(response.responseText);

          if (result.errcode === 0 && result.sheet_list && result.sheet_list.length > 0) {
            const firstSheet = result.sheet_list[0];
            console.log('[企业微信] ✅ 成功获取子表ID:', firstSheet.sheet_id, firstSheet.title);
            return firstSheet.sheet_id;
          } else {
            if (result.errcode === 0 && (!result.sheet_list || result.sheet_list.length === 0)) {
              console.error('[企业微信] ❌ 文档中没有子表');
              throw new Error('该文档没有子表');
            } else {
              console.error('[企业微信] ❌ API报错:', result.errmsg);
              throw new Error('API Error: ' + result.errmsg);
            }
          }
        } catch (e) {
          console.error('[企业微信] ❌ 解析JSON失败:', e);
          console.error('[企业微信] 原始响应:', response.responseText);
          throw new Error('服务器返回了非JSON格式数据');
        }
      },
      onerror: (error) => {
        console.error('[企业微信] ❌ 网络层错误:', error);
        throw new Error('网络请求失败');
      },
      ontimeout: () => {
        console.error('[企业微信] ❌ 请求超时');
        throw new Error('请求超时');
      }
    });
  },

  /**
   * 获取字段信息
   * @private
   */
  async _getFieldsInfo(docid, sheetId, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.GET_FIELDS_URL + '?access_token=' + accessToken;

    const requestData = {
      docid: docid,
      sheet_id: sheetId
    };

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            return {
              allFields: result.fields || []
            };
          } else {
            throw new Error('获取字段失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });
  },

  /**
   * 构建文档成员列表（动态去重）
   * @private
   * @param {Array} users - 用户数组，支持两种格式：
   *   1. 字符串数组：['userid1', 'userid2'] - 使用默认type和auth
   *   2. 对象数组：[{userid: 'id1', type: 1, auth: 7}, {userid: 'id2', type: 1, auth: 2}]
   * @returns {Array} 去重并格式化后的成员列表
   */
  _buildUpdateFileMemberList(users) {
    const config = ConfigManager.WECHAT_WORK_API;

    // 判断输入格式：检查第一个元素是否为对象（有userid属性）
    const isObjectArray = users.length > 0 && users[0] !== null && typeof users[0] === 'object' && 'userid' in users[0];

    let memberList;

    if (isObjectArray) {
      // 对象数组格式：使用各自的type和auth配置
      // 按userid去重，保留最高权限
      const memberMap = new Map();
      users.forEach(user => {
        const existing = memberMap.get(user.userid);
        const newAuth = user.auth !== undefined ? user.auth : config.DOC_MEMBER_DEFAULT_AUTH;
        const newType = user.type !== undefined ? user.type : config.DOC_MEMBER_DEFAULT_TYPE;

        if (!existing || newAuth > existing.auth) {
          memberMap.set(user.userid, {
            type: newType,
            auth: newAuth,
            userid: user.userid
          });
        }
      });
      memberList = Array.from(memberMap.values());

      console.log('[企业微信] 构建文档成员列表（对象格式）:');
      console.log('[企业微信] 原始用户数:', users.length);
      console.log('[企业微信] 去重后用户数:', memberList.length);
    } else {
      // 字符串数组格式：使用默认type和auth
      const uniqueUserIds = [...new Set(users)];
      memberList = uniqueUserIds.map(userid => ({
        type: config.DOC_MEMBER_DEFAULT_TYPE,
        auth: config.DOC_MEMBER_DEFAULT_AUTH,
        userid: userid
      }));

      console.log('[企业微信] 构建文档成员列表（字符串格式）:');
      console.log('[企业微信] 原始用户数:', users.length);
      console.log('[企业微信] 去重后用户数:', uniqueUserIds.length);
    }

    memberList.forEach(member => {
      const authDesc = member.auth === 7 ? '管理员' : '读写';
      console.log(`[企业微信] - ${member.userid} (type=${member.type}, auth=${member.auth}, ${authDesc})`);
    });

    return memberList;
  },

  /**
   * 设置文档权限
   * @private
   */
  async _setDocAuth(docid, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;

    // 步骤1: 设置企业内成员可编辑权限
    console.log('[企业微信] 设置企业内成员可编辑权限...');

    const joinRuleUrl = config.MOD_DOC_JOIN_RULE_URL + '?access_token=' + accessToken;
    const joinRuleData = {
      docid: docid,
      enable_corp_internal: true,
      corp_internal_auth: 2, // 2-读写（企业内成员可编辑）
      enable_corp_external: false,
      ban_share_external: true // 禁止分享到企业外
    };

    await this._makeRequest({
      method: 'POST',
      url: joinRuleUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(joinRuleData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 企业内成员可编辑权限设置成功');
            return result;
          } else {
            throw new Error('设置企业内权限失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });

    // 等待一下
    await this._sleep(1000);

    // 步骤2: 动态构建文档成员列表
    console.log('[企业微信] 动态构建文档成员列表...');

    const memberUrl = config.MOD_DOC_MEMBER_URL + '?access_token=' + accessToken;

    // 使用配置的通知人员列表动态构建成员列表
    const memberList = this._buildUpdateFileMemberList(config.NOTICE_MEMBERS);

    const memberData = {
      docid: docid,
      update_file_member_list: memberList
    };

    const memberResult = await this._makeRequest({
      method: 'POST',
      url: memberUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(memberData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 文档成员列表设置成功');
            console.log('');
            return result;
          } else {
            throw new Error('设置管理员失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });

    return memberResult;
  },

  /**
   * 更新文档权限（添加收集到的用户）
   * @private
   * @param {string} docid - 文档ID
   * @param {string} accessToken - 访问令牌
   * @param {Array} collectedUserIds - 收集到的用户ID数组（字符串数组）
   */
  async _updateDocAuthWithUsers(docid, accessToken, collectedUserIds) {
    const config = ConfigManager.WECHAT_WORK_API;

    // NOTICE_MEMBERS 是对象数组：[{userid: 'xxx', auth: 7}, ...]
    // collectedUserIds 是字符串数组：['userid1', 'userid2', ...]
    // 需要合并并转换为统一的对象数组格式

    // 从 NOTICE_MEMBERS 创建 Map（用于快速查找和去重）
    const memberMap = new Map();
    config.NOTICE_MEMBERS.forEach(member => {
      memberMap.set(member.userid, {
        type: member.type !== undefined ? member.type : config.DOC_MEMBER_DEFAULT_TYPE,
        auth: member.auth !== undefined ? member.auth : config.DOC_MEMBER_DEFAULT_AUTH,
        userid: member.userid
      });
    });

    // 添加收集到的用户（使用默认auth，如果已存在则跳过）
    const defaultAuth = config.DOC_MEMBER_DEFAULT_AUTH;
    collectedUserIds.forEach(userid => {
      if (!memberMap.has(userid)) {
        memberMap.set(userid, {
          type: config.DOC_MEMBER_DEFAULT_TYPE,
          auth: defaultAuth,
          userid: userid
        });
      }
    });

    // 转换为数组
    const allMembers = Array.from(memberMap.values());

    if (allMembers.length === 0) {
      console.log('[企业微信] ⚠️  没有需要添加的用户，跳过权限更新');
      return;
    }

    console.log('[企业微信] 准备更新文档权限...');
    console.log('[企业微信] 配置的固定成员数:', config.NOTICE_MEMBERS.length);
    console.log('[企业微信] 收集到的用户数:', collectedUserIds.length);
    console.log('[企业微信] 去重后总成员数:', allMembers.length);

    // 统计权限分布
    const adminCount = allMembers.filter(m => m.auth === 7).length;
    const rwCount = allMembers.filter(m => m.auth === 2).length;
    console.log('[企业微信] 权限分布: 管理员 ' + adminCount + ' 人, 读写 ' + rwCount + ' 人');

    // 构建成员列表
    const memberList = this._buildUpdateFileMemberList(allMembers);

    const memberUrl = config.MOD_DOC_MEMBER_URL + '?access_token=' + accessToken;
    const memberData = {
      docid: docid,
      update_file_member_list: memberList
    };

    console.log('[企业微信] 更新文档成员列表...');
    console.log('[企业微信] 请求数据:', JSON.stringify(memberData, null, 2));

    return this._makeRequest({
      method: 'POST',
      url: memberUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(memberData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 文档权限更新成功（已添加收集到的用户）');
            console.log('');
            return result;
          } else {
            throw new Error('更新文档权限失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });
  },

  /**
   * 延迟函数
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 清理现有记录
   * @private
   */
  async _clearExistingRecords(docid, sheetId, accessToken) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.ADD_RECORDS_URL.replace('add_records', 'get_records') + '?access_token=' + accessToken;

    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      offset: 0,
      limit: 100
    };
    // Note: API限制，最多返回100条记录。如果超过100条，需要实现分页逻辑

    console.log('[企业微信] 获取现有记录...');

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);

          if (result.errcode === 0) {
            const recordIds = (result.records || []).map(r => r.record_id);
            const total = result.total || 0;

            console.log('[企业微信] 找到 ' + total + ' 条现有记录');

            if (total > 0 && recordIds.length > 0) {
              console.log('[企业微信] 正在删除现有记录...');
              return this._deleteRecords(docid, sheetId, accessToken, recordIds);
            } else {
              console.log('[企业微信] 没有现有记录需要删除');
              return;
            }
          } else {
            throw new Error('获取记录失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });
  },

  /**
   * 删除记录
   * @private
   */
  async _deleteRecords(docid, sheetId, accessToken, recordIds) {
    const config = ConfigManager.WECHAT_WORK_API;
    const url = config.ADD_RECORDS_URL.replace('add_records', 'delete_records') + '?access_token=' + accessToken;

    const requestData = {
      docid: docid,
      sheet_id: sheetId,
      record_ids: recordIds
    };

    console.log('[企业微信] 删除 ' + recordIds.length + ' 条记录');

    return this._makeRequest({
      method: 'POST',
      url: url,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      timeout: 15000,
      onload: (response) => {
        try {
          const result = JSON.parse(response.responseText);
          if (result.errcode === 0) {
            console.log('[企业微信] ✅ 记录删除成功');
            console.log('[企业微信] 等待 2 秒...');
            return this._sleep(2000);
          } else {
            throw new Error('删除记录失败: ' + result.errmsg);
          }
        } catch (error) {
          throw error;
        }
      },
      onerror: (error) => {
        throw error;
      }
    });
  },

  /**
   * 构建 Bug 记录数组
   * @private
   */
  async _buildBugRecords(bugs, shouldStopCallback) {
    const records = [];
    const collectedUserIds = new Set(); // 使用 Set 自动去重
    let failedLookups = 0;

    for (let i = 0; i < bugs.length; i++) {
      // 检查是否应该停止
      if (shouldStopCallback && shouldStopCallback()) {
        console.log('[企业微信] 用户取消构建记录');
        throw new Error('用户取消');
      }

      const bug = bugs[i];
      console.log(`[企业微信] 处理 Bug ${i + 1}/${bugs.length}: ${bug.key}`);

      // 获取测试人员 ID
      let reporterId = null;
      if (bug.reporterAbbr && bug.reporterName) {
        reporterId = await this._getUserId(bug.reporterAbbr, bug.reporterName);
        if (reporterId) {
          console.log('[企业微信] 测试人员ID:', reporterId);
          collectedUserIds.add(reporterId); // 收集测试人员ID
        } else {
          console.log('[企业微信] ⚠️  无法获取测试人员ID');
          failedLookups++;
        }
      }

      // 获取开发人员 ID
      let developerId = null;
      if (bug.developerAbbr && bug.developerName) {
        developerId = await this._getUserId(bug.developerAbbr, bug.developerName);
        if (developerId) {
          console.log('[企业微信] 开发人员ID:', developerId);
          collectedUserIds.add(developerId); // 收集开发人员ID
        } else {
          console.log('[企业微信] ⚠️  无法获取开发人员ID');
          failedLookups++;
        }
      }

      // 构建记录
      const record = this._buildSingleRecord(bug, reporterId, developerId);
      records.push(record);

      // 短暂延迟避免请求过快
      await this._sleep(300);
    }

    if (failedLookups > 0) {
      console.warn('[企业微信] ⚠️  ' + failedLookups + ' 个用户ID查找失败');
    }

    // 输出收集到的用户ID统计
    const uniqueUserIds = Array.from(collectedUserIds);
    console.log('[企业微信] =======================================');
    console.log('[企业微信] 收集到的用户ID统计:');
    console.log('[企业微信] 总计唯一用户数:', uniqueUserIds.length);
    uniqueUserIds.forEach(userid => {
      console.log('[企业微信] -', userid);
    });
    console.log('[企业微信] =======================================');

    return { records, collectedUserIds: uniqueUserIds };
  },

  /**
   * 构建单条记录
   * @private
   */
  _buildSingleRecord(bug, reporterId, developerId) {
    const record = {
      values: {
        "测试说明/漏测人员说明（非必填）": [{type: "text", text: ""}],
        "开发回溯": [{type: "text", text: "引入原因：\n解决方法：\n规避措施："}],
        "Bug链接": [{type: "url", text: bug.summary, link: bug.url}],
        "测试回溯": [{type: "text", text: "引入时间：\n发现时间：" + bug.found_time + "\n解决时间：" + bug.resolved}]
      }
    };

    // 添加测试人员
    if (reporterId) {
      record.values["测试"] = [{type: "user", user_id: reporterId}];
    }

    // 添加开发人员
    if (developerId) {
      record.values["开发"] = [{type: "user", user_id: developerId}];
    }

    return record;
  }
};


// ======== event-manager.js ========
/**
 * 事件管理器 - 简化版本
 * 处理全局事件的注册和管理
 */
const EventManager = {
  boundEvents: new Set(),

  bindEvent(selector, event, handler, context = "global") {
    const eventKey = `${context}-${selector}-${event}`;

    if (this.boundEvents.has(eventKey)) {
      return;
    }

    try {
      $(document).on(event, selector, handler);
      this.boundEvents.add(eventKey);
    } catch (error) {
      console.error(`事件绑定失败: ${eventKey}`, error);
    }
  },

  unbindContext(context) {
    const toRemove = [];
    this.boundEvents.forEach((eventKey) => {
      if (eventKey.startsWith(`${context}-`)) {
        toRemove.push(eventKey);
      }
    });
    toRemove.forEach((key) => this.boundEvents.delete(key));
  },

  // 注册全局事件监听器
  registerGlobalEvents() {
    // 平台切换按钮
    Utils.events.registerPlatformCapture(
      "#change_side_android, .android",
      "Android"
    );
    Utils.events.registerPlatformCapture("#change_side_ios, .ios", "iOS");
    Utils.events.registerPlatformCapture("#change_side_web, .web", "Web");

    // 获取分支按钮（包括创建、关闭、重新打开场景）
    Utils.events.addCaptureClick(
      "#get_branch_btn, #last_branch_btn, #get_branch_btn_close, #last_branch_btn_close, #get_branch_btn_open, #last_branch_btn_open",
      function (target) {
        JiraModule.handleBranchButtonClick({ target: target });
      }
    );

    // 重置步骤按钮
    Utils.events.addCaptureClick("#reset_step", function () {
      JiraModule.handleResetStepClick();
    });

    // 上次填写按钮（评论工具栏和关闭问题对话框）
    Utils.events.addCaptureClick("#close-text, #last_fill_btn_close", function () {
      JiraModule.handlePreTextClick();
    });

    // 工作流提交按钮
    Utils.events.addCaptureClick(
      "#issue-workflow-transition-submit",
      function () {
        JiraModule.handleWorkflowSubmit();
      }
    );

    // 再提一个按钮
    Utils.events.addCaptureClick("#once-again", function () {
      console.log("[once-again] 再提一个按钮被点击");

      const savedFormData = Utils.storage.getValue("bugFormData");

      if (!savedFormData) {
        Utils.common.showToast(
          "没有找到可复用的表单数据，请先创建一个Bug",
          "#f44336"
        );
        console.warn("[once-again] 没有找到保存的表单数据");
        return;
      }

      try {
        const formData = typeof savedFormData === "string" ? JSON.parse(savedFormData) : savedFormData;

        setTimeout(() => {
          FormUtils.fillFormData(formData);
        }, 300);
      } catch (error) {
        console.error("[once-again] 解析表单数据失败:", error);
        Utils.common.showToast("表单数据格式错误", "#f44336");
      }
    });

    // 创建按钮
    Utils.events.addCaptureClick("#create-issue-submit", function () {
      console.log("[create-issue-submit] 创建按钮被点击，开始收集表单数据");

      const formData = FormUtils.collectFormData();

      if (formData && Object.keys(formData).length > 0) {
        Utils.storage.setValue("bugFormData", formData);
        console.log("表单数据已保存:", formData);
      } else {
        console.warn("没有收集到有效的表单数据");
        Utils.common.showToast("未收集到表单数据", "#ff9800");
      }
    });
  }
};

// ======== cf-module.js ========
/**
 * CF模块 - Confluence功能处理
 * 处理cf.meitu.com域名下的功能
 */

// CF域名下的功能
if (location.href.indexOf("cf.meitu.com") > 0) {
  // 获取ul元素
  var menuBars = document.getElementsByClassName("ajs-menu-bar");
  var menuBar = menuBars[0];

  // 创建两个li元素
  var li1 = document.createElement("li");
  var li2 = document.createElement("li");
  li1.className = "ajs-button normal";
  li2.className = "ajs-button normal";

  // 创建两个button元素
  var button1 = document.createElement("button");
  var button2 = document.createElement("button");

  // 设置按钮文本
  button1.textContent = "复制Android需求";
  button2.textContent = "复制iOS需求";

  // 设置按钮ID
  button1.id = "Android";
  button2.id = "iOS";

  // 设置按钮Class
  button1.className = "aui-button aui-button-subtle edit";
  button2.className = "aui-button aui-button-subtle edit";

  // 将button元素添加到li元素中
  li1.appendChild(button1);
  li2.appendChild(button2);

  // 将li元素添加到ul元素中
  menuBar.appendChild(li1);
  menuBar.appendChild(li2);

  // 将li元素放在menuBar的最前
  menuBar.insertBefore(li2, menuBar.firstChild);
  menuBar.insertBefore(li1, menuBar.firstChild);

  getRequirementArray("Android");
  getRequirementArray("iOS");
}

/**
 * 为平台特定按钮添加点击事件监听器
 */
function getRequirementArray(platform) {
  var platformButton = document.getElementById(platform);
  platformButton.addEventListener("click", function (event) {
    var androidArray = [];
    var iosArray = [];
    var androidTd = findColumnIndex("Android") + 1;
    var iosTd = findColumnIndex("iOS") + 1;
    var cppTd = findColumnIndex("中间架构") + 1;

    var politeTbodies = document.querySelectorAll('tbody[aria-live="polite"]');
    politeTbodies.forEach(function (tbody) {
      var rows = tbody.querySelectorAll("tr");
      rows.forEach(function (row) {
        var anchorElement = row.querySelector("a");
        const secondTdText = anchorElement ? anchorElement.textContent.trim() : undefined;

        getArrayByCheckedLi(row, androidTd, secondTdText, androidArray);
        getArrayByCheckedLi(row, iosTd, secondTdText, iosArray);

        let blackWord = "底层先行";
        if (secondTdText && secondTdText.indexOf(blackWord) === -1) {
          let platformAndroid = "Android";
          let platformiOS = "iOS";

          if (secondTdText.indexOf(platformAndroid) === -1 && secondTdText.indexOf(platformiOS) !== -1) {
            getArrayByCheckedLi(row, cppTd, secondTdText, iosArray);
          } else if (secondTdText.indexOf(platformAndroid) !== -1 && secondTdText.indexOf(platformiOS) === -1) {
            getArrayByCheckedLi(row, cppTd, secondTdText, androidArray);
          } else {
            getArrayByCheckedLi(row, cppTd, secondTdText, androidArray);
            getArrayByCheckedLi(row, cppTd, secondTdText, iosArray);
          }
        }
      });
    });

    var buttonPlatform = event.target.id;
    if (buttonPlatform === "Android") {
      copyArrayToClipboard(androidArray);
    } else if (buttonPlatform === "iOS") {
      copyArrayToClipboard(iosArray);
    }
  });
}

/**
 * 查找表头中包含指定字符串的单元格位置
 */
function findColumnIndex(columnName) {
  const headerCells = document.querySelectorAll("th.confluenceTh");

  for (let i = 0; i < headerCells.length; i++) {
    const headerInner = headerCells[i].querySelector(".tablesorter-header-inner");
    if (headerInner && headerInner.textContent.trim() === columnName) {
      return i;
    }
  }

  console.log(`未找到包含"${columnName}"的列`);
  return -1;
}

/**
 * 获取tr元素中的第N个td元素，并检查其中的li元素是否为选中状态
 */
function getArrayByCheckedLi(row, tdNum, requirementName, array) {
  var tdElement = row.querySelector("td:nth-child(" + tdNum + ")");
  var liElement = tdElement.querySelector("li.checked");
  if (liElement) {
    addToUniqueArray(array, requirementName);
  }
}

/**
 * 往数组内添加不重复的元素
 */
function addToUniqueArray(arr, element) {
  if (arr.indexOf(element) === -1) {
    arr.push(element);
  }
}

/**
 * 将数组转化为字符串进行拷贝
 */
function copyArrayToClipboard(arr) {
  var arrayString = arr.join("\n");

  var textarea = document.createElement("textarea");
  textarea.value = arrayString;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    console.log("数组已复制到剪贴板");
  } catch (err) {
    console.error("复制到剪贴板失败: ", err);
  } finally {
    document.body.removeChild(textarea);
    showCopySuccessMessage();
  }
}

/**
 * 复制成功提示
 */
function showCopySuccessMessage() {
  var messageBox = document.createElement("div");
  messageBox.textContent = "复制成功！";
  messageBox.style.position = "fixed";
  messageBox.style.top = "50%";
  messageBox.style.left = "50%";
  messageBox.style.transform = "translate(-50%, -50%)";
  messageBox.style.padding = "10px";
  messageBox.style.background = "#4CAF50";
  messageBox.style.color = "white";
  messageBox.style.borderRadius = "5px";
  messageBox.style.zIndex = "9999";

  document.body.appendChild(messageBox);

  setTimeout(function () {
    document.body.removeChild(messageBox);
  }, 2000);
}

// ======== main.js ========
/**
 * 主入口文件
 * 整合所有模块并初始化应用
 */

(function () {
  "use strict";

  // 初始化样式
  StyleManager.injectStyles();

  // 初始化Jira模块
  JiraModule.init();

  // 注册全局事件
  EventManager.registerGlobalEvents();

  // 注册搜索按钮事件
  EventManager.bindEvent(
    "#search_btn_create",
    "click",
    () => {
      JiraModule.handleSearchSpanClick("customfield_10303-val");
    },
    "jira"
  );

  EventManager.bindEvent(
    "#search_btn_solved",
    "click",
    () => {
      JiraModule.handleSearchSpanClick("customfield_10304-val");
    },
    "jira"
  );

  console.log("开发版快查脚本已初始化");
})();
