// ==UserScript==
// @name         播鸭功能扩展
// @namespace    web_chaser
// @version      0.5
// @description  播鸭播放器功能扩展集合
// @note         我的播鸭 - 新增根据头像ID搜索用户名称
// @note         播鸭签到 - 新增自动签到功能
// @author       web_chaser
// @match        https://boya.maiyuan.online/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @update       https://gitee.com/web_chaser/search-user-name/blob/master/boya.js
// @license      Mozilla Public License 1.1 (MPL)
// @downloadURL https://update.greasyfork.org/scripts/438865/%E6%92%AD%E9%B8%AD%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/438865/%E6%92%AD%E9%B8%AD%E5%8A%9F%E8%83%BD%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 令牌
  const Token = JSON.parse(localStorage._boya_user_token)[0];
  // 判断是否有token令牌
  if (!Token) return;

  // 形象商店数据容器
  let allCommoditiesArray = [];

  // 域名
  const URL = 'https://boya.maiyuan.online/graphql';
  // 形象商店数据接口请求参数
  const commoditieInterface = {
    "operationName": "allCommodities",
    "variables": {
      "input": {
        "type": 2,
        "order": {
          "price": 0
        }
      }
    },
    "query": "query allCommodities($input: allCommoditiesInput!) {\n  allCommodities(input: $input) {\n    totalCount\n    nodes {\n      code\n      image\n      id\n      introduction\n      originalPrice\n      price\n      sales\n      status\n      stock\n      title\n      releaseTime\n      createdAt\n      user {\n        id\n        avatar\n        name\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
  }

  // 首次加载触发初始化
  window.onload = init;

  // 初始化
  function init() {
    // 请求头像数据
    getAllCommodities(URL, commoditieInterface);
    // 新增搜索按钮
    createButton();
  };

  // 请求数据
  async function getAllCommodities(url, data) {
    try {
      const result = await request(url, data);
      if (result.data) {
        allCommoditiesArray = result.data.allCommodities.nodes;
      }
    } catch {
      console.log('插件出问题啦~');
    };
  };

  // 新增搜索按钮方法
  function createButton() {
    // 图标
    const sreachIcon = '<span role="img" class="anticon"><svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><use xlink:href="#icon-search"></use></svg></span>';
    // 创建按钮
    const buttonDom = document.createElement('button');
    buttonDom.innerHTML = sreachIcon;
    // 添加样式
    buttonDom.style.cssText = `
      background-color: rgb(94, 203, 87);
      color: rgb(255, 255, 255);
      width: 30px;
      height: 30px;
      border-radius: 6px;
      margin-left: 5px;
      font-size: 24px;
      line-height: 24px;
      box-shadow: rgba(94, 203, 87, 0.6) 0px 2px 6px 0px;
      position: relative;
    `;
    const inputDom = document.querySelector('.ant-input-affix-wrapper').children[0];
    inputDom.placeholder = '请输入歌曲、艺人、专辑 / 头像ID编号';
    // 添加按钮点击事件
    buttonDom.addEventListener('click', () => {
      searchUserCode(inputDom.value);
      document.querySelector('.ant-input-clear-icon').click(); // 触发清空事件
    });
    // 加入按钮组父级容器
    pollingHandle(buttonDom);
  };

  // 获取按钮组父级容器 切换路由可能导致组件未渲染而获取null
  function pollingHandle(buttonDom) {
    const className = 'middle-wrap___2XeZY';
    // 获取按钮组父级容器
    const parent = document.querySelector(`.${className}`);
    if (parent) {
      parent.appendChild(buttonDom);
    } else {
      console.log(`未找到父级容器，请查看父级容器类名是否为：${className}`)
    };
  };

  // 搜索用户名称
  function searchUserCode(id) {
    if (!id) return;
    const userInfo = allCommoditiesArray.find(item => item.code == id);
    if (!userInfo) {
      window.alert('该ID对应的头像还没有生产出来喔~');
      return;
    };
    const name = userInfo.user ? userInfo.user.name : '该头像还没有主人，快去抢购吧~';
    window.alert(name);
  };

  // ===========================================================================================
  // 签到接口请求参数
  const signinInterface = {
    "operationName": "signIn",
    "variables": {},
    "query": "mutation signIn {\n  signIn\n}\n"
  };

  isSignin(URL, signinInterface);
  // 自动签到
  async function isSignin(url, data) {
    // 首次加载立马调用一次，判断是否已签到
    const result = await request(url, data);
    console.log('签到信息', result);
    // 开启定时器，等到明天早上10点后执行签到（页面不关闭的情况，页面关闭需要重新打开播鸭页面）
    let date = new Date();
    date = date.setDate(date.getDate() + 1);
    date = new Date(date);

    const y = date.getFullYear(),
      m = date.getMonth() + 1, // 月
      d = date.getDate(), // 日
      diffTime = new Date(`${y}-${m}-${d} 10:00:00`).getTime() - Date.now();
    setTimeout(() => {
      isSignin(url, data);
    }, diffTime);
  }

  // ===========================================================================================
  // 封装请求接口
  async function request(url, data, type = 'POST') {
    const parse = {
      method: type,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Token}`
      }
    };
    if (type === 'POST') {
      parse.body = JSON.stringify(data);
    }
    return fetch(url, parse).then(res => res.json());
  }
})();