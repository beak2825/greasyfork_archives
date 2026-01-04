// ==UserScript==
// @name         2025.8.1国家智慧教育公共服务平台|职业教育|高等教育|教师能力提升中心|寒暑假教师研修专题|自动答题播放|自动挂机
// @namespace    自动答题
// @license      CC BY-NC-SA
// @version      2025.8.1
// @description  选择课程点进去，全自动操作，只需要选择你要学习的课程即可，会自动播放，自动答题，答题会自动选择第一个，答题对不对不知道（没做题库），反正只会选择第一个。
// @author       ZH-CN(原作者aluyunjie)
// @match        https://core.teacher.vocational.smartedu.cn/p/course/*
// @match        https://teacher.vocational.smartedu.cn/h/subject/summer2024/
// @match        https://teacher.vocational.smartedu.cn/h/subject/summer2025/
// @match        https://teacher.higher.smartedu.cn/h/subject/*
// @icon         https://teacher.vocational.smartedu.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544380/202581%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%7C%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%7C%E6%95%99%E5%B8%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%AD%E5%BF%83%7C%E5%AF%92%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E4%B8%93%E9%A2%98%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544380/202581%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%7C%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%7C%E6%95%99%E5%B8%88%E8%83%BD%E5%8A%9B%E6%8F%90%E5%8D%87%E4%B8%AD%E5%BF%83%7C%E5%AF%92%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E4%B8%93%E9%A2%98%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E6%92%AD%E6%94%BE%7C%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

/* 配置高等教育观看的视频链接 */
var heighterLinks = [
    // 思想铸魂
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629091446784?itemId=726641870617784320&type=1&segId=726641816054083584&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 固本强基
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629116612608?itemId=726641973097213952&type=1&segId=726641920563556352&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 以案促学
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726987629129195520?itemId=726642071551070208&type=1&segId=726642024438136832&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 数字素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030662164480?itemId=742246596144865280&type=1&segId=742246596136476672&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 综合育人能力提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030691524608?itemId=742246596178419712&type=1&segId=742246596170031104&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 科学素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030716690432?itemId=742246596228751360&type=1&segId=742246596216168448&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 培养高校创新性教师队伍
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742239030733467648?itemId=742246596270694400&type=1&segId=742246596258111488&projectId=725191327228612608&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F"
];

/* 配置职业教育观看的视频链接 */
var vocationalLinks = [
    // 思想铸魂
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209004306432?itemId=726640775149465600&type=1&segId=726640509203873792&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 固本强基
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209021083648?itemId=726641217988276224&type=1&segId=726640852905795584&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 以案促学
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_726988209033666560?itemId=726641262505066496&type=1&segId=726640936993202176&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 数字素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772369383424?itemId=742245601297899520&type=1&segId=742245601276928000&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 综合育人能力提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772390354944?itemId=742245601365008384&type=1&segId=742245601344036864&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 科学素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772415520768?itemId=742245601427922944&type=1&segId=742245601411145728&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F",
    // 匠人
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_742238772436492288?itemId=742245601503420416&type=1&segId=742245601486643200&projectId=725189097005613056&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fteaching%2F"
];

/* 配置暑假职业教育研修专题链接 */
var sjvocationalLinks = [
    // 大力弘扬教育家精神
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077161279488?itemId=1003783402737631232&type=1&segId=1003783189381775360&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F&lessonId=1008573110678147085",
    // 数字素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077178056704?itemId=1003783541964902400&type=1&segId=1003783492176969728&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F&lessonId=1008589844227248129",
    // 科学素养提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077190639616?itemId=1003783661561286656&type=1&segId=1003783607545495552&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F&lessonId=1008600430516326401",
    // 心理健康教育能力提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077203222528?itemId=1003783791077199872&type=1&segId=1003783745559068672&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F&lessonId=1008605587547312129",
    // “双师”能力提升
    "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077215805440?itemId=1003783955703631872&type=1&segId=1003783868238266368&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F&lessonId=1010694862317244417",
];

