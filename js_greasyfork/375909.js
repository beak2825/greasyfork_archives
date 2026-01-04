// ==UserScript==
// @name         WLGY-QCL
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        *://*/LaserWarn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375909/WLGY-QCL.user.js
// @updateURL https://update.greasyfork.org/scripts/375909/WLGY-QCL.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //update url: https://greasyfork.org/zh-CN/scripts/375909-wlgy-qcl

    console.log("start...");

    document.title = "量子级联红外光谱";
    document.querySelector('div.appBodyBlock').innerText = "等待设备，请稍候。。。";

    document.querySelector('body').style.fontFamily = "tahoma, arial, '宋体'";

    var oneChanged = false;

    //style.fontSize="13px";

    var nameI18n = {
        'About': '关于',
        'Clear All Alarms': '清除所有警报',
        'Close': '关闭',
        'Download Device Diagnostics': '下载设备日志',
        'LaserWarn Settings': '光学栅栏设置',
        'Power Settings': '电源设置',
        'Pulse settings': '脉冲设置',
        'Revert Changes': '恢复',
        'Revert To Defaults': '恢复默认值',
        'Software Versions': '软件版本',
        'Temperature settings': '温度设定',
        'Temperature Settings': '温度设定',
        'Unlock': '解锁',
        'Voltage settings': '电压设置',
        'Align Device': '设备对中',
        'Settings': '光学栅栏设置',
        'Start': '开始',
        'Stop': '停止',
        'Export Results': '输出结果',
        'Export Scans': '输出光谱',
        'Library': '库',

        '1,1-Difluoroethane (Freon-152A)': '1,1-二氟乙烷（氟利昂-152A）',
        '1,1-Difluoroethane(Freon-152A)': '1,1-二氟乙烷（氟利昂-152A）',
        'Acetic Acid': '醋酸',
        'AceticAcid': '醋酸',
        'Acetone': '丙酮',
        'Acetylaldehyde': '乙醛',
        'Acrolein': '丙烯醛',
        'Acrylonitrile': '丙烯腈',
        'Allyl Alcohol': '烯丙醇',
        'Ammonia anhydrous': '氨气',
        'Aniline': '苯胺',
        'Arsine': '砷烷',
        'Benzene': '苯',
        'Benzenethiol': '苯硫酚',
        'Boron Trichloride': '三氯化硼',
        'BoronTrichloride': '三氯化硼',
        'Bromomethane': '二溴甲烷',
        'Butane': '丁烷',
        'Carbon dioxide': '二氧化碳',
        'Carbondioxide': '二氧化碳',
        'Chloroacetone': '氯丙酮',
        'Chloroform': '氯仿',
        'Chloromethyl Methyl Ether': '氯甲基甲醚',
        'ChloromethylMethylEther': '氯甲基甲醚',
        'Chloropicrin': '氯化苦',
        'Cyclohexylamine': '环己胺',
        'Diborane': '乙硼烷',
        'Dimethyl Sulfate': '硫酸二甲酯',
        'DimethylSulfate': '硫酸二甲酯',
        'Dipropylene glycol methyl ether': '二丙二醇甲醚',
        'Epichlorohydrin': '环氧氯丙烷',
        'Ethylene': '乙烯',
        'Ethylene Oxide': '环氧乙烷',
        'EthyleneOxide': '环氧乙烷',
        'Ethylenediamine': '乙二胺',
        'Formaldehyde': '甲醛',
        'Freon-134a (1,1,1,2-tetrafluoroethane)': '1,1,1,2-四氟乙烷',
        'Freon-134a(1,1,1,2-tetrafluoroethane)': '1,1,1,2-四氟乙烷',
        'Hexachlorocyclopentadiene': '六氯环戊二烯',
        'Hydrazine': '肼',
        'Hydrogen sulfide': '硫化氢',
        'Iron Pentacarbonyl': '五羰基铁',
        'IronPentacarbonyl': '五羰基铁',
        'iso-Butane': '异丁烷',
        'iso-Pentane': '异戊烷',
        'Lewisite (L)': 'α-氯乙烯二氯胂（L）',
        'm-Xylene': '间二甲苯',
        'Methacrylonitrile': '甲基丙烯腈',
        'Methane': '甲烷',
        'Methyl Alcohol': '甲醇',
        'Methyl hydrazine': '甲基肼',
        'Methylhydrazine': '甲基肼',
        'Methyl Isocyanate': '甲基碳酰亚胺',
        'MethylIsocyanate': '甲基碳酰亚胺',
        'Methyl mercaptan': '甲硫醇',
        'Methylmercaptan': '甲硫醇',
        'Methyl Salicylate': '水杨酸甲酯',
        'Mustard (HD)': '芥末（HD）',
        'Nitric Acid': '硝酸',
        'NitricAcid': '硝酸',
        'Nitrogen Mustard (HN3)': '氮芥（HN3）',
        'o-Xylene': '邻二甲苯',
        'p-Xylene': '对二甲苯',
        'Pentane': '戊烷',
        'Perfluoroisobutene': '全氟异丁烯',
        'Phosgene': '光气',
        'Phosphine': '膦',
        'Phosphorus Oxychoride': '磷氧化物',
        'PhosphorusOxychoride': '磷氧化物',
        'Polystyrene': '聚苯乙烯',
        'Propane': '丙烷',
        'Proprionitrile': '丙腈',
        'Propylene': '丙烯',
        'Propyleneimine': '丙烯亚胺',
        'Sarin (GB)': '沙林（GB）',
        'Soman (GD)': '索曼（GD）',
        'Sulfur Dioxide': '二氧化硫',
        'SulfurDioxide': '二氧化硫',
        'Sulfur hexafluoride': '六氟化硫',
        'Tabun (GA)': '塔崩（GA）',
        'Titanium Tetrachloride': '四氯化钛',
        'Toluene': '甲苯',
        'Triethyl phosphate': '酸三乙酯',
        'Vinyl Chloride': '氯乙烯',
        'VX': 'VX神经毒气',
        'Water': '水',

        //2019-11-19
        'Ethyl alcohol': '乙醇',
        'Gasoline 92': '92号汽油',
        'Gasoline 95': '95号汽油',
        'Nitrous oxide': '笑气',
        'Tian Na Shui': '香蕉水',
        'Xi Ban Shui': '洗板水',

        'Communication Status:': '连接状态',
        'Connected': '已连接',
        'Cyclosarin (GF)': '环沙林（GF）',
        'LWO': 'LWO',
        'LWO-0005': 'QCL光谱仪-网联光仪',
        'LaserWarn': '光学栅栏',
        'Minutes': '分钟',
        'Model Name:': '型号名称',
        'Model Number:': '型号编号',
        'Running': '正在运行',
        'Serial Number:': '序列号',
        'Status:': '状态',
        'System Release': '系统发布',
        'System Version:': '系统版本',

        'Auto Reference Frequency [h]': '自动背景频率 [时]',
        'Auto': '自动',
        'Auto-recover on failure': '故障自动恢复',
        'DNS Server': 'DNS服务器',
        'Default Gateway': '默认网关',
        'Delete scans older than:': '删除早于以下时间的扫描:',
        'Device Name:': '设备名称:',
        'Enable Auto Reference': '激活自动背景',
        'Enter pin to unlock': '输入引脚解锁',
        'From': '来自',
        'IP Address': 'IP地址',
        'Keep lasers firing': '激光连续工作',
        'Manual': '手动',
        'Max': '最大',
        'Maximum P-Value Reported': '预报最大p-值',
        'Measurement Interval [s]': '监测间隔 [秒]',
        'Min': '最小',
        'Minimum Total Scan Intensity / Second': '最小总强度',
        'On low disk space:': '磁盘空间不足:',
        'PIN:': 'PIN:',
        'Path length [m]': '光程[米]',
        'Polystyrene Reference': '聚苯乙烯标准',
        'Pulse Duration [ns]': '激光脉冲宽度 [纳秒]',
        'Pulse Duration:': '激光脉冲宽度:',
        'Pulse Period:': '脉冲期:',
        'Reason:': '原因:',
        'Reference Duration [s]': '背景积分时间 [秒]',
        'Sample Delay:': '样品延迟:',
        'Sample Width:': '样本宽度:',
        'Scaling Y-Axis': 'y-轴调整',
        'Set to Low Power:': '设置为低功耗:',
        'Subnet Mask': '子网掩码',
        'Timeout:': '超时:',
        'Use DHCP': '使用DHCP',
        'Wired-Ethernet': '有线以太网',

        'Acquire': '光学测量',
        'Analysis Engine': '分析引擎',
        'Analysis Engine Name': '分析引擎名称',
        'Analysis Engine Version': '分析引擎版本',
        'Authorize Session': '授权会话',
        'BLKQCL-Controller': 'QCL-控制器',
        'ACU-Firmware': 'ACU-固件',
        'CCU-Firmware': 'CCU-固件',
        'Clear Temperature Alarms': '清除温度警报',
        'Delete All Data': '删除所有数据',
        'Done': '完成',
        'Keep laser on when \'ready to fire\':': '准备开启时保持激光打开',
        'Last Taken:': '当前背景',
        'Lock Device': '锁定设备',
        'Save network settings': '保存网络设置',
        'Take Reference': '背景测量',
        'Tune': '光学调谐',
        'Unlock Device': '解锁设备',
        'Use Defaults': '使用缺省值',

        'Active Users:': '活动用户',
        'Alerts': '告警',
        'Concentration (ppm)': '浓度 (ppm)',
        'Device Exclusive Use Lock Settings': '设备专用使用锁定设置',
        'Device storage management:': '设备存储管理:',
        'General Fault': '一般错误',
        'Laser Pumping Voltage Settings': '激光泵电压设置',
        'Laser Settings:': '激光设置:',
        'Locking:': '锁定:',
        'Network Interfaces:': '网络接口:',
        'Network Settings': '网络设置',
        'Persistance Storage Settings': '持久存储设置',
        'Pulse Settings': '脉冲设置',
        'System Power:': '系统电源:',
        'Temperature Alarm': '温度报警',
        'There was a thermal alarm reported by the device.': '该设备报告了一个热警报.',
        'µs': '微秒',
        'ns': '纳秒',

        'Today': '今天',
        'Yesterday': '昨天',
        'Last Seven Days': '近7天',
        'One Month': '近1个月',
        'Custom Range': '自定义范围',
        'Export': '输出',
        'Cancel': '取消',

    };

    var startTime = new Date().getTime();

    initMonitor(document.querySelector('div.container-fluid'));


    function initPage() {
        document.title = "量子级联红外光谱";
        document.querySelector('div.appBodyBlock').innerText = "等待设备，请稍后。。。";
        if (!oneChanged) {
            createIframe();
            // if (createIframe()) {
            //     oneChanged = true;
            // }
            // var background = document.querySelector('body > div.container-fluid > div:nth-child(4) > div > div.appBodyBlock.laserWarn');
            // if (background) {
            //     // background.style.backgroundColor = '#cccccc';
            //     // background.style.backgroundImage = 'linear-gradient(to bottom,#CCCCCC 0,#FFFFFF 100%';
            // }
        }

        var btns = document.querySelectorAll("div.container-fluid button");

        for (var j = 0; j < btns.length; j++) {
            if (btns[j].id == 'btnClearAllData') {
                changeInnerTextByIndex(btns[j], 2);
            } else {
                changeInnerText(btns[j]);
            }
        }

        var spans = document.querySelectorAll("div.container-fluid span");
        for (var j = 0; j < spans.length; j++) {
            changeInnerText(spans[j]);
        }

        var lables = document.querySelectorAll("div.container-fluid label");
        for (var j = 0; j < lables.length; j++) {
            changeInnerText(lables[j]);
        }

        var h3 = document.querySelector('#gasses h3');
        if (h3) {
            // h3.innerHTML = '库: <span data-bind="text: ActiveGasLibraryDisplayName">光学栅栏</span>';
            h3.innerHTML = '光学栅栏';
        }
        var h4s = document.querySelectorAll('div.container-fluid h4');
        for (var j = 0; j < h4s.length; j++) {
            changeInnerText(h4s[j]);
        }
        var h5s = document.querySelectorAll('div.container-fluid h5');
        for (var j = 0; j < h5s.length; j++) {
            changeInnerText(h5s[j]);
        }
        var ranges = document.querySelectorAll('div.ranges li,button');
        for (var j = 0; j < ranges.length; j++) {
            changeInnerText(ranges[j]);
        }

        var ago = document.querySelector('div.settings:nth-child(1) > div:nth-child(2) > div:nth-child(3) > label:nth-child(2) > span:nth-child(1)');
        if (ago) {
            ago.innerText = ago.innerText.replace('ago', '前');
            ago.innerText = ago.innerText.replace('hours', '小时');
            ago.innerText = ago.innerText.replace('minutes', '分钟');
            ago.innerText = ago.innerText.replace('seconds', '秒');
            ago.innerText = ago.innerText.replace('a few', '几');
        }

        var footLeft = document.querySelector('#app-Footer > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)');
        if (footLeft) {
            //Monitoring: [Interleaved Scan (1.886 seconds)]
            //Stopped:
            footLeft.innerText = footLeft.innerText.replace('Stopped', '已停止');
            footLeft.innerText = footLeft.innerText.replace('Monitoring', '监控中');
            footLeft.innerText = footLeft.innerText.replace('seconds', '秒');
            footLeft.innerText = footLeft.innerText.replace('Interleaved Scan', '扫描');
        }

        var footRight = document.querySelector('#app-Footer > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)');
        if (footRight) {
            //Pre-Release: 3.0b19x
            footRight.innerText = footRight.innerText.replace('Pre-Release', '预览版');
        }


        // if (document.querySelector('div.jqplot-yaxis-label')) {
        //     console.log("*********************************************");
        //     document.querySelector('div.jqplot-yaxis').style.display = "none";
        // }
        var yaxisLabels = document.querySelectorAll('canvas.jqplot-yaxis-label');

        var ylabels = ['纵坐标1', '纵坐标2', '纵坐标3', '纵坐标4', '纵坐标5', '纵坐标6'];
        var ylabels = ['浓度 [ppm]', '透光度', '浓度 [ppm]'];

        for (var j = 0; j < yaxisLabels.length; j++) {
            if (ylabels[j]) {
                const context = yaxisLabels[j].getContext('2d');
                context.save();
                context.clearRect(0, 0, yaxisLabels[j].width, yaxisLabels[j].height);
                context.translate(0, yaxisLabels[j].height);
                context.rotate(-90 * Math.PI / 180);
                context.textAlign = "center";
                context.font = "12px 宋体";
                context.fillStyle = "rgba(128,128,128,1)";
                context.fillText(ylabels[j], yaxisLabels[j].height / 2, yaxisLabels[j].width / 2 + 5);
                context.restore();
            }
        }

        var xaxisLabels = document.querySelectorAll('canvas.jqplot-xaxis-label');

        // var xlabels = ['横坐标1','横坐标2','横坐标3','横坐标4','横坐标5','横坐标6'];
        var xlabels = ['波数', '波数', null];

        for (var j = 0; j < xaxisLabels.length; j++) {
            if (xlabels[j]) {
                const context = xaxisLabels[j].getContext('2d');
                context.save();
                context.clearRect(0, 0, xaxisLabels[j].width, xaxisLabels[j].height);
                context.textAlign = "center";
                context.font = "12px 宋体";
                context.fillStyle = "rgba(128,128,128,1)";
                context.fillText(xlabels[j], xaxisLabels[j].width / 2, xaxisLabels[j].height / 2 + 5);
                context.restore();
            }
        }

        var delDigBt1 = document.querySelector('#modalSettings > div > div > div.modal-footer > div > div.popover-content > div > div > a.btn.btn-large.btn-danger');
        if (delDigBt1) {
            delDigBt1.childNodes[2].textContent = '删除';
        }
        var delDigBt2 = document.querySelector('#modalSettings > div > div > div.modal-footer > div > div.popover-content > div > div > a.btn.btn-large.btn-primary');
        if (delDigBt2) {
            delDigBt2.childNodes[2].textContent = '取消';
        }

        changeInnerTextBySelector('#modalSettings > div > div > div.modal-footer > div > h3',
            '删除所有数据？');
        changeInnerTextBySelector('#modalSettings > div > div > div.modal-footer > div > div.popover-content > p',
            '确定要删除所有的结果和扫描数据吗？');

        changeInnerTextBySelector('#modalSettingsTemp > div > div > div:nth-child(2) > div:nth-child(5) > div.tempDetails > div.thermometerName',
            '探测器');

        changeInnerTextBySelector('#modalSettingsTemp > div > div > div:nth-child(2) > div:nth-child(7) > div.tempDetails > div',
            '光学');

        changeInnerTextBySelector('#modalSettingsTemp > div > div > div:nth-child(2) > div:nth-child(6) > div.tempDetails > div',
            '系统');

        var tempTO = document.querySelector('#modalSettingsTemp > div > div > div:nth-child(2) > div:nth-child(3) > div.tempDetails > div.thermometerName');
        if (tempTO) {
            tempTO.innerText = tempTO.innerText.replace('to', '到');
        }

        // hideBySelector('#homeMenuBar > button:nth-child(1)');
    }

    function hideBySelector(selector) {
        var obj = document.querySelector(selector);
        if (obj) {
            obj.style.visibility = 'hidden';
        }
    }

    function changeInnerTextBySelector(selector, text) {
        var obj = document.querySelector(selector);
        if (obj) {
            obj.innerText = text;
        }
    }

    function changeInnerText(object) {
        changeInnerTextByIndex(object, 0)
    }

    function changeInnerTextByIndex(object, index) {
        if (!object) {
            return;
        }
        var value = nameI18n[object.innerText.trim()];

        if (typeof (value) != "undefined") {
            object.childNodes[index].textContent = value;
        } else {
            // console.log("undefined:'" + object.innerText.trim() + "'");
        }
    }


    var callbackTime = 60 * 1000;
    callbackTime = 60 * callbackTime;
    callbackTime = 24 * callbackTime;
    callbackTime = 365 * callbackTime;

    function initMonitor(targetNode) {
        var config = {attributes: true, childList: true, subtree: true};

        var callback = function (mutationsList) {
            // console.log("enter initMonitor");
            var nowTime = new Date().getTime();
            if ((nowTime - startTime) < callbackTime) {
                observer.disconnect();
                initPage();
                observer.observe(targetNode, config);
            } else {
                observer.disconnect();
            }
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    var startIframe = false;

    function createIframe() {
        if (startIframe) {
            return;
        }
        startIframe = true;
        console.log("begin createIframe");
        var transmitChartHolder = document.getElementById('transmitChartHolder');
        var transmitChart = document.getElementById('transmitChart');
        var appBodyBlock = document.querySelector('div.appBodyBlock');
        //console.log(window.getComputedStyle(appBodyBlock).display);

        if (transmitChart && transmitChartHolder && window.getComputedStyle(appBodyBlock).display == 'none') {
            console.log("chart found");

            var backendUrl = "http://localhost:8080/rest/v1/data";
            var frontendUrl = "http://localhost:8080/static/index.html?qclip=" + window.location.hostname;

            fetch(backendUrl)
                .then(function (response) {
                    console.log("backend status:" + response.status)
                    var iframe = document.createElement("iframe");
                    iframe.src = frontendUrl;
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.style.border = '0px solid #666666';
                    iframe.scrolling = 'no';

                    var makediv = document.createElement("div");
                    makediv.style.opacity = 1;
                    makediv.style.paddingTop = '2px';
                    makediv.style.backgroundColor = '#FEFCF5';
                    makediv.style.border = '2px solid darkgrey';
                    makediv.appendChild(iframe);

                    transmitChart.style.display = 'none';
                    transmitChartHolder.appendChild(makediv);
                    oneChanged = true;
                    startIframe = false;
                })
                // .then(data => console.log(data))
                .catch(function (error) {
                    console.log("backend not found");
                    oneChanged = true;
                    startIframe = false;
                });
        } else {
            startIframe = false;
        }
    }

    // Your code here...
})();