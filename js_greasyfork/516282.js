// ==UserScript==
// @name        Drawer_gz页面侧边抽屉组件
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     0.5
// @author      byhgz
// @description 页面侧边抽屉组件
// @noframes
// ==/UserScript==

/**
 * 页面侧边抽屉组件对象
 * 需要new一个实例对象，按需传入配置对象
 * showDrawer()方法可以切换抽屉显示或隐藏
 * show()方法可以设置面板显示或隐藏
 * setTitle()方法可以设置标题
 * titleShow()方法可以设置标题是否显示
 * setBodyHtml()方法可以设置面板内容html
 * 详情自行看源码(懒得写)
 * @param config {object} 配置对象
 * @param config.show {boolean} 是否显示，默认false
 * @param config.direction {string} 方向，默认right
 * @param config.width {string} 宽度，默认500px
 * @param config.height {string} 高度，默认500px
 * @param config.backgroundColor {string} 面板背景色，默认#ffffff
 * @param config.bodyHtml {string} 面板内容html
 * @param config.title {string} 标题，默认null
 * @param config.zIndex {string|number} 层级，默认1500
 * @param config.drawerBorder {string} 边框，格式为粗细度 样式 颜色
 * @param config.titleShow {boolean} 标题显示或隐藏，默认显示
 * @param config.headerShow {boolean} 顶栏显示或隐藏，默认显示
 * @param config.headerHrShow {boolean} 顶栏中底部的横线显示隐藏，默认显示
 * @param config.externalButtonText {string} 外部开关按钮文本
 * @param config.externalButtonWidth {string} 外部开关按钮宽度，默认不填
 * @param config.externalButtonColor {string} 外部开关按钮背景色
 * @param config.externalButtonBorder {string} 外部开关按钮背景色，默认无边框,参数详情可参考css中的border属性，默认0px solid #ffffff00
 * @param config.externalButtonShow {boolean} 外部开关显示或隐藏，默认true，显示
 * @param config.externalButtonOffset {string}外部开关按钮位置偏移，建议用百分比，默认为0
 * @param config.externalButtonDirection {string} 外部开关按钮位置方向，默认left，只能是left、right、top、bottom
 * @param config.externalButtonTextColor {string} 外部按钮字体颜色，默认#FFFFFFFF白色
 * @returns {Drawer_gz} 实例对象
 * @author hgz
 * @constructor
 */
