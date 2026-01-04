// ==UserScript==
// @name         chinahrt继续教育加速DrS
// @version      1.0.1
// @description  进入视频自动开始并静音。解除失去焦点自动暂停，后台听不也挺好吗。一般情形可用。【PS】如果解除弹窗限制，理论上可以实现自动切换课程
// @author       DrS
// @license      AGPL License
// @match        *://videoadmin.chinahrt.com*/videoPlay/play*
// @match        *://web.chinahrt.com*/index.html#/v_video*
// @match        *://gp.chinahrt.com/index.html*
// @grant        none
// @namespace https://greasyfork.org/users/849179
// @downloadURL https://update.greasyfork.org/scripts/444739/chinahrt%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9FDrS.user.js
// @updateURL https://update.greasyfork.org/scripts/444739/chinahrt%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%8A%A0%E9%80%9FDrS.meta.js
// ==/UserScript==

$(document).ready(function () {
    // 判断当前页面类型
    if (window.location.href.includes('v_selected_course')) {
        handleCoursePage();
    } else if (window.location.href.includes('videoPlay/play')) {
        handleVideoPage();
    } else if (window.location.href.includes('v_courseDetails')) {
        handleCourseDetailsPage(); // 新增课程详情页面处理
    } else if (window.location.href.includes('v_video')) {
        handleVideoCompletion(); // 新增视频完成监视
    }
});


// 处理课程页面的逻辑
// ========================== 课程列表页面增强 =========================
function handleCoursePage() {
    addManualIncompleteTriggerButton();
    // 原有刷新逻辑
    const reloadInterval = setTimeout(() => {
        window.location.reload();
    }, 10 * 60 * 1000);
    clickWhenElementAppears('female1'); //点击未学完
    // 新增状态检测
    const courseCheckInterval = setInterval(() => {
        // 解析 cookie 中的 courseCompleteState 值
        const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('courseCompleteState='))
        ?.split('=')[1];

        if (cookieValue) {
            console.log('检测到 courseCompleteState，值为:', cookieValue);

            // 如果 courseCompleteState 的值为 1
            if (cookieValue === '1') {
                console.log('检测到 courseCompleteState=1，准备刷新页面');

                // 将 courseActionTrigger 设置为 2
                document.cookie = "courseCompleteState=2; path=/; domain=.chinahrt.com";
                console.log('已将 courseCompleteState 设置为 2');
                // 刷新页面
                setTimeout(() => {window.location.reload();}, 3000);

            }else if (cookieValue === '2') {

                // 刷新后执行点击操作
                setTimeout(() => {
                    // 尝试点击未完成的课程
                    findAndClickFirstIncompleteCourse();
                    // 清除旧状态
                    document.cookie = "courseCompleteState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.chinahrt.com";

                    // 设置新状态
                    document.cookie = "courseActionTrigger=1; path=/; domain=.chinahrt.com";
                    console.log('已将 courseActionTrigger 设置为 1');
                }, 3000); // 等待页面刷新完成后执行
            }
        } else {
            //console.log('未检测到 courseCompleteState');
        }
    }, 5000); // 每5秒检查一次


    function findAndClickFirstIncompleteCourse() {
        // 获取所有 <li> 元素
        const listItems = document.querySelectorAll('li.pr');

        // 遍历每个 <li>
        for (let i = 0; i < listItems.length; i++) {
            const li = listItems[i];

            // 查找进度条元素
            const progressSpan = li.querySelector('div.progress-line span');
            if (progressSpan) {
                // 获取进度文本（例如 "66%"）
                const progressText = progressSpan.textContent.trim();

                // 检查进度是否为 100%
                if (progressText !== '100%') {
                    console.log(`找到未完成课程，进度：${progressText}`);

                    // 查找可点击的span元素
                    const courseLogo = li.querySelector('span.bg');
                    const ctitle=li.querySelector('h3').textContent;

                    if (courseLogo) {
                        document.getElementById('pfbtn').textContent=ctitle;
                        setTimeout(() => {courseLogo.click();}, 100);
                        console.log("点击未听完课程");
                    } else {
                        document.getElementById('pfbtn').textContent='没有未听完的课程可以点击';
                        //console.log('未找到可点击的span');
                    }

                    // 找到第一个未完成课程后，退出循环
                    return;
                }
            }
        }

        // 如果没有找到未完成课程
        console.log('未找到未完成课程');

    }
    function clickWhenElementAppears(targetId) {
    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver((mutationsList, observer) => {
        // 检查目标元素是否已经出现在 DOM 中
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // 点击目标元素
            targetElement.click();
            // 停止观察，避免重复执行
            observer.disconnect();
            console.log(`元素 ${targetId} 已找到并点击`);
        }
    });

    // 开始观察整个文档的 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

        // 新增：手动触发按钮
        function addManualIncompleteTriggerButton() {
            // 创建按钮
            const button = document.createElement('button');
            button.textContent = '点击第一个未听完';
            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = '10000';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.id='pfbtn'

            // 绑定点击事件
            button.addEventListener('click', function () {
               // console.log('手动触发视频完成状态');
                // 设置 Cookie 状态

                findAndClickFirstIncompleteCourse();
            });

            // 将按钮添加到页面
            document.body.appendChild(button);
        }
}

