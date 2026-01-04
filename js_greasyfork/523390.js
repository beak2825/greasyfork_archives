// ==UserScript==
// @name         斗鱼单窗口多房间钓鱼脚本
// @namespace    https://github.com/your_username
// @version      1.3
// @description  斗鱼多房间自动钓鱼脚本，支持数据记录,支持在大赛时间段自动钓鱼,参考小淳大佬的部分代码
// @match        https://www.douyu.com/pages/fish-act/mine
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523390/%E6%96%97%E9%B1%BC%E5%8D%95%E7%AA%97%E5%8F%A3%E5%A4%9A%E6%88%BF%E9%97%B4%E9%92%93%E9%B1%BC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/523390/%E6%96%97%E9%B1%BC%E5%8D%95%E7%AA%97%E5%8F%A3%E5%A4%9A%E6%88%BF%E9%97%B4%E9%92%93%E9%B1%BC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 配置项
const CONFIG = {
    CHECK_INTERVAL: 1000,//检查间隔
    RETRY_DELAY: 1500,//重试间隔
    MIN_OPERATION_INTERVAL:500,//队列间隔
    STORAGE_KEYS: {
        AUTO_FISH: 'ExSave_AutoFish',
        EVENTAUTO_FISH: 'ExSave_EventAutoFish',
        FISH_RECORDS: 'ExSave_FishRecords',
        ERROR_LOGS: 'ExSave_ErrorLogs'
    },
    MAX_RECORDS: 1000, // 每个房间最多保存的记录数
    MAX_ERRORS: 100,   // 每个房间最多保存的错误数
    API_ENDPOINTS: {
        FISH_INFO: 'https://www.douyu.com/japi/revenuenc/web/actfans/achieve/accList',
        HOMEPAGE: 'https://www.douyu.com/japi/revenuenc/web/actfans/fishing/homePage',
        START_FISH: 'https://www.douyu.com/japi/revenuenc/web/actfans/fishing/fishing',
        END_FISH: 'https://www.douyu.com/japi/revenuenc/web/actfans/fishing/reelIn'
    }
};

// 房间配置
const rids = [ 1031342, 1767547]; //这里设置所有需要钓鱼的房间号
const roomStates = {};
// 初始化房间状态
rids.forEach(rid => {
    roomStates[rid] = {
        baitId: null,
        nextFishEndTime: 0,
        isFishing: false,
        timer: null,
        lock:false
    };
});


