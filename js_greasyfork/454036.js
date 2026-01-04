// ==UserScript==
// @name         豆瓣获取书单数据cnblogs-SimpleMemory
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  快速复制豆瓣书籍数据为书单格式
// @author       MashiorCat
// @grant        GM_setClipboard
// @match        https://book.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454036/%E8%B1%86%E7%93%A3%E8%8E%B7%E5%8F%96%E4%B9%A6%E5%8D%95%E6%95%B0%E6%8D%AEcnblogs-SimpleMemory.user.js
// @updateURL https://update.greasyfork.org/scripts/454036/%E8%B1%86%E7%93%A3%E8%8E%B7%E5%8F%96%E4%B9%A6%E5%8D%95%E6%95%B0%E6%8D%AEcnblogs-SimpleMemory.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const datereg = /[1-9]\d{3}-([1-9]|1[0-2])/;
    const dateregExp = new RegExp(datereg);
    function addBtn(text,clickFn,target,right){
        const btn = document.createElement('button');
        btn.setAttribute('style','position: absolute; top:-7px;cursor:pointer; font-size: 10px;padding: 5px 10px;border: 1px solid beige;background-color: #ccc;border-radius: 5px;');
        btn.style.right = right;
        btn.textContent = text;
        btn.addEventListener('click',function(event){
            clickFn();
            event.stopPropagation();
        },true)
        target.appendChild(btn);
    }
    function getBookData(){
        const book = {};
        book.cover = 'https://images.weserv.nl/?url='+ document.querySelector('#mainpic img').src;
        book.name = $('h1 span').text();
        let infos = $('#info span');
        infos = Array.prototype.slice.call(infos);
        infos.forEach(item => {

            let text = item.innerHTML;
            let nextNode;
            if(!text.includes('<span')){
                text = text.trim();
                if(text.includes(':')){
                    text = text.slice(0,-1);
                }
                if(text == '作者'){
                    book.author = item.nextElementSibling.innerHTML;
                }
                if(text == '出版社'){
                    book.press = item.nextElementSibling.innerHTML;
                }
                if(text == '出版年'){
                    book.year = item.offsetParent.innerHTML.match(dateregExp)[0];
                }
                if(text == '译者'){
                    book.translator = item.nextElementSibling.innerHTML;
                }

            }

        })
        book.score = 4;
        book.readPercentage = "";
        GM_setClipboard(JSON.stringify(book)+',');
    }
    const tag = document.getElementById('interest_sectl');
    addBtn('获取数据',getBookData,tag,'33px');
})();