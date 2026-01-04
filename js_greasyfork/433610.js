// ==UserScript==
// @name          Easy Swagger
// @namespace     https://github.com/peihaojie/Greasemonkey-script
// @description   注意：此脚本为自用包，请搜索 swagger-toolkit 安装原作者的脚本
// @description   注意: 需要增加适配网站，请手动修改 @include
// @include      https://test-dms.skyallhere.com/api/swagger-ui/index.html
// @version       1.0
// @icon          https://raw.githubusercontent.com/peihaojie/Greasemonkey-script/master/icon.png
// @downloadURL https://update.greasyfork.org/scripts/433610/Easy%20Swagger.user.js
// @updateURL https://update.greasyfork.org/scripts/433610/Easy%20Swagger.meta.js
// ==/UserScript==

class Sheets {
  static sheets = `
    body {
      --row-width: 13vw;
      --row-min-width: 245px;
      --row-title-font-size: 14px;
      --body-wrapper-width: 80vw;
      --body-wrapper-margin-right: 3vw;
      --body-wrapper-min-width: 800px;
      --body-btn-group-width: 20px;
    }

    /* 应用于 Copy input */
    .toolkit-hidden { width: 1; height: 1; }

    /* 接口信息部分样式 */
    #swagger-ui .opblock .toolkit-path-btn-group { margin-left: 10px; display: none; }
    #swagger-ui .opblock:hover .toolkit-path-btn-group { display: block; }
    #swagger-ui .opblock .toolkit-path-btn-group a { text-decoration: none; }

    /* 页面内容主体布局 */
    #swagger-ui div.topbar { display: flex; justify-content: flex-end; }
    #swagger-ui div.topbar .wrapper { margin: 0; width: var(--body-wrapper-width); min-width: var(--body-wrapper-min-width); margin-right: var(--body-wrapper-margin-right) }
    #swagger-ui div.swagger-ui { display: flex; justify-content: flex-end; }
    #swagger-ui div.swagger-ui .wrapper { margin: 0; width: var(--body-wrapper-width); min-width: var(--body-wrapper-min-width); margin-right: var(--body-wrapper-margin-right) }

    /* sidebar part */
    #swagger-toolkit-sidebar {
      width: var(--row-width);
      min-width: var(--row-min-width);
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      flex-direction: column;
      justify-content: space-between;
      background-color: #FAFAFA;
      border-right: 1px solid #c4d6d6;
    }
    #swagger-toolkit-sidebar .list { width: 100%; }
    #swagger-toolkit-sidebar .list > header { font-size: 18px; background-color: #999; }
    #swagger-toolkit-sidebar .list > header > .title { color: #FFF; text-align: center; font-weight: 200; }
    #swagger-toolkit-sidebar .row { display: flex; padding-bottom: 5px; width: 100%; cursor: pointer; text-decoration: none; }
    #swagger-toolkit-sidebar .row.method-DELETE { background-color: rgba(249,62,62,.1); }
    #swagger-toolkit-sidebar .row.method-DELETE:hover { background-color: rgba(249,62,62,.5); }
    #swagger-toolkit-sidebar .row.method-GET { background-color: rgba(97,175,254,.1); }
    #swagger-toolkit-sidebar .row.method-GET:hover { background-color: rgba(97,175,254,.5); }
    #swagger-toolkit-sidebar .row.method-POST { background-color: rgba(73,204,144,.1); }
    #swagger-toolkit-sidebar .row.method-POST:hover { background-color: rgba(73,204,144,.5); }
    #swagger-toolkit-sidebar .row.method-PUT { background-color: rgba(252,161,48,.1); }
    #swagger-toolkit-sidebar .row.method-PUT:hover { background-color: rgba(252,161,48,.5); }
    #swagger-toolkit-sidebar .row.method-PATCH { background-color: rgba(80,227,194,.1); }
    #swagger-toolkit-sidebar .row.method-PATCH:hover { background-color: rgba(80,227,194,.5); }

    #swagger-toolkit-sidebar .row .description { color: #333; font-size: 14px; width: calc(var(--row-width) - var(--body-btn-group-width)); min-width: calc(var(--row-min-width) - var(--body-btn-group-width)); }
    #swagger-toolkit-sidebar .row .method { display: flex; line-height: 45px; min-width: 64px; }
    #swagger-toolkit-sidebar .row .path > a { color: #409EFF; }

    #swagger-toolkit-sidebar .row .btn-group { font-size: 12px; }
    #swagger-toolkit-sidebar .row .btn-group > a { text-decoration: none; display: block; }
    #swagger-toolkit-sidebar .row .btn-group > a:hover { font-size: 14px; }

    /* helper */
    .tool-text-size-fixed { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `;
  static inject() {
    const sheet = document.createTextNode(Sheets.sheets);
    const el = document.createElement("style");
    el.id = "swagger-toolkit-sheets";
    el.appendChild(sheet);
    document.getElementsByTagName("head")[0].appendChild(el);
  }
}
class LinkStore {
  key = "";
  path = "";
  method = "";
  description = ""; // 接口名
  id = "";
  createdat = 0;
  static MAX_LENGTH = 10;
  static save(row, key) {
    const store = new LinkStore();
    store.id = row.id;
    store.key = key;
    store.method = row.querySelector(".opblock-summary-method").innerText;
    store.path = row.querySelector(".opblock-summary-path > a").innerText;
    store.description = row.querySelector(
      ".opblock-summary-description"
    ).innerText;
    LinkStore.add(key, store);
  }
  static add(key, store, filterRepeat) {
    let data = LinkStore.getStore(key);
    if (filterRepeat) {
      for (const row of data) {
        if (row.id === store.id && store.path === store.path) return false;
      }
    }
    data.unshift(store);
    if (data.length > LinkStore.MAX_LENGTH)
      data = data.slice(0, LinkStore.MAX_LENGTH);
    localStorage.setItem(key, JSON.stringify(data));
  }
  static remove(key, index) {
    let data = LinkStore.getStore(key);
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));
  }
  static getStore(key) {
    let store = [];
    try {
      const _store = localStorage.getItem(key);
      if (_store) store = JSON.parse(_store);
    } catch (err) {
      console.error(err);
    }
    return store;
  }
}
class Pane {
  dom = null;
  localKey = null;
  title = null;
  placeholder = "暂无数据";
  placeholder_en = "no data";
  btnSave = "收藏";
  btnSave_en = "add to favorites";
  btnRemove = "删除";
  btnRemove_en = "remove";
  enableMarkBtn = false;
  /**
   * 生成或更新当前 Pane
   * @description 将生成 `.list>(header>.title)+(a.row>(.method+.contents>(.description+a.path)))`
   */
  generateDom(isUpdate) {
    if (isUpdate) this.dom.innerHTML = "";
    const list = isUpdate ? this.dom : document.createElement("div");
    list.classList.add("list");
    list.classList.add(this.localKey);
    list.setAttribute("data-key", this.localKey);
    // 添加 header
    const header = document.createElement("header");
    const title = document.createElement("div");
    title.classList.add("title");
    title.innerText = this.getLabelByLanguage("title");
    list.appendChild(header);
    header.appendChild(title);
    // 添加数据
    const data = LinkStore.getStore(this.localKey);
    for (const dataRow of data) {
      const row = document.createElement("a");
      row.href = "#" + dataRow.id;
      row.setAttribute("data-row", JSON.stringify(dataRow));
      const method = document.createElement("div");
      method.innerText = dataRow.method;
      const contents = document.createElement("div");
      const description = document.createElement("div");
      description.innerText = dataRow.description;
      const path = document.createElement("div");
      const pathLink = document.createElement("a");
      pathLink.innerText = dataRow.path;
      pathLink.href = "#" + dataRow.id;
      const btnGroup = document.createElement("div");
      const markBtn = document.createElement("a");
      if (this.enableMarkBtn) {
        markBtn.href = "javascript:;";
        markBtn.setAttribute("title", this.getLabelByLanguage("btnSave"));
        markBtn.innerText = "⭐️";
      }
      const deleteBtn = document.createElement("a");
      deleteBtn.href = "javascript:;";
      deleteBtn.setAttribute("title", this.getLabelByLanguage("btnRemove"));
      deleteBtn.innerText = "✖️";

      row.classList.add("row");
      row.classList.add("method-" + dataRow.method);
      method.classList.add("method");
      contents.classList.add("contents");
      description.classList.add("description");
      description.classList.add("tool-text-size-fixed");
      path.classList.add("path");
      btnGroup.classList.add("btn-group");
      if (this.enableMarkBtn) markBtn.classList.add("btn-mark");
      deleteBtn.classList.add("btn-delete");

      path.appendChild(pathLink);
      contents.appendChild(description);
      contents.appendChild(path);
      // row.appendChild(method)
      row.appendChild(contents);
      row.appendChild(btnGroup);
      btnGroup.appendChild(deleteBtn);
      if (this.enableMarkBtn) btnGroup.appendChild(markBtn);
      list.appendChild(row);
    }
    if (data.length === 0) list.appendChild(this.getPlaceholderDom());
    this.dom = list;
    if (typeof this.afterGenerageDom === "function") this.afterGenerageDom();
    return list;
  }
  getPlaceholderDom() {
    const dom = document.createElement("section");
    dom.innerText = this.getLabelByLanguage("placeholder");
    return dom;
  }
  getLabelByLanguage(field, language) {
    let lang = language;
    if (!lang) {
      const _lang = navigator.language;
      lang = _lang.indexOf("zh") === 0 ? "" : "en";
    }
    return this[`${field}${lang ? "_" + lang : ""}`];
  }
}
class HistoryPane extends Pane {
  localKey = "swagger-toolkit-history";
  title = "浏览历史";
  title_en = "History";
  placeholder = "暂无浏览历史数据";
  placeholder_en = "No history at present";
  enableMarkBtn = true;
}
class MarkPane extends Pane {
  localKey = "swagger-toolkit-mark";
  title = "收藏夹";
  title_en = "Favorites";
  placeholder = "暂无收藏数据, 点击 ⭐️ 按钮添加";
  placeholder_en = "No favorite data, click ⭐️ button to add";
  afterGenerageDom() {
    this.dom;
  }
}
class SideBar {
  static dom = null;
  static panes = [];
  static pathBtnGroupClassName = "toolkit-path-btn-group";
  static copyInput = document.createElement("input");
  initCopyDOM() {
    SideBar.copyInput.classList.add("toolkit-hidden");
    document.body.appendChild(SideBar.copyInput);
    return this;
  }
  addListeners() {
    window.addEventListener("hashchange", () => {
      let _path = location.hash.length > 0 ? location.hash.substr(1) : "";
      if (!_path) return;
      _path = (window.decodeURI && window.decodeURI(_path)) || _path;
      const row =
        document.getElementById(_path) ||
        (document.querySelector(`a[href="#${_path}"]`) &&
          document.querySelector(`a[href="#${_path}"]`).closest(".opblock"));
      if (row) LinkStore.save(row, "swagger-toolkit-history");
      this._updatePane("swagger-toolkit-history");
    });
    document
      .querySelector("#swagger-ui")
      .addEventListener("mouseover", (evt) => {
        this._showPathBtnGroup(evt); // 显示在 path 栏中的按钮组
      });
    return this;
  }
  _showPathBtnGroup(evt) {
    const opblock = evt.target.closest(".opblock");
    if (!opblock) return;
    this._appendPathBtnGroupDOM(opblock);
  }
  _appendPathBtnGroupDOM(opblock) {
    if (opblock.querySelector("." + SideBar.pathBtnGroupClassName)) return;
    const group = document.createElement("div");
    const copyBtn = document.createElement("a");
    group.classList.add(SideBar.pathBtnGroupClassName);
    copyBtn.setAttribute("href", "javascript:;");
    copyBtn.classList.add("btn-copy");
    copyBtn.innerText = "🔗";
    copyBtn.setAttribute("title", "copy");
    group.appendChild(copyBtn);
    copyBtn.addEventListener("click", (evt) => {
      this._copyPath(evt);
    });

    const pathDOM = opblock.querySelector(".opblock-summary-path");
    if (pathDOM) pathDOM.appendChild(group);
  }
  _copyPath(evt) {
    evt.stopPropagation();
    const pathDOM = evt.target.closest(".opblock-summary-path");
    if (!pathDOM) return;
    const pathLink = pathDOM.querySelector("a");
    if (!pathLink) return;
    const path = pathLink.innerText;
    SideBar.copyInput.value = path;
    SideBar.copyInput.select();
    document.execCommand("Copy");
    console.log("copy successfuly");
  }
  generateDom() {
    const sidebar = document.createElement("sidebar");
    sidebar.id = "swagger-toolkit-sidebar";
    SideBar.dom = sidebar;
    return this;
  }
  inject() {
    document.body.appendChild(SideBar.dom);
    return this;
  }
  appendPanes() {
    for (const pane of SideBar.panes) {
      SideBar.dom.appendChild(pane.generateDom());
    }
    return this;
  }
  _updatePane(key) {
    for (const pane of SideBar.panes) {
      if (pane.localKey !== key) continue;
      pane.generateDom(true);
    }
  }
  appendPanesListeners() {
    SideBar.dom.addEventListener("click", (evt) => {
      if (evt.target.classList.contains("btn-delete")) {
        evt.preventDefault();
        evt.stopPropagation();
        const index = this._getRowIndex({ btnItem: evt.target });
        const key =
          evt.target.parentNode.parentNode.parentNode.getAttribute("data-key");
        LinkStore.remove(key, index);
        this._updatePane(key);
      } else if (evt.target.classList.contains("btn-mark")) {
        evt.preventDefault();
        evt.stopPropagation();
        const row = evt.target.parentNode.parentNode.getAttribute("data-row");
        LinkStore.add("swagger-toolkit-mark", JSON.parse(row), true);
        this._updatePane("swagger-toolkit-mark");
      }
    });
  }
  _getRowIndex({ btnItem }) {
    const listDom = Array.from(
      btnItem.parentNode.parentNode.parentNode.children
    );
    for (let index = listDom.length; index--; ) {
      if (listDom[index] === btnItem.parentNode.parentNode) return index - 1;
    }
    return -1;
  }
}
Sheets.inject();
SideBar.panes.push(new HistoryPane());
SideBar.panes.push(new MarkPane());

const MAX_NUM = 30;

window.onload = setTimeout(() => {
  for (let i = 0; i < MAX_NUM; i++) {
    if (!document.querySelector(".opblock-tag")) {
      continue;
    }

    const notOpenTagsList =
      document.querySelectorAll(".opblock-tag[data-is-open=false]") || [];
    for (const tag of Array.from(notOpenTagsList)) {
      tag.click();
    }

    const wrapper = document.querySelector(".swagger-ui");
    wrapper.addEventListener("click", (evt) => {
      // 点击接口标题时在当前 URL 中加入锚点
      const linkTitleDom = evt.target.closest(".opblock-summary");
      if (linkTitleDom) {
        const linkDom = linkTitleDom.parentNode;
        const isOpen = !linkDom.classList.contains("is-open");
        const hash = isOpen ? linkDom.id : "";
        if (hash) location.hash = hash;
        return;
      }
    });

    window.$$_SideBar = new SideBar();
    window.$$_SideBar
      .initCopyDOM()
      .addListeners()
      .generateDom()
      .appendPanes()
      .inject()
      .appendPanesListeners();

    break;
  }
}, 1000);
