// ==UserScript==
// @name         王者赛宝获取参数
// @namespace    http://tampermonkey.net/
// @version      2023-12-23
// @description  获取王者赛宝自定义房间数据
// @author       You
// @match        https://h5.nes.smoba.qq.com/pvpesport.web.user/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482938/%E7%8E%8B%E8%80%85%E8%B5%9B%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%8F%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482938/%E7%8E%8B%E8%80%85%E8%B5%9B%E5%AE%9D%E8%8E%B7%E5%8F%96%E5%8F%82%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function (send) {

        XMLHttpRequest.prototype.send = function () {
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    if (this.responseURL.includes("https://api.nes.smoba.qq.com/pvpesport.sgamenes.nesholder.nesholder/AddPubGameInfo")) {
                        console.log(this)
                        try {
                            var json = JSON.parse(this.responseText).game_info.match_rule_cfg.battle_custom_params
                            if (json.length > 0) {
                                var json_str = JSON.stringify(json)
                                prompt("已获取到数据 请复制下列输入框内容", json_str)
                            }
                        } catch {

                        }
                    }
                }
            }, false);

            send.apply(this, arguments);
        }

    })(XMLHttpRequest.prototype.send)

})();