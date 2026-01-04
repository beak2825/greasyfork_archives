// ==UserScript==
// @name         优课在线辅助脚本
// @namespace    http://www.qs5.org/?UoocAutoLearn
// @version      1.2.181225a
// @description  实现自动挂机看视频，作业自动做题/共享答案功能
// @author       ImDong
// @match        *://*.uooc.net.cn/*
// @match        *://www1.baidu.com/s?uooc=1&*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389862/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/389862/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function (window, $) {

    // 创建对象
    var UoocAutoLearn = window.UoocAutoLearn || {
        apiUrl: 'https://www.qs5.org/tools/szu_tools/index.php'
    };

    // 获取课程列表
    UoocAutoLearn.getCatalogList = function () {
        $.ajax({
            type: "GET",
            url: '/home/learn/getCatalogList',
            data: {
                cid: this.cid
            },
            success: function (response) {
                UoocAutoLearn.loopCatalog(response.data);
            }
        });
    };

    //  遍历课程
    UoocAutoLearn.loopCatalog = function (data) {
        var isFinished = true;
        for (let index = 0; index < data.length; index++) {
            const item = data[index];
            if (item.finished == 0) {
                isFinished = false;
                if (typeof item.children != 'undefined') {
                    UoocAutoLearn.loopCatalog(item.children);
                } else {
                    // 播放这个课程
                    console.log('新的课程', item.number, item.name);

                    UoocAutoLearn.catalog_id = item.id;
                    UoocAutoLearn.chapter_id = item.pid;
                    UoocAutoLearn.video_pos = 0;

                    // 开始下一课程
                    UoocAutoLearn.getUnitLearn();
                }
                break;
            }
        }
        if (isFinished) {
            console.log('恭喜，本课已全看完。');
        }
    };

    // 获取课程进度
    UoocAutoLearn.getCourseLearn = function () {
        $.ajax({
            type: "GET",
            url: '/home/learn/getCourseLearn',
            data: {
                cid: this.cid
            },
            success: function (response) {
                if (response.code != 1) {
                    console.log('Error', response);
                    return;
                }
                UoocAutoLearn.chapter_id = response.data.chapter_id;
                UoocAutoLearn.section_id = response.data.section_id;
                UoocAutoLearn.resource_id = response.data.resource_id;
                UoocAutoLearn.catalog_id = response.data.catalog_id;
                UoocAutoLearn.subsection_id = response.data.subsection_id;
                UoocAutoLearn.parent_name = response.data.parent_name;

                // 如果没有看过
                if (UoocAutoLearn.chapter_id <= 0) {
                    UoocAutoLearn.getCatalogList();
                    return;
                }

                console.log(
                    '课程信息', UoocAutoLearn.parent_name,
                    '章节', UoocAutoLearn.chapter_id,
                    '部分', UoocAutoLearn.section_id,
                    '资源', UoocAutoLearn.resource_id
                );

                // 获取课程观看时间
                UoocAutoLearn.getUnitLearn();
            }
        });
    };

    // 获取当前课程观看时间
    UoocAutoLearn.getUnitLearn = function () {
        $.ajax({
            type: "GET",
            url: '/home/learn/getUnitLearn',
            data: {
                cid: this.cid,
                chapter_id: this.chapter_id,
                section_id: this.section_id,
                catalog_id: this.catalog_id
            },
            success: function (response) {
                // 遍历每一个视频
                var isFinished = true;
                for (let index = 0; index < response.data.length; index++) {
                    const item = response.data[index];
                    if (item.finished == 0) {
                        UoocAutoLearn.video_pos = parseFloat(item.video_pos);
                        UoocAutoLearn.videoSource = item.video_play_list[0].source;
                        UoocAutoLearn.title = item.title;
                        UoocAutoLearn.resource_id = item.id;
                        isFinished = false;

                        console.log('当前任务', UoocAutoLearn.parent_name, UoocAutoLearn.title);

                        // 获取视频时长
                        UoocAutoLearn.getVideoLength();

                        break;
                    }
                }
                // 如果都看完了
                if (isFinished) {
                    // 获取下一节课
                    UoocAutoLearn.getCatalogList();
                }
            }
        });
    };

    // 获取视频长度
    UoocAutoLearn.getVideoLength = function () {
        // var video = document.createElement('video');
        // 加载完成后调用
        // video.onloadeddata = function () {
        UoocAutoLearn.video_length = 0;

        // console.log('总时长', UoocAutoLearn.video_length, '秒, 已看至', UoocAutoLearn.video_pos, '秒');

        // 开始刷新时间
        UoocAutoLearn.markVideoLearn();
        // };
        // video.src = UoocAutoLearn.videoSource;
        return;
    };

    // 刷新时间
    UoocAutoLearn.markVideoLearn = function () {
        this.video_pos = this.video_pos + 10;
        if (this.video_pos > this.video_length && this.video_length > 0) this.video_pos = this.video_length;

        $.ajax({
            type: "POST",
            url: '/home/learn/markVideoLearn',
            data: {
                chapter_id: this.chapter_id,
                cid: this.cid,
                // hidemsg_: true,
                network: 3,
                resource_id: this.resource_id,
                section_id: this.section_id,
                source: 1,
                subsection_id: this.subsection_id,
                video_length: this.video_length == 0 ? 100 : this.video_length,
                video_pos: this.video_pos
            },
            success: function (response) {
                console.log('已看至', UoocAutoLearn.video_pos, '秒, 总', UoocAutoLearn.video_length == 0 ? '未知' : UoocAutoLearn.video_length, '秒');
                if (response.data.finished == 1 || (UoocAutoLearn.video_length > 0 && UoocAutoLearn.video_pos >= UoocAutoLearn.video_length)) {
                    console.log('本课已经结束');
                    // 获取下一节课
                    UoocAutoLearn.getCatalogList();
                    return;
                }
                setTimeout(() => {
                    UoocAutoLearn.markVideoLearn();
                }, 10 * 1000);
            }
        });
    };

    // 获取课程列表
    UoocAutoLearn.homeworkList = function () {
        console.log('homeworkList');

        $.ajax({
            type: "GET",
            url: '/home/task/homeworkList',
            data: {
                cid: this.cid,
                page: 1,
                pagesize: 20
            },
            success: function (response) {
                for (let index = 0; index < response.data.data.length; index++) {
                    const element = response.data.data[index];
                    // 判断是否批改
                    if (element.status_code == "20") {
                        // 提交答案到服务器
                        UoocAutoLearn.examView(UoocAutoLearn.cid, element.id)
                    }
                }
            }
        });
    }

    // 获取作业答案并提交
    UoocAutoLearn.examView = function (cid, tid) {
        console.log('examView', cid, tid);
        $.ajax({
            type: "GET",
            url: '/exam/view',
            data: {
                cid: cid,
                tid: tid
            },
            success: function (response) {
                // 判断是否提交试卷
                if (response.code == 1) {
                    // 提交试卷到服务器
                    UoocAutoLearn.sendExam2Server(cid, tid, response.data);
                }
            }
        });
    }

    // 提交试卷到服务器
    UoocAutoLearn.sendExam2Server = function (cid, tid, data) {
        console.log('sendExam2Server', cid, tid);
        $.ajax({
            type: "POST",
            url: UoocAutoLearn.apiUrl,
            data: {
                cmd: 'save_exam_answer',
                cid: cid,
                tid: tid,
                data: JSON.stringify(data)
            },
            success: function (response) {
                console.log('sendExam2Server', cid, tid, response);
            }
        });
    }

    // 从服务器获取答案
    UoocAutoLearn.getExamAnswer = function () {
        console.log('getExamAnswer', this.tid);
        $.ajax({
            type: "GET",
            url: UoocAutoLearn.apiUrl,
            dataType: "JSONP",
            data: {
                cmd: 'get_exam_answer',
                tid: this.tid
            },
            success: function (response) {
                console.log(response);
                if (response.code == 1) {
                    window._response = response;
                    UoocAutoLearn.answerData = response.data;
                    UoocAutoLearn.loopSetAnchor();
                }
            }
        });
    }

    // 依次遍历题目修改答案
    UoocAutoLearn.loopSetAnchor = function () {
        console.log("loopSetAnchor");
        for (let i = 0; i < UoocAutoLearn.answerData.length; i++) {
            const item = UoocAutoLearn.answerData[i];

            // 获取题目对象
            var anchor = $('#anchor' + item.id).parent('.queContainer');

            window._item = item;
            window._anchor = anchor;

            // 获取题目内容
            var anchor_ti = anchor.find('.ti-q-c').text(),
                answer_ti = $("<div />").html(item.question).text();

            // 题目相同再遍历答案
            if (anchor_ti == answer_ti) {
                // 设置题目绿色背景
                // anchor.find('.ti-q-c').css({ backgroundColor: '#99FF99' });

                // 获取答案
                var ti_alist = anchor.find('.ti-alist label');
                for (let k = 0; k < ti_alist.length; k++) {
                    const a_item = ti_alist[k];
                    // 获取作业答案并提交
                    var ti_k = $(a_item).find('input').val(),
                        ti_v = $(a_item).find('.ti-a-c').text(),
                        an_v = $('<div />').html(item.options[ti_k]).text();

                    // 对比答案是否一致 一致则勾选
                    if (ti_v == an_v) {
                        // 设置题目绿色
                        // $(a_item).find('.ti-a-c').css({ backgroundColor: '#99FF99' })

                        // 题目是否是正确答案
                        if (item.answer.indexOf(ti_k) >= 0) {
                            $(a_item).find('input').click();
                        }
                    } else {
                        // 答案不一致 标红
                        $(a_item).find('.ti-a-c').css({ backgroundColor: 'burlywood' });
                        // 显示数据库原题
                        $(a_item).find('.ti-a-c').append(an_v);
                    }
                }
            }
            // 题目不一致 设置红色
            else {
                // var ti_a_list = $('<ul>');
                // for (let i = 0; i < item.answer.length; i++) {
                //     const element = item.answer[i];
                //     ti_a_list.before('<li>' +  + '</li>')
                // }
                // var ti_q = $('<div>').text("记录题目: ").css({ backgroundColor: 'burlywood' }),
                //     ti_a = $('<span>')

                // ti_q.append("记录正确答案: AA");
                // anchor.find('.ti-q-c').append(ti_q);
                anchor.find('.ti-q-c').css({ backgroundColor: 'burlywood' });
            }
        }
    }

    // 尝试修改页面题目
    UoocAutoLearn.setExamAnswer = function () {
        this.tid = location.pathname.match(/^\/exam\/([0-9]+)/)[1];
        console.log('setExamAnswer', this.tid);

        // 向服务器查询是否有答案
        UoocAutoLearn.getExamAnswer();
    }

    // 遍历添加按钮
    UoocAutoLearn.homeAddBtn = function () {
        console.log("homeAddBtn");
        $('.course-item .course-right-bottom-btn').not('.uooc-auto-learn-btn').each(function (key, item) {
            // 设置未修改过的
            if (typeof item.dataset.btnAdd == "undefined") {
                // 获取标记
                var cid = item.pathname.split('/').pop(),
                    btnHtml = '<a class="course-right-bottom-btn uooc-auto-learn-btn" style="font-size: 12px; width: 58px; margin-left: 4px;" data-cid="' + cid + '">在线挂机</a>';

                if (cid != '%7B%7Bitem.id%7D%7D') {
                    // 设置为已修改
                    item.dataset.btnAdd = 'isAdd';

                    // 修改样式
                    item.style.fontSize = '12px';
                    item.style.width = '58px';

                    // 追加元素
                    $(item).before(btnHtml);
                }
            }
        });
    };

    // 添加百度搜索按钮
    UoocAutoLearn.examAddBaidu = function () {
        // 修改页面样式
        $('body>div.uwidth').css({ marginLeft: '0px' });

        $('.ti-q-c').before('<a href="javascript:;" class="question-item" data-type="baidu">百度搜索</a> | <a href="javascript:;" class="question-item" data-type="qs5">搜索题库</a>');
        $('.question-item').click(function (e) {
            let query = $(this).nextAll('.ti-q-c').text(),
                url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
            switch (this.dataset.type) {
                case "baidu":
                    url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
                    break;
                case "qs5":
                    url = 'https://www.qs5.org/tools/szu_tools/search.html#' + query;
                    break;
                default:
                    url = 'https://www1.baidu.com/s?uooc=1&wd=' + query;
                    break;
            }

            layer.open({
                type: 2,
                title: false,
                shadeClose: true, // 遮罩关闭
                shade: 0.5, // 遮罩透明度
                closeBtn: 0, //不显示关闭按钮
                offset: 'r', // 弹出层位置
                area: ['730px', '100%'], // 大小
                anim: 3, // 动画 向左滑动
                content: url
            });
        });
    };

    // 作业列表页面 尝试获取已经做过的题目然后提交
    UoocAutoLearn.examHomeWork = function () {
        // 获取 cid
        this.cid = location.pathname.match(/^\/home\/course\/([0-9]+)/)[1];
        console.log('examHomeWork', this.cid);

        // 尝试获取答案并提交到服务器
        UoocAutoLearn.homeworkList();
    }

    // 区分页面地址进行修改 只对刷新有效
    UoocAutoLearn.changePage = function () {
        console.log('changePage');

        // /home/course/1083723112#/homework 作业列表页面 location.hash == "#/homework" &&
        if (/^\/home\/course\/[0-9]+/.test(location.pathname)) {
            console.log('home/course');
            UoocAutoLearn.examHomeWork();
            return;
        }
        // /exam/955957832 做题页面
        else if (/^\/exam\/[0-9]+/.test(location.pathname)) {
            console.log("exam");

            // 判断题目是否出来
            if ($('.ti-q-c').length > 0) {
                UoocAutoLearn.setExamAnswer();
                // 添加搜索按钮
                UoocAutoLearn.examAddBaidu();
                return;
            }
        }
        // 已选课程列表
        else if (/^\/home/.test(location.pathname)) {
            // 尝试添加按钮
            UoocAutoLearn.homeAddBtn();

            // 死循环每隔500检测一次按钮
            UoocAutoLearn.addBtnIntervalId = setInterval(() => {
                UoocAutoLearn.homeAddBtn();
            }, 500);

            return;
        }
        // 百度搜索页面 接管链接
        else if (/^\/s/.test(location.pathname) && /^\?uooc=1&/.test(location.search) && /^https?:\/\/.*?\.uooconline\.com\/exam\//.test(document.referrer)) {
            console.log('载入百度');
            UoocAutoLearn.baiduLink();
            return;
        }
        // 到这里就默认定时器处理
        setTimeout(() => {
            UoocAutoLearn.changePage();
        }, 500);
    };

    // 百度搜索页面修改
    UoocAutoLearn.baiduLink = function () {
        $('#content_left .result h3.t a').click(function (e) {
            window.parent.postMessage(this.href, document.referrer);
            return false;
        });
    };

    // 事件回调 页面消息
    UoocAutoLearn.eventMessage = function (e) {
        // 页面宽度
        var w = document.body.clientWidth - 550;
        layer.open({
            type: 2,
            title: false,
            shadeClose: true, // 遮罩关闭
            shade: 0.5, // 遮罩透明度
            closeBtn: 0, //不显示关闭按钮
            offset: 'r', // 弹出层位置
            area: [w + 'px', '100%'], // 大小
            anim: 3, // 动画 向左滑动
            content: e.data
        });
    }

    // 页面加载完成执行绑定
    $(function () {
        // 绑定按钮事件
        $(document).on('click', '.uooc-auto-learn-btn', function () {
            UoocAutoLearn.cid = this.dataset.cid;

            console.log('开始任务', UoocAutoLearn.cid);

            // 结束定时添加按钮的定时器
            clearInterval(UoocAutoLearn.addBtnIntervalId);

            // 获取课程进度
            UoocAutoLearn.getCourseLearn();
        });

        // 监听消息回调 暂时不再需要
        window.addEventListener('message', UoocAutoLearn.eventMessage, false);
    });

    // 注册到全局
    window.UoocAutoLearn = UoocAutoLearn;

    // 修改页面
    UoocAutoLearn.changePage();
})(window, window.jQuery);