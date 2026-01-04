// ==UserScript==
// @name         B站备注
// @namespace    https://github.com/pxoxq
// @version      0.4.1
// @description  B站用户备注脚本| Bilibili用户备注
// @license      AGPL-3.0-or-later
// @author       pxoxq
// @match        https://*.bilibili.com/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        window.onurlchange
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/482973/B%E7%AB%99%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482973/B%E7%AB%99%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

// -----------ElementGetter----------------
var elmGetter = function() {
  const win = window.unsafeWindow || document.defaultView || window;
  const doc = win.document;
  const listeners = new WeakMap();
  let mode = 'css';
  let $;
  const elProto = win.Element.prototype;
  const matches = elProto.matches ||
      elProto.matchesSelector ||
      elProto.webkitMatchesSelector || 
      elProto.mozMatchesSelector ||
      elProto.oMatchesSelector;
  const MutationObs = win.MutationObserver ||
      win.WebkitMutationObserver ||
      win.MozMutationObserver;
  function addObserver(target, callback) {
      const observer = new MutationObs(mutations => {
          for (const mutation of mutations) {
              if (mutation.type === 'attributes') {
                  callback(mutation.target);
                  if (observer.canceled) return;
              }
              for (const node of mutation.addedNodes) {
                  if (node instanceof Element) callback(node);
                  if (observer.canceled) return;
              }
          }
      });
      observer.canceled = false;
      observer.observe(target, {childList: true, subtree: true, attributes: true});
      return () => {
          observer.canceled = true;
          observer.disconnect();
      };
  }
  function addFilter(target, filter) {
      let listener = listeners.get(target);
      if (!listener) {
          listener = {
              filters: new Set(),
              remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
          };
          listeners.set(target, listener);
      }
      listener.filters.add(filter);
  }
  function removeFilter(target, filter) {
      const listener = listeners.get(target);
      if (!listener) return;
      listener.filters.delete(filter);
      if (!listener.filters.size) {
          listener.remove();
          listeners.delete(target);
      }
  }
  function query(all, selector, parent, includeParent, curMode) {
      switch (curMode) {
          case 'css':
              const checkParent = includeParent && matches.call(parent, selector);
              if (all) {
                  const queryAll = parent.querySelectorAll(selector);
                  return checkParent ? [parent, ...queryAll] : [...queryAll];
              }
              return checkParent ? parent : parent.querySelector(selector);
          case 'jquery':
              let jNodes = $(includeParent ? parent : []);
              jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
              if (all) return $.map(jNodes, el => $(el));
              return jNodes.length ? $(jNodes.get(0)) : null;
          case 'xpath':
              const ownerDoc = parent.ownerDocument || parent;
              selector += '/self::*';
              if (all) {
                  const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
                  const result = [];
                  for (let i = 0; i < xPathResult.snapshotLength; i++) {
                      result.push(xPathResult.snapshotItem(i));
                  }
                  return result;
              }
              return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
      }
  }
  function isJquery(jq) {
      return jq && jq.fn && typeof jq.fn.jquery === 'string';
  }
  function getOne(selector, parent, timeout) {
      const curMode = mode;
      return new Promise(resolve => {
          const node = query(false, selector, parent, false, curMode);
          if (node) return resolve(node);
          let timer;
          const filter = el => {
              const node = query(false, selector, el, true, curMode);
              if (node) {
                  removeFilter(parent, filter);
                  timer && clearTimeout(timer);
                  resolve(node);
              }
          };
          addFilter(parent, filter);
          if (timeout > 0) {
              timer = setTimeout(() => {
                  removeFilter(parent, filter);
                  resolve(null);
              }, timeout);
          }
      });
  }
  return {
      get currentSelector() {
          return mode;
      },
      get(selector, ...args) {
          let parent = typeof args[0] !== 'number' && args.shift() || doc;
          if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
          const timeout = args[0] || 0;
          if (Array.isArray(selector)) {
              return Promise.all(selector.map(s => getOne(s, parent, timeout)));
          }
          return getOne(selector, parent, timeout);
      },
      each(selector, ...args) {
          let parent = typeof args[0] !== 'function' && args.shift() || doc;
          if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
          const callback = args[0];
          const curMode = mode;
          const refs = new WeakSet();
          for (const node of query(true, selector, parent, false, curMode)) {
              refs.add(curMode === 'jquery' ? node.get(0) : node);
              if (callback(node, false) === false) return;
          }
          const filter = el => {
              for (const node of query(true, selector, el, true, curMode)) {
                  const _el = curMode === 'jquery' ? node.get(0) : node;
                  if (refs.has(_el)) break;
                  refs.add(_el);
                  if (callback(node, true) === false) {
                      return removeFilter(parent, filter);
                  }
              }
          };
          addFilter(parent, filter);
      },
      create(domString, ...args) {
          const returnList = typeof args[0] === 'boolean' && args.shift();
          const parent = args[0];
          const template = doc.createElement('template');
          template.innerHTML = domString;
          const node = template.content.firstElementChild;
          if (!node) return null;
          parent ? parent.appendChild(node) : node.remove();
          if (returnList) {
              const list = {};
              node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
              list[0] = node;
              return list;
          }
          return node;
      },
      selector(desc) {
          switch (true) {
              case isJquery(desc):
                  $ = desc;
                  return mode = 'jquery';
              case !desc || typeof desc.toLowerCase !== 'function':
                  return mode = 'css';
              case desc.toLowerCase() === 'jquery':
                  for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                      if (isJquery(jq)) {
                          $ = jq;
                          break;
                      };
                  }
                  return mode = $ ? 'jquery' : 'css';
              case desc.toLowerCase() === 'xpath':
                  return mode = 'xpath';
              default:
                  return mode = 'css';
          }
      }
  };
}();


// ==========防抖函数=============
function pxoDebounce(func, delay) {
  let timer = null;
  function _debounce(...arg) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arg);
      timer = null;
    }, delay);
  }
  return _debounce;
}

class DateUtils {
  static getCurrDateTimeStr() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let sec = date.getSeconds();
    return `${year}${month}${day}${hour}${minutes}${sec}`;
  }
}

/* =======================================
    IndexedDB   开始
======================================= */
class MyIndexedDB {
  request;
  db;
  dbName;
  dbVersion;
  store;

