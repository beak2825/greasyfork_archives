// ==UserScript==
// @name         夸克网盘树状目录
// @version      1.0
// @description  夸克网盘分享页显示树状列表，点击顶部右边笑脸即可
// @author       sunzehui
// @license      MIT
// @match        https://pan.quark.cn/s/*
// @grant        GM_xmlhttpRequest
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.38.3/jquery.fancytree-all-deps.min.js
// @namespace https://greasyfork.org/users/454712
// @downloadURL https://update.greasyfork.org/scripts/499326/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%A0%91%E7%8A%B6%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499326/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%A0%91%E7%8A%B6%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  var listeners = [];
  var doc = window.document;
  varMutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  var observer;

  function domReady(selector, fn) {
    // 储存选择器和回调函数
    listeners.push({
      selector: selector,
      fn: fn,
    });
    if (!observer) {
      // 监听document变化
      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true,
      });
    }
    // 检查该节点是否已经在DOM中
    check();
  }

  function check() {
    // 检查是否匹配已储存的节点
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      // 检查指定节点是否有匹配
      var elements = doc.querySelectorAll(listener.selector);
      for (var j = 0; j < elements.length; j++) {
        var element = elements[j];
        // 确保回调函数只会对该元素调用一次
        if (!element.ready) {
          element.ready = true;
          // 对该节点调用回调函数
          listener.fn.call(element, element);
        }
      }
    }
  }

  // 对外暴露ready
  window.domReady = domReady;
})();
const api = {
  'fileList': "https://drive-pc.quark.cn/1/clouddrive/share/sharepage/detail"
}

class QuarkScript {
  constructor() {
    this.config = {
      insertContainer: "div.CommonHeader--container--LPZpeBK",
      tagClassname : 'script-tag',
      insertTreeViewContainer: ".DetailLayout--container--264z8Xd",
      lazyLoad: true,
      fancytreeCSS_CDN: "https://cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.27.0/skin-win8/ui.fancytree.css"
    }
    this.api = api

    this.headers = {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json;charset=UTF-8",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-canary": "client=web,app=adrive,version=v2.3.1",
    };
    this.params = {
      pwd_id: this.getPwdId()
    }
    this.nowSelectNode = null;
    this.isLoading = false;
  }

  // ... existing code ...

  parseCookie(str) {
    // ... existing code ...
  }

