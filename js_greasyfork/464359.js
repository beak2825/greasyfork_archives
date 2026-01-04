// ==UserScript==
// @name         辱骂标记  提交强制刷新
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  辱骂标记  提交强制刷新 v0.2 实时刷新.来量提醒 v0.3重复点批量辱骂bug修复
// @author       丁振兴
// @match        https://live-monitor.wemomo.com/fes/
// @icon         https://cidian.18dao.net/emoji-local-image/%E8%BE%B1%E7%BD%B5.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464359/%E8%BE%B1%E9%AA%82%E6%A0%87%E8%AE%B0%20%20%E6%8F%90%E4%BA%A4%E5%BC%BA%E5%88%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/464359/%E8%BE%B1%E9%AA%82%E6%A0%87%E8%AE%B0%20%20%E6%8F%90%E4%BA%A4%E5%BC%BA%E5%88%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
function confimAndrefresh() {
    //辱骂标记  提交强制刷新
    if (document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary') && document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary').onclick == undefined) {
        document.querySelector('.el-button.el-button--default.el-button--small.el-button--primary').onclick = function ttr() {
            window.location.reload()
        }
    }
}
var told;
 function newpage(){
 var timnew=document.getElementsByClassName("el-table_1_column_4")[1]
 if(timnew){var tnew=timnew.textContent

 if(tnew!=told){document.getElementsByClassName("el-button default-button warning-button el-button--default el-button--mini")[0].click();


               told=tnew}
 }
 }

function 招呼辱骂提醒() {
    if (window.location.href.indexOf('abuseIndex') > -1) {
        if (document.querySelectorAll('tr td').length==0) {
            document.querySelectorAll('.el-icon-search')[0].click()

        } else {
              //setTimeout('document.getElementsByClassName("el-button default-button warning-button el-button--default el-button--mini")[0].click();',300)
            newpage()
            if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission(function(status) {
                    var n = new Notification('招呼辱骂提醒',{
                        body: '招呼辱骂提醒',
                        title: '招呼辱骂提醒',
                        icon: 'https://s.momocdn.com/s1/u/ihjbiceee/momolog.png'
                    });
                    n.onshow = function() {

                        setTimeout(function clno() {
                            n.close()
                        }, 3000);
                    }
                });
            }

        }
    }
}


window.onload=function zhaohuruma(){

setInterval(confimAndrefresh, 500)
setInterval(招呼辱骂提醒, 5000)
}

    // Your code here...
})();