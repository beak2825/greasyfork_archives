// @license MIT
// ==UserScript==
// @name         168网校刷课
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  本插件仅限学习交流使用，禁止商业使用!
// @author       original
// @grant        none
// @match        *://*.168wangxiao.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/497715/168%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/497715/168%E7%BD%91%E6%A0%A1%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 学期
    var semester = '';

    // 视频从头播放
    var videoScratch = false;

    // 学习状态
    var stateOfLearning = false;

    // 用到的页面地址
    var uriHashMap = {
        'learning_center': '#/LearningCenter',
        'course_details': '#/learningcenter/CourseDetails',
        'learning_center_details': '#/learningcenter/LearningCentreDetails',
    }

    // 选择题选项
    var optionMap = [...Array(26).keys()].map(i => String.fromCharCode(i + 65));

    // 待执行的答题\视频
    var taskQueue = {'video': [], 'chapter': []}

    // 执行中的答题\视频
    var taskExecQueue = {
        getItem: function(key) {
            return JSON.parse(localStorage.getItem(key))
        },
        setItem: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value))
        },
        removeItem: function(key) {
            localStorage.removeItem(key)
        },
        modifyState: function(key) {
            let data = JSON.parse(localStorage.getItem(key))
            data.state = 1;
            localStorage.removeItem(key)
            localStorage.setItem(key, JSON.stringify(data))
        },
        getLen: function(cls) {
            let len = localStorage.getItem(cls+'-len');
            return parseInt(null == len ? 0 : len);
        },
        setLen: function(cls, num) {
            let len = parseInt(localStorage.getItem(cls+'-len'));
            localStorage.setItem(cls+'-len', (len ? len : 0) + parseInt(num));
        }
    }

    // 自动执行
    var autoExecList = [];

    // 计划任务 任务完成后销毁
    var scheduledTasks = [];

    // 定时 自动执行函数
    var autoExec = setInterval(function(){
        if (0 < autoExecList.length) {
            autoExecList.shift()()
        }
    }, 1500);
    scheduledTasks.push(autoExec)

    // 监听新窗口网络异常
    var autoMonitorError = setInterval(function() {
        let message = $('.ant-message').find('span')
        if (0 < message.length) {
            let text = message.eq(0).text().replace(/\s/g, '');
            if (text.indexOf('网络异常')) {
                window.opener = null;
                window.open('', '_top');
                window.close();
            }
        }
    }, 300);
    scheduledTasks.push(autoMonitorError)

    // 监听视频播放弹框
    var autoMonitorChanges = setInterval(function() {
        let modal = $('.ant-modal-body > .ant-modal-confirm-body-wrapper').children()
        if (0 < modal.length) {
            let btnText = modal.eq(1).text().replace(/\s/g, '');
            if (btnText) {
                switch(btnText) {
                    case '重新观看':
                        msg('检测到播放异常，即将恢复', 'red');
                        videoScratch = true;
                        learnPlayVideo();
                        break;

                    case '关闭':
                        // 结束任务
                        missionOver('video', getUrlParam('ctid'));
                        break;
                }
                modal.eq(1).find('button').click();
            }
        }
    }, 300);
    scheduledTasks.push(autoMonitorChanges)

    // 执行任务
    var taskLock = false;
    var execTask = setInterval(function() {
        if (!taskLock) {
            taskLock = true;
            // 播放视频
            // 最多打开13个视频窗口
            if (0 < taskQueue.video.length && 13 > taskExecQueue.getLen('video')) {
                let video = taskQueue.video.shift();
                let videock = "video-"+video.chapterid;
                localStorage.setItem("stuKcId", video.kcid);
                localStorage.setItem("stuChapterId", video.chapterid);
                if (null == taskExecQueue.getItem(videock)) {
                    // 任务数量 + 1
                    taskExecQueue.setLen('video', 1);
                }
                // 添加任务
                taskExecQueue.setItem(videock, video);


                // 打开新标签页
                msg("正在打开视频播放："+video.title);
                window.open(uriHashMap.learning_center_details+'?ctid='+video.chapterid, '_blank');
            }
            // 答题 - 视频放完或小于3个视频任务再答题
            if (!taskQueue.video.length
                && 0 < taskQueue.chapter.length
                && 5 >= taskExecQueue.getLen('video'))
            {
                let chapter = taskQueue.chapter.shift();
                let chapterck = "chapter-"+chapter.chapterid;
                localStorage.setItem("stuKcId", chapter.kcid);
                localStorage.setItem("stuChapterId", chapter.chapterid);
                if (null == taskExecQueue.getItem(chapterck)) {
                    // 任务数量 + 1
                    taskExecQueue.setLen('chapter', 1);
                }
                // 添加任务
                taskExecQueue.setItem(chapterck, chapter);

                // 打开新标签页
                msg("正在打开章节测试："+chapter.title);
                window.open(uriHashMap.learning_center_details+'?ctid='+chapter.chapterid, '_blank');
            }
        }
        taskLock = false;
    }, 4300);
    scheduledTasks.push(execTask)

    // 做题\看片
    var actualExecTask = setInterval(function() {
        // 看片
        learnPlayVideo();
        // 做题
        learnChapterTest();
    }, 1000);
    scheduledTasks.push(actualExecTask);

    // 监听任务完成状态
    var monitorTaskStatus = setInterval(function() {
        if (stateOfLearning
            && !currentIsLearning()
            && !taskQueue.video.length
            && !taskQueue.chapter.length
            && 0 == taskExecQueue.getLen('video')
            && 0 == taskExecQueue.getLen('chapter'))
        {
            msg('当前课目任务已全部完成，即将跳转到下一未完成课目！！！', 'green');
            autoExecList.push(learningCenter);
            location.href = uriHashMap.learning_center

        }
    }, 4300);
    scheduledTasks.push(monitorTaskStatus)

    // 初始化控制框
    initPanel()

    // 检查当前学期
    checkSemester()

    // 学习页屏蔽事件及隐藏控制 (这块可能没啥用)
    if (currentIsLearning()) {
        // 屏蔽关闭询问
        window.onbeforeunload = null;
        if (stateOfLearning) {
            // 忽略F12
            $(document).on('keydown', function(obj) {
                if ('F12' === obj.originalEvent.code) {
                    msg('检测到[F12]事件！！！', 'red')
                    return false;
                }
            });
            // 监听窗口大小变化
            $(window).resize(function() {
                msg('检测到窗口变化！！！', 'red')
                return false;
            });
        }
        // 隐藏控制框
        setTimeout(function() {$('#msgSlider').click()}, 100);
    }

    // 开始学习
    $('#startHangUp').on('click', function() {
        start();
        stateOfLearning = true;
        $('#startHangUp').text('正在学习')
        $('#startHangUp').attr('disabled', true)
        $('#startHangUp').css({'background': 'white', 'color': 'black'})
    })

    // 开始任务
    function start() {
        let uriMap = {
            'learning_center': {uri: uriHashMap.learning_center, func: 'learningCenter'},
            'course_details': {uri: uriHashMap.course_details, func: 'courseDetails'},
            'learning_center_details': {uri: uriHashMap.learning_center_details, func: 'learningCenterDetails'},
        };
        let current;
        let toLearn = true;
        $.each(uriMap, function(i, item) {
            current = null == location.hash.match(item.uri) ? null : item;
        });
        if (null != current) {
            toLearn = false;
            eval(current.func)()
        }
        if (toLearn) {
            autoExecList.push(learningCenter);
            location.href = uriMap.learning_center.uri;
        }
    }

    // 学习中心
    function learningCenter(list) {
        if (undefined === list) {
            curl('plan/list', {
                "page": 1,
                "rows": 15,
                "semester": semester,
                "type": "1"
            }, learningCenter);
            return false;
        }

        if (1 > list.length) {
            msg('课程列表数据获取异常', 'red')
            console.error('课程列表数据获取异常')
        } else {
            let isOver = true;
            for (let i=0; i < list.length; i++) {
                if (0 > list[i].description.indexOf('录制中') && 100 > list[i].duration) {
                    isOver = false;
                    msg("正在学习...")
                    msg('正在跳转至：'+list[i].name)
                    autoExecList.push(courseDetails)
                    location.href = uriHashMap.course_details+'?id='+list[i].plan_id+'&state=0';
                    break;
                }
            }
            if (true === isOver) {
                msg('你已学完所有课程！', 'green')
                $.each(scheduledTasks, function(i, timer) {
                    // 清除所有任务
                    clearInterval(timer)
                });
                stateOfLearning = false;
                location.href = uriHashMap.learning_center
                $('#startHangUp').text('下学期再来')
            }
        }
    }

    // 课程详情
    function courseDetails(data) {
        let kcid = getUrlParam('id');
        if (undefined === data) {
            curl('plan/view', {
                "id": kcid,
                "grade_id": localStorage.getItem('grade_id')
            }, courseDetails);
            return false;
        }
        if (undefined === data.id) {
            msg('课程目录获取异常', 'red');
            console.error('课程目录获取异常')
        } else {
            if (100 > data.duration) {
                msg("正在执行：" + data.category + ' - ' + data.name)
                $.each(data.chapter, function(i, chap) {
                    $.each(chap.items, function(key, item) {
                        if (!item.isover) {
                            let video = $.parseJSON(item.video);
                            let info = {
                                kcid: kcid,
                                chapterid: item.id,
                                state: 0,
                                title: chap.title.trim()+"\\"+item.title.trim()
                            }
                            0 < video.length ? taskQueue.video.push(info) : taskQueue.chapter.push(info);
                        }
                    });
                });
                return false;
            } else {
                learningCenter();
                location.href = uriHashMap.learning_center
            }
        }
    }

    // 播放视频
    function learnPlayVideo() {
        let player = $('video')[0];
        let ctid = getUrlParam('ctid');
        if (undefined === player) {
            return false;
        }
        let startPlay = function() {
            setTimeout(function() {
                player.addEventListener('ended', function() {
                    // 结束任务
                    missionOver('video', ctid);
                });
                player.addEventListener('pause', function(o) {
                    msg('检测到暂停操作，即将恢复', 'red')
                    startPlay();
                });
                player.muted = true;
                player.play();
            }, 300)
        }
        if (videoScratch) {
            player.currentTime = 0;
        }
        videoScratch = false;
        startPlay();
    }

    // 章节测试
    function learnChapterTest(info) {
        let ctid = getUrlParam('ctid');
        let chapter = taskExecQueue.getItem("chapter-"+ctid);

        if (null === chapter) {
            return false;
        }

        if (undefined === info && 0 == chapter.state) {
            curl('chapter/view', {
                "id": ctid
            }, learnChapterTest);
            return false;
        }

        if (0 === chapter.state) {
            msg('正在做题：' + chapter.title)

            // 更新任务执行状态
            taskExecQueue.modifyState("chapter-"+ctid);

            let questions = $('.videodisplayh3 > div > div').children()
            $.each(questions, function(i, item) {
                let question = info.questionlist[i];
                switch (question.que_type_str) {
                    case '单选题':
                    case '多选题':
                    case '判断题':
                        switch(question.answer.trim()) {
                            case '√':
                                question.answer = '对';
                                break;
                            case '×':
                                question.answer = '错';
                                break;
                        }
                        var answer = question.answer.match(/[\u4e00-\u9fa5|\w]/g);
                        var options = $(item).find('.answers label');
                        for (let o = 0; o < options.length; o++) {
                            let val = $(options[o]).find('input').val();
                            if (1 < answer.length) {
                                $.each(answer, function(k, v) {
                                    if(val == optionMap.indexOf(v)) {
                                        (function(obj) {
                                            setTimeout(function() {
                                                $(obj).eq(0).click();
                                            }, 50)
                                        })(options[o])
                                    }
                                })
                            } else if(val == optionMap.indexOf(answer[0]) || val == answer[0]) {
                                $(options[o]).eq(0).click();
                            }
                        }
                        break;

                    default: // 填空题
                        answer = []
                        var answerStr = question.answer.trim();
                        try {
                            var ap = $(answerStr);
                            var app = $(answerStr).find('p');
                            var work = function(ans) {
                                $.each(ans, function(k, p) {
                                    let text = $(p).text().trim()
                                    text = text.replace(/^答案(\:|：)?/gi, '')
                                    if (text) {
                                        answer.push(text)
                                    }
                                })
                            }
                            if(0 < ap.length || 0 < app.length) {
                                0 < ap.length ? work(ap) : work(app)
                            } else {
                                answer.push(answerStr)
                            }
                        } catch (err) {
                            answer.push(answerStr)
                        }
                        var inpuTextarea = $(item).find('.ant-input').get(0);
                        $(inpuTextarea).val(answer.join("\r\n"))
                        inpuTextarea.dispatchEvent(new InputEvent('input', {
                            inputType: 'insertText'
                        }))
                        break;
                }
            })

            msg(info.title+"：已完成")

            // 提交答案
            setTimeout(function(){
                let submitBtn = $('.ant-tabs-tabpane').find('button.ant-btn');
                submitBtn.removeAttr('disabled');
                submitBtn.click();
            }, 1500)

            // 结束任务
            missionOver('chapter', ctid);
        }
    }

    // 学习页
    function learningCenterDetails() {
        msg('请勿在当前页面进行任何操作！！！', 'red');
        return false;
    }

    // 检查当前是不是学习页
    function currentIsLearning() {
        return null !== location.hash.match(uriHashMap.learning_center_details)
    }

    // 任务结束操作
    function missionOver(cls, ctid) {
        // 任务减一
        taskExecQueue.setLen(cls, -1);
        // 删除已完成任务
        taskExecQueue.removeItem(cls+"-"+ctid);

        // n秒后关闭窗口
        setTimeout(function() {
            window.opener = null;
            window.open('', '_top');
            window.close();
        }, Math.floor(Math.random() * (7500 - 3000)) + 3000);
    }

    // 当前学期
    function checkSemester(list) {
        if (undefined === list) {
            curl('semester/list', {}, checkSemester);
            return false;
        }
        if (1 > list.length) {
            msg('学期数据获取异常', 'red')
            console.error('学期数据获取异常')
        } else {
            $.each(list, function(i, item) {
                if ('1' == item.state) {
                    semester = item.name
                    msg('<p style="margin-top: -15px; font-size: 16px;" align="center"><strong>『'+ semester+'』</strong></p>')
                }
            })
        }
    }

    // 操作框
    var boxShow = true;
    $('#msgSlider').click(function () {
        let msgSlider = $('#msgSlider');
        let autoHangUpBox = $('#autoHangUpBox')
        if (true === boxShow) {
            boxShow = false;
            msgSlider.text(">>")
            msgSlider.css('padding-right', '20px')
            msgSlider.css('padding-right', '8px')
            autoHangUpBox.animate({left: '-200px'})
        } else {
            boxShow = true;
            msgSlider.text("<<")
            msgSlider.css('padding-right', '0px')
            msgSlider.css('padding-right', '30px')
            autoHangUpBox.animate({left: '0px'})
        }
    })
})();

