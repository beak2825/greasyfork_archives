// ==UserScript==
// @name         MediumUnlocker
// @namespace    https://github.com/domonnss
// @version      1.0
// @description  unlock medium content by redirect to freedium.cfd
// @author       domonnss
// @match        https://medium.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/534892/MediumUnlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/534892/MediumUnlocker.meta.js
// ==/UserScript==

const $ = jQuery.noConflict(true);

// 定义当前URL变量
const curURL = window.location.href;

// 移除URL协议的辅助函数
function removeProtocol(url) {
  return url.replace(/^(https?:|)\/\//, '');
}

// 定义sites对象，包含需要处理的网站
const sites = {
  medium: {
    match: 'medium.com',
    redirect: function() {
      // 自定义重定向逻辑
      const freediumBase = "https://freedium.cfd/";
      const mediumUrl = window.location.href;
      // 构建目标URL并跳转
      window.location.replace(freediumBase + mediumUrl);
    }
  }
};

/**
 * @function
 * @name match
 * @param {string} pattern - URL模式
 * @param {boolean} enableRegex - 是否启用正则表达式
 * @param {boolean} checkProtocol - 是否检查协议
 * @description 检查当前URL是否匹配给定模式
 */
function match(pattern, enableRegex = false, checkProtocol = false) {
  var curURLProto;
  if (checkProtocol) {
    curURLProto = curURL;
  } else {
    curURLProto = removeProtocol(curURL);
    pattern = removeProtocol(pattern);
  }

  if (enableRegex) {
    return curURLProto.search(pattern) > -1;
  } else {
    return curURLProto.indexOf(pattern) === 0;
  }
}

// 主执行函数
(function() {
  'use strict';

  // 判断当前URL是否匹配Medium
  if (match(sites.medium.match)) {
    console.log("检测到Medium网站，准备重定向...");
    sites.medium.redirect();
  }
})();