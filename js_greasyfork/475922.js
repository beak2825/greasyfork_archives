// ==UserScript==
// @name          Otoy 自动操作脚本
// @namespace     http://tampermonkey.net/
// @version       3.6
// @description   自动填充账号和密码并登录，检查订阅状态，显示状态信息及欧元汇率(每日10点后更新)
// @author        wxm
// @match         https://*.otoy.com/*
// @grant         GM_setClipboard
// @grant         GM_notification
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_deleteValue
// @grant         GM_xmlhttpRequest
// @connect       api.exchangerate.host
// @connect       script.google.com
// @connect       script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/475922/Otoy%20%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475922/Otoy%20%E8%87%AA%E5%8A%A8%E6%93%8D%E4%BD%9C%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('>>> Otoy Script STARTING EXECUTION - v20250507-Debug <<<'); // 添加非常靠前的日志

    // --- Google Sheet Integration Configuration ---
    // 【请务必修改】替换为您的 Google Apps Script Web App URL
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyawt-t4yiF0M7h2yfsOyxRj2E7Da5Tbc7cxbMempzeXNV-ieDF_eRd2n3dvLbgb0AL/exec';
    // 【请务必修改】替换为您在 Google Apps Script 中设置的相同的 SECRET_TOKEN
    const GAS_SECRET_TOKEN = 'kGj3hD9sLpQrXuVzW7bN2mYcE4fRtUaI0oPqS8wZ1vFxA5eBnM6tHyJkL'; // 此处应为您脚本中的实际token
    const TEMP_LOGIN_ACCOUNT_KEY = 'otoy_temp_login_account_for_upload';
    const TEMP_PASSWORD_KEY = 'otoy_temp_password_for_upload';
    // --- End Google Sheet Integration Configuration ---

    // --- Workflow State Management Constants ---
    // REMOVED: const WORKFLOW_STAGE_KEY = 'otoy_workflow_stage';
    // REMOVED: const SUBS_TO_PROCESS_KEY = 'otoy_subs_to_process_list'; // Stores subIDs to be processed (e.g., for cancellation)
    // REMOVED: const FINAL_SUB_INFO_KEY = 'otoy_final_sub_info_for_sheet'; // Stores data collected for final Google Sheet entry
    // REMOVED: const TARGET_SUBID_FOR_PAYMENT_DATE_KEY = 'otoy_target_subid_for_payment_date'; // subID of the latest expiry sub to fetch payment date for
    const CANCELLED_SUB_IDS_LIST_KEY = 'otoy_cancelled_sub_ids_list'; // Stays - stores SubIDs that have been processed for cancellation
    
    // NEW GM Value Keys
    // REMOVED: const LATEST_PAYMENT_DATE_KEY = 'otoy_latest_payment_date'; // Stores YYYY-MM-DD
    const LATEST_PAYMENT_INFO_KEY = 'otoy_latest_payment_info'; // Stores { subID: 'xxxx', paymentDate: 'YYYY-MM-DD' }
    const SUBSCRIPTION_CANCELLED_STATUS_KEY = 'otoy_subscription_cancelled'; // Boolean: true if all current subs are cancelled
    const DETAIL_PAGE_TASK_KEY = 'otoy_detail_page_task'; // String: 'process_new_sub', 'cancel_renewal', 'fetch_payment_date'
    const PROCESSING_SUB_ID_KEY = 'otoy_processing_sub_id'; // String: SubID currently being handled on detail page
    const SUBS_TO_PROCESS_QUEUE_KEY = 'otoy_subs_to_process_queue'; // JSON Array of SubIDs: queue for cancellation run
    const FETCH_ATTEMPTED_SUBID_KEY = 'otoy_fetch_attempted_subid'; // Flag to prevent fetch loop
    const SYNC_STATUS_MESSAGE_KEY = 'otoy_sync_status_message'; // NEW: Stores sync status message
    // --- End Workflow State Management Constants ---

    // REMOVED Workflow Stages Constants
    // const STAGE_INIT = 'INIT';
    // const STAGE_PROCESS_SUBS_STARTED = 'PROCESS_SUBS_STARTED';
    // const STAGE_PROCESSING_SUB_ID = 'PROCESSING_SUB_ID_';
    // const STAGE_ALL_SUBS_PROCESSED = 'ALL_SUBS_PROCESSED';
    // const STAGE_FETCHING_PAYMENT_DATE = 'FETCHING_FINAL_PAYMENT_DATE_FOR_SUB_ID_';
    // const STAGE_READY_TO_SEND = 'READY_TO_SEND_TO_SHEET';
    // const STAGE_COMPLETED = 'COMPLETED_AND_IDLE';
    // --- End Workflow State Management Constants ---

    const CONFIG = {
        // 定义所有需要用到的URL地址
        URLS: {
            // 注册页面URL
            SIGN_UP: 'https://account.otoy.com/sign_up',
            // 登录页面URL
            SIGN_IN: 'https://account.otoy.com/sign_in',
            // 主页URL
            HOME: 'https://home.otoy.com/',
            // 购买记录页面URL
            // PURCHASES: 'https://render.otoy.com/account/purchases.php', // 已移除
            // 订阅页面URL (新增)
            SUBSCRIPTIONS: 'https://render.otoy.com/account/subscriptions.php',
            // 银行卡管理页面URL
            CARDS: 'https://render.otoy.com/account/cards.php',
            // 新购买页面URL(默认购买1个月的订阅)
            PURCHASE_NEW: 'https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10'
        },
        DEFAULT_VALUES: {
            PASSWORD: 'octane',
            ADDRESS: 'chengdu',
            ZIP: '000000',
            COUNTRY: 'CHN'
        },
        INTERVALS: {
            LOGIN_REDIRECT: 30000,
            PAYMENT_CHECK: 500
        }
    };

    const utils = {
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}年${month}月${day}日`;
        },

        // 新增：解析 YYYY年MM月DD日 格式的日期字符串
        // 修改：现在同时支持 YYYY-MM-DD 格式
        parseFormattedDate(dateString) {
            if (!dateString || typeof dateString !== 'string') return null;

            let year, month, day;
            let match;

            // 尝试匹配 YYYY年MM月DD日
            match = dateString.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
            if (match) {
                year = parseInt(match[1], 10);
                month = parseInt(match[2], 10); // 月份是 1-12
                day = parseInt(match[3], 10);
                console.log(`[utils.parseFormattedDate] Matched YYYY年MM月DD日 format for: "${dateString}"`);
            } else {
                // 尝试匹配 YYYY-MM-DD
                match = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
                if (match) {
                    year = parseInt(match[1], 10);
                    month = parseInt(match[2], 10); // 月份是 1-12
                    day = parseInt(match[3], 10);
                    console.log(`[utils.parseFormattedDate] Matched YYYY-MM-DD format for: "${dateString}"`);
                }
            }

            // 如果任一格式匹配成功，则进行验证
            if (year !== undefined && month !== undefined && day !== undefined) {
                // 基本验证月份和日期范围
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    // 注意：Date 对象构造函数月份是 0-11
                    const date = new Date(year, month - 1, day);
                    // 进一步验证防止如 "2023年02月30日" 或 "2023-02-30" 这样的无效日期被 Date 对象自动调整
                    // 检查 Date 对象生成的年、月、日是否与输入匹配
                    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                         console.log(`[utils.parseFormattedDate] Successfully parsed date: ${date.toISOString()}`);
                         return date; // 解析成功，返回 Date 对象
                    } else {
                         console.warn(`[utils.parseFormattedDate] Date validation failed for year=${year}, month=${month}, day=${day}. Input: "${dateString}"`);
                    }
                } else {
                     console.warn(`[utils.parseFormattedDate] Month or day out of range for year=${year}, month=${month}, day=${day}. Input: "${dateString}"`);
                }
            }

            // 如果两种格式都不匹配或日期验证失败
            console.error(`[utils.parseFormattedDate] Failed to parse date string or date is invalid: "${dateString}" (Supported formats: YYYY年MM月DD日 or YYYY-MM-DD)`);
            return null; // 解析失败返回 null
        },

        formatRemainingTime(milliseconds) {
            if (milliseconds < 0) milliseconds = 0;
            const totalSeconds = Math.floor(milliseconds / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        },

        getElement(id) {
            return document.getElementById(id);
        },

        safeClick(element) {
            if (element) {
                element.click();
                return true;
            }
            return false;
        },

        showNotification(text) {
            // 添加全局样式（仅添加一次）
            if (!document.getElementById('otoy-global-styles')) {
                const globalStyle = document.createElement('style');
                globalStyle.id = 'otoy-global-styles';
                globalStyle.textContent = `
                    /* CSS变量定义 */
                    :root {
                        --otoy-primary: #1E88E5;
                        --otoy-primary-hover: #1976D2;
                        --otoy-primary-light: #64B5F6;
                        --otoy-success: #4CAF50;
                        --otoy-success-hover: #388E3C;
                        --otoy-success-light: #81C784;
                        --otoy-warning: #FF9800;
                        --otoy-warning-hover: #F57C00;
                        --otoy-warning-light: #FFB74D;
                        --otoy-error: #F44336;
                        --otoy-error-hover: #D32F2F;
                        --otoy-error-light: #EF5350;
                        --otoy-neutral-100: #F5F5F5;
                        --otoy-neutral-200: #EEEEEE;
                        --otoy-neutral-300: #E0E0E0;
                        --otoy-neutral-400: #BDBDBD;
                        --otoy-neutral-500: #9E9E9E;
                        --otoy-neutral-600: #757575;
                        --otoy-neutral-700: #616161;
                        --otoy-neutral-800: #424242;
                        --otoy-neutral-900: #212121;
                        --otoy-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
                        --otoy-shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
                        --otoy-shadow-md: 0 4px 12px rgba(0,0,0,0.15);
                        --otoy-shadow-lg: 0 8px 24px rgba(0,0,0,0.2);
                        --otoy-shadow-xl: 0 12px 48px rgba(0,0,0,0.3);
                        --otoy-radius-sm: 4px;
                        --otoy-radius-md: 8px;
                        --otoy-radius-lg: 12px;
                        --otoy-radius-xl: 16px;
                        --otoy-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    /* 全局动画 */
                    @keyframes otoySlideIn {
                        from {
                            transform: translateX(-50%) translateY(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(-50%) translateY(0);
                            opacity: 1;
                        }
                    }

                    @keyframes otoySlideOut {
                        from {
                            transform: translateX(-50%) translateY(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(-50%) translateY(-20px);
                            opacity: 0;
                        }
                    }

                    @keyframes otoyFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes otoyPulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    }

                    @keyframes otoyShake {
                        0%, 100% { transform: translateX(0); }
                        25% { transform: translateX(-5px); }
                        75% { transform: translateX(5px); }
                    }
                `;
                document.head.appendChild(globalStyle);
            }

            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, rgba(30, 136, 229, 0.95) 0%, rgba(21, 101, 192, 0.95) 100%);
                color: white;
                padding: 14px 24px;
                border-radius: var(--otoy-radius-lg);
                z-index: 10000;
                font-size: 14px;
                font-family: var(--otoy-font-family);
                box-shadow: var(--otoy-shadow-lg);
                backdrop-filter: blur(8px);
                animation: otoySlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                display: flex;
                align-items: center;
                gap: 12px;
                max-width: 90vw;
                min-width: 280px;
            `;

            // 添加图标
            const icon = document.createElement('span');
            icon.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                flex-shrink: 0;
            `;
            icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>`;

            const textSpan = document.createElement('span');
            textSpan.textContent = text;
            textSpan.style.cssText = `
                flex: 1;
                line-height: 1.4;
            `;

            notification.appendChild(icon);
            notification.appendChild(textSpan);
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'otoySlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        },

        async copyToClipboard(text) { // 添加 async
            console.log('[utils.copyToClipboard] 尝试复制:', text);
            try {
                // 首先检查 navigator.clipboard 是否存在且 writeText 是函数
                if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                    console.log('[utils.copyToClipboard] 尝试使用 navigator.clipboard.writeText...');
                    await navigator.clipboard.writeText(text); // 使用 await
                    console.log('[utils.copyToClipboard] navigator.clipboard.writeText 成功。');
                    utils.showNotification('复制成功！');
                } else {
                    // 如果 navigator.clipboard 不可用，直接抛出错误进入 catch 块处理 GM
                    console.log('[utils.copyToClipboard] navigator.clipboard API 不可用或 writeText 不可用，尝试 GM_setClipboard...');
                    throw new Error('Navigator clipboard not available or writeText is not a function'); // 更具体的错误信息
                }
            } catch (navErr) {
                // 统一处理 navigator 失败或不可用的情况
                console.error('[utils.copyToClipboard] navigator.clipboard 操作失败或不可用:', navErr.message);
                console.log('[utils.copyToClipboard] 尝试 GM_setClipboard 作为后备...');
                try {
                    // 检查 GM_setClipboard 是否存在
                    if (typeof GM_setClipboard === 'function') {
                         GM_setClipboard(text);
                         console.log('[utils.copyToClipboard] GM_setClipboard 成功。');
                         utils.showNotification('通过备用方式复制成功！');
                    } else {
                         console.log('[utils.copyToClipboard] GM_setClipboard 不可用。');
                         throw new Error('GM_setClipboard is not available'); // 抛出错误给下一个 catch
                    }
                } catch (gmErr) {
                    // 处理 GM_setClipboard 失败或不可用的情况
                    console.error('[utils.copyToClipboard] GM_setClipboard 失败或不可用:', gmErr.message);
                    console.log('[utils.copyToClipboard] 调用 fallbackCopy...');
                    utils.fallbackCopy(text); // fallbackCopy 不需要 try-catch，因为它只是显示通知
                }
            }
        },

        fallbackCopy(text) {
            this.showNotification('复制失败，请手动复制：' + text);
        },

        // --- 新增：日期辅助函数 ---
        getTodayDateString() {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // --- 日期辅助函数结束 ---

        // --- 新增：日期比较辅助函数 ---
        isDateWithinDays(dateString, referenceDate, days) {
            const dateToCompare = this.parseFormattedDate(dateString);
            if (!dateToCompare) return false; //无法解析日期字符串

            // 克隆参考日期并清除时间部分
            const refDateClean = new Date(referenceDate.getTime());
            refDateClean.setHours(0, 0, 0, 0);

            // 清除比较日期的时间部分
            dateToCompare.setHours(0, 0, 0, 0);

            // 计算日期差异（毫秒）
            const diffTime = refDateClean.getTime() - dateToCompare.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // 如果 dateToCompare 等于 referenceDate 或在其前 days 天内，则 diffDays 的范围是 [0, days]
            return diffDays >= 0 && diffDays <= days;
        },
        // --- 日期比较辅助函数结束 ---

        // --- 修改：API 获取函数，针对 exchangerate.host ---
        async fetchEurCnyRateFromApi(apiKey) { // Renamed and logic updated
            return new Promise((resolve, reject) => {
                const apiUrl = `https://api.exchangerate.host/live?access_key=${apiKey}`; // No currencies needed, rely on default USD base
                console.log('[utils.fetchEurCnyRateFromApi] Requesting URL:', apiUrl);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    timeout: 15000, // Increased timeout slightly
                    onload: function(response) {
                        try {
                            console.log('[utils.fetchEurCnyRateFromApi] Received response status:', response.status);
                            if (response.status >= 200 && response.status < 300) {
                                const data = JSON.parse(response.responseText);
                                if (data.success === true) {
                                    // Expecting USD base, need USDCNY and USDEUR
                                    if (data.quotes && data.quotes.USDCNY && data.quotes.USDEUR) {
                                        const usdCny = data.quotes.USDCNY;
                                        const usdEur = data.quotes.USDEUR;
                                        console.log(`[utils.fetchEurCnyRateFromApi] USD/CNY: ${usdCny}, USD/EUR: ${usdEur}`);
                                        if (typeof usdCny === 'number' && typeof usdEur === 'number' && usdEur !== 0) {
                                            const eurCnyRate = usdCny / usdEur;
                                            console.log(`[utils.fetchEurCnyRateFromApi] Calculated EUR/CNY: ${eurCnyRate}`);
                                            resolve(eurCnyRate);
                                        } else {
                                            console.error('[utils.fetchEurCnyRateFromApi] Invalid rate data received or division by zero.');
                                            reject(new Error('无效的汇率数据'));
                                        }
                                    } else {
                                        console.error('[utils.fetchEurCnyRateFromApi] API response missing required quotes (USDCNY or USDEUR). Response:', data);
                                        reject(new Error('API响应缺少必要的汇率报价 (USDCNY/USDEUR)'));
                                    }
                                } else {
                                    // Log the full error object from exchangerate.host
                                    console.error('[utils.fetchEurCnyRateFromApi] API request failed. Full Response Data:', data);
                                    const errorInfo = data.error && typeof data.error === 'object' ? ` (Code ${data.error.code}: ${data.error.info})` : ' (No specific error details provided in response)';
                                    reject(new Error(`API请求失败${errorInfo}`));
                                }
                            } else {
                                 console.error('[utils.fetchEurCnyRateFromApi] HTTP error status:', response.status, response.statusText);
                                 reject(new Error(`HTTP错误: ${response.status} ${response.statusText}`));
                            }
                        } catch (e) {
                             console.error('[utils.fetchEurCnyRateFromApi] Error parsing response or processing data:', e);
                             // Include original response text for debugging JSON parse errors
                             console.error('[utils.fetchEurCnyRateFromApi] Raw response text:', response.responseText);
                             reject(new Error('解析响应或处理数据时出错'));
                        }
                    },
                    onerror: function(error) {
                         console.error('[utils.fetchEurCnyRateFromApi] GM_xmlhttpRequest network error:', error);
                         reject(new Error('网络请求错误'));
                    },
                    ontimeout: function() {
                         console.error('[utils.fetchEurCnyRateFromApi] GM_xmlhttpRequest timeout.');
                         reject(new Error('请求超时'));
                    }
                });
            });
        }, // End fetchEurCnyRateFromApi

        // --- 新增：处理汇率获取、存储和时间逻辑的主函数 ---
        async getEurCnyRate(apiKey) {
            const storageKey = 'otoy_eur_cny_rate_info'; // Key for storing { rate: number, date: string }
            const todayString = this.getTodayDateString();
            const currentHour = new Date().getHours();
            const storedInfo = await GM_getValue(storageKey, null);
            let oldRate = null;

            console.log(`[utils.getEurCnyRate] Today: ${todayString}, Current Hour: ${currentHour}`);
            console.log('[utils.getEurCnyRate] Stored Info:', storedInfo);

            if (storedInfo && typeof storedInfo === 'object' && storedInfo.rate && storedInfo.date) {
                oldRate = storedInfo.rate; // Store old rate for fallback
                if (storedInfo.date === todayString) {
                    console.log(`[utils.getEurCnyRate] Using stored rate ${storedInfo.rate} from today (${storedInfo.date}).`);
                    return Promise.resolve(storedInfo.rate); // Situation 1: Use today's stored rate
                } else {
                    console.log(`[utils.getEurCnyRate] Stored rate is from a previous date (${storedInfo.date}).`);
                }
            } else {
                 console.log('[utils.getEurCnyRate] No valid stored rate info found.');
            }

            // --- No rate stored for today ---

            if (currentHour >= 10) {
                // Situation 2: Time is >= 10 AM, try fetching new rate
                console.log('[utils.getEurCnyRate] Past 10 AM, attempting to fetch new rate...');
                try {
                    const newRate = await this.fetchEurCnyRateFromApi(apiKey);
                    console.log('[utils.getEurCnyRate] Successfully fetched new rate:', newRate);
                    await GM_setValue(storageKey, { rate: newRate, date: todayString });
                    console.log(`[utils.getEurCnyRate] Stored new rate ${newRate} for date ${todayString}.`);
                    return Promise.resolve(newRate);
                } catch (fetchError) {
                    console.error('[utils.getEurCnyRate] Failed to fetch new rate:', fetchError);
                    if (oldRate !== null) {
                        console.warn(`[utils.getEurCnyRate] Fetch failed, using stale rate ${oldRate} as fallback.`);
                        return Promise.resolve(oldRate); // Fallback to old rate if fetch fails
                    } else {
                        console.error('[utils.getEurCnyRate] Fetch failed and no stale rate available.');
                        return Promise.reject(fetchError); // No old rate, reject with the fetch error
                    }
                }
            } else {
                // Situation 3: Time is < 10 AM
                console.log('[utils.getEurCnyRate] Before 10 AM and no rate stored for today.');
                if (oldRate !== null) {
                     console.log(`[utils.getEurCnyRate] Using stale rate ${oldRate} before 10 AM.`);
                     return Promise.resolve(oldRate); // Use old rate if available
                } else {
                     console.log('[utils.getEurCnyRate] No stale rate available, returning WAITING status.');
                     return Promise.resolve('WAITING'); // No old rate, signal waiting
                }
            }
        }, // This is the original line 334, the end of getEurCnyRate
        // --- 汇率主函数结束 ---  // This comment might be slightly misplaced if it was after the brace

        // --- Google Sheet Data Sending Utility ---
        sendDataToGoogleSheet: async function(dataFields) { // 函数签名修改，直接接收包含所有数据的对象
            if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
                console.error('[sendDataToGoogleSheet] Google Apps Script Web App URL 未配置。');
                // utils.showNotification('错误：数据同步URL未配置'); // REMOVED
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 配置错误'); // Keep await here, it's in async function
                return false;
            }
            if (!GAS_SECRET_TOKEN || GAS_SECRET_TOKEN.length < 30) { 
                console.error('[sendDataToGoogleSheet] Google Apps Script Secret Token 未配置或过短。');
                // utils.showNotification('错误：数据同步令牌未配置'); // REMOVED
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 配置错误'); // Keep await here
                return false;
            }
            // 验证传入的 dataFields 是否包含必要字段
            if (!dataFields || typeof dataFields !== 'object' || 
                typeof dataFields.username === 'undefined' || 
                typeof dataFields.email === 'undefined' || 
                typeof dataFields.password === 'undefined' || // 密码可以是空字符串，但字段必须存在
                typeof dataFields.paymentDate === 'undefined' || // 新增 paymentDate
                typeof dataFields.expiryDate === 'undefined') {
                console.error('[sendDataToGoogleSheet] 传入的 dataFields 无效或缺少必要字段 (username, email, password, paymentDate, expiryDate)。Data:', dataFields);
                // utils.showNotification('错误：发送到表格的数据不完整'); // REMOVED
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 数据不完整'); // Keep await here
                return false;
            }
            
            const payload = {
                token: GAS_SECRET_TOKEN,
                username: dataFields.username,
                email: dataFields.email,
                password: dataFields.password, // 直接使用传入的密码
                timestamp: dataFields.paymentDate, // 修改：使用 paymentDate 作为Apps Script期望的 timestamp
                expiryDate: dataFields.expiryDate,
            };

            console.log('[sendDataToGoogleSheet] 准备发送数据:', { ...payload, password: '[REDACTED]' });

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: GAS_WEB_APP_URL,
                    data: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000, 
                    onload: function(response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            if (response.status === 200 && result.status === 'success') {
                                console.log('[sendDataToGoogleSheet] 数据成功发送到 Google Sheet:', result.message);
                                // utils.showNotification('充值记录已同步！'); // REMOVED
                                GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步成功'); // REMOVED await
                                // 移除：不再从此函数清除 TEMP_LOGIN_ACCOUNT_KEY 和 TEMP_PASSWORD_KEY
                                resolve(true);
                            } else {
                                console.error('[sendDataToGoogleSheet] 发送数据错误或服务器错误:', response.status, response.responseText);
                                // utils.showNotification(`记录同步失败: ${result.message || response.statusText}`); // REMOVED
                                GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步失败: ${result.message || response.statusText}`); // REMOVED await
                                resolve(false);
                            }
                        } catch (e) {
                            console.error('[sendDataToGoogleSheet] 解析服务器响应错误:', e, response.responseText);
                            // utils.showNotification('记录同步失败: 响应错误'); // REMOVED
                            GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 响应解析错误'); // REMOVED await
                            resolve(false);
                        }
                    },
                    onerror: function(error) {
                        console.error('[sendDataToGoogleSheet] 网络错误:', error);
                        // utils.showNotification('记录同步失败: 网络错误'); // REMOVED
                        GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 网络错误'); // REMOVED await
                        resolve(false);
                    },
                    ontimeout: function() {
                        console.error('[sendDataToGoogleSheet] 请求超时。');
                        // utils.showNotification('记录同步失败: 请求超时'); // REMOVED
                        GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步失败: 请求超时'); // REMOVED await
                        resolve(false);
                    }
                }); // Semicolon was missing here
            });
        }, // --- End Google Sheet Data Sending Utility ---

        // --- Workflow Cleanup Utility ---
        cleanupWorkflowStatus: async function() {
            console.log('[cleanupWorkflowStatus] Clearing specific workflow GM_values for reset or completion...');
            try {
                // Clear task-specific GM values instead of all old ones
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                await GM_deleteValue(SUBS_TO_PROCESS_QUEUE_KEY);
                // LATEST_PAYMENT_DATE_KEY might be preserved or cleared depending on context.
                // SUBSCRIPTION_CANCELLED_STATUS_KEY is managed by main logic.
                // CANCELLED_SUB_IDS_LIST_KEY is usually preserved unless a full reset.
                
                // Old values that might still exist and should be cleared if a full reset is intended
                await GM_deleteValue('otoy_workflow_stage'); // old key
                await GM_deleteValue('otoy_subs_to_process_list'); // old key
                await GM_deleteValue('otoy_final_sub_info_for_sheet'); // old key
                await GM_deleteValue('otoy_target_subid_for_payment_date'); // old key
                await GM_deleteValue('otoy_original_expiry_date'); // Often temporary

                console.log('[cleanupWorkflowStatus] Specific workflow GM_values cleared.');
            } catch (e) {
                console.error('[cleanupWorkflowStatus] Error clearing workflow GM_values:', e);
            }
        },
        // --- End Workflow Cleanup Utility ---

        // NEW: Utility to clear user-specific session data on logout
        clearUserSessionData: async function() {
            console.log('[utils.clearUserSessionData] Clearing user session GM values...');
            const keysToClear = [
                'otoy_username',
                'otoy_email',
                'otoy_expiry_date',
                SUBSCRIPTION_CANCELLED_STATUS_KEY,
                'otoy_card_deleted',
                LATEST_PAYMENT_INFO_KEY, // Replaced LATEST_PAYMENT_DATE_KEY
                CANCELLED_SUB_IDS_LIST_KEY,
                SUBS_TO_PROCESS_QUEUE_KEY,
                'otoy_calculated_renewal_expiry_date',
                'otoy_original_expiry_date_for_renewal_copy',
                'otoy_status_message',
                TEMP_LOGIN_ACCOUNT_KEY,
                TEMP_PASSWORD_KEY,
                DETAIL_PAGE_TASK_KEY,      // Task-specific, good to clear on logout
                PROCESSING_SUB_ID_KEY,      // Task-specific, good to clear on logout
                SYNC_STATUS_MESSAGE_KEY    // ADDED: Clear sync status on logout
            ];

            let clearedCount = 0;
            let errorCount = 0;

            for (const key of keysToClear) {
                try {
                    if (key) { // Ensure key is not undefined/null if array is ever malformed
                        await GM_deleteValue(key);
                        clearedCount++;
                    }
                } catch (e) {
                    console.error(`[utils.clearUserSessionData] Error deleting GM value for key '${key}':`, e);
                    errorCount++;
                }
            }
            console.log(`[utils.clearUserSessionData] Finished clearing. ${clearedCount} keys processed for deletion, ${errorCount} errors.`);
        },

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:30:00 +08:00
        // Reason: P3-UTILS-001 - 创建手动同步数据收集函数，提取handleSubscriptions中的数据收集逻辑，遵循DRY原则
        // Principle_Applied: KISS (简洁单一职责), DRY (重用现有逻辑), 单一职责原则
        // Optimization: 集中化数据收集逻辑，提升代码复用性和可维护性
        // Architectural_Note (AR): 符合开闭原则，通过扩展而非修改现有功能
        // Documentation_Note (DW): 手动同步功能第一步实现，详细文档见 /project_document/手动同步按钮需求.md
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步数据收集函数
        /**
         * 收集同步所需的用户数据，重用现有的数据收集和格式化逻辑
         * @returns {Promise<{isValid: boolean, data: object|null, error: string|null}>}
         */
        collectSyncData: async function() {
            console.log('[utils.collectSyncData] 开始收集手动同步数据...');
            
            try {
                // 读取GM存储中的用户数据 - 复用handleSubscriptions的逻辑
                const tempAccount = await GM_getValue(TEMP_LOGIN_ACCOUNT_KEY, null);
                const storedUsername = await GM_getValue('otoy_username', null);
                // 优先使用存储的用户名，回退到临时登录账号 - 与handleSubscriptions保持一致
                const username = storedUsername || tempAccount;

                const email = await GM_getValue('otoy_email', null);
                const password = await GM_getValue(TEMP_PASSWORD_KEY, null);
                const paymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);
                const expiryDate = await GM_getValue('otoy_expiry_date', null);

                console.log('[utils.collectSyncData] 原始数据读取完成，开始处理...');

                // 处理支付日期 - 复用handleSubscriptions的日期格式化逻辑
                let paymentDateForSheet = null;
                if (paymentInfo && paymentInfo.paymentDate) {
                    const parsedPayment = this.parseFormattedDate(paymentInfo.paymentDate);
                    if (parsedPayment) {
                        const year = parsedPayment.getFullYear();
                        const month = (parsedPayment.getMonth() + 1).toString().padStart(2, '0');
                        const day = parsedPayment.getDate().toString().padStart(2, '0');
                        paymentDateForSheet = `${year}-${month}-${day}`; // 标准 YYYY-MM-DD 格式
                        console.log('[utils.collectSyncData] 支付日期格式化为 YYYY-MM-DD:', paymentDateForSheet);
                    } else {
                        console.warn('[utils.collectSyncData] 无法解析 paymentInfo.paymentDate:', paymentInfo.paymentDate);
                    }
                }
                
                // 处理到期日期 - 复用handleSubscriptions的日期格式化逻辑
                let expiryDateForSheet = expiryDate; // 如果解析失败，使用原始值
                if (expiryDate) {
                    const parsedExpiry = this.parseFormattedDate(expiryDate);
                    if (parsedExpiry) {
                        const year = parsedExpiry.getFullYear();
                        const month = (parsedExpiry.getMonth() + 1).toString().padStart(2, '0');
                        const day = parsedExpiry.getDate().toString().padStart(2, '0');
                        expiryDateForSheet = `${year}-${month}-${day}`; // 标准 YYYY-MM-DD 格式
                        console.log('[utils.collectSyncData] 到期日期格式化为 YYYY-MM-DD:', expiryDateForSheet);
                    } else {
                        console.warn('[utils.collectSyncData] 无法解析到期日期，使用原始值:', expiryDate);
                    }
                } else {
                    console.warn('[utils.collectSyncData] 到期日期为空或缺失');
                }

                // 数据验证 - 确保所有必需字段存在
                const missingFields = [];
                if (!username) missingFields.push('username');
                if (!email) missingFields.push('email');
                if (!password) missingFields.push('password');
                if (!paymentDateForSheet) missingFields.push('paymentDate');
                if (!expiryDateForSheet) missingFields.push('expiryDate');

                // 记录数据状态（不暴露密码）
                console.log('[utils.collectSyncData] 数据验证状态:', {
                    username: !!username,
                    email: !!email,
                    password: !!password,
                    paymentDateForSheet: !!paymentDateForSheet,
                    expiryDateForSheet: !!expiryDateForSheet,
                    rawPaymentInfo: paymentInfo,
                    missingFields: missingFields
                });

                if (missingFields.length > 0) {
                    const errorMsg = `缺少必需字段: ${missingFields.join(', ')}`;
                    console.warn('[utils.collectSyncData] 数据验证失败:', errorMsg);
                    return {
                        isValid: false,
                        data: null,
                        error: errorMsg
                    };
                }

                // 数据验证成功，准备返回数据
                const syncData = {
                    username: username,
                    email: email,
                    password: password,
                    paymentDate: paymentDateForSheet,
                    expiryDate: expiryDateForSheet
                };

                console.log('[utils.collectSyncData] 数据收集成功，所有必需字段完整');
                return {
                    isValid: true,
                    data: syncData,
                    error: null
                };

            } catch (error) {
                console.error('[utils.collectSyncData] 数据收集过程中发生错误:', error);
                return {
                    isValid: false,
                    data: null,
                    error: `数据收集错误: ${error.message}`
                };
            }
        },

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:35:00 +08:00
        // Reason: P3-UTILS-002 - 创建手动同步主函数，为手动同步提供统一的入口点
        // Principle_Applied: KISS (简洁职责清晰), 单一职责原则 (专门负责手动同步协调)
        // Optimization: 统一状态管理和错误处理，提升用户体验一致性
        // Architectural_Note (AR): 提供清晰的API接口，便于UI层调用
        // Documentation_Note (DW): 手动同步主要协调函数，实现状态管理和流程控制
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步主函数
        /**
         * 执行手动同步操作，协调数据收集、同步请求和状态管理
         * @returns {Promise<boolean>} 同步是否成功
         */
        performManualSync: async function() {
            console.log('[utils.performManualSync] 开始执行手动同步...');
            
            try {
                // 步骤1: 设置同步状态为进行中
                console.log('[utils.performManualSync] 更新状态为"正在同步..."');
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '正在同步...');
                
                // 立即刷新面板以显示同步状态
                if (typeof createUserInfoPanel === 'function') {
                    createUserInfoPanel();
                }

                // 步骤2: 收集同步数据
                console.log('[utils.performManualSync] 调用数据收集功能...');
                const dataResult = await this.collectSyncData();
                
                if (!dataResult.isValid) {
                    console.warn('[utils.performManualSync] 数据收集失败:', dataResult.error);
                    await GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步跳过: ${dataResult.error}`);
                    
                    // 刷新面板显示错误状态
                    if (typeof createUserInfoPanel === 'function') {
                        createUserInfoPanel();
                    }
                    
                    return false;
                }

                // 步骤3: 检查防重复机制 - 复用现有逻辑
                const lastSyncedPassword = await GM_getValue('otoy_last_synced_password', null);
                if (dataResult.data.password === lastSyncedPassword) {
                    console.log('[utils.performManualSync] 检测到重复数据，跳过同步');
                    await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步跳过: 记录已存在');
                    
                    // 刷新面板显示跳过状态
                    if (typeof createUserInfoPanel === 'function') {
                        createUserInfoPanel();
                    }
                    
                    return false;
                }

                // 步骤4: 执行同步操作
                console.log('[utils.performManualSync] 开始发送数据到Google Sheet...');
                const syncSuccess = await this.sendDataToGoogleSheet(dataResult.data);
                
                if (syncSuccess) {
                    console.log('[utils.performManualSync] 手动同步成功完成');
                    
                    // 清理临时凭据 - 复用现有逻辑
                    await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    await GM_deleteValue(TEMP_PASSWORD_KEY);
                    await GM_setValue('otoy_last_synced_password', dataResult.data.password);
                    
                    console.log('[utils.performManualSync] 临时凭据已清理，最后同步密码已记录');
                } else {
                    console.error('[utils.performManualSync] 手动同步失败');
                }

                // 步骤5: 最终刷新面板显示结果
                if (typeof createUserInfoPanel === 'function') {
                    createUserInfoPanel();
                }

                return syncSuccess;

            } catch (error) {
                console.error('[utils.performManualSync] 手动同步过程中发生错误:', error);
                
                // 设置错误状态
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, `同步失败: ${error.message}`);
                
                // 刷新面板显示错误状态
                if (typeof createUserInfoPanel === 'function') {
                    createUserInfoPanel();
                }
                
                return false;
            }
        }
        // {{END MODIFICATIONS}}
    };

    // --- 全局辅助函数 ---
    function cleanLabels(text) {
        if (typeof text !== 'string') return '';
        // 移除常见的账号/密码/邮箱标签（包括带"OC"前缀的）及其后的冒号和空格，
        // 并移除常见的由粘贴产生的包裹性字符（如【】）和多余的空格。
        let cleaned = text.trim(); // 1. 初始清理首尾空格

        // 2. 移除标签，例如 "账号：", "OC 密码：", "邮箱" 等
        cleaned = cleaned.replace(/(OC\s*账号|账号|OC\s*密码|密码|邮箱)\s*[:：]?\s*/gi, '');

        // 3. 移除包裹性字符如 【...】 或 [[...]] 等，并提取内部内容
        //    例如："【  我的内容  】" 会尝试提取 "  我的内容  "
        cleaned = cleaned.replace(/^[\s【［\[\(]*(.*?)[\s】］\]\)]*$/g, '$1');
        
        // 4. 最终清理，确保移除所有因替换操作可能产生的新的首尾空格
        return cleaned.trim();
    }

    function parseCredentials(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') {
             console.error('[parseCredentials] Invalid input:', rawInput);
             return { account: null, password: null };
        }
        const input = rawInput.trim();
        let account = null;
        let password = null;

        console.log(`[parseCredentials] Attempting to parse input: "${input}"`);

        // --- 新增：邮件优先策略 ---
        console.log('[parseCredentials] Trying Strategy E: Email detection first.');
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        const emailMatch = input.match(emailRegex);

        if (emailMatch) {
            account = emailMatch[0];
            const emailEndIndex = emailMatch.index + account.length;
            const remainingPart = input.substring(emailEndIndex);
            password = cleanLabels(remainingPart); // cleanLabels 会移除标签并 trim
            console.log(`[parseCredentials] Strategy E Result (Email Found): Account='${account}', Password='${password}'`);
            if (account && password) {
                return { account, password };
            }
             console.log('[parseCredentials] Strategy E: Found email, but failed to extract a non-empty password from the remaining part.');
            // 如果只找到邮箱但密码为空，重置变量，继续尝试其他策略
            account = null;
            password = null;
        } else {
            console.log('[parseCredentials] Strategy E: No email detected. Proceeding to other strategies.');
        }
        // --- 邮件优先策略结束 ---

        // 策略 A: 换行符
        if (input.includes('\n')) {
            console.log('[parseCredentials] Strategy A: Newline detected.');
            const lines = input.split('\n');
            const nonEmptyLines = lines.map(line => line.trim()).filter(line => line);
            if (nonEmptyLines.length === 2) {
                account = cleanLabels(nonEmptyLines[0]);
                password = cleanLabels(nonEmptyLines[1]);
                console.log(`[parseCredentials] Strategy A Result: Account='${account}', Password='${password}'`);
                if (account && password) return { account, password };
            } else {
                 console.log('[parseCredentials] Strategy A: Found newline, but not exactly 2 non-empty lines.');
            }
            // Reset for next strategy if this failed
            account = null; password = null;
        }

        // 策略 B: 密码标签 (改进，更灵活地定位) 
        console.log('[parseCredentials] Trying Strategy B: Password label detection.');
        const pwdLabelMatch = input.match(/密码\s*[:：]?\s*(.+)/i);
        if (pwdLabelMatch) {
            password = pwdLabelMatch[1].trim();
            // 账号是密码标签之前的所有内容，清理掉账号标签
            const potentialAccountPart = input.substring(0, pwdLabelMatch.index).trim();
            account = cleanLabels(potentialAccountPart); 
            console.log(`[parseCredentials] Strategy B Result (Pwd Label): Account='${account}', Password='${password}'`);
            if (account && password) return { account, password };
        }
        // Reset for next strategy if this failed
        account = null; password = null;

        // 策略 C: 账号标签 (如果密码标签未找到)
        console.log('[parseCredentials] Trying Strategy C: Account label detection.');
        const accLabelMatch = input.match(/账号\s*[:：]?\s*(.+)/i);
        if (accLabelMatch) {
            // 假设账号标签后的所有内容是账号+密码，尝试用空格分割
            const remainingText = accLabelMatch[1].trim();
            const accParts = remainingText.split(/\s+/);
            if (accParts.length >= 2) {
                 account = accParts[0];
                 password = accParts.slice(1).join(' ');
                 console.log(`[parseCredentials] Strategy C Result (Acc Label): Account='${account}', Password='${password}'`);
                 if (account && password) return { account, password };
            }
        }
         // Reset for next strategy if this failed
        account = null; password = null;

        // 策略 D: 空格分割 (最终回退)
        console.log('[parseCredentials] Strategy D: Trying space separation as final fallback.');
        // 在分割前，先清理一次标签，以应对 "账号xxx 密码yyy" 格式
        const cleanedInputForSpaceSplit = input.replace(/(账号|密码)\s*[:：]?\s*/gi, ' ').replace(/\s+/g, ' ').trim();
        const parts = cleanedInputForSpaceSplit.split(' '); // 使用单个空格分割，因为已合并空格
        const nonEmptyParts = parts.filter(part => part);

        if (nonEmptyParts.length >= 2) {
            account = nonEmptyParts[0];
            password = nonEmptyParts.slice(1).join(' ');
            console.log(`[parseCredentials] Strategy D Result (Space Split): Account='${account}', Password='${password}'`);
            if (account && password) return { account, password };
        } else {
             console.log('[parseCredentials] Strategy D: Not enough parts after space splitting.');
        }

        // 失败
        console.error('[parseCredentials] Failed to parse credentials from input:', rawInput);
        return { account: null, password: null };
    }

    // --- 全局弹窗函数 ---
    async function createCustomPrompt(title, placeholder) {
        console.log('[createCustomPrompt] Called with title:', title);
        
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 10100;
            animation: otoyFadeIn 0.3s ease;
        `;

        // 创建对话框
        const div = document.createElement('div');
        div.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            padding: 32px;
            border-radius: var(--otoy-radius-xl, 16px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
            z-index: 10101;
            min-width: 420px;
            max-width: 90vw;
            font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
            animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            border: 1px solid rgba(255, 255, 255, 0.3);
        `;
        
        // 添加特定动画
        if (!document.getElementById('otoy-dialog-animation')) {
            const animStyle = document.createElement('style');
            animStyle.id = 'otoy-dialog-animation';
            animStyle.textContent = `
                @keyframes otoyDialogIn {
                    from {
                        transform: translate(-50%, -50%) scale(0.95);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
                @keyframes otoyDialogOut {
                    from {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(0.95);
                        opacity: 0;
                    }
                }
                @keyframes otoyFadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
                @keyframes otoyInputFocus {
                    0% {
                        box-shadow: 0 0 0 0 rgba(30, 136, 229, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 4px rgba(30, 136, 229, 0.1);
                    }
                }
            `;
            document.head.appendChild(animStyle);
        }

        // 使用传入的参数设置内容
        div.innerHTML = `
            <h3 style="
                margin: 0 0 24px 0;
                color: var(--otoy-neutral-900, #212121);
                font-size: 22px;
                text-align: center;
                font-weight: 600;
                letter-spacing: -0.02em;
                line-height: 1.3;
            ">${title}</h3>
            <input type="text" id="custom-credentials" placeholder="${placeholder}" style="
                display: block;
                width: 100%;
                padding: 14px 18px;
                margin-bottom: 28px;
                border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                border-radius: var(--otoy-radius-md, 8px);
                box-sizing: border-box;
                font-size: 15px;
                font-family: inherit;
                outline: none;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                background: rgba(255, 255, 255, 0.8);
                color: var(--otoy-neutral-900, #212121);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
            ">
            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            ">
                <button id="custom-cancel" style="
                    padding: 12px 28px;
                    border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    color: var(--otoy-neutral-700, #616161);
                    letter-spacing: 0.02em;
                    position: relative;
                    overflow: hidden;
                ">取消</button>
                <button id="custom-submit" style="
                    padding: 12px 28px;
                    border: none;
                    background: linear-gradient(135deg, var(--otoy-primary, #1E88E5) 0%, #1976D2 100%);
                    color: white;
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    letter-spacing: 0.02em;
                    box-shadow: 0 4px 14px rgba(30, 136, 229, 0.3);
                    position: relative;
                    overflow: hidden;
                ">确定</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(div);

        console.log('[createCustomPrompt] Dialog and overlay appended to body. Checking for input field...');
        const checkInput = document.getElementById('custom-credentials');
        console.log('[createCustomPrompt] Input field found by ID after append:', !!checkInput);

        const submitBtn = document.getElementById('custom-submit');
        const cancelBtn = document.getElementById('custom-cancel');

        // 添加增强的交互效果
        if (submitBtn) {
            submitBtn.onmouseover = () => {
                submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                submitBtn.style.transform = 'translateY(-1px)';
                submitBtn.style.boxShadow = '0 6px 20px rgba(30, 136, 229, 0.4)';
            };
            submitBtn.onmouseout = () => {
                submitBtn.style.background = 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)';
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = '0 4px 14px rgba(30, 136, 229, 0.3)';
            };
            submitBtn.onmousedown = () => {
                submitBtn.style.transform = 'translateY(0)';
                submitBtn.style.boxShadow = '0 2px 8px rgba(30, 136, 229, 0.3)';
            };
        }
        
        if (cancelBtn) {
            cancelBtn.onmouseover = () => {
                cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                cancelBtn.style.transform = 'translateY(-1px)';
            };
            cancelBtn.onmouseout = () => {
                cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                cancelBtn.style.transform = 'translateY(0)';
            };
        }
        
        if (checkInput) {
            checkInput.onfocus = () => {
                checkInput.style.borderColor = 'var(--otoy-primary, #1E88E5)';
                checkInput.style.background = 'rgba(255, 255, 255, 1)';
                checkInput.style.animation = 'otoyInputFocus 0.3s ease forwards';
            };
            checkInput.onblur = () => {
                checkInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                checkInput.style.background = 'rgba(255, 255, 255, 0.8)';
                checkInput.style.animation = 'none';
            };
            // 自动聚焦输入框
            setTimeout(() => checkInput.focus(), 100);
        }

        // 返回 Promise 以处理用户交互
        return new Promise((resolve, reject) => {
            const cleanup = () => {
                // 添加退出动画
                div.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                // 检查元素是否存在再尝试移除
                if (div.parentNode) div.parentNode.removeChild(div);
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = () => {
                const value = checkInput.value;
                cleanup();
                resolve(value); // 返回输入框的值
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消操作')); // 使用 Error 对象 reject
            };

            checkInput.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            };
        });
    }
    // --- 全局弹窗函数结束 ---

    // --- 用户信息悬浮面板 ---
    async function createUserInfoPanel() { // Added async here
        // Add logic to remove existing panel before creating a new one
        const existingPanel = document.getElementById('otoy-user-info-panel');
        if (existingPanel) {
            console.log('[createUserInfoPanel] Removing existing panel before recreating.');
            existingPanel.remove();
        }

        // 检查并添加样式 (仅一次)
        if (!document.getElementById('otoy-panel-styles')) {
            const style = document.createElement('style');
            style.id = 'otoy-panel-styles';
            style.textContent = `
                #otoy-user-info-panel {
                    position: fixed;
                    left: 20px;
                    bottom: 20px;
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                    backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: var(--otoy-radius-xl, 16px);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.06);
                    padding: 24px;
                    width: 320px;
                    z-index: 10001;
                    font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                    font-size: 14px;
                    color: var(--otoy-neutral-800, #424242);
                    line-height: 1.6;
                    animation: otoyPanelSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes otoyPanelSlideIn {
                    from {
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                #otoy-user-info-panel:hover {
                    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08);
                    transform: translateY(-2px);
                }

                .panel-section {
                    margin-bottom: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                    position: relative;
                }

                .panel-section:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }

                .panel-section::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 20%;
                    right: 20%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(30, 136, 229, 0.2), transparent);
                }

                .panel-section:last-child::after {
                    display: none;
                }

                .info-line {
                    margin-bottom: 12px;
                   display: flex;
                   justify-content: space-between;
                    align-items: center;
                    transition: transform 0.2s ease;
                }

                .info-line:hover {
                    transform: translateX(2px);
                }

                 .info-line:last-child {
                     margin-bottom: 0;
                 }

                .info-label {
                    font-weight: 500;
                    color: var(--otoy-neutral-600, #757575);
                    margin-right: 8px;
                    font-size: 13px;
                    letter-spacing: 0.02em;
                }

                .info-value {
                    color: var(--otoy-neutral-900, #212121);
                    word-break: break-all;
                    text-align: right;
                    font-weight: 500;
                    flex: 1;
                    max-width: 70%;
                }

                 .expiry-line {
                     display: flex;
                     align-items: center;
                     justify-content: space-between;
                    margin-bottom: 12px;
                    padding: 8px 12px;
                    background: rgba(30, 136, 229, 0.06);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .expiry-line:hover {
                    background: rgba(30, 136, 229, 0.1);
                }

                #copy-expiry-btn {
                    background: var(--otoy-primary, #1E88E5);
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 6px 16px;
                    font-size: 12px;
                    border-radius: var(--otoy-radius-sm, 4px);
                    margin-left: 12px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    box-shadow: 0 2px 8px rgba(30, 136, 229, 0.25);
                }

                #copy-expiry-btn:hover {
                    background: var(--otoy-primary-hover, #1976D2);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.35);
                }

                #copy-expiry-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                 #copy-expiry-btn:disabled {
                    opacity: 0.6;
                     cursor: default;
                    transform: none;
                    box-shadow: none;
                 }

                .rate-line {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding: 10px 12px;
                    background: rgba(0, 0, 0, 0.02);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .rate-line:hover {
                    background: rgba(0, 0, 0, 0.04);
                    transform: translateX(2px);
                }

                .rate-label {
                    color: var(--otoy-neutral-600, #757575);
                    font-size: 13px;
                    font-weight: 500;
                }

                .rate-value {
                    font-weight: 700;
                    font-size: 15px;
                    letter-spacing: -0.02em;
                    font-variant-numeric: tabular-nums;
                }

                .todo-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .todo-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    padding: 12px;
                    background: rgba(0, 0, 0, 0.02);
                    border-radius: var(--otoy-radius-md, 8px);
                    transition: all 0.2s ease;
                }

                .todo-item:hover:not(.completed) {
                    background: rgba(30, 136, 229, 0.06);
                    transform: translateX(4px);
                }

                 .todo-item:last-child {
                     margin-bottom: 0;
                 }

                .todo-item.completed {
                    background: rgba(76, 175, 80, 0.08);
                    opacity: 0.8;
                }

                .todo-icon {
                    margin-right: 12px;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: transform 0.3s ease;
                }

                .todo-item.completed .todo-icon {
                    color: var(--otoy-success, #4CAF50);
                    transform: scale(1.1);
                }

                .todo-item:not(.completed) .todo-icon {
                    color: var(--otoy-warning, #FF9800);
                    animation: otoyPulse 2s infinite;
                }

                .todo-link {
                    text-decoration: none;
                    color: var(--otoy-primary, #1E88E5);
                    font-weight: 500;
                    transition: color 0.2s ease;
                    flex: 1;
                }

                 .todo-link:hover {
                    color: var(--otoy-primary-hover, #1976D2);
                 }

                .todo-item.completed .todo-link {
                    color: var(--otoy-neutral-600, #757575);
                    text-decoration: line-through;
                    pointer-events: none;
                }

                .status-message {
                    color: var(--otoy-error, #F44336);
                    font-weight: 600;
                    margin-top: 12px;
                    font-size: 13px;
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%);
                    border: 1px solid rgba(244, 67, 54, 0.2);
                    padding: 12px 16px;
                    border-radius: var(--otoy-radius-md, 8px);
                    text-align: center;
                    animation: otoyShake 0.5s ease-in-out;
                }

                #cooldown-timers-list p {
                    margin: 8px 0;
                    padding: 8px 12px;
                    background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
                    border-radius: var(--otoy-radius-sm, 4px);
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--otoy-warning, #FF9800);
                    animation: otoyPulse 2s infinite;
                    text-align: center;
                }

                .sync-status-section {
                    margin-top: 16px;
                    padding-top: 16px;
                    font-size: 13px;
                    text-align: center;
                }

                .sync-status-text {
                    padding: 8px 16px;
                    border-radius: var(--otoy-radius-md, 8px);
                    display: inline-block;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    transition: all 0.2s ease;
                }

                .sync-status-success {
                    color: var(--otoy-success, #4CAF50);
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%);
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .sync-status-failure {
                    color: var(--otoy-error, #F44336);
                    background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                }

                .sync-status-pending {
                    color: var(--otoy-primary, #1E88E5);
                    background: linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(21, 101, 192, 0.1) 100%);
                    border: 1px solid rgba(30, 136, 229, 0.3);
                    animation: otoyPulse 1.5s infinite;
                }

                .sync-status-default {
                    color: var(--otoy-neutral-600, #757575);
                    background: rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(0, 0, 0, 0.08);
                }

                /* 响应式设计 */
                @media (max-width: 600px) {
                  #otoy-user-info-panel {
                        width: calc(100vw - 40px);
                        max-width: 400px;
                        left: 20px;
                        right: 20px;
                        bottom: 20px;
                        font-size: 15px;
                    }

                    .panel-section {
                        margin-bottom: 16px;
                        padding-bottom: 16px;
                    }

                    .info-line, .rate-line {
                        padding: 8px 10px;
                    }

                    .todo-item {
                        padding: 10px;
                    }
                }

                /* 暗色模式支持 */
                @media (prefers-color-scheme: dark) {
                    #otoy-user-info-panel {
                        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(25, 25, 25, 0.95) 100%);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        color: #E0E0E0;
                    }

                    .info-label, .rate-label {
                        color: #BDBDBD;
                    }

                  .info-value {
                        color: #F5F5F5;
                    }

                    .panel-section {
                        border-bottom-color: rgba(255, 255, 255, 0.1);
                    }

                    .rate-line, .todo-item {
                        background: rgba(255, 255, 255, 0.05);
                    }

                    .rate-line:hover, .todo-item:hover:not(.completed) {
                        background: rgba(255, 255, 255, 0.08);
                  }
                }

                /* {{CHENGQI:
                // Action: Added
                // Timestamp: 2025-07-01 16:40:00 +08:00
                // Reason: P3-CSS-003 - 添加手动同步按钮样式，确保与现有设计体系一致
                // Principle_Applied: KISS (简洁清晰的样式), DRY (重用现有CSS变量和设计模式)
                // Optimization: 完整的交互状态支持，响应式设计和暗色模式兼容
                // Architectural_Note (AR): 符合现有的设计语言和视觉层次
                // Documentation_Note (DW): 手动同步按钮完整样式系统，支持所有交互状态
                // }} */
                /* 手动同步按钮样式 */
                .manual-sync-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    background: var(--otoy-primary, #1E88E5);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    margin-left: 8px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                    position: relative;
                    flex-shrink: 0;
                }

                .manual-sync-btn:hover:not(:disabled) {
                    background: var(--otoy-primary-hover, #1976D2);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.35);
                }

                .manual-sync-btn:active:not(:disabled) {
                    transform: scale(0.95);
                    box-shadow: 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                .manual-sync-btn:disabled {
                    background: var(--otoy-neutral-400, #BDBDBD);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .manual-sync-btn:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.2), 0 2px 6px rgba(30, 136, 229, 0.25);
                }

                /* 按钮图标 */
                .manual-sync-btn-icon {
                    width: 14px;
                    height: 14px;
                    fill: white;
                    transition: transform 0.3s ease;
                }

                /* 加载状态旋转动画 */
                .manual-sync-btn.loading .manual-sync-btn-icon {
                    animation: otoyManualSyncSpin 1s linear infinite;
                }

                @keyframes otoyManualSyncSpin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* 同步状态区域布局 */
                .sync-status-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 16px;
                    padding-top: 16px;
                    font-size: 13px;
                }

                .sync-status-section .sync-status-text {
                    flex: 1;
                    text-align: center;
                }

                /* 手动同步按钮显示/隐藏逻辑相关样式 */
                .manual-sync-btn.hidden {
                    display: none;
                }

                .manual-sync-btn.show {
                    display: inline-flex;
                    animation: otoyButtonFadeIn 0.3s ease;
                }

                @keyframes otoyButtonFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* 响应式设计 - 手动同步按钮 */
                @media (max-width: 600px) {
                    .manual-sync-btn {
                        width: 26px;
                        height: 26px;
                        margin-left: 10px;
                    }

                    .manual-sync-btn-icon {
                        width: 15px;
                        height: 15px;
                    }

                    .sync-status-section {
                        gap: 10px;
                    }
                }

                /* 暗色模式 - 手动同步按钮 */
                @media (prefers-color-scheme: dark) {
                    .manual-sync-btn:disabled {
                        background: rgba(255, 255, 255, 0.2);
                    }

                    .manual-sync-btn:focus {
                        box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.3), 0 2px 6px rgba(30, 136, 229, 0.25);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 读取存储的数据
        const username = GM_getValue('otoy_username', '未知');
        const email = GM_getValue('otoy_email', '未知');
        let expiryDateText = GM_getValue('otoy_expiry_date', '加载中...'); // Renamed for clarity
        const statusMessage = GM_getValue('otoy_status_message', null);
        const cardDeleted = GM_getValue('otoy_card_deleted', false);
        const subscriptionCancelled = await GM_getValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false); // Use new constant
        const syncStatusMessage = await GM_getValue(SYNC_STATUS_MESSAGE_KEY, '等待同步...'); // NEW: Read sync status

        // --- 新增：获取并格式化支付日期 ---
        // const latestPaymentDateStr = await GM_getValue(LATEST_PAYMENT_DATE_KEY, '未获取'); // Old way
        const latestPaymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);
        let displayPaymentDate = '未获取';
        let rawPaymentDateForLog = 'null';

        if (latestPaymentInfo && latestPaymentInfo.paymentDate) {
            rawPaymentDateForLog = latestPaymentInfo.paymentDate;
            const parsedPaymentDate = utils.parseFormattedDate(latestPaymentInfo.paymentDate); // Expects YYYY-MM-DD
            if (parsedPaymentDate) {
                displayPaymentDate = utils.formatDate(parsedPaymentDate); // Converts to YYYY年MM月DD日
                console.log(`[UserInfoPanel] Payment date formatted for display: ${displayPaymentDate} (original from info: ${latestPaymentInfo.paymentDate}, subID: ${latestPaymentInfo.subID})`);
            } else {
                displayPaymentDate = latestPaymentInfo.paymentDate; // Fallback to raw if parsing fails
                console.warn(`[UserInfoPanel] Failed to parse paymentDate from LATEST_PAYMENT_INFO_KEY: ${latestPaymentInfo.paymentDate} (subID: ${latestPaymentInfo.subID}). Using original.`);
            }
        } else {
            if (latestPaymentInfo) {
                 console.warn(`[UserInfoPanel] LATEST_PAYMENT_INFO_KEY found, but paymentDate property is missing or null. Info: ${JSON.stringify(latestPaymentInfo)}`);
            } else {
                 console.log(`[UserInfoPanel] LATEST_PAYMENT_INFO_KEY not found or null.`);
            }
        }
        console.log(`[UserInfoPanel] Raw paymentDate from LATEST_PAYMENT_INFO_KEY (for display): ${rawPaymentDateForLog === 'null' && displayPaymentDate !== '未获取' ? displayPaymentDate : rawPaymentDateForLog}`); // Adjusted log for clarity
        // if (latestPaymentDateStr && latestPaymentDateStr !== '未获取') { // Old logic

        // --- 新增：格式化到期日期用于显示 ---
        let displayExpiryDate = expiryDateText;
        if (expiryDateText && expiryDateText !== '加载中...' && expiryDateText !== '无有效订阅') {
            const parsedDate = utils.parseFormattedDate(expiryDateText);
            if (parsedDate) {
                displayExpiryDate = utils.formatDate(parsedDate);
                console.log(`[UserInfoPanel] Expiry date formatted for display: ${displayExpiryDate} (original: ${expiryDateText})`);
            } else {
                console.warn(`[UserInfoPanel] Failed to parse expiryDateText: ${expiryDateText} for display formatting. Using original.`);
            }
        }
        // --- 格式化逻辑结束 ---

        // 如果没有有效日期，显示特定文本 (此逻辑可能需要调整或移除，因为上面已经处理了)
        // if (expiryDateText === '加载中...' && !GM_getValue('otoy_expiry_date')) { 
        // displayExpiryDate = '无有效订阅'; // 如果expiryDateText本身就是'加载中...'，displayExpiryDate也已经是了
        // }

        // 创建面板元素
        const panel = document.createElement('div');
        panel.id = 'otoy-user-info-panel';

        // 构建内容 HTML - **调整布局**
        let contentHTML = `
            <div class="panel-section">
                <!-- 用户信息 -->
                <div class="info-line">
                    <span class="info-label">用户:</span>
                    <span class="info-value">${username}</span>
                </div>
                <div class="info-line">
                    <span class="info-label">邮箱:</span>
                    <span class="info-value">${email}</span>
                </div>
            </div>

            <div class="panel-section">
                <!-- 订阅信息 -->
                <div class="info-line"> <!-- 新增支付时间显示行 -->
                    <span class="info-label">支付时间:</span>
                    <span class="info-value">${displayPaymentDate}</span>
                </div>
                <div class="expiry-line">
                    <span class="info-label">到期时间:</span>
                    <span id="panel-expiry-date-text" class="info-value">${displayExpiryDate}</span>`; // 使用 displayExpiryDate

        const isDateValid = displayExpiryDate !== '加载中...' && displayExpiryDate !== '无有效订阅'; // 判断基于 displayExpiryDate
        if (isDateValid) {
            contentHTML += `<button id="copy-expiry-btn" title="复制到期信息">复制</button>`;
        }
        contentHTML += `
                </div>
                <!-- 汇率和冷却计时器已移到下方 -->
            </div>`;

        // Status Message (if any) - Placed after subscription, before ToDo
        if (statusMessage && statusMessage !== '支付处理中，请等待冷却结束') {
            contentHTML += `<div class="panel-section"><p class="status-message">${statusMessage}</p></div>`;
        } else if (statusMessage === '支付处理中，请等待冷却结束') {
            // Status message for cooldown is now handled by the timer display logic below
            console.log('全局状态为冷却，将在计时器列表处显示。');
        }

        // ToDo List Section
        contentHTML += `
            <div class="panel-section">
                <ul class="todo-list">
                    <li class="todo-item${cardDeleted ? ' completed' : ''}">
                        <span class="todo-icon">${cardDeleted ? '✅' : '⏳'}</span>
                        <a href="${CONFIG.URLS.CARDS}" class="todo-link">删除绑定的信用卡</a>
                    </li>
                    <li class="todo-item${subscriptionCancelled ? ' completed' : ''}">
                        <span class="todo-icon">${subscriptionCancelled ? '✅' : '⏳'}</span>
                        <a href="${CONFIG.URLS.SUBSCRIPTIONS}" class="todo-link">取消自动续费</a>
                    </li>
                </ul>
            </div>
        `;

        // Exchange Rate and Cooldown Timer Section (Moved Here)
        contentHTML += `
            <div class="panel-section">
                 <div class="rate-line">
                    <span class="rate-label">23.95 EUR ≈</span>
                    <span id="eur-rmb-value-1" class="rate-value" title="汇率来源: exchangerate.host">计算中...</span>
                </div>
                <div class="rate-line">
                    <span class="rate-label">239.88 EUR ≈</span>
                    <span id="eur-rmb-value-2" class="rate-value" title="汇率来源: exchangerate.host">计算中...</span>
                </div>
                <!-- 冷却计时器列表容器 -->
                <div id="cooldown-timers-list" style="margin-top: 10px;"></div>
            </div>
        `;

        // NEW: Sync Status Section
        // {{CHENGQI:
        // Action: Modified
        // Timestamp: 2025-07-01 16:45:00 +08:00
        // Reason: P3-HTML-004 - 修改面板HTML结构，添加手动同步按钮元素，确保布局协调
        // Principle_Applied: KISS (简洁的HTML结构), 可访问性 (正确的ARIA属性)
        // Optimization: 使用flexbox布局确保按钮和文本的协调显示
        // Architectural_Note (AR): 符合既定的HTML结构模式，保持组件化设计
        // Documentation_Note (DW): 在同步状态区域添加手动同步按钮HTML，支持智能显示/隐藏逻辑
        // }}
        // {{START MODIFICATIONS}}
        // - 原有简单布局：仅包含状态文本
        // + 新增复合布局：状态文本 + 手动同步按钮，支持智能显示控制
        contentHTML += `
            <div class="sync-status-section">
                <span class="sync-status-text" id="sync-status-text">读取中...</span>
                <button 
                    type="button" 
                    class="manual-sync-btn hidden" 
                    id="manual-sync-btn"
                    title="手动重试同步"
                    aria-label="手动重试同步"
                    role="button">
                    <svg class="manual-sync-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                    </svg>
                </button>
            </div>
        `;
        // {{END MODIFICATIONS}}

        panel.innerHTML = contentHTML; // Set the generated HTML

        // --- 冷却计时器、复制按钮事件监听器等逻辑保持不变 ---
        // ... (Existing logic for cooldown timer display) ...
        const timersListContainer = panel.querySelector('#cooldown-timers-list');
        let cooldownIntervalId = null; // (可选) 存储 Interval ID

        function updateActiveTimersDisplay() {
            // ... (Function content remains the same) ...
            const timers = GM_getValue('otoy_cooldown_timers', {}); // 每次都重新读取
            const loggedInUsername = GM_getValue('otoy_username', null);
            let needsStorageUpdate = false;
            const now = Date.now();
            let activeTimersFound = false; // 标志是否有活动计时器

            if (timersListContainer) {
                timersListContainer.innerHTML = ''; // 清空旧列表

                Object.keys(timers).forEach(timerUsername => {
                    const timerData = timers[timerUsername];
                    const endTime = timerData.startTime + timerData.duration;
            const remainingTime = endTime - now;

                    if (remainingTime > 0) {
                        activeTimersFound = true; // 发现活动计时器
                        // 计时器有效，显示
                        const timerElement = document.createElement('p');
                        timerElement.style.cssText = `
                            color: #fd7e14; /* Orange */
                            font-weight: bold;
                            font-size: 12px;
                            margin: 5px 0;
                            text-align: center;
                        `;
                        timerElement.textContent = `["${timerUsername}": 支付冷却中: "${utils.formatRemainingTime(remainingTime)}"]`;
                        timersListContainer.appendChild(timerElement);
            } else {
                        // 计时器过期，标记清理
                        console.log(`[Cooldown Cleanup] Timer for ${timerUsername} expired.`);
                        delete timers[timerUsername];
                        needsStorageUpdate = true;

                        // 如果过期的是当前登录用户的计时器，并且全局状态是冷却状态，则清除全局状态
                        if (timerUsername === loggedInUsername && GM_getValue('otoy_status_message') === '支付处理中，请等待冷却结束') {
                            console.log(`[Cooldown Cleanup] Clearing global status message as timer for logged-in user ${loggedInUsername} expired.`);
                            GM_deleteValue('otoy_status_message');
                            // Note: The status message display was already handled above based on statusMessage value
                        }
                    }
                });

                // 如果有计时器被清理，更新存储
                if (needsStorageUpdate) {
                    console.log('[Cooldown Cleanup] Updating GM storage with expired timers removed.');
                    GM_setValue('otoy_cooldown_timers', timers);
                }

            } else {
                console.error('[Cooldown Display] Could not find #cooldown-timers-list container in panel.');
                // 如果找不到容器，也应该停止计时器
                if (cooldownIntervalId) {
                    clearInterval(cooldownIntervalId);
                    cooldownIntervalId = null;
                    console.log('[Cooldown Interval] Cleared interval due to missing container.');
                }
            }
        }

        // 初始调用一次以显示当前状态
        updateActiveTimersDisplay();

        // 启动定时器，每秒更新一次
        if (cooldownIntervalId) clearInterval(cooldownIntervalId);
        cooldownIntervalId = setInterval(updateActiveTimersDisplay, 1000);
        console.log('[Cooldown Interval] Started interval timer for display updates.');


        // --- 修改：调用新的汇率处理逻辑 ---
        const apiKey = '1d4fe01f53f66567b0363d16907cfc36'; // <-- Update API Key
        // 将调用放在 panel 元素添加到 DOM 之后执行
        setTimeout(() => {
            const rmbSpan1 = panel.querySelector('#eur-rmb-value-1'); // Use querySelector for robustness
            const rmbSpan2 = panel.querySelector('#eur-rmb-value-2');

            if (rmbSpan1 && rmbSpan2) {
                 console.log('[createUserInfoPanel] Attempting to get EUR/CNY rate...');
                 utils.getEurCnyRate(apiKey) // Call the new main function
                 .then(result => {
                      console.log('[createUserInfoPanel] Received result from getEurCnyRate:', result);
                      if (typeof result === 'number') {
                           // Rate received (could be fresh or stale)
                           const rate = result;
                           const rmbValue1 = rate * 23.95;
                           const rmbValue2 = rate * 239.88;

                           rmbSpan1.textContent = `${rmbValue1.toFixed(2)} RMB`;
                           rmbSpan2.textContent = `${rmbValue2.toFixed(2)} RMB`;
                           rmbSpan1.style.color = rmbValue1 >= 190 ? '#dc3545' : '#28a745'; // Use specific colors
                           rmbSpan2.style.color = rmbValue2 >= 1845 ? '#dc3545' : '#28a745';
                           rmbSpan1.title = `汇率: ${rate.toFixed(6)} (来源: exchangerate.host)`; // Add rate to title
                           rmbSpan2.title = `汇率: ${rate.toFixed(6)} (来源: exchangerate.host)`;

                           console.log(`[createUserInfoPanel] Rate calculation successful. Rate: ${rate.toFixed(6)}`);

                      } else if (result === 'WAITING') {
                           // Waiting for 10 AM update
                           console.log('[createUserInfoPanel] Waiting for 10 AM rate update.');
                           const waitMsg = "等待10点后更新...";
                           rmbSpan1.textContent = waitMsg;
                           rmbSpan2.textContent = waitMsg;
                           rmbSpan1.style.color = ''; // Reset color
                           rmbSpan2.style.color = '';
                           rmbSpan1.title = '汇率将在每日10点后首次加载时更新';
                           rmbSpan2.title = '汇率将在每日10点后首次加载时更新';
        } else {
                           // Should not happen with current logic, but handle defensively
                           console.warn('[createUserInfoPanel] Received unexpected result from getEurCnyRate:', result);
                           rmbSpan1.textContent = '未知状态';
                           rmbSpan2.textContent = '未知状态';
                           rmbSpan1.style.color = '';
                           rmbSpan2.style.color = '';
                      }
                 })
                 .catch(error => {
                      // This catch block now only triggers if API fetch failed AND no old rate was available
                      console.error('[createUserInfoPanel] Failed to get EUR/CNY rate and no fallback available:', error);
                      const errorMsg = `计算失败: ${error.message || error}`;
                      rmbSpan1.textContent = '计算失败';
                      rmbSpan2.textContent = '计算失败';
                      rmbSpan1.title = errorMsg;
                      rmbSpan2.title = errorMsg;
                      rmbSpan1.style.color = '#dc3545'; // Error color
                      rmbSpan2.style.color = '#dc3545';
                 });
            } else {
                 console.error('[createUserInfoPanel] Could not find one or both rate display elements.');
        }
        }, 100); // Delay slightly

        // NEW: Update Sync Status Display
        const syncStatusElement = panel.querySelector('#sync-status-text');
        if (syncStatusElement) {
            syncStatusElement.textContent = syncStatusMessage;
            syncStatusElement.className = 'sync-status-text'; // Reset classes first
            if (syncStatusMessage === '同步成功') {
                syncStatusElement.classList.add('sync-status-success');
            } else if (syncStatusMessage.startsWith('同步失败:')) {
                syncStatusElement.classList.add('sync-status-failure');
            } else if (syncStatusMessage === '正在同步...') { // Check for pending status
                syncStatusElement.classList.add('sync-status-pending');
            } else { // Default or '等待同步...'
                 syncStatusElement.classList.add('sync-status-default');
            }
            console.log(`[createUserInfoPanel] Sync status set to: ${syncStatusMessage}`);
        } else {
            console.error('[createUserInfoPanel] Could not find #sync-status-text element.');
        }
        // End NEW Sync Status Display Logic

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:55:00 +08:00
        // Reason: P3-STATE-006 - 实现智能状态管理系统，根据同步状态控制按钮显示/隐藏
        // Principle_Applied: KISS (简洁的状态逻辑), 单一职责原则 (专门负责按钮状态管理)
        // Optimization: 智能化的按钮显示逻辑，避免不必要的用户操作，提升UX
        // Architectural_Note (AR): 清晰的状态-视图映射规则，符合响应式UI设计原则
        // Documentation_Note (DW): 智能按钮状态管理系统，根据同步状态自动控制可见性
        // }}
        // {{START MODIFICATIONS}}
        // + 新增智能按钮状态管理系统
        const manualSyncBtnForState = panel.querySelector('#manual-sync-btn');
        if (manualSyncBtnForState) {
            // 智能显示/隐藏逻辑
            let shouldShowButton = false;
            
            if (syncStatusMessage === '同步成功') {
                // 同步成功时隐藏按钮，无需手动重试
                shouldShowButton = false;
                console.log('[Button State] 同步成功，隐藏手动同步按钮');
                
            } else if (syncStatusMessage.startsWith('同步失败:')) {
                // 同步失败时显示按钮，允许用户重试
                shouldShowButton = true;
                console.log('[Button State] 同步失败，显示手动同步按钮供重试');
                
            } else if (syncStatusMessage.startsWith('同步跳过:')) {
                // 同步跳过时显示按钮，允许用户手动触发
                shouldShowButton = true;
                console.log('[Button State] 同步跳过，显示手动同步按钮供手动触发');
                
            } else if (syncStatusMessage === '正在同步...') {
                // 正在同步时隐藏按钮，避免重复操作
                shouldShowButton = false;
                console.log('[Button State] 正在同步中，隐藏手动同步按钮');
                
            } else {
                // 默认状态（如"等待同步..."）显示按钮，允许用户主动同步
                shouldShowButton = true;
                console.log('[Button State] 默认状态，显示手动同步按钮');
            }
            
            // 应用显示/隐藏状态
            if (shouldShowButton) {
                manualSyncBtnForState.classList.remove('hidden');
                manualSyncBtnForState.classList.add('show');
                console.log('[Button State] 按钮已设置为显示状态');
            } else {
                manualSyncBtnForState.classList.remove('show');
                manualSyncBtnForState.classList.add('hidden');
                console.log('[Button State] 按钮已设置为隐藏状态');
            }
            
            console.log(`[Button State] 智能状态管理完成 - 状态: "${syncStatusMessage}", 显示按钮: ${shouldShowButton}`);
        } else {
            console.error('[Button State] 未找到手动同步按钮元素，无法进行状态管理');
        }
        // {{END MODIFICATIONS}}

        // ... (Existing logic for copy button listener) ...
        if (isDateValid) {
            const copyBtn = panel.querySelector('#copy-expiry-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', async (e) => { // Make async for GM_getValue
                    e.preventDefault();
                    e.stopPropagation();

                    const calculatedRenewalExpiryDate = await GM_getValue('otoy_calculated_renewal_expiry_date', null);
                    let textToCopy = '';
                    // Ensure otoy_original_expiry_date_for_renewal_copy is also awaited if it's set asynchronously elsewhere, but it's usually set before this click.
                    const originalExpiryDateForCopy = await GM_getValue('otoy_original_expiry_date_for_renewal_copy', null); // Expects YYYY年MM月DD日

                    if (calculatedRenewalExpiryDate && originalExpiryDateForCopy) {
                        // 步骤 4 的复制逻辑 (新需求)
                        // originalExpiryDateForCopy should be YYYY年MM月DD日 from createRenewalPromptMonths
                        // calculatedRenewalExpiryDate is YYYY年MM月DD日 from createRenewalPromptMonths
                        textToCopy = `最新订阅充值已经提交！\n${originalExpiryDateForCopy}软件会自动刷新充值时间！\n账号最新的到期时间是：${calculatedRenewalExpiryDate}！`;
                        console.log(`[Copy Button] 步骤 4 (自定义月数续费后) 复制内容. Original: ${originalExpiryDateForCopy}, Calculated: ${calculatedRenewalExpiryDate}`);
                        
                        // 清除临时GM值
                        await GM_deleteValue('otoy_calculated_renewal_expiry_date');
                        await GM_deleteValue('otoy_original_expiry_date_for_renewal_copy');

                    } else {
                        // 原有的复制逻辑 (作为后备)
                        const latestExpiryDateStr = await GM_getValue('otoy_expiry_date', null); // This is the general expiry, YYYY年MM月DD日 or YYYY-MM-DD
                        const originalExpiryDateForGeneralOps = await GM_getValue('otoy_original_expiry_date', null); // Used for 'just renewed' from purchase flow, usually YYYY-MM-DD

                        let formattedLatestExpiryDateForCopy = '未知到期日';
                        if (latestExpiryDateStr) {
                            const parsedForCopy = utils.parseFormattedDate(latestExpiryDateStr);
                            if (parsedForCopy) {
                                formattedLatestExpiryDateForCopy = utils.formatDate(parsedForCopy); // to "YYYY年MM月DD日"
                            } else {
                                formattedLatestExpiryDateForCopy = latestExpiryDateStr; // Use raw if parsing fails
                                console.warn(`[Copy Button] (后备逻辑) 无法解析 latestExpiryDateStr: ${latestExpiryDateStr}。将使用原始值。`);
                            }
                        } else {
                            console.error('[Copy Button] (后备逻辑) 无法获取有效的 otoy_expiry_date');
                            utils.showNotification('错误：无法获取到期日期');
                            return;
                        }

                        // 后备逻辑：检查是否是刚通过标准购买流程续费 (非步骤4的自定义月数弹窗续费)
                        if (originalExpiryDateForGeneralOps && originalExpiryDateForGeneralOps !== latestExpiryDateStr) {
                            let formattedOriginalExpiryDate = originalExpiryDateForGeneralOps;
                            const parsedOriginal = utils.parseFormattedDate(originalExpiryDateForGeneralOps);
                            if (parsedOriginal) {
                                formattedOriginalExpiryDate = utils.formatDate(parsedOriginal);
                            }
                            textToCopy = `最新订阅充值已经提交！\n${formattedOriginalExpiryDate}软件会自动刷新充值时间！\n账号最新的到期时间是：${formattedLatestExpiryDateForCopy}！`;
                            console.log(`[Copy Button] (后备逻辑) '刚续费' 条件满足. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                        } else {
                            // 后备逻辑：非刚续费，根据剩余天数决定格式
                            const latestExpiryDateForDiff = utils.parseFormattedDate(latestExpiryDateStr);
                            if (!latestExpiryDateForDiff) {
                                console.error(`[Copy Button] (后备逻辑) 日期解析失败 (for diff calculation): "${latestExpiryDateStr}"`);
                                utils.showNotification('错误：无法解析到期日期以计算差异');
                                return;
                            }

                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0);
                            const dayDiff = Math.ceil((latestExpiryDateForDiff.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
                            console.log(`[Copy Button] (后备逻辑) 计算日差: ${dayDiff} (基于 ${latestExpiryDateStr})`);

                            if (dayDiff >= 29) { // 大于等于约一个月
                                textToCopy = `账号充值完成:\n最新到期时间：${formattedLatestExpiryDateForCopy}`;
                                console.log(`[Copy Button] (后备逻辑) dayDiff >= 29. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                            } else { // 少于一个月，或者日期无效
                                textToCopy = `最新到期时间：${formattedLatestExpiryDateForCopy}`;
                                console.warn(`[Copy Button] (后备逻辑) 非刚续费且 dayDiff < 29 (${dayDiff}). 使用默认回退文本. Text: "${textToCopy.replace(/\n/g, '\\n')}"`);
                            }
                        }
                    }

                    utils.copyToClipboard(textToCopy);

                    copyBtn.textContent = '已复制!';
                    copyBtn.disabled = true;
                    setTimeout(() => {
                        copyBtn.textContent = '复制';
                        copyBtn.disabled = false;
                    }, 1500);
                });
            }
        }

        // {{CHENGQI:
        // Action: Added
        // Timestamp: 2025-07-01 16:50:00 +08:00
        // Reason: P3-EVENT-005 - 添加手动同步按钮事件监听器，实现防抖机制和状态管理
        // Principle_Applied: KISS (简洁的事件处理), 单一职责原则 (专门处理按钮交互)
        // Optimization: 防抖机制防止重复点击，完善的加载状态和错误反馈
        // Architectural_Note (AR): 清晰的事件处理分离，符合现有的事件监听器模式
        // Documentation_Note (DW): 手动同步按钮事件监听器，提供完整的用户交互支持
        // }}
        // {{START MODIFICATIONS}}
        // + 新增手动同步按钮事件监听器
        const manualSyncBtn = panel.querySelector('#manual-sync-btn');
        if (manualSyncBtn) {
            // 防抖机制 - 防止短时间内重复点击
            let isProcessing = false;
            
            manualSyncBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('[Manual Sync Button] 按钮被点击');
                
                // 防抖检查
                if (isProcessing) {
                    console.log('[Manual Sync Button] 同步正在进行中，忽略重复点击');
                    return;
                }
                
                try {
                    // 设置处理状态
                    isProcessing = true;
                    
                    // 更新按钮状态为加载中
                    manualSyncBtn.disabled = true;
                    manualSyncBtn.classList.add('loading');
                    
                    console.log('[Manual Sync Button] 开始执行手动同步...');
                    
                    // 调用手动同步函数
                    const syncResult = await utils.performManualSync();
                    
                    console.log(`[Manual Sync Button] 手动同步完成，结果: ${syncResult}`);
                    
                    // 根据结果提供用户反馈
                    if (syncResult) {
                        utils.showNotification('手动同步成功！');
                    } else {
                        utils.showNotification('手动同步失败，请查看同步状态信息');
                    }
                    
                } catch (error) {
                    console.error('[Manual Sync Button] 手动同步过程中发生错误:', error);
                    utils.showNotification(`手动同步错误: ${error.message}`);
                    
                } finally {
                    // 恢复按钮状态
                    manualSyncBtn.disabled = false;
                    manualSyncBtn.classList.remove('loading');
                    isProcessing = false;
                    
                    console.log('[Manual Sync Button] 按钮状态已恢复');
                }
            });
            
            console.log('[Manual Sync Button] 事件监听器已添加');
        } else {
            console.error('[Manual Sync Button] 未找到手动同步按钮元素');
        }
        // {{END MODIFICATIONS}}

        document.body.appendChild(panel);
        console.log('用户信息面板已创建并应用新样式 (布局调整：汇率在待办下方)。 Rate update logic initiated.');
    }
    // --- 面板功能结束 ---

    // --- 新增：退出登录拦截器 ---
    function addLogoutInterceptor() {
        console.log('添加退出登录拦截器...');
        document.addEventListener('click', async (e) => {
            // 查找被点击元素或其父级中的退出链接
            const logoutLink = e.target.closest('a[href$="logout.php"]');

            if (logoutLink) {
                console.log('检测到退出链接点击。');

                // 异步获取待办事项状态
                const cardDeleted = await GM_getValue('otoy_card_deleted', false);
                const subscriptionCancelled = await GM_getValue('otoy_subscription_cancelled', false);

                console.log(`待办事项状态 - 信用卡已删除: ${cardDeleted}, 订阅已取消: ${subscriptionCancelled}`);

                if (!cardDeleted) {
                    console.log('阻止退出：信用卡删除未完成。');
                    e.preventDefault(); // 阻止默认导航
                    utils.showNotification('操作提示：请先完成删除信用卡操作！');
                    window.location.href = 'https://render.otoy.com/account/cards.php';
                } else if (!subscriptionCancelled) {
                    console.log('阻止退出：取消自动续费未完成。');
                    e.preventDefault(); // 阻止默认导航
                    utils.showNotification('操作提示：请先完成取消自动续费操作！');
                    window.location.href = CONFIG.URLS.SUBSCRIPTIONS; // 修改这里的跳转地址
                } else {
                    console.log('所有待办事项已完成，准备允许退出登录。');
                    // Clear session data BEFORE allowing navigation to logout.php
                    // utils.clearUserSessionData is async, so ensure this completes.
                    // The event listener itself is not async, so we can't directly await here.
                    // One way is to preventDefault, then await, then navigate.
                    e.preventDefault(); // Prevent default navigation first
                    e.stopPropagation(); // Stop other listeners
                    utils.clearUserSessionData().then(() => {
                        console.log('用户会话数据已清除，现在导航到 logout.php。');
                        window.location.href = logoutLink.href; // Proceed to logout
                    }).catch(err => {
                        console.error('[addLogoutInterceptor] Error clearing session data, still logging out:', err);
                        window.location.href = logoutLink.href; // Proceed to logout even if clear fails, to not block user
                    });
                    // 不阻止默认行为，允许退出 (This line is effectively replaced by the async handling above)
                }
            }
        }, true); // 使用捕获阶段，以确保在链接默认行为之前执行
    }
    // --- 拦截器结束 ---

    // --- 新增：续费弹窗 ---
    function createRenewalPrompt() {
        const oldDialog = document.getElementById('custom-renewal-dialog');
        const oldOverlay = document.getElementById('custom-renewal-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-renewal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10005;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-renewal-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 32px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10006;
                min-width: 400px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 28px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 22px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费订阅</h3>
                <div style="margin-bottom: 20px;">
                    <label for="renewal-months" style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">续费月数:</label>
                    <input type="number" id="renewal-months" min="1" value="1" style="
                        display: block;
                        width: 100%;
                        padding: 14px 18px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        border-radius: var(--otoy-radius-md, 8px);
                        box-sizing: border-box;
                        font-size: 15px;
                        font-family: inherit;
                        outline: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        background: rgba(255, 255, 255, 0.8);
                        color: var(--otoy-neutral-900, #212121);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
                    ">
                </div>
                <div style="
                    margin-bottom: 28px;
                    padding: 16px;
                    background: rgba(30, 136, 229, 0.05);
                    border-radius: var(--otoy-radius-md, 8px);
                    border: 1px solid rgba(30, 136, 229, 0.1);
                ">
                    <span style="
                        display: block;
                        margin-bottom: 12px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">计算方式:</span>
                    <div style="display: flex; gap: 24px;">
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="days-37" name="daysPerMonth" value="37" checked style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-primary, #1E88E5);
                            ">
                            <span>37天/月 (标准)</span>
                        </label>
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="days-30" name="daysPerMonth" value="30" style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-primary, #1E88E5);
                            ">
                            <span>30天/月</span>
                        </label>
                    </div>
                </div>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button id="renewal-cancel" style="
                        padding: 12px 28px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        color: var(--otoy-neutral-700, #616161);
                        letter-spacing: 0.02em;
                        position: relative;
                        overflow: hidden;
                    ">取消</button>
                    <button id="renewal-submit" style="
                        padding: 12px 28px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-primary, #1E88E5) 0%, #1976D2 100%);
                        color: white;
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        letter-spacing: 0.02em;
                        box-shadow: 0 4px 14px rgba(30, 136, 229, 0.3);
                        position: relative;
                        overflow: hidden;
                    ">确定</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const monthsInput = dialog.querySelector('#renewal-months');
            const submitBtn = dialog.querySelector('#renewal-submit');
            const cancelBtn = dialog.querySelector('#renewal-cancel');

            // Enhanced style interactions
            if (submitBtn) {
                submitBtn.onmouseover = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                    submitBtn.style.transform = 'translateY(-1px)';
                    submitBtn.style.boxShadow = '0 6px 20px rgba(30, 136, 229, 0.4)';
                };
                submitBtn.onmouseout = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)';
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 4px 14px rgba(30, 136, 229, 0.3)';
                };
                submitBtn.onmousedown = () => {
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 2px 8px rgba(30, 136, 229, 0.3)';
                };
            }
            
            if (cancelBtn) {
                cancelBtn.onmouseover = () => {
                    cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    cancelBtn.style.transform = 'translateY(-1px)';
                };
                cancelBtn.onmouseout = () => {
                    cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    cancelBtn.style.transform = 'translateY(0)';
                };
            }
            
            if (monthsInput) {
                monthsInput.onfocus = () => {
                    monthsInput.style.borderColor = 'var(--otoy-primary, #1E88E5)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 1)';
                    monthsInput.style.boxShadow = '0 0 0 4px rgba(30, 136, 229, 0.1)';
                };
                monthsInput.onblur = () => {
                    monthsInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 0.8)';
                    monthsInput.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05) inset';
                };
            }

            const cleanup = () => {
                // 添加退出动画
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                    if (dialog.parentNode) document.body.removeChild(dialog);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = () => {
                const months = parseInt(monthsInput.value, 10);
                const selectedDaysElement = dialog.querySelector('input[name="daysPerMonth"]:checked');
                if (!months || months <= 0) {
                    // 使用更现代的提示方式
                    monthsInput.style.borderColor = 'var(--otoy-error, #F44336)';
                    monthsInput.style.animation = 'otoyShake 0.5s ease-in-out';
                    monthsInput.focus();
                    
                    setTimeout(() => {
                        monthsInput.style.animation = 'none';
                    }, 500);
                    
                    utils.showNotification('请输入有效的续费月数（大于0的整数）');
                    return;
                }
                if (!selectedDaysElement) {
                    utils.showNotification('请选择计算方式');
                    return;
                }
                const days = parseInt(selectedDaysElement.value, 10);
                cleanup();
                resolve({ months, days });
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消续费'));
            };

            // Handle Enter key in input
            monthsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            });
            
            // Auto focus input
            setTimeout(() => monthsInput.focus(), 100);
        });
    }
    // --- 续费弹窗结束 ---

    // --- 新增：自定义月数续费弹窗 (基于规则3) ---
    async function createRenewalPromptMonths() {
        const oldDialog = document.getElementById('custom-renewal-months-dialog');
        const oldOverlay = document.getElementById('custom-renewal-months-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise(async (resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-renewal-months-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10009;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-renewal-months-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 32px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10010;
                min-width: 480px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 20px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 22px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费提醒与计算</h3>
                <p style="
                    font-size: 15px;
                    color: var(--otoy-neutral-600, #757575);
                    margin-bottom: 28px;
                    text-align: center;
                    line-height: 1.6;
                ">您的上次支付日期较早，建议续费以确保服务连续。</p>
                <div style="margin-bottom: 20px;">
                    <label for="renewal-custom-months" style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">续费月数:</label>
                    <input type="number" id="renewal-custom-months" min="1" value="1" style="
                        display: block;
                        width: 100%;
                        padding: 14px 18px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        border-radius: var(--otoy-radius-md, 8px);
                        box-sizing: border-box;
                        font-size: 15px;
                        font-family: inherit;
                        outline: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        background: rgba(255, 255, 255, 0.8);
                        color: var(--otoy-neutral-900, #212121);
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) inset;
                    ">
                </div>
                <div style="
                    margin-bottom: 24px;
                    padding: 16px;
                    background: rgba(76, 175, 80, 0.05);
                    border-radius: var(--otoy-radius-md, 8px);
                    border: 1px solid rgba(76, 175, 80, 0.1);
                ">
                    <span style="
                        display: block;
                        margin-bottom: 12px;
                        font-size: 14px;
                        color: var(--otoy-neutral-700, #616161);
                        font-weight: 500;
                        letter-spacing: 0.02em;
                    ">计算方式 (天/月):</span>
                    <div style="display: flex; gap: 24px;">
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="renewal-days-30" name="renewalDaysPerMonth" value="30" checked style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-success, #4CAF50);
                            ">
                            <span>30天</span>
                        </label>
                        <label style="
                            display: flex;
                            align-items: center;
                            cursor: pointer;
                            font-size: 14px;
                            color: var(--otoy-neutral-800, #424242);
                            transition: color 0.2s ease;
                        ">
                            <input type="radio" id="renewal-days-37" name="renewalDaysPerMonth" value="37" style="
                                margin-right: 8px;
                                cursor: pointer;
                                accent-color: var(--otoy-success, #4CAF50);
                            ">
                            <span>37天</span>
                        </label>
                    </div>
                </div>
                <div id="renewal-calculated-expiry-display" style="
                    margin-bottom: 28px;
                    font-size: 16px;
                    color: var(--otoy-success, #4CAF50);
                    text-align: center;
                    min-height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    background: rgba(76, 175, 80, 0.08);
                    border-radius: var(--otoy-radius-md, 8px);
                    font-weight: 500;
                    transition: all 0.3s ease;
                "></div>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                ">
                    <button id="renewal-months-cancel" style="
                        padding: 12px 28px;
                        border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                        background: rgba(255, 255, 255, 0.8);
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        color: var(--otoy-neutral-700, #616161);
                        letter-spacing: 0.02em;
                        position: relative;
                        overflow: hidden;
                    ">取消</button>
                    <button id="renewal-months-submit" style="
                        padding: 12px 28px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-success, #4CAF50) 0%, #388E3C 100%);
                        color: white;
                        border-radius: var(--otoy-radius-md, 8px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        letter-spacing: 0.02em;
                        box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
                        position: relative;
                        overflow: hidden;
                    ">计算并确认</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const monthsInput = dialog.querySelector('#renewal-custom-months');
            const submitBtn = dialog.querySelector('#renewal-months-submit');
            const cancelBtn = dialog.querySelector('#renewal-months-cancel');
            const displayDiv = dialog.querySelector('#renewal-calculated-expiry-display');
            const radioButtons = dialog.querySelectorAll('input[name="renewalDaysPerMonth"]');

            let currentLatestActiveExpiryDate = null;
            let currentLatestActiveExpiryDateStr = await GM_getValue('otoy_expiry_date', null);
            if (currentLatestActiveExpiryDateStr) {
                currentLatestActiveExpiryDate = utils.parseFormattedDate(currentLatestActiveExpiryDateStr);
            }
            if (!currentLatestActiveExpiryDate) {
                currentLatestActiveExpiryDate = new Date();
                currentLatestActiveExpiryDate.setHours(0,0,0,0);
                currentLatestActiveExpiryDateStr = utils.formatDate(currentLatestActiveExpiryDate);
                console.log('[RenewalPromptMonths] 无有效现有到期日，或解析失败，将从今天开始计算。');
            }

            async function calculateAndDisplay() {
                const months = parseInt(monthsInput.value, 10);
                const selectedDaysElement = dialog.querySelector('input[name="renewalDaysPerMonth"]:checked');
                if (!months || months <= 0 || !selectedDaysElement) {
                    displayDiv.textContent = '请输入有效月数并选择计算方式。';
                    displayDiv.style.color = 'var(--otoy-error, #F44336)';
                    displayDiv.style.background = 'rgba(244, 67, 54, 0.08)';
                    return null;
                }
                const daysPerMonth = parseInt(selectedDaysElement.value, 10);
                
                const newExpiryDate = new Date(currentLatestActiveExpiryDate.getTime());
                newExpiryDate.setDate(newExpiryDate.getDate() + (months * daysPerMonth));
                
                const formattedNewExpiry = utils.formatDate(newExpiryDate);
                displayDiv.textContent = `计算出的新到期时间: ${formattedNewExpiry}`;
                displayDiv.style.color = 'var(--otoy-success, #4CAF50)';
                displayDiv.style.background = 'rgba(76, 175, 80, 0.08)';
                return { months, daysPerMonth, formattedNewExpiry, newExpiryDateObj: newExpiryDate };
            }

            monthsInput.oninput = calculateAndDisplay;
            radioButtons.forEach(radio => radio.onchange = calculateAndDisplay);
            calculateAndDisplay();

            // Enhanced style interactions
            if (submitBtn) {
                submitBtn.onmouseover = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)';
                    submitBtn.style.transform = 'translateY(-1px)';
                    submitBtn.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                };
                submitBtn.onmouseout = () => {
                    submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.3)';
                };
                submitBtn.onmousedown = () => {
                    submitBtn.style.transform = 'translateY(0)';
                    submitBtn.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                };
            }
            
            if (cancelBtn) {
                cancelBtn.onmouseover = () => {
                    cancelBtn.style.background = 'rgba(245, 245, 245, 0.9)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    cancelBtn.style.transform = 'translateY(-1px)';
                };
                cancelBtn.onmouseout = () => {
                    cancelBtn.style.background = 'rgba(255, 255, 255, 0.8)';
                    cancelBtn.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    cancelBtn.style.transform = 'translateY(0)';
                };
            }
            
            if (monthsInput) {
                monthsInput.onfocus = () => {
                    monthsInput.style.borderColor = 'var(--otoy-success, #4CAF50)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 1)';
                    monthsInput.style.boxShadow = '0 0 0 4px rgba(76, 175, 80, 0.1)';
                };
                monthsInput.onblur = () => {
                    monthsInput.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    monthsInput.style.background = 'rgba(255, 255, 255, 0.8)';
                    monthsInput.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05) inset';
                };
            }

            const cleanup = () => {
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                    if (dialog.parentNode) document.body.removeChild(dialog);
                    if (overlay.parentNode) document.body.removeChild(overlay);
                }, 300);
            };

            submitBtn.onclick = async () => {
                const calculationResult = await calculateAndDisplay();
                if (!calculationResult) {
                    monthsInput.style.borderColor = 'var(--otoy-error, #F44336)';
                    monthsInput.style.animation = 'otoyShake 0.5s ease-in-out';
                    monthsInput.focus();
                    
                    setTimeout(() => {
                        monthsInput.style.animation = 'none';
                    }, 500);
                    
                    utils.showNotification('错误: 请输入有效月数并选择计算方式。');
                    return;
                }

                const { formattedNewExpiry, newExpiryDateObj } = calculationResult;
                const panelExpiryTextElement = document.getElementById('panel-expiry-date-text');
                if (panelExpiryTextElement) {
                    panelExpiryTextElement.textContent = formattedNewExpiry;
                }
                
                let originalExpiryForCopy = '未知原到期日';
                if (currentLatestActiveExpiryDateStr) {
                    const parsedOriginalForDisplay = utils.parseFormattedDate(currentLatestActiveExpiryDateStr);
                    if(parsedOriginalForDisplay) originalExpiryForCopy = utils.formatDate(parsedOriginalForDisplay);
                    else originalExpiryForCopy = currentLatestActiveExpiryDateStr;
                }
                
                await GM_setValue('otoy_original_expiry_date_for_renewal_copy', originalExpiryForCopy);
                await GM_setValue('otoy_calculated_renewal_expiry_date', formattedNewExpiry);
                await GM_setValue('otoy_expiry_date', formattedNewExpiry);
                utils.showNotification(`新到期时间 ${formattedNewExpiry} 已计算并更新。`);
                cleanup();
                resolve(calculationResult);
            };

            cancelBtn.onclick = () => {
                cleanup();
                reject(new Error('用户取消自定义月数续费'));
            };
            
            // Handle keyboard shortcuts
            monthsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    submitBtn.click();
                } else if (e.key === 'Escape') {
                    cancelBtn.click();
                }
            });
            
            // Auto focus input
            setTimeout(() => monthsInput.focus(), 100);
        });
    }
    // --- 自定义月数续费弹窗结束 ---

    // --- 新增：订阅选择弹窗 ---
    function createSubscriptionChoicePrompt() {
        // 先移除可能存在的旧弹窗
        const oldDialog = document.getElementById('custom-subchoice-dialog');
        const oldOverlay = document.getElementById('custom-subchoice-overlay');
        if (oldDialog) oldDialog.remove();
        if (oldOverlay) oldOverlay.remove();

        return new Promise((resolve, reject) => {
            const overlay = document.createElement('div');
            overlay.id = 'custom-subchoice-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 10007;
                animation: otoyFadeIn 0.3s ease;
            `;

            const dialog = document.createElement('div');
            dialog.id = 'custom-subchoice-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.95);
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                backdrop-filter: blur(20px) saturate(180%);
                -webkit-backdrop-filter: blur(20px) saturate(180%);
                padding: 36px;
                border-radius: var(--otoy-radius-xl, 16px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                z-index: 10008;
                min-width: 480px;
                max-width: 90vw;
                font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                border: 1px solid rgba(255, 255, 255, 0.3);
            `;

            dialog.innerHTML = `
                <h3 style="
                    margin: 0 0 20px 0;
                    color: var(--otoy-neutral-900, #212121);
                    font-size: 24px;
                    text-align: center;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                ">续费选择</h3>
                <p style="
                    margin-bottom: 32px;
                    font-size: 15px;
                    color: var(--otoy-neutral-600, #757575);
                    text-align: center;
                    line-height: 1.6;
                ">检测到当前无有效订阅或订阅即将过期，请选择续费方式：</p>
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 28px;
                ">
                    <button id="choice-30days" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-success, #4CAF50) 0%, #388E3C 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(76, 175, 80, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">💎</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费30天</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">Studio+ 专业版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">推荐</span>
                    </button>
                    <button id="choice-37days" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-primary, #2196F3) 0%, #1976D2 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(33, 150, 243, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">⭐</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费37天</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">标准版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">热门</span>
                    </button>
                    <button id="choice-1year" style="
                        padding: 18px 24px;
                        border: none;
                        background: linear-gradient(135deg, var(--otoy-warning, #FF9800) 0%, #F57C00 100%);
                        color: white;
                        border-radius: var(--otoy-radius-lg, 12px);
                        cursor: pointer;
                        font-size: 15px;
                        font-weight: 500;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        font-family: inherit;
                        box-shadow: 0 4px 14px rgba(255, 152, 0, 0.3);
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                        overflow: hidden;
                    ">
                        <span style="display: flex; align-items: center; gap: 12px;">
                            <span style="
                                width: 40px;
                                height: 40px;
                                background: rgba(255, 255, 255, 0.2);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20px;
                            ">🚀</span>
                            <span style="text-align: left;">
                                <div style="font-size: 16px; font-weight: 600;">续费一年</div>
                                <div style="font-size: 13px; opacity: 0.9; margin-top: 2px;">Studio+ 年度版</div>
                            </span>
                        </span>
                        <span style="
                            font-size: 13px;
                            background: rgba(255, 255, 255, 0.2);
                            padding: 4px 12px;
                            border-radius: 12px;
                        ">超值</span>
                    </button>
                </div>
                <button id="choice-cancel" style="
                    padding: 12px 28px;
                    border: 2px solid var(--otoy-neutral-300, #E0E0E0);
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: var(--otoy-radius-md, 8px);
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 500;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                    color: var(--otoy-neutral-700, #616161);
                    letter-spacing: 0.02em;
                    display: block;
                    margin: 0 auto;
                    position: relative;
                    overflow: hidden;
                ">暂不续费</button>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            const btn30 = dialog.querySelector('#choice-30days');
            const btn37 = dialog.querySelector('#choice-37days');
            const btnYear = dialog.querySelector('#choice-1year');
            const btnCancel = dialog.querySelector('#choice-cancel');

            // Enhanced style interactions
            if (btn30) {
                btn30.onmouseover = () => {
                    btn30.style.background = 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)';
                    btn30.style.transform = 'translateY(-2px)';
                    btn30.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                };
                btn30.onmouseout = () => {
                    btn30.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                    btn30.style.transform = 'translateY(0)';
                    btn30.style.boxShadow = '0 4px 14px rgba(76, 175, 80, 0.3)';
                };
                btn30.onmousedown = () => {
                    btn30.style.transform = 'translateY(0)';
                    btn30.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
                };
            }
            if (btn37) {
                btn37.onmouseover = () => {
                    btn37.style.background = 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)';
                    btn37.style.transform = 'translateY(-2px)';
                    btn37.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                };
                btn37.onmouseout = () => {
                    btn37.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
                    btn37.style.transform = 'translateY(0)';
                    btn37.style.boxShadow = '0 4px 14px rgba(33, 150, 243, 0.3)';
                };
                btn37.onmousedown = () => {
                    btn37.style.transform = 'translateY(0)';
                    btn37.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.3)';
                };
            }
            if (btnYear) {
                btnYear.onmouseover = () => {
                    btnYear.style.background = 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)';
                    btnYear.style.transform = 'translateY(-2px)';
                    btnYear.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
                };
                btnYear.onmouseout = () => {
                    btnYear.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
                    btnYear.style.transform = 'translateY(0)';
                    btnYear.style.boxShadow = '0 4px 14px rgba(255, 152, 0, 0.3)';
                };
                btnYear.onmousedown = () => {
                    btnYear.style.transform = 'translateY(0)';
                    btnYear.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
                };
            }
            if (btnCancel) {
                btnCancel.onmouseover = () => {
                    btnCancel.style.background = 'rgba(245, 245, 245, 0.9)';
                    btnCancel.style.borderColor = 'var(--otoy-neutral-400, #BDBDBD)';
                    btnCancel.style.transform = 'translateY(-1px)';
                };
                btnCancel.onmouseout = () => {
                    btnCancel.style.background = 'rgba(255, 255, 255, 0.8)';
                    btnCancel.style.borderColor = 'var(--otoy-neutral-300, #E0E0E0)';
                    btnCancel.style.transform = 'translateY(0)';
                };
                btnCancel.onmousedown = () => {
                    btnCancel.style.transform = 'translateY(0)';
                };
            }

            const cleanup = () => {
                // 添加退出动画
                dialog.style.animation = 'otoyDialogOut 0.3s ease forwards';
                overlay.style.animation = 'otoyFadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                if (dialog.parentNode === document.body) document.body.removeChild(dialog);
                if (overlay.parentNode === document.body) document.body.removeChild(overlay);
                }, 300);
            };

            if (btn30) {
                btn30.onclick = () => {
                    cleanup();
                    console.log('用户选择续费30天，跳转到 Studio+ 预付费页面...');
                    window.location.href = 'https://render.otoy.com/account/subscriptions.php?prepay_tier=STUDIO';
                    resolve('30days');
                };
            }

            if (btn37) {
                btn37.onclick = () => {
                    cleanup();
                    console.log('用户选择续费37天，跳转到标准购买页面...');
                    window.location.href = 'https://render.otoy.com/shop/purchase.php?quantity=1&product=SUBSCR_4T2_ALL_1MC&pluginIDs=10';
                    resolve('37days');
                };
            }

            if (btnYear) {
                btnYear.onclick = () => {
                    cleanup();
                    console.log('用户选择续费一年，跳转到 Studio+ 预付费页面...');
                    window.location.href = 'https://render.otoy.com/account/subscriptions.php?prepay_tier=STUDIO';
                    resolve('1year');
                };
            }

            if (btnCancel) {
                btnCancel.onclick = () => {
                    cleanup();
                    console.log('用户取消续费选择。');
                    reject(new Error('用户取消续费选择'));
                };
            }
        });
    }
    // --- 订阅选择弹窗结束 ---

    const pageHandlers = {
        handleSignUp() {
            const performSignUp = async () => {
                try {
                    // 使用全局函数
                    const input = await createCustomPrompt('注册 OTOY', '请输入邮箱和密码，用空格隔开');

                    // **使用新的解析函数**
                    const { account, password } = parseCredentials(input);

                    // **检查解析结果**
                    if (!account || !password) {
                        alert('无法解析账号或密码，请检查输入格式。\n支持格式示例:\n账号: user@example.com 密码: pass\nuser@example.com pass\nuser@example.com\\npass');
                        return;
                    }

                    // **验证账号是否为邮箱格式 (用于注册)**
                    if (!account.includes('@') || !account.includes('.')) {
                         alert('注册需要有效的邮箱地址作为账号。');
                         return;
                    }
                    // Store credentials temporarily for potential sync after registration (ADDED)
                    await GM_setValue(TEMP_LOGIN_ACCOUNT_KEY, account); // Use 'account' which is the email here
                    await GM_setValue(TEMP_PASSWORD_KEY, password);
                    console.log('[handleSignUp] Temporary credentials stored during registration for potential sync.');

                    const email = account; // 确认是邮箱
                    const username = email.split('@')[0]; // 提取用户名

                    // 更新 fields 对象
                    const fields = {
                        'first_name': username,
                        'username': username,
                        'email': email,       // 使用验证后的邮箱
                        'password': password, // 使用解析出的密码
                        'password_confirmation': password // 使用解析出的密码
                    };

                    Object.entries(fields).forEach(([id, value]) => {
                        const inputEl = utils.getElement(id);
                        if (inputEl) inputEl.value = value;
                    });
                    // 可选：触发一次输入事件，以防网站有基于事件的验证
                    ['email', 'password', 'password_confirmation'].forEach(id => {
                         const inputEl = utils.getElement(id);
                         if (inputEl) {
                              inputEl.dispatchEvent(new Event('input', { bubbles: true }));
                              inputEl.dispatchEvent(new Event('change', { bubbles: true }));
                         }
                    });

                } catch (err) {
                    // 检查错误消息以确认是用户取消
                    if (err.message === '用户取消操作') {
                         console.log('用户取消注册');
                    } else {
                         console.error('注册过程中发生错误:', err);
                         alert('注册过程中发生意外错误，请稍后重试。');
                    }
                    // Ensure temporary credentials are cleared if registration prompt is cancelled or fails early (ADDED)
                    await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    await GM_deleteValue(TEMP_PASSWORD_KEY);
                    console.log('[handleSignUp] Cleared temporary credentials due to cancellation or error during registration prompt.');
                }
            };

            setTimeout(performSignUp, 500);
        },

        handlePurchase() {
            let alipayWasClicked = false;
            // 勾选所有必要的复选框 (例如：服务条款、隐私政策等)
            ['csla_chk', 'tacoc_chk', 'notice_chk', 'recurr_alert_chk'].forEach(id => {
                // 获取指定 ID 的复选框元素
                const checkbox = utils.getElement(id);
                // 如果复选框存在，则将其状态设置为选中
                if (checkbox) checkbox.checked = true;
            });

            // 定义需要自动填写的地址字段及其对应的配置值
            const addressFields = {
                'p_address1': CONFIG.DEFAULT_VALUES.ADDRESS, // 地址行1
                'p_zip': CONFIG.DEFAULT_VALUES.ZIP,         // 邮政编码
                'p_city': CONFIG.DEFAULT_VALUES.ADDRESS,    // 城市 (注意：这里可能需要一个独立的城市配置)
                'p_state': CONFIG.DEFAULT_VALUES.ADDRESS,   // 州/省 (注意：这里可能需要一个独立的州/省配置)
                'p_country': CONFIG.DEFAULT_VALUES.COUNTRY  // 国家
            };

            // 遍历地址字段对象
            Object.entries(addressFields).forEach(([id, value]) => {
                // 获取对应 ID 的输入框元素
                const input = utils.getElement(id);
                // 如果输入框存在且当前值为空，则填入配置的默认值
                if (input && !input.value) input.value = value;
            });

            // 安全地模拟点击"接受账单信息"按钮
            utils.safeClick(utils.getElement('billinfo_accept'));

            // -- 修改：处理两种支付方式 --
            const paymentOptionAlipay = utils.getElement('payment-option-stripe-alipay');
            if (paymentOptionAlipay) {
                console.log('检测到支付宝支付选项，尝试点击...');
                utils.safeClick(paymentOptionAlipay);
                alipayWasClicked = true;
                // 支付宝点击后，后续的 Stripe 特定逻辑（如 iframe 聚焦）可能不适用或需要调整
                // 但支付完成检测逻辑暂时保留
            } else {
            const paymentOptionStripe = utils.getElement('payment-option-stripe');
            if (paymentOptionStripe) {
                    console.log('未检测到支付宝，检测到 Stripe 支付选项，尝试点击...');
                    utils.safeClick(paymentOptionStripe); // 点击 Stripe
                    // 保留 Stripe 特定的 iframe 聚焦逻辑
                    const stripeIframe = document.querySelector('iframe[name^="__privateStripeFrame"]');
                    if (stripeIframe) {
                        stripeIframe.addEventListener('load', () => {
                            try {
                                const iframeDocument = stripeIframe.contentDocument || stripeIframe.contentWindow.document;
                                const cardNumberInput = iframeDocument.querySelector('input[name="cardnumber"]');
                                const expiryInput = iframeDocument.querySelector('input[name="exp-date"]');
                                const cvcInput = iframeDocument.querySelector('input[name="cvc"]');

                                if (cardNumberInput) cardNumberInput.focus();
                            } catch (err) {
                                console.log('无法访问 iframe 内容');
                            }
                        });
                    }
                } else {
                    console.log('未找到支付宝或 Stripe (信用卡) 支付选项。');
                }
            }
            // -- 支付方式处理结束 --

            // --- 恢复：添加基于点击的支付成功检测监听器 ---
            // 假设 stripeCompleteMsg 对两种支付方式都可能出现
                document.addEventListener('click', function handlePaymentComplete() {
                 // 获取显示支付状态的元素
                    const completeMsg = utils.getElement('stripeCompleteMsg');
                // 检查支付完成消息的文本是否完全匹配预期的成功文本
                    if (completeMsg?.innerText === 'Your payment has been completed and your invoice has been processed.') {
                    console.log('通过点击监听器检测到支付成功消息。');
                    // 成功后移除此监听器，避免重复执行
                        document.removeEventListener('click', handlePaymentComplete);
                    // 移除延迟，立即跳转
                    console.log('支付成功(点击检测)，立即跳转到银行卡管理页面...');
                            window.location.href = 'https://render.otoy.com/account/cards.php';
                    }
                });
            // --- 恢复结束 ---

            const checkPaymentStatus = setInterval(() => {
                // Stripe Check
                const completeMsg = utils.getElement('stripeCompleteMsg');
                if (completeMsg?.innerText === 'Your payment has been completed and your invoice has been processed.') {
                     console.log('通过轮询检测到 Stripe 支付成功消息。');
                    clearInterval(checkPaymentStatus);
                    // 移除延迟，立即跳转
                    console.log('Stripe 支付成功(轮询检测)，立即跳转到银行卡管理页面...');
                         window.location.href = 'https://render.otoy.com/account/cards.php';
                    return; // Exit if Stripe success detected
                }

                // Alipay Related (Checklist item 1)
                if (alipayWasClicked) {
                    // The actual success detection for Alipay will now happen on status.php
                    // This block is now primarily for any immediate feedback or errors on the current page if needed in future.
                    // For now, we can just log that Alipay was clicked and we expect a redirect.
                    console.log('支付宝支付已被点击，等待页面跳转到 status.php 进行最终状态确认...');
                    // Removed DOM check for '#pageContent' and specific text, as per new information.
                }
                // --- Alipay Related End ---

                const errorMsg = document.querySelector('.alert-error');
                if (errorMsg) {
                    clearInterval(checkPaymentStatus);
                    window.location.reload();
                }

                // 检测重复订阅警告
                const warningMsg = document.body.textContent.includes('Please note that this is not a payment failure, further attempts to purchase are likely to result in multiple subscriptions.');
                if (warningMsg) {
                    clearInterval(checkPaymentStatus);

                    // --- 新增：与用户名绑定的冷却计时器逻辑 ---
                    const currentUsername = GM_getValue('otoy_username'); // 获取当前用户名
                    if (!currentUsername) {
                        console.error('[Cooldown Timer] 无法获取当前用户名，无法设置冷却计时器。');
                        // 也许显示一个通用错误弹窗？目前仅记录日志并继续显示通用警告弹窗
                    } else {
                        console.log(`[Cooldown Timer] 检测到重复订阅警告，当前用户: ${currentUsername}`);
                        let timers = GM_getValue('otoy_cooldown_timers', {}); // 读取计时器存储
                        const existingTimer = timers[currentUsername];
                        const now = Date.now();
                        let isTimerActive = false;
                        if (existingTimer && (existingTimer.startTime + existingTimer.duration) > now) {
                            isTimerActive = true;
                        }

                        if (!isTimerActive) {
                            console.log(`[Cooldown Timer] 用户 ${currentUsername} 无有效计时器，设置新的1小时冷却。`);
                    const cooldownDuration = 3600 * 1000; // 1 hour in milliseconds
                            timers[currentUsername] = {
                                startTime: now,
                                duration: cooldownDuration
                            };
                            GM_setValue('otoy_cooldown_timers', timers); // 保存更新后的计时器对象
                            GM_setValue('otoy_status_message', '支付处理中，请等待冷却结束'); // 设置全局状态消息
                            console.log(`[Cooldown Timer] 已为用户 ${currentUsername} 设置冷却倒计时。`);
                        } else {
                            console.log(`[Cooldown Timer] 用户 ${currentUsername} 已存在有效的冷却计时器，不进行重置。`);
                            // 可选：如果希望每次看到警告都确保状态消息被设置，可以在这里也调用 GM_setValue('otoy_status_message', ...);
                            // 但当前逻辑是仅在首次设置时设置状态消息
                        }
                    }
                    // --- 冷却计时器逻辑结束 ---

                    // --- 保留现有的弹窗显示逻辑 --- (消息文本不变)
                    const message = '由于官网系统维护等原因，订阅充值正在处理中，这种情况预计60分钟左右订阅时间到账。我这边会帮你留意到账情况，充值完成第一时间通知您！感谢理解。';

                    // 创建自定义弹窗 (美化样式)
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        z-index: 9999;
                        animation: otoyFadeIn 0.3s ease;
                    `;

                    const dialog = document.createElement('div');
                    dialog.style.cssText = `
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) scale(0.95);
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.98) 100%);
                        backdrop-filter: blur(20px) saturate(180%);
                        -webkit-backdrop-filter: blur(20px) saturate(180%);
                        padding: 32px;
                        border-radius: var(--otoy-radius-xl, 16px);
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                        z-index: 10000;
                        max-width: 480px;
                        min-width: 360px;
                        font-family: var(--otoy-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft YaHei", sans-serif);
                        animation: otoyDialogIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                    `;

                    dialog.innerHTML = `
                        <div style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 56px;
                            height: 56px;
                            background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
                            border-radius: 50%;
                            margin: 0 auto 20px;
                        ">
                            <span style="
                                font-size: 28px;
                                color: var(--otoy-warning, #FF9800);
                                animation: otoyPulse 2s infinite;
                            ">⏳</span>
                        </div>
                        <h3 style="
                            margin: 0 0 16px 0;
                            color: var(--otoy-neutral-900, #212121);
                            font-size: 20px;
                            text-align: center;
                            font-weight: 600;
                            letter-spacing: -0.02em;
                        ">支付处理中</h3>
                        <p style="
                            margin-bottom: 28px;
                            font-size: 15px;
                            line-height: 1.6;
                            color: var(--otoy-neutral-600, #757575);
                            text-align: center;
                        ">${message}</p>
                        <button style="
                            padding: 12px 32px;
                            background: linear-gradient(135deg, var(--otoy-warning, #FF9800) 0%, #F57C00 100%);
                            color: white;
                            border: none;
                            border-radius: var(--otoy-radius-md, 8px);
                            cursor: pointer;
                            font-size: 15px;
                            font-weight: 500;
                            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                            font-family: inherit;
                            box-shadow: 0 4px 14px rgba(255, 152, 0, 0.3);
                            display: block;
                            margin: 0 auto;
                            letter-spacing: 0.02em;
                            position: relative;
                            overflow: hidden;
                        " 
                        onmouseover="this.style.background='linear-gradient(135deg, #F57C00 0%, #E65100 100%)'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 6px 20px rgba(255, 152, 0, 0.4)';"
                        onmouseout="this.style.background='linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 14px rgba(255, 152, 0, 0.3)';"
                        onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(255, 152, 0, 0.3)';"
                        >确定并复制</button>
                    `;

                    document.body.appendChild(overlay);
                    document.body.appendChild(dialog);

                    // 点击确定按钮时执行复制 (代码不变)
                    const confirmButton = dialog.querySelector('button');
                    confirmButton.onclick = () => {
                        utils.copyToClipboard(message);
                        document.body.removeChild(dialog);
                        document.body.removeChild(overlay);
                    };
                    // --- 弹窗显示逻辑结束 ---
                }
            }, CONFIG.INTERVALS.PAYMENT_CHECK);

            window.addEventListener('error', (event) => {
                console.error('购买页面发生错误:', event.error);
                setTimeout(() => {
                    window.location.reload();
                }, 5000);
            });
        },

        handleSignIn: async function() { // 1. Modified to async
            console.log('[pageHandlers.handleSignIn] Called.'); // 2. Added log

            const performLogin = async () => {
                console.log('[pageHandlers.handleSignIn.performLogin] Starting execution.'); // 4. Added log

                // 清理逻辑：确保与 utils.clearUserSessionData 保持一致性或覆盖其所需范围
                console.log('[handleSignIn] 执行登录前的GM值清理...');
                const keysToResetOnSignIn = [
                    'otoy_username',
                    'otoy_email',
                    'otoy_expiry_date',
                    SUBSCRIPTION_CANCELLED_STATUS_KEY,
                    'otoy_card_deleted',
                    LATEST_PAYMENT_INFO_KEY, // Replaced LATEST_PAYMENT_DATE_KEY
                    CANCELLED_SUB_IDS_LIST_KEY, 
                    SUBS_TO_PROCESS_QUEUE_KEY,
                    'otoy_calculated_renewal_expiry_date', //通常是临时的
                    'otoy_original_expiry_date_for_renewal_copy', //通常是临时的
                    'otoy_status_message',
                    // TEMP_LOGIN_ACCOUNT_KEY and TEMP_PASSWORD_KEY are specifically handled below, no need to list here
                    DETAIL_PAGE_TASK_KEY, 
                    PROCESSING_SUB_ID_KEY 
                    // Old keys that might have been missed by other cleanups, from original list in handleSignIn before refactor:
                    // 'otoy_subscriptions_to_cancel', // Example old key, if any were missed by main cleanup util
                    // 'otoy_total_subs_to_cancel' // Example old key
                ];
                try {
                    console.log('[handleSignIn] 清理的GM键列表:', keysToResetOnSignIn);
                    for (const key of keysToResetOnSignIn) {
                        if (key) { await GM_deleteValue(key); }
                    }
                    console.log('[handleSignIn] 登录前GM值清理完成。');
                } catch (e) {
                    console.error('[handleSignIn] 登录前GM值清理时出错:', e);
                }

                // 在尝试登录前，清除任何可能残留的旧的临时凭据 (这部分是特定的，保留)
                console.log('[handleSignIn] 清除旧的临时登录账号和密码记录 (如有)...');
                GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                GM_deleteValue(TEMP_PASSWORD_KEY);
                console.log('[handleSignIn] 临时登录账号和密码已清除。');

                try {
                    // 使用全局函数
                    const input = await createCustomPrompt('登录 OTOY', '请输入账号和密码，用空格隔开');

                    // **使用新的解析函数**
                    const { account, password } = parseCredentials(input);

                    // **检查解析结果**
                    if (!account || !password) {
                        alert('无法解析账号或密码，请检查输入格式。\n支持格式示例:\n账号: user 密码: pass\nuser pass\nuser\npass');
                        return; // 如果无法解析，不继续，也不存储临时凭据
                    }

                    // 在尝试填充表单前，临时存储凭据
                    // 这些凭据将在数据成功发送到Google Sheet后由 sendDataToGoogleSheet 清除
                    // 或在登录流程的其他地方失败时被清除
                    GM_setValue(TEMP_LOGIN_ACCOUNT_KEY, account);
                    GM_setValue(TEMP_PASSWORD_KEY, password);
                    console.log('[handleSignIn] 临时登录账号和密码已存储，用于后续可能的记录。');

                    // 获取登录输入框
                    const emailInput = utils.getElement('session_email'); // Otoy 登录字段 ID (可接受邮箱或用户名)
                    const passwordInput = utils.getElement('session_password');

                    if (emailInput && passwordInput) {
                        // **使用解析出的 account 和 password**
                        emailInput.value = account;
                        passwordInput.value = password;

                        // 可选：触发输入事件
                        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
                        passwordInput.dispatchEvent(new Event('change', { bubbles: true }));


                        const signInButton = document.querySelector('input[value="Sign In"]');
                        if (signInButton) {
                            // 短暂延迟后点击，给可能存在的事件监听器一点反应时间
                            setTimeout(() => {
                                console.log('[handleSignIn] 尝试点击登录按钮...');
                                signInButton.click();
                                // 此时，TEMP_LOGIN_ACCOUNT_KEY 和 TEMP_PASSWORD_KEY 已设置。
                                // 如果登录成功并导向购买/续费，它们将被使用。
                            }, 100);
                        } else {
                            console.error('找不到登录按钮');
                            alert('无法找到登录按钮，请手动点击。');
                            // 如果找不到登录按钮，意味着登录流程无法继续，清除临时凭据
                            GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                            GM_deleteValue(TEMP_PASSWORD_KEY);
                            console.log('[handleSignIn] 未找到登录按钮，已清除临时凭据。');
                        }
                    } else {
                        console.error('找不到登录输入框');
                         alert('无法找到登录输入框，请检查页面或联系脚本作者。');
                        // 如果找不到输入框，登录流程无法继续，清除临时凭据
                        GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                        GM_deleteValue(TEMP_PASSWORD_KEY);
                        console.log('[handleSignIn] 未找到登录输入框，已清除临时凭据。');
                    }
                } catch (err) {
                     // 检查错误消息以确认是用户取消
                     if (err.message === '用户取消操作') {
                          console.log('[handleSignIn] 用户取消登录，清除临时凭据。');
                     } else {
                          console.error('[handleSignIn] 登录过程中发生错误，清除临时凭据:', err);
                          // alert('登录过程中发生意外错误，请稍后重试。'); // alert已在createCustomPrompt的catch中处理或不需要
                     }
                    // 任何从 createCustomPrompt 抛出的错误 (包括用户取消) 都应清除临时凭据
                    GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                    GM_deleteValue(TEMP_PASSWORD_KEY);
                }
            };

            // 5. Removed setTimeout
            // setTimeout(performLogin, 500);
            // 6. Added try-catch with await
            try {
                await performLogin();
            } catch (err) {
                console.error('[pageHandlers.handleSignIn] Error during performLogin:', err.message);
                // Ensure GM values are cleared on error, e.g., user cancellation in prompt
                GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                GM_deleteValue(TEMP_PASSWORD_KEY);
                console.log('[pageHandlers.handleSignIn] Cleared temporary credentials due to error/cancellation in performLogin.');
            }
        },

        handleRegisterConfig() {
            utils.safeClick(utils.getElement('userinfo_accept'));

            const passwordInput1 = utils.getElement('p_password');
            const passwordInput2 = utils.getElement('p_password2');

            if (passwordInput1 && passwordInput2) {
                passwordInput1.value = CONFIG.DEFAULT_VALUES.PASSWORD;
                passwordInput2.value = CONFIG.DEFAULT_VALUES.PASSWORD;

                utils.safeClick(utils.getElement('forumuser_accept'));
            } else {
                console.error('找不到密码输入框');
            }
        },

        handleLoginConfig() {
            setInterval(() => {
                window.location.href = CONFIG.URLS.PURCHASES;
            }, CONFIG.INTERVALS.LOGIN_REDIRECT);
        },

        handlePolicyUpdate() {
            utils.safeClick(utils.getElement('msg_accept'));
        },

        handleMacPro() {
            const buttonToClick = document.querySelector('.btn.btn-large.btn-red.purchase_column_buy');
            utils.safeClick(buttonToClick);
        },

        handleMacProShop() {
            const cslaChk = utils.getElement('csla_chk');
            if (cslaChk) {
                cslaChk.click();
                setTimeout(() => {
                    const noticeChk = utils.getElement('notice_chk');
                    utils.safeClick(noticeChk);
                }, 1000);
            }
        },

        handleSubscriptionDetails: async function() { // 声明为 async
            console.log('[handleSubscriptionDetails] 开始处理订阅详情页面 (新逻辑 V3.6 - GM Task Driven)... ');
            
            const currentTask = await GM_getValue(DETAIL_PAGE_TASK_KEY, null);
            const expectedSubId = await GM_getValue(PROCESSING_SUB_ID_KEY, null);
            
            // const urlParams = new URLSearchParams(window.location.search); // 旧的URL参数读取方式
            // const currentPageSubID = urlParams.get('subID'); // 旧的URL参数读取方式
            // const currentTaskFromUrl = urlParams.get('gm_task'); // 旧的URL参数读取方式, 不再使用

            // 从URL中获取当前页面的SubID仍然是必要的
            const urlParamsForSubID = new URLSearchParams(window.location.search);
            const currentPageSubID = urlParamsForSubID.get('subID');

            console.log(`[handleSubscriptionDetails] Task from GM: ${currentTask}, Expected SubID from GM: ${expectedSubId}, Page SubID from URL: ${currentPageSubID}`);

            if (!currentPageSubID) {
                console.error('[handleSubscriptionDetails] 无法从URL获取当前页面的SubID。将尝试清理并返回列表页。');
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                window.location.href = CONFIG.URLS.SUBSCRIPTIONS;
                return;
            }

            if (!expectedSubId || currentPageSubID !== expectedSubId) {
                console.error(`[handleSubscriptionDetails] SubID不匹配或预期SubID缺失。Expected: ${expectedSubId}, Current: ${currentPageSubID}. Task: ${currentTask}. 清理并返回列表页。`);
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                // Potentially clear FETCH_ATTEMPTED_SUBID_KEY if it matches expectedSubId to prevent stale lock
                if (expectedSubId && await GM_getValue(FETCH_ATTEMPTED_SUBID_KEY) === expectedSubId) {
                    await GM_deleteValue(FETCH_ATTEMPTED_SUBID_KEY);
                }
                window.location.href = CONFIG.URLS.SUBSCRIPTIONS;
                return;
            }
            
            let navigationNeeded = true; // Assume we will navigate back unless an error prevents it
            let cancelledSubsList = JSON.parse(await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]'));

            try {
                switch (currentTask) {
                    case 'process_main_sub': 
                        console.log(`[handleSubscriptionDetails] Task: 'process_main_sub' for SubID: ${currentPageSubID}`);
                        
                        // --- New Cancel Logic Start ---
                        console.log('[handleSubscriptionDetails][process_main_sub] Checking for cancel button...');
                        // Fixed the selector to correctly escape the inner single quotes
                        const cancelButtonMain = document.querySelector('span.button_style.button_grey[onclick*="modifySubscription(\\\'cancel\\\')"]');
                        if (cancelButtonMain) {
                            console.log('[handleSubscriptionDetails][process_main_sub] 取消按钮存在，尝试点击取消...');
                            // await this.tryCancelSubscriptionRenewal(); 
                            let cancellationConfirmed = await this.tryCancelSubscriptionRenewal();
                            if (cancellationConfirmed) {
                                if (!cancelledSubsList.includes(currentPageSubID)) {
                                    cancelledSubsList.push(currentPageSubID);
                                    await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                                    console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已确认取消并已标记。`);
                                } else {
                                    console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已确认取消且之前已在取消列表中。`);
                                }
                            } else {
                                console.warn(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 的取消操作未被最终确认。将不会标记为已取消。`);
                            }
                        } else {
                            console.log('[handleSubscriptionDetails][process_main_sub] 取消按钮不存在，视为已取消。');
                            // If cancel button doesn't exist, it means it's already cancelled or not auto-renewing.
                            // So, we should mark it as processed in our list.
                            if (!cancelledSubsList.includes(currentPageSubID)) {
                                cancelledSubsList.push(currentPageSubID);
                                await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                                console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} (无取消按钮) 已标记为取消处理完成。`);
                            } else {
                                console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} (无取消按钮) 已在取消列表中。`);
                            }
                        }
                        // Mark as processed regardless of button state or click result
                        // if (!cancelledSubsList.includes(currentPageSubID)) {
                        // cancelledSubsList.push(currentPageSubID);
                        // await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                        // console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已标记为取消处理完成 (基于按钮检查)。`);
                        // } else {
                        // console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已在取消列表中。`);
                        // }
                        // --- New Cancel Logic End ---

                        console.log('[handleSubscriptionDetails][process_main_sub] Extracting payment date...');
                        const paymentDateStrMain = this.extractPaymentDateFromDetailsPage();
                        if (paymentDateStrMain) {
                            const parsedPaymentDate = utils.parseFormattedDate(paymentDateStrMain);
                            if (parsedPaymentDate) {
                                const year = parsedPaymentDate.getFullYear();
                                const month = (parsedPaymentDate.getMonth() + 1).toString().padStart(2, '0');
                                const day = parsedPaymentDate.getDate().toString().padStart(2, '0');
                                const formattedPaymentDate = `${year}-${month}-${day}`;
                                await GM_setValue(LATEST_PAYMENT_INFO_KEY, { subID: currentPageSubID, paymentDate: formattedPaymentDate });
                                console.log(`[handleSubscriptionDetails][process_main_sub] Payment info for ${currentPageSubID} saved: { subID: ${currentPageSubID}, paymentDate: ${formattedPaymentDate} }`);
                                
                                // Clear fetch attempt if this was the one we were trying to fetch (it should be for main sub process)
                                if (await GM_getValue(FETCH_ATTEMPTED_SUBID_KEY) === currentPageSubID) {
                                    await GM_deleteValue(FETCH_ATTEMPTED_SUBID_KEY);
                                    console.log(`[handleSubscriptionDetails][process_main_sub] Cleared FETCH_ATTEMPTED_SUBID_KEY for ${currentPageSubID}.`);
                                }
                            } else {
                                console.warn(`[handleSubscriptionDetails][process_main_sub] Could not parse extracted payment date: ${paymentDateStrMain}`);
                            }
                        } else {
                            console.warn(`[handleSubscriptionDetails][process_main_sub] Could not extract payment date for ${currentPageSubID}.`);
                        }

                        // Removed old add to cancelled list logic from here
                        break;

                    case 'cancel_queued_sub':
                        console.log(`[handleSubscriptionDetails] Task: 'cancel_queued_sub' for SubID: ${currentPageSubID}`);
                        
                        // --- New Cancel Logic Start ---
                        console.log('[handleSubscriptionDetails][cancel_queued_sub] Checking for cancel button...');
                        // Fixed the selector to correctly escape the inner single quotes
                        const cancelButtonQueued = document.querySelector('span.button_style.button_grey[onclick*="modifySubscription(\\\'cancel\\\')"]');
                        if (cancelButtonQueued) {
                            console.log('[handleSubscriptionDetails][cancel_queued_sub] 取消按钮存在，尝试点击取消...');
                            // await this.tryCancelSubscriptionRenewal();
                            let cancellationConfirmed = await this.tryCancelSubscriptionRenewal();
                            if (cancellationConfirmed) {
                                if (!cancelledSubsList.includes(currentPageSubID)) {
                                    cancelledSubsList.push(currentPageSubID);
                                    await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                                    console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已确认取消并已标记。`);
                                } else {
                                    console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已确认取消且之前已在取消列表中。`);
                                }
                            } else {
                                console.warn(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 的取消操作未被最终确认。将不会标记为已取消。`);
                            }
                        } else {
                            console.log('[handleSubscriptionDetails][cancel_queued_sub] 取消按钮不存在，视为已取消。');
                            // If cancel button doesn't exist, it means it's already cancelled or not auto-renewing.
                            // So, we should mark it as processed in our list.
                            if (!cancelledSubsList.includes(currentPageSubID)) {
                                cancelledSubsList.push(currentPageSubID);
                                await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                                console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} (无取消按钮) 已标记为取消处理完成。`);
                            } else {
                                console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} (无取消按钮) 已在取消列表中。`);
                            }
                        }
                        // Mark as processed regardless of button state or click result
                        // if (!cancelledSubsList.includes(currentPageSubID)) {
                        // cancelledSubsList.push(currentPageSubID);
                        // await GM_setValue(CANCELLED_SUB_IDS_LIST_KEY, JSON.stringify(cancelledSubsList));
                        // console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已标记为取消处理完成 (基于按钮检查)。`);
                        // } else {
                        // console.log(`[handleSubscriptionDetails][${currentTask}] SubID ${currentPageSubID} 已在取消列表中。`);
                        // }
                        // --- New Cancel Logic End ---
                        
                        // Removed old add to cancelled list logic from here
                        break;

                    case 'fetch_payment_date_for_main':
                        console.log(`[handleSubscriptionDetails] Task: 'fetch_payment_date_for_main' for SubID: ${currentPageSubID}`);
                        const paymentDateStrFetch = this.extractPaymentDateFromDetailsPage();
                        if (paymentDateStrFetch) {
                            const parsedPaymentDate = utils.parseFormattedDate(paymentDateStrFetch);
                            if (parsedPaymentDate) {
                                const year = parsedPaymentDate.getFullYear();
                                const month = (parsedPaymentDate.getMonth() + 1).toString().padStart(2, '0');
                                const day = parsedPaymentDate.getDate().toString().padStart(2, '0');
                                const formattedPaymentDate = `${year}-${month}-${day}`;
                                await GM_setValue(LATEST_PAYMENT_INFO_KEY, { subID: currentPageSubID, paymentDate: formattedPaymentDate });
                                console.log(`[handleSubscriptionDetails][fetch_payment_date_for_main] Payment info for ${currentPageSubID} saved: { subID: ${currentPageSubID}, paymentDate: ${formattedPaymentDate} }`);
                                
                                const attemptedSubId = await GM_getValue(FETCH_ATTEMPTED_SUBID_KEY);
                                if (attemptedSubId === currentPageSubID) {
                                    await GM_deleteValue(FETCH_ATTEMPTED_SUBID_KEY);
                                    console.log(`[handleSubscriptionDetails][fetch_payment_date_for_main] Cleared FETCH_ATTEMPTED_SUBID_KEY for ${currentPageSubID}.`);
                                }
                            } else {
                                console.warn(`[handleSubscriptionDetails][fetch_payment_date_for_main] Could not parse extracted payment date: ${paymentDateStrFetch}`);
                            }
                        } else {
                            console.warn(`[handleSubscriptionDetails][fetch_payment_date_for_main] Could not extract payment date for ${currentPageSubID}.`);
                        }
                        // Note: fetch_payment_date_for_main does not automatically add to CANCELLED_SUB_IDS_LIST_KEY
                        // as its cancellation status should be handled by process_main_sub or a cancel_queued_sub task.
                        break;

                    default:
                        console.warn(`[handleSubscriptionDetails] Unknown or no task defined in GM: '${currentTask}'. No specific action taken for SubID ${currentPageSubID}.`);
                        break;
                }
            } catch (e) {
                console.error(`[handleSubscriptionDetails] Error during task '${currentTask}' for SubID ${currentPageSubID}:`, e);
            } finally {
                console.log('[handleSubscriptionDetails] Entering finally block. Clearing task-specific GM values.');
                await GM_deleteValue(DETAIL_PAGE_TASK_KEY);
                await GM_deleteValue(PROCESSING_SUB_ID_KEY);
                console.log(`[handleSubscriptionDetails] Cleared ${DETAIL_PAGE_TASK_KEY} and ${PROCESSING_SUB_ID_KEY}.`);

                if (navigationNeeded) {
                    console.log('[handleSubscriptionDetails] About to navigate back to subscriptions list.');
                    window.location.href = CONFIG.URLS.SUBSCRIPTIONS;
                } else {
                    console.log('[handleSubscriptionDetails] Navigation suppressed due to error or specific condition.');
                }
            }
        },

        // NEW HELPER for handleSubscriptionDetails
        tryCancelSubscriptionRenewal: async function() {
            const initialCancelButtonSelector = 'span.button_style.button_grey[onclick*=\"modifySubscription(\\\'cancel\\\')\"]';
            const cancelButton = document.querySelector(initialCancelButtonSelector);

            if (!cancelButton) {
                console.log('[tryCancelSubscriptionRenewal] 初始取消按钮未找到。可能已取消或不适用。视为成功处理。');
                return true; // Consider it "processed" or already cancelled
            }

            try {
                console.log('[tryCancelSubscriptionRenewal] 找到初始取消按钮，点击...');
                cancelButton.click();

                // Helper function to poll for an element
                async function pollForElement(selector, timeout, interval, expectMissing = false) {
                    const startTime = Date.now();
                    while (Date.now() - startTime < timeout) {
                        const element = document.querySelector(selector);
                        if (expectMissing) {
                            if (!element) return true; // Element is missing as expected
                        } else {
                            if (element) return element; // Element found
                        }
                        await new Promise(resolve => setTimeout(resolve, interval));
                    }
                    return expectMissing ? false : null; // Timeout: element not missing when expected, or not found when expected
                }

                // 1. Poll for the confirmation button in the modal
                console.log('[tryCancelSubscriptionRenewal] 等待确认弹窗中的确认按钮...');
                const confirmButtonSelector = 'div.modal-content button.btn.btn-primary.btn_confirm';
                const confirmButton = await pollForElement(confirmButtonSelector, 8000, 200); // 8s timeout, 200ms interval

                if (confirmButton) {
                    console.log('[tryCancelSubscriptionRenewal] 找到确认按钮，点击...');
                    confirmButton.click();

                    // 2. Poll for the disappearance of the initial "Cancel Subscription" button
                    // This indicates the cancellation was likely successful and the UI has updated.
                    console.log('[tryCancelSubscriptionRenewal] 等待初始取消按钮消失以确认取消...');
                    const cancellationConfirmedByButtonDisappearance = await pollForElement(initialCancelButtonSelector, 10000, 500, true); // 10s timeout, 500ms interval, expect button to be missing

                    if (cancellationConfirmedByButtonDisappearance) {
                        console.log('[tryCancelSubscriptionRenewal] 初始取消按钮已消失。取消操作已确认成功。');
                        return true;
                    } else {
                        console.warn('[tryCancelSubscriptionRenewal] 点击了确认按钮，但初始取消按钮在超时后仍存在。无法最终确认取消成功。');
                        return false;
                    }
                } else {
                    console.warn('[tryCancelSubscriptionRenewal] 未在超时内找到弹窗中的确认按钮。取消操作可能未完成。');
                    return false;
                }
            } catch (e) {
                console.error('[tryCancelSubscriptionRenewal] 取消过程中发生错误:', e);
                return false;
            }
        },

        // NEW HELPER for handleSubscriptionDetails
        extractPaymentDateFromDetailsPage: function() {
            console.log('[extractPaymentDateFromDetailsPage] Attempting to extract payment date...');
            const candidateTables = document.querySelectorAll('table.invoice_table');
            let detailTable = null;

            console.log(`[extractPaymentDateFromDetailsPage] Found ${candidateTables.length} candidate tables with class "invoice_table".`);
            if (candidateTables.length === 0) {
                console.warn('[extractPaymentDateFromDetailsPage] No tables with class "invoice_table" found.');
                return null;
            }

            for (const table of candidateTables) {
                console.log('[extractPaymentDateFromDetailsPage] Inspecting table:', table);
                const headers = table.querySelectorAll('th');
                for (const header of headers) {
                    if (header.textContent && header.textContent.includes('Date of Last Payment')) {
                        detailTable = table;
                        console.log('[extractPaymentDateFromDetailsPage] Found target table with header "Date of Last Payment".', detailTable);
                        break; // Found the th, break from inner loop
                    }
                }
                if (detailTable) {
                    break; // Found the table, break from outer loop
                }
            }

            if (!detailTable) {
                console.warn('[extractPaymentDateFromDetailsPage] No table with class "invoice_table" and header "Date of Last Payment" found after checking all candidates.');
                return null;
            }

            // Now detailTable is the one we want to process
            console.log('[extractPaymentDateFromDetailsPage] Processing identified target table for payment date.');
            if (detailTable.rows && detailTable.rows.length > 2) { // Check if it has enough rows (at least 3 rows for index 2)
                const paymentDateRow = detailTable.rows[2]; // Payment date is usually in the 3rd row (index 2)
                console.log('[extractPaymentDateFromDetailsPage] Target row (index 2) identified:', paymentDateRow);
                if (paymentDateRow && paymentDateRow.cells && paymentDateRow.cells.length > 3) { // And in the 4th cell (index 3)
                    const paymentDateCell = paymentDateRow.cells[3];
                    console.log('[extractPaymentDateFromDetailsPage] Target cell (index 3) identified:', paymentDateCell);
                    const paymentDateCellText = paymentDateCell.textContent.trim();
                    console.log(`[extractPaymentDateFromDetailsPage] Extracted raw payment date text: "${paymentDateCellText}" from the identified table.`);
                    return paymentDateCellText; // Return the raw string, parsing will be done by caller
                } else {
                    console.warn('[extractPaymentDateFromDetailsPage] Identified target table and row, but payment date cell structure is not as expected. Target Row Cells Length: ' + (paymentDateRow && paymentDateRow.cells ? paymentDateRow.cells.length : 'N/A'));
                }
            } else {
                 console.warn('[extractPaymentDateFromDetailsPage] Identified target table, but it has too few rows (' + (detailTable.rows ? detailTable.rows.length : 'N/A') + ') to contain payment date at expected location (row index 2).');
            }
            return null; // Return null if not found or structure mismatch in the identified table
        },

        handleCards() {
            console.log('[handleCards] Entering handleCards function...'); 

            // --- finalizeCardRemovalAndNavigate helper function (remains the same) ---
            async function finalizeCardRemovalAndNavigate() {
                console.log('[handleCards.finalizeCardRemovalAndNavigate] Entering helper function...'); 
                console.log('[handleCards.finalizeCardRemovalAndNavigate] Attempting to cleanup old workflow status...'); 
                await utils.cleanupWorkflowStatus(); 
                console.log('[handleCards.finalizeCardRemovalAndNavigate] Old workflow status cleanup attempted.'); 
                
                // --- 新增：更新 otoy_card_deleted 状态 ---
                console.log('[handleCards.finalizeCardRemovalAndNavigate] Setting otoy_card_deleted to true.');
                await GM_setValue('otoy_card_deleted', true);
                // --- 新增结束 ---

                const oldStatus = await GM_getValue('otoy_status_message'); 
                if (oldStatus === '无银行卡记录') {
                    await GM_deleteValue('otoy_status_message'); 
                    console.log('[handleCards.finalizeCardRemovalAndNavigate] Cleared old "无银行卡记录" status message.'); 
                }

                console.log('[handleCards.finalizeCardRemovalAndNavigate] Card processing complete, preparing to navigate to subscriptions page (subscriptions.php)...');
                    window.location.href = 'https://render.otoy.com/account/subscriptions.php';
            }
            // --- Helper function end ---

            const table = document.querySelector('table.invoice_table'); // Use specific selector
            if (!table) {
                console.log('[handleCards] No table.invoice_table element found. Exiting handleCards.'); 
                return;
            }
            console.log('[handleCards] table.invoice_table found.');

            const firstTbody = table.tBodies[0];
            if (!firstTbody) {
                console.log('[handleCards] No tbody found in table.invoice_table. Exiting handleCards.');
                return;
            }
            console.log('[handleCards] First tbody found:', firstTbody);

            let noCardMessageFound = false;
            if (firstTbody.rows.length > 0) {
                const firstRowInTbody = firstTbody.rows[0];
                console.log('[handleCards] Checking first row in first tbody for "no card" message:', firstRowInTbody);
                if (firstRowInTbody.cells.length === 1 && firstRowInTbody.cells[0]) {
                    const cell = firstRowInTbody.cells[0];
                    const cellText = cell.textContent.trim().toLowerCase();
                    const colspanAttr = cell.getAttribute('colspan');
                    console.log(`[handleCards] First row, first cell details - colspan: ${colspanAttr}, text: "${cellText}"`);
                    if (colspanAttr && parseInt(colspanAttr) >= 4 && cellText.includes('-- no saved cards --')) {
                        noCardMessageFound = true;
                    }
                } else {
                     console.log('[handleCards] First row in tbody does not have exactly one cell, or cell is missing. Not the "no card" message row by this check.');
                }
            } else {
                 console.log('[handleCards] First tbody has no rows. Cannot check for "no card" message.');
            }

            if (noCardMessageFound) {
                console.log('[handleCards] Condition: "-- No saved cards --" message found. Proceeding as no card on file.');
                finalizeCardRemovalAndNavigate();
                            } else {
                console.log('[handleCards] "-- No saved cards --" message NOT found. Attempting card removal logic.');
                if (firstTbody.rows.length > 0) {
                    const cardDataRow = firstTbody.rows[0]; // Assuming the first row in tbody is the card data row if not "no card" message
                    console.log('[handleCards] Targeting potential card data row:', cardDataRow);

                    if (cardDataRow.cells.length >= 4) { // Card data row should have at least 4 cells
                        console.log(`[handleCards] Card data row has ${cardDataRow.cells.length} cells. Checking cell 3 (index) for "Remove" link.`);
                        const fourthCell = cardDataRow.cells[3]; 
                        if (fourthCell) {
                            console.log('[handleCards] Fourth cell of card data row found. Text content:', fourthCell.textContent);
                            if (fourthCell.textContent.toLowerCase().includes('remove')) {
                                const removeLink = fourthCell.querySelector('a[href*="javascript:CC_remove"]');
                                console.log('[handleCards] "Remove" text found. Specific Remove link element:', removeLink);
                                if (removeLink && utils.safeClick(removeLink)) {
                                    console.log('[handleCards] Successfully clicked "Remove" link. Waiting for confirmation timeout...');
                                    setTimeout(async () => {
                                        console.log('[handleCards] Checking card removal status after timeout...');
                                        const updatedTable = document.querySelector('table.invoice_table');
                                        const updatedFirstTbody = updatedTable ? updatedTable.tBodies[0] : null;
                                        let cardActuallyRemoved = false;

                                        if (updatedFirstTbody && updatedFirstTbody.rows.length > 0) {
                                            const firstRowAfterRemoval = updatedFirstTbody.rows[0];
                                            console.log('[handleCards] Checking first row after removal attempt:', firstRowAfterRemoval);
                                            if (firstRowAfterRemoval.cells.length === 1 && firstRowAfterRemoval.cells[0]) {
                                                const cellAfterRemoval = firstRowAfterRemoval.cells[0];
                                                const colspanAfterRemoval = cellAfterRemoval.getAttribute('colspan');
                                                const textAfterRemoval = cellAfterRemoval.textContent.trim().toLowerCase();
                                                console.log(`[handleCards] Post-removal check - colspan: ${colspanAfterRemoval}, text: "${textAfterRemoval}"`);
                                                if (colspanAfterRemoval && parseInt(colspanAfterRemoval) >= 4 && textAfterRemoval.includes('-- no saved cards --')) {
                                                    cardActuallyRemoved = true;
                                                }
                                            }
                                        }

                                        if (cardActuallyRemoved) {
                                            console.log('[handleCards] Card removal confirmed: Table now shows "-- No saved cards --". Calling finalize.');
                                await finalizeCardRemovalAndNavigate();
                                        } else {
                                            console.warn('[handleCards] Failed to confirm card removal (did not find "-- No saved cards --" message after attempted removal). Workflow will not proceed automatically.');
                            }
                                    }, 3000);
                    } else {
                                    console.error('[handleCards] Failed to click the "Remove" link or specific link not found.');
                    }
                } else {
                                console.log('[handleCards] "Remove" text NOT found in the fourth cell of the card data row. Text was:', fourthCell.textContent);
                }
            } else {
                            console.log('[handleCards] Fourth cell (cardDataRow.cells[3]) not found in the card data row.');
                        }
                    } else {
                        console.warn(`[handleCards] Identified card data row has an unexpected number of cells: ${cardDataRow.cells.length} (expected >= 4). Cannot proceed with removal.`);
                    }
                } else {
                     console.warn('[handleCards] No rows found in the first tbody to process for existing card removal (after not finding "no card" message).');
                }
            }
        },

        handleSubscriptions: async function() { // 将此函数声明为 async
            // V3.2 - Step 1: Refactor top-level decision logic
            console.log('[handleSubscriptions] 开始处理订阅页面 (新逻辑V3.5 - 早期队列处理)...'); // 版本更新

            // --- Helper function: Scan page for active subscriptions (remains the same) ---
            function scanPageForActiveSubscriptions() {
                // ... (函数体保持不变) ...
                const subs = [];
                const table = document.querySelector('table.licenseTable');
                if (table) {
                    const allRows = table.querySelectorAll('tr');
                    const currentDateForExpiryCheck = new Date();
                    currentDateForExpiryCheck.setHours(0, 0, 0, 0);
                    allRows.forEach((row, index) => {
                        if (index === 0) return;
                        const cells = row.cells;
                        if (cells.length < 7) return;
                        const expiryDateTextCell = cells[2];
                        const viewInfoLinkElement = cells[6]?.querySelector('a[href*="subscriptionDetails.php?subID="]');
                        if (expiryDateTextCell && viewInfoLinkElement) {
                            const expiryDateStr = expiryDateTextCell.textContent.trim();
                            const parsedDate = utils.parseFormattedDate(expiryDateStr);
                            const subIDMatch = viewInfoLinkElement.href.match(/subID=(\d+)/);
                            if (parsedDate && subIDMatch && parsedDate > currentDateForExpiryCheck) { // 修改此处的日期比较
                                subs.push({
                                    subID: subIDMatch[1],
                                    expiryDate: parsedDate, // Date Object
                                    expiryText: expiryDateStr, // Original String "YYYY年MM月DD日" or "YYYY-MM-DD"
                                    viewInfoLink: viewInfoLinkElement.href
                                });
                            }
                        }
                    });
                }
                console.log(`[scanPageForActiveSubscriptions] 从页面表格提取到 ${subs.length} 个有效且未过期的原始订阅。`);
                return subs;
            }
            // --- End Helper function ---

            const activeSubsRaw = scanPageForActiveSubscriptions(); // Scan page
            if (activeSubsRaw.length > 0) {
                activeSubsRaw.sort((a, b) => b.expiryDate.getTime() - a.expiryDate.getTime()); 
            }
            const latestActiveSub = activeSubsRaw.length > 0 ? activeSubsRaw[0] : null;

            // --- Get current state from GM --- 
            console.log('[handleSubscriptions][A] Fetching initial GM state...');
            const cancelledSubs = JSON.parse(await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]'));
            let queue = JSON.parse(await GM_getValue(SUBS_TO_PROCESS_QUEUE_KEY, '[]'));
            const currentPaymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);
            const attemptedSubIdForFetch = await GM_getValue(FETCH_ATTEMPTED_SUBID_KEY, null);
            // Log initial state for debugging (optional here, was done before)
            // console.log('[handleSubscriptions] Initial GM State Check...') 

            // --- BEGIN: New Early Queue Processing Logic (Plan Step 3 & 4) ---
            console.log('[handleSubscriptions][EarlyCheck] Identifying uncancelled active subscriptions...');
            const uncancelledActiveSubs = activeSubsRaw.filter(sub => !cancelledSubs.includes(sub.subID));
            console.log(`[handleSubscriptions][EarlyCheck] Found ${uncancelledActiveSubs.length} uncancelled active subs.`);

            let needsQueueUpdate = false;
            if (uncancelledActiveSubs.length > 0) {
                console.log('[handleSubscriptions][EarlyCheck] Populating queue with uncancelled subs (if not already present). Current queue length:', queue.length);
                uncancelledActiveSubs.forEach(sub => {
                    if (!queue.includes(sub.subID)) {
                        queue.push(sub.subID);
                        needsQueueUpdate = true;
                        console.log(`[handleSubscriptions][EarlyCheck] Added uncancelled SubID ${sub.subID} to queue.`);
                    }
                });

                if (needsQueueUpdate) {
                    console.log('[handleSubscriptions][EarlyCheck] Saving updated queue to GM. New length:', queue.length);
                    await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(queue));
                }
            }

            // Immediately process the queue if it's not empty
            if (queue.length > 0) {
                console.log(`[handleSubscriptions][QueueProc] Queue has ${queue.length} items. Processing the first one.`);
                const subIdToProcess = queue.shift(); // Get and remove first
                await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(queue)); // Save updated queue
                console.log(`[handleSubscriptions][QueueProc] Removed ${subIdToProcess} from queue. Remaining: ${queue.length}`);

                const targetSub = activeSubsRaw.find(s => s.subID === subIdToProcess);
                if (targetSub) {
                    // Determine task: process main if it's the latest, otherwise cancel queued
                    const task = (latestActiveSub && subIdToProcess === latestActiveSub.subID) ? 'process_main_sub' : 'cancel_queued_sub';
                    
                    console.log(`[handleSubscriptions][QueueProc] Preparing to navigate. Task: ${task}, SubID: ${subIdToProcess}`);
                    await GM_setValue(DETAIL_PAGE_TASK_KEY, task);
                    await GM_setValue(PROCESSING_SUB_ID_KEY, subIdToProcess);
                    
                    // Add a small delay before navigation, might help prevent race conditions
                    await new Promise(resolve => setTimeout(resolve, 200)); 
                    
                    console.log(`[handleSubscriptions][QueueProc] Navigating to: ${targetSub.viewInfoLink}`);
                    window.location.href = targetSub.viewInfoLink;
                    return; // IMPORTANT: Exit handleSubscriptions after initiating navigation
                } else {
                    // This might happen if the active sub list changed between scan and processing
                    console.warn(`[handleSubscriptions][QueueProc] SubID ${subIdToProcess} from queue was not found in the current active subscriptions list (length ${activeSubsRaw.length}). Skipping this item. Queue length now ${queue.length}.`);
                    // Consider adding a reload here or letting the next run handle it.
                    // For now, just log and let the function continue (to update status etc.) 
                    // but it might be better to reload: window.location.reload(); return;
                }
            }
            console.log('[handleSubscriptions][QueueProc] Queue is empty or item not found/processed. Continuing execution.');
            // --- END: New Early Queue Processing Logic ---

            // --- Logic below only executes if the queue was empty and no navigation occurred ---

            // --- F. Maintain/Fetch payment date for the latest active subscription (if queue is empty and latestActiveSub exists) ---
            // This logic might still be relevant if the main sub cancellation was processed, but payment date fetch failed previously
            console.log('[handleSubscriptions][PaymentDateCheck] Checking payment date for latest active subscription...');
            if (/*queue.length === 0 &&*/ latestActiveSub) { // Queue check is implicitly true if we reached here
                let needsPaymentDateFetch = false;
                if (!currentPaymentInfo || currentPaymentInfo.subID !== latestActiveSub.subID) {
                    if (attemptedSubIdForFetch === latestActiveSub.subID) {
                        console.warn(`[handleSubscriptions] Payment info for latest active sub ${latestActiveSub.subID} is still missing/stale after an attempted fetch. Not retrying immediately to prevent loop.`);
                    } else {
                        console.log(`[handleSubscriptions] Payment info for latest active sub ${latestActiveSub.subID} needs to be fetched/updated. CurrentInfo: ${currentPaymentInfo ? JSON.stringify(currentPaymentInfo) : 'None'}`);
                        needsPaymentDateFetch = true;
                    }
                }

                if (needsPaymentDateFetch) {
                    await GM_setValue(DETAIL_PAGE_TASK_KEY, 'fetch_payment_date_for_main');
                    await GM_setValue(PROCESSING_SUB_ID_KEY, latestActiveSub.subID);
                    await GM_setValue(FETCH_ATTEMPTED_SUBID_KEY, latestActiveSub.subID); // Mark that we are attempting this fetch
                    console.log(`[handleSubscriptions] Navigating to fetch payment date for latest active SubID: ${latestActiveSub.subID} (Task: fetch_payment_date_for_main)`);
                    window.location.href = latestActiveSub.viewInfoLink;
                    return;
                }
            }

            // --- G. Update overall SUBSCRIPTION_CANCELLED_STATUS_KEY ---
            // This should run if no navigations happened above.
            console.log('[handleSubscriptions][StatusUpdate] Updating final subscription cancellation status...');
            // Re-fetch cancelledSubs for accuracy *after* potential queue processing might have completed in previous runs
            const finalCheckCancelledSubs = JSON.parse(await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]')); 
            const finalCheckUncancelledActive = activeSubsRaw.filter(sub => !finalCheckCancelledSubs.includes(sub.subID));
            
            if (finalCheckUncancelledActive.length === 0 && activeSubsRaw.length > 0) { // All active are cancelled
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, true);
                console.log('[handleSubscriptions][StatusUpdate] All active subscriptions are processed for cancellation. Status set to true.');
            } else if (finalCheckUncancelledActive.length > 0) { // Some active are still not marked as cancelled
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false);
                console.log(`[handleSubscriptions][StatusUpdate] Found ${finalCheckUncancelledActive.length} active subs not yet in CANCELLED_SUB_IDS_LIST_KEY. Status set to false.`);
            } else { // No active subs, or some other state
                await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, true); 
                console.log('[handleSubscriptions][StatusUpdate] No active subscriptions found, or all processed. Cancellation status set to true.');
            }
            await createUserInfoPanel(); // Refresh panel after status update

            // --- H. Renewal Prompts (Step 2 & G from old logic) ---
            // This logic runs if no navigation has occurred above.
            console.log('[handleSubscriptions] Checking for renewal prompts...');
            let latestExpiryDateObj = null;
            let latestExpiryTextForPanel = "无有效订阅";
            if (latestActiveSub) { // latestActiveSub is already sorted, [0] is the latest
                latestExpiryDateObj = latestActiveSub.expiryDate;
                latestExpiryTextForPanel = latestActiveSub.expiryText;
            }
            await GM_setValue('otoy_expiry_date', latestExpiryTextForPanel);
            console.log(`[handleSubscriptions] Global otoy_expiry_date updated to: ${latestExpiryTextForPanel}`);

            const today = new Date(); // Ensure `today` is defined for this scope
            today.setHours(0, 0, 0, 0);

            if (!latestExpiryDateObj || latestExpiryDateObj.getTime() <= today.getTime() + (1 * 24 * 60 * 60 * 1000)) {
                console.log('[handleSubscriptions] Condition for Step 2 renewal prompt (expires soon/no active subs) met.');
                if (latestExpiryDateObj) {
                    console.log(`[handleSubscriptions] Latest expiry: ${utils.formatDate(latestExpiryDateObj)}`);
                }
                createSubscriptionChoicePrompt().catch(err => console.warn('[handleSubscriptions] Choice prompt error/cancelled:', err.message));
                return; 
            }
            console.log('[handleSubscriptions] Step 2 renewal prompt condition not met.');

            // Step G from old logic (now part of H) - Renewal prompt based on payment date
            // Uses currentPaymentInfo which should be for the latestActiveSub if fetch logic worked.
            if (currentPaymentInfo && currentPaymentInfo.subID === latestActiveSub?.subID) {
                const paymentDateObj = utils.parseFormattedDate(currentPaymentInfo.paymentDate);
                if (paymentDateObj) {
                    if (today.getTime() - paymentDateObj.getTime() > 2 * 24 * 60 * 60 * 1000) {
                        console.log(`[handleSubscriptions] Condition for Step 4 (old G) renewal prompt (payment date ${currentPaymentInfo.paymentDate} older than 2 days) met.`);
                        createRenewalPromptMonths().catch(err => console.warn('[handleSubscriptions] Renewal prompt (months) error/cancelled:', err.message));
                        // return; // ENSURING THIS LINE IS COMMENTED OR REMOVED
                    } else {
                        console.log(`[handleSubscriptions] Payment date ${currentPaymentInfo.paymentDate} for sub ${currentPaymentInfo.subID} is recent. No Step 4 (old G) prompt.`);
                    }
                } else {
                    console.warn(`[handleSubscriptions] Could not parse paymentDate from LATEST_PAYMENT_INFO_KEY: ${currentPaymentInfo.paymentDate} for Step 4 (old G) prompt.`);
                }
            } else if (latestActiveSub) {
                console.log('[handleSubscriptions] Payment info for latest active sub not available or not current for Step 4 (old G) prompt.');
            }
            console.log('[handleSubscriptions] Step 4 (old G) renewal prompt condition not met or skipped.');

            // --- I. Check for any newly appeared uncancelled subscriptions --- 
            // REMOVED THIS BLOCK as per Plan Step 3
            /*
            console.log('[handleSubscriptions] Final check for newly appeared uncancelled subscriptions...');
            const finalCancelledSubs = JSON.parse(await GM_getValue(CANCELLED_SUB_IDS_LIST_KEY, '[]')); // Re-fetch for most up-to-date
            const newlyFoundUncancelledSubs = activeSubsRaw.filter(sub => !finalCancelledSubs.includes(sub.subID));

            if (newlyFoundUncancelledSubs.length > 0) {
                console.log(`[handleSubscriptions] Found ${newlyFoundUncancelledSubs.length} newly appeared/missed uncancelled SubIDs.`);
                let currentQueue = JSON.parse(await GM_getValue(SUBS_TO_PROCESS_QUEUE_KEY, '[]'));
                let addedToQueueCount = 0;
                newlyFoundUncancelledSubs.forEach(sub => {
                    // Ensure not to re-add if it's the main sub that might be pending payment date fetch but cancellation is done.
                    // Or if it's already in the queue (though shift should prevent this for current run).
                    // if (sub.subID !== latestActiveSub?.subID || !currentPaymentInfo || currentPaymentInfo.subID !== latestActiveSub.subID) {
                    if (!currentQueue.includes(sub.subID)) { // Simplified check: just add if not already in queue
                         currentQueue.push(sub.subID);
                         addedToQueueCount++;
                         console.log(`[handleSubscriptions][FinalCheck] Added SubID ${sub.subID} to queue.`);
                    // }
                    } else {
                        console.log(`[handleSubscriptions][FinalCheck] SubID ${sub.subID} already in queue or processed. Skipping add.`);
                    }
                });
                if (addedToQueueCount > 0) {
                    await GM_setValue(SUBS_TO_PROCESS_QUEUE_KEY, JSON.stringify(currentQueue));
                    await GM_setValue(SUBSCRIPTION_CANCELLED_STATUS_KEY, false); // Ensure status reflects pending work
                    console.log(`[handleSubscriptions] Added ${addedToQueueCount} SubIDs to the queue for next run. Reloading to process.`);
                    setTimeout(() => window.location.reload(), 1000); // Reload to pick up from queue
                    return;
                }
            }
            */
            
            console.log('[handleSubscriptions] All processing paths (excluding data sync) completed for this run.'); // Modified log message

            // --- BEGIN: Send data to Google Sheet ---
            try {
                console.log('[handleSubscriptions][SendData] Attempting to collect data for Google Sheet sync...');
                await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '正在同步...'); // ADDED: Set pending status before sync attempt
                // Refresh panel IMMEDIATELY after setting pending status to show it to the user
                createUserInfoPanel(); // Call panel update here to show pending

                const tempAccount = await GM_getValue(TEMP_LOGIN_ACCOUNT_KEY, null);
                const storedUsername = await GM_getValue('otoy_username', null);
                // const username = tempAccount || storedUsername; // Prioritize tempAccount if available (often more relevant to current login)
                const username = storedUsername || tempAccount; // Prioritize stored username from account page, fallback to login account

                const email = await GM_getValue('otoy_email', null);
                const password = await GM_getValue(TEMP_PASSWORD_KEY, null);
                const paymentInfo = await GM_getValue(LATEST_PAYMENT_INFO_KEY, null);
                const expiryDate = await GM_getValue('otoy_expiry_date', null);

                let paymentDateForSheet = null;
                if (paymentInfo && paymentInfo.paymentDate) {
                    // Ensure paymentDate is in YYYY-MM-DD, then convert to ISO string for Apps Script
                    // The Apps Script expects an ISO string for the 'timestamp' field
                    const parsedPayment = utils.parseFormattedDate(paymentInfo.paymentDate); // Parses YYYY-MM-DD or YYYY年MM月DD日 to Date object
                    if (parsedPayment) {
                        // paymentDateForSheet = parsedPayment.toISOString(); 
                        const year = parsedPayment.getFullYear();
                        const month = (parsedPayment.getMonth() + 1).toString().padStart(2, '0');
                        const day = parsedPayment.getDate().toString().padStart(2, '0');
                        paymentDateForSheet = `${year}-${month}-${day}`; // Standard YYYY-MM-DD
                        console.log('[handleSubscriptions][SendData] Payment date formatted to YYYY-MM-DD:', paymentDateForSheet);
                    } else {
                        console.warn('[handleSubscriptions][SendData] Could not parse paymentInfo.paymentDate:', paymentInfo.paymentDate);
                    }
                }
                
                let expiryDateForSheet = expiryDate; // Default to original if parsing fails
                if (expiryDate) {
                    const parsedExpiry = utils.parseFormattedDate(expiryDate);
                    if (parsedExpiry) {
                        const year = parsedExpiry.getFullYear();
                        const month = (parsedExpiry.getMonth() + 1).toString().padStart(2, '0');
                        const day = parsedExpiry.getDate().toString().padStart(2, '0');
                        expiryDateForSheet = `${year}-${month}-${day}`; // Standard YYYY-MM-DD
                        console.log('[handleSubscriptions][SendData] Expiry date formatted to YYYY-MM-DD:', expiryDateForSheet);
                    } else {
                        console.warn('[handleSubscriptions][SendData] Could not parse expiryDate string from GM_getValue:', expiryDate, '. Will use original value if non-empty.');
                    }
                } else {
                    console.warn('[handleSubscriptions][SendData] expiryDate from GM_getValue is null or empty.');
                }

                // Validate required fields
                if (username && email && password && paymentDateForSheet && expiryDateForSheet) { // Ensure expiryDateForSheet is used here
                    console.log('[handleSubscriptions][SendData] All required data collected. Preparing to send.');
                    const dataToSend = {
                        username: username,
                        email: email,
                        password: password,
                        paymentDate: paymentDateForSheet, // This is now an YYYY-MM-DD string
                        expiryDate: expiryDateForSheet           // Should be YYYY-MM-DD if parsed, else original
                    };

                    // Check if data has already been sent for this password to avoid duplicates
                    // This is a simple check; a more robust one might involve a specific "synced" flag for the session.
                    const lastSyncedPassword = await GM_getValue('otoy_last_synced_password', null);
                    if (password === lastSyncedPassword) {
                        console.log('[handleSubscriptions][SendData] Data with this password appears to have been synced already. Skipping.');
                        await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步跳过 (记录已存在)'); // ADDED
                        createUserInfoPanel(); // ADDED to refresh panel with new status
                    } else {
                        const success = await utils.sendDataToGoogleSheet(dataToSend);
                        if (success) {
                            console.log('[handleSubscriptions][SendData] Data successfully sent to Google Sheet.');
                            await GM_deleteValue(TEMP_LOGIN_ACCOUNT_KEY);
                            await GM_deleteValue(TEMP_PASSWORD_KEY);
                            await GM_setValue('otoy_last_synced_password', password); // Store the password used for the last successful sync
                            console.log('[handleSubscriptions][SendData] Temporary login credentials cleared and last synced password recorded.');
                            // Optional: GM_setValue('otoy_last_sync_timestamp', new Date().toISOString());
                        } else {
                            console.error('[handleSubscriptions][SendData] Failed to send data to Google Sheet.');
                        }
                        // Refresh panel again after sync attempt (success or failure)
                        createUserInfoPanel(); // Call panel update here to show final result
                    }
                } else {
                    console.warn('[handleSubscriptions][SendData] Missing one or more required data fields for Google Sheet sync. Skipping send.');
                    console.log('[handleSubscriptions][SendData] Data status: ', {
                        username: !!username,
                        email: !!email,
                        password: !!password, // Ensure password (not !!password) is logged for its actual value if needed for debugging presence
                        paymentDateForSheet: !!paymentDateForSheet,
                        rawPaymentInfo: paymentInfo,
                        expiryDate: !!expiryDateForSheet // Ensure expiryDateForSheet is used for status log
                    });
                    // If sync is skipped due to missing data, update status
                    // Only set to "数据缺失" if it wasn't already set to "同步跳过 (记录已存在)"
                    const currentSyncStatus = await GM_getValue(SYNC_STATUS_MESSAGE_KEY);
                    if (currentSyncStatus !== '同步跳过 (记录已存在)') {
                        await GM_setValue(SYNC_STATUS_MESSAGE_KEY, '同步跳过: 数据缺失'); // ADDED
                        createUserInfoPanel(); // Refresh panel to show skipped status
                    }
                    utils.showNotification("提示：部分关键信息未能获取，数据未同步到云端表格。请检查控制台日志了解详情。");
                }
            } catch (error) {
                console.error('[handleSubscriptions][SendData] Error during Google Sheet data sending process:', error);
            }
            // --- END: Send data to Google Sheet ---
        
        }, // End of handleSubscriptions

        // --- 新增：处理账户主页 (index.php) ---
        handleAccountIndex() {
            console.log('处理账户主页 (index.php)...');
            // 选择器需要根据实际页面确认，这里使用占位符
            console.log('[handleAccountIndex] Attempting to find username element with selector: #p_username');
            const usernameElement = document.querySelector('#p_username'); // 更新选择器
            console.log('[handleAccountIndex] Attempting to find email element with selector: #p_email');
            const emailElement = document.querySelector('#p_email');       // 更新选择器

            let usernameFound = false;
            let emailFound = false;

            if (usernameElement) {
                const username = usernameElement.value.trim(); // 读取 value 属性
                console.log('[handleAccountIndex] Username element found. Raw value:', usernameElement.value, 'Trimmed value:', username);
                if (username) {
                    GM_setValue('otoy_username', username);
                    console.log('用户名已获取并存储:', username);
                    usernameFound = true;
                } else {
                    console.log('[handleAccountIndex] 找到用户名元素，但内容为空。');
                }
            } else {
                console.log('[handleAccountIndex] 未找到用户名元素 (选择器: #p_username)。'); // 更新日志中的选择器
            }

            if (emailElement) {
                const email = emailElement.value.trim(); // 读取 value 属性
                console.log('[handleAccountIndex] Email element found. Raw value:', emailElement.value, 'Trimmed value:', email);
                if (email) {
                    GM_setValue('otoy_email', email);
                    console.log('邮箱已获取并存储:', email);
                    emailFound = true;
                } else {
                    console.log('[handleAccountIndex] 找到邮箱元素，但内容为空。');
                }
            } else {
                console.log('[handleAccountIndex] 未找到邮箱元素 (选择器: #p_email)。'); // 更新日志中的选择器
            }

            if (usernameFound && emailFound) {
                console.log('用户信息获取成功，跳转到 subscriptions.php 进行下一步...');
                window.location.href = 'https://render.otoy.com/account/subscriptions.php';
            } else {
                console.warn('[handleAccountIndex] 未能完全获取用户信息，请检查页面元素选择器。暂时停留在当前页面。');
                utils.showNotification("警告：未能从账户主页获取部分用户信息。后续操作可能受影响。");
                // 可以选择在这里也创建面板以显示部分信息或错误
                setTimeout(createUserInfoPanel, 100);
            }
        },
        // --- 账户主页处理结束 ---

        // --- 新增：处理支付状态页面 (status.php) (Checklist item 3) ---
        handleStatusPage() {
            console.log('到达 status.php 页面，检查支付状态...');
            const currentUrl = window.location.href;

            if (currentUrl.includes('redirect_status=succeeded')) {
                console.log('检测到支付成功状态 (redirect_status=succeeded) 于 status.php 页面。');
                // 不在此处发送数据，确保后续导航到 subscriptions 页面由 handleSubscriptions 统一处理记录
                console.log('支付成功，将导航到银行卡管理页面。记录将在订阅页进行。');
                window.location.href = 'https://render.otoy.com/account/cards.php';
            } else if (currentUrl.includes('redirect_status=failed')) {
                console.error('检测到支付失败状态 (redirect_status=failed) 于 status.php 页面。');
                utils.showNotification('支付失败，请检查您的支付方式或联系客服。');
            } else if (currentUrl.includes('redirect_status=pending')) {
                console.warn('检测到支付待处理状态 (redirect_status=pending) 于 status.php 页面。');
                utils.showNotification('支付正在处理中，请稍后查看。');
            } else {
                console.log('在 status.php 页面未检测到明确的 redirect_status (succeeded/failed/pending)。URL:', currentUrl);
            }
        }
        // --- 支付状态页面处理结束 ---
    };

    async function main() { // Added async to main
        // displayStatusBadge(); // 移除调用

        // 在脚本启动时检查是否存在上次未成功发送的临时凭据
        const initialTempAccount = GM_getValue(TEMP_LOGIN_ACCOUNT_KEY, null);
        const initialTempPassword = GM_getValue(TEMP_PASSWORD_KEY, null);
        if (initialTempAccount || initialTempPassword) {
            console.warn('[Main] 检测到上次未成功发送的临时登录信息。如果发生记录事件，将尝试使用这些信息。它们会在下次成功发送或重新登录时被清除。账号:', initialTempAccount, '密码是否设置:', !!initialTempPassword);
            // utils.showNotification('提示：有待发送的充值记录信息。'); // 可选的用户提示
        }


        const currentURL = window.location.href;

        // 在非登录/注册页面显示面板并添加拦截器
        if (currentURL !== CONFIG.URLS.SIGN_IN && currentURL !== CONFIG.URLS.SIGN_UP) {
            // 延迟一点点创建面板，确保 body 完全加载
            // createUserInfoPanel is now async, so if main is not async, this needs careful handling
            // For now, assuming main will be made async or this call is adjusted.
            setTimeout(createUserInfoPanel, 100); 
            addLogoutInterceptor(); // 调用拦截器
        }

        if (currentURL === CONFIG.URLS.SIGN_UP) {
            pageHandlers.handleSignUp();
        } else if (currentURL === CONFIG.URLS.SIGN_IN) {
            // pageHandlers.handleSignIn(); // Old call
            await pageHandlers.handleSignIn(); // 7. Modified to await
        } else if (currentURL === CONFIG.URLS.HOME) {
            console.log('当前页面是 Otoy Home，跳转到账户主页 (index.php)...');
            window.location.href = 'https://render.otoy.com/account/index.php'; // 新跳转目标
        } else if (currentURL === 'https://render.otoy.com/account/index.php' || currentURL === 'https://render.otoy.com/account/index.php?') { // 更新条件以包含问号
            await pageHandlers.handleAccountIndex(); // handleAccountIndex might do GM_setValue, make it awaitable if it becomes async
        } else if (currentURL === CONFIG.URLS.SUBSCRIPTIONS || currentURL === 'https://render.otoy.com/account/subscriptions.php?') { // Ensure this matches CONFIG.URLS.SUBSCRIPTIONS
            await pageHandlers.handleSubscriptions(); // handleSubscriptions is async
        } else if (currentURL === 'https://render.otoy.com/config/shared/register.php') {
            pageHandlers.handleRegisterConfig();
        } else if (currentURL.includes('config/shared/login')) {
            pageHandlers.handleLoginConfig();
        } else if (currentURL === 'https://render.otoy.com/config/shared/policy_update.php') {
            pageHandlers.handlePolicyUpdate();
        } else if (currentURL.includes('mac-pro')) {
            pageHandlers.handleMacPro();
        } else if (currentURL.includes('shop/macpro')) {
            pageHandlers.handleMacProShop();
        // REMOVED: else if (currentURL.startsWith(CONFIG.URLS.PURCHASES)) { // This URL is no longer in CONFIG
        //     pageHandlers.handlePurchases(); 
        // }
        } else if (currentURL.includes('account/subscriptionDetails.php')) {
            await pageHandlers.handleSubscriptionDetails(); // handleSubscriptionDetails is async
        } else if (currentURL.includes('account/cards.php')) {
            await pageHandlers.handleCards(); // handleCards can be async due to GM calls
        } else if (currentURL.includes('shop/purchase.php')) {
            pageHandlers.handlePurchase();
        } else if (currentURL.startsWith('https://render.otoy.com/shop/status.php')) { // Checklist item 2
            pageHandlers.handleStatusPage();
        }
        // Call createUserInfoPanel again at the end of main IF NOT on sign_in/sign_up
        // This ensures it reflects any state changes made by handlers if main is async and handlers are awaited
        // However, createUserInfoPanel is already called in a setTimeout for non-auth pages.
        // If handlers are quick and don't involve page reloads before panel creation, the initial call might be enough.
        // For robustness, if main is async and handlers that modify GM state are awaited, calling it again (or ensuring initial call is late enough)
        // might be beneficial. Given the setTimeout, it might already be late enough.
        // Let's rely on the existing setTimeout for now.
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();