// ==UserScript==
// @name         Check My Ironfish Status
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Check My Ironfish Status! for myself
// @author       QGX
// @match        https://testnet.ironfish.network/*
// @match        https://ironfish.network/*
// @include      https://ironfish.network/*
// @include      https://testnet.ironfish.network/*
// @connect      api.ironfish.network
// @icon         http://thirdqq.qlogo.cn/g?b=sdk&k=OZmtIibPRmvU1jfoX081PGg&s=140&t=1592560201
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440726/Check%20My%20Ironfish%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/440726/Check%20My%20Ironfish%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //账号配置
    let names = ["emoji","beijixing","gggbang","shine","diudodo","zhangliao","xiaofeng","cxocxx","strong","wqe778","bba86","reed6"];
    let overList = ["feng2222021","sunyuchen","zcp","okex","QDEV"];
    async function go(){
        for(let i =0 ;i<names.length;i++){
            let p = new Promise(function(res,rej){
                GM_xmlhttpRequest({
                    "url": `https://api.ironfish.network/users?order_by=rank&search=${names[i]}`,
                    "method": "GET",
                    "timeout": 0,
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                        "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site"
                    },
                    onload:function(xhr){
                        res(xhr.responseText)
                    }
                });
            })
            await p.then(res=>{
                let data = JSON.parse(res);
                if(data.data.length>0){
                    let a = data.data.find(it=>it.graffiti==names[i]);
                    if(a.total_points>0){
                        console.log(`%c 账号：${names[i]},积分：${a.total_points}`,'color:green;font-size:20px;background:#ddd')
                    }else{
                        console.log(`%c 账号：${names[i]},积分：${a.total_points}`,'color:red;font-size:20px;background:#ddd')
                    }
                }
            })
        }
    }
    async function qgstart(){
        console.log("%c ----------开始检查出块情况-------",'color:blue;font-size:20px;')
        await go();
        console.log("%c ----------结束检查出块情况-------",'color:blue;font-size:20px;')
    }
    let time = setTimeout(qgstart,2000)
    })();