// ==UserScript==
// @name         云学堂全自动刷视频-测试 yunxuetang.cn
// @namespace    https://github.com/michaelauto/yunxuetang
// @version      0.16.8
// @description  云学堂视频播放 文档浏览 自动筛选学习未学习的视频 自动提交考试
// @author       zhou__jianlei
// @license      MIT
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http*://*.yunxuetang.cn/plan/*.html
// @match        http*://*.yunxuetang.cn/kng/*/document/*
// @match        http*://*.yunxuetang.cn/kng/*/video/*
// @match        http*://*.yunxuetang.cn/kng/plan/package/*
// @match        http*://*.yunxuetang.cn/kng/view/package/*
// @match        http*://*.yunxuetang.cn/kng/course/package/video/*
// @match        http*://*.yunxuetang.cn/kng/course/package/document/*
// @match        http*://*.yunxuetang.cn/sty/index.htm
// @match        http*://*.yunxuetang.cn/exam/test/examquestionpreview.htm*
// @match        http*://*.yunxuetang.cn/exam/exampreview.htm*
// @match        http*://*.yunxuetang.cn/exam/test/userexam.htm*
// @match        http*://*.yunxuetang.cn/exam/viewexamresult.htm*
// @match        http*://*.yunxuetang.cn/kng/knowledgecatalogsearch.htm*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/510236/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-%E6%B5%8B%E8%AF%95%20yunxuetangcn.user.js
// @updateURL https://update.greasyfork.org/scripts/510236/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91-%E6%B5%8B%E8%AF%95%20yunxuetangcn.meta.js
// ==/UserScript==

