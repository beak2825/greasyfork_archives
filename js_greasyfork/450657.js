// ==UserScript==
// @name         自动登录到Inspur Office
// @namespace    ibrucekong/auto-login-office-of-inspur
// @version      0.2.0
// @author       ibrucekong
// @description  自动登录到浪潮的Office官网
// @icon         https://portrait.gitee.com/uploads/avatars/namespace/571/1713852_imbk_1578990965.png
// @supportURL   https://gitee.com/imbk/auto-login-office-of-inspur/issues
// @match        https://office.inspur.com/eportal/ui?pageId=*
// @match        *://10.6.6.9/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.38/dist/vue.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/450657/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%88%B0Inspur%20Office.user.js
// @updateURL https://update.greasyfork.org/scripts/450657/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%88%B0Inspur%20Office.meta.js
// ==/UserScript==

// use vite-plugin-monkey@2.3.0 at 2022-09-13T00:28:17.433Z

(function(vue) {
  "use strict";
  const style = "";
  const _hoisted_1 = { class: "card" };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "MoneyScript",
    setup(__props) {
      const inputUserName = "";
      const inputPassword = "";
      function autoClick(selectorDom) {
        let inter = setInterval(() => {
          if (document.getElementsByName("loginName").length) {
            let loginName = document.getElementsByName("loginName")[0];
            loginName.value = inputUserName;
            let password = document.getElementsByName("password")[0];
            password.value = inputPassword;
            if (document.querySelector(selectorDom) && password.value && loginName.value) {
              document.querySelector(selectorDom).click();
              clearInterval(inter);
            }
          } else {
            clearInterval(inter);
          }
        }, 1e3);
      }
      autoClick("button[type='submit']");
      function autoClickInNet(selectorDom) {
        let inter = setInterval(() => {
          if (document.getElementById("user_name")) {
            let loginName = document.getElementById("user_name");
            loginName.value = inputUserName;
            let password = document.getElementById("password");
            password.value = inputPassword;
            console.log(document.querySelector(selectorDom));
            if (document.querySelector(selectorDom) && password.value && loginName.value) {
              document.querySelector(selectorDom).click();
              clearInterval(inter);
            }
          } else {
            clearInterval(inter);
          }
        }, 1e3);
      }
      autoClickInNet("#user_btnpid .default_btn");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1);
      };
    }
  });
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  vue.createApp(_sfc_main).mount(
    (() => {
      const app = document.createElement("div");
      document.body.append(app);
      return app;
    })()
  );
})(Vue);
