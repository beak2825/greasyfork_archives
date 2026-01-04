// ==UserScript==
// @namespace         https://github.com/vbonluk/

// @name              京东双十一红包插件2019

// @description       2019双十一自动做任务：逛商品，逛店铺，好玩互动，视频直播，精彩会场，一劳永逸。

// @homepageURL       https://github.com/vbonluk/JDLuckyMoneyActivity
// @supportURL        https://github.com/vbonluk/JDLuckyMoneyActivity/issues/

// @author            vbonluk
// @version           1.3
// @license           MIT

// @compatible        chrome Chrome_46.0.2490.86 + TamperMonkey + 脚本_1.3 测试通过
// @compatible        firefox Firefox_42.0 + GreaseMonkey + 脚本_1.2.1 测试通过
// @compatible        opera Opera_33.0.1990.115 + TamperMonkey + 脚本_1.1.3 测试通过
// @compatible        safari 未测试

// @match             *happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7/index.html
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/391483/%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E7%BA%A2%E5%8C%85%E6%8F%92%E4%BB%B62019.user.js
// @updateURL https://update.greasyfork.org/scripts/391483/%E4%BA%AC%E4%B8%9C%E5%8F%8C%E5%8D%81%E4%B8%80%E7%BA%A2%E5%8C%85%E6%8F%92%E4%BB%B62019.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function Toast(msg, duration) {
        duration = isNaN(duration) ? 1000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }

    function Toast2(msg, duration) {
        duration = isNaN(duration) ? 1000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 42%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }

    function Toast3(msg, duration) {
        duration = isNaN(duration) ? 1000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 80px;color: rgb(255, 255, 255);line-height: 20px;text-align: center;border-radius: 4px;position: fixed;top: 28%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    }

    let productList = [],
        shopList = [],
        url = "https://api.m.jd.com/client.action";

    function autoPost(id, type, index, progress) {
        fetch(`${url}?timestamp=${new Date().getTime()}`, { method: "POST", mode: "cors", credentials: "include", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `functionId=raisepacket_collectScore&body={"type":${type},"ext":"${id}","appsign":1,"msgsign":2}&client=wh5` })
            .then(function(response) { return response.json() })
            .then(function(res) {
                if (type == 4) {
                    Toast(`逛商品 任务已完成 ${index + 1 } 次,进度 ${parseInt(progress)}%,继续进行中,请不要关闭本页面`)
                } else if (type == 2) {
                    Toast(`逛店铺 任务已完成 ${index + 1 } 次,进度 ${parseInt(progress)}%,继续进行中,请不要关闭本页面`)
                } else if (type == 5) {
                    Toast(`好玩互动 任务已完成 ${index + 1 } 次,进度 ${parseInt(progress)}%,继续进行中,请不要关闭本页面`)
                } else if (type == 10) {
                    Toast(`视频直播 任务已完成 ${index + 1 } 次,进度 ${parseInt(progress)}%,继续进行中,请不要关闭本页面`)
                } else if (type == 3) {
                    Toast(`精彩会场 任务已完成 ${index + 1 } 次,进度 ${parseInt(progress)}%,继续进行中,请不要关闭本页面`)
                    if (index == 2) {
                        setTimeout(() => {
                            Toast(`任务已全部完成，请打开京东app查看进度，有异常请重新运行本插件`, 1000000);
                        }, 1500)
                    }
                }
                // Toast(res.data.biz_msg);
            });
    }

    function start() {
        Toast2("任务进行中", 100000);
        //Toast3("商业广告：POS 0.55%不加3,正规一清不跳码,全国邮寄免费送,微信：tianpos", 100000);
        fetch(`${url}?${new Date().getTime()}`, { method: "POST", mode: "cors", credentials: "include", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: 'functionId=raisepacket_getShopAndProductList&body=&client=wh5' })
            .then(function(response) { return response.json() })
            .then(function(res) {
                if (res.code != 0) {
                    Toast("未登录,3秒后自动跳转到登录页面", 3000);
                    setTimeout(() => {
                        unlogin();
                    }, 3000)
                } else {
                    productList = res.data.result.productList;
                    shopList = res.data.result.shopList;
                    //Toast(`获取到任务,商品：${productList.length} 商品：${shopList.length}`);
                    autoProductTask();
                }
            });
    }

    function unlogin() {
        window.location.href = "https://passport.jd.com/new/login.aspx?ReturnUrl=https%3A%2F%2Fhappy.m.jd.com%2fbabelDiy%2fGZWVJFLMXBQVEBDQZWMY%2fXJf8bH6oXDWSgS91daDJzXh9bU7%2findex.html";
    }

    //逛商品
    function autoProductTask() {
        for (let i = 0, leng = productList.length; i < leng; i++) {
            (function(index) {
                setTimeout(() => {
                    let item = productList[index];
                    autoPost(item['id'], 4, index, (i + 1) / productList.length * 100);
                    //Toast(`商品总任务数：${leng} 当前任务数：${index + 1}`);
                    if (leng - 1 == index) {
                        setTimeout(() => {
                            autoShopTask();
                        }, 1000)
                    }
                }, index * 1500)
            })(i)
        }
    }
    //逛店铺
    function autoShopTask() {
        for (let i = 0, leng = shopList.length; i < leng; i++) {
            (function(index) {
                setTimeout(() => {
                    let item = shopList[index];
                    autoPost(item['id'], 2, index, (i + 1) / shopList.length * 100);
                    //Toast(`商铺总任务数：${leng} 当前任务数：${index + 1}`);
                    if (leng - 1 == index) {
                        setTimeout(() => {
                            autoPlay();
                        }, 1000)
                    }
                }, index * 1500)
            })(i)
        }
    }
    //好玩互动
    function autoPlay() {
        for (let i = 0, leng = 4; i < leng; i++) {
            (function(index) {
                setTimeout(() => {
                    autoPost(0, 5, index, (i + 1) / 4 * 100);
                    //Toast(`好玩互动：${leng} 当前任务数：${index + 1}`);
                    if (leng - 1 == index) {
                        setTimeout(() => {
                            autoInteract();
                        }, 1000)
                    }
                }, index * 1000)
            })(i)
        }
    }
    //视频直播
    function autoInteract() {
        for (let i = 0, leng = 4; i < leng; i++) {
            (function(index) {
                setTimeout(() => {
                    autoPost(0, 10, index, (i + 1) / 4 * 100);
                    //Toast(`视频直播：${leng} 当前任务数：${index + 1}`);
                    if (leng - 1 == index) {
                        setTimeout(() => {
                            autoShopping();
                        }, 1000)
                    }
                }, index * 1000)
            })(i)
        }
    }
    //精彩会场
    function autoShopping() {
        for (let i = 0, leng = 3; i < leng; i++) {
            (function(index) {
                setTimeout(() => {
                        autoPost(0, 3, index, (i + 1) / 3 * 100);
                        //Toast(`精彩会场：${leng} 当前任务数：${index + 1}`);
                    },
                    index * 1000)
            })(i)
        }
    }
    start();
})();