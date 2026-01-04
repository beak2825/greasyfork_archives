// ==UserScript==
// @name         osc-sidebar
// @namespace    http://xu81.com/
// @version      0.1
// @description  osc首页侧边栏，显示最新动弹和快速发送动弹的油猴插件
// @author       xu81.com
// @match        https://www.oschina.net/
// @exclude      https://www.oschina.net/tweet
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415851/osc-sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/415851/osc-sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 350px;height: 800px;position: absolute;right: 0px;border: none;top: 96px;z-index: 999;';
    iframe.setAttribute('src', 'https://www.oschina.net/tweets');
    document.body.appendChild(iframe);
})();