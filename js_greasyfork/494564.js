// ==UserScript==
// @name        四川学法考试自动学习
// @namespace   www
// @match       *xxpt.scxfks.com/*
// @grant       none
// @version     1.4
// @author      2222
// @description 自动完成文本阅读，视频观看
// @downloadURL https://update.greasyfork.org/scripts/494564/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/494564/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

var pathname = window.location.pathname;

function sleep(timeOutMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeOutMs);
    });
}

(async function(){

    //弹出页面自动点击
    var temp = setInterval(function () {
        var know = document.getElementById('know');
        if (know != null){
            if (know.offsetParent != null){//判断div是否显示
                know.click();
                document.querySelector('#yes').click();
                clearInterval(temp);
            }
        }
    }, 1000);

    //首页
    if (pathname.includes('index')) {
        //进入课程推荐页面
        console.log('进入课程推荐页面');
        window.location.replace('http://xxpt.scxfks.com/study/courses/require');
        await sleep(1 * 1000);
    }

    if (pathname.includes('require')) {
        //进入课程页面
        console.log('进入课程页面');
        var cou = '';
        let courses = document.querySelectorAll('td>a');
        console.log('获取课程成功');
        if (courses) {
            courses = Array.from(courses);
            for (let i = 0; i < courses.length - 1; ++i) {
                let course = courses[i];
                cou=course.text;
                if(cou=='继续学习'){
                    console.log('继续学习');
                    await sleep(1 * 1000);
                    course.click();
                    break;
                }
                if(cou=='开始学习'){
                    console.log('开始学习');
                    await sleep(1 * 1000);
                    course.click();
                    break;
                }
            }
        }
    }

    if (pathname.includes('course')) {
        //进入课程内容页面
        console.log('进入课程内容页面');
        let nextCourseBtn = document.querySelectorAll('td.title>div:nth-child(2)');
        console.log('获取课程内容成功');
        for (let i = 0; i < nextCourseBtn.length - 1; ++i) {

            if(nextCourseBtn[i].innerText.search('学分') == -1){
                console.log('进入学习页面');
                await sleep(1 * 1000);
                nextCourseBtn[i].click();
                break;
            }
        }
    }

    if (pathname.includes('chapter')) {
        //进入学习页面
        console.log('进入学习页面成功');

        var tmp = setInterval(function () {
            var video = document.querySelector('video');
            if (video != null){
                if (video.paused = true){
                    video.play();
                    video.muted = true;
                }
            }
            var temp1 = document.querySelector('.chapter-score.chapter-score-suc');
            if(temp1 != null){
                if (temp1.innerText.search('分')>0){
                    var temp2 = document.querySelector('.next_chapter');
                    if(temp2 == null){
                        window.location.replace('http://xxpt.scxfks.com/study/index');
                    } else {
                        temp2.click();
                    }
                }
            }
            var temp3 = document.querySelector('.chapter-score.limit');
            if(temp3 != null){
                if (temp3.innerText.search('上限')>0){
                    clearInterval(tmp);
                    clearInterval(temp);
                    window.alert('每日最多学习5分，您已到达今日上限！\n\n 请关闭当前页面！');
                    //window.close();
                }
            }
        }, 2000);

    }


}

)();