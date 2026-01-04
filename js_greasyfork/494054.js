// ==UserScript==
// @name         Linux.do 论坛抽奖脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Linux.do 论坛抽奖脚本，使用Drand提供的随机信标
// @author       Adonis142857
// @match        https://linux.do/t/topic/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/494054/Linuxdo%20%E8%AE%BA%E5%9D%9B%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/494054/Linuxdo%20%E8%AE%BA%E5%9D%9B%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加抽奖按钮
    let btn = document.createElement("button");
    btn.innerHTML = "抽奖";
    let titleDiv = document.getElementsByClassName("fancy-title")[0];
    titleDiv.appendChild(btn);

    // 抽奖按钮点击事件
    btn.onclick = function() {
        let openTime = prompt("请输入开奖时间 (如: Fri Dec 02 2022 12:00:00 GMT+0800)", "");
        let maxFloor = prompt("请输入最大抽奖楼层", "");
        let prizeCount = prompt("请输入奖品个数", "");

        // 检查开奖时间是否已经到达
        if (new Date(openTime) > new Date()) {
            alert("请等待到达设定开奖时间后再使用脚本");
            return;
        }

        let beaconRound = (new Date(openTime).getTime() / 1000 - 1595431050) / 30;

        const MAINCHAIN = '8990e7a9aaed2ffed73dbd7092123d6f289930540d7651336225dc172e51b2ce';
        let beaconUrl = `https://api.drand.sh/${MAINCHAIN}/public/${beaconRound}`;

        fetch(beaconUrl)
        .then(r => r.json())
        .then(r => {
            let seed = r.randomness;
            let randomOrgUrl = `https://www.random.org/sequences/?min=1&max=${maxFloor}&col=1&format=plain&rnd=id.${seed}`;
            return fetch(randomOrgUrl)
            .then(r => r.text())
            .then(r => {
                let winningFloors = r.split('\n').slice(0, prizeCount).sort((a, b) => a - b).join(', ');
                alert(`中奖楼层为${winningFloors}`);
            })
        })
    };
})();
