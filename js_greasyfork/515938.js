// ==UserScript==
// @name         【最强】【最全面】【全网页可用】【持续更新中】解除禁止复制和粘贴限制并支持手动粘贴
// @namespace    http://jiangning_sama/pojie_cpoy.net/
// @version      7.3.3
// @description  ⭐学习通⭐pta⭐csdn⭐飞书云文档⭐破解所有网站【禁止复制】和【禁止粘贴】限制，支持【模拟人工输入】。安装后，打开目标网页即可解除限制。若粘贴解锁不生效，可以使用ctrl+m呼出浮动输入框进行模拟人工输入，详情请阅读下方说明。有疑问或者反馈都可以发我邮箱啊：2697003697@qq.com
// @author       江宁sama
// @match        *://*/*
// @exclude      https://chatgpt.com/*
// @exclude      https://www.bilibili.com/*
// @exclude      https://www.bing.com/*
// @exclude      https://fanyi.*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515938/%E3%80%90%E6%9C%80%E5%BC%BA%E3%80%91%E3%80%90%E6%9C%80%E5%85%A8%E9%9D%A2%E3%80%91%E3%80%90%E5%85%A8%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%94%A8%E3%80%91%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%E3%80%91%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%92%8C%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E5%B9%B6%E6%94%AF%E6%8C%81%E6%89%8B%E5%8A%A8%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/515938/%E3%80%90%E6%9C%80%E5%BC%BA%E3%80%91%E3%80%90%E6%9C%80%E5%85%A8%E9%9D%A2%E3%80%91%E3%80%90%E5%85%A8%E7%BD%91%E9%A1%B5%E5%8F%AF%E7%94%A8%E3%80%91%E3%80%90%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%E3%80%91%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%92%8C%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E5%B9%B6%E6%94%AF%E6%8C%81%E6%89%8B%E5%8A%A8%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

/*
 * 免责声明：
 * 本脚本为教育和学习用途而开发，旨在帮助用户了解网页元素的控制与交互操作。
 * 使用本脚本即表示用户同意自行承担由此带来的一切风险和后果，开发者不对因使用本脚本
 * 造成的任何直接或间接损失负责。
 * 
 * 请勿使用本脚本用于任何违反服务条款、侵害他人权益或违反当地法律法规的行为。
 * 建议仅在个人测试环境中使用，不建议用于生产环境或未经授权的网页。
 * 
 * 使用前请务必仔细阅读本免责声明，开发者保留随时更改或终止该脚本的权利。
 */

