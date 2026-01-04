// ==UserScript==
// @name         河洛农场自动收菜
// @namespace    https://greasyfork.org/users/433510
// @version      0.2.4
// @description  限定河洛论坛专用，最简化的农场脚本，需配合定时器使用，自动种菜、收菜、卖菜
// @author       lingyer
// @match        https://www.horou.com/plugin.php?id=jnfarm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411195/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E6%94%B6%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/411195/%E6%B2%B3%E6%B4%9B%E5%86%9C%E5%9C%BA%E8%87%AA%E5%8A%A8%E6%94%B6%E8%8F%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const seedinfo = [ ["name", "jsid", "prod", "level"], // 种子信息列表，格式为：作物名称、种子购买jsid、作物卖出prod、购买等级
                       ["小麦", 1, 1, 1], //1.小麦
                       ["胡萝卜", 2, 2, 3], //2.胡萝卜
                       ["玉米", 5, 3, 5], //3.玉米
                       ["土豆", 6, 5, 10], //4.土豆
                       ["花生", 19, 0, 15], //5.花生
                       ["番茄", 7, 5, 20], //6.番茄
                       ["棉花", 20, 0, 25], //7.棉花

                       ["豌豆", 0, 0, 30], //8.豌豆
                       ["葡萄", 0, 0, 35], //9.葡萄
                       ["辣椒", 0, 0, 40], //10.辣椒
                       ["卷心菜", 0, 0, 45], //11.卷心菜
                       ["南瓜", 0, 0, 50], //12.南瓜
                       ["灯笼椒", 0, 0, 55], //13.灯笼椒
                       ["草莓", 0, 0, 60], //14.草莓
                       ["黄瓜", 0, 0, 65], //15.黄瓜
                       ["甘蔗", 0, 0, 70], //16.甘蔗
                       ["芦荟", 0, 0, 75], //17.芦荟
                       ["番薯", 0, 0, 80], //18.番薯
                       ["洋葱", 0, 0, 85], //19.洋葱
                       ["咖啡", 0, 0, 90], //20.咖啡
                       ["玫瑰", 0, 0, 93], //21.玫瑰
                       ["向日葵", 0, 0, 96], //22.向日葵
                       ["风信子", 0, 0, 99], //23.风信子
                     ];

    var level;
    var seedid = 0; //当前种植的作物，设置为0则自动选择可种植的最高级种子
    var max_farms; //当前田地数

    var formhash;

    var farmid;
    var stat;
    var timenow = new Date();
    var current_farm;
    var usercash,buynum,userhp,speedup;
    var httpRequest = new XMLHttpRequest();
    var tmp_str,tmp_ary,tmp_id,tmp_element;

    //设置seedid为可种植的最高级种子
    if (seedid == 0) {
        //获取当前级别
        tmp_str = document.getElementById("thistop").innerHTML;
        //console.log(tmp_str);
        tmp_ary = tmp_str.match(/\d+(?= <div style="display: inline-block; width: 70px; margin-left: 0.5em;">)/g);
        //console.log(tmp_ary);
        level = parseInt(tmp_ary[0]);
        //console.log("level : " + level);
        while ((seedid < (seedinfo.length - 1)) && (level >= seedinfo[seedid + 1][3])) {
            seedid++;
        }
    }
    //console.log("seedid : " + seedid);

    //获取formhash
    tmp_str = document.getElementById("jnland").innerHTML;
    //console.log(tmp_str);
    tmp_ary = tmp_str.match(/(?<=formhash=)[0123456789abcdef]{8}/g);
    //console.log(tmp_ary);
    formhash = tmp_ary[0];
    //console.log("formhash:" + formhash);

    //获取当前田地数
    tmp_ary = tmp_str.match(/(?<=id="ok)\d+/g);
    //console.log(tmp_ary);
    max_farms = tmp_ary.length - 1;
    //console.log("当前田地数：" + max_farms);

    //初始化
    stat = 1;
    farmid = 1;

    //开始
    setTimeout(step, 2000);

    //第一步：建立所需的对象
    //var httpRequest = new XMLHttpRequest();
    //第二步：打开连接  将请求参数写在url中  true:请求为异步  false:同步
    //httpRequest.open('GET', './plugin.php?id=jnfarm&do=harvest&jfid=4&formhash=c855597c', true);
    //第三步：发送请求  将请求参数写在URL中
    //httpRequest.send();

    //sub_function area 以下为子函数定义区域

    function step() {
        //获取当前时间
        tmp_str = document.getElementById("txt").innerHTML;
        //console.log(tmp_str);
        tmp_ary = tmp_str.match(/\d+/g);
        timenow = new Date(tmp_ary[0],tmp_ary[1]-1,tmp_ary[2],tmp_ary[3],tmp_ary[4],tmp_ary[5]);
        //console.log("timenow:" + timenow);

        switch (stat) { //根据当前任务状态，采取对应处理方法
            case 1: //尝试收菜
                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=harvest&jfid=" + farmid + "&formhash=" + formhash + "&timestamp=" + Math.floor(timenow.getTime()/1000), true);
                console.log("收获 jfid:" + farmid + " timestamp:" + Math.floor(timenow.getTime()/1000));
                farmid++;
                break;
            case 2: //尝试种菜
                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=plantseed&seed=" + seedinfo[seedid][1] + "&jfid=" + farmid + "&formhash=" + formhash + "&timestamp=" + Math.floor(timenow.getTime()/1000), true);
                console.log("种植 jfid:" + farmid + " seed:" + seedinfo[seedid][0] + " timestamp:" + Math.floor(timenow.getTime()/1000));
                farmid++;
                break;
            case 3: //尝试卖菜
                httpRequest.open("GET", "./plugin.php?id=jnfarm&do=store&submit=true&timestamp=" + Math.floor(timenow.getTime()/1000) + "&formhash=" + formhash + "&storesubmit=yes&prod[" + seedinfo[seedid][2] + "]=1&prodqty[" + seedinfo[seedid][2] + "]=10", true);
                console.log("尝试卖出10个[" + seedinfo[seedid][0] + "] timestamp:" + Math.floor(timenow.getTime()/1000));
                farmid = max_farms + 1;
                break;

        }
        httpRequest.send();
        if (farmid <= max_farms) {
            setTimeout(step, 2000);
        } else if (stat < 3) {
            stat++;
            farmid = 1;
            setTimeout(step, 2000);
        }
    }

})();