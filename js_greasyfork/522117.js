// ==UserScript==
// @name         易刷cookie登陆
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  易刷cookie登陆 - 放课后  (国际服 台服)
// @author       放课后
// @match        https://www.pathofexile.com/*
// @match        https://pathofexile.com/*
// @match        https://www.pathofexile.tw/*
// @match        https://pathofexile.tw/*
// @license MIT
// @run-at       document-start
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/522117/%E6%98%93%E5%88%B7cookie%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/522117/%E6%98%93%E5%88%B7cookie%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==


function gmCookie(url) {
	return new Promise((resolve, reject) => {
        if (!window.GM_cookie) reject('缺少GM_cookie，请先通过@grant引入！');
		GM_cookie('list', {url}, (cookie, error) => {
			if (error || !Array.isArray(cookie)) {
				reject(error);
			} else {
				const promises = [];
				async function alldone() {
					await Promise.all(promises);
					promises.length = 0;
				}
				function proxySet(target, prop, value) {
					if (prop !== 'name' && target[prop] !== value) {
						promises.push(new Promise(resolve => {
							GM_cookie('set', {...target, url}, resolve);
						}));
						target[prop] = value;
					}
				}
				const cookieObj = {$alldone: alldone};
				for (const item of cookie) {
					cookieObj[item.name] = new Proxy(item, {set: proxySet});
				}
				resolve(new Proxy(cookieObj, {
					set: function(target, prop, value) {
						value.name = prop;
						promises.push(new Promise(resolve => {
							GM_cookie('set', {...value, url}, resolve);
						}));
						target[prop] = new Proxy(value, {set: proxySet});
					},
					deleteProperty: function(target, prop) {
						promises.push(new Promise(resolve => {
							GM_cookie('delete', {...target[prop], url}, resolve);
						}));
						return delete target[prop];
					}
				}));
			}
		});
	});
}
(async () => {

    'use strict';
    const checkInterval = 5000;
    let lastPoessid = null

    function checkLocalStorage() {
        gmCookie('.pathofexile.com').then(async cookie => {
            // 读取cookie
            if(cookie && cookie.POESESSID && lastPoessid != cookie.POESESSID.value){
                lastPoessid = cookie.POESESSID.value
                console.log(cookie);
                postPromise('http://127.0.0.1:29899/api/cookies', {cookies : cookie}).then(res => {
                }).catch(e => {

                })
            }
            await cookie.$alldone();
        }).catch(e => {
            console.error(e);
        })
    }

    setInterval(checkLocalStorage, checkInterval);


    function ajax(url, method, data, successCallback, errorCallback) {
        // 1. 创建 XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        var headers = {
            'Content-Type': 'application/json',
            'x-requested-with':'XMLHttpRequest'
        };

        // 2. 初始化请求
        xhr.open(method, url, true);

        // 3. 设置请求头
        for (var key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        // 4. 定义回调函数来处理响应
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) { // 4 表示请求已完成
                if (xhr.status === 200) { // 200 表示成功
                    if (successCallback) {
                        successCallback(xhr.responseText);
                    }
                } else {
                    if (errorCallback) {
                        errorCallback(xhr.statusText);
                    }
                }
            }
        };

        // 5. 发送请求，并传递请求体数据（仅在 POST 和 PUT 请求时需要）
        if (method === 'POST' || method === 'PUT') {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    }

    // 封装 GET 请求
    function get(url, successCallback, errorCallback) {
        ajax(url, 'GET', null, successCallback, errorCallback);
    }

    // 封装 POST 请求
    function post(url, data, successCallback, errorCallback) {
        ajax(url, 'POST', data, successCallback, errorCallback);
    }

    // 封装 PUT 请求
    function put(url, data, successCallback, errorCallback) {
        ajax(url, 'PUT', data, successCallback, errorCallback);
    }

    // 封装 GET 请求的 Promise 版本
    function getPromise(url) {
        return new Promise((resolve, reject) => {
            get(url, function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
    }

    // 封装 POST 请求的 Promise 版本
    function postPromise(url, data) {
        return new Promise((resolve, reject) => {
            post(url, data, function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
    }

    // 封装 PUT 请求的 Promise 版本
    function putPromise(url, data) {
        return new Promise((resolve, reject) => {
            put(url, data, function (response) {
                resolve(response);
            }, function (error) {
                reject(error);
            });
        });
    }

})();