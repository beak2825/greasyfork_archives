// ==UserScript==
// @name         禅道任务统计（自用）
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  统计禅道任务的工时
// @author       zyb
// @match        http://zentao.ngarihealth.com/index.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ngarihealth.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468190/%E7%A6%85%E9%81%93%E4%BB%BB%E5%8A%A1%E7%BB%9F%E8%AE%A1%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/468190/%E7%A6%85%E9%81%93%E4%BB%BB%E5%8A%A1%E7%BB%9F%E8%AE%A1%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class NewNavBar {

        navDom = document.querySelectorAll('#mainHeader #navbar ul')[0];
        timeId = null;
        times = 0;

        init() {
            this.timeId = setInterval(() => {
                if (this.navDom) {
                    this.setNewNavBar();
                    clearInterval(this.timeId);
                } else {
                    this.navDom = document.querySelectorAll('#mainHeader #navbar ul')[0];
                    this.times++;
                }

                if (this.times > 20) {
                    console.log('------------------');
                    console.log('未取到关键dom节点【#navbar ul】，请重试！');
                    console.log('------------------');
                    clearInterval(this.timeId);
                }
            }, 100)

        }

        setNewNavBar(){
            let liDomArray = Array.from(this.navDom.querySelectorAll('li'));
            let liDividerDom = this.createDom({
                element: 'li',
                attributeArr: [{ class: 'divider' }],
                innerHTML:''
            });
            
            let taskLiDom = this.createDom({
                element: 'li',
                attributeArr: [{ 'data-id': 'task' }],
                innerHTML:'<a href="/index.php?m=my&amp;f=task">任务</a>'
            });
            
            
            let bugLiDom = this.createDom({
                element: 'li',
                attributeArr: [{ 'data-id': 'bug' }],
                innerHTML:'<a href="/index.php?m=my&amp;f=bug">Bug</a>'
            });
            
            liDomArray.unshift(liDividerDom);
            liDomArray.unshift(bugLiDom);
            liDomArray.unshift(taskLiDom);

            this.navDom.innerHTML = '';

            liDomArray.forEach((item) => {
                this.navDom.appendChild(item)
            })
        }

        createDom(obj){
            let {element,attributeArr,innerHTML} = obj;

            if(!element){
                return;
            }

            let dom = document.createElement(element);

            attributeArr && attributeArr.length && attributeArr.forEach(function(obj){
                let arr = Object.entries(obj)[0];
                dom.setAttribute(arr[0], arr[1]);
            })

            innerHTML && (dom.innerHTML = innerHTML);

            return dom;
        }

    }

    class StatisticsWorkHours {
        // 统计工时的总节点
        statisticsWorkHourDivDom = null;
        // 统计工时按钮的Dom节点   
        statisticsWorkHourBtnDivDom = null;
        // 显示工时的Dom节点
        displayWorkHourDivDom = null;

        timeId = null;
        times = 0;
        clickFlag = true;
        mainMenuDom = document.querySelectorAll('#mainMenu')[0];

        init() {

            this.timeId = setInterval(() => {
                if (this.mainMenuDom) {
                    this.creatDom();
                    clearInterval(this.timeId);
                } else {
                    this.mainMenuDom = document.querySelectorAll('#mainMenu')[0];
                    this.times++;
                }

                if (this.times > 20) {
                    console.log('------------------');
                    console.log('未取到关键dom节点【#mainMenu】，请重试！');
                    console.log('------------------');
                    clearInterval(this.timeId);
                }
            }, 100)
        }

        // 初始化函数
        creatDom() {
            let _this = this;

            if (!this.mainMenuDom) {
                alert('未取到关键dom节点【#mainMenu】，请重试！');
                return;
            }

            // 创建css样式
            const head = document.head;
            const style = document.createElement('style');
            const cssStr = `
                #statisticsWorkHourDivDom {
                    height:33px;
                    display:flex;
                    align-items: center;
                    padding:10px;
                }

                #statisticsWorkHourBtnDivDom{
                    background-color:#0c64eb;
                    color:#fff;
                    border-radius:5px;
                    padding:5px;
                    cursor: pointer;
                }

                #displayWorkHourDivDom{
                    display:flex;
                    align-items: center;
                    padding:0 10px;
                }

                #displayWorkHourDivDom p{
                    margin:0;
                }

                #displayWorkHourDivDom span{
                    color:red;
                }
            `;
            const style_text = document.createTextNode(cssStr);
            style.appendChild(style_text);
            head.appendChild(style);

            // 创建统计工时的总节点
            this.statisticsWorkHourDivDom = document.createElement('div');
            this.statisticsWorkHourDivDom.setAttribute('id', 'statisticsWorkHourDivDom');
            // 统计工时按钮的Dom节点
            this.statisticsWorkHourBtnDivDom = document.createElement('div');
            this.statisticsWorkHourBtnDivDom.setAttribute('id', 'statisticsWorkHourBtnDivDom');
            this.statisticsWorkHourBtnDivDom.innerHTML = '统计工时';
            // 显示工时的Dom节点
            this.displayWorkHourDivDom = document.createElement('div');
            this.displayWorkHourDivDom.setAttribute('id', 'displayWorkHourDivDom');

            // 将各个dom节点填充到页面中
            this.mainMenuDom.appendChild(this.statisticsWorkHourDivDom);
            //添加按钮到dom节点
            this.statisticsWorkHourDivDom.appendChild(this.statisticsWorkHourBtnDivDom);
            this.statisticsWorkHourDivDom.appendChild(this.displayWorkHourDivDom);

            // 点击按钮触发
            this.statisticsWorkHourBtnDivDom.onclick = function () {
                if (!_this.clickFlag) {
                    console.log("重复点击");
                    return;
                }
                _this.displayWorkHourDivDom.innerHTML = '统计中...';
                _this.clickFlag = false;
                // 统计禅道任务的工时
                _this.getWorkHour();
            }

        }

        // 统计禅道任务的工时
        getWorkHour() {

            // 数据处理，以便于后续操作
            // 获取需求列表的dom节点，请将每页选项调整到40或更多
            let trListDom = Array.from(document.querySelectorAll('#main #mainContent tbody tr')) || [];
            // 任务需求数组
            let requirementsList = trListDom.map(itemDom => {
                // id
                const id = itemDom.querySelectorAll('.c-id')[0].querySelectorAll('.checkbox-primary input')[0].value;
                // 预计开始日期
                const dateStr = itemDom.querySelectorAll('td:nth-child(6)')[0].innerText || '';
                // 预计工时
                const estimateWorkHour = +itemDom.querySelectorAll('td:nth-child(10)')[0].innerText || 0;
                // 消耗工时
                const consumeWorkHour = +itemDom.querySelectorAll('td:nth-child(11)')[0].innerText || 0;

                return { dateStr, estimateWorkHour, consumeWorkHour, id }
            }) || [];

            // 处理异步请求，兼容不需要请求接口的数据
            const promiseList = requirementsList.map(async (item) => {
                let promise;
                if (!item.dateStr) {
                    // item.dateStr为空，表示是被分配的需求

                    // 设置请求的url
                    let url = `http://zentao.ngarihealth.com/index.php?m=task&f=view&taskID=${item.id}`
                    // 将异步请求转为同步，目的是减少服务器压力，以免被检测后封锁ip
                    promise = await this.ajaxAsyncFuc({ url });

                } else {
                    // item.dateStr不为空，表示是自己创建的需求，不需要额外调用接口获取日期

                    // 新建Promise对象，返回值为空
                    promise = await new Promise((resolve, reject) => {
                        resolve();
                    })
                }

                return { data: promise, object: item };

            })

            // 等待所有请求完成后，对不同月份的数据进行处理
            Promise.all(promiseList).then(res => {
                // 是否统计被分配的需求的工时标识
                let tipsFlag = true;

                // 处理完后存储的数据
                let dataForMonthObj = {
                    // 本月的月份
                    nowMonthStr: '',
                    // 本月预计工时
                    estimateWorkHour: 0,
                    // 本月实际消耗工时
                    consumeWorkHour: 0,
                    // 上个月的月份
                    preMonthStr: '',
                    // 上个月预计工时
                    preEstimateWorkHour: 0,
                    // 上个月实际消耗工时
                    preConsumeWorkHour: 0,
                    // 这周消耗的工时
                    thisWeekConsumeWorkHour: 0,
                    // 上周消耗的工时
                    lastWeekConsumeWorkHour: 0,
                };

                // 遍历返回值
                res.map(item => {
                    let obj = {};

                    if (item.data) {
                        // data字段有数据，说明是被分配的需求

                        // 创建一个div的Dom节点，将接口返回的HTML字符串转为Dom节点
                        let div = document.createElement('div');
                        div.innerHTML = item.data;
                        const trDom = div.querySelectorAll('#legendLife tbody tr:nth-child(2)')[0];
                        const value = trDom.querySelectorAll('td')[0].innerText || '';
                        // 创建正则规则，匹配yyyy-MM-dd或yyyy/MM/dd时间格式
                        const regex = /\d{4}[-/]\d{2}[-/]\d{2}/g;

                        obj = {
                            ...item.object,
                            // 截取符合正则规则的字符串，即任务日期
                            dateStr: value.match(regex) && value.match(regex)[0] || '',
                        };

                        // data字段有数据，说明是被分配的需求，所以不需要提示文案
                        tipsFlag = false;

                    } else {
                        // data字段无数据，说明是自己创建的需求

                        obj = { ...item.object };
                    }

                    // 日期处理
                    // 本月的月份
                    let nowMonth = new Date().getMonth() + 1;
                    // 上个月的月份
                    let previousMonth = (nowMonth === 1) ? 12 : (nowMonth - 1);
                    // 本周周一的日期
                    let mondayDate = new Date().getLastWeekday();
                    // 上周一的日期
                    let lastMondayDate = new Date(mondayDate.getTime() - 1000).getLastWeekday();


                    // 如果dateStr为空，说明此任务还没完成
                    if (obj.dateStr) {

                        // 当前数据的开始时间
                        let date = new Date(obj.dateStr);
                        // 当前数据的开始时间月份
                        let month = date.getMonth() + 1;

                        // 如果是本月数据
                        if (month === nowMonth) {
                            dataForMonthObj.nowMonthStr = month;
                            dataForMonthObj.estimateWorkHour += obj.estimateWorkHour;
                            dataForMonthObj.consumeWorkHour += obj.consumeWorkHour;
                        }
                        // 如果是上月数据
                        if (month === previousMonth) {
                            dataForMonthObj.preMonthStr = month;
                            dataForMonthObj.preEstimateWorkHour += obj.estimateWorkHour;
                            dataForMonthObj.preConsumeWorkHour += obj.consumeWorkHour;
                        }

                        // 如果是这周的数据
                        if (date.getTime() > mondayDate.getTime()) {
                            dataForMonthObj.thisWeekConsumeWorkHour += obj.consumeWorkHour;
                        }
                        // 如果是上周的数据
                        if (date.getTime() < mondayDate.getTime() && date.getTime() > lastMondayDate.getTime()) {
                            dataForMonthObj.lastWeekConsumeWorkHour += obj.consumeWorkHour;
                        }
                    }


                    return obj
                })
                // 将处理完的数据显示到页面上
                this.setDivValueFuc(dataForMonthObj, tipsFlag);
                this.clickFlag = true;
            });

        }

        // 将处理完的数据显示到页面上
        setDivValueFuc(dataForMonthObj, tipsFlag) {
            this.displayWorkHourDivDom.innerHTML = `
		        <p>${dataForMonthObj.nowMonthStr}月消耗时间：<span>${dataForMonthObj.consumeWorkHour}</span>工时；</p>
		        <p>${dataForMonthObj.preMonthStr}月消耗时间：<span>${dataForMonthObj.preConsumeWorkHour}</span>工时；</p>
		        <p>本周消耗时间：<span>${dataForMonthObj.thisWeekConsumeWorkHour}</span>工时；</p>
		        <p>上周消耗时间：<span>${dataForMonthObj.lastWeekConsumeWorkHour}</span>工时；</p>
                <p>${tipsFlag ? ('<span>注意！未统计被分配的需求的工时</span>') : ('<span></span>')}</p>
		    `;
        }

        // 发送ajax数据
        async ajaxAsyncFuc(obj = {}) {
            return new Promise(function (resolve, reject) {
                // 发送数据
                const xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
                const url = obj.url || ''; // 要访问的URL地址
                const contentType = obj.contentType || 'application/x-www-form-urlencoded'; // 设置请求头
                const type = obj.type || "GET"; // 定义请求方法
                const data = obj.data;

                xhr.open(type, url); // 定义请求方法和URL
                xhr.setRequestHeader('Content-type', contentType); // 设置请求头

                // 处理请求响应
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            // console.log(xhr.responseText); // 响应内容将会被打印到控制台
                            resolve(xhr.responseText);
                        } else {
                            reject();
                        }
                    }
                }

                // 发送POST请求
                xhr.send(data); // 动态添加请求数据
            })
        }
    }

    // let taskHref = 'http://zentao.ngarihealth.com/index.php?m=my&f=task';
    let taskSearch = '?m=my&f=task';
    let { search } = location;

    if (search.includes(taskSearch)) {
        // 统计工时
        let statisticsWorkHours = new StatisticsWorkHours();
        statisticsWorkHours.init();
    }

    let newNavBar = new NewNavBar();
    newNavBar.init();

    // <li class="divider"></li>

})();