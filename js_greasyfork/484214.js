// ==UserScript==
// @name         ME Frp 镜缘映射 自动签到
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  自动签到
// @author       WindOfCast
// @match        https://www.mefrp.com/dashboard/home
// @icon         data:image/png;base64,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
// @grant        GM_getValue
// @grant        GM_setValue
// @homepage     https://gitee.com/windofcast/
// @website      https://space.bilibili.com/367207503
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/484214/ME%20Frp%20%E9%95%9C%E7%BC%98%E6%98%A0%E5%B0%84%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484214/ME%20Frp%20%E9%95%9C%E7%BC%98%E6%98%A0%E5%B0%84%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
/**
 * @since 0.2 添加剩余时间查看
 * @since 0.3 修复剩余时间查看
 * @since 0.4 将长时间间隔缩分片
 * @since 0.5 更新新版界面按钮验证判断
 * @since 0.6 更新新版界面按钮验证判断, 加大载入时间间隔至6s
 * @since 0.7 添加签到后确认动作
 * @since 0.8 新版界面签到
 */
(function () {
    'use strict';

    // Your code here...
    const common = (function () {
        class Common {
            #nextTimeKey = "me_frp_next_time";

            constructor() {
            }

            getValue(name, value = null) {
                let storageValue = value;
                if (typeof GM_getValue === 'function') {
                    storageValue = GM_getValue(name, value)
                } else {
                    let o = window.localStorage.getItem(name);
                    if (o != null) {
                        storageValue = o;
                    }
                }
                return storageValue;
            }

            setValue(name, value) {
                if (typeof GM_setValue === 'function') {
                    GM_setValue(name, value)
                } else {
                    window.localStorage.setItem(name, value)
                }
            }

            click() {
                document.querySelector('.n-button--primary-type')?.click();
            }

            buttonCheck() {
                return !document.querySelector('.n-button--primary-type').hasAttribute('disabled');
            }

            getNextTime() {
                return this.getValue(this.#nextTimeKey);
            }

            setNextTime() {
                // let now = new Date();
                // now.setDate(now.getDate() + 1);
                this.setValue(this.#nextTimeKey, Date.now() + 86_400_000);
            }

            showNextTime(nextTime) {
                let currentTime = Math.floor(Date.now());
                let timeDifference = (nextTime - currentTime) / 1000;

                let hours = Math.floor(timeDifference / (60 * 60)); // 计算剩余小时数
                let minutes = Math.floor((timeDifference % (60 * 60)) / 60); // 计算剩余分钟数
                let seconds = Math.floor(timeDifference % 60); // 计算剩余秒数
                console.log(`${hours}小时 ${minutes}分钟 ${seconds}秒`)
            }

            run() {
                if (this.buttonCheck()) {
                    this.click();
                    this.setNextTime();
                    location.reload();
                    return;
                }
                let nextTime = this.getNextTime() || 0;
                this.showNextTime(nextTime);
                if (nextTime == null && !this.buttonCheck()) {
                    setTimeout(() => {
                        location.reload();
                    }, 30 * 60 * 1000);
                } else if (Date.now() < nextTime) {
                    let time = nextTime - Date.now();
                    if (time > 2 * 60 * 60 * 1000) {
                        time = 7_200_000;
                        console.log("等待间隔过长，刷新间隔已调整为2小时");
                    }
                    setTimeout(() => {
                        location.reload();
                    }, time);
                } else {
                    this.click();
                    this.setNextTime();
                }
            }
        }

        let common = null;
        return (function () {
            if (!common) {
                common = new Common();
            }
            return common;
        })();
    })();

    window.addEventListener("load", (event) => {
        setTimeout(() => {
            console.log("[ME Frp 镜缘映射 自动签到]: 已加载!");
            common.run()
        }, 6000);
    })
})();