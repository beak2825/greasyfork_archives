// ==UserScript==
// @name         金融实训课程辅助工具-银行信贷模拟
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  网页<input>标签复制粘贴
// @license      MIT
// @author       廖哥
// @match        http://10.7.100.16/syxd/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463655/%E9%87%91%E8%9E%8D%E5%AE%9E%E8%AE%AD%E8%AF%BE%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-%E9%93%B6%E8%A1%8C%E4%BF%A1%E8%B4%B7%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/463655/%E9%87%91%E8%9E%8D%E5%AE%9E%E8%AE%AD%E8%AF%BE%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7-%E9%93%B6%E8%A1%8C%E4%BF%A1%E8%B4%B7%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("#_mainOtherBox {position: fixed: antiquewhite; top: 0;left: 0;z-index: 10000;background-color: #ff9999;padding: 0 13px 0 8px;color:#000;font-size: 10px;}");
    GM_addStyle("#other {width: 150px;height: 50px;line-height: 50px;font-size: 22px;position: fixed;top: 100px;right: 200px;}");
//创建按钮容器
    let _main = document.createElement('div');
    _main.class = 'otherBox';
    _main.id = '_mainOtherBox';
    _main.style.position="fixed";
    _main.style.left="220px";
    _main.style.top="20px";
    _main.style['z-index']="999999";
    _main.innerText = '网页快捷键：';
//创建按钮
    let _copy = document.createElement('button');
    _copy.innerText = '复制';
    _copy.class = 'other';
    _copy.addEventListener('click',()=>{
        var values = [];
        var ids = [];
        var inputs = document.getElementsByTagName('input');
        for(var i=0; i<inputs.length; i++){
            if (inputs[i].type=='text'){
                values.push(inputs[i].value);
                ids.push(inputs[i].id);
            };
        };
        GM_setValue('values',values);
        GM_setValue('ids',ids);
        alert('复制本页面成功！');
});
    let _paste = document.createElement('button');
    _paste.innerText = '粘贴';
    _paste.class = 'other'
    _paste.addEventListener('click',()=>{
        var values = GM_getValue('values',undefined);
        var ids = GM_getValue('ids',undefined);
        var inputs = document.getElementsByTagName('input');
        for(var id of ids){
            for(var i=0; i<inputs.length; i++){
                if (inputs[i].type=='text' && inputs[i].id==id){
                    inputs[i].value=values[ids.indexOf(id)];
                };
            };
        };
        alert('粘贴本页面成功！');
});
//放置按钮
    document.body.appendChild(_main);
    document.getElementById('_mainOtherBox').appendChild(_copy);
    document.getElementById('_mainOtherBox').appendChild(_paste);
})();