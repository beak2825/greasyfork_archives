// ==UserScript==
// @name         国家智慧教育公共服务平台|国家中小学智慧教育平台|师德研修|自动挂机刷课|自动答题
// @namespace    挂机刷课
// @version      1.2
// @license      CC BY-NC-SA
// @description  进入研修专题，然后选择到你要看课的网址，直接点进去就行，会自动开始刷课和挂机。
// @author       Hunter_Quan
// @match        https://basic.smartedu.cn/training/2023sqpx
// @match        https://basic.smartedu.cn/training/*
// @match        https://basic.smartedu.cn/teacherTraining/*
// @icon         https://www.zxx.edu.cn/favicon.ico
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469300/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E5%B8%88%E5%BE%B7%E7%A0%94%E4%BF%AE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/469300/%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E5%B8%88%E5%BE%B7%E7%A0%94%E4%BF%AE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%E5%88%B7%E8%AF%BE%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var settings = {};
var settingsDefault = {
    News: true, //0
    Video: true,//1
    ExamPractice: true, //6 每日答题
    ExamWeekly: true,//2 每周答题
    ExamPaper: true,//5 专项练习
    ShowMenu: false, //7 隐藏菜单
    AutoStart: false, //是否加载脚本后自动播放
}
var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:45px;left:45px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    };
    //研修主页，则获取分数
    //setInterval(shuaxin,60000,"5秒执行一次");
    function shuaxin(){
        //如果进入了学习列表页，则获取分数
        location.reload()
    };

    setInterval(learn,18000,"5秒执行一次");
    function learn(){
        var promise = sleep(4000); // 等待3秒钟
        if (document.URL.search('2023sqpx') > 1){
            //检查是否完成总学时
            //已学总学时
            var sumlearn = parseInt(document.querySelector("#root > div > div > div > div > div.index-module_banner_3blPg > div.index-module_topprocess_22U2B > div.index-module_topprocessC_3zGqt > div:nth-child(2) > span.index-module_topprocessCMy_2Jl2Q").innerText.replace(/[^0-9/.]/ig, ""))
            //要求总学时
            var mustlearn = parseInt(document.querySelector("#root > div > div > div > div > div.index-module_banner_3blPg > div.index-module_topprocess_22U2B > div.index-module_topprocessC_3zGqt > div:nth-child(2) > span:nth-child(2)").innerText.replace(/[^0-9/.]/ig, ""))
            console.log(`>>>学习积分：已学${sumlearn},要求学时${mustlearn}`);
            //如果总学时达标
            if (sumlearn >= mustlearn){
                localStorage.setItem('studystate', 'No');
                console.log(`学习完成，已学${sumlearn},要求学时${mustlearn}`);
                send_over();
                localStorage.setItem('close', 'Yes');
                promise.then(closeWin);
                //closeWin();
            }else{
                //获取学习列表
                var li = document.querySelectorAll("div.index-module_box_2FQGy");
                //获取学习状态
                var studystate = localStorage.getItem('studystate');
                console.log("studystate:"+studystate)
                //如果学习状态不等于Yes;表示不在学习中...
                if (studystate != 'Yes') {
                    //循环获取分数；
                    for (var i = 0; i < li.length; i++) {
                        var f1 = parseInt(li[i].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(2) > span').innerText.replace(/[^0-9/.]/ig, ""));
                        var d2 = li[i].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(3) > span:nth-child(2)')
                        if (d2 == null){
                            var f2 = 1;
                            //console.log("null")
                        }else{
                            f2 = parseInt(li[i].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(3) > span:nth-child(2)').innerText.replace(/[^0-9/.]/ig, ""));
                        }
                        console.log("第"+Number(i+1)+"个:--已学"+f1+"分--总分"+f2+"分--")
                        if(f1 < f2){
                            console.log(`开始学习第${i}个,当前分数：${f1},要求分数：${f2}`)
                            localStorage.setItem('studystate', 'Yes');
                            localStorage.setItem('num', i);
                            li[i].click();
                            break;
                        };
                    };
                    console.log('获取分数循环结束');
                }else{
                    //如果学习状态等于Yes;表示在学习中...
                    var n = localStorage.getItem('num');
                    var now = parseInt(li[n].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(2) > span').innerText.replace(/[^0-9/.]/ig, ""));
                    var dd2 = li[n].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(3) > span:nth-child(2)')
                    if (dd2 == null){
                        var sum = 1;
                        //console.log("null")
                    }else{
                        sum = parseInt(li[n].querySelector('div > div > div.index-module_process_3RHjg > div:nth-child(3) > span:nth-child(2)').innerText.replace(/[^0-9/.]/ig, ""));
                    }
                    console.log('---now：'+ now +'---sum：'+ sum);
                    if(now < sum){
                        console.log(`第${Number(n)+1}个未完成`);
                    }else{
                        console.log(`第${Number(n)+1}个已完成`);
                        localStorage.setItem('num', Number(n)+1);
                        localStorage.setItem('close', 'Yes');
                        sleep(2000).then(res => {
                            //close设为No
                            localStorage.setItem('close', 'No');
                            console.log("close:", localStorage.getItem('close'));
                            localStorage.clear();
                            //li[Number(n+1)].click();
                        });
                    };
                    sleep(3000).then(shuaxin)
                };
            };
        };
    };

    setInterval(clickstart,10000,"5秒执行一次");
    function clickstart(){
        //点击开始学习
        if (document.URL.search('courseIndex') > 1) {
            //复习回顾
            //document.querySelector("#root > div > div > div > div > div > div > section > div > div.CourseIndex-module_course_1_SiV > div.CourseIndex-module_course-action_2eWDh > a")
            //开始学习
            //document.querySelector("#root > div > div > div > div > div > div > section > div > div.CourseIndex-module_course_1_SiV > div.CourseIndex-module_course-action_2eWDh > a")
            //点击开始学习
            var kaishi = document.querySelector("#root > div > div > div > div > div > div > section > div > div.CourseIndex-module_course_1_SiV > div.CourseIndex-module_course-action_2eWDh > a");
            if (kaishi){
                console.log('点击开始...')
                kaishi.click()
            }
            var gou = document.querySelector("span.fish-checkbox > input")
            var iknow = document.querySelector("div.index-module_btn_1UrHX")
            if (iknow){
                iknow.scrollIntoView();
                console.log('点击我知道了...')
                gou.click();
                iknow.click();
            }else{
                console.log('我知道了点不到...')
            };
        };
    };

    setInterval(shipinyemian,1000,"每隔1秒执行一次");
    //【document.querySelector('video').playbackRate = 16;】改变视频播放速度，如果想快点刷，请把【】里的代码在浏览器F12控制台里 复制粘贴进去，会发现看视频速度快了很多
    //适配https://basic.smartedu.cn/training/2023sdjy
    //最小化以后，后台就不会自动播放了，建议把窗口改小
    function shipinyemian(){
        if (document.URL.search('courseDetail') > 1) {
            var close = localStorage.getItem('close');
            if (close == 'Yes'){
                closeWin();
                localStorage.setItem('close', 'No');
            }

            // 新进去视频的弹出对话框“我知道了”处理
            var iknow = document.querySelector("div.fish-modal-confirm-btns>button")
            if(iknow == null){
                console.log("我知道了按钮没有发现，不执行操作")
            }else{
                var iknowtext = iknow.innerText
                if(iknowtext == '我知道了'){
                    //点击我知道了按钮
                    iknow.click()
                }
            }
            var video = document.querySelector('video')
            if (video != null){
                //16倍速
                beisu16();
                //检测题目
                var jiancetimu = document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_header_35MsH > div:nth-child(1) > span.index-module_title_1HDZy")
                var text = null
                if(jiancetimu == null){
                    console.log("没有发现题目")
                    var playAgain = document.getElementsByClassName("course-video-reload")[0]
                    if(playAgain == null){
                        //没检测到再学一遍
                        console.log("执行播放")
                        //没题目，但是播放器没有在播放视频，因此这一步进行点击播放器的按钮
                        for(var i = 0 ;i<3;i++){
                            document.getElementsByClassName("vjs-big-play-button")[0].click()
                            //静音
                            var jingyin =document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0]
                            if(jingyin == null){
                                console.log("静音为空，不执行静音操作")
                            }else{
                                document.getElementsByClassName("vjs-mute-control vjs-control vjs-button vjs-vol-3")[0].click()
                            }
                        }

                    }else{
                        //检测到再学一遍
                        var teachAgain = playAgain.textContent
                        console.log("执行下一条视频")
                        if(teachAgain == '再学一遍'){
                            //进行判断视频是否是上一个看完的，然后点击下一个视频
                            var zhedie = document.getElementsByClassName("fishicon fishicon-right fish-collapse-arrow")
                            //"fishicon fishicon-right fish-collapse-arrow"折叠按钮
                            //rotate="90"展开状态
                            for(var j=0;j<zhedie.length;j++) {
                                if (zhedie[j].getAttribute("rotate") == "90"){
                                    continue;
                                }
                                else{
                                    zhedie[j].click();
                                }
                            }
                            //先判断正在进行中的视频//iconfont icon_processing_fill进行中
                            var processing = document.getElementsByClassName("iconfont icon_processing_fill")[0]
                            var linear = document.getElementsByClassName("iconfont icon_checkbox_linear")[0]
                            console.log(processing)
                            console.log(linear)
                            if(processing!= null){
                                //console.log('进行中')
                                if(processing.title == '进行中' ){
                                    processing.click()
                                }
                            }
                            if(linear.title == "未开始"){
                                //console.log("下一个视频")
                                linear.click()
                            }
                            //iconfont icon_checkbox_linear未开始
                        }
                    }

                }else{
                    text = jiancetimu.textContent
                }

                if(text == '练习'){
                    console.log("检测到题目")
                    console.log("开始判断题型")

                    var tixing = document.getElementsByClassName("_qti-title-prefix-qtype")[0].innerText
                    if(tixing == '单选题'){
                        console.log("题型为单选题")
                        console.log("开始做题")
                        //选择第一项
                        document.getElementsByClassName("nqti-check")[0].click()
                        setTimeout(danjixiayitianniu(),1000)
                        setTimeout(danjixiayitianniu(),1000)
                    }
                    if(tixing =='多选题'){
                        console.log("题型为多选")
                        console.log("开始做题")
                        //选择第一项
                        document.getElementsByClassName("nqti-check")[0].click()
                        //选择第二项
                        document.getElementsByClassName("nqti-check")[1].click()
                        document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
                        setTimeout(danjixiayitianniu(),1000)
                        setTimeout(danjixiayitianniu(),1000)
                    }

                    if(tixing =='判断题'){
                        console.log("题型为判断")
                        console.log("开始做题")
                        //选择第一项
                        document.getElementsByClassName("nqti-check")[0].click()
                        document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
                        setTimeout(danjixiayitianniu(),1000)
                        setTimeout(danjixiayitianniu(),1000)
                    }
                }
            }else{
                //所有折叠先点一遍
                var zd = document.getElementsByClassName("fishicon fishicon-right fish-collapse-arrow")
                //"fishicon fishicon-right fish-collapse-arrow"折叠按钮
                //rotate="90"展开状态
                for(var l=0;l<zd.length;l++) {
                    if (zd[l].getAttribute("rotate") == "90"){
                        continue;
                    }
                    else{
                        zd[l].click();
                    }
                }
                //点进行中
                var zt = document.querySelectorAll("div.status-icon>i")
                for (var k = 0;k<zt.length;k++){
                    var zhuangtai = zt[k].getAttribute("title")
                    if (zhuangtai == "已学完"){
                        continue;
                    }else if(zhuangtai == "未开始"){
                        zt[k].click();
                        if (document.querySelector('video')!=null){
                        break;}
                    }else if(zhuangtai == "进行中"){
                        if (document.querySelector('video')!=null){
                        break;}
                    }
                };
            };


            function danjixiayitianniu(){
                //单击下一题按钮
                document.querySelector("#root > div > div > div > div > div > div > div.index-module_detail-main_bdFS3 > div.index-module_detail-main-l_1b8KB > div.index-module_video-wrapper_22Dc0 > div > div.index-module_markerExercise_KM5bU > div > div.index-module_footer_3r1Yy > button").click()
            }


            function clickQueDingAnNiu2(){
                // 点击视频播放按钮
                document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0].click()
                //点击静音按钮
                document.querySelector("#vjs_video_1 > div.vjs-control-bar > div.vjs-volume-panel.vjs-control.vjs-volume-panel-horizontal > button > span.vjs-icon-placeholder").click()
            };
            function beisu16() {
                if(document.querySelector('video').playbackRate!=16){
                    document.querySelector('video').playbackRate = 16;
                    new ElegantAlertBox("自动播放速度16倍")
                    console.log("16倍速");
                }}
        };
    };

    //setInterval(checkfen,60000,"5分钟执行一次,查询分数");
    function checkfen(){
        //关闭页面
        if (document.URL == 'https://basic.smartedu.cn/training/2023sdjy') {
            var i = localStorage.getItem('num');
            //第i个学习任务的分数；
            var nt = parseInt(document.querySelector(`#root > div > div > div > div > div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(1) > div:nth-child(${i}) > div > div > div.index-module_process_3RHjg > div:nth-child(3) > span.index-module_processCMy_2HvHz`)
                              .innerText.replace(/[^0-9/.]/ig, ""))
            var st = parseInt(document.querySelector(`#root > div > div > div > div > div.fish-spin-nested-loading.x-edu-nested-loading > div > div:nth-child(1) > div:nth-child(${i}) > div > div > div.index-module_process_3RHjg > div:nth-child(3) > span:nth-child(2)`)
                              .innerText.replace(/[^0-9]/ig, ""))
            if (nt>=st){
                console.log(`已学${nt}，总分${st}，第${i}个学习任务学习完成`);
                localStorage.setItem('studystate','No');
                localStorage.setItem('close', 'Yes');
            }
            setTimeout(() => {
                console.log('刷新页面');
                location.reload([true]);
            }, 2000);
        };
    };

    function closeWin() {
        try {
            //禁用onbeforeunload弹窗
            window.onbeforeunload = null;
            window.opener = window;
            var win = window.open("", "_self");
            console.log("关闭")
            win.close();
            top.close();
        } catch (e) {
            console.log('关闭失败' + e)
        }

    }
    //创建“开始学习”按钮和配置
    function createStartButton() {
        let base = document.createElement("div");
        var baseInfo = "";
        //baseInfo += "<form id=\"settingData\" class=\"egg_menu\" action=\"\" target=\"_blank\" onsubmit=\"return false\"><div class=\"egg_setting_box\"><div class=\"egg_setting_item\"><label>新闻<\/label><input class=\"egg_setting_switch\" type=\"checkbox\" name=\"News\" " + (settings.News ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>视频<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"Video\" " + (settings.Video ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每日答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"ExamPractice\" " + (settings.ExamPractice ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>每周答题<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"ExamWeekly\" " + (settings.ExamWeekly ? 'checked' : '') + "\/>				<\/div>				<div class=\"egg_setting_item\">					<label>专项练习<\/label>					<input class=\"egg_setting_switch\" type=\"checkbox\" name=\"ExamPaper\" " + (settings.ExamPaper ? 'checked' : '') + "\/><\/div><hr \/><div title='Tip:开始学习后，隐藏相关页面和提示（不隐藏答题中的关闭自动答题按钮）' class=\"egg_setting_item\"> <label>运行隐藏<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"ShowMenu\"" + (settings.ShowMenu ? 'checked' : '') + "/></div>" +
        "<div title='Tip:进入学习首页5秒后自动开始学习' class=\"egg_setting_item\"> <label>自动开始<\/label> <input class=\"egg_setting_switch\" type=\"checkbox\" name=\"AutoStart\"" + (settings.AutoStart ? 'checked' : '') + "/></div>"
            +
            "<a style=\"text-decoration: none;\" title=\"视频不自动播放？点此查看解决办法\" target=\"blank\" href=\"https://docs.qq.com/doc/DZllGcGlJUG1qT3Vx\"><div style=\"color:#5F5F5F;font-size:14px;\" class=\"egg_setting_item\"><label style=\"cursor: pointer;\">视频不自动播放?<\/label><\/div><\/a><\/div><\/form>";
        base.innerHTML = baseInfo;
        let body = document.getElementsByTagName("body")[0];
        body.append(base)
        let startButton = document.createElement("button");
        startButton.setAttribute("id", "startButton");
        startButton.innerText = "清除本地缓存";
        startButton.className = "egg_study_btn egg_menu";
        //添加事件监听
        try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
            startButton.addEventListener("click", start, false);
        } catch (e) {
            try {// IE8.0及其以下版本
                startButton.attachEvent('onclick', start);
            } catch (e) {// 早期浏览器
                console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
            }
        }
        //插入节点
        body.append(startButton)

        if (settings.AutoStart) {
            setTimeout(() => {
                if (startButton.innerText === "开始学习") {
                    start()
                }
            }, 5000)
        }
    }

    //保存配置
    function saveSetting() {
        let form = document.getElementById("settingData");
        let formData = new FormData(form);
        settings.News = (formData.get('News') != null);
        settings.Video = (formData.get('Video') != null);
        settings.ExamPractice = (formData.get('ExamPractice') != null);
        settings.ExamWeekly = (formData.get('ExamWeekly') != null);
        settings.ExamPaper = (formData.get('ExamPaper') != null);
        settings.ShowMenu = (formData.get('ShowMenu') != null);//运行时是否要隐藏
        settings.AutoStart = (formData.get('AutoStart') != null);//是否自动启动
        GM_setValue('studySetting', JSON.stringify(settings));
    }

    //初始化配置
    function initSetting() {
        try {
            let settingTemp = JSON.parse(GM_getValue('studySetting'));
            if (settingTemp != null && Object.prototype.toString.call(settingTemp) === '[object Object]') {
                // 增加判断是否为旧数组类型缓存
                settings = settingTemp;
            } else {
                settings = JSON.parse(JSON.stringify(settingsDefault));
            }
        } catch (e) {
            //没有则直接初始化
            settings = JSON.parse(JSON.stringify(settingsDefault));
        }
    }
    //是否显示目录
    function showMenu(isShow = true) {
        let items = document.getElementsByClassName("egg_menu");
        for (let i = 0; i < items.length; i++) {
            items[i].style.display = isShow ? "block" : "none";
        }
    }
    $(document).ready(function () {
        let url = window.location.href;
        if (document.URL.search('2023sqpx') > 1){
            //if (url == "https://gkgp.webtrn.cn/" || url == "https://2019gkgp-tyxl.webtrn.cn/" || url == "https://www.baidu.com/") {
            let ready = setInterval(function () {
                clearInterval(ready);//停止定时器
                //初始化设置
                initSetting();
                //创建"开始学习"按钮
                createStartButton();
            }, 800)}});
    //保存配置
    // Your code here...
    function start() {
        console.log("已清除本地缓存");
        localStorage.clear();
        startButton.innerText = "已清除本地缓存";
    };


    function send_over(){
        var url = `https://www.pushplus.plus/send?token=a2e3a33183b54bdf9a28b2b732355c0f&title=学习完成提醒&content=师德学完了。&template=html`
        var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        httpRequest.open('GET', url, true);//第二步：打开连接  将请求参数写在url中  ps:"http://localhost:8080/rest/xxx"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                console.log(json);
            }
        } }

    // Your code here...
})();