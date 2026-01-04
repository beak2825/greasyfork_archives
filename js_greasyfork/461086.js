// ==UserScript==
// @name         云效覆盖率数据过滤
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  覆盖率数据过滤
// @author       ff
// @match        https://flow.aliyun.com/assets/*//jacoco-site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461086/%E4%BA%91%E6%95%88%E8%A6%86%E7%9B%96%E7%8E%87%E6%95%B0%E6%8D%AE%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/461086/%E4%BA%91%E6%95%88%E8%A6%86%E7%9B%96%E7%8E%87%E6%95%B0%E6%8D%AE%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const title1 = document.querySelector('h1')
        createCopyBtn(title1,'恢复数据')
        createCopyBtn(title1,'过滤 Missed Methods 0数据')
    // Your code here...
})();

function createCopyBtn(title,name){
    if (!title) return
        const btn = document.createElement('button')
        btn.textContent = name
        btn.style.marginLeft = '10px'
        btn.style.backgroundColor = '#409eff'
        btn.style.color = '#fff'
        btn.style.border = 'none'
        btn.style.padding = '5px'
        btn.style.borderRadius = '5px'
        if(name === '恢复数据'){
            btn.onclick = onRecover
        }else{
            btn.onclick = filtration
        }
        if (title) title.appendChild(btn)
    }

function onRecover(){
    const tbodyDir = document.querySelectorAll(`tbody tr`)
    for(let i = 0; i < tbodyDir.length; i++){
        tbodyDir[i].style.display = ''
    }
}

function filtration(){
    //let json = []
    const sortable = document.querySelectorAll('.coverage thead .sortable')
    const tbodyDir = document.querySelectorAll(`tbody tr`)
    let MissedId = 'j'
    for(let i = 0; i < tbodyDir.length; i++){
        const td = tbodyDir[i].querySelectorAll(`td`)
        for(let y = 0; y < td.length; y++){
            const id = td[y].id
            if(id.includes(MissedId)){
                if(td[y].innerText == 0){
                    tbodyDir[i].style.display = 'none'
                }

            }
         }
    }
}

