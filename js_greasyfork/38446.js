// ==UserScript==
// @name                        Custom browser platform
// @name:zh-CN                  自定义浏览器平台信息
// @namespace                   https://github.com/gam2046/userscript
// @description                 Customize browser platform information so that you can freely access the mobile or desktop side of the target web site. This script is only valid for JavaScript detection and invalid for server-side detection.
// @description:zh-CN           自定义浏览器平台信息，以便于你可以自由访问目标网站的移动端或者桌面端。此脚本仅针对JavaScript检测有效，对于服务端检测无效。
// @version                     2
// @match                       *://*/*
// @run-at                      document-start
// @grant                       GM_getValue
// @grant                       GM_setValue
// @grant                       GM_addStyle
// @grant                       GM_registerMenuCommand
// @supportURL                  https://github.com/gam2046/userscript/issues/new
// @require                     https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js
// @copyright                   2018+, forDream <gan2046#gmail.com>
// @author                      forDream
// @downloadURL https://update.greasyfork.org/scripts/38446/Custom%20browser%20platform.user.js
// @updateURL https://update.greasyfork.org/scripts/38446/Custom%20browser%20platform.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isMobileDevice() {
        try {
            document.createEvent("TouchEvent");
            return (navigator.maxTouchPoints > 0 || 'ontouchstart' in document.documentElement) &&
                window.orientation > -1;
        }
        catch (e) {
            return false;
        }
    }

    var originalUA = navigator.userAgent;
    var originalPlatform = navigator.platform;

    var cfg = new MonkeyConfig({
        title: 'Custom Platform Information',
        menuCommand: true,
        params: {
            UserAgent: {
                type: 'text',
                default: originalUA
            },
            Platform: {
                type: 'text',
                default: originalPlatform
            },
            'Analog mobile device': {
                type: 'checkbox',
                default: false,
                enable: false
            },
            'Analog desktop device': {
                type: 'checkbox',
                default: false,
                enable: false
            }
        }
    });

    var customUA = cfg.get('UserAgent');
    var customPlatform = cfg.get('Platform');

    // 如果同时勾选移动端与桌面端模拟，则忽略桌面端选项
    if (true == cfg.get('Analog mobile device')) {
        cfg.set('Analog desktop device', false);
        window.orientation = 1;
        document.documentElement.ontouchstart =
            document.documentElement.ontouchmove =
            document.documentElement.ontouchend =
            document.documentElement.ontouchcancel = function () { };
        Object.defineProperty(navigator, 'maxTouchPoints', { get: function () { return 5; } });
    } else if (true == cfg.get('Analog desktop device')) {
        window.orientation = undefined;
        document.documentElement.ontouchstart =
            document.documentElement.ontouchmove =
            document.documentElement.ontouchend =
            document.documentElement.ontouchcancel = undefined;
        Object.defineProperty(navigator, 'maxTouchPoints', { get: function () { return 0; } });
    }

    Object.defineProperty(navigator, 'userAgent', { get: function () { return customUA; } });
    Object.defineProperty(navigator, 'platform', { get: function () { return customPlatform; } });

    console.log('Current is mobile ', isMobileDevice());
})();
