// ==UserScript==
// @name                隐藏徽标
// @namespace           https://github.com/GuoChen-thlg
// @version             0.2.2
// @description         隐藏视频播放时出现的网站LOGO (支持：腾讯，爱奇艺，优酷，PP)
// @author              THLG
// @supportURL          gc.thlg@gmail.com
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CK755FJ9PSBZ8
// @contributionAmount  1
// @match               *://v.qq.com/*
// @match               *://*.iqiyi.com/*
// @match               *://v.youku.com/*
// @match               *://v.pptv.com/*
// @match               *://*.mgtv.com/*
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/424090/%E9%9A%90%E8%97%8F%E5%BE%BD%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/424090/%E9%9A%90%E8%97%8F%E5%BE%BD%E6%A0%87.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var style = [
        "[data-role='txp-ui-watermark-mod']",
        ".txp-watermark",
        ".iqp-player [data-player-hook='logo'].iqp-logo-box",
        "#ykPlayer .youku-layer-logo",
        ".w-video #p-mark",

    ].join(',') + "{ display:none !important }"
    var n_style = document.createElement('style')
    n_style.innerHTML = style
    document.getElementsByTagName('head')[0].appendChild(n_style)
})();