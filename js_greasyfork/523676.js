// ==UserScript==
// @name               行动代号工具
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.1.4
// @description        行动代号游戏描述词编辑工具
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://game.hullqin.cn/xddh
// @match              http*://game.hullqin.cn/xddh/*
// @require            https://update.greasyfork.org/scripts/456034/1507114/Basic%20Functions%20%28For%20userscripts%29.js
// @icon               data:image/png;base64,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
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_setClipboard
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/523676/%E8%A1%8C%E5%8A%A8%E4%BB%A3%E5%8F%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/523676/%E8%A1%8C%E5%8A%A8%E4%BB%A3%E5%8F%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask testChecker registerChecker loadFuncs */

(async function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
			DEFAULT: 'zh-CN',
			'zh-CN': {}
		},
        Colors: ['#000000','#000033','#000066','#000099','#0000CC','#0000FF','#003300','#003333','#003366','#003399','#0033CC','#0033FF','#006600','#006633','#006666','#006699','#0066CC','#0066FF','#009900','#009933','#009966','#009999','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#00FF00','#00FF33','#00FF66','#00FF99','#00FFCC','#00FFFF','#330000','#330033','#330066','#330099','#3300CC','#3300FF','#333300','#333333','#333366','#333399','#3333CC','#3333FF','#336600','#336633','#336666','#336699','#3366CC','#3366FF','#339900','#339933','#339966','#339999','#3399CC','#3399FF','#33CC00','#33CC33','#33CC66','#33CC99','#33CCCC','#33CCFF','#33FF00','#33FF33','#33FF66','#33FF99','#33FFCC','#33FFFF','#660000','#660033','#660066','#660099','#6600CC','#6600FF','#663300','#663333','#663366','#663399','#6633CC','#6633FF','#666600','#666633','#666666','#666699','#6666CC','#6666FF','#669900','#669933','#669966','#669999','#6699CC','#6699FF','#66CC00','#66CC33','#66CC66','#66CC99','#66CCCC','#66CCFF','#66FF00','#66FF33','#66FF66','#66FF99','#66FFCC','#66FFFF','#990000','#990033','#990066','#990099','#9900CC','#9900FF','#993300','#993333','#993366','#993399','#9933CC','#9933FF','#996600','#996633','#996666','#996699','#9966CC','#9966FF','#999900','#999933','#999966','#999999','#9999CC','#9999FF','#99CC00','#99CC33','#99CC66','#99CC99','#99CCCC','#99CCFF','#99FF00','#99FF33','#99FF66','#99FF99','#99FFCC','#99FFFF','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#CC3300','#CC3333','#CC3366','#CC3399','#CC33CC','#CC33FF','#CC6600','#CC6633','#CC6666','#CC6699','#CC66CC','#CC66FF','#CC9900','#CC9933','#CC9966','#CC9999','#CC99CC','#CC99FF','#CCCC00','#CCCC33','#CCCC66','#CCCC99','#CCCCCC','#CCCCFF','#CCFF00','#CCFF33','#CCFF66','#CCFF99','#CCFFCC','#CCFFFF','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#FF3300','#FF3333','#FF3366','#FF3399','#FF33CC','#FF33FF','#FF6600','#FF6633','#FF6666','#FF6699','#FF66CC','#FF66FF','#FF9900','#FF9933','#FF9966','#FF9999','#FF99CC','#FF99FF','#FFCC00','#FFCC33','#FFCC66','#FFCC99','#FFCCCC','#FFCCFF','#FFFF00','#FFFF33','#FFFF66','#FFFF99','#FFFFCC','#FFFFFF','#000000','#000033','#000066','#000099','#0000CC','#0000FF','#003300','#003333','#003366','#003399','#0033CC','#0033FF','#006600','#006633','#006666','#006699','#0066CC','#0066FF','#009900','#009933','#009966','#009999','#0099CC','#0099FF','#00CC00','#00CC33','#00CC66','#00CC99','#00CCCC','#00CCFF','#00FF00','#00FF33','#00FF66','#00FF99','#00FFCC','#00FFFF','#000000','#000033','#000066','#000099','#0000CC','#0000FF','#330000','#330033','#330066','#330099','#3300CC','#3300FF','#660000','#660033','#660066','#660099','#6600CC','#6600FF','#990000','#990033','#990066','#990099','#9900CC','#9900FF','#CC0000','#CC0033','#CC0066','#CC0099','#CC00CC','#CC00FF','#FF0000','#FF0033','#FF0066','#FF0099','#FF00CC','#FF00FF','#000000','#003300','#006600','#009900','#00CC00','#00FF00','#330000','#333300','#336600','#339900','#33CC00','#33FF00','#660000','#663300','#666600','#669900','#66CC00','#66FF00','#990000','#993300','#996600','#999900','#99CC00','#99FF00','#CC0000','#CC3300','#CC6600','#CC9900','#CCCC00','#CCFF00','#FF0000','#FF3300','#FF6600','#FF9900','#FFCC00','#FFFF00','#000000','#111111','#222222','#333333','#444444','#555555','#666666','#777777','#888888','#999999','#AAAAAA','#BBBBBB','#CCCCCC','#DDDDDD','#EEEEEE','#FFFFFF','#333333','#333366','#333399','#3333CC','#336633','#336666','#336699','#3366CC','#339933','#339966','#339999','#3399CC','#33CC33','#33CC66','#33CC99','#33CCCC','#663333','#663366','#663399','#6633CC','#666633','#666666','#666699','#6666CC','#669933','#669966','#669999','#6699CC','#66CC33','#66CC66','#66CC99','#66CCCC','#993333','#993366','#993399','#9933CC','#996633','#996666','#996699','#9966CC','#999933','#999966','#999999','#9999CC','#99CC33','#99CC66','#99CC99','#99CCCC','#CC3333','#CC3366','#CC3399','#CC33CC','#CC6633','#CC6666','#CC6699','#CC66CC','#CC9933','#CC9966','#CC9999','#CC99CC','#CCCC33','#CCCC66','#CCCC99','#CCCCCC','#666666','#666699','#6666CC','#6666FF','#669966','#669999','#6699CC','#6699FF','#66CC66','#66CC99','#66CCCC','#66CCFF','#66FF66','#66FF99','#66FFCC','#66FFFF','#996666','#996699','#9966CC','#9966FF','#999966','#999999','#9999CC','#9999FF','#99CC66','#99CC99','#99CCCC','#99CCFF','#99FF66','#99FF99','#99FFCC','#99FFFF','#CC6666','#CC6699','#CC66CC','#CC66FF','#CC9966','#CC9999','#CC99CC','#CC99FF','#CCCC66','#CCCC99','#CCCCCC','#CCCCFF','#CCFF66','#CCFF99','#CCFFCC','#CCFFFF','#FF6666','#FF6699','#FF66CC','#FF66FF','#FF9966','#FF9999','#FF99CC','#FF99FF','#FFCC66','#FFCC99','#FFCCCC','#FFCCFF','#FFFF66','#FFFF99','#FFFFCC','#FFFFFF']
	};

	// Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

    /*
    设计：
    每个待猜词的按钮，鼠标悬浮/触屏长按时展示一个框（称为“标记框”），可以添加对这个词的描述词
    在屏幕下面对每个描述词创建显示一个展示框（称为“展示框”），里面列出所有这个描述词所描述的待猜词
    每个描述词自动分配一个颜色（不是蓝红白黑的相近色，称为“主题色”），显示在下面对应的框和所描述的待猜词按钮中
    描述词展示框里面放一个加号，点一下可以选择待猜词与其关联，屏幕下方再方一个和描述词展示框一个样式的加号框，点一下可以创建新的描述词
    如果某个描述词关联的所有待猜词都被猜出来了，就在对应的描述词展示框里显示一个绿色小对勾☑（或者其他方式显眼地表示出“已经猜完了”这个状态）
    */

    await detectDom('body');

    // CSS
    /*
    元素类名规则：
    - 所有创建元素的class应以 helper- 开头
    - helper-show 用于显示一般情况下处于隐藏的元素
    - helper-hide 用于隐藏元素，优先级应比helper-show高
    */
    (async function() {
        addStyle(`
            .helper-word-blue {
                --helper-word-color: #3b82f6;
            }
            .helper-word-red {
                --helper-word-color: #ef4444;
            }
            .helper-word-white {
                --helper-word-color: #fff;
            }
            .helper-word-black {
                --helper-word-color: #0f172a;
            }
            *[class*="helper-"] {
                --helper-background-color: white;
            }

            .helper-marker {
                position: fixed;
                top: 100vh;
                z-index: 1;
                background-color: #FFFFFF;
                border: 1px solid black;
                padding: 0 4px;
                min-width: 6em;
                display: none;
            }
            .helper-marker.helper-show {
                display: block;
            }
            .helper-marker.helper-show.helper-hide {
                display: none;
            }
            .helper-marker-item {
                margin: 4px 0;
                border: 2px solid grey;
                padding: 2px;
                text-align: center;
            }
            .helper-marker-color {
                cursor: pointer;
            }
            .helper-root {
                display: flex;
                flex-direction: row;
                justify-content: center;
                margin-top: 16px;
            }
            .helper-frame {
                padding: 4px;
                background-color: var(--helper-background-color, white);
                border: 2px solid grey;
                margin: 0 1em;
                position: relative;
            }
            .helper-frame-header {
                background-color: #BBBBBB;
                border: 2px solid grey;
                padding: 4px;
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            .helper-frame-text {
                margin: 0 4px;
                cursor: pointer;
            }
            .helper-frame-remove {
                cursor: pointer;
            }
            .helper-frame-remove.helper-disabled {
                filter: brightness(0.7);
                cursor: not-allowed;
            }
            .helper-frame-color {
                background-color: transparent;
                cursor: pointer;
            }
            .helper-frame-body {
                overflow: auto;
                margin-top: 4px;
            }
            .helper-frame-item {
                background-color: #BBBBBB;
                padding: 2px;
                border: 2px solid lightgrey;
                outline: 1px solid grey;
                outline-offset: -2px;
                position: relative;
            }
            .helper-frame-item.helper-word-guessed {
                outline-color: var(--helper-word-color, grey);
            }
            .helper-frame-item:not(:first-child) {
                margin-top: 4px;
            }
            .helper-frame-item:is(.helper-word-blue, .helper-word-red, .helper-word-white, .helper-word-black) {
                padding-left: calc(2px + 1em);
            }
            .helper-frame-item:is(.helper-word-blue, .helper-word-red, .helper-word-white, .helper-word-black)::before {
                content: '';
                display: inline-block;
                position: absolute;
                width: 1em;
                height: 100%;
                left: 0;
                top: 0;
                background-color: var(--helper-word-color, transparent);
            }
            .helper-frame-item:not(.helper-word-guessed)::before {
                filter: brightness(0.9) grayscale(0.4);
            }
            .helper-frame-item-remove {
                position: absolute;
                display: none;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #333333;
                font-size: 0.8em;
                padding: 4px;
            }
            .helper-frame-list:not(.helper-no-edit)>.helper-frame-item:hover>.helper-frame-item-remove {
                display: inline;
            }
            .helper-frame-item-new {
                cursor: pointer;
                background-color: #DDDDDD;
                user-select: none;
            }
            .helper-frame-item-new:hover:not(.helper-disabled) {
                background-color: #EEEEEE;
            }
            .helper-frame-item-new:active:not(.helper-disabled) {
                background-color: #CCCCCC;
            }
            .helper-frame-item-new.helper-disabled {
                filter: brightness(0.7);
                cursor: not-allowed;
            }
            .helper-frame-finish {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                font-size: 2.5em;
                color: green;
                background-color: #FFFFFF55;
                align-items: center;
                justify-content: center;
                pointer-events: none;
                display: none;
            }
            .helper-frame:hover .helper-frame-finish {
                opacity: 0.4;
            }
            .helper-frame-finish.helper-show {
                display: flex;
            }
            .helper-frame-new {
                align-items: center;
                justify-content: center;
                display: flex;
                cursor: pointer;
            }
            .helper-frame-new-content {
                width: 100%;
                height: 100%;
                padding: 2em;
                background-color: #DDDDDD;
                align-items: center;
                justify-content: center;
                display: flex;
                user-select: none;
            }
            .helper-frame-new-content:hover {
                background-color: #EEEEEE;
            }
            .helper-frame-new-content:active {
                background-color: #CCCCCC;
            }
            .helper-select-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                cursor: pointer;
                align-items: center;
                border-style: solid;
                border-radius: 12px;
                justify-content: center;
                background-color: transparent;
            }
            .helper-select-mask:hover {
                backdrop-filter: brightness(1.2);
            }
            .helper-select-mask:active {
                backdrop-filter: brightness(0.8);
            }
            .helper-select-mask-content {
                width: 100%;
                height: 100%;
                color: green;
                font-size: 1.5em;
                background-color: #FFFFFF88;
                border-style: solid;
                border-radius: 12px;
                display: none;
            }
            .helper-show .helper-select-mask-content {
                display: block;
            }
            .helper-color-group {
                position: absolute;
                left: 50%;
                top: 0;
                transform: translate(-50%, -50%);
                line-height: 100%;
                z-index: 1;
            }
            .helper-color-box {
                background-color: transparent;
                width: 0.8em;
                height: 0.8em;
                display: inline-block;
                margin: 0 0.1em;
                border: 1px solid black;
                border-radius: 4px;
            }
            .helper-hint-container {
                position: fixed;
                z-index: 10;
                background-color: var(--helper-background-color, white);
                border: 2px solid grey;
                outline: 1px solid white;
                padding: 0.5em;
                display: flex;
                justify-content: center;
                align-items: center;
                --helper-hint-position-padding: 20px;
            }
            .helper-hint-position-left {
                left: var(--helper-hint-position-padding, 20px);
            }
            .helper-hint-position-right {
                right: var(--helper-hint-position-padding, 20px);
            }
            .helper-hint-position-top {
                top: var(--helper-hint-position-padding, 20px);
            }
            .helper-hint-position-bottom {
                bottom: var(--helper-hint-position-padding, 20px);
            }
        `, 'helper-style');
    }) ();

    // 全局EventTarget信使，通过对其 dispatchEvent(CustomEvent()) 进行跨作用域通信
    // 传递以下事件：
    /*
    所有事件均有0个共同属性：

    1. desc相关事件
    desc相关事件由发起者主动广播
    desc相关事件的detail有1个共同属性：
    - desc: 发生变动的desc实例

    所有事件如下：
    - desc.link: desc与word关联
        - word: 关联的新word
    - desc.unlink: desc与word取消关联
        - word: 取消关联的word
    - desc.change: desc属性发生变化
        - property: 变化的属性，可以有以下取值：
            - value
            - color
    - desc.new: 用户新建描述词desc
    - desc.remove: 描述词desc被用户删除

    2. marker相关事件
    marker相关事件由marker内部实现广播
    所有事件如下：
    - marker.hide: marker被隐藏（只有最终实际上不再显示才算，如果hide()后又cancelHide()就不广播此事件）

    3. word相关事件
    word相关事件由发起者主动广播
    所有事件如下：
    - word.new: 页面发现新待猜词并加入words数组
        - word: 新word实例
    - word.change: 检测到页面变动表示的word属性变更
        此事件的发起者为负责监控页面变动的 Word 类构造函数
        - property: 变更的属性名 ('button', 'color', 'guessed')
        - word: 发送变更的word实例
    - word.remove: 页面发现词消失了（房主把原来有的词换掉了）
        - word: 消失的词实例

    4. 游戏相关事件
    游戏相关事件由代码主动监听页面变化触发并广播
    所有事件如下：
    - game.new: 游戏创建并已经出现至少一个待猜词元素
    - game.destroy: 页面退出游戏界面（不再有待猜词元素）

    5. 辅助函数相关事件
    辅助函数相关事件名称应遵循"utils.{函数标识}.{事件标识}"命名规范
    辅助函数相关事件由辅助函数内部实现广播
    所有事件如下：
    - utils.requestwords.request: 用户开始选择待猜词
        - event_data: 传入的event_data参数内容
    - utils.requestwords.finish: 用户选择待猜词完毕
        - event_data: 传入的event_data参数内容
        - words: 用户选择的待猜词数组
    - utils.requestwords.cancel: 用户放弃选择待猜词
        - event_data: 传入的event_data参数内容
    */
    const messager = new EventTarget();

    // 描述词
    class Desc {
        // 描述词对象规范（类）
        value = '描述词'; // 描述词内容
        words = []; // 所有关联的待猜词
        color = '#FFFFFF'; // 颜色

        toObject() {
            return {
                value: this.value,
                words: this.words.map(word => word.toObject()),
                color: this.color
            };
        }

        toJSON() {
            return JSON.stringify(this.toObject());
        }
    }
    const descs = [];

    // 待猜词
    class Word {
        // 待猜词对象规范（类）
        value = '待猜词';
        button = null;     // div.xddh-word
        color = 'unknown'; // Literal['unknown', 'red', 'blue', 'white', 'black']
        guessed = false;   // 已经被用户猜出？

        // 构造函数
        // - 构造时填充属性
        // - 属性自动跟随页面变化
        constructor(value, button) {
            const that = this;
            this.value = value;
            this.button = button;
            this.color = Word.getColor(this.button);
            this.guessed = Word.isGuessed(this.button);

            // 当页面上有待猜词被翻开时，原先的按钮<button>有可能会被一个新的<div>元素取代，没有取代时，也有可能会重置其中的内容
            // 通过监听按钮元素的改变，同步更新color和guessed属性
            const table = button.parentElement.parentElement.parentElement;
            const observer = new MutationObserver(records => {
                // 首先检查button是否改变，方法为重新定位button，检查和现存的that.button是否一致
                const new_button = Array.from($All(table, '.xddh-word')).find(btn => {
                    // 去除了所有elementChild后，若文字内容和当前待猜词value一致，就是符合要求的button
                    const cloned_btn = btn.cloneNode(true);
                    [...cloned_btn.children].forEach(child => child.remove());
                    return getButtonValue(cloned_btn) === that.value;
                });
                if (new_button) {
                    // 有按钮，那么根据情况广播 word.change
                    const button_changed = that.button !== new_button;
                    that.button = new_button;
                    button_changed && messager.dispatchEvent(new CustomEvent('word.change', {
                        detail: { property: 'button', word: that }
                    }));
                } else {
                    // 没有按钮，要么页面正在退出游戏界面，要么房主换词了
                    // - unlink所有关联的描述词
                    // - 从 words 中移除word
                    // - 广播 word.remove
                    // - 停止 observer 监听
                    [...descs.filter(desc => desc.words.includes(that))].forEach(desc => unlink(desc, that));
                    words.splice(words.indexOf(that), 1);
                    messager.dispatchEvent(new CustomEvent('word.remove', {
                        detail: { word: that }
                    }));
                    observer.disconnect();

                    // 检查原来的按钮元素是否还在页面上，如果还在，就说明是房主换词了，按钮元素的内容变了
                    // 此时需要创建新词及其Word实例
                    if (Array.from($All('.xddh-word')).includes(that.button)) {
                        const new_word = new Word(getButtonValue(that.button), that.button);
                        words.push(new_word);
                        messager.dispatchEvent(new CustomEvent('word.new', {
                            detail: { word: new_word }
                        }));
                    }
                }

                // 虽然手动解析每一个record所记录的class值变化也不失为一种选择，
                // 但既然知道class值变化了、且我们可以直接访问button元素，
                // 那为什么不直接查询button.classList呢？
                const new_color = Word.getColor(that.button);
                const new_guessed = Word.isGuessed(that.button);
                const color_changed = that.color !== new_color;
                const guessed_changed = that.guessed !== new_guessed;
                that.color = new_color;
                that.guessed = new_guessed;
                color_changed && messager.dispatchEvent(new CustomEvent('word.change', {
                    detail: { property: 'color', word: that }
                }));
                guessed_changed && messager.dispatchEvent(new CustomEvent('word.change', {
                    detail: { property: 'guessed', word: that }
                }));
            });
            observer.observe(table, {
                childList: true,
                attributes: true,
                subtree: true
            });
        }

        toObject() {
            return {
                value: this.value
            };
        }

        toJSON() {
            return JSON.stringify(this.toObject());
        }

        static getColor(button) {
            const map = {
                'xddh-red': 'red',
                'xddh-blue': 'blue',
                'xddh-white': 'white',
                'xddh-black': 'black',
            };
            for (const cls of button.classList) {
                if (map.hasOwnProperty(cls)) {
                    return map[cls];
                }
            }
            return 'unknown';
        }

        static isGuessed(button) {
            return button.classList.contains('xddh-show');
        }
    }
    const words = [];
    unsafeWindow.words = words;

    // 标记框
    // 全局共享一个标记框Marker实例
    class Marker {
        // 标记框根元素
        #element;

        // 当前正在处理的待猜词word
        #word;

        // 当前DOM结构中的所有items
        #items;

        // 初始化
        // - 创建DOM结构
        constructor() {
            const that = this;

            // 创建根元素
            const element = this.#element = $$CrE({
                tagName: 'div',
                classes: 'helper-marker'
            });
            // 根元素先放在body里
            // 如果使用相对定位，真正要用的时候放到button底下
            // 如果使用绝对定位，就不用挪位置了
            document.body.append(element);

            // 处理desc事件
            $AEL(messager, 'desc.unlink', e => {
                if (e.detail.word !== that.#word) { return; }

                // desc取消关联当前word
                const index = that.#items.findIndex(item => item.desc === e.detail.desc);
                const item = that.#items[index];
                item.container.remove();
                that.#items.splice(index, 1);
            });
            $AEL(messager, 'desc.link', e => {
                if (e.detail.word !== that.#word) { return; }

                // 新的desc关联当前word
                that.#items.push(that.#makeDescItems(e.detail.desc));
            });
            $AEL(messager, 'desc.change', e => {
                const item = that.#items.find(item => item.desc === e.detail.desc);
                if (item) {
                    switch (e.detail.property) {
                        case 'color':
                            item.color.value = item.desc.color;
                            break;
                        case 'value':
                            item.selector.value = item.desc.value;
                            break;
                    }
                }
            });
        }

        // 为指定待猜词展示，如果已经在为这个词展示并即将隐藏，就取消隐藏
        // - 找出所有与待猜词word关联的描述词desc
        // - 根据这些desc创建内部DOM结构：
        //   - 每个desc创建一个item，内部横向排列color和selector两个元素
        //   - selector是一个下拉框，列出所有已有描述词供选择，最后还有一个选项"+"可以创建新描述词（用作当前描述词关联项）
        //   - 所有desc对应的item都创建完毕后，再最后再创建一个“新增item”，点击可以新增一个描述词关联项
        //   - 至于显示排版，排版成1-2列、不限行数的标格状，用css实现，内部html结构就是一维线性
        show(word) {
            // 更新this.#word
            this.#word = word;

            // 所有与待猜词关联的描述词
            const linked_descs = descs.filter(desc => desc.words.includes(word));

            // 先清空原有DOM结构
            [...this.#element.children].forEach(child => child.remove());

            // 为每个关联的描述词创建一个item
            const items = this.#items = linked_descs.map(linked_desc => this.#makeDescItems(linked_desc));

            // 创建一个加号
            const new_container = $$CrE({
                tagName: 'div',
                classes: ['helper-marker-item', 'helper-marker-item-new'],
                listeners: [['click', e => {
                    // 如果目前一个没关联过的描述词也没有，就先创建一个
                    // 如果有，就用第一个还没关联过的
                    const not_linked_descs = descs.filter(desc => !desc.words.includes(word));
                    const desc = not_linked_descs.length ? not_linked_descs[0] : requestNewDesc();
                    desc !== null && link(desc, word);
                }]]
            });
            const new_content = $$CrE({
                tagName: 'div',
                classes: 'helper-marker-item-new-content',
                props: {
                    innerText: '+'
                }
            });
            new_container.append(new_content);
            this.#element.append(new_container);

            // 相对定位，把根元素挪到button底下
            //word.button.append(this.#element);

            // 绝对定位，使用offsetTop + position:fixed定位
            // 延迟执行，保证渲染完毕、属性值正确
            setTimeout(() => {
                this.#element.style.top = Math.round(word.button.offsetTop - document.scrollingElement.scrollTop + word.button.offsetHeight).toString() + 'px';
                this.#element.style.left = Math.round(word.button.offsetLeft - document.scrollingElement.scrollLeft + (word.button.offsetWidth - this.#element.clientWidth) / 2).toString() + 'px';
            });

            // 显示
            this.#element.classList.add('helper-show');
            this.cancelHide();
        }

        // 为描述词创建条目元素
        #makeDescItems(desc) {
            const that = this;

            // container
            const container = $$CrE({
                tagName: 'div',
                classes: 'helper-marker-item'
            });
            // color(颜色选择器)
            const color = $$CrE({
                tagName: 'input',
                classes: 'helper-marker-color',
                attrs: {
                    type: 'color'
                },
                props: {
                    value: desc.color
                },
                listeners: [['change', e => {
                    desc.color = color.value;
                    messager.dispatchEvent(new CustomEvent('desc.change', {
                        detail: { desc, property: 'color' }
                    }));
                }]]
            });
            // selector(描述词选择器)
            const selector = $$CrE({
                tagName: 'select',
                classes: 'helper-marker-select',
                listeners: [['change', e => {
                    if (selector.value === '__new__') {
                        // 如果选中了加号项，就新建一个描述词desc
                        const new_desc = requestNewDesc();
                        appendDescOption(new_desc);
                        change_desc(new_desc);
                    } else if (selector.value === '__remove__') {
                        // 如果选中了减号项，就取消关联这个描述词desc
                        unlink(desc, that.#word);
                    } else {
                        // 选中普通项目
                        const selected_desc = descs.find(d => d.value === selector.value);
                        if (selected_desc.words.includes(this.#word)) {
                            // 如果选择的提示词是同样和当前待猜词word关联的另外一个desc
                            // 就交换他们两个显示的位置
                            this.#items.find(item => item.desc === selected_desc).change_desc(desc, false);
                            change_desc(selected_desc, false);
                        } else {
                            // 选中一个目前尚未关联，切换关联的描述词为它
                            change_desc(selected_desc);
                        }
                    }
                }]]
            });
            // 为每个现有描述词创建option
            descs.forEach(desc => appendDescOption(desc));
            // 最后创建一个"+"option和一个"-"option
            const new_option = $$CrE({
                tagName: 'option',
                classes: ['helper-marker-select-option', 'helper-marker-select-option-new'],
                props: {
                    innerText: '+',
                    value: '__new__'
                }
            });
            const remove_option = $$CrE({
                tagName: 'option',
                classes: ['helper-marker-select-option', 'helper-marker-select-option-remove'],
                props: {
                    innerText: '-',
                    value: '__remove__'
                }
            });
            selector.append(new_option);
            selector.append(remove_option);

            container.append(color);
            container.append(selector);

            const new_container = $(this.#element, '.helper-marker-item-new');
            new_container ? new_container.before(container) : this.#element.append(container);

            return {
                container, color, selector,
                get desc() { return desc; },
                set desc(new_desc) { change_desc(new_desc); },
                change_desc
            };

            // 为desc创建selector下拉项
            function appendDescOption(d) {
                const option = $$CrE({
                    tagName: 'option',
                    classes: 'helper-marker-select-option',
                    props: {
                        innerText: d.value,
                        value: d.value,
                        selected: d === desc
                    }
                });
                selector.append(option);
            }

            // 更换本item的desc
            // - 如果没有指定do_linking为false：
            //   - 取消关联word和旧desc
            //   - 关联word和新desc
            // - UI更新
            //   - selector选择到对应option（假设option存在，不做检查）
            //   - color切换到新desc的color
            // - 更新局部变量desc到新desc
            function change_desc(new_desc, do_linking=true) {
                if (do_linking) {
                    unlink(desc, that.#word);
                    link(new_desc, that.#word);
                }
                selector.value = new_desc.value;
                color.value = new_desc.color;
                desc = new_desc;
            }
        }

        #timeout;
        // 一定延迟(毫秒)后隐藏，允许在这段延迟内取消隐藏
        hide(delay=300) {
            if (this.#timeout !== null) { return; }
            this.#timeout = setTimeout(() => this.instantHide(), delay);
        }

        // 立即隐藏
        instantHide() {
            this.cancelHide();
            this.element.classList.remove('helper-show');
            messager.dispatchEvent(new CustomEvent('marker.hide'));
        }

        // 取消隐藏
        cancelHide() {
            clearTimeout(this.#timeout);
            this.#timeout = null;
        }

        get element() {
            return this.#element;
        }
    }
    const marker = new Marker();

    // 展示框
    // 每新建一个描述词，新建一个与之对应的展示框Frame实例
    // 实际使用时，不应直接使用此实例，应通过展示框管理器FrameManager简介调用
    class Frame {
        // 展示框的根元素
        #element;
        // 展示框标题栏
        #header;
        // 展示框body
        #body;
        // 展示框的列表元素
        #ul;
        // 展示框的主题色元素
        #color;
        // 展示框的描述词标题元素
        #text;
        // 展示框的完成小对勾
        #finished_sign;
        // 展示框的删除按钮
        #remove_button;
        // Frame实例对应的描述词desc
        #desc;

        static COLOR_CLASS = {
            red: 'helper-word-red',
            blue: 'helper-word-blue',
            white: 'helper-word-white',
            black: 'helper-word-black',
        };

        // 初始化
        // - 创建DOM结构:
        /*
           - element
             - header
               - color
               - text
               - remove_button
             - body
               - ul
                 - li[]
                   - span
                 - ...
             - finished_sign
        */
        constructor(desc) {
            const that = this;
            this.#desc = desc;

            // 根元素
            const element = this.#element = $$CrE({
                tagName: 'div',
                classes: 'helper-frame'
            });
            // header
            const header = this.#header = $$CrE({
                tagName: 'div',
                classes: 'helper-frame-header'
            });
            element.append(header);
            // body
            const body = this.#body = $$CrE({
                tagName: 'div',
                classes: 'helper-frame-body'
            });
            element.append(body);
            // 主题色元素
            const color = this.#color = $$CrE({
                tagName: 'input',
                classes: 'helper-frame-color',
                attrs: {
                    type: 'color'
                },
                props: {
                    value: desc.color
                },
                listeners: [['change', e => {
                    desc.color = color.value;
                    messager.dispatchEvent(new CustomEvent('desc.change', {
                        detail: { desc, property: 'color' }
                    }));
                }]]
            });
            header.append(color);
            // 描述词标题元素
            let copy_timeout = null;
            const text = this.#text = $$CrE({
                tagName: 'span',
                classes: 'helper-frame-text',
                props: {
                    innerText: desc.value,
                    title: '单击复制，双击编辑'
                },
                listeners: [
                    ['click', e => {
                        // 单击复制，但不立即复制，短暂延迟后再复制；延迟期间触发dblclick，就取消复制
                        if (copy_timeout === null) {
                            copy_timeout = setTimeout(() => {
                                // 复制
                                GM_setClipboard(desc.value, 'text', () => {
                                    // 立即显示提示框，几秒后销毁提示框
                                    const destroy = hint(`已复制 ${escJsStr(desc.value, '"')}`, [e.clientX, e.clientY]);
                                    setTimeout(destroy, 2000);
                                });

                                // 清空copy_timeout
                                copy_timeout = null;
                            }, 400);
                        }
                    }],
                    ['dblclick', e => {
                        // 双击时取消单击触发的复制
                        copy_timeout !== null && clearTimeout(copy_timeout);
                        copy_timeout = null;

                        // 编辑
                        const desc_value = requestDescValue(desc.value);
                        if (desc_value === null) { return; }
                        desc.value = desc_value;
                        messager.dispatchEvent(new CustomEvent('desc.change', {
                            detail: { desc, property: 'value' }
                        }));
                    }]
                ]
            });
            header.append(text);
            // 展示框删除按钮
            const remove_button = this.#remove_button = $$CrE({
                tagName: 'span',
                classes: 'helper-frame-remove',
                props: {
                    innerText: '❌'
                },
                listeners: [['click', e => {
                    // 如果按钮已禁用（目前只能是因为有其他Frame调用了requestsWords），就不响应按键
                    if (remove_button.classList.contains('helper-disabled')) { return; }
                    confirm(`确定要删除描述词『${desc.value}』吗？`) && remove(desc);
                }]]
            });
            header.append(remove_button);
            // 待猜词列表元素
            const ul = this.#ul = $$CrE({
                tagName: 'ul',
                classes: 'helper-frame-list'
            });
            body.append(ul);
            // 构建待猜词列表
            const items = desc.words.map(word => appendWordList(word));
            // 待猜词列表编辑按钮
            const word_item_edit = $$CrE({
                tagName: 'li',
                classes: ['helper-frame-item', 'helper-frame-item-new'],
                props: {
                    innerText: '+/-'
                },
                listeners: [['click', async e => {
                    // 如果按钮已禁用（目前只能是因为有其他Frame调用了requestsWords），就不响应按键
                    if (word_item_edit.classList.contains('helper-disabled')) { return; }

                    // 用户选择待猜词
                    word_item_edit.innerText = '完成';
                    const checked_words = await requestWords(word_item_edit, desc.words, true, that);

                    // 编辑关联
                    checked_words
                        .filter(word => !desc.words.includes(word))
                        .forEach(word => link(desc, word));
                    desc.words
                        .filter(word => !checked_words.includes(word))
                        .forEach(word => unlink(desc, word));
                    word_item_edit.innerText = '+/-';
                }]]
            });
            ul.append(word_item_edit);
            // 完成对勾元素
            const finished_sign = this.#finished_sign = $$CrE({
                tagName: 'span',
                classes: 'helper-frame-finish',
                props: {
                    innerText: '✔'
                }
            });
            this.#element.append(finished_sign);

            // 处理事件
            $AEL(messager, 'desc.link', e => {
                if (e.detail.desc !== that.#desc) { return; }

                items.push(appendWordList(e.detail.word));
            });
            $AEL(messager, 'desc.unlink', e => {
                if (e.detail.desc !== that.#desc) { return; }

                const index = items.findIndex(item => item.word === e.detail.word);
                const item = items[index];
                items.splice(index, 1);
                item.li.remove();
            });
            $AEL(messager, 'desc.change', e => {
                if (e.detail.desc !== that.#desc) { return; }

                switch (e.detail.property) {
                    case 'color':
                        that.#color.value = that.#desc.color;
                        break;
                    case 'value':
                        that.#text.innerText = that.#desc.value;
                        break;
                }
            });
            $AEL(messager, 'desc.remove', e => {
                if (e.detail.desc !== that.#desc) { return; }

                that.#element.remove();
            });
            $AEL(messager, 'word.change', e => {
                if (!desc.words.includes(e.detail.word)) { return; }
                const item = items.find(item => item.word === e.detail.word);
                switch (e.detail.property) {
                    case 'color':
                        // 同步待猜词颜色
                        Object.values(Frame.COLOR_CLASS).forEach(cls => item.li.classList.remove(cls));
                        item.li.classList.add(Frame.COLOR_CLASS[item.word.color])
                        break;
                    case 'guessed':
                        // 单个待猜词是否被猜中
                        e.detail.word.guessed ? item.li.classList.add('helper-word-guessed') : item.li.classList.remove('helper-word-guessed') ;
                        break;
                }
            });
            ['desc.link', 'desc.unlink', 'word.change'].forEach(event_name => $AEL(messager, event_name, e => {
                // 所有待猜词是否被猜中
                const all_guessed = desc.words.every(word => word.guessed);
                all_guessed ? finished_sign.classList.add('helper-show') : finished_sign.classList.remove('helper-show');
            }));
            ['utils.requestwords.request', 'utils.requestwords.finish', 'utils.requestwords.cancel']
                .forEach(event_name => $AEL(messager, event_name, e => {
                const event_type = event_name.split('.').pop();
                const buttons = [word_item_edit];
                if (event_type === 'request') {
                    if (e.detail.event_data !== that) {
                        word_item_edit.classList.add('helper-disabled');
                    }
                    remove_button.classList.add('helper-disabled');
                    ul.classList.add('helper-no-edit');
                } else {
                    if (e.detail.event_data !== that) {
                        word_item_edit.classList.remove('helper-disabled');
                    }
                    remove_button.classList.remove('helper-disabled');
                    ul.classList.remove('helper-no-edit');
                }
            }));

            function appendWordList(word) {
                const li = $$CrE({
                    tagName: 'li',
                    classes: 'helper-frame-item',
                    props: {
                        innerText: word.value
                    }
                });
                const remove_button = $$CrE({
                    tagName: 'span',
                    classes: 'helper-frame-item-remove',
                    props: {
                        innerText: '❌︎'
                    },
                    listeners: [['click', e => {
                        unlink(desc, word);
                    }]]
                });
                word.color !== 'unknown' && li.classList.add(Frame.COLOR_CLASS[word.color]);
                word.guessed && li.classList.add('helper-word-guessed');
                li.append(remove_button);
                typeof word_item_edit !== 'undefined' ? word_item_edit.before(li) : that.#ul.append(li);
                return { li, remove_button, word };
            }
        }

        // 获取展示框根元素
        get element() {
            return this.#element;
        }
    }

    // 展示框管理器
    // 全局共享一个展示框管理器FrameManager实例
    class FrameManager {
        // 管理的所有展示框实例，是一个以展示框名称进行索引的对象
        #frames = {};
        // 显示所有展示框的父元素，也是FrameManager的根元素
        #element;
        // 加号（新增）框
        #frame_new;

        // 初始化
        // - 创建DOM结构
        constructor() {
            const that = this;

            // 创建DOM结构
            // 根元素
            const element = this.#element = $$CrE({
                tagName: 'div',
                classes: 'helper-root'
            });

            // 加号（新增）框
            const frame_new = this.#frame_new = $$CrE({
                tagName: 'div',
                classes: ['helper-frame', 'helper-frame-new'],
                listeners: [['click', e => requestNewDesc()]]
            });
            const frame_new_content = $$CrE({
                tagName: 'div',
                classes: 'helper-frame-new-content',
                props: {
                    innerText: '+'
                }
            });
            frame_new.append(frame_new_content);
            element.append(frame_new);

            $AEL(messager, 'desc.new', e => {
                // 为用户新创建的描述词desc新建一个展示框Frame
                const desc = e.detail.desc;
                const frame = that.#frames[desc.value] = new Frame(desc);
                that.#frame_new.before(frame.element);
            });
        }

        // 获取展示框管理器根元素
        get element() {
            return this.#element;
        }
    }
    const manager = new FrameManager();

    // 监听第一个待猜词元素在页面出现，广播game.new事件
    (function() {
        let word_elements = [];
        detectDom({
            selector: '.xddh-word',
            callback: elm => {
                // 将elm添加进去，将已经从document.body中移除的元素移除出去
                word_elements.push(elm);
                word_elements = word_elements.filter(elm => isChild(elm, document.body));

                if (word_elements.length === 1) {
                    messager.dispatchEvent(new CustomEvent('game.new', {}));
                }
            }
        });
    }) ();

    // 监听游戏界面元素的消失，广播game.destroy事件
    $AEL(messager, 'game.new', e => {
        // 首先，每次游戏开始时获取最终将会在退出游戏界面时被销毁的游戏界面元素
        const stage = [...$All('#root>div>div>div')].reverse().find(elm => elm.children.length);
        const observer = new MutationObserver(records => {
            for (const record of records) {
                for (const removed_node of record.removedNodes) {
                    if (stage === removed_node || isChild(stage, removed_node)) {
                        messager.dispatchEvent(new CustomEvent('game.destroy', {}));
                    }
                }
            }
        });
        observer.observe(stage.parentElement, {
            childList: true
        });
    });

    // 每当新游戏创建，把展示框容器放在所有待猜词组成的表格的下面
    $AEL(messager, 'game.new', async e => {
        // 定位待猜词标格
        // 首先定位到父级元素：父级元素结构相对稳定，直接用css定位；
        // 注意观战中会在父元素后出现一个和父元素不易区分的"观战中"div，因此使用“具备子元素的最后一个div”特征进行筛选
        await detectDom('#root>div>div>div:last-of-type');
        const container = [...$All('#root>div>div>div')].reverse().find(elm => elm.children.length);
        [...$All('#root>div>div>div')].reverse().find(elm => elm.children.length);
        // 子元素结构在游戏不同阶段（选词阶段、游戏进行中阶段）和不同特殊规则下（翻开白色词语是否继续游戏）是不同的，不好用css定位
        // 这里利用我自己总结的待猜词表格元素的特征进行匹配：内含>=3个child（应该是5个，但留有一些变动空间），其各种元素属性一模一样，且其前一个元素存在并且没有ElementChild
        const words_table = Array.from(container.children).find(elm => {
            if (elm.children.length < 3) { return false; }
            if (!elm.previousElementSibling || elm.previousElementSibling.children.length) { return false; }

            const attr_length = elm.firstChild.attributes.length;
            const attributes = getAttrs(elm.firstChild);

            for (const child of elm.children) {
                if (child.firstChild.attributes.length !== attr_length) { return false; }
                const attrs = getAttrs(child);
                for (const [name, value] of Object.entries(attrs)) {
                    if (!attributes.hasOwnProperty(name) || attributes[name] !== value) {
                        return false;
                    }
                }
            }

            return true;

            function getAttrs(elm) {
                const attrs = {};
                for (const attr of elm.attributes) {
                    attrs[attr.name] = attr.value;
                }
                return attrs;
            }
        });
        words_table.after(manager.element);
    });

    // 对每个待猜词：
    // - 添加到待猜词数组中
    // - 鼠标悬停/触屏长按展示标记框
    detectDom({
        selector: '.xddh-word',
        callback: button => {
            // 检测到新的.xddh-word元素出现，可能是新的待猜词的按钮加载出来了，也可能是没有颜色的button被翻开，被新的div元素替代
            const word_value = getButtonValue(button);
            const word = words.find(word => word.value === word_value) ?? new Word(
                word_value,
                button
            );
            if (!words.includes(word)) {
                // 新待猜词，添加到words并广播事件
                words.push(word);
                messager.dispatchEvent(new CustomEvent('word.new', {
                    detail: { word }
                }));
            }

            // 标记框
            // 鼠标进入时显示，未交互过并移出时隐藏，交互过移出不隐藏，移除过程后迅速进入marker内部，取消隐藏
            let interacted = false;
            $AEL(messager, 'marker.hide', e => interacted = false);
            [button, marker.element].forEach(elm => {
                $AEL(elm, 'mouseenter', e => elm === button ? marker.show(word) : marker.cancelHide());
                $AEL(elm, 'mouseleave', e => !interacted && marker.hide());
                $AEL(elm, 'mousedown', e => interacted = true);
            });

            /*
            // 鼠标组合键显示
            $AEL(button, 'mouseup', e => {
                // 响应以下组合键
                const AcceptableKeys = [
                    e.button === 2 && !e.shiftKey, // 鼠标右键按下并且，没有同时按下Shift键
                    e.button === 1 // 鼠标中键（通常是滚轮）按下
                ];
                if (AcceptableKeys.every(condition => !condition)) { return; }
                e.preventDefault();
                e.stopImmediatePropagation();
                marker.show(word);
            }, { capture: true });
            */

            // 触屏长按显示
            let touch_timeout = null
            $AEL(button, 'touchstart', e => touch_timeout === null && (touch_timeout = setTimeout(() => marker.show(word), 500)));
            $AEL(button, 'touchmove', e => touch_timeout !== null && (clearTimeout(touch_timeout), touch_timeout = null));
            $AEL(button, 'touchend', e => touch_timeout !== null && (clearTimeout(touch_timeout), touch_timeout = null));
        }
    });

    // 点击按钮/marker取消隐藏，点击屏幕其他区域立即隐藏
    $AEL(document.body, 'click', e => {
        const clicking_button = words.some(word => isChild(e.target, word.button));
        const clicking_marker = isChild(e.target, marker.element);
        clicking_button || clicking_marker ? marker.cancelHide() : marker.instantHide();
    });
    // 按下键盘Esc立即隐藏
    $AEL(document.body, 'keydown', e => e.code === 'Escape' && marker.instantHide());

    // 根据desc.color，给每个按钮添加对应颜色小方块
    ['desc.link', 'desc.unlink', 'desc.new', 'desc.change', 'word.new', 'word.change'].forEach(event_name => $AEL(messager, event_name, e => {
        const [event_type, event_subtype] = event_name.split('.');
        switch (event_type) {
            case 'desc':
                switch (event_subtype) {
                    case 'link':
                    case 'unlink':
                        decorate(e.detail.word);
                        break;
                    default:
                        e.detail.desc.words.forEach(word => decorate(word));
                }
                break;
            case 'word':
                decorate(e.detail.word);
                break;
        }

        // 重新用颜色小方块装饰给定word对应的按钮
        function decorate(word) {
            // 首先移除旧的装饰元素
            $(word.button, '.helper-color-group')?.remove();

            // 容器
            const container = $$CrE({
                tagName: 'div',
                classes: 'helper-color-group'
            });
            word.button.append(container);

            // 颜色小方块
            descs.filter(desc => desc.words.includes(word)).forEach(desc => {
                const box = $$CrE({
                    tag: 'span',
                    classes: 'helper-color-box',
                    styles: {
                        'background-color': desc.color
                    }
                });
                container.append(box);
            });
        }
    }));

    // 每当页面退出游戏界面，清空words和descs
    $AEL(messager, 'game.destroy', e => {
        [...descs].forEach(desc => remove(desc));
        words.splice(0, words.length);
    });

    // 页面刷新数据持久化
    ['desc.link', 'desc.unlink', 'desc.new', 'desc.remove', 'desc.change'].forEach(event_name => $AEL(messager, event_name, e => save()));
    ['word.new', 'word.remove'].forEach(event_name => $AEL(messager, event_name, e => {
        if (words.length === GM_getValue('data', null)?.words.length) {
            load();
            save();
        }
    }));

    // 保存页面用户数据
    function save() {
        const data = {
            descs: descs.map(desc => desc.toObject()),
            words: words.map(word => word.toObject())
        };
        GM_setValue('data', data);
    }

    // 加载页面用户数据（从GM_storage）
    // - 成功加载返回true，没有加载返回false
    //   没有加载可能由于 存储的数据不是本局游戏 没有存储数据
    function load() {
        const data = GM_getValue('data', null);
        if (data === null) { return false; }

        // 首先验证是不是本局游戏
        // 方法是看待猜词是否一样
        const word_values = words.map(word => word.value);
        const saved_word_values = data.words.map(word => word.value);
        if (
            saved_word_values.length != word_values.length || // 数量不同
            saved_word_values.some(val => !word_values.includes(val)) // 存在不同项
        ) { return false; }

        // 完全一样，加载数据
        // 注意：由于words完全一致所以无需加载，只需加载descs即可
        descs.forEach(desc => remove(desc));
        data.descs.forEach(saved_desc => {
            const desc = new Desc();
            desc.value = saved_desc.value;
            desc.color = saved_desc.color;
            descs.push(desc);
            messager.dispatchEvent(new CustomEvent('desc.new', {
                detail: { desc }
            }));

            saved_desc.words.forEach(saved_word => {
                const word = words.find(word => word.value === saved_word.value);
                link(desc, word);
            });
        });
    }

    // 将一个描述词和一个待猜词关联
    // - 添加word到desc.words
    // - 广播link事件
    function link(desc, word) {
        desc.words.push(word);
        messager.dispatchEvent(new CustomEvent('desc.link', {
            detail: { desc, word }
        }));
    }

    // 将一个描述词和一个待猜词取消关联
    // - 从desc.words中移除word
    // - 广播unlink事件
    function unlink(desc, word) {
        desc.words.splice(desc.words.indexOf(word), 1);
        messager.dispatchEvent(new CustomEvent('desc.unlink', {
            detail: { desc, word }
        }));
    }

    // 删除一个描述词
    // - unlink所有描述词关联的word
    // - 广播remove事件
    function remove(desc) {
        [...desc.words].forEach(word => unlink(desc, word));
        descs.splice(descs.indexOf(desc), 1);
        messager.dispatchEvent(new CustomEvent('desc.remove', {
            detail: { desc }
        }));
    }

    // 用户创建新描述词，返回新desc实例
    // - 询问用户新描述词内容
    // - 创建desc实例添加到descs中
    // - 广播new事件
    function requestNewDesc() {
        // 用户输入描述词内容
        const desc_value = requestDescValue();
        if (desc_value === null) { return null; }

        // 随机WEB安全色作为主题色
        const color = choice(CONST.Colors);

        // 创建desc实例
        const desc = new Desc();
        desc.value = desc_value;
        desc.color = color;

        // 添加到descs中
        descs.push(desc);

        // 广播new事件
        messager.dispatchEvent(new CustomEvent('desc.new', {
            detail: { desc }
        }));

        return desc;
    }

    // 用户输入描述词内容
    // - 接受用户输入描述词内容
    // - 验证用户输入是否合法（如有爆字，提示用户）
    // - 如果提供了default_value，将其用作输入框默认值
    // - 用户成功输入：返回描述词内容；用户放弃：返回null
    function requestDescValue(default_value = null) {
        let desc_value = '';
        default_value = default_value === null ? `描述词-${descs.length+1}` : default_value;
        const value_unique = val => descs.every(desc => desc.value !== val);
        const char_leak = val => [...val].find(char => words.some(word => word.value.includes(char)));
        while (true) {
            desc_value = prompt('创建一个新描述词：', default_value);
            if (desc_value === null) { return null; }
            desc_value = desc_value.trim();
            if (desc_value === '') {
                alert('错误：描述词不能为空');
                continue;
            }
            default_value = desc_value;
            if (desc_value.startsWith('_')) {
                alert('错误：不允许使用"_"作为描述词开头第一个字');
                continue;
            }
            if (!value_unique(desc_value)) {
                alert('错误：这个描述词已经存在了');
                continue;
            }
            const leaked_char = char_leak(desc_value);
            if (leaked_char) {
                if (!confirm(`待猜词中已经有 ${leaked_char} 这个字了，确定要用 ${desc_value} 这个词吗？`)) { continue; }
            }
            break;
        }
        return desc_value;
    }

    // 用户点选待猜词
    // - 屏幕上词语部分允许点选，如果提供了prechecked_words，里面的word对应的词语默认选中
    // - 显示必要的视觉提示引导用户
    // - 调用方（必须）提供一个finish_button元素，requestWords会在上面
    //   添加一个{once:true,capture:true}，且会stopPropagation的click事件用作完成按钮
    // - 返回一个Promise，用户选择完毕时以Word[]resolve，用户放弃选择时reject（无reason）
    // - 如果调用方指定no_reject=true，则在用户放弃选择时不会reject，取而代之的是以prechecked_words（不提供则为空数组）resolve
    // - 广播三个辅助函数事件：
    //   - utils.requestwords.request
    //   - utils.requestwords.finish
    //   - utils.requestwords.cancel
    function requestWords(finish_button, prechecked_words=[], no_reject=false, event_data=null) {
        // DOM结构设计
        // 每个词语Button内新增一个遮罩层div（称为checker），里面画一个对勾，背景半透明白色
        // checker只有在词语被选中时才显示，未选中隐藏

        return new Promise((resolve, reject) => {
            // 当选择完成、即将resolve时，需要执行的清理工作数据
            const cleanups = {
                // 需要移除的元素
                elements: [],
                // 需要恢复其innerText的元素，格式为 { element, text }
                texts: [],
                // 需要去除特定类名的元素，格式为 { element, name }
                classes: [],
                // 将会abort掉的abortcontroller
                abort_controller: new AbortController(),
                get signal() { return this.abort_controller.signal; }
            }

            // 创建checkers
            const checkers = words.map(word => {
                const button = word.button;
                let checked = prechecked_words.includes(word);
                const mask = $$CrE({
                    tagName: 'div',
                    classes: 'helper-select-mask',
                    listeners: [['click', e => {
                        e.stopPropagation();
                        checked = !checked;
                        checked ? mask.classList.add('helper-show') : mask.classList.remove('helper-show');
                    }, { capture: true }]]
                });
                const mask_content = $$CrE({
                    tagName: 'div',
                    classes: 'helper-select-mask-content',
                    props: {
                        innerText: '✔'
                    },
                });
                mask.append(mask_content);
                checked && mask.classList.add('helper-show');
                button.append(mask);
                cleanups.elements.push(mask);

                return {
                    word, mask, mask_content,
                    get checked() { return checked; },
                    set checked(val) { checked = val; }
                }
            });

            // 提示标题
            const title = $('#root>div>div>div:last-child>div:nth-child(2)');
            cleanups.texts.push({ element: title, text: title.innerText });
            title.innerText = '点击下方词语即可进行选择';

            // 隐藏marker
            marker.element.classList.add('helper-hide');
            cleanups.classes.push({ element: marker.element, name: 'helper-hide' });

            // 完成按钮、回车完成选择、Esc取消选择
            const do_cleaning = () => {
                cleanups.elements.forEach(elm => elm.remove());
                cleanups.texts.forEach(text => text.element.innerText = text.text);
                cleanups.classes.forEach(cls => cls.element.classList.remove(cls.name));
                cleanups.abort_controller.abort();
            };
            const finish = e => {
                e && e.stopPropagation();
                do_cleaning();
                const checked_words = checkers.filter(checker => checker.checked).map(checker => checker.word);
                messager.dispatchEvent(new CustomEvent('utils.requestwords.finish', {
                    detail: { event_data, words: checked_words }
                }));
                resolve(checked_words);
            };
            const cancel = e => {
                do_cleaning();
                messager.dispatchEvent(new CustomEvent('utils.requestwords.cancel', {
                    detail: { event_data }
                }));
                no_reject ? resolve(prechecked_words) : reject();
            }
            $AEL(finish_button, 'click', finish, { once: true, capture: true, signal: cleanups.signal });
            $AEL(window, 'keydown', function enter_finish(e) {
                ({
                    'Enter': finish,
                    'Escape': cancel
                })[e.code]?.(e);
            }, { capture: true, signal: cleanups.signal });

            // 广播事件
            messager.dispatchEvent(new CustomEvent('utils.requestwords.request', {
                detail: { event_data }
            }));
        });
    }

    // 显示提示框
    // - 参数:
    //   - content: 显示内容
    //   - position: 显示位置，可以为以下值：
    //     - [int, int]: 相对于浏览器窗口的xy座标（即css中position: fixed时指定元素位置的left和top值）
    //     - ('left', 'right') 和 ('top', 'bottom') 中分别选一个组成 'top-left'/'left-top'格式的字符串：字面意义，放在角落里
    //   - html: 是否将内容作为html展示；true: 作为html展示; false: 作为纯文本展示；默认值false
    // - 返回值：一个destroy函数，调用后会销毁提示框
    function hint(content, position, html=false) {
        // DOM结构
        const container = $$CrE({
            tagName: 'div',
            classes: 'helper-hint-container'
        })
        document.body.append(container);

        // 内容
        if (html) {
            container.innerHTML = content;
        } else {
            container.innerText = content;
        }

        // 定位
        if (Array.isArray(position)) {
            container.style.left = position[0].toString() + 'px';
            container.style.top = position[1].toString() + 'px';
        } else {
            const classes = [
                'helper-hint-position-left',
                'helper-hint-position-right',
                'helper-hint-position-top',
                'helper-hint-position-buttom',
            ];
            const parts = position.split('-');
            for (const part of parts) {
                const cls = classes.find(cls => cls.includes(part));
                container.classList.add(cls);
            }
        }

        // 返回一个desctroy函数
        return function destroy() {
            container.remove();
        }
    }

    // 从 button 获取对应的待猜词内容
    function getButtonValue(button) {
        return button.innerText.replaceAll(/\s/g, '');
    }

    // 检查node是否为parent的后代（不检查是否为直系后代）
    function isChild(node, parent) {
        for (const child of parent.childNodes) {
            if (child === node || isChild(node, child)) {
                return true;
            }
        }
        return false;
    }

    // 随机选择
    function choice(arr) {
        return arr[randint(0, arr.length-1)];
    }

    // 随机整数
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();