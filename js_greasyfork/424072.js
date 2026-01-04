// ==UserScript==
// @name         Delete Aliyun Old Docker Image
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://cr.console.aliyun.com/repository/*/*/*/images
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424072/Delete%20Aliyun%20Old%20Docker%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/424072/Delete%20Aliyun%20Old%20Docker%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var retryCheck = function(checkFun,interval,nextFun,times,delay,startTime){
        if(!times)times = 1;
        else times += 1;
        if(!delay)delay = 0;
        if(!startTime)startTime = (new Date()).getTime();
        setTimeout(function(){
            if(checkFun(times)){
                if(delay){
                    var detal = delay - ((new Date()).getTime() - startTime);
                    if(detal>0)setTimeout(nextFun,detal);
                    else nextFun();
                }else nextFun();
            }else retryCheck(checkFun,interval,nextFun,times,delay,startTime);
        },interval);
    }
    var cur_ct = 0;
    var doit = function(){
        let bt = document.createElement('button');
        bt.setAttribute('class','next-btn next-medium next-btn-normal is-wind');
        bt.innerText = 'Del Old Images';
        bt.setAttribute('style','background:red;color:white;');
        bt.addEventListener('click',_=>{
            //let tag_eles = document.querySelectorAll('.next-table-body>tr');
            let min = parseInt(window.prompt('How many versions to keep'));
            cur_ct = min;
            hithit();
        },false);
        document.querySelector('.next-table-header tr:first-of-type>th:last-of-type').appendChild(bt);
    }
    var hithit = function(){
        let modals_button = document.querySelectorAll('[aria-modal="true"][role="alertdialog"] .next-dialog-footer .next-btn-primary.next-dialog-btn');
        if(modals_button){
            for(let mb of modals_button){
              mb.click();
            }
        }
        let tag_eles = document.querySelectorAll('tr[role="row"]');
        let cur = tag_eles[cur_ct];
        let stat = cur.querySelector('.statusFilter').innerText;
        if(stat=='正常'){
            cur.querySelectorAll('.sc-iRbamj')[1].click();
            retryCheck(_=>{
              let lst = document.querySelector('.next-message-content .next-checkbox');
              return lst;
            },500,_=>{
                document.querySelector('.next-message-content .next-checkbox').click();
                document.querySelector('button[class="next-btn next-medium next-btn-primary is-wind"]').click();
                cur_ct++;
                if(cur_ct<tag_eles.length)window.setTimeout(hithit, 1500);
            });
        }else{
            cur_ct++;
            if(cur_ct<tag_eles.length)hithit();
        }
    }
    window.addEventListener('load',_=>{
        retryCheck(_=>{
              let lst = document.querySelector('.next-table-header tr:first-of-type>th:last-of-type');
              return lst;
           },500,_=>{
            doit();
          });
    },false);
})();