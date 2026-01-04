// ==UserScript==
// @name        李硕专刷视频脚本，超星学习通后台挂视频，全网最牛逼的刷视频脚本，可边打游戏边刷课。自动跳转章节，可开启复习模式，倍速播放，超星学习通尔雅，手机电脑均可使用，真正的挂机刷视频。
// @description 超星学习通视频后台挂机，文档自动完成，不得不说李硕真的是泰酷辣，如有问题联系我https://afdian.com/a/zwsssb 最终解释权归李硕所有。😀每日测试，确保脚本100%正常可用。具体测试时间请看详情页介绍😀emm…………………………………………………………………………………我还是希望你们能赞助我一瓶冰阔落，https://afdian.com/a/zwsssb 这个链接就可以赞助给我了，我相信使用这个脚本的都是我的朋友。❤️❤️❤️请看下方使用说明❤️❤️❤️
// @namespace    http://tampermonkey.net/
// @version      1.9.16.24
// @author       李硕
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @icon        https://scriptcat.org/api/v2/resource/image/4SZfPriSlLHYLZDn
// @run-at       document-end
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @connect      api.dbask.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @require https://update.cn-greasyfork.org/scripts/518483/1489109/md5%E5%BA%93-666.js
// @compatible firefox
// @compatible chrome
// @compatible edge
// @compatible Safari
// @compatible Opera
// @compatible Maxthon
// @compatible AdGuard
// @downloadURL https://update.greasyfork.org/scripts/475519/%E6%9D%8E%E7%A1%95%E4%B8%93%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E7%89%9B%E9%80%BC%E7%9A%84%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E8%BE%B9%E6%89%93%E6%B8%B8%E6%88%8F%E8%BE%B9%E5%88%B7%E8%AF%BE%E3%80%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%AB%A0%E8%8A%82%EF%BC%8C%E5%8F%AF%E5%BC%80%E5%90%AF%E5%A4%8D%E4%B9%A0%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%94%E9%9B%85%EF%BC%8C%E6%89%8B%E6%9C%BA%E7%94%B5%E8%84%91%E5%9D%87%E5%8F%AF%E4%BD%BF%E7%94%A8%EF%BC%8C%E7%9C%9F%E6%AD%A3%E7%9A%84%E6%8C%82.user.js
// @updateURL https://update.greasyfork.org/scripts/475519/%E6%9D%8E%E7%A1%95%E4%B8%93%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%90%8E%E5%8F%B0%E6%8C%82%E8%A7%86%E9%A2%91%EF%BC%8C%E5%85%A8%E7%BD%91%E6%9C%80%E7%89%9B%E9%80%BC%E7%9A%84%E5%88%B7%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E8%BE%B9%E6%89%93%E6%B8%B8%E6%88%8F%E8%BE%B9%E5%88%B7%E8%AF%BE%E3%80%82%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%AB%A0%E8%8A%82%EF%BC%8C%E5%8F%AF%E5%BC%80%E5%90%AF%E5%A4%8D%E4%B9%A0%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%EF%BC%8C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%94%E9%9B%85%EF%BC%8C%E6%89%8B%E6%9C%BA%E7%94%B5%E8%84%91%E5%9D%87%E5%8F%AF%E4%BD%BF%E7%94%A8%EF%BC%8C%E7%9C%9F%E6%AD%A3%E7%9A%84%E6%8C%82.meta.js
// ==/UserScript==
// 如果当前页面 URL 包含特定字符串

