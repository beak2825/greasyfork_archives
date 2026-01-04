// ==UserScript==
// @name         数码之家自动回复
// @namespace    https://greasyfork.org/users/433510
// @version      0.3.1
// @description  数码之家专用，自动签到，自动在“爱淘优惠购”和“数码值得买”回奖励帖
// @author       lingyer
// @match        https://www.mydigit.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395155/%E6%95%B0%E7%A0%81%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395155/%E6%95%B0%E7%A0%81%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pages_type = [ //页面类型，每条信息的格式为“匹配字符串，网页url”
            ["id=k_misign:sign", "https://www.mydigit.cn/plugin.php?id=k_misign:sign"], //代码0 签到页面
            ["mod=forumdisplay&fid=", "https://www.mydigit.cn/forum.php?mod=forumdisplay&fid=xxfidxx&filter=author&orderby=dateline&page=xxpagexx"], //代码1 分区帖子列表页面
            ["mod=viewthread&tid=", "https://www.mydigit.cn/forum.php?mod=viewthread&tid=xxtidxx"], //代码2 帖子内容页
        ];

    const forums_info = [ //有效的分区列表，每条信息的格式为“分区fid，分区名称，回帖收费”
            [2, "爱淘优惠购", 2],
            [36, "数码交易区", 2],
            [37, "数码值得买", 2],
            [51, "拆机乐园", 0],
        ];
    const threads_info = [ //有效的帖子内容页，每条信息的格式为“匹配字符串，帖子内容页类型”
            ["authorid=", 61], //类型61 只看aid=xxx的帖子内容页
            ["mod=viewthread&tid=", 62], //类型62 常规的帖子内容页
        ];

    const date_limit = 3; //论坛的回帖时间限制，3天之前的帖子不能再回复
    const repo_text = "看上去不错的哦。了解一下，谢谢楼主的分享！"; //自动回贴内容
    const delay_unit = 5 //时间更新间隔（sec），标题栏上倒数时间的更新间隔
    const delay_repo = 18; //回帖延迟，delay_repo * delay_unit不小于论坛允许的回帖间隔时间

    var cur_ptype; //当前页面类型
    var cur_fid; //当前页面的fourm id
    var cur_pid; //当前页面的page number
    var cur_pay; //当前页面的回帖收费
    var cur_tid; //当前页面的thread id
    var cur_uid; //登录帐户id

    var statuscode; //当前状态代码

    var url_go; //跳转时的目标url
    var delay_go; //跳转前延时(s)
    var title; //标题显示
    var time; //标题时间计数

    var time_now = new Date(); //当前系统时间，用于自动回帖控制
    var time_last; //上一轮任务时间，用于自动回帖控制
    var time_diff; //时间差值，转换成小时或天，以提高程序可读性


    var sublinks; //当前分区页面所有帖子列表
    var flag_searchmode; //在当前分区页面查找帖子的模式标志
                         //0：查找当前页中tid=thread_id或第一个超期的帖子，如果找不到，跳转到下一页继续找
                         //1：查找当前页中最后一个奖励帖，如果找不到，跳转到前一页继续找
                         //2：继承之前查找结果，继续查找当前页中最后一个奖励帖，如果找不到，跳转到前一页继续找

    var cur_ttime; //当前thread发帖时间
    var cur_taward; //当前thread回帖奖励

    var flag_canrepo; //帖子可以回复的标志

    //临时变量
    var i, j;
    var str_tmp;
    var ary_tmp;
    var element_tmp;
    var elements_ary;

    //判断当前页面是否在脚本触发范围内，同时获取cur_ptype、cur_fid、cur_pid、cur_tid
    //首先判断当前页面的类型
    for (cur_ptype = 0; cur_ptype < pages_type.length; cur_ptype++) {
        if (window.location.href.indexOf(pages_type[cur_ptype][0]) != -1) {
            break;
        }
    }
    switch (cur_ptype) { //根据当前页面的分类，继续判断
        case 0: //当前页面在每日签到页面
            console.log("当前页面在每日签到页面，cur_ptype:" + cur_ptype);
            break;
        case 1: //当前页面在分区帖子列表，继续获取fid、pageid、回帖收费
            cur_fid = window.location.href.match(/(?<=fid=)\d+/g)[0];
            console.log(ary_tmp);

            console.log("当前页面在分区帖子列表，cur_ptype:" + cur_ptype);
            break;
        case 2: //当前页面在帖子内容页
            console.log("当前页面在帖子内容页，cur_ptype:" + cur_ptype);
            break;
        default:
            //当前页面不在触发范围内，退出脚本
            console.log("当前页面不在触发范围内，退出脚本");
            return;
    }

    //获取登录帐户名，用于判断帖子是否回复过，防止重复回帖
    cur_uid = document.getElementsByClassName("vwmy qq")[0].innerHTML.match(/\d+/)[0];
    console.log("当前用户id：" + cur_uid);

