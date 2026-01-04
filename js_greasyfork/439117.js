// ==UserScript==
// @name         Rexze自用直播脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  直播全屏，自动选择高清，斗鱼自动续牌
// @author       Rexze
// @match        https://www.douyu.com/*
// @match        https://live.bilibili.com/*
// @match        https://www.huya.com/*
// @connect      douyucdn.cn
// @connect      douyu.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439117/Rexze%E8%87%AA%E7%94%A8%E7%9B%B4%E6%92%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439117/Rexze%E8%87%AA%E7%94%A8%E7%9B%B4%E6%92%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var dyContinueFansRoomId = 9999; //斗鱼续牌房间id

(function() {
    window.onload = function() {
        let url = window.location.host;
        let urlList = url.split('.');
        if (urlList.includes('douyu')) {
            douyu();
        } else if (urlList.includes('bilibili')) {
            bili();
        } else if (urlList.includes('huya')) {
            huya();
        }
    }

})();

function douyu() {
    // 全屏 最高画质
    let intervalID= setInterval(() => {
        if (document.getElementsByClassName("wfs-2a8e83").length > 0) {
            document.querySelector('div.wfs-2a8e83').click();
            var qualitySelector = document.querySelectorAll(".tip-e3420a > ul > li");
            if (qualitySelector.length > 0 && !qualitySelector[0].classList.contains('selected-3a8039')) {
                qualitySelector[0].click();
            }
            clearInterval(intervalID)
        }

    }, 1000);

    // 续牌
    sleep(1000).then(() => {
        douyuContinueFansCard();
    });
}

// 自动续牌子
function douyuContinueFansCard () {
    var d = new Date();
    var date = d.getMonth().toString() + d.getDate().toString();
    if (GM_getValue('dateCache') == date) {
        return;
    } else {
        // GM_setValue('dateCache', date);
    }
    getBagGifts(dyContinueFansRoomId, (ret) => {
        let chunkList = ret.data.list;
        // let sendNum = 0;
        for (let i = 0; i < chunkList.length; i++) {
            let sendId = chunkList[i].id
            let sendNum = chunkList[i].count;
            if (chunkList[i].batchInfo.length > 0) {
                sleep(100).then(() => {
                    sendGift_bag(sendId, Number(sendNum), dyContinueFansRoomId);
                });
            } else {
                for (let j = 0; j < sendNum; j++) {
                    sleep(100).then(() => {
                        sendGift_bag(sendId, 1, dyContinueFansRoomId);
                    })
                }
            }
        }
        GM_setValue('dateCache', date);
    });
}

// 赠送背包里的东西
// gid:     礼物id
// count:   数量
// rid:     房间号
function sendGift_bag(gid, count, rid) {
    return fetch("https://www.douyu.com/japi/prop/donate/mainsite/v1", {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'include',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'propId=' + gid + '&propCount=' + count + '&roomId=' + rid + '&bizExt=%7B%22yzxq%22%3A%7B%7D%7D'
    }).then(res => {
        return res.json();
    })
}

// 获取背包内所有礼物信息(json)，传给回调函数
function getBagGifts(room_id, callback) {
    fetch('https://www.douyu.com/japi/prop/backpack/web/v1?rid=' + room_id, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
    }).then(result => {
        return result.json();
    }).then(ret => {
        callback(ret);
    }).catch(err => {
        console.log("请求失败!", err)
    })
}


function bili() {
// 不会写 呜呜呜
}

function huya() {
    // 全屏 最高画质
    let intervalID= setInterval(() => {
        if (document.getElementsByClassName("player-fullpage-btn").length > 0) {
            document.getElementsByClassName("player-fullpage-btn")[0].click();
            var qualitySelector = document.querySelectorAll(".player-videoline-videotype > ul > li");
            if (qualitySelector.length > 0 && !qualitySelector[0].classList.contains('on')) {
                qualitySelector[0].click();
            }
            clearInterval(intervalID)
        }
    }, 1000);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}