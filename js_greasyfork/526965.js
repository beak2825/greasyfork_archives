// ==UserScript==
// @name         B站番剧真实评分 大数据量修复
// @version      1.0.3
// @description  BiliBili 番剧真实评分
// @author       Star0
// @match        *://www.bilibili.com/bangumi/media/*
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/526965/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86%20%E5%A4%A7%E6%95%B0%E6%8D%AE%E9%87%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/526965/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86%20%E5%A4%A7%E6%95%B0%E6%8D%AE%E9%87%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(() => {
    'use strict';

    let allData = [];
    let totalCnt = { short: 0, long: 0 }
    let render = null, rmDialog = null, mid;
    let isPaused = false;
    let avgDisplay = null;
    try { mid = location.href.match(/media\/md(\d+)/)[1] } catch { }
    if (!mid) { throw new Error('未进入番剧详情页面') }

    async function getScore(next, type) {
        let res, url = `https://api.bilibili.com/pgc/review/${type}/list?media_id=${mid}&ps=12575&sort=0`;
        if (next) url += `&cursor=${next}`;
        try { res = await fetch(url, { 'method': 'GET' }); }
        catch { return false; }
        const { data } = await res.json();
        if (totalCnt[type] == 0)
            totalCnt[type] = data.total;
        return data;
    }

    async function score(type) {
        try {
            // 获取初始数据
            const initialData = await getScore(undefined, type);
            if (!initialData || !initialData.list) {
                throw new Error('Failed to get initial data');
            }
            submitList(initialData.list);
            let next = initialData.next;

            while (true) {
                if (isPaused) {
                    await new Promise(resolve => {
                        const checkPause = setInterval(() => {
                            if (!isPaused) {
                                clearInterval(checkPause);
                                resolve();
                            }
                        }, 100);
                    });
                }

                try {
                    const data = await getScore(next, type);
                    if (!data || !data.list) {
                        throw new Error('Failed to get data');
                    }
                    submitList(data.list);
                    render(type);
                    next = data.next;
                    if (next == 0) return;
                } catch (error) {
                    console.error('Error fetching data:', error);
                    isPaused = true;
                    const pauseBtn = document.querySelector('#pauseButton');
                    if (pauseBtn) {
                        pauseBtn.innerText = '继续(出错自动暂停)';
                    }
                    if (avgDisplay) {
                        avgDisplay.innerHTML = `当前平均分: ${calculateAverage()}<br><span style="color:red">获取数据出错，已自动暂停</span>`;
                    }
                    await new Promise(resolve => {
                        const checkResume = setInterval(() => {
                            if (!isPaused) {
                                clearInterval(checkResume);
                                resolve();
                            }
                        }, 100);
                    });
                    if (avgDisplay) {
                        avgDisplay.innerHTML = `当前平均分: ${calculateAverage()}`;
                    }
                    continue;
                }
            }
        } catch (error) {
            console.error('Fatal error in score function:', error);
            if (avgDisplay) {
                avgDisplay.innerHTML = `<span style="color:red">发生致命错误，请刷新页面重试</span>`;
            }
            throw error;
        }
    }

    function calculateAverage() {
        if (allData.length === 0) return "0.00000";
        const total = allData.reduce((p, v) => p + v, 0);
        return (total / allData.length).toFixed(5);
    }

    function updateStars(score) {
        const starLc = parseInt(Math.round(score / 2));
        const starHc = 5 - starLc;
        const starsDom = document.getElementsByClassName('review-stars')[0];
        starsDom.innerHTML = '';
        for (let i = 0; i < starLc; i++) {
            const star = document.createElement('i');
            star.className = 'icon-star icon-star-light';
            starsDom.appendChild(star);
        }
        for (let i = 0; i < starHc; i++) {
            const star = document.createElement('i');
            star.className = 'icon-star icon-star-half';
            starsDom.appendChild(star);
        }
    }

    function updateDisplays() {
        const currentAvg = calculateAverage();
        document.getElementsByClassName('media-info-score-content')[0].innerText = currentAvg;
        updateStars(currentAvg);
        if (avgDisplay) {
            avgDisplay.innerText = `当前平均分: ${currentAvg}`;
        }
    }

    function submitList(list) {
        allData.push(...list.map(item => item.score));
        if (allData.length % 100 === 0) {
            updateDisplays();
        }
    }

    function preRender() {
        const maskBox = document.createElement('div');
        const mainBox = document.createElement('div');
        const wrapS = document.createElement('div');
        const wrapL = document.createElement('div');
        const textS = document.createElement('div');
        const textL = document.createElement('div');
        const boxS = document.createElement('div');
        const boxL = document.createElement('div');
        const progS = document.createElement('div');
        const progL = document.createElement('div');
        const countS = document.createElement('div');
        const countL = document.createElement('div');
        const controlArea = document.createElement('div');
        const pauseBtn = document.createElement('button');
        const avgText = document.createElement('div');

        document.body.appendChild(maskBox);
        maskBox.appendChild(mainBox);
        mainBox.appendChild(wrapS);
        mainBox.appendChild(wrapL);
        mainBox.appendChild(controlArea);
        controlArea.appendChild(pauseBtn);
        controlArea.appendChild(avgText);
        wrapS.appendChild(textS);
        wrapL.appendChild(textL);
        wrapS.appendChild(boxS);
        wrapL.appendChild(boxL);
        boxS.appendChild(progS);
        boxL.appendChild(progL);
        wrapS.appendChild(countS);
        wrapL.appendChild(countL);

        maskBox.style.position = 'fixed';
        maskBox.style.width = '100%';
        maskBox.style.height = '100%';
        maskBox.style.background = 'rgba(0,0,0,0.8)';
        maskBox.style.top = '0';
        maskBox.style.left = '0';
        maskBox.style.zIndex = '999';
        maskBox.style.display = 'flex';
        maskBox.style.alignItems = 'center';
        maskBox.style.justifyContent = 'center';

        mainBox.style.width = '655px';
        mainBox.style.height = '250px';
        mainBox.style.background = '#fff';
        mainBox.style.borderRadius = '6px';
        mainBox.style.padding = '51px 0';

        wrapS.style.width = wrapL.style.width = '655px';
        wrapS.style.height = wrapL.style.height = '100px';
        wrapS.style.display = wrapL.style.display = 'flex';
        wrapS.style.alignItems = wrapL.style.alignItems = 'center';
        wrapS.style.justifyContent = wrapL.style.justifyContent = 'center';

        textS.innerText = '短评:';
        textL.innerText = '长评:';
        textL.style.fontSize = textS.style.fontSize = '14px';
        textL.style.color = textS.style.color = '#333';
        textL.style.marginRight = textS.style.marginRight = '16px';

        boxL.style.width = boxS.style.width = '400px';
        boxL.style.height = boxS.style.height = '32px';
        boxL.style.background = boxS.style.background = '#eee';
        boxL.style.position = boxS.style.position = 'relative';

        progL.style.position = progS.style.position = 'absolute';
        progL.style.left = progS.style.left = '0';
        progL.style.top = progS.style.top = '0';
        progL.style.width = progS.style.width = '0%';
        progL.style.height = progS.style.height = '100%';
        progL.style.background = progS.style.background = '#ff85ad';

        countS.style.marginLeft = countL.style.marginLeft = '10px';
        countS.style.width = countL.style.width = '100px';

        controlArea.style.display = 'flex';
        controlArea.style.alignItems = 'center';
        controlArea.style.justifyContent = 'center';
        controlArea.style.marginTop = '20px';
        controlArea.style.gap = '20px';

        pauseBtn.id = 'pauseButton';
        pauseBtn.style.padding = '5px 15px';
        pauseBtn.style.cursor = 'pointer';
        pauseBtn.style.minWidth = '80px';
        pauseBtn.innerText = '暂停';

        avgText.style.fontSize = '14px';
        avgText.style.color = '#333';
        avgText.style.fontWeight = 'bold';
        avgText.innerText = '当前平均分: 0.00000';
        avgDisplay = avgText;

        pauseBtn.onclick = () => {
            isPaused = !isPaused;
            pauseBtn.innerText = isPaused ? '继续' : '暂停';
            if (!isPaused && avgDisplay) {
                avgDisplay.innerHTML = `当前平均分: ${calculateAverage()}`;
            }
        };

        render = (type) => {
            const node = type == 'long' ? progL : progS;
            const countNode = type == 'long' ? countL : countS;
            let width, count;
            if (type == 'long') {
                count = allData.length - totalCnt.short;
                width = `${count * 100 / totalCnt.long}%`;
            } else {
                count = allData.length;
                width = `${count * 100 / totalCnt.short}%`;
            }
            node.style.width = width;
            countNode.innerText = `${count}/${type == 'long' ? totalCnt.long : totalCnt.short}`;
        }

        rmDialog = () => {
            allData = [];
            totalCnt = { short: 0, long: 0 };
            document.body.removeChild(maskBox);
        }
    }

    async function execute() {
        preRender();
        await score('short');
        await score('long');
        const finalAvg = calculateAverage();
        document.getElementsByClassName('media-info-score-content')[0].innerText = finalAvg;
        updateStars(finalAvg);
        rmDialog();
    }

    function addButton() {
        let btnArea = document.getElementsByClassName('media-info-btns')[0];
        let followBtn = document.getElementsByClassName('bangumi-btn')[0];
        let exeBtn = document.createElement('div');
        let exeInner = document.createElement('div');
        btnArea.insertBefore(exeBtn, followBtn.nextSibling);
        exeBtn.appendChild(exeInner);
        exeBtn.className = 'bangumi-btn';
        exeBtn.onclick = execute;
        exeInner.className = 'btn-follow';
        exeInner.innerText = '真实评分';
    }

    addButton();
})();
