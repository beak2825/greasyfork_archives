// ==UserScript==
// @name         自动刮卡
// @namespace    http://tampermonkey.net/
// @version      0.300
// @description  自动刮小圣杯的彩票
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(.*)?/
// @require      http://code.jquery.com/jquery-latest.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/395601/%E8%87%AA%E5%8A%A8%E5%88%AE%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/395601/%E8%87%AA%E5%8A%A8%E5%88%AE%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    let holidayapi = 'https://tinygrail.com/api/event/holiday/bonus';
    let dailyapi = 'https://tinygrail.com/api/event/bangumi/bonus/daily';
    let bonusapi = 'https://tinygrail.com/api/event/scratch/bonus2';
    let btnopen_flag = false;
    let text = '';
    // 刮卡数据
    let bounsData = {date: null, list: []};
    // 今天是否已签到
    let dailySignIn = false;

    if(localStorage.getItem("bgm-auto-buy-tickets-bouns-data")) {
        bounsData = JSON.parse(localStorage.getItem("bgm-auto-buy-tickets-bouns-data"));
    }
    if(localStorage.getItem("bgm-auto-buy-tickets-daily-signin")) {
        dailySignIn = Boolean(localStorage.getItem("bgm-auto-buy-tickets-daily-signin"));
    }

    let date = bounsData.date;
    let list = bounsData.list;

    // 检查日期，根据日期判断今天是否已签到
    function checkDate() {
        let now = new Date().toLocaleDateString();
        console.log(now, date);
        if(now == date) {
            dailySignIn = true;
            localStorage.setItem('bgm-auto-buy-tickets-daily-signin', Boolean(dailySignIn));
        } else {
            dailySignIn = false;
            localStorage.setItem('bgm-auto-buy-tickets-daily-signin', Boolean(dailySignIn));
        }
        console.log('checkDate', now, date, dailySignIn);
    }

    checkDate();

    // box
    let box = $('<div>');
    box.css({
        position: 'absolute',
        right: '-80px',
    });
    // infbox
    let infbox = $('<div>');
    let content = $('<div>');
    let arrow = $('<div>');
    let arrowBorder = $('<div>');
    content.css({
        color: 'black',
        background: 'white',
        'border-radius': '5px',
        border: 'solid 1px #aaa',
        padding: '4px',
    });
    arrow.css({
        'box-sizing': 'border-box',
        position: 'absolute',
        top: '-13px',
        right: '28px',
        width: '14px',
        height: '14px',
        border: '7px solid transparent',
        'border-bottom-color': 'white',
    });
    arrowBorder.css({
        transform: 'rotateZ(45deg)',
        position: 'absolute',
        top: '-4px',
        right: '29px',
        width: '10px',
        height: '10px',
        border: '1px solid gray',
        'z-index': -1,
    });

    infbox.append(arrowBorder);
    infbox.append(content);
    infbox.append(arrow);
    infbox.css({
        display: 'none',
        position: 'absolute',
        top: '35px',
        right: 0,
        width: 'max-content',
        'margin-top': '8px',
        'z-index': 10,
    });
    // 设置消息盒子内容
    function setInfboxContent(error) {
        if(error) {
            content.html('<p>网络错误</p>');
            return;
        }
        let table = $('<table></table>');
        table.css({
            'text-align': 'left',
        });
        table.append('<tr><th>ID</th><th>Name</th><th>Amount</th><th>Price</th></tr>');
        for(let index in list) {
            let role = list[index];
            let id = role.Id;
            let name = role.Name;
            let amount = role.Amount;
            let price = role.CurrentPrice;
            let tr = $(`<tr><td><a target="_blank" href="https://bgm.tv/character/${id}">${id}</a></td><td>${name}</td><td>${amount}</td><td>${price}</td></tr>`);
            table.append(tr);
        }
        if(list.length == 0) {
            content.html('<p>暂无内容</p>');
            return;
        }
        table.find('td,th').css({
            padding: '0 10px',
        });
        table.find('th').css({
            'font-weight': '600',
        });
        content.append(table);
    }
    // 按钮
    let btn = $('<button>');
    btn.css({
        position: 'absolute',
        top: '15px',
        right: 0,
        outline: 'none',
        border: '1px solid rgba(150, 150, 150, 0.5)',
        'border-radius': '3px',
    });
    btn.text('getBonus');
    // 根据 dailySignIn 改变 btn 背景
    function checkBtn() {
        if(dailySignIn) {
            btn.css({
                background: 'rgb(240, 145, 152)',
                color: 'white',
            });
        }
    }
    checkBtn();
    // append
    box.append(btn).append(infbox);
    $('div.idBadgerNeue').after(box);
    setInfboxContent();
    btn.click(function() {
        if(btnopen_flag) {
            btnopen_flag = false;
            infbox.hide();
        } else {
            btnopen_flag = true;
            getBonus();
        }
    });
    btn.after(infbox);
    // 今日签到
    function daily() {
        let state = 1;
        $.ajax({
            url: dailyapi,
            contentType:'application/json; charset=utf-8',
            traditional: true,
            xhrFields: { withCredentials: true },
            timeout: 5000,
            async: false,
            success: function(data) {
                console.log(data);
                if(data.State == 0) {
                    state = 0;
                } else {
                }
            },
            error: function() {
                state = -1;
            }
        });
        return state;
    }
    // 刮卡
    function getBonus(hide) {
        if (daily() != -1) {
          dailySignIn = true;
          localStorage.setItem('bgm-auto-buy-tickets-daily-signin', Boolean(dailySignIn));
          checkBtn();
        };
        let now = new Date().toLocaleDateString();
        if(hide) {
            infbox.hide();
        } else {
            infbox.show();
        }
        if(now == date) {
            return;
        } else {
            list = [];
        }
        $.ajax({
            url: bonusapi,
            contentType:'application/json; charset=utf-8',
            traditional: true,
            xhrFields: { withCredentials: true },
            timeout: 5000,
            success: function(data) {
                console.log(data);
                if(data.State == 0) {
                    Object.assign(list, data.Value);
                    console.log(list);
                    getBonus(false);
                } else {
                    setInfboxContent();
                    bounsData.date = now;
                    localStorage.setItem('bgm-auto-buy-tickets-bouns-data', JSON.stringify(bounsData));
                }
            },
            error: function() {

            }
        });
    }
})();