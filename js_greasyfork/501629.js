// ==UserScript==
// @name         简易赛事计时器
// @namespace    http://xiezheyuan.github.io/
// @version      0.6
// @description  在页面左下角添加计时器
// @author       xiezheyuan
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501629/%E7%AE%80%E6%98%93%E8%B5%9B%E4%BA%8B%E8%AE%A1%E6%97%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501629/%E7%AE%80%E6%98%93%E8%B5%9B%E4%BA%8B%E8%AE%A1%E6%97%B6%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let countdown_config = {
        dates: [
            { id: "countdown-to-noip", date: "2024-11-30T08:00:00Z", text: "NOIP 2024" },
            { id: "countdown-to-hnoi", date: "2025-03-01T08:00:00Z", text: "HNOI 2025" },
        ],
        urls: [
            { keyword: ["zhihu"], text: "知乎", verb: "刷" },
            { keyword: ["bilibili"], text: "B站", verb: "刷" },
            { keyword: ["tieba"], text: "贴吧", verb: "看" },
            { keyword: ["generals"], text: "Gen", verb: "打" },
            { keyword: ["florr"], text: "Florr", verb: "玩" }
        ],
        suggest: { url: "https://www.luogu.com.cn/", text: "洛谷" }
    }

    let countdown_dates = countdown_config.dates;
    let countdown_urls = countdown_config.urls;
    let countdown_suggest_url = countdown_config.suggest;
    const time2str = (countDownDate, now) => {
        let distance = countDownDate - now - 8 * 60 * 60 * 1000;
        if (distance < 0) {
            return "已经开始";
        }
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        return days + "天 " + hours + "小时 " + minutes + "分钟 " + seconds + "秒 ";
    }
    const short_time2str = (countDownDate, now) => {
        let distance = countDownDate - now - 8 * 60 * 60 * 1000;
        if (distance < 0) {
            return "（好吧，已经过了）";
        }
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        return days + "天";
    }
    const init = () => {
        let sticky = document.createElement("div");
        sticky.id = "sticky-countdown";
        sticky.style.position = "fixed";
        sticky.style.bottom = "10px";
        sticky.style.left = "10px";
        sticky.style.backgroundColor = "rgba(240, 240, 240, 0.6)";
        sticky.style.padding = "10px";
        sticky.style.borderRadius = "3px";
        sticky.style.zIndex = "999";
        sticky.style.display = "flex";
        sticky.style.flexDirection = "column";
        sticky.style.gap = "5px";
        sticky.style.color = "#333";
        countdown_dates = countdown_dates.filter((date) => {
            const time = new Date(date.date).getTime() - 8 * 60 * 60 * 1000;
            return time - new Date().getTime() > 0;
        });
        for (let i = 0; i < countdown_dates.length; i++) {
            const display = i == 0 ? "flex" : "none";
            sticky.innerHTML += `<div id="${countdown_dates[i].id}-div" style="display: ${display}; align-items: center; gap: 5px;">距离 <b>${countdown_dates[i].text}</b> 还剩下<b id="${countdown_dates[i].id}">Loading</b></div>`;
        }
        document.body.appendChild(sticky);
        let isMouseOver = false;
        let timeoutId;
        sticky.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            isMouseOver = true;
            timeoutId = setTimeout(() => {
                if (isMouseOver) {
                    for (let i = 1; i < countdown_dates.length; i++) {
                        document.getElementById(countdown_dates[i].id + "-div").style.display = "flex";
                    }
                }
            }, 100);
        });
        let flag = false;
        for (let i = 0; i < countdown_urls.length; i++) {
            for (let j = 0; j < countdown_urls[i].keyword.length; j++) {
                if (location.href.indexOf(countdown_urls[i].keyword[j]) != -1) {
                    let msg = "";
                    const now = new Date().getTime();
                    for (let k = 0; k < countdown_dates.length; k++) {
                        msg += `距离${countdown_dates[k].text}还剩下${short_time2str(new Date(countdown_dates[k].date).getTime(), now)}。\n`
                    }
                    msg += `时间如此紧迫，怎么还可以${countdown_urls[i].verb}${countdown_urls[i].text}！\n`
                    msg += `继续${countdown_urls[i].verb}${countdown_urls[i].text}请选择【确定】。\n跳转到${countdown_suggest_url.text}请选择【取消】。`
                    if (!confirm(msg)) {
                        location.href = countdown_suggest_url.url;
                    }
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
        sticky.addEventListener('mouseleave', () => {
            isMouseOver = false;
            timeoutId = setTimeout(() => {
                if (!isMouseOver) {
                    for (let i = 1; i < countdown_dates.length; i++) {
                        document.getElementById(countdown_dates[i].id + "-div").style.display = "none";
                    }
                }
            }, 100);
        });
        const interval = () => {
            const now = new Date().getTime();
            for (let i = 0; i < countdown_dates.length; i++) {
                let countDownDate = new Date(countdown_dates[i].date).getTime();
                document.getElementById(countdown_dates[i].id).textContent = time2str(countDownDate, now);
            }
        };
        interval();
        setInterval(interval, 1000);
    };
    if(!(window.frames.length != parent.frames.length)) init();
})();