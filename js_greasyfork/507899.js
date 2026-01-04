// ==UserScript==
// @name         115视频播放 快捷键
// @namespace    https://greasyfork.org/zh-CN/users/1365949
// @version      1.2
// @description  添加了几个快捷键，前进/后退间隔修改，右侧列表悬停展开
// @author       ewt45
// @license      MIT
// @match        https://115vod.com/*
// @match        https://115.com/*mode=wangpan*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=115.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/507899/115%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%20%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/507899/115%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%20%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //按键参考 https://developer.mozilla.org/zh-CN/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys

    if (window.top !== window.self) return // 跳过iframe
    console.log("添加油猴脚本-115视频快捷键")

    const video = document.querySelector("#js-video")
    let currentTimeDiv = null; //用于前进/后退时显示当前时间，在addVideoKeyEventListener中初始化
    let currentTimeDivTimeoutId = 0;
    let fastForwardTimeoutId = null; //快进的倒计时id
    let isFastForwarding = false

    let isResizing = false; // 标记是否正在拖拽
    let startX;             // 鼠标按下时的 X 坐标
    let startWidth;         // 拖拽开始时 div 的宽度

    /** 监听键盘按键以实现各种快捷键 */
    const addVideoKeyEventListener = () => {
        addCurrentTimeDiv()

        // 方向键右按下，如果长按则3倍速播放
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'arrowright' && !fastForwardTimeoutId) {
                fastForwardTimeoutId = setTimeout(() => {
                    video.playbackRate = 3.0; // 3倍速
                    isFastForwarding = true

                    //左上角提示文字
                    currentTimeDiv.innerHTML = '3倍速播放中'
                    currentTimeDiv.style.display = 'block';
                }, 800);
            }
        })

        document.addEventListener('keyup', (e) => {
            // console.log('松开按键 ', e.key, e.keyCode)
            //全屏
            if (e.key.toLowerCase() === 'f') {
                console.log('快捷键-全屏')
                e.stopPropagation()
                const el = document.querySelector('a[rel="fullscreen"]')
                if (el) {
                    el.click()
                    //不知为何顶端的标题不会自动隐藏
                    setTimeout(() => { document.querySelector('[rel="full_menu"]').style.display = 'none' }, 2000)
                }
            }

            // k和l也是前进和后退
            // else if (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'l') {
            //     const isForward = e.key.toLowerCase() === 'l'; //是否为快进
            //     const interval = getInterval()
            //     const video = document.querySelector("#js-video")
            //     const playBtn = document.querySelector('[btn="play"]')
            //     const duration = ~~(video.duration || 0)
            //     const currentTime = ~~(video.currentTime || 0)

            //     console.log('快捷键-' + (isForward ? "快进" : "快退"), (isForward ? "是否符合条件" + (currentTime + interval < duration) : ""))

            //     if (!duration)
            //         return

            //     // if (video.paused && playBtn)
            //     //     playBtn.click()

            //     //调整视频进度
            //     if (isForward && (currentTime + interval < duration)) {
            //         video.currentTime += interval;
            //     } else if (!isForward && (currentTime - interval > 0)) {
            //         video.currentTime -= interval;
            //     }

            //     //左上角显示当前进度
            //         const percent = video.currentTime / video.duration * 10000;
            //         currentTimeDiv.innerHTML = oofUtil.date.numFormat(video.currentTime * 1000, 'hh:mm:ss') || '00:00:00' + ' (' + (~~percent) / 100 + '%)';
            //         currentTimeDiv.style.display = 'block';

            //         if (currentTimeDivTimeoutId)
            //             clearTimeout(currentTimeDivTimeoutId);
            //         currentTimeDivTimeoutId = setTimeout(() => { currentTimeDiv.style.display = 'none' }, 3000)
            // }

            //方向键左右
            //有问题，后退会转一会圈然后播放，控制台有个报错。前进无效。
            else if (e.key.toLowerCase() === 'arrowleft' || e.key.toLowerCase() === 'arrowright') {
                if (!(video instanceof HTMLVideoElement) || !(currentTimeDiv instanceof HTMLElement)) return
                e.stopPropagation() //阻止原代码中的事件监听（原监听在window上）

                const isForward = e.key.toLowerCase() === 'arrowright'
                const interval = getInterval() * (isForward ? 1 : -1)
                const duration = ~~(video.duration || 0)

                console.log('快捷键-前进/后退')

                // 清除长按计时器
                clearTimeout(fastForwardTimeoutId)
                fastForwardTimeoutId = null

                // 如果是快进播放，则停止倍速并直接返回
                if (isFastForwarding) {
                    video.playbackRate = 1.0
                    isFastForwarding = false
                    currentTimeDiv.style.display = 'none'
                    return
                }

                // if (video.paused && playBtn)
                //     playBtn.click()

                //调整视频进度
                video.currentTime += interval;

                //左上角显示当前进度
                const percent = video.currentTime / video.duration * 10000;
                currentTimeDiv.innerHTML = (oofUtil.date.numFormat(video.currentTime * 1000, 'hh:mm:ss') || '00:00:00') + ' (' + (~~percent) / 100 + '%)';
                currentTimeDiv.style.display = 'block';

                if (currentTimeDivTimeoutId)
                    clearTimeout(currentTimeDivTimeoutId);
                currentTimeDivTimeoutId = setTimeout(() => { currentTimeDiv.style.display = 'none' }, 3000)
            }
        }, true);
    }



    /** 显示设置弹窗 */
    function createSettingsDialog() {
        if (document.getElementById('sh-dialog'))
            return

        // 创建弹窗元素
        const frame = document.createElement('div');
        frame.innerHTML = `
<div id="sh-dialog" style="position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 20px; background-color: white; border: 1px solid black; z-index: 10000; box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px; text-align: center;">
    <div style="display:table;">
        <div style="display:table-cell;">前进/后退 时间间隔(秒)
        </div>
        <div style="display:table-cell; padding-left:20px;">
            <input id="sh-interval" type="number" required/>
        </div>
    </div>
    <div style="text-align: left; margin-top:20px; max-height:200px; overflow: auto;">快捷键:
        <br>前进/后退: 方向键右/左
        <br>快进（3倍速）: 方向键右长按
        <br>全屏: F
        <br><br>官方自带的快捷键：
        <br>m=静音
        <br>w=网页全屏
        <br>esc=退出全屏
        <br>空格,k=播放/暂停
        <br>j=倒退10秒
        <br>l=前进10秒
        <br>0-9=跳转到进度0%-100%
        <br>上=音量+10%
        <br>下=音量-10%
        <br>c=隐藏/开启字幕
        <br>n=下一个
        <br>p=上一个
        <br>end=最后一个
        <br>home=第一个
    </div>
    <button style="margin-top:20px" id="sh-closebtn">保存</button>
</div>
`;

        document.body.appendChild(frame);
        document.getElementById('sh-interval').value = getInterval()
        document.getElementById('sh-closebtn').addEventListener('click', function () {
            setInterval(parseInt(document.getElementById('sh-interval').value))
            document.body.removeChild(frame);
        });
    }

    /** 初次启动时添加左上角的时间显示div */
    const addCurrentTimeDiv = () => {
        let box = document.querySelector('#js-video_box');
        if (!box || currentTimeDiv)
            return

        const root = document.createElement('div');
        root.innerHTML = '<div id="currentTimeDiv" style="position:absolute;left:20px;top:20px;font-size:14px;z-index:3;color:#fff;"></div>'
        box.appendChild(root)
        currentTimeDiv = document.getElementById("currentTimeDiv")
    }

    /** 主界面左侧栏宽度可拖拽 */
    const createDragbar = () => {
        const leftContainer = document.getElementById("site_left_bar")
        const rightContainer = document.querySelector(".main-hflow.main-scrollbox")
        let dragbar = document.getElementById("left_container_drag_bar")
        if (!leftContainer || !rightContainer || dragbar) return

        leftContainer.style.width = readLeftContainerWidth() + 'px';

        dragbar = document.createElement('div')
        dragbar.id = "left_container_drag_bar"
        dragbar.style.width = '10px'
        dragbar.style.position = 'absolute'
        dragbar.style.top = 0
        dragbar.style.right = 0
        dragbar.style.bottom = 0
        dragbar.style.cursor = 'ew-resize'
        // dragbar.style.backgroundColor = 'black'
        leftContainer.appendChild(dragbar)

        dragbar.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = leftContainer.offsetWidth; // 记录 div 的当前宽度 (包含 padding 和 border)
            e.preventDefault(); // 阻止默认的拖拽行为
            leftContainer.style.pointerEvents = 'none'
            rightContainer.style.pointerEvents = 'none' // 防止鼠标进入文件列表后 显示操作栏 拖拽被打断
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return; // 如果没有在拖拽，则不执行任何操作

            const newWidth = startWidth + e.clientX - startX;
            leftContainer.style.width = `${Math.max(100, newWidth)}px`;
        });

        document.addEventListener('mouseup', () => {
            isResizing = false; // 停止拖拽
            leftContainer.style.pointerEvents = ''
            rightContainer.style.pointerEvents = ''
            saveLeftContainerWidth(leftContainer.offsetWidth)
        });
    }


    const setInterval = (value) => {
        if (!value || value <= 0) value = 5;
        GM_setValue("interval", value)
    }

    /** 获取前进/后退的时间间隔，默认5秒 */
    const getInterval = () => {
        return GM_getValue("interval", 5)
    }

    const saveLeftContainerWidth = (value) => GM_setValue("leftContainerWidth", Math.max(100, value))
    const readLeftContainerWidth = () => Math.max(100, GM_getValue("leftContainerWidth", 340))






    // 视频播放
    if (window.location.href.startsWith("https://115vod.com/")) {
        // 按键监听
        addVideoKeyEventListener()

        // 右侧列表 悬停展开
        const expandListBtn = document.getElementById("js_pl_control_expand")
        if (expandListBtn) {
            expandListBtn.addEventListener('mouseover', (e) => { expandListBtn.classList.contains('vpls-open') && expandListBtn.click() }) //仅在未打开列表时点击。
            expandListBtn.parentElement.parentElement.addEventListener('mouseleave', (e) => { expandListBtn.classList.contains('vpls-close') && expandListBtn.click() }) //仅在已打开时点击
        }
    }

    // 文件页面
    if (window.location.href.startsWith("https://115.com/?")) {
        GM_addStyle(`
        .sub-hflow-file {width: auto;}
        .bar-info {flex-wrap: wrap;}
        .file-module-allfile .title {flex-wrap: wrap;}
        .file-module-allfile .title .name {flex: 1 0 auto; white-space: nowrap;}`);
        createDragbar()
    }


    // 油猴插件处的设置
    GM_registerMenuCommand('设置', createSettingsDialog);

})();