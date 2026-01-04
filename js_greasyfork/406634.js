// ==UserScript==
// @name         MyKirito Helper Unofficial version for 08 domitest
// @version      0.3.8.9
// @description  在原版的基礎上加入一些無聊的MOD
// @author       EWAVE#7445 & ganmaRRRRR
// @namespace    https://greasyfork.org/users/591565
// @match        https://mykirito.com/*
// https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @require      https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.bundle.min.js
// @resource     online_data https://pastebin.com/raw/ENjQzrAs
// @require      https://greasyfork.org/scripts/407660-gm-configzhtw/code/GM_configzhtw.js?version=830159
// @require      https://code.jquery.com/jquery-3.5.1.js
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406634/MyKirito%20Helper%20Unofficial%20version%20for%2008%20domitest.user.js
// @updateURL https://update.greasyfork.org/scripts/406634/MyKirito%20Helper%20Unofficial%20version%20for%2008%20domitest.meta.js
// ==/UserScript==


var s=document.createElement('script'); //抱歉我就爛，沒Jquery我不行
s.setAttribute('src','//code.jquery.com/jquery.js');
document.getElementsByTagName('body')[0].appendChild(s);



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
            //max: Math.ceil(Math.max(...Object.values(AP).slice(1)) / 50) * 50,
            beginAtZero: true
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
var helperConfig = GM_getValue('MyKiritoHelper', { 'yuukiMod': false, 'lisbethMod': false, 'deadMod': false, 'backgroundMOD': false, 'scrolllistMOD':true, 'NotificationMOD':false, 'wanted': false, 'delay': 300, 'chart': false, 'id': false});
var inited = false;
var myK;
var otherK;

var myChart;
var floorBtn = [];
var actBtns = [];
var actToLvUp = [];
var pkBtns = [];
var nextTimetip = [];
//modcode
var 背景圖片上面的漸層顏色 = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

var 擴充CSS = ``;
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
//modcode
var fielddata = {
    'mainpillar': {
        'section': GM_config.create('主要MOD'),
        'type': 'hidden',
        'default': false
    },
    'background':
    {
      'label': '背景圖片網址:',
      'type': 'text',
      'default': 'https://i.imgur.com/SnvoAPB.jpg'
    },
    'deadpic':
    {
      'label': '鯊魚上香圖片:',
      'type': 'text',
      'default': 'https://i.imgur.com/9GBle3E.png'
    },
    'yuukifull':
    {
      'label': '有紀全身圖:',
      'type': 'text',
      'default': 'https://i.imgur.com/nZL3XsZ.png'
    },
    'yuukismall':
    {
      'label': '有紀縮圖:',
      'type': 'text',
      'default': 'https://i.imgur.com/S885RSD.png'
    },
    'wantedpillar': {
        'section': '通緝設定',
        'type': 'hidden',
        'default': false
    },
    'wantedsw':
    {
      'label': '通緝功能開關:',
      'type': 'checkbox',
      'default': true
    },
    'mainchsw':
    {
      'label': '開啟通緝主頻道:',
      'type': 'checkbox',
      'default': true
    },
    'secchsw':
    {
      'label': '開啟通緝副頻道:',
      'type': 'checkbox',
      'default': false
    },
    'maincurl':
    {
      'label': '主頻道webhook:',
      'type': 'text',
      'default': "https://discordapp.com/api/webhooks/733733496568283146/dEuBd46wVwTkdcl9LHT1KJCRfKHX1ZfSFJ8gXzA9KrKTES3qXp8WEJqQdiZbv67Yimqb"
    },
    'seccurl':
    {
      'label': '副頻道webhook:',
      'type': 'text',
      'default': "https://discordapp.com/api/webhooks/732927583296946216/G2IjfemCyC7704UQOz3eTlwNUCh_gsjWpYk6cdmVNcpUiLHiqP4_TlTvHQwE1c-4QHhj"
    },
    'botname':
    {
      'label': '發送名稱:',
      'type': 'text',
      'default': "通緝發送"
    },
    'botpic':
    {
      'label': '通緝頭貼:',
      'type': 'text',
      'default': "https://i.imgur.com/8QowXWD.jpg"
    },
    'botcolor':
    {
      'label': '通緝顏色:',
      'type': 'text',
      'default': "16411130"
    },
    'wantedpil':
    {
      'section': GM_config.create('篩選設定'),
      'type': 'hidden',
      'default': ''
    },
    'wantedpl':
    {
      'label': '篩選角色:',
      'size': "4",
      'type': 'text',
      'default': '莉茲貝特'
    },
    'wantedpl2':
    {
      'label': ',',
      'size': "4",
      'type': 'text',
      'default': '風精靈'
    },
    'wantedpl3':
    {
      'label': ',',
      'size': "4",
      'type': 'text',
      'default': '角色稱號'
    },
    'wantedpl4':
    {
      'label': ',',
      'size': "4",
      'type': 'text',
      'default': '都能篩選'
    },
    'wantedpl5':
    {
      'label': ',',
      'size': "4",
      'type': 'text',
      'default': '無'
    },
    'wantedpl6':
    {
      'label': ',',
      'size': "4",
      'type': 'text',
      'default': '無'
    },
};

