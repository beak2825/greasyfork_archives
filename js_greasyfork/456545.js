// ==UserScript==
// @name         WeChromium,微信网页版,网页版微信,Linux微信
// @namespace    sooo.site/wechromium
// @version      1.1.2
// @author       So
// @description  微信网页版增强 Monkey 脚本,UOS密钥强登,界面优化贴合应用模式
// @icon         https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png
// @homepage     https://github.com/Git-So/WeChromium
// @supportURL   https://github.com/Git-So/WeChromium/issues
// @match        https://wx.qq.com/*
// @match        https://wx1.qq.com/*
// @match        https://wx2.qq.com/*
// @match        https://wx8.qq.com/*
// @match        https://web.wechat.com/*
// @grant        unsafeWindow
// @noframes    
// @downloadURL https://update.greasyfork.org/scripts/456545/WeChromium%2C%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%2C%E7%BD%91%E9%A1%B5%E7%89%88%E5%BE%AE%E4%BF%A1%2CLinux%E5%BE%AE%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/456545/WeChromium%2C%E5%BE%AE%E4%BF%A1%E7%BD%91%E9%A1%B5%E7%89%88%2C%E7%BD%91%E9%A1%B5%E7%89%88%E5%BE%AE%E4%BF%A1%2CLinux%E5%BE%AE%E4%BF%A1.meta.js
// ==/UserScript==

(e=>{const n=document.createElement("style");n.dataset.source="vite-plugin-monkey",n.innerText=e,document.head.appendChild(n)})('#tool_bar .web_wechat_screencut,.panel .download_entry{display:none}.login>*{display:none}.login .login_box{display:block}body{background:#fff}body .login{min-width:unset;min-height:unset}body .login .login_box{box-shadow:unset}.main_inner{display:flex}.main_inner:after{content:""}.main_inner .header{width:2.8rem;background-color:#ebebeb;display:flex;flex-direction:column;align-items:center;padding:.5rem}.main_inner .header .avatar{padding:0}.main_inner .header .info{width:100%}.main_inner .header .info .nickname .display_name{display:none}.main_inner .header .tab{display:flex;flex-direction:column;flex-grow:1;padding:1rem 0}.main_inner .header .tab:after{display:none}.main_inner .header .tab .tab_item{margin:.8rem 0}.main_inner .header .tab .tab_item:after{display:none}.main_inner .header .tab .tab_item a.chat i.web_wechat_tab_friends,.main_inner .header .tab .tab_item a.chat i.web_wechat_tab_chat{filter:invert(1)}.main_inner .header .tab .tab_item a.chat i.web_wechat_tab_friends_hl,.main_inner .header .tab .tab_item a.chat i.web_wechat_tab_chat_hl{filter:unset}.main_inner .panel{background-color:#fff}.main_inner .panel #mmpop_system_menu{top:unset!important;left:-.5rem!important;bottom:1rem!important}.main_inner .panel #mmpop_system_menu .dropdown_menu{border:none}.main_inner .panel #search_bar.search_bar{width:100%}.main_inner .panel #search_bar.search_bar i.web_wechat_search{top:1rem;left:1rem;filter:invert(1)}.main_inner .panel #search_bar.search_bar .frm_search{margin:1rem;background-color:#f5f5f5;color:#000}.main_inner .panel #search_bar.search_bar .recommendation{width:100%;height:calc(100vh - 4rem);background:#ffffff;top:4rem;box-shadow:unset}.main_inner .panel #search_bar.search_bar .recommendation .contacts{height:100%!important;max-height:unset}.main_inner .panel #search_bar.search_bar .recommendation .contact_title,.main_inner .panel #search_bar.search_bar .recommendation .contact_item{background:transparent;border:none;color:#000}.main_inner .panel #search_bar.search_bar .recommendation .contact_title .info .nickname,.main_inner .panel #search_bar.search_bar .recommendation .contact_item .info .nickname{color:unset}.main_inner .panel .nav_view{top:4rem}.main_inner .panel .nav_view .chat_list .ico_loading{color:#07c160}.main_inner .panel .nav_view .chat_list .chat_item{background-color:transparent;border-bottom:none}.main_inner .panel .nav_view .chat_list .chat_item.active{background-color:#07c160}.main_inner .panel .nav_view .chat_list .chat_item.active .info .nickname{color:#fff}.main_inner .panel .nav_view .chat_list .chat_item .info .nickname{color:#000}.main_inner .panel .nav_view .chat_list .chat_item .ext .attr{font-size:.5rem}.main_inner .panel .nav_view .contact_list .contact_title{background-color:#fff;color:#000}.main_inner .panel .nav_view .contact_list .contact_item{border:none}.main_inner .panel .nav_view .contact_list .contact_item .info .nickname{color:#000}.main_inner .panel .nav_view .contact_list .active{background-color:#07c160}.main_inner .panel .nav_view .contact_list .active .contact_item .info .nickname{color:#fff}.main_inner div[ui-view=contentView]{flex-grow:1}.main_inner div[ui-view=contentView] #chatArea{background-color:#f5f5f5}.main_inner div[ui-view=contentView] #chatArea .box_hd .title_wrap{margin:0;background-color:transparent}.main_inner div[ui-view=contentView] #chatArea .box_hd .title_wrap,.main_inner div[ui-view=contentView] #chatArea .box_ft{border:none}.main_inner div[ui-view=contentView] #chatArea .box_bd.chat_bd{border:1px solid #e5e5e5;border-width:1px 0}.main_inner div[ui-view=contentView] #chatArea .content .bubble.bubble_primary{background-color:#07c160;color:#fff}.main_inner div[ui-view=contentView] #chatArea .content .bubble.bubble_primary:before,.main_inner div[ui-view=contentView] #chatArea .content .bubble.bubble_primary.right:after{border-left-color:#07c160}.main_inner div[ui-view=contentView] #chatArea .action .btn_send{background-color:#07c160;color:#fff;border:none}.main,.main_inner{height:100%;width:100%;max-height:100%;max-width:100%;margin:0;padding:0}');

