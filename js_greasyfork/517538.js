// ==UserScript==
// @name        DynamicTabs_gz
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     0.2
// @author      byhgz
// @description 一个简易tabs标签页，只需创建该类的实例，按需传入配置即可在页面上创建
// @noframes
// ==/UserScript==
/**
 *
 * 一个简易Tabs标签页，只需创建该类的实例，按需传入配置即可在页面上创建
 *
 * @author byhgz
 */
class DynamicTabs_gz {
    #selector;
    #tabsConfig;
    #activeTabId;
    #options;
    #buttonContainerSelector = '[name="buttonContainer"]';
    #contentContainerSelector = '[name="contentContainer"]';

    /**
     *
     * @param selector{string} css选择器
     * @param tabsConfig {Array} 选项卡配置，参数为数组，数组每个对象为一个选项卡和对应的选项卡内容
     * @param options {Object} 其他选项，可设置自定义样式和事件处理类名
     */
    constructor(selector, tabsConfig, options = {}) {
        this.#selector = selector;       // 选项卡容器的选择器
        this.#tabsConfig = tabsConfig;   // 选项卡配置数组
        this.#activeTabId = tabsConfig[0].id; // 默认激活的第一个选项卡ID
        this.#options = options;         // 可选配置项，如自定义样式和事件处理函数

        // 初始化选项卡
        this.#init();
    }

    // 私有初始化方法
    #init() {
        // 获取选项卡容器元素
        const tabsContainer = document.querySelector(this.#selector);

        if (!tabsContainer) {
            throw new Error(`No element found matching the selector: ${this.#selector}`);
        }

        // 添加默认样式
        this.#addDefaultStyles();

        // 创建选项卡按钮
        this.#createButtons(tabsContainer);

        // 创建选项卡内容
        this.#createContents(tabsContainer);
    }

    // 私有添加默认样式的方法
    #addDefaultStyles() {
        const defaultClasses = {
            tabButton: 'dynamic-tab-button',
            tabButtonActive: 'dynamic-tab-button-active',
            tabContent: 'dynamic-tab-content',
            tabContentActive: 'dynamic-tab-content-active'
        };

        // 合并用户提供的类名
        const classes = {...defaultClasses, ...this.#options.classes};

        // 获取用户提供的样式或默认样式
        const backgroundColor = this.#options.backgroundColor || '#ccc';
        const borderColor = this.#options.borderColor || '#ccc';
        const textColor = this.#options.textColor || 'black';
        const fontWeight = this.#options.fontWeight || 'normal';
        const activeBackgroundColor = this.#options.activeBackgroundColor || '#007BFF';
        const activeTextColor = this.#options.activeTextColor || 'white';
        const contentBorderColor = this.#options.contentBorderColor || '#ccc';
        const contentBackgroundColor = this.#options.contentBackgroundColor || '#f9f9f9';

        const defaultStyle = `
                           ${this.#selector}>${this.#buttonContainerSelector}>.${classes.tabButton} {
                                padding: 10px 20px;
                                margin: 5px;
                                cursor: pointer;
                                border: 1px solid ${borderColor};
                                background-color: ${backgroundColor};
                                color: ${textColor};
                                font-weight: ${fontWeight};
                            }
                            ${this.#selector}>${this.#buttonContainerSelector}>.${classes.tabButton}.${classes.tabButtonActive} {
                                background-color: ${activeBackgroundColor};
                                color: ${activeTextColor};
                            }
                            ${this.#selector}>${this.#contentContainerSelector}>.${classes.tabContent} {
                                margin-top: 5px;
                                padding: 20px;
                                border: 1px solid ${contentBorderColor};
                                background-color: ${contentBackgroundColor};
                                display: none;
                            }
                            ${this.#selector}>${this.#contentContainerSelector}>.${classes.tabContent}.${classes.tabContentActive} {
                                display: block;
                            }
                            ${this.#selector} {
                                display: flex;
                                flex-direction: column;
                            }
                            ${this.#selector}[data-tab-position="bottom"] > ${this.#buttonContainerSelector} {
                                order: 2;
                            }
                            ${this.#selector}[data-tab-position="bottom"] > ${this.#contentContainerSelector} {
                                order: 1;
                            }
                            ${this.#selector}[data-tab-position="left"] > ${this.#buttonContainerSelector}, 
                            ${this.#selector}[data-tab-position="right"] > ${this.#buttonContainerSelector} {
                                flex-direction: column;
                                width: 20%;
                            }
                            ${this.#selector}[data-tab-position="left"] > ${this.#contentContainerSelector},
                            ${this.#selector}[data-tab-position="right"] > ${this.#contentContainerSelector} {
                                width: 80%;
                            }
                            ${this.#selector}[data-tab-position="left"] {
                                flex-direction: row;
                            }
                            ${this.#selector}[data-tab-position="right"] {
                                flex-direction: row-reverse;
                            }
                        `;

        // 如果提供了自定义样式，则覆盖默认样式
        const customStyle = this.#options.styles || '';

        const style = document.createElement('style');
        style.innerHTML = defaultStyle + customStyle;
        document.head.appendChild(style);
        this.setTabPosition(this.#options.tabPosition || 'top');
    }

    /**
     * 设置选项卡位置，可设置为 'top'、'bottom'、'left' 或 'right'
     * @param position {string}   选项卡位置
     */
    setTabPosition(position) {
        // 设置 tabPosition 属性
        const tabsContainer = document.querySelector(this.#selector);
        tabsContainer.setAttribute("data-tab-position", position);
    }


    // 私有创建选项卡按钮的方法
    #createButtons(tabsContainer) {
        const buttonContainer = document.createElement('div');
        // 添加name属性
        buttonContainer.setAttribute("name", "buttonContainer");
        const classes = this.#options.classes || {};

        this.#tabsConfig.forEach(tab => {
            const button = document.createElement('button');
            button.className = `${classes.tabButton || 'dynamic-tab-button'}`;
            button.textContent = tab.title;
            button.setAttribute("data-tab-id", tab.id);
            button.setAttribute("data-tab-title", tab.title);

            if (tab.id === this.#activeTabId) {
                button.classList.add(classes.tabButtonActive || 'dynamic-tab-button-active');
            }
            buttonContainer.appendChild(button);
        });
        tabsContainer.appendChild(buttonContainer);

