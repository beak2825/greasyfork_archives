// ==UserScript==
// @name         笨比自动抢课
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  还没完工
// @author       纸盒子
// @match        http://jwgl.thxy.cn/xsxklist!xsmhxsxk.action
// @icon         https://www.google.com/s2/favicons?domain=thxy.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437831/%E7%AC%A8%E6%AF%94%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437831/%E7%AC%A8%E6%AF%94%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(function() {
        try {
            var search = document.getElementsByClassName('datagrid-pager pagination')[0];
            search.firstChild.firstChild.firstChild.children[9].children[0].click();
            console.log('click');
        } catch(err) {
        }
        setTimeout(function(){
            try {
                add(18);
                console.log('add18');
            } catch(err) {
            }
            var messageButton = document.getElementsByClassName('messager-button')[0];
            if(messageButton != undefined){
                console.log('!=undefined');
                messageButton.firstChild.click();
                setTimeout(function() {
                    var successMsg = document.getElementsByClassName("messager-body panel-body panel-body-noborder window-body")[0].children[1].innerText
                    console.log("SuccessMsg:" + successMsg);
                    if(successMsg == "你已经选过该课程 !") {
                        clearInterval(timer);
                    } else {
                        location.reload();
                    }
                },100);
            }else{
                location.reload();
            }
        },200)
    },1000)
})();