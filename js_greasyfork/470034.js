// ==UserScript==
// @name         2022年度国培计划“中小学幼儿园骨干教师信息化教学创新能力提升培训”
// @namespace    挂机刷课
// @version      0.1.0
// @description  进入研修专题，然后选择到你要看课的网址，直接点进去就行，会自动开始刷课和挂机。
// @author       Hunter_Quan
// @match        https://gkgp.webtrn.cn/entity/commonIndex/*
// @match        https://gkgp.webtrn.cn/*
// @match        https://2019gkgp-tyxl.webtrn.cn/learnspace/learn/learn/*
// @icon         https://gkgp.webtrn.cn/npapi/incoming/public/2019gkgp/studioLogo.png
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470034/2022%E5%B9%B4%E5%BA%A6%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%E2%80%9C%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E9%AA%A8%E5%B9%B2%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E5%8C%96%E6%95%99%E5%AD%A6%E5%88%9B%E6%96%B0%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%E2%80%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/470034/2022%E5%B9%B4%E5%BA%A6%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%E2%80%9C%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E9%AA%A8%E5%B9%B2%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E5%8C%96%E6%95%99%E5%AD%A6%E5%88%9B%E6%96%B0%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E5%9F%B9%E8%AE%AD%E2%80%9D.meta.js
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
    window.onbeforeunload = null;
    function sleep(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    };

    setInterval(checkfen,15000,"1分钟执行一次,查询分数");
    function checkfen(){
        //查询分数自动学习
        var promise = sleep(3000); // 等待3秒钟
        if (document.URL.search('commonIndex') > 1) {
            //点击课程学习，刷新学分
            console.log('点击课程学习，刷新...');
            document.querySelector("#maincontent > div.gp-ind-left.gp-pull-left > div.gp-list.gp-box.gp-mt > ul:nth-child(7) > li:nth-child(1) > a").click();
            //100%  document.querySelector("#div_classlist_8a85829a889412a70188fbb79c7f4e81 > ul > li:nth-child(1) > div.gp-classW3.gp-pull-left")
            //100%  document.querySelector("#div_classlist_8a85829a889412a70188fbb79c7f4e81 > ul > li:nth-child(2) > div.gp-classW3.gp-pull-left")
            //100%  document.querySelector("#div_classlist_8a85829a889412a70188fbb7a10f4f35 > ul > li:nth-child(1) > div.gp-classW3.gp-pull-left")
            //document.querySelector("#div_classlist_8a85829a889412a70188fbb79c7f4e81")
            //document.querySelector("#courseContent > div(1) ")
            promise.then(learn);
        };
    };
    function learn(){
        console.log('获取状态中...');
        //进度条
        var process = document.querySelectorAll("#courseContent > div>ul>li>div.gp-classW3");
        console.log(process);
        //课程开始学习按钮列表
        var startlist = document.querySelectorAll("#courseContent > div>ul>li>div.gp-classW5>a");
        console.log(startlist);
        //获取学习状态
        var state = localStorage.getItem('studystate')
        console.log('state:'+state);
        if(state == 'Yes'){
            //检查正在学习的可成是否达到100%
            //获取正在学习第几个
            var n = localStorage.getItem('num');
            console.log(`正在学习第${Number(n)+1}个。`);
            //如果100%，就点击下一个;
            var p = process[n].innerHTML;
            console.log(`第${Number(n)+1}个学习进度为：${p}。`);
            if (p =='100.0%'){
                if (n >= Number(process.length)-1){
                    console.log('所有学习完成，结束学习！')
                    send_over();
                };
                console.log(`${Number(n)+1}个学习完成，现在学习第${Number(n)+2}个。`);
                localStorage.setItem('studystate', 'Yes');
                localStorage.setItem('num', Number(n)+1);
                startlist[Number(n)+1].click();
            };
        }else{
            //点击开始学习
            for(var key of process.keys()){
                var pr = process[key].innerHTML;
                if (pr !='100.0%'){
                    console.log(`正在学习第${Number(key)+1}个。`);
                    localStorage.setItem('studystate', 'Yes');
                    localStorage.setItem('num', key);
                    startlist[key].click();
                    break;
                };
            };
            //通常不会走到这里，除非已经学完了
            console.log('所有学习完成，结束学习！')
            send_over();
        };
    };

    setInterval(xuexiyemian,180000,"3分钟执行一次,刷新网页");

    function xuexiyemian(){
        //关闭页面
        if (document.URL.search('learnspace') > 1) {
            console.log('刷新页面');
            location.reload([true]);
            /*
                if (localStorage.getItem('close')=='Y'){
                    localStorage.setItem('studystate','N');
                    console.log('学习完成');
                    closeWin();
                };
                */
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
        if (document.URL.search('commonIndex') > 1){
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

    function waitRandomBetween(minSecond = 2, MaxSecond = 5) {
        if (MaxSecond <= minSecond) {
            MaxSecond = minSecond + 3
        }

        let waitTime = Math.floor(Math.random() * (MaxSecond * 1000 - minSecond * 1000) + minSecond * 1000)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`随机等待${waitTime / 1000}秒`)
                resolve()
            }, waitTime)
        })
    }
    function send_over(){
        var url = `https://www.pushplus.plus/send?token=a2e3a33183b54bdf9a28b2b732355c0f&title=学习完成提醒&content=国培学完了。&template=html`
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