  constructor(dbName, dbVersion, store) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.store = store;
  }

  // 直接 await MyIndexedDB.create(xxxx)  获取实例对象
  static async create(dbName, dbVersion, store) {
    const obj = new MyIndexedDB(dbName, dbVersion, store);
    obj.db = await obj.getConnection();
    return obj;
  }

  // 通过 new MyIndexedDB(xxx) 获取实例对象后，还需要 await initDB() 一下
  async initDB() {
    return new Promise((resolve, rej) => {
      this.getConnection().then((res) => {
        this.db = res;
        resolve(this);
      });
    });
  }

  // 控制台打印错误
  consoleError(msg) {
    console.log(`[myIndexedDB]: ${msg}`);
  }

  // 获取连接；直接挂到 this.db 上
  // 需要注意，第一次的话，会初始化好 db、 store。但是之后就不会初始化 store，需要判断获取
  getConnection = async () => {
    return new Promise((resolve, rej) => {
      // console.log("连接到数据库： "+`--${this.dbName}--  --${this.dbVersion}--`)
      // 打开数据库，没有则新建
      this.request = indexedDB.open(this.dbName, this.dbVersion);
      this.request.onerror = (e) => {
        console.error(
          `连接 ${this.dbName} [IndexedDB] 失败. version: [${this.dbVersion}]`,
          e
        );
      };

      this.request.onupgradeneeded = async (event) => {
        const db = event.target.result;
        await this.createAndInitStore(
          db,
          this.store.conf.storeName,
          this.store.data,
          this.store.conf.uniqueIndex,
          this.store.conf.normalIndex
        );
        // await this.createAndInitStore(db);
        resolve(db);
      };

      this.request.onsuccess = (e) => {
        const db = e.target.result;
        resolve(db);
      };
    });
  };

  // 创建存储桶并初始化数据，默认是自增id
  async createAndInitStore(
    db = this.db,
    storeName = "",
    datas = [],
    uniqueIndex = [],
    normalIndex = []
  ) {
    if (!storeName || !datas) return;
    return new Promise((resolve, rej) => {
      // 自增id
      const store = db.createObjectStore(storeName, {
        keyPath: "id",
        autoIncrement: true,
      });
      // 设置两类索引
      uniqueIndex.forEach((item) => {
        store.createIndex(item, item, { unique: true });
      });
      normalIndex.forEach((item) => {
        store.createIndex(item, item, { unique: false });
      });

      // 初始填充数据
      store.transaction.oncomplete = (e) => {
        const rwStore = this.getCustomRWstore(storeName, db);
        datas.forEach((item) => {
          rwStore.add(item);
        });
        resolve(0);
      };
    });
  }

  // 获取所有数据
  async getAllDatas() {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      const req = rwStore.getAll();
      req.onsuccess = (e) => {
        resolve(req?.result);
      };
    });
  }

  // 添加一条数据
  async addOne(item) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      const req = rwStore.add(item);
      req.onsuccess = () => {
        resolve(true);
      };
      req.onerror = () => {
        rej(false);
      };
    });
  }

  // 根据uid获取一条数据
  async getOne(id = 0) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      const req = rwStore.get(id);
      req.onsuccess = () => {
        resolve(req.result);
      };
    });
  }

  // 查询一条数据， 字段column包含value子串
  async queryOneLike(column, value) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      rwStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = { ...cursor.value };
          if (item[column] && item[column].indexOf(value) > -1) {
            item.id = cursor.key;
            resolve(item);
          }
          cursor.continue();
        } else {
          resolve(false);
        }
      };
    });
  }

  // 查询一条数据， 字段column等于value
  async queryOneEq(column, value) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      rwStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = { ...cursor.value };
          if (item[column] == value) {
            item.id = cursor.key;
            resolve(item);
          }
          cursor.continue();
        } else {
          resolve(false);
        }
      };
    });
  }

  // 更新一条数据
  async updateOne(item) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      const req = rwStore.put(item);
      req.onsuccess = () => {
        resolve(true);
      };
      req.onerror = (e) => {
        console.log(req);
        console.log(e);
        rej(false);
      };
    });
  }

  // 删除一条数据
  async delOne(id) {
    return new Promise((resolve, rej) => {
      const rwStore = this.getCustomRWstore();
      const req = rwStore.delete(id);
      req.onsuccess = () => {
        resolve(true);
      };
      req.onerror = (e) => {
        rej(false);
      };
    });
  }

  // 获取读写权限的存储桶 store。默认是this上挂的storename
  getCustomRWstore(storeName = this.store.conf.storeName, db = this.db) {
    return db.transaction(storeName, "readwrite").objectStore(storeName);
  }

  // 状态值为 done 时表示连接上了。db挂到了this上
  requestState() {
    return this.request.readyState;
  }
  isReady() {
    return this.request.readyState == "done";
  }

  // 关闭数据库链接
  closeDB() {
    this.db && this.db.close();
  }

  static setDBVersion(version) {
    localStorage.setItem("pxoxq-dbv", version);
  }

  static getDBVersion() {
    const v = localStorage.getItem("pxoxq-dbv");
    return v;
  }
}
/* =======================================
    IndexedDB    结束
======================================= */

/* =======================================
    配置数据库表   结束
======================================= */
class ConfigDB {
  static simplifyIdx = false;
  static autoWideMode = false;
  static playerHeight = 700;
  static memoMode = 0;
  static importMode = 0;

  static Keys = {
    simplifyIdx: "simplifyIdx",
    autoWideMode: "autoWideMode",
    playerHeight: "playerHeight",
    memoMode: "memoMode",
    importMode: "importMode",
  };

  static dbConfig = {
    DB_NAME: "bilibili_pxo",
    DB_V: MyIndexedDB.getDBVersion() ?? 2,
    store: {
      conf: {
        storeName: "conf",
      },
    },
  };

  static async connnectDB(func) {
    const myDb = await MyIndexedDB.create(
      this.dbConfig.DB_NAME,
      this.dbConfig.DB_V,
      this.dbConfig.store
    );
    const result = await func(myDb);
    myDb.closeDB();
    return result;
  }

  static async getConf() {
    const res = await this.connnectDB(async (db) => {
      const rrr = db.getOne("bconf");
      return rrr;
    });
    return res;
  }

  static async updateConf(conf) {
    const res = await this.connnectDB(async (db) => {
      const rrr = await db.updateOne(conf);
      return rrr;
    });
    return res;
  }

  static async updateOne(key, val) {
    const res = await this.connnectDB(async (db) => {
      const config = await this.getConf();
      config[key] = val;
      const rrr = db.updateOne(config);
      return rrr;
    });
    return res;
  }

  static async updateSimplifyIdx(val) {
    return await this.updateOne(this.Keys.simplifyIdx, val);
  }

  static async updateAutoWideMode(val) {
    return await this.updateOne(this.Keys.autoWideMode, val);
  }

  static async updatePlayerHeight(val) {
    return await this.updateOne(this.Keys.playerHeight, val);
  }

  static async updateMemoMode(val) {
    return await this.updateOne(this.Keys.memoMode, val);
  }

  static async updateImportMode(val) {
    return await this.updateOne(this.Keys.importMode, val);
  }
}
/* =======================================
    配置数据库表   结束
======================================= */

