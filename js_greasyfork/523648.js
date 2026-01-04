// ==UserScript==
// @name         师学通，1号脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/师学通，1号脚本
// @version      1.0.3
// @description  师学通，课程页面自动化完成课程，可配合学习页面脚本。仅适用规则pn202413060
// @author       ZouYS
// @match        https://pn202413060.stu.teacher.com.cn/studyPlan/intoStudentStudy*
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/523648/%E5%B8%88%E5%AD%A6%E9%80%9A%EF%BC%8C1%E5%8F%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523648/%E5%B8%88%E5%AD%A6%E9%80%9A%EF%BC%8C1%E5%8F%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const catalogSelector = ".con ul li"

    window.onload = async function () {
        let myStyle = document.createElement('style')
        myStyle.innerHTML = style;
        document.head.appendChild(myStyle);
        /*let intercept=GM_GetValue*/
        let div = document.createElement('div');
        div.innerHTML = `<div style="left: 0;top: 300px;" id="my1" class="button-3" >即刻开刷</div>`
        document.body.appendChild(div);
        let isClick = false;
        let my1 = document.getElementById('my1')
        my1.addEventListener("click", async () => {
            isClick = !isClick;
            try {
                if (isClick) {
                    my1.innerText = "自动刷课中..."
                    runTask()
                    await autoStudy()
                }
            } finally {
                my1.innerText = "点击开刷"
            }
        })
    }
    let isRunning = true; // 任务是否正在运行
    // 长时间运行的任务
    function runTask() {
        if (!isRunning) return;

        // 执行任务
        console.log("任务执行中...");

        // 递归调用
        setTimeout(runTask, 1000 * 60); // 每分钟执行一次
    }
    const autoStudy = async function () {
        const catalogList = document.querySelectorAll(catalogSelector);
        if (catalogList.length > 0) {
            for (let element of Array.from(catalogList)) {
                console.log(`==============${element.querySelector('a').innerText}==============`)
                await sleep(2);
                if (element) {
                    const flag = checkStatus(element)
                    switch (flag) {
                        case 0://完成
                            console.log("已完成")
                            break;
                        case 1://未完成
                            console.log("未完成...")
                            const url = getLink(element);
                            if (!url) {
                                console.log('未找到任务链接');
                                continue;
                            }

                            // 打开页面并等待任务完成
                            let taskResult = await openAndWaitForTask(url);
                            while (taskResult === 1) { // 如果需要重新打开页面
                                console.log("需要重新打开页面");
                                taskResult = await openAndWaitForTask(url); // 重新打开页面并等待任务完成
                            }

                            if (taskResult === 0) {
                                console.log("任务已完成");
                            } else if (taskResult === 2) {
                                console.log("任务超时");
                            }

                            break;
                    }
                }
            }
        }
    }
    /**
     * 打开页面并等待任务完成
     * @param {string} url - 页面 URL
     * @returns {Promise<number>} - 0: 任务完成, 1: 需要重新打开页面, 2: 任务超时
     */
    async function openAndWaitForTask(url) {
        const newWindow = window.open(url);
        if (!newWindow) {
            console.log('无法打开新页面');
            return 2; // 视为超时
        }

        try {
            return await waitForTaskCompletion(); // 返回任务结果
        } catch (e) {
            console.error("等待任务完成时发生错误：", e);
            return 2; // 视为超时
        } finally {
            // 关闭新页面
            setTimeout(() => {
                if (newWindow) {
                    newWindow.close();
                }
            }, 3000);
        }
    }
    // 等待任务完成
    function waitForTaskCompletion() {
        return new Promise((resolve) => {

            const channel = new BroadcastChannel('my-channel');

            channel.onmessage = (event) => {
                if (event.data === 'finish') {
                    resolve(0);
                }else if(event.data === 'again'){
                    resolve(1);
                }
            };
            console.log("等待当前章节完成.......")
        });
    }
    /**
     * 检测章节是否完成
     * @param ele
     * @returns {number} 0 完成   1 未完成
     */
    const checkStatus = function (ele) {
        const finishEle = ele.querySelectorAll('i')[1]
        if (finishEle.innerText === "已完成") {
            return 0;
        }
        return 1;
    }
    const getLink=function (ele) {
        const aEle = ele.querySelectorAll('a')[0];
        const url = aEle.getAttribute('href');
        if (!url) {
            throw Error("can‘t get url:"+url)
        }
        return url;
    }
    const finish = function () {
        if (Swal) {
            Swal.fire({
                title: "刷课成功！",
                text: `学习时间已达到最大值`,
                icon: 'success',
                // showCancelButton: true,
                confirmButtonColor: "#FF4DAFFF",
                // cancelButtonText: "取消，等会刷新",
                confirmButtonText: "点击关闭页面",
            }).then((result) => {
                if (result.isConfirmed) {
                    // 尝试关闭当前页面
                    try {
                        window.close(); // 关闭当前页面
                    } catch (error) {
                        console.error("无法直接关闭页面：", error);
                        // 如果无法直接关闭页面，提示用户手动关闭
                        Swal.fire({
                            title: "无法自动关闭页面",
                            text: "请手动关闭此页面。",
                            icon: 'warning',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        });
                    }
                }
            });
        }
    }


    /**
     * 睡眠
     * @param time
     * @returns {Promise<unknown>}
     */
    const sleep = function (time) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }
    //样式
    let style = `.button-3 {
              position: fixed;  
              appearance: none;
              background-color: #e52b13;
              border: 1px solid rgba(27, 31, 35, .15);
              border-radius: 6px;
              box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
              box-sizing: border-box;
              color: #ffffff;
              cursor: pointer;
              display: inline-block;
              font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
              font-size: 14px;
              font-weight: 600;
              line-height: 20px;
              padding: 6px 16px;
              left: 20px;
              top: 300px;
              text-align: center;
              text-decoration: none;
              user-select: none;
              -webkit-user-select: none;
              touch-action: manipulation;
              vertical-align: middle;
              white-space: nowrap;
            }
  
            .button-3:focus:not(:focus-visible):not(.focus-visible) {
              box-shadow: none;
              outline: none;
            }
  
            .button-3:hover {
              background-color: #2c974b;
            }
  
            .button-3:focus {
              box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
              outline: none;
            }
  
            .button-3:disabled {
              background-color: #94d3a2;
              border-color: rgba(27, 31, 35, .1);
              color: rgba(255, 255, 255, .8);
              cursor: default;
            }
  
            .button-3:active {
              background-color: #298e46;
              box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
            }`
})();