// ==UserScript==
// @name         apaas-extend
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  apaas扩展!
// @author       sailffo
// @match        http://*.definesys.cn:*/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439054/apaas-extend.user.js
// @updateURL https://update.greasyfork.org/scripts/439054/apaas-extend.meta.js
// ==/UserScript==

// function createIframeButton(container, callback) {
//   // debugger
//     const inputWrraper = document.createElement('input')
//     inputWrraper.placeholder = '请输入documentId并回车'
//     inputWrraper.addEventListener('keydown', (e) => {
//         if (e.code === 'Enter') {
//             const documentId = inputWrraper.value
//             const currentUrl = window.location.href
//             const appId = getQueryVariable('appId')
//             if (!appId) throw new Error('appId不存在')
//             const formId = getQueryVariable('formId')
//             if (!formId) throw new Error('formId不存在')
//             const { token, tenantId } = getTokenAndTenant(appId)
//             if (!token) throw new Error('token不存在')
//             if (!tenantId) throw new Error('tenantId不存在')
//             // const appId = getQueryVariable(currentUrl)
//             console.log(spliceURL(formId, documentId, token, tenantId))
//         }
//         // console.log(e)
//     })
//     container.appendChild(inputWrraper)
//     callback()
// }

function printIfameUrl(documentId) {
  // const documentId = inputWrraper.value
  // const currentUrl = window.location.href
  const appId = getQueryVariable("appId");
  if (!appId) throw new Error("appId不存在");
  const formId = getQueryVariable("formId");
  if (!formId) throw new Error("formId不存在");
  const { token, tenantId } = getTokenAndTenant(appId);
  if (!token) throw new Error("token不存在");
  if (!tenantId) throw new Error("tenantId不存在");
  // const appId = getQueryVariable(currentUrl)
  const iframeUrl = spliceURL(formId, documentId, token, tenantId)
  console.log(iframeUrl);
  window.open(iframeUrl, '_blank')
}

function getTokenAndTenant(appId) {
  const vuexObj = window.localStorage.getItem(`__vuex__${appId}__local`);
  if (vuexObj) {
    return {
      token: JSON.parse(vuexObj)?.authModule?.token,
      tenantId: JSON.parse(vuexObj)?.authModule?.userInfo?.tenant?.id,
    };
  }
}

function spliceURL(formId, documentId, token, tenantId) {
  const state = {
    m1: {
      formId: formId,
      documentId: documentId,
      readOnly: "isApprove",
      module: "approvePage",
    },
  };
  const statePin = window.btoa(JSON.stringify(state));
  const tenantIdIndex = window.location.href.indexOf(tenantId);
  const urlpre = window.location.href.slice(0, tenantIdIndex);
  return (
    urlpre +
    "callback/apaas/index.html?xdaptoken=" +
    token +
    "&state=" +
    statePin
  );
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

function generateButton(buttonName, container, callback, style) {
  const button = document.createElement("input");
  button.type = "button";
  button.value = buttonName;
  style &&
    Object.keys(style).forEach((key) => {
      button.style[key] = style[key];
    });
  button.addEventListener("click", () => {
    callback();
  });
  container.appendChild(button);
  console.log(`${buttonName}按钮已生成`);
}

function quickIframe(drawerDom) {
  const buildRenderVue = document.querySelector(".x-form-build-render").__vue__;
  if (!buildRenderVue) {
    console.log("找不到form-build-render组件的vue实例");
    return;
  }
  const formEngine = buildRenderVue?.$options?.propsData?.formEngine;
  const documentId = formEngine.engineContext.instance.documentId;
  var drawerFooterButtonDom = drawerDom.querySelector(".footer-op-block");
  generateButton("跳转iframe", drawerFooterButtonDom, () => {
    printIfameUrl(documentId);
  });
}

function editCurrentData(drawerDom) {
  const tileWidgetLabel = Array.from(
    drawerDom.querySelectorAll(".el-form-item__label")
  );
  const tileUuids = tileWidgetLabel.map((item) => item.htmlFor);
}
function turnUpVueDevToolFunc(type) {
  let accountPanel;
  let buttonStyle;
  if (type === "APP") {
    accountPanel = document.querySelector(".x-layout-account-control");
    buttonStyle = {
      height: "50%",
      marginTop: "calc(50% - 88px)",
      marginRight: "20px",
    };
  } else if (type === "WORKBENCH") {
    accountPanel = document.querySelector(".right");
  } else {
    accountPanel = document.querySelector(".base-header");
  }
  if (accountPanel) {
    generateButton(
      "开启vue插件",
      accountPanel,
      () => {
        var Vue, walker, node;
        walker = document.createTreeWalker(document.body, 1);
        while ((node = walker.nextNode())) {
          if (node.__vue__) {
            Vue = node.__vue__.$options._base;
            if (!Vue.config.devtools) {
              Vue.config.devtools = true;
              if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
                window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("init", Vue);
                console.log("==> vue devtools now is enabled");
              }
            }
            break;
          }
        }
      },
      buttonStyle
    );
  }
}