GM_config.init(
{
    'id': 'modconfig', // The id used for this instance of GM_config
    'title': 'MOD設定',
    'fields': fielddata,
    'css': '#modconfig { background: #2c2f33; color:white;} #modconfig_section_2 .config_var { width: 10%; display: inline; } #modconfig .config_var{margin: 0 0 20px;} #modconfig .field_label {font-size: 16px;} #modconfig * { font-family:Helvetica Neue,Helvetica,Arial,微軟正黑體,sans-serif} #modconfig .reset, #modconfig .reset a, #modconfig_buttons_holder { color: white; }',
    'events': // Callback functions object
    {
      'init': function() {},
      'open': function() { this.frame.setAttribute('style', 'top: 120px; left: 239px; right: auto; position: fixed; width: 562px; height: 676px;text-align: left; background: white; margin: 30px 0; box-shadow: 0 0 30px black; border-width: 0; transition: transform .2s linear; transform: translateY(-20px);')},
      'save': function() {location.reload();},
      'close': function() {},
      'reset': function() {}
    }
});


// bottom: auto; border: 1px solid #000; display: none; height: 75%;left: 0; margin: 0; max-height: 35%; max-width: 35%; opacity: 0;overflow: auto; padding: 0; position: fixed; right: auto; top: 0;width: 45%; z-index: 999999999;

