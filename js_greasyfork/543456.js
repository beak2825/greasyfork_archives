// ==UserScript==
// @name         解除复制限制 Lift Copy Restrictions
// @name:en      Lift Copy Restrictions
// @name:zh-CN   解除复制限制
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAB2AAAAdgB+lymcgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALvSURBVHic7Zu7bhNBFIa/oBCaUMe5VbTwElQkAlFyqSmICBHkHeANQKkoeANQkkcgoSAyDR1CioHWkHURJcamGC+yVrvenTlzPEM0v3Qk27NzLr93zpyZnYWEhISEybgCPAUOgR4wDCQ94ADYBOZUIx7DMtBWCkgiR8CSYtyA+edjDD6XTyjfCVsRBFknT9SiBz5aOqONFWC/YPNA02BGXAQArBZsnkgVzkxosw1qki6fKPolsntJ0vkiQJOAdaCDe4LrAGuK/tXC1uEiJMHnctzALxE0c4CvxFinN+UACRIBoR0IjURAaAdCIxEQ2oHQ0CTguwcdHQ86nCGtBNcwlZykCrzVwC8R/sfVoFekHKCoW7IIKkMLeInZp+yNpA28ABZiCEDaf5KuB0zeks+A+7Jw5QFI+1fpeggMGvQZ4JmEGAhoYbc3mWE5HDRzwIxAcmwB82PfT4HnwCLmwcj26Lcc85inWF7gI3FJ8blg41nJNduFa9q+jMcwBIq3f6vEzkLhmswmyFi3xHJdRR3ei61UCIV2IDRmFXVrrA3eAdcxuWCIWS1+A3aB9/hZgf5DDLOAjf0/wFvMFDl145JZoAq3HXwYAr8xT6XECEnAI8w/6jqN9oENx7itA/BNwB1kwY+TILoTQhDQAroegs/lF+XF01QIcMEbB7t1suPqzLQJWAXOHOzWyTnmtFspYtgRynEPuNxAb9XKsQqzwN2qxpgqwZuKuiuTYUwE3FDUfa2qIYbVYN7vFHM4U8NOD7ha1hDTWuCMZgS4YFDVENMQ+Kmo+0dVQ0wEfA2hOyYC9hV177l0mnYhtIIpWjQKIaej9SFK4R0Hu3XyytWZE0tDPrCIWcD4Cr6L4LnhoaUxX1jHLGWlwfcRHrXd9OCE6zDaEJLQBx5LggfzOspRIALA3Akuw6FL+ckSJyxNmYQiWpjE2GR2OAdeo3BWYA7zbs4H7N8ikRKQYxkzLPaALyM/stHnXcztrv4WWUJCwsXDX4QDCPtESJvBAAAAAElFTkSuQmCC
// @namespace    https://github.com/zhumengstarsandsea/Lift_Copy_Restrictions
// @version      1.1
// @description:en  A Userscript designed to intelligently bypass copy restrictions on web pages.
// @description:zh-CN  一个旨在智能解除网页复制限制的油猴脚本。
// @author       zhumengstarsandsea
// @license      AGPL-3.0-only
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @description 一个旨在智能解除网页复制限制的油猴脚本。
// @downloadURL https://update.greasyfork.org/scripts/543456/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20Lift%20Copy%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/543456/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%20Lift%20Copy%20Restrictions.meta.js
// ==/UserScript==

'use strict';