/*=========================================
   哔站昵称功能对IndexedDB 进行的封装  开始
==========================================*/
class BilibiliMemoDB {
  static dbConfig = {
    DB_NAME: "bilibili_pxo",
    DB_V: MyIndexedDB.getDBVersion() ?? 2,
    store: {
      conf: {
        storeName: "my_friends",
      },
    },
  };

  static async connectDB(func) {
    const db = await MyIndexedDB.create(
      this.dbConfig.DB_NAME,
      this.dbConfig.DB_V,
      this.dbConfig.store
    );
    const result = await func(db);
    db.closeDB();
    return result;
  }

  static async addOne(uid) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.addOne(uid);
      return rrr;
    });
    return res;
  }

  static async getOne(uid) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.getOne(uid);
      return rrr;
    });
    return res;
  }

  static async queryEq(column, value) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.queryOneEq(column, value);
      return rrr;
    });
    return res;
  }

  static async queryLike(column, value) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.queryOneLike(column, value);
      return rrr;
    });
    return res;
  }

  static async getOneByBid(bid) {
    const res = await this.queryEq("bid", bid);
    return res;
  }

  static async getAll() {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.getAllDatas();
      return rrr;
    });
    return res;
  }

  static async updateByIdAndMemo(id, memo) {
    const item = await this.getOne(id);
    item.nick_name = memo;
    const res = await this.updateOne(item);
    return res;
  }

  static async addOrUpdateMany(datas, ignore_mode = true) {
    for (const data of datas) {
      const _item = await this.getOneByBid(data.bid);
      if (_item) {
        if (!ignore_mode) {
          _item.nick_name = data.nick_name;
          _item.bname = data.bname;
          await this.updateOne(_item);
        }
      } else {
        if (!data.bid) continue;
        else {
          const _itm = {
            bid: data.bid,
            bname: data.bname,
            nick_name: data.nick_name,
          };
          await this.addOne(_itm);
        }
      }
    }
    return 1;
  }

  static async updateOne(item) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.updateOne(item);
      return rrr;
    });
    return res;
  }

  static async delByBid(bid) {
    const _item = this.getOneByBid(bid);
    if (_item) {
      return await this.delOne(_item.id);
    } else {
      return false;
    }
  }

  static async delOne(id) {
    const res = await this.connectDB(async (db) => {
      const rrr = await db.delOne(id);
      return rrr;
    });
  }
}
/*=========================================
   哔站昵称功能对IndexedDB 进行的封装  结束
==========================================*/

/* =======================================
    所有数据库表初始化   开始
======================================= */
class DBInit {
  static dbName = "bilibili_pxo";
  static dbV = "1";
  static storeList = [
    {
      name: "B站备注表",
      conf: {
        uniqueIndex: ["bid"],
        normalIndex: ["nick_name"],
        DB_NAME: "bilibili_pxo",
        storeName: "my_friends",
      },
      data: [
      ],
    },
    {
      name: "配置项表",
      conf: {
        DB_NAME: "bilibili_pxo",
        storeName: "conf",
      },
      data: [
        {
          id: "bconf",
          simplifyIdx: false,
          autoWideMode: false,
          playerHeight: 700,
          memoMode: 0,
          importMode: 0,
        },
      ],
    },
  ];

  static async initAllDB() {
    for (let idx = 0; idx < this.storeList.length; idx++) {
      const myDb = await MyIndexedDB.create(
        this.dbName,
        idx * 1 + 1,
        this.storeList[idx]
      );
      MyIndexedDB.setDBVersion(idx * 1 + 1);
      setTimeout(() => {
        myDb.closeDB();
      }, 100);
    }
  }
}
/* =======================================
    所有数据库表初始化   结束
======================================= */

/* =======================================
    菜单UI部分   结束
======================================= */
class BMenu {
  static menuStyle = `
  @media (max-width: 1190px){
    div#pxoxq-b-menu .pxoxq-menu-wrap{
      display: block;
      overflow-y: scroll;
      scrollbar-width: thin;
      height: 340px;
    }
    #pxoxq-b-menu .pxoxq-menu-wrap::-webkit-scrollbar{
      width: 5px;
    }
    #pxoxq-b-menu .pxoxq-menu-wrap::-webkit-scrollbar-thumb{
      background-color: #FC6296;
      border-radius: 6px;
    }
  }

  /* 菜单最外层 */
  #pxoxq-b-menu{
    text-align: initial;
    font-size: 15px;
    z-index: 999;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0px;
    height: 340px;
    padding: 8px 10px;
    background-color: white;
    transition: all .24s linear;
    border-top: 1px solid #c3c3c3;
  }
  #pxoxq-b-menu.pxoxq-hide{
    padding: unset;
    height: 0;
  }
  #pxoxq-b-menu button{
    background-color: #FC6296;
    border: 1px solid white;
    color: white;
    font-size: 13px;
    padding: 1px 6px;
    border-radius: 5px;
  }
  #pxoxq-b-menu button:hover{
    border: 1px solid #c5c5c5;
  }
  #pxoxq-b-menu button:active{
    opacity: .7;
  }
  #pxoxq-b-menu .pxoxq-tag{
    position: absolute;
    width: 24px;
    text-align: center;
    color: white;
    padding: 0px 6px;
    left: 2px;
    top: -21px;
    background-color: #FC6296;
    border-radius: 4px 4px 0 0;
    user-select: none;
    transition: all .3s linear;
  }
  
  #pxoxq-b-menu .pxoxq-tag:hover{
    letter-spacing: 3px;
  }
  #pxoxq-b-menu .pxoxq-tag:active{
    opacity: .5;
  }
  #pxoxq-b-menu .pxoxq-menu-wrap{
    display: flex;
  }
  #pxoxq-b-menu .pxoxq-menu-col {
    height: 340px;
    min-height: 340px;
    overflow-y: scroll;
    scrollbar-width: thin;
  }
  #pxoxq-b-menu .pxoxq-menu-col::-webkit-scrollbar{
    width: 5px;
  }
  #pxoxq-b-menu .pxoxq-menu-col::-webkit-scrollbar-thumb{
    background-color: #FC6296;
    border-radius: 6px;
  }
  #pxoxq-b-menu .pxoxq-menu-wrap .pxoxq-setting-wrap{
    flex-grow: 1;
  }
  #pxoxq-b-menu .setting-row:not(.import-row) {
    padding: 4px 0;
    display: flex;
    gap: 3px;
  }
  #pxoxq-b-menu .setting-row .pxoxq-label{
    font-weight: 600;
    color: rgb(100, 100, 100);
  }
  #pxoxq-b-menu .pxoxq-setting-wrap .setting-box{
    display: flex;
    gap: 22px;
  }
  #pxoxq-b-menu .setting-row .pxoxq-inline-label{
    display: inline-block;
    margin-right: 20px;
  }
  #pxoxq-player-h{
    width: 300px;
  }
  #pxoxq-b-menu .setting-row.memo-mode-row{
    display: flex;
    padding-bottom: 10px;
  }
  #pxoxq-b-menu .setting-item-import{
    display: flex;
    margin-bottom: 10px;
  }
  #pxoxq-b-menu .frd-import-btn{
    margin-left: 40px;
  }
  /* 右边部分 */
  #pxoxq-b-menu .pxoxq-menu-wrap .pxoxq-frd-wrap{
    border-left: 1px solid #d1d1d1;
    padding-left: 10px;
  }
  #pxoxq-b-menu .pxoxq-right-header{
    display: flex;
    padding-bottom: 6px;
    margin-bottom: 5px;
    border-bottom: 1px dotted #b2b2b2;
  }
  #pxoxq-b-menu .pxoxq-right-header .pxoxq-right-title{
    font-size: 18px;
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    color: #4b4b4b;
  }
  /* 右边表格部分 */
  #pxoxq-b-menu .pxoxq-frd-tab{
    white-space: nowrap;
    height: 340px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tbody{
    height: 280px;
    overflow-y: scroll;
    scrollbar-width: thin;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tbody::-webkit-scrollbar{
    width: 4px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tbody::-webkit-scrollbar-thumb{
    background-color: #FC6296;
    border-radius: 5px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-thead{
    font-weight: 600;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tr{
    border-bottom: 1px solid #dadada;
    /* text-align: center; */
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tr .pxoxq-cell{
    display: inline-block;
    text-align: center;
    font-size: 14px;
    padding: 2px 3px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-col-1{
    width: 30px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-col-2{
    width: 120px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-col-3{
    width: 120px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-col-4{
    width: 180px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-col-5{
    width: 100px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-memo-ipt{
    outline: none;
    border: unset;
    text-align: center;
    padding: 2px 3px;
  }
  #pxoxq-b-menu .pxoxq-frd-tab .pxoxq-memo-ipt.active{
    border-bottom: 1px solid #ffb3e3;
    color:#FC6296;
  }
`;

