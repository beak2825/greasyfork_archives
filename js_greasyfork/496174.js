// ==UserScript==
// @name         虎牙弹幕统计机
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  1.虎牙实时统计高频弹幕，2.礼物、人进入、弹幕数据持久化到IndexDB
// @author       黎曼
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496174/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E7%BB%9F%E8%AE%A1%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496174/%E8%99%8E%E7%89%99%E5%BC%B9%E5%B9%95%E7%BB%9F%E8%AE%A1%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var room_name;

    // 等待页面加载完成
    window.addEventListener('load', function() {
        room_name = document.querySelector('.host-name').textContent.trim();
    }, false);


    var IDBStore;
    var total = 0;
    // 创建一个浮动的 div 元素用于显示统计结果
    const statsDiv = document.createElement('div');
    statsDiv.style.position = 'fixed';
    statsDiv.style.top = '50px';
    statsDiv.style.right = '10px';
    statsDiv.style.width = '300px';
    statsDiv.style.height = '500px';
    statsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    statsDiv.style.color = 'white';
    statsDiv.style.padding = '10px';
    statsDiv.style.overflowY = 'auto';
    statsDiv.style.zIndex = '10000';
    statsDiv.style.font_size = '36px';
    document.body.appendChild(statsDiv);
    // 创建一个对象用于记录弹幕频率
    var barrageFrequency = {};
    const barrageContainer = document.querySelector('.chat-room__list');
    // 观察弹幕容器的变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        room_name = document.querySelector('.host-name').textContent.trim();

                        const barrageHtml = node.querySelector('.msg-normal');
                        if (barrageHtml) {
                            deal_barrage(barrageHtml);
                            deal_barrage_frequency(barrageHtml);
                        }

                        const peopleInHtml = node.querySelector('[class^="msg--"]');
                        if (peopleInHtml) {
                            deal_people(peopleInHtml);
                        }

                        const giftHtml = node.querySelector('.tit-h-send');
                        if (giftHtml) {
                            deal_gift(giftHtml);
                        }

                    }
                });
            }

        });
    });
    function deal_gift(giftHtml) {
        const username = giftHtml.querySelector('.cont-item.name.J_userMenu').textContent.trim();
        const giftname =giftHtml.querySelector('.cont-item.send-gift img').getAttribute('alt');
        // 使用正则表达式提取数字
        const num = giftHtml.querySelector('.send-gift').nextElementSibling.textContent.trim();
        const match = num.match(/\d+/);
        const num_n = match[0];
        store_gift(username, giftname, num_n);



    }
    function deal_people(peopleInHtml) {
        const name = peopleInHtml.querySelector('[class^="name--"]').textContent.trim();
        store_people(name);
    }
    function deal_barrage(barrageHtml) {
        // 1. 获取弹幕文本类

        const name = barrageHtml.querySelector('.name.J_userMenu').textContent.trim();;
        const msg = barrageHtml.querySelector('.msg').textContent.trim();;
        store_barrage(name, msg);

        if (msg in barrageFrequency) {
            barrageFrequency[msg] += 1;
        } else {
            barrageFrequency[msg] = 1;
        }

    }
    function deal_barrage_frequency(barrageHtml) {
        const msg = barrageHtml.querySelector('.msg').textContent.trim();;
        if (msg in barrageFrequency) {
            barrageFrequency[msg] += 1;
        } else {
            barrageFrequency[msg] = 1;
        }
    }

    observer.observe(barrageContainer, { childList: true, subtree: true });
    // 每隔一定时间（例如5秒）输出弹幕频率统计结果
    const startTime = new Date();
    const timeString = startTime.toLocaleTimeString();
    const interval = 5000;
    setInterval(() => {
        statsDiv.innerHTML = `<h1 style="color: red;">弹幕频率统计, ${interval/1000}秒一次</h1>`;
        statsDiv.innerHTML += `<p style="color: green;"> start ${startTime.toLocaleTimeString()}</p>`;

        statsDiv.innerHTML += `<p  style="color: green;"> end   ${new Date().toLocaleTimeString()}</p>`;

        total += Object.keys(barrageFrequency).length;
        statsDiv.innerHTML += `<p  style="color: yellow;"> total ${total}`;
        const sortedBarrage = Object.entries(barrageFrequency).sort((a, b) => b[1] - a[1]).slice(0, 20);
        sortedBarrage.forEach(([text, count]) => {
            const p = document.createElement('p');
            p.textContent = `${text}: ${count}`;
            statsDiv.appendChild(p);
        });
        barrageFrequency = {};
    }, interval);

    setInterval(() => {
        console.clear();
    }, 500000);

    store_init();
    IDBStore('gift_price', { gift_name: "虎粮", price: 1});

    function store_gift(username, giftname, number){
        let gift = {room_name:room_name, username: username, giftname: giftname, number:number, money: number * 1, time: new Date().toLocaleString()};
        IDBStore("gift", gift);
    }

    function store_barrage(name, msg) {
        //console.log(`store barrage ${name} : ${msg}`);
        let barrage = {room_name:room_name,name: name, message: msg, time: new Date().toLocaleString()};
        IDBStore("barrage", barrage);
    }
    function store_people(name){
        let people = {room_name:room_name,name: name, time: new Date().toLocaleString()};
        IDBStore("people", people);
    }

    function store_init() {
        // 在 Tampermonkey 脚本中使用 IndexedDB
        console.log("store init.");
        // 打开或者创建一个名为 myDatabase 的数据库
        var request = indexedDB.open('myDatabase', 1);

        // 当数据库需要升级时（包括首次创建数据库），触发这个事件
        request.onupgradeneeded = function (event) {
            var db = event.target.result;

            // 创建一个名为 barrage 的对象存储，主键为自动递增的 id
            if (!db.objectStoreNames.contains('barrage')) {
                db.createObjectStore('barrage', { keyPath: 'id', autoIncrement: true });
            }
            // 创建一个名为 gift 的对象存储，主键为自动递增的 id
            if (!db.objectStoreNames.contains('gift')) {
                db.createObjectStore('gift', { keyPath: 'id', autoIncrement: true });
            }
            // 创建一个名为 people 的对象存储，主键为自动递增的 id
            if (!db.objectStoreNames.contains('people')) {
                db.createObjectStore('people', { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains('gift_price')) {
                db.createObjectStore('gift_price', { keyPath: 'gift_name'});
            }
            console.log('对象存储 barrage gift people创建成功');
        };

        // 当数据库打开成功时的回调函数
        request.onsuccess = function (event) {
            // 获取数据库对象
            var db = event.target.result;

            IDBStore = function (storeName, data) {
                operateOnStore(db, storeName, data);
            }

        };

        // 当数据库打开失败时的回调函数
        request.onerror = function (event) {
            console.error('数据库打开失败');
        };

    }
    function getGiftPrice(giftname) {
        //console.log("price",giftname);
        return new Promise((resolve, reject) => {
            IDBStore("gift_price").get(giftname).then(data => {
                if (data) {
                    resolve(data[0].price);
                } else {
                    reject("Gift price not found");
                }
            }).catch(error => {
               console.log(error);

                reject(error);
            });
        });
    }
    function operateOnStore(db, storeName, data) {
        const transaction = db.transaction([storeName], 'readwrite');
        const objectStore = transaction.objectStore(storeName);

        // 如果传入了 data 参数，则向对象存储空间写入数据
        if (data) {
            objectStore.add(data); // 添加数据到对象存储空间
            //console.log('已写入数据:', data);
        } else { // 否则从对象存储空间读取数据
            const getRequest = objectStore.getAll();
            getRequest.onsuccess = function(event) {
                const items = event.target.result;
                console.log('已读取数据:', items);
            };
        }
    }
})();