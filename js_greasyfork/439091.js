// ==UserScript==
// @name         云学堂全自动刷视频 yunxuetang.cn
// @namespace    li
// @version      1.0
// @description  云学堂视频播放 文档浏览
// @author       li
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
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      answer.com
// @connect      zhoumo.tech
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @license-MIT
// @downloadURL https://update.greasyfork.org/scripts/439091/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.user.js
// @updateURL https://update.greasyfork.org/scripts/439091/%E4%BA%91%E5%AD%A6%E5%A0%82%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91%20yunxuetangcn.meta.js
// ==/UserScript==
 
(function () {
 
    const path = window.location.pathname;
    const date = new Date();
    const host = 'http://answer.zhoumo.tech';
 
 
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
                    }, 10 * 1000);
                    return false;
                }
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
 
    } else if (path.match(/^\/exam\/test\/examquestionpreview.*/g)) {
        //查看试卷答案 采集试题
        //试卷
        var exam = {};
        exam.host = window.location.host;
        exam.exam_name = $('#lblExamName').text();
 
        //试题集
        var questions = [];
        $('.exam-subject-box').each(function (index, item) {
            //试题
            var question = {};
            //问题
            var question_stem = $(item).find('.exam-vignette-con').text();
            question.question = question_stem;
            console.log('问题:',question_stem);//签署完的纸质文件需邮寄到（）存档。
            //正确答案
            var rightanswer = $.trim($(item).find('.rightanswer').text());
            console.log('正确答案:', rightanswer);//正确答案：B
            //没有正确答案 获取提交答案
            if(rightanswer == '正确答案：不允许查看正确答案'){
                var submitanswer = $.trim($(item).find('.rightanswer').prev().text());
                console.log('提交答案:', submitanswer);
                var icon_class_arr = $(item).find('.rightanswer').prev().find('span').eq(1).attr('class').split(' ');
                if($.inArray('exam-icon-correct', icon_class_arr) != -1){
                    console.log('答对了 记录一下');
                    rightanswer = submitanswer;
                }
 
            }
 
            //答案集合
            var answers = [];
            //截取答案字符串
            var answer_str = rightanswer.substring(rightanswer.indexOf("：") + 1);
            console.log('答案:', answer_str);
            if(answer_str == '不允许查看正确答案'){
                // 获取解析
                var analysis = $(item).find('.exam-analysis-d').text();
                console.log('解析: ', analysis);
                answers.push(analysis)
            }else{
                var answer_arr = answer_str.split('、');
                //console.log(answer_arr);
                //遍历所有选项
                $(item).find('.mt5').each(function (i, mt) {
                    var serial_number = $(mt).find('h3').text().substring(0, 1);
                    if ($.inArray(serial_number, answer_arr) != -1) {
                        //console.log($(mt).find('.mw97').text());
                        answers.push($(mt).find('.mw97').text());
                    }
                })
            }
            question.answer = answers;
            //存本地
            var key = md5(question_stem);
            console.log(question_stem, key);
            localStorage.setItem(key,JSON.stringify(answers));
            questions.push(question);
        })
        exam.questions = questions;
 
        //console.info(JSON.stringify(exam));
        const store_url = host + '/api/test/store';
        GM_xmlhttpRequest({
            method: "post",
            url: store_url,
            data: JSON.stringify(exam),
            headers: {
                "Content-Type": "application/json",
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功')
                    console.log(res.response)
                } else {
                    console.log('失败')
                    console.log(res)
                }
            }
        });
    } else if (path.match(/^\/exam\/test\/userexam.*/g)) {
        //试题后添加按钮
        $('li[name="li_Question"]').each(function (index, item) {
            $(item).find('.row').find('.col-18').eq(0).append('<a href="javascript:void(0);" class="itemBtn"> 参考 </a>')
        })
    } else {
 
    }
 
 
    //点击调用方法 获取答案
    $(document).on("click", ".itemBtn", function (event) {
        const question = $(event.currentTarget).parent().eq(0).children('div').text().trim() || $(event.currentTarget).parent().eq(0).contents().eq(0).text().trim();
        console.log("question", question);
 
        layer.msg(getAnswer(question));
    });
 
    function getAnswer(question){
        //获取host,exam_name,question,
        var data = {};
        data.host = window.location.host;
        data.exam_name = $('#lblExamName').text();
        data.question = question;
        //获取答案
        const get_answer_url = host + '/api/test/getAnswer';
        var answer='emmm~, 祝好运！！';
        var item = localStorage.getItem(md5(question))
        if(item){
            var response = eval("'" + item + "'");
            console.log(JSON.parse(response).join("\n"));
            return JSON.parse(response).join('<br/>');
        }
        console.log("查服务端数据!");
        GM_xmlhttpRequest({
            method: "post",
            url: get_answer_url,
            data: JSON.stringify(data),//{"host":"zqyl.yunxuetang.cn","exam_name":"云信标准化流程","question":"签署完的纸质文件需邮寄到（）存档。"}
            headers: {
                "Content-Type": "application/json",
            },
            onload: function (res) {
                if (res.status === 200) {
                    var response = eval("'" + res.response + "'");
                    console.log(JSON.parse(response).join("\n"));
                    answer = JSON.parse(response).join('<br/>');
                } else {
                    console.log(res);
                }
            }
        });
        return answer;
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
            console.log(cont)
            if (cont.indexOf("请不要走开喔") != -1) {
                document.getElementsByClassName("btnok")[1].click();
                $('#dvWarningView').remove();
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