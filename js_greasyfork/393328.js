// ==UserScript==
// @name         CodeLab Page Tour Loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  加载 codelab-page-tour 启动脚本
// @author       ganlin.gl
// @match        https://*.alipay.com/*
// @match        https://*.antfin-inc.com/*
// @match        https://*.alipay.net/*
// @match        http://*.alipay.net/*
// @match        https://*.alibaba.com/*
// @match        https://*.alibaba-inc.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/393328/CodeLab%20Page%20Tour%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/393328/CodeLab%20Page%20Tour%20Loader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const script = document.createElement('script')
  script.src = `https://codelab.test.alipay.net/page-tour/index.prod.js`
  document.body.appendChild(script)
})();