// 暑假学时配置（每个课程需要完成的学时）
var sjstudyTimes = [9, 14, 4, 6, 9,];
// 寒假学时配置
var hjstudyTimes = [9, 3, 3];

// 主函数：自执行函数
(function() {
    'use strict';

    // 获取当前网址
    var currentURL = window.location.href;

    // 判断当前网址是否为2025年暑假职业教育专题
    if (currentURL.includes('https://teacher.vocational.smartedu.cn/h/subject/summer2025/')) {
        createLogBox(); // 创建日志框
        addTextToLogBox("脚本加载成功！");
        addTextToLogBox('职教脚本更新于2025-08-01');
        addTextToLogBox("开始执行");

        // 延迟5秒后执行
        setTimeout(function() {
            let index = 0; // 全局课程索引
            GM_setValue("下标", index); // 保存到油猴存储
            GM_setValue("类别", "职业"); // 标记为职业教育
            openNewWindow(sjvocationalLinks[index]); // 打开第一个课程链接
        }, 5000);
    }

    // 判断当前网址是否为高校教师研修专题
    if (currentURL.includes("https://teacher.higher.smartedu.cn/h/subject/teaching/")) {
        createLogBox();
        addTextToLogBox("脚本加载成功！");
        addTextToLogBox("有bug请反馈：微信：aluyunjiesmile");
        addTextToLogBox('高教研修脚本更新于2023-08-04');
        addTextToLogBox("开始执行");

        setTimeout(function() {
            let index = 0;
            GM_setValue("下标", index);
            GM_setValue("类别", "高校"); // 标记为高等教育
            openNewWindow(heighterLinks[index]);
        }, 5000);
    }

    // 判断当前网址是否为视频播放页面
    if (currentURL.includes("https://core.teacher.vocational.smartedu.cn/p/course/vocational")) {
        createLogBox(); // 创建日志框
        // 每5秒执行一次页面监控和操作
        setInterval(PagePlayingTimer, 5000);
    }
})();

/* 辅助函数 */

// 在新窗口中打开链接
function openNewWindow(url) {
    window.open(url, "_blank");
}

// 检查当前播放视频是否完成（达到100%）
function jugePLayingPagePlayingVideoIsDone() {
    // 获取当前播放视频的完成百分比
    let dangqianshipinbaifenbi = document.getElementsByClassName('video-title clearfix on')[0]
        .getElementsByClassName('four')[0].textContent;

    // 如果当前视频已完成
    if (dangqianshipinbaifenbi === '100%') {
        let length = document.getElementsByClassName('video-title clearfix').length;
        // 遍历所有视频，找到第一个未完成的视频并点击播放
        for (var i = 1; i < length; i++) {
            var four = document.getElementsByClassName('video-title clearfix')[i]
                .getElementsByClassName('four')[0];
            if (four.textContent !== '100%') {
                four.click();
                break; // 找到第一个未完成的视频后退出循环
            }
        }
    }
}

// 检查整个课程页面是否完成并跳转到下一课程
function jugePlayingPageIsDoneAndSwepNextPlayPage() {
    var percentHound = 0; // 已完成视频计数
    var lenth = document.getElementsByClassName('four').length;
    var GMindex = GM_getValue("下标"); // 从存储获取当前课程索引

    // 统计已完成（100%）的视频数量
    for (var i = 0; i < lenth; i++) {
        var text = document.getElementsByClassName('four')[i].textContent;
        if (text === '100%') {
            percentHound++;
        }
    }

    // 获取当前课程要求的学时数
    var studyedtimes = sjstudyTimes[GMindex];

    // 保存统计结果到油猴存储
    GM_setValue("percentHound", percentHound);
    GM_setValue("laststudyedtimes", studyedtimes);

    // 如果已完成视频数达到要求学时
    if (parseInt(percentHound) >= parseInt(studyedtimes)) {
        var GMindex2 = GM_getValue("下标");
        let index = ++GMindex2; // 课程索引+1
        addTextToLogBox(index);
        GM_setValue("下标", index); // 保存新索引

        var leibei = GM_getValue("类别");
        // 根据类别跳转到下一个课程
        if (leibei === "高校") {
            window.location.href = heighterLinks[index];
        } else {
            setTimeout(function() {
                window.location.href = sjvocationalLinks[index];
            }, 500);
        }
    } else {
        addTextToLogBox("当前任务暂未完成课时，等待继续完成");
    }
}

