// ==UserScript==
// @name         weaver tools
// @namespace    http://tampermonkey.net/
// @version      2025.09.04
// @description  self use script
// @author       nephera
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_webRequest
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533080/weaver%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/533080/weaver%20tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalConsoleMethods = {};

    const protectConsole = () => {
        let init = true;
        const enableAltConsole = GM_getValue('enableAltConsole');
        if(enableAltConsole) console.log(`%calt console enabled, use console.method('$', ...args) to show logs`, 'font-size:14px;background-color: #42b983;color:#fff;');

        Object.keys(unsafeWindow.console).forEach(method => {
          originalConsoleMethods[method] = unsafeWindow.console[method];


          Object.defineProperty(unsafeWindow.console, method, {
            configurable: false,
            enumerable: true,
            get() {
                if(!enableAltConsole) {
                  return originalConsoleMethods[method];
                } else {
                  return (...args) => {
                    if(args[0] === '$') return originalConsoleMethods[method](...args.slice(1));
                  }
                }
            },
            set(value) {
                if (init) {
                  init = false;
                  if(!enableAltConsole) console.log('%cconsole protection executed successfully', 'font-size:14px;background-color: #42b983;color:#fff;');
                }
            }
          })
        })
    };

    const renderSetting = (key, name, trueFunc, falseFunc) => {
        const settingValue = GM_getValue(key);
        if(settingValue) {
            trueFunc && trueFunc();
            GM_registerMenuCommand("✅ " + name, () => {
                GM_setValue(key, false);
                location.reload();
            });
        } else {
            falseFunc && falseFunc();
            GM_registerMenuCommand("❌ " + name, () => {
                GM_setValue(key, true);
                location.reload();
            });
        }
    };
    renderSetting('enableNoWatermark', 'No Watermark in e-cology.com.cn', () => {
        if(location.host === 'www.e-cology.com.cn') {
            GM_addStyle(`[id^="ui-watermark-"]{display:none}`);
        }
    });
    renderSetting('enableNoHasLogin', 'No Has login in weapp.eteams.cn', () => {
        if(location.host === 'weapp.eteams.cn') {
            GM_addStyle(`.weapp-em-has-login-dialog{display:none}`);
        }
    });
    renderSetting('enableNoiFrame', 'No iFrame in develop', () => {
        if(location.host.includes('develop')) {
            GM_addStyle(`#root ~ iframe{display:none}`);
        }
    });
    renderSetting('enableConsoleLog', 'Console Protection', () => {
        protectConsole();
    });
    renderSetting('enableAltConsole', `Alt Console(console.method('$', ...args))`);
})();