var 背景圖片網址 = GM_config.get('background');
var 死亡圖片 = GM_config.get('deadpic');
var 有紀全身圖 = GM_config.get('yuukifull');
var 有紀縮圖 = GM_config.get('yuukismall');
var 開啟通緝按鈕 = GM_config.get('wantedsw');
var 開啟通緝主頻道 = GM_config.get('mainchsw');
var 開啟通緝副頻道 = GM_config.get('secchsw');
var 主頻道webhook = GM_config.get('maincurl');
var 副頻道webhook = GM_config.get('seccurl');
var 發送名稱 = GM_config.get('botname');
var 通緝頭貼 = GM_config.get('botpic');
//發通緝左邊那行顏色 預設紫色 例子 11664664(黃綠) 8908790(天空藍)
var 通緝顏色 = GM_config.get('botcolor');

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
        case "user-list":
            setTimeout(playerFilter, helperConfig.delay);
            setTimeout(playerFilter_Golden, helperConfig.delay);
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
    // modcode
    let bosss = document.createElement("LINK");
    bosss.className = "sc-fznAgC dSEOxJ";
    bosss.innerText = "攻略網";
    navbar.insertBefore(bosss, navbar.lastChild);
    bosss.addEventListener("click", function() {
        var redirectWindow = window.open('https://mykirito.nctu.me/', '_blank');
        redirectWindow.location;
    })
    let configsetting = document.createElement("configse");
    configsetting.className = "sc-fznAgC dSEOxJ";
    configsetting.innerText = "MOD設定";
    navbar.insertBefore(configsetting, navbar.lastChild);
    configsetting.addEventListener("click", function() {
        GM_config.open();
    })
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
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="yuuki_mod" title="開關後請重新整理畫面" ${(helperConfig.yuukiMod)?"checked":""}> 有紀切換</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="wanted_mod" title="開關後請重新整理畫面" ${(helperConfig.wanted)?"checked":""}> 篩選角色(稽查專用)</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="lisbeth_mod" title="開關後請重新整理畫面" ${(helperConfig.lisbethMod)?"checked":""}> 尊爵不凡莉茲貝特</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="dead_mod" title="開關後請重新整理畫面" ${(helperConfig.deadMod)?"checked":""}> 鯊魚上香</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="background_mod" title="開關後請重新整理畫面" ${(helperConfig.backgroundMOD)?"checked":""}> 背景圖片(跟其他MOD一起開會卡)</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="scrolllist_mod" title="開關後請重新整理畫面" ${(helperConfig.scrolllistMOD)?"checked":""}> 玩家選單滑動(測試)</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="notification_mod" title="開關後請重新整理畫面" ${(helperConfig.NotificationMOD)?"checked":""}> 切磋行動提醒</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="show_chart" title="開關後請重新整理畫面" ${(helperConfig.chart)?"checked":""}> 能力值圖表 (WIP)</label></p>`+
        `<p><label title="開關後請重新整理畫面"><input type="checkbox" id="id_jump" title="開關後請重新整理畫面" ${(helperConfig.id)?"checked":""}> 玩家ID快速跳轉</label></p>`+
        `<input type="range" id="delay" min="100" max="1500" step="100" value=${helperConfig.delay}><p id="show_delay" style="display: inline;"> ${helperConfig.delay}</p>`+
        `ms Delay<p>有問題請嘗試調大此值</p><p style="text-align: right;"><a href="https://greasyfork.org/zh-TW/scripts/406848-mykirito-helper-unofficial-version-public/feedback" target="_blank" title="Greasy Fork feedback" style="color: aqua;">回報問題</a>`+
        `<br><a href="https://discordapp.com/users/505418872153964554" target="_blank" title="如果你會害羞的話可以用這個" style="color: aqua;">在Discord上聯繫我(MOD版)</a></p>`,
        allowHTML: true,
        interactive: true,
        arrow: false,
        trigger: 'mouseenter focus click',
        placement: 'bottom',
        onShown() {
            if (!inited){
                document.getElementById('show_delay').textContent = ` ${document.getElementById('delay').value}`;
                document.getElementById("yuuki_mod").addEventListener('input', () => {
                    (document.getElementById("yuuki_mod").checked) ? helperConfig.yuukiMod = true : helperConfig.yuukiMod = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("wanted_mod").addEventListener('input', () => {
                    (document.getElementById("wanted_mod").checked) ? helperConfig.wanted = true : helperConfig.wanted = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("lisbeth_mod").addEventListener('input', () => {
                    (document.getElementById("lisbeth_mod").checked) ? helperConfig.lisbethMod = true : helperConfig.lisbethMod = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("dead_mod").addEventListener('input', () => {
                    (document.getElementById("dead_mod").checked) ? helperConfig.deadMod = true : helperConfig.deadMod = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("background_mod").addEventListener('input', () => {
                    (document.getElementById("background_mod").checked) ? helperConfig.backgroundMOD = true : helperConfig.backgroundMOD = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("scrolllist_mod").addEventListener('input', () => {
                    (document.getElementById("scrolllist_mod").checked) ? helperConfig.scrolllistMOD = true : helperConfig.scrolllistMOD = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
                document.getElementById("notification_mod").addEventListener('input', () => {
                    (document.getElementById("notification_mod").checked) ? helperConfig.NotificationMOD = true : helperConfig.NotificationMOD = false;
                    GM_setValue('MyKiritoHelper', helperConfig);
                });
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
        console.log(`取得線上資料成功，最後更新時間：${onlineData.lastUpdate}`);
    }
    else {
        console.log('取得線上資料失敗');
    }

    // 加CSS
    injectCSS(rattrCSS);
    injectCSS(buttonAniCSS);
    injectCSS(inputCSS);
	loadmod();
}

//modcode
function message(msg) {

    let block = `
        <div id="us_messageBlock" data-id="${1999}">
            <div style="position: fixed; top: 2rem; right: 2rem; background-color: #cdfaef; border-radius: 0.5rem; font-size: 1.2rem;">
                <span>${msg}</span>
            </div>
        </div>
    `;

    document.querySelector("div#us_customSpace").innerHTML += block;
}

function loadmod() {
    waitForKeyElements('source', (pic) => {
        if (helperConfig.lisbethMod) {
            if (pic.srcset.match('lisbeth.s')) {
                pic.srcset = "https://i.imgur.com/smXhcqF.gif";
            }
            if (pic.srcset.match('lisbeth')) {
                pic.srcset = "https://i.imgur.com/smXhcqF.gif";
            }
        }
        if (helperConfig.yuukiMod) {
            if (pic.srcset.match('yuuki.s')) {
                pic.srcset = 有紀縮圖;
            }
            if (pic.srcset.match('yuuki')) {
                pic.srcset = 有紀全身圖;
            }
        }
        if (helperConfig.deadMod) {
            if (/此玩家目前是死亡狀態/i.test (document.body.innerHTML) )
            {
                if (pic.srcset.match('')) {
                    pic.srcset = 死亡圖片;
                }
            }
        }
    }, false, helperConfig.delay);
}

function myKirito(url, response) {
    let act = url.pathname.split('/');
    let gained;
    if (act[2] === 'my-kirito') {
        switch (act[3]) {
            case undefined: // 自己的資料
                cleanObjs();
                updateExpReq();
                updateTeam();
                addTooltip();
                addTimetip();
                addChartBtn();
                lovemenu();
                actionlog();
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

    // 更新經驗需求
    async function updateExpReq() {
        await sleep(helperConfig.delay);
        let expReq = document.getElementById('exp_require');
        let prReq = document.getElementById("pr_require");
        let botlv = document.getElementById("botlvs");
        if (!isExist(expReq)) {
            let table = document.querySelector('div#root table > tbody');
            let tr = table.lastChild.cloneNode(true);
            tr.childNodes[0].innerHTML = "保護狀態";
            tr.childNodes[1].id = "pr_require";
            tr.childNodes[2].innerHTML = "距離升級";
            tr.childNodes[3].id = "exp_require";
            let tr2 = table.lastChild.cloneNode(true);
            tr2.childNodes[0].innerHTML = "玻璃值";
            tr2.childNodes[1].innerHTML = myK.murder;
            tr2.childNodes[2].innerHTML = "BOTLV";
            tr2.childNodes[3].id = "botlvs";
            table.appendChild(tr2);
            table.appendChild(tr);
            expReq = document.getElementById("exp_require");
            prReq = document.getElementById("pr_require");
            botlv = document.getElementById("botlvs");
        }
        expReq.innerHTML = expTable[response.lv] - response.exp;
        if (response.lv !== expTable[0]) {
            expReq.textContent = expTable[response.lv] - response.exp;
        }
        else {
            expReq.textContent = '滿級';
        }
        //PR
        var prnumber = [myK.murder*5+1] - myK.defDeath;
        if (prnumber<=0)
        {var prText = "快樂的一天 死了進保護"}
        else
        {prText = "你還需要死" + prnumber + "次"}
        prReq.innerHTML = prText;
        //botlv
        var botlvss = myK.botlv
        if (myK.botlv == undefined){botlvss = "沒有BOTLV"}
        botlv.innerHTML = botlvss;
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
        if (!isExist(teammateName)) {Q
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

    async function showcount() {
        await sleep(helperConfig.delay);
        let actioncount = document.querySelector('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(4)');
        let a = document.createElement('div');
        a.className = 'sc-fzplWN hRBsWH';
        a.id = 'count';
        actioncount.appendChild(a);
        count = document.getElementById('count');
        let result22 = '<p><span>兔肉:'+'</span></p>'+'<p><span>自主:'+'</span></p>'+'<p><span>野餐:'+'</span></p>'+
                      '<p><span>汁妹:'+'</span></p>'+'<p><span>善事:'+'</span></p>'+
                      '<p><span>坐下:'+'</span></p>'+'<p><span>釣魚:'+'</span></p>';
        count.innerHTML = result22;
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
        }
        else {
            chartContainer.style.display = 'block';
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
                pleasedontkillme();
                if(開啟通緝按鈕){
                    reportbutton();
                }
                showRattr();
                addTooltip();
                addChartBtn();
            }
            break;
        case 'my-kirito':
            myK = response;
            if (isExist(otherK) && isExist(myK)) {
                cleanObjs();
                pleasedontkillme();
                if(開啟通緝按鈕){
                    reportbutton();
                }
                showRattr();
                addTooltip();
                addChartBtn();
            }
            break;
        case 'challenge':
            updateMyK();
            break;
    }
    async function pleasedontkillme(){
        await sleep(helperConfig.delay);
        const h3cl = "sc-fznyAO CWQMf";
        const boxou = "sc-fzplWN hRBsWH";
        const tobox = "sc-fzplWN hRBsWH";
        var to;
        var textto;
        function please()
        {
            to = document.createElement('div');
            textto = document.createElement('p');
            document.getElementsByClassName(boxou)[0].insertBefore(to,document.getElementsByClassName(boxou)[0].childNodes[2])
            to.appendChild(textto);
            to.classList = tobox;
            textto.innerHTML = "<span style='color:red'>看在你有安裝這個MOD的份上放我一條生路拜託</span>";
        }
        if (otherK._id == "5edcb1acff4f982ba007f0ba") {
        setTimeout(()=>{please()}, helperConfig.delay);
        }
    }
    async function reportbutton() {
    await sleep(helperConfig.delay);
        let reportbu = document.getElementById("reportobj");
        if (!isExist(reportbu)) {
            let rr = document.createElement("rr");
            rr.id = "reportobj";
            let navbar = document.querySelector("div#root > nav");
            rr.className = "sc-fznAgC dSEOxJ";
            rr.innerText = "通緝發送";
            navbar.insertBefore(rr, navbar.lastChild);
            rr.addEventListener("click", function() {
                document.querySelector("div#root").insertAdjacentHTML("afterend", `<div id="us_customSpace"></div>`);
                let msg = `<h5>通緝發送</h5>`;
                message(msg);
                setTimeout(function() {
                    document.querySelector(`div#us_messageBlock[data-id="${1999}"]`).remove();
                }, 2000);
                if(開啟通緝主頻道){
            fetch(主頻道webhook, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                },
                "body": JSON.stringify(bodydata),
                "method": "POST"
            })
                }
                if(開啟通緝副頻道){
            fetch(副頻道webhook, {
                "headers": {
                    "content-type": "application/json;charset=UTF-8",
                },
                "body": JSON.stringify(bodydata),
                "method": "POST"
            })
                }
    })
        }
        reportbu = document.getElementById("reportobj");
        var bodydata ={
        	"username": 發送名稱,
        	"avatar_url": 通緝頭貼,
        	"embeds": [{
                "description": myK.nickname + "對" + otherK.nickname + "發起了通緝" + "\n" + "[通緝目標連結]" + "(https://mykirito.com/profile/"+otherK._id+")" + "\n" + "目標狀態:" + otherK.status,
                "author": {name: "通緝令發起人: " + myK.nickname, url: "https://mykirito.com/profile/"+myK._id},
                "fields": [
                    {name: "職業:", value: otherK.character, inline: true},
                    {name: "稱號:", value: otherK.title, inline: true},
                    {name: "目標顏色:", value: otherK.color, inline: true},
                    {name: "血量:", value: otherK.hp+"(+"+otherK.rattrs.hp+")", inline: true},
                    {name: "攻擊:", value: otherK.atk+"(+"+otherK.rattrs.atk+")", inline: true},
                    {name: "防禦:", value: otherK.def+"(+"+otherK.rattrs.def+")", inline: true},
                    {name: "體力:", value: otherK.stm+"(+"+otherK.rattrs.stm+")", inline: true},
                    {name: "敏捷:", value: otherK.agi+"(+"+otherK.rattrs.agi+")", inline: true},
                    {name: "反應速度:", value: otherK.spd+"(+"+otherK.rattrs.spd+")", inline: true},
                    {name: "技巧:", value: otherK.tec+"(+"+otherK.rattrs.tec+")", inline: true},
                    {name: "智力:", value: otherK.int+"(+"+otherK.rattrs.int+")", inline: true},
                    {name: "幸運:", value: otherK.lck+"(+"+otherK.rattrs.lck+")", inline: true},
                ],
        		 "color": 通緝顏色
        	}]
        }
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
				let prother = document.getElementById("pr_other");
                let botlv = document.getElementById("botlv_other");

                // 一些有的沒的
                if (!isExist(document.getElementById('addi_info'))) {
                    let tr = table.lastChild.cloneNode(true);
                    tr.id = 'addi_info';
                    tr.childNodes[0].innerHTML = "目前層數";
                    tr.childNodes[1].innerHTML = otherK.floor;
                    tr.childNodes[2].innerHTML = "成就點數";
                    tr.childNodes[3].innerHTML = otherK.achievementPoints;
                    let tr2 = table.lastChild.cloneNode(true);
                    tr2.id = 'addi_info2';
                    tr2.childNodes[0].innerHTML = "玻璃值";
                    tr2.childNodes[1].innerHTML = otherK.murder;
                    tr2.childNodes[2].innerHTML = "BOTLV";
                    tr2.childNodes[3].id = "botlv_other";
                    let tr3 = table.lastChild.cloneNode(true);
                    tr3.id = 'addi_info3';
                    tr3.childNodes[0].innerHTML = "保護狀態";
                    tr3.childNodes[1].id = "pr_other";
                    tr3.removeChild(tr3.lastChild);
                    tr3.removeChild(tr3.lastChild);
                    table.appendChild(tr);
                    table.appendChild(tr2);
                    table.appendChild(tr3);
                    prother = document.getElementById("pr_other");
                    botlv = document.getElementById("botlv_other");
                    var prnumber = [otherK.murder*5+1] - otherK.defDeath;
                    if (prnumber<=0)
                    {var prText = "他準備要進保護了 or 已經進入保護狀態"}
                    else
                    {prText = "這個人還可以扁" + prnumber + "次"}
                    prother.innerHTML = prText;
                    var bototlv = otherK.botlv
                    if (otherK.botlv == undefined){bototlv = "沒有BOTLV"}
                    botlv.innerHTML = bototlv;
                }

