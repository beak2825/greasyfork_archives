// ==UserScript==
// @name         教师研修社区::study.yanxiu.jsyxsq.com
// @namespace    cosilc::study.yanxiu.jsyxsq.com
// @version      221216.01
// @description  教师研修社区刷课
// @author       Cosil.C
// @match        *://*.study.yanxiu.jsyxsq.com/proj/studentwork/course_list_new*
// @match        *://*.study.yanxiu.jsyxsq.com/proj/studentwork/study*
// @match        *://*.study.yanxiu.jsyxsq.com/proj/studentwork/courseListNew*
// @icon         http://jsyxsq.com/favicon.ico
// @require      https://greasyfork.org/scripts/430297-qos-handler/code/QOS-Handler.js
// @grant        unsafeWindow
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456655/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A4%BE%E5%8C%BA%3A%3Astudyyanxiujsyxsqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/456655/%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%A4%BE%E5%8C%BA%3A%3Astudyyanxiujsyxsqcom.meta.js
// ==/UserScript==

/**
 * 流控
 */
if (qos.record()) {
    let timeout = new Date().getTime() + 300000;
    let reloadInterval = setInterval(() => {
        let secLeft = Math.floor((timeout - new Date().getTime()) / 1000);
        if (secLeft >= 0) {
            console.log('secLeft:', secLeft);
        } else {
            qos.clearRecord();
            clearInterval(reloadInterval)
            location.reload();
        }
    }, 1000);
    return;
}

init();


function init() {
    if (window.location.pathname.includes('/proj/studentwork/course_list_new') || window.location.pathname.includes('/proj/studentwork/courseListNew')) {
        //课程学习页
        console.log('执行课程学习页脚本');
        handleCourseList();
    } else if (window.location.pathname.includes('/proj/studentwork/study.htm')) {
        //视频页
        console.log('执行视频页脚本');
        handleCourseStudy();
    }
}

/**
 * 课程学习页:跳页，进入视频学习
 */
function handleCourseList() {
    let courseStatus = JSON.parse(localStorage.getItem(getCourseStatusKey())) || {};
    let loadingWatcher = setInterval(() => {
        if (document.querySelector('.page_label_check.current') && unsafeWindow.goStudy != null) {
            clearInterval(loadingWatcher);
            unsafeWindow.eval(unsafeWindow.goStudy.toString().replaceAll('window\.open', 'window.location.replace'));
            console.log(`当页为第${document.querySelector('.page_label_check.current').innerText}页`)
            let target = Array.from(document.querySelectorAll('.kcxx_side_title'))
                .filter(ele => {//筛出未完成
                    let title = ele.querySelector('p.kcal_title').title,
                        fulltime = parseInt(ele.querySelector('.xk_rs.clear').innerText.replace('已学习', '')) * 60;
                    // console.log(title, fulltime, courseStatus[title], courseStatus[title] ? courseStatus[title] > fulltime : true)
                    return courseStatus[title] ? courseStatus[title] > fulltime : true;
                }).shift();
            if (target) {
                target.querySelector('a').click();
            } else {
                console.log('该页的课程学习部分已完成');
                if ($('a:contains(\'下一页\')').length) {
                    console.log('正在跳转下一页');
                    $('a:contains(\'下一页\')').click();
                    setTimeout(() => {
                        handleCourseList();
                    }, 1000);
                } else {
                    unsafeWindow.location.href = $(`a:contains(查看成绩)`).attr('href');
                }
            }
        }
    }, 1000)
}


/**
 * 视频页:执行视频学习
 */
function handleCourseStudy() {
    let needTime = /\d+/.exec($('.introduce_list:contains(\'课程时长\')').text())[0] * 60,
        logTime = function (tag) {
            tag = tag ? `(${tag})` : '';
            console.log('needTime:', sec2HHmmss(needTime));
            console.log(`randomTime${tag}:`, sec2HHmmss(randomTime));
            console.log(`fullTime${tag}:`, sec2HHmmss(getFullTime()));
        };
    console.group();
    logTime('first');
    console.groupEnd();
    unsafeWindow.alert = unsafeWindow.confirm = function (msg) {
        console.group();
        console.log('msg:', msg);
        logTime('before');
        console.groupEnd();
        return true;
    }
    document.querySelector('input#leiji').onchange = function () {
        console.group();
        logTime('cur');
        console.groupEnd();
    }
    //清空视频
    setInterval(() => {
        console.log('检测到视频iframe，正在移除')
        document.querySelector('iframe')?.remove();
    }, 1000);
    //累计学习时间监测
    let fullTimeWatcher = setInterval(() => {
        if (getFullTime() >= needTime) {
            clearInterval(fullTimeWatcher);
            console.log('学习完毕准备退回学习中心');
            //更新记录
            console.log(getCourseStatusKey());
            let courseStatus = JSON.parse(localStorage.getItem(getCourseStatusKey())) || {};
            console.log(courseStatus)
            //键值对：(课程名, 课程时长) 
            courseStatus[document.querySelector(`.fl`).innerText.replace('正在播放：', '').trim()] = needTime;
            localStorage.setItem(getCourseStatusKey(), JSON.stringify(courseStatus));
            //退出
            document.querySelector('#exit_study_btn')?.click();
            return;
        }
        let left = Math.ceil((needTime - getFullTime()) / 60) * 60 + 60;
        if ((left <= 1200 && randomTime != left) || (left > 1200 && randomTime != 600)) {
            console.log('randomTime调整为:', randomTime = left <= 1200 ? left : 600, sec2HHmmss(randomTime));
        }
    }, 1000);

    /**
     * @param sec 秒数
     * @returns HHmmss格式字符串，小时为00时不显示
     */
    function sec2HHmmss(sec) {
        if (isNaN(parseInt(sec))) {
            return null
        }
        let s = sec % 60, m = (sec - s) / 60, h = sec - sec % 3600,
            format = val => ('00' + val).slice(-2);
        return (h ? format(h) + ':' : '') + format(m) + ':' + format(s);
    }
    /**
     * @returns 获取累计学习时间
     */
    function getFullTime() {
        let fullTime = parseInt(form2.leiji.value);
        return isNaN(fullTime) ? 0 : fullTime;
    }
}

function getCourseStatusKey() {
    //清除缓存
    let prifix = 'courseStatus::',
        userName = document.querySelector(`.state.fr a`).innerText.trim();
    Object.keys(localStorage).forEach(key => { if (key.includes(prifix) && !key.includes(userName)) localStorage.removeItem(key) });
    //返回 prifix+用户名
    return prifix + userName;
}