// 工具函数
let lastUpdateTime = null;
const utils = {
    sleep: (time) => new Promise((resolve) => setTimeout(resolve, time)),

    setCookie: (name, value) => {
        const exp = new Date();
        exp.setTime(exp.getTime() + 3 * 60 * 60 * 1000);
        document.cookie = `${name}=${escape(value)}; path=/; expires=${exp.toGMTString()}`;
    },

    getCookie: (name) => {
        const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
        const arr = document.cookie.match(reg);
        return arr ? unescape(arr[2]) : null;
    },

    getCCN: () => {
        let ccn = utils.getCookie("acf_ccn");
        //console.log(`获取acf_ccn 数值为: ${ccn}`);
        if (!ccn) {
            utils.setCookie("acf_ccn", "1");
            ccn = "1";
            //console.log(`设置acf_ccn 数值为: ${ccn}`);
        }
        return ccn;
    },
    isActivityTime:() => {
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        // 判断是否在活动时间范围内（中午 12:00 到凌晨 00:30 每个准点开启半小时）
        return (hour >= 12 && hour < 24 && minute < 30) || (hour === 0 && minute < 30);
    },
    updateTime:() =>{
        // const timePanel = document.getElementById('time-panel');
        // const now = new Date();
        // timePanel.innerText = "最后检查时间: " + now.toLocaleString();
        const timePanel = document.getElementById('time-panel');
        const now = new Date();
        const currentTime = now.getTime();

        // 如果上次更新时间存在
        if (lastUpdateTime!== null) {
            // 计算时间差（毫秒）
            const timeDiff = currentTime - lastUpdateTime;

            // 如果时间差大于1秒
            if (timeDiff > 1500) {
                // 保存当前时间
                const errorLogDiv = document.getElementById('error-log');
                errorLogDiv.innerText += `Error: 时间间隔大于1秒${timeDiff}，上次更新时间：${new Date(lastUpdateTime).toLocaleString()}\n`;

                // // 延迟1秒后更新时间（可根据需要调整延迟时间）
                // setTimeout(() => {
                    timePanel.innerText = "最后检查时间: " + now.toLocaleString();
                    lastUpdateTime = now.getTime();
                // }, 1000);
            } else {
                // 正常更新时间
                timePanel.innerText = "最后检查时间: " + now.toLocaleString();
                lastUpdateTime = now.getTime();
            }
        } else {
            // 首次更新时间
            timePanel.innerText = "最后检查时间: " + now.toLocaleString();
            lastUpdateTime = now.getTime();
        }
    }
};
// 1. 首先添加一个请求队列管理器类
class RequestQueueManager {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    // 添加请求到队列
    async addRequest(requestFn, priority = 0) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                requestFn,
                priority,
                resolve,
                reject,
                timestamp: Date.now()
            });

            // 按优先级和时间戳排序
            this.queue.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                }
                return a.timestamp - b.timestamp;
            });

            this.processQueue();
        });
    }

    // 处理队列
    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;

        try {
            const request = this.queue.shift();
            const result = await request.requestFn();
            request.resolve(result);
        } catch (error) {
            const request = this.queue[0];
            request.reject(error);
        } finally {
            this.isProcessing = false;
            // 添加延迟以控制请求频率
            await utils.sleep(CONFIG.MIN_OPERATION_INTERVAL);
            // 继续处理队列中的下一个请求
            if (this.queue.length > 0) {
                this.processQueue();
            }
        }
    }

    // 清空队列
    clearQueue() {
        this.queue = [];
    }

    // 获取队列长度
    get length() {
        return this.queue.length;
    }
}

class ApiManager {
    constructor(queueManager) {
        this.queueManager = queueManager;
    }

    async request(url, options = {}, priority = 0) {
        return this.queueManager.addRequest(async () => {
            try {
                const defaultOptions = {
                    mode: "no-cors",
                    cache: "default",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                };

                const response = await fetch(url, {
                    ...defaultOptions,
                    ...options,
                    headers: {
                        ...defaultOptions.headers,
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error(`API请求失败: ${url}`, error);
                return { error: -1, msg: `请求失败: ${error.message}` };
            }
        }, priority);
    }

    async getFishInfo(rid) {
        return this.request(
            `${CONFIG.API_ENDPOINTS.FISH_INFO}?rid=${rid}&type=1&period=1`,
            {},
            1
        ).then(response => response.data?.accList || []);
    }

    async getHomepageData(rid) {
        return this.request(
            `${CONFIG.API_ENDPOINTS.HOMEPAGE}?rid=${rid}&opt=1`,
            {},
            1
        );
    }

    async startFish(rid, baitId) {
        return this.request(
            CONFIG.API_ENDPOINTS.START_FISH,
            {
                method: "POST",
                body: `ctn=${utils.getCCN()}&rid=${rid}&baitId=${baitId}`
            },
            2
        );
    }

    async endFish(rid) {
        return this.request(
            CONFIG.API_ENDPOINTS.END_FISH,
            {
                method: "POST",
                body: `ctn=${utils.getCCN()}&rid=${rid}`
            },
            2
        );
    }
}
// 数据存储管理
class StorageManager {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.FISH_RECORDS)) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.FISH_RECORDS, JSON.stringify({}));
        }
        if (!localStorage.getItem(CONFIG.STORAGE_KEYS.ERROR_LOGS)) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.ERROR_LOGS, JSON.stringify({}));
        }
    }

    saveFishRecord(rid, record) {
        const records = this.getFishRecords();
        if (!records[rid]) records[rid] = [];

        records[rid].unshift({
            ...record,
            timestamp: new Date().toISOString()
        });

        // 限制记录数量
        if (records[rid].length > CONFIG.MAX_RECORDS) {
            records[rid] = records[rid].slice(0, CONFIG.MAX_RECORDS);
        }

        localStorage.setItem(CONFIG.STORAGE_KEYS.FISH_RECORDS, JSON.stringify(records));
    }

    saveErrorLog(rid, error) {
        const errors = this.getErrorLogs();
        if (!errors[rid]) errors[rid] = [];

        errors[rid].unshift({
            error,
            timestamp: new Date().toISOString()
        });

        // 限制错误日志数量
        if (errors[rid].length > CONFIG.MAX_ERRORS) {
            errors[rid] = errors[rid].slice(0, CONFIG.MAX_ERRORS);
        }

        localStorage.setItem(CONFIG.STORAGE_KEYS.ERROR_LOGS, JSON.stringify(errors));
    }

    getFishRecords() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.FISH_RECORDS) || '{}');
    }

    getErrorLogs() {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ERROR_LOGS) || '{}');
    }

    clearRecords(rid) {
        const records = this.getFishRecords();
        if (rid) {
            delete records[rid];
        } else {
            Object.keys(records).forEach(key => delete records[key]);
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.FISH_RECORDS, JSON.stringify(records));
    }

    clearErrors(rid) {
        const errors = this.getErrorLogs();
        if (rid) {
            delete errors[rid];
        } else {
            Object.keys(errors).forEach(key => delete errors[key]);
        }
        localStorage.setItem(CONFIG.STORAGE_KEYS.ERROR_LOGS, JSON.stringify(errors));
    }
}


