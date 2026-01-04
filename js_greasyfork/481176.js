// ==UserScript==
// @name         易班视频课程
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动将视频进度拉满
// @author       木木
// @match        https://www.yooc.me/*/courses
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yooc.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481176/%E6%98%93%E7%8F%AD%E8%A7%86%E9%A2%91%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/481176/%E6%98%93%E7%8F%AD%E8%A7%86%E9%A2%91%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function createFloatingBall() {
        // 创建悬浮球
        var ball = document.createElement('div');
        ball.style.position = 'fixed';
        ball.style.top = '50%';
        ball.style.left = '50%';
        ball.style.width = '50px';
        ball.style.height = '50px';
        ball.style.background = 'blue';
        ball.style.borderRadius = '50%';
        ball.style.cursor = 'move';
        ball.style.display = 'flex';
        ball.style.alignItems = 'center';
        ball.style.justifyContent = 'center';
        ball.style.color = 'white';
        ball.innerText = '木';
        document.body.appendChild(ball);

        // 创建悬浮窗
        var float_window = document.createElement('div');
        float_window.style.position = 'fixed';
        float_window.style.top = '50%';
        float_window.style.left = '50%';
        float_window.style.width = '200px';
        float_window.style.height = '200px';
        float_window.style.background = 'white';
        float_window.style.border = '1px solid blue';
        float_window.style.display = 'none';
        document.body.appendChild(float_window);
        //为悬浮窗顶部添加一个div用来存放选项卡
        var tab_div = document.createElement('div');
        tab_div.style.display = 'flex';
        tab_div.style.justifyContent = 'space-around';
        tab_div.style.alignItems = 'center';
        tab_div.style.height = '30px';
        tab_div.style.background = 'blue';
        float_window.appendChild(tab_div);
        //为悬浮窗添加选项卡
        var tab1 = document.createElement('div');
        tab1.style.color = 'white';
        tab1.style.cursor = 'pointer';
        tab1.innerText = '开始';
        tab_div.appendChild(tab1);
        var tab2 = document.createElement('div');
        tab2.style.color = 'white';
        tab2.style.cursor = 'pointer';
        tab2.innerText = '进度';
        tab_div.appendChild(tab2);
        var tab3 = document.createElement('div');
        tab3.style.color = 'white';
        tab3.style.cursor = 'pointer';
        tab3.innerText = '日志';
        tab_div.appendChild(tab3);
        var tab4 = document.createElement('div');
        tab4.style.color = 'white';
        tab4.style.cursor = 'pointer';
        tab4.innerText = '关闭';
        tab_div.appendChild(tab4);
        //为悬浮窗添加选项卡内容

        //为选项卡内容添加开始内容
        var start_content = document.createElement('div');
        start_content.style.display = 'block';
        start_content.style.justifyContent = 'center';
        start_content.style.alignItems = 'center';
        var start_button = document.createElement('button');
        start_button.innerText = '开始所有课程';
        start_button.onclick = function () {
            start_all_class();
        }
        start_content.appendChild(start_button);
        float_window.appendChild(start_content);
        //为选项卡内容添加进度内容
        var progress_content = document.createElement('div');
        progress_content.style.display = 'none';
        progress_content.style.justifyContent = 'center';
        progress_content.style.alignItems = 'center';
        progress_content.innerText = '点击进度';
        float_window.appendChild(progress_content);
        //为选项卡内容添加日志内容
        var log_content = document.createElement('div');
        log_content.style.display = 'none';
        log_content.style.justifyContent = 'center';
        log_content.style.alignItems = 'center';
        //在log_content中添加一个div用来存放日志，可以滚动，添加一个方法用来向其中添加日志，自动滚动到底部
        var log_div = document.createElement('div');
        log_div.style.width = '200px';
        log_div.style.height = '170px';
        log_div.style.overflow = 'auto';
        //设置日志字体大小
        log_div.style.fontSize = '12px';
        //设置日志背景颜色
        log_div.style.background = 'black';
        //设置日志字体颜色
        log_div.style.color = 'white';
        log_content.appendChild(log_div);
        //添加一个方法用来向其中添加日志，自动滚动到底部
        window.add_log = function (log) {
            var log_item = document.createElement('div');
            log_item.innerText = log;
            log_div.appendChild(log_item);
            log_div.scrollTop = log_div.scrollHeight;
        }
        add_log('日志1');
        float_window.appendChild(log_content);
        //为选项卡内容添加点击事件
        tab1.onclick = function () {
            start_content.style.display = 'block';
            progress_content.style.display = 'none';
            log_content.style.display = 'none';
        }
        tab2.onclick = function () {
            start_content.style.display = 'none';
            progress_content.style.display = 'block';
            log_content.style.display = 'none';
        }
        tab3.onclick = function () {
            start_content.style.display = 'none';
            progress_content.style.display = 'none';
            log_content.style.display = 'block';
        }
        tab4.onclick = function () {
            float_window.style.display = 'none';
            ball.style.display = 'flex';
        }



        // 添加拖动功能
        ball.onmousedown = function (event) {
            ball.style.position = 'absolute';
            ball.style.zIndex = 1000;
            function moveAt(pageX, pageY) {
                ball.style.left = pageX - ball.offsetWidth / 2 + 'px';
                ball.style.top = pageY - ball.offsetHeight / 2 + 'px';
            }

            moveAt(event.pageX, event.pageY);

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            ball.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                ball.onmouseup = null;
            };
        };

        ball.ondragstart = function () {
            return false;
        };

        // 添加双击展开悬浮窗的功能
        /*ball.ondblclick = function () {
            float_window.style.display = 'block';
            ball.style.display = 'none';
        };*/
        ball.onclick = function () {
            start_all_class()
        }
    }

    createFloatingBall();
    //获取cookie中key对应的值
    function get_cookie_item(key) {
        //获取cookie中key对应的值
        return document.cookie.split(';').map(function (c) {
            return c.trim().split('=');
        }).filter(function (pair) {
            return pair[0] === key;
        }).pop()[1];
    }
    //添加加载完成监听
    window.addEventListener('load', function () {
        console.log(get_cookie_item('csrftoken'));
    });

    function join_class(course_id) {
        const join_class_url = 'https://www.yooc.me/change_enrollment/ajax';
        $.ajax({
            url: join_class_url,
            type: 'post',
            dataType: 'json',
            data: {
                csrfmiddlewaretoken: get_cookie_item('csrftoken'),
                id: course_id,
            },
        }).done(function (data) {
            //可能的返回值{"message":"报名成功","code":200,"data":{}}
            if (data.code === 200) {
                add_log('报名成功：' + course_id);
                add_log('报名后重新开始课程：' + course_id);
                start_class(course_id);
            } else {
                add_log('报名失败：' + course_id);
            }
        }).fail(function () {
            window.add_log('报名失败：' + course_id);
            alert('报名失败：' + course_id);
            return;
        })
    }
    //进入学习
    function enter_class(course_link) {
        //获取视频学习页面的html
        $.ajax({
            url: course_link,
            type: 'get',
            dataType: 'html',
        }).done(function (data) {
            //获取csrfmiddlewaretoken
            var csrfmiddlewaretoken = get_cookie_item('csrftoken');
            if (!csrfmiddlewaretoken) {
                window.add_log('获取csrfmiddlewaretoken失败');
                alert('获取csrfmiddlewaretoken失败');
                return;
            }
            //获取ajax_url
            //可能的值https://www.yooc.me/mobile/courses/YOOC/CC1640/20190806/xblock/i4x:;_;_YOOC;_CC1640;_video;_836361beb52b4c9cae4968afda38a941/handler/xmodule_handler/save_user_state
            var ajax_url ='https://www.yooc.me'+ data.match(/ajax_url.*?value="(.*?)"/)[1];
            if (!ajax_url) {
                window.add_log('获取ajax_url失败');
                alert('获取ajax_url失败');
                return;
            }
            let post_data = {
                "saved_video_position": "00:00:01",
                "video_duration": "00:00:02",
                'done': true
            };
            post_data['csrfmiddlewaretoken'] = csrfmiddlewaretoken;
            //获取html中的所有class不为zm的li标签中的a标签的href属性值
            var courseware_list = $(data).find('li:not(.zm) a').map(function () {
                return $(this).attr('href');
            }).get();
            for (const courseware of courseware_list) {
                $.ajax({
                    url: courseware,
                    type: 'get',
                    dataType: 'html',
                }).done(function (data) {
                    var ajax_url ='https://www.yooc.me'+ data.match(/ajax_url.*?value="(.*?)"/)[1];
                    if (!ajax_url) {
                        window.add_log('获取ajax_url失败');
                        alert('获取ajax_url失败');
                        return;
                    }
                    $.ajax({
                        url: ajax_url,
                        type: 'POST',
                        data: post_data
                    }).done(function (data) {
                        add_log('进入学习成功');
                    }).fail(function () {

                    })
                })
            }

        }).fail(function () {
            window.add_log('获取视频学习页面的html失败');
            alert('获取视频学习页面的html失败');
            return;
        })
    }
    //开始课程
    function start_class(course_id) {
        const course_about_url = `https://www.yooc.me/mobile/courses/about/ajax?id=${course_id}`;
        $.ajax({
            url: course_about_url,
            type: 'get',
            dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader("X-CSRFToken", get_cookie_item('csrftoken'));
            },
        }).done(function (data) {

            //如果text是报名学习
            if (data.data.buttonStatus.text === '报名学习') {
                join_class(course_id);
                return;
            }
            //如果text是进入学习
            if (data.data.buttonStatus.text === '进入学习') {
                enter_class(data.data.link);
                return;
            }
        }).fail(function () {
            window.add_log('获取课程信息失败');
            // alert('获取课程信息失败');
            return;
        })


    }
    //开始所有课程
    function start_all_class() {
        add_log('开始所有课程');
        if (window.location.href.indexOf('courses') === -1) {
            window.add_log('请在课程页面首页执行');
            alert('请在课程页面首页执行');
            return;
        }
        //正则获取客群id。https://www.yooc.me/mobile/group/39818/courses
        var group_id = window.location.href.match(/group\/(\d+)\//)[1];
        if (!group_id) {
            window.add_log('获取客群id失败');
            alert('获取客群id失败');
            return;
        }
        add_log('客群id：' + group_id);
        //获取课程列表
        $.ajax({
            url: `https://www.yooc.me/mobile/group/courses/search?group_id=${group_id}&page=1`,
            type: 'get',
            dataType: 'json',
        }).done(function (data) {
            add_log('获取课程列表成功');
            for (const course of data['courses']) {
                if (course.course_type === '1') {
                    add_log('跳过外链课程：' + course.course_title);
                    continue;
                }
                add_log('开始课程：' + course.course_title);
                start_class(course.course_id);
            }
        }).fail(function () {
            window.add_log('获取课程列表失败');
            alert('获取课程列表失败');
            return;
        })

    }
    // Your code here...
})();
