// ==UserScript==
// @name         求职助手
// @namespace    job_seeking_helper
// @author       Gloduck
// @license MIT
// @version      1.1.4
// @description  为相关的求职平台（BOSS直聘、拉勾、智联招聘、猎聘）添加一些实用的小功能，如自定义薪资范围、过滤黑名单公司等。
// @match        https://www.zhipin.com/*
// @match        https://m.zhipin.com/*
// @match        https://c.liepin.com/*
// @match        https://mc.liepin.com/*
// @match        https://m.liepin.com/*
// @match        https://www.liepin.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/530803/%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530803/%E6%B1%82%E8%81%8C%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 策略枚举
    const JobPlatform = {
        BOSS_ZHIPIN: Symbol('Boss'), LAGOU: Symbol('Lagou'), LIEPIN: Symbol('Liepin'), UNKNOWN: Symbol('未知网站')
    };

    const JobPageType = {
        SEARCH: Symbol('Search'),
        RECOMMEND: Symbol('Recommend'),
        MOBILE_SEARCH: Symbol('MobileSearch'),
        MOBILE_RECOMMEND: Symbol('MobileRecommend')
    }

    const JobFilterType = {
        BLACKLIST: Symbol('Blacklist'), VIEWED: Symbol('Viewed'), MISMATCH_CONDITION: Symbol('MismatchCondition'),
    }

    let curPageHash = null;
    let lock = false;
    // 默认设置
    const defaults = {
        blacklist: [],
        minSalary: 0,
        maxSalary: Infinity,
        salaryFilterType: 'include',
        filterInactiveJob: false,
        maxDailyHours: 8,
        maxMonthlyDays: 22,
        maxWeeklyCount: 4,
        viewedAction: 'mark',
        blacklistAction: 'hide',
        conditionAction: 'hide'
    };

    // 加载用户设置
    const settings = {
        blacklist: GM_getValue('blacklist', defaults.blacklist),
        minSalary: GM_getValue('minSalary', defaults.minSalary),
        maxSalary: GM_getValue('maxSalary', defaults.maxSalary),
        salaryFilterType: GM_getValue('salaryFilterType', defaults.salaryFilterType),
        filterInactiveJob: GM_getValue('filterInactiveJob', defaults.filterInactiveJob),
        maxDailyHours: GM_getValue('maxDailyHours', defaults.maxDailyHours),
        maxMonthlyDays: GM_getValue('maxMonthlyDays', defaults.maxMonthlyDays),
        maxWeeklyCount: GM_getValue('maxWeeklyCount', defaults.maxWeeklyCount),
        viewedAction: GM_getValue('viewedAction', defaults.viewedAction),
        blacklistAction: GM_getValue('blacklistAction', defaults.blacklistAction),
        conditionAction: GM_getValue('conditionAction', defaults.conditionAction)
    };

    // 注册设置菜单
    GM_registerMenuCommand('职位过滤设置', showSettings);

    function showSettings() {
        const dialog = document.createElement('div');
        dialog.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ffffff;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            z-index: 9999;
            min-width: 380px;
            font-family: 'Segoe UI', sans-serif;
        `;

        dialog.innerHTML = `
            <h2 style="color: #2c3e50; margin: 0 0 20px; font-size: 1.4em;">职位过滤设置</h2>
            
            <!-- 基础设置 -->
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">黑名单关键词（逗号分隔）</label>
                <input type="text" id="blacklist" 
                    style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;"
                    value="${settings.blacklist.join(',')}">
            </div>

            <!-- 薪资设置 -->
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 1.1em;">薪资设置</h3>
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px;">薪资范围（元/月）：</label>
                    <div style="display: flex; gap: 10px;">
                        <input type="number" id="minSalary" placeholder="最低" 
                            style="flex: 1; padding: 8px;" value="${settings.minSalary}">
                        <span style="align-self: center;">-</span>
                        <input type="number" id="maxSalary" placeholder="最高" 
                            style="flex: 1; padding: 8px;" value="${settings.maxSalary}">
                    </div>
                </div>
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px;">薪资过滤方式：</label>
                    ${createRadioGroup('salaryFilterType', ['include', 'overlap'], settings.salaryFilterType, {
            include: '包含范围',
            overlap: '存在交集'
        })}
                </div>

            </div>
            
            <!-- 其他设置 -->
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 1.1em;">其他设置</h3>
                <div style="margin-bottom: 12px;">

                    <label style="display: flex; align-items: center; gap: 8px; color: #34495e;">
                        <input type="checkbox" id="filterInactiveJob" ${settings.filterInactiveJob ? 'checked' : ''}>
                        过滤不活跃的职位(只有少数页面支持)
                    </label>
                </div>

            </div>
            
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 1.1em;">工作时间限制</h3>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div>
                        <label style="display: block; margin-bottom: 6px;">日工作小时</label>
                        <input type="number" id="maxDailyHours" 
                            min="1" max="24" step="0.5"
                            style="width: 100%; padding: 8px;"
                            value="${settings.maxDailyHours}">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 6px;">月工作天数</label>
                        <input type="number" id="maxMonthlyDays" 
                            min="1" max="31" step="1"
                            style="width: 100%; padding: 8px;"
                            value="${settings.maxMonthlyDays}">
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 6px;">月工作周数</label>
                        <input type="number" id="maxWeeklyCount" 
                            min="1" max="6" step="0.5"
                            style="width: 100%; padding: 8px;"
                            value="${settings.maxWeeklyCount}">
                    </div>
                </div>
            </div>

            <!-- 整合后的处理方式设置 -->
            <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin: 0 0 15px; font-size: 1.1em;">处理方式设置</h3>
                
                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px;">黑名单职位：</label>
                    ${createRadioGroup('blacklistAction', ['delete', 'hide', 'mark', 'noop'], settings.blacklistAction, {
            delete: '删除',
            hide: '屏蔽',
            mark: '标识',
            noop: '无操作'
        })}
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; margin-bottom: 6px;">已查看职位：</label>
                    ${createRadioGroup('viewedAction', ['delete', 'hide', 'mark', 'noop'], settings.viewedAction, {
            delete: '删除',
            hide: '屏蔽',
            mark: '标识',
            noop: '无操作'
        })}
                </div>

                <div>
                    <label style="display: block; margin-bottom: 6px;">不符合条件职位：</label>
                    ${createRadioGroup('conditionAction', ['delete', 'hide', 'mark', 'noop'], settings.conditionAction, {
            delete: '删除',
            hide: '屏蔽',
            mark: '标识',
            noop: '无操作'
        })}
                </div>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee;">
                <button id="clearCacheBtn" 
                    style="
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: opacity 0.2s;
                    ">
                    清理已查看职位
                </button>
                <span style="color: #7f8c8d; font-size: 0.9em; margin-left: 10px;">
                    将重置当前平台所有已经查看的职位
                </span>
            </div>

            <!-- 操作按钮 -->
            <div style="display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 20px;">
                <button id="saveBtn" class="dialog-btn primary">保存</button>
                <button id="cancelBtn" class="dialog-btn secondary">取消</button>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .dialog-btn {
                padding: 8px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }
            .primary {
                background: #3498db;
                color: white;
            }
            .secondary {
                background: #f0f0f0;
                color: #666;
            }
            .radio-group {
                display: flex;
                gap: 15px;
                margin-top: 5px;
            }
            .radio-item label {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
            }
        `;
        dialog.appendChild(style);
        document.body.appendChild(dialog);

        // 事件绑定
        dialog.querySelector('#saveBtn').addEventListener('click', saveSettings);
        dialog.querySelector('#cancelBtn').addEventListener('click', () => dialog.remove());
        dialog.querySelector('#clearCacheBtn').addEventListener('click', () => {
            if (confirm('确定要清理已查看职位吗？\n这将重置当前平台所有已经查看的职位！')) {
                clearViewedJob(choosePlatForm());
                alert('清理完成！');
                location.reload();
            }
        });
    }

    // 生成带自定义标签的单选组
    function createRadioGroup(name, values, selected, labels) {
        return `
            <div class="radio-group">
                ${values.map(value => `
                    <div class="radio-item">
                        <label>
                            <input type="radio" name="${name}" value="${value}" ${value === selected ? 'checked' : ''}>
                            ${labels[value] || value}
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }


    function saveSettings() {
        settings.blacklist = document.querySelector('#blacklist').value
            .split(',')
            .map(s => s.trim().toLowerCase())
            .filter(Boolean);

        settings.minSalary = parseInt(document.querySelector('#minSalary').value) || 0;
        settings.maxSalary = parseInt(document.querySelector('#maxSalary').value) || Infinity;
        settings.salaryFilterType = document.querySelector('input[name="salaryFilterType"]:checked').value;
        settings.filterInactiveJob = document.querySelector('#filterInactiveJob:checked').value || false;
        settings.viewedAction = document.querySelector('input[name="viewedAction"]:checked').value;
        settings.blacklistAction = document.querySelector('input[name="blacklistAction"]:checked').value;
        settings.conditionAction = document.querySelector('input[name="conditionAction"]:checked').value;
        settings.maxDailyHours = parseFloat(document.querySelector('#maxDailyHours').value) || 0;
        settings.maxMonthlyDays = parseInt(document.querySelector('#maxMonthlyDays').value) || 0;
        settings.maxWeeklyCount = parseFloat(document.querySelector('#maxWeeklyCount').value) || 0;

        // 保存设置
        GM_setValue('blacklist', settings.blacklist);
        GM_setValue('minSalary', settings.minSalary);
        GM_setValue('maxSalary', settings.maxSalary);
        GM_setValue('salaryFilterType', settings.salaryFilterType);
        GM_setValue('filterInactiveJob', settings.filterInactiveJob);
        GM_setValue('viewedAction', settings.viewedAction);
        GM_setValue('blacklistAction', settings.blacklistAction);
        GM_setValue('conditionAction', settings.conditionAction);
        GM_setValue('maxDailyHours', settings.maxDailyHours);
        GM_setValue('maxMonthlyDays', settings.maxMonthlyDays);
        GM_setValue('maxWeeklyCount', settings.maxWeeklyCount);

        document.querySelector('div').remove();
        alert('设置已保存！');
        location.reload();
    }

    /**
     *
     * @return {symbol}
     */
    function choosePlatForm() {
        const href = window.location.href;
        if (href.includes('zhipin.com')) {
            return JobPlatform.BOSS_ZHIPIN;
        } else if (href.includes('liepin.com')) {
            return JobPlatform.LIEPIN;
        } else {
            return JobPlatform.UNKNOWN;
        }
    }

    /**
     *
     * @returns {PlatFormStrategy}
     */
    function getStrategy() {
        switch (choosePlatForm()) {
            case JobPlatform.BOSS_ZHIPIN:
                return new BossStrategy();
            case JobPlatform.LIEPIN:
                return new LiepinStrategy();
            default:
                throw new Error('Unsupported platform')
        }
    }


    /**
     *
     * @param {String} salaryRange
     */
    function parseSalaryToMonthly(salaryRange) {
        // 更新正则表达式以匹配单个数值或范围
        const regex = /(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?/;
        const match = salaryRange.match(regex);

        if (!match) {
            if (salaryRange.includes('面议')) {
                return { min: 0, max: Infinity };
            }
            throw new Error(`Invalid salary range format( ${salaryRange} )`);
        }

        // 提取并处理最小值和最大值
        let minSalary = parseFloat(match[1]);
        let maxSalary = match[2] ? parseFloat(match[2]) : minSalary; // 处理单个数值情况

        // 处理单位转换
        if (/k/i.test(salaryRange)) { // 检查是否存在k/K
            minSalary *= 1000;
            maxSalary *= 1000;
        }

        // 根据时间单位转换月薪
        if (salaryRange.includes('周')) {
            minSalary *= settings.maxWeeklyCount;
            maxSalary *= settings.maxWeeklyCount;
        } else if (salaryRange.includes('天')) {
            minSalary *= settings.maxMonthlyDays;
            maxSalary *= settings.maxMonthlyDays;
        } else if (salaryRange.includes('时')) {
            minSalary *= settings.maxMonthlyDays * settings.maxDailyHours;
            maxSalary *= settings.maxMonthlyDays * settings.maxDailyHours;
        }

        return { min: minSalary, max: maxSalary };
    }


    /**
     *
     * @param {Symbol} jobPlatform
     */
    function clearViewedJob(jobPlatform) {
        let jobViewKey = getJobViewKey(jobPlatform);
        // GM_setValue(jobViewKey, []);
        CacheManager.delete(jobViewKey);
    }

    /**
     *
     * @param {Symbol} jobPlatform
     * @param {String} uniqueKey
     */
    function setJobViewed(jobPlatform, uniqueKey) {
        if (uniqueKey == null) {
            return;
        }
        let jobViewKey = getJobViewKey(jobPlatform);
        const jobViewedSet = getJobViewedSet(jobPlatform);
        if (jobViewedSet.has(uniqueKey)) {
            return;
        }
        jobViewedSet.add(uniqueKey);
        // GM_setValue(jobViewKey, [...jobViewedSet]);
        CacheManager.set(jobViewKey, [...jobViewedSet]);
    }

    /**
     *
     * @param {Symbol} jobPlatform
     * @return {Set<String>}
     */
    function getJobViewedSet(jobPlatform) {
        let jobViewKey = getJobViewKey(jobPlatform);
        // return new Set(GM_getValue(jobViewKey, []));
        const cache = CacheManager.get(jobViewKey);
        return new Set(cache != null ? cache : []);
    }

    /**
     *
     * @param {Symbol} jobPlatform
     * @return {string}
     */
    function getJobViewKey(jobPlatform) {
        return jobPlatform.description + "ViewHistory";
    }


    class PlatFormStrategy {
        /**
         * @returns {JobPageType}
         */
        fetchJobPageType() {
            throw new Error('Method not implemented');
        }

        /**
         * @param {JobPageType} jobPageType
         * @returns {NodeListOf<Element>}
         */
        fetchJobElements(jobPageType) {
            throw new Error('Method not implemented');

        }

        /**
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {String|null}
         */
        fetchJobUniqueKey(jobElement, jobPageType) {
            throw new Error('Method not implemented');
        }

        /**
         * @param {Element} jobElement - 职位信息 DOM 元素
         * @param {JobPageType} jobPageType - 职位页面类型
         * @returns {Promise<{min: number, max: number}>}
         */
        async parseSalary(jobElement, jobPageType) {
            throw new Error('Method not implemented'); // 自动转换为 rejected Promise
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {Promise<String>}
         */
        async parseJobName(jobElement, jobPageType) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {Promise<String>}
         */
        async parseCompanyName(jobElement, jobPageType) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {Promise<Boolean>}
         */
        async jobIsActive(jobElement, jobPageType) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @param {JobFilterType[]} jobFilterTypes
         * @returns {void}
         */
        markCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @param {JobFilterType[]} jobFilterTypes
         * @returns {void}
         */
        blockCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {void}
         */
        removeCurJobElement(jobElement, jobPageType) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @param {Function} eventCallback
         * @returns {void}
         */
        addViewedCallback(jobElement, jobPageType, eventCallback) {
            throw new Error('Method not implemented');
        }

        /**
         *
         * @param {Element} element
         */
        addDeleteLine(element) {
            const delElement = document.createElement('del');

            while (element.firstChild) {
                delElement.appendChild(element.firstChild);
            }

            element.appendChild(delElement);
        }

        /**
         * @param {JobFilterType} jobFilterType
         * @returns {String}
         */
        convertFilterTypeToMessage(jobFilterType) {
            if (jobFilterType === JobFilterType.BLACKLIST) {
                return '黑名单';
            } else if (jobFilterType === JobFilterType.VIEWED) {
                return '已查看';
            } else if (jobFilterType === JobFilterType.MISMATCH_CONDITION) {
                return '条件不符';
            } else {
                return '未知';
            }
        }

    }

    class LiepinStrategy extends PlatFormStrategy {
        fetchJobPageType() {
            if (document.querySelector("#home-main-box-container") != null) {
                return JobPageType.RECOMMEND;
            } else if (document.querySelector('#lp-search-job-box') != null) {
                return JobPageType.SEARCH;
            } else if (document.querySelector('.main-content .job-list-box') != null || document.querySelector('.home-container .recommend-job-list') != null) {
                return JobPageType.MOBILE_RECOMMEND;
            } else if (document.querySelector('.so-job-job-list') != null) {
                return JobPageType.MOBILE_SEARCH;
            }
        }

        fetchJobElements(jobPageType) {
            if (jobPageType === JobPageType.SEARCH) {
                return document.querySelectorAll('div.job-list-box > div');
            } else if (jobPageType === JobPageType.RECOMMEND) {
                return document.querySelectorAll('ul.pull-up-content > li.pull-up-li');
            } else if (jobPageType === JobPageType.MOBILE_SEARCH) {
                return document.querySelectorAll('.so-job-job-list > div');
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND) {
                if (document.querySelector('.recommend-job-list') != null) {
                    // 未登录时的推荐页
                    return document.querySelectorAll('.recommend-job-list > a');
                } else {
                    // 登录后的推荐页
                    return document.querySelectorAll('ul.pull-up-content > li.pull-up-li');
                }
            } else {
                throw new Error('Not a job element')
            }
        }

        fetchJobUniqueKey(jobElement, jobPageType) {
            if (jobElement.classList.contains('filter-blocked')) {
                return null;
            }
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const element = jobElement.querySelector('.job-detail-box > a');
                if (element == null) {
                    return null;
                }
                const url = element.href;
                if (url === null) {
                    return null;
                }
                return this.fetchUniqueKeyFromUrl(url);
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND || jobPageType === JobPageType.MOBILE_SEARCH) {
                const element = this.fetchMobileJobElementContainer(jobElement)
                if (element == null) {
                    return null;
                }
                if (element.hasAttribute('href')) {
                    return this.fetchUniqueKeyFromUrl(element.href);
                }
                const dataTags = element.getAttribute('data-tlg-ext');
                if (dataTags == null) {
                    return null;
                }
                const dataTagsJson = JSON.parse(decodeURIComponent(dataTags))
                if (dataTagsJson.jobId != null) {
                    return dataTagsJson.jobId.toString();
                } else if (dataTagsJson.job_id != null) {
                    return dataTagsJson.job_id.toString();
                } else {
                    throw new Error('Not a job element')
                }
            } else {
                throw new Error('Not a job element')
            }
        }


        async parseSalary(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const salary = jobElement.querySelector('.job-detail-box > a > div > span:last-child').textContent;
                return parseSalaryToMonthly(salary);
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND || jobPageType === JobPageType.MOBILE_SEARCH) {
                const salary = jobElement.querySelector('h3 small').textContent;
                return parseSalaryToMonthly(salary);
            } else {
                throw new Error('Not a job element')
            }
        }

        async parseCompanyName(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                return jobElement.querySelector('.job-detail-box > div > div > span').textContent;
            } else if (jobPageType === JobPageType.MOBILE_SEARCH) {
                return jobElement.querySelector('.job-card-company').textContent;
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return jobElement.querySelector('.job-card-company > span:first-child').textContent;
            } else {
                throw new Error('Not a job element')
            }
        }

        async parseJobName(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                return jobElement.querySelector('.job-detail-box > a > div > div > div').textContent;
            } else if (jobPageType === JobPageType.MOBILE_SEARCH) {
                return jobElement.querySelector('h3 > span:first-child').textContent;
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return jobElement.querySelector('.job-title > span').textContent;
            } else {
                throw new Error('Not a job element')
            }
        }

        async jobIsActive(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH) {
                /*
                    // 请求频繁容易被封，暂时先不支持
                    const requestUrl = `https://${location.host}/a/${this.fetchJobUniqueKey(jobElement, jobPageType)}.shtml`;
                    const response = await fetch(requestUrl);
                    const documentText = await response.text();
                    const parser = new DOMParser();
                    const parseDocument = parser.parseFromString(documentText, 'text/html');
                    const onlineElement = parseDocument.querySelector('div.name-box span.online');
                    if(onlineElement == null){
                        return false;
                    }
                    console.log("活跃状态：" + onlineElement.textContent);
                    return onlineElement.textContent.includes('在线');
                */
                return true;
            } else if (jobPageType === JobPageType.RECOMMEND) {
                const onlineMessage = jobElement.querySelector('.recruiter-info-box').textContent;
                if (onlineMessage == null) {
                    return false;
                }
                return onlineMessage.includes('在线');
            } else if (jobPageType === JobPageType.MOBILE_SEARCH) {
                return true;
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return true;
            } else {
                throw new Error('Not a job element')
            }
        }

        addViewedCallback(jobElement, jobPageType, eventCallback) {
            jobElement.addEventListener('click', eventCallback, true);
        }


        markCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            let container;
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                container = jobElement.querySelector('.job-detail-box a > div');
                this.changePcJobElementColor(jobElement, jobPageType);
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND || jobPageType === JobPageType.MOBILE_SEARCH) {
                container = this.fetchMobileJobElementContainer(jobElement);
                this.changeMobileJobElementColor(jobElement, jobPageType);
            } else {
                throw new Error('Not a job element')
            }
            if (container == null) {
                return;
            }

            let markSpan = container.querySelector('.mark');
            if (markSpan === null) {
                markSpan = document.createElement('span');
                markSpan.classList.add('mark');
                markSpan.style.color = 'red';
                markSpan.style.float = 'left';
                container.insertBefore(markSpan, container.firstChild);
            }
            markSpan.textContent = '(' + jobFilterTypes.map(jobFilterType => this.convertFilterTypeToMessage(jobFilterType)).join('|') + ')';
        }


        blockCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            jobElement.classList.add('filter-blocked');
            const message = jobFilterTypes.map(jobFilterType => this.convertFilterTypeToMessage(jobFilterType)).join('|');
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const cardBody = jobElement.querySelector('.job-detail-box > a');
                cardBody.innerHTML = `
                    <div class="tip" style="color: dimgray; font-weight: bold; font-size: large; padding-top: 20px">已屏蔽</div>
                `;
                const cardFooter = jobElement.querySelector('div[data-nick="job-detail-company-info"] > div');
                cardFooter.innerHTML = `
                    <span>${message}</span>
                `;
                const avatar = jobElement.querySelector('div.job-card-right-box');
                avatar.innerHTML = ``;
                this.changePcJobElementColor(jobElement, jobPageType);
            } else if (jobPageType === JobPageType.MOBILE_RECOMMEND || jobPageType === JobPageType.MOBILE_SEARCH) {
                const cardBody = this.fetchMobileJobElementContainer(jobElement);
                cardBody.innerHTML = `
                    <div class="tip" style="color: dimgray; font-weight: bold; font-size: large; padding-top: 20px">已屏蔽</div>
                    <div><span>${message}</span></div>
                `;
                this.changeMobileJobElementColor(jobElement, jobPageType);
            } else {
                throw new Error('Not a job element')
            }
        }

        removeCurJobElement(jobElement, jobPageType) {
            if (jobPageType === JobPageType.RECOMMEND) {
                // 如果直接删除元素页面切换tab的时候会报错，这里隐藏
                // jobElement.style.display = 'none';
                jobElement.innerHTML = ``;
            } else {
                jobElement.parentElement.removeChild(jobElement);
            }
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         */
        changePcJobElementColor(jobElement, jobPageType) {
            const container = jobElement.querySelector('.job-card-pc-container');
            if (container == null) {
                return;
            }
            container.style.backgroundColor = '#e1e1e1';
        }


        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         */
        changeMobileJobElementColor(jobElement, jobPageType) {
            jobElement.style.backgroundColor = '#e1e1e1';
        }

        /**
         * 
         * @param {Element} jobElement
         * @returns {Element} 
         */
        fetchMobileJobElementContainer(jobElement) {
            if (jobElement.classList.contains('job-card')) {
                return jobElement;
            }
            return jobElement.querySelector('.job-card');
        }

        /**
         * 
         * @param {String} url 
         * @returns {String}
         */
        fetchUniqueKeyFromUrl(url) {
            const regex = /\/(\d+)\.shtml/;
            const match = url.match(regex);
            if (match && match[1]) {
                if (match[1].length === 10) {
                    return match[1].slice(2);
                } else {
                    return match[1];
                }
            }
            return null;
        }

    }

    class BossStrategy extends PlatFormStrategy {
        fetchJobPageType() {
            // BOSS网页版推荐页和搜索页现在一毛一样了
            if (document.querySelector('[ka="jobs_recommend_tab_click"].active') != null) {
                return JobPageType.RECOMMEND;
            } else if (document.querySelector('.job-recommend-result') != null) {
                return JobPageType.SEARCH;
            } else if (document.querySelector('.job-recommend .job-list') != null) {
                return JobPageType.MOBILE_RECOMMEND;
            } else if (document.querySelector('#main .job-list') != null) {
                return JobPageType.MOBILE_SEARCH;
            }
            return null;
        }

        fetchJobElements(jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType == JobPageType.RECOMMEND) {
                return document.querySelectorAll('ul.rec-job-list > div > div > li.job-card-box');
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return document.querySelectorAll('.job-list > ul > li');
            } else {
                throw new Error('Not a job element')
            }
        }

        fetchJobUniqueKey(jobElement, jobPageType) {
            if (jobElement.classList.contains('filter-blocked')) {
                return null;
            }
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const element = jobElement.querySelector('.job-name');
                if (element == null) {
                    return null;
                }
                const url = element.href;
                if (url == null) {
                    return null;
                }
                return url.split('/job_detail/')[1].split('.html')[0];
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                const element = jobElement.querySelector('a');
                if (element == null) {
                    return null;
                }

                const url = element.href;
                if (url == null) {
                    return null;
                }
                return url.split('/job_detail/')[1].split('.html')[0];
            } else {
                throw new Error('Not a job element')
            }
        }

        async parseSalary(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const salary = this.convertSalaryField(jobElement.querySelector('.job-salary').textContent);
                return parseSalaryToMonthly(salary);
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                const salary = jobElement.querySelector('.salary').textContent;
                return parseSalaryToMonthly(salary);
            } else {
                throw new Error('Not a job element')
            }
        }

        async parseCompanyName(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                return jobElement.querySelector('.boss-name').textContent;
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return jobElement.querySelector('.company').textContent;
            } else {
                throw new Error('Not a job element')
            }
        }

        async parseJobName(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                return jobElement.querySelector('.job-name').textContent;
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                return jobElement.querySelector('.title-text').textContent;
            } else {
                throw new Error('Not a job element')
            }
        }

        async jobIsActive(jobElement, jobPageType) {
            const onlineTag = jobElement.querySelector('.boss-online-tag');
            if (onlineTag != null) {
                return true;
            }
            const onlineIcon = jobElement.querySelector('.boss-online-icon');
            if (onlineIcon != null) {
                return true;
            }

            const details = await this.fetchJobDetails(jobElement, jobPageType);
            return details.active;
        }

        addViewedCallback(jobElement, jobPageType, eventCallback) {
            jobElement.addEventListener('click', eventCallback, true);
        }

        markCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const titleElement = jobElement.querySelector('.job-title');
                let markSpan = titleElement.querySelector('.mark');
                if (markSpan === null) {
                    markSpan = document.createElement('span');
                    markSpan.classList.add('mark');
                    markSpan.style.color = 'red';
                    markSpan.style.float = 'left';
                    titleElement.insertBefore(markSpan, titleElement.firstChild);
                }
                markSpan.textContent = '(' + jobFilterTypes.map(jobFilterType => this.convertFilterTypeToMessage(jobFilterType)).join('|') + ')';
                this.changeJobElementColor(jobElement, jobPageType);

            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                const titleElement = jobElement.querySelector('.title');
                let markSpan = titleElement.querySelector('.mark');
                if (markSpan === null) {
                    markSpan = document.createElement('span');
                    markSpan.classList.add('mark');
                    markSpan.style.color = 'red';
                    markSpan.style.float = 'left';
                    titleElement.insertBefore(markSpan, titleElement.firstChild);
                }
                markSpan.textContent = '(' + jobFilterTypes.map(jobFilterType => this.convertFilterTypeToMessage(jobFilterType)).join('|') + ')';
                this.changeJobElementColor(jobElement, jobPageType);
            } else {
                throw new Error('Not a job element')
            }
        }

        blockCurJobElement(jobElement, jobPageType, jobFilterTypes) {
            jobElement.classList.add('filter-blocked');
            const message = jobFilterTypes.map(jobFilterType => this.convertFilterTypeToMessage(jobFilterType)).join('|');
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND) {
                const cardBody = jobElement.querySelector('.job-info');
                cardBody.innerHTML = `
                    <div class="tip" style="color: dimgray; font-weight: bold; font-size: large; padding-top: 20px">已屏蔽</div>
                    `;
                const cardFooter = jobElement.querySelector('.job-card-footer');
                cardFooter.innerHTML = `
                    <div class="info-desc">${message}</div>
                    `;
                this.changeJobElementColor(jobElement, jobPageType);
            } else if (jobPageType === JobPageType.MOBILE_SEARCH || jobPageType === JobPageType.MOBILE_RECOMMEND) {
                const cardBody = jobElement.querySelector('a');
                cardBody.innerHTML = `
                    <div class="tip" style="color: dimgray; font-weight: bold; font-size: large; padding-top: 20px">已屏蔽</div>
                    <span>${message}</span>
                    `;
                this.changeJobElementColor(jobElement, jobPageType);
            } else {
                throw new Error('Not a job element')
            }
        }

        removeCurJobElement(jobElement, jobPageType) {
            jobElement.parentElement.removeChild(jobElement);
            // jobElement.style.display = 'none';
        }

        /**
         *
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         */
        changeJobElementColor(jobElement, jobPageType) {
            if (jobPageType === JobPageType.SEARCH || jobPageType === JobPageType.RECOMMEND || jobPageType === JobPageType.MOBILE_RECOMMEND || jobPageType === JobPageType.MOBILE_SEARCH) {
                jobElement.style.backgroundColor = '#e1e1e1';
            } else {
                throw new Error('Not a job element')
            }
        }

        /**
         *
         * @param {String} salary
         */
        convertSalaryField(salary) {
            // 恶心的BOSS添加了特殊字符，需要转换
            let res = '';
            for (let i = 0; i < salary.length; i++) {
                let charCode = salary.charCodeAt(i);
                if (charCode >= 57393 && charCode <= 57402) {
                    charCode = charCode - 57393 + 48;
                }
                res += String.fromCharCode(charCode);
            }
            return res;
        }

        /**
         * @param {Element} jobElement
         * @param {JobPageType} jobPageType
         * @returns {Promise<{active: boolean}>}
         */
        async fetchJobDetails(jobElement, jobPageType) {
            let active = false;

            if (jobPageType === JobPageType.SEARCH) {
/*                 const url = `https://www.zhipin.com/wapi/zpgeek/job/card.json?${jobElement.querySelector(".job-card-left").href.split("?")[1]}`;
                const response = await fetch(url);
                const json = await response.json();
                if (json.code === 0) {
                    const card = json.zpData.jobCard;
                    const activeTimeDesc = card.activeTimeDesc;
                    if (card.online || (activeTimeDesc && (activeTimeDesc.includes('刚刚') || activeTimeDesc.includes('日') || activeTimeDesc.includes('本周')))) {
                        active = true;
                    } else {
                        console.log("活跃状态：" + activeTimeDesc);
                    }
                } */
               // 目前列表页暂时不返回相关参数了，其他接口又容易限流，暂时不支持活跃度检查了。
               active = true;
            } else {
                // 防止限流，其他页面展示不支持
                active = true;
            }

            return {
                "active": active,
            }
        }


    }

    // setTimeout(handleScheduleJob, 1000);
    setInterval(handleScheduleJob, 1000);

    async function handleScheduleJob() {
        if (lock) {
            return;
        }
        const strategy = getStrategy();
        if (strategy == null) {
            return;
        }
        let jobPageType = strategy.fetchJobPageType();
        if (jobPageType == null) {
            return;
        }
        lock = true;
        try {
            await handleElements(strategy, jobPageType);
        } catch (e) {
            console.error('处理元素失败:', e);
        } finally {
            lock = false;
        }
    }

    /**
     *
     * @param {PlatFormStrategy}strategy
     * @param {JobPageType} jobPageType
     * @returns {Promise<void>}
     */
    async function handleElements(strategy, jobPageType) {
        if (getPageHash(strategy, jobPageType) === curPageHash) {
            return;
        }
        const elements = strategy.fetchJobElements(jobPageType);


        let validElements = fetchValidElements(strategy, jobPageType, elements);

        const platForm = choosePlatForm();
        const viewedJobIds = getJobViewedSet(platForm);

        // 添加点击事件
        validElements.forEach(value => {
            initEventHandler(platForm, strategy, jobPageType, value.element);
        })

        const filterPromises = validElements.map(value => {
            return filterElementTask(strategy, value.element, jobPageType, viewedJobIds);
        });
        await Promise.all(filterPromises);

        curPageHash = getPageHash(strategy, jobPageType);
    }

    /**
     *
     * @param {PlatFormStrategy} strategy
     * @param {Element} jobElement
     * @param {JobPageType} jobPageType
     * @param {Set<String>} viewedJobIds
     * @returns {Promise<void>}
     */
    async function filterElementTask(strategy, jobElement, jobPageType, viewedJobIds) {
        const jobInfo = await fetchJobInfo(strategy, jobElement, jobPageType).then(value => {
            console.log(`Id：${value.id}，公司：${value.companyName}，岗位：${value.jobName}，月薪: ${value.salary.min} - ${value.salary.max}`);
            return value;
        });
        const filterTypes = getJobFilterType(jobInfo, viewedJobIds);
        handleFilterElement(strategy, jobElement, jobPageType, filterTypes);
    }

    /**
     *
     * @param {PlatFormStrategy} strategy
     * @param {Element} job
     * @param {JobPageType} pageType
     * @returns {Promise<{ id:string, jobName: string, companyName: string, salary: {min: number, max: number}, isActive: boolean}>}
     */
    async function fetchJobInfo(strategy, job, pageType) {
        try {
            const [id, jobName, companyName, salary, isActive] = await Promise.all([
                strategy.fetchJobUniqueKey(job, pageType),
                strategy.parseJobName(job, pageType),
                strategy.parseCompanyName(job, pageType),
                strategy.parseSalary(job, pageType),
                strategy.jobIsActive(job, pageType)
            ]);

            return { id, jobName, companyName, salary, isActive };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @param {{ id:string, jobName: string, companyName: string, salary: {min: number, max: number}, isActive: boolean}} jobInfo
     * @param {Set<String>} viewedJobs
     * @returns {JobFilterType[]}
     */
    function getJobFilterType(jobInfo, viewedJobs) {
        const filterTypes = new Set();
        const companyName = jobInfo.companyName.toLowerCase();
        for (let i = 0; i < settings.blacklist.length; i++) {
            if (companyName.includes(settings.blacklist[i])) {
                filterTypes.add(JobFilterType.BLACKLIST);
                break
            }
        }
        if (viewedJobs.has(jobInfo.id)) {
            filterTypes.add(JobFilterType.VIEWED);
        }

        const companySalary = jobInfo.salary;
        if (settings.salaryFilterType === 'include') {
            if (companySalary.min < settings.minSalary || companySalary.max > settings.maxSalary) {
                filterTypes.add(JobFilterType.MISMATCH_CONDITION);
            }
        } else if (settings.salaryFilterType === 'overlap') {
            if (!(companySalary.max >= settings.minSalary && settings.maxSalary >= companySalary.min)) {
                filterTypes.add(JobFilterType.MISMATCH_CONDITION);
            }
        }

        if (settings.filterInactiveJob && !jobInfo.isActive) {
            filterTypes.add(JobFilterType.MISMATCH_CONDITION);
        }
        return [...filterTypes];
    }

    /**
     *
     * @param {PlatFormStrategy} strategy
     * @param {Element} jobElement
     * @param {JobPageType} jobPageType
     * @param {JobFilterType[]} jobFilterTypes
     */
    function handleFilterElement(strategy, jobElement, jobPageType, jobFilterTypes) {
        if (jobFilterTypes.length === 0) {
            return;
        }
        // 过滤掉NoOp的过滤类型，不然后面会拼接出提示
        let actionFilterTypes = [];
        let filter = jobFilterTypes.map(filterType => {
            let action = null;
            if (filterType === JobFilterType.BLACKLIST) {
                action = settings.blacklistAction;
            } else if (filterType === JobFilterType.VIEWED) {
                action = settings.viewedAction;
            } else if (filterType === JobFilterType.MISMATCH_CONDITION) {
                action = settings.conditionAction;
            }
            if (action !== 'noop') {
                actionFilterTypes.push(filterType);
            }
            return action;
        }).filter(action => action != null && typeof action === 'string');
        if (filter.includes('delete')) {
            strategy.removeCurJobElement(jobElement, jobPageType);
        } else if (filter.includes('hide')) {
            strategy.blockCurJobElement(jobElement, jobPageType, actionFilterTypes);
        } else if (filter.includes('mark')) {
            strategy.markCurJobElement(jobElement, jobPageType, actionFilterTypes);
        }
    }

    /**
     *
     * @param {PlatFormStrategy} strategy
     * @param {JobPageType} jobPageType
     * @param {NodeListOf<Element>} elements
     * @returns {[{id: string, element: Element}]}
     */
    function fetchValidElements(strategy, jobPageType, elements) {
        const validElements = [];
        for (let i = 0; i < elements.length; i++) {
            const id = strategy.fetchJobUniqueKey(elements[i], jobPageType);
            if (id === null) {
                continue;
            }
            validElements.push({ 'id': id, element: elements[i] });
        }
        return validElements;
    }

    /**
     *
     * @param {PlatFormStrategy} strategy
     * @param {JobPageType} jobPageType
     * @returns {number}
     */
    function getPageHash(strategy, jobPageType) {
        const elements = strategy.fetchJobElements(jobPageType)
        const keys = fetchValidElements(strategy, jobPageType, elements).map(t => t.id).sort().join();
        return hashCode(keys);
    }

    /**
     *@param {Symbol} jobPlatform
     * @param {PlatFormStrategy} strategy
     * @param {JobPageType} jobPageType
     * @param {Element} element
     */
    function initEventHandler(jobPlatform, strategy, jobPageType, element) {
        const callBack = () => {
            const id = strategy.fetchJobUniqueKey(element, jobPageType);
            setJobViewed(jobPlatform, id);
            // 重置PageHash，来刷新
            curPageHash = null;
        };
        strategy.addViewedCallback(element, jobPageType, callBack);
    }

    /**
     *
     * @param {String} str
     * @returns {number}
     */
    function hashCode(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    const CacheManager = {
        /**
         * 设置缓存（ttl 为可选参数，单位毫秒）
         * @param {String} key
         * @param value
         * @param {Number} ttl
         */
        set: function (key, value, ttl) {
            const data = { value: value };
            if (typeof ttl === 'number') {
                data.expires = Date.now() + ttl;
            }
            localStorage.setItem(key, JSON.stringify(data));
        },

        /**
         * 获取缓存（自动处理过期）
         * @param {String} key
         * @returns {*|null}
         */
        get: function (key) {
            const item = localStorage.getItem(key);
            if (!item) return null;

            try {
                const data = JSON.parse(item);
                // 检查过期时间（如果存在）
                if (data.expires && Date.now() > data.expires) {
                    this.delete(key);
                    return null;
                }
                return data.value;
            } catch (e) {
                console.error('缓存解析失败:', e);
                this.delete(key);
                return null;
            }
        },

        /**
         * 删除指定缓存
         * @param {String} key
         */
        delete: function (key) {
            localStorage.removeItem(key);
        },

        /**
         * 清除所有带过期时间的缓存
         */
        cleanExpired: function () {
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                this.get(key); // 自动触发过期检查
            }
        }
    };

})();
