// ==UserScript==
// @name        Virtonomica: Tecnology v2
// @namespace   Virtonomica
// @description тестируем кеширования данных, получаемых через API
// @include     https://virtonomica.ru/vera/main/unit/view/*/investigation
// @version     2.01
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/411369/Virtonomica%3A%20Tecnology%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/411369/Virtonomica%3A%20Tecnology%20v2.meta.js
// ==/UserScript==

const api_token = "https://virtonomica.ru/api/vera/main/token";
const api_unit_data = "https://virtonomica.ru/api/vera/main/unit/data";
const api_technology = "https://virtonomica.ru/api/vera/main/company/technology/browse?pagesize=50000&ajax=1&format=json";
const api_list_labs = "https://virtonomica.ru/api/vera/main/company/units?unit_class_id=2202&pagesize=5000";
const select_id = "#unit-type-invest option";


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

var KnowledgeBase = function (){
    this.list = new Array();

    this.add = function (know_id, know_name, level) {
        var item = this.list.find(function(element) {
            return element.id === know_id;
        });

        if (item) {
            if (!item.levels.includes(level)) {
                item.levels.push(parseInt(level));
            }
        } else {
            this.list.push({
                id: know_id,
                name: know_name,
                levels: [level]
            });
        }
    }

    this.get_string = function (know_id){
        var item = this.list.find(function(element) {
            return element.id === know_id;
        });

        if (item) {
            var last = item.levels.length -1;
            if (last < 0){
                return '-0-';
            }
            out= item.levels[last];
            if (last > 0) {
                if ((item.levels[last - 1] + 1) != item.levels[last]) {
                    out = item.levels[last - 1] + "..." + out;
                }
            }
            return "[" + out + '] ';
        } else {
            return '---';
        }
    }
};

var techn_list = function () {
    this.list = new Object();
    /**
     * Добавить подраздление для учета
     *
     * @param unit_id
     * @param techn_name
     */
    this.add_unit = function (unit_id, techn_name) {
        //console.log('---add_unit');
        if (this.list[techn_name] == null) {
            this.list[techn_name] = new Object();
        }
        if (this.list[techn_name][unit_id] != null) return;
        this.list[techn_name][unit_id] = 1;
    };
    /**
     * Запросить число юнтов, которые изучают данную технологию
     *
     * @param techn_name
     * @returns {number}
     */
    this.get_num_labs = function (techn_name) {
        //console.log('---get_num_labs (' + techn_name + ")");
        if ( this.list[techn_name] == null ) return 0;
        //console.info(this.list);
        return Object.keys(this.list[techn_name]).length;
    }
}


/**
 * Добавить информационные дивы для вывода сообщений
 */
function add_div() {
    var my_div = document.createElement('div');
    my_div.id = 'techn_info';

    var div_ankor = document.querySelector('#unit-info');
    // проверка на новый интерфейс
    var test = document.querySelector("div[class='unit-summary mmr']");
    if (!test) {
        // проверим, а вдруг это старый нвовй интерфейс
        test = document.querySelector("table.short_finance_report");
        if (test) {
            div_ankor = document.querySelector("div.unit_box-container");
        } else {
            div_ankor = document.querySelector("table.infoblock");
            test = document.querySelector("div#page");
            if (test) {
                div_ankor = document.querySelector("div#page");
            }
        }
    }

    div_ankor.parentNode.insertBefore(my_div, div_ankor);

    var st = document.createElement('style');
    st.textContent = "#techn_info {padding-bottom: 4px;}";
    document.head.appendChild(st);
}

async function proccess_api(company_id)
{
    document.getElementById('techn_info').innerHTML = 'запрашиваем данные через api';

    let technology = await myDB.read_api( api_technology + "&id=" + company_id, 12*60*60)
    console.info("IDB technology=",technology)

    let know = new KnowledgeBase();
    for (var key in technology.data){
       know.add(technology.data[key].unit_type_id, technology.data[key].unit_type_name, technology.data[key].level);
    }
    console.info("IDB know", know);
    // технологии - максимально изученный уровень
    // unit_class_id (unit_type_id) - unit_type_name - level

    const resp_list = await myDB.read_api(api_list_labs + "&id=" + company_id, 60*2 );
    console.info("IDB resp_list=",resp_list)

    // Технологий - число наших лабораторий
    var list = new techn_list();
    for (var key in resp_list.data) {
        var el = resp_list.data[key].products;

        if (Object.keys(el).length == 0) continue;

        list.add_unit(key, resp_list.data[key].products[0].symbol);
    }
    console.info("IDB lab_list=",list)

    var select = document.querySelector(select_id);
    console.info("IDB select", select);
    for (var i = 0; i < select.parentElement.length; i++) {
        var opt = select.parentElement[i];
        var text = opt.text;

        if (text == 'Все типы') continue;

        // дополнить информацией об уровень изучения
        var value = opt.getAttribute('value');
        opt.text = know.get_string(value) + opt.text;

        var nlabs = list.get_num_labs(text);
        if (nlabs == 0) continue;
        opt.text = opt.text + " (+" + nlabs + ")";
    }
    document.getElementById('techn_info').innerHTML = 'обработка данных завершена';
}


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

        add_div();
        // document.getElementById('techn_info').innerHTML = 'add_div';
        proccess_api(company_id);

    } catch (error) {
        console.log("IDB Ошибка:", error);
    }
})();

