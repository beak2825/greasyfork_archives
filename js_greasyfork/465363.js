// ==UserScript==
// @name         B站番剧真实评分
// @version      2.4.1
// @license      Apache-2.0
// @description  获得 BiliBili 番剧真实评分，打破智子锁分
// @author       KaiHuaDou
// @match        *://www.bilibili.com/bangumi/media/*
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/465363/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/465363/B%E7%AB%99%E7%95%AA%E5%89%A7%E7%9C%9F%E5%AE%9E%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

(() =>
{
    'use strict';

    let allData = [];
    let totalCnt = { short: 0, long: 0, }
    let render = null, rmDialog = null, mid;
    try { mid = location.href.match(/media\/md(\d+)/)[1] } catch { }
    if (!mid) { throw new Error('未进入番剧详情页面') }

    async function getScore(next, type)
    {
        let res, url = `https://api.bilibili.com/pgc/review/${type}/list?media_id=${mid}&ps=12575&sort=0`;
        if (next) url += `&cursor=${next}`;
        try { res = await fetch(url, { 'method': 'GET' }); }
        catch { return false; }
        const { data } = await res.json();
        if (totalCnt[type] == 0)
            totalCnt[type] = data.total;
        return data;
    }

    async function score(type)
    {
        let { list, next } = await getScore(undefined, type);
        submitList(list);
        while (true)
        {
            const data = await getScore(next, type);
            if (data == false) continue;
            submitList(data.list);
            render(type);
            next = data.next;
            if (next == 0) return;
        }
    }

    function average()
    {
        const total = allData.reduce((p, v) => { return p + v }, 0);
        const sf = total / allData.length.toFixed(1);
        document.getElementsByClassName('media-info-score-content')[0].innerText = sf;
        const starLc = parseInt(Math.round(sf / 2));
        const starHc = 5 - starLc;
        const starsDom = document.getElementsByClassName('review-stars')[0];
        starsDom.innerHTML = '';
        for (let i = 0; i < starLc; i++)
        {
            const star = document.createElement('i');
            star.className = 'icon-star icon-star-light';
            starsDom.appendChild(star);
        }
        for (let i = 0; i < starHc; i++)
        {
            const star = document.createElement('i');
            star.className = 'icon-star icon-star-half';
            starsDom.appendChild(star);
        }
    }

    function submitList(list)
    {
        allData.push(...list.map(item => item.score));
    }

    function preRender()
    {
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
        document.body.appendChild(maskBox);
        maskBox.appendChild(mainBox);
        mainBox.appendChild(wrapS);
        mainBox.appendChild(wrapL);
        wrapS.appendChild(textS);
        wrapL.appendChild(textL);
        wrapS.appendChild(boxS);
        wrapL.appendChild(boxL);
        boxS.appendChild(progS);
        boxL.appendChild(progL);
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
        mainBox.style.width = '455px';
        mainBox.style.height = '200px';
        mainBox.style.background = '#fff';
        mainBox.style.borderRadius = '6px';
        mainBox.style.padding = '51px 0';
        wrapS.style.width = wrapL.style.width = '455px';
        wrapS.style.height = wrapL.style.height = '100px';
        wrapS.style.display = wrapL.style.display = 'flex';
        wrapS.style.alignItems = wrapL.style.alignItems = 'center';
        wrapS.style.justifyContent = wrapL.style.justifyContent = 'center';
        textS.innerText = '短评:';
        textL.innerText = '长评:';
        textL.style.fontSize = textS.style.fontSize = '14px';
        textL.style.color = textS.style.color = '#333';
        textL.style.marginRight = textS.style.marginRight = '16px';
        boxL.style.width = boxS.style.width = '300px';
        boxL.style.height = boxS.style.height = '32px';
        boxL.style.background = boxS.style.background = '#eee';
        boxL.style.position = boxS.style.position = 'relative';
        progL.style.position = progS.style.position = 'absolute';
        progL.style.left = progS.style.left = '0';
        progL.style.top = progS.style.top = '0';
        progL.style.width = progS.style.width = '0%';
        progL.style.height = progS.style.height = '100%';
        progL.style.background = progS.style.background = '#ff85ad';
        render = (type) =>
        {
            const node = type == 'long' ? progL : progS;
            let width;
            if (type == 'long')
                width = `${(allData.length - totalCnt.short) * 100 / totalCnt.long}%`;
            else
                width = `${allData.length * 100 / totalCnt.short}%`;
            node.style.width = width;
        }
        rmDialog = () =>
        {
            allData = [], totalCnt = { short: 0, long: 0, }
            document.body.removeChild(maskBox);
        }
    }

    async function execute()
    {
        preRender();
        await score('short');
        await score('long');
        average();
        rmDialog();
    }

    function addButton()
    {
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