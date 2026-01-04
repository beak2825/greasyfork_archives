// ==UserScript==
// @name         GDPU广药教务系统自动评价
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在评价页面，按“T”即可自动评价一个老师，全选优秀，评语是10条评语中随机一个
// @author       lindiqin
// @match        https://jwsys.gdpu.edu.cn/xspjgl/*
// @icon         https://cdn.pixabay.com/photo/2017/05/15/23/48/survey-2316468_1280.png
// @license      GPL-2.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483308/GDPU%E5%B9%BF%E8%8D%AF%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483308/GDPU%E5%B9%BF%E8%8D%AF%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function () {
//可以自行补充评语
    var remarks = ["教学风格独特，深入浅出。能够生动形象地讲解抽象概念，让学生轻松理解。课堂氛围活跃，鼓励学生提问，促进思考。",
        "对学生充满耐心，善于倾听。",
        "",
        "",
        "",
        "",
        ""];
    // 添加键盘事件监听器
    document.addEventListener('keydown', async function (event) {

        // 检查是否按下了 "t" 键，keyCode为116
        if (event.key === 't' || event.keyCode === 116) {
            setTimeout(function () {
                var flag = 0;
                var tds = document.querySelectorAll('td[role="gridcell"]');
                for (let i = 0; i < tds.length; i++) {
                    if (tds[i].innerText === '未评') {
                        //indexToClick.push(i);
                        tds[i].click();
                        flag = 1;
                        // tds[i].innerText = '评啦啦啦啦';
                        break;
                    }
                }

                setTimeout(function () {
                    //获取优秀的单选框对象
                    var targetInput = document.querySelectorAll('input[type="radio"][data-dyf="88"]');

                    targetInput.forEach(function (inputElement) {
                        // 每个单选框打钩
                        inputElement.checked = true;
                    });

                    //评语框对象，随机取一条评语放进去
                    var textareas = document.querySelector('textarea.form-control');
                    //随机数0-10
                    var random = Math.floor(Math.random() * remarks.length);
                    textareas.innerText = remarks[random];

                }, 1000);
            },100);








                    // }
            // }
            // for (let i = 0; i < tds.length; i++) {
            //     if (tds[i].innerText === '未评') {
            //         //indexToClick.push(i);
            //         tds[i].click();
            //         break;

            //     }
        }






    });



})();