/*
    //获取状态标志位
    statuscode = Number(localStorage.getItem(cur_uid + "_statuscode")); //从本地取出状态标志位
    console.log("当前状态: " + statuscode);
    if (statuscode > 99) { //statuscode > 99 说明全部任务均已完成，

    //检查与上一轮任务的时间间隔，超过6小时则开始新一轮任务，否则根据当前页面继续执行脚本
    str_tmp = localStorage.getItem(cur_uid + "time_last")
    console.log("time_last_str : " + str_tmp);
    if (str_tmp != null) { //取到了time_last
        time_last.setTime(str_tmp);
        console.log("time_last : " + time_last);
        console.log("time_now : " + time_now);
        if (time_now - time_last > (6*3600*1000)) {//距上次执行任务间隔超过6小时
            localStorage.setItem(cur_uid + "_time_last", time_now); //将任务时间存入本地
            statuscode = 0; //下一个任务是每日签到
            get_url();
            delay_go = 2;
            goto_url();
        }
    }

    //sub_function area 以下为子函数定义区域

    //获取当前分区的回帖收费
    function get_url() {
        var i;
        for (i = 0; i < pages.length; i++) {
            if (forumcode == pages[i][1]) {
                return pages[i][3];
            }
        }
        return 100;
    } //end func getpay

    localStorage.setItem(cur_uid + "_time_last", time_now); //将任务时间存入本地
    
    localStorage.setItem(cur_uid + "_statuscode", statuscode); //将statuscode存入本地
        //跳转到每日签到页面
        delaygo(statuscode, 1);
            return;
            //超过6h，开始新一轮任务
//    }
    title = document.title;
    document.title = "<" + statuscode + ">" + title; //自动脚本运行中，在title中增加statuscode代码

    //获取当前页面代码
    for (i = 0; i < pages.length; i++) {
        if (window.location.href.indexOf(pages[i][0]) != -1) {
            break;
        }
    }
    //console.log("page_now:" + i);
    if (i >= pages.length) {
        //当前页面不在触发范围内
        console.log("当前页面不在触发范围内");
        cur_pcode = 255;
    } else {
        cur_pcode = pages[i][1];
	}

    //console.log("根据当前页面代码，采取对应处理方法");
    switch (cur_pcode) { //根据当前页面对应的代码，采取对应处理方法
        case 0: //当前页面在每日签到页面
    		//自动签到，之后跳转到新任务页面
            btn_tmp = document.getElementById("JD_sign");
            //console.log(btn_tmp);
            if (btn_tmp != null) {
                //console.log("自动签到触发");
                btn_tmp.click();
            }

            //跳转到爱淘优惠购页面，开始自动回帖
            //设置状态标志位为爱淘优惠购
            statuscode = 11;
            localStorage.setItem(user_id + "_statuscode", statuscode); //将statuscode存入本地
            //置thread id = 0，置page_id = 1，置flag_searchmode = 0，转到爱淘优惠购分区
            thread_id = 0;
            localStorage.setItem(user_id + "_thread_id", thread_id);
            page_id = 1;
            flag_searchmode = 0;
            localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
            delaygo(statuscode, 1);
            return;
            break;

        case 11: //当前页面在爱淘优惠购页面
            //console.log("当前页面在爱淘优惠购");

        case 12: //当前页面在数码值得买页面
            //console.log("当前页面在数码值得买");

        case 13: //当前页面在数码交易区页面
            //console.log("当前页面在数码交易区");

        case 14: //当前页面在拆机乐园页面
            //console.log("当前页面在拆机乐园");

            //从本地取出thread id
            thread_id = Number(localStorage.getItem(user_id + "_thread_id")); //从本地取出thread_id
            //console.log("thread_id = " + thread_id);
            //从本地取出flag_searchmode
            flag_searchmode = Number(localStorage.getItem(user_id + "_flag_searchmode")); //从本地取出flag_searchmode
            //console.log("flag_searchmode = " + flag_searchmode);

            sublinks = document.getElementsByClassName("s xst"); //读取当前页面帖子列表
            switch (flag_searchmode) { //根据flag_searchmode，采取对应处理方法
                case 0: //查找当前页中tid=thread_id的帖子，或者第一个超期的帖子，若找不到则跳转到下一页继续找
                    console.log("flag_searchmode=" + flag_searchmode);
                    for (i = 0;i < sublinks.length;i++) {
                        if (thread_id == Number(sublinks[i].href.match(/\d+/)[0])) { //找到了tid=thread_id的帖子
                            console.log("找到了tid=thread_id的帖子。 i=" + i + "，thread_id=" + thread_id);
                            break;
                        } else {
                            //获取当前帖子的ttime
                            str_tmp = sublinks[i].parentNode.parentNode.children[2].children[1].innerHTML.match(/\d{4}\-\d{1,2}\-\d{1,2}/)[0];
                            //console.log("post_time_str：" + str_tmp);
                            ary_tmp = str_tmp.match(/\d{1,4}/g);
                            cur_ttime = new Date(ary_tmp[0], ary_tmp[1] - 1, ary_tmp[2]);
                            //console.log("cur_ttime：" + cur_ttime);
                            time_now = new Date();
                            //console.log("time_now : " + time_now);
                            time_diff = Math.floor((time_now - cur_ttime) / 86400000);
                            //console.log("time_diff : " + time_diff);
                            if (time_diff > date_limit) { //找到了超期的帖子
                                console.log("找到了超期的帖子。 i=" + i + "，thread_id=" + thread_id);
                                break;
                            }
                        }
                    }
                    if (i < sublinks.length) { //i < sublinks.length说明找到了tid=thread_id的帖子或者超期的帖子，设置flag_searchmode = 2，继续找tid=thread_id的帖子之前的最后一个不超期的奖励帖
                        flag_searchmode = 2;
                        localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                    } else { //当前页中找不到tid=thread_id的帖子或者超期的帖子，跳转到下一页继续找
                        flag_searchmode = 0;
                        localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                        //获取当前page_id
                        page_id = Number(window.location.href.match(/page=\d+/)[0].match(/\d+/)[0]);
                        page_id++;
                        delaygo(statuscode, 1); //跳转到当前分区的下一个页面
                        return;
                    }

                case 1: //查找当前页中最后一个奖励帖，如果找不到，跳转到前一页继续找
                    if (flag_searchmode == 1) {
                        console.log("flag_searchmode=" + flag_searchmode);
                        i = sublinks.length;
                        flag_searchmode == 2;
                    }

                case 2: //查找当前页中tid=thread_id的帖子之前的最后一个奖励帖，并跳转到帖子详情页，如果找不到，跳转到前一页继续找
                    console.log("flag_searchmode=" + flag_searchmode);
                    i--;
                    for (;i >= 0;i--) { //从后向前检查
                        ary_tmp = sublinks[i].parentNode.getElementsByClassName("xi1");
                        //console.log(ary_tmp);
                        if (ary_tmp.length != 0) { //有信息栏
                            if (ary_tmp[0].innerHTML.indexOf("回帖奖励") != -1) { //信息栏内容是回帖奖励
                                //此帖子为奖励帖
                                //获取当前帖子的tid
                                thread_id = Number(sublinks[i].href.match(/\d+/)[0]);
                                localStorage.setItem(user_id + "_thread_id", thread_id); //将thread_id存入本地
                                console.log("找到了回帖奖励帖。 i=" + i + "，thread_id=" + thread_id);
                                break;
                            }
                        }
                    }
                    if (i >= 0) { //i >= 0说明找到了奖励帖，跳转到帖子内容页，继续判断回帖奖励是否大于费用
                        forumcode = statuscode;
                        localStorage.setItem(user_id + "_forumcode", forumcode); //保存正在回复的分区代码
                        page_id = Number(window.location.href.match(/page=\d+/)[0].match(/\d+/)[0]);
                        localStorage.setItem(user_id + "_page_id", page_id); //保存当前page_id
                        flag_canrepo = 0;
                        localStorage.setItem(user_id + "_flag_canrepo", flag_canrepo); //保存flag_canrepo标志位
                        statuscode = 62;
                        localStorage.setItem(user_id + "_statuscode", statuscode);
                        delaygo(statuscode, 1); //跳转到帖子内容页
                        return;
                    } else { //当前页中找不到奖励帖，跳转到前一页
                        flag_searchmode = 1;
                        localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                        //获取当前page_id
                        page_id = Number(window.location.href.match(/page=\d+/)[0].match(/\d+/)[0]);
                        page_id--;
                        if (page_id > 0) {
                            delaygo(statuscode, 1); //跳转到当前分区的下一个页面
                            return;
                        } else { //该分区检查完毕，没有可回的奖励帖，继续检查下一个分区
                            statuscode = getnextforum(cur_pcode); //获取下一个可以回帖的分区代码
                            localStorage.setItem(user_id + "_statuscode", statuscode); //将statuscode存入本地
                            //置thread id = 0，置page_id = 1，置flag_searchmode = 0，转到下一个可以回帖的分区
                            thread_id = 0;
                            localStorage.setItem(user_id + "_thread_id", thread_id);
                            page_id = 1;
                            flag_searchmode = 0;
                            localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                            delaygo(statuscode, 1);
                            return;
                        }
                    }
                    break;
            } //end switch flag_searchmode
            break;

        case 61: //当前页面在帖子内容页
            console.log("当前页面在帖子内容页，检查该帖子是否已经回复过");

            thread_id = Number(localStorage.getItem(user_id + "_thread_id")); //从本地取出thread_id
            if (window.location.href.indexOf(thread_id) != -1) { //thread_id匹配
                msg_tmp = document.getElementById("messagetext");
                if (msg_tmp != null) {
                    if (msg_tmp.innerHTML.indexOf("未定义操作") != -1) { //该帖子未回复过，跳转到可回复的帖子内容页，继续判断是否可以回复
                        flag_canrepo = 1;
                        localStorage.setItem(user_id + "_flag_canrepo", flag_canrepo);
                        statuscode = 62;
                        localStorage.setItem(user_id + "_statuscode", statuscode);
                        delaygo(statuscode, delay_repo); //延迟跳转到可回复的帖子内容页
                        return;
                    }
                }
                //该帖子已回复过，回到当前分区的当前页面，继续寻找前一个可回复的奖励帖
                flag_searchmode = 0;
                localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                statuscode = Number(localStorage.getItem(user_id + "_forumcode")); //从本地取出正在自动回复的分区代码
                localStorage.setItem(user_id + "_statuscode", statuscode); //将statuscode存入本地
                page_id = Number(localStorage.getItem(user_id + "_page_id")); //从本地取出page_id
                delaygo(statuscode, 1);
                return;
            } else { //thread_id不匹配
                //thread_id不匹配，什么都不做
                console.log("thread_id不匹配，什么都不做");
                return;
            }
            break;

        case 62: //当前页面在可回复的帖子内容页
            console.log("当前页面在可回复的帖子内容页，判断奖励是否满足回帖要求");

            thread_id = Number(localStorage.getItem(user_id + "_thread_id")); //从本地取出thread_id
            if (window.location.href.indexOf(thread_id) != -1) { //thread_id匹配
                console.log("thread_id匹配");
                text_tmp = document.getElementById("fastpostmessage");
                if (text_tmp !=null) { //当前帖子可以回复
                    ary_tmp = document.getElementsByClassName("plc ptm pbm xi1"); //读取奖励信息
                    if (ary_tmp.length > 0) { //存在奖励信息
                        forumcode = Number(localStorage.getItem(user_id + "_forumcode")); //从本地取出正在自动回复的分区代码
                        //console.log(sublinks[0].textContent.match(/\d+/)[0]);
                        //console.log(getpay(forumcode));
                        if (Number(ary_tmp[0].textContent.match(/\d+/)[0]) > getpay(forumcode)) { //奖励大于费用，可以回帖
                            console.log("奖励大于费用，可以回帖");
                            flag_canrepo = Number(localStorage.getItem(user_id + "_flag_canrepo")); //从本地取出flag_canrepo
                            if (flag_canrepo > 0 ) { //当前帖子可以回复，立刻回帖
                                text_tmp.value = repo_text; //填入回帖内容
                                btn_tmp = document.getElementById("fastpostsubmit");
                                btn_tmp.click(); //点击回帖按钮
                            } else {
                                statuscode = 61;
                                localStorage.setItem(user_id + "_statuscode", statuscode);
                                delaygo(statuscode, 1); //延迟跳转到可回复的帖子内容页
                                return;
                            }
                        }
                    }
                }
                //该帖子不可回复，回到当前分区的当前页面，继续寻找前一个可回复的奖励帖
                flag_searchmode = 0;
                localStorage.setItem(user_id + "_flag_searchmode", flag_searchmode);
                statuscode = Number(localStorage.getItem(user_id + "_forumcode")); //从本地取出正在自动回复的分区代码
                localStorage.setItem(user_id + "_statuscode", statuscode); //将statuscode存入本地
                page_id = Number(localStorage.getItem(user_id + "_page_id")); //从本地取出page_id
                delaygo(statuscode, 1);
                return;
            } else { //thread_id不匹配
                //thread_id不匹配，什么都不做
                console.log("thread_id不匹配，什么都不做");
                return;
            }
            break;

    }
*/
    //sub_function area 以下为子函数定义区域

    //获取当前分区的回帖收费
    function getpay(forumcode) {
        var i;
        for (i = 0; i < pages.length; i++) {
            if (forumcode == pages[i][1]) {
                return pages[i][3];
            }
        }
        return 100;
    } //end func getpay

    //获取下一个可以回帖的分区代码，若没有可以回帖的分区，则返回100（任务全部完成）
    function getnextforum(forumcode) {
        var i;
        forumcode++;
        for (i = 0; i < pages.length; i++) {
            if (forumcode == pages[i][1]) {
                return forumcode;
            }
        }
        return 100;
    } //end func getnextforum

    //延时跳转函数
    function delaygo(urlcode, delaycount) {
        var i;
        url_go = null;
        for (i = 0; i < pages.length; i++) {
            if (pages[i][1] == urlcode) {
                url_go = pages[i][2];
                url_go = url_go.replace("xxpagexx", page_id);
                url_go = url_go.replace("xxtidxx", thread_id);
                url_go = url_go.replace("xxaidxx", user_id);
                //console.log("url_go: " + url_go);
            }
        }
        if (url_go != null) {
            time = delaycount;
            countdown();
        } else {//statuscode参数错误，未找到要跳转的url
            console.log("statuscode参数错误，未找到要跳转的url! statuscode=" + statuscode);
        }
    } //end function delaygo

    //时间倒数
    function countdown() {
        document.title = "[" + time * delay_unit + "] " + title; //更新title中显示的倒数时间
        if (time <= 0) {
            window.location.assign(url_go); //跳转到url_go
            return;
        }
        time--;
        setTimeout(countdown, delay_unit*1000); //delay_unit秒后，再次执行countdown
    } //end function countdown


})();