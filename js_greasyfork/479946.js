// ==UserScript==
// @name         抢号
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  抢号哟!
// @author       大魔王
// @match        http://10.176.1.49/call/*

// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/479946/%E6%8A%A2%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/479946/%E6%8A%A2%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let updataStr =`版本内容：
    v0.1 2023年11月17日  基本功能：抢号，失败继续抢；成功停止。
    v0.2 2023年11月17日09:36:03  增加更新按钮、权限控制、窗口号解密，员工加密
    v0.3 2024年1月15日15:09:45  使用MutationObserver实现监听
    v0.4 2024年5月22日16:08:34 显示总数，点击总数，各个按钮会刷新总数，MutationObserver监听到会刷新总数；
         2024年5月23日11:56:45 serviceButtonStyle()暂停服务功能样式改变；
         MutationObserver监听逻辑改变：默认启动，以监听总数，只有点击【开始】才会叫号及打印日志
    v0.5 2024年5月24日08:55:16 统计叫号量，鼠标放在【今日服务】上会显示排名
    v0.6 鼠标放在【排队人数】上显示当前各个窗口情况，空闲还是叫号
    v0.7 bug:isQueueNum()函数中，日志输出转移到addBtn()创建控制按钮函数中；权限：无权限的不能抢号，其他功能可以使用
          控制按钮显示效果优化
          增加：今日窗口数，用来计算平均数
    v0.71 2024年6月6日09:43:08 增加关闭窗口功能，优化显示窗口情况：服务中、空闲（空白表示）、窗口关闭
    v0.8  2024年6月6日17:05:55 1、叫号时增加一个判断条件，非暂停服务 ；2、暂停服务按钮的获取增加判断条件，更精准； 3、-无权限时，最后一名自动叫号(未测试）
    v0.9  2025年1月14日15:05:58 1、无权限时，最后一名自动叫号 2、根据叫号排名中的窗口数，设置当天开放窗口数winNum，计算平均数
`;

    let itime = 1000;
    //重复时间
    let ipt;//初始化放在addBtn()中
    //利用【输入排队号】显示状态
    let loadingMsg = '当前没有排队号……'
    let titleOld = "主页-统一排队呼叫客户端";
    let titleNew = '抢号成功(*^▽^*)';
    let IntervalId;
    let employeeArray = ['çå®æ´', '', ''];//权限列表
    let observer;//观察器
    let winNum;//当天开放的窗口数量，用来计算平均叫号数
    let ranking = 1;//我的排名，用来给无权限的最后一名抢号. 默认第一名
    authorityControl();//权限控制,内包含多个函数的调用

    //初始化，添加脚本控制按钮
    function main() {
        //主函数
        if (document.querySelector('#myBtn').value === '开始')
            //开关控制  //初始为：开始，点击后脚本运行，此时状态为stop；再次点击后标本停止，此时状态为开始
            return;
        //isQueueNum();//v0.4版本后默认运行


    }
    function beginAndOk(type) {//type=-1,最后一名自动叫号
        //抢号并判断是否抢号成功
        if(type!=-1){
            if ('开始' == document.querySelector('#myBtn').value) return;
        }
        
        findBtn('呼叫').click();  //测试时屏蔽

        //findBtn('刷新记录').click(); //测试
        if (findBtn('呼叫').disabled) {
            //如果 【呼叫】按钮为禁用状态，说明抢号成功  ,日志清空，脚本按钮初始化
            console.log('抢号成功(*^▽^*)');
            ipt.value = '';
            //document.querySelector('#myBtn').value = 'start';
            stop(document.querySelector('#myBtn'));

        } else {
            console.log('抢号失败o(╥﹏╥)o');
            findBtn('刷新记录').click();//清除标题闪烁
            // clearInterval(IntervalId);
            ipt.value = '';
        }
    }

    function findBtn(str) {
        //根据显示名字寻找按钮
        let btnArray = document.querySelectorAll('button');
        let i = 0;
        for (i; i < btnArray.length - 1; i++) {
            if (btnArray[i].textContent === str) {
                //console.log(btnArray[i]);
                break;
            }
        }
        return btnArray[i];
    }
    function isQueueNum() {//监听函数 MutationObserver  v0.4改动
        //获取暂停服务按钮
        let serviceButtonList = document.getElementsByClassName('el-button');
        let serviceButton;
        for (let i = 0; i < serviceButtonList.length; i++) {
            if ('暂停服务' == serviceButtonList[i].textContent ||'恢复服务' == serviceButtonList[i].textContent) {
                serviceButton = serviceButtonList[i];
                break;
            }
        }

        // 选择要观察变动的节点
        //const targetNode = document.querySelector('.el-table__body-wrapper.is-scrolling-none');
        const targetNode  = document.querySelector('.el-table__body tbody');
        // 观察器的配置（需要观察什么变动）

        const config = { childList: true, subtree: true, removedNodes: null };//只监听节点插入
        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if('暂停服务' == serviceButton.textContent){//抢号的前提是没有暂停服务
                        if(document.querySelector('#myBtn')){
                            if ('停止' == document.querySelector('#myBtn').value ){//【有权限】 抢号的条件1、手动点击了开始抢号 2、没有暂停服务中
                                console.log(Date.now(), new Date(), "观察到节点插入，抢号~");
                                ipt.value = '检测到排队号，抢号~';
                                beginAndOk();
                            }
                        }else{
                            //【无权限】 抢号条件1、排名最后一名，即排名=winNum 2、没有暂停服务中
                            console.log(`我的排名：${ranking+1},今日窗口数:${winNum} \n  【无权限】 抢号条件1、排名最后一名，即排名=winNum 2、没有暂停服务中`);
                            if((ranking+1)==winNum){
                                console.log('排名最后一名,自动叫号');
                                //ipt.value = '排名最后一名,自动叫号~';
                                document.querySelector('.el-input__inner').value= '排名最后一名,自动叫号~';
                                beginAndOk(-1);
                            }
                        }
                    }




                    getAllCount();//总数刷新
                }
            }

            //observer.disconnect();//停止
        };
        // 创建一个观察器实例并传入回调函数
        observer = new MutationObserver(callback);
        console.log("观察器已启动~", observer);

        // 以上面的配置开始观察目标节点
        observer.observe(targetNode, config);


    }

    function addBtn() {
        //创建脚本控制按钮
        //只插入一次控制按钮
        if (document.querySelector('#myBtn'))
            return;

        let myBtn = document.createElement('input');
        myBtn.type = 'button';
        myBtn.id = 'myBtn';
        myBtn.value = '开始';
        myBtn.style = 'height: 40px;margin-top: 16.5%;margin-left: 1%;color: white;';
        myBtn.className = 'el-button el-button--success';
        if (!document.querySelector('.el-input__inner')) {//保证界面元素加载完毕，防止脚本运行出错
            setTimeout(addBtn, itime / 10);
            return;
        }
        addUpdata();//添加更新按钮
        ipt = document.querySelector('.el-input__inner');
        //console.log(document.querySelector('.person-info'));
        document.querySelector('.person-info').appendChild(myBtn);
        myBtn.addEventListener('click', btnClick);
        function btnClick() {
            //初始为：start，点击后脚本运行，此时状态为stop；再次点击后标本停止，此时状态为start
            console.log('状态:', this.value);
            if (this.value === '开始') {
                start(this);
            } else {
                stop(this);
            }
            //日志
            if ('停止' == document.querySelector('#myBtn').value){
                IntervalId = setInterval(function () {
                    loadingMsg = showMsg(loadingMsg);
                }, itime);
            }

        }


    }
    function addUpdata() {//脚本更新按钮
        let myUpdata = document.createElement('input');
        myUpdata.type = 'button';
        myUpdata.id = 'myUpdata';
        myUpdata.title = updataStr;
        myUpdata.value = '更新';
        myUpdata.style = 'height: 40px;margin-top: 16.5%;margin-left: 1%;color: white;';
        myUpdata.className = 'el-button el-button--success';
        document.querySelector('.person-info').appendChild(myUpdata);
        myUpdata.addEventListener('click', function () {
            let updataUrl = 'https://greasyfork.org/zh-CN/scripts/479946-%E6%8A%A2%E5%8F%B7';
            window.open(updataUrl, '_blank');
        });
    }
    function start(e) {
        //开始相关
        e.value = '停止';
        e.className = 'el-button el-button--danger';
        console.log(`状态修改为${e.value}`);
        main();
    }
    function stop(e) {
        //结束相关
        e.value = '开始';
        e.className = 'el-button el-button--success';
        console.log(`状态修改为${e.value}`);
        clearInterval(IntervalId);
        ipt.value = '';
        //observer.disconnect();   //v0.4后观察器需要一直运行不清除
        //console.log("观察器已清除");
    }
    function showMsg(str, title) {
        //闪烁显示日志，将传入的字符串第一位，移动到最后一位。主逻辑中，使用循环调用达到目的
        if (str) {
            let strArray = str.slice(1);
            //console.log(strArray);
            ipt.value = strArray;
            return strArray + str.slice(0, 1);
        }
    }
    //2024年5月22日16:23:04 v0.4*********************************
    function addCount() {//插入显示总数元素
        if (document.querySelector('#count-span')) {
            document.querySelector('#count-span').remove();
        }
        let parent = document.querySelector('.queue-content');
        let cls = parent.attributes[0].name;
        //属性名称 "data-v-564a8916"
        let count = document.createElement('span');
        count.id = 'count-span';
        count.style = 'cursor:pointer;';
        count.setAttribute(cls, '');
        count.textContent = `总数:0`;
        count.addEventListener('click', function(){
            getAllCount();
        })
        parent.append(count);

        //设置窗口数量及关闭情况
        let winno = document.querySelectorAll('.field-info')[0];
        winno.style = 'cursor:pointer';
        winno.title = '点击设置今日窗口数量，当前窗口数：'+winNum;
        winno.addEventListener('click',function(){//设置今日窗口数量
            let uinput = prompt(`请输入今日窗口数，0<x<=10`,"").trim();
            let judgeFn = new RegExp(/\s+/g);
            if (judgeFn.test(uinput)) {
                alert("内容包含有空格!");
                return;
            }
            if(!uinput){
                console.log('空');
                return
            }
            if(0>=uinput||uinput>10) {
                console.log('请输入1-10的数字');
                return;
            }
            if(!Number.isInteger(Number(uinput))){
                console.log('请输入数字');
                return;
            }
            winNum = Number(uinput);
            console.log('今日开放窗口数量：',uinput);
            let winno = document.querySelectorAll('.field-info')[0];
            winno.title = '点击设置今日窗口数量，当前窗口数：'+uinput;
            saveData(uinput);
            getAllCount();//刷新总数
            alert('设置成功！今日开放窗口数：'+uinput+'\n ');

        });
        let winClose = document.querySelectorAll('.field')[0];
        winClose.style = 'cursor:pointer';
        winClose.title = '点击设置要关闭的窗口，输入【重置】可重置';
        winClose.addEventListener('click',function(){
            //设置关闭的窗口
            let uinput = prompt(`请输入需要关闭的窗口，每次输入一个，如A03`,"").trim();
            let workArry = getArray();
            let judgeFn = new RegExp(/\s+/g);
            if (judgeFn.test(uinput)) {
                alert("内容包含有空格!");
                return;
            }
            if(!uinput){
                console.log('空');
                return
            }
            if('重置'==uinput){
                sessionStorage.removeItem('workArry');//删
                getArray();//重新初始化
                getAllCount();//刷新
                return;
            }
            for(let i=0;i<workArry.length;i++){
                if(workArry[i]==uinput){
                    workArry[i]+=' 窗口关闭';
                    saveArray(workArry);//保存
                    getAllCount();//刷新
                    alert(uinput+'窗口关闭');
                    break;
                }
            }
        });

    }

    function getAllCount() {
        //获取业务总数
        let myWinNo = document.querySelectorAll('.field-info')[0].textContent;
        fetch("http://10.176.1.49/api/A01/call/busi/win/list", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9",
                "authorization": "Basic ZGdvdjpkZ292X3NlY3JldA==",
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
                "dgov-auth": "Bearer eyJ0eXAiOiJKc29uV2ViVG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ1c2VyX2lkIjoiMDU1QTlERDc4ODk2NDY1RkJFQzIwNTAwOTJFMzRBMjkiLCJyb2xlX2lkIjoiUVVFVUVfQ0FMTCIsInVzZXJfbmFtZSI6IueOi-Wuh-a0iyIsInVzZXJfYWNjb3VudCI6ImhkcXNwal93YW5neXV5YW5nIiwidXNlcl9yZWdpb25fY29kZSI6IjM3MTMxMjAwMDAwMCIsImNsaWVudF9pZCI6ImRnb3YiLCJleHAiOjE3MTY0MDQ0MDAsIm5iZiI6MTcxNjMzNzg5N30.ZVjBkBuM-faPn8qgm0NHHjS5APGVdGGkv9UvlKByaSA"
            },
            "referrer": "http://10.176.1.49/call/",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": `hallCode=HDZWFWZX&winNo=${document.querySelectorAll('.field-info')[0].textContent}`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(response=>{
            // 检查响应状态码是否为 200-299 之间的值
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // 如果响应是 JSON，则使用 .json() 方法解析它
            return response.json();
        }
               ).then(data=>{
            // 这里是解析后的 JSON 数据
            console.log(data);
            let datas = data.rows;

            //1、统计各个窗口的业务量，并排名        使用reduce方法统计winNo的出现次数
            const winNoCounts = datas.reduce((acc,item)=>{
                // 如果acc（累积器）中还没有这个winNo，则添加它并设置计数为1
                // 否则，增加当前winNo的计数
                acc[item.winNo] = (acc[item.winNo] || 0) + 1;
                return acc;
            } , {});
            // 初始累积器是一个空对象

            //console.log('统计', winNoCounts);

            // 使用Object.entries()转换为数组，然后排序
            let sortedEntries = Object.entries(winNoCounts).sort((a,b)=>b[1] - a[1]);
            //console.log('排序', sortedEntries);
            let titleStr='';
            for(let i=0;i<sortedEntries.length;i++){

                if(myWinNo == sortedEntries[i].toString().split(',')[0]){
                    titleStr += `${i+1}:  ${sortedEntries[i]} ★ \n`;
                    ranking = i;//我的排名
                }else{
                    if('undefined' !=sortedEntries[i].toString().split(',')[0]){
                        //sortedEntries[i].toString().split(',')[0] = '未叫号';
                        titleStr += `${i+1}:  ${sortedEntries[i]}\n`;
                    }
                }

            }
            console.log('titleStr****',titleStr);
            // 数组排名****v0.9根据叫号排名中的窗口数sortedEntries.length，设置当天开放窗口数winNum，计算平均数
            saveData(sortedEntries.length);
            // 按值降序排序
            //数组转会对象   顺序会乱
            document.querySelector('.queue-content').children[2].title = titleStr;

            ///2、统计总数并判断是否达到平均数
            console.log('总数：', data.records);
            let ele = document.querySelector('#count-span');
            if (ele) {
                ele.textContent = `总数:${data.records}`;
                setTimeout(function(){
                    let myNum = document.querySelector('.queue-content').children[2].textContent.split('：')[1];
                    let eleNum = ele.textContent.split(':')[1];
                    winNum = getData();
                    console.log('winNum:',winNum);
                    if(myNum*winNum<eleNum){
                        console.log('叫号不到平均');
                        ele.style = 'color:red;cursor: pointer;';
                    }else{
                        console.log('达标');
                        ele.style = 'color:#006ce1;cursor: pointer;';
                    }
                    ele.title = `今日窗口数:${winNum},平均叫号数:${(eleNum/(winNum)).toFixed(2)},我的排名${ranking+1}`;
                },1000);


            }
            //3、统计窗口闲忙情况 status:正在处理/处理完毕  btime:呼叫时间 ctime:取号时间 etime:完成时间 queueNum

            const winArry = ['A03','A04','A05','A06','A07','A08','A09','A10','A11','A12'];
            //let workArry = ['A03','A04','A05','A06','A07','A08','A09','A10','A11','A12'];
            let workArry = getArray();
            //console.log(workArry);
            for(let i=0;i<datas.length;i++){
                if('正在处理'==datas[i].status){
                    //console.log(datas[i]);
                    for(let j=0;j<winArry.length;j++){
                        if(winArry[j]==datas[i].winNo){
                            workArry[j]=datas[i].winNo + ' 正在服务 '+datas[i].queueNum+'号';
                            //break;
                        }else if(j==winArry.length){
                            workArry[j] = datas[i];
                        }

                    }
                }
            }
            let workStr = '';

            for(let i=0;i<workArry.length;i++){
                //console.log('ppp',workArry[i].split(' ')[0]);
                let winCount = document.querySelectorAll('.field-info')[0].textContent;
                let list = workArry[i].split(' ');
                if(list[0]==winCount){
                    //console.log('111',i,datas[i].winNo,winCount,(datas[i].winNo==winCount?'★':''));

                    if(list.length>1){
                        workStr += `${list[0]} ★ ${list[1]}${list[2]}\n`;
                    }else{
                        workStr += `${list[0]} ★ \n`;
                    }
                }else{
                    workStr += `${workArry[i]}\n`;
                }

            }
            //console.log(workArry);
            document.querySelector('.queue-content').children[3].title = workStr;

        }
                     ).catch(error=>{
            // 捕获并处理错误

            console.error('There has been a problem with your fetch operation:', error);
        }
                            );

    }


    function serviceButtonStyle() {//暂停服务功能样式
        let serviceButtonList = document.getElementsByClassName('el-button');
        let serviceButton;
        for (let i = 0; i < serviceButtonList.length; i++) {
            if ('暂停服务' == serviceButtonList[i].textContent||'恢复服务' == serviceButtonList[i].textContent) {
                serviceButton = serviceButtonList[i];
                break;
            }
        }

        let dialog = document.querySelector('#myDialog');
        let modalBackdrop = document.querySelector('#modalBackdrop');
        // 用来存储<dialog>元素

        var dialogContainer = document.querySelector('body');
        serviceButton.addEventListener('click', function() {
            // 检查是否已经创建了<dialog>元素
            if (dialog) {
                //return;
                dialog.remove();

            }
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            modalBackdrop = document.createElement('div');
            modalBackdrop.id = 'modalBackdrop';
            modalBackdrop.style = `
    position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85); /* 遮罩层颜色设置为半透明的黑色 */
  z-index: 999; /* 确保遮罩层在对话框之上，但低于对话框内容 */
  display: flex;
  align-items: center;
  justify-content: center; /* 可以用来垂直和水平居中对话框 */
  `;
            dialogContainer.appendChild(modalBackdrop);
            dialog = document.createElement('dialog');
            dialog.id = 'myDialog';
            dialog.style = `
    border: none;
    margin-left:45%;
    padding: 2px;
    //background-color: rgba(0, 0, 0, 0.5); /* 遮罩层颜色设置为半透明的黑色 */
    //pointer-events: none;  `;
            // 为<dialog>设置一个ID以便后续引用
            // 添加一些内容到<dialog>中（可选）
            var dialogContent = document.createElement('button');
            dialogContent.textContent = '点击恢复服务';
            //dialogContent.style = `background:red;color:white;`;
            dialogContent.className = 'el-button el-button--danger';
            dialogContent.addEventListener('click', function() {
                serviceButton.click();
                dialog.close();
                modalBackdrop.style.display = 'none';
                // 当对话框关闭时，隐藏遮罩层
                //modalBackdrop.remove();
            });
            dialog.appendChild(dialogContent);
            // 将<dialog>添加到容器中
            modalBackdrop.appendChild(dialog);
            // 显示<dialog>（这里使用showModal()方法而不是直接设置open属性）
            if (!dialog.open) {
                //dialog.showModal();
                dialog.showModal();
            }

        });

    }





    //***********************存储
    function saveData(params) {
        if(!params){return;}
        sessionStorage.setItem('myData',params);
        console.log('存储:',params);
    }
    function getData() {
        let data = sessionStorage.getItem('myData');
        if(!data){
            //初始化
            sessionStorage.setItem('myData',1);
        }
        console.log('读取：',data);
        return data;
    }

    function saveArray(params) {
        if(!params){return;}
        sessionStorage.setItem('workArry',params);
        console.log('存:',params);
    }
    function getArray(){
        let arr = sessionStorage.getItem('workArry');
        if(!arr){
            //初始化
            let workArry = ['A03','A04','A05','A06','A07','A08','A09','A10','A11','A12'];
            sessionStorage.setItem('workArry',workArry);
            arr = workArry;
        }
        console.log('读',arr);
        if(typeof arr == 'string'){
            arr = arr.split(',');
        }
        return arr;
    }
    //**********************



    //********************权限控制begin*************************
    //逻辑：点击员工名字转码成对应utf-8，添加入数组中即可使用
    //权限控制应该在addBtn执行之前完成
    function authorityControl() {

        let employeeName = document.querySelectorAll('.field-info')[1];

        if (!employeeName) {//保证界面元素加载完毕，防止脚本运行出错
            setTimeout(function () {

                authorityControl();
                //*********调用各个功能函数***************//

                serviceButtonStyle();//暂停服务功能样式改变
                isQueueNum();//v0.4后监视器默认运行
                winNum = getData();//初始化窗口数
                getArray();//初始化窗口情况数组
                addCount();//计数总数
                getAllCount();//刷新总数
                let menu = document.querySelector('.operation-content');
                menu.addEventListener('click',function(){
                    getAllCount();//刷新总数
                });

                //****************调用各个功能函数end*******************//
            }, itime / 10);
            return;
        }
        //对比
        employeeName.style = 'cursor: pointer;';
        employeeName.title = '加密解密';

        document.querySelector('.queue-content').children[2].style = 'cursor: pointer;';
        document.querySelector('.queue-content').children[3].style = 'cursor: pointer;';
        //console.log(JSON.parse(localStorage.getItem("dgov-queue-call-userInfo")).content.userName);
        if (findEmployee(JSON.parse(localStorage.getItem("dgov-queue-call-userInfo")).content.userName)) {//根据系统存储的localStorage获取用户信息，界面元素无法获取
            console.log("有权限");
        } else {
            console.log('无权限');
            return;
        }
        addBtn();//无权限的无法抢号



        employeeName.addEventListener('click', function () {//加密，输出框为空时，默认转码当前用户，否则转码输出框用户
            console.log(this.textContent);
            ipt = document.querySelector('.el-input__inner');//初始化ipt
            //console.log(ipt.value);
            if (!ipt.value) {
                console.log(`转换当前用户【${this.textContent}】为【${unescape(encodeURIComponent(this.textContent))}】`);
                ipt.value = unescape(encodeURIComponent(this.textContent));//加密

            } else {
                console.log(`转换当前用户【${ipt.value}】为【${unescape(encodeURIComponent(ipt.value))}】`);
                ipt.value = unescape(encodeURIComponent(ipt.value));//加密

            }

            //ipt.value = unescape(decodeURIComponent(escape('çå®æ´')));//解密
        });
        let windowNumber = document.querySelectorAll('.field-info')[0];
        windowNumber.addEventListener('click', function () {//解密。输出框不为空时，解密输出框的内容

            ipt = document.querySelector('.el-input__inner');//初始化ipt
            console.log(ipt.value);
            if (!ipt.value) {

            } else {

                ipt.value = unescape(decodeURIComponent(escape(ipt.value)));//解密
                console.log('解密');
            }

            //ipt.value = unescape(decodeURIComponent(escape('çå®æ´')));//解密
        });


    }
    function findEmployee(empName) {//根据传入的姓名判断是否权限在权限列表中，返回false,true
        for (let i = 0; i < employeeArray.length - 1; i++) {
            //console.log('列表',employeeArray[i],'转码',unescape(encodeURIComponent(empName)));
            if (employeeArray[i] === unescape(encodeURIComponent(empName))) {
                return true;
            }
        }
        return false;
    }




    //*****************权限控制end*****************
})();