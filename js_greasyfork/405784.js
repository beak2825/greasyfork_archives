// ==UserScript==
// @name         百度搜索页面双列美化
// @name:en      Pretty Baidu Search Page
// @namespace    https://github.com/TheRiverElder/Pretty-Baidu-Search-Page/blob/master/index.js
// @version      2.3.1
// @description  美化百度搜索页面，屏蔽部分广告、相关关键词、提供自定义的图片背景、毛玻璃圆角卡片、双列布局。双列布局采用紧密布局，不会出现某个搜索结果有过多空白。
// @description:en  Prettify Baidu search page. Removed some ads, relative keywords. Offers custom image or color backgroud. Uses round corner card to display result. Densitive layout ensures no more blank in result cards.
// @author       TheRiverElder
// @icon         https://theriverelder.github.io/assets/river_icon_dark.ico
// @compatible   chrome
// @include      *//www.baidu.com/
// @include      *//www.baidu.com/s
// @include      *//www.baidu.com/s?*
// @include      *//www.baidu.com/baidu?*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/405784/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%8F%8C%E5%88%97%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/405784/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%8F%8C%E5%88%97%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

const GLOBAL_STYLE = `
    * {
        min-width: unset !important;
        max-width: 100%;
    }
    html, body {
        font-family: 微软雅黑, Helvatica, sans serif;
    }
	textarea {
		width: 100%!important;
		padding: 1em!important;
		margin: 0;
		box-sizing: border-box;
	}
    .s_form_wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    /* 整个搜索栏头 */
    #head.absolute {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        transition: height 0.3s ease;
    }

    /* 搜索建议列表外层 */
    .bdsug, 
    .wrapper_new.wrapper_s #form .bdsug-new, 
    .wrapper_new .wrapper_new #form .bdsug-new ul, 
    .wrapper_new .fix-head.s_down #form .bdsug-new {
        width: 100%;
        border: none;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.5);
        border-bottom-left-radius: 1.5em;
        border-bottom-right-radius: 1.5em;
        box-shadow: none;
        overflow: hidden;
    }
    .busug input, .busug-new input, .wrapper_new .s_btn_wr .s_btn {
        border-radius: 0;
    }

    /* 搜索建议表 */
    .wrapper_new #form .bdsug-new ul, 
    .wrapper_new .fix-head.s_down #form .bdsug-new,
    .wrapper_new #form .bdsug-new {
        width: 100%;
        margin: 0;
        padding: 0;
    }

    /* 普通的搜索建议 */
    .wrapper_new.wrapper_s #form .bdsug-new ul li, 
    .wrapper_new #form .bdsug-new ul li {
        width: 100%;
        margin: 0;
        padding: .5em .5em;
        padding-left: 1em;
        box-sizing: border-box;
        transition: padding-left 100ms;
    }

    /* 被选中的搜索建议，注意被选中不仅仅是鼠标悬停，通过上下键所选中的也在其中 */
    .wrapper_new.wrapper_s #form .bdsug-new ul li.bdsug-s, 
    .wrapper_new #form .bdsug-new .bdsug-s {
        padding-left: 2em;
        background-color: rgba(255, 255, 255, 0.5);
        transition: padding-left 100ms;
        display: flex;
        align-items: center;
    }
    .wrapper_new.wrapper_s #form .bdsug-new ul li.bdsug-s span, .wrapper_new #form .bdsug-new ul li.bdsug-s span {
        flex: 1;
    }
    .wrapper_new.wrapper_s #form .bdsug-new ul li.bdsug-s .bdsug-store-del.wrapper_new #form .bdsug-new ul li.bdsug-s .bdsug-store-del  {
        position: relative;
        right: 0;
    }

    /* 搜索建议列表的反馈栏 */
    .wrapper_new .bdsug-new .bdsug-feedback-wrap {
        margin: 0;
        padding-top: 5px;
        background: #F5F5F6;
    }
    .bdsug-feedback-wrap {
        height: 2em;
    }
    .bdsug-feedback {
        padding-right: 2em;
    }
    #result_logo, #form {
        float: none;
    }
    #form {
        margin: 12px 15px;
    }
    #form .s_ipt_wr {
        border-top-left-radius: 2em;
        border-bottom-left-radius: 2em;
        padding-left: 1.5em;
    }
    #form .s_btn_wr {
        border-top-right-radius: 2em;
        border-bottom-right-radius: 2em;
        overflow: hidden;
    }
    #form .s_ipt_wr.iptfocus {
        border-bottom-left-radius: 0;
    }
    #form .s_ipt_wr.iptfocus ~ .s_btn_wr {
        border-bottom-right-radius: 0;
    }
    .wrapper_new #head.fix-head .s_form,
    .wrapper_new .s_form {
        height: auto;
    }
    .wrapper_new #s_tab {
        background: #F5F5F680;
        padding-left: 0;
    }
    .wrapper_new #s_tab > .s_tab_inner {
        width: fit-content;
        margin: auto;
    }
	#container {
		margin-left: 0 !important;
	}
    #container > div.head_nums_cont_outer.OP_LOG > div > div.nums {
        margin: auto;
    }

    /* 居中搜索工具 */
    #container.sam_newgrid .hint_common_restop, #container.sam_newgrid .nums, #container.sam_newgrid #rs, #container.sam_newgrid .search_tool_conter {
        margin: auto !important;
    }

    /* 搜索栏输入框宽度 
    .wrapper_new.wrapper_s .s_ipt_wr {
        width: 50vw;
    }*/

    /* 同关键词链接，例如文库、百科之类的 */
    .wrapper_new #s_tab .s-tab-item, 
    .wrapper_new #s_tab .s-tab-item:before {
        transition: color 100ms;
    }
    .wrapper_new #s_tab .s-tab-item:hover, 
    .wrapper_new #s_tab .s-tab-item:hover:before {
        color: #FFFFFF;
        transition: color 100ms;
    }
    #container,
    #container.container_new,
    #container.container_new.sam_newgrid {
        width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    #container > #content_left,
    #container.sam_newgrid #content_left {
        width: 100%;
        margin: 0;
        padding: 1em;
        box-sizing:
        border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
    }
    .result_column {
        flex: 1;
        overflow: hidden !important;
        min-width: unset !important;
        padding: 1em;
        box-sizing: border-box;
        margin: 0;
    }
    .result_column > .new-pmd.c-containear,
    .result_column > .result,
    .result_column > .result-op {
        min-width: unset;
        width: 100%;
        padding: 1em 2em;
        margin: 0;
        margin-bottom: 1em;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.5);
        border-radius: .5em;
        transition: background 100ms;
        overflow: hidden !important;
    }
    .result:hover, .result-op:hover {
        background: rgba(255, 255, 255, 0.9);
        transition: background 100ms;
    }
    .result img, .result-op img {
        border-radius: .2em;
    }
    .result:last-child {
        margin-bottom: 0;
    }
    .result .c-span9.c-span-last,
    .result-op .c-span9.c-span-last {
        width: fit-content;
    }
	
	/*调整某些过于刁钻的搜索结果排版*/
	.c-row {
		display: flex;
		width: 100%;
	}
	.c-row > div {
		width: fit-content;
	}
	.c-row > div:first-child {
		flex: 1;
	}
	.c-row > div.dis-relative {
		flex: unset;
	}
	.c-row > div.c-span-last {
		flex: 1;
		width: 0!important;
	}
    .c-border {
        width: auto;
        border: none;
        box-shadow: none;
    }
    #page, .wrapper_new .container_new~#page {
        background-color: transparent;
        padding: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
    }
    #page strong, #page a {
        height: auto;
        background: transparent;
    }
    #page .pc, #page .n {
        background: rgba(255, 255, 255, 0.8);
    }
    #page strong .fk, #page .fk {
        display: none;
    }
    /* 让带图片的搜索结果的文字，不会被图片挤到一边 */
    .new-pmd .c-gap-top-small {
        margin-top: 6px;
        flex-wrap: wrap;
    }
    .c-row > div:first-child {
        height: fit-content !important;
        width: fit-content !important;
        min-width: 10em !important;
        flex: 0;
    }
    .c-row > div.c-span-last {
        flex: 1;
        min-width: 10em !important;
    }
    /* 美化设置面板 */
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 401;
        background: rgba(0, 0, 0, 0.5);
        visibility: collapse;
    }
    .settings {
        width: 90%;
        max-width: 64em;
        height: 90%;
        position: relative;
        padding: 1em 1.5em;
        background: rgba(255, 255, 255, 0.5);
        justify-content: space-evenly;
        align-items: start;
        overflow: auto;
    }
    .settings > * {
        margin: .5em 0;
    }
    .settings > .title {
        margin: .5em 0;
        text-align: center;
        letter-spacing: .5em;
        font-size: 2em;
        font-weight: bold;
    }
    .bg-setting > .hint {
        text-align: center;
        bord-break: break-all;
        font-size: .8em;
        color: #404040
    }
    .bg-setting > textarea {
        resize: none;
        width: 100%;
        height: 8em;
        padding: 1em;
        box-sizing: border-box;
        outline: none;
    }
    .bg-setting > .triponent {
        height: 2em;
        margin: 1em 0;
        box-sizing: border-box;
        border: 1px solid #808080;
        border-radius: 1em;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #FFFFFF;
    }
    .bg-setting > .triponent > * {
        height: 100%;
        background: transparent;
    }
    .bg-setting > .triponent > *:first-child {
        height: auto;
        padding: 0 2em;
    }
    .bg-setting > .triponent > *:nth-child(2) {
        flex: 1;
        min-width: 1em;
        padding: 0 2em;
        box-sizing: border-box;
        border: 0;
    }
    .bg-setting > .triponent > button {
        padding: 0 2em;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    .bg-setting .buttons {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }
    .bg-img-preview-wrapper {
        flex: 1;
        box-sizing: border-box;
        overflow: hidden;
    }
    .bg-img-preview {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: 50% 50%;
        border: .1em solid #808080;
        border-radius: .5em;
        padding: .5em;
        box-sizing: border-box;
        display: none;
    }
    .settings button {
        margin: 0;
        padding: .5em 2em;
        box-sizing: border-box;
        border: 0;
        border-radius: 1.5em;
        outline: none;
        cursor: pointer;
    }
    .settings > .other-settings {
        min-width: 20em;
        margin-left: 1em;
    }
    #wrapper {
        opacity: 1;
        transition: opacity 200ms;
    }
    #wrapper.hidden {
        opacity: 0;
        transition: opacity 200ms;
    }
    .setting-dropdown {
        display: none;
        right: 200px;
        top: 48px;
        user-select: none;
    }
    .d-flex {
        display: flex;
    }
    .flex-column {
        flex-direction: column;
    }
    .flex-grow-1 {
        flex-basis: 0;
        flex-grow: 1;
    }
    .rounded {
        border-radius: 0.2em;
    }
    .frosted-glass {
        backdrop-filter: blur(5px);
    }
    .close-btn {
        position: absolute;
        top: 1em;
        right: 1em;
        cursor: pointer;
        background-color: #ddd;
    }
    .close-btn:hover {
        background-color: #eee;
    }
    .limit-width {
        max-width: 42em;
    }
    /* 用于测试搜索结果长度的幽灵节点 */
    .ghost-experiment-element {
        z-index: -10;
        visibility: hidden;
        position: absolute;
        top: 0;
        left: 0;
    }
    body {
        position: relative;
    }
`;

