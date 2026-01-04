// ==UserScript==
// @name         哔哩哔哩小助手
// @namespace    https://greasyfork.org/zh-CN/scripts/424638
// @homepage     https://greasyfork.org/zh-CN/scripts/424638
// @version      0.9.2
// @description  视频自动点赞，网页自动宽屏播放
// @author       木羊羽
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @run-at       document-end
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/424638/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/424638/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 更新日志
// v0.9.2 修复自动调整页面位置功能
// v0.9.1 修复屏幕滚动bug，增加是否开启Enter键全屏功能
// v0.9 修复失效功能，优化功能逻辑
// v0.8 适配新版播放界面，不兼容老版播放界面，添加根据观看时长定时点赞功能
// v0.7 修复按下Enter键无法搜索的bug,增加视频窗口居中功能
// v0.6 增加按下Enter键全屏功能
// v0.5 优化逻辑，新增点赞按钮
// v0.4 修复bug
// v0.3 增加番剧、综艺宽屏，优化逻辑
// v0.2 新增自动调节页面至合适位置
// v0.1 自动点击宽屏、点赞按钮，点赞默认为关闭


(function () {
    // 是否开启按下Enter键全屏功能，默认开启
    const enter_is_able = true; // 开启
    // const enter_is_able = false; // 关闭

    // 自动宽屏
    function tool_1() {
        // widescreenFunction = true 打开自动宽屏 widescreenFunction = false 关闭自动宽屏
        // likeFunction = true 打开自动点赞 likeFunction = false 关闭自动点赞
        const widescreenFunction = true

        const likeFunction = true

        if (widescreenFunction) {
            let widescreen_id = setInterval(function () {
                // 宽屏按钮className
                let widescreen = document.querySelector('.bpx-player-ctrl-wide')

                // 自动点击宽屏按钮函数
                if (widescreen) {
                    // 宽屏状态存在bpx-state-Entered
                    if (widescreen.className.includes('bpx-state-Entered') === false) {
                        widescreen.click()
                        clearInterval(widescreen_id)
                    }
                }

            }, 3000)
        }

        // 延时计数
        let count = 0
        if (likeFunction) {

            let like_id = setInterval(function () {
                // 定位点赞按钮
                let toolbar_left = document.querySelector('.toolbar-left-item-wrap')
                // video-like 定位到点赞按钮
                let like = toolbar_left.querySelector(".video-like")
                if (like === null) {
                    console.log('未找到点赞button！')
                } else if (like.className.includes('on') === false && count === 0) {
                    // count==1 为20s count==2 为30s 以此类推
                    like.click()
                    // like.className = 'like on'
                    // 同时修改屏幕左侧按钮
                    let like_button = document.querySelector('.diy_tool')
                    let img = like_button.children[0]
                    img.style.color = '#479fd1'
                    clearInterval(like_id)
                    console.log('当前视频点赞成功')

                } else {
                    console.log('当前视频已经点赞')
                    clearInterval(like_id)
                }
                count = count + 1
            }, 10000)
        }
    }


    // 点赞按钮
    function tool_2() {
        let body = document.getElementsByTagName('body')[0]
        // toolbar-left-item-wrap 定位类名
        let ops = document.querySelector('.toolbar-left-item-wrap')
        let color = '#757575'
        if ($(ops.children[0]).attr('class') === 'on') {
            color = '#479fd1'
        }
        $(body).after(`
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
        <div class="diy_tool">
            <i class="fa fa-thumbs-up fa-3x" aria-hidden="true"></i>
        </div> 
        <style>
        .diy_tool{
            position: fixed;
            display: flex;
            top: 200px;
            left: -25px;
            width: 40px;
            height: 30px;
            z-index: 99999;
            font-size: 15px;
            cursor: pointer;
            align-items: cEnter;
            transition: .3s;
            color: ${color};
        }
        .diy_tool i{
            position: absolute;
            margin-left: 10px;
            right: 0;
        }
        .like_button{
            margin-left: 5px;
        }
        .diy_tool:hover{
            left: 0;
        }
        </style>   
    `)
        let like_button = document.querySelector('.diy_tool')
        let img = like_button.children[0]

        like_button.onclick = function () {
            if ($(ops.children[0]).attr('class') === 'video-like video-toolbar-left-item on') {
                img.style.color = '#757575'
                $(ops.children[0]).click()
            } else {
                img.style.color = '#479fd1'
                $(ops.children[0]).click()
            }
        }

        // 监听点赞按钮，同步点赞按钮状态

        // 选择需要观察变动的节点
        const targetNode = document.querySelector('div.video-like');

        // 观察器的配置（需要观察什么变动）
        const config = {attributes: true, childList: true, subtree: true};

        // 当观察到变动时执行的回调函数
        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.target.classList.contains('video-like')) {
                    if (mutation.type === 'attributes'
                        && mutation.target.classList.contains('video-like')
                        && mutation.target.classList.contains('video-toolbar-left-item')
                        && mutation.target.classList.contains('on')) {
                        img.style.color = '#479fd1'
                        console.log('修改左侧点赞按钮为蓝色，点赞')
                    }

                    if (mutation.type === 'attributes'
                        && mutation.target.classList.contains('video-like')
                        && mutation.target.classList.contains('video-toolbar-left-item')
                        && !mutation.target.classList.contains('on')) {
                        img.style.color = '#757575'
                        console.log('修改左侧点赞按钮为灰色，取消点赞')
                    }
                }
            }
        };

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
    }