//                let karma = document.getElementById('murder_count');
//                if (!isExist(karma)) {
//                    let table = document.querySelector('div#root table > tbody');
//                    let kill = table.childNodes[6].childNodes[3];
//                    let k = document.createElement('span');
//                    k.id = 'murder_count';
//                    k.style.color = 'red';
//                    kill.appendChild(k);
//                    karma = document.getElementById('murder_count');
//                }
//                if (otherK.murder > 0) {
//                    karma.textContent = ` (${otherK.murder})`;
//                }

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
        }
        else {
            chartContainer.style.display = 'block';
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



//pic trans
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

}
// bgMOD
if (helperConfig.backgroundMOD) {
    var css = "";
    var url = document.location.href;
    if (url.indexOf("https://mykirito.com") === 0) {
        css += "body{background-image:bac_img_color,url(bac_img_url)!important;background-attachment:fixed!important;background-position:center center!important;background-repeat:no-repeat!important;background-size:cover!important;background-color:rgba(45,45,45,1)!important;overflow-y:scroll}#root{color:#fff}:root{--th-bg-color:#f0f0f000!important;--th-bg-color-alt1:#f0f0f000!important;--primary-bg-color:#f0f0f000!important;--border-color:#dddddd54!important;--btn-bg-color-disabled:#e0e0e059!important;--input-bg-color:#e0e0e059!important;--btn-bg-color:#e0e0e059}.fYZyZu {color:#FFF}:root{--color:#FFF!important;--link-color:#7ea5ec!important;--report-color:#bbb!important;--report-special-color:#8198c1}.dSEOxJ.active{color:white!important;background:#00000000}";
        css += 擴充CSS;
        if (背景圖片網址 == GM_getValue("bac_img_url")) {
            背景圖片網址 = GM_getValue("bac_base64");
        } else {
            if (背景圖片網址.substr(0, 4).toLowerCase() == "http") {
                toDataURL(背景圖片網址, function (dataUrl) {
                    GM_setValue("bac_base64", dataUrl);
                    GM_setValue("bac_img_url", 背景圖片網址);
                    });
            }
        }
    }
    css += "";
    css = css.replace(/bac_img_color/g, 背景圖片上面的漸層顏色);
    css = css.replace(/bac_img_url/g, 背景圖片網址);
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("html");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            document.documentElement.appendChild(node);
        }
    }
}
// SCROLLLIST
if (helperConfig.scrolllistMOD) {
    setInterval(function () {
        url = location.href;

        if (url.includes("user-list")) {
            // 在玩家列表頁
            if (document.querySelectorAll("div#root > div > div:nth-child(1) > table").length != 0) {
                // 尚未移動 list
                let listTable = document.querySelector("div#root > div > div:nth-child(1) > table");

                listTable.insertAdjacentHTML("beforebegin", `<div id="us_newButtonSpace"></div><div id="us_newListSpace"></div>`);

                let newListSpace = document.querySelector("div#us_newListSpace");

                newListSpace.appendChild(listTable);
                newListSpace.style.maxHeight = "55vh";
                newListSpace.style.overflowY = "scroll";
            }
        }
    }, 100)
}
//篩選MOD (Sylive 波卡製作)
var playerTable;
var allPlayer;
var playerTemp;

