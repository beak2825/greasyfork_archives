// ==UserScript==
// @name         Ant Design (antd) 文档重定向到国内镜像
// @namespace    antd-docs-redirect
// @version      1.0.2
// @author       https://github.com/kazoottt
// @description  将 Ant Design (antd) 文档重定向到国内镜像,加快访问速度
// @license      MIT
// @icon         https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg
// @match        https://ant.design/*
// @match        https://procomponents.ant.design/*
// @downloadURL https://update.greasyfork.org/scripts/511845/Ant%20Design%20%28antd%29%20%E6%96%87%E6%A1%A3%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/511845/Ant%20Design%20%28antd%29%20%E6%96%87%E6%A1%A3%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E5%9B%BD%E5%86%85%E9%95%9C%E5%83%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  (() => {
    if (window.location.href.startsWith("https://ant.design/")) {
      const pathname = window.location.pathname;
      console.log(`redirecting to https://ant-design.antgroup.com${pathname}`);
      window.location.href = `https://ant-design.antgroup.com${pathname}`;
    }
    if (window.location.href.startsWith("https://procomponents.ant.design/")) {
      const pathname = window.location.pathname;
      console.log(
        `redirecting to https://pro-components.antdigital.dev${pathname}`
      );
      window.location.href = `https://pro-components.antdigital.dev${pathname}`;
    }
  })();

})();