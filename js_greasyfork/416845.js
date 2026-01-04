// ==UserScript==
// @name         Eureka实例跳转swagger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在eureka页面点击实例就可以跳转swagger页面
// @author       张文涛
// @match        http://*/info
// @match        *://*/info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416845/Eureka%E5%AE%9E%E4%BE%8B%E8%B7%B3%E8%BD%ACswagger.user.js
// @updateURL https://update.greasyfork.org/scripts/416845/Eureka%E5%AE%9E%E4%BE%8B%E8%B7%B3%E8%BD%ACswagger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace("/swagger-ui.html");
})();