// ==UserScript==
// @name         mock快照
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  mock数据快照，会把上一次成功的数据保存起来，等下一次访问报错的时候 把上一次的数据返回给你
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @run-at document-start
// @require      https://unpkg.com/ajax-hook@3.0.2/dist/ajaxhook.min.js
// @downloadURL https://update.greasyfork.org/scripts/475869/mock%E5%BF%AB%E7%85%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/475869/mock%E5%BF%AB%E7%85%A7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 创建/更新一个数据库
  let creatUpdateStore = function (name, verson = 1) {
    console.log('creatUpdateStore');
    // 打开数据库
    let request = window.indexedDB.open(name, verson);

    request.onsuccess = function (event) {
      console.log('open success');
    };

    request.onerror = function (event) {
      console.log('open fail');
    };

    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains(name)) {
        // 创建仓库对象（创建表格）
        // 这里我将主键设置为id
        let objectStore = db.createObjectStore(name, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  };

  // 往数据库中加数据
  let addDataStore = function (storeName, data, verson) {
    console.log('addDataStore');
    return new Promise((resolve, reject) => {
      let databaseName = storeName;
      let databaseVersion = verson || 1;
      let db;
      let request = indexedDB.open(databaseName, databaseVersion);
      request.onsuccess = function (event) {
        db = event.target.result;
        db = event.target.result;
        // 将数据保存到新建的对象仓库
        let objectStore = db
          .transaction(databaseName, 'readwrite')
          .objectStore(databaseName);

        try {
          objectStore.get(data.id);
          objectStore.put(data);
        } catch (e) {
          if (Array.isArray(data)) {
            data.forEach(function (dataItem) {
              // 添加一条数据
              objectStore.add(dataItem);
            });
            resolve();
          } else {
            // 添加一条数据
            objectStore.add(data);
            resolve();
          }
        }
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };

  // 获取数据
  let getStoreData = function (name, key = 1) {
    console.log('getStoreData');
    return new Promise((resolve, reject) => {
      let request = indexedDB.open(name);
      request.onsuccess = function (event) {
        let db = event.target.result;
        let req;
        try {
          req = db.transaction(name, 'readwrite').objectStore(name).get(key); // 这里的“1”也是主键的键值
        } catch (e) {
          reject('用户失败');
        }
        if (!req) {
          return;
        }
        req.onsuccess = function () {
          resolve(req.result.value);
        };
        req.onerror = function () {
          reject('获取失败');
        };
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(name)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(name, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };
  // 删除数据
  let delectStoreData = function (name, key) {
    console.log('delectStoreData');
    return new Promise((resolve, reject) => {
      let databaseName = name;
      let db;
      let request = window.indexedDB.open(databaseName);
      request.onsuccess = function (event) {
        db = event.target.result;
        let req = db
          .transaction(databaseName, 'readwrite')
          .objectStore(databaseName)
          .delete(key); // 这里指定的是主键的键值

        req.onsuccess = function () {
          resolve('删除成功');
        };

        req.onerror = function () {
          reject('删除失败');
        };
      };
    });
  };
  // 更新
  let updateStoreData = function (storeName, newData, key) {
    console.log('updateStoreData');
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(storeName);
      let db;
      request.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction(storeName, 'readwrite');
        let store = transaction.objectStore(storeName);
        let storeData = store.get(key);

        storeData.onsuccess = function (e) {
          let data = e.target.result || {};
          for (a in newData) {
            data[a] = newData[a];
          }
          store.put(data);
          resolve();
        };
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };
  // 遍历获取
  let storeDataList = function (storeName) {
    console.log('storeDataList');
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(storeName);
      let db;
      request.onsuccess = function (event) {
        db = event.target.result;
        let transaction = db.transaction(storeName);
        let store = transaction.objectStore(storeName);
        let cursor = store.openCursor(); //打开游标
        let dataList = new Array();
        cursor.onsuccess = function (e) {
          var cursorVal = e.target.result;
          if (cursorVal) {
            dataList.push(cursorVal.value);
            cursorVal.continue();
          } else {
            // 遍历结束
            resolve(dataList);
          }
        };
      };
      request.onupgradeneeded = function (event) {
        let db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          // 创建仓库对象（创建表格）
          // 这里我将主键设置为id
          let objectStore = db.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      };
    });
  };

  // 批量删除
  function batchDelete(storeName, keys) {
    console.log('batchDelete');
    let allKeys = keys.map((item) => {
      item = +item;
      return delectStoreData(storeName, item);
    });
    return allKeys;
    /* Promise.all(allKeys).then(data => {
           console.log(data);
           resolve(data);
       });*/
  }
  creatUpdateStore('chenliwen');
  ah.proxy(
    {
      //请求发起前进入
      onRequest: (config, handler) => {
        console.log(config.url);
        handler.next(config);
      },
      //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
      onError: (err, handler) => {
        // getStoreData(
        //   'chenliwen',
        //   handler.xhr.responseURL.replace(/&_t=.*/g, '')
        // );
        console.log(err);
        handler.next(err);
      },
      //请求成功后进入
      onResponse: async (response, handler) => {
        const key = handler.xhr.responseURL.replace(/_t=.*/g, '');
        if (response.statusText === 'Gateway Timeout') {
          response.status = 200;
          response.statusText = 'OK';
          const res = await getStoreData('chenliwen', key);
          response.response = res;
        } else {
          addDataStore('chenliwen', {
            id: key,
            value: response.response,
          });
        }
        handler.next(response);
      },
    },
    window
  );
  // Your code here...
})();
