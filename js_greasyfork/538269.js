// ==UserScript==
// @name               youtube-comment-censor-detector
// @name:zh-CN         YouTube发评反诈
// @name:zh-TW         YouTube發評反詐
// @namespace          npm/vite-plugin-monkey
// @version            2.5.6
// @author             freedom-introvert
// @description        A real-time comment checker, Fuck YouTube’s opaque comment censorship
// @description:zh-CN  Fuck YouTube版“阿瓦隆系统”，实时检查评论状态，防止评论被儿童偷偷误食你还被蒙在鼓里
// @description:zh-TW  Fuck YouTube版“阿瓦隆系統”，即時檢查評論狀態，防止評論被兒童偷偷誤食你還被蒙在鼓裡
// @license            GPL
// @icon               https://raw.githubusercontent.com/freedom-introvert/youtube-comment-censor-detector/refs/heads/main/logo/logo_256x256.avif
// @match              *://*.youtube.com/*
// @require            https://cdn.jsdelivr.net/npm/vue@3.5.15/dist/vue.global.prod.js
// @require            https://unpkg.com/vue-demi@latest/lib/index.iife.js
// @require            data:application/javascript,window.Vue%3DVue%3B
// @require            https://cdn.jsdelivr.net/npm/element-plus@2.9.11/dist/index.full.min.js
// @resource           element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.9.11/dist/index.css
// @grant              GM_addStyle
// @grant              GM_getResourceText
// @grant              GM_registerMenuCommand
// @grant              unsafeWindow
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/538269/youtube-comment-censor-detector.user.js
// @updateURL https://update.greasyfork.org/scripts/538269/youtube-comment-censor-detector.meta.js
// ==/UserScript==

(a=>{if(typeof GM_addStyle=="function"){GM_addStyle(a);return}const t=document.createElement("style");t.textContent=a,document.head.append(t)})(" .el-message,.is-message-box{z-index:9999!important}.comment-checker[data-v-684910ce]{font-size:12px}.container[data-v-684910ce]{width:80%;margin:0 auto}.comment-checker[data-v-684910ce]{padding:15px 15px 11px;border-radius:8px;transition:background-color .3s}.title[data-v-684910ce]{font-weight:700;margin-bottom:6px}.message[data-v-684910ce]{margin-bottom:10px}.el-progress[data-v-684910ce]{margin-bottom:4px}.buttons[data-v-684910ce]>[data-v-684910ce]{display:inline-flex;align-items:center;padding:4px 8px;margin-left:-8px;color:#4b5e9d;border-radius:4px;transition:background-color .2s,color .2s;-webkit-user-select:none;user-select:none;margin-right:10px}.buttons[data-v-684910ce]>[data-v-684910ce]:hover{background-color:#0000000d}.buttons[data-v-684910ce]>[data-v-684910ce]:active{background-color:#0000001a}.comment-checker.not-check[data-v-684910ce]{background-color:#00f3}.comment-checker.normal[data-v-684910ce]{background-color:#0f03}.comment-checker.deleted[data-v-684910ce]{background-color:#f003}.comment-checker.shadow-ban[data-v-684910ce]{background-color:#ff03}.hot-ban-checker[data-v-e5341f8d]{background-color:#007bff1a;border:1px solid rgba(0,60,136,.4);border-radius:6px;padding:1rem;margin:10px 0}.title[data-v-e5341f8d]{font-weight:700;margin-bottom:6px}.message[data-v-e5341f8d]{margin-bottom:10px}.actions[data-v-e5341f8d]{margin-top:10px}.buttons[data-v-e5341f8d]>[data-v-e5341f8d]{display:inline-flex;align-items:center;padding:4px 8px;margin-left:-8px;color:#4b5e9d;border-radius:4px;transition:background-color .2s,color .2s;-webkit-user-select:none;user-select:none;margin-right:10px}.buttons[data-v-e5341f8d]>[data-v-e5341f8d]:hover{background-color:#0000000d}.buttons[data-v-e5341f8d]>[data-v-e5341f8d]:active{background-color:#0000001a}.pagination[data-v-80f074da]{margin-top:6px}.detail[data-v-80f074da]{margin-left:10px}.info-table td[data-v-80f074da]:nth-child(1){white-space:nowrap;vertical-align:top}.info-table td[data-v-80f074da]:nth-child(2){padding-left:16px}.comment-content[data-v-80f074da]{white-space:break-spaces}summary[data-v-80f074da]{cursor:pointer;margin-top:2px;-webkit-user-select:none;user-select:none}.locate-link[data-v-80f074da]{width:100%}[data-v-80f074da] .locate-link>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.post-locate-link[data-v-80f074da]{font-size:10px}.youtube-comment[data-v-2a518d4b]{display:flex;align-items:flex-start;padding:16px;gap:16px;font-family:Roboto,sans-serif}.avatar-container[data-v-2a518d4b]{flex-shrink:0}.avatar[data-v-2a518d4b]{width:40px;height:40px;border-radius:50%;object-fit:cover}.comment-content[data-v-2a518d4b]{flex:1;display:flex;flex-direction:column;gap:4px}.comment-header[data-v-2a518d4b]{display:flex;align-items:center;gap:8px}.author-name[data-v-2a518d4b]{font-size:13px;font-weight:500;color:#000;text-decoration:none;transition:color .2s ease}.published-at[data-v-2a518d4b]{font-size:12px;color:#aaa}.comment-text[data-v-2a518d4b]{font-size:14px;line-height:1.5;white-space:pre-wrap;word-break:break-word;margin:0}.comment-actions[data-v-2a518d4b]{display:flex;align-items:center;gap:8px;margin-top:8px}.button[data-v-2a518d4b]{display:flex;align-items:center;gap:4px;background-color:transparent;border:none;cursor:pointer;color:#aaa;font-size:12px;transition:color .2s ease;text-decoration:none;padding:1px 6px}.button[data-v-2a518d4b]:hover{color:#f1f1f1}.icon[data-v-2a518d4b]{width:16px;height:16px;fill:currentColor}.action-text[data-v-2a518d4b]{line-height:100%}.hot-ban-comment-searcher[data-v-3991f641],.not-comment-section[data-v-3991f641]{height:100%}.warning[data-v-3991f641]{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%}.search-progress[data-v-3991f641]{display:flex;height:100%;flex-direction:column;justify-content:center;align-items:center;gap:15px}.warning-title[data-v-3991f641]{margin-bottom:4px}.warning-text[data-v-3991f641]{text-align:center;max-width:500px}.warning-divider[data-v-3991f641]{max-width:800px}.el-progress[data-v-3991f641]{width:300px}.footer[data-v-3991f641]{display:flex;flex-direction:column;align-items:center}.settings-container[data-v-ccc2713e]{padding:16px}.title[data-v-ccc2713e]{font-size:20px;font-weight:600;margin-bottom:20px}.setting-item[data-v-ccc2713e]{display:flex;justify-content:space-between;align-items:center;margin:16px 0}.setting-info[data-v-ccc2713e]{max-width:80%}.setting-label[data-v-ccc2713e]{font-size:16px;font-weight:500}.setting-desc[data-v-ccc2713e]{font-size:13px;color:#888;margin-top:4px}[data-v-5edab8f6] .dialog-body{height:calc(100% - 40px);display:flex;flex-direction:column} ");

