// ==UserScript==
// @name        易搭会员专用渠道链接
// @version     0.0.4
// @author      xiongxiao01@corp.netease.com
// @description 预览弹窗增加渠道链接显示（会员专用）
// @match       *://music-cms.hz.netease.com/unify*
// @match       *://music-cms.hz.netease.com/yida*
// @match       *://music-cms.hz.netease.com/magic-cube/*
// @match       *://*.igame.163.com/unify*
// @match       *://*.igame.163.com/magic-cube/*
// @namespace   https://g.hz.netease.com/xiongxiao01
// @license     ISC
// @icon        https://p6.music.126.net/obj/wonDlsKUwrLClGjCm8Kx/29180333000/51b7/f353/4ced/2cba05d99c79e7feb3dd8ae69da16fb5.png
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/474631/%E6%98%93%E6%90%AD%E4%BC%9A%E5%91%98%E4%B8%93%E7%94%A8%E6%B8%A0%E9%81%93%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/474631/%E6%98%93%E6%90%AD%E4%BC%9A%E5%91%98%E4%B8%93%E7%94%A8%E6%B8%A0%E9%81%93%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
  const channelMap = {
        'smzdm': '什么值得买',
        'weibo': '微博',
        'weibo-ad': '微博广告',
        'wxpublic': '微信公众号',
        '163mail': '网易邮箱',
        'godlike': '网易大神',
        '163game': '网易游戏',
        'uu': 'UU加速器',
        'caocao': '曹操出行',
        'douyin': '抖音',
        'kuaishou': '快手',
        'xhs': '小红书',
        'iqiyi': '爱奇艺',
        'xiaomi': '小米',
        'bilibili': 'B站',

        'toutiao': '头条',
        'gdt': '广点通',
        'baidu': '百度',
        'alipay': '支付宝',
        'youdao-dsp': '有道智选',
        'e-uc': '汇川',

        'home-2floor': '首页二楼',
        'home-popup': '首页弹窗',
        'new-home-banner': '新首页banner',

        'corpmail': '员工邮件',
        'popo-music': '多多推荐',

        'sms': '短信',
        'sms-1': '短信1',
        'sms-2': '短信2',
        'sms-3': '短信3',
  };

  const concat = (base, query) => base + (/\?/.test(base) ? '&' : '?') + query;

  const render = (url) => {
    const fragment = document.createDocumentFragment();
    const h3 = document.createElement('h3');
    h3.textContent = '渠道链接 (会员专用)：';
    h3.style.fontWeight = '500';
    h3.style.color = 'rgba(0, 0 ,0 , 0.65)';
    fragment.appendChild(h3);

    let index = 0;
    for (const key in channelMap) {
      const a = document.createElement('a');
      a.target = '_blank';
      a.href = concat(url, `extChannel=${key}`);
      a.textContent = channelMap[key];
      a.style.whiteSpace = 'nowrap';

      if (index > 0) fragment.appendChild(document.createTextNode(' | '));
      fragment.appendChild(a);
      index += 1;
    }

    return fragment;
  };

  const insertBefore = (content, target) => {
    if (target) {
      target.appendChild(content);
    }
  }

  const injectModal = (modalNode) => {
    if (modalNode.inject) return;

    const $urlDOM = modalNode.querySelector('.qrcode[data-url]');

    if ($urlDOM) {
      const href = $urlDOM.getAttribute('data-url');
      insertBefore(
        render(href),
        modalNode.querySelector('[data-id="J-page-detail-ext"]')
      );
    }


    modalNode.inject = true;
  };

  const callback = () => {
    document.querySelectorAll('.ant-modal-root').forEach((node) => {
      try {
        injectModal(node);
      } catch (error) {
        console.warn(error);
      }
    });
  };

  try {
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    console.warn(e);
  }
})();
