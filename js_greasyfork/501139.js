// ==UserScript==
// @name         同程去水印
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  同程去水印!
// @author       admxj
// @require       https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @match        *://walle.fly.17usoft.com/manage/
// @match        *://wiki.17u.cn/*
// @match        *://home.tcent.cn/TCLife/ForumPosts.aspx?*
// @match        *://neo.17usoft.com/*
// @match        *://neo.t.17usoft.com/
// @match        *://neo.qa.17usoft.com/
// @match        *://lexiangla.com/teams/k100030/events/*
// @icon         http://searchmng.ie.17usoft.com/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501139/%E5%90%8C%E7%A8%8B%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/501139/%E5%90%8C%E7%A8%8B%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clearAllInterval = ()=>{
        console.log('删除事件监听器')
        clearInterval(intervalWiki);
        clearInterval(intervalWall);
        clearInterval(intervalBBS);
        clearInterval(intervalDSF);
        clearInterval(intervalLexiang);
    }

    // 瓦力水印
    let intervalWall = setInterval(()=>{
        let doc = document.getElementById('1.23452384164.123412415');
        if(doc){
            doc.style.background = ''
            clearAllInterval()
        }
    }, 1000);

    // wiki水印
    let intervalWiki = setInterval(()=>{
        let doc = document.getElementById('water-markwater-mark-content');
        if(doc){
            doc.style.background = ''
            clearAllInterval()
        }

    }, 1000);

    // BBS水印
     let intervalBBS = setInterval(()=>{
        let doc = document.getElementById('myCanvas');
        if(doc){
            clearAllInterval()
            doc.remove()
        }

        let doc1 = document.getElementById('myCanvas1');
        if(doc1){
            clearAllInterval()
            doc1.remove()
        }

    }, 1000);

    // DSF权限
     let intervalDSF = setInterval(()=>{

         var search_buttons = document.getElementsByTagName('span')

         var search_button
         for (let index = 0; index < search_buttons.length; index++) {
             if (search_buttons[index].innerHTML === '调试') {
                 search_button = search_buttons[index]
             }
         }

         if (search_button) {
             clearAllInterval()
             search_button.parentElement.removeAttribute('disabled')
             var classStyles = search_button.parentElement.getAttribute('class').split(' ')

             var newClasStyle = classStyles.filter(item=>item.indexOf('disabled')<0).join(' ')

             search_button.parentElement.setAttribute('class', newClasStyle)
         }
     }, 1000);

        // DSF权限
     let intervalLexiang = setInterval(()=>{
         let titleBars = document.getElementsByClassName('title-bar')
         if(!titleBars){
             return
         }
         let baomingNode = Array.prototype.slice.call(titleBars).find(item=>item.innerHTML.indexOf('报名成员')>=0);
         if(!baomingNode){
             return
         }

         let baomingList = baomingNode.nextElementSibling.children
         for(let i = 0; i<baomingList.length; i++){
             let item = baomingList[i]
             item.style.width = '100px';
             item.style.height = '100px';
             let empId = item.children[0].href.split('/')[4].split('?')[0]
             $.get('https://lexiangla.com/api/v1/staffs/'+empId,resp=>{
                 let nameNode = document.createElement('span');
                 nameNode.innerHTML = resp.display_name
                 item.appendChild(nameNode)
             })

         }
         clearAllInterval()

     }, 1000);

})();