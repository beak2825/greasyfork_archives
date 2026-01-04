// ==UserScript==
// @name         云学堂自动刷视频  yunxuetang.cn
// @namespace    zhou__jianlei
// @version      0.6
// @description  云学堂视频播放 文档浏览
// @author       zhou__jianlei
// @icon         https://picobd.yxt.com/orgs/yxt_malladmin/mvcpic/image/201811/71672740d9524c53ac3d60b6a4123bca.png
// @match        http://*.yunxuetang.cn/plan/*.html
// @match        http://*.yunxuetang.cn/kng/plan/document/*
// @match        http://*.yunxuetang.cn/kng/plan/video/*
// @match        http://*.yunxuetang.cn/kng/plan/package/*
// @match        http://*.yunxuetang.cn/kng/course/package/video/*
// @match        http://*.yunxuetang.cn/kng/course/package/document/*
// @match        http://*.yunxuetang.cn/sty/index.htm
// @match        http://*.yunxuetang.cn/exam/test/examquestionpreview.htm*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      zhoumo.tech
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/416814/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20%20yunxuetangcn.user.js
// @updateURL https://update.greasyfork.org/scripts/416814/%E4%BA%91%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20%20yunxuetangcn.meta.js
// ==/UserScript==

(function () {
    const path = window.location.pathname;
    const date = new Date();

    //任务列表页
    if (path.match(/^\/plan.*/g)) {
        console.log('任务列表页...');
        let i = 0;
        $('.hand > td').each(function (index, item) {
            if ((index + 1) % 4 == 0) {
                const text = $(item).children('.text-grey').eq(1).text();
                console.log('任务' + (++i) + ', 播放进度:' + text);
                if (text.includes('%') && text !== '100%') {
                    console.log('点击这个未播放完成的');
                    window.setTimeout(function () {
                        const str = $(item).parent('.hand').attr('onclick') + '';
                        let arr = str.split("'");
                        console.info(arr[1]);
                        window.open(arr[1], '_self');
                    }, 2 * 1000);
                    return false;
                }
            }
        });

    } else if (path.match(/^\/kng\/plan\/document.*/g) || path.match(/^\/kng\/course\/package\/document.*/g)) {
        //文档页
        console.log('文档页准备就绪...');
        window.setInterval(function () {
            //检测在线
            detectionOnline();
            //防作弊
            checkMoreOpen();
            //完成度检测
            detectionComplete();

        }, 30 * 1000);

    } else if (path.match(/^\/kng\/plan\/video.*/g) || path.match(/^\/kng\/course\/package\/video.*/g)) {
        //视频页
        console.log('视频页准备就绪...');
        //每30秒检测一次
        window.setInterval(function () {
            //检测在线
            detectionOnline();
            //防作弊
            checkMoreOpen();
            //检测播放状态
            detectPlaybackStatus();
            //完成度检测
            detectionComplete();

        }, 30 * 1000);
    } else if (path.match(/^\/kng\/\w*\/package.*/g)) {
        // 3秒后点击开始学习按钮
        window.setTimeout(function () {
            $('#btnStartStudy').click();
        }, 3 * 1000)

    } else if (path.match(/^\/sty.*/g)) {
        console.log('学习任务签到');
        signdata();

    } else {

    }


    //检测多开弹窗
    function checkMoreOpen() {
        console.debug('检测多开弹窗');
        if ($("#dvSingleTrack").length) {
            console.log("防止多开作弊 弹窗");
            StartCurStudy();
        }
    }

    //在线检测
    function detectionOnline() {
        const date = new Date();
        const dom = document.getElementById("dvWarningView");
        console.info(date.toLocaleString() + ' 检测是否有弹窗...');
        if (dom) {
            console.debug('弹窗出来了');
            const cont = dom.getElementsByClassName("playgooncontent")[0].innerText;
            if (cont.indexOf("请不要走开喔") != -1) {
                document.getElementsByClassName("btnok")[1].click();
            } else {
                //没遇到过这种情况 不能处理了 返回上一级
                console.error('没遇到过这种情况 不能处理了, 弹窗内容：' + cont);
                window.setTimeout(function () {
                    //刷新当前页吧
                    window.location.reload();
                }, 5 * 1000)
            }
        }
    }

    //检测完成(进度100%)
    function detectionComplete() {
        const percentage = $('#ScheduleText').text();
        console.log('进度百分比: ' + percentage);
        if (percentage == '100%') {
            //返回上一级
            GoBack();
        }
    }

    //检测播放状态
    function detectPlaybackStatus() {
        const date = new Date();
        console.info(date.toLocaleString() + ' 检测播放状态...')
        if (myPlayer.getState() == 'playing') {
            console.log("播放中...啥也不操作了");
        } else if (myPlayer.getState() == 'paused') { //暂停
            console.log("暂停啦！！！");
            myPlayer.play();
            console.log("开始播放~");
        } else if (myPlayer.getState() == 'complete') {
            console.log($('#lblTitle').text() + "播放完成！！！");
            //返回上一级
            GoBack();
        }
    }
})();