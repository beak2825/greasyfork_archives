// ==UserScript==
// @name         自动抢购
// @namespace    871088249@qq.com
// @version      0.8
// @description  自动抢购强化石!
// @author       yong
// @match        https://chdtuan.web.sdo.com/*
// @grant        none
// @license      gpl
// @downloadURL https://update.greasyfork.org/scripts/429364/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/429364/%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var num = 12;
    var count = 0;
    var time = '';
    var gap = 5000
    var countdown = 0; //服务器返回的倒计时时间
    var interval = 500;
    var startTime = new Date().getTime();

    //首次执行
    var t = '2021-07-15 10:00:00';
    countdown = new Date(t).getTime() - startTime;

    var storage = window.sessionStorage;
    var timer;
    var keyword = null;
    var id = '';
    var _alert = window.alert;

    function init() {
        time = storage.getItem('time');
        keyword = storage.getItem('keyword');
        num = storage.getItem('num');
        id = storage.getItem('id');
        var flag = storage.getItem('flag');
        if (!flag || num == 0) {
            var d = new Date()
            var y = d.getFullYear()
            var m = d.getMonth() + 1;
            var day = d.getDate();
            time = prompt('秒杀时间', y + '-' + m + '-' + day + ' ' + '10:00:00');
            if (time == null) {
                return false;
            }
            keyword = prompt('抢购商品关键字（不要有空格）', '超级附魔装备强化晶石');
            if (keyword == null) {
                return false;
            }
            num = prompt('抢购商品数量(数字)', '1');
            if (num == null) {
                return false;
            }

            gap = prompt('俩次购买间隔（ms）', '5000');
            
            if (!/^\d+$/.test(gap)) {
                alert('俩次购买间隔 必须时正整数');
                gap = prompt('俩次购买间隔（ms）', '5000');
                return false;
            }
            storage.setItem('time', time)
            storage.setItem('keyword', keyword)
            storage.setItem('num', num)
            storage.setItem('flag', true)
            storage.setItem('msg', '购买记录:')
        }
        countdown = new Date(time).getTime() - startTime;
        timer = setTimeout(countDownStart, interval);
    }

    init()
    //定时器测试
    function countDownStart() {
        count++;
        var offset = new Date().getTime() - (startTime + count * interval);
        var nextInterval = interval - offset;
        if (countdown < nextInterval) {
            nextInterval = countdown
        }
        //修正后的延时时间
        if (nextInterval < 0) {
            nextInterval = 0;
        }
        countdown -= interval;
        console.log("误差：" + offset + "ms，下一次执行：" + nextInterval + "ms后，离活动开始还有：" + countdown + "ms");
        if (countdown <= 0) {
            clearTimeout(timer);
            check()
        } else {
            timer = setTimeout(countDownStart, nextInterval);
        }
    }
    function buy() {
        console.log(num)
        if (num > 5) {
            document.querySelector('#Num').value = 5;
            storage.setItem('num', num -= 5)
        } else {
            document.querySelector('#Num').value = num;
            storage.setItem('num', 0)

            setTimeout(() => {
                _alert( storage.getItem('msg'))
            }, 2000);
        }
        CheckForm();
    }
    
    function buyloop() {
        
        if (num > 5) {
            storage.setItem('num', num -= 5)
            buy(id, 5);
            // 6000 ok
        } else {
            buy(id, num);
            storage.setItem('num', 0);
            console.log('购买完毕')
        }
    }

    function check() {
        var flag = false;
        if (window.location.href.indexOf('buy') != -1) {
            window.alert = function (str) {
                console.log(storage.getItem('msg') + '\n\r' + str )
                storage.setItem('msg', storage.getItem('msg') + '\n\r' + str)
                // storage.setItem('num', num)
                if (num > 0) {
                    setTimeout(() => {
                        window.location.reload();
                    }, gap);
                }
            }
            buy()
            return false;
        }

        if (window.location.href.indexOf('indexDetail') != -1) {
            storage.setItem('num', 0)
            alert('活动结束，已无库存。\r\n' + storage.getItem('msg'))
            return false;
        }
        $('.tuanlistbox').each(function () {
            if ($(this).text().indexOf(keyword) != -1) {
                var href = $(this).find('a').attr('href');
                var prams = href.slice(href.indexOf('?') + 1);
                var pramsArr = prams.split('&');
                var obj = {};
                flag = true;
                for (var x = 0; x < pramsArr.length; x++) {
                    var arr = pramsArr[x].split('=');
                    obj[arr[0]] = arr[1];
                }
                storage.setItem('id', obj.Id)

                console.log('/buy.asp?from=39&id=' + obj.Id)
                window.location.href = '/buy.asp?from=39&id=' + obj.Id;
                console.log(obj)
            }
        })


        if (!flag) {
            window.location.reload()
        }
    }
})();