// ==UserScript==
// @name         斗鱼获取礼物价值json
// @namespace    https://github.com/qianjiachun
// @version      0.0.1
// @description  获取礼物价值json
// @author       小淳
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/topic/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/408083/%E6%96%97%E9%B1%BC%E8%8E%B7%E5%8F%96%E7%A4%BC%E7%89%A9%E4%BB%B7%E5%80%BCjson.user.js
// @updateURL https://update.greasyfork.org/scripts/408083/%E6%96%97%E9%B1%BC%E8%8E%B7%E5%8F%96%E7%A4%BC%E7%89%A9%E4%BB%B7%E5%80%BCjson.meta.js
// ==/UserScript==

(function() {
    'use strict';
    getJson()

})();

async function getJson() {
    let a = await getYuchiGift("5189167");
    let b = await getBagGift();
    let obj = {};
    for (const item in b.data) {
        obj[item] = Number(Number(b.data[item].devote).toFixed(0));
    }
    Object.assign(obj, a);
    console.log(JSON.stringify(obj));
}

function getYuchiGift(rid) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://open.douyucdn.cn/api/RoomApi/room/" + rid,
            responseType: "json",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(response) {
                let ret = response.response;
                let obj = {};
                for (let i = 0; i < ret.data.gift.length; i++) {
                    obj[ret.data.gift[i].id] = Number(Number(ret.data.gift[i].gx).toFixed(0));
                }
                resolve(obj);
            }
        });
    })
}

function getBagGift() {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json",
            responseType: "text",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function(response) {
                let ret = response.response;
                let len = ret.length;
                ret = ret.substring(17, len - 2);
                resolve(JSON.parse(ret));
            }
        });
    })
}
