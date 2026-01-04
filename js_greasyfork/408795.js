// ==UserScript==
// @name         文章列表导航
// @namespace    dawsonenjoy_article_list_nav
// @version      0.0.1
// @description  简书、腾讯课堂、网易云课堂内容列表导航
// @author       dawsonenjoy
// @homepageURL  https://github.com/dawsonenjoy/tampermonkey_script
// @match        https://www.jianshu.com/nb/*
// @match        https://www.jianshu.com/u/*
// @match        https://www.jianshu.com/
// @match        https://study.163.com/course/*
// @match        https://ke.qq.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408795/%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/408795/%E6%96%87%E7%AB%A0%E5%88%97%E8%A1%A8%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  // --------------------------------------------------------------
  // 使用说明：
  // ·根据页面文章列表自动生成并更新导航，如未更新，请点击标题，即可实现手动刷新
  // ·单击对应文章时，将会跳转到指定位置，并且有高亮提示，可自配置相关处理回调以及相关样式
  // ·双击对应文章时，相当于点击对应文章，一般是页面跳转，可自配置相关处理回调
  // ·在标题栏处按住鼠标可自由拖拽导航栏
  // ·点击选择框可切换主题（明/暗）
  // ·点击标题栏左边小三角，可以进行显示/隐藏控制
  // --------------------------------------------------------------
  const config = {
    // 页面相关配置，可自定义
    pages: {
      // 相关配置参数
      // nodes: 文章列表节点选择器,
      // watcherNode: 监听节点选择器,
      // watcherConfig: 监听配置,
      // urlpre: 跳转url前缀,
      // pageStyle: 对应页面样式,
      // backgroundColor: 点击提示时的背景色,
      // checked: 初始化样式主题，true为白色主题，否则为黑色主题,
      // theme: 样式主题,
      // offset: 节点跳转位置控制,
      // getUrl: 节点url链接获取,
      // onclick: 节点单击回调,
      // ondblclick: 节点双击回调,
      // ----------------------------------------------------------
      // 简书
      jianshu: {
        nodes: "[data-note-id] .content > .title",
        watcherNode: ".note-list",
        watcherConfig: { childList: true },
        getUrl: node => node.getAttribute("href"),
        pageStyle: `
        .directory-root {
          border-width: 0px;
          background: #525252;
        }`,
        backgroundColor: "rgba(0, 0, 0, .3)",
        theme: {
          dark: {
            background: "#525252",
            borderWidth: "0px",
            color: "#c8c8c8"
          },
          lighten: {
            background: "white",
            borderWidth: "1px",
            color: "black"
          }
        }
      },
      // 腾讯课堂
      qq: {
        nodes: ".task-tt-text",
        watcherNode: "#js_dir_tab",
        watcherConfig: { attributes: true },
        checked: true,
        getUrl: node => node.parentElement.parentElement.getAttribute("href")
      },
      // 网易云课堂
      "study.163": {
        nodes: ".ksname",
        watcherNode: "#j-chapter-list",
        watcherConfig: { childList: true },
        checked: true,
        getOndblclick(ele) {
          let index = ele.getAttribute("index");
          if (!index) return;
          utils.getNode(index).click();
        }
      }
      // ----------------------------------------------------------
    },
    // 默认配置
    defaultConfig: {
      nodes: "",
      watcherNode: "",
      watcherConfig: {},
      urlpre: "",
      pageStyle: ``,
      backgroundColor: "rgba(255, 255, 0, .3)",
      checked: false,
      theme: {
        dark: {
          background: "black",
          borderWidth: "0px",
          color: "white"
        },
        lighten: {
          background: "white",
          borderWidth: "1px",
          color: "black"
        }
      },
      offset: [0, -100],
      getUrl: node => node.getAttribute("href"),
      getOnclick: () => {},
      getOndblclick: () => {}
    },
    // 获取页面配置
    get pageConfig() {
      if (this._pageConfig !== undefined) return this._pageConfig;
      for (let page in this.pages) {
        if (location.href.includes(page)) {
          this._pageConfig = this.pages[page];
          break;
        }
      }
      return this._pageConfig || this.defaultConfig;
    },
    // 获取配置属性
    getConfig(attr) {
      return this.pageConfig[attr] || this.defaultConfig[attr];
    },
    // 文章列表
    get nodes() {
      let nodes = this.getConfig("nodes");
      if (!nodes) return [];
      return Array.from(document.querySelectorAll(nodes));
    },
    get root() {
      if (this._root !== undefined) return this._root;
      this._root = document.querySelector(".directory-root");
      return this._root;
    },
    // 主题选中状态
    get isChecked() {
      return (this.checkbox && this.checkbox.checked) || false;
    },
    get checkbox() {
      return document.querySelector(".directory-theme > input");
    },
    get body() {
      return document.querySelector(".directory-body");
    },
    get backgroundColor() {
      return this.getConfig("backgroundColor");
    },
    get checked() {
      return this.getConfig("checked");
    },
    get watcherNode() {
      let watcherNode = this.getConfig("watcherNode");
      if (!watcherNode) return "";
      return document.querySelector(watcherNode);
    },
    get watcherConfig() {
      return this.getConfig("watcherConfig");
    },
    get urlpre() {
      return this.getConfig("urlpre");
    },
    get pageStyle() {
      return this.getConfig("pageStyle");
    },
    get theme() {
      return this.getConfig("theme");
    },
    get offset() {
      return this.getConfig("offset");
    },
    getNode(index) {
      return this.nodes[index];
    },
    getUrl(node) {
      return this.getConfig("getUrl")(node);
    },
    getOnclick(node) {
      return this.getConfig("getOnclick")(node);
    },
    getOndblclick(node) {
      return this.getConfig("getOndblclick")(node);
    },
    // 拖拽行为使用，允许拖拽
    drag: false,
    // 隐藏行为使用，保存位置
    left: null,
    // 通用样式
    commonStyle: `
	.directory-root {
    height: 540px;
    width: 300px;
    position: fixed;
    right: 0px;
    top: 15%;
    box-sizing: border-box;
    border-radius: 5px;
    border-width: 0px;
    border-style: solid;
    border-color: black;
    background: black;
    color: white;
    z-index: 100000;
	}
	.directory-head {
    width: 100%;
    height: 40px;
    position: relative;
    border-bottom: 1px solid #3f3f3f;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    line-height: 40px;
    cursor: pointer;
    user-select: none;
	}
	.directory-title {
    display: block;
    width: 100%;
	}
	.directory-nav {
    width: 0px;
    height: 0px;
    position: absolute;
    left: -13px;
    top: 8px;
    transform: rotate(-45deg);
    border-top: 25px solid #191919;
    border-right: 25px solid transparent;
	}
	.directory-theme {
		display: flex;
		height: 100%;
    right: 0;
		top: 0px;
		position: absolute;
		align-items: center;
	}
	.directory-theme > input {
		width: 30px;
		height: 30px;
		margin: 0;
		line-height: 30px;
		vertical-align: middle;
		outline: none;
	}
	.directory-body {
    height: 500px;
    overflow: auto;
	}
	.directory-li {
    padding: 7px;
    border-bottom: 1px solid #3f3f3f;
    line-height: 20px;
    cursor: pointer;
    user-select: none;
	}
	.directory-head > *:not(input):hover, .directory-li:hover {
    opacity: 0.7;
	}
	.directory-body::-webkit-scrollbar-thumb {
		background: #2b2b2b;
		border-radius: 10px;
	}
	.directory-body::-webkit-scrollbar {
		width: 5px;
		height: 8px;
	}
	`
  };

  const utils = {
    // 获取指定文章
    getNode(index) {
      return config.getNode(index);
    },
    // 获取文章跳转链接
    getUrl(node) {
      return config.getUrl(node);
    },
    // 获取文章点击事件
    getOnclick(node) {
      return config.getOnclick(node);
    },
    // 获取文章双击事件
    getOndblclick(node) {
      return config.getOndblclick(node);
    },
    // 更新文章列表时，记录对应的滚轮位置
    getScrollTop() {
      let body = config.body;
      return body ? body.scrollTop : 0;
    },
    setScrollTop(top = 0) {
      let body = config.body;
      if (!body) return;
      config.body.scrollTop = top;
    },
    // 主题样式设置
    setThemeStyle(node, themeType) {
      Object.entries(config.theme[themeType]).map(themeStyle => {
        let styleName = themeStyle[0];
        let styleVal = themeStyle[1];
        node.style[styleName] = styleVal;
      });
    },
    setDarkTheme(root) {
      this.setThemeStyle(root, "dark");
    },
    setLightenTheme(root) {
      this.setThemeStyle(root, "lighten");
    },
    // 主题切换
    toggleTheme() {
      let root = config.root;
      if (config.isChecked) return this.setLightenTheme(root);
      this.setDarkTheme(root);
    },
    // 显示/隐藏
    toggleRoot() {
      let root = config.root;
      if (parseInt(root.style.right) >= 0 || root.style.right === "") {
        // 隐藏
        config.left = window.getComputedStyle(root).left;
        root.style.left = "unset";
        root.style.right = "-300px";
        return;
      }
      // 显示
      config.left && (root.style.left = config.left);
      root.style.right = 0;
    },
    // 移动到指定节点位置
    scrollTo(node) {
      node.scrollIntoView();
      window.scrollBy(...config.offset);
    },
    // 跳转位置高亮
    hightlight(node) {
      let nodeStyle = node.style;
      let tmpBgc = nodeStyle.background;
      nodeStyle.background = config.backgroundColor;
      setTimeout(() => {
        nodeStyle.background = tmpBgc;
      }, 800);
    },
    moveDirection(node, distance, direction) {
      node.style[direction] =
        parseInt(window.getComputedStyle(node)[direction]) + distance + "px";
    },
    // 移动节点
    move(node, e) {
      this.moveDirection(node, e.movementX, "left");
      this.moveDirection(node, e.movementY, "top");
    },
    // 移动root
    moveRoot(e) {
      let root = config.root;
      this.move(root, e);
    }
  };

  const Dom = {
    setStyle() {
      let style = document.createElement("style");
      style.innerHTML = config.commonStyle;
      style.innerHTML += config.pageStyle;
      document.head.appendChild(style);
    },
    createRoot() {
      let root = document.createElement("div");
      root.className = "directory-root";
      let head = this.createHead();
      root.appendChild(head);
      this.updateUl(root);
      return root;
    },
    createHead() {
      let head = document.createElement("div");
      head.className = "directory-head";
      let title = this.createTitle();
      head.appendChild(title);
      let nav = this.createNav();
      head.appendChild(nav);
      let theme = this.createTheme();
      head.appendChild(theme);
      return head;
    },
    createTitle() {
      let title = document.createElement("span");
      title.className = "directory-title";
      title.setAttribute("title", "点击刷新");
      title.innerText = "文章列表";
      return title;
    },
    createNav() {
      let nav = document.createElement("div");
      nav.className = "directory-nav";
      return nav;
    },
    createTheme() {
      let theme = document.createElement("div");
      theme.className = "directory-theme";
      theme.innerHTML = `<input type="checkbox" name="theme" ${
        config.checked ? "checked" : ""
      }>`;
      return theme;
    },
    updateUl(root) {
      let top = utils.getScrollTop();
      config.body && config.body.remove();
      let ul = this.createUl();
      root.appendChild(ul);
      utils.setScrollTop(top);
    },
    createUl() {
      let ul = document.createElement("ul");
      ul.className = "directory-body";
      config.nodes.map((node, index) =>
        ul.appendChild(this.createLi(node, index))
      );
      return ul;
    },
    createLi(node, index) {
      let li = document.createElement("li");
      li.className = "directory-li";
      li.innerText = node.innerText;
      li.setAttribute("index", index);
      li.setAttribute("title", `${index + 1}.${node.innerText}`);
      li.setAttribute("href", utils.getUrl(node) || "");
      return li;
    },
    // 监听文章数量变化，更新文章列表
    watcher() {
      let node = config.watcherNode;
      let watcherConfig = config.watcherConfig;
      if (!node || Object.keys(watcherConfig).length < 1) return;
      let MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      let observer = new MutationObserver((mutationsList, observer) =>
        Dom.updateUl(config.root)
      );
      observer.observe(node, watcherConfig);
    },
    bindEvent() {
      document.body.onclick = e => {
        let target = e.target;
        // 单击回调
        utils.getOnclick instanceof Function && utils.getOnclick(target);
        // 点击标题刷新
        if (target.className === "directory-title")
          return this.updateUl(config.root);
        // 点击导航按钮（黑色三角形）隐藏/显示
        if (target.className === "directory-nav") return utils.toggleRoot();
        // 单击菜单内容到达页面对应位置，并进行颜色提示
        if (target.className === "directory-li")
          return (window.toPosTimeout = setTimeout(() => {
            let index = target.getAttribute("index");
            let node = utils.getNode(index);
            utils.scrollTo(node);
            utils.hightlight(node);
          }, 0));
        // 单击选择框切换主题
        if (target.getAttribute("name") === "theme") return utils.toggleTheme();
      };
      // 双击菜单内容跳转页面
      document.body.ondblclick = e => {
        let target = e.target;
        // 双击回调
        utils.getOndblclick instanceof Function && utils.getOndblclick(target);
        // href跳转
        if (target.className !== "directory-li") return;
        window.toPosTimeout && clearTimeout(window.toPosTimeout);
        target.getAttribute("href") &&
          window.open(config.urlpre + target.getAttribute("href"));
      };
      // 鼠标按下标题允许拖拽
      document.body.onmousedown = e => {
        let target = e.target;
        if (target.className !== "directory-title") return;
        config.drag = true;
      };
      // 鼠标按下标题允许拖拽
      document.body.onmouseup = e => {
        config.drag = false;
      };
      // 鼠标按下标题时移动拖拽框
      document.body.onmousemove = e => {
        if (!config.drag) return;
        utils.moveRoot(e);
      };
      // 监听并自动更新文章列表
      this.watcher();
    },
    initDom() {
      let root = this.createRoot();
      document.body.appendChild(root);
    },
    init() {
      this.initDom();
      this.setStyle();
      utils.toggleTheme();
      this.bindEvent();
    }
  };

  Dom.init();
})();