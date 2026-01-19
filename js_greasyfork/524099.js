// ==UserScript==
// @name         翱翔教务功能加强
// @namespace    http://tampermonkey.net/
// @version      1.7.0
// @description  1.提供GPA分析报告；2. 导出课程成绩与教学班排名；3.更好的“学生画像”显示；4.选课助手；5.课程关注与后台同步；6.一键自动评教；7.人员信息检索
// @author       47
// @match        https://jwxt.nwpu.edu.cn/*
// @match        https://jwxt.nwpu.edu.cn/student/for-std/course-select/some-page*
// @match        https://ecampus.nwpu.edu.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @connect      electronic-signature.nwpu.edu.cn
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nwpu.edu.cn
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @homepage     https://greasyfork.org/zh-CN/scripts/524099-%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA
// @downloadURL https://update.greasyfork.org/scripts/524099/%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524099/%E7%BF%B1%E7%BF%94%E6%95%99%E5%8A%A1%E5%8A%9F%E8%83%BD%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

// ==================== 用户可配置区域 ====================
/**
 * @description 中文等级制成绩到百分制分数的映射。
 * @description 您可以根据需要修改这里的数值，例如将 '优秀' 改为 95。
 */
const GRADE_MAPPING_CONFIG = {
    '优秀': 93,
    '良好': 80,
    '中等': 70,
    '及格': 60,
    '不及格': 0
};

// ============================================================
(function () {
    'use strict';

// =============== 0.0 拦截浏览器的异常请求，优化网页加载速度 ===============
    try {
        const BAD_KEY = 'burp';

        // 1. 劫持 HTMLImageElement 原型链上的 src 属性
        const imageProto = HTMLImageElement.prototype;
        const originalSrcDescriptor = Object.getOwnPropertyDescriptor(imageProto, 'src');

        if (originalSrcDescriptor) {
            Object.defineProperty(imageProto, 'src', {
                get: function() {
                    return originalSrcDescriptor.get.call(this);
                },
                set: function(value) {
                    if (value && typeof value === 'string' && value.indexOf(BAD_KEY) !== -1) {
                        //console.log('[NWPU-Enhanced] 成功拦截底层图片请求:', value);
                        return;
                    }
                    originalSrcDescriptor.set.call(this, value);
                },
                configurable: true,
                enumerable: true
            });
        }

        // 2. 劫持 setAttribute 方法
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (this instanceof HTMLImageElement && name === 'src' && value && value.indexOf(BAD_KEY) !== -1) {
                //console.log('[NWPU-Enhanced] 成功拦截 setAttribute:', value);
                return;
            }
            return originalSetAttribute.apply(this, arguments);
        };

    } catch (e) {
        console.error('[NWPU-Enhanced] 拦截器初始化异常', e);
    }


// =-=-=-=-=-=-=-=-=-=-=-=-= 0. 基础工具与日志系统 =-=-=-=-=-=-=-=-=-=-=-=-=

// --- 全局常量定义 ---
const CONSTANTS = {
    CACHE_KEY: 'jwxtEnhancedDataCache',
    FOLLOWED_COURSES_KEY: 'jwxt_followed_courses_list',
    BACKGROUND_SYNC_KEY: 'jwxt_background_sync_data',
    LAST_SYNC_TIME_KEY: 'jwxt_last_bg_sync_time',
    HISTORY_STORAGE_KEY: 'course_enrollment_history_auto_sync',
    SYNC_COOLDOWN_MS: 1 * 60 * 60 * 1000, // 1小时冷却
    GRADES_SNAPSHOT_KEY: 'jwxt_grades_snapshot_v1'//成绩快照存储Key
};

/**
 * 统一日志输出工具
 * @description 所有控制台输出统一带有 [NWPU-Enhanced] 前缀
 */
const Logger = {
    _print: (module, msg, type = 'log', args = []) => {
        const prefix = `%c[NWPU-Enhanced][${module}]`;
        const css = 'color: #007bff; font-weight: bold;';
        if (args.length > 0) {
            console[type](prefix, css, msg, ...args);
        } else {
            console[type](prefix, css, msg);
        }
    },
    log: (module, msg, ...args) => Logger._print(module, msg, 'log', args),
    warn: (module, msg, ...args) => Logger._print(module, msg, 'warn', args),
    error: (module, msg, ...args) => Logger._print(module, msg, 'error', args),
    info: (module, msg, ...args) => Logger._print(module, msg, 'info', args)
};

// 悬浮球 UI 变量
let floatBall = null;
let floatMenu = null;
let menuExportBtn = null;
let menuGpaBtn = null;
let menuSyncBtn = null;
let menuFollowBtn = null;
let menuHupanBtn = null;

// 功能UI变量
let semesterCheckboxContainer = null;
let isDataReady = false;

// --- 配置管理 ---
const ConfigManager = {
    get enableExport() { return true; }, // 基础功能始终开启
    get enableGpaReport() { return true; }, // 基础功能始终开启

    get enablePortraitEnhancement() { return GM_getValue('enablePortraitEnhancement', true); },
    set enablePortraitEnhancement(val) { GM_setValue('enablePortraitEnhancement', val); },

    get enableCourseWatch() { return GM_getValue('enableCourseWatch', true); },
    set enableCourseWatch(val) { GM_setValue('enableCourseWatch', val); }
};

// --- 关注课程数据管理 ---
const FollowManager = {
    getList() {
        try {
            return JSON.parse(GM_getValue(CONSTANTS.FOLLOWED_COURSES_KEY, '{}'));
        } catch (e) {
            console.error('[NWPU-Enhanced] 关注列表数据损坏，将返回空列表', e);
            return {};
        }
    },
    add(courseId, courseData) {
        const list = this.getList();
        list[courseId] = courseData;
        GM_setValue(CONSTANTS.FOLLOWED_COURSES_KEY, JSON.stringify(list));
        Logger.log('Follow', `关注课程成功: ${courseData.name}`);
    },
    remove(courseId) {
        const list = this.getList();
        delete list[courseId];
        GM_setValue(CONSTANTS.FOLLOWED_COURSES_KEY, JSON.stringify(list));
        Logger.log('Follow', `取消关注成功: ID ${courseId}`);
    },
    has(courseId) { return !!this.getList()[courseId]; }
};

// --- 基础数据获取与缓存 ---

/**
 * 获取SessionStorage缓存的数据
 */
function getCachedData() {
    const cachedData = sessionStorage.getItem(CONSTANTS.CACHE_KEY);
    if (cachedData) {
        try { return JSON.parse(cachedData); }
        catch (error) { sessionStorage.removeItem(CONSTANTS.CACHE_KEY); return null; }
    }
    return null;
}

/**
 * 写入数据到SessionStorage
 */
function setCachedData(data) {
    try { sessionStorage.setItem(CONSTANTS.CACHE_KEY, JSON.stringify(data)); }
    catch (error) { Logger.error('Core', "缓存写入失败", error); }
}

/**
 * 获取学号
 * 如果本地不存在，则通过隐藏 iframe 唤醒选课页面获取
 */
async function getStudentId() {
    let localId = localStorage.getItem('cs-course-select-student-id');
    if (localId) {
        return localId;
    }

    // 如果不存在，则启动后台补丁获取
    Logger.warn('Core', "未检测到 StudentID，正在重新请求数据...");
    localId = await forceFetchStudentId();

    if (localId) {
        Logger.log('Core', "执行成功，已获取 StudentID:", localId);
        return localId;
    } else {
        Logger.error('Core', "执行超时，无法获取 StudentID");
        return null;
    }
}

/**
 * 利用隐藏 iframe 模拟访问选课页面以触发系统 ID 写入
 */
function forceFetchStudentId() {
    return new Promise((resolve) => {
        const IFRAME_ID = 'gm-id-fetcher-patch';
        // 防止重复创建
        if (document.getElementById(IFRAME_ID)) return;

        const iframe = document.createElement('iframe');
        iframe.id = IFRAME_ID;
        // 目标：学生选课主页面（该页面加载时官方 JS 会写入 ID）
        iframe.src = 'https://jwxt.nwpu.edu.cn/student/for-std/course-select';
        // 彻底隐藏
        iframe.style.cssText = 'position:fixed; top:-10000px; left:-10000px; width:1px; height:1px; visibility:hidden; opacity:0;';

        document.body.appendChild(iframe);

        // 每 200ms 检查一次 localStorage 是否被写入
        let checkCount = 0;
        const maxChecks = 50; // 最多等待 10 秒

        const timer = setInterval(() => {
            const sid = localStorage.getItem('cs-course-select-student-id');
            checkCount++;

            if (sid) {
                clearInterval(timer);
                if (document.getElementById(IFRAME_ID)) iframe.remove();
                resolve(sid);
            } else if (checkCount >= maxChecks) {
                clearInterval(timer);
                if (document.getElementById(IFRAME_ID)) iframe.remove();
                resolve(null);
            }
        }, 200);
    });
}

/**
 * 从后端抓取所有成绩数据并缓存
 */
async function fetchAllDataAndCache(retryCount = 0) {
    Logger.log("Initial", "开始获取并缓存所有教务数据");
    try {
        const studentId = await getStudentId();
        const [gpaRes, semRes, rankRes] = await Promise.all([
            new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `https://jwxt.nwpu.edu.cn/student/for-std/student-portrait/getMyGpa?studentAssoc=${studentId}`, onload: r, onerror: () => r({status:500}) })),
            new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `https://jwxt.nwpu.edu.cn/student/for-std/student-portrait/getMyGrades?studentAssoc=${studentId}&semesterAssoc=`, onload: r, onerror: () => r({status:500}) })),
            new Promise(r => GM_xmlhttpRequest({ method: "GET", url: `https://jwxt.nwpu.edu.cn/student/for-std/student-portrait/getMyGradesByProgram?studentAssoc=${studentId}`, onload: r, onerror: () => r({status:500}) }))
        ]);

         // --- 判断 ID 是否失效 ---
        // 1. 检查 HTTP 状态码是否异常（通常 401, 403, 500 代表 ID 不匹配或过期）
        // 2. 检查返回内容是否包含登录 HTML（说明 Session 失效重定向了）
        const isInvalid = (res) => {
            return res.status !== 200 ||
                   (typeof res.responseText === 'string' && res.responseText.includes('<!DOCTYPE html>'));
        };

        if (isInvalid(gpaRes) || isInvalid(semRes)) {
            if (retryCount < 1) { // 仅允许重试一次，防止死循环
                Logger.warn("Core", "检测到请求无效，准备重试...");
                localStorage.removeItem('cs-course-select-student-id');
                return await fetchAllDataAndCache(retryCount + 1);
            } else {
                throw new Error("多次请求均无效，请检查登录状态。");
            }
        }

        const gpaData = JSON.parse(gpaRes.responseText);
        const gpaRankData = gpaData.stdGpaRankDto || { rank: null, gpa: null };

        const semesterData = JSON.parse(semRes.responseText);
        const semesters = Array.isArray(semesterData.semesters) ? semesterData.semesters.sort((a, b) => b.id - a.id) : [];
        const semesterIds = semesters.map(s => s.id);
        const semesterNames = semesters.map(s => s.nameZh);

        const classRankData = {};

        if (rankRes.status === 200) {
            try {
                const data = JSON.parse(rankRes.responseText);
                // 将 data?.courseItemMap 改为 data && data.courseItemMap
                if (data && data.courseItemMap) {
                    for (const cid in data.courseItemMap) {
                        if (Object.prototype.hasOwnProperty.call(data.courseItemMap, cid)) {
                            const c = data.courseItemMap[cid];
                            // 确保数据存在再进行赋值
                            if (c && c.stdLessonRank != null) {
                                classRankData[cid] = c.stdLessonRank + "/" + c.stdCount;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("[NWPU-Enhanced] 解析排名数据失败", e);
            }
        }

        let allGrades = [];
        if (semesterIds.length > 0) {
            const gradePromises = semesterIds.map(semesterId =>
                new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://jwxt.nwpu.edu.cn/student/for-std/grade/sheet/info/${studentId}?semester=${semesterId}`,
                        onload: response => {if (response.status === 200) {const data = JSON.parse(response.responseText);resolve(data.semesterId2studentGrades[semesterId] || []);} else resolve([]);},
                        onerror: () => resolve([])
                    });
                })
            );

            const allGradesArrays = await Promise.all(gradePromises);
            allGradesArrays.forEach((grades, index) => {
                const semesterName = semesterNames[index];
                grades.forEach(grade => {
                    allGrades.push({
                        '课程ID': grade.course.id,
                        '课程代码': grade.course.code,
                        '课程名称': grade.course.nameZh,
                        '学分': grade.course.credits,
                        '成绩': grade.gaGrade,
                        '绩点': grade.gp,
                        '教学班排名': classRankData[grade.course.id] || "无数据",
                        '学期': semesterName,
                        '是否必修': grade.course.obligatory
                    });
                });
            });
        }

        checkForNewGrades(allGrades);

        const finalData = { gpaRankData, allGrades, semesterNames };
        setCachedData(finalData);
        Logger.log('Initial', "数据获取完成，已写入缓存");
        return finalData;
    } catch (error) {
        Logger.error("Initial", "数据获取错误", error);
        throw error;
    }
}


/**
 * 检查是否有新成绩发布
 * @param {Array} newGrades 本次抓取到的所有成绩数组
 */
function checkForNewGrades(newGrades) {
    if (!newGrades || newGrades.length === 0) return;

    // 1. 获取上次存储的成绩快照
    const oldGradesRaw = GM_getValue(CONSTANTS.GRADES_SNAPSHOT_KEY, null);

    // 2. 如果是第一次运行，直接保存当前数据，不弹窗（避免首次安装就弹窗）
    if (!oldGradesRaw) {
        GM_setValue(CONSTANTS.GRADES_SNAPSHOT_KEY, JSON.stringify(newGrades));
        Logger.log('GradeCheck', '首次运行，建立成绩快照');
        return;
    }

    let oldGrades = [];
    try {
        oldGrades = JSON.parse(oldGradesRaw);
    } catch (e) {
        GM_setValue(CONSTANTS.GRADES_SNAPSHOT_KEY, JSON.stringify(newGrades));
        return;
    }

    // 3. 构建旧数据的映射表 (Key: 课程代码, Value: 成绩/绩点组合字符串)
    // 使用组合字符串是为了检测成绩数值的变化
    const oldMap = new Map();
    oldGrades.forEach(g => {
        oldMap.set(g['课程代码'], `${g['成绩']}-${g['绩点']}`);
    });

    // 4. 对比找出新成绩
    const newUpdates = [];
    newGrades.forEach(g => {
        const code = g['课程代码'];
        const currentSig = `${g['成绩']}-${g['绩点']}`;

        // 情况A: 旧数据里没有这门课 (新出的课)
        // 情况B: 旧数据里有这门课，但是成绩/绩点变了 (更新了成绩)
        if (!oldMap.has(code) || oldMap.get(code) !== currentSig) {
            // 排除掉可能是还没出成绩的数据
            if (g['成绩'] && g['成绩'] !== '-') {
                 newUpdates.push(g);
            }
        }
    });

    // 5. 如果有更新
    if (newUpdates.length > 0) {
        Logger.log('GradeCheck', `发现 ${newUpdates.length} 门新成绩`);
        // 更新本地存储
        GM_setValue(CONSTANTS.GRADES_SNAPSHOT_KEY, JSON.stringify(newGrades));
        // 显示通知
        showGradeNotification(newUpdates);
    } else {
        Logger.log('GradeCheck', '未检测到成绩变化');
    }
}

/**
 * 在页面顶部指定位置悬浮显示新成绩通知
 */
