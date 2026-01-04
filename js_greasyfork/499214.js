// ==UserScript==
// @name         学习通下载器 Chaoxing Downloader
// @namespace    https://github.com/lcandy2/user.js/tree/main/websites/chaoxing.com/chaoxing-downloader
// @version      1.2
// @author       甜檸Cirtron (lcandy2)
// @description  一键下载资料文件，无视系统限制。
// @license      AGPL-3.0-or-later
// @copyright    lcandy2 All Rights Reserved
// @homepage     https://greasyfork.org/scripts/499214
// @homepageURL  https://greasyfork.org/scripts/499214
// @source       https://github.com/lcandy2/user.js/tree/main/websites/chaoxing.com/chaoxing-downloader
// @match        *://*.chaoxing.com/mooc2-ans/coursedata/stu-datalist*
// @require      https://registry.npmmirror.com/vue/3.4.27/files/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @require      https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.js
// @require      data:application/javascript,%3B
// @resource     VuetifyStyle  https://registry.npmmirror.com/vuetify/3.6.6/files/dist/vuetify.min.css
// @connect      pan-yz.chaoxing.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/499214/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%8B%E8%BD%BD%E5%99%A8%20Chaoxing%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/499214/%E5%AD%A6%E4%B9%A0%E9%80%9A%E4%B8%8B%E8%BD%BD%E5%99%A8%20Chaoxing%20Downloader.meta.js
// ==/UserScript==

(function (vue, vuetify) {
  'use strict';

  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const backgroundFetch = async (url) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        onload: (response) => {
          resolve(response.responseText);
        },
        onerror: (error) => {
          reject(error);
        }
      });
    });
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const buttonRef = vue.ref(null);
      const downloadLink = vue.ref("");
      const isDownloading = vue.ref(false);
      const isFinished = vue.ref(false);
      const isErrored = vue.ref(false);
      const fileInfo = vue.ref({
        fileName: "",
        objectId: "",
        dataId: "",
        t: "",
        courseId: "",
        clazzId: "",
        cpi: "",
        puid: ""
      });
      const handleClick = async (event) => {
        !isFinished.value && event.preventDefault();
        isDownloading.value = true;
        if (buttonRef.value && !isFinished.value) {
          try {
            const tokenReq = await backgroundFetch("https://pan-yz.chaoxing.com/api/token/uservalid");
            const tokenJson = JSON.parse(tokenReq);
            const token = tokenJson._token;
            const fileInfoApi = new URL(
              "https://pan-yz.chaoxing.com/api/share/downloadUrl"
            );
            fileInfoApi.searchParams.set("puid", fileInfo.value.puid);
            fileInfoApi.searchParams.set("_token", token);
            fileInfoApi.searchParams.set("sarepuid", fileInfo.value.puid);
            fileInfoApi.searchParams.set("objectid", fileInfo.value.objectId);
            const fileInfoReq = await backgroundFetch(fileInfoApi.toString());
            const fileInfoJson = JSON.parse(fileInfoReq);
            const fileInfoUrl = fileInfoJson.url;
            downloadLink.value = fileInfoUrl.toString();
            isFinished.value = true;
            vue.nextTick(() => {
              buttonRef.value.$el.click();
            });
          } catch (e) {
            isErrored.value = true;
            console.error(e);
          }
        } else {
          isDownloading.value = false;
        }
      };
      vue.onMounted(() => {
        var _a;
        if (buttonRef.value) {
          try {
            const fileElement = (_a = buttonRef.value.$el.parentElement) == null ? void 0 : _a.parentElement.parentElement.parentElement;
            fileInfo.value.objectId = fileElement == null ? void 0 : fileElement.getAttribute("objectid");
            fileInfo.value.fileName = fileElement == null ? void 0 : fileElement.getAttribute("dataname");
            fileInfo.value.dataId = (fileElement == null ? void 0 : fileElement.getAttribute("id")) || (fileElement == null ? void 0 : fileElement.getAttribute("order"));
            fileInfo.value.t = fileElement == null ? void 0 : fileElement.getAttribute("t");
            const userIdElement = document.querySelector("input#userId");
            if (userIdElement) {
              fileInfo.value.puid = userIdElement.getAttribute("value") || "";
            }
            const href = new URL(window.location.href);
            fileInfo.value.courseId = href.searchParams.get("courseid") || "";
            fileInfo.value.clazzId = href.searchParams.get("clazzid") || "";
            fileInfo.value.cpi = href.searchParams.get("cpi") || "";
            const downloadUrl = new URL(
              "https://mooc1.chaoxing.com/coursedata/downloadData?ut=s"
            );
            downloadUrl.searchParams.set("dataId", fileInfo.value.dataId);
            downloadUrl.searchParams.set("classId", fileInfo.value.clazzId);
            downloadUrl.searchParams.set("cpi", fileInfo.value.cpi);
            downloadUrl.searchParams.set("courseId", fileInfo.value.courseId);
            downloadLink.value = downloadUrl.toString();
          } catch (e) {
            isErrored.value = true;
            console.error(e);
          }
        }
      });
      return (_ctx, _cache) => {
        const _component_v_btn = vue.resolveComponent("v-btn");
        return vue.openBlock(), vue.createBlock(_component_v_btn, {
          ref_key: "buttonRef",
          ref: buttonRef,
          disabled: isErrored.value,
          loading: isDownloading.value && !isErrored.value,
          onClick: handleClick,
          href: downloadLink.value,
          density: "compact",
          variant: "plain",
          color: "primary"
        }, {
          default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(isErrored.value ? "下载器错误，请刷新重试" : isDownloading.value ? "正在下载中" : isFinished.value ? "下载完成" : "下载器下载"), 1)
          ]),
          _: 1
        }, 8, ["disabled", "loading", "href"]);
      };
    }
  });
  const appendApp = (element) => {
    const vuetify$1 = vuetify.createVuetify({});
    const app = vue.createApp(_sfc_main);
    app.use(vuetify$1);
    app.mount(element);
  };
  const cssLoader = (e) => {
    const t = GM_getResourceText(e);
    return GM_addStyle(t), t;
  };
  cssLoader("VuetifyStyle");
  function addElement() {
    const uls = document.querySelectorAll("ul.operate");
    uls.forEach((ul) => {
      var _a;
      const file = (_a = ul.parentElement) == null ? void 0 : _a.parentElement;
      if (!file)
        return;
      const isBook = file.getAttribute("type") === "book";
      const isAFolder = file.getAttribute("type") === "afolder";
      const hasObjectID = file.getAttribute("objectid") !== "";
      if (isBook || isAFolder || !hasObjectID)
        return;
      if (!ul.querySelector("[chaoxing-downloader]")) {
        const li = document.createElement("li");
        li.className = "operate_down";
        li.setAttribute("chaoxing-downloader", "");
        ul.appendChild(li);
        appendApp(li);
      }
    });
  }
  addElement();
  const observer = new MutationObserver((mutationsList, observer2) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        addElement();
      }
    }
  });
  const config = { childList: true, subtree: true };
  observer.observe(document, config);

})(Vue, Vuetify);