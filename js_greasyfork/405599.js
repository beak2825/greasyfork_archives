// ==UserScript==
// @name         MyKirito Helper
// @version      0.3.6.5
// @description  讓你可以更星爆
// @author       ganmaRRRRR
// @namespace    https://greasyfork.org/users/600262
// @match        https://mykirito.com/*
// https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @require      https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.bundle.min.js
// @resource     online_data https://pastebin.com/raw/ENjQzrAs
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/405599/MyKirito%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405599/MyKirito%20Helper.meta.js
// ==/UserScript==

var pkWinBase = [45, 55, 100, 120];
var pkWinMul = [3.75, 4.5, 8.5, 10];
var pkLoseBase = [25, 35, 70, 70];
var actTable = ['15~19', '15', '13~19', '18', '18', '15', '15', '700', '1280', '2440', '4800'];
var expTable = [70, 30, 60, 100, 150, 200, 250, 300, 370, 450, 500, 650, 800, 950, 1200, 1450, 1700, 1950, 2200, 2500, 2800, 3100, 3400, 3700, 4000, 4400, 4800, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9100, 9700, 10300, 11000, 11800, 12600, 13500, 14400, 15300, 16200, 17100, 18000, 19000, 20000, 21000, 23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000, 41000, 44000, 47000, 50000, 53000, 56000, 59000, 62000, 65000, 68000, 71000];
var actCD = [66, 14400];
const rattrCSS = '.fYZyZu {color: #00b5b5;}';
const buttonAniCSS = '.tippy-box[data-animation=shift-away-subtle][data-state=hidden]{opacity:0}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=top]{transform:translateY(5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=bottom]{transform:translateY(-5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=left]{transform:translateX(5px)}.tippy-box[data-animation=shift-away-subtle][data-state=hidden][data-placement^=right]{transform:translateX(-5px)}';
const inputCSS = '#id_input { width: 100%; border: 0; border-bottom: 2px solid #fff; outline: 0; color: #fff; padding: 7px 0; background: transparent; transition: border-color 0.2s; } #id_input::placeholder { color: #fff; }';
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scale: {
        ticks: {
            fontFamily: "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            fontSize: 14,
            showLabelBackdrop: false,
            maxTicksLimit: 6,
            beginAtZero: true,
        },
        pointLabels: {
            fontFamily: "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
            fontSize: 16,
            color: '#0044BB'
        },
        gridLines: {
            color: '#009FCC'
        },
    },
    title: {
        display: true,
        position: 'bottom',
        fontFamily: "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        fontSize: 16,
    },
    legend: {
        fontFamily: "'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
        fontSize: 14,
    },
    tooltips: {
        mode: 'index',
        callbacks: {
            title: function(tooltipItem, data) {
                return data.labels[tooltipItem[0].index];
            }
        }
    }
};

// config
var helperConfig = GM_getValue('MyKiritoHelper', { 'delay': 100, 'chart': false, 'id': false});
var inited = false;
var myK;
var otherK;

var myChart;
var floorBtn = [];
var actBtns = [];
var actToLvUp = [];
var pkBtns = [];
var nextTimetip = [];

