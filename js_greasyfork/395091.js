// ==UserScript==
// @name         河洛论坛自动回复
// @namespace    https://greasyfork.org/users/433510
// @version      0.3.0
// @description  限定河洛论坛专用，每日自动签到，自动领取回帖任务，在茶馆自动回复，自动收矿
// @author       lingyer
// @match        https://horou.com/*
// @match        https://www.horou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395091/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395091/%E6%B2%B3%E6%B4%9B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pages = [ //可以刷帖的分区列表，每条信息的格式为“匹配字符串，网页url”
        ["forum-9-1", "https://horou.com/forum-9-1.html"], //0 河洛茶馆
        ["forum.php?mod=forumdisplay&fid=9", "https://horou.com/forum.php?mod=forumdisplay&fid=9"], //1 河洛茶馆

        ["thread", "https://horou.com/thread-*-1-1.html", "https://horou.com/forum.php?mod=viewthread&tid=*"], //2 帖子内容

        ["mod=task&item=new", "https://horou.com/home.php?mod=task&item=new"], //3 新任务页面
        ["mod=task&item=doing", "https://horou.com/home.php?mod=task&item=doing"], //4 进行中的任务页面
        ["mod=task&item=done", "https://horou.com/home.php?mod=task&item=done"], //5 完成的任务页面
        ["mod=task&do=view", "https://horou.com/home.php?mod=task&&do=view&id=*"], //6 任务查看页面

        ["kuang.php", "https://horou.com/kuang.php"] //7 采矿页面

    ];

    const delay_unit = 10 //时间更新间隔（sec），标题栏上倒数时间的更新间隔
    const delay_repo = 6; //回帖绝对延迟，不能小于3，delay_repo * delay_unit不小于论坛允许的回帖间隔时间
    const delay_rand = 12; //回帖随机延迟，实际回帖间隔(sec)为(绝对延迟+random(随机延迟))*delay_unit

    const post_max = 400; //回帖计数器上限，当日回帖计数到达上限则停止自动回帖

    var username; //登录帐户名
    var btn_sign; //登陆按钮
    var post_count; //当日回帖计数
    var thread_id; //自动回帖时的thread id
    var title, time; //自动回帖时的标题显示和时间计数

    var missions; //任务列表

    var mine_fields; //矿场列表

    var messages; //主帖内容文本
    var separator; //主帖内容文本中首个分隔符位置
    var repo_texts; //回帖数组
    var repo_count; //连续回帖计数器，
    var repo_index; //回帖指针

    var page_now; //当前所处的页面代码
    var i, j; //临时变量

    //获取登录帐户名，用于判断最后回复id，防止连续回帖
    username = document.getElementsByClassName("vwmy qq")[0].innerHTML;
    username = username.replace(/<\/?.+?>/g,"");
    console.log("当前用户：" + username);

    post_count = localStorage.getItem(username + "_post_count"); //从本地取出当日帖数
    console.log("当日目前已回帖数: " + post_count);

    //自动每日签到
    btn_sign = document.getElementById("fx_checkin_b");
    console.log("获取自动签到按钮：" + btn_sign);
    if (btn_sign.alt.indexOf("已") == -1) {
        console.log('自动签到触发');
        btn_sign.click();
        //自动签到触发说明是新的一天，当日帖数计数器清零
        post_count = 0;
        localStorage.setItem(username + "_post_count", post_count);
        setTimeout(function () { window.location.assign(pages[7][1]); }, 2000); //跳转到矿场页面，自动回帖启动
        return;
    } else if (post_count > post_max) { //当日发帖量超过预设上限，自动回帖停止，直接退出
        console.log('当前发帖数：' + post_count + "，自动回帖停止");
        return;
    } else {

        //获取当前页面代码
        for (page_now = 0; page_now < pages.length; page_now++) {
            if (isURL(pages[page_now][0])) {
                //console.log(pages[page_now][1]);
                break;
            }
        }
        console.log("page_now:" + page_now);

        switch (page_now) { //根据页面代码判断当前页面，采取对应处理方法
            case 0: //当前页面在河洛茶馆
            case 1: //当前页面在河洛茶馆
                console.log("当前页面在河洛茶馆");

                //console.log('选个帖子点进去');
                var sublinks = document.getElementsByClassName("s xst"); //读取帖子列表
                var efflinks = []; //清空有效帖子列表
                var link_go;

                for (i = 0;i < sublinks.length;i++) { //提取有效的帖子链接
                    if (sublinks[i].parentNode.parentNode.parentNode.id.indexOf("normal") != -1) { //排除置顶帖
                        //console.log(sublinks.item(i).parentNode.className);
                        if (sublinks[i].parentNode.className.indexOf("lock") == -1){ //排除已锁帖
                            if (sublinks[i].parentNode.parentNode.getElementsByClassName("by")[1].children[0].innerHTML.indexOf(username) == -1) { //排除最后回复是自己的帖子
                                //console.log(sublinks.item(i).href);
                                //将有效的帖子链接加入有效链接数组
                                efflinks.push(sublinks.item(i).href);
                            }
                        }
                    }
                }

                link_go = efflinks[Math.floor(Math.random() * efflinks.length)];//随便选个有效的帖子
                console.log(link_go);
                thread_id = link_go.match(/\d+/)[0];
                console.log(thread_id);
                localStorage.setItem(username + "_thread_id", thread_id);//保存帖子id

                setTimeout(function () { window.location.assign(link_go); }, 2000); //跳转到选中的帖子
                return;
                break;
            case 2: //当前页面在帖子内容
                console.log("当前页面在帖子内容");

                thread_id = localStorage.getItem(username + "_thread_id"); //从本地取出期望的页面id
                console.log("应该自动回帖的页面id: " + thread_id);

                if (thread_id == window.location.href.match(/\d+/)[0]) {
                    console.log("页面id匹配");

                    //截取主帖内容加入回帖数组
                    messages = document.getElementsByClassName("t_f").item(0).innerHTML; //获取主帖内容
                    //console.log(messages);
                    messages = messages.replace(/<\/?.+?>/g,""); //去除HTML
                    //console.log("去除HTML后：" + messages);
                    messages = messages.replace(/[，。？！　\n]+/g,"。"); //所有分隔标点、换行和中文空格替换为句号
                    //console.log("所有分隔标点、换行和中文空格替换为句号：" + messages);
                    repo_texts = ["说的有道理","我就是这样看的","这样没毛病","谢谢楼主分享","默默注水中","进来看看哈"]; //回帖数组赋初值,防止开空窗
                    while (messages.length > 0) {
                        separator = messages.indexOf("。");
                        if (separator == 0) { //文本开头就是"。"，删除该"。"
                            messages = messages.substring(1);
                        } else if (separator == -1) { //文本里不含分隔符了，整句加入回帖数组并退出循环
                            repo_texts.push(messages);
                            break;
                        } else { //将文本中的第一句加入回帖数组，之后删除文本中的第一句
                            if (separator > 10) {
                                repo_texts.push(messages.substring(0,separator)); //将文本中的第一句加入回帖数组
                                //console.log("newrepos: " + repo_texts[repo_texts.length-1]);
                                if (repo_texts.length > 30) { //回帖数组容量足够，退出循环
                                    break;
                                }
                            }
                            messages = messages.substring(separator + 1); //删除文本中的第一句
                            //console.log("aftercut: " + messages);
                        }
                    }
                    console.log(repo_texts);
                    repo_count = 0; //回帖计数器清零
                    repo_index = Math.floor(Math.random() * repo_texts.length) - 2;
                    if (repo_index < 0) { repo_index = 0; }
                    title = document.title;
                    time = delay_repo + Math.floor(Math.random() * delay_rand);
                    loop(); //启动倒数
                }
                return;
                break;
            case 3: //当前页面在新任务页面
                console.log("当前页面在新任务页面");

                missions = document.getElementsByClassName("bbda ptm pbm");
                console.log(missions);
                for (i = 0; i < missions.length; i++) {
                    if (missions[i].getElementsByClassName("xg2")[1].innerHTML.indexOf("每天回帖量达到") != -1) {
                        console.log(missions[i].parentNode.childNodes[7].childNodes[1]);
                        missions[i].parentNode.childNodes[7].childNodes[1].click(); //点击接受回帖任务
                        return;
                    } else if (missions[i].getElementsByClassName("xg2")[1].innerHTML.indexOf("帮助喜欢潜水的河洛众升级") != -1) {
                        console.log(missions[i].parentNode.childNodes[7].childNodes[1]);
                        missions[i].parentNode.childNodes[7].childNodes[1].click(); //点击接受潜水任务
                        return;
                    }
                }

                setTimeout(function () { window.location.assign(pages[1][1]); }, 2000); // 无可用的新任务，跳转到河洛茶馆页面
                return;
                break;
            case 4: //当前页面在进行中的任务页面
                console.log("当前页面在进行中的任务页面");

                missions = document.getElementsByClassName("bbda ptm pbm");
                console.log(missions);
                for (i = 0;i < missions.length; i++) {
                    console.log(missions[i].parentNode.childNodes[7].childNodes[1].childNodes[0].childNodes[0].src);
                    if (missions[i].parentNode.childNodes[7].childNodes[1].childNodes[0].childNodes[0].src.indexOf("rewardless") != -1) {
                        console.log("任务" + i + "未完成");
                    } else {
                        console.log("任务" + i + "完成，可以领奖");
                        missions[i].parentNode.childNodes[7].childNodes[1].childNodes[0].click(); //点击领奖
                        return;
                    }
                }

                setTimeout(function () { window.location.assign(pages[7][1]); }, 2000); //任务均未完成或无未完成的任务，跳转到河洛矿场页面
                return;
                break;
            case 5: //当前页面在已完成的任务页面
                console.log("当前页面在已完成的任务页面");

                setTimeout(function () { window.location.assign(pages[7][1]); }, 2000); // 跳转到河洛矿场页面
                return;
                break;
            case 6: //成功接受任务，当前页面在任务查看页面
                console.log("当前页面在任务查看页面");

                setTimeout(function () { window.location.assign(pages[3][1]); }, 2000); //跳转到新任务页面，继续接任务
                return;
                break;
            case 7: //当前页面在河洛矿场页面
                console.log("当前页面在河洛矿场页面");

                mine_fields = document.getElementsByClassName("box");
                console.log(mine_fields);
                for (i=0;i<mine_fields.length;i++) {
                    console.log(mine_fields[i].childNodes[5]);
                    if (Number(mine_fields[i].childNodes[5].childNodes[1].innerHTML) > 0) { //该矿场可以领取
                        mine_fields[i].childNodes[5].childNodes[3].click(); //点击领取矿场收益
                        return;
                    }
                }

                setTimeout(function () { window.location.assign(pages[3][1]); }, 2000); //没有可领取的矿场，跳转到新任务页面
                return;
                break;
        }
    }

    //判断当前URL是否包含x
    function isURL(x) {
	    //console.log(window.location.href);
        return window.location.href.indexOf(x) != -1;
    }

    // 循环时间
    function loop() {
        document.title = "[" + time * delay_unit + "] [" + repo_count + "] " + title; //更新title中显示的倒数时间
        switch (time) {
            case 2: //快速回帖
                var text_fastpost, btn_fastpost;
                text_fastpost = document.getElementById("fastpostmessage");
                text_fastpost.value = repo_texts[repo_index + repo_count]; //填入回帖内容
                btn_fastpost = document.getElementById("fastpostsubmit");
                btn_fastpost.click(); //点击回帖按钮
                repo_count++;
                console.log(repo_count + "/3");
                //当日帖数计数器+1
                post_count++;
                console.log("post_count: " + post_count);
                break;
            case 0:
                if (repo_count === 3) { //三联回帖完成
                    localStorage.setItem(username + "_post_count", post_count); //将当日帖数存入本地
                    console.log("post_count save: " + post_count);
                    if ((post_count % 10) == 0) { //当日回帖数为10的整倍数，跳转到进行中的任务页面
                        setTimeout(function () { window.location.assign(pages[4][1]); }, 2000);
                    } else { //正常跳转，跳转回河洛茶馆
                        setTimeout(function () { window.location.assign(pages[1][1]); }, 2000);
                    }
                    return;
                } else {
                    time = delay_repo; //重置计时器
                }
                break;
        }

        time--;
        setTimeout(loop, delay_unit*1000); //每delay_unit秒loop一次
    }

})();