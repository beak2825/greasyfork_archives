// ==UserScript==
// @name         yxlearning 继续教育脚本
// @namespace    无
// @version      1.0
// @description  下一集自动播放 + 智能续播 + 自动跳题 + 强制音频 + 继续教育跳题 + 广告/答题屏蔽
// @author       mumu+AI
// @match        *://*.yxlearning.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537073/yxlearning%20%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/537073/yxlearning%20%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** 公共轮询间隔 ***/
    const INTERVAL_NEXT_VIDEO = 2000; // 下一视频检测
    const INTERVAL_SKIP_QUESTION = 2000; // 跳过答题弹窗
    const INTERVAL_RESUME = 5000; // 智能续播
    const INTERVAL_SWITCH_MODE = 5000; // 切换音频模式
    const INTERVAL_CLICK_SKIP = 3000; // 点击“跳过”按钮
    const INTERVAL_CHECK_PLAYBACK = 10000; // 继续教育自动播放检测

    /***** 1. 自动播放下一视频 *****/
    function getCurrentVideoLi() {
        return document.querySelector('li.videoLi.active');
    }
    function getBadgeText(li) {
        const badge = li.querySelector('.badge');
        return badge ? badge.textContent.trim() : '';
    }
    function clickNextVideo() {
        const cur = getCurrentVideoLi();
        if (!cur) return;
        const text = getBadgeText(cur);
        if (text === '100%' || text === '100') {
            let next = cur.nextElementSibling;
            while (next && !next.classList.contains('videoLi')) {
                next = next.nextElementSibling;
            }
            if (next) {
                const trg = next.querySelector('.video-info');
                trg && trg.click();
            }
        }
    }

    /***** 2. 智能续播（自然模拟点击） *****/
    let hasUserPlayed = false, retryCount = 0, MAX_RETRY = 5;
    function isPaused() {
        const wrap = document.querySelector('.bplayer-wrap');
        return wrap && !wrap.classList.contains('bplayer-playing');
    }
    function getPlayArea() {
        return document.querySelector('.bplayer-control-full');
    }
    function simulateNaturalClick(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width/2, y = rect.top + rect.height/2;
        ['mousedown','mouseup','click'].forEach(type=>{
            el.dispatchEvent(new MouseEvent(type,{
                bubbles: true, cancelable: true,
                clientX: x, clientY: y, view: window
            }));
        });
        console.log('[智能续播] 模拟点击');
    }
    function watchFirstPlay() {
        const wrap = document.querySelector('.bplayer-wrap');
        if (!wrap) return;
        new MutationObserver(()=>{
            if (wrap.classList.contains('bplayer-playing') && !hasUserPlayed) {
                hasUserPlayed = true;
                console.log('[智能续播] 检测到手动播放，启动续播');
            }
        }).observe(wrap, { attributes: true, attributeFilter: ['class'] });
    }
    function tryAutoResume() {
        if (!hasUserPlayed) return;
        if (isPaused()) {
            if (retryCount >= MAX_RETRY) return;
            const area = getPlayArea();
            area && simulateNaturalClick(area);
            retryCount++;
        } else {
            retryCount = 0;
        }
    }

    /***** 3. 自动跳过视频中的答题弹窗 *****/
    function trySkipQuestion() {
        const wrap = document.querySelector('.bplayer-question-wrap');
        if (!wrap || wrap.style.display==='none') return;
        const skip = wrap.querySelector('.skip.bplayer-btn');
        skip && skip.offsetParent!==null && (console.log('[自动跳题] skip'), skip.click());
        const comp = wrap.querySelector('.complete.bplayer-btn');
        comp && comp.offsetParent!==null && (console.log('[自动跳题] complete'), comp.click());
    }

    /***** 4. 继续教育音频模式切换 & 跳过 & 自动播放 *****/
    function switchPlaybackMode() {
        const btn = document.querySelector("div.pv-setting-choose.pv-stream-select span:nth-child(2)");
        if (!btn) return;
        if (document.querySelector("span[data-mode='video'].pv-active")) {
            btn.click();
        }
    }
    function clickSkipButton() {
        Array.from(document.getElementsByTagName('button'))
             .filter(b=>b.innerHTML==='跳过')
             .forEach(b=>{ console.log('[继续教育] 跳过'); b.click(); });
    }
    function checkAndPlay() {
        const pp = document.querySelector('.pv-playpause');
        if (pp && pp.classList.contains('pv-icon-btn-play')) {
            console.log('[继续教育] 自动播放');
            pp.click();
        }
    }

    /***** 5. 屏蔽广告/答题区域 *****/
    const domain = location.hostname;
    const rules = {
        'sddz.gxk.yxlearning.com': ['.bplayer-question-wrap'],
        'sddz.zyk.yxlearning.com': ['.bplayer-question-wrap', '.pv-ask-modal-wrap']
    };
    function removeAds() {
        (rules[domain]||[]).forEach(sel=>{
            document.querySelectorAll(sel).forEach(el=>el.remove());
        });
    }

    /***** 页面加载后启动所有功能 *****/
    window.addEventListener('load', ()=>{
        // 智能续播
        setTimeout(watchFirstPlay, 500);
        setInterval(tryAutoResume, INTERVAL_RESUME);

        // 下一视频
        setInterval(clickNextVideo, INTERVAL_NEXT_VIDEO);

        // 自动跳题
        setInterval(trySkipQuestion, INTERVAL_SKIP_QUESTION);

        // 继续教育功能
        setInterval(switchPlaybackMode, INTERVAL_SWITCH_MODE);
        setInterval(clickSkipButton, INTERVAL_CLICK_SKIP);
        setInterval(checkAndPlay, INTERVAL_CHECK_PLAYBACK);

        // 屏蔽广告/答题区域
        removeAds();
        new MutationObserver(removeAds)
            .observe(document.body, { childList: true, subtree: true });
    });

})();