class FishingManager {
    constructor(storageManager, apiManager) {
        this.fishInfo = [];
        this.storageManager = storageManager;
        this.apiManager = apiManager;
    }
    async init() {
        try {
            // 获取鱼类信息
            this.fishInfo = await this.apiManager.getFishInfo(rids[0]);
            // 检查初始状态
            return this.checkInitialState();
        } catch (error) {
            console.error('初始化失败:', error);
            this.storageManager.saveErrorLog('system', '初始化失败: ' + error.message);
            return false;
        }
    }

    async checkInitialState() {
        try {
            for (const rid of rids) {
                const homepageRes = await this.apiManager.getHomepageData(rid);
                if (!homepageRes.data) {
                    console.error(`【房间 ${rid}】未能获取活动信息`);
                    this.storageManager.saveErrorLog(rid, '未能获取活动信息');
                    return false;
                }

                // 检查鱼饵
                const baitData = homepageRes.data.baits.find(item => item.inUse);
                if (!baitData) {
                    console.error(`【房间 ${rid}】请设置鱼饵`);
                    this.storageManager.saveErrorLog(rid, '请设置鱼饵');
                    return false;
                }
                roomStates[rid].baitId = baitData.id;

                // 检查形象
                if (!homepageRes.data.myCh) {
                    console.error(`【房间 ${rid}】请设置形象`);
                    this.storageManager.saveErrorLog(rid, '请设置形象');
                    return false;
                }

                // 检查钓鱼状态
                await this.handleFishingState(rid, homepageRes.data.fishing);
            }
            return true;
        } catch (error) {
            console.error('检查初始状态失败:', error);
            this.storageManager.saveErrorLog('system', '检查初始状态失败: ' + error.message);
            return false;
        }
    }

    async handleFishingState(rid, fishingData) {
        const state = roomStates[rid];
        switch(fishingData.stat) {
            case 0: // 未开始
                state.isFishing = false;
                state.nextFishEndTime = 0;
                break;
            case 1: // 进行中
                state.isFishing = true;
                state.nextFishEndTime = fishingData.fishEtMs;
                break;
            case 2: // 未收杆
                await this.endFishing(rid);
                await utils.sleep(CONFIG.RETRY_DELAY);
                break;
        }
    }

