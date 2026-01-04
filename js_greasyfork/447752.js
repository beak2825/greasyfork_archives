// ==UserScript==
// @name         bilibili history manage B站历史记录持久化并扩展搜索功能
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  B站历史记录持久化存储到浏览器的indexDB数据库中，提供更丰富的搜索功能
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/447752/bilibili%20history%20manage%20B%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%8C%81%E4%B9%85%E5%8C%96%E5%B9%B6%E6%89%A9%E5%B1%95%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/447752/bilibili%20history%20manage%20B%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%8C%81%E4%B9%85%E5%8C%96%E5%B9%B6%E6%89%A9%E5%B1%95%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
/*导入zl-indexdb开源库,并遵守MIT开源协议进行少量修改*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['zl-indexdb'] = factory());
}(this, (function () { 'use strict';

  class IndexDBOperation {

      /**
       * @method getDB
       * @for IndexDBOperation
       * @description 得到IndexDBOperation实例，创建/打开/升级数据库
       * @param  {String} dbName 要创建或打开或升级的数据库名
       * @param  {Number} dbVersion 要创建或打开或升级的数据库版本
       * @param  {Array} objectStores 此数据库的对象仓库（表）信息集合
       * @param  {String} objectStores.objectStoreName  表名
       * @param  {Number} objectStores.type  表示创建数据库或者升级数据库时，这个数据仓库(表)的处理类型（ 0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建）
       * @param  {Object}  objectStores.keyMode  这个表的key的模式，具有两个可选属性：keyPath,autoIncrement,如果都不写那么添加数据时就需要自动手动的指定key
       * @param  {String} objectStores.keyMode.keyPath   表示在添加数据时，从对象类型的值中取一个字段，作为这条记录的键值，如果作为值的对象中不含有此字段，那么就会报错。
       * @param  {Boolean} objectStores.keyMode.autoIncrement   表示自动生成的递增数字作为记录的键值，一般从1开始。
       * @param  {Array} objectStores.indexs  索引数组，每个对象元素都代表了一条设置的索引,{ indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
       * @return  IDBRequest对象
       * @author zl-fire 2021/08/17
       * @example
       * // 初始化时，开始创建或者打开indexDB数据库,objectStores 会在升级函数里面执行
       * let objectStores = [
       * {
       *     objectStoreName: "notes",//表名
       *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
       *     keyMode:  { autoIncrement: true, keyPath: 'recordID' },//key的模式: 【keyPath: 'recordID' 表示指定recordID为主键】， 【autoIncrement: true 表示设置主键key自动递增（没有指定具体主键的情况下，主键字段名默认为key）】，【两者可以同存，也可以只存在一个，甚至都不存在】
       *         { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
       *         { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
       *         { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
       *     ]
       * },
       * {
       *     objectStoreName: "users",//表名
       *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
       *     keyMode: { keyPath: 'keyword' },//key的模式，使用时直接设置就可
       *     indexs: [
       *         { indexName: "keywordIndex", fieldName: "keyword", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
       *     ]
       * }
       * ]
       * window.DB = new IndexDBOperation("taskNotes", 1, objectStores); //如果版本升级，请刷新下页面在执行升级操作
       */
      constructor(dbName, dbVersion, objectStores) {
          //先检查数据是否传入
          if (!(dbName && dbVersion && objectStores)) {
              console.error("dbName, dbVersion, objectStores参数都为必填项！"); return;
          }
          this.dbName = dbName;
          this.dbVersion = dbVersion;
          this.objectStores = objectStores;
          this.db = null;//数据库默认为null
          this.getDB();//得到数据库对象：this.db = 数据库对象;,这里可以不用await进行等待，因为后续会使用示例对象进行操作，并且还会判断db是否存在
      }

      /**
      * @method createObjectStores
      * @for IndexDBOperation
      * @description 创建对象仓库的函数
      * @param  {Object} db  indexDB数据库的对象
      * @param  {Object}  obj 此数据库的 对象仓库（表）相关信息，包含表名，keyMode，索引集合
      * @return {void}  无返回值
      * @author zl-fire 2021/08/17
      * @example
      * db: DB,
      * obj: {
      *     objectStoreName: "notes",//表名
      *     type: 1,//0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
      *     keyMode:  { autoIncrement: true, keyPath: 'recordID' },//key的模式，使用时直接设置就可
      *     indexs: [
      *         { indexName: "keyIndex", fieldName: "key", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
      *         { indexName: "emailIndex", fieldName: "email", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
      *         { indexName: "doc_typeIndex", fieldName: "doc_type", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
      *     ]
      * }
       */
      async createObjectStores(db, obj) {
          let store = db.createObjectStore(obj.objectStoreName, obj.keyMode);
          if (obj.indexs && obj.indexs instanceof Array) {
              obj.indexs.forEach(ele => {
                  store.createIndex(ele.indexName, ele.fieldName, ele.only); //索引名，字段名，索引属性值是否唯一
              });
          }
      }

      /**
       * 作用：创建/打开/升级数据库，
       * @method getDB
       * @for IndexDBOperation
       * @description 此方法自动将thid.db赋值为数据库对象
       * @return void
       */
      async getDB() {
          let { dbName, dbVersion, objectStores } = this;
          let _this = this;
          return new Promise(function (resolve, reject) {
              let request = window.indexedDB.open(dbName, dbVersion);
              request.onerror = function (event) {
                  console.log("数据库", dbName, "创建/打开失败！");
                  reject({
                      state: false,//失败标识
                      mes: "数据库" + dbName + "创建/打开失败！"
                  });
              };
              request.onsuccess = function (event) {
                  console.log("数据库", dbName, "创建/打开成功，拿到数据库对象了！");
                  _this.db = request.result;
                  resolve({
                      state: true,//成功标识
                  });
              };
              request.onupgradeneeded = function (event) {
                  console.log("数据库", dbName, "版本变化了！");
                  let db = event.target.result; //event中包含了数据库对象
                  //创建所有指定的表
                  objectStores.forEach(obj => {
                      switch (obj.type) {
                          case 0: //表示把已存在的删除，然后重新创建
                              if (db.objectStoreNames.contains(obj.objectStoreName)) {
                                  db.deleteObjectStore(obj.objectStoreName);
                              }
                              _this.createObjectStores(db, obj); //开始创建数据
                              break;
                          case 1: //表示如果不存在才重新创建
                              if (!db.objectStoreNames.contains(obj.objectStoreName)) {
                                  _this.createObjectStores(db, obj); //开始创建数据
                              }
                              break;
                          case 2: //表示只删除，不再进行重新创建
                              if (db.objectStoreNames.contains(obj.objectStoreName)) {
                                  db.deleteObjectStore(obj.objectStoreName);
                              }
                              break;
                      }
                  });

              };
          })
      }

      /**
       * 作用：给对象仓库（表）添加数据，可添加一条，也可批量添加多条，
       * @method addData
       * @for IndexDBOperation
       * @param  {Array} stores  数据要插入到那个对象仓库中去,如["hello"]，类型为数组是为了后面好扩展新功能
       * @param  {Object|Array} data  要添加的数据,对象或对象数组
       * @return {boolean} true:添加成功，false：添加失败
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //==============创建数据仓库时指定了keypath的模式==============
       *
       * //添加一条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
       * let res = await DB.addData(["hello"], { name: "zs", age: 18 });
       *
       * //添加多条数据(添加的数据中包含了key,或者key会自动生成并自动递增)
       * let res2 = await DB.addData(["hello"], [
       * { name: "zss1", age: 18 },
       * { name: "zsd2", age: 18 },
       * { name: "zs3", age: 18 },
       * { name: "zsf4", age: 20 }
       * ]);
       *
       * //==============创建数据仓库时没有指定keypath的模式==============
       *
       * //添加一条数据(需要手动传入指定的key)
       * let res = await DB.addData(["hello"], { name: "zs", age: 18, thekeyName:"id" });
       *
       * //添加多条数据添加多条数据(需要手动传入指定的key：thekeyName)
       * let res2 = await DB.addData(["hello"], [
       * { name: "zss1", age: 18, thekeyName:"id1"  },
       * { name: "zsd2", age: 18, thekeyName:"id2" },
       * { name: "zs3", age: 18 , thekeyName:"id3" },
       * { name: "zsf4", age: 20 , thekeyName:"id4" }
       * ]);
       **/
      async addData(stores, data) {
          let _this = this;
          return new Promise(async function (resolve) {
              try {
                  //先检查数据是否传入
                  if (!(stores && data)) {
                      console.error("stores, data，参数都为必填项！"); return;
                  }
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  //创建事物
                  let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                  let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                  //然后在判断要插入的数据类型：如果是数组，则循环添加插入
                  if (data instanceof Array) {
                      let resArr = [];
                      data.forEach(obj => {
                          let res;
                          if (obj.thekeyName) {
                              let key=obj.thekeyName;
                              delete obj.thekeyName;
                              res = store.add(obj, key);
                          }
                          else {
                              res = store.add(obj);
                          }
                          res.onsuccess = function (event) {
                              resArr.push('数据添加成功');
                              if (resArr.length == data.length) {
                                  resolve(true);
                              }
                          };
                          res.onerror = function (event) {
                              console.error(event);
                              resolve(false);
                          };
                      });

                  }
                  else {
                      let res;
                      if (data.thekeyName) {
                          // 表示用户在创建数据仓库时，没有设置keypath,所以添加数据时需要手动的指定
                          let key=data.thekeyName;
                          delete data.thekeyName;
                          res = store.add(data, key);
                      }
                      else {
                          res = store.add(data);
                      }
                      res.onsuccess = function (event) {
                          resolve(true);
                      };
                      res.onerror = function (event) {
                          resolve(false);
                          console.error(event);
                      };
                  }
              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })
      }

      /**
       * @method queryBykeypath
       * @for IndexDBOperation
       * @description 通过keypath向对象仓库（表）查询数据，无参数则查询所有，
       * @param {Array}  stores  对象仓库数组，但是只取第一个对象仓库名
       * @param {String}  keypath  查询条件,keypath
       * @return {Object} 查询结果
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //从hello表中查询主键（keypath）为5的单条数据
       * let res9 = await DB.queryBykeypath(['hello'],5)
       *
       * //从hello表中查询所有数据
       * let res10 = await DB.queryBykeypath(['hello'])
       **/
      async queryBykeypath(stores, keypath) {
          let _this = this;
          return new Promise(async function (resolve) {
              try {
                  //先检查数据是否传入
                  if (!stores) {
                      console.error("stores参数为必填项！"); return;
                  }
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  var transaction = _this.db.transaction(stores, 'readwrite');
                  var store = transaction.objectStore(stores[0]);
                  if (keypath) {//查询单条数据
                      //从stores[0]表中通过keypath查询数据
                      var request = store.get(keypath);
                      request.onsuccess = function (e) {
                          var value = e.target.result;
                          resolve(value);
                      };
                  }
                  else {  //查询所有数据
                      let arr = [];
                      store.openCursor().onsuccess = function (event) {
                          var cursor = event.target.result; //游标：指向表第一条数据的指针
                          if (cursor) {
                              arr.push(cursor.value);
                              cursor.continue();
                          } else {
                              // console.log('没有更多数据了！');
                              resolve(arr);
                          }
                      };
                  }

              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })
      }

      /**
       * 作用：通过索引index向对象仓库（表）查询数据,不传查询参数就查询所有数据
       * @method queryByIndex
       * @for IndexDBOperation
       * @param {Array} stores 对象仓库数组，但是只取第一个对象仓库名
       * @param {Object} indexObj 查询条件,索引对象，例：{name:"",value:"",uni:true},uni表示索引是否唯一，true唯一，false不唯一
       * @param {Object[]} where 在基于索引查出的数据中进一步筛选。对象数组 [{key,value,opt:"=="},{key,value,opt}] opt为操作符
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //从hello表中查询nameIndex为zs3的单条数据
       * let res11 = await DB.queryByIndex(['hello'],{name:"nameIndex",value:"zs3",uni:true})
       *
       * //从hello表中查询ageIndex为18的多条数据
       * let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"})
       *
       * //从hello表中查询ageIndex为18的多条数据，然后传入where进一步查询
       * let res12 = await DB.queryByIndex(['hello'],{name:"ageIndex",value:"18"},[{key:"sex",value:'男',opt:"=="}])
       **/
      async queryByIndex(stores, indexObj, where ,ps=1000) {
          let _this = this;
          return new Promise(async function (resolve) {
              try {
                  //先检查数据是否传入
                  if (!stores) {
                      console.error("stores参数为必填项！"); return;
                  }
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  var transaction = _this.db.transaction(stores, 'readwrite');
                  var store = transaction.objectStore(stores[0]);
                  if (indexObj) {//按索引查询数据
                      // 如果索引时唯一的
                      if (indexObj.uni) {
                          var index = store.index(indexObj.name);
                          index.get(indexObj.value).onsuccess = function (e) {
                              var v = e.target.result;
                              resolve(v);
                          };
                      }
                      // 如果索引是不唯一的
                      else {
                          let arr = [];
                          var index = store.index(indexObj.name);
                          var request = index.openCursor(IDBKeyRange.upperBound(indexObj.value),'prev');/* 这里迎合需求改掉了*/
                          var count = 0
                          request.onsuccess = function (e) {
                              var cursor = e.target.result;
                              if (cursor&&count<ps) {
                                  var v = cursor.value;
                                  arr.push(v);
                                  cursor.continue();
                                  count++
                              }
                              else {
                                  // 如果还需要进一步筛选(全部为且操作)
                                  if (where) {
                                      let arr1 = arr.filter(ele => {
                                          let flag = true;
                                          // 只要有一个条件不符合，此条数据就过滤掉
                                          for (let i = 0; i < where.length; i++) {
                                              let filterObj = where[i];
                                              let val = ele[filterObj.key];
                                              if (!val) val = "";
                                              if (typeof val == 'string') val = val.trim();
                                              switch (filterObj.opt) {
                                                  case "==":
                                                      flag = (val == filterObj.value);
                                                      break;
                                                  case "===":
                                                      flag = (val === filterObj.value);
                                                      break;
                                                  case "<":
                                                      flag = (val < filterObj.value);
                                                      break;
                                                  case "<=":
                                                      flag = (val <= filterObj.value);
                                                      break;
                                                  case ">":
                                                      flag = (val > filterObj.value);
                                                      break;
                                                  case ">=":
                                                      flag = (val >= filterObj.value);
                                                      break;
                                                  case "!=":
                                                      flag = (val != filterObj.value);
                                                      break;
                                                  case "!==":
                                                      flag = (val !== filterObj.value);
                                                      break;
                                                  case "include": //包含操作
                                                      flag = (val.includes(filterObj.value));
                                                      break;
                                                  case "beIncluded": //包含操作
                                                      flag = (filterObj.value.includes(val));
                                                      break;
                                                  case "function":  //给定函数操作
                                                      flag = filterObj.value(ele)
                                                      break;
                                                  default: break;
                                              }
                                              if (!flag) {
                                                  break;
                                              }
                                          }
                                          return flag;
                                      });
                                      resolve(arr1);
                                  }
                                  else resolve(arr);
                              }
                          };
                      }
                  }
                  else {  //查询所有数据
                      let arr = [];
                      store.openCursor().onsuccess = function (event) {
                          var cursor = event.target.result; //游标：指向表第一条数据的指针
                          if (cursor) {
                              arr.push(cursor.value);
                              cursor.continue();
                          } else {
                              // console.log('没有更多数据了！');
                              resolve(arr);
                          }
                      };
                  }

              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })
      }

      /**
       * 作用：修改对象仓库数据，不存在就创建
       * @method updateData
       * @for IndexDBOperation
       * @param {Array} stores 要修改的对象仓库
       * @param {any} data 要修改的数据
       * @return {boolean}  true:修改成功，false：修改失败
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //======================主键本身就是数据元素中的一个字段：recordID===========
       * //修改单条数据
       * let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 });
       *
       * //批量修改数据
       * let res4 = await DB.updateData(["hello"], [
       * { name: "zss111111", age: 180, recordID: 21 },
       * { name: "zss1222222", age: 180, recordID: 22 },
       * { name: "zss1333333", age: 180, recordID: 23 }
       * ]);
       *
       * //======================主键为手动指定的字段thekeyName，不存在于数据仓库结构中===========
       *
       * //修改单条数据
       *  let res3 = await DB.updateData(["hello"], { name: "111", age: 111, recordID: 1 , thekeyName:1 } );
       *
       * //批量修改数据
       * let res4 = await DB.updateData(["hello"], [
       * { name: "zss111111", age: 180, recordID: 21 , thekeyName:2 },
       * { name: "zss1222222", age: 180, recordID: 22 , thekeyName:3 },
       * { name: "zss1333333", age: 180, recordID: 23 , thekeyName:4 }
       * ]);
       *
       *
       **/
      async updateData(stores, data ) {
          let _this = this;
          return new Promise(async function (resolve, reject) {
              try {
                  //先检查数据是否传入
                  if (!(stores && data)) {
                      console.error("stores, data，参数都为必填项！"); return;
                  }
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  //创建事物
                  let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                  let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                  //然后在判断要插入的数据类型：如果是数组，则循环添加插入
                  if (data instanceof Array) {
                      let resArr = [];
                      data.forEach(obj => {
                          let res;
                          // 如果是手动指定thekeyName字段的值为主键
                          if (obj.thekeyName) {
                              let key = obj.thekeyName;
                              delete obj.thekeyName;
                              res = store.put(obj, key);
                          }
                          else {
                              res = store.put(obj);
                          }
                          res.onsuccess = function (event) {
                              resArr.push('数据更新成功');
                              if (resArr.length == data.length) {
                                  resolve(true);
                              }
                          };
                          res.onerror = function (event) {
                              resolve(false);
                              console.error(event);

                          };
                      });

                  }
                  else {
                      let res;
                      let obj = data;
                      // 如果是手动指定thekeyName字段的值为主键
                      if (obj.thekeyName) {
                          let key = obj.thekeyName;
                          delete obj.thekeyName;
                          res = store.put(obj, key);
                      }
                      else {
                          res = store.put(obj);
                      }
                      res.onsuccess = function (event) {
                          resolve(true);
                      };
                      res.onerror = function (event) {
                          resolve(false);
                          console.error(event);
                      };
                  }
              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })

      }

      /**
       * 作用：删除对象仓库数据，
       * @method deleteData
       * @for IndexDBOperation
       * @param {Array} stores 要删除的对象仓库
       * @param {number|string|Array} data 要删除的数据的key，或者批量key的集合
       * @return {boolean}  true:删除成功，false：删除失败
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //删除主键为23的数据
       * let res5 = await DB.deleteData(["hello"], [23]);
       *
       * //删除表的所有数据
       * let res6 = await DB.deleteData(["hello"]);
       **/
      async deleteData(stores, data) {
          let _this = this;
          return new Promise(async function (resolve, reject) {
              try {
                  //先检查数据是否传入
                  if (!stores) {
                      console.error("stores参数为必填项！"); return;
                  }
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  //创建事物
                  let transaction = _this.db.transaction(stores, "readwrite"); //以可读写方式打开事物，该事务跨越stores中的表（object store）
                  let store = transaction.objectStore(stores[0]); //获取stores数组的第一个元素对象
                  //如果未传入data参数，则删除此对象仓库所有的数据
                  if (!data) {
                      store.clear();
                  }
                  //如果是数组，则循环删除
                  else if (data instanceof Array) {
                      let resArr = [];
                      data.forEach(obj => {
                          let res = store.delete(obj);
                          res.onsuccess = function (event) {
                              resArr.push('数据删除成功');
                              if (resArr.length == data.length) {
                                  resolve(true);
                              }
                          };
                          res.onerror = function (event) {
                              resolve(false);
                              console.error(event);

                          };
                      });

                  }
                  //如果是单个值，直接删除
                  else {
                      let res = store.delete(data);
                      res.onsuccess = function (event) {
                          resolve(true);
                      };
                      res.onerror = function (event) {
                          resolve(false);
                          console.error(event);
                      };
                  }
              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })

      }

      /**
       * 作用：关闭数据链接，
       * @method close
       * @for IndexDBOperation
       * @return {boolean}  true:成功，false：失败
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //关闭数据库链接(当数据库的链接关闭后，对他的操作就不再有效)
       * let res7 = await DB.close();
       **/
      async close() {
          let _this = this;
          return new Promise(async function (resolve, reject) {
              try {
                  //  * 逻辑：先判断数据库是否已经被创建
                  if (_this.db === null) {
                      await _this.getDB();
                  }
                  _this.db.close();
              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })
      }

      /**
       * 作用：删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
       * @method deleteDataBase
       * @for IndexDBOperation
       * @author zl-fire 2021/08/17
       * @example
       * //如果版本升级，请下刷新下页面在执行升级操作
       * let DB = new indexDBOperation("testDB4", 1, objectStores);
       *
       * //删除数据库，如果没传参就删除本身数据库，否则删除指定数据库
       * let res8 = await DB.deleteDataBase();//删除后，可能要刷新下才能看到application中indexdb数据库的变化
       **/
      async deleteDataBase(name) {
          name = name ? name : this.dbName;
          return new Promise(async function (resolve, reject) {
              try {

                  window.indexedDB.deleteDatabase(name);
                  resolve(true);
              }
              catch (err) {
                  resolve(false);
                  console.error(err);
              }
          })

      }
  }

  return IndexDBOperation;

})));






(function() {

    var possibleNextData
    var pageIndex = -1
    var argumentsInStorage = sessionStorage.getItem('arguments')
    /*
    劫持XHR为本地数据库数据
    */
    const xhrOpen = XMLHttpRequest.prototype.open;
if(document.location.pathname=='/account/history'){
        console.log('ok')
    XMLHttpRequest.prototype.open = function() {
      if (arguments[1].includes("https://api.bilibili.com/x/web-interface/history")) {
        const xhr = this;
        const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
        Object.defineProperty(xhr, 'responseText', {
          get: () => {
            let result = getter.call(xhr);
            result_json = JSON.parse(result)
            //result_json.data.list[0].title = '劫持后的数据'
            result_json = possibleNextData||result_json
            result = JSON.stringify(result_json)
            if(pageIndex==-1){
                result = sessionStorage.getItem('frontTwenty')
                return result;
            }
            if(argumentsInStorage != ''){
                result = JSON.stringify(possibleNextData)
                return result
            }


          }
        });
      }
      return xhrOpen.apply(this, arguments);
    };
}
    // Your code here...
    var whole_data = undefined
    setInterval(()=>{
        newIndex = getPageIndex()-1
        if(newIndex != pageIndex ){
            pageIndex = newIndex
            updatePossibleNextData()
        }
    },500)
    setTimeout(async()=>{
        await updatePossibleWholeData()
        await updatePossibleNextData()
        },3000)
    setTimeout(()=>{jQuery('#loading').hide()},4000)
    window.onload = async function(){
      await initMyDB()
      await navigator.storage.persist()
      if(document.location.pathname != "/account/history"){
       list = await getNewHistory()
       await updateMyDB(list)
       setInterval(()=>{collect_info()},2000)
       await updateInfoToDB()

       }
          /*来点UI*/
        GM_addStyle('.btnControl{background-color:#1E90FF;position:relative}')
        GM_addStyle('.controlArea{position:fixed;left:50%;top:50%;transform: translate(-50%, -50%);width:450px;height:300px;z-index:999;padding:0 10px;}')
        GM_addStyle(`
        #loading{
            position:fixed;left:50%;top:20%;
            color:#7FFFD4;font-size:15px;font-weight:500;
            }
        .controlArea input{
            max-width:40px;
        }
        .controlArea fieldset:nth-child(2) input{
            max-width:100px;
        }
        fieldset{
            padding:5px;
           margin:10px;
        }
        .bigBtn{
            height:45px;
            position:relative;
         }
        .bigBtn button{
            position: absolute;
            top: 50%; left: 50%;
            background: #b4a078;
            color: white;
            padding: .3em 1em .5em;
            border-radius: 3px;
            box-shadow: 0 0 .5em #b4a078;
            transform: translate(-50%, -50%);
        }
        .controlArea{
            display:none;
            background-color:#6495EDDD;
        }
        `)
        let showControl = '<button class="btnControl">扩展功能</button><a id="loading" >查找数据中</a>'
        let controlArea = '<div class="controlArea"></div>'
        let timeInput = `<fieldset>
        <legend>观看情况筛选</legend>
        <div>在<input></input>日<input></input>小时前观看的视频</div>
        <div>观看设备是：
        <input type="checkbox" name="from" value="phone" checked>手机端</input>
        <input type="checkbox" name="from" value="web" checked>网页端</input>
        <input type="checkbox" name="from" value="other" checked>其他</input>
        </div>
        </fieldset>`
        let keyWordInput = `
        <fieldset>
        <legend>视频关键词搜索</legend>
        <input></input>标题关键词搜索(支持多个关键词，如"空洞|速通")</div><br>
        <input type="checkbox" name="plus" value="plus" false>关键词搜索范围扩展到标签、up主名称、简介（仅适用于web端观看）</input><br>
        <input type="checkbox" name="plus" value="commentPlus" false>扩展到热评（仅web端）</input>
        </fieldset>`
        let watchFrom = `
        <fieldset><legend>视频信息筛选</legend>
        <div>视频长度大于<input></input>分钟且小于<input></input>分钟/<div>
        <div>视频类型：
        <input type="checkbox" name="business" value="archive" checked>稿件</input>
        <input type="checkbox" name="business" value="pgc" checked>番剧</input>
        <input type="checkbox" name="business" value="live" checked>直播</input>
        <input type="checkbox" name="business" value="article" checked>文章</input>
        </div>
        </fieldset>`
        let submitBtn = '<div class="bigBtn"><button>提交</button></div>'
        jQuery('.b-head-search').before(showControl,controlArea)
        jQuery('.controlArea').append(timeInput,keyWordInput,watchFrom,submitBtn)
        jQuery('.btnControl').click(function(){
            jQuery('.controlArea').toggle()
        })
        jQuery('.bigBtn').click(function(){
            let day = jQuery('.controlArea fieldset:nth-child(1) div input:nth-child(1)').val()
            let hour = jQuery('.controlArea fieldset:nth-child(1) div input:nth-child(2)').val()
            let keyWord = jQuery('.controlArea fieldset:nth-child(2) input:nth-child(2)').val()
            let durationStart = jQuery('.controlArea fieldset:nth-child(3) div input:nth-child(1)').val()
            let durationEnd = jQuery('.controlArea fieldset:nth-child(3) div input:nth-child(2)').val()
            let keyWordPlus = false
            let commentPlus = false
            let fromList = []
            let businessList = []
            jQuery("input[name=from]:checked").each(function(){
                fromList.push(this.value);
            });
            jQuery("input[name=business]:checked").each(function(){
                businessList.push(this.value);
            });
            jQuery("input[name=plus]:checked").each(function(){
                if(this.value == 'plus'){
                    keyWordPlus = true
                }
                if(this.value == 'commentPlus'){
                    commentPlus = true
                }
            });
            searchDBWithForm(day,hour,keyWord,fromList,businessList,keyWordPlus,commentPlus,durationStart,durationEnd)
        })

    }
   /* 提供前20条数据用于初次渲染*/
    async function searchDBWithForm(day,hour,keyWord,fromList,businessList,keyWordPlus,commentPlus,durationStart,durationEnd){
        let [query1,query2] = queryCreate(arguments)
        let res = await searchDB(query1,query2,ps=50000)
        frontTwenty =  packingHistory(res,0)
        sessionStorage.setItem('frontTwenty',JSON.stringify(frontTwenty))
        sessionStorage.setItem('arguments',JSON.stringify(arguments))
        window.location.reload()
    }
    /* 加载接下来的20条数据 ,*/
    async function updatePossibleNextData(){
       console.log('I want to update possibleNextData with loading,with the whole_data is' + typeof(whole_data))
    if(!whole_data){
       let arg = JSON.parse(argumentsInStorage)
       let [query1,query2] = queryCreate([arg[0],arg[1],arg[2],arg[3],arg[4],arg[5],arg[6],arg[7],arg[8]])
      let search = await searchDB(query1,query2,ps=50000)
      possibleNextData = packingHistory(search,20*((pageIndex?pageIndex:0)+1))
     }
    else{
        possibleNextData = packingHistory(whole_data,20*((pageIndex?pageIndex:0)+1))
     }
     console.log('Next 20 may be',possibleNextData)
    }
   /*加载得到数据库中所有符合条件的数据 */
    async function updatePossibleWholeData(){
        let arg = JSON.parse(argumentsInStorage)
        let [query1,query2] = queryCreate([arg[0],arg[1],arg[2],arg[3],arg[4],arg[5],arg[6],arg[7],arg[8]])
       whole_data= await searchDB(query1,query2,ps=500000)
       console.log('whole_data now loaded successfully',whole_data)
    }




})();

/*生成数据库查询的参数 */
function queryCreate(args){
    let [day,hour,keyWord,fromList,businessList,keyWordPlus,commentPlus,durationStart,durationEnd] = args
    let seconds = 0
    if(day != '') {seconds += 60*60*24*parseInt(day)}
    if(hour != ''){seconds += 60*60*parseInt(hour)}
    console.log(day,hour,keyWord,fromList,businessList,keyWordPlus)
    let query1 = {name:'viewAtIndex',value:parseInt(+new Date()/1000)-seconds}


    let query2 = []
    if(fromList.length>0){
        let arr = []
        if(fromList.includes('phone')){
            arr = arr.concat([1,3,5,7])
        }
        if(fromList.includes('web')){
            arr = arr.concat([2])
        }
        if(fromList.includes('other')){
            arr = arr.concat([4,6,8,9,33,0])
        }
        query2.push({key:'dt',value:arr,opt:'beIncluded'})
    }
    if(businessList.length>0){
        query2.push({key:'business',value:businessList,opt:'beIncluded'})
    }
    function plusFunction(ele){
        let resFlag = false
        let checkString = ele.title
        if(keyWordPlus){checkString = checkString +  ele.author_name + ele.tags + ele.des }
        if(commentPlus){checkString = checkString + ele.comments }
        if(!keyWord.includes('|')){
            if(checkString.includes(keyWord)){
                resFlag = true
            }
        }else{
            let keyArr = keyWord.split('|')
            for(let i=0;i<keyArr.length;i++){
                resFlag = checkString.includes(keyArr[i])
                if(!resFlag) {return false}
            }
        }
        return resFlag
    }
    if(keyWord != ''){
        query2.push({key:'business',value:plusFunction,opt:'function'})
    }
    if(durationStart!=''){
        query2.push({key:'duration',value:durationStart*60,opt:'>'})
    }
    if(durationEnd!=''){
        query2.push({key:'duration',value:durationEnd*60,opt:'<'})
    }
    console.log('queryCreate Function',args,query1,query2)
    return [query1,query2]
}
/*
B站的历史记录api来更新最新的历史数据到数据库
*/
async function getNewHistory(){
  var wholeList = []
  var page = await getHistoryApi(0,0,'')
  console.log(page)
  wholeList = wholeList.concat(page.data.list)
  stopFlag = await ifExistInDB(page.data.list)
  for(let i=0;i<20&&!stopFlag;i++){
    cursor = page.data.cursor
    page = await getHistoryApi(cursor.max,cursor.view_at,cursor.business)
    wholeList = wholeList.concat(page.data.list)
    stopFlag = await ifExistInDB(page.data.list)
    if(stopFlag){
      break
    }
  }
  return wholeList
}
/* B站api调用 */
function getHistoryApi(max,view_at,business){
let myPromise = new Promise(function(resolve,reject){
  jQuery.support.cors = true;
  jQuery.ajax({
            url: `https://api.bilibili.com/x/web-interface/history/cursor?max=${max}&view_at=${view_at}&business=${business}`,
            type: "get",
            dataType: "json",
            xhrFields: { withCredentials: true },
            success: function(res) {
                console.log(res)
                resolve(res)
              }
            })
 })
 return myPromise
}
/* 防止过多调用api */
async function ifExistInDB(list){
    let data = {}
    for(let i=0;i<list.length;i++){
      data = await getMyDBById(list[i].history.oid)
      if(data&&data.view_at==list[i].view_at){
        return true
      }
    }
    return false
}
/* 将数据库数据包装成xhr结果的格式 */
function packingHistory(list,i){
    let listCut = list.slice(i,i+20)
    if(listCut.length==0){
        return []
    }
    let res = {code:0,ttl:1,message:'0',data:{tab:[{type: "archive", name: "视频"}, {type: "live", name: "直播"}, {type: "article", name: "专栏"}]}}
    res.data.list = listCut
    last = listCut[listCut.length-1]
    res.data.cursor = {
      business:last.history.business,
      max:last.history.oid,
      ps:20,
      view_at:last.view_at
    }
    return res
}
/*
处理一些页面的基本信息
*/
function getPageIndex(){
    return Math.ceil(jQuery('.history-list').children().length/20)
}
/*
通过开源库操作indexDB
*/
async function initMyDB(){
  let IndexDBOpt=window["zl-indexdb"];
  let dbName='bilibiliHistoryDB';
  let dbVersion=1;
  let objectStores = [
    {
        objectStoreName: "history",//表名
        type: 1, //0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
        keyMode:  { keyPath: 'oid' },
        indexs: [ // 创建索引信息
            { indexName: "oidIndex", fieldName: "oid", only: { unique: false } },//索引名，字段名，索引属性值是否唯一
            { indexName: "viewAtIndex", fieldName: "view_at", only: { unique: false } },
            { indexName: "titleIndex", fieldName: "title", only: { unique: false } },
            { indexName: "businessIndex", fieldName: "business", only: { unique: false } },
        ]
    },
    {
        objectStoreName: "storage",//表名
        type: 1, //0:表示把已存在的删除，然后重新创建。 1：表示如果不存在才重新创建，2：表示只删除，不再进行重新创建
        keyMode:  { keyPath: 'bvid' },
        indexs: [ // 创建索引信息

        ]
    }
  ]
  window.DB = new IndexDBOpt(dbName, dbVersion, objectStores);
}
async function updateMyDB(list){
  for(let i=0;i<list.length;i++){
    list[i] = {...list[i],...list[i].history}
    let res = await getMyDBById(list[i].oid)
    if(res){res.view_at = list[i].view_at; list[i]=res}
  }
  await DB.updateData(['history'],list)
}
async function getMyDBById(oid){
    let res = await DB.queryBykeypath(['history'],oid)
    return res
}
async function searchDB(query,queryList,ps){
  let res = await DB.queryByIndex(['history'],query,queryList,ps)
  return res
}



/*
在观看视频时，提供页面的信息
*/
async function collect_info(){
    var bvid = document.location.pathname.match(/BV\w{1,15}/g)[0]
    var tags = jQuery("meta[name='keywords']").attr("content"); //描述
    var des = jQuery('#v_desc > div.desc-info.desc-v2 > span').text() //简介
    var comments = jQuery(' div.content-warp > div.root-reply > span').text().slice(1,300) //评论区
    await DB.updateData(['storage'],{bvid,tags,des,comments})
}
async function updateInfoToDB(){
    let res = await DB.queryByIndex(['storage'])
    for(let i=0;i<res.length;i++){
        let flag = updateOneVideo(res[i])
        if(flag) await DB.deleteData(["storage"], [res[i].bvid]);
    }
}
async function updateOneVideo(e){
    let {bvid,tags,des,comments} = e
    let res = await searchDB({name:'viewAtIndex',value:parseInt(+new Date()/1000)},[{key:'bvid',value:bvid,opt:'=='}],10000)
    console.log(res)
    if(res.length){
        console.log(res)
        res = res[0]
        res.tags = tags
        res.des = des
        res.comments = comments
        await DB.updateData(['history'],res)
        return true
    }
    return false
}