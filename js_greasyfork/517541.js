// ==UserScript==
// @name         B站動態導航 (歸檔員自用)
// @namespace    http://yuhang0000.github.io/
// @version      v1.10_2025-5-5
// @description  能導航到指定日期的動態，僅對 https://space.bilibili.com/<你UID>/dynamic/ 作用，僅歸檔員自用。
// @author       欲行肆灵
// @match        https://space.bilibili.com/*
// @grant        none
// @license      GPLv3
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAACnklEQVRYR+2XX0hTURzHv9edXVuNNaFhm+CLiBXh8qXaUGRBD+YCX8oSwerm34cG+RKxMGlILxMEwYxuTVCazxV7S8Q0eskUscboIWOzWpDWck5n9rDuzXO3dbu4raA+cGHn+/ve8/vew93ZGfBXolIRNPd40P/kAzrcXmi0OqlFFo1Whw63F/2TYTT3eKBSEaklPZV1TRia3xQv58ikohAarQ7OkUlqjsq6JqkNAFKnystTUePSCis6B31wt9YgGvlM1aRotDp0DvpQWmGl9DQrwEgFAABRs7jiGUuaJDA9BXfbCUS/LFO6QLrmgekp3DxnQ3x9jdKRLgDw68lShVDq/8HPAETNwlbfBkvtWRSVHsSOndotvu2zuhJBMDCHp4/uY2z0lrAaiQAFhUW4PPAQxfsOUTdli4VXL9Dbbsen90EGRM2ia/RZzpoLLPhn0F1/hMB2ujXnzQGguMwM26kWAou9gSrMTvjAOzkshRcpfbvoDUZwLh7lVTWiZrE3MOBnYiBqVhQd1aaMNxfQG4zoGw+J4/hajFDNAWStOZA8N2HzU+5OuUQ+QHlVDTgXDwDgnRxmJ3wSB41CP4Oh+U1KaTpA74594yHoDUYAiSV0VJuouhQ5v6Sf/AoIk0k/p0OhXz5AlpEPsBReFJ9k+eM7STUZhX75AHevXQTn4vFtYwP3ulqk5SQU+uVfwkyj+CXMMv8DEMTX16jfA73BmLRnZ4rde/ZS49WVCMGb+ecoMR8VxQs37oB3cr/zFVJEQWERznffprRgYI7B8cZLaLzaRxVyxXCPgwFh8xNHsjKztJ5V3vpncb3+8B86lPpn0NtWmziUChA1i2Nn2mE92QhTyX7ka3ZtuWX7xKJfEXr9ElMPhvHYO5DqT8q/yXdT6gC1Lkc+ZAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/517541/B%E7%AB%99%E5%8B%95%E6%85%8B%E5%B0%8E%E8%88%AA%20%28%E6%AD%B8%E6%AA%94%E5%93%A1%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517541/B%E7%AB%99%E5%8B%95%E6%85%8B%E5%B0%8E%E8%88%AA%20%28%E6%AD%B8%E6%AA%94%E5%93%A1%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.areufind = 2333;
    window.areuskip = false;
    window.color_red = "color: #a5361c";
    window.color_blue = "color: #0f5290";
    window.color_lightblue = "color: #2c87b2";

    //这是延时
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //时间戳转换
    function timestamp(itemtime,now){
        if(itemtime.indexOf("刚刚") != -1){
            itemtime = now.valueOf()
        }
        else if(itemtime.indexOf("秒") != -1){
            itemtime = now.valueOf() - (itemtime.substring(0,itemtime.indexOf("秒")) * 1000);
        }
        else if(itemtime.indexOf("分钟") != -1){
            itemtime = now.valueOf() - (itemtime.substring(0,itemtime.indexOf("分钟")) * 60 * 1000);
        }
        else if(itemtime.indexOf("小时") != -1){
            itemtime = now.valueOf() - (itemtime.substring(0,itemtime.indexOf("小时")) * 60 * 60 * 1000);
        }
        else if(itemtime.indexOf("天") != -1){
            if(itemtime.indexOf("昨天") != -1){
                itemtime = now.valueOf() - now.getHours() * 60 * 60 * 1000;
            }
            else if(itemtime.indexOf("前天") != -1){
                itemtime = now.valueOf() - (now.getHours() * 60 * 60 * 1000) + 86400000;
            }
            else{
                itemtime = now.valueOf() - (now.getHours() * 60 * 60 * 1000) + itemtime.substring(0,itemtime.indexOf("天")) * 86400000;
            }
        }
        else{
            itemtime = itemtime.replace(/\//g, "-");
            itemtime = itemtime.replace(/年/g, "-");
            itemtime = itemtime.replace(/月/g, "-");
            //itemtime = itemtime.replace(/日/g, "");
            if(itemtime.indexOf("日") != -1){
                itemtime = itemtime.substring(0,itemtime.indexOf("日"))
            }
            if((itemtime.split("-").length - 1) == 1){
                itemtime = now.getFullYear() + "-" +itemtime;
            }
            let temptime = new Date(itemtime);
            itemtime = temptime.valueOf();
        }
        return itemtime;
    }

    //找出荧幕目前所在的动态
    function finditem(item_num,two,now = null){
        try{
            let items = document.querySelector('.bili-dyn-list__items');
            let item = items.querySelectorAll('.bili-dyn-list__item');
            for(let btn of item){
                item_num = item_num + 1;
                //console.log(item_num + ": " +btn.getBoundingClientRect().top);
                if(btn.getBoundingClientRect().top > 0){
                    if(item_num >= 1){
                        item_num = item_num - 1;
                    }
                    //let itemtime = btn.querySelector('.bili-rich-text__content');
                    //itemtime = itemtime.innerText;
                    //console.log("> " + itemtime + " <");
                    break;
                }
            }
            if(two == 2){
                console.log("%c从 " + (item_num + 1) + " 项开始遍历",window.color_blue);
            }
            else{
                console.log("%c截止到 " + (item_num + 1) + " 项结束",window.color_blue);

                //转化时间戳
                item = items.children[item_num];
                //item.scrollIntoView();
                //window.scrollTo(0, window.scrollY - 70);
                let itemtime = item.querySelector('.bili-dyn-time');
                itemtime = itemtime.innerText;
                item_num = timestamp(itemtime,now);
            }
            //window.areufind = true;
            return item_num;
        }
        catch (err){
            console.log("%c###### 先别急, 页面尚未加载完 ######",window.color_red);
            //console.log(err);
            window.areufind = true;
            return null;
        }
    }

    //实际运行的地方
    async function run(time,now,two = false,ddd){

        let item_num = -1;
        let item_number = 0;

        //妈的，再嵌套一个函数 - 遍历动态主函数
        async function checkitem(item,item_num){
            //如果存在
            item.scrollIntoView();
            window.scrollTo(0, window.scrollY - 70);
            item_number = item_number + 1;

            //等待图片加载
            let itemimg = item.querySelectorAll('picture.b-img__inner');
            if(itemimg != undefined){
                for(let num of itemimg){
                    //console.log("1 " + itemimg);
                    let img1 = num.lastChild;
                    //console.log("2 " + itemimg);
                    let areuokimg = -1;
                    if(img1.src.indexOf("none") != -1){
                        console.log("# 跳过: " + img1.src);
                        continue;
                    }
                    else{
                        //img1.onerror = function() { areuokimg = false; };
                    }
                    while(img1.naturalWidth === 0 && window.areuskip != true){
                        //忘记在这里写强制暂停了
                        if(window.areufind == true){
                            return;
                        }
                        if(img1.complete == true){
                            console.log("%c# 图片加载失败: " + img1.src ,window.color_red);
                            //areuokimg = -1;
                            img1.src = img1.src;
                        }
                        else{
                            console.log("# 等待图片加载: " + img1.src);
                        }
                        await delay(1000);
                    }
                    if(window.areuskip == true){
                        window.areuskip = false;
                        console.log("# 跳过: " + img1.src);
                        continue;
                    }
                }
            }

            item_num = item_num + 1;
            return item_num;
        }

        async function checknewitem(two){
            //检查是否到达世界的尽头
            let no_more = document.querySelector('.bili-dyn-list-no-more');
            let itemss = document.querySelector('.bili-dyn-list__items');
            let loadmore_button = document.querySelector('.bili-dyn-list__loadmore');
            //console.log(no_more);
            //console.log(itemss.length);
            if (no_more != undefined && itemss.length == undefined && two != 2) {
                console.log("%c# 你已经到达世界的尽头 #",window.color_red);
                console.log("%c完成!!!",window.color_blue);
                window.areufind = true;
            }
            else if (no_more != undefined && two == 2) {
                console.log("%c# 你已经到达世界的尽头 #",window.color_red);
                console.log("%c完成!!!",window.color_blue);
                window.areufind = true;
            }
            else if(window.areufind != true){
                //console.log("# 错误: \n" + err);
                console.log("%c# 遇到了一些错误, 尝试重试 #",window.color_red);
                if(loadmore_button != null){ //檢查 "加载更多" 按鈕是否存在
                    loadmore_button.click();
                }
                await delay(1000);
                window.scrollTo(0, 0);
                window.scrollTo(0, document.documentElement.scrollHeight);
            }
        }

        //首先判断当前DOM所在位置
        if(two == 2){
            item_num = finditem(item_num,two);
            if(item_num == null){
                return;
            }
        }

        //主循环
        while(window.areufind != true){
            try{
                let items = document.querySelector('.bili-dyn-list__items');
                let item;
                if(two == true){
                    item = items.firstChild;
                }
                else if(two == false){
                    item = items.children[1];
                }
                //遍历操作在这里
                else if(two == 2){
                    item = items.children[item_num];
                    //console.log(item);
                    if(item == undefined && window.areufind != true){
                        while(item == undefined){
                            console.log("%c# 遇到了一些错误, 尝试重试 #",window.color_red);
                            window.scrollTo(0, 0);
                            window.scrollTo(0, document.documentElement.scrollHeight);
                            //window.scrollTo(0, document.documentElement.offsetHeight);
                            //检查是否到底
                            let no_more = document.querySelector(".bili-dyn-list-no-more");
                            if(no_more != undefined) {
                                window.areufind = true;
                                break;
                            }
                            else{
                                await delay(1000);
                                item = items.children[item_num];
                                //item_num = checkitem(item,item_num);
                            }
                        }
                        if(item != undefined){
                            item_num = await checkitem(item,item_num);
                        }
                    }
                    else{
                        item_num = await checkitem(item,item_num);
                    }
                    //window.areufind = true;
                    //return;
                }

                let itemtime;
                let itemtag;
                if(item != undefined){
                    itemtime = item.querySelector('.bili-dyn-time');
                    if(itemtime != null){ //正常获取动态上的时间
                        itemtime = itemtime.innerText;
                        itemtag = item.querySelector('.bili-dyn-tag__text');
                        //itemtag = itemtag.innerText;
                        console.log("> " + itemtime + " <");

                        //统统转成时间戳
                        itemtime = timestamp(itemtime,now);
                    }
                    else{ //如果遇到 '1条动态被折叠' 的话
                        itemtime = item.querySelector('.bili-dyn-item-fold__statement.fs-small');
                        console.log("%c> " + itemtime.innerText + " <",window.color_red);
                        itemtime = new Date();
                        itemtime = itemtime.valueOf();
                    }

                    console.log(itemtime);
                }

                if(item != undefined){
                    //好好好, 用 "#" 来标记个数是吧
                    if( String(time).indexOf("#") != -1){ 
                        if(item_number < time.replace("#","") /*懒了, 直接嵌入食用*/ ){
                            if(two != 2){
                                item.remove();
                                item_number = item_number + 1;
                            }
                        }
                        else if(itemtag != undefined){
                            if(two == true){
                                item.remove();
                                item_number = item_number + 1;
                            }
                        }
                        else{
                            item.scrollIntoView();
                            window.scrollTo(0, window.scrollY - 70);
                            console.log("%c完成!!!",window.color_blue);
                            window.areufind = true;
                        }
                    }
                    //其余的是指定时间来停止, 而不是指定个数.
                    else if(itemtime > time){ 
                        if(two != 2){
                            item.remove();
                            item_number = item_number + 1;
                        }
                    }
                    else if(itemtag != undefined){
                        if(two == true){
                            item.remove();
                            item_number = item_number + 1;
                        }
                    }
                    else{
                        item.scrollIntoView();
                        window.scrollTo(0, window.scrollY - 70);
                        console.log("%c完成!!!",window.color_blue);
                        window.areufind = true;
                    }
                }
                else{
                    await checknewitem(two);
                }
            }
            catch (err){
                console.log("%c# 错误: \n" + err.stack ,window.color_red);
                await checknewitem(two);
            }
            //areufind = true;

            await delay(ddd);

            //时间统计
            if(window.areufind == true){
                let nowtime = new Date();
                let spendtime = nowtime.valueOf() - now.valueOf();
                let hhh
                let mmm
                let sss
                if(spendtime >= 3600000){
                    hhh = spendtime / 1000 / 60 / 60;
                }
                else{
                    hhh = 0;
                }
                if(spendtime >= 60000){
                    mmm = (spendtime - Math.trunc(hhh) * 3600000) / 1000 / 60;
                }
                else{
                    mmm = 0;
                }
                sss = (spendtime - Math.trunc(hhh) * 3600000 - Math.trunc(mmm) * 60000) / 1000;
                console.log("%c###### 总计用时: " + Math.trunc(hhh) + "小时" + Math.trunc(mmm) + "分钟" + Math.trunc(sss) + "秒, 总计 " + item_number + " 项动态 ######",window.color_blue);
            }
        }

    };

    //接受参数
    window.bilidel = function(input,ddd = 1,two = false) {
        //console.log(window.areufind);
        let returns = "################################";
        //帮助
        if(input == "Help" || input == "help"){
            //console.log("帮助\n");
            //好麻烦
            let text = "%c#############################################################################################################\n";
            text = text + "#\t\t\t\t\t\t\t\t\t\t\t\t  介素幫助  \t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "#############################################################################################################\n";
            text = text + "# bbdel\(\"指定日期\"\,\"停頓時間, 單位ms\"\,\"操縱類型\"\)\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"list\"\)\t\t\t\t\t查詢當前動態的總數目\;\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"stop\"\)\t\t\t\t\t終止任務運行\;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"skip\"\)\t\t\t\t\t跳過失效圖像部分\;\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"help\"\)\t\t\t\t\t獲取幫助。\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "#===========================================================================================================#\n";
            text = text + "# 舉個栗子\:\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"2024-12-5\"\,\"1000\"\,\"2\"\)\t導航到 2024-12-5 的動態, 延時1000ms\;\t\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"#233\"\,\"1000\"\,\"2\"\)\t\t從當前頁面往下翻閲 233 條動態, 延時1000ms\;\t\t\t\t\t\t\t\t\t#\n";
            text = text + "# bbdel\(\"2024-12-5\"\)\t\t\t保留置頂, 清除至 2024-11-16 之間的動態 \(並不是真的把動態刪掉\)\;\t\t\t\t#\n";
            text = text + "# bbdel\(\"#233\"\,\"10\"\,\"2\"\)\t\t保留置頂, 延時10ms, 從上置下清除 233 條動態 \(並不是真的把動態刪掉\)\;\t\t\t#\n";
            text = text + "# bbdel\(\"1733392922\"\,\"100\"\,\"1\"\)\t不保留置頂, 延時100ms, 清除至 2024-12-5 之間的動態 \(並不是真的把動態刪掉\)\。\t#\n";
            text = text + "#############################################################################################################";
            console.log(text,window.color_lightblue);
            return undefined;
        }
        if(window.areufind == false){
            if(input == "stop" || input == "Stop"){
                window.areufind = true;
                console.log("%c# 终止任务 #",window.color_red);
            }
            else if(input == "skip" || input == "Skip"){
                window.areuskip = true;
                console.log("%c# 尝试跳过 #",window.color_red);
            }
            else{
                console.log("%c\(#`O′\) 上一次任务尚未完成欸!!!",window.color_red);
            }
            return "################################";
        }
        if(input == "stop" || input == "Stop" || input == "skip" || input == "Skip"){
            console.log("%c\(#`O′\) 参数错误欸。",window.color_red);
            console.log("%c键入 bbdel\(\"help\"\) 以尋求幫助。",window.color_blue);
        }
        else if(input == "List" || input == "list"){
            bblist();
            return undefined;
        }
        else{
            //console.log(input);

            let now = new Date();

            let Y;
            let M;
            let D;
            let time;

            //给了目标日期
            if(input == "" || input == undefined || input == null){
                if(two == 2){
                    input = "1970-1-1";
                }
            }
            if(input != null && (input.indexOf("#") != -1 || input.indexOf(".") != -1 || input.indexOf("p") != -1) ){ //这里输入的是指定获取个数, 而不是日期
                //time = -1;
                input = input.replace("#","");
                input = input.replace(".","");
                input = input.replace("p","");
                console.log("%c截止到第 " + input + " 项结束",window.color_blue);
                time = "#" + input;
            }
            //没有指定个数的话, 说明 input 内容是日期
            else{
                if(input != "" && input != undefined && input != null){
                    input = input.replace(/\//g, "-");
                    input = input.replace(/年/g, "-");
                    input = input.replace(/月/g, "-");
                    input = input.replace(/日/g, "");

                    if((input.split("-").length - 1) == 0){
                        if(input == "0"){
                            input = "1970-1-1";
                        }
                        else if(input.length > 4){
                            input = new Date(input * 1);
                            console.log(input);
                            input = input.getFullYear() + "-" + (input.getMonth() + 1) + "-" + input.getDate();
                        }
                        else if(input.length > 2){
                            input = input + "-1-1";
                        }
                        else{
                            input = now.getFullYear() + "-1-" + input;
                        }
                    }

                    Y = input.substring(0,input.indexOf("-"));
                    M = input.substring(input.indexOf("-") + 1);
                    if(M.indexOf("-") != -1){
                        M = M.substring(0,M.indexOf("-"));
                    }
                    if((input.split("-").length - 1) > 1){
                        D = input.substring((Y + "-" + M + "-").length);
                    }
                    else{
                        D = 1;
                    }

                    if((input.split("-").length - 1) > 2){
                        console.log("%c\(#`O′\) 你参数写错了欸。",window.color_red);
                        console.log("%c键入 bbdel\(\"help\"\) 以尋求幫助。",window.color_blue);
                        return "################################";
                    }
                    else if((input.split("-").length - 1) == 1){
                        if(Y.length > 2){
                            D = 1;
                        }
                        else{
                            D = M;
                            M = Y;
                            Y = now.getFullYear();
                        }
                    }
                }

                //没给具体日期
                else{
                    let item_time = finditem(-1,two,now);
                    item_time = new Date(item_time + 86400000);
                    Y = item_time.getFullYear();
                    M = item_time.getMonth() + 1;
                    D = item_time.getDate();
                }

                console.log("年: " + Y);
                console.log("月: " + M);
                console.log("日: " + D);

                time = new Date(Y + "-" + M + "-" + D);
                time = time.valueOf();

                console.log("当前时间戳: " + now.valueOf());
                console.log("目标时间戳: " + time);
            }

            //要不要把置顶给干了
            if(two == 2){
                //two = 2;
                console.log("准备开始遍历动态");
            }
            else{
                if(two == 1 && Number.isNaN(time) != true){
                    two = true;
                }
                else if(two == 0 && Number.isNaN(time) != true){
                    two = false;
                }
                else{
                    console.log("%c\(#`O′\) 你参数写错了欸。",window.color_red);
                    console.log("%c键入 bbdel\(\"help\"\) 以尋求幫助。",window.color_blue);
                    return "################################";
                }
                console.log("是否把置顶给干了: " + two);
                //防误操作，先询问
                //啊啊啊, 这里如果 Y, M, D 变量未赋值的话, 说明用户键入的是指定个数, 而不是时间.
                let questiontext = "需要删除 " + Y + "-" + M + "-" + D + " 之前的动态吗";
                if(Y == null){
                    questiontext = "需要删除前 " + input + " 条动态吗";
                }
                let areudel = prompt(questiontext + "?  (Y/N)", "N");
                if(areudel == "Y" || areudel == "y" || areudel == "yes" || areudel == "Yes" || areudel == 1 || areudel == true){
                    console.log("%c出发喽~~~",window.color_blue);
                }
                else{
                    console.log("%c# 任务取消 #",window.color_red);
                    return "################################";
                }
            }

            window.areufind = false;
            run(time,now,two,ddd); //入口在这 time:指定时间 now:当前时间 two:是删除还是遍历 ddd:延时
            if(window.areufind == false){
                returns = undefined;
            }
        }
        return returns;
    };

    window.Bilidel = window.bilidel
    window.bbdel = window.bilidel
    window.BBdel = window.bilidel

    //计数
    let bblist = function(){
        try{
            let items = document.querySelector('.bili-dyn-list__items');
            let item = items.querySelectorAll('.bili-dyn-list__item');
            let no_more = document.querySelector('.bili-dyn-list-no-more');
            if(item != undefined || item != null){
                let tip;
                if(no_more == undefined || no_more == null)
                {
                    tip = ", 尚未全部加载完成欸。"
                }
                else{
                    tip = ", 已全部加载完成。"
                }
                console.log("%c###### 总计 " + item.length + " 项动态" + tip + " ######",window.color_blue);
            }
            else{
                console.log("%c# 找不到任何动态欸 #",window.color_red);
            }
        }
        catch{
            console.log("%c# 找不到任何动态欸 #",window.color_red);
        }
        return undefined;
    }

})();