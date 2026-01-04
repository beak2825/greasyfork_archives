// ==UserScript==
// @name               Bilibili 视频默认选择最高清晰度
// @name:zh-CN         哔哩哔哩视频默认选择最高清晰度
// @name:zh-SG         哔哩哔哩视频默认选择最高清晰度
// @name:zh-TW         嗶哩嗶哩影片自動選擇最高解析度
// @name:zh-HK         嗶哩嗶哩影片自動選擇最高解析度
// @name:zh-MO         嗶哩嗶哩影片自動選擇最高解析度
// @namespace          http://tampermonkey.net/
// @version            1.2019.8.21
// @description        try to take over the world!
// @description:zh-CN  之前哔哩哔哩切换视频，清晰度会默认调成自动。
// @description:zh-SG  之前哔哩哔哩切换视频，清晰度会默认调成自动。
// @description:zh-TW  從前嗶哩嗶哩切換影片，解析度會莫名其妙調成自動。為了不用每次都手動調回去，就寫了這個。
// @description:zh-HK  從前嗶哩嗶哩切換影片，解析度會莫名其妙調成自動。為了不用每次都手動調回去，就寫了這個。
// @description:zh-MO  從前嗶哩嗶哩切換影片，解析度會莫名其妙調成自動。為了不用每次都手動調回去，就寫了這個。
// @require            https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js
// @contributionURL    https://qr.alipay.com/lpx05806vmqruupocs1du1b
// @contributionAmount 0.618
// @icon               https://www.bilibili.com//favicon.ico
// @supportURL         zimongmu@gmail.com
// @author             Zimongmu
// @match              *://www.bilibili.com/video/*
// @match              *://www.bilibili.com/bangumi/play/*
// @match              *://www.douyu.com/*
// @match              *://www.huya.com/*
// @run-at             document-idle
// @grant              none
// @license            Anti 996 License Version 1.0
// @downloadURL https://update.greasyfork.org/scripts/374770/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/374770/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==
"use strict";

eval(Babel.transform(function () {

  const state = model => (typeof model == 'object' && model.handler(model)) ?
    { then: nap => nap(location.href) } :
    { then: nap => nap(typeof model == 'string' ? model : false) }

  const model = {
    present: model => (
      typeof model == 'object' &&
      Object.entries(model.elements)
        .every(([key, { get, has }]) => has(get(key)))
    ) ? model : (typeof model == 'string' ? model : false)
  }

  const action = () => location.href != model.href ? model.handler : model.href

  model.bilibili = {

    elements: {

      player: {
        get: () => document.getElementById('bilibiliPlayer'),
        has: element => element
      },

      face: {
        get: () => document.querySelector('.profile-info .face'),
        has: element => element ? element.complete : element
      },

      vip: {
        get: () => document.querySelector('.profile-info .vip'),
        has: () => true
      },

      selectList: {
        get: () => document.querySelectorAll('.bui-select-list-wrap li'),
        has: element => element ? element.length : element
      }

    },

    login: element => (element && element.hasAttribute('data-login')) ? (
      element.getAttribute('data-login') == 'true' ? '大会员' : '(大会员|登录)'
    ) : '.*',

    click: element => element.classList.contains('bui-select-item-active') ?
      element :
      setTimeout(() => element.click(), 1000),

    handler: model => [...model.elements.selectList.get()].find(
      element => new RegExp(
        model.elements.vip.get() ?
          '$.^' :
          model.login(model.elements.player.get())
      ).test(element.innerHTML) ? false : model.click(element)
    ) ? true : false

  }

  model.douyu = {

    elements: {

      selectList: {
        get: () => document.querySelector('#rateId~ul>li'),
        has: element => !/^\/(topic\/)?[^\/]+$/.test(location.pathname) ||
          element
      }

    },

    click: element =>
      'selected' == element.className.slice(0, 8) ? element : !element.click(),

    handler: model => /^\/(topic\/)?[^\/]+$/.test(location.pathname) ?
      setTimeout(() => model.click(model.elements.selectList.get()), 1000) :
      true

  }

  model.huya = {

    elements: {

      selectList: {
        get: () => document.querySelector('.player-videotype-list>li'),
        has: element => !/^\/[^\/]+$/.test(location.pathname) || element
      }

    },

    click: element => element.className == 'on' ? element : element.click(),

    handler: model => /^\/[^\/]+$/.test(location.pathname) ?
      setTimeout(() => model.click(model.elements.selectList.get()), 1000) :
      true

  }

  model.handler = Object.entries(model).find(
    ([key]) => location.hostname.split('.').slice(-2)[0] == key
  )[1]

  const listener = event => state(model.present(action())).then(
    nap => nap ? (model.href == nap || Object.defineProperty(model, 'href', {
      value: location.href,
      writable: true,
      configurable: true,
      enumerable: true
    })) : setTimeout(() => listener(event), 500)
  )

  state(model.present(action())).then(nap => nap) ||
    window.addEventListener('canplay', listener, true)

}.toString().split("\n").slice(1, -1).join("\n"), { presets: ["es2015", "es2016"] }).code);
