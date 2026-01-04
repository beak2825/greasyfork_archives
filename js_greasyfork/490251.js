// ==UserScript==
// @name         一窗通自动统计(源)
// @namespace    http://tampermonkey.net/
// @version      v0.20
// @description  对这里修改!
// @author       You
// @match        https://yct.amr.shandong.gov.cn/psout/jsp/gcloud/iaicweb/homepage/apply_manage.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shandong.gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490251/%E4%B8%80%E7%AA%97%E9%80%9A%E8%87%AA%E5%8A%A8%E7%BB%9F%E8%AE%A1%28%E6%BA%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490251/%E4%B8%80%E7%AA%97%E9%80%9A%E8%87%AA%E5%8A%A8%E7%BB%9F%E8%AE%A1%28%E6%BA%90%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function(){
        let doc = document.querySelector('iframe').contentDocument;
        let ywztlb = doc.querySelector('.ywztlb');
        //console.log(ywztlb);
        console.log('点击',ywztlb.firstElementChild);
        setTimeout(function(){
            ywztlb.firstElementChild.click();//每次刷新或者运行脚本，点击一次材料提交
        },1000);

        ywztlb.addEventListener('click', aclick);
        function aclick() {
            //监听ywztlb框，点击即可触发。后期默认刷新执行一次【材料提交】统计

            let tbody = doc.querySelector('tbody');
            //console.log(tbody.textContent);
            let tbData = tbody.textContent;
            tbData = tbData.split(`    `);
            //console.log(tbData);
            let tbData1 = tbData.filter(function(item) {
                //过滤短的数据
                return item.length >= 25;
            });
            // console.log('tbData1',tbData1);
            // for (let i = 0; i < tbData1.length; i++) {
            //     console.log(`tbData1[${i}]`,'过滤后长度=', tbData1[i].length,tbData1[i]);
            // }
            const data = tbData1;
            const results = data.map(item=>{
                // 正则表达式，用于匹配公司名称、编号、业务类型、时间和状态
                const regex = /(.*?)(0\d{13})(.*?)(设立登记|变更登记|注销登记|备案登记|增补换照)(\d{4}-\d{2}-\d{2})(.{4}?)(.*?)/;
                const match = item.match(regex);
                //console.log('match', match);
                if (match) {
                    // 返回提取出的信息

                    return {
                        workingHours: workingHours(),
                        //编号: match[2],
                        公司名称: match[3],
                        业务类型: match[4],
                        业务申请时间: match[5],
                        办理状态: match[6],

                    };
                } else {
                    return null;
                }

            }
                                    );

            // 过滤掉 null 值，只保留成功匹配的对象

            const filteredResults = results.filter(result=>result !== null);

            //console.log(filteredResults);
            saveData(filteredResults);

        }

        function workingHours_old(){
            const dateObj = new Date();
            const year = dateObj.getFullYear(); // 获取当前年份
            const month = ("0" + (dateObj.getMonth() + 1)).slice(-2); // 获取当前月份，其中需要将月份加1，因为月份是从0开始计数的
            const day = ("0" + dateObj.getDate()).slice(-2); // 获取当前日期
            const formattedDate = `${year}-${month}-${day}`; // 格式化日期
            console.log(formattedDate); // 输出当前时间的年月日
            return formattedDate;
        }
        function workingHours() {
            let now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let time;
            switch (hours) {
                case 8:
                    time = `8:30-9:30`;
                    break;
                case 9:
                    if (minutes <= 30) {
                        time = `8:30-9:30`;
                    } else {
                        time = `9:30-10:30`;
                    }
                    break;
                case 10:
                    if (minutes <= 30) {
                        time = `9:30-10:30`;
                    } else {
                        time = `10:30-11:30`;
                    }
                    break;
                case 11:
                    if (minutes <= 30) {
                        time = `10:30-11:30`;
                    } else {
                        time = `11:30-12:00`;
                    }
                    break;
                case 12:
                    time = `午休`;
                    break;
                case 13:
                    time = `午休`;
                    break;
                case 14:
                    if (minutes <= 30) {
                        time = `14:00-14:30`;
                    } else {
                        time = `14:30-15:30`;
                    }
                    break;
                case 15:
                    if (minutes <= 30) {
                        time = `14:30-15:30`;
                    } else {
                        time = `15:30-16:30`;
                    }
                    break;
                case 16:
                    if (minutes <= 30) {
                        time = `15:30-16:30`;
                    } else {
                        time = `16:30-17:30`;
                    }
                    break;
                case 17:
                    time = `16:30-17:30`;
                    break;
                default:
                    time = `不在工作时间`;
            }
            return time;
        }

        function saveData(data) {
            let oldData = isEqule();
            if (!oldData) {
                //无数据，直接初始化保存
                localStorage.setItem('uData', JSON.stringify(data));
                return;
            }
            //console.log('oldData', typeof oldData, oldData);
            //console.log('data', typeof data, data);
            /*对比数据，数据相同不保存，数据不同增加
                workingHours: workingHours(),
                //编号: match[2],
                公司名称: match[3],
                业务类型: match[4],
                业务申请时间: match[5],
                办理状态: match[6],
        1、先判断workingHours工作时间段，工作时间段不同，直接新增保存
        2、同一个工作时间段，根据公司名字进行判断，名称相同，判断业务类型和业务申请时间，都相同说明是同一个业务，否则，不同的业务，新增保存这条记录：
            将oldData转换成object或数组,新数据数组，嵌套遍历，根据上述逻辑判断
    */
            //1、判断工作时间workingHours,
            let result = new Array();
            //直接result=oldData 修改result会影响oldData

            for (let n = 0; n < oldData.length; n++) {

                result[n] = oldData[n];
            }
            //
            for (let i = 0; i < data.length; i++) {
                //记录是否需要新增保存，默认不保存
                for (let j = 0; j < oldData.length; j++) {
                    if (data[i].workingHours != oldData[j].workingHours) {
                        //工作时间不同，说明换工作人员了，新增保存这条记录
                        if (j >= oldData.length - 1) {
                            console.log("工作时间不同，工作人员轮班，新增保存");
                            result.push(data[i]);
                            break;
                        }

                    } else {
                        /*同一个工作时间，再根据公司名称来判断：
                1、data中，如果没有在oldData中找到重复的名称，说明是新业务，直接新增保存
                2、否则，公司名称相同的情况下，业务类型、申请时间全都相同才略过这条记录，只要有一条不同，新增保存
                */
                        console.log("工作时间相同，继续判断");
                        if (data[i]['公司名称'] == oldData[j]['公司名称']) {
                            console.log("公司名称相同，继续判断");
                            if (data[i]['业务类型'] == oldData[j]['业务类型'] && data[i]['业务申请时间'] == oldData[j]['业务申请时间']) {
                                //同一条记录,不保存
                                console.log('重复记录【', data[i]['公司名称'], '】');
                                break;

                            } else {
                                result.push(data[i]);
                                console.log('已有公司发起新业务', data[i]);
                                break;
                            }
                        } else {
                            //全部遍历后发现公司名称不同，新业务，保存
                            //console.log(`公司名称不同，比较长度length=${oldData.length},与当前位置j=${j}`,data[i]);
                            if (j >= oldData.length - 1) {
                                result.push(data[i]);
                                console.log('新公司业务', j, data[i]);
                                break;
                            }

                        }
                    }
                }
                //localStorage.setItem('uData', JSON.stringify(result));
            }
            if (result != oldData && result != '') {

                localStorage.setItem('uData', JSON.stringify(result));

                console.log('数据已保存');
            } else {
                console.log('数据无变化');
            }

            //copyObjectToClipboard(result);//复制

        }
        function isEqule() {
            let oldData = JSON.parse(localStorage.getItem("uData"));
            // console.log(oldData);
            if (!oldData) {
                //无数据，初始化
                return false;
            }
            return oldData;
        }
        async function copyObjectToClipboard(obj) {
            //复制到剪切板
            //const jsonString = JSON.stringify(obj);
            const jsonString = JSON.stringify(obj);

            try {

                await navigator.clipboard.writeText(jsonString);
                console.log('已复制到剪切板');
            } catch (error) {
                /*const input = document.createElement('input')
                document.body.appendChild(input)
                input.setAttribute('value', jsonString)
                input.select()*/
                let input = document.querySelector('iframe').contentDocument.querySelector('#applyNo');
                input.setAttribute('value', jsonString);
                input.select()
                if (document.execCommand('copy')) {
                    document.execCommand('copy')
                }
                //document.body.removeChild(input)
                console.log('复制成功')
            }
        }
        inserBtn();
        //inserBtn();
        function inserBtn() {
            //打开微信对话开放平台并复制
            // 创建弹窗元素
            let popup = document.querySelector("#popup");
            let myBtn = document.querySelector('iframe').contentDocument.querySelector('#myBtn');
            let myCopy = document.querySelector('iframe').contentDocument.querySelector('#myCopy');
            if (myBtn || myCopy || popup) {
                //myBtn.remove();
                myCopy.remove();
                popup.remove();
            }
            popup = document.createElement("dialog");
            popup.id = "popup";
            popup.style = 'width:40%;height:50%;margin: auto;';
            document.body.appendChild(popup);

            myBtn = document.createElement('button');
            myBtn.className = 'btn btn-primary'
            myBtn.id = 'myBtn'
            myBtn.type = 'button';
            myBtn.style = 'margin-left: 30px;';
            myBtn.textContent = '复制并发送业务统计';

            myCopy = document.createElement('button');
            myCopy.className = 'btn btn-primary'
            myCopy.id = 'myCopy'
            myCopy.type = 'button';
            myCopy.style = 'margin-left: 10px;';
            myCopy.textContent = `查看6`;
            //document.querySelector('iframe').contentDocument.querySelector('#applyNo').placeholder = `当前脚本版本：${GM_info.script.version}`;
            //console.log(GM_info.script);
            let parent = document.querySelector('iframe').contentDocument.querySelector('#submitButton').parentElement;
            //parent.appendChild(myBtn);
            parent.appendChild(myCopy);
            let src = 'https://chatbot.weixin.qq.com/webapp/gDgMWg05Ww60SzW6cQUqsYYfomdhaB?robotName=业务量统计';
            myBtn.addEventListener('click', function() {
                //copyObjectToClipboard(JSON.parse(localStorage.getItem("uData")));//复制
                copyObjectToClipboard(localStorage.getItem("uData"));//复制
                setTimeout(function(){
                    window.open(src, '_blank');

                },1000);


            });
            myCopy.addEventListener('click', function() {
                //document.querySelector('iframe').contentWindow.loadData(this, '00');
                //document.querySelector('iframe').contentWindow.loadData(this, '10');
                //document.querySelector('iframe').contentWindow.loadData(this, '40');
                //document.querySelector('iframe').contentWindow.loadData(this, '30');
                //let doc = document.querySelector('iframe').contentDocument;
                //let ywztlb = doc.querySelector('.ywztlb').click();
                //简单加密
                //console.log(GM_info.script.version);
                let pwd = document.querySelector('iframe').contentDocument.querySelector('#applyNo');
                if('6'!=pwd.value){
                    return;
                }
                pwd.value = '';

                let oldData = JSON.parse(localStorage.getItem("uData"));
                //console.log(oldData);
                if (!oldData) {
                    alert('数据为空~');
                    return;
                }
                popup.innerHTML = `
        <button id= 'popupClose' type="button" class='btn btn-primary' style = 'margin-left: 90%;' onclick = 'popup.close()'>X</button
        <div id = 'mydiv'></div>
        `;
                let mydiv = document.createElement('div');
                mydiv.id = 'mydiv';
                let text = '';

                for (let i = 0; i < oldData.length; i++) {

                    for (var key in oldData[i]) {
                        if (oldData[i].hasOwnProperty(key)) {
                            //popup.innerHTML += `<span> ${oldData[i][key]}  </span>`;
                            text += oldData[i][key] + '\t\t\t';
                        }
                    }
                    //popup.innerHTML += `</br>`;
                    text += '\n';

                }
                popup.appendChild(mydiv);
                mydiv.innerText = text;
                mydiv.appendChild(myBtn);
                popup.showModal();
            });
        }

    }
})();