/*!
 * The MIT License
 *
 * Copyright 2021 FToovvr
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// ==UserScript==
// @name        A岛引用查看增强
// @description 让A岛网页端的引用支持嵌套查看、固定、折叠等功能
// @namespace   http://tampermonkey.net/
// @include     /^https?://(www\.)?(adnmb\d*\.com|tnmb\.org|nimingban\.(org|xyz)|nmbxd\d*.com)/.*$/
// @homepageURL https://github.com/FToovvr/adnmb-reference-enhancement.user.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @author      FToovvr
// @license     MIT; https://opensource.org/licenses/MIT
// @version     0.3.7.4
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423659/A%E5%B2%9B%E5%BC%95%E7%94%A8%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/423659/A%E5%B2%9B%E5%BC%95%E7%94%A8%E6%9F%A5%E7%9C%8B%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class ViewHelper {
        static getRefLinkByViewId(viewId) {
            return document.querySelector(`.fto-ref-link[data-view-id="${viewId}"]`);
        }
        static getClosestThreadElement(currentElement) {
            return currentElement.closest('.h-threads-item[data-threads-id]');
        }
        static addStyle(styleText, id) {
            const style = document.createElement('style');
            style.id = id;
            style.classList.add('fto-style');
            // TODO: fade out
            style.append(styleText);
            document.head.append(style);
        }
        static getRefLinks(elem) {
            return elem.querySelectorAll('font[color="#789922"]');
        }
    }

    class Utils {
        // https://stackoverflow.com/a/59837035
        static generateViewID() {
            Utils.currentGeneratedViewID += 1;
            // return String(`${Math.random().toString(36).replace('0.', '')}.${Utils.currentGeneratedViewID}.${(new Date()).getTime()}`);
            return String(Utils.currentGeneratedViewID);
        }
        static insertAfter(node, newNode) {
            node.parentNode.insertBefore(newNode, node.nextSibling);
        }
        // https://stackoverflow.com/a/26230989
        static getCoords(elem) {
            const box = elem.getBoundingClientRect();
            const body = document.body;
            const docEl = document.documentElement;
            const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
            const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
            const clientTop = docEl.clientTop || body.clientTop || 0;
            const clientLeft = docEl.clientLeft || body.clientLeft || 0;
            const top = box.top + scrollTop - clientTop;
            const left = box.left + scrollLeft - clientLeft;
            return { top: Math.round(top), left: Math.round(left) };
        }
    }
    Utils.currentGeneratedViewID = 0;

    class BaseItem {
        get countOfAncestorsWithSameContent() {
            let n = 0;
            for (let item = this.parentItem; item; item = item.parentItem) {
                if (item.postId === this.postId) {
                    n++;
                }
            }
            return n;
        }
    }

    class BaseRawItem extends BaseItem {
        constructor({ elem }) {
            super();
            this.elem = elem;
        }
        get postId() {
            return Number(this.elem.dataset.threadsId);
        }
        get postOwnerId() {
            const uidElem = this.elem.querySelector('.h-threads-info-uid');
            const uid = uidElem.textContent;
            return /^ID:(.*)$/.exec(uid)[1];
        }
        get belongsToThreadId() {
            const idElem = this.elem.querySelector('.h-threads-info-id');
            const link = idElem.getAttribute('href');
            const id = /^.*\/t\/(\d*).*$/.exec(link)[1];
            return Number(id);
        }
        get refLinks() {
            return ViewHelper.getRefLinks(this.elem);
        }
    }

    class ThreadItem extends BaseRawItem {
        constructor({ elem }) {
            console.assert(!!elem.querySelector(':scope > .h-threads-item-main'));
            super({ elem });
        }
        get parentItem() {
            return null;
        }
        createPseudoRefContentClone() {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('h-threads-item');
            const itemRefDiv = document.createElement('div');
            itemRefDiv.classList.add('h-threads-item-reply', 'h-threads-item-ref');
            itemDiv.append(itemRefDiv);
            const itemMainDiv = this.elem.querySelector('.h-threads-item-main')
                .cloneNode(true);
            itemMainDiv.className = '';
            itemMainDiv.classList.add('h-threads-item-reply-main');
            itemRefDiv.append(itemMainDiv);
            const infoDiv = itemMainDiv.querySelector('.h-threads-info');
            try { // 尝试修正几个按钮的位置。以后如果A岛自己修正了这里就会抛异常
                const messedUpDiv = infoDiv.querySelector('.h-admin-tool').closest('.h-threads-info-report-btn');
                if (!messedUpDiv) { // 版块页面里的各个按钮没搞砸
                    infoDiv.querySelectorAll('.h-threads-info-report-btn a').forEach((aElem) => {
                        if (aElem.textContent !== "举报") {
                            aElem.closest('.h-threads-info-report-btn').remove();
                        }
                    });
                    infoDiv.querySelector('.h-threads-info-reply-btn').remove();
                }
                else { // 串内容页面的各个按钮搞砸了
                    infoDiv.append('', messedUpDiv.querySelector('.h-threads-info-id'), '', messedUpDiv.querySelector('.h-admin-tool'));
                    messedUpDiv.remove();
                }
            }
            catch (e) {
                console.log(e);
            }
            return itemDiv;
        }
        get responses() {
            const self = this;
            return (function* () {
                for (const responseItemElem of Array.from(self.elem.querySelectorAll('.h-threads-item-replys .h-threads-item-reply'))) {
                    yield new ResponseItem({ elem: responseItemElem });
                }
            })();
        }
    }

    class ResponseItem extends BaseRawItem {
        constructor({ elem }) {
            console.assert(elem.classList.contains('h-threads-item-reply'));
            super({ elem });
        }
        get parentItem() {
            const parent = this.elem.parentElement;
            const threadElem = ViewHelper.getClosestThreadElement(parent);
            if (threadElem) {
                return new ThreadItem({ elem: threadElem });
            }
            return null;
        }
        createPseudoRefContentClone() {
            const div = document.createElement('div');
            div.classList.add('h-threads-item');
            const itemElem = this.elem.cloneNode(true);
            itemElem.classList.add('h-threads-item-ref');
            itemElem.querySelector('.h-threads-item-reply-icon').remove();
            itemElem.querySelectorAll('.uk-text-primary').forEach((labelElem) => {
                if (labelElem.textContent === "(PO主)") {
                    labelElem.remove();
                }
            });
            div.append(itemElem);
            return div;
        }
    }

    var configWindowStyle = "@charset \"UTF-8\";* #fto-config-window-reference-enhancement_autoOpenOperation_var:before{content:\"(暂不建议启用)\";font-size:xx-small}* #fto-config-window-reference-enhancement_autoOpenDepthLimit_var input,* #fto-config-window-reference-enhancement_autoOpenDepthLimit_var label,* #fto-config-window-reference-enhancement_autoOpenOtherRefViewsAfterOpenedOneWithSameRef_var input,* #fto-config-window-reference-enhancement_autoOpenOtherRefViewsAfterOpenedOneWithSameRef_var label{text-decoration:line-through}* #fto-config-window-reference-enhancement_autoOpenDepthLimit_var:before,* #fto-config-window-reference-enhancement_autoOpenOtherRefViewsAfterOpenedOneWithSameRef_var:before{content:\"(未实现)\";font-size:xx-small}#fto-config-window-reference-enhancement{border:1px solid #000;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;left:50%;max-height:80%;max-width:80%;overflow:scroll;padding:12px;position:fixed;top:50%;transform:translate(-50%,-50%);width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;z-index:9999}#fto-config-window-reference-enhancement #fto-config-window-reference-enhancement_wrapper{align-items:center;display:flex;flex-direction:column;flex-wrap:wrap;height:450px;justify-content:flex-start;width:800px}#fto-config-window-reference-enhancement #fto-config-window-reference-enhancement_wrapper>*{width:45%}#fto-config-window-reference-enhancement .config_var{display:flex;justify-content:space-between}#fto-config-window-reference-enhancement .config_var>label{min-width:-webkit-fit-content;min-width:-moz-fit-content;min-width:fit-content}#fto-config-window-reference-enhancement .config_var>input[type=text]{flex-grow:1;max-width:60px;text-align:right}#fto-config-window-reference-enhancement .config_var :nth-child(2){text-align:right}#fto-config-window-reference-enhancement .config_var :nth-child(2) input[type=checkbox]~:before,#fto-config-window-reference-enhancement .config_var :nth-child(2) input[type=radio]~:before{content:\"\\A\";white-space:pre}";

    class AutoOpenConfig {
        constructor(target, viewStatusAfterOpened, depthLimit, openOtherRefViewsAfterOpenedOneWithSameRef) {
            this.target = target;
            this.viewStatusAfterOpened = viewStatusAfterOpened;
            this.depthLimit = depthLimit;
            this.openOtherRefViewsAfterOpenedOneWithSameRef = openOtherRefViewsAfterOpenedOneWithSameRef;
        }
    }

    /// <reference path="../types/GM_config/gm_config.js" />
    function canConfigurate() {
        return typeof GM_configStruct !== 'undefined';
    }
    class Configurations {
        constructor() {
            this.id = 'fto-config-window-reference-enhancement';
            this.styleId = 'fto-style-config-window-reference-enhancement';
            this.onConfigurationChangeCallbacks = [];
            this.defaults = {
                // 折叠时保持的高度，低于此高度将不可折叠
                collapsedHeight: 80,
                // 悬浮时引用内容的不透明度
                floatingOpacity: 100,
                // 悬浮淡入的时长（暂不支持淡出）
                fadingDuration: 0,
                //
                displayOpenedRefLinkInItalics: true,
                //
                onHoverOnRefLink: "悬浮展现引用内容",
                // 如为真，在固定时点击图钉按钮会直接关闭引用内容，而非转为悬浮
                onClickPinOnOpenRefView: "悬浮引用视图",
                autoOpenOperation: "无行为",
                autoOpenDepthLimit: 1,
                autoOpenOtherRefViewsAfterOpenedOneWithSameRef: false,
                // 获取引用内容多少毫秒算超时
                refFetchingTimeout: 10000,
                // 在内容成功加载后是否还显示刷新按钮
                showRefreshButtonEvenIfRefContentLoaded: false,
                autoLoadNextPage: false,
                hideSageContent: false,
                openAdminSageContent: true,
            };
            if (!canConfigurate()) {
                return;
            }
            ViewHelper.addStyle(configWindowStyle, this.styleId);
            this.gmc = new GM_configStruct({
                id: this.id,
                title: "「A岛引用查看增强」 用户脚本 设置",
                fields: {
                    collapsedHeight: {
                        section: ["引用视图", "外观表现"],
                        label: "折叠时高度（px）",
                        labelPos: 'left',
                        type: 'float',
                        title: "引用视图被折叠后保持的高度。"
                            + "低于此高度的引用内容不可折叠。",
                        default: 80,
                    },
                    floatingOpacity: {
                        label: "悬浮不透明度（%）",
                        labelPos: 'left',
                        type: 'float',
                        title: "悬浮时引用视图的不透明度。",
                        default: 100,
                    },
                    fadingDuration: {
                        label: "悬浮淡入时长（毫秒）",
                        labelPos: 'left',
                        type: 'float',
                        title: "为什么只有淡入？因为淡出的代码不能一步到位，摸了 (ゝ∀･)",
                        default: 0,
                    },
                    displayOpenedRefLinkInItalics: {
                        label: "以斜体显示视图固定的引用链接",
                        labelPos: 'left',
                        type: 'checkbox',
                        default: false,
                    },
                    onHoverOnRefLink: {
                        section: [null, "行为"],
                        label: "当鼠标位于引用链接上时…",
                        labelPos: 'left',
                        type: 'radio',
                        options: ["无行为", "悬浮展现引用内容"],
                        default: "悬浮展现引用内容",
                    },
                    onClickPinOnOpenRefView: {
                        label: "在引用视图固定时点击「📌」…",
                        labelPos: 'left',
                        type: 'radio',
                        options: ["悬浮引用视图", "关闭引用视图"],
                        default: "悬浮引用视图",
                    },
                    autoOpenOperation: {
                        section: [null, "自动固定"],
                        label: "对于内容已有缓存的引用视图…",
                        labelPos: 'left',
                        type: 'radio',
                        title: "",
                        options: ["无行为", "自动固定并折叠", "自动固定并展开"],
                        default: "无行为",
                    },
                    autoOpenDepthLimit: {
                        label: "自动固定的最大深入层数（「0」为不限）",
                        labelPos: 'left',
                        type: 'int',
                        title: "",
                        default: 1,
                    },
                    autoOpenOtherRefViewsAfterOpenedOneWithSameRef: {
                        label: "固定一个引用视图后，将其他相同引用的引用视图也固定",
                        labelPos: 'left',
                        type: 'checkbox',
                        title: "",
                        default: false,
                    },
                    refFetchingTimeout: {
                        section: "引用内容加载",
                        label: "超时时限（毫秒）（「0」为不限）",
                        labelPos: 'left',
                        type: 'float',
                        title: "获取内容多久算超时。对本脚本获取内容操作生效。",
                        default: 10000,
                    },
                    showRefreshButtonEvenIfRefContentLoaded: {
                        label: "总是显示刷新按钮",
                        labelPos: 'left',
                        type: 'checkbox',
                        title: "即使引用内容成功加载，也显示刷新按钮。"
                            + "无论选定与否，目前都不会在加载途中显示刷新按钮。",
                        default: false,
                    },
                    autoLoadNextPage: {
                        section: ["兼并不兼容脚本功能", "页面自动拼接"],
                        label: "自动拼接下一页的内容",
                        labelPos: 'left',
                        type: 'checkbox',
                        default: false,
                    },
                    hideSageContent: {
                        section: [null, 'SAGE 内容隐藏'],
                        label: "隐藏标为 SAGE 的内容",
                        labelPos: 'left',
                        type: 'checkbox',
                        default: false,
                    },
                    openAdminSageContent: {
                        label: "默认展开红名所发的标为 SAGE 的内容",
                        labelPos: 'left',
                        type: 'checkbox',
                        default: true,
                    }
                },
                frame: (() => {
                    const frame = document.createElement('div');
                    frame.style.display = 'none';
                    document.body.append(frame);
                    return frame;
                })(),
                events: {
                    save: () => {
                        for (const fn of this.onConfigurationChangeCallbacks) {
                            fn();
                        }
                    },
                    open: () => {
                        const frame = this.gmc.frame;
                        frame.setAttribute('style', '');
                        const header = frame.querySelector('.config_header');
                        header.style.padding = '6px 0';
                        frame.prepend(header);
                        frame.querySelector('#fto-config-window-reference-enhancement_saveBtn').textContent = "保存";
                        frame.querySelector('#fto-config-window-reference-enhancement_closeBtn').textContent = "关闭";
                        frame.querySelector('#fto-config-window-reference-enhancement_resetLink').textContent = "将所有设置重置为默认状态";
                    },
                },
            });
        }
        openConfigurationWindow() {
            this.gmc.open();
        }
        onConfigurationChange(fn) {
            this.onConfigurationChangeCallbacks.push(fn);
        }
        getValue(name) {
            return canConfigurate() ? this.gmc.get(name) : null;
        }
        get collapsedHeight() {
            var _a;
            return (_a = this.getValue('collapsedHeight')) !== null && _a !== void 0 ? _a : this.defaults.collapsedHeight;
        }
        get floatingOpacity() {
            var _a;
            return (_a = this.getValue('floatingOpacity')) !== null && _a !== void 0 ? _a : this.defaults.floatingOpacity;
        }
        get fadingDuration() {
            var _a;
            return (_a = this.getValue('fadingDuration')) !== null && _a !== void 0 ? _a : this.defaults.fadingDuration;
        }
        get displayOpenedRefLinkInItalics() {
            var _a;
            return (_a = this.getValue('displayOpenedRefLinkInItalics')) !== null && _a !== void 0 ? _a : this.defaults.displayOpenedRefLinkInItalics;
        }
        get hoverRefLinkToFloatRefView() {
            var _a;
            return ((_a = this.getValue('onHoverOnRefLink')) !== null && _a !== void 0 ? _a : this.defaults.onHoverOnRefLink)
                === "悬浮展现引用内容";
        }
        get clickPinToCloseView() {
            var _a;
            return ((_a = this.getValue('onClickPinOnOpenRefView')) !== null && _a !== void 0 ? _a : this.defaults.onClickPinOnOpenRefView)
                === "关闭引用视图";
        }
        get refFetchingTimeout() {
            var _a;
            return (_a = this.getValue('refFetchingTimeout')) !== null && _a !== void 0 ? _a : this.defaults.refFetchingTimeout;
        }
        get autoOpenConfig() {
            var _a, _b, _c, _d;
            return new AutoOpenConfig((((_a = this.getValue('autoOpenOperation')) !== null && _a !== void 0 ? _a : this.defaults.autoOpenOperation) !== '无行为')
                ? 'ViewsWhoseContentHasBeenCached' : null, (((_b = this.getValue('autoOpenOperation')) !== null && _b !== void 0 ? _b : this.defaults.autoOpenOperation) === '自动固定并展开')
                ? 'open' : 'collapsed', (_c = this.getValue('autoOpenDepthLimit')) !== null && _c !== void 0 ? _c : this.defaults.autoOpenDepthLimit, (_d = this.getValue('autoOpenOtherRefViewsAfterOpenedOneWithSameRef')) !== null && _d !== void 0 ? _d : this.defaults.autoOpenOtherRefViewsAfterOpenedOneWithSameRef);
        }
        get showRefreshButtonEvenIfRefContentLoaded() {
            var _a;
            return (_a = this.getValue('showRefreshButtonEvenIfRefContentLoaded')) !== null && _a !== void 0 ? _a : this.defaults.showRefreshButtonEvenIfRefContentLoaded;
        }
        get autoLoadNextPage() {
            var _a;
            return (_a = this.getValue('autoLoadNextPage')) !== null && _a !== void 0 ? _a : this.defaults.autoLoadNextPage;
        }
        get hideSageContent() {
            var _a;
            return (_a = this.getValue('hideSageContent')) !== null && _a !== void 0 ? _a : this.defaults.hideSageContent;
        }
        get openAdminSageContent() {
            var _a;
            return (_a = this.getValue('openAdminSageContent')) !== null && _a !== void 0 ? _a : this.defaults.openAdminSageContent;
        }
    }
    var configurations = new Configurations();

    const refItemClassName = 'fto-ref-view';
    class RefItem extends BaseItem {
        constructor({ refId = null, elem = null }) {
            super();
            console.assert(refId !== null || elem != null);
            if (elem) {
                this.elem = elem;
            }
            else {
                this.elem = document.createElement('div');
            }
            if (!this.elem.classList.contains(refItemClassName)) {
                this.elem.classList.add(refItemClassName);
                this.elem.dataset.viewId = Utils.generateViewID();
            }
            if (refId) {
                console.assert(!this.elem.dataset.refId);
                this.elem.dataset.refId = String(refId);
            }
        }
        static findItemByViewId(viewId) {
            const elem = document.querySelector(`.${refItemClassName}[data-view-id="${viewId}"]`);
            return elem ? new RefItem({ elem: elem }) : null;
        }
        static findClosestItem(currentElem) {
            const elem = currentElem.closest(`.${refItemClassName}`);
            return elem ? new RefItem({ elem: elem }) : null;
        }
        static contentExists(elem) {
            return /No.\d+/.test(elem.querySelector('.h-threads-info-id').textContent);
        }
        mount(targetLinkElem, loadingContentCallback) {
            console.assert(!this.linkElem);
            console.assert(!targetLinkElem.dataset.viewId);
            targetLinkElem.dataset.viewId = this.viewId;
            this.elem.style.setProperty('--offset-left', `${Utils.getCoords(targetLinkElem).left}px`);
            Utils.insertAfter(targetLinkElem, this.elem);
            this.displayStatus = 'closed';
            this.addMouseHoveringEventListeners(loadingContentCallback);
            this.addMouseClickingEventListeners(loadingContentCallback);
        }
        addMouseHoveringEventListeners(loadingContentCallback) {
            // 处理悬浮
            this.elem.addEventListener('mouseenter', () => {
                this.isHovering = true;
            });
            this.linkElem.addEventListener('mouseenter', () => {
                if (this.displayStatus !== 'closed') {
                    this.isHovering = true;
                    return;
                }
                else if (configurations.hoverRefLinkToFloatRefView) {
                    this.displayStatus = 'floating';
                    this.isHovering = true;
                    loadingContentCallback(this, this.postId);
                }
            });
            for (const eventElem of [this.linkElem, this.elem]) {
                eventElem.addEventListener('mouseleave', () => {
                    if (this.displayStatus !== 'floating') {
                        return;
                    }
                    this.isHovering = false;
                    (() => __awaiter(this, void 0, void 0, function* () {
                        setTimeout(() => {
                            if (!this.isHovering) {
                                this.displayStatus = 'closed';
                            }
                        }, 200);
                    }))();
                });
            }
        }
        addMouseClickingEventListeners(loadRefContentCallback) {
            // 处理折叠
            // TODO: 链接这部分应该移到 BaseRawItem 之类的地方
            this.linkElem.addEventListener('click', () => {
                if (this.parentItem instanceof RefItem) {
                    return;
                }
                if (this.loadingStatus === 'empty') {
                    loadRefContentCallback(this, this.postId);
                }
                if (this.displayStatus === 'open') {
                    this.displayStatus = 'collapsed';
                }
                else {
                    this.displayStatus = 'open';
                }
            });
            if (RefItem.addedClickEventListener) {
                return;
            }
            RefItem.addedClickEventListener = true;
            document.body.addEventListener('click', (e) => {
                // 会导致展开的内容：正文文本/空白、头部空白、点击后会展开的引用链接、点击后会固定的图钉按钮
                const targetElem = e.target;
                const thisElem = targetElem.closest('.fto-ref-view');
                if (!thisElem) {
                    return;
                }
                const _this = RefItem.findItemByViewId(thisElem.dataset.viewId);
                let shouldOpen; // 有可能导致高度改变的操作需要设这个值而非直接返回
                let itemToRefresh = _this;
                if (targetElem.classList.contains('fto-ref-link')) {
                    // 如果点的是引用链接，要先处理该链接对应的引用视图。
                    // 需要展开其父视图的情况：点击链接后会固定引用视图
                    const targetItem = RefItem.findItemByViewId(targetElem.dataset.viewId);
                    if (targetItem.loadingStatus === 'empty') {
                        loadRefContentCallback(targetItem, targetItem.postId);
                    }
                    if (targetItem.displayStatus === 'open') {
                        targetItem.displayStatus = 'collapsed';
                        shouldOpen = false;
                    }
                    else {
                        targetItem.displayStatus = 'open';
                        shouldOpen = true;
                    }
                }
                else if (targetElem.classList.contains('fto-ref-view-pin')) {
                    // 如果是为了关闭视图而点击图钉，不会展开
                    shouldOpen = !_this.isPinned; // shouldOpen a.k.a. shouldPin
                    _this.displayStatus = shouldOpen ? 'open' : 'floating';
                    itemToRefresh = _this.parentItem;
                }
                else if (!_this.isPinned) {
                    return;
                }
                else if (
                // 除了引用链接需要展开对应视图外，点击正文文本/空白、头部空白需要展开，
                // 点击图钉按钮需要另行考虑，而除此之外不会展开
                !['h-threads-content', 'h-threads-info', 'fto-ref-view-mask-wrapper']
                    .map((c) => targetElem.classList.contains(c))
                    .reduce((l, r) => l || r)) {
                    return;
                }
                else {
                    shouldOpen = true;
                }
                for (; itemToRefresh instanceof RefItem && itemToRefresh.isPinned; itemToRefresh = itemToRefresh.parentItem) {
                    if (itemToRefresh.displayStatus === 'collapsed') {
                        itemToRefresh.displayStatus = shouldOpen ? 'open' : 'collapsed';
                    }
                }
            });
        }
        get isPinned() {
            return this.displayStatus === 'open' || this.displayStatus === 'collapsed';
        }
        setupContent(content, error, loadRefContentCallback) {
            this.elem.innerHTML = '';
            const maskWrapper = document.createElement('div');
            maskWrapper.classList.add('fto-ref-view-mask-wrapper');
            this.elem.append(maskWrapper);
            if (error) {
                this.loadingStatus = 'failed';
                const errorSpan = document.createElement('span');
                errorSpan.classList.add(`${refItemClassName}-error`);
                errorSpan.textContent = error.message;
                this.elem.append(errorSpan);
            }
            else if (!content) {
                this.loadingStatus = 'empty';
                this.displayStatus = 'closed';
            }
            else {
                this.loadingStatus = 'succeed';
                this.elem.append(content);
                this.setupMarks();
            }
            this.setupButtons(loadRefContentCallback);
        }
        setupMarks() {
            console.assert(this.loadingStatus === 'succeed');
            // 补标 PO
            if (this.placedInThread.postOwnerId === this.postOwnerId) {
                const poLabel = document.createElement('span');
                poLabel.textContent = "(PO主)";
                poLabel.classList.add('uk-text-primary', 'uk-text-small', 'fto-po-label');
                const uidElem = this.elem.querySelector('.h-threads-info .h-threads-info-uid');
                Utils.insertAfter(uidElem, poLabel);
                Utils.insertAfter(uidElem, document.createTextNode(' '));
            }
            // 标「外串」
            if (this.placedInThread.postId !== this.belongsToThreadId) {
                const outerThreadLabel = document.createElement('span');
                outerThreadLabel.textContent = "(外串)";
                outerThreadLabel.classList.add('uk-text-secondary', 'uk-text-small', 'fto-outer-thread-label');
                const idElem = this.elem.querySelector('.h-threads-info .h-threads-info-id');
                idElem.append(' ', outerThreadLabel);
            }
        }
        setupButtons(loadRefContentCallback) {
            let infoElem;
            switch (this.loadingStatus) {
                case 'empty':
                    return;
                case 'loading':
                    infoElem = this.elem.querySelector(`.${refItemClassName}-loading`);
                    break;
                case 'succeed':
                    infoElem = this.elem.querySelector('.h-threads-info');
                    break;
                case 'failed':
                    infoElem = this.elem.querySelector(`.${refItemClassName}-error`);
                    break;
            }
            const buttonListSpan = document.createElement('span');
            buttonListSpan.classList.add('fto-ref-view-button-list');
            // 图钉📌按钮
            const pinSpan = document.createElement('span');
            pinSpan.classList.add('fto-ref-view-pin', 'fto-ref-view-button');
            pinSpan.textContent = "📌";
            buttonListSpan.append(pinSpan);
            // 刷新🔄按钮
            if (loadRefContentCallback) {
                const refreshSpan = document.createElement('span');
                refreshSpan.classList.add('fto-ref-view-refresh', 'fto-ref-view-button');
                refreshSpan.textContent = "🔄";
                refreshSpan.addEventListener('click', () => {
                    loadRefContentCallback(this, this.postId, true);
                });
                Utils.insertAfter(pinSpan, refreshSpan);
                buttonListSpan.append(refreshSpan);
            }
            infoElem.prepend(buttonListSpan);
        }
        setupLoading() {
            const loadingSpan = document.createElement('span');
            loadingSpan.classList.add(`${refItemClassName}-loading`);
            const loadingTextSpan = document.createElement('span');
            loadingTextSpan.classList.add(`${refItemClassName}-loading-text`);
            loadingTextSpan.dataset.waitedMilliseconds = '0';
            loadingTextSpan.textContent = "加载中…";
            loadingSpan.append(loadingTextSpan);
            this.elem.innerHTML = '';
            this.elem.append(loadingSpan);
            this.setupButtons(null);
        }
        set loadingSpentTime(spentMs) {
            this.loadingStatus = 'loading';
            this.elem.querySelector(`.${refItemClassName}-loading-text`)
                .textContent = `加载中… ${(spentMs / 1000.0).toFixed(2)}s`;
        }
        get viewId() {
            return this.elem.dataset.viewId;
        }
        get linkElem() {
            return ViewHelper.getRefLinkByViewId(this.viewId);
        }
        get postId() {
            return Number(this.elem.dataset.refId);
        }
        get postOwnerId() {
            const uidElem = this.elem.querySelector('.h-threads-info-uid');
            const uid = uidElem.textContent;
            return /^ID:(.*)$/.exec(uid)[1];
        }
        get belongsToThreadId() {
            const idElem = this.elem.querySelector('.h-threads-info-id');
            const link = idElem.getAttribute('href');
            // hotfix
            let id
            try {
                id = /^.*\/t\/(\d*).*$/.exec(link)[1];
            } catch(e) {
                id = /^\?r=(\d+)$/.exec(link)[1];
            }
            return Number(id);
        }
        get refLinks() {
            return ViewHelper.getRefLinks(this.elem);
        }
        get loadingStatus() {
            if (this.elem.dataset.loadingStatus) {
                return this.elem.dataset.loadingStatus;
            }
            return 'empty';
        }
        set loadingStatus(status) {
            if (status === 'empty') {
                delete this.elem.dataset.loadingStatus;
            }
            const oldLoadingStatus = this.loadingStatus;
            this.elem.dataset.loadingStatus = status;
            if (status === 'loading' && oldLoadingStatus !== 'loading') {
                this.setupLoading();
            }
        }
        get displayStatus() {
            if (this.elem.dataset.displayStatus) {
                return this.elem.dataset.displayStatus;
            }
            return null;
        }
        set displayStatus(status) {
            console.assert(status !== null);
            switch (status) {
                case 'closed':
                case 'floating':
                case 'open':
                    this.elem.dataset.displayStatus = status;
                    break;
                case 'collapsed':
                    if (this.canBeCollapsed) {
                        this.elem.dataset.displayStatus = 'collapsed';
                    }
                    else {
                        this.elem.dataset.displayStatus = 'open';
                    }
                    break;
            }
            switch (this.elem.dataset.displayStatus) {
                case 'closed':
                case 'floating':
                    this.linkElem.dataset.displayStatus = 'closed';
                    break;
                case 'open':
                case 'collapsed':
                    this.linkElem.dataset.displayStatus = 'open';
            }
        }
        get canBeCollapsed() {
            return this.elem.scrollHeight > configurations.collapsedHeight;
        }
        get isHovering() {
            return !!this.linkElem.dataset.isHovering;
        }
        set isHovering(value) {
            if (value) {
                this.linkElem.dataset.isHovering = '1';
            }
            else {
                delete this.linkElem.dataset.isHovering;
            }
        }
        get parentItem() {
            var _a;
            const parent = this.elem.parentElement;
            const parentRefElem = parent.closest(`.${refItemClassName}`);
            if (parentRefElem) {
                return new RefItem({ elem: parentRefElem });
            }
            return (_a = this.placedInRootResponse) !== null && _a !== void 0 ? _a : this.placedInThread;
        }
        get placedInRootResponse() {
            const parent = this.elem.parentElement;
            const responseElem = parent.closest('.h-threads-item-reply');
            if (responseElem) {
                return new ResponseItem({ elem: responseElem });
            }
            return null;
        }
        get placedInThread() {
            const parent = this.elem.parentElement;
            const threadElem = ViewHelper.getClosestThreadElement(parent);
            if (threadElem) {
                return new ThreadItem({ elem: threadElem });
            }
            return null;
        }
    }
    RefItem.addedClickEventListener = false;

    class Model {
        constructor() {
            this.refCache = {};
            this.refsInFetching = new Set();
            this.refSubscriptions = new Map();
        }
        get isSupported() {
            if (!window.indexedDB) {
                return false;
            }
            return true;
        }
        getRefCache(refId) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const [elem, error] = (_a = this.refCache[refId]) !== null && _a !== void 0 ? _a : [null, null];
                if (!elem) {
                    return null;
                }
                return [elem.cloneNode(true), error];
            });
        }
        recordRef(refId, rawItem, error, scope = 'page') {
            return __awaiter(this, void 0, void 0, function* () {
                this.refCache[refId] = [rawItem.cloneNode(true), error];
            });
        }
        subscribeForLoadingItemElement(refId, viewId, ignoresCache = false, doneCallbace, reportSpentTimeCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.refSubscriptions.has(refId)) {
                    this.refSubscriptions.set(refId, new Set());
                }
                this.refSubscriptions.get(refId).add(viewId);
                const cache = ignoresCache ? null : yield this.getRefCache(refId);
                if (cache) {
                    const [itemCache, error] = cache;
                    doneCallbace(new Set([viewId]), itemCache, error);
                }
                else if (!this.refsInFetching.has(refId)) {
                    this.refsInFetching.add(refId);
                    const [item, error2] = yield this.fetchItemElement(refId, viewId, reportSpentTimeCallback);
                    doneCallbace(this.refSubscriptions.get(refId), item, error2);
                    this.refsInFetching.delete(refId);
                }
            });
        }
        fetchItemElement(refId, viewId, reportSpentTimeCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                const itemContainer = document.createElement('div');
                try {
                    const resp = yield Model.fetchWithTimeout(`/Home/Forum/ref?id=${refId}`, (spentMs) => {
                        return reportSpentTimeCallback(viewId, this.refSubscriptions.get(refId), spentMs);
                    });
                    itemContainer.innerHTML = yield resp.text();
                }
                catch (e) {
                    return [null, new Error(Model.fetchErrorToReadableMessage(e))];
                }
                const item = itemContainer.firstElementChild;
                const error = RefItem.contentExists(item) ? null : new Error("引用内容不存在！");
                this.recordRef(refId, item, error, error ? 'page' : 'global');
                return [item, error];
            });
        }
        static fetchWithTimeout(input, reportSpentTimeCallback) {
            return __awaiter(this, void 0, void 0, function* () {
                input = (new URL(input, window.location.href)).href;
                const abortController = new AbortController();
                return Promise.race([
                    fetch(input, { signal: abortController.signal }),
                    new Promise((_, reject) => {
                        let spentMs = 0;
                        const intervalId = setInterval(() => {
                            spentMs += 20;
                            if (configurations.refFetchingTimeout
                                && spentMs >= configurations.refFetchingTimeout) {
                                reject(new Error('Timeout'));
                                abortController.abort();
                                clearInterval(intervalId);
                                return;
                            }
                            const shouldContinue = reportSpentTimeCallback === null || reportSpentTimeCallback === void 0 ? void 0 : reportSpentTimeCallback(spentMs);
                            if (!shouldContinue) {
                                clearInterval(intervalId);
                            }
                        }, 20);
                    }),
                ]);
            });
        }
        static fetchErrorToReadableMessage(e) {
            if (e instanceof Error) {
                if (e.message === 'Timeout') {
                    return `获取引用内容超时！`;
                }
                else {
                    return `获取引用内容失败：${e.toString()}`;
                }
            }
            return `获取引用内容失败：${String(e)}`;
        }
    }

    var additionalStyleText = ".h-threads-content{word-break:break-word}.h-threads-item-ref .h-threads-content{margin:5px 20px}.h-threads-info{font-size:14px;line-height:20px;margin:0}.fto-ref-view[data-display-status=collapsed],.fto-ref-view[data-display-status=open]{display:block}.fto-ref-view[data-display-status=collapsed]+br,.fto-ref-view[data-display-status=open]+br{display:none}.fto-button,.fto-ref-view .fto-ref-view-button{cursor:pointer;font-size:smaller;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.fto-ref-view{background:#f0e0d6;border:1px solid #000;clear:left;margin-left:-5px;margin-right:-40px;max-width:calc(100vw - var(--offset-left) - 35px);position:relative;width:-webkit-max-content;width:-moz-max-content;width:max-content}.fto-ref-view[data-display-status=closed]{border:0;display:inline-block;height:0;margin:0;opacity:0;overflow:hidden;padding:0;width:0}.fto-ref-view[data-display-status=floating]{position:absolute;z-index:999}.fto-ref-view[data-display-status=collapsed]{overflow:hidden;position:static;text-overflow:ellipsis}.fto-ref-view[data-display-status=collapsed]>.fto-ref-view-mask-wrapper{position:relative}.fto-ref-view[data-display-status=collapsed]>.fto-ref-view-mask-wrapper:before{background:linear-gradient(#f0e0d600,#ffeeddcc);content:\"\";height:20px;position:absolute;top:60px;width:100%;z-index:99}.fto-ref-view .fto-ref-view-error{color:red}.fto-ref-view .fto-ref-view-pin{display:inline-block;transform:rotate(-45deg)}.fto-ref-view[data-loading-status=loading] .fto-ref-view-refresh{display:none}.fto-ref-view[data-display-status=floating]>.fto-ref-view-error>.fto-ref-view-button-list>.fto-ref-view-pin,.fto-ref-view[data-display-status=floating]>.fto-ref-view-loading>.fto-ref-view-button-list>.fto-ref-view-pin,.fto-ref-view[data-display-status=floating]>.h-threads-item>.h-threads-item-ref>.h-threads-item-reply-main>.h-threads-info>.fto-ref-view-button-list>.fto-ref-view-pin{filter:grayscale(100%);transform:none}.fto-ref-view[data-display-status=collapsed]>.fto-ref-view-error>.fto-ref-view-button-list>.fto-ref-view-pin:before,.fto-ref-view[data-display-status=collapsed]>.fto-ref-view-loading>.fto-ref-view-button-list>.fto-ref-view-pin:before,.fto-ref-view[data-display-status=collapsed]>.h-threads-item>.h-threads-item-ref>.h-threads-item-reply-main>.h-threads-info>.fto-ref-view-button-list>.fto-ref-view-pin:before{background:linear-gradient(#f0e0d600,#f0e0d6);content:\"\";height:110%;position:absolute;transform:rotate(45deg);width:100%;z-index:999}";

    class Controller {
        constructor(model) {
            this.model = model;
        }
        static makeAdditionalVariableStyleText() {
            let styleText = `
        .fto-ref-view[data-display-status="floating"] {
            opacity: ${configurations.floatingOpacity}%;
            transition: opacity ${configurations.fadingDuration}ms ease-in;
        }

        .fto-ref-view[data-display-status="collapsed"] {
            max-height: ${configurations.collapsedHeight}px;
        }

        .fto-ref-view[data-display-status="closed"] {
            /* transition: opacity ${configurations.fadingDuration}ms ease-out; */
        }
        `;
            if (!configurations.showRefreshButtonEvenIfRefContentLoaded) {
                styleText += `
            .fto-ref-view-refresh {
                display: none;
            }
            .fto-ref-view-error .fto-ref-view-refresh {
                display: inline;
            }
            `;
            }
            if (configurations.displayOpenedRefLinkInItalics) {
                styleText += `
            .fto-ref-link[data-display-status="open"] {
                font-style: italic;
            }
            `;
            }
            return styleText;
        }
        static setupStyle() {
            for (const [styleText, id] of [
                [additionalStyleText, 'fto-style-adnmb-reference-enhancement-fixed'],
                [this.makeAdditionalVariableStyleText(), 'fto-style-adnmb-reference-enhancement-variable'],
            ]) {
                ViewHelper.addStyle(styleText, id);
            }
            configurations.onConfigurationChange(() => {
                const style = document.querySelector('#fto-style-adnmb-reference-enhancement-variable');
                style.innerHTML = '';
                style.append(this.makeAdditionalVariableStyleText());
            });
        }
        setupRoot(root) {
            root.querySelectorAll('.h-threads-item[data-threads-id]').forEach((threadItemElem) => {
                const threadItem = new ThreadItem({ elem: threadItemElem });
                // 将串首加入缓存
                this.model.recordRef(threadItem.postId, threadItem.createPseudoRefContentClone(), null, 'global');
                // 将各回应加入缓存
                for (const response of threadItem.responses) {
                    this.model.recordRef(response.postId, response.createPseudoRefContentClone(), null, 'global');
                }
            });
            this.setupRefLinks(ViewHelper.getRefLinks(root));
        }
        setupContent(item, content, error, parentAutoOpenPromiseResolve) {
            item.setupContent(content, error, this.startLoadingViewContent.bind(this));
            if (item.loadingStatus === 'succeed') {
                this.setupRefLinks(item.refLinks, parentAutoOpenPromiseResolve);
            }
        }
        setupRefLinks(linkElems, parentAutoOpenPromiseResolve = null) {
            if (linkElems.length === 0) {
                parentAutoOpenPromiseResolve === null || parentAutoOpenPromiseResolve === void 0 ? void 0 : parentAutoOpenPromiseResolve();
                return;
            }
            let unfinished = linkElems.length;
            linkElems.forEach(linkElem => {
                (() => __awaiter(this, void 0, void 0, function* () {
                    this.setupRefLink(linkElem, () => {
                        unfinished--;
                        if (unfinished === 0) {
                            parentAutoOpenPromiseResolve === null || parentAutoOpenPromiseResolve === void 0 ? void 0 : parentAutoOpenPromiseResolve();
                        }
                    });
                }))();
            });
        }
        setupRefLink(linkElem, parentAutoOpenPromiseResolve) {
            linkElem.classList.add('fto-ref-link');
            // closed: 无固定显示 view; open: 有固定显示 view
            linkElem.dataset.displayStatus = 'closed';
            const r = /^>>(?:No\.)?(\d+)$/.exec(linkElem.textContent);
            if (!r) {
                parentAutoOpenPromiseResolve === null || parentAutoOpenPromiseResolve === void 0 ? void 0 : parentAutoOpenPromiseResolve();
                return;
            }
            const refId = Number(r[1]);
            linkElem.dataset.refId = String(refId);
            const refView = new RefItem({ refId });
            refView.mount(linkElem, this.startLoadingViewContent.bind(this));
            if (configurations.autoOpenConfig.target === 'ViewsWhoseContentHasBeenCached'
                && refView.countOfAncestorsWithSameContent <= 1) {
                (() => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const [refCache, error] = (_a = yield this.model.getRefCache(refId)) !== null && _a !== void 0 ? _a : [null, null];
                    if (refCache) {
                        yield new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                            refView.displayStatus = 'open';
                            this.setupContent(refView, refCache, error, resolve);
                        }));
                        refView.displayStatus = configurations.autoOpenConfig.viewStatusAfterOpened;
                    }
                    parentAutoOpenPromiseResolve === null || parentAutoOpenPromiseResolve === void 0 ? void 0 : parentAutoOpenPromiseResolve();
                }))();
            }
            else {
                parentAutoOpenPromiseResolve === null || parentAutoOpenPromiseResolve === void 0 ? void 0 : parentAutoOpenPromiseResolve();
            }
        }
        startLoadingViewContent(refItem, refId, forced = false) {
            if (!forced && refItem.loadingStatus === 'succeed') {
                return;
            }
            else if (refItem.loadingStatus === 'loading') { // TODO: 也可以强制从头重新加载？
                return;
            }
            refItem.loadingStatus = 'loading';
            this.model.subscribeForLoadingItemElement(refId, refItem.viewId, forced, (viewIds, content, error) => {
                for (const viewId of viewIds) {
                    const item = RefItem.findItemByViewId(viewId);
                    this.setupContent(item, content ? content.cloneNode(true) : null, error);
                }
            }, (masterViewId, viewIds, spentMs) => {
                const masterItem = RefItem.findItemByViewId(masterViewId);
                if (masterItem.loadingStatus !== 'loading') {
                    return false;
                }
                for (const viewId of viewIds) {
                    const item = RefItem.findItemByViewId(viewId);
                    item.loadingSpentTime = spentMs;
                }
                return true;
            });
        }
    }

    class AutoLoadNextPage {
        constructor(enabled, setupRoot) {
            this.isLoading = false;
            this.hContent = document.querySelector('#h-content');
            this.setupRoot = setupRoot;
            window.addEventListener('scroll', (e) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!enabled()) {
                    return;
                }
                // https://stackoverflow.com/a/40370876
                if ((window.innerHeight + window.pageYOffset) < (document.body.offsetHeight - 2)) {
                    return;
                }
                if (this.isLoading) {
                    return;
                }
                this.isLoading = true;
                let nextPageUrl = null;
                document.querySelectorAll('a[href]:not(.fto-loaded)').forEach((a) => {
                    a = a;
                    if (a.innerHTML === "下一页") {
                        a.classList.add('fto-loaded');
                        nextPageUrl = a.getAttribute('href');
                    }
                });
                if (!nextPageUrl) {
                    return;
                }
                const div = document.createElement('div');
                div.classList.add('uk-container', 'fto-auto-loaded');
                div.dataset.targetUrl = nextPageUrl;
                const pageNumber = Number(((_a = /[?/]page[=/](\d+)/.exec(nextPageUrl)) !== null && _a !== void 0 ? _a : [null, null])[1]);
                div.dataset.pageNumber = String(pageNumber);
                this.hContent.append(document.createElement('hr'), div);
                yield this.loadlContent(div);
                this.isLoading = false;
            }));
        }
        loadlContent(div) {
            return __awaiter(this, void 0, void 0, function* () {
                div.dataset.loadingStatus = 'loading';
                div.textContent = `正在加载第 ${div.dataset.pageNumber} 页…`;
                let resp;
                try {
                    resp = yield Model.fetchWithTimeout(div.dataset.targetUrl, (spentMs) => {
                        if (div.dataset.loadingStatus !== 'loading') {
                            return false;
                        }
                        div.textContent = `正在加载第 ${div.dataset.pageNumber} 页… ${(spentMs / 1000.0).toFixed(2)}s`;
                        return true;
                    });
                }
                catch (e) {
                    div.textContent = Model.fetchErrorToReadableMessage(e);
                    div.dataset.loadingStatus = 'failed';
                    this.prependReloadButton(div);
                    return;
                }
                const domParser = new DOMParser();
                const template = domParser.parseFromString(yield resp.text(), 'text/html');
                const loadedContent = (() => {
                    const ukContainer = template.querySelector('#h-content > .uk-container');
                    if (!ukContainer) {
                        return null;
                    }
                    const threadList = ukContainer.querySelector(':scope > .h-threads-list');
                    if (!threadList) {
                        return null;
                    }
                    return [
                        ukContainer.querySelector('#h-content-top-nav'),
                        threadList,
                        ukContainer.querySelector('.h-pagination'),
                        template.querySelector('#h-footer'),
                    ];
                })();
                div.innerHTML = '';
                if (!loadedContent) {
                    div.dataset.loadingStatus = 'failed';
                    div.textContent = "页面无内容";
                    this.prependReloadButton(div);
                    return;
                }
                window.history.replaceState(null, '', div.dataset.targetUrl);
                div.dataset.loadingStatus = 'succeed';
                if (loadedContent[0]) {
                    div.append(loadedContent[0], document.createElement('hr'));
                }
                div.append(loadedContent[1]);
                if (loadedContent[2]) {
                    div.append(loadedContent[2]);
                }
                if (loadedContent[3]) {
                    const oldFooter = this.hContent.querySelector('#h-footer');
                    if (oldFooter) {
                        oldFooter.id = '';
                        oldFooter.classList.add('fto-old-h-footer');
                    }
                    this.hContent.append(loadedContent[3]);
                }
                this.setupRoot(div);
            });
        }
        prependReloadButton(div) {
            const span = document.createElement('span');
            span.classList.add('fto-button');
            span.textContent = '🔄';
            span.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                // FIXME: 网络异常后 Error 明明被 catch 到了，但是 this.isLoading 没有设回 false
                // if (this.isLoading) {
                //     return;
                // }
                this.isLoading = true;
                yield this.loadlContent(div);
                this.isLoading = false;
            }));
            div.prepend(span);
        }
    }

    class HideSageContent {
        constructor(enabled) {
            ViewHelper.addStyle('', 'fto-style-adnmb-reference-enhancement-other-hide-sage-content');
            this.enabled = enabled;
        }
        get enabled() { return this._enabled; }
        set enabled(enabled) {
            const style = document.querySelector('#fto-style-adnmb-reference-enhancement-other-hide-sage-content');
            if (enabled) {
                style.innerHTML = `
                .fto-force-display-toggle {
                    cursor: pointer;
                }
                .fto-marked-sage .fto-force-display-toggle::before {
                    content: ' 隐藏 ';
                    font-size: small;
                }
                .fto-marked-sage:not(.fto-force-display) .fto-force-display-toggle::before {
                    content: ' 展开 ';
                    font-size: small;
                }
                .fto-marked-sage:not(.fto-force-display) > .h-threads-item-main {
                    display: none;
                }
                .fto-marked-sage:not(.fto-force-display) > .h-threads-tips:not(.uk-text-danger) {
                    display: none;
                }
                .fto-marked-sage:not(.fto-force-display) > .h-threads-item-replys {
                    display: none;
                }
            `;
            }
            else {
                style.innerHTML = `
                .fto-force-display-toggle-wrapper {
                    display: none;
                }
            `;
            }
        }
        setup(root, openRedNameContent) {
            root.querySelectorAll('.uk-icon-thumbs-down').forEach((thumbsDown) => {
                const postItem = thumbsDown.closest('[data-threads-id]');
                if (!postItem) {
                    return;
                }
                if (window.location.pathname.startsWith('/t/') && postItem.classList.contains('h-threads-item')) {
                    // 点进去了 sage 串，不隐藏
                    return;
                }
                if (openRedNameContent && postItem.querySelector('.h-threads-info-uid font[color="red"]')) {
                    postItem.classList.add('fto-force-display');
                }
                postItem.classList.add('fto-marked-sage');
                const toggle = document.createElement('span');
                toggle.classList.add('fto-force-display-toggle');
                toggle.addEventListener('click', (e) => {
                    postItem.classList.toggle('fto-force-display');
                });
                const toggleWrapper = document.createElement('span');
                toggleWrapper.classList.add('fto-force-display-toggle-wrapper');
                toggleWrapper.append('[', toggle, ']');
                const sageTips = thumbsDown.closest('.h-threads-tips');
                sageTips.append('', toggleWrapper);
            });
        }
    }

    function entry() {
        if (window.frameElement) {
            console.log("检测到本脚本在 iframe 中执行，将不继续执行。"
                + "如果您在使用「自动拼接页面」类脚本，新加载的页面中的引用大概率会无法查看（无论是否使用本脚本）。"
                + "为此，本脚本单独实现了「自动拼接页面」功能，您可以在配置窗口中启用。"
                + "请确保在启用该功能的同时在A岛范围内禁用原先的「自动拼接页面」脚本。");
            return;
        }
        if (window.disableAdnmbReferenceViewerEnhancementUserScript) {
            console.log("「A岛引用查看增强」用户脚本被禁用（设有变量 `window.disableAdnmbReferenceViewerEnhancementUserScript`），将终止。");
            return;
        }
        const model = new Model();
        if (!model.isSupported) {
            console.log("浏览器功能不支持「A岛引用查看增强」用户脚本，将终止。");
            return;
        }
        if (/^\/m(obile)?(\/|$)/i.test(window.location.pathname)) {
            console.log("「A岛引用查看增强」用户脚本暂不支持网页「手机版」，将终止。");
            return;
        }
        if (canConfigurate() && typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand("打开配置窗口", () => { configurations.openConfigurationWindow(); }, 'c');
        }
        // 销掉原先的预览方法
        document.querySelectorAll('font[color="#789922"]').forEach((elem) => {
            if (elem.textContent.startsWith('>>')) {
                const newElem = elem.cloneNode(true);
                elem.parentElement.replaceChild(newElem, elem);
            }
        });
        Controller.setupStyle();
        const controller = new Controller(model);
        const hideSageContent = new HideSageContent(configurations.hideSageContent);
        configurations.onConfigurationChange(() => {
            hideSageContent.enabled = configurations.hideSageContent;
        });
        window.fto = {
            AdnmbReferenceViewerEnhancement: {
                debug: { model, controller },
                setup: (document) => {
                    controller.setupRoot(document);
                    hideSageContent.setup(document, configurations.openAdminSageContent);
                },
            },
        };
        window.fto.AdnmbReferenceViewerEnhancement.setup(document);
        new AutoLoadNextPage(() => configurations.autoLoadNextPage, window.fto.AdnmbReferenceViewerEnhancement.setup);
    }
    switch (GM_info.scriptHandler) {
        case "Tampermonkey":
            entry();
            break;
        case "Violentmonkey":
            // @ts-expect-error JQuery
            $(document).ready(entry);
            break;
        case "Greasemonkey":
        default:
            const fn = () => {
                if (unsafeWindow.hasOwnProperty('h')) {
                    entry();
                }
                else {
                    setTimeout(fn, 10);
                }
            };
            setTimeout(fn, 10);
    }

}());
