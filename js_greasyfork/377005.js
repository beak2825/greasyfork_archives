// ==UserScript==
// @name         Freebitco.in 自動賺錢腳本 v1.9
// @namespace    https://www.facebook.com/airlife917339
// @version      1.9
// @description  feel free to donate: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://freebitco.in/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377005/Freebitcoin%20%E8%87%AA%E5%8B%95%E8%B3%BA%E9%8C%A2%E8%85%B3%E6%9C%AC%20v19.user.js
// @updateURL https://update.greasyfork.org/scripts/377005/Freebitcoin%20%E8%87%AA%E5%8B%95%E8%B3%BA%E9%8C%A2%E8%85%B3%E6%9C%AC%20v19.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function check_bonus(bonus) {
        let result = false;
        let time;
        switch(bonus) {
            case 'btc':
                if (document.querySelectorAll('#bonus_span_fp_bonus').length === 0) {
                    result = true;
                }
                break;
            case 'rp':
                if (document.querySelectorAll('#bonus_container_free_points').length != 0) {
                    time = time_format($('#bonus_span_free_points').text()); //時間等於0才能買
                    if (time !== 0) {
                        //
                    } else {
                        result = true;
                    }
                } else {
                    result = true;
                }
                break;
            default:
                break;
        }
        return result;
    }

    function check_bonus1(bonus) {
        let result = false;

        if (bonus === 'btc') {
            result = !document.querySelector('#bonus_span_fp_bonus');
        }
        else if (bonus === 'rp') {
            let bonusContainer = document.querySelector('#bonus_container_free_points');
            if (bonusContainer) {
                let timeText = document.querySelector('#bonus_span_free_points')?.textContent.trim() || '0';
                let time = time_format(timeText); // 假設 time_format() 是已定義的函數
                result = (time === 0);
            } else {
                result = true;
            }
        }

        return result;
    }

    function redeem_point() {
        let check_btc = check_bonus('btc');
        let check_rp = check_bonus('rp');
        let point = check_point();

        if (check_rp) {
            if (point>=1200) {
                RedeemRPProduct('free_points_100');
            } else if (point>=600) {
                RedeemRPProduct('free_points_50');
            } else if (point>=120) {
                RedeemRPProduct('free_points_10');
            } else if (point>=12) {
                RedeemRPProduct('free_points_1');
            } else {
                console.log("Waiting for points greater than or equal to 12");
            }
        }

        if (check_rp) {
            if (point>=4400) {
                RedeemRPProduct('fp_bonus_1000');
            } else {
                console.log("Waiting for points greater than or equal to 4,400");
            }
        }
    }

    function time_format(time) {
        let current_time = 0;
        let hour = parseInt(time.split(":")[0]);
        let min = parseInt(time.split(":")[1]);
        let sec = parseInt(time.split(":")[2]);
        current_time = hour*3600 + min*60 + sec;
        return current_time;
    }

    function check_point() {
        let element = document.querySelector('.user_reward_points');
        let pointsText = element.textContent.trim().replace(/,/g, '');
        let points = parseInt(pointsText);
        return points;
    }

    function number_format(n) {
        n += "";
        let arr = n.split(".");
        let re = /(\d{1,3})(?=(\d{3})+$)/g;
        return arr[0].replace(re,"$1,") + (arr.length == 2 ? "."+arr[1] : "");
    }

    const initialDelay = 1000*60*15; // Adjust as needed (e.g., 2000ms = 2 seconds)
    setTimeout(() => {
        history.back();
    }, initialDelay);

    const states = '已啟用';
    const states_color = '#4bff00';

    let rp = number_format(check_point());
    let reward = {};
    //document.getElementById('why_not_multiply').remove();
    redeem_point();

    let button = document.querySelector('#free_play_form_button');

    if (button && button.offsetParent !== null) {// 確保按鈕存在且可見
        setTimeout(() => button.click(), 10000);
        setTimeout(() => location.reload(true), 20000);
    }
    //if ($('.close-reveal-modal').is(':visible')) {
        //setTimeout(function(){ $('.close-reveal-modal').click(); },2000);
    //}
    reward.select = function() {
        redeem_point();
    };
    
    // 創建主容器
    let autofaucetDiv = document.createElement('div');
    autofaucetDiv.id = 'autofaucet';
    autofaucetDiv.style = "position:fixed;top:45px;left:0;z-index:999;width:350px;background-color:black;color:white;text-align:left;padding:10px;";

    // 插入標題
    let title = document.createElement('p');
    title.textContent = "自動賺錢外掛 v1.9 by Kevin Chang";
    autofaucetDiv.appendChild(title);

    // 插入目前 RP
    let rpParagraph = document.createElement('p');
    rpParagraph.textContent = "目前RP: " + rp + " RP";
    autofaucetDiv.appendChild(rpParagraph);

    // 插入狀態顯示
    let statusParagraph = document.createElement('p');
    statusParagraph.innerHTML = `<b>外掛狀態: </b><b style="color:${states_color}">(${states})</b>`;
    autofaucetDiv.appendChild(statusParagraph);

    // 插入功能狀態
    let features = [
        "- 自動拉霸",
        "- RP加成+ (MAX: 100)",
        "- BTC加成+ (MAX: 1000%)"
    ];

    features.forEach(text => {
        let p = document.createElement('p');
        p.innerHTML = `<span>${text} </span><b style="color:${states_color}">(${states})</b>`;
        autofaucetDiv.appendChild(p);
    });

    // 將 `autofaucetDiv` 加入 `body`
    document.body.prepend(autofaucetDiv);

    // 插入 CSS
    let style = document.createElement('style');
    style.textContent = "#autofaucet p { margin: 0; margin-left: 2px; text-align: left; }";
    document.head.appendChild(style);

    setTimeout(reward.select, 5000);
    setInterval(reward.select, 60000);
})();