    async startFishing(rid) {
        const eventAutoFish = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.EVENTAUTO_FISH))?.isAutoFish;
        if (eventAutoFish) {
            if (!utils.isActivityTime()) {
                //console.log("不在活动时间内，不执行钓鱼操作");
                return false;
            }
        }
        try {
            const state = roomStates[rid];
            state.lock = true;
            const fishRes = await this.apiManager.startFish(rid, state.baitId);
            state.lock = false;
            if (fishRes.error !== 0) {
                const errorMsg = `【startFishing 函数:房间 ${rid}】${fishRes.msg}`;
                console.error(errorMsg);
                this.storageManager.saveErrorLog(rid, errorMsg);
                //1001007 操作失败刷新重试
                // if (fishRes.error === 1001007) await this.endFishing(rid);
                // if (fishRes.error === 1001007) {
                //     setTimeout(async () => {
                //         await this.endFishing(rid);
                //     }, 1000);//1秒后重试
                // }; 不需要重试 定时器会自动重试
                if (fishRes.error === 1005003) this.stopFishing(rid);
                return false;
            }

            state.isFishing = true;
            state.nextFishEndTime = fishRes.data.fishing.fishEtMs;
            return true;
        } catch (error) {
            console.error(`【startFishing 函数:房间 ${rid}】开始钓鱼失败:`, error);
            this.storageManager.saveErrorLog(rid, '开始钓鱼失败: ' + error.message);
            return false;
        }
    }

    async endFishing(rid) {
        try {
            const state = roomStates[rid];
            state.lock = true;
            const fishRes = await this.apiManager.endFish(rid);
            state.lock = false;
            if (fishRes.error !== 0) {
                const errorMsg = `endFishing 函数1:房间 ${rid} 收杆失败: ${fishRes.msg || JSON.stringify(fishRes)}`;
                console.error(errorMsg);
                this.storageManager.saveErrorLog(rid, errorMsg);

                const homepageRes = await this.apiManager.getHomepageData(rid);
                if (homepageRes.data?.fishing.stat === 0) {
                    state.isFishing = false;
                    state.nextFishEndTime = 0;
                }
                return;
            }

            this.logFishingResult(rid, fishRes);
            state.isFishing = false;
        } catch (error) {
            console.error(`【endFishing 函数2:房间 ${rid}】收杆失败:`, error);
            this.storageManager.saveErrorLog(rid, '收杆失败: ' + error.message);
        }
    }

    logFishingResult(rid, fishRes) {
        try {
            const record = {
                fishId: fishRes.data.fish.id,
                weight: fishRes.data.fish.wei,
                awards: fishRes.data.awards || []
            };

            const fishData = this.fishInfo.find(item => item.fishId === record.fishId);
            if (fishData) {
                record.fishName = fishData.name;
            }

            // 保存记录到存储
            this.storageManager.saveFishRecord(rid, record);

            // 控制台输出
            const messages = [`【房间 ${rid} 钓鱼】`];
            if (fishData) {
                messages.push(`获得${fishData.name}${record.weight}斤`);
            }
            if (record.awards.length > 0) {
                const awards = record.awards.map(
                    award => `获得${award.awardName}x${award.awardNumShow}`
                );
                messages.push(...awards);
            }
            if (messages.length > 1) {
                console.log(messages.join(fishData ? "，" : ""));
            }
        } catch (error) {
            console.error(`【房间 ${rid}】记录结果失败:`, error);
            this.storageManager.saveErrorLog(rid, '记录结果失败: ' + error.message);
        }
    }

    startAutoFishing(rid) {
        const state = roomStates[rid];
        state.timer = setInterval(async () => {
            utils.updateTime();
            try {
                if(!state.lock)
                {
                    if (state.isFishing) {
                        const now = new Date().getTime();
                        if (now <= state.nextFishEndTime) return;
                        // console.log(`${rid} 476开始收杆`);
                        await this.endFishing(rid);
                    } else {
                        // console.log(`${rid} 479开始抛竿`);
                        await this.startFishing(rid);
                    }
                }
            } catch (error) {
                console.error(`【startautoFishing 函数:房间 ${rid}】自动钓鱼异常:`, error);
                this.storageManager.saveErrorLog(rid, '自动钓鱼异常: ' + error.message);
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    stopFishing(rid) {
        if (roomStates[rid].timer) {
            clearInterval(roomStates[rid].timer);
            roomStates[rid].timer = null;
        }
    }

    stopAllFishing() {
        rids.forEach(rid => this.stopFishing(rid));
    }
}

// UI管理器增强
class UIManager {
    constructor(fishingManager, storageManager) {
        this.fishingManager = fishingManager;
        this.storageManager = storageManager;
        this.createUI();
        this.loadSavedState();
    }

    createUI() {
        // 创建控制面板容器
        const controlPanel = document.createElement('div');
        Object.assign(controlPanel.style, {
            position: 'fixed',
            top: '50px',
            right: '20px',
            zIndex: '9999',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px'
        });

        controlPanel.innerHTML = `
            <label>
                <input id="extool__autofish_start" type="checkbox" style="margin-top:5px;">
                无限自动钓鱼
            </label>
            <label>
                <input id="extool__eventautofish_start" type="checkbox" style="margin-top:10px;">
                大赛时间段自动钓鱼
            </label>
            <button id="extool__show_records" style="margin-left: 10px;">显示记录</button>
            <div id="time-panel"></div>
            <div id="error-log"></div>
        `;

        document.body.appendChild(controlPanel);

        // 创建记录查看窗口
        const recordsWindow = document.createElement('div');
        Object.assign(recordsWindow.style, {
            display: 'none',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '10000',
            backgroundColor: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            maxHeight: '80vh',
            width: '80vw',
            overflowY: 'auto'
        });

        recordsWindow.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <select id="extool__room_select" style="padding: 5px;">
                    <option value="">选择房间</option>
                    ${rids.map(rid => `<option value="${rid}">${rid}</option>`).join('')}
                </select>
                <div>
                    <button id="extool__clear_records">清除记录</button>
                    <button id="extool__close_records" style="margin-left: 10px;">关闭</button>
                </div>
            </div>
            <div id="extool__records_content"></div>
        `;

        document.body.appendChild(recordsWindow);

        this.bindEvents(recordsWindow);
    }

    bindEvents(recordsWindow) {
        // 绑定自动钓鱼开关事件
        const checkbox = document.getElementById("extool__autofish_start");
        const eventcheckbox = document.getElementById("extool__eventautofish_start");

        checkbox.addEventListener("click", async () => {
            const isStart = checkbox.checked;
            this.saveState(isStart);

            if (!isStart) {
                this.fishingManager.stopAllFishing();
                return;
            }else{ //如果checked 取消另一个checkbox勾选
                this.saveEventState(!isStart);
                eventcheckbox.checked = false;
            }

            console.log("【自动钓鱼】开始自动钓鱼");
            const initialized = await this.fishingManager.init();
            if (!initialized) {
                checkbox.checked = false;
                return;
            }
            //对每个房间开启计时器检查
            rids.forEach(rid => this.fishingManager.startAutoFishing(rid));
        });
        // 绑定自动钓鱼开关事件
        eventcheckbox.addEventListener("click", async () => {
            const isStart = eventcheckbox.checked;
            this.saveEventState(isStart);

            if (!isStart) {
                this.fishingManager.stopAllFishing();
                return;
            }else{ //如果checked 取消另一个checkbox勾选
                this.saveState(!isStart);
                checkbox.checked = false;
            }

            console.log("【大赛时间段自动钓鱼】开始自动钓鱼");
            const initialized = await this.fishingManager.init();
            if (!initialized) {
                eventcheckbox.checked = false;
                return;
            }

            rids.forEach(rid => this.fishingManager.startAutoFishing(rid));
        });

        // 绑定显示记录按钮事件
        document.getElementById("extool__show_records").addEventListener("click", () => {
            recordsWindow.style.display = 'block';
            this.updateRecordsDisplay();
        });

        // 绑定关闭按钮事件
        document.getElementById("extool__close_records").addEventListener("click", () => {
            recordsWindow.style.display = 'none';
        });

        // 绑定房间选择事件
        document.getElementById("extool__room_select").addEventListener("change", () => {
            this.updateRecordsDisplay();
        });

        // 绑定清除记录按钮事件
        document.getElementById("extool__clear_records").addEventListener("click", () => {
            const rid = document.getElementById("extool__room_select").value;
            this.storageManager.clearRecords(rid);
            this.storageManager.clearErrors(rid);
            this.updateRecordsDisplay();
        });
    }

    updateRecordsDisplay() {
        const rid = document.getElementById("extool__room_select").value;
        const records = this.storageManager.getFishRecords();
        const errors = this.storageManager.getErrorLogs();
        const content = document.getElementById("extool__records_content");

        let html = '';

        if (rid) {
            // 显示特定房间的记录
            html += '<h3>钓鱼记录</h3>';
            if (records[rid] && records[rid].length > 0) {
                html += this.generateRecordsTable(records[rid]);
            } else {
                html += '<p>暂无钓鱼记录</p>';
            }

            html += '<h3>错误日志</h3>';
            if (errors[rid] && errors[rid].length > 0) {
                html += this.generateErrorsTable(errors[rid]);
            } else {
                html += '<p>暂无错误记录</p>';
            }
        } else {
            // 显示所有房间的统计信息
            html += '<h3>房间统计</h3>';
            html += this.generateStatsTable(records, errors);
        }

        content.innerHTML = html;
    }

    generateRecordsTable(records) {
        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">时间</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">鱼类</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">重量</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">奖励</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(record => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(record.timestamp).toLocaleString()}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${record.fishName || '未知'}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${record.weight}斤</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">
                                ${record.awards.map(award =>
                                                    `${award.awardName}x${award.awardNum}`
                                                   ).join(', ') || '无'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateErrorsTable(errors) {
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">时间</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">错误信息</th>
                    </tr>
                </thead>
                <tbody>
                    ${errors.map(error => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${new Date(error.timestamp).toLocaleString()}</td><td style="border: 1px solid #ddd; padding: 8px;">${error.error}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    generateStatsTable(records, errors) {
        return `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">房间号</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">钓鱼次数</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">总重量</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">错误次数</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">最后活动</th>
                    </tr>
                </thead>
                <tbody>
                    ${rids.map(rid => {
            const roomRecords = records[rid] || [];
            const roomErrors = errors[rid] || [];
            const totalWeight = roomRecords.reduce((sum, record) => sum + parseFloat(record.weight), 0);
            const lastActivity = [...roomRecords, ...roomErrors]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]?.timestamp;

            return `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${rid}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${roomRecords.length}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${totalWeight.toFixed(1)}斤</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${roomErrors.length}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    ${lastActivity ? new Date(lastActivity).toLocaleString() : '无记录'}
                                </td>
                            </tr>
                        `;
        }).join('')}
                </tbody>
            </table>
        `;
    }

    saveState(isAutoFish) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_FISH, JSON.stringify({ isAutoFish }));
    }
    saveEventState(isAutoFish) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.EVENTAUTO_FISH, JSON.stringify({ isAutoFish }));
    }
    loadSavedState() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.AUTO_FISH);
        if (saved) {
            const { isAutoFish } = JSON.parse(saved);
            if (isAutoFish) {
                document.getElementById("extool__autofish_start").click();
            }
        }
        const eventSaved = localStorage.getItem(CONFIG.STORAGE_KEYS.EVENTAUTO_FISH);
        if (eventSaved) {
            const { isAutoFish } = JSON.parse(eventSaved);
            if (isAutoFish) {
                document.getElementById("extool__eventautofish_start").click();
            }
        }
    }
}

// 初始化
(() => {
    const queueManager = new RequestQueueManager();
    const apiManager = new ApiManager(queueManager);
    const storageManager = new StorageManager();
    const fishingManager = new FishingManager(storageManager, apiManager);
    new UIManager(fishingManager, storageManager);
})();