  static wrapId = "pxoxq-b-menu";

  static saveDelay = 200;

  static importJson = "";

  static init() {
    this.injectMemuHtml();
    this.injectStyle();
  }

  static injectMemuHtml() {
    // 参数初始化
    const wrap = $("#pxoxq-b-menu");
    ConfigDB.getConf().then(async (_conf) => {
      const friendTab = await this.genFriendTab();
      const leftMenu = `
<h3>备注模块设置</h3>
<div class="setting-row memo-mode-row">
  <div class="pxoxq-label pxoxq-inline-label">备注显示模式</div>
  <div class="pxoxq-radio-item">
    <input class="pxoxq-memo-mode" ${
      _conf.memoMode == 0 ? "checked" : ""
    } value="0" type="radio" name="memo-mode" id="nope">
    <label for="nope">关闭备注功能</label>
  </div>
  <div class="pxoxq-radio-item">
    <input class="pxoxq-memo-mode" ${
      _conf.memoMode == 1 ? "checked" : ""
    } value="1" type="radio" name="memo-mode" id="nick-first">
    <label for="nick-first">昵称（备注）</label>
  </div>
  <div class="pxoxq-radio-item">
    <input class="pxoxq-memo-mode" ${
      _conf.memoMode == 2 ? "checked" : ""
    } value="2" type="radio" name="memo-mode" id="memo-first">
    <label for="memo-first">备注（昵称）</label>
  </div>
  <div class="pxoxq-radio-item">
    <input class="pxoxq-memo-mode" ${
      _conf.memoMode == 3 ? "checked" : ""
    } value="3" type="radio" name="memo-mode" id="just-memo">
    <label for="just-memo">备注</label>
  </div>
</div>
<div class="setting-row import-row">
  <div class="pxoxq-setting-item setting-item-import">
    <div class="pxoxq-label pxoxq-inline-label">导入数据</div>
    <input class="pxoxq-import-mode" ${
      _conf.importMode == 0 ? "checked" : ""
    } id="ignore-same" value="0" type="radio" checked name="import-mode">
    <label for="ignore-same">跳过重复项</label>
    <input class="pxoxq-import-mode" ${
      _conf.importMode == 1 ? "checked" : ""
    } id="update-same" value="1" type="radio" name="import-mode">
    <label for="update-same">覆盖重复项</label>
    <button class="frd-import-btn" type="button">导入</button>
  </div>
  <div class="pxoxq-setting-item">
    <textarea placeholder="请输入数据..." name="pxoxq-frd-json" id="pxoxq-frd-json" cols="80" rows="10"></textarea>
  </div>
</div>
      `;
      if (wrap && wrap.length > 0) {
        this.flushConfTab();
        this.flushFrdTab();
      } else {
        const _html = `
        <div id="pxoxq-b-menu" class="pxoxq-hide">
        <div class="pxoxq-tag">:)</div>
        <div class="pxoxq-menu-wrap">
          <div class="pxoxq-menu-col pxoxq-setting-wrap">
            ${leftMenu}
          </div>
  
          <div class="pxoxq-frd-wrap">
            <div class="pxoxq-right-header">
              <div class="pxoxq-right-title">昵称数据</div>
              <button class="pxoxq-export-frd-btn" type="button">导出当前数据</button>
            </div>
            <div class="pxoxq-tab-wrap">
              <div class="pxoxq-frd-tab">
                <div class="pxoxq-tr pxoxq-thead">
                    <div class="pxoxq-cell pxoxq-col-1">ID</div>
                    <div class="pxoxq-cell pxoxq-col-2">BilibiliID</div>
                    <div class="pxoxq-cell pxoxq-col-3">昵称</div>
                    <div class="pxoxq-cell pxoxq-col-4">备注</div>
                    <div class="pxoxq-cell pxoxq-col-5">操作</div>
                </div>
                <div class="pxoxq-tbody">
                  ${friendTab}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        `;
        $("body").append(_html);
        this.addListener();
      }
    });
  }

  static async genFriendTab() {
    const friends = await BilibiliMemoDB.getAll();
    let _html = "";

    for (const friend of friends) {
      _html += `
<div class="pxoxq-tr pxoxq-frd-row pxoxq-frd-${friend.id}">
  <div class="pxoxq-cell pxoxq-col-1">${friend.id}</div>
  <div class="pxoxq-cell pxoxq-col-2" title="${friend.bid}">${friend.bid}</div>
  <div class="pxoxq-cell pxoxq-col-3">${friend.bname}</div>
  <div class="pxoxq-cell pxoxq-col-4">
    <input class="pxoxq-memo-ipt pxoxq-memo-ipt-${friend.id}" data-id="${friend.id}"  type="text" value="${friend.nick_name}" readonly>
  </div>
  <div class="pxoxq-cell pxoxq-col-5">
    <button class="pxoxq-memo-edit-btn  pxoxq-memo-edit-btn-${friend.id}" data-id="${friend.id}" type="button">编辑</button>
    <button class="pxoxq-memo-del-btn" data-id="${friend.id}" type="button">删除</button>
  </div>
</div>
      `;
    }
    return _html;
  }

