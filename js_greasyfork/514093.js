// ==UserScript==
// @name         bilibili-block-users
// @namespace    http://tampermonkey.net/
// @version      2024-10-26 3
// @description  批量拉黑B站用户
// @author       nimooooo
// @match        https://space.bilibili.com/*
// @include      https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514093/bilibili-block-users.user.js
// @updateURL https://update.greasyfork.org/scripts/514093/bilibili-block-users.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('bilibili-block-users loaded');
    console.log('jq ver:',$.fn.jquery);
    // Your code here...
    // 创建按钮
    var button = document.createElement('button');
    button.textContent = '点击批量拉黑';
    button.className = 'dynamic-button'; // 添加类名以便后续操作
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#f25d8e';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    // 添加按钮到页面
    document.body.appendChild(button);

    // 为按钮绑定点击事件
    button.addEventListener('click', function() {
        //alert('按钮被点击了！');
        var uid = document.cookie.match(/(?<=DedeUserID=).+?(?=;)/)[0]; //自己的uid
        var csrf_token = document.cookie.match(/(?<=bili_jct=).+?(?=;)/)[0];

        // 需要拉黑的uid
        var uid_list = [544336675,2229752,4564056,638816489,473519710,24490535,1629347259,10119428,1457639978,4305299,386869863,10518076,46545652,309134148,442229,14068111,269319344,942755,1596926736,2043926679,98684196,504934876,145544,3537112840275980,434615,1405515989,395991094,253212392,1117551831,406999290,253350665,2728123,452600545,2035005110,94281836,239688446,1135981288,2574869,483052036,284845773,13743667,203680252,550674844,3948019,94510621,1556651916,664086886];

        function bacth_follow() {
            for (let i = 0; i < uid_list.length; i++) {
                setTimeout(function () {
                    $.ajax({
                        url: '//api.bilibili.com/x/relation/modify',
                        type: "post",
                        xhrFields: {
                            withCredentials: true
                        },

                        data: {
                            'fid': uid_list[i],
                            'act': 5,
                            're_src': 11,
                            'jsonp': 'jsonp',
                            'csrf': csrf_token
                        }
                    })
                    console.log("拉黑的用户主页为:https://space.bilibili.com/" + uid_list[i])
                    if(i===uid_list.length-1){
                        alert('批量拉黑操作,执行完毕');
                    }
                }, i * 100)
            };
        }

        bacth_follow();
    });
})();