//点击课程后的弹窗
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------
!!(function(){
    const $w = unsafeWindow,
        $l = $w.location.href,
        $d = $w.document,
        $version = GM_info.script.version.replaceAll('.',''),
        $s = Object.fromEntries(new URLSearchParams($w.location.search)),
        getCookie = name => `; ${document.cookie}`.split(`; ${name}=`).pop().split(';').shift(),
        entrance = () => {
    let classId = encodeURIComponent($s['clazzid'] || $s['classid'] || $s['classId'] || $s['ClassId']),
        courseId = encodeURIComponent($s['courseid'] || $s['courseId']),
        cpi = encodeURIComponent($s['cpi'] || ''),
        courseName = encodeURIComponent($d.title.replace('-首页', ''));

    $w.location.href = 'https://scriptcat.org/zh-CN/script-show-page/2472?classid=' + classId + '&courseid=' + courseId + '&cpi=' + cpi + '&coursename=' + courseName;
};
        $uid = getCookie('UID')||getCookie('_uid'),

        request = (data) => {
            return new Promise((success,fail)=>{
                if(data.method == undefined){
                    data.method = 'get';
                }
                GM_xmlhttpRequest(data);
            });
        }
    if($l.includes('/mycourse/stu?')){
        let $ = $w.jQuery||$w.$,
            popElement = `
            <div class="popDiv course-pop">
                <div class="popHead">
                    <a class="popClose fr" href="javascript:;">
                        <img src="/mooc2-ans/images/popClose.png" class="closecoursepop" style="display: none;">
                    </a>
                    <p class="fl fs18 colorDeep">李硕提示你:该课程可以进行刷视频</p>
                </div>
                <div class="het60"></div>
                <div class="course-content-dialog">
                    <ul class="course-details" tabindex="3" style="overflow: auto visible; outline: none;">
                        <li>
                            <div class="right-box">
                                <div class="text-box">
                                    <p class="text1"> 欢迎使用李硕专刷视频脚本，祝您生活愉快!!!
                                    <div>
                                    <span class="blue-text">如有问题可点击刷视频界面或者学习通个人空间主页里的“遇到问题点击“ 按钮  </div>
                                    </p>
                                    <div>
                                    <span class="blue-text">💕💕我的好朋友们，让我们一起加油吧！！！ ❤️❤️</div>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div style="height: 70px;"></div>
                    <div class="bottom-div" style="">
                        <div class="start-study" id="fuckme">开始刷课</div>
                        &ensp;&ensp;&ensp;
                        <div class="start-study" id="fuckyou">取消</div>
                    </div>
                </div>
            </div>`;
        setTimeout(()=>{
            $(".coursenoticepop").empty();
            $(".coursenoticepop").html(popElement);
            $("#fuckme").click(function(){
                entrance($w.ServerHost.mooc1Domain.replace('https://','http://'))
            });
            $("#fuckyou").click(()=>{
                $(".closecoursepop").hide();
                $(".coursenoticepop").hide();
            });
            $(".closecoursepop").show();
            $(".coursenoticepop").show();
        },1000);
    }

})();