  static flushFrdTab() {
    this.genFriendTab().then((_tabHtml) => {
      $("#pxoxq-b-menu .pxoxq-frd-tab .pxoxq-tbody").html(_tabHtml);
    });
  }

  static flushConfTab() {
    ConfigDB.getConf().then((_conf) => {
      const mmRadios = $(".pxoxq-memo-mode");
      for (const item of mmRadios) {
        if (item.value == _conf.memoMode) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      }
      const modeRadios = $(".pxoxq-import-mode");
      for (const item of modeRadios) {
        if (item.value == _conf.memoMode) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      }
    });
  }

  static injectStyle() {
    GM_addStyle(this.menuStyle);
  }

  static addListener() {
    const wrapIdSelector = `#${this.wrapId}`;

    // 面板展开、折叠
    $("body").on(
      "click",
      wrapIdSelector + " .pxoxq-tag",
      pxoDebounce(this.toggleMenuHandler, this.saveDelay)
    );

    // 备注模式选框
    $("body").on(
      "click",
      ".pxoxq-memo-mode",
      pxoDebounce(this.memoModeHandler, this.saveDelay)
    );

    // 导入数据模式
    $("body").on(
      "click",
      ".pxoxq-import-mode",
      pxoDebounce(this.importModeHandler, this.saveDelay)
    );

    // 导入数据
    $("body").on("click", ".frd-import-btn", this.importFriendHandler);

    // 导出数据
    $("body").on(
      "click",
      ".pxoxq-export-frd-btn",
      pxoDebounce(this.exportFrdHandler, this.saveDelay * 2)
    );

    // 双击比编辑
    $("body").on("dblclick", "input.pxoxq-memo-ipt", this.editMemoHandler);

    // 编辑按钮编辑
    $("body").on(
      "click",
      ".pxoxq-memo-edit-btn",
      pxoDebounce(this.editMemoHandler, this.saveDelay)
    );

    // 保存昵称（更新
    $("body").on(
      "click",
      ".pxoxq-memo-save-btn",
      pxoDebounce(this.updateMemoHandler, this.saveDelay)
    );

    // 删除备注
    $("body").on(
      "click",
      ".pxoxq-memo-del-btn",
      pxoDebounce(this.delMemoHandler, this.saveDelay)
    );
  }

  // 折叠、打开面板
  static toggleMenuHandler() {
    $("#pxoxq-b-menu").toggleClass("pxoxq-hide");
    // 刷新面板数据
    if (
      document
        .getElementById("pxoxq-b-menu")
        .classList.value.indexOf("pxoxq-hide") < 0
    ) {
      BMenu.flushConfTab();
      BMenu.flushFrdTab();
    } else {
    }
  }

  static delMemoHandler() {
    const id = parseInt(this.dataset.id);
    const memo = $(".pxoxq-memo-ipt-" + id).val();
    if (confirm(`是否要删除备注【${memo}】？`)) {
      BilibiliMemoDB.delOne(id);
      $(".pxoxq-frd-tab .pxoxq-frd-" + id).remove();
    }
  }

  static updateMemoHandler() {
    const id = this.dataset.id;
    let editBtn = $(".pxoxq-memo-edit-btn-" + id);
    const memoInput = $(".pxoxq-memo-ipt-" + id);
    // 都需编辑按钮复原
    $(editBtn).text("编辑");
    $(editBtn).removeClass("pxoxq-memo-save-btn");
    memoInput[0].readOnly = true;
    $(memoInput).removeClass("active");
    const val = memoInput[0].value;
    BilibiliMemoDB.updateByIdAndMemo(parseInt(id), val);
  }

  static editMemoHandler() {
    const id = this.dataset.id;
    // pxoxq-memo-ipt-2
    let editBtn = $(".pxoxq-memo-edit-btn-" + id);
    const memoInput = $(".pxoxq-memo-ipt-" + id);
    if (!memoInput[0].readOnly) {
      return;
    }

    // 都需要给编辑按钮变个东西
    $(editBtn).text("保存");
    $(editBtn).addClass("pxoxq-memo-save-btn");

    memoInput[0].readOnly = false;
    $(memoInput).addClass("active");
  }

  // 导出数据
  static exportFrdHandler() {
    BilibiliMemoDB.getAll().then((_datas) => {
      const json_str = JSON.stringify(_datas);
      const dataURI =
        "data:text/plain;charset=utf-8," + encodeURIComponent(json_str);
      const link = document.createElement("a");
      link.href = dataURI;
      link.download = `${DateUtils.getCurrDateTimeStr()}.txt`;
      link.click();
    });
  }

  // 导入数据
  static importFriendHandler() {
    const textNode = $("#pxoxq-frd-json");
    const val = $(textNode).val();
    if (!/\S+/.test(val)) return;
    ConfigDB.getConf().then(async (_conf) => {
      try {
        const datas = JSON.parse(val);
        if (Array.isArray(datas)) {
          const ignore_mode = _conf.importMode == 1 ? false : true;
          await BilibiliMemoDB.addOrUpdateMany(datas, ignore_mode);
          BMenu.flushFrdTab();
          alert("导入成功");
        } else {
          throw Error("数据格式错误！");
        }
      } catch (e) {
        alert("导入失败：" + e);
      }
    });
  }

  static importModeHandler() {
    ConfigDB.updateImportMode(this.value);
  }

  static memoModeHandler() {
    MemoGlobalConf.mode = this.value;
    ConfigDB.updateMemoMode(this.value);
  }
}
/* =======================================
    菜单UI部分   结束
======================================= */

