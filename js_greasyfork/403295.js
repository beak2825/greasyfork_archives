// ==UserScript==
// @name         云学堂全自动刷视频 yunxuetang.cn
// @namespace    https://github.com/zhou-jian-qq/yunxuetang
// @version      0.16.19
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
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403295/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.user.js
// @updateURL https://update.greasyfork.org/scripts/403295/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.meta.js
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
        $('.w-170').each(function (index, item) {
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
        support();
        window.setInterval(function () {
            // 检测在线
            detectionOnline();
            // 防作弊
            checkMoreOpen();
            // 完成度检测
            detectionComplete();

        }, 15 * 1000);

    } else if (path.match(/^\/kng\/.*\/video.*/g) || path.match(/^\/kng\/course\/package\/video.*/g) || path.match(/^\/knowledge\/video.*/g)) { // 视频页
        // 视频页
        console.log('视频页准备就绪...');
        support();
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

        }, 15 * 1000);
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
        // 每页的数量
        let num = $('.titletext').val() //20
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
                        console.log(index + ' 点击这个' + text + '的');
                        let attr = $(item).children('div').eq(0).children('.text-normal').attr('onclick') + '';
                        window.setTimeout(function () {
                            if (attr) {
                                let arr = attr.split("'");
                                console.info('RUL链接： ', arr[1]);
                                window.open(arr[1], '_self');
                            }
                        }, 1000 * 10);
                        return false;
                    } else {
                        if (index == num - 1) {
                            //获取下一页的按钮
                            let nextPageHref = $('.pagetext').eq(1).attr('href')
                            console.info('下一页RUL链接： ', nextPageHref);
                            window.open(nextPageHref, '_self');
                        }
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
        let toggleSwitch = '<div class="toggle-switch">\n  <input type="checkbox" name="auto_submit" id="auto_submit" class="toggle-switch-checkbox">\n  <label for="auto_submit" class="toggle-switch-label">\n    <span class="toggle-switch-inner"></span>\n    <span class="toggle-switch-switch"></span>\n  </label>\n  <span class="toggle-switch-text">自动提交</span>\n</div>';

        $("#btnTest").parent().append(toggleSwitch);

        // 添加滑块样式
        GM_addStyle(`
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
          margin-left: 10px;
        }
        .toggle-switch-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-switch-label {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #ccc;
          border-radius: 34px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .toggle-switch-label:hover {
          background-color: #b3b3b3;
        }
        .toggle-switch-checkbox:checked + .toggle-switch-label {
          background-color: #2196F3;
        }
        .toggle-switch-inner {
          position: absolute;
          width: 100%;
          height: 100%;
          line-height: 34px;
          font-size: 12px;
          color: white;
          text-align: center;
        }
        .toggle-switch-switch {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 30px;
          height: 30px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }
        .toggle-switch-checkbox:checked + .toggle-switch-label .toggle-switch-switch {
          transform: translateX(26px);
        }
        .toggle-switch-text {
          margin-left: 70px;
          line-height: 34px;
          vertical-align: middle;
          white-space: nowrap;
          display: inline-block;
          margin-right: 10px;
        }`);
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
                layer.msg('已完成5秒后返回列表页：' + kng_href);
                window.setTimeout(function () {
                    window.open(kng_href, '_self');
                }, 5 * 1000)
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
        //删除刷新课程包标记
        // localStorage.removeItem(COURSE_PACKAGE_REFRESH_KEY)
        setRefreshKng(false);
    }
    // 检测多开弹窗
    function checkMoreOpen() {
        console.debug('检测多开弹窗');
        // 不知道这个还有没有用 这个貌似没用了
        if ($("#dvSingleTrack").length) {
            console.log("防止多开作弊 弹窗");
            StartCurStudy();
        }
        // // id为dvHeartTip 的元素  style 不是 display: none; 的时候执行
        // if ($("#dvHeartTip").css("display") != "none") {
        //     console.log("防止多开作弊 弹窗");
        //     StartCurStudy();
        // }
        if ($("#dvHeartTip").length) {
            console.log("防止多开作弊 弹窗");
            closeWebPage();
            // commonHelper.learnKng();
        }
        // 暂无法学习此知识。此知识受学习顺序控制，您需要在完成前面知识的学习后才可以学习此知识。
        if ($("#dvCantPlay2").css("display") != "none") {
            console.log("检测 受学习顺序控制 弹窗");
            closeCantPlay2();
            returnToThePreviousLevel();
        }
        // 确认文档弹窗是否存在 这个好像无效了
        if ($("#dvHeartTip").length) {
            console.log("文档页面 正在学习 弹窗");
            learnKng();
        }
    }
    // 判断元素是否可见
    function isElementVisible(el) {
        return !!el && el.offsetHeight > 0 && el.offsetWidth > 0 && el.offsetParent !== null;
    }

    // 获取继续学习按钮
    function findResumeStudyButton(modal) {
        if (!modal) {
            return null;
        }
        var byId = modal.querySelector('#reStartStudy');
        if (byId && isElementVisible(byId)) {
            return byId;
        }
        var candidates = modal.querySelectorAll('.btnok, input[type="button"], button');
        for (var i = 0; i < candidates.length; i++) {
            var btn = candidates[i];
            if (!isElementVisible(btn)) {
                continue;
            }
            var text = (btn.value || btn.innerText || btn.textContent || '').trim();
            if (text.indexOf('继续') !== -1 || text.indexOf('我在') !== -1) {
                return btn;
            }
        }
        return null;
    }

    // 在线检测
    function detectionOnline() {
        const date = new Date();
        var modal = document.getElementById('dvWarningView');
        console.info(date.toLocaleString() + ' 检测是否有弹窗...');
        if (!modal || !isElementVisible(modal)) {
            return;
        }
        var contentNode = modal.getElementsByClassName('playgooncontent')[0];
        var contentText = contentNode ? contentNode.innerText.trim() : '';
        var heartbeatKeywords = ['亲，您在吗', '请不要走开', '继续学习', '我在'];
        var matchedHeartbeat = false;
        for (var i = 0; i < heartbeatKeywords.length; i++) {
            if (contentText.indexOf(heartbeatKeywords[i]) !== -1) {
                matchedHeartbeat = true;
                break;
            }
        }
        if (!matchedHeartbeat) {
            console.warn('检测在线：未识别的弹窗内容 -> ' + contentText);
            window.setTimeout(function () {
                window.location.reload();
            }, 5 * 1000);
            return;
        }
        var button = findResumeStudyButton(modal);
        if (button) {
            console.debug('检测在线：点击按钮 -> ' + (button.value || button.innerText || '按钮'));
            button.click();
        } else {
            console.error('检测在线：未找到继续学习按钮，5秒后刷新当前页');
            window.setTimeout(function () {
                window.location.reload();
            }, 5 * 1000);
        }
    }
    // 返回上一级
    function returnToThePreviousLevel() {
        console.log("返回上一级");
        // 检测是否有返回按钮
        // 根据这个 <span id="divGoBack" style="display: none;" class="iconfont hand icon-fanhui d-in-block font-size-16" onclick="GoBack();"></span>  获取style的display的属性值
        if (document.getElementById("divGoBack").style.display == 'none') {
            console.log("返回前一页");
            window.history.back();
        } else {
            console.log("返回上一级");
            GoBack();
        }
    }

    // 检测完成(进度100%)
    function detectionComplete() {
        const percentage = $('#ScheduleText').text();
        console.log('进度百分比: ' + percentage);
        if (percentage == '100%') {
            setRefreshKng(true);
            returnToThePreviousLevel();
        }
    }

    // 检测播放状态
    function detectPlaybackStatus() {
        if (myPlayer.getState() == 'playing') {
            myPlayer.setPlaybackRate(2);
            // 设置音量为静音
            myPlayer.setVolume(0)
            initVideoPauseTimes();
            console.log("播放中...");
        } else if (myPlayer.getState() == 'buffering') { // 缓冲
            console.log("缓冲中...刷新页面");
            window.setTimeout(function () {
                initVideoPauseTimes();
                window.location.reload();
            }, 1000);

        } else if (myPlayer.getState() == 'paused') { // 暂停
            console.log("暂停啦...执行播放方法...");
            myPlayer.play();
            let videoPauseTimes = getVideoPauseTimes();
            console.info('视频暂停次数：' + videoPauseTimes)
            videoPauseTimesInc();
            if (videoPauseTimes > 5) {
                console.log("暂停次数过多，自动刷新页面");
                initVideoPauseTimes();
                window.location.reload();
            }
            myPlayer.play();
        } else if (myPlayer.getState() == 'complete') {
            console.log($('#lblTitle').text() + "播放完成！！！");
            // 返回上一级
            // GoBack();
        } else {
            console.log("未知状态 刷新页面");
            window.location.reload();
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
    // 点赞
    function support() {
        window.setTimeout(function () {
            let knowledgeID = $("#hidKnowledgeID").val();
            supportKng(knowledgeID, 2);
            console.log('点赞一下。', knowledgeID);
        }, 10 * 1000);
    }

})();