class ApaasExtendEngine {
  projectType = null;
  rootVueInstance = null;
  envContext = {};
  constructor() {
    this.updateContext();
    this.turnUpExtension();
  }
  updateContext() {
    this.rootVueInstance = document.querySelector("#app").__vue__;
    if (!this.rootVueInstance) {
      console.error("没找到根节点的vue实例");
      return;
    }
    this.envContext.GLOBAL_ENV = this.rootVueInstance.$options._base.GLOBAL_ENV;
    if (!this.envContext.GLOBAL_ENV) {
      this.projectType = "PUBLIC";
      throw new Error("公有云暂不支持");
    } else {
      if (
        this.envContext.GLOBAL_ENV.hasOwnProperty("VUE_APP_PLATFORM_CLIENT_ID")
      ) {
        this.projectType = "PLATFORM";
      } else if (
        this.envContext.GLOBAL_ENV.hasOwnProperty(
          "VUE_APP_WORKBENCH_CLIENT_ID"
        ) &&
        this.envContext.GLOBAL_ENV["VUE_APP_WORKBENCH_CLIENT_ID"] !==
          "___VUE_APP_WORKBENCH_CLIENT_ID___"
      ) {
        this.projectType = "WORKBENCH";
      } else if (this.envContext.GLOBAL_ENV.hasOwnProperty("VUE_APP_APP_ID")) {
        this.projectType = "APP";
      }
    }
  }
  turnUpExtension() {
    if (this.projectType === "APP") {
      this.fastIfame();
    }
    this.vueDevTool(this.projectType);
  }
  fastIfame() {
    const MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    if (!MutationObserver)
      throw new Error("MutationObserver暂不支持您的浏览器");
    const observer = new MutationObserver(function (mutations) {
      if (mutations.length > 0) {
        const targetMutation = mutations.find(
          (item) =>
            item.addedNodes &&
            item.addedNodes.length > 0 &&
            Array.from(item.addedNodes).findIndex(
              (_item) => _item._prevClass === "el-drawer__wrapper"
            ) > -1
        );
        if (!targetMutation) return;
        const drawerWrapperDom =
          targetMutation &&
          targetMutation.addedNodes &&
          Array.from(targetMutation.addedNodes).find(
            (item) => item._prevClass === "el-drawer__wrapper"
          );
        setTimeout(() => {
          quickIframe(drawerWrapperDom);
        }, 2000); // 快捷生成iframe功能
        // editCurrentData(drawerWrapperDom)
      }
    });

    const documentBody = document.body;
    observer.observe(documentBody, { attributes: true, childList: true });
  }
  vueDevTool(projectType) {
    turnUpVueDevToolFunc(projectType);
  }
}
(function () {
  window.onload = () => {
    setTimeout(() => {
      console.log(
        "欢迎使用apaas加强插件,目前版本包括打开线上vue插件、生成iframe地址功能"
      );
      new ApaasExtendEngine();
      // turnUpVueDevToolFunc()
    }, 2000);
  };
})();
