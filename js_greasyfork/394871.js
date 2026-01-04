// ==UserScript==
// @name         好书友论坛自动回复
// @namespace    https://greasyfork.org/users/433510
// @version      0.7.9
// @description  限定好书友论坛专用，每日自动签到，自动抽奖，自动领取在线奖励，在各区自动回复，在交流吧发帖，在线奖励全部领完则停止
// @author       lingyer
// @match        https://www.58shuyou.com/*
// @match        https://m.intaizhou.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394871/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/394871/%E5%A5%BD%E4%B9%A6%E5%8F%8B%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pages = [ //可以刷帖的分区列表，每条信息的格式为“匹配字符串，网页类型，网页url”
        ["forum-2-1.html", 11, "https://www.58shuyou.com/forum-2-1.html"], //同人小说分区帖子列表页，11类
        ["forum-72-1.html", 11, "https://www.58shuyou.com/forum-72-1.html"], //全本小说分区帖子列表页，11类
        ["forum-56-1.html", 11, "https://www.58shuyou.com/forum-56-1.html"], //常规小说分区帖子列表页，11类

        ["award.html", 21, "https://www.58shuyou.com/award.html"], //抽奖页，21类
        ["id=it618_award:ajax", 22, "https://www.58shuyou.com/plugin.php?id=it618_award:ajax*"], //打开错误的抽奖页，22类

        ["intaizhou", 31, "https://m.intaizhou.com/"], //广告页，31类

        ["forum-76-1.html", 41, "https://www.58shuyou.com/forum-76-1.html"], //交流吧分区帖子列表页，41类
        ["mod=post&action=newthread&fid=76", 42, "https://www.58shuyou.com/forum.php?mod=post&action=newthread&fid=76"], //交流吧发帖页，42类

        ["mod=viewthread", 51, "https://www.58shuyou.com/forum.php?mod=viewthread&tid=*"], //帖子内容页，51类
        ["thread-", 52, "https://www.58shuyou.com/thread-*-1-1.html"], //帖子内容页(静态)，52类
        ["undefined", 53, "https://www.58shuyou.com/undefined"], //undefined页面，53类
    ];

    const messages = [
            "[color=Red]楼主发贴辛苦了，谢谢楼主分享！[/color]我觉得[color=blue]好书友论坛[/color]是注册对了！",
            "楼主太厉害了！楼主，我觉得[color=blue]好书友[/color]真是个好地方！",
            "这个帖子不回对不起自己！我想我是一天也不能离开[color=blue]好书友[/color]。",
            "这东西我收了！谢谢楼主！[color=blue]好书友[/color]真好！",
            "我看不错噢 谢谢楼主！[color=blue]好书友[/color]越来越好！",
            "既然你诚信诚意的推荐了，那我就勉为其难的看看吧！[color=blue]好书友[/color]不走平凡路。",
            "其实我一直觉得楼主的品味不错！呵呵！[color=blue]好书友[/color]太棒了！",
            "感谢楼主的无私分享！要想[color=blue]好书友[/color]好 就靠你我他",
            "楼主，大恩不言谢了！[color=blue]好书友[/color]是最棒的！",
            "楼主，我太崇拜你了！我想我是一天也不能离开[color=blue]好书友[/color]。",
            "论坛不能没有像楼主这样的人才啊！我会一直支持[color=blue]好书友[/color]。"
    ];

    const subjects = [
            "百計疏慵一味閑",
            "杖藜無日不尋山",
            "着鞭每到羲皇上",
            "扶履欣同季孟間",
            "寸步思君勞遠夢",
            "七言驚我動衰顔",
            "定無戞玉醻人句",
            "拙速應勝隔歲還",
            "閬風當日奉清樽",
            "猶記銀鈎洒七言",
            "別去凄凉渾一夢",
            "只今疎懶且衡門"
    ];

    const countunit = 10; //时间更新间隔（sec），标题栏上倒数时间的更新间隔
    const delay_repo = 6; //回帖绝对延迟，不能小于3
    const delay_rand = 24; //回帖随机延迟，实际回帖间隔（sec）为（绝对延迟+random（随机延迟））*countunit

    var username; //登录帐户名
    var page_now; //当前所处的页面索引
    var url_go; //准备跳转的url
    var thread_id; //自动回帖时的thread id
    var title, time; //自动回帖时的标题显示和时间计数

    //公共变量
    var element_temp;
    var elements_ary;
    var i, j;

    //获取登录帐户名，用于判断最后回复id，防止连续回帖
    elements_ary = document.getElementsByClassName("vwmy");
    //console.log(elements_ary);
    if (elements_ary.length > 0) { //正确获取到用户名
        username = elements_ary[0].textContent;
    } else { //未正确获取用户名，可能是未登录，退出脚本
        console.log("未正确获取用户名，可能是未登录，退出脚本");
        return;
    }
    console.log("当前用户：" + username);

    //每日签到
    element_temp = document.getElementById("fx_checkin_b"); //获取每日签到按钮
    //console.log("获取每日签到按钮：");
    //console.log(element_temp);
	if (element_temp == null) { //未正确获取签到按钮，退出脚本
        console.log("未正确获取每日签到按钮！！！");
        return;
    }
    if (element_temp.alt.indexOf("已") == -1) {
        //console.log("自动签到触发");
        element_temp.click();
        //每日签到触发说明是新的一天，延迟跳转到抽奖页面开始抽奖
        seturl(21);
        setTimeout(jumpto_url, 2000);
        return;
    }

    //领取在线奖励，领完全部的在线奖励后，停止自动回帖
    element_temp = document.getElementById("online_link");
    //console.log("获取在线奖励链接：" + element_temp);
    if (element_temp.href.indexOf("plugin.php") != -1) {
            //console.log("在线奖励触发");
		    element_temp.click();
    } else { //判断是否已经领完全部的在线奖励
        element_temp = document.getElementById("online_time");
        //console.log("在线奖励文字：" + element_temp.textContent);
        if (element_temp.textContent == "今日奖励已领完") {
            //console.log("今日奖励已领完，自动回帖停止，退出脚本");
            return;
        }
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
        //当前页面不在自动回帖触发范围内，什么都不做，直接退出
        //console.log("当前页面不在自动回帖触发范围内，什么都不做");
        return;
    }

    //console.log("根据当前页面对应的类型代码，采取对应处理方法");
    switch (pages[page_now][1]) { //根据当前页面对应的类型代码，采取对应处理方法
        case 11: //当前页面在可刷帖分区的帖子列表页，11类
            //console.log("当前页面在可刷帖分区的帖子列表页，选个帖子点进去");
            elements_ary = document.getElementsByClassName("s xst"); //读取帖子列表
            //console.log(elements_ary);

            //选择首页最后一个帖子
            url_go = elements_ary[elements_ary.length - 1];
            //console.log("url_go:");
            //console.log(url_go);

            thread_id = url_go.href.match(/(?<=tid=)\d+/g);
            //console.log(thread_id);
            if (thread_id == null) {//未取到正确的thread_id，可能目标帖地址为静态页面地址
                thread_id = url_go.href.match(/(?<=thread-)\d+/g);
                //console.log(thread_id);
            }
            localStorage.setItem(username + "_thread_id", thread_id[0]);//保存帖子id
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;

        case 51: //当前页面在帖子内容页，51类
            //console.log("当前页面在帖子内容");

            thread_id = localStorage.getItem(username + "_thread_id"); //从本地取出期望的页面id
            //console.log("应该自动回帖的页面id: " + thread_id);

            if (thread_id == window.location.href.match(/(?<=tid=)\d+/g)[0]) {
                //console.log("页面id匹配");
                //console.log("当前页面在帖子内容页，且id匹配，延时回帖");
                title = document.title;
                time = delay_repo + Math.floor(Math.random() * delay_rand);
                loop_repo(); //启动延时倒数
            } else {
                console.log("当前页面在帖子内容页，但id不匹配，thread_id = " + thread_id);
            }
            return;
            break;

         case 52: //当前页面在帖子内容页（静态），52类
            //console.log("当前页面在帖子内容");

            thread_id = localStorage.getItem(username + "_thread_id"); //从本地取出期望的页面id
            //console.log("应该自动回帖的页面id: " + thread_id);

            if (thread_id == window.location.href.match(/(?<=thread-)\d+/g)[0]) {
                //console.log("页面id匹配");
                //console.log("当前页面在帖子内容页，且id匹配，延时回帖");
                title = document.title;
                time = delay_repo + Math.floor(Math.random() * delay_rand);
                loop_repo(); //启动延时倒数
            } else {
                element_temp = document.getElementById("pt");
                if (element_temp.textContent.indexOf("交流吧") > -1) {
                    //console.log("当前页面在交流吧帖子内容页，随机跳转到某个可刷帖分区页面");
                    seturl(11);
                    setTimeout(jumpto_url, 2000); //延迟跳转
                    return;
                };
                console.log("当前页面在帖子内容页，但id不匹配，thread_id = " + thread_id);
            }
            return;
            break;

       case 53: //当前页面在undefined页面，53类
            //console.log("当前在undefined页面，随机跳转到某个可刷帖分区页面");
            seturl(11);
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;

        case 21: //当前页面在抽奖页，21类
            //当前在抽奖页面，延迟20s检查是否可以抽奖
            //console.log("当前在抽奖页面");
            setTimeout(get_award, 20000);
            return;
            break;

        case 22: //当前页面在打开错误的抽奖页，22类
            //延迟跳转到抽奖页面
            seturl(21);
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;

        case 31: //当前页面在广告页面，31类
            //console.log("当前在广告页面，随机跳转到某个可刷帖分区页面");
            seturl(11);
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;

        case 41: //当前在交流吧分区帖子列表页，41类
            //console.log("当前在交流吧分区帖子列表页，延迟发帖");
            title = document.title;
            //console.log(title);
            time = delay_repo + Math.floor(Math.random() * delay_rand);
            //console.log(time);
            loop_post(); //启动延时倒数
            return;
            break;

        case 42: //当前在交流吧发帖页面，42类
            //console.log("当前在交流吧发帖页面，随机跳转到某个可刷帖分区页面");
            seturl(11);
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;

        case 43: //当前在交流吧发帖后的帖子列表页，43类
            //console.log("当前在交流吧发帖后的帖子列表页，随机跳转到某个可刷帖分区页面");
            seturl(11);
            setTimeout(jumpto_url, 2000); //延迟跳转
            return;
            break;
    }

    //sub_function area 以下为子函数定义区域

    //判断当前URL是否包含x
    function isURL(x) {
	    //console.log(window.location.href);
        return window.location.href.indexOf(x) != -1;
    }

    //选取指定类型的页面，设置到url_go
    function seturl(type) {
        var pagelist = [];
        var i;
        for (i = 0; i < pages.length; i++) {
            if (pages[i][1] == type) {
                pagelist.push(pages[i][2]);
            }
        }
	    //console.log("pagelist");
	    //console.log(pagelist);

        url_go = pagelist[Math.floor(Math.random() * pagelist.length)];

    }

    // 跳转到url_go
    function jumpto_url() {
        window.location.assign(url_go);
    }

    function get_award() { //检查是否可以抽奖，抽奖完成后随机跳转到某个可刷帖分区页面
        var award_text, award_data;
        var award_btns;
        var i;
        award_text = document.getElementById("tips_credit");
        //console.log(award_text);
        award_data = award_text.innerHTML.match(/\d+/g);
        //console.log(award_data);
        if (Number(award_data[2]) < Number(award_data[1])) { //当前可以抽奖
            //console.log("当前可以抽奖");
            award_btns = document.getElementsByClassName("awards");
            //console.log(award_btns);
            for (i=0;i<5;i++) { //抽奖5次
                award_btns[Math.floor(Math.random() * award_btns.length)].click();
            }
        }
        //随机跳转到某个可刷帖分区页面
        seturl(11);
        setTimeout(jumpto_url, 20000);
        return;
    }

    // 回帖的时间循环
    function loop_repo() {
        document.title = "[" + time * countunit + "s] " + title; //更新title中显示的倒数时间
        //console.log("剩余时间：" + (time * countunit));
        switch (time) {
            case 2: //如果在线奖励页面出现，点击关闭
 	            element_temp = document.getElementById("fwin_dialog_submit");
                //console.log("获取在线奖励页面确定按钮：" + element_temp);
		        if (element_temp) {
			        //console.log("点击确定按钮关闭在线奖励页面");
			        element_temp.click();
                }
                break;
            case 1: //快速回帖
                element_temp = document.getElementById("fastpostmessage");
                element_temp.value = messages[Math.floor(Math.random() * messages.length)];
                element_temp = document.getElementById("fastpostsubmit");
                element_temp.click();
                break;
            case 0: //随机跳转到某个可刷帖分区页面，或者抽奖页面，或者交流吧发帖页面，概率分布为6:2:2
                if (Math.floor(Math.random() * 10) < 6) {
                    seturl(11); //随机跳转到某个可刷帖分区页面
                } else if (Math.floor(Math.random() * 10) < 5) {
                    seturl(21); //跳转到抽奖页面
                } else {
                    seturl(41); //跳转到交流吧分区页面
                }
                setTimeout(jumpto_url, 2000);
                return;
                break;
        }
        time--;
        setTimeout(loop_repo, countunit*1000); //每countunit秒loop一次
    }

    // 发帖的时间循环
    function loop_post() {
        document.title = "[" + time * countunit + "s] " + title; //更新title中显示的倒数时间
        //console.log("剩余时间：" + (time * countunit));
        switch (time) {
            case 2: //如果在线奖励页面出现，点击关闭
 	            element_temp = document.getElementById("fwin_dialog_submit");
                //console.log("获取在线奖励页面确定按钮：" + element_temp);
		        if (element_temp) {
			        //console.log("点击确定按钮关闭在线奖励页面");
			        element_temp.click();
                }
                break;
            case 1: //快速发帖
                elements_ary = document.getElementById("typeid_fast_ctrl_menu").firstChild.children; //选择主题分类
                //console.log(elements_ary);
                elements_ary[3].click();

                element_temp = document.getElementById("subject"); //填写主题
                element_temp.value = subjects[Math.floor(Math.random() * subjects.length)];

                element_temp = document.getElementById("fastpostmessage"); //填写内容
                element_temp.value = messages[Math.floor(Math.random() * messages.length)];

                element_temp = document.getElementById("fastpostsubmit");
                element_temp.click();
                break;
            case 0: //随机跳转到某个可刷帖分区页面
                seturl(11); //随机跳转到某个可刷帖分区页面
                setTimeout(jumpto_url, 2000);
                return;
                break;
        }
        time--;
        setTimeout(loop_post, countunit*1000); //每countunit秒loop一次
    }

    // 刷新页面
    function page_reload() {
        location.reload();
    }

})();