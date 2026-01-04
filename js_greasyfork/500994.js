// ==UserScript==
// @name        CookieClicker自动化
// @author      ChatGPT
// @version     1.1
// @description 快速自动购买升级,短时间通关 CookieClicker
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @license MIT
// @namespace https://greasyfork.org/users/1335641
// @downloadURL https://update.greasyfork.org/scripts/500994/CookieClicker%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500994/CookieClicker%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // 自动点击大饼干
    setInterval(function() {
        Game.ClickCookie();
    }, 0.01)

    // 自动点击黄金饼干
    setInterval(function() {
        for (var i in Game.shimmers) {
            var s = Game.shimmers[i];
            if (s.type == 'golden') {
                s.pop();
            }
        }
    }, 2)

     // 修改黄金饼干的生成间隔时间
    Game.shimmerTypes['golden'].spawn = function() {
        var newShimmer = new Game.shimmer('golden');
        newShimmer.life = Game.fps * 1; // 10秒
        newShimmer.spawnLead = true;
    };

    // 加快生成一个黄金饼干
    setInterval(function() {
        Game.shimmerTypes['golden'].spawn();
    }, 1);


    // 自动点击可用的升级
    setInterval(function() {
        // 遍历所有可用的升级
        for (var i = 0; i < Game.UpgradesInStore.length; i++) {
            var upgrade = Game.UpgradesInStore[i];
            // 检查是否可以购买
            if (upgrade.canBuy()) {
                upgrade.buy();
            }
        }
    }, 10);
    
    // 自动购买可用的产品
    setInterval(function() {
        // 遍历所有可用的产品
        for (var i in Game.ObjectsById) {
            var product = Game.ObjectsById[i];
            // 检查是否可以购买
            if (product.locked == 0 && Game.cookies >= product.price) {
                product.buy();
            }
        }
    }, 10);
})();