        const butS = document.querySelector(`${this.#selector}>${this.#buttonContainerSelector}`);
        butS.addEventListener('click', (event) => {
            if (event.target.tagName !== "BUTTON") return;
            const dataTabId = event.target.getAttribute("data-tab-id");
            if (dataTabId === null) return;
            this.activateTabId(dataTabId);
            // 调用自定义的点击事件处理函数（如果存在）
            if (this.#options.onTabClick) {
                const {id,title,content} = this.#tabsConfig.find(tab => tab.id === dataTabId);
                this.#options.onTabClick(id,title,content);
            }
        });
    }

    // 私有创建选项卡内容的方法
    #createContents(tabsContainer) {
        const contentContainer = document.createElement('div');
        contentContainer.setAttribute("name", "contentContainer");
        const classes = this.#options.classes || {};

        for (let tab of this.#tabsConfig) {
            // 创建一个div来包装选项卡外层
            const tabDiv = document.createElement('div');
            tabDiv.className = `${classes.tabContent || 'dynamic-tab-content'}`;
            tabDiv.setAttribute("data-tab-id", tab.id);
            tabDiv.setAttribute("data-tab-title", tab.title);
            // 创建一个div来包装选项卡内容
            const tabContentDiv = document.createElement('div');
            tabContentDiv.innerHTML = tab.content;

            if (tab.id === this.#activeTabId) {
                tabDiv.classList.add(classes.tabContentActive || 'dynamic-tab-content-active');
            }
            tabDiv.appendChild(tabContentDiv);
            contentContainer.appendChild(tabDiv);
        }

        tabsContainer.appendChild(contentContainer);
    }

    /**
     * 激活指定的选项卡
     * @param toType {{type: string,value:string}} 匹配的方式和匹配的值
     */
    #activateTab(toType) {
        const classes = this.#options.classes || {};
        // 更新按钮状态
        const butCss = `${this.#selector}>${this.#buttonContainerSelector}>.${classes.tabButton || 'dynamic-tab-button'}`;
        const buttons = document.querySelectorAll(butCss);
        buttons.forEach(button => {
            let dataTabValue;
            if (toType.type === "id") {
                dataTabValue = button.getAttribute("data-tab-id");
            } else {
                dataTabValue = button.getAttribute("data-tab-title");
            }
            if (dataTabValue === toType.value) {
                button.classList.add(classes.tabButtonActive || 'dynamic-tab-button-active');
            } else {
                button.classList.remove(classes.tabButtonActive || 'dynamic-tab-button-active');
            }
        });

        // 更新内容状态
        const contentCss = `${this.#selector}>${this.#contentContainerSelector}>.${classes.tabContent || 'dynamic-tab-content'}`;
        const contents = document.querySelectorAll(contentCss);
        contents.forEach(tabDiv => {
            let dataTabValue;
            if (toType.type === "id") {
                dataTabValue = tabDiv.getAttribute("data-tab-id");
            } else {
                dataTabValue = tabDiv.getAttribute("data-tab-title");
            }
            if (dataTabValue === toType.value) {
                tabDiv.classList.add(classes.tabContentActive || 'dynamic-tab-content-active');
            } else {
                tabDiv.classList.remove(classes.tabContentActive || 'dynamic-tab-content-active');
            }
        });

        this.#activeTabId = toType.value;
    }

    /**
     * 激活指定的选项卡，通过选项卡id
     * @param tabID {string}
     */
    activateTabId(tabID) {
        this.#activateTab({type: "id", value: tabID})
    }

    /**
     * 激活指定的选项卡，通过选项卡标题
     * @param tabTitle {string}
     */
    activateTabTitle(tabTitle) {
        this.#activateTab({type: "title", value: tabTitle})
    }
}
