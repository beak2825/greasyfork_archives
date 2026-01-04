// ==UserScript==
// @name         我的桐人 自動行動
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click
// @author       DM
// @include      https://mykirito.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446409/%E6%88%91%E7%9A%84%E6%A1%90%E4%BA%BA%20%E8%87%AA%E5%8B%95%E8%A1%8C%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446409/%E6%88%91%E7%9A%84%E6%A1%90%E4%BA%BA%20%E8%87%AA%E5%8B%95%E8%A1%8C%E5%8B%95.meta.js
// ==/UserScript==

(function() {
    let arr = ['狩獵兔肉', '自主訓練', '外出野餐', '汁妹', '做善事', '坐下休息', '釣魚'];
    let exp = [0, 30, 60, 100, 150, 200, 250, 300, 370, 450, 500, 650, 800, 950, 1200, 1450, 1700, 1950, 2200, 2500, 2800, 3100, 3400, 3700, 4000,
        4400, 4800, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9100, 9700, 10300, 11000, 11800, 12600, 13500, 14400, 15300, 16200, 17100,
        18000, 19000, 20000, 21000, 23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 44000, 47000, 50000, 53000, 56000,
        59000, 62000, 65000, 68000, 71000
    ];
    let B = [];
    let btn_1 = document.querySelector(".sc-fzplWN:nth-child(4) > .sc-AxgMl:nth-child(3)");
    B.push(btn_1);
    for (let i = 0; i < 6; i++) {
        B.push(B[i].nextSibling);
    }

    function init() {
        // console.log("test")
    }

    function delay(n) {
        return new Promise(function(resolve) {
            setTimeout(resolve, n * 1000);
        });
    }

    function addAction(n) {
        let action = document.querySelector('#action').value;
        if (action) {
            document.querySelector('#action').value += '+' + B[n].innerHTML;
        } else {
            document.querySelector('#action').value = B[n].innerHTML;
        }
    }

    async function noodle_start() {
        let level = Number(document.querySelector('.sc-AxiKw:nth-child(4) > .sc-AxhUy:nth-child(2)').innerHTML);
        let nextLevel = exp[level];
        let nowExp = Number(document.querySelector('.sc-AxiKw:nth-child(4) > .sc-AxhUy:nth-child(4)').innerHTML);
        let diff = Number($('#diff').value);
        let str = document.querySelector('#action').value;
        let action = str.split('+');
        let len = action.length;
        let n = 0;
        for (let i = 0; i < len; i++) {
            action[i] = arr.indexOf(action[i]);
        }

        document.querySelector('#status').innerHTML = '狀態:運行中';

        while (nowExp <= nextLevel - diff) {
            let button = document.querySelector(".sc-fzplWN:nth-child(4) > .sc-AxgMl:nth-child(" + (action[n] + 2) + ")");
            myDate = new Date();
            button.click();
            console.log('完成行動-' + button.innerHTML + '(' + myDate.toLocaleTimeString() + ')');
            n = (n + 1) % len;
            await delay(70);
            nowExp = Number(document.querySelector('.sc-AxiKw:nth-child(4) > .sc-AxhUy:nth-child(4)').innerHTML);
        }

        document.querySelector('#status').innerHTML = '狀態:還差' + (nextLevel - nowExp) + '經驗值後升級';
        console.log('還差' + (nextLevel - nowExp) + '經驗值後升級');
    }

    function update() {
        let content = '';
        content += `
            <div class="sc-fzplWN hRBsWH">
                <h3 class="sc-fznyAO CWQMf">自動條本</h3>
                <div class="sc-fzqBZW eNQuho">
                    <div id="status">狀態:</div>
                </div>
                <div class="sc-fzqBZW eNQuho">
                    <div>經驗差</div>
                    <input type="text" class="sc-AxheI fniENO" value="720" id="diff">
                </div>
                <div class="sc-fzqBZW eNQuho">
                    <div>迴圈指令</div>
                    <input type="text" class="sc-AxheI fniENO" value="" id="action">
                    <button class="sc-AxgMl llLWDd" onclick="noodle_start();">開始</button>
                </div>
                <button class="sc-AxgMl llLWDd" onclick="addAction(0);">狩獵兔肉</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(1);">自主訓練</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(2);">外出野餐</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(3);">汁妹</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(4);">做善事</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(5);">坐下休息</button>
                <button class="sc-AxgMl llLWDd" onclick="addAction(6);">釣魚</button>
            </div>
        `;
        document.querySelector('.sc-fzplWN:nth-child(4)').insertAdjacentHTML('afterend', content);

    }

    init();

    //setTimeout(init,1000);
    update();
})();