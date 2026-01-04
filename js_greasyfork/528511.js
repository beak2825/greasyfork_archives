// ==UserScript==
// @name         Course selection in Wust必修课候补版
// @namespace    https://greasyfork.org/scripts/528511/
// @version      2.1
// @description  This UserScript is designed to automate the course selection process at Wust (Wuhan University of Science and Technology). It provides an automated solution for students to navigate through different course selection pages and select courses more efficiently. For detailed usage instructions, please visit: https://294520.xyz/2025/03/01/course-selection-in-wust%e5%80%99%e8%a1%a5%e7%89%88%e6%8f%92%e4%bb%b6%e4%bd%bf%e7%94%a8%e6%95%99%e7%a8%8b/
// @author       carter
// @match        https://bkjx.wust.edu.cn/jsxsd/xsxkkc/comeInBxxk*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/528511/Course%20selection%20in%20Wust%E5%BF%85%E4%BF%AE%E8%AF%BE%E5%80%99%E8%A1%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/528511/Course%20selection%20in%20Wust%E5%BF%85%E4%BF%AE%E8%AF%BE%E5%80%99%E8%A1%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Course selection in Wust必修课候补版已启动");

    // 重写 window.confirm，使其始终返回 true，自动确认所有提示
    window.confirm = () => true;

    // ------------------ 配置项 ------------------
    var config = {
        // 表单中需要填写的字段及对应值
        fields: {
            kch: '', // 课程代码
            kcmc: '', // 课程名称
            hbmc: '教学班1844',// 合班名称（如：教学班1844）
            skxq: '',// 星期（例如：'1' 表示星期一，根据需要修改）
            skjc: ''// 上课节次（例如：'1-2-' 表示第1-2节，根据需要修改）
        },
        // 用于判断查询结果中是否出现目标信息的关键词
        targetKeyword: '教学班1844',
        // 要自动勾选的复选框 id 数组（限选条件）
        checkboxes: ['sfym'],
        // 修改这个值可以调整查询频率（毫秒）
        queryDelay: 100
    };
    // ------------------ 配置结束 ------------------

    // 填充表单数据
    function fillField(data) {
        Object.keys(data).forEach(function(key) {
            var elem = document.getElementById(key);
            if (elem) {
                elem.value = data[key];
                console.log("填充 " + key + " = " + data[key]);
            } else {
                console.warn("未找到 id 为 " + key + " 的元素");
            }
        });
    }

    // 勾选指定的复选框（根据 id）
    function checkCheckboxes(ids) {
        ids.forEach(function(id) {
            var checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = true;
                console.log("勾选 " + id);
            } else {
                console.warn("未找到 id 为 " + id + " 的复选框");
            }
        });
    }

    // 检查结果表中是否存在目标关键词
    function resultContainsTarget() {
        var table = document.getElementById('dataView');
        if (!table) {
            console.error("未找到结果表（id 为 dataView）");
            return false;
        }
        var rows = table.getElementsByTagName('tr');
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].innerText.indexOf(config.targetKeyword) !== -1) {
                console.log("找到目标关键词：" + config.targetKeyword);
                return true;
            }
        }
        console.log("结果中未找到目标关键词：" + config.targetKeyword);
        return false;
    }

    // 自动点击选课按钮
    async function clickSelectionButton() {
        console.log("等待选课按钮加载...");
        const btn = await waitForElement("div[id^='div_'] a");
        if (btn) {
            console.log("自动点击选课按钮");
            btn.click();
        } else {
            console.error("未找到选课按钮");
        }
    }

    // 主循环：点击查询并检查结果，直到找到目标关键词为止
    async function mainLoop() {
        console.log("开始查询...");
        if (clickQueryButton()) {
            await waitForTableUpdate();
            if (resultContainsTarget()) {
                console.log("目标信息已找到，结束查询循环");
                await clickSelectionButton();
            } else {
                console.log("未找到目标信息，等待后继续查询...");
                setTimeout(mainLoop, config.queryDelay);
            }
        } else {
            console.error("无法执行查询，检查页面元素是否正确");
        }
    }

    // 初始化函数
    function init() {
        console.log("等待表单框和关键元素加载...");
        waitForElement('input#kch').then(() => {
            console.log("表单框加载完成，开始初始化");
            fillField(config.fields);
            checkCheckboxes(config.checkboxes);
            mainLoop();
        });
    }

    // 启动初始化
    init();

    // 等待元素加载的Promise版本
    function waitForElement(selector) {
        return new Promise((resolve) => {
            // 如果元素已存在，直接返回
            const element = document.querySelector(selector);
            if (element) {
                return resolve(element);
            }

            // 创建观察器监听DOM变化
            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            // 开始观察DOM变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 设置一个安全超时
            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, 10000); // 10秒超时
        });
    }

    // 模拟点击查询按钮
    function clickQueryButton() {
        var btn = document.querySelector('input.el-button[value="查 询"]');
        if (btn) {
            btn.click();
            console.log("点击查询按钮");
            return true;
        } else {
            console.error("未找到查询按钮");
            return false;
        }
    }

    // 等待表格加载完成
    function waitForTableUpdate() {
        return new Promise((resolve) => {
            // 创建观察器监听表格内容变化
            const observer = new MutationObserver((mutations) => {
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 100);
            });

            // 获取表格元素
            const table = document.getElementById('dataView');
            if (!table) {
                resolve();
                return;
            }

            // 开始观察表格变化
            observer.observe(table, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // 设置一个安全超时
            setTimeout(() => {
                observer.disconnect();
                resolve();
            }, 2000); // 2秒超时
        });
    }
})();