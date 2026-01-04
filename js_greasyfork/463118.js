// ==UserScript==
// @name         TransferData
// @namespace    mzblueAD
// @version      0.5
// @description  mz plugin mz增强插件
// @author       bluemz
// @match        https://www.managerzone.com/?p=transfer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @connect      www.bluemz.cn
// @connect      127.0.0.1
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463118/TransferData.user.js
// @updateURL https://update.greasyfork.org/scripts/463118/TransferData.meta.js
// ==/UserScript==

var DB = {
    // 打开数据库
    openDatabase: function (database, store_name) {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(database, 1);
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(store_name)) {
                    const store = db.createObjectStore(store_name, { keyPath: "id" });
                    store.createIndex('date', 'date', {unique: false});
                }
            };
        });
    },

    // 保存数据到数据库
    saveData: function saveData(database, store_name, data) {
        return new Promise(async (resolve, reject) => {
            const db = await DB.openDatabase(database, store_name);
            const transaction = db.transaction([store_name], "readwrite");
            const store = transaction.objectStore(store_name);
            const request = store.put(data);
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    },

    // 从数据库中读取数据
    getData: function (database, store_name, id) {
        return new Promise(async (resolve, reject) => {
            const db = await DB.openDatabase(database, store_name);
            const transaction = db.transaction([store_name], "readonly");
            const store = transaction.objectStore(store_name);
            const request = store.get(id);
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    },

    // 从数据库中读取所有的数据
    getDataAll: function (database, store_name, id) {
        return new Promise(async (resolve, reject) => {
            const db = await DB.openDatabase(database, store_name);
            const transaction = db.transaction([store_name], "readonly");
            const store = transaction.objectStore(store_name);
            const request = store.getAll();
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    },

    // 删除数据库中的数据
    deleteData: function deleteData(database, store_name, id) {
        return new Promise(async (resolve, reject) => {
            const db = await DB.openDatabase(database, store_name);
            const transaction = db.transaction([store_name], "readwrite");
            const store = transaction.objectStore(store_name);
            const request = store.delete(id);
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    },

    // 清空数据库
    clearData: function (database, store_name) {
        return new Promise(async (resolve, reject) => {
            const db = await DB.openDatabase(database, store_name);
            const transaction = db.transaction([store_name], "readwrite");
            const store = transaction.objectStore(store_name);
            const request = store.clear();
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }
};

var transferParse = {
    getSeason: function() {
        return [86, 1]
    },
    getID: function(index) {

        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/h2/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;
        if (!dateElement) {
            return "";
        }
        var title = dateElement.getAttribute("title");

        const regex = /\((\d+)\)/; // 正则表达式模式，匹配括号中的数字

        const match = title.match(regex);
        if (match && match[1]) {
            const extractedValue = match[1];
            return extractedValue;
        } else {
            console.log("未找到匹配的值");
            return "";
        }
    },
    getAge: function(index) {
        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[1]/table/tbody/tr[1]/td[2]/table/tbody/tr[2]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;

        var array = dateElement.textContent.replace(/\s/g, '').match(/(\D+)(\d+)/);
        if (array.length !== 3){
            return -2;
        }
        var birth = array[2];
        var season = transferParse.getSeason()[0];
        var age = season - birth;
        return age;
    },
    getNation: function() {
    },
    getBoll: function(index, id) {
        var element = document.querySelector('#thePlayers_' + index)
        var scout = document.querySelector('#GM_scout_' + id);
        var strArray = scout.getAttribute("scout").split(',');//3,9,7,1,6,3
        var intArray = strArray.map(str => parseInt(str));

        var skill_boll = [];
        var maxed = []
        for (let i = 0; i < 11; i++) {
            var skill = element.querySelector('#boll_' + i)
            skill_boll[i] = parseInt(skill.getAttribute('skill_bool'));
            maxed[i] = skill.getAttribute('maxed_bool');
        }
        var maxed_boll = transferParse.calcMax(skill_boll, maxed, intArray)

        //console.log("maxed_boll", maxed_boll)
        var strSkill = "";
        var strMaxed = "";
        for (let i = 0; i < 11; i++) {
            strSkill += skill_boll[i] + " ";
            strMaxed += maxed_boll[i] + " ";
        }

        return strSkill + "" + strMaxed;
    },
    getSkill: function(index, id) {
        var element = document.querySelector('#thePlayers_' + index)
        var scout = document.querySelector('#GM_scout_' + id);
        var spaceArray = "";
        if (scout) {
            var strArray = scout.getAttribute("scout").split(',');//3,9,7,1,6,3
            spaceArray = scout.getAttribute("scout").replace(/,/g, " ");//3 9 7 1 6 3
            var intArray = strArray.map(str => parseInt(str));
        }

        var skill_boll = [];
        var maxed = []
        for (let i = 0; i < 11; i++) {
            var skill = element.querySelector('#boll_' + i)
            skill_boll[i] = parseInt(skill.getAttribute('skill_bool'));
            var color = skill.getAttribute('maxed_bool');
            if (color === 'green') {
                maxed[i] = 0;
            } else if (color === 'red') {
                maxed[i] = 1;
            } else {
                maxed[i] = -1;
            }
        }


        //console.log("skill", skill_boll, maxed)
        var strSkill = "";
        var strMaxed = "";
        for (let i = 0; i < 11; i++) {
            strSkill += skill_boll[i] + " ";
            strMaxed += maxed[i] + " ";
        }

        return strSkill + spaceArray + " " + strMaxed;
    },
    calcMax: function(skill_boll, maxed, scout) {
        //console.log("skill_boll",skill_boll)
        //console.log("maxed",maxed)
        //console.log("scout",scout)
        var maxed_boll = [10,10,10,10,10,10,10,10,10,10,10];
        for (let i = 0; i < 11; i++) {
            if (maxed[i] === 'red') {
                maxed_boll[i] = skill_boll[i];
            }
        }
        if (scout[0] === 2) {
            if (maxed_boll[scout[1]] > 9) {
                maxed_boll[scout[1]] = 9;
            }
            if (maxed_boll[scout[2]] > 9) {
                maxed_boll[scout[2]] = 9;
            }
        }
        if (scout[3] === 1) {
            if (maxed_boll[scout[4]] > 6 && skill_boll[scout[4]] <= 6) {
                maxed_boll[scout[4]] = 6;
            }
            if (maxed_boll[scout[5]] > 6 && skill_boll[scout[5]] <= 6) {
                maxed_boll[scout[5]] = 6;
            }
        } else if (scout[3] === 2) {
            if (maxed_boll[scout[4]] > 7 && skill_boll[scout[4]] <= 7) {
                maxed_boll[scout[4]] = 7;
            }
            if (maxed_boll[scout[5]] > 7 && skill_boll[scout[5]] <= 7) {
                maxed_boll[scout[5]] = 7;
            }
        }
        for (let i = 0; i < 10; i++) {
            if (scout[0] === 4 && i != scout[1] && i != scout[2] && i != scout[4] && i != scout[5]) {
                if (maxed_boll[i] > 9 && skill_boll[i] <= 9) {
                    maxed_boll[i] = 9;
                }
                continue;
            }
            if (scout[0] === 3 && i != scout[1] && i != scout[2] && i != scout[4] && i != scout[5]) {
                if (maxed_boll[i] > 8 && skill_boll[i] <= 8) {
                    maxed_boll[i] = 8;
                }
                continue;
            }
            if (scout[0] === 2 && i != scout[1] && i != scout[2] && i != scout[4] && i != scout[5]) {
                if (maxed_boll[i] > 7 && skill_boll[i] <= 7) {
                    maxed_boll[i] = 7;
                }
                continue;
            }
        }
        return maxed_boll;
    },
    getMax: function() {
    },
    getAttr: function(index, id) {
        var attr = transferParse.getSkill(index, id)
        return attr;
    },
    getAsking: function(index) {
        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[2]/div/div[1]/table/tbody/tr[4]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;

        var array = dateElement.textContent.replace(/\s/g, '').match(/(\d+)(\D+)/);
        if (array.length !== 3){
            return -2;
        }
        var asking = array[1];
        return asking;
    },
    getBid: function(index) {
        var xpathResult = document.evaluate('//*[@id="thePlayers_' + index + '"]/div/div/div[2]/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr[1]/td[2]/strong', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        var dateElement = xpathResult.singleNodeValue;

        var array = dateElement.textContent.replace(/\s/g, '').match(/(\d+)(\D+)/);
        if (array.length !== 3){
            return -2;
        }
        var bid = array[1];
        return bid;
    },
};

var DataDownload = {
    read: function() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    var result = await DB.getDataAll('Transfor', 'store');
                    //console.log(result);
                    resolve(result); // 返回获取到的 result 变量的值
                } catch (error) {
                    console.error(error);
                    reject(error); // 返回错误信息
                }
            })();
        });
    },
    down: async function() {
        const time = (new Date()).getTime();
        const data = await DataDownload.read();
        const json = {
            time,
            data
        }
        //console.log("json", json)
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });

        // 创建可下载的 URL
        const downloadUrl = URL.createObjectURL(blob);

        // 创建下载链接并模拟点击
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'data-' + time + '.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // 清理
        setTimeout(() => {
            URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(downloadLink);
        }, 1000);
    }
};

var main = {
    interval: 10 * 1000,
    intervalIds: [],
    attackerBid: 50000000,

    load: function() {
        var intervalId = setInterval(function() {
            main.parseAll();
        }, main.interval);
        main.intervalIds.push(intervalId);
    },
    parseAll: function() {
        var date = new Date();
        console.log("收录转会数据：" + date)
        var players_container = document.getElementById('players_container');
        var list = []
        for (let i = 0; i < 20; i++) {
            var object;
            try {
                object = main.parseOne(i, date.getTime())
            }catch(e) {
                console.log(e)
                continue;
            }
            console.log('parseAll',i, object)
            if (object) {
                DB.saveData("Transfor", "store", object);
            }
        }
    },
    parseOne: function(index, date) {
        var id = transferParse.getID(index);
        if (id === '') {
            return;
        }
        var age = transferParse.getAge(index);
        var attr = transferParse.getAttr(index, id);
        var asking = transferParse.getAsking(index);
        var strBid = transferParse.getBid(index)
        var value = age + " " + attr + "" + asking + " " + strBid;
        var bid = parseInt(strBid);
        if (bid === '0') {
            return;
        }

        if (bid >= main.attackerBid) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'http://www.bluemz.cn:3001/api/transfer/attacker',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    'timestamp': date,
                    'id': id,
                    'bid': bid
                }),
                onload: function (response) {
                    if (response.status >= 200 && response.status < 400) {
                    } else {
                        console.log('Error: ', response.status);
                    }
                },
                onerror: function (err) {
                    console.log('Request failed', err);
                }
            });
        }

        return {
            id,
            date,
            value
        }
    }
};

(function() {
    'use strict';

    main.load();
    DataDownload.down();
})();


