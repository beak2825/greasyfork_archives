// ==UserScript==
// @name        FBI Open the door! B站评论区用户转发动态统计
// @namespace   lightyears.im
// @version     1.2.3
// @description 统计B站评论区内用户转发动态的情况，按照原动态UP主分类。
// @author      1MLightyears
// @match       *://www.bilibili.com/video/*
// @match       *://www.bilibili.com/read/*
// @match       *://t.bilibili.com/*
// @match       *://space.bilibili.com/*
// @icon        https://static.hdslb.com/images/favicon.ico
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_info
// @connect     api.bilibili.com
// @license     Apache Licence 2.0
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/451175/FBI%20Open%20the%20door%21%20B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%94%A8%E6%88%B7%E8%BD%AC%E5%8F%91%E5%8A%A8%E6%80%81%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/451175/FBI%20Open%20the%20door%21%20B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%94%A8%E6%88%B7%E8%BD%AC%E5%8F%91%E5%8A%A8%E6%80%81%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

/*
本脚本的创意来自于 原神玩家指示器(https://greasyfork.org/zh-CN/scripts/450720-%E5%8E%9F%E7%A5%9E%E7%8E%A9%E5%AE%B6%E6%8C%87%E7%A4%BA%E5%99%A8)
感谢 laupuz_xu(https://greasyfork.org/zh-CN/users/954434-laupuz-xu)!
GitHub: https://github.com/1MLightyears/FBIOpenTheDoor
*/


