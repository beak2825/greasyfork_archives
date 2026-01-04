// ==UserScript==
// @name         test——2025国家智慧教育平台寒假研修，可秒刷视频！适合中小学(基础教育、师范生免试认定) | 职业教育  | 高等教育
// @namespace    http://tampermonkey.net/zzzzzzys_国家中小学test——
// @version      1.0.4
// @description  适用2025国家智慧教育平台寒假研修.中小学课程，可快速通过视频学习。即秒刷！| 职业教育/高等教育 可自动挂机。欢迎加入QQ交流群，及时获取最新消息！请勿随意二次发布代码，尊重原创！
// @author       zzzzzzys
// @match        https://basic.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @match        https://test3.ykt.eduyun.cn/*
// @icon         https://basic.smartedu.cn/favicon.ico
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @connect      basic.smartedu.cn
// @connect      x-study-record-api.ykt.eduyun.cn
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/525208/test%E2%80%94%E2%80%942025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%EF%BC%8C%E5%8F%AF%E7%A7%92%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%81%E9%80%82%E5%90%88%E4%B8%AD%E5%B0%8F%E5%AD%A6%28%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E3%80%81%E5%B8%88%E8%8C%83%E7%94%9F%E5%85%8D%E8%AF%95%E8%AE%A4%E5%AE%9A%29%20%7C%20%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%20%20%7C%20%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/525208/test%E2%80%94%E2%80%942025%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AF%92%E5%81%87%E7%A0%94%E4%BF%AE%EF%BC%8C%E5%8F%AF%E7%A7%92%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%81%E9%80%82%E5%90%88%E4%B8%AD%E5%B0%8F%E5%AD%A6%28%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E3%80%81%E5%B8%88%E8%8C%83%E7%94%9F%E5%85%8D%E8%AF%95%E8%AE%A4%E5%AE%9A%29%20%7C%20%E8%81%8C%E4%B8%9A%E6%95%99%E8%82%B2%20%20%7C%20%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
/*****************************
 * 盗版可耻
 * 请尊重原创劳动成果！
 * 作者：zzzzzzys
 * https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
 * 搬运可耻
 ****************************/
