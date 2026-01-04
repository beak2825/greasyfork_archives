// ==UserScript==
// @name         B站关注时间
// @namespace    https://greasyfork.org/zh-CN/scripts/448006-b%E7%AB%99%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4
// @version      1.0
// @description  查看B站关注时间
// @author       NoahRe1
// @match        https://space.bilibili.com/*
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/448006/B%E7%AB%99%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/448006/B%E7%AB%99%E5%85%B3%E6%B3%A8%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function insert(){
        if (document.querySelector('.info-wrap:last-child').children[0].textContent!='关注时间'){
        // 获取个人空间用户的UID
        let uid=window.location.pathname.replace(/\D/g,'')

        // 创建模板
        let template=document.querySelector('.info-wrap')
        let focusTime=template.cloneNode(true)
        focusTime.children[0].textContent='关注时间'

        // 获取关注时间
        let xhr = new XMLHttpRequest();
        xhr.open('GET','https://api.bilibili.com/x/space/acc/relation?mid='+uid)
        xhr.withCredentials = true;
        xhr.send()
        xhr.onload=function(){
            let relation=JSON.parse(xhr.responseText).data.relation
            if(relation.hasOwnProperty('mtime') && relation.attribute==2){
                let mtime=new Date(relation.mtime*1000)
                let year=mtime.getFullYear()
                let month=mtime.getMonth()+1
                let day=mtime.getDate()
                focusTime.children[1].textContent=year+'-'+month+'-'+day

                // 增加DOM元素
                let personal=document.querySelector('.info-personal')
                personal.insertBefore(focusTime,personal.lastElementChild.nextSibling)

                // 进入其他页面时重新增加DOM元素
                let fans=document.querySelector('.n-fans')
                fans.addEventListener('click', ()=>{setTimeout(insert,1000)})
                let dynamic=document.querySelector('.n-dynamic')
                dynamic.addEventListener('click', ()=>{setTimeout(insert,1000)})
                }
            }
        }
    }

    onload=function(){
        setTimeout(insert,1000)
    }
})();