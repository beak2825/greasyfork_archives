// ==UserScript==
// @name         K'S答题副本
// @namespace    http://tampermonkey.net/
// @version      0.77k
// @description  支持国开大部分题型，适合多人批量答题而非单独答题。仅收录并附带2024年秋季的新生答案，自用请自行收集答案，"学习新思想，争做新青年！"
// @author       Kinray7
// @match        https://www.google.com/*
// @match        https://lms.ouchn.cn/exam/*
// @match        https://lms.ouchn.cn/course/*
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ouchn.cn
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/516792/K%27S%E7%AD%94%E9%A2%98%E5%89%AF%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/516792/K%27S%E7%AD%94%E9%A2%98%E5%89%AF%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 使用DOM操作添加CSS样式
    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 添加CSS样式确保菜单可见
    addStyle(`
        #ks-floating-menu {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 9999 !important;
            background: rgba(255,255,255,0.95) !important;
            border: 1px solid #ccc !important;
            border-radius: 8px !important;
            padding: 15px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            font-family: 'Microsoft YaHei', sans-serif !important;
            min-width: 200px !important;
        }
        #ks-floating-menu * {
            box-sizing: border-box !important;
        }

        /* 开关样式 */
        .ks-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 28px;
            margin: 0 8px;
        }
        .ks-switch input {
            display: none;
        }
        .ks-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 28px;
        }
        .ks-slider:before {
            position: absolute;
            content: "";
            height: 24px;
            width: 24px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .ks-slider {
            background-color: #4CAF50;
        }
        input:checked + .ks-slider:before {
            transform: translateX(32px);
        }
        .ks-slider::after {
            content: "OFF";
            color: white;
            position: absolute;
            transform: translateY(-50%);
            top: 50%;
            font-size: 12px;
            right: 8px;
        }
        input:checked + .ks-slider::after {
            content: "ON";
            left: 8px;
            right: auto;
        }

        .ks-switch-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }
        .ks-switch-label {
            flex: 1;
            margin-right: 10px;
        }
    `);

    // 初始化设置
    function initSettings() {
        // 确保设置值存在
        if (GM_getValue('waiTime') === undefined) GM_setValue('waiTime', 2);
        if (GM_getValue('basicWaiTime') === undefined) GM_setValue('basicWaiTime', 10);
        if (GM_getValue('submitit') === undefined) GM_setValue('submitit', true);
        if (GM_getValue('altered') === undefined) GM_setValue('altered', false);
        // 新增entest设置
        if (GM_getValue('entest') === undefined) GM_setValue('entest', false);
    }

    // 创建浮动菜单
    function createFloatingMenu() {
        // 确保菜单只创建一次
        if (document.getElementById('ks-floating-menu')) return;

        const menuHTML = `
<div id="ks-floating-menu">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0; font-size: 16px; color: #333;">答题设置</h3>
        <button id="ks-close-menu" style="
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #999;
        ">×</button>
    </div>

    <div style="margin-bottom: 10px;">
        <div class="ks-switch-row">
            <span class="ks-switch-label">自动提交答案</span>
            <label class="ks-switch">
                <input type="checkbox" id="ks-submitit" ${GM_getValue('submitit') ? 'checked' : ''}>
                <span class="ks-slider"></span>
            </label>
        </div>
        <div class="ks-switch-row">
            <span class="ks-switch-label">完成后提醒</span>
            <label class="ks-switch">
                <input type="checkbox" id="ks-altered" ${GM_getValue('altered') ? 'checked' : ''}>
                <span class="ks-slider"></span>
            </label>
        </div>
        <!-- 新增entest开关 -->
        <div class="ks-switch-row">
            <span class="ks-switch-label">自动进入考试</span>
            <label class="ks-switch">
                <input type="checkbox" id="ks-entest" ${GM_getValue('entest') ? 'checked' : ''}>
                <span class="ks-slider"></span>
            </label>
        </div>
    </div>

    <div style="margin-bottom: 12px;">
        <div style="margin-bottom: 8px;">
            <label style="font-size: 14px;">每题等待(秒):</label>
            <input type="number" id="ks-waitime" value="${GM_getValue('waiTime')}" min="1" max="10" style="
                width: 60px;
                padding: 4px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-left: 8px;
            ">
        </div>
        <div>
            <label style="font-size: 14px;">保底等待(秒):</label>
            <input type="number" id="ks-basicwaitime" value="${GM_getValue('basicWaiTime')}" min="5" max="30" style="
                width: 60px;
                padding: 4px;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin-left: 8px;
            ">
        </div>
    </div>

    <button id="ks-save-settings" style="
        width: 100%;
        padding: 8px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    ">保存设置</button>
</div>
        `;

        document.body.insertAdjacentHTML('beforeend', menuHTML);

        // 添加事件监听
        document.getElementById('ks-close-menu').addEventListener('click', function() {
            document.getElementById('ks-floating-menu').style.display = 'none';
        });

        document.getElementById('ks-save-settings').addEventListener('click', function() {
            const waiTime = parseFloat(document.getElementById('ks-waitime').value);
            const basicWaiTime = parseFloat(document.getElementById('ks-basicwaitime').value);
            const submitit = document.getElementById('ks-submitit').checked;
            const altered = document.getElementById('ks-altered').checked;
            const entest = document.getElementById('ks-entest').checked;

            if (!isNaN(waiTime)) GM_setValue('waiTime', waiTime);
            if (!isNaN(basicWaiTime)) GM_setValue('basicWaiTime', basicWaiTime);
            GM_setValue('submitit', submitit);
            GM_setValue('altered', altered);
            GM_setValue('entest', entest);

            alert('设置已保存！');
        });
    }

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand("⚙️ 设置答题参数", function() {
            createFloatingMenu();
            document.getElementById('ks-floating-menu').style.display = 'block';
        });

        GM_registerMenuCommand("📊 查看当前设置", function() {
            const settings = `
当前设置:
每道题等待时间: ${GM_getValue('waiTime')}秒
保底等待时间: ${GM_getValue('basicWaiTime')}秒
自动提交: ${GM_getValue('submitit') ? '开启' : '关闭'}
未收录提醒: ${GM_getValue('altered') ? '开启' : '关闭'}
自动进入考试: ${GM_getValue('entest') ? '开启' : '关闭'}
            `;
            alert(settings);
        });
    }

    // 主初始化函数
    function init() {
        // 初始化设置值
        initSettings();

        // 注册菜单命令
        registerMenuCommands();

        // 创建浮动菜单（但默认隐藏）
        createFloatingMenu();
        if (document.getElementById('ks-floating-menu')) {
            document.getElementById('ks-floating-menu').style.display = 'none';
        }

        // 添加一个小的浮动按钮用于显示菜单
        const toggleBtn = document.createElement('div');
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            width: 40px;
            height: 40px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        toggleBtn.addEventListener('click', function() {
            const menu = document.getElementById('ks-floating-menu');
            if (menu) {
                menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            } else {
                // 如果菜单不存在，则创建并显示
                createFloatingMenu();
                document.getElementById('ks-floating-menu').style.display = 'block';
            }
        });
        document.body.appendChild(toggleBtn);

        console.log('K\'S答题副本设置菜单已初始化');
    }

    // 确保在DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 每道题的等待时间
    let waiTime = GM_getValue('waiTime');
    // 保底题目等待时间
    let basicWaiTime = GM_getValue('basicWaiTime');
    // 是否直接提交
    let submitit = GM_getValue('submitit');
    // 是否进行提醒
    let altered = GM_getValue('altered');
    // 是否自动进入考试（新增）
    let entest = GM_getValue('entest');
    let ignore_unsubmit = !submitit; // 兼容原代码

    // ... 原有脚本的其余部分保持不变 ...
    // 注意：您现在可以在脚本中使用entest变量来控制自动进入考试的功能

    // 原有脚本的其余代码...



    // setTimeout(function(){
    //     jsonData = func()
    //     console.log(jsonData)
    //     console.log('调用成功')
    //  },3000)
    /*
    这是答案,不要包含任何空格或标点符号，暂仅支持ABCD
    */
    //答题网页
    //是否
    GM_setValue('ido', false);



    var jsonData = {};
    var answers = {
        "国开":{2024:[11]},
        40000088813:{ 40000497130:["A","C","A","C","ABCD","ABCDEF","AD","B","B","A",],
                     40000497174:["B","C","C","C","ABC","AC","B","B","B","A","B","A",],
                     40000497217:["C","D","B","B","C","AC","BD","A","B","B","A",],
                     40000497263:["A","D","C","D","ABCD","B","A","A","A",],
                     40000497297:["A","D","A","B","C","A","B","B","A","A",],},
        "马克思原理(本)":{2024:[11]},
        40000089056:{40000519604:["B","A","B","A","A","A","A","B","A","B","C","A","C","A","B"],
                     40000519655:["B","A","A","B","A","A","A","B","A","A","B","A","B","A","B","A","B","B","B","C","B","D","A","A","C","A"],
                     40000519705:["A","B","B","A","B","A","B","B","B","A","A","A","C","D","A","C","B","C"],
                     40000519743:["B","A","B","A","B","B","A","B","A","A","B","D","A","C","A","C","D"],
                     40000519770:["A","B","A","B","B","A","A","A","A","A","B","A","B","A","B","A","A","A","A","B","A","B","B","C","A","C","D","B","C","A","D","B","C"],
                     40000519829:["A","B","B","A","A","B","B","A","B","B","A","B","B","C","B","C","B","D"],
                     40000519857:["A","A","A","B","A","B","A","A","B","A","A","A","B","B","A","A","B","C","D","B","D","A","B","A"],
                     40000519876:["A","B","B","A","B","A","C","D","A",]},

        "近代史(本)":{2024:[11]},
        40000089011:{40000521807:["B","A","B","A","A","B","A","B","B","B","A","A","B","A","A","A","B","B","A","C","A","D","B","A","A","A","B",],
                     40000515993:["B","A","B","A","A","B","A","B","A","A","A","B","A","B","B","D","A","A","A","D","C","A","A","C","B","A","B","B",],
                     40000516022:["A","A","B","A","A","A","B","A","A","A","A","C","B","B","A","B","A","C","C",],
                     40000516057:["A","A","A","B","A","A","A","B","B","B","A","A","A","A","B","A","C","D","A","A","B","C","D","D","A","A","D",],
                     40000516083:["B","A","A","A","B","A","A","B","A","B","A","B","A","A","A","A","B","A","B","B","C","C","A","A","A","A","D","C","B","C","A",],
                     40000516121:["A","B","A","A","B","A","B","A","A","A","C","B","A","B","C","B","B","B","B","B","D",],
                     40000516145:["A","B","A","A","A","A","B","C","B","C","D",],
                     40000516171:["B","A","A","A","B","A","A","B","A","D","C","C","C","A","B","D","A"]},

        "思政(专)":{2024:[11]},
        40000089031:{40000518863:["B","B","D","A","A",],
                     40000518877:["D","A","C","D","B","B","B","A","A","B","B",],
                     40000518889:["B","C","C","D","C","A","B","C","A","B","B","A","A","A","A",],
                     40000518919 :["B","C","C","D","C","A","D","B","B","A","B","A","A","A","A","B",],
                     40000518930 :["B","B","A","B","C","B","A","B","A","A","A","B","B",],
                     40000518973:["C","D","D","A","A","D","B","C","D","C","A","A","A","B","A","A","A",],
                     40000519017 :["D","C","B","C","A","A","A","B","D","D","B","D","A","B","A","A","A","B","B","A","B","A","A",],},


        "毛(专)":{2024:[11]},
        40000089009:{40000515869:["A","A","B","A","A","A","B","B","B","B","B","C","A","C","B","B","D",],
                     40000515902:["A","B","B","A","B","A","B","A","B","B","A","A","B","C","B","D","A","B","D","B","C","D","A","C","C","C","D","C","B","A","A","A","D",],
                     40000515935:["A","A","A","A","A","A","D","C","B","A","B","C","B","C","D",],
                     40000515957:["A","A","A","A","A","B","A","B","B","A","B","B","A","C","A","B","A","C","C","C",],
                     40000515971 :["A","B","A","A","B","A","A","A","B","A","B","A",],
                     40000515994:["B","A","A","A","B","A","B","A","B","A","A","A","A","A","B","A","B","A","A","A","B","D","A","C","A","B","D","C","C","A",],
                     40000516018 :["A","A","A","B","A","A","B","A","B","A","A","A","B","D","C","A",],
                     40000516040 :["A","A","B","A","A","A","B","B","A","B","A","B","D","A","B","C"]},

        "习":{2024:[11]},
        40000089116:{ 40000520019:["A","B","A","A","B","D","B",],
                     40000520056:["A","B","A","B","A","D","D","A",],
                     40000520086:["B","B","A","A","A","C","C","B",],
                     40000520112:["A","B","A","A","B","D","A",],
                     40000520138:["A","B","A","A","B","B","C",],
                     40000520158:["A","A","B","B","A","A","A","D",],
                     40000520198:["A","A","B","A","B","A","A","B","A",],
                     40000520230:["A","B","B","A","A","C","B","B",],
                     40000520257:["A","A","A","B","B","C","D","B","B",],
                     40000520280:["A","B","A","B","B","A","A","C",],
                     40000520328:["B","A","A","B","A","C","A","C","A",],
                     40000520362:["B","A","B","A","A","D","B","A","C",],
                     40000520390:["A","B","A","A","B","C","B","C","B",],
                     40000520428:["A","B","B","A","A","B","C","D","A",],
                     40000520468:["A","A","B","A","A","B","C","A",],
                     40000520504:["B","A","A","A","C","B","D","C",],
                     40000520530:["A","B","B","A","A","D","C","C","A",],
                     40000520556:["A","A","B","B","A","A","B","B","A","D","C","C",],},

        "行政":{2024:[11]},
        40000088984:{ 40000514528:["D","A","A","B",],
                     40000514551:["B","C","B","A",],
                     40000514570:["A","C","A","B",],
                     40000514587:["A","C","A","B",],
                     40000514600:["B","D","B","A",],},

        "机电":{2024:[11]},
        40000088430:{40000470984:['B','A','A','A','B','A','B','B','B','A','B','A','A','B','A','B','B','A','B','B','C','A','D','B','C','C','A','C','D','D','D','C','C','C','C','A','C','D','C','B'],
                     40000471001:['A','B','B','A','A','A','A','A','B','A','A','B','A','A','A','A','A','A','B','B','D','A','A','B','C','D','D','B','C','D','C','B','C','B','A'],
                     40000471013:['A','A','A','A','B','A','A','B','B','A','B','A','B','B','B','A','B','B','B','B','B','D','C','B','B','A','D','B','A','A','B','D','D','B','B','C','A','D','B','A'],
                     40000471025:['B','B','A','A','B','B','A','A','A','B','A','B','A','A','B','A','A','A','B','B','D','A','B','C','A','A','D','C','B','B','C','D','A','B','C','B','D','D','C','C']},
        40000088429:{40000470747:['A','A','A','B','B','B','B','A','A','A','B','B','D','C','C','A','C','B','C','D','B','D','D','C','D','C','C','A','B','C','C','A','B'],
                     40000470770:['B','B','B','A','A','B','A','B','A','B','B','B','C','A','C','B','C','D','A','C','C','C','B','B','B','C','D','B','C','C','B','C','C','B','B','D'],
                     40000470799:['A','B','A','A','A','A','B','B','B','A','A','A','C','B','A','B','D','D','D','A','B','A','D','A','D','D','D','B','C','D','C','A','B','B','C','D','D','A','B'],
                     40000470821:['B','A','B','A','B','B','A','B','B','A','B','A','B','B','D','C','A','D','B','D','B','A','A','C','B','C','B','D','A','A','A','B','A','C','B']},
        40000088834:{40000499939:['A','B','A','B','B','B','A','A','A','A','A','B','A','B','A','B','A','A','A','A','B','A','B','A','B','A','B','B','A','B','B','A','B','A','A','A','B','B','A','B','A','B','C','D','C','C','A','C','A','B','A','C','C','A','C','A','D','C','C','C','C','D','D','B','C','A','C','D','B','B'],
        },

        40000088374:{40000466598:['B','C','C','D','A','C','A','A','A','A','B','B','A','B','B','B','A','B','C','D'],
                     40000466602:['B','D','C','A','B','B','B','D','B','A','B','A','B','B','A','B','B','A','A','C'],
                     40000466606:['A','C','C','B','A','A','C','C','B','B','A','A','B','A','D','D','B','B','A','C'],
                     40000466614:['D','D','A','B','B','C','C','A','B','A','A','B','A','B','B','A','C','A','D','B']},
        40000088480:{40000474068:['C','B','A','D','A','B','C','D','A','B','A','B','A','A','B','B','B','B','B','ABCD','ABC','ABCD','ABD','ACD','ABCDEF','ABCD'],
                     40000474079:['A','B','A','A','A','A','A','A','A','A','B','B','A','A','B','B','A','B','A','A','A','A','A','B','A','C','B','B','A','B','B'],
                     40000474094:['B','B','ABC','A','C','D','B','A','B','D','A',],
                     40000474104:['A','A','A','A','A','A','A','B','B','B','B','B','A','B','A','A']},

        40000088835:{40000499768:['A','B','B','A','A','A','A','B','B','D','C','D','D','B','B','D','A','A','B','C','B','B','A'],
                     40000499783:['A','A','A','A','A','A','B','B','A','A','C','D','C','A','B','B','A','C','B','D','A','A'],
                     40000499807:['B','A','B','A','A','A','C','C','A',
                                  '答案采样过程是用采样开关(或采样单元)将模拟信号按一定时间间隔抽样成离散模拟信号的过程。因采样后得到的离散模拟信号本质上还是模拟信号,未数量化,不能直接送入计算机,故还需经数量化,变成数字信号才能被计算机接受和处理。量化过程(简称量化)就是用一组数码(如二进制码)来逼近离散模拟信号的幅值,将其转换成数字信号,由于计算机的数值信号是有限的,因此用数码来逼近横拟信号是近似的处理方法。信号进入计算机后经其处理经D/A转换后输出。',
                                 '(2)助记符指令程序:STR X1<br>OR Y1<br>AND NOT X2OUT Y1<br>STR X3OR Y2<br>AND NOT X4AND Y1<br>OUT Y2'],
                     40000499820:['B','B','A','A','B','A','C','D','C','A']},
        40000088432:{40000471093:['变形 破坏','塑性变形 断裂','断裂前 最大塑性变形','奥氏体 渗碳体','交变载荷 断裂','含碳量 万分之几','碳钢 合金元素','通用橡胶 特种橡胶','表面淬火 表面化学热处理','正火','整模造型 分模造型 挖砂造型 活块造型','酸性焊条 碱性焊条','分离工序 变形工序','焊芯 药皮',
                                                'B','A','B','A','A','A','B','A','A','A','A','B','A','A','A','B','B','B','B','A','B','A','B','A','A','A','A','B','A','B','B','B','A','B','B','B','A','A','A','A','B','A'],
                                   40000471097:['间隙配合 过盈配合 过渡配合','零线','基准制 公差等级 配合种类','形状 大小 方向 位置','定向公差 定位公差 跳动公差','固定 浮动','圆跳动 全跳动','大','取样长度','比较法 光切法 干涉法',
                                                'B','A','B','B','B','B','B','A','A','A','B','B','B','B','A','B','A','B','B','A','B','B','B','A','D','C','B','A','C','D','B','C'],
                                   40000471102:['切削速度 进给量 背吃刀量','工件材料 刀具材料 切削用量','正常磨损 非正常磨损','主 进给 主','节状切屑 单元切屑 崩碎切屑','通用机床 专门化机床 专用机床','机械传动 液压传动','高速钢','切削部分 导向部分','孔',
                                                'B','B','A','A','A','A','A','B','B','B','A','B','B','A','A','A','B','A','A','B','A','A','B','A','A','B','B','C','D','D','A','A','D','C','B','C'],
                                   40000471105:['装配基准 测量基准 工序基准 定位基准','力源装置 传力机构 夹紧元件','完全 不完全','尺寸精度 形状精度 位置精度','径向圆跳动 轴向窜动','硬度 塑性','粗加工阶段 半精加工阶段 精加工阶段','计算法 经验估计法 查表修正法',
                                                'A','A','B','A','A','B','A','B','A','A','B','A','A','B','B','A','A','B','A','A','B','B','B','A','B','A','D','C','B','A','C','B','D','C','A','C','A','B']}
    }
    let unswers = {};
    var ABCD = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"ABCD":[0,1,2,3],"ABCDE":[0,1,2,3,4],"ABCDEF":[0,1,2,3,4,5],"AB":[0,1],"AC":[0,2],"AD":[0,3],
                "BC":[1,2],"BD":[1,3],"CD":[3,4],"ABC":[0,1,2],"ACD":[0,2,3],"BCD":[1,2,3],"ABD":[0,1,3],};
    //思政+毛概
    let urls1 = [
    ];
    //马哲+近史
    let urls2 = [
    ];
    //其他重要变量
    var done = false;
    var qIn = 0;
    let cIndex = GM_getValue("cIndex", 0);
    //题目答案模糊查
    function fuzzySearch(obj, keyword) {
        let result;
        Object.entries(obj)
            .filter(([key]) => keyword.includes(key))
            .forEach(([, value]) => (result = value));
        return result;
    }
    // 提取kemuid和examid的函数
    function extractAndStoreIDs() {
        var url = window.location.href;
        var regex = /course\/(\d+)\/learning-activity\/full-screen#\/exam\/(\d+)/;
        var matches = url.match(regex);

        if (matches && matches.length === 3) {
            var kemuid = matches[1];
            var examid = matches[2];

            // 存储ID到本地存储中
            GM_setValue('kemuid', kemuid);
            GM_setValue('examid', examid);

            console.log('kemuid:', kemuid);
            console.log('examid:', examid);
            console.log('当前页码: ', cIndex);
        } else {
            console.log('无法从URL中提取ID');
        }
    }
    // 提取浓缩版答案
    function getAnswer() {
        var kemuid = GM_getValue('kemuid');
        var examid = GM_getValue('examid');

        if (kemuid && examid && answers[kemuid] && answers[kemuid][examid]) {
            return answers[kemuid][examid];
        } else {
            console.log('浓缩答案Not Found');
            return [];
        }
    }
    let originalTitle = document.title;
    let flashTitle = "🔴已完成❗🔴";

    function flash() {
        document.title = (document.title === originalTitle) ? flashTitle : originalTitle;
    }

    let flashInterval;
    /*
    主体代码
    */

    async function waitForElement(selector, waitTime = 1000, maxCount = 10) {
        let count = 0;
        return new Promise(resolve => {
            let timeId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element || count >= maxCount) {
                    clearInterval(timeId);
                    resolve(element || null);
                }
                count++;
            }, waitTime);
        });
    }

    function checkNum(answers, num) {
        // 检查是否是外层键
        if(answers.hasOwnProperty(num)) return true;
        // 检查内层键
        return Object.values(answers).some(subObj => subObj.hasOwnProperty(num));
    }
    async function returnCoursePage(waitTime = 500) {
        const backElement = await waitForElement("a.go-back-link i", waitTime);
        GM_setValue('back2lst', false)
        if (backElement) {
            backElement?.click();
        } else {
            throw new Error("异常 无法获取到返回课程列表页面的元素！");
        }
    }
    async function returnClassPage(waitTime = 500) {
        const backElement = await waitForElement("a.full-screen-mode-back", waitTime);
        GM_setValue('back2lst', false)
        if (backElement) {
            backElement?.click();
        } else {
            throw new Error("异常 无法获取到返回课程列表页面的元素！");
        }
    }
    async function returnTestPage(waitTime = 500) {
        const backElement = await waitForElement("a.full-screen-header-button", waitTime);
        GM_setValue('back2lst', true)
        if (backElement) {
            backElement?.click();
        } else {
            throw new Error("异常 无法获取到返回答题列表页面的元素！");
        }
    }
    window.addEventListener('load',function(){
        var test_url = window.location.href
        let back2lst = GM_getValue('back2lst')
        console.log('back2lst:', back2lst)

        //新生返回
        if(test_url.includes('submission/')){
            console.log('back2lst:', back2lst)
            GM_setValue('back2lst', true)
            console.log('back2lst:', back2lst)
            console.log('这是考试结束界面')
            setTimeout(returnTestPage, 1000);
        }
        if(back2lst){
            console.log('将回到答题页面')
            setTimeout(returnClassPage, 1000);
        }

        //传统返回
        if(test_url.includes('learning-activity#/exam')){
            console.log('back2lst:', back2lst)
            console.log('这是考试结束界面')
            setTimeout(returnCoursePage, 1000);
        }

        let fun = function(){
            var test = document.getElementsByClassName('button button-green take-exam ng-scope')
            var next = document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0]
            var content = document.getElementsByClassName('activity-content-bd material-box')
            if(test.length>0){
                //console.log('进入考试')
                // NEW调用函数并获取ID
                extractAndStoreIDs();
                if(entest && document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length<1){
                    //查找进入考试按钮，并连按进入
                    setTimeout(function(){
                        try{
                            document.getElementsByName('confirm')[0].click();
                            document.getElementsByClassName('button button-green medium ng-binding')[0].click();
                        }catch(error){
                            next.click();
                        }
                    },8000)
                }else if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div:nth-child(9) > div > div.activity-area.clearfix.exam-area > div.activity-content-wrapper > div.___content > div > div > div > div > div > div:nth-child(1) > div > div.bd > div.submission-list.exam-area.ng-scope > div > ul > li:nth-child(1)").length>=1){
                    document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click();
                }
                //next.click();
            }else if(document.querySelectorAll("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div").length>0){
                var stored_kemuid = GM_getValue('kemuid');
                var stored_examid = GM_getValue('examid');

                console.log('存储的kemuid:', stored_kemuid);
                console.log('存储的examid:', stored_examid);
                console.log('当前页码: ', cIndex);
                console.log("是否收录",checkNum(answers,stored_examid))
                //if (checkNum(answers,stored_examid)) {
                //原程序
                //console.log('开始考试')
                $('.exam-subjects ol li').each(function(){
                    var self1 = $(this)
                    var classname = self1.attr('class')
                    //console.log(classname)
                    if(classname == 'subject ng-scope fill_in_blank'){
                        console.log('这是填空题');
                        // 获取题号和题目
                        var qnum0 = self1.children('div').children('div').children('div.summary-title').children('div').children('span').children('span').text();
                        var q0 = self1.children('div').children('div').children('div').children('span').children('p');
                        var que0 = q0.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，"""" 【】→（  ）、()­？：\s+]/g,"");
                        console.log('第', qnum0, '题:');
                        // 获取JSON答案
                        var da_an0 = fuzzySearch(jsonData, que0);
                        // 获取答案文本并分割
                        console.log('答案：' + da_an0);
                        if (checkNum(answers,stored_examid)){
                            const ans0 = getAnswer()[qnum0-1];
                            const subAnswers = ans0.split(' ');
                            console.log('浓缩版答案显示为:', ans0);
                            console.log('子答案数量:', subAnswers.length);
                            console.log('子答案:', subAnswers);

                            // 获取空格数量
                            let blankCount = self1.find('var.___answer').length;
                            console.log(`空格数量: ${blankCount};`);

                            // 检查是否为大写字母答案
                            const isUpperCaseLetters = (str) => /^[A-J]+$/.test(str);
                            if (subAnswers.length === 1 && isUpperCaseLetters(ans0)) {
                                console.warn('警告: 答案可能是选择题');
                            }

                            // 比较空格数量和子答案数量
                            if (blankCount == subAnswers.length){
                                console.log('空格数量和答案数量一致');
                            } else {
                                console.warn('警告: 空格和答案数量不匹配');
                            }

                            // 使用for循环填充子答案
                            let uElements = self1.find('u');
                            for (let i = 0; i < Math.min(blankCount, subAnswers.length); i++) {
                                let varElement = uElements.eq(i).find('var.___answer');
                                if(varElement.length > 0) {
                                    //varElement.html(subAnswers[i]);
                                    varElement[0].focus();
                                    varElement[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
                                    varElement[0].textContent = subAnswers[i];
                                    varElement[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'a', bubbles: true }));
                                    varElement[0].dispatchEvent(new Event('input', { bubbles: true }));
                                    console.log(`填入第${i+1}个空: ${subAnswers[i]}`);

                                }
                            }
                            // 找到所有class包含ng-empty的var元素
                            const answerVars = self1.find('var.___answer');
                            answerVars.each(function() {
                                // 移除旧的class
                                $(this).removeClass('ng-pristine ng-untouched ng-empty');

                                // 添加新的class
                                $(this).addClass('ng-touched ng-dirty ng-valid-parse ng-not-empty');

                                console.log('已更新元素class');
                            });

                        }
                    }
                    if(classname == 'subject ng-scope cloze'){
                        console.log('这是阅读理解/多空题');
                        // 获取题号和题目
                        GM_setValue('ido', true);
                    }


                    if(classname == 'subject ng-scope short_answer'){
                        console.log('这是简答题');
                        // 获取题号和题目
                        GM_setValue('ido', true);
                        var qnum5 = self1.children('div').children('div').children('div.summary-title').children('div').children('span').children('span').text();
                        var q5 = self1.children('div').children('div').children('div').children('span').children('p');
                        var que5 = q5.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，"""" 【】→（  ）、()­？：\s+]/g,"");
                        console.log('第', qnum5, '题:');
                        // 获取JSON答案
                        var da_an5 = fuzzySearch(jsonData, que5);
                        // 获取答案文本并分割
                        console.log('答案：' + da_an5);
                        if (checkNum(answers,stored_examid)){
                            const ans5 = getAnswer()[qnum5-1];
                            console.log('浓缩版答案显示为:', ans5);

                            // 使用for循环填充子答案
                            let pElement = self1.find('div.simditor-body.needsclick p');
                            if(pElement) {
                                //pElement.html(subAnswers[i]);
                                pElement.focus();
                                pElement.text(ans5);
                                console.log(` ${ans5}`);
                                pElement[0].dispatchEvent(new Event('input', { bubbles: true }));
                                pElement[0].dispatchEvent(new Event('change', { bubbles: true }));

                                }
                            }

                        }

                    //console.log(classname)
                    if(classname == 'subject ng-scope single_selection'){
                        console.log('这是单选题')
                        // 获取题号和题目
                        var qnum = self1.children('div').children('div').children('div.summary-title').children('div').children('span').children('span').text();
                        var q1 = self1.children('div').children('div').children('div').children('span').children('p')
                        var que1 = q1.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                        console.log('第',qnum,'题:')
                        console.log(que1)
                        // 获取JSON答案
                        var da_an1 = fuzzySearch(jsonData, que1)
                        console.log('答案：'+da_an1)
                        // 获取选项
                        var xuanxiang1;
                        if(self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p').length==0){
                            xuanxiang1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                        }else{
                            xuanxiang1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                        }
                        //var xx = self1.children('div').children('div').eq(1).children('ol').children('li')
                        console.log('浓缩版答案显示为:',getAnswer()[qnum-1]);
                        var ans1 = [];
                        for(var i=0;i<xuanxiang1.length;i++){
                            ans1[i] = xuanxiang1[i].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                            console.log(ans1[i])
                        }
                        for(var a=0;a<ans1.length;a++){
                            // console.log(ans1[a])
                            if(ans1[a] == da_an1 || a == ABCD[da_an1] || a == ABCD[getAnswer()[qnum-1]]){
                                console.log('匹配成功')
                                var xx1 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[a]
                                xx1.click();
                                console.log(xx1)
                            }
                        }
                        qIn = qnum
                    }else if(classname == 'sub-subject-content ng-scope'){
                        console.log('这是综合单选题')
                        // 获取题号和题目
                        var qnum4 = ++qIn
                        var q4 = self1.children('div').children('div').children('div').children('div').children('span').children('p')
                        var que4 = q4.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                        console.log('第',qnum4,'题:')
                        console.log(que4)
                        // 获取JSON答案
                        var da_an4 = fuzzySearch(jsonData, que4)
                        console.log('答案：'+da_an4)
                        // 获取选项
                        var xuanxiang4;

                        //if(self1.children('div').children('div').eq(1).children('ol').children('li').children('div').children('div').children('div.subject-body').children('ol').children('li').children('label').children('div').children('span').children('p').length==0){
                            //xuanxiang4 = self1.children('div').children('div').eq(1).children('ol').children('li').children('div').children('div').children('div.subject-body').children('ol').children('li').children('label').children('div').children('span)
                        //}else{
                            //xuanxiang4 = self1.children('div').children('div').eq(1).children('ol').children('li').children('div').children('div').children('div.subject-body').children('ol').children('li').children('label').children('div').children('span').children('p')
                        //}

                        //var xx = self1.children('div').children('div').eq(1).children('ol').children('li')
                        var ans4 = [];
                        console.log('浓缩版答案显示为:',getAnswer()[qnum4 - 1] );
                        console.log('答案显示为:',getAnswer()[21] );
                        //for(var f=0;f<xuanxiang4.length;f++){
                        //    ans4[f] = xuanxiang4[f].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                        //    console.log(ans4[f])
                        //}
                        for(var e=0;e<4;e++){
                            // console.log(ans4[a])
                            if(e == ABCD[getAnswer()[qnum4 - 1]]){
                                console.log('匹配成功')
                                var xx4 = self1.children('div').children('div').children('div').eq(1).children('ol').children('li').children('label')[e]
                                xx4.click();
                                console.log(xx4)
                            }
                        }
                    }else if(classname == 'subject ng-scope multiple_selection' && !done){
                        console.log('这是多选题')
                        // 获取题号 div > div.subject-head > div.summary-title > div > span > span
                        //body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div > ol > li:nth-child(6) > div > div.subject-head > div.summary-title > div > span > span
                        var qnum2 = self1.children('div').children('div').children('div.summary-title').children('div').children('span').children('span').text();
                        console.log('第',qnum2,'题:')
                        // 获取题目
                        //body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div > ol > li:nth-child(6) > div > div.subject-head > div.summary-title > span > p
                        var q2 = self1.children('div').children('div').children('div').children('span').children('p')
                        console.log(q2)
                        var que2 = q2.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                        console.log(que2)
                        var da_an2 = fuzzySearch(jsonData, que2)
                        console.log(da_an2)
                        var xuanxiang2;
                        if(self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p').length==0){
                            xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                        }else{
                            xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                        }
                        // var xuanxiang2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span').children('p')
                        console.log(xuanxiang2)
                        var ans2 = []
                        console.log('浓缩版答案显示为:',getAnswer()[qnum2-1]);
                        for(var b=0;b<xuanxiang2.length;b++){
                            ans2[b] = xuanxiang2[b].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                            console.log(ans2[b])
                            var reg = new RegExp(ans2[b])
                            //if(reg.test(da_an2) || da_an2 == '全选' || ABCD[da_an2].includes(b) || (Array.isArray(getAnswer()[qnum2-1]) && ABCD[getAnswer()[qnum2-1]].includes(b)) || (Array.isArray(getAnswer()[qnum2-1]) && getAnswer()[qnum2-1] == "全选")){
                            if (checkNum(answers,stored_examid)){
                                if(ABCD[getAnswer()[qnum2-1]].includes(b) || getAnswer()[qnum2-1] == "全选"){
                                    console.log('匹配成功')
                                    var xx2 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[b]
                                    xx2.click();
                                }else{
                                    console.log('匹配失败')
                                }
                            }
                        }
                        qIn = qnum2
                    }else if(classname == 'subject ng-scope true_or_false'){
                        console.log('这是判断题')
                        // 获取题号
                        //body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-content.card > div > ol > li:nth-child(8) > div > div.subject-head > div.summary-title > div > span > span
                        var qnum3 = self1.children('div').children('div').children('div.summary-title').children('div').children('span').children('span').text();
                        console.log('第',qnum3,'题:')
                        // 获取题目
                        var q3 = self1.children('div').children('div').children('div').children('span').children('p')
                        console.log(q3)
                        var que3 = q3.text().replace(/[–!.?&\|\\\*^%$#@\-_—。，“”"" 【】→（  ）、()­？：\s+]/g,"")
                        console.log(que3)
                        // 获取答案
                        var da_an3 = fuzzySearch(jsonData, que3)
                        console.log(da_an3)
                        // 获取选项
                        var xuanxiang3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label').children('div').children('span')
                        console.log(xuanxiang3)
                        var ans3 = []
                        for(var c=0;c<xuanxiang3.length;c++){
                            ans3[c] = xuanxiang3[c].innerText.replace(/[，、,''""‘’“”.。|\n\s+]/g,"")
                            console.log(ans3[c])
                        }
                        console.log('浓缩版答案显示为:',getAnswer()[qnum3-1]);
                        for(var d=0;d<ans3.length;d++){
                            if(ans3[d]==da_an3 || d == ABCD[da_an3] || d == ABCD[getAnswer()[qnum3-1]]){
                                console.log('匹配成功')
                                var xx3 = self1.children('div').children('div').eq(1).children('ol').children('li').children('label')[d]
                                console.log(xx3)
                                xx3.click()
                            }else{
                                //console.log('匹配失败')
                            }
                        }
                        qIn = qnum3

                    }

                })
                //}
                if(!done){
                    GM_setValue("quesNum", qIn)
                }
                done = true;
                let ido = GM_getValue('ido');
                let altered = GM_getValue('altered');
                let andunswer = checkNum(answers,stored_examid) && !(checkNum(unswers, stored_examid))
                let SubInterval
                console.log("stored_examid:",stored_examid)
                if (andunswer) {
                    console.log("已收录答案，即将提交答案")
                    SubInterval = 7000;
                } else {
                    console.log("未收录答案，将交由其他答题插件处理")
                    SubInterval = (1000*basicWaiTime+(waiTime*1000*GM_getValue("quesNum", 1)));
                }
                console.log("是否有简答题",ido)
                if (andunswer || submitit){
                    console.log("预计在", SubInterval,"毫秒后提交")
                    document.querySelector("body > div.wrapper > div.main-content.gtm-category > div.content-under-nav-2.with-loading.exam-activity-container.ng-scope > div.bd > div > div > div.exam-area-content > div > div.paper-footer > a")
                    setTimeout(function(){
                        document.querySelector("#submit-exam-confirmation-popup > div > div.popup-footer > div > button.button.button-green.medium").click();
                    },SubInterval)
                } else if(ido || !submitit) { console.log("识别到简答题，现不会自动提交")
                                if (!altered){
                                    GM_setValue('altered', true);
                                    //alert("检查到未收录的简答题！请自行提交");
                                }}
                //next.click();
            }else{
                //next.click();
            }
        }
        setInterval(function(){
            fun();
        }, 5000)
        var status = this.document.getElementsByClassName('toast-message')
        setInterval(function(){
            if(status.length>0){
                status[0].click()
            }
        })
    })

})();