// 按下Enter键进出全屏
    function tool_3() {
        if (enter_is_able) {
            window.addEventListener('keydown', (e) => {

                let get_focus = document.activeElement

                if (e.key === "Enter") {
                    // 判断是否是在搜索框
                    // nav-search-content 为搜索框类
                    if (get_focus.className.includes('nav-search-content') === false) {
                        let fullscreen_btn = document.querySelector('.bpx-player-ctrl-full')
                        fullscreen_btn.click()
                    }
                }
            })
        }
    }

    // 指定位置按钮
    function tool_4() {
        let body = document.getElementsByTagName('body')[0]
        let ops = document.querySelector('.left-container')
        $(body).after(
            `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <div class="diy_tool_4">
        <i class="fa fa-sort fa-3x" aria-hidden="true"></i>
    </div> 
    <style>
    .diy_tool_4{
        position: fixed;
        display: flex;
        top: 150px;
        left: -26px;
        width: 40px;
        height: 30px;
        z-index: 99999;
        font-size: 15px;
        cursor: pointer;
        align-items: cEnter;
        transition: .3s;
        color: #757575;
    }
    .diy_tool_4 i{
        position: absolute;
        margin-left: 10px;
        right: 0;
    }
    .diy_tool_4:hover{
        left: 0;
    }
    </style>   
    `
        )

        let fixed_button = document.querySelector('.diy_tool_4')

        fixed_button.onclick = function () {
            specify_location()
        }

    }

    // 从当前页面跳转到其他页面也能使点赞功能生效
    function tool_5() {
        const _wr = function (type) {
            const orig = history[type];
            return function () {
                const rv = orig.apply(this, arguments);
                const e = new Event(type);
                e.arguments = arguments
                window.dispatchEvent(e)
                return rv
            }
        };
        history.pushState = _wr('pushState')
        window.addEventListener('pushState', function (e) {
            tool_1()
        })
    }


    // 移动屏幕到指定位置
    function specify_location() {

        if (window.screen.height === 864) {
            scrollTo(0, 60)
        } else if
        (window.screen.height === 1080) {
            scrollTo(0, 90)
        } else {
            scrollTo(0, 90)
        }
        console.log("移动屏幕到指定位置")
    }

    tool_1() // 自动宽屏
    tool_2() // 点赞按钮
    tool_3() // 按下Enter键进出全屏
    specify_location() // 自动调整页面位置
    tool_4() // 指定位置按钮
    tool_5() // 从当前页面跳转到其他页面也能使点赞功能生效

})
()