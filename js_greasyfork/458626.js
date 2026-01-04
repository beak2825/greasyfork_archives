// ==UserScript==
// @name         阿里云盘助手
// @namespace    http://tampermonkey.net/
// @version      2.1.9
// @author       罗根大人
// @description  支持生成文件下载链接、修改文件后缀,支持第三方播放器Artplayer(突破视频2分钟限制,长按倍速,选集,历史播放)
// @license      MIT
// @icon         https://img.alicdn.com/imgextra/i1/O1CN01JDQCi21Dc8EfbRwvF_!!6000000000236-73-tps-64-64.ico
// @match        https://www.aliyundrive.com/*
// @match        https://www.alipan.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/vue/3.2.47/vue.global.min.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.3.4/axios.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/1.3.3/hls.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/artplayer/4.6.2/artplayer.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-plus/2.2.32/index.full.min.js
// @resource     element-plus/dist/index.css  https://cdn.bootcdn.net/ajax/libs/element-plus/2.2.32/index.min.css
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/458626/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458626/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(a=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=a,document.head.appendChild(e)})(".icon-wrapper--3dbbo[data-v-e5d83ee0]{height:28px;width:28px;display:-ms-flexbox;display:flex;border-radius:5px;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;color:var(--context_secondary);position:absolute;top:18px;right:16px;-webkit-transition:all .3s ease;-o-transition:all .3s ease;transition:all .3s ease;cursor:pointer;z-index:10}.notice2[data-v-e5d83ee0]{margin:2px 0 0;color:red;font-size:8pt}.close-icon--33bP0[data-v-e5d83ee0]{font-size:18px}.icon--d-ejA[data-v-e5d83ee0]{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;text-align:center}.content-wrapper--1_WJv[data-v-e5d83ee0]{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center}.notice[data-v-fac7ef86]{color:#6592f9;font-size:10pt}.notice1[data-v-fac7ef86]{margin:2px 0 0;color:#e6a23c;font-size:8pt}.notice2[data-v-fac7ef86]{margin:2px 0 0;color:red;font-size:8pt}.footer[data-v-fac7ef86]{height:68px;background:var(--background_secondary_blur);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);margin:-20px;padding:0 20px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;border-radius:0 0 10px 10px}.notice1[data-v-caf70c0e]{margin:2px 0 0;color:#e6a23c;font-size:8pt}.breadcrumb-item--tV9dn[data-v-caf70c0e]{font-size:12px}.td--SGrZj[data-v-caf70c0e]{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0;height:52px;position:relative}.td---v-kp[data-v-caf70c0e]{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0;padding:0 24px}.cover--Mn1Bt[data-v-caf70c0e]{margin-right:20px}.folder-cover--ExDmp[data-v-caf70c0e]{position:relative;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0;-ms-flex-positive:0;flex-grow:0}.folder-cover--ExDmp[data-size=XXS][data-v-caf70c0e],.folder-cover--ExDmp[data-size=XXS] .fileicon--Ob-Oj[data-v-caf70c0e]{width:28px;height:28px}.fileicon---webs[data-v-caf70c0e]{max-width:100%;max-height:100%}.breadcrumb-wrap--Uq5Lb[data-v-caf70c0e]{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;font-size:16px;line-height:1.4;width:100%;overflow:hidden;position:relative}.breadcrumb-wrap--Uq5Lb[data-align=left][data-v-caf70c0e]{-ms-flex-pack:start;justify-content:flex-start}.breadcrumb-wrap--Uq5Lb .breadcrumb--gnRPG[data-v-caf70c0e]{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;min-width:24px}.breadcrumb-item--j8J5H[data-v-caf70c0e]{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;white-space:nowrap;color:var(--context_tertiary);cursor:pointer}.breadcrumb-item--j8J5H:first-child .breadcrumb-item-link--9zcQY[data-v-caf70c0e]{font-weight:500}.breadcrumb-item--j8J5H .breadcrumb-item-link--9zcQY[data-v-caf70c0e]{font-weight:400;line-height:1.4;-webkit-transition:all .3s ease;-o-transition:all .3s ease;transition:all .3s ease}.breadcrumb-item--j8J5H .breadcrumb-item-separator--MnbFV[data-v-caf70c0e]{line-height:1.4;margin:0 8px}.card[data-v-d200ca3c]{margin-bottom:10px}.player[data-v-ee523f38]{display:flex;height:100%;align-items:center;justify-content:center;flex-direction:column}.notice[data-v-46fc6531]{color:#6592f9;font-size:8pt}.notice2[data-v-46fc6531]{color:red;font-size:8pt}.notice[data-v-4f08e60f]{color:#6592f9;font-size:10pt}.notice1[data-v-4f08e60f]{margin:2px 0 0;color:#e6a23c;font-size:8pt}.notice2[data-v-4f08e60f]{margin:2px 0 0;color:red;font-size:8pt}.footer[data-v-4f08e60f]{height:68px;background:var(--background_secondary_blur);-webkit-backdrop-filter:blur(30px);backdrop-filter:blur(30px);margin:-20px;padding:0 20px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;border-radius:0 0 10px 10px}");

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(elementPlus, $2, axios2, vue, Hls2, Artplayer2) {
  "use strict";
  var monkeyWindow = window;
  var unsafeWindow = /* @__PURE__ */ (() => {
    return monkeyWindow.unsafeWindow;
  })();
  var message = null;
  let showMessge = function(option) {
    try {
      message.close();
    } catch {
    }
    message = elementPlus.ElMessage(option);
  };
  let showError$1 = function(msg, timeout, option) {
    showMessge({
      message: msg,
      type: "error",
      duration: timeout || 3e3,
      ...option
    });
  };
  let showSuccess = function(msg, timeout, option) {
    showMessge({
      message: msg,
      type: "success",
      duration: timeout || 3e3,
      ...option
    });
  };
  let css = "padding: 20px;overflow:auto";
  let showDiv = function(title2, app) {
    function format(s2, c) {
      return s2.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      });
    }
    let html2 = `<div class="ant-modal-root ant-modal-Link"><div class="ant-modal-mask" style="z-index: 999999;"></div><div tabindex="-1" class="ant-modal-wrap" role="dialog"><div role="document" class="ant-modal modal-wrapper--5SA7y" style="width: 666px;"><div class="ant-modal-content"><div class="ant-modal-header"><div class="ant-modal-title" id="rcDialogTitle1">{title}</div></div><div class="ant-modal-body"><div class="icon-wrapper--TbIdu"><span data-role="icon" data-render-as="svg" data-icon-type="PDSClose" class="close-icon--KF5OX icon--D3kMk  "><svg viewBox="0 0 1024 1024"><use xlink:href="#PDSClose"></use></svg></span></div><div class="ant-modal-container" style="${css}">`;
    html2 = format(html2, {
      title: title2
    });
    html2 += "</div></div></div></div></div></div></div>";
    $2("body").append(html2);
    app.mount(
      (() => {
        const app2 = document.createElement("div");
        $2(".ant-modal-container").append(app2);
        return app2;
      })()
    );
    $2(".ant-modal-Link .icon-wrapper--TbIdu").one("click", function() {
      $2(".ant-modal-Link").remove();
      app.unmount();
    });
    $2(".ant-modal-Link .ant-modal-wrap").on("click", function(event) {
      if ($2(event.target).closest(".ant-modal-content").length === 0) {
        $2(".ant-modal-Link").remove();
        app.unmount();
      }
    });
  };
  class Store {
    constructor() {
      this.prefix = "LGZS_";
    }
    getAliyun(key2 = "") {
      let item = localStorage.getItem(key2);
      if (!item) {
        return "";
      }
      try {
        return JSON.parse(item);
      } catch (e) {
        return item;
      }
    }
    getItem(key2 = "") {
      return this.getAliyun(this.prefix + key2);
    }
    setItem(key2 = "", value) {
      localStorage.setItem(this.prefix + key2, value instanceof Object ? JSON.stringify(value) : value);
    }
    removeItem(key2) {
      if (key2 == null || key2 == "") {
        return;
      }
      localStorage.removeItem(this.prefix + key2);
    }
  }
  const store = new Store();
  const getDownloadUrl = (data) => axios2.post("/v2/file/get_download_url", data, {
    headers: {
      "x-canary": "client=windows,app=adrive,version=v4.9.12"
    }
  });
  const search = (data) => axios2.post("/adrive/v3/file/search", data, {
    headers: {
      "x-canary": "client=windows,app=adrive,version=v4.9.12"
    }
  });
  const videoUpdate = (data) => axios2.post("/adrive/v2/video/update", data);
  const deviceLogout = () => axios2.post({
    method: "post",
    url: "/users/v1/users/device_logout",
    data: {}
  });
  const homeWidgets = () => axios2.post("/apps/v1/users/home/widgets", { "context": { "recentUsed": { "limit": 20 }, "recentSaved": { "limit": 1 } } });
  const shareVideoInfo = (fileId, share_id, shareToken) => axios2({
    method: "post",
    url: "/v2/file/get_share_link_video_preview_play_info",
    data: {
      category: "live_transcoding",
      file_id: fileId,
      get_preview_url: true,
      share_id,
      template_id: "",
      get_subtitle_info: true
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "x-share-token": shareToken
    }
  });
  const videoPreviewPlayInfo = (data) => axios2.post("/v2/file/get_video_preview_play_info", data);
  const shareLinkDownloadUrl = (data, shareToken) => axios2({
    method: "post",
    url: "/v2/file/get_share_link_download_url",
    data: {
      ...data
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "x-share-token": shareToken,
      "_token": false
    }
  });
  const createSessionUrl = (data, signature2, deviceId) => axios2({
    method: "post",
    url: "/users/v1/users/device/create_session",
    data: {
      ...data
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "x-canary": "client=web,app=adrive,version=v4.9.0",
      "_token": false,
      "x-signature": signature2,
      "x-device-id": deviceId
    }
  });
  const signInList = () => axios2({
    method: "post",
    url: "https://member.aliyundrive.com/v1/activity/sign_in_list",
    data: {
      "_rx-s": "mobile"
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "_token": false
    }
  });
  const signInReward = (signInDay) => axios2({
    method: "post",
    url: "https://member.aliyundrive.com/v1/activity/sign_in_reward",
    data: {
      "signInDay": signInDay
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "_token": false
    }
  });
  function copy(obj) {
    if (typeof obj !== "object" || obj == null) {
      return;
    }
    var newobj = obj.constructor === Array ? [] : {};
    for (var i2 in obj) {
      newobj[i2] = typeof obj[i2] === "object" ? copy(obj[i2]) : obj[i2];
    }
    return newobj;
  }
  class User {
    constructor() {
      this.is_login = false;
      this.vip_status = 0;
      this.mid = "";
      this.uname = "";
      this.has_init = false;
      this.page = {
        id: "",
        order: "",
        order_by: "",
        // 当前路径文件夹名称
        folderName: "",
        items: []
      };
      this.video = {
        id: "",
        // 时长
        duration: "",
        // 播放的时长
        play_cursor: "",
        // 视频名称
        name: "",
        thumbnail: "",
        // 0 首页自己的视频 1分享的视频
        type: -1,
        //当前视频所在的文件夹名称
        folderName: "",
        //跳转地址
        href: "",
        drive_id: ""
      };
      this.sessionData = {
        authorization: "",
        deviceId: "",
        signature: ""
      };
    }
    getVideoPage() {
      return this.video;
    }
    /**
     * 获取自动签到设置
     * 
     */
    getSignInSet() {
      let config = store.getItem("signIn_config");
      return config == "" ? {} : config;
    }
    setSignInSet(signInInfo) {
      return store.setItem("signIn_config", signInInfo);
    }
    //保存当前播放器设置
    saveVideoPlayerSet(art) {
      let playerSet = {
        // 全屏
        fullscreen: art.fullscreen,
        //网页全屏
        fullscreenWeb: art.fullscreenWeb,
        // 播放速度
        playbackRate: art.playbackRate,
        // 清晰度
        qualityHtml: art.qualityHtml,
        //字幕大小
        subtitleSize: art.subtitleSize || 20,
        //字幕间距
        subtitleMargin: art.subtitleMargin || 0,
        //字幕偏移
        subtitleOffset: art.subtitleOffset || 0,
        //字幕颜色
        subtitleColor: art.subtitleColor || "#FFF"
      };
      store.setItem("playerSet", playerSet);
    }
    // 获取播放器设置页面
    getVideoPlayerSet() {
      let playerSet = store.getItem("playerSet");
      if (playerSet == "") {
        playerSet = {};
      }
      return playerSet;
    }
    // 查看用户是否已经同意 或者 配置了 获取session 所需要的浏览器名称
    isConfigSession() {
      let deviceName = store.getItem("deviceName");
      let modelName = store.getItem("modelName");
      return !(deviceName == "" || modelName == "");
    }
    // 保存视频信息
    saveVideoInfo(id, name2, progress, folderName, href, share2, play_cursor, drive_id) {
      let videoInfo = {
        "category": "video",
        "name": name2,
        "progress": progress,
        "id": id,
        "folderName": folderName,
        "href": href,
        "share": share2,
        "play_cursor": play_cursor,
        "drive_id": drive_id
      };
      let list = store.getItem("historyVideo");
      if (list == "") {
        list = [];
      }
      let newList = [videoInfo];
      list.forEach(function(item, index) {
        if (item.id !== id && newList.length <= 5) {
          newList.push(item);
        }
      });
      store.setItem("historyVideo", newList);
    }
    clearSession() {
      store.removeItem("LG_session");
      store.removeItem("LG_session_1");
      store.removeItem("LG_session_Ref");
      store.removeItem("x-device-id");
      store.removeItem("x-signature");
      store.removeItem("deviceName");
      store.removeItem("modelName");
      store.removeItem("signIn_config");
    }
    removeSession() {
      store.removeItem("LG_session");
    }
    clearAll() {
      user.clearSession();
      user.clearVideoHistory();
    }
    clearVideoHistory() {
      store.removeItem("historyVideo");
    }
    //获取视频历史列表
    getVideoLookList() {
      let historyVideo = store.getItem("historyVideo");
      if (historyVideo == "") {
        historyVideo = [];
      }
      return historyVideo;
    }
    getDeviceId() {
      return store.getItem("x-device-id");
    }
    getSignature() {
      return store.getItem("x-signature");
    }
    getPage() {
      var page = this.page;
      if (!page.items) {
        page.items = [];
      }
      return page;
    }
    getAria2Set() {
      let aria2Set = store.getItem("Aria2Set");
      if (aria2Set == "") {
        aria2Set = {
          link: "http://localhost:6800/jsonrpc",
          path: "D:/aliyundriveDownloads",
          token: "",
          dirCreate: false
        };
      }
      return aria2Set;
    }
    getVideoSet() {
      let videoSet = store.getItem("VideoSet");
      if (videoSet == "") {
        videoSet = {
          quality: null
        };
      }
      return videoSet;
    }
    setVideoSet(videoSet) {
      store.setItem("VideoSet", videoSet);
    }
    setAria2Set(aria2Set) {
      store.setItem("Aria2Set", aria2Set);
    }
    refSession() {
      let now = new Date().getTime();
      let time = store.getItem("LG_session") || 0;
      let token = user.getToken();
      if (token == null) {
        showError$1("获取当前凭证失败,请刷新或重新登录");
        return;
      } else if (!user.isExpires(token)) {
        showError$1("Token已失效,请刷新或重新登录");
        return;
      }
      let d = user.getDeviceId();
      let s2 = user.getSignature();
      if (now - time > 18e4 && token.user_id || d == "" || s2 == "") {
        store.setItem("LG_session", now);
        store.setItem("LG_session_Ref", "true");
      } else {
        console.log("未到刷新时间或者时机");
        return;
      }
      user.session(token, function(a, b) {
        store.setItem("LG_session", new Date().getTime());
        store.removeItem("LG_session_Ref");
      });
    }
    sessionSet(authorization, deviceId, signature2) {
      this.sessionData = {
        authorization,
        deviceId,
        signature: signature2
      };
      store.setItem("LG_session_1", this.sessionData);
    }
    GetSesion() {
      let data = this.sessionData;
      if (data.authorization == "") {
        let data1 = store.getItem("LG_session_1");
        if (data1 == "") {
          return data;
        }
        this.sessionData = data1;
        return data1;
      }
      return data;
    }
    session(token, callback) {
      if (token == null) {
        showError$1("刷新Session失败,token为空,请刷新或重新登录");
        return {};
      }
      return new Promise((resolve, reject) => {
        let deviceId = store.getAliyun("__ETAG__CNA__ID__");
        if (deviceId == "") {
          deviceId = token.user_id.split("").reverse().join("").substring(0, 20);
        }
        let userId = token.user_id;
        unsafeWindow.luoGenSession(function(key2, pubStr, signature2, nd) {
          deviceId = nd;
          console.log("你好,罗根！");
          let deviceName = store.getItem("deviceName");
          let modelName = store.getItem("modelName");
          createSessionUrl({
            "deviceName": deviceName,
            "modelName": modelName,
            "refreshToken": "71a164a40eb84a40b35c1a39d2023499",
            "pubKey": pubStr
          }, signature2, deviceId).then((res) => {
            if (!res.data.result) {
              user.clearSession();
              showError$1("设备超限,请下线其他设备,在刷新页面");
              elementPlus.ElMessageBox.alert("请点击左下角退出登陆那个菜单，点击登陆设备管理，下线其他设备。然后刷新页面", "设备超限", {
                confirmButtonText: "好的",
                callback: (action) => {
                }
              });
              return;
            }
            store.setItem("x-device-id", deviceId);
            store.setItem("x-signature", signature2);
            resolve({
              deviceId,
              signature: signature2
            });
            callback && callback(pubStr, signature2);
          }).catch((e) => {
            console.error("出现异常了...", e);
            user.clearSession();
            elementPlus.ElMessageBox.alert(e + "", "刷新session失败", {
              confirmButtonText: "刷新试一试",
              callback: (action) => {
                location.href = location.href;
              }
            });
            reject(e);
          });
        }, window.atob("NWRkZTRlMWJkZjllNDk2NmIzODdiYTU4ZjRiM2ZkYzM="), deviceId, userId);
      });
    }
    /**
     * 是否在首页
     */
    home() {
      return location.href.indexOf("/drive/file") > 0;
    }
    /**
     * 是否在资源库
     */
    resource() {
      return location.href.indexOf("/drive/file/resource") > 0;
    }
    // 没过期返回true 过期 false
    isExpires(item) {
      if (item == null || !item.expire_time) {
        return false;
      }
      let time = Date.parse(item.expire_time) - Date.now();
      return time > 0;
    }
    getShareToken() {
      return store.getAliyun("shareToken");
    }
    getToken() {
      let token = localStorage.getItem(`token`);
      if (token != null) {
        return JSON.parse(token);
      }
      return token;
    }
    // 获取当前页面上所有的文件
    getAllFileList() {
      let fileList2 = this.getPage().items;
      if (fileList2.length === 0) {
        console.error("获取文件列表失败");
        return [];
      }
      return copy(fileList2);
    }
    // 获取已选择的文件
    selectedFileList() {
      let jq = $2;
      let selectedFileList = [], fileList2 = this.getAllFileList();
      if (fileList2.length === 0) {
        console.error("获取文件列表失败");
        return [];
      }
      let node = "";
      if (jq(".tbody--Na444  .tr--Ogi-3.tr--97U9T").length) {
        node = jq(".tbody--Na444  .tr--Ogi-3.tr--97U9T");
      } else if (jq(".outer-wrapper--JCodp").length) {
        node = jq(".outer-wrapper--JCodp");
      }
      node.each(function(index) {
        var $this = jq(node[index]);
        if ($this.attr("data-is-selected") === "true") {
          let data_index = $this.closest("[data-index]").attr("data-index");
          data_index && selectedFileList.push(fileList2[data_index]);
        }
      });
      return copy(selectedFileList);
    }
  }
  const user = new User();
  /*! Element Plus Icons Vue v2.0.10 */
  var export_helper_default = (sfc, props) => {
    let target = sfc.__vccOpts || sfc;
    for (let [key2, val] of props)
      target[key2] = val;
    return target;
  };
  var refresh_vue_vue_type_script_lang_default = {
    name: "Refresh"
  };
  var _hoisted_1217 = {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, _hoisted_2217 = /* @__PURE__ */ vue.createElementVNode("path", {
    fill: "currentColor",
    d: "M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
  }, null, -1), _hoisted_3216 = [
    _hoisted_2217
  ];
  function _sfc_render217(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1217, _hoisted_3216);
  }
  var refresh_default = /* @__PURE__ */ export_helper_default(refresh_vue_vue_type_script_lang_default, [["render", _sfc_render217], ["__file", "refresh.vue"]]);
  const cssLoader = (e) => {
    const t2 = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t2, document.head.append(o), t2;
  };
  cssLoader("element-plus/dist/index.css");
  const Aria2Set_vue_vue_type_style_index_0_scoped_e5d83ee0_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key2, val] of props) {
      target[key2] = val;
    }
    return target;
  };
  const _withScopeId$4 = (n) => (vue.pushScopeId("data-v-e5d83ee0"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$6 = {
    key: 0,
    class: "ant-modal-root",
    id: "aria2-set-box"
  };
  const _hoisted_2$5 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "ant-modal-mask" }, null, -1));
  const _hoisted_3$5 = {
    tabindex: "-1",
    class: "ant-modal-wrap",
    role: "dialog",
    id: "aria2_set_LuoGen"
  };
  const _hoisted_4$5 = {
    role: "document",
    class: "ant-modal modal-wrapper--2yJKO",
    style: { "width": "340px", "transform-origin": "-14px 195px" }
  };
  const _hoisted_5$5 = { class: "ant-modal-content" };
  const _hoisted_6$5 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "ant-modal-header" }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "ant-modal-title" }, " Aria2设置 ")
  ], -1));
  const _hoisted_7$4 = { class: "ant-modal-body" };
  const _hoisted_8$4 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("span", {
    "data-role": "icon",
    "data-render-as": "svg",
    "data-icon-type": "PDSClose",
    class: "close-icon--33bP0 icon--d-ejA"
  }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      t: "1685717543646",
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "p-id": "2490",
      id: "mx_n_1685717543647",
      width: "16",
      height: "16"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", {
        d: "M849 896c-12 0-24.1-4.6-33.2-13.8l-674-674c-18.4-18.4-18.4-48.1 0-66.5s48.1-18.4 66.5 0l674 674c18.4 18.4 18.4 48.1 0 66.5A47.03 47.03 0 0 1 849 896z",
        "p-id": "2491",
        fill: "#cdcdcd"
      }),
      /* @__PURE__ */ vue.createElementVNode("path", {
        d: "M175 896c-12 0-24.1-4.6-33.2-13.8-18.4-18.4-18.4-48.1 0-66.5l674-674c18.4-18.4 48.1-18.4 66.5 0s18.4 48.1 0 66.5l-674 674C199 891.4 187 896 175 896z",
        "p-id": "2492",
        fill: "#cdcdcd"
      })
    ])
  ], -1));
  const _hoisted_9$4 = [
    _hoisted_8$4
  ];
  const _hoisted_10$4 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", null, " 推送链接： ", -1));
  const _hoisted_11$3 = { class: "content-wrapper--1_WJv" };
  const _hoisted_12$3 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", null, " 推送路径： ", -1));
  const _hoisted_13$2 = { class: "content-wrapper--1_WJv" };
  const _hoisted_14$2 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", null, " RPC密钥： ", -1));
  const _hoisted_15$2 = { class: "content-wrapper--1_WJv" };
  const _hoisted_16$2 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("div", null, " 其他： ", -1));
  const _hoisted_17$1 = {
    key: 0,
    class: "notice2"
  };
  const _hoisted_18$1 = {
    key: 1,
    class: "notice2"
  };
  const _hoisted_19$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_20$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_21$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_22$1 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_23 = {
    key: 2,
    class: "notice2"
  };
  const _hoisted_24 = /* @__PURE__ */ _withScopeId$4(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_25 = { class: "ant-modal-footer" };
  const _hoisted_26 = { class: "footer--3Q0je" };
  const _sfc_main$7 = {
    __name: "Aria2Set",
    setup(__props, { expose }) {
      const data = vue.reactive({
        isShowAria2Set: false,
        pushBtonText: "Aria2 推送",
        aria2Model: user.getAria2Set()
      });
      const errorMsg = vue.ref(false);
      function saveAria2() {
        $2.ajax({
          type: "POST",
          url: data.aria2Model.link,
          data: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "aria2.getVersion",
            "id": "1",
            "params": [
              "token:" + data.aria2Model.token
            ]
          }),
          crossDomain: true,
          processData: false,
          contentType: "application/json",
          success: function(result) {
            user.setAria2Set(data.aria2Model);
            data.isShowAria2Set = false;
            errorMsg.value = false;
            showSuccess("Aria2配置保存成功", null, {
              appendTo: ".ant-modal-header"
            });
          },
          error: function(error) {
            errorMsg.value = true;
            showError$1("保存失败,连接不上Aria2配置", null, {
              appendTo: "#aria2_set_LuoGen"
            });
          }
        });
      }
      function aria2Push(fileList2, call) {
        if (data.pushBtonText == "正在推送") {
          return;
        }
        let folderName = "";
        if (data.aria2Model.dirCreate) {
          let dir = $2(".breadcrumb--2FqFQ[data-calc=true] > .breadcrumb-item--tV9dn > .breadcrumb-item-link--M-p4b");
          folderName = "/阿里云盘";
          for (let i2 = 0; i2 < dir.length; i2++) {
            folderName += "/" + dir[i2].innerText;
          }
        }
        let sendDownLoad = [];
        fileList2.forEach(function(item, index) {
          sendDownLoad.push({
            id: "",
            jsonrpc: "2.0",
            method: "aria2.addUri",
            params: [
              "token:" + data.aria2Model.token,
              [item.url],
              {
                out: item.name,
                dir: data.aria2Model.path + folderName,
                referer: "https://www.aliyundrive.com/",
                "user-agent": navigator.userAgent
              }
            ]
          });
        });
        let text = data.pushBtonText;
        data.pushBtonText = "正在推送";
        $2.ajax({
          type: "POST",
          url: data.aria2Model.link,
          data: JSON.stringify(sendDownLoad),
          crossDomain: true,
          processData: false,
          contentType: "application/json",
          success: function(result) {
            showSuccess("Aria2推送成功", null, {
              appendTo: ".ant-modal-header"
            });
            data.pushBtonText = text;
            call(true);
          },
          error: function(error) {
            showError$1("Aria2 推送失败,请检查配置", null, {
              appendTo: ".ant-modal-header"
            });
            data.pushBtonText = text;
            call(false);
          }
        });
      }
      function show() {
        data.isShowAria2Set = true;
      }
      function hide() {
        data.isShowAria2Set = false;
      }
      expose({
        aria2Push,
        show,
        hide
      });
      return (_ctx, _cache) => {
        return data.isShowAria2Set ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          _hoisted_2$5,
          vue.createElementVNode("div", _hoisted_3$5, [
            vue.createElementVNode("div", _hoisted_4$5, [
              vue.createElementVNode("div", _hoisted_5$5, [
                _hoisted_6$5,
                vue.createElementVNode("div", _hoisted_7$4, [
                  vue.createElementVNode("div", {
                    class: "icon-wrapper--3dbbo",
                    id: "aria2-set-icon",
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => data.isShowAria2Set = false, ["stop"]))
                  }, _hoisted_9$4),
                  _hoisted_10$4,
                  vue.createElementVNode("div", _hoisted_11$3, [
                    vue.createVNode(vue.unref(elementPlus.ElInput), {
                      id: "aria2-link",
                      modelValue: data.aria2Model.link,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => data.aria2Model.link = $event),
                      type: "text"
                    }, null, 8, ["modelValue"])
                  ]),
                  _hoisted_12$3,
                  vue.createElementVNode("div", _hoisted_13$2, [
                    vue.createVNode(vue.unref(elementPlus.ElInput), {
                      id: "aria2-path",
                      modelValue: data.aria2Model.path,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => data.aria2Model.path = $event),
                      type: "text"
                    }, null, 8, ["modelValue"])
                  ]),
                  _hoisted_14$2,
                  vue.createElementVNode("div", _hoisted_15$2, [
                    vue.createVNode(vue.unref(elementPlus.ElInput), {
                      id: "aria2-token",
                      modelValue: data.aria2Model.token,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => data.aria2Model.token = $event),
                      type: "text"
                    }, null, 8, ["modelValue"])
                  ]),
                  _hoisted_16$2,
                  vue.createTextVNode(" 不创建对应目录： "),
                  vue.createVNode(vue.unref(elementPlus.ElSwitch), {
                    modelValue: data.aria2Model.dirCreate,
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => data.aria2Model.dirCreate = $event)
                  }, null, 8, ["modelValue"]),
                  errorMsg.value ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_17$1, " 如果当前推送链接是http开头，则需要修改浏览器安全限制更改为允许。 ")) : vue.createCommentVNode("", true),
                  errorMsg.value ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_18$1, [
                    vue.createTextVNode("连接不上的原因："),
                    _hoisted_19$1,
                    vue.createTextVNode(" 1.端口或链接填写错误"),
                    _hoisted_20$1,
                    vue.createTextVNode(" 2.密钥错误 "),
                    _hoisted_21$1,
                    vue.createTextVNode(" 3.未开启跨域请求"),
                    _hoisted_22$1
                  ])) : vue.createCommentVNode("", true),
                  errorMsg.value ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_23, [
                    vue.createTextVNode(" ./aria2c.exe --enable-rpc --rpc-listen-all --rpc-secret 123 --rpc-allow-origin-all=true"),
                    _hoisted_24,
                    vue.createTextVNode(" 可以在Aria2的程序目录下,使用上面命令,RPC密钥为:123 ")
                  ])) : vue.createCommentVNode("", true)
                ]),
                vue.createElementVNode("div", _hoisted_25, [
                  vue.createElementVNode("div", _hoisted_26, [
                    vue.createVNode(vue.unref(elementPlus.ElButton), {
                      id: "aria2-set-save",
                      type: "primary",
                      onClick: vue.withModifiers(saveAria2, ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(" 检测 & 确定 ")
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ])
              ])
            ])
          ])
        ])) : vue.createCommentVNode("", true);
      };
    }
  };
  const Aria2Set = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-e5d83ee0"]]);
  const CLASS_NAMES = {
    textPrimary: "text-primary--JzAb9",
    button: "button--WC7or primary--NVxfK"
  };
  const DwoloadPage_vue_vue_type_style_index_0_scoped_fac7ef86_lang = "";
  const _withScopeId$3 = (n) => (vue.pushScopeId("data-v-fac7ef86"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$5 = { key: 0 };
  const _hoisted_2$4 = { key: 1 };
  const _hoisted_3$4 = { key: 0 };
  const _hoisted_4$4 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("p", { class: "notice2" }, "注意： 如果大批量获取下载地址，会被官网限速！", -1));
  const _hoisted_5$4 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("p", { class: "notice1" }, "1. 因阿里云盘接口限制,短期大量请求会出现接口请求频繁,可以先选择需要下载的文件，在点击显示链接按钮。 ", -1));
  const _hoisted_6$4 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("p", { class: "notice1" }, "2. 接口请求频繁,也可尝试点击下载,不过文件名需要重新命名 ", -1));
  const _hoisted_7$3 = /* @__PURE__ */ _withScopeId$3(() => /* @__PURE__ */ vue.createElementVNode("p", { class: "notice1" }, "3. 在点击刷新按钮时,不要连续点击,可等几秒在点一次尝试获取 ", -1));
  const _hoisted_8$3 = [
    _hoisted_4$4,
    _hoisted_5$4,
    _hoisted_6$4,
    _hoisted_7$3
  ];
  const _hoisted_9$3 = { class: "notice" };
  const _hoisted_10$3 = {
    class: "item-list",
    style: { "padding": "20px", "height": "410px", "overflow-y": "auto" }
  };
  const _hoisted_11$2 = { style: { "margin": "10px 0px", "overflow": "hidden", "white-space": "nowrap", "text-overflow": "ellipsis" } };
  const _hoisted_12$2 = { class: "footer" };
  const _sfc_main$6 = {
    __name: "DwoloadPage",
    setup(__props) {
      let list = user.selectedFileList();
      if (list.length == 0) {
        list = user.getAllFileList();
      }
      list = list.filter(function(item) {
        return item.type === "folder" || item.type === "file";
      });
      console.log(list);
      const fileList2 = vue.reactive(list);
      const aria2SetRef = vue.ref();
      const data = vue.reactive({
        pushBtonText: "Aria2 推送"
      });
      const home2 = vue.ref(user.home());
      const resource = vue.ref(user.resource());
      const laterLoad = vue.ref(getCount() != 0 && list == 0);
      function getCount() {
        let text = $2(".left-wrapper--zzDY4").text();
        if (!text) {
          return 0;
        }
        var reg = /\d+/g;
        var num = text.match(reg);
        if (num.length == 0) {
          return 0;
        }
        return num[0];
      }
      function group(array, subGroupLength) {
        var index = 0;
        var newArray = [];
        while (index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
      }
      function updateHref(id) {
        var $a = $2(`a[data-id="${id}"]`);
        var title2 = $a.attr("title");
        $a.attr("href", title2);
      }
      var shareToken;
      const shareTokenV = vue.reactive(user.getShareToken());
      vue.onMounted(async () => {
        if (!user.home()) {
          shareToken = user.getShareToken();
          if (!user.isExpires(shareToken)) {
            showError$1("当前页面已过期，请刷新重试");
            return;
          }
        }
        var groupedCountries = group(fileList2, 1);
        for (const index in groupedCountries) {
          await loadingUrl(groupedCountries[index]);
        }
        function loadingUrl(array) {
          return new Promise((resolve, reject) => {
            let length = array.length;
            let initLength = 0;
            array.forEach((item) => {
              if (item.type == "file") {
                getFileUrl(item, function() {
                  initLength += 1;
                  if (initLength == length) {
                    resolve();
                  }
                });
              } else {
                initLength += 1;
                if (initLength == length) {
                  resolve();
                }
              }
            });
          });
        }
      });
      function showSet() {
        aria2SetRef.value.show();
      }
      function IDMPush() {
        var protocol = window.location.protocol;
        var host = window.location.host;
        var fullHost = protocol + "//" + host + "/";
        var content = "", referer = fullHost, userAgent = navigator.userAgent;
        fileList2.forEach(function(item, index) {
          if (item.url != "" && item.url != null) {
            content += ["<", item.url, "referer: " + referer, "User-Agent: " + userAgent, ">"].join("\r\n") + "\r\n";
          }
        });
        downloadLink(content, "IDM导出文件_阿里云盘.ef2");
      }
      function aria2Push() {
        if (data.pushBtonText == "正在推送") {
          return;
        }
        var text = data.pushBtonText;
        data.pushBtonText = "正在推送";
        aria2SetRef.value.aria2Push(fileList2, (res) => {
          if (res == false) {
            data.pushBtonText = "推送失败";
          } else {
            data.pushBtonText = text;
          }
        });
      }
      function bitComet(item) {
        if (!item || !item.name) {
          throw new Error("Item or item.name is not defined");
        }
        const params = `AA/${encodeURIComponent(item.name)}/?url=${encodeURIComponent(item.download_url || item.url)}&refer=${encodeURIComponent(location.protocol + "//" + location.host + "/")}ZZ`;
        const base64Params = btoa(params);
        let url = `bc://http/${base64Params}`;
        navigator.clipboard.writeText(url);
        createLink(url);
      }
      function m3u(item) {
        item.loading = true;
        videoPreviewPlayInfo({
          category: "live_transcoding",
          drive_id: item.drive_id,
          file_id: item.file_id,
          template_id: "FHD|HD|SD|LD",
          url_expire_sec: 14400,
          get_subtitle_info: true
        }).then((res) => {
          var _a, _b, _c;
          const task = (_c = (_b = (_a = res.data) == null ? void 0 : _a.video_preview_play_info) == null ? void 0 : _b.live_transcoding_task_list) == null ? void 0 : _c.filter((task2) => task2.url).pop();
          if (task == null) {
            showError$1("获取视频链接失败，请重新获取");
            return;
          }
          const escapedTitle = item.name.replace(/,/g, "\\,");
          let referrer = location.protocol + "//" + location.host + "/";
          const escapedUrl = task.url.replace(/,/g, "\\,");
          const m3uContent = [
            "#EXTM3U",
            `#EXTVLCOPT:http-referrer=${referrer}`,
            `#EXTINF:-1, ${escapedTitle}`,
            escapedUrl
          ].join("\n");
          let name2 = item.name.substring(0, item.name.lastIndexOf("." + item.file_extension));
          downloadLink(m3uContent, `${name2 || "视频文件"}.m3u`);
        }).finally(() => {
          item.loading = false;
        });
      }
      function downloadLink(text, name2) {
        var a = document.createElement("a");
        var blob = new Blob([text]);
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name2;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      function createLink(url) {
        const a = document.createElement("a");
        a.href = url;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      function getFileUrl(item, call) {
        item.loading = true;
        item.text = "正在获取下载地址中";
        let showDnload;
        if (item.share_id) {
          showDnload = shareLinkDownloadUrl({
            file_id: item.file_id,
            share_id: item.share_id
          }, shareToken.share_token).then((response) => {
            item.error = false;
            item.text = response.data.download_url;
            item.url = response.data.download_url;
          });
        } else {
          showDnload = getDownloadUrl({
            expire_sec: 14400,
            drive_id: item.drive_id,
            file_id: item.file_id
          }).then((response) => {
            item.error = false;
            if (response.data.url) {
              item.text = response.data.url;
              item.url = response.data.url;
            } else {
              item.text = item.url;
            }
          });
        }
        showDnload.catch((e) => {
          if (e && e + "" == "AxiosError: Request failed with status code 429") {
            item.error = true;
            item.text = "接口请求频繁，请稍后点击文件旁边的刷新按钮，重新获取 (也可点击我尝试跳转下载)";
          } else {
            item.text = "刷新失败，错误异常:" + e;
          }
        }).finally(() => {
          item.loading = false;
          call && call();
        });
      }
      vue.onUnmounted(() => {
        console.log("文件下载窗口关闭");
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(Aria2Set, {
            ref_key: "aria2SetRef",
            ref: aria2SetRef
          }, null, 512),
          laterLoad.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
            vue.createVNode(vue.unref(elementPlus.ElResult), {
              icon: "error",
              title: "获取文件失败",
              "sub-title": "请回到文件列表中，随便点击排序，看到已加载多少文件时，在回到这里吧"
            })
          ])) : vue.createCommentVNode("", true),
          !laterLoad.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$4, [
            fileList2.length > 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$4, _hoisted_8$3)) : vue.createCommentVNode("", true),
            vue.createElementVNode("p", _hoisted_9$3, " 共加载了" + vue.toDisplayString(fileList2.length) + "个文件", 1),
            vue.createElementVNode("div", _hoisted_10$3, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(fileList2, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                  item.type == "folder" ? (vue.openBlock(), vue.createElementBlock("p", {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
                  }, vue.toDisplayString(index + 1) + ". " + vue.toDisplayString(item.name), 3)) : vue.createCommentVNode("", true),
                  item.type == "file" ? (vue.openBlock(), vue.createElementBlock("p", {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
                  }, [
                    vue.createTextVNode(vue.toDisplayString(index + 1) + ". " + vue.toDisplayString(item.name) + " ", 1),
                    vue.createVNode(vue.unref(elementPlus.ElButton), {
                      type: "primary",
                      icon: vue.unref(refresh_default),
                      loading: item.loading,
                      circle: "",
                      size: "small",
                      onClick: vue.withModifiers(($event) => getFileUrl(item), ["stop"])
                    }, null, 8, ["icon", "loading", "onClick"]),
                    vue.createVNode(vue.unref(elementPlus.ElLink), {
                      type: "primary",
                      style: { "margin-left": "10px" },
                      loading: item.loading,
                      onClick: vue.withModifiers(($event) => bitComet(item), ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("BitComet")
                      ]),
                      _: 2
                    }, 1032, ["loading", "onClick"]),
                    home2.value && item.mime_type.indexOf("video") != -1 ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElLink), {
                      key: 0,
                      type: "primary",
                      style: { "margin-left": "10px" },
                      loading: item.loading,
                      onClick: vue.withModifiers(($event) => m3u(item), ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode("M3U")
                      ]),
                      _: 2
                    }, 1032, ["loading", "onClick"])) : vue.createCommentVNode("", true)
                  ], 2)) : vue.createCommentVNode("", true),
                  vue.createElementVNode("p", _hoisted_11$2, [
                    item.type == "folder" ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElLink), {
                      key: 0,
                      type: "primary",
                      href: resource.value ? "/drive/file/resource/" + item.file_id : home2.value ? "/drive/file/backup/" + item.file_id : "/s/" + shareTokenV.share_id + "/folder/" + item.file_id
                    }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("p", {
                          class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
                        }, " 点击进入文件夹", 2)
                      ]),
                      _: 2
                    }, 1032, ["href"])) : vue.createCommentVNode("", true),
                    item.type == "file" && !item.error ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElLink), {
                      key: 1,
                      onMousedown: ($event) => updateHref(item.file_id),
                      onMouseup: ($event) => updateHref(item.file_id),
                      "data-id": item.file_id,
                      type: "primary",
                      title: item.url,
                      href: item.url
                    }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("p", {
                          class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
                        }, vue.toDisplayString(item.text), 3)
                      ]),
                      _: 2
                    }, 1032, ["onMousedown", "onMouseup", "data-id", "title", "href"])) : vue.createCommentVNode("", true),
                    item.type == "file" && item.error ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElLink), {
                      key: 2,
                      type: "danger",
                      href: item.url
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(item.text), 1)
                      ]),
                      _: 2
                    }, 1032, ["href"])) : vue.createCommentVNode("", true)
                  ])
                ]);
              }), 128))
            ]),
            vue.createElementVNode("div", null, [
              vue.createElementVNode("div", _hoisted_12$2, [
                vue.createElementVNode("div", null, [
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    type: "primary",
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => vue.unref(monkeyWindow).open("https://github.com/wyndem/ali-video", "_blank"), ["stop"]))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("❤️ 开源地址")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    type: "primary",
                    onClick: _cache[1] || (_cache[1] = vue.withModifiers(($event) => vue.unref(monkeyWindow).open("https://greasyfork.org/zh-CN/scripts/458626", "_blank"), ["stop"]))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("👍 点个赞")
                    ]),
                    _: 1
                  }),
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    type: "primary",
                    onClick: vue.withModifiers(IDMPush, ["stop"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("IDM 导出文件")
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    type: "primary",
                    onClick: vue.withModifiers(aria2Push, ["stop"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode(vue.toDisplayString(data.pushBtonText), 1)
                    ]),
                    _: 1
                  }, 8, ["onClick"]),
                  vue.createVNode(vue.unref(elementPlus.ElButton), {
                    type: "primary",
                    style: { "margin-left": "10px", "width": "auto", "border": "0 solid transparent" },
                    class: "aria2-set",
                    onClick: vue.withModifiers(showSet, ["stop"]),
                    circle: ""
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("⚙️")
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ])
              ])
            ])
          ])) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  };
  const DwoloadPage = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-fac7ef86"]]);
  function title(html2) {
    let name2 = html2.split(" ")[1];
    let css2 = "display:flex;flex-direction:row;align-items:center;";
    let htmlDiv = `<div style='${css2}padding-left:10px;padding-right:10px'>
        <p>${name2}</p>
    </div>`;
    return htmlDiv;
  }
  function getVideoSrc(call) {
    let videoPage = user.getVideoPage();
    let showDnload;
    if (!user.home()) {
      let token = user.getShareToken();
      if (token == "") {
        showError$1("当前登录凭证失效，请刷新或重新登录");
        return "";
      }
      showDnload = shareLinkDownloadUrl({
        file_id: videoPage.id,
        share_id: token.share_id
      }, token.share_token).then((response) => {
        call && call(response.data.download_url);
      });
    } else {
      let token = user.getToken();
      if (token == "") {
        showError$1("当前登录凭证获取为空，请刷新或重新登录");
        return "";
      }
      showDnload = getDownloadUrl({
        expire_sec: 14400,
        drive_id: token.default_drive_id,
        file_id: videoPage.id
      }).then((response) => {
        call && call(response.data.url);
      });
    }
    showDnload.catch((e) => {
      if (e && e + "" == "AxiosError: Request failed with status code 429") {
        showError$1("接口请求频繁");
      } else {
        showError$1("刷新失败，错误异常:" + e);
      }
    }).finally(() => {
      call && call();
    });
  }
  function getOptionUrl(option) {
    console.log(option);
    return new Promise((resolve, reject) => {
      if (option.html != " 原画") {
        resolve(option.url);
      } else {
        getVideoSrc((url) => {
          if (url != "") {
            resolve(url);
          } else {
            reject("获取地址视频错误");
          }
        });
      }
    });
  }
  function artplayPluginQuality(option) {
    return async (art) => {
      let def = option[option.length - 1];
      let loc = user.getVideoPlayerSet().qualityHtml;
      var storageQuality;
      if (loc) {
        let quality2 = option.find((item) => item.html === loc);
        if (quality2) {
          quality2["default"] = true;
          storageQuality = quality2.html;
        }
      }
      if (!storageQuality) {
        storageQuality = def.html;
        def["default"] = true;
      }
      let index = option.findIndex(function(item, index2) {
        return item.html === storageQuality;
      });
      var quality = {
        name: "quality",
        position: "right",
        html: title(storageQuality) || "Quality",
        selector: option,
        index: 2,
        onSelect: async function(item) {
          let url = await getOptionUrl(item);
          console.log(item.html);
          console.log(url);
          art.qualityHtml = item.html;
          art.switchQuality(url, item.html);
          return title(item.html);
        }
      };
      art.quality_ = quality;
      art.controls.add(quality);
      const quality1 = option[index];
      if (quality1) {
        art.url = await getOptionUrl(quality1);
        art.qualityHtml = quality1.html;
      } else {
        art.url = await getOptionUrl(option[0]);
        art.qualityHtml = option[0].html;
      }
    };
  }
  var cur = `<span  data-role="icon"data-render-as="svg"data-icon-type="PDSPlayCircle"class="icon--2AFV7 icon--d-ejA ">
<svg viewBox="0 0 1024 1024"><use xlink:href="#PDSPlayCircle"></use></svg>
</span>`;
  function html(item, def) {
    let htmlDiv = `<div style='display:flex;flex-direction:row;align-items:center;'  title="${item.name}">
    <p class="title--2vewu " >
        ${def ? cur : ""}
    </p>
        <span class="filename--3hcxw filename_luogen" style="font-size:14px">${item.name}</span>
    </div>
    `;
    return htmlDiv;
  }
  function selector(call) {
    let items = user.getPage().items;
    if (items.length == 0 || $2("#videoHistory").length > 0) {
      return (art) => {
      };
    }
    let fileList2 = items;
    let id = user.getVideoPage().id;
    var videoList = fileList2.filter(function(item, index) {
      return item.category === "video";
    }), fileIndex = videoList.findIndex(function(item, index) {
      return item.file_id === id;
    });
    if (!(fileIndex > -1 && videoList.length > 1))
      return () => {
      };
    console.log("视频数量为：：" + videoList.length);
    return (art) => {
      let option = [];
      videoList.forEach((it, index) => {
        option.push({
          default: index == fileIndex,
          index,
          file: it,
          html: html(it, index == fileIndex)
        });
      });
      let svg = '<svg t="1677915128666" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2048" width="24" height="24"><path d="M665.47 417.65l-345.03-244.3c-69.8-49.42-166.29 0.49-166.29 86.01v502.27c0 85.52 96.49 135.43 166.29 86.01l345.03-244.31c64.02-45.34 64.02-140.34 0-185.68zM811.82 868.52c-30.38 0-55-24.62-55-55V207.46c0-30.38 24.62-55 55-55s55 24.62 55 55v606.07c0 30.37-24.62 54.99-55 54.99z" p-id="2049" fill="#ffffff"></path></svg>';
      if (fileIndex + 1 < videoList.length) {
        art.controls.add({
          name: "next_selector",
          position: "left",
          html: `<i class="art-icon"  title="${videoList[fileIndex + 1].name}">` + svg + "</i>",
          tooltip: videoList[fileIndex + 1].name,
          style: {
            marginRight: "10px"
          },
          click: function() {
            let item = videoList[fileIndex + 1];
            call && call(item);
          }
        });
      }
      art.videoList = option;
      art.controls.add({
        name: "selector",
        position: "right",
        index: 1,
        html: "选集",
        click: function() {
          if (art.fullscreen) {
            art.fullscreen = false;
          } else if (art.fullscreenWeb) {
            art.fullscreen = false;
          }
          call && call();
        }
      });
    };
  }
  function subtitle(click) {
    return (art) => {
      art.controls.add({
        name: "subtitle",
        position: "right",
        html: "字幕",
        index: 2,
        style: {
          marginLeft: "10px"
        },
        click: function() {
          if (art.fullscreen) {
            art.fullscreen = false;
          } else if (art.fullscreenWeb) {
            art.fullscreen = false;
          }
          click && click();
        }
      });
    };
  }
  var doubleSpeed = function(art) {
    art.notice.show = "倍速播放 x3";
    art.playbackRate = 3;
  };
  function hotkey() {
    return (art) => {
      var rightCount = 0;
      var playbackRate = null;
      var rightInterval = null;
      var logKey = false;
      document.onkeyup = function(event) {
        if (event.code === "ArrowRight") {
          if (rightCount === 1) {
            art.currentTime = art.currentTime + 5;
          }
          logKey = false;
          if (rightInterval) {
            window.clearInterval(rightInterval);
          }
          rightInterval = null;
          rightCount = 0;
          if (playbackRate) {
            art.playbackRate = playbackRate;
            playbackRate = null;
          }
        }
      };
      document.onkeydown = function(event) {
        if (event.code === "ArrowRight") {
          rightCount += 1;
          if (!playbackRate) {
            playbackRate = art.playbackRate;
          }
          if (!rightInterval) {
            rightInterval = setInterval(function() {
              if (rightCount > 100) {
                rightCount = 2;
              }
              if (rightCount > 1 && !logKey) {
                doubleSpeed(art);
                logKey = true;
              }
            }, 100);
          }
        } else if (event.code === "ArrowLeft") {
          art.currentTime = art.currentTime - 5;
        } else if (event.code === "ArrowUp") {
          art.volume = art.volume + 0.01;
        } else if (event.code === "ArrowDown") {
          art.volume = art.volume - 0.01;
        } else if (event.code === "Space") {
          art.toggle();
        } else if (event.code === "Enter") {
          art.fullscreen = !art.fullscreen;
        }
      };
    };
  }
  function saveCloud(art) {
    let token = user.getToken();
    if (token == null) {
      return;
    }
    let v = user.getVideoPage();
    videoUpdate({
      drive_id: token.default_drive_id,
      duration: art.duration,
      file_id: v.id,
      play_cursor: art.currentTime
    }).then((res) => {
    });
  }
  function saveExit() {
    return (art) => {
      art.on("ready", () => {
        let v = user.getVideoPage();
        if (v.play_cursor) {
          art.seek = v.play_cursor;
        } else {
          let list = user.getVideoLookList();
          let index = list.findIndex((item) => {
            return item.id == v.id;
          });
          if (index != -1) {
            art.seek = list[index].play_cursor;
          }
        }
        let plset = user.getVideoPlayerSet();
        if (plset.fullscreen) {
          art.fullscreen = true;
        }
        if (plset.fullscreenWeb) {
          art.fullscreenWeb = true;
        }
        if (plset.playbackRate) {
          art.playbackRate = plset.playbackRate;
        }
        if (plset.subtitleSize && plset.subtitleSize != 0) {
          $2(".art-subtitle").css("font-size", plset.subtitleSize + "px");
          art.subtitleSize = plset.subtitleSize;
        }
        if (plset.subtitleMargin && plset.subtitleSize != 0) {
          $2(".art-subtitle").css("margin-bottom", plset.subtitleMargin + "px");
          art.subtitleMargin = plset.subtitleMargin;
        }
        if (plset.subtitleOffset) {
          art.subtitleOffset = plset.subtitleOffset;
          art.subtitleOffset = plset.subtitleOffset;
        }
        if (plset.subtitleColor && plset.subtitleColor.indexOf("#") != -1) {
          $2(".art-subtitle").css("color", plset.subtitleColor);
          art.subtitleColor = plset.subtitleColor;
        }
      });
      art.on("destroy", () => {
        let v = user.getVideoPage();
        if (v.type == 0) {
          saveCloud(art);
        }
        user.saveVideoPlayerSet(art);
        let currentTime = art.currentTime;
        let progress = parseInt(currentTime / art.duration * 100);
        try {
          art.hls.destroy();
          art.video.dispose();
        } catch (error) {
        }
        let items = user.getPage().items;
        let index = items.findIndex((it) => {
          return it.file_id == v.id;
        });
        if (index != -1) {
          if (!items[index].user_meta) {
            items[index].user_meta = "{}";
          }
          let meta = JSON.parse(items[index].user_meta);
          meta.play_cursor = currentTime;
          items[index].user_meta = JSON.stringify(meta);
        }
        let folderName;
        let href = v.href;
        if (v.type == 1) {
          folderName = "来自分享";
        } else {
          folderName = v.folderName;
        }
        user.saveVideoInfo(v.id, v.name, progress, folderName, href, v.type == 1, currentTime, v.drive_id);
      });
    };
  }
  const SubTitle_vue_vue_type_style_index_0_scoped_caf70c0e_lang = "";
  const _withScopeId$2 = (n) => (vue.pushScopeId("data-v-caf70c0e"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$4 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", { style: { "margin-top": "-20px" } }, [
    /* @__PURE__ */ vue.createElementVNode("p", { class: "notice1" }, "页面链接就是先去找到字幕位置，然后再把当前页面的链接拷贝复制到下面输入框中，再点击跳转即可")
  ], -1));
  const _hoisted_2$3 = { style: { "margin-bottom": "20px" } };
  const _hoisted_3$3 = { class: "bread-container--xuGOj" };
  const _hoisted_4$3 = {
    class: "breadcrumb-wrap--Uq5Lb",
    "data-align": "left",
    style: { "overflow-x": "auto" }
  };
  const _hoisted_5$3 = {
    class: "breadcrumb--gnRPG",
    "data-calc": "true"
  };
  const _hoisted_6$3 = ["data-label", "onClick", "data-key"];
  const _hoisted_7$2 = {
    class: "breadcrumb-item-link--9zcQY",
    style: { "color": "#409eff" },
    "data-spm-anchor-id": "0.0.0.i5.54a06c75zaT9h6"
  };
  const _hoisted_8$2 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "breadcrumb-item-separator--MnbFV",
    style: { "color": "#409eff" }
  }, "›", -1));
  const _hoisted_9$2 = { key: 0 };
  const _hoisted_10$2 = { id: "_fileList" };
  const _hoisted_11$1 = {
    class: "td--SGrZj td---v-kp",
    "data-col-key": "name",
    style: { "flex": "1 1 0%", "min-width": "160px" }
  };
  const _hoisted_12$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "cover--Mn1Bt folder-cover--ExDmp",
    "data-size": "XXS"
  }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      alt: "folder",
      class: "fileicon--Ob-Oj fileicon---webs",
      draggable: "false",
      src: "https://img.alicdn.com/imgextra/i3/O1CN01qSxjg71RMTCxOfTdi_!!6000000002097-2-tps-80-80.png"
    })
  ], -1));
  const _hoisted_13$1 = ["title"];
  const _hoisted_14$1 = {
    class: "td--SGrZj td---v-kp",
    "data-col-key": "name",
    style: { "flex": "1 1 0%", "min-width": "160px" }
  };
  const _hoisted_15$1 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ vue.createElementVNode("div", {
    class: "cover--Mn1Bt folder-cover--ExDmp",
    "data-size": "XXS"
  }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      alt: "others",
      class: "fileicon--Ob-Oj fileicon---webs",
      draggable: "false",
      src: "https://img.alicdn.com/imgextra/i2/O1CN01ROG7du1aV18hZukHC_!!6000000003334-2-tps-140-140.png"
    })
  ], -1));
  const _hoisted_16$1 = ["title"];
  const _sfc_main$5 = {
    __name: "SubTitle",
    emits: ["selectSubTitle"],
    setup(__props, { expose, emit }) {
      const data = vue.ref([]);
      const path = vue.ref([]);
      const url = vue.ref();
      vue.onMounted(() => {
        getFileList("root", "全部文件");
      });
      function selectFile(fileInfo) {
        elementPlus.ElMessageBox.confirm(
          `确认加载《${fileInfo.name}》字幕文件吗？`,
          "字幕选择",
          {
            confirmButtonText: "确认",
            cancelButtonText: "取消"
          }
        ).then(() => {
          emit("selectSubTitle", fileInfo);
        });
      }
      function getFileList(parent_file_id, name2) {
        let loadingInstance = elementPlus.ElLoading.service({
          target: "#_fileList",
          text: "加载中"
        });
        try {
          if (path.value.length != 0) {
            let last = path.value[path.value.length - 1];
            if (last.id == parent_file_id) {
              return;
            }
            let index = path.value.findIndex((item, index2) => {
              return item.id === parent_file_id;
            });
            if (index != -1) {
              path.value = path.value.splice(0, index);
            }
          }
          path.value.push({
            id: parent_file_id,
            name: name2
          });
          let token = user.getToken();
          if (token == "" || token == null) {
            showError$1("登录凭证失效，请重新登录重试");
            return;
          }
          if (token.default_drive_id == null || token.default_drive_id == "") {
            showError$1("设备id为空,请刷新重试");
            console.log(token.default_drive_id);
            return;
          }
          search({
            "drive_id": token.default_drive_id,
            "query": `parent_file_id = "${parent_file_id}" and (type = "folder" or file_extension in ["srt", "ass", "vtt"])`,
            "order_by": "type ASC,updated_at DESC",
            "limit": 20,
            "image_thumbnail_process": "image/resize,w_256/format,jpeg",
            "image_url_process": "image/resize,w_1920/format,jpeg/interlace,1",
            "video_thumbnail_process": "video/snapshot,t_1000,f_jpg,ar_auto,w_256"
          }).then((res) => {
            data.value.length = 0;
            data.value = res.data.items;
            if (parent_file_id == "root") {
              url.value = "https://www.aliyundrive.com/drive/file/backup";
            } else {
              url.value = "https://www.aliyundrive.com/drive/file/backup/" + parent_file_id;
            }
          }).catch((e) => {
            console.log(e);
            if (e && e + "" == "AxiosError: Request failed with status code 429") {
              showError$1("您操作的太快了! 请稍候点击下方按钮，刷新尝试");
            } else {
              showError$1(e + "");
            }
            path.value.pop();
          });
        } finally {
          loadingInstance.close();
        }
      }
      function toUrlFile() {
        var link = url.value;
        if (link == "https://www.aliyundrive.com/drive") {
          showError$1("如需跳首页，请点下方全部文件");
          return;
        }
        var regex = /(backup|resource)\/(.+?)(?:\/|\?|$)/;
        var match = link.match(regex);
        if (match) {
          var value = match[1];
          getFileList(value, "搜索结果");
        } else {
          showError$1("错误的链接");
        }
      }
      function toCurrentPage() {
        url.value = location.href;
        toUrlFile();
      }
      expose({
        getFileList
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          _hoisted_1$4,
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createVNode(vue.unref(elementPlus.ElInput), {
              modelValue: url.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => url.value = $event),
              placeholder: "Please input"
            }, {
              prepend: vue.withCtx(() => [
                vue.createTextVNode("链接")
              ]),
              append: vue.withCtx(() => [
                vue.createVNode(vue.unref(elementPlus.ElButton), {
                  type: "primary",
                  onClick: toUrlFile
                }, {
                  default: vue.withCtx(() => [
                    vue.createTextVNode("跳转")
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["modelValue"])
          ]),
          vue.createVNode(vue.unref(elementPlus.ElButton), {
            type: "primary",
            link: "",
            onClick: toCurrentPage
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode("跳转到当前页面")
            ]),
            _: 1
          }),
          vue.createElementVNode("div", _hoisted_3$3, [
            vue.createElementVNode("div", _hoisted_4$3, [
              vue.createElementVNode("div", _hoisted_5$3, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(path.value, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    key: index,
                    class: "breadcrumb-item--j8J5H",
                    "data-label": item.name,
                    onClick: vue.withModifiers(($event) => getFileList(item.id, item.name), ["stop"]),
                    "data-key": item.id,
                    "data-hide": "false",
                    "data-more": "false"
                  }, [
                    vue.createElementVNode("div", _hoisted_7$2, vue.toDisplayString(item.name), 1),
                    _hoisted_8$2
                  ], 8, _hoisted_6$3);
                }), 128))
              ])
            ])
          ]),
          data.value.length == 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$2, [
            vue.createVNode(vue.unref(elementPlus.ElEmpty), { description: "文件夹为空" })
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_10$2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(data.value, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                key: index,
                style: { "margin-top": "4px" }
              }, [
                item.type == "folder" ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElCard), {
                  key: 0,
                  "body-style": { "padding": "5px", "margin": "0px" },
                  shadow: "hover",
                  onClick: vue.withModifiers(($event) => getFileList(item.file_id, item.name), ["stop"])
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_11$1, [
                      _hoisted_12$1,
                      vue.createElementVNode("p", {
                        title: item.name
                      }, vue.toDisplayString(item.name), 9, _hoisted_13$1)
                    ])
                  ]),
                  _: 2
                }, 1032, ["onClick"])) : vue.createCommentVNode("", true),
                item.type == "file" ? (vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElCard), {
                  key: 1,
                  "body-style": { "padding": "5px", "margin": "0px" },
                  shadow: "hover",
                  onClick: vue.withModifiers(($event) => selectFile(item), ["stop"])
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_14$1, [
                      _hoisted_15$1,
                      vue.createElementVNode("p", {
                        title: item.name
                      }, vue.toDisplayString(item.name), 9, _hoisted_16$1)
                    ])
                  ]),
                  _: 2
                }, 1032, ["onClick"])) : vue.createCommentVNode("", true)
              ]);
            }), 128))
          ])
        ]);
      };
    }
  };
  const SubTitle = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-caf70c0e"]]);
  const indicator = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMiI+CiAgICA8cGF0aCBkPSJNMTYuMTE4IDMuNjY3aC4zODJhMy42NjcgMy42NjcgMCAwMTMuNjY3IDMuNjY3djcuMzMzYTMuNjY3IDMuNjY3IDAgMDEtMy42NjcgMy42NjdoLTExYTMuNjY3IDMuNjY3IDAgMDEtMy42NjctMy42NjdWNy4zMzNBMy42NjcgMy42NjcgMCAwMTUuNSAzLjY2NmguMzgyTDQuOTUgMi4wNTNhMS4xIDEuMSAwIDAxMS45MDYtMS4xbDEuNTY3IDIuNzE0aDUuMTU2TDE1LjE0Ni45NTNhMS4xMDEgMS4xMDEgMCAwMTEuOTA2IDEuMWwtLjkzNCAxLjYxNHoiIGZpbGw9IiMzMzMiPjwvcGF0aD4KICAgIDxwYXRoIGQ9Ik01LjU2MSA1LjE5NGgxMC44NzhhMi4yIDIuMiAwIDAxMi4yIDIuMnY3LjIxMWEyLjIgMi4yIDAgMDEtMi4yIDIuMkg1LjU2MWEyLjIgMi4yIDAgMDEtMi4yLTIuMlY3LjM5NGEyLjIgMi4yIDAgMDEyLjItMi4yeiIgZmlsbD0iI2ZmZiI+PC9wYXRoPgogICAgPHBhdGggZD0iTTYuOTY3IDguNTU2YTEuMSAxLjEgMCAwMTEuMSAxLjF2Mi42ODlhMS4xIDEuMSAwIDExLTIuMiAwVjkuNjU2YTEuMSAxLjEgMCAwMTEuMS0xLjF6TTE1LjAzMyA4LjU1NmExLjEgMS4xIDAgMDExLjEgMS4xdjIuNjg5YTEuMSAxLjEgMCAxMS0yLjIgMFY5LjY1NmExLjEgMS4xIDAgMDExLjEtMS4xeiIgZmlsbD0iIzMzMyI+PC9wYXRoPgo8L3N2Zz4=";
  const state = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgODAgODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxwYXRoIGlkPSJwaWQtNjQtc3Znby1hIiBkPSJNMCAwaDgwdjgwSDB6Ij48L3BhdGg+PHBhdGggZD0iTTUyLjU0NiA4LjAxNGEzLjk5OCAzLjk5OCAwIDAxNC4yMjIgMy4wNzdjLjEwNC40NDYuMDkzLjgwOC4wMzkgMS4xMzhhMi43NCAyLjc0IDAgMDEtLjMxMi44ODFjLS4wNzMuMTMyLS4xNi4yNTQtLjI0Ni4zNzZsLS4yNTcuMzY2LS41MjEuNzNjLS43Ljk2OS0xLjQxNSAxLjkyNi0yLjE1NCAyLjg2NmwtLjAxNS4wMmEyNDAuOTQ1IDI0MC45NDUgMCAwMTUuOTg2LjM0MWwxLjY0My4xMjMuODIyLjA2Ni40MS4wMzQuMjA2LjAxOC4xMDMuMDA4LjExNS4wMTJjMS4yNjYuMTE2IDIuNTE2LjQ1IDMuNjc3Ljk3NWExMS42NjMgMTEuNjYzIDAgMDEzLjE2NiAyLjExNGMuOTMxLjg3IDEuNzE5IDEuODk1IDIuMzIxIDMuMDIyYTExLjU5NSAxMS41OTUgMCAwMTEuMjI0IDMuNjEzYy4wMy4xNTcuMDQ2LjMxNi4wNjguNDc0bC4wMTUuMTE5LjAxMy4xMTIuMDIyLjIwNi4wODUuODIyLjE1OSAxLjY0NmMuMSAxLjA5OC4xOSAyLjE5OC4yNyAzLjI5OC4zMTUgNC40LjQ2MyA4LjgyOS4zNiAxMy4yNTVhMTY2LjQ4OSAxNjYuNDg5IDAgMDEtLjg0MyAxMy4yMTNjLS4wMTIuMTI3LS4wMzQuMjk3LS4wNTMuNDU0YTcuNTg5IDcuNTg5IDAgMDEtLjA3Mi40NzVsLS4wNC4yMzctLjA1LjIzNmExMS43NjIgMTEuNzYyIDAgMDEtLjc0IDIuMjg3IDExLjc1NSAxMS43NTUgMCAwMS01LjExOCA1LjU3IDExLjcwNSAxMS43MDUgMCAwMS0zLjYyMyAxLjI2M2MtLjE1OC4wMjQtLjMxNi4wNTItLjQ3NS4wNzJsLS40NzcuMDUzLS44MjEuMDcxLTEuNjQ0LjEzNGMtMS4wOTYuMDg2LTIuMTkyLjE2LTMuMjg4LjIzYTI2MC4wOCAyNjAuMDggMCAwMS02LjU3OC4zMjVjLTguNzcyLjMyNC0xNy41NDYuMjItMjYuMzEzLS4zMDJhMjQyLjQ1OCAyNDIuNDU4IDAgMDEtMy4yODctLjIybC0xLjY0My0uMTI5LS44MjItLjA2OS0uNDEtLjAzNS0uMjA2LS4wMThjLS4wNjgtLjAwNi0uMTMzLS4wMS0uMjE4LS4wMmExMS41NjYgMTEuNTY2IDAgMDEtMy43LS45OTIgMTEuNzMyIDExLjczMiAwIDAxLTUuNDk3LTUuMTc4IDExLjczIDExLjczIDAgMDEtMS4yMTUtMy42MjdjLS4wMjQtLjE1OC0uMDUxLS4zMTYtLjA2Ny0uNDc1bC0uMDI2LS4yMzgtLjAxMy0uMTE5LS4wMS0uMTAzLS4wNy0uODIzLS4xMzItMS42NDhhMTkwLjYzNyAxOTAuNjM3IDAgMDEtLjIyLTMuMjk4Yy0uMjU2LTQuMzk5LS4zNTgtOC44MTctLjI1OC0xMy4yMzMuMDk5LTQuNDEyLjM3Mi04LjgxMS43ODgtMTMuMTk3YTExLjY1IDExLjY1IDAgMDEzLjAzOS02LjgzNSAxMS41ODUgMTEuNTg1IDAgMDE2LjU3Mi0zLjU2M2MuMTU3LS4wMjMuMzEyLS4wNTEuNDctLjA3bC40Ny0uMDUuODItLjA3IDEuNjQzLS4xM2EyMjguNDkzIDIyOC40OTMgMCAwMTYuNjQ3LS40MDVsLS4wNDEtLjA1YTg4LjE0NSA4OC4xNDUgMCAwMS0yLjE1NC0yLjg2N2wtLjUyLS43My0uMjU4LS4zNjZjLS4wODYtLjEyMi0uMTczLS4yNDQtLjI0Ni0uMzc2YTIuNzQgMi43NCAwIDAxLS4zMTItLjg4MSAyLjgwOCAyLjgwOCAwIDAxLjA0LTEuMTM4IDMuOTk4IDMuOTk4IDAgMDE0LjIyLTMuMDc3IDIuOCAyLjggMCAwMTEuMDkzLjMxM2MuMjk0LjE1NS41MzguMzQ3Ljc0Mi41NjguMTAyLjExLjE5LjIzLjI4LjM1bC4yNy4zNTkuNTMyLjcyYTg4LjA1OSA4OC4wNTkgMCAwMTIuMDYgMi45MzYgNzMuMDM2IDczLjAzNiAwIDAxMS45MjkgMy4wM2MuMTg3LjMxMy4zNzMuNjI4LjU1Ni45NDUgMi43MjQtLjA0NyA1LjQ0Ny0uMDU2IDguMTctLjAzOC43NDguMDA2IDEuNDk2LjAxNSAyLjI0NC4wMjYuMTgtLjMxMy4zNjQtLjYyNC41NDktLjkzNGE3My4yODEgNzMuMjgxIDAgMDExLjkzLTMuMDMgODguNzM3IDg4LjczNyAwIDAxMi4wNTktMi45MzVsLjUzMy0uNzIuMjY4LS4zNTljLjA5LS4xMi4xNzktLjI0LjI4MS0uMzVhMi44IDIuOCAwIDAxMS44MzQtLjg4MXpNMzAuMTMgMzQuNjMxYTQgNCAwIDAwLS40MTggMS40MiA5MS4xNTcgOTEuMTU3IDAgMDAtLjQ0NiA5LjEyOGMwIDIuODI4LjEyMSA1LjY1Ni4zNjQgOC40ODNsLjExIDEuMjEyYTQgNCAwIDAwNS44NTggMy4xNDNjMi44Mi0xLjQ5OCA1LjU1LTMuMDMzIDguMTkzLTQuNjA2YTE3Ny40MSAxNzcuNDEgMCAwMDUuODk2LTMuNjY2bDEuNDM0LS45NDJhNCA0IDAgMDAuMDQ3LTYuNjMyIDEzNy43MDMgMTM3LjcwMyAwIDAwLTcuMzc3LTQuNzA4IDE0Ni44OCAxNDYuODggMCAwMC02Ljg3OS0zLjg0OWwtMS40LS43MjVhNCA0IDAgMDAtNS4zODIgMS43NDJ6IiBpZD0icGlkLTY0LXN2Z28tZCI+PC9wYXRoPjxmaWx0ZXIgeD0iLTE1LjQlIiB5PSItMTYuMyUiIHdpZHRoPSIxMzAuOSUiIGhlaWdodD0iMTMyLjUlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJwaWQtNjQtc3Znby1jIj48ZmVPZmZzZXQgZHk9IjIiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMSIgaW49InNoYWRvd09mZnNldE91dGVyMSIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIj48L2ZlR2F1c3NpYW5CbHVyPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4zIDAiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PjxmZU9mZnNldCBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93T2Zmc2V0T3V0ZXIyIj48L2ZlT2Zmc2V0PjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjMuNSIgaW49InNoYWRvd09mZnNldE91dGVyMiIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIyIj48L2ZlR2F1c3NpYW5CbHVyPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4yIDAiIGluPSJzaGFkb3dCbHVyT3V0ZXIyIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMiI+PC9mZUNvbG9yTWF0cml4PjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIxIj48L2ZlTWVyZ2VOb2RlPjxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIyIj48L2ZlTWVyZ2VOb2RlPjwvZmVNZXJnZT48L2ZpbHRlcj48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBvcGFjaXR5PSIuOCI+PG1hc2sgaWQ9InBpZC02NC1zdmdvLWIiIGZpbGw9IiNmZmYiPjx1c2UgeGxpbms6aHJlZj0iI3BpZC02NC1zdmdvLWEiPjwvdXNlPjwvbWFzaz48ZyBtYXNrPSJ1cmwoI3BpZC02NC1zdmdvLWIpIj48dXNlIGZpbGw9IiMwMDAiIGZpbHRlcj0idXJsKCNwaWQtNjQtc3Znby1jKSIgeGxpbms6aHJlZj0iI3BpZC02NC1zdmdvLWQiPjwvdXNlPjx1c2UgZmlsbD0iI0ZGRiIgeGxpbms6aHJlZj0iI3BpZC02NC1zdmdvLWQiPjwvdXNlPjwvZz48L2c+PC9zdmc+";
  const Selector_vue_vue_type_style_index_0_scoped_d200ca3c_lang = "";
  const _hoisted_1$3 = ["data-def"];
  const _sfc_main$4 = {
    __name: "Selector",
    emits: ["next"],
    setup(__props, { expose, emit }) {
      const videoList = vue.ref([]);
      const card = vue.ref();
      vue.onMounted(() => {
      });
      function nextVideo(index) {
        videoList.value.forEach((it, ix) => {
          if (ix == index) {
            it.default = true;
          } else {
            it.default = false;
          }
        });
        emit("next", videoList.value[index]);
      }
      function loadingList(vList) {
        console.log(vList);
        videoList.value = vList;
        scrollToData();
      }
      function scrollToData() {
        let target = $2('div[data-def="true"]');
        if (target.length == 0) {
          setTimeout(scrollToData, 200);
          return;
        }
        card.value.setScrollTop(target[0].offsetTop);
      }
      expose({
        loadingList
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElScrollbar), {
          class: "GoodList",
          ref_key: "card",
          ref: card
        }, {
          default: vue.withCtx(() => [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(videoList.value, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                "data-def": item.default,
                class: "card",
                key: index
              }, [
                vue.createVNode(vue.unref(elementPlus.ElTooltip), {
                  content: item.file.name,
                  placement: "left-start",
                  effect: "light",
                  "hide-after": "10",
                  "show-after": "100"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(elementPlus.ElCard), {
                      shadow: item.default ? "always" : "hover",
                      onClick: vue.withModifiers(($event) => nextVideo(index), ["stop"])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createElementVNode("p", {
                          style: vue.normalizeStyle(item.default ? "color:#23ade5" : "")
                        }, vue.toDisplayString(item.file.name), 5)
                      ]),
                      _: 2
                    }, 1032, ["shadow", "onClick"])
                  ]),
                  _: 2
                }, 1032, ["content"])
              ], 8, _hoisted_1$3);
            }), 128))
          ]),
          _: 1
        }, 512);
      };
    }
  };
  const Selector = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-d200ca3c"]]);
  const VideoPage_vue_vue_type_style_index_0_scoped_ee523f38_lang = "";
  const _sfc_main$3 = {
    __name: "VideoPage",
    setup(__props) {
      const artRef = vue.ref();
      const subtitleRef = vue.ref();
      const selectorRef = vue.ref();
      const color = vue.ref("#fff");
      const table = vue.ref(false);
      const showSelector = vue.ref(false);
      const retry = vue.reactive({
        error: false,
        text: "",
        title: "",
        loading: false
      });
      const transcoding = {
        UHD: "4K 超清",
        QHD: "2K 超清",
        FHD: "1080 全高清",
        HD: "720 高清",
        SD: "540 标清",
        LD: "360 流畅"
      };
      var options = {};
      var retries = 3;
      let instance;
      vue.onMounted(() => {
        getVideoInfo(artp);
      });
      function getOption(video) {
        let vInfo = user.getVideoPage();
        let yh = vInfo.name && getExt(vInfo.name) == "mp4" && false;
        let play_info = video.video_preview_play_info;
        let task_list = play_info.live_transcoding_task_list;
        var option = [];
        if (yh) {
          option.push({
            html: " 原画",
            url: ""
          });
        }
        task_list.forEach(function(item, index) {
          let name2 = transcoding[item.template_id];
          if (!name2) {
            return;
          }
          if (item.url != "") {
            option.push({
              html: name2,
              url: item.url || item.preview_url
            });
          }
        });
        return option;
      }
      function nextVideo(item) {
        showSelector.value = false;
        if (item.file) {
          item = item.file;
        }
        instance.destroy(false);
        let vInfo = user.getVideoPage();
        vInfo.id = item.file_id;
        if (!item.user_meta) {
          item.user_meta = "{}";
        }
        let meta = JSON.parse(item.user_meta);
        vInfo.duration = meta.duration;
        vInfo.play_cursor = meta.play_cursor;
        vInfo.name = item.name;
        vInfo.thumbnail = item.thumbnail;
        getVideoInfo(artp);
      }
      function artp(video) {
        var option = getOption(video);
        var plset = user.getVideoPlayerSet();
        color.value = plset.subtitleColor || "#FFF";
        instance = new Artplayer2({
          container: artRef.value,
          settings: [
            {
              html: "画中画",
              icon: '<i class="art-icon art-icon-pip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" height="32" width="32"><path d="M25 17h-8v6h8v-6Zm4 8V10.98C29 9.88 28.1 9 27 9H9c-1.1 0-2 .88-2 1.98V25c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2Zm-2 .02H9V10.97h18v14.05Z"></path></svg></i>',
              switch: false,
              tooltip: "Close",
              onSwitch: function(item, $dom, event) {
                console.info(item, $dom, event);
                const nextState = !item.switch;
                instance.pip = nextState;
                item.tooltip = nextState ? "Open" : "Close";
                return nextState;
              }
            },
            {
              html: "字幕设置",
              selector: [
                {
                  html: "字体大小",
                  range: [plset.subtitleSize || 20, 10, 45, 5],
                  tooltip: (plset.subtitleSize || 20) + "px",
                  onChange: function(item, $dom, event) {
                    $2(".art-subtitle").css("font-size", item.range + "px");
                    instance.subtitleSize = item.range;
                    return item.range + "px";
                  }
                },
                {
                  html: "上下移动",
                  range: [plset.subtitleMargin || 0, 0, 150, 10],
                  tooltip: (plset.subtitleMargin || 0) + "px",
                  onChange: function(item, $dom, event) {
                    $2(".art-subtitle").css("margin-bottom", item.range + "px");
                    instance.subtitleMargin = item.range;
                    return item.range + "px";
                  }
                },
                {
                  html: "偏移",
                  tooltip: (plset.subtitleOffset || 0) + "s",
                  range: [plset.subtitleOffset || 0, -5, 5, 0.1],
                  onChange(item) {
                    instance.subtitleOffset = item.range;
                    return item.range + "s";
                  }
                },
                {
                  html: `<div style="display:flex;justify-content:center; align-items:center ">颜色<div style='background-color:${color.value};width:15px;height:15px;' /></div>`,
                  switch: false,
                  onSwitch: function(item, $dom, event) {
                    var subtitle2 = $2(".art-subtitle");
                    elementPlus.ElMessageBox({
                      title: "颜色面板",
                      message: () => vue.h("p", null, [
                        vue.h("span", null, "请选择颜色"),
                        vue.h(elementPlus.ElColorPicker, {
                          model: color,
                          modelValue: color.value,
                          "onUpdate:modelValue": (val) => {
                            color.value = val;
                          }
                        })
                      ]),
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                      closeOnClickModal: false
                    }).then(() => {
                      subtitle2.css("color", color.value);
                      item.html = `<div style="display:flex;justify-content:center; align-items:center ">颜色<div style='background-color:${color.value};width:15px;height:15px;' /></div>`;
                      item.switch = true;
                      instance.subtitleColor = color.value;
                    }).catch(() => {
                    });
                    return false;
                  }
                }
              ]
            }
          ],
          plugins: [
            // 清晰度
            artplayPluginQuality(option),
            // 上下集
            selector(function(item) {
              if (item == null) {
                instance.pause();
                showSelector.value = true;
                return;
              }
              nextVideo(item);
            }),
            //快捷键
            hotkey(),
            // 字幕插件
            subtitle(openSubTitle),
            // 偏好设置
            saveExit()
          ],
          ...options
        });
        instance.on("error", function(e) {
          console.log(e);
        });
        instance.on("ready", () => {
          let subtitle2 = video && video.video_preview_play_info && video.video_preview_play_info.live_transcoding_subtitle_task_list;
          if (subtitle2 != null && subtitle2.length > 0) {
            let subtitleType = getExt(subtitle2[0].url);
            instance.subtitle.switch(subtitle2[0].url, {
              type: subtitleType.length > 3 ? "srt" : subtitleType
            });
          }
          instance.play();
        });
        instance.on("destroy", () => {
          console.info("destroy");
        });
      }
      function getExt(url) {
        if (url.includes("?")) {
          return getExt(url.split("?")[0]);
        }
        if (url.includes("#")) {
          return getExt(url.split("#")[0]);
        }
        return url.trim().toLowerCase().split(".").pop();
      }
      function selectSubTitle(fileInfo) {
        console.log(fileInfo.url);
        table.value = false;
        instance.subtitle.switch(fileInfo.url, {
          type: getExt(fileInfo.name)
        });
        instance.play();
      }
      function openSubTitle() {
        instance.pause();
        table.value = true;
      }
      function retryClick() {
        retries = 3;
        retry.loading = true;
        getVideoInfo(artp);
      }
      var hlsErrorHandler = function(event, data, art) {
        if (art.hls.error == -1) {
          console.log("在处理了");
          return;
        }
        var errorType = data.type;
        var errorDetails = data.details;
        var errorFatal = data.fatal;
        console.log(errorType);
        console.log(errorDetails);
        console.log(errorFatal);
        if (art.hls.error) {
          art.hls.error += 1;
        } else {
          art.hls.error = 1;
        }
        if (data.details == "fragLoadError" && (errorFatal || art.hls.error >= 4)) {
          art.hls.error = -1;
          retry403(art);
        } else if (errorType == "networkError" && errorFatal) {
          elementPlus.ElNotification({
            title: "网络错误",
            message: "请检查网络配置后，刷新页面",
            type: "error"
          });
        }
      };
      function m3u8Hls(video, url, art) {
        if (art.qualityHtml == " 原画") {
          video.src = url;
          return;
        }
        art.hls = new Hls2();
        art.hls.loadSource(url);
        art.hls.attachMedia(video);
        video.addEventListener("loadstart", function(e) {
          console.log("提示视频的元数据已加载" + video.src);
          if (art.hlsCurrentTime403) {
            video.currentTime = art.hlsCurrentTime403;
          }
        });
        art.hls.on(Hls2.Events.ERROR, function(e, d) {
          hlsErrorHandler(e, d, art);
        });
      }
      function retry403(art) {
        getVideoInfo(function(data) {
          let option = getOption(data);
          let index = option.findIndex(function(item2, index2) {
            return item2.html === art.qualityHtml;
          });
          if (index == -1) {
            index = option.length - 1;
          }
          let item = option[index];
          item["default"] = true;
          art.quality_.selector = option;
          art.hlsCurrentTime403 = art.currentTime;
          art.hls.destroy();
          art.hls.error = 0;
          art.hls = new Hls2();
          art.hls.loadSource(item.url);
          art.hls.attachMedia(art.video);
          art.hls.on(Hls2.Events.ERROR, function(e, d) {
            hlsErrorHandler(e, d, art);
          });
        });
      }
      function showSelectorOpen() {
        selectorRef.value.loadingList(instance.videoList);
      }
      function closeSelector() {
        instance.play();
      }
      function getVideoInfo(call) {
        let token = user.getToken();
        if (token == null) {
          elementPlus.ElMessageBox.alert("当前登录凭证获取为空，请刷新或重新登录", {
            confirmButtonText: "获取凭证失败",
            callback: (action) => {
              location.href = location.href;
            }
          });
          return;
        }
        let videoInfo = user.getVideoPage();
        let req;
        if (videoInfo.type == 0) {
          req = videoPreviewPlayInfo({
            category: "live_transcoding",
            drive_id: videoInfo.drive_id,
            file_id: videoInfo.id,
            template_id: "FHD|HD|SD|LD",
            url_expire_sec: 14400,
            get_subtitle_info: true
          });
        } else if (videoInfo.type == 1) {
          let shareToken = user.getShareToken();
          if (!user.isExpires(shareToken)) {
            elementPlus.ElMessageBox.alert("很抱歉，当前页面太久没活动了，请点击刷新后再来观看吧", "分享凭证失效", {
              confirmButtonText: "刷新",
              callback: (action) => {
                location.href = location.href;
              }
            });
          }
          req = shareVideoInfo(videoInfo.id, shareToken.share_id, shareToken.share_token);
        }
        req.then((res) => {
          retry.error = false;
          Artplayer2.ASPECT_RATIO = ["default", "1:1", "2:1", "4:3", "16:9", "21:9"];
          options = {
            id: videoInfo.id,
            poster: videoInfo.thumbnail,
            title: videoInfo.name,
            type: "m3u8",
            customType: {
              m3u8: m3u8Hls
            },
            flip: true,
            setting: true,
            playbackRate: true,
            aspectRatio: true,
            fullscreen: true,
            fullscreenWeb: true,
            miniProgressBar: true,
            autoplay: true,
            screenshot: true,
            hotkey: false,
            airplay: true,
            theme: "#23ade5",
            volume: 1,
            contextmenu: [],
            icons: {
              state: `<img width="150" heigth="150" src="${state}">`,
              indicator: `<img width="16" heigth="16" src="${indicator}">`
            }
          };
          if (videoInfo.type == 0) {
            $2(".text--KBVB3").text(videoInfo.name);
          } else if (videoInfo.type == 1) {
            $2(".header-file-name--CN_fq").text(videoInfo.name);
          }
          call && call(res.data);
        }).catch((e) => {
          if (instance) {
            instance.pause();
            instance.destroy(false);
          }
          if (e.skip) {
            return;
          }
          console.log(e);
          if (retries != 0) {
            retries = retries - 1;
            getVideoInfo(call);
          }
          if (e && e + "" == "AxiosError: Request failed with status code 429") {
            retry.text = "请稍候点击下方按钮，刷新尝试";
            retry.title = "您操作的太快了";
          } else {
            retry.title = "接口问题";
            retry.text = e + "";
          }
          retry.error = true;
        }).finally(() => {
          retry.loading = false;
        });
      }
      vue.onUnmounted(() => {
        if (instance) {
          instance.destroy(false);
        }
        console.log("视频页面销毁");
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(vue.unref(elementPlus.ElDrawer), {
            modelValue: table.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => table.value = $event),
            title: "请选择字幕文件",
            direction: "rtl",
            size: "25%"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(SubTitle, {
                onSelectSubTitle: selectSubTitle,
                ref_key: "subtitleRef",
                ref: subtitleRef
              }, null, 512)
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(vue.unref(elementPlus.ElDrawer), {
            modelValue: showSelector.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showSelector.value = $event),
            title: "选集",
            direction: "rtl",
            size: "20%",
            onOpen: showSelectorOpen,
            onClose: closeSelector
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(Selector, {
                videoList: _ctx.videoList,
                ref_key: "selectorRef",
                ref: selectorRef,
                onNext: nextVideo
              }, null, 8, ["videoList"])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.withDirectives(vue.createElementVNode("div", {
            class: "player",
            ref_key: "artRef",
            ref: artRef
          }, null, 512), [
            [vue.vShow, !retry.error]
          ]),
          vue.withDirectives(vue.createVNode(vue.unref(elementPlus.ElResult), {
            title: retry.title,
            "sub-title": retry.text
          }, {
            extra: vue.withCtx(() => [
              vue.createVNode(vue.unref(elementPlus.ElButton), {
                type: "primary",
                loading: retry.loading,
                onClick: vue.withModifiers(retryClick, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("刷新")
                ]),
                _: 1
              }, 8, ["loading", "onClick"])
            ]),
            _: 1
          }, 8, ["title", "sub-title"]), [
            [vue.vShow, retry.error]
          ])
        ], 64);
      };
    }
  };
  const VideoPage = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ee523f38"]]);
  const _hoisted_1$2 = { style: { "height": "410px", "overflow-y": "auto" } };
  const _hoisted_2$2 = {
    key: 0,
    align: "center",
    width: "100%",
    color: "#1890ff",
    size: "1/"
  };
  const _hoisted_3$2 = ["onClick"];
  const _hoisted_4$2 = /* @__PURE__ */ vue.createElementVNode("a", null, "清空本地历史", -1);
  const _hoisted_5$2 = [
    _hoisted_4$2
  ];
  const _hoisted_6$2 = {
    "data-index": "0",
    class: "tr-wrapper--RxoAI",
    style: { "height": "52px", "width": "100%" }
  };
  const _hoisted_7$1 = /* @__PURE__ */ vue.createElementVNode("div", {
    class: "padding-element-horizontal--pMTS6",
    style: { "width": "32px" }
  }, null, -1);
  const _hoisted_8$1 = {
    class: "drop-wrapper--T27s",
    "data-drop-target": "false"
  };
  const _hoisted_9$1 = {
    "data-is-dragging": "false",
    class: "drag-wrapper---smTQ",
    draggable: "true"
  };
  const _hoisted_10$1 = {
    class: "tr--Ogi-3 tr--97U9T",
    "data-is-selected": "false",
    "data-clickable": "true",
    "data-has-checkbox": "true",
    style: { "cursor": "pointer" }
  };
  const _hoisted_11 = ["onClick"];
  const _hoisted_12 = /* @__PURE__ */ vue.createElementVNode("span", {
    "data-role": "icon",
    "data-render-as": "svg",
    "data-icon-type": "PDSMore",
    class: "ant-dropdown-trigger icon--d-ejA"
  }, [
    /* @__PURE__ */ vue.createElementVNode("svg", {
      t: "1676180557921",
      class: "icon",
      viewBox: "0 0 1024 1024",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      "p-id": "3478",
      width: "16",
      height: "16"
    }, [
      /* @__PURE__ */ vue.createElementVNode("path", {
        d: "M374.6 636.5c4.4 0 8.5-1.2 12.1-3.3l171.7-100c8-3.6 13.6-11.9 13.6-21.5 0-8.8-4.8-16.6-11.9-20.7l-167.8-97.8c-4.3-5-10.7-8.1-17.7-8.1-13.1 0-23.6 10.7-23.6 23.8v1.3l-0.3 0.2 0.4 199.8c-0.1 0.8-0.1 1.6-0.1 2.5 0 13.2 10.6 23.8 23.6 23.8z",
        fill: "#4D4D4D",
        "p-id": "3479"
      }),
      /* @__PURE__ */ vue.createElementVNode("path", {
        d: "M64.7 586.3a32.2 32.1 0 1 0 64.4 0 32.2 32.1 0 1 0-64.4 0Z",
        fill: "#4D4D4D",
        "p-id": "3480"
      }),
      /* @__PURE__ */ vue.createElementVNode("path", {
        d: "M960 398.3c0.1-1.6 0.2-3.2 0.2-4.8 0-35-28.5-63.3-63.6-63.3-11.7 0-22.7 3.2-32.2 8.7l-0.5-0.3-31.5 18.2v-64.7c-0.1-73.1-59.9-133-133.1-133H197.4c-73.1 0-133 59.8-133 133v165.8h0.2c0 17.7 14.4 32.1 32.2 32.1s32.2-14.4 32.2-32.1h0.2V287c0-35.2 28.8-64 64-64h510.2c35.2 0 64 28.8 64 64v448.9c0 35.2-28.8 64-64 64H193.3c-35.2 0-64-28.8-64-64v-21.4c0-17.7-14.4-32.1-32.2-32.1-17.8 0-32.2 14.4-32.2 32.1h-0.4v15.3c0 73.2 59.9 133 133 133h501.9c73.2 0 133-59.8 133-133v-64.1l33.1 19.1 0.1-0.1c9.2 5.1 19.8 8 31 8 35.1 0 63.6-28.4 63.6-63.3 0-1.6-0.1-3.2-0.2-4.8V398.3z m-63.6 205.1c-0.3 7.8-6.9 14.1-15 14.1-2.7 0-5.3-0.7-7.5-2l-41.5-23.7V430.1l40.9-23.2c2.3-1.5 5.1-2.3 8.1-2.3 8.3 0 15 6.6 15 14.6v184.2z",
        fill: "#4D4D4D",
        "p-id": "3481"
      })
    ])
  ], -1);
  const _hoisted_13 = [
    _hoisted_12
  ];
  const _hoisted_14 = ["onClick"];
  const _hoisted_15 = /* @__PURE__ */ vue.createElementVNode("div", {
    class: "cover--Mn1Bt file-cover--tJG-H",
    "data-size": "XXS",
    "data-thumbnail": "normal"
  }, [
    /* @__PURE__ */ vue.createElementVNode("div", { class: "is-loaded--otXtL thumbnail-wrapper--aGcWv" }, [
      /* @__PURE__ */ vue.createElementVNode("div", { class: "thumbnail--skb-6 fill-mode-cover--VWUJo size-xxs--oSITU" }, [
        /* @__PURE__ */ vue.createElementVNode("img", {
          alt: "video",
          class: "fileicon--38wQG fileicon---webs",
          draggable: "false",
          src: "https://img.alicdn.com/imgextra/i2/O1CN01H7FCkb1P6mPJxDEFa_!!6000000001792-2-tps-80-80.png"
        })
      ])
    ])
  ], -1);
  const _hoisted_16 = ["title"];
  const _hoisted_17 = ["onClick"];
  const _hoisted_18 = { class: "text-secondary--kiARj" };
  const _hoisted_19 = {
    class: "td--SGrZj td---v-kp",
    "data-col-key": "size",
    style: { "width": "160px", "flex": "0 0 auto" }
  };
  const _hoisted_20 = { class: "text-secondary--kiARj" };
  const _hoisted_21 = ["href"];
  const _hoisted_22 = /* @__PURE__ */ vue.createElementVNode("div", {
    class: "padding-element-horizontal--39l8Q",
    style: { "width": "32px" }
  }, null, -1);
  const _sfc_main$2 = {
    __name: "VideoHistoryPage",
    setup(__props) {
      let locList = vue.ref(user.getVideoLookList());
      let clodList = vue.ref([]);
      let listData = vue.ref([
        {
          key: "本地历史",
          list: locList
        },
        {
          key: "云端历史",
          list: clodList
        }
      ]);
      vue.onMounted(() => {
        videoHistoryList(listFuction);
      });
      function listFuction(data) {
        if (data.length != 0) {
          clodList.value = data;
        }
      }
      function clearHistory() {
        user.clearVideoHistory();
        locList.value = [];
      }
      function playInfo(videoItem) {
        if (videoItem.share) {
          location.href = videoItem.href;
          return;
        }
        let vInfo = user.getVideoPage();
        vInfo.id = videoItem.id;
        vInfo.drive_id = videoItem.drive_id;
        vInfo.play_cursor = videoItem.play_cursor;
        vInfo.name = videoItem.name;
        vInfo.thumbnail = "";
        vInfo.folderName = videoItem.folderName;
        vInfo.type = 0;
        vInfo.href = videoItem.href;
        let html2 = `<div class="modal--nw7G9" id="videoHistory">
    <div class="web--sYiY- container--5Stu-">
      <div class="content--9N3Eh">
        <div class="header--u7XR-" data-layout-sider-open="true">
        <div class="header-right--jsds3">
          <div class="nav-actions--hGPM3">
          <span class="nav-action--McoQC nav-prev--f5MXf">
                    <span data-role="icon" data-render-as="svg" data-icon-type="PDSLeftNormal" class="nav-icon--0dKs7 icon--D3kMk "  style="color:#1890ff">
                  <svg viewBox="0 0 1024 1024">
                    <use xlink:href="#PDSRightNormal">
                    </use>
                  </svg>
                </span>
                <span class="nav-text--gdQi6">
                  <a href="${vInfo.href}">进入到当前目录</a>
                </span>
              </span>
            </div>
          <div class="separator--cn-Xf">
            </div>
          </div>
        <div class="header-center--CexZ2">
          <div class="filename--cpLKM">
              <span class="text--KBVB3">${vInfo.name}</span>
            </div>
          </div>
          <div style="padding:10px" id="header-close">
            <span data-role="icon" data-render-as="svg" data-icon-type="PDSClose"  class="icon--BObaC icon--D3kMk ">
              <svg viewBox="0 0 1024 1024" data-spm-anchor-id="0.0.0.i4.54a06c75hUkxKw">
                <use xlink:href="#PDSClose">
                </use>
              </svg>
            </span>
          </div>
        </div>
        <div class="previewer--g6qCF">
          <div class="video-previewer--6slx7">
 		<div class="video-previewer-container--43gy-"  tabindex="-1" data-fullscreen="false">
               <div class="video-stage---5FXB">
                <video class="video--26SLZ" preload="metadata" src="">
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
        $2("#root").append(html2);
        var app = vue.createApp(VideoPage);
        app.mount(
          (() => {
            const app2 = $2(`<div id="videoPage" class='video-previewer--6slx7'></div>`)[0];
            $2(".previewer--g6qCF").replaceWith(app2);
            $2(".ant-modal-Link .icon-wrapper--TbIdu").click();
            return app2;
          })()
        );
        $2("#header-close").one("click", function() {
          app.unmount();
          $2("#videoHistory").remove();
        });
      }
      let videoHistoryList = function(callback) {
        homeWidgets().then((res) => {
          let site = location.protocol + "//" + location.host + "/drive/file/backup/";
          if (res.data && res.data.recentUsed) {
            let videoList = res.data.recentUsed.items.filter(function(item, index) {
              return item.category === "video";
            });
            videoList = videoList.map((item) => {
              let href = site;
              if (item.compilationId) {
                let i2 = item.compilationId.indexOf("_");
                let compilationId = item.compilationId.substring(i2 + 1, item.compilationId.length);
                href += compilationId;
              }
              return {
                "category": "video",
                "name": item.name,
                "progress": item.progressPercentage,
                "id": item.fileId,
                "folderName": item.fromSourceDescription,
                "href": href,
                "share": false,
                "drive_id": item.driveId,
                "play_cursor": item.playCursor
              };
            });
            callback && callback(videoList);
            return;
          }
          callback && callback([]);
        }).catch((err) => {
          callback && callback([]);
        });
      };
      vue.onUnmounted(() => {
        console.log("历史页面销毁");
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createElementVNode("p", {
            style: { "padding-bottom": "10px" },
            class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
          }, " 最近观看了" + vue.toDisplayString(vue.unref(locList).length + vue.unref(clodList).length) + "个视频", 3),
          vue.createElementVNode("div", _hoisted_1$2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(listData), (data, i1) => {
              return vue.openBlock(), vue.createElementBlock("div", { key: i1 }, [
                data.key == "云端历史" ? (vue.openBlock(), vue.createElementBlock("hr", _hoisted_2$2)) : vue.createCommentVNode("", true),
                vue.createElementVNode("h1", {
                  style: { "padding-bottom": "13px" },
                  class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary)
                }, vue.toDisplayString(data.key), 3),
                data.key == "本地历史" ? (vue.openBlock(), vue.createElementBlock("p", {
                  key: 1,
                  class: "text-secondary--38-Of clearHistory",
                  style: { "padding-bottom": "13px" },
                  onClick: vue.withModifiers(clearHistory, ["stop"])
                }, _hoisted_5$2, 8, _hoisted_3$2)) : vue.createCommentVNode("", true),
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(data.list, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("div", {
                    style: { "height": "52px", "width": "100%" },
                    key: index
                  }, [
                    vue.createElementVNode("div", _hoisted_6$2, [
                      _hoisted_7$1,
                      vue.createElementVNode("div", _hoisted_8$1, [
                        vue.createElementVNode("div", _hoisted_9$1, [
                          vue.createElementVNode("div", _hoisted_10$1, [
                            vue.createElementVNode("div", {
                              onClick: ($event) => playInfo(item),
                              class: "checkbox--P-zHa checkbox-container--t0ALJ",
                              role: "checkbox",
                              "aria-checked": "false",
                              "data-checked": "false",
                              "data-partial": "false",
                              "data-disabled": "false",
                              "data-no-padding": "false"
                            }, _hoisted_13, 8, _hoisted_11),
                            vue.createElementVNode("div", {
                              class: "td--SGrZj td---v-kp history_video",
                              compilationid: "",
                              "data-col-key": "name",
                              style: { "flex": "1 1 0%", "min-width": "160px" },
                              onClick: ($event) => playInfo(item)
                            }, [
                              _hoisted_15,
                              vue.createElementVNode("p", {
                                class: vue.normalizeClass(vue.unref(CLASS_NAMES).textPrimary),
                                title: item.name
                              }, vue.toDisplayString(item.name), 11, _hoisted_16)
                            ], 8, _hoisted_14),
                            vue.createElementVNode("div", {
                              compilationid: "",
                              class: "history_video td--SGrZj td---v-kp",
                              "data-col-key": "updated_at",
                              style: { "width": "200px", "flex": "0 0 auto" },
                              onClick: ($event) => playInfo(item)
                            }, [
                              vue.createElementVNode("p", _hoisted_18, "已观看" + vue.toDisplayString(item.progress) + "%", 1)
                            ], 8, _hoisted_17),
                            vue.createElementVNode("div", _hoisted_19, [
                              vue.createElementVNode("p", _hoisted_20, [
                                vue.createElementVNode("a", {
                                  href: item.href
                                }, vue.toDisplayString(item.folderName), 9, _hoisted_21)
                              ])
                            ])
                          ])
                        ])
                      ]),
                      _hoisted_22
                    ])
                  ]);
                }), 128))
              ]);
            }), 128))
          ])
        ]);
      };
    }
  };
  let showDownloadHomePage = function() {
    let app = vue.createApp(DwoloadPage);
    showDiv("文件下载", app);
  };
  function initMenuButton(menuName) {
    if ($2(".button-download-aliyun").length !== 0) {
      return;
    }
    var css2 = "#root header:eq(0)";
    if ($2(css2).length > 0) {
      var html2 = "";
      html2 += `<div style="margin:1px 8px;"></div><div class="${CLASS_NAMES.button} small--e7LRt history-video"><span style="margin-right:2px" data-role="icon"data-render-as="svg"data-icon-type="PDSAddS"class="icon--D3kMk"><svg t="1676170067530"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="2764"width="200"height="200"><path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m42.666667-486.869333V298.538667C554.666667 275.328 535.552 256 512 256c-23.722667 0-42.666667 19.029333-42.666667 42.538667v256.256a41.984 41.984 0 0 0 12.202667 29.866666l121.258667 121.258667a42.368 42.368 0 0 0 60.032-0.298667 42.666667 42.666667 0 0 0 0.298666-60.032L554.666667 537.130667z"fill="#ffffff"p-id="2765"></path></svg></span><p style="color: white;">最近在看<p></div>`;
      html2 += `<div style="margin:1px 8px;"></div><div class="${CLASS_NAMES.button} small--e7LRt button-download-aliyun"><p style="color: white;">显示链接<p></div>`;
      $2(".history-video").remove();
      $2(".button-download-aliyun").remove();
      $2(css2).append(html2);
      $2(".button-download-aliyun").on("click", showDownloadHomePage);
      $2(".history-video").on("click", () => {
        let app = vue.createApp(_sfc_main$2);
        showDiv(`<div style="display:flex; justify-content:center;  align-items:center;">
                    <span data-role="icon" data-render-as="svg" data-icon-type="PDSRecent" class="icon--d-ejA " style="color: white;">
                        <svg viewBox="0 0 1024 1024"><use xlink:href="#PDSRecent"></use></svg>
                        </span>最近在看</div>`, app);
      });
    } else {
      setTimeout(function() {
        initMenuButton();
      }, 1e3);
    }
  }
  const home = (menuName) => {
    initMenuButton();
  };
  function handler$3(res) {
    let data = res.data;
    let response = res.response;
    let page = user.getPage();
    let items = [];
    if (page.id === data.parent_file_id && page.order === data.order_direction && page.order_by === data.order_by && page.drive_id === data.drive_id) {
      items = response.items;
    } else {
      page.id = data.parent_file_id;
      page.order = data.order_direction;
      page.drive_id = data.drive_id;
      page.order_by = data.order_by;
      page.items = response.items;
    }
    let folderName = $2(".breadcrumb-item-link--9zcQY:last").text();
    page.folderName = folderName;
    if (items.length > 0) {
      if (!page.items) {
        page.items = [];
      }
      items.forEach(function(newItem) {
        var existingItemIndex = page.items.findIndex(function(oldItem) {
          return oldItem.file_id === newItem.file_id;
        });
        if (existingItemIndex !== -1) {
          page.items[existingItemIndex] = newItem;
        } else {
          page.items.push(newItem);
        }
      });
    }
    console.log(`已加载${page.items.length}个文件`);
    showSuccess(`已加载${page.items.length}个文件`);
    if ($2(".button-download-aliyun").length <= 0 && user.home()) {
      home();
    }
  }
  const fileList = () => {
    http.onResponse(function(res, url) {
      let config = res.config;
      try {
        config.data = JSON.parse(config.data);
      } catch (error) {
        config.data = {};
      }
      let response = {
        response: res.response,
        data: config.data
      };
      if (url.indexOf("/file/list") > 0 || url.indexOf("/file/search") > 0 || url.indexOf("/adrive/v1/intelligent/movie") > 0 || url.indexOf("/adrive/v1/intelligent/tv") > 0) {
        handler$3(response);
      }
    });
  };
  var interval;
  function initVideoPlayer(videoFile) {
    let node = $2(".video-previewer--6slx7");
    if (node.length <= 0) {
      if (interval == null) {
        interval = setInterval(function() {
          initVideoPlayer(videoFile);
        }, 200);
      }
      return;
    } else {
      clearInterval(interval);
      interval = null;
    }
    let vInfo = user.getVideoPage();
    vInfo.id = videoFile.file_id;
    if (videoFile.user_meta) {
      try {
        let meta = JSON.parse(videoFile.user_meta);
        if (meta.duration) {
          vInfo.duration = meta.duration;
        }
        if (meta.play_cursor) {
          vInfo.play_cursor = meta.play_cursor;
        }
      } catch (error) {
        console.error(error);
      }
    }
    vInfo.name = videoFile.name;
    vInfo.drive_id = videoFile.drive_id;
    vInfo.thumbnail = videoFile.thumbnail;
    vInfo.folderName = user.getPage().folderName;
    vInfo.type = 0;
    vInfo.href = location.href;
    var app = vue.createApp(VideoPage);
    app.mount(
      (() => {
        const app2 = $2(`<div id="videoPage" class='video-previewer--6slx7'></div>`)[0];
        node.replaceWith(app2);
        return app2;
      })()
    );
    $2(".header-left--Kobd9").on("click", function() {
      app.unmount();
    });
  }
  function homeVideo(videoFile) {
    if (interval != null) {
      clearInterval(interval);
    }
    initVideoPlayer(videoFile);
  }
  function shareVideo$1(videoFile) {
    let node = $2(".video-previewer--Rg9fI");
    if (node.length <= 0) {
      if (interval == null) {
        interval = setInterval(function() {
          shareVideo$1(videoFile);
        }, 200);
      }
      return;
    } else {
      clearInterval(interval);
      interval = null;
    }
    let it = user.getPage().items;
    let index = it.findIndex((item) => {
      return item.file_id == videoFile.file_id;
    });
    console.log(index);
    if (index == -1) {
      elementPlus.ElMessageBox.alert("手速太快啦，请回到文件列表中，随便点击排序，看到已加载多少文件时,在进来吧", "操作页面过快", {
        confirmButtonText: "去排序",
        callback: (action) => {
          location.href = location.href;
        }
      });
      return;
    }
    let v = it[index];
    v.user_meta = "{}";
    let vInfo = user.getVideoPage();
    let list = user.getVideoLookList();
    index = list.findIndex((item) => {
      return item.id == videoFile.file_id;
    });
    if (index != -1) {
      vInfo.play_cursor = list[index].play_cursor;
    }
    vInfo.id = v.file_id;
    vInfo.name = v.name;
    vInfo.thumbnail = v.thumbnail;
    vInfo.type = 1;
    vInfo.folderName = "来自分享";
    vInfo.href = location.href;
    var app = vue.createApp(VideoPage);
    app.mount(
      (() => {
        const app2 = $2(`<div id="videoPage" class='video-previewer--Rg9fI'></div>`)[0];
        node.replaceWith(app2);
        return app2;
      })()
    );
    $2(".header-icon--bJn--").on("click", function() {
      app.unmount();
    });
  }
  function handler$2(res) {
    let response = res.response;
    if (response.category && response.category === "video") {
      homeVideo(response);
    }
  }
  const fileGet = () => {
    http.onResponse(function(res, url) {
      let config = res.config;
      try {
        config.data = JSON.parse(config.data);
      } catch (error) {
        config.data = {};
      }
      let response = {
        response: res.response,
        data: config.data
      };
      if (url.endsWith("/file/get")) {
        handler$2(response);
      }
    });
  };
  function handler$1(res) {
    let response = res.response;
    let shareToken = user.getShareToken();
    if (!user.isExpires(shareToken) || shareToken.share_id != response.share_id) {
      showError("当前页面已过期，请刷新重试");
      return;
    }
    shareVideo$1(response);
  }
  const shareVideo = () => {
    http.onResponse(function(res, url) {
      let config = res.config;
      try {
        config.data = JSON.parse(config.data);
      } catch (error) {
        config.data = {};
      }
      let response = {
        response: res.response,
        data: config.data
      };
      if (url.indexOf("get_video_preview_play_info_by_share") > 0) {
        handler$1(response);
      }
    });
  };
  const fileUpdate = () => {
    http.onRequest(function(req) {
      if (req.url.endsWith("v3/file/update")) {
        let reqbody = JSON.parse(req.data[0]);
        let name2 = reqbody.name;
        let i2 = name2.lastIndexOf(".");
        if (i2 === -1) {
          return;
        }
        let newName = name2.substring(0, i2);
        if (newName.lastIndexOf(".") !== -1) {
          reqbody.name = newName;
          req.data[0] = JSON.stringify(reqbody);
        }
      }
    });
  };
  const logout = () => {
    http.onRequest(function(req) {
      if (req.url.endsWith("/users/v1/users/device_logout")) {
        deviceLogout().then((response) => {
          console.log("用户退出");
        });
      }
    });
  };
  function handler(headers) {
    user.sessionSet(headers["Authorization"], headers["x-device-id"], headers["x-signature"]);
  }
  const session$2 = () => {
    http.onRequest(function(req) {
      let fileId = req.headers["fileId"];
      if (fileId == null && req.headers["x-device-id"] != null) {
        handler(req.headers);
      }
    });
  };
  const xhrHandler = () => {
    fileList();
    fileGet();
    shareVideo();
    fileUpdate();
    logout();
    session$2();
  };
  class XMLHttp {
    constructor() {
      __publicField(this, "request", function(param) {
      });
      __publicField(this, "response", function(param) {
      });
      __publicField(this, "onRequest", function(cal) {
        this.requestListen.push(cal);
      });
      __publicField(this, "onResponse", function(cal) {
        this.responseListen.push(cal);
      });
      this.responseListen = [];
      this.requestListen = [];
    }
  }
  function initXMLHttpRequest(http2) {
    let open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(...args) {
      let send = this.send;
      let _this = this;
      let post_data = [];
      this.send = function(...data) {
        post_data = data;
        let dataBody = {
          url: args[1],
          method: args[0],
          headers: {},
          data
        };
        if (_this._header_) {
          dataBody.headers = _this._header_;
        }
        if (_this._header_ && _this._header_["fileId"]) {
          return send.apply(_this, data);
        }
        http2.request(dataBody);
        return send.apply(_this, data);
      };
      this.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
          let config = {
            url: args[1],
            status: this.status,
            method: args[0],
            data: post_data
          };
          let res = this.response;
          if (_this._header_ && _this._header_["fileId"]) {
            return;
          }
          if (typeof res == "string") {
            try {
              res = JSON.parse(this.response);
            } catch (e) {
            }
          }
          http2.response({ config, response: res, header: _this._header_ });
        }
      }, false);
      return open.apply(this, args);
    };
  }
  const http = new XMLHttp();
  function listen() {
    xhrHandler();
    http.request = function(req) {
      if (this.requestListen.length > 0) {
        this.requestListen.forEach((i2) => {
          i2(req);
        });
      }
    };
    http.response = function(res) {
      if (this.responseListen.length > 0) {
        let config = res.config;
        this.responseListen.forEach((i2) => {
          i2(res, config.url);
        });
      }
    };
    initXMLHttpRequest(http);
  }
  let showDownloadSharePage = function() {
    elementPlus.ElMessageBox.alert("很抱歉，当前官方暂时已下线该功能，如需下载，请先保存后在自己的网盘中获取直链。", {
      confirmButtonText: "确定"
    });
  };
  function initShareButton() {
    if ($2(".button-download-aliyun").length !== 0) {
      $2(".button-download-aliyun").remove();
    }
    if ($2("#root [class^=banner] [class^=right]").length !== 0 && $2(".button--fep7l").length == 0) {
      var html2 = "";
      html2 += `<div style="margin:1px 7px;"></div><button class="${CLASS_NAMES.button}  medium--Pt0UL button-download-aliyun"><p style="color: white;">显示链接<p></button>`;
      $2("#root [class^=banner] [class^=right]").prepend(html2);
      $2(".button-download-aliyun").on("click", showDownloadSharePage);
    } else {
      setTimeout(initShareButton, 1e3);
    }
  }
  const share = () => {
    initShareButton();
  };
  const SignInPage_vue_vue_type_style_index_0_scoped_46fc6531_lang = "";
  const _withScopeId$1 = (n) => (vue.pushScopeId("data-v-46fc6531"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = {
    key: 0,
    class: "notice"
  };
  const _hoisted_2$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_3$1 = {
    key: 1,
    class: "notice2"
  };
  const _hoisted_4$1 = {
    key: 2,
    class: "notice"
  };
  const _hoisted_5$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_6$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _sfc_main$1 = {
    __name: "SignInPage",
    setup(__props) {
      const signInSwitch = vue.ref(false);
      const signInSet = vue.ref({
        goods_info: {
          name: "",
          description: "",
          notice: ""
        }
      });
      const isSigIn = vue.computed(() => {
        return isSignIn();
      });
      async function signIn() {
        const data = await signInList();
        if (data.status !== 200) {
          showError$1("签到失败，服务器响应：" + data.status);
          return;
        }
        let signin_count = data.data["result"]["signInCount"];
        console.log(signin_count);
        var reward = await signInReward(signin_count);
        if (data.status !== 200) {
          showError$1("领取奖励失败，服务器响应：" + reward.status);
          return;
        }
        const res = reward.data;
        let rewardName = res["result"]["name"];
        let rewardDescription = res["result"]["description"];
        let rewardNotice = res["result"]["notice"];
        signInSet.value["last_siginIn"] = getNowDate();
        signInSet.value["goods_info"] = {
          name: rewardName,
          description: rewardDescription,
          notice: rewardNotice
        };
        showSuccess(rewardNotice);
        user.setSignInSet(signInSet.value);
      }
      const changeEvent = () => {
        signInSet.value["status"] = signInSwitch.value;
        if (!isSignIn() && signInSwitch.value) {
          signIn();
        }
        user.setSignInSet(signInSet.value);
      };
      function getNowDate() {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;
        var day = currentDate.getDate();
        return year + "" + month + day;
      }
      function isSignIn() {
        const now = getNowDate();
        return signInSet.value["last_siginIn"] == now;
      }
      vue.onMounted(async () => {
        let _signInSet = user.getSignInSet();
        if (Object.keys(_signInSet).length > 0) {
          signInSet.value = _signInSet;
        }
        signInSwitch.value = _signInSet["status"] == true;
        if (!isSignIn() && signInSwitch.value) {
          signIn();
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createElementVNode("p", null, [
            vue.unref(isSigIn) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$1, "今日：已签到")) : vue.createCommentVNode("", true),
            vue.createTextVNode(),
            _hoisted_2$1,
            !vue.unref(isSigIn) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3$1, "今日：末签到")) : vue.createCommentVNode("", true),
            vue.unref(isSigIn) ? (vue.openBlock(), vue.createElementBlock("p", _hoisted_4$1, [
              vue.createTextVNode(vue.toDisplayString(signInSet.value.goods_info.name), 1),
              _hoisted_5$1,
              vue.createTextVNode(" " + vue.toDisplayString(signInSet.value.goods_info.description), 1),
              _hoisted_6$1
            ])) : vue.createCommentVNode("", true)
          ]),
          vue.createVNode(vue.unref(elementPlus.ElForm), { style: { "max-width": "100%" } }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(elementPlus.ElFormItem), { label: "自动签到" }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(elementPlus.ElSwitch), {
                    modelValue: signInSwitch.value,
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => signInSwitch.value = $event),
                    "inline-prompt": "",
                    "active-text": "是",
                    "inactive-text": "否",
                    onChange: changeEvent
                  }, null, 8, ["modelValue"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ], 64);
      };
    }
  };
  const SignIn = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-46fc6531"]]);
  var globalMenuName;
  function showHomeUi(menuName) {
    globalMenuName = menuName;
    console.log(globalMenuName);
    if (menuName === "文件" || menuName === "收藏夹" || menuName === "密码箱") {
      setTimeout(function() {
        home();
      }, 200);
    }
  }
  function initHomeUi() {
    let menu = $2(".nav-menu--Lm1q6");
    if (menu.length !== 0) {
      $2(".nav-tab-item--WhAQf").on("click", function(e) {
        showHomeUi(e.currentTarget.textContent);
      });
      setTimeout(function() {
        let node = $2(".is-active--8atYr:eq(0)");
        if (node.length > 0) {
          showHomeUi(node.text());
        }
      }, 300);
    } else {
      setTimeout(initHomeUi, 500);
    }
  }
  function signInUi() {
    let storage = $2(".storage-wrapper--h-rcS");
    if (storage.length !== 0) {
      let app = vue.createApp(SignIn);
      app.mount(
        (() => {
          const app2 = document.createElement("div");
          storage.prepend(app2);
          return app2;
        })()
      );
    } else {
      setTimeout(signInUi, 500);
    }
  }
  const ui = () => {
    if (user.home()) {
      initHomeUi();
      signInUi();
    } else {
      share();
    }
  };
  var sessionLoadding = false;
  var listenArray = new Array();
  function retryRequestWithNewCode(originalRequest) {
    let session2 = user.GetSesion();
    originalRequest.headers["Authorization"] = session2.authorization;
    originalRequest.headers["X-Device-Id"] = session2.deviceId;
    originalRequest.headers["X-Signature"] = session2.signature;
    originalRequest.retry = true;
    return axios2(originalRequest);
  }
  let interceptRequest = function() {
    axios2.interceptors.request.use(async function(config) {
      if (config.retry) {
        return config;
      }
      let token = user.getToken();
      if (token == null) {
        showError$1("当前登录凭证获取为空，请刷新或重新登录");
        throw "token 为空了";
      } else if (!user.isExpires(token)) {
        showError$1("Token已失效,请刷新或重新登录");
        throw "Token已失效,请刷新或重新登录";
      }
      let isToken = config.headers._token;
      config.headers["authorization"] = "".concat(token.token_type || "", " ").concat(token.access_token || "");
      config.headers["fileId"] = token.user_id;
      if (isToken != null && isToken == false) {
        delete config.headers._token;
        return config;
      }
      let session_ref = store.getItem("LG_session_Ref");
      if (session_ref != "" && session_ref == "true") {
        await new Promise((resolve, reject) => {
          function check() {
            if (store.getItem("LG_session_Ref") == "") {
              resolve();
            } else {
              setTimeout(check, 200);
            }
          }
          check();
        });
      }
      if (sessionLoadding) {
        await new Promise((resolve, reject) => {
          listenArray.push(function() {
            resolve();
          });
        });
      }
      let d = user.getDeviceId();
      let s2 = user.getSignature();
      if (d == "" || s2 == "") {
        sessionLoadding = true;
        let rest = await user.session(token, function() {
        });
        if (rest.deviceId) {
          d = rest.deviceId;
        }
        if (rest.signature) {
          s2 = rest.signature;
        }
      }
      sessionLoadding = false;
      if (listenArray.length > 0) {
        listenArray.forEach((i2) => {
          i2 && i2();
        });
        listenArray = new Array();
      }
      config.headers["x-device-id"] = d;
      config.headers["x-signature"] = s2;
      return config;
    }, function(error) {
      console.log("出现异常", error);
      return Promise.reject(error);
    });
    axios2.interceptors.response.use(function(response) {
      return response;
    }, function(error) {
      let repsonse = error.response;
      if (repsonse && (repsonse.status == 401 || repsonse.status == 400)) {
        if (user.GetSesion().deviceId != "") {
          user.removeSession();
          return retryRequestWithNewCode(error.config);
        }
      }
      if (repsonse && repsonse.status == 401 && repsonse.data.code == "UserDeviceOffline") {
        user.clearSession();
        showError$1("当前设备已失效，请刷新重试");
        elementPlus.ElMessageBox.alert("请确认是否有下线设备操作，当前设备已失效", "刷新session失败", {
          confirmButtonText: "刷新试一试",
          callback: (action) => {
            location.href = location.href;
          }
        });
      }
      if (repsonse && repsonse.status == 400 && repsonse.data.code == "DeviceSessionSignatureInvalid") {
        user.removeSession();
        elementPlus.ElMessageBox.alert("当前设备session过期,点击刷新session", "session过期", {
          confirmButtonText: "刷新",
          callback: (action) => {
            location.href = location.href;
          }
        });
        error.skip = true;
      }
      if (repsonse && repsonse.status == 400 && repsonse.data.message == "not found device info") {
        user.clearSession();
        showError$1("当前设备已失效，请刷新重试");
        elementPlus.ElMessageBox.alert("请确认是否有下线设备操作，当前设备已失效", "设备失效", {
          confirmButtonText: "刷新试一试",
          callback: (action) => {
            location.href = location.href;
          }
        });
      }
      console.error("错误信息：", error);
      return Promise.reject(error);
    });
  };
  const apiConfig = () => {
    axios2.defaults.baseURL = "https://api.aliyundrive.com";
    interceptRequest();
  };
  var exports$2 = {};
  function isSurrogatePair$1(msg, i2) {
    if ((msg.charCodeAt(i2) & 64512) !== 55296) {
      return false;
    }
    if (i2 < 0 || i2 + 1 >= msg.length) {
      return false;
    }
    return (msg.charCodeAt(i2 + 1) & 64512) === 56320;
  }
  function toArray$1(msg, enc) {
    if (Array.isArray(msg))
      return msg.slice();
    if (!msg)
      return [];
    var res = [];
    if (typeof msg === "string") {
      if (!enc) {
        var p = 0;
        for (var i2 = 0; i2 < msg.length; i2++) {
          var c = msg.charCodeAt(i2);
          if (c < 128) {
            res[p++] = c;
          } else if (c < 2048) {
            res[p++] = c >> 6 | 192;
            res[p++] = c & 63 | 128;
          } else if (isSurrogatePair$1(msg, i2)) {
            c = 65536 + ((c & 1023) << 10) + (msg.charCodeAt(++i2) & 1023);
            res[p++] = c >> 18 | 240;
            res[p++] = c >> 12 & 63 | 128;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          } else {
            res[p++] = c >> 12 | 224;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          }
        }
      } else if (enc === "hex") {
        msg = msg.replace(/[^a-z0-9]+/ig, "");
        if (msg.length % 2 !== 0)
          msg = "0" + msg;
        for (i2 = 0; i2 < msg.length; i2 += 2)
          res.push(parseInt(msg[i2] + msg[i2 + 1], 16));
      }
    } else {
      for (i2 = 0; i2 < msg.length; i2++)
        res[i2] = msg[i2] | 0;
    }
    return res;
  }
  exports$2.toArray = toArray$1;
  function toHex$2(msg) {
    var res = "";
    for (var i2 = 0; i2 < msg.length; i2++)
      res += zero2$1(msg[i2].toString(16));
    return res;
  }
  exports$2.toHex = toHex$2;
  function htonl$1(w) {
    var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (w & 255) << 24;
    return res >>> 0;
  }
  exports$2.htonl = htonl$1;
  function toHex32$1(msg, endian) {
    var res = "";
    for (var i2 = 0; i2 < msg.length; i2++) {
      var w = msg[i2];
      if (endian === "little")
        w = htonl$1(w);
      res += zero8$1(w.toString(16));
    }
    return res;
  }
  exports$2.toHex32 = toHex32$1;
  function zero2$1(word) {
    if (word.length === 1)
      return "0" + word;
    else
      return word;
  }
  exports$2.zero2 = zero2$1;
  function zero8$1(word) {
    if (word.length === 7)
      return "0" + word;
    else if (word.length === 6)
      return "00" + word;
    else if (word.length === 5)
      return "000" + word;
    else if (word.length === 4)
      return "0000" + word;
    else if (word.length === 3)
      return "00000" + word;
    else if (word.length === 2)
      return "000000" + word;
    else if (word.length === 1)
      return "0000000" + word;
    else
      return word;
  }
  exports$2.zero8 = zero8$1;
  function join32$1(msg, start2, end, endian) {
    var len2 = end - start2;
    var res = new Array(len2 / 4);
    for (var i2 = 0, k = start2; i2 < res.length; i2++, k += 4) {
      var w;
      if (endian === "big")
        w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];
      else
        w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
      res[i2] = w >>> 0;
    }
    return res;
  }
  exports$2.join32 = join32$1;
  function split32$1(msg, endian) {
    var res = new Array(msg.length * 4);
    for (var i2 = 0, k = 0; i2 < msg.length; i2++, k += 4) {
      var m = msg[i2];
      if (endian === "big") {
        res[k] = m >>> 24;
        res[k + 1] = m >>> 16 & 255;
        res[k + 2] = m >>> 8 & 255;
        res[k + 3] = m & 255;
      } else {
        res[k + 3] = m >>> 24;
        res[k + 2] = m >>> 16 & 255;
        res[k + 1] = m >>> 8 & 255;
        res[k] = m & 255;
      }
    }
    return res;
  }
  exports$2.split32 = split32$1;
  function rotr32$3(w, b) {
    return w >>> b | w << 32 - b;
  }
  exports$2.rotr32 = rotr32$3;
  function rotl32$3(w, b) {
    return w << b | w >>> 32 - b;
  }
  exports$2.rotl32 = rotl32$3;
  function sum32$5(a, b) {
    return a + b >>> 0;
  }
  exports$2.sum32 = sum32$5;
  function sum32_3$2(a, b, c) {
    return a + b + c >>> 0;
  }
  exports$2.sum32_3 = sum32_3$2;
  function sum32_4$4(a, b, c, d) {
    return a + b + c + d >>> 0;
  }
  exports$2.sum32_4 = sum32_4$4;
  function sum32_5$4(a, b, c, d, e) {
    return a + b + c + d + e >>> 0;
  }
  exports$2.sum32_5 = sum32_5$4;
  function sum64$2(buf, pos, ah, al) {
    var bh = buf[pos];
    var bl = buf[pos + 1];
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
  }
  exports$2.sum64 = sum64$2;
  function sum64_hi$2(ah, al, bh, bl) {
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
  }
  exports$2.sum64_hi = sum64_hi$2;
  function sum64_lo$2(ah, al, bh, bl) {
    var lo = al + bl;
    return lo >>> 0;
  }
  exports$2.sum64_lo = sum64_lo$2;
  function sum64_4_hi$2(ah, al, bh, bl, ch, cl, dh, dl) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    var hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
  }
  exports$2.sum64_4_hi = sum64_4_hi$2;
  function sum64_4_lo$2(ah, al, bh, bl, ch, cl, dh, dl) {
    var lo = al + bl + cl + dl;
    return lo >>> 0;
  }
  exports$2.sum64_4_lo = sum64_4_lo$2;
  function sum64_5_hi$2(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = lo + el >>> 0;
    carry += lo < el ? 1 : 0;
    var hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
  }
  exports$2.sum64_5_hi = sum64_5_hi$2;
  function sum64_5_lo$2(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var lo = al + bl + cl + dl + el;
    return lo >>> 0;
  }
  exports$2.sum64_5_lo = sum64_5_lo$2;
  function rotr64_hi$2(ah, al, num) {
    var r2 = al << 32 - num | ah >>> num;
    return r2 >>> 0;
  }
  exports$2.rotr64_hi = rotr64_hi$2;
  function rotr64_lo$2(ah, al, num) {
    var r2 = ah << 32 - num | al >>> num;
    return r2 >>> 0;
  }
  exports$2.rotr64_lo = rotr64_lo$2;
  function shr64_hi$2(ah, al, num) {
    return ah >>> num;
  }
  exports$2.shr64_hi = shr64_hi$2;
  function shr64_lo$2(ah, al, num) {
    var r2 = ah << 32 - num | al >>> num;
    return r2 >>> 0;
  }
  exports$2.shr64_lo = shr64_lo$2;
  exports$2.inherits = function(subClass, superClass) {
    var F = function() {
    };
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
  };
  const utils$n = {
    ...exports$2
  };
  function BlockHash$5() {
    this.pending = null;
    this.pendingTotal = 0;
    this.blockSize = this.constructor.blockSize;
    this.outSize = this.constructor.outSize;
    this.hmacStrength = this.constructor.hmacStrength;
    this.padLength = this.constructor.padLength / 8;
    this.endian = "big";
    this._delta8 = this.blockSize / 8;
    this._delta32 = this.blockSize / 32;
  }
  BlockHash$5.prototype.update = function update(msg, enc) {
    msg = utils$n.toArray(msg, enc);
    if (!this.pending)
      this.pending = msg;
    else
      this.pending = this.pending.concat(msg);
    this.pendingTotal += msg.length;
    if (this.pending.length >= this._delta8) {
      msg = this.pending;
      var r2 = msg.length % this._delta8;
      this.pending = msg.slice(msg.length - r2, msg.length);
      if (this.pending.length === 0)
        this.pending = null;
      msg = utils$n.join32(msg, 0, msg.length - r2, this.endian);
      for (var i2 = 0; i2 < msg.length; i2 += this._delta32)
        this._update(msg, i2, i2 + this._delta32);
    }
    return this;
  };
  BlockHash$5.prototype.digest = function digest(enc) {
    this.update(this._pad());
    return this._digest(enc);
  };
  BlockHash$5.prototype._pad = function pad() {
    var len2 = this.pendingTotal;
    var bytes = this._delta8;
    var k = bytes - (len2 + this.padLength) % bytes;
    var res = new Array(k + this.padLength);
    res[0] = 128;
    for (var i2 = 1; i2 < k; i2++)
      res[i2] = 0;
    len2 <<= 3;
    if (this.endian === "big") {
      for (var t2 = 8; t2 < this.padLength; t2++)
        res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = len2 >>> 24 & 255;
      res[i2++] = len2 >>> 16 & 255;
      res[i2++] = len2 >>> 8 & 255;
      res[i2++] = len2 & 255;
    } else {
      res[i2++] = len2 & 255;
      res[i2++] = len2 >>> 8 & 255;
      res[i2++] = len2 >>> 16 & 255;
      res[i2++] = len2 >>> 24 & 255;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      for (t2 = 8; t2 < this.padLength; t2++)
        res[i2++] = 0;
    }
    return res;
  };
  var rotr32$2 = utils$n.rotr32;
  var exports$1 = {};
  function ft_1$2(s2, x, y, z) {
    if (s2 === 0)
      return ch32$3(x, y, z);
    if (s2 === 1 || s2 === 3)
      return p32$1(x, y, z);
    if (s2 === 2)
      return maj32$3(x, y, z);
  }
  exports$1.ft_1 = ft_1$2;
  function ch32$3(x, y, z) {
    return x & y ^ ~x & z;
  }
  exports$1.ch32 = ch32$3;
  function maj32$3(x, y, z) {
    return x & y ^ x & z ^ y & z;
  }
  exports$1.maj32 = maj32$3;
  function p32$1(x, y, z) {
    return x ^ y ^ z;
  }
  exports$1.p32 = p32$1;
  function s0_256$3(x) {
    return rotr32$2(x, 2) ^ rotr32$2(x, 13) ^ rotr32$2(x, 22);
  }
  exports$1.s0_256 = s0_256$3;
  function s1_256$3(x) {
    return rotr32$2(x, 6) ^ rotr32$2(x, 11) ^ rotr32$2(x, 25);
  }
  exports$1.s1_256 = s1_256$3;
  function g0_256$3(x) {
    return rotr32$2(x, 7) ^ rotr32$2(x, 18) ^ x >>> 3;
  }
  exports$1.g0_256 = g0_256$3;
  function g1_256$3(x) {
    return rotr32$2(x, 17) ^ rotr32$2(x, 19) ^ x >>> 10;
  }
  exports$1.g1_256 = g1_256$3;
  const shaCommon$2 = {
    ...exports$1
  };
  var sum32$4 = utils$n.sum32;
  var sum32_4$3 = utils$n.sum32_4;
  var sum32_5$3 = utils$n.sum32_5;
  var ch32$2 = shaCommon$2.ch32;
  var maj32$2 = shaCommon$2.maj32;
  var s0_256$2 = shaCommon$2.s0_256;
  var s1_256$2 = shaCommon$2.s1_256;
  var g0_256$2 = shaCommon$2.g0_256;
  var g1_256$2 = shaCommon$2.g1_256;
  var sha256_K$1 = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  function SHA256$2() {
    if (!(this instanceof SHA256$2))
      return new SHA256$2();
    BlockHash$5.call(this);
    this.h = [
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ];
    this.k = sha256_K$1;
    this.W = new Array(64);
  }
  utils$n.inherits(SHA256$2, BlockHash$5);
  SHA256$2.blockSize = 512;
  SHA256$2.outSize = 256;
  SHA256$2.hmacStrength = 192;
  SHA256$2.padLength = 64;
  SHA256$2.prototype._update = function _update(msg, start2) {
    var W = this.W;
    for (var i2 = 0; i2 < 16; i2++)
      W[i2] = msg[start2 + i2];
    for (; i2 < W.length; i2++)
      W[i2] = sum32_4$3(g1_256$2(W[i2 - 2]), W[i2 - 7], g0_256$2(W[i2 - 15]), W[i2 - 16]);
    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    var f2 = this.h[5];
    var g = this.h[6];
    var h = this.h[7];
    for (i2 = 0; i2 < W.length; i2++) {
      var T1 = sum32_5$3(h, s1_256$2(e), ch32$2(e, f2, g), this.k[i2], W[i2]);
      var T2 = sum32$4(s0_256$2(a), maj32$2(a, b, c));
      h = g;
      g = f2;
      f2 = e;
      e = sum32$4(d, T1);
      d = c;
      c = b;
      b = a;
      a = sum32$4(T1, T2);
    }
    this.h[0] = sum32$4(this.h[0], a);
    this.h[1] = sum32$4(this.h[1], b);
    this.h[2] = sum32$4(this.h[2], c);
    this.h[3] = sum32$4(this.h[3], d);
    this.h[4] = sum32$4(this.h[4], e);
    this.h[5] = sum32$4(this.h[5], f2);
    this.h[6] = sum32$4(this.h[6], g);
    this.h[7] = sum32$4(this.h[7], h);
  };
  SHA256$2.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$n.toHex32(this.h, "big");
    else
      return utils$n.split32(this.h, "big");
  };
  function safeAdd(x, y) {
    var lsw = (x & 65535) + (y & 65535);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 65535;
  }
  function bitRotateLeft(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
  }
  function md5cmn(q, a, b, x, s2, t2) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t2)), s2), b);
  }
  function md5ff(a, b, c, d, x, s2, t2) {
    return md5cmn(b & c | ~b & d, a, b, x, s2, t2);
  }
  function md5gg(a, b, c, d, x, s2, t2) {
    return md5cmn(b & d | c & ~d, a, b, x, s2, t2);
  }
  function md5hh(a, b, c, d, x, s2, t2) {
    return md5cmn(b ^ c ^ d, a, b, x, s2, t2);
  }
  function md5ii(a, b, c, d, x, s2, t2) {
    return md5cmn(c ^ (b | ~d), a, b, x, s2, t2);
  }
  function binlMD5(x, len2) {
    x[len2 >> 5] |= 128 << len2 % 32;
    x[(len2 + 64 >>> 9 << 4) + 14] = len2;
    var i2;
    var olda;
    var oldb;
    var oldc;
    var oldd;
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    for (i2 = 0; i2 < x.length; i2 += 16) {
      olda = a;
      oldb = b;
      oldc = c;
      oldd = d;
      a = md5ff(a, b, c, d, x[i2], 7, -680876936);
      d = md5ff(d, a, b, c, x[i2 + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i2 + 2], 17, 606105819);
      b = md5ff(b, c, d, a, x[i2 + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i2 + 4], 7, -176418897);
      d = md5ff(d, a, b, c, x[i2 + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i2 + 6], 17, -1473231341);
      b = md5ff(b, c, d, a, x[i2 + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i2 + 8], 7, 1770035416);
      d = md5ff(d, a, b, c, x[i2 + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i2 + 10], 17, -42063);
      b = md5ff(b, c, d, a, x[i2 + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i2 + 12], 7, 1804603682);
      d = md5ff(d, a, b, c, x[i2 + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i2 + 14], 17, -1502002290);
      b = md5ff(b, c, d, a, x[i2 + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i2 + 1], 5, -165796510);
      d = md5gg(d, a, b, c, x[i2 + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i2 + 11], 14, 643717713);
      b = md5gg(b, c, d, a, x[i2], 20, -373897302);
      a = md5gg(a, b, c, d, x[i2 + 5], 5, -701558691);
      d = md5gg(d, a, b, c, x[i2 + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i2 + 15], 14, -660478335);
      b = md5gg(b, c, d, a, x[i2 + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i2 + 9], 5, 568446438);
      d = md5gg(d, a, b, c, x[i2 + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i2 + 3], 14, -187363961);
      b = md5gg(b, c, d, a, x[i2 + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i2 + 13], 5, -1444681467);
      d = md5gg(d, a, b, c, x[i2 + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i2 + 7], 14, 1735328473);
      b = md5gg(b, c, d, a, x[i2 + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i2 + 5], 4, -378558);
      d = md5hh(d, a, b, c, x[i2 + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i2 + 11], 16, 1839030562);
      b = md5hh(b, c, d, a, x[i2 + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i2 + 1], 4, -1530992060);
      d = md5hh(d, a, b, c, x[i2 + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i2 + 7], 16, -155497632);
      b = md5hh(b, c, d, a, x[i2 + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i2 + 13], 4, 681279174);
      d = md5hh(d, a, b, c, x[i2], 11, -358537222);
      c = md5hh(c, d, a, b, x[i2 + 3], 16, -722521979);
      b = md5hh(b, c, d, a, x[i2 + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i2 + 9], 4, -640364487);
      d = md5hh(d, a, b, c, x[i2 + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i2 + 15], 16, 530742520);
      b = md5hh(b, c, d, a, x[i2 + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i2], 6, -198630844);
      d = md5ii(d, a, b, c, x[i2 + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i2 + 14], 15, -1416354905);
      b = md5ii(b, c, d, a, x[i2 + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i2 + 12], 6, 1700485571);
      d = md5ii(d, a, b, c, x[i2 + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i2 + 10], 15, -1051523);
      b = md5ii(b, c, d, a, x[i2 + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i2 + 8], 6, 1873313359);
      d = md5ii(d, a, b, c, x[i2 + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i2 + 6], 15, -1560198380);
      b = md5ii(b, c, d, a, x[i2 + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i2 + 4], 6, -145523070);
      d = md5ii(d, a, b, c, x[i2 + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i2 + 2], 15, 718787259);
      b = md5ii(b, c, d, a, x[i2 + 9], 21, -343485551);
      a = safeAdd(a, olda);
      b = safeAdd(b, oldb);
      c = safeAdd(c, oldc);
      d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function binl2rstr(input) {
    var i2;
    var output = "";
    var length32 = input.length * 32;
    for (i2 = 0; i2 < length32; i2 += 8) {
      output += String.fromCharCode(input[i2 >> 5] >>> i2 % 32 & 255);
    }
    return output;
  }
  function rstr2binl(input) {
    var i2;
    var output = [];
    output[(input.length >> 2) - 1] = void 0;
    for (i2 = 0; i2 < output.length; i2 += 1) {
      output[i2] = 0;
    }
    var length8 = input.length * 8;
    for (i2 = 0; i2 < length8; i2 += 8) {
      output[i2 >> 5] |= (input.charCodeAt(i2 / 8) & 255) << i2 % 32;
    }
    return output;
  }
  function rstrMD5(s2) {
    return binl2rstr(binlMD5(rstr2binl(s2), s2.length * 8));
  }
  function rstrHMACMD5(key2, data) {
    var i2;
    var bkey = rstr2binl(key2);
    var ipad = [];
    var opad = [];
    var hash2;
    ipad[15] = opad[15] = void 0;
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key2.length * 8);
    }
    for (i2 = 0; i2 < 16; i2 += 1) {
      ipad[i2] = bkey[i2] ^ 909522486;
      opad[i2] = bkey[i2] ^ 1549556828;
    }
    hash2 = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
    return binl2rstr(binlMD5(opad.concat(hash2), 512 + 128));
  }
  function rstr2hex(input) {
    var hexTab = "0123456789abcdef";
    var output = "";
    var x;
    var i2;
    for (i2 = 0; i2 < input.length; i2 += 1) {
      x = input.charCodeAt(i2);
      output += hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15);
    }
    return output;
  }
  function str2rstrUTF8(input) {
    return unescape(encodeURIComponent(input));
  }
  function rawMD5(s2) {
    return rstrMD5(str2rstrUTF8(s2));
  }
  function hexMD5(s2) {
    return rstr2hex(rawMD5(s2));
  }
  function rawHMACMD5(k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
  }
  function hexHMACMD5(k, d) {
    return rstr2hex(rawHMACMD5(k, d));
  }
  function md5(string, key2, raw) {
    if (!key2) {
      if (!raw) {
        return hexMD5(string);
      }
      return rawMD5(string);
    }
    if (!raw) {
      return hexHMACMD5(key2, string);
    }
    return rawHMACMD5(key2, string);
  }
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var f2 = n.default;
    if (typeof f2 == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          var args = [null];
          args.push.apply(args, arguments);
          var Ctor = Function.bind.apply(f2, args);
          return new Ctor();
        }
        return f2.apply(this, arguments);
      };
      a.prototype = f2.prototype;
    } else
      a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  const errors = {
    IMPOSSIBLE_CASE: "Impossible case. Please create issue.",
    TWEAK_ADD: "The tweak was out of range or the resulted private key is invalid",
    TWEAK_MUL: "The tweak was out of range or equal to zero",
    CONTEXT_RANDOMIZE_UNKNOW: "Unknow error on context randomization",
    SECKEY_INVALID: "Private Key is invalid",
    PUBKEY_PARSE: "Public Key could not be parsed",
    PUBKEY_SERIALIZE: "Public Key serialization error",
    PUBKEY_COMBINE: "The sum of the public keys is not valid",
    SIG_PARSE: "Signature could not be parsed",
    SIGN: "The nonce generation function failed, or the private key was invalid",
    RECOVER: "Public key could not be recover",
    ECDH: "Scalar was invalid (zero or overflow)"
  };
  function assert$g(cond, msg) {
    if (!cond)
      throw new Error(msg);
  }
  function isUint8Array(name2, value, length) {
    assert$g(value instanceof Uint8Array, `Expected ${name2} to be an Uint8Array`);
    if (length !== void 0) {
      if (Array.isArray(length)) {
        const numbers = length.join(", ");
        const msg = `Expected ${name2} to be an Uint8Array with length [${numbers}]`;
        assert$g(length.includes(value.length), msg);
      } else {
        const msg = `Expected ${name2} to be an Uint8Array with length ${length}`;
        assert$g(value.length === length, msg);
      }
    }
  }
  function isCompressed(value) {
    assert$g(toTypeString(value) === "Boolean", "Expected compressed to be a Boolean");
  }
  function getAssertedOutput(output = (len2) => new Uint8Array(len2), length) {
    if (typeof output === "function")
      output = output(length);
    isUint8Array("output", output, length);
    return output;
  }
  function toTypeString(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  }
  var lib = (secp256k12) => {
    return {
      contextRandomize(seed) {
        assert$g(
          seed === null || seed instanceof Uint8Array,
          "Expected seed to be an Uint8Array or null"
        );
        if (seed !== null)
          isUint8Array("seed", seed, 32);
        switch (secp256k12.contextRandomize(seed)) {
          case 1:
            throw new Error(errors.CONTEXT_RANDOMIZE_UNKNOW);
        }
      },
      privateKeyVerify(seckey) {
        isUint8Array("private key", seckey, 32);
        return secp256k12.privateKeyVerify(seckey) === 0;
      },
      privateKeyNegate(seckey) {
        isUint8Array("private key", seckey, 32);
        switch (secp256k12.privateKeyNegate(seckey)) {
          case 0:
            return seckey;
          case 1:
            throw new Error(errors.IMPOSSIBLE_CASE);
        }
      },
      privateKeyTweakAdd(seckey, tweak) {
        isUint8Array("private key", seckey, 32);
        isUint8Array("tweak", tweak, 32);
        switch (secp256k12.privateKeyTweakAdd(seckey, tweak)) {
          case 0:
            return seckey;
          case 1:
            throw new Error(errors.TWEAK_ADD);
        }
      },
      privateKeyTweakMul(seckey, tweak) {
        isUint8Array("private key", seckey, 32);
        isUint8Array("tweak", tweak, 32);
        switch (secp256k12.privateKeyTweakMul(seckey, tweak)) {
          case 0:
            return seckey;
          case 1:
            throw new Error(errors.TWEAK_MUL);
        }
      },
      publicKeyVerify(pubkey) {
        isUint8Array("public key", pubkey, [33, 65]);
        return secp256k12.publicKeyVerify(pubkey) === 0;
      },
      publicKeyCreate(seckey, compressed = true, output) {
        isUint8Array("private key", seckey, 32);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyCreate(output, seckey)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.SECKEY_INVALID);
          case 2:
            throw new Error(errors.PUBKEY_SERIALIZE);
        }
      },
      publicKeyConvert(pubkey, compressed = true, output) {
        isUint8Array("public key", pubkey, [33, 65]);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyConvert(output, pubkey)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.PUBKEY_SERIALIZE);
        }
      },
      publicKeyNegate(pubkey, compressed = true, output) {
        isUint8Array("public key", pubkey, [33, 65]);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyNegate(output, pubkey)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.IMPOSSIBLE_CASE);
          case 3:
            throw new Error(errors.PUBKEY_SERIALIZE);
        }
      },
      publicKeyCombine(pubkeys, compressed = true, output) {
        assert$g(Array.isArray(pubkeys), "Expected public keys to be an Array");
        assert$g(pubkeys.length > 0, "Expected public keys array will have more than zero items");
        for (const pubkey of pubkeys) {
          isUint8Array("public key", pubkey, [33, 65]);
        }
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyCombine(output, pubkeys)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.PUBKEY_COMBINE);
          case 3:
            throw new Error(errors.PUBKEY_SERIALIZE);
        }
      },
      publicKeyTweakAdd(pubkey, tweak, compressed = true, output) {
        isUint8Array("public key", pubkey, [33, 65]);
        isUint8Array("tweak", tweak, 32);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyTweakAdd(output, pubkey, tweak)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.TWEAK_ADD);
        }
      },
      publicKeyTweakMul(pubkey, tweak, compressed = true, output) {
        isUint8Array("public key", pubkey, [33, 65]);
        isUint8Array("tweak", tweak, 32);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.publicKeyTweakMul(output, pubkey, tweak)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.TWEAK_MUL);
        }
      },
      signatureNormalize(sig) {
        isUint8Array("signature", sig, 64);
        switch (secp256k12.signatureNormalize(sig)) {
          case 0:
            return sig;
          case 1:
            throw new Error(errors.SIG_PARSE);
        }
      },
      signatureExport(sig, output) {
        isUint8Array("signature", sig, 64);
        output = getAssertedOutput(output, 72);
        const obj = { output, outputlen: 72 };
        switch (secp256k12.signatureExport(obj, sig)) {
          case 0:
            return output.slice(0, obj.outputlen);
          case 1:
            throw new Error(errors.SIG_PARSE);
          case 2:
            throw new Error(errors.IMPOSSIBLE_CASE);
        }
      },
      signatureImport(sig, output) {
        isUint8Array("signature", sig);
        output = getAssertedOutput(output, 64);
        switch (secp256k12.signatureImport(output, sig)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.SIG_PARSE);
          case 2:
            throw new Error(errors.IMPOSSIBLE_CASE);
        }
      },
      ecdsaSign(msg32, seckey, options = {}, output) {
        isUint8Array("message", msg32, 32);
        isUint8Array("private key", seckey, 32);
        assert$g(toTypeString(options) === "Object", "Expected options to be an Object");
        if (options.data !== void 0)
          isUint8Array("options.data", options.data);
        if (options.noncefn !== void 0)
          assert$g(toTypeString(options.noncefn) === "Function", "Expected options.noncefn to be a Function");
        output = getAssertedOutput(output, 64);
        const obj = { signature: output, recid: null };
        switch (secp256k12.ecdsaSign(obj, msg32, seckey, options.data, options.noncefn)) {
          case 0:
            return obj;
          case 1:
            throw new Error(errors.SIGN);
          case 2:
            throw new Error(errors.IMPOSSIBLE_CASE);
        }
      },
      ecdsaVerify(sig, msg32, pubkey) {
        isUint8Array("signature", sig, 64);
        isUint8Array("message", msg32, 32);
        isUint8Array("public key", pubkey, [33, 65]);
        switch (secp256k12.ecdsaVerify(sig, msg32, pubkey)) {
          case 0:
            return true;
          case 3:
            return false;
          case 1:
            throw new Error(errors.SIG_PARSE);
          case 2:
            throw new Error(errors.PUBKEY_PARSE);
        }
      },
      ecdsaRecover(sig, recid, msg32, compressed = true, output) {
        isUint8Array("signature", sig, 64);
        assert$g(
          toTypeString(recid) === "Number" && recid >= 0 && recid <= 3,
          "Expected recovery id to be a Number within interval [0, 3]"
        );
        isUint8Array("message", msg32, 32);
        isCompressed(compressed);
        output = getAssertedOutput(output, compressed ? 33 : 65);
        switch (secp256k12.ecdsaRecover(output, sig, recid, msg32)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.SIG_PARSE);
          case 2:
            throw new Error(errors.RECOVER);
          case 3:
            throw new Error(errors.IMPOSSIBLE_CASE);
        }
      },
      ecdh(pubkey, seckey, options = {}, output) {
        isUint8Array("public key", pubkey, [33, 65]);
        isUint8Array("private key", seckey, 32);
        assert$g(toTypeString(options) === "Object", "Expected options to be an Object");
        if (options.data !== void 0)
          isUint8Array("options.data", options.data);
        if (options.hashfn !== void 0) {
          assert$g(toTypeString(options.hashfn) === "Function", "Expected options.hashfn to be a Function");
          if (options.xbuf !== void 0)
            isUint8Array("options.xbuf", options.xbuf, 32);
          if (options.ybuf !== void 0)
            isUint8Array("options.ybuf", options.ybuf, 32);
          isUint8Array("output", output);
        } else {
          output = getAssertedOutput(output, 32);
        }
        switch (secp256k12.ecdh(output, pubkey, seckey, options.data, options.hashfn, options.xbuf, options.ybuf)) {
          case 0:
            return output;
          case 1:
            throw new Error(errors.PUBKEY_PARSE);
          case 2:
            throw new Error(errors.ECDH);
        }
      }
    };
  };
  var elliptic$2 = {};
  const name = "elliptic";
  const version = "6.5.4";
  const description = "EC cryptography";
  const main = "lib/elliptic.js";
  const files = [
    "lib"
  ];
  const scripts = {
    lint: "eslint lib test",
    "lint:fix": "npm run lint -- --fix",
    unit: "istanbul test _mocha --reporter=spec test/index.js",
    test: "npm run lint && npm run unit",
    version: "grunt dist && git add dist/"
  };
  const repository = {
    type: "git",
    url: "git@github.com:indutny/elliptic"
  };
  const keywords = [
    "EC",
    "Elliptic",
    "curve",
    "Cryptography"
  ];
  const author = "Fedor Indutny <fedor@indutny.com>";
  const license = "MIT";
  const bugs = {
    url: "https://github.com/indutny/elliptic/issues"
  };
  const homepage = "https://github.com/indutny/elliptic";
  const devDependencies = {
    brfs: "^2.0.2",
    coveralls: "^3.1.0",
    eslint: "^7.6.0",
    grunt: "^1.2.1",
    "grunt-browserify": "^5.3.0",
    "grunt-cli": "^1.3.2",
    "grunt-contrib-connect": "^3.0.0",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-uglify": "^5.0.0",
    "grunt-mocha-istanbul": "^5.0.2",
    "grunt-saucelabs": "^9.0.1",
    istanbul: "^0.4.5",
    mocha: "^8.0.1"
  };
  const dependencies = {
    "bn.js": "^4.11.9",
    brorand: "^1.1.0",
    "hash.js": "^1.0.0",
    "hmac-drbg": "^1.0.1",
    inherits: "^2.0.4",
    "minimalistic-assert": "^1.0.1",
    "minimalistic-crypto-utils": "^1.0.1"
  };
  const require$$0$1 = {
    name,
    version,
    description,
    main,
    files,
    scripts,
    repository,
    keywords,
    author,
    license,
    bugs,
    homepage,
    devDependencies,
    dependencies
  };
  var utils$m = {};
  var bnExports = {};
  var bn = {
    get exports() {
      return bnExports;
    },
    set exports(v) {
      bnExports = v;
    }
  };
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  (function(module) {
    (function(module2, exports) {
      function assert2(val, msg) {
        if (!val)
          throw new Error(msg || "Assertion failed");
      }
      function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
      function BN2(number, base2, endian) {
        if (BN2.isBN(number)) {
          return number;
        }
        this.negative = 0;
        this.words = null;
        this.length = 0;
        this.red = null;
        if (number !== null) {
          if (base2 === "le" || base2 === "be") {
            endian = base2;
            base2 = 10;
          }
          this._init(number || 0, base2 || 10, endian || "be");
        }
      }
      if (typeof module2 === "object") {
        module2.exports = BN2;
      } else {
        exports.BN = BN2;
      }
      BN2.BN = BN2;
      BN2.wordSize = 26;
      var Buffer3;
      try {
        if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
          Buffer3 = window.Buffer;
        } else {
          Buffer3 = require$$0.Buffer;
        }
      } catch (e) {
      }
      BN2.isBN = function isBN(num) {
        if (num instanceof BN2) {
          return true;
        }
        return num !== null && typeof num === "object" && num.constructor.wordSize === BN2.wordSize && Array.isArray(num.words);
      };
      BN2.max = function max(left, right) {
        if (left.cmp(right) > 0)
          return left;
        return right;
      };
      BN2.min = function min(left, right) {
        if (left.cmp(right) < 0)
          return left;
        return right;
      };
      BN2.prototype._init = function init(number, base2, endian) {
        if (typeof number === "number") {
          return this._initNumber(number, base2, endian);
        }
        if (typeof number === "object") {
          return this._initArray(number, base2, endian);
        }
        if (base2 === "hex") {
          base2 = 16;
        }
        assert2(base2 === (base2 | 0) && base2 >= 2 && base2 <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start2 = 0;
        if (number[0] === "-") {
          start2++;
          this.negative = 1;
        }
        if (start2 < number.length) {
          if (base2 === 16) {
            this._parseHex(number, start2, endian);
          } else {
            this._parseBase(number, base2, start2);
            if (endian === "le") {
              this._initArray(this.toArray(), base2, endian);
            }
          }
        }
      };
      BN2.prototype._initNumber = function _initNumber(number, base2, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 67108864) {
          this.words = [number & 67108863];
          this.length = 1;
        } else if (number < 4503599627370496) {
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863
          ];
          this.length = 2;
        } else {
          assert2(number < 9007199254740992);
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863,
            1
          ];
          this.length = 3;
        }
        if (endian !== "le")
          return;
        this._initArray(this.toArray(), base2, endian);
      };
      BN2.prototype._initArray = function _initArray(number, base2, endian) {
        assert2(typeof number.length === "number");
        if (number.length <= 0) {
          this.words = [0];
          this.length = 1;
          return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i2 = 0; i2 < this.length; i2++) {
          this.words[i2] = 0;
        }
        var j, w;
        var off = 0;
        if (endian === "be") {
          for (i2 = number.length - 1, j = 0; i2 >= 0; i2 -= 3) {
            w = number[i2] | number[i2 - 1] << 8 | number[i2 - 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        } else if (endian === "le") {
          for (i2 = 0, j = 0; i2 < number.length; i2 += 3) {
            w = number[i2] | number[i2 + 1] << 8 | number[i2 + 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        }
        return this.strip();
      };
      function parseHex4Bits(string, index) {
        var c = string.charCodeAt(index);
        if (c >= 65 && c <= 70) {
          return c - 55;
        } else if (c >= 97 && c <= 102) {
          return c - 87;
        } else {
          return c - 48 & 15;
        }
      }
      function parseHexByte(string, lowerBound, index) {
        var r2 = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
          r2 |= parseHex4Bits(string, index - 1) << 4;
        }
        return r2;
      }
      BN2.prototype._parseHex = function _parseHex(number, start2, endian) {
        this.length = Math.ceil((number.length - start2) / 6);
        this.words = new Array(this.length);
        for (var i2 = 0; i2 < this.length; i2++) {
          this.words[i2] = 0;
        }
        var off = 0;
        var j = 0;
        var w;
        if (endian === "be") {
          for (i2 = number.length - 1; i2 >= start2; i2 -= 2) {
            w = parseHexByte(number, start2, i2) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start2;
          for (i2 = parseLength % 2 === 0 ? start2 + 1 : start2; i2 < number.length; i2 += 2) {
            w = parseHexByte(number, start2, i2) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        }
        this.strip();
      };
      function parseBase(str, start2, end, mul) {
        var r2 = 0;
        var len2 = Math.min(str.length, end);
        for (var i2 = start2; i2 < len2; i2++) {
          var c = str.charCodeAt(i2) - 48;
          r2 *= mul;
          if (c >= 49) {
            r2 += c - 49 + 10;
          } else if (c >= 17) {
            r2 += c - 17 + 10;
          } else {
            r2 += c;
          }
        }
        return r2;
      }
      BN2.prototype._parseBase = function _parseBase(number, base2, start2) {
        this.words = [0];
        this.length = 1;
        for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base2) {
          limbLen++;
        }
        limbLen--;
        limbPow = limbPow / base2 | 0;
        var total = number.length - start2;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start2;
        var word = 0;
        for (var i2 = start2; i2 < end; i2 += limbLen) {
          word = parseBase(number, i2, i2 + limbLen, base2);
          this.imuln(limbPow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i2, number.length, base2);
          for (i2 = 0; i2 < mod; i2++) {
            pow *= base2;
          }
          this.imuln(pow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        this.strip();
      };
      BN2.prototype.copy = function copy2(dest) {
        dest.words = new Array(this.length);
        for (var i2 = 0; i2 < this.length; i2++) {
          dest.words[i2] = this.words[i2];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };
      BN2.prototype.clone = function clone() {
        var r2 = new BN2(null);
        this.copy(r2);
        return r2;
      };
      BN2.prototype._expand = function _expand(size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }
        return this;
      };
      BN2.prototype.strip = function strip() {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }
        return this._normSign();
      };
      BN2.prototype._normSign = function _normSign() {
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }
        return this;
      };
      BN2.prototype.inspect = function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var zeros = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ];
      var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ];
      var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      BN2.prototype.toString = function toString2(base2, padding) {
        base2 = base2 || 10;
        padding = padding | 0 || 1;
        var out;
        if (base2 === 16 || base2 === "hex") {
          out = "";
          var off = 0;
          var carry = 0;
          for (var i2 = 0; i2 < this.length; i2++) {
            var w = this.words[i2];
            var word = ((w << off | carry) & 16777215).toString(16);
            carry = w >>> 24 - off & 16777215;
            if (carry !== 0 || i2 !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }
            off += 2;
            if (off >= 26) {
              off -= 26;
              i2--;
            }
          }
          if (carry !== 0) {
            out = carry.toString(16) + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        if (base2 === (base2 | 0) && base2 >= 2 && base2 <= 36) {
          var groupSize = groupSizes[base2];
          var groupBase = groupBases[base2];
          out = "";
          var c = this.clone();
          c.negative = 0;
          while (!c.isZero()) {
            var r2 = c.modn(groupBase).toString(base2);
            c = c.idivn(groupBase);
            if (!c.isZero()) {
              out = zeros[groupSize - r2.length] + r2 + out;
            } else {
              out = r2 + out;
            }
          }
          if (this.isZero()) {
            out = "0" + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        assert2(false, "Base should be between 2 and 36");
      };
      BN2.prototype.toNumber = function toNumber() {
        var ret = this.words[0];
        if (this.length === 2) {
          ret += this.words[1] * 67108864;
        } else if (this.length === 3 && this.words[2] === 1) {
          ret += 4503599627370496 + this.words[1] * 67108864;
        } else if (this.length > 2) {
          assert2(false, "Number can only safely store up to 53 bits");
        }
        return this.negative !== 0 ? -ret : ret;
      };
      BN2.prototype.toJSON = function toJSON() {
        return this.toString(16);
      };
      BN2.prototype.toBuffer = function toBuffer(endian, length) {
        assert2(typeof Buffer3 !== "undefined");
        return this.toArrayLike(Buffer3, endian, length);
      };
      BN2.prototype.toArray = function toArray2(endian, length) {
        return this.toArrayLike(Array, endian, length);
      };
      BN2.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength2 = this.byteLength();
        var reqLength = length || Math.max(1, byteLength2);
        assert2(byteLength2 <= reqLength, "byte array longer than desired length");
        assert2(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = endian === "le";
        var res = new ArrayType(reqLength);
        var b, i2;
        var q = this.clone();
        if (!littleEndian) {
          for (i2 = 0; i2 < reqLength - byteLength2; i2++) {
            res[i2] = 0;
          }
          for (i2 = 0; !q.isZero(); i2++) {
            b = q.andln(255);
            q.iushrn(8);
            res[reqLength - i2 - 1] = b;
          }
        } else {
          for (i2 = 0; !q.isZero(); i2++) {
            b = q.andln(255);
            q.iushrn(8);
            res[i2] = b;
          }
          for (; i2 < reqLength; i2++) {
            res[i2] = 0;
          }
        }
        return res;
      };
      if (Math.clz32) {
        BN2.prototype._countBits = function _countBits(w) {
          return 32 - Math.clz32(w);
        };
      } else {
        BN2.prototype._countBits = function _countBits(w) {
          var t2 = w;
          var r2 = 0;
          if (t2 >= 4096) {
            r2 += 13;
            t2 >>>= 13;
          }
          if (t2 >= 64) {
            r2 += 7;
            t2 >>>= 7;
          }
          if (t2 >= 8) {
            r2 += 4;
            t2 >>>= 4;
          }
          if (t2 >= 2) {
            r2 += 2;
            t2 >>>= 2;
          }
          return r2 + t2;
        };
      }
      BN2.prototype._zeroBits = function _zeroBits(w) {
        if (w === 0)
          return 26;
        var t2 = w;
        var r2 = 0;
        if ((t2 & 8191) === 0) {
          r2 += 13;
          t2 >>>= 13;
        }
        if ((t2 & 127) === 0) {
          r2 += 7;
          t2 >>>= 7;
        }
        if ((t2 & 15) === 0) {
          r2 += 4;
          t2 >>>= 4;
        }
        if ((t2 & 3) === 0) {
          r2 += 2;
          t2 >>>= 2;
        }
        if ((t2 & 1) === 0) {
          r2++;
        }
        return r2;
      };
      BN2.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
      };
      function toBitArray(num) {
        var w = new Array(num.bitLength());
        for (var bit = 0; bit < w.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w;
      }
      BN2.prototype.zeroBits = function zeroBits() {
        if (this.isZero())
          return 0;
        var r2 = 0;
        for (var i2 = 0; i2 < this.length; i2++) {
          var b = this._zeroBits(this.words[i2]);
          r2 += b;
          if (b !== 26)
            break;
        }
        return r2;
      };
      BN2.prototype.byteLength = function byteLength2() {
        return Math.ceil(this.bitLength() / 8);
      };
      BN2.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
      };
      BN2.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
      };
      BN2.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
      };
      BN2.prototype.neg = function neg() {
        return this.clone().ineg();
      };
      BN2.prototype.ineg = function ineg() {
        if (!this.isZero()) {
          this.negative ^= 1;
        }
        return this;
      };
      BN2.prototype.iuor = function iuor(num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }
        for (var i2 = 0; i2 < num.length; i2++) {
          this.words[i2] = this.words[i2] | num.words[i2];
        }
        return this.strip();
      };
      BN2.prototype.ior = function ior(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuor(num);
      };
      BN2.prototype.or = function or(num) {
        if (this.length > num.length)
          return this.clone().ior(num);
        return num.clone().ior(this);
      };
      BN2.prototype.uor = function uor(num) {
        if (this.length > num.length)
          return this.clone().iuor(num);
        return num.clone().iuor(this);
      };
      BN2.prototype.iuand = function iuand(num) {
        var b;
        if (this.length > num.length) {
          b = num;
        } else {
          b = this;
        }
        for (var i2 = 0; i2 < b.length; i2++) {
          this.words[i2] = this.words[i2] & num.words[i2];
        }
        this.length = b.length;
        return this.strip();
      };
      BN2.prototype.iand = function iand(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuand(num);
      };
      BN2.prototype.and = function and(num) {
        if (this.length > num.length)
          return this.clone().iand(num);
        return num.clone().iand(this);
      };
      BN2.prototype.uand = function uand(num) {
        if (this.length > num.length)
          return this.clone().iuand(num);
        return num.clone().iuand(this);
      };
      BN2.prototype.iuxor = function iuxor(num) {
        var a;
        var b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        for (var i2 = 0; i2 < b.length; i2++) {
          this.words[i2] = a.words[i2] ^ b.words[i2];
        }
        if (this !== a) {
          for (; i2 < a.length; i2++) {
            this.words[i2] = a.words[i2];
          }
        }
        this.length = a.length;
        return this.strip();
      };
      BN2.prototype.ixor = function ixor(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuxor(num);
      };
      BN2.prototype.xor = function xor(num) {
        if (this.length > num.length)
          return this.clone().ixor(num);
        return num.clone().ixor(this);
      };
      BN2.prototype.uxor = function uxor(num) {
        if (this.length > num.length)
          return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      };
      BN2.prototype.inotn = function inotn(width) {
        assert2(typeof width === "number" && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        this._expand(bytesNeeded);
        if (bitsLeft > 0) {
          bytesNeeded--;
        }
        for (var i2 = 0; i2 < bytesNeeded; i2++) {
          this.words[i2] = ~this.words[i2] & 67108863;
        }
        if (bitsLeft > 0) {
          this.words[i2] = ~this.words[i2] & 67108863 >> 26 - bitsLeft;
        }
        return this.strip();
      };
      BN2.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
      };
      BN2.prototype.setn = function setn(bit, val) {
        assert2(typeof bit === "number" && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) {
          this.words[off] = this.words[off] | 1 << wbit;
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }
        return this.strip();
      };
      BN2.prototype.iadd = function iadd(num) {
        var r2;
        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r2 = this.isub(num);
          this.negative ^= 1;
          return this._normSign();
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r2 = this.isub(num);
          num.negative = 1;
          return r2._normSign();
        }
        var a, b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i2 = 0; i2 < b.length; i2++) {
          r2 = (a.words[i2] | 0) + (b.words[i2] | 0) + carry;
          this.words[i2] = r2 & 67108863;
          carry = r2 >>> 26;
        }
        for (; carry !== 0 && i2 < a.length; i2++) {
          r2 = (a.words[i2] | 0) + carry;
          this.words[i2] = r2 & 67108863;
          carry = r2 >>> 26;
        }
        this.length = a.length;
        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++;
        } else if (a !== this) {
          for (; i2 < a.length; i2++) {
            this.words[i2] = a.words[i2];
          }
        }
        return this;
      };
      BN2.prototype.add = function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }
        if (this.length > num.length)
          return this.clone().iadd(num);
        return num.clone().iadd(this);
      };
      BN2.prototype.isub = function isub(num) {
        if (num.negative !== 0) {
          num.negative = 0;
          var r2 = this.iadd(num);
          num.negative = 1;
          return r2._normSign();
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }
        var cmp = this.cmp(num);
        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }
        var a, b;
        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i2 = 0; i2 < b.length; i2++) {
          r2 = (a.words[i2] | 0) - (b.words[i2] | 0) + carry;
          carry = r2 >> 26;
          this.words[i2] = r2 & 67108863;
        }
        for (; carry !== 0 && i2 < a.length; i2++) {
          r2 = (a.words[i2] | 0) + carry;
          carry = r2 >> 26;
          this.words[i2] = r2 & 67108863;
        }
        if (carry === 0 && i2 < a.length && a !== this) {
          for (; i2 < a.length; i2++) {
            this.words[i2] = a.words[i2];
          }
        }
        this.length = Math.max(this.length, i2);
        if (a !== this) {
          this.negative = 1;
        }
        return this.strip();
      };
      BN2.prototype.sub = function sub(num) {
        return this.clone().isub(num);
      };
      function smallMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        var len2 = self2.length + num.length | 0;
        out.length = len2;
        len2 = len2 - 1 | 0;
        var a = self2.words[0] | 0;
        var b = num.words[0] | 0;
        var r2 = a * b;
        var lo = r2 & 67108863;
        var carry = r2 / 67108864 | 0;
        out.words[0] = lo;
        for (var k = 1; k < len2; k++) {
          var ncarry = carry >>> 26;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i2 = k - j | 0;
            a = self2.words[i2] | 0;
            b = num.words[j] | 0;
            r2 = a * b + rword;
            ncarry += r2 / 67108864 | 0;
            rword = r2 & 67108863;
          }
          out.words[k] = rword | 0;
          carry = ncarry | 0;
        }
        if (carry !== 0) {
          out.words[k] = carry | 0;
        } else {
          out.length--;
        }
        return out.strip();
      }
      var comb10MulTo = function comb10MulTo2(self2, num, out) {
        var a = self2.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 8191;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 8191;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 8191;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 8191;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 8191;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 8191;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 8191;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 8191;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 8191;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 8191;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 8191;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 8191;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 8191;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 8191;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 8191;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 8191;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 8191;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 8191;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 8191;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 8191;
        var bh9 = b9 >>> 13;
        out.negative = self2.negative ^ num.negative;
        out.length = 19;
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 67108863;
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 67108863;
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 67108863;
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 67108863;
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 67108863;
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 67108863;
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 67108863;
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 67108863;
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 67108863;
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 67108863;
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 67108863;
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 67108863;
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 67108863;
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 67108863;
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 67108863;
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 67108863;
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 67108863;
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 67108863;
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 67108863;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
          o[19] = c;
          out.length++;
        }
        return out;
      };
      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }
      function bigMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        out.length = self2.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for (var k = 0; k < out.length - 1; k++) {
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i2 = k - j;
            var a = self2.words[i2] | 0;
            var b = num.words[j] | 0;
            var r2 = a * b;
            var lo = r2 & 67108863;
            ncarry = ncarry + (r2 / 67108864 | 0) | 0;
            lo = lo + rword | 0;
            rword = lo & 67108863;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 67108863;
          }
          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        if (carry !== 0) {
          out.words[k] = carry;
        } else {
          out.length--;
        }
        return out.strip();
      }
      function jumboMulTo(self2, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self2, num, out);
      }
      BN2.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len2 = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len2 < 63) {
          res = smallMulTo(this, num, out);
        } else if (len2 < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }
        return res;
      };
      function FFTM(x, y) {
        this.x = x;
        this.y = y;
      }
      FFTM.prototype.makeRBT = function makeRBT(N) {
        var t2 = new Array(N);
        var l = BN2.prototype._countBits(N) - 1;
        for (var i2 = 0; i2 < N; i2++) {
          t2[i2] = this.revBin(i2, l, N);
        }
        return t2;
      };
      FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1)
          return x;
        var rb = 0;
        for (var i2 = 0; i2 < l; i2++) {
          rb |= (x & 1) << l - i2 - 1;
          x >>= 1;
        }
        return rb;
      };
      FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i2 = 0; i2 < N; i2++) {
          rtws[i2] = rws[rbt[i2]];
          itws[i2] = iws[rbt[i2]];
        }
      };
      FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for (var s2 = 1; s2 < N; s2 <<= 1) {
          var l = s2 << 1;
          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);
          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;
            for (var j = 0; j < s2; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];
              var ro = rtws[p + j + s2];
              var io = itws[p + j + s2];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;
              rtws[p + j + s2] = re - ro;
              itws[p + j + s2] = ie - io;
              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };
      FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i2 = 0;
        for (N = N / 2 | 0; N; N = N >>> 1) {
          i2++;
        }
        return 1 << i2 + 1 + odd;
      };
      FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1)
          return;
        for (var i2 = 0; i2 < N / 2; i2++) {
          var t2 = rws[i2];
          rws[i2] = rws[N - i2 - 1];
          rws[N - i2 - 1] = t2;
          t2 = iws[i2];
          iws[i2] = -iws[N - i2 - 1];
          iws[N - i2 - 1] = -t2;
        }
      };
      FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for (var i2 = 0; i2 < N / 2; i2++) {
          var w = Math.round(ws[2 * i2 + 1] / N) * 8192 + Math.round(ws[2 * i2] / N) + carry;
          ws[i2] = w & 67108863;
          if (w < 67108864) {
            carry = 0;
          } else {
            carry = w / 67108864 | 0;
          }
        }
        return ws;
      };
      FFTM.prototype.convert13b = function convert13b(ws, len2, rws, N) {
        var carry = 0;
        for (var i2 = 0; i2 < len2; i2++) {
          carry = carry + (ws[i2] | 0);
          rws[2 * i2] = carry & 8191;
          carry = carry >>> 13;
          rws[2 * i2 + 1] = carry & 8191;
          carry = carry >>> 13;
        }
        for (i2 = 2 * len2; i2 < N; ++i2) {
          rws[i2] = 0;
        }
        assert2(carry === 0);
        assert2((carry & ~8191) === 0);
      };
      FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for (var i2 = 0; i2 < N; i2++) {
          ph[i2] = 0;
        }
        return ph;
      };
      FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for (var i2 = 0; i2 < N; i2++) {
          var rx = rwst[i2] * nrwst[i2] - iwst[i2] * niwst[i2];
          iwst[i2] = rwst[i2] * niwst[i2] + iwst[i2] * nrwst[i2];
          rwst[i2] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      };
      BN2.prototype.mul = function mul(num) {
        var out = new BN2(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      };
      BN2.prototype.mulf = function mulf(num) {
        var out = new BN2(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      };
      BN2.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
      };
      BN2.prototype.imuln = function imuln(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        var carry = 0;
        for (var i2 = 0; i2 < this.length; i2++) {
          var w = (this.words[i2] | 0) * num;
          var lo = (w & 67108863) + (carry & 67108863);
          carry >>= 26;
          carry += w / 67108864 | 0;
          carry += lo >>> 26;
          this.words[i2] = lo & 67108863;
        }
        if (carry !== 0) {
          this.words[i2] = carry;
          this.length++;
        }
        return this;
      };
      BN2.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
      };
      BN2.prototype.sqr = function sqr() {
        return this.mul(this);
      };
      BN2.prototype.isqr = function isqr() {
        return this.imul(this.clone());
      };
      BN2.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0)
          return new BN2(1);
        var res = this;
        for (var i2 = 0; i2 < w.length; i2++, res = res.sqr()) {
          if (w[i2] !== 0)
            break;
        }
        if (++i2 < w.length) {
          for (var q = res.sqr(); i2 < w.length; i2++, q = q.sqr()) {
            if (w[i2] === 0)
              continue;
            res = res.mul(q);
          }
        }
        return res;
      };
      BN2.prototype.iushln = function iushln(bits) {
        assert2(typeof bits === "number" && bits >= 0);
        var r2 = bits % 26;
        var s2 = (bits - r2) / 26;
        var carryMask = 67108863 >>> 26 - r2 << 26 - r2;
        var i2;
        if (r2 !== 0) {
          var carry = 0;
          for (i2 = 0; i2 < this.length; i2++) {
            var newCarry = this.words[i2] & carryMask;
            var c = (this.words[i2] | 0) - newCarry << r2;
            this.words[i2] = c | carry;
            carry = newCarry >>> 26 - r2;
          }
          if (carry) {
            this.words[i2] = carry;
            this.length++;
          }
        }
        if (s2 !== 0) {
          for (i2 = this.length - 1; i2 >= 0; i2--) {
            this.words[i2 + s2] = this.words[i2];
          }
          for (i2 = 0; i2 < s2; i2++) {
            this.words[i2] = 0;
          }
          this.length += s2;
        }
        return this.strip();
      };
      BN2.prototype.ishln = function ishln(bits) {
        assert2(this.negative === 0);
        return this.iushln(bits);
      };
      BN2.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert2(typeof bits === "number" && bits >= 0);
        var h;
        if (hint) {
          h = (hint - hint % 26) / 26;
        } else {
          h = 0;
        }
        var r2 = bits % 26;
        var s2 = Math.min((bits - r2) / 26, this.length);
        var mask = 67108863 ^ 67108863 >>> r2 << r2;
        var maskedWords = extended;
        h -= s2;
        h = Math.max(0, h);
        if (maskedWords) {
          for (var i2 = 0; i2 < s2; i2++) {
            maskedWords.words[i2] = this.words[i2];
          }
          maskedWords.length = s2;
        }
        if (s2 === 0)
          ;
        else if (this.length > s2) {
          this.length -= s2;
          for (i2 = 0; i2 < this.length; i2++) {
            this.words[i2] = this.words[i2 + s2];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }
        var carry = 0;
        for (i2 = this.length - 1; i2 >= 0 && (carry !== 0 || i2 >= h); i2--) {
          var word = this.words[i2] | 0;
          this.words[i2] = carry << 26 - r2 | word >>> r2;
          carry = word & mask;
        }
        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }
        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      };
      BN2.prototype.ishrn = function ishrn(bits, hint, extended) {
        assert2(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      };
      BN2.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
      };
      BN2.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
      };
      BN2.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
      };
      BN2.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
      };
      BN2.prototype.testn = function testn(bit) {
        assert2(typeof bit === "number" && bit >= 0);
        var r2 = bit % 26;
        var s2 = (bit - r2) / 26;
        var q = 1 << r2;
        if (this.length <= s2)
          return false;
        var w = this.words[s2];
        return !!(w & q);
      };
      BN2.prototype.imaskn = function imaskn(bits) {
        assert2(typeof bits === "number" && bits >= 0);
        var r2 = bits % 26;
        var s2 = (bits - r2) / 26;
        assert2(this.negative === 0, "imaskn works only with positive numbers");
        if (this.length <= s2) {
          return this;
        }
        if (r2 !== 0) {
          s2++;
        }
        this.length = Math.min(s2, this.length);
        if (r2 !== 0) {
          var mask = 67108863 ^ 67108863 >>> r2 << r2;
          this.words[this.length - 1] &= mask;
        }
        return this.strip();
      };
      BN2.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
      };
      BN2.prototype.iaddn = function iaddn(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        if (num < 0)
          return this.isubn(-num);
        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }
          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }
        return this._iaddn(num);
      };
      BN2.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        for (var i2 = 0; i2 < this.length && this.words[i2] >= 67108864; i2++) {
          this.words[i2] -= 67108864;
          if (i2 === this.length - 1) {
            this.words[i2 + 1] = 1;
          } else {
            this.words[i2 + 1]++;
          }
        }
        this.length = Math.max(this.length, i2 + 1);
        return this;
      };
      BN2.prototype.isubn = function isubn(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        if (num < 0)
          return this.iaddn(-num);
        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          for (var i2 = 0; i2 < this.length && this.words[i2] < 0; i2++) {
            this.words[i2] += 67108864;
            this.words[i2 + 1] -= 1;
          }
        }
        return this.strip();
      };
      BN2.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
      };
      BN2.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
      };
      BN2.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
      };
      BN2.prototype.abs = function abs() {
        return this.clone().iabs();
      };
      BN2.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len2 = num.length + shift;
        var i2;
        this._expand(len2);
        var w;
        var carry = 0;
        for (i2 = 0; i2 < num.length; i2++) {
          w = (this.words[i2 + shift] | 0) + carry;
          var right = (num.words[i2] | 0) * mul;
          w -= right & 67108863;
          carry = (w >> 26) - (right / 67108864 | 0);
          this.words[i2 + shift] = w & 67108863;
        }
        for (; i2 < this.length - shift; i2++) {
          w = (this.words[i2 + shift] | 0) + carry;
          carry = w >> 26;
          this.words[i2 + shift] = w & 67108863;
        }
        if (carry === 0)
          return this.strip();
        assert2(carry === -1);
        carry = 0;
        for (i2 = 0; i2 < this.length; i2++) {
          w = -(this.words[i2] | 0) + carry;
          carry = w >> 26;
          this.words[i2] = w & 67108863;
        }
        this.negative = 1;
        return this.strip();
      };
      BN2.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = b.words[b.length - 1] | 0;
        }
        var m = a.length - b.length;
        var q;
        if (mode !== "mod") {
          q = new BN2(null);
          q.length = m + 1;
          q.words = new Array(q.length);
          for (var i2 = 0; i2 < q.length; i2++) {
            q.words[i2] = 0;
          }
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
          a = diff;
          if (q) {
            q.words[m] = 1;
          }
        }
        for (var j = m - 1; j >= 0; j--) {
          var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
          qj = Math.min(qj / bhi | 0, 67108863);
          a._ishlnsubmul(b, qj, j);
          while (a.negative !== 0) {
            qj--;
            a.negative = 0;
            a._ishlnsubmul(b, 1, j);
            if (!a.isZero()) {
              a.negative ^= 1;
            }
          }
          if (q) {
            q.words[j] = qj;
          }
        }
        if (q) {
          q.strip();
        }
        a.strip();
        if (mode !== "div" && shift !== 0) {
          a.iushrn(shift);
        }
        return {
          div: q || null,
          mod: a
        };
      };
      BN2.prototype.divmod = function divmod(num, mode, positive) {
        assert2(!num.isZero());
        if (this.isZero()) {
          return {
            div: new BN2(0),
            mod: new BN2(0)
          };
        }
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }
          return {
            div,
            mod
          };
        }
        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          return {
            div,
            mod: res.mod
          };
        }
        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }
          return {
            div: res.div,
            mod
          };
        }
        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN2(0),
            mod: this
          };
        }
        if (num.length === 1) {
          if (mode === "div") {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }
          if (mode === "mod") {
            return {
              div: null,
              mod: new BN2(this.modn(num.words[0]))
            };
          }
          return {
            div: this.divn(num.words[0]),
            mod: new BN2(this.modn(num.words[0]))
          };
        }
        return this._wordDiv(num, mode);
      };
      BN2.prototype.div = function div(num) {
        return this.divmod(num, "div", false).div;
      };
      BN2.prototype.mod = function mod(num) {
        return this.divmod(num, "mod", false).mod;
      };
      BN2.prototype.umod = function umod(num) {
        return this.divmod(num, "mod", true).mod;
      };
      BN2.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        if (dm.mod.isZero())
          return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        if (cmp < 0 || r2 === 1 && cmp === 0)
          return dm.div;
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      };
      BN2.prototype.modn = function modn(num) {
        assert2(num <= 67108863);
        var p = (1 << 26) % num;
        var acc = 0;
        for (var i2 = this.length - 1; i2 >= 0; i2--) {
          acc = (p * acc + (this.words[i2] | 0)) % num;
        }
        return acc;
      };
      BN2.prototype.idivn = function idivn(num) {
        assert2(num <= 67108863);
        var carry = 0;
        for (var i2 = this.length - 1; i2 >= 0; i2--) {
          var w = (this.words[i2] | 0) + carry * 67108864;
          this.words[i2] = w / num | 0;
          carry = w % num;
        }
        return this.strip();
      };
      BN2.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
      };
      BN2.prototype.egcd = function egcd(p) {
        assert2(p.negative === 0);
        assert2(!p.isZero());
        var x = this;
        var y = p.clone();
        if (x.negative !== 0) {
          x = x.umod(p);
        } else {
          x = x.clone();
        }
        var A = new BN2(1);
        var B = new BN2(0);
        var C = new BN2(0);
        var D = new BN2(1);
        var g = 0;
        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while (!x.isZero()) {
          for (var i2 = 0, im = 1; (x.words[0] & im) === 0 && i2 < 26; ++i2, im <<= 1)
            ;
          if (i2 > 0) {
            x.iushrn(i2);
            while (i2-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }
              A.iushrn(1);
              B.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
            ;
          if (j > 0) {
            y.iushrn(j);
            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }
              C.iushrn(1);
              D.iushrn(1);
            }
          }
          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }
        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      };
      BN2.prototype._invmp = function _invmp(p) {
        assert2(p.negative === 0);
        assert2(!p.isZero());
        var a = this;
        var b = p.clone();
        if (a.negative !== 0) {
          a = a.umod(p);
        } else {
          a = a.clone();
        }
        var x1 = new BN2(1);
        var x2 = new BN2(0);
        var delta = b.clone();
        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i2 = 0, im = 1; (a.words[0] & im) === 0 && i2 < 26; ++i2, im <<= 1)
            ;
          if (i2 > 0) {
            a.iushrn(i2);
            while (i2-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }
              x1.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
            ;
          if (j > 0) {
            b.iushrn(j);
            while (j-- > 0) {
              if (x2.isOdd()) {
                x2.iadd(delta);
              }
              x2.iushrn(1);
            }
          }
          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }
        var res;
        if (a.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x2;
        }
        if (res.cmpn(0) < 0) {
          res.iadd(p);
        }
        return res;
      };
      BN2.prototype.gcd = function gcd(num) {
        if (this.isZero())
          return num.abs();
        if (num.isZero())
          return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }
        do {
          while (a.isEven()) {
            a.iushrn(1);
          }
          while (b.isEven()) {
            b.iushrn(1);
          }
          var r2 = a.cmp(b);
          if (r2 < 0) {
            var t2 = a;
            a = b;
            b = t2;
          } else if (r2 === 0 || b.cmpn(1) === 0) {
            break;
          }
          a.isub(b);
        } while (true);
        return b.iushln(shift);
      };
      BN2.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
      };
      BN2.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
      };
      BN2.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
      };
      BN2.prototype.andln = function andln(num) {
        return this.words[0] & num;
      };
      BN2.prototype.bincn = function bincn(bit) {
        assert2(typeof bit === "number");
        var r2 = bit % 26;
        var s2 = (bit - r2) / 26;
        var q = 1 << r2;
        if (this.length <= s2) {
          this._expand(s2 + 1);
          this.words[s2] |= q;
          return this;
        }
        var carry = q;
        for (var i2 = s2; carry !== 0 && i2 < this.length; i2++) {
          var w = this.words[i2] | 0;
          w += carry;
          carry = w >>> 26;
          w &= 67108863;
          this.words[i2] = w;
        }
        if (carry !== 0) {
          this.words[i2] = carry;
          this.length++;
        }
        return this;
      };
      BN2.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
      };
      BN2.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative)
          return -1;
        if (this.negative === 0 && negative)
          return 1;
        this.strip();
        var res;
        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }
          assert2(num <= 67108863, "Number is too big");
          var w = this.words[0] | 0;
          res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0)
          return -res | 0;
        return res;
      };
      BN2.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0)
          return -1;
        if (this.negative === 0 && num.negative !== 0)
          return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0)
          return -res | 0;
        return res;
      };
      BN2.prototype.ucmp = function ucmp(num) {
        if (this.length > num.length)
          return 1;
        if (this.length < num.length)
          return -1;
        var res = 0;
        for (var i2 = this.length - 1; i2 >= 0; i2--) {
          var a = this.words[i2] | 0;
          var b = num.words[i2] | 0;
          if (a === b)
            continue;
          if (a < b) {
            res = -1;
          } else if (a > b) {
            res = 1;
          }
          break;
        }
        return res;
      };
      BN2.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
      };
      BN2.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
      };
      BN2.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
      };
      BN2.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
      };
      BN2.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
      };
      BN2.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
      };
      BN2.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
      };
      BN2.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
      };
      BN2.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
      };
      BN2.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
      };
      BN2.red = function red(num) {
        return new Red(num);
      };
      BN2.prototype.toRed = function toRed(ctx) {
        assert2(!this.red, "Already a number in reduction context");
        assert2(this.negative === 0, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
      };
      BN2.prototype.fromRed = function fromRed() {
        assert2(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
      };
      BN2.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
      };
      BN2.prototype.forceRed = function forceRed(ctx) {
        assert2(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
      };
      BN2.prototype.redAdd = function redAdd(num) {
        assert2(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
      };
      BN2.prototype.redIAdd = function redIAdd(num) {
        assert2(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
      };
      BN2.prototype.redSub = function redSub(num) {
        assert2(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
      };
      BN2.prototype.redISub = function redISub(num) {
        assert2(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
      };
      BN2.prototype.redShl = function redShl(num) {
        assert2(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
      };
      BN2.prototype.redMul = function redMul(num) {
        assert2(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      };
      BN2.prototype.redIMul = function redIMul(num) {
        assert2(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      };
      BN2.prototype.redSqr = function redSqr() {
        assert2(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
      };
      BN2.prototype.redISqr = function redISqr() {
        assert2(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
      };
      BN2.prototype.redSqrt = function redSqrt() {
        assert2(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
      };
      BN2.prototype.redInvm = function redInvm() {
        assert2(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
      };
      BN2.prototype.redNeg = function redNeg() {
        assert2(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
      };
      BN2.prototype.redPow = function redPow(num) {
        assert2(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
      };
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function MPrime(name2, p) {
        this.name = name2;
        this.p = new BN2(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN2(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }
      MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN2(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };
      MPrime.prototype.ireduce = function ireduce(num) {
        var r2 = num;
        var rlen;
        do {
          this.split(r2, this.tmp);
          r2 = this.imulK(r2);
          r2 = r2.iadd(this.tmp);
          rlen = r2.bitLength();
        } while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r2.ucmp(this.p);
        if (cmp === 0) {
          r2.words[0] = 0;
          r2.length = 1;
        } else if (cmp > 0) {
          r2.isub(this.p);
        } else {
          if (r2.strip !== void 0) {
            r2.strip();
          } else {
            r2._strip();
          }
        }
        return r2;
      };
      MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
      };
      MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
      };
      function K256() {
        MPrime.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      inherits2(K256, MPrime);
      K256.prototype.split = function split(input, output) {
        var mask = 4194303;
        var outLen = Math.min(input.length, 9);
        for (var i2 = 0; i2 < outLen; i2++) {
          output.words[i2] = input.words[i2];
        }
        output.length = outLen;
        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for (i2 = 10; i2 < input.length; i2++) {
          var next = input.words[i2] | 0;
          input.words[i2 - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }
        prev >>>= 22;
        input.words[i2 - 10] = prev;
        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      };
      K256.prototype.imulK = function imulK(num) {
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        var lo = 0;
        for (var i2 = 0; i2 < num.length; i2++) {
          var w = num.words[i2] | 0;
          lo += w * 977;
          num.words[i2] = lo & 67108863;
          lo = w * 64 + (lo / 67108864 | 0);
        }
        if (num.words[num.length - 1] === 0) {
          num.length--;
          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }
        return num;
      };
      function P224() {
        MPrime.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      inherits2(P224, MPrime);
      function P192() {
        MPrime.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      inherits2(P192, MPrime);
      function P25519() {
        MPrime.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      inherits2(P25519, MPrime);
      P25519.prototype.imulK = function imulK(num) {
        var carry = 0;
        for (var i2 = 0; i2 < num.length; i2++) {
          var hi = (num.words[i2] | 0) * 19 + carry;
          var lo = hi & 67108863;
          hi >>>= 26;
          num.words[i2] = lo;
          carry = hi;
        }
        if (carry !== 0) {
          num.words[num.length++] = carry;
        }
        return num;
      };
      BN2._prime = function prime(name2) {
        if (primes[name2])
          return primes[name2];
        var prime2;
        if (name2 === "k256") {
          prime2 = new K256();
        } else if (name2 === "p224") {
          prime2 = new P224();
        } else if (name2 === "p192") {
          prime2 = new P192();
        } else if (name2 === "p25519") {
          prime2 = new P25519();
        } else {
          throw new Error("Unknown prime " + name2);
        }
        primes[name2] = prime2;
        return prime2;
      };
      function Red(m) {
        if (typeof m === "string") {
          var prime = BN2._prime(m);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert2(m.gtn(1), "modulus must be greater than 1");
          this.m = m;
          this.prime = null;
        }
      }
      Red.prototype._verify1 = function _verify1(a) {
        assert2(a.negative === 0, "red works only with positives");
        assert2(a.red, "red works only with red numbers");
      };
      Red.prototype._verify2 = function _verify2(a, b) {
        assert2((a.negative | b.negative) === 0, "red works only with positives");
        assert2(
          a.red && a.red === b.red,
          "red works only with red numbers"
        );
      };
      Red.prototype.imod = function imod(a) {
        if (this.prime)
          return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };
      Red.prototype.neg = function neg(a) {
        if (a.isZero()) {
          return a.clone();
        }
        return this.m.sub(a)._forceRed(this);
      };
      Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res;
      };
      Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res;
      };
      Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
      };
      Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
      };
      Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
      };
      Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
      };
      Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
      };
      Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero())
          return a.clone();
        var mod3 = this.m.andln(3);
        assert2(mod3 % 2 === 1);
        if (mod3 === 3) {
          var pow = this.m.add(new BN2(1)).iushrn(2);
          return this.pow(a, pow);
        }
        var q = this.m.subn(1);
        var s2 = 0;
        while (!q.isZero() && q.andln(1) === 0) {
          s2++;
          q.iushrn(1);
        }
        assert2(!q.isZero());
        var one = new BN2(1).toRed(this);
        var nOne = one.redNeg();
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN2(2 * z * z).toRed(this);
        while (this.pow(z, lpow).cmp(nOne) !== 0) {
          z.redIAdd(nOne);
        }
        var c = this.pow(z, q);
        var r2 = this.pow(a, q.addn(1).iushrn(1));
        var t2 = this.pow(a, q);
        var m = s2;
        while (t2.cmp(one) !== 0) {
          var tmp = t2;
          for (var i2 = 0; tmp.cmp(one) !== 0; i2++) {
            tmp = tmp.redSqr();
          }
          assert2(i2 < m);
          var b = this.pow(c, new BN2(1).iushln(m - i2 - 1));
          r2 = r2.redMul(b);
          c = b.redSqr();
          t2 = t2.redMul(c);
          m = i2;
        }
        return r2;
      };
      Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      };
      Red.prototype.pow = function pow(a, num) {
        if (num.isZero())
          return new BN2(1).toRed(this);
        if (num.cmpn(1) === 0)
          return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN2(1).toRed(this);
        wnd[1] = a;
        for (var i2 = 2; i2 < wnd.length; i2++) {
          wnd[i2] = this.mul(wnd[i2 - 1], a);
        }
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start2 = num.bitLength() % 26;
        if (start2 === 0) {
          start2 = 26;
        }
        for (i2 = num.length - 1; i2 >= 0; i2--) {
          var word = num.words[i2];
          for (var j = start2 - 1; j >= 0; j--) {
            var bit = word >> j & 1;
            if (res !== wnd[0]) {
              res = this.sqr(res);
            }
            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }
            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i2 !== 0 || j !== 0))
              continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start2 = 26;
        }
        return res;
      };
      Red.prototype.convertTo = function convertTo(num) {
        var r2 = num.umod(this.m);
        return r2 === num ? r2.clone() : r2;
      };
      Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      };
      BN2.mont = function mont2(num) {
        return new Mont(num);
      };
      function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
          this.shift += 26 - this.shift % 26;
        }
        this.r = new BN2(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      inherits2(Mont, Red);
      Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      };
      Mont.prototype.convertFrom = function convertFrom(num) {
        var r2 = this.imod(num.mul(this.rinv));
        r2.red = null;
        return r2;
      };
      Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }
        var t2 = a.imul(b);
        var c = t2.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t2.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero())
          return new BN2(0)._forceRed(this);
        var t2 = a.mul(b);
        var c = t2.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t2.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.invm = function invm(a) {
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })(module, commonjsGlobal);
  })(bn);
  var minimalisticAssert = assert$f;
  function assert$f(val, msg) {
    if (!val)
      throw new Error(msg || "Assertion failed");
  }
  assert$f.equal = function assertEqual(l, r2, msg) {
    if (l != r2)
      throw new Error(msg || "Assertion failed: " + l + " != " + r2);
  };
  var utils$l = {};
  (function(exports) {
    var utils2 = exports;
    function toArray2(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg !== "string") {
        for (var i2 = 0; i2 < msg.length; i2++)
          res[i2] = msg[i2] | 0;
        return res;
      }
      if (enc === "hex") {
        msg = msg.replace(/[^a-z0-9]+/ig, "");
        if (msg.length % 2 !== 0)
          msg = "0" + msg;
        for (var i2 = 0; i2 < msg.length; i2 += 2)
          res.push(parseInt(msg[i2] + msg[i2 + 1], 16));
      } else {
        for (var i2 = 0; i2 < msg.length; i2++) {
          var c = msg.charCodeAt(i2);
          var hi = c >> 8;
          var lo = c & 255;
          if (hi)
            res.push(hi, lo);
          else
            res.push(lo);
        }
      }
      return res;
    }
    utils2.toArray = toArray2;
    function zero22(word) {
      if (word.length === 1)
        return "0" + word;
      else
        return word;
    }
    utils2.zero2 = zero22;
    function toHex2(msg) {
      var res = "";
      for (var i2 = 0; i2 < msg.length; i2++)
        res += zero22(msg[i2].toString(16));
      return res;
    }
    utils2.toHex = toHex2;
    utils2.encode = function encode(arr, enc) {
      if (enc === "hex")
        return toHex2(arr);
      else
        return arr;
    };
  })(utils$l);
  (function(exports) {
    var utils2 = exports;
    var BN2 = bnExports;
    var minAssert = minimalisticAssert;
    var minUtils = utils$l;
    utils2.assert = minAssert;
    utils2.toArray = minUtils.toArray;
    utils2.zero2 = minUtils.zero2;
    utils2.toHex = minUtils.toHex;
    utils2.encode = minUtils.encode;
    function getNAF2(num, w, bits) {
      var naf = new Array(Math.max(num.bitLength(), bits) + 1);
      naf.fill(0);
      var ws = 1 << w + 1;
      var k = num.clone();
      for (var i2 = 0; i2 < naf.length; i2++) {
        var z;
        var mod = k.andln(ws - 1);
        if (k.isOdd()) {
          if (mod > (ws >> 1) - 1)
            z = (ws >> 1) - mod;
          else
            z = mod;
          k.isubn(z);
        } else {
          z = 0;
        }
        naf[i2] = z;
        k.iushrn(1);
      }
      return naf;
    }
    utils2.getNAF = getNAF2;
    function getJSF2(k1, k2) {
      var jsf = [
        [],
        []
      ];
      k1 = k1.clone();
      k2 = k2.clone();
      var d1 = 0;
      var d2 = 0;
      var m8;
      while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        var m14 = k1.andln(3) + d1 & 3;
        var m24 = k2.andln(3) + d2 & 3;
        if (m14 === 3)
          m14 = -1;
        if (m24 === 3)
          m24 = -1;
        var u1;
        if ((m14 & 1) === 0) {
          u1 = 0;
        } else {
          m8 = k1.andln(7) + d1 & 7;
          if ((m8 === 3 || m8 === 5) && m24 === 2)
            u1 = -m14;
          else
            u1 = m14;
        }
        jsf[0].push(u1);
        var u2;
        if ((m24 & 1) === 0) {
          u2 = 0;
        } else {
          m8 = k2.andln(7) + d2 & 7;
          if ((m8 === 3 || m8 === 5) && m14 === 2)
            u2 = -m24;
          else
            u2 = m24;
        }
        jsf[1].push(u2);
        if (2 * d1 === u1 + 1)
          d1 = 1 - d1;
        if (2 * d2 === u2 + 1)
          d2 = 1 - d2;
        k1.iushrn(1);
        k2.iushrn(1);
      }
      return jsf;
    }
    utils2.getJSF = getJSF2;
    function cachedProperty2(obj, name2, computer) {
      var key2 = "_" + name2;
      obj.prototype[name2] = function cachedProperty3() {
        return this[key2] !== void 0 ? this[key2] : this[key2] = computer.call(this);
      };
    }
    utils2.cachedProperty = cachedProperty2;
    function parseBytes2(bytes) {
      return typeof bytes === "string" ? utils2.toArray(bytes, "hex") : bytes;
    }
    utils2.parseBytes = parseBytes2;
    function intFromLE(bytes) {
      return new BN2(bytes, "hex", "le");
    }
    utils2.intFromLE = intFromLE;
  })(utils$m);
  var brorandExports = {};
  var brorand = {
    get exports() {
      return brorandExports;
    },
    set exports(v) {
      brorandExports = v;
    }
  };
  var r$1;
  brorand.exports = function rand2(len2) {
    if (!r$1)
      r$1 = new Rand(null);
    return r$1.generate(len2);
  };
  function Rand(rand2) {
    this.rand = rand2;
  }
  brorandExports.Rand = Rand;
  Rand.prototype.generate = function generate(len2) {
    return this._rand(len2);
  };
  Rand.prototype._rand = function _rand(n) {
    if (this.rand.getBytes)
      return this.rand.getBytes(n);
    var res = new Uint8Array(n);
    for (var i2 = 0; i2 < res.length; i2++)
      res[i2] = this.rand.getByte();
    return res;
  };
  if (typeof self === "object") {
    if (self.crypto && self.crypto.getRandomValues) {
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.crypto.getRandomValues(arr);
        return arr;
      };
    } else if (self.msCrypto && self.msCrypto.getRandomValues) {
      Rand.prototype._rand = function _rand(n) {
        var arr = new Uint8Array(n);
        self.msCrypto.getRandomValues(arr);
        return arr;
      };
    } else if (typeof window === "object") {
      Rand.prototype._rand = function() {
        throw new Error("Not implemented yet");
      };
    }
  } else {
    try {
      var crypto = require$$0;
      if (typeof crypto.randomBytes !== "function")
        throw new Error("Not supported");
      Rand.prototype._rand = function _rand(n) {
        return crypto.randomBytes(n);
      };
    } catch (e) {
    }
  }
  var curve = {};
  var BN$8 = bnExports;
  var utils$k = utils$m;
  var getNAF = utils$k.getNAF;
  var getJSF = utils$k.getJSF;
  var assert$e = utils$k.assert;
  function BaseCurve(type, conf) {
    this.type = type;
    this.p = new BN$8(conf.p, 16);
    this.red = conf.prime ? BN$8.red(conf.prime) : BN$8.mont(this.p);
    this.zero = new BN$8(0).toRed(this.red);
    this.one = new BN$8(1).toRed(this.red);
    this.two = new BN$8(2).toRed(this.red);
    this.n = conf.n && new BN$8(conf.n, 16);
    this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
    this._wnafT1 = new Array(4);
    this._wnafT2 = new Array(4);
    this._wnafT3 = new Array(4);
    this._wnafT4 = new Array(4);
    this._bitLength = this.n ? this.n.bitLength() : 0;
    var adjustCount = this.n && this.p.div(this.n);
    if (!adjustCount || adjustCount.cmpn(100) > 0) {
      this.redN = null;
    } else {
      this._maxwellTrick = true;
      this.redN = this.n.toRed(this.red);
    }
  }
  var base = BaseCurve;
  BaseCurve.prototype.point = function point() {
    throw new Error("Not implemented");
  };
  BaseCurve.prototype.validate = function validate() {
    throw new Error("Not implemented");
  };
  BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
    assert$e(p.precomputed);
    var doubles = p._getDoubles();
    var naf = getNAF(k, 1, this._bitLength);
    var I = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
    I /= 3;
    var repr = [];
    var j;
    var nafW;
    for (j = 0; j < naf.length; j += doubles.step) {
      nafW = 0;
      for (var l = j + doubles.step - 1; l >= j; l--)
        nafW = (nafW << 1) + naf[l];
      repr.push(nafW);
    }
    var a = this.jpoint(null, null, null);
    var b = this.jpoint(null, null, null);
    for (var i2 = I; i2 > 0; i2--) {
      for (j = 0; j < repr.length; j++) {
        nafW = repr[j];
        if (nafW === i2)
          b = b.mixedAdd(doubles.points[j]);
        else if (nafW === -i2)
          b = b.mixedAdd(doubles.points[j].neg());
      }
      a = a.add(b);
    }
    return a.toP();
  };
  BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
    var w = 4;
    var nafPoints = p._getNAFPoints(w);
    w = nafPoints.wnd;
    var wnd = nafPoints.points;
    var naf = getNAF(k, w, this._bitLength);
    var acc = this.jpoint(null, null, null);
    for (var i2 = naf.length - 1; i2 >= 0; i2--) {
      for (var l = 0; i2 >= 0 && naf[i2] === 0; i2--)
        l++;
      if (i2 >= 0)
        l++;
      acc = acc.dblp(l);
      if (i2 < 0)
        break;
      var z = naf[i2];
      assert$e(z !== 0);
      if (p.type === "affine") {
        if (z > 0)
          acc = acc.mixedAdd(wnd[z - 1 >> 1]);
        else
          acc = acc.mixedAdd(wnd[-z - 1 >> 1].neg());
      } else {
        if (z > 0)
          acc = acc.add(wnd[z - 1 >> 1]);
        else
          acc = acc.add(wnd[-z - 1 >> 1].neg());
      }
    }
    return p.type === "affine" ? acc.toP() : acc;
  };
  BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len2, jacobianResult) {
    var wndWidth = this._wnafT1;
    var wnd = this._wnafT2;
    var naf = this._wnafT3;
    var max = 0;
    var i2;
    var j;
    var p;
    for (i2 = 0; i2 < len2; i2++) {
      p = points[i2];
      var nafPoints = p._getNAFPoints(defW);
      wndWidth[i2] = nafPoints.wnd;
      wnd[i2] = nafPoints.points;
    }
    for (i2 = len2 - 1; i2 >= 1; i2 -= 2) {
      var a = i2 - 1;
      var b = i2;
      if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
        naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
        naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
        max = Math.max(naf[a].length, max);
        max = Math.max(naf[b].length, max);
        continue;
      }
      var comb = [
        points[a],
        /* 1 */
        null,
        /* 3 */
        null,
        /* 5 */
        points[b]
        /* 7 */
      ];
      if (points[a].y.cmp(points[b].y) === 0) {
        comb[1] = points[a].add(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].add(points[b].neg());
      } else {
        comb[1] = points[a].toJ().mixedAdd(points[b]);
        comb[2] = points[a].toJ().mixedAdd(points[b].neg());
      }
      var index = [
        -3,
        /* -1 -1 */
        -1,
        /* -1 0 */
        -5,
        /* -1 1 */
        -7,
        /* 0 -1 */
        0,
        /* 0 0 */
        7,
        /* 0 1 */
        5,
        /* 1 -1 */
        1,
        /* 1 0 */
        3
        /* 1 1 */
      ];
      var jsf = getJSF(coeffs[a], coeffs[b]);
      max = Math.max(jsf[0].length, max);
      naf[a] = new Array(max);
      naf[b] = new Array(max);
      for (j = 0; j < max; j++) {
        var ja = jsf[0][j] | 0;
        var jb = jsf[1][j] | 0;
        naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
        naf[b][j] = 0;
        wnd[a] = comb;
      }
    }
    var acc = this.jpoint(null, null, null);
    var tmp = this._wnafT4;
    for (i2 = max; i2 >= 0; i2--) {
      var k = 0;
      while (i2 >= 0) {
        var zero = true;
        for (j = 0; j < len2; j++) {
          tmp[j] = naf[j][i2] | 0;
          if (tmp[j] !== 0)
            zero = false;
        }
        if (!zero)
          break;
        k++;
        i2--;
      }
      if (i2 >= 0)
        k++;
      acc = acc.dblp(k);
      if (i2 < 0)
        break;
      for (j = 0; j < len2; j++) {
        var z = tmp[j];
        if (z === 0)
          continue;
        else if (z > 0)
          p = wnd[j][z - 1 >> 1];
        else if (z < 0)
          p = wnd[j][-z - 1 >> 1].neg();
        if (p.type === "affine")
          acc = acc.mixedAdd(p);
        else
          acc = acc.add(p);
      }
    }
    for (i2 = 0; i2 < len2; i2++)
      wnd[i2] = null;
    if (jacobianResult)
      return acc;
    else
      return acc.toP();
  };
  function BasePoint(curve2, type) {
    this.curve = curve2;
    this.type = type;
    this.precomputed = null;
  }
  BaseCurve.BasePoint = BasePoint;
  BasePoint.prototype.eq = function eq() {
    throw new Error("Not implemented");
  };
  BasePoint.prototype.validate = function validate() {
    return this.curve.validate(this);
  };
  BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    bytes = utils$k.toArray(bytes, enc);
    var len2 = this.p.byteLength();
    if ((bytes[0] === 4 || bytes[0] === 6 || bytes[0] === 7) && bytes.length - 1 === 2 * len2) {
      if (bytes[0] === 6)
        assert$e(bytes[bytes.length - 1] % 2 === 0);
      else if (bytes[0] === 7)
        assert$e(bytes[bytes.length - 1] % 2 === 1);
      var res = this.point(
        bytes.slice(1, 1 + len2),
        bytes.slice(1 + len2, 1 + 2 * len2)
      );
      return res;
    } else if ((bytes[0] === 2 || bytes[0] === 3) && bytes.length - 1 === len2) {
      return this.pointFromX(bytes.slice(1, 1 + len2), bytes[0] === 3);
    }
    throw new Error("Unknown point format");
  };
  BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
    return this.encode(enc, true);
  };
  BasePoint.prototype._encode = function _encode(compact) {
    var len2 = this.curve.p.byteLength();
    var x = this.getX().toArray("be", len2);
    if (compact)
      return [this.getY().isEven() ? 2 : 3].concat(x);
    return [4].concat(x, this.getY().toArray("be", len2));
  };
  BasePoint.prototype.encode = function encode(enc, compact) {
    return utils$k.encode(this._encode(compact), enc);
  };
  BasePoint.prototype.precompute = function precompute(power) {
    if (this.precomputed)
      return this;
    var precomputed = {
      doubles: null,
      naf: null,
      beta: null
    };
    precomputed.naf = this._getNAFPoints(8);
    precomputed.doubles = this._getDoubles(4, power);
    precomputed.beta = this._getBeta();
    this.precomputed = precomputed;
    return this;
  };
  BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
    if (!this.precomputed)
      return false;
    var doubles = this.precomputed.doubles;
    if (!doubles)
      return false;
    return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
  };
  BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
    if (this.precomputed && this.precomputed.doubles)
      return this.precomputed.doubles;
    var doubles = [this];
    var acc = this;
    for (var i2 = 0; i2 < power; i2 += step) {
      for (var j = 0; j < step; j++)
        acc = acc.dbl();
      doubles.push(acc);
    }
    return {
      step,
      points: doubles
    };
  };
  BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
    if (this.precomputed && this.precomputed.naf)
      return this.precomputed.naf;
    var res = [this];
    var max = (1 << wnd) - 1;
    var dbl = max === 1 ? null : this.dbl();
    for (var i2 = 1; i2 < max; i2++)
      res[i2] = res[i2 - 1].add(dbl);
    return {
      wnd,
      points: res
    };
  };
  BasePoint.prototype._getBeta = function _getBeta() {
    return null;
  };
  BasePoint.prototype.dblp = function dblp(k) {
    var r2 = this;
    for (var i2 = 0; i2 < k; i2++)
      r2 = r2.dbl();
    return r2;
  };
  var inherits_browserExports = {};
  var inherits_browser = {
    get exports() {
      return inherits_browserExports;
    },
    set exports(v) {
      inherits_browserExports = v;
    }
  };
  if (typeof Object.create === "function") {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      }
    };
  } else {
    inherits_browser.exports = function inherits2(ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
    };
  }
  var utils$j = utils$m;
  var BN$7 = bnExports;
  var inherits$3 = inherits_browserExports;
  var Base$2 = base;
  var assert$d = utils$j.assert;
  function ShortCurve(conf) {
    Base$2.call(this, "short", conf);
    this.a = new BN$7(conf.a, 16).toRed(this.red);
    this.b = new BN$7(conf.b, 16).toRed(this.red);
    this.tinv = this.two.redInvm();
    this.zeroA = this.a.fromRed().cmpn(0) === 0;
    this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;
    this.endo = this._getEndomorphism(conf);
    this._endoWnafT1 = new Array(4);
    this._endoWnafT2 = new Array(4);
  }
  inherits$3(ShortCurve, Base$2);
  var short = ShortCurve;
  ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
    if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
      return;
    var beta;
    var lambda;
    if (conf.beta) {
      beta = new BN$7(conf.beta, 16).toRed(this.red);
    } else {
      var betas = this._getEndoRoots(this.p);
      beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
      beta = beta.toRed(this.red);
    }
    if (conf.lambda) {
      lambda = new BN$7(conf.lambda, 16);
    } else {
      var lambdas = this._getEndoRoots(this.n);
      if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
        lambda = lambdas[0];
      } else {
        lambda = lambdas[1];
        assert$d(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
      }
    }
    var basis;
    if (conf.basis) {
      basis = conf.basis.map(function(vec) {
        return {
          a: new BN$7(vec.a, 16),
          b: new BN$7(vec.b, 16)
        };
      });
    } else {
      basis = this._getEndoBasis(lambda);
    }
    return {
      beta,
      lambda,
      basis
    };
  };
  ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
    var red = num === this.p ? this.red : BN$7.mont(num);
    var tinv = new BN$7(2).toRed(red).redInvm();
    var ntinv = tinv.redNeg();
    var s2 = new BN$7(3).toRed(red).redNeg().redSqrt().redMul(tinv);
    var l1 = ntinv.redAdd(s2).fromRed();
    var l2 = ntinv.redSub(s2).fromRed();
    return [l1, l2];
  };
  ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
    var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
    var u = lambda;
    var v = this.n.clone();
    var x1 = new BN$7(1);
    var y1 = new BN$7(0);
    var x2 = new BN$7(0);
    var y2 = new BN$7(1);
    var a0;
    var b0;
    var a1;
    var b1;
    var a2;
    var b2;
    var prevR;
    var i2 = 0;
    var r2;
    var x;
    while (u.cmpn(0) !== 0) {
      var q = v.div(u);
      r2 = v.sub(q.mul(u));
      x = x2.sub(q.mul(x1));
      var y = y2.sub(q.mul(y1));
      if (!a1 && r2.cmp(aprxSqrt) < 0) {
        a0 = prevR.neg();
        b0 = x1;
        a1 = r2.neg();
        b1 = x;
      } else if (a1 && ++i2 === 2) {
        break;
      }
      prevR = r2;
      v = u;
      u = r2;
      x2 = x1;
      x1 = x;
      y2 = y1;
      y1 = y;
    }
    a2 = r2.neg();
    b2 = x;
    var len1 = a1.sqr().add(b1.sqr());
    var len2 = a2.sqr().add(b2.sqr());
    if (len2.cmp(len1) >= 0) {
      a2 = a0;
      b2 = b0;
    }
    if (a1.negative) {
      a1 = a1.neg();
      b1 = b1.neg();
    }
    if (a2.negative) {
      a2 = a2.neg();
      b2 = b2.neg();
    }
    return [
      { a: a1, b: b1 },
      { a: a2, b: b2 }
    ];
  };
  ShortCurve.prototype._endoSplit = function _endoSplit(k) {
    var basis = this.endo.basis;
    var v1 = basis[0];
    var v2 = basis[1];
    var c1 = v2.b.mul(k).divRound(this.n);
    var c2 = v1.b.neg().mul(k).divRound(this.n);
    var p1 = c1.mul(v1.a);
    var p2 = c2.mul(v2.a);
    var q1 = c1.mul(v1.b);
    var q2 = c2.mul(v2.b);
    var k1 = k.sub(p1).sub(p2);
    var k2 = q1.add(q2).neg();
    return { k1, k2 };
  };
  ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new BN$7(x, 16);
    if (!x.red)
      x = x.toRed(this.red);
    var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd)
      y = y.redNeg();
    return this.point(x, y);
  };
  ShortCurve.prototype.validate = function validate(point) {
    if (point.inf)
      return true;
    var x = point.x;
    var y = point.y;
    var ax = this.a.redMul(x);
    var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
    return y.redSqr().redISub(rhs).cmpn(0) === 0;
  };
  ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
    var npoints = this._endoWnafT1;
    var ncoeffs = this._endoWnafT2;
    for (var i2 = 0; i2 < points.length; i2++) {
      var split = this._endoSplit(coeffs[i2]);
      var p = points[i2];
      var beta = p._getBeta();
      if (split.k1.negative) {
        split.k1.ineg();
        p = p.neg(true);
      }
      if (split.k2.negative) {
        split.k2.ineg();
        beta = beta.neg(true);
      }
      npoints[i2 * 2] = p;
      npoints[i2 * 2 + 1] = beta;
      ncoeffs[i2 * 2] = split.k1;
      ncoeffs[i2 * 2 + 1] = split.k2;
    }
    var res = this._wnafMulAdd(1, npoints, ncoeffs, i2 * 2, jacobianResult);
    for (var j = 0; j < i2 * 2; j++) {
      npoints[j] = null;
      ncoeffs[j] = null;
    }
    return res;
  };
  function Point$2(curve2, x, y, isRed) {
    Base$2.BasePoint.call(this, curve2, "affine");
    if (x === null && y === null) {
      this.x = null;
      this.y = null;
      this.inf = true;
    } else {
      this.x = new BN$7(x, 16);
      this.y = new BN$7(y, 16);
      if (isRed) {
        this.x.forceRed(this.curve.red);
        this.y.forceRed(this.curve.red);
      }
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      this.inf = false;
    }
  }
  inherits$3(Point$2, Base$2.BasePoint);
  ShortCurve.prototype.point = function point(x, y, isRed) {
    return new Point$2(this, x, y, isRed);
  };
  ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
    return Point$2.fromJSON(this, obj, red);
  };
  Point$2.prototype._getBeta = function _getBeta() {
    if (!this.curve.endo)
      return;
    var pre = this.precomputed;
    if (pre && pre.beta)
      return pre.beta;
    var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
    if (pre) {
      var curve2 = this.curve;
      var endoMul = function(p) {
        return curve2.point(p.x.redMul(curve2.endo.beta), p.y);
      };
      pre.beta = beta;
      beta.precomputed = {
        beta: null,
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(endoMul)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(endoMul)
        }
      };
    }
    return beta;
  };
  Point$2.prototype.toJSON = function toJSON() {
    if (!this.precomputed)
      return [this.x, this.y];
    return [this.x, this.y, this.precomputed && {
      doubles: this.precomputed.doubles && {
        step: this.precomputed.doubles.step,
        points: this.precomputed.doubles.points.slice(1)
      },
      naf: this.precomputed.naf && {
        wnd: this.precomputed.naf.wnd,
        points: this.precomputed.naf.points.slice(1)
      }
    }];
  };
  Point$2.fromJSON = function fromJSON(curve2, obj, red) {
    if (typeof obj === "string")
      obj = JSON.parse(obj);
    var res = curve2.point(obj[0], obj[1], red);
    if (!obj[2])
      return res;
    function obj2point(obj2) {
      return curve2.point(obj2[0], obj2[1], red);
    }
    var pre = obj[2];
    res.precomputed = {
      beta: null,
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: [res].concat(pre.doubles.points.map(obj2point))
      },
      naf: pre.naf && {
        wnd: pre.naf.wnd,
        points: [res].concat(pre.naf.points.map(obj2point))
      }
    };
    return res;
  };
  Point$2.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return "<EC Point Infinity>";
    return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
  };
  Point$2.prototype.isInfinity = function isInfinity() {
    return this.inf;
  };
  Point$2.prototype.add = function add(p) {
    if (this.inf)
      return p;
    if (p.inf)
      return this;
    if (this.eq(p))
      return this.dbl();
    if (this.neg().eq(p))
      return this.curve.point(null, null);
    if (this.x.cmp(p.x) === 0)
      return this.curve.point(null, null);
    var c = this.y.redSub(p.y);
    if (c.cmpn(0) !== 0)
      c = c.redMul(this.x.redSub(p.x).redInvm());
    var nx = c.redSqr().redISub(this.x).redISub(p.x);
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };
  Point$2.prototype.dbl = function dbl() {
    if (this.inf)
      return this;
    var ys1 = this.y.redAdd(this.y);
    if (ys1.cmpn(0) === 0)
      return this.curve.point(null, null);
    var a = this.curve.a;
    var x2 = this.x.redSqr();
    var dyinv = ys1.redInvm();
    var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
    var nx = c.redSqr().redISub(this.x.redAdd(this.x));
    var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
    return this.curve.point(nx, ny);
  };
  Point$2.prototype.getX = function getX() {
    return this.x.fromRed();
  };
  Point$2.prototype.getY = function getY() {
    return this.y.fromRed();
  };
  Point$2.prototype.mul = function mul(k) {
    k = new BN$7(k, 16);
    if (this.isInfinity())
      return this;
    else if (this._hasDoubles(k))
      return this.curve._fixedNafMul(this, k);
    else if (this.curve.endo)
      return this.curve._endoWnafMulAdd([this], [k]);
    else
      return this.curve._wnafMul(this, k);
  };
  Point$2.prototype.mulAdd = function mulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo)
      return this.curve._endoWnafMulAdd(points, coeffs);
    else
      return this.curve._wnafMulAdd(1, points, coeffs, 2);
  };
  Point$2.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
    var points = [this, p2];
    var coeffs = [k1, k2];
    if (this.curve.endo)
      return this.curve._endoWnafMulAdd(points, coeffs, true);
    else
      return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
  };
  Point$2.prototype.eq = function eq(p) {
    return this === p || this.inf === p.inf && (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
  };
  Point$2.prototype.neg = function neg(_precompute) {
    if (this.inf)
      return this;
    var res = this.curve.point(this.x, this.y.redNeg());
    if (_precompute && this.precomputed) {
      var pre = this.precomputed;
      var negate = function(p) {
        return p.neg();
      };
      res.precomputed = {
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: pre.naf.points.map(negate)
        },
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: pre.doubles.points.map(negate)
        }
      };
    }
    return res;
  };
  Point$2.prototype.toJ = function toJ() {
    if (this.inf)
      return this.curve.jpoint(null, null, null);
    var res = this.curve.jpoint(this.x, this.y, this.curve.one);
    return res;
  };
  function JPoint(curve2, x, y, z) {
    Base$2.BasePoint.call(this, curve2, "jacobian");
    if (x === null && y === null && z === null) {
      this.x = this.curve.one;
      this.y = this.curve.one;
      this.z = new BN$7(0);
    } else {
      this.x = new BN$7(x, 16);
      this.y = new BN$7(y, 16);
      this.z = new BN$7(z, 16);
    }
    if (!this.x.red)
      this.x = this.x.toRed(this.curve.red);
    if (!this.y.red)
      this.y = this.y.toRed(this.curve.red);
    if (!this.z.red)
      this.z = this.z.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;
  }
  inherits$3(JPoint, Base$2.BasePoint);
  ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
    return new JPoint(this, x, y, z);
  };
  JPoint.prototype.toP = function toP() {
    if (this.isInfinity())
      return this.curve.point(null, null);
    var zinv = this.z.redInvm();
    var zinv2 = zinv.redSqr();
    var ax = this.x.redMul(zinv2);
    var ay = this.y.redMul(zinv2).redMul(zinv);
    return this.curve.point(ax, ay);
  };
  JPoint.prototype.neg = function neg() {
    return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
  };
  JPoint.prototype.add = function add(p) {
    if (this.isInfinity())
      return p;
    if (p.isInfinity())
      return this;
    var pz2 = p.z.redSqr();
    var z2 = this.z.redSqr();
    var u1 = this.x.redMul(pz2);
    var u2 = p.x.redMul(z2);
    var s1 = this.y.redMul(pz2.redMul(p.z));
    var s2 = p.y.redMul(z2.redMul(this.z));
    var h = u1.redSub(u2);
    var r2 = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
      if (r2.cmpn(0) !== 0)
        return this.curve.jpoint(null, null, null);
      else
        return this.dbl();
    }
    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r2.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r2.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(p.z).redMul(h);
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype.mixedAdd = function mixedAdd(p) {
    if (this.isInfinity())
      return p.toJ();
    if (p.isInfinity())
      return this;
    var z2 = this.z.redSqr();
    var u1 = this.x;
    var u2 = p.x.redMul(z2);
    var s1 = this.y;
    var s2 = p.y.redMul(z2).redMul(this.z);
    var h = u1.redSub(u2);
    var r2 = s1.redSub(s2);
    if (h.cmpn(0) === 0) {
      if (r2.cmpn(0) !== 0)
        return this.curve.jpoint(null, null, null);
      else
        return this.dbl();
    }
    var h2 = h.redSqr();
    var h3 = h2.redMul(h);
    var v = u1.redMul(h2);
    var nx = r2.redSqr().redIAdd(h3).redISub(v).redISub(v);
    var ny = r2.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
    var nz = this.z.redMul(h);
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype.dblp = function dblp(pow) {
    if (pow === 0)
      return this;
    if (this.isInfinity())
      return this;
    if (!pow)
      return this.dbl();
    var i2;
    if (this.curve.zeroA || this.curve.threeA) {
      var r2 = this;
      for (i2 = 0; i2 < pow; i2++)
        r2 = r2.dbl();
      return r2;
    }
    var a = this.curve.a;
    var tinv = this.curve.tinv;
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();
    var jyd = jy.redAdd(jy);
    for (i2 = 0; i2 < pow; i2++) {
      var jx2 = jx.redSqr();
      var jyd2 = jyd.redSqr();
      var jyd4 = jyd2.redSqr();
      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
      var t1 = jx.redMul(jyd2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);
      var dny = c.redMul(t2);
      dny = dny.redIAdd(dny).redISub(jyd4);
      var nz = jyd.redMul(jz);
      if (i2 + 1 < pow)
        jz4 = jz4.redMul(jyd4);
      jx = nx;
      jz = nz;
      jyd = dny;
    }
    return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
  };
  JPoint.prototype.dbl = function dbl() {
    if (this.isInfinity())
      return this;
    if (this.curve.zeroA)
      return this._zeroDbl();
    else if (this.curve.threeA)
      return this._threeDbl();
    else
      return this._dbl();
  };
  JPoint.prototype._zeroDbl = function _zeroDbl() {
    var nx;
    var ny;
    var nz;
    if (this.zOne) {
      var xx = this.x.redSqr();
      var yy = this.y.redSqr();
      var yyyy = yy.redSqr();
      var s2 = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s2 = s2.redIAdd(s2);
      var m = xx.redAdd(xx).redIAdd(xx);
      var t2 = m.redSqr().redISub(s2).redISub(s2);
      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      nx = t2;
      ny = m.redMul(s2.redISub(t2)).redISub(yyyy8);
      nz = this.y.redAdd(this.y);
    } else {
      var a = this.x.redSqr();
      var b = this.y.redSqr();
      var c = b.redSqr();
      var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
      d = d.redIAdd(d);
      var e = a.redAdd(a).redIAdd(a);
      var f2 = e.redSqr();
      var c8 = c.redIAdd(c);
      c8 = c8.redIAdd(c8);
      c8 = c8.redIAdd(c8);
      nx = f2.redISub(d).redISub(d);
      ny = e.redMul(d.redISub(nx)).redISub(c8);
      nz = this.y.redMul(this.z);
      nz = nz.redIAdd(nz);
    }
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype._threeDbl = function _threeDbl() {
    var nx;
    var ny;
    var nz;
    if (this.zOne) {
      var xx = this.x.redSqr();
      var yy = this.y.redSqr();
      var yyyy = yy.redSqr();
      var s2 = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      s2 = s2.redIAdd(s2);
      var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
      var t2 = m.redSqr().redISub(s2).redISub(s2);
      nx = t2;
      var yyyy8 = yyyy.redIAdd(yyyy);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      yyyy8 = yyyy8.redIAdd(yyyy8);
      ny = m.redMul(s2.redISub(t2)).redISub(yyyy8);
      nz = this.y.redAdd(this.y);
    } else {
      var delta = this.z.redSqr();
      var gamma = this.y.redSqr();
      var beta = this.x.redMul(gamma);
      var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
      alpha = alpha.redAdd(alpha).redIAdd(alpha);
      var beta4 = beta.redIAdd(beta);
      beta4 = beta4.redIAdd(beta4);
      var beta8 = beta4.redAdd(beta4);
      nx = alpha.redSqr().redISub(beta8);
      nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
      var ggamma8 = gamma.redSqr();
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ggamma8 = ggamma8.redIAdd(ggamma8);
      ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
    }
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype._dbl = function _dbl() {
    var a = this.curve.a;
    var jx = this.x;
    var jy = this.y;
    var jz = this.z;
    var jz4 = jz.redSqr().redSqr();
    var jx2 = jx.redSqr();
    var jy2 = jy.redSqr();
    var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
    var jxd4 = jx.redAdd(jx);
    jxd4 = jxd4.redIAdd(jxd4);
    var t1 = jxd4.redMul(jy2);
    var nx = c.redSqr().redISub(t1.redAdd(t1));
    var t2 = t1.redISub(nx);
    var jyd8 = jy2.redSqr();
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    jyd8 = jyd8.redIAdd(jyd8);
    var ny = c.redMul(t2).redISub(jyd8);
    var nz = jy.redAdd(jy).redMul(jz);
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype.trpl = function trpl() {
    if (!this.curve.zeroA)
      return this.dbl().add(this);
    var xx = this.x.redSqr();
    var yy = this.y.redSqr();
    var zz = this.z.redSqr();
    var yyyy = yy.redSqr();
    var m = xx.redAdd(xx).redIAdd(xx);
    var mm = m.redSqr();
    var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    e = e.redIAdd(e);
    e = e.redAdd(e).redIAdd(e);
    e = e.redISub(mm);
    var ee = e.redSqr();
    var t2 = yyyy.redIAdd(yyyy);
    t2 = t2.redIAdd(t2);
    t2 = t2.redIAdd(t2);
    t2 = t2.redIAdd(t2);
    var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t2);
    var yyu4 = yy.redMul(u);
    yyu4 = yyu4.redIAdd(yyu4);
    yyu4 = yyu4.redIAdd(yyu4);
    var nx = this.x.redMul(ee).redISub(yyu4);
    nx = nx.redIAdd(nx);
    nx = nx.redIAdd(nx);
    var ny = this.y.redMul(u.redMul(t2.redISub(u)).redISub(e.redMul(ee)));
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    ny = ny.redIAdd(ny);
    var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
    return this.curve.jpoint(nx, ny, nz);
  };
  JPoint.prototype.mul = function mul(k, kbase) {
    k = new BN$7(k, kbase);
    return this.curve._wnafMul(this, k);
  };
  JPoint.prototype.eq = function eq(p) {
    if (p.type === "affine")
      return this.eq(p.toJ());
    if (this === p)
      return true;
    var z2 = this.z.redSqr();
    var pz2 = p.z.redSqr();
    if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
      return false;
    var z3 = z2.redMul(this.z);
    var pz3 = pz2.redMul(p.z);
    return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
  };
  JPoint.prototype.eqXToP = function eqXToP(x) {
    var zs = this.z.redSqr();
    var rx = x.toRed(this.curve.red).redMul(zs);
    if (this.x.cmp(rx) === 0)
      return true;
    var xc = x.clone();
    var t2 = this.curve.redN.redMul(zs);
    for (; ; ) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0)
        return false;
      rx.redIAdd(t2);
      if (this.x.cmp(rx) === 0)
        return true;
    }
  };
  JPoint.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return "<EC JPoint Infinity>";
    return "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
  };
  JPoint.prototype.isInfinity = function isInfinity() {
    return this.z.cmpn(0) === 0;
  };
  var BN$6 = bnExports;
  var inherits$2 = inherits_browserExports;
  var Base$1 = base;
  var utils$i = utils$m;
  function MontCurve(conf) {
    Base$1.call(this, "mont", conf);
    this.a = new BN$6(conf.a, 16).toRed(this.red);
    this.b = new BN$6(conf.b, 16).toRed(this.red);
    this.i4 = new BN$6(4).toRed(this.red).redInvm();
    this.two = new BN$6(2).toRed(this.red);
    this.a24 = this.i4.redMul(this.a.redAdd(this.two));
  }
  inherits$2(MontCurve, Base$1);
  var mont = MontCurve;
  MontCurve.prototype.validate = function validate(point) {
    var x = point.normalize().x;
    var x2 = x.redSqr();
    var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
    var y = rhs.redSqrt();
    return y.redSqr().cmp(rhs) === 0;
  };
  function Point$1(curve2, x, z) {
    Base$1.BasePoint.call(this, curve2, "projective");
    if (x === null && z === null) {
      this.x = this.curve.one;
      this.z = this.curve.zero;
    } else {
      this.x = new BN$6(x, 16);
      this.z = new BN$6(z, 16);
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);
    }
  }
  inherits$2(Point$1, Base$1.BasePoint);
  MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
    return this.point(utils$i.toArray(bytes, enc), 1);
  };
  MontCurve.prototype.point = function point(x, z) {
    return new Point$1(this, x, z);
  };
  MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point$1.fromJSON(this, obj);
  };
  Point$1.prototype.precompute = function precompute() {
  };
  Point$1.prototype._encode = function _encode() {
    return this.getX().toArray("be", this.curve.p.byteLength());
  };
  Point$1.fromJSON = function fromJSON(curve2, obj) {
    return new Point$1(curve2, obj[0], obj[1] || curve2.one);
  };
  Point$1.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return "<EC Point Infinity>";
    return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
  };
  Point$1.prototype.isInfinity = function isInfinity() {
    return this.z.cmpn(0) === 0;
  };
  Point$1.prototype.dbl = function dbl() {
    var a = this.x.redAdd(this.z);
    var aa = a.redSqr();
    var b = this.x.redSub(this.z);
    var bb = b.redSqr();
    var c = aa.redSub(bb);
    var nx = aa.redMul(bb);
    var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
    return this.curve.point(nx, nz);
  };
  Point$1.prototype.add = function add() {
    throw new Error("Not supported on Montgomery curve");
  };
  Point$1.prototype.diffAdd = function diffAdd(p, diff) {
    var a = this.x.redAdd(this.z);
    var b = this.x.redSub(this.z);
    var c = p.x.redAdd(p.z);
    var d = p.x.redSub(p.z);
    var da = d.redMul(a);
    var cb = c.redMul(b);
    var nx = diff.z.redMul(da.redAdd(cb).redSqr());
    var nz = diff.x.redMul(da.redISub(cb).redSqr());
    return this.curve.point(nx, nz);
  };
  Point$1.prototype.mul = function mul(k) {
    var t2 = k.clone();
    var a = this;
    var b = this.curve.point(null, null);
    var c = this;
    for (var bits = []; t2.cmpn(0) !== 0; t2.iushrn(1))
      bits.push(t2.andln(1));
    for (var i2 = bits.length - 1; i2 >= 0; i2--) {
      if (bits[i2] === 0) {
        a = a.diffAdd(b, c);
        b = b.dbl();
      } else {
        b = a.diffAdd(b, c);
        a = a.dbl();
      }
    }
    return b;
  };
  Point$1.prototype.mulAdd = function mulAdd() {
    throw new Error("Not supported on Montgomery curve");
  };
  Point$1.prototype.jumlAdd = function jumlAdd() {
    throw new Error("Not supported on Montgomery curve");
  };
  Point$1.prototype.eq = function eq(other) {
    return this.getX().cmp(other.getX()) === 0;
  };
  Point$1.prototype.normalize = function normalize() {
    this.x = this.x.redMul(this.z.redInvm());
    this.z = this.curve.one;
    return this;
  };
  Point$1.prototype.getX = function getX() {
    this.normalize();
    return this.x.fromRed();
  };
  var utils$h = utils$m;
  var BN$5 = bnExports;
  var inherits$1 = inherits_browserExports;
  var Base = base;
  var assert$c = utils$h.assert;
  function EdwardsCurve(conf) {
    this.twisted = (conf.a | 0) !== 1;
    this.mOneA = this.twisted && (conf.a | 0) === -1;
    this.extended = this.mOneA;
    Base.call(this, "edwards", conf);
    this.a = new BN$5(conf.a, 16).umod(this.red.m);
    this.a = this.a.toRed(this.red);
    this.c = new BN$5(conf.c, 16).toRed(this.red);
    this.c2 = this.c.redSqr();
    this.d = new BN$5(conf.d, 16).toRed(this.red);
    this.dd = this.d.redAdd(this.d);
    assert$c(!this.twisted || this.c.fromRed().cmpn(1) === 0);
    this.oneC = (conf.c | 0) === 1;
  }
  inherits$1(EdwardsCurve, Base);
  var edwards = EdwardsCurve;
  EdwardsCurve.prototype._mulA = function _mulA(num) {
    if (this.mOneA)
      return num.redNeg();
    else
      return this.a.redMul(num);
  };
  EdwardsCurve.prototype._mulC = function _mulC(num) {
    if (this.oneC)
      return num;
    else
      return this.c.redMul(num);
  };
  EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t2) {
    return this.point(x, y, z, t2);
  };
  EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
    x = new BN$5(x, 16);
    if (!x.red)
      x = x.toRed(this.red);
    var x2 = x.redSqr();
    var rhs = this.c2.redSub(this.a.redMul(x2));
    var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));
    var y2 = rhs.redMul(lhs.redInvm());
    var y = y2.redSqrt();
    if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    var isOdd = y.fromRed().isOdd();
    if (odd && !isOdd || !odd && isOdd)
      y = y.redNeg();
    return this.point(x, y);
  };
  EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
    y = new BN$5(y, 16);
    if (!y.red)
      y = y.toRed(this.red);
    var y2 = y.redSqr();
    var lhs = y2.redSub(this.c2);
    var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
    var x2 = lhs.redMul(rhs.redInvm());
    if (x2.cmp(this.zero) === 0) {
      if (odd)
        throw new Error("invalid point");
      else
        return this.point(this.zero, y);
    }
    var x = x2.redSqrt();
    if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
      throw new Error("invalid point");
    if (x.fromRed().isOdd() !== odd)
      x = x.redNeg();
    return this.point(x, y);
  };
  EdwardsCurve.prototype.validate = function validate(point) {
    if (point.isInfinity())
      return true;
    point.normalize();
    var x2 = point.x.redSqr();
    var y2 = point.y.redSqr();
    var lhs = x2.redMul(this.a).redAdd(y2);
    var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));
    return lhs.cmp(rhs) === 0;
  };
  function Point(curve2, x, y, z, t2) {
    Base.BasePoint.call(this, curve2, "projective");
    if (x === null && y === null && z === null) {
      this.x = this.curve.zero;
      this.y = this.curve.one;
      this.z = this.curve.one;
      this.t = this.curve.zero;
      this.zOne = true;
    } else {
      this.x = new BN$5(x, 16);
      this.y = new BN$5(y, 16);
      this.z = z ? new BN$5(z, 16) : this.curve.one;
      this.t = t2 && new BN$5(t2, 16);
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);
      if (this.t && !this.t.red)
        this.t = this.t.toRed(this.curve.red);
      this.zOne = this.z === this.curve.one;
      if (this.curve.extended && !this.t) {
        this.t = this.x.redMul(this.y);
        if (!this.zOne)
          this.t = this.t.redMul(this.z.redInvm());
      }
    }
  }
  inherits$1(Point, Base.BasePoint);
  EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
    return Point.fromJSON(this, obj);
  };
  EdwardsCurve.prototype.point = function point(x, y, z, t2) {
    return new Point(this, x, y, z, t2);
  };
  Point.fromJSON = function fromJSON(curve2, obj) {
    return new Point(curve2, obj[0], obj[1], obj[2]);
  };
  Point.prototype.inspect = function inspect() {
    if (this.isInfinity())
      return "<EC Point Infinity>";
    return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
  };
  Point.prototype.isInfinity = function isInfinity() {
    return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
  };
  Point.prototype._extDbl = function _extDbl() {
    var a = this.x.redSqr();
    var b = this.y.redSqr();
    var c = this.z.redSqr();
    c = c.redIAdd(c);
    var d = this.curve._mulA(a);
    var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
    var g = d.redAdd(b);
    var f2 = g.redSub(c);
    var h = d.redSub(b);
    var nx = e.redMul(f2);
    var ny = g.redMul(h);
    var nt = e.redMul(h);
    var nz = f2.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };
  Point.prototype._projDbl = function _projDbl() {
    var b = this.x.redAdd(this.y).redSqr();
    var c = this.x.redSqr();
    var d = this.y.redSqr();
    var nx;
    var ny;
    var nz;
    var e;
    var h;
    var j;
    if (this.curve.twisted) {
      e = this.curve._mulA(c);
      var f2 = e.redAdd(d);
      if (this.zOne) {
        nx = b.redSub(c).redSub(d).redMul(f2.redSub(this.curve.two));
        ny = f2.redMul(e.redSub(d));
        nz = f2.redSqr().redSub(f2).redSub(f2);
      } else {
        h = this.z.redSqr();
        j = f2.redSub(h).redISub(h);
        nx = b.redSub(c).redISub(d).redMul(j);
        ny = f2.redMul(e.redSub(d));
        nz = f2.redMul(j);
      }
    } else {
      e = c.redAdd(d);
      h = this.curve._mulC(this.z).redSqr();
      j = e.redSub(h).redSub(h);
      nx = this.curve._mulC(b.redISub(e)).redMul(j);
      ny = this.curve._mulC(e).redMul(c.redISub(d));
      nz = e.redMul(j);
    }
    return this.curve.point(nx, ny, nz);
  };
  Point.prototype.dbl = function dbl() {
    if (this.isInfinity())
      return this;
    if (this.curve.extended)
      return this._extDbl();
    else
      return this._projDbl();
  };
  Point.prototype._extAdd = function _extAdd(p) {
    var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
    var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
    var c = this.t.redMul(this.curve.dd).redMul(p.t);
    var d = this.z.redMul(p.z.redAdd(p.z));
    var e = b.redSub(a);
    var f2 = d.redSub(c);
    var g = d.redAdd(c);
    var h = b.redAdd(a);
    var nx = e.redMul(f2);
    var ny = g.redMul(h);
    var nt = e.redMul(h);
    var nz = f2.redMul(g);
    return this.curve.point(nx, ny, nz, nt);
  };
  Point.prototype._projAdd = function _projAdd(p) {
    var a = this.z.redMul(p.z);
    var b = a.redSqr();
    var c = this.x.redMul(p.x);
    var d = this.y.redMul(p.y);
    var e = this.curve.d.redMul(c).redMul(d);
    var f2 = b.redSub(e);
    var g = b.redAdd(e);
    var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
    var nx = a.redMul(f2).redMul(tmp);
    var ny;
    var nz;
    if (this.curve.twisted) {
      ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
      nz = f2.redMul(g);
    } else {
      ny = a.redMul(g).redMul(d.redSub(c));
      nz = this.curve._mulC(f2).redMul(g);
    }
    return this.curve.point(nx, ny, nz);
  };
  Point.prototype.add = function add(p) {
    if (this.isInfinity())
      return p;
    if (p.isInfinity())
      return this;
    if (this.curve.extended)
      return this._extAdd(p);
    else
      return this._projAdd(p);
  };
  Point.prototype.mul = function mul(k) {
    if (this._hasDoubles(k))
      return this.curve._fixedNafMul(this, k);
    else
      return this.curve._wnafMul(this, k);
  };
  Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, false);
  };
  Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
    return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, true);
  };
  Point.prototype.normalize = function normalize() {
    if (this.zOne)
      return this;
    var zi = this.z.redInvm();
    this.x = this.x.redMul(zi);
    this.y = this.y.redMul(zi);
    if (this.t)
      this.t = this.t.redMul(zi);
    this.z = this.curve.one;
    this.zOne = true;
    return this;
  };
  Point.prototype.neg = function neg() {
    return this.curve.point(
      this.x.redNeg(),
      this.y,
      this.z,
      this.t && this.t.redNeg()
    );
  };
  Point.prototype.getX = function getX() {
    this.normalize();
    return this.x.fromRed();
  };
  Point.prototype.getY = function getY() {
    this.normalize();
    return this.y.fromRed();
  };
  Point.prototype.eq = function eq(other) {
    return this === other || this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0;
  };
  Point.prototype.eqXToP = function eqXToP(x) {
    var rx = x.toRed(this.curve.red).redMul(this.z);
    if (this.x.cmp(rx) === 0)
      return true;
    var xc = x.clone();
    var t2 = this.curve.redN.redMul(this.z);
    for (; ; ) {
      xc.iadd(this.curve.n);
      if (xc.cmp(this.curve.p) >= 0)
        return false;
      rx.redIAdd(t2);
      if (this.x.cmp(rx) === 0)
        return true;
    }
  };
  Point.prototype.toP = Point.prototype.normalize;
  Point.prototype.mixedAdd = Point.prototype.add;
  (function(exports) {
    var curve2 = exports;
    curve2.base = base;
    curve2.short = short;
    curve2.mont = mont;
    curve2.edwards = edwards;
  })(curve);
  var curves$2 = {};
  var hash$2 = {};
  var utils$g = {};
  var assert$b = minimalisticAssert;
  var inherits = inherits_browserExports;
  utils$g.inherits = inherits;
  function isSurrogatePair(msg, i2) {
    if ((msg.charCodeAt(i2) & 64512) !== 55296) {
      return false;
    }
    if (i2 < 0 || i2 + 1 >= msg.length) {
      return false;
    }
    return (msg.charCodeAt(i2 + 1) & 64512) === 56320;
  }
  function toArray(msg, enc) {
    if (Array.isArray(msg))
      return msg.slice();
    if (!msg)
      return [];
    var res = [];
    if (typeof msg === "string") {
      if (!enc) {
        var p = 0;
        for (var i2 = 0; i2 < msg.length; i2++) {
          var c = msg.charCodeAt(i2);
          if (c < 128) {
            res[p++] = c;
          } else if (c < 2048) {
            res[p++] = c >> 6 | 192;
            res[p++] = c & 63 | 128;
          } else if (isSurrogatePair(msg, i2)) {
            c = 65536 + ((c & 1023) << 10) + (msg.charCodeAt(++i2) & 1023);
            res[p++] = c >> 18 | 240;
            res[p++] = c >> 12 & 63 | 128;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          } else {
            res[p++] = c >> 12 | 224;
            res[p++] = c >> 6 & 63 | 128;
            res[p++] = c & 63 | 128;
          }
        }
      } else if (enc === "hex") {
        msg = msg.replace(/[^a-z0-9]+/ig, "");
        if (msg.length % 2 !== 0)
          msg = "0" + msg;
        for (i2 = 0; i2 < msg.length; i2 += 2)
          res.push(parseInt(msg[i2] + msg[i2 + 1], 16));
      }
    } else {
      for (i2 = 0; i2 < msg.length; i2++)
        res[i2] = msg[i2] | 0;
    }
    return res;
  }
  utils$g.toArray = toArray;
  function toHex$1(msg) {
    var res = "";
    for (var i2 = 0; i2 < msg.length; i2++)
      res += zero2(msg[i2].toString(16));
    return res;
  }
  utils$g.toHex = toHex$1;
  function htonl(w) {
    var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (w & 255) << 24;
    return res >>> 0;
  }
  utils$g.htonl = htonl;
  function toHex32(msg, endian) {
    var res = "";
    for (var i2 = 0; i2 < msg.length; i2++) {
      var w = msg[i2];
      if (endian === "little")
        w = htonl(w);
      res += zero8(w.toString(16));
    }
    return res;
  }
  utils$g.toHex32 = toHex32;
  function zero2(word) {
    if (word.length === 1)
      return "0" + word;
    else
      return word;
  }
  utils$g.zero2 = zero2;
  function zero8(word) {
    if (word.length === 7)
      return "0" + word;
    else if (word.length === 6)
      return "00" + word;
    else if (word.length === 5)
      return "000" + word;
    else if (word.length === 4)
      return "0000" + word;
    else if (word.length === 3)
      return "00000" + word;
    else if (word.length === 2)
      return "000000" + word;
    else if (word.length === 1)
      return "0000000" + word;
    else
      return word;
  }
  utils$g.zero8 = zero8;
  function join32(msg, start2, end, endian) {
    var len2 = end - start2;
    assert$b(len2 % 4 === 0);
    var res = new Array(len2 / 4);
    for (var i2 = 0, k = start2; i2 < res.length; i2++, k += 4) {
      var w;
      if (endian === "big")
        w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];
      else
        w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
      res[i2] = w >>> 0;
    }
    return res;
  }
  utils$g.join32 = join32;
  function split32(msg, endian) {
    var res = new Array(msg.length * 4);
    for (var i2 = 0, k = 0; i2 < msg.length; i2++, k += 4) {
      var m = msg[i2];
      if (endian === "big") {
        res[k] = m >>> 24;
        res[k + 1] = m >>> 16 & 255;
        res[k + 2] = m >>> 8 & 255;
        res[k + 3] = m & 255;
      } else {
        res[k + 3] = m >>> 24;
        res[k + 2] = m >>> 16 & 255;
        res[k + 1] = m >>> 8 & 255;
        res[k] = m & 255;
      }
    }
    return res;
  }
  utils$g.split32 = split32;
  function rotr32$1(w, b) {
    return w >>> b | w << 32 - b;
  }
  utils$g.rotr32 = rotr32$1;
  function rotl32$2(w, b) {
    return w << b | w >>> 32 - b;
  }
  utils$g.rotl32 = rotl32$2;
  function sum32$3(a, b) {
    return a + b >>> 0;
  }
  utils$g.sum32 = sum32$3;
  function sum32_3$1(a, b, c) {
    return a + b + c >>> 0;
  }
  utils$g.sum32_3 = sum32_3$1;
  function sum32_4$2(a, b, c, d) {
    return a + b + c + d >>> 0;
  }
  utils$g.sum32_4 = sum32_4$2;
  function sum32_5$2(a, b, c, d, e) {
    return a + b + c + d + e >>> 0;
  }
  utils$g.sum32_5 = sum32_5$2;
  function sum64$1(buf, pos, ah, al) {
    var bh = buf[pos];
    var bl = buf[pos + 1];
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    buf[pos] = hi >>> 0;
    buf[pos + 1] = lo;
  }
  utils$g.sum64 = sum64$1;
  function sum64_hi$1(ah, al, bh, bl) {
    var lo = al + bl >>> 0;
    var hi = (lo < al ? 1 : 0) + ah + bh;
    return hi >>> 0;
  }
  utils$g.sum64_hi = sum64_hi$1;
  function sum64_lo$1(ah, al, bh, bl) {
    var lo = al + bl;
    return lo >>> 0;
  }
  utils$g.sum64_lo = sum64_lo$1;
  function sum64_4_hi$1(ah, al, bh, bl, ch, cl, dh, dl) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    var hi = ah + bh + ch + dh + carry;
    return hi >>> 0;
  }
  utils$g.sum64_4_hi = sum64_4_hi$1;
  function sum64_4_lo$1(ah, al, bh, bl, ch, cl, dh, dl) {
    var lo = al + bl + cl + dl;
    return lo >>> 0;
  }
  utils$g.sum64_4_lo = sum64_4_lo$1;
  function sum64_5_hi$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var carry = 0;
    var lo = al;
    lo = lo + bl >>> 0;
    carry += lo < al ? 1 : 0;
    lo = lo + cl >>> 0;
    carry += lo < cl ? 1 : 0;
    lo = lo + dl >>> 0;
    carry += lo < dl ? 1 : 0;
    lo = lo + el >>> 0;
    carry += lo < el ? 1 : 0;
    var hi = ah + bh + ch + dh + eh + carry;
    return hi >>> 0;
  }
  utils$g.sum64_5_hi = sum64_5_hi$1;
  function sum64_5_lo$1(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
    var lo = al + bl + cl + dl + el;
    return lo >>> 0;
  }
  utils$g.sum64_5_lo = sum64_5_lo$1;
  function rotr64_hi$1(ah, al, num) {
    var r2 = al << 32 - num | ah >>> num;
    return r2 >>> 0;
  }
  utils$g.rotr64_hi = rotr64_hi$1;
  function rotr64_lo$1(ah, al, num) {
    var r2 = ah << 32 - num | al >>> num;
    return r2 >>> 0;
  }
  utils$g.rotr64_lo = rotr64_lo$1;
  function shr64_hi$1(ah, al, num) {
    return ah >>> num;
  }
  utils$g.shr64_hi = shr64_hi$1;
  function shr64_lo$1(ah, al, num) {
    var r2 = ah << 32 - num | al >>> num;
    return r2 >>> 0;
  }
  utils$g.shr64_lo = shr64_lo$1;
  var common$5 = {};
  var utils$f = utils$g;
  var assert$a = minimalisticAssert;
  function BlockHash$4() {
    this.pending = null;
    this.pendingTotal = 0;
    this.blockSize = this.constructor.blockSize;
    this.outSize = this.constructor.outSize;
    this.hmacStrength = this.constructor.hmacStrength;
    this.padLength = this.constructor.padLength / 8;
    this.endian = "big";
    this._delta8 = this.blockSize / 8;
    this._delta32 = this.blockSize / 32;
  }
  common$5.BlockHash = BlockHash$4;
  BlockHash$4.prototype.update = function update(msg, enc) {
    msg = utils$f.toArray(msg, enc);
    if (!this.pending)
      this.pending = msg;
    else
      this.pending = this.pending.concat(msg);
    this.pendingTotal += msg.length;
    if (this.pending.length >= this._delta8) {
      msg = this.pending;
      var r2 = msg.length % this._delta8;
      this.pending = msg.slice(msg.length - r2, msg.length);
      if (this.pending.length === 0)
        this.pending = null;
      msg = utils$f.join32(msg, 0, msg.length - r2, this.endian);
      for (var i2 = 0; i2 < msg.length; i2 += this._delta32)
        this._update(msg, i2, i2 + this._delta32);
    }
    return this;
  };
  BlockHash$4.prototype.digest = function digest(enc) {
    this.update(this._pad());
    assert$a(this.pending === null);
    return this._digest(enc);
  };
  BlockHash$4.prototype._pad = function pad() {
    var len2 = this.pendingTotal;
    var bytes = this._delta8;
    var k = bytes - (len2 + this.padLength) % bytes;
    var res = new Array(k + this.padLength);
    res[0] = 128;
    for (var i2 = 1; i2 < k; i2++)
      res[i2] = 0;
    len2 <<= 3;
    if (this.endian === "big") {
      for (var t2 = 8; t2 < this.padLength; t2++)
        res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = len2 >>> 24 & 255;
      res[i2++] = len2 >>> 16 & 255;
      res[i2++] = len2 >>> 8 & 255;
      res[i2++] = len2 & 255;
    } else {
      res[i2++] = len2 & 255;
      res[i2++] = len2 >>> 8 & 255;
      res[i2++] = len2 >>> 16 & 255;
      res[i2++] = len2 >>> 24 & 255;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      res[i2++] = 0;
      for (t2 = 8; t2 < this.padLength; t2++)
        res[i2++] = 0;
    }
    return res;
  };
  var sha = {};
  var common$4 = {};
  var utils$e = utils$g;
  var rotr32 = utils$e.rotr32;
  function ft_1$1(s2, x, y, z) {
    if (s2 === 0)
      return ch32$1(x, y, z);
    if (s2 === 1 || s2 === 3)
      return p32(x, y, z);
    if (s2 === 2)
      return maj32$1(x, y, z);
  }
  common$4.ft_1 = ft_1$1;
  function ch32$1(x, y, z) {
    return x & y ^ ~x & z;
  }
  common$4.ch32 = ch32$1;
  function maj32$1(x, y, z) {
    return x & y ^ x & z ^ y & z;
  }
  common$4.maj32 = maj32$1;
  function p32(x, y, z) {
    return x ^ y ^ z;
  }
  common$4.p32 = p32;
  function s0_256$1(x) {
    return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
  }
  common$4.s0_256 = s0_256$1;
  function s1_256$1(x) {
    return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
  }
  common$4.s1_256 = s1_256$1;
  function g0_256$1(x) {
    return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
  }
  common$4.g0_256 = g0_256$1;
  function g1_256$1(x) {
    return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
  }
  common$4.g1_256 = g1_256$1;
  var utils$d = utils$g;
  var common$3 = common$5;
  var shaCommon$1 = common$4;
  var rotl32$1 = utils$d.rotl32;
  var sum32$2 = utils$d.sum32;
  var sum32_5$1 = utils$d.sum32_5;
  var ft_1 = shaCommon$1.ft_1;
  var BlockHash$3 = common$3.BlockHash;
  var sha1_K = [
    1518500249,
    1859775393,
    2400959708,
    3395469782
  ];
  function SHA1() {
    if (!(this instanceof SHA1))
      return new SHA1();
    BlockHash$3.call(this);
    this.h = [
      1732584193,
      4023233417,
      2562383102,
      271733878,
      3285377520
    ];
    this.W = new Array(80);
  }
  utils$d.inherits(SHA1, BlockHash$3);
  var _1 = SHA1;
  SHA1.blockSize = 512;
  SHA1.outSize = 160;
  SHA1.hmacStrength = 80;
  SHA1.padLength = 64;
  SHA1.prototype._update = function _update(msg, start2) {
    var W = this.W;
    for (var i2 = 0; i2 < 16; i2++)
      W[i2] = msg[start2 + i2];
    for (; i2 < W.length; i2++)
      W[i2] = rotl32$1(W[i2 - 3] ^ W[i2 - 8] ^ W[i2 - 14] ^ W[i2 - 16], 1);
    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    for (i2 = 0; i2 < W.length; i2++) {
      var s2 = ~~(i2 / 20);
      var t2 = sum32_5$1(rotl32$1(a, 5), ft_1(s2, b, c, d), e, W[i2], sha1_K[s2]);
      e = d;
      d = c;
      c = rotl32$1(b, 30);
      b = a;
      a = t2;
    }
    this.h[0] = sum32$2(this.h[0], a);
    this.h[1] = sum32$2(this.h[1], b);
    this.h[2] = sum32$2(this.h[2], c);
    this.h[3] = sum32$2(this.h[3], d);
    this.h[4] = sum32$2(this.h[4], e);
  };
  SHA1.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$d.toHex32(this.h, "big");
    else
      return utils$d.split32(this.h, "big");
  };
  var utils$c = utils$g;
  var common$2 = common$5;
  var shaCommon = common$4;
  var assert$9 = minimalisticAssert;
  var sum32$1 = utils$c.sum32;
  var sum32_4$1 = utils$c.sum32_4;
  var sum32_5 = utils$c.sum32_5;
  var ch32 = shaCommon.ch32;
  var maj32 = shaCommon.maj32;
  var s0_256 = shaCommon.s0_256;
  var s1_256 = shaCommon.s1_256;
  var g0_256 = shaCommon.g0_256;
  var g1_256 = shaCommon.g1_256;
  var BlockHash$2 = common$2.BlockHash;
  var sha256_K = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  function SHA256$1() {
    if (!(this instanceof SHA256$1))
      return new SHA256$1();
    BlockHash$2.call(this);
    this.h = [
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ];
    this.k = sha256_K;
    this.W = new Array(64);
  }
  utils$c.inherits(SHA256$1, BlockHash$2);
  var _256 = SHA256$1;
  SHA256$1.blockSize = 512;
  SHA256$1.outSize = 256;
  SHA256$1.hmacStrength = 192;
  SHA256$1.padLength = 64;
  SHA256$1.prototype._update = function _update(msg, start2) {
    var W = this.W;
    for (var i2 = 0; i2 < 16; i2++)
      W[i2] = msg[start2 + i2];
    for (; i2 < W.length; i2++)
      W[i2] = sum32_4$1(g1_256(W[i2 - 2]), W[i2 - 7], g0_256(W[i2 - 15]), W[i2 - 16]);
    var a = this.h[0];
    var b = this.h[1];
    var c = this.h[2];
    var d = this.h[3];
    var e = this.h[4];
    var f2 = this.h[5];
    var g = this.h[6];
    var h = this.h[7];
    assert$9(this.k.length === W.length);
    for (i2 = 0; i2 < W.length; i2++) {
      var T1 = sum32_5(h, s1_256(e), ch32(e, f2, g), this.k[i2], W[i2]);
      var T2 = sum32$1(s0_256(a), maj32(a, b, c));
      h = g;
      g = f2;
      f2 = e;
      e = sum32$1(d, T1);
      d = c;
      c = b;
      b = a;
      a = sum32$1(T1, T2);
    }
    this.h[0] = sum32$1(this.h[0], a);
    this.h[1] = sum32$1(this.h[1], b);
    this.h[2] = sum32$1(this.h[2], c);
    this.h[3] = sum32$1(this.h[3], d);
    this.h[4] = sum32$1(this.h[4], e);
    this.h[5] = sum32$1(this.h[5], f2);
    this.h[6] = sum32$1(this.h[6], g);
    this.h[7] = sum32$1(this.h[7], h);
  };
  SHA256$1.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$c.toHex32(this.h, "big");
    else
      return utils$c.split32(this.h, "big");
  };
  var utils$b = utils$g;
  var SHA256 = _256;
  function SHA224() {
    if (!(this instanceof SHA224))
      return new SHA224();
    SHA256.call(this);
    this.h = [
      3238371032,
      914150663,
      812702999,
      4144912697,
      4290775857,
      1750603025,
      1694076839,
      3204075428
    ];
  }
  utils$b.inherits(SHA224, SHA256);
  var _224 = SHA224;
  SHA224.blockSize = 512;
  SHA224.outSize = 224;
  SHA224.hmacStrength = 192;
  SHA224.padLength = 64;
  SHA224.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$b.toHex32(this.h.slice(0, 7), "big");
    else
      return utils$b.split32(this.h.slice(0, 7), "big");
  };
  var utils$a = utils$g;
  var common$1 = common$5;
  var assert$8 = minimalisticAssert;
  var rotr64_hi = utils$a.rotr64_hi;
  var rotr64_lo = utils$a.rotr64_lo;
  var shr64_hi = utils$a.shr64_hi;
  var shr64_lo = utils$a.shr64_lo;
  var sum64 = utils$a.sum64;
  var sum64_hi = utils$a.sum64_hi;
  var sum64_lo = utils$a.sum64_lo;
  var sum64_4_hi = utils$a.sum64_4_hi;
  var sum64_4_lo = utils$a.sum64_4_lo;
  var sum64_5_hi = utils$a.sum64_5_hi;
  var sum64_5_lo = utils$a.sum64_5_lo;
  var BlockHash$1 = common$1.BlockHash;
  var sha512_K = [
    1116352408,
    3609767458,
    1899447441,
    602891725,
    3049323471,
    3964484399,
    3921009573,
    2173295548,
    961987163,
    4081628472,
    1508970993,
    3053834265,
    2453635748,
    2937671579,
    2870763221,
    3664609560,
    3624381080,
    2734883394,
    310598401,
    1164996542,
    607225278,
    1323610764,
    1426881987,
    3590304994,
    1925078388,
    4068182383,
    2162078206,
    991336113,
    2614888103,
    633803317,
    3248222580,
    3479774868,
    3835390401,
    2666613458,
    4022224774,
    944711139,
    264347078,
    2341262773,
    604807628,
    2007800933,
    770255983,
    1495990901,
    1249150122,
    1856431235,
    1555081692,
    3175218132,
    1996064986,
    2198950837,
    2554220882,
    3999719339,
    2821834349,
    766784016,
    2952996808,
    2566594879,
    3210313671,
    3203337956,
    3336571891,
    1034457026,
    3584528711,
    2466948901,
    113926993,
    3758326383,
    338241895,
    168717936,
    666307205,
    1188179964,
    773529912,
    1546045734,
    1294757372,
    1522805485,
    1396182291,
    2643833823,
    1695183700,
    2343527390,
    1986661051,
    1014477480,
    2177026350,
    1206759142,
    2456956037,
    344077627,
    2730485921,
    1290863460,
    2820302411,
    3158454273,
    3259730800,
    3505952657,
    3345764771,
    106217008,
    3516065817,
    3606008344,
    3600352804,
    1432725776,
    4094571909,
    1467031594,
    275423344,
    851169720,
    430227734,
    3100823752,
    506948616,
    1363258195,
    659060556,
    3750685593,
    883997877,
    3785050280,
    958139571,
    3318307427,
    1322822218,
    3812723403,
    1537002063,
    2003034995,
    1747873779,
    3602036899,
    1955562222,
    1575990012,
    2024104815,
    1125592928,
    2227730452,
    2716904306,
    2361852424,
    442776044,
    2428436474,
    593698344,
    2756734187,
    3733110249,
    3204031479,
    2999351573,
    3329325298,
    3815920427,
    3391569614,
    3928383900,
    3515267271,
    566280711,
    3940187606,
    3454069534,
    4118630271,
    4000239992,
    116418474,
    1914138554,
    174292421,
    2731055270,
    289380356,
    3203993006,
    460393269,
    320620315,
    685471733,
    587496836,
    852142971,
    1086792851,
    1017036298,
    365543100,
    1126000580,
    2618297676,
    1288033470,
    3409855158,
    1501505948,
    4234509866,
    1607167915,
    987167468,
    1816402316,
    1246189591
  ];
  function SHA512$1() {
    if (!(this instanceof SHA512$1))
      return new SHA512$1();
    BlockHash$1.call(this);
    this.h = [
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ];
    this.k = sha512_K;
    this.W = new Array(160);
  }
  utils$a.inherits(SHA512$1, BlockHash$1);
  var _512 = SHA512$1;
  SHA512$1.blockSize = 1024;
  SHA512$1.outSize = 512;
  SHA512$1.hmacStrength = 192;
  SHA512$1.padLength = 128;
  SHA512$1.prototype._prepareBlock = function _prepareBlock(msg, start2) {
    var W = this.W;
    for (var i2 = 0; i2 < 32; i2++)
      W[i2] = msg[start2 + i2];
    for (; i2 < W.length; i2 += 2) {
      var c0_hi = g1_512_hi(W[i2 - 4], W[i2 - 3]);
      var c0_lo = g1_512_lo(W[i2 - 4], W[i2 - 3]);
      var c1_hi = W[i2 - 14];
      var c1_lo = W[i2 - 13];
      var c2_hi = g0_512_hi(W[i2 - 30], W[i2 - 29]);
      var c2_lo = g0_512_lo(W[i2 - 30], W[i2 - 29]);
      var c3_hi = W[i2 - 32];
      var c3_lo = W[i2 - 31];
      W[i2] = sum64_4_hi(
        c0_hi,
        c0_lo,
        c1_hi,
        c1_lo,
        c2_hi,
        c2_lo,
        c3_hi,
        c3_lo
      );
      W[i2 + 1] = sum64_4_lo(
        c0_hi,
        c0_lo,
        c1_hi,
        c1_lo,
        c2_hi,
        c2_lo,
        c3_hi,
        c3_lo
      );
    }
  };
  SHA512$1.prototype._update = function _update(msg, start2) {
    this._prepareBlock(msg, start2);
    var W = this.W;
    var ah = this.h[0];
    var al = this.h[1];
    var bh = this.h[2];
    var bl = this.h[3];
    var ch = this.h[4];
    var cl = this.h[5];
    var dh = this.h[6];
    var dl = this.h[7];
    var eh = this.h[8];
    var el = this.h[9];
    var fh = this.h[10];
    var fl = this.h[11];
    var gh = this.h[12];
    var gl = this.h[13];
    var hh = this.h[14];
    var hl = this.h[15];
    assert$8(this.k.length === W.length);
    for (var i2 = 0; i2 < W.length; i2 += 2) {
      var c0_hi = hh;
      var c0_lo = hl;
      var c1_hi = s1_512_hi(eh, el);
      var c1_lo = s1_512_lo(eh, el);
      var c2_hi = ch64_hi(eh, el, fh, fl, gh);
      var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
      var c3_hi = this.k[i2];
      var c3_lo = this.k[i2 + 1];
      var c4_hi = W[i2];
      var c4_lo = W[i2 + 1];
      var T1_hi = sum64_5_hi(
        c0_hi,
        c0_lo,
        c1_hi,
        c1_lo,
        c2_hi,
        c2_lo,
        c3_hi,
        c3_lo,
        c4_hi,
        c4_lo
      );
      var T1_lo = sum64_5_lo(
        c0_hi,
        c0_lo,
        c1_hi,
        c1_lo,
        c2_hi,
        c2_lo,
        c3_hi,
        c3_lo,
        c4_hi,
        c4_lo
      );
      c0_hi = s0_512_hi(ah, al);
      c0_lo = s0_512_lo(ah, al);
      c1_hi = maj64_hi(ah, al, bh, bl, ch);
      c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
      var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
      var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
      hh = gh;
      hl = gl;
      gh = fh;
      gl = fl;
      fh = eh;
      fl = el;
      eh = sum64_hi(dh, dl, T1_hi, T1_lo);
      el = sum64_lo(dl, dl, T1_hi, T1_lo);
      dh = ch;
      dl = cl;
      ch = bh;
      cl = bl;
      bh = ah;
      bl = al;
      ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
      al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
    }
    sum64(this.h, 0, ah, al);
    sum64(this.h, 2, bh, bl);
    sum64(this.h, 4, ch, cl);
    sum64(this.h, 6, dh, dl);
    sum64(this.h, 8, eh, el);
    sum64(this.h, 10, fh, fl);
    sum64(this.h, 12, gh, gl);
    sum64(this.h, 14, hh, hl);
  };
  SHA512$1.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$a.toHex32(this.h, "big");
    else
      return utils$a.split32(this.h, "big");
  };
  function ch64_hi(xh, xl, yh, yl, zh) {
    var r2 = xh & yh ^ ~xh & zh;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function ch64_lo(xh, xl, yh, yl, zh, zl) {
    var r2 = xl & yl ^ ~xl & zl;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function maj64_hi(xh, xl, yh, yl, zh) {
    var r2 = xh & yh ^ xh & zh ^ yh & zh;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function maj64_lo(xh, xl, yh, yl, zh, zl) {
    var r2 = xl & yl ^ xl & zl ^ yl & zl;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function s0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 28);
    var c1_hi = rotr64_hi(xl, xh, 2);
    var c2_hi = rotr64_hi(xl, xh, 7);
    var r2 = c0_hi ^ c1_hi ^ c2_hi;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function s0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 28);
    var c1_lo = rotr64_lo(xl, xh, 2);
    var c2_lo = rotr64_lo(xl, xh, 7);
    var r2 = c0_lo ^ c1_lo ^ c2_lo;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function s1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 14);
    var c1_hi = rotr64_hi(xh, xl, 18);
    var c2_hi = rotr64_hi(xl, xh, 9);
    var r2 = c0_hi ^ c1_hi ^ c2_hi;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function s1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 14);
    var c1_lo = rotr64_lo(xh, xl, 18);
    var c2_lo = rotr64_lo(xl, xh, 9);
    var r2 = c0_lo ^ c1_lo ^ c2_lo;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function g0_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 1);
    var c1_hi = rotr64_hi(xh, xl, 8);
    var c2_hi = shr64_hi(xh, xl, 7);
    var r2 = c0_hi ^ c1_hi ^ c2_hi;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function g0_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 1);
    var c1_lo = rotr64_lo(xh, xl, 8);
    var c2_lo = shr64_lo(xh, xl, 7);
    var r2 = c0_lo ^ c1_lo ^ c2_lo;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function g1_512_hi(xh, xl) {
    var c0_hi = rotr64_hi(xh, xl, 19);
    var c1_hi = rotr64_hi(xl, xh, 29);
    var c2_hi = shr64_hi(xh, xl, 6);
    var r2 = c0_hi ^ c1_hi ^ c2_hi;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  function g1_512_lo(xh, xl) {
    var c0_lo = rotr64_lo(xh, xl, 19);
    var c1_lo = rotr64_lo(xl, xh, 29);
    var c2_lo = shr64_lo(xh, xl, 6);
    var r2 = c0_lo ^ c1_lo ^ c2_lo;
    if (r2 < 0)
      r2 += 4294967296;
    return r2;
  }
  var utils$9 = utils$g;
  var SHA512 = _512;
  function SHA384() {
    if (!(this instanceof SHA384))
      return new SHA384();
    SHA512.call(this);
    this.h = [
      3418070365,
      3238371032,
      1654270250,
      914150663,
      2438529370,
      812702999,
      355462360,
      4144912697,
      1731405415,
      4290775857,
      2394180231,
      1750603025,
      3675008525,
      1694076839,
      1203062813,
      3204075428
    ];
  }
  utils$9.inherits(SHA384, SHA512);
  var _384 = SHA384;
  SHA384.blockSize = 1024;
  SHA384.outSize = 384;
  SHA384.hmacStrength = 192;
  SHA384.padLength = 128;
  SHA384.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$9.toHex32(this.h.slice(0, 12), "big");
    else
      return utils$9.split32(this.h.slice(0, 12), "big");
  };
  sha.sha1 = _1;
  sha.sha224 = _224;
  sha.sha256 = _256;
  sha.sha384 = _384;
  sha.sha512 = _512;
  var ripemd = {};
  var utils$8 = utils$g;
  var common = common$5;
  var rotl32 = utils$8.rotl32;
  var sum32 = utils$8.sum32;
  var sum32_3 = utils$8.sum32_3;
  var sum32_4 = utils$8.sum32_4;
  var BlockHash = common.BlockHash;
  function RIPEMD160() {
    if (!(this instanceof RIPEMD160))
      return new RIPEMD160();
    BlockHash.call(this);
    this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    this.endian = "little";
  }
  utils$8.inherits(RIPEMD160, BlockHash);
  ripemd.ripemd160 = RIPEMD160;
  RIPEMD160.blockSize = 512;
  RIPEMD160.outSize = 160;
  RIPEMD160.hmacStrength = 192;
  RIPEMD160.padLength = 64;
  RIPEMD160.prototype._update = function update(msg, start2) {
    var A = this.h[0];
    var B = this.h[1];
    var C = this.h[2];
    var D = this.h[3];
    var E = this.h[4];
    var Ah = A;
    var Bh = B;
    var Ch = C;
    var Dh = D;
    var Eh = E;
    for (var j = 0; j < 80; j++) {
      var T = sum32(
        rotl32(
          sum32_4(A, f(j, B, C, D), msg[r[j] + start2], K(j)),
          s[j]
        ),
        E
      );
      A = E;
      E = D;
      D = rotl32(C, 10);
      C = B;
      B = T;
      T = sum32(
        rotl32(
          sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start2], Kh(j)),
          sh[j]
        ),
        Eh
      );
      Ah = Eh;
      Eh = Dh;
      Dh = rotl32(Ch, 10);
      Ch = Bh;
      Bh = T;
    }
    T = sum32_3(this.h[1], C, Dh);
    this.h[1] = sum32_3(this.h[2], D, Eh);
    this.h[2] = sum32_3(this.h[3], E, Ah);
    this.h[3] = sum32_3(this.h[4], A, Bh);
    this.h[4] = sum32_3(this.h[0], B, Ch);
    this.h[0] = T;
  };
  RIPEMD160.prototype._digest = function digest(enc) {
    if (enc === "hex")
      return utils$8.toHex32(this.h, "little");
    else
      return utils$8.split32(this.h, "little");
  };
  function f(j, x, y, z) {
    if (j <= 15)
      return x ^ y ^ z;
    else if (j <= 31)
      return x & y | ~x & z;
    else if (j <= 47)
      return (x | ~y) ^ z;
    else if (j <= 63)
      return x & z | y & ~z;
    else
      return x ^ (y | ~z);
  }
  function K(j) {
    if (j <= 15)
      return 0;
    else if (j <= 31)
      return 1518500249;
    else if (j <= 47)
      return 1859775393;
    else if (j <= 63)
      return 2400959708;
    else
      return 2840853838;
  }
  function Kh(j) {
    if (j <= 15)
      return 1352829926;
    else if (j <= 31)
      return 1548603684;
    else if (j <= 47)
      return 1836072691;
    else if (j <= 63)
      return 2053994217;
    else
      return 0;
  }
  var r = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    7,
    4,
    13,
    1,
    10,
    6,
    15,
    3,
    12,
    0,
    9,
    5,
    2,
    14,
    11,
    8,
    3,
    10,
    14,
    4,
    9,
    15,
    8,
    1,
    2,
    7,
    0,
    6,
    13,
    11,
    5,
    12,
    1,
    9,
    11,
    10,
    0,
    8,
    12,
    4,
    13,
    3,
    7,
    15,
    14,
    5,
    6,
    2,
    4,
    0,
    5,
    9,
    7,
    12,
    2,
    10,
    14,
    1,
    3,
    8,
    11,
    6,
    15,
    13
  ];
  var rh = [
    5,
    14,
    7,
    0,
    9,
    2,
    11,
    4,
    13,
    6,
    15,
    8,
    1,
    10,
    3,
    12,
    6,
    11,
    3,
    7,
    0,
    13,
    5,
    10,
    14,
    15,
    8,
    12,
    4,
    9,
    1,
    2,
    15,
    5,
    1,
    3,
    7,
    14,
    6,
    9,
    11,
    8,
    12,
    2,
    10,
    0,
    4,
    13,
    8,
    6,
    4,
    1,
    3,
    11,
    15,
    0,
    5,
    12,
    2,
    13,
    9,
    7,
    10,
    14,
    12,
    15,
    10,
    4,
    1,
    5,
    8,
    7,
    6,
    2,
    13,
    14,
    0,
    3,
    9,
    11
  ];
  var s = [
    11,
    14,
    15,
    12,
    5,
    8,
    7,
    9,
    11,
    13,
    14,
    15,
    6,
    7,
    9,
    8,
    7,
    6,
    8,
    13,
    11,
    9,
    7,
    15,
    7,
    12,
    15,
    9,
    11,
    7,
    13,
    12,
    11,
    13,
    6,
    7,
    14,
    9,
    13,
    15,
    14,
    8,
    13,
    6,
    5,
    12,
    7,
    5,
    11,
    12,
    14,
    15,
    14,
    15,
    9,
    8,
    9,
    14,
    5,
    6,
    8,
    6,
    5,
    12,
    9,
    15,
    5,
    11,
    6,
    8,
    13,
    12,
    5,
    12,
    13,
    14,
    11,
    8,
    5,
    6
  ];
  var sh = [
    8,
    9,
    9,
    11,
    13,
    15,
    15,
    5,
    7,
    7,
    8,
    11,
    14,
    14,
    12,
    6,
    9,
    13,
    15,
    7,
    12,
    8,
    9,
    11,
    7,
    7,
    12,
    7,
    6,
    15,
    13,
    11,
    9,
    7,
    15,
    11,
    8,
    6,
    6,
    14,
    12,
    13,
    5,
    14,
    13,
    13,
    7,
    5,
    15,
    5,
    8,
    11,
    14,
    14,
    6,
    14,
    6,
    9,
    12,
    9,
    12,
    5,
    15,
    8,
    8,
    5,
    12,
    9,
    12,
    5,
    14,
    6,
    8,
    13,
    6,
    5,
    15,
    13,
    11,
    11
  ];
  var utils$7 = utils$g;
  var assert$7 = minimalisticAssert;
  function Hmac(hash2, key2, enc) {
    if (!(this instanceof Hmac))
      return new Hmac(hash2, key2, enc);
    this.Hash = hash2;
    this.blockSize = hash2.blockSize / 8;
    this.outSize = hash2.outSize / 8;
    this.inner = null;
    this.outer = null;
    this._init(utils$7.toArray(key2, enc));
  }
  var hmac = Hmac;
  Hmac.prototype._init = function init(key2) {
    if (key2.length > this.blockSize)
      key2 = new this.Hash().update(key2).digest();
    assert$7(key2.length <= this.blockSize);
    for (var i2 = key2.length; i2 < this.blockSize; i2++)
      key2.push(0);
    for (i2 = 0; i2 < key2.length; i2++)
      key2[i2] ^= 54;
    this.inner = new this.Hash().update(key2);
    for (i2 = 0; i2 < key2.length; i2++)
      key2[i2] ^= 106;
    this.outer = new this.Hash().update(key2);
  };
  Hmac.prototype.update = function update(msg, enc) {
    this.inner.update(msg, enc);
    return this;
  };
  Hmac.prototype.digest = function digest(enc) {
    this.outer.update(this.inner.digest());
    return this.outer.digest(enc);
  };
  (function(exports) {
    var hash2 = exports;
    hash2.utils = utils$g;
    hash2.common = common$5;
    hash2.sha = sha;
    hash2.ripemd = ripemd;
    hash2.hmac = hmac;
    hash2.sha1 = hash2.sha.sha1;
    hash2.sha256 = hash2.sha.sha256;
    hash2.sha224 = hash2.sha.sha224;
    hash2.sha384 = hash2.sha.sha384;
    hash2.sha512 = hash2.sha.sha512;
    hash2.ripemd160 = hash2.ripemd.ripemd160;
  })(hash$2);
  var secp256k1;
  var hasRequiredSecp256k1;
  function requireSecp256k1() {
    if (hasRequiredSecp256k1)
      return secp256k1;
    hasRequiredSecp256k1 = 1;
    secp256k1 = {
      doubles: {
        step: 4,
        points: [
          [
            "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
            "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
          ],
          [
            "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
            "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
          ],
          [
            "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
            "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
          ],
          [
            "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
            "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
          ],
          [
            "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
            "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
          ],
          [
            "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
            "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
          ],
          [
            "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
            "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
          ],
          [
            "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
            "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
          ],
          [
            "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
            "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
          ],
          [
            "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
            "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
          ],
          [
            "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
            "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
          ],
          [
            "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
            "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
          ],
          [
            "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
            "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
          ],
          [
            "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
            "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
          ],
          [
            "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
            "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
          ],
          [
            "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
            "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
          ],
          [
            "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
            "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
          ],
          [
            "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
            "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
          ],
          [
            "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
            "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
          ],
          [
            "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
            "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
          ],
          [
            "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
            "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
          ],
          [
            "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
            "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
          ],
          [
            "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
            "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
          ],
          [
            "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
            "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
          ],
          [
            "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
            "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
          ],
          [
            "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
            "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
          ],
          [
            "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
            "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
          ],
          [
            "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
            "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
          ],
          [
            "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
            "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
          ],
          [
            "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
            "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
          ],
          [
            "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
            "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
          ],
          [
            "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
            "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
          ],
          [
            "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
            "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
          ],
          [
            "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
            "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
          ],
          [
            "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
            "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
          ],
          [
            "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
            "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
          ],
          [
            "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
            "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
          ],
          [
            "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
            "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
          ],
          [
            "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
            "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
          ],
          [
            "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
            "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
          ],
          [
            "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
            "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
          ],
          [
            "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
            "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
          ],
          [
            "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
            "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
          ],
          [
            "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
            "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
          ],
          [
            "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
            "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
          ],
          [
            "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
            "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
          ],
          [
            "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
            "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
          ],
          [
            "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
            "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
          ],
          [
            "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
            "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
          ],
          [
            "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
            "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
          ],
          [
            "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
            "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
          ],
          [
            "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
            "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
          ],
          [
            "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
            "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
          ],
          [
            "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
            "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
          ],
          [
            "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
            "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
          ],
          [
            "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
            "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
          ],
          [
            "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
            "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
          ],
          [
            "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
            "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
          ],
          [
            "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
            "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
          ],
          [
            "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
            "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
          ],
          [
            "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
            "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
          ],
          [
            "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
            "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
          ],
          [
            "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
            "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
          ],
          [
            "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
            "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
          ],
          [
            "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
            "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
          ]
        ]
      },
      naf: {
        wnd: 7,
        points: [
          [
            "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
            "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
          ],
          [
            "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
            "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
          ],
          [
            "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
            "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
          ],
          [
            "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
            "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
          ],
          [
            "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
            "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
          ],
          [
            "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
            "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
          ],
          [
            "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
            "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
          ],
          [
            "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
            "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
          ],
          [
            "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
            "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
          ],
          [
            "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
            "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
          ],
          [
            "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
            "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
          ],
          [
            "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
            "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
          ],
          [
            "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
            "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
          ],
          [
            "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
            "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
          ],
          [
            "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
            "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
          ],
          [
            "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
            "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
          ],
          [
            "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
            "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
          ],
          [
            "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
            "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
          ],
          [
            "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
            "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
          ],
          [
            "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
            "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
          ],
          [
            "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
            "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
          ],
          [
            "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
            "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
          ],
          [
            "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
            "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
          ],
          [
            "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
            "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
          ],
          [
            "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
            "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
          ],
          [
            "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
            "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
          ],
          [
            "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
            "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
          ],
          [
            "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
            "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
          ],
          [
            "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
            "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
          ],
          [
            "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
            "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
          ],
          [
            "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
            "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
          ],
          [
            "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
            "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
          ],
          [
            "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
            "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
          ],
          [
            "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
            "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
          ],
          [
            "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
            "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
          ],
          [
            "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
            "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
          ],
          [
            "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
            "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
          ],
          [
            "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
            "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
          ],
          [
            "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
            "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
          ],
          [
            "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
            "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
          ],
          [
            "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
            "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
          ],
          [
            "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
            "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
          ],
          [
            "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
            "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
          ],
          [
            "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
            "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
          ],
          [
            "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
            "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
          ],
          [
            "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
            "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
          ],
          [
            "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
            "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
          ],
          [
            "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
            "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
          ],
          [
            "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
            "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
          ],
          [
            "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
            "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
          ],
          [
            "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
            "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
          ],
          [
            "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
            "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
          ],
          [
            "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
            "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
          ],
          [
            "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
            "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
          ],
          [
            "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
            "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
          ],
          [
            "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
            "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
          ],
          [
            "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
            "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
          ],
          [
            "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
            "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
          ],
          [
            "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
            "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
          ],
          [
            "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
            "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
          ],
          [
            "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
            "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
          ],
          [
            "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
            "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
          ],
          [
            "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
            "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
          ],
          [
            "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
            "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
          ],
          [
            "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
            "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
          ],
          [
            "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
            "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
          ],
          [
            "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
            "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
          ],
          [
            "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
            "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
          ],
          [
            "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
            "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
          ],
          [
            "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
            "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
          ],
          [
            "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
            "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
          ],
          [
            "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
            "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
          ],
          [
            "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
            "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
          ],
          [
            "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
            "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
          ],
          [
            "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
            "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
          ],
          [
            "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
            "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
          ],
          [
            "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
            "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
          ],
          [
            "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
            "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
          ],
          [
            "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
            "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
          ],
          [
            "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
            "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
          ],
          [
            "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
            "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
          ],
          [
            "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
            "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
          ],
          [
            "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
            "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
          ],
          [
            "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
            "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
          ],
          [
            "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
            "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
          ],
          [
            "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
            "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
          ],
          [
            "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
            "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
          ],
          [
            "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
            "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
          ],
          [
            "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
            "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
          ],
          [
            "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
            "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
          ],
          [
            "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
            "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
          ],
          [
            "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
            "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
          ],
          [
            "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
            "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
          ],
          [
            "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
            "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
          ],
          [
            "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
            "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
          ],
          [
            "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
            "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
          ],
          [
            "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
            "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
          ],
          [
            "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
            "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
          ],
          [
            "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
            "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
          ],
          [
            "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
            "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
          ],
          [
            "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
            "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
          ],
          [
            "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
            "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
          ],
          [
            "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
            "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
          ],
          [
            "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
            "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
          ],
          [
            "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
            "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
          ],
          [
            "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
            "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
          ],
          [
            "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
            "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
          ],
          [
            "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
            "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
          ],
          [
            "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
            "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
          ],
          [
            "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
            "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
          ],
          [
            "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
            "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
          ],
          [
            "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
            "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
          ],
          [
            "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
            "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
          ],
          [
            "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
            "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
          ],
          [
            "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
            "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
          ],
          [
            "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
            "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
          ],
          [
            "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
            "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
          ],
          [
            "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
            "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
          ],
          [
            "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
            "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
          ],
          [
            "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
            "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
          ],
          [
            "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
            "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
          ],
          [
            "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
            "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
          ],
          [
            "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
            "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
          ],
          [
            "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
            "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
          ],
          [
            "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
            "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
          ],
          [
            "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
            "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
          ],
          [
            "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
            "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
          ]
        ]
      }
    };
    return secp256k1;
  }
  (function(exports) {
    var curves2 = exports;
    var hash2 = hash$2;
    var curve$1 = curve;
    var utils2 = utils$m;
    var assert2 = utils2.assert;
    function PresetCurve(options) {
      if (options.type === "short")
        this.curve = new curve$1.short(options);
      else if (options.type === "edwards")
        this.curve = new curve$1.edwards(options);
      else
        this.curve = new curve$1.mont(options);
      this.g = this.curve.g;
      this.n = this.curve.n;
      this.hash = options.hash;
      assert2(this.g.validate(), "Invalid curve");
      assert2(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    curves2.PresetCurve = PresetCurve;
    function defineCurve(name2, options) {
      Object.defineProperty(curves2, name2, {
        configurable: true,
        enumerable: true,
        get: function() {
          var curve2 = new PresetCurve(options);
          Object.defineProperty(curves2, name2, {
            configurable: true,
            enumerable: true,
            value: curve2
          });
          return curve2;
        }
      });
    }
    defineCurve("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: hash2.sha256,
      gRed: false,
      g: [
        "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
        "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
      ]
    });
    defineCurve("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: hash2.sha256,
      gRed: false,
      g: [
        "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
        "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
      ]
    });
    defineCurve("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: hash2.sha256,
      gRed: false,
      g: [
        "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
        "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
      ]
    });
    defineCurve("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: hash2.sha384,
      gRed: false,
      g: [
        "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
        "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
      ]
    });
    defineCurve("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: hash2.sha512,
      gRed: false,
      g: [
        "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
        "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
      ]
    });
    defineCurve("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash2.sha256,
      gRed: false,
      g: [
        "9"
      ]
    });
    defineCurve("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      // -121665 * (121666^(-1)) (mod P)
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash2.sha256,
      gRed: false,
      g: [
        "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
        // 4/5
        "6666666666666666666666666666666666666666666666666666666666666658"
      ]
    });
    var pre;
    try {
      pre = requireSecp256k1();
    } catch (e) {
      pre = void 0;
    }
    defineCurve("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: hash2.sha256,
      // Precomputed endomorphism
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [
        {
          a: "3086d221a7d46bcde86c90e49284eb15",
          b: "-e4437ed6010e88286f547fa90abfe4c3"
        },
        {
          a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
          b: "3086d221a7d46bcde86c90e49284eb15"
        }
      ],
      gRed: false,
      g: [
        "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
        "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
        pre
      ]
    });
  })(curves$2);
  var hash$1 = hash$2;
  var utils$6 = utils$l;
  var assert$6 = minimalisticAssert;
  function HmacDRBG$1(options) {
    if (!(this instanceof HmacDRBG$1))
      return new HmacDRBG$1(options);
    this.hash = options.hash;
    this.predResist = !!options.predResist;
    this.outLen = this.hash.outSize;
    this.minEntropy = options.minEntropy || this.hash.hmacStrength;
    this._reseed = null;
    this.reseedInterval = null;
    this.K = null;
    this.V = null;
    var entropy = utils$6.toArray(options.entropy, options.entropyEnc || "hex");
    var nonce2 = utils$6.toArray(options.nonce, options.nonceEnc || "hex");
    var pers = utils$6.toArray(options.pers, options.persEnc || "hex");
    assert$6(
      entropy.length >= this.minEntropy / 8,
      "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    );
    this._init(entropy, nonce2, pers);
  }
  var hmacDrbg = HmacDRBG$1;
  HmacDRBG$1.prototype._init = function init(entropy, nonce2, pers) {
    var seed = entropy.concat(nonce2).concat(pers);
    this.K = new Array(this.outLen / 8);
    this.V = new Array(this.outLen / 8);
    for (var i2 = 0; i2 < this.V.length; i2++) {
      this.K[i2] = 0;
      this.V[i2] = 1;
    }
    this._update(seed);
    this._reseed = 1;
    this.reseedInterval = 281474976710656;
  };
  HmacDRBG$1.prototype._hmac = function hmac2() {
    return new hash$1.hmac(this.hash, this.K);
  };
  HmacDRBG$1.prototype._update = function update(seed) {
    var kmac = this._hmac().update(this.V).update([0]);
    if (seed)
      kmac = kmac.update(seed);
    this.K = kmac.digest();
    this.V = this._hmac().update(this.V).digest();
    if (!seed)
      return;
    this.K = this._hmac().update(this.V).update([1]).update(seed).digest();
    this.V = this._hmac().update(this.V).digest();
  };
  HmacDRBG$1.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
    if (typeof entropyEnc !== "string") {
      addEnc = add;
      add = entropyEnc;
      entropyEnc = null;
    }
    entropy = utils$6.toArray(entropy, entropyEnc);
    add = utils$6.toArray(add, addEnc);
    assert$6(
      entropy.length >= this.minEntropy / 8,
      "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
    );
    this._update(entropy.concat(add || []));
    this._reseed = 1;
  };
  HmacDRBG$1.prototype.generate = function generate(len2, enc, add, addEnc) {
    if (this._reseed > this.reseedInterval)
      throw new Error("Reseed is required");
    if (typeof enc !== "string") {
      addEnc = add;
      add = enc;
      enc = null;
    }
    if (add) {
      add = utils$6.toArray(add, addEnc || "hex");
      this._update(add);
    }
    var temp = [];
    while (temp.length < len2) {
      this.V = this._hmac().update(this.V).digest();
      temp = temp.concat(this.V);
    }
    var res = temp.slice(0, len2);
    this._update(add);
    this._reseed++;
    return utils$6.encode(res, enc);
  };
  var BN$4 = bnExports;
  var utils$5 = utils$m;
  var assert$5 = utils$5.assert;
  function KeyPair$3(ec2, options) {
    this.ec = ec2;
    this.priv = null;
    this.pub = null;
    if (options.priv)
      this._importPrivate(options.priv, options.privEnc);
    if (options.pub)
      this._importPublic(options.pub, options.pubEnc);
  }
  var key$2 = KeyPair$3;
  KeyPair$3.fromPublic = function fromPublic(ec2, pub, enc) {
    if (pub instanceof KeyPair$3)
      return pub;
    return new KeyPair$3(ec2, {
      pub,
      pubEnc: enc
    });
  };
  KeyPair$3.fromPrivate = function fromPrivate(ec2, priv, enc) {
    if (priv instanceof KeyPair$3)
      return priv;
    return new KeyPair$3(ec2, {
      priv,
      privEnc: enc
    });
  };
  KeyPair$3.prototype.validate = function validate() {
    var pub = this.getPublic();
    if (pub.isInfinity())
      return { result: false, reason: "Invalid public key" };
    if (!pub.validate())
      return { result: false, reason: "Public key is not a point" };
    if (!pub.mul(this.ec.curve.n).isInfinity())
      return { result: false, reason: "Public key * N != O" };
    return { result: true, reason: null };
  };
  KeyPair$3.prototype.getPublic = function getPublic(compact, enc) {
    if (typeof compact === "string") {
      enc = compact;
      compact = null;
    }
    if (!this.pub)
      this.pub = this.ec.g.mul(this.priv);
    if (!enc)
      return this.pub;
    return this.pub.encode(enc, compact);
  };
  KeyPair$3.prototype.getPrivate = function getPrivate(enc) {
    if (enc === "hex")
      return this.priv.toString(16, 2);
    else
      return this.priv;
  };
  KeyPair$3.prototype._importPrivate = function _importPrivate(key2, enc) {
    this.priv = new BN$4(key2, enc || 16);
    this.priv = this.priv.umod(this.ec.curve.n);
  };
  KeyPair$3.prototype._importPublic = function _importPublic(key2, enc) {
    if (key2.x || key2.y) {
      if (this.ec.curve.type === "mont") {
        assert$5(key2.x, "Need x coordinate");
      } else if (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") {
        assert$5(key2.x && key2.y, "Need both x and y coordinate");
      }
      this.pub = this.ec.curve.point(key2.x, key2.y);
      return;
    }
    this.pub = this.ec.curve.decodePoint(key2, enc);
  };
  KeyPair$3.prototype.derive = function derive(pub) {
    if (!pub.validate()) {
      assert$5(pub.validate(), "public point not validated");
    }
    return pub.mul(this.priv).getX();
  };
  KeyPair$3.prototype.sign = function sign(msg, enc, options) {
    return this.ec.sign(msg, this, enc, options);
  };
  KeyPair$3.prototype.verify = function verify(msg, signature2) {
    return this.ec.verify(msg, signature2, this);
  };
  KeyPair$3.prototype.inspect = function inspect() {
    return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
  };
  var BN$3 = bnExports;
  var utils$4 = utils$m;
  var assert$4 = utils$4.assert;
  function Signature$3(options, enc) {
    if (options instanceof Signature$3)
      return options;
    if (this._importDER(options, enc))
      return;
    assert$4(options.r && options.s, "Signature without r or s");
    this.r = new BN$3(options.r, 16);
    this.s = new BN$3(options.s, 16);
    if (options.recoveryParam === void 0)
      this.recoveryParam = null;
    else
      this.recoveryParam = options.recoveryParam;
  }
  var signature$1 = Signature$3;
  function Position() {
    this.place = 0;
  }
  function getLength(buf, p) {
    var initial = buf[p.place++];
    if (!(initial & 128)) {
      return initial;
    }
    var octetLen = initial & 15;
    if (octetLen === 0 || octetLen > 4) {
      return false;
    }
    var val = 0;
    for (var i2 = 0, off = p.place; i2 < octetLen; i2++, off++) {
      val <<= 8;
      val |= buf[off];
      val >>>= 0;
    }
    if (val <= 127) {
      return false;
    }
    p.place = off;
    return val;
  }
  function rmPadding(buf) {
    var i2 = 0;
    var len2 = buf.length - 1;
    while (!buf[i2] && !(buf[i2 + 1] & 128) && i2 < len2) {
      i2++;
    }
    if (i2 === 0) {
      return buf;
    }
    return buf.slice(i2);
  }
  Signature$3.prototype._importDER = function _importDER(data, enc) {
    data = utils$4.toArray(data, enc);
    var p = new Position();
    if (data[p.place++] !== 48) {
      return false;
    }
    var len2 = getLength(data, p);
    if (len2 === false) {
      return false;
    }
    if (len2 + p.place !== data.length) {
      return false;
    }
    if (data[p.place++] !== 2) {
      return false;
    }
    var rlen = getLength(data, p);
    if (rlen === false) {
      return false;
    }
    var r2 = data.slice(p.place, rlen + p.place);
    p.place += rlen;
    if (data[p.place++] !== 2) {
      return false;
    }
    var slen = getLength(data, p);
    if (slen === false) {
      return false;
    }
    if (data.length !== slen + p.place) {
      return false;
    }
    var s2 = data.slice(p.place, slen + p.place);
    if (r2[0] === 0) {
      if (r2[1] & 128) {
        r2 = r2.slice(1);
      } else {
        return false;
      }
    }
    if (s2[0] === 0) {
      if (s2[1] & 128) {
        s2 = s2.slice(1);
      } else {
        return false;
      }
    }
    this.r = new BN$3(r2);
    this.s = new BN$3(s2);
    this.recoveryParam = null;
    return true;
  };
  function constructLength(arr, len2) {
    if (len2 < 128) {
      arr.push(len2);
      return;
    }
    var octets = 1 + (Math.log(len2) / Math.LN2 >>> 3);
    arr.push(octets | 128);
    while (--octets) {
      arr.push(len2 >>> (octets << 3) & 255);
    }
    arr.push(len2);
  }
  Signature$3.prototype.toDER = function toDER(enc) {
    var r2 = this.r.toArray();
    var s2 = this.s.toArray();
    if (r2[0] & 128)
      r2 = [0].concat(r2);
    if (s2[0] & 128)
      s2 = [0].concat(s2);
    r2 = rmPadding(r2);
    s2 = rmPadding(s2);
    while (!s2[0] && !(s2[1] & 128)) {
      s2 = s2.slice(1);
    }
    var arr = [2];
    constructLength(arr, r2.length);
    arr = arr.concat(r2);
    arr.push(2);
    constructLength(arr, s2.length);
    var backHalf = arr.concat(s2);
    var res = [48];
    constructLength(res, backHalf.length);
    res = res.concat(backHalf);
    return utils$4.encode(res, enc);
  };
  var BN$2 = bnExports;
  var HmacDRBG = hmacDrbg;
  var utils$3 = utils$m;
  var curves$1 = curves$2;
  var rand = brorandExports;
  var assert$3 = utils$3.assert;
  var KeyPair$2 = key$2;
  var Signature$2 = signature$1;
  function EC$1(options) {
    if (!(this instanceof EC$1))
      return new EC$1(options);
    if (typeof options === "string") {
      assert$3(
        Object.prototype.hasOwnProperty.call(curves$1, options),
        "Unknown curve " + options
      );
      options = curves$1[options];
    }
    if (options instanceof curves$1.PresetCurve)
      options = { curve: options };
    this.curve = options.curve.curve;
    this.n = this.curve.n;
    this.nh = this.n.ushrn(1);
    this.g = this.curve.g;
    this.g = options.curve.g;
    this.g.precompute(options.curve.n.bitLength() + 1);
    this.hash = options.hash || options.curve.hash;
  }
  var ec$1 = EC$1;
  EC$1.prototype.keyPair = function keyPair(options) {
    return new KeyPair$2(this, options);
  };
  EC$1.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
    return KeyPair$2.fromPrivate(this, priv, enc);
  };
  EC$1.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
    return KeyPair$2.fromPublic(this, pub, enc);
  };
  EC$1.prototype.genKeyPair = function genKeyPair(options) {
    if (!options)
      options = {};
    var drbg = new HmacDRBG({
      hash: this.hash,
      pers: options.pers,
      persEnc: options.persEnc || "utf8",
      entropy: options.entropy || rand(this.hash.hmacStrength),
      entropyEnc: options.entropy && options.entropyEnc || "utf8",
      nonce: this.n.toArray()
    });
    var bytes = this.n.byteLength();
    var ns2 = this.n.sub(new BN$2(2));
    for (; ; ) {
      var priv = new BN$2(drbg.generate(bytes));
      if (priv.cmp(ns2) > 0)
        continue;
      priv.iaddn(1);
      return this.keyFromPrivate(priv);
    }
  };
  EC$1.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
    var delta = msg.byteLength() * 8 - this.n.bitLength();
    if (delta > 0)
      msg = msg.ushrn(delta);
    if (!truncOnly && msg.cmp(this.n) >= 0)
      return msg.sub(this.n);
    else
      return msg;
  };
  EC$1.prototype.sign = function sign(msg, key2, enc, options) {
    if (typeof enc === "object") {
      options = enc;
      enc = null;
    }
    if (!options)
      options = {};
    key2 = this.keyFromPrivate(key2, enc);
    msg = this._truncateToN(new BN$2(msg, 16));
    var bytes = this.n.byteLength();
    var bkey = key2.getPrivate().toArray("be", bytes);
    var nonce2 = msg.toArray("be", bytes);
    var drbg = new HmacDRBG({
      hash: this.hash,
      entropy: bkey,
      nonce: nonce2,
      pers: options.pers,
      persEnc: options.persEnc || "utf8"
    });
    var ns1 = this.n.sub(new BN$2(1));
    for (var iter = 0; ; iter++) {
      var k = options.k ? options.k(iter) : new BN$2(drbg.generate(this.n.byteLength()));
      k = this._truncateToN(k, true);
      if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
        continue;
      var kp = this.g.mul(k);
      if (kp.isInfinity())
        continue;
      var kpX = kp.getX();
      var r2 = kpX.umod(this.n);
      if (r2.cmpn(0) === 0)
        continue;
      var s2 = k.invm(this.n).mul(r2.mul(key2.getPrivate()).iadd(msg));
      s2 = s2.umod(this.n);
      if (s2.cmpn(0) === 0)
        continue;
      var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r2) !== 0 ? 2 : 0);
      if (options.canonical && s2.cmp(this.nh) > 0) {
        s2 = this.n.sub(s2);
        recoveryParam ^= 1;
      }
      return new Signature$2({ r: r2, s: s2, recoveryParam });
    }
  };
  EC$1.prototype.verify = function verify(msg, signature2, key2, enc) {
    msg = this._truncateToN(new BN$2(msg, 16));
    key2 = this.keyFromPublic(key2, enc);
    signature2 = new Signature$2(signature2, "hex");
    var r2 = signature2.r;
    var s2 = signature2.s;
    if (r2.cmpn(1) < 0 || r2.cmp(this.n) >= 0)
      return false;
    if (s2.cmpn(1) < 0 || s2.cmp(this.n) >= 0)
      return false;
    var sinv = s2.invm(this.n);
    var u1 = sinv.mul(msg).umod(this.n);
    var u2 = sinv.mul(r2).umod(this.n);
    var p;
    if (!this.curve._maxwellTrick) {
      p = this.g.mulAdd(u1, key2.getPublic(), u2);
      if (p.isInfinity())
        return false;
      return p.getX().umod(this.n).cmp(r2) === 0;
    }
    p = this.g.jmulAdd(u1, key2.getPublic(), u2);
    if (p.isInfinity())
      return false;
    return p.eqXToP(r2);
  };
  EC$1.prototype.recoverPubKey = function(msg, signature2, j, enc) {
    assert$3((3 & j) === j, "The recovery param is more than two bits");
    signature2 = new Signature$2(signature2, enc);
    var n = this.n;
    var e = new BN$2(msg);
    var r2 = signature2.r;
    var s2 = signature2.s;
    var isYOdd = j & 1;
    var isSecondKey = j >> 1;
    if (r2.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
      throw new Error("Unable to find sencond key candinate");
    if (isSecondKey)
      r2 = this.curve.pointFromX(r2.add(this.curve.n), isYOdd);
    else
      r2 = this.curve.pointFromX(r2, isYOdd);
    var rInv = signature2.r.invm(n);
    var s1 = n.sub(e).mul(rInv).umod(n);
    var s22 = s2.mul(rInv).umod(n);
    return this.g.mulAdd(s1, r2, s22);
  };
  EC$1.prototype.getKeyRecoveryParam = function(e, signature2, Q, enc) {
    signature2 = new Signature$2(signature2, enc);
    if (signature2.recoveryParam !== null)
      return signature2.recoveryParam;
    for (var i2 = 0; i2 < 4; i2++) {
      var Qprime;
      try {
        Qprime = this.recoverPubKey(e, signature2, i2);
      } catch (e2) {
        continue;
      }
      if (Qprime.eq(Q))
        return i2;
    }
    throw new Error("Unable to find valid recovery factor");
  };
  var utils$2 = utils$m;
  var assert$2 = utils$2.assert;
  var parseBytes$2 = utils$2.parseBytes;
  var cachedProperty$1 = utils$2.cachedProperty;
  function KeyPair$1(eddsa2, params) {
    this.eddsa = eddsa2;
    this._secret = parseBytes$2(params.secret);
    if (eddsa2.isPoint(params.pub))
      this._pub = params.pub;
    else
      this._pubBytes = parseBytes$2(params.pub);
  }
  KeyPair$1.fromPublic = function fromPublic(eddsa2, pub) {
    if (pub instanceof KeyPair$1)
      return pub;
    return new KeyPair$1(eddsa2, { pub });
  };
  KeyPair$1.fromSecret = function fromSecret(eddsa2, secret) {
    if (secret instanceof KeyPair$1)
      return secret;
    return new KeyPair$1(eddsa2, { secret });
  };
  KeyPair$1.prototype.secret = function secret() {
    return this._secret;
  };
  cachedProperty$1(KeyPair$1, "pubBytes", function pubBytes() {
    return this.eddsa.encodePoint(this.pub());
  });
  cachedProperty$1(KeyPair$1, "pub", function pub() {
    if (this._pubBytes)
      return this.eddsa.decodePoint(this._pubBytes);
    return this.eddsa.g.mul(this.priv());
  });
  cachedProperty$1(KeyPair$1, "privBytes", function privBytes() {
    var eddsa2 = this.eddsa;
    var hash2 = this.hash();
    var lastIx = eddsa2.encodingLength - 1;
    var a = hash2.slice(0, eddsa2.encodingLength);
    a[0] &= 248;
    a[lastIx] &= 127;
    a[lastIx] |= 64;
    return a;
  });
  cachedProperty$1(KeyPair$1, "priv", function priv() {
    return this.eddsa.decodeInt(this.privBytes());
  });
  cachedProperty$1(KeyPair$1, "hash", function hash2() {
    return this.eddsa.hash().update(this.secret()).digest();
  });
  cachedProperty$1(KeyPair$1, "messagePrefix", function messagePrefix() {
    return this.hash().slice(this.eddsa.encodingLength);
  });
  KeyPair$1.prototype.sign = function sign(message2) {
    assert$2(this._secret, "KeyPair can only verify");
    return this.eddsa.sign(message2, this);
  };
  KeyPair$1.prototype.verify = function verify(message2, sig) {
    return this.eddsa.verify(message2, sig, this);
  };
  KeyPair$1.prototype.getSecret = function getSecret(enc) {
    assert$2(this._secret, "KeyPair is public only");
    return utils$2.encode(this.secret(), enc);
  };
  KeyPair$1.prototype.getPublic = function getPublic(enc) {
    return utils$2.encode(this.pubBytes(), enc);
  };
  var key$1 = KeyPair$1;
  var BN$1 = bnExports;
  var utils$1 = utils$m;
  var assert$1 = utils$1.assert;
  var cachedProperty = utils$1.cachedProperty;
  var parseBytes$1 = utils$1.parseBytes;
  function Signature$1(eddsa2, sig) {
    this.eddsa = eddsa2;
    if (typeof sig !== "object")
      sig = parseBytes$1(sig);
    if (Array.isArray(sig)) {
      sig = {
        R: sig.slice(0, eddsa2.encodingLength),
        S: sig.slice(eddsa2.encodingLength)
      };
    }
    assert$1(sig.R && sig.S, "Signature without R or S");
    if (eddsa2.isPoint(sig.R))
      this._R = sig.R;
    if (sig.S instanceof BN$1)
      this._S = sig.S;
    this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
    this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
  }
  cachedProperty(Signature$1, "S", function S() {
    return this.eddsa.decodeInt(this.Sencoded());
  });
  cachedProperty(Signature$1, "R", function R() {
    return this.eddsa.decodePoint(this.Rencoded());
  });
  cachedProperty(Signature$1, "Rencoded", function Rencoded() {
    return this.eddsa.encodePoint(this.R());
  });
  cachedProperty(Signature$1, "Sencoded", function Sencoded() {
    return this.eddsa.encodeInt(this.S());
  });
  Signature$1.prototype.toBytes = function toBytes() {
    return this.Rencoded().concat(this.Sencoded());
  };
  Signature$1.prototype.toHex = function toHex2() {
    return utils$1.encode(this.toBytes(), "hex").toUpperCase();
  };
  var signature = Signature$1;
  var hash = hash$2;
  var curves = curves$2;
  var utils = utils$m;
  var assert = utils.assert;
  var parseBytes = utils.parseBytes;
  var KeyPair = key$1;
  var Signature = signature;
  function EDDSA(curve2) {
    assert(curve2 === "ed25519", "only tested with ed25519 so far");
    if (!(this instanceof EDDSA))
      return new EDDSA(curve2);
    curve2 = curves[curve2].curve;
    this.curve = curve2;
    this.g = curve2.g;
    this.g.precompute(curve2.n.bitLength() + 1);
    this.pointClass = curve2.point().constructor;
    this.encodingLength = Math.ceil(curve2.n.bitLength() / 8);
    this.hash = hash.sha512;
  }
  var eddsa = EDDSA;
  EDDSA.prototype.sign = function sign(message2, secret) {
    message2 = parseBytes(message2);
    var key2 = this.keyFromSecret(secret);
    var r2 = this.hashInt(key2.messagePrefix(), message2);
    var R = this.g.mul(r2);
    var Rencoded = this.encodePoint(R);
    var s_ = this.hashInt(Rencoded, key2.pubBytes(), message2).mul(key2.priv());
    var S = r2.add(s_).umod(this.curve.n);
    return this.makeSignature({ R, S, Rencoded });
  };
  EDDSA.prototype.verify = function verify(message2, sig, pub) {
    message2 = parseBytes(message2);
    sig = this.makeSignature(sig);
    var key2 = this.keyFromPublic(pub);
    var h = this.hashInt(sig.Rencoded(), key2.pubBytes(), message2);
    var SG = this.g.mul(sig.S());
    var RplusAh = sig.R().add(key2.pub().mul(h));
    return RplusAh.eq(SG);
  };
  EDDSA.prototype.hashInt = function hashInt() {
    var hash2 = this.hash();
    for (var i2 = 0; i2 < arguments.length; i2++)
      hash2.update(arguments[i2]);
    return utils.intFromLE(hash2.digest()).umod(this.curve.n);
  };
  EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
    return KeyPair.fromPublic(this, pub);
  };
  EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
    return KeyPair.fromSecret(this, secret);
  };
  EDDSA.prototype.makeSignature = function makeSignature(sig) {
    if (sig instanceof Signature)
      return sig;
    return new Signature(this, sig);
  };
  EDDSA.prototype.encodePoint = function encodePoint(point) {
    var enc = point.getY().toArray("le", this.encodingLength);
    enc[this.encodingLength - 1] |= point.getX().isOdd() ? 128 : 0;
    return enc;
  };
  EDDSA.prototype.decodePoint = function decodePoint(bytes) {
    bytes = utils.parseBytes(bytes);
    var lastIx = bytes.length - 1;
    var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~128);
    var xIsOdd = (bytes[lastIx] & 128) !== 0;
    var y = utils.intFromLE(normed);
    return this.curve.pointFromY(y, xIsOdd);
  };
  EDDSA.prototype.encodeInt = function encodeInt(num) {
    return num.toArray("le", this.encodingLength);
  };
  EDDSA.prototype.decodeInt = function decodeInt(bytes) {
    return utils.intFromLE(bytes);
  };
  EDDSA.prototype.isPoint = function isPoint(val) {
    return val instanceof this.pointClass;
  };
  (function(exports) {
    var elliptic2 = exports;
    elliptic2.version = require$$0$1.version;
    elliptic2.utils = utils$m;
    elliptic2.rand = brorandExports;
    elliptic2.curve = curve;
    elliptic2.curves = curves$2;
    elliptic2.ec = ec$1;
    elliptic2.eddsa = eddsa;
  })(elliptic$2);
  const EC = elliptic$2.ec;
  const ec = new EC("secp256k1");
  const ecparams = ec.curve;
  const BN = ecparams.n.constructor;
  function loadCompressedPublicKey(first, xbuf) {
    let x = new BN(xbuf);
    if (x.cmp(ecparams.p) >= 0)
      return null;
    x = x.toRed(ecparams.red);
    let y = x.redSqr().redIMul(x).redIAdd(ecparams.b).redSqrt();
    if (first === 3 !== y.isOdd())
      y = y.redNeg();
    return ec.keyPair({ pub: { x, y } });
  }
  function loadUncompressedPublicKey(first, xbuf, ybuf) {
    let x = new BN(xbuf);
    let y = new BN(ybuf);
    if (x.cmp(ecparams.p) >= 0 || y.cmp(ecparams.p) >= 0)
      return null;
    x = x.toRed(ecparams.red);
    y = y.toRed(ecparams.red);
    if ((first === 6 || first === 7) && y.isOdd() !== (first === 7))
      return null;
    const x3 = x.redSqr().redIMul(x);
    if (!y.redSqr().redISub(x3.redIAdd(ecparams.b)).isZero())
      return null;
    return ec.keyPair({ pub: { x, y } });
  }
  function loadPublicKey(pubkey) {
    const first = pubkey[0];
    switch (first) {
      case 2:
      case 3:
        if (pubkey.length !== 33)
          return null;
        return loadCompressedPublicKey(first, pubkey.subarray(1, 33));
      case 4:
      case 6:
      case 7:
        if (pubkey.length !== 65)
          return null;
        return loadUncompressedPublicKey(first, pubkey.subarray(1, 33), pubkey.subarray(33, 65));
      default:
        return null;
    }
  }
  function savePublicKey(output, point) {
    const pubkey = point.encode(null, output.length === 33);
    for (let i2 = 0; i2 < output.length; ++i2)
      output[i2] = pubkey[i2];
  }
  var elliptic$1 = {
    contextRandomize() {
      return 0;
    },
    privateKeyVerify(seckey) {
      const bn2 = new BN(seckey);
      return bn2.cmp(ecparams.n) < 0 && !bn2.isZero() ? 0 : 1;
    },
    privateKeyNegate(seckey) {
      const bn2 = new BN(seckey);
      const negate = ecparams.n.sub(bn2).umod(ecparams.n).toArrayLike(Uint8Array, "be", 32);
      seckey.set(negate);
      return 0;
    },
    privateKeyTweakAdd(seckey, tweak) {
      const bn2 = new BN(tweak);
      if (bn2.cmp(ecparams.n) >= 0)
        return 1;
      bn2.iadd(new BN(seckey));
      if (bn2.cmp(ecparams.n) >= 0)
        bn2.isub(ecparams.n);
      if (bn2.isZero())
        return 1;
      const tweaked = bn2.toArrayLike(Uint8Array, "be", 32);
      seckey.set(tweaked);
      return 0;
    },
    privateKeyTweakMul(seckey, tweak) {
      let bn2 = new BN(tweak);
      if (bn2.cmp(ecparams.n) >= 0 || bn2.isZero())
        return 1;
      bn2.imul(new BN(seckey));
      if (bn2.cmp(ecparams.n) >= 0)
        bn2 = bn2.umod(ecparams.n);
      const tweaked = bn2.toArrayLike(Uint8Array, "be", 32);
      seckey.set(tweaked);
      return 0;
    },
    publicKeyVerify(pubkey) {
      const pair = loadPublicKey(pubkey);
      return pair === null ? 1 : 0;
    },
    publicKeyCreate(output, seckey) {
      const bn2 = new BN(seckey);
      if (bn2.cmp(ecparams.n) >= 0 || bn2.isZero())
        return 1;
      const point = ec.keyFromPrivate(seckey).getPublic();
      savePublicKey(output, point);
      return 0;
    },
    publicKeyConvert(output, pubkey) {
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 1;
      const point = pair.getPublic();
      savePublicKey(output, point);
      return 0;
    },
    publicKeyNegate(output, pubkey) {
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 1;
      const point = pair.getPublic();
      point.y = point.y.redNeg();
      savePublicKey(output, point);
      return 0;
    },
    publicKeyCombine(output, pubkeys) {
      const pairs = new Array(pubkeys.length);
      for (let i2 = 0; i2 < pubkeys.length; ++i2) {
        pairs[i2] = loadPublicKey(pubkeys[i2]);
        if (pairs[i2] === null)
          return 1;
      }
      let point = pairs[0].getPublic();
      for (let i2 = 1; i2 < pairs.length; ++i2)
        point = point.add(pairs[i2].pub);
      if (point.isInfinity())
        return 2;
      savePublicKey(output, point);
      return 0;
    },
    publicKeyTweakAdd(output, pubkey, tweak) {
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 1;
      tweak = new BN(tweak);
      if (tweak.cmp(ecparams.n) >= 0)
        return 2;
      const point = pair.getPublic().add(ecparams.g.mul(tweak));
      if (point.isInfinity())
        return 2;
      savePublicKey(output, point);
      return 0;
    },
    publicKeyTweakMul(output, pubkey, tweak) {
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 1;
      tweak = new BN(tweak);
      if (tweak.cmp(ecparams.n) >= 0 || tweak.isZero())
        return 2;
      const point = pair.getPublic().mul(tweak);
      savePublicKey(output, point);
      return 0;
    },
    signatureNormalize(sig) {
      const r2 = new BN(sig.subarray(0, 32));
      const s2 = new BN(sig.subarray(32, 64));
      if (r2.cmp(ecparams.n) >= 0 || s2.cmp(ecparams.n) >= 0)
        return 1;
      if (s2.cmp(ec.nh) === 1) {
        sig.set(ecparams.n.sub(s2).toArrayLike(Uint8Array, "be", 32), 32);
      }
      return 0;
    },
    // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
    // Adapted for Uint8Array instead Buffer
    signatureExport(obj, sig) {
      const sigR = sig.subarray(0, 32);
      const sigS = sig.subarray(32, 64);
      if (new BN(sigR).cmp(ecparams.n) >= 0)
        return 1;
      if (new BN(sigS).cmp(ecparams.n) >= 0)
        return 1;
      const { output } = obj;
      let r2 = output.subarray(4, 4 + 33);
      r2[0] = 0;
      r2.set(sigR, 1);
      let lenR = 33;
      let posR = 0;
      for (; lenR > 1 && r2[posR] === 0 && !(r2[posR + 1] & 128); --lenR, ++posR)
        ;
      r2 = r2.subarray(posR);
      if (r2[0] & 128)
        return 1;
      if (lenR > 1 && r2[0] === 0 && !(r2[1] & 128))
        return 1;
      let s2 = output.subarray(6 + 33, 6 + 33 + 33);
      s2[0] = 0;
      s2.set(sigS, 1);
      let lenS = 33;
      let posS = 0;
      for (; lenS > 1 && s2[posS] === 0 && !(s2[posS + 1] & 128); --lenS, ++posS)
        ;
      s2 = s2.subarray(posS);
      if (s2[0] & 128)
        return 1;
      if (lenS > 1 && s2[0] === 0 && !(s2[1] & 128))
        return 1;
      obj.outputlen = 6 + lenR + lenS;
      output[0] = 48;
      output[1] = obj.outputlen - 2;
      output[2] = 2;
      output[3] = r2.length;
      output.set(r2, 4);
      output[4 + lenR] = 2;
      output[5 + lenR] = s2.length;
      output.set(s2, 6 + lenR);
      return 0;
    },
    // Copied 1-to-1 from https://github.com/bitcoinjs/bip66/blob/master/index.js
    // Adapted for Uint8Array instead Buffer
    signatureImport(output, sig) {
      if (sig.length < 8)
        return 1;
      if (sig.length > 72)
        return 1;
      if (sig[0] !== 48)
        return 1;
      if (sig[1] !== sig.length - 2)
        return 1;
      if (sig[2] !== 2)
        return 1;
      const lenR = sig[3];
      if (lenR === 0)
        return 1;
      if (5 + lenR >= sig.length)
        return 1;
      if (sig[4 + lenR] !== 2)
        return 1;
      const lenS = sig[5 + lenR];
      if (lenS === 0)
        return 1;
      if (6 + lenR + lenS !== sig.length)
        return 1;
      if (sig[4] & 128)
        return 1;
      if (lenR > 1 && sig[4] === 0 && !(sig[5] & 128))
        return 1;
      if (sig[lenR + 6] & 128)
        return 1;
      if (lenS > 1 && sig[lenR + 6] === 0 && !(sig[lenR + 7] & 128))
        return 1;
      let sigR = sig.subarray(4, 4 + lenR);
      if (sigR.length === 33 && sigR[0] === 0)
        sigR = sigR.subarray(1);
      if (sigR.length > 32)
        return 1;
      let sigS = sig.subarray(6 + lenR);
      if (sigS.length === 33 && sigS[0] === 0)
        sigS = sigS.slice(1);
      if (sigS.length > 32)
        throw new Error("S length is too long");
      let r2 = new BN(sigR);
      if (r2.cmp(ecparams.n) >= 0)
        r2 = new BN(0);
      let s2 = new BN(sig.subarray(6 + lenR));
      if (s2.cmp(ecparams.n) >= 0)
        s2 = new BN(0);
      output.set(r2.toArrayLike(Uint8Array, "be", 32), 0);
      output.set(s2.toArrayLike(Uint8Array, "be", 32), 32);
      return 0;
    },
    ecdsaSign(obj, message2, seckey, data, noncefn) {
      if (noncefn) {
        const _noncefn = noncefn;
        noncefn = (counter) => {
          const nonce2 = _noncefn(message2, seckey, null, data, counter);
          const isValid = nonce2 instanceof Uint8Array && nonce2.length === 32;
          if (!isValid)
            throw new Error("This is the way");
          return new BN(nonce2);
        };
      }
      const d = new BN(seckey);
      if (d.cmp(ecparams.n) >= 0 || d.isZero())
        return 1;
      let sig;
      try {
        sig = ec.sign(message2, seckey, { canonical: true, k: noncefn, pers: data });
      } catch (err) {
        return 1;
      }
      obj.signature.set(sig.r.toArrayLike(Uint8Array, "be", 32), 0);
      obj.signature.set(sig.s.toArrayLike(Uint8Array, "be", 32), 32);
      obj.recid = sig.recoveryParam;
      return 0;
    },
    ecdsaVerify(sig, msg32, pubkey) {
      const sigObj = { r: sig.subarray(0, 32), s: sig.subarray(32, 64) };
      const sigr = new BN(sigObj.r);
      const sigs = new BN(sigObj.s);
      if (sigr.cmp(ecparams.n) >= 0 || sigs.cmp(ecparams.n) >= 0)
        return 1;
      if (sigs.cmp(ec.nh) === 1 || sigr.isZero() || sigs.isZero())
        return 3;
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 2;
      const point = pair.getPublic();
      const isValid = ec.verify(msg32, sigObj, point);
      return isValid ? 0 : 3;
    },
    ecdsaRecover(output, sig, recid, msg32) {
      const sigObj = { r: sig.slice(0, 32), s: sig.slice(32, 64) };
      const sigr = new BN(sigObj.r);
      const sigs = new BN(sigObj.s);
      if (sigr.cmp(ecparams.n) >= 0 || sigs.cmp(ecparams.n) >= 0)
        return 1;
      if (sigr.isZero() || sigs.isZero())
        return 2;
      let point;
      try {
        point = ec.recoverPubKey(msg32, sigObj, recid);
      } catch (err) {
        return 2;
      }
      savePublicKey(output, point);
      return 0;
    },
    ecdh(output, pubkey, seckey, data, hashfn, xbuf, ybuf) {
      const pair = loadPublicKey(pubkey);
      if (pair === null)
        return 1;
      const scalar = new BN(seckey);
      if (scalar.cmp(ecparams.n) >= 0 || scalar.isZero())
        return 2;
      const point = pair.getPublic().mul(scalar);
      if (hashfn === void 0) {
        const data2 = point.encode(null, true);
        const sha2562 = ec.hash().update(data2).digest();
        for (let i2 = 0; i2 < 32; ++i2)
          output[i2] = sha2562[i2];
      } else {
        if (!xbuf)
          xbuf = new Uint8Array(32);
        const x = point.getX().toArray("be", 32);
        for (let i2 = 0; i2 < 32; ++i2)
          xbuf[i2] = x[i2];
        if (!ybuf)
          ybuf = new Uint8Array(32);
        const y = point.getY().toArray("be", 32);
        for (let i2 = 0; i2 < 32; ++i2)
          ybuf[i2] = y[i2];
        const hash2 = hashfn(xbuf, ybuf, data);
        const isValid = hash2 instanceof Uint8Array && hash2.length === output.length;
        if (!isValid)
          return 2;
        output.set(hash2);
      }
      return 0;
    }
  };
  var elliptic = lib(elliptic$1);
  var Buffer2 = {};
  var base64Js = {};
  base64Js.byteLength = byteLength;
  base64Js.toByteArray = toByteArray;
  base64Js.fromByteArray = fromByteArray;
  var lookup = [];
  var revLookup = [];
  var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
  function getLens(b64) {
    var len2 = b64.length;
    if (len2 % 4 > 0) {
      throw new Error("Invalid string. Length must be a multiple of 4");
    }
    var validLen = b64.indexOf("=");
    if (validLen === -1)
      validLen = len2;
    var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
    return [validLen, placeHoldersLen];
  }
  function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
  }
  function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i2;
    for (i2 = 0; i2 < len2; i2 += 4) {
      tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
      arr[curByte++] = tmp >> 16 & 255;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
      tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
      arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
      tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
      arr[curByte++] = tmp >> 8 & 255;
      arr[curByte++] = tmp & 255;
    }
    return arr;
  }
  function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
  }
  function encodeChunk(uint8, start2, end) {
    var tmp;
    var output = [];
    for (var i2 = start2; i2 < end; i2 += 3) {
      tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
      output.push(tripletToBase64(tmp));
    }
    return output.join("");
  }
  function fromByteArray(uint8) {
    var tmp;
    var len2 = uint8.length;
    var extraBytes = len2 % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
      parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
    }
    if (extraBytes === 1) {
      tmp = uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
      );
    } else if (extraBytes === 2) {
      tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
      parts.push(
        lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
      );
    }
    return parts.join("");
  }
  var ieee754 = {};
  /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
  ieee754.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i2 = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s2 = buffer[offset + i2];
    i2 += d;
    e = s2 & (1 << -nBits) - 1;
    s2 >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i2], i2 += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i2], i2 += d, nBits -= 8) {
    }
    if (e === 0) {
      e = 1 - eBias;
    } else if (e === eMax) {
      return m ? NaN : (s2 ? -1 : 1) * Infinity;
    } else {
      m = m + Math.pow(2, mLen);
      e = e - eBias;
    }
    return (s2 ? -1 : 1) * m * Math.pow(2, e - mLen);
  };
  ieee754.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i2 = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s2 = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0;
      e = eMax;
    } else {
      e = Math.floor(Math.log(value) / Math.LN2);
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--;
        c *= 2;
      }
      if (e + eBias >= 1) {
        value += rt / c;
      } else {
        value += rt * Math.pow(2, 1 - eBias);
      }
      if (value * c >= 2) {
        e++;
        c /= 2;
      }
      if (e + eBias >= eMax) {
        m = 0;
        e = eMax;
      } else if (e + eBias >= 1) {
        m = (value * c - 1) * Math.pow(2, mLen);
        e = e + eBias;
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
        e = 0;
      }
    }
    for (; mLen >= 8; buffer[offset + i2] = m & 255, i2 += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i2] = e & 255, i2 += d, e /= 256, eLen -= 8) {
    }
    buffer[offset + i2 - d] |= s2 * 128;
  };
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  (function(exports) {
    const base64 = base64Js;
    const ieee754$1 = ieee754;
    const customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    const K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this))
          return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this))
          return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b)
        return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength2(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i2 = 0; i2 < length; i2 += 1) {
        buf[i2] = array[i2] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy2 = new Uint8Array(arrayView);
        return fromArrayBuffer(copy2.buffer, copy2.byteOffset, copy2.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len2 = checked(obj.length) | 0;
        const buf = createBuffer(len2);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len2);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array))
        a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array))
        b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b)
        return 0;
      let x = a.length;
      let y = b.length;
      for (let i2 = 0, len2 = Math.min(x, y); i2 < len2; ++i2) {
        if (a[i2] !== b[i2]) {
          x = a[i2];
          y = b[i2];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i2;
      if (length === void 0) {
        length = 0;
        for (i2 = 0; i2 < list.length; ++i2) {
          length += list[i2].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i2 = 0; i2 < list.length; ++i2) {
        let buf = list[i2];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf))
              buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength2(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len2 = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len2 === 0)
        return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len2;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len2 * 2;
          case "hex":
            return len2 >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength2;
    function slowToString(encoding, start2, end) {
      let loweredCase = false;
      if (start2 === void 0 || start2 < 0) {
        start2 = 0;
      }
      if (start2 > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start2 >>>= 0;
      if (end <= start2) {
        return "";
      }
      if (!encoding)
        encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start2, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start2, end);
          case "ascii":
            return asciiSlice(this, start2, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start2, end);
          case "base64":
            return base64Slice(this, start2, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start2, end);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i2 = b[n];
      b[n] = b[m];
      b[m] = i2;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len2 = this.length;
      if (len2 % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i2 = 0; i2 < len2; i2 += 2) {
        swap(this, i2, i2 + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len2 = this.length;
      if (len2 % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i2 = 0; i2 < len2; i2 += 4) {
        swap(this, i2, i2 + 3);
        swap(this, i2 + 1, i2 + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len2 = this.length;
      if (len2 % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i2 = 0; i2 < len2; i2 += 8) {
        swap(this, i2, i2 + 7);
        swap(this, i2 + 1, i2 + 6);
        swap(this, i2 + 2, i2 + 5);
        swap(this, i2 + 3, i2 + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString2() {
      const length = this.length;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max)
        str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start2, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start2 === void 0) {
        start2 = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start2 < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start2 >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start2 >= end) {
        return 1;
      }
      start2 >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      let x = thisEnd - thisStart;
      let y = end - start2;
      const len2 = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start2, end);
      for (let i2 = 0; i2 < len2; ++i2) {
        if (thisCopy[i2] !== targetCopy[i2]) {
          x = thisCopy[i2];
          y = targetCopy[i2];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0)
        return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir)
          return -1;
        else
          byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir)
          byteOffset = 0;
        else
          return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i3) {
        if (indexSize === 1) {
          return buf[i3];
        } else {
          return buf.readUInt16BE(i3 * indexSize);
        }
      }
      let i2;
      if (dir) {
        let foundIndex = -1;
        for (i2 = byteOffset; i2 < arrLength; i2++) {
          if (read(arr, i2) === read(val, foundIndex === -1 ? 0 : i2 - foundIndex)) {
            if (foundIndex === -1)
              foundIndex = i2;
            if (i2 - foundIndex + 1 === valLength)
              return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1)
              i2 -= i2 - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength)
          byteOffset = arrLength - valLength;
        for (i2 = byteOffset; i2 >= 0; i2--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i2 + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found)
            return i2;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i2;
      for (i2 = 0; i2 < length; ++i2) {
        const parsed = parseInt(string.substr(i2 * 2, 2), 16);
        if (numberIsNaN(parsed))
          return i2;
        buf[offset + i2] = parsed;
      }
      return i2;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start2, end) {
      if (start2 === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start2, end));
      }
    }
    function utf8Slice(buf, start2, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i2 = start2;
      while (i2 < end) {
        const firstByte = buf[i2];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i2 + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i2 + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i2 + 1];
              thirdByte = buf[i2 + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i2 + 1];
              thirdByte = buf[i2 + 2];
              fourthByte = buf[i2 + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i2 += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    const MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len2 = codePoints.length;
      if (len2 <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i2 = 0;
      while (i2 < len2) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i2, i2 += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start2, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i2 = start2; i2 < end; ++i2) {
        ret += String.fromCharCode(buf[i2] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start2, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i2 = start2; i2 < end; ++i2) {
        ret += String.fromCharCode(buf[i2]);
      }
      return ret;
    }
    function hexSlice(buf, start2, end) {
      const len2 = buf.length;
      if (!start2 || start2 < 0)
        start2 = 0;
      if (!end || end < 0 || end > len2)
        end = len2;
      let out = "";
      for (let i2 = start2; i2 < end; ++i2) {
        out += hexSliceLookupTable[buf[i2]];
      }
      return out;
    }
    function utf16leSlice(buf, start2, end) {
      const bytes = buf.slice(start2, end);
      let res = "";
      for (let i2 = 0; i2 < bytes.length - 1; i2 += 2) {
        res += String.fromCharCode(bytes[i2] + bytes[i2 + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start2, end) {
      const len2 = this.length;
      start2 = ~~start2;
      end = end === void 0 ? len2 : ~~end;
      if (start2 < 0) {
        start2 += len2;
        if (start2 < 0)
          start2 = 0;
      } else if (start2 > len2) {
        start2 = len2;
      }
      if (end < 0) {
        end += len2;
        if (end < 0)
          end = 0;
      } else if (end > len2) {
        end = len2;
      }
      if (end < start2)
        end = start2;
      const newBuf = this.subarray(start2, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0)
        throw new RangeError("offset is not uint");
      if (offset + ext > length)
        throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength3, this.length);
      let val = this[offset];
      let mul = 1;
      let i2 = 0;
      while (++i2 < byteLength3 && (mul *= 256)) {
        val += this[offset + i2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength3, this.length);
      }
      let val = this[offset + --byteLength3];
      let mul = 1;
      while (byteLength3 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength3] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength3, this.length);
      let val = this[offset];
      let mul = 1;
      let i2 = 0;
      while (++i2 < byteLength3 && (mul *= 256)) {
        val += this[offset + i2] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength3);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength3, noAssert) {
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert)
        checkOffset(offset, byteLength3, this.length);
      let i2 = byteLength3;
      let mul = 1;
      let val = this[offset + --i2];
      while (i2 > 0 && (mul *= 256)) {
        val += this[offset + --i2] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength3);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return ieee754$1.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return ieee754$1.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
        checkInt(this, value, offset, byteLength3, maxBytes, 0);
      }
      let mul = 1;
      let i2 = 0;
      this[offset] = value & 255;
      while (++i2 < byteLength3 && (mul *= 256)) {
        this[offset + i2] = value / mul & 255;
      }
      return offset + byteLength3;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength3 = byteLength3 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength3) - 1;
        checkInt(this, value, offset, byteLength3, maxBytes, 0);
      }
      let i2 = byteLength3 - 1;
      let mul = 1;
      this[offset + i2] = value & 255;
      while (--i2 >= 0 && (mul *= 256)) {
        this[offset + i2] = value / mul & 255;
      }
      return offset + byteLength3;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength3 - 1);
        checkInt(this, value, offset, byteLength3, limit - 1, -limit);
      }
      let i2 = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i2 < byteLength3 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i2 - 1] !== 0) {
          sub = 1;
        }
        this[offset + i2] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength3;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength3, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength3 - 1);
        checkInt(this, value, offset, byteLength3, limit - 1, -limit);
      }
      let i2 = byteLength3 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i2] = value & 255;
      while (--i2 >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i2 + 1] !== 0) {
          sub = 1;
        }
        this[offset + i2] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength3;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length)
        throw new RangeError("Index out of range");
      if (offset < 0)
        throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4);
      }
      ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8);
      }
      ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy2(target, targetStart, start2, end) {
      if (!Buffer3.isBuffer(target))
        throw new TypeError("argument should be a Buffer");
      if (!start2)
        start2 = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start2)
        end = start2;
      if (end === start2)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start2 < 0 || start2 >= this.length)
        throw new RangeError("Index out of range");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start2) {
        end = target.length - targetStart + start2;
      }
      const len2 = end - start2;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start2, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start2, end),
          targetStart
        );
      }
      return len2;
    };
    Buffer3.prototype.fill = function fill(val, start2, end, encoding) {
      if (typeof val === "string") {
        if (typeof start2 === "string") {
          encoding = start2;
          start2 = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code2 = val.charCodeAt(0);
          if (encoding === "utf8" && code2 < 128 || encoding === "latin1") {
            val = code2;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start2 < 0 || this.length < start2 || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start2) {
        return this;
      }
      start2 = start2 >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      let i2;
      if (typeof val === "number") {
        for (i2 = start2; i2 < end; ++i2) {
          this[i2] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len2 = bytes.length;
        if (len2 === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i2 = 0; i2 < end - start2; ++i2) {
          this[i2 + start2] = bytes[i2 % len2];
        }
      }
      return this;
    };
    const errors2 = {};
    function E(sym, getMessage, Base2) {
      errors2[sym] = class NodeError extends Base2 {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name2) {
        if (name2) {
          return `${name2} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name2, actual) {
        return `The "${name2}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i2 = val.length;
      const start2 = val[0] === "-" ? 1 : 0;
      for (; i2 >= start2 + 4; i2 -= 3) {
        res = `_${val.slice(i2 - 3, i2)}${res}`;
      }
      return `${val.slice(0, i2)}${res}`;
    }
    function checkBounds(buf, offset, byteLength3) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength3] === void 0) {
        boundsError(offset, buf.length - (byteLength3 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength3) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength3 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength3 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength3 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength3 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors2.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength3);
    }
    function validateNumber(value, name2) {
      if (typeof value !== "number") {
        throw new errors2.ERR_INVALID_ARG_TYPE(name2, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors2.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors2.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors2.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2)
        return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i2 = 0; i2 < length; ++i2) {
        codePoint = string.charCodeAt(i2);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            } else if (i2 + 1 === length) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0)
            break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0)
            break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0)
            break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0)
            break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i2 = 0; i2 < str.length; ++i2) {
        byteArray.push(str.charCodeAt(i2) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i2 = 0; i2 < str.length; ++i2) {
        if ((units -= 2) < 0)
          break;
        c = str.charCodeAt(i2);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i2;
      for (i2 = 0; i2 < length; ++i2) {
        if (i2 + offset >= dst.length || i2 >= src.length)
          break;
        dst[i2 + offset] = src[i2];
      }
      return i2;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    const hexSliceLookupTable = function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i2 = 0; i2 < 16; ++i2) {
        const i16 = i2 * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i2] + alphabet[j];
        }
      }
      return table;
    }();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  })(Buffer2);
  const sha256 = SHA256$2();
  const bf = Buffer2.Buffer;
  var nonce = 0;
  var t;
  var key = "你好,罗根";
  function fu() {
    return typeof t === "function";
  }
  function generatePrivKey(id) {
    let privKey;
    let random = md5(id + randomString(16));
    do {
      privKey = bf.from(random);
    } while (!elliptic.privateKeyVerify(privKey));
    return {
      key: id,
      iv: privKey
    };
  }
  function toString(appId, deviceId, userId, nonce2) {
    let str = fu() && t.toString().indexOf(key) !== -1 ? `${appId}:${deviceId}:${userId}:${nonce2}` : `${appId}:${userId}:${nonce2}:${deviceId}`;
    let digest = sha256.update(str).digest();
    return bf.from(digest);
  }
  function toHex(arr) {
    return uint8Array(new Uint8Array(arr));
  }
  function uint8Array(uint8Array2) {
    return Array.prototype.map.call(uint8Array2, (x) => ("00" + x.toString(16)).slice(-2)).join("");
  }
  function randomString(len2) {
    len2 = len2 || 10;
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var str = "";
    for (var i2 = 0; i2 < len2; i2++) {
      var index = Math.floor(Math.random() * chars.length);
      str += chars.charAt(index);
    }
    return str;
  }
  function session(that, appId, deviceId, userId) {
    if (typeof that !== "function") {
      return "";
    }
    t = that;
    console.log("%c 你好，罗根 create_session", "color:red");
    let buf = toString(appId, deviceId, userId, nonce);
    const key2 = generatePrivKey(userId);
    let un = new Uint8Array(65);
    elliptic.publicKeyCreate(key2.iv, false, un);
    const pubStrHex = uint8Array(un);
    const sigObj = elliptic.ecdsaSign(buf, key2.iv);
    let msgHex = toHex(sigObj.signature);
    nonce++;
    that(key2.key, pubStrHex, msgHex + "01", deviceId);
  }
  const session$1 = (call) => {
    unsafeWindow.luoGenSession = function(that, appId, deviceId, userId) {
      let nav = window.navigator;
      let d = deviceId + nav.appCodeName + nav.appName + nav.appVersion;
      d = md5(d);
      session(that, appId, d, userId);
    };
    call && call();
  };
  const ConfigSessionDialog_vue_vue_type_style_index_0_scoped_4f08e60f_lang = "";
  const _withScopeId = (n) => (vue.pushScopeId("data-v-4f08e60f"), n = n(), vue.popScopeId(), n);
  const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("br", null, null, -1));
  const _hoisted_10 = { class: "dialog-footer" };
  const _sfc_main = {
    __name: "ConfigSessionDialog",
    setup(__props) {
      const dialogFormVisible = vue.ref(true);
      const form = vue.reactive({
        deviceName: "",
        modelName: ""
      });
      vue.onMounted(async () => {
        form.deviceName = getBrowserName() + "浏览器";
        form.modelName = getOperatingSystem() + "网页版";
      });
      function getOperatingSystem() {
        const platform = window.navigator.platform;
        const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
        if (windowsPlatforms.indexOf(platform) !== -1) {
          return "Windows";
        } else {
          return "Not Windows";
        }
      }
      function getBrowserName() {
        var ua = navigator.userAgent;
        var tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i);
        if (/trident/i.test(M[1])) {
          return "IE";
        }
        if (M[1] === "Chrome") {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
          if (tem != null)
            return tem[1].replace("OPR", "Opera");
        }
        return M[1];
      }
      function configAgree() {
        if (form.deviceName == "" || form.modelName == "") {
          elementPlus.ElMessage("浏览器名称 或 设备名称不能为空");
          return;
        }
        store.setItem("deviceName", form.deviceName);
        store.setItem("modelName", form.modelName);
        monkeyWindow.location.href = window.location.href;
      }
      vue.onUnmounted(() => {
        console.log("文件下载窗口关闭");
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(elementPlus.ElDialog), {
          "show-close": false,
          "close-on-click-modal": false,
          "close-on-press-escape": false,
          modelValue: dialogFormVisible.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogFormVisible.value = $event),
          title: "设备名额权限申请"
        }, {
          footer: vue.withCtx(() => [
            vue.createElementVNode("span", _hoisted_10, [
              vue.createVNode(vue.unref(elementPlus.ElButton), {
                type: "primary",
                onClick: configAgree
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 同意 ")
                ]),
                _: 1
              })
            ])
          ]),
          default: vue.withCtx(() => [
            vue.createElementVNode("span", null, [
              vue.createTextVNode(" 因权限问题，需要占用一个登录设备名额，请您放心，并不是真的登录，您的每一个操作都没有经过第三方服务器，本脚本根本没有数据非法登录您的账号，更不会擅自获取您的隐私。"),
              _hoisted_1,
              vue.createTextVNode(" 且本脚本已经开源所有代码，欢迎检查是否有后门程序，也欢迎您为本脚本提交更多有趣的功能。 "),
              vue.createVNode(vue.unref(elementPlus.ElLink), {
                href: "https://github.com/wyndem/ali-video",
                target: "_blank"
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("👉查看开源地址")
                ]),
                _: 1
              }),
              _hoisted_2,
              _hoisted_3,
              vue.createTextVNode(" 如果您还不放心，请卸载本脚本。原因为：没有权限，无法正常使用该脚本。"),
              _hoisted_4,
              _hoisted_5,
              vue.createTextVNode(" 脚本以下功能需要用到： 文件遍历、文件直链、视频解析、分享视频2分钟限制、后缀名称修改、最近在看功能 等。"),
              _hoisted_6,
              _hoisted_7,
              vue.createTextVNode(" 下面是占用设备的浏览器名称和设备名称，如果对默认值不满意，可以现在修改它 ")
            ]),
            _hoisted_8,
            _hoisted_9,
            vue.createVNode(vue.unref(elementPlus.ElForm), { model: form }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(elementPlus.ElFormItem), {
                  label: "浏览器名称",
                  "label-width": _ctx.formLabelWidth
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(elementPlus.ElInput), {
                      modelValue: form.deviceName,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.deviceName = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }, 8, ["label-width"]),
                vue.createVNode(vue.unref(elementPlus.ElFormItem), {
                  label: "设备名称",
                  "label-width": _ctx.formLabelWidth
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(elementPlus.ElInput), {
                      modelValue: form.modelName,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.modelName = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }, 8, ["label-width"])
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const ConfigSessionDialog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4f08e60f"]]);
  function start() {
    let token = user.getToken();
    if (token == null) {
      elementPlus.ElMessage("阿里云盘助手：末登录，请登陆后使用");
      user.clearAll();
      return;
    }
    apiConfig();
    console.log(`${"\n"} %c ali.video.user.js v${"2.1.9"} 罗根大人 %c https://greasyfork.org/zh-CN/scripts/458626  ${"\n"}${"\n"}`, "color: #fadfa3; background: #030307; padding:5px 0;", "background: #fadfa3; padding:5px 0;");
    if (user.isConfigSession() == false) {
      let app = vue.createApp(ConfigSessionDialog);
      app.mount(
        (() => {
          const app2 = document.createElement("div");
          $2("body").append(app2);
          return app2;
        })()
      );
    } else {
      listen();
      session$1(function() {
        run();
      });
      ui();
    }
    function run(val) {
      $2(function() {
        var versionRegex = /\/(\d+\.\d+\.\d+)/;
        var scriptSrc = $2('script[src*="bundle.js"]').attr("src");
        var match = scriptSrc.match(versionRegex);
        var version2 = match ? match[1] : null;
        console.log("UI版本: " + version2);
        if (version2 == "4.6.0") {
          elementPlus.ElMessageBox.confirm("目前版本不兼容老版本UI,点击按钮安装兼容版本:v2.1.2?", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showClose: false
          }).then(() => {
            var url = "https://greasyfork.org/zh-CN/scripts/458626?version=1219577";
            window.open(url, "_blank");
          }).catch(() => {
          });
        }
      });
      setInterval(user.refSession, 3e5);
      user.refSession();
      elementPlus.ElMessage({
        message: "阿里云助手加载成功",
        type: "success"
      });
    }
  }
  start();
})(ElementPlus, $, axios, Vue, Hls, Artplayer);
