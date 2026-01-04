// ==UserScript==
// @name        API-Speicher TEST
// @namespace   leeSalami.lss
// @version     0.7
// @license     MIT
// @author      leeSalami
// @match       https://*.leitstellenspiel.de*
// @description Erlaubt die Speicherung und Wiederverwendung von API-Daten des Leitstellenspiels
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/517412/API-Speicher%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/517412/API-Speicher%20TEST.meta.js
// ==/UserScript==

'use strict'

const DB_NAME = 'lss-api-storage';
const DB_VERSION = 6;

async function openDb() {
  return navigator.locks.request('cas-open-db', () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onsuccess = event => resolve(event.target.result);
      request.onerror = event => reject(event.target);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (event.oldVersion < 1) {
          db.createObjectStore('lastUpdate', { keyPath: 'type' });
          db.createObjectStore('missions', { keyPath: 'id' });

          const buildingStore = db.createObjectStore('buildings', { keyPath: 'id' });
          buildingStore.createIndex('building_type', 'building_type', { unique: false });
        }

        if (event.oldVersion < 2) {
          db.createObjectStore('buildingTypes', { keyPath: 'id' });
        }

        if (event.oldVersion < 3) {
          const allianceBuildingStore = db.createObjectStore('allianceBuildings', { keyPath: 'id' });
          allianceBuildingStore.createIndex('building_type', 'building_type', { unique: false });

          db.createObjectStore('schoolingTypes', { keyPath: 'id' });

          const allianceSchoolingsStore = db.createObjectStore('allianceSchoolings', { keyPath: 'id' });
          allianceSchoolingsStore.createIndex('building_id', 'building_id', { unique: false });

          const userInfoStore = db.createObjectStore('userInfo', { keyPath: 'user_id' });
          userInfoStore.createIndex('user_name', 'user_name', { unique: true });

          db.createObjectStore('allianceInfo', { keyPath: 'id' });
          db.createObjectStore('allianceUsers', { keyPath: 'id' });

          db.createObjectStore('vehicleTypes', { keyPath: 'id' });
        }

        if (event.oldVersion < 4) {
          if (db.objectStoreNames.contains('buildings')) {
            const store = event.target.transaction.objectStore('buildings');
            if (store.indexNames.contains('enabled')) {
              store.deleteIndex('enabled');
            }
          }
        }

        if (event.oldVersion < 5) {
          const vehiclesStore = db.createObjectStore('vehicles', { keyPath: 'id' });
          vehiclesStore.createIndex('building_id', 'building_id', { unique: false });
          vehiclesStore.createIndex('vehicle_type', 'vehicle_type', { unique: false });
        }

        if (event.oldVersion < 6) {
          if (db.objectStoreNames.contains('buildings')) {
            const store = event.target.transaction.objectStore('buildings');
            store.createIndex('leitstelle_building_id', 'leitstelle_building_id', { unique: false });
          }
        }

        event.target.transaction.oncomplete = () => resolve(db);
        event.target.transaction.onerror = event => reject(event.target);
      };
    });
  });
}

async function storeData(db, storageName, data) {
  let success = true;

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(storageName, 'readwrite')
      .objectStore(storageName);

    /**
     * @type {string}
     */
    const keyPath = store.keyPath;

    if (Array.isArray(data)) {
      data.forEach((dataSet) => {
        if (Object.keys(dataSet).length > 0) {
          const request = store.put(dataSet);

          request.onerror = () => {
            success = false;
          };
        }
      });
    } else if (data.hasOwnProperty(keyPath)) {
      const request = store.put(data);

      request.onerror = () => {
        success = false;
      };
    } else {
      for (const [key, value] of Object.entries(data)) {
        if (!value.hasOwnProperty(keyPath)) {
          value[keyPath] = !isNaN(Number(key)) ? parseInt(key) : key;
        }
        const request = store.put(value);

        request.onerror = () => {
          success = false;
        };
      }
    }

    if (success) {
      updateLastUpdateTimestamp(db, storageName)
      resolve('Data stored');
    } else {
      reject('Unable to store data');
    }
  });
}

async function clearData(db, storageName) {
  let success = true;

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(storageName, 'readwrite')
      .objectStore(storageName);

    const request = store.clear();

    request.onerror = () => {
      success = false;
    };

    if (success) {
      updateLastUpdateTimestamp(db, storageName)
      resolve('Data cleared');
    } else {
      reject('Unable to clear data');
    }
  });
}

async function updateLastUpdateTimestamp(db, storageName) {
  db.transaction('lastUpdate', 'readwrite')
    .objectStore('lastUpdate')
    .put({ type: storageName, timestamp: Date.now() });
}

