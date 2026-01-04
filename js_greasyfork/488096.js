// ==UserScript==
// @name         boss一键沟通
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/*
// @icon         https://static.zhipin.com/v2/web/geek/images/logo.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/488096/boss%E4%B8%80%E9%94%AE%E6%B2%9F%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/488096/boss%E4%B8%80%E9%94%AE%E6%B2%9F%E9%80%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dayjs = window.dayjs;

    class Store {
        constructor() {
            this.store = {
                name: "BossOk",
                jobListReqs: [],
                jobMap: {},
            };
        }
        set(key, value) {
            this.store[key] = value;
        }
        get(key) {
            return this.store[key];
        }
        bgColor(diffday) {
            if (diffday > 90) return "transparent";
            if (diffday > 30) return "#e8f7d8";
            if (diffday > 7) return "#f7e4d8";
            return "#f7d8d8";
        }
    }

    const store = new Store();

    function log(message) {
        console.log(`[${store.get("name")}]`, message);
    }

    function onFetchJoblist(data) {
        log(data);
        const jobList = data?.zpData?.jobList;
        const jobMap = jobList.reduce((acc, cur) => {
            acc[cur.encryptJobId] = cur;
            return acc;
        }, store.get("jobMap") || {});
        store.set("jobMap", jobMap);

        const $a = document.querySelectorAll("a[href]");
        $a.forEach((dom) => {
            const href = dom.getAttribute("href");
            const jobId = href.match(/job_detail\/(.*?)\.html/)?.[1];
            if (!jobId) return;
            // 已经添加过的不再添加
            const attrKey = store.get("name").toLowerCase();
            if (dom.parentNode.querySelector(`[${attrKey}]`)){return;}
            const job = jobMap[jobId];
            if (!job) return;
            const { lastModifyTime } = job;
            const infodom = document.createElement("div");
            const diffday = -dayjs(lastModifyTime).diff(dayjs(), "day");
            infodom.innerHTML = `📅 最后更新日期：${dayjs(lastModifyTime).format(
                "YYYY-MM-DD"
            )} (${diffday}天前)`;
            infodom.style = `padding: 10px;background: ${store.bgColor(diffday)};`;
            infodom.setAttribute(attrKey, jobId);
            dom.parentNode.appendChild(infodom);
        });
    }

    function updateJoblistReqs() {
        const urls = window.performance
        .getEntries()
        .filter((item) => item.name.includes("joblist.json?"))
        ?.map((item) => item.name);
        store.set("jobListReqs", urls);
        return urls;
    }


    function update () {
        const now_urls = updateJoblistReqs();
        // 当客户端发起新请求时
        if (now_urls[now_urls.length - 1] != now_urls[now_urls.length - 2]) {
            const url = now_urls[now_urls.length - 1];
            window.fetch(url).then((res) => {
                res.json().then((data) => {
                    onFetchJoblist(data);
                    setTimeout(() => {
                        update();
                    }, 5000);
                });
            });
        } else {
            setTimeout(() => {
                update();
            }, 3000);
        }
    }

    update()

    // Your code here...
    // 定义一个等待函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // 创建一个容器
    let container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.right = '10px';
    container.style.zIndex = '10000';
    document.body.appendChild(container);


    // 创建一键沟通按钮
    let communicateBtn = document.createElement('button');
    communicateBtn.textContent = '一键沟通';
    container.appendChild(communicateBtn);



    communicateBtn.addEventListener('click', function() {
        // 获取所有具有 "start-chat-btn" 类的元素
        var buttons = document.getElementsByClassName("start-chat-btn");

        // 定义一个函数，用于执行延迟点击
        async function delayedClick(index) {
            if (index >= buttons.length) {
                console.log("所有按钮点击完成");
                 alert('执行完毕');
                return; // 如果所有按钮都已经被点击，就退出函数
            }
            if( buttons[index].innerText==="继续沟通"){
                console.log("已沟通")
            }else{
                // 触发点击
                let match_day = document.getElementsByClassName("job-card-body clearfix")[index].children[2].innerText.match(/(\d+)天前/)
                let daysAgo = match_day ? parseInt(match_day[1], 10) : null;
                if(daysAgo <= 7){
                    buttons[index].click();
                    //console.log(document.getElementsByClassName("job-card-body clearfix")[index].children[2].innerText)
                    console.log("按钮 " + index + " 被点击");
                    await wait(2000)
                    document.querySelector("body > div.greet-boss-dialog > div.greet-boss-container > div.greet-boss-footer > a.default-btn.cancel-btn").click()
                }else{
                    console.log("发布日期过长")
                }

            }

            await wait(getRandomInteger(300, 2000))
            // 设置下一个点击的延迟
            setTimeout(function() {
                delayedClick(index + 1);
            }, 1000); // 这里设置的延迟是1000毫秒（1秒）
        }

        // 开始遍历并延迟点击每个按钮
        delayedClick(0);


    });



})();