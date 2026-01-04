// ==UserScript==
// @name         工时查询
// @namespace    http://tampermonkey.net/
// @version      2024-08-29
// @description  https://yihr.chinasoftinc.com:18010/#/personal/zrdaydetailnew
// @author       You
// @include      https://yihr.chinasoftinc.com:18010/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinasoftinc.com
// @grant        none

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505822/%E5%B7%A5%E6%97%B6%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/505822/%E5%B7%A5%E6%97%B6%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建按钮的函数
    function addButton() {
        // 获取类名为 dakaqy 的元素
        var dakaqyElement = document.querySelector('.dakaqy');
        if (dakaqyElement) {
            // 创建按钮
            var button = document.createElement("button");
            button.textContent = "我的工时"; // 按钮内容
            button.style.width = "90px"; // 按钮宽度
            button.style.height = "28px"; // 按钮高度
            button.style.color = "white"; // 按钮文字颜色
            button.style.background = "#FF69B4"; // 按钮底色
            button.style.border = "1px solid #e33e33"; // 边框属性
            button.style.borderRadius = "4px"; // 按钮四个角弧度
            button.style.marginTop = "10px";
            button.style.marginBottom = "10px";

            // 在 dakaqy 元素后面插入按钮
            dakaqyElement.insertAdjacentElement('afterend', button);
            console.log('按钮已添加');

            // 创建选择器
            var select = document.createElement("select");
            select.style.marginLeft = "10px";
            select.style.marginTop = "30px";

            // 添加选项到选择器
            var option1 = document.createElement("option");
            option1.value = "1";
            option1.text = "弹半小时";
            select.appendChild(option1);

            var option2 = document.createElement("option");
            
            option2.value = "2";
            option2.text = "弹一小时";
            select.appendChild(option2);
            select.id = "selectWork";
            // 在按钮后面插入选择器
            button.insertAdjacentElement('afterend', select);

            // 创建输入框
            var input = document.createElement("input");
            input.id="token"
            input.type = "text"; // 设置输入框类型为文本
            input.style.marginLeft = "10px";
            input.style.marginTop = "10px";
            input.style.display = "none";


            // 在选择器后面插入输入框
            select.insertAdjacentElement('afterend', input);
            
            var calculateButton = document.createElement("button");
            calculateButton.textContent = "计算"; // 按钮内容
            calculateButton.id = "btn";
            calculateButton.style.width = "60px"; // 按钮宽度
            calculateButton.style.height = "28px"; // 按钮高度
            calculateButton.style.color = "white"; // 按钮文字颜色
            calculateButton.style.background = "blue"; // 按钮底色
            calculateButton.style.border = "1px solid #e33e33"; // 边框属性
            calculateButton.style.borderRadius = "4px"; // 按钮四个角弧度
            calculateButton.style.marginTop = "10px";
            calculateButton.style.marginLeft = "10px";
            button.insertAdjacentElement('afterend', calculateButton);


            // 创建文本DOM用于显示
            var textDisplay = document.createElement("div");
            textDisplay.id="result"
            textDisplay.textContent = "分钟时间：";
            textDisplay.style.marginLeft = "10px";
            textDisplay.style.marginTop = "10px";

            // 在输入框后面插入文本DOM
            input.insertAdjacentElement('afterend', textDisplay);

             // 创建文本DOM用于显示
             var textDisplay2 = document.createElement("div");
             textDisplay2.textContent = "小时时间：";
             textDisplay2.style.marginLeft = "10px";
             textDisplay2.style.marginTop = "10px";
             textDisplay2.id="resultHour"
             // 在输入框后面插入文本DOM
             textDisplay.insertAdjacentElement('afterend', textDisplay2);
            
             let morning_time_1 = " 08:00:00",
                morning_time_2 = " 09:00:00",
                ningt_time_1 = " 17:30:00",
                ningt_time_2 = " 18:00:00";
            let token = "";
            let selectWork = document.getElementById("selectWork");
            let tokenDom = document.getElementById("token");

            let btn = document.getElementById("btn");
            let result = document.getElementById("result");
            let resultHour = document.getElementById("resultHour");

            btn.addEventListener("click", (e) => {
                if (selectWork.value == "2") {
                    morning_time_1 = " 08:00:00";
                    morning_time_2 = " 09:00:00";
                    ningt_time_1 = " 17:30:00";
                    ningt_time_2 = " 18:00:00";
                } else {
                    morning_time_1 = " 08:30:00";
                    morning_time_2 = " 09:00:00";
                    ningt_time_1 = " 18:00:00";
                    ningt_time_2 = " 18:30:00";
                }
                function getCookie(name) {
                    const cookieString = document.cookie;
                    const cookies = cookieString.split('; ');
                    for (const cookie of cookies) {
                      const [cookieName, cookieValue] = cookie.split('=');
                      if (cookieName === name) {
                        return cookieValue;
                      }
                    }
                    return null;
                  }
                  
                  const result = getCookie('UserToken');
                  
                console.log(tokenDom.value, "eeeeeeeeee",result,'点击了');
                deal(result)
                // tokenDom.value && deal(result);
            });

            const maxEnd = (arr) => {
                const minArr = arr.filter((item) => item.type === "1");
                const maxArr = arr.filter((item) => item.type === "2");
                let min = minArr[0];
                let max = maxArr[0];

                minArr.forEach((item) => {
                    if (+new Date(item) > +new Date(min)) {
                        min = item;
                    }
                });
                maxArr.forEach((item) => {
                    if (+new Date(item) > +new Date(max)) {
                        max = item;
                    }
                });
                return {
                    min,
                    max,
                };
            };

            const deal = (token) => {
                var urlencoded = new URLSearchParams();
                urlencoded.append("pageIndex", "1");
                urlencoded.append("pageSize", "50");
                urlencoded.append("search", '{"dt":"2024-08"}');
                fetch(
                    "https://yihr.chinasoftinc.com:18010/ehr_saas/web/icssAttEmpDetail/getLocSetDataByPage.empweb",
                    {
                        method: "POST", // 请求方式 默认Get请求
                        body: urlencoded, // 请求参数
                        headers: {
                            // 请求头
                            "Content-Type":
                                "application/x-www-form-urlencoded; charset=UTF-8",
                            token: token,
                        },
                    }
                )
                    .then((res) => {
                        return res.json();
                    })
                    .then((res) => {
                        const data = res.result.data.page.items;

                        // 按照 dt 分组
                        const groupedData = data.reduce((acc, curr) => {
                            const date = curr.dt;
                            if (!acc[date]) {
                                acc[date] = [];
                            }
                            acc[date].push(curr);
                            return acc;
                        }, {});
                        let total = 0;
                        // 将分组后的数据转换为数组
                        const groupedArray = Object.values(groupedData);
                        groupedArray.forEach((item) => {
                            console.log(item, "item------1");

                            if (item.length >= 2) {
                                const retObj = maxEnd(item);

                                let day = new Date(retObj.min.dt).getDay();
                                console.log(
                                    retObj.min.dt,
                                    day,
                                    "retObj.min.checktime"
                                );

                                let morning_num = 0;
                                if (
                                    +new Date(retObj.min.checktime) <
                                    +new Date(retObj.min.dt + morning_time_1)
                                ) {
                                    morning_num = 0;
                                } else {
                                    morning_num =
                                        (+new Date(
                                            retObj.min.dt + morning_time_1
                                        ) -
                                            +new Date(retObj.min.checktime)) /
                                        1000 /
                                        60;
                                }
                                console.log(
                                    morning_num,
                                    "morning_nummorning_nummorning_num"
                                );

                                let ningt_num = 0;
                                if (
                                    +new Date(retObj.max.checktime) >=
                                        +new Date(
                                            retObj.max.dt + ningt_time_1
                                        ) &&
                                    +new Date(retObj.max.checktime) <=
                                        +new Date(retObj.max.dt + ningt_time_2)
                                ) {
                                    ningt_num = 0;
                                } else if (
                                    +new Date(retObj.max.checktime) >
                                    +new Date(retObj.max.dt + ningt_time_2)
                                ) {
                                    {
                                        ningt_num =
                                            (+new Date(retObj.max.checktime) -
                                                +new Date(
                                                    retObj.max.dt + ningt_time_2
                                                )) /
                                            1000 /
                                            60;
                                    }
                                } else if (
                                    +new Date(retObj.max.checktime) <
                                    +new Date(retObj.max.dt + ningt_time_1)
                                ) {
                                    ningt_num =
                                        (+new Date(retObj.max.checktime) -
                                            +new Date(
                                                retObj.max.dt + ningt_time_1
                                            )) /
                                        1000 /
                                        60;
                                }
                                console.log(
                                    ningt_num,
                                    "ningt_numningt_numningt_num"
                                );

                                if (day == 6 || day == 0) {
                                    morning_num = ningt_num = 0;
                                }
                                if (
                                    retObj.min.checktime == retObj.max.checktime
                                ) {
                                    morning_num = ningt_num = 0;
                                }

                                console.log(
                                    morning_num + ningt_num,
                                    "morning_num + ningt_num"
                                );
                                total += morning_num + ningt_num;
                            }
                        });
                        result.innerHTML = total + "分钟";
                        resultHour.innerHTML = total / 60 + "小时";
                    });
            };

            return true; // 表示已添加按钮
        } else {
            return false; // 表示未找到元素
        }
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (addButton()) {
            observer.disconnect(); // 找到目标后停止监听
        }
    });

    // 配置观察器
    observer.observe(document.body, { childList: true, subtree: true });

    // 试探性添加按钮（在某些情况下，目标元素可能已存在）
    if (!addButton()) {
        console.log("未找到类名为 dakaqy 的元素");
    }

})();
