// ==UserScript==
// @name         JD 全民养红包活动自动脚本
// @namespace    https://greasyfork.org/zh-CN/users/230773
// @version      0.2.1
// @description  根据 https://www.iqshw.com/wyfx/173941.html 修改而来，可自动完成 JD 全民养红包活动
// @author       hello world
// @match        https://happy.m.jd.com/babelDiy/GZWVJFLMXBQVEBDQZWMY/XJf8bH6oXDWSgS91daDJzXh9bU7/index.html
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391525/JD%20%E5%85%A8%E6%B0%91%E5%85%BB%E7%BA%A2%E5%8C%85%E6%B4%BB%E5%8A%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/391525/JD%20%E5%85%A8%E6%B0%91%E5%85%BB%E7%BA%A2%E5%8C%85%E6%B4%BB%E5%8A%A8%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let productList = [],
    shopList = [],
    url = "https://api.m.jd.com/client.action";


function doLog(log) {
    console.log(log);
    if ($(".container .script-toast").length === 0) {
        let className = "script-toast";
        $(".container .mod-toast").after(`<div class="${className}" style="position:fixed;width:100%;z-index:100;"></div>`);
    }
    let dom = $(`<div style="font-size:10px;color:#fff;background:rgba(0,0,0,0.3);width:100%;text-align:center;padding:6px;z-index:100;">${log}</div>`);
    $(".container .script-toast").append(dom);
    setTimeout(() => {
        $(dom).remove();
    }, 3000);
}

function doAlert(log) {
    alert(log);
}

function autoPost(id, type) {
    fetch(`${url}?timestamp=${new Date().getTime()}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `functionId=raisepacket_collectScore&body={"type":${type},"ext":"${id}","appsign":1,"msgsign":2}&client=wh5`
    }).then(function (response) {
        return response.json()
    }).then(function (res) {
        doLog(res.data.biz_msg)
    })
}

function start() {
    fetch(`${url}?${new Date().getTime()}`, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "functionId=raisepacket_getShopAndProductList&body=&client=wh5"
    }).then(function (response) {
        return response.json()
    }).then(function (res) {
        productList = res.data.result.productList;
        shopList = res.data.result.shopList;
        doLog(`获取到任务,商品：${productList.length}商品：${shopList.length}`);
        autoProductTask()
    })
}

function autoProductTask() {
    for (let i = 0, leng = productList.length; i < leng; i++) {
        (function (index) {
            setTimeout(() => {
                let item = productList[index];
                autoPost(item["id"], 4);
                doLog(`商品总任务数：${leng}当前任务数：${index+1}`);
                if (leng - 1 == index) {
                    autoShopTask()
                }
            }, index * 1500)
        })(i)
    }
}

function autoShopTask() {
    for (let i = 0, leng = shopList.length; i < leng; i++) {
        (function (index) {
            setTimeout(() => {
                let item = shopList[index];
                autoPost(item["id"], 2);
                doLog(`商铺总任务数：${leng}当前任务数：${index+1}`);
                if (leng - 1 == index) {
                    autoPlay()
                }
            }, index * 1500)
        })(i)
    }
}

function autoPlay() {
    for (let i = 0, leng = 4; i < leng; i++) {
        (function (index) {
            setTimeout(() => {
                autoPost(0, 5);
                doLog(`好玩互动：${leng}当前任务数：${index+1}`);
                if (leng - 1 == index) {
                    autoInteract()
                }
            }, index * 1000)
        })(i)
    }
}

function autoInteract() {
    for (let i = 0, leng = 4; i < leng; i++) {
        (function (index) {
            setTimeout(() => {
                autoPost(0, 10);
                doLog(`视频直播：${leng}当前任务数：${index+1}`);
                if (leng - 1 == index) {
                    autoShopping()
                }
            }, index * 1000)
        })(i)
    }
}

function autoShopping() {
    for (let i = 0, leng = 3; i < leng; i++) {
        (function (index) {
            setTimeout(() => {
                autoPost(0, 3);
                doLog(`精彩会场：${leng}当前任务数：${index+1}`)
                if (leng - 1 == index) {
                    doAlert("任务全部完成");
                }
            }, index * 1000)
        })(i)
    }
}

start();