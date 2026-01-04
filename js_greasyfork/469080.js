// ==UserScript==
// @name         清洗url
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  移除url中冗余的查询参数
// @author       微笑
// @run-at       document-idle
// @match        https://mp.weixin.qq.com/*
// @match        https://www.zhihu.com/*
// @match        https://*.bilibili.com/*
// @match        https://github.com/*
// @match        https://*.aliyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469080/%E6%B8%85%E6%B4%97url.user.js
// @updateURL https://update.greasyfork.org/scripts/469080/%E6%B8%85%E6%B4%97url.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const domainConfig = {
    'mp.weixin.qq.com': {
      removeKeys: ['chksm', 'source'],
      removeHash: true,
    },
    'www.zhihu.com': {
      removeKeys: ['utm_medium', 'utm_oi', 'utm_source'],
      removeHash: false,
    },
    'search.bilibili.com': {
      removeKeys: ['spm_id_from', 'from_source', 'search_source', 'vt'],
      removeHash: false,
    },
    'space.bilibili.com': {
      removeKeys: ['spm_id_from', 'from_source', 'search_source'],
      removeHash: false,
    },
    'www.bilibili.com': {
      removeKeys: [
        'buvid',
        'is_story_h5',
        'mid',
        'p',
        'plat_id',
        'share_from',
        'share_medium',
        'share_plat',
        'share_session_id',
        'share_source',
        'share_tag',
        'timestamp',
        'unique_k',
        'up_id',
        'vd_source',
        'spm_id_from',
      ],
    },
    'github.com': {
      removeKeys: ['ref'],
    },
  };

  const defaultRemoveKeys = ['spm'];

  const { href, host } = location;
  const newUrl = new URL(href);

  const removeParams = (keys) => {
    keys.forEach((key) => {
      newUrl.searchParams.delete(key);
    });
  };

  const configForCurrentDomain = domainConfig[host];
  removeParams(configForCurrentDomain?.removeKeys || defaultRemoveKeys);

  if (configForCurrentDomain) {
    if (configForCurrentDomain.removeHash) {
      newUrl.hash = '';
    }
  }

  const newHref = newUrl.toString();
  if (newHref !== href) {
    setTimeout(() => {
      history.replaceState(null, '', newHref);
    }, 3000);
  }

  if (host === 'www.bilibili.com') {
    const adDom = document.querySelector('.adblock-tips');
    if (adDom) {
      adDom.remove();
    }
  }
})();
