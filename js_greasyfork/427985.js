// ==UserScript==
// @name                        Custom browser platform
// @name:zh-CN                  自定义浏览器平台信息（添加常用UA）
// @namespace                   http://tampermonkey.net/
// @description                 Customize browser platform information so that you can freely access the mobile or desktop side of the target web site. This script is only valid for JavaScript detection and invalid for server-side detection.
// @description:zh-CN           自定义浏览器平台信息，以便于你可以自由访问目标网站的移动端或者桌面端。此脚本仅针对JavaScript检测有效，对于服务端检测无效。
// @version                     0.1.3
// @include                     *
// @run-at                      document-start
// @grant                       GM_getValue
// @grant                       GM_setValue
// @grant                       GM_addStyle
// @grant                       GM_registerMenuCommand
//@run-at                       document-start
// @require                     https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js
// @author                      cw
// @downloadURL https://update.greasyfork.org/scripts/427985/Custom%20browser%20platform.user.js
// @updateURL https://update.greasyfork.org/scripts/427985/Custom%20browser%20platform.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function isMobileDevice() {
        try {
            document.createEvent("TouchEvent");
            return (navigator.maxTouchPoints > 0 || 'ontouchstart' in document.documentElement) &&
                window.orientation > -1;
        } catch (e) {
            return false;
        }
    }

    function init(){
        var originalUA = ''
        var originalPlatform = navigator.platform;
        var choices = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
            'Safari/Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Safari/605.1.15',
            'chrome/Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11',
            'IPhone/Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5',
            'Android/Mozilla/5.0 (Linux; U; Android 2.2.1; zh-cn; HTC_Wildfire_A3333 Build/FRG83D) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
            'Windows Phone Mango/Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)',
            '微信android/Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255',
            '微信ios/Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2',
        ];
        var cfg = new MonkeyConfig({
            title: 'Custom Platform Information(保存后刷新页面生效)',
            menuCommand: true,
            params: {
                UserAgentManual: {
                    type: 'text',
                    default: originalUA
                },
                UserAgent: {
                    type: 'select',
                    choices,
                    multiple: false,
                    default: choices[0]
                },
                Platform: {
                    type: 'text',
                    default: originalPlatform
                },
                'Analog device': {
                    type: 'select',
                    choices: ['mobile', 'desktop'],
                    default: 'desktop'
                },
            }
        });

        var customUAManual = cfg.get('UserAgentManual');
        var customUA = cfg.get('UserAgent');
        var customPlatform = cfg.get('Platform');

        if (cfg.get('Analog device') == 'mobile') {
            try{
                window.orientation = 1;
            }
            catch(error){
            }
            document.documentElement.ontouchstart =
                document.documentElement.ontouchmove =
                document.documentElement.ontouchend =
                document.documentElement.ontouchcancel = function () {};
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: function () {
                    return 5;
                }
            });
        } else {
            try{
                window.orientation = undefined;
            }
            catch(error){
            }
            document.documentElement.ontouchstart =
                document.documentElement.ontouchmove =
                document.documentElement.ontouchend =
                document.documentElement.ontouchcancel = undefined;
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: function () {
                    return 0;
                }
            });
        }

        try{
            Object.defineProperty(navigator, 'userAgent', {
                get: function () {
                    return customUAManual || customUA;
                }
            });
        }
        catch(error){
        }
        try{
            Object.defineProperty(navigator, 'userAgent', {
                value: customUAManual || customUA,
                writable: true
            });
        }
        catch(error){
        }
        Object.defineProperty(navigator, 'platform', {
            get: function () {
                return customPlatform;
            }
        });
    }
    try{
        init();
    }
    catch(error){
        console.log('自定义浏览器平台信息初始化失败:'+error)
    }
})();