// ==UserScript==
// @name          SD-TmpTools-settings
// @namespace     http://tampermonkey.net/
// @version       1.1.3
// @author        Ling2Ling4
// @description   设置"Stable-Diffusion 连续生成图片"插件功能的单独插件
// @license       AGPL-3.0-or-later
// @icon data:image/x-icon;base64,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
// @match         http://localhost:*/
// @match         http://127.0.0.1:*/
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/480263/SD-TmpTools-settings.user.js
// @updateURL https://update.greasyfork.org/scripts/480263/SD-TmpTools-settings.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const main = {
    isTarget: true, // 是否是目标端口
    txt: {
      isAutoLoadTag: `是否在进入页面时自动加载上次使用的提示词和配置
默认: base
当前: `,
      isHiddenList: `是否在使用一条记录后隐藏列表
默认: base
当前: `,
      listMaxLen: `设置列表的最大长度, 默认: `,
      showMode: `设置列表按钮的显示方式, 是单击文本框后显示列表按钮, 还是双击显示, 或者一直显示
默认: base
可选: 单击, 双击, 一直显示`,
      listenPort: `设置监听端口, 可设置多个, 每个用 , 分隔, 默认: `,
      selectors: `选择器配置, 输入 default 重置为默认设置
----说明:
gRoot: gradio-app元素
startBtn: 开始按钮
skipBtn: 跳过按钮
settingsBar: 顶部快捷设置区域的元素 (含切换模型的功能的区域)
positiveEle: 正面提示词的文本框
negativeEle: 负面提示词的文本框
positiveBox: 正面提示词的文本框的祖先元素
negativeBox: 负面提示词的文本框的祖先元素
methodBox: 含所有采样方法的单选按钮的元素
methodsArr: 采样方法的单选按钮
methodsTxtArr: 采样方法名称的元素
stepsEle: 采样步数的控件
widthEle: 宽度的控件
heightEle: 高度的控件
countEle: 批次的控件
sizeEle: 批量的控件
cfgEle: 提示提系数的控件
seedEle: 种子的输入框
modEle: 模型的控件`,
      oldSelectors: `是否重置为旧的选择器配置, 当前插件版本为: versions, 旧的版本为: oldVersions
旧的选择器配置为:
oldSelectors`,
    },
    // 将布尔值转为设置中显示的文本
    boolTxt(val) {
      return val ? "是 (确定)" : "否 (取消)";
    },
    // 验证是否是监听的端口
    verification() {
      const port = window.location.port;
      // if (port === "8080") {
      //   return true;
      // }
      const oldPort = GM_getValue("SD_webui_listen_port") || "7860";
      if (port === oldPort || oldPort.includes(port)) {
        return true;
      } else {
        return false;
      }
    },
    // 通用的"是否"的设置方式
    setItem(txt, base, key) {
      let val = JSON.parse(localStorage.getItem(key));
      if (val === undefined || val === null) {
        val = base;
        localStorage.setItem(key, val);
      }
      txt = txt.replace("base", this.boolTxt(base)) + this.boolTxt(val);
      const newVal = confirm(txt);
      if (newVal !== val) {
        localStorage.setItem(key, newVal);
      }
    },
    // 使用一条记录后列表是否隐藏
    setIsHiddenList(base = true, key = "SD_webui_isHiddenList") {
      this.setItem(this.txt.isHiddenList, base, key);
    },
    // 是否在进入页面时自动加载上次使用的提示词和配置
    setIsAutoLoadTag(base = true, key = "SD_webui_isAutoLoadTag") {
      this.setItem(this.txt.isAutoLoadTag, base, key);
    },
    // 列表最大长度
    setListMaxLen(base = 200, key = "SD_webui_listMaxLen") {
      const txt = this.txt.listMaxLen + base;
      let val = localStorage.getItem(key);
      const newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (!+val) {
        val = base;
        localStorage.setItem(key, val);
      }
      if (newVal !== val) {
        localStorage.setItem(key, newVal);
      }
    },
    // 设置列表按钮的显示方式
    setBtnShowMode(base = "单击", key = "SD_webui_btnShowMode") {
      const txt = this.txt.showMode.replace("base", base);
      let val = localStorage.getItem(key);
      if (!val) {
        val = base;
        localStorage.setItem(key, val);
      }
      const newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (newVal !== val) {
        if (newVal === "双击") {
          localStorage.setItem(key, "双击");
        } else if (newVal === "显示" || newVal === "一直显示") {
          localStorage.setItem(key, "显示");
        } else {
          localStorage.setItem(key, base);
        }
      }
    },
    // 设置监听端口
    setListenPort(base = "7860", key = "SD_webui_listen_port") {
      const txt = this.txt.listenPort + base;
      let val = GM_getValue(key);
      if (!val) {
        val = base;
        localStorage.setItem(key, val);
      }
      let newVal = prompt(txt, val);
      if (newVal === null) {
        return;
      }
      if (newVal) {
        newVal = newVal.replaceAll("，", ",");
      }
      if (newVal !== val) {
        GM_setValue(key, newVal);
        history.go(0);
      }
    },
    // 设置选择器
    setSelectors(key = "SD_webui_selectors") {
      const txt = this.txt.selectors;
      const localSelectors = JSON.parse(localStorage.getItem(key));
      const curSelectors = JSON.stringify(localSelectors.value)
        .replaceAll(",", ", ")
        .replaceAll(":", ": ");
      let selectors = prompt(txt, curSelectors);
      if (newVal === null) {
        return;
      }
      if (selectors && selectors !== curSelectors) {
        if (selectors === "default" || selectors === "默认") {
          selectors = document.tools_dom.webui_dom.selectors;
        }
        try {
          selectors = JSON.parse(selectors);
        } catch (e) {
          selectors = document.tools_dom.webui_dom.selectors;
        }
        localStorage.setItem(
          key,
          JSON.stringify({
            value: selectors,
            versions: document.tools_dom.versions,
          })
        );
        history.go(0);
      }
    },
    // 使用旧的选择器
    useOldSelectors(
      key = "SD_webui_selectors_old",
      key2 = "SD_webui_selectors"
    ) {
      // 获取旧的值
      const oldSelectors = JSON.parse(localStorage.getItem(key));
      if (oldSelectors) {
        let txt = this.txt.oldSelectors
          .replace("versions", document.tools_dom.versions)
          .replace("oldVersions", oldSelectors.oldVersions)
          .replace(
            "oldSelectors",
            JSON.stringify(oldSelectors.value)
              .replaceAll("{", "{\n")
              .replaceAll("}", "\n}")
              .replaceAll("[", "[\n")
              .replaceAll("]", "\n]")
              .replaceAll(",", ",\n")
              .replaceAll(":", ": ")
          );
        const is = confirm(txt);
        if (is) {
          localStorage.setItem(
            key2,
            JSON.stringify({
              value: oldSelectors.value,
              versions: document.tools_dom.versions,
            })
          );
          history.go(0);
        }
      } else {
        alert("不存在旧的选择器配置");
      }
    },
    // 设置菜单
    registerMenu() {
      this.isTarget = this.verification();
      this.isTarget &&
        GM_registerMenuCommand("基础设置", () => {
          this.setIsHiddenList();
          this.setIsAutoLoadTag();
          this.setListMaxLen();
          this.setBtnShowMode();
          history.go(0);
        });
      GM_registerMenuCommand("监听端口", () => {
        this.setListenPort();
      });
      this.isTarget &&
        GM_registerMenuCommand("选择器配置", () => {
          this.setSelectors();
        });
      this.isTarget &&
        GM_registerMenuCommand("重置为旧的选择器配置", () => {
          this.useOldSelectors();
        });
    },
    init() {
      this.registerMenu();
    },
  };
  main.init();
  if (!main.isTarget) {
    return;
  }


})();
