// ==UserScript==
// @name         tianteng
// @namespace    https://greasyfork.org/xmlspy
// @version      2.0.22
// @author       xmlspy
// @description  各种开车网站的优化,javbus,javlib
// @license      MIT
// @match        *://*/*
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js#sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=
// @require      https://cdn.jsdelivr.net/npm/ldloader@3.0.3/index.min.js
// @require      https://cdn.jsdelivr.net/npm/tabbyjs@12.0.3/dist/js/tabby.min.js
// @resource     ldbutton/index.min.css             https://cdn.jsdelivr.net/npm/ldbutton@2.0.4/index.min.css
// @resource     ldloader/index.min.css             https://cdn.jsdelivr.net/npm/ldloader@3.0.3/index.min.css
// @resource     tabbyjs/dist/css/tabby-ui.min.css  https://cdn.jsdelivr.net/npm/tabbyjs@12.0.3/dist/css/tabby-ui.min.css
// @connect      *
// @grant        GM.setClipboard
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/498956/tianteng.user.js
// @updateURL https://update.greasyfork.org/scripts/498956/tianteng.meta.js
// ==/UserScript==

(function ($, Tabby, ldloader) {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function getComputedStyleMap(element) {
    const styleMap = {};
    if (element.computedStyleMap) {
      element.computedStyleMap().forEach((value, key) => {
        styleMap[key] = value;
      });
    } else {
      const style = window.getComputedStyle(element);
      for (let i = 0; i < style.length; i++) {
        const prop = style[i];
        const value = style.getPropertyValue(prop);
        styleMap[prop] = value;
      }
    }
    return styleMap;
  }
  function getUrlParam(url, name) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(name);
  }
  function drawImage(ImgObj, maxWidth, maxHeight) {
    var image = new Image();
    image.src = ImgObj.src;
    var tempWidth;
    var tempHeight;
    if (image.width > 0 && image.height > 0) {
      if (image.width / image.height >= maxWidth / maxHeight) {
        if (image.width > maxWidth) {
          tempWidth = maxWidth;
          tempHeight = image.height * maxWidth / image.width;
        } else {
          tempWidth = image.width;
          tempHeight = image.height;
        }
      } else {
        if (image.height > maxHeight) {
          tempHeight = maxHeight;
          tempWidth = image.width * maxHeight / image.height;
        } else {
          tempWidth = image.width;
          tempHeight = image.height;
        }
      }
      ImgObj.height = tempHeight;
      ImgObj.width = tempWidth;
      ImgObj.alt = image.width + "×" + image.height;
    }
  }
  function appendCopyButton(chePai, toAppendElement, callback) {
    var copyButton = document.createElement("button");
    copyButton.innerHTML = "复 制";
    copyButton.setAttribute("id", "copyButton");
    toAppendElement.appendChild(copyButton);
    document.addEventListener("click", (e) => {
      if (e.target.getAttribute("id") === "copyButton") {
        _GM.setClipboard(chePai, "text");
      }
    });
    callback && callback(copyButton, chePai, toAppendElement);
  }
  function addPasteAndSearchButton($searchButton, $searchInput, callback) {
    let styleMap = {};
    if ($searchButton[0]) {
      styleMap = getComputedStyleMap($searchButton[0]);
    }
    styleMap["margin-left"] = "5px";
    let $pasteAndSearchButton = $(
      `<input type="button" value="粘贴&搜索" id="pasteAndSearch"></input>`
    );
    $pasteAndSearchButton.css(styleMap);
    $searchButton.after($pasteAndSearchButton);
    $pasteAndSearchButton.click(() => {
      navigator.clipboard.readText().then((clipText) => {
        if (clipText != null && $.trim(clipText) != "") {
          $searchInput.val($.trim(clipText));
          $searchButton.click();
        }
      });
    });
    return $pasteAndSearchButton;
  }
  let seq = 0;
  function debug(str, title) {
    {
      if (!str) {
        str = "";
      }
      if (!Array.isArray(str)) {
        str = [str];
      }
      seq++;
      console.log(
        `%c【tianteng ${_GM_info.script.version}】 ${title ? title : "debug"}:`,
        "color: yellow;font-size: large;font-weight: bold;background-color: darkblue;",
        seq,
        ...str
      );
    }
  }
  function pasteAndSearchEventHandler(searchButton, searchInput, pasteAndSearchButton) {
    pasteAndSearchButton.on("click", () => {
      navigator.clipboard.readText().then((clipText) => {
        if (clipText != null && $.trim(clipText) != "") {
          searchInput.val($.trim(clipText));
          searchButton.trigger("click");
        }
      });
    });
  }
  function observe(target, options, callback) {
    return new MutationObserver(callback).observe(target, options);
  }
  function interceptEventListener(interceptorAdd, interceptorRemove) {
    const ep = EventTarget.prototype;
    if (!ep.addEventListenerOriginal) {
      ep.addEventListenerOriginal = ep.addEventListener;
      ep.addEventListener = function(type, callback, options) {
        if (this) {
          if (interceptorAdd) {
            const result = interceptorAdd(this, type, callback, options);
            if (result === true) {
              return;
            }
          }
          this.allListeners = this.allListeners || [];
          this.allListeners.push({ type, callback, options });
          this.addEventListenerOriginal.apply(this, arguments);
        } else {
          debug(
            `[this] is bad. type: ${type}  callback: ${callback}  options: ${options}`,
            "addEventListenerHook"
          );
        }
      };
    }
    if (!ep.removeEventListenerOriginal) {
      ep.removeEventListenerOriginal = ep.removeEventListener;
      ep.removeEventListener = function(type, callback, options) {
        if (this) {
          {
            debug(
              `[this] is bad. type: ${type}  callback: ${callback}  options: ${options}`,
              "removeEventListenerHook"
            );
          }
        }
      };
    }
  }
  function makeRequestHeaders(headers) {
    return $.extend(
      {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "max-age=0",
        "Sec-Ch-Ua": '"Chromium";v="119", "Not?A_Brand";v="24"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": "Windows",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.160 Safari/537.36"
      },
      headers
    );
  }
  class HandlerExecutor {
    constructor(handler) {
      this.handler = handler;
      this.execute = this.execute.bind(this);
      this.checkCondition = this.checkCondition.bind(this);
    }
    execute() {
      if (!this.handler) {
        throw new Error("handler is not defined");
      }
      const { name, condition, handle } = this.handler;
      if (!name) {
        throw new Error("handler name is not defined");
      }
      if (!handle) {
        throw new Error("handler handle is not defined");
      }
      const result = this.checkCondition(condition);
      if (result.success === true) {
        handle(condition, result.keyOrIndex);
      }
      return result;
    }
    /**
     *
     * @param {RegExp|Function|boolean|string|jQuery|Array<any>} condition
     * @returns {Result}
     */
    checkCondition(condition) {
      if ($.type(condition) === "regexp") {
        return new Result(condition.test(window.location.href));
      }
      if ($.isFunction(condition)) {
        return new Result(condition() === true);
      }
      if ($.type(condition) === "boolean") {
        return new Result(condition === true);
      }
      if ($.type(condition) === "string") {
        return new Result(document.querySelector(condition) != null);
      }
      if (condition instanceof $) {
        return new Result(condition.length > 0);
      }
      if ($.isPlainObject(condition)) {
        for (const key in condition) {
          if (this.checkCondition(condition[key]).success) {
            return new Result(true, key);
          }
        }
      }
      if ($.isArray(condition)) {
        for (const [index, value] of condition) {
          if (this.checkCondition(value).success) {
            return new Result(true, index);
          }
        }
      }
      return new Result(false);
    }
  }
  class Result {
    constructor(success, keyOrIndex) {
      this.success = success;
      this.keyOrIndex = keyOrIndex;
    }
  }
  class Handler {
    constructor() {
      if (this.constructor === Handler) {
        throw new TypeError("Can not construct abstract class.");
      }
      this.handle = this.handle.bind(this);
    }
    get name() {
      throw new Error("not implemented");
    }
    get condition() {
      throw new Error("not implemented");
    }
    handle(condition, keyOrIndex) {
      throw new Error("not implemented");
    }
  }
  class BaiduHandler extends Handler {
    get name() {
      return "百度";
    }
    get condition() {
      return /baidu\.com/;
    }
    handle(condition, keyOrIndex) {
      debug("添加 粘贴并搜索 按钮", this.name);
      const searchButton = $(`[type="submit"]`);
      const searchInput = $(`#kw`);
      if (searchButton.length === 0 || searchInput.length === 0) {
        debug("找不到搜索按钮或搜索输入框", this.name);
        debug("serachButton.length:{serachButton.length}", this.name);
        debug("searchInput.length:{searchInput.length}", this.name);
        return;
      }
      const pasteAndSearchButton = searchButton.clone();
      pasteAndSearchButton.val("粘贴&搜索").removeAttr("id").attr("type", "button");
      searchButton.parent().append(pasteAndSearchButton);
      searchButton.parent().css("width", "auto");
      _GM_addStyle(`
      #head_wrapper .s_form {
        width: auto;
        height: 100%;
        margin: 0 auto;
        text-align: center;
      }
      #head_wrapper .s_btn_wr .wrapper_new{
        width:auto;
      }
    `);
      pasteAndSearchEventHandler(searchButton, searchInput, pasteAndSearchButton);
    }
  }
  class OsChinaHandler extends Handler {
    get name() {
      return "开源中国";
    }
    get condition() {
      return /oschina\.net/;
    }
    handle(condition, keyword) {
      debug("修改首页某些链接无法中键点击问题.", "开源中国");
      $(`[data-href]`).each(function() {
        const $this = $(this);
        const href = $this.attr("data-href");
        const classCss = $this.attr("class");
        const title = $this.attr("title");
        const innerHtml = this.innerHTML;
        const html = `<a target="_blank" title="${title}" href="${href}" class="${classCss}">${innerHtml}</a>`;
        $this.replaceWith(html);
      });
      debug("删除url中的重定向.", "开源中国");
      $('a[href*="/action/GoToLink?url"]').each(function() {
        let href = $(this).attr("href");
        if (href) {
          let url = getUrlParam(href, "url");
          $(this).attr("href", url);
        }
      });
    }
  }
  class GiteeHandler extends Handler {
    get name() {
      return "gitee";
    }
    get condition() {
      return /gitee\.com/;
    }
    handle(condition, keyword) {
      debug("删除url中的重定向.", "gitee");
      $('a[href*="/link?target"]').each(function(index) {
        let href = $(this).attr("href");
        if (href) {
          let url = getUrlParam(href, "target");
          $(this).attr("href", url);
        }
      });
    }
  }
  class ZhihuHandler extends Handler {
    get name() {
      return "知乎";
    }
    get condition() {
      return /zhihu\.com/;
    }
    handle(condition, keyOrIndex) {
      debug("添加 粘贴并搜索 按钮", "知乎");
      const searchButton = $(`button[class*="SearchBar-searchButton"]`);
      const searchInput = $(`#Popover1-toggle`);
      addPasteAndSearchButton(searchButton, searchInput);
    }
  }
  class WnacgHandler extends Handler {
    get name() {
      return "绅士漫画";
    }
    get condition() {
      return $('head>title:contains("紳士漫畫")');
    }
    handle(condition, keyword) {
      if (location.href.includes("photos-index-aid")) {
        debug("明细页面添加搜索框", "紳士漫畫");
        const searchInput = `
          <div class="search" style="float:right;">
            <form id="album_search q-form" action="/search/" method="get" _lpchecked="1">
              <div class="input-append" id="q-input">
                <input type="text" class="search-query ui-autocomplete-input tips"
                  name="q" value="" title="搜索漫畫" autocomplete="off"
                  role="textbox" aria-autocomplete="list" aria-haspopup="true">
                <input style="display:none" type="radio" name="f" value="_all" checked="">
                <input style="display:none" name="s" value="create_time_DESC">
                <input style="display:none" name="syn" value="yes">
                <button type="" name=""></button>
              </div>
            </form>
          </div>
        `;
        $("#bodywrap").prepend(searchInput);
      }
      if (location.href.includes("photos-slide-aid")) {
        debug("下拉阅读页面,图片由一列改为两列", "紳士漫畫");
        const nodeToObserve = document.querySelector("#img_list");
        $(nodeToObserve).css({
          width: "100%",
          display: "flex",
          "flex-wrap": "wrap",
          "justify-content": "flex-start",
          "overflow-x": "hidden"
        });
        const imgWidth = document.documentElement.clientWidth / 2 - 10;
        const imgHeight = document.documentElement.clientHeight - 50;
        new MutationObserver((mutations, observer) => {
          $("#img_list>div").css({
            flex: "1",
            "background-color": "#cacaca",
            margin: "0 5px 5px 0",
            width: "calc((100% - 10px) / 2)",
            "min-width": "calc((100% - 10px) / 2)",
            "max-width": "calc((100% - 10px) / 2)"
          });
          $("#img_list>div>img").on("load", (e) => {
            drawImage(e.target, imgWidth, imgHeight);
          });
        }).observe(nodeToObserve, { childList: true });
      }
      if ($("input.search-query").length > 0) {
        debug("为搜索框后面添加 粘贴&搜索 按钮", "紳士漫畫");
        const searchInput = $("[name=q]");
        const searchButton = $("#q-input > button");
        const pasteAndSearchButton = $(
          `<button style="float:right;height:30px;">粘贴&amp;搜索</button>`
        );
        $("#bodywrap").prepend(pasteAndSearchButton);
        pasteAndSearchEventHandler(searchButton, searchInput, pasteAndSearchButton);
      }
    }
  }
  const domainConfig = {
    javbus: { url: "https://www.cdnbus.ink" },
    javlib: { url: "https://www.z93j.com" },
    ciligege: { url: "https://www.ciligege2.com" },
    // https://tellme.pw/btsow   https://btsow.com
    btsow: { url: "https://btsow.pics" },
    btsearch: { url: "https://www.btsearch.love" },
    // 最新地址發布（請收藏）：u9a9.link ，永久域名 u9a9.com，u9a9.net，u9a9.ru，u9a9.xyz，u9a9.org，u9a9.me
    // Email: u9a9.com#protonmail.com
    u9a9: { url: "https://y.u9a9y.xyz" },
    skrbt: { url: "https://skrbtlz.top" }
  };
  domainConfig.javbus.searchUrl = `${domainConfig.javbus.url}/search?q=%s`;
  domainConfig.javlib.searchUrl = `${domainConfig.javlib.url}/search?q=%s`;
  domainConfig.ciligege.searchUrl = `${domainConfig.ciligege.url}/search/%s/1`;
  domainConfig.btsow.searchUrl = `${domainConfig.btsow.url}/#/search/%s`;
  domainConfig.btsearch.searchUrl = `${domainConfig.btsearch.url}/search?q=%s`;
  domainConfig.u9a9.searchUrl = `${domainConfig.u9a9.url}/?type=2&search=%s`;
  domainConfig.skrbt.searchUrl = `${domainConfig.skrbt.url}/search?keyword=%s`;
  class FakeCookie extends Map {
    constructor(fullCookieString) {
      super();
      this.fullCookieString = fullCookieString;
    }
    get fullCookieString() {
      let result = "";
      this.forEach((value, key, self) => {
        result = result.concat(key).concat("=").concat(value).concat(";");
      });
      return result === "" ? result : result.substring(0, result.length - 1);
    }
    set fullCookieString(str) {
      if (str) {
        let items = str.split(";");
        items.map((element, index) => element.trim()).filter((element, index, self) => self.indexOf(element) === index).forEach((element) => {
          const pair = element.split("=");
          this.set(pair[0], pair[1]);
        });
      }
    }
    /**
     * 把newCookie合并到当前实例中.如果newCookie中的key与当前的实例重复,这使用newCookie中的覆盖.
     * @param {String|FakeCookie} newCookie 要合并的新cookie,类型为String或者FakeCookie.
     *  如果类型为String,表示包含全部cookie内容的字符串;
     */
    merge(newCookie) {
      if (!newCookie) {
        return;
      }
      let newFakeCookie;
      if (typeof newCookie === "string") {
        newFakeCookie = new FakeCookie(newCookie);
      } else if (newCookie instanceof FakeCookie) {
        newFakeCookie = newCookie;
      } else {
        throw new TypeError("Invalid type.");
      }
      newFakeCookie.forEach((value, key, self) => this.set(key, value));
    }
  }
  let fakeCookie = new FakeCookie();
  function getSearchResultFromSkrbt(chepai, callback) {
    const skrbtUrl = domainConfig.skrbt.url;
    const searchUrl = domainConfig.skrbt.searchUrl.replace("%s", chepai);
    function getResponseHeader(response, name) {
      if (response && response.responseHeaders && name) {
        var arr = response.responseHeaders.trim().split(/[\r\n]+/);
        var headerMap = {};
        arr.forEach(function(line) {
          var parts = line.split(": ");
          var header = parts.shift();
          var value = parts.join(": ");
          headerMap[header] = value;
        });
        return headerMap[name];
      }
      return null;
    }
    function onResponseHeaderRecieved(response) {
      if (response.readyState === response.HEADERS_RECEIVED) {
        console.log(response.responseHeaders);
        const setCookie = getResponseHeader(response, "Set-Cookie");
        fakeCookie.merge(setCookie);
      }
    }
    const timeoutIds = [];
    function clearTimeouts() {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    }
    function successHandler(response, callback2) {
      clearTimeouts();
      const $container = $(response.responseText).find(".col-md-6:eq(2)");
      const data = $.map($container.find(".list-unstyled"), (item) => {
        const title = $(item).find("a.rrt.common-link").html();
        const detailHref = $(item).find("a.rrt.common-link").attr("href");
        const fileSize = $(item).find("li.rrmi > span:nth-child(2)").text();
        const fileCount = $(item).find("li.rrmi > span:nth-child(3)").text();
        const timeIncluded = $(item).find("li.rrmi > span:nth-child(4)").text();
        return {
          name: title,
          detailUrl: domainConfig.skrbt.url + detailHref,
          //明细页面地址
          size: fileSize,
          // 文件总大小
          fileCount,
          // 文件总数
          date: timeIncluded
          // 收入时间
        };
      });
      callback2({
        result: 0,
        data
        // html: $container.html(),
      });
    }
    _GM_xmlhttpRequest({
      method: "get",
      headers: makeRequestHeaders({ Referer: skrbtUrl }),
      url: searchUrl,
      onerror: function(e) {
        console.log(e);
      },
      onload: function(response) {
        console.log(response);
        if (response.finalUrl.includes("/search?")) {
          console.log("-----------OK");
          successHandler(response, callback);
        } else if (response.finalUrl.includes("/challenge")) {
          waitRecaptcha();
        } else {
          console.log("错误");
          clearTimeouts();
          callback({ result: 1, message: "" });
        }
      },
      onreadystatechange: onResponseHeaderRecieved
    });
    function waitRecaptcha() {
      var remain = 10;
      var startTime = (/* @__PURE__ */ new Date()).getTime();
      timeoutIds.unshift(setTimeout(timeoutHandler, 1e3));
      timeoutIds.unshift(setTimeout(doChallange, 1e3));
      function timeoutHandler() {
        console.log("timeoutHandler");
        remain = remain - 1;
        console.log(`remain: ${remain}`);
        if (remain > 0) {
          timeoutIds.unshift(setTimeout(timeoutHandler, 1e3));
        } else {
          doSubmit(randomString(100));
        }
      }
      function doChallange() {
        console.log("doChallange");
        var aywcUid = genOrGetAywcUid();
        var genApi = skrbtUrl + "/anti/recaptcha/v4/gen?aywcUid=" + aywcUid + "&_=" + (/* @__PURE__ */ new Date()).getTime();
        _GM_xmlhttpRequest({
          method: "get",
          responseType: _GM_xmlhttpRequest.RESPONSE_TYPE_JSON,
          headers: makeRequestHeaders({
            Referer: `${skrbtUrl}/recaptcha/v4/challenge?url=${skrbtUrl}&s=1`
          }),
          url: genApi,
          onerror: function(e) {
            console.log(/* @__PURE__ */ new Date() + ": " + e);
            timeoutIds.unshift(setTimeout(doChallange, 1e3));
            console.log(e);
          },
          onload: function(response) {
            const genResult = response.response;
            if (genResult.errno == 0) {
              doSubmit(genResult.token);
            } else {
              timeoutIds.unshift(setTimeout(doChallange, 1e3));
            }
          },
          onreadystatechange: onResponseHeaderRecieved
        });
      }
      function doSubmit(token) {
        console.log("doSubmit");
        var costtime = (/* @__PURE__ */ new Date()).getTime() - startTime;
        _GM_xmlhttpRequest({
          method: "get",
          headers: makeRequestHeaders({
            Referer: `${skrbtUrl}/recaptcha/v4/challenge?url=${skrbtUrl}&s=1`
          }),
          url: `${skrbtUrl}/anti/recaptcha/v4/verify?token=${token}&aywcUid=${genOrGetAywcUid()}&costtime=${costtime}`,
          onerror: function(e) {
            console.log(e);
            clearTimeouts();
            callback({ result: 2, message: "" });
          },
          onload: function(response) {
            console.log("-----doSubmit OK");
            console.log(response);
            if (response.finalUrl.includes("search?")) {
              successHandler(response, callback);
            } else {
              console.log("错误");
              clearTimeouts();
              callback({ result: 3, message: "" });
            }
          },
          onreadystatechange: onResponseHeaderRecieved
        });
      }
      function genOrGetAywcUid() {
        const unifyidKey = "aywcUid";
        let aywcUid = fakeCookie.get(unifyidKey);
        if (isEmpty(aywcUid)) {
          aywcUid = randomString(10) + "_" + formatDate("yyyyMMddhhmmss", /* @__PURE__ */ new Date());
          fakeCookie.set(unifyidKey, aywcUid);
        }
        return aywcUid;
      }
      function isEmpty(x) {
        if (x == null || x == void 0 || x == "") {
          return true;
        } else {
          return false;
        }
      }
      function randomString(len, charSet) {
        charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var randomString2 = "";
        for (var i = 0; i < len; i++) {
          var randomPoz = Math.floor(Math.random() * charSet.length);
          randomString2 += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString2;
      }
      function formatDate(fmt, date) {
        var o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(),
          "h+": date.getHours(),
          "m+": date.getMinutes(),
          "s+": date.getSeconds(),
          "q+": Math.floor((date.getMonth() + 3) / 3),
          S: date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
          if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
          }
        }
        return fmt;
      }
    }
  }
  const magnetTabsConfig = {
    id: "tianteng-magnet-tabs",
    tabs: [
      {
        id: "tianteng-tab-skrbt",
        title: "SKRBT",
        url: domainConfig.skrbt.searchUrl,
        default: true,
        type: 1
      },
      {
        id: "tianteng-tab-btsow",
        title: "BTSOW",
        url: domainConfig.btsow.searchUrl,
        extractor: function(doc, itemCallback) {
          const data = [];
          $("div.data-list>.row[class=row]", doc).each(function(index, item) {
            const detailUrl = "https:" + $("a", item).attr("href");
            const name = $("a>div:first", item).html();
            let magnet = $("a", item).attr("href").split("/#/magnet/detail/")[1];
            magnet = `magnet:?xt=urn:btih:${magnet}`;
            const size = $(item).children("div").first().text().replace("文件大小：", "");
            const date = $(item).children("div").last().text().replace("时间：", "");
            const record = {
              detailUrl,
              name,
              magnet,
              size,
              date
            };
            data.push(record);
            itemCallback && itemCallback(record, index, item);
          });
          return data;
        }
      },
      {
        id: "tianteng-tab-ciligege",
        title: "CiLiGeGe",
        url: domainConfig.ciligege.searchUrl,
        extractor: function(doc, itemCallback) {
          const data = [];
          $("div.bt-list>.bt-card", doc).each(function(index, item) {
            const detailUrl = domainConfig.ciligege.url + $("a", item).attr("href");
            const name = $("a", item).html();
            let magnet = $("a", item).attr("href").replace("/search/", "");
            magnet = `magnet:?xt=urn:btih:${magnet}`;
            const size = $("div.bt-card-body>span", item).first().text().replace("文件大小：", "");
            const date = $("div.bt-card-body>span", item).last().text().replace("时间：", "");
            const record = {
              detailUrl,
              name,
              magnet,
              size,
              date
            };
            data.push(record);
            itemCallback && itemCallback(record, index, item);
          });
          return data;
        }
      },
      {
        id: "tianteng-tab-u9a9",
        title: "U9A9",
        url: domainConfig.u9a9.searchUrl,
        extractor: function(doc, itemCallback) {
          const data = [];
          $("tbody>tr", doc).each(function(index, item) {
            const chepai = $("#tianteng-tab-u9a9").data("tiantengChepai");
            const a = $("td", item).eq(1).find("a");
            const detailUrl = domainConfig.u9a9.url + a.attr("href");
            const name = a.html().replaceAll(new RegExp(chepai, "ig"), `<strong class='high-light'>${chepai}</strong>`);
            let magnet = $("td", item).eq(2).find("a").eq(1).attr("href");
            const size = $("td", item).eq(3).text();
            const date = $("td", item).eq(4).text();
            const record = {
              detailUrl,
              name,
              magnet,
              size,
              date
            };
            data.push(record);
            itemCallback && itemCallback(record, index, item);
          });
          return data;
        }
      }
    ]
  };
  class MagnetTab {
    /**
     *
     * @param {string} chepai 车牌号
     * @param {Function} onAttach 回调函数，function(tabContainer),
     * 参数tabContainer是整个MagnetTab的根节点,可以在此函数中把tabContainer插入到页面中
     * @param {object} tabsConfig 配置
     */
    constructor(chepai, onAttach, tabsConfig) {
      _GM_addStyle(_GM_getResourceText("tabbyjs/dist/css/tabby-ui.min.css"));
      this.chepai = chepai.toUpperCase();
      if (this.chepai && this.chepai.startsWith("T-38")) {
        this.chepai = this.chepai.replace("T-38", "T38-");
      }
      if (tabsConfig) {
        this.tabsConfig = tabsConfig;
      } else {
        this.tabsConfig = magnetTabsConfig;
      }
      this.onAttach = onAttach;
      this.init();
    }
    getConfig(id) {
      for (let i = 0; this.tabsConfig.tabs.length; i++) {
        const config = this.tabsConfig.tabs[i];
        if (id === config.id) {
          return config;
        }
      }
      return null;
    }
    /**
     *
     * <ul id="tianteng-magnet-tabs">
     *    <li><a data-tabby-default href="#tianteng-tab-skrbt">tab上的文字</a></li>
     *    <li><a href="#hermione">tab上的文字</a></li>
     *    <li><a href="#neville">tab上的文字</a></li>
     * </ul>
     *
     * <div id="tianteng-tab-skrbt">tab内容,是个table</div>
     * <div id="hermione">tab内容,是个table</div>
     * <div id="neville">tab内容,是个table</div>
     */
    init() {
      this.handleButtonClick();
      const fragment = document.createDocumentFragment();
      const ul = document.createElement("ul");
      ul.id = this.tabsConfig.id;
      fragment.append(ul);
      let defaultTabConfig;
      let defaultTab;
      let defaultTabContent;
      this.tabsConfig.tabs.forEach((tab, index, array) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${tab.id}`;
        a.text = tab.title;
        li.append(a);
        ul.append(li);
        const div = document.createElement("div");
        div.id = tab.id;
        div.dataset["tiantengTabConfig"] = JSON.stringify(tab);
        div.dataset["tiantengChepai"] = this.chepai;
        div.tiantengTabConfig = tab;
        fragment.append(div);
        if (tab.default === true) {
          a.dataset["tabbyDefault"] = "";
          defaultTabConfig = tab;
          defaultTab = a;
          defaultTabContent = div;
        }
      });
      const tabsContainer = document.createElement("div");
      tabsContainer.id = "tianteng-tabs-container";
      tabsContainer.append(fragment);
      this.onAttach(tabsContainer);
      $(tabsContainer).before(`
      <style id='tianteng-tab-style'>
        #tianteng-tabs-container {
          background-color:white;
          margin-top:10px;
          margin-bottom:10px;
          padding:12px;
        }
        #tianteng-tabs-container strong,
        #tianteng-tabs-container em,
        #tianteng-tabs-container .high-light,
        #tianteng-tabs-container .highlight{
          font-weight:normal;
          color:#F00;
        }
        #tianteng-tabs-container tr:hover{
          background-color:#d7e7f4;
        }
        #tianteng-tabs-container th,
        #tianteng-tabs-container td{
          text-align:center;
          padding:10px,10px !important;
        }
      </style>`);
      _GM_addStyle(_GM_getResourceText("ldloader/index.min.css"));
      _GM_addStyle(_GM_getResourceText("ldbutton/index.min.css"));
      this.tabby = new Tabby(`#${this.tabsConfig.id}`);
      document.addEventListener(
        "tabby",
        (event) => {
          const tab = event.detail.tab;
          const content = event.detail.content;
          this.currentTabConfig = content.tiantengTabConfig;
          this.buildHtml(tab, content);
        },
        false
      );
      this.currentTabConfig = defaultTabConfig;
      this.buildHtml(defaultTab, defaultTabContent);
    }
    buildHtml(tab, tabContent) {
      if ($(tabContent).data("tiantengStatus") === "ok") {
        return;
      }
      let tabConfig = tabContent.tiantengTabConfig;
      let tableHtml = `
        <table class="tianteng-magnet-table"
          style="border-collapse: collapse;text-align:center;width:100%;">
          <thead style="position:sticky;top:0;background-color:#f5f5f5;">
            <tr>
              <th style="border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-top: none; border-bottom: none; text-align:left;">
                磁力名称</th>
              <th style="border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-top: none; border-bottom: none;">
                档案大小</th>
              <th style="border-left: 1px solid #ccc; border-right: 1px solid #ccc; border-top: none; border-bottom: none;">
                分享日期</th>
            </tr>
          </thead>
          <tbody class="tianteng-magnet-tbody">
            {{tbody}}
          </tbody>
        </table>`;
      const chepai = this.chepai.replaceAll("-", "");
      const allChepai = `${this.chepai}+${this.chepai}c+${chepai}+${chepai}c`;
      const searchUrl = tabConfig.url.replace("%s", allChepai);
      if (tabConfig.type === 1 && tabConfig.id === "tianteng-tab-skrbt") {
        getSearchResultFromSkrbt(allChepai, function(data) {
          if (data.result == 0) {
            let tbodyHtml = "";
            data.data.forEach(function(record, index, array) {
              if (!record.name.startsWith("在线")) {
                tbodyHtml += `
              <tr>
                <td style="border: 1px solid #ccc; text-align:left; width:70%;">
                  <a style="color:#333"  target="_blank"
                    title="打开磁链明细页面"
                    href="${record.detailUrl}">
                    ${record.name}
                  </a>
                  <button class="btn btn-danger tianteng-copy  ld-ext-right"
                    type="button"
                    data-tianteng-magnet-url="${record.detailUrl}"
                    data-tianteng-magnet="${record.magnet}">
                    复制磁链
                    <div class="ld ldld bare"
                        style="width:1em;height:1em">
                    </div>
                  </button>
                  <button class="btn btn-danger tianteng-click  ld-ext-right"
                    type="button"
                    data-tianteng-magnet-url="${record.detailUrl}"
                    data-tianteng-magnet="${record.magnet}">
                    打开磁链
                    <div class="ld ldld bare"
                        style="width:1em;height:1em">
                    </div>
                  </button>
                </td>
                <td style="border: 1px solid #ccc;">${record.size}</td>
                <td style="border: 1px solid #ccc;">${record.date}</td>
              </tr>
              `;
              }
            });
            tableHtml = tableHtml.replace("{{tbody}}", tbodyHtml);
            $(tabContent).append(tableHtml);
            $(tabContent).data("tiantengStatus", "ok");
          }
        });
      } else {
        _GM_xmlhttpRequest({
          method: "GET",
          url: searchUrl,
          headers: makeRequestHeaders({ Referer: searchUrl }),
          onerror: function() {
            debug(arguments, "onerror");
          },
          ontimeout: function() {
            debug(arguments, "ontimeout");
          },
          onreadystatechange: function() {
            debug(arguments, "onreadystatechange");
          },
          onabort: function() {
            debug(arguments, "onabort");
          },
          onloadstart: function() {
            debug(arguments, "onloadstart");
          },
          onprogress: function() {
            debug(arguments, "onprogress");
          },
          onload: function(response) {
            debug(arguments, "onload");
            const doc = $(response.responseText);
            let tbodyHtml = "";
            tabConfig.extractor(doc, (record, index, item) => {
              tbodyHtml += `
              <tr>
                <td style="border: 1px solid #ccc; text-align:left; width:70%;">
                  <a style="color:#333"  target="_blank"
                    title="打开磁链明细页面"
                    href="${record.detailUrl}">
                    ${record.name}
                  </a>
                  <button class="btn btn-danger tianteng-copy"
                    type="button"
                    data-tianteng-magnet="${record.magnet}">复制磁链</button>
                  <button class="btn btn-danger tianteng-click"
                    type="button"
                    data-tianteng-magnet="${record.magnet}">打开磁链</button>
                </td>
                <td style="border: 1px solid #ccc;">${record.size}</td>
                <td style="border: 1px solid #ccc;">${record.date}</td>
              </tr>
              `;
            });
            tableHtml = tableHtml.replace("{{tbody}}", tbodyHtml);
            $(tabContent).append(tableHtml);
            $(tabContent).data("tiantengStatus", "ok");
          }
        });
      }
    }
    // end buildHtml
    /**
     *  复制磁链 和 打开磁链 按钮点击事件
     */
    handleButtonClick() {
      $(document).on("click", "button.tianteng-click, button.tianteng-copy", (e) => {
        if (this.currentTabConfig.type === 1 && this.currentTabConfig.id === "tianteng-tab-skrbt") {
          const button = e.target;
          const magnet = button.dataset["tiantengMagnet"];
          if (magnet !== "undefined") {
            if ($(button).attr("class").includes("tianteng-copy")) {
              _GM_setClipboard(magnet, "text");
            } else {
              _GM_openInTab(magnet);
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            return false;
          } else {
            const buttons = $(".tianteng-magnet-tbody .ld-ext-right");
            const ldld = new ldloader({ root: buttons.toArray() });
            buttons.attr("disabled", true);
            ldld.toggle();
            _GM_xmlhttpRequest({
              method: "get",
              headers: makeRequestHeaders({ Referer: `${domainConfig.skrbt.url}/search` }),
              url: button.dataset["tiantengMagnetUrl"],
              onerror: function(e2) {
                console.log("获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.");
                buttons.attr("disabled", false);
                ldld.off();
              },
              onload: function(response) {
                buttons.attr("disabled", false);
                ldld.off();
                const magnet2 = $(response.responseText).find("#magnet").attr("href");
                if (magnet2) {
                  button.dataset["tiantengMagnet"] = magnet2;
                  if ($(button).attr("class").includes("tianteng-copy")) {
                    button.nextElementSibling.dataset["tiantengMagnet"] = magnet2;
                    _GM_setClipboard(magnet2, "text");
                  } else {
                    button.previousElementSibling.dataset["tiantengMagnet"] = magnet2;
                    _GM_openInTab(magnet2);
                  }
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  e.stopPropagation();
                } else {
                  console.log("获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.");
                  console.log(response);
                }
              }
            });
          }
        } else {
          const button = e.target;
          const magnet = button.dataset["tiantengMagnet"];
          if ($(button).attr("class").includes("tianteng-copy")) {
            _GM_setClipboard(magnet, "text");
          } else {
            _GM_openInTab(magnet);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          return false;
        }
      });
    }
  }
  class JavlibHandler extends Handler {
    get name() {
      return "javlib";
    }
    get condition() {
      return $('head>title:contains("JAVLibrary")');
    }
    handle(condition, keyOrIndex) {
      debug("所有页面", "Javlib");
      debug("删除广告", "Javlib");
      $(".socialmedia,#bottombanner13,#topbanner11,#sidebanner11").remove();
      $("#leftmenu>div>ul:nth-child(2)>li:nth-child(2)").remove();
      debug("调节UI", "Javlib");
      $("#content").css("padding-top", "10px");
      $("#toplogo").css("height", "50px");
      $("#toplogo").find('img[src*="logo-top"]').attr("height", "40");
      debug("添加 粘贴&搜索 按钮", "Javlib");
      let styleMap = {};
      if ($("#idsearchbutton")[0]) {
        styleMap = getComputedStyleMap($("#idsearchbutton")[0]);
      }
      const $pasteAndSearchButton = $(
        `<input type="button" value="粘贴&搜索" id="pasteAndSearch"></input>`
      );
      $pasteAndSearchButton.css(styleMap);
      $pasteAndSearchButton.on("click", () => {
        navigator.clipboard.readText().then((clipText) => {
          if (clipText != null && $.trim(clipText) != "") {
            $("#idsearchbox").val(clipText);
            $("#idsearchbutton").trigger("click");
          }
        });
      });
      $("#idsearchbutton").parent().append($pasteAndSearchButton);
      debug("添加 打开skrbt 连接", "Javlib");
      $(".advsearch").append(
        `&nbsp;&nbsp;
        <a href="${domainConfig.skrbt.url}"
          target="_blank"
          class="tianteng-search-anchor"
          title="打开后自动搜索剪贴板中的内容">打开skrbt</a>`
      );
      debug("删除url重定向", "Javlib");
      $.each($("a[href^='redirect.php?url']"), function(index, a) {
        var url = getUrlParam(a.href, "url");
        a.href = url;
        if (!a.href.startsWith("https")) {
          a.href = a.href.replace("http", "https");
        }
        a.text = a.text + "    " + a.href + "      ";
        if (a.href.includes("yimuhe")) {
          $(a).parentsUntil("tr").closest(".t").css("background-color", "#6B6C83");
          a.style = "font-size:20px;";
        } else {
          a.style = "font-size:20px;";
        }
      });
      if (/\/.*jav.*\.html/.test(location.href)) {
        debug("详情页面", "Javlib");
        debug("添加 复制车牌 按钮", "Javlib");
        let chePai = document.querySelector("#video_id > table > tbody > tr > td.text").innerText;
        chePai = chePai.toUpperCase();
        if (chePai.startsWith("T-38")) {
          chePai = chePai.replace("T-38", "T38-");
        }
        let toAppendElement = document.querySelector("#video_id > table > tbody > tr > td.text");
        appendCopyButton(chePai, toAppendElement);
        debug("添加 javbus中查询 链接", "Javlib");
        let trTag = document.querySelector("#video_id > table > tbody > tr");
        let javdbQueryId = "javdbQueryId";
        trTag.innerHTML = [
          trTag.innerHTML,
          '<td><a id="',
          javdbQueryId,
          '"href="',
          domainConfig.javbus.url,
          "/",
          chePai,
          '">javbus中查询</a></td>'
        ].join("");
        debug("添加 用SkrBt搜索 链接", "Javlib");
        $(trTag).append(`
          <td>
            <a
                class="tianteng-search-anchor"
                href="${domainConfig.skrbt.url}/search?keyword=${chePai}"
                data-tianteng-keyword="${chePai}">
                用SkrBt搜索
            </a>
          </td>
        `);
        $(".tianteng-search-anchor").on("click mouseup", function() {
          const keyword = $(this).data("tiantengKeyword");
          if (keyword) {
            _GM_setValue("tiantengKeyword", keyword);
          }
        });
        debug("删除名称中的链接", "Javlib");
        const videoTitleNode = $("#video_title > h3 > a");
        const videoTitle = videoTitleNode.text();
        videoTitleNode.parent().html(videoTitle);
        debug("添加磁链tab", "Javlib");
        new MagnetTab(chePai, (fragment) => {
          $("#video_favorite_edit").after(fragment);
        });
      }
    }
  }
  class JavbusHandler extends Handler {
    get name() {
      return "javbus";
    }
    get condition() {
      return {
        a1: $('head>title:contains("JavBus")'),
        // /genre/hd , /genre/sub
        a2: $("body > nav > div > div.navbar-header.mh50 > a > img[alt='JavBus']"),
        // 论坛
        luntan: "#toptb.jav-nav"
      };
    }
    handle(condition, keyOrIndex) {
      debug(`keyOrIndex:${keyOrIndex}`);
      debug("添加 粘贴&搜索 按钮", "javbus");
      const searchButton = $(`button[onclick="searchs('search-input')"]:first`);
      const searchInput = $("#search-input:first");
      addPasteAndSearchButton(searchButton, searchInput);
      $(".nav>li>a").attr("style", "padding-left:8px;padding-right:8px;");
      debug("添加 打开skrbt 链接", "javbus");
      $(".nav-title.nav-inactive:last,ul.nav.navbar-nav:first").append(`
                  <li class="hidden-md hidden-sm">
                      <a href="${domainConfig.skrbt.url}" target="_blank">打开skrbt</a>
                  </li>
              `);
      debug("添加 打开今日新帖 按钮", "javbus");
      let todayNewButton = $(
        `<button id="tiantengNewButton"
               class="jav-button btn btn-default ld-ext-right"
               title="打开老司机福利讨论区的今日新帖,最多30个"
               style="margin-top:7px;">

            <span>打开今日新帖</span>
            <div class="ld ldld bare"
                style="width:1em;height:1em">
            </div>
       </button>`
      );
      _GM_addStyle(_GM_getResourceText("ldloader/index.min.css"));
      _GM_addStyle(_GM_getResourceText("ldbutton/index.min.css"));
      $(".nav-title.nav-inactive:last,ul.nav.navbar-nav:first").append(todayNewButton);
      let loading = new ldloader({ root: "#tiantengNewButton" });
      todayNewButton.on("click", function() {
        if (loading.running) {
          debug("正在加载数据,忽略点击...", "javbus");
          return;
        }
        loading.toggle();
        todayNewButton.attr("disabled", "true");
        const origin = location.origin;
        const talkUrl = `${origin}/forum/forum.php?mod=forumdisplay&fid=2&filter=author&orderby=dateline&dateline=86400`;
        const now = /* @__PURE__ */ new Date();
        const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
        async function getPostData(url, date, pageNum) {
          const r = await _GM.xmlHttpRequest({
            url,
            headers: {
              Accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7`,
              "Accept-Encoding": "gzip, deflate, br",
              "Accept-Language": "zh-CN,zh;q=0.9",
              "Cache-Control": "max-age=0"
            }
          }).catch((e) => {
            loading.off();
            todayNewButton.attr("disabled", false);
            console.error(e);
            debug(e, "javbus");
            alert("获取数据出现错误!!");
          });
          const data = $(r.responseXML);
          const result = [];
          $(".post_inforight", data).each(function() {
            const date2 = $("span.dateline>span", $(this)).attr("title");
            if (date2 === today) {
              let postUrl = $("a.s", $(this)).attr("href");
              result.push(`${origin}/forum/${postUrl}`);
            }
          });
          return result;
        }
        getPostData(talkUrl).then(function(urlArray) {
          if (urlArray.length === 0) {
            debug("没有新的帖子", "javbus");
            alert("没有新的帖子.");
          }
          $(urlArray).each(function() {
            _GM_openInTab(this, true);
          });
          loading.off();
          todayNewButton.attr("disabled", false);
        });
      });
      let chePaiNode = document.querySelector(
        "body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(1) > span:nth-child(2)"
      );
      if (chePaiNode) {
        debug("添加复制车牌号按钮", "javbus");
        const chePai = chePaiNode.innerText.trim();
        const toAppendElement = document.querySelector(
          "body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(1)"
        );
        appendCopyButton(
          chePai,
          toAppendElement,
          (copyButton) => copyButton.className = "jav-button btn btn-default"
        );
        debug("删除磁力链接中的onclick事件", "javbus");
        setInterval(() => $("#magnet-table td").removeAttr("onclick"), 1e3);
        debug("添加 在javlibrary中打开", "javabus");
        const javLibLink = `<a href="${domainConfig.javlib.url}/cn/vl_searchbyid.php?keyword=${chePai}">在javlib中打开</a>`;
        $(toAppendElement).append(javLibLink);
        new MagnetTab(chePai, (fragment) => {
          $("div.row.movie").after(fragment);
        });
      }
      if (location.href.includes("mod=viewthread")) {
        let toAlienMagnet = function(magnet, alien) {
          alien = alien ? alien : "-";
          let part1 = magnet.slice(0, 21);
          let part2 = magnet.slice(21);
          return `${part1}${alien}${part2}`;
        }, toNormalMagnet = function(magnet, alien) {
          alien = alien ? alien : "-";
          return magnet.replace(alien, "");
        }, getMagnetRegExp = function(alien) {
          if (alien) {
            return new RegExp(
              `(?:magnet:\\?xt=urn:btih:)?(?:(?:[0-9a-f]{1}${alien}[0-9a-f]{39})|(?:[2-7a-zA-Z]${alien}[2-7a-zA-Z]{31}))`,
              "gim"
            );
          } else {
            return /(?:magnet:\?xt=urn:btih:)?(?:[0-9a-fA-F]{40}|[2-7a-zA-Z]{32})/gim;
          }
        }, completeMagnet = function(magnet) {
          if (!magnet) {
            return magnet;
          }
          if (magnet.length === 32 || magnet.length === 40) {
            return `magnet:?xt=urn:btih:${magnet}`;
          }
          return magnet;
        };
        debug("调整样式", "论坛明细页面");
        _GM_addStyle(`
        #p_btn {
            padding:0;
        }
        .mtw {
            margin-top: 0px !important;
        }
        .mbm {
            margin-bottom: 10px !important;
        }
        .pi {
            overflow: hidden;
            margin-bottom: 0;
            padding: 0;
            height: 16px;
            border-bottom: 1px dashed #CDCDCD;
        }
        .pct {
            padding-bottom: 0;
        }
        .t_fsz {
            min-height: auto;
        }
        .nthread_postinfo {
            margin: 0 -16px;
            border-top: 10px solid #f5f5f5;
            padding: 10px 40px;
        }
        .pcb .cm .psth {
            margin-bottom: 0px;
        }
        .pcb .psth {
            width: 100%;
            font-size: 17px !important;
            line-height: 28px;
            font-weight: normal;
            color: #454545;
            background: none;
            border-bottom: 1px solid #CECECE;
            padding: 0;
            margin: 10px 0 0;
        }
        .pstl {
            clear: left;
            padding: 0em 0;
        }
        hin .pob {
            padding-bottom: 0px !important;
        }
            .plc{padding-top:14px}
      `);
        debug("为磁链添加按钮", "论坛明细页面");
        $(document).on("click", 'button[class*="tianteng-button"]', function(e) {
          let button = $(e.target);
          let buttonType = button.data("tiantengButton");
          if (buttonType === "copy") {
            let magnet = button.data("tiantengMagnet");
            _GM.setClipboard(toNormalMagnet(magnet), "text");
            return;
          }
          if (buttonType === "click") {
            let magnet = button.data("tiantengMagnet");
            setTimeout(() => window.open(toNormalMagnet(magnet)), 500);
            return;
          }
          if (buttonType === "copyAll") {
            let postId = button.data("tiantengPostId");
            let magnets = "";
            $(`[data-tianteng-button="copy"]`, $(`#${postId}`)).each(function() {
              let magnet = $(this).data("tiantengMagnet");
              magnets = magnets + toNormalMagnet(magnet) + "\n";
            });
            _GM.setClipboard(magnets, "text");
            return;
          }
          if (buttonType === "clickAll") {
            let postId = button.data("tiantengPostId");
            $(`[data-tianteng-button="copy"]`, $(`#${postId}`)).each(function() {
              let magnet = $(this).data("tiantengMagnet");
              magnet = toNormalMagnet(magnet);
              setTimeout(() => window.open(toNormalMagnet(magnet)), 500);
            });
            return;
          }
          if (buttonType === "copyAllNot") {
            let postId = button.data("tiantengPostMessageId");
            let magnets = "";
            $(`[data-tianteng-button="copy"]`, $(`#${postId}`)).each(function() {
              let magnet = $(this).data("tiantengMagnet");
              magnets = magnets + toNormalMagnet(magnet) + "\n";
            });
            _GM.setClipboard(magnets, "text");
            return;
          }
          if (buttonType === "clickAllNot") {
            let postId = button.data("tiantengPostMessageId");
            $(`[data-tianteng-button="copy"]`, $(`#${postId}`)).each(function() {
              let magnet = $(this).data("tiantengMagnet");
              magnet = toNormalMagnet(magnet);
              setTimeout(() => window.open(toNormalMagnet(magnet)), 500);
            });
            return;
          }
        });
        let magnetRegExp = getMagnetRegExp();
        $(`div[id^="post_"] a[href^="magnet:?xt=urn:btih:"]`).each(function() {
          let magnetAlien = completeMagnet($(this).attr("href"));
          magnetAlien = toAlienMagnet(magnetAlien);
          let html = this.outerHTML.replace(
            magnetRegExp,
            (match, offset, str) => toAlienMagnet(completeMagnet(match), "@")
          );
          html = html.replace("href", `data-tianteng-status="ok" href`);
          html = `${html}
            <button style="margin:0;padding:3px;"
                    class="jav-button tianteng-button"
                    data-tianteng-button="copy"
                    data-tianteng-magnet="${magnetAlien}"
                    type="button">复制磁链
            </button>
            <button style="margin:0;padding:3px;"
                    class="jav-button tianteng-button"
                    data-tianteng-button="click"
                    data-tianteng-magnet="${magnetAlien}"
                    type="button">打开磁链
            </button>`;
          this.outerHTML = html;
        });
        $('div[id^="post_"]').each(function() {
          const treeWalker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
          while (treeWalker.nextNode()) {
            const node = treeWalker.currentNode;
            if (node.nodeValue && magnetRegExp.test(node.nodeValue)) {
              node.nodeValue = node.nodeValue.replace(
                magnetRegExp,
                (match, offset, str) => toAlienMagnet(completeMagnet(match), "tianteng")
              );
            }
          }
        });
        $('div[id^="post_"]').each(function() {
          let magnetAlienRegExp = getMagnetRegExp("tianteng");
          let html = this.innerHTML;
          html = html.replace(magnetAlienRegExp, function(match) {
            match = toNormalMagnet(match, "tianteng");
            let magnetAlien = toAlienMagnet(match);
            return `
          <a href="${match}" data-tianteng-status="ok">${match}</a>
          <button style="margin:0;padding:3px;"
                  class="jav-button tianteng-button"
                  data-tianteng-button="copy"
                  data-tianteng-magnet="${magnetAlien}"
                  type="button">复制磁链
          </button>
          <button style="margin:0;padding:3px;"
                  class="jav-button tianteng-button"
                  data-tianteng-button="click"
                  data-tianteng-magnet="${magnetAlien}"
                  type="button">打开磁链
          </button>`;
          });
          magnetAlienRegExp = getMagnetRegExp("@");
          html = html.replace(magnetAlienRegExp, function(match) {
            return toNormalMagnet(match, "@");
          });
          this.innerHTML = html;
          const postId = $(this).attr("id");
          const id = postId.replace("post_", "");
          const postMessageId = `postmessage_${id}`;
          if ($(`[data-tianteng-button="copy"]`, $(`#${postId}`)).length > 0) {
            let allButtonHtml = `
              <button style="margin:0;padding:5px;"
                      class="jav-button tianteng-button"
                      data-tianteng-button="copyAll"
                      data-tianteng-post-id="${postId}"
                      data-tianteng-post-message-id="${postMessageId}"
                      type="button">复制所有磁链
              </button>
              <button style="margin:0;padding:5px;"
                      class="jav-button tianteng-button"
                      data-tianteng-button="clickAll"
                      data-tianteng-post-id="${postId}"
                      data-tianteng-post-message-id="${postMessageId}"
                      type="button">打开所有磁链
              </button>
              <button style="margin:0;padding:5px;margin-left:10px;"
                      class="jav-button tianteng-button"
                      data-tianteng-button="copyAllNot"
                      data-tianteng-post-id="${postId}"
                      data-tianteng-post-message-id="${postMessageId}"
                      type="button">复制所有磁链(不含点评)
              </button>
              <button style="margin:0;padding:5px;"
                      class="jav-button tianteng-button"
                      data-tianteng-button="clickAllNot"
                      data-tianteng-post-id="${postId}"
                      data-tianteng-post-message-id="${postMessageId}"
                      type="button">打开所有磁链(不含点评)
              </button>`;
            $(`#${postMessageId}`).prepend(allButtonHtml + "<br><br>");
            $(`#${postMessageId}`).append("<br><br>" + allButtonHtml);
          }
        });
      }
    }
  }
  class BtsowHandler extends Handler {
    get name() {
      return "BTSOW";
    }
    get condition() {
      return $('head>title:contains("BTSOW")');
    }
    handle(condition, keyOrIndex) {
      function allPages() {
        const form = $("form.fullsearch-form");
        form.each(function() {
          const me = $(this);
          if ($(".tianteng-paste-search", me).length === 0) {
            const searchButton = $(`:submit`, me);
            const pasteAndSearchButton = $(`
              <button type="button" class="btn btn-default tianteng-paste-search">
                粘贴&搜索
              </button>`);
            searchButton.after(pasteAndSearchButton);
          }
        });
      }
      function searchPage() {
        if (location.pathname.startsWith("/search")) {
          debug("添加 复制磁链,打开磁链 按钮", "btsow-搜索结果列表");
          let buttonsHtml = `
          <button class="btn btn-danger copy" type="button">复制磁链</button>
          <button class="btn btn-danger click" type="button">打开磁链</button>`;
          $("div.data-list>div.row>a>div.file").each((index, el) => {
            if ($(el).find("button.copy").length === 0) {
              $(el).append(buttonsHtml);
            }
          });
        }
      }
      debug("添加 粘贴&搜索 按钮", "btsow-所有页面");
      allPages();
      $(document).on("click", "button.tianteng-paste-search", function(e) {
        const me = $(this);
        navigator.clipboard.readText().then((text) => {
          if (text != null && $.trim(text) != "") {
            me.parent().prev().val($.trim(text));
            me.parentsUntil(".container")[2].submit();
          }
        });
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return false;
      });
      searchPage();
      if (location.pathname.startsWith("/search")) {
        debug("添加 复制磁链,打开磁链 按钮", "btsow-搜索结果列表");
        $(document).on("click", "button.copy, button.click", function(e) {
          let magnet = $(this).parent().parent().attr("href").split("/")[6];
          magnet = `magnet:?xt=urn:btih:${magnet}`;
          if ($(this).attr("class").includes("copy")) {
            _GM_setClipboard(magnet, "text");
          } else if ($(this).attr("class").includes("click")) {
            _GM_openInTab(magnet);
          }
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
        });
      }
      const nodeToObserve = document.querySelector("body");
      new MutationObserver((mutationRecords, observer) => {
        allPages();
        searchPage();
      }).observe(nodeToObserve, { childList: true });
    }
  }
  class SkrbtHandler extends Handler {
    get name() {
      return "skrbt";
    }
    get condition() {
      return $(`head>link[rel='shortcut icon'][href*='skrbt']`);
    }
    handle(condition, keyOrIndex) {
      debug("添加 粘贴&搜索 按钮", "skrbt");
      const $searchButton = $("button.search-btn");
      const $searchInput = $(`input.search-input[name='keyword']`);
      const $pasteAndSearchButton = addPasteAndSearchButton($searchButton, $searchInput);
      $pasteAndSearchButton.removeAttr("style");
      $pasteAndSearchButton.css("margin-left", "3px");
      $pasteAndSearchButton.attr("class", $searchButton.attr("class"));
      if (location.pathname === "/") {
        const keyword = _GM_getValue("tiantengKeyword", null);
        if (keyword) {
          debug("搜索存储的内容", "skrbt-首页");
          _GM_deleteValue("tiantengKeyword");
          $searchInput.val(keyword);
          $searchButton.click();
        } else {
          debug("搜索剪贴板中的内容", "skrbt-首页");
          $pasteAndSearchButton.click();
        }
      }
      debug("删除广告", "skrbt");
      function removeAd() {
        const $container = $(".col-md-6:eq(2)");
        $container.remove(".label.label-primary");
        $container.find('a.rrt.common-link[href^="http"]').parent().parent().remove();
      }
      removeAd();
      if (location.href.includes("search")) {
        debug("添加 复制磁链和打开磁链 按钮", "skrbt-搜索结果列表页面");
        let buttonsHtml = `
        <span class="rrmiv"><button class="btn btn-danger tianteng-button-copy" type="button">复制磁链</button></span>
        <span class="rrmiv"><button class="btn btn-danger tianteng-button-click" type="button">打开磁链</button></span>`;
        addButtonsForSkrbt(buttonsHtml, $(".col-md-6:eq(2)"), (el) => {
          const classValue = $(el).attr("class");
          if (classValue && classValue.includes("tianteng-button-copy")) {
            return "copy";
          }
          if (classValue && classValue.includes("tianteng-button-click")) {
            return "click";
          }
          return "other";
        });
        const nodeToObserve = document.querySelectorAll(".col-md-6")[2];
        new MutationObserver((mutationRecords, observer) => {
          $("a.rrt.common-link").each((index, el) => {
            if ($(el).parent().find(".btn.btn-danger.tianteng-button-copy").length === 0) {
              $(el).after(buttonsHtml);
            }
          });
          removeAd();
        }).observe(nodeToObserve, { childList: true });
      }
    }
  }
  function addButtonsForSkrbt(buttonsHtml, delegateElement, buttonTypeCallback) {
    delegateElement.find("a.rrt.common-link").after(buttonsHtml);
    delegateElement.on("click", '[class*="tianteng-button"]', (event) => {
      const buttonType = buttonTypeCallback(event.target);
      if ("copy" !== buttonType && "click" !== buttonType) {
        return;
      }
      let liNode = $(event.target).parent().parent();
      const exeButtonClick = (e) => {
        if ("copy" === buttonType) {
          navigator.clipboard.writeText(liNode.find(".magnet").attr("href"));
        } else {
          _GM_openInTab(liNode.find(".magnet").attr("href"));
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return false;
      };
      if (liNode.find(".magnet").length != 0) {
        return exeButtonClick(event);
      }
      let detailUrl = liNode.find("a.rrt.common-link").attr("href");
      detailUrl = `${location.origin}${detailUrl}`;
      $.get(detailUrl, function(data, textStatus, jqXHR) {
        liNode.find("#errorTip").remove();
        const magnet = $(data).find("#magnet").attr("href");
        if (magnet) {
          const aHtml = '<a class="magnet" href="' + magnet + '">' + magnet + "</a>";
          liNode.append(aHtml);
          return exeButtonClick(event);
        } else {
          liNode.append(
            '<span id="errorTip">1.获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.</span>'
          );
          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();
          return false;
        }
      }).fail(function(e) {
        liNode.append(
          '<span id="errorTip">2.获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.</span>'
        );
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        console.log(e);
        return false;
      });
    });
  }
  class JinManTianTangHandler extends Handler {
    get name() {
      return "禁漫天堂";
    }
    get condition() {
      return $(`head>title`)[0] && $(`head>title`)[0].text.endsWith("禁漫天堂");
    }
    handle(condition, keyOrIndex) {
      observe(document, { childList: true, subtree: true }, () => {
        debug(" 删除广告", "禁漫天堂");
        $(".top-nav, .div-bf-pv").remove();
        $("#Comic_Top_Nav").css("top", "-1px");
        $("div.e8c78e-4_b").remove();
        if (location.pathname === "/albums") {
          const childNodes = document.querySelector("#wrapper > div.container").childNodes;
          var forEach = Array.prototype.forEach;
          forEach.call(childNodes, function(node) {
            if (node.nodeName === "#text" && node.nodeValue.includes("中間廣告")) {
              node.nodeValue = "";
            }
          });
        }
      });
    }
  }
  debug(document.querySelector("title"));
  if (location.href.includes("ahri8.top")) {
    interceptEventListener((target, type, callback, options) => {
      if (target.className && target.className.includes && target.className.includes("apo")) {
        debug("禁止点击广告", "松鼠症倉庫");
        return true;
      }
    });
  }
  $(() => {
    const handlerList = [
      BaiduHandler,
      OsChinaHandler,
      GiteeHandler,
      ZhihuHandler,
      WnacgHandler,
      JavlibHandler,
      JavbusHandler,
      BtsowHandler,
      SkrbtHandler,
      JinManTianTangHandler
    ];
    const executor = new HandlerExecutor();
    for (const handler of handlerList) {
      const instance = new handler();
      const className = instance.constructor.name;
      executor.handler = instance;
      const result = executor.execute();
      const resultJson = JSON.stringify(result);
      debug(`执行 ${instance.name}(${className}), result: ${resultJson}`, "main");
    }
  });

})(jQuery, Tabby, ldloader);