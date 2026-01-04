// ==UserScript==
// @name        Virtonomica: API cache test
// @namespace   Virtonomica
// @description тестируем кеширования данных, получаемых через API
// @include     https://virtonomica.ru/vera/main/unit/view/*
// @version     0.04
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476071/Virtonomica%3A%20API%20cache%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/476071/Virtonomica%3A%20API%20cache%20test.meta.js
// ==/UserScript==

const api_token = "https://virtonomica.ru/api/vera/main/token";
const api_unit_data = "https://virtonomica.ru/api/vera/main/unit/data";
const api_technology = "https://virtonomica.ru/api/vera/main/company/technology/browse?pagesize=50000&ajax=1&format=json";


// Создание объекта для работы с IndexedDB
var myDB = {
    db: null,

    open: function() {
        return new Promise((resolve, reject) => {
            var openRequest = indexedDB.open("myDatabase", 1);

            openRequest.onerror = function() {
                // console.log("IDB Ошибка при открытии базы данных.");
                reject("Ошибка при открытии базы данных.");
            };

            openRequest.onupgradeneeded = function(e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains('store')) {
                    db.createObjectStore('store', {keyPath: 'id'});
                }
            };

            openRequest.onsuccess = function(e) {
                // console.log("IDB База данных успешно открыта!");
                myDB.db = e.target.result;
                resolve(e.target.result);
            };
        });
    },

    writeData: function(id, data) {
        return new Promise((resolve, reject) => {
            var transaction = this.db.transaction(['store'], 'readwrite');
            var store = transaction.objectStore('store');
            var request = store.put({id: id, data: data});

            request.onerror = function() {
                // console.log("IDB Ошибка при записи данных.");
                reject("Ошибка при записи данных.");
            };

            request.onsuccess = function() {
                // console.log("IDB Данные успешно записаны!");
                resolve();
            };
        });
    },

    readData: function(id) {
        return new Promise((resolve, reject) => {
            var transaction = this.db.transaction(['store'], 'readonly');
            var store = transaction.objectStore('store');
            var request = store.get(id);

            request.onerror = function() {
                // console.log("IDB Ошибка при чтении данных.");
                reject("Ошибка при чтении данных.");
            };

            request.onsuccess = function() {
                if (request.result) {
                    // console.log("IDB Прочитанные данные:", request.result.data);
                    resolve(request.result.data);
                } else {
                    // console.log("IDB Данные не найдены.");
                    resolve(null);
                }
            };
        });
    },
};

// Функция для получения и кэширования данных из API
myDB.fetchAndCacheData = async function(apiUrl, cacheSeconds) {
    // Получение данных из API
    var response = await fetch(apiUrl);
    var data = await response.json();

    console.log("IDB response.json:", data);

    // Создание объекта для хранения данных и метки времени
    var dataObject = {
        data: data,
        _timestamp: Date.now()
    };
    // console.log("IDB _timestamp:", dataObject);

    // Сохранение данных в IndexedDB
    await this.writeData(apiUrl, dataObject);

    console.log("IDB fetchAndCacheData:", dataObject.data);

    // Возврат данных
    return data;
};
// Функция для чтения данных
myDB.read_api = async function(apiUrl, cacheSeconds) {
    // Чтение данных из IndexedDB
    var cachedDataObject = await this.readData(apiUrl);

    console.log("IDB cachedDataObject(" + apiUrl + ")=", cachedDataObject);
    // Проверка метки времени
    var currentTimestamp = Date.now();
    // console.log("IDB time:", currentTimestamp - cachedDataObject._timestamp, cacheSeconds * 1000)
    if (cachedDataObject && cachedDataObject._timestamp && currentTimestamp - cachedDataObject._timestamp <= cacheSeconds * 1000) {
        // Если данные еще актуальны, возвращаем их
        console.log("IDB cachedDataObject.data", cachedDataObject.data);
        return cachedDataObject.data;
    } else {
        // Если данные устарели или отсутствуют, получаем новые данные из API и кэшируем их
        return await this.fetchAndCacheData(apiUrl, cacheSeconds);
    }
};

// Использование объекта с async/await
(async function() {
    try {
        await myDB.open();
        // await myDB.writeData(1, {name: "John", age: 30});

        var token = await myDB.read_api(api_token, 3*60);
        console.log("IDB token=", token);

        var unit_id = /(\d+)/.exec(location.href)[0];

        let unit_data = await myDB.read_api(  api_unit_data + "?id=" + unit_id, 180*60)
        console.info("IDB company=",unit_data)
        let company_id = unit_data.company_id;
        console.info("IDB company=",company_id)

        let technology = await myDB.read_api( api_technology + "&id=" + company_id, 12*60*60)
        console.info("IDB technology=",technology)

    } catch (error) {
        console.log("IDB Ошибка:", error);
    }
})();