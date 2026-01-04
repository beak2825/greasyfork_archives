// ==UserScript==
// @name         🔥🔥蓝奏云点击文件自动下载（不支持文件夹下载）🔥🔥
// @namespace    https://www.softrr.cn/
// @version      1.1.1
// @author       hackhase
// @description  蓝奏云点击文件自动下载，针对自己的网盘文件，免去复制链接或者生成外链的烦恼
// @license      MIT
// @icon         https://up.woozooo.com/favicon.ico
// @match        *://up.woozooo.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.3.11/dist/vue.global.prod.js
// @require      data:application/javascript,%3Bwindow.Vue%3DVue%3B
// @connect      www.softrr.cn
// @connect      wwo.lanzoum.com
// @connect      wwpz.lanzouv.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/490073/%F0%9F%94%A5%F0%9F%94%A5%E8%93%9D%E5%A5%8F%E4%BA%91%E7%82%B9%E5%87%BB%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E5%A4%B9%E4%B8%8B%E8%BD%BD%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/490073/%F0%9F%94%A5%F0%9F%94%A5%E8%93%9D%E5%A5%8F%E4%BA%91%E7%82%B9%E5%87%BB%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%EF%BC%88%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E5%A4%B9%E4%B8%8B%E8%BD%BD%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" :root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;place-items:center;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}.card{padding:2em}#app{height:100px}@media (prefers-color-scheme: light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}.modal-wrapper[data-v-6f8ba791]{position:fixed;top:0;left:0;width:100%;height:100%;background-color:#00000080;display:flex;justify-content:center;align-items:center;z-index:9999}.modal[data-v-6f8ba791]{background-color:#fff;padding:20px;border-radius:5px}.header[data-v-6f8ba791]{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.header h2[data-v-6f8ba791]{margin:0;font-size:20px;font-weight:700}.header button[data-v-6f8ba791]{border:none;background-color:transparent;font-size:20px;cursor:pointer}.contentBox[data-v-6f8ba791]{max-height:400px;overflow:auto;font-size:16px;display:flex;justify-content:space-between}.contentBox .produce p[data-v-6f8ba791]{margin-top:15px}.contentBox .produce .ipt[data-v-6f8ba791]{margin-top:15px;height:30px;border-radius:5px;padding-left:10px}.contentBox .img[data-v-6f8ba791]{display:flex;align-items:center;justify-content:center}.contentBox .img img[data-v-6f8ba791]{width:180px}input[data-v-6f8ba791]::-webkit-input-placeholder{color:#aab2bd;font-size:14px;padding-left:5px}.copy[data-v-ba0f4447]{width:160px;position:fixed;right:10px;top:80px;color:#111;z-index:999;display:flex;flex-direction:column}.copy .prase[data-v-ba0f4447],.copy .down[data-v-ba0f4447]{width:100px;height:30px;font-size:14px;background-color:red;color:#fff;border-radius:10%;z-index:999}.copy .prase[data-v-ba0f4447]:hover,.copy .down[data-v-ba0f4447]:hover{background-color:#87ceeb;color:#fff} ");

