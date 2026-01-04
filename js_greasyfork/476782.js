// ==UserScript==
// @name         GiteePlus
// @version      1.7.0
// @description  企业版Gitee增强 - 优化版本
// @author       Kason
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license      MIT
// @match        https://e.gitee.com/*
// @icon         https://e.gitee.com/assets/images/favicon.ico
// @namespace    https://greasyfork.org/users/1186291
// @downloadURL https://update.greasyfork.org/scripts/476782/GiteePlus.user.js
// @updateURL https://update.greasyfork.org/scripts/476782/GiteePlus.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 优化：使用多CDN源和预加载策略
    const cdnSources = {
        primary: 'https://cdn.jsdelivr.net/npm',
        fallback: 'https://unpkg.com'
    };

    const resources = [
        {
            type: 'script',
            src: `${cdnSources.primary}/vue@3/dist/vue.global.prod.js`,
            fallback: `${cdnSources.fallback}/vue@3/dist/vue.global.prod.js`,
            async: true,
            preload: true
        },
        {
            type: 'link',
            rel: 'stylesheet',
            href: `${cdnSources.primary}/element-plus@latest/dist/index.css`,
            fallback: `${cdnSources.fallback}/element-plus/dist/index.css`,
            preload: true
        },
        {
            type: 'link',
            rel: 'stylesheet',
            href: `${cdnSources.primary}/@fortawesome/fontawesome-free@6.4.0/css/all.min.css`,
            fallback: `${cdnSources.fallback}/@fortawesome/fontawesome-free@6.4.0/css/all.min.css`,
            preload: false // 非关键资源
        },
        {
            type: 'script',
            src: `${cdnSources.primary}/element-plus@latest/dist/index.full.min.js`,
            fallback: `${cdnSources.fallback}/element-plus/dist/index.full.min.js`,
            async: true,
            preload: true
        },
        {
            type: 'script',
            src: `${cdnSources.primary}/sortablejs@1.15.0/Sortable.min.js`,
            fallback: `${cdnSources.fallback}/sortablejs@1.15.0/Sortable.min.js`,
            async: true,
            preload: false // 非关键资源
        }
    ];

    // 预加载关键资源
    function preloadResource(href) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = href.endsWith('.css') ? 'style' : 'script';
        link.href = href;
        document.head.appendChild(link);
    }

    // 预加载关键资源
    resources.filter(r => r.preload).forEach(resource => {
        preloadResource(resource.src || resource.href);
    });

    // 优化的资源加载器，支持降级
    const loadPromises = resources.map(resource => {
        return new Promise((resolve, reject) => {
            let element;
            let retryCount = 0;
            const maxRetries = 2;

            function tryLoad(src) {
                if (resource.type === 'script') {
                    element = document.createElement('script');
                    element.type = 'text/javascript';
                    element.src = src;
                    if (resource.async) element.async = true;
                    // 添加crossorigin属性提升加载速度
                    element.crossOrigin = 'anonymous';
                } else if (resource.type === 'link') {
                    element = document.createElement('link');
                    element.rel = resource.rel;
                    element.href = src;
                    element.crossOrigin = 'anonymous';
                }

                element.onload = () => {
                    console.log(`GiteePlus: 成功加载 ${src}`);
                    resolve();
                };

                element.onerror = () => {
                    retryCount++;
                    console.warn(`GiteePlus: 加载失败 ${src}, 重试次数: ${retryCount}`);

                    if (retryCount < maxRetries && resource.fallback) {
                        // 移除失败的元素
                        if (element.parentNode) {
                            element.parentNode.removeChild(element);
                        }
                        // 使用备用CDN重试
                        setTimeout(() => tryLoad(resource.fallback), 500);
                    } else {
                        console.error(`GiteePlus: 最终加载失败 ${src}`);
                        resolve(); // 即使失败也继续，不阻塞其他资源
                    }
                };

                document.head.appendChild(element);
            }

            tryLoad(resource.src || resource.href);
        });
    });

    // 等待关键资源加载完成后再初始化
    Promise.all(loadPromises.slice(0, 4)).then(() => {
        initializeApp();
    }).catch(error => {
        console.error('资源加载失败:', error);
        // 降级处理，仍然尝试初始化
        setTimeout(initializeApp, 1000);
    });

    function initializeApp() {
        // 检查必要的依赖是否加载完成
        function checkDependencies() {
            return new Promise((resolve, reject) => {
                let checkCount = 0;
                const maxChecks = 50; // 最多检查50次，每次间隔200ms，总共10秒

                const checkInterval = setInterval(() => {
                    checkCount++;

                    // 检查Vue和Element Plus是否可用
                    if (typeof Vue !== 'undefined' &&
                        typeof ElementPlus !== 'undefined' &&
                        document.readyState === 'complete') {
                        clearInterval(checkInterval);
                        console.log('GiteePlus: 所有依赖加载完成');
                        resolve();
                        return;
                    }

                    if (checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                        console.warn('GiteePlus: 依赖加载超时，但继续初始化');
                        resolve(); // 即使超时也继续，不阻塞应用
                    }
                }, 200);
            });
        }

        // 等待依赖加载完成后再启动应用
        checkDependencies().then(() => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startApp);
            } else {
                startApp();
            }
        });
    }

    function startApp() {
        // 恢复原有的内联样式方式，保持布局不变
        let app_styles = `position: absolute;
                      display: flex;
                      justify-content: flex-start;
                      top: 58px;
                      left: 240px;
                      z-index:2;
                      align-items: flex-start;
                      margin-top: 5px;`;
        let badge_style = `margin-top: 10px;margin-right: 40px;`;
        let week_time_style = `text-align: center;margin-left: 70px;cursor: pointer;`;
        let last_week_time_style = `text-align: center;margin-left: 60px;cursor: pointer;`;
        let calendar_style = `position: absolute;top: 53px;width: 500px; right: -160px;text-align: center;`;
        let calendat_body_style = `margin-top:2px;`;

        // 优化：增强的缓存机制和请求池
        const cache = new Map();
        const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存
        const requestPool = new Map(); // 请求池，避免重复请求

        function getCachedData(key) {
            const cached = cache.get(key);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                return cached.data;
            }
            return null;
        }

        function setCachedData(key, data) {
            cache.set(key, {
                data: data,
                timestamp: Date.now()
            });
        }

        // 请求去重和合并
        function createRequest(url, options = {}) {
            const cacheKey = `${url}_${JSON.stringify(options)}`;

            // 检查缓存
            const cachedData = getCachedData(cacheKey);
            if (cachedData) {
                return Promise.resolve(cachedData);
            }

            // 检查是否有相同的请求正在进行
            if (requestPool.has(cacheKey)) {
                return requestPool.get(cacheKey);
            }

            // 创建新请求
            const requestPromise = new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(options.method || 'GET', url, true);
                xhr.withCredentials = true;
                xhr.timeout = options.timeout || 8000; // 默认8秒超时

                // 设置请求头
                if (options.headers) {
                    Object.keys(options.headers).forEach(key => {
                        xhr.setRequestHeader(key, options.headers[key]);
                    });
                }

                xhr.onload = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                const data = JSON.parse(xhr.responseText);
                                setCachedData(cacheKey, data);
                                resolve(data);
                            } catch (parseError) {
                                reject(new Error('数据解析失败'));
                            }
                        } else {
                            reject(new Error(`请求失败: ${xhr.status}`));
                        }
                    }
                };

                xhr.onerror = () => reject(new Error('网络请求失败'));
                xhr.ontimeout = () => reject(new Error('请求超时'));

                xhr.send(options.body || null);
            }).finally(() => {
                // 请求完成后从池中移除
                requestPool.delete(cacheKey);
            });

            // 将请求添加到池中
            requestPool.set(cacheKey, requestPromise);
            return requestPromise;
        }

        // 优化：防抖函数
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // 优化：DOM操作工具
        const DOMUtils = {
            // 批量设置样式
            setStyles(element, styles) {
                if (!element) return;
                const cssText = Object.entries(styles)
                    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
                    .join('; ');
                element.style.cssText += cssText;
            },

            // 创建元素并设置属性
            createElement(tag, attributes = {}, styles = {}) {
                const element = document.createElement(tag);
                Object.entries(attributes).forEach(([key, value]) => {
                    if (key === 'innerHTML') {
                        element.innerHTML = value;
                    } else {
                        element.setAttribute(key, value);
                    }
                });
                this.setStyles(element, styles);
                return element;
            },

            // 批量查询选择器
            querySelectors(selectors) {
                for (const selector of selectors) {
                    const element = document.querySelector(selector);
                    if (element) return element;
                }
                return null;
            },

            // 延迟DOM操作直到空闲时间
            scheduleWork(callback) {
                if (typeof requestIdleCallback !== 'undefined') {
                    requestIdleCallback(callback, { timeout: 1000 });
                } else {
                    setTimeout(callback, 0);
                }
            }
        };
        // 优化：使用DocumentFragment创建DOM，提升性能
        const fragment = document.createDocumentFragment();
        const appDiv = DOMUtils.createElement('div', {
            id: 'app'
        }, {
            position: 'absolute',
            display: 'flex',
            'justify-content': 'flex-start',
            top: '58px',
            left: '240px',
            'z-index': '2',
            'align-items': 'flex-start',
            'margin-top': '5px'
        });

        // 优化的模板字符串，减少重复代码
        const badgeConfigs = [
            { value: 'sun_count', content: '所有任务/需求/Bug', text: '总任务', type: '' },
            { value: 'deadline_count', content: '24小时内将超时', text: '临期任务', type: 'warning' },
            { value: 'expired_count', content: '已延期', text: '延 期', type: '' },
            { value: 'feature_count', content: '需求', text: '需  求', type: 'primary' },
            { value: 'task_count', content: '任务', text: '任  务', type: 'primary' },
            { value: 'bug_count', content: 'Bug', text: 'Bug', type: 'warning' }
        ];

        let text = `<div id="app" style="${app_styles};">
           ${badgeConfigs.map(config => `
           <el-tooltip class="box-item" effect="light" content="${config.content}" placement="bottom">
             <el-badge :value="${config.value}" v-if="show_status" ${config.type ? `type="${config.type}"` : ''} style="${badge_style};">
               <el-tag${config.type ? ` type="${config.type}"` : ''}>${config.text}</el-tag>
             </el-badge>
           </el-tooltip>`).join('')}

           <el-popover placement="bottom" :width="360" trigger="hover" :popper-style="{ 'border-radius': '15px','cursor': 'pointer'}">
                <template #reference>
                    <el-statistic  style="${last_week_time_style}" v-if="show_status" title="上周工时(标准:40)" :value="last_work_time" @mouseenter="fetchTableData(0)">
                        <template #suffix >
                        <el-icon style="vertical-align: -0.125em">
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path><path fill="currentColor" d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z"></path><path fill="currentColor" d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32z"></path></svg>
                        </el-icon>
                        </template>
                    </el-statistic>
                </template>
                <el-table border stripe max-height="196" ref="tableRef" size="small" @selection-change="handleSelectionChange" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="gridData"  :table-layout="tableLayout">
                    <el-table-column prop="xq" label="星期" width="85">
                        <template #default="scope">
                            <el-tag
                                effect="light"
                                disable-transitions
                            >
                            {{ scope.row.xq }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rq" label="日期" width="85" ></el-table-column>
                    <el-table-column prop="gs" label="工时" width="54">
                        <template #default="scope">
                            <div :style="{ color: (scope.row.gs > 8 ? 'red' : (scope.row.gs >= 0 && scope.row.gs <= 8 ? '#099877' : '')) }">{{ scope.row.gs }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="110">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="handleDetail(scope.row.xq, scope.row.rq, scope.row.gs,0)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-popover>

            <el-popover placement="bottom" :width="360" trigger="hover" :popper-style="{ 'border-radius': '15px','cursor': 'pointer'}">
                <template #reference>
                    <el-statistic  style="${week_time_style}" v-if="show_status" title="本周工时(标准:40)" :value="work_time" @mouseenter="fetchTableData(1)">
                        <template #suffix >
                        <el-icon style="vertical-align: -0.125em" >
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768zm0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896z"></path><path fill="currentColor" d="M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32z"></path><path fill="currentColor" d="M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32z"></path></svg>
                        </el-icon>
                        </template>
                    </el-statistic>
                </template>
                <el-table border stripe max-height="196" ref="tableRef" size="small" @selection-change="handleSelectionChange" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="gridData"  :table-layout="tableLayout">
                    <el-table-column prop="xq" label="星期" width="85">
                        <template #default="scope">
                            <el-tag
                                effect="light"
                                disable-transitions
                            >
                            {{ scope.row.xq }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="rq" label="日期" width="85" ></el-table-column>
                    <el-table-column prop="gs" label="工时" width="54">
                        <template #default="scope">
                            <div :style="{ color: (scope.row.gs > 8 ? 'red' : (scope.row.gs >= 0 && scope.row.gs <= 8 ? '#099877' : '')) }">{{ scope.row.gs }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="110">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click="handleDetail(scope.row.xq, scope.row.rq, scope.row.gs,1)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-popover>

           <el-calendar ref="calendar" style="${calendar_style}"  v-model="selectedDate" @mouseover="showCalendar = true"  @mouseleave="showCalendar = false"  v-show="showCalendar"  :range="dateRange">
             <template #date-cell="{ data }">
               <div v-show="isInAllDate( data.day.split('-').slice(0).join('-') )" style="${calendat_body_style};">{{  data.day.split('-').slice(1).join('-') }}</div>
               <svg v-if="!isSpecifiedDate( data.day.split('-').slice(0).join('-') )&&isInAllDate( data.day.split('-').slice(0).join('-') )" style="${calendat_body_style};" t="1696519254340" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1893" width="20" height="20"><path d="M666.32 727.28L554.08 944.8a36.24 36.24 0 0 1-48.88 15.6c-7.12-3.68-12.8-9.52-16.16-16.8L384.64 722.24c-5.12-10.8-15.2-18.4-26.96-20.32L116.16 662.4a36.24 36.24 0 0 1-29.92-41.68c1.28-7.84 5.12-15.12 10.96-20.56l178.24-167.68a36.32 36.32 0 0 0 11.04-31.92l-37.12-241.92a36.264 36.264 0 0 1 53.36-37.28l214.56 117.68c10.48 5.76 23.12 5.92 33.76 0.56L769.6 129.6a36.24 36.24 0 0 1 51.92 39.2l-45.68 240.48c-2.24 11.76 1.44 23.84 9.84 32.32l172.16 173.92a36.264 36.264 0 0 1-0.24 51.28c-5.68 5.6-13.04 9.2-20.96 10.16l-242.8 30.88c-11.68 1.6-22.08 8.8-27.52 19.44z" fill="#bfbfbf" p-id="1894"></path><path d="M655.2 709.36l-104.4 202.4a33.8 33.8 0 0 1-45.52 14.56 33.824 33.824 0 0 1-15.04-15.6L393.04 704.72a33.744 33.744 0 0 0-25.12-18.96l-224.8-36.8a33.88 33.88 0 0 1-27.92-38.8c1.2-7.36 4.8-14.08 10.16-19.12l165.92-156.08a33.768 33.768 0 0 0 10.24-29.68l-34.48-225.2a33.784 33.784 0 0 1 28.24-38.48c7.36-1.12 14.88 0.24 21.36 3.76l199.76 109.52c9.76 5.36 21.52 5.52 31.44 0.56l203.44-102.4a33.792 33.792 0 0 1 48.4 36.48l-42.48 223.76c-2.08 10.88 1.36 22.16 9.2 30.08l160.24 161.84a33.752 33.752 0 0 1-0.24 47.76c-5.28 5.2-12.08 8.56-19.44 9.52L680.96 691.2a34.152 34.152 0 0 0-25.76 18.16z" fill="#bfbfbf" p-id="1895"></path><path d="M118.48 631.44l388.16-161.76 5.2 457.6a33.704 33.704 0 0 1-22.96-18.48L391.68 702.72a33.88 33.88 0 0 0-25.12-18.96l-224.8-36.72a33.504 33.504 0 0 1-23.28-15.6z m676.8-465.28c3.36 6.64 4.4 14.16 3.04 21.52l-42.48 223.76c-2.08 10.96 1.36 22.16 9.2 30.08l160.24 161.84c9.6 9.68 12.4 24.08 7.2 36.64L506.64 469.6l278.08-315.84c4.32 3.2 8 7.36 10.56 12.4z" fill="#bfbfbf" p-id="1896"></path></svg>
               <svg v-if="isSpecifiedDate( data.day.split('-').slice(0).join('-') )" style="${calendat_body_style};"  t="1696518710705" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1608" width="20" height="20"><path d="M666.32 727.28L554.08 944.8a36.24 36.24 0 0 1-48.88 15.6c-7.12-3.68-12.8-9.52-16.16-16.8L384.64 722.24c-5.12-10.8-15.2-18.4-26.96-20.32L116.16 662.4a36.24 36.24 0 0 1-29.92-41.68c1.28-7.84 5.12-15.12 10.96-20.56l178.24-167.68a36.32 36.32 0 0 0 11.04-31.92l-37.12-241.92a36.264 36.264 0 0 1 53.36-37.28l214.56 117.68c10.48 5.76 23.12 5.92 33.76 0.56L769.6 129.6a36.24 36.24 0 0 1 51.92 39.2l-45.68 240.48c-2.24 11.76 1.44 23.84 9.84 32.32l172.16 173.92a36.264 36.264 0 0 1-0.24 51.28c-5.68 5.6-13.04 9.2-20.96 10.16l-242.8 30.88c-11.68 1.6-22.08 8.8-27.52 19.44z" fill="#6E6E96" p-id="1609"></path><path d="M655.2 709.36l-104.4 202.4a33.8 33.8 0 0 1-45.52 14.56 33.824 33.824 0 0 1-15.04-15.6L393.04 704.72a33.744 33.744 0 0 0-25.12-18.96l-224.8-36.8a33.88 33.88 0 0 1-27.92-38.8c1.2-7.36 4.8-14.08 10.16-19.12l165.92-156.08a33.768 33.768 0 0 0 10.24-29.68l-34.48-225.2a33.784 33.784 0 0 1 28.24-38.48c7.36-1.12 14.88 0.24 21.36 3.76l199.76 109.52c9.76 5.36 21.52 5.52 31.44 0.56l203.44-102.4a33.792 33.792 0 0 1 48.4 36.48l-42.48 223.76c-2.08 10.88 1.36 22.16 9.2 30.08l160.24 161.84a33.752 33.752 0 0 1-0.24 47.76c-5.28 5.2-12.08 8.56-19.44 9.52L680.96 691.2a34.152 34.152 0 0 0-25.76 18.16z" fill="#FECD34" p-id="1610"></path><path d="M118.48 631.44l388.16-161.76 5.2 457.6a33.704 33.704 0 0 1-22.96-18.48L391.68 702.72a33.88 33.88 0 0 0-25.12-18.96l-224.8-36.72a33.504 33.504 0 0 1-23.28-15.6z m676.8-465.28c3.36 6.64 4.4 14.16 3.04 21.52l-42.48 223.76c-2.08 10.96 1.36 22.16 9.2 30.08l160.24 161.84c9.6 9.68 12.4 24.08 7.2 36.64L506.64 469.6l278.08-315.84c4.32 3.2 8 7.36 10.56 12.4z" fill="#FEA935" p-id="1611"></path></svg>
               <div v-if="isInAllDate( data.day.split('-').slice(0).join('-') )"  style="${calendat_body_style};">{{ registered_map[data.day] || 0 }}</div>
             </template>
           </el-calendar>
           <el-dialog v-model="showTable"  width="800" draggable :show-close="false" :style="{ 'border-radius': '15px' }">
                <div slot="title" style="margin-top: -10px;font-size: 17px;font-weight: 800;margin-bottom: 10px; display: flex;align-items: center;flex-direction: row;justify-content: space-between;">任务选择｜刷新任务状态<span><el-tooltip class="box-item" effect="dark" content="选中后，将直接推送周报内容"  placement="left"><el-checkbox v-model="push">直接推送</el-checkbox></el-tooltip><span></div>
                <el-table border stripe max-height="250" ref="tableRef" @selection-change="handleSelectionChange" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="tableData"  :table-layout="tableLayout">
                    <el-table-column type="selection" label="序号" width="35"></el-table-column>
                    <el-table-column prop="title" label="任务名称" width="555" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="assignee" label="任务负责人" width="95">
                        <template #default="scope">
                            <el-avatar :src="scope.row.assignee.avatar_url" style="background: white; width:20px; height:20px"></el-avatar>
                        </template>
                    </el-table-column>
                    <el-table-column prop="issue_state.title" label="状态"></el-table-column>
                </el-table>
                <el-input
                    v-model="textarea"
                    style="width: 100%"
                    :rows="4"
                    type="textarea"
                    placeholder="稍等，我有话要说！ 可重复补充信息\n      例如：在xxx任务中，虽然完成了，但是遇到了xxx困难，请求大佬支援...\n      例如：在本周任务中，我学会了xxx技能，并在飞书分享相关文档\n      例如：我遇到了些问题：1.新的技术；2.服务器问题"></el-input>
                <div style="display: flex; justify-content: center;">
                    <el-button :loading="pushLoading" type="primary" style="margin: 15px;" @click="chatAI">
                      <i class="fa fa-paper-plane"></i>&nbsp;&nbsp;GO GPT!
                    </el-button>
                    <el-button :loading="pushGiteeLoading" type="primary" style="margin: 15px;" @click="pushHtml">
                      <i class="fa fa-envelope"></i>&nbsp;&nbsp;发送周报
                    </el-button>
                </div>
                <el-input
                    v-model="textareaByAI"
                    style="width: 100%;height:auto"
                    v-if="textareaByAIShow"
                    type="textarea"
                    :rows="6"
                    placeholder=""></el-input>
            </el-dialog>

            <el-dialog v-model="showIssueTable"  width="800" draggable :show-close="false" :style="{  'z-index': '99999', 'border-radius': '15px' }">
                <div slot="title" style="margin-top: -10px;font-size: 20px;margin-left: 50px;margin-right: 50px;font-weight: 800;margin-bottom: 12px; display: flex;align-items: center;flex-direction: row;justify-content: space-between;">
                    <span>{{xq}}</span>
                    <span>时间:{{rq}}</span>
                    <span>总工时:{{gs}}</span>
                </div>
                <el-table border stripe max-height="450" ref="tableRef" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="tableIssueData"  :table-layout="tableLayout">
                    <el-table-column prop="issue_type.title" label="类型" width="150"></el-table-column>
                    <el-table-column prop="title" label="任务" width="350" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="gs" label="工时"></el-table-column>
                    <el-table-column label="跳转">
                        <template #default="scope">
                            <a @click="openNewTab(scope.row.link)" style="cursor: pointer;">前往查看</a>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>

        </div>`;
        var el = document.createElement("div");
        el.innerHTML = text;
        document.body.append(el);

        // 登录人对象
        class assignee {
            constructor() {
                this.data = {
                    id: null,
                    username: null,
                    name: null,
                    remark: null,
                    pinyin: null,
                    avatar_url: null,
                    is_enterprise_member: null,
                    is_history_member: null,
                    outsourced: null,
                };
            }
        }
        // 创建者对象
        class author {
            constructor() {
                this.data = {
                    id: null,
                    username: null,
                    name: null,
                    remark: null,
                    pinyin: null,
                    avatar_url: null,
                    is_enterprise_member: null,
                    is_history_member: null,
                    outsourced: null,
                };
            }
        }
        // 任务类型
        class issue_type {
            constructor() {
                this.data = {
                    id: null,
                    title: null,
                    template: null,
                    ident: null,
                    color: null,
                    is_system: null,
                    created_at: null,
                    updated_at: null,
                    category: null,
                    description: null,
                };
            }
        }
        // 任务状态
        class issue_state {
            constructor() {
                this.data = {
                    id: null,
                    title: null,
                    color: null,
                    icon: null,
                    command: null,
                    serial: null,
                    issue_types: [new issue_type()],
                    created_at: null,
                    updated_at: null,
                };
            }
        }
        // 工作项数据
        class issue_data {
            constructor() {
                this.total_count = 0;
                this.data = [
                    {
                        id: null,
                        root_id: null,
                        parent_id: null,
                        project_id: null,
                        ident: null,
                        title: null,
                        issue_state_id: null,
                        program_id: null,
                        state: null,
                        comments_count: null,
                        priority: null,
                        branch: null,
                        priority_human: null,
                        assignee: new assignee(),
                        duration: null,
                        created_at: null,
                        updated_at: null,
                        collaborators: [],
                        author: new author(),
                        milestone: null,
                        issue_state: new issue_state(),
                        issue_type: new issue_type(),
                        labels: [],
                        issue_extra: [],
                        plan_started_at: null,
                        deadline: null,
                        finished_at: null,
                        started_at: null,
                        security_hole: null,
                        is_star: null,
                        kanban_info: null,
                        estimated_duration: null,
                        // 任务单登记时间
                        registered_duration: 0,

                    },
                ];
            }
        }

        const App = {
            data() {
                return {
                    roult_path: null,
                    message: "Hello Gitee Plus",
                    elements: null,
                    work_time: 0,
                    last_work_time: 0,
                    issurDataTotal: null,
                    show_status: true,
                    sun_count: 0,
                    deadline_count: 0,
                    task_count: 0,
                    feature_count: 0,
                    bug_count: 0,
                    expired_count: 0,
                    calendar: null,
                    dateRange: null,
                    registered_map: {},
                    selectedDate: new Date(), // 添加选中的日期
                    showCalendar: false, // 控制日历组件的显示
                    tableData: [], // 任务表格数据
                    tableIssueData: [], // 工时表格数据
                    showTable: false, // 表格可见开关
                    showIssueTable: false, // 工时任务可见开关
                    dialogTableVisible: true,
                    tableLayout: "fixed",
                    selectionDatas: [], // 选中数据集合
                    textarea: "", // 补充内容文本域
                    push: false, // 直接推送开关
                    pushLoading: false, // loading开关
                    parentMessageId: 0, //上一次消息id
                    textareaByAI: "", // AI返回文本域
                    textareaByAIShow: false, //AI文本域展示开关
                    pushGiteeLoading: false,
                    gridData: [],
                    xq: "",
                    rq: "",
                    gs: ""
                };
            },
            mounted() {
                // 优化：性能监控和内存管理
                const startTime = performance.now();
                console.log('GiteePlus 开始初始化...');

                // 内存监控
                if (performance.memory) {
                    console.log(`GiteePlus 初始内存使用: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
                }

                // 添加页面卸载时的清理
                window.addEventListener('beforeunload', () => {
                    // 清理缓存
                    cache.clear();
                    requestPool.clear();
                    console.log('GiteePlus: 清理缓存和请求池');
                });

                // 优化：使用常量数组避免重复创建
                this.gridData = [
                    { rq: '', xq: '星期一', gs: '' },
                    { rq: '', xq: '星期二', gs: '' },
                    { rq: '', xq: '星期三', gs: '' },
                    { rq: '', xq: '星期四', gs: '' },
                    { rq: '', xq: '星期五', gs: '' },
                    { rq: '', xq: '星期六', gs: '' },
                    { rq: '', xq: '星期天', gs: '' }
                ];
                    // 获取当前公司的路由前缀
                    this.getRoluteStr()
                        .then((result) => {
                            this.roult_path = result.id;
                        })
                        .catch(function (error) {
                            console.error("Gitee客户端异常,获取公司路由失败");
                        });
                // 设置左侧标题为会员，右侧多余按钮
                this.hideComp();
                // 页面可见性的改变
                document.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === "visible") {
                        this.showNotification(
                            "Hi " +
                            JSON.parse(localStorage.getItem("gitee.user")).userInfo.name,
                            "欢迎回来 GiteePlus"
                        );
                        console.log("当前页面在浏览器打开标签");
                        // TODO 获取焦点，主动获取一次通知中，是否存在新的任务，如果有新的任务，将和上次离开时间对比，共有多少任务派出
                        // TODO 计算出任务数量，并显示在页面中
                    } else {
                        // TODO 页面进入后台，进行新的修改  记录时间
                    }
                });
                // 路由判定
                window.addEventListener("popstate", (event) => {
                    if (window.location.pathname.includes("dashboard")) {
                        this.show_status = true;
                    } else {
                        this.show_status = false;
                    }
                });
                // 周报滚动条显示
                this.$nextTick(async () => {
                    try {
                        const { current_week, last_week } = await this.get_week_reports();
                        await this.send_todo_num_request();
                        if (
                            (last_week.id != null && current_week.id == null) ||
                            (last_week.id != undefined && current_week.id == undefined)
                        ) {
                            const article = document.createElement("div");
                            article.setAttribute("id", "team-members");
                            article.innerHTML =
                                `
                            <article class="team-member">
                                <img
                                    class="team-member-avatar"
                                    src="`+ JSON.parse(localStorage.getItem("gitee.user")).userInfo.avatar_url + `"
                                    alt="Team Member"
                                />
                                <div class="team-member-name">
                                    <h3>周报汇报</h3>
                                    <p>本周周报还没写</p>
                                </div>
                                <ul class="social-links">
                                        <a class="zb" href="#"><i class="fa-solid fa-calendar"></i></a>
                                </ul>
                            </article>
                           <article class="team-member">
                                <div class="team-member-name">
                                    <h3>贴心通知</h3>
                                    <p>24h内需完成任务, 共 ` +
                                this.deadline_count +
                                ` 条</p>
                                </div>
                                <ul class="social-links">
                                    <li>
                                        <a href="#"><i class="fa-solid fa-ellipsis" style="color: #f3de53;"></i></a>
                                    </li>
                                </ul>
                            </article>
                             <article class="team-member">
                                <div class="team-member-name">
                                    <h3>超时提醒</h3>
                                    <p>当前累计超时单, 共 ` +
                                this.expired_count +
                                ` 条</p>
                                </div>
                                <ul class="social-links">
                                    <li>
                                        <a href="#"><i class="fa-solid fa-bell" style="color: #de7cc9;"></i></a>
                                    </li>
                                </ul>
                            </article>
                            `;
                            let style = document.createElement("style");
                            style.innerHTML = `
                                h3{
                                    margin: 0;
                                }
                                #team-members {
                                    display: flex;
                                    font-size: 1rem;
                                    background-position: center center;
                                    background-size: cover;
                                    display: flex;
                                    flex-direction: column;
                                    gap: 16px;
                                    width: 100%;
                                    max-width: 550px;
                                    margin: auto;
                                    padding: 50px;
                                    background: rgba(255, 255, 255, 0.25);
                                    backdrop-filter: blur(10px);
                                    border-radius: 10px;
                                    border: 1px solid rgba(255, 255, 255, 0.08);
                                    filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.3));
                                }
                                .team-member {
                                    position: relative;
                                    display: flex;
                                    align-items: center;
                                    flex-wrap: wrap;
                                    gap: 5px;
                                    min-height: 60px;
                                    padding-top: 4px;
                                    padding-bottom: 4px;
                                    padding-left: 15px;
                                    padding-right: 15px;
                                    background-color: #ffffff;
                                    border-radius: 25px;
                                    font-size: large;
                                    z-index: 1;
                                }
                                .team-member:hover {
                                    cursor: grab;
                                }
                                .team-member-avatar {
                                    width: 3.75rem;
                                    height: 3.75rem;
                                    object-fit: cover;
                                    border-radius: 50%;
                                }
                                .team-member-name {
                                    display: grid;
                                    gap: 0.125rem;
                                }
                                .team-member-name h3 {
                                    color: #2a70dc;
                                    font-size: large;
                                }
                                .team-member-name p {
                                    font-size: smaller;
                                }
                                .team-member-chosen {
                                    box-shadow: 8px 8px 32px rgba(0, 0, 0, 0.3);
                                }
                                .team-member-drag {
                                    opacity: 0;
                                }
                                .social-links {
                                    display: flex;
                                    flex-direction: row;
                                    gap: 6px;
                                    margin-left: auto;
                                    padding: 0;
                                    list-style-type: none;
                                }
                                .social-links i {
                                    width: 1.25rem;
                                    height: 1.25rem;
                                    font-size: 1.25rem;
                                }
                                `;
                            document.head.appendChild(style);
                            this.addWeekReportTips(article);
                            new Sortable(article, {
                                animation: 350,
                                chosenClass: "team-member-chosen",
                                dragClass: "team-member-drag",
                            });
                            const currentDate = new Date();
                            const currentDay = currentDate.getDay();
                            if (currentDay >= 5) {
                                // TODO 对今天是周五的情况下，且周报也未获取到，继续处理
                            }
                        }
                        // 去除不写周报的提示
                    } catch (error) {
                        console.error("Gitee客户端异常,获取周报失败");
                    }
                    this.$nextTick(() => {
                        const img = document.querySelector(".zb");
                        if (img) {
                            img.addEventListener("click", this.showTableData);
                        }
                    });
                });
                this.send_todo_num_request()
                    .then((issue_str) => {
                        return this.send_issue_data_request(issue_str);
                    })
                    .then((issue) => {
                        // 处理返回的 issue 数据
                        this.issurDataTotal = issue;
                        // 优化：批量处理数据，减少循环次数
                        this.sun_count = this.issurDataTotal.total_count;
                        if (this.issurDataTotal.total_count > 0 && this.issurDataTotal.data.length > 0) {
                            // 预定义常量，避免重复创建
                            const currentTime = new Date().getTime();
                            const HOUR_24_MS = 24 * 60 * 60 * 1000;
                            const BUG_TYPE_ID = 626337;
                            const FEATURE_TYPE_ID = 626336;
                            const VALID_TASK_IDS = new Set([16690, 662615, 757073, 757074, 766555]);

                            // 使用单次循环处理所有逻辑
                            const counts = this.issurDataTotal.data.reduce((acc, info) => {
                                // 处理截止时间
                                if (info.deadline) {
                                    const deadlineTime = new Date(info.deadline).getTime();
                                    const timeDiff = deadlineTime - currentTime;

                                    if (timeDiff >= 0 && timeDiff <= HOUR_24_MS) {
                                        acc.deadline++;
                                    } else if (timeDiff < 0) {
                                        acc.expired++;
                                    }
                                }

                                // 处理任务类型分类
                                const typeId = info.issue_type.id;
                                if (typeId === BUG_TYPE_ID) {
                                    acc.bug++;
                                } else if (typeId === FEATURE_TYPE_ID) {
                                    acc.feature++;
                                } else if (VALID_TASK_IDS.has(typeId)) {
                                    acc.task++;
                                }

                                return acc;
                            }, { deadline: 0, expired: 0, bug: 0, feature: 0, task: 0 });

                            // 批量赋值
                            Object.assign(this, {
                                deadline_count: counts.deadline,
                                expired_count: counts.expired,
                                bug_count: counts.bug,
                                feature_count: counts.feature,
                                task_count: counts.task
                            });
                            // 调用element-plus的通知，可以等待通知消息接收到再处理
                            if (this.deadline_count > 0) {
                                this.$notify({
                                    title: "贴心通知",
                                    type: "warning",
                                    message:
                                        "注意！您有24小时内需完成的任务，共 " +
                                        this.deadline_count +
                                        " 条",
                                    position: "bottom-right",
                                    showClose: false,
                                    offset: 50,
                                    duration: 3000,
                                });
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Gitee客户端异常", error);
                    });
                // 工时获取，本周工时，上周工时
                this.get_week_time()
                    .then((result) => {
                        if (result != null) {
                            var dates = result.dates;
                            var all_registered_duration = result.all_registered_duration;
                            var daily_registered_duration_count =
                                result.daily_registered_duration_count;
                            this.work_time = all_registered_duration;
                            // 设置期限为本周
                            this.allDate = dates;
                            this.dateRange = [new Date(dates[0]), new Date(dates[6])];
                            var registered_count = [];
                            for (let i = 0; i < dates.length; i++) {
                                var key = dates[i].replace(/"/g, "");
                                var value = daily_registered_duration_count[key];
                                registered_count[key] = value;
                            }
                            this.registered_map = registered_count;
                        }
                    })
                    .catch(function (error) {
                        console.error("Gitee客户端异常,获取工时失败");
                    });
                this.get_last_week_time()
                    .then((result) => {
                        if (result != null) {
                            var all_registered_duration = result.all_registered_duration;
                            this.last_work_time = all_registered_duration;
                        }
                    })
                    .catch(function (error) {
                        console.error("Gitee客户端异常,获取工时失败");
                    });
                // 获取截止到本周日的所有工作任务，排除需求，并赋值给talbeData
                this.send_issue_week_data_request();

                // 优化：性能监控结束
                this.$nextTick(() => {
                    const endTime = performance.now();
                    console.log(`GiteePlus 初始化完成，耗时: ${(endTime - startTime).toFixed(2)}ms`);
                });
            },
            methods: {
                // 查看任务和工时分布情况
                handleDetail(xq, rq, gs, type) {
                    this.tableIssueData = [];
                    this.showIssueTable = true;
                    this.xq = xq;
                    this.rq = rq;
                    this.gs = gs;
                    var enterprisePath = localStorage.getItem("enterprisePath");
                    if (type == 1) {
                        // 拿到日期和工时,重新打开弹窗表格，显示当前内容
                        for (const key in this.tableData) {
                            // 获取任务的编码
                            const id = this.tableData[key].id;
                            // 发送请求，获取登记工时日志
                            this.getWorkLog(id).then((result) => {
                                const data_list = result.data;
                                if (data_list.length != 0) {
                                    for (const _key in data_list) {
                                        if (data_list[_key].registered_at == rq) {
                                            this.tableData[key].gs = data_list[_key].duration
                                            this.tableData[key].link = "https://e.gitee.com/" + enterprisePath + "/dashboard?issue=" + this.tableData[key].ident + "&issue_detail_tab=work-time"
                                            this.tableIssueData.push(this.tableData[key])
                                        }
                                    }
                                }
                            })
                                .catch(function (error) {
                                    console.error("Gitee客户端异常,获取本周任务列表工时");
                                });
                        }
                    } else {
                        this.getIssuseLastWeekDataByUserAndPlanTime().then((result) => {
                            // 获取到上周的任务列表
                            const last_data_list = result.data;
                            for (const key in last_data_list) {
                                // 获取任务的编码
                                const id = last_data_list[key].id;
                                // 发送请求，获取登记工时日志
                                this.getWorkLog(id).then((result) => {
                                    const data_list = result.data;
                                    if (data_list.length != 0) {
                                        for (const _key in data_list) {
                                            if (data_list[_key].registered_at == rq) {
                                                last_data_list[key].gs = data_list[_key].duration
                                                last_data_list[key].link = "https://e.gitee.com/" + enterprisePath + "/dashboard?issue=" + last_data_list[key].ident + "&issue_detail_tab=work-time"
                                                this.getPrograms().then((result) => {
                                                    const programs_list = result.data;
                                                    for (const program_key in programs_list) {
                                                        if (programs_list[program_key].id == last_data_list[key].program_id) {
                                                            // 继续发送请求，获取任务的类型列表
                                                            this.getIssuseTypeByProgram(programs_list[program_key].id).then((result) => {
                                                                const issuseType_list = result.data;
                                                                for (const type in issuseType_list) {
                                                                    if (issuseType_list[type].id == last_data_list[key].issue_type_id) {
                                                                        last_data_list[key].issue_type = {
                                                                            title: issuseType_list[type].title
                                                                        };
                                                                        this.tableIssueData.push(last_data_list[key])
                                                                    }
                                                                }
                                                            }).catch(function (error) {
                                                                console.error("Gitee客户端异常,获取项目任务类型异常");
                                                            });
                                                        }
                                                    }
                                                }).catch(function (error) {
                                                    console.error("Gitee客户端异常,获取项目异常");
                                                });

                                            }
                                        }
                                    }
                                })
                                    .catch(function (error) {
                                        console.error("Gitee客户端异常,获取本周任务列表工时");
                                    });

                            }
                        })
                            .catch(function (error) {
                                console.error("Gitee客户端异常,获取上周任务列表工时");
                            });
                    }
                },
                openNewTab(url) {
                    window.open(url, '_blank');
                },
                // 鼠标浮动，重新获取数据
                fetchTableData(type) {
                    if (type === 1) {
                        // 当前属于获取本周的登记的工时详情
                        this.get_week_time()
                            .then((result) => {
                                if (result != null) {
                                    var dates = result.dates;
                                    var daily_registered_duration_count =
                                        result.daily_registered_duration_count;
                                    for (const key in dates) {
                                        this.gridData[key].rq = dates[key]
                                        this.gridData[key].gs = daily_registered_duration_count[this.gridData[key].rq]
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.error("Gitee客户端异常,获取工时失败");
                            });
                    } else {
                        // 当前属于获取上周的工时详情
                        this.get_last_week_time()
                            .then((result) => {
                                if (result != null) {
                                    var dates = result.dates;
                                    var all_registered_duration = result.daily_registered_duration_count;
                                    for (const key in dates) {
                                        this.gridData[key].rq = dates[key]
                                        this.gridData[key].gs = all_registered_duration[this.gridData[key].rq]
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.error("Gitee客户端异常,获取工时失败");
                            });
                    }

                },
                // 获取当前选中的选项
                handleSelectionChange(selection) {
                    // 此处能够获取到当前选中的数据，我们可以通过将数据保存在一个新的数组中
                    this.selectionDatas = selection;
                    for (let index = 0; index < this.selectionDatas.length; index++) {
                        const element = this.selectionDatas[index];
                        console.log(element);
                    }
                },
                // 显示任务清单表格
                showTableData() {
                    this.showTable = !this.showTable;
                },
                // 隐藏多余按钮
                display_none_btn() {
                    this.elements = document.querySelectorAll(
                        ".ge-app-top-right .ge-app-top-nav"
                    );
                    for (let i = 0; i < this.elements.length; i++) {
                        if (i === 0 || i === 1 || i === 3) {
                            this.elements[i].style.display = "none";
                        }
                    }
                },
                // 创建GoogleChrome软件系统通知显示,需要开通GoogleChrome的通知权限
                showNotification(title, message) {
                    var notification = new unsafeWindow.Notification(title, {
                        body: message,
                        icon: "https://e.gitee.com/assets/images/favicon.ico",
                    });
                    setTimeout(function () {
                        notification.close();
                    }, 4000);
                },
                // 优化：获取周报状态（添加缓存）
                get_week_reports() {
                    const _this = this;
                    const currentYear = new Date().getFullYear();
                    const cacheKey = `week_reports_${currentYear}`;

                    // 检查缓存
                    const cachedData = getCachedData(cacheKey);
                    if (cachedData) {
                        return Promise.resolve(cachedData);
                    }

                    return new Promise(function (resolve, reject) {
                        _this.getRoluteStr()
                            .then(function () {
                                const xhr = new XMLHttpRequest();
                                xhr.open(
                                    "GET",
                                    "https://api.gitee.com/enterprises/" +
                                    _this.roult_path +
                                    "/week_reports/my_reports?year=" +
                                    currentYear,
                                    true
                                );
                                xhr.withCredentials = true;
                                xhr.timeout = 10000; // 10秒超时

                                xhr.onload = function () {
                                    if (xhr.readyState === 4) {
                                        if (xhr.status === 200) {
                                            try {
                                                const respbody = JSON.parse(xhr.responseText);
                                                const result = {
                                                    current_week: respbody.data[0],
                                                    last_week: respbody.data[1],
                                                };
                                                setCachedData(cacheKey, result);
                                                resolve(result);
                                            } catch (parseError) {
                                                reject("数据解析失败");
                                            }
                                        } else {
                                            reject(`请求失败: ${xhr.status}`);
                                        }
                                    }
                                };

                                xhr.onerror = () => reject("网络请求失败");
                                xhr.ontimeout = () => reject("请求超时");
                                xhr.send(null);
                            })
                            .catch(reject);
                    });
                },
                // 获取todo_num数量
                send_todo_num_request() {
                    const _this = this;
                    return new Promise(async function (resolve, reject) {
                        await _this.getRoluteStr();
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path +
                            "/issues/stat_count?todo=true&today=true&week=true&overdue=true&star=true&all=true",
                            true
                        );
                        // 设置XMLHttpRequest 自动获取Cookie
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    var issue_str = respbody.todo;
                                    resolve(issue_str); // 将获取到的值传递给 Promise 的 resolve 方法
                                } else {
                                    reject("Gitee客户端异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("信息获取异常");
                        };
                        // 发送请求
                        xhr.send(null);
                    });
                },
                // 获取任务总集合
                send_issue_data_request(todo_nums) {
                    const _this = this;
                    return new Promise(async function (resolve, reject) {
                        await _this.getRoluteStr();
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path +
                            "/issues?state=open,progressing&only_related_me=1&page=1&offset=0&per_page=" +
                            todo_nums,
                            true
                        );
                        // 设置XMLHttpRequest 自动获取Cookie
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var work_json = xhr.responseText;
                                    var issueData = new issue_data();
                                    issueData = JSON.parse(work_json);
                                    var issue = Object.assign(new issue_data(), issueData);
                                    resolve(issue);
                                } else {
                                    reject("Gitee客户端异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("信息获取异常");
                        };
                        // 发送请求
                        xhr.send(null);
                    });
                },
                // 获取本周任务总集合
                send_issue_week_data_request() {
                    const _this = this;
                    return new Promise(async function (resolve, reject) {
                        await _this.getRoluteStr();
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path +
                            "/issues?deadline_type=week&only_related_me=1",
                            true
                        );
                        // 设置XMLHttpRequest 自动获取Cookie
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var work_json = xhr.responseText;
                                    var issueData = new issue_data();
                                    issueData = JSON.parse(work_json);
                                    for (let index = 0; index < issueData.data.length; index++) {
                                        const element = issueData.data[index];
                                        // 需要是自己的任务
                                        if (
                                            element.assignee.id ==
                                            JSON.parse(localStorage.getItem("gitee.user")).userInfo.id
                                        ) {
                                            // 不需要计算需求类型
                                            if (element.issue_type.id != 626336) {
                                                _this.tableData.push(element);
                                            }
                                        }
                                    }
                                    var issue = Object.assign(new issue_data(), issueData);
                                    resolve(issue);
                                } else {
                                    reject("Gitee客户端异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("信息获取异常");
                        };
                        // 发送请求
                        xhr.send(null);
                    });
                },
                // 计算时间差
                get_hour_difference(deadline) {
                    var currentTime = new Date();
                    var specifiedTime = new Date(deadline);
                    if (currentTime <= specifiedTime) {
                        var diffMs = specifiedTime - currentTime;
                        var diffHours = Math.floor(diffMs / 1000 / 60 / 60);
                        return diffHours;
                    }
                    return null;
                },
                // 获取工时状态
                get_week_time() {
                    // 获取当前日期
                    var currentDate = new Date();
                    // 获取当前日期是一周中的第几天（0-6，其中0表示星期日）
                    var currentDay = currentDate.getDay();
                    // 计算当前一周的第一天和最后一天的日期
                    var firstDayOfWeek = new Date(
                        currentDate.setDate(currentDate.getDate() - currentDay + 1)
                    );
                    var lastDayOfWeek = new Date(
                        currentDate.setDate(currentDate.getDate() - currentDay + 7)
                    );
                    // 创建一个数组来存储一周的日期
                    var weekDates = [];
                    // 循环获取一周的日期并将其存入数组
                    for (var i = 0; i <= 6; i++) {
                        var date = new Date(firstDayOfWeek);
                        date.setDate(firstDayOfWeek.getDate() + i);
                        weekDates.push(date);
                    }
                    // 遍历时间，格式化日期为"YYYY-MM-DD"的格式
                    var formattedDates = weekDates.map(function (date) {
                        var year = date.getFullYear();
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var day = ("0" + date.getDate()).slice(-2);
                        return year + "-" + month + "-" + day;
                    });
                    // 当前一周的日期，传入工时接口
                    const _this = this;
                    return new Promise(async function (resolve, reject) {
                        await _this.getRoluteStr();
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path +
                            "/statistics/user_daily_workloads_overview?search=" +
                            JSON.parse(localStorage.getItem("gitee.user")).userInfo
                                .username +
                            "&start_date=" +
                            formattedDates[0] +
                            "&end_date=" +
                            formattedDates[6],
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    var all_registered_duration =
                                        respbody.all_registered_duration;
                                    var daily_registered_duration_count =
                                        respbody.daily_registered_duration_count;
                                    var dates = respbody.dates;
                                    resolve({
                                        all_registered_duration: all_registered_duration,
                                        daily_registered_duration_count:
                                            daily_registered_duration_count,
                                        dates: dates,
                                    });
                                } else {
                                    reject("Gitee客户端异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("工时获取异常");
                        };
                        xhr.send(null);
                    });
                },
                // 获取上周的工时
                get_last_week_time() {
                    // 获取当前日期
                    var currentDate = new Date();
                    // 计算上周的第一天和最后一天的日期
                    var firstDayOfLastWeek = new Date(
                        currentDate.setDate(
                            currentDate.getDate() - currentDate.getDay() - 6
                        )
                    );
                    // 创建一个数组来存储上周的日期
                    var weekDates = [];
                    // 循环获取上周的日期并将其存入数组
                    for (var i = 0; i <= 6; i++) {
                        var date = new Date(firstDayOfLastWeek);
                        date.setDate(firstDayOfLastWeek.getDate() + i);
                        weekDates.push(date);
                    }
                    // 遍历时间，格式化日期为"YYYY-MM-DD"的格式
                    var formattedDates = weekDates.map(function (date) {
                        var year = date.getFullYear();
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var day = ("0" + date.getDate()).slice(-2);
                        return year + "-" + month + "-" + day;
                    });
                    // 当前一周的日期，传入工时接口
                    const _this = this;
                    return new Promise(async function (resolve, reject) {
                        await _this.getRoluteStr();
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path +
                            "/statistics/user_daily_workloads_overview?search=" +
                            JSON.parse(localStorage.getItem("gitee.user")).userInfo
                                .username +
                            "&start_date=" +
                            formattedDates[0] +
                            "&end_date=" +
                            formattedDates[6],
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    var all_registered_duration =
                                        respbody.all_registered_duration;
                                    var daily_registered_duration_count =
                                        respbody.daily_registered_duration_count;
                                    var dates = respbody.dates;
                                    resolve({
                                        all_registered_duration: all_registered_duration,
                                        daily_registered_duration_count:
                                            daily_registered_duration_count,
                                        dates: dates,
                                    });
                                } else {
                                    reject("上周工时获取异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("上周工时获取异常");
                        };
                        xhr.send(null);
                    });
                },
                showCalendarOnMouseover() {
                    this.showCalendar = true;
                },
                isSpecifiedDate(date) {
                    // 根据你的指定日期进行判断逻辑
                    var current_time = new Date(date);
                    const specifiedDate = new Date();
                    // 分别获取日期对象的年、月、日
                    const yearMatched =
                        current_time.getFullYear() === specifiedDate.getFullYear();
                    const monthMatched =
                        current_time.getMonth() === specifiedDate.getMonth();
                    const dayMatched = current_time.getDate() === specifiedDate.getDate();
                    // 判断年、月、日是否都匹配
                    return yearMatched && monthMatched && dayMatched;
                },
                isInAllDate(dateTime) {
                    // 获取当前日期
                    var currentDate = new Date();

                    // 获取当前日期是一周中的第几天（0-6，其中0表示星期日）
                    var currentDay = currentDate.getDay();

                    // 计算当前一周的第一天和最后一天的日期
                    var firstDayOfWeek = new Date(
                        currentDate.setDate(currentDate.getDate() - currentDay + 1)
                    );
                    var lastDayOfWeek = new Date(
                        currentDate.setDate(currentDate.getDate() - currentDay + 7)
                    );

                    // 创建一个数组来存储一周的日期
                    var weekDates = [];

                    // 循环获取一周的日期并将其存入数组
                    for (var i = 0; i <= 6; i++) {
                        var date = new Date(firstDayOfWeek);
                        date.setDate(firstDayOfWeek.getDate() + i);
                        weekDates.push(date);
                    }

                    // 格式化日期为"YYYY-MM-DD"的格式
                    var formattedDates = weekDates.map(function (date) {
                        var year = date.getFullYear();
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var day = ("0" + date.getDate()).slice(-2);
                        return year + "-" + month + "-" + day;
                    });
                    if (formattedDates.includes(dateTime)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                getRoluteStr() {
                    const _this = this;
                    return new Promise(function (resolve, reject) {
                        var enterprisePath = localStorage.getItem("enterprisePath");
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/basic_info?enterprise_path=" +
                            enterprisePath,
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    var enterprises = respbody.enterprises;
                                    const result = enterprises.find(
                                        (obj) => obj.path === enterprisePath
                                    );
                                    resolve({ id: result.id });
                                } else {
                                    reject("公司id获取异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("上周工时获取异常");
                        };
                        xhr.send(null);
                    });
                },
                getNoUseElement() {
                    return new Promise((resolve, reject) => {
                        let retryCount = 0;
                        const maxRetries = 3;
                        const timeout = 8000; // 增加超时时间到8秒

                        const tryFindElements = () => {
                            // 尝试多种选择器组合，适应页面结构变化
                            const elementSelectors = [
                                ".level-label.level-label--standard",
                                ".level-label",
                                "[class*='level-label']"
                            ];

                            const avatarSelectors = [
                                ".nav-item.user",
                                ".user",
                                "[class*='nav-item'][class*='user']",
                                ".ge-app-top-right .nav-item"
                            ];

                            const reportViewSelectors = [
                                ".nav-item",
                                "[class*='nav-item']",
                                ".nav-item"
                            ];

                            const topNavSelectors = [
                                ".ge-app-top-right .ge-app-top-nav",
                                ".ge-app-top-nav",
                                "[class*='ge-app-top-nav']"
                            ];

                            const topAiSelectors = [
                                "#topbarBot",
                                ".topbarBot",
                                "[id*='topbarBot']"
                            ];

                            let element = null;
                            let avator = null;
                            let reportView = null;
                            let topNav = null;
                            let topAiNav = null;

                            // 尝试找到元素
                            for (const selector of elementSelectors) {
                                element = document.querySelector(selector);
                                if (element) break;
                            }

                            for (const selector of avatarSelectors) {
                                avator = document.querySelector(selector);
                                if (avator) break;
                            }

                            for (const selector of reportViewSelectors) {
                                reportView = document.querySelector(selector);
                                if (reportView) break;
                            }
                            for (const selector of topAiSelectors) {
                                topAiNav = document.querySelector(selector);
                                if (topAiNav) break;
                            }

                            for (const selector of topNavSelectors) {
                                topNav = document.querySelectorAll(selector);
                                if (topNav && topNav.length > 0) break;
                            }

                            return { element, avator, reportView, topNav,topAiNav };
                        };

                        const observer = new MutationObserver((mutationsList, observer) => {
                            const { element, avator, reportView, topNav, topAiNav } = tryFindElements();

                            if (element && avator && topNav && reportView) {
                                observer.disconnect();
                                console.log('GiteePlus: 成功找到所有必需的DOM元素');
                                resolve({ element, avator, topNav, reportView, topAiNav });
                            }
                        });

                        // 立即尝试一次
                        const { element, avator, reportView, topNav, topAiNav } = tryFindElements();
                        if (element && avator && topNav && reportView) {
                            console.log('GiteePlus: 立即找到所有必需的DOM元素');
                            resolve({ element, avator, topNav, reportView, topAiNav });
                            return;
                        }

                        observer.observe(document.body, {
                            attributes: true,
                            childList: true,
                            subtree: true,
                        });

                        setTimeout(() => {
                            observer.disconnect();
                            retryCount++;

                            if (retryCount < maxRetries) {
                                console.log(`GiteePlus: 第${retryCount}次重试查找DOM元素...`);
                                setTimeout(() => {
                                    this.getNoUseElement().then(resolve).catch(reject);
                                }, 1000);
                            } else {
                                console.warn('GiteePlus: 未能找到所有必需的DOM元素，但继续运行');
                                // 返回找到的元素，即使不完整
                                const { element, avator, reportView, topNav, topAiNav } = tryFindElements();
                                resolve({
                                    element: element || null,
                                    avator: avator || null,
                                    topNav: topNav || [],
                                    reportView: reportView || null,
                                    topAiNav: topAiNav || null
                                });
                            }
                        }, timeout);
                    });
                },
                async hideComp() {
                    try {
                        const { element, avator, topNav, reportView, topAiNav } =
                            await this.getNoUseElement();

                        // 安全地处理每个元素
                        if (element) {
                            element.innerHTML = "Plus";
                            element.style.background = "linear-gradient(90deg,#c9e7ff,#f3bc4c)";
                            element.style.fontSize = "16px";
                            element.style.color = "#093978";
                        } else {
                            console.warn('GiteePlus: 未找到level-label元素，跳过样式设置');
                        }

                        if (avator) {
                            const svgContainer = document.createElement("div");
                            svgContainer.innerHTML = `<svg t="1696521690855" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14197" width="16" height="16"><path d="M308.586 388.462c10.932 6.596 25.134 3.01 31.496-7.902 33.666-57.784 92.488-158.71 131.688-225.968 17.562-30.122 61.848-30.122 79.408 0 39.2 67.26 98.024 168.184 131.712 225.968 6.362 10.912 20.564 14.5 31.472 7.902 57.792-34.924 123.604-78.328 173.824-112.194 32.056-21.624 75.466 2.736 71.568 40.698-12.946 126.192-39.312 349.476-76.764 499.802-5.286 21.168-17.764 39.334-38.864 46.166-40.656 13.126-132.452 30.666-332.64 30.666-195.328 0-287.46-16.688-329.594-29.702-23.206-7.168-36.354-27.306-41.418-50.646-36.69-169.816-62.832-376.206-76.18-495.084-4.28-38.124 39.31-62.924 71.544-41.19 50.086 33.762 115.382 76.804 172.748 111.484z" fill="#FCBF28" p-id="14198"></path><path d="M646.4 602.4c0 33.6-100.8 179.2-134.4 179.2-33.6 0-134.4-145.6-134.4-179.2 0-33.6 100.8-179.2 134.4-179.2 33.6 0 134.4 145.6 134.4 179.2z" fill="#FFFFFF" p-id="14199"></path></svg>`;
                            avator.appendChild(svgContainer);
                            avator.style.position = "relative";
                            svgContainer.style.position = "absolute";
                            svgContainer.style.top = "3px";
                            svgContainer.style.left = "12px";
                        } else {
                            console.warn('GiteePlus: 未找到用户头像元素，跳过图标添加');
                        }

                        if (topNav && topNav.length > 0) {
                            for (let i = 0; i < topNav.length; i++) {
                                if (i === 0 || i === 1 || i === 3) {
                                    topNav[i].style.display = "none";
                                }
                            }
                        } else {
                            console.warn('GiteePlus: 未找到顶部导航元素，跳过隐藏操作');
                        }

                        if (reportView) {
                            reportView.style.display = "flex";
                        } else {
                            console.warn('GiteePlus: 未找到报告视图元素，跳过显示设置');
                        }

                        if (topAiNav) {
                            // 对topbarBot元素进行特殊处理
                            topAiNav.style.display = "none"; // 或者其他需要的样式设置
                            console.log('GiteePlus: 成功处理topbarBot元素');
                        } else {
                            console.warn('GiteePlus: 未找到topbarBot元素，跳过处理');
                        }

                        console.log('GiteePlus: 页面组件初始化完成');
                    } catch (error) {
                        console.error('GiteePlus: 页面组件初始化失败，但继续运行:', error.message);
                        // 不再抛出错误，让应用继续运行
                    }
                },
                getWeekReportElement() {
                    return new Promise((resolve, reject) => {
                        const element = document.querySelector(".reports-view");
                        const ele = document.querySelector(".markdown-body.text-disabled");

                        if (element && ele) {
                            resolve({ element, ele });
                        } else {
                            const observer = new MutationObserver(
                                (mutationsList, observer) => {
                                    const element = document.querySelector(".reports-view");
                                    const ele = document.querySelector(
                                        ".markdown-body.text-disabled"
                                    );

                                    if (element && ele) {
                                        observer.disconnect();
                                        resolve({ element, ele });
                                    }
                                }
                            );

                            observer.observe(document.body, {
                                attributes: true,
                                childList: true,
                                subtree: true,
                            });

                            setTimeout(() => {
                                observer.disconnect();
                                reject(new Error("超时，未找到组件"));
                            }, 10000);
                        }
                    });
                },
                // api信息
                chatAI() {
                    const _this = this; // 保存正确的上下文
                    _this.pushLoading = true;
                    var datas = _this.selectionDatas //选中的数据
                    var sendStr = "";
                    var respHtml = "";
                    _this.textarea // 文本域数据
                    _this.push // 直接推送开关
                    // 根据上面条件，进行逻辑处理
                    if (datas) {
                        for (let index = 0; index < datas.length; index++) {
                            const element = datas[index];
                            sendStr = sendStr + "完成了" + element.title + ";\n"
                        }
                    }
                    // 追加文本域内容
                    sendStr += _this.textarea + "\n下面，请按照我给的周报模版，根据上面的信息，给我生成一份精美的周报，丰富我的语句，语言表达简单清楚。除了周报模版的内容，不要输出多余的字\n### 本周工作总结\n1.\n2.\n#### 存在问题\n1.\n2.\n### 下周工作计划\n1.\n2.\n#### 需要支持\n1.\n2.";
                    var dataToSend = {
                        prompt: sendStr,
                        options: {
                            parentMessageId: ""
                        },
                        systemMessage: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
                        temperature: 0.8,
                        top_p: 1
                    };
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'http://w9.xjai.cc/api/chat-process',
                        data: JSON.stringify(dataToSend),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        onload: function (response) {
                            if (response.status === 200) {
                                const resp = response.responseText;
                                let splittedText = resp.split("&KFw6loC9Qvy&");
                                let separator = '_______________________';
                                let codeStr = '希望以上内容能够为您清晰地呈现本周工作情况和下周计划，谢谢！';
                                const splitStr = splittedText[1].split(separator)[0].trim()
                                respHtml = splitStr.split(codeStr)[0].trim();
                                _this.textareaByAIShow = true;
                                _this.textareaByAI = respHtml;
                                if (_this.push) {
                                    // 获取今天的日期
                                    let now = new Date();
                                    // 获取当前年份
                                    let currentYear = now.getFullYear();
                                    // 获取今年的第一天
                                    let startOfYear = new Date(now.getFullYear(), 0, 1);
                                    // 计算今天是今年的第几天
                                    let diff = now.getTime() - startOfYear.getTime();
                                    let oneDay = 1000 * 60 * 60 * 24;
                                    let dayOfYear = Math.floor(diff / oneDay) + 1;
                                    // 计算今天是第几周
                                    let weekNumber = Math.ceil(dayOfYear / 7);

                                    var xhr = new XMLHttpRequest();
                                    const contentText = {
                                        content: respHtml,
                                        pull_request_ids: [],
                                        issue_ids: [],
                                        event_ids: []
                                    }
                                    xhr.open(
                                        "PUT",
                                        "https://api.gitee.com/enterprises/" + _this.roult_path + "/week_reports/" + JSON.parse(localStorage.getItem("gitee.user")).userInfo.username + "/" + currentYear + "/" + weekNumber,
                                        true
                                    );
                                    xhr.setRequestHeader('Content-Type', 'application/json');
                                    xhr.withCredentials = true;
                                    xhr.onload = function (e) {
                                        if (xhr.readyState === 4) {
                                            if (xhr.status === 200) {
                                                _this.pushLoading = false;
                                                _this.showTable = !_this.showTable;
                                                _this.$message({
                                                    type: "success",
                                                    message: "周报推送成功"
                                                });
                                            } else {
                                                _this.pushLoading = false;
                                                _this.$message({
                                                    type: "error",
                                                    message: "周报推送失败"
                                                });
                                            }
                                        }
                                    };
                                    xhr.onerror = function (e) {
                                    };
                                    xhr.send(JSON.stringify(contentText));
                                } else {
                                    _this.pushLoading = false;
                                }
                            } else {
                                _this.pushLoading = false;
                                console.error('GPT网络异常：', response.status);
                            }
                        },
                        onerror: function (err) {
                            _this.pushLoading = false;
                            console.error('发送错误，请重试', err);
                        }
                    });
                },
                // 发送周报
                pushHtml() {
                    const _this = this; // 保存正确的上下文
                    _this.pushGiteeLoading = true;
                    // 获取今天的日期
                    let now = new Date();
                    // 获取当前年份
                    let currentYear = now.getFullYear();
                    // 获取今年的第一天
                    let startOfYear = new Date(now.getFullYear(), 0, 1);
                    // 计算今天是今年的第几天
                    let diff = now.getTime() - startOfYear.getTime();
                    let oneDay = 1000 * 60 * 60 * 24;
                    let dayOfYear = Math.floor(diff / oneDay) + 1;
                    // 计算今天是第几周
                    let weekNumber = Math.ceil(dayOfYear / 7);

                    var xhr = new XMLHttpRequest();
                    const contentText = {
                        content: _this.textareaByAI,
                        pull_request_ids: [],
                        issue_ids: [],
                        event_ids: []
                    }
                    xhr.open(
                        "PUT",
                        "https://api.gitee.com/enterprises/" + _this.roult_path + "/week_reports/" + JSON.parse(localStorage.getItem("gitee.user")).userInfo.username + "/" + currentYear + "/" + weekNumber,
                        true
                    );
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.withCredentials = true;
                    xhr.onload = function (e) {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                _this.pushGiteeLoading = false;
                                _this.showTable = !_this.showTable;
                                _this.$message({
                                    type: "success",
                                    message: "周报推送成功"
                                });
                            } else {
                                _this.pushGiteeLoading = false;
                                _this.$message({
                                    type: "error",
                                    message: "周报推送失败"
                                });
                            }
                        }
                    };
                    xhr.onerror = function (e) {
                    };
                    xhr.send(JSON.stringify(contentText));
                },
                getWorkLog(id) {
                    const _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.getRoluteStr()
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path + "/issues/" + id + "/workloads/logs",
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    resolve({ data: respbody.data });
                                } else {
                                    reject("任务单工时获取异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("任务单工时获取异常");
                        };
                        xhr.send(null);
                    });
                },
                getPrograms() {
                    const _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.getRoluteStr()
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path + "/programs",
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    resolve({ data: respbody.data });
                                } else {
                                    reject("公司项目获取异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("公司项目获取异常");
                        };
                        xhr.send(null);
                    });
                },
                getIssuseTypeByProgram(programId) {
                    const _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.getRoluteStr()
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "GET",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path + "/issue_types/program_issue_types?program_id=" + programId,
                            true
                        );
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 200) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    resolve({ data: respbody.data });
                                } else {
                                    reject("公司项目获取异常");
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                            reject("公司项目获取异常");
                        };
                        xhr.send(null);
                    });
                },
                getIssuseLastWeekDataByUserAndPlanTime() {
                    // 获取当前日期
                    const today = new Date();

                    // 获取今天是周几，周日为0，周一为1，依次类推
                    const currentDayOfWeek = today.getDay();

                    // 计算上周周一和周日的日期
                    const lastWeekMonday = new Date(today);
                    lastWeekMonday.setDate(today.getDate() - currentDayOfWeek - 6);

                    const lastWeekSunday = new Date(today);
                    lastWeekSunday.setDate(today.getDate() - currentDayOfWeek);

                    // 格式化日期为指定格式
                    function formatDate(date) {
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        return `${year}.${month}.${day}`;
                    }

                    // 获取格式化后的日期范围
                    const lastWeekStart = formatDate(lastWeekMonday);
                    const lastWeekEnd = formatDate(lastWeekSunday);
                    const timeBetween = `${lastWeekStart}-${lastWeekEnd}`;
                    const userId = JSON.parse(localStorage.getItem("gitee.user")).userInfo.id;
                    // 当前用户信息
                    const _this = this;
                    var params = {
                        "filter_conditions": [
                            { "property": "issue_plan_date", "comparator": "between", "value": timeBetween }
                            , { "property": "issue_assignee", "comparator": "contains", "value": [userId] }
                        ],
                        "mode": "tree",
                        "result_version": "v2"
                    };
                    return new Promise(function (resolve, reject) {
                        _this.getRoluteStr()
                        var xhr = new XMLHttpRequest();
                        xhr.open(
                            "POST",
                            "https://api.gitee.com/enterprises/" +
                            _this.roult_path + "/issues/as_table",
                            true
                        );
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.withCredentials = true;
                        xhr.onload = function (e) {
                            if (xhr.readyState === 4) {
                                if (xhr.status === 201) {
                                    var respbody = JSON.parse(xhr.responseText);
                                    resolve({ data: respbody.issues });
                                }
                            }
                        };
                        xhr.onerror = function (e) {
                        };
                        xhr.send(JSON.stringify(params));
                    })
                },
                async addWeekReportTips(marquee) {
                    try {
                        const { element, ele } = await this.getWeekReportElement();
                        element.appendChild(marquee);
                        ele.style.display = "none";
                    } catch (error) {
                        console.error(error);
                    }
                },
            },
        };

        // 优化：等待Vue和ElementPlus完全加载后再初始化
        function initVueApp() {
            let retryCount = 0;
            const maxRetries = 30; // 最多重试30次，每次间隔200ms，总共6秒

            function tryInit() {
                retryCount++;

                // 检查必要的依赖
                if (typeof Vue === 'undefined') {
                    console.log(`GiteePlus: 等待Vue加载... (${retryCount}/${maxRetries})`);
                    if (retryCount < maxRetries) {
                        setTimeout(tryInit, 200);
                        return;
                    } else {
                        console.error('GiteePlus: Vue加载超时，应用无法启动');
                        return;
                    }
                }

                if (typeof ElementPlus === 'undefined') {
                    console.log(`GiteePlus: 等待ElementPlus加载... (${retryCount}/${maxRetries})`);
                    if (retryCount < maxRetries) {
                        setTimeout(tryInit, 200);
                        return;
                    } else {
                        console.error('GiteePlus: ElementPlus加载超时，应用无法启动');
                        return;
                    }
                }

                // 检查目标DOM元素是否存在
                const appElement = document.getElementById('app');
                if (!appElement) {
                    console.log(`GiteePlus: 等待DOM元素加载... (${retryCount}/${maxRetries})`);
                    if (retryCount < maxRetries) {
                        setTimeout(tryInit, 200);
                        return;
                    } else {
                        console.error('GiteePlus: 目标DOM元素未找到，应用无法启动');
                        return;
                    }
                }

                try {
                    console.log('GiteePlus: 开始初始化Vue应用...');
                    const app = Vue.createApp(App);
                    app.use(ElementPlus);

                    // 添加全局错误处理
                    app.config.errorHandler = (err, vm, info) => {
                        console.error('GiteePlus Vue应用错误:', err, info);
                    };

                    app.mount("#app");
                    console.log('GiteePlus: Vue应用初始化成功');
                } catch (error) {
                    console.error('GiteePlus: Vue应用初始化失败:', error);
                    if (retryCount < maxRetries) {
                        console.log('GiteePlus: 500ms后重试初始化...');
                        setTimeout(tryInit, 500);
                    } else {
                        console.error('GiteePlus: 达到最大重试次数，应用启动失败');
                    }
                }
            }

            tryInit();
        }

        initVueApp();
    }
})();