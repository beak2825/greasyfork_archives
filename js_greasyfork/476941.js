// ==UserScript==
// @name         桀桀桀，小可爱 0..0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快到点了打开
// @author       小李同学
// @match        http://172.16.47.84/
// @match        http://172.16.47.84/DayNavigation.aspx
// @match        http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528
// @icon         https://s1.aigei.com/src/img/png/59/59c93336529d4ddcb5dfcf2f452a1639.png?e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:oVGzlOUtqv7nmfR_nI0YoyX19wU=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476941/%E6%A1%80%E6%A1%80%E6%A1%80%EF%BC%8C%E5%B0%8F%E5%8F%AF%E7%88%B1%2000.user.js
// @updateURL https://update.greasyfork.org/scripts/476941/%E6%A1%80%E6%A1%80%E6%A1%80%EF%BC%8C%E5%B0%8F%E5%8F%AF%E7%88%B1%2000.meta.js
// ==/UserScript==

//注意！！！！上面的这个需要修改   只改一个    // @match        http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528 只改‘roomid= ’2201改成你需要到的教室号，参考下面selectroom的大段注释
function executeSteps() {
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinute = now.getMinutes();
    if (!(currentHour === 18 && currentMinute >= 19 && currentMinute < 24)) {
        return;
    }
(function () {
    'use strict';
    var count = localStorage.getItem("count");
    console.log(count)
    function getCurrentPage() {
        var currentPage = window.location.href;

        if (currentPage === 'http://172.16.47.84/') {
            localStorage.setItem("count", 0)
            return 1;
        } else if (currentPage === 'http://172.16.47.84/DayNavigation.aspx' && count <= 3) {
            return 2;
        } else if (currentPage === 'http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528') {//给我改！！ 只改‘roomid= ’2201改成你需要到的教室号，参考下面selectroom的大段注释
            return 3;
        } else if (currentPage === 'http://172.16.47.84/Verify.aspx?seatid=1201***') {
            return 5;
        } else {
            return 4;
        }
    }
  async function executeSteps() {
        var currentPage = getCurrentPage();
        if (currentPage === 1) {
            await login();
        } else if (currentPage === 2) {
            if (count == 0)
                setTimeout(selectDay, 100)
            if (count == 1)
                setTimeout(selectRoom, 100)
            if (count == 2)
                setTimeout(switchSeat, 100)
        } else if (currentPage === 3) {
              if (count == 3)
                setTimeout(switchSeat2, 100)
        } else if (currentPage === 4) {
            setTimeout(function() {
            window.location.href = 'http://172.16.47.84/';
        }, 8000);
        } else if (currentPage === 5) {
            newProgram();
        }
    }
    function login() {
        return new Promise(function (resolve, reject) {
            var usernameField = document.getElementById('TextBox1');
            var passwordField = document.getElementById('TextBox2');

            if (usernameField && passwordField) {
                usernameField.value = '2020132003';//给我改！！写你自己的 注意！！！    ' '这俩逗号不动，只改逗号里面的
                passwordField.value = 'ln607607..';//给我改！！注意！！！    ' '这俩逗号不动，只改逗号里面的
            }

            window.onload = function () {
                var element = document.querySelector('#Button1');
                if (element) {
                    element.click();
                }
            };

            resolve();
        });
    }
    function selectDay() {
        return new Promise(function (resolve, reject) {
            var select = document.querySelector('#ddlDay');
            if (select) {
                select.value = '明日';//别动！！！
                select.onchange()
                localStorage.setItem("count", 1)
                resolve();
            } else {
                resolve();
            }
        });
    }
    function selectRoom() {
        return new Promise(function (resolve, reject) {
            var select1 = document.querySelector('#ddlRoom');
            if (select1) {
                select1.value = '2201001';//介个嘛...是改你在哪个教室 比如中区101室 2101001 201室 2201001  206室 2206001 211室 2211001 请自行查阅更改，东区西区的....网页源码在下面自己康
                /*
                注意！！！    ' '这俩逗号不动，只改逗号里面的
                前四位为教室号，后三位为座位号
    <option selected="selected" value="1201001">东区图书馆自习室201室</option>
    <option value="1202001">东区图书馆自习室202室</option>
    <option value="1293001">东区图书馆自习室293室</option>
    <option value="1294001">东区图书馆自习室294室</option>
    <option value="1401001">东区图书馆自习室401室</option>
    <option value="1702001">东区图书馆自习室702室</option>
    <option value="2101001">中区图书馆自习室101室</option>
    <option value="2201001">中区图书馆自习室201室</option>
    <option value="2206001">中区图书馆自习室206室</option>
    <option value="2211001">中区图书馆自习室211室</option>
    <option value="3401001">西区图书馆自习室401室</option>
    <option value="3408001">西区图书馆自习室408室</option>

*/
                select1.onchange();
                localStorage.setItem("count", 2)
                resolve();
            } else {
                resolve();
            }
        });
    }
    function step4() {
        return new Promise(function (resolve, reject) {
            var select1 = document.querySelector('#ddlRoom');
            if (select1) {
                select1.value = '3408001';//不用管
                var event = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                select1.dispatchEvent(event);
                event = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                select1.dispatchEvent(event);
                resolve();
            } else {
                resolve();
            }
        });
    }
    function switchSeat() {
        return new Promise(function (resolve, reject) {

            var button = document.querySelector('#Button2');
            if (button) {
                button.click();
                console.log("switchSeat")
            }
            localStorage.setItem("count", 3)
            resolve();
        });
    }
    function step6() {
        return new Promise(function (resolve, reject) {
            window.location.href = 'Verify.aspx?seatid=2201106';//给我改！！2201144 、解析：前四位为教室号，参考选自习室是的前四位，后四位为座位号 你选1号就是001， 101号就是101，以此类推
            resolve();
        });
    }
    function newProgram() {
        1
    }
    executeSteps();
    // 最重要的就是验证码，这个不太好搞，先在油猴搜索脚本让我和验证码同时作用
})();
}
setInterval(executeSteps, 8000);