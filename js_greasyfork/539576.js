// ==UserScript==
// @name         B站抽奖动态智能处理
// @namespace    https://github.com/bilibili-lottery-handler
// @version      1.0.2
// @description  智能处理B站抽奖动态：未开奖保留，已开奖判断UP主其他抽奖后决定是否取关
// @author       senjoke
// @match        http*://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/539576/B%E7%AB%99%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E6%99%BA%E8%83%BD%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539576/B%E7%AB%99%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81%E6%99%BA%E8%83%BD%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 初始化配置
     */
    function initConfig() {
        if (GM_getValue('smart-unfollow') == undefined) {
            GM_setValue('smart-unfollow', true);
        }
        if (GM_getValue('delete-finished-lottery') == undefined) {
            GM_setValue('delete-finished-lottery', true);
        }
        if (GM_getValue('unfollow-list') == undefined) {
            GM_setValue('unfollow-list', []);
        }
        // 新增配置：删除重试次数
        if (GM_getValue('delete-retry-count') == undefined) {
            GM_setValue('delete-retry-count', 3);
        }
        // 新增配置：操作延迟时间（毫秒）
        if (GM_getValue('operation-delay') == undefined) {
            GM_setValue('operation-delay', 1500);
        }
    }

    /**
     * 全局状态管理
     */
    let isProcessing = false;
    let currentProcessId = null;

    /**
     * 弹窗样式
     */
    const styles = `
        .lottery-handler-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .lottery-handler-content {
            background-color: #fff;
            border-radius: 10px;
            width: 500px;
            max-height: 80vh;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            position: relative;
        }
        
        .lottery-handler-content.large {
            width: 700px;
            max-height: 90vh;
        }
        
        .lottery-handler-header {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .lottery-handler-body {
            max-height: 60vh;
            overflow-y: auto;
            margin-bottom: 20px;
        }
        
        .config-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .config-item:last-child {
            border-bottom: none;
        }
        
        .config-label {
            font-size: 14px;
            color: #333;
        }
        
        .config-input {
            margin-left: 10px;
        }
        
        .lottery-handler-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .btn-primary {
            background-color: #00a1d6;
            color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
            background-color: #0082b3;
        }
        
        .btn-secondary {
            background-color: #ccc;
            color: #333;
        }
        
        .btn-secondary:hover:not(:disabled) {
            background-color: #bbb;
        }
        
        .btn-success {
            background-color: #52c41a;
            color: white;
        }
        
        .btn-success:hover:not(:disabled) {
            background-color: #389e0d;
        }
        
        .progress-bar {
            width: 100%;
            height: 20px;
            background-color: #f0f0f0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background-color: #00a1d6;
            transition: width 0.3s ease;
        }
        
        .status-text {
            font-size: 12px;
            color: #666;
            text-align: center;
            margin-top: 5px;
        }
        
        .minimize-btn {
            background: #f0f0f0;
            border: none;
            border-radius: 3px;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .minimize-btn:hover {
            background: #e0e0e0;
        }
        
        .mini-progress {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 15px;
            z-index: 10001;
            display: none;
        }
        
        .mini-progress.show {
            display: block;
        }
        
        .mini-header {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .expand-btn {
            background: #00a1d6;
            color: white;
            border: none;
            border-radius: 3px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .result-section {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #00a1d6;
        }
        
        .result-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        
        .result-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .stat-item {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
        }
        
        .stat-number {
            font-size: 18px;
            font-weight: bold;
            color: #00a1d6;
        }
        
        .stat-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        
        .user-list {
            max-height: 200px;
            overflow-y: auto;
            background: white;
            border-radius: 6px;
            padding: 10px;
        }
        
        .user-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .user-item:last-child {
            border-bottom: none;
        }
        
        .user-name {
            font-weight: 500;
            color: #333;
        }
        
        .user-uid {
            font-size: 12px;
            color: #999;
            margin-left: 8px;
        }
        
        .no-data {
            text-align: center;
            color: #999;
            font-style: italic;
            padding: 20px;
        }
    `;

    GM_addStyle(styles);

    /**
     * 获取Cookie值
     * @param {string} key Cookie键名
     * @returns {string} Cookie值
     */
    function getCookie(key) {
        const cookieArr = document.cookie.split(';');
        for (let i = 0; i < cookieArr.length; i++) {
            const cookie = cookieArr[i].trim();
            if (cookie.indexOf(key + '=') === 0) {
                return cookie.substring(key.length + 1);
            }
        }
        return null;
    }

    /**
     * 发送通知
     * @param {string} message 通知内容
     * @param {string} type 通知类型
     */
    function sendNotification(message, type = 'info') {
        console.log(`[B站抽奖动态智能处理] ${message}`);
        GM_notification({
            text: message,
            title: 'B站抽奖动态智能处理',
            image: 'https://www.bilibili.com/favicon.ico',
            timeout: 3000,
        });
    }

    /**
     * 获取用户动态列表
     * @param {string} uid 用户ID
     * @param {string} offset 偏移量
     * @returns {Promise} 动态数据
     */
    async function getUserDynamics(uid, offset = '') {
        const apiUrl = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${uid}`;
        
        try {
            const response = await axios.get(apiUrl, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('获取动态失败:', error);
            throw error;
        }
    }

    /**
     * 获取抽奖状态
     * @param {string} lotteryId 抽奖ID
     * @returns {Promise} 抽奖状态信息
     */
    async function getLotteryStatus(lotteryId) {
        const apiUrl = `https://api.vc.bilibili.com/lottery_svr/v1/lottery_svr/lottery_notice?business_type=4&business_id=${lotteryId}`;
        
        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            console.error('获取抽奖状态失败:', error);
            throw error;
        }
    }

    /**
     * 验证动态是否被成功删除
     * @param {string} dynamicId 动态ID
     * @param {string} uid 用户ID
     * @returns {Promise<boolean>} 是否删除成功
     */
    async function verifyDynamicDeleted(dynamicId, uid) {
        try {
            // 等待一段时间让服务器处理
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 重新获取用户动态，检查目标动态是否还存在
            const dynamicsData = await getUserDynamics(uid);
            
            if (dynamicsData.code !== 0) {
                console.warn('验证删除时获取动态失败:', dynamicsData.message);
                return false; // 无法验证，假定删除失败
            }
            
            const items = dynamicsData.data.items || [];
            const stillExists = items.some(item => item.id_str === dynamicId);
            
            return !stillExists; // 如果不存在则删除成功
        } catch (error) {
            console.error('验证删除失败:', error);
            return false; // 验证失败，假定删除失败
        }
    }

    /**
     * 删除动态（带重试和验证机制）
     * @param {string} dynamicId 动态ID
     * @param {string} uid 用户ID
     * @param {number} maxRetries 最大重试次数
     * @returns {Promise<Object>} 删除结果
     */
    async function deleteDynamicWithRetry(dynamicId, uid, maxRetries = 3) {
        const csrf = getCookie('bili_jct');
        const apiUrl = `https://api.bilibili.com/x/dynamic/feed/operate/remove?csrf=${csrf}`;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`尝试删除动态 ${dynamicId}，第 ${attempt} 次`);
                
                const response = await axios.post(apiUrl, {
                    dyn_id_str: dynamicId
                }, {
                    withCredentials: true
                });
                
                if (response.data.code === 0) {
                    // API返回成功，进行验证
                    console.log(`删除API调用成功，开始验证动态 ${dynamicId} 是否真的被删除`);
                    
                    const isDeleted = await verifyDynamicDeleted(dynamicId, uid);
                    
                    if (isDeleted) {
                        console.log(`动态 ${dynamicId} 删除成功并验证通过`);
                        return {
                            code: 0,
                            message: '删除成功',
                            verified: true,
                            attempts: attempt
                        };
                    } else {
                        console.warn(`动态 ${dynamicId} API返回成功但验证失败，可能触发了验证码或其他限制`);
                        if (attempt < maxRetries) {
                            // 增加更长的延迟避免触发验证码
                            const delayTime = GM_getValue('operation-delay') * attempt;
                            console.log(`等待 ${delayTime}ms 后重试...`);
                            await new Promise(resolve => setTimeout(resolve, delayTime));
                            continue;
                        } else {
                            return {
                                code: -1,
                                message: '删除验证失败，可能触发了验证码或其他安全限制',
                                verified: false,
                                attempts: attempt
                            };
                        }
                    }
                } else {
                    console.warn(`删除动态 ${dynamicId} 失败:`, response.data.message);
                    if (attempt < maxRetries) {
                        const delayTime = GM_getValue('operation-delay') * attempt;
                        console.log(`等待 ${delayTime}ms 后重试...`);
                        await new Promise(resolve => setTimeout(resolve, delayTime));
                        continue;
                    } else {
                        return {
                            code: response.data.code,
                            message: response.data.message || '删除失败',
                            verified: false,
                            attempts: attempt
                        };
                    }
                }
            } catch (error) {
                console.error(`删除动态 ${dynamicId} 第 ${attempt} 次尝试失败:`, error);
                if (attempt < maxRetries) {
                    const delayTime = GM_getValue('operation-delay') * attempt;
                    console.log(`等待 ${delayTime}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delayTime));
                    continue;
                } else {
                    return {
                        code: -1,
                        message: `删除失败: ${error.message}`,
                        verified: false,
                        attempts: attempt
                    };
                }
            }
        }
        
        return {
            code: -1,
            message: '删除失败，已达到最大重试次数',
            verified: false,
            attempts: maxRetries
        };
    }

    /**
     * 删除动态（保留原函数以兼容）
     * @param {string} dynamicId 动态ID
     * @returns {Promise} 删除结果
     */
    async function deleteDynamic(dynamicId) {
        const csrf = getCookie('bili_jct');
        const apiUrl = `https://api.bilibili.com/x/dynamic/feed/operate/remove?csrf=${csrf}`;
        
        try {
            const response = await axios.post(apiUrl, {
                dyn_id_str: dynamicId
            }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('删除动态失败:', error);
            throw error;
        }
    }

    /**
     * 取关用户
     * @param {string} uid 用户ID
     * @returns {Promise} 取关结果
     */
    async function unfollowUser(uid) {
        const csrf = getCookie('bili_jct');
        const apiUrl = 'https://api.bilibili.com/x/relation/modify';
        
        try {
            const response = await axios.post(apiUrl, {
                fid: uid,
                act: 2, // 2表示取关
                re_src: 11,
                spmid: '333.999.0.0',
                csrf: csrf
            }, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('取关失败:', error);
            throw error;
        }
    }

    /**
     * 检查用户是否有其他未开奖的抽奖动态
     * @param {string} uid 用户ID  
     * @param {string} excludeId 排除的动态ID
     * @returns {Promise<Object>} 返回检查结果 {hasOtherLottery: boolean, otherLotteryCount: number}
     */
    async function hasOtherUnfinishedLottery(uid, excludeId) {
        try {
            let offset = '';
            let hasMore = true;
            let otherLotteryCount = 0;
            
            while (hasMore) {
                const dynamicsData = await getUserDynamics(uid, offset);
                
                if (dynamicsData.code !== 0) {
                    console.error('获取用户动态失败:', dynamicsData.message);
                    return {hasOtherLottery: false, otherLotteryCount: 0};
                }
                
                const items = dynamicsData.data.items || [];
                
                for (const item of items) {
                    // 跳过要排除的动态
                    if (item.id_str === excludeId) continue;
                    
                    // 检查是否为转发动态且包含抽奖
                    if (item.orig && item.orig.id_str) {
                        try {
                            const lotteryData = await getLotteryStatus(item.orig.id_str);
                            
                            // 如果是抽奖且未开奖
                            if (lotteryData.code === 0 && lotteryData.data.status === 0) {
                                otherLotteryCount++;
                            }
                        } catch (error) {
                            // 不是抽奖动态，继续检查下一个
                            continue;
                        }
                    }
                }
                
                // 检查是否还有更多动态
                offset = dynamicsData.data.offset;
                hasMore = dynamicsData.data.has_more && offset;
                
                // 为了避免请求过于频繁，添加延迟
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            return {hasOtherLottery: otherLotteryCount > 0, otherLotteryCount};
        } catch (error) {
            console.error('检查其他抽奖动态失败:', error);
            return {hasOtherLottery: false, otherLotteryCount: 0};
        }
    }

    /**
     * 处理单个抽奖动态
     * @param {Object} dynamic 动态对象
     * @param {Function} progressCallback 进度回调
     * @param {string} currentUid 当前用户ID（用于删除验证）
     * @returns {Promise<Object>} 处理结果
     */
    async function processLotteryDynamic(dynamic, progressCallback, currentUid) {
        const result = {
            dynamicId: dynamic.id_str,
            deleted: false,
            unfollowed: false,
            reason: '',
            authorName: '',
            authorUid: '',
            lotteryStatus: null,
            isLottery: false,
            otherLotteryCount: 0,
            deleteAttempts: 0,
            deleteVerified: false
        };
        
        try {
            // 检查是否为转发的抽奖动态
            if (!dynamic.orig || !dynamic.orig.id_str) {
                result.reason = '不是转发动态';
                return result;
            }
            
            const origId = dynamic.orig.id_str;
            const authorInfo = dynamic.orig.modules?.module_author;
            
            if (authorInfo) {
                result.authorName = authorInfo.name;
                result.authorUid = authorInfo.mid;
            }
            
            progressCallback(`正在检查抽奖状态: ${result.authorName || '未知用户'}`);
            
            // 获取抽奖状态
            const lotteryData = await getLotteryStatus(origId);
            
            if (lotteryData.code !== 0) {
                result.reason = '不是抽奖动态';
                return result;
            }
            
            result.isLottery = true;
            result.lotteryStatus = lotteryData.data.status;
            
            // 0: 未开奖, 2: 已开奖
            if (result.lotteryStatus === 0) {
                result.reason = '抽奖未开奖，保留';
                return result;
            }
            
            if (result.lotteryStatus === 2) {
                progressCallback(`抽奖已开奖，准备删除动态并验证...`);
                
                // 删除已开奖的动态（使用带重试和验证的版本）
                if (GM_getValue('delete-finished-lottery')) {
                    const maxRetries = GM_getValue('delete-retry-count');
                    const deleteResult = await deleteDynamicWithRetry(dynamic.id_str, currentUid, maxRetries);
                    
                    result.deleteAttempts = deleteResult.attempts;
                    result.deleteVerified = deleteResult.verified;
                    
                    if (deleteResult.code === 0 && deleteResult.verified) {
                        result.deleted = true;
                        result.reason = `已开奖，动态已删除并验证成功 (尝试${deleteResult.attempts}次)`;
                    } else {
                        result.reason = `删除失败: ${deleteResult.message} (尝试${deleteResult.attempts}次)`;
                        // 如果删除失败，不继续处理取关逻辑
                        return result;
                    }
                }
                
                // 检查是否需要取关（只检查已关注且参与过抽奖的UP主）
                if (GM_getValue('smart-unfollow') && authorInfo && authorInfo.following) {
                    progressCallback(`检查UP主是否有其他抽奖...`);
                    
                    const otherLotteryCheck = await hasOtherUnfinishedLottery(result.authorUid, origId);
                    result.otherLotteryCount = otherLotteryCheck.otherLotteryCount;
                    
                    if (!otherLotteryCheck.hasOtherLottery) {
                        // 没有其他未开奖抽奖，可以取关
                        progressCallback(`准备取关UP主: ${result.authorName}`);
                        
                        const unfollowResult = await unfollowUser(result.authorUid);
                        if (unfollowResult.code === 0) {
                            result.unfollowed = true;
                            result.reason += '，已取关UP主';
                        } else {
                            result.reason += '，取关失败';
                        }
                    } else {
                        result.reason += `，UP主还有${result.otherLotteryCount}个抽奖，保持关注`;
                    }
                }
            }
            
        } catch (error) {
            console.error('处理动态失败:', error);
            result.reason = `处理失败: ${error.message}`;
        }
        
        return result;
    }

    /**
     * 主处理函数
     */
    async function processAllLotteryDynamics() {
        // 检查是否正在处理
        if (isProcessing) {
            sendNotification('已有处理任务在进行中，请等待完成后再试');
            return;
        }
        
        const uid = getCookie('DedeUserID');
        
        if (!uid) {
            sendNotification('未检测到登录状态');
            return;
        }
        
        // 设置处理状态
        isProcessing = true;
        currentProcessId = Date.now().toString();
        
        // 显示进度弹窗
        showProgressDialog();
        
        try {
            updateProgress(0, '正在获取动态列表...');
            
            let allDynamics = [];
            let offset = '';
            let hasMore = true;
            
            // 获取所有动态
            while (hasMore) {
                const dynamicsData = await getUserDynamics(uid, offset);
                
                if (dynamicsData.code !== 0) {
                    throw new Error(`获取动态失败: ${dynamicsData.message}`);
                }
                
                const items = dynamicsData.data.items || [];
                allDynamics = allDynamics.concat(items);
                
                offset = dynamicsData.data.offset;
                hasMore = dynamicsData.data.has_more && offset;
                
                updateProgress(10, `已获取 ${allDynamics.length} 条动态...`);
                
                // 添加延迟避免请求过频
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // 筛选出转发的抽奖动态
            const lotteryDynamics = [];
            const totalDynamics = allDynamics.length;
            
            updateProgress(20, '正在识别抽奖动态...');
            
            for (let i = 0; i < allDynamics.length; i++) {
                const dynamic = allDynamics[i];
                if (dynamic.orig && dynamic.orig.id_str) {
                    try {
                        const lotteryData = await getLotteryStatus(dynamic.orig.id_str);
                        if (lotteryData.code === 0) {
                            lotteryDynamics.push(dynamic);
                        }
                    } catch (error) {
                        // 不是抽奖动态，跳过
                    }
                }
                
                // 更新识别进度
                if (i % 10 === 0) {
                    const identifyProgress = 20 + (i / allDynamics.length) * 10;
                    updateProgress(identifyProgress, `正在识别抽奖动态... ${i}/${allDynamics.length}`);
                }
            }
            
            updateProgress(30, `找到 ${lotteryDynamics.length} 条抽奖动态`);
            
            if (lotteryDynamics.length === 0) {
                const finalResult = {
                    totalDynamics,
                    lotteryDynamics: 0,
                    deletedCount: 0,
                    keptCount: 0,
                    deleteFailedCount: 0,
                    unfollowedUsers: [],
                    keptFollowUsers: [],
                    results: []
                };
                
                updateProgress(100, '没有找到抽奖动态');
                showDetailedResults(finalResult);
                return;
            }
            
            // 处理每个抽奖动态
            const results = [];
            for (let i = 0; i < lotteryDynamics.length; i++) {
                const dynamic = lotteryDynamics[i];
                const progress = 30 + (i / lotteryDynamics.length) * 60;
                
                const result = await processLotteryDynamic(dynamic, (status) => {
                    updateProgress(progress, status);
                }, uid);
                
                results.push(result);
                
                // 增加更长的延迟避免触发验证码
                const delayTime = GM_getValue('operation-delay');
                await new Promise(resolve => setTimeout(resolve, delayTime));
            }
            
            // 统计结果
            const finalResult = analyzeResults(results, totalDynamics, lotteryDynamics.length);
            
            // 显示详细处理结果
            updateProgress(100, '处理完成');
            showDetailedResults(finalResult);
            
        } catch (error) {
            console.error('处理失败:', error);
            updateProgress(100, `处理失败: ${error.message}`);
            setTimeout(() => {
                hideProgressDialog();
                isProcessing = false;
            }, 3000);
        }
    }

    /**
     * 分析处理结果
     * @param {Array} results 处理结果数组
     * @param {number} totalDynamics 总动态数
     * @param {number} lotteryDynamics 抽奖动态数
     * @returns {Object} 统计结果
     */
    function analyzeResults(results, totalDynamics, lotteryDynamics) {
        const deletedCount = results.filter(r => r.deleted).length;
        const keptCount = results.filter(r => r.isLottery && r.lotteryStatus === 0).length;
        const deleteFailedCount = results.filter(r => r.lotteryStatus === 2 && !r.deleted).length;
        
        // 统计取关的用户
        const unfollowedUsers = results
            .filter(r => r.unfollowed)
            .map(r => ({
                name: r.authorName,
                uid: r.authorUid
            }));
        
        // 统计删除了动态但保持关注的用户
        const keptFollowUsers = results
            .filter(r => r.deleted && !r.unfollowed && r.authorUid && r.otherLotteryCount > 0)
            .map(r => ({
                name: r.authorName,
                uid: r.authorUid,
                otherLotteryCount: r.otherLotteryCount
            }));
        
        // 去重
        const uniqueUnfollowed = unfollowedUsers.filter((user, index, self) => 
            index === self.findIndex(u => u.uid === user.uid)
        );
        
        const uniqueKeptFollow = keptFollowUsers.filter((user, index, self) => 
            index === self.findIndex(u => u.uid === user.uid)
        );
        
        return {
            totalDynamics,
            lotteryDynamics,
            deletedCount,
            keptCount,
            deleteFailedCount,
            unfollowedUsers: uniqueUnfollowed,
            keptFollowUsers: uniqueKeptFollow,
            results
        };
    }

    /**
     * 显示进度对话框
     */
    function showProgressDialog() {
        // 先隐藏小窗口
        hideMiniProgress();
        
        const dialog = document.createElement('div');
        dialog.className = 'lottery-handler-popup';
        dialog.id = 'lottery-progress-dialog';
        
        dialog.innerHTML = `
            <div class="lottery-handler-content">
                <div class="lottery-handler-header">
                    <span>处理抽奖动态</span>
                    <button class="minimize-btn" id="minimize-btn" title="最小化">−</button>
                </div>
                <div class="lottery-handler-body">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="status-text" id="status-text">准备开始...</div>
                </div>
                <div class="lottery-handler-footer">
                    <button class="btn btn-secondary" id="cancel-btn">取消</button>
                </div>
            </div>
        `;
        
        // 绑定事件监听器
        const minimizeBtn = dialog.querySelector('#minimize-btn');
        const cancelBtn = dialog.querySelector('#cancel-btn');
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', minimizeProgressDialog);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', cancelProcess);
        }
        
        document.body.appendChild(dialog);
    }

    /**
     * 最小化进度对话框
     */
    function minimizeProgressDialog() {
        hideProgressDialog();
        showMiniProgress();
    }

    /**
     * 显示小窗口进度
     */
    function showMiniProgress() {
        let miniProgress = document.getElementById('mini-progress');
        if (!miniProgress) {
            miniProgress = document.createElement('div');
            miniProgress.className = 'mini-progress';
            miniProgress.id = 'mini-progress';
            
            miniProgress.innerHTML = `
                <div class="mini-header">
                    <span>处理中...</span>
                    <button class="expand-btn" id="expand-btn" title="展开">+</button>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="mini-progress-fill" style="width: 0%"></div>
                </div>
                <div class="status-text" id="mini-status-text">准备开始...</div>
            `;
            
            // 绑定展开按钮事件
            const expandBtn = miniProgress.querySelector('#expand-btn');
            if (expandBtn) {
                expandBtn.addEventListener('click', expandProgressDialog);
            }
            
            document.body.appendChild(miniProgress);
        }
        
        miniProgress.classList.add('show');
    }

    /**
     * 隐藏小窗口进度
     */
    function hideMiniProgress() {
        const miniProgress = document.getElementById('mini-progress');
        if (miniProgress) {
            miniProgress.classList.remove('show');
        }
    }

    /**
     * 展开进度对话框
     */
    function expandProgressDialog() {
        hideMiniProgress();
        showProgressDialog();
    }

    /**
     * 取消处理
     */
    function cancelProcess() {
        if (isProcessing) {
            const confirmed = confirm('确定要取消当前处理任务吗？');
            if (confirmed) {
                isProcessing = false;
                hideProgressDialog();
                hideMiniProgress();
                sendNotification('处理任务已取消');
            }
        } else {
            hideProgressDialog();
        }
    }

    /**
     * 更新进度
     * @param {number} percent 进度百分比
     * @param {string} status 状态文本
     */
    function updateProgress(percent, status) {
        // 更新主窗口进度
        const progressFill = document.getElementById('progress-fill');
        const statusText = document.getElementById('status-text');
        
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        
        if (statusText) {
            statusText.textContent = status;
        }
        
        // 同时更新小窗口进度
        const miniProgressFill = document.getElementById('mini-progress-fill');
        const miniStatusText = document.getElementById('mini-status-text');
        
        if (miniProgressFill) {
            miniProgressFill.style.width = `${percent}%`;
        }
        
        if (miniStatusText) {
            miniStatusText.textContent = status;
        }
    }

    /**
     * 隐藏进度对话框
     */
    function hideProgressDialog() {
        const dialog = document.getElementById('lottery-progress-dialog');
        if (dialog) {
            document.body.removeChild(dialog);
        }
    }

    /**
     * 显示详细处理结果
     * @param {Object} finalResult 最终结果统计
     */
    function showDetailedResults(finalResult) {
        // 重置处理状态
        isProcessing = false;
        
        // 隐藏进度窗口和小窗口
        hideProgressDialog();
        hideMiniProgress();
        
        const {
            totalDynamics,
            lotteryDynamics,
            deletedCount,
            keptCount,
            deleteFailedCount,
            unfollowedUsers,
            keptFollowUsers,
            results
        } = finalResult;
        
        const dialog = document.createElement('div');
        dialog.className = 'lottery-handler-popup';
        dialog.id = 'lottery-result-dialog';
        
        // 统计删除失败的动态
        const failedDynamics = results.filter(r => r.lotteryStatus === 2 && !r.deleted);
        
        dialog.innerHTML = `
            <div class="lottery-handler-content large">
                <div class="lottery-handler-header">
                    <span>处理完成 - 详细结果</span>
                </div>
                <div class="lottery-handler-body">
                    <div class="result-section">
                        <div class="result-title">📊 统计概览</div>
                        <div class="result-stats">
                            <div class="stat-item">
                                <div class="stat-number">${totalDynamics}</div>
                                <div class="stat-label">总动态数</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${lotteryDynamics}</div>
                                <div class="stat-label">抽奖动态</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${deletedCount}</div>
                                <div class="stat-label">成功删除</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number">${keptCount}</div>
                                <div class="stat-label">保留未开奖</div>
                            </div>
                            ${deleteFailedCount > 0 ? `
                            <div class="stat-item" style="border-color: #ff4d4f;">
                                <div class="stat-number" style="color: #ff4d4f;">${deleteFailedCount}</div>
                                <div class="stat-label">删除失败</div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    ${deleteFailedCount > 0 ? `
                    <div class="result-section">
                        <div class="result-title">⚠️ 删除失败的动态 (${deleteFailedCount})</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                            以下动态删除失败，可能触发了验证码或其他安全限制
                        </div>
                        <div class="user-list">
                            ${failedDynamics.map(result => `
                                <div class="user-item">
                                    <span class="user-name">${result.authorName || '未知用户'}</span>
                                    <span class="user-uid">动态ID: ${result.dynamicId}</span>
                                    <span style="color: #ff4d4f; font-size: 12px; margin-left: auto;">
                                        ${result.reason}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="result-section">
                        <div class="result-title">🚫 已取关UP主 (${unfollowedUsers.length})</div>
                        <div class="user-list">
                            ${unfollowedUsers.length > 0 ? 
                                unfollowedUsers.map(user => `
                                    <div class="user-item">
                                        <span class="user-name">${user.name}</span>
                                        <span class="user-uid">UID: ${user.uid}</span>
                                    </div>
                                `).join('') : 
                                '<div class="no-data">没有取关任何UP主</div>'
                            }
                        </div>
                    </div>
                    
                    <div class="result-section">
                        <div class="result-title">💝 保持关注UP主 (${keptFollowUsers.length})</div>
                        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                            以下UP主的抽奖动态已删除，但因还有其他未开奖抽奖而保持关注
                        </div>
                        <div class="user-list">
                            ${keptFollowUsers.length > 0 ? 
                                keptFollowUsers.map(user => `
                                    <div class="user-item">
                                        <span class="user-name">${user.name}</span>
                                        <span class="user-uid">UID: ${user.uid}</span>
                                        <span style="color: #00a1d6; font-size: 12px; margin-left: auto;">
                                            还有${user.otherLotteryCount}个抽奖
                                        </span>
                                    </div>
                                `).join('') : 
                                '<div class="no-data">没有此类UP主</div>'
                            }
                        </div>
                    </div>
                </div>
                <div class="lottery-handler-footer">
                    <button class="btn btn-secondary" id="export-btn">导出详情</button>
                    <button class="btn btn-success" id="finish-btn">完成</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // 绑定事件监听器
        const exportBtn = dialog.querySelector('#export-btn');
        const finishBtn = dialog.querySelector('#finish-btn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                exportResults(btoa(JSON.stringify(results)));
            });
        }
        
        if (finishBtn) {
            finishBtn.addEventListener('click', hideResultDialog);
        }
        
        // 发送通知
        const notificationMsg = deleteFailedCount > 0 
            ? `处理完成！成功删除 ${deletedCount} 条，失败 ${deleteFailedCount} 条，取关 ${unfollowedUsers.length} 个UP主` 
            : `处理完成！删除 ${deletedCount} 条动态，取关 ${unfollowedUsers.length} 个UP主`;
        
        sendNotification(notificationMsg);
        
        // 详细结果输出到控制台
        console.log('📊 处理完成，详细结果:', finalResult);
    }

    /**
     * 隐藏结果对话框
     */
    function hideResultDialog() {
        const dialog = document.getElementById('lottery-result-dialog');
        if (dialog) {
            document.body.removeChild(dialog);
        }
    }

    /**
     * 导出处理结果
     * @param {string} encodedResults Base64编码的结果数据
     */
    function exportResults(encodedResults) {
        try {
            const results = JSON.parse(atob(encodedResults));
            const exportData = {
                timestamp: new Date().toLocaleString(),
                summary: {
                    totalProcessed: results.length,
                    deleted: results.filter(r => r.deleted).length,
                    kept: results.filter(r => r.isLottery && r.lotteryStatus === 0).length,
                    unfollowed: results.filter(r => r.unfollowed).length
                },
                details: results.map(r => ({
                    动态ID: r.dynamicId,
                    UP主: r.authorName,
                    UP主UID: r.authorUid,
                    抽奖状态: r.lotteryStatus === 0 ? '未开奖' : (r.lotteryStatus === 2 ? '已开奖' : '未知'),
                    是否删除: r.deleted ? '是' : '否',
                    是否取关: r.unfollowed ? '是' : '否',
                    其他抽奖数量: r.otherLotteryCount || 0,
                    处理结果: r.reason
                }))
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `B站抽奖处理结果_${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            sendNotification('结果已导出到文件');
        } catch (error) {
            console.error('导出失败:', error);
            sendNotification('导出失败，请查看控制台');
        }
    }

    /**
     * 显示设置对话框
     */
    function showSettingsDialog() {
        // 检查是否正在处理，如果是则提示用户
        if (isProcessing) {
            alert('正在处理抽奖动态，请等待完成后再修改设置。');
            return;
        }
        
        // 检查是否已有设置对话框打开
        if (document.getElementById('lottery-settings-dialog')) {
            return;
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'lottery-handler-popup';
        dialog.id = 'lottery-settings-dialog';
        
        dialog.innerHTML = `
            <div class="lottery-handler-content">
                <div class="lottery-handler-header">
                    <span>设置</span>
                </div>
                <div class="lottery-handler-body">
                    <div class="config-item">
                        <label class="config-label">智能取关功能</label>
                        <input type="checkbox" class="config-input" id="smart-unfollow" ${GM_getValue('smart-unfollow') ? 'checked' : ''} ${isProcessing ? 'disabled' : ''}>
                    </div>
                    <div class="config-item">
                        <label class="config-label">删除已开奖动态</label>
                        <input type="checkbox" class="config-input" id="delete-finished-lottery" ${GM_getValue('delete-finished-lottery') ? 'checked' : ''} ${isProcessing ? 'disabled' : ''}>
                    </div>
                    <div class="config-item">
                        <label class="config-label">删除重试次数</label>
                        <input type="number" class="config-input" id="delete-retry-count" value="${GM_getValue('delete-retry-count')}" min="1" max="5" ${isProcessing ? 'disabled' : ''}>
                    </div>
                    <div class="config-item">
                        <label class="config-label">操作延迟(毫秒)</label>
                        <input type="number" class="config-input" id="operation-delay" value="${GM_getValue('operation-delay')}" min="1000" max="10000" step="500" ${isProcessing ? 'disabled' : ''}>
                    </div>
                    <div style="margin-top: 15px; padding: 10px; background-color: #f5f5f5; border-radius: 5px; font-size: 12px; color: #666;">
                        <p><strong>⚠️ 安全提醒：</strong></p>
                        <p>• 智能取关：仅取关参与过抽奖且无其他未开奖抽奖的UP主</p>
                        <p>• 删除验证机制：删除后会验证是否真的删除成功</p>
                        <p>• 删除重试：如果删除失败会自动重试指定次数</p>
                        <p>• 操作延迟：每次操作间隔时间，避免触发验证码</p>
                        <p>• 建议延迟设置为1500毫秒以上</p>
                    </div>
                </div>
                <div class="lottery-handler-footer">
                    <button class="btn btn-secondary" id="cancel-settings-btn" ${isProcessing ? 'disabled' : ''}>取消</button>
                    <button class="btn btn-primary" id="save-settings-btn" ${isProcessing ? 'disabled' : ''}>保存</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // 绑定事件监听器
        const cancelBtn = dialog.querySelector('#cancel-settings-btn');
        const saveBtn = dialog.querySelector('#save-settings-btn');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideSettingsDialog);
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveSettings);
        }
    }

    /**
     * 隐藏设置对话框
     */
    function hideSettingsDialog() {
        const dialog = document.getElementById('lottery-settings-dialog');
        if (dialog) {
            document.body.removeChild(dialog);
        }
    }

    /**
     * 保存设置
     */
    function saveSettings() {
        const smartUnfollow = document.getElementById('smart-unfollow').checked;
        const deleteFinishedLottery = document.getElementById('delete-finished-lottery').checked;
        const deleteRetryCount = parseInt(document.getElementById('delete-retry-count').value);
        const operationDelay = parseInt(document.getElementById('operation-delay').value);
        
        // 验证设置值
        if (deleteRetryCount < 1 || deleteRetryCount > 5) {
            alert('删除重试次数必须在1-5之间');
            return;
        }
        
        if (operationDelay < 1000 || operationDelay > 10000) {
            alert('操作延迟必须在1000-10000毫秒之间');
            return;
        }
        
        GM_setValue('smart-unfollow', smartUnfollow);
        GM_setValue('delete-finished-lottery', deleteFinishedLottery);
        GM_setValue('delete-retry-count', deleteRetryCount);
        GM_setValue('operation-delay', operationDelay);
        
        sendNotification('设置已保存');
        hideSettingsDialog();
    }

    /**
     * 初始化
     */
    function init() {
        initConfig();
        
        // 将所有需要在HTML onclick中使用的函数添加到全局作用域
        window.hideProgressDialog = hideProgressDialog;
        window.minimizeProgressDialog = minimizeProgressDialog;
        window.expandProgressDialog = expandProgressDialog;
        window.cancelProcess = cancelProcess;
        window.hideResultDialog = hideResultDialog;
        window.exportResults = exportResults;
        window.hideSettingsDialog = hideSettingsDialog;
        window.saveSettings = saveSettings;
        
        // 注册菜单命令
        GM_registerMenuCommand('开始智能处理', processAllLotteryDynamics);
        GM_registerMenuCommand('设置', showSettingsDialog);
        
        sendNotification('B站抽奖动态智能处理脚本已加载');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();