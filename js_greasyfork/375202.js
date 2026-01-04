// ==UserScript==
// @name         Photo Viewer DB Interface
// @namespace    https://greasyfork.org/en/users/166843-wazedev
// @version      2018.12.05.01
// @description  IndexedDB interface for WMEPIE Photo Viewer tool
// @author       WazeDev
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @grant        none
// ==/UserScript==


(function() {
  'use strict';
  var pvdb;

  function getDB() {
    if (!pvdb) {
      pvdb= new Promise(function(resolve, reject) {
        var openreq = indexedDB.open('WMEPIEPhotoViewer', 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          //openreq.result.createObjectStore(dbName, { keyPath: "placeID" });
		  if(!openreq.result.objectStoreNames.contains("Places")) {
			  openreq.result.createObjectStore("Places", { keyPath: "placeID" });
			  }
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return pvdb;
  }

  function withStore(storeName, type, callback) {
    return getDB().then(function(pvdb) {
      return new Promise(function(resolve, reject) {
        var transaction = pvdb.transaction(storeName, type);
        transaction.oncomplete = function() {
          resolve();
        };
        transaction.onerror = function() {
          reject(transaction.error);
        };
        callback(transaction.objectStore(storeName));
      });
    });
  }

  var idbPVKeyval = {
    get: function(storeName, key) {
      var req;
      return withStore(storeName, 'readonly', function(store) {
        req = store.get(key);
      }).then(function() {
        return req.result;
      });
    },
    set: function(storeName, value) {
      return withStore(storeName, 'readwrite', function(store) {
        store.put(value);
      });
    },
    delete: function(storeName, key) {
      return withStore(storeName, 'readwrite', function(store) {
        store.delete(key);
      });
    },
    clear: function(storeName) {
      return withStore(storeName, 'readwrite', function(store) {
        store.clear();
      });
    },
    keys: function(storeName) {
      var keys = [];
      return withStore(storeName, 'readonly', function(store) {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function() {
          if (!this.result) return;
          keys.push(this.result.key);
          this.result.continue();
        };
      }).then(function() {
        return keys;
      });
    }
  };

  if (typeof module != 'undefined' && module.exports) {
    module.exports = idbPVKeyval ;
  } else if (typeof define === 'function' && define.amd) {
    define('idbPVKeyval ', [], function() {
      return idbPVKeyval ;
    });
  } else {
    self.idbPVKeyval = idbPVKeyval ;
  }
}());