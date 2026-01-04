// ==UserScript==
// @name         桀桀桀，小可爱1.0.1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快到点了打开图书馆网站
// @author       小李同学
// @match        http://172.16.47.84/
// @match        http://172.16.47.84/DayNavigation.aspx
// @match        http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528
// @icon         https://s1.aigei.com/src/img/png/59/59c93336529d4ddcb5dfcf2f452a1639.png?e=1735488000&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:oVGzlOUtqv7nmfR_nI0YoyX19wU=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476888/%E6%A1%80%E6%A1%80%E6%A1%80%EF%BC%8C%E5%B0%8F%E5%8F%AF%E7%88%B1101.user.js
// @updateURL https://update.greasyfork.org/scripts/476888/%E6%A1%80%E6%A1%80%E6%A1%80%EF%BC%8C%E5%B0%8F%E5%8F%AF%E7%88%B1101.meta.js
// ==/UserScript==
var currentUrl = window.location.href;
if (currentUrl == "http://172.16.47.84/") {
    var redirectTime = new Date();
    redirectTime.setHours(18, 20, 4);
    var currentTime = new Date();
    var timeDiff = redirectTime.getTime() - currentTime.getTime();

    if (timeDiff > 0) {
        setTimeout(function() {
            location.assign("http://172.16.47.84/");
        }, timeDiff);
    }
}
function runCode() {
    var count = localStorage.getItem("count");
    console.log(count)
    function getCurrentPage() {
        var currentPage = window.location.href;

        if (currentPage === 'http://172.16.47.84/') {
            localStorage.setItem("count", 0)
            return 1;
        } else if (currentPage === 'http://172.16.47.84/DayNavigation.aspx' && count <= 3) {
            return 2;
        } else if (currentPage === 'http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528'&& count <= 3) {
            /*改！ 改成你显示的校园网二级域名地址，就是你选座位的地址
            比如我的电脑上就是http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=790&wd=1528
            iPad 上是http://172.16.47.84/AppSTom.aspx?roomid=2201&hei=713&wd=1180
            手机我也没看，你自己看看，实在懒得改你把 roomid=2201 中的2201改成你的教室号，应该可以
            ！！！！！注意 也需要把最开始的@match加一行 具体为 // @match  加上你的这个地址，不然没法执行
            实在改不明白找我... wx:Ln132003oo
            */
            return 3;
        } else if (currentPage === 'http://172.16.47.84/Verify.aspx?seatid=3401111') {
            /*
            改！3401111  前四位改成你的教室号 后三位座位号 教室号具体往下看，下面有写
            */
            return 5;
        } else {
            return 4;
        }
    }
    async function executeSteps() {
        var currentPage = getCurrentPage();
        if (currentPage === 1) {
            await login();
            await cli();
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
                usernameField.value = '账号';//改！！你自己的
                passwordField.value = '密码';//改！！看上面
            }

           /* window.onload = function () {
                var element = document.querySelector('#Button1');
                if (element) {
                    element.click();
                }
            };*/

            resolve();
        });
    }
        function cli() {
        return new Promise(function (resolve, reject) {

            var element = document.querySelector('#Button1');
                if (element) {
                    element.click();
                console.log("cli")

            }
            localStorage.setItem("count", 0)
            resolve();
        });
    }

    function selectDay() {
        return new Promise(function (resolve, reject) {
            var select = document.querySelector('#ddlDay');
            if (select) {
                select.value = '明日';
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
                select1.value = '3401001';//改！介个嘛...中区101室 2101001 201室 2201001  206室 2206001 211室 2211001 请自行查阅更改，东区西区的....网页源码在下面自己康
                /*
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
                select1.value = '3408001';

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

    function switchSeat2() {
        return new Promise(function (resolve, reject) {
            window.location.href = 'Verify.aspx?seatid=2201144';// 改！2201144 、解析：前四位为教室号，参考选自习室是的前四位，后四位为座位号 你选1号就是001， 101号就是101，以此类推
            select.onchange()
            localStorage.setItem("count", 1)
            resolve();
        });
    }
    function newProgram() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var captchaImg = document.getElementById('Image1');
        var inputBox = document.getElementById('TextBox3');
        var confirmButton = document.getElementById('Button1');
        captchaImg.onload = function() {
            canvas.width = captchaImg.width;
            canvas.height = captchaImg.height;
            ctx.drawImage(captchaImg, 0, 0);
            var imageData = canvas.toDataURL();
            fetch('http://8.130.22.171:27060/send_image', {
                method: 'POST',
                body: JSON.stringify({ image: imageData }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                console.log(data.output);
                inputBox.value = data.output;
                confirmButton.click();
            });
        };
        captchaImg.src = 'http://172.16.47.84/VerifyCode.aspx';
        'use strict';

    }

    executeSteps();
}
let now = new Date();
let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 20, 0);
let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 25, 0);
if (now >= start && now <= end) {
    runCode();
}