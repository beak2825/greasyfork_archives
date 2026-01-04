// ==UserScript==
// @name         Acfun Extension
// @namespace    https://github.com/aoi-umi
// @version      0.4
// @description  acfun插件
// @author       aoi-umi
// @match        *.acfun.cn/*
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434637/Acfun%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/434637/Acfun%20Extension.meta.js
// ==/UserScript==
(function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var config = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.prefix = void 0;
	exports.prefix = 'ac-ext';

	});

	unwrapExports(config);
	config.prefix;

	var utils = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.insert = exports.wait = exports.clipboardCopy = void 0;
	const clipboardCopy = (data) => {
	    return navigator && navigator.clipboard && navigator.clipboard.writeText(data);
	};
	exports.clipboardCopy = clipboardCopy;
	const wait = (ms) => {
	    return new Promise((resolve) => {
	        setTimeout(() => {
	            resolve();
	        }, ms);
	    });
	};
	exports.wait = wait;
	const insert = (opt) => {
	    let { input, rangeIndex, text } = opt;
	    if (rangeIndex) {
	        let oldVaue = input.value;
	        input.value = oldVaue.slice(0, rangeIndex) + text + oldVaue.slice(rangeIndex);
	        rangeIndex = rangeIndex + text.toString().length;
	    }
	    else {
	        input.value += text;
	        rangeIndex = input.value.length;
	    }
	    input.focus();
	    input.setSelectionRange(rangeIndex, rangeIndex);
	    let event = document.createEvent("HTMLEvents");
	    event.initEvent("input", !1, !0);
	    input.dispatchEvent(event);
	};
	exports.insert = insert;

	});

	unwrapExports(utils);
	utils.insert;
	utils.wait;
	utils.clipboardCopy;

	var live = createCommonjsModule(function (module, exports) {
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AcLiveExt = void 0;


	let prefix = `${config.prefix}-live-`;
	let acceptBtnName = `${prefix}accept`;
	let cancelBtnName = `${prefix}cancel`;
	let timeInputName = `${prefix}time`;
	let dialogName = `${prefix}dialog`;
	let emojiName = `${prefix}emoji`;
	let defaultTime = 100;
	let likeBtn = document.querySelector('.like-heart');
	class AcLiveExt {
	    constructor() { }
	    get acLikeExt() {
	        return window.acLiveExt;
	    }
	    get acMainExt() {
	        return window.acMainExt;
	    }
	    static globalInit() {
	        let acLikeExt = window.acLiveExt = new AcLiveExt();
	        acLikeExt.init();
	    }
	    toggle(dom, show) {
	        if (show === undefined)
	            dom.toggle();
	        else
	            show ? dom.show() : dom.hide();
	    }
	    // 样式
	    initStyle() {
	        let style = $('<style></style>').text(`
      .${prefix}menu {
        background: white;
        position: fixed; top: 100px; right: 10px;
        border-radius: 50%; border: 1px solid #dcdee2;
        width: 40px; height: 40px;
        z-index: 1000;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .${prefix}dialog-box {
        position: fixed; top: 100px; right: 10px;
        display: flex; justify-content: center;
        z-index: 1000;
      }
      .${prefix}dialog {
        background: white; width: 250px; height:100px; 
        border: 1px solid #dcdee2; border-radius: 5px;
        padding: 10px;
      }
      
      .${prefix}dialog > * {
        margin-bottom: 5px;
      }
      .${prefix}input {
        background-color: #f8f8f8 !important;
        color: #333;
        border-radius: 5px;
        padding: 2px 10px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        line-height: 20px;
        border: 0;
      }
      .${prefix}btn {
        box-sizing: border-box;
        height: 28px;
        border-radius: 4px;
        padding: 3px 10px;
        font-size: 14px;
        line-height: 14px;
        cursor: pointer;
        position: relative;
        display: inline-flex;
        align-items: center;
        font-weight: 400;
        white-space: nowrap;
        text-align: center;
        background-image: none;
        background-color: #fff;
        border: 1px solid #e5e5e5;
        color: #999;
      }
      .${prefix}btn-primary {
        background: #fd4c5d;
        color: #fff;
      }
    `);
	        $('head').append(style);
	    }
	    initView() {
	        return __awaiter(this, void 0, void 0, function* () {
	            // 等待加载
	            while (true) {
	                yield utils.wait(1000);
	                let face = $('.face-text');
	                if (face)
	                    break;
	            }
	            this.addDialog();
	            this.addEmoji();
	        });
	    }
	    addDialog() {
	        let dialog = $(`
      <div id="${dialogName}" class="${prefix}dialog-box">
        <div  class="${prefix}dialog">
          <div>时间(毫秒/次, 大于等于100的数)</div>
          <div>
            <input class="${prefix}input" id="${timeInputName}" value=${defaultTime} autocomplete="off"  type="text" /> 
          </div>
          <div>
            <button id="${cancelBtnName}" type="button" class="${prefix}btn">取消</button>
            <button id="${acceptBtnName}" type="button" class="${prefix}btn ${prefix}btn-primary" >确定</button>
          </div>
        </div>
      </div>`);
	        this.toggle(dialog, false);
	        let acceptBtn = dialog.find(`#${acceptBtnName}`);
	        acceptBtn.on('click', () => {
	            this.acceptClick();
	        });
	        let cancelBtn = dialog.find(`#${cancelBtnName}`);
	        cancelBtn.on('click', () => {
	            this.toggle(dialog);
	        });
	        $('body').append(dialog);
	        this.acLikeExt.dialog = dialog;
	    }
	    addEmoji() {
	        return __awaiter(this, void 0, void 0, function* () {
	            let face = $('.face-text');
	            let that = this;
	            face.css({ display: 'flex', 'align-items': 'center' });
	            let emoji = $(`<div class="${emojiName}" style="margin-left: 10px; cursor: pointer;">emoji</div>`);
	            emoji.on('click', function (e) {
	                that.acMainExt.showEmojiMenu({
	                    e
	                });
	                return false;
	            });
	            face.find('span').after(emoji);
	        });
	    }
	    acceptClick() {
	        let dialog = this.acLikeExt.dialog;
	        let time = dialog.find(`#${timeInputName}`).attr('value');
	        time = new Number(time);
	        if (isNaN(time) || time < 100) {
	            return alert('请输入正确的时间');
	        }
	        this.toggle(dialog);
	        this.toggleLike(time);
	    }
	    toggleLike(time) {
	        if (!likeBtn)
	            return alert('当前页面不支持');
	        if (this.acLikeExt.acLike) {
	            console.log('停止点赞');
	            clearInterval(this.acLikeExt.acLike);
	            this.acLikeExt.acLike = 0;
	        }
	        else {
	            console.log('开始点赞');
	            this.acLikeExt.acLike = setInterval(function () {
	                if (window.acMainExt.shouldPause)
	                    return;
	                likeBtn.click();
	            }, time);
	        }
	    }
	    init() {
	        this.initStyle();
	        this.initView();
	    }
	    run() {
	        // 运行中，停止
	        if (this.acLikeExt.acLike) {
	            this.toggleLike();
	        }
	        else {
	            let dialog = this.acLikeExt.dialog;
	            this.toggle(dialog, true);
	        }
	    }
	}
	exports.AcLiveExt = AcLiveExt;

	});

	unwrapExports(live);
	live.AcLiveExt;

	var lib = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AcMainExt = void 0;



	const acfunHost = 'https://www.acfun.cn';
	const prefix = `${config.prefix}-main-`;
	let floatMenuName = `${prefix}float-menu`;
	let defaultMenuName = `${prefix}default-menu`;
	let contextMenuName = `${prefix}context-menu`;
	let emojiMenuName = `${prefix}emoji-menu`;
	let emojiMenuMainName = `${prefix}emoji-menu-main`;
	let emojiItemName = `${prefix}emoji-item`;
	let transparentName = `${prefix}tp`;
	class AcMainExt {
	    constructor() {
	        this.init();
	    }
	    initStyle() {
	        let style = $('<style></style>').text(`
    .${transparentName} {
      background: transparent;
    }
    .${floatMenuName} {
      display: none;
      min-width: 100px;
      min-height: 20px;
      position: fixed;
      z-index: 3;
    }
    .${defaultMenuName} {
      background: white;
      padding: 15px 15px;
      cursor: pointer;
      border-radius: 5px;
      box-shadow: 1px 1px 5px #888888;
    }
    .${contextMenuName} {
    }
    .${contextMenuName} > * {
      padding: 5px 0;
    }
    .${emojiMenuName} {
    }
    .${emojiMenuMainName} {
      width: 260px;
      max-height: 150px;
      overflow-y: auto;
      font-size: 16px;
    }
    .${emojiItemName} {
      display: inline-block;
      padding: 2px;
      text-align: center;
      width: 25px;
      height: 25px;
    }
    .${emojiItemName}:hover {
      background-color: #f5f5f5;
    }
    
    .${prefix}menu {
      position: fixed; top: 100px; right: 10px;
    }
    .${prefix}menu > * {
      margin-bottom: 10px;
    }
    .${prefix}menu-item {
      background: white;
      border-radius: 50%; border: 1px solid #dcdee2;
      width: 40px; height: 40px;
      z-index: 1000;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      animation:${prefix}show 1s;
    }
    .${prefix}hide {
      display: none;
    }
    @keyframes ${prefix}show {
      from {opacity:0;}
      to {opacity:1;}
    }
    `);
	        $('head').append(style);
	    }
	    get isLive() {
	        return /live\/[\d]+/.test(location.href);
	    }
	    get shouldPause() {
	        return $(`.${floatMenuName}`).is(`:visible`)
	            || $(`.${prefix}menu-sub-item`).is(`:visible`)
	            // 礼物
	            || $('.container-gifts').hasClass('unfold')
	            // 牌子详情
	            || !$('.medal-panel-wrapper').hasClass('hide');
	    }
	    initView() {
	        this.addMenu();
	    }
	    addMenu() {
	        let dom = $(`<div class="${prefix}menu"></div>`);
	        let items = [];
	        // 直播
	        if (this.isLive) {
	            let liveBtn = $(`
      <svg width="20" viewBox="0 0 70 60">
        <path d="M0 10 L10 10 L10 0 L30 0 L30 10 L40 10 L40 0 L60 0 L60 10 L70 10 L70 30 L60 30 L60 40 L50 40 L50 50 L40 50 L40 60 L30 60 L30 50 L20 50 L20 40 L10 40 L10 30 L0 30 Z" fill="red" fill-rule="evenodd" />
      </svg>
      `);
	            liveBtn.on('click', () => {
	                window.acLiveExt.run();
	                return false;
	            });
	            items.push(liveBtn);
	            live.AcLiveExt.globalInit();
	        }
	        // 多菜单
	        if (items.length > 1) {
	            let mainMenuItem = $(`
      <svg viewBox="0 0 100 80" width="20" height="40">
        <rect width="100" height="20"></rect>
        <rect y="30" width="100" height="20"></rect>
        <rect y="60" width="100" height="20"></rect>
      </svg>
      `);
	            mainMenuItem.on('click', () => {
	                this.toggle($(`.${prefix}menu-sub-item`));
	                return false;
	            });
	            $(document).on('click', () => {
	                this.toggle($(`.${prefix}menu-sub-item`), false);
	            });
	            items.unshift(mainMenuItem);
	        }
	        if (items.length) {
	            items = items.map((ele, idx) => {
	                let dom = $('<div></div>');
	                if (idx > 0) {
	                    dom.addClass(`${prefix}menu-sub-item`).addClass(`${prefix}hide`);
	                }
	                dom.addClass(`${prefix}menu-item`).append(ele);
	                return dom;
	            });
	            dom.append(items);
	            $('body').append(dom);
	        }
	    }
	    init() {
	        this.initStyle();
	        this.initView();
	        this.initAvatar();
	        this.initDanmaku();
	    }
	    // 查看头像
	    initAvatar() {
	        let that = this;
	        $(document).on('contextmenu', function (e) {
	            let dom = $(e.target);
	            // console.log(dom)
	            let list = [{
	                    // 直播up主
	                    selector: '.live-author-avatar',
	                    getUrl: (dom) => {
	                        return dom.find('.live-author-avatar-img').attr('src');
	                    }
	                }, {
	                    // 榜单
	                    selector: '.avatar',
	                    getUrl: (dom) => {
	                        return dom.find('.head-img').attr('src');
	                    }
	                }, {
	                    // 主页
	                    selector: '.container-cover',
	                    getUrl: (dom) => {
	                        let url = dom.find('.user-photo').css('background-image');
	                        // 格式为url("......")
	                        url = url.substring(5, url.length - 2);
	                        return url;
	                    }
	                }, {
	                    // 稿件up
	                    selector: '.up-avatar',
	                    getUrl: (dom) => {
	                        return dom.find('.avatar').attr('src');
	                    }
	                }, {
	                    // 评论
	                    selector: '.area-comment-left .thumb',
	                    getUrl: (dom) => {
	                        return dom.find('.avatar').attr('src');
	                    }
	                }, {
	                    // 盖楼评论
	                    selector: '.mci-avatar',
	                    getUrl: (dom) => {
	                        return dom.find('img.fc-avatar').attr('src');
	                    }
	                }, {
	                    // 我的消息
	                    selector: '.avatar-section',
	                    getUrl: (dom) => {
	                        return dom.find('.avatar').attr('src');
	                    }
	                },];
	            for (let ele of list) {
	                let matchedDom;
	                if (dom.is(ele.selector)) {
	                    matchedDom = dom;
	                }
	                else {
	                    let p = dom.parents(ele.selector);
	                    if (p.length)
	                        matchedDom = p;
	                }
	                if (matchedDom) {
	                    let avatar = ele.getUrl(matchedDom);
	                    if (avatar) {
	                        avatar = avatar.split('?')[0];
	                        that.showContextMenu({
	                            e,
	                            avatar
	                        });
	                        return false;
	                    }
	                }
	            }
	        });
	    }
	    // 弹幕
	    initDanmaku() {
	        let that = this;
	        $(document).on('contextmenu', '.comment', function (e) {
	            let dom = $(this).find('.nickname');
	            let danmaku = dom.data('comment');
	            that.showContextMenu({
	                e,
	                danmaku
	            });
	            return false;
	        });
	    }
	    toggle(dom, show) {
	        let hideCls = `${prefix}hide`;
	        show = show !== null && show !== void 0 ? show : dom.hasClass(hideCls);
	        if (show)
	            dom.removeClass(hideCls);
	        else
	            dom.addClass(hideCls);
	    }
	    getClickPos(e) {
	        return {
	            x: e.originalEvent.x || 0,
	            y: e.originalEvent.y || 0,
	        };
	    }
	    showContextMenu(opt) {
	        let { e, avatar, danmaku } = opt;
	        let pos = this.getClickPos(e);
	        let list = [];
	        if (avatar) {
	            list.push({
	                text: '查看头像',
	                key: 'openImg',
	                data: avatar
	            });
	        }
	        if (danmaku) {
	            list.push({
	                text: '复制弹幕',
	                key: 'copyDanmaku',
	                data: danmaku
	            });
	            let acNumRegRs = /(ac[\d]+)/i.exec(danmaku);
	            if (acNumRegRs) {
	                let acNo = acNumRegRs[1].toLowerCase();
	                list.push({
	                    text: `打开视频(${acNo})`,
	                    key: 'openAcVideo',
	                    data: acNo
	                });
	            }
	            let urlRegRs = /(http[^\s]+)/i.exec(danmaku);
	            if (urlRegRs) {
	                let url = urlRegRs[1];
	                list.push({
	                    text: '打开链接',
	                    key: 'openUrl',
	                    data: url
	                });
	            }
	        }
	        this.createMenu(list, pos);
	    }
	    getMenu() {
	        let that = this;
	        let menu = $(`.${contextMenuName}`);
	        if (!menu.length) {
	            $(document).on('click', function () {
	                that.getMenu().hide();
	            });
	            $(document).on('click', `.${prefix}context-menu-item`, function (e) {
	                let dom = $(this);
	                let item = dom.data('item');
	                that.handleMenuItem(item);
	            });
	            menu = $(`<div class="${contextMenuName} ${floatMenuName} ${defaultMenuName}"></div>`);
	            $('body').append(menu);
	        }
	        return menu;
	    }
	    createMenu(item, pos) {
	        let menu = this.getMenu();
	        menu
	            .css({
	            left: pos.x + 'px',
	            top: pos.y + 'px',
	        })
	            .empty()
	            .append(item.map(ele => {
	            let dom = $(`<div class="${prefix}context-menu-item">${ele.text}</div>`);
	            dom.data('item', ele);
	            return dom;
	        })).show();
	    }
	    handleMenuItem(item) {
	        let url;
	        switch (item.key) {
	            case 'openImg':
	            case 'openUrl':
	                url = item.data;
	                break;
	            case 'openAcVideo':
	                url = `${acfunHost}/v/${item.data}`;
	                break;
	            case 'copyDanmaku':
	                utils.clipboardCopy(item.data);
	                break;
	        }
	        if (url) {
	            window.open(url, '__blank');
	        }
	    }
	    getEmojiMenu() {
	        let that = this;
	        let menu = $(`.${emojiMenuName}`);
	        if (!menu.length) {
	            menu = $(`<div class="${emojiMenuName} ${floatMenuName} ${transparentName}"></div>`);
	            let main = $(`<div class="${emojiMenuMainName} ${defaultMenuName}"></div>`);
	            menu.append(main);
	            menu.append(`<div class="${transparentName}" style="height: 30px"></div>`);
	            /*
	            emoji
	            http://www.amp-what.com/unicode/search/emoticon
	             */
	            let list = [
	                [9889, 129313, 129397, 128131, 127863],
	                { from: 128512, to: 128591 },
	                // 动物
	                { from: 128045, to: 128060 },
	            ];
	            let arr = [];
	            list.forEach(ele => {
	                if (ele instanceof Array) {
	                    arr.push(...ele);
	                }
	                else {
	                    for (let i = ele.from; i <= ele.to; i++) {
	                        arr.push(i);
	                    }
	                }
	            });
	            let doms = [];
	            arr.forEach(i => {
	                let value = typeof i === 'string' ? i : `&#${i};`;
	                doms.push(`<div class="${emojiItemName}" data-value="${value}">${value}</div>`);
	            });
	            main.append(doms.join(''));
	            $('body').append(menu);
	            $(document).on('mouseleave', `.${emojiMenuName}`, function (e) {
	                that.getEmojiMenu().hide();
	            });
	            let rangeIndex;
	            let input = $('.live-feed-input .danmaku-input');
	            input.on('blur', function () {
	                rangeIndex = this.selectionStart;
	            });
	            $(document).on('click', `.${emojiItemName}`, function () {
	                let dom = $(this);
	                let v = dom.data('value');
	                utils.insert({
	                    input: input[0],
	                    text: v,
	                    rangeIndex
	                });
	            });
	        }
	        return menu;
	    }
	    showEmojiMenu(opt) {
	        let { e, } = opt;
	        let pos = this.getClickPos(e);
	        let menu = this.getEmojiMenu();
	        menu
	            .css({
	            left: pos.x + 'px',
	            top: (pos.y - menu.outerHeight() + 10) + 'px',
	        }).show();
	    }
	}
	exports.AcMainExt = AcMainExt;
	window.acMainExt = new AcMainExt();

	});

	var index = unwrapExports(lib);
	var lib_1 = lib.AcMainExt;

	exports.AcMainExt = lib_1;
	exports["default"] = index;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