function showGradeNotification(courses) {
    // 防止重复插入
    if (document.getElementById('gm-new-grade-banner')) return;

    const style = document.createElement('style');
    style.innerHTML = `
        .gm-new-grade-banner {
            position: fixed;
            top: 110px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;

            background: linear-gradient(135deg, #e6f7ff 0%, #d1edff 100%); /* 浅蓝渐变背景 */
            border: 1px solid #a6d4fa; /* 浅蓝边框 */
            color: #004085; /* 深蓝色文字，对比度更高更清晰 */
            box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15); /* 蓝色的淡淡投影 */

            padding: 15px 30px;
            border-radius: 50px;

            display: flex;
            align-items: center;
            gap: 15px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-width: 400px;
            max-width: 80%;

            animation: gmSlideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes gmSlideIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }

        .gm-ng-content { display: flex; align-items: center; flex: 1; }
        .gm-ng-emoji { font-size: 24px; margin-right: 10px; }
        .gm-ng-title { font-weight: bold; font-size: 16px; margin-right: 10px; color: #0056b3; /* 标题用亮一点的蓝 */ }
        .gm-ng-list { font-size: 14px; color: #333; font-weight: 500; }
        .gm-ng-tip { font-size: 12px; color: #6699cc; margin-left: 10px; /* 提示语用灰蓝色 */ }

        .gm-ng-btn {
            background: #fff;
            border: 1px solid #a6d4fa;
            color: #007bff; /* 按钮文字蓝 */
            padding: 6px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            margin-left: 15px;
            white-space: nowrap;
        }
        .gm-ng-btn:hover {
            background: #007bff; /* 鼠标悬停变蓝 */
            color: #fff;         /* 文字变白 */
            border-color: #007bff;
            box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    const banner = document.createElement('div');
    banner.id = 'gm-new-grade-banner';
    banner.className = 'gm-new-grade-banner';

    // 构建课程列表字符串
    const courseText = courses.map(c => `[${c['课程代码']}] ${c['课程名称']}`).join('、');

    banner.innerHTML = `
        <div class="gm-ng-content">
            <div>
                <span class="gm-ng-title">已检测到新成绩发布！</span>
                <span class="gm-ng-list">${courseText}</span>
            </div>
        </div>
        <button class="gm-ng-btn" onclick="this.parentElement.remove()">知道了</button>
    `;

    document.body.appendChild(banner);
}



// =-=-=-=-=-=-=-=-=-=-=-=-= 1. 主页初始化与诊断 =-=-=-=-=-=-=-=-=-=-=-=-=

/**
 * 打印脚本初始化时的详细存储状态诊断报告
 */
function printStorageDiagnosis() {
    // 辅助函数：计算字符串大小（KB）
    const calcSize = (str) => str ? (new Blob([str]).size / 1024).toFixed(2) + ' KB' : '0 KB';
    // 辅助函数：安全解析JSON
    const safeParse = (key, isSession = false) => {
        const raw = isSession ? sessionStorage.getItem(key) : GM_getValue(key);
        try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
    };

    try {
        console.groupCollapsed('%c[NWPU-Enhanced]脚本环境诊断报告 (点击展开)', 'background:#007bff; color:#fff; padding:4px 8px; border-radius:4px;');

        // --- 1. 基础环境与配置 ---
        const studentId = localStorage.getItem('cs-course-select-student-id');
        const configData = {
            '脚本版本': GM_info.script.version,
            '当前学号 (LocalStorage)': studentId || '❌ 未获取 (可能导致功能失效)',
            '功能开关: 画像增强': ConfigManager.enablePortraitEnhancement ? '✅ 开启' : 'OFF',
            '功能开关: 课程关注': ConfigManager.enableCourseWatch ? '✅ 开启' : 'OFF',
            '浏览器 UserAgent': navigator.userAgent.substring(0, 50) + '...'
        };
        console.log('%c 1. 环境与配置', 'color: #007bff; font-weight: bold;');
        console.table(configData);

        // --- 2. 成绩缓存数据 (SessionStorage) ---
        const cachedData = safeParse(CONSTANTS.CACHE_KEY, true);
        const cacheRawSize = sessionStorage.getItem(CONSTANTS.CACHE_KEY);
        console.log('%c 2. 成绩缓存数据 (SessionStorage)', 'color: #007bff; font-weight: bold;');
        if (cachedData) {
            const semesterCounts = {};
            if (cachedData.allGrades) {
                cachedData.allGrades.forEach(g => {
                    semesterCounts[g.学期] = (semesterCounts[g.学期] || 0) + 1;
                });
            }
            console.log(`%c ✅ 数据有效 | 占用空间: ${calcSize(cacheRawSize)}`, 'color: green');
            console.table({
                '总课程数': cachedData.allGrades ? cachedData.allGrades.length : 0,
                '包含学期数': cachedData.semesterNames ? cachedData.semesterNames.length : 0,
                'GPA (Rank数据)': cachedData.gpaRankData ? cachedData.gpaRankData.gpa : '无',
                '排名': cachedData.gpaRankData ? cachedData.gpaRankData.rank : '无'
            });
            if(Object.keys(semesterCounts).length > 0) {
                console.log('▼ 各学期课程数量分布:');
                console.table(semesterCounts);
            }
        } else {
            console.log('%c ⚠️ 未检测到成绩缓存 (正常现象，稍后会自动抓取)', 'color: orange');
        }

        // --- 3. 关注课程数据 (LocalStorage) ---
        const followed = FollowManager.getList();
        const followedRaw = GM_getValue(CONSTANTS.FOLLOWED_COURSES_KEY);
        console.log('%c 3. 关注课程列表', 'color: #007bff; font-weight: bold;');
        if (Object.keys(followed).length > 0) {
            const followStats = {
                '关注总数': Object.keys(followed).length,
                '数据大小': calcSize(followedRaw),
                '最近添加': Object.values(followed).sort((a,b) => new Date(b.addedTime) - new Date(a.addedTime))[0]?.name || 'N/A'
            };
            console.table(followStats);
        } else {
            console.log('⚪ 关注列表为空');
        }

        // --- 4. 选课助手/后台同步数据 ---
        const bgData = safeParse(CONSTANTS.BACKGROUND_SYNC_KEY);
        const bgRaw = GM_getValue(CONSTANTS.BACKGROUND_SYNC_KEY);
        const lastSyncTime = GM_getValue(CONSTANTS.LAST_SYNC_TIME_KEY, 0);
        const historyData = safeParse(CONSTANTS.HISTORY_STORAGE_KEY);
        const historyRaw = GM_getValue(CONSTANTS.HISTORY_STORAGE_KEY);

        console.log('%c 4. 选课助手数据', 'color: #007bff; font-weight: bold;');
        console.table({
            '全校课表缓存 (条数)': bgData ? bgData.length : 0,
            '全校课表占用': calcSize(bgRaw),
            '上次全校同步时间': lastSyncTime ? new Date(lastSyncTime).toLocaleString() : '⚠️ 从未同步',
            '历史余量记录 (课程数)': historyData ? Object.keys(historyData).length : 0,
            '历史记录占用': calcSize(historyRaw)
        });
        console.groupEnd();
    } catch (e) {
        console.error('[NWPU-Enhanced] 诊断报告生成失败', e);
    }
}

async function initializeHomePageFeatures() {
    // 1. UI 初始化
    printStorageDiagnosis();
    createFloatingMenu();
    initExportUI();
    initScheduleWidget();

    // 首次运行检测
    const FIRST_RUN_KEY = 'jwxt_enhanced_v162_intro_shown';
    if (!GM_getValue(FIRST_RUN_KEY, false)) {
        setTimeout(() => handleHelpClick(), 1500);
        GM_setValue(FIRST_RUN_KEY, true);
    }

    // 2. 设置按钮状态为“加载中”
    updateMenuButtonsState(false);

    // 3. 【延迟执行】定义繁重的数据加载任务
    const runHeavyDataFetch = async () => {
        let cachedData = getCachedData();
        if (cachedData) {
            updateMenuButtonsState(true);
            isDataReady = true;
        } else {
            try {
                await fetchAllDataAndCache();
                updateMenuButtonsState(true);
                isDataReady = true;
            } catch (error) {
                console.error("[NWPU-Enhanced] 后台数据加载失败", error);
            }
        }
    };

    // 4. 使用 requestIdleCallback 在浏览器空闲时执行
    if ('requestIdleCallback' in window) {
        // timeout: 3000 表示：如果浏览器一直很忙，最晚 3秒后强制执行，防止任务饿死
        window.requestIdleCallback(() => {
            runHeavyDataFetch();
        }, { timeout: 3000 });
    } else {
        // 兼容不支持该 API 的浏览器
        setTimeout(runHeavyDataFetch, 1000);
    }

    // 注册控制台调试命令
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.nwpuDiag = function() { printStorageDiagnosis(); return "✅ 诊断报告已生成"; };
        Object.defineProperty(unsafeWindow, 'axjw_test', {
            get: function() { printStorageDiagnosis(); return "✅ 正在生成报告..."; },
            configurable: true
        });
        console.log("%c[NWPU-Enhanced]调试提示：在控制台输入 'axjw_test' 并按Enter键，可重新显示诊断报告。", "color: gray; font-style: italic;");
    }
}

function createFloatingMenu() {
    if (!document.getElementById('gm-float-menu-style')) {
        const style = document.createElement('style');
        style.id = 'gm-float-menu-style';
        style.textContent = `
            /* 悬浮球样式 */
            .gm-float-ball {
                position: fixed; top: 15%; right: 20px; width: 48px; height: 48px;
                background-color: #007bff; color: white; border-radius: 50%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 100001; cursor: pointer;
                display: flex; align-items: center; justify-content: center; font-size: 26px;
                user-select: none; transition: all 0.2s; touch-action: none;
            }
            .gm-float-ball:hover { transform: scale(1.05); background-color: #0056b3; }

            /* 菜单容器 */
            .gm-float-menu {
                position: fixed; width: 220px !important; background-color: white; border-radius: 4px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15); z-index: 100000;
                display: none; flex-direction: column; padding: 5px 0;
                opacity: 0; transform: translateY(5px); transition: opacity 0.2s, transform 0.2s;
                overflow: hidden; border: 1px solid #ebeef5;
                box-sizing: border-box !important;
            }
            .gm-float-menu.show { display: flex; opacity: 1; transform: translateY(0); }

            /* 菜单项 */
            .gm-menu-item {
                padding: 12px 18px !important;
                cursor: pointer; color: #444; font-size: 15px; text-align: left;
                background: transparent !important; /* 防止被页面按钮背景覆盖 */
                border: none !important;
                border-radius: 0 !important; /* 移除圆角，整齐排列 */
                width: 100% !important; /* 强制填满 */
                margin: 0 !important; /* 清除默认间距 */
                transition: background 0.1s;
                display: flex; align-items: center; gap: 10px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                box-sizing: border-box !important;
                line-height: 1.5 !important;
                height: auto !important;
            }
            .gm-menu-item:hover:not(:disabled) { background-color: #f0f7ff !important; color: #007bff !important; }
            .gm-menu-item:disabled { cursor: not-allowed; color: #ccc !important; }

            .gm-view-main { display: flex; flex-direction: column; width: 100%; }
            .gm-badge { position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; background: #ff4d4f; border-radius: 50%; display: none; border: 1px solid #fff;}
            .gm-icon { width: 16px; text-align: center; display: inline-block; font-weight: bold; flex-shrink: 0; }
        `;
        document.head.appendChild(style);
    }

    floatBall = document.createElement('div');
    floatBall.className = 'gm-float-ball';
    floatBall.innerHTML = '⚙<div class="gm-badge"></div>';
    floatBall.title = "翱翔教务功能增强设置";
    document.body.appendChild(floatBall);

    floatMenu = document.createElement('div');
    floatMenu.className = 'gm-float-menu';

    const mainView = document.createElement('div');
    mainView.className = 'gm-view-main';
    mainView.innerHTML = `
        <button class="gm-menu-item" id="gm-btn-export" disabled><span class="gm-icon">⇩</span> 导出课程成绩</button>
        <button class="gm-menu-item" id="gm-btn-gpa" disabled><span class="gm-icon">∑</span> GPA分析报告</button>
        <button class="gm-menu-item" id="gm-btn-follow"><span class="gm-icon">❤</span> 课程关注列表</button>
        <button class="gm-menu-item" id="gm-btn-sync-course"><span class="gm-icon">↻</span> 存储最新学期课程数据</button>
        <button class="gm-menu-item" id="gm-btn-person-search"><span class="gm-icon">搜</span> 人员信息检索</button>
        <button class="gm-menu-item" id="gm-btn-hupan"><span class="gm-icon">➜</span> 跳转至湖畔资料</button>
        <button class="gm-menu-item" id="gm-btn-eval-jump"><span class="gm-icon">✎</span> 跳转至评教界面</button>
        <button class="gm-menu-item" id="gm-chk-portrait-btn"><span class="gm-icon" id="icon-portrait"></span> 启用学生画像增强</button>
        <button class="gm-menu-item" id="gm-chk-watch-btn"><span class="gm-icon" id="icon-watch"></span> 启用课程关注功能</button>
        <button class="gm-menu-item" id="gm-btn-help"><span class="gm-icon">◆</span> 脚本使用说明</button>
    `;
    floatMenu.appendChild(mainView);
    document.body.appendChild(floatMenu);

    menuExportBtn = document.getElementById('gm-btn-export');
    menuGpaBtn = document.getElementById('gm-btn-gpa');
    menuSyncBtn = document.getElementById('gm-btn-sync-course');
    menuFollowBtn = document.getElementById('gm-btn-follow');
    menuHupanBtn = document.getElementById('gm-btn-hupan');
    const menuHelpBtn = document.getElementById('gm-btn-help');

    document.addEventListener('click', (e) => { if (!floatMenu.contains(e.target) && !floatBall.contains(e.target)) hideMenu(); });

    menuExportBtn.onclick = handleExportClick;
    menuGpaBtn.onclick = handleGpaClick;
    menuSyncBtn.onclick = handleSyncCourseClick;
    menuFollowBtn.onclick = handleShowFollowedClick;
    menuHelpBtn.onclick = () => handleHelpClick();

    menuHupanBtn.onclick = () => {
        hideMenu();
        if(confirm("即将跳转至湖畔资料网站，请在校园网环境下访问，是否继续？")) {
             window.open('http://nwpushare.fun', '_blank');
        }
    };

    document.getElementById('gm-btn-person-search').onclick = () => {
       hideMenu();
       PersonnelSearch.openModal();
    };

    const updateToggleUI = () => {
        const isPortrait = ConfigManager.enablePortraitEnhancement;
        const isWatch = ConfigManager.enableCourseWatch;
        document.getElementById('icon-portrait').textContent = isPortrait ? '☑' : '☐';
        document.getElementById('icon-watch').textContent = isWatch ? '☑' : '☐';

        document.getElementById('gm-chk-portrait-btn').style.color = isPortrait ? '#333' : '#999';
        document.getElementById('gm-chk-watch-btn').style.color = isWatch ? '#333' : '#999';
    };

    document.getElementById('gm-chk-portrait-btn').onclick = () => {
        ConfigManager.enablePortraitEnhancement = !ConfigManager.enablePortraitEnhancement;
        updateToggleUI();
        if(window.location.href.includes('student-portrait')) {
            if(confirm("修改画像增强设置需要刷新页面生效，是否刷新？")) window.location.reload();
        }
    };

    document.getElementById('gm-chk-watch-btn').onclick = () => {
        ConfigManager.enableCourseWatch = !ConfigManager.enableCourseWatch;
        updateToggleUI();
        if(window.location.href.includes('lesson-search')) {
            alert("课程关注设置已更新，将在下次进入页面或翻页时生效。");
        }
    };
    document.getElementById('gm-btn-eval-jump').onclick = handleJumpToEvaluation;

    updateToggleUI();

    let isDragging = false, hasMoved = false, startX, startY, initialLeft, initialTop;
    floatBall.addEventListener('mousedown', (e) => {
        isDragging = true; hasMoved = false; startX = e.clientX; startY = e.clientY;
        const rect = floatBall.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
        floatBall.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX, deltaY = e.clientY - startY;
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) { hasMoved = true; hideMenu(); }
        floatBall.style.left = Math.min(Math.max(0, initialLeft + deltaX), window.innerWidth - 50) + 'px';
        floatBall.style.top = Math.min(Math.max(0, initialTop + deltaY), window.innerHeight - 50) + 'px';
        floatBall.style.bottom = 'auto'; floatBall.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { if (isDragging) { isDragging = false; floatBall.style.transition = 'all 0.2s'; } });

    floatBall.addEventListener('click', (e) => {
        e.stopPropagation(); if (hasMoved) return;
        if (floatMenu.classList.contains('show')) hideMenu();
        else {
            const rect = floatBall.getBoundingClientRect();
            let left = rect.left - 230;
            if(left < 10) left = rect.right + 10;

            floatMenu.style.left = left + 'px';
            floatMenu.style.top = rect.top + 'px';
            showMenu();
        }
    });
}

function showMenu() { floatMenu.style.display = 'flex'; floatMenu.offsetHeight; floatMenu.classList.add('show'); }

function hideMenu() { floatMenu.classList.remove('show'); setTimeout(() => { if(!floatMenu.classList.contains('show')) floatMenu.style.display = 'none'; }, 200); }

function updateMenuButtonsState(isReady) {
    if (!menuExportBtn || !menuGpaBtn) return;
    menuExportBtn.disabled = !isReady;
    menuGpaBtn.disabled = !isReady;
    const badge = floatBall.querySelector('.gm-badge');
    if (badge) badge.style.display = !isReady ? 'block' : 'none';
}

// ----------------- 功能处理函数 -----------------

/**
 * 处理点击导出按钮`
 */
function handleExportClick() {
    hideMenu();
    // 假设 semesterCheckboxContainer 已在 initExportUI 中定义
    if (semesterCheckboxContainer && semesterCheckboxContainer.style.display === "block") {
         semesterCheckboxContainer.style.display = "none";
         return;
    }
    const cachedData = getCachedData();
    if (isDataReady && cachedData) {
        // 确保 showSemesterCheckboxes 已定义 (在 2.2 中定义)
        if(typeof showSemesterCheckboxes === 'function') showSemesterCheckboxes(cachedData.semesterNames);
    } else {
        alert("成绩数据仍在后台加载中，请稍候...");
    }
}

/**
 * 处理点击GPA分析按钮
 */
function handleGpaClick() {
    hideMenu();
    const cachedData = getCachedData();
    if (isDataReady && cachedData) {
        if(typeof calculateAndDisplayGPA === 'function') calculateAndDisplayGPA(cachedData);
    } else {
        alert("成绩数据仍在后台加载中，请稍候...");
    }
}

/**
 * 处理点击同步数据按钮
 */
function handleSyncCourseClick() {
    hideMenu();
    // 提示文案明确界定功能范围
    const confirmMsg = '【更新选课助手数据】\n\n' +
                       '此操作将跳转至“全校开课查询”页面，并自动执行数据更新。\n' +
                       '数据将用于选课页面的“历史余量”参考。\n' +
                       '建议每轮选课开始前执行一次。\n\n' +
                       '同步将花费几十秒，是否跳转并开始同步？';

    if (confirm(confirmMsg)) {
        sessionStorage.setItem('nwpu_course_sync_trigger', 'true');

        // 尝试查找链接跳转
        let courseLink = document.querySelector('a[onclick*="lesson-search"]') ||
                         document.querySelector('a[href*="/student/for-std/lesson-search"]') ||
                         document.querySelector('a[data-text="全校开课查询"]'); // 增加data-text匹配

        // 尝试在顶层窗口查找
        if (!courseLink && window.top !== window.self) {
            try {
                courseLink = window.top.document.querySelector('a[onclick*="lesson-search"]') ||
                             window.top.document.querySelector('a[href*="/student/for-std/lesson-search"]') ||
                             window.top.document.querySelector('a[data-text="全校开课查询"]');
            } catch (e) { /* 忽略跨域错误 */ }
        }

        if (courseLink) {
            courseLink.click();
        } else {
            // 强制跳转作为后备方案
            window.location.href = 'https://jwxt.nwpu.edu.cn/student/for-std/lesson-search';
        }
    }
}

/**
 * 处理点击帮助按钮
 */
function handleHelpClick() {
    hideMenu();

    // 1. 注入CSS
    if (!document.getElementById('gm-help-style')) {
        const style = document.createElement('style');
        style.id = 'gm-help-style';
        style.textContent = `
            .gm-help-modal { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .gm-help-section { margin-bottom: 20px; border-left: 4px solid #007bff; padding-left: 12px; }
            .gm-help-title { font-weight: bold; font-size: 16px; color: #333; margin-bottom: 8px; }
            .gm-help-content { font-size: 14px; color: #555; line-height: 1.6; }
            .gm-tag-hl { background: #f0f7ff; color: #007bff; padding: 2px 6px; border-radius: 4px; font-weight: 500; font-size: 13px; }
        `;
        document.head.appendChild(style);
    }

    // 2. 创建遮罩 (如果页面上已经有遮罩层样式则复用)
    const overlay = document.createElement('div');
    overlay.className = 'gm-modal-overlay';
    if (!document.getElementById('gm-followed-modal-style')) {
        // 如果还没有样式，加个临时的
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10005; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px);';
    }

    // 3. 创建内容框
    const modal = document.createElement('div');
    modal.className = 'gm-modal-content gm-help-modal';
    modal.style.cssText = `
        background-color: #fff; border-radius: 6px; width: 95%; max-width: 600px;
        max-height: 80vh; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        display: flex; flex-direction: column; overflow: hidden;
        font-family: -apple-system, sans-serif; animation: gmFadeIn 0.2s ease-out;
    `;

modal.innerHTML = `
        <div class="gm-modal-header" style="padding: 0 20px; height: 50px; border-bottom: 1px solid #eee; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center;">
            <div class="gm-modal-title" style="font-size: 16px; font-weight: bold; color: #333;">◆ 翱翔教务功能增强 使用说明</div>
            <button class="gm-modal-close" style="border: none; background: none; font-size: 24px; color: #999; cursor: pointer;">×</button>
        </div>
        <div class="gm-modal-body" style="padding: 25px; overflow-y: auto;">

            <div class="gm-help-section">
                <div class="gm-help-title">1. 选课辅助功能</div>
                <div class="gm-help-content">
                    本脚本旨在优化选课体验，完整操作流程如下：
                    <ul style="margin-top:5px;">
                        <li><b>第一步：数据同步与缓存</b><br>
                        点击悬浮球 <span class="gm-tag-hl">存储最新学期课程数据</span>，脚本将同步该学期内已选课程人数，该数据用于辅助判断课程内置情况。此操作是使用选课助手及容量参考功能的前置条件，建议在<b>每轮选课前</b>手动同步。</li>

                        <li><b>第二步：课程关注与排课辅助</b><br>
                        在“全校开课查询”、“培养方案”或“选课”页面，点击课程旁的 <span style="color:#dcdfe6;font-size:14px;">❤</span> 图标收藏课程。<br>
                        通过悬浮球的 <span class="gm-tag-hl">课程关注列表</span> 进入<b>“课表视图”</b>，可直观比对备选课程的时间分布，辅助进行排课规划。</li>

                        <li><b>第三步：选课界面增强</b><br>
                        进入“学生选课”页面后，脚本将自动加载以下辅助信息：
                        <br>- <span style="color:#F56C6C;font-weight:bold;">课程关注</span>：高亮显示已关注的目标课程，便于快速定位。
                        <br>- <span style="color:#28a745;">容量参考</span>：意愿值模式下，显示上次数据手动同步时的已选人数与上限，辅助判断课程内置情况。
                        <br>- <span style="color:#E65100;">直选辅助</span>：直选模式下，自动识别并显示存在的“待释放”名额。
                        </li>
                    </ul>
                </div>
            </div>

            <div class="gm-help-section">
                <div class="gm-help-title">2. 成绩管理 & 学生画像增强</div>
                <div class="gm-help-content">
                    <div><b>GPA分析：</b>提供加权均分(标准/百分制)、卡绩分析，以及“GPA计算器”。</div>
                    <div><b>成绩导出：</b>一键导出包含<b>教学班排名</b>的 Excel 成绩单。</div>
                    <div><b>学生画像UI增强：</b>在“学生画像”页面，优化平均分计算方法并显示加权百分制成绩，同时优化“计划外课程”的表格显示。</div>
                </div>
            </div>

            <div class="gm-help-section">
                <div class="gm-help-title">3. 培养方案智能预览</div>
                <div class="gm-help-content">
                    在“我的培养方案”或“培养方案完成情况”页面，最新选课学期如存在可选课程，<span style="color:#409EFF;border-bottom:1px dashed #409EFF;">课程代码会自动高亮</span> 。<b>首次使用</b>请等待后台完成自动同步。<br>
                    <b>鼠标悬停</b>：即可查看该课程最新学期的开设班级、老师、时间地点及余量信息。<br>
                    <b>双击代码</b>：快速复制课程代码。
                </div>
            </div>

            <div class="gm-help-section">
                <div class="gm-help-title">4. 人员信息检索</div>
                <div class="gm-help-content">
                    <li>点击悬浮球中 <span class="gm-tag-hl">人员信息检索</span>功能，输入姓名/学号/工号，可快速查询同名人员、所属学院及学/工号。
                </div>
            </div>

            <div class="gm-help-section">
                <div class="gm-help-title">5. 自动评教</div>
                <div class="gm-help-content">
                    <li>点击悬浮球中 <span class="gm-tag-hl">跳转至评教页面</span>功能，在评教页面发布自动评教任务，即可一键自动评教。
                </div>
            </div>

            <div class="gm-help-section">
                <div class="gm-help-title">6. 设置与隐私</div>
                <div class="gm-help-content">
                    <li>所有数据（关注列表、课程缓存）仅存储在您浏览器的 LocalStorage 中，不会收集您的任何个人信息。</li>
                    <li>若不需要学生画像增强或课程关注功能，可在悬浮球菜单中随时关闭。</li>
                </div>
            </div>

            <div style="text-align: center; margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; color: #aaa; font-size: 12px;">
                版本: ${GM_info.script.version} &nbsp;|&nbsp; 祝您学业进步，科研顺利！
            </div>
        </div>`
    ;

    const closeFn = () => overlay.remove();
    modal.querySelector('.gm-modal-close').onclick = closeFn;
    overlay.onclick = (e) => { if(e.target === overlay) closeFn(); };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

/**
 * 处理跳转至评教界面
 */
function handleJumpToEvaluation() {
    hideMenu(); // 确保 hideMenu 函数在此作用域内可见
    if (confirm("即将跳转至“学生总结性评教”页面，是否继续？")) {
        // ... (跳转逻辑)
        let evalLink = document.querySelector('a[onclick*="evaluation-student"]') ||
                       document.querySelector('a[href*="evaluation-student"]') ||
                       document.querySelector('a[data-text="学生总结性评教"]');

        // 尝试在顶层窗口查找（应对 iframe 情况）
        if (!evalLink && window.top !== window.self) {
            try {
                evalLink = window.top.document.querySelector('a[onclick*="evaluation-student"]') ||
                           window.top.document.querySelector('a[data-text="学生总结性评教"]');
            } catch (e) {}
        }

        if (evalLink) {
            evalLink.click();
        } else {
            // 强制跳转作为后备方案
            window.location.href = 'https://jwxt.nwpu.edu.cn/evaluation-student-frontend/#/byTask';
        }
    }
}


// =-=-=-=-=-=-=-=-=-=-=-=-= 2.1 课程关注列表 =-=-=-=-=-=-=-=-=-=-=-=-=
/**
 * 展示已关注课程列表
 */
function handleShowFollowedClick() {
    hideMenu();
    Logger.log("2.1", "正在初始化课程关注列表...");

    // 模块 1: 课程数据解析工具 (CourseParser)
    const CourseParser = {
        cnToNumber(str) {
            const map = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12, '十三': 13, '十四': 14, '日': 7, '天': 7 };
            const clean = str.replace(/[^\d一二三四五六七八九十日天]/g, '');
            return map[clean] || parseInt(clean) || 0;
        },
        formatWeekSet(weekSet) {
            if (!weekSet || weekSet.size === 0) return "";
            const weeks = Array.from(weekSet).sort((a, b) => a - b);
            const ranges = [];
            let start = weeks[0], prev = weeks[0];
            for (let i = 1; i < weeks.length; i++) {
                if (weeks[i] === prev + 1) {
                    prev = weeks[i];
                } else {
                    ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
                    start = weeks[i];
                    prev = weeks[i];
                }
            }
            ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
            return ranges.join(',') + "周";
        },
        parseActiveWeeks(weekStr) {
            const activeWeeks = new Set();
            if (!weekStr) return activeWeeks;
            let content = weekStr.replace(/周/g, '').replace(/[\(\[\{（].*?[\)\]\}）]/g, '');
            const isOdd = weekStr.includes('单');
            const isEven = weekStr.includes('双');
            content.split(/[,，]/).forEach(part => {
                const rangeMatch = part.match(/(\d+)\s*[-~～]\s*(\d+)/);
                if (rangeMatch) {
                    const start = parseInt(rangeMatch[1]);
                    const end = parseInt(rangeMatch[2]);
                    for (let i = start; i <= end; i++) {
                        if (isOdd && i % 2 === 0) continue;
                        if (isEven && i % 2 !== 0) continue;
                        activeWeeks.add(i);
                    }
                } else {
                    const single = parseInt(part);
                    if (!isNaN(single)) activeWeeks.add(single);
                }
            });
            return activeWeeks;
        },
        parseTimeAndPlace(timeStr) {
            if (!timeStr || timeStr === '-' || timeStr === '') return [];
            const results = [];
            const cleanStr = timeStr.replace(/<br\s*\/?>/gi, ';').replace(/\n/g, ';');
            cleanStr.split(/[;；]/).forEach(seg => {
                seg = seg.trim();
                if (!seg) return;
                const weekMatch = seg.match(/([\d,\-~～]+)周(?:\([单双]\))?/);
                const activeWeeks = weekMatch ? this.parseActiveWeeks(weekMatch[0]) : null;
                const dayMatch = seg.match(/[周星][期]?[一二三四五六日天1-7]/);
                let day = 0;
                if (dayMatch) day = this.cnToNumber(dayMatch[0].replace(/[周星期]/g, ''));
                const nodeMatch = seg.match(/(?:第)?(\d+|[一二三四五六七八九十]+)(?:[节\s]*[-~～][第\s]*(\d+|[一二三四五六七八九十]+))?节/);
                if (day > 0 && nodeMatch) {
                    const startNode = this.cnToNumber(nodeMatch[1]);
                    const endNode = nodeMatch[2] ? this.cnToNumber(nodeMatch[2]) : startNode;
                    let location = seg.replace(weekMatch ? weekMatch[0] : '', '').replace(dayMatch ? dayMatch[0] : '', '').replace(nodeMatch[0], '').trim().replace(/^[\s,，]+|[\s,，]+$/g, '');
                    if (startNode > 0 && startNode <= 14) {
                        results.push({ day, startNode, endNode, activeWeeks, location, rawInfo: seg });
                    }
                }
            });
            return results;
        }
    };

    // 模块 2: 视图渲染器 (CourseParser)
    const ViewRenderer = {
        getStyle(name) {
            const palettes = [
                { bg: 'rgba(111, 176, 243, 0.2)', border: 'rgb(111, 176, 243)' },
                { bg: 'rgba(154, 166, 189, 0.2)', border: 'rgb(154, 166, 189)' },
                { bg: 'rgba(240, 200, 109, 0.2)', border: 'rgb(240, 200, 109)' },
                { bg: 'rgba(56, 200, 180, 0.2)',  border: 'rgb(56, 200, 180)' },
                { bg: 'rgba(244, 144, 96, 0.2)',  border: 'rgb(244, 144, 96)' },
                { bg: 'rgba(121, 150, 202, 0.2)', border: 'rgb(121, 150, 202)' },
                { bg: 'rgba(218, 196, 165, 0.2)', border: 'rgb(218, 196, 165)' },
                { bg: 'rgba(253, 171, 154, 0.2)', border: 'rgb(253, 171, 154)' },
                { bg: 'rgba(255, 117, 117, 0.2)', border: 'rgb(255, 117, 117)' },
                { bg: 'rgba(169, 206, 149, 0.2)', border: 'rgb(169, 206, 149)' }
            ];
            let hash = 0;
            for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
            return palettes[Math.abs(hash) % palettes.length];
        },

        renderList(courses, container) {
            if (!courses.length) {
                container.innerHTML = `<div class="gm-empty-state"><p>暂无相关课程</p></div>`;
                return;
            }
            let html = `
                <table class="gm-course-table">
                    <thead><tr><th width="120">代码</th><th>课程名称</th><th width="12%">学期</th><th width="15%">教师</th><th width="50" align="center">学分</th><th>时间/地点</th><th width="70" align="center">操作</th></tr></thead>
                    <tbody>
            `;
            courses.forEach(c => {
                const tpStr = c.timeAndPlace ? c.timeAndPlace.replace(/;/g, '<br>') : '-';
                html += `
                    <tr>
                        <td><span class="gm-code-badge">${c.code}</span></td>
                        <td>${c.name}</td>
                        <td style="color:#999;font-size:12px;">${c.semester || '历史'}</td>
                        <td>${c.teachers}</td>
                        <td align="center">${c.credits}</td>
                        <td style="font-size:12px;line-height:1.4;">${tpStr}</td>
                        <td align="center"><button class="gm-btn-unfollow" data-id="${c.id}">取消</button></td>
                    </tr>`;
            });
            html += `</tbody></table>`;
            container.innerHTML = html;
        },

        renderTimetable(courses, container, targetWeek) {
            const timeSlots = [
                { range: [1, 2] }, { range: [3, 4] }, { range: [5, 6] }, { range: [7, 8] }, { range: [9, 10] }, { range: [11, 12] }, { range: [13] }
            ];

            let html = `<table class="gm-timetable"><thead><tr><th width="50" style="background:#f5f7fa;"></th><th width="13.5%">星期一</th><th width="13.5%">星期二</th><th width="13.5%">星期三</th><th width="13.5%">星期四</th><th width="13.5%">星期五</th><th width="13.5%">星期六</th><th width="13.5%">星期日</th></tr></thead><tbody>`;

            timeSlots.forEach((slot, index) => {
                const startNode = slot.range[0];
                let slotBg = '#f9fafc'; // 默认颜色

                if (startNode <= 4) {
                    slotBg = '#e6f7ff'; // 1-4节 (上午): 浅蓝
                } else if (startNode <= 6) {
                    slotBg = '#fff7e6'; // 5-6节 (下午1): 浅橙
                } else if (startNode <= 10) {
                    slotBg = '#f6ffed'; // 7-10节 (下午2+晚1): 浅绿
                } else {
                    slotBg = '#f4f4f5'; // 11-13节 (晚2): 浅灰
                }

                let periodHtml = `<div class="gm-period-wrapper">`;
                slot.range.forEach((num, idx) => {
                    const borderStyle = (idx < slot.range.length - 1) ? 'border-bottom: 1px solid rgba(0,0,0,0.06);' : '';
                    periodHtml += `<div class="gm-period-num" style="${borderStyle}">${num}</div>`;
                });
                periodHtml += `</div>`;

                html += `<tr><td class="gm-tt-period" style="background:${slotBg}">${periodHtml}</td>`;

                for (let day = 1; day <= 7; day++) {
                    const coursesInSlotMap = new Map();

                    courses.forEach(course => {
                        const segments = CourseParser.parseTimeAndPlace(course.timeAndPlace);
                        segments.forEach(seg => {
                            if (seg.day !== day) return;
                            if (targetWeek !== 'all') {
                                const weekNum = parseInt(targetWeek);
                                if (seg.activeWeeks && seg.activeWeeks.size > 0 && !seg.activeWeeks.has(weekNum)) return;
                            }

                            if (seg.startNode <= slot.range[slot.range.length-1] && seg.endNode >= slot.range[0]) {
                                const key = course.id;
                                if (!coursesInSlotMap.has(key)) {
                                    coursesInSlotMap.set(key, {
                                        ...course,
                                        mergedWeeks: new Set(),
                                        segLocation: seg.location,
                                        detailSegments: []
                                    });
                                }
                                const existing = coursesInSlotMap.get(key);
                                if (seg.activeWeeks) seg.activeWeeks.forEach(w => existing.mergedWeeks.add(w));
                                existing.detailSegments.push(seg.rawInfo);
                            }
                        });
                    });

                    html += `<td style="vertical-align: top; padding: 2px;">`;
                    html += `<div class="gm-tt-cell-wrapper">`;

                    if (coursesInSlotMap.size > 0) {
                        coursesInSlotMap.forEach(item => {
                            const style = this.getStyle(item.name);
                            let weekInfoStr = CourseParser.formatWeekSet(item.mergedWeeks);
                            if (weekInfoStr === "") weekInfoStr = "未知周次";
                            const uniqueDetails = [...new Set(item.detailSegments)];
                            const tooltip = `${item.name}\n${item.teachers}\n----------------\n${uniqueDetails.join('\n')}`;

                            html += `
                                <div class="gm-tt-course-block"
                                     style="background: ${style.bg}; border-left: 3px solid ${style.border};"
                                     title="${tooltip}">
                                    <div class="gm-tt-name">${item.name}</div>
                                    <div class="gm-tt-info">@${item.segLocation}</div>
                                    <div class="gm-tt-info" style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                                        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:60%;" title="${item.teachers}">${item.teachers}</span>
                                        <span class="gm-tt-tag">${weekInfoStr}</span>
                                    </div>
                                </div>
                            `;
                        });
                    }
                    html += `</div></td>`;
                }
                html += `</tr>`;
            });

            html += `</tbody></table>`;
            const weekText = targetWeek === 'all' ? '全部周次' : `第 ${targetWeek} 周`;
            if(courses.length > 0) {
                 html += `<div class="gm-tt-footer">当前展示：${weekText}</div>`;
            } else {
                 html = `<div class="gm-empty-state"><p>${weekText} 暂无课程</p></div>`;
            }
            container.innerHTML = html;
        }
    };

    // 模块 3: CSS 样式注入 - 保持不变
    const styleId = 'gm-followed-modal-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .gm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10005; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
            .gm-modal-content { background-color: #fff; border-radius: 6px; width: 95%; max-width: 1200px; height: 90vh; max-height: 950px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; overflow: hidden; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; animation: gmFadeIn 0.2s ease-out; }
            @keyframes gmFadeIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
            .gm-modal-header { padding: 0 20px; border-bottom: 1px solid #eee; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 50px; }
            .gm-modal-title { font-size: 16px; font-weight: bold; color: #333; display: flex; align-items: center; gap: 8px; }
            .gm-modal-close { border: none; background: none; font-size: 24px; color: #999; cursor: pointer; padding: 0 10px; display:flex; align-items:center; }
            .gm-tabs { display: flex; gap: 20px; margin-left: 30px; height: 100%; }
            .gm-tab-item { display: flex; align-items: center; height: 100%; font-size: 14px; color: #666; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; padding: 0 5px; font-weight: 500; }
            .gm-tab-item.active { color: #007bff; border-bottom-color: #007bff; }
            .gm-filter-bar { padding: 10px 20px; background: #fff; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; gap: 15px;}
            .gm-filter-group { display: flex; align-items: center; gap: 10px; }
            .gm-filter-label { font-size: 13px; color: #606266; }
            .gm-filter-select { padding: 5px 10px; font-size: 13px; border: 1px solid #dcdfe6; border-radius: 3px; color: #606266; outline: none; background-color: white; }
            .gm-btn-clear-all { padding: 5px 12px; font-size: 13px; border-radius: 3px; border: 1px solid #f56c6c; color: #f56c6c; background: #fff; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 5px; }
            .gm-btn-clear-all:hover { background: #f56c6c; color: #fff; }
            .gm-modal-body { flex: 1; overflow: hidden; position: relative; display: flex; flex-direction: column; background: #fff; }
            .gm-view-container { flex: 1; overflow-y: auto; padding: 0 20px 20px 20px; display: none; height: 100%; }
            .gm-view-container.active { display: block; }
            .gm-course-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
            .gm-course-table th { position: sticky; top: 0; background: #fff; z-index: 10; padding: 12px 10px; text-align: left; font-size: 13px; color: #909399; font-weight: bold; border-bottom: 2px solid #f0f0f0; }
            .gm-course-table td { padding: 10px; font-size: 13px; color: #606266; border-bottom: 1px solid #ebeef5; vertical-align: middle; line-height: 1.4; }
            .gm-code-badge { background: #f4f4f5; color: #909399; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
            .gm-btn-unfollow { padding: 4px 10px; font-size: 12px; border-radius: 3px; border: 1px solid #fab6b6; color: #f56c6c; background: #fef0f0; cursor: pointer; }
            .gm-timetable { width: 100%; border-collapse: collapse; table-layout: fixed; margin-top: 10px; border: 1px solid #e0e0e0; font-size: 12px; }
            .gm-timetable th { background: #f8f9fa; color: #333; font-weight: bold; padding: 8px; text-align: center; border: 1px solid #ddd; height: 36px; }
            .gm-timetable td { border: 1px solid #ddd; height: auto; }
            .gm-tt-period { position: relative; padding: 0 !important; vertical-align: top; width: 50px; height: 1px; }
            .gm-period-wrapper { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; }
            .gm-period-num { flex: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #555; font-weight: bold; width: 100%; }
            .gm-tt-cell-wrapper { width: 100%; min-height: 60px; display: flex; flex-direction: column; gap: 4px; padding: 4px; box-sizing: border-box; }
            .gm-tt-course-block { padding: 6px; font-size: 12px; line-height: 1.35; color: #333; cursor: pointer; border-radius: 0; overflow: hidden; }
            .gm-tt-course-block:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: scale(1.01); z-index: 5; transition: all 0.1s; }
            .gm-tt-name { font-weight: bold; color: #000; margin-bottom: 3px; font-size: 13px; }
            .gm-tt-info { color: #555; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .gm-tt-tag { opacity: 0.9; font-size: 11px; color: #333; background: rgba(255,255,255,0.6); padding: 1px 4px; border-radius: 3px; flex-shrink: 0; }
            .gm-tt-footer { margin-top:10px; font-size:12px; color:#606266; text-align:right; padding-right:10px;}
            .gm-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #909399; text-align: center; padding-top: 60px;}
        `;
        document.head.appendChild(style);
    }

    // 模块 4: 初始化
    const followedCourses = FollowManager.getList();
    let courseList = Object.values(followedCourses);
    const allSemesters = [...new Set(courseList.map(c => c.semester || '历史关注'))].sort().reverse();

    let semesterOptions = `<option value="all">显示全部学期</option>`;
    allSemesters.forEach(sem => { semesterOptions += `<option value="${sem}">${sem}</option>`; });

    let weekOptions = `<option value="all">显示全部周次</option>`;
    for(let i=1; i<=20; i++) weekOptions += `<option value="${i}">第 ${i} 周</option>`;

    const modalHTML = `
        <div class="gm-modal-overlay" id="gm-modal-overlay">
            <div class="gm-modal-content">
                <div class="gm-modal-header">
                    <div style="display:flex; align-items:center;">
                        <div class="gm-modal-title">❤ 课程关注列表</div>
                        <div class="gm-tabs">
                            <div class="gm-tab-item active" data-tab="list">列表视图</div>
                            <div class="gm-tab-item" data-tab="timetable">课表视图</div>
                        </div>
                    </div>
                    <button class="gm-modal-close" id="gm-modal-close">×</button>
                </div>
                <div class="gm-modal-body">
                    <div class="gm-filter-bar">
                        <div class="gm-filter-group">
                            <span class="gm-filter-label">学期:</span>
                            <select id="gm-semester-select" class="gm-filter-select" style="min-width:140px;">${semesterOptions}</select>
                            <div id="gm-week-filter-container" style="display:none; align-items:center; margin-left:15px;">
                                <span class="gm-filter-label">周次:</span>
                                <select id="gm-week-select" class="gm-filter-select" style="min-width:100px; margin-left:5px;">${weekOptions}</select>
                            </div>
                        </div>

                        <div class="gm-right-actions" style="display:flex; align-items:center; gap:15px;">
                            <span style="font-size:13px; color:#606266; font-weight:bold;">
                                总学分: <span id="gm-total-credits" style="color:#409EFF">0</span>
                            </span>
                            <button id="gm-btn-clear-all" class="gm-btn-clear-all">清空当前</button>
                        </div>
                    </div>
                    <div class="gm-view-container active" id="gm-view-list"><div id="gm-table-wrapper"></div></div>
                    <div class="gm-view-container" id="gm-view-timetable"><div id="gm-timetable-wrapper"></div></div>
                </div>
            </div>
        </div>
    `;

    const existingOverlay = document.getElementById('gm-modal-overlay');
    if (existingOverlay) existingOverlay.remove();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHTML;
    document.body.appendChild(wrapper.firstElementChild);

    // 状态管理
    const state = { semester: 'all', week: 'all', currentTab: 'list' };

    const refreshView = () => {
        const filtered = courseList.filter(c => state.semester === 'all' || (c.semester || '历史关注') === state.semester);
        filtered.sort((a, b) => {
            const semA = a.semester || ''; const semB = b.semester || '';
            if (semA !== semB) return semB.localeCompare(semA);
            return a.code.localeCompare(b.code);
        });

        // 【修改点】 计算并更新总学分
        let totalCredits = 0;
        filtered.forEach(c => {
            const credit = parseFloat(c.credits);
            if (!isNaN(credit)) {
                totalCredits += credit;
            }
        });
        const creditSpan = document.getElementById('gm-total-credits');
        if (creditSpan) {
            creditSpan.innerText = totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1);
        }

        if (state.currentTab === 'list') {
            ViewRenderer.renderList(filtered, document.getElementById('gm-table-wrapper'));
        } else {
            ViewRenderer.renderTimetable(filtered, document.getElementById('gm-timetable-wrapper'), state.week);
        }

        const clearBtn = document.getElementById('gm-btn-clear-all');
        const btnText = state.semester === 'all' ? '清空全部' : '清空当前学期';
        clearBtn.innerHTML = `<span style="margin-left:4px">${btnText}</span>`;
        clearBtn.style.opacity = filtered.length === 0 ? '0.5' : '1';
        clearBtn.style.pointerEvents = filtered.length === 0 ? 'none' : 'auto';
    };

    // 事件绑定
    const tabs = document.querySelectorAll('.gm-tab-item');
    const views = document.querySelectorAll('.gm-view-container');
    const weekFilterContainer = document.getElementById('gm-week-filter-container');

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`gm-view-${tab.dataset.tab}`).classList.add('active');
            state.currentTab = tab.dataset.tab;
            weekFilterContainer.style.display = (state.currentTab === 'timetable') ? 'flex' : 'none';
            refreshView();
        };
    });

    document.getElementById('gm-semester-select').onchange = (e) => { state.semester = e.target.value; refreshView(); };
    document.getElementById('gm-week-select').onchange = (e) => { state.week = e.target.value; refreshView(); };
    const closeModal = () => document.getElementById('gm-modal-overlay').remove();
    document.getElementById('gm-modal-close').onclick = closeModal;
    document.getElementById('gm-modal-overlay').onclick = (e) => { if (e.target.id === 'gm-modal-overlay') closeModal(); };

    document.getElementById('gm-btn-clear-all').onclick = () => {
        const targetName = state.semester === 'all' ? '所有' : state.semester;
        if (confirm(`⚠️ 确定要取消关注【${targetName}】下的所有课程吗？`)) {
            const idsToRemove = courseList
                .filter(c => state.semester === 'all' || (c.semester || '历史关注') === state.semester)
                .map(c => c.id);
            idsToRemove.forEach(id => FollowManager.remove(id));
            courseList = courseList.filter(c => !idsToRemove.includes(c.id));
            if (courseList.length === 0) { closeModal(); handleShowFollowedClick(); }
            else refreshView();
        }
    };

    const btnContainer = document.querySelector('.gm-modal-body');
    btnContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('gm-btn-unfollow')) {
            const id = e.target.dataset.id;
            if(confirm('确定不再关注此课程吗？')) {
                // 1. 从存储中移除
                FollowManager.remove(id);

                // 2. 重新从存储读取最新全量列表
                courseList = Object.values(FollowManager.getList());

                // 3. 刷新视图 (ViewRenderer 会自动处理空列表的情况)
                refreshView();
            }
        }
    });

    refreshView();
}

// ----------------- 2.2 导出成绩 -----------------

function initExportUI() {
    if (!document.getElementById('export-ui-styles')) {
        const style = document.createElement("style");
        style.id = 'export-ui-styles';
        style.textContent = `
    .semester-bg-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 10001; display: none; transition: all 0.3s; }
    .semester-checkbox-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10002; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); display: none; width: 450px; border: 1px solid #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .semester-checkbox-container h3 { margin: 0 0 20px 0; font-size: 18px; color: #1f1f1f; display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .gm-semester-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-height: 320px; overflow-y: auto; padding: 4px; margin-bottom: 20px; }
    .gm-semester-item { display: flex; align-items: center; padding: 10px 12px; background: #f5f7fa; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; font-size: 14px; color: #444; user-select: none; }
    .gm-semester-item:hover { background: #eef5fe; border-color: #b3d8ff; color: #007bff; }
    .gm-semester-item input[type='checkbox'] { margin-right: 10px; width: 16px; height: 16px; cursor: pointer; }
    .button-container { display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #f0f0f0; padding-top: 20px; }
    .semester-checkbox-container button { padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; border: none; }
    .confirm-export-button { background-color: #007bff; color: white; }
    .confirm-export-button:hover { background-color: #0069d9; transform: translateY(-1px); }
    .select-all-button { background-color: #f0f2f5; color: #595959; border: 1px solid #d9d9d9 !important; }
    .cancel-button { background-color: transparent; color: #8c8c8c; }
    .gm-semester-list::-webkit-scrollbar { width: 6px; }
    .gm-semester-list::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
`;
        document.head.appendChild(style);
    }
    let bgOverlay = document.createElement("div"); bgOverlay.className = "semester-bg-overlay"; document.body.appendChild(bgOverlay);
    semesterCheckboxContainer = document.createElement("div"); semesterCheckboxContainer.className = "semester-checkbox-container"; document.body.appendChild(semesterCheckboxContainer);
    bgOverlay.addEventListener('click', () => { semesterCheckboxContainer.style.display = "none"; });
    Object.defineProperty(semesterCheckboxContainer.style, 'display', { set: function(val) { bgOverlay.style.display = val; this.setProperty('display', val); }, get: function() { return this.getPropertyValue('display'); } });
}

function showSemesterCheckboxes(semesterNames) {
    if (!document.getElementById('export-ui-styles')) {
        injectExportStyles(); // 封装样式注入逻辑
    }

    Logger.log("2.2", "开始导出成绩...");
    semesterCheckboxContainer.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "选择要导出的学期";
    semesterCheckboxContainer.appendChild(title);

    const listDiv = document.createElement("div");
    listDiv.className = "gm-semester-list";

    semesterNames.forEach((semesterName) => {
        const label = document.createElement("label");
        label.className = "gm-semester-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = semesterName;
        checkbox.checked = true;
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(semesterName));
        listDiv.appendChild(label);
    });
    semesterCheckboxContainer.appendChild(listDiv);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    const selectAllButton = document.createElement("button");
    selectAllButton.textContent = "全选/反选";
    selectAllButton.className = "select-all-button";
    selectAllButton.onclick = () => {
        const checkboxes = semesterCheckboxContainer.querySelectorAll("input[type='checkbox']");
        const isAllChecked = Array.from(checkboxes).every(c => c.checked);
        checkboxes.forEach(c => { c.checked = !isAllChecked; });
    };

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "取消";
    cancelButton.className = "cancel-button";
    cancelButton.onclick = () => { semesterCheckboxContainer.style.display = "none"; };

    const confirmExportButton = document.createElement("button");
    confirmExportButton.textContent = "导出至 Excel";
    confirmExportButton.className = "confirm-export-button";
    confirmExportButton.onclick = () => {
        const selectedSemesters = Array.from(semesterCheckboxContainer.querySelectorAll("input[type='checkbox']:checked")).map(c => c.value);
        const cachedData = getCachedData();
        if (cachedData) {
            const filteredGrades = cachedData.allGrades.filter(grade => selectedSemesters.includes(grade.学期));
            exportToExcel(filteredGrades);
        }
        semesterCheckboxContainer.style.display = "none";
    };

    buttonContainer.appendChild(selectAllButton);
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmExportButton);
    semesterCheckboxContainer.appendChild(buttonContainer);

    semesterCheckboxContainer.style.display = "block";
}

async function exportToExcel(filteredGrades) {
    if (!filteredGrades || filteredGrades.length === 0) { alert("没有选中任何成绩数据，已取消导出。"); return; }
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('课程成绩与排名');
        worksheet.addRow(["注意：由于教务系统将同一分数视为同一排名，故您的实际教学班排名可能会低于本数据。"]);
        worksheet.mergeCells('A1:H1');
        worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFF0000' } };
        worksheet.getRow(1).alignment = { horizontal: 'left', vertical: 'middle' };
        const header = ['课程ID', '课程代码', '课程名称', '学分', '成绩', '绩点', '教学班排名', '学期'];
        worksheet.addRow(header);
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };
        filteredGrades.forEach((grade) => {
            worksheet.addRow([ grade['课程ID'], grade['课程代码'], grade['课程名称'], grade['学分'], grade['成绩'], grade['绩点'], grade['教学班排名'], grade['学期'] ]);
        });
        worksheet.columns = [ { width: 10 }, { width: 12 }, { width: 35 }, { width: 7 }, { width: 7 }, { width: 7 }, { width: 12 }, { width: 22 } ];
        for (let i = 3; i <= worksheet.rowCount; i++) { worksheet.getRow(i).alignment = { horizontal: 'center', vertical: 'middle' }; }
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, '课程成绩与排名.xlsx');
    } catch (error) { Logger.error('2.2', 'Excel生成失败', error); alert("导出Excel文件时发生错误，请查看控制台了解详情。"); }
}

// ----------------- 2.3 GPA分析 -----------------

function calculateAndDisplayGPA(data) {
    Logger.log("2.3", "开始进行GPA及加权成绩分析...");
    const { allGrades, gpaRankData } = data;
    if (!allGrades || allGrades.length === 0) { alert("没有可供分析的成绩数据。"); return; }

    const chineseGradeMap = { '优秀': 4.0, '良好': 3.0, '中等': 2.0, '及格': 1.3, '不及格': 0.0, '通过': null, '不通过': 0.0 };
    const stuckGradesMap = { 94: 4.1, 89: 3.9, 84: 3.7, 80: 3.3, 77: 2.7, 74: 2.3, 71: 2.0, 67: 2.0, 63: 1.7, 59: 1.3 };
    const validGradesForGpa = [];
    let totalScoreCreditsNumericOnly = 0, totalCreditsNumericOnly = 0;
    let totalScoreCreditsWithMapping = 0, totalCreditsWithMapping = 0;

    allGrades.forEach(grade => {
        const credits = parseFloat(grade['学分']); const score = grade['成绩']; let gp = parseFloat(grade['绩点']);
        if (isNaN(credits) || credits <= 0 || grade['绩点'] === null || isNaN(gp)) return;
        let finalGp = gp;
        if (typeof score === 'string' && chineseGradeMap.hasOwnProperty(score)) { const mappedGp = chineseGradeMap[score]; if (mappedGp === null) return; finalGp = mappedGp; }
        validGradesForGpa.push({ ...grade, '学分': credits, '成绩': score, '绩点': finalGp });
        const numericScore = parseFloat(score);
        if (!isNaN(numericScore)) { totalScoreCreditsNumericOnly += numericScore * credits; totalCreditsNumericOnly += credits; }
        if (!isNaN(numericScore)) { totalScoreCreditsWithMapping += numericScore * credits; totalCreditsWithMapping += credits; } else if (typeof score === 'string' && GRADE_MAPPING_CONFIG.hasOwnProperty(score)) { totalScoreCreditsWithMapping += GRADE_MAPPING_CONFIG[score] * credits; totalCreditsWithMapping += credits; }
    });

    const weightedScoreNumeric = totalCreditsNumericOnly > 0 ? (totalScoreCreditsNumericOnly / totalCreditsNumericOnly) : 0;
    const weightedScoreWithMapping = totalCreditsWithMapping > 0 ? (totalScoreCreditsWithMapping / totalCreditsWithMapping) : 0;
    if (validGradesForGpa.length === 0) { alert("未找到可用于计算GPA的有效课程成绩。"); return; }

    const totalCreditPoints = validGradesForGpa.reduce((sum, g) => sum + (g['绩点'] * g['学分']), 0);
    const totalCredits = validGradesForGpa.reduce((sum, g) => sum + g['学分'], 0);
    const gpa = totalCredits > 0 ? (totalCreditPoints / totalCredits) : 0;
    const stuckCourses = validGradesForGpa.filter(g => stuckGradesMap.hasOwnProperty(parseFloat(g['成绩'])));

    let reportData = { gpa: gpa.toFixed(4), totalCredits: totalCredits.toFixed(2), totalCreditPoints: totalCreditPoints.toFixed(4), courseCount: validGradesForGpa.length, hasStuckCourses: stuckCourses.length > 0, weightedScoreNumeric: weightedScoreNumeric.toFixed(4), weightedScoreWithMapping: weightedScoreWithMapping.toFixed(4), gpaRankData: gpaRankData };
    if (reportData.hasStuckCourses) {
        const stuckCoursesCredits = stuckCourses.reduce((sum, c) => sum + c['学分'], 0);
        let hypotheticalTotalCreditPoints = validGradesForGpa.reduce((sum, g) => { const scoreNum = parseFloat(g['成绩']); return sum + ((stuckGradesMap[scoreNum] || g['绩点']) * g['学分']); }, 0);
        const hypotheticalGpa = totalCredits > 0 ? (hypotheticalTotalCreditPoints / totalCredits) : 0;
        Object.assign(reportData, { stuckCoursesCount: stuckCourses.length, stuckCoursesCredits: stuckCoursesCredits.toFixed(2), stuckCoursesList: stuckCourses, hypotheticalGpa: hypotheticalGpa.toFixed(4), hypotheticalTotalCreditPoints: hypotheticalTotalCreditPoints.toFixed(4) });
    }
    showGpaReportModal(reportData);
}

function showGpaReportModal(reportData) {
    const existingOverlay = document.querySelector('.gpa-report-overlay'); if (existingOverlay) existingOverlay.remove();
    const styleId = 'gpa-report-modal-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style"); style.id = styleId;
        style.textContent = `
            .gpa-report-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10005; display: flex; align-items: center; justify-content: center; }
            .gpa-report-modal { background-color: #fff; border-radius: 8px; padding: 25px; width: 90%; max-width: 700px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; max-height: 85vh; overflow-y: auto; position: relative; }
            .gpa-report-modal h2 { margin-top: 0; font-size: 22px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .gpa-report-modal h3 { margin-top: 20px; font-size: 18px; color: #007bff; margin-bottom: 10px; border-left: 4px solid #007bff; padding-left: 8px; }
            .gpa-report-modal p, .gpa-report-modal li { font-size: 15px; line-height: 1.8; color: #000 !important; }
            .gpa-report-modal strong { color: #000; }
            .gpa-report-modal .close-btn { position: absolute; top: 15px; right: 20px; font-size: 28px; color: #aaa; background: none; border: none; cursor: pointer; line-height: 1; padding: 0; }
            .gpa-report-modal .close-btn:hover { color: #000; }
            .gpa-report-modal .disclaimer { font-size: 12px; color: #999; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
            .gpa-report-modal ul { padding-left: 20px; margin: 10px 0; }
            .gpa-report-modal .prediction-module { padding-top: 15px; }
            .gpa-report-modal .input-group { display: flex; align-items: center; margin-bottom: 10px; }
            .gpa-report-modal .input-group label { width: 180px; font-size: 14px; flex-shrink: 0; }
            .gpa-report-modal .input-group input { flex-grow: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;}
            .gpa-report-modal .calculate-btn { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 15px; margin-top: 5px; }
            .gpa-report-modal .calculate-btn:hover { background-color: #218838; }
            .gpa-report-modal .prediction-result { margin-top: 12px; font-weight: bold; text-align: center; font-size: 16px; min-height: 24px; }
            .gpa-report-modal details { border: 1px solid #eee; border-radius: 4px; margin-top: 20px; background-color: #f9f9f9; }
            .gpa-report-modal summary { padding: 12px 15px; font-weight: bold; font-size: 18px; color: #555; cursor: pointer; list-style: none; position: relative; outline: none; }
            .gpa-report-modal details.stuck-analysis-section > summary { color: #555; }
            .gpa-report-modal summary::-webkit-details-marker { display: none; }
            .gpa-report-modal summary::before { content: '▶'; margin-right: 10px; font-size: 14px; display: inline-block; transition: transform 0.2s; }
            .gpa-report-modal details[open] > summary::before { transform: rotate(90deg); }
            .gpa-report-modal .details-content { padding: 0 15px 15px 15px; border-top: 1px solid #eee; }
            .gpa-report-modal .tooltip-q { display: inline-block; width: 16px; height: 16px; border-radius: 50%; background-color: #a0a0a0; color: white; text-align: center; font-size: 12px; line-height: 16px; font-weight: bold; cursor: help; margin-left: 5px; vertical-align: middle; position: relative; }
            .gpa-report-modal .tooltip-q:hover::after { content: attr(data-gm-tooltip); position: absolute; left: 50%; bottom: 120%; transform: translateX(-50%); background-color: #333; color: #fff; padding: 8px 12px; border-radius: 5px; font-size: 13px; font-weight: normal; white-space: pre-line; z-index: 10; box-shadow: 0 2px 5px rgba(0,0,0,0.2); width: max-content; max-width: 280px; }
        `;
        document.head.appendChild(style);
    }
    const mappingConfigString = Object.entries(GRADE_MAPPING_CONFIG).map(([key, value]) => `${key}: ${value}`).join(', ');
    const tooltipTextWithMapping = `使用百分制成绩和中文等级制分数进行计算\n您可以在脚本最上面配置参数，当前参数：\n${mappingConfigString}。`;
    const overlay = document.createElement('div'); overlay.className = 'gpa-report-overlay';
    const modal = document.createElement('div'); modal.className = 'gpa-report-modal';
    let contentHTML = `<button class="close-btn" title="关闭">&times;</button><h2>GPA综合分析报告</h2><div class="current-gpa-module"><h3>当前学业总览</h3><p><strong>GPA：</strong> <strong>${reportData.gpa}</strong><br><strong>专业排名：</strong> ${reportData.gpaRankData.rank ?? '无数据'}<br><strong>前一名GPA：</strong> ${reportData.gpaRankData.beforeRankGpa ?? '无数据'}<br><strong>后一名GPA：</strong> ${reportData.gpaRankData.afterRankGpa ?? '无数据'}<br><strong>纳入GPA计算课程数：</strong> ${reportData.courseCount} 门<br><strong>总学分：</strong> ${reportData.totalCredits}<br><strong>总学分绩点：</strong> ${reportData.totalCreditPoints}<br><strong>加权百分制成绩：</strong> <strong>${reportData.weightedScoreNumeric}</strong> <span class="tooltip-q" data-gm-tooltip="仅计算百分制成绩，不含中文等级制成绩和PNP课程。">?</span><br><strong>加权百分制成绩 (含中文等级制成绩)：</strong> <strong>${reportData.weightedScoreWithMapping}</strong> <span class="tooltip-q" data-gm-tooltip="${tooltipTextWithMapping}">?</span></p></div><details><summary>预测GPA计算</summary><div class="prediction-module details-content"><div class="input-group"><label for="next-credits-a">下学期课程总学分:</label><input type="number" id="next-credits-a" placeholder="例如: 25"></div><div class="input-group"><label for="next-gpa-a">下学期预期平均GPA:</label><input type="number" id="next-gpa-a" step="0.01" placeholder="1.0 ~ 4.1"></div><button id="calculate-prediction-btn-a" class="calculate-btn">计算</button><p id="predicted-gpa-result-a" class="prediction-result"></p></div></details><details><summary>达成目标GPA所需均绩计算</summary><div class="prediction-module details-content"><div class="input-group"><label for="target-gpa-b">期望达到的总GPA:</label><input type="number" id="target-gpa-b" step="0.01" placeholder="例如: 3.80"></div><div class="input-group"><label for="next-credits-b">下学期课程总学分:</label><input type="number" id="next-credits-b" placeholder="例如: 20"></div><button id="calculate-target-btn-b" class="calculate-btn">计算</button><p id="target-gpa-result-b" class="prediction-result"></p></div></details><details class="stuck-analysis-section"><summary>卡绩分析</summary><div class="details-content">`;
    if (reportData.hasStuckCourses) {
        let stuckCoursesListHTML = '<ul>';
        reportData.stuckCoursesList.forEach(course => { stuckCoursesListHTML += `<li>${course['课程名称']} (成绩: ${course['成绩']}, 绩点: ${course['绩点']})</li>`; });
        stuckCoursesListHTML += '</ul>';
        contentHTML += `<p>发现 <strong>${reportData.stuckCoursesCount} 门</strong>卡绩科目，共计 <strong>${reportData.stuckCoursesCredits}</strong> 学分。</p>${stuckCoursesListHTML}<p>如果这些科目绩点均提高一个等级，您的GPA结果如下：</p><p><strong>总学分绩点：</strong> ${reportData.hypotheticalTotalCreditPoints}<br><strong>加权平均GPA：</strong> <strong style="color: #28a745;">${reportData.hypotheticalGpa}</strong></p>`;
    } else { contentHTML += `<p>恭喜您！当前未发现卡绩科目。</p>`; }
    contentHTML += `</div></details><p class="disclaimer">注意：此结果仅供参考，基于所有已获取的成绩数据计算，并非教务系统官方排名所用GPA。</p>`;
    modal.innerHTML = contentHTML;
    overlay.appendChild(modal); document.body.appendChild(overlay);
    const close = () => document.body.removeChild(overlay); overlay.querySelector('.close-btn').onclick = close; overlay.onclick = (e) => { if (e.target === overlay) close(); };
    const calculateBtnA = document.getElementById('calculate-prediction-btn-a');
    const nextCreditsInputA = document.getElementById('next-credits-a');
    const nextGpaInputA = document.getElementById('next-gpa-a');
    const resultDisplayA = document.getElementById('predicted-gpa-result-a');
    calculateBtnA.addEventListener('click', () => {
        const nextCredits = parseFloat(nextCreditsInputA.value); const nextGpa = parseFloat(nextGpaInputA.value);
        if (isNaN(nextCredits) || nextCredits <= 0 || isNaN(nextGpa) || nextGpa < 1.0 || nextGpa > 4.1) { resultDisplayA.textContent = '请输入有效的学分与GPA，且GPA应在1.0-4.1之间。'; return; }
        const currentTotalCredits = parseFloat(reportData.totalCredits); const currentTotalCreditPoints = parseFloat(reportData.totalCreditPoints);
        const predictedOverallGPA = (currentTotalCreditPoints + (nextCredits * nextGpa)) / (currentTotalCredits + nextCredits);
        resultDisplayA.innerHTML = `预测总GPA为: <span style="color: green; font-size: 18px;">${predictedOverallGPA.toFixed(4)}</span>`;
    });
    const calculateBtnB = document.getElementById('calculate-target-btn-b');
    const targetGpaInputB = document.getElementById('target-gpa-b');
    const nextCreditsInputB = document.getElementById('next-credits-b');
    const resultDisplayB = document.getElementById('target-gpa-result-b');
    calculateBtnB.addEventListener('click', () => {
        const targetGpa = parseFloat(targetGpaInputB.value); const nextCredits = parseFloat(nextCreditsInputB.value);
        if (isNaN(targetGpa) || targetGpa < 1.0 || targetGpa > 4.1 || isNaN(nextCredits) || nextCredits <= 0) { resultDisplayB.textContent = '请输入有效的学分与期望GPA。'; resultDisplayB.style.color = 'red'; return; }
        const currentTotalCredits = parseFloat(reportData.totalCredits); const currentTotalCreditPoints = parseFloat(reportData.totalCreditPoints);
        const requiredCreditPointsNext = (targetGpa * (currentTotalCredits + nextCredits)) - currentTotalCreditPoints;
        const requiredGpaNext = requiredCreditPointsNext / nextCredits;
        let resultHTML = `下学期需达到均绩: <span style="font-size: 18px; color: ${requiredGpaNext > 4.1 ? 'red' : 'green'};">${requiredGpaNext.toFixed(4)}</span>`;
        if (requiredGpaNext > 4.1) { resultHTML += '<br><span style="color: red; font-size: 13px;">(目标过高，无法实现)</span>'; } else if (requiredGpaNext < 1.0) { resultHTML += '<br><span style="color: #6c757d; font-size: 13px;">(目标低于最低绩点要求)</span>'; }
        resultDisplayB.innerHTML = resultHTML;
    });
}

// ----------------- 2.4 学生画像增强 -----------------

function precomputeAllWeightedScores(allGrades) {
    const scoresBySemester = {}; const gradesBySemester = {};
    allGrades.forEach(grade => { const semester = grade['学期']; if (!gradesBySemester[semester]) gradesBySemester[semester] = []; gradesBySemester[semester].push(grade); });
    const calculate = (grades) => {
        let totalScoreCredits = 0, totalCredits = 0;
        grades.forEach(grade => {
            const credits = parseFloat(grade['学分']); if (isNaN(credits) || credits <= 0) return;
            const numericScore = parseFloat(grade['成绩']);
            if (!isNaN(numericScore)) { totalScoreCredits += numericScore * credits; totalCredits += credits; }
        });
        return totalCredits > 0 ? (totalScoreCredits / totalCredits).toFixed(4) : 'N/A';
    };
    for (const semesterName in gradesBySemester) { scoresBySemester[semesterName] = { weightedScore: calculate(gradesBySemester[semesterName]), tooltipText: `当前学期加权百分制成绩\n(不含PNP和中文等级制成绩)` }; }
    scoresBySemester['全部'] = { weightedScore: calculate(allGrades), tooltipText: `所有学期加权百分制成绩\n(不含PNP和中文等级制成绩)` };
    return scoresBySemester;
}

function setupSemesterChangeObserver(weightedScores) {
    const targetNode = document.querySelector('.myScore .el-select .el-input__inner');
    if (!targetNode || targetNode.dataset.gmListenerAttached) return;
    let lastValue = targetNode.value;
    setInterval(() => {
        if (!ConfigManager.enablePortraitEnhancement || !document.body.contains(targetNode)) return;
        const currentValue = targetNode.value;
        if (currentValue !== lastValue) {
            lastValue = currentValue;
            const scoreTile = document.getElementById('gm-weighted-score-tile');
            if (scoreTile) {
                const semesterKey = currentValue || "全部";
                const scoreData = weightedScores[semesterKey] || { weightedScore: 'N/A' };
                const scoreSpan = scoreTile.querySelector('.score');
                if (scoreSpan) scoreSpan.textContent = scoreData.weightedScore;
            }
        }
    }, 200);
    targetNode.dataset.gmListenerAttached = 'true';
}

function injectTooltipStylesForPortrait() {
    const styleId = 'gm-tooltip-styles-portrait'; if (document.getElementById(styleId)) return;
    const style = document.createElement('style'); style.id = styleId;
    style.textContent = `
        .gm-tooltip-trigger { position: relative; cursor: help; font-family: "iconfont" !important; font-size: 14px; font-style: normal; }
        .gm-tooltip-trigger:hover::after { content: attr(data-gm-tooltip); position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%); background-color: #303133; color: #fff; padding: 8px 12px; border-radius: 4px; font-size: 12px; line-height: 1.4; white-space: pre-line; z-index: 10001; display: inline-block; width: max-content; max-width: 280px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); pointer-events: none; }
    `;
    document.head.appendChild(style);
}

function updateSummaryTilesForPortrait(data, scoreContentElement, weightedScores) {
    if (!scoreContentElement) return;
    const infoDivs = Array.from(scoreContentElement.querySelectorAll('.info'));
    const avgScoreLabel = infoDivs.find(el => el.textContent.includes("平均分") || el.textContent.includes("加权分") || el.dataset.originalHtml);
    const majorRankTileId = 'gm-major-rank-tile';
    const majorRankTile = document.getElementById(majorRankTileId);

    if (!ConfigManager.enablePortraitEnhancement) {
        if (avgScoreLabel && avgScoreLabel.dataset.originalHtml) {
            avgScoreLabel.innerHTML = avgScoreLabel.dataset.originalHtml;
            delete avgScoreLabel.dataset.originalHtml;
            const avgScoreTile = avgScoreLabel.closest('.score-item');
            if (avgScoreTile) avgScoreTile.removeAttribute('id');
        }
        if (majorRankTile) majorRankTile.remove();
        scoreContentElement.removeAttribute('data-gm-enhanced-summary');
        return;
    }

    if (!avgScoreLabel || (scoreContentElement.dataset.gmEnhancedSummary === 'true' && document.getElementById(majorRankTileId))) return;

    const { gpaRankData } = data;
    const avgScoreTile = avgScoreLabel.closest('.score-item');
    if (avgScoreTile) {
        avgScoreTile.id = 'gm-weighted-score-tile';
        if (!avgScoreLabel.dataset.originalHtml) avgScoreLabel.dataset.originalHtml = avgScoreLabel.innerHTML;
        const initialScoreData = weightedScores['全部'] || { weightedScore: 'N/A', tooltipText: '' };
        avgScoreLabel.innerHTML = `加权百分制分数 <i class="iconfont icon-bangzhu gm-tooltip-trigger" data-gm-tooltip="${initialScoreData.tooltipText}"></i>`;
        const scoreValDiv = avgScoreTile.querySelector('.score');
        if (scoreValDiv) scoreValDiv.textContent = initialScoreData.weightedScore;
    }

    if (!document.getElementById(majorRankTileId)) {
        const rankValue = gpaRankData?.rank ?? '无数据';
        const rankDiv = document.createElement('li');
        rankDiv.id = majorRankTileId;
        rankDiv.className = 'score-item';
        rankDiv.style.background = '#17a2b8';
        rankDiv.innerHTML = `<div class="icon-img"><i class="iconfont icon-paiming2"></i></div><div class="score-info"><div class="score">${rankValue}</div><div class="info">专业排名 <i class="iconfont icon-bangzhu gm-tooltip-trigger" data-gm-tooltip="排名数据来自教务系统\n若无则显示'无数据'"></i></div>`;
        scoreContentElement.appendChild(rankDiv);
    }
    scoreContentElement.dataset.gmEnhancedSummary = 'true';
}

function getPassStatus(score) {
    const passingGrades = ['优秀', '良好', '中等', '及格', '通过', 'P'];
    const failingGrades = ['不及格', '不通过'];
    if (passingGrades.includes(score)) return '<span class="value">通过</span>';
    if (failingGrades.includes(score)) return '<span class="value" style="color: #F56C6C">不通过</span>';
    const numericScore = parseFloat(score);
    if (!isNaN(numericScore)) return numericScore >= 60 ? '<span class="value">通过</span>' : '<span class="value" style="color: #F56C6C">不通过</span>';
    return '';
}

function createEnhancedOutOfPlanTableForPortrait(data, originalTableContainer) {
    const enhancedId = 'gm-enhanced-table-wrapper';
    let enhancedContainer = document.getElementById(enhancedId);

    if (!ConfigManager.enablePortraitEnhancement) {
        if (enhancedContainer) enhancedContainer.remove();
        originalTableContainer.style.display = '';
        originalTableContainer.removeAttribute('data-gm-enhanced');
        return;
    }

    if (originalTableContainer.dataset.gmEnhanced === 'true' && enhancedContainer) return;

    const outOfPlanCourseCodes = new Set();
    const rows = originalTableContainer.querySelectorAll('.el-table__body-wrapper tbody tr');
    const headerCells = Array.from(originalTableContainer.querySelectorAll('.el-table__header-wrapper th'));
    let codeIndex = headerCells.findIndex(th => th.textContent.trim().includes('课程代码'));
    if (codeIndex === -1) return;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[codeIndex]) outOfPlanCourseCodes.add(cells[codeIndex].textContent.trim());
    });

    if (outOfPlanCourseCodes.size === 0) return;

    const outOfPlanGrades = data.allGrades.filter(grade => outOfPlanCourseCodes.has(grade['课程代码']));
    const classRankMap = new Map(data.allGrades.map(g => [g['课程代码'], g['教学班排名']]));

    const totalCredits = outOfPlanGrades.reduce((sum, g) => sum + parseFloat(g['学分'] || 0), 0);
    const passedCredits = outOfPlanGrades.reduce((sum, g) => {
        const statusHtml = getPassStatus(g['成绩']);
        return (statusHtml.includes('通过') && !statusHtml.includes('不')) ? sum + parseFloat(g['学分'] || 0) : sum;
    }, 0);
    const failedCredits = totalCredits - passedCredits;

    const originalHandler = originalTableContainer.querySelector('.node-handler');
    let paddingLeft = '20px';
    if (originalHandler && originalHandler.style.paddingLeft) paddingLeft = originalHandler.style.paddingLeft;

    if (!enhancedContainer) {
        enhancedContainer = document.createElement('div');
        enhancedContainer.id = enhancedId;
        enhancedContainer.className = 'node-wrapper courseTreeNode marginBottom';
        originalTableContainer.insertAdjacentElement('afterend', enhancedContainer);
    }

    const colGroupHTML = `<colgroup><col width="48"><col width="200"><col width="100"><col width="120"><col width="80"><col width="60"><col width="60"><col width="60"><col width="100"><col width="80"></colgroup>`;
    const headerHTML = `<div class="el-table__header-wrapper"><table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">${colGroupHTML}<thead class="has-gutter"><tr class="table-header"><th class="is-leaf" width="50"><div class="cell">序号</div></th><th class="is-leaf"><div class="cell">课程名称</div></th><th class="is-leaf" width="100"><div class="cell">课程代码</div></th><th class="is-leaf" width="120"><div class="cell">学年学期</div></th><th class="is-leaf" width="80"><div class="cell">是否必修</div></th><th class="is-leaf" width="60"><div class="cell">学分</div></th><th class="is-leaf" width="60"><div class="cell">成绩</div></th><th class="is-leaf" width="60"><div class="cell">绩点</div></th><th class="is-leaf" width="100"><div class="cell">教学班排名</div></th><th class="is-leaf" width="80"><div class="cell">是否通过</div></th></tr></thead></table></div>`;

    const tableBodyRows = outOfPlanGrades.map((grade, index) => {
        const score = grade['成绩'];
        const isFail = parseFloat(score) < 60 && !isNaN(parseFloat(score));
        const scoreStyle = isFail ? 'color: #F56C6C; font-weight: bold;' : '';
        const passStatus = getPassStatus(score);
        return `<tr class="el-table__row"><td class="cell-style"><div class="cell">${index + 1}</div></td><td class="cell-style"><div class="cell el-tooltip"><span class="value">${grade['课程名称'] || ''}</span></div></td><td class="cell-style"><div class="cell el-tooltip">${grade['课程代码'] || ''}</div></td><td class="cell-style"><div class="cell el-tooltip">${grade['学期'] || ''}</div></td><td class="cell-style"><div class="cell el-tooltip"><span class="value">${grade['是否必修'] ? '是' : '否'}</span></div></td><td class="cell-style"><div class="cell el-tooltip">${grade['学分'] || ''}</div></td><td class="cell-style"><div class="cell el-tooltip" style="${scoreStyle}">${grade['成绩'] || ''}</div></td><td class="cell-style"><div class="cell el-tooltip">${grade['绩点'] ?? ''}</div></td><td class="cell-style"><div class="cell el-tooltip"><span class="value">${classRankMap.get(grade['课程代码']) || '-'}</span></div></td><td class="cell-style"><div class="cell el-tooltip">${passStatus}</div></td></tr>`;
    }).join('');//`

    const bodyHTML = `<div class="el-table__body-wrapper is-scrolling-left"><table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">${colGroupHTML}<tbody>${tableBodyRows}</tbody></table></div>`;

    enhancedContainer.innerHTML = `<div class="node-handler background" style="padding-left: ${paddingLeft}; cursor: pointer;"><div class="arrow up"></div><div class="title"><div class="course-name">计划外课程</div><div class="require-item"><span class="score">学分：</span><span class="con">共 ${totalCredits} | 已通过 ${passedCredits} | 未通过 </span><span class="unpassed">${failedCredits}</span></div></div></div><div class="node-child-wrapper"><div class="node-child"><div class="child"><div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition el-table--small" style="width: 100%;">${headerHTML}${bodyHTML}</div></div></div></div>`;

    const handler = enhancedContainer.querySelector('.node-handler');
    const wrapper = enhancedContainer.querySelector('.node-child-wrapper');
    const arrow = enhancedContainer.querySelector('.arrow');
    handler.addEventListener('click', () => {
        if (wrapper.classList.contains('none')) { wrapper.classList.remove('none'); arrow.classList.add('up'); }
        else { wrapper.classList.add('none'); arrow.classList.remove('up'); }
    });

    originalTableContainer.style.display = 'none';
    originalTableContainer.dataset.gmEnhanced = 'true';
}

function applyPortraitSettings() {
    if (!window.location.href.includes('student-portrait')) return;
    const cachedData = getCachedData();
    if (!cachedData) return;
    const weightedScores = precomputeAllWeightedScores(cachedData.allGrades);
    const scoreContent = document.querySelector(".score-content");
    if (scoreContent) updateSummaryTilesForPortrait(cachedData, scoreContent, weightedScores);
    const outOfPlanTable = document.querySelector('.outPlanTable');
    if (outOfPlanTable) createEnhancedOutOfPlanTableForPortrait(cachedData, outOfPlanTable);
}

async function enhancePortraitPage() {
    while (!document.body || !document.querySelector(".score-content")) { await new Promise(resolve => setTimeout(resolve, 50)); }
    Logger.log("2.4", "脚本已在学生画像页激活");
    injectTooltipStylesForPortrait();

    let data = getCachedData();
    if (!data) {
        try { data = await fetchAllDataAndCache(); }
        catch (err) { Logger.error("2.4", "获取数据失败:", err); return; }
    }
    const weightedScores = precomputeAllWeightedScores(data.allGrades);

    applyPortraitSettings();

    const observer = new MutationObserver((mutations, obs) => {
        const scoreContent = document.querySelector(".score-content");
        const outOfPlanTable = document.querySelector('.outPlanTable');
        const isEnabled = ConfigManager.enablePortraitEnhancement;

        if (scoreContent) {
             const isEnhanced = scoreContent.hasAttribute('data-gm-enhanced-summary');
             if ((isEnabled && !isEnhanced) || (!isEnabled && isEnhanced)) {
                 updateSummaryTilesForPortrait(data, scoreContent, weightedScores);
                 if (isEnabled) setupSemesterChangeObserver(weightedScores);
             }
        }
        if (outOfPlanTable) {
            const isTableEnhanced = outOfPlanTable.hasAttribute('data-gm-enhanced');
            if (outOfPlanTable.querySelector('.el-table__body-wrapper tbody tr')) {
                 if ((isEnabled && !isTableEnhanced) || (!isEnabled && isTableEnhanced)) {
                     createEnhancedOutOfPlanTableForPortrait(data, outOfPlanTable);
                 }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}


// =-=-=-=-=-=-=-=-=-=-=-=-= 2.5 全校开课查询页选课记录 =-=-=-=-=-=-=-=-=-=-=-=-=

/**
 * 全校开课查询页面增强模块
 * 包含：历史记录显示、控制面板UI、自动翻页同步逻辑
 */
const LessonSearchEnhancer = {
    // 配置常量
    CONFIG: {
        HISTORY_KEY: 'course_enrollment_history_auto_sync',
        PAGE_SIZE_BTN: '.page-config .dropdown-toggle',
        PAGE_SIZE_1000: '.page-config .dropdown-menu a[value="1000"]',
        NEXT_BTN: '.semi-auto-table-paginator .fa-angle-right',
        LOADER: 'td.dataTables_empty',
        TABLE_ROWS: '#table tbody tr'
    },

    init() {
        // 1. 路径检查
        if (!window.location.href.includes('/student/for-std/lesson-search')) return;

        // 2. 强制等待分页栏(.page-config)出现
        // 如果页面核心组件没加载出来，每300ms重试一次，直到出现为止
        if (!document.querySelector('.page-config') || !document.querySelector('#table')) {
            setTimeout(() => this.init(), 300);
            return;
        }

        Logger.log("2.5", "初始化选课记录模块...");

        // 3. 初始化UI
        this.injectControlPanel();
        this.renderHistoryTags();

        // 4. 自动同步触发逻辑
        // 必须在页面完全就绪后才消耗掉 sessionStorage 的标记
        if (sessionStorage.getItem('nwpu_course_sync_trigger') === 'true') {

            // 检查：如果表格还在转圈加载中(dataTables_empty)，则继续等待，暂不执行
            if (document.querySelector('td.dataTables_empty')) {
                setTimeout(() => this.init(), 500);
                return;
            }

            console.log("[NWPU-Enhanced] 页面就绪，准备执行自动同步...");
            sessionStorage.removeItem('nwpu_course_sync_trigger'); // 消耗标记

            // 延迟 1秒 确保视觉上页面稳定，然后启动
            setTimeout(() => {
                this.startSyncProcess(true);
            }, 1000);
        }

        // 5. 启动观察者
        const observer = new MutationObserver(() => this.renderHistoryTags());
        const target = document.querySelector('#table') || document.body;
        observer.observe(target, { childList: true, subtree: true });
    },

    // --- 1. UI: 注入右侧控制面板 ---
    injectControlPanel() {
        if (document.getElementById('gm-lesson-helper-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'gm-lesson-helper-panel';
        panel.innerHTML = `
            <div style="background:#f8f9fa; border-bottom:1px solid #dee2e6; padding:10px; border-radius:8px 8px 0 0; font-weight:bold; position:relative; cursor:move; user-select:none;" id="gm-panel-header">
                选课助手
                <span id="gm-panel-close" style="position:absolute; right:10px; color:#999; cursor:pointer; font-size:18px; line-height:1; font-weight:bold;" title="关闭面板 (刷新页面可恢复)">×</span>
            </div>
            <div style="padding:15px;">
                <button id="gm-btn-sync-start" style="width:100%; padding:8px; background:#007bff; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; transition: background 0.2s;">存储当前学期课程信息</button>
                <button id="gm-btn-clear-hist" style="width:100%; padding:8px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer; margin-top:10px; transition: background 0.2s;">清除所有记录</button>
                <div style="margin-top:12px; font-size:12px; color:#666; line-height:1.5;">
                    建议在每轮选课开始前执行一次。
                </div>
            </div>
        `;
        panel.style.cssText = `position:fixed; top:120px; right:30px; z-index:99999; background:white; border:1px solid #ccc; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); width:240px; font-size:14px; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`;
        document.body.appendChild(panel);

        // 绑定事件
        const btnSync = document.getElementById('gm-btn-sync-start');
        const btnClear = document.getElementById('gm-btn-clear-hist');
        const btnClose = document.getElementById('gm-panel-close'); // 获取关闭按钮

        // 关闭功能
        btnClose.onclick = () => {
            panel.style.display = 'none';
        };

        btnSync.onclick = () => this.startSyncProcess(false);
        btnSync.onmouseover = () => btnSync.style.background = '#0056b3';
        btnSync.onmouseout = () => btnSync.style.background = '#007bff';

        btnClear.onclick = () => {
            if(confirm('确定清空所有本地存储的课程历史数据吗？')) {
                GM_setValue(this.CONFIG.HISTORY_KEY, '{}');
                alert('已清空。');
                this.renderHistoryTags();
            }
        };
        btnClear.onmouseover = () => btnClear.style.background = '#c82333';
        btnClear.onmouseout = () => btnClear.style.background = '#dc3545';

        // 拖拽
        const header = document.getElementById('gm-panel-header');
        let isDragging = false, startX, startY, initialLeft, initialTop;
        header.onmousedown = (e) => {
            if(e.target === btnClose) return; // 点击关闭时不触发拖拽
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = panel.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
        };
        document.onmousemove = (e) => {
            if(!isDragging) return;
            e.preventDefault();
            panel.style.left = (initialLeft + e.clientX - startX) + 'px';
            panel.style.top = (initialTop + e.clientY - startY) + 'px';
            panel.style.right = 'auto';
        };
        document.onmouseup = () => isDragging = false;
    },

    // --- 2. Core: 同步逻辑 ---
    async startSyncProcess(isAuto) {
        if (!isAuto && !confirm('即将自动操作并开始执行抓取。\n过程可能需要几十秒，请勿关闭页面。')) return;

        const overlay = this.showOverlay();
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        const waitForLoad = async () => {
            let limit = 0;
            while(!document.querySelector(this.CONFIG.LOADER) && limit < 20) { await sleep(100); limit++; }
            limit = 0;
            while(document.querySelector(this.CONFIG.LOADER) && limit < 300) { await sleep(100); limit++; }
            await sleep(300);
        };

        try {
            const sizeBtn = document.querySelector(this.CONFIG.PAGE_SIZE_BTN);
            if(sizeBtn) {
                if(!sizeBtn.innerText.includes('1000')) {
                    this.updateOverlayStatus("正在切换每页显示数量...");
                    sizeBtn.click();
                    await sleep(500);
                    const maxOpt = document.querySelector(this.CONFIG.PAGE_SIZE_1000);
                    if(maxOpt) {
                        maxOpt.click();
                        await sleep(500);
                        await waitForLoad();
                    }
                }
            }

            let page = 1;
            let totalScraped = 0;
            this.updateOverlayStatus(`准备开始抓取...`);

            while(true) {
                const count = this.scrapeCurrentPage();
                totalScraped += count;
                this.updateOverlay(totalScraped);

                const nextIcon = document.querySelector(this.CONFIG.NEXT_BTN);
                const nextBtn = nextIcon ? nextIcon.closest('button') : null;

                if (!nextBtn || nextBtn.disabled || nextBtn.classList.contains('disabled')) break;

                nextBtn.click();
                page++;
                await sleep(500);
                await waitForLoad();
            }

            alert(`同步完成！\n\n共存储 ${totalScraped} 条课程数据。\n页面即将刷新以更新状态。`);
            window.location.reload();

        } catch(e) {
            console.error(e);
            alert('同步中断: ' + e.message);
            overlay.remove();
        }
    },

    // --- 3. Helper: 抓取与存储 ---
    scrapeCurrentPage() {
        const rows = document.querySelectorAll(this.CONFIG.TABLE_ROWS);
        const data = [];
        const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });

        rows.forEach(row => {
            if(row.querySelector(this.CONFIG.LOADER)) return;

            const idInput = row.querySelector('input[name="model_id"]');
            if(!idInput) return;
            const id = idInput.value;

            const codeEl = row.querySelector('.lesson-code');
            const nameEl = row.querySelector('.course-name');
            const countSpan = row.querySelector('span[data-original-title="实际/上限人数"]');

            if(countSpan) {
                const match = countSpan.innerText.match(/(\d+)\/(\d+)/);
                if(match) {
                    data.push({
                        id: id,
                        code: codeEl ? codeEl.innerText.trim() : 'N/A',
                        name: nameEl ? nameEl.innerText.trim() : 'N/A',
                        stdCount: parseInt(match[1]),
                        limitCount: parseInt(match[2]),
                        time: timestamp
                    });
                }
            }
        });

        if(data.length > 0) this.saveToHistory(data);
        return data.length;
    },

    saveToHistory(courseData) {
        let history = {};
        try {
            // 尝试解析旧数据
            history = JSON.parse(GM_getValue(this.CONFIG.HISTORY_KEY, '{}'));
        } catch (e) {
            console.warn('[NWPU-Enhanced] 写入时发现历史数据损坏，已自动重置为空');
            history = {}; // 解析失败则重置，防止阻碍新数据写入
        }

        courseData.forEach(c => {
            if(!history[c.id]) history[c.id] = [];
            const records = history[c.id];
            const last = records[records.length-1];
            // 只有当人数发生变化时才记录，节省空间
            if(!last || last.stdCount !== c.stdCount || last.limitCount !== c.limitCount) {
                records.push(c);
            } else {
                last.time = c.time; // 更新最后检测时间
            }
        });

        // 保存回本地
        GM_setValue(this.CONFIG.HISTORY_KEY, JSON.stringify(history));
        // 刷新界面显示
        this.renderHistoryTags();
    },

    // --- 4. UI: 渲染历史标签 ---
    renderHistoryTags() {
        let history = {};
        try {
            history = JSON.parse(GM_getValue(this.CONFIG.HISTORY_KEY, '{}'));
        } catch (e) {
            console.error('[NWPU-Enhanced] 读取历史记录失败（数据格式错误），已跳过渲染', e);
            GM_setValue(this.CONFIG.HISTORY_KEY, '{}');
            return;
        }

        const rows = document.querySelectorAll(this.CONFIG.TABLE_ROWS);

        rows.forEach(row => {
            if(row.dataset.gmProcessed) return;
            const idInput = row.querySelector('input[name="model_id"]');
            if(!idInput) return;

            const records = history[idInput.value];
            if(records && records.length > 0) {
                const last = records[records.length-1];
                const countSpan = Array.from(row.querySelectorAll('span')).find(s => s.getAttribute('data-original-title') === '实际/上限人数');

                if(countSpan && !countSpan.parentNode.querySelector('.gm-hist-tag')) {
                    const tag = document.createElement('span');
                    tag.className = 'gm-hist-tag';
                    const isFull = last.stdCount >= last.limitCount;
                    const bgColor = isFull ? '#fff0f0' : '#e6ffec';
                    const textColor = isFull ? '#d32f2f' : '#1e7e34';

                    tag.style.cssText = `font-size:12px; color:${textColor}; background:${bgColor}; padding:1px 5px; border-radius:3px; margin-left:8px; border:1px solid ${textColor}40;`;
                    tag.innerText = `记录:${last.stdCount}/${last.limitCount}`;
                    tag.title = `上次同步时间: ${last.time}`;
                    countSpan.parentNode.appendChild(tag);
                }
            }
            row.dataset.gmProcessed = 'true';
        });
    },

    showOverlay() {
        const div = document.createElement('div');
        div.id = 'gm-sync-overlay';
        div.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:100000; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center;';
        div.innerHTML = `
            <div style="font-size:24px; font-weight:bold; margin-bottom:15px;">正在同步课程数据...</div>
            <div id="gm-overlay-status" style="font-size:16px; margin-bottom:10px; color:#ddd;">正在初始化...</div>
            <div style="font-size:18px;">已抓取: <span id="gm-sync-count" style="color:#4facfe; font-weight:bold;">0</span> 条</div>
            <div style="margin-top:30px; color:#aaa; font-size:14px;">请勿关闭页面，程序正在自动操作</div>
        `;
        document.body.appendChild(div);
        return div;
    },

    updateOverlay(count) {
        const el = document.getElementById('gm-sync-count');
        if(el) el.innerText = count;
    },

    updateOverlayStatus(text) {
        const el = document.getElementById('gm-overlay-status');
        if(el) el.innerText = text;
    }
};

if (window.location.href.includes('/student/for-std/lesson-search')) {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => LessonSearchEnhancer.init());
    } else {
        LessonSearchEnhancer.init();
    }
}
// =-=-=-=-=-=-=-=-=-=-=-=-= 2.6 课程关注 =-=-=-=-=-=-=-=-=-=-=-=-=

/**
 * 在开课查询页面的表格中注入关注按钮
 */
function injectFollowButtons() {
    if (!ConfigManager.enableCourseWatch) return;

    // --- 1. 初始化弹窗样式 (Toast) ---
    if (!document.getElementById('gm-toast-style')) {
        const style = document.createElement('style');
        style.id = 'gm-toast-style';
        style.textContent = `
            .gm-toast {
                position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8); color: #fff; padding: 12px 24px;
                border-radius: 6px; font-size: 14px; z-index: 99999; font-weight: 500;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2); pointer-events: none;
                opacity: 0; transition: opacity 0.3s, transform 0.3s;
                display: flex; align-items: center; letter-spacing: 0.5px;
            }
            .gm-toast.show { opacity: 1; transform: translateX(-50%) translateY(10px); }
            .gm-toast-icon { margin-right: 10px; font-size: 16px; font-weight: bold; }
        `;
        document.head.appendChild(style);
    }

    const showToast = (message, type = 'success') => {
        const existing = document.querySelector('.gm-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'gm-toast';
        const icon = type === 'success' ? '✔' : '✖';
        const iconColor = type === 'success' ? '#67C23A' : '#F56C6C';
        toast.innerHTML = `<span class="gm-toast-icon" style="color:${iconColor}">${icon}</span><span>${message}</span>`;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
    };

    // --- 2. 获取学期信息 ---
    let currentSemester = "未知学期";
    try {
        const semesterEl = document.querySelector('.selectize-control.semester .item') ||
                           document.querySelector('.semester-name') ||
                           document.querySelector('.selectize-input .item');
        if (semesterEl) {
            currentSemester = semesterEl.innerText.trim();
        }
    } catch(e) { console.warn("无法自动获取学期名称", e); }

    // --- 3. 获取表格容器 ---
    const scrollBodyTable = document.querySelector('.dataTables_scrollBody table#table');
    if (!scrollBodyTable) return;

    const rows = scrollBodyTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.querySelector('.dataTables_empty')) return;

        const firstTd = row.querySelector('td:first-child');
        const checkbox = row.querySelector('input[name="model_id"]');
        if (!firstTd || !checkbox) return;
        if (firstTd.querySelector('.gm-follow-btn')) return;

        // --- 数据提取 ---
        const storageId = checkbox.value;
        const lessonCodeDiv = row.querySelector('.lesson-code');
        const displayCode = lessonCodeDiv ? lessonCodeDiv.innerText.trim() : '未知编号';

        const nameEl = row.querySelector('.course-name a');
        const name = nameEl ? nameEl.innerText.trim() : '未知课程';
        const teacherEl = row.querySelector('.course-teacher');
        const teachers = teacherEl ? teacherEl.innerText.trim() : '';
        const creditEl = row.children[3];
        const credits = creditEl ? creditEl.innerText.trim() : '';
        const placeEl = row.querySelector('.course-datetime-place');
        const timeAndPlace = placeEl ? placeEl.innerText.trim() : '';

        // --- 样式布局 ---
        firstTd.style.display = 'flex';
        firstTd.style.flexDirection = 'column';
        firstTd.style.alignItems = 'center';
        firstTd.style.justifyContent = 'center';
        firstTd.style.padding = '8px 0';
        firstTd.style.height = '100%';
        checkbox.style.margin = '0';

        // --- 创建按钮 ---
        const btn = document.createElement('div');
        btn.className = 'gm-follow-btn';
        btn.innerHTML = '❤';
        btn.style.cssText = `cursor: pointer; font-size: 20px; margin-top: 4px; line-height: 1; user-select: none; transition: all 0.2s; font-family: sans-serif;`;

        const updateState = () => {
            if (FollowManager.has(storageId)) {
                btn.title = '点击取消关注';
                btn.style.color = '#f56c6c';
                btn.style.textShadow = '0 2px 5px rgba(245, 108, 108, 0.3)';
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1.1)';
            } else {
                btn.title = '点击关注课程';
                btn.style.color = '#dcdfe6';
                btn.style.textShadow = 'none';
                btn.style.opacity = '1';
                btn.style.transform = 'scale(1)';
            }
        };
        updateState();

        btn.onmouseenter = () => { if (!FollowManager.has(storageId)) { btn.style.color = '#fbc4c4'; btn.style.transform = 'scale(1.1)'; } };
        btn.onmouseleave = () => updateState();

        btn.onclick = (e) => {
            e.stopPropagation(); e.preventDefault();
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => updateState(), 150);

            if (FollowManager.has(storageId)) {
                FollowManager.remove(storageId);
                showToast(`已取消关注 ${displayCode}`, 'cancel');
            } else {
                FollowManager.add(storageId, {
                    id: storageId,
                    code: displayCode,
                    name, teachers, credits, timeAndPlace,
                    semester: currentSemester, // 【新增】保存当前学期
                    addedTime: new Date().toLocaleString()
                });
                showToast(`已加入关注列表 ${displayCode}`, 'success');
            }
        };
        firstTd.appendChild(btn);
    });
}

/**
 * 启动开课查询页面的监听器
 */
function initLessonSearchPage() {
    if (!ConfigManager.enableCourseWatch) return;
    Logger.log("2.6", "已进入全校开课查询页面 (Iframe)");

    // 初始执行一次
    injectFollowButtons();

    // 使用 MutationObserver 监听表格变化（翻页、搜索时触发）
    const observer = new MutationObserver((mutations) => {
        // 简单的防抖，避免频繁触发
        injectFollowButtons();
    });

    const tableContainer = document.getElementById('e-content-area') || document.body;
    observer.observe(tableContainer, {
        childList: true,
        subtree: true
    });
}

// =-=-=-=-=-=-=-=-=-=-=-=-= 2.7 选课助手 =-=-=-=-=-=-=-=-=-=-=-=-=
if (window.location.href.includes('/course-selection')) {
    (function() {
        'use strict';

        if (unsafeWindow.courseHelperInitialized) return;
        unsafeWindow.courseHelperInitialized = true;

        // ==============================================================================
        // [1. 配置与核心变量]
        // ==============================================================================
        const API_URL_TEMPLATE = "https://jwxt.nwpu.edu.cn/student/for-std-lessons/info/";
        const TARGET_CELL_SELECTOR = "td div.el-progress";
        const UI_ELEMENT_CLASS = 'course-helper-ui-element';
        const HISTORY_STORAGE_KEY = 'course_enrollment_history_auto_sync';

        let courseCodeToLessonIdMap = null;

        const originalFetch = unsafeWindow.fetch;
        const originalXhrSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;

        // ==============================================================================
        // [2. 网络拦截与数据解析]
        // ==============================================================================

        function cleanupAndReset() {
            // 数据重置时，清空映射表
            courseCodeToLessonIdMap = null;
        }

        function forceUpdateUI() {
            if (!courseCodeToLessonIdMap) return;
            // console.log('[选课助手] 数据更新，刷新UI...');
            const tables = document.querySelectorAll('.el-table__body');
            const currentMode = getSelectionMode();
            tables.forEach(tableBody => {
                if (tableBody.rows.length > 0) {
                    tableBody.querySelectorAll('tr.el-table__row').forEach(row => {
                        processRowWithCode(row, currentMode);
                    });
                }
            });
        }

        function processApiResponse(responseText) {
            cleanupAndReset();
            try {
                const data = JSON.parse(responseText);
                if (data && data.data && data.data.lessons) {
                    courseCodeToLessonIdMap = new Map(data.data.lessons.map(lesson => [lesson.code, lesson.id]));
                }
            } catch (e) {
                console.error('[选课助手] 解析课程列表JSON时出错:', e);
            }
            // 数据准备好后，通知 UI 刷新
            setTimeout(forceUpdateUI, 500);
        }

         // --- 1. 拦截 Fetch  ---
        unsafeWindow.fetch = function(...args) {
            let [resource, config] = args;
            // 兼容 resource 是 Request 对象的情况
            const requestUrl = resource instanceof Request ? resource.url : resource;

            // 检查是否是查询请求
            if (requestUrl && requestUrl.includes('/query-lesson/')) {
                // A. 尝试修改请求参数
                if (config && config.body && typeof config.body === 'string') {
                    try {
                        const data = JSON.parse(config.body);
                        if (data.limit || data.pageSize) {
                            const TARGET = 100; // 设定目标数量
                            if(data.limit) data.limit = TARGET;
                            if(data.pageSize) data.pageSize = TARGET;
                            config.body = JSON.stringify(data);
                        }
                    } catch (e) {}
                }

                // B. 监听响应
                return originalFetch.apply(this, args).then(response => {
                    const cloned = response.clone();
                    cloned.text().then(text => processApiResponse(text));
                    return response;
                });
            }
            return originalFetch.apply(this, args);
        };

        // --- 2. 拦截 XHR ---
        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
            this._gm_url = url; // 保存 URL 供 send 使用
            return originalXhrOpen.apply(this, arguments);
        };

        // 拦截 Send 修改分页参数
        unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
            this.addEventListener('load', function() {
                if (this.responseURL && this.responseURL.includes('/query-lesson/')) {
                    processApiResponse(this.responseText);
                }
            }, { once: true });

            if (this._gm_url && this._gm_url.includes('/query-lesson/')) {
                try {
                    if (typeof data === 'string') {
                        let jsonData = JSON.parse(data);
                        // 强制修改 limit / pageSize
                        if (jsonData.hasOwnProperty('limit') || jsonData.hasOwnProperty('pageSize')) {
                            const TARGET_LIMIT = 50;

                            if (jsonData.limit) jsonData.limit = TARGET_LIMIT;
                            if (jsonData.pageSize) jsonData.pageSize = TARGET_LIMIT;

                            // 重新打包数据
                            data = JSON.stringify(jsonData);
                        }
                    }
                } catch (e) {
                    // 静默失败
                }
            }

            return originalXhrSend.apply(this, [data]);
        };

        // ==============================================================================
        // [3. 辅助功能函数]
        // ==============================================================================

        function getSelectionMode() {
            const semesterSpan = document.querySelector('div.course-select-semester > span');
            if (!semesterSpan) return 'unknown';
            const modeText = semesterSpan.textContent || '';
            if (modeText.includes('直选')) return 'direct';
            else return 'wishlist';
        }

        function injectDirectSelectionUI(row, lessonId) {
             fetch(`${API_URL_TEMPLATE}${lessonId}`)
                .then(response => response.ok ? response.text() : Promise.reject(`HTTP error! status: ${response.status}`))
                .then(htmlString => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlString, "text/html");
                    let releaseCount = -1;
                    const ths = doc.querySelectorAll('th');
                    for (const th of ths) {
                        if (th.textContent.trim() === '待释放保留人数') {
                            const td = th.nextElementSibling;
                            if (td) { releaseCount = parseInt(td.textContent.trim(), 10) || 0; }
                            break;
                        }
                    }
                    const targetCell = row.querySelector(TARGET_CELL_SELECTOR);
                    if (targetCell && targetCell.parentElement) {
                        const existingElement = targetCell.parentElement.querySelector(`.${UI_ELEMENT_CLASS}`);
                        if (existingElement) existingElement.remove();
                        if (releaseCount > 0) {
                            const displayElement = document.createElement('div');
                            displayElement.className = UI_ELEMENT_CLASS;
                            displayElement.textContent = `待释放保留人数: ${releaseCount}`;
                            Object.assign(displayElement.style, {
                                color: '#E65100', fontWeight: 'bold', fontSize: '13px',
                                marginTop: '6px', textShadow: '0 0 5px rgba(255, 193, 7, 0.5)'
                            });
                            targetCell.parentElement.appendChild(displayElement);
                        }
                    }
                })
                .catch(error => { /* 静默 */ });
        }

        async function injectWishlistUI(row, lessonId) {
            // 读取存储的历史数据
            const historyJSON = await GM_getValue(HISTORY_STORAGE_KEY, '{}');
            let history = {};
            try {
                history = JSON.parse(historyJSON);
            } catch(e) { history = {}; }

            const courseHistory = history[lessonId];
            const targetContainer = row.querySelector('td:nth-child(5) > .cell'); // 适配 ElementUI 表格列
            if (targetContainer) {
                const existingElement = targetContainer.querySelector(`.${UI_ELEMENT_CLASS}`);
                if (existingElement) existingElement.remove();
                if (courseHistory && courseHistory.length > 0) {
                    const latestRecord = courseHistory[courseHistory.length - 1];
                    const { stdCount, limitCount, time } = latestRecord;
                    const isFull = stdCount >= limitCount;
                    const displayElement = document.createElement('span');
                    displayElement.className = UI_ELEMENT_CLASS;
                    displayElement.textContent = ` (上次记录: ${stdCount}/${limitCount})`;
                    displayElement.title = `同步于 ${time}`;
                    Object.assign(displayElement.style, {
                        color: isFull ? '#dc3545' : '#28a745',
                        fontWeight: 'bold', fontSize: '12px', marginLeft: '5px'
                    });
                    targetContainer.appendChild(displayElement);
                }
            }
        }

        function injectCollapseControl() {
            const cols = document.querySelectorAll('.el-col.el-col-24');
            let targetContainer = null;

            for (const col of cols) {
                if (col.innerText.includes('【主修】')) {
                    targetContainer = col;
                    break;
                }
            }

            if (!targetContainer) return; // 未找到目标
            if (document.getElementById('gm-collapse-toggle-btn')) return; // 防止重复

            const btn = document.createElement('button');
            btn.id = 'gm-collapse-toggle-btn';

            // 样式调整：
            btn.className = 'el-button el-button--primary el-button--small';

            btn.innerHTML = '<i class="el-icon-s-operation"></i> 全部展开/折叠';

            // CSS调整：右浮动 + 阴影 + 字体加粗
            btn.style.cssText = `
                 float: right;               /* 靠最右侧 */
                 margin-right: 5px;          /* 右侧留一点缝隙 */
                 margin-top: 5px;           /* 微调垂直位置，使其垂直居中 */
                 font-weight: bold;          /* 字体加粗 */
                 font-size: 14px;            /* 字体加大 */
                 box-shadow: 0 4px 12px rgba(64, 158, 255, 0.5); /* 添加蓝色光晕阴影，增加显眼度 */
                 transition: all 0.3s;
            `;

            // 4. 绑定点击逻辑
            let isExpanded = true;
            btn.onclick = (e) => {
                e.stopPropagation();
                isExpanded = !isExpanded;

                // 添加点击动画效果
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = 'scale(1)', 150);

                document.querySelectorAll('.course-module').forEach(mod => {
                    const icon = mod.querySelector('i');
                    if (!icon) return;
                    const isOpen = icon.classList.contains('el-icon-caret-bottom');

                    if ((isExpanded && !isOpen) || (!isExpanded && isOpen)) {
                        mod.click();
                    }
                });

                btn.innerHTML = isExpanded ? '<i class="el-icon-folder-opened"></i> 全部折叠' : '<i class="el-icon-folder"></i> 全部展开';
                btn.blur();
            };

            // 5. 插入 DOM
            targetContainer.appendChild(btn);
        }

        // ==============================================================================
        // [4. 核心逻辑]
        // ==============================================================================

        function processRowWithCode(row, mode) {
            let courseCode = null;
            // 1. 尝试获取课程代码
            const accurateCodeElement = row.querySelector('div.lesson-code > a.link-url');
            if (accurateCodeElement) {
                courseCode = accurateCodeElement.textContent.trim();
            } else {
                const fallbackCodeElement = row.querySelector('td:first-child span.el-tooltip');
                if (fallbackCodeElement) courseCode = fallbackCodeElement.textContent.trim();
            }

            // 2. [Diff 检查]：防止重复渲染导致的闪烁
            // 如果当前行已经标记了代码，且代码未变，说明是同一行，仅更新状态颜色，不重绘 DOM
            if (row.dataset.gmCurrentCode === courseCode) {
                const existingBtn = row.querySelector('.gm-follow-btn');
                // 如果按钮存在且挂载了 updateState 方法，直接调用更新颜色
                if (existingBtn && existingBtn.updateState) {
                    existingBtn.updateState();
                }
                return;
            }

            // 3. [清理旧状态]：如果代码变了（说明翻页了，DOM 被复用），清除旧的样式和元素
            if (row.dataset.gmCurrentCode) {
                row.style.backgroundColor = '';
                row.style.boxShadow = '';
                row.style.transition = '';
                const nameEl = row.querySelector('.course-name');
                if (nameEl) {
                    nameEl.style.fontWeight = '';
                    nameEl.style.color = '';
                }
                row.querySelectorAll('.gm-follow-btn, .course-helper-ui-element').forEach(el => el.remove());
                delete row.dataset.gmCurrentCode;
            }

            // 4. [注入新状态]
            if (courseCode && courseCodeToLessonIdMap && courseCodeToLessonIdMap.has(courseCode)) {
                // 标记当前行归属
                row.dataset.gmCurrentCode = courseCode;
                const lessonId = courseCodeToLessonIdMap.get(courseCode);
                const nameEl = row.querySelector('.course-name');

                // --- 注入交互式关注按钮 ---
                if (nameEl) {
                    // 补全样式
                    if (!document.getElementById('gm-toast-style')) {
                        const style = document.createElement('style');
                        style.id = 'gm-toast-style';
                        style.textContent = `.gm-toast{position:fixed;top:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:12px 24px;border-radius:6px;font-size:14px;z-index:99999;font-weight:500;box-shadow:0 4px 15px rgba(0,0,0,0.2);pointer-events:none;opacity:0;transition:opacity 0.3s,transform 0.3s;display:flex;align-items:center;}.gm-toast.show{opacity:1;transform:translateX(-50%) translateY(10px);}.gm-toast-icon{margin-right:10px;font-size:16px;font-weight:bold;}`;
                        document.head.appendChild(style);
                    }
                    const showToast = (message, type = 'success') => {
                        const existing = document.querySelector('.gm-toast'); if (existing) existing.remove();
                        const toast = document.createElement('div'); toast.className = 'gm-toast';
                        const iconColor = type === 'success' ? '#67C23A' : '#F56C6C';
                        toast.innerHTML = `<span class="gm-toast-icon" style="color:${iconColor}">${type === 'success' ? '✔' : '✖'}</span><span>${message}</span>`;
                        document.body.appendChild(toast);
                        requestAnimationFrame(() => toast.classList.add('show'));
                        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2000);
                    };

                    const btn = document.createElement('span');
                    btn.className = 'gm-follow-btn';
                    btn.innerHTML = '❤';
                    btn.style.cssText = `cursor: pointer; font-size: 18px; margin-left: 8px; line-height: 1; user-select: none; transition: all 0.2s; display: inline-block; vertical-align: middle;`;
                    btn.title = "点击关注课程";

                    // 挂载状态更新函数
                    btn.updateState = () => {
                        if (typeof FollowManager !== 'undefined' && FollowManager.has(lessonId)) {
                            // 已关注样式：深红、加粗、粉背景、内阴影
                            btn.title = '点击取消关注';
                            btn.style.color = '#f56c6c';
                            btn.style.textShadow = '0 0 8px rgba(245, 108, 108, 0.4)';
                            btn.style.transform = 'scale(1.2)';
                            nameEl.style.fontWeight = 'bold';
                            nameEl.style.color = '#d93025';
                            row.style.backgroundColor = '#ffebeb';
                            row.style.boxShadow = 'inset 5px 0 0 #f56c6c';
                        } else {
                            // 未关注样式：浅灰
                            btn.title = '点击关注课程';
                            btn.style.color = '#e4e7ed';
                            btn.style.textShadow = 'none';
                            btn.style.transform = 'scale(1)';
                            nameEl.style.fontWeight = '';
                            nameEl.style.color = '';
                            row.style.backgroundColor = '';
                            row.style.boxShadow = '';
                        }
                    };
                    btn.updateState(); // 初始化调用

                    // 绑定点击事件
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        if (typeof FollowManager === 'undefined') { alert('功能未加载'); return; }

                        if (FollowManager.has(lessonId)) {
                            FollowManager.remove(lessonId);
                            showToast('已取消关注', 'cancel');
                        } else {
                            // --- 数据抓取 ---
                            let teachers = '待定', credits = '-', timeAndPlace = '-';
                            try {
                                // 教师：第3列
                                const teacherEl = row.querySelector('td:nth-child(3) .course-teacher');
                                if (teacherEl) teachers = teacherEl.innerText.replace(/[\r\n]+/g, ' ').trim();

                                // 时间地点：第4列
                                const placeEl = row.querySelector('td:nth-child(4) .dateTimePlace');
                                if (placeEl) {
                                    const tooltipDiv = placeEl.querySelector('.tooltip-dateTimePlace span');
                                    timeAndPlace = (tooltipDiv ? tooltipDiv.innerText : placeEl.innerText).replace(/[\r\n]+/g, '; ').trim();
                                }

                                // 学分：第1列下方
                                const infoEl = row.querySelector('td:nth-child(1) .text-color-6');
                                if (infoEl) {
                                    const creditMatch = infoEl.innerText.match(/([\d\.]+)学分/);
                                    if (creditMatch) credits = creditMatch[1];
                                }
                            } catch(err) {}

                            // --- 学期提取 (从页面标题) ---
                            let targetSemester = '选课页面关注';
                            try {
                                const semesterEl = document.querySelector('span[title*="选课"]');
                                if (semesterEl) {
                                    const rawText = semesterEl.getAttribute('title') || semesterEl.innerText;
                                    const match = rawText.match(/(\d{4}-\d{4}[春夏秋冬])/);
                                    if (match) targetSemester = match[1];
                                }
                            } catch (e) {}

                            FollowManager.add(lessonId, {
                                id: lessonId, code: courseCode, name: nameEl.innerText.replace('❤', '').trim(),
                                teachers, credits, timeAndPlace, semester: targetSemester, addedTime: new Date().toLocaleString()
                            });
                            showToast(`已关注 ${courseCode}`, 'success');
                        }
                        btn.updateState();
                    };

                    btn.onmouseenter = () => { if(!FollowManager.has(lessonId)) btn.style.color = '#fbc4c4'; };
                    btn.onmouseleave = () => { if(!FollowManager.has(lessonId)) btn.style.color = '#e4e7ed'; };

                    nameEl.appendChild(btn);
                }

                // --- 注入其他辅助信息 ---
                if (mode === 'direct') {
                    injectDirectSelectionUI(row, lessonId);
                } else {
                    injectWishlistUI(row, lessonId);

                }
            }
        }

        // ==============================================================================
        // [5. 初始化]
        // ==============================================================================

        function main() {
            let debounceTimer = null;
            const mainObserver = new MutationObserver(() => {
                if (debounceTimer) clearTimeout(debounceTimer);
                // 50ms 防抖，检测到 DOM 变动停止后执行 UI 更新
                debounceTimer = setTimeout(() => {
                     if(courseCodeToLessonIdMap) forceUpdateUI();
                    injectCollapseControl();
                }, 50);
            });
            const container = document.getElementById('app-content') || document.body;
            mainObserver.observe(container, { childList: true, subtree: true });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', main, { once: true });
        } else {
            main();
        }
    })();
}

// =-=-=-=-=-=-=-=-=-=-=-=-= 2.8 后台静默数据同步 =-=-=-=-=-=-=-=-=-=-=-=-=

const BackgroundSyncSystem = {
    WORKER_NAME: 'gm_bg_sync_worker_frame',

    // 主控逻辑
    initController() {
        const lastSync = GM_getValue(CONSTANTS.LAST_SYNC_TIME_KEY, 0);
        const now = Date.now();

        if (now - lastSync < CONSTANTS.SYNC_COOLDOWN_MS) {
            const remainingMs = CONSTANTS.SYNC_COOLDOWN_MS - (now - lastSync);
            const remainingMins = Math.ceil(remainingMs / 1000 / 60);
            Logger.log("2.8", `处于冷却期，下次自动同步需等待 ${remainingMins} 分钟`);
            return;
        }

        Logger.log("2.8", "准备创建后台 Iframe...");
        const oldFrame = document.getElementById('gm_bg_sync_frame');
        if (oldFrame) oldFrame.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'gm_bg_sync_frame';
        iframe.name = this.WORKER_NAME;
        iframe.src = `https://jwxt.nwpu.edu.cn/student/for-std/lesson-search`;
        iframe.style.cssText = `position: fixed; top: 0; left: -15000px; width: 1440px; height: 900px; border: none; visibility: visible; z-index: -100;`;
        document.body.appendChild(iframe);

        const messageHandler = (event) => {
            if (event.data && event.data.type === 'GM_BG_SYNC_COMPLETE') {
                Logger.log("2.8", `后台同步完成。抓取: ${event.data.count}`);
                if (event.data.count > 0) GM_setValue(CONSTANTS.LAST_SYNC_TIME_KEY, Date.now());
                setTimeout(() => {
                    const frame = document.getElementById('gm_bg_sync_frame');
                    if (frame) frame.remove();
                }, 2000);
                window.removeEventListener('message', messageHandler);
            }
        };
        window.addEventListener('message', messageHandler);
    },

    // Worker 逻辑
    startWorker() {
        Logger.info("Sync-Worker", "启动");

        let allCourseData = [];
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));

        // 等待Loading遮罩消失
        const waitForLoading = async () => {
            let limit = 0;
            while(!document.querySelector('td.dataTables_empty') && limit < 5) { await sleep(100); limit++; }
            limit = 0;
            while(document.querySelector('td.dataTables_empty') && limit < 200) { await sleep(100); limit++; }
            await sleep(500);
        };

        // 解析当前页面的表格行
        const scrapeCurrentPage = (currentSemester) => {
            const rows = document.querySelectorAll('#table tbody tr');
            const pageData = [];

            rows.forEach(row => {
                try {
                    const idInput = row.querySelector('input[name="model_id"]');
                    if (!idInput) return;
                    const id = idInput.value;

                    const codeEl = row.querySelector('.lesson-code');
                    const code = codeEl ? codeEl.innerText.trim() : '';

                    const nameEl = row.querySelector('.course-name');
                    const name = nameEl ? nameEl.innerText.trim() : '';

                    const teacherEl = row.querySelector('.course-teacher');
                    const teachers = teacherEl ? teacherEl.innerText.trim() : '待定';

                    const creditEl = row.children[3];
                    const credits = creditEl ? creditEl.innerText.trim() : '';

                    const placeEl = row.querySelector('.course-datetime-place');
                    let timeAndPlace = placeEl ? placeEl.innerText.replace(/\n/g, '; ').trim() : '详见课表';

                    const countSpan = row.querySelector('span[data-original-title="实际/上限人数"]');
                    let stdCount = 0;
                    let limitCount = 0;
                    if (countSpan) {
                        const match = countSpan.innerText.trim().match(/(\d+)\/(\d+)/);
                        if (match) {
                            stdCount = parseInt(match[1], 10);
                            limitCount = parseInt(match[2], 10);
                        }
                    }

                    pageData.push({
                        id, code, name, teachers, credits, timeAndPlace, stdCount, limitCount,
                        semester: currentSemester,
                        updateTime: Date.now()
                    });

                } catch (e) {
                    console.error("行解析错误:", e);
                }
            });
            return pageData;
        };

        // 自动化执行流程
        const runAutomation = async () => {
            try {
                let maxRetries = 60;
                while (maxRetries > 0) {
                    if (document.querySelector('.page-config .dropdown-toggle')) break;
                    await sleep(500); maxRetries--;
                }
                if (maxRetries <= 0) throw new Error("页面加载超时");

                // ================== 1. 切换到最新学期 ==================
                let activeSemesterName = "未知学期";
                const semesterInput = document.querySelector('.selectize-control.semester .selectize-input');
                if (semesterInput) {
                    semesterInput.click();
                    await sleep(500);
                    const firstOption = document.querySelector('.selectize-dropdown-content .option:first-child');
                    if (firstOption) {
                        const targetSemester = firstOption.innerText.trim();
                        const currentSemester = semesterInput.innerText.trim();
                        if (targetSemester !== currentSemester && !currentSemester.startsWith(targetSemester)) {
                            firstOption.click();
                            await sleep(500);
                            await waitForLoading();
                            activeSemesterName = targetSemester;
                        } else {
                            activeSemesterName = currentSemester.split('\n')[0];
                            document.body.click();
                        }
                    }
                }
                Logger.log("2.8", `锁定抓取学期: ${activeSemesterName}`);

                // ================== 2. 切换到 1000 条/页 ==================
                const pageSizeBtn = document.querySelector('.page-config .dropdown-toggle');
                if (pageSizeBtn && !pageSizeBtn.innerText.includes('1000')) {
                    pageSizeBtn.click(); await sleep(500);
                    const maxOption = document.querySelector('.page-config .dropdown-menu a[value="1000"]');
                    if (maxOption) {
                        maxOption.click();
                        await waitForLoading();
                    }
                }

                // ================== 3. 翻页抓取循环 ==================
                let pageIndex = 1;
                while (true) {
                    await waitForLoading();

                    const pageData = scrapeCurrentPage(activeSemesterName);
                    allCourseData = allCourseData.concat(pageData);

                    const nextIcon = document.querySelector('.semi-auto-table-paginator .fa-angle-right');
                    const nextBtn = nextIcon ? nextIcon.closest('button') : null;

                    if (!nextBtn || nextBtn.disabled || nextBtn.classList.contains('disabled')) {
                        break;
                    }

                    nextBtn.click();
                    pageIndex++;
                    await sleep(2000);
                }

                Logger.log("2.8", `全部完成! 存储 ${allCourseData.length} 条。`);
                GM_setValue(CONSTANTS.BACKGROUND_SYNC_KEY, JSON.stringify(allCourseData));
                window.top.postMessage({ type: 'GM_BG_SYNC_COMPLETE', count: allCourseData.length }, '*');

            } catch (err) {
                console.error("[Worker] 异常:", err);
                window.top.postMessage({ type: 'GM_BG_SYNC_COMPLETE', count: 0 }, '*');
            }
        };

        setTimeout(runAutomation, 1500);
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-= 2.9 培养方案课程代码智能预览 =-=-=-=-=-=-=-=-=-=-=-=-=

function initProgramPageEnhancement() {
    // 检查功能开关
    if (!ConfigManager.enableCourseWatch) {
        return;
    }
    console.log("[NWPU-Enhanced] 初始化培养方案课程预览");

    // 1. 数据准备
    const bgDataStr = GM_getValue('jwxt_background_sync_data'); // 使用硬编码Key
    if (!bgDataStr) return;

    let courseDB;
    try { courseDB = JSON.parse(bgDataStr); } catch(e) { return; }
    if (!courseDB || courseDB.length === 0) return;

    // 构建索引 (Parent Code -> List of Courses)
    const courseMap = new Map();
    courseDB.forEach(c => {
        if (!c.code) return;
        // 提取课程代码前缀 (例如 U14M11003.01 -> U14M11003)
        const parentCode = c.code.trim().split('.')[0];
        if (!courseMap.has(parentCode)) courseMap.set(parentCode, []);
        courseMap.get(parentCode).push(c);
    });

    // 定义高清 SVG 图标
    const svgs = {
        book: `<svg viewBox="0 0 1024 1024" width="18" height="18" style="vertical-align:-4px;fill:#409EFF"><path d="M832 160H256c-52.9 0-96 43.1-96 96v576c0 52.9 43.1 96 96 96h576c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 640H256c-17.7 0-32-14.3-32-32s14.3-32 32-32h536v64zM256 224h536v320H256V224z"></path></svg>`,
        user: `<svg viewBox="0 0 1024 1024" width="14" height="14" style="fill:#909399;margin-right:6px;"><path d="M512 512c141.4 0 256-114.6 256-256S653.4 0 512 0 256 114.6 256 256s114.6 256 256 256zm0 64c-170.7 0-512 85.3-512 256v64c0 17.7 14.3 32 32 32h960c17.7 0 32-14.3 32-32v-64c0-170.7-341.3-256-512-256z"></path></svg>`,
        pin:  `<svg viewBox="0 0 1024 1024" width="14" height="14" style="fill:#909399;margin-right:6px;"><path d="M512 0C323.8 0 170.7 153.1 170.7 341.3c0 176.3 194.2 460.5 285.4 584.2 24.3 32.9 73.5 32.9 97.8 0 91.2-123.7 285.4-407.9 285.4-584.2C853.3 153.1 700.2 0 512 0zm0 512c-94.3 0-170.7-76.4-170.7-170.7S417.7 170.7 512 170.7 682.7 247.1 682.7 341.3 606.3 512 512 512z"></path></svg>`
    };

    // 2. 注入美化后的 CSS
    if (!document.getElementById('gm-program-tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'gm-program-tooltip-style';
        style.textContent = `
            /* 课程代码高亮样式 */
            .gm-course-code-highlight {
                border-bottom: 2px dashed #409EFF;
                color: #409EFF;
                font-weight: 600;
                cursor: pointer;
                background-color: rgba(64, 158, 255, 0.08);
                padding: 1px 4px;
                border-radius: 4px;
                transition: all 0.2s;
            }
            .gm-course-code-highlight:hover {
                background-color: rgba(64, 158, 255, 0.2);
                color: #0056b3;
            }

            /* 弹窗容器 - 磨砂玻璃质感 */
            .gm-program-tooltip {
                position: fixed; z-index: 100001;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.06);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                border-radius: 12px; padding: 0;
                width: 440px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                display: none; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease;
                pointer-events: auto;
                transform: translateY(5px);
            }
            .gm-program-tooltip.show { display: block; opacity: 1; transform: translateY(0); }

            /* 头部样式 */
            .gm-pt-header {
                background: linear-gradient(to right, #f9fafc, #ffffff);
                padding: 14px 20px;
                border-bottom: 1px solid #ebeef5;
                font-weight: 700; color: #303133; font-size: 15px;
                display:flex; justify-content:space-between; align-items: center;
                border-radius: 12px 12px 0 0;
                letter-spacing: 0.5px;
            }
            .gm-pt-badge {
                font-weight:normal; color:#409EFF; font-size:12px;
                background:rgba(64, 158, 255, 0.1);
                padding:4px 10px; border-radius:20px;
            }

            /* 列表区域 */
            .gm-pt-list { max-height: 420px; overflow-y: auto; padding: 0; }

            /* 滚动条美化 */
            .gm-pt-list::-webkit-scrollbar { width: 6px; }
            .gm-pt-list::-webkit-scrollbar-track { background: transparent; }
            .gm-pt-list::-webkit-scrollbar-thumb { background-color: #dcdfe6; border-radius: 3px; }

            /* 单个课程卡片 */
            .gm-pt-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #f2f4f7;
                transition: background-color 0.2s;
            }
            .gm-pt-item:last-child { border-bottom: none; }
            .gm-pt-item:hover { background-color: #f0f7ff; }

            /* 左侧信息区 */
            .gm-pt-info { flex: 1; min-width: 0; padding-right: 15px; }
            .gm-pt-title {
                font-weight: 600; font-size: 15px; color: #303133;
                margin-bottom: 6px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .gm-pt-code { font-size: 12px; color: #909399; font-family: Consolas, monospace; margin-bottom: 8px; }
            .gm-pt-meta { display: flex; flex-direction: column; gap: 4px; color: #606266; font-size: 13px; }
            .gm-pt-row { display: flex; align-items: center; }

            /* 右侧操作区 */
            .gm-pt-action {
                display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0;
            }

            /* 人数胶囊标签 */
            .gm-pt-stat {
                font-family: Consolas, monospace; font-size: 13px; font-weight: bold;
                padding: 3px 8px; border-radius: 4px;
            }
            .gm-tag-full { color: #F56C6C; background: #fef0f0; border: 1px solid #fde2e2; }
            .gm-tag-avail { color: #67C23A; background: #f0f9eb; border: 1px solid #e1f3d8; }

            /* 关注按钮 */
            .gm-pt-btn {
                cursor: pointer; font-size: 22px; color: #dcdfe6; line-height: 1;
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex; align-items: center; justify-content: center;
                width: 32px; height: 32px; border-radius: 50%;
            }
            .gm-pt-btn:hover { transform: scale(1.15); background-color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .gm-pt-btn.is-active { color: #f56c6c !important; text-shadow: 0 2px 5px rgba(245, 108, 108, 0.3); }
        `;
        document.head.appendChild(style);
    }

    let tooltip = document.querySelector('.gm-program-tooltip');
    if(!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'gm-program-tooltip';
        document.body.appendChild(tooltip);
    }

    // 3. 全局事件委托 (处理悬停和点击)
    let hideTimer = null;

    document.body.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('gm-course-code-highlight')) {
            if (hideTimer) clearTimeout(hideTimer);
            const code = e.target.getAttribute('data-code');
            showTooltip(e.target, code);
        }
        else if (e.target.closest('.gm-program-tooltip')) {
            if (hideTimer) clearTimeout(hideTimer);
        }
    });

    document.body.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('gm-course-code-highlight') || e.target.closest('.gm-program-tooltip')) {
            hideTimer = setTimeout(() => { tooltip.classList.remove('show'); }, 300);
        }
    });

    document.body.addEventListener('dblclick', function(e) {
        // 检查是否点击了高亮的代码块
        if (e.target.classList.contains('gm-course-code-highlight')) {
            const code = e.target.getAttribute('data-code');
            // 使用剪贴板 API
            navigator.clipboard.writeText(code).then(() => {
                // 视觉反馈：变为绿色并闪烁一下
                const originalTransition = e.target.style.transition;
                const originalBg = e.target.style.backgroundColor;
                const originalColor = e.target.style.color;

                e.target.style.transition = 'all 0.1s';
                e.target.style.backgroundColor = '#f0f9eb';
                e.target.style.color = '#67C23A';
                e.target.textContent = '已复制!'; // 临时改变文字提示

                setTimeout(() => {
                    e.target.textContent = code; // 恢复文字
                    e.target.style.backgroundColor = originalBg;
                    e.target.style.color = originalColor;
                    e.target.style.transition = originalTransition;
                }, 800);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制');
            });

            // 阻止选中文本的默认行为
            e.preventDefault();
            window.getSelection().removeAllRanges();
        }
    });

    // 处理关注按钮点击
    document.body.addEventListener('click', function(e) {
        const btn = e.target.closest('.gm-pt-btn');
        if (btn) {
            e.stopPropagation();
            handleFollowClick(btn);
        }
    });

    function handleFollowClick(btn) {
        const id = btn.dataset.id.toString();
        const semester = btn.dataset.semester && btn.dataset.semester !== "undefined"
                         ? btn.dataset.semester
                         : '从培养方案页关注';

        const data = {
            id: id,
            code: btn.dataset.code,
            name: btn.dataset.name,
            semester: semester,
            teachers: btn.dataset.teachers,
            credits: btn.dataset.credits || '-',
            timeAndPlace: btn.dataset.place,
            addedTime: new Date().toLocaleString()
        };

        if (FollowManager.has(id)) {
            FollowManager.remove(id);
            btn.classList.remove('is-active');
            btn.style.color = '#dcdfe6';
        } else {
            FollowManager.add(id, data);
            btn.classList.add('is-active');
            btn.style.color = '#f56c6c';
        }
    }

    // 4. DOM 扫描 (将普通文本转换为高亮节点)
    function processCells() {
        const cells = document.querySelectorAll('td');
        cells.forEach(td => {
            if (td.dataset.gmProcessed) return;
            const rawText = td.textContent;
            if (!rawText) return;
            const text = rawText.trim();
            // 简单的正则匹配课程代码 (大写字母开头，包含数字，长度适中)
            if (text.length >= 5 && text.length <= 15 && /^[A-Z][A-Z0-9]+$/.test(text)) {
                if (courseMap.has(text)) {
                    td.dataset.gmProcessed = "true";
                    td.innerHTML = `<span class="gm-course-code-highlight" data-code="${text}" title="双击复制课程代码">${text}</span>`;
                }
            }
        });
    }

    // 5. 显示浮层 (生成HTML)
    function showTooltip(targetEl, code) {
        const courses = courseMap.get(code) || [];
        const rect = targetEl.getBoundingClientRect();

        let contentHTML = '';
        if (courses.length === 0) {
            contentHTML = '<div style="padding:30px;text-align:center;color:#909399;font-size:13px;">本学期暂无开课记录</div>';
        } else {
            contentHTML = `<div class="gm-pt-list">`;
            courses.forEach(c => {
                const isFull = c.stdCount >= c.limitCount;
                const countClass = isFull ? 'gm-tag-full' : 'gm-tag-avail';
                const isFollowed = FollowManager.has(c.id);
                const activeClass = isFollowed ? 'is-active' : '';
                const initColor = isFollowed ? '#f56c6c' : '#dcdfe6';

                const teacherText = c.teachers || '待定';
                const placeText = c.timeAndPlace || '详见课表';

                contentHTML += `
                    <div class="gm-pt-item">
                        <div class="gm-pt-info">
                            <div class="gm-pt-title" title="${c.name}">${c.name}</div>
                            <div class="gm-pt-code">${c.code}</div>
                            <div class="gm-pt-meta">
                                <div class="gm-pt-row">${svgs.user} <span>${teacherText}</span></div>
                                <div class="gm-pt-row">${svgs.pin} <span>${placeText}</span></div>
                            </div>
                        </div>
                        <div class="gm-pt-action">
                            <div class="gm-pt-stat ${countClass}">
                                ${c.stdCount}/${c.limitCount}
                            </div>
                            <div class="gm-pt-btn ${activeClass}" style="color:${initColor}"
                                 data-id="${c.id}" data-code="${c.code}" data-name="${c.name}"
                                 data-teachers="${teacherText}" data-place="${placeText}"
                                 data-credits="${c.credits || ''}"
                                 data-semester="${c.semester}"
                                 title="${isFollowed ? '取消关注' : '关注此班级'}">❤</div>
                        </div>
                    </div>
                `;
            });
            contentHTML += `</div>`;
        }

        tooltip.innerHTML = `
            <div class="gm-pt-header">
                <span style="display:flex;align-items:center;gap:8px">${svgs.book} <span style="font-family:Consolas, monospace;font-size:16px;">${code}</span></span>
                <span class="gm-pt-badge">本学期 ${courses.length} 个班级</span>
            </div>
            ${contentHTML}
        `;

        // 智能定位
        const viewportHeight = window.innerHeight;
        const tooltipHeight = Math.min(500, courses.length * 90 + 125); // 估算高度
        let top = rect.bottom + 8;

        // 如果底部放不下，就放上面
        if (rect.bottom + tooltipHeight > viewportHeight) {
            top = rect.top - tooltipHeight - 10;
            if(top < 10) top = 10; // 防止溢出顶部
        }

        // 水平定位
        let left = rect.left + 80;
        if (left + 440 > window.innerWidth) {
            left = window.innerWidth - 450;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.classList.add('show');
    }

    // 观察页面变化，动态处理新加载的内容
    const observer = new MutationObserver(() => {
        if(window.gm_program_timer) clearTimeout(window.gm_program_timer);
        window.gm_program_timer = setTimeout(processCells, 200);
    });
    const targetNode = document.querySelector('.main-content') || document.body;
    observer.observe(targetNode, { childList: true, subtree: true });

    // 初始执行
    setTimeout(processCells, 500);
    setTimeout(processCells, 1500);
}

// =-=-=-=-=-=-=-=-=-=-=-=-= 2.10 选课时间提醒 =-=-=-=-=-=-=-=-=-=-=-=-=
function initScheduleWidget() {
    // ================= 配置区域 (维护请修改此处) =================
    const SCHEDULE_CONFIG = {
        // 插件整体失效时间 (超过此时间不再显示)
        EXPIRATION_DATE: '2026-03-07T00:00:00',
        // 本地存储Key (用于不再提醒)
        STORAGE_KEY: 'jwxt_schedule_table_closed_2026_spring',
        // 选课地址
        COURSE_URL: 'https://jwxt.nwpu.edu.cn/student/for-std/course-select',
        // 提前N小时提示同步数据
        PRE_NOTIFY_HOURS: 16,

        // 选课阶段配置 (支持自动生成表格)
        // type: 'positive' (正选) | 'makeup' (补选/其他) -> 用于判断是否触发考前数据同步提示
        GROUPS: [
            {
                groupName: '正选', // 表格第一列名称
                phases: [
                    { name: '第一轮', type: 'positive', start: '2026-01-12T14:00:00', end: '2026-01-15T12:00:00', method: '意愿值选课', scope: '主修专业课' },
                    { name: '第二轮', type: 'positive', start: '2026-01-19T14:00:00', end: '2026-01-21T12:00:00', method: '意愿值选课', scope: '学期教学计划全部课程' },
                    { name: '第三轮', type: 'positive', start: '2026-01-23T08:00:00', end: '2026-01-25T12:00:00', method: '直选选课', scope: '学期教学计划全部课程' }
                ]
            },
            {
                groupName: '补选',
                phases: [
                    { name: '补选阶段', type: 'makeup', start: '2026-03-02T09:00:00', end: '2026-03-06T16:00:00', method: '系统中申请', scope: '学期开设的全部课程' },
                    { name: '本研共选', type: 'makeup', start: '2026-03-02T09:00:00', end: '2026-03-06T16:00:00', method: '直选选课', scope: '学期开设的本研共选课程' }
                ]
            }
        ]
    };
    // ===========================================================

    const showWidget = () => {
        if (GM_getValue(SCHEDULE_CONFIG.STORAGE_KEY, false) === true) return;
        // 避免单次页面刷新内重复关闭后弹出
        if (window.gm_schedule_manually_closed) return;

        const now = Date.now();
        const expirationTime = new Date(SCHEDULE_CONFIG.EXPIRATION_DATE).getTime();

        if (now > expirationTime) return;
        if (document.querySelector('.gm-schedule-box')) return;

        // --- 1. 计算当前状态 & 构建表格行 ---
        let statusHtml = '<span style="color: #909399;">当前未处于选课时段</span>';
        let showPreSyncLink = false; // 是否显示同步链接
        let tableRowsHtml = '';

        // 扁平化遍历所有阶段以检查时间
        let activePhaseFound = false;

        SCHEDULE_CONFIG.GROUPS.forEach((group, gIndex) => {
            group.phases.forEach((phase, pIndex) => {
                const startTime = new Date(phase.start).getTime();
                const endTime = new Date(phase.end).getTime();
                const preStartTime = startTime - (SCHEDULE_CONFIG.PRE_NOTIFY_HOURS * 60 * 60 * 1000);

                // A. 检查状态: 进行中
                if (!activePhaseFound && now >= startTime && now <= endTime) {
                    statusHtml = `当前处于 <span style="color: #f56c6c; font-weight: bold; border-bottom: 2px solid #f56c6c;">${group.groupName} - ${phase.name}</span>`;
                    activePhaseFound = true;
                }
                // B. 检查状态: 即将开始 (正选前N小时提示)
                else if (!activePhaseFound && phase.type === 'positive' && now >= preStartTime && now < startTime) {
                    const hoursLeft = Math.ceil((startTime - now) / 3600000);
                    statusHtml = `<span style="color: #E65100; font-weight:bold;">${group.groupName}${phase.name}</span> 将于 ${hoursLeft} 小时后开始。` +
                                 `<span id="gm-sch-pre-sync" style="color:#409EFF; cursor:pointer; text-decoration:underline; font-weight:bold; margin-left:10px;">[建议您点击此处记录课程内置情况]</span>`;
                    showPreSyncLink = true;
                    activePhaseFound = true;
                }

                // C. 构建表格行
                // 格式化时间显示 (移除年份，保留 月-日 时:分)
                const formatTime = (isoStr) => {
                    const d = new Date(isoStr);
                    return `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}点`;
                };
                const timeStr = `${formatTime(phase.start)} 至 ${formatTime(phase.end)}`;

                tableRowsHtml += `<tr>`;
                // 处理第一列的 Rowspan (合并单元格)
                if (pIndex === 0) {
                    const borderStyle = gIndex > 0 ? 'border-top:2px solid #ebeef5;' : '';
                    tableRowsHtml += `<td rowspan="${group.phases.length}" style="font-weight:bold; ${borderStyle}">${group.groupName}</td>`;
                }

                // 高亮选课方式
                const methodClass = phase.method.includes('意愿值') || phase.method.includes('直选') ? 'gm-sch-highlight' : '';

                tableRowsHtml += `
                    <td>${phase.name}</td>
                    <td>${timeStr}</td>
                    <td class="${methodClass}">${phase.method}</td>
                    <td>${phase.scope}</td>
                </tr>`;
            });
        });

        // --- 2. 注入样式 ---
        if (!document.getElementById('gm-schedule-table-style')) {
            const style = document.createElement('style');
            style.id = 'gm-schedule-table-style';
            style.textContent = `
                .gm-schedule-box {
                    position: fixed; left: 20px; bottom: 20px; z-index: 9999;
                    background: #fff; padding: 12px; border-radius: 8px;
                    box-shadow: 0 4px 25px rgba(0,0,0,0.15);
                    border: 1px solid #dcdfe6;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    animation: gmSlideUp 0.5s ease-out;
                    width: auto; max-width: 680px;
                }
                .gm-status-bar {
                    text-align: center; background: #fdf6ec; padding: 8px;
                    border-radius: 4px; margin-bottom: 10px; font-size: 13px;
                    border: 1px inset #faecd8; line-height: 1.5;
                }
                .gm-sch-table {
                    width: 100%; border-collapse: collapse; font-size: 12px; color: #333;
                    margin-bottom: 10px; border: 1px solid #ebeef5;
                }
                .gm-sch-table th, .gm-sch-table td {
                    border: 1px solid #ebeef5; padding: 6px 8px; text-align: center; vertical-align: middle;
                }
                .gm-sch-table th { background-color: #f5f7fa; font-weight: bold; color: #606266; }
                .gm-sch-highlight { color: #409EFF; font-weight: bold; }
                .gm-schedule-footer {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 12px; color: #909399; margin-top: 8px;
                }
                .gm-sch-btn-group { display: flex; gap: 10px; }
                .gm-schedule-btn {
                    border: none; padding: 5px 12px; border-radius: 4px; cursor: pointer;
                    font-size: 12px; transition: opacity 0.2s; color: white;
                }
                .gm-btn-close { background: #f56c6c; }
                .gm-btn-go { background: #409EFF; }
                .gm-schedule-btn:hover { opacity: 0.8; }
                #gm-sch-pre-sync:hover { color: #66b1ff; }
                @keyframes gmSlideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

        // --- 3. 构建容器 HTML ---
        const div = document.createElement('div');
        div.className = 'gm-schedule-box';
        div.innerHTML = `
            <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#303133; text-align:center;">
                选课时间安排表
            </div>
            <div class="gm-status-bar">${statusHtml}</div>
            <table class="gm-sch-table">
                <thead>
                    <tr><th>选课阶段</th><th>选课轮次</th><th>时间安排</th><th>选课方式</th><th>课程范围</th></tr>
                </thead>
                <tbody>
                    ${tableRowsHtml}
                </tbody>
            </table>
            <div class="gm-schedule-footer">
                <label style="cursor:pointer; display:flex; align-items:center; user-select:none;">
                    <input type="checkbox" id="gm-schedule-check" style="margin-right:6px;">
                    不再显示此安排
                </label>
                <div class="gm-sch-btn-group">
                    <button class="gm-schedule-btn gm-btn-go" id="gm-schedule-go-btn">进入选课</button>
                    <button class="gm-schedule-btn gm-btn-close" id="gm-schedule-close-btn">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(div);

        // --- 4. 事件绑定 ---
        // 绑定同步数据的点击事件
        if (showPreSyncLink) {
            const syncLink = document.getElementById('gm-sch-pre-sync');
            if (syncLink) {
                syncLink.onclick = () => {
                    // 调用全局定义的同步函数
                    if (typeof handleSyncCourseClick === 'function') {
                        handleSyncCourseClick();
                    } else {
                        alert("同步功能初始化中，请稍后再试。");
                    }
                };
            }
        }

        // 跳转选课页面
        document.getElementById('gm-schedule-go-btn').onclick = () => {
            window.location.href = SCHEDULE_CONFIG.COURSE_URL;
        };

        // 关闭
        document.getElementById('gm-schedule-close-btn').onclick = () => {
            if (document.getElementById('gm-schedule-check').checked) {
                GM_setValue(SCHEDULE_CONFIG.STORAGE_KEY, true);
            }
            window.gm_schedule_manually_closed = true;
            div.remove();
        };
    };

    const hideWidget = () => {
        const box = document.querySelector('.gm-schedule-box');
        if (box) box.remove();
    };

    // 监控页面变化
    setInterval(() => {
        const iframes = document.querySelectorAll('iframe');
        let hasActiveSubPage = false;
        for (let f of iframes) {
            // 忽略插件自己创建的 iframe
            if (f.id && (f.id.startsWith('gm_') || f.style.visibility === 'hidden')) continue;
            // 检测是否有可见的大型iframe覆盖
            if (f.offsetParent !== null && f.offsetHeight > 300 && f.offsetWidth > 300) {
                hasActiveSubPage = true;
                break;
            }
        }
        if (window.location.href.includes('/student/home') && !hasActiveSubPage) {
            showWidget();
        } else {
            hideWidget();
        }
    }, 1000); // 稍微放宽检查间隔

    // 首次立即检查
    if (window.location.href.includes('/student/home')) showWidget();
}

// =-=-=-=-=-=-=-=-=-=-=-=-= 2.11 自动评教模块 =-=-=-=-=-=-=-=-=-=-=-=-=

function initEvaluationHelper() {
    const IS_TEST_MODE = false; // 正式使用请设为 false

    if (window.gm_eval_observer_started) return;
    window.gm_eval_observer_started = true;

    // --- 基础工具 ---
    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => { observer.disconnect(); resolve(null); }, timeout);
        });
    };
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // 模拟输入事件，确保Vue响应
    const triggerInputEvent = (element, value) => {
        if (!element) return;
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
    };

    // --- 1. 注入 CSS ---
    if (!document.getElementById('gm-eval-style')) {
        const style = document.createElement('style');
        style.id = 'gm-eval-style';
        style.textContent = `
            .gm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 20000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
            .gm-modal-content { background: #fff; border-radius: 12px; width: 720px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(0,0,0,0.25); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; animation: gmFadeIn 0.25s ease-out; border: 1px solid #ebeef5; }
            .gm-modal-header { padding: 18px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff; border-radius: 12px 12px 0 0; }
            .gm-modal-title { font-size: 18px; font-weight: 700; color: #303133; letter-spacing: 0.5px; }
            .gm-close-btn { width: 30px; height: 30px; border-radius: 50%; border: none; background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #909399; transition: all 0.2s; }
            .gm-close-btn:hover { background-color: #f56c6c; color: #fff; transform: rotate(90deg); }
            .gm-close-btn svg { width: 16px; height: 16px; fill: currentColor; }
            .gm-eval-body { padding: 20px; overflow-y: auto; flex: 1; background: #f5f7fa; }
            .gm-course-group { background: #fff; border: 1px solid #ebeef5; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); overflow: hidden; }
            .gm-course-header { background: #eef5fe; padding: 10px 15px; border-bottom: 1px solid #ebeef5; font-weight: bold; color: #409EFF; font-size: 14px; display: flex; align-items: center; gap: 8px; justify-content: space-between;}
            .gm-course-status-tag { font-size: 12px; font-weight: normal; padding: 2px 8px; border-radius: 10px; }
            .gm-tag-done { background: #f0f9eb; color: #67C23A; border: 1px solid #e1f3d8; }
            .gm-tag-todo { background: #fdf6ec; color: #E6A23C; border: 1px solid #faecd8; }
            .gm-teacher-row { display: flex; align-items: center; padding: 12px 15px; border-bottom: 1px solid #f2f2f2; transition: background 0.2s; }
            .gm-teacher-row:last-child { border-bottom: none; }
            .gm-teacher-row:hover { background: #fafafa; }
            .gm-teacher-row.gm-row-done { background: #fcfcfc; color: #999; }
            .gm-t-name { flex: 1; font-size: 14px; color: #606266; margin-left: 10px; font-weight: 500; display: flex; align-items: center; gap: 5px; }
            .gm-row-done .gm-t-name { color: #a8abb2; text-decoration: line-through; }
            .gm-done-badge { font-size: 12px; color: #67C23A; border: 1px solid #67C23A; padding: 0 4px; border-radius: 3px; transform: scale(0.9); text-decoration: none; display: inline-block;}
            .gm-score-input { width: 80px; padding: 6px 8px; border: 1px solid #dcdfe6; border-radius: 4px; text-align: center; font-family: Consolas, monospace; transition: 0.2s; margin-right: 15px; }
            .gm-score-input:focus { border-color: #409EFF; outline: none; box-shadow: 0 0 0 2px rgba(64,158,255,0.2); }
            .gm-score-input:disabled { background: #f5f7fa; color: #c0c4cc; cursor: not-allowed; border-color: #e4e7ed; }
            .gm-checkbox { cursor: pointer; width: 16px; height: 16px; accent-color: #409EFF; }
            .gm-checkbox:disabled { cursor: not-allowed; opacity: 0.5; }
            .gm-status-box { width: 70px; text-align: right; font-size: 12px; }
            .gm-modal-footer { padding: 16px 24px; border-top: 1px solid #eee; background: #fff; border-radius: 0 0 12px 12px; display: flex; justify-content: space-between; align-items: center; gap: 15px; }
            .gm-btn { padding: 9px 20px; border-radius: 6px; border: none; font-size: 14px; cursor: pointer; font-weight: 500; transition: 0.2s; display: inline-flex; align-items: center; gap: 6px; }
            .gm-btn-primary { background: #409EFF; color: white; }
            .gm-btn-primary:hover { background: #66b1ff; }
            .gm-btn-warning { background: #E6A23C; color: white; }
            .gm-btn-warning:hover { background: #ebb563; }
            .gm-btn:disabled { opacity: 0.6; cursor: not-allowed; background: #e4e7ed; color: #909399; }
            .gm-status-pending { color: #909399; }
            .gm-status-running { color: #409EFF; font-weight: bold; }
            .gm-status-success { color: #67C23A; font-weight: bold; }
            .gm-status-error { color: #F56C6C; }
            @keyframes gmFadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        `;
        document.head.appendChild(style);
    }

    // --- 2. 抓取任务 ---
    function scrapeTasks() {
        const tasks = [];
        let idCounter = 0;
        const rows = document.querySelectorAll('.el-table__body-wrapper tbody tr');

        rows.forEach(row => {
            const courseNameEl = row.querySelector('.coursename .name') || row.querySelector('td:nth-child(2)');
            const courseName = courseNameEl ? courseNameEl.innerText.replace(/\s+/g, ' ').trim() : '未知课程';
            const successTag = row.querySelector('.el-tag--success');
            const isRowComplete = successTag && successTag.innerText.includes('已完成');

            const links = row.querySelectorAll('a');

            links.forEach(link => {
                const isSubmitted = link.innerText.includes('已评') || link.classList.contains('submitted');
                const isDisabled = link.classList.contains('is-disabled');

                if (link.innerText.length > 1 && !isDisabled) {
                    tasks.push({
                        id: ++idCounter,
                        course: courseName,
                        teacher: link.innerText.trim(),
                        element: link,
                        isDone: isSubmitted,
                        courseIsDone: isRowComplete,
                        status: isSubmitted ? 'done' : 'pending'
                    });
                }
            });
        });
        return tasks;
    }

    // --- 3. 显示主面板 ---
    const showEvalModal = () => {
        if (document.getElementById('gm-eval-modal')) return;
        const taskList = scrapeTasks();
        const courseGroups = {};
        taskList.forEach(task => {
            if (!courseGroups[task.course]) courseGroups[task.course] = [];
            courseGroups[task.course].push(task);
        });

        const overlay = document.createElement('div');
        overlay.id = 'gm-eval-modal';
        overlay.className = 'gm-modal-overlay';
        const pendingCount = taskList.filter(t => !t.isDone).length;

        overlay.innerHTML = `
            <div class="gm-modal-content">
                <div class="gm-modal-header">
                    <div class="gm-modal-title">自动评教功能 <span style="font-size:12px;font-weight:normal;color:#999;margin-left:10px;">待评任务: ${pendingCount}</span></div>
                    <button class="gm-close-btn" id="gm-eval-close" title="关闭">
                        <svg viewBox="0 0 1024 1024"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg>
                    </button>
                </div>
                <div class="gm-eval-body" id="gm-eval-container">
                    <div style="margin-bottom:10px;display:flex;justify-content:flex-end;">
                        <label style="font-size:13px;color:#606266;cursor:pointer;display:flex;align-items:center;">
                            <input type="checkbox" id="gm-check-all-available" style="margin-right:5px;"> 全选所有待评任务
                        </label>
                    </div>
                </div>
                <div class="gm-modal-footer">
                    <div style="flex:1;"></div>
                    <div style="display:flex; gap:10px;">
                        <button id="gm-btn-min-eval" class="gm-btn gm-btn-warning" title="跳过已完成课程，未完成课程只评第一个">
                            ⚡ 自动完成最低评教
                        </button>
                        <button id="gm-btn-run-selected" class="gm-btn gm-btn-primary">
                            ▶ 开始评教
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const container = document.getElementById('gm-eval-container');
        if (Object.keys(courseGroups).length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:50px;color:#999;">当前没有任务</div>';
            document.getElementById('gm-btn-min-eval').disabled = true;
            document.getElementById('gm-btn-run-selected').disabled = true;
        } else {
            for (const [courseName, teachers] of Object.entries(courseGroups)) {
                const hasDone = teachers.some(t => t.isDone) || (teachers.length > 0 && teachers[0].courseIsDone);
                const statusTag = hasDone
                    ? `<span class="gm-course-status-tag gm-tag-done">最低要求已达成</span>`
                    : `<span class="gm-course-status-tag gm-tag-todo">未完成</span>`;
                const groupDiv = document.createElement('div');
                groupDiv.className = 'gm-course-group';
                let teachersHtml = '';
                teachers.forEach(t => {
                    const rowClass = t.isDone ? 'gm-teacher-row gm-row-done' : 'gm-teacher-row';
                    const nameBadge = t.isDone ? '<span class="gm-done-badge">已完成</span>' : '';
                    const statusText = t.isDone ? '<span class="gm-status-success">已提交</span>' : '<span class="gm-status-pending">待评</span>';
                    const disabledAttr = t.isDone ? 'disabled' : '';
                    const inputPlaceholder = t.isDone ? '-' : '分数';
                    teachersHtml += `
                        <div class="${rowClass}">
                            <input type="checkbox" class="gm-item-check gm-checkbox" data-id="${t.id}" ${disabledAttr}>
                            <div class="gm-t-name">${t.teacher} ${nameBadge}</div>
                            <input type="number" class="gm-score-input" data-id="${t.id}" id="score-${t.id}" placeholder="${inputPlaceholder}" min="0" max="100" ${disabledAttr}>
                            <div class="gm-status-box"><span id="status-${t.id}">${statusText}</span></div>
                        </div>
                    `;
                });
                groupDiv.innerHTML = `
                    <div class="gm-course-header">
                        <span>${courseName}</span>
                        ${statusTag}
                    </div>
                    <div class="gm-teacher-list">
                        ${teachersHtml}
                    </div>
                `;
                container.appendChild(groupDiv);
            }
        }

        const btnMin = document.getElementById('gm-btn-min-eval');
        const btnRun = document.getElementById('gm-btn-run-selected');
        const checkAll = document.getElementById('gm-check-all-available');

        document.getElementById('gm-eval-close').onclick = () => overlay.remove();

        checkAll.onchange = (e) => {
            document.querySelectorAll('.gm-item-check:not(:disabled)').forEach(cb => cb.checked = e.target.checked);
        };
        document.querySelectorAll('.gm-score-input:not(:disabled)').forEach(input => {
            input.oninput = function() {
                const id = this.getAttribute('data-id');
                const cb = document.querySelector(`.gm-item-check[data-id="${id}"]`);
                if (cb) cb.checked = true;
            };
        });

        const fillFormExact = (targetScore) => {
            const groups = document.querySelectorAll('.el-radio-group');
            const questions = [];
            let maxTotalScore = 0;

            // 1. 扫描题目结构
            groups.forEach((group, index) => {
                const options = group.querySelectorAll('.el-radio');
                if (options.length === 0) return;

                const text = options[0].innerText || "";
                let maxPoints = 5;
                let step = 1;

                if (text.includes("10分")) {
                    maxPoints = 10;
                    step = 2;
                }

                maxTotalScore += maxPoints;
                questions.push({
                    domOptions: options,
                    maxPoints: maxPoints,
                    step: step,
                    currentIdx: 0
                });
            });

            if (targetScore > maxTotalScore) targetScore = maxTotalScore;
            if (targetScore < 0) targetScore = 0;

            let pointsToLose = maxTotalScore - targetScore;

            // 2. 算法扣分
            // Phase A: 扣除奇数分 (找5分题)
            if (pointsToLose % 2 !== 0) {
                const q5 = questions.find(q => q.step === 1);
                if (q5) {
                    q5.currentIdx = 1;
                    pointsToLose -= 1;
                }
            }

            // Phase B: 扣除偶数分 (优先10分题)
            for (let q of questions) {
                if (pointsToLose <= 0) break;
                const remainingSteps = (q.domOptions.length - 1) - q.currentIdx;
                const maxDeductable = remainingSteps * q.step;

                if (maxDeductable > 0) {
                    let deduct = Math.min(pointsToLose, maxDeductable);
                    const stepsToMove = deduct / q.step;
                    q.currentIdx += stepsToMove;
                    pointsToLose -= deduct;
                }
            }

            // 3.深度点击执行
            questions.forEach(q => {
                const targetOption = q.domOptions[q.currentIdx] || q.domOptions[q.domOptions.length - 1];
                if (targetOption) {
                    // 尝试找到内部真正的 input 元素
                    const internalInput = targetOption.querySelector('input.el-radio__original');
                    if (internalInput) {
                        internalInput.click(); // 原生点击
                        // 双重保险：手动派发变更事件，确保 Vue Model 更新
                        internalInput.checked = true;
                        internalInput.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        // 降级：点击 Label
                        targetOption.click();
                    }
                }
            });

            // 4. 填星星
            document.querySelectorAll('.el-rate').forEach(group => {
                const stars = group.querySelectorAll('.el-rate__item');
                let starIdx = stars.length - 1;
                if (targetScore < 90) starIdx = Math.max(0, stars.length - 2);
                if (stars[starIdx]) stars[starIdx].click();
            });

            // 5. 填评语
            const comments = ["老师授课认真，重点突出。", "教学严谨，对学生负责。", "课堂氛围好，讲解生动。", "深入浅出，受益匪浅。", "理论联系实际，收获很大。"];
            document.querySelectorAll('textarea').forEach(area => {
                const randomComment = comments[Math.floor(Math.random() * comments.length)];
                triggerInputEvent(area, randomComment);
            });
        };

        // --- 核心执行函数 ---
        const executeTasks = async (tasksToRun) => {
            if (tasksToRun.length === 0) {
                alert("没有选中任何任务！");
                return;
            }

            btnMin.disabled = true;
            btnRun.disabled = true;
            document.querySelectorAll('input').forEach(i => i.disabled = true);
            let downgradedCourses = [];

            for (let i = 0; i < tasksToRun.length; i++) {
                const task = tasksToRun[i];
                if (task.isDone) continue;

                const statusEl = document.getElementById(`status-${task.id}`);
                const inputVal = document.getElementById(`score-${task.id}`).value;
                let scoreVal = inputVal ? parseInt(inputVal) : 95;

                statusEl.className = 'gm-status-running';
                statusEl.innerText = '准备进入...';
                const rowEl = statusEl.closest('.gm-teacher-row');
                if(rowEl) rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

                try {
                    // ★ 重新寻找DOM (Fix Stale Element)
                    let activeLink = null;
                    const allRows = document.querySelectorAll('.el-table__body-wrapper tbody tr');
                    for (let tr of allRows) {
                        const courseText = tr.innerText;
                        if (courseText.includes(task.course) && courseText.includes(task.teacher)) {
                            const links = tr.querySelectorAll('a');
                            for (let link of links) {
                                if (link.innerText.includes(task.teacher) && !link.classList.contains('is-disabled')) {
                                    activeLink = link;
                                    break;
                                }
                            }
                        }
                        if (activeLink) break;
                    }
                    if (!activeLink) activeLink = task.element;

                    activeLink.click();

                    statusEl.innerText = '加载表单...';
                    const formReady = await waitForElement('.el-radio-group', 15000);
                    if (!formReady) {
                        // 重试点击
                        activeLink.click();
                        const retryReady = await waitForElement('.el-radio-group', 10000);
                        if (!retryReady) throw new Error("表单加载超时");
                    }
                    await sleep(1000);

                    // 1. 填表
                    statusEl.innerText = '正在填表...';
                    fillFormExact(scoreVal);
                    await sleep(1500);

                    // 2. 提交
                    let submitBtn = null;
                    const btnGroup = document.getElementById('btn-group');
                    if (btnGroup) {
                        const btns = btnGroup.querySelectorAll('button');
                        for (let btn of btns) {
                            if (btn.textContent.includes('提交') && !btn.textContent.includes('匿名')) {
                                submitBtn = btn;
                                break;
                            }
                        }
                    }

                    if (submitBtn) {
                        // 如果按钮还禁用，重试填表
                        if (submitBtn.disabled || submitBtn.classList.contains('is-disabled')) {
                             fillFormExact(scoreVal);
                             await sleep(1000);
                        }

                        statusEl.innerText = '提交中...';
                        submitBtn.click();

                        const msgBox = await waitForElement('.el-message-box', 5000);

                        // 检查是否有错误提示 (500 Error 会弹 toast 或 message-box)
                        const errorToast = document.querySelector('.el-message--error');
                        if (errorToast) {
                            throw new Error("服务器返回错误(500)，可能是提交过快");
                        }

                        if (msgBox) {
                            const text = msgBox.innerText || "";
                            const confirmBtn = msgBox.querySelector('.el-button--primary');

                            // 场景 A：20% 限制
                            if (text.includes('20%') || text.includes('不得超过') || text.includes('优秀')) {
                                statusEl.innerText = '限制触发, 降分...';
                                if (confirmBtn) confirmBtn.click();
                                await sleep(1000);

                                scoreVal = 89;
                                downgradedCourses.push(`${task.course}`);
                                fillFormExact(89);
                                await sleep(1500);

                                if (!submitBtn.disabled) {
                                    submitBtn.click();
                                    const confirmBox2 = await waitForElement('.el-message-box__btns', 5000);
                                    if (confirmBox2) {
                                        const finalOk = confirmBox2.querySelector('.el-button--primary');
                                        if (finalOk) finalOk.click();
                                    }
                                }
                            }
                            // 场景 B：普通确认
                            else {
                                if (confirmBtn) confirmBtn.click();
                            }
                        }

                        // 等待返回列表
                        statusEl.innerText = '等待返回...';
                        await waitForElement('.el-table__body-wrapper', 15000);
                        await sleep(1500);

                        statusEl.className = 'gm-status-success';
                        statusEl.innerText = `完成(${scoreVal})`;
                    } else {
                        throw new Error("未找到提交按钮");
                    }

                } catch (e) {
                    console.error(e);
                    statusEl.className = 'gm-status-error';
                    statusEl.innerText = '失败';
                    const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('取消') || b.innerText.includes('返回'));
                    if (backBtn) {
                        backBtn.click();
                        await waitForElement('.el-table__body-wrapper', 5000);
                    }
                    await sleep(2000);
                }
            }

            btnMin.innerText = "流程结束";
            btnRun.innerText = "流程结束";

            let finishMsg = "所有任务处理完成！";
            if (downgradedCourses.length > 0) {
                finishMsg += `\n\n⚠️ 检测到优秀率限制，以下课程已自动降为 89 分：\n` + downgradedCourses.join('\n');
            }
            finishMsg += "\n\n建议刷新页面更新状态。是否刷新？";

            if (confirm(finishMsg)) {
                window.location.reload();
            }
        };

        // --- 功能 A: 自动完成最低评教 ---
        btnMin.onclick = () => {
            document.querySelectorAll('.gm-item-check').forEach(c => c.checked = false);
            document.querySelectorAll('.gm-score-input').forEach(i => {
                if(!i.disabled) i.value = '';
            });

            const itemsToRun = [];
            let skippedCourses = 0;

            for (const [courseName, teachers] of Object.entries(courseGroups)) {
                const alreadyDone = teachers.some(t => t.isDone) || (teachers.length > 0 && teachers[0].courseIsDone);
                if (alreadyDone) {
                    skippedCourses++;
                    continue;
                }
                if (teachers.length > 0) {
                    const target = teachers[0];
                    if (target.isDone) continue;

                    const checkbox = document.querySelector(`.gm-item-check[data-id="${target.id}"]`);
                    const scoreInput = document.getElementById(`score-${target.id}`);

                    if (checkbox && scoreInput && !checkbox.disabled) {
                        checkbox.checked = true;
                        // 随机 80 - 89 分
                        scoreInput.value = Math.floor(Math.random() * 10) + 80;
                        itemsToRun.push(target);
                    }
                }
            }

            if (itemsToRun.length === 0) {
                alert(`没有待处理的最低评教任务。\n\n已跳过 ${skippedCourses} 门已完成(或部分完成)的课程。`);
                return;
            }

            if (confirm(`即将对 ${itemsToRun.length} 门课程进行最低标准评教（每门课评1人，随机80-89分）。\n\n是否开始？`)) {
                executeTasks(itemsToRun);
            }
        };

        // --- 功能 B: 开始评教---
        btnRun.onclick = () => {
            const selectedIds = Array.from(document.querySelectorAll('.gm-item-check:checked'))
                .filter(cb => !cb.disabled)
                .map(cb => parseInt(cb.dataset.id));

            const itemsToRun = taskList.filter(t => selectedIds.includes(t.id));

            if (itemsToRun.length === 0) {
                alert("请至少勾选一个待评任务！");
                return;
            }

            let hasEmptyScore = false;
            itemsToRun.forEach(t => {
                const val = document.getElementById(`score-${t.id}`).value;
                if (!val) hasEmptyScore = true;
            });

            let msg = `即将对 ${itemsToRun.length} 位教师进行评教。`;
            if (hasEmptyScore) msg += `\n\n⚠️ 注意：部分未填分，默认按 95分 (优秀) 处理。`;
            msg += `\n\n是否开始？`;

            if (confirm(msg)) {
                executeTasks(itemsToRun);
            }
        };
    };

    // --- 4. 入口按钮 ---
    const injectPageButton = () => {
        const targetContainer = document.querySelector('.el-tab-pane .el-select') || document.querySelector('.el-form');
        if (!targetContainer || document.getElementById('gm-page-eval-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'gm-page-eval-btn';
        btn.className = 'el-button el-button--primary el-button--small';
        btn.innerHTML = `<i class="el-icon-s-cooperation"></i> 打开自动评教`;
        btn.style.cssText = 'margin-left: 15px; vertical-align: top; height: 32px; font-weight: bold; box-shadow: 0 2px 6px rgba(64,158,255, 0.3);';

        if (targetContainer.parentNode) targetContainer.parentNode.insertBefore(btn, targetContainer.nextSibling);
        else targetContainer.appendChild(btn);

        btn.onclick = showEvalModal;
    };

    const startObserve = () => {
        const observer = new MutationObserver(() => {
            if (location.href.includes('evaluation-student-frontend')) injectPageButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        injectPageButton();
    };

    if (document.body) startObserve();
    else window.addEventListener('load', startObserve);
}


// =-=-=-=-=-=-=-=-=-=-=-=-= 2.12 人员信息检索模块 =-=-=-=-=-=-=-=-=-=-=-=-=
const PersonnelSearch = {

    STORAGE_KEY: "nwpu_synced_token",
    API_BASE: "https://electronic-signature.nwpu.edu.cn/api/local-user/page",
    state: { page: 1, loading: false, hasMore: true, keyword: "" },

    // 1. Token 同步逻辑 (运行在 ecampus 域名下)
    syncToken() {
        if (location.host !== 'ecampus.nwpu.edu.cn') return;
        const checkAndSave = () => {
            const token = localStorage.getItem('token');
            if (token) {
                // 只要获取到token，就强制更新存储，确保是最新的
                GM_setValue(this.STORAGE_KEY, token);
            }
        };
        // 立即执行一次
        checkAndSave();
        // 稍微延时再执行一次，确保 iframe 加载完全
        setTimeout(checkAndSave, 500);
        setTimeout(checkAndSave, 2000);
    },

    // 2. 打开界面的主入口
    openModal() {
        Logger.log('2.12', "初始化人员信息检索");
        // 先检查本地是否有 Token
        const token = GM_getValue(this.STORAGE_KEY);

        // === 分支 A: 有 Token，直接打开界面 ===
        if (token) {
            if (document.getElementById('gm-person-search-overlay')) return;
            this.injectStyles();
            this.createUI();
            this.resetState();
            return;
        }

        // === 分支 B: 无 Token，启动后台静默同步 ===
        this._startSilentSync();
    },

    // 内部方法：执行静默同步
    _startSilentSync() {
        // 1. 显示提示
        this._showToast("正在后台获取授权，请稍候...");

        // 2. 创建隐形 iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://ecampus.nwpu.edu.cn'; // 目标地址
        iframe.style.display = 'none';
        iframe.id = 'gm-sync-iframe-worker';
        document.body.appendChild(iframe);

        // 3. 轮询检测 Token 是否到位
        let attempts = 0;
        const maxAttempts = 15; // 约 7.5 秒超时

        const timer = setInterval(() => {
            const newToken = GM_getValue(this.STORAGE_KEY);
            if (newToken) {
                // [成功] 拿到 Token 了！
                clearInterval(timer);
                this._cleanupSync();
                this._showToast("授权成功！正在打开界面...", 1000);
                setTimeout(() => this.openModal(), 500); // 递归调用打开界面
            } else {
                // [等待] 还没拿到...
                attempts++;
                if (attempts >= maxAttempts) {
                    // [超时] 可能是没登录，或者网络太慢
                    clearInterval(timer);
                    this._cleanupSync();
                    this._removeToast();
                    if(confirm("后台自动同步超时（可能是您未登录翱翔门户）。\n\n是否打开新窗口手动登录？")) {
                        window.open('https://ecampus.nwpu.edu.cn', '_blank');
                    }
                }
            }
        }, 500); // 每 500ms 检查一次
    },

    // 辅助：清理同步用的临时元素
    _cleanupSync() {
        const frame = document.getElementById('gm-sync-iframe-worker');
        if (frame) frame.remove();
    },

    // 辅助：显示 Toast 提示
    _showToast(msg, duration = 0) {
        let toast = document.getElementById('gm-search-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gm-search-toast';
            toast.style.cssText = 'position:fixed; top:20%; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.75); color:white; padding:12px 24px; border-radius:30px; font-size:14px; z-index:100020; transition:opacity 0.3s; box-shadow:0 4px 15px rgba(0,0,0,0.2); pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.opacity = '1';

        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    },

    _removeToast() {
        const toast = document.getElementById('gm-search-toast');
        if(toast) toast.remove();
    },

    // 3. 注入样式 (含黑白大号学号样式)
    injectStyles() {
        if (document.getElementById('gm-person-search-style')) return;
        const style = document.createElement('style');
        style.id = 'gm-person-search-style';
        style.textContent = `
            .gm-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 10005; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
            .gm-modal-content { background-color: #fff; border-radius: 6px; width: 95%; max-width: 1200px; height: 90vh; max-height: 950px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; overflow: hidden; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; animation: gmFadeIn 0.2s ease-out; }
            @keyframes gmFadeIn { from { opacity: 0; transform: scale(0.99); } to { opacity: 1; transform: scale(1); } }
            .gm-modal-header { padding: 0 20px; border-bottom: 1px solid #eee; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 50px; }
            .gm-modal-title { font-size: 16px; font-weight: bold; color: #333; display: flex; align-items: center; gap: 8px; }
            .gm-modal-close { border: none; background: none; font-size: 24px; color: #999; cursor: pointer; padding: 0 10px; display:flex; align-items:center; }

            .gm-ps-body { display: flex; flex-direction: column; height: 100%; overflow: hidden; padding: 0 !important; }
            .gm-ps-search-bar { padding: 15px 20px; background: #fff; border-bottom: 1px solid #ebeef5; display: flex; gap: 10px; flex-shrink: 0; }
            .gm-ps-input { flex: 1; padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; outline: none; font-size: 14px; transition: border-color 0.2s; color: #606266; }
            .gm-ps-input:focus { border-color: #409EFF; }
            .gm-ps-btn { padding: 8px 20px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s; }
            .gm-ps-btn:hover { background: #66b1ff; }

            .gm-ps-list-container { flex: 1; overflow-y: auto; padding: 0; position: relative; }
            .gm-ps-table { width: 100%; border-collapse: collapse; font-size: 13px; }
            .gm-ps-table th { position: sticky; top: 0; background: #f8f9fa; color: #606266; font-weight: bold; padding: 12px 15px; text-align: left; border-bottom: 1px solid #ebeef5; z-index: 10; }
            .gm-ps-table td { padding: 12px 15px; border-bottom: 1px solid #ebeef5; color: #606266; vertical-align: middle; }
            .gm-ps-table tr:hover { background-color: #f5f7fa; }

            /* 学号样式：黑白、加大、加粗 */
            .gm-ps-tag {
                background: #f0f0f0;
                color: #000000;
                border: 1px solid #bbb;
                padding: 6px 10px;
                border-radius: 4px;
                font-family: Consolas, monospace;
                font-size: 15px;
                font-weight: bold;
                letter-spacing: 0.5px;
            }
            .gm-ps-loader { padding: 20px; text-align: center; color: #909399; font-size: 13px; }
        `;
        document.head.appendChild(style);
    },

    createUI() {
        const overlay = document.createElement('div');
        overlay.id = 'gm-person-search-overlay';
        overlay.className = 'gm-modal-overlay';

        overlay.innerHTML = `
            <div class="gm-modal-content" style="width: 650px; height: 70vh; max-height: 800px;">
                <div class="gm-modal-header">
                    <div class="gm-modal-title">
                        <span style="font-size:18px; margin-right:5px; font-weight:bold;">人员信息检索
                    </div>
                    <button class="gm-modal-close" id="gm-ps-close">×</button>
                </div>
                <div class="gm-modal-body gm-ps-body">
                    <div class="gm-ps-search-bar">
                        <input type="text" id="gm-ps-input" class="gm-ps-input" placeholder="输入姓名、学号或工号">
                        <button id="gm-ps-btn" class="gm-ps-btn">搜索</button>
                    </div>
                    <div class="gm-ps-list-container" id="gm-ps-scroll-area">
                        <table class="gm-ps-table">
                            <thead>
                                <tr>
                                    <th width="30%">姓名</th>
                                    <th width="35%">学号/工号</th>
                                    <th>学院/单位</th>
                                </tr>
                            </thead>
                            <tbody id="gm-ps-tbody"></tbody>
                        </table>
                        <div id="gm-ps-loader" class="gm-ps-loader">请输入关键词开始搜索</div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const closeFn = () => overlay.remove();
        document.getElementById('gm-ps-close').onclick = closeFn;
        overlay.onclick = (e) => { if(e.target === overlay) closeFn(); };

        const doSearch = () => {
            const val = document.getElementById('gm-ps-input').value.trim();
            if(val) {
                this.state.keyword = val;
                this.resetState();
                this.fetchData();
            }
        };
        document.getElementById('gm-ps-btn').onclick = doSearch;
        document.getElementById('gm-ps-input').onkeypress = (e) => { if(e.key === 'Enter') doSearch(); };

        const scrollArea = document.getElementById('gm-ps-scroll-area');
        scrollArea.onscroll = () => {
            if (scrollArea.scrollTop + scrollArea.clientHeight >= scrollArea.scrollHeight - 30) {
                if (!this.state.loading && this.state.hasMore) this.fetchData();
            }
        };
    },

    resetState() {
        this.state = { page: 1, loading: false, hasMore: true, keyword: this.state.keyword };
        const tbody = document.getElementById('gm-ps-tbody');
        if(tbody) tbody.innerHTML = '';
        const loader = document.getElementById('gm-ps-loader');
        if(loader) {
            loader.style.display = 'block';
            loader.innerText = this.state.keyword ? '正在搜索...' : '请输入关键词';
        }
    },

    fetchData() {
        const token = GM_getValue(this.STORAGE_KEY);
        if(!token || !this.state.keyword) return;

        this.state.loading = true;
        const loader = document.getElementById('gm-ps-loader');
        if(loader) loader.innerText = "加载中...";

        GM_xmlhttpRequest({
            method: "GET",
            url: `${this.API_BASE}?current=${this.state.page}&size=20&keyword=${encodeURIComponent(this.state.keyword)}`,
            headers: { "X-Id-Token": token, "X-Requested-With": "XMLHttpRequest" },
            onload: (res) => {
                this.state.loading = false;
                try {
                    const resp = JSON.parse(res.responseText);
                    if (resp.success && resp.data.records) {
                        this.renderRows(resp.data.records);
                        const total = resp.data.total;

                        if (resp.data.records.length < 20 || this.state.page * 20 >= total) {
                            this.state.hasMore = false;
                            if(loader) loader.innerText = `— 已显示全部 ${total} 条结果 —`;
                        } else {
                            this.state.page++;
                            if(loader) loader.innerText = "向下滚动加载更多...";
                        }

                        if (total === 0 && this.state.page === 1) {
                            if(loader) loader.innerText = "未找到相关人员";
                        }
                    } else {
                        // Token失效时，清空存储并重新触发静默同步
                        if(loader) loader.innerText = "授权过期，正在自动刷新...";
                        GM_setValue(this.STORAGE_KEY, "");
                        setTimeout(() => this._startSilentSync(), 1000);
                    }
                } catch (e) {
                    if(loader) loader.innerText = "解析数据失败";
                }
            },
            onerror: () => {
                this.state.loading = false;
                if(loader) loader.innerText = "网络请求失败";
            }
        });
    },

    renderRows(items) {
        const tbody = document.getElementById('gm-ps-tbody');
        if(!tbody) return;
        items.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="color:#303133;font-weight:600">${item.xm || '-'}</span></td>
                <td><span class="gm-ps-tag">${item.gh || '-'}</span></td>
                <td>${item.yxmc || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    }
};

// --- 3. 脚本主入口 (路由分发) ---

function runMainFeatures() {
    const href = window.location.href;

    // 0. 【最高优先级】后台 Worker
    if (window.name === BackgroundSyncSystem.WORKER_NAME) {
        BackgroundSyncSystem.startWorker();
        return;
    }

    if (window.frameElement && window.frameElement.id === 'gm-id-fetcher-patch') {
        return;
    }

    // 门户(ecampus) Token同步
    // 如果在门户网站，只运行Token同步，不运行其他教务逻辑
    if (location.host === 'ecampus.nwpu.edu.cn') {
        PersonnelSearch.syncToken();
        return;
    }

    // 1. 评教页面检测
    if (href.includes('evaluation-student-frontend')) {
        window.addEventListener('load', initEvaluationHelper);
        window.addEventListener('hashchange', () => {
             if(window.location.hash.includes('byTask')) initEvaluationHelper();
        });
        setTimeout(initEvaluationHelper, 2000); // 兜底
    }

    // 2. 开课查询页面
    else if (href.includes('/student/for-std/lesson-search')) {
        if(document.body) initLessonSearchPage();
    }

    // 3. 学生画像页面
    else if (href.includes('/student/for-std/student-portrait')) {
        if (ConfigManager.enablePortraitEnhancement) {
            enhancePortraitPage(); // 功能3
        }
    }

    // 4. 培养方案页面
    else if (href.includes('/student/for-std/program/info/') ||
             href.includes('/student/for-std/program-completion-preview/info/') ||
             href.includes('/student/for-std/majorPrograms/info/')) {
        initProgramPageEnhancement(); // 功能8
    }

    // 5. 顶层主页
    else if (window.top === window.self) {
        initializeHomePageFeatures();
        // 延迟启动后台控制器
        setTimeout(() => {
            BackgroundSyncSystem.initController();
        }, 5000);
    }
}

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', runMainFeatures);
    } else {
        runMainFeatures();
    }

})();