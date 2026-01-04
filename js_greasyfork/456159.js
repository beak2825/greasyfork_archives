// ==UserScript==
// @name         观测云 Helper
// @license      AGPLv3
// @namespace    http://guance.com/
// @version      0.4.4
// @description  为观测云 Web 界面提供便捷底部状态栏
// @author       Zhou Yiling
// @match        *://*.guance.com/*
// @match        *://*.cloudcare.cn/*
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALH/FACu/2MAqv+kAKf/0wCh//QAnP//AJX//wCR//QAjP/TAIf/pACC/2MAff8UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALf/MAC1/6gAs//7ALD//wCs//8Apv//AKD//wCc//8Alf//AJL//wCQ//8Ahf//AIH//wB7//sAd/+oAHT/MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL7/DQC9/5gAuf/+ALb//wC1//8Asf//AKz//wCn//8Ao///AJ3//wCY//8Ajf//AI3//wCE//8Afv//AHr//wBz//8AdP/+AGr/mABm/w0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/ysAvv/bALz//wC5//8Auf//ALT//wCz//8Arf//AKj//wCi//8An///AJf//wCN//8Ajf//AIb//wB9//8AeP//AHT//wBq//8AZP//AGX/2wBf/ysAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwf84AMD/8QDA//8AvP//ALz//wC5//8AtP//ALP//wCu//8Aqv//AKT//wCf//wAlv/8AI3//wCI//8Ahf//AHz//wB2//8AcP//AGr//wBi//8AYP//AF7/8QBY/zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMH/KwDB//EAwf//AMD//wC///8Au///ALr//wC2//8As//oAK3/iwCq/0MAov8TAAAAAAAAAAAAj/8TAIL/QwCC/4sAfP/oAHH//wBu//8AZv//AF7//wBc//8AWv//AFj/8QBU/ysAAAAAAAAAAAAAAAAAAAAAAAAAAADB/w0Awf/bAMH//wDB//8AwP//AL///wC+//8AvP/0ALj/cgC2/wcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1/wcAbP9yAGn/9ABe//8AXv//AFj//wBY//8AUv//AE3/2wBN/w0AAAAAAAAAAAAAAAAAAAAAAMH/mADB//8Awf//AMH//wDB//8AwP//AL//2QC8/yUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYP8lAF7/2QBb//8AVv//AFP//wBP//8ASv//AEj/mAAAAAAAAAAAAAAAAADB/zAAwf/+AMH//wDB//8Awf//AMH//wDB/9kAwP8VAAAAAAAAAAAAAAAAAKf/AwCk/zgAmv9sAJb/ggCH/4IAgP9sAHH/OABo/wMAAAAAAAAAAAAAAAAAXf8VAFb/2QBT//8AUP//AEv//wBI//8ARP/+AET/MAAAAAAAAAAAAMH/qADB//8Awf//AMH//wDB//8Awf/0AMH/JQAAAAAAAAAAAAAAAACs/0cAqP/ZAKH//wCf//8Ak///AIT//wCC//8Acf//AGX/2QBh/0cAAAAAAAAAAAAAAAAATv8lAEz/9ABJ//8ARP//AEX//wBF//8AQ/+oAAAAAADB/xQAwf/7AMH//wDB//8Awf//AMH//wDB/3IAAAAAAAAAAAAAAAAAr/9qAK///wCs//8AqP//AJj//wCT//8Ag///AHv//wBv//8AZf//AF3//wBX/2oAAAAAAAAAAAAAAAAARf9yAEb//wBC//8AQf//AD///wA9//sAPP8UAMD/YwDB//8Awf//AMH//wDB//8Awf/oAMH/BwAAAAAAAAAAAK//RwCv//8Ar///AK7//wCo//8AoP//AJX//wCJ//8Ae///AG3//wBi//8AWv//AE///wBG/0cAAAAAAAAAAABC/wcARP/oAD///wA9//8AP///ADz//wA7/2MAv/+kAL///wC///8AwP//AMD//wDB/4sAAAAAAAAAAACv/wQAr//XAK///wCv//8Ar///AKn//wCk//8Amf//AIr//wB4//8Aaf//AFX//wBN//8ARP//AEb/1wA5/wQAAAAAAAAAAAA//4sAPv//ADz//wA8//8AOf//ADj/pAC9/9MAvv//AL///wC///8Avv//AL7/QwAAAAAAAAAAAK//SQCv//8Ar///AK///wCv//8Aqv//AKb/wACT/1YAiP9WAG//wABf//8AUP//AEb//wA8//8AN///ADX/SQAAAAAAAAAAADz/QwA6//8AOP//ADn//wA2//8AN//TALv/9AC7//8Au///ALv//wC7//8Au/8TAAAAAAAAAAAAr/+PAK///wCv//8Ar///AK///wCr/8AApv8DAAAAAAAAAAAAU/8DAFP/wABH//8ARf//ADf//wA1//8AM/+PAAAAAAAAAAAAN/8TADj//wA2//8ANv//ADX//wA1//QAuP//ALj//wC4//8At///ALv//AAAAAAAAAAAAAAAAACv/6wAr///AK///wCv//8Ar///AK3/VgAAAAAAAAAAAAAAAAAAAAAAR/9WAED//wA9//8AN///ADP//wAx/6wAAAAAAAAAAAAAAAAAN//8ADb//wA1//8ANf//ADX//wC3//8AuP//ALj//wC0//8As//8AAAAAAAAAAAAAAAAAK//rACu//8Arf//AKz//wCr//8Aq/9WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALP/9ACx//8As///ALT//wCz//8Arv8TAAAAAAAAAAAArf+PAKz//wCr//8ArP//AKX//wCl/8AAl/8DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr//TAK7//wCt//8ArP//AK3//wCq/0MAAAAAAAAAAACs/0kAqv//AKr//wCp//8ApP//AJv//wCU/8AAhf9WAHn/QABv/0AAa/9AAGP/QABd/0AAUv9AAEv/QABI/0AARP9AAEL/QAA+/0AAO/9AADj/QAA3/0AANf9AADX/QACq/6QAqv//AKr//wCr//8Aqf//AKT/iwAAAAAAAAAAAKv/BACq/9cApv//AJ///wCd//8Alv//AI7//wCG//8Afv//AHT//wBn//8AZP//AFj//wBT//8ATP//AEf//wBE//8APv//ADz//wA6//8AOv//ADj//wA2//8ANf//AKj/YwCq//8Aqf//AKb//wCi//8Anv/oAJ//BwAAAAAAAAAAAKb/RwCh//8Anv//AJr//wCW//8Aj///AIb//wB4//8AbP//AGX//wBi//8AV///AFP//wBP//8AR///AET//wBA//8APP//ADr//wA4//8AN///ADf//wA1//8AqP8UAKb/+wCj//8An///AJz//wCZ//8Alv9yAAAAAAAAAAAAAAAAAKD/agCe//8Al///AJP//wCK//8AhP//AHr//wBw//8AZf//AGD//wBb//8AUP//AE3//wBI//8ARP//AEH//wA8//8APP//ADj//wA3//8ANv//ADX//wAAAAAAn/+oAJz//wCY//8Amv//AJL//wCR//QAj/8lAAAAAAAAAAAAAAAAAJn/RwCT/9kAkP//AIj//wCC//8Adf//AGv//wBl//8AYP//AFb//wBQ//8ATv//AEr//wBC//8AQv//AD3//wA6//8AOP//ADf//wA1//8ANf//AAAAAACd/zAAm//+AJf//wCT//8Aj///AIv//wCL/9kAgf8VAAAAAAAAAAAAAAAAAJX/AwCL/zgAhv9sAHz/ggB1/5EAa/+RAGP/kQBj/5EAV/+RAFH/kQBN/5EASP+RAEP/kQBA/5EAPP+RADv/kQA4/5EAN/+RADX/kQA1/5EAAAAAAAAAAACT/5gAkP//AI///wCN//8AiP//AIT//wB9/9kAef8lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJH/DQCP/9sAjf//AIf//wCF//8Af///AHn//wB2//QAbv9yAGb/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIn/KwCE//EAg///AIH//wB6//8AdP//AHL//wBt//8AZv/oAFz/iwBa/0MAVf8TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIX/OAB+//EAef//AHr//wB0//8Abv//AGn//wBm//8AXv//AFf//wBU//8ATf/8AEn/8ABF//AAP//wAD3/8AA7//AAN//wADb/8AA2//AAAAAAAAAAAAAAAAAANv8bADb/tgA2//AANv/BADb/IwAAAAAAAAAAAAAAAAAAAAAAAAAAAHz/KwB3/9sAcv//AG3//wBv//8AY///AGX//wBe//8AVP//AFL//wBN//8AR///AEX//wBC//8APf//ADv//wA5//8ANv//ADb//wAAAAAAAAAAAAAAAAA2/7UANv//ADb//wA2//8ANv/LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHj/DQBz/5gAbf/+AGn//wBj//8AX///AFj//wBV//8AUf//AE3//wBH//8ARP//AED//wA9//8AO///ADf//wA3//8ANf//AAAAAAAAAAAAAAAAADb/8AA2//8ANv//ADb//wA2//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABs/zAAaf+oAGP/+wBe//8AWP//AFX//wBS//8AS///AEf//wBD//8AQv//AD7//wA5//8AOf//ADf//wA2//8AAAAAAAAAAAAAAAAANv+9ADb//wA2//8ANv//ADb/0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYv8UAF//YwBX/6QAVv/TAE7/9ABK//8ARv//AEL//wBA//8APf//ADn//wA4//8AN///ADb//wAAAAAAAAAAAAAAAAA2/yMANv/HADb//wA2/9EANv8t/8AD//8AAP/8AAA/+AAAH/AAAA/gAYAHwA/wA8A//AOAcA4BgOAHAQHAA4ABgAGAAwAAwAMAAMADAYDABwPA4AcD//8DAf//AwAAAAMAAAABgAAAAcAAAIDgAACAcAAAwD///8AP///gAf//8AAA4PgAAOD8AADg/wAA4P/AAOA=
// @run-at       document-end
// @grant        unsafeWindow
// @grant        window.onurlchange
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      guance.com
// @connect      cloudcare.cn
// @downloadURL https://update.greasyfork.org/scripts/456159/%E8%A7%82%E6%B5%8B%E4%BA%91%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/456159/%E8%A7%82%E6%B5%8B%E4%BA%91%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入元素样式
    const CSS = `
        body {
            padding-bottom: 71px;
        }
        #Helper:hover {
            z-index: 998;
        }
        #Helper {
            position: fixed;
            width: 100%;
            bottom: 0;
            overflow-x: auto;
            overflow-y: hidden;
            display: flex;
            flex-direction: row;
            align-items: center;
        }
        #HelperLogo {
            padding: 0 10px;
            font-size: 18px !important;
            line-height: 1.1;
            font-style: italic;
        }
        #HelperLogo .ivu-icon {
            color: #d80000;
            font-size: 26px;
        }

        .fth-theme-light #Helper {
            border-top: lightgrey solid 2px;
            background-color: #f8f8f8;
        }
        .fth-theme-dark #Helper {
            border-top: #555 solid 2px;
            background: #333;
        }

        #Helper *:not(.ivu-icon) {
            font-size: 12px;
            font-family: "PingFang SC","Microsoft YaHei","微软雅黑","Arial","sans-serif";
        }
        #Helper .helper-table td,
        #Helper .helper-table th {
            max-width: 120px;
        }
        .helper-table {
            border-collapse: collapse;
            margin: 3px;
        }
        .helper-table td,
        .helper-table th {
            padding: 3px 5px;
            text-align: center;
            white-space: nowrap;
        }
        .fth-theme-light .helper-table td,
        .fth-theme-light .helper-table th {
            border: grey 1px solid;
            background: white;
        }
        .fth-theme-dark .helper-table td,
        .fth-theme-dark .helper-table th {
            border: #555 1px solid;
            background: black;
        }

        .fth-theme-light .helper-title-basic {
            background-color: lightpink !important;
        }
        .fth-theme-light .helper-title-workspace {
            background-color: lightblue !important;
        }
        .fth-theme-light .helper-title-db {
            background-color: lightgreen !important;
        }
        .fth-theme-light .helper-title-route {
            background-color: gold !important;
        }
        .fth-theme-light .helper-title-extra {
            background-color: lightsalmon !important;
        }

        .fth-theme-dark .helper-title-basic {
            background-color: #65000f !important;
        }
        .fth-theme-dark .helper-title-workspace {
            background-color: #145368 !important;
        }
        .fth-theme-dark .helper-title-db {
            background-color: #034703 !important;
        }
        .fth-theme-dark .helper-title-route {
            background-color: #ac6000 !important;
        }
        .fth-theme-dark .helper-title-extra {
            background-color: #7a2200 !important;
        }

        .helper-pop {
            position: fixed;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 9999999;
            background: #0005;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .helper-pop-content {
            position: relative;
            border-radius: 10px;
            text-align: center;
            padding: 45px 30px 30px 30px !important;
            font-size: 16px;
            color: grey;
            width: 650px;
            height: 350px;
        }
        .helper-pop-content input:focus-visible {
            outline: none;
        }
        .fth-theme-light .helper-pop-content input {
            color: black;
        }
        .fth-theme-dark .helper-pop-content input {
            color: white;
        }
        .fth-theme-light .helper-pop-content {
            background: white;
            border: 1px solid #0007;
            box-shadow: 5px 5px 3px #888;
        }
        .fth-theme-dark .helper-pop-content {
            background: black;
            border: 1px solid #555;
            box-shadow: 5px 5px 3px #333;
        }

        #HelperCopyPop pre {
            margin-top: 20px;
            font-family: monospace !important;
            height: 200px;
            overflow-y: auto;
            text-align: left;
            white-space: pre !important;
            font-size: 16px;
        }
        .fth-theme-light #HelperCopyPop pre {
            color: black;
        }
        .fth-theme-dark #HelperCopyPop pre {
            color: white;
        }

        #HelperSwitchAccountTip label  {
            border: 1px solid #FF6600;
            border-radius: 3px;
            color: white;
            font-weight: bold;
            padding: 0 3px;
            margin: 0 3px;
        }
        .fth-theme-light #HelperSwitchAccountTip label {
            background-color: #ff791f;
        }
        .fth-theme-dark #HelperSwitchAccountTip label{
            background-color: #C64F00;
        }
        #HelperSwitchAccountPop table {
            width: 100%;
            height: 200px;
            margin-bottom: 20px;
        }
        #HelperSwitchAccountPop table th {
            width: 150px;
            max-width: 150px;
        }
        #HelperSwitchAccountPop table select,
        #HelperSwitchAccountPop table input {
            width: 100%;
            height: 100%;
            padding: 0 5px;
            border: none;
        }
        #HelperSwitchAccountPop button.helper-button {
            width: 80px;
            font-size: 16px !important;
            line-height: 1.6;
        }
        .fth-theme-dark #HelperSwitchAccountPop table select {
            background: black;
            color: white;
        }

        th.helper-column {
            font-weight: bold;
            color: #FF6600;
        }
        td.helper-column {
            white-space: nowrap;
        }

        .helper-link {
            font-weight: bold;
            color: #FF6600 !important;
            border-bottom: 1px dashed #0000;
        }
        .helper-link .ivu-icon {
            font-size: 16px;
            font-weight: bold;
        }
        .helper-link:hover {
            border-bottom: 1px dashed #FF6600;
        }

        .helper-close-button {
            position: absolute;
            right: 15px;
            top: 10px;
            cursor: pointer;
            background: none;
            border: none;
            color: #777;
        }
        .helper-button {
            font-size: 12px !important;
            padding: 0px 5px !important;
            border-radius: 15px;
            border: 1px solid grey;
            cursor: pointer;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden !important;
            width: 100%;
        }
        .fth-theme-light .helper-button {
        }
        .fth-theme-dark .helper-button {
            background-color: #333;
            color: white;
        }

        .helper-button:not(.helper-button-current):hover {
            border-color: #FF6600;
            color: #FF6600;
        }
        .fth-theme-light .helper-button:hover {
            background-color: white;
        }
        .fth-theme-dark .helper-button:hover {
            background-color: black;
        }

        .helper-button-current {
            border-color: #FF6600;
            color: white;
        }
        .fth-theme-light .helper-button-current {
            background-color: #FF781E !important;
        }
        .fth-theme-dark .helper-button-current {
            background-color: #C64F00 !important;
        }

        .monospace {
            font-family: "Roboto Mono";
        }
        .text-mute {
            color: grey;
        }
        .uppercase {
            text-transform: uppercase;
        }
    `;

    // 业务实体前缀至名称翻译
    const ENTITY_ID_PREFIX_MAP = {
        dsbd : '仪表板',
        rul  : '监控器',
        pl   : 'Pipeline',
        appid: '应用',
    }

    // DEBUG 状态栏展示顺序
    const DEBUG_ITEM_SHOW_ORDER = [
        'basic',

        'blackListCount',
        'monitorMuteCount',
        'shareConfigCount',

        'monitorRule',
    ]

    var APP = null;

    let CURRENT_URL      = null;
    let API_AUTH_HEADER  = {};
    let COOKIES          = {};
    let COOKIE_TOKEN_KEY = 'fth-loginTokenName'
    let COOKIE_DOMAIN    = unsafeWindow.location.host;
    if (unsafeWindow.DEPLOYCONFIG && unsafeWindow.DEPLOYCONFIG.cookieDomain) {
        COOKIE_DOMAIN = unsafeWindow.DEPLOYCONFIG.cookieDomain;
    }

    let RENDER_DATA = [];
    let ACCOUNT_CACHE = {};

    let MULTI_ACCOUNT_LIMIT  = 10;
    let MULTI_ACCOUNT_KEY    = 'multiAccount';
    let ACCOUNT_TO_LOGIN_KEY = 'accountToLogin';
    let LAST_WORKSPACE_KEY   = 'lastWorkspace';

    const AUTH_PATH = '/login/pwd';
    const GUANCE_NODES = [
        {
            authURL   : 'https://auth.guance.com',
            consoleURL: 'https://console.guance.com',
            name      : '中国区1（杭州）',
        },
        {
            authURL   : 'https://aws-auth.guance.com',
            consoleURL: 'https://aws-console.guance.com',
            name      : '中国区2（宁夏）',
        },
        {
            authURL   : 'https://cn3-auth.guance.com',
            consoleURL: 'https://cn3-console.guance.com',
            name      : '中国区3（张家口）',
        },
        {
            authURL   : 'https://cn4-auth.guance.com',
            consoleURL: 'https://cn4-console.guance.com',
            name      : '中国区4（广州）',
        },
        {
            authURL   : 'https://us1-auth.guance.com',
            consoleURL: 'https://us1-console.guance.com',
            name      : '海外区1（俄勒冈）',
        },

        {
            authURL   : 'http://testing-ft2x-auth.cloudcare.cn',
            consoleURL: 'http://testing-ft2x-saas.cloudcare.cn',
            name      : '测试环境',
            isInternal: true,
        },
    ];
    const GUANCE_AUTH_URL_MAP = GUANCE_NODES.reduce((acc, x) => {
        acc[x.authURL] = x;
        return acc;
    }, {});

    // 初始化
    function init() {
        let $home = document.querySelector('.fth-home');
        if (!$home || !$home.__vue__) return;

        unsafeWindow.__APP = APP = $home.__vue__;
        CURRENT_URL = location.href;
        COOKIES = document.cookie.split(';').reduce((acc, x) => {
            if (!x) return acc;

            let parts = x.split('=');
            acc[parts[0].trim()] = parts[1].trim();
            return acc;
        }, {});
    }

    // 清理旧数据
    function clearOldData() {
        // 清理不使用的 Key
        let allKeys = [
            MULTI_ACCOUNT_KEY,
            ACCOUNT_TO_LOGIN_KEY,
            LAST_WORKSPACE_KEY,
        ]
        GM_listValues().forEach(k => {
            if (allKeys.indexOf(k) < 0) GM_deleteValue(k);
        })

        // 清理旧版最后工作空间信息
        let lastWorkspaceMap = GM_getValue(LAST_WORKSPACE_KEY);
        for (let k in lastWorkspaceMap) {
            if (k.indexOf('acnt_') !== 0) delete lastWorkspaceMap[k];
        }
        GM_setValue(LAST_WORKSPACE_KEY, lastWorkspaceMap);
    }

    // 添加监听器
    function addListeners() {
        // 打开复制文本弹窗
        $(document).on('mouseup', 'button.helper-button', function(ev) {
            if (this.hasAttribute('helper-copy')) {
                let value = decodeURI(this.getAttribute('helper-copy') || this.innerText || '').trim();
                GM_setClipboard(value);

                document.getElementById('HelperCopyPop').style.visibility = null;
                document.querySelector('#HelperCopyPop pre').innerText = value;
            }

            document.querySelectorAll('button.helper-button').forEach(_elem => {
                _elem.classList.remove('helper-button-current');
            })
            this.classList.add('helper-button-current');
        });

        // 关闭复制文本弹窗
        $(document).on('mouseup', '#HelperCopyPop', function(ev) {
            if (ev.target.id !== 'HelperCopyPop') return;
            this.style.visibility = 'hidden';
        });

        // 打开切换账号弹窗
        $(document).on('mouseup', '#ShowSwitchAccount', function(ev) {
            document.getElementById('HelperSwitchAccountPop').style.visibility = null;
        });

        // 关闭切换账号弹窗
        $(document).on('mouseup', '#HelperSwitchAccountPop', function(ev) {
            if (ev.target.id !== 'HelperSwitchAccountPop') return;
            this.style.visibility = 'hidden';
        });
        $(document).on('mouseup', '#HelperSwitchAccountPop button[cancel]', function(ev) {
            document.getElementById('HelperSwitchAccountPop').style.visibility = 'hidden';
        });

        // 选择账号
        $(document).on('change', '#HelperSwitchAccountPop #SwitchAccount', function(ev) {
            loadLoginInfo(decodeURI(this.value));
        });

        // 选择节点
        $(document).on('change', '#HelperSwitchAccountPop #SelectGuanceNode', function(ev) {
            let authURL = this.value === 'PRIVATE' ? '' : this.value;
            document.querySelector('#HelperSwitchAccountPop input[auth-url]').value = authURL;
        });

        // 登录账号
        $(document).on('mouseup', '#HelperSwitchAccountPop button[login]', function(ev) {
            doSwitchAccount('login');
        });

        // 删除账号
        $(document).on('mouseup', '#HelperSwitchAccountPop button[delete]', function(ev) {
            doSwitchAccount('delete');
        });

        // 清空账号
        $(document).on('mouseup', '#HelperSwitchAccountPop button[clear]', function(ev) {
            doSwitchAccount('clear');
        });
    }

    // 等待页面元素就绪
    function wait(isReadyFunc, runFunc) {
        const maxWait = 3 * 60 * 1000;
        const waitStart = Date.now();
        let T = setInterval(() => {
            if (isReadyFunc()) {
                runFunc();
                return clearInterval(T);
            }

            if (Date.now() - waitStart > maxWait) {
                return clearInterval(T);
            }
        }, 500);
    }

    // 填写 input
    function fillInput(selector, value) {
        document.querySelector(selector).focus();
        document.querySelector(selector).value = value;
        document.querySelector(selector).blur();
    }

    // 获取节点信息
    function getNodeInfo() {
        for (let i = 0; i < GUANCE_NODES.length; i++) {
            if (location.host === new URL(GUANCE_NODES[i].consoleURL).host) {
                return GUANCE_NODES[i].name;
            }
        }

        let saasDomain = '.guance.com';
        if (location.host.slice(-1 * saasDomain.length) === saasDomain) {
            return `SaaS - ${location.host}`;
        } else {
            return `私有部署 - ${location.host}`;
        }
    }

    // 获取 API 路径
    function getAPIURL(pathname) {
        if (!unsafeWindow.DEPLOYCONFIG) return null;
        let url = new URL(unsafeWindow.DEPLOYCONFIG.apiUrl).origin + pathname;
        return url
    }

    // 获取内置 DataFlux Func 页面路径路径
    function getInnerDataFluxFuncPageURL(path) {
        let currentURLObj = new URL(location.href);
        let topDomain = currentURLObj.hostname.split('.').slice(-2).join('.');
        let funcHostname = topDomain === 'cloudcare.cn'
                         ? 'testing-ft2x-func2.cloudcare.cn'
                         : currentURLObj.hostname.replace('console', 'func2');
        let funcURL = `${currentURLObj.protocol}//${funcHostname}${path}`;

        return funcURL
    }

    // 从 URL 中提取 ID
    function getIdFromURL(prefix) {
        let re = new RegExp(`${prefix}_[a-z0-9]{32}`, 'g')
        let m = CURRENT_URL.match(re);
        return m ? m[0] : null;
    }

    // 调用函数并忽略错误
    function noThrowWrapper(f, args) {
        return function() {
            try {
                return f.apply(null, args)
            } catch(err) {
                console.error(err);
                return null
            }
        }
    }

    // 加载登录信息
    function loadLoginInfo(key) {
        let loginInfo = GM_getValue(MULTI_ACCOUNT_KEY)[key] || {};
        document.querySelector(`#HelperSwitchAccountPop input[auth-url]`).value = loginInfo.authURL  || '';
        document.querySelector(`#HelperSwitchAccountPop input[username]`).value = loginInfo.username || '';
        document.querySelector(`#HelperSwitchAccountPop input[password]`).value = loginInfo.password || '';

        document.querySelectorAll(`#HelperSwitchAccountPop #SelectGuanceNode option`).forEach(opt => {
            opt.selected = opt.value === loginInfo.authURL;
        });
    }

    // 执行登录
    function doSwitchAccount(opt) {
        let authURL  = document.querySelector(`#HelperSwitchAccountPop input[auth-url]`).value;
        let username = document.querySelector(`#HelperSwitchAccountPop input[username]`).value;
        let password = document.querySelector(`#HelperSwitchAccountPop input[password]`).value;

        // 清洗路径
        authURL = new URL(authURL).origin;

        let key = JSON.stringify({ authURL, username });
        let multiAccountMap = GM_getValue(MULTI_ACCOUNT_KEY) || {};

        switch(opt) {
            case 'login':
                let nextLoginInfo = { authURL, username, password };

                // 保存 / 更新当前登录账号
                let loginInfo = multiAccountMap[key] || { key };
                loginInfo = Object.assign(loginInfo, nextLoginInfo); // 合并
                multiAccountMap[key] = loginInfo;
                GM_setValue(MULTI_ACCOUNT_KEY, multiAccountMap);

                // 获取上次访问的工作空间
                let lastWorkspaceMap = GM_getValue(LAST_WORKSPACE_KEY) || {};
                let lastWorkspaceUUID = null;
                if (loginInfo.accountUUID) {
                    lastWorkspaceUUID = lastWorkspaceMap[loginInfo.accountUUID];
                }

                // 生成登录页面地址
                let loginURL = `${authURL}${AUTH_PATH}`;
                if (lastWorkspaceUUID) {
                    loginURL += `?workspaceid=${lastWorkspaceUUID}`;
                    unsafeWindow.$cookies.set('fth-lastWorkspaceUUid', lastWorkspaceUUID, '7d', undefined, unsafeWindow.DEPLOYCONFIG.cookieDomain, false, 'Lax');
                }

                // 写入待登录账号
                GM_setValue(ACCOUNT_TO_LOGIN_KEY, nextLoginInfo);

                // 退出并重新登录
                APP.$store.dispatch('logout').then(() => {
                    // 登出后处理
                    unsafeWindow.$cookies.remove(COOKIE_TOKEN_KEY, undefined, COOKIE_DOMAIN);
                    unsafeWindow.localStorage.removeItem('popularize_billing_banner');
                    unsafeWindow.localStorage.removeItem('popularize_insight_banner');

                    // 跳转
                    location.href = loginURL;    
                })
                
                break;

            case 'delete':
                delete multiAccountMap[key];
                GM_setValue(MULTI_ACCOUNT_KEY, multiAccountMap);
                updateDebugPanel();
                break;

            case 'clear':
                GM_deleteValue(MULTI_ACCOUNT_KEY);
                updateDebugPanel();
                break;
        }
    }

    // 更新 DEBUG 状态栏
    function updateDebugPanel() {
        let _prev = document.getElementById('HelperContainer');
        if (_prev) _prev.remove();

        let thHTML = '';
        let tdHTML = '';
        RENDER_DATA.sort((a, b) => {
            let orderA = DEBUG_ITEM_SHOW_ORDER.indexOf(a.key);
            if (orderA < 0) orderA = Number.MAX_SAFE_INTEGER;
            let orderB = DEBUG_ITEM_SHOW_ORDER.indexOf(b.key);
            if (orderB < 0) orderB = Number.MAX_SAFE_INTEGER;

            if (orderA < orderB) return -1;
            else if (orderA > orderB) return 1;
            else {
                if (a.key < b.key) return -1;
                else if (a.key > b.key) return 1;
                else return 0;
            }
        });

        let renderedGroupMap = {};
        RENDER_DATA.forEach(group => {
            if (renderedGroupMap[group.key]) return;

            renderedGroupMap[group.key] = true;
            group.data.forEach(d => {
                thHTML += `<th class="${d.class || ''}">${d.title}</th>`;
                tdHTML += `<td>`;
                if (d.copy) {
                    tdHTML += `<button type="button" class="helper-button" helper-copy>${d.value}</button>`;
                } else if (d.href) {
                    tdHTML += `<a href="${d.href}" class="helper-link"><i class="ivu-icon ivu-icon-md-open"></i> ${d.value}</a>`;
                } else {
                    tdHTML += `<span>${d.value}</span>`;
                }
                tdHTML += `</td>`;
            })
        });

        let $main = document.createElement('div');
        $main.id = 'HelperContainer';

        // 切换账号
        let switchAccountOptionsHTML = '';
        let storedAccounts = GM_getValue(MULTI_ACCOUNT_KEY) || {};
        Object.values(storedAccounts).forEach(a => {
            let guanceNode = GUANCE_AUTH_URL_MAP[a.authURL];
            let guanceNodeName = guanceNode ? guanceNode.name : a.authURL;
            switchAccountOptionsHTML += `<option value="${encodeURI(a.key)}">${guanceNodeName} - ${a.username}</option>`;
        })

        // 选择节点
        let selectGuanceNodeHTML = '';
        GUANCE_NODES.forEach(n => {
            selectGuanceNodeHTML += `<option value="${n.authURL}">${n.name}</option>`;
        })

        $main.innerHTML = `
            <style>
                ${CSS}
            </style>

            <div id="HelperCopyPop" class="helper-pop" style="visibility: hidden">
                <div class="helper-pop-content">
                    以下内容已复制到剪贴板
                    <pre></pre>
                </div>
            </div>

            <div id="HelperSwitchAccountPop" class="helper-pop" style="visibility: hidden">
                <div class="helper-pop-content">
                    <form style="height: 0; overflow: hidden">
                      <input tabindex="-1" type="text" name="username" />
                      <input tabindex="-1" type="password" name="password" />
                    </form>
                    <button class="helper-close-button" cancel><i class="ivu-icon ivu-icon-md-close"></i> 关闭</button>
                    <p id="HelperSwitchAccountTip">多账号切换功能目前为<label>BETA</label>版，只支持账号密码方式登录</p>
                    <table class="helper-table">
                        <tbody>
                            <tr>
                                <th>选择账号</th>
                                <td>
                                    <select id="SwitchAccount">
                                        <option>（选择观测云账号）</option>
                                        ${switchAccountOptionsHTML}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>节点</th>
                                <td>
                                    <select id="SelectGuanceNode">
                                        <option>（选择观测云节点）</option>
                                        ${selectGuanceNodeHTML}
                                        <option value="PRIVATE">私有部署</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>登录页 URL</th>
                                <td><input type="text" auth-url value="https://auth.guance.com" /></td>
                            </tr>
                            <tr>
                                <th>用户名</th>
                                <td>
                                    <form>
                                        <input type="text" username value="" />
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <th>密码</th>
                                <td>
                                    <form>
                                        <input type="password" password value="" />
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <button class="helper-button" login><i class="ivu-icon ivu-icon-md-log-in"></i> 登录</button>
                    &emsp;&emsp;
                    <button class="helper-button" delete><i class="ivu-icon ivu-icon-md-close"></i> 删除</button>
                </div>
            </div>

            <div id="Helper">
                <strong id="HelperLogo">观测云 <i class="ivu-icon ivu-icon-md-heart"></i><br>&#12288;Helper</strong>
                <table class="helper-table">
                    <thead>
                        <tr>
                            <th>多账号</th>
                            ${thHTML}
                        </tr>
                    <thead>
                    <tbody>
                        <tr>
                            <td>
                                <button id="ShowSwitchAccount" class="helper-button">切换账号</button>
                            </td>
                            ${tdHTML}
                        </tr>
                    </tbody>
                </table>
            </div>
            `;

        document.body.append($main);
    }

    // 缓存用户信息
    function cacheAccountList() {
        GM_xmlhttpRequest({
            method      : 'GET',
            url         : getAPIURL(`/api/v1/workspace/member/list?pageSize=100`),
            headers     : API_AUTH_HEADER,
            responseType: 'json',
            onload: resp => {
                resp.response.content.data.forEach(d => {
                    ACCOUNT_CACHE[d.uuid] = d;
                });
            }
        })
    }

    function storeLoginInfo() {
        wait(() => !!(APP.$store.getters.account && APP.$store.getters.workspace), () => {
            let accountToLogin = GM_getValue(ACCOUNT_TO_LOGIN_KEY);
            GM_deleteValue(ACCOUNT_TO_LOGIN_KEY);

            if (!accountToLogin) return;

            let authURL  = accountToLogin.authURL;
            let username = accountToLogin.username;
            let key = JSON.stringify({ authURL, username });

            let multiAccountMap = GM_getValue(MULTI_ACCOUNT_KEY) || {};

            let loginInfo = multiAccountMap[key] || { key };
            loginInfo.accountUUID = APP.$store.getters.account.uuid;

            multiAccountMap[key] = loginInfo;

            GM_setValue(MULTI_ACCOUNT_KEY, multiAccountMap);
        });
    }

    function storeLastWorkspace() {
        wait(() => !!(APP.$store.getters.account && APP.$store.getters.workspace), () => {
            let lastWorkspaceMap = GM_getValue(LAST_WORKSPACE_KEY) || {};

            let accountUUID   = APP.$store.getters.account.uuid;
            let workspaceUUID = APP.$store.getters.workspace.uuid;

            lastWorkspaceMap[accountUUID] = workspaceUUID;

            GM_setValue(LAST_WORKSPACE_KEY, lastWorkspaceMap);
        });
    }

    // 获取基本信息
    function getBasicInfo() {
        wait(() => !!(APP.$store.getters.account && APP.$store.getters.workspace), () => {
            let accountUUID    = APP.$store.getters.account.uuid;
            let workspaceUUID  = APP.$store.getters.workspace.uuid;
            let workspaceToken = APP.$store.getters.workspace.token;
            let storeEngines = [];
            if (APP.$store.getters.workspace.datastore) {
                storeEngines = Object.values(APP.$store.getters.workspace.datastore).reduce((acc, x) => {
                    if (acc.indexOf(x) < 0) acc.push(x);
                    return acc;
                }, []);
            }

            let data = [
                {
                    title: '当前节点',
                    class: 'helper-title-basic',
                    value: getNodeInfo(),
                    copy: true,
                },
                {
                    title: '账号 UUID',
                    class: 'helper-title-basic',
                    value: accountUUID,
                    copy: true,
                },
                {
                    title: '认证 TOKEN',
                    class: 'helper-title-basic',
                    value: API_AUTH_HEADER['x-ft-auth-token'],
                    copy: true,
                },
                {
                    title: '工作空间 UUID',
                    class: 'helper-title-workspace',
                    value: workspaceUUID,
                    copy: true,
                },
                {
                    title: '工作空间 TOKEN',
                    class: 'helper-title-workspace',
                    value: workspaceToken,
                    copy: true,
                },
                {
                    title: '数据库引擎',
                    class: 'helper-title-db',
                    value: storeEngines.join(' / ').toUpperCase(),
                },
                {
                    title: '当前路由',
                    class: 'helper-title-route',
                    value: APP.$route.name,
                    copy: true,
                },
            ]

            // 路由信息
            for (let prefix in ENTITY_ID_PREFIX_MAP) {
                let id = getIdFromURL(prefix);
                if (!id) continue;

                data.push({
                    title: `${ENTITY_ID_PREFIX_MAP[prefix]} ID`,
                    class: 'helper-title-route',
                    value: id,
                    copy: true,
                })
            }
            RENDER_DATA.push({
                key: 'basic',
                data: data,
            });

            // 展示
            updateDebugPanel();
        });
    }

    // 获取黑名单配置数量
    function getBlackListCount() {
        GM_xmlhttpRequest({
            method      : 'GET',
            url         : getAPIURL(`/api/v1/blacklist/list?type=all&pageSize=1`),
            headers     : API_AUTH_HEADER,
            responseType: 'json',
            onload: resp => {
                let count = null;
                try {
                    count = resp.response.content.pageInfo.totalCount;
                } catch(err) {
                    console.error(resp.responseText);
                    console.error(err);
                    return;
                }

                RENDER_DATA.push({
                    key: 'blackListCount',
                    data: [
                        {
                            title: `黑名单`,
                            class: 'helper-title-extra',
                            value: `${count} 个配置`,
                            href : '/workspace/filterRule/list',
                        }
                    ]
                });

                // 展示
                updateDebugPanel();
            }
         })
    }

    // 获取监控器静默数量
    function getMonitorMuteListCount() {
        GM_xmlhttpRequest({
            method      : 'GET',
            url         : getAPIURL(`/api/v1/mute/list?pageSize=1`),
            headers     : API_AUTH_HEADER,
            responseType: 'json',
            onload: resp => {
                let count = null;
                try {
                    count = resp.response.content.pageInfo.totalCount;
                } catch(err) {
                    console.error(resp.responseText);
                    console.error(err);
                    return;
                }

                RENDER_DATA.push({
                    key: 'monitorMuteCount',
                    data: [
                        {
                            title: `监控静默`,
                            class: 'helper-title-extra',
                            value: `${count} 个配置`,
                            href : '/monitor/silence/list',
                        }
                    ]
                });

                // 展示
                updateDebugPanel();
            }
         })
    }

    // 获取分享配置
    function getShareConfigCount() {
        GM_xmlhttpRequest({
            method      : 'GET',
            url         : getAPIURL(`/api/v1/share_config/list?pageSize=1`),
            headers     : API_AUTH_HEADER,
            responseType: 'json',
            onload: resp => {
                let count = null;
                try {
                    count = resp.response.content.pageInfo.totalCount;
                } catch(err) {
                    console.error(resp.responseText);
                    console.error(err);
                    return;
                }

                RENDER_DATA.push({
                    key: 'shareConfigCount',
                    data: [
                        {
                            title: `分享配置`,
                            class: 'helper-title-extra',
                            value: `${count} 个分享`,
                            href : '/workspace/embeddedSharing/chart',
                        }
                    ]
                });

                // 展示
                updateDebugPanel();
            }
         })
    }

    // 获取当前监控器规则信息
    function getCurrentMonitorRuleInfo() {
        let ruleId = getIdFromURL('rul');
        if (!ruleId) return;

        GM_xmlhttpRequest({
            method      : 'GET',
            url         : getAPIURL(`/api/v1/checker/${ruleId}/get`),
            headers     : API_AUTH_HEADER,
            responseType: 'json',
            onload: resp => {
                let funcCrontabId = null;
                try {
                    funcCrontabId = resp.response.content.crontabInfo.id;
                } catch(err) {
                    console.error(resp.responseText);
                    console.error(err);
                    return;
                }

                if (!funcCrontabId) return;

                RENDER_DATA.push({
                    key: 'monitorRule',
                    data: [
                        {
                            title: `Func 自动触发 ID`,
                            class: 'helper-title-extra',
                            value: funcCrontabId,
                            copy: true,
                        }
                    ]
                });

                // 展示
                updateDebugPanel();
            }
         })
    }

    // 获取帮助按钮配置
    function getHelperButtonOpt(attrs) {
        return {
            class: 'helper-button',
            attrs: attrs,
            on: {
                click: function(ev) {
                    ev.stopPropagation();
                }
            }
        }
    }

    // 获取帮助按钮配置（复制功能）
    function getHelperCopyButtonOpt(copyValue) {
        if (copyValue) copyValue = encodeURI(copyValue);
        return getHelperButtonOpt({ 'helper-copy': copyValue || '' });
    }

    // 创建时间列
    function createTime(h, t) {
        return [
            h('span', { class: 'monospace' }, APP.$moment(t).format('MM/DD HH:mm')),
            h('i',    { class: 'text-mute' }, `（${APP.$moment(t).fromNow()}）`),
        ]
    }

    // 创建修改者 / 更新人列
    function createAccountHelperButton(h, accountUUID) {
        if (accountUUID === 'SYS') {
            return h('i', { class: 'text-mute' }, '系统创建');

        } else {
            let accountInfo = ACCOUNT_CACHE[accountUUID];
            if (!accountInfo) return null;

            let copyValue = ''
            copyValue +=   `Name    : ${accountInfo.name}`;
            copyValue += `\nUsername: ${accountInfo.username || '-'}`;
            copyValue += `\nEmail   : ${accountInfo.email    || '-'}`;
            copyValue += `\nMobile  : ${accountInfo.mobile   || '-'}`;
            return h('button', getHelperCopyButtonOpt(copyValue), accountInfo.name);
        }
    }

    // 注入仪表板列表页面
    function injectDashboardPage() {
        wait(() => !!document.querySelector('.fth-scene-dashboard-list-table'), () => {
            // 防止重复添加
            if (document.querySelector('.fth-scene-dashboard-list-table .helper-column')) return;

            // 添加列
            let comp = document.querySelector('.fth-scene-dashboard-list-table').__vue__;
            comp.$data.columns.splice(1, 1,
                {
                    title: '创建人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.creator);
                    }
                },
                {
                    title: '修改人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.updator);
                    }
                },
                {
                    title: '修改时间',
                    width: 220,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createTime(h, params.row.updateAt * 1000);
                    },
                }
            );
        });
    }

    // 注入查看器列表页面
    function injectViewerPage() {
        wait(() => !!document.querySelector('.fth-scene-viewer-list-table'), () => {
            // 防止重复添加
            if (document.querySelector('.fth-scene-viewer-list-table .helper-column')) return;

            // 添加列
            let comp = document.querySelector('.fth-scene-viewer-list-table').__vue__;
            comp.$data.columns.splice(2, 1,
                {
                    title: '创建人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.creator);
                    }
                },
                {
                    title: '修改人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.updator);
                    }
                },
                {
                    title: '修改时间',
                    width: 220,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createTime(h, params.row.updateAt * 1000);
                    },
                }
            );
        });
    }

    // 注入监控器列表页面
    function injectMonitorPage() {
        wait(() => !!document.querySelector('.fth-monitor-table'), () => {
            // 防止重复添加
            if (document.querySelector('.fth-monitor-table .helper-column')) return;

            // 添加列
            let comp = document.querySelector('.fth-monitor-table').__vue__;
            comp.$data.columns.splice(3, 1,
                {
                    title: 'Crontab',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return h('button', getHelperCopyButtonOpt(), params.row.crontabInfo.crontab);
                    },
                },
                {
                    title: 'UUID',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return h('button', getHelperCopyButtonOpt(), params.row.uuid);
                    },
                },
                {
                    title: '创建人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.creator);
                    }
                },
                {
                    title: '修改人',
                    width: 100,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.updator);
                    }
                },
                {
                    title: '修改时间',
                    width: 220,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createTime(h, params.row.updateAt * 1000);
                    },
                }
            );

            let _email = APP.$store.getters.account.email;
            let _emailDomain = _email ? _email.split('@')[1] : null;
            if (_emailDomain === 'jiagouyun.com' || _emailDomain === 'guance.com') {
                comp.$data.columns.splice(3, 0,
                    {
                        title: '前往 Func',
                        width: 100,
                        className: 'helper-column',
                        display: 'none',
                        render: (h, params) => {
                            let opt = {
                                class: 'helper-button',
                                on: {
                                    click: (ev) => {
                                        GM_xmlhttpRequest({
                                            method      : 'GET',
                                            url         : getAPIURL(`/api/v1/checker/${params.row.uuid}/get`),
                                            headers     : API_AUTH_HEADER,
                                            responseType: 'json',
                                            onload: resp => {
                                                let funcCrontabId = null;
                                                try {
                                                    funcCrontabId = resp.response.content.crontabInfo.id;
                                                } catch(err) {
                                                    console.error(resp.responseText);
                                                    console.error(err);
                                                    return;
                                                }

                                                if (!funcCrontabId) return;

                                                let funcURL = getInnerDataFluxFuncPageURL(`/client-app/#/management/task-info-list/${funcCrontabId}`)
                                                window.open(funcURL, '_blank');
                                            }
                                        })
                                    }
                                }
                            }
                            return h('button', opt, '打开日志');
                        }
                    }
                );
            }
        });
    }

    // 注入智能巡检列表页面
    function injectBotObsPage() {
        wait(() => !!document.querySelector('.fth-intelligent-inspection-list-container'), () => {
            // 防止重复添加
            if (document.querySelector('.fth-intelligent-inspection-list-container .helper-column')) return;

            // 添加列
            let comp = document.querySelector('.fth-intelligent-inspection-list-container').__vue__;
            comp.$data.columns.splice(2, 1,
                {
                    title: '最后触发',
                    width: 220,
                    className: 'helper-column',
                    render: (h, params) => {
                        if (!params.row.lastEventInfo || !params.row.lastEventInfo.time) return;

                        return createTime(h, params.row.lastEventInfo.time);
                    },
                },
            )
        });
    }

    // 注入通知对象列表页面
    function injectAlertObjectPage() {
        wait(() => !!document.querySelector('.fth-alertto-table'),() => {
            // 防止重复添加
            if (document.querySelector('.fth-alertto-table .helper-button')) return;

            // 添加列
            let comp = document.querySelector('.fth-alertto-table').__vue__;
            comp.$data.columns.splice(2, 0,
                {
                    title: '通知目标',
                    className: 'helper-column',
                    width: 125,
                    render: (h, params) => {
                        let buttonName     = '';
                        let copyValueLines = [];

                        switch(params.row.type) {
                            case 'localFuncServer':
                            case 'selfBuildNotifyFunction':
                                if (!params.row.optSet.funcServerId || !params.row.optSet.funcId) return;

                                buttonName = '本地 Func';
                                copyValueLines.push(`Type            : ${params.row.type}`);
                                copyValueLines.push(`Workspace UUID  : ${params.row.workspaceUUID}`);
                                copyValueLines.push(`DataFlux Func ID: ${params.row.optSet.funcServerId}`);
                                copyValueLines.push(`Func ID         : ${params.row.optSet.funcId}`);
                                break;

                            case 'mail':
                                buttonName = '邮件';
                                copyValueLines.push(`Type: ${params.row.type}`);
                                copyValueLines.push(`To  :`);

                                params.row.optSet.to.forEach(t => {
                                    let accountInfo = ACCOUNT_CACHE[t];
                                    if (accountInfo) {
                                        copyValueLines.push(`    ${accountInfo.name} <${accountInfo.email || '*****'}>`);
                                    }
                                })
                                break;

                            case 'sms':
                                buttonName = '短信';
                                copyValueLines.push(`Type: ${params.row.type}`);
                                copyValueLines.push(`To  :`);

                                params.row.optSet.to.forEach(t => {
                                    let accountInfo = ACCOUNT_CACHE[t];
                                    if (accountInfo) {
                                        copyValueLines.push(`    ${accountInfo.name} <${accountInfo.mobile || '*****'}>`);
                                    }
                                })
                                break;

                            case 'dingTalkRobot':
                                if (!params.row.optSet.webhook) return;

                                buttonName = params.row.optSet.secret ? '钉钉（带签名）' : '钉钉（无签名）';
                                copyValueLines.push(`Type   : ${params.row.type}`);
                                copyValueLines.push(`Webhook: ${params.row.optSet.webhook}`);
                                copyValueLines.push(`Secret : ${params.row.optSet.secret || '-'}`);
                                break;

                            case 'wechatRobot':
                                if (!params.row.optSet.webhook) return;

                                buttonName = '微信';
                                copyValueLines.push(`Type   : ${params.row.type}`);
                                copyValueLines.push(`Webhook: ${params.row.optSet.webhook}`);
                                break;

                            case 'feishuRobot':
                                if (!params.row.optSet.webhook) return;

                                buttonName = params.row.optSet.secret ? '飞书（带签名）' : '飞书（无签名）';
                                copyValueLines.push(`Type   : ${params.row.type}`);
                                copyValueLines.push(`Webhook: ${params.row.optSet.webhook}`);
                                copyValueLines.push(`Secret : ${params.row.optSet.secret || '-'}`);
                                break;

                            case 'HTTPRequest':
                                if (!params.row.optSet.url) return;

                                buttonName = 'HTTP 请求';
                                copyValueLines.push(`Type: ${params.row.type}`);
                                copyValueLines.push(`URL : ${params.row.optSet.url}`);
                                break;
                        }

                        if (buttonName) {
                            return h('button', getHelperCopyButtonOpt(copyValueLines.join('\n')), buttonName);
                        }
                    },
                },
                {
                    title: '创建人',
                    className: 'helper-column',
                    width: 100,
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.creator);
                    }
                },
                {
                    title: '修改人',
                    className: 'helper-column',
                    width: 100,
                    render: (h, params) => {
                        return createAccountHelperButton(h, params.row.updator);
                    }
                },
                {
                    title: '修改时间',
                    width: 220,
                    className: 'helper-column',
                    render: (h, params) => {
                        return createTime(h, params.row.updateAt * 1000);
                    },
                }
            );
        })
    };

    // 主函数
    function main() {
        // 初始化
        init();

        // 清理旧数据
        clearOldData();

        // 配置监听器
        addListeners();

        // 未登录，注入页面
        if (COOKIES['fth-loginTokenName']) {
            // 准备请求认证头
            API_AUTH_HEADER = {
                'x-ft-auth-token' : COOKIES['fth-loginTokenName'],
                'x-workspace-uuid': new URL(CURRENT_URL).searchParams.get('w') || COOKIES['fth-lastWorkspaceUUid'],
            }

            // 准备处理
            noThrowWrapper(storeLoginInfo)();
            noThrowWrapper(storeLastWorkspace)();

            // DEBUG 状态栏部分
            RENDER_DATA = [];
            noThrowWrapper(getBasicInfo)();
            noThrowWrapper(getBlackListCount)();
            noThrowWrapper(getMonitorMuteListCount)();
            noThrowWrapper(getShareConfigCount)();

            // 缓存用户信息
            cacheAccountList();

            // 页面注入
            wait(() => !!APP.$route && Object.keys(ACCOUNT_CACHE).length > 0, () => {
                switch(APP.$route.name) {
                    // 仪表板
                    case 'DashboardList':
                        noThrowWrapper(injectDashboardPage)();
                        break;

                    // 查看器
                    case 'ViewerList':
                        noThrowWrapper(injectViewerPage)();
                        break;

                    // 监控器
                    case 'CheckerRuleList':
                        noThrowWrapper(injectMonitorPage)();
                        break;

                    case 'IntelligentInspectionList':
                        noThrowWrapper(injectBotObsPage)();
                        break;

                    // 告警通知对象
                    case 'AlertToList':
                        noThrowWrapper(injectAlertObjectPage)();
                        break;
                }
            });
        }
    }

    // 控制台
    if (unsafeWindow.$ && unsafeWindow.$('.fth-home') && window.onurlchange === null) {
        window.addEventListener('urlchange', main);
        wait(() => !!document.querySelector('.fth-home'), main);

        // Debug
        unsafeWindow.__clearGMStore = function() {
            GM_listValues().forEach(k => {
                GM_deleteValue(k);
            })
        }
    }

    // 登录界面
    wait(() => !!document.querySelector('button.login'), () => {
        let accountToLogin = GM_getValue(ACCOUNT_TO_LOGIN_KEY);

        if (accountToLogin) {
            fillInput('.el-form-item input', accountToLogin.username);
            fillInput('.el-form-item input[type=password]', accountToLogin.password);
            document.querySelector('button.login').click();
        }
    })
})();