// ==UserScript==
// @name        b站助手
// @author      lanbos
// @namespace   lanbos_space
// @description b站自动关弹幕，自动宽屏
// @version     1.02
// @include     *://www.bilibili.com/video/*
// @include     *://bangumi.bilibili.com/anime/*
//@require       http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/31924/b%E7%AB%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/31924/b%E7%AB%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
'use strict';
(function() {
    let cleanApp = {
        clean() {
            this.getBtn();
        },
        _getBox() {
            let $player = $("#bilibiliPlayer");
            let $iframe = $(".bilibiliHtml5Player");
            if ($player[0]) {
                return $player;
            } else if ($iframe[0]) {
                return $iframe.contents();
            } else {
                return false;
            }
        },
        getBtn() {
            let self = this;
            let timer = setInterval(function() {
                    let $player = self._getBox();
                    if (!self._getBox()[0]) {
                        return
                    }
                    let $closeBtn = $player.find(".bilibili-player-video-btn[name='ctlbar_danmuku_close']");
                    let $wideBtn = $player.find(".bilibili-player-video-btn[name='widescreen']");
                    if ($closeBtn[0] && $wideBtn[0]) {
                        clearInterval(timer);
                        // 使用异步关闭弹幕
                        setTimeout(function() {
                            $closeBtn.trigger("click");
                        }, 500)
                        $wideBtn.trigger("click");
                    } else {
                    }
            }, 1000);

        },
        run() {
            this.clean();
        }

    }
    cleanApp.run();
})();