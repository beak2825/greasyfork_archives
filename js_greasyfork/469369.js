// ==UserScript==
// @name         老版自动登陆种菜
// @namespace    worldoffairy
// @version      1.3
// @description  自动种菜
// @match        https://www.worldoffairy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469369/%E8%80%81%E7%89%88%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E7%A7%8D%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/469369/%E8%80%81%E7%89%88%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E7%A7%8D%E8%8F%9C.meta.js
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
            try{if (arguments[0].indexOf('login ok') > -1) {
                window.token = arguments[0].split(': ')[1];
                console.log('内部token'+window.token);
            }}catch(error){}
        }
    })(console.log);
     var container = document.createElement('div');
    // 修改 container 的样式
     container.style.position = 'fixed';
     container.style.top = '0';
     container.style.left = '0';
     container.style.bottom = '0';
     container.style.width = '100px';
     container.style.overflowY = 'auto';
     container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
     container.style.padding = '10px';
     container.style.boxSizing = 'border-box';
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
         // 修改 landLabel 的样式
        landLabel.style.display = 'block';
        landLabel.style.marginBottom = '5px';
        var landDropdown = document.createElement('select');
         // 修改 landDropdown 的样式
        landDropdown.style.width = '100%';
        landDropdown.style.marginBottom = '10px';
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
        landDropdown.value = 2006;
        // Create a save button for each dropdown
        var saveButton = document.createElement('button');
        saveButton.textContent = '启动';
        // 修改 saveButton 的样式
        saveButton.style.width = '100%';
        saveButton.style.marginBottom = '20px';
        saveButton.addEventListener('click', function() {
            var landSelect = this.previousElementSibling;
            var landId = parseInt(landSelect.dataset.landId);
            var seedId = parseInt(landSelect.value);
            console.log('Land ' + landId + ' selected seed ' + seedId);
            var seed = seedOptions.find(function(option) {
                return option.seed_id == seedId;
            });
            console.log(seed)
            if (seed) {
                var interval = seed.seed_time * 1000;
                // 将循环流程封装到一个函数中
                function loop() {
                    setTimeout(function() {
                        buy(seedId, function(response) {
                            console.log('Buy response:', response);
                            setTimeout(function() {
                                sow(seedId, landId, function(response) {
                                    console.log('Sow response:', response);
                                    setTimeout(function() {
                                        harvest(seedId, landId, function(response) {
                                            console.log('Harvest response:', response);
                                            setTimeout(function() {
                                                sell(seedId, function(response) {
                                                    console.log('Sell response:', response);
                                                    // 在sell方法完成后，调用loop函数来继续循环
                                                    loop();
                                                });
                                            }, 5000);
                                        });
                                    }, interval);
                                });
                            }, 5000);
                        });
                    }, 5000);
                }
                // 开始循环
                loop();
                // 添加弹窗提示
                alert('启动成功！');
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
        xhrPost(url, data, callback);
    }
    function harvest(seed_id, land_id, callback) {
        var url = 'https://www.worldoffairy.com/serve/auth/farm/harvest';
        var data = {
            "land_id": land_id,
            "seed_id": seed_id
        };
        xhrPost(url, data, callback);
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
        xhrPost(url, data, callback);
    }
 })();