/**
 * 流程：
 * 
 *   进入网页
 *      ↓
 * 检测当前页面是搜索结果还是首页
 * ↙首页    ↘搜索结果
 * ↓     进行环境设置，并作标记
 * ↓         ↓
 * ↓     进行内容美化
 * ↘        ↙
 * 监听#wrapper_wrapper变化
 *      ↓
 *     结束
 * 
 * 监听到变化后
 *     ↓
 * 检测环境设置标记
 * ↙已标记  ↘未标记
 * ↓     进行环境设置，并作标记
 * ↘        ↙
 * 重新进行内容美化
 * 
 */

(function() {
    'use strict';

    //#region 一些持久化的设置信息
    // 保存先前设置的背景的键（缩写自background）
    const KEY_BG = 'baidu-search-background';
    // 保存先前设置的导航栏可见性的键（缩写自tab visibility）
    const KEY_TV = 'baidu-search-tab-visibility';
    // 是否启用毛玻璃（缩写自frosted glass）
    const KEY_FG = 'baidu-search-frosted-glass';
    // 是否启用欣赏模式（缩写自hide foreground）
    const KEY_HF = 'baidu-search-hide-foreground';
    // 是限定内容宽度（缩写自limit width）
    const KEY_LW = 'baidu-search-limit-width';
    // 守卫循环（缩写自guardian loop）
    const KEY_GL = 'baidu-search-guardian-loop';
    // 滚动时隐藏搜索栏（缩写自hide head）
    const KEY_HH = 'baidu-search-hide-head';
    // 结果列数（缩写自column count）
    const KEY_CC = 'baidu-search-column-count';
    //#endregion

    // const _settings = {
    //     background: null,
    //     tabVisibility: true,
    //     frostedGlass: true,
    //     hideForeground: true,
    // };

    const SETTINGS = {
        // 获得背景，默认为"#FFFFFF"
        get background() {
            return GM_getValue(KEY_BG, '#FFFFFF');
        },
        // 设置背景，如果是使用DataUrl可能会导致些许卡顿
        set background(val) {
            GM_setValue(KEY_BG, val);
            // 由于在设置新的背景后，background-*的样式会失效，故需要重新设置
            document.body.style = `
            background: ${val};
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-attachment: fixed;`;
        },

        // 获取导航栏可见性，默认为可见
        get tabVisibility() {
            return GM_getValue(KEY_TV, true);
        },
        // 设置导航栏可见性
        set tabVisibility(val) {
            GM_setValue(KEY_TV, !!val);
            const tab = findId('s_tab'); // 图片、文库等标签
            tab.style = `
            visibility: ${val ? 'visible' : 'hidden'};
            height: ${val ? 'auto' : '0'};`;
        },

        // 获取毛玻璃是否开启，默认为开启
        get frostedGlass() {
            return GM_getValue(KEY_FG, true);
        },
        // 设置毛玻璃开关
        set frostedGlass(val) {
            GM_setValue(KEY_FG, !!val);
            [
                document.querySelector("#s_tab"),
                document.querySelector("#form > div"),
                ...document.getElementsByClassName('result'), 
                ...document.getElementsByClassName('result-op')
            ].filter(e => !!e).forEach(e => {
                if (val) {
                    e.classList.add('frosted-glass');
                } else {
                    e.classList.remove('frosted-glass');
                }
            });
        },

        // 获取欣赏模式是否开启，默认为关闭
        get hideForeground() {
            return GM_getValue(KEY_HF, false);
        },
        // 设置欣赏模式开关
        set hideForeground(val) {
            GM_setValue(KEY_HF, !!val);
        },

        // 限定内容宽度，默认为开启
        get limitWidth() {
            return GM_getValue(KEY_LW, true);
        },
        // 设置限定内容宽度
        set limitWidth(val) {
            GM_setValue(KEY_LW, !!val);
            [...document.getElementsByClassName('result_column')]
            .filter(e => !!e).forEach(e => {
                if (val) {
                    e.classList.add('limit-width');
                } else {
                    e.classList.remove('limit-width');
                }
            });
        },

        // 守卫循环，默认为开启
        get guardianLoop() {
            return GM_getValue(KEY_GL, true);
        },
        // 设置限定内容宽度
        set guardianLoop(val) {
            GM_setValue(KEY_GL, !!val);
            if (val) {
                if (STATE.guardianLoopPid === null) {
                    STATE.guardianLoopPid = setInterval(cleanUpNuisances, 1000);
                }
            } else {
                if (STATE.guardianLoopPid !== null) {
                    clearInterval(STATE.guardianLoopPid);
                    STATE.guardianLoopPid = null;
                }
            }
        },

        // 列数，默认为2
        get columnCount() {
            return GM_getValue(KEY_CC, 2);
        },
        // 设定列数
        set columnCount(val) {
            GM_setValue(KEY_CC, Number(val) || 2);
            distributeResults();
        },
        
        get hideHead() {
            return GM_getValue(KEY_HH, true);
        },
        set hideHead(val) {
            GM_setValue(KEY_HH, !!val);
            if (!!val) {
                $("#head")[0].classList.add("absolute");
            } else {
                $("#head")[0].classList.remove("absolute");
            }
        },
    };

    // 状态
    const STATE = {
        // 是否已经设置环境，例如设置页面的按钮一类
        hasSetupEnv: false,
        // 是否已经处理过搜索建议的样式
        hasSetupBdsug: false,
        // 守卫循环PID
        guardianLoopPid: null,
    };


    // 创建DOM节点的简写
    function make(tag, config = {}) {
        return Object.assign(document.createElement(tag), config);
    }

    // 根据id查找DOM节点的简写
    function findId(id) {
        return document.getElementById(id);
    }

    // 向DOM节点添加子节点
    function append(node, ...children) {
        children.forEach(c => node.appendChild(c));
        return node;
    }

    let overlay = null;

    // 设置环境，如用于打开设置面板按钮
    function setupEnv() {
        
        //#region 创建设置面板，当前只能设置背景内容
        // 不使用innerHTML嵌入，虽然降低了可读性，但是方便获取DOM
        // 浮层
        overlay = make('div', {className: 'overlay'});

        function setOverlay(visibility) {
            overlay.style.visibility = visibility ? 'visible' : 'collapse';
        }

        // 设置面板
        const settings = make('div', {className: 'settings rounded d-flex'});

        const bgSetting = make('div', {className: 'bg-setting flex-grow-1'});
        // 标题
        const title = make('h2', {className: 'title', innerText: '背景设置'});
        // 提示
        const hint = make('p', {className: 'hint', 
            innerText: '设置背景时，先选择颜色或者文件，之后点击“使用该颜色”或者“使用该图片”，' + 
            '之后会看见文本框中的样式代码发生改变，' + 
            '此时点击“确定”以确认更改，否则点击“取消”以返回。' + 
            '目前URL不支持预览，但是可以使用（图片载入耗时取决于网络环境）'
        });
        // 背景样式预览
        const txtBgPreview = make('textarea', {className: 'bg-preview rounded'});
        // 颜色输入
        const iptColor = make('input', {type: 'color', className: 'bg-input'});
        const divColor = append(make('div', {className: 'triponent'}),
            make('span', {innerText: '使用纯色'}),
            iptColor,
            make('button', {innerText: '使用该颜色', onclick: () => txtBgPreview.value = iptColor.value})
        );

        // 图片输入
        const divFile = append(make('div', {className: 'triponent'}),
            make('span', {innerText: '图片'}),
            make('input', {type: 'file', accept: 'image/*', className: 'bg-input', onchange: e => {
                if (!e.target.files.length) return;
                const reader = new FileReader();
                reader.onload = () => {
                    imgFile.src = reader.result;
                    imgFile.classList.remove('hidden');
                };
                reader.readAsDataURL(e.target.files[0]);
            }}),
            make('button', {innerText: '使用该图片', onclick: () => txtBgPreview.value = `url('${imgFile.src}')`}) // 由于使用的是DataURL，故会产生些许卡顿
        );

        // 图片预览
        const imgFileWrapper = make('div', {className: 'bg-img-preview-wrapper'});
        const imgFile = make('img', {className: 'bg-img-preview hidden', alt: '背景预览'});
        imgFileWrapper.appendChild(imgFile);

        // 图片URL输入
        const iptUrl = make('input', {type: 'url', className: 'bg-input'});
        const divUrl = append(make('div', {className: 'triponent'}),
            make('span', {innerText: '图片URL'}),
            iptUrl,
            make('button', {innerText: '使用该图片URL' ,onclick: () => txtBgPreview.value = `url('${iptUrl.value}')`})
        );

        // 按钮栏
        const divButtons = append(make('div', {className: 'buttons'}),
            // 确认按钮
            make('button', {innerText: '选定该背景', onclick: () => {
                setOverlay(false);
                SETTINGS.background = txtBgPreview.value;
            }}), 
            // 取消按钮
            make('button', {innerText: '取消', onclick: () => setOverlay(false)})
        );

        append(bgSetting, title, hint, txtBgPreview, divColor, divFile, imgFileWrapper, divUrl, divButtons);

        // 其它设置选项
        let allowSetColumnCount = true;
        const otherSettings = append(make('div', {className: 'other-settings'}),
            make('h2', {className: 'title', innerText: '其它设置'}),
            append(make('div'), // 导航栏可见
                make('input', {type: 'checkbox', checked: SETTINGS.tabVisibility, onchange: e => SETTINGS.tabVisibility = e.target.checked}),
                make('span', {innerText: '导航栏可见'})
            ),
            append(make('div'), // 毛玻璃
                make('input', {type: 'checkbox', checked: SETTINGS.frostedGlass, onchange: e => SETTINGS.frostedGlass = e.target.checked}),
                make('span', {innerText: '启用毛玻璃'})
            ),
            append(make('div'), // 欣赏模式
                make('input', {type: 'checkbox', checked: SETTINGS.hideForeground, onchange: e => SETTINGS.hideForeground = e.target.checked}),
                make('span', {innerText: '启用欣赏模式'})
            ),
            append(make('div'), // 限定双列宽度
                make('input', {type: 'checkbox', checked: SETTINGS.limitWidth, onchange: e => SETTINGS.limitWidth = e.target.checked}),
                make('span', {innerText: '限定双列宽度'})
            ),
            append(make('div'), // 守卫循环
                make('input', {type: 'checkbox', checked: SETTINGS.guardianLoop, onchange: e => SETTINGS.guardianLoop = e.target.checked}),
                make('span', {innerText: '开启守卫循环'})
            ),
            append(make('div'), // 滚动隐藏搜索栏
                make('input', {type: 'checkbox', checked: SETTINGS.hideHead, onchange: e => SETTINGS.hideHead = e.target.checked}),
                make('span', {innerText: '滚动隐藏搜索栏'})
            ),
            append(make('div'), // 设置列数
                make('input', {type: 'number', min: "1", value: SETTINGS.columnCount, onchange: e => SETTINGS.columnCount = Number(e.target.value), style: "width: 4em" }),
                make('span', {innerText: '设定列数'})
            )
        );

        append(settings, bgSetting, otherSettings, make('button', {innerText: '关闭', className: 'close-btn', onclick: () => setOverlay(false)}));
        overlay.appendChild(settings);
        document.body.appendChild(overlay);

        //#endregion

        //#region 设置按钮
        // 在页面右上角的连接处，增加一个设置菜单的<a>标签（实际上是仅仅是按钮的功能，但是使用<a>可以保持原有样式）
        const btnSettings = make('a', {innerText: '美化设置', className: 'btn-open-settings', onclick: () => {
            setOverlay(true);
            txtBgPreview.value = SETTINGS.background;
        }});
        
        // 在页眉处添加用于打开设置面板的按钮，以及开关导航的按钮
        const u = findId('u'); // 页眉处的链接
        if (u.insertBefore) {
            u.insertBefore(btnSettings, u.children[0]);
        } else {
            u.appendChild(btnSettings);
        }
        //#endregion

        // 双击显示背景
        const wrapper = findId('wrapper');
        document.body.addEventListener('dblclick', () => {
            if (SETTINGS.hideForeground) {
                wrapper.classList.add('hidden');
            }
        });
        document.body.addEventListener('click', () => wrapper.classList.remove('hidden'));

        setOverlay(false);

        // 监听搜索建议
        const kw = findId('kw');
        const bdsugListener = () => {
            if (!STATE.hasSetupBdsug) {
                const bdsug = document.querySelector("#form > div.bdsug.bdsug-new");
                if (bdsug) {
                    if (SETTINGS.frostedGlass) {
                        bdsug.classList.add('frosted-glass');
                    } else {
                        bdsug.classList.remove('frosted-glass');
                    }
                    STATE.hasSetupBdsug = true;
                    kw.removeEventListener('input', bdsugListener);
                    kw.removeEventListener('click', bdsugListener);
                }
            }
        }
        kw.addEventListener('input', bdsugListener);
        kw.addEventListener('click', bdsugListener);

        // 应用设置
        Object.assign(SETTINGS, SETTINGS);

        // 标记
        STATE.hasSetupEnv = true;
    }

    const ghostExperimentElement = make("div", { className: "ghost-experiment-element" });
    document.body.appendChild(ghostExperimentElement);

    // 进行内容美化
    function prettify() {

        // 重新载入样式
        reloadStyle();

        // 移除冗杂内容
        [
            'content_right', // 右侧推荐内容
            'rs', // 相关关键词
            'rs_top_new', // 新的相关词
            'super_se_tip' // 错字提示
        ].forEach(id => {
            const elem = findId(id);
            if (elem && elem.remove) elem.remove();
        });

        distributeResults();

        // 在进行新的搜索过后，导航栏会重现，所以要重新设置导航
        SETTINGS.tabVisibility = SETTINGS.tabVisibility;
        SETTINGS.limitWidth = SETTINGS.limitWidth;
        SETTINGS.hideHead = SETTINGS.hideHead;
        // 在进行新的搜索过后，浮层会消失，所以要再添加进DOM
        document.body.appendChild(overlay);
        document.body.appendChild(ghostExperimentElement);


    }

    // 搜索结果，不是搜索结果（如广告、推荐、热搜等）为0，普通搜索为1，靠前搜索为2，其它重要但不是搜索结果的为-1
    const RESULT_LEVEL_OTHER = -1;
    const RESULT_LEVEL_NOT_RESULT = 0;
    const RESULT_LEVEL_RESULT = 1;
    const RESULT_LEVEL_RESULT_OP = 2;

    function getResultLevel(elem) {
        const resultClassList = elem.classList;
        if (!resultClassList || (elem.getAttribute("tpl") || "").startsWith("right_")) return RESULT_LEVEL_NOT_RESULT;
        else if (resultClassList.contains("result")) return RESULT_LEVEL_RESULT;
        else if (resultClassList.contains("result-op")) return RESULT_LEVEL_RESULT_OP;
        else return RESULT_LEVEL_OTHER;
    }

    // 将搜索结果重新分配到不同的列中
    function distributeResults() {
        // const container = findId('container'); // 主要内容：搜索结果与页码
        const content = findId('content_left'); // 搜索结果列表
        const results = [...document.getElementsByClassName('result'), ...document.getElementsByClassName('result-op')]; // 搜索结果，一般10个，而且id分别以数字1~10命名
        // const foot = findId('foot'); // 页脚：举报、帮助、用户反馈

        // 先移除所有元素，以封杀所有冗杂内容
        // [...content.childNodes].forEach(node => node.remove());

        // 移除先前的列
        [...content.childNodes].filter(elem => getResultLevel(elem) < 0).forEach(node => node.remove());

        // 双列排布搜索结果
        const columnCount = SETTINGS.columnCount;
        const columns = Array.from(Array(columnCount), () => make('div', {className: 'result_column'}));
        columns.forEach(column => content.appendChild(column));
        // 重新将实际的搜索结果分两列填充至容器
        results.forEach(appendResult);
        
        // 添加新的搜索结果，哪怕后来的有新的结果，也能被显示，而不会打乱排版
        function appendResult(elem) {

            const resultLevel = getResultLevel(elem);
            if (resultLevel <= 0) return;

            if (SETTINGS.frostedGlass) {
                elem.classList.add('frosted-glass');
            }

            elem.remove();
            ghostExperimentElement.appendChild(elem);
            setTimeout(() => {
                const height = elem.getBoundingClientRect().height;
                elem.remove();
                // console.log(height, elem);

                // console.log(columns.map(c => c.scrollHeight));
                let column = columns[0];
                for (let i = 1; i < columns.length; i++) {
                    const c = columns[i];
                    if (c.scrollHeight < column.scrollHeight) {
                        column = c;
                    }
                }
                if (resultLevel === 2 && column.insertBefore) {
                    let firstNormalResult = column.firstChild;
                    for (let e of column.childNodes) {
                        if (!e.classList.contains('result-op')) {
                            firstNormalResult = e;
                            break;
                        }
                    }
                    column.insertBefore(elem, firstNormalResult);
                } else {
                    column.appendChild(elem);
                }

                // 阻止双击事件冒泡，这样只有双击没有被遮挡的背景才能隐藏元素
                elem.addEventListener('dblclick', event => event.stopPropagation());
                // cleanUpNuisances();
            }, 0);
        }

        // 监听新的结果或者广告的添加，度娘有时候会在脚本载入后添加新的搜索结果，导致排版错乱，所以在这里通吃进入结果列表
        // if (MutationObserver) { // 如果有MutationObserver API，吐槽：Sky Killed百度封杀了MutationObserver，因此这段代码很久没有更新了
        //     const resultListOvserver = new MutationObserver(mutations => mutations.forEach(mutation => {
        //         if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        //             [...mutation.addedNodes].forEach(node => {
        //                 node.remove();
        //                 if (node.classList.contains('result') || node.classList.contains('result-op')) {
        //                     appendResult(node);
        //                 }
        //             });
        //         }
        //     }));
        //     resultListOvserver.observe(content, {childList: true});
        // } else { // 否则就使用旧的Mutation Events API
        //     document.body.addEventListener('DOMNodeInserted', event => {
        //         // console.log(event);
        //         if (event.relatedNode.id === content.id) {
        //             const target = event.target;
        //             const resultLevel = getResultLevel(target);
        //             if (resultLevel === 0) {
        //                 target.remove();
        //             } else if (resultLevel > 0) {
        //                 appendResult(target);
        //             }
        //         }
        //     });
        // }
    }

    // function autoHideHead() {
    //     $(document).scroll(function (event) {
    //         // console.log(event);
    //         var scroH = $(document).scrollTop();  //滚动高度

    //         if (scroH > 2) {
    //             $("#head").css("height", "0px");
    //             //console.log("hide head!");
    //         } else {
    //             $("#head").css("height", "64px");
    //             //console.log("show head!");
    //         }
    //     });
    // }

    // 监听内容的变化
    // 2020年7月22日左右，百度更新之后，在搜索页面搜索新的关键词，不会刷新页面，而是直接修改原有DOM，所以会导致样式出问题
    function watchContent() {
        // 方案一：直接在搜索新关键词点击搜索按钮时，直接刷新
        // const btnSearch = findId('su');
        // btnSearch.addEventListener('click', () => location.reload());
        // 方案二：指定form元素的target直接在当前页面刷新
        // const form = findId('form');
        // form.target = '_self';
        // 方案三：监听DOM改动，经过观察发现，
        // div#wrapper_wrapper 在首页即存在，
        // 更新DOM的时候，#wrapper_wrapper自己不会改变，而其子元素会更新
        // 虽然该方法也可行，但是会因为未知原因导致样式失效

        // 但是是一个空的标签，当接收到搜索结果之后，就会用内容将其填充，但是它本身不会变
        const wrapper = findId('wrapper_wrapper');
        wrapper.addEventListener('DOMNodeInserted', event => {
            if (event.relatedNode === wrapper && event.target.id === 'container') {
                if (!STATE.hasSetupEnv) {
                    setupEnv();
                }
                // 重新载入样式的工作被放到了prettify()内部了
                prettify();
            }
        });

        // 已经转为CSS实现，原因是JS实现有问题：
        // 本应该是：向下滚动隐藏，向上滚动显示，但是scroll event无法获取是向上还是向下滚动
        // 所以先用简单的CSS方式实现
        // autoHideHead();

    }

    // 清空一些会扰乱排版的广告
    function cleanUpNuisances() {
        [
            ...(document.querySelector('#content_left') || { childNodes: [] }).childNodes,
            ...document.querySelectorAll('*[cmatchid]'),
        ]
        .filter(n => !n || !n.classList || !n.classList.contains('result_column'))
        .forEach(n => n.remove());
    }

    // 初始化，读取先前设置的背景与导航栏可见性
    function initialize() {
        if (isSearchResoultPage()) {
            setupEnv();
            prettify();
        }
        watchContent();
    }

    // 检测当前页面是否是搜索结果页面，因为如果是在首页执行该脚本会造成排版问题
    function isSearchResoultPage() {
        return (window.location.search || '').indexOf('wd=') >= 0;
    }

    // 重新载入样式
    function reloadStyle() {
        GM_addStyle(GLOBAL_STYLE);
    }

    // 执行初始化
    initialize();

})();