/*............................................................................................
 Memo部分 开始
............................................................................................*/
/* =============================================
   一些配置参数   开始
=============================================*/
const memoClassPrefix = "pxo-memo";
const MemoGlobalConf = {
  mode: 1, // 【模式】 0：昵称替换成备注； 1：昵称(备注)； 2：(备注)昵称
  myFriends: [], // 好友信息列表
  memoClassPrefix,
  fansInputBlurDelay: 280, // 输入框防抖延迟
  fansInputBlurTimer: "",
  fansLoopTimer: "",
  memoStyle: `
  .content .be-pager li{
    z-index: 999;
    position: relative;
  }
  .pxo-frd{    
    color: #3fb9ffd4;
    font-weight:600;
    letter-spacing: 2px;
    border: 1px solid #ff88a973;
    border-radius: 6px;
    background: #ffa9c1a4;
    margin-top:-2px;
    padding: 2px 5px;}
  .h #h-name {
    background: #ffffffbd;
    padding: 5px 10px;
    border-radius: 6px;
    letter-spacing: 3px;
    line-height: 22px;
    font-size: 20px;
    box-shadow: 1px 1px 2px 2px #ffffff40;
    border: 1px solid #fff;
    color: #e87b99;
    overflow: hidden;
    transition:all .53s linear;
  }
  .h #h-name.hide{
    width:0px;
    padding:0px;
    height:0px;
    border:none;
  }
  .h .homepage-memo-input{
    border: none;
    outline:none;
    overflow:hidden;
    padding: 5px 6px;
    border-bottom:2px solid #ff0808;
    width: 230px;
    font-size: 17px;
    line-height: 22px;
    vertical-align: middle;
    background: #ffffffbd;;
    color: #f74979;
    font-weight:600;
    margin-right: 8px;
    transition:all .53s linear;
    border-radius: 5px 5px 0 0;
  }
  .h .homepage-memo-input.hide{
    width: 0px;
    padding: 0;
    border:none;

  }
  .${memoClassPrefix}-setting-box{
    display: inline-block;
    vertical-align:top;
    margin-top:-2px;
    line-height:20px;
    margin-left:18px;
  }
  .${memoClassPrefix}-setting-box div.btn{
    padding:2px 5px;
    user-select:none;
    display:inline-block;
    overflow: hidden;
    letter-spacing:2px;
    background:#e87b99cc;
    border:none;
    border-radius:5px;
    color:white;
    margin:0 3px;
    transition:all .53s linear;
  }
  .${memoClassPrefix}-setting-box div.btn.hide{
    height: 0px;
    width: 0px;
    opacity: 0.2;
    padding:0px;
  }
  .${memoClassPrefix}-setting-box div.btn:hover{
    box-shadow: 1px 1px 2px 1px #80808024;
    outline: .5px solid #e87b99fc;

  }
  .${memoClassPrefix}-setting-box input{
    border: none;
    outline:none;
    overflow:hidden;
    padding: 2px 3px;
    border-bottom:1px solid #c0c0c0;
    width: 190px;
    font-size: 16px;
    line-height: 18px;
    color: #ff739a;
    font-weight:600;
    vertical-align:top;
    transition:all .25s linear;
  }
  .${memoClassPrefix}-setting-box input.hide{
    width:0px;
    padding:0px;
  }
  `,
};
/* =============================================
   一些配置参数   结束
=============================================*/

/* =============================================
   定制日志输出   开始
=============================================*/
class MyLog {
  static prefix = "[BilibiliMemo]";

  static genMsg(msg, type = "") {
    return `${this.prefix} ${type}: ${msg}`;
  }

  static error(msg) {
    console.error(this.genMsg(msg, "error"));
  }

  static warn(msg) {
    console.warn(this.genMsg(msg, "warn"));
  }

  static success(msg) {
    console.info(this.genMsg(msg, "success"));
  }
  static log(msg, ...arg) {
    console.log(this.genMsg(msg), ...arg);
  }
}
/* =============================================
   定制日志输出   结束
=============================================*/

/* =============================================
   html 注入部分   开始
=============================================*/
class BilibiliMemoInjectoin {
  // 个人主页 替换 以及初始化
  static async injectUserHome(bid) {
    const user = await this.getUserInfoByBid(bid);
    elmGetter.get('#h-name').then(uname => {
      if(!uname) return
      let nickName = uname.innerHTML;
      if(user){
        $(uname).html(this.getNameStr(nickName, user.nick_name));
        $(uname).attr("data-id", user.id);
      }
      $(uname).attr("data-bid", bid);
      $(uname).attr("data-bname", nickName);
      // 添加备注模块
      const inputNode = `<input data-bname="${nickName}" data-bid="${bid}" class='${MemoGlobalConf.memoClassPrefix}-input hide homepage-memo-input'/>`
      $(uname).after(inputNode)
    })
  }
  // 个人主页 替换 更新
  static injectOneHomePage(user) {
    if (user) {
      const nickName = $(".h #h-name").attr("data-bname");
      $("#h-name").html(this.getNameStr(nickName, user.nick_name));
      $("#h-name").attr("data-id", user.id);
    }
  }

  // 个人关注、粉丝页替换 以及初始化
  static injectFanList() {
    elmGetter.each(".relation-list > li > div.content > a", async (user) => {
      try {
        let url = user.href;
        let uid = url.split("/")[3];
        const cPrefix = MemoGlobalConf.memoClassPrefix;
        if (!$(user.children).attr("data-bid")) {
          const userInfo = await this.getUserInfoByBid(uid);
          let nickName = $(user.children).html();
          $(user.children).attr("data-bname", nickName);
          $(user.children).attr("data-bid", uid);
          if (userInfo) {
            $(user.children).html(this.getNameStr(nickName, userInfo.nick_name));
            $(user.children).attr("data-id", userInfo.id);
            $(user).addClass("pxo-frd");
            $(user).addClass("pxo-frd-" + uid);
          }
          // 注入备注模块代码
          const memoBlock = `<div class='${cPrefix}-setting-${uid} ${cPrefix}-setting-box'>
            <input data-bname="${nickName}" data-bid='${uid}' class='${cPrefix}-input-${uid} hide'/>
            <div data-bid='${uid}' class='${cPrefix}-btn-bz btn bz-btn-${uid}'>备注</div>
            <div data-bid='${uid}' class='${cPrefix}-btn-cfm op-btn-${uid} btn cfm-btn-${uid} hide'>确认</div>
            <div data-bid='${uid}' class='${cPrefix}-btn-cancel op-btn-${uid} btn cancel-btn-${uid} hide'>取消</div>
            <div data-bid='${uid}' class='${cPrefix}-btn-del op-btn-${uid} btn del-btn-${uid} hide'>清除备注</div>
            </div>`;
          $(user).after(memoBlock);
        }
      } catch (e) {
        MyLog.error(e);
      }
    });
  }

  // 个人关注、粉丝页替换 单个
  static injectOneFans(user, userANode) {
    if (user && userANode) {
      const nickName = $(userANode.children).attr("data-bname");
      $(userANode.children).html(this.getNameStr(nickName, user.nick_name));
      $(userANode.children).attr("data-id", user.id);
      $(userANode).addClass("pxo-frd");
      $(userANode).addClass("pxo-frd-" + user.bid);
    }
  }

