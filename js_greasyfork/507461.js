// ==UserScript==
// @name               Webpage mask
// @name:zh-CN         网页遮罩层
// @name:en            Webpage mask
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.4.3
// @description        A customizable mask layer above any webpage. You can use it as a privacy mask, a screensaver, a nightmode filter... and so on.
// @description:zh-CN  在网页上方添加一个可以自定义的遮罩层。可以用来遮挡隐私内容，或者用作屏保，又或是用来设置护眼模式... 等等等等
// @description:en     A customizable mask layer above any webpage. You can use it as a privacy mask, a screensaver, a nightmode filter... and so on.
// @author             PY-DNG
// @license            MIT
// @match              http*://*/*
// @require            https://update.greasyfork.org/scripts/456034/1532680/Basic%20Functions%20%28For%20userscripts%29.js
// @grant              GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addElement
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/507461/Webpage%20mask.user.js
// @updateURL https://update.greasyfork.org/scripts/507461/Webpage%20mask.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */

/* Important note: this script is for convenience, but is NOT a security tool.
   ANYONE with basic web programming knowledge CAN EASYILY UNLOCK/UNCENSOR/REMOVE MASK
   without permission/password AND EVEN YOU CANNOT KNOW IT */

   (function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
			DEFAULT: 'en',
			'zh-CN': {
                CompatAlert: '用户脚本 [网页遮罩层] 提示：\n（本提示仅展示一次）本脚本推荐使用最新版Tampermonkey运行，如果使用旧版Tampermonkey或其他脚本管理器可能导致兼容性问题，请注意。',
                Mask: '开启',
                Unmask: '关闭',
                EnableAutomask: '为此网站开启自动遮罩',
                DisableAutomask: '关闭此网站的自动遮罩',
                SetIDLETime: '设置自动遮罩触发时间',
                PromptIDLETime: '每当 N 秒无操作后，将为网站自动开启遮罩\n您希望 N 为：',
                TamperorilyDisable: '暂时禁用遮罩层',
                TamperorilyDisabled: '已暂时禁用遮罩层：当前网页在下一次刷新前，都不会展示遮罩层',
                CustomUserstyle: '自定义遮罩层样式',
                PromptUserstyle: '您可以在此彻底地自定义遮罩层\n如果您不确定怎么写或者不小心写错了，留空并点击确定即可重置为默认值\n\n格式：\ncss:CSS值 - 设定自定义CSS样式\nimg:网址 - 在遮罩层上全屏显示网址对应的图片\njs:代码 - 执行自定义js代码，您可以使用js:debugger测试运行环境、调试您的代码',
                IDLETimeInvalid: '您的输入不正确：只能输入大于等于零的整数或小数'
            },
            'en': {
                CompatAlert: '(This is a one-time alert)\nFrom userscript [Privacy mask]:\nThis userscript is designed for latest versions of Tampermonkey, working with old versions or other script manager may encounter bugs.',
                Mask: 'Show mask',
                Unmask: 'Hide mask',
                EnableAutomask: 'Enable auto-mask for this site',
                DisableAutomask: 'Disable auto-mask for this site',
                SetIDLETime: 'Configure auto-mask time',
                PromptIDLETime: 'Mask will be shown after the webpage has been idle for N second(s).\n You can set that N here:',
                TamperorilyDisable: 'Tamperorily disable mask',
                TamperorilyDisabled: 'Mask tamperorily disabled: mask will not be shown in current webpage before refreshing the webpage',
                CustomUserstyle: 'Custom auto-mask style',
                PromptUserstyle: 'You can custom the content and style of the mask here\nIf you\'re not sure how to compose styles, leave it blank to set back to default.\n\nStyle format:\ncss:CSS - Apply custom css stylesheet\nimg:url - Display custom image by fullscreen\njs:code - Execute custom javascript when mask created. You can use "js:debugger" to test your code an the environment.',
                IDLETimeInvalid: 'Invalid input: positive numbers only'
            }
		},
        Style: {
            BuiltinStyle: '#mask {position: fixed; top: 0; left: 0; right: 100vw; bottom: 100vh; width: 100vw; height: 100vh; border: 0; margin: 0; padding: 0; background: transparent; z-index: 2147483647; display: none} #mask.show {display: block;}',
            DefaultUserstyle: 'css:#mask {backdrop-filter: blur(30px);}'
        }
	};

	// Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

    loadFuncs([{
        id: 'mask',
        desc: 'Core: create mask DOM, provide basic mask api',
        detectDom: 'body',
        dependencies: 'utils',
        func: () => {
            const utils = require('utils');
            const return_obj = new EventTarget();

            // Make mask
            const mask_container = $$CrE({
                tagName: 'div',
                styles: { all: 'initial' }
            });
            const mask = $$CrE({
                tagName: 'div',
                props: { id: 'mask' }
            });
            const shadow = mask_container.attachShadow({ mode: unsafeWindow.isPY_DNG ? 'open' : 'closed' });
            shadow.appendChild(mask);
            document.body.after(mask_container);

            // Styles
            const style = addStyle(shadow, CONST.Style.BuiltinStyle, 'mask-builtin-style');
            applyUserstyle();

            ['mouseup', 'keyup', 'dragenter'].forEach(evtname => utils.$AEL(unsafeWindow, evtname, e => hide()));

            const return_props = {
                mask_container, element: mask, shadow, style, show, hide,
                get showing() { return showing(); },
                set showing(v) { v ? show() : hide() },
                get userstyle() { return getUserstyle() },
                set userstyle(v) { return setUserstyle(v) }
            };
            utils.copyPropDescs(return_props, return_obj);
            return return_obj;

            function show() {
                const defaultNotPrevented = return_obj.dispatchEvent(new Event('show', { cancelable: true }));
                defaultNotPrevented && mask.classList.add('show');
            }

            function hide() {
                const defaultNotPrevented = return_obj.dispatchEvent(new Event('hide', { cancelable: true }));
                defaultNotPrevented && mask.classList.remove('show');
            }

            function showing() {
                return mask.classList.contains('show');
            }

            function getUserstyle() {
                return GM_getValue('userstyle', CONST.Style.DefaultUserstyle);
            }

            function setUserstyle(val) {
                const defaultNotPrevented = return_obj.dispatchEvent(new Event('restyle', { cancelable: true }));
                if (defaultNotPrevented) {
                    applyUserstyle(val);
                    GM_setValue('userstyle', val);
                }
            }

            function applyUserstyle(val) {
                if (!val) { val = getUserstyle() }
                if (!val.includes(':')) { Err('mask.applyUserStyle: type not found') }
                const type = val.substring(0, val.indexOf(':')).toLowerCase();
                const value = val.substring(val.indexOf(':') + 1).trim();
                switch (type) {
                    case 'css':
                        GM_addElement(shadow, 'style', { textContent: value, style: 'user' });
                        utils.$AEL(return_obj, 'restyle', e => $(shadow, 'style[style="user"]').remove(), { once: true });
                        break;
                    case 'js':
                    case 'javascript':
                        utils.exec(value, { require, CONST });
                        break;
                    case 'img':
                    case 'image': {
                        addImage(value);
                        break;

                        function addImage(src, remaining_retry=3) {
                            const img = GM_addElement(mask, 'img', {
                                src: value,
                                style: 'width: 100vw; height: 100vh; border: 0; padding: 0; margin: 0;',
                                crossorigin: 'anonymous'
                            }) ?? $(mask, 'img');
                            const fallback_mask = GM_addElement(mask, 'div', {
                                style: 'display: none; background-color: #222222; width: 100vw; height: 100vh; border: 0; padding: 0; margin: 0;',
                            }) ?? $(mask, 'div');
                            const controller = new AbortController();
                            utils.$AEL(img, 'error', e => {
                                if (remaining_retry-- > 0) {
                                    DoLog(LogLevel.Warning, `Mask image load error, retrying...\n(remaining ${remaining_retry} retries)`);
                                    controller.abort();
                                    img.remove();
                                    fallback_mask.remove();
                                    addImage(src, remaining_retry);
                                } else {
                                    img.style.display = 'none';
                                    fallback_mask.style.display = 'block';
                                    DoLog(LogLevel.Error, `Mask image load error (after maximum retries)\nTry reloading the page or changing an image\nA black mask has been applied as fallback\nImage url: ${src}`);
                                }
                            }, { once: true });
                            utils.$AEL(return_obj, 'restyle', e => [img, fallback_mask].forEach(elm => elm.remove()), {
                                once: true,
                                signal: controller.signal
                            });
                        }
                    }
                    default:
                        Error(`mask.applyUserStyle: Unknown type: ${type}`);
                }
            }
        }
    }, {
        id: 'control',
        desc: 'Provide mask control ui to user',
        dependencies: ['utils', 'mask'],
        func: () => {
            const utils = require('utils');
            const mask = require('mask');

            // Switch menu builder
            const buildMenu = (text_getter, callback, id=null) => GM_registerMenuCommand(text_getter(), callback, id !== null ? { id } : {});

            // Enable/Disable switch
            const show_text_getter = () => CONST.Text[mask.showing ? 'Unmask' : 'Mask'];
            const show_menu_onclick = e => mask.showing = !mask.showing;
            const buildShowMenu = (id = null) => buildMenu(show_text_getter, show_menu_onclick, id);
            const id = buildShowMenu();
            utils.$AEL(mask, 'show', e => setTimeout(() => buildShowMenu(id)));
            utils.$AEL(mask, 'hide', e => setTimeout(() => buildShowMenu(id)));

            // Tamperorily disable
            GM_registerMenuCommand(CONST.Text.TamperorilyDisable, e => {
                mask.hide();
                utils.$AEL(mask, 'show', e => e.preventDefault());
                DoLog(LogLevel.Success, CONST.Text.TamperorilyDisabled);
                setTimeout(() => alert(CONST.Text.TamperorilyDisabled));
            });

            // Custom user style
            GM_registerMenuCommand(CONST.Text.CustomUserstyle, e => {
                let style = prompt(CONST.Text.PromptUserstyle, mask.userstyle);
                if (style === null) { return; }
                if (style === '') { style = CONST.Style.DefaultUserstyle }
                // Here should add an style valid check
                mask.userstyle = style;
            });

            return { id };
        }
    }, {
        id: 'automask',
        desc: 'extension: auto-mask after certain idle time',
        detectDom: 'body',
        dependencies: ['mask', 'utils'],
        func: () => {
            const utils = require('utils');
            const mask = require('mask');
            const id = GM_registerMenuCommand(
                isAutomaskEnabled() ? CONST.Text.DisableAutomask : CONST.Text.EnableAutomask,
                function onClick(e) {
                    isAutomaskEnabled() ? disable() : enable();
                    GM_registerMenuCommand(
                        isAutomaskEnabled() ? CONST.Text.DisableAutomask : CONST.Text.EnableAutomask,
                        onClick, { id }
                    );
                    isAutomaskEnabled() && check_idle();
                }
            );
            GM_registerMenuCommand(CONST.Text.SetIDLETime, e => {
                const config = getConfig();
                const time = prompt(CONST.Text.PromptIDLETime, config.idle_time);
                if (time === null) { return; }
                if (!/^(\d+\.)?\d+$/.test(time)) { alert(CONST.Text.IDLETimeInvalid); return; }
                config.idle_time = +time;
                setConfig(config);
            });

            // Auto-mask when idle
            let last_refreshed = Date.now();
            const cancel_idle = () => {
                // Iframe events won't bubble into parent window, so manually tell top window to also cancel_idle
                const in_iframe = unsafeWindow !== unsafeWindow.top;
                in_iframe && utils.postMessage(unsafeWindow.top, 'iframe_cancel_idle');
                // Refresh time record
                last_refreshed = Date.now();
            };
            ['mousemove', 'mousedown', 'mouseup', 'wheel', 'keydown', 'keyup'].forEach(evt_name =>
                utils.$AEL(unsafeWindow, evt_name, e => cancel_idle(), { capture: true }));
            utils.recieveMessage('iframe_cancel_idle', e => cancel_idle());
            const check_idle = () => {
                const config = getConfig();
                const time_left = config.idle_time * 1000 - (Date.now() - last_refreshed);
                if (time_left <= 0) {
                    isAutomaskEnabled() && !mask.showing && mask.show();
                    utils.$AEL(mask, 'hide', e => {
                        cancel_idle();
                        check_idle();
                    }, { once: true });
                } else {
                    setTimeout(check_idle, time_left);
                }
            }
            check_idle();

            return {
                id, enable, disable,
                get enabled() { return isAutomaskEnabled(); }
            };

            function getConfig() {
                return GM_getValue('automask', {
                    sites: [],
                    idle_time: 30
                });
            }

            function setConfig(val) {
                return GM_setValue('automask', val);
            }

            function isAutomaskEnabled() {
                return getConfig().sites.includes(location.host);
            }

            function enable() {
                if (isAutomaskEnabled()) { return; }
                const config = getConfig();
                config.sites.push(location.host);
                setConfig(config);
            }

            function disable() {
                if (!isAutomaskEnabled()) { return; }
                const config = getConfig();
                config.sites.splice(config.sites.indexOf(location.host), 1);
                setConfig(config);
            }
        }
    }, {
        id: 'utils',
        desc: 'helper functions',
        func: () => {
            function GM_hasVersion(version) {
                return hasVersion(GM_info?.version || '0', version);

                function hasVersion(ver1, ver2) {
                    return compareVersions(ver1.toString(), ver2.toString()) >= 0;

                    // https://greasyfork.org/app/javascript/versioncheck.js
                    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format
                    function compareVersions(a, b) {
                      if (a == b) {
                        return 0;
                      }
                      let aParts = a.split('.');
                      let bParts = b.split('.');
                      for (let i = 0; i < aParts.length; i++) {
                        let result = compareVersionPart(aParts[i], bParts[i]);
                        if (result != 0) {
                          return result;
                        }
                      }
                      // If all of a's parts are the same as b's parts, but b has additional parts, b is greater.
                      if (bParts.length > aParts.length) {
                        return -1;
                      }
                      return 0;
                    }

                    function compareVersionPart(partA, partB) {
                      let partAParts = parseVersionPart(partA);
                      let partBParts = parseVersionPart(partB);
                      for (let i = 0; i < partAParts.length; i++) {
                        // "A string-part that exists is always less than a string-part that doesn't exist"
                        if (partAParts[i].length > 0 && partBParts[i].length == 0) {
                          return -1;
                        }
                        if (partAParts[i].length == 0 && partBParts[i].length > 0) {
                          return 1;
                        }
                        if (partAParts[i] > partBParts[i]) {
                          return 1;
                        }
                        if (partAParts[i] < partBParts[i]) {
                          return -1;
                        }
                      }
                      return 0;
                    }

                    // It goes number, string, number, string. If it doesn't exist, then
                    // 0 for numbers, empty string for strings.
                    function parseVersionPart(part) {
                      if (!part) {
                        return [0, "", 0, ""];
                      }
                      let partParts = /([0-9]*)([^0-9]*)([0-9]*)([^0-9]*)/.exec(part)
                      return [
                        partParts[1] ? parseInt(partParts[1]) : 0,
                        partParts[2],
                        partParts[3] ? parseInt(partParts[3]) : 0,
                        partParts[4]
                      ];
                    }
                }
            }

            function copyPropDescs(from, to) {
                Object.defineProperties(to, Object.getOwnPropertyDescriptors(from));
            }

            function randint(min, max) {
                return Math.random() * (max - min) + min;
            }

            function randstr(len) {
                const letters = [...Array(26).keys()].map( i => String.fromCharCode('a'.charCodeAt(0) + i) );
                let str = '';
                for (let i = 0; i < len; i++) {
                    str += letters.at(randint(0, 25));
                }
                return str;
            }

            /**
             * execute js code in a global function closure and try to bypass CSP rules
             * { name: 'John', number: 123456 } will be executed by (function(name, number) { code }) ('John', 123456);
             *
             * @param {string} code
             * @param {Object} args
             */
            function exec(code, args) {
                // Parse args
                const arg_names = Object.keys(args);
                const arg_vals = arg_names.map(name => args[name]);
                // Construct middle code and middle obj
                const id = randstr(16);
                const middle_obj = unsafeWindow[id] = { id, arg_vals, url: null };
                const middle_code_parts = {
                    single_instance: [
                        '// Run code only once',
                        `if (!window.hasOwnProperty('${id}')) { return; }`
                    ].join('\n'),
                    cleaner: [
                        '// Do some cleaning first',
                        `const middle_obj = window.${id};`,
                        `delete window.${id};`,
                        `URL.revokeObjectURL(middle_obj.url);`,
                        `document.querySelector('#${id}')?.remove();`
                    ].join('\n'),
                    executer: [
                        '// Execute user code',
                        `(function(${arg_names.join(', ')}, middle_obj) {`,
                        code,
                        `}).call(null, ...middle_obj.arg_vals, undefined);`
                    ].join('\n'),
                }
                const middle_code = `(function() {\n${Object.values(middle_code_parts).join('\n\n')}\n}) ();`;
                const blob = new Blob([middle_code], { type: 'application/javascript' });
                const url = middle_obj.url = URL.createObjectURL(blob);
                // Create and execute <script>
                GM_addElement(document.head, 'script', { src: url, id });
                GM_addElement(document.head, 'script', { textContent: middle_code, id });
            }

            /**
             * Some website (like icourse163.com, dolmods.com, etc.) hooked addEventListener,\
             * so calling target.addEventListener has no effect.
             * this function get a "pure" addEventListener from new iframe, and make use of it
             */
            function $AEL(target, ...args) {
                if (!$AEL.id_prop) {
                    $AEL.id_prop = randstr(16);
                    $AEL.id_val = randstr(16);
                    GM_addElement(document.body, 'iframe', {
                        srcdoc: '<html></html>',
                        style: [
                            'border: 0',
                            'padding: 0',
                            'margin: 0',
                            'width: 0',
                            'height: 0',
                            'display: block',
                            'visibility: visible'
                        ].concat('').join(' !important; '),
                        [$AEL.id_prop]: $AEL.id_val,
                    });
                }
                try {
                    const ifr = $(`[${$AEL.id_prop}=${$AEL.id_val}]`);
                    const AEL = ifr.contentWindow.EventTarget.prototype.addEventListener;
                    return AEL.call(target, ...args);
                } catch (e) {
                    if (!$(`[${$AEL.id_prop}=${$AEL.id_val}]`)) {
                        DoLog(LogLevel.Warning, 'GM_addElement is not working properly: added iframe not found\nUsing normal addEventListener instead');
                    } else {
                        DoLog(LogLevel.Warning, 'Unknown error occured\nUsing normal addEventListener instead')
                    }
                    return window.EventTarget.prototype.addEventListener.call(target, ...args);
                }
            }

            const [postMessage, recieveMessage] = (function() {
                // Check and init security key
                let securityKey = GM_getValue('Message-Security-Key');
                if (!securityKey) {
                    securityKey = { prop: randstr(8), value: randstr(16) };
                    GM_setValue('Message-Security-Key', securityKey);
                }

                /**
                 * post a message to target window using window.postMessage
                 * name, data will be formed as an object in format of { name, data, securityKeyProp: securityKeyVal }
                 * securityKey will be randomly generated with first initialization
                 * and saved with GM_setValue('Message-Security-Key', { prop, value })
                 *
                 * @param {string} name - type of this message
                 * @param {*} [data] - data of this message
                 */
                function postMessage(targetWindow, name, data=null) {
                    const securityKeyProp = securityKey.prop;
                    const securityKeyVal = securityKey.value;
                    targetWindow.postMessage({ name, data, [securityKey.prop]: securityKey.value }, '*');
                }

                /**
                 * recieve message posted by postMessage
                 * @param {string} name - which kind of message you want to recieve
                 * @param {function} [callback] - if provided, return undefined and call this callback function each time a message
                                                  recieved; if not, returns a Promise that will be fulfilled with next message for once
                 * @returns {(Promise<number>|undefined)}
                 */
                function recieveMessage(name, callback=null) {
                    const win = typeof unsafeWindow === 'object' ? unsafeWindow : window;
                    let resolve;
                    $AEL(win, 'message', function listener(e) {
                        // Check security key first
                        if (!(e?.data?.[securityKey.prop] === securityKey.value)) { return; }
                        if (e?.data?.name === name) {
                            if (callback) {
                                callback(e);
                            } else {
                                resolve(e);
                            }
                        }
                    });
                    if (!callback) {
                        return new Promise((res, rej) => { resolve = res; });
                    }
                }

                return [postMessage, recieveMessage];
            }) ();

            return { GM_hasVersion, copyPropDescs, randint, randstr, exec, $AEL, postMessage, recieveMessage };
        }
    }, {
        desc: 'compatibility alert',
        dependencies: 'utils',
        func: () => {
            const utils = require('utils');
            if (!GM_getValue('compat-alert') && (GM_info.scriptHandler !== 'Tampermonkey' || !utils.GM_hasVersion('5.0'))) {
                alert(CONST.Text.CompatAlert);
                GM_setValue('compat-alert', true);
            }
        }
    }]);
})();