let wanted = false;
async function playerFilter(){
    let 篩選1 = GM_config.get('wantedpl');
    let 篩選2 = GM_config.get('wantedpl2');
    let 篩選3 = GM_config.get('wantedpl3');
    let 篩選4 = GM_config.get('wantedpl4');
    let 篩選5 = GM_config.get('wantedpl5');
    let 篩選6 = GM_config.get('wantedpl6');
    if(helperConfig.wanted){
       playerTable = document.querySelector('tbody');
       allPlayer = playerTable.children;
        for(let i = 1 ; i < allPlayer.length ; i++){
            playerTemp = allPlayer[i].children[2].querySelectorAll('div');
            for(let o = 0 ; o < [篩選1,篩選2,篩選3,篩選4,篩選5,篩選6].length ; o++){
                if(playerTemp[3].textContent.indexOf([篩選1,篩選2,篩選3,篩選4,篩選5,篩選6][o]) >= 0){
                    wanted = true;
                }
            };
            if(!wanted){
                allPlayer[i].style.display = 'none';
            }
            wanted = false;
        };
    };
};

//金光閃閃莉茲貝特
let Goldenlisbeth = ["莉茲貝特"];
var playerTemp2;

async function playerFilter_Golden(){
    if(helperConfig.lisbethMod){
       playerTable = document.querySelector('tbody');
       allPlayer = playerTable.children;
            for(let i = 1 ; i < allPlayer.length ; i++){
                playerTemp = allPlayer[i].children[2].querySelectorAll('div');
                for(let o = 0 ; o < Goldenlisbeth.length ; o++){
                    if(playerTemp[3].textContent.indexOf(Goldenlisbeth[o]) >= 0){
                        playerTemp2 = allPlayer[i];
                        //背景 整個
                        allPlayer[i].style = "background:radial-gradient(at center center, rgb(105, 83, 5) 30%, rgb(53, 35, 0) 100%);cursor:pointer;text-shadow: rgba(255, 255, 255, 0.2) -1px -1px 1px";
                        //頭像
                        allPlayer[i].children[0].style = "border-left: 1px solid rgb(175, 132, 42);border-top: 1px solid rgb(175, 132, 42);color: rgb(255, 193, 65); border-color: rgb(175, 132, 42);border-bottom: 1px solid rgb(175, 132, 42)"
                        //等級
                        allPlayer[i].children[1].style = "border-color:rgb(175, 132, 42);color:rgb(255, 193, 65);border-top: 1px solid rgb(175, 132, 42);border-bottom: 1px solid rgb(175, 132, 42)"
                        //層數
                        allPlayer[i].children[3].style = "border-color:rgb(175, 132, 42);color:rgb(255, 193, 65);border-right: 1px solid rgb(175, 132, 42);border-top: 1px solid rgb(175, 132, 42);border-bottom: 1px solid rgb(175, 132, 42)"
                        //中心框
                        allPlayer[i].children[2].style = "color:rgb(255, 193, 65);border-color:rgb(175, 132, 42);border-top: 1px solid rgb(175, 132, 42);border-right: 1px solid rgb(175, 132, 42);border-bottom: 1px solid rgb(175, 132, 42)"
                        //名稱
                        allPlayer[i].children[2].children[0].children[0].children[0].style = "color:rgb(255, 193, 65);border-color:rgb(175, 132, 42)"
                        //角色(稱號)
                        allPlayer[i].children[2].children[0].children[0].children[1].style = "color:rgb(255, 193, 65);border-color:rgb(175, 132, 42)"
                        //狀態攔
                        allPlayer[i].children[2].children[0].children[1].style = "color:rgb(255, 193, 65);border-color:rgb(175, 132, 42)"
            };
        };
        };
    };
};
//this modules by domi☆#5068
async function NOTIMY(){
    if(helperConfig.NotificationMOD){
            var tt = document.getElementsByClassName("hRBsWH"); //判斷有無樓層獎勵
            var actionbuttom = document.querySelectorAll('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(4) > button.llLWDd');
            if(tt == '4') actionbuttom = document.querySelectorAll('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(3) > button.llLWDd');
            for (let i = 0; i < actionbuttom.length; i++) {
            actionbuttom[i].addEventListener("click", function clicked() {
                setTimeout(()=>{GM_notification ( {title: '通知！', text: '快要可以行動了', timeout: 5000} );}, 64000);
                actionbuttom[i].removeEventListener("click", clicked, false);
             }, false);
            }
    }
};
//this modules by domi☆#5068
async function NOTIOT(){
    if(helperConfig.NotificationMOD){
            var battlebuttom = document.querySelectorAll('#root > div > div:nth-child(1) > div:nth-child(2) > div > div > button');
            for (let i = 0; i < battlebuttom.length -1; i++) {
            battlebuttom[i].addEventListener("click", function clicked() {
                setTimeout(()=>{GM_notification ( {title: '通知！', text: '快要可以切磋了', timeout: 5000} );}, 170000);
                battlebuttom[i].removeEventListener("click", clicked, false);
             }, false);
            }
            battlebuttom[3].addEventListener("click", function clicked() {
                setTimeout(()=>{GM_notification ( {title: '通知！', text: '兄弟們準備開襙', timeout: 5000} );}, 170000);
                battlebuttom[3].removeEventListener("click", clicked, false);
             }, false);
    }
};