  static replaceMemo(uri) {
    /*
    uri 一共有几种形式：
    https://space.bilibili.com/28563843/fans/follow
    https://space.bilibili.com/28563843/fans/follow?tagid=-1
    https://space.bilibili.com/28563843/fans/fans
    https://space.bilibili.com/472118057/?spm_id_from=333.999.0.0
    
    1、换页是页内刷新，需要给页码搞个点击事件
    2、个人页形式跟其他不太一样
    */
    const uType = this.judgeUri(uri);
    // MyLog.success(`类型是：[${uType}]  ${uri}`);
    switch (uType) {
      case "-1":
        MyLog.warn("Uri获取失败");
        break;
      case "+1": //粉丝关注
        BilibiliMemoInjectoin.injectFanList();
        break;
      default: // 个人主页
        BilibiliMemoInjectoin.injectUserHome(uType);
    }
  }

  static judgeUri(uri) {
    /*
    -1    uri为空
    +x    +1：粉丝、关注 | +* 后续
    xxxx  纯数字，个人主页
    */
    if (!uri) return "-1";

    const uri_parts = uri.split("/"); // 0-https 1-'' 2-host 3-bid 4-fans/query 5-fans/follow
    // 这是 space 域下的处理，之后可能扩展到其他更多页面模块
    if (uri_parts[2] && "space.bilibili.com" == uri_parts[2]) {
      // 粉丝、关注列表 【归一类，处理方式一样】
      if (
        uri_parts.length > 4 &&
        uri_parts[4] == "fans" &&
        /(?=fans)|(?=follow)/.test(uri_parts[5])
      ) {
        return "+1";
      }
      // 个人主页
      else {
        return uri_parts[3].split("?")[0];
      }
    }
    return "-1";
  }

  // 根据bid获取用户信息 直接从数据库取吧
  static async getUserInfoByBid(bid) {
    const res = await BilibiliMemoDB.getOneByBid(bid);
    return res;
  }

  // 根据昵称、备注获取最终显示名
  static getNameStr(nickName, remark) {
    // span 标签用于判断是否已经替换过
    if (nickName.indexOf("<span>") > 0) {
      return nickName;
    }
    let res = "";
    if (MemoGlobalConf.mode == 1) {
      res = remark;
    } else if (MemoGlobalConf.mode == 2) {
      res = nickName + `(${remark})`;
    } else if (MemoGlobalConf.mode == 3) {
      res = remark + `(${nickName})`;
    }
    return res + "<span>";
  }

  // 注入css样式到头部
  static injectCSS(css) {
    GM_addStyle(css);
  }
}
/* =============================================
   html 注入部分   结束
=============================================*/

/* =============================================
   通用函数部分   开始
=============================================*/
class BMemoUtils {
  // 关注、粉丝列表页 备注编辑模块 编辑模式 / 正常模式
  static toggleMemoBox(bid, editMode = true) {
    if (editMode) {
      $(`.btn.op-btn-${bid}`).removeClass("hide");
      $(`.${MemoGlobalConf.memoClassPrefix}-input-${bid}`).removeClass("hide");
      $(`.btn.bz-btn-${bid}`).addClass("hide");
    } else {
      $(`.btn.op-btn-${bid}`).addClass("hide");
      $(`.${MemoGlobalConf.memoClassPrefix}-input-${bid}`).addClass("hide");
      $(`.btn.bz-btn-${bid}`).removeClass("hide");
    }
  }

  // 个人主页 编辑模式 / 正常模式
  static toggleUserHomeEditMode(editMode = true) {
    if (editMode) {
      $(".h #h-name").addClass("hide");
      $(".homepage-memo-input").removeClass("hide");
    } else {
      $(".h #h-name").removeClass("hide");
      $(".homepage-memo-input").addClass("hide");
    }
  }

  // 个人空间主页 编辑模式初始化
  static homePageEditModeHandler(bid) {
    this.toggleUserHomeEditMode();
    const inputNode = $(".homepage-memo-input")[0];
    const bName = $(inputNode).attr("data-bname");
    $(inputNode).focus();
    BilibiliMemoDB.getOneByBid(bid).then((user) => {
      if (user) {
        $(inputNode).val(user.nick_name);
      } else {
        $(inputNode).val(bName);
      }
    });
  }

  // 个人空间主页 编辑确认
  static homePageSetMemoHandler(bid) {
    const inputNode = $(".homepage-memo-input")[0];
    const bName = $(inputNode).attr("data-bname");
    const val = $(inputNode).val();
    const val_reg = /\S.*\S/;
    if (val && val_reg.test(val)) {
      const memo = val_reg.exec(val)[0];
      BilibiliMemoDB.getOneByBid(bid).then(async (user) => {
        if (user) {
          if (memo != user.nick_name) {
            user.nick_name = memo;
            user.bname = bName;
            await BilibiliMemoDB.updateOne(user);
            BilibiliMemoInjectoin.injectOneHomePage(user);
          }
          this.toggleUserHomeEditMode(false);
        } else {
          if (memo != bName) {
            user = {
              bid,
              nick_name: memo,
              bname: bName,
            };
            await BilibiliMemoDB.addOne(user);
            user = await BilibiliMemoDB.getOneByBid(bid);
            BilibiliMemoInjectoin.injectOneHomePage(user);
          }
          this.toggleUserHomeEditMode(false);
        }
      });
    }
  }

  // 删除备注
  static delMemoHandler(bid) {
    BilibiliMemoDB.getOneByBid(bid).then(async (_item) => {
      if (_item) {
        if (confirm(`是否删除备注【${_item.nick_name}】?`)) {
          await BilibiliMemoDB.delOne(_item.id);
          $("a.pxo-frd-" + bid).removeClass("pxo-frd");
          const nameSpan = $("a.pxo-frd-" + bid + " span.fans-name");
          $(nameSpan).text(nameSpan[0].dataset.bname);
        }
      }
    });
  }

  // 粉丝、关注页 编辑模式初始化
  static editModeHandler(bid) {
    const inputNode = $(`.${MemoGlobalConf.memoClassPrefix}-input-${bid}`)[0];
    BilibiliMemoDB.getOneByBid(bid).then((user) => {
      const val = $(inputNode).val();
      if (!/\S+/.test(val)) {
        if (user) {
          $(inputNode).val(user.nick_name);
        } else {
          $(inputNode).val($(inputNode).attr("data-bname"));
        }
      }
    });
    this.toggleMemoBox(bid);
    $(inputNode).focus();
  }

