// ==UserScript==
// @name         小红书自动点赞收藏曝光吸粉
// @namespace    https://xhsqun.com
// @version      0.2
// @description  使用该脚本可在小红书网站进行自动点赞、收藏用户笔记，从而达到曝光当前账号的流量，适合使用小号进行吸粉引流辅助。
// @author       xhsqun.com
// @match        https://www.xiaohongshu.com/explore*
// @icon         https://fe-video-qc.xhscdn.com/fe-platform/ed8fe781ce9e16c1bfac2cd962f0721edabe2e49.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475331/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F%E6%9B%9D%E5%85%89%E5%90%B8%E7%B2%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475331/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%94%B6%E8%97%8F%E6%9B%9D%E5%85%89%E5%90%B8%E7%B2%89.meta.js
// ==/UserScript==

(function() {
    // 注入UI到页面
    const btn = document.createElement('div');
    btn.style = `
    font-size:12px;cursor:pointer;width: 50px;height: 50px;
    background: linear-gradient(135deg, #FF512F 0%,#DD2476 100%);
    border: 1px solid rgba(255,255,255,0.5);
    position: fixed;right: 20px;bottom: 150px;z-index: 999;
    display: flex;border-radius: 50px;align-items: center;justify-content: center;
    `;
    btn.innerText = '自动\n点赞';
    const sleep = async(t) => new Promise(R => setTimeout(R, t));
    // 开始执行
    let STARTED = false;
    let SLEEP_TIME = 2000;
    btn.onclick = async () => {
        if (STARTED) return console.warn('已经执行！');
        // 判断用户是否已经登录
        if (!window.__INITIAL_STATE__ || !window.__INITIAL_STATE__.user.loggedIn.value) {
            return btn.innerText = '请先\n登录';
        }
        btn.innerText = '正在\n运行';
        STARTED = true;
        // 开始执行点赞
        console.log('============== 公众号：小红秘书 ======================');
        console.log('============== 开始执行点赞功能 ======================');
        while (1) {
            console.log('获取点赞按钮列表');
            const doms = document.querySelectorAll('.like-wrapper');
            console.log('开始点赞', doms.length, '条数据。。');
            for (let i = 0; i < doms.length; i ++) {
                const dom = doms[i];
                dom.click();
                await sleep(SLEEP_TIME);
            }
            console.log('点赞完毕,刷新数据中');
            document.querySelector('#mfContainer > div.channel-container > div > div > div.channel.active').click();
            await sleep(3000);
        }
    }
    document.body.appendChild(btn);
})();