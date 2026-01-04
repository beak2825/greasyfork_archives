// ==UserScript==
// @name         枝江标记
// @namespace    unknown
// @version      1.0
// @description  bilibili插件，用于标记底线很低的bilibili用户
// @author       unknown
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at      document-idle
// @connect     fka-iota.vercel.app
// @downloadURL https://update.greasyfork.org/scripts/429441/%E6%9E%9D%E6%B1%9F%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/429441/%E6%9E%9D%E6%B1%9F%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    // console.log(document.querySelectorAll('.user .name'));
    var jsonResponse = [];
    // console.log(jsonResponse);
    function get_black_list(){
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        "https://fka-iota.vercel.app/api/hello",
            headers:    {
            },
            onload: function (response) {
                jsonResponse = JSON.parse(response.responseText).uid_black_list;
                console.log (jsonResponse);
            },
            onerror: function(response){
                console.log("failed");
            }
        });
    }
    get_black_list();
    function hide_usernames(){
        var user_name_list = document.querySelectorAll('.user .name');
        for(var j = 0; j < user_name_list.length; j++) {
            var split_list = user_name_list[j].innerText.split("/");
            let mid = parseInt(user_name_list[j].getAttribute('data-usercard-mid'));
            if (jsonResponse.includes(mid)){
                if (split_list[split_list.length-1] !== '【V8】'){
                    user_name_list[j].innerText += " /【V8】";
                    user_name_list[j].setAttribute("style", "color:green");
                }
            }
        }
    }
    var checkExist = setInterval(function() {
        // console.log(document.querySelectorAll('.user .name'));
        hide_usernames()
    }, 500);
})();