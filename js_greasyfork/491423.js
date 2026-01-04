// ==UserScript==
// @name         南da抢馆
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @description  一键抢南da体育馆
// @author       G
// @match        https://ggtypt.nju.edu.cn/venue/venue-reservation/*
// @require      https://update.greasyfork.org/scripts/422854/Bubble%20Message.user.js
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/491423/%E5%8D%97da%E6%8A%A2%E9%A6%86.user.js
// @updateURL https://update.greasyfork.org/scripts/491423/%E5%8D%97da%E6%8A%A2%E9%A6%86.meta.js
// ==/UserScript==
// 通过reservation-submit判断是否是手机

(function() {
    //'use strict';

    function getOffset(){
        const base64Image1 = document.querySelector("div.verify-sub-block > img").src;
        const image1 = new Image();
        image1.src = base64Image1;

        // 加载第二张图片
        const image2 = new Image();
        const base64Image2 = document.querySelector("div.verify-img-out > div > img").src;

        image2.src = base64Image2;


        // 创建一个用于存储像素值为0的位置的数组
        const zeroPixels = [];

        const canvas1 = document.createElement('canvas');
        const context1 = canvas1.getContext('2d');
        canvas1.width = image1.width;
        canvas1.height = image1.height;
        context1.drawImage(image1, 0, 0);

        // 找到图1中像素值为0的位置
        for (let y = 0; y < canvas1.height; y++) {
            for (let x = 0; x < canvas1.width; x++) {
                const pixelData = context1.getImageData(x, y, 1, 1).data;
                if (pixelData[0] + pixelData[1] + pixelData[2] === 765) {
                    zeroPixels.push({ x, y });
                    //console.log(x, y);
                }
            }
        }
        //console.log('zeroPixels.length = ', zeroPixels.length)

        const canvas2 = document.createElement('canvas');
        const context2 = canvas2.getContext('2d');
        canvas2.width = image2.width;
        canvas2.height = image2.height;
        context2.drawImage(image2, 0, 0);

        // 计算唯一偏移量 offset
        let uniqueOffset = 2;
        let foundUniqueOffset = false;

        // 判断是否所有新位置像素点都为0
        while (!foundUniqueOffset && uniqueOffset <= canvas2.width) {
            let allPixelsZero = 0;

            for (const pixel of zeroPixels) {
                const pixelData = context2.getImageData(pixel.x + uniqueOffset, pixel.y, 1, 1).data;
                if (pixelData[0] + pixelData[1] + pixelData[2] === 765) {
                    allPixelsZero++;
                }
            }

            if (2 * allPixelsZero > zeroPixels.length) {
                foundUniqueOffset = true;
            }
            uniqueOffset += 1
        }

        if (foundUniqueOffset) {
            console.log('唯一偏移量:', uniqueOffset * 330 / 310);
        } else {
            console.log('无法找到满足条件的唯一偏移量');
        }
        return uniqueOffset;
    };
    function moveBlock(){
        //获取滑块偏移量
        const uniqueOffset = getOffset();
        // 获取滑块相关元素
        const moveBlock = document.querySelector('.verify-move-block');
        const sliderBar = document.querySelector('.verify-left-bar');
        const targetOffset = uniqueOffset * 330 / 310; // 目标偏移量
        var tryBlockTime = 0; //验证码尝试次数


        // 模拟拖动滑块到目标偏移量的函数
        let currentOffset = 0;
        const speed = 5; // 移动速度
        let blockLeft = moveBlock.getBoundingClientRect().left; //获取滑块位置

        var downObj = document.createEvent('MouseEvents');
        downObj.initMouseEvent('mousedown', true, true,document.defaultView,0,526,496,blockLeft);
        document.querySelector('.verify-move-block').dispatchEvent(downObj);

        setTimeout(function() {
            var movObj = document.createEvent('MouseEvents');
            movObj.initMouseEvent('mousemove', true, true,document.defaultView,0,526,496,blockLeft+targetOffset-2);
            document.querySelector('.verify-move-block').dispatchEvent(movObj);

            var evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent('mouseup', true, true);
            document.querySelector('.verify-move-block').dispatchEvent(evObj);

        }, window.runTime > 2600 ? 0 : 2600 - window.runTime);

    };
    function turnPage(changedTime) {
        let curTimes = $('thead.mobileStyle')[0].innerText.replace("\n\n", "");; //当前的列
        let separator = "\n\t\n";  // 分隔符

        // 将字符串分割成列表
        let timelist = curTimes.split(separator).filter(item => item !== "");

        // 查找元素 x 是否在列表中，返回下标
        window.index = timelist.indexOf(changedTime);

        if (window.index !== -1) {
            //console.log(`${changedTime} 在列表中的下标是：${index}`);
            return window.index;
        } else {
            console.log(`${changedTime} 不在列表中`);
            if(changedTime>timelist[timelist.length -1]){
                console.log('下一页');
                if($('span.pull-right')[0]){
                    $('span.pull-right')[0].click();
                    console.log(`break`);
                    return turnPage(changedTime);

                }else{
                    alert('当前场次不存在，请重新选择');
                    document.getElementById("options").selectedIndex = 0;
                }
            }else if(changedTime<timelist[0]){
                console.log('上一页');
                if($('span.pull-left')[0]){
                    $('span.pull-left')[0].click();
                    setTimeout(() => {turnPage(changedTime);}, 100);
                }else{
                    alert('当前场次不存在，请重新选择');
                    document.getElementById("options").selectedIndex = 0;
                }
            }else{
                console.log('见鬼了?');
            }
        }
    }
    function executeAfterCountdown(curTimeOption) {
        // 在这里添加倒计时结束后要执行的操作
        var checkTime = 1; //表单检查次数
        window.runTime = 0; //全局变量：运行时间

        window.intervalId_t = setInterval(() => { //开始计时
            window.runTime += 100;
            //console.log('当前时间为：'+window.runTime+'ms');
        }, 100);
        $('.ivu-icon-md-refresh').click(); //刷新表单
        //console.log($('.ivu-icon-md-refresh'));
        console.log('刷新点击');

        var interval = setInterval(function() {
            //判断表单是否加载完成
            console.log('表单加载中');
            if ($('tr').length > 5) {
                //如果场地数多于2（有3行是列名），则执行
                console.log('表单已加载');
                clearInterval(interval); // 停止表单定时器

                var curOption = document.getElementById("options").selectedOptions[0].innerText;
                if(curOption!='---未选择---'){
                    //curTimeOption = turnPage(curOption);
                    var interval_page = setInterval(function() {
                        //console.log(`${changedTime} 在列表中的下标是：${index}`);
                        //--------------------------------
                        let curTimes = $('thead.mobileStyle')[0].innerText.replace("\n\n", "");; //当前的列
                        let separator = "\n\t\n";  // 分隔符

                        // 将字符串分割成列表
                        let timelist = curTimes.split(separator).filter(item => item !== "");

                        // 查找元素 x 是否在列表中，返回下标
                        curTimeOption = timelist.indexOf(curOption);
                        if(curTimeOption !== -1){
                            clearInterval(interval_page);
                            //等待场地定位
                            var rowIndex = parseInt($("#row_input").val(), 10); // 获取输入框的值并转换为整数
                            rowIndex = isNaN(rowIndex) ? 1 : rowIndex; // 确保值是一个数字，如果不是数字则设为 1

                            var columnIndex = curTimeOption;
                            //var columnIndex = parseInt($("#column_input").val(), 10);
                            //columnIndex = isNaN(columnIndex) ? 0 : columnIndex; // 确保值是一个数字，如果不是数字则设为 0
                            columnIndex++;
                            //获取预约须知同意框
                            const element = document.querySelector(".ivu-checkbox-input");
                            //获取场地元素
                            var e = document.querySelector(`#scrollTable > div > table > tbody > tr:nth-child(${rowIndex}) > td:nth-child(${columnIndex}) > div`);
                            //console.log(e);
                            e.click(); //选择场地
                            //e.style.display = "none";
                            element.click(); //同意须知

                            setTimeout(() => {
                                $('button.ivu-btn.ivu-btn-primary.ivu-btn-large').click(); //本场还剩下xx分钟，您确定预定该场地？
                            }, 300);

                            var interval2 = setInterval(function() {

                                if ($('.reservationStep1 .ivu-checkbox-checked').length==0){ //检查须知有没有点上
                                    $('.reservationStep1 .ivu-checkbox-input').click();
                                }
                                if ($('.freeBorder.selectedBorder').length==1){ //场地已选择上
                                    var b = $('.reservationStep1 .payHandleItem ')[1];//我要预约
                                    //console.log(b);
                                    b.click();
                                    clearInterval(interval2); // 停止定时器

                                    var intervalP2 = setInterval(function() {
                                        var hiddenElements = $('.reservation-step-two[style="display: none;"]');
                                        // 使用 if 条件语句判断 hiddenElements 是否包含任何元素
                                        if (hiddenElements.length == 0) { //已进入页面2
                                            clearInterval(intervalP2); // 停止定时器

                                            $(".ivu-checkbox-input")[0].click(); //确定同伴
                                            setTimeout(() => {
                                                var c = $('.reservation-step-two .payHandleItem ')[1]; //提交订单
                                                c.click();
                                                //验证码滑动
                                                var interval3 = setInterval(function() {
                                                    //判断验证码是否加载完成
                                                    if($('.verify-img-panel img')[0]!=null && $('.verify-img-panel img')[0].src){
                                                        clearInterval(interval3);

                                                        if ($('button.ivu-btn.ivu-btn-primary.ivu-btn-large')[1]!=null&&$('div.ivu-modal-confirm-body')[0].innerText!='验证码次数超出限制，请稍后再操作！'){ //点掉奇怪的弹窗

                                                            console.log($('div.ivu-modal-confirm-body')[0].innerText);
                                                            $('button.ivu-btn.ivu-btn-primary.ivu-btn-large').click();
                                                        }
                                                        moveBlock();

                                                    };
                                                }, 500);// 验证码延迟时间
                                            }, 100);//点击伙伴延迟时间
                                        }
                                    }, 100);
                                }

                            }, 300);
                        }
                        else{
                            console.log(`${curOption} 不在列表中`);
                            if(curOption>timelist[timelist.length -1]){
                                console.log('下一页');
                                //console.log(timelist[timelist.length -1]);
                                if($('span.pull-right')[0]){
                                    $('span.pull-right')[0].click();
                                    //curTimeOption = timelist.indexOf(curOption);
                                }else{
                                    alert('当前场次不存在，请重新选择');
                                    document.getElementById("options").selectedIndex = 0;
                                    clearInterval(interval_page);
                                }
                            }else if(curOption<timelist[0]){
                                console.log('上一页');
                                if($('span.pull-left')[0]){
                                    $('span.pull-left')[0].click();
                                    //setTimeout(() => {turnPage(curOption);}, 100);
                                }else{
                                    alert('当前场次不存在，请重新选择');
                                    document.getElementById("options").selectedIndex = 0;
                                    clearInterval(interval_page);
                                }
                            }else{
                                console.log('见鬼了?');
                                clearInterval(interval_page);
                            }
                        }
                    }, 150);
                    //--------------------------------
                    //console.log(columnIndex);

                }else{
                    alert('当前未选择时间！');
                }
                document.getElementById("options").addEventListener('change', (event) => {
                    //console.log(event.target.selectedOptions[0].innerText); // 弹出用户选择的选项
                    var curOption = event.target.selectedOptions[0].innerText
                    if(curOption!='---未选择---'){
                        curTimeOption = turnPage(curOption);
                        //console.log(columnIndex);
                    }
                });



            }
            else{
                checkTime += 1;
                if (checkTime % 50 == 0){ // 每12个interval刷新表单，防止服务器时间慢
                    $('.ivu-icon-md-refresh').click(); //刷新表单
                    console.log('对时刷新');
                }
                if (checkTime > 100){ // 每70个interval刷新表单，防止服务器时间慢
                    clearInterval(interval);
                    alert('刷新超时');
                }
            }
        }, 50); // 每隔0.05秒检查一次长度是否满足条件



    }

    function updateCountdown(targetTime,columnIndex) {
        var now = new Date();
        var timeDifference = targetTime - now;

        // 如果时间差大于0，即还没到目标时间
        if (timeDifference > 0) {
            var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

            // 格式化时间
            var timeStr = hours + "小时 " + minutes + "分钟 " + seconds + "秒";

            // 显示倒计时
            document.getElementById("countdown").innerHTML = "距离设定时间还有：" + timeStr;

            // 每秒更新一次倒计时
            window.timer = setTimeout(updateCountdown, 500,targetTime);
        } else {
            // 倒计时结束后执行操作
            document.getElementById("countdown").innerHTML = "开始抢场";

            if ($('.reservation-submit')[0]){
                console.log('现在是手机端');
                executeAfterCountdown_phone();
            }else{
                console.log('现在是电脑端');
                executeAfterCountdown(columnIndex);
            }
        }
    }

    $(document).ready(function() {
        $(window).on("load",function(){
            //setTimeout(() => {
            console.log("成功加载插件");
            var $start_btn = $('<button id="start_btn">开始抢场</button>');
            var $end_btn = $('<button id="end_btn">停止抢场</button>');
            var $notice = $(
                `<div id="notice" class="notice"><h3>使用步骤</h3><p>1. 填写信息 2. 点击开始抢场 3. 倒计时结束后开始抢场</p>
                <p>4. 可点击停止抢场来终止倒计时 5. 需手动点击支付</p></div>`
  );
            var $rc_input = $(
                '<div class="input_wrapper_phone" id="rc_input_wrapper" >请输入场地号：<input id="row_input" type="number" value="1" min="1" max="20">开抢时间：<input id="time_input" type="time" value="08:00"></div>'
            );
            var $input_wrapper_box = $('<div class="input_wrapper_box"></div>');
            var $control_container_box = $(".siteDetailContent");
            var $countdown = $(
                '<div id="countdown_wrapper"><p id="countdown">00:00:00</p></div>'
            );

            var $in = $(`
            <form action="">
                <label for="options">选择一个时间段：</label>
                <select id="options">
                    <option value="default">---未选择---</option>
                    <option value="option12">12:00-13:00</option>
                    <option value="option14">14:00-15:00</option>
                    <option value="option15">15:00-16:00</option>
                    <option value="option16">16:00-17:00</option>
                    <option value="option17">17:00-18:00</option>
                    <option value="option18">18:00-19:00</option>
                    <option value="option19">19:00-20:00</option>
                    <option value="option20">20:00-21:00</option>
                    <option value="option21">21:00-22:00</option>
                    <option value="option22">22:00-23:00</option>
                </select>
            </form>`);


            $input_wrapper_box.append($rc_input);
            //$input_wrapper_box.append($column_input);
            $control_container_box.append($input_wrapper_box);
            $control_container_box.append($in);
            $control_container_box.append($countdown);
            //$control_container_box.append($countdown);
            $control_container_box.append($start_btn);
            $control_container_box.append($end_btn);

            $control_container_box.append($notice);

            var columnIndex;


            //updateCountdown(targetTime);


            $("#start_btn").click(function () {
                if(document.getElementById("options").selectedIndex!=0){
                    // 获取输入框中的时间值
                    var timeValue = $("#time_input").val(); // 假设你的输入框有 id 为 "time_input"

                    // 将时间值解析为时和分
                    var timeParts = timeValue.split(":");
                    var hours = parseInt(timeParts[0], 10);
                    var minutes = parseInt(timeParts[1], 10);

                    // 创建新的目标时间并设置小时和分钟
                    var targetTime = new Date();
                    targetTime.setHours(hours, minutes, 0, 0);
                    //console.log(hours);
                    updateCountdown(targetTime,columnIndex);
                }else{alert('未选择时间段！');}

            });
            $("#end_btn").click(function () {
                clearTimeout(window.timer);
                document.getElementById("countdown").innerHTML = "结束抢场";
                if ($('.reservationStep1 .ivu-checkbox-checked').length==1){ //检查须知有没有点上
                    $('.reservationStep1 .ivu-checkbox-input').click();
                }
            });
            //}, 5000);
        });

    });
})();