(function () {
    'use strict';
    const qqGroup = [
        {customName:"群1",id: "570337037", link: "https://qm.qq.com/q/rDCbvTiV9K", isFull: true,priority:0},
        {customName:"群2",id: "618010974", link: "https://qm.qq.com/q/h854sxDvKa", isFull: false,priority:2},
        {customName:"群3",id: "1003884618", link: "https://qm.qq.com/q/kRcyAunAic", isFull: false,priority:1},
        {customName:"群4",id: "821240605", link: "https://qm.qq.com/q/z1ogtdhyGA", isFull: false,priority:2},
        {customName:"群5",id: "1013973135", link: "https://qm.qq.com/q/EpXA5Ar3vG", isFull: false,priority:2},
    ]
    let qqUrl = "https://qm.qq.com/q/rDCbvTiV9K"
    let qqNum = "570337037"
    let qqNum2 = "618010974"
    let qqUrl2 = "https://qm.qq.com/q/h854sxDvKa"
    let biliUrl = "https://b23.tv/x5pFcB0"
    // 保存原生 XMLHttpRequest 的引用
    const originalXHR = unsafeWindow.XMLHttpRequest;
    let fullDatas=null
    // 重写 XMLHttpRequest
    unsafeWindow.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // 重写 open 方法，记录请求信息
        xhr.open = function(method, url) {
            this._method = method;
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        // 重写 send 方法，监听响应
        xhr.send = function(body) {
            this.addEventListener('readystatechange', function() {
                if(this._url.includes("fulls.json")){
                    if (this.readyState === 4) { // 请求完成
                        console.log(body)
                        console.log('捕获到 XHR 请求结果:', {
                            url: this._url,
                            method: this._method,
                            status: this.status,
                            response: this.response
                        });
                        fullDatas=JSON.parse(this.response);
                    }
                }
            });
            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    // 预处理群组数据
    const renderQQGroups = () => {
        try {
            const activeGroups = qqGroup
                .filter(group => {
                    // 添加数据校验
                    if (!group.customName || !group.id) {
                        console.warn('Invalid group:', group);
                        return false;
                    }
                    return !group.isFull;
                })
                .sort((a, b) => a.priority - b.priority);

            // 添加空状态提示
            if (activeGroups.length === 0) {
                return `<div style="color: #ff9999; text-align:center; margin:12px 0">
              所有群组已开放，欢迎直接加入
            </div>`;
            }
            const title=`<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%);display: flex; align-items: center; gap:15px;">
                            <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" 
                                 style="height:36px; border-radius:6px;">
                            <div>
                                <div style="font-size:16px; font-weight:bold; margin-bottom:4px;">教师交流群(请优先选择未满群加入)</div>
                                <div style="font-size:12px; opacity:0.9;">获取实时支持 | 最新功能优先体验</div>
                            </div>
                        </div>`
            let content= title + activeGroups.map(group => `
                      <a href="${group.link}" 
                         target="_blank"
                         style="display: block; margin-top: 12px; padding: 10px;
                                background: rgba(255,255,255,0.2);
                                border-radius: 6px; text-align: center;
                                text-decoration: none; color: white !important;
                                transition: 0.3s; font-weight: 500;
                                cursor: pointer;"
                         aria-label="加入QQ群${group.customName}（群号：${group.id}）">
                        🎯 点击加入${group.customName}:${group.id} <!-- 移除群号显示 -->
                      </a>
                    `).join('');
            return `<div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%); padding:15px; border-radius:8px; color:white;">
                                    ${content}
                                </div>`
        } catch (error) {
            console.error('QQ群渲染错误:', error);
            return ''; // 静默失败
        }
    };
    const groupHtml = `<!-- 社群入口 -->
                    <div style="background: linear-gradient(135deg, #FF4DAF 0%, #FF6B6B 100%); padding:15px; border-radius:8px; color:white;">
                        <div style="display: flex; align-items: center; gap:15px;">
                            <img src="https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png" 
                                 style="height:36px; border-radius:6px;">
                            <div>
                                <div style="font-size:16px; font-weight:bold; margin-bottom:4px;">教师交流群(请优先选择未满群加入)</div>
                                <div style="font-size:12px; opacity:0.9;">获取实时支持 | 最新功能优先体验</div>
                            </div>
                        </div>
                        
                        <!-- QQ群 -->
                        <a href="${qqGroup[2].isFull ? 'javascript:void(0);' : qqGroup[2].link}" 
                           ${qqGroup[2].isFull ? '' : 'target="_blank"'} 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: ${qqGroup[2].isFull ? '#999' : 'rgba(255,255,255,0.2)'}; 
                                  border-radius:6px; text-align:center; 
                                  text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;
                                  cursor: ${qqGroup[2].isFull ? 'not-allowed' : 'pointer'};">
                            ${qqGroup[2].isFull ? '⛔ 群已满' : '🎯 点击加入QQ群3：' + qqGroup[2].id}
                        </a>
                        <!-- QQ群2 -->
                        <a href="${qqGroup[1].isFull ? 'javascript:void(0);' : qqGroup[1].link}" 
                           ${qqGroup[1].isFull ? '' : 'target="_blank"'} 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: ${qqGroup[1].isFull ? '#999' : 'rgba(255,255,255,0.2)'}; 
                                  border-radius:6px; text-align:center; 
                                  text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;
                                  cursor: ${qqGroup[1].isFull ? 'not-allowed' : 'pointer'};">
                            ${qqGroup[1].isFull ? '⛔ 群已满' : '🎯 点击加入QQ群2：' + qqGroup[1].id}
                        </a>
                        <!-- QQ群 -->
                        <a href="${qqGroup[3].isFull ? 'javascript:void(0);' : qqGroup[3].link}" 
                           ${qqGroup[3].isFull ? '' : 'target="_blank"'} 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: ${qqGroup[3].isFull ? '#999' : 'rgba(255,255,255,0.2)'}; 
                                  border-radius:6px; text-align:center; 
                                  text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;
                                  cursor: ${qqGroup[3].isFull ? 'not-allowed' : 'pointer'};">
                            ${qqGroup[3].isFull ? '⛔ 群已满' : '🎯 点击加入QQ群4：' + qqGroup[3].id}
                        </a>
                        <!-- QQ群 -->
                        <a href="${qqGroup[4].isFull ? 'javascript:void(0);' : qqGroup[4].link}" 
                           ${qqGroup[4].isFull ? '' : 'target="_blank"'} 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: ${qqGroup[4].isFull ? '#999' : 'rgba(255,255,255,0.2)'}; 
                                  border-radius:6px; text-align:center; 
                                  text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;
                                  cursor: ${qqGroup[4].isFull ? 'not-allowed' : 'pointer'};">
                            ${qqGroup[4].isFull ? '⛔ 群已满' : '🎯 点击加入QQ群5：' + qqGroup[4].id}
                        </a>

                        <!-- QQ群 -->
                        <a href="${qqGroup[0].isFull ? 'javascript:void(0);' : qqGroup[0].link}" 
                           ${qqGroup[0].isFull ? '' : 'target="_blank"'} 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: ${qqGroup[0].isFull ? '#999' : 'rgba(255,255,255,0.2)'}; 
                                  border-radius:6px; text-align:center; 
                                  text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;
                                  cursor: ${qqGroup[0].isFull ? 'not-allowed' : 'pointer'};">
                            ${qqGroup[0].isFull ? '⛔ 群已满' : '🎯 点击加入QQ群：' + qqGroup[0].id}
                        </a>
                        <a href="${biliUrl}" 
                           target="_blank" 
                           style="display: block; margin-top:12px; padding:10px; 
                                  background: rgba(255,255,255,0.2); border-radius:6px; 
                                  text-align:center; text-decoration:none; color:white !important;
                                  transition:0.3s; font-weight:500;">
                            📽️ 点击观看使用教程，哔哩哔哩：${biliUrl}
                        </a>
                    </div>`
    let requestObj = {
        fullsData: {
            url: "https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/3efdb592-138e-4854-8964-5e10f6011f33/fulls.json",
            method: "GET",
        },
        resourceLearningPositions: {
            url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/",
            method: "PUT"
        },
        /* 职业教育 | 高等教育  */
        progress: {
            url: "https://core.teacher.vocational.smartedu.cn/p/course/services/member/study/progress",
            method: "POST",
        }
    }

    /********************************************************
     * 职业教育/高等教育
     *******************************************************/
    const SWAL_CONFIG = {
        title: '课程进度控制',
        html: `
            <div style="margin-bottom: 5px">
                <label>v${GM_info.script.version}</label>
            </div>
            <div style="
                padding: 12px;
                background: #e8f4ff;
                border-radius: 8px;
                margin-bottom: 15px;
                border: 1px solid #b3d4fc;
                text-align: center;
            ">
                <span style="
                    font-size: 14px;    
                    color: #ff4daf;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                ">
                    <span style="font-size: 16px">🎯</span>
                    老师您好，点击开始按钮，开始减负之旅<br>
                    脚本会自动学习当前页所有视频，您可安心休息片刻
                </span>
            </div>
             <div style="margin-bottom: 15px">
                <label>当前视频：</label>
                <div id="currentVideo" style="
                    font-size: 16px;
                    color: #3498db;
                    font-weight: 500;
                    margin: 8px 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                ">尚未开始</div>
            </div>
            <div class="progress-container" style="
                background: #f0f0f0;
                height: 20px;
                border-radius: 10px;
                margin: 15px 0;
                overflow: hidden;
            ">
                <div id="swalProgressBar" style="
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%);
                    width: 0;
                    transition: width 0.3s ease;
                "></div>
            </div>
            <div style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 15px;
            ">
                <div>
                    <label>当前进度</label>
                    <div id="currentProgress" style="
                        font-size: 18px;
                        font-weight: bold;
                        color: #2c3e50;
                    ">0:00</div>
                </div>
                <div>
                    <label>大概需要时间</label>
                    <div id="needTime" style="
                        font-size: 14px;
                        color: #2efd00;
                    ">还未开始</div>
                </div>
                <div>
                    <label>总时长</label>
                    <div id="totalTime" style="
                        font-size: 14px;
                        color: #7f8c8d;
                    ">还未开始</div>
                </div>
            </div>
            <div id="statusMessage" style="
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
                background: #f8f9fa;
                text-align: center;
            ">准备就绪</div>
            <div style="
            padding: 12px;
            background: #f5f7fa;
            border-radius: 8px;
            margin: 12px 0;
            border: 1px solid #e4e7ed;
        ">
           ${renderQQGroups()}
        </div>
            <div id="author" style="
                padding: 8px 16px; /* 适当的上下左右内边距 */
                border-radius: 10px;
                margin: 10px 0;
                background: #f8f9fa;
                text-align: center;
                font-size: 12px; /* 稍微增大字体 */
                font-weight: bold; /* 加粗字体 */
                color: #495057; /* 更深的字体颜色，增强可读性 */
                border: 1px solid #dee2e6; /* 添加边框 */
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
                letter-spacing: 1px; /* 增加字母间距 */
            ">
                By YoungthZou. 盗码可耻！ zzzzzzys
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        width: 600,
        willOpen: () => {
            document.querySelector('.swal2-close').remove();
        }
    };

    // 状态管理
    let currentProgress = 60;
    let isRunning = false;
    let timerId = null;
    let swalInstance = null;
    let totalTime = 1000;
    let checkInterval = null
    // 工具函数
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const updateUI = (progress, status) => {
        if (!swalInstance) return;

        // 更新进度条
        const progressBar = swalInstance.querySelector('#swalProgressBar');
        const percent = (progress / totalTime * 100).toFixed(1);
        progressBar.style.width = `${Math.min(parseFloat(percent), 100)}%`;

        // 更新文本显示
        swalInstance.querySelector('#currentProgress').textContent = formatTime(progress);
        swalInstance.querySelector('#totalTime').textContent = formatTime(totalTime);
        swalInstance.querySelector('#needTime').textContent = formatTime(parseInt(((totalTime - progress) / 3).toFixed(0)));

        // 更新状态消息
        const statusEl = swalInstance.querySelector('#statusMessage');
        statusEl.textContent = {
            loading: '🔄 正在同步进度...',
            success: '✅ 同步成功,stand by...',
            error: '❌ 同步失败(长时间失败，请反馈)',
            idle: '⏸ 已暂停',
            finished: '✅已学完，跳过...',
            finishAll: '已全部学完,请手动刷新，给个好评吧~',
            next: "🔄 此视频已学完，准备学习下一个..."
        }[status] || '准备就绪';

        statusEl.style.color = {
            loading: '#f39c12',
            success: '#2ecc71',
            error: '#e74c3c',
            idle: '#7f8c8d',
            finished: '#0022fd',
            finishAll: '#ff4daf',
            next: '#f39c12',
        }[status];
    };

    // 发送请求
    const sendProgress = async (videoId) => {
        updateUI(currentProgress, 'loading');
        let oriData = {
            courseId: unsafeWindow.courseId,
            itemId: unsafeWindow.p.itemId,
            videoId: videoId,
            playProgress: currentProgress,
            segId: unsafeWindow.p.segId,
            type: unsafeWindow.p.type,
            tjzj: 1,
            clockInDot: currentProgress,//后台要求此参数为视频播放的位置
            sourceId: unsafeWindow.p.projectId,
            timeLimit: unsafeWindow.timilistParam.timeLimit || -1,
            originP: unsafeWindow.p.originP === 1 ? 2 : 1,  // 硬编码，等待修改
        }
        try {
            const response = await fetch(
                `${requestObj.progress.url}?orgId=${unsafeWindow.p.orgId}`,
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                        "u-platformId": unsafeWindow.platformInfo.id
                    },
                    credentials: "include",
                    body: new URLSearchParams(oriData)
                }
            );

            const data = await response.json();
            console.log(data)
            if (data.data?.videoProgress > 0) {
                currentProgress = parseInt(data.data.videoProgress);
                updateUI(currentProgress, 'success');
                return data.data.progress;
            } else {
                throw new Error('无效的服务器响应');
            }
        } catch (error) {
            console.error('请求失败:', error);
            updateUI(currentProgress, 'error');
        }
    };

    // 创建控制界面
    function createControlPanel() {
        Swal.fire({
            ...SWAL_CONFIG,
            didOpen: (modal) => {
                swalInstance = modal;

                // 添加控制按钮
                const actions = document.createElement('div');
                actions.style = `
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-top: 15px;
                `;

                const startBtn = createButton('▶ 开始', '#2ecc71', async () => {
                    if (!isRunning) {
                        try {
                            try {
                                document.querySelector('video').pause()
                            }catch (e) {

                            }
                            isRunning = true;
                            startBtn.textContent = '⏸ 暂停';
                            startBtn.style.background = '#e74c3c';
                            let courseData = getCourseData();
                            for (const courseDatum of courseData) {
                                if (!isRunning) {
                                    return
                                }
                                await sleep(2000)
                                console.log(courseDatum.name)
                                swalInstance.querySelector('#currentVideo').textContent = courseDatum.name
                                currentProgress = 0;
                                totalTime = parseInt(courseDatum.duration);
                                if (parseInt(courseDatum.progress) === 1) {
                                    console.log(" 已学完，跳过...")
                                    updateUI(currentProgress, 'finished');
                                    continue;
                                }
                                do {
                                    const progress = await sendProgress(courseDatum.videoId, currentProgress); // 立即执行
                                    if (progress === "1.0") {
                                        // currentProgress=0;
                                        break;
                                    }

                                    // currentProgress += 60
                                    // 可中断的等待
                                    await interruptibleWait(21000);
                                } while (currentProgress < totalTime && isRunning)
                                updateUI(currentProgress, 'next');
                                await sleep(20000);
                            }
                            // 非暂停结束
                            if(isRunning){
                                currentProgress = 1;
                                totalTime = 1;
                                updateUI(currentProgress, 'finishAll');
                                startBtn.textContent = '▶ 开始';
                                startBtn.style.background = '#2ecc71';
                            }
                        } catch (e) {
                            console.error(e)
                            if (Swal) {
                                Swal.fire({
                                    title: "失败！",
                                    text: e.toString() + "请在视频播放页面使用！！！",
                                    icon: 'error',
                                    // showCancelButton: true,
                                    confirmButtonColor: "#FF4DAFFF",
                                    // cancelButtonText: "取消，等会刷新",
                                    confirmButtonText: "点击去反馈",

                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                                    }
                                });
                            }
                        }finally {
                            isRunning = false;
                        }

                    } else {
                        isRunning = false;
                        startBtn.textContent = '▶ 继续';
                        startBtn.style.background = '#2ecc71';
                        // clearInterval(timerId);
                        if (checkInterval) {
                            clearTimeout(checkInterval.timer);
                            checkInterval.resolve(); // 立即结束等待
                        }
                        updateUI(currentProgress, 'idle');
                        setTimeout(() => {
                            updateUI(currentProgress, 'idle');
                        }, 2000)
                    }
                });

                const resetBtn = createButton('→去好评', '#dbba34', () => {
                    window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                });

                actions.append(startBtn, resetBtn);
                modal.querySelector('.swal2-html-container').append(actions);
            }
        });
    }

    /**
     * 睡眠
     * @param time
     * @returns {Promise<unknown>}
     */
    const sleep = function (time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function interruptibleWait(ms) {
        return new Promise(resolve => {
            const timer = setTimeout(resolve, ms);
            // 暴露清除方法以便立即暂停
            checkInterval = {timer, resolve};
        });
    }

    function createButton(text, color, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style = `
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background: ${color};
            color: white;
            cursor: pointer;
            transition: opacity 0.3s;
        `;
        btn.addEventListener('click', onClick);
        btn.addEventListener('mouseenter', () => btn.style.opacity = 0.8);
        btn.addEventListener('mouseleave', () => btn.style.opacity = 1);
        return btn;
    }

    function getCourseData() {
        let courseData = unsafeWindow.initlessons
        console.log(courseData)
        if (!courseData) {
            updateUI(currentProgress, 'error');
            console.error("no course data!");
            return
        }
        courseData = courseData.filter(item => {
            return item?.type !== "1";
        });
        return [...courseData];
    }


    /********************************************************
     * 打赏
     *******************************************************/
    GM_addStyle(`
.donate-panel {
    position: fixed;
    left: 30%;
    top:50%;
    background: linear-gradient(135deg, #fff5f5 0%, #fff0f7 100%);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(255, 77, 175, 0.2);
    padding: 24px;
    width: 520px;
    
    z-index: 2147483647;
    transform: translateY(-100); /* 初始隐藏位置 */
    opacity: 1; /* 确保初始可见性 */
    border: 1px solid #ffe6f0;
    backdrop-filter: blur(8px);
    transition: none; /* 禁用transition改用animation */
}

.donate-header {
    position: relative;
    font-size: 18px;
    color: #ff4daf;
    margin-bottom: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(255, 77, 175, 0.1);
}

.donate-header::after {
    content: "✨";
    position: absolute;
    right: 0;
    top: -8px;
    font-size: 24px;
    animation: sparkle 2s infinite;
}

.motivation-text {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    margin: 12px 0;
    background: rgba(255, 255, 255, 0.9);
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ffebf3;
}

@keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes sparkle {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
}
@keyframes panelSlideIn {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(-50%); opacity: 1; }
}

@keyframes panelSlideOut {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
}

@keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.qr-grid {
    display: grid;
    grid-template-columns: 1fr; /* 改为单列布局 */
    gap: 24px;
    margin: 24px auto;
    max-width: 300px; /* 增大容器宽度 */
}

.qr-item {
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    transition: 0.3s;
    padding: 12px; /* 增加内边距 */
    background: #fff;
    box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1);
}

.qr-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(255, 77, 175, 0.2);
}

.qr-item img {
    width: 100%;
    height: auto; /* 保持比例 */
    border-radius: 8px;
    border: 1px solid #ffe5f0;
    min-height: 280px; /* 最小高度保证 */
}

.qr-item p {
    text-align: center;
    margin: 16px 0 8px;
    font-size: 16px; /* 增大文字 */
    color: #ff4daf;
    font-weight: 600;
}
/* 新增文字样式 */
.qr-tips {
    text-align: center;
    margin: 8px 0;
    font-size: 14px;
    color: #ff7ab8; /* 更柔和的粉色 */
}

.qr-proverb {
    font-style: italic;
    color: #ff9ec7; /* 更浅的粉色 */
    font-size: 13px;
    margin-top: 4px;
}

/* 修改原有.qr-item p样式 */
.qr-item p {
    margin: 12px 0 4px; /* 减小下边距 */
    /* 其他样式保持不变 */
}

/* 手机横屏/平板适配 */
@media (min-width: 600px) {
    .qr-grid {
        grid-template-columns: 1fr 1fr; /* 大屏幕恢复双列 */
        max-width: 600px;
    }
    .qr-item img {
        min-height: 240px;
    }
}

.third-party {
    margin-top: 20px;
}

.platform-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: linear-gradient(135deg, #fff0f5 0%, #fff8fb 100%);
    border-radius: 8px;
    text-decoration: none;
    color: #ff6699 !important;
    font-size: 14px;
    margin: 8px 0;
    transition: 0.3s;
    border: 1px solid #ffe6ee;
}
.donate-panel.active {
    animation: panelSlideIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
}

.donate-panel.exit {
    animation: panelSlideOut 0.3s ease forwards;
}

/* 触发按钮动画 */
#donate-trigger {
    animation: heartbeat 1.8s ease-in-out infinite;
}
.platform-btn:hover {
    background: linear-gradient(135deg, #ffe6ee 0%, #fff1f7 100%);
    box-shadow: 0 4px 12px rgba(255, 77, 175, 0.1);
}

.close-btn {
    /* 保持原有样式 */
}
`);

    // 激励文案库
    const motivationTexts = [
        "您的每一份支持都将转化为：",
        "❤️ 服务器续费 ",
        "🛠️ 持续开发维护 ",
        "☕ 深夜码农的咖啡燃料",
        "🐈 小猫最爱的水煮鸡胸肉",
    ];

    // 动态生成激励文案
    function generateMotivation() {
        const fragments = [
            '<div class="motivation-text">',
            '🌟 <strong>感谢使用本脚本！</strong>',
            ...motivationTexts.map(t => `• ${t}`),
            '</div>'
        ].join('<br>');

        return fragments
            .replace('${donateCount}', '1,234')
            .replace('${updateDays}', '365');
    }
    // 打赏面板HTML结构
    const donateHTML = `
<div  id="donate-panel">
    ${generateMotivation()}
    <div class="donate-header">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        支持开发者
    </div>
    <div class="qr-grid">
        <div class="qr-item">
            <p>微信扫码支持</p>
            <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/WeChat.jpg" alt="微信赞赏码">
            <div class="qr-tips">
            <p>❤️持续创作需要您的支持</p>
            <p class="qr-proverb">星火相聚，终成光芒</p>
             </div>
            
        </div>
        <div class="qr-item">
            <p>支付宝扫码支持</p>
            <img style="width: 200px;height: 266px" src="https://mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com/monkey-pic/alipay.jpg" alt="支付宝收款码">
            <div class="qr-tips">
            <p>🌸每一份心意都值得珍惜</p>
            <p class="qr-proverb">不啻微芒，造矩成阳</p>
        </div>
            
        </div>
    </div>
    <div class="donate-header">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#1e62ec">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        感谢您的支持！
    </div>
    <div class="third-party">
        <!--<a href="https://afdian.net/@yourid" class="platform-btn" target="_blank">
            <svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align:-2px;">
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372zm218-572.1h-50.4c-4.4 0-8 3.6-8 8v384.2c0 4.4 3.6 8 8 8h145.7c4.4 0 8-3.6 8-8V319.9c0-4.4-3.6-8-8-8h-50.4c-4.4 0-8 3.6-8 8v151.7H730V319.9c0-4.4-3.6-8-8-8zM328.1 703.9c-4.4 0-8-3.6-8-8v-384c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v151.7h116.7V319.9c0-4.4 3.6-8 8-8h50.4c4.4 0 8 3.6 8 8v384.2c0 4.4-3.6 8-8 8h-145c-4.4 0-8-3.6-8-8v-151H344v151c0 4.4-3.6 8-8 8H328.1z"/>
            </svg>
            爱发电支持
        </a>-->

        <div class="platform-btn" id="donate-panel-close">感谢开发者，已支持~</div>
    </div>
</div>
`;

    // 初始化打赏面板
    function initDonate() {
        if (document.getElementById('donate-panel')) return;

        const panel = document.createElement('div');
        panel.innerHTML = donateHTML;
        panel.className = 'donate-panel';
        document.body.appendChild(panel);

        // 强制重排触发动画
        void panel.offsetWidth; // 触发CSS重绘
        panel.classList.add('active');

        // 关闭按钮事件
        panel.querySelector('#donate-panel-close').addEventListener('click', () => {
            panel.classList.remove('active');
            panel.classList.add('exit');
            panel.addEventListener('animationend', () => {
                panel.remove();
            }, {once: true});
        });

        // 点击外部关闭
        const clickHandler = (e) => {
            if (!panel.contains(e.target) && e.target.id !== 'donate-trigger') {
                panel.classList.add('exit');
                panel.addEventListener('animationend', () => {
                    panel.remove();
                }, {once: true});
                document.removeEventListener('click', clickHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', clickHandler), 100);
    }

    // 显示触发按钮
    const trigger = document.createElement('div');
    trigger.innerHTML = '❤️ 打赏支持';
    Object.assign(trigger.style, {
        position: 'fixed',
        left: '10px',
        top: '415px',
        background: '#ff6b6b',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        zIndex: '999999999999999',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: '14px'
    });
    // 触发按钮增强
    Object.assign(trigger.style, {
        background: 'linear-gradient(135deg, #ff4daf 0%, #ff6b6b 100%)',
        fontWeight: '600',
        padding: '12px 24px',
        boxShadow: '0 4px 24px rgba(255, 77, 175, 0.3)',
        animation: 'heartbeat 1.5s ease-in-out infinite',
        border: '1px solid #ffb3d9'
    });
    trigger.addEventListener('click', initDonate);
    document.body.appendChild(trigger);

    /********************************************************
     * 中小学智慧教育平台 * 寒假研修
     *******************************************************/
        //样式
    let style = `.button-3 {
              position: fixed;  
              appearance: none;
              background-color: #ed5822;
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
              z-index: 2147483647;
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
    const showQQGroup = () => {

    }
    const createFloatingButton = () => {
        // 如果按钮已存在则先移除旧实例
        const existingBtn = document.getElementById('zs-helper-btn');
        if (existingBtn) existingBtn.remove();

        // 直接创建按钮元素（去掉外层div嵌套）
        const btn = document.createElement('div');
        btn.id = 'zs-helper-btn'; // 确保唯一ID直接设置在元素上
        btn.style.cssText = `
        position: fixed;
        left: 10px;
        top: 250px;
        transform: translateY(-50%);
        background: #ed5822;
        color: white;
        padding: 12px 24px;
        border-radius: 30px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(255,77,175,0.3);
        z-index: 2147483647; /* 使用最大z-index值 */
        transition: 0.3s;
        font-family: 'Microsoft Yahei', sans-serif;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

        // 添加内部HTML内容
        btn.innerHTML = `
        <svg style="width:18px;height:18px;fill:white;" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
        <span>使用指南</span>
    `;

        // 使用更可靠的事件监听方式
        const handleHover = () => {
            btn.style.transform = 'translateY(-50%) scale(1.05)';
            btn.style.boxShadow = '0 6px 16px rgba(255,77,175,0.4)';
        };

        const handleLeave = () => {
            btn.style.transform = 'translateY(-50%) scale(1)';
            btn.style.boxShadow = '0 4px 12px rgba(255,77,175,0.3)';
        };

        btn.addEventListener('mouseenter', handleHover);
        btn.addEventListener('mouseleave', handleLeave);
        btn.addEventListener('click', showGuideDialog);

        document.body.appendChild(btn);
        return btn;
    };
    // 显示操作指南弹窗
    const showGuideDialog = () => {
        if (Swal) {
            Swal.fire({
                title: `<span style="color: #FF4DAF; font-size:26px; display: flex; align-items: center; gap:8px;">📚 智能刷课指南 <div style="font-size:12px; color:#95a5a6; margin-left:auto;">v${GM_info.script.version}</div></span>`,
                html: `
                <div style="text-align: left; max-width: 720px; line-height: 1.8;">
                    <!-- 操作步骤 -->
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="color: red; font-weight:500; margin-bottom:10px;">
                            播放页面未正常生效请刷新页面！播放页面左侧无红色按钮请刷新页面！
                        </div>
                        <div style="color: #2c3e50; font-weight:500; margin-bottom:10px;">
                            🚀 极速操作流程<br>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 32px 1fr; gap: 10px; align-items: center;">
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">1</div>
                            <div>进入2025研修课程播放页面</div>
                            
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">2</div>
                            <div>等待视频加载完成（<span style="color:#e74c3c">未自动播放时</span>）</div>
                            
                            <div style="background: #FF4DAF; color: white; width:24px; height:24px; border-radius:50%; text-align:center; line-height:24px;">3</div>
                            <div>点击左侧<span style="color:#FF4DAF; font-weight:bold">「即刻开刷」</span>按钮</div>
                        </div>
                    </div>

                    <!-- 注意事项 -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom:20px;">
                        <div style="border-left: 3px solid #FF4DAF; padding-left:12px;">
                            <div style="color: #e74c3c; font-weight:500; margin-bottom:8px;">⚠️ 重要提醒</div>
                            <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;">
                                <li>视频最后剩下5秒需要看完</li>
                                <li>请勿主动点击播放</li>
                                <li>建议刷完全部视频再刷新，观看最后的几秒</li>
                            </ul>
                        </div>

                        <div style="border-left: 3px solid #27ae60; padding-left:12px;">
                            <div style="color: #27ae60; font-weight:500; margin-bottom:8px;">💡 高效技巧</div>
                            <ul style="margin:0; padding-left:18px; color:#7f8c8d; font-size:14px;">
                                <li>先刷一个视频</li>
                                <li>点击另外一个视频</li>
                                <li>再点击回刚刷的视频，播放完最后5s</li>
                            </ul>
                        </div>
                    </div>
                    ${renderQQGroups()}
                    
                </div>
            `,
                confirmButtonText: "已了解，开始减负之旅 →",
                confirmButtonColor: "#FF4DAF",
                showCancelButton: true,
                cancelButtonText: "不在显示此窗口",
                cancelButtonColor: "#95a5a6",
                width: 760,
                customClass: {
                    popup: 'animated pulse',
                    title: 'swal-title-custom'
                },
                footer: '<div style="color:#bdc3c7; font-size:12px;">请合理使用本工具</div>'
            }).then((result) => {
                // console.log(result);
                // console.log(Swal.DismissReason.cancel);
                if (result.dismiss === Swal.DismissReason.cancel) {
                    // 跳转到课程列表页或其他操作
                    localStorage.setItem('noMoreDialog', "ture")
                }
            });
        }
    }
    // 初始化逻辑
    // 初始化逻辑优化
    const init = () => {
        // 创建悬浮按钮
        const floatBtn = createFloatingButton();

        // 添加防DOM清理监听（优化版）
        const observer = new MutationObserver(mutations => {
            if (!document.body.contains(floatBtn)) {
                createFloatingButton();
            }
        });
        observer.observe(document.body, {childList: true});

        // 添加CSS保护
        const style = document.createElement('style');
        style.textContent = `
        #zs-helper-btn {
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        #zs-helper-btn:hover {
            transform: translateY(-50%) scale(1.05) !important;
        }
    `;
        document.head.appendChild(style);
    };

    function getVideoTime() {
        return Math.round(document.querySelector('video').duration)
    }

    function getResourceId() {
        // 获取目标元素
        const divElement = document.querySelector('div.vjs-poster');
        if (divElement) {

            const bgImage = divElement.style.backgroundImage;

            const uuidPattern = /assets\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/;
            const match = bgImage.match(uuidPattern);
            if (match) {
                const resId = match[1];
                console.log(resId);
                return resId
            }
        }
        throw Error("can not get ResourceId!")
    }

    function getResourceIdFromFullData() {
        if(!fullDatas || fullDatas.nodes?.length === 0) {
            throw Error("can't get fullDatas!")
        }
        const result = [];
        // 递归遍历节点
        const traverse = (node) => {
            if (node.node_type === 'catalog' && node.child_nodes?.length > 0) {
                // 如果是目录节点，继续遍历子节点
                node.child_nodes.forEach(child => traverse(child));
            } else if (node.node_type === 'activity') {
                // 如果是活动节点，提取资源
                const resources = node.relations?.activity?.activity_resources || [];
                resources.forEach(resource => {
                    result.push({
                        name: node.node_name || '未命名课程',
                        resource_id: resource.resource_id || '',
                        studyTime:resource.study_time
                    });
                });
            }
        };

        // 遍历初始节点数组
        fullDatas.nodes.forEach(node => traverse(node));
        return result.filter(item => item.resource_id); // 过滤无效项

    }

    function getDynamicToken() {
        try {
            const pattern = /^ND_UC_AUTH-([0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12})&ncet-xedu&token$/;
            for (let key of Object.keys(localStorage)) {
                if (pattern.test(key)) {
                    return {
                        key: key,
                        appId: key.match(pattern)[1],
                        token: JSON.parse(JSON.parse(localStorage.getItem(key)).value)
                    };
                }
            }
            throw Error("Invalid token! can not get loginInfo!");
        } catch (err) {
            throw Error("At:getDynamicToken>>" + err);
        }
    }


    // const tokenData = getDynamicToken();
    // if (tokenData) {
    //     console.log("完整键名:", tokenData.key);
    //     console.log("用户UUID:", tokenData.uuid);
    //     console.log("Token值:", tokenData.token);
    // }
    // 作者：zzzzzzys
    // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
    // 搬运可耻
    const getMACAuthorizationHeaders = function (url, method) {
        let n = getDynamicToken().token
        return He(url, method, {
            accessToken: n.access_token,
            macKey: n.mac_key,
            diff: n.diff
        });
    }

    function Ze(e) {
        for (var t = "0123456789ABCDEFGHIJKLMNOPQRTUVWXZYS".split(""), n = "", r = 0; r < e; r++)
            n += t[Math.ceil(35 * Math.random())];
        return n
    }

    function Fe(e) {
        return (new Date).getTime() + parseInt(e, 10) + ":" + Ze(8)
    }

    function ze(e, t, n, r) {
        let o = {
            relative: new URL(e).pathname,
            authority: new URL(e).hostname
        }
        let i = t + "\n" + n.toUpperCase() + "\n" + o.relative + "\n" + o.authority + "\n";
        return CryptoJS.HmacSHA256(i, r).toString(CryptoJS.enc.Base64)
    }

    function He(e) {
        // 作者：zzzzzzys
        // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
        // 搬运可耻
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "GET"
            , n = arguments.length > 2 ? arguments[2] : void 0
            , r = n.accessToken
            , o = n.macKey
            , i = n.diff
            , s = Fe(i)
            , a = ze(e, s, t, o);
        return 'MAC id="'.concat(r, '",nonce="').concat(s, '",mac="').concat(a, '"')
    }

    const setProgress = function (url, duration) {
        const info = getDynamicToken()
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                'url': url,
                method: 'PUT',
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "authorization": getMACAuthorizationHeaders(url, 'PUT'),
                    "cache-control": "no-cache",
                    "pragma": "no-cache",
                    "content-type": "application/json",
                    "sdp-app-id": info.appId,
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site",
                    "host": "x-study-record-api.ykt.eduyun.cn",
                    "origin": "https://basic.smartedu.cn",
                    "referer": "https://basic.smartedu.cn/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
                },
                data: JSON.stringify({position: duration - 3}),
                // fetch:true,
                onload: function (res) {
                    console.log('请求成功')
                    console.log(res)
                    if (res.status === 200) {
                        console.log("刷课成功！")
                        resolve(res)
                    }else {
                        reject('服务器拒绝：'+res.response)
                    }
                },
                onerror: function (err) {
                    reject('请求错误！' + err.toString())
                }
            })
        })
    }

    function main () {
        init()
        if (!localStorage.getItem("noMoreDialog")) {
            showGuideDialog()
            // return
        }
        let myStyle = document.createElement('style')
        myStyle.innerHTML = style;
        document.head.appendChild(myStyle);
        /*let intercept=GM_GetValue*/
        let div = document.createElement('div');
        div.innerHTML = `<div style="left: 10px;top: 280px;" id="my1" class="button-3" >即刻开刷(中小学)</div>
                        <div style="position: fixed; left: 10px;top: 320px;;background: #ed5822;color: white;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            box-shadow: 0 3px 15px rgba(0,0,0,0.2);
            z-index: 999999999999;
            transition: transform 0.3s;" id="my3"    >职业教育/高等教育 刷课</div>
            <div style="left: 10px;top: 370px;" id="my2"   class="button-3" >2222</div>`
        document.body.appendChild(div);
        const trigger = document.getElementById('my3')
        trigger.addEventListener('click', () => {
            if (location.href.includes("core.teacher.vocational.smartedu.cn")) {
                createControlPanel()
            } else {
                Swal.fire({
                    title: "注意",
                    text: "请在职业/高等教育的视频播放页面使用，中小学请用上面的按钮！",
                    icon: 'info',
                    // showCancelButton: true,
                    confirmButtonColor: "#FF4DAFFF",
                    // cancelButtonText: "取消，等会刷新",
                    confirmButtonText: "了解~",

                }).then((result) => {

                });

            }
        });
        trigger.addEventListener('mouseenter', () => trigger.style.transform = 'scale(1.05)');
        trigger.addEventListener('mouseleave', () => trigger.style.transform = 'none');
        let isProcessing = false;
        const button = document.getElementById('my1');
        button.addEventListener("click", async () => {
            if (isProcessing) {
                Swal.fire({
                    title: "操作进行中",
                    text: "正在刷课中，请勿重复点击！",
                    icon: "warning",
                    confirmButtonColor: "#FF4DAFFF",
                    confirmButtonText: "知道了"
                });
                return;
            }
            try {
                isProcessing = true; // 标记开始处理
                button.disabled = true; // 禁用按钮
                button.textContent = "刷课进行中..."; // 修改按钮文字

                let resId
                const allResults = [];
                try {
                    resId=getResourceId()
                }catch (e) {}
                if(!resId){
                    console.log("二次获取resId...")
                    resId=getResourceIdFromFullData()
                }
                if(resId && typeof resId === 'string') {
                    await setProgress(requestObj.resourceLearningPositions.url + resId + '/' + getDynamicToken().token["user_id"], getVideoTime())
                    allResults.push({ name: '单个课程',  status: 'success' });
                }else if (Array.isArray(resId) && resId.length > 0) {
                    const results = await Promise.allSettled(
                        resId.map(async (item) => {
                            try {
                                await setProgress(requestObj.resourceLearningPositions.url + item.resource_id + '/' + getDynamicToken().token["user_id"], item.studyTime)
                                return { name:item.name, status: 'success' };
                            } catch (e) {
                                console.error(`${item.name} 失败！`, e);
                                return { name:item.name, status: 'fail', error: e };
                            }
                        })
                    );
                    console.log(results)
                    results.forEach(r => {
                        if (r.status === 'fulfilled') allResults.push(r.value);
                        else allResults.push(r.reason); // 捕获未处理的意外错误
                    });
                }

                if (Swal) {
                    Swal.fire({
                        title: "刷课成功！",
                        html: `
            <div style="text-align: left; max-height: 60vh; overflow-y: auto;">
            <p>总计：${allResults.filter(r => r.status === 'success').length} 成功 / ${allResults.filter(r => r.status === 'fail').length} 失败</p>
            <hr>
            <ul style="padding-left: 20px; list-style-type: none;">
              ${allResults.map(result => `
                <li>
                  ${result.status === 'success' ? '✅' : '❌'}
                  <strong>${result.name}</strong> 
                  
                  ${result.error ? `<br><code style="color:red">${result.error.message || result.error}</code>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>
            <div style="text-align: left;">
                <p>视频只剩下最后5s，需要看完，请刷新后再观看！</p>
                <p>刷课前请勿播放视频，否则可能会导致进度更新失败！</p>
                <hr style="margin: 10px 0;">
                ${renderQQGroups()}
            </div>
        `,
                        icon: 'success',
                        confirmButtonColor: "#FF4DAFFF",
                        // cancelButtonText: "取消，等会刷新",
                        // 作者：zzzzzzys
                        // https://greasyfork.org/zh-CN/users/1176747-zzzzzzys
                        // 搬运可耻
                        confirmButtonText: "确定",

                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                    });
                }
            } catch (e) {
                console.error(e)
                if (Swal) {
                    Swal.fire({
                        title: "失败！",
                        text: e.toString() + "    请在视频播放页面使用！",
                        icon: 'error',
                        // showCancelButton: true,
                        confirmButtonColor: "#FF4DAFFF",
                        // cancelButtonText: "取消，等会刷新",
                        confirmButtonText: "点击去反馈",

                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback")
                        }
                    });
                }
            }finally {
            isProcessing = false; // 重置处理状态
            button.disabled = false; // 恢复按钮
            button.textContent = "即刻开刷(中小学)"; // 恢复按钮文字
        }


        })
        document.getElementById('my2').addEventListener('click', function () {
            Swal.fire({
                title: '<span style="font-size:24px; color: #FF4DAF;">欢迎加入交流群</span>',
                html: `
        <div style="text-align: left; max-width: 580px; line-height: 1.7; font-size: 14px;">
            <!-- 社群入口 -->
            ${renderQQGroups()}

            <!-- 核心价值 -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <!-- 左列 -->
                <div style="padding-right:15px; border-right:1px dashed #eee;">
                    <div style="color: #27ae60; margin-bottom:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">📚 减负工具</h4>
<!--                        <ul style="margin:0; padding-left:18px;">-->
<!--                            <li>自动化备课工具套件</li>-->
<!--                            <li>智能学情分析报告</li>-->
<!--                            <li>教学资源智能检索</li>-->
<!--                        </ul>-->
                    </div>

                    <div style="color: #2980b9; margin-top:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">🛡️ 使用规范</h4>
                        <ul style="margin:0; padding-left:18px;">
                            <li>仅限个人使用</li>
                            <li>禁止商业倒卖行为</li>
                            <li>禁止利用此脚本收费代刷</li>
                            <li>请勿批量自动化操作大量刷课（如需要请联系我，更加高效安全）</li>
                        </ul>
                    </div>
                </div>

                <!-- 右列 -->
                <div style="padding-left:15px;">
                    <div style="color: #e67e22;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">⚖️ 版权声明</h4>
                        <ul style="margin:0; padding-left:18px;">
                            <li>本工具完全免费</li>
                            <li>源码禁止二次传播</li>
<!--                            <li>保留原创法律权利</li>-->
                        </ul>
                    </div>

                    <div style="color: #9b59b6; margin-top:15px;">
                        <h4 style="margin:0 0 8px 0; font-size:15px;">💌 联系我们</h4>
                        <ul style="margin:0; padding-left:18px;">
<!--                            <li>反馈建议：edu@service.com</li>-->
                            <li>紧急问题：请私聊群管理员</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
                icon: 'info',
                confirmButtonColor: "#FF4DAF",
                confirmButtonText: "2222",
                showCloseButton: true,
                width: 680,
                showDenyButton: true,
                denyButtonText: '<img src="https://img.icons8.com/fluency/24/star--v1.png" style="height:18px; vertical-align:middle;"> 前往好评', // 带图标的按钮
                denyButtonColor: '#FFC107',
                focusDeny: false,
                showCancelButton: false,

                // 新增按钮回调
                preDeny: () => {
                    window.open("https://greasyfork.org/zh-CN/scripts/525037/feedback", "_blank");
                    return false; // 阻止弹窗关闭
                },

                customClass: {
                    denyButton: 'swal-custom-deny',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title'
                },
                footer: '<div style="color:#95a5a6; font-size:12px;">请合理使用。</div>'
            });
        });
    }
    main()
})();