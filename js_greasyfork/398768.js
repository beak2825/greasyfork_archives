// ==UserScript==
// @name         河洛论坛自动矿场
// @namespace    https://greasyfork.org/users/433510
// @version      0.5.0
// @description  限定河洛论坛专用，每日自动签到，自动领取红包任务，自动领取宝箱钥匙，自动收矿
// @author       lingyer
// @match        https://www.horou.com/home.php?mod=task*
// @match        https://www.horou.com/plugin.php?id=zgxsh_chest:index
// @match        https://www.horou.com/kuang.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398768/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%9F%BF%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398768/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%9F%BF%E5%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pages = [ //有效的分区列表，每条信息的格式为“匹配字符串，网页类型，网页url”
        ["mod=task&item=new", 21, "https://www.horou.com/home.php?mod=task&item=new"], //类型21 新任务页面
        ["mod=task&item=done", 23, "https://www.horou.com/home.php?mod=task&item=done"], //类型23 已完成的任务页面
        ["mod=task&do=view", 24, "https://www.horou.com/home.php?mod=task&&do=view&id=*"], //类型24 任务查看页面

        ["kuang.php", 31, "https://www.horou.com/kuang.php"], //类型31 河洛矿场页面

        ["zgxsh_chest", 41, "https://www.horou.com/plugin.php?id=zgxsh_chest:index"], //类型41 河洛宝箱页面

    ];

    var jump_url; //跳转的目标链接
    var page_now; //当前所处的页面索引

    var mine_fields; //矿场列表
    var time_now = new Date();
    var time_last = new Date();
    var time_diff;

    var element_tmp;
    var elements_array;

    var i, j; //临时变量

    //自动每日签到，签到后开始今天的任务序列
    element_tmp = document.getElementById("fx_checkin_b");
    //console.log("获取自动签到按钮：" + element_tmp);
    if (element_tmp.alt.indexOf("已") == -1) {
        //console.log('自动签到触发');
        element_tmp.click();
        //跳转到新任务页面
        geturl(21);
        setTimeout(jumpto, 5000);
        return;
    }

    //获取当前页面代码
    for (page_now = 0; page_now < pages.length; page_now++) {
        if (isURL(pages[page_now][0])) {
            break;
        }
    }
    //console.log("page_now:" + page_now);
    //console.log(pages[page_now]);
    if (page_now >= pages.length) {
        //当前页面不在触发范围内，什么都不做，直接退出
        //console.log("当前页面不在触发范围内，什么都不做");
        return;
    }

    //console.log("根据当前页面对应的类型代码，采取对应处理方法");
    switch (pages[page_now][1]) { //根据当前页面对应的类型代码，采取对应处理方法
        case 21: //当前页面在新任务页面，21类
            //console.log("当前页面在新任务页面，自动领取可用任务");
            //自动领取任务
            elements_array = document.getElementsByClassName("bbda ptm pbm");
            //console.log(elements_array);
            for (i = 0; i < elements_array.length; i++) {
                console.log(elements_array[i].parentNode.innerHTML);
                console.log(elements_array[i].parentNode.innerHTML.indexOf("无法申请此任务"));
                if (elements_array[i].parentNode.innerHTML.indexOf("无法申请此任务") == -1) { //当前任务可用
                    //console.log(missions[i].parentNode.childNodes[7].childNodes[1]);
                    elements_array[i].parentNode.childNodes[7].childNodes[1].click(); //点击接受可用任务
                    return;
                }
            }

            //无可领取的任务，跳转到河洛宝箱页面
            geturl(41);
            setTimeout(jumpto, 5000);
            return;
            break;

        case 23: //当前页面在已完成的任务页面
            //console.log("当前页面在已完成的任务页面，跳转到新任务页面");
            //跳转到新任务页面，检查是否还有可领取的任务
            geturl(21);
            setTimeout(jumpto, 5000);
            return;
            break;

        case 24: //成功接受任务，当前页面在任务查看页面
            //console.log("当前页面在任务查看页面");
            //跳转到新任务页面，检查是否还有可领取的任务
            geturl(21);
            setTimeout(jumpto, 5000);
            return;
            break;

        case 31: //当前页面在河洛矿场，31类
            //console.log("当前页面在河洛矿场页面，自动收矿");
            mine_fields = document.getElementsByClassName("box");
            //console.log(mine_fields);
            time_diff = 0;
            for (i=0;i<mine_fields.length;i++) {
                //console.log(mine_fields[i]);
                if (Number(mine_fields[i].childNodes[5].childNodes[1].innerHTML) > 0) { //该矿场可以领取
                    //console.log(mine_fields[i].childNodes[7].innerHTML);
                    time_last.setMonth(Number(mine_fields[i].childNodes[7].innerHTML.substring(7,9))-1);
                    time_last.setDate(Number(mine_fields[i].childNodes[7].innerHTML.substring(10,12)));
                    time_last.setHours(Number(mine_fields[i].childNodes[7].innerHTML.substring(13,15)));
                    time_last.setMinutes(Number(mine_fields[i].childNodes[7].innerHTML.substring(16,18)));
                    console.log("time_now: " + time_now);
                    console.log("time_last: " + time_last);
                    time_diff = (time_now - time_last) / 60000;
                    console.log("time_diff: " + time_diff);
                    break;
                }
            }

            if (time_diff > 3600) { //距离上次领取超过60h，可以领取收益
                //console.log("距离上次领取超过10h，可以领取收益");
                if (time_diff > 4320) { //时间超过72h，立即收矿
                    time_diff = 1;
                } else {
                    time_diff = (time_diff % 120);
                }
                if (time_diff <= 5) {
                    //console.log("收益刷新5min内，领取矿场收益");
                    mine_fields[i].childNodes[5].childNodes[3].click(); //点击领取矿场收益
                    //跳转到新任务页面
                    geturl(21);
                    setTimeout(jumpto, 5000);
                } else {
                    //延迟到收益刷新1min后刷新页面
                    time_diff = 121 - time_diff;
                    //console.log("延迟" + time_diff + "分钟后刷新页面");
                    setTimeout(delayreload, time_diff * 60000); //延迟到收益刷新1min后刷新页面
                }
            }
            return;
            break;

        case 41: //当前页面在河洛宝箱页面
            //console.log("当前页面在河洛宝箱页面，点击签到领取铜钥匙，之后跳转到河洛矿场页面");
            element_tmp = document.getElementsByClassName("Sign")[0];
            console.log("获取自动签到按钮：");
            console.log(element_tmp);
            if (element_tmp != null) element_tmp.click();

            //跳转到河洛矿场页面
            geturl(31);
            setTimeout(jumpto, 5000);
            return;
            break;

    }



    //sub_function area 以下为子函数定义区域
    function delayreload() {
        window.location.reload();
    }

    function jumpto() {
        window.location.assign(jump_url);
    }

    //设置指定类型页面
    function geturl(x) {
        for (i = 0; i < pages.length; i++) {
            if (pages[i][1] == x) {
                jump_url = pages[i][2];
                return;
            }
        }
    }

    //判断当前URL是否包含x
    function isURL(x) {
	    //console.log(window.location.href);
        return window.location.href.indexOf(x) != -1;
    }

})();