(function (global) {
    const currentHostname = global.location.hostname;
    const currentHref = global.location.href;

    // =================================================================================
    // == SECTION 1: 特殊网站名单与专属处理逻辑
    // =================================================================================
    const SPECIAL_SITES = {
        'doc88.com': {
            regexp: /.*doc88\.com\/.+/,
            init: function() {
                global.addEventListener("DOMContentLoaded", () => {
                    const original_html = document.body.innerHTML;
                    setTimeout(() => { document.body.innerHTML = original_html; }, 5000);
                });
            }
        },
        'segmentfault.com': {
            regexp: /.*segmentfault\.com\/.+/,
            init: function() {
                const body = document.querySelector("body");
                if (body) { body.classList.add("_sf_adjust_body"); }
            }
        },
        'wk.baidu.com': {
            regexp: /.*wk\.baidu\.com\/view\/.+/,
            init: function() {
                if (unsafeWindow.sf) { unsafeWindow.sf.canCopy = 1; }
            }
        },
        'zhihu.com': {
            regexp: /.*zhihu\.com\/.*/,
            init: function() {
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === 1 && node.querySelector('.Modal-wrapper')) { node.remove(); }
                        }
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        },
        'docs.qq.com': {
             regexp: /.*docs\.qq\.com\/(doc|sheet|slide)\/.+/,
             init: function() {
                document.addEventListener('DOMContentLoaded', () => {
                    if(unsafeWindow.pad?.editor){
                        unsafeWindow.pad.editor.isCopyable = () => true;
                    }
                });
             }
        },
        'wenku.baidu.com': {
            regexp: /wenku.baidu.com/,
            init: function() {
                // 使用一个内部变量来存储 pageData，防止无限循环
                let _internalPageData = undefined;
                Object.defineProperty(unsafeWindow, 'pageData', {
                    set: (v) => {
                        _internalPageData = v;
                    },
                    get: () => {
                        if (_internalPageData && _internalPageData.vipInfo) {
                            _internalPageData.vipInfo.global_svip_status = 1;
                            _internalPageData.vipInfo.isVip = 1;
                        }
                        return _internalPageData;
                    },
                    configurable: true
                });
            }
        },
        'kdocs.cn': {
             regexp: /.*kdocs\.cn\/.*/,
             init: function() {
                 let _APP = undefined;
                 if (unsafeWindow.APP) {
                    unsafeWindow.APP.canCopy = () => true;
                 } else {
                     Object.defineProperty(unsafeWindow, "APP", {
                         set: (v) => { _APP = v; if(v) v.canCopy = () => true; },
                         get: () => _APP,
                         configurable: true
                     });
                 }
             }
        }
    };


    // =================================================================================
    // == SECTION 2: 通用解除限制功能 (白名单网站使用)
    // =================================================================================

    function applyUniversalMode() {
        enhancerModule.log(`通用模式已为 ${currentHostname} 激活`, 'success');

        const style = 'body, body *{-webkit-user-select:auto!important;-moz-user-select:auto!important;-ms-user-select:auto!important;user-select:auto!important}';
        const styleNode = document.createElement('style');
        styleNode.textContent = style;
        document.head ? document.head.appendChild(styleNode) : document.addEventListener('DOMContentLoaded', () => document.head.appendChild(styleNode));

        const events = ['copy', 'contextmenu', 'selectstart', 'dragstart', 'mousedown', 'keydown'];
        const stopPropagation = e => e.stopPropagation();
        const removeEventListeners = () => {
            events.forEach(event => {
                document.addEventListener(event, stopPropagation, true);
            });
            document.oncontextmenu = document.oncopy = document.onselectstart = null;
        };

        let attempts = 0;
        const intervalId = setInterval(() => {
            removeEventListeners();
            if (++attempts >= 5) clearInterval(intervalId);
        }, 500);
    }


    // =================================================================================
    // == SECTION 3: 菜单命令与主逻辑
    // =================================================================================

    const enhancerModule = {
        log(message, type = 'info') {
            const style = { info: 'color: #03a9f4;', success: 'color: #28a745; font-weight: bold;', warn: 'color: #ffc107;', error: 'color: #dc3545; font-weight: bold;',} [type];
            console.log(`%c[Copying Lifted] ${message}`, style);
        },

        async getWhitelist() {
            return (await GM_getValue('whitelist', []));
        },

        async setWhitelist(list) {
            await GM_setValue('whitelist', list);
        },

        async addToWhitelist() {
            const list = await this.getWhitelist();
            if (!list.includes(currentHostname)) {
                list.push(currentHostname);
                await this.setWhitelist(list);
                this.log(`${currentHostname} 已加入白名单`, 'success');
                global.location.reload();
            }
        },

        async removeFromWhitelist() {
            let list = await this.getWhitelist();
            if (list.includes(currentHostname)) {
                list = list.filter(item => item !== currentHostname);
                await this.setWhitelist(list);
                this.log(`${currentHostname} 已移出白名单`, 'warn');
                global.location.reload();
            }
        },

        async registerMenuCommands(isWhitelisted) {
            if (global.menuIds) {
                global.menuIds.forEach(id => GM_unregisterMenuCommand(id));
            }
            global.menuIds = [];

            if (isWhitelisted) {
                global.menuIds.push(GM_registerMenuCommand('❌ 移出解除名单', this.removeFromWhitelist.bind(this)));
            } else {
                global.menuIds.push(GM_registerMenuCommand('✅ 加入解除名单', this.addToWhitelist.bind(this)));
            }
        },

        async run() {
            // **【v1.1 核心修复】检查是否为特殊网站
            for (const key in SPECIAL_SITES) {
                if (currentHostname.includes(key)) {
                    this.log(`检测到特殊网站: ${key}，执行专属方案`, 'success');
                    if (SPECIAL_SITES[key].init) {
                        try {
                            SPECIAL_SITES[key].init.call(this);
                        } catch (e) {
                            this.log(`在 ${key} 上执行专属方案时出错: ${e}`, 'error');
                        }
                    }
                    // **【v1.1 核心修复】执行完专属方案后，立即返回，不再执行通用逻辑
                    return;
                }
            }

            // 如果不是特殊网站，则继续走白名单逻辑
            const whitelist = await this.getWhitelist();
            const isWhitelisted = whitelist.includes(currentHostname);

            this.registerMenuCommands(isWhitelisted);

            if (isWhitelisted) {
                applyUniversalMode();
            } else {
                this.log(`当前网站 ${currentHostname} 未在白名单中，脚本待命中`, 'info');
            }
        }
    };

    enhancerModule.run();

}(window));