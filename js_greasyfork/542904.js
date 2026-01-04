// ==UserScript==
// @name         B站网页全屏与右键切换2.6.2
// @namespace    https://greasyfork.org/users/899926
// @author       信马由缰
// @version      2.6.2
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/festival/*
// @match        https://www.bilibili.com/list/*
// @license      MIT
// @run-at       document-start
// @unwrap
// @description  打开新页面进入网页全屏，播放下一个视频自动网页全屏；右键切换宽屏/网页全屏，宽屏自动滚动居中。
// @downloadURL https://update.greasyfork.org/scripts/542904/B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8E%E5%8F%B3%E9%94%AE%E5%88%87%E6%8D%A2262.user.js
// @updateURL https://update.greasyfork.org/scripts/542904/B%E7%AB%99%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8E%E5%8F%B3%E9%94%AE%E5%88%87%E6%8D%A2262.meta.js
// ==/UserScript==

'use strict';

(async (D, W) => {
    // —— 1. 常量定义 ——
    const STATE_NORMAL   = 0;  // 普通模式
    const STATE_WIDE     = 1;  // 宽屏模式
    const STATE_WEB_FULL = 2;  // 网页全屏
    const STATE_FULL     = 3;  // 浏览器全屏

    const PLAYER_CENTER_OFFSET = 75;  // 播放器垂直居中偏移（px）
    const DEBOUNCE_TIME        = 300; // 防抖时长（ms）

    let player = null;
    let playerContainer = null;

    // —— 2. 拦截 History API 并派发自定义事件 ——
    ;(function(history){
        const _push = history.pushState;
        const _replace = history.replaceState;

        history.pushState = function(){
            const ret = _push.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
        history.replaceState = function(){
            const ret = _replace.apply(this, arguments);
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };
        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    })(W.history);

    // —— 3. 基础工具函数 ——

    // 等待播放器初始化完成
    const waitForPlayer = () => new Promise(resolve => {
        const check = () => {
            if (W.player?.on) resolve(W.player);
            else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
    });

    // 缓存并返回播放器容器
    const getPlayerContainer = () => {
        if (!playerContainer && player?.getElements) {
            playerContainer = player.getElements().container;
        }
        return playerContainer;
    };

    // 切换播放器模式
    const setPlayerMode = (mode) => {
        try {
            if (player?.requestStatue) {
                player.requestStatue(mode);
                return true;
            }
        } catch (e) {
            console.error('设置播放器状态失败', e);
        }
        return false;
    };

    // 检测当前播放模式
    const getPlayerMode = () => {
        const container = getPlayerContainer();
        if (!container) return STATE_NORMAL;

        if (document.fullscreenElement === container) return STATE_FULL;
        if (container.classList.contains('bpx-player-web-full')) return STATE_WEB_FULL;
        if (container.classList.contains('bpx-player-wide')) return STATE_WIDE;

        // 备用检测：高度≈视口高度 → 网页全屏；宽度>0.8*视口宽度 → 宽屏
        const wrap = D.querySelector('.bpx-player-primary-area');
        if (wrap) {
            const r = wrap.getBoundingClientRect();
            if (r.height >= window.innerHeight * 0.9) return STATE_WEB_FULL;
            if (r.width > window.innerWidth * 0.8) return STATE_WIDE;
        }
        return STATE_NORMAL;
    };

    // 宽屏时滚动到视窗中心
    const scrollPlayerToCenter = () => {
        const c = getPlayerContainer();
        if (!c) return;
        const { top } = c.getBoundingClientRect();
        const y = top + window.scrollY - PLAYER_CENTER_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
    };

    // —— 4. 播放下个视频自动网页全屏 ——
    window.addEventListener('locationchange', () => {
        setTimeout(async () => {
            // 保证 player 已准备好、container 已缓存
            player = await waitForPlayer();
            getPlayerContainer();

            const mode = getPlayerMode();
            if (mode === STATE_NORMAL || mode === STATE_WIDE) {
                setPlayerMode(STATE_WEB_FULL);
            }
        });
    });

    // —— 5. 右键切换 & 脚本主流程 ——
    const main = async () => {
//        let count = 0;
       // 首次进入页面时切换网页全屏
//        console.log('检测到新页面');
        player = await waitForPlayer();
//      getPlayerContainer();
        setPlayerMode(STATE_WEB_FULL);
//        count = count+1;
//        console.log('第 次执行切换网页全屏',count);
        getPlayerContainer();

/*        let isnewpage = true; // 标志常量，true表示新页面
    // 在新页面，检测到视频元素后切换到页面全屏
        if (isnewpage) {
            console.log("检测到新页面");
            try {
            // 等待播放器加载
                const video = await waitForPlayer();
                console.log("播放器加载完成:", video);
                console.log("执行切换到网页全屏操作");
                setPlayerMode(STATE_WEB_FULL);//切换到网页全屏
                console.log("新页面切换页面全屏完成");
            // 标记已处理，避免重复执行
                isnewpage = false;
            } catch (e) {
            console.error("等待播放器加载时出错:", e);
            }
        }*/

        // 右键切换功能
        D.addEventListener('contextmenu', e => {
            const c = getPlayerContainer();
            if (c && c.contains(e.target)) {
                e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

                const cur = getPlayerMode();
                if (cur === STATE_WEB_FULL || cur === STATE_FULL) {
                    setPlayerMode(STATE_WIDE);
                    setTimeout(scrollPlayerToCenter, 50);
                } else {
                    setPlayerMode(STATE_WEB_FULL);
                }
                return false;
            }
        }, true);
    };

    main().catch(e => console.error('脚本初始化失败', e));

})(document, window);