function Drawer_gz(config) {
    const __data = {
        outerDiv: null,
        titleHeaderEl: null,
        titleEl: null,
        headerEl: null,
        headerHrEl: null,
        externalButEl: null,
        //外层面板
        externalPanel: null,
        //内层面板
        innerPanel: null,
    };
    config = {
        ...{
            show: false,
            //默认右侧
            direction: 'right',
            width: '500px',
            height: '500px',
            backgroundColor: '#ffffff',
            bodyHtml: '',
            title: "侧边栏默认标题",
            drawerBorder: "",
            zIndex: "1500",
            titleShow: true,
            headerShow: true,
            headerHrShow: true,
            externalButtonText: "开关",
            externalButtonColor: "#860429",
            externalButtonTextColor: "#FFFFFFFF",
            externalButtonBorder: "0px solid #ffffff00",
            externalButtonShow: true,
            externalButtonOffset: "0",
            externalButtonDirection: "left"
        }, ...config
    }

    //判断当前是否显示
    this.isShow = () => {
        return config.show;
    };
    //设置面板显示或隐藏
    this.show = (bool) => {
        config.show = bool;
        setDivShowAndHideStyle();
    }

    //设置标题内容
    this.setTitle = (title) => {
        __data.titleEl.textContent = title.trim();
    }

    //设置标题是否显示
    this.titleShow = (bool) => {
        __data.titleEl.style.visibility = bool ? "" : "hidden";
    }

    //顶栏分割线显示隐藏
    this.setHeaderHrShow = (bool) => {
        config.headerHrShow = bool;
        __data.headerHrEl.style.display = bool ? "" : "none";
    }

    //设置面板内容html
    this.setBodyHtml = (html) => {
        panel.innerHTML = html;
    }
    //显示或隐藏顶栏
    this.headerShow = (bool) => {
        __data.titleHeaderEl.style.display = bool ? "" : "none";
    }
    /**
     * 插入html到面板指定位置
     * position：插入的位置，可以是以下值之一：
     * 'beforebegin'：在元素自身之前。
     * 'afterbegin'：在元素的第一个子节点之前。
     * 'beforeend'：在元素的最后一个子节点之后。
     * 'afterend'：在元素自身之后。
     * @param html {string} 要插入的html
     * @param position {string} 插入位置 beforebegin afterbegin beforeend afterend
     */
    this.insertAdjacentHTML = (html, position = "beforeend") => {
        panel.insertAdjacentHTML(position, html);
    }

    //设置层级
    this.setZIndex = (zIndex) => {
        config.zIndex = zIndex;
        __data.outerDiv.style.zIndex = zIndex;
    }

    //外部按钮显示或隐藏
    this.externalButtonShow = (bool) => {
        __data.externalButEl.style.display = bool ? "" : "none";
        config.externalButtonShow = bool;
    }

    //设置外部开关按钮偏移
    this.setExternalButtonOffset = (value) => {
        const butExStyle = __data.externalButEl.style;
        if (config.direction === "top" || config.direction === "bottom") {
            if (config.externalButtonDirection === "left") {
                butExStyle.left = value;
            }
            if (config.externalButtonDirection === "right") {
                butExStyle.right = value;
            }
        }
        if (config.direction === "left" || config.direction === "right") {
            if (config.externalButtonDirection === "top") {
                butExStyle.top = value;
            }
            if (config.externalButtonDirection === "bottom") {
                butExStyle.bottom = value;
            }
        }
        config.externalButtonOffset = value;
    }

    //设置外部开关方向
    this.setExternalButtonDirection = (direction) => {
        if (config.direction === "left" || config.direction === "right") {
            // __data.externalButEl.style.left = "";
            // __data.externalButEl.style.right = "";
            if (direction === "top") {
                __data.externalButEl.style.top = "0";
                __data.externalButEl.style.bottom = "";
            }
            if (direction === "bottom") {
                __data.externalButEl.style.bottom = "0";
                __data.externalButEl.style.top = "";
            }
        }
        if (config.direction === "top" || config.direction === "bottom") {
            if (direction === "left") {
                __data.externalButEl.style.left = "0";
                __data.externalButEl.style.right = "";
            }
            if (direction === "right") {
                __data.externalButEl.style.right = "0";
                __data.externalButEl.style.top = "";
            }
            // __data.externalButEl.style.top = "";
            // __data.externalButEl.style.bottom = "";
        }
        config.externalButtonDirection = direction;
        //设置方向之后复原偏移
        this.setExternalButtonOffset(config.externalButtonOffset);
    }

    //设置外部开关按钮宽度
    this.setExternalButtonWidth = (value) => {
        __data.externalButEl.style.width = value;
    }

    /**
     *设置背景颜色
     * @param color{string}
     */
    this.setBackgroundColor = (color) => {
        __data.externalPanel.style.backgroundColor = color;
    }

    /**
     * 设置宽度
     * @param width {string}
     */
    this.setWidth = (width) => {
        __data.innerPanel.style.width = width;
    }
    /**
     * 设置高度
     * @param height {string}
     */
    this.setHeight = (height) => {
        __data.innerPanel.style.height = height;
    }

    //验证direction参数
    const validateDirection = (direction) => {
        if (!["top", "bottom", "left", "right"].includes(direction)) {
            const message = "方向只能是top、bottom、left、right";
            alert(message);
            throw new Error(message);
        }
    }

    validateDirection(config.direction);
    //todo: 待后续实现手动切换方向功能
    // const setDirection = (direction) => {
    //     validateDirection(direction);
    //     config.direction = direction;
    //     debugger;
    //     setDivShowAndHideStyle();
    // }

    const setDivShowAndHideStyle = () => {
        const div = __data.outerDiv;
        if (config.direction === "left" || config.direction === "right" || config.direction === "top") div.style.top = "0";
        if (config.direction === "left" || config.direction === "top" || config.direction === "bottom") div.style.left = "0";
        if (config.direction === "right" || config.direction === "top" || config.direction === "bottom") div.style.right = "0";
        if (config.direction === "right") div.style.left = "";
        if (config.direction === "bottom") div.style.bottom = "0";
        if (config.direction === "top" || config.direction === "bottom") {
            div.style.width = "100vw";
        } else {
            div.style.height = "100vh";
        }
        if (this.isShow()) {
            if (config.direction === "left" || config.direction === "right") {
                div.style.transform = 'translateX(0)';
            }
            if (config.direction === "top" || config.direction === "bottom") {
                div.style.transform = 'translateY(0)';
            }
        } else {
            if (config.direction === "left") {
                div.style.transform = 'translateX(-100%)';
            }
            if (config.direction === "right") {
                div.style.transform = 'translateX(100%)';
            }
            if (config.direction === "top") {
                div.style.transform = 'translateY(-100%)';
            }
            if (config.direction === "bottom") {
                div.style.transform = 'translateY(100%)';
            }
        }
    }

    const setPanelShowAndHideStyle = (panel) => {
        if (config.direction === "left" || config.direction === "right") {
            panel.style.width = config.width;
            panel.style.height = "100vh";
        } else {
            panel.style.height = config.height;
        }
    }

    const setExternalButtonDirectionStyle = () => {
        const butEl = __data.externalButEl;
        const butExStyle = butEl.style;
        if (config.direction === "right") {
            butExStyle.transform = "translateX(-100%)";
        }
        if (config.direction === "left") {
            butExStyle.right = 0;
            butExStyle.transform = "translateX(100%)";
        }
        if (config.direction === "top") {
            butExStyle.transform = "translateY(100%)";
            butExStyle.bottom = 0;
        }
        if (config.direction === "bottom") {
            butExStyle.transform = "translateY(-100%)";
        }
    }

    const addTitleHeaderElement = (panel) => {
        const headerEl = document.createElement('div');
        const el = document.createElement("div");
        const leftTitleEl = document.createElement('div');
        const span = document.createElement("span");
        const closeDivEl = document.createElement('div');
        const closeBtnEl = document.createElement('button');
        const hrEl = document.createElement('hr');
        __data.titleEl = leftTitleEl;
        __data.titleHeaderEl = headerEl;
        __data.headerHrEl = hrEl;
        headerEl.className = "drawer_gz_header";
        this.titleShow(config.titleShow);
        this.headerShow(config.headerShow);
        el.style.display = "flex";
        el.style.justifyContent = "space-between";
        leftTitleEl.style.display = "flex";
        leftTitleEl.style.alignItems = "center";
        leftTitleEl.style.padding = "20px 20px 0"
        this.setTitle(config.title);
        leftTitleEl.appendChild(span);
        closeDivEl.style.padding = "20px 20px 0";
        closeBtnEl.textContent = "关闭";
        closeBtnEl.setAttribute("gz_type", "");
        closeBtnEl.addEventListener('click', () => {
            this.show(false);
        })
        closeDivEl.appendChild(closeBtnEl);
        hrEl.style.width = "90%";
        el.appendChild(leftTitleEl);
        el.appendChild(closeDivEl);
        headerEl.appendChild(el);
        headerEl.appendChild(hrEl);
        panel.appendChild(headerEl);
    }


    const documentFragment = document.createDocumentFragment();
    //外层
    const outerDiv = document.createElement('div');
    __data.outerDiv = outerDiv;
    outerDiv.style.position = 'fixed';
    outerDiv.style.transition = 'transform 0.5s';
    outerDiv.style.zIndex = config.zIndex;
    setDivShowAndHideStyle();
    this.showDrawer = () => {
        if (this.isShow()) {
            this.show(false);
        } else {
            this.show(true);
        }
        setDivShowAndHideStyle();
    }

    //添加外部开关按钮
    const addExternalButtonElement = (panel) => {
        const divEl = document.createElement('button');
        __data.externalButEl = divEl;
        divEl.textContent = config.externalButtonText || "默认开关";
        divEl.style.position = 'absolute';
        divEl.style.cursor = "pointer";
        divEl.style.borderRadius = "8px";
        divEl.style.lineHeight = "35px";
        divEl.style.textAlign = "center";
        divEl.style.backgroundColor = config.externalButtonColor;
        divEl.style.color = config.externalButtonTextColor;
        divEl.style.fontSize = "14px";
        divEl.style.border = config.externalButtonBorder;
        this.setExternalButtonWidth(config.externalButtonWidth);
        this.externalButtonShow(config.externalButtonShow);
        divEl.addEventListener('click', () => {
            this.showDrawer();
        });
        panel.appendChild(divEl);
    }

    const externalPanel = document.createElement('div');
    __data.externalPanel = externalPanel;
    const panel = document.createElement('div');
    __data.innerPanel = panel;
    externalPanel.style.backgroundColor = config.backgroundColor;
    externalPanel.style.border = config.drawerBorder;
    panel.innerHTML = config.bodyHtml;
    panel.style.overflowY = 'auto';
    addTitleHeaderElement(externalPanel);
    addExternalButtonElement(outerDiv);
    setExternalButtonDirectionStyle();
    this.setExternalButtonDirection(config.externalButtonDirection);
    this.setHeaderHrShow(config.headerHrShow);
    setPanelShowAndHideStyle(panel);
    documentFragment.appendChild(__data.outerDiv);
    __data.outerDiv.appendChild(externalPanel);
    externalPanel.appendChild(panel);
    document.body.appendChild(documentFragment);
    return this;
}
