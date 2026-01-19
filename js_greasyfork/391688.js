// ==UserScript==
// @name         「水水」qBittorrent 管理脚本
// @namespace    做最终做到的事，成为最终成为的人。
// @version      1.0.9
// @author       沉冰浮水
// @description  通过 WebUI 的 API 批量替换 Tracker
// @license      MIT
// @null     ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null     ----------------------------
// @link     https://github.com/wdssmq/userscript
// @link     https://afdian.com/@wdssmq
// @link     https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null     ----------------------------
// @noframes
// @run-at       document-end
// @include      http://*:8088/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391688/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8DqBittorrent%20%E7%AE%A1%E7%90%86%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/391688/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8DqBittorrent%20%E7%AE%A1%E7%90%86%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  const gm_name = "qBit";

  // 初始常量或函数
  const curUrl = window.location.href;

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}] \n`, ...args);

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }

  class DefForm {
    schemaForm = [
      // 替换
      {
        name: "replace",
        text: "替换",
        inputs: [
          {
            text: "旧 Tracker",
            name: "origUrl",
          },
          {
            text: "新 Tracker",
            name: "newUrl",
          },
        ],
      },
      // 子串替换
      {
        name: "partialReplace",
        text: "子串替换",
        inputs: [
          {
            text: "旧字符串",
            name: "origUrl",
          },
          {
            text: "新字符串",
            name: "newUrl",
          },
        ],
      },
      // 添加
      {
        name: "add",
        text: "添加",
        inputs: [
          {
            text: "添加 Tracker",
            name: "trackerUrl",
          },
        ],
      },
      // 删除
      {
        name: "remove",
        text: "删除",
        inputs: [
          {
            text: "删除 Tracker，输入 **** 可清空所有 Tracker",
            name: "trackerUrl",
          },
        ],
      },
    ];

    $tab = null;
    $body = null;
    curSelect = null;
    curOption = null;

    // 初始
    constructor() {
      this.$tab = $n(".act-tab");
      this.$body = $n(".act-body");
      this.$tip = $n(".js-tip-btn");

      this.schemaForm.forEach((option) => {
        const { radioInput, label } = this.createRadioInput(option);
        this.$tab.appendChild(radioInput);
        this.$tab.appendChild(label);
        this.$tab.appendChild(document.createElement("br"));
      });
      this.updateFormBody("replace"); // Default load
    }

    createRadioInput(option) {
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = option.name;
      radioInput.name = "action";
      radioInput.value = option.name;
      radioInput.dataset.text = option.text;
      // Default select "replace"
      if (option.name === "replace")
        radioInput.checked = true;

      const label = document.createElement("label");
      label.htmlFor = option.name;
      label.textContent = option.text;

      const _this = this;
      radioInput.addEventListener("change", function () {
        if (this.checked) {
          // 如果选择子串替换，弹出确认
          if (this.value === "partialReplace") {
            const confirmed = confirm("子串替换模式用于将 Tracker 中的某个子串替换为另一个子串，是否继续？");
            if (!confirmed) {
              // 用户取消，切换回替换模式
              const replaceRadio = document.getElementById("replace");
              if (replaceRadio) {
                replaceRadio.checked = true;
                _this.updateFormBody("replace");
              }
              return;
            }
          }
          _this.updateFormBody(this.value);
        }
      });

      return { radioInput, label };
    }

    updateFormBody(selectedName) {
      const selectedOption = this.schemaForm.find(option => option.name === selectedName);
      this.$body.innerHTML = ""; // Clear current form
      this.$tip.innerHTML = `当前操作：${selectedOption.text}`;

      selectedOption.inputs.forEach((input) => {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.name = input.name;
        inputField.placeholder = input.text;
        inputField.classList.add("js-input");
        inputField.style = "width: 95%;";

        const p = document.createElement("p");
        p.appendChild(inputField);
        this.$body.appendChild(p);
      });

      const $submit = document.createElement("input");
      $submit.value = selectedOption.text;
      $submit.type = "button";
      // 设置 class
      $submit.className = "btn btn-act";
      this.$body.appendChild($submit);

      this.curSelect = selectedName;
      this.curOption = selectedOption;
    }

    getFormData() {
      const data = {};
      this.curOption.inputs.forEach((input) => {
        const $input = $n(`.js-input[name="${input.name}"]`);
        if ($input) {
          data[input.name] = $input.value.trim();
        }
      });
      data.filter = $n(".js-input[name=filter]").value.trim();
      return data;
    }
  }

  class HttpRequest {
    constructor() {
      if (typeof GM_xmlhttpRequest === "undefined") {
        throw new TypeError("GM_xmlhttpRequest is not defined");
      }
    }

    get(url, headers = {}) {
      return this.request({
        method: "GET",
        url,
        headers,
      });
    }

    post(url, data = {}, headers = {}) {
      const formData = new FormData();

      for (const key in data) {
        formData.append(key, data[key]);
      }

      return this.request({
        method: "POST",
        url,
        data: formData,
        headers,
      });
    }

    request(options) {
      return new Promise((resolve, reject) => {
        const requestOptions = Object.assign({}, options);

        requestOptions.onload = function (res) {
          resolve(res);
        };

        requestOptions.onerror = function (error) {
          reject(error);
        };

        GM_xmlhttpRequest(requestOptions);
      });
    }
  }

  // 导出实例对象
  const http = new HttpRequest();

  function fnSetRule(gob, MiKanUrl) {
    const $inputGroup = $n(".js-input-group.alignRight");
    if (!$inputGroup) {
      return;
    }
    $inputGroup.innerHTML = `
    <label>
      自动下载规则名称：
      <input type="text" class="js-rule-name" placeholder="规则名称" style="width: 120px; margin-right: 8px;">
    </label>
    <label>
      自动下载规则定义：
      <input type="text" class="js-rule-def" placeholder="正则表达式" style="width: 200px; margin-right: 8px;">
    </label>
    <button class="js-add-rule-btn">添加自动下载规则</button>
  `;
    const $btn = $n(".js-add-rule-btn");

    $btn.addEventListener("click", () => {
      const ruleName = $n(".js-rule-name").value.trim();
      const regRule = $n(".js-rule-def").value.trim();
      if (!ruleName || !regRule) {
        alert("请填写完整的规则名称和规则定义");
        return;
      }
      // 生成规则定义
      const ruleDef = {
        affectedFeeds: [MiKanUrl],
        assignedCategory: ruleName,
        enabled: true,
        mustContain: regRule,
        useRegex: true,
      };
      // 判断分类是否存在，不存在则创建
      if (!gob.data.categories.includes(ruleName)) {
        gob.apiCreateCategory(ruleName, () => {
          gob.data.categories.push(ruleName);
          // _log(`已创建分类：${ruleName}`);
        });
      }
      setTimeout(() => {
        // 添加规则
        gob.apiRssSetRule(ruleName, JSON.stringify(ruleDef), () => {
          alert(`已添加自动下载规则：${ruleName} -> ${JSON.stringify(ruleDef)}`);
        });
      }, 500);
    });
  }

  function registerRssAutoDlBtn(gob, $rssBtn) {
    if ($rssBtn.dataset.registered) {
      return;
    }

    let MiKanUrl = "";
    // 获取 RSS 订阅
    gob.apiRssFeeds((res) => {
      for (const name in res) {
        if (!Object.hasOwn(res, name))
          continue;
        const item = res[name];
        // _log(name, item);
        if (name.includes("Mikan")) {
          MiKanUrl = item.url;
        }
      }
      // console.log(MiKanUrl);
    });

    // 获取分类列表
    gob.apiCategories((res) => {
      gob.data.categories = Object.keys(res);
    });

    $rssBtn.dataset.registered = "1";

    if ($n("button.js-set-rule")) {
      return;
    }

    // 用于插入表单的 div
    const div = document.createElement("div");
    div.classList.add("js-input-group", "alignRight");
    div.style.marginRight = "8px";
    div.style.display = "inline-block";
    // div.textContent = " （占位）";
    $n("#rssDownloaderButton").after(div);

    // #rssDownloaderButton 前添加一个按钮
    const btn = document.createElement("button");
    btn.innerHTML = "→ 添加自动下载规则 ←";
    btn.classList.add("alignRight", "js-set-rule");
    btn.style.marginRight = "4px";
    btn.addEventListener("click", () => {
      if (!MiKanUrl) {
        alert("未找到 Mikan RSS 订阅地址");
        return;
      }
      // 点击 Mikan 订阅行
      const $tr = Array.from($na("#rssFeedTableDiv tbody tr")).find((tr) => {
        return tr.textContent.includes("Mikan");
      });
      // console.log($tr);
      $tr.click();
      btn.classList.add("disabled", "mz-hidden");
      fnSetRule(gob, MiKanUrl);
    });
    $n("#rssDownloaderButton").after(btn);
  }

  var tplEdt = "<div class=\"mz-edt\">\n  <div class=\"act-tab\" style=\"display: flex;\">操作模式：</div>\n  <hr>\n  <h2>「标签」或「分类」（区分大小写，标签仅在 v2.8.3 以上版本有效）: </h2>\n  <p>\n    <input class=\"js-input\" type=\"text\" name=\"filter\" style=\"width: 97%;\" placeholder=\"包含要修改项目的「标签」或「分类」，或新建一个\">\n  </p>\n  <h2>Tracker: <span class=\"js-tip-btn\"></span></h2>\n  <div class=\"act-body\"></div>\n  <p class=\"pb-less text-16\">「<a target=\"_blank\" title=\"投喂支持\" href=\"https://afdian.com/a/wdssmq\" rel=\"nofollow\">打钱给作者-爱发电</a>」\n    「<a target=\"_blank\" title=\"QQ 群 - 我的咸鱼心\" href=\"https://jq.qq.com/?_wv=1027&k=SRYaRV6T\" rel=\"nofollow\">QQ 群 - 我的咸鱼心</a>」\n  </p>\n  <hr>\n  <p class=\"pb-less p-bold\">选中要操作的 Torrent 任务（可多选），右键里「标签」或「分类」添加或指定，建议用「标签」；</p>\n  <p class=\"pb-less\">「替换」时请使用完整地址，或者使用「子串替换」；</p>\n  <p class=\"pb-less\">特殊需求可「删除」→填入「****」清空旧的后「添加」新的；</p>\n</div>\n";

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".mz-edt {\n  padding: 13px 23px;\n  font-size: 14px;\n  line-height: 20px\n}\n\n.mz-edt .text-16 {\n  font-size: 16px;\n  line-height: 24px\n}\n\n.mz-edt .p-bold {\n  font-weight: 700;\n  border-bottom: 1px solid currentColor;\n  margin-bottom: 4px;\n  padding-bottom: 0;\n}\n\n.mz-edt p.pb-less {\n  padding-bottom: 3px\n}\n\n.mz-hidden {\n  display: none !important;\n}\n";
  styleInject(css_248z);

  /* global __GM_api, MochaUI */


  if (typeof __GM_api !== "undefined") {
    _log(__GM_api);
  }

  const gob = {
    data: {
      qbtVer: sessionStorage.qbtVersion,
      apiVer: "2.x",
      apiBase: `${curUrl}api/v2/`,
      listTorrent: [],
      curTorrentTrackers: [],
      tips: {
        tit: {},
        btn: {},
      },
      modalShow: false,
      categories: [],
    },
    http,
    // 解析返回
    parseReq(res, type = "text") {
      // _log(res.finalUrl, "\n", res.status, res.response);
      if (res.status !== 200) {
        throw new Error("API Http Request Err");
      }
      if (type === "json") {
        return JSON.parse(res.response);
      }
      else {
        return res.response;
      }
    },
    // /api/v2/APIName/methodName
    apiUrl(method = "app/webapiVersion") {
      return gob.data.apiBase + method;
    },
    // 判断 API 是否支持 tag 查询（2.8.3 及以上）
    apiSupportsTag(min = "2.8.3") {
      const ver = gob.data.apiVer || "";
      const parse = s => s.split(".").map(n => Number.parseInt(n, 10) || 0);
      const a = parse(ver);
      const b = parse(min);
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const ai = a[i] || 0;
        const bi = b[i] || 0;
        if (ai > bi)
          return true;
        if (ai < bi)
          return false;
      }
      return true;
    },
    // 获取种子列表: torrents/info?tag=test 或 category=test (2.8.3+)
    apiTorrents(filter = "", fn = () => { }) {
      // category 查询
      const tryCategory = () => {
        const url = gob.apiUrl(`torrents/info?category=${filter}`);
        gob.http.get(url).then((res) => {
          gob.data.listTorrent = gob.parseReq(res, "json");
          fn();
        }).catch(() => {
          gob.data.listTorrent = [];
          fn();
        });
      };
      // tag 查询
      const tryTag = () => {
        const url = gob.apiUrl(`torrents/info?tag=${filter}`);
        gob.http.get(url).then((res) => {
          const list = gob.parseReq(res, "json");
          if (list.length > 0) {
            gob.data.listTorrent = list;
            fn();
          }
          else {
            tryCategory();
          }
        }).catch(tryCategory);
      };
      if (filter) {
        // tag 参数自 v2.8.3 支持，低版本使用 category 查询
        if (gob.apiSupportsTag()) {
          tryTag();
        }
        else {
          tryCategory();
        }
      }
    },
    // 获取指定种子的 Trackers: torrents/trackers
    apiGetTrackers(hash, fn = () => { }) {
      const url = gob.apiUrl(`torrents/trackers?hash=${hash}`);
      gob.http.get(url).then((res) => {
        _log("apiGetTrackers()\n", hash, gob.parseReq(res, "json"));
        gob.data.curTorrentTrackers = gob.parseReq(res, "json");
      }).finally(fn);
    },
    // 替换 Tracker: torrents/editTracker
    apiEdtTracker(hash, origUrl, newUrl, isPartial = false) {
      _log("apiEdtTracker()\n", hash, origUrl, newUrl);
      const url = gob.apiUrl("torrents/editTracker");
      if (isPartial) {
        gob.apiGetTrackers(hash, () => {
          const seedTrackers = gob.data.curTorrentTrackers;
          seedTrackers.forEach((tracker) => {
            if (tracker.url.includes(origUrl)) {
              const updatedUrl = tracker.url.replace(origUrl, newUrl);
              gob.http.post(url, { hash, origUrl: tracker.url, newUrl: updatedUrl });
            }
          });
        });
      }
      else {
        gob.http.post(url, { hash, origUrl, newUrl });
      }
    },
    // 添加 Tracker: torrents/addTrackers
    apiAddTracker(hash, urls) {
      const url = gob.apiUrl("torrents/addTrackers");
      gob.http.post(url, { hash, urls });
    },
    // 删除 Tracker: torrents/removeTrackers
    apiDelTracker(hash, urls) {
      const url = gob.apiUrl("torrents/removeTrackers");
      gob.http.post(url, { hash, urls });
    },

    // 获取分类列表
    apiCategories(fn = () => { }) {
      const url = gob.apiUrl("torrents/categories");
      gob.http.get(url).then((res) => {
        // _log("apiCategories()\n", gob.parseReq(res, "json"));
        return gob.parseReq(res, "json");
      }).then(fn);
    },

    // 创建分类
    apiCreateCategory(name, fn = () => { }) {
      const url = gob.apiUrl("torrents/createCategory");
      gob.http.post(url, { category: name }).then((res) => {
        _log("apiCreateCategory()\n", gob.parseReq(res));
        return gob.parseReq(res);
      }).finally(fn);
    },

    // 获取 RSS 订阅
    apiRssFeeds(fn = () => { }) {
      const url = gob.apiUrl("rss/items");
      gob.http.get(url).then((res) => {
        // _log("apiRssFeeds()\n", gob.parseReq(res, "json"));
        return gob.parseReq(res, "json");
      }).then(fn);
    },

    // RSS 自动下载规则
    apiRssSetRule(ruleName, ruleDef, fn = () => { }) {
      const url = gob.apiUrl("rss/setRule");
      gob.http.post(url, { ruleName, ruleDef }).then((res) => {
        _log("apiRssSetRule()\n", gob.parseReq(res));
      }).finally(fn);
    },

    // 获取 API 版本信息
    apiInfo(fn = () => { }) {
      const url = gob.apiUrl();
      gob.http.get(url).then((res) => {
        gob.data.apiVer = gob.parseReq(res);
      }).finally(fn);
    },
    // 显示提示信息到页面
    viewTips() {
      if (!gob.data.modalShow) {
        return;
      }
      for (const key in gob.data.tips) {
        if (Object.hasOwnProperty.call(gob.data.tips, key)) {
          const tip = gob.data.tips[key];
          const $el = $n(`.js-tip-${key}`);
          const text = JSON.stringify(tip).replace(/(,|:)"/g, "$1 ").replace(/["{}]/g, "");
          if (text) {
            $el.textContent = `(${text})`;
          }
          if (key === "btn") {
            $el.style.color = "var(--color-text-red)";
          }
        }
      }
    },
    // 更新提示信息
    upTips(key = "tit", tip) {
      const tipData = gob.data.tips[key];
      Object.assign(tipData, tip);
      gob.viewTips();
    },
    init() {
      gob.apiInfo(() => {
        _log(gob.data);
      });
    },
  };

  gob.init();

  // 构建编辑入口
  $n("#desktopNavbar ul").insertAdjacentHTML(
    "beforeend",
    "<li><a class=\"js-modal\"><b>→批量替换 Tracker←</b></a></li>",
  );

  // js-modal 绑定点击事件
  $n(".js-modal").addEventListener("click", () => {
    new MochaUI.Window({
      id: "js-modal",
      title: "批量替换 Tracker <span class=\"js-tip-tit\"></span>",
      loadMethod: "iframe",
      contentURL: "",
      scrollbars: true,
      resizable: true,
      maximizable: false,
      closable: true,
      paddingVertical: 0,
      paddingHorizontal: 0,
      width: 500,
      height: 360,
    });
    // console.log(modal);

    const modalContent = $n("#js-modal_content");
    modalContent.innerHTML = tplEdt;
    const modalContentWrapper = $n("#js-modal_contentWrapper");
    modalContentWrapper.style.height = "auto";
    gob.data.modalShow = true;
    gob.upTips("tit", {
      qbt: gob.data.qbtVer,
      api: gob.data.apiVer,
    });

    // 初始化表单
    gob.formObj = new DefForm();

    // debug
    // $n(".js-input[name=category]").value = "test";
    // $n(".js-input[name=origUrl]").value = "123";
    // $n(".js-input[name=newUrl]").value = "456";
    // $n(".js-input[name=matchSubstr]").click();
  });

  function fnCheckUrl(name, url) {
    // 判断是否以 udp:// 或 http(s):// 开头
    const regex = /^(?:udp|https?):\/\//;
    return [
      name,
      regex.test(url),
    ];
  }

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-act")) {
      gob.act = gob.formObj.curSelect;
      gob.urlCheck = [];
      const formData = gob.formObj.getFormData();
      // 判断筛选条件
      if (!formData.filter || /全部|未分类|无标签/.test(formData.filter)) {
        gob.upTips("btn", {
          msg: "「标签」或「分类」错误，请重新输入",
        });
        return;
      }
      // 遍历数据，如果 key 含有 Url，则判断 value 是否符合要求
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          const value = formData[key];
          if (key.includes("Url")) {
            // 判断是否符合要求
            gob.urlCheck.push(fnCheckUrl(key, value));
          }
        }
      }

      let isOk = gob.urlCheck.every((item) => {
        return item[1];
      });

      if (gob.act === "partialReplace") {
        const isOk2 = gob.urlCheck.every((item) => {
          return !item[1];
        });
        if (!isOk && !isOk2) {
          gob.upTips("btn", {
            msg: "子串替换模式下，请对应输入要替换的新旧文本",
          });
          return;
        }
      }

      if (gob.act === "remove" && formData.trackerUrl === "****") {
        isOk = confirm("继续将清空匹配任务的全部 Tracker");
        gob.act = "removeAll";
      }

      if (!isOk) {
        gob.urlCheck.forEach((item) => {
          if (!item[1]) {
            gob.upTips("btn", {
              msg: `「${item[0]}」不符合要求`,
            });
          }
        });
        return;
      }

      const fnRemoveAll = (hash) => {
        gob.apiGetTrackers(hash, () => {
          const seedTrackers = gob.data.curTorrentTrackers;
          const seedTrackersUrl = seedTrackers.map((item) => {
            return item.url;
          });
          gob.apiDelTracker(hash, seedTrackersUrl.join("|"));
        });
      };

      gob.apiTorrents(formData.filter, () => {
        const list = gob.data.listTorrent;
        _log("apiTorrents()\n", list);
        if (list.length === 0) {
          gob.upTips("btn", {
            msg: "没有符合条件的种子，请确认分类存在且添加要修改的任务项；",
          });
          return;
        }
        list.forEach((item) => {
          switch (gob.act) {
            case "replace":
              gob.apiEdtTracker(item.hash, formData.origUrl, formData.newUrl, false);
              break;
            case "partialReplace":
              gob.apiEdtTracker(item.hash, formData.origUrl, formData.newUrl, true);
              break;
            case "add":
              gob.apiAddTracker(item.hash, formData.trackerUrl);
              break;
            case "remove":
              gob.apiDelTracker(item.hash, formData.trackerUrl);
              break;
            case "removeAll":
              fnRemoveAll(item.hash);
              break;
          }
        });
        gob.upTips("btn", {
          num: list.length,
          msg: "操作完成",
        });
      });
    }
    // RSS 自动下载规则按钮
    if (event.target.textContent.trim() === "RSS") {
      registerRssAutoDlBtn(gob, event.target);
    }
  });

})();
