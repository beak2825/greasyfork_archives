// ==UserScript==
// @name         莱娅的记忆拼图一键脚本
// @namespace    https://github.com/Tsuk1ko
// @version      0.2.0
// @description  少前2网页小游戏莱娅的记忆拼图一键自动拼图、一键抽卡
// @author       神代綺凛
// @match        https://gf2.sunborngame.com/lydjypt/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sunborngame.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530806/%E8%8E%B1%E5%A8%85%E7%9A%84%E8%AE%B0%E5%BF%86%E6%8B%BC%E5%9B%BE%E4%B8%80%E9%94%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/530806/%E8%8E%B1%E5%A8%85%E7%9A%84%E8%AE%B0%E5%BF%86%E6%8B%BC%E5%9B%BE%E4%B8%80%E9%94%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const btnDiv = document.createElement('div');
    btnDiv.style.position = 'fixed';
    btnDiv.style.top = '0';
    btnDiv.style.left = '0';
    btnDiv.style.display = 'flex';
    btnDiv.style.flexDirection = 'column';
    document.body.appendChild(btnDiv);

    const gameBtn = initBtn('自动拼图(一次)');
    const gameAllBtn = initBtn('自动拼图(全部)');
    const gachaBtn = initBtn('自动抽卡');

    const btns = [gameBtn, gameAllBtn, gachaBtn];
    function setAllBtnDisabled(disabled) {
        btns.forEach(btn => {
            btn.disabled = disabled;
        });
    }

    function resetBtn(el) {
        el.innerText = el.dataset.text;
    }

    function initBtn(text) {
        const el = document.createElement('button');
        el.innerText = text;
        el.style.fontSize = '0.2rem';
        el.style.padding = '0.02rem 0.05rem';
        el.dataset.text = text;
        btnDiv.appendChild(el);
        return el;
    }

    function checkLogin() {
        if (sessionStorage.getItem('key')) return;
        throw new Error('尚未登录');
    }

    async function callApi(path, options) {
        const res = await fetch(`https://gf2-h5ump45gacha-api.sunborngame.com${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: sessionStorage.getItem('key'),
            },
            ...options,
        });
        if (res.status !== 200) {
            throw new Error(`请求错误 ${res.status}`);
        }
        const data = await res.json();
        if (data.Code !== 0) {
            console.error(data);
            throw new Error(data.Message);
        }
        return data.data;
    }

    function callInfoApi() {
        return callApi('/info', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: sessionStorage.getItem('key'),
            },
        });
    }

    async function checkCanPlay() {
        const data = await callInfoApi();
        const needRefresh = data.play_info.stage === 3;
        if (!data.day_can_get_score) throw new Error('今日积分已达上限');
        if (!data.play_num && needRefresh) throw new Error('已无游戏次数');
        if (!needRefresh && data.play_info.info.some(grid => grid)) throw new Error('请在没有格子被点开过的情况下使用本脚本');
        return needRefresh;
    }

    async function callGameApi(index) {
        const data = await callApi('/play_click', {
            method: 'POST',
            body: JSON.stringify({ index }),
        });
        return data.card_id;
    }

    function callRefreshApi() {
        return callApi('/refresh', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    }

    async function startGame() {
        checkLogin();
        const needRefresh = await checkCanPlay();
        await playGame(gameBtn, needRefresh);
        if (location.pathname === '/lydjypt/index') location.reload();
    }

    async function startGameLoop() {
        checkLogin();
        for (let i = 0; ; i++) {
            let needRefresh;
            try {
                needRefresh = await checkCanPlay();
            } catch (error) {
                if (i === 0) throw error;
                break;
            }
            await playGame(gameAllBtn, needRefresh);
        }
        if (location.pathname === '/lydjypt/index') location.reload();
    }

    async function playGame(btn, needRefresh) {
        if (needRefresh) await callRefreshApi();
        const pairs = {};
        for (let i = 0; i < 16; i++) {
            btn.innerText = `翻牌中 ${i} ${i + 1}`;
            const id = await callGameApi(i);
            console.log(`grid ${i} is ${id}`);
            if (!pairs[id]) pairs[id] = [];
            pairs[id].push(i);
        }
        console.log('pairs', pairs);
        for (const [g1, g2] of Object.values(pairs)) {
            if (g2 - g1 === 1 && g1 % 2 === 0) {
                console.log(`${g1} and ${g2} has paired`);
                continue;
            }
            btn.innerText = `配对中 ${g1} ${g2}`;
            console.log(`start pair ${g1} and ${g2}`);
            await callGameApi(g1);
            await callGameApi(g2);
        }
        console.log('done');
    }

    async function callGachaApi() {
        const data = await callApi('/gacha', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        return data.name;
    }

    async function startGacha() {
        checkLogin();
        const { gacha_num: num } = await callInfoApi();
        if (!num) throw new Error('已无抽卡次数');
        for (let i = 1; i <= num; i++) {
            gachaBtn.innerText = `抽卡中 ${i}`
            const name = await callGachaApi();
            console.log('抽卡获得', name);
        }
        alert('抽卡完成，请检查抽卡记录');
        if (location.pathname === '/lydjypt/luckyDraw') location.reload();
    }

    function handleClick(btn, func) {
        btn.addEventListener('click', async () => {
            try {
                setAllBtnDisabled(true);
                await func();
            } catch (e) {
                console.error(e);
                alert(e.message);
            } finally {
                resetBtn(btn);
                setAllBtnDisabled(false);
            }
        });
    }

    handleClick(gameBtn, startGame);
    handleClick(gameAllBtn, startGameLoop);
    handleClick(gachaBtn, startGacha);
})();