  // 粉丝、关注页编辑确认
  static setMemoHandler(bid) {
    const inputNode = $(`.${MemoGlobalConf.memoClassPrefix}-input-${bid}`)[0];
    const val = $(inputNode).val();
    const val_reg = /\S.*\S/;
    const bName = $(inputNode).attr("data-bname");
    if (val_reg.test(val)) {
      const memo = val_reg.exec(val)[0];
      const userANode = $(inputNode).parent().siblings("a")[0];
      BilibiliMemoInjectoin.getUserInfoByBid(bid).then(async (user) => {
        if (user) {
          if (user.nick_name != memo) {
            user.nick_name = memo;
            user.bname = bName;
            await BilibiliMemoDB.updateOne(user);
            BilibiliMemoInjectoin.injectOneFans(user, userANode);
          }
          this.toggleMemoBox(bid, false);
        } else {
          if (memo != bName) {
            user = {
              bid,
              nick_name: memo,
              bname: bName,
            };
            await BilibiliMemoDB.addOne(user);
            user = await BilibiliMemoDB.getOneByBid(bid);
            BilibiliMemoInjectoin.injectOneFans(user, userANode);
          }
          this.toggleMemoBox(bid, false);
        }
      });
    }
  }
}
/* =============================================
   通用函数部分   结束
=============================================*/
/*-----------------初始化 开始-----------------*/
async function BilibiliMemoInit() {
  // 注入样式
  BilibiliMemoInjectoin.injectCSS(MemoGlobalConf.memoStyle);

    // 个人主页双击修改事件
    $('body').on(
      'dblclick',
      `.h #h-name`,
      function(event){
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.homePageEditModeHandler(bid)
      }
    )
  
    // 个人主页搜索框失去焦点事件
    $('body').on(
      'focusout',
      '.homepage-memo-input',
      function(event){
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.homePageSetMemoHandler(bid)
      }
    )
  
    // 粉丝、关注页 备注按钮点击事件：
    $("body").on(
      "click",
      `.${MemoGlobalConf.memoClassPrefix}-setting-box div.${MemoGlobalConf.memoClassPrefix}-btn-bz`,
      function (event) {
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.editModeHandler(bid)
      }
    );
  
    // 删除备注按钮点击事件
    $("body").on(
      "click",
      `.${MemoGlobalConf.memoClassPrefix}-setting-box div.${MemoGlobalConf.memoClassPrefix}-btn-del`,
      function (event) {
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.delMemoHandler(bid)
      }
    )
  
    // 粉丝、关注页确认按钮点击事件
    $("body").on(
      "click",
      `.${MemoGlobalConf.memoClassPrefix}-setting-box .${MemoGlobalConf.memoClassPrefix}-btn-cfm`,
      function (event) {
        clearTimeout(MemoGlobalConf.fansInputBlurTimer)
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.setMemoHandler(bid)
      }
    );
  
    // 粉丝、关注页取消按钮点击事件
    $("body").on(
      "click",
      `.${MemoGlobalConf.memoClassPrefix}-setting-box .${MemoGlobalConf.memoClassPrefix}-btn-cancel`,
      function (event) {
        clearTimeout(MemoGlobalConf.fansInputBlurTimer)
        const bid = event.currentTarget.dataset.bid;
        BMemoUtils.toggleMemoBox(bid, false)
  
      })
  
    // 粉丝、关注页输入框市区焦点事件
    $("body").on(
      "focusout",
      `.${MemoGlobalConf.memoClassPrefix}-setting-box input`,
      function (event) {
        clearTimeout(MemoGlobalConf.fansInputBlurTimer)
        MemoGlobalConf.fansInputBlurTimer = setTimeout(()=>{
          const bid = event.currentTarget.dataset.bid;
          BMemoUtils.toggleMemoBox(bid, false)
        }, MemoGlobalConf.fansInputBlurDelay)
  
      })
}
/*-----------------初始化 结束-----------------*/

/*........................................................................................................................................
 Memo部分 结束
........................................................................................................................................*/

async function flushConf() {
  const _conf = await ConfigDB.getConf();
  MemoGlobalConf.mode = _conf.memoMode;
  return true;
}

/*+++++++++++++++++++++++++++++++++++++
  主程序初始化  开始
+++++++++++++++++++++++++++++++++++++*/
async function bilibiliCustomInit() {
  if (!MyIndexedDB.getDBVersion()) {
    await DBInit.initAllDB();
  }
  // 从数据库获取数据，刷新配置参数
  await flushConf();
  BMenu.init();
  if (MemoGlobalConf.mode == 0) return;
  const uri = window.location.href;
  BilibiliMemoInit().then((r) => {
    BilibiliMemoInjectoin.replaceMemo(uri);
  });
}
/*+++++++++++++++++++++++++++++++++++++
  主程序初始化  结束
+++++++++++++++++++++++++++++++++++++*/


function toNewOne(){
    const newScriptUrl = 'https://scriptcat.org/zh-CN/script-show-page/3059'
    let timeDiff = 2 * 24 * 60 * 60 * 1e3
    const never = localStorage.getItem('neverShow')
    let neverEnd = localStorage.getItem('neverEndTime')
    const curr = new Date().getTime()
    neverEnd = Number(neverEnd)
    if(never == 1 && neverEnd && curr - neverEnd < timeDiff){
        return 
    }
    const dog = document.createElement('dialog')
    dog.style.cssText = `border:none;border-radius:8px;padding:18px;border: 5px solid #E16689;position:fixed;top: 20vh;margin: 0 auto;`
    document.body.appendChild(dog)
    const h = document.createElement('h2')
    h.style.cssText = `color:#E16689;text-align:center;`
    dog.appendChild(h)
    h.innerText = 'B站备注 -- 全新版本来啦！！！！'
    const content = `<div style="font-size: 18px;line-height: 40px;">新版本已完成适配，支持导入这个版本导出的数据（可以从这个版本导出数据，然后导入到新版本）。<br>
    迁移完数据后，可以卸载当前版本，只保留新版本。<br>
    新版本在这里安装：<a target="_blank" style="color:blue;outline:none;" href="${newScriptUrl}">${newScriptUrl}</a>
    </div>`
    dog.insertAdjacentHTML('beforeend', content)
    const btnD = document.createElement('div')
    dog.appendChild(btnD)
    const cfm = document.createElement('button')
    const neverShow = document.createElement('button')
    btnD.appendChild(cfm)
    btnD.appendChild(neverShow)
    btnD.style.cssText = `text-align: right;`
    cfm.innerText = '已知晓'
    neverShow.innerText = '不再展示'
    cfm.style.cssText = `margin-left: 20px;color:white;font-weight:600;font-size: 18px;border:2px solid pink;outline:none;background: #E16689;border-radius:4px;padding: 8px 10px;`
    neverShow.style.cssText= cfm.style.cssText
    dog.showModal()
    cfm.addEventListener('click', function(){
        dog.close()
    })
    neverShow.addEventListener('click', function(){
        dog.close()
        localStorage.setItem('neverShow', 1)
        localStorage.setItem('neverEndTime', new Date().getTime())
    })
}

(function () {
    toNewOne()
  bilibiliCustomInit().then((res) => {
    console.log("init over");
  });
})();
