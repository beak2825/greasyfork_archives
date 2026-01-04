// ==UserScript==
// @name         谷歌搜索 - 优化
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  1.屏蔽推广 2.普通样式 3.单列居中 4双列居中
// @author       浮生未歇
// @run-at       document-start
// @include      https://www.google.com*/search*
// @exclude      https://www.google.com*/search*&source=lnms*
// @resource     googleCommon https://cdn.jsdelivr.net/gh/sinlin/google@1.2.1/2019-03-16/google-common.css
// @resource     googleOne https://cdn.jsdelivr.net/gh/sinlin/google@1.2.1/2019-03-16/google-one.css
// @resource     googleTwo https://cdn.jsdelivr.net/gh/sinlin/google@1.2.1/2019-03-16/google-two.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/381472/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/381472/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%20-%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(() => {
    //初始化配置
    let Configs = {
        //是否调试
        IS_DEBUG: false,
        //功能配置
        OPTIONS: [
            //页面布局：1：普通页面，2：单列居中，3：双列居中，
            { name: "SELECT_PAGE", value: 1 }
        ],
        //谷歌样式
        GOOGLE_STYLES: {
            COMMON: GM_getResourceText("googleCommon"),
            ONE: GM_getResourceText("googleOne"),
            TWO: GM_getResourceText("googleTwo"),
        }
    };

    //Google对象参数配置
    let googleParamConfig = { Configs, window, document, location };

    //Google对象
    let Google = (({ Config, window, document, location }, undefined) => {
        //创建空对象
        let Google = Object.create(null);

        //绑定 Google.ready = functon(){} 功能
        Reflect.defineProperty(Google, "ready", {
            set: fn => {
                if (document.readyState === "complete") {
                    fn();
                } else if (!!document.addEventListener) {
                    document.addEventListener(
                        "DOMContentLoaded",
                        () => {
                            fn();
                        },
                        true
                    );
                } else {
                    throw new Error("Google.ready can't use");
                }
            }
        });

        /**
         * 函数执行器 - 组合执行
         */
        class Command {
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
                for (let i = 0, command; (command = this.commondList[i++]); ) {
                    command.execute();
                }
            }
        }

        /**
         * GM
         * 用于调用 TamperMonkey 内置API
         */
        class GM {
            /**
             * 获取数据储存
             */
            getGmValue(selection) {
                return GM_getValue(selection.name, selection.value);
            }

            /**
             * 设置数据储存
             */
            SetGmValue(name, value) {
                GM_setValue(name, value);
            }

            /**
             * 使用GM导入样式
             * @param {string} styles 样式
             */
            importGmStyle(styles) {
                if (typeof styles === "string") {
                    GM_addStyle(styles);
                }
            }
        }



        /**
         * 数据类
         * 用于获取跟初始化配置相关的信息
         */
        class Data extends GM {
            constructor() {
                super();
                this.DEFAULT_PAGE_LAYOUT_TYPE = Configs.OPTIONS[0];
                this.STYLE_CONTENT_COMMON = Configs.GOOGLE_STYLES.COMMON;
                this.STYLE_CONTENT_ONE_CENTER = Configs.GOOGLE_STYLES.ONE;
                this.STYLE_CONTENT_TWO_CENTER = Configs.GOOGLE_STYLES.TWO;
            }

            getPageLayoutName () {
                return this.DEFAULT_PAGE_LAYOUT_TYPE["name"];
            }

            getCurrentPageLayoutType() {
                return Number(this.getGmValue(this.DEFAULT_PAGE_LAYOUT_TYPE)) || 1;
            }

            getCommonPageStyleContent() {
                return this.STYLE_CONTENT_COMMON || "";
            }

            getOneCenterStyleContent() {
                return this.STYLE_CONTENT_ONE_CENTER || "";
            }

            getTwoCenterStyleContent() {
                return this.STYLE_CONTENT_TWO_CENTER || "";
            }
        }

        /**
         * 基础类
         */
        class Base extends Data{
            isHideElement(element) {
                return element.style.display === "none";
            }

            hideElement(element) {
                element.style.display = "none";
            }

            showElement(element) {
                element.style.display = "block";
            }
        }



        /**
         * 样式类
         * @class Style
         */
        class Style extends Base {
            constructor() {
                super();
                this.cache = "";
            }
            /**
             * 清除缓存
             */
            clearCache() {
                this.cache = "";
            }

            /**
             * 导入样式
             */
            importStyle() {
                super.importGmStyle(this.cache);
            }

            /**
             * 将样式内容添加到缓存
             * @param {string} styleContent
             */
            add(styleContent) {
                if (typeof styleContent === "string") {
                    this.cache += styleContent;
                } else {
                    this.cache += "";
                }
                return this;
            }

            /**
             * 结束标识符
             * 开始调用导入功能
             * 清空缓存
             */
            end() {

                this.importStyle();
                this.clearCache();
            }
        }

        /**
         * 样式-普通页
         */
        class StyleByCommon extends Style {
            constructor() {
                super();
            }
            /**
             * 获取普通样式
             */
            getCommonPageStyleContent() {
                return super.getCommonPageStyleContent();
            }

            getMulPageStyleContent(){
                let currentLayoutType = this.getCurrentPageLayoutType();
                let style = "";
                switch (currentLayoutType) {
                    //普通样式
                    case 1: style = ""; break;
                    //单页居中
                    case 2: style = this.getOneCenterStyleContent(); break;
                    //双页居中
                    case 3: style = this.getTwoCenterStyleContent(); break;
                }
                return style;
            }

            init () {
                super.add(this.getCommonPageStyleContent())
                     .add(this.getMulPageStyleContent())
                     .end();
            }

            execute () {
                this.init();
            }
        }

        /**
         * 菜单
         */

        class MenuNode extends Base {
            constructor() {
                super();

                this.MENU_BTN_ID = "myGoogleMenuButton";
                this.MENU_LISTS_ID = "myGoogleLists";
                this.MENU_SAVE_NAME="myGooglesave";
            }

            /**
             * 获取父节点
             */
            getContainerNode() {
                // return document
                //     .getElementById("gb")
                //     .querySelector(".gb_Jf");
                //return document.getElementById("ab_options");
                 return document.getElementById("abar_button_opt");
            }

            getMenuSaveIdName () {
                return this.MENU_SAVE_NAME;
            }

            getPageLayoutName () {
                return super.getPageLayoutName();
            }

            /**
             * 获得 HTML - 页面布局选项
             * @param content 显示的内容
             * @param layoutType 页面布局类型
             */
             getContentPageSelect(content, layoutType) {
                let checked = super.getCurrentPageLayoutType() === layoutType ? "checked" : "";
                return `<li><input type="radio" name="${ this.getPageLayoutName()
                }" value="${ layoutType }" ${ checked }>${ content }</li>`;
            }

              /**
             * 获得 HTML - 保存
             * @param content 显示的内容
             */
             getContentSava(content) {
                let menuSaveIdName = this.getMenuSaveIdName();
                return `<input id='${menuSaveIdName}' type='button' style='margin-top:3px;display:block;width:100%' value='${content}'>`;
            }

            //获取整体 HTML
             getContent() {
                let content = "";
                content += "<ol>页面选择";
                content += this.getContentPageSelect("普通页面", 1);
                content += this.getContentPageSelect("单页居中", 2);
                content += this.getContentPageSelect("双页居中", 3);
                content += "</ol>";
                content += this.getContentSava("保存");
                return content;
            }

            /**
             * 插入按钮
             */
            insertMenuBtnNode() {
                let container = this.getContainerNode();
                let div = document.createElement("div");
                div.innerHTML = "自定义";
                div.id = this.MENU_BTN_ID;
                // container.insertBefore(div, container.parentNode.firstChild);
                // container.appendChild(div);
                container.before(div);

            }

            /**
             * 插入功能列表
             */
            insertMenuItemsNode() {
                let container = this.getContainerNode();
                let div = document.createElement("div");
                div.innerHTML = this.getContent();
                div.id = this.MENU_LISTS_ID;
                div.style.display = "none";
                // container.insertBefore(div, container.firstChild);
                container.before(div);
            }

            bindMenuBtnEvent () {
                let btn = document.getElementById(this.MENU_BTN_ID);
                let lists = document.getElementById(this.MENU_LISTS_ID);
                btn.onclick = () => {
                    if(this.isHideElement(lists)){
                        this.showElement(lists);
                    }else{
                        this.hideElement(lists);
                    }
                }
            }

            bindMenuSaveEvent () {
               let save = document.getElementById(this.MENU_SAVE_NAME);
               save.onclick = (event) => {
                   let e = event || window.event;
                   let radios = document.getElementsByName(this.getPageLayoutName());

                   for(let i = 0, raido; (raido = radios[i++]);){
                       if (!!raido.checked){
                           super.SetGmValue(this.getPageLayoutName(), raido.value);
                           break;
                       }
                   }
                  e.stopPropagation();
                  location.href = location.href;
               }
            }

            init() {
                this.insertMenuBtnNode();
                this.insertMenuItemsNode();

                Promise.resolve().then(() => {
                    this.bindMenuBtnEvent();
                    this.bindMenuSaveEvent();
                });

            }



            execute() {
                Google.ready = () => {
                    this.init();
                };
            }
        }
        /**
         * 多页布局
         * @class MulPageLayout
         */
        class MulPageLayout extends Base {
            constructor () {
                super();
                this.PageLayouts = [3];
                this.LISTS_CLASS_NAME = "googlelists";
            }


            isMulPageLayout () {
                let currentLayoutType = super.getCurrentPageLayoutType();
                return this.PageLayouts.includes(currentLayoutType);

            }

            getContainer  () {
                return document.getElementById("rso");
            }

            getLists () {
                return document.getElementsByClassName(this.LISTS_CLASS_NAME);
            }

            getSearchResults () {
               // return document.getElementById("rso").querySelectorAll(".bkWMgd>.g, .srg>.g #rso>.g");
                return document.querySelectorAll("#rso>.g");
            }

            getListsHeight(){
                let heights = [];
                let lists = this.getLists();
                for(let i = 0, list; (list = lists[i++]);){
                    heights.push(list.clientHeight || 0);
                }
                return heights;
            }

            isExistListsElement () {
                return document.getElementsByName(this.LISTS_CLASS_NAME).length > 0;
            }

            insertListsElement () {
                if(this.isExistListsElement()){
                    return;
                }
                let className = this.LISTS_CLASS_NAME;
                let container = this.getContainer();
                let frame = document.createDocumentFragment();
                for(let i = 1; i <= 2; i++){
                    let div = document.createElement("div");
                    div.className = `${className} ${className}${i}`;
                    frame.appendChild(div);
                }
               container.insertBefore(frame, container.firstChild);
            }

            moveSearchResultElement () {
                let lists = this.getLists();
                let items = this.getSearchResults()
                let heights = this.getListsHeight();

                let frames = [];
                //初始化
                for (let i = 0, length = lists.length; i < length; i++) {
                    //缓存
                    frames.push(document.createDocumentFragment());
                }

                //将 item 添加到虚拟DOM中
                for (let i = 0, item; (item = items[i++]); ) {
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
                    lists[i].appendChild(frames[i]);
                }

            }

            init () {
                 this.insertListsElement();
                 this.moveSearchResultElement();

            }

            execute () {
                if(this.isMulPageLayout()){
                    Google.ready = () => {
                        this.init();
                    }
                }
            }
        }

        /**
         * 普通页控制
         */
        class CommonPageControl {
            run() {
                let command = new Command();
                command.add(new StyleByCommon());
                command.add(new MulPageLayout());
                command.add(new MenuNode());
                command.execute();



            }
        }

        /**
         * 简单工厂模式
         */
        class Factory {
            static getConfig() {
                return [{ reg: /https/, useObject: CommonPageControl }];
            }

            static create(URL) {
                let configs = this.getConfig();
                for (let { reg, useObject } of configs) {
                    if (reg.test(URL)) {
                        return new useObject();
                    }
                }
            }
        }

        /**
         * 启动函数
         */
        Google.start = () => {
            Factory.create(location.href).run();
        };

        return Google;
    })(googleParamConfig);

    Google.start();
})();