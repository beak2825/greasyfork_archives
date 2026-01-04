// ==UserScript==
// @name         四川干部网络学院学习
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  能用就行.jpg
// @author       赵风
// @license      MIT
// @include      https://web.scgb.gov.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520899/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/520899/%E5%9B%9B%E5%B7%9D%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


window.onload = function() {
    //等待3秒后开始
    setTimeout(Start, 1000 );
    //已经看完的课程量
    let study_number = 0;
    //每个课程只点击一次
    let clickedCourses = new Set();
    //获取视频总数量
    var page = document.querySelector('.ivu-page-total');
    var CourseNumber = 0;
    if(page){
         CourseNumber =parseInt(page.innerText.replace(/\D/g, ''), 10);
    }
    //总视频数量
    console.log(CourseNumber);

    //获取当前列表所有课程信息
    async function getCourse()
    {
        //学习当前页面
        var CourseBox = document.querySelectorAll('.course-box.m_r_10.pointer.m_b_20');
        if(CourseBox.length === 0){
            return ;
        }
        console.log("length=",CourseBox.length);
        for(let i = 0 ; i < CourseBox.length;i ++)
        {
            console.log("i=",i);
            const course = CourseBox[i];
            //获取标题对象，要等到上一个课程学完才会点击下一个课程
            if (!CheckStudyTime(course) && !clickedCourses.has(course)) {
                course.click(); // 点击课程
                clickedCourses.add(course); // 标记为已点击

                // 等待课程学完
                await waitUntilSignal(); // 课程播放完成后会接收信号，等待信号
                console.log("接受到信号");

            }



            //             //设置定时器，每隔一分钟检测一次
            //             const timerId = setInterval(function(){
            //                 //检测课程是否学完,
            //                 if(CheckStudyTime(course))
            //                 {
            //                     //停止计时器
            //                     clearInterval(timerId);
            //                     study_number += 1;
            //                     console.log("学习完成");
            //                     console.log(study_number);

            //                     //学完8个直接点击下一页
            //                     if(study_number % 8 == 0)
            //                     {
            //                         var next = document.querySelector('.ivu-page-next');
            //                         next.click();
            //                         //再次调用继续刷课
            //                         setTimeout(getCourse, 1000 );
            //                     }

            //                 }
            //             },1000 * 60);
            //console.log(study_number);

        }
        //该页学习完成后就点击下一页
        console.log("下一页");
        var next = document.querySelector('.ivu-page-next');
        next.click();
        //再次调用继续刷课
        setTimeout(getCourse, 1000 );
    }

    // 工具函数：等待某条件满足
    function waitUntilSignal() {
        //返回一个定时器，
        return new Promise((resolve) => {
            const channel = new BroadcastChannel('page_close_channel');
            channel.onmessage = (event) => {
                if (event.data === '视频已看完') {
                    resolve();  // 收到信号后，resolve
                }
            };
        });
    }
    //检测是否学习完成
    function CheckStudyTime(course)
    {
        //提取学时信息
        var span = course.querySelector('.fs_16.c_999');  //.querySelector('span[data-v-71acbaee]')
        // 提取文本内容
        const text = span.innerText;
        // 使用正则表达式提取已经学的学时和总学时
        //const match = text.match(/(\d+\.?\d*)学时 \/(\d+\.?\d*)学时/);
        const match = text.match(/(\d+(\.\d+)?)\s*学时/g).map(h => parseFloat(h.match(/(\d+(\.\d+)?)/)[0]));
        console.log(match);
        // 判断是否匹配到学时信息
        if (match) {
            // 分别保存已经学的学时和总学时
            const completedHours = parseFloat(match[0]); // 已经学的学时
            const totalHours = parseFloat(match[1]);    // 总学时

            //console.log('已学学时:', completedHours);  // 输出已经学的学时
           // console.log('总学时:', totalHours);        // 输出总学时

             //定义容差进行比较
            const epsilon = 1e-10;
            //学完了
            if(Math.abs(completedHours - totalHours) < epsilon)
            {
                return true;
            }
            else
            {
                //没有学完返回false
                return false;
            }
        } else {
            //没有找到学时信息也点一下
            console.log('未找到学时信息');
            return true;
        }

    }
    //按下在线学习按钮
    function OnlineStudyButtion()
    {
        var online = document.querySelector('.study-btn.c_fff.p_lr_5.txt_center.br_4.pointer');
        if(online){
            online.click();
            //点击完成后关闭页面
            setTimeout(window.close(),2000);
        }


    }

    //自动播放
    function AutoPlay()
    {
         let lastTime = 0; // 记录视频上一次的播放时间
        let cnt = 0;
        var list;
        //获取视频播放列表
        var list_1 = document.querySelector('.tab-list')
        if(!list_1){
            return;
        }
        list = list_1.querySelectorAll('.item');
        console.log(list.length);
    
        //检测视频当前是否正在播放
        const video = document.querySelector('video');

        //设置播放静音
        video.muted = true;
        video.play();
        // 视频卡死检测逻辑
        function checkVideoStalled() {
            if (video.currentTime === lastTime && !video.paused && !video.ended) {
                console.log('检测到视频卡死，尝试恢复播放');
                video.pause();
                setTimeout(() => video.play().catch(err =>{
                    console.error('恢复播放失败:', err);
                    list[cnt ].click();
                    cnt += 1;
                }, 500));
            } else {
                lastTime = video.currentTime; // 更新播放进度
            }
        }

        // 定时轮询，检测视频卡死
        const checkInterval = setInterval(() => {
            checkVideoStalled();
        }, 1000 * 60 * 3); // 每3分钟检测一次
        //设置播放监听器检测自动播放窗口

        video.addEventListener('play', () => {

            //继续播放弹窗
            var check = document.querySelector('.ivu-btn.ivu-btn-error');   //ivu-btn.ivu-btn-error   ivu-modal-footer
            if(check)
            {
                //console.log("自动播放窗口");
                check.click();
            }
        })

        //设置暂停监听器
        video.addEventListener('paused', () => {

            video.play();
        })

        //设置监听器，这个切换视频可以多次触发,全部播放完成后关闭页面，默认从第一个开始
        video.addEventListener('ended', () => {
            console.log('视频播放完成');
            cnt += 1;
            console.log(cnt);
            if(cnt >= list.length)
            {
                const channel = new BroadcastChannel('page_close_channel');
                window.addEventListener('beforeunload', () => {
                    channel.postMessage('视频已看完');
                });

                //等待20s后关闭页面，立马关闭学时可能刷新不过去
                setTimeout(window.close(),1000 * 20);
            }
            else
            {
                // 切换到下一个视频
                list[cnt].click();

                // 确保播放下一个视频
                setTimeout(() => {
                    const newVideo = document.querySelector('video');
                    if (newVideo) {
                        newVideo.muted = true;
                        newVideo.play().catch(err => console.error('无法播放下一个视频:', err));
                    }
                }, 1000);
            }
        });

    }
    //随机鼠标键盘操作，模拟用户
    function simulateUserActivity() {
        // 模拟鼠标事件
        function simulateMouseEvent() {
            const eventTypes = ['mousemove', 'mousedown', 'mouseup', 'click'];
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

            // 获取视频元素
            const video = document.querySelector('video');

            // 如果没有 video 元素，执行鼠标移动操作，但不执行点击
            if (!video) {
                if (eventType === 'click') return; // 不执行点击操作
                const x = Math.floor(Math.random() * window.innerWidth);
                const y = Math.floor(Math.random() * window.innerHeight);

                // 触发鼠标事件
                const mouseEvent = new MouseEvent(eventType, {
                    clientX: x,
                    clientY: y,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(mouseEvent);  // 在文档上触发事件
            } else {
                // 如果有 video 元素，则执行点击操作
                const videoRect = video.getBoundingClientRect();
                const x = Math.floor(Math.random() * (videoRect.right - videoRect.left)) + videoRect.left;
                const y = Math.floor(Math.random() * (videoRect.bottom - videoRect.top)) + videoRect.top;

                // 触发点击事件一次
                const mouseEvent = new MouseEvent(eventType, {
                    clientX: x,
                    clientY: y,
                    bubbles: true,
                    cancelable: true
                });
                video.dispatchEvent(mouseEvent);  // 在视频元素上触发点击

                // 如果视频被暂停，则恢复播放
                if (video.paused) {
                    video.play();
                }
            }

            // 模拟键盘事件
            function simulateKeyboardEvent() {
                const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
                const key = keys[Math.floor(Math.random() * keys.length)];
                const keyEvent = new KeyboardEvent('keydown', {
                    key: key,
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(keyEvent);
            }

            // 模拟滚动事件
            function simulateScrollEvent() {
                const scrollTop = Math.floor(Math.random() * document.body.scrollHeight);
                window.scrollTo(0, scrollTop);
            }

            // 随机延迟后执行模拟操作，避免阻塞页面
            function performRandomAction() {
                const randomAction = Math.floor(Math.random() * 3);  // 随机选择操作
                switch (randomAction) {
                    case 0:
                        simulateMouseEvent();  // 模拟鼠标事件
                        break;
                    case 1:
                        simulateKeyboardEvent();  // 模拟键盘事件
                        break;
                    case 2:
                        simulateScrollEvent();  // 模拟滚动事件
                        break;
                }

                // 随机时间（每 3-5 分钟）后再次调用
                const delay = Math.floor(Math.random() * 120000) + 180000;  // 180000ms ~ 300000ms (3 ~ 5分钟)
                setTimeout(performRandomAction, delay);
            }

            // 启动模拟操作
            performRandomAction();
        }
    }


    //开始刷课
    function Start()
    {
        // 调用该函数来开始模拟用户行为
        simulateUserActivity();
        //获取当前页面url
        const currentUrl = window.location.href;
        //console.log(currentUrl);
        //主页面
        if(currentUrl.includes("https://web.scgb.gov.cn/#/myClass"))
        {
            getCourse();
        }
        //包含在线播放按钮的页面
        if(currentUrl.includes("https://web.scgb.gov.cn/#/course"))
        {
             setTimeout(OnlineStudyButtion, 2000 );
        }
        //在视频播放页面
        if(currentUrl.includes("https://web.scgb.gov.cn/#/studyBox"))
        {
            AutoPlay();
        }


    }
};