async function actionlog(){//行車紀錄器 by domi
    await sleep(helperConfig.delay);
    let navbar = document.querySelector("div#root > nav");
    var result22 = '';
    var tt = document.getElementsByClassName("hRBsWH"); //判斷有無樓層獎勵
    var pname = myK.nickname;
    var actionbuttom = document.querySelectorAll('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(4) > button.llLWDd');
    if(tt == '4') actionbuttom = document.querySelectorAll('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(3) > button.llLWDd');
    for (let i = 0; i < actionbuttom.length; i++) {
    actionbuttom[i].addEventListener("click", function clicked() {
        $.post( 'https://domidomi.tk/bot/discord/actionlog.php?a=actionlog&b='+pname+'&c='+ i );
        reloadalog();
             }, false);
            }
    $.ajax({ url: 'https://spreadsheets.google.com/feeds/list/1Vj2i0u_FsabThdhxaOxpqdO5-qRvI6HnslxFu3qUd2w/4/public/values?alt=json', cache: false  })
                 .done(function(msg) {
                 //o.rotate(360,500,'linear',function(){ console.log('add 1!');});
                   var a = msg['feed']['entry'];
                   for(var p in a){//遍歷json物件的每個key/value對,p為key
                       var gname = a[p]['gsx$腳色名稱']['$t'];
                  if(gname === pname) {
                      var ac1 =  a[p]['gsx$兔肉']['$t'];
                      var ac2 =  a[p]['gsx$自主']['$t'];
                      var ac3 =  a[p]['gsx$野餐']['$t'];
                      var ac4 =  a[p]['gsx$汁妹']['$t'];
                      var ac5 =  a[p]['gsx$善事']['$t'];
                      var ac6 =  a[p]['gsx$坐下']['$t'];
                      var ac7 =  a[p]['gsx$釣魚']['$t'];
                      result22 += '<p><span>兔肉:'+ac1+'</span></p>'+'<p><span>自主:'+ac2+'</span></p>'+'<p><span>野餐:'+ac3+'</span></p>'+
                      '<p><span>汁妹:'+ac4+'</span></p>'+'<p><span>善事:'+ac5+'</span></p>'+
                      '<p><span>坐下:'+ac6+'</span></p>'+'<p><span>釣魚:'+ac7+'</span></p>'+'<button id="returnsisdog">清空</button>';
                   }
                   if(result22 == '') { $.post( 'https://domidomi.tk/bot/discord/actionlog.php?a=newadd&b='+pname);}
                 }
                 let actioncount = document.querySelector('#root > div > div.sc-fzokOt.hLgJkJ > div:nth-child(4)');
                 let adiv = document.createElement('div');
                 adiv.className = 'sc-fzplWN hRBsWH';
                 adiv.id = 'count';
                 actioncount.appendChild(adiv);
                 let count = document.getElementById('count');
                 count.innerHTML = result22;
                 let returnsisdog = document.getElementById("returnsisdog");
                 returnsisdog.addEventListener("click", function clicked() {
                 $.post( 'https://domidomi.tk/bot/discord/actionlog.php?a=clear&b='+gname ); //清空行動表
                 alert("記錄已清空，請重新整理");
                 returnsisdog.removeEventListener("click", clicked, false);
                 }, false);
            });

}

