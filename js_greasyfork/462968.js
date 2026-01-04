// ==UserScript==
// @name         测试用例
// @namespace    http://tampermonkey.net/
// @version      1.70
// @description  每次重新打开ep测试用例的页面，都要点击好几次才能看到目标层级，可将该过程自动化。右下角的输入框里，填入各层级名称，以英文逗号为分隔符
// @author       wz
// @match        https://ep.komect.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/462968/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/462968/%E6%B5%8B%E8%AF%95%E7%94%A8%E4%BE%8B.meta.js
// ==/UserScript==

(function () {

       // 创建标题、关闭按钮
        const span = document.createElement('span');
        span.innerText="自动点击设置";
        span.style.fontSize="1.6rem";
        span.style.fontWeight="bold";

        const closeBtn = document.createElement("button");
        closeBtn.innerText="关闭";
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '0';
        closeBtn.style.left = '70%';

        var div = document.createElement('div');
        div.style.width = '20rem';
        div.style.height = '12rem';
        div.style.backgroundColor = '#46a6ff';

        // 创建输入框
        var input = document.createElement('textarea');
        input.style.width = '18rem';
        input.style.height = '9rem';
        input.style.fontSize = '1.6rem';

        // 添加到div中
        div.appendChild(span);
        div.appendChild(closeBtn);
        div.appendChild(input);

        // 在页面中添加div，居中显示
        document.body.appendChild(div);
        div.style.position = 'absolute';
        div.style.top = '100%';
        div.style.left = '98%';
        div.style.transform = 'translate(-100%, -100%)';

        // 在用户输入时将值保存到本地存储
        input.addEventListener('input', function() {
            var userInput = input.value;
            console.log("userInput is "+userInput);
            localStorage.setItem('userInput', userInput);
        });

        closeBtn.addEventListener("click", () => {
            div.style.display = "none";
        });


        // 尝试从本地存储中获取之前保存的值
        var objArr=[];

        var savedValue = localStorage.getItem('userInput');
        if (savedValue) {
            input.value = savedValue;
            var objs=savedValue.split(",");
            for (let i = 0; i < objs.length; i++) {
                objArr[i]=objs[i]
            }
            console.log("用户保存值为"+savedValue);
        }else{
            objArr[0] = "Andlink Sec";
        }

        var flag = [];
        let count = [];
        let maxCount = 40;
        var timer = [];
        var interval = 500;

        for (let j = 0; j < objArr.length; j++) {
            count.push(0);
            timer.push(setInterval(clickIt, interval));
        }

        function clickIt() {

            for (let i = 0; i < objArr.length; i++) {
                if (count[i] < maxCount) {
                    console.log("start");
                    var target = exist(objArr[i]);
                    if (target && flag[i] !== 1) {
                        console.log(target);
                        target.click();
                        clearInterval(timer[i]);
                        flag[i] = 1;
                    }
                    count[i]++;
                } else {
                    clearInterval(timer[i])
                }
            }
        }

        function exist(obj) {
            var elements = $('a:contains(' + obj + ')')[0];
            if (elements) {
                return $(elements).prev();
            } else {
                return false;
            }
        }


    })();
