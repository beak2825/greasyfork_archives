// ==UserScript==
// @name         Enhanced GPA Calculator
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  现代化设计的GPA计算器，支持全屏自由拖动、手动计算、课程筛选和导出功能
// @author       Toony
// @match        https://jw.ahu.edu.cn/student/home
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526837/Enhanced%20GPA%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/526837/Enhanced%20GPA%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置选项
    const CONFIG = {
        defaultExcludedCourses: ['GG18002', 'GG82001'],
        animationDuration: 300,
        storageKeys: {
            position: 'gpaCalculatorPosition',
            darkMode: 'gpaCalculatorDarkMode',
            excludedCourses: 'gpaCalculatorExcludedCourses',
            history: 'gpaCalculatorHistory'
        }
    };

    // 缓存DOM元素的引用
    const DOM = {
        container: null,
        gpaValue: null,
        creditsValue: null,
        pointsValue: null,
        excludedCoursesList: null,
        historyList: null,
        manualCredits: null,
        manualPoints: null,
        manualGpaResult: null
    };

    // 状态管理
    const state = {
        isDragging: false,
        currentX: 0,
        currentY: 0,
        initialX: 0,
        initialY: 0,
        xOffset: 0,
        yOffset: 0,
        isDarkMode: false,
        excludedCourses: [...CONFIG.defaultExcludedCourses],
        calculationHistory: [],
        currentTab: 'stats', // 'stats', 'courses', 'history', 'manual', 'export'
        lastCalculatedGPA: null,
        courseCategories: {}, // 用于存储课程分类统计
        courseGrades: [] // 用于存储所有课程成绩
    };

    /**
     * 计算GPA的核心功能
     * @param {Document} doc - 包含成绩表的文档对象
     * @returns {Object|null} - 计算结果或null
     */
    function calculateGPA(doc) {
        try {
            const tables = doc.querySelectorAll('.student-grade-table');
            if (tables.length === 0) return null;

            let totalGPA = 0;
            let totalCredits = 0;
            let totalGradePoints = 0;
            let courseDetails = [];
            state.courseCategories = {}; // 重置分类统计
            state.courseGrades = []; // 重置成绩数组

            tables.forEach(table => {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    try {
                        const courseCodeElement = row.querySelector('td div.text-color-6.one-line-nowarp span[data-original-title="课程代码"]');
                        let courseCode = courseCodeElement ? courseCodeElement.textContent.trim() : '';

                        // 检查课程是否被排除
                        if (state.excludedCourses.includes(courseCode)) return;

                        const cells = row.cells;
                        if (cells.length < 3) return;

                        // 获取课程名称 - 修复选择器，课程名称在div.course-name中
                        const courseNameElement = row.querySelector('td div.course-name');
                        let courseName = courseNameElement ? courseNameElement.textContent.trim() : '未知课程';

                        // 获取课程分类
                        const courseCategoryElement = row.querySelector('td div.text-color-6.one-line-nowarp span[data-original-title="课程分类"]');
                        let courseCategory = courseCategoryElement ? courseCategoryElement.textContent.trim() : '未知分类';

                        const creditsCell = cells[1];
                        const gpaCell = cells[2];
                        const gradeCell = cells[3];

                        if (creditsCell && gpaCell) {
                            const credits = parseFloat(creditsCell.textContent.trim());
                            const gpa = parseFloat(gpaCell.textContent.trim());
                            const grade = gradeCell ? gradeCell.textContent.trim() : '';

                            if (!isNaN(credits) && !isNaN(gpa)) {
                                totalGPA += credits * gpa;
                                totalCredits += credits;
                                totalGradePoints += credits * gpa;

                                // 更新分类统计
                                if (!state.courseCategories[courseCategory]) {
                                    state.courseCategories[courseCategory] = {
                                        totalCredits: 0,
                                        totalPoints: 0,
                                        count: 0
                                    };
                                }
                                state.courseCategories[courseCategory].totalCredits += credits;
                                state.courseCategories[courseCategory].totalPoints += credits * gpa;
                                state.courseCategories[courseCategory].count += 1;

                                // 保存成绩分布
                                state.courseGrades.push({
                                    gpa: gpa,
                                    credits: credits
                                });

                                // 保存课程详情
                                courseDetails.push({
                                    code: courseCode,
                                    name: courseName,
                                    category: courseCategory,
                                    credits: credits,
                                    gpa: gpa,
                                    grade: grade,
                                    points: credits * gpa
                                });
                            }
                        }
                    } catch (rowError) {
                        console.error('处理课程行时出错:', rowError);
                    }
                });
            });

            if (totalCredits === 0) return null;

            // 排序课程详情
            courseDetails.sort((a, b) => b.gpa - a.gpa);

            const result = {
                gpa: totalGPA / totalCredits,
                totalCredits: totalCredits,
                totalGradePoints: totalGradePoints,
                courses: courseDetails,
                categories: state.courseCategories,
                timestamp: new Date().toISOString()
            };

            // 保存到状态
            state.lastCalculatedGPA = result;

            // 保存到历史记录
            saveToHistory(result);

            return result;
        } catch (error) {
            console.error('计算GPA时出错:', error);
            return null;
        }
    }

    /**
     * 手动计算GPA
     * @param {number} credits - 总学分
     * @param {number} points - 总绩点
     * @returns {number} - 计算得到的GPA
     */
    function calculateManualGPA(credits, points) {
        if (credits <= 0) return 0;
        return points / credits;
    }

    /**
     * 保存计算结果到历史记录
     * @param {Object} result - GPA计算结果
     */
    function saveToHistory(result) {
        // 只保存主要数据到历史记录
        const historyEntry = {
            gpa: result.gpa,
            totalCredits: result.totalCredits,
            totalGradePoints: result.totalGradePoints,
            timestamp: result.timestamp,
            excludedCourses: [...state.excludedCourses]
        };

        // 限制历史记录最多保存10条
        state.calculationHistory.unshift(historyEntry);
        if (state.calculationHistory.length > 10) {
            state.calculationHistory.pop();
        }

        // 保存到存储
        GM_setValue(CONFIG.storageKeys.history, JSON.stringify(state.calculationHistory));
    }

    /**
     * 从存储加载数据
     */
    function loadSavedData() {
        try {
            // 加载位置
            const savedPosition = GM_getValue(CONFIG.storageKeys.position);
            if (savedPosition) {
                const position = JSON.parse(savedPosition);
                state.xOffset = position.x || 0;
                state.yOffset = position.y || 0;
            }

            // 加载主题
            const savedDarkMode = GM_getValue(CONFIG.storageKeys.darkMode);
            if (savedDarkMode !== undefined) {
                state.isDarkMode = savedDarkMode === 'true';
            }

            // 加载排除课程
            const savedExcludedCourses = GM_getValue(CONFIG.storageKeys.excludedCourses);
            if (savedExcludedCourses) {
                state.excludedCourses = JSON.parse(savedExcludedCourses);
            }

            // 加载历史记录
            const savedHistory = GM_getValue(CONFIG.storageKeys.history);
            if (savedHistory) {
                state.calculationHistory = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('加载保存的数据时出错:', error);
            // 出错时使用默认值
        }
    }

    /**
     * 保存位置信息
     */
    function savePosition() {
        const position = { x: state.xOffset, y: state.yOffset };
        GM_setValue(CONFIG.storageKeys.position, JSON.stringify(position));
    }

    /**
     * 保存深色模式设置
     */
    function saveDarkMode() {
        GM_setValue(CONFIG.storageKeys.darkMode, state.isDarkMode.toString());
    }

    /**
     * 保存排除课程列表
     */
    function saveExcludedCourses() {
        GM_setValue(CONFIG.storageKeys.excludedCourses, JSON.stringify(state.excludedCourses));
    }

    /**
     * 创建样式
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .gpa-calculator {
                position: fixed;
                top: 0;
                left: 0;
                width: 320px;
                background: linear-gradient(145deg, #ffffff, #f5f5f5);
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                transition: all 0.3s ease, transform 0.1s ease;
                z-index: 9999;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                transform: translate(20px, 20px);
            }

            .gpa-calculator.dark-mode {
                background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
                color: #ffffff;
                box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            }

            .gpa-calculator:hover {
                box-shadow: 0 15px 30px rgba(0,0,0,0.15);
            }

            .gpa-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 2px solid #eee;
            }

            .dark-mode .gpa-header {
                border-bottom-color: #444;
            }

            .gpa-title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin: 0;
                user-select: none;
            }

            .dark-mode .gpa-title {
                color: #fff;
            }

            .gpa-controls {
                display: flex;
                gap: 10px;
            }

            .gpa-button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .gpa-button:hover {
                background: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }

            .gpa-button:active {
                transform: translateY(0);
                box-shadow: none;
            }

            .gpa-button.secondary {
                background: #2196F3;
            }

            .gpa-button.secondary:hover {
                background: #1E88E5;
            }

            .gpa-button.danger {
                background: #F44336;
            }

            .gpa-button.danger:hover {
                background: #E53935;
            }

            .gpa-button.small {
                padding: 4px 8px;
                font-size: 12px;
            }

            .gpa-theme-toggle {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease;
            }

            .gpa-theme-toggle:hover {
                transform: rotate(30deg);
            }

            .gpa-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 15px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                flex-wrap: wrap;
            }

            .dark-mode .gpa-tabs {
                border-bottom-color: #444;
            }

            .gpa-tab {
                padding: 5px 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s ease;
                font-size: 14px;
                user-select: none;
                margin-bottom: 5px;
            }

            .gpa-tab:hover {
                background: rgba(0, 0, 0, 0.05);
            }

            .dark-mode .gpa-tab:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            .gpa-tab.active {
                background: #4CAF50;
                color: white;
            }

            .tab-content {
                display: none;
                animation: fadeIn 0.3s ease-out;
                overflow-y: auto;
                max-height: 300px;
                scrollbar-width: thin;
            }

            .tab-content.active {
                display: block;
            }

            .gpa-content {
                display: grid;
                gap: 15px;
            }

            .gpa-stat {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }

            .dark-mode .gpa-stat {
                background: rgba(255, 255, 255, 0.1);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            .gpa-stat:hover {
                transform: translateX(5px);
            }

            .gpa-stat-label {
                font-size: 14px;
                color: #666;
            }

            .dark-mode .gpa-stat-label {
                color: #aaa;
            }

            .gpa-stat-value {
                font-size: 24px;
                font-weight: 600;
                color: #2196F3;
            }

            .dark-mode .gpa-stat-value {
                color: #64B5F6;
            }

            .gpa-error {
                color: #f44336;
                font-size: 14px;
                text-align: center;
                padding: 15px;
            }

            .dark-mode .gpa-error {
                color: #ef9a9a;
            }

            .move-handle {
                cursor: move;
                padding: 5px;
                margin: -5px;
                user-select: none;
            }

            .course-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .course-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .dark-mode .course-item {
                background: rgba(255, 255, 255, 0.1);
            }

            .course-info {
                flex: 1;
            }

            .course-code {
                font-size: 12px;
                color: #666;
            }

            .dark-mode .course-code {
                color: #aaa;
            }

            .course-name {
                font-weight: 500;
            }

            .course-detail {
                font-size: 12px;
                color: #666;
                margin-top: 2px;
            }

            .dark-mode .course-detail {
                color: #aaa;
            }

            .course-gpa {
                font-weight: 600;
                color: #2196F3;
            }

            .dark-mode .course-gpa {
                color: #64B5F6;
            }

            .excluded-courses {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .excluded-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255, 255, 255, 0.9);
                padding: 10px;
                border-radius: 8px;
            }

            .dark-mode .excluded-item {
                background: rgba(255, 255, 255, 0.1);
            }

            .add-excluded {
                display: flex;
                gap: 5px;
                margin-top: 10px;
            }

            .add-excluded input {
                flex: 1;
                padding: 8px;
                border-radius: 5px;
                border: 1px solid #ddd;
                background: #fff;
            }

            .dark-mode .add-excluded input {
                background: #333;
                border-color: #555;
                color: #fff;
            }

            .history-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .history-item {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
                transition: all 0.2s ease;
            }

            .dark-mode .history-item {
                background: rgba(255, 255, 255, 0.1);
            }

            .history-date {
                font-size: 12px;
                color: #666;
                margin-bottom: 5px;
            }

            .dark-mode .history-date {
                color: #aaa;
            }

            .history-value {
                font-size: 18px;
                font-weight: 600;
                color: #2196F3;
            }

            .dark-mode .history-value {
                color: #64B5F6;
            }

            .history-details {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
            }

            .dark-mode .history-details {
                color: #aaa;
            }

            .manual-calculator {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .manual-form {
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
            }

            .dark-mode .manual-form {
                background: rgba(255, 255, 255, 0.1);
            }

            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .form-group label {
                font-size: 14px;
                color: #666;
            }

            .dark-mode .form-group label {
                color: #aaa;
            }

            .form-group input {
                padding: 8px;
                border-radius: 5px;
                border: 1px solid #ddd;
                background: #fff;
            }

            .dark-mode .form-group input {
                background: #333;
                border-color: #555;
                color: #fff;
            }

            .manual-result {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                text-align: center;
            }

            .dark-mode .manual-result {
                background: rgba(255, 255, 255, 0.1);
            }

            .manual-gpa {
                font-size: 32px;
                font-weight: 600;
                color: #2196F3;
            }

            .dark-mode .manual-gpa {
                color: #64B5F6;
            }

            .category-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .category-item {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
            }

            .dark-mode .category-item {
                background: rgba(255, 255, 255, 0.1);
            }

            .category-name {
                font-weight: 600;
                margin-bottom: 5px;
            }

            .category-stats {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #666;
            }

            .dark-mode .category-stats {
                color: #aaa;
            }

            .export-section {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .export-option {
                background: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-radius: 12px;
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .dark-mode .export-option {
                background: rgba(255, 255, 255, 0.1);
            }

            .export-icon {
                font-size: 24px;
            }

            .export-info {
                flex: 1;
            }

            .export-title {
                font-weight: 600;
                margin-bottom: 3px;
            }

            .export-desc {
                font-size: 12px;
                color: #666;
            }

            .dark-mode .export-desc {
                color: #aaa;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* 滚动条样式 */
            .tab-content::-webkit-scrollbar {
                width: 6px;
            }

            .tab-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 10px;
            }

            .tab-content::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }

            .dark-mode .tab-content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }

            .dark-mode .tab-content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
            }

            /* 分布图样式 */
            .distribution-chart {
                width: 100%;
                height: 8px;
                background: #eee;
                border-radius: 4px;
                margin-top: 10px;
                position: relative;
                overflow: hidden;
            }

            .dark-mode .distribution-chart {
                background: #444;
            }

            .chart-segment {
                height: 100%;
                position: absolute;
                transition: width 0.5s ease;
            }

            .segment-excellent {
                background: #4CAF50;
                left: 0;
            }

            .segment-good {
                background: #2196F3;
            }

            .segment-average {
                background: #FFC107;
            }

            .segment-poor {
                background: #F44336;
                right: 0;
            }

            .chart-legend {
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
                font-size: 10px;
                color: #666;
            }

            .dark-mode .chart-legend {
                color: #aaa;
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 3px;
            }

            .legend-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }

            .dot-excellent {
                background: #4CAF50;
            }

            .dot-good {
                background: #2196F3;
            }

            .dot-average {
                background: #FFC107;
            }

            .dot-poor {
                background: #F44336;
            }

            .filter-options {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 15px;
            }

            .filter-tag {
                background: #eee;
                padding: 3px 8px;
                border-radius: 15px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .dark-mode .filter-tag {
                background: #444;
            }

            .filter-tag:hover {
                background: #ddd;
            }

            .dark-mode .filter-tag:hover {
                background: #555;
            }

            .filter-tag.active {
                background: #4CAF50;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 创建UI界面
     * @returns {HTMLElement} 计算器容器元素
     */
    function createGPADisplay() {
        const container = document.createElement('div');
        container.className = 'gpa-calculator';
        if (state.isDarkMode) {
            container.classList.add('dark-mode');
        }

        container.innerHTML = `
            <div class="gpa-header">
                <div class="move-handle">
                    <div class="gpa-title">GPA 计算器</div>
                </div>
                <div class="gpa-controls">
                    <button class="gpa-theme-toggle" title="切换主题">${state.isDarkMode ? '🌞' : '🌙'}</button>
                    <button class="gpa-button" id="calculate-gpa">
                        <span>计算</span>
                        <span class="calculation-icon">📊</span>
                    </button>
                </div>
            </div>

            <div class="gpa-tabs">
                <div class="gpa-tab active" data-tab="stats">统计</div>
                <div class="gpa-tab" data-tab="courses">课程</div>
                <div class="gpa-tab" data-tab="manual">手动计算</div>
                <div class="gpa-tab" data-tab="history">历史</div>
                <div class="gpa-tab" data-tab="export">导出</div>
            </div>

            <div id="stats-tab" class="tab-content active">
                <div class="gpa-content">
                    <div class="gpa-stat">
                        <span class="gpa-stat-label">总平均 GPA</span>
                        <span class="gpa-stat-value" id="gpa-value">-</span>
                    </div>
                    <div class="gpa-stat">
                        <span class="gpa-stat-label">总学分</span>
                        <span class="gpa-stat-value" id="credits-value">-</span>
                    </div>
                    <div class="gpa-stat">
                        <span class="gpa-stat-label">总绩点</span>
                        <span class="gpa-stat-value" id="points-value">-</span>
                    </div>

                    <div class="gpa-stat">
                        <span class="gpa-stat-label">成绩分布</span>
                        <div class="distribution-chart">
                            <div class="chart-segment segment-excellent" style="width: 0%"></div>
                            <div class="chart-segment segment-good" style="width: 0%"></div>
                            <div class="chart-segment segment-average" style="width: 0%"></div>
                            <div class="chart-segment segment-poor" style="width: 0%"></div>
                        </div>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-dot dot-excellent"></span>
                                <span>90+</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot dot-good"></span>
                                <span>80-89</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot dot-average"></span>
                                <span>70-79</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-dot dot-poor"></span>
                                <span>≤69</span>
                            </div>
                        </div>
                    </div>

                    <h3>课程分类统计</h3>
                    <div class="category-list" id="category-stats">
                        <div class="gpa-error">请先计算GPA以查看分类统计</div>
                    </div>
                </div>
            </div>

            <div id="courses-tab" class="tab-content">
                <h3>排除的课程</h3>
                <div class="excluded-courses" id="excluded-courses-list">
                    ${state.excludedCourses.map(code => `
                        <div class="excluded-item" data-code="${code}">
                            <span>${code}</span>
                            <button class="gpa-button small danger remove-excluded">移除</button>
                        </div>
                    `).join('')}
                </div>
                <div class="add-excluded">
                    <input type="text" id="new-excluded-course" placeholder="输入课程代码">
                    <button class="gpa-button small" id="add-excluded-btn">添加</button>
                </div>
                <h3>课程列表</h3>
                <div class="filter-options" id="category-filters">
                    <div class="filter-tag active" data-category="all">全部</div>
                </div>
                <div class="course-list" id="course-list">
                    <div class="gpa-error">请先计算GPA以查看课程列表</div>
                </div>
            </div>

            <div id="manual-tab" class="tab-content">
                <div class="manual-calculator">
                    <div class="manual-form">
                        <div class="form-group">
                            <label for="manual-credits">总学分</label>
                            <input type="number" id="manual-credits" placeholder="输入总学分" step="0.1" min="0">
                        </div>
                        <div class="form-group">
                            <label for="manual-points">总绩点</label>
                            <input type="number" id="manual-points" placeholder="输入总绩点" step="0.1" min="0">
                        </div>
                        <button class="gpa-button" id="calculate-manual">计算</button>
                    </div>
                    <div class="manual-result">
                        <div class="gpa-stat-label">计算结果</div>
                        <div class="manual-gpa" id="manual-gpa-result">-</div>
                    </div>
                    <div class="gpa-error" id="manual-error" style="display: none;"></div>
                </div>
            </div>

            <div id="history-tab" class="tab-content">
                <div class="history-list" id="history-list">
                    ${state.calculationHistory.length === 0 ?
                        '<div class="gpa-error">暂无历史记录</div>' :
                        state.calculationHistory.map(entry => {
                            const date = new Date(entry.timestamp);
                            return `
                                <div class="history-item">
                                    <div class="history-date">${date.toLocaleString()}</div>
                                    <div class="history-value">GPA: ${entry.gpa.toFixed(4)}</div>
                                    <div class="history-details">
                                        学分: ${entry.totalCredits.toFixed(1)} |
                                        总绩点: ${entry.totalGradePoints.toFixed(4)}
                                    </div>
                                </div>
                            `;
                        }).join('')
                    }
                </div>
            </div>

            <div id="export-tab" class="tab-content">
                <div class="export-section">
                    <div class="export-option">
                        <div class="export-icon">📋</div>
                        <div class="export-info">
                            <div class="export-title">复制为文本</div>
                            <div class="export-desc">将GPA计算结果复制为纯文本格式</div>
                        </div>
                        <button class="gpa-button small" id="export-text">复制</button>
                    </div>
                    <div class="export-option">
                        <div class="export-icon">📊</div>
                        <div class="export-info">
                            <div class="export-title">导出为CSV</div>
                            <div class="export-desc">导出课程详细成绩为CSV文件</div>
                        </div>
                        <button class="gpa-button small" id="export-csv">导出</button>
                    </div>
                    <div class="export-option">
                        <div class="export-icon">🖨️</div>
                        <div class="export-info">
                            <div class="export-title">打印成绩单</div>
                            <div class="export-desc">生成打印友好的成绩单</div>
                        </div>
                        <button class="gpa-button small" id="export-print">打印</button>
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * 使元素可拖动
     * @param {HTMLElement} element - 需要拖动的元素
     */
    function makeDraggable(element) {
        const handle = element.querySelector('.move-handle');

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.button !== 0) return; // 只响应左键

            state.initialX = e.clientX - state.xOffset;
            state.initialY = e.clientY - state.yOffset;

            if (e.target === handle || handle.contains(e.target)) {
                state.isDragging = true;
                element.style.transition = 'none';
            }
        }

        function drag(e) {
            if (state.isDragging) {
                e.preventDefault();

                state.currentX = e.clientX - state.initialX;
                state.currentY = e.clientY - state.initialY;

                // 边界检查
                const rect = element.getBoundingClientRect();
                const maxX = window.innerWidth - rect.width;
                const maxY = window.innerHeight - rect.height;

                state.xOffset = Math.min(Math.max(0, state.currentX), maxX);
                state.yOffset = Math.min(Math.max(0, state.currentY), maxY);

                updateElementPosition(element);
            }
        }

        function dragEnd() {
            if (state.isDragging) {
                state.isDragging = false;
                element.style.transition = 'all 0.3s ease, transform 0.1s ease';
                savePosition();
            }
        }
    }

    /**
     * 更新元素位置
     * @param {HTMLElement} element - 需要更新位置的元素
     */
    function updateElementPosition(element) {
        element.style.transform = `translate(${state.xOffset}px, ${state.yOffset}px)`;
    }

    /**
     * 更新GPA显示
     * @param {Object|null} gpaData - GPA计算结果
     */
    function updateGPADisplay(gpaData) {
        if (gpaData === null) {
            const statsContent = DOM.container.querySelector('.gpa-content');
            statsContent.innerHTML = `
                <div class="gpa-error">
                    未找到成绩表格或有效数据
                </div>
            `;

            // 清空课程列表
            const courseList = DOM.container.querySelector('#course-list');
            courseList.innerHTML = '<div class="gpa-error">无可用数据</div>';

            // 清空分类列表
            const categoryStats = DOM.container.querySelector('#category-stats');
            categoryStats.innerHTML = '<div class="gpa-error">无可用数据</div>';

            return;
        }

        // 更新统计数据
        DOM.gpaValue.textContent = gpaData.gpa.toFixed(4);
        DOM.creditsValue.textContent = gpaData.totalCredits.toFixed(1);
        DOM.pointsValue.textContent = gpaData.totalGradePoints.toFixed(4);

        // 添加动画效果
        [DOM.gpaValue, DOM.creditsValue, DOM.pointsValue].forEach(el => {
            el.style.animation = 'none';
            el.offsetHeight; // 触发重绘
            el.style.animation = 'fadeIn 0.5s ease-out';
        });

        // 更新成绩分布
        updateGradeDistribution(state.courseGrades);

        // 更新分类统计
        updateCategoryStats(gpaData.categories);

        // 更新课程列表和过滤器
        updateCourseFilters(gpaData.courses);
        updateCourseList(gpaData.courses);

        // 更新历史记录列表
        updateHistoryList();

        // 将最新计算结果填充到手动计算器
        if (DOM.manualCredits && DOM.manualPoints) {
            DOM.manualCredits.value = gpaData.totalCredits.toFixed(1);
            DOM.manualPoints.value = gpaData.totalGradePoints.toFixed(2);
        }
    }

    /**
     * 更新成绩分布
     * @param {Array} grades - 成绩数组
     */
    function updateGradeDistribution(grades) {
        if (!grades || grades.length === 0) return;

        // 计算成绩分布
        let excellent = 0, good = 0, average = 0, poor = 0;
        let totalCredits = 0;

        grades.forEach(grade => {
            if (grade.gpa >= 4.5) { // 90-100分
                excellent += grade.credits;
            } else if (grade.gpa >= 3.5) { // 80-89分
                good += grade.credits;
            } else if (grade.gpa >= 2.5) { // 70-79分
                average += grade.credits;
            } else { // 60-69分
                poor += grade.credits;
            }
            totalCredits += grade.credits;
        });

        // 计算百分比
        const excellentPercent = (excellent / totalCredits) * 100;
        const goodPercent = (good / totalCredits) * 100;
        const averagePercent = (average / totalCredits) * 100;
        const poorPercent = (poor / totalCredits) * 100;

        // 更新图表
        const chartSegments = DOM.container.querySelectorAll('.chart-segment');
        chartSegments[0].style.width = `${excellentPercent}%`;
        chartSegments[1].style.width = `${goodPercent}%`;
        chartSegments[1].style.left = `${excellentPercent}%`;
        chartSegments[2].style.width = `${averagePercent}%`;
        chartSegments[2].style.left = `${excellentPercent + goodPercent}%`;
        chartSegments[3].style.width = `${poorPercent}%`;
    }

    /**
     * 更新分类统计
     * @param {Object} categories - 课程分类统计
     */
    function updateCategoryStats(categories) {
        const categoryStats = DOM.container.querySelector('#category-stats');
        if (!categories || Object.keys(categories).length === 0) {
            categoryStats.innerHTML = '<div class="gpa-error">无分类数据</div>';
            return;
        }

        let categoryHtml = '';
        for (const [category, stats] of Object.entries(categories)) {
            const categoryGPA = stats.totalPoints / stats.totalCredits;
            categoryHtml += `
                <div class="category-item">
                    <div class="category-name">${category}</div>
                    <div class="category-stats">
                        <span>GPA: ${categoryGPA.toFixed(2)}</span>
                        <span>学分: ${stats.totalCredits.toFixed(1)}</span>
                        <span>课程数: ${stats.count}</span>
                    </div>
                </div>
            `;
        }

        categoryStats.innerHTML = categoryHtml;
    }

    /**
     * 更新课程过滤器
     * @param {Array} courses - 课程数组
     */
    function updateCourseFilters(courses) {
        if (!courses || courses.length === 0) return;

        // 获取所有分类
        const categories = new Set();
        courses.forEach(course => categories.add(course.category));

        // 更新过滤器
        const filtersContainer = DOM.container.querySelector('#category-filters');
        let filtersHtml = '<div class="filter-tag active" data-category="all">全部</div>';

        categories.forEach(category => {
            filtersHtml += `<div class="filter-tag" data-category="${category}">${category}</div>`;
        });

        filtersContainer.innerHTML = filtersHtml;

        // 绑定过滤器点击事件
        const filterTags = filtersContainer.querySelectorAll('.filter-tag');
        filterTags.forEach(tag => {
            tag.addEventListener('click', function() {
                filterTags.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const category = this.dataset.category;
                filterCourses(courses, category);
            });
        });
    }

    /**
     * 过滤课程列表
     * @param {Array} courses - 所有课程
     * @param {string} category - 要过滤的分类
     */
    function filterCourses(courses, category) {
        let filteredCourses = courses;
        if (category !== 'all') {
            filteredCourses = courses.filter(course => course.category === category);
        }

        updateCourseList(filteredCourses);
    }

    /**
     * 更新课程列表
     * @param {Array} courses - 课程数组
     */
    function updateCourseList(courses) {
        const courseList = DOM.container.querySelector('#course-list');
        if (!courses || courses.length === 0) {
            courseList.innerHTML = '<div class="gpa-error">无课程数据</div>';
            return;
        }

        courseList.innerHTML = courses.map(course => `
            <div class="course-item">
                <div class="course-info">
                    <div class="course-name">${course.name}</div>
                    <div class="course-code">${course.code}</div>
                    <div class="course-detail">
                        ${course.category} | ${course.credits}学分 | ${course.grade}
                    </div>
                </div>
                <div class="course-gpa">${course.gpa.toFixed(1)}</div>
            </div>
        `).join('');
    }

    /**
     * 更新历史记录列表
     */
    function updateHistoryList() {
        if (!DOM.historyList) return;

        if (state.calculationHistory.length === 0) {
            DOM.historyList.innerHTML = '<div class="gpa-error">暂无历史记录</div>';
            return;
        }

        DOM.historyList.innerHTML = state.calculationHistory.map(entry => {
            const date = new Date(entry.timestamp);
            return `
                <div class="history-item">
                    <div class="history-date">${date.toLocaleString()}</div>
                    <div class="history-value">GPA: ${entry.gpa.toFixed(4)}</div>
                    <div class="history-details">
                        学分: ${entry.totalCredits.toFixed(1)} |
                        总绩点: ${entry.totalGradePoints.toFixed(4)}
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * 更新排除课程列表
     */
    function updateExcludedCoursesList() {
        if (!DOM.excludedCoursesList) return;

        DOM.excludedCoursesList.innerHTML = state.excludedCourses.map(code => `
            <div class="excluded-item" data-code="${code}">
                <span>${code}</span>
                <button class="gpa-button small danger remove-excluded">移除</button>
            </div>
        `).join('');

        // 重新绑定移除按钮事件
        DOM.excludedCoursesList.querySelectorAll('.remove-excluded').forEach(btn => {
            btn.addEventListener('click', function() {
                const code = this.parentElement.dataset.code;
                const index = state.excludedCourses.indexOf(code);
                if (index > -1) {
                    state.excludedCourses.splice(index, 1);
                    updateExcludedCoursesList();
                    saveExcludedCourses();
                }
            });
        });
    }

    /**
     * 生成导出文本
     * @returns {string} 格式化的文本
     */
    function generateExportText() {
        if (!state.lastCalculatedGPA) return '暂无数据可导出';

        const data = state.lastCalculatedGPA;
        let text = `GPA计算结果\n`;
        text += `------------------------\n`;
        text += `总平均GPA: ${data.gpa.toFixed(4)}\n`;
        text += `总学分: ${data.totalCredits.toFixed(1)}\n`;
        text += `总绩点: ${data.totalGradePoints.toFixed(4)}\n`;
        text += `计算时间: ${new Date(data.timestamp).toLocaleString()}\n`;
        text += `------------------------\n\n`;

        text += `课程分类统计:\n`;
        for (const [category, stats] of Object.entries(data.categories)) {
            const categoryGPA = stats.totalPoints / stats.totalCredits;
            text += `${category}: GPA=${categoryGPA.toFixed(2)}, 学分=${stats.totalCredits.toFixed(1)}, 课程数=${stats.count}\n`;
        }
        text += `------------------------\n\n`;

        text += `课程列表 (共${data.courses.length}门):\n`;
        data.courses.forEach((course, index) => {
            text += `${index + 1}. ${course.name} (${course.code})\n`;
            text += `   分类: ${course.category}, 学分: ${course.credits}, GPA: ${course.gpa.toFixed(1)}, 成绩: ${course.grade}\n`;
        });

        return text;
    }

    /**
     * 生成CSV数据
     * @returns {string} CSV格式的字符串
     */
    function generateCSV() {
        if (!state.lastCalculatedGPA) return null;

        const data = state.lastCalculatedGPA;
        let csv = '课程代码,课程名称,课程分类,学分,GPA,成绩,绩点\n';

        data.courses.forEach(course => {
            csv += `${course.code},${course.name},${course.category},${course.credits},${course.gpa.toFixed(1)},${course.grade},${course.points.toFixed(2)}\n`;
        });

        return csv;
    }

    /**
     * 导出为CSV文件
     */
    function exportCSV() {
        const csv = generateCSV();
        if (!csv) {
            alert('暂无数据可导出');
            return;
        }

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `GPA统计_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            alert('复制成功');
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败');
        }

        document.body.removeChild(textarea);
    }

    /**
     * 打印成绩单
     */
    function printGradeReport() {
        if (!state.lastCalculatedGPA) {
            alert('暂无数据可打印');
            return;
        }

        const data = state.lastCalculatedGPA;
        const printWindow = window.open('', '_blank');

        printWindow.document.write(`
            <html>
            <head>
                <title>成绩单 - ${new Date().toLocaleDateString()}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 30px;
                        line-height: 1.5;
                    }
                    h1, h2, h3 {
                        color: #333;
                    }
                    .summary {
                        margin: 20px 0;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    }
                    .summary-item {
                        margin: 10px 0;
                    }
                    .value {
                        font-weight: bold;
                        color: #2196F3;
                    }
                    .category {
                        margin: 15px 0;
                        padding: 10px;
                        border-left: 4px solid #4CAF50;
                        background: #f9f9f9;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        padding: 8px 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #f5f5f5;
                    }
                    tr:hover {
                        background-color: #f8f8f8;
                    }
                    .footer {
                        margin-top: 30px;
                        font-size: 12px;
                        color: #888;
                        text-align: center;
                    }
                    @media print {
                        body {
                            margin: 0.5cm;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>成绩单</h1>
                <div class="summary">
                    <div class="summary-item">总平均GPA: <span class="value">${data.gpa.toFixed(4)}</span></div>
                    <div class="summary-item">总学分: <span class="value">${data.totalCredits.toFixed(1)}</span></div>
                    <div class="summary-item">总绩点: <span class="value">${data.totalGradePoints.toFixed(4)}</span></div>
                    <div class="summary-item">计算时间: ${new Date(data.timestamp).toLocaleString()}</div>
                </div>

                <h2>课程分类统计</h2>
                <div class="categories">
        `);

        for (const [category, stats] of Object.entries(data.categories)) {
            const categoryGPA = stats.totalPoints / stats.totalCredits;
            printWindow.document.write(`
                <div class="category">
                    <h3>${category}</h3>
                    <div>GPA: <span class="value">${categoryGPA.toFixed(2)}</span></div>
                    <div>学分: ${stats.totalCredits.toFixed(1)}</div>
                    <div>课程数: ${stats.count}</div>
                </div>
            `);
        }

        printWindow.document.write(`
                </div>

                <h2>课程列表 (共${data.courses.length}门)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>课程名称</th>
                            <th>课程代码</th>
                            <th>分类</th>
                            <th>学分</th>
                            <th>GPA</th>
                            <th>成绩</th>
                        </tr>
                    </thead>
                    <tbody>
        `);

        data.courses.forEach(course => {
            printWindow.document.write(`
                <tr>
                    <td>${course.name}</td>
                    <td>${course.code}</td>
                    <td>${course.category}</td>
                    <td>${course.credits}</td>
                    <td>${course.gpa.toFixed(1)}</td>
                    <td>${course.grade}</td>
                </tr>
            `);
        });

        printWindow.document.write(`
                    </tbody>
                </table>

                <div class="footer">
                    此成绩单由GPA计算器生成于 ${new Date().toLocaleString()}
                </div>

                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()">打印</button>
                    <button onclick="window.close()">关闭</button>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
    }

    /**
     * 初始化标签页切换功能
     */
    function initTabs() {
        const tabs = DOM.container.querySelectorAll('.gpa-tab');
        const tabContents = DOM.container.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动标签
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // 激活当前标签
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                DOM.container.querySelector(`#${tabId}-tab`).classList.add('active');
                state.currentTab = tabId;
            });
        });
    }

    /**
     * 计算GPA并更新显示
     */
    function calculateAndUpdate() {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    const gpaData = calculateGPA(iframeDoc);
                    updateGPADisplay(gpaData);
                } else {
                    updateGPADisplay(null);
                }
            } catch (error) {
                console.error('访问iframe内容时出错:', error);
                updateGPADisplay(null);
            }
        } else {
            updateGPADisplay(null);
        }
    }

    /**
     * 手动计算GPA
     */
    function handleManualCalculation() {
        // 清除错误信息
        const errorElement = DOM.container.querySelector('#manual-error');
        errorElement.style.display = 'none';

        // 获取输入值
        const credits = parseFloat(DOM.manualCredits.value);
        const points = parseFloat(DOM.manualPoints.value);

        // 验证输入
        if (isNaN(credits) || isNaN(points)) {
            errorElement.textContent = '请输入有效的数字';
            errorElement.style.display = 'block';
            return;
        }

        if (credits <= 0) {
            errorElement.textContent = '学分必须大于0';
            errorElement.style.display = 'block';
            return;
        }

        // 计算GPA
        const gpa = calculateManualGPA(credits, points);

        // 显示结果
        DOM.manualGpaResult.textContent = gpa.toFixed(4);
        DOM.manualGpaResult.style.animation = 'none';
        DOM.manualGpaResult.offsetHeight; // 触发重绘
        DOM.manualGpaResult.style.animation = 'fadeIn 0.5s ease-out';
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        // 计算按钮事件
        const calculateButton = DOM.container.querySelector('#calculate-gpa');
        calculateButton.addEventListener('click', calculateAndUpdate);

        // 主题切换
        const themeToggle = DOM.container.querySelector('.gpa-theme-toggle');
        themeToggle.addEventListener('click', () => {
            state.isDarkMode = !state.isDarkMode;
            DOM.container.classList.toggle('dark-mode');
            themeToggle.innerHTML = state.isDarkMode ? '🌞' : '🌙';
            saveDarkMode();
        });

        // 添加排除课程
        const addExcludedBtn = DOM.container.querySelector('#add-excluded-btn');
        const newExcludedInput = DOM.container.querySelector('#new-excluded-course');

        if (addExcludedBtn && newExcludedInput) {
            addExcludedBtn.addEventListener('click', () => {
                const code = newExcludedInput.value.trim();
                if (code && !state.excludedCourses.includes(code)) {
                    state.excludedCourses.push(code);
                    updateExcludedCoursesList();
                    saveExcludedCourses();
                    newExcludedInput.value = '';
                }
            });

            newExcludedInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    addExcludedBtn.click();
                }
            });
        }

        // 手动计算
        const calculateManualBtn = DOM.container.querySelector('#calculate-manual');
        if (calculateManualBtn) {
            calculateManualBtn.addEventListener('click', handleManualCalculation);
        }

        // 导出功能
        const exportTextBtn = DOM.container.querySelector('#export-text');
        if (exportTextBtn) {
            exportTextBtn.addEventListener('click', () => {
                const text = generateExportText();
                copyToClipboard(text);
            });
        }

        const exportCsvBtn = DOM.container.querySelector('#export-csv');
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', exportCSV);
        }

        const exportPrintBtn = DOM.container.querySelector('#export-print');
        if (exportPrintBtn) {
            exportPrintBtn.addEventListener('click', printGradeReport);
        }

        // 监听窗口大小变化，确保计算器不会超出界面
        window.addEventListener('resize', () => {
            const rect = DOM.container.getBoundingClientRect();
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            if (state.xOffset > maxX || state.yOffset > maxY) {
                state.xOffset = Math.min(state.xOffset, maxX);
                state.yOffset = Math.min(state.yOffset, maxY);
                updateElementPosition(DOM.container);
                savePosition();
            }
        });
    }

    /**
     * 缓存DOM引用
     */
    function cacheDOMReferences() {
        DOM.container = document.querySelector('.gpa-calculator');
        DOM.gpaValue = DOM.container.querySelector('#gpa-value');
        DOM.creditsValue = DOM.container.querySelector('#credits-value');
        DOM.pointsValue = DOM.container.querySelector('#points-value');
        DOM.excludedCoursesList = DOM.container.querySelector('#excluded-courses-list');
        DOM.historyList = DOM.container.querySelector('#history-list');
        DOM.manualCredits = DOM.container.querySelector('#manual-credits');
        DOM.manualPoints = DOM.container.querySelector('#manual-points');
        DOM.manualGpaResult = DOM.container.querySelector('#manual-gpa-result');
    }

    /**
     * 初始化应用
     */
    function init() {
        // 加载保存的数据
        loadSavedData();

        // 创建UI
        injectStyles();
        DOM.container = createGPADisplay();
        document.body.appendChild(DOM.container);

        // 缓存DOM引用
        cacheDOMReferences();

        // 初始化功能
        updateElementPosition(DOM.container);
        makeDraggable(DOM.container);
        initTabs();
        bindEvents();

        // 应用深色模式
        if (state.isDarkMode) {
            DOM.container.classList.add('dark-mode');
        }
    }

    // 启动应用
    init();
})();