async function reloadalog(){ //刷新紀錄，好像不是這樣講的
    await sleep(helperConfig.delay);
    $.ajax({ url: 'https://spreadsheets.google.com/feeds/list/1Vj2i0u_FsabThdhxaOxpqdO5-qRvI6HnslxFu3qUd2w/4/public/values?alt=json', cache: false  })
                 .done(function(msg) {
                 //o.rotate(360,500,'linear',function(){ console.log('add 1!');});
                   var a = msg['feed']['entry'];
                   for(var p in a){//遍歷json物件的每個key/value對,p為key
                       var gname = a[p]['gsx$腳色名稱']['$t'];
                  if(gname === pname) {
                      var ac1 =  a[p]['gsx$兔肉']['$t'];
                      var ac2 =  a[p]['gsx$自主']['$t'];
                      var ac3 =  a[p]['gsx$野餐']['$t'];
                      var ac4 =  a[p]['gsx$汁妹']['$t'];
                      var ac5 =  a[p]['gsx$善事']['$t'];
                      var ac6 =  a[p]['gsx$坐下']['$t'];
                      var ac7 =  a[p]['gsx$釣魚']['$t'];
                      result22 += '<p><span>兔肉:'+ac1+'</span></p>'+'<p><span>自主:'+ac2+'</span></p>'+'<p><span>野餐:'+ac3+'</span></p>'+
                      '<p><span>汁妹:'+ac4+'</span></p>'+'<p><span>善事:'+ac5+'</span></p>'+
                      '<p><span>坐下:'+ac6+'</span></p>'+'<p><span>釣魚:'+ac7+'</span></p>'+'<button id="returnsisdog">清空</button>';
                   }
                 }
                 let count = document.getElementById('count');
                 count.innerHTML = result22;
                 let returnsisdog = document.getElementById("returnsisdog");
                 returnsisdog.addEventListener("click", function clicked() {
                 $.post( 'https://domidomi.tk/bot/discord/actionlog.php?a=clear&b='+gname ); //清空行動表
                 alert("記錄已清空，請重新整理");
                 returnsisdog.removeEventListener("click", clicked, false);
                 }, false);
            });
}




