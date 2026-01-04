// ==UserScript==
// @name         云学堂全自动刷视频 yunxuetang.cn
// @version      2.0
// @description  云学堂视频播放 文档浏览
// @author       zhou__jianlei
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
// @match        http*://*.yunxuetang.cn/exam/test/userexam.htm*
// @match        http*://*.juran.com.cn/plan/*.html
// @match        http*://*.juran.com.cn/kng/*/document/*
// @match        http*://*.juran.com.cn/kng/*/video/*
// @match        http*://*.juran.com.cn/kng/plan/package/*
// @match        http*://*.juran.com.cn/kng/view/package/*
// @match        http*://*.juran.com.cn/kng/course/package/video/*
// @match        http*://*.juran.com.cn/kng/course/package/document/*
// @match        http*://*.juran.com.cn/sty/index.htm
// @match        http*://*.juran.com.cn/exam/test/examquestionpreview.htm*
// @match        http*://*.juran.com.cn/exam/test/userexam.htm*
// @match        http*://*.juran.com.cn/m/#/plan/*.html
// @match        http*://*.juran.com.cn/m/#/kng/*/document/*
// @match        http*://*.juran.com.cn/m/#/kng/*/video/*
// @match        http*://*.juran.com.cn/m/#/kng/plan/package/*
// @match        http*://*.juran.com.cn/m/#/kng/view/package/*
// @match        http*://*.juran.com.cn/m/#/kng/course/package/video/*
// @match        http*://*.juran.com.cn/m/#/kng/course/package/document/*
// @match        http*://*.juran.com.cn/m/#/sty/index.htm
// @match        http*://*.juran.com.cn/m/#/exam/test/examquestionpreview.htm*
// @match        http*://*.juran.com.cn/m/#/exam/test/userexam.htm*
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @namespace easyhome
// @downloadURL https://update.greasyfork.org/scripts/436922/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.user.js
// @updateURL https://update.greasyfork.org/scripts/436922/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.meta.js
// ==/UserScript==

 
(function () {
 
    const path = window.location.pathname;
    const date = new Date();
 
 
    //任务列表页
    if (path.match(/^\/plan.*/g)) {
        console.log('任务列表页...');
        $('.w-150').each(function (index, item) {
            const text = $(item).children('.text-grey').eq(1).text();
            console.log('任务' + (index+1) + ', 播放进度:' + text);
            if (text.includes('%') && text !== '100%') {
                console.log('点击这个未播放完成的');
                window.setTimeout(function () {
                    const str = $(item).parents('.hand').eq(0).attr('onclick') + '';
                    let arr = str.split("'");
                    console.info(arr[1]);
                    window.open(arr[1], '_self');
                }, 10 * 1000);
                return false;
            }
        });
 
    } else if (path.match(/^\/kng\/.*\/document.*/g) || path.match(/^\/kng\/course\/package\/document.*/g)) {
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
 
    } else if (path.match(/^\/kng\/.*\/video.*/g) || path.match(/^\/kng\/course\/package\/video.*/g)) {
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
        layer.msg('3秒后开始学习');
        window.setTimeout(function () {
            $('#btnStartStudy').click();
        }, 3 * 1000)
 
    } else if (path.match(/^\/sty.*/g)) {
        console.log('学习任务签到');
        signdata();
 
    } else {
        console.log('啦啦啦啦');
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
        var dom = document.getElementById("dvWarningView");
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