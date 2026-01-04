// ==UserScript==
// @name         zzu健康打卡
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  网页版自动打卡
// @author       kingerast
// @include      https://jksb.v.zzu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442928/zzu%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/442928/zzu%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var uid = 'xxx'; // 账户名
    var password = 'xxx'; // 密码
    var myvsw_13c = '河南省.郑州市'; // 当前实际所在地
    var province = '41' // 所在省份
    var city = '4151' //所在城市 默认为主校区;4152:南校区; 4153:北校区 ;4154:东校区;4155:洛阳校区
    var myvs_24 = 1; // 当日返郑改为0
    var vaccination = '2'; //疫苗接种情况 1:已接种第1针剂;2:已接种第2针剂;3:尚未接种;4:有禁忌症，无法接种;5:已接种第3针剂;
    var memo22 = '河南省.郑州市'; // 地理位置

    var i = 1;
    console.log(document.getElementById('bak_0').innerText);
    window.onload = function () {
        if (document.title == '郑州大学统一身份认证平台' || document.title == '郑州大学师生健康上报平台') {
            document.getElementsByClassName('urls6h')[0].value = uid;
            document.getElementsByClassName('urls6h')[1].value = password;
            myform52.submit();
        } else if (document.title == '郑州大学数据中台2021') {
            if (document.getElementById('bak_0').childNodes[2].innerText == '师生员工个人健康上报主页') {
                myform52.submit();
            } else if (document.getElementById('bak_0').childNodes[2].innerText == '每日健康状况打卡' || document.getElementById('bak_0').childNodes[2].innerText == '每日健康状况打卡（系统依据你的测温记录自动填写）') {
                for (i; i <= 12; i++) {
                    document.getElementsByName('myvs_' + i)[1].checked = true;
                }

                var provinces = document.getElementsByName('myvs_13a')[0].options;
                for (let a = 0; a < provinces.length; a++) {
                    if (provinces[a].value == province) {
                        provinces[a].selected = true;
                    }
                }

                var cities = document.getElementsByName('myvs_13b')[0].options;
                for (let a = 0; a < cities.length; a++) {
                    if (cities[a].value == city) {
                        cities[a].selected = true;
                    }
                }

                document.getElementsByName('myvs_13c')[0].value = myvsw_13c;

                //当日返郑情况
                document.getElementsByName('myvs_24')[myvs_24].checked = true;

                var vaccinations = document.getElementsByName('myvs_26')[0].options;
                for (let a = 0; a < vaccinations.length; a++) {
                    if (vaccinations[a].value == vaccination) {
                        vaccinations[a].selected = true;
                    }
                }

                document.getElementsByName('memo22')[0].value = memo22;

                myform52.submit();

            } else if (document.getElementById('bak_0').childNodes[2].innerText == '已完成今日健康状况上报') {
                alert('已完成打卡');
            }
        }

    }
})();