(function (vue) {
  'use strict';

  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _withScopeId = (n) => (vue.pushScopeId("data-v-6f8ba791"), n = n(), vue.popScopeId(), n);
  const _hoisted_1$1 = { class: "modal" };
  const _hoisted_2 = { class: "header" };
  const _hoisted_3 = { class: "contentBox" };
  const _hoisted_4 = { class: "produce" };
  const _hoisted_5 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "1、扫描右侧公众号，点击关注！", -1));
  const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "2、在软件爬取者后台回复：验证码", -1));
  const _hoisted_7 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("p", null, "3、在下方输入框输入获取的验证码后回车", -1));
  const _hoisted_8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ vue.createElementVNode("div", { class: "img" }, [
    /* @__PURE__ */ vue.createElementVNode("img", {
      src: "data:image/jpeg;base64,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",
      alt: ""
    })
  ], -1));
  const _sfc_main$1 = {
    __name: "Model",
    props: {
      title: {
        type: String,
        required: true
      },
      code: {
        type: Number
      }
    },
    setup(__props, { expose: __expose }) {
      const props = __props;
      const visible = vue.ref(false);
      const openModal = () => {
        visible.value = true;
      };
      const closeModal = () => {
        visible.value = false;
      };
      __expose({
        visible,
        openModal,
        closeModal
      });
      const codeValue = vue.ref();
      const enterCode = () => {
        if (codeValue.value == props.code) {
          localStorage.setItem("code", codeValue.value);
          visible.value = false;
          alert("验证成功，请再次点击解析！");
          codeValue.value = "";
        } else {
          alert("验证码错误，请重新输入！");
          codeValue.value = "";
        }
      };
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          class: "modal-wrapper",
          onClick: vue.withModifiers(closeModal, ["self"])
        }, [
          vue.createElementVNode("div", _hoisted_1$1, [
            vue.createElementVNode("div", _hoisted_2, [
              vue.createElementVNode("h2", null, vue.toDisplayString(__props.title), 1),
              vue.createElementVNode("button", { onClick: closeModal }, "X")
            ]),
            vue.createElementVNode("div", _hoisted_3, [
              vue.createElementVNode("div", _hoisted_4, [
                _hoisted_5,
                _hoisted_6,
                _hoisted_7,
                vue.withDirectives(vue.createElementVNode("input", {
                  class: "ipt",
                  type: "text",
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => codeValue.value = $event),
                  onKeydown: vue.withKeys(enterCode, ["enter"]),
                  placeholder: "请输入验证码后按回车"
                }, null, 544), [
                  [vue.vModelText, codeValue.value]
                ])
              ]),
              _hoisted_8
            ])
          ])
        ], 512)), [
          [vue.vShow, visible.value]
        ]);
      };
    }
  };
  const Model = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6f8ba791"]]);
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const getCode = () => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        url: `https://www.softrr.cn/crawler/getCode`,
        headers: {
          Referer: "https://www.softrr.cn/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36"
        },
        onload: function(res) {
          resolve(JSON.parse(res.response).data[0].code);
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  let headers = {
    "Accept": "application/json, text/javascript, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
    "Cookie": "codelen=1; pc_ad1=1; Hm_lvt_fb7e760e987871d56396999d288238a4=1710333153; uz_distinctid=18e37ccd07a8b7-07bb4f91d5f519-6b325057-144000-18e37ccd07bb24; STDATA82=czst_eid%3D1298768486-3821-%26ntime%3D3821; Hm_lpvt_fb7e760e987871d56396999d288238a4=1710341962",
    "Origin": "https://wwo.lanzoum.com",
    "Referer": "https://wwo.lanzoum.com/i5dr00e59k0j",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest",
    "sec-ch-ua": '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"'
  };
  const getSkdklds = (url) => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "GET",
        url,
        headers,
        onload: function(res) {
          resolve(res.response);
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  const getUrl = (data, mid) => {
    return new Promise(function(resolve, reject) {
      _GM_xmlhttpRequest({
        method: "POST",
        url: `https://wwpz.lanzouv.com/ajaxm.php?file=${mid}`,
        headers,
        data,
        onload: function(res) {
          resolve(JSON.parse(res.response));
        },
        onerror: function(error) {
          console.log(error);
        }
      });
    });
  };
  const downloadFile = (url, fileName) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const _hoisted_1 = { class: "copy" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const code = vue.ref();
      const model = vue.ref("");
      const midno = vue.ref("");
      const pas = vue.ref("");
      const sign = vue.ref("");
      const resUrl = vue.ref("");
      const downTitle = vue.ref("");
      vue.ref(0);
      vue.ref(false);
      vue.onMounted(() => {
        var fileNameN1 = document.querySelector(".n1");
        var selecetDown = document.querySelector("#f_sha");
        if (fileNameN1) {
          fileNameN1.addEventListener("click", (event) => {
            let span = event.target.outerHTML;
            if (isValidSpanTag(span) === true) {
              var parser = new DOMParser();
              var doc = parser.parseFromString(span, "text/html");
              var element = doc.querySelector("span");
              if (element.classList.contains("f_name_title")) {
                downTitle.value = event.target.innerText;
                midno.value = event.target.getAttribute("id").split("name")[1];
                localStorage.setItem("midno", midno.value);
              }
            }
          });
        }
        if (selecetDown) {
          selecetDown.addEventListener("click", async (event) => {
            let divValue_html = event.target.outerHTML;
            var parser = new DOMParser();
            var doc = parser.parseFromString(divValue_html, "text/html");
            var element = doc.querySelector("#f_sha1");
            if (element) {
              if (element.innerText.includes("密码")) {
                resUrl.value = element.innerText.split("密码:")[0];
                pas.value = element.innerText.split("密码:")[1];
              } else {
                resUrl.value = element.innerText;
              }
              midno.value = localStorage.getItem("midno");
              if (midno.value.length == 8) {
                await onDown(midno.value, pas.value, resUrl.value);
              }
              midno.value = "";
              resUrl.value = "";
              pas.value = "";
            }
          });
        }
      });
      function isValidSpanTag(str) {
        var pattern = /<span\s+class="[^"]*"\s+id="filename(\d+)"\s*>/;
        if (pattern.test(str)) {
          return true;
        } else {
          return false;
        }
      }
      const onDown = async (mid, pas2, url) => {
        code.value = await getCode();
        let locaCode = localStorage.getItem("code") || "";
        if (locaCode == code.value) {
          if (mid !== "" && pas2 !== "") {
            let htmlString = await getSkdklds(url);
            var regex = /var skdklds = '(.*?)'/;
            var match = htmlString.match(regex);
            if (match) {
              sign.value = match[1];
            } else {
              console.log("没有匹配到内容");
            }
            let data = `action=downprocess&sign=${sign.value}&p=${pas2}`;
            let res = await getUrl(data, mid);
            let downUrl = "https://developer-oss.lanrar.com/file/" + res.url;
            downloadFile(downUrl, downTitle.value);
          } else if (mid !== "" && pas2 === "") {
            let htmlFirst = await getSkdklds(url);
            let secUrl = "";
            var regex = /src="([^"]+)"/g;
            var matchFirst = htmlFirst.match(regex)[0];
            if (matchFirst) {
              secUrl = matchFirst.split("/")[1].split('"')[0];
            } else {
              console.log("没有匹配到内容");
            }
            let htmlString = await getSkdklds(`https://wwo.lanzoum.com/${secUrl}`);
            var regex = /'sign':'([^']+)'/;
            var match = htmlString.match(regex);
            if (match) {
              sign.value = match[1];
            } else {
              console.log("没有匹配到内容");
            }
            let data = `action=downprocess&signs=%3Fctdf&sign=${sign.value}&websign=&websignkey=s2WD&ves=1&kd=1`;
            let res = await getUrl(data, mid);
            let downUrl = "https://down-load.lanrar.com/file/" + res.url;
            downloadFile(downUrl, downTitle.value);
          }
        } else {
          model.value.openModal();
        }
      };
      const title = vue.ref("为了减少端口压力，防止滥用，采取必要的验证手段。");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
          vue.withDirectives(vue.createElementVNode("button", {
            onClick: onDown,
            class: "down"
          }, "一键下载", 512), [
            [vue.vShow, false]
          ]),
          vue.createVNode(Model, {
            title: title.value,
            code: code.value,
            ref_key: "model",
            ref: model
          }, null, 8, ["title", "code"])
        ]);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ba0f4447"]]);
  const app = vue.createApp(App);
  app.mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );

})(Vue);