  getPwdId() {
    const url = location.pathname;
    return url.match(/(?<=\/s\/)(\w+)(?=#)?/g)[0];
  }
  getStoken(){
    const tokenStorage = JSON.parse(sessionStorage.getItem("_share_args"));
    return tokenStorage.value.stoken ? tokenStorage.value.stoken : "";
  }

  loading(type = 'start') {
    const tag = $( '.' + this.config.tagClassname)

    if(this.isLoading==false && type == 'start'){
      this.isLoading = true;
      setTimeout(() => {
        if(!this.isLoading)return;
        if (tag.html() == 'o') {
          tag.html( "0");
        } else {
          tag.html( "o");
        }
        this.loading("start");
      }, 500);
    }

    if(this.isLoading==true && type == 'stop'){
      this.isLoading = false
      tag.html("&#128515;");
    }
  }
  async handleTagClick(){
    console.log('clicked')
      // const tokenStorage = JSON.parse(localStorage.getItem("shareToken"));
      // const token = tokenStorage.share_token ? tokenStorage.share_token : "";
      // headers["x-share-token"] = token;
    const $existsView = $('.tree-container')
    if($existsView.length > 0){
      return $existsView.show();
    }
    this.loading();
    await this.renderView();
    this.loading('stop');
  }

  renderTag() {
    const tag = document.createElement("div");
    tag.classList.add(this.config.tagClassname);
    tag.innerHTML = "&#128515;";

    let that = this;
    $(document).on('click','.'+this.config.tagClassname, function() {
      that.handleTagClick()
    })

    const insertContainer = this.config.insertContainer
    domReady(insertContainer,function(){
      document
        .querySelector(
          insertContainer
        )
        .appendChild(tag);
    })
  }

  listAdapter(list, isFirst = true) {
    return list.map((item) => {
      const hasFolder = !!item.children;
      const obj = {
        title: item.name,
        folder: hasFolder,
        expanded: isFirst,
      };
      if (hasFolder) {
        obj.children = this.listAdapter(item.children, false);
      }
      return obj;
    });
  }

  async buildFancytreeCfg() {
    const that = this
    const cfg = {
      selectMode: 1,
      autoScroll: true,
      activate: function (event, data) {
        console.log('active',data)
        that.nowSelectNode = data.node;
      },
    };
    const loadRootNode = async (event, data) => {
      const list = await this.getList({ parent_file_id: 0 });

      const children = await Promise.all(
        list.map(async (pItem) => {
          const cList = await this.getList({ parent_file_id: pItem.fid });
          return cList.map((cItem) => {
            return {
              title: cItem.file_name,
              folder: cItem.dir,
              key: cItem.fid,
              lazy: true,
            };
          });
        })
      );
      return list.map((item) => ({
        title: item.file_name,
        folder: item.dir,
        key: item.fid,
        expanded: true,
        lazy: true,
        children: children.flat(1),
      }));
    };

    const loadNode = function (event, data) {
      data.result = that.getList({ parent_file_id: data.node.key }).then((list) => {
        return list.map((item) => ({
          title: item.file_name,
          folder: item.dir,
          key: item.fid,
          lazy: item.dir,
        }));
      });
    };
    if (this.config.lazyLoad) {
      cfg["source"] = loadRootNode();
      cfg["lazyLoad"] = loadNode;
    } else {
      const tree = await this.buildTree();
      cfg["source"] = await this.listAdapter(tree.children);
    }
    return cfg;
  }

  async renderView() {
    const cfg = await this.buildFancytreeCfg();
    const $treeContainer = $(`
      <div class="tree-container">
        <div class="bar">
          <button class="btn sunzehuiBtn">进入选中文件夹</button>
          <button class="btn close-btn">X</button>
        </div>
        <div class="tree"></div>
      </div>
    `);
    $treeContainer.find('.tree').fancytree(cfg);

    const that = this;
    $(document).on('click','.tree-container .bar .sunzehuiBtn',function(){
      const selectedNode = that.nowSelectNode;
      if(!selectedNode || !selectedNode.folder) return alert('未选中文件夹');
      // 文件路径 = https://pan.quark.cn/s/{pwd_id}#/list/share/{文件id}-{文件名}/{文件id}-{文件名}/
      const pList = [...selectedNode.getParentList(), selectedNode];
      let filePath = `https://pan.quark.cn/s/${that.getPwdId()}#/list/share/`

      const link = pList.reduce((acc,cur)=>{
        return `${acc}${cur.key}-${cur.title}/`
      }, filePath)
      window.open(link, '_blank');
    })

    $(document).on('click','.tree-container .bar .close-btn',function(){
      $('.tree-container').hide();
    })


    const insertTreeViewContainer = this.config.insertTreeViewContainer
    domReady(insertTreeViewContainer, function () {
      $(insertTreeViewContainer).append($treeContainer)
    });
  }

  async getList({ parent_file_id }) {
    let url = new URL(this.api.fileList);
    let params = {
      pr: 'ucpro',
      fr: 'pc',
      uc_param_str:'',
      pwd_id: this.getPwdId(),
      stoken: this.getStoken(),
      pdir_fid: parent_file_id || 0,
      force: 0,
      _page: 1,
      _size: 50,
      _fetch_banner: 0,
      _fetch_share: 0,
      _fetch_total: 1,
      _sort: "file_type:asc,updated_at:desc",
      __dt: 959945,
      __t: +new Date()
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const result = await fetch(
      url,
      {
        headers: this.headers,
        referrerPolicy: "origin",
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    );
    const resp = await result.json();

    return resp.data.list;
  }

  async buildTree(parent_file_id) {
    const treeNode = {};
    const list = await this.getList({ parent_file_id });
    treeNode.children = [];
    for (let i = 0; i < list.length; i++) {
      let node = void 0;
      const item = list[i]
      if (item.dir) {
        node = await this.buildTree(item.fid);
        node.name = item.file_name;
      } else {
        node = item;
      }
      treeNode.children.push(node);
    }
    return treeNode;
  }

  insertCSS() {
    const cssElem = document.createElement("link");
    cssElem.setAttribute("rel", "stylesheet");
    cssElem.setAttribute(
      "href",
      this.config.fancytreeCSS_CDN
    );
    document.body.appendChild(cssElem);
    const cssElem2 = document.createElement("style");
    cssElem2.innerHTML = `
    .tree-container{
      height: 100%;
      background: #ecf0f1;
      position: fixed;
      top: 60px;
      z-index: 9999;
      left: 0;
      overflow-y:scroll
    }
    .tree-container .bar{
      background: #bdc3c7;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
    .btn{
      padding: 0;
      height: 30px;
    }
    .sunzehuiBtn{
      display: inline-block;
      font-weight: 400;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      padding: 0 8px;
      font-size: 14px;
      border-radius: .2rem;
      color: #fff;
      background-color: #6c757d;
      border-color: #6c757d;
      cursor: pointer;
    }
    .sunzehuiBtn:hover{
       text-decoration: none;
       background-color: #5a6268;
       border-color: #545b62;
    }
    .sunzehuiBtn:focus {
      box-shadow: 0 0 0 0.2rem rgb(130 138 145 / 50%);
    }
    ul.fancytree-container{
      background-color:transparent !important;
      border:none !important;
    }
    .${this.config.tagClassname}{
      width: 20px;
      height: 20px;
      margin-right: auto;
      transform: translateY(-3px);
      margin-left: 20px;
      cursor: pointer;
    }
    `;
    document.body.appendChild(cssElem2);
  }

  async init() {
    this.insertCSS()
    this.renderTag();
  }
}


$(async function () {
  const quarkScript = new QuarkScript();
  await quarkScript.init();
});
