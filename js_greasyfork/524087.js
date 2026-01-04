// ==UserScript==
// @name         WME Cities Overlay DB
// @namespace    https://greasyfork.org/en/users/1315203-tranlong5252
// @version      2025.01.18.01
// @description  IndexedDB interface for Cities overlay
// @author       WazeDev
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524087/WME%20Cities%20Overlay%20DB.user.js
// @updateURL https://update.greasyfork.org/scripts/524087/WME%20Cities%20Overlay%20DB.meta.js
// ==/UserScript==


(function() {
  'use strict';
  var db;

  function getDB() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var openreq = indexedDB.open('WMECitiesOverlay', 1);

        openreq.onerror = function() {
          reject(openreq.error);
        };

        openreq.onupgradeneeded = function() {
          // First time setup: create an empty object store
          //openreq.result.createObjectStore(dbName, { keyPath: "state" });
		  if(!openreq.result.objectStoreNames.contains("US_states_cities")) {
			  openreq.result.createObjectStore("US_states_cities", { keyPath: "state" });
			  }

			if(!openreq.result.objectStoreNames.contains("MX_states_cities")) {
				openreq.result.createObjectStore("MX_states_cities", { keyPath: "state" });
			}
			if(!openreq.result.objectStoreNames.contains("VM_states_cities")) {
				openreq.result.createObjectStore("VM_states_cities", { keyPath: "state" });
			}
        };

        openreq.onsuccess = function() {
          resolve(openreq.result);
        };
      });
    }
    return db;
  }

  function withStore(storeName, type, callback) {
    return getDB().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction(storeName, type);
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

  var idbKeyval = {
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
    module.exports = idbKeyval;
  } else if (typeof define === 'function' && define.amd) {
    define('idbKeyval', [], function() {
      return idbKeyval;
    });
  } else {
    self.idbKeyval = idbKeyval;
  }
}());