// ==UserScript==
// @name         巴士直通车
// @namespace    https://ukmeng.github.io/
// @version      0.45
// @description  bus直接前往nyaa
// @author       UKM
// @include      https://*.javbus.com/*
// @include      http*://*.javlibrary.com/*
// @include      http*://javdb.com/*
// @include      http*://south-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421898/%E5%B7%B4%E5%A3%AB%E7%9B%B4%E9%80%9A%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/421898/%E5%B7%B4%E5%A3%AB%E7%9B%B4%E9%80%9A%E8%BD%A6.meta.js
// ==/UserScript==

function nyaaBus(number, title){
    let nyaa_url = 'https://sukebei.nyaa.si/?f=0&c=0_0&q=' + number; // 跳转到nyaa的链接
    let nyaa_bus = document.createElement('a');
    nyaa_bus.href = nyaa_url;
    nyaa_bus.textContent = title;
    nyaa_bus.target = 'external'; // 在新窗口打开
    return nyaa_bus;
}

function dlsite(number, title){
    let url = 'https://www.dlsite.com/maniax/work/=/product_id/' + number + '.html'; // 跳转到nyaa的链接
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.target = 'external'; // 在新窗口打开
    return a;
}


(function() {
    'use strict';
    let url = document.URL; // 获取网址
    let re = /\w+-\d{3,4}(?!-)/g; // 匹配番号的规则
    var number;
    if (/javdb/.test(url)){
        let h2 = document.querySelector('h2'); // 标题DOM对象
        let title = h2.textContent;
        let number = title.match(re)[0];
        let nyaa_bus = nyaaBus(number, title);
        h2.textContent = '';
        h2.appendChild(nyaa_bus);
    }
    else if (/plus/.test(url)){  // south-plus添加RJ跳转链接
        let redl = /RJ[0-9]{6}/;
        let h1 = document.querySelector('h1'); // 标题DOM对象
        let title = h1.textContent;
        let number = title.match(redl)[0];
        let a = dlsite(number, title);
        h1.textContent = '';
        h1.appendChild(a);
    }
    else if (/forum/.test(url)){ // 论坛里的番号直达nyaa的超链接
        var tags = document.querySelectorAll('td.t_f, div.sign'); // 论坛文本
        for(var i = 0; i < tags.length; i++){
            var text = tags[i].innerHTML;
            var test = [...text.matchAll(re)];
            var record = []; // 记录数组
            for(var j = 0; j < test.length; j++){
                let t1 = test[j][0];
                if(record.includes(t1)){
                    continue;
                } else{
                    record.push(t1);
                }
                let number = t1.toUpperCase();
                // console.log(t1);
                let t2 = '<a href="https://sukebei.nyaa.si/?f=0&c=0_0&q=' + number + '" target="external">' + number + '</a>';
                //let t2 = '<a href="https://www.javbus.com/' + number + '" target="external">' + number + '</a>';
                text = text.replaceAll(t1, t2);
            }
            tags[i].innerHTML = text;
        }
    }
    else{
        let h3 = document.querySelector('h3'); // 标题DOM对象
        let title = h3.textContent; // 获取标题
        let number = title.match(re)[0]; // 获取番号
        let nyaa_bus = nyaaBus(number, title);
        h3.textContent = '';
        h3.appendChild(nyaa_bus)
    }
})();