// ==UserScript==
// @name         巴哈姆特动画疯 功能与UI改进
// @name:zh-TW   巴哈姆特動畫瘋 功能與UI改進
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  改进巴哈姆特动画疯的 UI样式 并新增功能
// @description:zh-tw   改進巴哈姆特動畫瘋的 UI樣式 並新增功能
// @author       F_thx
// @match        https://ani.gamer.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521310/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E7%96%AF%20%E5%8A%9F%E8%83%BD%E4%B8%8EUI%E6%94%B9%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/521310/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E7%96%AF%20%E5%8A%9F%E8%83%BD%E4%B8%8EUI%E6%94%B9%E8%BF%9B.meta.js
// ==/UserScript==

(function () {

    class aStyle {
        constructor() {
            let style = document.createElement('style');
            document.head.appendChild(style);
            this.style = style;
            return this;
        }
        add(css) {
            css.split('}').forEach(rule => {
                if (!rule.includes('{')) { return }
                let _rule = rule + '}';
                this.style.sheet.insertRule(_rule, this.style.sheet.cssRules.length);
            });
            return this;
        }
        remove(number) { // 删除第 number 条规则 , 输入-1删除所有
            if (number == -1) {
                while (this.style.sheet.cssRules.length > 0) {
                    this.style.sheet.deleteRule(0);
                }
            } else {
                this.style.sheet.deleteRule(number);
            }
            return this;
        }
        html(css) {
            this.style.innerHTML = css;
            return this;
        }
    }
    class AgcFunction {
        static ButtonType = {
            imgtool(name, onclick) {
                // 创建新的按钮
                const newButton = document.createElement('div');
                newButton.className = 'plus_text plus_button'; // 使用与其他按钮一致的类名
                newButton.textContent = name; // 按钮文本

                // 创建外层 div
                const buttonBox = document.createElement('div');
                buttonBox.className = 'plus_button_box';
                buttonBox.setAttribute('data-v-ff85ec82', ''); // 添加 data 属性
                buttonBox.appendChild(newButton); // 将按钮 div 添加到外层 div 中

                // 按钮点击
                newButton.addEventListener('click', onclick);

                return buttonBox;
            },
            settings: 1,
        };
        static newButton(buttonType_or_html, button_args, func = () => { }, onclick = () => { }) {

            if (typeof buttonType_or_html == 'string') {
                if (!this.ButtonType[buttonType_or_html]) { return }
                return AgcFunction.ButtonType[buttonType_or_html](...button_args);
            } else {
                this.contain.appendChild(buttonType_or_html);
            }

        }
        static addImgTool(name, func) {
            this.imgtool[name] = func;
        }
        constructor(content) {
            this.contain = content?.contain || (() => true)
            this.func = content?.func || (() => { })
            this.style = content?.style || 0;
            this.imgtool = content?.imgtool || {};
            this.name = content?.name || 'none';
        }
    }
    class ani_gamer_com {
        startFunction = []
        settings = {
            debugMode: false,
            _imageZoomEnabled: 0,
            get imageZoomEnabled() {
                if (this._imageZoomEnabled === 0) {
                    this._imageZoomEnabled = GM_getValue('imageZoomEnabled', true);
                }
                return this._imageZoomEnabled;
            },
            set imageZoomEnabled(value) {
                this._imageZoomEnabled = value;
                GM_setValue('imageZoomEnabled', value);
            },
            _miniPlayerEnabled: 0,
            get miniPlayerEnabled() {
                if (this._miniPlayerEnabled === 0) {
                    this._miniPlayerEnabled = GM_getValue('miniPlayerEnabled', true);
                }
                return this._miniPlayerEnabled;
            },
            set miniPlayerEnabled(value) {
                this._miniPlayerEnabled = value;
                GM_setValue('miniPlayerEnabled', value);
            },
            _skyMouse: 0,
            get skyMouse() {
                if (this._skyMouse === 0) {
                    this._skyMouse = GM_getValue('skyMouse', true);
                }
                return this._skyMouse;
            },
            set skyMouse(value) {
                this._skyMouse = value;
                GM_setValue('skyMouse', value);
            },
            _skyScroll: 0,
            get skyScroll() {
                if (this._skyScroll === 0) {
                    this._skyScroll = GM_getValue('skyScroll', true);
                }
                return this._skyScroll;
            },
            set skyScroll(value) {
                this._skyScroll = value;
                GM_setValue('skyScroll', value);
            },
        }
        static languageTexts = {
            en: {
                settingsTitle: "Settings",
                enableImageZoom: "Enable Image Zoom",
                tooltip: "Hovering over the image will automatically enlarge it",
                close: "Close",
                enableMiniPlayer: "Enable Mini Player",
                skyMouse: "Toggle Sky Mouse",
                skyScroll: "Toggle Sky Scroll",
                skyMouseTooltip: "Hovering over the sky will automatically show it",
                skyScrollTooltip: "Scrolling the mouse wheel will automatically hide or show the sky",
            },
            zh_TW: {
                settingsTitle: "設定",
                enableImageZoom: "圖片放大",
                tooltip: "滑鼠懸停在圖片上時會自動放大圖片",
                close: "關閉",
                enableMiniPlayer: "小窗播放",
                skyMouse: "懸停切換sky顯示",
                skyScroll: "滾輪切換sky顯示",
            },
            zh_CN: {
                settingsTitle: "设置",
                enableImageZoom: "图片放大",
                tooltip: "鼠标悬浮在图片上时会自动放大图片",
                close: "关闭",
                enableMiniPlayer: "小窗播放",
                skyMouse: "鼠标悬停切换sky显示",
                skyScroll: "滚轮切换sky显示",
            }
        }

        addFunction(name, all) {
            this.startFunction.push(new AgcFunction({ ...all, name }));
            return this
        }
        run() {
            this.startFunction.forEach(func => {
                console.log('ani.gamer.com UI improve running:', func.name, func)
                if (func.contain()) {
                    try {
                        if (func.style != 0) {
                            (new aStyle()).html(func.style)
                        }
                        func.func()

                    } catch (error) {
                        console.error(`Error running function: ${func.name} |`, error);
                    }
                }
            });
        }


    }
    const ANI_GAMER_COM = new ani_gamer_com();

    // 保存 ANI_GAMER_COM 实例的引用
    const self = ANI_GAMER_COM;

    // 主要美化
    ANI_GAMER_COM.addFunction('AniSytle', {
        style: `
            /* 综合 */
                .material-icons, .material-icons-round {
                    font-family: 'Material Icons' !important;
                }
                .anime-ad {
                    display: none !important;
                }
                .fb-like {
                    display: none !important;
                }
        
            /* 基本變數 */
                :root {
                    --anime-secondary-color: #ffbc75;
                    --btn-primary: #ffffffeb;
                }
            /* 卡片樣式 */
                .data,
                .anime-title {
                     background: var(--card-bg);
                     box-shadow: var(--card-shadow);
                     border-radius: 8px;
                     margin: 20px 20px;
                     transition: box-shadow 0.3s ease; background 0.3s ease ;
                     width: auto;
                }
                .data:hover,
                .anime-title:hover,
                .store_wrapper ul li:hover {
                    box-shadow: var(--card-shadow-hover)
                }

            /* 播放器 */
                .videoframe.pip-mode #ani_video_html5_api {
                    position: relative !important;
                }
        
        
            /* 標題 */
                .anime-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px;
                    min-height: 200px;
                }
                .anime-title .anime-option {
                    flex: 1;
                    margin-right: 0;
                }
                .anime-title .anime-option .videoname .anime_name {
                    padding-left: 88px;
                }
                .anime_name h1 {
                    font-size: 3em !important;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    margin-bottom: 10px !important;
                }
                .anime_info_detail {
                    font-size: 1.4em;
                }
                .videoname {
                    padding-top: 0px;
                }
                .rating {
                    top: 16px;
                    left: 16px;
                }
                .anime-title .anime-option .videoname .anime_name button i {
                    color: #fff;
                }
        
            /* 集數控制 */
                .season {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    flex-direction: column;
                    padding: 8px 0px 0px 0px;
                    width: auto;
                    align-items: flex-start;
                }
                .season > p {
                    box-shadow: var(--card-shadow-hover);
                    background: var(--gray1-color);
                    margin: 18px 10px 0 10px;
                    border-radius: 8px 8px 0 0;
                    padding: 0 16px;
                }
                .season ul {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 12px 12px 4px 12px;
                    background: rgba(var(--gray0-color-rgb), 0.7);
                    border-radius: 8px;
                    overflow: visible;
                    justify-content: flex-start;
                }
                .season ul li {
                    background-color: var(--anime-background-elevated);
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    flex: 0 0 auto;
                    border: 0px solid var(--border-color);
                    box-shadow: var(--card-shadow);
                }
                .season ul li:hover {
                    background-color: #d0d0d0;
                    box-shadow: var(--card-shadow-hover);
                    border: 1px solid var(--border-color);
                    scale: 1.1;
                    border-radius: 8px;
                }
                .season ul li:hover a {
                    transform: scale(1.1);
                }
                .season ul li.playing {
                    background-color: #007bff;
                }
                .season ul li.playing a {
                    color: #fff;
                }
                    
                .season .season-tab span {
                    background: #e0e0e0;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }
                .season .season-tab span:hover {
                    background: #d0d0d0;
                }
                .ani-season-more .ani-season-more-btn {
                    background: #007bff;
                    color: #fff;
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }
                .ani-season-more .ani-season-more-btn:hover {
                    background: #0056b3;
                }
        
        
            /* 工具欄 */

                .image_tool {
                    position: fixed;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                    border-radius: 8px 0 0 8px;
                    padding: 8px 0px 0px 0px !important;
                    transition: width 0.3s ease, background 0.3s ease;
                    width: 40px;
                    overflow: hidden;
                    z-index: 1000;
                    cursor: pointer;
                    background: rgba(255, 255, 255, 0) !important;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0);
                }
                .plus_describe.material-icons {
                    display: none !important;
                }
                .image_tool::before {
                    content: "🛠️";
                    font-size: 24px;
                    color: rgba(255, 255, 255, 0.8);
                    display: block !important;
                    text-align: center;
                    margin-bottom: 0px;
                }
                .image_tool:hover {
                    width: 280px;
                    color: rgba(255, 255, 255, 0.8);
                    background: var(--card-bg) !important;
                    box-shadow: var(--card-shadow-hover);
                    padding: 0 50px 0 0 !important;
                }
                .image_tool:hover .plus_text.plus_button {
                    display: flex !important;
                    align-items: center;
                    padding-left: 10px;
                }
        
                .plus_button_box {
                    background: rgba(var(--gray0-color-rgb), 0.8) !important;
                }
        
                .plus_text.plus_button {
                    display: none !important;
                    justify-content: flex-start;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 4px;
                    transition: background 0.3s ease, padding 0.3s ease;
                }
        
        
        
                .image_tool:hover .plus_text.plus_button {
                    display: flex !important;
                    align-items: center;
                    padding-left: 10px;
                }
        
                .plus_describe_b > span {
                    position: absolute;
                }
        
            /* 統一按鈕樣式 */
                .link-button,
                .anime-title .anime-option .videoname .anime_name button,
                .nav-segment-control,
                .user-score-more,
                .R18 .video-cover-ncc .ncc-choosearea .ncc-choosebar .ncc-choose-btn button,
                .btn-show-more,
                .plus_button {
                    background: var(--nav-color-bg);
                    color: #fff;
                    padding: 6px 8px !important;
                    border-radius: 8px;
                    text-decoration: none;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: background 0.3s ease, padding 0.3s ease, transform 0.3s ease;
                    display: inline-block !important;
                    margin: 5px;
                    font-family: PingFang SC, HarmonyOS_Medium, Helvetica Neue, Microsoft YaHei, sans-serif;
                    font-weight: 500;
                }
                .link-button:hover,
                .nav-segment-control:hover,
                .user-score-more:hover,
                .btn-show-more:hover {
                    padding: 10px 20px !important;
                    background: #007bff;
                    transform: translateY(-2px);
                }
                .plus_button {
                    transition: all 0.3s ease !important;
                    scale: 1;
                }
                .plus_button:hover{
                    background: #007bff;
                    scale: 1.1;
                }
                .anime-title .anime-option .videoname .anime_name button:hover {
                    padding: 6px 20px !important;
                    background: #007bff;
                }
                .R18 .video-cover-ncc .ncc-choosearea .ncc-choosebar .ncc-choose-btn button {
                    width: auto !important;
                    transition: all 0.8s ease !important;
                }
                .R18 .video-cover-ncc .ncc-choosearea .ncc-choosebar .ncc-choose-btn button:hover {
                    scale: 1.2 !important;
                    background: #007bff;
                }
        
                .container-player .theme-title-block{
                    display: none;
                }
        
                .animate-theme-list .theme-extend-block {
                    margin: 0px;
                }
        
                .extend-card {
                    border-radius: 8px;
                }
        
                .container-player {
                    padding-bottom: 0px;
                }
        
                .animate-theme-list {
                    padding: 0px 12px 0px 12px;
                }
        
                .reply-content__tag, .reply-content__gp, .reply-content__bp {
                    background: none;
                    border: none;
                    color: #007bff;
                    cursor: pointer;
                    font-size: 14px;
                }
                .reply-content__tag:hover, .reply-content__gp:hover, .reply-content__bp:hover {
                    text-decoration: underline;
                }
        
            /* 作品列表 */
                .theme-list-main {
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .theme-list-main:hover .theme-img-block .theme-img {
                    transition-duration: 500ms;
                    transform: scale(1.1);
                }
                .theme-list-main .theme-img-block .theme-img {
                    scale: 1.01;
                    transition: all 0.3s ease;
                }
                .theme-list-main .anime-detail-block {
                    transition: all 0.3s ease;
                }
        
            /* 商店 */
                .store_wrapper ul li {
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }
                .store_wrapper .btn-buy-now {
                    transition: all 0.3s ease;
                }
                .store_wrapper .btn-buy-now:hover {
                    scale: 1.1;
                    border-radius: 8px;
                }
        
        
            /* 评论区 */
                .reply-content__cont {
                    font-size: 16px !important;
                    line-height: 1.5 !important;
                }
        
                /* 评论区拓宽与卡片化 */
                .container-player.commend-title .filter-nav,
                .webview_commendlist, .party .webview_chatlist {
                    box-shadow: var(--card-shadow);
                    max-width: 50%;
                    min-width: 480px;
                }
                .commend-segment-wrapper {
                    max-width: 100%;
                }
        
                .container-player.commend-title .filter-nav {
                    border-radius: 8px 8px 0 0;
                }
                .webview_commendlist, .party .webview_chatlist {
                    border-radius: 0 0 8px 8px;
                }
        
                .container-player.fullwindow.container-player.commend-title,
                .container-player.fullwindow.commendlist-wrapper {
                    padding-left: 10%;
                    padding-right: 16px;
                }
        
        
        
        
            /* SKY */
        
                .top_sky {
                    position: fixed;
                    transition: all 0.4s ease;
                }
        
                .top_sky.fullwindow {
                    height: 90px;
                    transform: translateY(-90px);
                    transition: all 0.4s ease;
                }
                .sky {
                    transition: all 0.6s ease;
                }
                .mainmenu.on_top {
                    height: 35px;
                    transition: all 0.6s ease;
                }
        
                .top_sky.fullwindow .sky{
                    height: 0px;
                }
        
                .top_sky.fullwindow .mainmenu.on_top{
                    top: 0px;
                    height: 0px;
                }
                
        
                /* 主選單 */
                .mainmenu {
                    width: 100%;
                    top: 55px;
                    height: 35px;
                    background: linear-gradient(to right, var(--nav-color-bg), var(--nav-color-bg)), var(--anime-background-base);
                    z-index: 90;
                    position: fixed;
                    transition: background 0.3s ease, transform 0.3s ease;
                }
                @media screen and (max-width: 1000px) {
                    .sky {
                        height: 40px;
                    }
                    .mainmenu {
                        top: 40px;
                    }
                    .mainmenu ul {
                       transition: all 0.3s ease;
                    }

                }
                .mainmenu li {
                    margin: 0 10px 0 0;
                    padding: 0px 10px;
                    clear: none;
                    height: 100%;
                    line-height: 35px;
                    font-size: 1.7em;
                    border-top: 0 solid #00e2e2;
                    overflow: hidden;
                    position: relative;
                    transition: background 0.3s ease, transform 0.3s ease, padding 0.3s ease;
                }
                .mainmenu li:hover, .mainmenu li:focus {
                    background-color: var(--menu-list-hover);
                    transform: translateY(-2px);
                    padding: 2px 20px;
                }
        
                .mainmenu li.menu-payment {
                    background-color: var(--anime-secondary-color);
                    transition: all 0.3s ease !important;
                }
        
                .mainmenu li.menu-payment:hover {
                    background-color: var(--anime-secondary-hover);
                    transform: translateY(-2px);
                }
        
                .mainmenu a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: rgba(var(--anime-white-rgb), 1);
                    text-decoration: none;
                    transition: color 0.3s ease;
                }
        
                .mainmenu a:hover {
                    color: #fff;
                }
        
                .mainmenu .menu_btn {
                    width: 100%;
                    line-height: 31px;
                    font-size: 2.5em;
                    color: rgba(var(--anime-white-rgb), 1);
                    cursor: pointer;
                    z-index: 10;
                    padding: 2px 5px 0 0;
                    text-align: right;
                    transition: color 0.3s ease, transform 0.3s ease;
                }
        
                .mainmenu .menu_btn > i {
                    line-height: unset;
                    transition: transform 0.3s ease;
                }
        
                .mainmenu .menu_btn:hover > i {
                    transform: scale(1.1);
                }
        
                /* 搜尋模組 */
                .anime_search {
                    width: 400px;
                    position: relative;
                }
        
                .anime_search .anime_search-input {
                    position: relative;
                    width: 300px;
                    height: 30px;
                    transition: all 0.3s ease;
                }
        
                .anime_search .anime_search-input input[type=text] {
                    padding: 8px;
                    transition: 0.1s;
                    text-align: left;
                    vertical-align: middle;
                    border-radius: 99px;
                    border: 1px solid var(--border-color);
                    background-color: var(--input-bg);
                    color: var(--text-default-color);
                    outline: 0px solid rgba(var(--anime-primary-rgb), 0);
                    height: 100%;
                    width: 90%;
                    padding-left: 8px;
                    padding-right: 40px;
                    transition: background 0.3s ease, border-radius 0.6s ease, width 0.4s ease;
                }
        
                .anime_search .anime_search-input input[type=text]::placeholder {
                    color: var(--text-secondary-color);
                }
        
                .anime_search .anime_search-input input[type=text]:focus {
                    outline: 3px solid rgba(var(--anime-primary-rgb), 0.36);
                    border-radius: 8px;
                    width: 100%;
                    border: 1px solid var(--border-strong);
                    background-color: var(--input-bg-hover);
                    
                }
        
                .anime_search .anime_search-input input[type=text]:focus + .anime_search-icon {
                    animation: iconFocusAnimation 0.6s forwards;
                }
        
                @keyframes iconFocusAnimation {
                    from {
                        transform: border-radius(0 99px 99px 0); scale: 0;
                    }
                    to {
                        transform: border-radius(0 8px 8px 0); scale: 1;
                    }
                }
        
                .anime_search .anime_search-input .anime_search-icon {
                    box-sizing: border-box;
                    position: absolute;
                    top: 1px;
                    right: 1px;
                    background-color: var(--anime-background-elevated);
                    border-left: 1px solid var(--border-color);
                    border-radius: 0 8px 8px 0;
                    padding: 5px 8px;
                    cursor: pointer;
                    scale: 0;
                    transition: background 0.3s ease, border-radius 0.6s ease, scale 0.6s ease;
                }
        
                .anime_search .anime_search-input .anime_search-icon:hover {
                    background-color: var(--anime-primary-color);
                }
        
                .anime_search .anime_search-content {
                    overflow: hidden;
                    background: var(--card-bg);
                    border: 1px solid var(--border-search-card-line);
                    border-radius: 8px;
                    margin-top: 4px;
                    position: absolute;
                    top: 30px;
                    left: 0;
                    z-index: 1001;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    transform-origin: top left;
                    transform: scale(0);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
        
                .anime_search .anime_search-content.is-active {
                    transform: scale(1);
                    opacity: 1;
                }
        
                .anime_search .anime_search-content .search-content-unit {
                    box-shadow: 0 1px 0 var(--seperator-light);
                    padding: 10px 0;
                    margin: 0px 16px;
                    transition: all 0.3s ease;
                }
        
                .anime_search .anime_search-content .search-content-unit .tip-title {
                    display: flex;
                    align-items: center;
                    margin-bottom: 2px;
                }
        
                .anime_search .anime_search-content .search-content-unit .tip-title p {
                    flex: 1;
                    margin-left: 5px;
                    font-size: 13px;
                    color: var(--text-secondary-color);
                }
        
                .anime_search .anime_search-content .search-content-unit .tip-title .delete-record-btn {
                    border: 0;
                    width: 22px;
                    height: 22px;
                    padding: 0;
                    border-radius: 3px;
                    background: var(--btn-search-trashicon-bg);
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
        
                .anime_search .anime_search-content .search-content-unit .tip-title .delete-record-btn:hover:not(:disabled) {
                    background: var(--btn-search-trashicon-bg-hover);
                }
        
                .anime_search .anime_search-content .search-content-unit .search-tag-wrap {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-bottom: 6px;
                }
        
                .anime_search .anime_search-content .search-content-unit .search-tag-wrap .search-tag {
                    min-height: 22px;
                    padding: 2px 4px;
                    border-radius: 3px;
                    border: 1px solid var(--auxiliary-line);
                    font-size: 13px;
                    line-height: 22px;
                    color: var(--text-default-color);
                    background: var(--btn-neo);
                    cursor: pointer;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    transition: background 0.3s ease;
                }
        
                .anime_search .anime_search-content .search-content-unit .search-tag-wrap .search-tag:hover {
                    background: var(--btn-neo-hover);
                }
        
                .anime_search .anime_search-content .search-content-unit.search-filter .btn-filter {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 44px;
                    border-radius: 4px;
                    background-color: var(--btn-neo);
                    border: 1px solid var(--auxiliary-line);
                    font-weight: bold;
                    text-align: center;
                    line-height: 44px;
                    font-size: 1.6rem;
                    color: var(--text-secondary-color);
                    letter-spacing: 4%;
                    cursor: pointer;
                    margin: 6px 0;
                    transition: background 0.3s ease, color 0.3s ease;
                }
        
                .anime_search .anime_search-content .search-content-unit.search-filter .btn-filter:hover {
                    background-color: var(--anime-primary-color);
                    color: rgba(var(--anime-white-rgb), 1);
                }
        
                .webview_commendlist .c-reply__editor .reply-content .reply-input,
                .party .webview_chatlist .c-reply__editor .reply-content .reply-input {
                    padding: 8px 44px 8px 8px;
                    border-radius: 33px;
                    position: relative;
                    background: var(--anime-background-base);
                    border: 1px solid var(--border-color);
                    scale: 0.95;
                    transition: all 0.3s cubic-bezier(0, 0, 0.1, 0.8);
                    width: 95%;
                }
        
                .webview_commendlist .c-reply__editor .reply-content .reply-input:focus-within,
                .party .webview_chatlist .c-reply__editor .reply-content .reply-input:focus-within {
                    border-radius: 8px;
                    scale: 1;
                    width: 100%;
                }
        
                .player .videoframe{
                    border-radius: 8px;
                    background: transparent !important;
                }

                .videoframe.pip-mode.vjs-fullwindow {
                    height: auto !important;
                }
        
                .newanime-date-area,
                .anime-card-block .anime-pic-block .anime-blocker > img,
                .anime-card-block .anime-pic-block .anime-blocker,
                .continue-watch-area .continue-watch-list .continue-watch-card .img-block,
                .gossip {
                    transition: all 0.5s ease;
                }
        
                .btn-newanime-filter {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--text-default-color);
                    cursor: pointer;
                    background: var(--card-bg);
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 4px 12px;
                    transition: box-shadow 0.3s ease;
                }
        
                .btn-newanime-filter:hover {
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                }
        
                .btn-newanime-filter .newanime-filter-text {
                    font-size: 1.6rem;
                }
        
                .btn-newanime-filter .newanime-filter-icon {
                    margin-left: 4px;
                    font-size: 1.6rem;
                    width: 22px;
                    height: 16px;
                    background-repeat: no-repeat;
                    background-position: center;
                }
        
                .btn-newanime-filter .filter-items {
                    position: absolute;
                    /* bottom: 12px; */
                    left: 50%;
                    transform: translate(-50%, 70%) scale(0.9);
                    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.3);
                    z-index: 11;
                    border-radius: 8px;
                    background: var(--gray1-color);
                    color: var(--text-default-color);
                    padding: 4px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    scale: 0;
                }
        
                .btn-newanime-filter:hover .filter-items {
                    visibility: visible;
                    opacity: 1;
                    scale: 1;
                }
        
                .btn-newanime-filter .filter-items:after {
                    content: "";
                    position: absolute;
                    right: 8px;
                    top: -5px;
                    border: 5px solid;
                    border-color: var(--card-bg) transparent transparent var(--card-bg);
                    transform: all 0.3s ease;
                }
        
                .btn-newanime-filter .filter-items li {
                    font-size: 1.4rem;
                    padding: 8px 8px 8px 24px;
                    z-index: 11;
                    word-break: keep-all;
                    border-radius: 4px;
                    transition: background-color 0.3s ease;
                }
        
                .btn-newanime-filter .filter-items li.is-active {
                    background-repeat: no-repeat;
                    background-position: 4px center;
                }
        
                .btn-newanime-filter .filter-items li:hover {
                    background-color: var(--gray2-color);
                }

                @media screen and (max-width: 1000px) {
                    .topSkyPlaceholder {
                        height: 75px !important;
                    }
                }

                .topSkyPlaceholder {
                    height: 90px;
                }
        
        
            `,
        func: () => {
            let Func = `
                    const TOPSKY = $('.top_sky')[0];
                    // 覆盖原有的 showSky 函数
                    function showSky(mode = 0) {
                        if (!TOPSKY.classList.contains('fullwindow')) { return; }
                        if (mode < 23754) { return; }
                        setTimeout(function () {
                            TOPSKY.classList.remove('fullwindow');
                        }, 0);
                    };

                    // 覆盖原有的 hideSky 函数
                    function hideSky(mode = 0) {
                        if (TOPSKY.classList.contains('fullwindow')) { return; }
                        if (mode < 23754) { return; }
                        if (document.querySelector('.menu_btn.toggle.active')) { return; }
                        if (!TOPSKY.matches(':hover')) {
                            setTimeout(function () {
                                TOPSKY.classList.add('fullwindow');
                                
                            }, 0);
                        }
                    };
                `
            // 创建并插入一个新的 script 标签
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = Func.toString();
            setTimeout(() => {
                document.body.appendChild(script);
            }, 2000);


            (() => {
                if (window.location.href.includes('animeVideo.php')) { return } // 测试网址是否含有 animeVideo.php
                const topSkyPlaceholder = document.createElement('div');
                topSkyPlaceholder.classList.add('topSkyPlaceholder');
                document.body.insertBefore(topSkyPlaceholder, document.body.querySelector('.BH_background'));
            })()

            const TOPSKY = $('.top_sky')[0];
            let lastScrollTime = Date.now();
            let scrollDelta = 0;
            let lastScrollTop = 0;


            // 监听滚动事件
            $(window).on('scroll', function () {
                requestAnimationFrame(() => {
                    let scrollTop = $(this).scrollTop();
                    let video = document.querySelector('.video')

                    if (scrollTop <= 90) {
                        if (video) { hideSky(23754); scrollDelta = 0; return; }
                        else { showSky(23754); scrollDelta = 0; return; }
                    }else if (scrollTop > 90 && !self.settings.skyScroll) {
                        if (video) { showSky(23754); scrollDelta = 0; return; }
                        else { hideSky(23754); scrollDelta = 0; return; }
                    }
                    if (Date.now() - lastScrollTime < 200) { return; }
                    let delta = scrollTop - lastScrollTop;
                    scrollDelta += delta;
                    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                    lastScrollTime = Date.now();
                    if (!self.settings.skyScroll) { return; }
                    if (scrollDelta > 0) {
                        hideSky(23754);
                    } else if (scrollDelta < 0) {
                        showSky(23754);
                    }
                    scrollDelta = 0;
                });
            });

            let topSkyDisplayByMouse = false;
            $(window).on('mousemove', (e) => {
                if (!self.settings.skyMouse) { return; }
                requestAnimationFrame(() => {
                    if (e.clientY < 20) {
                        if (!TOPSKY.classList.contains('fullwindow')) return
                        showSky(23755);
                        topSkyDisplayByMouse = true;
                        lastScrollTime = Date.now();
                    } else if (e.clientY > (document.querySelector(".on_top .container-player").clientHeight + 55) && topSkyDisplayByMouse && !document.querySelector('.menu_btn.toggle.active') ) {
                        hideSky(23755);
                        topSkyDisplayByMouse = false;
                        lastScrollTime = Date.now();
                    }
                });
            });

            setTimeout(() => {
                // 监听复选框状态
                $('#skyMouse').on('change', function (event) {
                    const isChecked = $(this).is(':checked');
                    self.settings.skyMouse = isChecked;
                });

                $('#skyScroll').on('change', function (event) {
                    const isChecked = $(this).is(':checked');
                    self.settings.skyScroll = isChecked;
                });

                hideSky(23754)
            }, 1000);

            setTimeout(() => {
                hideSky(23754)
            }, 2000);
        }
    });

    // 设置
    ANI_GAMER_COM.addFunction('Settings', {
        contain: () => {
            return window.location.href.includes('animeVideo.php')
        },
        style: `
            .settings-modal {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: var(--card-bg);
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                z-index: 910000;
            }
            .settings-option {
                position: relative;
                margin-bottom: 10px;
            }
            .tooltip {
                position: absolute;
                top: 0;
                cursor: pointer;
            }
        `,
        func: () => {
            // 检测用户语言
            const userLang = navigator.language || navigator.userLanguage;
            const lang = userLang.includes('zh-TW') ? 'zh_TW' : userLang.includes('zh') ? 'zh_CN' : 'en';
            this.languageTexts = ani_gamer_com.languageTexts[lang];

            const settingButton = AgcFunction.newButton('imgtool', [
                this.languageTexts.settingsTitle,
                () => { settingsModal.style.display = 'block' } // 显示设置界面
            ])
            console.log(settingButton)

            setTimeout(() => {
                let func = () => {
                    const imageTool = document.querySelector('.plus_imagetool_box');
                    imageTool.appendChild(settingButton);
                }
                try {
                    func()
                } catch (error) {
                    console.error('Error appending settingButton:', error);
                    // 如果出错，1秒重试
                    setTimeout(() => {
                        func()
                    }, 1000);
                }
            }, 1000);


            // 创建设置界面
            const settingsModal = document.createElement('div');
            settingsModal.className = 'settings-modal'; // 使用统一的 CSS 类
            settingsModal.innerHTML = `
                <h2>${this.languageTexts.settingsTitle}</h2>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="enableImageZoom"> ${this.languageTexts.enableImageZoom}
                    </label>
                    <span class="tooltip" title="${this.languageTexts.tooltip}">?</span>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="enableMiniPlayer"> ${this.languageTexts.enableMiniPlayer}
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="skyMouse"> ${this.languageTexts.skyMouse}
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="skyScroll"> ${this.languageTexts.skyScroll}
                    </label>
                </div>
                <button id="closeSettings">${this.languageTexts.close}</button>
            `;
            document.body.appendChild(settingsModal);

            document.getElementById('closeSettings').addEventListener('click', () => {
                settingsModal.style.display = 'none'; // 隐藏设置界面
            });

            // 图片放大
            const enableImageZoomCheckbox = document.getElementById('enableImageZoom');
            enableImageZoomCheckbox.checked = self.settings.imageZoomEnabled;

            // 小窗
            const enableMiniPlayerCheckbox = document.getElementById('enableMiniPlayer');
            enableMiniPlayerCheckbox.checked = self.settings.miniPlayerEnabled;

            // 鼠标悬停切换sky显示
            const enableSkyMouseCheckbox = document.getElementById('skyMouse');
            enableSkyMouseCheckbox.checked = self.settings.skyMouse;

            // 滚轮切换sky显示
            const enableSkyScrollCheckbox = document.getElementById('skyScroll');
            enableSkyScrollCheckbox.checked = self.settings.skyScroll;

        }
    });

    // 图片放大
    ANI_GAMER_COM.addFunction('ImageZoom', {
        func: () => {
            const ImageZoom_aSytle = new aStyle();

            function activeImageZoom() {
                ImageZoom_aSytle.add(`
                    .webview_commendlist .c-reply__item .reply-content .reply-content__cont img:hover, 
                    .party .webview_chatlist .c-reply__item .reply-content .reply-content__cont img:hover {
                        scale: 1.1;
                        max-width: 150%;
                        max-height: 2560px;
                        border: 4px solid var(--border-color);
                    }
                    .data-img {
                        scale: 1;
                        height: 230px;
                        transition: all 0.6s ease;
                    }
                    .data-img:hover {
                        scale: 1.1;
                        height: 100% !important;
                        border: 4px solid var(--border-color);
                    }
                    .data-img:hover {
                        scale: 1.1;
                        height: 100% !important;
                        border: 4px solid var(--border-color);
                    }
                    .webview_commendlist .c-reply__item .reply-content .reply-content__cont img, 
                    .party .webview_chatlist .c-reply__item .reply-content .reply-content__cont img {
                        margin-bottom: 4px;
                        border-radius: 8px;
                        vertical-align: bottom;
                        display: block;
                        scale: 1;
                        transition: all 0.6s ease;
                        max-height: 800px;
                        max-width: 100%;
                        border: 1px solid var(--border-color);
                    }
                    `)
            }

            function disableImageZoom() {
                ImageZoom_aSytle.remove(-1);
            }


            // 监听复选框状态
            $('#enableImageZoom').on('change', function (event) {
                const isChecked = $(this).is(':checked');
                self.settings.imageZoomEnabled = isChecked;
                if (isChecked) {
                    activeImageZoom();
                } else {
                    disableImageZoom();
                }
            });

            // 根据保存的设置初始化样式
            if (self.settings.imageZoomEnabled) {
                activeImageZoom();
            }

        }
    })

    // 小窗
    ANI_GAMER_COM.addFunction('MiniPlayer', {
        contain: () => {
            return window.location.href.includes('animeVideo.php')
        },
        style: `
            .pip-mode {
                position: fixed !important;
                bottom: 10px !important;
                right: 10px !important;
                width: 40% !important;
                height: auto !important;
                z-index: 1000 !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
                border: 1px solid #ccc !important;
                background-color: #fff !important;
            }
            .videoframe.pip-mode .vjs-pre-button,
            .videoframe.pip-mode .vjs-next-button,
            .videoframe.pip-mode .vjs-current-time,
            .videoframe.pip-mode .vjs-time-divider,
            .videoframe.pip-mode .vjs-duration,
            .videoframe.pip-mode .plus_picture_in_picture_icon,
            .videoframe.pip-mode .vjs-vjs-indent-button,
            .videoframe.pip-mode .vjs-res-button,
            .videoframe.pip-mode .trend_box,
            .videoframe.pip-mode .vjs-indent-enable.fullwindow-close {
                display: none !important;
            }

            .videoframe.pip-mode .video-js .vjs-control {
                width: 2.5em !important;
            }

            .videoframe.pip-mode .vjs-control-bar .danmutext_area {
                max-width: 65% !important;
            }

            .videoframe.pip-mode .vjs-control-bar .danmutext_area .danmu-setting_btn .vjs-menu {
                width: 305px !important;
                padding: 12px 14px !important;
                left: 16em !important;
                bottom: 3em !important;
            }
            .videoframe.pip-mode .vjs-danmu-button .vjs-menu {
                left: 0 !important;
                right: -500% !important;
            }

        `,
        func: () => {
            function MiniPlayer() {
                const videoElement = $('#ani_video');
                const miniPlayerButton = $('#ani_video > div.vjs-control-bar > div.control-bar-rightbtn > div.control_box > button');

                if (!videoElement || !miniPlayerButton) {
                    console.error('videoElement or miniPlayerButton not found');
                    return;
                }
                let isMiniPlayerShow = false;

                // 监听复选框状态
                $('#enableMiniPlayer').on('change', function (event) {
                    const isChecked = $(this).is(':checked');
                    self.settings.miniPlayerEnabled = isChecked;
                });

                function WH() {
                    const player = document.querySelector('.videoframe');
                    const playerWidth = player.clientWidth;
                    const playerHeight = player.clientHeight;
                    return { playerWidth, playerHeight, player }
                }

                // 获取 .videoframe 的长宽，并在 videoframe 后面建一个大小一样的元素作为占位
                const { playerWidth, playerHeight, player } = WH();
                const placeholder = document.createElement('div');
                placeholder.style.width = `${playerWidth}px`;
                placeholder.style.height = `${playerHeight}px`;
                placeholder.style.background = 'var(--border-on-black-tippy)';
                placeholder.style.display = 'none';
                placeholder.id = 'miniPlayerPlaceholder';
                player.parentNode.insertBefore(placeholder, player.nextSibling);

                $(window).on('scroll', function () {
                    if (!self.settings.miniPlayerEnabled) { return; }
                    requestAnimationFrame(() => {
                        let scrollTop = $(this).scrollTop();
                        if (scrollTop > 500 && !isMiniPlayerShow) {
                            const videoElement = document.querySelector('.videoframe');
                            if (videoElement) {
                                const { playerWidth, playerHeight, player } = WH();
                                document.getElementById('miniPlayerPlaceholder').style.width = `${playerWidth}px`;
                                document.getElementById('miniPlayerPlaceholder').style.height = `${playerHeight}px`;
                                videoElement.classList.toggle('pip-mode');
                                document.getElementById('miniPlayerPlaceholder').style.display = 'block';
                            }
                            isMiniPlayerShow = true;
                        }
                        else if (scrollTop < 500 && isMiniPlayerShow) {
                            const videoElement = document.querySelector('.videoframe');
                            if (videoElement) {
                                videoElement.classList.toggle('pip-mode');
                                document.getElementById('miniPlayerPlaceholder').style.display = 'none';
                            }
                            isMiniPlayerShow = false;
                        }
                    });
                });
            }
            setTimeout(() => {
                MiniPlayer();
            }, 1000);
        }
    })

    ANI_GAMER_COM.run()

    console.log(self.settings)

})();