function updateData(db, type, endpoint, maxAge){
  return navigator.locks.request(type, async () => {
    if (await dataNeedsUpdate(db, type, maxAge)) {
      let currentEndpoint = endpoint;
      let hasNextPage = false;
      let success = true;
      let page = 1;

      do {
        hasNextPage = false;
        const response = await fetch(currentEndpoint);

        if (!response.ok) {
          success = false;
          break;
        }

        let data = await response.json();
        let result = data;

        if (result.hasOwnProperty('result')) {
          result = result.result;
        }

        if (page === 1) {
          await clearData(db, type);
        }

        if (type === 'allianceInfo' && result && result.hasOwnProperty('users')) {
          await storeData(db, 'allianceUsers', result.users);
          delete result.users;
        }

        if (result) {
          await storeData(db, type, result);
        }

        if (data.hasOwnProperty('paging') && data.paging.hasOwnProperty('next_page')) {
          currentEndpoint = data.paging.next_page;
          hasNextPage = true;
          page++;
        }
      } while (hasNextPage);

      return success;
    } else {
      return false;
    }
  });
}

function updateMissions(db, maxAge = 3_600) {
  return updateData(db, 'missions', '/einsaetze.json', maxAge);
}

function updateBuildings(db, maxAge = 300) {
  return updateData(db, 'buildings', '/api/buildings', maxAge);
}

function updateBuildingTypes(db, maxAge = 3_600) {
  return updateData(db, 'buildingTypes', `https://api.lss-manager.de/${I18n.locale}/buildings`, maxAge);
}

function updateSchoolingTypes(db, maxAge = 3_600) {
  return updateData(db, 'schoolingTypes', `https://api.lss-manager.de/${I18n.locale}/schoolings`, maxAge);
}

function updateVehicleTypes(db, maxAge = 3_600) {
  return updateData(db, 'vehicleTypes', `https://api.lss-manager.de/${I18n.locale}/vehicles`, maxAge);
}

function updateAllianceBuildings(db, maxAge = 300) {
  return updateData(db, 'allianceBuildings', '/api/alliance_buildings', maxAge);
}

function updateAllianceSchoolings(db, maxAge = 300) {
  return updateData(db, 'allianceSchoolings', '/api/alliance_schoolings', maxAge);
}

function updateUserInfo(db, maxAge = 300) {
  return updateData(db, 'userInfo', '/api/userinfo', maxAge);
}

function updateAllianceInfo(db, maxAge = 300) {
  return updateData(db, 'allianceInfo', '/api/allianceinfo', maxAge);
}

function updateVehicles(db, maxAge = 300) {
  return updateData(db, 'vehicles', '/api/v2/vehicles', maxAge);
}

async function dataNeedsUpdate(db, type, maxAge) {
  let needsUpdate = true;

  if (maxAge) {
    const lastUpdate = await getData(db, 'lastUpdate', type);

    if (lastUpdate !== undefined && maxAge * 1_000 > Date.now() - lastUpdate.timestamp) {
      needsUpdate = false;
    }
  }

  return needsUpdate;
}

async function getData(db, storageName, key) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storageName, 'readonly')
      .objectStore(storageName)
      .get(key);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject('Error getting data');
    };
  });
}

async function getAllData(db, storageName) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storageName, 'readonly')
      .objectStore(storageName)
      .getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject('Error getting data');
    };
  });
}

async function getAllKeys(db, storageName) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storageName, 'readonly')
      .objectStore(storageName)
      .getAllKeys();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject('Error getting data');
    };
  });
}

async function getDataByIndex(db, storageName, indexName, query) {
  return new Promise((resolve, reject) => {
    const results = [];
    const transaction = db.transaction(storageName);
    transaction.oncomplete = () => resolve(results);
    transaction.onerror = event => reject(event.target);
    const request = transaction.objectStore(storageName)
      .index(indexName)
      .openCursor(query);

    request.onsuccess = event => {
      const cursor = event.target.result;
      if (!cursor) {
        return;
      }

      results.push(cursor.value);
      cursor.continue();
    };
  });
}

async function getCount(db, storageName, query = null) {
  return new Promise((resolve, reject) => {
    const request = db
      .transaction(storageName, 'readonly')
      .objectStore(storageName)
      .count(query);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = () => {
      reject('Error getting data');
    };
  });
}

async function getCountByIndex(db, storageName, indexName, query = null) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const transaction = db.transaction(storageName);
    transaction.oncomplete = () => resolve(count);
    transaction.onerror = event => reject(event.target);
    const request = transaction.objectStore(storageName)
      .index(indexName)
      .count(query);

    request.onsuccess = event => {
      count = event.target.result;
    };
  });
}
