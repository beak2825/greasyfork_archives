// ==UserScript==
// @name         微蚁儿优惠
// @namespace    http://tampermonkey.net/
// @version      20210508.01
// @description  使用公众号【微蚁儿】返利赚佣金,你可以使用自己的Token也可以使用开发者的token帮助开发者获取佣金喝咖啡☕️
// @author       shellvon<iamshellvon@gmail.com>
// @match        https://item.jd.hk/*
// @match        https://item.jd.com/*
// @match        https://npcitem.jd.hk/*
// @match        https://detail.tmall.hk/*
// @match        https://detail.tmall.com/*
// @match        https://chaoshi.detail.tmall.com/*
// @match        https://item.taobao.com/*
// @match        https://detail.vip.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      api.3nian.cn
// @icon         http://api.3nian.cn/logo.png
// @downloadURL https://update.greasyfork.org/scripts/424155/%E5%BE%AE%E8%9A%81%E5%84%BF%E4%BC%98%E6%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/424155/%E5%BE%AE%E8%9A%81%E5%84%BF%E4%BC%98%E6%83%A0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * 默认的获取返利结果后回调函数.
   *
   * @param {EasyPromotion} easyPromotion
   * @param {Object} resp API接口返回的对象
   *
   * @returns
   */
  var defaultPromotionCallback = function (easyPromotion, resp) {
    var response = resp.response;
    var goods =
      response && response.data && response.data.list && response.data.list[0];
    var tip = "【微蚁儿】当前商品不支持返利";
    if (response.code != 200) {
      tip = `<span style="color:red;">【错误信息:${response.message}】</span>`;
    } else if (goods) {
      tip = `<a href='${
        goods.promotion_url
      }' style='color: #ed6a0c;'>【微蚁儿】预估返利${
        goods.commission.money
      }元，${
        goods.coupon.balance > 0 ? `${goods.coupon.name}，` : ""
      }点击这里刷新页面再购买即可获得返利</a >`;
    }
    var container = document.querySelector("#simple-promotion-container");
    if (container) {
      return (container.firstChild.innerHTML = tip);
    }
    var containerHtmlTpl = `<div id='simple-promotion-container' style='background: #fffbe8;font-size: 14px;line-height: 50px;padding: 0 16px;margin: 10px 0;'>$$tpl<br/><span class='reset-btn' style='background-color: #000; color:white; padding:5px 10px; border-radius:1px; font-size:14px; cursor:pointer'>重置凭证</span></div>`;
    tip = containerHtmlTpl.replace("$$tpl", tip);
    easyPromotion.getContainer().insertAdjacentHTML("afterbegin", tip);
    document
      .querySelector("#simple-promotion-container > .reset-btn")
      .addEventListener("click", function () {
        if (confirm("你真的要重置Token么?")) {
          easyPromotion.askAndSaveToken();
          easyPromotion.fetchPromotion();
        }
      });
  };

  /**
   * 当前页面被监测到已经推广,则执行该回调。 如果当前回调返回true则继续后续流程,否则提前终止后续流程.
   *
   * @param {EasyPromotion} easyPromotion
   *
   * @returns boolean 是否需要继续进行后续
   */
  var defaultOnPromotedCallback = function (easyPromotion) {
    if (!easyPromotion.options || !easyPromotion.options.showPromoted) {
      return true;
    }
    easyPromotion
      .getContainer()
      .insertAdjacentHTML(
        "afterbegin",
        `<div style='background: #ecf9ff; color: #1989fa;font-size: 14px;line-height: 50px;padding: 0 16px;margin: 10px 0;'>当前商品直接购买即可获得返利</div>`
      );
    return false;
  };

  /**
   * 简易版分佣
   *
   * @param {string} uri 分佣站点
   * @param {Object} options 配置
   */
  function EasyPromotion(uri, options) {
    this.uri = uri || window.location.href;
    // 微蚁儿API接口地址
    this.api = "https://api.3nian.cn/openapi/promotion/transfer";
    var noop = function () {};
    var rules = [
      {
        name: "jd", // 平台名
        pattern: /item\.jd\.(com|hk)/, // 平台匹配模式
        container: ".itemInfo-wrap", // 平台放分佣信息的容器选择器,用于document.querySelector
        promoted: /(\?|&)utm_campaign=t_2010927340_(&|$)/, // 判断是否被【微蚁儿优惠】返利的正则
      },
      {
        name: "tb",
        pattern: /item\.taobao\.(com|hk)/,
        container: ".tb-title",
        promoted: /(\?|&)ak=28188063(&|$)/,
      },
      {
        name: "vip",
        pattern: /detail\.vip\.com/,
        container: ".pi-price-box",
        promoted: /!$/,
      },
      {
        name: "tmall",
        pattern: /detail\.tmall\.(com|hk)/,
        container: ".tb-detail-hd",
        promoted: /(\?|&)ak=28188063(&|$)/,
      },
    ];
    this.current = rules.filter((el) => el.pattern.test(this.uri))[0];
    this.options = Object.assign(
      {},
      {
        defaultToken: "D5QXrUTbtJqUZUFxqC", // 【微蚁儿】公众号内回复[TOKEN]返回的TOKEN,用于接口调用,这样返的佣金计入当前用户账下
        tokenKey: "shellvon:token",
        showPromoted: true,
        onFinish: noop,
        onPromoted: noop,
      },
      options
    );
    this.token = GM_getValue(this.options.tokenKey);
  }

  /**
   * 检测当前uri是否支持
   * @returns boolean
   */
  EasyPromotion.prototype.isSupported = function () {
    return !!this.current;
  };

  /**
   * 检测当前uri是否已经推广过了
   *
   * @returns
   */
  EasyPromotion.prototype.isPromoted = function () {
    return this.current && this.current.promoted.test(this.uri);
  };

  /**
   * 获取容器
   * @returns
   */
  EasyPromotion.prototype.getContainer = function () {
    var selector = this.current && this.current.container;
    return document.querySelector(selector || "body");
  };

  /**
   * 询问并保存token信息
   */
  EasyPromotion.prototype.askAndSaveToken = function () {
    this.token = prompt(
      "关注【微蚁儿】公众号回复“TOKEN”获取凭证，凭证决定佣金计入谁的账户中:",
      this.token || this.options.defaultToken
    );
    if (this.token) {
      GM_setValue(this.options.tokenKey, this.token);
    } else {
      this.askAndSaveToken();
    }
  };

  /**
   * 调用后台获取返利信息
   */
  EasyPromotion.prototype.fetchPromotion = function () {
    var self = this;
    GM_xmlhttpRequest({
      method: "POST",
      url: self.api,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      data: JSON.stringify({
        url: self.uri,
        token: self.token,
      }),
      onload: function (resp) {
        self.options.onFinish(self, resp);
      },
    });
  };

  /**
   * 执行真正的分佣流程
   *
   * @returns
   */
  EasyPromotion.prototype.doPromotion = function () {
    if (!this.isSupported()) {
      console.error(`[ERROR]: 当前站点:${uri}暂不支持,请联系开发者进行更新`);
      return false;
    }
    if (this.isPromoted() && !this.options.onPromoted(this)) {
      console.warn(
        `[WARN]: 当前站点:${uri}已推广且已终止后续流程,终止获取返利信息`
      );

      return true;
    }

    if (!this.token) this.askAndSaveToken();

    this.fetchPromotion();
  };

  var uri = window.location.href;

  var easyPromotion = new EasyPromotion(uri, {
    defaultToken: "D5QXrUTbtJqUZUFxqC", // 【微蚁儿】公众号内回复[TOKEN]返回的TOKEN,用于接口调用,这样返的佣金计入当当前用户账下
    onFinish: defaultPromotionCallback, // 通过API获取到分佣信息之后的回调
    onPromoted: defaultOnPromotedCallback, // 监测到当前URL已经被分佣之后的回调
  });

  easyPromotion.doPromotion();
})();
