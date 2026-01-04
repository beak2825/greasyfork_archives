// ==UserScript==
// @name         链接预览
// @name:zh-cn   链接预览
// @name:en      Link Previewer
// @namespace    https://greasyfork.org/zh-CN/users/1073-hzhbest
// @version      2.6
// @description  鼠标指向链接标识图标预览链接网页
// @description:zh-cn  鼠标指向链接标识图标预览链接网页
// @description:en Hovering to preview a link
// @author       hzhbest
// @match        http*://*/*
// @exclude      https://mega.nz/file/*
// @exclude      https://*.github.com/*
// @exclude      https://addons.mozilla.org/*
// @exclude      https://*.cloudflare.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/483134/%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483134/%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

// 2.6: 禁用状态时清除图标，增加识别链接的成功率（YouTube），优化代码，调整图标插入位置规避-webkit-line-clamp影响
// TODO： 长按（隐藏图标）模式

(function () {
    'use strict';

    // --------自定义区-------- //
    const scriptName = "链接预览";
    const recordPrevHist = false;           // 将预览链接记入历史：T/F
    const minHgap = 30, minVgap = 30;       // 预览窗距窗口边缘水平、垂直最小距离（minHgap同时为距初始位置最小水平距离）：像素
    const minW = 50, minH = 40;             // 预览窗最小宽高：像素
    var winWidth = 700, winHeight = 550;    // 预览窗默认宽、高：像素
    const scale = 0.9;                      // 预览窗内页面放大率：(0~1]
    const animationTime = 0.5;              // 动画时长：秒
    const iconSize = 20;                    // 图标放大后大小：像素
    const iconTrans = 0.7;                  // 图标放大后不透明度：(0~1)
    const pre = "░░░░░░ ";                  // 预览窗拖放手柄外观：字符串
    var delaySec = 1;                       // 触发预览等候延时：秒
    const more_delaySec = 1;                // 对小链接增加等候延时：秒
    const showLeftSizer = false;            // 显示左侧调整大小手柄：T/F
    const closeOnScoll = false;             // 在预览窗外滚动滚轮关闭预览窗：T/F
    var default_pinned = 0;                 // 初始钉住状态：{0:否，1:是}
    var default_enabled = 1;                // 初始启用状态：{0:否，1:是}
    const toggleHotkey = "C-M-v";           // 切换启用状态快捷键（Ctrl：“C-”，Alt/⌥：“M-”，字母键大写则代表含Shift键）
    var onClick = 0;                        // 是否点击预览默认值：{0:否，1:是}
    const specialLnkArr = [                 // 因链接所在元素含position样式属性而需排除的特征数组
        {
            name: "Google主链接",
            scrurl: /google\.com\/search\?/,
            linkslc: "#rso .g a:has(h3)"
        }
    ];
    const urlSubstArr = [                    // 网址替换规则数组,{命名，链接网址正则，关键编号正则，替换网址模板，出错特征元素}
        {
            name: "B站",
            scrurl: /bilibili\.com\//,
            coreID: /(av|BV)[^\?&\/]+/,
            desturl: "https://player.bilibili.com/player.html?bvid=--coreID--&high_quality=1&autoplay=1"
            // desturl: "https://www.bilibili.com/blackboard/html5mobileplayer.html?bvid=--coreID--&autoplay=1" //2024-04-28发现不会自动播放
        },
        {
            name: "油管",
            scrurl: /youtube\.com\//,
            coreID: /(?<=(watch\?v=|\/shorts\/|\/live\/))[^&\/]+/,
            desturl: "https://www.youtube.com/embed/--coreID--",
            errorElem: "div.ytp-error"
        },
        {
            name: "油管短",
            scrurl: /youtu\.be\//,
            coreID: /(?<=(\.be\/))[^&\/]+/,
            desturl: "https://www.youtube.com/embed/--coreID--",
            errorElem: "div.ytp-error"
        },
        {
            name: "西瓜",
            scrurl: /ixigua\.com\//,
            coreID: /(?<=\/)\d+\?/,
            desturl: "https://www.ixigua.com/iframe/--coreID--autoplay=1"
        },
        {
            name: "PH",
            scrurl: /pornhub\.com\//,
            coreID: /(?<=viewkey=).+/,
            desturl: "https://www.pornhub.com/embed/--coreID--"
        }
    ];
    // --------自定义区结束--------//

    const preID = "__link__prev_win"        // 预览窗id
    const uSA_len = urlSubstArr.length;
    const ixonimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAoUlEQVQ4y8XSyw3CMBAE0AekkHTBBZGkCa40QA9AOVADEkGiEJfCxZEsk+8F5mLZs7Mzay3/xmpm3Tm7v9DCeqHhDhdU3UORkHVKJAi4osEJj5RME1SxiZ64De444J2SRVbcRjdZslsUP7Efa6BH3DkHHHOD9UxxG8VlXjTUoExit2MRh0YI2MZzFGMjTIr7EtQTf/I1zmbBWoe4E7OS/Q4fA1sbIN+Dzp4AAAAASUVORK5CYIIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
    const inonimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAATr4AAE6+AGeOBvEAAAA3klEQVQ4y83SPUpDURAF4M8YooUiIi7BQBaQ2lqirZjnVrIFCwsLDbbZgLoAO8FC7EJcgNgZUpvYTOByee/513hguDB3zpm5cy5/xOovOI0qgUZJ5FjDBbbxnF5s4hHjLPYz8jVmOFwmm0n3PdzhJXIreM06H6OP23y0LbyjVzJ2C8O8c51AGwOsB/kqyEd1m00FephiF5dfkZs1Vp0H8RQ3kS/iHJV6mmADJziLRe4kAkXlpwgsMI8Y4AEHP3nCPTohtMTbdwUKdCtq5+HQpEzgA09R0K5xa5p8tH+CT7aEK2vlnm2YAAAAAElFTkSuQmCCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
    const loadimg = "data:image/png;base64,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";
    const _txt = {
        swc: [["hover", "click"], ["悬停", "点击"]],
        ntc: ["Switched to --swc-- preview mode", "已切换到--swc--预览模式"],
        gmc: ["Toggle preview mode", "切换预览模式"],
        swp: [["Pinless", "Pinned"], ["非钉住", "钉住"]],
        ntp: ["Switched to --swp-- mode by default", "已切换到默认--swp--模式"],
        gmp: ["Toggle default pinned", "切换默认钉住模式"],
        enpin: ["Pin Preview Win", "钉住预览窗"],
        unpin: ["Unpin Preview Win", "解钉预览窗"],
        optab: ["Open this page in a new tab", "在新标签页打开当中页面"],
        swt: [["disable", "enable"], ["禁用", "启用"]],
        ntt: ["Switched to --swt-- status", "已切换到--swt--状态"],
        gmt: ["Toggle preview status", "切换预览状态"],
        gmd: ["Set / Unset Preview Win Size for this DOMAIN", "设置／删除当前域名下预览窗大小"],
        msd: ["Click \"SET\" button to set Preview Win Size (--wh--) for [--dm--].", "点击“设置”按钮为[--dm--]设置预览窗大小（--wh--）。"],
        mdd: ["\n OR \nClick \"UNSET\" button to remove Size setting for [--dm--].", "\n 或 \n点击“删除”按钮删除[--dm--]的预览窗大小设置。"],
        bsd: [["SET", "SET √"], ["设置", "设置 √"]],
        bud: [["UNSET", "UNSET √"], ["删除", "删除 √"]],
        bcd: ["CANCEL", "取消"]
    }
    //language detection
    const _L = (navigator.language.indexOf('zh-') == -1) ? 0 : 1;
    const is_onClick = "Link_preview_on_click";
    const is_default_pin = "Link_preview_default_pinned";
    const is_default_enable = "Link_preview_default_enabled";
    onClick = GM_getValue(is_onClick, onClick);
    default_pinned = GM_getValue(is_default_pin, default_pinned);
    default_enabled = GM_getValue(is_default_enable, default_enabled);
    document.body.classList.toggle("__link_pre_clk", (onClick == 1));     // 全局点击样式标志
    document.body.classList.toggle("__link_pre_disable", (default_enabled == 0));     // 全局禁用样式标志
    delaySec = (onClick) ? delaySec / 2 : delaySec;

    var perDomainWinSize, default_pDWS, dialogDWS, btnsDWS, matchedDWS = -1;
    const pDWS = "Link_preview_domain_winsize";
    default_pDWS = [];
    var spDWS = GM_getValue(pDWS);
    if (!!spDWS && spDWS.slice(0, 1) === "[") {
        perDomainWinSize = JSON.parse(spDWS);               // 在储存中获取域名预览窗大小设置
    } else {							//否则将默认设置写入储存
        GM_setValue(pDWS, JSON.stringify(default_pDWS));
    }
    var site = location.host;
    for (let i = 0; i < perDomainWinSize.length; i++) {     // 若域名匹配，则以记录的宽高为默认宽高
        if (perDomainWinSize[i].domain == site) {
            winHeight = perDomainWinSize[i].h;
            winWidth = perDomainWinSize[i].w;
            matchedDWS = i;
        }
    }

    const domainRegex = /(?<=:\/\/)[^\/]+/;
    const id = "__link__prev";
    const css = `
        /* 链接样式 */
        a.__link__preved {
            outline: 3px solid #3e3ed3;
        }
        a.___prevlink.__pr {
            position: relative;
        }
        /* 图标样式 */
        a.___prevlink>img.___previcon {
            width: 16px !important; height: 16px !important;
            opacity: 0%; transition: opacity 0.5s ease-out, background 0s;
            position: absolute; pointer-events: auto !important;
            display: inline-block !important; margin: 0 !important;
            max-width: initial !important; max-height: initial !important;
        }
        a.___prevlink>img.___previcon:hover {
            background: #3e3ed3 !important; filter: invert(1) hue-rotate(150deg);
            transition: background ${delaySec}s, filter ${delaySec}s !important;
        }
        body.__link_pre_clk a.___prevlink>img.___previcon:hover {
            background: #c652e6 !important; outline: 2px solid #76268d !important; filter: invert(1) hue-rotate(150deg);
            transition: background 0.1s, filter 0.1s !important;
        }
        body.__link_pre_disable a.___prevlink>img.___previcon {
            display: none !important;
        }
        a.___prevlink>img.___previcon.__moredelay:hover, body.__link_pre_clk a.___prevlink>img.___previcon.__moredelay:hover {
            transition: background ${delaySec + more_delaySec}s, filter ${delaySec + more_delaySec}s, outline 0s ease ${delaySec + more_delaySec}s !important;
            outline: 3px solid #be18ec !important;
        }
        *:hover>a.___prevlink>img.___previcon {
            opacity: 30%;
        }
        a.___prevlink:hover {
            outline: 2px dotted #939393;
        }
        a.___prevlink:hover>img.___previcon {
            opacity: ${iconTrans}; background: white; border: 1px solid #8d8d8db1;
            transition: opacity 0.5s linear; z-index: 10008;
            transform: scale(${iconSize / 16});
        }
        /* 预览窗样式 */
        div#${preID} {
            opacity: 0; position: absolute; z-index: 1000001; box-shadow: 1px 1px 7px 1px #717171;
            padding: 0; margin: 0; background-color: #ffffff; transition: ${animationTime}s ease;
        }
        div#${preID}.__close {
            transition: 0s !important; display: none;
        }
        div#${preID}.__loading {
            background: url(${loadimg}) no-repeat center center; background-color: #e7e7e7;
            box-shadow: 1px 1px 7px 1px #d8db7c !important;
        }
        div#${preID}.__visible {
            opacity: 1; transition: 0.2s !important;
        }
        div#${preID}.visible .__link__prev_ifr {
            border: none; transform: scale(${scale});
            max-width: unset !important; width: calc(100% / ${scale});
            max-height: unset !important; height: calc(100% / ${scale});
        }
        div#${preID}.__onmove, div#${preID}.__onsize, div#${preID}.__onpin{
            transition: 0s !important;
        }
        div#${preID}.__onmove {
            /* opacity: 0.7; */
        }
        div#${preID}.__pinned {
            box-shadow: 1px 1px 7px 1px #a36835; position: fixed;
        }
        /* 关闭按钮样式 */
        @keyframes rotating_button {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        div#${preID}>.__link__clos_btn {
            position: absolute; top: -10px; right: -10px; z-index: 10010;
            line-height: 24px; width: 24px; height: 24px;
            color: white; font-family: Consolas; font-size: 16px; text-align: center;
            background: #df2020; border: 1px solid black; border-radius: 50%;
            box-shadow: 1px 1px 5px #333; cursor: default; padding: 0 !important; margin: 0;
        }
        div#${preID}>.__link__clos_btn.__loading {
            animation: 3s linear 0s infinite rotating_button; background: #d76565;
        }
        div#${preID}>.__link__clos_btn.__loading:hover {
            animation: none; background: #df2020;
        }
        div#${preID}>.__link__clos_btn:hover {
            outline: 3px solid #be3737a2;
        }
        div#${preID}>.__link__clos_btn.__close {
            display: none;
        }
        /* 拖动手柄样式 */
        div#${preID}>div.__link__prev_mv {
            position: absolute; top: -5px; left: 0px; z-index: 10010;
            height: 6px; width: 30px; border: 1px solid #242424; background: #3e3e3e; cursor: move;
            border-radius: 3px; overflow: hidden; max-width: 95%;
            font-size: 14px !important; color: #d7d7d7; line-height: 19px;
            display: grid; grid-template-columns: auto auto auto 1fr;
        }
        div#${preID}>div.__link__prev_mv>* {
            display: block;
        }
        div#${preID}:hover>div.__link__prev_mv {
            height: 20px; top: -20px; width: auto;
        }
        div#${preID}>div.__link__prev_mv:hover {
            color: #e0a52e;
        }
        div#${preID}.__onmove>div.__link__prev_mv {
            background: #6f6122; height: 30px; top: -20px; width: fit-content;
        }
        div#${preID}.__loading>div.__link__prev_mv {
            background: #aa9537;
        }
        div#${preID} .__link__prev_ttl {
            font-size: 14px !important; font-family: Arial; white-space: nowrap; margin: 0 3px; overflow: hidden;
            text-overflow: ellipsis; width: 100%;
        }
        div#${preID}>.__link__prev_rs {
            height: 4px; width: 4px; border: 1px solid #616161; color: #9a9276; font-size: 13px;
            position: absolute; right: 0; bottom: 0; z-index: 10011; background: #3e3e3e67;
            transition: 0.3s ease-out; font-size: 10px; line-height: 10px; overflow: hidden;
            cursor: nwse-resize;
        }
        div#${preID}>.__link__prev_rs.__rs_l {
            left: 0; right: unset !important; cursor: nesw-resize !important;
        }
        div#${preID}:hover>.__link__prev_rs {
            background: #3e3e3e; height: 12px; width: 12px;
        }
        div#${preID}>.__link__prev_rs:hover {
            border-color: #2c96e2af; height: 18px; width: 18px;
        }
        div#${preID}.__onsize>.__link__prev_rs.__onsize {
            height: 40px; width: 60px; transition: 0s; color: #e0a52e
        }
        /* 顶栏按钮样式 */
        div#${preID} .__link__prev_btn {
            height: 18px; width: 18px !important; box-sizing: content-box; border-width: 0 1px; border-style: solid;
            vertical-align: bottom; padding: 0 6px;text-align: center; cursor: pointer;
        }
        div#${preID} .__link__prev_btn:hover {
            border-color: #f1db27; color: #f1db27; background: #ffffff36;
        }
        div#${preID} .__link__prev_btn:active {
            background: #ffffff82;
        }
        div#${preID}.__pinned .__link__prev_btn.__pinbtn {
            background: #f5bc4f82; font-weight: 800;
        }
    `;
    addCSS(css, id);                                            // 添加的style节点添加id，用于判断是否需重添加
    if (window.self == window.top) {
        window.addEventListener('load', function () {
            GM_registerMenuCommand(_txt.gmc[_L], changeMode);
            GM_registerMenuCommand(_txt.gmp[_L], changeDfpin);
            GM_registerMenuCommand(_txt.gmt[_L], changeStatus);
            GM_registerMenuCommand(_txt.gmd[_L], setDWSdlg);
        }, false);
    }
    document.addEventListener('keydown', keyhandler, false);
    var specSiteInd = -1;
    for (let i = 0; i < specialLnkArr.length; i++) {
        if (specialLnkArr[i].scrurl.test(location.href)) {
            specSiteInd = i;
            break;
        }
    }
    var previewwin, pre_ir, pinbtn, closebtn, movehand, titlebox, ondrag, resizehand, resizehand2, openbtn;
    var rsdrag, rsldrag, winpos, pinned, opened;    // winpos{x,y,w,h}：预览窗（若显示）的位置和大小
    var timer, linkprev, prevedUrl, mousepos, vscale, moretimer;
    var isiniframe = false, isinprevwin = false;
    pinned = (default_pinned == 1);
    opened = false;                     // 预览窗开启状态
    winpos = { h: winHeight, w: winWidth };

    if (window.self != window.top) {    // 只在iframe中使用的事件处理
        isiniframe = true;
        window.addEventListener('message', (e) => {  // 接收来自预览窗（外部）的信息，若有，则标识为预览窗内并回发消息
            // console.log(e.data);
            if (e.data.from == '__link__prev_top') {
                isinprevwin = true;
                var vaspect;
                setTimeout(() => {
                    if (!!e.data.errorElem && !!document.querySelector(e.data.errorElem)) { // 若找到errorElem，则重载原网址；应对yt“只能在网页播放”的视频
                        window.self.location.href = e.data.oriUrl;
                        return;
                    }
                    var videoElem = document.querySelector('video');
                    if (!!videoElem) {
                        videoElem.addEventListener('loadeddata', () => {
                            if (!!videoElem.videoHeight) {       // 若存在视频元素且有高度（不管是否替换过网址）
                                vaspect = videoElem.videoWidth / videoElem.videoHeight;
                                window.top.postMessage({
                                    from: '__link__prev_invideo',
                                    vaspect: vaspect
                                }, '*');
                            }
                        });
                    }
                }, 600);
                window.top.postMessage({        // 向top窗口发送消息，报告当前页面url
                    from: '__link__prev_inwin',
                    url: window.self.location.href
                }, '*');
                makePrevWin();                  // 在预览窗内嵌套预览窗
            }
        }, true);
    } else {
        makePrevWin();                  // 在顶层窗口建预览窗
        document.addEventListener('keydown', (evt) => {
            if (evt.key == "Escape" && isPrevVisual()) {    // ESC键按下时若预览窗可见，则关闭预览窗
                hidePrevWin();
            }
        });
        window.addEventListener('message', function (e) {   // 处理iframe发来的消息
            if (e.data.from == '__link__prev_inwin') {
                if (e.data.url && isPrevVisual()) {         // 向预览窗传输iframe中的实际网址
                    openbtn.dataset.url = e.data.url;
                    linkprev.classList.add("__link__preved");   // 预览成功再显示链接被预览的状态
                }
            } else if (e.data.from == '__link__prev_iframe') {
                if (!!e.data.prevhref) {
                    callPrevWin(e.data.prevod, e.data.prevhref, e.data.prevcont);
                }
            } else if (e.data.from == '__link__prev_invideo') { // 如果预览窗中有视频，按视频比例调整窗口
                if (!!e.data.vaspect) {
                    var vaspect = e.data.vaspect;
                    var maxh = window.innerHeight * 0.8;
                    var maxw = window.innerWidth * 0.6;
                    var wh = maxw / vaspect;
                    wh = (maxh > wh) ? wh : maxh;
                    var ww = wh * vaspect;
                    var origin = JSON.parse(previewwin.dataset.origin);
                    // 根据新预览窗大小调整位置（以原窗口初始起点）
                    if (!isPrevVisPinned()) winpos = setWinPos({ ...origin, w: ww, h: wh });
                }
            }
        }, true);
    }

    var aggresive_delay = 0;
    setTimeout(function () {                                        // 延时启动
        document.addEventListener('mouseover', (evt) => {           // 检查鼠标下的节点，查找链接添加图标
            if (default_enabled == 0) {                             // 默认禁用时跳出
                return;
            }
            let links = fetchLinks(evt);
            if (links.length > 0) {
                addIconTo(links);                                   // 找到了链接则添加
                aggresive_delay = 0;                                // 重置激进检查计数
            }
        });

        document.addEventListener('mousemove', (evt) => {
            if (default_enabled == 0) {                             // 默认禁用时跳出
                return;
            }
            if (aggresive_delay < 50) {
                aggresive_delay += 1;                               // 激进检查计数
            }
            if (aggresive_delay >= 50) {                            // 达到门槛后进行激进检查
                let links = fetchLinks(evt);
                if (links.length > 0) {
                    addIconTo(links);                               // 激进检查找到了则添加
                }
            }
            mousepos = { x: evt.clientX, y: evt.clientY };
        });

        // 设置监视器，若标题变化则重新加载
        var obwatch = document.querySelector('title');
        if (!!obwatch) {
            const obconfig = { attributes: false, childList: true, subtree: true };
            const obcallback = function (mutationsList, observer) {
                // console.log('标题变了', document.title);
                if (!document.querySelector("#" + id)) {
                    addCSS(css, id);
                }
                if (!document.querySelector("#" + preID)) {
                    makePrevWin();
                }
                site = location.host;            
            };
            const observer = new MutationObserver(obcallback);
            observer.observe(obwatch, obconfig);
        }
    }, 1000);

    function fetchLinks(mevt) {
        const t = mevt.target;
        var links;
        // console.log('overed>: ', t);
        if (isPageLink(t)) {                                    // 若鼠标下节点为链接则直接添加
            links = [t];
        } else {
            links = getLinksInThreeLayer(t);                    // 对鼠标下节点向下三层寻找链接
            // console.log('links（1）: ', links);
            if (links.length == 0) {
                links = getLinksInThreeLayerParent(t);          // 若找不到则向上三层寻找链接
            }
            // console.log('links（2）: ', links);
        }
        return links;
    }

    function addIconTo(links) {     // 往链接上添加图标；输入：链接的数组
        // console.log('going2addIcon::links: ', links);
        var lnkl = links.length;
        var exl = 0;
        // console.log(lnkl);
        for (let i = 0; i < lnkl; i++) {
            const lnk = links[i];
            if (!lnk.classList.contains("___prevlink")) {    // 包括被抹掉了a的样式标志
                lnk.classList.toggle("___prevlink", true);
            } else if (!!lnk.querySelector('img.___previcon')) {    // 跳过已有图标的链接
                continue;
            }

            var islinkpositionable = true;
            if (specSiteInd > -1) {
                if ([...document.querySelectorAll(specialLnkArr[specSiteInd].linkslc)].includes(lnk)) { // 若为特殊网站特殊链接则不添加定位样式
                    islinkpositionable = false;
                }
            }
            if (islinkpositionable && window.getComputedStyle(lnk).position == "static") {    // 若链接本身无position设置则添加定位样式
                lnk.classList.add("__pr");
            }

            var lnklcposit = getFirstChildSize(lnk);         // 获取链接首个子节点的占位
            var lnkposit = getTrueSize(lnk);                // 无末个子节点则获取链接占位
            var lcl, lcw;
            if (!lnklcposit) {
                lcl = lnkposit.l;
                lcw = lnkposit.w;
            } else {
                lcl = lnklcposit.l;
                lcw = lnklcposit.w;
            }
            var img;
            // img = creaElemIn('img', lnk);
            img = creaElemIn('img', lnk, "before", 0);
            // img.dataset.for = url;
            img.classList.add("___previcon");
            var adl = lcl - lnkposit.l + lcw + 4; // 末子节点右边界右4像素；如果被父节点遮挡或自身隐藏
            var adb = -0.3;
            if (lnkposit.r < (4 + iconSize) || window.getComputedStyle(lnk).overflow !== "visible") {
                adl = Math.min(adl, lnkposit.w - 5 - iconSize); // 则避开遮挡
                adb = 0.05;
            }
            img.style.left = adl + "px";
            img.style.bottom = adb + "lh";
            if (domainRegex.exec(lnk.href)[0] !== site) {   // 站内还是站外链接
                img.src = ixonimg;
                exl += 1;
            } else {
                img.src = inonimg;
            }
            if (lnkposit.w <= (iconSize * 10) && lnkposit.h <= (iconSize * 4) && adl < lnkposit.w) {    // 链接不宽不高且图标位于链接内的话
                img.classList.add("__moredelay");
            }
            img.addEventListener('mouseover', (evt) => {    // 鼠标悬停图标上的动作
                var etarget = evt.target;
                if (onClick == 1) {                   // 点击预览模式时，对小链接增加延时，延时后点击才预览
                    if (etarget.classList.contains("__moredelay")) {
                        moretimer = setTimeout(() => {
                            etarget.classList.add("__moredelayfin");
                        }, more_delaySec * 1000);
                    }
                    return;
                }
                var od = delaySec;
                if (evt.target.classList.contains("__moredelay")) {
                    od += more_delaySec;
                }
                od *= 1000;
                previewEvent(evt, od);
            });
            img.addEventListener('click', (evt) => {    // 鼠标点击图标的动作
                if (onClick == 0 || (evt.target.classList.contains("__moredelay") && !evt.target.classList.contains("__moredelayfin"))) {
                    return;
                }
                clearTimeout(timer);
                evt.preventDefault();
                evt.stopPropagation();
                previewEvent(evt, 0);
            });
            img.addEventListener('mouseleave', (evt) => {      // 鼠标离开图标则清除计时
                if (evt.target.classList.contains("__moredelayfin")) {
                    evt.target.classList.remove("__moredelayfin");
                }
                clearTimeout(timer);
                clearTimeout(moretimer);
            });
            // lnk.addEventListener('mouseover', (evt) => {
            //     console.log("lcl:", getLastChildSize(evt.target));
            //     console.log("ls", getTrueSize(evt.target));
            // });
        }
        //console.log("external link count:" + exl);

        window.addEventListener('mousedown', (e) => {       // 点击页面的动作
            var t = e.target;
            if (isPrevVisual() && !pinned && !previewwin.contains(t) && !t.classList.contains("___previcon")) {
                hidePrevWin(e);   // 若预览窗开启且非钉住状态且点击位置不在预览窗内或预览图标上则隐藏预览窗
            }
        }, true);
        if (closeOnScoll) {
            window.addEventListener('scroll', () => {       // 滚动页面的动作
                if (isPrevVisual() && !pinned) {
                    hidePrevWin();   // 若预览窗开启且非钉住状态且滚动位置不在预览窗内（window天然隔离iframe）则隐藏预览窗
                }
            }, true);
        }
    }

    function previewEvent(evt, od) {                        // 触发预览
        if (prevedUrl == evt.target.parentNode.href && isPrevVisual()) {  // 已在预览的链接相同则无视
            return;
        }
        let nowprev = document.querySelector('.__link__preved');
        if (!!nowprev) {                            // 若有链接在预览中，去除其预览中状态
            nowprev.classList.remove("__link__preved");
        }
        linkprev = evt.target.parentNode;           // 指定预览目标链接
        if (isiniframe && !isinprevwin) {           // 在iframe中且非预览窗中，则发送消息
            window.top.postMessage({                // 向top窗口发送消息，请求调用预览窗
                from: '__link__prev_iframe',
                prevhref: linkprev.href,
                prevcont: linkprev.textContent,
                prevod: od
            }, '*');
        } else {                                    // 否则直接调预览窗
            callPrevWin(od);
        }
    }

    function callPrevWin(od, prevhref, prevcont) {  // 召唤预览窗
        setTimeout(() => {
            if (previewwin.classList.contains("__close")) { // 若预览窗关闭状态则移动到鼠标下
                setWinPos(mousepos, true);
            }
        }, od);
        timer = setTimeout(previewLink, od, prevhref, prevcont, mousepos); // od秒后开启预览窗
    }

    // 生成预览窗
    // # makePrevWin()
    function makePrevWin() {       
        previewwin = creaElemIn('div', document.body);
        previewwin.id = preID;
        previewwin.style.width = '300px';  // 显示前预览窗大小，显示时形成放大效果
        previewwin.style.height = '200px';
        previewwin.classList.add("__close");    // 初始状态关闭

        movehand = creaElemIn('div', previewwin);   // 移动手柄
        movehand.classList.add("__link__prev_mv");

        resizehand = creaElemIn('div', previewwin); // 调整大小手柄
        resizehand.className = "__link__prev_rs";

        if (showLeftSizer) {
            resizehand2 = creaElemIn('div', previewwin); // 调整大小手柄
            resizehand2.className = "__link__prev_rs";
            resizehand2.classList.add("__rs_l");
        }

        var movehead = creaElemIn('div', movehand); // 移动手柄头
        movehead.textContent = pre;

        pinbtn = creaElemIn('div', movehand);     // 钉住按钮
        pinbtn.classList.add("__link__prev_btn");
        pinbtn.classList.add("__pinbtn");
        pinbtn.textContent = "T";
        pinbtn.title = (pinned) ? _txt.unpin[_L] : _txt.enpin[_L];
        pinbtn.addEventListener('click', togglePin);

        openbtn = creaElemIn('div', movehand);     // 新标签页打开按钮
        openbtn.classList.add("__link__prev_btn");
        openbtn.classList.add("__opnbtn");
        openbtn.textContent = "↗";
        openbtn.title = _txt.optab[_L];
        openbtn.addEventListener('click', (evt) => {
            if (!!evt.target.dataset.url) {
                openInTab(evt.target.dataset.url);
            }
        });

        titlebox = creaElemIn('div', movehand);     // 标题栏
        titlebox.className = "__link__prev_ttl";

        pre_ir = creaElemIn('iframe', previewwin);  // 预览容器iframe
        pre_ir.className = "__link__prev_ifr";
        pre_ir.style.border = 0;
        pre_ir.style.maxHeight = "unset";
        pre_ir.style.maxWidth = "unset";

        closebtn = creaElemIn('div', previewwin);   // 关闭按钮
        closebtn.classList.add("__link__clos_btn");
        closebtn.textContent = "✖";
        closebtn.addEventListener('click', hidePrevWin);

        ondrag = endrag(previewwin, movehand);      // 绑定移动预览窗对象
        ondrag.hook('__drag_begin', () => {         // 绑定移动开始、结束状态样式
            winpos = getWinPos();
            previewwin.classList.add("__onmove");
            ondrag.position._x = winpos.x;          // position 绑定预览窗左上坐标
            ondrag.position._y = winpos.y;
        });
        ondrag.hook('__dragging', () => {           // 绑定移动响应功能
            if (ondrag.isDragging) {                // 是否是拖动中状态
                winpos = setWinPos({ x: ondrag.position._x, y: ondrag.position._y }, true);    // 随着拖动自由移动位置
            }
        });
        ondrag.hook('__drag_end', () => {
            previewwin.classList.remove("__onmove");
        });

        rsdrag = endrag(previewwin, resizehand);    // 绑定调整预览窗大小对象
        rsdrag.hook('__drag_begin', () => {         // 绑定调整大小开始、结束状态样式、显示
            winpos = getWinPos();
            previewwin.classList.add("__onsize");
            resizehand.classList.add("__onsize");
            rsdrag.position._x = winpos.w;          // position 绑定预览窗宽高
            rsdrag.position._y = winpos.h;
        });
        rsdrag.hook('__dragging', () => {           // 绑定调整大小响应功能
            if (rsdrag.isDragging) {                // 是否是拖动中状态
                winpos.w = rsdrag.position._x;
                winpos.h = rsdrag.position._y;
                winpos = setWinPos(winpos, true);
                if (previewwin.classList.contains("__onsize")) {    // 调整中显示当前大小（该状态需加入已开始判断）
                    resizehand.textContent = `
                        W: ${winpos.w} px\nH: ${winpos.h} px
                    `;
                }
            }
        });
        rsdrag.hook('__drag_end', () => {
            previewwin.classList.remove("__onsize");
            resizehand.classList.remove("__onsize");
            resizehand.textContent = "";
        });

        if (showLeftSizer) {
            rsldrag = endrag(previewwin, resizehand2);  // 绑定左侧调整预览窗大小对象
            rsldrag.hook('__drag_begin', () => {        // 绑定调整大小开始、结束状态样式、显示
                winpos = getWinPos();
                previewwin.classList.add("__onsize");
                resizehand2.classList.add("__onsize");
                rsldrag.position._x = winpos.w * -1;    // 左边手柄拖动，鼠标横坐标增则宽度减
                rsldrag.position._y = winpos.h;
            });
            rsldrag.hook('__dragging', () => {          // 绑定调整大小、移动响应功能
                if (rsldrag.isDragging) {               // 是否是拖动中状态
                    var pos = {
                        x: winpos.x - ((rsldrag.position._x * -1) - winpos.w),  // 左边手绑拖动，宽度增则x坐标减
                        y: winpos.y,
                        w: rsldrag.position._x * -1,
                        h: rsldrag.position._y
                    }
                    winpos = setWinPos(pos, true);  // 同步调整位置和大小
                    if (previewwin.classList.contains("__onsize")) {    // 调整中显示当前大小（该状态需加入已开始判断）
                        resizehand2.textContent = `
                            W: ${winpos.w} px\nH: ${winpos.h} px
                        `;
                    }
                }
            });
            rsldrag.hook('__drag_end', () => {
                previewwin.classList.remove("__onsize");
                resizehand2.classList.remove("__onsize");
                resizehand2.textContent = "";
            });
        }
    }

    // 在预览窗中加载链接
    // # previewLink(prevhref, prevcont, origin)
    function previewLink(prevhref, prevcont, origin) {
        // console.log('linkprev: ', linkprev);
        if (!prevhref) {
            prevhref = linkprev.href;
            prevcont = linkprev.textContent;
        }
        prevedUrl = prevhref;
        var url = prevedUrl;
        // console.log('url: ', url);
        vscale = scale;
        var errorelem;
        pre_ir.sandbox = "allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads allow-presentation allow-pointer-lock allow-storage-access-by-user-activation allow-orientation-lock";
        if (uSA_len > 0) {                        // 链接替换
            for (let i = 0; i < uSA_len; i++) {
                const ur = urlSubstArr[i];
                if (ur.scrurl.test(url)) {      // 若网址匹配
                    const urid = ur.coreID.exec(url);   // 提取coreID
                    if (!!urid) {               // 若coreID存在则继续
                        url = ur.desturl.replace("--coreID--", urid[0]);    // 网址替换
                        pre_ir.allow = "autoplay";
                        pre_ir.sandbox = "allow-top-navigation allow-same-origin allow-forms allow-scripts";
                        vscale = 1;
                        errorelem = ur?.errorElem;
                        break;
                    }
                }
            }
        }
        var lh = location.href;
        pre_ir.src = url;                           // 加载页面
        var regSameOri = /[^\/:]+\:\/\/[^a-z0-9\.\:]\//;
        if (recordPrevHist && (regSameOri.exec(lh) == regSameOri.exec(url))) {
            history.pushState({ foo: "callback" }, null, url);     // 推送预览url到历史中
            history.replaceState({ foo: "callback" }, null, lh);     // 用当前页面地址替换历史state
        }
        titlebox.textContent = pre + prevcont;                // 以链接文本为标题
        titlebox.title = prevcont + "\n" + prevhref;
        previewwin.classList.toggle("__close", false);      // 预览窗去除关闭、添加加载中状态
        previewwin.classList.toggle("__loading", true);
        previewwin.classList.toggle('__pinned', pinned);
        previewwin.dataset.origin = JSON.stringify(origin); // 保存预览窗初始位置
        setTimeout(() => {                                  // 延时0.1秒（等待预览窗到位）显示、移动、调整大小
            previewwin.classList.toggle("__visible", true);
            if (!isPrevVisPinned()) {                       // 若已是显示中的钉住预览窗，则不调整位置
                winpos = setWinPos({ ...origin, w: winWidth, h: winHeight });
            }
            closebtn.classList.remove("__close");
            closebtn.classList.add("__loading");
            opened = true;                                  // 预览窗开启状态开
        }, 100);
        // 预览页面加载事件
        // # pre_ir.onload |→ postMessage
        pre_ir.onload = () => {                     // iframe加载完成后去除加载中状态
            closebtn.classList.remove("__loading");
            previewwin.classList.remove("__loading");
            pre_ir.contentWindow.postMessage({      // 向其中的iframe发送加载完成信息，请求检查errorElem
                from: '__link__prev_top',
                errorElem: errorelem,
                oriUrl: prevedUrl
            }, '*');
        };
    }

    function getWinPos() {                         // 获取预览窗当前屏幕位置大小
        var p = previewwin.getBoundingClientRect();
        return { x: p.left, y: p.top, w: p.width, h: p.height };
    }

    function calWinPos(pos) {                           // 计算基于 pos 避让屏幕边框的预览窗屏幕位置
        var x, y, w, h, p, x1, x2, y1, lok, rok;
        p = winpos;
        w = (pos?.w ?? p?.w) || winWidth;               // 若 pos 中无宽高信息，则获取现有或预设预览窗的宽高
        h = (pos?.h ?? p?.h) || winHeight;
        x1 = pos.x + minHgap / 2;                       // 在初始位置右的x
        x2 = pos.x - w - minHgap / 2;                   // 在初始位置左的x
        rok = x1 < (window.innerWidth - w - minHgap)    // 位置右的右边空间充足
        lok = x2 > minHgap;                             // 位置左的左边空间充足
        if (rok && lok) {                               // 若两边空间充足
            if (opened) {                               // 若预览窗开启中，横坐标取移动距离短的x
                x = (Math.abs(x1 - p.x) <= Math.abs(x2 - p.x)) ? x1 : x2;
            } else {                                    // 否则倾向右边
                x = x1;
            }
        } else if (!rok && !lok) {                      // 若两边空间都不足
            if (opened) {                               // 若预览窗开启中，横坐标以当前位置避让两边
                x = Math.max(minHgap, Math.min(window.innerWidth - w - minHgap, p.x));
            } else {
                x = Math.min(window.innerWidth - w - minHgap, x1);    // 否则靠右取
            }
        } else {                                        // 若一边空间充足
            x = (rok) ? x1 : x2;                        // 哪边空间充足取哪边的x
        }
        y1 = pos.y - 0.382 * h;                         // 理想y位置
        y = Math.max(Math.min(y1, window.innerHeight - minVgap - h), minVgap);  // 避让上下边缘

        if (opened) {
            if (Math.abs(x - p.x) <= 20) {              // 若相比现有位置差异不大则不移动
                x = p.x;
            }
            if (Math.abs(y - p.y) <= 20) {
                y = p.y;
            }
        }
        return { x: x, y: y, w: w, h: h };
    }

    // 设置预览窗相对页面位置，和大小
    // pos（{x,y,w,h}：左、顶、宽、高）数组，相对viewport位置
    // isfree（T/F）是否不避让屏幕边框
    function setWinPos(pos, isfree) {
        if (!isfree) {                              // “非自由移动”，如预览窗跟随预览链接位置
            pos = calWinPos(pos);                   // 否则计算避让位置
        }
        var f = (pinned) ? 0 : 1;
        previewwin.style.left = pos.x + f * window.scrollX + 'px';
        previewwin.style.top = pos.y + f * window.scrollY + 'px';
        var w, h;
        w = pos?.w ?? 0;                            // 没传入大小则不更改大小
        h = pos?.h ?? 0;
        if (w >= minW && h >= minH) {               // 限制修改大小时的最小大小
            setPrevWinSize(w, h, vscale);
        }
        return { x: pos.x, y: pos.y, w: w || winpos.w, h: h || winpos.h };
    }

    function setPrevWinSize(w, h, v) {          // 设置预览窗大小
        previewwin.style.width = w + 'px';
        previewwin.style.height = h + 'px';
        setIfrWinSize(w, h, v);
    }

    function setIfrWinSize(w, h, v) {           // 根据放大率设置预览窗内iframe大小
        var f = (v == 1) ? 0 : (1 - v) / 2 * -1 / v;
        pre_ir.style.transform = "scale(" + v + ")";
        pre_ir.style.height = 100 / v + "%";
        pre_ir.style.width = 100 / v + "%";
        pre_ir.width = w / v;
        pre_ir.height = h / v;
        pre_ir.style.marginLeft = (w * f) + 'px';
        pre_ir.style.marginTop = (h * f) + 'px';
    }

    function togglePin(ispinned) {                  // 切换钉住状态
        if (typeof (ispinned) == "boolean") {       // 若有指定切换至什么状态则按指定
            pinned = ispinned;
        } else {                                    // 否则反转当前钉住状态
            pinned = !pinned;
        }
        setWinPos(getWinPos(), true);                   // 按预览窗实际屏幕位置重新定位
        previewwin.classList.toggle('__onpin', true);       // 开启钉住“切换中”状态，以略过过渡动画
        previewwin.classList.toggle('__pinned', pinned);    // 已钉住状态表示
        setTimeout(() => {
            previewwin.classList.toggle('__onpin', false);  // 钉住“切换中”状态结束
        }, 100);
    }

    function openInTab(url) {               // 在新标签中打开链接并关闭预览窗
        GM_openInTab(url, { active: true });
        hidePrevWin();
    }

    function hidePrevWin() {                // 关闭（隐藏）预览窗
        pinned = (default_pinned == 1);                     // 重置钉住状态至预设
        pre_ir.src = '';
        var origin = JSON.parse(previewwin.dataset.origin); // 读取预览窗初始位置
        setWinPos({ ...origin, w: 100, h: 100 }, true);     // 预览窗向初始位置缩小
        previewwin.classList.remove('__visible');           // 预览窗隐藏
        linkprev.classList.remove('__link__preved');        // 去除链接高亮中状态
        closebtn.classList.add("__close");
        setTimeout(() => {                                  // 动画效果完成后添加关闭状态
            previewwin.classList.add("__close");
            opened = false;                                 // 预览窗开启状态关
        }, animationTime * 1000 + 10);
    }

    function isPrevVisual() {               // 预览窗是否可见
        return previewwin && previewwin.classList.contains('__visible');
    }

    function isPrevVisPinned() {            // 预览窗可见且钉住状态
        return isPrevVisual() && pinned;
    }

    function getLinksInThreeLayer(elem) {   // 对当前元素及其下两层的链接进行提取
        return getLinksInChild(elem, 3);
    }

    function getLinksInChild(elem, lcnt) {  // 递归提取元素中的链接
        var lnks = [];
        if (elem.childNodes.length > 0) {
            elem.childNodes.forEach((cnode) => {
                if (typeof(cnode) === "object" && cnode.nodeType === 1) {       // 若为节点
                    if (isVisible(cnode)) {                                     // 若节点可视
                        if (isPageLink(cnode)) {                                // 若为链接则添加
                            lnks.push(cnode);
                        } else {
                            if (lcnt - 1 > 0) {                                 // 否则递加下一层结果
                                lnks.concat(getLinksInChild(cnode, lcnt - 1));
                            }
                        }
                    }
                }
            });
        }
        return lnks;
    }

    function getLinksInThreeLayerParent(elem) {   // 对当前元素及其上两层检查是否链接，是则进行提取
        return getLinksInParent(elem, 3);
    }

    function getLinksInParent(elem, cls) {  // 递归查找父节点中是否存在链接
        if (typeof elem !== 'object' || elem.nodeType !== 1) {  // 排除非 dom 节点
            return [];
        }
        if (isPageLink(elem)) {             // 直接返回链接节点数组
            return [elem];
        } else {
            if (cls = 0) {
                return [];                  // 若已经向上查找达到预设次数均未找到则跳出返回
            }
            let pelem = elem.parentNode;
            if (!pelem || pelem.tagName == 'BODY') {    // 若是无父节点的节点或已查找到BODY则跳出返回
                return [];
            } else {
                return getLinksInParent(pelem, cls--);
            }
        }
    }
    
    /* 若节点是指向实网址（非js非锚点）的链接返回true ——————————————————————————————————————————— */
    function isPageLink(node) {
        if (node.tagName != 'A' || !node.href || (!!node.target && !/_(self|blank|top)/.test(node.target))) {  // 无网址或有框架指向的链接（点击不刷新主体页面）不处理
            return false;
        }
        const h = node.href, l = location.href; // 仅处理非js非本页锚点
        if (h.indexOf('javascript:') == 0 || h.replace(l.split('#')[0], "").indexOf("#") == 0) {
            return false;
        } else {
            return true;
        }
    }

    /* 检查链接之上三层是否有“-webkit-line-clamp”属性 ———————————————————————————————————— */
    function isLinkParentClamped(node, l) {
        var ls = l || 3;
        if (ls = 0) {
            return false;
        } else if (window.getComputedStyle(node).webkitLineClamp == "none") {
            return isLinkParentClamped(node.parentNode, ls - 1);
        } else {
            return true;
        }
    }

    function isVisible(node) {              // 若节点非隐藏状态返回true
        var p = node.getBoundingClientRect();
        if ((p.width == 0 && p.height == 0) || (p.top == 0 && p.bottom == 0)) {
            return false;
        }
        return true;
    }

    function changeMode() {                 // 切换预览触发模式
        onClick = (onClick == 0) ? 1 : 0;
        const str = _txt.ntc[_L].replace('--swc--', _txt.swc[_L][onClick]);
        popupNotice(scriptName + "：" + str);
        document.body.classList.toggle("__link_pre_clk", (onClick == 1));
        GM_setValue(is_onClick, onClick);
    }

    function changeDfpin() {                // 切换默认钉住状态
        default_pinned = (default_pinned == 0) ? 1 : 0;
        const str = _txt.ntp[_L].replace('--swp--', _txt.swp[_L][default_pinned]);
        popupNotice(scriptName + "：" + str);
        togglePin(default_pinned == 1);
        GM_setValue(is_default_pin, default_pinned);
    }

    function changeStatus() {               // 切换启用状态
        default_enabled = (default_enabled == 0) ? 1 : 0;
        const str = _txt.ntt[_L].replace('--swt--', _txt.swt[_L][default_enabled]);
        popupNotice(scriptName + "：" + str);
        document.body.classList.toggle("__link_pre_disable", (default_enabled == 0));
        GM_setValue(is_default_enable, default_enabled);
        if (default_enabled == 0) {         // 禁用状态时清除图标
            let imgs = document.body.querySelectorAll('a>img');
            [...imgs].forEach(img => {
                if (img.src == inonimg || img.src == ixonimg) {
                    removeNode(img);
                }
            });
        }
    }

    function setDWSdlg() {                  // 设置／删除当前域名下预览窗大小对话框
        let dg, maintxt, wxh;
        wxh = winpos.w + " x " + winpos.h;
        if (matchedDWS > -1) {              // 若已匹配域名序数存在，则多显示“删除”按钮
            maintxt = (_txt.msd[_L] + _txt.mdd[_L]).replaceAll("--dm--", site).replaceAll("--wh--", wxh);
            maintxt = scriptName + "：" + maintxt;
            dg = popupDialog(maintxt, [_txt.bsd[_L][0], _txt.bud[_L][0], _txt.bcd[_L]]);
        } else {                            // 若无匹配，只显示“设置”按钮和“取消”按钮
            maintxt = _txt.msd[_L].replaceAll("--dm--", site).replaceAll("--wh--", wxh);
            maintxt = scriptName + "：" + maintxt;
            dg = popupDialog(maintxt, [_txt.bsd[_L][0], _txt.bcd[_L]]);
        }
        dialogDWS = dg.dialog;
        btnsDWS = dg.buttons;
        btnsDWS[0].addEventListener("click", () => {    // “设置”按钮，保存设置
            setDWS(true);
            btnsDWS[0].textContent = _txt.bsd[_L][1];
            setTimeout(() => {
                removeNode(dialogDWS);
            }, 2000);
        });
        if (matchedDWS > -1) {                              // 若已匹配域名序数存在，则添加“删除”按钮
            btnsDWS[1].addEventListener("click", () => {    // “删除”按钮，删除设置
                setDWS(false);
                btnsDWS[1].textContent = _txt.bud[_L][1];
                setTimeout(() => {
                    removeNode(dialogDWS);
                }, 2000);
            });
        }
        btnsDWS[btnsDWS.length - 1].addEventListener("click", () => {   // “取消”按钮，退出对话框
            removeNode(dialogDWS);
        });
    }

    function setDWS(isSet) {                // 设置（true）／删除（false）预览窗大小命令
        if (isSet) {
            saveDomainWinSize(site, winpos.w, winpos.h);    // 将当前主页面域名、当前预览窗宽、高记入域名预览窗大小设置
        } else {
            perDomainWinSize = perDomainWinSize.filter((item, ind) => {  // 否则从域名预览窗大小设置删除当前主页面域名设置
                return (ind !== matchedDWS);                // 从数组中保留不匹配域名序数的项
            });
            matchedDWS = -1;                                // 重置已匹配域名序数
        }
        GM_setValue(pDWS, JSON.stringify(perDomainWinSize));    // 写入储存
    }

    function saveDomainWinSize(domain, w, h) {      // 将指定域名、宽高记入域名预览窗大小设置
        if (matchedDWS == -1) {                     // 若已匹配域名序数不存在，则新增数组项并设为对应序数
            perDomainWinSize.push({ domain: domain, w: w, h: h });
            matchedDWS = perDomainWinSize.length - 1;
        } else {                                    // 否则修改序数指向的项
            perDomainWinSize[matchedDWS].w = w;
            perDomainWinSize[matchedDWS].h = h;
        }
    }

    function keyhandler(evt) {          // 接收击键事件，并在击键匹配特定组合时调用相应方法
        var fullkey = get_key(evt);
        if (fullkey == toggleHotkey) {
            changeStatus();
        }
    }

    // 按键evt.which转换为键名
    function get_key(evt) {
        const keyCodeStr = {			//key press 事件返回的which代码对应按键键名对应表对象
            8: 'BAC',
            9: 'TAB',
            10: 'RET',
            13: 'RET',
            27: 'ESC',
            33: 'PageUp',
            34: 'PageDown',
            35: 'End',
            36: 'Home',
            37: 'Left',
            38: 'Up',
            39: 'Right',
            40: 'Down',
            45: 'Insert',
            46: 'Delete',
            112: 'F1',
            113: 'F2',
            114: 'F3',
            115: 'F4',
            116: 'F5',
            117: 'F6',
            118: 'F7',
            119: 'F8',
            120: 'F9',
            121: 'F10',
            122: 'F11',
            123: 'F12'
        };
        const whichStr = {
            32: 'SPC'
        };
        var key = String.fromCharCode(evt.which),
            ctrl = evt.ctrlKey ? 'C-' : '',
            meta = (evt.metaKey || evt.altKey) ? 'M-' : '';
        if (!evt.shiftKey) {
            key = key.toLowerCase();
        }
        if (evt.ctrlKey && evt.which >= 186 && evt.which < 192) {
            key = String.fromCharCode(evt.which - 144);
        }
        if (evt.key && evt.key !== 'Enter' && !/^U\+/.test(evt.key)) {
            key = evt.key;
        } else if (evt.which !== evt.keyCode) {
            key = keyCodeStr[evt.keyCode] || whichStr[evt.which] || key;
        } else if (evt.which <= 32) {
            key = keyCodeStr[evt.keyCode] || whichStr[evt.which];
        }
        return ctrl + meta + key;
    }

    /**
     * 
     * @param {string} str 通知文本 
     * @param {single} vpos 水平位置（0:屏幕左～1:屏幕右），默认0.5
     * @param {single} hpos 垂直位置（0:屏幕顶～1:屏幕底），默认0.7
     * @param {single} duration 通知停留时间（秒），默认5.5
     */
    function popupNotice(str, vpos, hpos, duration) {
        vpos = vpos || 0.7, hpos = hpos || 0.5, duration = 5.5 || duration;
        let notice = creaElemIn('div', document.body);
        notice.textContent = str;
        notice.style = `
            transform: translate(-50%,-50%); position: fixed; left: ${hpos * 100 + '%'}; top: ${vpos * 100 + '%'};
            border: none; outline: 3px solid white; box-shadow: 0 4px 7px 4px #3f3f3f;
            background: black; color: white; font-family: Arial; font-size: 14pt;
            transition: opacity 0.5s; opacity: 0; padding: 20px; border-radius: 15px;
            z-index: 2000000;
        `;
        setTimeout(() => {
            notice.style.opacity = 0.8;
        }, 500);
        setTimeout(() => {
            notice.style.opacity = 0;
        }, 1000*duration);
        setTimeout(() => {
            removeNode(notice);
        }, 6000);
    }

    /**
     * 在页面内显示对话框并返回{对话框，按钮数组}对象
     * @param {string} str 对话框提示文本
     * @param {array} btns 按钮文本数组 [按钮文本1（,按钮文本2,...）]
     * @returns 
     */
    function popupDialog(str, btns) {
        const vpos = 0.5, hpos = 0.5;
        let dialog = creaElemIn('div', document.body);
        dialog.id = "popupDialog";
        let txtdiv = creaElemIn('div', dialog);
        let btndiv = creaElemIn('div', dialog);
        txtdiv.textContent = str;
        let buttons = [];
        for (let i = 0; i < btns.length; i++) {
            buttons[i] = creaElemIn('div', btndiv);
            buttons[i].textContent = btns[i];
            buttons[i].style = `
                border: 2px solid white; border-radius: 7px; height: 40px; width: 120px; margin: 10px 20px;
                background: rgb(51, 51, 51); text-align: center; line-height: 36px; cursor: pointer;
            `;
        }

        dialog.style = `
            transform: translate(-50%,-50%); position: fixed; left: ${hpos * 100 + '%'}; top: ${vpos * 100 + '%'};
            border: none; outline: 3px solid white; box-shadow: 0 4px 7px 4px #3f3f3f;
            background: #646464; color: white; font-family: Arial; font-size: 14pt;
            transition: opacity 0.5s; opacity: 1; padding: 20px; border-radius: 15px;
            z-index: 2000000;
        `;
        txtdiv.style = `
            text-align = center; width: 100%;
        `;
        btndiv.style = `
            display: flex; width: 100%; padding: 15px;
        `;
        return { dialog, buttons };
    }

    /**在 destin 内创建元素 tagname，通过 spos{ "after", "before" } 和 pos 指定位置
     * @param {string} tagname 创建的元素的元素名
     * @param {node} destin 创建元素插入的父元素
     * @param {string} spos “after”或“before”指定插入方向
     * @param {integer} pos 插入位置所在子元素序号
     * @returns 
     */
    function creaElemIn(tagname, destin, spos, pos) {	
        var elem;
        elem = document.createElement(tagname);
        if (!spos) {
            destin.appendChild(elem);
        } else {
            if (spos == "after") {
                destin.insertBefore(elem, destin.childNodes[pos + 1]);
            } else if (spos == "before") {
                destin.insertBefore(elem, destin.childNodes[pos]);
            }
        }
        return elem;
    }

    /**
     * 移除目标节点
     * @param {node} node 目标节点
     */
    function removeNode(node) {
        if (!!node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }

    /**
     * 创建带ID的CSS节点并插入页面
     * @param {string} css CSS内容
     * @param {string} cssid CSS节点ID
     */
    function addCSS(css, cssid) {           
        let stylenode = creaElemIn('style', document.getElementsByTagName('head')[0]);
        stylenode.textContent = css;
        stylenode.type = 'text/css';
        stylenode.id = cssid || '';
    }

    function getFirstChildSize(elem) {       // 返回节点的第一个子节点的实占位对象
        var cs = elem.childNodes;
        if (cs.length == 0) {
            return false;
        }
        var fc = cs[0];
        if (!fc) return false;
        if (fc.nodeType == 3 && fc.length > 0) {
            var crect = elem.getClientRects();
            var rp = elem.getBoundingClientRect().right;
            if (crect.length > 1) {             // 若文本折行导致多个 client 的 rect 存在，则取第一个有大小的实占
                for (let i = 0; i < crect.length; i++) {
                    const p = crect[i];
                    if (p.width > 0 && p.height > 0) {
                        return {
                            w: p.width,
                            h: p.height,
                            t: p.top,
                            l: p.left,
                            r: rp - p.right
                        };
                    }
                }
            } else {
                return getTextNodeSize(fc, rp);     // 不折行则直接取文本实占
            }
        } else {
            return getTrueSize(fc);             // 非文本或空文本则取整个实占
        }
    }

    function getLastChildSize(elem) {       // 返回节点的最后一个子节点的实占位对象
        var cs = elem.childNodes;
        if (cs.length == 0) {
            return false;
        }
        var lc = cs[cs.length - 1];
        if (!lc) return false;
        if (lc.nodeType == 3 && lc.length > 0) {
            var crect = elem.getClientRects();
            var rp = elem.getBoundingClientRect().right;
            if (crect.length > 1) {             // 若文本折行导致多个 client 的 rect 存在，则取最后一个有大小的实占
                for (let i = crect.length - 1; i >= 0; i--) {
                    const p = crect[i];
                    if (p.width > 0 && p.height > 0) {
                        return {
                            w: p.width,
                            h: p.height,
                            t: p.top,
                            l: p.left,
                            r: rp - p.right
                        };
                    }
                }
            } else {
                return getTextNodeSize(lc, rp);     // 不折行则直接取文本实占
            }
        } else {
            return getTrueSize(lc);             // 非文本或空文本则取整个实占
        }
    }

    /* 输入元素，返回实占位对象{元素可见的宽、高、顶、左、一层父元素右侧余量} —————————————————————————————— */
    function getTrueSize(elem, posiz) {
        // console.log(elem);
        if (!posiz) {
            var p = elem.getBoundingClientRect();
            posiz = {
                w: p.width,
                h: p.height,
                t: p.top,
                l: p.left,
                r: 0,
            };
        }
        var pp = elem.parentNode.getBoundingClientRect();
        var pr = posiz.l + posiz.w, pb = posiz.t + posiz.h;
        if (posiz.r == 0) posiz.r = pp.right - pr;                  // 父元素对当前元素的右侧余量
        var isvi = {
            l: posiz.l < pp.right && posiz.l >= pp.left,            // 子左在父左右之间
            r: pr > pp.left && pr <= pp.right,                      // 子右在父左右之间
            t: posiz.t < pp.bottom && posiz.t >= pp.top,            // 子顶在父顶底之间
            b: pb > pp.top && pb <= pp.bottom                       // 子底在父顶底之间
        };
        if (isvi.l && isvi.r && isvi.t && isvi.b) {                 // 子全在父之内，则返回子占位
            return posiz;
        } else {
            var ppl = (isvi.l) ? posiz.l : pp.left;                 // 确定可见四边（在父之内按子，否则按父）
            var ppt = (isvi.t) ? posiz.t : pp.top;
            var ppr = (isvi.r) ? posiz.l + posiz.w : pp.right;
            var ppb = (isvi.b) ? posiz.t + posiz.h : pp.bottom;
            return getTrueSize(elem.parentNode, {
                w: ppr - ppl,
                h: ppb - ppt,
                t: ppt,
                l: ppl,
                r: posiz.r
            });
        }
    }

    /* 输入文本节点，返回实占位对象{文本节点的宽、高、顶、左、一层父元素右侧余量} ——————————————————————————————— */
    function getTextNodeSize(textNode, parentright) {
        if (textNode.nodeType !== 3) {
            return false;
        }
        if (document.createRange) {
            var range = document.createRange();
            range.selectNodeContents(textNode);
            if (range.getBoundingClientRect) {
                var rect = range.getBoundingClientRect();
                if (rect) {
                    var pos = {
                        w: rect.width,
                        h: rect.height,
                        t: rect.top,
                        l: rect.left,
                        r: parentright - rect.right
                    };
                    return getTrueSize(textNode, pos);
                }
            }
        }
        return false;
    }

    /* 将target绑定到对象obj上，使拖动handle时，实现绑定的响应功能 ————————————————————————————— */
    // 输入：目标元素target，拖动手柄handle
    // 用法：obj=endrag(target,handle);
    // obj.hook('__drag_begin',fn); 其中 fn 为拖动开始时需要响应的功能
    // obj.hook('__dragging',fn); 其中 fn 为拖动过程中需要响应的功能
    // obj.hook('__drag_end',fn); 其中 fn 为拖动结束时需要响应的功能
    // obj.isDragging：用于判断是否为拖动中状态
    // obj.position{x,y,_x,_y}：
    //   （x, y）为鼠标viewport位置，（_x, _y）为随（x, y）增减变化的值，
    //   （_x, _y）可在拖动开始时输入，可在拖动过程中和拖动结束时输出，输入输出同步乘负系数则增减反向
    function endrag(target, handle) {
        var isDragging;
        endrag = function (target, handle) {
            return new endrag.proto(target, handle);
        }
        endrag.proto = function (target, handle) {
            var self = this;
            this.target = target;
            this.style = target.style;
            this.handle = handle;
            this.isDragging = false; // 实例属性
            this.position = { x: 0, y: 0, _x: 0, _y: 0 }; // 实例属性，初始化为0
            this.drag_begin = function (e) { self.__drag_begin(e); };
            this.dragging = function (e) { self.__dragging(e); };
            this.drag_end = function (e) { self.__drag_end(e); };
            this.handle.addEventListener('mousedown', this.drag_begin, false); //only drag on handler
            document.addEventListener('mousemove', this.dragging, false);
            document.addEventListener('mouseup', this.drag_end, false);
        };
        endrag.proto.prototype = {
            __drag_begin: function (e) {
                if (e.button == 0) {
                    this.isDragging = isDragging = true;
                    this.position.x = e.clientX;
                    this.position.y = e.clientY;
                    e.preventDefault();
                }
            },
            __dragging: function (e) {
                if (!this.isDragging) return;               // 这句无法移到this.dragging的绑定上，否则一直不会进入hook 到 __dragging方法
                var x = Math.floor(e.clientX), y = Math.floor(e.clientY);
                var x_border = window.innerWidth - 30, y_border = window.innerHeight - 30;
                x = Math.max(0, Math.min(x, x_border));     // 防止超出屏幕
                y = Math.max(0, Math.min(y, y_border));
                this.position._x += (x - this.position.x);
                this.position._y += (y - this.position.y);
                this.position.x = x;
                this.position.y = y;
            },
            __drag_end: function (e) {
                if (e.button === 0 && this.isDragging) {
                    this.isDragging = false;
                }
            },
            hook: function (method, func) {
                if (typeof this[method] === 'function') {
                    var orimethod = this[method];
                    this[method] = function () {
                        if (func.apply(this, arguments) === false) {
                            return;
                        }
                        orimethod.apply(this, arguments);
                    };
                }
            }
        };
        return endrag(target, handle);
    }

})();