(async function() {
    'use strict';

    // 抓Ajax Event
    function ajaxEventTrigger(event) {
        let ajaxEvent = new CustomEvent(event, { detail: this });
        unsafeWindow.dispatchEvent(ajaxEvent);
    }
    let oldXHR = unsafeWindow.XMLHttpRequest;
    function newXHR() {
        let realXHR = new oldXHR();
        // this指向window
        realXHR.addEventListener('readystatechange', function() { ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);
        return realXHR;
    }
    unsafeWindow.XMLHttpRequest = newXHR;
    unsafeWindow.addEventListener('ajaxReadyStateChange', function (e) {
        // 處理成功的request
        if (e.detail.readyState === oldXHR.DONE && e.detail.status === 200) {
            ajaxEventHandler(new URL(e.detail.responseURL), e.detail.response);
        }
    });

    // 抓fetch event
    let nativeFetch = unsafeWindow.fetch; // must be on the global scope
    unsafeWindow.fetch = function(...args) {
        let promise = nativeFetch(...args);
        promise.then((r) => {
            // 處理成功的request
            return (r.url.match('report') && r.ok) ? r.clone().json() : false; })
            .then((j) => {
            if (j) {
                reportThree(j);
            }
        });
        return promise;
    }

    waitForKeyElements('div#root > nav', init);
})();

function ajaxEventHandler(url, response) {
    if (url.pathname.split('/')[1] === 'cdn-cgi') { return; }
    let page = location.pathname.split('/')[1];
    let responseJ = JSON.parse(response);
    if (url.href === 'https://mykirito.com/api/my-kirito') {
        myK = responseJ;
    }
    switch (page) {
        case '': // 我的桐人
            myKirito(url, responseJ);
            break;
        case 'profile': // 別的桐人
            otherKirito(url, responseJ);
            break;
        default:
            if (!(page.match(/^(report)[^A-z]*[0-9]*$/))) {
                cleanObjs();
            }
            break;
    }
}

function init() {
    // Navbar置頂 (from https://greasyfork.org/zh-TW/scripts/404006-kirito-tools)
    let root = document.querySelector('div#root');
    let navbar = document.querySelector('div#root > nav');
    let navbarHeight = navbar.offsetHeight;
    root.style.paddingTop = `calc(${navbarHeight}px + 18px)`; // height + margin bottom
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.zIndex = '9999';

    // 玩家ID快速跳轉
    if (helperConfig.id) {
        let inputDiv = document.createElement('div');
        inputDiv.className = 'sc-fznAgC dSEOxJ';
        inputDiv.style.position = 'relative';
        inputDiv.style.width = '10%';
        inputDiv.insertAdjacentHTML('beforeend', '<input type="input" placeholder="玩家ID：" id="id_input" minlength="24" maxlength="24" required pattern="[0-9A-z]{24}">');
        navbar.insertBefore(inputDiv, navbar.lastChild);
        let idInput = document.getElementById('id_input');
        idInput.addEventListener('input', ()=> {
            if (idInput.checkValidity()) {
                window.open(`https://mykirito.com/profile/${idInput.value}`, '_blank');
                idInput.value = '';
            }
        })
    }

    // 加上選單按鈕
    let button = document.createElement('a');
    button.className = 'sc-fznAgC dSEOxJ';
    button.insertAdjacentHTML('beforeend', '<svg style="filter: invert(1);" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.666c-1.838 0-3.333 1.496-3.333 3.334s1.495 3.333 3.333 3.333 3.333-1.495 3.333-3.333-1.495-3.334-3.333-3.334m0 7.667c-2.39 0-4.333-1.943-4.333-4.333s1.943-4.334 4.333-4.334 4.333 1.944 4.333 4.334c0 2.39-1.943 4.333-4.333 4.333m-1.193 6.667h2.386c.379-1.104.668-2.451 2.107-3.05 1.496-.617 2.666.196 3.635.672l1.686-1.688c-.508-1.047-1.266-2.199-.669-3.641.567-1.369 1.739-1.663 3.048-2.099v-2.388c-1.235-.421-2.471-.708-3.047-2.098-.572-1.38.057-2.395.669-3.643l-1.687-1.686c-1.117.547-2.221 1.257-3.642.668-1.374-.571-1.656-1.734-2.1-3.047h-2.386c-.424 1.231-.704 2.468-2.099 3.046-.365.153-.718.226-1.077.226-.843 0-1.539-.392-2.566-.893l-1.687 1.686c.574 1.175 1.251 2.237.669 3.643-.571 1.375-1.734 1.654-3.047 2.098v2.388c1.226.418 2.468.705 3.047 2.098.581 1.403-.075 2.432-.669 3.643l1.687 1.687c1.45-.725 2.355-1.204 3.642-.669 1.378.572 1.655 1.738 2.1 3.047m3.094 1h-3.803c-.681-1.918-.785-2.713-1.773-3.123-1.005-.419-1.731.132-3.466.952l-2.689-2.689c.873-1.837 1.367-2.465.953-3.465-.412-.991-1.192-1.087-3.123-1.773v-3.804c1.906-.678 2.712-.782 3.123-1.773.411-.991-.071-1.613-.953-3.466l2.689-2.688c1.741.828 2.466 1.365 3.465.953.992-.412 1.082-1.185 1.775-3.124h3.802c.682 1.918.788 2.714 1.774 3.123 1.001.416 1.709-.119 3.467-.952l2.687 2.688c-.878 1.847-1.361 2.477-.952 3.465.411.992 1.192 1.087 3.123 1.774v3.805c-1.906.677-2.713.782-3.124 1.773-.403.975.044 1.561.954 3.464l-2.688 2.689c-1.728-.82-2.467-1.37-3.456-.955-.988.41-1.08 1.146-1.785 3.126"/></svg>');
    button.id = 'mykirito_helper';
    navbar.insertBefore(button, navbar.lastChild);
    tippy(button, {
        content: `<div style="text-align: center;">MyKirito Helper</div>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="show_chart" title="開關後請重新整理畫面" ${(helperConfig.chart)?"checked":""}> 能力值圖表 (WIP)</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="id_jump" title="開關後請重新整理畫面" ${(helperConfig.id)?"checked":""}> 玩家ID快速跳轉</label></p>`+
        `<input type="range" id="delay" min="100" max="1500" step="100" value=${helperConfig.delay}><p id="show_delay" style="display: inline;"> ${helperConfig.delay}</p>`+
        `ms Delay<p>有問題請嘗試調大此值</p><p style="text-align: right;"><a href="https://greasyfork.org/zh-TW/scripts/405599-mykirito-helper/feedback" target="_blank" title="Greasy Fork feedback" style="color: aqua;">回報問題</a>`+
        `<br><a href="https://discordapp.com/users/195493841384505344" target="_blank" title="如果你會害羞的話可以用這個" style="color: aqua;">在Discord上聯繫我</a></p>`,
        allowHTML: true,
        interactive: true,
        arrow: false,
        trigger: 'mouseenter focus click',
        placement: 'bottom',
        onShown() {
            if (!inited){
                document.getElementById('show_delay').textContent = ` ${document.getElementById('delay').value}`;
                document.getElementById('show_chart').addEventListener('input', () => {
                    (document.getElementById("show_chart").checked) ? helperConfig.chart = true : helperConfig.chart = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById('id_jump').addEventListener('input', () => {
                    (document.getElementById("id_jump").checked) ? helperConfig.id = true : helperConfig.id = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById('delay').addEventListener('input', () => {
                    helperConfig.delay = document.getElementById('delay').value;
                    document.getElementById('show_delay').textContent = ` ${helperConfig.delay}`;
                });
                document.getElementById('delay').addEventListener('change', () => {
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                inited = true;
            }
        },
    });

    // 更新線上資料
    let onlineData = GM_getResourceText('online_data');
    if (isExist(onlineData)) {
        onlineData = JSON.parse(onlineData);
        pkWinBase = onlineData.pkWinBase;
        pkWinMul = onlineData.pkWinMul;
        pkLoseBase = onlineData.pkLoseBase;
        actTable = onlineData.actTable;
        expTable = onlineData.expTable;
        actCD = onlineData.actCD;
        console.log(`取得線上資料成功（最後更新時間：${onlineData.lastUpdate}）`);
    }
    else {
        console.log('取得線上資料失敗');
    }

    // 加CSS
    injectCSS(rattrCSS);
    injectCSS(buttonAniCSS);
    injectCSS(inputCSS);
}

function myKirito(url, response) {
    let act = url.pathname.split('/');
    let gained;
    if (act[2] === 'my-kirito') {
        switch (act[3]) {
            case undefined: // 自己的資料
                cleanObjs();
                selfLink();
                updateExpReq();
                updateTeam();
                showKarma();
                addTooltip();
                addTimetip();
                addChartBtn();
                break;
            case 'teammate': // 隊伍資料
                updateTeam();
                break;
            case 'doaction': // 行動
                gained = response.gained;
                response = response.myKirito;
                updateExpReq();
                updateTooltip();
                addTimetip();
                updateMyK();
                break;
        }
    }

    async function selfLink() {
        await sleep(helperConfig.delay);
        let table = document.querySelector('div#root table > tbody');
        table.childNodes[0].childNodes[1].innerHTML = `<a id="self_link" href="https://mykirito.com/profile/${myK._id}" ${myK.color === 'black' ? '' : `style="color: ${myK.color}"`}>${myK.nickname}</a>`
    }

    // 更新經驗需求
    async function updateExpReq() {
        await sleep(helperConfig.delay);
        let expReq = document.getElementById('exp_require');
        if (!isExist(expReq)) {
            let table = document.querySelector('div#root table > tbody');
            let tr = table.lastChild.cloneNode(true);
            tr.childNodes[0].textContent = '距離升級';
            tr.childNodes[1].id = 'exp_require';
            tr.removeChild(tr.lastChild);
            tr.removeChild(tr.lastChild);
            table.appendChild(tr);
            expReq = document.getElementById('exp_require');
        }
        if (response.lv !== expTable[0]) {
            expReq.textContent = expTable[response.lv] - response.exp;
        }
        else {
            expReq.textContent = '滿級';
        }
    }

    // 更新隊友連結
    async function updateTeam() {
        await sleep(helperConfig.delay);
        let teamRef = document.getElementById('team_ref');
        if (!isExist(teamRef)) {
            let team = document.querySelector('div#root div > h3 ~ div ~ div ~ div');
            let a = document.createElement('a');
            a.id = 'team_ref';
            team.appendChild(a);
            teamRef = document.getElementById('team_ref');
        }
        let teammateUID = response.teammateUID;
        let teammateName = response.teammate;
        if (!isExist(teammateName)) {
            teammateName = document.querySelector('div ~ div > input').value;
        }
        if (teammateUID) {
            teamRef.href = `/profile/${teammateUID}`;
            teamRef.textContent = teammateName;
        }
        else {
            teamRef.href = '';
            teamRef.textContent = '';
        }
    }

    // 顯示murder
    async function showKarma() {
        await sleep(helperConfig.delay);
        let karma = document.getElementById('murder_count');
        if (!isExist(karma)) {
            let table = document.querySelector('div#root table > tbody');
            let kill = table.childNodes[6].childNodes[3];
            let k = document.createElement('span');
            k.id = 'murder_count';
            k.style.color = 'red';
            kill.appendChild(k);
            karma = document.getElementById('murder_count');
        }
        if (myK.murder > 0) {
            karma.textContent = ` (${myK.murder})`;
        }
    }

    // 按鈕提示
    async function addTooltip() {
        await sleep(helperConfig.delay);
        let buttons = document.querySelectorAll('button');
        floorBtn = buttons[2];
        try{
            buttons = [].slice.call(buttons, buttons.length-11);
            actBtns = [];
            actToLvUp = [];
            let config = {
                delay: [200, 100],
                moveTransition: 'transform 0.2s ease-out',
                animation: 'shift-away-subtle',
            };
            actBtns = actBtns.concat(createTipGroup(buttons.slice(0, 7), config));
            actBtns = actBtns.concat(createTipGroup(buttons.slice(7), config));
            config.delay = [1000, 100]; config.placement = 'bottom';
            actToLvUp = actToLvUp.concat(createTipGroup(buttons.slice(0, 7), config, false));
            actToLvUp = actToLvUp.concat(createTipGroup(buttons.slice(7), config, false));

            for (let i = 0; i < actBtns.length; i++) {
                actBtns[i].setContent(`${actTable[i]} 經驗值`);
            }
            updateTooltip();
            if (myK.floor > 0) {
                floorBtn = [].push(tippy(floorBtn, {
                    delay: [200, 100],
                    content: `${myK.floor * 100} 經驗值`,
                    animation: 'shift-away-subtle',}));
            }
        }
        catch(e) {}
    }

    // 計算幾次行動後升級
    async function updateTooltip() {
        if (response.lv === expTable[0]) {
            cleanTips(actToLvUp);
            return;
        }
        await sleep(helperConfig.delay);
        let expReq = expTable[response.lv] - response.exp;
        for (let i = 0; i < 11; i++) {
            if (i === 0 || i === 2) {
                actToLvUp[i].setContent(`約 ${Math.ceil(expReq / ((Number(actTable[i].slice(3)) + Number(actTable[i].slice(0, 2))) / 2))} 次此行動後升級` );
            }
            else {
                actToLvUp[i].setContent(`${Math.ceil(expReq / (Number(actTable[i])))} 次此行動後升級`);
            }
        }
    }

    // 修行跟樓層獎勵加上時間提示
    async function addTimetip() {
        await sleep(helperConfig.delay);
        let now = new Date();
        let config = {
            delay: [200, 100],
            trigger: 'mouseenter focus click',
            placement: 'right',
            animation: 'shift-away-subtle',
        };
        try {
            cleanTips(nextTimetip);
        }
        catch(e) {
            nextTimetip = [];
        }

        // 有樓層獎勵
        if (myK.floor > 0) {
            let nextFB = new Date(response.lastFloorBonus + actCD[1] * 1000);
            if (nextFB.getTime() > now.getTime() + 100 * 1000) {
                let divFB = document.querySelector('div#root > div > div > div:nth-child(3)');
                divFB.firstChild.style.display = 'table';
                config.content = '下次可領取時間：' + nextFB.toLocaleTimeString();
                let nextFBTip = createTipGroup(divFB.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextFBTip);
                clearAtTime(nextFBTip[0], nextFB.getTime());
            }
            if (response.lastAction > now.getTime() + 100 * 1000) {
                let nextAct = new Date(response.lastAction + actCD[0] * 1000);
                let divAct = document.querySelector('div#root > div > div > div:nth-child(4)');
                divAct.firstChild.style.display = 'table';
                config.content = '下次可行動時間：' + nextAct.toLocaleTimeString();
                let nextActTip = createTipGroup(divAct.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextActTip);
                clearAtTime(nextActTip[0], nextAct.getTime());
            }
        }
        else {
            if (response.lastAction > now.getTime() + 100 * 1000) {
                let nextAct = new Date(response.lastAction + actCD[0] *1000);
                let divAct = document.querySelector('div#root > div > div > div:nth-child(3)');
                divAct.firstChild.style.display = 'table';
                config.content = '下次可行動時間：' + nextAct.toLocaleTimeString();
                let nextActTip = createTipGroup(divAct.firstChild, config, false);
                nextTimetip = nextTimetip.concat(nextActTip);
                clearAtTime(nextActTip[0], nextAct.getTime());
            }
        }

        function clearAtTime(tip, timetoclear) {
            setTimeout(() => { tip.destroy(); }, timetoclear - now.getTime() - 100 * 1000);
        }
    }

    async function addChartBtn() {
        if (!helperConfig.chart) { return; }
        await sleep(helperConfig.delay);
        let title = document.querySelector('div#root div > div > div > h3');
        title.insertAdjacentHTML('afterend', '<button class="sc-AxgMl llLWDd" id="chart_button">顯示能力值圖表</button>');
        let btn = document.getElementById('chart_button');
        btn.addEventListener('click', () => {
            if (btn.textContent === '顯示能力值圖表') {
                btn.textContent = '隱藏能力值圖表';
                showChart();
            }
            else{
                btn.textContent = '顯示能力值圖表';
                document.getElementById('myChart_container').style.display = 'none';
            }
        });
    }

    // 顯示圖表
    async function showChart() {
        let chartContainer = document.getElementById('myChart_container');
        if (!isExist(chartContainer)) {
            let ddd = document.querySelector('div#root > div > div > div');
            ddd.insertAdjacentHTML('beforeend', '<div id="myChart_container" style="position: relative; height: 400px; margin: 20px 0px 0px;"><canvas id="myChart"></canvas></div>');
            chartContainer = document.getElementById('myChart_container');
            let ctx = document.getElementById('myChart');
            let AP = getAP(myK);
            let color = randomRGB();
            let data = {
                labels: ['攻擊', '防禦', '體力', '敏捷', '反應速度', '技巧', '智力', '幸運'],
                datasets: [{
                    label: myK.nickname,
                    data: Object.values(AP).slice(1),
                    borderColor: color+'1)',
                    backgroundColor: color+'0.25)',
                    borderJoinStyle: 'round'
                }]
            }
            let options = chartOptions;
            options.title.text = [`Lv.${myK.lv} ${myK.character}  ${AP.hp}HP`];
            options.legend.display = false;
            options.scale.ticks.max = Math.ceil(Math.max(...Object.values(AP).slice(1)) / 50) * 50;
            if (document.getElementsByClassName('dark').length !== 0) {
                options.scale.ticks.fontColor = 'white';
                options.scale.pointLabels.fontColor = 'white';
                options.scale.angleLines = { color: 'white' };
                options.title.fontColor = 'white';
            }

            myChart = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options,
            });
            await sleep(100);
            chartContainer.scrollIntoView({behavior: 'smooth', block: 'center'});

        }
        else {
            chartContainer.style.display = 'block';
            await sleep(100);
            chartContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    async function updateMyK() {
        if (gained.prevLV === gained.nextLV) { return; }
        let gainedAP = getAP(gained);
        for (let k in gainedAP) {
            myK[k] += gainedAP[k];
        }
        myK.lv = gained.nextLV;
        updateChart();
    }

    // 升級時更新圖表
    async function updateChart() {
        if (!helperConfig.chart) { return; }
        let chartContainer = document.getElementById('myChart_container');
        if (!isExist(chartContainer)) { return; }
        await sleep(helperConfig.delay);
        let AP = getAP(myK);
        myChart.data.datasets[0].data = Object.values(AP).slice(1);
        myChart.options.title.text = [`${myK.nickname}`, `Lv.${myK.lv} ${myK.character}  ${AP.hp}HP`];
        myChart.options.scale.ticks.max = Math.ceil(Math.max(...Object.values(AP).slice(1)) / 50) * 50;
        myChart.update();
    }
}

async function otherKirito(url, response) {
    switch (url.pathname.split('/')[2]) {
        case 'profile': // 別人的資料
            otherK = response.profile;
            if (isExist(otherK) && isExist(myK)) {
                cleanObjs();
                showRattr();
                addTooltip();
                addChartBtn();
            }
            break;
        case 'my-kirito':
            myK = response;
            if (isExist(otherK) && isExist(myK)) {
                cleanObjs();
                showRattr();
                addTooltip();
                addChartBtn();
            }
            break;
        case 'challenge':
            updateMyK();
            break;
    }

    // 顯示轉生點分配
    async function showRattr() {
        await sleep(helperConfig.delay);
        let btnDetail = document.querySelectorAll('button')[0];
        let btnCompare = document.querySelectorAll('button')[1];
        if (!isExist(btnDetail) || !isExist(btnCompare)) {
            waitForKeyElements('button ~ button', () => {
                btnDetail = document.querySelectorAll('button')[0];
                btnCompare = document.querySelectorAll('button')[1];
            });
        }
        btnSwitch();
        btnDetail.addEventListener('click', btnSwitch);
        btnCompare.addEventListener('click', btnSwitch);

        async function btnSwitch() {
            let chartContainer = document.getElementById('myChart_container');
            if (isExist(chartContainer)) {
                chartContainer.style.display = 'none';
            }
            await sleep(helperConfig.delay);
            // 詳細資料
            if (btnDetail.disabled) {
                let table = document.querySelector('div#root tbody');
                rattrAppend(document.querySelector('div#root table > tbody'), otherK.rattrs, 4);

                // 一些有的沒的
                if (!isExist(document.getElementById('addi_info'))) {
                    let tr = table.lastChild.cloneNode(true);
                    tr.id = 'addi_info';
                    tr.childNodes[0].textContent = '目前層數';
                    tr.childNodes[1].textContent = otherK.floor;
                    tr.childNodes[2].textContent = '成就點數';
                    tr.childNodes[3].textContent = otherK.achievementPoints;
                    table.appendChild(tr);
                }

                let karma = document.getElementById('murder_count');
                if (!isExist(karma)) {
                    let table = document.querySelector('div#root table > tbody');
                    let kill = table.childNodes[6].childNodes[3];
                    let k = document.createElement('span');
                    k.id = 'murder_count';
                    k.style.color = 'red';
                    kill.appendChild(k);
                    karma = document.getElementById('murder_count');
                }
                if (otherK.murder > 0) {
                    karma.textContent = ` (${otherK.murder})`;
                }

            }
            // 能力比對
            else {
                rattrAppend(document.querySelector('div#root table > tbody'), myK.rattrs, 6);
                rattrAppend(document.querySelector('div#root table ~ table > tbody'), otherK.rattrs, 6);
            }
            if (isExist(chartContainer)) {
                btnDetail.parentNode.appendChild(chartContainer);
                let btn = document.getElementById('chart_button');
                if (btn.textContent === '隱藏能力值圖表') {
                    chartContainer.style.display = 'block';
                }
            }
        }

        function rattrAppend(table, rattrs, count=0) {
            for (let k in rattrs) {
                if (rattrs[k] !== 0) {
                    let r = document.createElement('span');
                    r.className = 'sc-fzoLsD fYZyZu show_rattr';
                    r.textContent = ` (+${rattrs[k]})`;
                    if (k === 'hp') {
                        r.textContent = ` (+${rattrs[k] * 10})`;
                    }
                    if (!(table.childNodes[count].childNodes[1].childElementCount != 0 && table.childNodes[count].childNodes[1].childNodes[0].classList.contains('show_rattr'))) {
                        table.childNodes[count].childNodes[1].appendChild(r);
                    }
                }
                count++;
            }
        }
    }


    // 按鈕提示
    async function addTooltip() {
        await sleep(helperConfig.delay);
        let lvDiff = otherK.lv - myK.lv;
        let buttons = [].slice.call(document.querySelectorAll('button'), 6, 10);
        try{
            pkBtns = createTipGroup(buttons, {
                delay: [200, 100],
                moveTransition: 'transform 0.2s ease-out',
                placement: 'left',
                animation: 'shift-away-subtle',
            });
            for (let i = 0; i < 4; i++) {
                let text;
                if (lvDiff > 12) {
                    lvDiff = 12;
                }
                if (lvDiff >= 0) {
                    text = `${pkWinBase[i] + Math.floor(pkWinMul[i] * lvDiff)} / ${pkLoseBase[i]}`;
                }
                else {
                    text = `<${pkWinBase[i]} / ${pkLoseBase[i]}`;
                }
                pkBtns[i].setContent(`${text} 經驗值`);
            }
        }
        catch(e) {}
    }

    async function addChartBtn() {
        if (!helperConfig.chart) { return; }
        await sleep(helperConfig.delay);
        let title = document.querySelector('div#root div > div > div > h3');
        title.insertAdjacentHTML('afterend', '<button class="sc-AxgMl llLWDd" id="chart_button">顯示能力值圖表</button>');
        let btn = document.getElementById('chart_button');
        btn.addEventListener('click', () => {
            if (btn.textContent === '顯示能力值圖表') {
                btn.textContent = '隱藏能力值圖表';
                showChart();
            }
            else{
                btn.textContent = '顯示能力值圖表';
                document.getElementById('myChart_container').style.display = 'none';
            }
        });
    }

    // 顯示圖表
    async function showChart() {
        let chartContainer = document.getElementById('myChart_container');
        if (!isExist(chartContainer)) {
            let ddd = document.querySelector('div#root > div > div > div');
            ddd.insertAdjacentHTML('beforeend', '<div id="myChart_container" style="position: relative; height: 450px; margin: 20px 0px 0px;"><canvas id="myChart"></canvas></div>');
            chartContainer = document.getElementById('myChart_container');
            let ctx = document.getElementById('myChart');
            let myAP = getAP(myK);
            let otherAP = getAP(otherK);
            let data = {
                labels: ['攻擊', '防禦', '體力', '敏捷', '反應速度', '技巧', '智力', '幸運'],
                datasets: [{
                    label: myK.nickname,
                    data: Object.values(myAP).slice(1),
                    borderColor: 'rgba(95, 155, 255, 1)',
                    backgroundColor: 'rgba(95, 155, 255, 0.25)',
                    borderJoinStyle: 'round'
                }, {
                    label: otherK.nickname,
                    data: Object.values(otherAP).slice(1),
                    borderColor: 'rgba(250, 90, 90, 1)',
                    backgroundColor: 'rgba(250, 90, 90, 0.25)',
                    borderJoinStyle: 'round'}]
            }
            let options = chartOptions;
            options.title.text = [`Lv.${myK.lv} ${myK.character}  ${myAP.hp}HP   vs   Lv.${otherK.lv} ${otherK.character}  ${otherAP.hp}HP`];
            options.title.lineHeight = 1.4;
            options.legend.display = true;
            if (document.getElementsByClassName('dark').length !== 0) {
                options.scale.ticks.fontColor = 'white';
                options.scale.pointLabels.fontColor = 'white';
                options.scale.angleLines = { color: 'white' };
                options.title.fontColor = 'white';
                options.legend.labels = { fontColor: 'white' };
            }
            myChart = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options,
            });
            await sleep(100);
            chartContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
        else {
            chartContainer.style.display = 'block';
            await sleep(100);
            chartContainer.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    async function updateMyK() {
        if (response.gained.prevLV === response.gained.nextLV) { return; }
        let gainedAP = getAP(response.gained);
        for (let k in gainedAP) {
            myK[k] += gainedAP[k];
        }
        myK.lv = response.gained.nextLV;
    }
}

// 戰報處理
async function reportThree(report) {
    await sleep(helperConfig.delay);
    // boss戰
    if (report.type === 99) {}
    // 對戰
    else {
        let atkTable = document.querySelectorAll('tbody')[0];
        let defTable = document.querySelectorAll('tbody')[1];
        if (!isExist(atkTable) || !isExist(defTable)) {
            waitForKeyElements('table ~ table', () => {
                atkTable = document.querySelectorAll('tbody')[0];
                defTable = document.querySelectorAll('tbody')[1];
            });}
        tableEnhance(report.a, report.b, atkTable);
        tableEnhance(report.b, report.a, defTable);
        showChart();

        function tableEnhance(data1, data2, table) {
            let AP1 = getAP(data1);
            let AP2 = getAP(data2);
            let count = 6;

            table.childNodes[3].childNodes[1].innerHTML = `<a href="/profile/${data1.uid}">${data1.nickname}</a>`
            for (let k in AP1) {
                table.childNodes[count].childNodes[1].insertAdjacentHTML('beforeend', pCompare(AP1[k], AP2[k]));
                table.childNodes[count].childNodes[1].style.display = 'flex';
                table.childNodes[count].childNodes[1].style.justifyContent = 'space-between';
                count++;
            }

            function pCompare(p1, p2) {
                if (p1 > p2) {
                    return `<span class="fYZyZu">+${p1-p2}</span>`;
                }
                else {
                    return `<span style="color: red;">-${p2-p1}</span>`;
                }
            }
        }

        // 顯示圖表
        async function showChart() {
            let chartContainer = document.getElementById('myChart_container');
            if (!isExist(chartContainer)) {
                let ddd = document.querySelector('div#root > div > div > div');
                ddd.insertAdjacentHTML('beforeend', '<div id="myChart_container" style="position: relative; height: 450px; margin: 20px 0px 0px;"><canvas id="myChart"></canvas></div>');
                let ctx = document.getElementById('myChart');
                let AP1 = getAP(report.a);
                let AP2 = getAP(report.b);
                let data = {
                    labels: ['攻擊', '防禦', '體力', '敏捷', '反應速度', '技巧', '智力', '幸運'],
                    datasets: [{
                        label: report.a.nickname,
                        data: Object.values(AP1).slice(1),
                        borderColor: 'rgba(95, 155, 255, 1)',
                        backgroundColor: 'rgba(95, 155, 255, 0.25)',
                        borderJoinStyle: 'round'
                    }, {
                        label: report.b.nickname,
                        data: Object.values(AP2).slice(1),
                        borderColor: 'rgba(250, 90, 90, 1)',
                        backgroundColor: 'rgba(250, 90, 90, 0.25)',
                        borderJoinStyle: 'round'}]
                }
                let options = chartOptions;
                options.title.text = [`Lv.${report.a.lv} ${report.a.character}  ${AP1.hp}HP   vs   Lv.${report.b.lv} ${report.b.character}  ${AP2.hp}HP`];
                options.title.lineHeight = 1.4;
                options.legend.display = true;
                if (document.getElementsByClassName('dark').length !== 0) {
                    options.scale.ticks.fontColor = 'white';
                    options.scale.pointLabels.fontColor = 'white';
                    options.scale.angleLines = { color: 'white' };
                    options.title.fontColor = 'white';
                    options.legend.labels = { fontColor: 'white' };
                }
                myChart = new Chart(ctx, {
                    type: 'radar',
                    data: data,
                    options: options,
                });
            }
            else {
                chartContainer.style.display = 'block';
            }
        }
    }
}

// 拿能力值 (加上轉生點)
function getAP(data) {
    if (data.rattrs) {
        return {
            'hp': data.hp + data.rattrs.hp * 10,
            'atk': data.atk + data.rattrs.atk,
            'def': data.def + data.rattrs.def,
            'stm': data.stm + data.rattrs.stm,
            'agi': data.agi + data.rattrs.agi,
            'spd': data.spd + data.rattrs.spd,
            'tec': data.tec + data.rattrs.tec,
            'int': data.int + data.rattrs.int,
            'lck': data.lck + data.rattrs.lck
        };
    }
    return {
        'hp': data.hp,
        'atk': data.atk,
        'def': data.def,
        'stm': data.stm,
        'agi': data.agi,
        'spd': data.spd,
        'tec': data.tec,
        'int': data.int,
        'lck': data.lck
    };
}

// 好醜
function cleanObjs() {
    let expReq = document.getElementById('exp_require');
    let teamRef = document.getElementById('team_ref');
    let addiInfo = document.getElementById('addi_info');
    let rattrs = document.getElementsByClassName('show_rattr');
    let chartDiv = document.getElementById('myChart_container');
    let chartBtn = document.getElementById('chart_button');
    let selfLink = document.getElementById('self_link');
    if (isExist(expReq)) { expReq.parentNode.remove(); }
    if (isExist(addiInfo)) { addiInfo.remove(); }
    if (isExist(teamRef)) { teamRef.remove(); }
    if (isExist(rattrs)) {
        for (let i = 0; i < rattrs.length;) {
            rattrs[i].remove();
        }
    }
    if (isExist(chartDiv)) { chartDiv.remove(); }
    if (isExist(chartBtn)) { chartBtn.remove(); }
    if (isExist(selfLink)) { selfLink.remove(); }
    if (isExist(floorBtn)) { cleanTips(floorBtn); }
    if (isExist(actBtns)) { cleanTips(actBtns); }
    if (isExist(actToLvUp)) { cleanTips(actToLvUp); }
    if (isExist(pkBtns)) { cleanTips(pkBtns); }
    if (isExist(nextTimetip)) { cleanTips(nextTimetip); }
    if (isExist(myChart)) {myChart.destroy(); }
}

function cleanTips(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i].destroy();
    }
    arr = [];
}

// 建立tootip並綁定成一組
function createTipGroup(btns, config, sglt=true) {
    if (!Array.isArray(btns)) { btns = [btns]; }
    let tippyBtns = [];
    for (let i = 0; i < btns.length; i++) {
        tippyBtns.push(tippy(btns[i], config));
    }
    if (sglt) { tippy.createSingleton(tippyBtns, config); }
    return tippyBtns;
}

function isExist(obj) {
    return !(obj === undefined || obj === null);
}

async function sleep(ms=0) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// from tippy.js
function injectCSS(css) {
    var style = document.createElement('style');
    style.textContent = css;
    var head = document.head;
    var firstStyleOrLinkTag = document.querySelector('head>style,head>link');

    if (firstStyleOrLinkTag) {
        head.insertBefore(style, firstStyleOrLinkTag);
    } else {
        head.appendChild(style);
    }
}

function randomRGB() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',';
}

function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes = (typeof selectorOrFunction === "function")
    ? selectorOrFunction()
    : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function(targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                }
                else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function() {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}