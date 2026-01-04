// ==UserScript==
// @name         A营红名单显示插件
// @namespace    https://aerfaying.com/
// @version      0.1
// @description  当访问用户主页时自动显示此用户是否在红名单中
// @author       SparrowHe
// @match        https://aerfaying.com/Users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399840/A%E8%90%A5%E7%BA%A2%E5%90%8D%E5%8D%95%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/399840/A%E8%90%A5%E7%BA%A2%E5%90%8D%E5%8D%95%E6%98%BE%E7%A4%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    var id = url.split("/")[4];
    console.log(id)
    var libraLib={
        isInList: function(id){
            $.ajax({
                url: "https://redlist.zerlight.top:1100/v2",
                data: {
                    "method":"isInList",
                    "platform":"acamp",
                    "format":"id",
                    "value":id
                },
                success: function(result){
                    console.log(result);
                    if(result["message"]=="success"){
                        if(result["status"]==true){
                            alert("此人在红名单中，原因是："+result["reason"]);
                        }
                    }
                    /*
                    var message = JSON.parse(result);
                    if(message["message"]=="success"){
                        if(message["status"]==true){
                            alert("此人在红名单中，原因是："+message["reason"]);
                        }
                    }*/
                }
            });
        }
    }
    libraLib.isInList(id);

    // Your code here...
})();