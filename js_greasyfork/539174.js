// ==UserScript==
// @name         [xyg] qBittorrent Tracker批量操作脚本
// @namespace    https://github.com/fleapo
// @version      1.0.2
// @author       fleapo
// @description  通过 WebUI 的 API 批量替换 Tracker, 基于"「水水」qBittorrent 管理脚本"修改
// @license      MIT
// @null     ----------------------------
// @link     https://github.com/fleapo/qb_tracker_tool
// @null     ----------------------------
// @noframes
// @run-at       document-end
// @include      http://*:8080/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/539174/%5Bxyg%5D%20qBittorrent%20Tracker%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/539174/%5Bxyg%5D%20qBittorrent%20Tracker%E6%89%B9%E9%87%8F%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
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

  class HttpRequest {
    constructor() {
      if (typeof GM_xmlhttpRequest === "undefined") {
        throw new Error("GM_xmlhttpRequest is not defined");
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

        requestOptions.onload = function(res) {
          resolve(res);
        };

        requestOptions.onerror = function(error) {
          reject(error);
        };

        GM_xmlhttpRequest(requestOptions);
      });
    }
  }

  // 导出实例对象
  const http = new HttpRequest();

  class defForm {
    schemaForm = [
      // 替换
      {
        "name": "replace",
        "text": "替换",
        "inputs": [
          {
            "text": "旧 Tracker",
            "name": "origUrl",
            "type": "text",
          },
          {
            "text": "新 Tracker（每行一个，支持多个）",
            "name": "newUrl",
            "type": "textarea",
          },
        ],
      },
      // 添加
      {
        "name": "add",
        "text": "添加",
        "inputs": [
          {
            "text": "添加 Tracker（每行一个，支持多个）",
            "name": "trackerUrl",
            "type": "textarea",
          },
        ],
      },
      // 删除
      {
        "name": "remove",
        "text": "删除",
        "inputs": [
          {
            "text": "删除 Tracker，输入 **** 可清空所有 Tracker",
            "name": "trackerUrl",
            "type": "text",
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
      if (option.name === "replace") radioInput.checked = true;

      const label = document.createElement("label");
      label.htmlFor = option.name;
      label.textContent = option.text;

      const _this = this;
      radioInput.addEventListener("change", function() {
        if (this.checked) {
          _this.updateFormBody(this.value);
        }
      });

      return { radioInput, label };
    }

    updateFormBody(selectedName) {
      const selectedOption = this.schemaForm.find(option => option.name === selectedName);
      this.$body.innerHTML = ""; // Clear current form

      selectedOption.inputs.forEach((input) => {
        let inputField;
        if (input.type === "textarea") {
          inputField = document.createElement("textarea");
          inputField.rows = 4;
          inputField.style = "width: 95%; resize: vertical;";
        } else {
          inputField = document.createElement("input");
          inputField.type = "text";
          inputField.style = "width: 95%;";
        }

        inputField.name = input.name;
        inputField.placeholder = input.text;
        inputField.classList.add("js-input");

        const label = document.createElement("label");
        // label.textContent = input.text;
        label.appendChild(inputField);
        this.$body.appendChild(label);
        this.$body.appendChild(document.createElement("br"));
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

      // 获取筛选类型和对应的值
      const filterType = document.querySelector('input[name="filterType"]:checked').value;
      data.filterType = filterType;

      if (filterType === "category") {
        const categoryInput = $n(".js-input[name=category]");
        data.category = categoryInput ? categoryInput.value.trim() : "";
      } else {
        const tagInput = $n(".js-input[name=tag]");
        data.tag = tagInput ? tagInput.value.trim() : "";
      }

      return data;
    }
  }

  /* global jQuery, __GM_api, MochaUI */


  if (typeof __GM_api !== "undefined") {
    _log(__GM_api);
  }

  const gob = {
    data: {
      qbtVer: sessionStorage.qbtVersion,
      apiVer: "2.x",
      apiBase: curUrl + "api/v2/",
      listTorrent: [],
      curTorrentTrackers: [],
      tips: {
        tit: {},
        btn: {},
      },
      modalShow: false,
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
      } else {
        return res.response;
      }
    },
    // /api/v2/APIName/methodName
    apiUrl(method = "app/webapiVersion") {
      return gob.data.apiBase + method;
    },
    // 获取种子列表: torrents/info?&category=test 或 torrents/info?&tag=test
    apiTorrents(filterType = "category", filterValue = "", fn = () => { }) {
      let url;
      if (filterType === "tag") {
        url = gob.apiUrl(`torrents/info?tag=${filterValue}`);
      } else {
        url = gob.apiUrl(`torrents/info?category=${filterValue}`);
      }
      gob.http.get(url).then((res) => {
        gob.data.listTorrent = gob.parseReq(res, "json");
      }).finally(fn);
    },
    // 获取指定种子的 Trackers: torrents/trackers
    apiGetTrackers(hash, fn = () => { }) {
      const url = gob.apiUrl(`torrents/trackers?hash=${hash}`);
      gob.http.get(url).then((res) => {
        _log("apiGetTrackers()\n", hash, gob.parseReq(res, "json"));
        gob.data.curTorrentTrackers = gob.parseReq(res, "json");
      }).finally(fn);
    },
    // 替换 Tracker: torrents/editTracker (支持多个新tracker)
    apiEdtTracker(hash, origUrl, newUrls, isPartial = false) {
      _log("apiEdtTracker()\n", hash, origUrl, newUrls);
      const url = gob.apiUrl("torrents/editTracker");

      // 将newUrls按行分割，过滤空行
      const urlList = newUrls.split('\n').map(url => url.trim()).filter(url => url);

      if (isPartial) {
        gob.apiGetTrackers(hash, () => {
          const seedTrackers = gob.data.curTorrentTrackers;
          seedTrackers.forEach((tracker) => {
            if (tracker.url.includes(origUrl)) {
              // 对于部分匹配，只替换第一个新URL
              if (urlList.length > 0) {
                const updatedUrl = tracker.url.replace(origUrl, urlList[0]);
                gob.http.post(url, { hash, origUrl: tracker.url, newUrl: updatedUrl });

                // 如果有多个新URL，添加其余的
                for (let i = 1; i < urlList.length; i++) {
                  const additionalUrl = tracker.url.replace(origUrl, urlList[i]);
                  gob.apiAddTracker(hash, additionalUrl);
                }
              }
            }
          });
        });
      } else {
        // 对于完全匹配，先替换第一个，然后添加其余的
        if (urlList.length > 0) {
          gob.http.post(url, { hash, origUrl, newUrl: urlList[0] });

          // 添加其余的tracker
          for (let i = 1; i < urlList.length; i++) {
            gob.apiAddTracker(hash, urlList[i]);
          }
        }
      }
    },
    // 添加 Tracker: torrents/addTrackers (支持多个tracker)
    apiAddTracker(hash, urls) {
      const url = gob.apiUrl("torrents/addTrackers");

      // 如果urls是字符串，按行分割并过滤空行
      let urlList;
      if (typeof urls === 'string') {
        urlList = urls.split('\n').map(url => url.trim()).filter(url => url);
        urls = urlList.join('\n');
      }

      gob.http.post(url, { hash, urls });
    },
    // 删除 Tracker: torrents/removeTrackers
    apiDelTracker(hash, urls) {
      const url = gob.apiUrl("torrents/removeTrackers");
      gob.http.post(url, { hash, urls });
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
          $el.innerText = `(${text})`;
        }
      }
    },
    // 更新提示信息
    upTips(key = "tit", tip) {
      const tipData = gob.data.tips[key];
      Object.assign(tipData, tip);
      gob.viewTips();
    },
    // 预览功能：获取种子列表和tracker信息
    apiPreview(filterType, filterValue, fn = () => { }) {
      this.apiTorrents(filterType, filterValue, () => {
        const list = gob.data.listTorrent;
        if (list.length === 0) {
          fn([]);
          return;
        }

        // 获取每个种子的tracker信息
        let completedCount = 0;
        const previewData = [];

        list.forEach((torrent, index) => {
          gob.apiGetTrackers(torrent.hash, () => {
            previewData[index] = {
              name: torrent.name,
              hash: torrent.hash,
              trackers: [...gob.data.curTorrentTrackers]
            };
            completedCount++;

            if (completedCount === list.length) {
              fn(previewData.filter(item => item)); // 过滤undefined项
            }
          });
        });
      });
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

  // 构建编辑框
  const strHtml = `
<div style="padding:13px 23px;">\
    <div class="act-tab" style="display: flex;">操作模式：</div>\
    <hr>
    <div style="margin-bottom: 10px;">\
        <label style="margin-right: 15px;"><input type="radio" name="filterType" value="category" checked> 按分类筛选</label>\
        <label><input type="radio" name="filterType" value="tag"> 按标签筛选</label>\
    </div>\
    <div id="categorySection">\
        <h2>分类: （不能是「全部」或「未分类」，区分大小写）</h2>\
        <input class="js-input" type="text" name="category" style="width: 80%;" placeholder="包含要修改项目的分类或新建一个">\
        <button type="button" class="btn-preview" style="margin-left: 5px;">预览</button>\
    </div>\
    <div id="tagSection" style="display: none;">\
        <h2>标签: （输入标签名称，区分大小写）</h2>\
        <input class="js-input" type="text" name="tag" style="width: 80%;" placeholder="输入要筛选的标签名称">\
        <button type="button" class="btn-preview" style="margin-left: 5px;">预览</button>\
    </div>\
    <div id="previewSection" style="display: none; margin: 10px 0; padding: 10px; border: 1px solid #ccc; background: #f9f9f9;">\
        <h3>Tracker 预览：</h3>\
        <div id="previewContent" style="max-height: 180px; overflow-y: auto; border: 1px solid #ddd; background: #fff; padding: 5px;"></div>\
    </div>\
    <h2>Tracker: <span class="js-tip-btn"></span></h2>\
    <div class="act-body"></div>\

</div>
`;

  // js-modal 绑定点击事件
  $n(".js-modal").addEventListener("click", function() {
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
      width: 650,
      height: 500,
    });
    const modalContent = $n("#js-modal_content");
    modalContent.innerHTML = strHtml;
    const modalContentWrapper = $n("#js-modal_contentWrapper");
    modalContentWrapper.style.height = "auto";
    gob.data.modalShow = true;
    gob.upTips("tit", {
      qbt: gob.data.qbtVer,
      api: gob.data.apiVer,
    });

    // 初始化表单
    gob.formObj = new defForm();

    // 添加筛选类型切换事件监听
    const filterTypeRadios = document.querySelectorAll('input[name="filterType"]');
    const categorySection = document.getElementById('categorySection');
    const tagSection = document.getElementById('tagSection');
    const previewSection = document.getElementById('previewSection');

    filterTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'category') {
          categorySection.style.display = 'block';
          tagSection.style.display = 'none';
        } else {
          categorySection.style.display = 'none';
          tagSection.style.display = 'block';
        }
        // 切换筛选类型时隐藏预览
        previewSection.style.display = 'none';
      });
    });

    // 添加预览按钮事件监听
    const previewButtons = document.querySelectorAll('.btn-preview');
    previewButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const filterType = document.querySelector('input[name="filterType"]:checked').value;
        let filterValue = '';

        if (filterType === 'category') {
          const categoryInput = document.querySelector('input[name="category"]');
          filterValue = categoryInput ? categoryInput.value.trim() : '';
          if (!filterValue || filterValue === "全部" || filterValue === "未分类") {
            alert('请输入有效的分类名称');
            return;
          }
        } else {
          const tagInput = document.querySelector('input[name="tag"]');
          filterValue = tagInput ? tagInput.value.trim() : '';
          if (!filterValue) {
            alert('请输入标签名称');
            return;
          }
        }

        // 显示加载状态
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = '正在加载...种子数量大时，可能需要稍等一下...';
        previewSection.style.display = 'block';

        // 调用预览API
        gob.apiPreview(filterType, filterValue, (previewData) => {
          if (previewData.length === 0) {
            previewContent.innerHTML = `<p style="color: #666;">未找到符合条件的种子</p>`;
            return;
          }

          // 收集所有有效的tracker信息，过滤掉已禁用的
          const allTrackers = [];
          let totalTrackerCount = 0;

          previewData.forEach((item) => {
            item.trackers.forEach((tracker) => {
              totalTrackerCount++;
              // 只收集有效的tracker（状态不是已禁用）
              // qBittorrent中，status: 0=已禁用, 1=未联系, 2=工作中, 3=更新中, 4=已联系未生效
              if (tracker.status !== 0) { // 过滤掉已禁用的tracker
                allTrackers.push({
                  url: tracker.url,
                  status: tracker.status,
                  msg: tracker.msg || ''
                });
              }
            });
          });

          // 按URL去重，但保留状态信息
          const uniqueTrackers = [];
          const seenUrls = new Set();

          allTrackers.forEach(tracker => {
            if (!seenUrls.has(tracker.url)) {
              seenUrls.add(tracker.url);
              uniqueTrackers.push(tracker);
            }
          });

          let html = `<p><strong>找到 ${previewData.length} 个种子，去重后，共 ${uniqueTrackers.length} 个有效tracker：</strong></p>`;

          if (uniqueTrackers.length === 0) {
            html += `<p style="color: #666;">没有找到有效的tracker</p>`;
          } else {
            html += `<div style="font-family: monospace; font-size: 12px; line-height: 1.6;">`;

            // 只显示tracker URL列表，简洁显示
            uniqueTrackers.sort((a, b) => a.url.localeCompare(b.url)).forEach((tracker, index) => {
              html += `<div style="margin: 2px 0; padding: 3px 6px; background: #fff; border-left: 3px solid #007cba;">`;
              html += `<span style="color: #666; font-weight: bold;">${index + 1}.</span> `;
              html += `<span style="word-break: break-all;">${tracker.url}</span>`;
              html += `</div>`;
            });

            html += `</div>`;
          }

          previewContent.innerHTML = html;
        });
      });
    });

    // debug
    // $n(".js-input[name=category]").value = "test";
    // $n(".js-input[name=origUrl]").value = "123";
    // $n(".js-input[name=newUrl]").value = "456";
    // $n(".js-input[name=matchSubstr]").click();
  });

  // // 自动点击
  // $n(".js-modal").click();

  const fnCheckUrl = (name, url) => {
    // 判断是否以 udp:// 或 http(s):// 开头
    const regex = /^(udp|http(s)?):\/\//;

    // 如果是多行URL，检查每一行
    if (url.includes('\n')) {
      const urls = url.split('\n').map(u => u.trim()).filter(u => u);
      const allValid = urls.every(u => regex.test(u));
      return [name, allValid];
    }

    return [
      name,
      regex.test(url),
    ];
  };

  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-act")) {
      gob.act = gob.formObj.curSelect;
      gob.urlCheck = [];
      const formData = gob.formObj.getFormData();

      // 判断筛选条件
      if (formData.filterType === "category") {
        if (!formData.category || formData.category === "全部" || formData.category === "未分类") {
          gob.upTips("btn", {
            num: 0,
            msg: "「分类」字段错误",
          });
          return;
        }
      } else {
        if (!formData.tag) {
          gob.upTips("btn", {
            num: 0,
            msg: "「标签」字段不能为空",
          });
          return;
        }
      }
      // 遍历数据，如果 key 含有 Url，则判断 value 是否符合要求
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          const value = formData[key];
          if (key.indexOf("Url") > -1) {
            // 判断是否符合要求
            gob.urlCheck.push(fnCheckUrl(key, value));
          }
        }
      }

      let isOk = gob.urlCheck.every(function(item) {
        return item[1];
      });

      if (!isOk && gob.act === "replace") {
        isOk = confirm("输入的 Tracker 未通过预检，是否尝试子串替换？");
        formData.isPartial = isOk;
      }

      if (gob.act === "remove" && formData.trackerUrl === "****") {
        isOk = confirm("继续将清空匹配任务的全部 Tracker");
        gob.act = "removeAll";
      }

      if (!isOk) {
        gob.urlCheck.map(function(item) {
          if (!item[1]) {
            gob.upTips("btn", {
              num: 0,
              msg: `「${item[0]}」不符合要求`,
            });
            return;
          }
        });
        return;
      }

      const fnRemoveAll = (hash) => {
        gob.apiGetTrackers(hash, () => {
          const seedTrackers = gob.data.curTorrentTrackers;
          const seedTrackersUrl = seedTrackers.map(function(item) {
            return item.url;
          });
          gob.apiDelTracker(hash, seedTrackersUrl.join("|"));
        });
      };

      // 根据筛选类型调用API
      const filterValue = formData.filterType === "category" ? formData.category : formData.tag;
      gob.apiTorrents(formData.filterType, filterValue, () => {
        const list = gob.data.listTorrent;
        _log("apiTorrents()\n", list);
        list.map(function(item) {
          switch (gob.act) {
            case "replace":
              gob.apiEdtTracker(item.hash, formData.origUrl, formData.newUrl, formData.isPartial);
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
      return;
    }
  });

})();
