// ==UserScript==
// @name         PT签到+首页喊魔力(安全优化版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @author       40
// @description  安全优化的PT签到脚本，修复XSS风险，增强稳定性
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAAXNSR0IArs4c6QAAAbxJREFUWEftlz1IQlEUx/9Xn4hBRGNNBdXQh0a1RIsRfdDmUCQ0CAUt0ahCi0sNrrUEDm4NDQ8iomiwIWjRIKmlpaYc4xVU0vPduI8EET/O1ScOvTs+/uec3/ufc97lMRCPqhspgD8FFOcWMQSqXjgC2FBAccxSYhhFJDSqbnAA19TEfzEpAP6A4iDVIYn+L4w3oq05GHY4x3S1tsX2OvHyXEAy8UntLEKbHejrdyK2+1ErJsO5cZaNd8eYL6xtg+GgXoUWwpilGeOrzBfR0gAm2w3DOc8KGLEldY+wPPdawOV5vq62KFhcdqOn10luLRmGTNCE0IapZp7tjO3MxJQLd+kf8n61bGZWgh6MjCo4Vb/JQC2BKYI8Pug4Of5qnzONgpj3E/U6EJbPL7lxdZGHeONKpxkQKZiBQQXrIY/JIKwvB2oWRApGiIU7omg5kBUg0jCVgIbHXCak7LBWajN5ZkqDSx0Sz60AaciZIpQAmltwI5czpNa31p435Az5wyEptGHsW1tyZMB8Ue0GHDOygVbrGcMt84bfNxjjCauTy+bjQND88R+PvvkBx36t31vZ5BL6DDiS9/Guw1/5Ifek+Vvu+AAAAABJRU5ErkJggg==
// @include      https://*/*
// @downloadURL https://update.greasyfork.org/scripts/537515/PT%E7%AD%BE%E5%88%B0%2B%E9%A6%96%E9%A1%B5%E5%96%8A%E9%AD%94%E5%8A%9B%28%E5%AE%89%E5%85%A8%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537515/PT%E7%AD%BE%E5%88%B0%2B%E9%A6%96%E9%A1%B5%E5%96%8A%E9%AD%94%E5%8A%9B%28%E5%AE%89%E5%85%A8%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 安全工具函数
    const utils = {
        escapeXPath: (str) => str.replace(/["'\\]/g, '\\$&'),
        log: (msg) => console.log(`[PT签到插件] ${new Date().toISOString()} ${msg}`),
        error: (msg) => console.error(`[PT签到插件] ERROR: ${msg}`)
    };

    // 配置数据
    const CONFIG = {
        attendance: {
            texts: [
                "签到得魔力", "簽到得魔力", "签到领魔力", "簽到领魔力",
                "签到赚魔力", "簽到赚魔力", "签到得猫粮", "簽到得猫粮",
                "签到得杏仁", "簽到得杏仁", "签到得冰晶", "簽到得冰晶",
                "签到得爆米花", "簽到得爆米花", "签 到", "簽 到",
                "签到", "簽到", "每日签到", "每日簽到", "每日打卡",
                "签到得G值", "签到得音浪", "签到金元宝", "签到得金魂币",
                "签到得星焱", "簽到得G值", "簽到得音浪", "簽到金元宝",
                "簽到得金魂币", "簽到得星焱", "签到得电力", "簽到得电力",
                "签到得金币", "簽到得金币", "签到得鲸币", "簽到得鲸币"
            ],
            delay: 12000
        },
        moli: {
            sites: [
                {
                    host: "ptvicomo.net",
                    inputId: "shbox_text",
                    submitId: "hbsubmit",
                    messages: ["小象求象草"]
                },
                {
                    host: "cyanbug.net",
                    inputId: "shbox_text",
                    submitId: "hbsubmit",
                    messages: ["青虫娘 求魔力", "青虫娘 求上传", "青虫娘 求VIP", "青虫娘 求彩虹ID"]
                },
            ],
            delay: 500,
            interval: 3000
        }
    };

    // 核心功能
    class PTAutoSign {
        constructor() {
            this.host = window.location.host;
            this.href = window.location.href;
            this.today = this.formatDate(new Date());
            this.attendanceKey = `${this.host}_ATTENDANCE_DAY`;
            this.moliKey = `${this.host}_MOLI_DAY`;
        }

        formatDate(date) {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD
        }

        safeXPath(query) {
            return document.evaluate(
                query,
                document,
                null,
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                null
            );
        }

        async handleAttendance() {
            const lastDay = GM_getValue(this.attendanceKey, "");
            if (lastDay === this.today) {
                utils.log(`[${this.host}] 今日已签到`);
                return;
            }

            for (const text of CONFIG.attendance.texts) {
                try {
                    const query = `//*[contains(text(), "${utils.escapeXPath(text)}")]`;
                    const elements = this.safeXPath(query);

                    for (let i = 0; i < elements.snapshotLength; i++) {
                        const element = elements.snapshotItem(i);
                        if (!element) continue;

                        const elementText = element.textContent || element.innerText;
                        if (elementText.includes("已") || elementText.includes("详情")) {
                            GM_setValue(this.attendanceKey, this.today);
                            utils.log(`[${this.host}] 已签到标记更新`);
                            return;
                        }

                        if (elementText.includes(text)) {
                            if (this.host.includes("ourbits") && !this.href.includes("attendance.php")) {
                                setTimeout(() => {
                                    element.click();
                                    GM_setValue(this.attendanceKey, this.today);
                                    utils.log(`[${this.host}] 延迟签到成功`);
                                }, 5000);
                            } else {
                                element.click();
                                GM_setValue(this.attendanceKey, this.today);
                                utils.log(`[${this.host}] 立即签到成功`);
                            }
                            return;
                        }
                    }
                } catch (error) {
                    utils.error(`签到处理失败: ${error}`);
                }
            }
        }

        async handleMoliRequest() {
            const lastDay = GM_getValue(this.moliKey, "");
            if (lastDay === this.today) {
                utils.log(`[${this.host}] 今日已请求魔力`);
                return;
            }

            const siteConfig = CONFIG.moli.sites.find(s => this.host.includes(s.host));
            if (!siteConfig) return;

            try {
                const input = document.getElementById(siteConfig.inputId);
                const submit = document.getElementById(siteConfig.submitId);
                if (!input || !submit) return;

                siteConfig.messages.forEach((msg, index) => {
                    setTimeout(() => {
                        try {
                            input.value = msg;
                            submit.click();
                            utils.log(`[${this.host}] 魔力请求: ${msg}`);
                            if (index === siteConfig.messages.length - 1) {
                                GM_setValue(this.moliKey, this.today);
                            }
                        } catch (error) {
                            utils.error(`魔力请求失败: ${error}`);
                        }
                    }, CONFIG.moli.interval * index);
                });
            } catch (error) {
                utils.error(`魔力处理失败: ${error}`);
            }
        }

        init() {
            setTimeout(() => this.handleAttendance(), CONFIG.attendance.delay);
            setTimeout(() => this.handleMoliRequest(), CONFIG.moli.delay);
        }
    }

    new PTAutoSign().init();
})();