// ==UserScript==
// @name         教育网脚本
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  全国煤炭行业现代远程教育培训网每月培训自动播放，自动下一个，静音。
// @author       maple
// @match        https://www.coaledu.net/*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @icon         https://www.coaledu.net/html/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435139/%E6%95%99%E8%82%B2%E7%BD%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435139/%E6%95%99%E8%82%B2%E7%BD%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/**
 * 脚本名：   煤炭远程教育培训网每月培训脚本
 * 版本：    2.0
 * 创建时间： 2020.11.17
 * 脚本用途：全国煤炭行业现代远程教育培训网每月培训自动播放
 *
 * 使用方法：登录自己的账号，点击个人中心的我的培训即可自动执行。
 * 功能说明：1。进入我的培训页面即可自动开始
 *         2。每月培训自动筛选培训未完成的课程
 *         3。课程详情页面自动下一步
 *         4。课程详情页自动纠错，重复执行，直到时间结束
 *         5。视频播放页自动筛选未观看完成的视频
 *         6。自动播放视频
 *         7。自动静音，也可以不静音。
 *         8。视频播放完毕自动下一个视频
 *         9。全部视频播放完毕自动下一个课程
 *         10.只要是在这个网站，超过两分钟未操作，自动跳转到培训页执行脚本
 *
 * 备注说明：脚本都是自动化，请勿手动操作，按照脚本说明操作即可。
 *         如果页面长时间（超过2分钟）没有动作，可以手动刷新一下网页。
 *         遇到不名原因的问题，请联系我。
 */

$(function () {
    //播放视频时是否静音【0：静音；1：不静音】
    let vlo = 0;

    //当前观看视频进度
    let currentDate = "&*#";

    //未完成数组
    let dir = [];

    let stop;

    //调用
    main();

    //主函数
    function main() {
        stop = setInterval(judge_page, 3000);
    }

    //判断当前在那个页面
    function judge_page() {
        let url = document.URL;
        let index = "https://www.coaledu.net/v/#/member/personalCenter/myTraining";
        //我的培训
        if (url===index){
            console.log("我的培训")
            setTimeout(menu, 10000);
            //关闭原有页面
            clearInterval(stop);
            setTimeout("window.close()",12000);
        }else if

            //课程详情页
        (url.indexOf("https://www.coaledu.net/html/courseDetails.html?courseID=")!==-1){
            clearInterval(stop);
            console.log("课程详情");
            //点击继续学习(可能刚从前面一个出来，所以要一直点)
            setInterval(continue_study, 4000);
        }
        else if
            //观看视频页面
        (url.indexOf("https://www.coaledu.net/html/coursePlay.html?courseID=")!==-1){
            clearInterval(stop);
            console.log("视频播放")
            //处理摄像头弹窗
            setTimeout(camera_pop, 1000);
            //浏览主函数
            setTimeout(browse_main, 3000);

        }
        else{
            console.log("等待...")
            //其他的页面，在2分钟内没有其他操作的话，跳转到我的培训
            setTimeout("location.href='https://www.coaledu.net/v/#/member/personalCenter/myTraining'", 120000);
        }
    }


    //个人中心我的培训；找到未完成的课程
    function menu() {
        //找到课程目录列
        let list = $(".el-table_1_column_3  ").children("div")[1].getElementsByTagName("p");
        for (let i = 0; i < list.length; i++) {
            //获取进度
            let schedule = list[i].getElementsByTagName("span")[0].innerHTML;
            console.log(schedule);

            //未完成，进入详情页面刷课
            if (schedule!=="100.0%"){
                //点击超链接
                list[i].getElementsByTagName("a")[0].click();
                break;
            }
        }
    }

    //点击继续学习
    function continue_study() {
        $(".buy").children("a")[0].click();
    }


    //处理摄像头弹窗
    function camera_pop() {
        let pop = $(".el-message-box")[0];
        //找到弹窗
        if (pop !=null){
            console.log("存在摄像头弹窗，处理")
            //点击继续看课
            pop.getElementsByClassName("el-button")[0].click();
        }
    }

    //浏览视频main
    function browse_main() {
        console.clear();
        //目录中选择为观看的视频
        director();

        //下一个未完成
        next();

        //每两秒循环检测一次
        setInterval(play_loop, 3000);

    }


    //在目录中选择未完成的内容
    function director() {

        //直接找到所有课程的可点击的a标签
        let list = document.getElementsByClassName("tree-catalog")[0].getElementsByClassName("row1");
        for (let i = 0; i < list.length; i++) {
            //有span标签才添加，并且有%
            let text = list[i].getElementsByTagName("span")[1].innerHTML;
            //不管有没有看，都添加进来！！！！！！！！！！
            if (text.indexOf("%")!==-1){
                //添加进数组
                dir.push(list[i]);
            }
        }
        for (let i = 0; i < dir.length; i++) {
            console.log(dir[i])
        }

    }

    function next() {
        //本模块结束
        if (dir.length===0){
            window.open("https://www.coaledu.net/v/#/member/personalCenter/myTraining","_self");
        }

        console.log("未观看视频："+dir[0].getElementsByTagName("a")[0].title)
        dir[0].getElementsByTagName("a")[0].click();
    }


    function play_loop() {

        //播放
        play();

        //视频总时长
        let sum_date = play_bar();

        //获取当前视频时长
        current_time();

        //下一个
        next_video();


        //下一个视频
        function next_video() {
            //当前时长等于总时长，表示结束
            if (currentDate===sum_date && currentDate!== "00:00"){
                console.log("本视频结束")

                //未完成所有，下一个视频未播放的视频
                pop_first();

                //处理评价
                evaluate();

                //本模块结束
                if (dir.length===0){
                    window.open("https://www.coaledu.net/v/#/member/personalCenter/myTraining","_self");
                }
                //点击下一个
                next();
            }
        }

    }

    //课程评价
    function evaluate(){
        //评价的可见状态，判断有没有弹出
        let div_display = $("comment-dialog").css("display");
        //弹出了
        if (div_display!=="none"){
            console.log("取消评价")
            //点击取消按钮
            $(".el-button--default")[1].click();
        }
    }


    //数组弹出第一个
    function pop_first() {
        //先翻转，弹出第一个，后面再翻转
        dir.reverse();
        dir.pop();
        dir.reverse();
        console.log("未观看视频的个数为："+dir.length);
    }

    //播放视频
    function play() {
        //播放按钮
        let play_button = $("#replaybtn");
        //播放状态
        let play_status = play_button.css("display");
        //可见状态时代表未播放
        if (play_status==="block"){
            //点击播放
            play_button[0].click();
        }

        //默认静音
        if (vlo===0){
            //静音处理
            let audio = $(".ccH5vm");
            //音量
            let volume = audio.css("background-position");
            //100% 50%是静音状态
            if (volume!=="100% 50%"){
                //点击静音
                audio[0].click();
            }
        }
    }

    //视频总时长
    function play_bar(){
        //获取评论上面的时间节点
        let time_node = $(".ccH5Time")[0];
        //视频总时长
        let sum_date = time_node.getElementsByClassName("ccH5TimeTotal")[0].innerHTML;

        //console.log("视频总长："+sum_date);
        return sum_date;
    }

    //当前观看时长
    function current_time() {
        //获取评论上面的时间节点
        let time_node = $(".ccH5Time")[0];
        //当前观看的时间
        let current_date = time_node.getElementsByClassName("ccH5TimeCurrent")[0].innerHTML;
        console.log("当前观看："+current_date);
        currentDate = current_date;

    }

})