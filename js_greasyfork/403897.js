// ==UserScript==
// @name         本地黑名单-百度贴吧
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  我的地盘，我做主！
// @author       lavaf
// @match        https://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/*
// @grant        none
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/403897/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/403897/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let blackList=['6696583291','6697078829','6559645377','803221722']
    setInterval(function () {
        console.log('start')
        let nameList=$("li.j_thread_list");
        nameList.each(function (i,e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).attr("data-tid");
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        if (blackList[blackListKey] === id) {
                            console.log(id);
                            $(e).text(id+" 此帖子已经被屏蔽")
                            $(e).attr('data-lavaf','1');
                        }
                    }
                }
            }

        });
        let List=$("li.d_name");
        List.each(function (i,e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).attr("data-field");
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        if (id ==='{"user_id":'+blackList[blackListKey]+'}') {
                            //console.log(id);
                            let div = $(e).parent().parent().parent();
                            console.log(div);
                            div.text(blackList[blackListKey]+" 此评论已经被屏蔽")
                            $(e).attr('data-lavaf','1');
                        }
                    }
                }
            }

        });
    },500)

})();