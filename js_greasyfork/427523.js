// ==UserScript==
// @name         bilibili直播流获取
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  获取直播流
// @author       xiaoso
// @match        https://live.bilibili.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js




// @downloadURL https://update.greasyfork.org/scripts/427523/bilibili%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/427523/bilibili%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {

    var test = window.location.pathname;
    var roomid = test.replace(/[^0-9]/ig,"");
    $.ajax({
    headers: {
        Accept: "application/json; charset=utf-8"
    },
    url: "https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo?room_id="+roomid+"&play_url=1&mask=1&qn=10000&platform=web&ptype=16",
    type: "get",
    success: function (data) {

        //console.log(data["data"]["play_url"]["durl"][0]["url"]);
        let url = data["data"]["play_url"]["durl"][0]["url"];
        while(1){
             var player = document.getElementById("pk-guard-vm");
                if (typeof(player)!==undefined && typeof(url)!==undefined)
                {
                    //player.remove();
                    var text = url;
                    var mydiv = document.createElement("div");
                    mydiv.style = "word-wrap:break-word;"
                    //mydiv.innerText =text;
                    //mydiv.innerHTML = "<input type='text' name='qn' value='10000'/>"
                    mydiv.innerHTML += "<div>"+url+"</div>";
                    //player.innerText =text;
                    player.parentElement.insertBefore(mydiv,player);
                    break;
                }
        }
    }
    });
    // Your code here...
})();