//////////////////////////////////////////////
(function() {
    "use strict";

    // 等待页面加载完成
    window.addEventListener("load", function() {
        // 查找 .course-tab 元素
        var courseTab = document.querySelector(".course-tab");
        if (courseTab) {
            // 查找 .current 类的所有子元素
            var currentItems = courseTab.querySelectorAll(".current");
            for (var i = 0; i < currentItems.length; i++) {
                // 替换文本内容
                currentItems[i].textContent = "我的好朋友们，欢迎使用李硕专刷视频脚本！使用前请仔细阅读油叉上的使用说明，遇到问题在爱发电联系我，祝您使用愉快！！！";
            }
        }

        // 查找 #siteName 元素
        var siteName = document.getElementById("siteName");
        if (siteName) {
            // 替换标题内容
            siteName.textContent = "李硕刷视频专版";
            siteName.title = "李硕刷视频专版";
        }

        // 查找 .appCode 元素
        var appCode = document.querySelector(".appCode");
        if (appCode) {
            // 替换文本内容
            appCode.textContent = "牛不牛逼就完了";
        }

        // 获取原始的添加课程按钮
        var originalAddCourseButton = document.getElementById("addCourse");
        if (originalAddCourseButton) {
            // 创建三个新的添加课程按钮
            var newButtons = [
                { text: "开始刷视频", url: "https://scriptcat.org/zh-CN/script-show-page/2472" },
                { text: "遇到问题点击", url: "https://afdian.com/item/3a3565f08f5611ee93c352540025c377" },
            ];

            for (var i = 0; i < newButtons.length; i++) {
                var newAddCourseButton = originalAddCourseButton.cloneNode(true);
                newAddCourseButton.id = `addCourse${i + 1}`; // 为每个新按钮设置唯一的ID
                newAddCourseButton.querySelector("i").nextSibling.textContent = newButtons[i].text; // 替换按钮文本
                newAddCourseButton.href = newButtons[i].url; // 设置跳转链接

                // 删除按钮中的  元素
                var imgElement = newAddCourseButton.querySelector("i img");
                if (imgElement) {
                    imgElement.parentNode.removeChild(imgElement);
                }

                // 如果是“开始刷视频”按钮，将字体颜色改为红色
                if (newButtons[i].text === "开始刷视频") {
                    newAddCourseButton.style.color = "red";
                }

                originalAddCourseButton.parentNode.insertBefore(newAddCourseButton, originalAddCourseButton.nextSibling);
            }
        }

        // 查找并修改“新建文件夹”按钮
        var addFolderButton = document.getElementById("addFolder");
        if (addFolderButton) {
            // 修改按钮文本
            addFolderButton.textContent = "领个支付宝红包";
            // 设置字体颜色为金色
            addFolderButton.style.color = "gold";
            // 设置跳转链接
            addFolderButton.href = "https://scriptcat.org/api/v2/resource/image/DPLuoDj47JY16LuM";
        }
    });
})();
//////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
//
//
//
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//点击课程后的弹窗
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------



        let newMods, tip, defaults, name;
        switch(getAutoSwitch()) {
            case 1:
                tip = '自定义 [模式 1]，修改后立即生效 (部分网页可能需要刷新)~\n格式：亮度 (白天)|亮度 (晚上)\n默认：60|50（均为百分比 1~100，不需要 % 符号）';
                defaults = '60|50';
                name = 'menu_customMode1';
                break;
            case 2:
                tip = '自定义 [模式 2]，修改后立即生效 (部分网页可能需要刷新)~\n格式：亮度 (白天)|暖色 (白天)|亮度 (晚上)|暖色 (晚上)\n默认：60|40|50|50（均为百分比 1~100，不需要 % 符号）';
                defaults = '60|40|50|50';
                name = 'menu_customMode2';
                break;
            case 3:
                tip = '自定义 [模式 3]，修改后立即生效 (部分网页可能需要刷新)~\n格式：反色\n默认：90（均为百分比 50~100，不需要 % 符号）';
                defaults = '90';
                name = 'menu_customMode3';
                break;
        }
function appendCss(url) {
        $('head').append($('<link rel="stylesheet" href="' + url + '">'));
    }



// 在页面加载时立即应用背景图片
document.body.style.backgroundImage = 'url("https://scriptcat.org/api/v2/resource/image/mvmaHF1KJphl1yiY")';
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';
document.body.style.backgroundRepeat = 'no-repeat';

// 然后继续初始化页面结构
document.body.innerHTML = '<div><div class="layui-row layui-col-space15"><div class="layui-col-md6 layui-col-md-offset3"><div style="padding:50px;border-radius:20px" class="layui-panel" id="app"></div></div></div></div>';

// ... 后续的代码 ...
        //
        //
        //
        //那个框的背景图片在那个url后面的括号里面
     document.body.innerHTML = `<div><div class="layui-row layui-col-space15"><div class="layui-col-md6 layui-col-md-offset3"><div style="padding:50px; border-radius:20px; background-image: url(https://ts1.cn.mm.bing.net/th/id/R-C.d55bcddfc476e85bcf65631436718314?rik=Meu4ijf67mEuyw&riu=http%3a%2f%2fimg.pptjia.com%2fimage%2f20181101%2f5f785ad0634638e7c36fb25d9d69edf2.jpg&ehk=R1YFyFLvb79iDfSyDb7QbY%2b4wFU0kEZKuBuuVrd%2fxJ0%3d&risl=&pid=ImgRaw&r=0); background-size: cover; background-position: center;" class="layui-panel" id="app"></div> </div></div></div>`;
        //
