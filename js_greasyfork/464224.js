// ==UserScript==
// @name         常回来看看-作弊脚本
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  git汉化游戏 常回来看看 的作弊脚本
// @author       yuyanMC
// @match        https://gltyx.github.io/check-back/
// @match        https://check-back.g8hh.com/
// @match        https://demonin.com/games/checkBack/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464224/%E5%B8%B8%E5%9B%9E%E6%9D%A5%E7%9C%8B%E7%9C%8B-%E4%BD%9C%E5%BC%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464224/%E5%B8%B8%E5%9B%9E%E6%9D%A5%E7%9C%8B%E7%9C%8B-%E4%BD%9C%E5%BC%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        game.buttonCooldowns = [0, 0, 0, 0, 0, 0];
    },100);
})();