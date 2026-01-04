// ==UserScript==
// @name         网易云课堂/腾讯课堂课时计算
// @namespace    dawsonenjoy_course_count
// @version      0.0.1
// @description  右边标题栏显示当前课程总课时（如果没有显示成功，请点击标题栏刷新）
// @author       dawsonenjoy
// @homepageURL  https://github.com/dawsonenjoy/tampermonkey_script
// @match        https://study.163.com/course/*
// @match        https://ke.qq.com/course/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408857/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%AF%BE%E6%97%B6%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/408857/%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%AF%BE%E6%97%B6%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // Your code here...
  const config = {
    // 页面相关配置，可自定义
    pages: {
      // 相关配置参数：
      // nodes: 课程节点,
      // preprocess: 节点数据处理方式,
      // watcherNode: 监听节点选择器,
      // watcherConfig: 监听配置,
      // pageStyle: 对应页面样式,
      // ----------------------------------------------------------
      // 腾讯课堂
      qq: {
        nodes: ".tt-suffix",
        preprocess: node => parseFloat(node.innerText.slice(1, -3)) * 60 || 0,
        watcherNode: "#js_dir_tab",
        watcherConfig: { attributes: true }
      },
      // 网易云课堂
      "study.163": {
        nodes: ".kstime",
        preprocess: node => TimeUtils.timeToSecond(node.innerText || 0),
        watcherNode: "#j-chapter-list",
        watcherConfig: { childList: true }
      }
      // ----------------------------------------------------------
    },
    // 默认配置
    defaultConfig: {
      nodes: "",
      watcherNode: "",
      watcherConfig: {},
      preprocess: node => parseFloat(node.innerText) || 0,
      pageStyle: ``
    },
    // 获取配置属性
    getConfig(attr) {
      return this.pageConfig[attr] || this.defaultConfig[attr];
    },
    // 属性缓存
    getCacheAttr(attr, getMethod) {
      if (this[`_${attr}`] !== undefined) return this[`_${attr}`];
      this[`_${attr}`] = getMethod instanceof Function && getMethod();
      return this[`_${attr}`];
    },
    // 获取页面配置
    get pageConfig() {
      return this.getCacheAttr("pageConfig", () => {
        for (let page in this.pages) {
          if (location.href.includes(page)) return this.pages[page];
        }
        return this.defaultConfig;
      });
    },
    get nodes() {
      let nodes = this.getConfig("nodes");
      if (!nodes) return [];
      return Array.from(document.querySelectorAll(nodes));
    },
    get preprocess() {
      return this.getConfig("preprocess");
    },
    get watcherNode() {
      let watcherNode = this.getConfig("watcherNode");
      if (!watcherNode) return "";
      return document.querySelector(watcherNode);
    },
    get watcherConfig() {
      return this.getConfig("watcherConfig");
    },
    get root() {
      return this.getCacheAttr("root", () =>
        document.querySelector(".time-bar")
      );
    },
    get body() {
      return this.getCacheAttr("body", () =>
        document.querySelector(".time-body")
      );
    },
    get close() {
      return this.getCacheAttr("close", () =>
        document.querySelector(".time-close")
      );
    }
  };

  // 展示的标题栏
  const timeBar = {
    // 所有要生成的元素配置
    element: {
      styleElement: {
        tag: "style",
        innerHTML: `
          div.time-bar {
              position: fixed;
              top: 100px;
              left: 0px;
              height: 50px;
              width: 230px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #303541 !important;
              color: white;
              border-radius: 3px;
              font-size: 1.5em;
              cursor: pointer;
              z-index: 999;
          }
          div.time-bar:hover {
              opacity: 0.8;
          }
          .time-body {
              background: inherit;
              padding: 0;
          }
          .time-close {
            position: absolute;
            top: 0;
            right: 2px;
            margin-top: -2px;
            color: white;
          }
          .time-close:hover {
            background: rgba(255, 255, 255, .3)
          }
          `,
        parent: "head"
      },
      divElement: {
        tag: "div",
        className: "time-bar",
        title: "点击刷新",
        innerHTML: `<div class="time-body">总时长：</div>
                    <div class="time-close">×</div>`
      }
    },
    // 排除映射的属性
    excludes: ["parent", "tag"],
    // 关闭bar
    closeTime() {
      config.root && config.root.remove();
    },
    // 更新时间
    updateTime() {
      config.body.innerText = `总时长：${TimeUtils.getTimes()}`;
    },
    // 自动更新时间配置
    watcher() {
      let node = config.watcherNode;
      let watcherConfig = config.watcherConfig;
      if (!node || Object.keys(watcherConfig).length < 1) return;
      let MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      let observer = new MutationObserver(() => this.updateTime());
      observer.observe(node, watcherConfig);
    },
    // 刷新和关闭事件
    bindEvent() {
      config.root.addEventListener("click", e => this.updateTime());
      config.close.addEventListener("click", e => this.closeTime());
      this.watcher();
    },
    createElement(oElement) {
      let element = document.createElement(oElement.tag);
      for (let k in oElement) {
        if (this.excludes.includes(k)) continue;
        element[k] = oElement[k];
      }
      document[oElement.parent || "body"].appendChild(element);
    },
    createtimeBar() {
      for (let k in this.element) this.createElement(this.element[k]);
    },
    init() {
      this.createtimeBar();
      this.bindEvent();
    }
  };

  // 时间相关工具
  const TimeUtils = {
    // 获取时间
    getTimes() {
      let nodes = config.nodes;
      let preprocess = config.preprocess;
      if (!nodes) return 0;
      return this.timeSum(nodes.map(node => preprocess(node)));
    },
    // 计算总时长
    timeSum(times) {
      return this.timeFormat(times.reduce((pre, cur) => pre + cur));
    },
    // 格式转换：HH:MM:ss -> s
    timeToSecond(time) {
      if (!time.toString().includes(":")) return 0;
      let timeList = time
        .split(":")
        .map(
          (item, index, p) => parseFloat(item) * 60 ** (p.length - index - 1)
        );
      return timeList.reduce((pre, cur) => pre + cur);
    },
    // 格式转换：s -> HH:MM:ss
    timeFormat(time) {
      let { hour, minute, second } = this.getSecond(time);
      return [hour, minute, second].map(item => parseInt(item)).join(":");
    },
    // 获取小时和剩余秒数
    getHour(time) {
      let hour = Math.floor(time / 3600);
      return { hour: hour, remainSecond: time - hour * 3600 };
    },
    // 获取小时+分钟以及剩余秒数
    getMinute(time) {
      let oHour = this.getHour(time);
      let minute = Math.floor(oHour.remainSecond / 60);
      return {
        ...oHour,
        minute: minute,
        remainSecond: oHour.remainSecond - minute * 60
      };
    },
    // 获取小时+分钟+秒数
    getSecond(time) {
      let oMinute = this.getMinute(time);
      return {
        ...oMinute,
        second: oMinute.remainSecond
      };
    }
  };

  timeBar.init();
})();