//====================== 处理课程详情页面的逻辑==============================
function handleCourseDetailsPage() {
    // 设置页面关闭标记
    let shouldClose = false;

    // 检测触发状态
    if (document.cookie.includes('courseActionTrigger=1')) {
        // 清除当前状态
        document.cookie = "courseActionTrigger=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.chinahrt.com";

        // 延时点击逻辑
        setTimeout(() => {
            const buttons = document.querySelectorAll('button.comment.white.f16.plainStudy');
            buttons.forEach(btn => {
                if (btn.textContent.includes('继续学习') || btn.textContent.includes('开始学习')) {
                    btn.click();
                    console.log('已触发学习按钮点击');
                    shouldClose = true;
                }
            });

            // 最终关闭逻辑
            setTimeout(() => {
                if (shouldClose) window.close();
            }, 5000);
        }, 10000); // 10秒后尝试点击
    }
}



// ===========================视频母页面辅助--检查弹窗是否可见=============================
// 处理视频完成监视
function handleVideoCompletion() {
    console.log("进入视频页面，开始监视课程评价弹窗...");

    // 设置一个定时器，循环检查课程评价弹窗是否显示
    const interval = setInterval(() => {
        // 找到课程评价弹窗
        const courseEvaluationDialog = document.querySelector('div[role="dialog"][aria-label="课程评价"]');
        if (courseEvaluationDialog) {
            // 找到其父元素 el-dialog__wrapper
            const dialogWrapper = courseEvaluationDialog.closest('.el-dialog__wrapper');
            if (dialogWrapper && dialogWrapper.style.display !== 'none') {
                console.log("检测到课程评价弹窗已显示，表示课程已完成！");

                // 设置 Cookie
                document.cookie = "courseCompleteState=1; path=/; domain=.chinahrt.com";
                console.log("已设置 courseCompleteState Cookie");

                // 清除定时器
                clearInterval(interval);

                // 关闭页面.
                setTimeout(() => {window.close();}, 3000);
            }
        }
    }, 3000); // 每 1 秒检查一次
}



