// ==UserScript==
// @name         antd redirection
// @description  重定向到国内镜像
// @namespace    antd
// @version      1.0.2
// @author       bowencool
// @match        https://ant.design/*
// @icon         https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg
// @grant        none
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/485132
// @supportURL   https://github.com/bowencool/Tampermonkey-Scripts/issues
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/485132/antd%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/485132/antd%20redirection.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (window.location.hostname === "ant.design") {
    window.location.hostname = `ant-design.antgroup.com`;
  }
})();