(function () {

    const path = window.location.pathname;
    const href = window.location.href;
    const date = new Date();
    // 变量名 常量 视频播放暂停次数
    const NUMBER_OF_VIDEO_PLAYBACK_PAUSES = 'numberOfVideoPlaybackPauses';

    // 考试自动提交key 
    const AUTO_SUBMIT_KEY = "auto_submit";

    // 课程包URL地址 key
    const COURSE_PACKAGE_URL_ADDRESS_KEY = "kng_href_key";
    // 课程列表页刷新标记
    const COURSE_PACKAGE_REFRESH_KEY = "course_package_refresh_key";
    // 试卷页面是否新打开页面
    const EXAM_OPEN_PAGE_KEY = "exam_open_page_key";
    // 自动提交考试 true
    // initAutoSubmit();

    // 初始化考试自动提交
    function initAutoSubmit() {
        localStorage.setItem(AUTO_SUBMIT_KEY, true)
    }


    // 任务列表页
    if (path.match(/^\/plan.*/g)) {
        console.log('学习任务列表页...');
        $('.w-150').each(function (index, item) {
            let text = $(item).children('.text-grey').eq(1).text();
            console.log('任务' + (index + 1) + ', 播放进度:' + text);
            if (text.includes('%') && text !== '100%') {
                console.log('点击这个未播放完成的');
                window.setTimeout(function () {
                    let str = $(item).parents('.hand').eq(0).attr('onclick') + '';
                    let arr = str.split("'");
                    console.info(arr[1]);
                    window.open(arr[1], '_self');
                }, 10 * 1000);
                return false;
            }
        });

    } else if (path.match(/^\/kng\/.*\/document.*/g) || path.match(/^\/kng\/course\/package\/document.*/g) || path.match(/^\/knowledge\/document.*/g)) {    // 文档页
        console.log('文档页准备就绪...');
        window.setInterval(function () {
            // 检测在线
            detectionOnline();
            // 防作弊
            checkMoreOpen();
            // 完成度检测
            detectionComplete();

        }, 30 * 1000);

    } else if (path.match(/^\/kng\/.*\/video.*/g) || path.match(/^\/kng\/course\/package\/video.*/g) || path.match(/^\/knowledge\/video.*/g)) { // 视频页
        // 视频页
        console.log('视频页准备就绪...');
        // 每30秒检测一次
        window.setInterval(function () {
            // 检测在线
            detectionOnline();
            // 防作弊
            checkMoreOpen();
            // 检测播放状态
            detectPlaybackStatus();
            // 完成度检测
            detectionComplete();

        }, 30 * 1000);
    } else if (path.match(/^\/kng\/\w*\/package.*/g)) { // 课程包明细页
        console.log('课程包明细页...');
        let progress = $('#lblStudySchedule').text() + "";
        if (progress == '100') {
            let kng_href = getKngUrl();
            layer.msg('已学习完成3秒后返回列表页：' + kng_href);
            window.setTimeout(function () {
                window.open(kng_href, '_self');
            }, 3 * 1000)
        } else {
            // 3秒后点击开始学习按钮
            layer.msg('3秒后开始学习');
            window.setTimeout(function () {
                $('#btnStartStudy').click();
            }, 3 * 1000)
        }
    } else if (path.match(/^\/kng\/knowledgecatalogsearch.*/g)) { // 课程包列表页
        // 刷新页面同步进度
        console.log('课程包列表页...' + getRefreshKng());
        if (getRefreshKng()) {
            console.log('刷新课程包列表页...');
            initRefreshKng();
            window.location.reload();
        } else {
            updateKngUrl();
            $('.el-kng-bottom-detail').each(
                function (index, item) {
                    let text = $(item).parent().children('div').eq(0).children('span').text();
                    console.log(text)
                    if (text == '') {
                        console.log(index + ' 点击这个未学习的');
                        let attr = $(item).children('div').eq(0).children('.text-normal').attr('onclick') + '';
                        window.setTimeout(function () {
                            if (attr) {
                                let arr = attr.split("'");
                                console.info('RUL链接： ' + arr[1]);
                                window.open(arr[1], '_self');
                            }
                        }, 1000 * 10);
                        return false;
                    }
                }
            )
        }
    } else if (path.match(/^\/sty.*/g)) {
        layer.msg('学习任务签到');
        window.setTimeout(function () {
            signdata();
        }, 1000 * 3);
    } else if (path.match(/^\/exam\/exampreview.*/g)) { // 开始考试页面
        console.log('开始考试页面...');
        let checkbox = '<input type="checkbox" name="auto_submit" id="auto_submit"> 自动提交';  // 这个复选框太low了，有能力的给搞个好看的开关样式
        $("#btnTest").parent().append(checkbox);
        if (isAutoSubmit()) {
            $('#auto_submit').prop('checked', true);
        } else {
            $('#auto_submit').prop('checked', false);
        }
        $('#auto_submit').on('change', function () {
            if ($('#auto_submit').prop('checked')) {
                setAutoSubmit(true)
            } else {
                setAutoSubmit(false)
            }
        });

        // 获取考试是否自动提交
        if (isAutoSubmit()) {
            if ($('#btnTest').val() == '开始考试') {
            layer.msg('自动提交，5秒后进入考试');
            window.setTimeout(function () {
                goExam();
            }, 1000 * 5);
                            // 监听页面切换和新开页签事件
                            window.onbeforeunload = function (event) {
                                // 检测当前页面是否可见
                                if (document.hidden) {
                                    // 在这里执行新开页签的操作
                                    console.log("新开页签");
                                    localStorage.setItem(EXAM_OPEN_PAGE_KEY, true);
                                } else {
                                    // 在这里执行在原有页面打开的操作
                                    console.log("在原有页面打开");
                                    localStorage.setItem(EXAM_OPEN_PAGE_KEY, false);
                                }
                            };
            } else {
                let kng_href = getKngUrl();
                layer.msg('已完成30秒后返回列表页：' + kng_href);
                window.setTimeout(function () {
                    window.open(kng_href, '_self');
                }, 30 * 1000)
            }
        }



    } else if (path.match(/^\/exam\/test\/userexam.*/g)) {  // 考试页面
        console.log('考试页面...');
        // 获取考试是否自动提交
        if (isAutoSubmit()) {
            layer.msg('3秒后 自动提交');
            window.setTimeout(function () {
                // 点击提交
                $('#btnSubmit').click();
            }, 1000 * 3);

            // 获取id为myConfirm 的class中是否有hide 如果有的话就是显示弹窗 3秒后点击id为btnMyConfirm 的按钮
            if ($("#myConfirm").hasClass("hide")) {
                console.log("点击id为btnMyConfirm 的按钮");
                window.setTimeout(function () {
                    $("#btnMyConfirm").click();
                }, 1000 * 6);
            }
        }


    } else if (path.match(/^\/exam\/viewexamresult.*/g)) {  // 考试结果页
        console.log('考试结果页');
        if (isAutoSubmit()) {
            let kng_href = getKngUrl();
            layer.msg('已完成3秒后返回列表页：' + kng_href);
            console.log('是否为新开页面' + localStorage.getItem(EXAM_OPEN_PAGE_KEY))
            window.setTimeout(function () {
                //if (getQueryString('packageId')) {
                if (localStorage.getItem(EXAM_OPEN_PAGE_KEY) === 'true') {
                    // 关闭当前页
                    window.close();
                } else {
                    window.open(kng_href, '_self');
                }
            }, 3 * 1000)
        }
    }

    // 更新课程包地址
    function updateKngUrl() {
        let kng_href = window.location.href;
        console.log('课程包地址：' + kng_href);
        localStorage.setItem(COURSE_PACKAGE_URL_ADDRESS_KEY, kng_href);
    }
    // 获取课程包地址
    function getKngUrl() {
        return localStorage.getItem(COURSE_PACKAGE_URL_ADDRESS_KEY);
    }
    // 获取是否自动提交考试
    function isAutoSubmit() {
        return localStorage.getItem(AUTO_SUBMIT_KEY) === 'true';
    }
    // 修改开始自动提交 
    function setAutoSubmit(val) {
        localStorage.setItem(AUTO_SUBMIT_KEY, val === true ? true : false);
    }
    // 获取刷新课程包标记
    function getRefreshKng() {
        return localStorage.getItem(COURSE_PACKAGE_REFRESH_KEY) === 'true';
    }
    function setRefreshKng(val) {
        console.log('修改刷新课程包标记: ' + val);
        localStorage.setItem(COURSE_PACKAGE_REFRESH_KEY, val === true ? true : false);
    }
    function initRefreshKng() {
        setRefreshKng(false);
    }
    // 检测多开弹窗
    function checkMoreOpen() {
        console.debug('检测多开弹窗');
        // 不知道这个还有没有用
        if ($("#dvSingleTrack").length) {
            console.log("防止多开作弊 弹窗");
            StartCurStudy();
        }
        // 确认文档弹窗是这个了
        if ($("#dvHeartTip").length) {
            console.log("文档页面 正在学习 弹窗");
            learnKng();
        }
    }
    // 在线检测
    function detectionOnline() {
        const date = new Date();
        var dom = document.getElementById("dvWarningView");
        console.info(date.toLocaleString() + ' 检测是否有弹窗...');
        if (dom) {
            console.debug('弹窗出来了');
            const cont = dom.getElementsByClassName("playgooncontent")[0].innerText;
            if (cont.indexOf("请不要走开喔") != -1) {
                document.getElementsByClassName("btnok")[1].click();
            } else {
                // 没遇到过这种情况 不能处理了 返回上一级
                console.error('没遇到过这种情况 不能处理了, 弹窗内容：' + cont);
                window.setTimeout(function () {
                    // 刷新当前页吧
                    window.location.reload();
                }, 5 * 1000)
            }
        }
    }

    // 检测完成(进度100%)
    function detectionComplete() {
        const percentage = $('#ScheduleText').text();
        console.log('进度百分比: ' + percentage);
        if (percentage == '100%') {
            setRefreshKng(true);
            // 根据这个 <span id="divGoBack" style="display: none;" class="iconfont hand icon-fanhui d-in-block font-size-16" onclick="GoBack();"></span>  获取style的display的属性值
            if (document.getElementById("divGoBack").style.display == 'none') {
                console.log("返回前一页");
                window.history.back();
            } else {
                console.log("返回上一级");
                GoBack();
            }
        }
    }

    // 检测播放状态
    function detectPlaybackStatus() {
        let numberOfVideoPlaybackPauses = getVideoPauseTimes();
        console.info('视频暂停次数：' + numberOfVideoPlaybackPauses)
        const date = new Date();
        console.info(date.toLocaleString() + ' 检测播放状态...')
        if (myPlayer.getState() == 'playing') {
            myPlayer.setPlaybackRate(2);
            initVideoPauseTimes();
            console.log("播放中...啥也不操作了");
        } else if (myPlayer.getState() == 'buffering') { // 缓冲
            layer.msg("缓冲中...刷新");
            window.setTimeout(function () {
                initVideoPauseTimes();
                window.location.reload();
            }, 1000);

        } else if (myPlayer.getState() == 'paused') { // 暂停
            console.log("暂停啦！！！");
            videoPauseTimesInc();
            if (numberOfVideoPlaybackPauses > 5) {
                console.log("暂停次数过多，自动刷新页面");
                initVideoPauseTimes();
                window.location.reload();
            }
            myPlayer.play();
            console.log("开始播放~");
        } else if (myPlayer.getState() == 'complete') {
            console.log($('#lblTitle').text() + "播放完成！！！");
            // 返回上一级
            // GoBack();
        }
    }
    // 初始化视频暂停次数
    function initVideoPauseTimes() {
        localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, 0)
    }
    // 获取视频暂停次数
    function getVideoPauseTimes() {
        return Number(localStorage.getItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES) || 0);
    }
    // 视频暂停次数自增
    function videoPauseTimesInc() {
        localStorage.setItem(NUMBER_OF_VIDEO_PLAYBACK_PAUSES, Number(getVideoPauseTimes()) + 1);
    }
    // 获取当前url中的指定参数的值
    function getQueryString(name) {
        // 获取完整的地址栏地址
        var url = window.location.href;
        // 解析地址栏中的参数
        var params = url.split('?')[1].split('&');
        // 遍历参数数组，找到参数并获取其值
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split('=');
            if (param[0] === name) {
                return param[1];
            }
        }
        return null;
    }

})();