(function() {
    "use strict";

    // 检查是否启用了脚本
    function isScriptEnabled() {
        return localStorage.getItem("scriptEnabled") === "0";
    }

    // 启用或禁用脚本
    function toggleScriptEnabled() {
        var enabled = !isScriptEnabled();
        localStorage.setItem("scriptEnabled", enabled ? "1" : "0");
        if (enabled) {
            startScript();
        } else {
            stopScript();
        }
    }

    // 开始脚本
    function startScript() {
        console.log("脚本已启用");

        // 定义一个函数来自动播放视频
        function autoPlayVideos() {
            // 查找所有的视频元素
            var videos = document.querySelectorAll("video");
            for (var i = 0; i < videos.length; i++) {
                // 如果视频没有播放，就播放它
                if (videos[i].paused && !videos[i].ended) {
                    videos[i].play();
                }
            }
        }

        // 每隔5秒检查一次并自动播放视频
        setInterval(autoPlayVideos, 5000);

        // 初始调用一次以确保立即开始播放
        autoPlayVideos();

        // 定义一个函数来自动跳过广告
        function skipAds() {
            // 查找所有的广告跳过按钮
            var skipButtons = document.querySelectorAll(".ad-skip-button");
            for (var i = 0; i < skipButtons.length; i++) {
                // 如果广告跳过按钮存在且可点击，就点击它
                if (skipButtons[i] && !skipButtons[i].disabled) {
                    skipButtons[i].click();
                }
            }
        }

        // 每隔1秒检查一次并自动跳过广告
        setInterval(skipAds, 1000);

        // 定义一个函数来自动完成测验
        function autoCompleteQuizzes() {
            // 查找所有的测验题目
            var quizQuestions = document.querySelectorAll(".quiz-question");
            for (var i = 0; i < quizQuestions.length; i++) {
                // 查找每个题目的答案选项
                var options = quizQuestions[i].querySelectorAll(".quiz-option");
                for (var j = 0; j < options.length; j++) {
                    // 随机选择一个答案
                    var randomIndex = Math.floor(Math.random() * options.length);
                    options[randomIndex].click();
                }
            }

            // 查找提交按钮
            var submitButton = document.querySelector(".quiz-submit-button");
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
            }
        }

        // 每隔10秒检查一次并自动完成测验
        setInterval(autoCompleteQuizzes, 10000);

        // 定义一个函数来自动提交作业
        function autoSubmitAssignments() {
            // 查找所有的作业提交按钮
            var submitButtons = document.querySelectorAll(".assignment-submit-button");
            for (var i = 0; i < submitButtons.length; i++) {
                // 如果提交按钮存在且可点击，就点击它
                if (submitButtons[i] && !submitButtons[i].disabled) {
                    submitButtons[i].click();
                }
            }
        }

        // 每隔15秒检查一次并自动提交作业
        setInterval(autoSubmitAssignments, 15000);

        // 定义一个函数来自动点击继续按钮
        function autoClickContinue() {
            // 查找所有的继续按钮
            var continueButtons = document.querySelectorAll(".continue-button");
            for (var i = 0; i < continueButtons.length; i++) {
                // 如果继续按钮存在且可点击，就点击它
                if (continueButtons[i] && !continueButtons[i].disabled) {
                    continueButtons[i].click();
                }
            }
        }

        // 每隔20秒检查一次并自动点击继续按钮
        setInterval(autoClickContinue, 20000);
    }

    // 停止脚本
    function stopScript() {
        console.log("脚本已禁用");
        // 清除所有定时器
        clearInterval(autoPlayVideosInterval);
        clearInterval(skipAdsInterval);
        clearInterval(autoCompleteQuizzesInterval);
        clearInterval(autoSubmitAssignmentsInterval);
        clearInterval(autoClickContinueInterval);
    }

    // 初始化脚本
    function initScript() {
        if (isScriptEnabled()) {
            startScript();
        } else {
            stopScript();
        }
    }

    // 等待页面加载完成
    window.addEventListener("load", function() {
        initScript();
    });

    // 用于存储定时器的变量
    var autoPlayVideosInterval;
    var skipAdsInterval;
    var autoCompleteQuizzesInterval;
    var autoSubmitAssignmentsInterval;
    var autoClickContinueInterval;

    // 重新定义定时器变量
    function autoPlayVideos() {
        // 查找所有的视频元素
        var videos = document.querySelectorAll("video");
        for (var i = 0; i < videos.length; i++) {
            // 如果视频没有播放，就播放它
            if (videos[i].paused && !videos[i].ended) {
                videos[i].play();
            }
        }
    }

    function skipAds() {
        // 查找所有的广告跳过按钮
        var skipButtons = document.querySelectorAll(".ad-skip-button");
        for (var i = 0; i < skipButtons.length; i++) {
            // 如果广告跳过按钮存在且可点击，就点击它
            if (skipButtons[i] && !skipButtons[i].disabled) {
                skipButtons[i].click();
            }
        }
    }

    function autoCompleteQuizzes() {
        // 查找所有的测验题目
        var quizQuestions = document.querySelectorAll(".quiz-question");
        for (var i = 0; i < quizQuestions.length; i++) {
            // 查找每个题目的答案选项
            var options = quizQuestions[i].querySelectorAll(".quiz-option");
            for (var j = 0; j < options.length; j++) {
                // 随机选择一个答案
                var randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].click();
            }
        }

        // 查找提交按钮
        var submitButton = document.querySelector(".quiz-submit-button");
        if (submitButton && !submitButton.disabled) {
            submitButton.click();
        }
    }

    function autoSubmitAssignments() {
        // 查找所有的作业提交按钮
        var submitButtons = document.querySelectorAll(".assignment-submit-button");
        for (var i = 0; i < submitButtons.length; i++) {
            // 如果提交按钮存在且可点击，就点击它
            if (submitButtons[i] && !submitButtons[i].disabled) {
                submitButtons[i].click();
            }
        }
    }

    function autoClickContinue() {
        // 查找所有的继续按钮
        var continueButtons = document.querySelectorAll(".continue-button");
        for (var i = 0; i < continueButtons.length; i++) {
            // 如果继续按钮存在且可点击，就点击它
            if (continueButtons[i] && !continueButtons[i].disabled) {
                continueButtons[i].click();
            }
        }
    }

    // 重新定义定时器
    function startScript() {
        console.log("脚本已启用");

        autoPlayVideosInterval = setInterval(autoPlayVideos, 5000);
        skipAdsInterval = setInterval(skipAds, 1000);
        autoCompleteQuizzesInterval = setInterval(autoCompleteQuizzes, 10000);
        autoSubmitAssignmentsInterval = setInterval(autoSubmitAssignments, 15000);
        autoClickContinueInterval = setInterval(autoClickContinue, 20000);

        // 
        autoPlayVideos();
    }

    // 停止脚本
    function stopScript() {
        console.log("脚本已禁用");
        clearInterval(autoPlayVideosInterval);
        clearInterval(skipAdsInterval);
        clearInterval(autoCompleteQuizzesInterval);
        clearInterval(autoSubmitAssignmentsInterval);
        clearInterval(autoClickContinueInterval);
    }

    // 初始化脚
    function initScript() {
        if (isScriptEnabled()) {
            startScript();
        } else {
            stopScript();
        }
    }

    // 等待页面加载完成
    window.addEventListener("load", function() {
        initScript();
    });
})();