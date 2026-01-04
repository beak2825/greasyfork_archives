// ==UserScript==
// @name         StarBucks數位體驗
// @namespace    http://tampermonkey.net/
// @version      2024-10-16
// @description  StarBucks數位體驗略過動畫直接抽獎
// @author       You
// @match        https://event.12cm.com.tw/*
// @icon         https://event.12cm.com.tw/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482869/StarBucks%E6%95%B8%E4%BD%8D%E9%AB%94%E9%A9%97.user.js
// @updateURL https://update.greasyfork.org/scripts/482869/StarBucks%E6%95%B8%E4%BD%8D%E9%AB%94%E9%A9%97.meta.js
// ==/UserScript==

function share_patch() {
    fetch('/starbucks/campaign/sp_share_cnt', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type: 'line'})
    }).then(response => response.json()).then(data => {
        // 如果是手機，延遲 20 秒後再檢查是否有額外贈獎
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setTimeout(function () {
                //checkBonus();
            }, 20000);
        } else { // 如果是電腦，直接檢查是否有額外贈獎
            //checkBonus();
        }
    }).catch((error) => {
        console.log('fail');
    });
}

function event_patch(){
    let form = document.createElement('form');
    form.method = "POST";
    form.action = "/starbucks/campaign/sp_game";
    document.body.append(form);
    form.submit();
}


(function() {
    'use strict';
    //alert("hello");
    //console.log("hello")

    window.share_patch = share_patch;
    window.event_patch = event_patch;





    const currentURL = window.location.href;

    if(currentURL == 'https://event.12cm.com.tw/starbucks/campaign/autumn_leveled_up/'){

        for(let i=0;i<3;i++){
            try{
                share_patch();
            } catch (e){
            }
            try{
                $(".popup-close").click();
            } catch (e){
            }
        }

        try{
            checkBonus();
        } catch (e){
        }

        let btn=document.createElement("button");
        btn.innerHTML="添加一張優惠卷";
        btn.onclick=function(){
            for(let i=0;i<3;i++){
                try{
                    share_patch();
                } catch (e){
                }
                try{
                    $(".popup-close").click();
                } catch (e){
                }

            }
            Utility.Popup.create(
                '新增成功',
                '已新增一張優惠卷至帳號中',
                '關閉視窗',
            );

        }
        document.getElementsByClassName('text-center')[1].append(btn);
    }



    if(currentURL.includes('https://event.12cm.com.tw/starbucks_external/brand/2024/autumn_leveled_up/')){
        try{
            event_patch();
        } catch (e){
        }

    }

    // Your code here...
})();