async function lovemenu(){  //我ㄉ最愛 by domi
    await sleep(helperConfig.delay);
    let navbar = document.querySelector("div#root > nav");
    var result22 = '';
    $.ajax({ url: 'https://spreadsheets.google.com/feeds/list/1Vj2i0u_FsabThdhxaOxpqdO5-qRvI6HnslxFu3qUd2w/3/public/values?alt=json', cache: false  })
                 .done(function(msg) {
                   var pname = myK.nickname;
                 //o.rotate(360,500,'linear',function(){ console.log('add 1!');});
                   var a = msg['feed']['entry'];
                   for(var p in a){//遍歷json物件的每個key/value對,p為key
                       var holder = a[p]['gsx$所有人']['$t'];
                  if(holder === pname) {
                      var gurl =  a[p]['gsx$網址']['$t'];
                      var sname =  a[p]['gsx$玩家名稱']['$t'];
                      result22 += '<p><a href="'+gurl+'"  target="_self">'+sname+'</a></p>';

                   }

                 }
                 let button2 = document.createElement("a");
                 button2.className = "sc-fzqAui dSEOxJ";
                 button2.innerText = "我的最愛";
                 button2.id = "bobo";
                 navbar.insertBefore(button2, navbar.lastChild);
                 tippy(button2, {
                     content: `<div style="text-align: center;">最愛清單</div>`+
                     result22,
                     allowHTML: true,
                     interactive: true,
                     arrow: false,
                     trigger: 'mouseenter focus click',
                     placement: 'bottom'
                 });


            });

}



// 好醜
function cleanObjs() {
    let expReq = document.getElementById('exp_require');
    let teamRef = document.getElementById('team_ref');
    let addiInfo = document.getElementById('addi_info');
    let rattrs = document.getElementsByClassName('show_rattr');
    let chartDiv = document.getElementById('myChart_container');
    let chartBtn = document.getElementById('chart_button');
    let bobo = document.getElementById("bobo");
    let carbubu = document.getElementById("carbubu");
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
    if (isExist(bobo)){bobo.remove();};
    if (isExist(carbubu)){carbubu.remove();};
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