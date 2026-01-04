// ==UserScript==
// @name         集市测试
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  集市测试哦
// @author       You
// @match        https://mall.bilibili.com/neul-next/index.html?page=magic-market_index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518443/%E9%9B%86%E5%B8%82%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/518443/%E9%9B%86%E5%B8%82%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = 'https://mall.bilibili.com/mall-magic-c/internet/c2c/v2/list'; // 目标URL
    var nextid =null;
    var data = {"sortType":"TIME_DESC","nextId":nextid};
    var output =null;
    var times=100;
    var innertime=0;
    var searchtext='';
    var setint=null;
    let search = document.createElement("div");
    search.style.borderWidth='thin';
    let input = document.createElement("input");
    input.style.borderWidth='medium';
    let btn = document.createElement("button");
    btn.addEventListener("click",function(){
        console.log('click');
        searchtext=input.value;innertime=0;
        setint= setInterval(function(){
            innertime++;
            if(innertime>times){clearInterval(setint);alert('结束');}
            fetch(url, {
                method: 'POST', // 指定请求方法
                headers: {
                    'authority': 'mall.bilibili.com',
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5,ja;q=0.4',
                    'content-type': 'application/json',
                    'cookie': document.cookie,
                    'origin': 'https://mall.bilibili.com',
                    'referer': 'https://mall.bilibili.com/neul-next/index.html?page=magic-market_index',
                    'sec-ch-ua': '"Microsoft Edge";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
                },
                body: JSON.stringify(data) // 将数据转换为JSON字符串
            })
                .then(response => {return(response.json());}) // 解析JSON响应
                .then(data => {output=data;return(data);}) // 处理数据
                .catch(error => console.error('Error:', error)); // 错误处理
            nextid=output.data.nextId;
            output.data.data.forEach(function(item){if(item.c2cItemsName.toLowerCase().includes(searchtext.toLowerCase())){console.log('name:'+item.c2cItemsName+'\nprice:'+item.showPrice+'/'+item.showMarketPrice+'\nlink:https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&noTitleBar=1&itemsId='+item.c2cItemsId+'&from=market_index\n');}});
            data = {"sortType":"TIME_DESC","nextId":nextid};
        },2000);
    });
    btn.innerText='搜索';
    btn.style.borderWidth='medium';
    let btn2 = document.createElement("button");
    btn2.addEventListener("click",function(){innertime=times+1;});
    btn2.innerText='结束';
    btn2.style.borderWidth='medium';
    search.appendChild(input);
    search.appendChild(btn);
    search.appendChild(btn2);
    var insert=setInterval(function(){if(document.getElementsByClassName('filters-premium').length>0){document.getElementsByClassName('filters-premium')[0].appendChild(search);clearInterval(insert);}},1000);

    // Your code here...
})();