// 创建日志显示框
function createLogBox() {
    var logBox = document.createElement('div');
    logBox.id = 'logBox';
    logBox.style.position = 'fixed';
    logBox.style.bottom = '0';
    logBox.style.left = '0';
    logBox.style.width = '200px';
    logBox.style.height = '200px';
    logBox.style.backgroundColor = 'black';
    logBox.style.color = 'green';
    logBox.style.overflow = 'auto';
    logBox.style.padding = '10px';
    logBox.style.fontFamily = 'Arial, sans-serif';
    logBox.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(logBox);
}

// 向日志框添加文本
function addTextToLogBox(TextLog) {
    var targetDiv = document.getElementById('logBox');
    targetDiv.appendChild(document.createElement('br'));
    var textNode = document.createTextNode(TextLog);
    targetDiv.appendChild(textNode);
    targetDiv.scrollTop = targetDiv.scrollHeight; // 自动滚动到底部
}

// 页面播放定时器（核心功能）
function PagePlayingTimer() {
    // 1. 检查并切换视频
    jugePLayingPagePlayingVideoIsDone();

    // 2. 检查课程完成情况
    jugePlayingPageIsDoneAndSwepNextPlayPage();

    // 3. 检测题目并自动答题
    var shiFouYouTi = document.querySelector("#modal > div > div > div.question-header > div > h4");

    if (shiFouYouTi == null) {
        // 没有检测到题目
        document.querySelector("#video-Player > video").play(); // 播放视频

        // 设置播放速度（1.0倍速）
        var video = document.querySelector("video");
        if (video !== null) {
            video.playbackRate = 1.0;
        }
    } else {
        // 检测到题目
        var text = shiFouYouTi.textContent;
        if (text == '课堂练习') {
            var danXuanDuoXuan = document.querySelector(
                "#modal > div > div > div.question-body > div.question-title > span").textContent;

            // 根据题型自动选择答案
            if (danXuanDuoXuan == '【单选题】' || danXuanDuoXuan == '【是非题】') {
                // 选择第一个选项
                document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(1)").click();
                setTimeout(clickQueDingAnNiu, 1000); // 点击确定按钮
            } else if (danXuanDuoXuan == '【多选题】') {
                // 选择前两个选项
                document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(1)").click();
                document.querySelector("#modal > div > div > div.question-body > ul > li:nth-child(2)").click();
                setTimeout(clickQueDingAnNiu, 1000);
            }
        }
    }

    // 4. 处理可能出现的弹窗确认按钮
    for (var i = 0; i <= 50; i++) {
        var querySelectors = "#layui-layer" + i + " div.layui-layer-btn > a";
        var dianjiqueding = document.querySelector(querySelectors);
        if (dianjiqueding !== null) {
            dianjiqueding.click(); // 点击确认按钮
            setTimeout(playVideodianjianniu, 1500); // 尝试恢复视频播放
        }
    }
}

// 点击答题的确定按钮
function clickQueDingAnNiu() {
    document.querySelector("#submit").click();
}

// 尝试点击视频播放按钮
function playVideodianjianniu() {
    var playButton = document.querySelector("#video-Player > xg-start > div.xgplayer-icon-play");
    if (playButton) {
        playButton.click();
    }
}