(function () {
    'use strict';

    const isFeishuPage = /feishu\.cn|larkoffice\.com/.test(window.location.hostname);
    const isChaoxingPage = /chaoxing\.com/.test(window.location.hostname);  // 判断是否是超星网课页面
    const isPintiaPage = /pintia\.cn/.test(window.location.hostname);  // 判断是否是Pintia页面

    // 通用工具函数
    const utils = {
        /**
         * 移除VIP遮罩层
         */
        removeVipMask: () => {
            const masks = document.querySelectorAll('div[class*="hide-article"], div[class*="overlay"], div[class*="mask"]');
            masks.forEach(mask => {
                mask.style.display = 'none';
                mask.remove();
            });
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'auto';
        },

        /**
         * 强制移除所有元素的样式限制
         */
        forceRemoveStyles: () => {
            document.querySelectorAll('*').forEach(el => {
                el.style.userSelect = 'auto';
                el.style.pointerEvents = 'auto';
            });
        },

        /**
         * 动态监听并移除VIP遮罩层
         */
        observeVipMask: () => {
            const observer = new MutationObserver(() => utils.removeVipMask());
            observer.observe(document.body, { childList: true, subtree: true });
            utils.removeVipMask();
        },

        /**
         * 移除特定事件监听器
         */
        removeSpecificEventListeners: () => {
            ['copy', 'cut', 'paste', 'contextmenu', 'selectstart'].forEach(event => {
                document.body.addEventListener(event, e => e.stopImmediatePropagation(), true);
            });
        },

        /**
         * 解锁CSS限制
         */
        unlockCssRestrictions: () => {
            document.querySelectorAll('*:not([data-unlock-applied])').forEach(el => {
                el.style.userSelect = 'auto';
                el.style.pointerEvents = 'auto';
                el.setAttribute('data-unlock-applied', 'true');
            });
        },

        /**
         * 拦截XHR请求并修改响应
         */
        interceptXHR: () => {
            const rawOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                this.addEventListener('readystatechange', () => {
                    if (this.readyState === 4) {
                        try {
                            const jsonResponse = JSON.parse(this.responseText);
                            if (jsonResponse.data && jsonResponse.data.actions && jsonResponse.data.actions.copy !== 1) {
                                jsonResponse.data.actions.copy = 1;
                                Object.defineProperty(this, 'responseText', { value: JSON.stringify(jsonResponse) });
                                Object.defineProperty(this, 'response', { value: jsonResponse });
                            }
                        } catch (e) {
                            console.error('Failed to modify response:', e);
                        }
                    }
                }, false);
                rawOpen.call(this, method, url, ...rest);
            };
        },

        /**
         * 自定义复制处理
         */
        customCopyHandler: () => {
            document.addEventListener('keydown', e => {
                if (e.ctrlKey && e.key === 'c') {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        document.execCommand('copy');
                        console.log("Content copied to clipboard!");
                    } catch (err) {
                        console.error("Copy operation failed:", err);
                    }
                }
            }, true);
        }
    };

    // 飞书专用功能
    const feishuScript = () => {
        const overrideEventListeners = () => {
            const rawAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function (type, listener, options) {
                if (['copy', 'contextmenu'].includes(type)) {
                    rawAddEventListener.call(this, type, event => {
                        event.stopImmediatePropagation();
                        if (type === 'contextmenu') {
                            return listener(event);
                        }
                    }, options);
                    return;
                }
                rawAddEventListener.call(this, type, listener, options);
            };
        };

        const overrideXHR = () => {
            utils.interceptXHR();
        };

        overrideEventListeners();
        overrideXHR();
    };

    // Pintia专用功能
    const pintiaScript = () => {
        // 解锁文本选择功能
        const enableTextSelection = () => {
            document.body.style.userSelect = 'text';
            document.body.style.webkitUserSelect = 'text';
            document.body.style.msUserSelect = 'text';
            document.body.style.MozUserSelect = 'text';
        };

        // 移除特定事件监听器
        const removeEventListeners = (element, events) => {
            events.forEach(event => {
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
            });
        };

        // 解锁复制、粘贴和拖放
        const unlockClipboardRestrictions = () => {
            ['copy', 'paste', 'drop', 'beforeinput'].forEach(eventName => {
                document.addEventListener(eventName, (e) => {
                    e.stopPropagation(); // 仅阻止限制相关的事件传播
                }, true);
            });
        };

        // 兼容动态加载的内容
        const observeDOMChanges = () => {
            const observer = new MutationObserver(() => {
                enableTextSelection();
                unlockClipboardRestrictions();
            });

            observer.observe(document, { childList: true, subtree: true });
        };

        // 初始化解锁
        const initUnlock = () => {
            enableTextSelection();
            unlockClipboardRestrictions();
            observeDOMChanges();
        };

        // 确保脚本延迟加载，避免与页面初始化冲突
        window.addEventListener('load', () => {
            initUnlock();
        });
    };

    // 通用解锁功能
    const universalUnlockScript = () => {
        utils.observeVipMask();
        utils.removeSpecificEventListeners();
        utils.unlockCssRestrictions();
        utils.interceptXHR();
        utils.customCopyHandler();
    };

    // 手动粘贴功能
    let targetElement = null;

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            targetElement = document.activeElement;
            utils.createFloatingInputBox();
        }
    });

    utils.createFloatingInputBox = () => {
        if (document.getElementById('floatingInputBox')) return;

        const floatingBox = document.createElement('div');
        floatingBox.id = 'floatingInputBox';
        Object.assign(floatingBox.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '300px',
            padding: '10px',
            backgroundColor: 'white',
            border: '1px solid black',
            zIndex: '10000'
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginBottom = '10px';
        closeButton.onclick = () => document.body.removeChild(floatingBox);

        const textarea = document.createElement('textarea');
        Object.assign(textarea.style, {
            width: '100%',
            height: '80px'
        });
        textarea.placeholder = '在此粘贴内容，然后按 Enter';
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const text = textarea.value;
                document.body.removeChild(floatingBox);
                if (targetElement) {
                    utils.typeTextSlowly(targetElement, text);
                }
            } else if (e.key === 'Escape') {
                document.body.removeChild(floatingBox);
            }
        });

        floatingBox.appendChild(closeButton);
        floatingBox.appendChild(textarea);
        document.body.appendChild(floatingBox);
        textarea.focus();
    };

    utils.typeTextSlowly = (element, text) => {
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                utils.insertChar(element, text[i]);
                i++;
                requestAnimationFrame(typeChar);
            }
        }
        typeChar();
    };

    utils.insertChar = (element, char) => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.focus();
            document.execCommand('insertText', false, char);
        } else if (element.isContentEditable) {
            element.focus();
            document.execCommand('insertText', false, char);
        }
    };

    window.addEventListener('load', function() {
        // 针对超星网课页面的功能
        if (isChaoxingPage) {
            $(function() {
                setTimeout(() => {
                    $("body").removeAttr("onselectstart");
                    $("html").css("user-select", "unset");
                    UE.EventBase.prototype.fireEvent = function() {
                        return null;
                    };
                }, 1000);

                if (window.location.href.includes("newMooc=true")) {
                    $("<div style='background: #86b430;display:inline;border: solid 1px #6f8e30;color: #FFF;padding: 2px 10px;cursor: pointer;' onclick='copyContentNew(event)'>复制题目</div>").insertAfter($(".colorShallow"));
                } else {
                    $("<div style='background: #86b430;display:inline;border: solid 1px #6f8e30;color: #FFF;padding: 2px 10px;cursor: pointer;' onclick='copyContentOld(event)'>复制题目</div>").insertAfter($(".Cy_TItle").find("p"));
                }

                window.copyContentOld = function(event) {
                    setTimeout(() => {
                        var range = document.createRange();
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        range.selectNodeContents($(event.srcElement.parentNode).find("p")[0]);
                        selection.addRange(range);
                        document.execCommand('copy');
                        selection.removeAllRanges();
                        let tips = $("<span style='color:red'>复制成功</span>").appendTo($(event.srcElement.parentNode));
                        setTimeout(() => {
                            tips.remove();
                        }, 1000);
                    }, 1000);
                };

                window.copyContentNew = function(event) {
                    setTimeout(() => {
                        var range = document.createRange();
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        range.selectNodeContents($(event.srcElement.nextSibling)[0]);
                        selection.addRange(range);
                        document.execCommand('copy');
                        selection.removeAllRanges();
                        let tips = $("<span style='color:red'>复制成功</span>").insertAfter($(event.srcElement));
                        setTimeout(() => {
                            tips.remove();
                        }, 1000);
                    }, 1000);
                };
            });
        }
    });

    // 初始化
    document.addEventListener('DOMContentLoaded', () => {
        if (isFeishuPage) {
            feishuScript();
        } else if (isPintiaPage) {
            pintiaScript();
        } else {
            universalUnlockScript();
        }
    });
})();