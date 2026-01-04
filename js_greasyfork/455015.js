// ==UserScript==
// @name         南京市专技人员继续教育平台&专业课平台
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  实现自动刷课时，登录后无需任何操作
// @author       yuanye2416@126.com
// @match        http://180.101.236.114:8283/rsrczxpx/hyper/courseDetail*
// @match        http://180.101.236.114:8283/rsrczxpx/auc/myCourse*
// @match        http://180.101.236.114:8283/rsrczxpx/tec/play/player*
// @match        https://m.mynj.cn:11096/njwsbs/index.do?method=login
// @match        https://m.mynj.cn:11188/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455015/%E5%8D%97%E4%BA%AC%E5%B8%82%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455015/%E5%8D%97%E4%BA%AC%E5%B8%82%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%B8%93%E4%B8%9A%E8%AF%BE%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==


(function () {
    // ========================URL===================
    // 登录页面-https://rs.jshrss.jiangsu.gov.cn/web/login?appId=202107150001&returnUrl=https%3A%2F%2Fm.mynj.cn%3A11097%2Fplateform%2FrediectIndex%2Fgoods
    const loginPage = "https://rs.jshrss.jiangsu.gov.cn/web/login?appId=202107150001&returnUrl=https%3A%2F%2Fm.mynj.cn%3A11097%2Fplateform%2FrediectIndex%2Fgoods";
    // 公共服务页面-https://m.mynj.cn:11096/njwsbs/index.do?method=login，需要保持登录状态，定时刷新
    const njwsbs = "https://m.mynj.cn:11096/njwsbs/index.do?method=login";
    // =========1.专技人员继续教育平台：https://m.mynj.cn:11096/njwsbs/index.do?method=toZjjxjy============
    const myCouseUrl = "https://m.mynj.cn:11188/zxpx/auc/myCourse"; // 我的课程页面，获取课程列表，此页面开始刷课
    const courseDetail = "https://m.mynj.cn:11188/zxpx/hyper/courseDetail?ocid="; // 课程详情页面，ocid=OC202205230000005728
    const playerPage = "https://m.mynj.cn:11188/zxpx/tec/play/player";
    // =========2.继续教育专业课学习平台========================================================================================
    // 继续教育专业课学习平台-https://m.mynj.cn:11096/njwsbs/index.do?method=toRsrcXx
    const rsrczxpxMycourse = "http://180.101.236.114:8283/rsrczxpx/auc/myCourse"
    const rsrczxpxCoursedetail = "http://180.101.236.114:8283/rsrczxpx/hyper/courseDetail"
    const rsrczxpxPlayer = "http://180.101.236.114:8283/rsrczxpx/tec/play/player"
    // ========================URL===================

    // ==================初始化设置====================
    // 保存最新访问下列页面的时间，用来确定当前是否打开该标签页
    // courseOnPlayingPage: 播放课程视频页面
    // myCoursePage:我的课程页面
    // courseDetailPage:课程详情页面
    // njwsbsPage:智慧人社个人中心页面
    // courseList:我的课程列表
    // ==================初始化设置====================

    $(document).ready(function () {
        // 判断所在页面
        if (window.location.href.indexOf(njwsbs) !== -1) {
            // window.alert("公共服务-选择学习平台页面");
            // 获取当前最新时间，并保存最新访问该页面的时间状态
            setInterval(function () {
                let currentTime = Date.now();
                GM_setValue("njwsbsPage", currentTime);
            }, 5000)
            // 1000s自动刷新一次页面
            displayModal('提示', '正在自动播放课程，请不要关闭当前页面。正在自动刷新页面保持登录状态，刷新倒计时：', '@', 600);
            setInterval(function () {
                location.reload();
            }, 600000);
        }
        // 我的课程页面, 10*60*1000ms刷新一次
        if (window.location.href.indexOf(myCouseUrl) !== -1) {
            // window.alert("我的课程页面");
            // 获取课程列表
            // 课程名称:$('.mycourse-row')[i].rows[1].innerText.split('\t')[0].split('\n\n')[1]
            // 课程状态:$('.mycourse-row')[i].rows[1].innerText.split('\t')[5]
            let courseList = [];
            $.each($('.mycourse-row'), function (i, ele) {
                let courseName = this.rows[1].innerText.split('\t')[0].split('\n\n')[1].replace("\n", "");
                let courseState = this.rows[1].innerText.split('\t')[5];
                let courseURL = $(this.rows[1]).find('a')[0]['href'];
                courseList[i] = { "name": courseName, "state": courseState, "url": courseURL };
            });
            GM_setValue("courseList", courseList);
            console.log(GM_getValue("courseList"));
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                GM_setValue("myCoursePage", currentTime);
                // 每30s判断一次当前是否正在播放课程视频
                let timeError = Math.abs(GM_getValue("myCoursePage") - GM_getValue("courseOnPlayingPage"));
                let timeError1 = Math.abs(GM_getValue("myCoursePage") - GM_getValue("courseDetailPage"));
                console.log(timeError);
                // 时间误差大于5000ms/5s则判定为没有打开播放课程视频页面或课程详情页
                if (isNaN(timeError) || isNaN(timeError1) || timeError > 5000 && timeError1 > 5000) {
                    // 选择课程列表中未完成的进行播放
                    $.each(GM_getValue("courseList"), function (i, ele) {
                        console.log(this);
                        if (this.state === "未完成" || this.state === "未开始") {
                            window.open(this.url, "_blank");
                            return false;
                        }
                    })
                } else {
                    // 正在播放视频，保持当前状态
                    // console.log("正在播放课程视频");
                }
            }, 5000)

            // 10分钟自动刷新一次页面
            displayModal('提示', '正在自动播放课程，请不要关闭当前页面。正在自动刷新页面保持登录状态，刷新倒计时：', '@', 600);
            setInterval(function () {
                location.reload();
            }, 600000);
        }
        // 我的课程页面, 10*60*1000ms刷新一次
        if (window.location.href.indexOf(rsrczxpxMycourse) !== -1) {
            // window.alert("我的课程页面");
            // 获取课程列表
            // 课程名称:$('.mycourse-row')[i].rows[1].innerText.split('\t')[0].split('\n\n')[1]
            // 课程状态:$('.mycourse-row')[i].rows[1].innerText.split('\t')[5]
            let courseList = [];
            $.each($('.mycourse-row'), function (i, ele) {
                let courseName = this.rows[1].innerText.split('\t')[0].split('\n\n')[1].replace("\n", "");
                let courseState = this.rows[1].innerText.split('\t')[4];
                let courseURL = $(this.rows[1]).find('a')[0]['href'];
                courseList[i] = { "name": courseName, "state": courseState, "url": courseURL };
            });
            GM_setValue("courseList", courseList);
            console.log(GM_getValue("courseList"));
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                GM_setValue("myCoursePage", currentTime);
                // 每30s判断一次当前是否正在播放课程视频
                let timeError = Math.abs(GM_getValue("myCoursePage") - GM_getValue("courseOnPlayingPage"));
                let timeError1 = Math.abs(GM_getValue("myCoursePage") - GM_getValue("courseDetailPage"));
                console.log(timeError);
                // 时间误差大于5000ms/5s则判定为没有打开播放课程视频页面或课程详情页
                if (isNaN(timeError) || isNaN(timeError1) || timeError > 5000 && timeError1 > 5000) {
                    // 选择课程列表中未完成的进行播放
                    $.each(GM_getValue("courseList"), function (i, ele) {
                        console.log(this);
                        if (this.state === "未完成" || this.state === "未开始") {
                            window.open(this.url, "_blank");
                            return false;
                        }
                    })
                } else {
                    // 正在播放视频，保持当前状态
                    // console.log("正在播放课程视频");
                }
            }, 5000)

            // 10分钟自动刷新一次页面
            displayModal('提示', '正在自动播放课程，请不要关闭当前页面。正在自动刷新页面保持登录状态，刷新倒计时：', '@', 600);
            setInterval(function () {
                location.reload();
            }, 600000);
        }
        // 课程播放页面
        if (window.location.href.indexOf(playerPage) !== -1) {
            // window.alert("播放页面")
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                //window.localStorage.setItem("courseOnPlayingPage", currentTime);
                //console.log(localStorage.getItem("courseOnPlayingPage"));
                GM_setValue("courseOnPlayingPage", currentTime);
                // console.log(GM_getValue("courseOnPlayingPage"));
                // console.log(GM_getValue("courseList"));
            }, 1000)

            // 判断课程进度，并自动播放
            let loop = setInterval(function () {
                // 判断当前学习进度
                if ($('#realPlayVideoTime')[0]) {
                    // 如果元素存在，学习进度未完成
                    let process = $('#realPlayVideoTime')[0].innerText;
                    // console.log(`正常监测中，当前视频学习进度：${process}%`)
                    // 判断视频播放异常
                    if ($('video')[0] === null) {
                        location.reload();
                    } else {
                        let video = $('video')[0];
                        // 循环播放
                        video.loop = true;
                        // 关闭声音
                        video.muted = true;
                        // 自动播放
                        video.play();
                        // console.log('播放正常...')
                    }
                    if ($('.vjs-control-bar').find('.vjs-paused')[0]) {
                        $('.vjs-control-bar').find('.vjs-paused')[0].click();
                        $('video')[0].play();
                        // console.log('click 1');
                    }
                    // 如果出现弹窗，点击关闭
                    if ($('.messager-window')[0]) {
                        $($($('.messager-window')[0]).find('.messager-button')[0]).find('a')[0].click()
                        // console.log('click 3');
                    }
                    document.querySelector('video').play();
                } else {
                    // 学习进度元素不存在，当前视频已完成学习,获取未完成列表并逐个播放
                    if ($('.append-plugin-tip')[0]) {
                        // 获取未完成的视频课程,点击第一个开始播放
                        $(".append-plugin-tip > a")[0].click();
                    } else {
                        clearInterval(loop);
                        window.close();
                    }
                }
            }, 5000);
            displayModal('提示', '当前页面正在自动播放课程视频。', '@');
        }
        if (window.location.href.indexOf(rsrczxpxPlayer) !== -1) {
            // window.alert("播放页面")
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                //window.localStorage.setItem("courseOnPlayingPage", currentTime);
                //console.log(localStorage.getItem("courseOnPlayingPage"));
                GM_setValue("courseOnPlayingPage", currentTime);
                // console.log(GM_getValue("courseOnPlayingPage"));
                // console.log(GM_getValue("courseList"));
            }, 1000)

            // 判断课程进度，并自动播放
            let loop = setInterval(function () {
                // 判断当前学习进度
                if ($('#realPlayVideoTime')[0]) {
                    // 如果元素存在，学习进度未完成
                    let process = $('#realPlayVideoTime')[0].innerText;
                    // console.log(`正常监测中，当前视频学习进度：${process}%`)
                    // 判断视频播放异常
                    if ($('video')[0] === null) {
                        location.reload();
                    } else {
                        let video = $('video')[0];
                        // 循环播放
                        video.loop = true;
                        // 关闭声音
                        video.muted = true;
                        // 自动播放
                        video.play();
                        // console.log('播放正常...')
                    }
                    if ($('.vjs-control-bar').find('.vjs-paused')[0]) {
                        $('.vjs-control-bar').find('.vjs-paused')[0].click();
                        $('video')[0].play();
                        // console.log('click 1');
                    }
                    // 如果出现弹窗，点击关闭
                    if ($('.messager-window')[0]) {
                        $($($('.messager-window')[0]).find('.messager-button')[0]).find('a')[0].click()
                        // console.log('click 3');
                    }
                    document.querySelector('video').play();
                } else {
                    // 学习进度元素不存在，当前视频已完成学习,获取未完成列表并逐个播放
                    if ($('.append-plugin-tip')[0]) {
                        // 获取未完成的视频课程,点击第一个开始播放
                        $(".append-plugin-tip > a")[0].click();
                    } else {
                        clearInterval(loop);
                        window.close();
                    }
                }
            }, 5000);
            displayModal('提示', '当前页面正在自动播放课程视频。', '@');
        }
        // 课程详情页面
        if (window.location.href.indexOf(courseDetail) !== -1) {
            // window.alert("课程详情页面")
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                GM_setValue("courseDetailPage", currentTime);
                // 课程详情页与课程播放页状态对比
                let timeError = Math.abs(currentTime - GM_getValue("courseOnPlayingPage"));
                if (isNaN(timeError) || timeError > 5000) {
                    // 没有播放课程视频，判断当前页面课程是否全部完成
                    let unfinishedVideos = $('.append-plugin-tip > a');
                    if (unfinishedVideos.length > 0) {
                        // 点击第一个开始播放
                        unfinishedVideos[0].click();
                    } else if (unfinishedVideos.length === 0) {
                        console.log("finished")
                        // 此课程视频已全部播放，更改列表里的课程状态，并关闭当前课程页面
                        let currentCourseName = $(".course-intro-title.font-overhidden")[0].innerText.replace("\n", "");
                        let newCourseList = GM_getValue("courseList");
                        console.log(newCourseList);
                        $.each(newCourseList, function (i, ele) {
                            console.log(ele.name === currentCourseName);
                            console.log(ele.name)
                            console.log(currentCourseName)
                            if (ele.name.indexOf(currentCourseName) != -1) {
                                console.log(ele.name + "已完成");
                                ele.state = "已完成";
                                window.close();
                                return false;
                            }
                            // console.log(this);
                        })
                        GM_setValue("courseList", newCourseList);
                        // console.log(GM_getValue("courseList"));
                    }
                } else {
                    // 正在播放视频，把当前页面关闭，只保留播放页面
                    window.close();
                }
            }, 1000)
        }
        if (window.location.href.indexOf(rsrczxpxCoursedetail) !== -1) {
            // window.alert("课程详情页面")
            setInterval(function () {
                // 获取当前最新时间，并保存最新访问该页面的时间状态
                let currentTime = Date.now();
                GM_setValue("courseDetailPage", currentTime);
                // 课程详情页与课程播放页状态对比
                let timeError = Math.abs(currentTime - GM_getValue("courseOnPlayingPage"));
                if (isNaN(timeError) || timeError > 5000) {
                    // 没有播放课程视频，判断当前页面课程是否全部完成
                    let unfinishedVideos = $('.append-plugin-tip > a');
                    if (unfinishedVideos.length > 0) {
                        // 点击第一个开始播放
                        unfinishedVideos[0].click();
                    } else if (unfinishedVideos.length === 0) {
                        console.log("finished")
                        // 此课程视频已全部播放，更改列表里的课程状态，并关闭当前课程页面
                        let currentCourseName = $(".course-intro-title.font-overhidden")[0].innerText.replace("\n", "");
                        let newCourseList = GM_getValue("courseList");
                        console.log(newCourseList);
                        $.each(newCourseList, function (i, ele) {
                            console.log(ele.name === currentCourseName);
                            console.log(ele.name)
                            console.log(currentCourseName)
                            if (ele.name.indexOf(currentCourseName) != -1) {
                                console.log(ele.name + "已完成");
                                ele.state = "已完成";
                                window.close();
                                return false;
                            }
                            // console.log(this);
                        })
                        GM_setValue("courseList", newCourseList);
                        // console.log(GM_getValue("courseList"));
                    }
                } else {
                    // 正在播放视频，把当前页面关闭，只保留播放页面
                    window.close();
                }
            }, 1000)
        }
    })

    // count倒计时，可选参数，单位秒
    function displayModal(headText, bodyText, footText, countdown) {
        let modal = document.createElement('div');
        modal.style.cssText = 'display: block; position: fixed; z-index: 999; padding-top: 100px; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4);';
        let modalContent = document.createElement('div');
        modalContent.style.cssText = 'position: relative;background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;width: 50%;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); -webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s';
        let modalHeader = document.createElement('div');
        modalHeader.style.cssText = 'padding: 2px 16px;background-color: #5cb85c;color: white;'
        let modalBody = document.createElement('div');
        modalBody.setAttribute('id', 'MessageBody');
        modalBody.style.cssText = 'padding: 2px 16px;'
        let modalFooter = document.createElement('div');
        modalFooter.style.cssText = 'padding: 2px 16px;background-color: #5cb85c;color: white;'
        let close = document.createElement('span');
        close.innerHTML = "X";
        close.style.cssText = 'color: white;float: right;font-size: 28px;font-weight: bold;'
        close.onmouseover = function () { this.style.cssText = 'color: #000;float: right;font-size: 28px;font-weight: bold;text-decoration: none;cursor: pointer;' };
        close.onclick = function () { modal.style.display = "none" }
        modalHeader.appendChild(close);
        let headInfo = document.createElement('h3');
        headInfo.innerText = headText;
        modalHeader.appendChild(headInfo);
        let bodyInfo = document.createElement('h2');
        bodyInfo.innerText = bodyText;
        modalBody.appendChild(bodyInfo);
        let link = document.createElement('a');
        link.href = 'https://www.cnblogs.com/';
        link.target = '_blank'
        let footInfo = document.createElement('h3');
        footInfo.innerText = footText;
        link.appendChild(footInfo);
        modalFooter.appendChild(link);
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        let time = countdown; // 秒
        // 倒计时功能
        setInterval(function () {
            time -= 1;
            // 页面刷新倒计时
            if (countdown !== undefined) { bodyInfo.innerText = bodyText + time + 's'; }
            // 视频播放页详情
            if (window.location.href.indexOf(playerPage) !== -1 || window.location.href.indexOf(rsrczxpxPlayer) !== -1) {
                let finishedCount = document.querySelectorAll('.content-finished').length;
                let unfinishedCount = document.querySelectorAll('.append-plugin-tip').length;
                let allCount = finishedCount + unfinishedCount;
                if (document.querySelector('#realPlayVideoTime') !== null) {
                let process = document.querySelector('#realPlayVideoTime').innerText;
                if (unfinishedCount !== undefined) { bodyInfo.innerText = bodyText + '当前课程进度:' + finishedCount + '/' + allCount + '。当前视频进度:' + process + '%。'; }}
                if (unfinishedCount == 0) { bodyInfo.innerText = '提示:当前课程已完成，请选择其他课程！' }
            }
        }, 1000);
    }

})();