(function (vue, ElementPlus) {
  'use strict';

  function sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function urlSafeBase64ToStandard(urlSafeBase64) {
    let standardBase64 = urlSafeBase64.replace(/%3D/g, "=").replace(/-/g, "+").replace(/_/g, "/");
    return standardBase64;
  }
  function standardBase64ToUrlSafe(standardBase64) {
    let urlSafeBase64 = standardBase64.replace(/=/g, "%3D").replace(/\+/g, "-").replace(/\//g, "_");
    return urlSafeBase64;
  }
  function base64ToU8Array(base642, urlSafe = true) {
    if (urlSafe) {
      base642 = urlSafeBase64ToStandard(base642);
    }
    return Uint8Array.from(atob(base642), (c) => c.charCodeAt(0));
  }
  function u8ArrayToBase64(u8Array, urlSafe = true) {
    let base642 = btoa(String.fromCharCode(...u8Array));
    if (urlSafe) {
      base642 = standardBase64ToUrlSafe(base642);
    }
    return base642;
  }
  function createUrl(path) {
    if (path) {
      return new URL(new URL(window.location.href).origin + path);
    }
    return new URL(window.location.href);
  }
  function formatSecondsToMMSS(seconds) {
    const sec = parseInt(seconds, 10);
    const minutes = Math.floor(sec / 60);
    const remainingSeconds = sec % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  function formatTimestamp(timestamp) {
    if (!timestamp) {
      return "--:--:--";
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function translateState(state) {
    switch (state) {
      case "NORMAL":
        return "正常";
      case "DELETED":
        return "已删除";
      case "SHADOW_BAN":
        return "仅自己可见";
      case "NOT_CHECK":
        return "还未检查";
    }
  }
  function findValueInSingleEntryArray(data, key) {
    for (const item of data) {
      if (item.hasOwnProperty(key)) {
        return item[key];
      }
    }
    return void 0;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$5 = { class: "title" };
  const _hoisted_2$5 = { class: "message" };
  const _hoisted_3$5 = { key: 0 };
  const _hoisted_4$4 = { class: "message" };
  const _hoisted_5$3 = { class: "buttons" };
  const maxTimeSec = 120;
  const _sfc_main$6 = {
    __name: "CommentChecker",
    setup(__props) {
      const check2 = vue.inject("check");
      const hotBanCheck2 = vue.inject("hotBanCheck");
      const commentRecord = vue.inject("commentRecord");
      const onClose = vue.inject("onClose");
      const onUnblock = vue.inject("onUnblock");
      const interval = vue.inject("interval");
      const showCancelButton = vue.ref(true);
      const showConfirmButton = vue.ref(false);
      const showCloseButton = vue.ref(false);
      const showHotBanCheckButton = vue.ref(false);
      const showStopHotBanCheckButton = vue.ref(false);
      const showLetMeAccessButtton = vue.ref(false);
      const showHotBanChecker = vue.ref(false);
      const stateClass = vue.ref("not-check");
      const title = vue.ref("等待检查中……");
      const message = vue.ref("");
      const messageByHotCheck = vue.ref("等待检查中……");
      let completed = false;
      let netErr = false;
      let hotBanCheckerController = {
        isCancelled: false
      };
      let skipHotBanCheckWait = false;
      const stripedFlow = vue.ref(false);
      const currentTimeSec = vue.ref(0);
      const percentage = vue.computed(() => {
        if (currentTimeSec.value < 0 || currentTimeSec.value > maxTimeSec) {
          return 100;
        } else {
          return currentTimeSec.value / maxTimeSec * 100;
        }
      });
      function format() {
        if (currentTimeSec.value < 0) {
          return `--:-- / ${formatSecondsToMMSS(maxTimeSec)}`;
        } else {
          return `${formatSecondsToMMSS(currentTimeSec.value)} / ${formatSecondsToMMSS(maxTimeSec)}`;
        }
      }
      let shown = null;
      let startTime = Date.now() / 1e3;
      async function startCheck() {
        while (currentTimeSec.value < maxTimeSec || netErr) {
          if (!netErr) {
            for (let i = interval; i > 0; i--) {
              message.value = "等待 " + i + "s 后检查评论状态";
              await sleep(1e3);
              currentTimeSec.value = Date.now() / 1e3 - startTime;
              if (completed) {
                onStateCheckComplete();
                return;
              }
            }
          } else {
            currentTimeSec.value = Date.now() / 1e3 - startTime;
            if (completed) {
              onStateCheckComplete();
              return;
            }
          }
          message.value = "检查评论状态中……";
          stripedFlow.value = true;
          try {
            await check2(commentRecord);
          } catch (err) {
            netErr = true;
            title.value = "网络错误，获取当前状态失败";
            showConfirmButton.value = false;
            showCloseButton.value = true;
            stripedFlow.value = false;
            console.error(err);
            continue;
          }
          netErr = false;
          showCancelButton.value = false;
          showCloseButton.value = false;
          stripedFlow.value = false;
          if (commentRecord.currentState == "NORMAL") {
            title.value = "当前状态：正常";
            stateClass.value = "normal";
            shown = commentRecord.currentState;
          } else if (commentRecord.currentState == "SHADOW_BAN") {
            title.value = "当前状态：仅自己可见";
            stateClass.value = "shadow-ban";
            shown = commentRecord.currentState;
          } else if (commentRecord.currentState == "DELETED") {
            title.value = "当前状态：已被删除";
            stateClass.value = "deleted";
            if (shown) {
              completed = true;
              message.value = `不用等了，你的评论检查到的状态先从『${shown == "NORMAL" ? "正常" : "仅自己可见"}』再到删除，系统偷偷删了无疑。如果不信，你可以尝试编辑评论或添加回复来求证`;
              onStateCheckComplete();
              return;
            }
          }
          showConfirmButton.value = true;
        }
        onStateCheckComplete();
        completed = true;
        message.value = "观察时间已足够，当前状态可信，检查完毕";
        buttonText.value = "关闭";
      }
      function onStateCheckComplete() {
        showConfirmButton.value = false;
        showCloseButton.value = true;
        if (commentRecord.currentState == "NORMAL") {
          showHotBanCheckButton.value = true;
        } else if (commentRecord.currentState == "DELETED") {
          onUnblock(commentRecord);
        }
      }
      startCheck();
      function cancelCheck() {
        completed = true;
        onClose(commentRecord);
      }
      function confirmCurrentState() {
        completed = true;
        message.value = "您已确认当前状态，检查完毕";
      }
      function close() {
        onClose(commentRecord);
      }
      async function checkHotBan() {
        if (commentRecord.commentId.indexOf(".") == -1) {
          try {
            await ElementPlus.ElMessageBox.confirm(
              "确认检查吗？该检查需要遍历热门评论区，请注意评论区的评论数量（总数大于3000的评论区慎重考虑）！数量太多将导致漫长的检查过程，同时频繁调用API可能会引发不可预料的后果！",
              "警告",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }
            );
          } catch (err) {
            return;
          }
        }
        showCloseButton.value = false;
        showHotBanCheckButton.value = false;
        showHotBanChecker.value = true;
        showStopHotBanCheckButton.value = true;
        while (currentTimeSec.value < maxTimeSec && !hotBanCheckerController.isCancelled) {
          messageByHotCheck.value = `为避免检查误判，检查需要等待至状态可信任时开始，剩余 ${Math.floor(maxTimeSec - currentTimeSec.value)}s`;
          if (!skipHotBanCheckWait && currentTimeSec.value > 50) {
            showLetMeAccessButtton.value = true;
          }
          if (skipHotBanCheckWait) {
            break;
          }
          await sleep(1e3);
          if (hotBanCheckerController.isCancelled) {
            return;
          }
          currentTimeSec.value = Date.now() / 1e3 - startTime;
        }
        showLetMeAccessButtton.value = false;
        messageByHotCheck.value = "正在重新检查评论状态……";
        await check2(commentRecord);
        if (commentRecord.currentState != "NORMAL") {
          if (commentRecord.currentState == "SHADOW_BAN") {
            title.value = "当前状态：仅自己可见";
            stateClass.value = "shadow-ban";
            messageByHotCheck.value = "评论已被ShadowBan，热门的屏蔽的检查已取消";
          } else if (commentRecord.currentState == "DELETED") {
            title.value = "当前状态：已被删除";
            stateClass.value = "deleted";
            messageByHotCheck.value = "评论已被删除，热门的屏蔽的检查已取消";
          }
          showStopHotBanCheckButton.value = false;
          showCloseButton.value = true;
          return;
        }
        messageByHotCheck.value = "评论状态正常，准备检查中……";
        let observer = {
          onCountChange(c, p) {
            messageByHotCheck.value = `正在搜索热门列表，已搜寻至：第${c}个 第${p}页`;
          }
        };
        if (await hotBanCheck2(commentRecord, observer, hotBanCheckerController)) {
          if (commentRecord.hotBan) {
            messageByHotCheck.value = "⚠ 你的评论未在热门列表找到，已被热门屏蔽，检查完成";
          } else {
            messageByHotCheck.value = "✔ 你的评论已在热门列表找到，没有被热门屏蔽，检查完成";
          }
        }
        showStopHotBanCheckButton.value = false;
        showCloseButton.value = true;
      }
      function stopHotBanCheck() {
        hotBanCheckerController.isCancelled = true;
        messageByHotCheck.value = "你已终止热门屏蔽的检查";
        showStopHotBanCheckButton.value = false;
        showCloseButton.value = true;
      }
      function letMeAccess() {
        skipHotBanCheckWait = true;
        showLetMeAccessButtton.value = false;
      }
      return (_ctx, _cache) => {
        const _component_el_progress = vue.resolveComponent("el-progress");
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(["comment-checker", stateClass.value])
        }, [
          vue.createElementVNode("div", _hoisted_1$5, vue.toDisplayString(title.value), 1),
          vue.createElementVNode("div", _hoisted_2$5, vue.toDisplayString(message.value), 1),
          vue.createVNode(_component_el_progress, {
            percentage: percentage.value,
            striped: "",
            format,
            "striped-flow": stripedFlow.value
          }, null, 8, ["percentage", "striped-flow"]),
          showHotBanChecker.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$5, [
            _cache[0] || (_cache[0] = vue.createElementVNode("div", { class: "title" }, "热门屏蔽检查", -1)),
            vue.createElementVNode("div", _hoisted_4$4, vue.toDisplayString(messageByHotCheck.value), 1)
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_5$3, [
            showCancelButton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              onClick: cancelCheck
            }, "取消")) : vue.createCommentVNode("", true),
            showConfirmButton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 1,
              onClick: confirmCurrentState
            }, "确认当前状态")) : vue.createCommentVNode("", true),
            showCloseButton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              onClick: close
            }, "关闭")) : vue.createCommentVNode("", true),
            showHotBanCheckButton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 3,
              onClick: checkHotBan
            }, "热门屏蔽检查")) : vue.createCommentVNode("", true),
            showStopHotBanCheckButton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 4,
              onClick: stopHotBanCheck
            }, "终止检查")) : vue.createCommentVNode("", true),
            showLetMeAccessButtton.value ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 5,
              onClick: letMeAccess
            }, "让我检查！")) : vue.createCommentVNode("", true)
          ])
        ], 2);
      };
    }
  };
  const CommentChecker = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-684910ce"]]);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  var indexMinimal = {};
  var minimal$1 = {};
  var aspromise;
  var hasRequiredAspromise;
  function requireAspromise() {
    if (hasRequiredAspromise) return aspromise;
    hasRequiredAspromise = 1;
    aspromise = asPromise;
    function asPromise(fn, ctx) {
      var params = new Array(arguments.length - 1), offset = 0, index = 2, pending = true;
      while (index < arguments.length)
        params[offset++] = arguments[index++];
      return new Promise(function executor(resolve, reject) {
        params[offset] = function callback(err) {
          if (pending) {
            pending = false;
            if (err)
              reject(err);
            else {
              var params2 = new Array(arguments.length - 1), offset2 = 0;
              while (offset2 < params2.length)
                params2[offset2++] = arguments[offset2];
              resolve.apply(null, params2);
            }
          }
        };
        try {
          fn.apply(ctx || null, params);
        } catch (err) {
          if (pending) {
            pending = false;
            reject(err);
          }
        }
      });
    }
    return aspromise;
  }
  var base64 = {};
  var hasRequiredBase64;
  function requireBase64() {
    if (hasRequiredBase64) return base64;
    hasRequiredBase64 = 1;
    (function(exports) {
      var base642 = exports;
      base642.length = function length(string) {
        var p = string.length;
        if (!p)
          return 0;
        var n = 0;
        while (--p % 4 > 1 && string.charAt(p) === "=")
          ++n;
        return Math.ceil(string.length * 3) / 4 - n;
      };
      var b64 = new Array(64);
      var s64 = new Array(123);
      for (var i = 0; i < 64; )
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;
      base642.encode = function encode(buffer, start, end) {
        var parts = null, chunk = [];
        var i2 = 0, j = 0, t;
        while (start < end) {
          var b = buffer[start++];
          switch (j) {
            case 0:
              chunk[i2++] = b64[b >> 2];
              t = (b & 3) << 4;
              j = 1;
              break;
            case 1:
              chunk[i2++] = b64[t | b >> 4];
              t = (b & 15) << 2;
              j = 2;
              break;
            case 2:
              chunk[i2++] = b64[t | b >> 6];
              chunk[i2++] = b64[b & 63];
              j = 0;
              break;
          }
          if (i2 > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i2 = 0;
          }
        }
        if (j) {
          chunk[i2++] = b64[t];
          chunk[i2++] = 61;
          if (j === 1)
            chunk[i2++] = 61;
        }
        if (parts) {
          if (i2)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i2)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i2));
      };
      var invalidEncoding = "invalid encoding";
      base642.decode = function decode(string, buffer, offset) {
        var start = offset;
        var j = 0, t;
        for (var i2 = 0; i2 < string.length; ) {
          var c = string.charCodeAt(i2++);
          if (c === 61 && j > 1)
            break;
          if ((c = s64[c]) === void 0)
            throw Error(invalidEncoding);
          switch (j) {
            case 0:
              t = c;
              j = 1;
              break;
            case 1:
              buffer[offset++] = t << 2 | (c & 48) >> 4;
              t = c;
              j = 2;
              break;
            case 2:
              buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
              t = c;
              j = 3;
              break;
            case 3:
              buffer[offset++] = (t & 3) << 6 | c;
              j = 0;
              break;
          }
        }
        if (j === 1)
          throw Error(invalidEncoding);
        return offset - start;
      };
      base642.test = function test(string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
      };
    })(base64);
    return base64;
  }
  var eventemitter;
  var hasRequiredEventemitter;
  function requireEventemitter() {
    if (hasRequiredEventemitter) return eventemitter;
    hasRequiredEventemitter = 1;
    eventemitter = EventEmitter;
    function EventEmitter() {
      this._listeners = {};
    }
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
      (this._listeners[evt] || (this._listeners[evt] = [])).push({
        fn,
        ctx: ctx || this
      });
      return this;
    };
    EventEmitter.prototype.off = function off(evt, fn) {
      if (evt === void 0)
        this._listeners = {};
      else {
        if (fn === void 0)
          this._listeners[evt] = [];
        else {
          var listeners = this._listeners[evt];
          for (var i = 0; i < listeners.length; )
            if (listeners[i].fn === fn)
              listeners.splice(i, 1);
            else
              ++i;
        }
      }
      return this;
    };
    EventEmitter.prototype.emit = function emit(evt) {
      var listeners = this._listeners[evt];
      if (listeners) {
        var args = [], i = 1;
        for (; i < arguments.length; )
          args.push(arguments[i++]);
        for (i = 0; i < listeners.length; )
          listeners[i].fn.apply(listeners[i++].ctx, args);
      }
      return this;
    };
    return eventemitter;
  }
  var float;
  var hasRequiredFloat;
  function requireFloat() {
    if (hasRequiredFloat) return float;
    hasRequiredFloat = 1;
    float = factory(factory);
    function factory(exports) {
      if (typeof Float32Array !== "undefined") (function() {
        var f32 = new Float32Array([-0]), f8b = new Uint8Array(f32.buffer), le = f8b[3] === 128;
        function writeFloat_f32_cpy(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
        }
        function writeFloat_f32_rev(val, buf, pos) {
          f32[0] = val;
          buf[pos] = f8b[3];
          buf[pos + 1] = f8b[2];
          buf[pos + 2] = f8b[1];
          buf[pos + 3] = f8b[0];
        }
        exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
        exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;
        function readFloat_f32_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          return f32[0];
        }
        function readFloat_f32_rev(buf, pos) {
          f8b[3] = buf[pos];
          f8b[2] = buf[pos + 1];
          f8b[1] = buf[pos + 2];
          f8b[0] = buf[pos + 3];
          return f32[0];
        }
        exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
        exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;
      })();
      else (function() {
        function writeFloat_ieee754(writeUint, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0)
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos);
          else if (isNaN(val))
            writeUint(2143289344, buf, pos);
          else if (val > 34028234663852886e22)
            writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
          else if (val < 11754943508222875e-54)
            writeUint((sign << 31 | Math.round(val / 1401298464324817e-60)) >>> 0, buf, pos);
          else {
            var exponent = Math.floor(Math.log(val) / Math.LN2), mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
            writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
          }
        }
        exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
        exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);
        function readFloat_ieee754(readUint, buf, pos) {
          var uint = readUint(buf, pos), sign = (uint >> 31) * 2 + 1, exponent = uint >>> 23 & 255, mantissa = uint & 8388607;
          return exponent === 255 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 1401298464324817e-60 * mantissa : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
        }
        exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
        exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);
      })();
      if (typeof Float64Array !== "undefined") (function() {
        var f64 = new Float64Array([-0]), f8b = new Uint8Array(f64.buffer), le = f8b[7] === 128;
        function writeDouble_f64_cpy(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[0];
          buf[pos + 1] = f8b[1];
          buf[pos + 2] = f8b[2];
          buf[pos + 3] = f8b[3];
          buf[pos + 4] = f8b[4];
          buf[pos + 5] = f8b[5];
          buf[pos + 6] = f8b[6];
          buf[pos + 7] = f8b[7];
        }
        function writeDouble_f64_rev(val, buf, pos) {
          f64[0] = val;
          buf[pos] = f8b[7];
          buf[pos + 1] = f8b[6];
          buf[pos + 2] = f8b[5];
          buf[pos + 3] = f8b[4];
          buf[pos + 4] = f8b[3];
          buf[pos + 5] = f8b[2];
          buf[pos + 6] = f8b[1];
          buf[pos + 7] = f8b[0];
        }
        exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
        exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;
        function readDouble_f64_cpy(buf, pos) {
          f8b[0] = buf[pos];
          f8b[1] = buf[pos + 1];
          f8b[2] = buf[pos + 2];
          f8b[3] = buf[pos + 3];
          f8b[4] = buf[pos + 4];
          f8b[5] = buf[pos + 5];
          f8b[6] = buf[pos + 6];
          f8b[7] = buf[pos + 7];
          return f64[0];
        }
        function readDouble_f64_rev(buf, pos) {
          f8b[7] = buf[pos];
          f8b[6] = buf[pos + 1];
          f8b[5] = buf[pos + 2];
          f8b[4] = buf[pos + 3];
          f8b[3] = buf[pos + 4];
          f8b[2] = buf[pos + 5];
          f8b[1] = buf[pos + 6];
          f8b[0] = buf[pos + 7];
          return f64[0];
        }
        exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
        exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;
      })();
      else (function() {
        function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
          var sign = val < 0 ? 1 : 0;
          if (sign)
            val = -val;
          if (val === 0) {
            writeUint(0, buf, pos + off0);
            writeUint(1 / val > 0 ? (
              /* positive */
              0
            ) : (
              /* negative 0 */
              2147483648
            ), buf, pos + off1);
          } else if (isNaN(val)) {
            writeUint(0, buf, pos + off0);
            writeUint(2146959360, buf, pos + off1);
          } else if (val > 17976931348623157e292) {
            writeUint(0, buf, pos + off0);
            writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
          } else {
            var mantissa;
            if (val < 22250738585072014e-324) {
              mantissa = val / 5e-324;
              writeUint(mantissa >>> 0, buf, pos + off0);
              writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
            } else {
              var exponent = Math.floor(Math.log(val) / Math.LN2);
              if (exponent === 1024)
                exponent = 1023;
              mantissa = val * Math.pow(2, -exponent);
              writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
              writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
            }
          }
        }
        exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
        exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);
        function readDouble_ieee754(readUint, off0, off1, buf, pos) {
          var lo = readUint(buf, pos + off0), hi = readUint(buf, pos + off1);
          var sign = (hi >> 31) * 2 + 1, exponent = hi >>> 20 & 2047, mantissa = 4294967296 * (hi & 1048575) + lo;
          return exponent === 2047 ? mantissa ? NaN : sign * Infinity : exponent === 0 ? sign * 5e-324 * mantissa : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
        }
        exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
        exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);
      })();
      return exports;
    }
    function writeUintLE(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    function writeUintBE(val, buf, pos) {
      buf[pos] = val >>> 24;
      buf[pos + 1] = val >>> 16 & 255;
      buf[pos + 2] = val >>> 8 & 255;
      buf[pos + 3] = val & 255;
    }
    function readUintLE(buf, pos) {
      return (buf[pos] | buf[pos + 1] << 8 | buf[pos + 2] << 16 | buf[pos + 3] << 24) >>> 0;
    }
    function readUintBE(buf, pos) {
      return (buf[pos] << 24 | buf[pos + 1] << 16 | buf[pos + 2] << 8 | buf[pos + 3]) >>> 0;
    }
    return float;
  }
  var inquire_1;
  var hasRequiredInquire;
  function requireInquire() {
    if (hasRequiredInquire) return inquire_1;
    hasRequiredInquire = 1;
    inquire_1 = inquire;
    function inquire(moduleName) {
      try {
        var mod = eval("quire".replace(/^/, "re"))(moduleName);
        if (mod && (mod.length || Object.keys(mod).length))
          return mod;
      } catch (e) {
      }
      return null;
    }
    return inquire_1;
  }
  var utf8 = {};
  var hasRequiredUtf8;
  function requireUtf8() {
    if (hasRequiredUtf8) return utf8;
    hasRequiredUtf8 = 1;
    (function(exports) {
      var utf82 = exports;
      utf82.length = function utf8_length(string) {
        var len = 0, c = 0;
        for (var i = 0; i < string.length; ++i) {
          c = string.charCodeAt(i);
          if (c < 128)
            len += 1;
          else if (c < 2048)
            len += 2;
          else if ((c & 64512) === 55296 && (string.charCodeAt(i + 1) & 64512) === 56320) {
            ++i;
            len += 4;
          } else
            len += 3;
        }
        return len;
      };
      utf82.read = function utf8_read(buffer, start, end) {
        var len = end - start;
        if (len < 1)
          return "";
        var parts = null, chunk = [], i = 0, t;
        while (start < end) {
          t = buffer[start++];
          if (t < 128)
            chunk[i++] = t;
          else if (t > 191 && t < 224)
            chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
          else if (t > 239 && t < 365) {
            t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 65536;
            chunk[i++] = 55296 + (t >> 10);
            chunk[i++] = 56320 + (t & 1023);
          } else
            chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
          if (i > 8191) {
            (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
            i = 0;
          }
        }
        if (parts) {
          if (i)
            parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
          return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
      };
      utf82.write = function utf8_write(string, buffer, offset) {
        var start = offset, c1, c2;
        for (var i = 0; i < string.length; ++i) {
          c1 = string.charCodeAt(i);
          if (c1 < 128) {
            buffer[offset++] = c1;
          } else if (c1 < 2048) {
            buffer[offset++] = c1 >> 6 | 192;
            buffer[offset++] = c1 & 63 | 128;
          } else if ((c1 & 64512) === 55296 && ((c2 = string.charCodeAt(i + 1)) & 64512) === 56320) {
            c1 = 65536 + ((c1 & 1023) << 10) + (c2 & 1023);
            ++i;
            buffer[offset++] = c1 >> 18 | 240;
            buffer[offset++] = c1 >> 12 & 63 | 128;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          } else {
            buffer[offset++] = c1 >> 12 | 224;
            buffer[offset++] = c1 >> 6 & 63 | 128;
            buffer[offset++] = c1 & 63 | 128;
          }
        }
        return offset - start;
      };
    })(utf8);
    return utf8;
  }
  var pool_1;
  var hasRequiredPool;
  function requirePool() {
    if (hasRequiredPool) return pool_1;
    hasRequiredPool = 1;
    pool_1 = pool;
    function pool(alloc, slice, size) {
      var SIZE = size || 8192;
      var MAX = SIZE >>> 1;
      var slab = null;
      var offset = SIZE;
      return function pool_alloc(size2) {
        if (size2 < 1 || size2 > MAX)
          return alloc(size2);
        if (offset + size2 > SIZE) {
          slab = alloc(SIZE);
          offset = 0;
        }
        var buf = slice.call(slab, offset, offset += size2);
        if (offset & 7)
          offset = (offset | 7) + 1;
        return buf;
      };
    }
    return pool_1;
  }
  var longbits;
  var hasRequiredLongbits;
  function requireLongbits() {
    if (hasRequiredLongbits) return longbits;
    hasRequiredLongbits = 1;
    longbits = LongBits;
    var util = requireMinimal$1();
    function LongBits(lo, hi) {
      this.lo = lo >>> 0;
      this.hi = hi >>> 0;
    }
    var zero = LongBits.zero = new LongBits(0, 0);
    zero.toNumber = function() {
      return 0;
    };
    zero.zzEncode = zero.zzDecode = function() {
      return this;
    };
    zero.length = function() {
      return 1;
    };
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";
    LongBits.fromNumber = function fromNumber(value) {
      if (value === 0)
        return zero;
      var sign = value < 0;
      if (sign)
        value = -value;
      var lo = value >>> 0, hi = (value - lo) / 4294967296 >>> 0;
      if (sign) {
        hi = ~hi >>> 0;
        lo = ~lo >>> 0;
        if (++lo > 4294967295) {
          lo = 0;
          if (++hi > 4294967295)
            hi = 0;
        }
      }
      return new LongBits(lo, hi);
    };
    LongBits.from = function from(value) {
      if (typeof value === "number")
        return LongBits.fromNumber(value);
      if (util.isString(value)) {
        if (util.Long)
          value = util.Long.fromString(value);
        else
          return LongBits.fromNumber(parseInt(value, 10));
      }
      return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };
    LongBits.prototype.toNumber = function toNumber(unsigned) {
      if (!unsigned && this.hi >>> 31) {
        var lo = ~this.lo + 1 >>> 0, hi = ~this.hi >>> 0;
        if (!lo)
          hi = hi + 1 >>> 0;
        return -(lo + hi * 4294967296);
      }
      return this.lo + this.hi * 4294967296;
    };
    LongBits.prototype.toLong = function toLong(unsigned) {
      return util.Long ? new util.Long(this.lo | 0, this.hi | 0, Boolean(unsigned)) : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };
    var charCodeAt = String.prototype.charCodeAt;
    LongBits.fromHash = function fromHash(hash) {
      if (hash === zeroHash)
        return zero;
      return new LongBits(
        (charCodeAt.call(hash, 0) | charCodeAt.call(hash, 1) << 8 | charCodeAt.call(hash, 2) << 16 | charCodeAt.call(hash, 3) << 24) >>> 0,
        (charCodeAt.call(hash, 4) | charCodeAt.call(hash, 5) << 8 | charCodeAt.call(hash, 6) << 16 | charCodeAt.call(hash, 7) << 24) >>> 0
      );
    };
    LongBits.prototype.toHash = function toHash() {
      return String.fromCharCode(
        this.lo & 255,
        this.lo >>> 8 & 255,
        this.lo >>> 16 & 255,
        this.lo >>> 24,
        this.hi & 255,
        this.hi >>> 8 & 255,
        this.hi >>> 16 & 255,
        this.hi >>> 24
      );
    };
    LongBits.prototype.zzEncode = function zzEncode() {
      var mask = this.hi >> 31;
      this.hi = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
      this.lo = (this.lo << 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.zzDecode = function zzDecode() {
      var mask = -(this.lo & 1);
      this.lo = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
      this.hi = (this.hi >>> 1 ^ mask) >>> 0;
      return this;
    };
    LongBits.prototype.length = function length() {
      var part0 = this.lo, part1 = (this.lo >>> 28 | this.hi << 4) >>> 0, part2 = this.hi >>> 24;
      return part2 === 0 ? part1 === 0 ? part0 < 16384 ? part0 < 128 ? 1 : 2 : part0 < 2097152 ? 3 : 4 : part1 < 16384 ? part1 < 128 ? 5 : 6 : part1 < 2097152 ? 7 : 8 : part2 < 128 ? 9 : 10;
    };
    return longbits;
  }
  var hasRequiredMinimal$1;
  function requireMinimal$1() {
    if (hasRequiredMinimal$1) return minimal$1;
    hasRequiredMinimal$1 = 1;
    (function(exports) {
      var util = exports;
      util.asPromise = requireAspromise();
      util.base64 = requireBase64();
      util.EventEmitter = requireEventemitter();
      util.float = requireFloat();
      util.inquire = requireInquire();
      util.utf8 = requireUtf8();
      util.pool = requirePool();
      util.LongBits = requireLongbits();
      util.isNode = Boolean(typeof commonjsGlobal !== "undefined" && commonjsGlobal && commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);
      util.global = util.isNode && commonjsGlobal || typeof window !== "undefined" && window || typeof self !== "undefined" && self || minimal$1;
      util.emptyArray = Object.freeze ? Object.freeze([]) : (
        /* istanbul ignore next */
        []
      );
      util.emptyObject = Object.freeze ? Object.freeze({}) : (
        /* istanbul ignore next */
        {}
      );
      util.isInteger = Number.isInteger || /* istanbul ignore next */
      function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
      };
      util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
      };
      util.isObject = function isObject(value) {
        return value && typeof value === "object";
      };
      util.isset = /**
       * Checks if a property on a message is considered to be present.
       * @param {Object} obj Plain object or message instance
       * @param {string} prop Property name
       * @returns {boolean} `true` if considered to be present, otherwise `false`
       */
      util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && obj.hasOwnProperty(prop))
          return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
      };
      util.Buffer = function() {
        try {
          var Buffer = util.inquire("buffer").Buffer;
          return Buffer.prototype.utf8Write ? Buffer : (
            /* istanbul ignore next */
            null
          );
        } catch (e) {
          return null;
        }
      }();
      util._Buffer_from = null;
      util._Buffer_allocUnsafe = null;
      util.newBuffer = function newBuffer(sizeOrArray) {
        return typeof sizeOrArray === "number" ? util.Buffer ? util._Buffer_allocUnsafe(sizeOrArray) : new util.Array(sizeOrArray) : util.Buffer ? util._Buffer_from(sizeOrArray) : typeof Uint8Array === "undefined" ? sizeOrArray : new Uint8Array(sizeOrArray);
      };
      util.Array = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      util.Long = /* istanbul ignore next */
      util.global.dcodeIO && /* istanbul ignore next */
      util.global.dcodeIO.Long || /* istanbul ignore next */
      util.global.Long || util.inquire("long");
      util.key2Re = /^true|false|0|1$/;
      util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;
      util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;
      util.longToHash = function longToHash(value) {
        return value ? util.LongBits.from(value).toHash() : util.LongBits.zeroHash;
      };
      util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
          return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
      };
      function merge(dst, src, ifNotSet) {
        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
          if (dst[keys[i]] === void 0 || !ifNotSet)
            dst[keys[i]] = src[keys[i]];
        return dst;
      }
      util.merge = merge;
      util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
      };
      function newError(name) {
        function CustomError(message, properties) {
          if (!(this instanceof CustomError))
            return new CustomError(message, properties);
          Object.defineProperty(this, "message", { get: function() {
            return message;
          } });
          if (Error.captureStackTrace)
            Error.captureStackTrace(this, CustomError);
          else
            Object.defineProperty(this, "stack", { value: new Error().stack || "" });
          if (properties)
            merge(this, properties);
        }
        CustomError.prototype = Object.create(Error.prototype, {
          constructor: {
            value: CustomError,
            writable: true,
            enumerable: false,
            configurable: true
          },
          name: {
            get: function get() {
              return name;
            },
            set: void 0,
            enumerable: false,
            // configurable: false would accurately preserve the behavior of
            // the original, but I'm guessing that was not intentional.
            // For an actual error subclass, this property would
            // be configurable.
            configurable: true
          },
          toString: {
            value: function value() {
              return this.name + ": " + this.message;
            },
            writable: true,
            enumerable: false,
            configurable: true
          }
        });
        return CustomError;
      }
      util.newError = newError;
      util.ProtocolError = newError("ProtocolError");
      util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
          fieldMap[fieldNames[i]] = 1;
        return function() {
          for (var keys = Object.keys(this), i2 = keys.length - 1; i2 > -1; --i2)
            if (fieldMap[keys[i2]] === 1 && this[keys[i2]] !== void 0 && this[keys[i2]] !== null)
              return keys[i2];
        };
      };
      util.oneOfSetter = function setOneOf(fieldNames) {
        return function(name) {
          for (var i = 0; i < fieldNames.length; ++i)
            if (fieldNames[i] !== name)
              delete this[fieldNames[i]];
        };
      };
      util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
      };
      util._configure = function() {
        var Buffer = util.Buffer;
        if (!Buffer) {
          util._Buffer_from = util._Buffer_allocUnsafe = null;
          return;
        }
        util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from || /* istanbul ignore next */
        function Buffer_from(value, encoding) {
          return new Buffer(value, encoding);
        };
        util._Buffer_allocUnsafe = Buffer.allocUnsafe || /* istanbul ignore next */
        function Buffer_allocUnsafe(size) {
          return new Buffer(size);
        };
      };
    })(minimal$1);
    return minimal$1;
  }
  var writer;
  var hasRequiredWriter;
  function requireWriter() {
    if (hasRequiredWriter) return writer;
    hasRequiredWriter = 1;
    writer = Writer;
    var util = requireMinimal$1();
    var BufferWriter;
    var LongBits = util.LongBits, base642 = util.base64, utf82 = util.utf8;
    function Op(fn, len, val) {
      this.fn = fn;
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    function noop2() {
    }
    function State(writer2) {
      this.head = writer2.head;
      this.tail = writer2.tail;
      this.len = writer2.len;
      this.next = writer2.states;
    }
    function Writer() {
      this.len = 0;
      this.head = new Op(noop2, 0, 0);
      this.tail = this.head;
      this.states = null;
    }
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup() {
        return (Writer.create = function create_buffer() {
          return new BufferWriter();
        })();
      } : function create_array() {
        return new Writer();
      };
    };
    Writer.create = create();
    Writer.alloc = function alloc(size) {
      return new util.Array(size);
    };
    if (util.Array !== Array)
      Writer.alloc = util.pool(Writer.alloc, util.Array.prototype.subarray);
    Writer.prototype._push = function push(fn, len, val) {
      this.tail = this.tail.next = new Op(fn, len, val);
      this.len += len;
      return this;
    };
    function writeByte(val, buf, pos) {
      buf[pos] = val & 255;
    }
    function writeVarint32(val, buf, pos) {
      while (val > 127) {
        buf[pos++] = val & 127 | 128;
        val >>>= 7;
      }
      buf[pos] = val;
    }
    function VarintOp(len, val) {
      this.len = len;
      this.next = void 0;
      this.val = val;
    }
    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;
    Writer.prototype.uint32 = function write_uint32(value) {
      this.len += (this.tail = this.tail.next = new VarintOp(
        (value = value >>> 0) < 128 ? 1 : value < 16384 ? 2 : value < 2097152 ? 3 : value < 268435456 ? 4 : 5,
        value
      )).len;
      return this;
    };
    Writer.prototype.int32 = function write_int32(value) {
      return value < 0 ? this._push(writeVarint64, 10, LongBits.fromNumber(value)) : this.uint32(value);
    };
    Writer.prototype.sint32 = function write_sint32(value) {
      return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };
    function writeVarint64(val, buf, pos) {
      while (val.hi) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
        val.hi >>>= 7;
      }
      while (val.lo > 127) {
        buf[pos++] = val.lo & 127 | 128;
        val.lo = val.lo >>> 7;
      }
      buf[pos++] = val.lo;
    }
    Writer.prototype.uint64 = function write_uint64(value) {
      var bits = LongBits.from(value);
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.int64 = Writer.prototype.uint64;
    Writer.prototype.sint64 = function write_sint64(value) {
      var bits = LongBits.from(value).zzEncode();
      return this._push(writeVarint64, bits.length(), bits);
    };
    Writer.prototype.bool = function write_bool(value) {
      return this._push(writeByte, 1, value ? 1 : 0);
    };
    function writeFixed32(val, buf, pos) {
      buf[pos] = val & 255;
      buf[pos + 1] = val >>> 8 & 255;
      buf[pos + 2] = val >>> 16 & 255;
      buf[pos + 3] = val >>> 24;
    }
    Writer.prototype.fixed32 = function write_fixed32(value) {
      return this._push(writeFixed32, 4, value >>> 0);
    };
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;
    Writer.prototype.fixed64 = function write_fixed64(value) {
      var bits = LongBits.from(value);
      return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;
    Writer.prototype.float = function write_float(value) {
      return this._push(util.float.writeFloatLE, 4, value);
    };
    Writer.prototype.double = function write_double(value) {
      return this._push(util.float.writeDoubleLE, 8, value);
    };
    var writeBytes = util.Array.prototype.set ? function writeBytes_set(val, buf, pos) {
      buf.set(val, pos);
    } : function writeBytes_for(val, buf, pos) {
      for (var i = 0; i < val.length; ++i)
        buf[pos + i] = val[i];
    };
    Writer.prototype.bytes = function write_bytes(value) {
      var len = value.length >>> 0;
      if (!len)
        return this._push(writeByte, 1, 0);
      if (util.isString(value)) {
        var buf = Writer.alloc(len = base642.length(value));
        base642.decode(value, buf, 0);
        value = buf;
      }
      return this.uint32(len)._push(writeBytes, len, value);
    };
    Writer.prototype.string = function write_string(value) {
      var len = utf82.length(value);
      return len ? this.uint32(len)._push(utf82.write, len, value) : this._push(writeByte, 1, 0);
    };
    Writer.prototype.fork = function fork() {
      this.states = new State(this);
      this.head = this.tail = new Op(noop2, 0, 0);
      this.len = 0;
      return this;
    };
    Writer.prototype.reset = function reset() {
      if (this.states) {
        this.head = this.states.head;
        this.tail = this.states.tail;
        this.len = this.states.len;
        this.states = this.states.next;
      } else {
        this.head = this.tail = new Op(noop2, 0, 0);
        this.len = 0;
      }
      return this;
    };
    Writer.prototype.ldelim = function ldelim() {
      var head = this.head, tail = this.tail, len = this.len;
      this.reset().uint32(len);
      if (len) {
        this.tail.next = head.next;
        this.tail = tail;
        this.len += len;
      }
      return this;
    };
    Writer.prototype.finish = function finish() {
      var head = this.head.next, buf = this.constructor.alloc(this.len), pos = 0;
      while (head) {
        head.fn(head.val, buf, pos);
        pos += head.len;
        head = head.next;
      }
      return buf;
    };
    Writer._configure = function(BufferWriter_) {
      BufferWriter = BufferWriter_;
      Writer.create = create();
      BufferWriter._configure();
    };
    return writer;
  }
  var writer_buffer;
  var hasRequiredWriter_buffer;
  function requireWriter_buffer() {
    if (hasRequiredWriter_buffer) return writer_buffer;
    hasRequiredWriter_buffer = 1;
    writer_buffer = BufferWriter;
    var Writer = requireWriter();
    (BufferWriter.prototype = Object.create(Writer.prototype)).constructor = BufferWriter;
    var util = requireMinimal$1();
    function BufferWriter() {
      Writer.call(this);
    }
    BufferWriter._configure = function() {
      BufferWriter.alloc = util._Buffer_allocUnsafe;
      BufferWriter.writeBytesBuffer = util.Buffer && util.Buffer.prototype instanceof Uint8Array && util.Buffer.prototype.set.name === "set" ? function writeBytesBuffer_set(val, buf, pos) {
        buf.set(val, pos);
      } : function writeBytesBuffer_copy(val, buf, pos) {
        if (val.copy)
          val.copy(buf, pos, 0, val.length);
        else for (var i = 0; i < val.length; )
          buf[pos++] = val[i++];
      };
    };
    BufferWriter.prototype.bytes = function write_bytes_buffer(value) {
      if (util.isString(value))
        value = util._Buffer_from(value, "base64");
      var len = value.length >>> 0;
      this.uint32(len);
      if (len)
        this._push(BufferWriter.writeBytesBuffer, len, value);
      return this;
    };
    function writeStringBuffer(val, buf, pos) {
      if (val.length < 40)
        util.utf8.write(val, buf, pos);
      else if (buf.utf8Write)
        buf.utf8Write(val, pos);
      else
        buf.write(val, pos);
    }
    BufferWriter.prototype.string = function write_string_buffer(value) {
      var len = util.Buffer.byteLength(value);
      this.uint32(len);
      if (len)
        this._push(writeStringBuffer, len, value);
      return this;
    };
    BufferWriter._configure();
    return writer_buffer;
  }
  var reader;
  var hasRequiredReader;
  function requireReader() {
    if (hasRequiredReader) return reader;
    hasRequiredReader = 1;
    reader = Reader;
    var util = requireMinimal$1();
    var BufferReader;
    var LongBits = util.LongBits, utf82 = util.utf8;
    function indexOutOfRange(reader2, writeLength) {
      return RangeError("index out of range: " + reader2.pos + " + " + (writeLength || 1) + " > " + reader2.len);
    }
    function Reader(buffer) {
      this.buf = buffer;
      this.pos = 0;
      this.len = buffer.length;
    }
    var create_array = typeof Uint8Array !== "undefined" ? function create_typed_array(buffer) {
      if (buffer instanceof Uint8Array || Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    } : function create_array2(buffer) {
      if (Array.isArray(buffer))
        return new Reader(buffer);
      throw Error("illegal buffer");
    };
    var create = function create2() {
      return util.Buffer ? function create_buffer_setup(buffer) {
        return (Reader.create = function create_buffer(buffer2) {
          return util.Buffer.isBuffer(buffer2) ? new BufferReader(buffer2) : create_array(buffer2);
        })(buffer);
      } : create_array;
    };
    Reader.create = create();
    Reader.prototype._slice = util.Array.prototype.subarray || /* istanbul ignore next */
    util.Array.prototype.slice;
    Reader.prototype.uint32 = /* @__PURE__ */ function read_uint32_setup() {
      var value = 4294967295;
      return function read_uint32() {
        value = (this.buf[this.pos] & 127) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 7) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 14) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 127) << 21) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        value = (value | (this.buf[this.pos] & 15) << 28) >>> 0;
        if (this.buf[this.pos++] < 128) return value;
        if ((this.pos += 5) > this.len) {
          this.pos = this.len;
          throw indexOutOfRange(this, 10);
        }
        return value;
      };
    }();
    Reader.prototype.int32 = function read_int32() {
      return this.uint32() | 0;
    };
    Reader.prototype.sint32 = function read_sint32() {
      var value = this.uint32();
      return value >>> 1 ^ -(value & 1) | 0;
    };
    function readLongVarint() {
      var bits = new LongBits(0, 0);
      var i = 0;
      if (this.len - this.pos > 4) {
        for (; i < 4; ++i) {
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
        bits.hi = (bits.hi | (this.buf[this.pos] & 127) >> 4) >>> 0;
        if (this.buf[this.pos++] < 128)
          return bits;
        i = 0;
      } else {
        for (; i < 3; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
        bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
        return bits;
      }
      if (this.len - this.pos > 4) {
        for (; i < 5; ++i) {
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      } else {
        for (; i < 5; ++i) {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
          bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
          if (this.buf[this.pos++] < 128)
            return bits;
        }
      }
      throw Error("invalid varint encoding");
    }
    Reader.prototype.bool = function read_bool() {
      return this.uint32() !== 0;
    };
    function readFixed32_end(buf, end) {
      return (buf[end - 4] | buf[end - 3] << 8 | buf[end - 2] << 16 | buf[end - 1] << 24) >>> 0;
    }
    Reader.prototype.fixed32 = function read_fixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4);
    };
    Reader.prototype.sfixed32 = function read_sfixed32() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      return readFixed32_end(this.buf, this.pos += 4) | 0;
    };
    function readFixed64() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 8);
      return new LongBits(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }
    Reader.prototype.float = function read_float() {
      if (this.pos + 4 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readFloatLE(this.buf, this.pos);
      this.pos += 4;
      return value;
    };
    Reader.prototype.double = function read_double() {
      if (this.pos + 8 > this.len)
        throw indexOutOfRange(this, 4);
      var value = util.float.readDoubleLE(this.buf, this.pos);
      this.pos += 8;
      return value;
    };
    Reader.prototype.bytes = function read_bytes() {
      var length = this.uint32(), start = this.pos, end = this.pos + length;
      if (end > this.len)
        throw indexOutOfRange(this, length);
      this.pos += length;
      if (Array.isArray(this.buf))
        return this.buf.slice(start, end);
      if (start === end) {
        var nativeBuffer = util.Buffer;
        return nativeBuffer ? nativeBuffer.alloc(0) : new this.buf.constructor(0);
      }
      return this._slice.call(this.buf, start, end);
    };
    Reader.prototype.string = function read_string() {
      var bytes = this.bytes();
      return utf82.read(bytes, 0, bytes.length);
    };
    Reader.prototype.skip = function skip(length) {
      if (typeof length === "number") {
        if (this.pos + length > this.len)
          throw indexOutOfRange(this, length);
        this.pos += length;
      } else {
        do {
          if (this.pos >= this.len)
            throw indexOutOfRange(this);
        } while (this.buf[this.pos++] & 128);
      }
      return this;
    };
    Reader.prototype.skipType = function(wireType) {
      switch (wireType) {
        case 0:
          this.skip();
          break;
        case 1:
          this.skip(8);
          break;
        case 2:
          this.skip(this.uint32());
          break;
        case 3:
          while ((wireType = this.uint32() & 7) !== 4) {
            this.skipType(wireType);
          }
          break;
        case 5:
          this.skip(4);
          break;
        /* istanbul ignore next */
        default:
          throw Error("invalid wire type " + wireType + " at offset " + this.pos);
      }
      return this;
    };
    Reader._configure = function(BufferReader_) {
      BufferReader = BufferReader_;
      Reader.create = create();
      BufferReader._configure();
      var fn = util.Long ? "toLong" : (
        /* istanbul ignore next */
        "toNumber"
      );
      util.merge(Reader.prototype, {
        int64: function read_int64() {
          return readLongVarint.call(this)[fn](false);
        },
        uint64: function read_uint64() {
          return readLongVarint.call(this)[fn](true);
        },
        sint64: function read_sint64() {
          return readLongVarint.call(this).zzDecode()[fn](false);
        },
        fixed64: function read_fixed64() {
          return readFixed64.call(this)[fn](true);
        },
        sfixed64: function read_sfixed64() {
          return readFixed64.call(this)[fn](false);
        }
      });
    };
    return reader;
  }
  var reader_buffer;
  var hasRequiredReader_buffer;
  function requireReader_buffer() {
    if (hasRequiredReader_buffer) return reader_buffer;
    hasRequiredReader_buffer = 1;
    reader_buffer = BufferReader;
    var Reader = requireReader();
    (BufferReader.prototype = Object.create(Reader.prototype)).constructor = BufferReader;
    var util = requireMinimal$1();
    function BufferReader(buffer) {
      Reader.call(this, buffer);
    }
    BufferReader._configure = function() {
      if (util.Buffer)
        BufferReader.prototype._slice = util.Buffer.prototype.slice;
    };
    BufferReader.prototype.string = function read_string_buffer() {
      var len = this.uint32();
      return this.buf.utf8Slice ? this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len)) : this.buf.toString("utf-8", this.pos, this.pos = Math.min(this.pos + len, this.len));
    };
    BufferReader._configure();
    return reader_buffer;
  }
  var rpc = {};
  var service;
  var hasRequiredService;
  function requireService() {
    if (hasRequiredService) return service;
    hasRequiredService = 1;
    service = Service;
    var util = requireMinimal$1();
    (Service.prototype = Object.create(util.EventEmitter.prototype)).constructor = Service;
    function Service(rpcImpl, requestDelimited, responseDelimited) {
      if (typeof rpcImpl !== "function")
        throw TypeError("rpcImpl must be a function");
      util.EventEmitter.call(this);
      this.rpcImpl = rpcImpl;
      this.requestDelimited = Boolean(requestDelimited);
      this.responseDelimited = Boolean(responseDelimited);
    }
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {
      if (!request)
        throw TypeError("request must be specified");
      var self2 = this;
      if (!callback)
        return util.asPromise(rpcCall, self2, method, requestCtor, responseCtor, request);
      if (!self2.rpcImpl) {
        setTimeout(function() {
          callback(Error("already ended"));
        }, 0);
        return void 0;
      }
      try {
        return self2.rpcImpl(
          method,
          requestCtor[self2.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
          function rpcCallback(err, response) {
            if (err) {
              self2.emit("error", err, method);
              return callback(err);
            }
            if (response === null) {
              self2.end(
                /* endedByRPC */
                true
              );
              return void 0;
            }
            if (!(response instanceof responseCtor)) {
              try {
                response = responseCtor[self2.responseDelimited ? "decodeDelimited" : "decode"](response);
              } catch (err2) {
                self2.emit("error", err2, method);
                return callback(err2);
              }
            }
            self2.emit("data", response, method);
            return callback(null, response);
          }
        );
      } catch (err) {
        self2.emit("error", err, method);
        setTimeout(function() {
          callback(err);
        }, 0);
        return void 0;
      }
    };
    Service.prototype.end = function end(endedByRPC) {
      if (this.rpcImpl) {
        if (!endedByRPC)
          this.rpcImpl(null, null, null);
        this.rpcImpl = null;
        this.emit("end").off();
      }
      return this;
    };
    return service;
  }
  var hasRequiredRpc;
  function requireRpc() {
    if (hasRequiredRpc) return rpc;
    hasRequiredRpc = 1;
    (function(exports) {
      var rpc2 = exports;
      rpc2.Service = requireService();
    })(rpc);
    return rpc;
  }
  var roots;
  var hasRequiredRoots;
  function requireRoots() {
    if (hasRequiredRoots) return roots;
    hasRequiredRoots = 1;
    roots = {};
    return roots;
  }
  var hasRequiredIndexMinimal;
  function requireIndexMinimal() {
    if (hasRequiredIndexMinimal) return indexMinimal;
    hasRequiredIndexMinimal = 1;
    (function(exports) {
      var protobuf = exports;
      protobuf.build = "minimal";
      protobuf.Writer = requireWriter();
      protobuf.BufferWriter = requireWriter_buffer();
      protobuf.Reader = requireReader();
      protobuf.BufferReader = requireReader_buffer();
      protobuf.util = requireMinimal$1();
      protobuf.rpc = requireRpc();
      protobuf.roots = requireRoots();
      protobuf.configure = configure;
      function configure() {
        protobuf.util._configure();
        protobuf.Writer._configure(protobuf.BufferWriter);
        protobuf.Reader._configure(protobuf.BufferReader);
      }
      configure();
    })(indexMinimal);
    return indexMinimal;
  }
  var minimal;
  var hasRequiredMinimal;
  function requireMinimal() {
    if (hasRequiredMinimal) return minimal;
    hasRequiredMinimal = 1;
    minimal = requireIndexMinimal();
    return minimal;
  }
  var minimalExports = requireMinimal();
  const $Reader$2 = minimalExports.Reader, $Writer = minimalExports.Writer;
  const $root$2 = minimalExports.roots["default"] || (minimalExports.roots["default"] = {});
  const NextContinuation = $root$2.NextContinuation = (() => {
    function NextContinuation2(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    NextContinuation2.prototype.commentAreaWrapper = null;
    NextContinuation2.prototype.uField3 = 0;
    NextContinuation2.prototype.mainCommentRequest = null;
    NextContinuation2.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.commentAreaWrapper != null && Object.hasOwnProperty.call(m, "commentAreaWrapper"))
        $root$2.CommentAreaWrapper.encode(m.commentAreaWrapper, w.uint32(18).fork()).ldelim();
      if (m.uField3 != null && Object.hasOwnProperty.call(m, "uField3"))
        w.uint32(24).int32(m.uField3);
      if (m.mainCommentRequest != null && Object.hasOwnProperty.call(m, "mainCommentRequest"))
        $root$2.MainCommentRequest.encode(m.mainCommentRequest, w.uint32(50).fork()).ldelim();
      return w;
    };
    NextContinuation2.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.NextContinuation();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 2: {
            m.commentAreaWrapper = $root$2.CommentAreaWrapper.decode(r, r.uint32());
            break;
          }
          case 3: {
            m.uField3 = r.int32();
            break;
          }
          case 6: {
            m.mainCommentRequest = $root$2.MainCommentRequest.decode(r, r.uint32());
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return NextContinuation2;
  })();
  $root$2.CommentAreaWrapper = (() => {
    function CommentAreaWrapper(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    CommentAreaWrapper.prototype.videoId = "";
    CommentAreaWrapper.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.videoId != null && Object.hasOwnProperty.call(m, "videoId"))
        w.uint32(18).string(m.videoId);
      return w;
    };
    CommentAreaWrapper.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.CommentAreaWrapper();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 2: {
            m.videoId = r.string();
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return CommentAreaWrapper;
  })();
  $root$2.MainCommentRequest = (() => {
    function MainCommentRequest(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    MainCommentRequest.prototype.commentParameters = null;
    MainCommentRequest.prototype.commentReplyParameters = null;
    MainCommentRequest.prototype.sectionIdentifier = "";
    MainCommentRequest.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.commentReplyParameters != null && Object.hasOwnProperty.call(m, "commentReplyParameters"))
        $root$2.CommentReplyParameters.encode(m.commentReplyParameters, w.uint32(26).fork()).ldelim();
      if (m.commentParameters != null && Object.hasOwnProperty.call(m, "commentParameters"))
        $root$2.CommentParameters.encode(m.commentParameters, w.uint32(34).fork()).ldelim();
      if (m.sectionIdentifier != null && Object.hasOwnProperty.call(m, "sectionIdentifier"))
        w.uint32(66).string(m.sectionIdentifier);
      return w;
    };
    MainCommentRequest.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.MainCommentRequest();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 4: {
            m.commentParameters = $root$2.CommentParameters.decode(r, r.uint32());
            break;
          }
          case 3: {
            m.commentReplyParameters = $root$2.CommentReplyParameters.decode(r, r.uint32());
            break;
          }
          case 8: {
            m.sectionIdentifier = r.string();
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return MainCommentRequest;
  })();
  $root$2.CommentParameters = (() => {
    function CommentParameters(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    CommentParameters.prototype.videoId = "";
    CommentParameters.prototype.postId = "";
    CommentParameters.prototype.channelId = "";
    CommentParameters.prototype.sortType = 0;
    CommentParameters.prototype.targetCommentId = "";
    CommentParameters.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.videoId != null && Object.hasOwnProperty.call(m, "videoId"))
        w.uint32(34).string(m.videoId);
      if (m.sortType != null && Object.hasOwnProperty.call(m, "sortType"))
        w.uint32(48).int32(m.sortType);
      if (m.targetCommentId != null && Object.hasOwnProperty.call(m, "targetCommentId"))
        w.uint32(130).string(m.targetCommentId);
      if (m.postId != null && Object.hasOwnProperty.call(m, "postId"))
        w.uint32(234).string(m.postId);
      if (m.channelId != null && Object.hasOwnProperty.call(m, "channelId"))
        w.uint32(242).string(m.channelId);
      return w;
    };
    CommentParameters.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.CommentParameters();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 4: {
            m.videoId = r.string();
            break;
          }
          case 29: {
            m.postId = r.string();
            break;
          }
          case 30: {
            m.channelId = r.string();
            break;
          }
          case 6: {
            m.sortType = r.int32();
            break;
          }
          case 16: {
            m.targetCommentId = r.string();
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    CommentParameters.SortType = function() {
      const valuesById = {}, values = Object.create(valuesById);
      values[valuesById[0] = "HOT"] = 0;
      values[valuesById[1] = "LATEST"] = 1;
      return values;
    }();
    return CommentParameters;
  })();
  $root$2.CommentReplyParameters = (() => {
    function CommentReplyParameters(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    CommentReplyParameters.prototype.rootCommentId = "";
    CommentReplyParameters.prototype.channelId = "";
    CommentReplyParameters.prototype.videoId = "";
    CommentReplyParameters.prototype.postId = "";
    CommentReplyParameters.prototype.pageSize = 0;
    CommentReplyParameters.prototype.sortParam = null;
    CommentReplyParameters.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.rootCommentId != null && Object.hasOwnProperty.call(m, "rootCommentId"))
        w.uint32(18).string(m.rootCommentId);
      if (m.channelId != null && Object.hasOwnProperty.call(m, "channelId"))
        w.uint32(42).string(m.channelId);
      if (m.videoId != null && Object.hasOwnProperty.call(m, "videoId"))
        w.uint32(50).string(m.videoId);
      if (m.pageSize != null && Object.hasOwnProperty.call(m, "pageSize"))
        w.uint32(72).int32(m.pageSize);
      if (m.postId != null && Object.hasOwnProperty.call(m, "postId"))
        w.uint32(122).string(m.postId);
      if (m.sortParam != null && Object.hasOwnProperty.call(m, "sortParam"))
        $root$2.CommentReplyParameters.SortParam.encode(m.sortParam, w.uint32(130).fork()).ldelim();
      return w;
    };
    CommentReplyParameters.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.CommentReplyParameters();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 2: {
            m.rootCommentId = r.string();
            break;
          }
          case 5: {
            m.channelId = r.string();
            break;
          }
          case 6: {
            m.videoId = r.string();
            break;
          }
          case 15: {
            m.postId = r.string();
            break;
          }
          case 9: {
            m.pageSize = r.int32();
            break;
          }
          case 16: {
            m.sortParam = $root$2.CommentReplyParameters.SortParam.decode(r, r.uint32());
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    CommentReplyParameters.SortParam = function() {
      function SortParam(p) {
        if (p) {
          for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
            if (p[ks[i]] != null)
              this[ks[i]] = p[ks[i]];
        }
      }
      SortParam.prototype.sortType = 0;
      SortParam.encode = function encode(m, w) {
        if (!w)
          w = $Writer.create();
        if (m.sortType != null && Object.hasOwnProperty.call(m, "sortType"))
          w.uint32(8).int32(m.sortType);
        return w;
      };
      SortParam.decode = function decode(r, l, e) {
        if (!(r instanceof $Reader$2))
          r = $Reader$2.create(r);
        var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.CommentReplyParameters.SortParam();
        while (r.pos < c) {
          var t = r.uint32();
          if (t === e)
            break;
          switch (t >>> 3) {
            case 1: {
              m.sortType = r.int32();
              break;
            }
            default:
              r.skipType(t & 7);
              break;
          }
        }
        return m;
      };
      SortParam.SortType = function() {
        const valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAULT"] = 0;
        values[valuesById[1] = "HOT"] = 1;
        values[valuesById[2] = "LATEST"] = 2;
        return values;
      }();
      return SortParam;
    }();
    return CommentReplyParameters;
  })();
  const BrowserContinuation = $root$2.BrowserContinuation = (() => {
    function BrowserContinuation2(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    BrowserContinuation2.prototype.request = null;
    BrowserContinuation2.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.request != null && Object.hasOwnProperty.call(m, "request"))
        $root$2.BrowserContinuation.Request.encode(m.request, w.uint32(641815778).fork()).ldelim();
      return w;
    };
    BrowserContinuation2.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.BrowserContinuation();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 80226972: {
            m.request = $root$2.BrowserContinuation.Request.decode(r, r.uint32());
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    BrowserContinuation2.Request = function() {
      function Request2(p) {
        if (p) {
          for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
            if (p[ks[i]] != null)
              this[ks[i]] = p[ks[i]];
        }
      }
      Request2.prototype.description = "";
      Request2.prototype.continuationBase64 = "";
      Request2.encode = function encode(m, w) {
        if (!w)
          w = $Writer.create();
        if (m.description != null && Object.hasOwnProperty.call(m, "description"))
          w.uint32(18).string(m.description);
        if (m.continuationBase64 != null && Object.hasOwnProperty.call(m, "continuationBase64"))
          w.uint32(26).string(m.continuationBase64);
        return w;
      };
      Request2.decode = function decode(r, l, e) {
        if (!(r instanceof $Reader$2))
          r = $Reader$2.create(r);
        var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.BrowserContinuation.Request();
        while (r.pos < c) {
          var t = r.uint32();
          if (t === e)
            break;
          switch (t >>> 3) {
            case 2: {
              m.description = r.string();
              break;
            }
            case 3: {
              m.continuationBase64 = r.string();
              break;
            }
            default:
              r.skipType(t & 7);
              break;
          }
        }
        return m;
      };
      return Request2;
    }();
    return BrowserContinuation2;
  })();
  const BrowserCommentListContinuation = $root$2.BrowserCommentListContinuation = (() => {
    function BrowserCommentListContinuation2(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    BrowserCommentListContinuation2.prototype.description = "";
    BrowserCommentListContinuation2.prototype.mainCommentRequest = null;
    BrowserCommentListContinuation2.encode = function encode(m, w) {
      if (!w)
        w = $Writer.create();
      if (m.description != null && Object.hasOwnProperty.call(m, "description"))
        w.uint32(18).string(m.description);
      if (m.mainCommentRequest != null && Object.hasOwnProperty.call(m, "mainCommentRequest"))
        $root$2.MainCommentRequest.encode(m.mainCommentRequest, w.uint32(426).fork()).ldelim();
      return w;
    };
    BrowserCommentListContinuation2.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$2))
        r = $Reader$2.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$2.BrowserCommentListContinuation();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 2: {
            m.description = r.string();
            break;
          }
          case 53: {
            m.mainCommentRequest = $root$2.MainCommentRequest.decode(r, r.uint32());
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return BrowserCommentListContinuation2;
  })();
  const $Reader$1 = minimalExports.Reader;
  const $root$1 = minimalExports.roots["default"] || (minimalExports.roots["default"] = {});
  const CommentAction = $root$1.CommentAction = (() => {
    function CommentAction2(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    CommentAction2.prototype.action = 0;
    CommentAction2.prototype.commentId = "";
    CommentAction2.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader$1))
        r = $Reader$1.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root$1.CommentAction();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 1: {
            m.action = r.int32();
            break;
          }
          case 3: {
            m.commentId = r.string();
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return CommentAction2;
  })();
  $root$1.Action = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "DEFAULT"] = 0;
    values[valuesById[5] = "LIKE"] = 5;
    values[valuesById[6] = "DELETE"] = 6;
    return values;
  })();
  const $Reader = minimalExports.Reader;
  const $root = minimalExports.roots["default"] || (minimalExports.roots["default"] = {});
  const UpdateCommentParams = $root.UpdateCommentParams = (() => {
    function UpdateCommentParams2(p) {
      if (p) {
        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
          if (p[ks[i]] != null)
            this[ks[i]] = p[ks[i]];
      }
    }
    UpdateCommentParams2.prototype.commentId = "";
    UpdateCommentParams2.decode = function decode(r, l, e) {
      if (!(r instanceof $Reader))
        r = $Reader.create(r);
      var c = l === void 0 ? r.len : r.pos + l, m = new $root.UpdateCommentParams();
      while (r.pos < c) {
        var t = r.uint32();
        if (t === e)
          break;
        switch (t >>> 3) {
          case 1: {
            m.commentId = r.string();
            break;
          }
          default:
            r.skipType(t & 7);
            break;
        }
      }
      return m;
    };
    return UpdateCommentParams2;
  })();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("element-plus/dist/index.css");
  const _hoisted_1$4 = {
    key: 0,
    class: "hot-ban-checker"
  };
  const _hoisted_2$4 = { class: "message" };
  const _hoisted_3$4 = { class: "buttons" };
  const _hoisted_4$3 = { class: "actions" };
  const _sfc_main$5 = {
    __name: "CommentActions",
    props: ["comment"],
    emits: ["delete", "checkHotBan"],
    setup(__props, { emit: __emit }) {
      const props = __props;
      const emit = __emit;
      const comment = props.comment;
      const check2 = vue.inject("check");
      const hotBanCheck2 = vue.inject("hotBanCheck");
      const updating = vue.ref(false);
      const showHotBanChecker = vue.ref(false);
      const hotBanCheckerMessage = vue.ref("等待检查中……");
      let hotBanCheckerController = vue.reactive({ isCancelled: false });
      function updateState() {
        updating.value = true;
        check2(comment).then(() => {
          updating.value = false;
          ElementPlus.ElMessage({
            type: comment.currentState == "NORMAL" ? "success" : "warning",
            message: "更新成功，当前状态：" + translateState(comment.currentState)
          });
        }).catch((err) => {
          updating.value = false;
          let msg = err.message;
          if (msg == "COMMENT_AREA_CLOSED") {
            msg = "评论区已关闭";
          }
          ElementPlus.ElMessage.error("更新失败，因为：" + msg);
        });
      }
      function copyComment(commentText) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(commentText).then(() => {
            ElementPlus.ElMessage({
              message: "评论已复制到剪贴板",
              type: "success"
            });
          }).catch((err) => {
            ElementPlus.ElMessage.error("无法复制文本，因为: " + err);
          });
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = commentText;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand("copy");
            ElementPlus.ElMessage({
              message: "评论已复制到剪贴板",
              type: "success"
            });
          } catch (err) {
            ElementPlus.ElMessage.error("无法复制文本，因为: " + err);
          }
          document.body.removeChild(textArea);
        }
      }
      function askDelete() {
        ElementPlus.ElMessageBox.confirm("确定要删除这条记录吗（这不会删除你在YouTube上发布的评论）？删除操作无法撤销！").then(() => {
          emit("delete");
        }).catch(() => {
        });
      }
      async function toHotBanCheck() {
        if (Date.now() - comment.recordedTime < 120 * 1e3) {
          ElementPlus.ElMessage.warning(`当前时间距评论记录时间不足2分钟，状态不可信，请到 ${formatTimestamp(comment.recordedTime + 120 * 1e3)} 来检查`);
          return;
        }
        if (comment.commentId.indexOf(".") == -1) {
          try {
            await ElementPlus.ElMessageBox.confirm(
              "确认检查吗？该检查需要遍历热门评论区，请注意评论区的评论数量（总数大于3000的评论区慎重考虑）！数量太多将导致漫长的检查过程，同时频繁调用API可能会引发不可预料的后果！",
              "警告",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
              }
            );
          } catch (err) {
            return;
          }
        }
        hotBanCheckerMessage.value = "正在重新检查评论状态……";
        hotBanCheckerController.isCancelled = false;
        showHotBanChecker.value = true;
        try {
          await check2(comment);
          if (comment.currentState != "NORMAL") {
            ElementPlus.ElMessage.error(`评论状态重新检查后为${translateState(comment.currentState)}，无法继续进行检查`);
            showHotBanChecker.value = false;
            return;
          }
        } catch (err) {
          let msg = err.message;
          if (msg == "COMMENT_AREA_CLOSED") {
            msg = "评论区已关闭";
          }
          ElementPlus.ElMessage.error("检查失败，因为" + msg);
          showHotBanChecker.value = false;
          return;
        }
        let observer = {
          onCountChange(c, p) {
            hotBanCheckerMessage.value = `正在搜索热门列表，已搜寻至：第${c}个 第${p}页`;
          }
        };
        let notCancelled;
        try {
          notCancelled = await hotBanCheck2(comment, observer, hotBanCheckerController);
        } catch (err) {
          showHotBanChecker.value = false;
          ElementPlus.ElMessage.error(err.message);
          return;
        }
        if (notCancelled) {
          if (comment.hotBan) {
            ElementPlus.ElMessage.warning("你的评论未在热门列表找到，已被热门屏蔽，检查完成");
          } else {
            ElementPlus.ElMessage.success("你的评论已在热门列表找到，没有被热门屏蔽，检查完成");
          }
        }
        showHotBanChecker.value = false;
      }
      return (_ctx, _cache) => {
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          showHotBanChecker.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
            _cache[2] || (_cache[2] = vue.createElementVNode("div", { class: "title" }, "热门屏蔽检查", -1)),
            vue.createElementVNode("div", _hoisted_2$4, vue.toDisplayString(hotBanCheckerMessage.value), 1),
            vue.createElementVNode("div", _hoisted_3$4, [
              vue.createElementVNode("span", {
                onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(hotBanCheckerController).isCancelled = true)
              }, "终止检查")
            ])
          ])) : vue.createCommentVNode("", true),
          vue.createElementVNode("div", _hoisted_4$3, [
            vue.unref(comment).isUserDelete == false ? (vue.openBlock(), vue.createBlock(_component_el_button, {
              key: 0,
              type: "primary",
              plain: "",
              onClick: updateState,
              loading: updating.value
            }, {
              default: vue.withCtx(() => _cache[3] || (_cache[3] = [
                vue.createTextVNode("更新状态")
              ])),
              _: 1,
              __: [3]
            }, 8, ["loading"])) : vue.createCommentVNode("", true),
            vue.unref(comment).currentState == "NORMAL" ? (vue.openBlock(), vue.createBlock(_component_el_button, {
              key: 1,
              type: "primary",
              plain: "",
              onClick: toHotBanCheck
            }, {
              default: vue.withCtx(() => _cache[4] || (_cache[4] = [
                vue.createTextVNode("热门屏蔽检查")
              ])),
              _: 1,
              __: [4]
            })) : vue.createCommentVNode("", true),
            vue.createVNode(_component_el_button, {
              type: "primary",
              plain: "",
              onClick: _cache[1] || (_cache[1] = ($event) => copyComment(vue.unref(comment).content))
            }, {
              default: vue.withCtx(() => _cache[5] || (_cache[5] = [
                vue.createTextVNode("复制")
              ])),
              _: 1,
              __: [5]
            }),
            vue.createVNode(_component_el_button, {
              type: "danger",
              plain: "",
              onClick: askDelete
            }, {
              default: vue.withCtx(() => _cache[6] || (_cache[6] = [
                vue.createTextVNode("删除记录")
              ])),
              _: 1,
              __: [6]
            })
          ])
        ]);
      };
    }
  };
  const CommentActions = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-e5341f8d"]]);
  const _hoisted_1$3 = { class: "detail" };
  const _hoisted_2$3 = { class: "info-table" };
  const _hoisted_3$3 = { class: "comment-content" };
  const _hoisted_4$2 = { key: 0 };
  const _hoisted_5$2 = { key: 3 };
  const _hoisted_6$2 = { class: "comment-content" };
  const _hoisted_7$1 = { class: "pagination" };
  const pageSize = 20;
  const _sfc_main$4 = {
    __name: "CommentHistories",
    setup(__props) {
      const deleteComment2 = vue.inject("deleteComment");
      const db2 = vue.inject("db");
      const comments = vue.reactive([]);
      const loadingComments = vue.ref(false);
      const prevTime = vue.ref(null);
      const nextTime = vue.ref(null);
      var prevStack = [null];
      function loadComments(direction = "next") {
        loadingComments.value = true;
        comments.length = 0;
        let time = null;
        if (direction == "next") {
          time = nextTime.value;
          prevStack.push(time ? time : -1);
          prevTime.value = prevStack[prevStack.length - 2];
        } else if (direction == "prev") {
          time = prevStack[prevStack.length - 2];
          time = time == -1 ? null : time;
          prevStack.pop();
          prevTime.value = prevStack[prevStack.length - 2];
        }
        db2.transaction("comments").objectStore("comments").index("recordedTime").openCursor(time ? IDBKeyRange.upperBound(time) : null, "prev").onsuccess = (event) => {
          var cursor = event.target.result;
          if (cursor) {
            if (comments.length < pageSize) {
              comments.push(cursor.value);
              cursor.continue();
            } else {
              nextTime.value = cursor.value.recordedTime;
              loadingComments.value = false;
            }
          } else {
            nextTime.value = null;
            loadingComments.value = false;
          }
        };
      }
      loadComments();
      function formatStateDesc(comment) {
        switch (comment.currentState) {
          case "NORMAL":
            if (comment.hotBan === true) {
              return "热门屏蔽";
            } else if (comment.hotBan === false) {
              return "完全正常";
            } else {
              return "正常";
            }
          case "DELETED":
            if (comment.isUserDelete) {
              return "用户删除";
            } else {
              return "已删除";
            }
          case "SHADOW_BAN":
            return "仅自己可见";
          case "NOT_CHECK":
            return "还未检查";
        }
      }
      function formatCommentArea(comment, needEmojiHead) {
        var commentAreaInfo = comment.commentAreaInfo;
        switch (comment.webPageType) {
          case "WEB_PAGE_TYPE_WATCH":
            return "📺 " + commentAreaInfo.videoId;
          case "WEB_PAGE_TYPE_BROWSE":
            return "📰" + commentAreaInfo.postId;
        }
      }
      function formatHotBan(hotBan) {
        if (hotBan == null) {
          return "未检查";
        }
        return hotBan ? "是" : "否";
      }
      function deleteCommentItem(comment) {
        deleteComment2(comment.commentId).then(() => {
          const index = comments.findIndex((item) => item.commentId == comment.commentId);
          if (index !== -1) {
            comments.splice(index, 1);
            ElementPlus.ElMessage.success("评论删除成功");
          }
        }).catch((err) => {
          ElementPlus.ElMessage.error("评论删除失败");
          console.error("delete comment from database failed", err);
        });
      }
      return (_ctx, _cache) => {
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_link = vue.resolveComponent("el-link");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_table, {
            data: comments,
            "row-key": "commentId",
            height: "100%",
            class: "comment-list"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_table_column, {
                prop: "content",
                label: "评论内容",
                align: "left",
                "show-overflow-tooltip": ""
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "state",
                label: "当前状态",
                align: "center",
                width: "136",
                formatter: formatStateDesc
              }),
              vue.createVNode(_component_el_table_column, {
                prop: "recordedTime",
                label: "记录时间",
                align: "center",
                width: "160",
                formatter: (comment) => vue.unref(formatTimestamp)(comment.recordedTime)
              }, null, 8, ["formatter"]),
              vue.createVNode(_component_el_table_column, {
                prop: "area",
                label: "所在评论区",
                align: "center",
                width: "240"
              }, {
                default: vue.withCtx(({ row }) => [
                  vue.createElementVNode("div", null, [
                    vue.createVNode(_component_el_link, {
                      type: "primary",
                      href: row.url,
                      class: vue.normalizeClass(["locate-link", { "post-locate-link": row.webPageType == "WEB_PAGE_TYPE_BROWSE" }])
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(formatCommentArea(row)), 1)
                      ]),
                      _: 2
                    }, 1032, ["href", "class"])
                  ])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_table_column, { type: "expand" }, {
                default: vue.withCtx(({ row }) => [
                  vue.createElementVNode("div", _hoisted_1$3, [
                    vue.createElementVNode("table", _hoisted_2$3, [
                      vue.createElementVNode("tbody", null, [
                        vue.createElementVNode("tr", null, [
                          _cache[2] || (_cache[2] = vue.createElementVNode("td", null, "评论内容", -1)),
                          vue.createElementVNode("td", _hoisted_3$3, vue.toDisplayString(row.content), 1)
                        ]),
                        vue.createElementVNode("tr", null, [
                          _cache[3] || (_cache[3] = vue.createElementVNode("td", null, "当前状态", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(vue.unref(translateState)(row.currentState)), 1)
                        ]),
                        row.currentState == "DELETED" ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_4$2, [
                          _cache[4] || (_cache[4] = vue.createElementVNode("td", null, "用户删除", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(row.isUserDelete ? "是" : "否"), 1)
                        ])) : vue.createCommentVNode("", true),
                        vue.createElementVNode("tr", null, [
                          _cache[5] || (_cache[5] = vue.createElementVNode("td", null, "热门屏蔽", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(formatHotBan(row.hotBan)), 1)
                        ]),
                        vue.createElementVNode("tr", null, [
                          _cache[6] || (_cache[6] = vue.createElementVNode("td", null, "发送者", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(row.displayName), 1)
                        ]),
                        vue.createElementVNode("tr", null, [
                          _cache[7] || (_cache[7] = vue.createElementVNode("td", null, "评论ID", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(row.commentId), 1)
                        ]),
                        row.webPageType == "WEB_PAGE_TYPE_WATCH" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                          _cache[9] || (_cache[9] = vue.createElementVNode("tr", null, [
                            vue.createElementVNode("td", null, "评论区类型"),
                            vue.createElementVNode("td", null, "视频")
                          ], -1)),
                          vue.createElementVNode("tr", null, [
                            _cache[8] || (_cache[8] = vue.createElementVNode("td", null, "视频ID", -1)),
                            vue.createElementVNode("td", null, vue.toDisplayString(row.commentAreaInfo.videoId), 1)
                          ])
                        ], 64)) : row.webPageType == "WEB_PAGE_TYPE_BROWSE" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
                          _cache[12] || (_cache[12] = vue.createElementVNode("tr", null, [
                            vue.createElementVNode("td", null, "评论区类型"),
                            vue.createElementVNode("td", null, "帖子")
                          ], -1)),
                          vue.createElementVNode("tr", null, [
                            _cache[10] || (_cache[10] = vue.createElementVNode("td", null, "帖子所属频道ID", -1)),
                            vue.createElementVNode("td", null, vue.toDisplayString(row.commentAreaInfo.channelId), 1)
                          ]),
                          vue.createElementVNode("tr", null, [
                            _cache[11] || (_cache[11] = vue.createElementVNode("td", null, "帖子ID", -1)),
                            vue.createElementVNode("td", null, vue.toDisplayString(row.commentAreaInfo.postId), 1)
                          ])
                        ], 64)) : vue.createCommentVNode("", true),
                        vue.createElementVNode("tr", null, [
                          _cache[13] || (_cache[13] = vue.createElementVNode("td", null, "点赞数", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(row.likeCount), 1)
                        ]),
                        row.commentId.indexOf(".") == -1 ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_5$2, [
                          _cache[14] || (_cache[14] = vue.createElementVNode("td", null, "回复数", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(row.replyCount), 1)
                        ])) : vue.createCommentVNode("", true),
                        vue.createElementVNode("tr", null, [
                          _cache[15] || (_cache[15] = vue.createElementVNode("td", null, "记录时间", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(vue.unref(formatTimestamp)(row.recordedTime)), 1)
                        ]),
                        vue.createElementVNode("tr", null, [
                          _cache[16] || (_cache[16] = vue.createElementVNode("td", null, "更新时间", -1)),
                          vue.createElementVNode("td", null, vue.toDisplayString(vue.unref(formatTimestamp)(row.updatedTime)), 1)
                        ])
                      ])
                    ]),
                    vue.createElementVNode("details", null, [
                      _cache[17] || (_cache[17] = vue.createElementVNode("summary", null, "历史检查记录", -1)),
                      vue.createVNode(_component_el_table, {
                        data: row.histories,
                        style: { "width": "100%" }
                      }, {
                        default: vue.withCtx(() => [
                          vue.createVNode(_component_el_table_column, {
                            prop: "time",
                            label: "时间戳",
                            width: "160",
                            formatter: (history) => vue.unref(formatTimestamp)(history.time)
                          }, null, 8, ["formatter"]),
                          vue.createVNode(_component_el_table_column, {
                            prop: "state",
                            label: "状态",
                            width: "136",
                            formatter: (history) => vue.unref(translateState)(history.state)
                          }, null, 8, ["formatter"]),
                          vue.createVNode(_component_el_table_column, {
                            prop: "hotBan",
                            label: "热门屏蔽",
                            width: "120",
                            formatter: (history) => formatHotBan(history.hotBan)
                          }, null, 8, ["formatter"]),
                          vue.createVNode(_component_el_table_column, {
                            prop: "content",
                            label: "评论内容",
                            "show-overflow-tooltip": ""
                          }),
                          vue.createVNode(_component_el_table_column, { type: "expand" }, {
                            default: vue.withCtx(({ row: row2 }) => [
                              vue.createElementVNode("div", _hoisted_6$2, vue.toDisplayString(row2.content), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["data"])
                    ]),
                    vue.createVNode(CommentActions, {
                      comment: row,
                      onDelete: ($event) => deleteCommentItem(row)
                    }, null, 8, ["comment", "onDelete"])
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["data"]),
          vue.createElementVNode("div", _hoisted_7$1, [
            prevTime.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
              key: 0,
              onClick: _cache[0] || (_cache[0] = ($event) => loadComments("prev")),
              disabled: loadingComments.value
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("< " + vue.toDisplayString(prevTime.value == -1 ? "NOW" : vue.unref(formatTimestamp)(prevTime.value)), 1)
              ]),
              _: 1
            }, 8, ["disabled"])) : vue.createCommentVNode("", true),
            nextTime.value ? (vue.openBlock(), vue.createBlock(_component_el_button, {
              key: 1,
              onClick: _cache[1] || (_cache[1] = ($event) => loadComments("next")),
              disabled: loadingComments.value
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode(vue.toDisplayString(vue.unref(formatTimestamp)(nextTime.value)) + " >", 1)
              ]),
              _: 1
            }, 8, ["disabled"])) : vue.createCommentVNode("", true)
          ])
        ], 64);
      };
    }
  };
  const CommentHistories = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-80f074da"]]);
  function createVideoRootCommentListContinuation(channelId, videoId, isLatestSort) {
    let payload = {
      uField3: 6,
      commentAreaWrapper: {
        videoId
      },
      mainCommentRequest: {
        sectionIdentifier: "comments-section",
        commentParameters: {
          videoId,
          sortType: isLatestSort ? 1 : 0
        }
      }
    };
    return u8ArrayToBase64(NextContinuation.encode(payload).finish());
  }
  function createVideoReplyCommentListContinuation(channelId, videoId, rootCommentId, isLatestSort) {
    let payload = {
      uField3: 6,
      commentAreaWrapper: {
        videoId
      },
      mainCommentRequest: {
        sectionIdentifier: `comment-replies-item-${rootCommentId}`,
        commentReplyParameters: {
          rootCommentId,
          channelId,
          videoId,
          pageSize: 10,
          sortParam: {
            sortType: 1
          }
        }
      }
    };
    return u8ArrayToBase64(NextContinuation.encode(payload).finish());
  }
  function createPostRootCommentListContinuation(channelId, postId, isLatestSort) {
    let payload = {
      description: "community",
      mainCommentRequest: {
        sectionIdentifier: "comments-section",
        commentParameters: {
          channelId,
          postId,
          sortType: isLatestSort ? 1 : 0
        }
      }
    };
    let continuation = u8ArrayToBase64(BrowserCommentListContinuation.encode(payload).finish());
    payload = {
      request: {
        description: "FEcomment_post_detail_page_web_top_level",
        continuationBase64: continuation
      }
    };
    return u8ArrayToBase64(BrowserContinuation.encode(payload).finish());
  }
  function createPostReplyCommentListContinuation(channelId, postId, rootCommentId, isLatestSort) {
    let payload = {
      description: "community",
      mainCommentRequest: {
        sectionIdentifier: `comment-replies-item-${rootCommentId}`,
        commentReplyParameters: {
          rootCommentId,
          channelId,
          postId,
          pageSize: 10,
          sortParam: {
            sortType: 1
          }
        }
      }
    };
    let continuation = u8ArrayToBase64(BrowserCommentListContinuation.encode(payload).finish());
    payload = {
      request: {
        description: "FEcomment_post_detail_page_web_replies_page",
        continuationBase64: continuation
      }
    };
    return u8ArrayToBase64(BrowserContinuation.encode(payload).finish());
  }
  function findNextContinuation(data) {
    var _a, _b, _c, _d;
    let continuation = null;
    for (const endpoint of data.onResponseReceivedEndpoints) {
      const items = ((_a = endpoint.appendContinuationItemsAction) == null ? void 0 : _a.continuationItems) || ((_b = endpoint.reloadContinuationItemsCommand) == null ? void 0 : _b.continuationItems);
      if (!items) continue;
      for (const item of items) {
        const continuationItemRenderer = item.continuationItemRenderer;
        if (!continuationItemRenderer) continue;
        const token = (_d = (_c = continuationItemRenderer == null ? void 0 : continuationItemRenderer.continuationEndpoint) == null ? void 0 : _c.continuationCommand) == null ? void 0 : _d.token;
        if (!token) {
          continuation = continuationItemRenderer == null ? void 0 : continuationItemRenderer.button.buttonRenderer.command.continuationCommand.token;
        }
        if (token) {
          continuation = token;
          break;
        }
      }
      if (continuation) break;
    }
    return continuation;
  }
  const _hoisted_1$2 = { class: "youtube-comment" };
  const _hoisted_2$2 = { class: "avatar-container" };
  const _hoisted_3$2 = ["href"];
  const _hoisted_4$1 = ["src", "alt"];
  const _hoisted_5$1 = { class: "comment-content" };
  const _hoisted_6$1 = { class: "comment-header" };
  const _hoisted_7 = ["href"];
  const _hoisted_8 = { class: "published-at" };
  const _hoisted_9 = { class: "comment-text" };
  const _hoisted_10 = { class: "comment-actions" };
  const _hoisted_11 = { class: "action-text" };
  const _hoisted_12 = { class: "action-text" };
  const _hoisted_13 = ["href"];
  const _sfc_main$3 = {
    __name: "YouTubeComment",
    props: ["comment"],
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("a", {
              href: "https://www.youtube.com/" + __props.comment.userDisplayName,
              target: "_blank",
              rel: "noopener noreferrer"
            }, [
              vue.createElementVNode("img", {
                src: __props.comment.userProfileImageUrl,
                alt: __props.comment.authorDisplayName,
                class: "avatar"
              }, null, 8, _hoisted_4$1)
            ], 8, _hoisted_3$2)
          ]),
          vue.createElementVNode("div", _hoisted_5$1, [
            vue.createElementVNode("div", _hoisted_6$1, [
              vue.createElementVNode("a", {
                href: "https://www.youtube.com/" + __props.comment.userDisplayName,
                target: "_blank",
                rel: "noopener noreferrer",
                class: "author-name"
              }, vue.toDisplayString(__props.comment.userDisplayName), 9, _hoisted_7),
              vue.createElementVNode("span", _hoisted_8, vue.toDisplayString(__props.comment.publishedTime), 1)
            ]),
            vue.createElementVNode("p", _hoisted_9, vue.toDisplayString(__props.comment.contentText), 1),
            vue.createElementVNode("div", _hoisted_10, [
              vue.createElementVNode("button", {
                class: "button",
                onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(ElementPlus.ElMessage).info("需要点赞评论请定位至评论"))
              }, [
                _cache[2] || (_cache[2] = vue.createElementVNode("svg", {
                  class: "icon",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24"
                }, [
                  vue.createElementVNode("path", { d: "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.31C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" })
                ], -1)),
                vue.createElementVNode("span", _hoisted_11, vue.toDisplayString(__props.comment.likeCount), 1)
              ]),
              vue.createElementVNode("button", {
                class: "button",
                onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(ElementPlus.ElMessage).info("需要查看回复请定位评论查看"))
              }, [
                _cache[3] || (_cache[3] = vue.createElementVNode("svg", {
                  t: "1756005965374",
                  class: "icon",
                  viewBox: "0 0 1024 1024",
                  version: "1.1",
                  xmlns: "http://www.w3.org/2000/svg",
                  "p-id": "5216",
                  width: "200",
                  height: "200"
                }, [
                  vue.createElementVNode("path", {
                    d: "M1024 640l-3.5 41.6c-6.5 78.1-27.7 154-62.2 223.9-7.5 15.2-30.4 10-30.4-7V800c0-61.9-25.1-117.9-65.6-158.4C821.9 601.1 765.9 576 704 576H552c-4.4 0-8 3.6-8 8v179.6c0 13.9-16.5 21.2-26.8 11.8L160 447.9 516.5 76.7c10-10.4 27.5-3.3 27.5 11.1V280c0 4.4 3.6 8 8 8h120c97.2 0 185.2 39.4 248.9 103.1S1024 542.8 1024 640z",
                    "p-id": "5217"
                  }),
                  vue.createElementVNode("path", {
                    d: "M356.7 95.1L0 453.1l357.3 326.1c10.3 9.4 26.8 2.1 26.8-11.8 0-32.1-13.5-62.7-37.2-84.4L92.5 450.9l258.2-259.1c21.3-21.4 33.3-50.4 33.3-80.6v-4.8c0-14.3-17.3-21.4-27.3-11.3z",
                    "p-id": "5218"
                  })
                ], -1)),
                vue.createElementVNode("span", _hoisted_12, vue.toDisplayString(__props.comment.replyCount), 1)
              ]),
              vue.createElementVNode("a", {
                class: "button",
                href: __props.comment.url,
                target: "_blank"
              }, _cache[4] || (_cache[4] = [
                vue.createElementVNode("svg", {
                  t: "1756007306700",
                  class: "icon",
                  viewBox: "0 0 1024 1024",
                  version: "1.1",
                  xmlns: "http://www.w3.org/2000/svg",
                  "p-id": "7302",
                  width: "200",
                  height: "200"
                }, [
                  vue.createElementVNode("path", {
                    d: "M511.36599 512.177066m-201.557982 0a201.557983 201.557983 0 1 0 403.115965 0 201.557983 201.557983 0 1 0-403.115965 0Z",
                    "p-id": "7303"
                  }),
                  vue.createElementVNode("path", {
                    d: "M990.163299 477.654949h-78.434431a34.350763 34.350763 0 0 0-5.883154 0.514062c-16.278629-191.288167-168.532358-343.770368-359.706288-360.357433a33.619652 33.619652 0 0 0 0.376979-5.060655V34.270797a34.270797 34.270797 0 0 0-68.541595 0v78.434432a35.059026 35.059026 0 0 0 0.354132 4.923571c-191.790805 15.844532-344.798492 168.372427-361.385558 359.957608a34.556387 34.556387 0 0 0-4.226732-0.274167H34.270797a34.270797 34.270797 0 1 0 0 68.541595h78.445855a32.762882 32.762882 0 0 0 4.12392-0.262743c16.02731 192.076395 169.217774 345.17547 361.328439 361.134239a34.853401 34.853401 0 0 0-0.308437 4.569439v78.434432a34.270797 34.270797 0 0 0 68.541595 0v-78.480126a34.670623 34.670623 0 0 0-0.319861-4.649405c191.368132-16.621337 343.747521-169.377704 359.843372-360.905766a35.001908 35.001908 0 0 0 5.837459 0.502638h78.434431a34.270797 34.270797 0 0 0 34.270798-34.270797 34.270797 34.270797 0 0 0-34.305069-34.270798z m-177.065786 161.940941a328.656946 328.656946 0 1 1 25.703098-127.418824 326.440768 326.440768 0 0 1-25.748792 127.418824z",
                    "p-id": "7304"
                  })
                ], -1),
                vue.createElementVNode("span", { class: "action-text" }, "定位", -1)
              ]), 8, _hoisted_13)
            ]),
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ]);
      };
    }
  };
  const YouTubeComment = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2a518d4b"]]);
  const _hoisted_1$1 = { class: "hot-ban-comment-searcher" };
  const _hoisted_2$1 = {
    key: 1,
    class: "warning"
  };
  const _hoisted_3$1 = {
    key: 2,
    class: "search-progress"
  };
  const _hoisted_4 = { "infinite-scroll-distance": 500 };
  const _hoisted_5 = { class: "footer" };
  const _hoisted_6 = { key: 1 };
  const _sfc_main$2 = {
    __name: "HotBanCommentSearcher",
    setup(__props) {
      const originalFetch2 = vue.inject("originalFetch");
      const getAuthorization2 = vue.inject("getAuthorization");
      const getContext2 = vue.inject("getContext");
      const showNcs = vue.ref(true);
      const showWarning = vue.ref(false);
      const showSearchProgress = vue.ref(false);
      const showResults = vue.ref(false);
      const progressMsg = vue.ref("加载中...");
      const comments = vue.reactive([]);
      const hasNext = vue.ref(true);
      const loading = vue.ref(false);
      const progStatus = vue.ref("");
      let nextContinuation;
      let cancelled = false;
      let hotCommentIdSet2 = /* @__PURE__ */ new Set();
      let url = createUrl();
      let api;
      let channelId;
      let TYPE = null;
      if (url.searchParams.has("v")) {
        TYPE = "WEB_PAGE_TYPE_WATCH";
        api = "https://www.youtube.com/youtubei/v1/next?prettyPrint=false";
      } else if (url.pathname.split("/").includes("post")) {
        TYPE = "WEB_PAGE_TYPE_BROWSE";
        api = "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false";
      }
      if (TYPE) {
        showNcs.value = false;
        showWarning.value = true;
      }
      async function onSearch() {
        var _a, _b;
        showWarning.value = false;
        showSearchProgress.value = true;
        let continuation = null;
        if (TYPE === "WEB_PAGE_TYPE_WATCH") {
          continuation = createVideoRootCommentListContinuation(null, url.searchParams.get("v"), false);
          nextContinuation = createVideoRootCommentListContinuation(null, url.searchParams.get("v"), true);
        } else if (TYPE === "WEB_PAGE_TYPE_BROWSE") {
          channelId = (_b = (_a = ytInitialData.metadata) == null ? void 0 : _a.channelMetadataRenderer) == null ? void 0 : _b.externalId;
          if (!channelId) {
            progressMsg.value = "无法获取频道ID，请尝试刷新页面后重试！";
          }
          continuation = createPostRootCommentListContinuation(channelId, url.pathname.split("/")[2], false);
          nextContinuation = createPostRootCommentListContinuation(channelId, url.pathname.split("/")[2], true);
        }
        let count = 0;
        while (continuation) {
          let data = {
            context: getContext2(),
            continuation
          };
          let options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              //因为我搜索的是别人的热门屏蔽评论，所以带上认证信息也没啥（还能减轻风控？）
              authorization: getAuthorization2()
            }
          };
          if (cancelled) {
            return;
          }
          let response;
          try {
            response = await (await originalFetch2(api, options)).json();
          } catch (err) {
            progressMsg.value = "获取热门列表失败，您可以关闭后重试！";
            return;
          }
          let mutations = response.frameworkUpdates.entityBatchUpdate.mutations;
          for (let mutation of mutations) {
            if (mutation.payload.commentEntityPayload) {
              hotCommentIdSet2.add(mutation.payload.commentEntityPayload.properties.commentId);
              count++;
              progressMsg.value = `正在获取热门评论（已获取 ${count} 个）……`;
            }
          }
          continuation = findNextContinuation(response);
        }
        next();
      }
      async function next() {
        var _a, _b, _c, _d, _e;
        if (!hasNext.value || loading.value || cancelled) {
          return;
        }
        loading.value = true;
        showSearchProgress.value = false;
        showResults.value = true;
        let count = 0;
        while (count < 20) {
          let data = {
            context: getContext2(),
            continuation: nextContinuation
          };
          let options = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              authorization: getAuthorization2()
            }
          };
          if (cancelled) {
            return;
          }
          let response;
          try {
            response = await (await originalFetch2(api, options)).json();
          } catch (err) {
            progStatus.value = "exception";
            return;
          }
          nextContinuation = null;
          for (const endpoint of response.onResponseReceivedEndpoints) {
            const items = ((_a = endpoint.appendContinuationItemsAction) == null ? void 0 : _a.continuationItems) || ((_b = endpoint.reloadContinuationItemsCommand) == null ? void 0 : _b.continuationItems);
            if (!items) continue;
            for (const item of items) {
              const token = (_e = (_d = (_c = item.continuationItemRenderer) == null ? void 0 : _c.continuationEndpoint) == null ? void 0 : _d.continuationCommand) == null ? void 0 : _e.token;
              if (token) {
                nextContinuation = token;
                break;
              }
            }
            if (nextContinuation) break;
          }
          let mutations = response.frameworkUpdates.entityBatchUpdate.mutations;
          for (let i = 0; i < mutations.length; i++) {
            let mutation = mutations[i];
            if (mutation.payload.commentEntityPayload) {
              let entity = mutation.payload.commentEntityPayload;
              let commentId = entity.properties.commentId;
              if (!hotCommentIdSet2.has(commentId)) {
                let likeCount = parseInt(entity.toolbar.likeCountNotliked);
                likeCount = likeCount ? likeCount : 0;
                let replyCount = parseInt(entity.toolbar.replyCount);
                replyCount = replyCount ? replyCount : 0;
                let url2 = mutations[i + 1].payload.commentSurfaceEntityPayload.publishedTimeCommand.innertubeCommand.commandMetadata.webCommandMetadata.url;
                count++;
                comments.push({
                  commentId,
                  url: url2,
                  userDisplayName: entity.author.displayName,
                  userProfileImageUrl: entity.avatar.image.sources[0].url,
                  likeCount,
                  replyCount,
                  publishedTime: entity.properties.publishedTime,
                  contentText: entity.properties.content.content
                });
              }
            }
          }
          if (!nextContinuation) {
            hasNext.value = false;
            break;
          }
        }
        loading.value = false;
      }
      vue.onUnmounted(() => {
        cancelled = true;
      });
      return (_ctx, _cache) => {
        const _component_el_empty = vue.resolveComponent("el-empty");
        const _component_el_divider = vue.resolveComponent("el-divider");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_progress = vue.resolveComponent("el-progress");
        const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
        const _directive_infinite_scroll = vue.resolveDirective("infinite-scroll");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          showNcs.value ? (vue.openBlock(), vue.createBlock(_component_el_empty, {
            key: 0,
            description: "请在有评论区（视频、帖子）的页面使用此功能",
            class: "not-comment-section"
          })) : vue.createCommentVNode("", true),
          showWarning.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, [
            _cache[1] || (_cache[1] = vue.createElementVNode("svg", {
              t: "1756953289758",
              class: "warn-icon",
              viewBox: "0 0 1024 1024",
              version: "1.1",
              xmlns: "http://www.w3.org/2000/svg",
              "p-id": "4518",
              width: "64",
              height: "64"
            }, [
              vue.createElementVNode("path", {
                d: "M1001.661867 796.544c48.896 84.906667 7.68 157.013333-87.552 157.013333H110.781867c-97.834667 0-139.050667-69.504-90.112-157.013333l401.664-666.88c48.896-87.552 128.725333-87.552 177.664 0l401.664 666.88zM479.165867 296.533333v341.333334a32 32 0 1 0 64 0v-341.333334a32 32 0 1 0-64 0z m0 469.333334v42.666666a32 32 0 1 0 64 0v-42.666666a32 32 0 1 0-64 0z",
                fill: "#FAAD14",
                "p-id": "4519"
              })
            ], -1)),
            _cache[2] || (_cache[2] = vue.createElementVNode("h2", { class: "warning-title" }, "警告", -1)),
            _cache[3] || (_cache[3] = vue.createElementVNode("p", { class: "warning-text" }, [
              vue.createTextVNode("将会获取所有热门评论，之后懒加载按时间评论"),
              vue.createElementVNode("br"),
              vue.createTextVNode(" 评论区数量过多（例如超过 5000 条），获取热门评论的过程将非常漫长，且过多的API调用可能导致不可预料的后果，请酌情使用！ ")
            ], -1)),
            vue.createVNode(_component_el_divider, { class: "warning-divider" }),
            vue.createVNode(_component_el_button, {
              type: "primary",
              onClick: onSearch
            }, {
              default: vue.withCtx(() => _cache[0] || (_cache[0] = [
                vue.createTextVNode("搜索")
              ])),
              _: 1,
              __: [0]
            })
          ])) : vue.createCommentVNode("", true),
          showSearchProgress.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$1, [
            vue.createElementVNode("p", null, vue.toDisplayString(progressMsg.value), 1),
            vue.createVNode(_component_el_progress, {
              percentage: 50,
              indeterminate: true,
              "show-text": false
            })
          ])) : vue.createCommentVNode("", true),
          showResults.value ? (vue.openBlock(), vue.createBlock(_component_el_scrollbar, {
            key: 3,
            class: "search-results"
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", _hoisted_4, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(comments, (comment) => {
                  return vue.openBlock(), vue.createBlock(YouTubeComment, {
                    key: comment.commentId,
                    comment
                  }, null, 8, ["comment"]);
                }), 128)),
                vue.createElementVNode("div", _hoisted_5, [
                  loading.value ? (vue.openBlock(), vue.createBlock(_component_el_progress, {
                    key: 0,
                    percentage: 50,
                    indeterminate: true,
                    "show-text": false,
                    status: progStatus.value,
                    duration: 1
                  }, null, 8, ["status"])) : vue.createCommentVNode("", true),
                  !hasNext.value ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6, "- PAGE END -")) : vue.createCommentVNode("", true)
                ])
              ])), [
                [_directive_infinite_scroll, next]
              ])
            ]),
            _: 1
          })) : vue.createCommentVNode("", true)
        ]);
      };
    }
  };
  const HotBanCommentSearcher = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-3991f641"]]);
  /*!
   * pinia v3.0.3
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia2) => activePinia = pinia2;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia2 = vue.markRaw({
      install(app) {
        setActivePinia(pinia2);
        pinia2._a = app;
        app.provide(piniaSymbol, pinia2);
        app.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      },
      use(plugin) {
        if (!this._a) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia2;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  const ACTION_MARKER = Symbol();
  const ACTION_NAME = Symbol();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    } else if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia2, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia2.state.value[id];
    let store;
    function setup() {
      if (!initialState && true) {
        pinia2.state.value[id] = state ? state() : {};
      }
      const localState = vue.toRefs(pinia2.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia2);
          const store2 = pinia2._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia2, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    const $subscribeOptions = { deep: true };
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia2.state.value[$id];
    if (!isOptionsStore && !initialState && true) {
      pinia2.state.value[$id] = {};
    }
    vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia2.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      noop
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia2._s.delete($id);
    }
    const action = (fn, name = "") => {
      if (ACTION_MARKER in fn) {
        fn[ACTION_NAME] = name;
        return fn;
      }
      const wrappedAction = function() {
        setActivePinia(pinia2);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name: wrappedAction[ACTION_NAME],
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = fn.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
      wrappedAction[ACTION_MARKER] = true;
      wrappedAction[ACTION_NAME] = name;
      return wrappedAction;
    };
    const partialStore = {
      _p: pinia2,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia2.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(partialStore);
    pinia2._s.set($id, store);
    const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia2._e.run(() => (scope = vue.effectScope()).run(() => setup({ action }))));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          pinia2.state.value[$id][key] = prop;
        }
      } else if (typeof prop === "function") {
        const actionValue = action(prop, key);
        setupStore[key] = actionValue;
        optionsForPlugin.actions[key] = prop;
      } else ;
    }
    assign(store, setupStore);
    assign(vue.toRaw(store), setupStore);
    Object.defineProperty(store, "$state", {
      get: () => pinia2.state.value[$id],
      set: (state) => {
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    pinia2._p.forEach((extender) => {
      {
        assign(store, scope.run(() => extender({
          store,
          app: pinia2._a,
          pinia: pinia2,
          options: optionsForPlugin
        })));
      }
    });
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  /*! #__NO_SIDE_EFFECTS__ */
  // @__NO_SIDE_EFFECTS__
  function defineStore(id, setup, setupOptions) {
    let options;
    const isSetupStore = typeof setup === "function";
    options = isSetupStore ? setupOptions : setup;
    function useStore(pinia2, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia2 || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia2)
        setActivePinia(pinia2);
      pinia2 = activePinia;
      if (!pinia2._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia2);
        } else {
          createOptionsStore(id, options, pinia2);
        }
      }
      const store = pinia2._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useSettingsStore = /* @__PURE__ */ defineStore("settings", {
    state: () => {
      return JSON.parse(localStorage.getItem("yt-ccd-settings")) || {
        forceTimeSort: false,
        showBlockedHotComments: false
      };
    }
  });
  const _hoisted_1 = { class: "settings-container" };
  const _hoisted_2 = { class: "setting-item" };
  const _hoisted_3 = { class: "setting-item" };
  const _sfc_main$1 = {
    __name: "Settings",
    setup(__props) {
      const settings2 = useSettingsStore();
      vue.watch(() => settings2.$state, (newState) => {
        localStorage.setItem("yt-ccd-settings", JSON.stringify(newState));
      }, { deep: true });
      return (_ctx, _cache) => {
        const _component_el_switch = vue.resolveComponent("el-switch");
        const _component_el_divider = vue.resolveComponent("el-divider");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          _cache[4] || (_cache[4] = vue.createElementVNode("h2", { class: "title" }, "二级评论（回复/楼中楼）", -1)),
          vue.createElementVNode("div", _hoisted_2, [
            _cache[2] || (_cache[2] = vue.createElementVNode("div", { class: "setting-info" }, [
              vue.createElementVNode("span", { class: "setting-label" }, "二级评论列表强制最新排序"),
              vue.createElementVNode("p", { class: "setting-desc" }, "无论评论区的排序方式如何，二级评论始终按最新排序")
            ], -1)),
            vue.createVNode(_component_el_switch, {
              modelValue: vue.unref(settings2).forceTimeSort,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(settings2).forceTimeSort = $event)
            }, null, 8, ["modelValue"])
          ]),
          vue.createVNode(_component_el_divider),
          vue.createElementVNode("div", _hoisted_3, [
            _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "setting-info" }, [
              vue.createElementVNode("span", { class: "setting-label" }, "搜索并显示被热门屏蔽的二级评论"),
              vue.createElementVNode("p", { class: "setting-desc" }, "在前者的基础上，先获取一次所有的热门评论，最新排序的评论若热门列表没有，则标注“（热门屏蔽的）”")
            ], -1)),
            vue.createVNode(_component_el_switch, {
              modelValue: vue.unref(settings2).showBlockedHotComments,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(settings2).showBlockedHotComments = $event),
              disabled: !vue.unref(settings2).forceTimeSort
            }, null, 8, ["modelValue", "disabled"])
          ])
        ]);
      };
    }
  };
  const Settings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ccc2713e"]]);
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      let historiesVisible = vue.ref(false);
      let searchHotBanVisible = vue.ref(false);
      let settingsVisible = vue.ref(false);
      const menuListener = vue.inject("menuListener");
      menuListener.onOpenHistory = () => {
        historiesVisible.value = true;
      };
      menuListener.onSearchHotBan = () => {
        searchHotBanVisible.value = true;
      };
      menuListener.onOpenSettings = () => {
        settingsVisible.value = true;
      };
      return (_ctx, _cache) => {
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createElementBlock("div", null, [
          vue.createVNode(_component_el_dialog, {
            modelValue: vue.unref(historiesVisible),
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(historiesVisible) ? historiesVisible.value = $event : historiesVisible = $event),
            "z-index": 3e3,
            title: "历史评论列表",
            width: "80%",
            style: { "height": "92vh" },
            "body-class": "dialog-body",
            "align-center": "",
            "destroy-on-close": ""
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(CommentHistories)
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: vue.unref(searchHotBanVisible),
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(searchHotBanVisible) ? searchHotBanVisible.value = $event : searchHotBanVisible = $event),
            "z-index": 3e3,
            title: "热门屏蔽评论搜索",
            width: "80%",
            style: { "height": "92vh" },
            "body-class": "dialog-body",
            "align-center": "",
            "destroy-on-close": ""
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(HotBanCommentSearcher)
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_dialog, {
            modelValue: vue.unref(settingsVisible),
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.isRef(settingsVisible) ? settingsVisible.value = $event : settingsVisible = $event),
            "z-index": 3e3,
            title: "设置",
            width: "60%",
            style: { "height": "92vh" },
            "body-class": "dialog-body",
            "align-center": "",
            "destroy-on-close": ""
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(Settings)
            ]),
            _: 1
          }, 8, ["modelValue"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5edab8f6"]]);
  const pinia = createPinia();
  const settings = useSettingsStore(pinia);
  const originalFetch = _unsafeWindow.fetch;
  var authorizationCache = null;
  var contextCache = null;
  var trueLoaded = false;
  var db = null;
  const checkingCommentIdSet = /* @__PURE__ */ new Set();
  const continuationWhitelist = /* @__PURE__ */ new Set();
  const hotCommentIdSet = /* @__PURE__ */ new Set();
  function getAuthorization() {
    return authorizationCache;
  }
  function getContext() {
    return contextCache;
  }
  function waitForElement(observeSelector, targetSelector) {
    return new Promise((resolve) => {
      const parent = document.querySelector(observeSelector);
      if (!parent) return;
      const found = parent.querySelector(targetSelector);
      if (found) {
        resolve(found);
        return;
      }
      const observer = new MutationObserver(() => {
        const el = parent.querySelector(targetSelector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(parent, { childList: true, subtree: true });
    });
  }
  async function findComment(commentRecord, isLogin = true) {
    let continuation;
    let requestUrl;
    if (commentRecord.webPageType == "WEB_PAGE_TYPE_WATCH") {
      let payload = {
        uField3: 6,
        commentAreaWrapper: {
          videoId: commentRecord.commentAreaInfo.videoId
        },
        mainCommentRequest: {
          sectionIdentifier: "comments-section",
          commentParameters: {
            videoId: commentRecord.commentAreaInfo.videoId,
            targetCommentId: commentRecord.commentId
          }
        }
      };
      let encoded = NextContinuation.encode(payload);
      continuation = u8ArrayToBase64(encoded.finish());
      requestUrl = "https://www.youtube.com/youtubei/v1/next?prettyPrint=false";
    } else if (commentRecord.webPageType == "WEB_PAGE_TYPE_BROWSE") {
      let payload = {
        description: "community",
        mainCommentRequest: {
          sectionIdentifier: "comments-section",
          commentParameters: {
            channelId: commentRecord.commentAreaInfo.channelId,
            postId: commentRecord.commentAreaInfo.postId,
            targetCommentId: commentRecord.commentId
          }
        }
      };
      let encoded = BrowserCommentListContinuation.encode(payload);
      let buffer = encoded.finish();
      continuation = u8ArrayToBase64(buffer);
      payload = {
        request: {
          description: "FEcomment_post_detail_page_web_top_level",
          continuationBase64: continuation
        }
      };
      encoded = BrowserContinuation.encode(payload);
      buffer = encoded.finish();
      continuation = u8ArrayToBase64(buffer);
      requestUrl = "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false";
    } else {
      throw new Error("Unsupported webPageType : " + commentRecord.webPageType);
    }
    let data = {
      context: contextCache,
      continuation
    };
    let headers = {};
    if (isLogin) {
      headers.authorization = authorizationCache;
    }
    let options = {
      method: "POST",
      body: JSON.stringify(data),
      headers
    };
    let response = await (await originalFetch(requestUrl, options)).json();
    let loggedOut = response.responseContext.mainAppWebResponseContext.loggedOut;
    if (loggedOut == isLogin) {
      console.warn("登录状态不符，需要的：" + isLogin + " API返回的：" + !loggedOut);
    }
    if (!response.frameworkUpdates) {
      throw new Error("COMMENT_AREA_CLOSED");
    }
    let mutations = response.frameworkUpdates.entityBatchUpdate.mutations;
    for (let i = 0; i < mutations.length; i++) {
      let mutation = mutations[i];
      if (mutation.payload.commentEntityPayload) {
        let entity = mutation.payload.commentEntityPayload;
        let commentId = entity.properties.commentId;
        if (commentId == commentRecord.commentId) {
          let likeCount = parseInt(entity.toolbar.likeCountNotliked);
          likeCount = likeCount ? likeCount : 0;
          let replyCount = parseInt(entity.toolbar.replyCount);
          replyCount = replyCount ? replyCount : 0;
          return {
            content: entity.properties.content.content,
            commentId,
            likeCount,
            replyCount
          };
        }
      }
    }
  }
  async function insertComment() {
  }
  async function updateComment() {
  }
  async function selectComment() {
  }
  async function deleteComment() {
  }
  function appendHistory(commentRecord) {
    let histories = commentRecord.histories;
    let needPush = false;
    if (histories.length == 0) {
      needPush = true;
    } else {
      let lastHistory = histories[histories.length - 1];
      needPush = lastHistory.state != commentRecord.currentState || lastHistory.content != commentRecord.content || lastHistory.hotBan != commentRecord.hotBan;
    }
    if (needPush) {
      histories.push({
        time: commentRecord.updatedTime,
        content: commentRecord.content,
        state: commentRecord.currentState,
        hotBan: commentRecord.hotBan
      });
    }
  }
  function updateRecord(commentRecord, state, result) {
    commentRecord.updatedTime = Date.now();
    if (state) {
      commentRecord.currentState = state;
    }
    if (result) {
      commentRecord.likeCount = result.likeCount;
      commentRecord.replyCount = result.replyCount;
      commentRecord.content = result.content;
    }
    appendHistory(commentRecord);
    updateComment(commentRecord);
  }
  async function check(commentRecord) {
    let loggedOutResult = await findComment(commentRecord, false);
    if (loggedOutResult) {
      updateRecord(commentRecord, "NORMAL", loggedOutResult);
      return;
    }
    let loggedInResult = await findComment(commentRecord, true);
    if (loggedInResult) {
      updateRecord(commentRecord, "SHADOW_BAN", loggedInResult);
    } else {
      updateRecord(commentRecord, "DELETED");
    }
  }
  async function toCheck(commentRecord) {
    checkingCommentIdSet.add(commentRecord.commentId);
    let selector;
    let pathname = window.location.pathname;
    if (pathname.startsWith("/post") || pathname.startsWith("/channel")) {
      selector = "ytd-item-section-renderer#sections";
    } else {
      selector = "#comments";
    }
    let element = (await waitForElement(selector, `a[href='${commentRecord.url}']`)).parentNode.parentNode.parentNode.parentNode;
    let div = document.createElement("div");
    div.style.marginTop = "8px";
    div.id = "checker";
    element.append(div);
    let app = vue.createApp(CommentChecker);
    app.use(ElementPlus);
    app.provide("check", check);
    app.provide("hotBanCheck", hotBanCheck);
    app.provide("commentRecord", commentRecord);
    app.provide("interval", 5);
    app.provide("onUnblock", (commentRecord2) => {
      checkingCommentIdSet.delete(commentRecord2.commentId);
    });
    app.provide("onClose", (commentRecord2) => {
      checkingCommentIdSet.delete(commentRecord2.commentId);
      console.log("评论检查完成", commentRecord2);
      div.remove();
    });
    app.mount(div);
  }
  function createCommentListRequest(commentRecord, isLatestSort) {
    let api;
    let continuation;
    if (commentRecord.webPageType == "WEB_PAGE_TYPE_WATCH") {
      api = "https://www.youtube.com/youtubei/v1/next?prettyPrint=false";
      if (commentRecord.commentId.indexOf(".") != -1) {
        let rootCommentId = commentRecord.commentId.split(".")[0];
        continuation = createVideoReplyCommentListContinuation(
          commentRecord.commentAreaInfo.channelId,
          commentRecord.commentAreaInfo.videoId,
          rootCommentId
        );
      } else {
        continuation = createVideoRootCommentListContinuation(
          commentRecord.commentAreaInfo.channelId,
          commentRecord.commentAreaInfo.videoId,
          isLatestSort
        );
      }
    } else if (commentRecord.webPageType == "WEB_PAGE_TYPE_BROWSE") {
      api = "https://www.youtube.com/youtubei/v1/browse?prettyPrint=false";
      if (commentRecord.commentId.indexOf(".") != -1) {
        let rootCommentId = commentRecord.commentId.split(".")[0];
        continuation = createPostReplyCommentListContinuation(
          commentRecord.commentAreaInfo.channelId,
          commentRecord.commentAreaInfo.postId,
          rootCommentId
        );
      } else {
        continuation = createPostRootCommentListContinuation(
          commentRecord.commentAreaInfo.channelId,
          commentRecord.commentAreaInfo.postId,
          isLatestSort
        );
      }
    }
    return { api, continuation };
  }
  async function hotBanCheck(commentRecord, observer, controller) {
    if (!observer) {
      observer = {
        onCountChange(c, p) {
        }
      };
    }
    if (!controller) {
      controller = {
        isCancelled: false
      };
    }
    let pageCpunt = 0;
    let commentCount = 0;
    let { api, continuation } = createCommentListRequest(commentRecord);
    while (continuation) {
      if (controller.isCancelled) {
        return false;
      }
      let data = {
        context: contextCache,
        continuation
      };
      let options = {
        method: "POST",
        body: JSON.stringify(data)
      };
      let response = await (await originalFetch(api, options)).json();
      pageCpunt++;
      if (!response.frameworkUpdates) {
        commentRecord.hotBan = true;
        updateRecord(commentRecord);
        return true;
      }
      for (let mutation of response.frameworkUpdates.entityBatchUpdate.mutations) {
        let entity = mutation.payload.commentEntityPayload;
        if (entity) {
          let commentId = entity.properties.commentId;
          commentCount++;
          observer.onCountChange(commentCount, pageCpunt);
          if (commentId == commentRecord.commentId) {
            commentRecord.hotBan = false;
            updateRecord(commentRecord);
            return true;
          }
        }
      }
      continuation = findNextContinuation(response);
    }
    commentRecord.hotBan = true;
    updateRecord(commentRecord);
    return true;
  }
  async function handlerYoutubei(request) {
    var _a;
    let requsetClone = request.clone();
    let requestBody = await requsetClone.json();
    if (requestBody && requestBody.context) {
      contextCache = requestBody.context;
      if (!trueLoaded) {
        console.log("fetch已成功劫持");
        _GM_registerMenuCommand("✅ 脚本已完全加载");
        trueLoaded = true;
      }
    }
    if (request.url.startsWith("https://www.youtube.com/youtubei/v1/comment/create_comment")) {
      let response = await originalFetch(request);
      if (response.status != 200) {
        return response;
      }
      let responseClone = response.clone();
      try {
        let json = await responseClone.json();
        if (json.frameworkUpdates.entityBatchUpdate.mutations.length == 1) {
          return response;
        }
        let entity = json.frameworkUpdates.entityBatchUpdate.mutations[0].payload.commentEntityPayload;
        let innertubeCommand = json.frameworkUpdates.entityBatchUpdate.mutations[1].payload.commentSurfaceEntityPayload.publishedTimeCommand.innertubeCommand;
        let webCommandMetadata = innertubeCommand.commandMetadata.webCommandMetadata;
        let webPageType = webCommandMetadata.webPageType;
        let url = webCommandMetadata.url;
        let commentAreaInfo = {};
        commentAreaInfo.channelId = findValueInSingleEntryArray(json.actions[0].runAttestationCommand.ids, "externalChannelId");
        if (webPageType == "WEB_PAGE_TYPE_WATCH") {
          commentAreaInfo.videoId = innertubeCommand.watchEndpoint.videoId;
        } else if (webPageType == "WEB_PAGE_TYPE_BROWSE") {
          commentAreaInfo.postId = createUrl(url).pathname.split("/")[2];
        }
        let author = entity.author;
        let properties = entity.properties;
        let content = properties.content.content;
        let recordedTime = Date.now();
        let commentRecord = {
          //评论ID
          commentId: properties.commentId,
          //@发送者
          displayName: author.displayName,
          //频道ID，类似UID
          channelId: author.channelId,
          //评论内容
          content,
          //webPageType 评论区类型 视频 or 帖子
          webPageType,
          //URL 点击可跳转“所要查看的评论” 例如 /watch?v=${视频ID}&lc=${评论ID}
          url,
          //评论区信息，视频{视频ID}，帖子{频道ID,帖子ID}
          commentAreaInfo,
          //当前状态 默认从SHADOW_BAN开始，到NORMAL或DELETED
          currentState: "NOT_CHECK",
          //是否在热门排序中被禁止显示（搜索整个热门评论区来检查），前提条件currentState = "NORMAL"，值：null | false | true
          //此状态不会因为修改评论内容而解除，但会因为修改评论内容而赋予
          hotBan: null,
          //历史记录，时间 内容 状态 是否热门屏蔽
          histories: [],
          //{ time: recordedTime, state: "SHADOW_BAN", content, hotBan: null }
          //点赞与回复数，不记录历史
          likeCount: 0,
          replyCount: 0,
          //记录的时间，用的是系统当前时间，约等于评论的发布时间，API里的publishedTime距离发布时间戳多久的Shit不是时间戳（PS：YouTube开放API可查询具体发布时间戳）
          recordedTime,
          //更新时间
          updatedTime: recordedTime,
          //是否是用户自己执行的删除？用于区分是被系统删的还是自己删除。state为"DELETED"时该属性为才有意义。（劫持删除评论请求时记录）
          isUserDelete: false
        };
        console.log(commentRecord);
        insertComment(commentRecord);
        console.log(createUrl(url).href);
        toCheck(commentRecord);
      } catch (err) {
        console.error(err);
        throw err;
      }
      return response;
    } else if (request.url.startsWith("https://www.youtube.com/youtubei/v1/comment/perform_comment_action")) {
      let actionInfo = CommentAction.decode(base64ToU8Array(requestBody.actions[0]));
      if (actionInfo.action == 6) {
        if (checkingCommentIdSet.has(actionInfo.commentId)) {
          alert("现在不能删除该评论，因为评论还未完成检查，请先完成检查！");
          const responseBody = {
            "error": {
              "code": 403,
              "message": "Can't delete comment now",
              "errors": [
                {
                  "message": "Can't delete comment now",
                  "domain": "global",
                  "reason": "forbidden"
                }
              ],
              "status": "FORBIDDEN"
            }
          };
          return new Response(JSON.stringify(responseBody), {
            status: 403,
            headers: {
              "Content-Type": "application/json"
            }
          });
        } else {
          let response = await originalFetch(request);
          let responseBody = await response.clone().json();
          if (responseBody.actions && responseBody.actions[0].removeCommentAction.actionResult.status == "STATUS_SUCCEEDED") {
            let commentRecord = await selectComment(actionInfo.commentId);
            if (commentRecord) {
              commentRecord.isUserDelete = true;
              updateRecord(commentRecord, "DELETED");
            }
          }
          return response;
        }
      }
    } else if (request.url.startsWith("https://www.youtube.com/youtubei/v1/comment/update_comment")) {
      let updateCommentParams = requestBody.updateCommentParams;
      let decodedParams = UpdateCommentParams.decode(base64ToU8Array(updateCommentParams));
      if (checkingCommentIdSet.has(decodedParams.commentId)) {
        alert("现在不能修改该评论，因为评论还未完成检查，请先完成检查！");
        const responseBody2 = {
          "error": {
            "code": 403,
            "message": "Can't edit comment now",
            "errors": [
              {
                "message": "Can't edit comment now",
                "domain": "global",
                "reason": "forbidden"
              }
            ],
            "status": "FORBIDDEN"
          }
        };
        return new Response(JSON.stringify(responseBody2), {
          status: 403,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
      let response = await originalFetch(request);
      let responseBody = await response.clone().json();
      if (responseBody.actions && responseBody.actions[0].updateCommentAction.actionResult.status == "STATUS_SUCCEEDED") {
        let commentRecord = await selectComment(decodedParams.commentId);
        if (commentRecord) {
          commentRecord.content = requestBody.commentText;
          commentRecord.currentState = "NOT_CHECK";
          commentRecord.hotBan = null;
          updateRecord(commentRecord);
        }
      }
      return response;
    } else if (request.url.startsWith("https://www.youtube.com/youtubei/v1/next") || request.url.startsWith("https://www.youtube.com/youtubei/v1/browse")) {
      let apiUrl = request.url;
      if (!settings.forceTimeSort) {
        return await originalFetch(request);
      }
      let continuation = requestBody.continuation;
      if (!continuation) {
        return await originalFetch(request);
      }
      let response;
      let hotSearchContinuation;
      if (!continuationWhitelist.has(requestBody.continuation)) {
        if (apiUrl.startsWith("https://www.youtube.com/youtubei/v1/next")) {
          let decodedNextContinuation = NextContinuation.decode(base64ToU8Array(continuation));
          if (!((_a = decodedNextContinuation.mainCommentRequest) == null ? void 0 : _a.commentReplyParameters)) {
            return await originalFetch(request);
          }
          requestBody.continuation = generateVideoAreaReqContinuation(decodedNextContinuation, 2);
          hotSearchContinuation = generateVideoAreaReqContinuation(decodedNextContinuation, 1);
        } else {
          let decodedBrowserContinuation = BrowserContinuation.decode(base64ToU8Array(continuation));
          if (decodedBrowserContinuation.request.description != "FEcomment_post_detail_page_web_replies_page") {
            return await originalFetch(request);
          }
          requestBody.continuation = generatePostAreaReqContinuation(decodedBrowserContinuation, 2);
          hotSearchContinuation = generatePostAreaReqContinuation(decodedBrowserContinuation, 1);
        }
        request = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(requestBody)
        });
        response = await originalFetch(request);
        if (response.ok) {
          let responseJson = await response.clone().json();
          let nextContinuation = findNextContinuation(responseJson);
          if (nextContinuation) {
            continuationWhitelist.add(nextContinuation);
          }
          if (settings.showBlockedHotComments) {
            await loadAllHotReplyId(hotSearchContinuation, apiUrl);
            addHotBannedTip(responseJson);
            response = changeResponseBody(response, responseJson);
          }
        }
      } else {
        continuationWhitelist.delete(requestBody.continuation);
        response = await originalFetch(request);
        let responseJson = await response.clone().json();
        let nextContinuation = findNextContinuation(responseJson);
        if (nextContinuation) {
          continuationWhitelist.add(nextContinuation);
        }
        if (settings.showBlockedHotComments) {
          addHotBannedTip(responseJson);
          response = changeResponseBody(response, responseJson);
        }
      }
      return response;
    }
    return await originalFetch(request);
  }
  function generateVideoAreaReqContinuation(decodedNextContinuation, sortType) {
    decodedNextContinuation.mainCommentRequest.commentReplyParameters.sortParam.sortType = sortType;
    return u8ArrayToBase64(NextContinuation.encode(decodedNextContinuation).finish());
  }
  function generatePostAreaReqContinuation(decodedBrowserContinuation, sortType) {
    let decodedBrowserCommentListContinuation = BrowserCommentListContinuation.decode(base64ToU8Array(decodedBrowserContinuation.request.continuationBase64));
    decodedBrowserCommentListContinuation.mainCommentRequest.commentReplyParameters.sortParam.sortType = sortType;
    decodedBrowserContinuation.request.continuationBase64 = u8ArrayToBase64(
      BrowserCommentListContinuation.encode(decodedBrowserCommentListContinuation).finish()
    );
    return u8ArrayToBase64(BrowserContinuation.encode(decodedBrowserContinuation).finish());
  }
  async function loadAllHotReplyId(continuation, api) {
    let count = 0;
    while (continuation) {
      let data = {
        context: contextCache,
        continuation
      };
      let options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          authorization: authorizationCache
        }
      };
      let response;
      try {
        response = await (await originalFetch(api, options)).json();
      } catch (err) {
        return;
      }
      let mutations = response.frameworkUpdates.entityBatchUpdate.mutations;
      for (let mutation of mutations) {
        if (mutation.payload.commentEntityPayload) {
          hotCommentIdSet.add(mutation.payload.commentEntityPayload.properties.commentId);
          count++;
        }
      }
      continuation = findNextContinuation(response);
    }
    console.log(`已获取 ${count} 个热门回复评论……`);
  }
  function addHotBannedTip(response) {
    if (!response.frameworkUpdates) {
      return;
    }
    for (let mutation of response.frameworkUpdates.entityBatchUpdate.mutations) {
      let entity = mutation.payload.commentEntityPayload;
      if (entity) {
        let properties = entity.properties;
        if (!hotCommentIdSet.has(properties.commentId)) {
          properties.publishedTime = properties.publishedTime + "（热门屏蔽的）";
        }
      }
    }
  }
  function changeResponseBody(originalResponse, bodyJson) {
    return new Response(JSON.stringify(bodyJson), {
      status: originalResponse.status,
      headers: originalResponse.headers
    });
  }
  const fetchProxy = function(resource, options) {
    if (typeof resource == "string") {
      return originalFetch(resource, options);
    }
    if (!resource.url.startsWith("https://www.youtube.com/youtubei/")) {
      return originalFetch(resource, options);
    }
    let auth = resource.headers.get("Authorization");
    if (auth) {
      authorizationCache = auth;
      if (resource.method != "POST") {
        return originalFetch(resource);
      } else {
        return handlerYoutubei(resource);
      }
    }
    return originalFetch(resource, options);
  };
  try {
    _unsafeWindow.fetch = fetchProxy;
  } catch (err) {
    console.warn("替换 unsafeWindow.fetch 失败！相关信息：", err, Object.getOwnPropertyDescriptor(_unsafeWindow, "fetch"));
    if (confirm("fetch已被提前锁定，替换失败，YouTube发评反诈可能无法正常工作。\n你可以安装本项目的 Define property blocker 插件来反制锁定。\n\n点击“确定”前往项目地址，点击“取消”忽略。")) {
      window.location.href = "https://github.com/freedom-introvert/youtube-comment-censor-detector";
    }
  }
  const _createElement = Document.prototype.createElement;
  Document.prototype.createElement = function(tagName, ...args) {
    const el = _createElement.call(this, tagName, ...args);
    if (tagName.toLowerCase() === "iframe") {
      el.addEventListener("load", () => {
        var _a;
        try {
          const fetchFromIframe = (_a = el.contentWindow) == null ? void 0 : _a.fetch;
          if (fetchFromIframe) {
            el.contentWindow.fetch = fetchProxy;
            console.log("已替换iframe window的fetch", el);
          }
        } catch (e) {
          console.log("未替换该iframe的fetch", el, e);
        }
      });
    }
    return el;
  };
  function openDB() {
    return new Promise((resolve, reject) => {
      let request = indexedDB.open("YT-CCD", 1);
      request.onerror = (event) => {
        reject(event);
      };
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onupgradeneeded = (event) => {
        let db2 = event.target.result;
        let objectStore = db2.createObjectStore("comments", { keyPath: "commentId" });
        objectStore.createIndex("recordedTime", "recordedTime", { unique: false });
      };
    });
  }
  async function init() {
    try {
      db = await openDB();
      insertComment = function(comment) {
        return new Promise((resolve, reject) => {
          let request = db.transaction("comments", "readwrite").objectStore("comments").add(comment);
          request.onsuccess = (event) => {
            resolve(event);
          };
          request.onerror = (event) => {
            reject(event);
          };
        });
      };
      updateComment = function(comment) {
        return new Promise((resolve, reject) => {
          let request = db.transaction("comments", "readwrite").objectStore("comments").put(vue.toRaw(comment));
          request.onsuccess = (event) => {
            resolve(event);
          };
          request.onerror = (event) => {
            reject(event);
          };
        });
      };
      selectComment = function(commentId) {
        return new Promise((resolve, reject) => {
          let request = db.transaction("comments").objectStore("comments").get(commentId);
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        });
      };
      deleteComment = function(commentId) {
        return new Promise((resolve, reject) => {
          let request = db.transaction("comments", "readwrite").objectStore("comments").delete(commentId);
          request.onsuccess = (event) => {
            resolve(request.result);
          };
          request.onerror = (event) => {
            reject(event);
          };
        });
      };
    } catch (err) {
      console.log("indexedDB数据库打开失败，评论历史记录相关功能已禁用，错误信息：", err);
    }
    const menuListener = {
      onOpenHistory: () => {
        alert("脚本正在初始化，请稍后……");
      }
    };
    _GM_registerMenuCommand("🧾 历史评论记录", () => {
      menuListener.onOpenHistory();
    });
    _GM_registerMenuCommand("🔍 搜索热门屏蔽评论", () => {
      menuListener.onSearchHotBan();
    });
    _GM_registerMenuCommand("⚙️ 设置", () => {
      menuListener.onOpenSettings();
    });
    const div = document.createElement("div");
    div.id = "yt-ccd";
    div.style.position = "absolute";
    document.body.append(div);
    let app = vue.createApp(App);
    app.use(ElementPlus);
    app.use(pinia);
    app.provide("menuListener", menuListener);
    app.provide("db", db);
    app.provide("check", check);
    app.provide("hotBanCheck", hotBanCheck);
    app.provide("deleteComment", deleteComment);
    app.provide("getAuthorization", getAuthorization);
    app.provide("getContext", getContext);
    app.provide("originalFetch", originalFetch);
    app.mount(div);
  }
  window.addEventListener("load", () => {
    init().then(() => {
      console.log("YouTube反诈加载完成");
    }).catch((err) => {
      console.error("YouTube反诈加载失败", err);
    });
  });

})(Vue, ElementPlus);