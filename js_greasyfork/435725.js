// ==UserScript==
// @name         58租房屏蔽指定公司和大于指定天数的房源
// @namespace    http://hello.world.net/
// @version      1.1
// @description  屏蔽条件：指定关键字、大于指定天数
// @author       You
// @match        *//*.58.com/*/zufang/*
// @include      *//*.58.com/*/zufang/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435725/58%E7%A7%9F%E6%88%BF%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%85%AC%E5%8F%B8%E5%92%8C%E5%A4%A7%E4%BA%8E%E6%8C%87%E5%AE%9A%E5%A4%A9%E6%95%B0%E7%9A%84%E6%88%BF%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/435725/58%E7%A7%9F%E6%88%BF%E5%B1%8F%E8%94%BD%E6%8C%87%E5%AE%9A%E5%85%AC%E5%8F%B8%E5%92%8C%E5%A4%A7%E4%BA%8E%E6%8C%87%E5%AE%9A%E5%A4%A9%E6%95%B0%E7%9A%84%E6%88%BF%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //指定关键字，由于不想选公寓式管理，而且有些是‘照骗’，看了纯属浪费时间。
    let remove_keword = ['公寓', '按此格式分开填写']
    //大于指定天数
    let remove_day = 5;
    let removeNodes = document.querySelectorAll('.house-cell');
    let now_time = new Date();
    for (let i = 0; i < removeNodes.length; i++)
    {
        let is_remove = false;
        for (let r = 0; r < remove_keword.length; r++)
        {
            if (removeNodes[i].innerText.indexOf(remove_keword[r]) > -1)
            {
                is_remove = true;
                break;
            }
        }
        if (!is_remove)
        {
            let send_time = removeNodes[i].querySelectorAll('.send-time')[0].innerText;
            let send_split = send_time.split("-");
            if (send_split.length > 1)
            {
                try {
                    send_time = new Date("2021-" + send_time);
                    let diff_day = (now_time - send_time) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数
                    if (diff_day > remove_day)
                    {
                        is_remove = true;
                    }
                } catch {
                    alert('err');
                }
            }
        }
        if (is_remove)
        {
            removeNodes[i].remove();
        }
    }
})();