// 请求接口数据
function curl(uri, param, func) {
    let host = "https://xatu.168wangxiao.com/other/student/";
    fetch(host + uri, {
        headers: {
            "authorization": localStorage.getItem('stuToken'),
            "content-type": "application/json",
        },
        body: JSON.stringify(Object.assign(param)),
        method: "POST",
    })
        .then(response => response.json())
        .then(data => {
        if (200 == data.errCode) {
            if (undefined !== func) func(data.data)
        } else {
            console.error('接口返回异常:', data.message);
        }
    })
        .catch((error) => {
        console.error('接口请求异常:', error);
    });
}

// 控制框
function initPanel() {
    $('body').append('<style type="text/css">#msgBox::-webkit-scrollbar{width:0!important}</style><div id="autoHangUpBox"style="font-family: 黑体; z-index: 999; width: 200px;height: 400px; background: white; opacity: 1; position: absolute; bottom: 15px; left: 0px; margin: 0px; border-radius: 5px;"><button id="startHangUp"style="width: 100%; height: 40px; border-radius: 0px; background: green; font-size: 18px; color: white;font-weight: bold; cursor: pointer;">开始学习</button><div id="msgBox"style="width: 100%; height: 360px; background: black; font-size: 14px; color: white; border-radius: 0px; overflow-y: scroll;padding-top: 10px"></div><div id="msgSlider"status="open"style="z-index: 998;background: Gainsboro; width: 25px;height: 120px;position: relative; bottom: 225px; left: 200px; line-height: 120px;border-radius: 0px 5px 5px 0px; font-size:20px; text-align: center; padding-right: 30px; color: white; cursor: pointer; font-weight: bold;">《</div></div>')
}

// 向控制框输出信息
function msg(str, color) {
    if (!color) {
        color = 'white'
    }
    $('#msgBox').append('&nbsp;>_&nbsp;<p style="color:' + color + '"><strong>' + str + '</strong></p>')
    $('#msgBox').scrollTop($('#msgBox')[0].scrollHeight);
}

// 读取URI参数
function getUrlParam(m) {
    var sValue = location.hash.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
}
