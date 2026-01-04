// ==UserScript==
// @name         斗鱼自动摇荧光棒
// @namespace    https://www.douyu.com/
// @version      2024-04-25
// @description  根据背包里的荧光棒数量，平均摇给每个有牌子的主播~
// @author       ZingLix
// @match			*://*.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495280/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%91%87%E8%8D%A7%E5%85%89%E6%A3%92.user.js
// @updateURL https://update.greasyfork.org/scripts/495280/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E6%91%87%E8%8D%A7%E5%85%89%E6%A3%92.meta.js
// ==/UserScript==


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
        console.log("请求失败!", err);
    })
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function sendGift(gid, count, rid) {
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

(function() {
    'use strict';
    window.addEventListener("load", function(event) {
   
    let giftId = 0;
    let giftCount = 0;
    let rid = "9999";
    getBagGifts(rid, (ret) => {
        let chunkNum = ret.data.list.length;
        if (chunkNum > 0) {
            for (let i = 0; i < chunkNum; i++) {
                if (ret.data.list[i].id == 268) {
                    giftId = 268;
                    giftCount = ret.data.list[i].count;
                    break;
                }
            }
            if (giftId == 0) {
                console.log("无荧光棒");
                return;
            };
            fetch('https://www.douyu.com/member/cp/getFansBadgeList',{
                method: 'GET',
                mode: 'no-cors',
                cache: 'default',
                credentials: 'include',
            }).then(res => {
                return res.text();
            }).then(async (doc) => {
                doc = (new DOMParser()).parseFromString(doc, 'text/html');
                let a = doc.getElementsByClassName("fans-badge-list")[0].lastElementChild;
                let n = a.children.length;

                let sendNum = Math.floor(giftCount / n);
                if(sendNum == 0) {
                    console.log("礼物不足");
                    return;

                }
                for (let i = 0; i < n; i++) {
                    let rid = a.children[i].getAttribute("data-fans-room"); // 获取房间号
                    await sleep(250).then(() => {
                        sendGift(giftId, Number(sendNum), rid).then(data => {
                            if (data.msg == "success") {
                                console.log(rid + "赠送荧光棒成功");
                            } else {
                                console.log(rid + "赠送失败 " + data.msg);
                            }
                        }).catch(err => {
                            console.log(rid + "赠送失败");
                            console.log(rid, err);
                        })
                    });
                }
            }).catch(err => {
                console.log("请求失败!", err);
            })
        } else {
            console.log("背包礼物为空");
        }
    });
    })
})();