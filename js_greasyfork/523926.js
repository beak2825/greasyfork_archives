// ==UserScript==
// @name         师学通，3号脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/师学通_3
// @version      1.0.0
// @description  师学通，学习页面自动化完成课程。仅适用规则pn202413060。适配另一种页面
// @author       ZouYS
// @match        https://pn202413060.stu.teacher.com.cn/course/intoSelectCourseUrlVideo*
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/523926/%E5%B8%88%E5%AD%A6%E9%80%9A%EF%BC%8C3%E5%8F%B7%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523926/%E5%B8%88%E5%AD%A6%E9%80%9A%EF%BC%8C3%E5%8F%B7%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const onlyTime=true


    window.onload = async function () {
        setTimeout(()=>{
            unsafeWindow.console.clear = function () {
                console.log("清空控制台已被禁用");
            };
        },5000)
        console.log(`==============3号脚本==============`)
        handleValidateCodeDialog()
        setInterval(()=>{
            const isFinish=validateFinish()
            if(isFinish){
                finish()
            }else {
                console.log(new Date())
                console.log("仍未完成...")
            }
        },1000*60)
        // handleAutoNextDialog()
        // clearPauseHandler()
        // await autoStudy()
    }
    /**
     * 挂机弹窗验证处理
     * 每2s检查窗口
     */

    const handleValidateCodeDialog = function (timeout=5000) {
        let intervalId = null; // 定时器 ID
        const checkInterHandle = async () => {
            const dialogSelector = ".layui-layer";
            const codeValID = "codespan";
            const codeInputID = "code";
            const submitSelector = ".layui-layer-btn0";

            try {
                // 获取验证码显示元素和输入框
                const val = document.getElementById(codeValID);
                const input = document.getElementById(codeInputID);
                const subBtn = document.querySelector(submitSelector);

                // 如果验证码弹窗存在
                if (val && input && subBtn) {
                    console.log("检测到验证码弹窗，自动填写并提交...");

                    // 清除定时器
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }

                    // 填写验证码
                    await sleep(3); // 等待 3 秒
                    input.value = val.innerText;

                    // 点击提交按钮
                    await sleep(3); // 等待 3 秒
                    subBtn.click();
                    console.log("验证码已自动提交");

                    // 重新设置定时器
                    intervalId = setInterval(checkInterHandle, timeout);
                }
            } catch (e) {
                console.error("异步检测挂机验证错误：" + e);

                // 发生错误时重新设置定时器
                if (!intervalId) {
                    intervalId = setInterval(checkInterHandle, timeout);
                }
            }
        };

        // 初始化定时器
        intervalId = setInterval(checkInterHandle, timeout);
    };

    const handleAutoNextDialog = function () {
        const dialogSelector = ".layui-layer";
        const dialogTitle = ".layui-layer-title";
        const dialogBtn = ".layui-layer-btn0";
        setInterval(() => {
            try {
                // 获取验证码显示元素和输入框
                const title = document.querySelector(dialogTitle);
                const btn = document.querySelector(dialogBtn);
                // 如果验证码弹窗存在
                if (title && title.innerText==="信息" && btn && btn.innerText.includes("我知道了")) {
                    console.log("检测到阻止继续弹窗，自动点击...");
                    btn.click();
                }
            } catch (e) {
                console.error("阻止继续弹窗错误：" + e)
            }
        }, 5000)
    }
    const clearPauseHandler = function () {

        unsafeWindow.on_CCH5player_pause=function () {
            console.log("视频暂停了，计时继续...")
        }
        console.log(window.on_CCH5player_pause)
        /*video.addEventListener('pause', function (event) {
                                console.log('视频暂停事件触发');
                                // 阻止其他监听器的执行
                                event.stopImmediatePropagation();
                            },true);*/
    }
    const validateFinish=function (){
        const maxID="courseStudyBestMinutesNumber"
        const curID="courseStudyMinutesNumber"
        const max=document.getElementById(maxID);
        const cur=document.getElementById(curID);
        if(max && cur){
            const maxVal=Number(max.innerText);
            const curVal=Number(cur.innerText);
            console.log("最大学习时间：",maxVal)
            console.log("学习时间：",curVal)
            if(maxVal!==0 && curVal!==0 && maxVal<=curVal ){
                console.log("学习时间已到达最大！")
                return true
            }
        }
        return false;

    }
    const sendMsg=function (msg) {
        // 创建 BroadcastChannel
        const channel = new BroadcastChannel('my-channel');
        channel.postMessage(msg);
    }
    const finish=function (){
        sendMsg('finish')
        if (Swal) {
            Swal.fire({
                title: "刷课成功！",
                text: `学习时间已达到最大值`,
                icon: 'success',
                // showCancelButton: true,
                confirmButtonColor: "#FF4DAFFF",
                // cancelButtonText: "取消，等会刷新",
                confirmButtonText: "点击关闭页面，2s后自动关闭页面",
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
        setTimeout(()=>{
            window.close();
        },2000)

    }
    const refreshStudy=async function () {
        if (unsafeWindow.addStudyRecord) {
            console.log(new Date())
            console.log("调用接口，更新时间...")
            unsafeWindow.addStudyRecord('hand', 1)

        }else {
            const btnSelector = ".studyCourseTimeRefresh"
            const btn = document.querySelector(btnSelector);
            if (btn) {
                btn.click()
            }
        }

        await sleep(2);
        const isFinish = validateFinish();
        if (isFinish) {
            setTimeout(() => {
                finish()
            }, 5000)
            return isFinish;
        }
    }
    function getCatalogType(catalogEle) {
        const type = catalogEle.getAttribute("data-type")
        if (type) {
            if (type === "1" || type === "视频") {
                return 1
            } else if (type === "2" || type === "文档") {
                return 2
            }else if(type === "6" || type === "随堂小测"){
                return 6
            }
        } else {
            throw Error("no type get error！type：" + type)
        }
        return undefined;
    }
    /**
     * 获取视频节点
     * @param {string} videoNodeSelector - 视频元素选择器
     * @param {number} timeout - timeout
     * @returns {Promise<HTMLElement>}
     */
    const getStudyVideoNode = async function (videoNodeSelector, timeout = 10000) {
        return new Promise(async (resolve, reject) => {

            try {
                // 超时处理
                const timeoutId = setTimeout(() => {
                    console.error("获取视频节点超时");
                    clearInterval(internal); // 清除定时器
                    resolve(null); // 返回 null
                }, timeout);

                // 定期检查视频节点
                const internal = setInterval(() => {
                    try {
                        const videoNode = document.querySelector(videoNodeSelector);
                        if (videoNode && videoNode.readyState >= 3) {
                            console.log("video ready!");
                            clearTimeout(timeoutId); // 清除超时定时器
                            clearInterval(internal); // 清除检查定时器
                            resolve(videoNode); // 返回视频节点
                        } else {
                            console.log("未检查到 video，继续检查...");
                        }
                    } catch (error) {
                        console.error("检查视频节点时出错：", error);
                        clearTimeout(timeoutId); // 清除超时定时器
                        clearInterval(internal); // 清除检查定时器
                        resolve(null); // 返回 null
                    }
                }, 1000); // 每隔 1 秒检查一次
            } catch (error) {
                console.error("检查视频错误：", error);
                resolve(null); // 返回 null
            }
        })
    };
    /**
     *
     * @param catalogSelector
     * @param timeout
     * @returns {Promise<NodeList>}
     */
    const getCatalogNode = async function (catalogSelector, timeout = 10000) {
        return new Promise(async (resolve, reject) => {
            try {
                // 超时处理
                const timeoutId = setTimeout(() => {
                    console.error("获取章节节点超时");
                    clearInterval(internal); // 清除定时器
                    resolve(null); // 返回 null
                }, timeout);
                // 定期检查视频节点
                const internal = setInterval(() => {
                    try {
                        const catalogNode = document.querySelectorAll(catalogSelector);
                        if (catalogNode && catalogNode.length>0 ) {
                            console.log("catalogNode ready!");
                            clearTimeout(timeoutId); // 清除超时定时器
                            clearInterval(internal); // 清除检查定时器
                            resolve(catalogNode);
                        } else {
                            console.log("未检查到 catalogNode，继续检查...");
                        }
                    } catch (error) {
                        console.error("检查章节节点时出错：", error);
                        clearTimeout(timeoutId); // 清除超时定时器
                        clearInterval(internal); // 清除检查定时器
                        resolve(null); // 返回 null
                    }
                }, 1000); // 每隔 1 秒检查一次
            } catch (error) {
                console.error("检查章节错误：", error);
                resolve(null); // 返回 null
            }
        })
    };
    /**
     * 视频播放完毕的监听
     * @param video
     * @returns {Promise<unknown>}
     */
    function waitForVideoEnd(video) {
        return new Promise(resolve => {
            // 防止视频暂停
            const checkInterval = setInterval(() => {
                /*if (!(new Date() <= new Date('2025/1/11'))) {
                    video.pause()
                    return
                }*/
                // clearPauseHandler()
                try {
                    if (video && video.paused) {
                        console.log("视频暂停了，重新开始播放...");
                        video.play();
                    }
                }catch (e) {
                    console.error("checkInterval error:", e);
                    clearInterval(checkInterval);
                }
            }, 2000);
            //每三分钟手动更新时间
            /*const autoUpdateInterval = setInterval(async () => {
                try {
                    console.log("定时任务：更新时间...")
                    await refreshStudy()

                } catch (e) {
                    console.error("autoUpdateInterval error:", e);
                    clearInterval(autoUpdateInterval);
                }
            },1000*60*2)*/

            video.addEventListener('ended', () => {
                clearInterval(checkInterval);
                // clearInterval(autoUpdateInterval);
                const inter=setInterval(() => {
                    try {
                        const dialogTitle = ".layui-layer-title";
                        const dialogBtn = ".layui-layer-btn0";
                        // 获取验证码显示元素和输入框
                        const title = document.querySelector(dialogTitle);
                        const btn = document.querySelector(dialogBtn);
                        // 如果验证码弹窗存在
                        if (title && title.innerText==="信息" && btn && btn.innerText.includes("我知道了")) {
                            console.log("检测到阻止继续弹窗，自动点击...");
                            btn.click();
                            clearInterval(inter);
                            console.log("视频播放完成！")
                            resolve();
                        }
                    } catch (e) {
                        console.error("阻止继续弹窗错误：" + e)
                        clearInterval(inter);
                    }
                }, 2000)

            }, {once: true}); // 监听视频结束事件
        });
    }
    /**
     * 睡眠
     * @param time
     * @returns {Promise<unknown>}
     */
    const sleep = function (time) {
        return new Promise(resolve => setTimeout(resolve, time * 1000));
    }
    const autoStudy = async function () {
        let catalogList =await getCatalogNode(catalogSelector);
        if (catalogList) {
            catalogList = Array.from(catalogList);
            for (const element of catalogList) {
                if(onlyTime){
                    // const finish =await refreshStudy();
                    const finish = validateFinish();
                    if(finish){
                        break;
                    }

                }else {
                    await sleep(2)
                }

                console.log(`==============${element.title}==============`)
                element.click()
                const type = getCatalogType(element)
                let video;
                switch (type) {
                    // 视频
                    case 1:
                        console.log("type：视频")
                        video = await getStudyVideoNode(videoSelector);
                        if(video){
                            video.muted = true;
                            video.play();

                            /*setTimeout(()=>{
                                video.pause()
                            },60000)*/
                            await waitForVideoEnd(video)
                        }
                        break;

                    case 2:
                        console.log("type：文档")
                        await sleep(5)
                        break;
                    case 6:
                        console.log("type：随堂小测");
                        await sleep(5)
                        break;
                }
            }
            await sleep(2)
            const isFinish = validateFinish();
            //仍未完成
            if (!isFinish) {


                console.log("开始挂机，准备随机点击...");
                // 每 10 秒随机点击一个节点
                const intervalId = setInterval(async () => {
                    // 随机选择一个节点
                    const randomIndex = Math.floor(Math.random() * catalogList.length);
                    const randomNode = catalogList[randomIndex];
                    console.log(`随机点击节点：${randomNode.getAttribute('title')}`);

                    // 点击节点
                    randomNode.click();
                    // 等待一段时间（例如 2 秒），让页面更新
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    // 再次检查学习时间
                    const newFinish = validateFinish();
                    console.log("继续挂机...");
                    // 如果学习时间达到最大值，停止定时器
                    if (newFinish) {
                        clearInterval(intervalId);
                        console.log("学习时间已达到最大值，挂机完成！");
                        finish()
                        return 0;
                    }
                }, 1000*60*1.5);
            }

        }
    }
})();