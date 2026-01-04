// ==UserScript==
// @name         爱奇艺预告片下载
// @license      GPL-3.0-only
// @namespace    http://tampermonkey.net/
// @description  用于爱奇艺预告片下载
// @author       TSCats
// @version      1.0.3
// @match        *://www.iqiyi.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498756/%E7%88%B1%E5%A5%87%E8%89%BA%E9%A2%84%E5%91%8A%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498756/%E7%88%B1%E5%A5%87%E8%89%BA%E9%A2%84%E5%91%8A%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlParamsObject = {};
    let getQ = function(){
        window.location.search
        .substring(1) // 去掉开头的问号
        .split('&') // 分割成键值对数组
        .forEach(function(pair) {
            var keyValue = pair.split('=');
            urlParamsObject[keyValue[0]] = decodeURIComponent(keyValue[1]); // 解码并存储到对象中
        });
        return urlParamsObject;
    }

    const baseUrl = "http://127.0.0.1:3001"

    let videoEle = document.getElementsByTagName('video')[0];
    videoEle.addEventListener('loadedmetadata', function() {
        let downxxxbox = document.getElementById('downxxxbox');
        if(downxxxbox){
            downxxxbox.style.opacity = '1';
        }
       // let url = window.location.href;
       // let name = urlParamsObject.tvname;
       // downM3U8({url,name});
    });

    function createBtn(){
        let box = document.createElement('div');
        box.id = 'downxxxbox';
        box.style.opacity = '0';
        box.style.position = 'fixed';
        box.style.top = '85px';
        box.style.left = '40px';
        box.style.zIndex = '1000';
        let htmlStr = `<button id="btn">下载预告片</button>`;
        box.innerHTML = htmlStr;
        document.body.appendChild(box)


        let updateBtn5 = document.getElementById('btn');
        updateBtn5.onclick = function () {
            let q = getQ();
            let url = window.location.href;
            let titleEle = document.getElementsByClassName('iqp-top-title-wrap')[0];
           let name = titleEle.children[0].innerHTML||titleEle.children[1].innerHTML;
           downM3U8({url,name});
        }
        NomlClass(updateBtn5);
    }
    createBtn();
    function NomlClass (ele,color){
            color = color || '#409eff';
            ele.style.padding = '9px 15px';
            ele.style.backgroundColor = color;
            ele.style.border = `1px solid ${color}`;
            ele.style.outline = 'none';
            ele.style.color = 'white';
            ele.style.borderRadius = '3px';
        }
    function downM3U8(opt){
        let idName = urlParamsObject.tvid;
        const data = {
            url: opt.url,
            name:opt.name,
            idName
        };
        const response = fetch(baseUrl+'/downloadTrailer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        if (response.ok) {
            //
        }
    }





})();
