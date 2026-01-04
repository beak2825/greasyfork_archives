// ==UserScript==
// @name         CNKI学位论文搜索学校标记（985211）
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  CNKI 学校 标记 985 211
// @author       You
// @match        https://kns.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521033/CNKI%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E6%90%9C%E7%B4%A2%E5%AD%A6%E6%A0%A1%E6%A0%87%E8%AE%B0%EF%BC%88985211%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521033/CNKI%E5%AD%A6%E4%BD%8D%E8%AE%BA%E6%96%87%E6%90%9C%E7%B4%A2%E5%AD%A6%E6%A0%A1%E6%A0%87%E8%AE%B0%EF%BC%88985211%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function plog(msg) {
        let e = "border-radius: 2px 0 0 2px; background: #004fd9; color: #fff;";
        let t = "color: #004fd9;font-weight: bold;";
        console.log(`%c CNKI_SchoolTag %c ${msg} `, e, t);
    };

    const universities985 = [
        "清华大学", "北京大学", "厦门大学", "南京大学", "复旦大学",
        "天津大学", "浙江大学", "南开大学", "西安交通大学", "东南大学",
        "武汉大学", "上海交通大学", "山东大学", "湖南大学", "中国人民大学",
        "吉林大学", "重庆大学", "电子科技大学", "四川大学", "中山大学",
        "华南理工大学", "兰州大学", "东北大学", "西北工业大学", "哈尔滨工业大学",
        "华中科技大学", "中国海洋大学", "北京理工大学", "大连理工大学", "北京航空航天大学",
        "北京师范大学", "同济大学", "中南大学", "中国科学技术大学",
        "中国农业大学", "国防科学技术大学", "中央民族大学", "华东师范大学", "西北农林科技大学"
    ];

    const universities211 = [
        // 北京(26所)
        "清华大学", "北京大学", "中国人民大学", "北京工业大学", "北京理工大学",
        "北京航空航天大学", "北京化工大学", "北京邮电大学", "对外经济贸易大学",
        "中国传媒大学", "中央民族大学", "中国矿业大学", "中央财经大学",
        "中国政法大学", "中国石油大学", "中央音乐学院", "北京体育大学",
        "北京外国语大学", "北京交通大学", "北京科技大学", "北京林业大学",
        "中国农业大学", "北京中医药大学", "华北电力大学", "北京师范大学",
        "中国地质大学",
        // 上海(9所)
        "复旦大学", "华东师范大学", "上海外国语大学", "上海大学", "同济大学",
        "华东理工大学", "东华大学", "上海财经大学", "上海交通大学",
        // 天津(4所)
        "南开大学", "天津大学", "天津医科大学",
        // 重庆(2所)
        "重庆大学", "西南大学",
        // 河北(1所)
        "华北电力大学(保定)",
        // 山西(1所)
        "太原理工大学",
        // 内蒙古(1所)
        "内蒙古大学",
        // 辽宁(4所)
        "大连理工大学", "东北大学", "辽宁大学", "大连海事大学",
        // 吉林(3所)
        "吉林大学", "东北师范大学", "延边大学",
        // 黑龙江(4所)
        "东北农业大学", "东北林业大学", "哈尔滨工业大学", "哈尔滨工程大学",
        // 江苏(11所)
        "南京大学", "东南大学", "苏州大学", "河海大学", "中国药科大学",
        "中国矿业大学(徐州)", "南京师范大学", "南京理工大学", "南京航空航天大学",
        "江南大学", "南京农业大学",
        // 浙江(1所)
        "浙江大学",
        // 安徽(3所)
        "安徽大学", "合肥工业大学", "中国科学技术大学",
        // 福建(2所)
        "厦门大学", "福州大学",
        // 江西(1所)
        "南昌大学",
        // 山东(3所)
        "山东大学", "中国海洋大学", "中国石油大学(华东)",
        // 河南(1所)
        "郑州大学",
        // 湖北(7所)
        "武汉大学", "华中科技大学", "中国地质大学(武汉)", "华中师范大学",
        "华中农业大学", "中南财经政法大学", "武汉理工大学",
        // 湖南(3所)
        "湖南大学", "中南大学", "湖南师范大学",
        // 广东(4所)
        "中山大学", "暨南大学", "华南理工大学", "华南师范大学",
        // 广西(1所)
        "广西大学",
        // 四川(5所)
        "四川大学", "西南交通大学", "电子科技大学", "西南财经大学", "四川农业大学",
        // 云南(1所)
        "云南大学",
        // 贵州(1所)
        "贵州大学",
        // 陕西(7所)
        "西北大学", "西安交通大学", "西北工业大学", "陕西师范大学",
        "西北农林科技大学", "西安电子科技大学", "长安大学",
        // 甘肃(1所)
        "兰州大学",
        // 新疆(2所)
        "新疆大学", "石河子大学",
        // 海南(1所)
        "海南大学",
        // 宁夏(1所)
        "宁夏大学",
        // 青海(1所)
        "青海大学",
        // 西藏(1所)
        "西藏大学",
        // 军事系统(3所)
        "第二军医大学", "第四军医大学", "国防科学技术大学"
    ];


    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(
        (mutations) => {
            mutations.forEach(
                (mutation) => {
                    // 检查节点变化类型
                    if (mutation.type === 'childList') {
                        plog('子节点发生变化');

                        let resultType = document.querySelector('div.top-doctype div.content #resource');
                        if (resultType) {
                            let resultTypeStr = resultType.value;
                            plog(resultTypeStr);
                            if (resultTypeStr === 'DISSERTATION') {
                                plog("目前位于学位论文结果页面");
                                const units = document.querySelectorAll('table.result-table-list tbody tr td.unit');
                                console.log(units);
                                units.forEach(unit => {
                                    // plog(unit.textContent.trim());
                                    const aEle = unit.querySelector('a');
                                    console.log(aEle);
                                    const universityName = aEle.textContent.trim();
                                    if (universities985.includes(universityName)) {
                                        const span = document.createElement('span');
                                        span.textContent = '985';
                                        span.style.marginLeft = '5px';
                                        span.style.marginRight = '5px';
                                        span.style.fontFamily = '"Times New Roman", sans-serif';
                                        span.style.borderRadius = '9px';
                                        span.style.whiteSpace = 'nowrap';
                                        span.style.padding = '3px 9px 2px';
                                        span.style.fontSize = '14px';
                                        span.style.color = '#000';
                                        span.style.background = '#fe9898';
                                        aEle.appendChild(span);
                                        return;
                                    }

                                    if (universities211.includes(universityName)) {
                                        const span = document.createElement('span');
                                        span.textContent = '211';
                                        span.style.marginLeft = '5px';
                                        span.style.marginRight = '5px';
                                        span.style.fontFamily = '"Times New Roman", sans-serif';
                                        span.style.borderRadius = '9px';
                                        span.style.whiteSpace = 'nowrap';
                                        span.style.padding = '3px 9px 2px';
                                        span.style.fontSize = '14px';
                                        span.style.color = '#000';
                                        span.style.background = '#ff9999';
                                        aEle.appendChild(span);
                                    }
                                });
                            }
                        }
                    }

                    // 可以在这里添加你的自定义处理逻辑
                }
            );
        });

    // 等待DOM加载完成
    function waitForElement() {
        const gridTable = document.querySelector('#ModuleSearchResult');

        if (gridTable) {
            plog('#ModuleSearchResult已找到');

            // 配置观察选项
            const config = {
                attributes: false, // 观察属性变化
                childList: true, // 观察子节点变化
                subtree: false, // 观察所有后代节点
                characterData: false // 观察文本内容变化
            };

            // 开始观察
            observer.observe(gridTable, config);

            // 可以在这里添加元素首次加载完成后的处理逻辑
        } else {
            // 如果元素还没有加载，等待100ms后再次检查
            setTimeout(waitForElement, 100);
        }
    };

    // 启动监控
    waitForElement();

    // 清理函数（可选）
    function cleanup() {
        observer.disconnect();
    }

    // 页面卸载时清理
    window.addEventListener('unload', cleanup);
})();