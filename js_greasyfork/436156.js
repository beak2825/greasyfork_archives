// ==UserScript==
// @name         ehentai,exhentai自动翻页插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动翻页脚本
// @author       Hibian
// @match        https://exhentai.org/s/*
// @match        https://e-hentai.org/s/*
// @icon         https://www.google.com/s2/favicons?domain=exhentai.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436156/ehentai%2Cexhentai%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436156/ehentai%2Cexhentai%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //init
    function go_next_page(){
        var next = document.getElementById('next');
        next.click();
    }
    function time_to_next_page(_time,_counter){
        return _counter*1000 == _time;
    }
    console.log('this is a screpit');
    var page_div = document.createElement('div');
    page_div.innerHTML = "<span>自动翻页</span><select id='autopage'><option value='0'>关</option><option value='3000'>3s</option><option value='5000'>5s</option><option value='10000'>10s</option><option value='15000'>15s</option></select><button id='cbt'>确认</button>";
    var div_i2 = document.getElementById('i1');
    div_i2.appendChild(page_div);
    var cbt = document.getElementById('cbt');
    //autopage
    var auto_time = 0
    var click_counter = 0;
    cbt.addEventListener('click',()=>{
        auto_time = document.getElementById('autopage').value;
        click_counter = 0
        console.log('auto_time='+auto_time);
    });
    cbt.click();
    setInterval(() => {
        if(auto_time===0){
            return;
        }
        click_counter++;
        if(time_to_next_page(auto_time,click_counter)){
            click_counter = 0;
            go_next_page();
        }
    }, 1000);


})();