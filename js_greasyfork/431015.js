// ==UserScript==
// @name         autoplay
// @namespace    http://tampermonkey.net/
// @version      0.1.6.3
// @description  ischinese
// @author       qiu6406,guaxiangdeba
// @match        https://ischinese.cn/*
// @match        https://hn.ischinese.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @icon         https://www.google.com/s2/favicons?domain=ischinese.cn
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/431015/autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/431015/autoplay.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var sections = document.getElementsByClassName("sectionNum");
    var items = document.getElementsByClassName("buyCourse_itemMain")
    var cursec = 0;
    var txt;
    var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
    GM_addStyle(study_css);

    //页面判断
    function checkUrl() {
        if (window.location.href.indexOf('play') > 0) {
            return 1;
        } else if (window.location.href.indexOf('buycourse') > 0) {
            return 2;
        } else {
            return -1;
        }

    }

    //获取课程位置并跳转
    function getPlayItem() {
        var pg = new RegExp("\\d*%","g");
        for (var i = 0; i < items.length; i++) {
            if(pg.exec(items[i].innerText) != '100%'){
                items[i].getElementsByClassName('buyCourse_classStudy')[0].click();
                break;
            }
            else{
                //公共科目学习完毕,切换到专业科目
                console.log('专业科目课程列表');
                document.getElementsByClassName('cur')[0].firstChild.click();
                break;
            }
        }
    }

    //获取当前播放位置
    function getCurSec() {
        for (var i = 0; i < sections.length; i++) {
            if (sections[i].parentNode.className == "active") {
                cursec = i;
            }
        }
    }

    //自动播放执行
    function check() {
        var video = document.getElementsByTagName("video")[0];
        getCurSec();
        if (video.currentTime == video.duration) {
            console.log("播放下一节");
            cursec = cursec + 1;
            if (cursec == sections.length) {
                if(document.getElementsByClassName("progress")[0].innerText.split('\n')[1] == '100%'){
                    console.log('学习完毕！');
                    document.getElementsByClassName('nav-list')[3].click();//返回学习中心
                }
                else {
                    console.log('学习进度不足100%，重新学习小节');
                    video.currentTime = 0;//学习进度不到100%，重新学习
                }
            }
            sections[cursec].click();
        }
        else {
            if (video.paused) {
                video.play();
            }
            if(document.getElementsByClassName("el-message-box__wrapper")[0].style.display == 'none') document.getElementsByClassName("el-button el-button--default el-button--small el-button--primary ")[0].click();
            console.log('播放中第' + (cursec + 1) + '节:' + video.currentTime / video.duration * 100 + '%')
        }
    }

    function init() {
        switch (checkUrl()) {
            case -1:
                console.log("未找到正确页面");
                alert("请进入到学习页面！");
                break;
            case 1:
                check();
                break;
            case 2:
                console.log('课程页面');
                getPlayItem();
                break;
        }
    }


    var button = document.createElement("button"); //创建一个提示框按钮
    button.id = "id001";
    button.textContent = "开始学习";
    button.className = "egg_study_btn egg_menu";
    button.onclick = function (){
         console.log('点击了按键');
         if ( button.textContent == "开始学习" ) {
            window.interval = setInterval(init, 10000);
            button.textContent = "正在自动学习！";
         } else {
            clearInterval(window.interval);//停止
            button.textContent = "开始学习";
        }
    }

    var x = document.getElementsByTagName("body")[0];
    x.append(button);

})();