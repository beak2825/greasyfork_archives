// ==UserScript==
// @name         知乎浏览历史记录
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  你有没有经历过"浏览了一个知乎回答后因为没有收藏或点赞当再次想看时却找不到"的痛苦?本脚本将你在知乎首页点开过的回答保存到你的知乎收藏夹"浏览记录"下, 这样再也不用担心找不到看过的回答了
// @author       wang0.618@qq.com
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/36459/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/36459/%E7%9F%A5%E4%B9%8E%E6%B5%8F%E8%A7%88%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getJson(api,callback){
        let oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
            if(callback)
                callback(e.target.response);
        };
        oReq.open('GET', api, true);
        oReq.setRequestHeader("Content-type","application/json");
        oReq.responseType = 'json';
        oReq.withCredentials = true;
        oReq.send();
    }
    function postJson(api,data,callback){
        let oReq = new XMLHttpRequest();
        oReq.onload = function (e) {
            if(callback)
                callback(e.target.response);
        };
        oReq.open('POST', api, true);
        oReq.setRequestHeader("Content-type","application/json");
        oReq.responseType = 'json';
        oReq.withCredentials = true;
        if(data)
            oReq.send(JSON.stringify(data));
        else
            oReq.send();
    }

    function get_collection_id(){
        let collection_name = '浏览记录';
        if(!window.localStorage.zhihu_collect_id){
            let uid = JSON.parse(document.querySelector('[data-zop-usertoken]').dataset["zopUsertoken"])["urlToken"];
            // let url = "https://www.zhihu.com/api/v4/people/"+uid+"/collections";
            let url = 'https://www.zhihu.com/api/v4/collections/contents/answer/12217049?offset=0&limit=100';
            getJson(url,function(data) {
                let collection_id = undefined;
                for (let i = data.data.length - 1; i >= 0; i--) {
                    if(data.data[i].title==collection_name){
                        collection_id = data.data[i].id;
                        break;
                    }
                }
                if(!collection_id){
                    if(uid) // 已经登陆
                        alert("知乎浏览历史记录脚本: 请手动创建一个名为'浏览记录'的知乎收藏夹，来保存您查看过的回答。请在创建完收藏夹后刷新本页");
                }else{
                    window.localStorage.zhihu_collect_id = collection_id;
                    console.log("知乎浏览历史记录脚本: 收藏夹id %s", collection_id)
                }
            });
        }

    }

    function collect(item_id, type){
        try{

            if(window.localStorage.zhihu_collect_id)
                postJson('https://www.zhihu.com/api/v4/collections/'+window.localStorage.zhihu_collect_id+'/contents?content_id='+item_id+'&content_type='+type.toLowerCase());
        }catch(e){
            console.log(e);
        }
    }

    get_collection_id();

    // 回答页面
    let re = /www.zhihu.com\/question\/.*?\/answer\/([0-9]*)/;
    let match = re.exec(window.location.href);
    if(match){
        console.log("知乎浏览历史记录脚本: 收藏回答 %s", match[match.length-1]);
        collect(match[match.length-1], 'answer');
    }

    // 专栏页面
    re = /zhuanlan.zhihu.com\/p\/([0-9]*)/;
    match = re.exec(window.location.href);
    if(match){
        console.log("知乎浏览历史记录脚本: 收藏文章 %s", match[match.length-1]);
        collect(match[match.length-1], 'answer');
    }

    // 问题页面，收藏第一个回答
    re = /www.zhihu.com\/question\/([0-9]*)$/;
    match = re.exec(window.location.href);
    if(match){
        let info = JSON.parse(document.querySelector('.AnswerItem').dataset.zop);
        console.log("知乎浏览历史记录脚本: 收藏问题下的第一个回答 %s", JSON.stringify(info));
        collect(info['itemId'], info['type']);
    }

    // 点击
    document.addEventListener("click", function(e) {
        // loop parent nodes from the target to the delegation node
        for (let target = e.target; target && target != this; target = target.parentNode) {
            if (target.matches(".AnswerItem,.ArticleItem")) {
                let info = JSON.parse(target.dataset.zop);
                console.log("知乎浏览历史记录脚本: 点击 %s", JSON.stringify(info));
                collect(info['itemId'], info['type']);
                break;
            }

        }
    }, true);



})();
