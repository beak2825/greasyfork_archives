// ==UserScript==
// @name         新版自动登陆种菜
// @namespace    worldoffairy
// @version      1.1
// @description  自动种菜
// @match        https://www.worldoffairy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469428/%E6%96%B0%E7%89%88%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E7%A7%8D%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/469428/%E6%96%B0%E7%89%88%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E7%A7%8D%E8%8F%9C.meta.js
// ==/UserScript==
 (function() {
    'use strict';
     // 定义全局变量token
    window.token = '';
     // 重写console.log方法
     console.log = (function(log) {
         return function() {
             // 将输出的内容作为参数传递给原始的console.log方法
             log.apply(console, arguments);
             // 如果输出包含login ok，则提取token值
             if (typeof arguments[0] === 'string' && arguments[0].indexOf('login ok') > -1 && arguments[0].startsWith('login ok: ')) {
                 window.token = arguments[0].split(': ')[1];
                 console.log('内部token'+window.token);
             }
         }
     })(console.log);
     var container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    // Create an input element to hold the token value
    //var input = document.createElement('input');
    //input.type = 'text';
    //input.placeholder = 'Enter your token value';
    //input.style.marginRight = '10px';
    // Create a button element to save the token value
    //var button = document.createElement('button');
    //button.textContent = '保存';
    //button.addEventListener('click', function() {
    //    console.log('Token value saved!');
    //});
    // Add the input and button to the container
    //container.appendChild(input);
    //container.appendChild(button);
    // Create a div element to hold the land and seed dropdowns
    var dropdownContainer = document.createElement('div');
    dropdownContainer.style.marginTop = '10px';
    dropdownContainer.style.display = 'flex';
    dropdownContainer.style.flexWrap = 'wrap';
    // Create 16 land dropdowns
    for (var i = 1; i <= 10; i++) {
        var landLabel = document.createElement('label');
        landLabel.textContent = i + '号地';
        landLabel.style.marginRight = '10px';
        var landDropdown = document.createElement('select');
        landDropdown.style.marginRight = '10px';
        landDropdown.dataset.landId = i;
        landDropdown.addEventListener('change', function() {
            var landId = this.dataset.landId;
            var seedId = this.value;
            console.log('Land ' + landId + ' selected seed ' + seedId);
        });
        // Add seed options to the dropdown
        var seedOptions = [
            {seed_id:2001,seed_name:"土豆",seed_time:60},
            {seed_id:2002,seed_name:"豌豆",seed_time:300},
            {seed_id:2003,seed_name:"花椰菜",seed_time:900},
            {seed_id:2004,seed_name:"番茄",seed_time:1800},
            {seed_id:2005,seed_name:"向日葵",seed_time:3600},
            {seed_id:2006,seed_name:"南瓜",seed_time:7200},
            {seed_id:2007,seed_name:"玉米",seed_time:4*3600},
            {seed_id:2008,seed_name:"接骨木",seed_time:8*3600}
        ];
        for (var j = 0; j < seedOptions.length; j++) {
            var seedOption = seedOptions[j];
            var option = document.createElement('option');
            option.value = seedOption.seed_id;
            option.textContent = seedOption.seed_name;
            landDropdown.appendChild(option);
        }
        // Set the default value of the dropdown to be blank
        landDropdown.value = '';
        // Create a save button for each dropdown
        var saveButton = document.createElement('button');
        saveButton.textContent = '启动';
        saveButton.style.marginLeft = '10px';
        saveButton.loopActive = false;
        saveButton.timeoutHandle = null; // 添加一个变量来存储setTimeout的返回值
        saveButton.addEventListener('click', function() {
            if (!this.loopActive) {
                this.loopActive = true;
                this.textContent = '停止';
                var landSelect = this.previousElementSibling;
                var landId = parseInt(landSelect.dataset.landId);
                var seedId = parseInt(landSelect.value);
                console.log('Land ' + landId + ' selected seed ' + seedId);
                var seed = seedOptions.find(function(option) {
                    return option.seed_id == seedId;
                });
                console.log(seed)
                if (seed) {
                    var seed_time = seed.seed_time * 1000;
                    var loop = (function() {
                        if (!this.loopActive) {
                            clearTimeout(this.timeoutHandle); // 取消等待中的setTimeout
                            return;
                        }
                        this.timeoutHandle = setTimeout(function() {
                            sow(seedId, landId, function(resp) {
                                if (resp.message === 'ok' || resp.message === 'invalid request') {
                                    this.timeoutHandle = setTimeout(function() {
                                        harvest(seedId, landId, function(resp) {
                                            if (resp.message === 'ok') {
                                                console.log('Harvest success');
                                                this.timeoutHandle = setTimeout(function() {
                                                    sell(seedId, function(resp) {
                                                        if (resp.message === 'ok') {
                                                            console.log('Sell success');
                                                            loop.call(this);
                                                        }
                                                    });
                                                }, 5000);
                                            }
                                        });
                                    }, seed_time);
                                }
                            });
                        }, 5000);
                    }).bind(this);
                    loop();
                }
            } else {
                this.loopActive = false;
                this.textContent = '启动';
                clearTimeout(this.timeoutHandle); // 确保在停止时取消等待中的setTimeout
            }
        });
        // Add the label, dropdown, and save button to the container
        dropdownContainer.appendChild(landLabel);
        dropdownContainer.appendChild(landDropdown);
        dropdownContainer.appendChild(saveButton);
    }
    // Add the dropdown container to the page
    container.appendChild(dropdownContainer);
    // Add the container to the page
    document.body.appendChild(container);
    function xhrPost(url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.setRequestHeader('authorization', window.token);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.message === 'ok') {
                        var currentTime = new Date();
                        console.log(currentTime);
                        callback(response);
                    } else if (response.message === 'system error') {
                        console.log('Error: ' + response.message);
                        setTimeout(function() {
                            xhrPost(url, data, callback);
                        }, 5000);
                    }
                } else {
                    console.log('Error: ' + xhr.status);
                    setTimeout(function() {
                        xhrPost(url, data, callback);
                    }, 5000);
                }
            }
        };
        xhr.send(JSON.stringify(data));
    }
     function sow(seed_id, land_id, callback) {
         var url = 'https://www.worldoffairy.com/serve/auth/farm/sow';
         var data = {
             "land_id": land_id,
             "seed_id": seed_id
         };
         xhrPost(url, data, function(response) {
             if (response.message.indexOf('not enough') > -1) {
                 console.log('Not enough seeds, buying more');
                 buy(seed_id, function() {
                     sow(seed_id, land_id, callback);
                 });
             } else if (response.message === 'ok' || response.message === 'invalid request') {
                 var seed = seedOptions.find(function(option) {
                     return option.seed_id == seed_id;
                 });
                 if (response.message === 'ok') {
                     console.log('Land ' + land_id + ' successfully planted ' + seed.seed_name);
                 } else {
                     console.log('Land ' + land_id + ' already has planted ' + seed.seed_name);
                 }
                 callback(response);
             }
         });
     }
     function harvest(seed_id, land_id, callback) {
         var url = 'https://www.worldoffairy.com/serve/auth/farm/harvest';
         var data = {
             "land_id": land_id,
             "seed_id": seed_id
         };
         xhrPost(url, data, function(response) {
             if (response.message === 'invalid request') {
                 console.log('Invalid request, waiting for 60-120 seconds');
                 var waitTime = Math.floor(Math.random() * (120 - 60 + 1)) + 60; // 获取一个60-120之间的随机数
                 setTimeout(function() {
                     harvest(seed_id, land_id, callback); // 重试harvest方法
                 }, waitTime * 1000);
             } else {
                 callback(response);
             }
         });
     }
    function sell(seed_id, callback) {
        var url = 'https://www.worldoffairy.com/serve/auth/shop/sell';
        var data = {
            "item_id": seed_id - 1000,
            "count": 1
        };
        xhrPost(url, data, callback);
    }
     function buy(seed_id, callback) {
         var url = 'https://www.worldoffairy.com/serve/auth/shop/buy';
         var data = {
             "item_id": seed_id,
             "count": 1
         };
         xhrPost(url, data, function(response) {
             if (response.message === 'not enough item inventory') {
                 console.log('not enough item inventory');
                 clearLimit(seed_id, function() {
                     buy(seed_id, callback);
                 });
             } else {
                 callback(response);
             }
         });
     }
     function clearLimit(seed_id, callback) {
         var url = 'https://www.worldoffairy.com/serve/auth/shop/clear-limit';
         var data = {
             "item_id": seed_id
         };
         xhrPost(url, data, callback);
     }
 })();