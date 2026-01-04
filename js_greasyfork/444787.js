// ==UserScript==
// @name         「水水」链接跳转
// @namespace    https://www.wdssmq.com/
// @version      1.0.0
// @author       沉冰浮水
// @description  自动跳过各种链接跳转页面，支持知乎，贴吧，QQ 和 QQ 邮箱等；
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.com/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://jump.bdimg.com/f*
// @match        https://jump2.bdimg.com/f*
// @match        http://jump.bdimg.com/safecheck/index?url=*
// @match        http://jump2.bdimg.com/safecheck/index?url=*
// @match        https://tieba.baidu.com/safecheck/index?url=*
// @match        https://c.pc.qq.com/middlem.html?pfurl=*
// @match        https://mail.qq.com/cgi-bin/readtemplate?t=*
// @match        https://www.jianshu.com/go-wild*
// @match        https://www.v2ex.com/t/*
// @match        https://link.zhihu.com/*
// @match        https://link.juejin.cn/?target=*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/444787/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8D%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444787/%E3%80%8C%E6%B0%B4%E6%B0%B4%E3%80%8D%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  const gm_name = "UrlGo";

  // 初始常量或函数
  const curUrl = window.location.href;
  const curHost = window.location.host;

  // -------------------------------------

  const _log = (...args) => console.log(`[${gm_name}]\n`, ...args);

  // -------------------------------------

  // const $ = window.$ || unsafeWindow.$;
  function $n(e) {
    return document.querySelector(e);
  }
  function $na(e) {
    return document.querySelectorAll(e);
  }

  // 指定元素内查找子元素
  function fnFindDom(el, selector) {
    return el.querySelectorAll(selector);
  }

  // 指定元素中的链接增加 target="_blank"
  const config = [
    [".markdown_body", ".reply_content"],
  ];

  function fnSetBlank($a) {
    $a.setAttribute("target", "_blank");
  }

  config.forEach((e) => {
    const selector = e.join(",");
    const $$container = $na(selector);
    // // print $$container
    // _log($$container);
    // 遍历 $$container
    [].forEach.call($$container, ($el) => {
      const $$a = fnFindDom($el, "a");
      // _log($$a);
      if ($$a.length > 0) {
        [].map.call($$a, fnSetBlank);
      }
    });
  });

  const _config = {
    data: {},
    dataDef: {
      倒计时: 5,
    },
    menuCommand: () => {
      const _this = _config;
      for (const key in _this.data) {
        if (Object.hasOwnProperty.call(_this.data, key)) {
          GM_registerMenuCommand(`${key}：${_this.data[key]}`, () => {
            const newValue = prompt(`请输入新的${key}值`, _this.data[key]);
            if (newValue !== null) {
              _this.data[key] = newValue;
              GM_setValue("config", _this.data);
              _log(`已将${key}值修改为：${newValue}`);
            }
          });
        }
      }
    },
    load: () => {
      const _this = _config;
      _config.data = GM_getValue("config", _this.dataDef);
      _config.menuCommand();
    },
  };

  _config.load();

  // 从页面中获取链接
  function fnGetUrlInDOM(selector, attrName) {
    const $dom = $n(selector);
    if ($dom) {
      return $dom[attrName];
    }
    return null;
  }

  // 获取链接中的参数
  function fnGetParamInUrl(name, url) {
    const match = new RegExp(`[?&]${name}=(?<value>[^&]*)`).exec(url);
    return match && decodeURIComponent(match.groups.value);
  }

  // 监测网址是否带有协议
  function fnCheckUrl(url) {
    if (url.indexOf("http") === 0) {
      return url;
    }
    return `http://${url}`;
  }

  const siteList = [
    {
      name: "百度贴吧",
      hostList: ["jump2.bdimg.com", "tieba.baidu.com"],
      url: fnGetUrlInDOM("p.link", "textContent"),
      tipNode: [$n("p.content"), "after"],
    },
    {
      name: "QQ 客户端",
      hostList: ["c.pc.qq.com"],
      url: fnGetUrlInDOM("#url", "textContent"),
      tipNode: [$n("p.ui-title"), "after"],
    },
    {
      name: "QQ 邮箱",
      hostList: ["mail.qq.com"],
      url: fnGetUrlInDOM(".safety-url", "textContent"),
      tipNode: [$n(".safety-url"), "after"],
    },
    {
      name: "简书",
      hostList: ["www.jianshu.com"],
      url: fnGetParamInUrl("url", curUrl),
    },
    {
      name: "知乎",
      hostList: ["link.zhihu.com"],
      url: fnGetUrlInDOM("p.link", "textContent"),
    },
    {
      name: "掘金",
      hostList: ["link.juejin.cn"],
      url: fnGetParamInUrl("target", curUrl),
      tipNode: [$n("p.title"), "after"],
    },
  ];

  // 显示提示
  function fnShowTip(tipNode, text, url) {
    console.log(text);
    const $node = tipNode[0];
    const $insertTips = `<p class="go-tips" style="color: red;text-align: center;">
  <span>${text}</span>
  <a href="${url}" title="点击跳转">点击跳转</a>
  </p>`;
    const $tips = $n(".go-tips");
    // 判断是否已经有提示
    if ($tips) {
      $tips.querySelector("span").textContent = text;
      return;
    }
    switch (tipNode[1]) {
      case "after":
      default:
        $node.insertAdjacentHTML("afterend", $insertTips);
        break;
    }
  }

  // 各种中转页跳过
  siteList.forEach((site) => {
    const { name, hostList, url } = site;
    _log(`检测站点：${name}`);
    if (hostList.includes(curHost)) {
      if (!url) {
        return;
      }
      const newUrl = fnCheckUrl(url);
      if (site.tipNode) {
        let cntDown = _config.data["倒计时"];
        setInterval(() => {
          if (cntDown <= 0) {
            window.location.href = newUrl;
            return;
          }
          fnShowTip(site.tipNode, `即将跳转到，剩余 ${cntDown} 秒`, newUrl);
          cntDown--;
        }, 1000);
      }
      else {
        setTimeout(() => {
          window.location.href = newUrl;
        }, 10000);
      }
    }
  });

  // 百度贴吧的各种链接统一
  const arrHostList = [
    "jump.bdimg.com",
    "jump2.bdimg.com",
  ];

  if (arrHostList.includes(curHost)) {
    const newUrl = window.location.href.replace(curHost, "tieba.baidu.com");
    window.location.href = newUrl;
  }

})();
