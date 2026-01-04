// ==UserScript==
// @name         Tự động nhặt bảo
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Tự động nhặt bảo trên sangtacviet
// @match        *://*/user/0/
// @match        *://*/truyen/*/*/*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486278/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20nh%E1%BA%B7t%20b%E1%BA%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/486278/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20nh%E1%BA%B7t%20b%E1%BA%A3o.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
 
    var div = document.createElement('div');
    div.id = 'notification';
    div.style = 'position: fixed;top: 0;right: 0;border: 1px solid gray;border-radius: 5px;padding: 10px;background-color: #ccc;margin: 10px;display:none;';
    document.body.appendChild(div);
 
    div.onclick = function () {
        hideNotification();
    }
 
    var showNotification = (message) => {
        var el = document.getElementById('notification');
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => {
            el.style.display = 'none';
        }, 15000)
    }
 
    var hideNotification = () => {
        var el = document.getElementById('notification');
        el.style.display = 'none';
    }
 
    var rand = (min, max) => parseInt(Math.random() * (max - min) + min);
 
    var request = async (params, query) => {
        var url = '/index.php';
        if (query) {
            url = url + query;
        }
        var retry = 0;
        try {
            const response = await fetch(url, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded",
                },
                "body": params,
                "method": "POST"
            });
            if (!response.ok) {
                if (retry == 3) {
                    retry = 0;
                    throw new Error("Network response was not OK");
                }
                setTimeout(function () {
                    request(params, retry++);
                }, 1000);
            } else {
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch {
                    return text;
                }
            }
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };
 
    var count = 0;
    var lucky = 200;
    var intervalId;
 
    var startCollectItem = async () => {
        console.log("Starting request...");
        try {
            var response = await isCollectible();
            if (response.code == 1) {
                setTimeout(async () => {
                    var collectableItem = await checkItem();
                    if (collectableItem && collectableItem.info) {
                        setTimeout(() => {
                            showNotification(collectableItem.info);
                            collectItem(collectableItem);
                        }, rand(1, 5))
                    }
                }, rand(1, 5))
            }
        } catch (error) {
            console.log("error :>> ", error.message);
        }
    }
 
    var isCollectible = () => {
        var params = "ngmar=tcollect&ajax=trycollect&ngmar=iscollectable";
        var query = "?ngmar=iscollectable";
        return request(params, query);
    };
 
    var checkItem = () => {
        var params = "ngmar=collect&ajax=collect";
        return request(params);
    };
 
    var collectItem = (collectableItem) => {
        count++;
        var query = "?ngmar=fcl";
        var params = "ajax=fcollect&c=" + rand(10000, 800000);
        var cType = collectableItem.type;
        if (cType == 3 || cType == 4) {
            var infoWithoutHTML = collectableItem.info.replace(/<[^>]*>/g, '');
            params += "&newname=" + encodeURI(collectableItem.name) + "&newinfo=" + encodeURI(infoWithoutHTML);
        }
        return request(params, query);
    };
 
    var getLuckyNumber = async () => {
        var waitTime = (lucky < 50 ? 10 : lucky < 150 ? 6 : lucky < 250 ? 4 : 2) * 60 * 1000;
        window.clearInterval(intervalId);
        startInterval(waitTime);
    };
 
    var addPageCount = function () {
        var query = '?ngmar=readcounter'
        var params = "sajax=read";
        return request(params, query);
    }
 
    var startInterval = (waitTime) => {
        intervalId = window.setInterval(() => {
            if (count == 10) {
                window.location.reload();
                return
            }
            addPageCount();
            setTimeout(async () => {
                startCollectItem();
            }, rand(10, 50) * 1000);
        }, waitTime);
    };
 
    startCollectItem();
    getLuckyNumber();
 
})();