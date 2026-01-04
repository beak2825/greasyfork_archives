// ==UserScript==
// @name         知乎邀请
// @namespace    Sophie
// @version      0.1
// @description  在知乎问题界面按Ctrl+Alt+d可以快速邀请用户回答
// @author       pikaqian
// @license      MIT
// @match        https://www.zhihu.com/question/*
// @icon         data:image/jpeg;base64,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
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/447500/%E7%9F%A5%E4%B9%8E%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/447500/%E7%9F%A5%E4%B9%8E%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //需要手动设置token
    var pageToken='3LpOPeH0nW91suRSBpE3vVjqiYHiMlfe'

    window.addEventListener('keydown',function(e){
        if(e.keyCode==68&&e.altKey==true&&e.ctrlKey==true){
            //alert('a')
            var questionID=window.location.href.match(/(?<=question\/)\d+/)[0]
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.zhihu.com/api/v4/questions/"+questionID+'/recommendation_invitees?include=%5B*%5D.member.answer_count%2Carticles_count%2Cfollower_count%2Cgender%2Cis_followed%2Cis_following%2Cbadge&keyword=',
                headers:{
                    "User-Agent": navigator.userAgent,
                },
                onload: function(res) {
                    if(res.status === 200){
                        //console.log('成功')
                        var p=res.responseText
                        var userID=p.match(/(?<="id": ").*?(?=",)/g)
                        console.log(userID)

                        for(var i=0;i<userID.length;i++){
                            fetch("https://www.zhihu.com/api/v4/questions/"+questionID+"/invitees",{
                                headers: {
                                    "accept": "*/*",
                                    "content-type": "application/json",
                                    "x-requested-with": "fetch",
                                    "x-zse-93": "101_3_3.0",
                                    "x-zse-96": "2.0_A4jiWxkkuBUusB6Cj1bglYfwm1xz/X4Qfma=CkbpzuYU5X0SXUnUkyWBOZnbHDoK",
                                    "x-zst-81": "3_2.0ae3TnRUTEvOOUCNMTQnTSHUZo02p-HNMZBO8YD7qS6nxSRYqXRFZ2i90-LS9-hp1DufI-we8gGHPgJO1xuPZ0GxCTJHR7820XM20cLRGDJXfgGCBxupMuD_Ie8FL7AtqM6O1VDQyQ6nxrRPCHukMoCXBEgOsiRP0XL2ZUBXmDDV9qhnyTXFMnXcTF_ntRueTh_21IqULk_FOnGo_UDxMeXxfzugx3CtGs7O8jcV1EcxxigYOXBcCZUXCbGYPvHc_HqLYur38QqpVk0wKRuFOxU3Y2iCKChL_1wX1jhcCAcL98qx9ZhxyzgHYkLwKDuYmnJx9EhLfPCC8nwFKKLNBFbemsGVKbHe8kh3qk0pLhCX18vNC4qfzQH3YTGS1CwwGfLVytUx1r6exLDH87qgLeJSm0rx_o9O0fXoChuCONwcYFgL85wwMoUr9S9gMaDHCugHB1uXqnDVfFDSqq9g0BggCrCVmUre15heLwrVC",
                                    "x-csrf-token": pageToken
                                },
                                "referrer": "https://www.zhihu.com/question/"+questionID,
                                'method':'POST',
                                'body':JSON.stringify({member_hash: userID[i], src: "normal"})
                            })
                        }

                    }
                }
            })
        }
    })
})();