(function () {
  "use strict";

  function genUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const bilibiliVersion = !document.querySelector(".bili-dyn-version-control");  // 新旧版本flag
  const CLASS_BannerDOM = "FO-banner";  // 成分条class
  const CLASS_StatDOM = "FO-stat";  // 成分条里每个成分class
  const CLASS_Gateway = "FO-gateway";  // 入口class
  const CLASS_ColleDOM = "FO-colle";  // 自定义集class
  const CLASS_SubDOM = "FO-sub-stat";  // 自定义集中组分class
  const CLASS_UPiine = "reply-tags";  // "up主觉得很赞"class
  const CLASS_B_ban = "van-icon-info_prohibit";  // 禁止图标class
  const A_User = "FO-user";  // 已经标注查成分的用户
  const QS_BannerInsertBefore_new = "div.root-reply, div.sub-reply-info";  // 新版下banner应插入至此DOM前
  const localStorageKey = "FBIOpenTheDoor";  // 使用的localStorage的键名
  const removeIconCode = "2718";  // 删除功能的图标utf-8码
  const URL_basic = "t.bilibili.com";  // 跨域时的基准自定义集定义所在的网址
  const sync_collections = window.location.host !== URL_basic; // 是否同步的自定义集定义

  let A_Uid, QS_MainCommentUserHeader, QS_ReplyUserHeader, QS_Uid, QS_NewUser, QS_ToolbarDOM;
  if (bilibiliVersion) {
    // 新版
    QS_MainCommentUserHeader = "div.root-reply-container div.user-info";  // 评论的用户行DOM
    QS_ReplyUserHeader = "div.sub-reply-item > div.sub-user-info";  // 楼中楼用户行DOM
    QS_Uid = "div[data-user-id]";  // 用户名DOM
    QS_NewUser = `div.reply-item:not([${A_User}]), div.sub-reply-item:not([${A_User}])`;  // 新刷出来的用户DOM
    QS_ToolbarDOM = `div.reply-info, div.sub-reply-info`;  // 评论下赞、踩、回复工具栏DOM
    A_Uid = "data-user-id";  // 用户Uid属性
  } else {
    // 旧版
    QS_MainCommentUserHeader = "div.con > div.user";  // 评论的用户行DOM
    QS_ReplyUserHeader = "div.reply-con > div.user";  // 楼中楼用户行DOM
    QS_Uid = "a.name";  // 用户名DOM
    QS_NewUser = `div.reply-wrap:not([${A_User}])`;  // 新刷出来的用户DOM
    QS_ToolbarDOM = `div.info`;  // 评论下赞、踩、回复工具栏DOM
    A_Uid = "data-usercard-mid";  // 用户Uid属性
  }


  let CSSSheet = `
span.${CLASS_StatDOM}, span.${CLASS_ColleDOM} {
  text-align: center;
  align-self: center;
  margin: 2px;
  height: calc(2em);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: pre;
  transition: all 0.5s, ease-in-out;
}

span.${CLASS_ColleDOM} {
  border-radius: 1rem;
}

span.${CLASS_StatDOM}:hover, span.${CLASS_ColleDOM}:hover {
  z-index: 256;
}

/* 成分条部分 */
span.${CLASS_StatDOM}:hover a{
  text-decoration: underline;
}

/* 自定义集部分 */
span.${CLASS_ColleDOM}>ul {
  position: absolute;
  top: auto;
  opacity: 0;
  transform: translateX(-50%);
  background-color: inherit;
  border-left: 5px solid white;
  border-right: 5px solid white;
  border-radius: 5px;
  box-shadow: 0px 0px 5px grey;
  transition: all 0.5s ease-in-out;
}

span.${CLASS_ColleDOM}:hover>ul, span.${CLASS_ColleDOM}>ul:hover{
  opacity: 1;
}

span.${CLASS_ColleDOM} li{
  background-color: inherit;
  border: 2px solid white;
  text-align: center;
  border-top: 3px solid white;
  border-bottom: 3px solid white;
  padding: 3px 1.5rem 3px 1.5rem;
}

span.${CLASS_ColleDOM} li:hover>a{
  text-decoration: underline !important;
}

span.${CLASS_ColleDOM} li>i{
  display: inline-block;
  position: absolute;
  right: 0;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 2px;
  color: #fd676f;
  width: 1rem;
  opacity: 0;
}

span.${CLASS_ColleDOM} li>i:before{
  content: "\\${removeIconCode}";
}

span.${CLASS_ColleDOM} li:hover>i{
  opacity: 1;
}

/* banner部分 */
div.${CLASS_BannerDOM} {
  display: flex;
  overflow: hidden;
  padding: 2px;
  box-shadow: 0px 0px 5px gray;
  border-radius: 5px;
  text-shadow: 0px 0px 2px white;
}
`;
  // 为不同版本适配不同的CSS样式
  if (bilibiliVersion) {
    // 新版
    CSSSheet += `
a.${CLASS_Gateway} {
  display: none;
  color: grey;
  position: inherit;
  z-index: 128;
  font-weight: 700;
  margin-left: 2em;
}

div.root-reply-container:hover a.${CLASS_Gateway},
div.sub-reply-item:hover a.${CLASS_Gateway} {
  display: inline;
}

/* 干掉挡事的认证粉丝牌 */
.reply-decorate:hover {
  display: none;
}
`;
  } else {
    // 旧版
    CSSSheet += `
a.${CLASS_Gateway} {
  display: none;
  color: grey;
  position: inherit;
  z-index: 128;
  font-weight: 700;
}

div.con:hover>:not(.reply-box) a.${CLASS_Gateway},
div.con div.reply-item:hover a.${CLASS_Gateway} {
  display: inline;
}

/* 干掉挡事的认证粉丝牌 */
.sailing:hover {
  display: none;
}`;
  }

  // 初始化成分条反查自定义集cid
  let stat2Collection = {};

  // dataTransfer不能存取对象?
  let _dragDOM = null;

  let iframe_t;

  // 在customCollections中的自定义集记录的数据结构:
  // {
  //    "cid": <uuid>
  //    "name": <str>
  //    "contains": [<list of uid>]
  // }
  let customCollections = JSON.parse(window.localStorage.getItem(localStorageKey) || '{ "collections": { } }').collections;


  // 颜色盘
  const pallete = [
    "Pink",
    "LightSkyBlue",
    "Aqua",
    "SpringGreen",
    "DarkSeaGreen",
    "Beige",
    "Gold",
    "Wheat",
    "Tan",
    "DarkSalmon",
    "Tomato",
    "Silver",
  ];

  // 评论类型
  const TComment = {
    MainComment: 0,  // 评论区评论
    ReplyComment: 1,  // 评论区回复楼中楼评论
  };

  // 跨域信息类型
  const TCOM = {
    UPDATE_COLLECTIONS: 0,  // data字段为携带的customCollections
    FETCH_COLLECTIONS: 1,
  };

  function updateStat2Collection() {
    //// 修改自定义集记录后关联修改反向索引
    for (let c in customCollections) {
      for (let i = 0, l = customCollections[c].contains.length; i < l; i++) {
        stat2Collection[customCollections[c].contains[i]] = c;
      }
    }
  }

  function saveCollection() {
    //// 保存自定义集设定至localStorage
    if (sync_collections) {
      iframe_t.contentWindow.postMessage({
        COM: TCOM.UPDATE_COLLECTIONS,
        data: customCollections,
      }, iframe_t.src);
    }
    let t = JSON.stringify({ "collections": customCollections });
    window.localStorage.setItem(localStorageKey, t);
    updateStat2Collection();
  }

  function createCollection() {
    //// 新建一个自定义集并记录
    let newCollection = {
      "cid": genUuid(),
      "name": "",
      "contains": [],
    };
    customCollections[newCollection.cid] = newCollection;
    return newCollection;
  }

  function removeCollection(collection) {
    if (!!customCollections[collection.cid]) {
      delete customCollections[collection.cid];
        return true;
    } else {
        return false;
    }
  }
  function mergeCollection(targetCollection, ...collections) {
    //// 将一些自定义集并入targetCollection自定义集
    // name为targetCollection的，count为所有collections的count之和再加targetCollection的
    for (let i = 0; i < collections.length; i++) {
      let co = collections[i];
      for (let j = 0; j < co.contains.length; j++) {
        if (!targetCollection.contains.includes(co.contains[j])) {
          targetCollection.contains.push(co.contains[j]);
          stat2Collection[co.contains[j]] = targetCollection.cid;
        }
      }
      delete customCollections[co.cid];
    }
    saveCollection();
  }
  function add2Collection(cid, uid) {
    ///// 将一个成分条(uid)编入一个自定义集(cid)
    let collection = customCollections[cid];
    if (!collection.contains.includes(uid)) {
      collection.contains.push(uid);
      stat2Collection[uid] = cid;
    }
    saveCollection();
  }
  function removeFromCollection(uid) {
    //// 将一个子成分条移出自定义集
    if (!stat2Collection.hasOwnProperty(uid)) return -1;
    let collection = customCollections[stat2Collection[uid]];
    collection.contains.splice(collection.contains.indexOf(uid), 1);
    if (collection.contains.length === 0) delete customCollections[stat2Collection[uid]];
    delete stat2Collection[uid];
    saveCollection();
    return 0;
  }
  function renameCollection(collection, newName) {
    //// 重命名一个自定义集为newName。
    // 解决重名冲突。若重名则返回false，否则返回重复的自定义集的uid。
    let repeated = "";
    for (let i in customCollections) {
      let c = customCollections[i];
      if (c.name === newName) {
        repeated = c;
        break;
      }
    }
    if (!repeated) {
      collection.name = newName;
      return 0;
    } else return repeated;
  }

  function renderAll() {
    //// 渲染当前页面上所有banner
    for (let i = 0, l = users.length; i < l; i++) {
      if (users[i].total) {
        setTimeout(users[i].render.bind(users[i]), 0);
      }
    }
  }

  class TDisp {
    //// banner中的显示块类
    constructor(id, name, count, stat_type, parent_banner) {
      this.dom = document.createElement("span");
      this.dom.disp_of = this;
      this.id = id || genUuid();
      this.name = name || "新集合";
      this.count = count || 0;
      this.stat_type = stat_type || TDisp.DispType.Statistic;
      this.parent_banner = parent_banner;
    }
    setName(newname) {
      this.name = newname.toString();
      if (this.dom.children.length && this.dom.childNodes[0].nodeType === 3) {
        // 仅修改文本
        this.dom.childNodes[0].nodeValue = this.name;
      } else {
        this.dom.innerHTML = this.name;
      }
      return this;
    }
    getName() {
      if (this.dom.children.length && this.dom.childNodes[0].nodeType === 3) {
        return this.dom.childNodes[0].nodeValue;
      } else {
        return this.dom.innerText;
      }
      return this;
    }
    appendChild(DispDOM) {
      let subDOM = document.createElement("span");
      subDOM._id = DispDOM.id;
      subDOM._name = DispDOM.name;
      subDOM._count = DispDOM.count;
      let percent = subDOM._count / this.total * 100;

      subDOM.classList.add(CLASS_SubDOM);

      let innerDetailDOM = document.createElement("a");
      innerDetailDOM.setAttribute("target", "_blank");
      innerDetailDOM.setAttribute("href", `//space.bilibili.com/${subDOM._id}`);
      innerDetailDOM.setAttribute("draggable", false);
      innerDetailDOM.innerText = subDOM._name;
      subDOM.appendChild(innerDetailDOM);
      subDOM.innerHTML += `(${subDOM._count}, ${Math.floor(percent)}%)`;

      this.dom.appendChild(subDOM);
      return this;
    }
    render(total, components) {
      //// 渲染显示块本身

      // common
      let percent = this.count / total * 100;
      this.dom.style.width = `${percent}%`;  // 宽度与数量成比例

      this.dom.addEventListener("mouseover", () => {
        if (percent < 99) {
          setTimeout(() => {
            this.dom.style.width = `max(calc(${percent}%), calc(${this.getName().length + 2}em))`;  // 显示所有的字，为数字和半角括号增加冗余空间
          }, 0);
        }
      });
      this.dom.addEventListener("dragover", (e) => {
        e.preventDefault();
      });
      this.dom.addEventListener("dragenter", (e) => {
        this.dom.style.boxShadow = "0px 0px 0.5em grey";
      });
      this.dom.addEventListener("dragleave", (e) => {
        this.dom.style.boxShadow = "";
      });

      // 修饰每个成分,根据类型
      switch (this.stat_type) {
        case TDisp.DispType.Statistic:
          // 成分条
          this.dom.classList.add(CLASS_StatDOM);
          this.dom.setAttribute("draggable", "true");

          // up主链接
          let innerDetailDOM = document.createElement("a");
          innerDetailDOM.setAttribute("target", "_blank");
          innerDetailDOM.setAttribute("href", `//space.bilibili.com/${this.id}`);
          innerDetailDOM.setAttribute("draggable", false);
          innerDetailDOM.innerText = this.name;
          this.dom.appendChild(innerDetailDOM);
          this.dom.innerHTML += `(${this.count}, ${Math.floor(percent)}%)`;

          this.dom.addEventListener("mouseleave", () => {
            this.dom.style.width = `${percent}%`;
          });
          this.dom.addEventListener("dragstart", (e) => {
            _dragDOM = this.dom;
            while (!(_dragDOM instanceof HTMLSpanElement && _dragDOM.hasOwnProperty("disp_of"))) {
              _dragDOM = _dragDOM.parentNode;
            }
          });
          this.dom.addEventListener("drop", (e) => {
            this.dom.style.boxShadow = "";
            while (!(_dragDOM instanceof HTMLSpanElement && _dragDOM.hasOwnProperty("disp_of"))) {
              _dragDOM = _dragDOM.parentNode;
            }

            let targetCollection = createCollection();

            if (_dragDOM.disp_of.id !== this.id) {
              add2Collection(targetCollection.cid, this.id);
              add2Collection(targetCollection.cid, _dragDOM.disp_of.id);
            } else if (confirm(`要将【${this.name}】单独编入一个自定义集吗？`)) {
              // 自己落自己时询问用户
              add2Collection(targetCollection.cid, this.id);
            } else {
               removeCollection(targetCollection);
             }
            renderAll();
            setTimeout(() => {
              for (let i = 0, l = this.parent_banner.statics.length; i < l; i++) {
                if (this.parent_banner.statics[i].id === targetCollection.cid) {
                  this.parent_banner.statics[i].dom.dispatchEvent(new Event("dblclick"));
                  break;
                }
              }
            }, 100);
          });
          innerDetailDOM.ondragstart =
            innerDetailDOM.ondragenter =
            innerDetailDOM.ondragleave =
            innerDetailDOM.ondragend = (e) => {
              // 防止打开链接
              e.preventDefault();
              e.stopPropagation();
              this.dom.dispatchEvent(e);
            };
          break;
        case TDisp.DispType.Collection:
          // 渲染自定义集
          this.dom.classList.add(CLASS_ColleDOM);
          this.setName(`${this.name}(${this.count}, ${Math.floor(percent)}%)`);
          let renameInputDOM = document.createElement("input");
          renameInputDOM.placeholder = customCollections[this.id].name || "新集合";
          renameInputDOM.style.display = "none";
          renameInputDOM.style.width = `${renameInputDOM.placeholder.length + 2}rem`;
          renameInputDOM.onkeyup = (e) => { if (e.type === "keyup" && e.key === "Enter") { e.target.blur(); } };
          renameInputDOM.onblur = (e) => {
            this.name = renameInputDOM.value || renameInputDOM.placeholder;
            // 检查有无重名的自定义集
            let renret;
            for (; ;) {
              renret = renameCollection(customCollections[this.id], this.name);
              if (!!renret) {
                if (confirm(`已经有名为【${this.name}】的自定义集。是否合并它们？\n\n选择取消将建立名为【${this.name}*】的新自定义集。`)) {
                  mergeCollection(customCollections[renret.cid], customCollections[this.id]);
                  renderAll();
                  return;
                } else {
                  this.name += "*";
                }
              } else break;
            }
            customCollections[this.id].name = this.name;
            this.setName(`${this.name}(${this.count}, ${Math.floor(percent)}%)`);
            saveCollection();
            renameInputDOM.style.display = "none";
            renderAll();
          };
          this.dom.appendChild(renameInputDOM);

          let ul = document.createElement("ul");
          for (let i = 0, l = (components || []).length; i < l; i++) {
            let subStat = components[i],
              li = document.createElement("li"),
              innerDetailDOM = document.createElement("a"),
              innerPercent = subStat.count / total * 100;
            innerDetailDOM.setAttribute("target", "_blank");
            innerDetailDOM.setAttribute("href", `//space.bilibili.com/${subStat.uid}`);
            innerDetailDOM.setAttribute("draggable", false);
            innerDetailDOM.innerText = subStat.name;
            li.appendChild(innerDetailDOM);
            li.innerHTML += `(${subStat.count}, ${Math.floor(innerPercent)}%)`;
            let removeLiI = document.createElement("i");
            removeLiI.classList.add(CLASS_B_ban);
            removeLiI.addEventListener("click", () => {
              // 将当前子成分条的移除出当前自定义集
              removeFromCollection(subStat.uid);
              renderAll();
            });
            li.appendChild(removeLiI);

            ul.appendChild(li);
          }
          this.dom.appendChild(ul);

          let bannerLeft = this.parent_banner.bannerDOM.getBoundingClientRect().x;
          this.dom.addEventListener("mouseover", () => {
            // 自定义集显示包含成分，弹出位置
            let parentWidth = Number(/[0-9\.]+/.exec(getComputedStyle(this.dom).width)[0]);
            let parentLeft = this.dom.getBoundingClientRect().x - bannerLeft;
            this.dom.querySelector("ul").style.left = `${parentLeft + Math.floor(parentWidth / 2)}px`;
          });
          this.dom.addEventListener("mouseleave", () => {
            this.dom.style.width = `${percent}%`;
          });
          this.dom.addEventListener("drop", (e) => {
            this.dom.style.boxShadow = "";
            while (!(_dragDOM instanceof HTMLSpanElement && _dragDOM.hasOwnProperty("disp_of"))) {
              _dragDOM = _dragDOM.parentNode;
            }
            let targetCollection = customCollections[this.id];
            add2Collection(targetCollection.cid, _dragDOM.disp_of.id);
            renderAll();
          });
          this.dom.addEventListener("dblclick", (e) => {
            this.setName("");
            renameInputDOM.style.display = "inline-block";
            renameInputDOM.focus();
          });
          break;
      }
      return this;
    }
  }
  TDisp.DispType = {
    Statistic: 0,
    Collection: 1,
  };

  class TBilibiliUser {
    //// 评论用户类
    constructor(commentDOM) {
      //// 初始化用户类

      this.commentDOM = commentDOM;
      this.toolbarDOM = this.locateToolbar();
      this.userHeaderDOM = this.locateUserHeader();
      let userADOM = this.userHeaderDOM.querySelector(QS_Uid);
      this.uid = userADOM.getAttribute(A_Uid);
      this.name = userADOM.text;
      this.forwardCounter = {};
      this.bannerDOM = document.createElement("div");
      this.statics = [];
      this.offset = null;
      this.total = 0;
      this.multi_query = false;

      this.gatewayDOM = this.createGateway();
      if (bilibiliVersion) {
        // 新版
        let parentDOM = this.userHeaderDOM.parentNode;
        parentDOM.insertBefore(this.bannerDOM, parentDOM.querySelector(QS_BannerInsertBefore_new));
      } else {
        // 旧版
        this.userHeaderDOM.appendChild(this.bannerDOM);
      }
      this.commentDOM.setAttribute(A_User, true);
    }
    locateToolbar() {
      //// 定位评论工具栏
      let toolbarDOM = this.commentDOM.querySelector(QS_ToolbarDOM);
      return toolbarDOM;
    }
    locateUserHeader() {
      //// 定位用户行，确定评论类型
      let userHeaderDOM = this.commentDOM.querySelector(QS_MainCommentUserHeader);
      this.commentType = TComment.MainComment;
      if (!userHeaderDOM) {
        userHeaderDOM = this.commentDOM.querySelector(QS_ReplyUserHeader);
        this.commentType = TComment.ReplyComment;
      }
      return userHeaderDOM;
    }
    createGateway() {
      //// 修饰查成分入口
      let gatewayDOM = document.createElement("a");
      gatewayDOM.classList.add(CLASS_Gateway);
      gatewayDOM.innerHTML = "开门！查成分！";
      gatewayDOM.onclick = this.getForwards.bind(this);
      gatewayDOM.ondblclick = () => {
        this.multi_query = true;
        this.getForwards();
      };

      // "up主觉得很赞"是div block,移动顺序
      let upiineDOM = null;
      if (!!this.toolbarDOM.lastChild && this.toolbarDOM.lastChild.classList.contains(CLASS_UPiine)) {
        upiineDOM = this.toolbarDOM.lastChild;
        this.toolbarDOM.removeChild(upiineDOM);
      }
      this.toolbarDOM.appendChild(gatewayDOM);
      if (!!upiineDOM) {
        this.toolbarDOM.appendChild(upiineDOM);
      }

      return gatewayDOM;
    }
    render() {
      //// 渲染banner

      this.collect();

      // 统计并修饰入口链接
      this.total = 0;
      for (let i in this.forwardCounter) {
        this.total += this.forwardCounter[i].count;
      }
      this.gatewayDOM.text = `(已查询到${this.total}条) `;
      if (this.has_more) {
        if (this.multi_query) {
          setTimeout(this.getForwards(), Math.random() * 100);
        } else {
          this.gatewayDOM.text += "继续查!( ‘·A·’)";
        }
      } else {
        this.gatewayDOM.onclick = null;
        this.gatewayDOM.ondblclick = null;
      }
      this.bannerDOM.innerHTML = "";

      // 构建内部成分表 先渲染所有的成分条
      this.statics = [];
      for (let key in this.forwardCounter) {
        let curr = this.forwardCounter[key];
        this.statics.push(new TDisp(
          curr.uid || curr.cid,
          curr.name,
          curr.count,
          curr.stat_type,
          this
        ).render(this.total, curr.components));
      }

      // 显示statDOMs，刷新banner 数量较大的成分优先
      this.statics.sort((a, b) => {
        return b.count - a.count;
      });
      let colorNo = -1;
      for (let i = 0; i < this.statics.length; i++) {
        colorNo = colorNo + 1 < pallete.length ? colorNo + 1 : 0;
        this.bannerDOM.appendChild(this.statics[i].dom);
        this.statics[i].dom.style.backgroundColor = pallete[colorNo];
      }
      this.bannerDOM.className = CLASS_BannerDOM;
    }
    fetchHomepage() {
      //// 拿B站API url
      return `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=${this.uid}` + (!!this.offset ? `&offset=${this.offset}` : "");
    }
    getForwards() {
      //// XHR拿动态列表
      this.gatewayDOM.text = "/// 警方突击中 ///";
      GM_xmlhttpRequest({
        method: "get",
        url: this.fetchHomepage(),
        data: "",
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        },
        onload: function (resp) {
          if (resp.status === 200) {
            if (!resp.data) {
              this.gatewayDOM.text=`受到流量控制||( -_-) 请稍后再试`;
            }
            resp = JSON.parse(resp.response);
            for (let i = 0; i < resp.data.items.length; i++) {
              let item = resp.data.items[i];
              if (item.hasOwnProperty("orig")) {
                let originalUpUid = item.orig.modules.module_author.mid;
                if (!originalUpUid) continue;
                if (this.forwardCounter.hasOwnProperty(originalUpUid)) {
                  this.forwardCounter[originalUpUid].count += 1;
                } else {
                  this.forwardCounter[originalUpUid] = {
                    "name": item.orig.modules.module_author.name,
                    "uid": item.orig.modules.module_author.mid,
                    "count": 1,
                    "stat_type": TDisp.DispType.Statistic
                  };
                }
              }
            }
            this.offset = resp.data.offset;
            this.has_more = resp.data.has_more;
            this.render();
              return true;
          } else {
            console.warn(`获取失败@uid=${this.uid}: status=${resp.status}`);
            return false;
          }
        }.bind(this)
      });
    }
    collect() {
      //// 根据自定义集分组情况，修改统计结果forwardCounter

      // 先将每个成分从自定义集中拆出来
      for (let key in this.forwardCounter) {
        let curr = this.forwardCounter[key];
        if (curr.stat_type === TDisp.DispType.Collection) {
          for (let i = curr.components.length - 1; i >= 0; i--) {
            let subStat = curr.components[i];
            let rawStat = this.forwardCounter[subStat.uid] ||
            // 在forwardCounter中的成分实例的数据结构
            /*
            {
              "name": (str)up名,
              "uid": (str)uuid,
              "count": (int)该up被转发的次数,
              "stat_type": (TDisp.DispType)对于成分条，该字段值为0(i.e. Statistic)
            };
            */
            {
              "name": subStat.name,
              "uid": subStat.uid,
              "count": 0,
              "stat_type": subStat.stat_type,
            };
            rawStat.count += subStat.count;
            this.forwardCounter[subStat.uid] = rawStat;
          }
          delete this.forwardCounter[key];
        }
      }

      // 再全部重新分组
      for (let key in this.forwardCounter) {
        let curr = this.forwardCounter[key];
        if (curr.stat_type === TDisp.DispType.Statistic && stat2Collection.hasOwnProperty(curr.uid)) {
          let cid = stat2Collection[curr.uid];
          // 在forwardCounter中的自定义集实例的数据结构
          /*
          {
            "name": (str)自定义集名,
            "cid": (str)uuid,
            "count": (int)子成分数量和,
            "components": (array of stat)原先在forwardCounter中的成分实例
            "stat_type": (TDisp.DispType)对于自定义集，该字段的值为1(i.e. Collection)
          }
          */
          let targetCollection = this.forwardCounter[cid] || {
            "name": customCollections[cid].name,
            "cid": cid,
            "count": 0,
            "components": [],
            "stat_type": TDisp.DispType.Collection,
          };
          targetCollection.components.push(curr);
          targetCollection.count += curr.count;
          this.forwardCounter[cid] = targetCollection;
          this.forwardCounter[cid].name = customCollections[cid].name;  // 补刷name
          delete this.forwardCounter[key];
        }
      }
    }
  }

  //// 从localStorage获取自定义集记录。
  // 20221126 FIX: t.bilibili.com 和 www.bilibili.com 中间存在跨域问题，localStorage不同步
  // sync_collections(bool): 是否从URL_basic获取自定义集记录
  if (!sync_collections) {
    function handleCollections(e) {
      //// URL_basic页面的窗口事件响应
      let origin = e.origin || e.originalEvent.origin;
      if (new RegExp("bilibili.com").exec(origin)) {
        switch (e.data.COM) {
          case TCOM.UPDATE_COLLECTIONS:
            customCollections = e.data.data || {};
            saveCollection();
            break;
          case TCOM.FETCH_COLLECTIONS:
            e.source.postMessage({
              COM: TCOM.UPDATE_COLLECTIONS,
              data: customCollections
            }, origin);
            break;
        }
      }
    }
    window.addEventListener("message", handleCollections, false);

    updateStat2Collection();
    console.log(`%c开门！\n查成分！\n%c(v${GM_info.script.version})`,
      `font-size: 2.5em;font-style:italic;color:gold`,
      `font-size:1em;color:cyan;font-style:italic`);
  } else {
    function recvCollections(e) {
      //// 非URL_basic页面，接受URL_basic页面返回的自定义集
      let origin = e.origin || e.originalEvent.origin;
      let t_collections, rev_index;
      if ((new RegExp(URL_basic).exec(origin))) {
        switch (e.data.COM) {
          case TCOM.UPDATE_COLLECTIONS:
            t_collections = e.data.data;
            rev_index = {};
            for (let i in customCollections) {
              rev_index[customCollections[i].name] = customCollections[i];
            }
            for (let i in t_collections) {
              if (rev_index.hasOwnProperty(t_collections[i].name)) {
                let target = rev_index[t_collections[i].name];
                target.contains.concat(t_collections[i].contains);
              } else {
                customCollections[i] = t_collections[i];
              }
            }
            saveCollection();
            break;
        }
      }
    }
    window.addEventListener("message", recvCollections, false);

    // 合并t.bilibili.com的自定义集记录
    iframe_t = document.createElement('iframe');
    iframe_t.style.display = 'none';
    document.body.appendChild(iframe_t);
    iframe_t.onload = () => {
      if (!!iframe_t.src.length) {
        iframe_t.contentWindow.postMessage({ COM: TCOM.FETCH_COLLECTIONS }, iframe_t.src);
      }
    };
    window.addEventListener("load", () => {
      iframe_t.src = `https://${URL_basic}/`;
    });
  }

  // main
  let users = [];
  let customCSSDOM = GM_addStyle(CSSSheet);
  setInterval(() => {
    let newUsersDOM = document.querySelectorAll(QS_NewUser);
    for (let i = 0; i < newUsersDOM.length; i++) {
      users.push(new TBilibiliUser(newUsersDOM[i]));
    }
  }, 5000);
})();
