// ==UserScript==
// @name         iDB Helper
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Helpful features to make Indexed DB easier to use
// @author       @theyhoppingonme on discord
// @icon         https://th.bing.com/th/id/OIP.D8qs87izChXNwCHnw3KrTQAAAA?w=117&h=180&c=7&r=0&o=7&pid=1.7&rm=3
// @grant        none
// ==/UserScript==

const iDB = {
  name: "DefaultDB",
  version: 1,
  storeName: "DefaultStore",
  keyPath: null, // Set to enable auto-incrementing keys or custom key paths
  autoIncrement: false,
  indexes: [], // Array of {name, keyPath, options} objects
  _db: null,

  help() {
    return `
======== iDB Helper ========
Setup:
  iDB.name = "MyDatabase";
  iDB.version = 1;
  iDB.storeName = "MyStore";
  iDB.keyPath = "id";              // Optional: for auto-incrementing
  iDB.autoIncrement = true;        // Optional: auto-increment keys
  iDB.indexes = [{name: "email", keyPath: "email", options: {unique: true}}];
  await iDB.open();

Basic Operations:
  await iDB.setItem("key", value);       // Saves data
  let val = await iDB.getItem("key");    // Gets data
  await iDB.removeItem("key");           // Deletes one key
  await iDB.clear();                     // Deletes everything in store
  let keys = await iDB.getAllKeys();     // Get all keys
  let all = await iDB.getAll();          // Get all key-value pairs

Advanced Operations:
  await iDB.setItems({key1: val1, key2: val2});  // Bulk save
  let vals = await iDB.getItems(["key1", "key2"]); // Bulk get
  await iDB.removeItems(["key1", "key2"]);       // Bulk delete

  // Counting and checking
  let count = await iDB.count();         // Total items count
  let exists = await iDB.exists("key");  // Check if key exists

  // Data operations
  await iDB.updateItem("key", {prop: "newValue"}); // Merge update
  let filtered = await iDB.filter(item => item.age > 18); // Filter items
  let found = await iDB.find(item => item.email === "test@example.com"); // Find first match

  // Index operations (if indexes are configured)
  let result = await iDB.getByIndex("email", "test@example.com");
  let range = await iDB.getByIndexRange("age", 18, 65);

  // Key operations
  let firstKey = await iDB.getFirstKey();
  let lastKey = await iDB.getLastKey();
  let keyRange = await iDB.getKeysInRange("a", "z");

  // Database management
  await iDB.backup();                    // Returns all data as JSON
  await iDB.restore(backupData);         // Restores from backup
  await iDB.deleteDatabase();            // Deletes entire database

  // Event handling
  iDB.onError = (error) => console.error("iDB Error:", error);
  iDB.onReady = () => console.log("iDB Ready");

Notes:
  - All methods return Promises (use async/await).
  - Always call iDB.open() after setting configuration.
  - Use keyPath and autoIncrement for structured data storage.
  - Define indexes for efficient querying.
============================
    `.trim();
  },

  // Event handlers
  onError: null,
  onReady: null,

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(iDB.name, iDB.version);

      request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Delete existing store if it exists (for schema changes)
        if (db.objectStoreNames.contains(iDB.storeName)) {
          db.deleteObjectStore(iDB.storeName);
        }

        // Create object store with options
        const storeOptions = {};
        if (iDB.keyPath) storeOptions.keyPath = iDB.keyPath;
        if (iDB.autoIncrement) storeOptions.autoIncrement = iDB.autoIncrement;

        const store = db.createObjectStore(iDB.storeName, storeOptions);

        // Create indexes
        iDB.indexes.forEach(index => {
          store.createIndex(index.name, index.keyPath, index.options || {});
        });
      };

      request.onsuccess = function (event) {
        iDB._db = event.target.result;
        if (iDB.onReady) iDB.onReady();
        resolve();
      };

      request.onerror = function (event) {
        const error = "iDB.open error: " + event.target.errorCode;
        if (iDB.onError) iDB.onError(error);
        reject(error);
      };
    });
  },

  _withStore(mode, callback) {
    return new Promise((resolve, reject) => {
      if (!iDB._db) {
        const error = "iDB: Database not opened. Call iDB.open() first.";
        if (iDB.onError) iDB.onError(error);
        return reject(error);
      }

      const tx = iDB._db.transaction(iDB.storeName, mode);
      const store = tx.objectStore(iDB.storeName);

      let result;
      try {
        result = callback(store);
      } catch (err) {
        if (iDB.onError) iDB.onError(err);
        return reject(err);
      }

      tx.oncomplete = () => resolve(result);
      tx.onerror = () => {
        if (iDB.onError) iDB.onError(tx.error);
        reject(tx.error);
      };
    });
  },

  // Basic operations
  setItem(key, value) {
    return iDB._withStore("readwrite", store => {
      if (iDB.keyPath && typeof value === 'object') {
        // For stores with keyPath, add the key to the object
        value[iDB.keyPath] = key;
        store.put(value);
      } else {
        store.put(value, key);
      }
    });
  },

  getItem(key) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  },

  removeItem(key) {
    return iDB._withStore("readwrite", store => {
      store.delete(key);
    });
  },

  clear() {
    return iDB._withStore("readwrite", store => {
      store.clear();
    });
  },

  // Bulk operations
  setItems(items) {
    return iDB._withStore("readwrite", store => {
      Object.entries(items).forEach(([key, value]) => {
        if (iDB.keyPath && typeof value === 'object') {
          value[iDB.keyPath] = key;
          store.put(value);
        } else {
          store.put(value, key);
        }
      });
    });
  },

  getItems(keys) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const results = {};
        let completed = 0;

        keys.forEach(key => {
          const req = store.get(key);
          req.onsuccess = () => {
            results[key] = req.result;
            completed++;
            if (completed === keys.length) {
              resolve(results);
            }
          };
          req.onerror = () => reject(req.error);
        });

        if (keys.length === 0) resolve({});
      });
    });
  },

  removeItems(keys) {
    return iDB._withStore("readwrite", store => {
      keys.forEach(key => store.delete(key));
    });
  },

  // Advanced operations
  updateItem(key, updates) {
    return iDB._withStore("readwrite", store => {
      return new Promise((resolve, reject) => {
        const getReq = store.get(key);
        getReq.onsuccess = () => {
          const existing = getReq.result;
          if (existing) {
            const updated = typeof existing === 'object' ?
              { ...existing, ...updates } : updates;

            const putReq = store.put(updated, key);
            putReq.onsuccess = () => resolve(updated);
            putReq.onerror = () => reject(putReq.error);
          } else {
            reject(new Error(`Key "${key}" not found`));
          }
        };
        getReq.onerror = () => reject(getReq.error);
      });
    });
  },

  count() {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  },

  exists(key) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const req = store.getKey(key);
        req.onsuccess = () => resolve(req.result !== undefined);
        req.onerror = () => reject(req.error);
      });
    });
  },

  filter(predicate) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const results = [];
        const cursor = store.openCursor();

        cursor.onsuccess = e => {
          const cur = e.target.result;
          if (cur) {
            if (predicate(cur.value, cur.key)) {
              results.push(cur.value);
            }
            cur.continue();
          } else {
            resolve(results);
          }
        };
        cursor.onerror = () => reject(cursor.error);
      });
    });
  },

  find(predicate) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const cursor = store.openCursor();

        cursor.onsuccess = e => {
          const cur = e.target.result;
          if (cur) {
            if (predicate(cur.value, cur.key)) {
              resolve(cur.value);
            } else {
              cur.continue();
            }
          } else {
            resolve(undefined);
          }
        };
        cursor.onerror = () => reject(cursor.error);
      });
    });
  },

  // Index operations
  getByIndex(indexName, value) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const index = store.index(indexName);
        const req = index.get(value);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  },

  getByIndexRange(indexName, lower, upper, lowerOpen = false, upperOpen = false) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const index = store.index(indexName);
        const range = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
        const results = [];

        const cursor = index.openCursor(range);
        cursor.onsuccess = e => {
          const cur = e.target.result;
          if (cur) {
            results.push(cur.value);
            cur.continue();
          } else {
            resolve(results);
          }
        };
        cursor.onerror = () => reject(cursor.error);
      });
    });
  },

  // Key operations
  getAllKeys() {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  },

  getFirstKey() {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const cursor = store.openKeyCursor();
        cursor.onsuccess = e => {
          const cur = e.target.result;
          resolve(cur ? cur.key : undefined);
        };
        cursor.onerror = () => reject(cursor.error);
      });
    });
  },

  getLastKey() {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const cursor = store.openKeyCursor(null, 'prev');
        cursor.onsuccess = e => {
          const cur = e.target.result;
          resolve(cur ? cur.key : undefined);
        };
        cursor.onerror = () => reject(cursor.error);
      });
    });
  },

  getKeysInRange(lower, upper, lowerOpen = false, upperOpen = false) {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const range = IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);
        const req = store.getAllKeys(range);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    });
  },

  getAll() {
    return iDB._withStore("readonly", store => {
      return new Promise((resolve, reject) => {
        const req = store.getAll();
        if (req) {
          // Use getAll if supported
          req.onsuccess = () => {
            const values = req.result;
            const keys = [];
            const getKeysReq = store.getAllKeys();
            getKeysReq.onsuccess = () => {
              const keyArray = getKeysReq.result;
              const data = {};
              keyArray.forEach((key, index) => {
                data[key] = values[index];
              });
              resolve(data);
            };
            getKeysReq.onerror = () => reject(getKeysReq.error);
          };
          req.onerror = () => reject(req.error);
        } else {
          // Fallback to cursor
          const data = {};
          const cursor = store.openCursor();
          cursor.onsuccess = e => {
            const cur = e.target.result;
            if (cur) {
              data[cur.key] = cur.value;
              cur.continue();
            } else {
              resolve(data);
            }
          };
          cursor.onerror = () => reject(cursor.error);
        }
      });
    });
  },

  // Database management
  backup() {
    return iDB.getAll().then(data => {
      return {
        name: iDB.name,
        version: iDB.version,
        storeName: iDB.storeName,
        timestamp: new Date().toISOString(),
        data: data
      };
    });
  },

  restore(backupData) {
    return iDB.clear().then(() => {
      return iDB.setItems(backupData.data);
    });
  },

  deleteDatabase() {
    return new Promise((resolve, reject) => {
      if (iDB._db) {
        iDB._db.close();
        iDB._db = null;
      }

      const deleteReq = indexedDB.deleteDatabase(iDB.name);
      deleteReq.onsuccess = () => resolve();
      deleteReq.onerror = () => reject(deleteReq.error);
    });
  }
};

    // Made by @theyhoppingonme on discord