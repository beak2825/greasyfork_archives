// ==UserScript==
// @name         斗鱼自动送荧光棒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  douyu斗鱼自动荧光棒，配置房间id
// @author       cromarmot
// @match          *://douyu.com/*
// @match          *://www.douyu.com/*
// @exclude        *://douyu.com/?*
// @icon         https://www.douyu.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467305/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%80%81%E8%8D%A7%E5%85%89%E6%A3%92.user.js
// @updateURL https://update.greasyfork.org/scripts/467305/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%80%81%E8%8D%A7%E5%85%89%E6%A3%92.meta.js
// ==/UserScript==

const cookies = document.cookie;
// 可配多个主播房间号 每个房间每次送1个
const roomarr = [4238637/*8777*/,544091];

function send_ygb(roomid) {
    let myHeaders = new Headers();
    myHeaders.append("cookie", cookies);
    myHeaders.append("referer", "https://www.douyu.com/"+roomid);

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://www.douyu.com/japi/prop/backpack/web/v1?rid="+roomid, requestOptions)
        .then(response => response.json()).then(function(json){
        console.log(`roomid = ${roomid} 礼物种数: ${json.data.list.length}` );
        if (json.data.list.length > 0) {
            send_gifts(json.data.list, roomid);
        }
    })

}

function send_gifts(gifts, roomid) {
    for (const gift of gifts) {
        if (gift.id == 268) {
            let myHeaders = new Headers();
            myHeaders.append("cookie", cookies);
            myHeaders.append("referer", "https://www.douyu.com/"+roomid);
            let urlencoded = new URLSearchParams();
            urlencoded.append("propId", "268");
            console.log('荧光棒个数:',gift.count);
            urlencoded.append("propCount", 1); // 送1个, // gift.count);
            urlencoded.append("roomId", roomid);
            urlencoded.append("bizExt", "{\"yzxq\":{}}");
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };
            fetch("https://www.douyu.com/japi/prop/donate/mainsite/v1", requestOptions)
                .then(response => response.text())
                .then(console.log)
                .catch(console.error);
        }
    }
}

(function() {
    'use strict';
    console.log('script loaded');
    roomarr.map(roomid => send_ygb(roomid));
})();