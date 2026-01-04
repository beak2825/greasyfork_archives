// ==UserScript==
// @name         百度搜索 - 优化
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/31642
// @description  1、屏蔽百度推广 2、关闭百度广告联盟信息收集 3、绑定快捷键 4、布局调整 5、居中单列(可选) 6、居中双列(可选)
// @version      4.2.5
// @author       浮生未歇
// @run-at       document-start
// @include      https://www.baidu.com/
// @include      https://www.baidu.com/s?*
// @incluce      https://www.baidu.com/#*
// @include      https://www.baidu.com/baidu?*
// @exclude      https://www.baidu.com/home*
// @exclude      https://www.baidu.com/sf*
// @exclude      https://www.baidu.com/search*
// @exclude      https://www.baidu.com/link*
// @exclude      https://www.baidu.com/s*tn=news*
// @resource     baiduIndexStyle   https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/indexStyle.css
// @resource     baiduCommonStyle  https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/commonStyle.css
// @resource     baiduMenu         https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/menu.css
// @resource     baiduOne          https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/one.css
// @resource     baiduTwo          https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/two.css
// @resource     baiduThree        https://cdn.jsdelivr.net/gh/sinlin/baidu@1.0.6/2018-10-30/three.css
// @connect      *
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388489/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/388489/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(() => {
    //初始化配置
    const Configs = {
        //是否调试
        IS_DEBUG: false,
        //壁纸地址
        BACKGROUND_URL: "https://ss2.bdstatic.com/lfoZeXSm1A5BphGlnYG/skin/37.jpg",
        //自定义按钮 ID
        CUSTOM_BUTTON_ID: "CustomMenu",
        //菜单功能页 ID
        MENU_ITEMS_ID: "menulist",
        //菜单保存按钮 ID
        MENU_SAVA_ID: "menusava",
        //自定义背景
        CUSTOM_BG: [
            { name: "CUSTOM_BG_URL", value: "" }
        ],
        //功能配置
        OPTIONS: [
            //页面布局：1：普通页面，2：单列居中，3：双列居中，4：三列居中
            { name: "SELECT_PAGE", value: 1 },
            //重定向
            { name: "SWITCH_IS_REDIRECT", value: false },
            //加载下一页
            { name: "SWITCH_IS_LOADPAGE", value: false },
            //固定侧边栏
            { name: "SWITCH_IS_FIXEDSILDER", value: false },
            //加载背景
            { name: "SWITCH_IS_BACKGOUND", value: false },
            //百家号
            { name: "SWITCH_IS_BAIJIAHAO", value: false }
        ],
        //百度样式
        BAIDU_STYLES: [
            {
                //百度首页
                INDEX: GM_getResourceText("baiduIndexStyle"),
                //普通页
                COMMON: GM_getResourceText("baiduCommonStyle"),
                //菜单
                MENU: GM_getResourceText("baiduMenu"),
                //单页
                ONE: GM_getResourceText("baiduOne"),
                //双页
                TWO: GM_getResourceText("baiduTwo"),
                //三页
                THREE: GM_getResourceText("baiduThree")
            }
        ],
        //过滤功能 ,不能设置 G(已被 Google搜索 占用)
        FILTERS: [
            {
                name: "B",
                value: "-baijiahao"
            },
            {
                name: "T",
                value: "site:tieba.baidu.com"
            },
            {
                name: "J",
                value: "site:juejin.im"
            },
            {
                name: "S",
                value: "site:segmentfault.com"
            },
            {
                name: "V",
                value: "site:v2ex.com"
            },
            {
                name: "Z",
                value: "site:zhihu.com"
            }
        ]
    };
    //打包
    const BaiduConfig = { window, document, location, Configs };
    //Baidu
    const Baidu = (({ window, document, location, Configs }, undefined) => {
        //创建空对象
        const Baidu = Object.create(null);
        /**
         * 实现 ready 功能， 文档完成后即执行
         * 举例 ： Baidu.ready = function(){}
         */
        Reflect.defineProperty(Baidu, "ready", {
            set: fn => {
                if (document.readyState === "complete") {
                    fn();
                }
                else if (!!document.addEventListener) {
                    document.addEventListener("DOMContentLoaded", () => {
                        fn();
                    }, true);
                }
                else {
                    throw new Error("Baidu.ready can't use");
                }
            }
        });
        /**
         * 延时执行
         * count 1 = 16.7ms
         */
        Baidu.delayRun = (callback, count = 0) => {
            if (count === 0) {
                window.requestAnimationFrame(() => {
                    return callback();
                });
            }
            else {
                window.requestAnimationFrame(() => {
                    Baidu.delayRun(callback, --count);
                });
            }
        };
        /**
         * GM数据类
         * @class GM
         */
        let GM = class {
            getValue(selection) {
                try {
                    return GM_getValue(selection.name, selection.value);
                }
                catch (msg) {
                    console.error(msg);
                }
            }
            setValue(name, value) {
                try {
                    GM_setValue(name, value);
                }
                catch (msg) {
                    console.error(msg);
                }
            }
            addStyle(style) {
                try {
                    GM_addStyle(style);
                }
                catch (msg) {
                    console.error(msg);
                }
            }
            xmlhttpRequest(object) {
                try {
                    GM_xmlhttpRequest(object);
                }
                catch (msg) {
                    console.error(msg);
                }
            }
        };
        /**
         * 助手类
         * 用于与底层交互
         */
        class Base extends GM {
            constructor() {
                super();
                this.Configs = Configs;
                this.PAGE_LAYOUT = Configs.OPTIONS[0];
                this.USE_REDIRECT = Configs.OPTIONS[1];
                this.USE_AUTO_NEXT_PAGE = Configs.OPTIONS[2];
                this.USE_FIXED_SILDER = Configs.OPTIONS[3];
                this.USE_BACKGROUND = Configs.OPTIONS[4];
                this.USE_HIDE_BAIJIAHAO = Configs.OPTIONS[5];
                this.CURRENT_BACKGROUND_URL = Configs.BACKGROUND_URL;
            }
            getCustomBgName() {
                return Configs.CUSTOM_BG[0]["name"];
            }
            getCustonBgURL() {
                return super.getValue(Configs.CUSTOM_BG[0]) || "";
            }
            getCustomButtonIdName() {
                return Configs.CUSTOM_BUTTON_ID;
            }
            getMenuItemsIdName() {
                return Configs.MENU_ITEMS_ID;
            }
            getMenuSaveIdname() {
                return Configs.MENU_SAVA_ID;
            }
            getCurrentBackgroundURL() {
                return this.CURRENT_BACKGROUND_URL || "";
            }
            getCurrentPageLayoutType() {
                return Number(super.getValue(this.PAGE_LAYOUT));
            }
            getPageLayoutName() {
                return this.PAGE_LAYOUT["name"];
            }
            getUseRedirectName() {
                return this.USE_REDIRECT["name"];
            }
            getUseAuoLoadNextPageName() {
                return this.USE_AUTO_NEXT_PAGE["name"];
            }
            getUseFixedSilderName() {
                return this.USE_FIXED_SILDER["name"];
            }
            getUseBackgroundName() {
                return this.USE_BACKGROUND["name"];
            }
            getUseHideBaiJiaHaoName() {
                return this.USE_HIDE_BAIJIAHAO["name"];
            }
            isUseRedirect() {
                return !!super.getValue(this.USE_REDIRECT);
            }
            isUseAuoLoadNextPage() {
                return !!super.getValue(this.USE_AUTO_NEXT_PAGE);
            }
            isUseFixedSilder() {
                return !!super.getValue(this.USE_FIXED_SILDER);
            }
            isUseBackground() {
                return !!super.getValue(this.USE_BACKGROUND);
            }
            isUseHideBaiJiaHao() {
                return !!super.getValue(this.USE_HIDE_BAIJIAHAO);
            }
            getStyleContentForCommon() {
                return Configs.BAIDU_STYLES[0]["COMMON"] || "";
            }
            getStyleContentForIndex() {
                return Configs.BAIDU_STYLES[0]["INDEX"] || "";
            }
            getStyleContentForMenu() {
                return Configs.BAIDU_STYLES[0]["MENU"] || "";
            }
            getStyleContentForOne() {
                return Configs.BAIDU_STYLES[0]["ONE"] || "";
            }
            getStyleContentForTwo() {
                return Configs.BAIDU_STYLES[0]["TWO"] || "";
            }
            getStyleContentForThree() {
                return Configs.BAIDU_STYLES[0]["THREE"] || "";
            }
            removeElementForID(idName = "") {
                let element = document.getElementById(idName);
                if (!!element) {
                    element.parentNode.removeChild(element);
                }
            }
        }
        /**
         * 缓存类
         * 用于对数据的缓存
         * @class Cache
         *
         */
        class Cache extends Base {
            constructor() {
                super();
                this.cache = "";
            }
            /**
             * 删除缓存
             */
            delCache() {
                this.cache = "";
            }
            /**
             * 添加缓存
             * @param Content ｛string｝ 缓存内容
             */
            addCache(Content) {
                this.cache += Content;
            }
            /**
             * 获取缓存内容
             */
            getCache() {
                return this.cache;
            }
        }
        /**
         * 样式
         * @class Style
         * @extends Cache
         */
        class Style extends Cache {
            constructor() {
                super();
            }
            /**
             * 删除样式缓存
             */
            deleteStyleCache() {
                super.delCache();
            }
            /**
             * 获取样式缓存内容
             */
            getStyleCache() {
                return super.getCache();
            }
            /**
             * 添加样式到缓存
             * @param styleContent
             */
            addStyleCache(styleContent) {
                super.addCache(styleContent);
            }
            /**
             * 向网页导入样式
             * @method importStyle
             *
             */
            importStyle() {
                let styleContnet = this.getStyleCache();
                super.addStyle(styleContnet);
            }
            /**
             * 将样式加入缓存
             * @param {stirng} styleContent 样式内容
             * @return {Style} this 该实例
             */
            add(styleContent) {
                this.addStyleCache(styleContent);
                return this;
            }
            /**
             * 结束
             * 开始将缓存样式导入，并清空缓存
             */
            end() {
                this.importStyle();
                this.deleteStyleCache();
            }
        }
        /**
         * 函数执行器 - 组合执行
         */
        class Commond {
            constructor() {
                this.commondList = [];
            }
            /**
             * 添加数组缓存中
             * @param {object} command 对象实例
             */
            add(command) {
                this.commondList.push(command);
            }
            /**
             * 执行数值缓存中的实例
             */
            execute() {
                for (let i = 0, command; (command = this.commondList[i++]);) {
                    command.execute();
                }
            }
        }
        /**
         * 检测功能 - 避免代码多次执行
         * @class AvoidMulExecute
         */
        class AvoidMulExecute {
            constructor() {
                //标志名称
                this.SING_NAME = "IsRunBaidu";
            }
            /**
             * 获取需要标志的元素
             */
            getSignElement() {
                return document.getElementById("content_left") || {};
            }
            /**
             * 增加标志位
             */
            setSign() {
                let container = this.getSignElement();
                container.setAttribute(this.SING_NAME, true);
            }
            /**
             * 判断是否存在标志位
             */
            hasSign() {
                let container = this.getSignElement();
                return !!container.hasAttribute(this.SING_NAME);
            }
        }
        /**
         * 导入首页样式
         * @class IMportIndexStyle
         */
        class ImportIndexStyle extends Style {
            constructor() {
                super();
            }
            /**
             * 获取首页的样式
             */
            getStyleForIndex() {
                return super.getStyleContentForIndex();
            }
            /**
             * 导入样式
             * @method import
             */
            import() {
                super.add(this.getStyleForIndex())
                    .end();
            }
            /**
             * 初始化
             * @method init
             */
            init() {
                this.import();
            }
            /**
             * 执行
             * @method execute
             */
            execute() {
                this.init();
            }
        }
        /**
       * 导入普通结果页样式
       * @class ImportCommonStyle
       */
        class ImportCommonStyle extends Style {
            constructor() {
                super();
            }
            /**
             * 样式 - 背景
             * @method styleForBackground
             * @returns {string} 样式
             */
            styleForBackground() {
                let currentBackgroundURL = super.getCustonBgURL() || super.getCurrentBackgroundURL();
                if (super.isUseBackground()) {
                    return `body{background-color:transparent!important}body:after{content:"";position:fixed;top:0;bottom:0;left:0;right:0;background-image:url(${currentBackgroundURL})!important;background-size:cover!important;z-index:-1}#head{background-color:hsla(0, 0%, 100%, 0.65)!important;border-bottom-color:hsla(0, 0%, 52%, 0.3)!important}#content_left .c-container,#rs{border:none!important;background: hsla(0, 0%, 100%, 0.85)!important}#form>.s_ipt_wr.bg{background:#fff!important}#u>a{color: hsl(216, 80%, 63%)!important}#u>a:after{background:transparent!important;border:1px solid!important;}`;
                }
                else {
                    return "";
                }
            }
            /**
             * 样式 - 固定侧边栏
             * @method styleForFixedSilder
             * @returns {string} 样式
             */
            styleForFixedSilder() {
                if (super.isUseFixedSilder()) {
                    return "#s_tab{left:0!important;opacity:1!important;}";
                }
                else {
                    return "";
                }
            }
            /**
             * 样式  - 页面布局
             * @method styleForPageLayout
             * @returns {string} 样式
             */
            styleForPageLayout() {
                let currentPageLayoutType = super.getCurrentPageLayoutType();
                switch (currentPageLayoutType) {
                    case 1:
                        return "";
                    case 2:
                        return super.getStyleContentForOne();
                    case 3:
                        return super.getStyleContentForTwo();
                    case 4:
                        return super.getStyleContentForThree();
                }
            }
            /**
             * 样式 - 菜单
             * @method styleForMenu
             * @returns {string} 样式
             */
            styleForMenu() {
                return super.getStyleContentForMenu();
            }
            /**
             * 样式 - 结果页
             * @method styleForCommand
             * @returns {string} 样式
             */
            styleForCommand() {
                return super.getStyleContentForCommon();
            }
            /**
             * 导入样式
             * @method import
             */
            import() {
                super.add(this.styleForCommand())
                    .add(this.styleForMenu())
                    .add(this.styleForPageLayout())
                    .add(this.styleForFixedSilder())
                    .add(this.styleForBackground())
                    .end();
            }
            /**
             * 初始化
             * @method init
             */
            init() {
                this.import();
            }
            /**
             * 执行
             * @method execute
             */
            execute() {
                this.init();
            }
        }
        /**
         * 百家号
         */
        class HideBaijiahao extends Base {
            constructor() {
                super();
                this.ELEMNET_ID = "mybaijiahao";
                this.FILTER_VALUE = "baijiahao";
                this.BAIDU_SEARCH_PATH = "https://www.baidu.com/s?ie=utf-8&wd=";
            }
            /**
             * 根据关键字搜索
             * @param url 部分url 如？wd=1&test=2
             * @param keyworld 有搜索的关键词
             */
            getKeyValue(url, keyworld) {
                //移除首字母
                if (url.startsWith("?")) {
                    url = url.substr(1);
                }
                //转化为数组
                let arr = url.split("&").map(value => {
                    return value.split("=");
                });
                //获取关键值
                for (let [name, value] of arr) {
                    if (name === keyworld) {
                        return value;
                    }
                }
            }
            /**
             * 获取关键词
             * @param url 部分url 如？wd=1&test=2
             */
            getSearchKeyword(url) {
                let name = "wd";
                return this.getKeyValue(url, name);
            }
            /**
             * 重定向
             */
            redirect() {
                let filterValue = this.FILTER_VALUE;
                let templateURL = this.BAIDU_SEARCH_PATH;
                let keyValue = this.getSearchKeyword(location.search);
                if (!keyValue.includes(filterValue)) {
                    location.href = templateURL + keyValue + " -" + filterValue;
                }
            }
            /**
             * 隐藏过滤值
             */
            hidefilterValue() {
                let keyValue = " -" + this.FILTER_VALUE;
                let reg = RegExp(keyValue);
                let input = document.getElementById("kw");
                input.value = input.value.replace(reg, "");
            }
            /**
             * 显示输入值
             */
            showInputValue() {
                let input = document.getElementById("kw");
                input.style.visibility = "visible";
            }
            /**
             * 隐藏输入值
             */
            hideinputValue() {
                let style = new Style();
                style.add("#kw{visibility:hidden}");
                style.end();
            }
            /**
             * 判断是否存在新的输入框
             */
            hasNewInput() {
                return !!document.getElementById(this.ELEMNET_ID);
            }
            /**
             * 是新的input和旧的input内容保持
             */
            replaceInputContent() {
                let input = document.getElementById(this.ELEMNET_ID);
                let oldInput = document.getElementById("kw");
                input.value = oldInput.value.trim().replace(/\s-baijiahao/, "");
            }
            /**
             * 插入新的输入框：用于映射数据
             */
            insertNewInput() {
                let container = document.getElementsByClassName("s_ipt_wr")[0];
                let oldInput = document.getElementById("kw");
                let input = document.createElement("input");
                input.id = this.ELEMNET_ID;
                input.type = "text";
                // input.autofocus = true;
                input.autocomplete = "off";
                input.value = oldInput.value.trim().replace(/\s-baijiahao/, "");
                input.setAttribute("maxlength", "255");
                container.appendChild(input);
                Promise.resolve().then(() => {
                    input.blur();
                });
            }
            /**
             * 对新的输入框绑定事件
             */
            bindNewInputEvent() {
                let input = document.getElementById(this.ELEMNET_ID);
                let oldInput = document.getElementById("kw");
                input.addEventListener("keyup", () => {
                    if (input.value.trim() !== "") {
                        oldInput.value =
                            input.value.replace(/\s-baijiahao/, "") +
                                " -" +
                                this.FILTER_VALUE;
                    }
                }, false);
                input.blur();
                oldInput.blur();
            }
            /**
             * 初始化
             */
            init() {
                //重定向
                this.redirect();
                //隐藏值
                this.hideinputValue();
                Baidu.ready = () => {
                    if (!this.hasNewInput()) {
                        this.insertNewInput();
                        this.bindNewInputEvent();
                    }
                    else {
                        this.replaceInputContent();
                    }
                    //    this.showInputValue();
                };
            }
            /**
             * 执行
             */
            execute() {
                if (super.isUseHideBaiJiaHao()) {
                    this.init();
                }
            }
        }
        /**
         * 菜单功能页
         * @class MenuItemsOptions
         * @extends Base
         * @implements Template
         */
        class MenuItemsOptions extends Base {
            constructor() {
                super();
                this.CUSTOM_LAYOUT_TAG_NAME = "baidupage";
                this.CUSTOM_SWITCH_TAG_NAME = "baiduswitch";
                this.UPDATE_BACKGROUND_ID_NAME = "baiduupdatebackground";
            }
            /**
             * 获取菜单列表元素 ID 名称
             */
            getMenuItemsIdName() {
                return super.getMenuItemsIdName();
            }
            /**
             * 获取菜单保存按钮 ID 名称
             */
            getMenuSaveIdName() {
                return super.getMenuSaveIdname();
            }
            /**
             * 获得 HTML - 页面布局选项
             * @param content 显示的内容
             * @param layoutType 页面布局类型
             */
            getContentPageSelect(content, layoutType) {
                let checked = super.getCurrentPageLayoutType() === layoutType ? "checked" : "";
                return `<li><input type="radio" name="${this.CUSTOM_LAYOUT_TAG_NAME}" value="${layoutType}" ${checked}>${content}</li>`;
            }
            /**
             * 获得 HTML - 功能选项选项
             * @param content 显示的内容
             * @param selection 功能配置
             */
            getContentFunSelect(content, name, isChecked) {
                let checked = !!isChecked ? "checked" : "";
                return `<li><input type="checkbox" name="${this.CUSTOM_SWITCH_TAG_NAME}" value="${name}" ${checked}>${content}</li>`;
            }
            /**
             * 获得 HTML - 保存
             * @param content 显示的内容
             */
            getContentSava(content) {
                let menuSaveIdName = this.getMenuSaveIdName();
                return `<input id='${menuSaveIdName}' type='button' style='margin-top:3px;display:block;width:100%' value='${content}'>`;
            }
            /**
             *
             */
            getContentCustomBackground(content) {
                let updateBgIdName = this.UPDATE_BACKGROUND_ID_NAME;
                return `<input id='${updateBgIdName}' type='button' style='margin-top:3px;display:block;width:100%' value='${content}'>`;
            }
            //获取整体 HTML
            getContent() {
                let content = "";
                content += "<ol>页面选择";
                content += this.getContentPageSelect("普通页面", 1);
                content += this.getContentPageSelect("单页居中", 2);
                content += this.getContentPageSelect("双页居中", 3);
                content += this.getContentPageSelect("三页居中", 4);
                content += "</ol>";
                content += "<ol>功能选择";
                content += this.getContentFunSelect("去除重定向", super.getUseRedirectName(), super.isUseRedirect());
                content += this.getContentFunSelect("自动下一页", super.getUseAuoLoadNextPageName(), super.isUseAuoLoadNextPage());
                content += this.getContentFunSelect("固定侧边栏", super.getUseFixedSilderName(), super.isUseFixedSilder());
                content += this.getContentFunSelect("加载背景", super.getUseBackgroundName(), super.isUseBackground());
                content += this.getContentFunSelect("屏蔽百家号", super.getUseHideBaiJiaHaoName(), super.isUseHideBaiJiaHao());
                content += "</ol>";
                content += this.getContentCustomBackground("修改背景");
                content += this.getContentSava("保存");
                return content;
            }
            /**
             * 更新背景6图片地址
             */
            updateBgURL() {
                let backgroundURL = prompt("请输入自定义的壁纸链接:");
                let reg = /^https?\:.+\.[(jpg)|(png)|(jpeg)|(gif)|(bmp)$]/;
                if (!!reg.test(backgroundURL)) {
                    super.setValue(super.getCustomBgName(), backgroundURL);
                    location.href = location.href;
                }
            }
            /**
             * 绑定保存事件
             */
            bindSavaClick() {
                let sava = document.getElementById(Configs.MENU_SAVA_ID);
                sava.onclick = event => {
                    let e = event || window.event;
                    //页面布局选项
                    let radios = document.getElementsByName(this.CUSTOM_LAYOUT_TAG_NAME);
                    for (let i = 0, radio; (radio = radios[i++]);) {
                        if (!!radio.checked) {
                            let name = super.getPageLayoutName();
                            let value = radio.value;
                            super.setValue(name, value);
                            break;
                        }
                    }
                    //功能选项
                    let checkboxs = document.getElementsByName(this.CUSTOM_SWITCH_TAG_NAME);
                    for (let i = 0, checkbox; (checkbox = checkboxs[i++]);) {
                        let name = checkbox.value;
                        if (!!checkbox.checked) {
                            super.setValue(name, true);
                        }
                        else {
                            super.setValue(name, false);
                        }
                    }
                    e.stopPropagation();
                    location.href = location.href;
                };
            }
            bindUpdateBackgroundEvent() {
                let element = document.getElementById(this.UPDATE_BACKGROUND_ID_NAME);
                element.onclick = () => {
                    this.updateBgURL();
                };
            }
            /**
             * 插入节点
             */
            insertMenuItemsElement() {
                let container = document.getElementById("u"), content = this.getContent(), div = document.createElement("div");
                div.id = this.getMenuItemsIdName();
                div.style.display = "none";
                div.innerHTML = `<div>${content}</div>`;
                container.insertBefore(div, container.firstChild);
            }
            isExistMenuItemsElement() {
                return !!document.getElementById(this.getMenuItemsIdName());
            }
            /**
             * 初始化
             */
            init() {
                if (!this.isExistMenuItemsElement()) {
                    this.insertMenuItemsElement();
                    //异步执行绑定事件
                    Baidu.delayRun(() => {
                        this.bindSavaClick();
                        this.bindUpdateBackgroundEvent();
                    }, 10);
                }
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    try {
                        this.init();
                    }
                    catch (e) {
                        throw new Error(e);
                    }
                };
            }
        }
        /**
         * 菜单按钮
         * @class CustomButton
         *
         */
        class CustomMenuButton extends Base {
            constructor() {
                super();
                this.MenuItemsOptions = new MenuItemsOptions();
            }
            /**
             * 第二次单击隐藏
             */
            bindClickHide() {
                document.onclick = event => {
                    let e = event || window.event;
                    let container = document.getElementById("container");
                    let items = document.getElementById(Configs.MENU_ITEMS_ID);
                    let isScreenClick = e.target
                        ? e.target == container
                        : e.srcElement == container;
                    if (isScreenClick) {
                        items.style.display = "none";
                    }
                };
            }
            /**
             * 单击打开功能选项页
             */
            bindClick() {
                let container = document.getElementById(Configs.CUSTOM_BUTTON_ID);
                container.onclick = event => {
                    let e = event || window.event;
                    let items = document.getElementById(Configs.MENU_ITEMS_ID);
                    let style = items.style;
                    let isShow = style.display === "block";
                    if (isShow) {
                        style.display = "none";
                    }
                    else {
                        style.display = "block";
                    }
                    //阻止冒泡
                    e.stopPropagation();
                };
            }
            /**
             * 获取自定义按钮的名称
             */
            getCustomButtonIdName() {
                return super.getCustomButtonIdName();
            }
            /**
             * 插入节点
             */
            insertCustomButtonElement() {
                let container = document.getElementById("u");
                let div = document.createElement("a");
                div.id = this.getCustomButtonIdName();
                div.innerHTML = "自定义";
                container.insertBefore(div, container.firstChild);
            }
            /**
             * 是否存在自定义按钮
             */
            isExistCustomButtonElement() {
                return !!document.getElementById(this.getCustomButtonIdName());
            }
            /**
             * 初始化
             */
            init() {
                if (!this.isExistCustomButtonElement()) {
                    this.insertCustomButtonElement();
                    //异步绑定事件
                    Baidu.delayRun(() => {
                        this.bindClick();
                        this.bindClickHide();
                    }, 10);
                }
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    this.init();
                };
                //执行菜单功能面板
                Promise.resolve().then(() => {
                    this.MenuItemsOptions.execute();
                });
            }
        }
        /**
         * 多页布局
         * @class MUlPageLayout
         */
        class MulPageLayout extends Base {
            constructor() {
                super();
                this.container = null;
                this.lists = null;
                //多列布局值集合
                this.layoutTypes = [3, 4];
                //当前布局类型
                this.layoutType = super.getCurrentPageLayoutType();
                //根据 类名 模拟高度
                this.VIRTUAL_HEIGHTS_BY_CLASSNAE = [
                    { name: ".c-container>.op-b2b-straight", value: 420 },
                    { name: ".c-container>.c-offset", value: 320 },
                    { name: ".c-container>.c-border", value: 270 },
                    {
                        name: ".c-container>.op-tieba-general-lookmore",
                        value: 260
                    },
                    {
                        name: ".c-container>.op-img-address-desktop-cont",
                        value: 210
                    },
                    { name: ".c-container>.c-gap-top-small", value: 130 }
                ];
                //根据 srcid 属性值 模拟高度
                this.VIRTUAL_HEIGHTS_BY_SRCID = [
                    { name: 1599, value: 128 },
                    { name: 1508, value: 170 },
                    { name: 1527, value: 170 },
                    { name: 1528, value: 220 },
                    { name: 1529, value: 220 },
                    { name: 1537, value: 510 },
                    { name: 1539, value: 280 },
                    { name: 1545, value: 230 },
                    { name: 1547, value: 230 },
                    { name: 4515, value: 540 },
                    { name: 5103, value: 400 },
                    { name: 8041, value: 260 },
                    { name: 8191, value: 200 },
                    { name: 10, value: 260 },
                    { name: 13, value: 220 },
                    { name: 19, value: 200 }
                ];
            }
            /**
             * 是否为多列布局
             * @return {boolean}
             */
            isMulLayout() {
                let layoutType = this.layoutType;
                let layoutTypes = this.layoutTypes;
                return layoutTypes.includes(layoutType);
            }
            /**
             * 初始化
             */
            resetDOM() {
                this.container = null;
                this.lists = null;
            }
            /**
             * 获取 #content_left 节点
             */
            getDomForContainer() {
                if (!this.container) {
                    this.container = document.getElementById("content_left");
                }
                return this.container;
            }
            /**
             * 获取 list 节点
             */
            getDomForLists() {
                if (!this.lists) {
                    let container = this.getDomForContainer();
                    this.lists = container.getElementsByClassName("list");
                }
                return this.lists;
            }
            //获取list高度合集
            getListsHeight() {
                let lists = this.getDomForLists();
                let heights = [];
                for (let i = 0, list; (list = lists[i++]);) {
                    heights.push(list.clientHeight);
                }
                return heights;
            }
            /**
             * 模拟高度
             * 防止获取真实高度导致性能问题
             * @param item
             */
            getItemVirtualHeight(item) {
                // 获取虚拟高度合集
                let VIRTUAL_DATAS = this.VIRTUAL_HEIGHTS_BY_SRCID;
                //默认高度
                let height = 122;
                //匹配 srcid 正则
                let reg = /srcid="\d+"/;
                //获取srcid
                let srcid = Number(/\d+/.exec(reg.exec(item.outerHTML)));
                //根据srcid值获取虚拟高度
                for (let i = 0, data; (data = VIRTUAL_DATAS[i++]);) {
                    //大于 10000 直接赋予新高度
                    if (srcid > 10000) {
                        height = 310;
                        break;
                    }
                    else if (srcid === data["name"]) {
                        height = data["value"];
                        break;
                    }
                }
                return height;
            }
            /**
             * 01 - 添加内容到lists
             * 使用 DOM 到 DOM, 即将 #content_left 下的子元素移动到 lists
             * 注意：需要提前将 DOM片段 添加到 #content_left下
             */
            addWebUseDomToDom() {
                let container = this.getDomForContainer();
                let lists = this.getDomForLists();
                let items = container.querySelectorAll("#content_left>.c-container");
                let heights = this.getListsHeight();
                let frames = [];
                //初始化
                for (let i = 0, length = lists.length; i < length; i++) {
                    //缓存
                    frames.push(document.createDocumentFragment());
                }
                //将 item 添加到虚拟DOM中
                for (let i = 0, item; (item = items[i++]);) {
                    //获取最小的高度值
                    let minHeight = Reflect.apply(Math.min, null, heights);
                    //获取最小的高度的索引值
                    let index = heights.indexOf(minHeight);
                    //添加到高度
                    heights[index] += item.clientHeight;
                    //缓存
                    frames[index].appendChild(item);
                }
                //添加到真实DOM
                for (let i = 0, length = lists.length; i < length; i++) {
                    Baidu.delayRun(() => {
                        lists[i].appendChild(frames[i]);
                    }, i);
                }
            }
            /**
             * 02 - 添加内容到lists
             *
             *
             * @param frame DOM片段
             */
            addWebUseFrameToDom(frame) {
                //获取lists
                let lists = this.getDomForLists();
                //获取列表合集
                let items = frame.getElementsByClassName("c-container");
                //获取初始化高度集合
                let heights = this.getListsHeight();
                //将 item 添加到list中
                for (let i = 0, item; (item = items[i]);) {
                    //获取高度合集
                    //获取最小的高度值
                    let minHeight = Reflect.apply(Math.min, null, heights);
                    //获取最小的高度的索引值
                    let index = heights.indexOf(minHeight);
                    //添加到list中
                    lists[index].appendChild(item);
                    //更新高度
                    heights = this.getListsHeight();
                }
            }
            /**
             * 03 - 添加内容到 lists
             * 使用"模拟高度"进行添加
             *
             * @param frame DOM片段
             */
            addWebUseVirtualToDom(frame) {
                let lists = this.getDomForLists();
                let frames = [];
                //获取列表合集
                let items = frame.getElementsByClassName("c-container");
                if (items.length <= 0) {
                    return;
                }
                //获取初始化高度集合
                let heights = this.getListsHeight();
                //初始化
                for (let i = 0, length = lists.length; i < length; i++) {
                    frames[i] = document.createDocumentFragment();
                }
                //将 item 添加到list中
                for (let i = 0, item; (item = items[i]);) {
                    //获取最小的高度值
                    let minHeight = Reflect.apply(Math.min, null, heights);
                    //获取最小的高度的索引值
                    let index = heights.indexOf(minHeight);
                    //获取模拟高度
                    heights[index] += this.getItemVirtualHeight(item);
                    //添加到list中
                    frames[index].appendChild(item);
                }
                Baidu.delayRun(() => {
                    //插入内容到list
                    for (let i = 0, length = lists.length; i < length; i++) {
                        lists[i].appendChild(frames[i]);
                    }
                }, 1);
            }
            /**
             * 是否存在list节点
             */
            hasListNode() {
                let lists = this.getDomForLists();
                return lists.length > 0;
            }
            /**
             * 向网页添加列表
             */
            insertListNode() {
                let layoutType = this.layoutType;
                let container = this.getDomForContainer();
                let frame = document.createDocumentFragment();
                //创建list节点
                for (let i = 1, div, length = layoutType; i < length; i++) {
                    div = document.createElement("div");
                    div.id = "list" + i;
                    div.className = "list";
                    frame.appendChild(div);
                }
                //将节点插入到文档中
                container.insertBefore(frame, container.firstChild);
                return this;
            }
            /**
             * 添加内容到 lists
             */
            addListContent(frame) {
                this.resetDOM();
                Baidu.delayRun(() => {
                    this.addWebUseVirtualToDom(frame);
                }, 0);
            }
            /**
             * 初始化
             */
            init() {
                try {
                    this.resetDOM();
                    if (!this.hasListNode()) {
                        //插入list节点并刷新节点
                        this.insertListNode();
                    }
                    this.addWebUseDomToDom();
                }
                catch (error) {
                    console.error(error);
                }
            }
            /**
             * 执行
             */
            execute() {
                if (this.isMulLayout()) {
                    Baidu.ready = () => {
                        this.init();
                    };
                }
            }
        }
        /**
         * 自动加载下一页
         * @class AutoLoadNextPage
         */
        class UseAutoLoadNextPage extends Base {
            /**
             * 构造函数
             */
            constructor() {
                super();
                //实例化 - 多页布局
                this.MulpageLayout = new MulPageLayout();
                //实例化 - 重定向
                this.Redirect = new Redirect();
                //实例化 -
                this.Parser = new DOMParser();
            }
            /**
             * 重置
             */
            reset() {
                //是否第一次执行
                this.isFirstRun = true;
                //是否导入过
                (this.isImport = false),
                    //下一页真实地址
                    (this.realNextURL = null);
                //模板地址
                this.templateURL = null;
                //步进值(默认值)
                this.step = 0;
                //每页起始值
                this.count = 0;
                //偏移高度
                this.offsetHight = 1000;
                //缓存
                this.cache = [];
                //缓存量
                this.cacheSize = 1;
                //节点缓存
                this.container = document.getElementById("content_left");
            }
            /**
             * 获取真实下一个的地址
             * @returns {string} 下一页地址
             */
            getNextPageRealURL() {
                if (!this.realNextURL) {
                    let page = document.getElementById("page");
                    this.realNextURL = page
                        .getElementsByClassName("n")[0]
                        .getAttribute("href");
                }
                return this.realNextURL;
            }
            /**
             * 获取步进值
             * @returns {number} 步进值
             */
            getNextPageStepValue() {
                if (!this.step) {
                    //提取 &pn=20 中的20
                    let regParam = /(&pn=\d+)/;
                    let regValue = /\d+/;
                    let result = regParam.exec(this.getNextPageRealURL());
                    this.step = Number(regValue.exec(result));
                }
                return this.step;
            }
            /**
             * 获取模板地址
             * @returns {string} this.templateURL: 模板地址
             */
            getTempletURL() {
                this.templateURL =
                    this.templateURL ||
                        this.getNextPageRealURL().replace(/&pn=\d+/, "");
                return this.templateURL;
            }
            /**
             * 获取下一页合成地址
             * @returns {sting} 下一页的地址
             */
            getNextPageComposeURL() {
                this.count += this.getNextPageStepValue();
                return this.getTempletURL() + `&pn=${this.count}`;
            }
            /**
             * 判断是否存在缓存
             * @returns {boolean} 存在: true
             * @returns {boolean} 不存在：false
             */
            hasCache() {
                return this.cache.length >= this.cacheSize;
            }
            /**
             * 将响应文本添加到缓存中
             * @param responseText 响应文本
             */
            addCache(responseText) {
                //转化为DOM对象
                let reg = /<body[\s\S.]+<\/body>/;
                let parser = this.Parser;
                let htmlDoc = parser.parseFromString(reg.exec(responseText)[0], "text/html");
                //获取Items
                let items = htmlDoc
                    .getElementById("content_left")
                    .getElementsByClassName("c-container");
                //添加到缓存
                let frame = document.createElement("div");
                //appendchild 自动执行迭代器 导致 i++ (小心);
                for (let i = 0, item; (item = items[i]);) {
                    frame.appendChild(item);
                }
                //加入缓存
                this.cache.push(frame);
            }
            /**
             * 监测滚动位置
             */
            checkScrollPosition() {
                let element = document.documentElement, clientHeight = element.clientHeight, scrollTop = element.scrollTop ||
                    window.pageYOffset ||
                    document.body.scrollTop ||
                    0, scrollHeight = Number(element.scrollHeight);
                //判断
                if (clientHeight + scrollTop + this.offsetHight >
                    scrollHeight) {
                    this.removeScrollEvent();
                    this.task();
                }
            }
            /**
             * 移除滚动事件
             */
            removeScrollEvent() {
                document.onscroll = event => {
                    let e = event || window.event;
                    e.preventDefault();
                };
                return this;
            }
            /**
             * 绑定滚动触发事件
             */
            bindScrollEvent() {
                document.onscroll = () => {
                    this.checkScrollPosition();
                };
            }
            /**
             * 将 DOM 插入到相应的位置
             */
            addItemsToWeb() {
                //插入内容到DOM节点
                if (this.MulpageLayout.isMulLayout()) {
                    this.MulpageLayout.addListContent(this.cache.shift());
                }
                else {
                    //this.container.innerHTML += this.cache.shift().innerHTML;
                    let div = document.createElement("div");
                    div.id = String("Baidu-" + String(new Date().getTime()));
                    div.innerHTML = this.cache.shift().outerHTML;
                    this.container.appendChild(div);
                }
            }
            /**n
             * 发送请求
             */
            requireNextPageContent() {
                super.xmlhttpRequest({
                    method: "GET",
                    url: this.getNextPageComposeURL(),
                    timeout: 3000,
                    responseType: "text",
                    onload: response => {
                        if (response.status === 200 ||
                            response.status === 304) {
                            //如果不存在缓存，再发一次
                            if (!this.hasCache()) {
                                this.requireNextPageContent();
                            }
                            //添加响应文本到缓存
                            this.addCache(response.responseText);
                            //开始导入数据到网页
                            if (!this.isImport) {
                                this.import();
                            }
                        }
                    },
                    onerror: response => {
                        console.error(response);
                    }
                });
            }
            /**
             * 导入数据到网页
             */
            import() {
                this.isImport = true;
                //添加内容到网页
                this.addItemsToWeb();
                //重定向
                this.Redirect.execute();
                //绑定滚动事件
                Baidu.delayRun(() => {
                    this.removeScrollEvent().bindScrollEvent();
                }, 3);
            }
            /**
             * 任务调度
             * @param URL
             */
            task() {
                //设置有导入过
                this.isImport = false;
                //发送请求
                this.requireNextPageContent(); //如果有缓存
                //如果存在缓存
                if (this.hasCache()) {
                    this.import();
                }
            }
            /**
             * 隐藏元素
             */
            hideElement() {
                let rs = document.getElementById("rs");
                let page = document.getElementById("page");
                rs.style.visibility = "hidden";
                page.style.visibility = "hidden";
            }
            /**
             * 初始化
             */
            init() {
                //重置配置
                this.reset();
                //开始加载
                this.task();
                //隐藏元素
                Baidu.delayRun(() => {
                    this.hideElement();
                }, 3);
            }
            /**
             * 入口
             * @returns {void}
             */
            execute() {
                if (super.isUseAuoLoadNextPage()) {
                    Baidu.ready = () => {
                        this.init();
                    };
                }
            }
        }
        /**
         * 重定向
         * @class Redirect
         */
        class Redirect extends Base {
            constructor() {
                super();
                //重定向后需添加类名(防止重复重定向)
                this.REDIRECT_CLASS_NAME = "isredirect";
            }
            /**
             * 重定向
             * @param item a节点
             */
            redirect(item) {
                super.xmlhttpRequest({
                    method: "HEAD",
                    url: item.href,
                    onload: response => {
                        let realURL = response.finalUrl;
                        item.href = realURL;
                        //加入重定向标志
                        item.className = this.REDIRECT_CLASS_NAME;
                        //移除不必要的属性
                        item.removeAttribute("data-click");
                    }
                });
            }
            /**
             * 获取未重定向链接
             */
            getItems() {
                return document.getElementById("content_left").querySelectorAll("h3>a:not([class])");
                ;
            }
            /**
             * 开始
             */
            start() {
                let items = this.getItems();
                for (let i = 0, item; (item = items[i++]);) {
                    //延时执行
                    Baidu.delayRun(() => {
                        this.redirect(item);
                    }, i);
                }
            }
            /**
             * 初始化
             */
            init() {
                Baidu.delayRun(() => {
                    this.start();
                }, 5);
            }
            /**
             * 执行
             */
            execute() {
                if (super.isUseRedirect()) {
                    Baidu.ready = () => {
                        this.init();
                    };
                }
            }
        }
        /**
         * 回到顶部
         * @class BackToTop
         */
        class BackToTop {
            /**
             * 单击回到顶部
             */
            bindClickEvent() {
                let container = document.getElementsByClassName("s_form")[0];
                container.onclick = event => {
                    let e = event || window.event;
                    let isContainer = e.target
                        ? e.target === container
                        : e.srcElement === container;
                    if (isContainer) {
                        //setInterval方案
                        let element = document.documentElement;
                        let body = document.body;
                        let node = element.scrollTop ? element : body;
                        let top = node.scrollTop;
                        let step = top / 20;
                        let timer = setInterval(() => {
                            if (node.scrollTop <= 0) {
                                node.scrollTop = 0;
                                clearInterval(timer);
                            }
                            node.scrollTop -= step;
                        }, 10);
                        e.stopPropagation();
                    }
                };
            }
            /**
             * 初始化
             */
            init() {
                this.bindClickEvent();
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    this.init();
                };
            }
        }
        /**
         * 谷歌
         * 双击使用 google 搜索
         * @class Google
         */
        class Google {
            constructor() {
                this.GOOGLE_SEARCH_PATH = "https://www.google.com/search?q=";
            }
            getInputContent() {
                return document.getElementById("kw").value.trim();
            }
            googleSearch() {
                let url = this.GOOGLE_SEARCH_PATH +
                    encodeURIComponent(this.getInputContent());
                window.open(url);
            }
            /**
             * 绑定双击打开Google搜索
             */
            bindDoubleClickEvent() {
                let button = document.getElementById("su");
                button.ondblclick = () => {
                    this.googleSearch();
                };
            }
            /**
             * 初始化
             */
            init() {
                this.bindDoubleClickEvent();
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    this.init();
                };
            }
        }
        /**
         * 替换首页搜索栏
         * @class ReplaceSearch
         */
        class ReplaceSearch extends Base {
            constructor() {
                super();
                this.NEW_BAIDU_SEARCH_ID_NAME = "baiduinput";
                this.ASSOCIATION_ID_NAME = "badiduassociation";
                this.PANEL_ITEM_SELECED_CLASS = "baiduselected";
                this.SEARCH_DATA_NAME = "data-content";
                this.count = 0;
                this.BAIDU_SEARCH_PATH = "https://www.baidu.com/s?ie=UTF-8&wd=";
                this.BAIDU_ASSOCIATION_SEARCH_PATH = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=";
            }
            /**
             * 获取新搜索的内容
             */
            getNewSearchInputContent() {
                return document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME).value.trim() || "";
            }
            /**
             * 搜索
             */
            search() {
                let inputContent = this.getNewSearchInputContent();
                if (inputContent !== "") {
                    if (!super.isUseHideBaiJiaHao()) {
                        location.href =
                            this.BAIDU_SEARCH_PATH +
                                encodeURIComponent(inputContent);
                    }
                    else {
                        location.href =
                            this.BAIDU_SEARCH_PATH +
                                encodeURIComponent(inputContent) +
                                " -baijiahao";
                    }
                }
            }
            /**
             * 是否显示面板
             * @param isShow 是否显示面板
             */
            isshowPannel(isShow = true) {
                let panel = document.getElementById(this.ASSOCIATION_ID_NAME);
                if (isShow) {
                    panel.style.display = "none";
                }
                else {
                    panel.style.display = "block";
                }
            }
            /**
             * 插入节点
             * 覆盖原来的搜索框
             */
            coverBaiduInputElement() {
                //屏蔽原来文本输入
                let oldInput = document.getElementById("kw");
                oldInput.setAttribute("disabled", "disabled");
                let container = document.getElementById("s_kw_wrap") ||
                    document.getElementsByClassName("s_ipt_wr")[0];
                let div = document.createElement("input");
                div.id = this.NEW_BAIDU_SEARCH_ID_NAME;
                div.type = "text";
                div.autofocus = true;
                div.autocomplete = "off";
                div.setAttribute("list", this.ASSOCIATION_ID_NAME);
                container.appendChild(div);
                //延时聚焦
                Promise.resolve().then(() => {
                    document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME).focus();
                });
            }
            /**
             * 绑定覆盖百度输入框事件
             */
            bindCoverBaiduInputEvent() {
                /**
                * 绑定提交事件
                */
                let bindSubmit = () => {
                    let button = document.getElementById("su");
                    button.setAttribute("type", "button");
                    button.onclick = event => {
                        let e = event || window.event;
                        this.search();
                    };
                };
                bindSubmit();
                /**
                 * 检测输入
                 */
                let bindKeydown = () => {
                    let input = document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME);
                    input = document.getElementById("form");
                    input.onkeydown = event => {
                        let e = event || window.event;
                        let keyCode = e.keyCode || e.which || e.charCode;
                        if (keyCode === 13) {
                            this.search();
                        }
                    };
                };
                bindKeydown();
            }
            /**
            * 插入联想搜索面板
            */
            inserAssociationPanel() {
                let datalist = document.createElement("ul");
                let input = document.getElementById("form");
                datalist.id = this.ASSOCIATION_ID_NAME;
                input.appendChild(datalist);
            }
            /**
             * 开始联想搜索
             */
            startAssociationSearch() {
                let input = document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME);
                input.oninput = () => {
                    let inputContent = input.value.trim();
                    let inputContentURL = this.BAIDU_ASSOCIATION_SEARCH_PATH + inputContent;
                    let datalist = document.getElementById(this.ASSOCIATION_ID_NAME);
                    //如果数据为空,则退出
                    if (inputContent.length < 1) {
                        datalist.innerHTML = "";
                        return;
                    }
                    //与服务交换数据
                    super.xmlhttpRequest({
                        method: "GET",
                        url: inputContentURL,
                        timeout: 3000,
                        responseType: "text",
                        onload: response => {
                            if (response.status === 200 ||
                                response.status === 304) {
                                let searchData = response.responseText;
                                let reg = /\[.*\]/g;
                                let content = reg.exec(searchData)[0];
                                //删除首尾字符 "[]"
                                let datas = content.substr(1).substr(0, content.length - 2).split(",");
                                //加载联想数据
                                this.LoadAssociationSearchDatas(datas);
                            }
                        },
                        onerror: response => {
                            console.error(response);
                        }
                    });
                };
            }
            /**
             * 加载联想数据到面板中
             * @param datas 联想数据
             */
            LoadAssociationSearchDatas(datas) {
                let datalist = document.getElementById(this.ASSOCIATION_ID_NAME);
                let inputValue = document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME).value.trim();
                let frame = document.createDocumentFragment();
                for (let data, i = 0; data = datas[i++];) {
                    let option = document.createElement("li");
                    //去除双引号
                    data = data.replace("\"", "").replace("\"", "");
                    //赋值
                    option.setAttribute(this.SEARCH_DATA_NAME, data);
                    option.innerHTML = data.concat("</b>").replace(inputValue, inputValue + "<b>");
                    frame.appendChild(option);
                }
                datalist.innerHTML = "";
                datalist.appendChild(frame);
                this.count = 0;
            }
            /**
             * 绑定联想事件
             */
            bindAssociationEvent() {
                let input = document.getElementById(this.NEW_BAIDU_SEARCH_ID_NAME);
                let panel = document.getElementById(this.ASSOCIATION_ID_NAME);
                panel.onclick = (event) => {
                    let e = event || window.event;
                    let target = e.target || e.srcElement;
                    if (target.nodeName.toUpperCase() == "LI") {
                        input.value = target.getAttribute(this.SEARCH_DATA_NAME);
                        this.search();
                        return;
                    }
                    if (target.nodeName.toUpperCase() == "B") {
                        input.value = target.parentNode.getAttribute(this.SEARCH_DATA_NAME);
                        this.search();
                        return;
                    }
                };
                document.onkeydown = (event) => {
                    let e = event || window.event;
                    let keyCode = e.keyCode || e.which || e.charCode;
                    //方向键下
                    if (keyCode == 40) {
                        let lis = panel.getElementsByTagName("li");
                        let length = lis.length;
                        if (this.count >= length) {
                            this.count = 0;
                        }
                        for (let i = 0, li; li = lis[i++];) {
                            li.removeAttribute("class");
                        }
                        lis[this.count].classList.add(this.PANEL_ITEM_SELECED_CLASS);
                        input.value = lis[this.count].getAttribute(this.SEARCH_DATA_NAME);
                        this.count++;
                        return false;
                    }
                    //方向键上
                    if (keyCode == 38) {
                        let lis = panel.getElementsByTagName("li");
                        let length = lis.length;
                        if (--this.count < 0) {
                            this.count = length - 1;
                        }
                        for (let i = 0, li; li = lis[i++];) {
                            li.removeAttribute("class");
                        }
                        lis[this.count].classList.add(this.PANEL_ITEM_SELECED_CLASS);
                        input.value = lis[this.count].getAttribute(this.SEARCH_DATA_NAME);
                        return false;
                    }
                };
                /**
                 * 禁止 input 上方向键功能
                 */
                input.onkeydown = (event) => {
                    let e = event || window.event;
                    let keyCode = e.keyCode || e.which || e.charCode;
                    if (keyCode == 38) {
                        e.preventDefault();
                        return false;
                    }
                };
                /**
                 * 鼠标滑过，移除类名
                 */
                panel.onmouseover = (event) => {
                    let e = event || window.event;
                    let target = e.target || e.srcElement;
                    let lis = panel.getElementsByTagName("li");
                    //移除类名
                    for (let i = 0, li; li = lis[i++];) {
                        if (li == target) {
                            this.count = i - 1;
                        }
                        li.removeAttribute("class");
                    }
                    //li标签触发
                    if (target.nodeName.toUpperCase() == "LI") {
                        target.classList.add(this.PANEL_ITEM_SELECED_CLASS);
                        return;
                    }
                    //b标签触发
                    if (target.nodeName.toUpperCase() == "B") {
                        target.parentNode.classList.add(this.PANEL_ITEM_SELECED_CLASS);
                        return;
                    }
                };
                //点击触发
                panel.onclick = (event) => {
                    let e = event || window.event;
                    let target = e.target || e.srcElement;
                    //li标签触发
                    if (target.nodeName.toUpperCase() == "LI") {
                        input.value = target.getAttribute(this.SEARCH_DATA_NAME);
                        this.search();
                        return;
                    }
                    //b标签触发
                    if (target.nodeName.toUpperCase() == "B") {
                        input.value = target.parentNode.getAttribute(this.SEARCH_DATA_NAME);
                        this.search();
                        return;
                    }
                };
            }
            /**
             * 初始化 input替换
             */
            initCoverBaiduInputElement() {
                this.coverBaiduInputElement();
                Promise.resolve().then(() => {
                    this.bindCoverBaiduInputEvent();
                });
            }
            /**
             * 初始化联想搜索
             */
            initAssociationSearch() {
                this.inserAssociationPanel();
                Promise.resolve().then(() => {
                    this.startAssociationSearch();
                    this.bindAssociationEvent();
                });
            }
            /**
             * 初始化
             */
            init() {
                try {
                    this.initCoverBaiduInputElement();
                    Promise.resolve().then(() => {
                        this.initAssociationSearch();
                    });
                }
                catch (e) {
                    throw new Error(e);
                }
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    this.init();
                };
            }
        }
        /**
         * 快捷键
         * @class ShortcutKeys
         */
        class ShortcutKeys {
            constructor() {
                this.Google = new Google();
                this.filters = Configs.FILTERS;
                this.target = null;
                this.KEY_ENTER = 13;
                this.KEY_ALT = 18;
                this.KEY_SHIFT = 16;
                this.KEY_CTRL = 17;
                this.KEY_GOOGLE = "G";
            }
            /**
             * 过滤搜索
             */
            filterSearch(filterName) {
                //移除如 "-baijiahao" 正则
                let reg1 = /\s\-\S+/;
                //移除如 "site:baidu" 正则
                let reg2 = /\ssite\:\S+/;
                let URL = "https://www.baidu.com/s?ie=utf-8&wd=";
                let content = document.getElementById("kw").value.trim();
                content = content.replace(reg1, "").trim();
                content = content.replace(reg2, "").trim();
                location.href =
                    URL + encodeURIComponent(content) + " " + filterName;
            }
            /**
             * 选择全部
             */
            selectAllContent() {
                let input = document.getElementById("kw");
                input.focus();
                input.selectionStart = 0;
                input.selectionEnd = input.value.length;
            }
            /**
             * 绑定快捷键
             */
            bindKeys() {
                let defaultTarget = this.target;
                document.onkeyup = event => {
                    let e = event || window.event;
                    if (e.target === defaultTarget || e.target === document) {
                        let keyCode = e.keyCode || e.which || e.charCode;
                        //Ctrl + Enter 全选中
                        if (keyCode == this.KEY_ENTER && e.ctrlKey) {
                            this.selectAllContent();
                            return;
                        }
                        //谷歌搜索
                        if (keyCode ===
                            this.KEY_GOOGLE.toUpperCase().charCodeAt() &&
                            !e.altKey &&
                            !e.shiftKey &&
                            !e.ctrlKey &&
                            !e.metaKey) {
                            this.Google.googleSearch();
                            return;
                        }
                        //过滤搜索
                        for (let { name, value } of this.filters) {
                            if (keyCode === name.toUpperCase().charCodeAt() &&
                                !e.altKey &&
                                !e.shiftKey &&
                                !e.ctrlKey &&
                                !e.metaKey) {
                                this.filterSearch(value);
                                return;
                            }
                        }
                    }
                    e.stopPropagation();
                };
            }
            /**
             * 重置
             */
            reset() {
                this.target = document.getElementsByTagName("body")[0] || null;
            }
            /**
             * 初始化
             */
            init() {
                try {
                    this.reset();
                    this.bindKeys();
                }
                catch (error) { }
            }
            /**
             * 执行
             */
            execute() {
                Baidu.ready = () => {
                    this.init();
                };
            }
        }
        /**
         * Base地址重置
         */
        class BaseURL {
            run() {
                location.href = location.href.replace("https://www.baidu.com/#", "https://www.baidu.com/s?");
            }
        }
        /**
         *  首页
         */
        class PageIndex {
            run() {
                //组合模式
                let command = new Commond();
                command.add(new ImportIndexStyle());
                command.add(new ReplaceSearch());
                command.execute();
            }
        }
        /**
         *  搜索结果页
         */
        class PageCommon {
            run() {
                /**
                 * 01 - 初始化执行
                 */
                let command = new Commond();
                command.add(new ImportCommonStyle());
                command.add(new HideBaijiahao());
                command.add(new CustomMenuButton());
                command.add(new MulPageLayout());
                command.add(new UseAutoLoadNextPage());
                command.add(new Redirect());
                command.add(new BackToTop());
                command.add(new Google());
                command.add(new ShortcutKeys());
                command.execute();
                /**
                 * 02 - 设置标志位
                 * 防止后期多次无用执行
                 */
                let avoidMulExecute = new AvoidMulExecute();
                //设置标志位
                Baidu.ready = () => {
                    avoidMulExecute.setSign();
                };
                /**
                 * 03 - 监测 DOM
                 */
                //调用函数
                let mutationfunc = () => {
                    //只执行一次
                    if (!avoidMulExecute.hasSign()) {
                        //设置标志位
                        avoidMulExecute.setSign();
                        //执行
                        command.execute();
                    }
                };
                //加载完成后 - 根据 DOM 变化重新执行函数( 防止Bash值改变时不触发脚本)
                window.onload = () => {
                    let MutationObserver = window.MutationObserver ||
                        window.WebKitMutationObserver ||
                        window.MozMutationObserver;
                    if (!!MutationObserver) {
                        let observer = new MutationObserver(mutationfunc);
                        let wrapper = document.querySelector("#wrapper");
                        let observerConfig = {
                            childList: true,
                            subtree: true
                            //"attributes": true,
                            //"characterData":true,
                            //"attributesFilter": ["class"],
                        };
                        //开始观察
                        observer.observe(wrapper, observerConfig);
                    }
                    else {
                        console.error("百度搜索-优化: 浏览器不兼容 MutationObserver 接口, 请升级浏览器版本");
                    }
                };
            }
        }
        /**
         * 简单工厂
         */
        class Factory {
            /**
             *
             * @param url
             */
            static create(url) {
                //BASE地址(BASE地址会导致样式跳转，需要重定向)
                const URL_BASE = "https://www.baidu.com/#";
                //普通页 01
                const URL_COMMON_01 = "https://www.baidu.com/s";
                //普通页 02
                const URL_COMMON_02 = "https://www.baidu.com/baidu";
                //首页
                const URL_INDEX = "https://www.baidu.com";
                //返回BASE
                if (url.startsWith(URL_BASE)) {
                    return new BaseURL();
                }
                //返回结果页
                if (url.startsWith(URL_COMMON_01)) {
                    return new PageCommon();
                }
                //返回结果页
                if (url.startsWith(URL_COMMON_02)) {
                    return new PageCommon();
                }
                //返回首页
                if (url.startsWith(URL_INDEX)) {
                    return new PageIndex();
                }
            }
        }
        /**
         * 启动函数
         */
        Baidu.start = () => {
            Factory.create(location.href).run();
        };
        //返回对象
        return Baidu;
    })(BaiduConfig);
    //启动
    try {
        Baidu.start();
    }
    catch (msg) {
        if (Configs.IS_DEBUG) {
            console.error(msg);
        }
    }
})();