//============ 处理视频页面的逻辑=========================
function handleVideoPage() {
    var speedup = false;
    var videoIsEnd = false;
    var pauseActionInterval;
    //原始事件替换
    window.onfocus = function () { console.log('onfocus焦点监控事件已被替换'); };
    window.onblur = function () { console.log('onblur原始事件已被替换'); };


    const originalAlert = window.alert;
    window.alert = function (message) {
        // 捕获调用栈
        const stackTrace = new Error().stack;
        console.log('Alert called with message:', message);
        console.log('Call stack:', stackTrace);

        debugger; // 这里会触发断点

        // 3 秒后刷新页面
        setTimeout(function () {
            console.log('Refreshing page in 3 seconds...');
            window.location.reload();
        }, 3000); // 3000 毫秒 = 3 秒

        // 调用原始的 alert
        //originalAlert(message);
    };

    var tmp = setInterval(function () {
        if (player) {
            player.addListener('loadedmetadata', function () {
                setTimeout(function () { goPlayAction('初始加载'); }, 1000);
                clearInterval(tmp);
            });
            player.addListener('ended', function () { videoIsEnd = true; });
        }
    }, 5000);

    pauseActionInterval = setInterval(function () {
        refreshIfMultipleCoursesMessage();
        var rtime = player.V.duration - player.time;
        if (rtime <= 60) {
            console.log('视频剩余时间小于60秒，恢复播放速度');

        }
        try {
            timer.change(1);
            player.videoMute();
        } catch {
            console.log("没有player");
        }
        var playerMetaDate = player.getMetaDate();
        if (playerMetaDate['paused']) {
            pauseAction('循环检测发现暂停');
        }
    }, 5000);

    // 调用函数，添加按钮
    //addManualTriggerButton();

    function goPlayAction(addstr) {
        addstr = addstr || '默认调用';

        // 让 video 对象获得焦点
        try {
            const videoElement = document.querySelector('video'); // 获取页面中的 video 元素
            if (videoElement) {
                videoElement.click(); // 让 video 元素获得焦点
                console.log('Video 元素已获得焦点');
            } else {
                console.log('未找到 video 元素');
            }
        } catch (error) {
            console.log('让 video 元素获得焦点时出错:', error);
        }

        // 播放视频并设置音量和静音
        player.videoPlay();
        player.changeVolume(0.1);
        player.videoMute();
        console.log('timehooker加速');
        speedup = true;

        // 尝试调整播放速度
        try {
            timer.change(0.8);
        } catch {
            console.log("没有timehooker，或其他命令失败");
        }

        console.log('播放静音倍速3连【' + addstr + '】');
    }

    function pauseAction(addstr, waitTime) {
        addstr = 'pauseAction' + addstr || 'pauseAction默认调用';
        waitTime = waitTime || 1000;
        if (videoIsEnd == true) {
            document.title = '【已播完】' + document.title;
        }
        if (document.URL.search('end') > 34 || videoIsEnd == true) {
            // 新增状态记录
            document.cookie = "courseCompleteState=1; path=/; domain=.chinahrt.com";
            console.log('检测到视频结束,本次视频恢复取消等待系统进入下一视频');
            document.getElementsByClassName('ths')[0].innerText = '【本视频已经播放过至少1次】';
            document.title = '【已播完】' + document.title;
            $(".f14:first").prepend("【重播】");
            waitTime = 5000;
            videoIsEnd = false;
            clearInterval(pauseActionInterval);
            // 关闭当前页面
            setTimeout(() => window.close(), 3000);
        } else {
            setTimeout(function () { goPlayAction(addstr); }, waitTime);
        }
    }

    function refreshIfMultipleCoursesMessage() {
        var h1Elements = document.querySelectorAll('h1');
        for (var i = 0; i < h1Elements.length; i++) {
            if (h1Elements[i].innerHTML.trim() === '不允许同时观看多门课程，请关闭当前页面！') {
                window.location.reload();
                return;
            }
        }
    }



    // 新增：手动触发按钮
    function addManualTriggerButton() {
        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '手动触发视频完成';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '10000';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // 绑定点击事件
        button.addEventListener('click', function () {
            console.log('手动触发视频完成状态');
            // 设置 Cookie 状态
            document.cookie = "courseCompleteState=1; path=/; domain=.chinahrt.com";
            // 模拟视频结束逻辑
            videoIsEnd = true;
            pauseAction('手动触发');
            setTimeout(() => window.close(), 3000);
        });

        // 将按钮添加到页面
        document.body.appendChild(button);
    }

}