(function() {
  var _a, _b, _c;
  "use strict";
  const $ = document.querySelector.bind(document);
  const mutationObserverInit = { attributes: true, childList: true, subtree: true };
  function useDomWatch(selectors, callback, autoStart = true, config) {
    const observer = new MutationObserver(callback);
    const onStart = () => dom && observer.observe(dom, config || mutationObserverInit);
    const onStop = () => observer.disconnect();
    const dom = $(selectors);
    if (autoStart && dom) {
      observer.observe(dom, config || mutationObserverInit);
    }
    return {
      onStart,
      onStop
    };
  }
  function ref(value) {
    return { value };
  }
  function resizeAndCenter(x, y) {
    window.resizeTo(x, y);
    window.moveTo((screen.width - x) / 2, (screen.height - y) / 2);
  }
  function useWindowWatch(func, init2 = false) {
    init2 && func([], true);
    useDomWatch("body", (mutations) => {
      if (mutations.length < 1)
        return;
      func(mutations, false);
    });
  }
  var ReadyState = /* @__PURE__ */ ((ReadyState2) => {
    ReadyState2[ReadyState2["UNSENT"] = 0] = "UNSENT";
    ReadyState2[ReadyState2["OPENED"] = 1] = "OPENED";
    ReadyState2[ReadyState2["HEADERS_RECEIVED"] = 2] = "HEADERS_RECEIVED";
    ReadyState2[ReadyState2["LOADING"] = 3] = "LOADING";
    ReadyState2[ReadyState2["DONE"] = 4] = "DONE";
    return ReadyState2;
  })(ReadyState || {});
  const eventList = ref(/* @__PURE__ */ new Map([]));
  const initState = ref(false);
  function init() {
    if (initState.value)
      return;
    initState.value = true;
    const originXMLHttpRequestOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async = true, username, password) {
      const uri = url instanceof URL ? url : new URL((url.indexOf("/") == 0 ? location.origin : "") + url);
      this.addEventListener("readystatechange", function() {
        var _a2;
        (_a2 = eventList.value.get(this.readyState)) == null ? void 0 : _a2.forEach((fn) => fn(this, uri));
      });
      originXMLHttpRequestOpen.apply(this, [method, url, async, username, password]);
    };
  }
  function addListener(readyState, func) {
    var _a2;
    if (!eventList.value.get(readyState)) {
      eventList.value.set(readyState, []);
    }
    (_a2 = eventList.value.get(readyState)) == null ? void 0 : _a2.push(func);
  }
  function removeListener(readyState, func) {
    var _a2, _b2, _c2;
    const index = (_a2 = eventList.value.get(readyState)) == null ? void 0 : _a2.findIndex((fn) => fn === func);
    if (index === void 0 || index < 0)
      return;
    (_c2 = (_b2 = eventList.value) == null ? void 0 : _b2.get(readyState)) == null ? void 0 : _c2.splice(index, 1);
  }
  init();
  const XHR = {
    ReadyState,
    init,
    addListener,
    removeListener
  };
  const style = "";
  const loginState = ref(false);
  useWindowWatch((_, force = true) => {
    const currLoginState = !document.body.classList.contains("unlogin");
    if (force || currLoginState != loginState.value) {
      loginState.value = currLoginState;
      currLoginState ? resizeAndCenter(800, 600) : resizeAndCenter(380, 540);
    }
  }, true);
  if (location.pathname == "/" && location.search.indexOf("target=t") == -1) {
    location.search = location.search == "" ? "?target=t" : "&target=t";
  }
  const extspam = "Go8FCIkFEokFCggwMDAwMDAwMRAGGvAESySibk50w5Wb3uTl2c2h64jVVrV7gNs06GFlWplHQbY/5FfiO++1yH4ykCyNPWKXmco+wfQzK5R98D3so7rJ5LmGFvBLjGceleySrc3SOf2Pc1gVehzJgODeS0lDL3/I/0S2SSE98YgKleq6Uqx6ndTy9yaL9qFxJL7eiA/R3SEfTaW1SBoSITIu+EEkXff+Pv8NHOk7N57rcGk1w0ZzRrQDkXTOXFN2iHYIzAAZPIOY45Lsh+A4slpgnDiaOvRtlQYCt97nmPLuTipOJ8Qc5pM7ZsOsAPPrCQL7nK0I7aPrFDF0q4ziUUKettzW8MrAaiVfmbD1/VkmLNVqqZVvBCtRblXb5FHmtS8FxnqCzYP4WFvz3T0TcrOqwLX1M/DQvcHaGGw0B0y4bZMs7lVScGBFxMj3vbFi2SRKbKhaitxHfYHAOAa0X7/MSS0RNAjdwoyGHeOepXOKY+h3iHeqCvgOH6LOifdHf/1aaZNwSkGotYnYScW8Yx63LnSwba7+hESrtPa/huRmB9KWvMCKbDThL/nne14hnL277EDCSocPu3rOSYjuB9gKSOdVmWsj9Dxb/iZIe+S6AiG29Esm+/eUacSba0k8wn5HhHg9d4tIcixrxveflc8vi2/wNQGVFNsGO6tB5WF0xf/plngOvQ1/ivGV/C1Qpdhzznh0ExAVJ6dwzNg7qIEBaw+BzTJTUuRcPk92Sn6QDn2Pu3mpONaEumacjW4w6ipPnPw+g2TfywJjeEcpSZaP4Q3YV5HG8D6UjWA4GSkBKculWpdCMadx0usMomsSS/74QgpYqcPkmamB4nVv1JxczYITIqItIKjD35IGKAUwAA==";
  XHR.addListener(XHR.ReadyState.OPENED, (xhr, uri) => {
    if (uri.pathname == "/cgi-bin/mmwebwx-bin/webwxnewloginpage") {
      xhr.setRequestHeader("extspam", extspam);
      xhr.setRequestHeader("client-version", "2.0.0");
    }
  });
  const contextMenu = $("#contextMenu");
  if (contextMenu) {
    (_a = $(".main_inner")) == null ? void 0 : _a.insertAdjacentElement("beforebegin", contextMenu);
  }
  const tab = $(".panel .tab");
  if (tab) {
    (_b = $(".panel .header .info")) == null ? void 0 : _b.insertAdjacentElement("beforebegin", tab);
  }
  const header = $(".panel .header");
  if (header) {
    (_c = $(".main_inner")) == null ? void 0 : _c.insertAdjacentElement("afterbegin", header);
  }
})();
