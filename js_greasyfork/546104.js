// ==UserScript==
// @name         ZM电力寻家计划
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  ZM电力寻家计划-工资发放自动化脚本
// @author       You
// @match        https://zmpt.cc/*
// @match        https://zmpt.club/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546104/ZM%E7%94%B5%E5%8A%9B%E5%AF%BB%E5%AE%B6%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/546104/ZM%E7%94%B5%E5%8A%9B%E5%AF%BB%E5%AE%B6%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

                      console.log('开始加载ZM电力寻家计划...');

    // 等待页面完全加载
    function waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    // 配置类
    class SalaryConfig {
        constructor() {
            this.groups = {
                                 ZmAudio: {
                     name: '有声书组',
                     teamId: '11',
                     categoryId: '424', // 有声书分类
                     baseSalary: 300000, // 达标工资 30w
                     targetCount: 20, // 达标种子数
                     extraRate: 15000, // 超额奖励单价 1.5w
                     inviteCount: 1,
                     needCategory: true // 需要分类筛选
                 },
                                 ZmWeb: {
                     name: 'WEB组',
                     teamId: '7',
                     categoryId: null,
                     baseSalary: 300000, // 30w
                     targetCount: 30, // 30
                     extraRate: 5000, // 超额奖励单价
                     inviteCount: 1,
                     needCategory: false
                 },
                                 ZmMusic: {
                     name: '音乐组',
                     teamId: '8',
                     categoryId: null,
                     baseSalary: 300000, // 30w
                     targetCount: 30, // 30
                     extraRate: 5000, // 超额奖励单价
                     inviteCount: 1,
                     needCategory: false
                 },
                                 ZmPT: {
                     name: '压制组',
                     teamId: '6',
                     categoryId: null,
                     baseSalary: 300000, // 30w
                     targetCount: 30, // 30
                     extraRate: 5000, // 超额奖励单价
                     inviteCount: 1,
                     needCategory: false
                 },
                                 Other: {
                     name: '转载组',
                     teamId: null,
                     categoryId: null,
                     baseSalary: 300000, // 30w
                     targetCount: 30, // 30
                     extraRate: 5000, // 超额奖励单价
                     inviteCount: 1,
                     needCategory: false
                 }
            };

            // 按组分别管理成员
            this.employeesByGroup = {
                ZmAudio: [],
                ZmWeb: [],
                ZmMusic: [],
                ZmPT: [],
                Other: []
            };

            // 移除电力值转换率，直接发放计算出的电力工资

            // 工资发放记录
            this.salaryRecords = {};
        }

        // 获取当前组的成员
        getCurrentEmployees(groupName) {
            return this.employeesByGroup[groupName] || [];
        }

        // 添加成员到指定组
        addEmployeeToGroup(groupName, employee) {
            if (!this.employeesByGroup[groupName]) {
                this.employeesByGroup[groupName] = [];
            }
            this.employeesByGroup[groupName].push(employee);
        }

        // 从指定组移除成员
        removeEmployeeFromGroup(groupName, uid) {
            if (this.employeesByGroup[groupName]) {
                this.employeesByGroup[groupName] = this.employeesByGroup[groupName].filter(emp => emp.uid !== uid);
            }
        }

        // 检查成员是否在指定组中存在
        isEmployeeInGroup(groupName, uid) {
            return this.employeesByGroup[groupName]?.some(emp => emp.uid === uid) || false;
        }
    }

    // 工资计算类
    class SalaryCalculator {
        constructor(config) {
            this.config = config;
        }

        // 计算工资
        calculateSalary(groupName, seedCount) {
            const group = this.config.groups[groupName];
            if (!group) return 0;

            let salary = 0;

            // 基础工资（达标工资）
            if (seedCount >= group.targetCount) {
                salary += group.baseSalary;
            }

            // 额外工资（超出部分）
            if (seedCount > group.targetCount) {
                const extraCount = seedCount - group.targetCount;
                salary += extraCount * group.extraRate;
            }

            return salary;
        }

        // 计算需要发放的电力值（直接发放，无需转换）
        calculatePowerPoints(salary) {
            return salary; // 直接返回工资值作为电力值
        }

        // 检查是否达标
        isTargetReached(groupName, seedCount) {
            const group = this.config.groups[groupName];
            return group ? seedCount >= group.targetCount : false;
        }
    }

    // 种子统计类
    class SeedCounter {
        constructor() {
            this.baseUrl = 'https://zmpt.cc';
        }

        // 获取页面内容
        async fetchPage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    anonymous: false,
                    responseType: 'text',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Referer': this.baseUrl + '/torrents.php'
                    },
                    timeout: 30000, // 30秒超时
                    onload: function(response) {
                        try {
                            console.log(`调试: 抓取完成 status=${response.status}, finalUrl=${response.finalUrl || '(unknown)'}, length=${response.responseText ? response.responseText.length : 0}`);
                        } catch (_) {}
                        if (response.status >= 200 && response.status < 300 && response.responseText) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error(error?.error || '网络错误'));
                    },
                    ontimeout: function() {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        // 解析种子数量
        parseSeedCount(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            console.log('开始解析种子数量...');

            // 首先检查页面是否显示"没有种子"的情况
            const noResultsText = doc.body.textContent;
            if (noResultsText.includes('没有种子') ||
                noResultsText.includes('No torrents') ||
                noResultsText.includes('未找到') ||
                noResultsText.includes('搜索结果为空')) {
                console.log('检测到页面显示没有种子，直接返回0');
                return 0;
            }

            // 检查是否有错误页面
            const errorElement = doc.querySelector('.error, .alert, .warning');
            if (errorElement) {
                console.warn('页面包含错误信息:', errorElement.textContent);
            }

            // 方法1：优先从分页信息中提取种子总数（最准确）
            const totalCount = this.extractTotalCountFromPagination(doc);
            if (totalCount > 0) {
                console.log(`从分页信息提取到种子总数: ${totalCount}`);
                return totalCount;
            }

            // 方法2：如果无法从分页获取，则使用原来的行解析方法
            console.log('无法从分页信息获取种子数，使用行解析方法...');
            return this.parseSeedCountFromRows(doc);
        }

        // 从分页信息中提取种子总数
        extractTotalCountFromPagination(doc) {
            try {
                // 首先检查页面是否显示"没有种子"的情况
                const noResultsText = doc.body.textContent;
                if (noResultsText.includes('没有种子') ||
                    noResultsText.includes('No torrents') ||
                    noResultsText.includes('未找到') ||
                    noResultsText.includes('搜索结果为空')) {
                    console.log('检测到页面显示没有种子，直接返回0');
                    return 0;
                }

                // 查找分页元素
                const paginationElements = doc.querySelectorAll('.nexus-pagination, .pagination, .pager, [class*="pagination"], [class*="pager"]');

                for (const pagination of paginationElements) {
                    const text = pagination.textContent;
                    console.log(`检查分页元素: "${text}"`);

                    // 查找类似 "201 - 269" 的模式
                    const matches = text.match(/(\d+)\s*-\s*(\d+)/g);
                    if (matches && matches.length > 0) {
                        let maxNumber = 0;

                        for (const match of matches) {
                            const numbers = match.match(/(\d+)\s*-\s*(\d+)/);
                            if (numbers) {
                                const endNumber = parseInt(numbers[2]);
                                if (endNumber > maxNumber) {
                                    maxNumber = endNumber;
                                }
                            }
                        }

                        if (maxNumber > 0) {
                            console.log(`从分页信息提取到最大种子数: ${maxNumber}`);
                            return maxNumber;
                        }
                    }
                }

                // 如果没有找到标准分页格式，尝试查找其他可能的分页信息
                const allText = doc.body.textContent;
                const pageMatches = allText.match(/第\s*(\d+)\s*页.*共\s*(\d+)\s*条/);
                if (pageMatches) {
                    const total = parseInt(pageMatches[2]);
                    console.log(`从页面文本提取到种子总数: ${total}`);
                    return total;
                }

                // 查找包含 "共 X 条" 的文本
                const totalMatches = allText.match(/共\s*(\d+)\s*条/);
                if (totalMatches) {
                    const total = parseInt(totalMatches[1]);
                    console.log(`从页面文本提取到种子总数: ${total}`);
                    return total;
                }

            } catch (error) {
                console.warn('从分页信息提取种子数时出错:', error);
            }

            return 0;
        }

        // 从表格行中解析种子数量（备用方法）
        parseSeedCountFromRows(doc) {
            // 首先检查页面是否显示"没有种子"的情况
            const noResultsText = doc.body.textContent;
            if (noResultsText.includes('没有种子') ||
                noResultsText.includes('No torrents') ||
                noResultsText.includes('未找到') ||
                noResultsText.includes('搜索结果为空')) {
                console.log('检测到页面显示没有种子，直接返回0');
                return 0;
            }

            // 尝试多种选择器来找到种子表格
            const selectors = [
                '.torrents tr',
                'table.torrents tr',
                'table tr',
                '.torrent-list tr',
                'tr'
            ];

            let rows = null;
            let selectorUsed = '';

            for (const selector of selectors) {
                rows = doc.querySelectorAll(selector);
                if (rows.length > 0) {
                    selectorUsed = selector;
                    console.log(`使用选择器 "${selector}" 找到 ${rows.length} 行`);
                    break;
                }
            }

            if (!rows || rows.length === 0) {
                console.warn('未找到任何表格行');
                return 0;
            }

            let count = 0;
            let skippedRows = 0;
            let validRows = 0;

            console.log(`开始分析 ${rows.length} 行数据...`);

            let totalSeeds = 0;
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rowIndex = i + 1;

                // 跳过表头行
                if (row.querySelector('th')) {
                    console.log(`行 ${rowIndex}: 跳过表头行`);
                    skippedRows++;
                    continue;
                }

                // 检查行是否包含足够的单元格
                const cells = row.querySelectorAll('td');
                if (cells.length < 3) {
                    console.log(`行 ${rowIndex}: 跳过无效行 (只有 ${cells.length} 个单元格)`);
                    skippedRows++;
                    continue;
                }

                // 检查是否是置顶种子（通过多种方式识别）
                const isSticky = this.isStickyRow(row);
                if (isSticky) {
                    console.log(`行 ${rowIndex}: 跳过置顶种子`);
                    skippedRows++;
                    continue;
                }

                // 检查是否包含种子链接
                const hasTorrentLink = row.querySelector('a[href*="details.php?id="]');
                if (!hasTorrentLink) {
                    console.log(`行 ${rowIndex}: 跳过非种子行 (无种子链接)`);
                    skippedRows++;
                    continue;
                }

                // 验证这是有效的种子行 - 增加更严格的验证
                if (this.isValidTorrentRow(row)) {
                    // 额外验证：检查种子名称是否合理
                    const torrentLink = row.querySelector('a[href*="details.php?id="]');
                    const torrentName = torrentLink.textContent.trim();

                    // 跳过明显无效的种子名称
                    if (torrentName.length < 3 ||
                        torrentName.includes('...') ||
                        torrentName.includes('点击查看') ||
                        torrentName.includes('查看详情')) {
                        console.log(`行 ${rowIndex}: 跳过无效种子名称: "${torrentName}"`);
                        skippedRows++;
                        continue;
                    }

                    count++;
                    validRows++;
                    console.log(`行 ${rowIndex}: 有效种子行 "${torrentName}" (总计: ${count})`);
                } else {
                    console.log(`行 ${rowIndex}: 跳过无效种子行`);
                    skippedRows++;
                }
            }

            console.log(`行解析完成: 总行数=${rows.length}, 有效种子=${count}, 跳过=${skippedRows}, 使用选择器="${selectorUsed}"`);

            return count;
        }

        // 检查是否是置顶行
        isStickyRow(row) {
            // 检查CSS类
            if (row.classList.contains('sticky') ||
                row.classList.contains('highlight') ||
                row.classList.contains('pinned') ||
                row.classList.contains('top')) {
                return true;
            }

            // 检查子元素
            if (row.querySelector('.sticky, .highlight, .pinned, .top')) {
                return true;
            }

            // 检查内联样式 - 修复TypeError: style.includes is not a function
            const inlineStyle = row.getAttribute('style') || '';
            if (inlineStyle.includes('background-color: yellow') ||
                inlineStyle.includes('background-color: #ffff00') ||
                inlineStyle.includes('background-color: #ffeb3b') ||
                inlineStyle.includes('background-color: #fff3cd')) {
                return true;
            }

            // 检查背景色
            const computedStyle = window.getComputedStyle ? window.getComputedStyle(row) : null;
            if (computedStyle) {
                const bgColor = computedStyle.backgroundColor;
                if (bgColor.includes('255, 255, 0') || // yellow
                    bgColor.includes('255, 235, 59') || // #ffeb3b
                    bgColor.includes('255, 243, 205')) { // #fff3cd
                    return true;
                }
            }

            return false;
        }

        // 验证是否是有效的种子行
        isValidTorrentRow(row) {
            // 必须包含种子链接
            const torrentLink = row.querySelector('a[href*="details.php?id="]');
            if (!torrentLink) {
                return false;
            }

            // 检查是否有种子名称
            const torrentName = torrentLink.textContent.trim();
            if (!torrentName || torrentName.length < 3) {
                return false;
            }

            // 跳过明显无效的种子名称
            if (torrentName.includes('...') ||
                torrentName.includes('点击查看') ||
                torrentName.includes('查看详情') ||
                torrentName.includes('更多') ||
                torrentName.includes('展开')) {
                return false;
            }

            // 检查是否有足够的单元格内容
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) {
                return false;
            }

            // 检查是否包含必要的种子信息（如大小、做种数等）
            let hasValidContent = false;
            let validCellCount = 0;

            for (let i = 0; i < cells.length; i++) {
                const cellContent = cells[i].textContent.trim();
                if (cellContent && cellContent.length > 0) {
                    validCellCount++;
                    // 检查是否包含种子相关的有效信息
                    if (cellContent.match(/[\d\.]+[KMG]B/) || // 文件大小
                        cellContent.match(/^\d+$/) || // 纯数字（做种数、下载数等）
                        cellContent.match(/^\d{4}-\d{2}-\d{2}/) || // 日期格式
                        cellContent.length > 5) { // 其他有意义的内容
                        hasValidContent = true;
                    }
                }
            }

            // 至少需要3个有效单元格
            return hasValidContent && validCellCount >= 3;
        }

        // 解析有声书集数
        parseEpisodeCount(torrentName) {
            try {
                console.log(`尝试解析种子名称: "${torrentName}"`);

                // 匹配完结格式：全X集
                const finishedMatch = torrentName.match(/全(\d+)集/);
                if (finishedMatch) {
                    const count = parseInt(finishedMatch[1]);
                    console.log(`匹配到完结格式: 全${count}集 = ${count}集`);
                    return count;
                }

                // 匹配连载格式：第XXXX-XXXX集
                const ongoingMatch = torrentName.match(/第(\d+)-(\d+)集/);
                if (ongoingMatch) {
                    const start = parseInt(ongoingMatch[1]);
                    const end = parseInt(ongoingMatch[2]);
                    const count = end - start + 1; // 加1是因为包含起始集
                    console.log(`匹配到连载格式: 第${start}-${end}集 = ${count}集`);
                    return count;
                }

                // 匹配其他可能的格式：X集、共X集、总计X集等
                const otherMatches = [
                    /(\d+)集/,           // 直接数字+集
                    /共(\d+)集/,         // 共X集
                    /总计(\d+)集/,       // 总计X集
                    /全(\d+)话/,         // 全X话（动漫用语）
                    /(\d+)话/,           // X话
                    /第(\d+)话/,         // 第X话
                    /(\d+)章节/,         // X章节
                    /第(\d+)章/,         // 第X章
                    /(\d+)回/,           // X回
                    /第(\d+)回/          // 第X回
                ];

                for (const pattern of otherMatches) {
                    const match = torrentName.match(pattern);
                    if (match) {
                        const count = parseInt(match[1]);
                        console.log(`匹配到其他格式 "${pattern.source}": ${count}集`);
                        return count;
                    }
                }

                // 如果都没有匹配到，记录调试信息
                console.log(`未匹配到任何集数格式，种子名称: "${torrentName}"`);
                return 0; // 无法解析集数

            } catch (error) {
                console.warn('解析有声书集数时出错:', error);
                return 0;
            }
        }

        // 获取指定用户在指定时间内的种子数量
        async getSeedCount(username, groupName, startDate, endDate) {
            const group = window.salaryConfig.groups[groupName];
            if (!group) {
                console.error(`未找到工作组配置: ${groupName}`);
                return 0;
            }

            console.log(`开始获取用户 ${username} 在 ${groupName} 组的种子数量...`);
            console.log(`时间范围: ${startDate} 至 ${endDate}`);
            console.log(`工作组配置:`, group);

            // 首先获取第1页来确定总数
            let url = `${this.baseUrl}/torrents.php?`;
            const params = new URLSearchParams();

            // 基本参数（0=包括断种，1=活种，2=断种）为避免漏数，默认包括断种
            params.append('incldead', '0');
            params.append('spstate', '0');
            params.append('inclbookmarked', '0');
            params.append('search', username);
            params.append('search_area', '3'); // 发布者
            params.append('search_mode', '0');
            params.append('added_begin', startDate);
            params.append('added_end', endDate);
            // 注意：该站首页页码为0，分页提示"1 - N"对应 page=0
            params.append('page', '0');

            // 制作组筛选
            if (group.teamId) {
                params.append(`team${group.teamId}`, '1');
                console.log(`添加制作组筛选: team${group.teamId}=1`);
            }

            // 分类筛选（仅有声书组需要）
            if (group.needCategory && group.categoryId) {
                params.append(`cat${group.categoryId}`, '1');
                console.log(`添加分类筛选: cat${group.categoryId}=1`);
            }

            url += params.toString();
            // 防御性校验：强制首页页码为0
            if (/([?&])page=1(?!\d)/.test(url)) {
                console.warn('检测到page=1，强制更正为page=0');
                url = url.replace(/([?&])page=1(?!\d)/, '$1page=0');
            }
            console.log(`获取第1页URL: ${url}`);

            let retryCount = 0;
            const maxRetries = 3;

            // 重试机制
            while (retryCount < maxRetries) {
                try {
                    console.log(`正在获取第1页 (第 ${retryCount + 1} 次尝试)...`);
                    const response = await this.fetchPage(url);

                    // 对于有声书组，需要获取详细的种子信息来计算达标种子数
                    if (groupName === 'ZmAudio') {
                        const detailed = await this.getDetailedSeedCountForAudio(response, username);
                        const qualified = (detailed && typeof detailed === 'object') ? detailed.qualified : (detailed || 0);
                        const total = (detailed && typeof detailed === 'object') ? detailed.total : qualified;
                        console.log(`用户 ${username} 在 ${groupName} 组的达标种子数量获取完成: ${qualified} (实际:${total})`);
                        // 返回"合格数"，总数由UI记录显示
                        return { qualified, total };
                    } else {
                        // 其他组使用原来的方法
                        const totalCount = this.parseSeedCount(response);
                        console.log(`第1页解析完成，种子总数: ${totalCount}`);
                        console.log(`用户 ${username} 在 ${groupName} 组的种子数量获取完成: ${totalCount}`);
                        return totalCount;
                    }

                } catch (error) {
                    retryCount++;
                    console.warn(`获取第1页失败 (第${retryCount}次重试):`, error.message);

                    if (retryCount >= maxRetries) {
                        console.error(`获取第1页最终失败，已重试${maxRetries}次:`, error);
                        return 0;
                    }

                    // 等待更长时间再重试
                    const delay = 1000 * retryCount;
                    console.log(`等待 ${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            return 0;
        }

        // 获取有声书种子详细信息
        getDetailedSeedCountForAudio(html, userName) {
            console.log('开始解析有声书种子详细信息...');

            // 始终以搜索结果HTML为准进行解析，避免与当前页面状态耦合
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 调试：打印完整原始HTML与解析后HTML（分片输出）
            try {
                const logLongText = (label, text) => {
                    const size = (text && typeof text === 'string') ? text.length : 0;
                    console.log(`${label} 总长度=${size}`);
                    if (!size) return;
                    const chunk = 4000;
                    for (let i = 0; i < size; i += chunk) {
                        const part = text.slice(i, i + chunk);
                        console.log(`${label} [${i}-${Math.min(i + chunk - 1, size - 1)}]:\n` + part);
                    }
                };
                logLongText('原始HTML', html || '');
                const parsedHTML = (doc && doc.documentElement && doc.documentElement.outerHTML) ? doc.documentElement.outerHTML : '';
                logLongText('解析后HTML', parsedHTML);
            } catch (_) {}

            // 诊断：先统计一下详情链接数量，判断结果页是否包含种子
            try {
                const linkCount = (doc && doc.querySelectorAll) ? doc.querySelectorAll('a[href*="details.php?id="]').length : 0;
                console.log(`诊断：搜索结果页中含 details.php?id= 链接数量: ${linkCount}`);
            } catch (_) {}

            const rows = this.getTorrentRows(doc, html);
            if (rows.length === 0) {
                console.log('未找到有效的种子行');
                return 0;
            }

            console.log(`开始分析 ${rows.length} 个种子...`);

            let lowEpisodeSeeds = 0; // 150集及以下的种子计数
            let qualifiedSeeds = 0;
            let detailedStats = [];
            let totalSeeds = 0; // 修复：严格模式下需声明

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rowIndex = i + 1;

                // 获取种子名称 - 优先从种子链接的title属性获取
                let torrentName = '';

                // 方法1：从种子链接的title属性获取（通常包含完整信息）
                const torrentLink = row.querySelector('a[href*="details.php?id="]');
                if (torrentLink && torrentLink.title) {
                    torrentName = torrentLink.title.trim();
                    console.log(`行 ${rowIndex}: 方法1从种子链接title获取到种子名称: "${torrentName}"`);
                }

                // 方法2：如果方法1没有获取到，尝试从td.embedded元素获取
                if (!torrentName || torrentName.length < 5) {
                    const embeddedCell = row.querySelector('td.embedded');
                    if (embeddedCell) {
                        const embeddedText = embeddedCell.textContent.trim();
                        // 验证embedded文本是否包含种子相关信息
                        if (embeddedText.length > 10 &&
                            !embeddedText.includes('首页') &&
                            !embeddedText.includes('论坛') &&
                            !embeddedText.includes('官种') &&
                            !embeddedText.includes('综合') &&
                            !embeddedText.includes('求种') &&
                            !embeddedText.includes('发布') &&
                            !embeddedText.includes('候选') &&
                            !embeddedText.includes('训练家') &&
                            !embeddedText.includes('手册') &&
                            !embeddedText.includes('联系管理') &&
                            !embeddedText.includes('管理') &&
                            !embeddedText.includes('电视剧') &&
                            !embeddedText.includes('动漫') &&
                            !embeddedText.includes('综艺') &&
                            !embeddedText.includes('电影') &&
                            !embeddedText.includes('音乐') &&
                            !embeddedText.includes('纪录片') &&
                            !embeddedText.includes('有声书') &&
                            !embeddedText.includes('全部资源') &&
                            !embeddedText.includes('游戏') &&
                            !embeddedText.includes('软件') &&
                            !embeddedText.includes('其他') &&
                            !embeddedText.includes('常见问题') &&
                            !embeddedText.includes('排行榜') &&
                            !embeddedText.includes('日志') &&
                            !embeddedText.includes('发种排行') &&
                            !embeddedText.includes('官组任务') &&
                            !embeddedText.includes('信息统计')) {
                            torrentName = embeddedText;
                            console.log(`行 ${rowIndex}: 方法2从td.embedded获取到种子信息: "${torrentName}"`);
                        }
                    }
                }

                // 方法3：如果仍然没有获取到，尝试从种子链接的textContent获取
                if (!torrentName || torrentName.length < 5) {
                    if (torrentLink) {
                        const linkText = torrentLink.textContent.trim();
                        // 验证链接文本是否合理
                        if (linkText.length > 5 &&
                            !linkText.includes('首页') &&
                            !linkText.includes('论坛') &&
                            !linkText.includes('官种') &&
                            !linkText.includes('综合') &&
                            !linkText.includes('求种') &&
                            !linkText.includes('发布') &&
                            !linkText.includes('候选') &&
                            !linkText.includes('训练家') &&
                            !linkText.includes('手册') &&
                            !linkText.includes('联系管理') &&
                            !linkText.includes('管理') &&
                            !linkText.includes('电视剧') &&
                            !linkText.includes('动漫') &&
                            !linkText.includes('综艺') &&
                            !linkText.includes('电影') &&
                            !linkText.includes('音乐') &&
                            !linkText.includes('纪录片') &&
                            !linkText.includes('有声书') &&
                            !linkText.includes('全部资源') &&
                            !linkText.includes('游戏') &&
                            !linkText.includes('软件') &&
                            !linkText.includes('其他') &&
                            !linkText.includes('常见问题') &&
                            !linkText.includes('排行榜') &&
                            !linkText.includes('日志') &&
                            !linkText.includes('发种排行') &&
                            !linkText.includes('官组任务') &&
                            !linkText.includes('信息统计')) {
                            torrentName = linkText;
                            console.log(`行 ${rowIndex}: 方法3从种子链接textContent获取到种子名称: "${torrentName}"`);
                        }
                    }
                }

                // 如果仍然无法获取有效名称，记录调试信息并跳过
                if (!torrentName || torrentName.length < 3) {
                    console.log(`行 ${rowIndex}: 无法获取有效种子名称，跳过此行`);
                    console.log(`  行HTML:`, row.outerHTML);
                    continue;
                }

                // 优先从副标题（包含"全X集/第X-Y集"）中提取集数
                let episodeCount = 0;
                try {
                    const subtitleCell = row.querySelector('td.rowfollow table.torrentname td.embedded')
                        || row.querySelector('table.torrentname td.embedded')
                        || row.querySelector('td.embedded, td.small, span.small, span.sub, div.small, div.sub');
                    if (subtitleCell) {
                        const subtitleText = subtitleCell.innerText || subtitleCell.textContent || '';
                        // 从副标题整段文本中抓取包含集数的片段（优先行尾/换行后的描述）
                        const episodeFragmentMatch = subtitleText.match(/(全\d+集|第\d+-\d+集|\d+集)[^\n]*/);
                        if (episodeFragmentMatch) {
                            const fragment = episodeFragmentMatch[0];
                            const parsed = this.parseEpisodeCount(fragment);
                            if (parsed > 0) {
                                episodeCount = parsed;
                                console.log(`行 ${rowIndex}: 从副标题提取到集数片段: "${fragment}" => ${episodeCount}集`);
                            }
                        }
                    }
                } catch (e) {
                    // 忽略副标题解析错误，回退到标题解析
                }

                // 如副标题未解析到，再回退用标题解析
                if (episodeCount === 0) {
                    episodeCount = this.parseEpisodeCount(torrentName);
                }

                if (episodeCount > 0) {
                    console.log(`行 ${rowIndex}: "${torrentName}" - ${episodeCount}集`);
                    totalSeeds++;
                    if (episodeCount <= 150) {
                        // 150集及以下，3个种子算1个达标种子
                        lowEpisodeSeeds++;
                        detailedStats.push(`${torrentName} - ${episodeCount}集 - 待组合 (${lowEpisodeSeeds}/3)`);
                    } else {
                        // 150集以上，1个种子算1个达标种子
                        qualifiedSeeds++;
                        detailedStats.push(`${torrentName} - ${episodeCount}集 - 计1个达标种子`);
                    }
                } else {
                    console.log(`行 ${rowIndex}: "${torrentName}" - 无法解析集数，按1个种子计算`);
                    qualifiedSeeds++;
                    totalSeeds++;
                    detailedStats.push(`${torrentName} - 0集 (无法解析集数) - 计1个达标种子`);
                }
            }

            // 处理150集及以下的种子：仅满3个计1，其余不计
            if (lowEpisodeSeeds > 0) {
                const completeGroups = Math.floor(lowEpisodeSeeds / 3);
                const remainingSeeds = lowEpisodeSeeds % 3;

                if (completeGroups > 0) {
                    qualifiedSeeds += completeGroups;
                    detailedStats.push(`${completeGroups}组150集及以下种子 (每组3个) - 计${completeGroups}个达标种子`);
                }

                if (remainingSeeds > 0) {
                    console.log(`剩余 ${remainingSeeds} 个150集及以下的种子，未满3个不计达标`);
                    detailedStats.push(`剩余 ${remainingSeeds} 个150集及以下种子 - 未满3个不计达标`);
                }
            }

            console.log('有声书种子统计:');
            console.log(`总种子数: ${rows.length}`);
            console.log(`达标种子数: ${qualifiedSeeds.toFixed(2)} (实际:${totalSeeds})`);
            console.log('详细统计:');
            detailedStats.forEach((stat, index) => {
                console.log(`${index + 1}. ${stat}`);
            });

            // 返回对象供上层记录：{qualified, total}
            return { qualified: qualifiedSeeds, total: totalSeeds };
        }

        // 获取种子行（辅助方法）
        getTorrentRows(doc, rawHtml) {
            // 1) 优先从明确的种子表格查找
            let torrentTable = doc.querySelector('table.torrents');
            if (!torrentTable) {
                // 尝试更宽松的表格选择器
                torrentTable = doc.querySelector('table#torrents, table[class*="torrents"], table[class*="Torrents"]');
            }

            if (torrentTable) {
                console.log('找到种子表格 (table.torrents / 兼容选择器)');

                const allRows = torrentTable.querySelectorAll('tr');
                console.log(`种子表格中共有 ${allRows.length} 行`);

                const validRows = Array.from(allRows).filter(row => {
                    // 只保留主表的直接数据行，排除内嵌行
                    const nearestTable = row.closest('table');
                    if (nearestTable !== torrentTable) return false;
                    if (row.querySelector('th')) return false; // 表头
                        const torrentLink = row.querySelector('a[href*="details.php?id="]');
                    if (!torrentLink) return false;
                    return true;
                });

                console.log(`过滤后找到 ${validRows.length} 个有效种子行`);
                if (validRows.length > 0) return validRows;
            }

            // 未直接命中标准表格：从详情链接回溯到"真实种子行"
            try {
                const detailLinks = Array.from(doc.querySelectorAll('a[href*="details.php?id="]'));
                console.log(`候选分支：找到详情链接 ${detailLinks.length} 个`);

                // 收集链接最近的 tr，并校验其最近的 table 是否"像种子表"
                const rowSet = new Set();
                for (const a of detailLinks) {
                    // 先定位到名称小表，再回溯到主表的外层行
                    const nameTable = a.closest('table.torrentname');
                    const tr = nameTable ? nameTable.closest('tr') : a.closest('tr');
                    if (!tr) continue;
                    const table = tr.closest('table');
                    if (!table) continue;

                    // 表格判定：类名含 torrents，或表头含关键列名
                    const className = (table.getAttribute('class') || '').toLowerCase();
                    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()).join(' ');
                    const looksLikeTorrentTable = className.includes('torrents') || /标题|大小|做种|下载|完成|发布者/.test(headers);
                    if (!looksLikeTorrentTable) continue;

                    // 行判定：不是表头、且该链接的最近 tr 就是当前 tr（避免外层布局行）
                    if (tr.querySelector('th')) continue;

                    rowSet.add(tr);
                }

                const collected = Array.from(rowSet);
                console.log(`候选分支：收集到可能的种子行 ${collected.length} 个`);
                if (collected.length > 0) return collected;
            } catch (e) {
                console.log('候选分支异常:', e && e.message);
            }

            // 未找到，输出HTML片段以便排查
            try {
                const htmlPreview = (doc.documentElement && doc.documentElement.outerHTML) ? doc.documentElement.outerHTML.slice(0, 2000) : '';
                console.log('调试：未识别到种子表格，HTML预览前2KB:\n' + htmlPreview);
            } catch (_) {}

            // 基于原始HTML的正则兜底：截取 torrents 表并单独解析
            try {
                if (typeof rawHtml === 'string' && rawHtml.includes('class="torrents"')) {
                    console.log('正则兜底：在原始HTML中发现 class="torrents" 标记，尝试截取解析');
                    const startIdx = rawHtml.indexOf('<table');
                    let cut = rawHtml.slice(startIdx);
                    // 仅保留到第一个 </table> 结束，避免噪声
                    const endIdx = cut.indexOf('</table>');
                    if (endIdx > 0) cut = cut.slice(0, endIdx + 8);

                    const parser2 = new DOMParser();
                    const doc2 = parser2.parseFromString(cut, 'text/html');
                    const rows2 = Array.from(doc2.querySelectorAll('tr'))
                        .filter(tr => !tr.querySelector('th') && tr.querySelector('a[href*="details.php?id="]'));
                    console.log(`正则兜底：截取表格后找到含详情链接的行 ${rows2.length} 个`);
                    if (rows2.length > 0) return rows2;
                } else {
                    console.log('正则兜底：原始HTML中未发现 class="torrents"');
                }
            } catch (e) {
                console.log('正则兜底异常:', e && e.message);
            }

            // 最终兜底A：从所有名称小表回溯到主表行
            try {
                const nameLinks = Array.from(doc.querySelectorAll('table.torrentname a[href*="details.php?id="]'));
                console.log(`最终兜底：名称小表中找到详情链接 ${nameLinks.length} 个`);
                const rowSet = new Set();
                for (const a of nameLinks) {
                    const mainRow = a.closest('table.torrentname')?.closest('td')?.closest('tr');
                    if (mainRow && !mainRow.querySelector('th')) rowSet.add(mainRow);
                }
                const collected = Array.from(rowSet);
                console.log(`最终兜底：回溯得到主表行 ${collected.length} 个`);
                if (collected.length > 0) return collected;
            } catch (_) {}

            // 最终兜底B：寻找包含名称小表的外层表格，再批量收集含名称小表的行
            try {
                const tables = Array.from(doc.querySelectorAll('table'))
                    .filter(tbl => tbl.querySelector('table.torrentname a[href*="details.php?id="]'));
                console.log(`最终兜底：包含名称小表的外层表格数量 ${tables.length}`);
                for (const tbl of tables) {
                    const rows = Array.from(tbl.querySelectorAll('tr'))
                        .filter(tr => !tr.querySelector('th') && tr.querySelector('table.torrentname a[href*="details.php?id="]'));
                    console.log(`最终兜底：在某外层表格内找到含名称小表的行 ${rows.length} 个`);
                    if (rows.length > 0) return rows;
                }
            } catch (_) {}

            console.log('未找到种子表格');
            return [];
        }
    }

    // 电力值赠送类
    class PowerGifter {
        constructor() {
            this.baseUrl = 'https://zmpt.cc';
            // 管理员cookie配置 - 从本地存储加载或使用默认值
            this.adminCookieString = GM_getValue('adminCookie', '');
        }

        // 使用系统权限直接发放电力
        async grantPower(userId, amount, message = '工资发放') {
            try {
                console.log(`尝试为用户ID ${userId} 发放 ${amount} 电力值`);
                
                // 直接使用用户ID，不需要再获取
                console.log(`用户ID: ${userId}`);
                
                // 获取用户当前信息
                const userInfo = await this.getUserInfo(userId);
                if (!userInfo) {
                    throw new Error(`无法获取用户ID ${userId} 的详细信息`);
                }
                
                console.log(`用户当前电力值: ${userInfo.seedbonus}`);
                
                // 使用系统权限发放电力
                const response = await this.grantUserResource(userId, 'seedbonus', 'Increment', amount, message, userInfo);
                return response;
                
            } catch (error) {
                console.error('发放电力失败:', error);
                throw error;
            }
        }

        // 使用系统权限发放临时邀请（单次发放指定数量）
        async grantTmpInvites(userId, count = 1, days = 30, message = '发种达标奖励') {
            try {
                console.log(`尝试为用户ID ${userId} 发放 ${count} 个临时邀请（有效期 ${days} 天）`);
                
                // 直接使用用户ID，不需要再获取
                console.log(`用户ID: ${userId}`);
                
                // 获取用户当前信息
                const userInfo = await this.getUserInfo(userId);
                if (!userInfo) {
                    throw new Error(`无法获取用户ID ${userId} 的详细信息`);
                }
                
                console.log(`用户当前临时邀请数: ${userInfo.tmp_invites}`);
                
                // 使用系统权限发放临时邀请
                const response = await this.grantUserResource(userId, 'tmp_invites', 'Increment', count, message, userInfo, days);
                return response;
                
            } catch (error) {
                console.error('发放临时邀请失败:', error);
                throw error;
            }
        }

        

        // 使用系统权限发放用户资源
        async grantUserResource(userId, resourceType, action, amount, reason, userInfo, days = null) {
            console.log(`正在为用户 ${userId} 发放资源: ${resourceType} = ${amount}`);
            console.log('用户信息:', userInfo);

            try {
                // 访问用户管理页，校验权限并解析 Livewire initial-data
                const adminPageHtml = await this.getAdminRequest(`/nexusphp/users/${userId}`);
                if (adminPageHtml.includes('权限不足') || adminPageHtml.includes('Access denied')) {
                    throw new Error('管理员权限不足，请检查cookie配置');
                }

                const initial = this.extractLivewireInitialData(adminPageHtml);
                if (!initial) {
                    throw new Error('解析Livewire初始数据失败');
                }

                // 更新运行时 CSRF 与 Referer，避免 419/500
                this._runtimeCsrfToken = this.extractMetaCsrfToken(adminPageHtml) || this.getCSRFToken();
                this._runtimeReferer = `https://zmpt.cc/nexusphp/users/${userId}`;

                // 规范化参数
                const mountedAction = '修改上传量等';
                const field = resourceType; // 'seedbonus' 或 'tmp_invites'
                const livewireAction = action; // 'Increment' | 'Decrement'
                const value = String(amount);
                const duration = days == null ? '' : String(days);
                const reasonText = reason || '';

                // 依据抓包：发送一组 updates（syncInput * 4 + callMethod: callMountedAction）
                const body = {
                    fingerprint: {
                        id: initial.fingerprint.id,
                        name: initial.fingerprint.name,
                        locale: initial.fingerprint.locale || 'zh_CN',
                        path: initial.fingerprint.path,
                        method: initial.fingerprint.method || 'GET',
                        v: initial.fingerprint.v
                    },
                    serverMemo: {
                        children: [],
                        errors: [],
                        htmlHash: initial.serverMemo.htmlHash,
                        // 不改写原 data，避免服务端校验失败
                        data: initial.serverMemo.data,
                        dataMeta: initial.serverMemo.dataMeta || {},
                        checksum: initial.serverMemo.checksum
                    },
                    updates: [
                        // 先挂载动作名
                        { type: 'syncInput', payload: { id: 'mounted', name: 'mountedAction', value: mountedAction } },
                        // 再设置各字段
                        { type: 'syncInput', payload: { id: 'reason', name: 'mountedActionData.reason', value: reasonText } },
                        { type: 'syncInput', payload: { id: 'duration', name: 'mountedActionData.duration', value: duration } },
                        { type: 'syncInput', payload: { id: 'value', name: 'mountedActionData.value', value: value } },
                        { type: 'syncInput', payload: { id: 'action', name: 'mountedActionData.action', value: livewireAction } },
                        { type: 'syncInput', payload: { id: 'field', name: 'mountedActionData.field', value: field } },
                        // 最后触发
                        { type: 'callMethod', payload: { id: 'call', method: 'callMountedAction', params: [] } }
                    ]
                };

                // 记录调试
                console.log('Livewire 请求 fingerprint:', body.fingerprint);
                console.log('Livewire updates 概要:', body.updates.map(u => u.payload?.name || u.payload?.method));

                const respText = await this.postJson('/livewire/message/app.filament.resources.user.user-resource.pages.user-profile', body);

                // 简单成功判断：返回200且不含错误关键字
                if (respText && !/error|exception|HTTP 500/i.test(respText)) {
                    console.log(`为用户 ${userId} 发放 ${amount} ${resourceType} 成功`);
                    return {
                        success: true,
                        message: `已为用户 ${userInfo.username} 发放 ${amount} ${resourceType}`
                    };
                }

                throw new Error('Livewire响应异常');
            } catch (error) {
                console.error('发放用户资源失败:', error);
                throw error;
            }
        }

        // 获取用户详细信息（使用管理员权限）
        async getUserInfo(userId) {
            try {
                console.log(`正在获取用户 ${userId} 的详细信息...`);
                const response = await this.getAdminRequest(`/nexusphp/users/${userId}`);
                
                // 从URL中获取用户名，因为管理员页面显示的是管理员信息
                const username = await this.getUsernameFromUrl(userId);
                
                // 解析用户信息
                const userInfo = this.parseUserInfo(response, userId, username);
                console.log('用户信息解析结果:', userInfo);
                return userInfo;
            } catch (error) {
                console.error('获取用户信息失败:', error);
                return null;
            }
        }
        
        // 从用户ID获取用户名（通过userdetails.php）
        async getUsernameFromUrl(userId) {
            try {
                const response = await this.getRequest(`/userdetails.php?id=${userId}`);
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, 'text/html');
                
                // 尝试从页面标题中提取用户名
                const title = doc.querySelector('title');
                if (title) {
                    const titleText = title.textContent;
                    const match = titleText.match(/([a-zA-Z0-9_]+)/);
                    if (match) {
                        return match[1];
                    }
                }
                
                // 如果没找到，返回默认值
                return 'unknown';
            } catch (error) {
                console.error('获取用户名失败:', error);
                return 'unknown';
            }
        }

        // 解析用户信息
        parseUserInfo(html, userId, providedUsername = null) {
            try {
                console.log('开始解析用户信息，HTML长度:', html.length);
                
                // 调试：输出HTML的关键部分
                console.log('HTML前1000字符:', html.substring(0, 1000));
                
                // 查找包含"jzbqy"的部分
                const usernameIndex = html.indexOf('jzbqy');
                if (usernameIndex !== -1) {
                    console.log('找到用户名jzbqy，上下文:', html.substring(Math.max(0, usernameIndex - 100), usernameIndex + 100));
                }
                
                // 查找包含"电力"的部分
                const powerIndex = html.indexOf('电力');
                if (powerIndex !== -1) {
                    console.log('找到电力，上下文:', html.substring(Math.max(0, powerIndex - 100), powerIndex + 100));
                }
                
                // 创建临时DOM来解析HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // 提取用户名 - 优先使用提供的用户名
                let username = providedUsername || 'unknown';
                
                // 如果没有提供用户名，才进行解析
                if (username === 'unknown') {
                    // 首先尝试从HTML中搜索用户名相关的数据
                    const usernamePatterns = [
                        /"username":\s*"([^"]+)"/i,
                        /'username':\s*'([^']+)'/i,
                        /username["\s]*[:=]["\s]*["']([^"']+)["']/i,
                        /<input[^>]*name="username"[^>]*value="([^"]+)"/i,
                        /<input[^>]*value="([^"]+)"[^>]*name="username"/i,
                        /<span[^>]*class="[^"]*username[^"]*"[^>]*>([^<]+)<\/span>/i,
                        /<div[^>]*class="[^"]*username[^"]*"[^>]*>([^<]+)<\/div>/i
                    ];
                    
                    for (const pattern of usernamePatterns) {
                        const match = html.match(pattern);
                        if (match && match[1] && match[1].length > 1 && match[1] !== 'User 详情') {
                            username = match[1];
                            break;
                        }
                    }
                    
                    // 如果还是没找到，尝试从表格中查找用户名
                    if (username === 'unknown') {
                        const allTds = doc.querySelectorAll('td, th');
                        for (const td of allTds) {
                            const text = td.textContent.trim();
                            // 查找包含"用户名"标签的单元格，然后获取相邻单元格的值
                            if (text.includes('用户名') || text.includes('Username')) {
                                const nextTd = td.nextElementSibling;
                                if (nextTd && nextTd.textContent.trim().length > 0) {
                                    username = nextTd.textContent.trim();
                                    break;
                                }
                            }
                        }
                    }
                    
                    // 如果还是没找到，尝试从页面中查找看起来像用户名的文本
                    if (username === 'unknown') {
                        const allElements = doc.querySelectorAll('*');
                        for (const element of allElements) {
                            const text = element.textContent.trim();
                            // 查找只包含字母数字下划线的短文本，可能是用户名
                            if (text && /^[a-zA-Z0-9_]{3,20}$/.test(text) && text !== 'User' && text !== '详情') {
                                username = text;
                                break;
                            }
                        }
                    }
                    
                    // 如果还是没找到，尝试从已知的用户名中查找
                    if (username === 'unknown') {
                        // 从HTML中查找所有可能的用户名模式
                        const usernameMatches = html.match(/\b[a-zA-Z0-9_]{3,20}\b/g);
                        if (usernameMatches) {
                            // 过滤掉常见的非用户名词汇
                            const filteredUsernames = usernameMatches.filter(name => 
                                !['User', '详情', 'NexusPHP', 'Points', 'gift', 'after', 'tax', 'from', 'to'].includes(name)
                            );
                            if (filteredUsernames.length > 0) {
                                username = filteredUsernames[0];
                            }
                        }
                    }
                }
                
                console.log('解析到的用户名:', username);
                
                // 提取电力值 - 尝试多种方式
                let seedbonus = "0.0";
                const bonusSelectors = [
                    '[data-seedbonus]', '.seedbonus', '.bonus'
                ];
                
                for (const selector of bonusSelectors) {
                    const element = doc.querySelector(selector);
                    if (element) {
                        const text = element.textContent || element.getAttribute('data-seedbonus');
                        const match = text.match(/(\d+\.?\d*)/);
                        if (match) {
                            seedbonus = match[1];
                            break;
                        }
                    }
                }
                
                // 如果标准选择器没找到，尝试搜索包含"电力"的表格单元格
                if (seedbonus === "0.0") {
                    const allTds = doc.querySelectorAll('td, th');
                    for (const td of allTds) {
                        const text = td.textContent;
                        if (text && (text.includes('电力') || text.includes('seedbonus'))) {
                            const match = text.match(/(\d+\.?\d*)/);
                            if (match) {
                                seedbonus = match[1];
                                break;
                            }
                        }
                    }
                }
                
                // 如果还是没找到，尝试从HTML中搜索
                if (seedbonus === "0.0") {
                    const bonusPatterns = [
                        /seedbonus["\s]*[:=]["\s]*([0-9.]+)/i,
                        /"seedbonus":\s*"([0-9.]+)"/i,
                        /'seedbonus':\s*'([0-9.]+)'/i,
                        /电力["\s]*[:：]["\s]*([0-9.]+)/i,
                        /Points["\s]*[:：]["\s]*([0-9.]+)/i
                    ];
                    
                    for (const pattern of bonusPatterns) {
                        const match = html.match(pattern);
                        if (match && match[1]) {
                            seedbonus = match[1];
                            break;
                        }
                    }
                }
                
                // 如果还是没找到，尝试从表格中查找数值
                if (seedbonus === "0.0") {
                    const allTds = doc.querySelectorAll('td, th');
                    for (const td of allTds) {
                        const text = td.textContent.trim();
                        // 查找包含数字的单元格，可能是电力值
                        const numberMatch = text.match(/(\d+\.?\d*)/);
                        if (numberMatch && parseFloat(numberMatch[1]) > 0) {
                            // 检查相邻单元格是否包含电力相关词汇
                            const prevTd = td.previousElementSibling;
                            const nextTd = td.nextElementSibling;
                            const context = (prevTd ? prevTd.textContent : '') + ' ' + text + ' ' + (nextTd ? nextTd.textContent : '');
                            
                            if (context.includes('电力') || context.includes('Points') || context.includes('seedbonus')) {
                                seedbonus = numberMatch[1];
                                break;
                            }
                        }
                    }
                }
                
                console.log('解析到的电力值:', seedbonus);
                
                // 简化其他字段的提取，使用默认值
                const userInfo = {
                    "id": parseInt(userId),
                    "username": username,
                    "seedbonus": seedbonus,
                    "uploaded": "0",
                    "downloaded": "0", 
                    "invites": "0",
                    "tmp_invites": "0"
                };
                
                console.log('最终用户信息:', userInfo);
                return userInfo;
                
            } catch (error) {
                console.error('解析用户信息失败:', error);
                // 返回默认值
                return {
                    "id": parseInt(userId),
                    "username": "unknown",
                    "seedbonus": "0.0",
                    "uploaded": "0",
                    "downloaded": "0",
                    "invites": "0",
                    "tmp_invites": "0"
                };
            }
        }

        // 发送GET请求（普通用户）
        async getRequest(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: this.baseUrl + url,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 发送管理员GET请求
        async getAdminRequest(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: this.baseUrl + url,
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'Accept-Encoding': 'gzip, deflate, br, zstd',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
                        'Cache-Control': 'max-age=0',
                        'Cookie': this.getAdminCookieString(),
                        'Referer': 'https://zmpt.cc/userdetails.php',
                        'Sec-Ch-Ua': '"Microsoft Edge";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-User': '?1',
                        'Upgrade-Insecure-Requests': '1',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0'
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 发送管理员JSON POST请求
        async postJson(url, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: this.baseUrl + url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/html, application/xhtml+xml',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                        'X-Livewire': 'true',
                        'X-CSRF-TOKEN': this._runtimeCsrfToken || this.getCSRFToken(),
                        'Origin': 'https://zmpt.cc',
                        'Referer': this._runtimeReferer || 'https://zmpt.cc/nexusphp/users',
                        'Cookie': this.getAdminCookieString(),
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty'
                    },
                    data: JSON.stringify(data),
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }

        // 获取管理员Cookie字符串
        getAdminCookieString() {
            return this.adminCookieString;
        }

        // 获取CSRF Token（从管理员cookie中）
        getCSRFToken() {
            // 从cookie字符串中提取XSRF-TOKEN
            const match = this.adminCookieString.match(/XSRF-TOKEN=([^;]+)/);
            return match ? match[1] : '';
        }

        // 发送POST请求
        async postForm(url, formData) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: this.baseUrl + url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
                    },
                    data: formData.toString(),
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(error);
                    }
                });
            });
        }
    }

    // 从管理员页面HTML提取<meta name="csrf-token" content="...">
    PowerGifter.prototype.extractMetaCsrfToken = function(html) {
        try {
            const m = html.match(/<meta\s+name=\"csrf-token\"\s+content=\"([^\"]+)\"/i);
            return m ? m[1] : '';
        } catch (_) { return ''; }
    };

    // 辅助：从管理员用户页解析 Livewire initial-data
    PowerGifter.prototype.extractLivewireInitialData = function(html) {
        try {
            // 收集页面中所有 wire:initial-data
            const results = [];
            const re = /wire:initial-data="([^"]+)"/g;
            let m;
            while ((m = re.exec(html)) !== null) {
                try {
                    const decoded = m[1]
                        .replace(/&quot;/g, '"')
                        .replace(/&amp;/g, '&');
                    const obj = JSON.parse(decoded);
                    if (obj && obj.fingerprint && obj.fingerprint.name) {
                        results.push(obj);
                    }
                } catch (_) {}
            }

            // 优先选择 用户详情 组件
            const targetName = 'app.filament.resources.user.user-resource.pages.user-profile';
            const picked = results.find(o => o.fingerprint.name === targetName)
                || results.find(o => (o.fingerprint.name || '').includes('user.user-resource.pages.user-profile'))
                || results[0];
            if (picked) return picked;

            // 兜底：查找 window.livewireScriptConfig 或 data-wire
            const jsonMatch = html.match(/\{\s*"fingerprint"[\s\S]*?"updates"\s*:\s*\[/);
            if (jsonMatch) {
                // 若需要可进一步扩展，但通常 wire:initial-data 已足够
            }
        } catch (_) {}
        return null;
    };

    // UI管理类
    class SalaryUI {
        constructor(config, calculator, counter, gifter) {
            this.config = config;
            this.calculator = calculator;
            this.counter = counter;
            this.gifter = gifter;
            this.currentGroup = 'ZmAudio';
            this.panel = null;
            this.toggleBtn = null;
            this.init();
        }

        init() {
            this.createUI();
            this.bindEvents();
            this.loadSavedData();
        }

        createUI() {
            console.log('开始创建UI...');

            // 创建面板
            this.panel = document.createElement('div');
            this.panel.id = 'salary-panel';
            this.panel.innerHTML = `
                                 <div style="background: rgb(254, 177, 71); color: #000; padding: 10px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
                     <h3 style="margin: 0; font-size: 16px;">ZM电力寻家计划</h3>
                     <button id="close-panel-btn" style="background: none; border: none; color: #000; font-size: 20px; cursor: pointer; padding: 0; width: 30px; height: 30px;">&times;</button>
                 </div>
                                 <div style="padding: 15px; background: white; max-height: 90vh; overflow-y: auto;">
                                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; align-items: start;">
                         <!-- 左侧：工作组和配置 -->
                         <div style="display: flex; flex-direction: column; gap: 15px; height: 100%;">
                             <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                                 <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">工作组选择</h4>
                                 <select id="group-select" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                                     <option value="ZmAudio">有声书组 (ZmAudio)</option>
                                     <option value="ZmWeb">WEB组 (ZmWeb)</option>
                                     <option value="ZmMusic">音乐组 (ZmMusic)</option>
                                     <option value="ZmPT">压制组 (ZmPT)</option>
                                     <option value="Other">转载组 (Other)</option>
                                 </select>
                             </div>

                             <div style="padding: 12px; border: 1px solid #ffeaa7; border-radius: 5px; background: #fff3cd;">
                                 <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">工资配置</h4>
                                 <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                                     <div>
                                         <label style="font-size: 12px;">达标工资:</label>
                                         <input type="number" id="base-salary" placeholder="达标工资" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                     </div>
                                     <div>
                                         <label style="font-size: 12px;">达标种子数:</label>
                                         <input type="number" id="target-count" placeholder="达标种子数" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                     </div>
                                     <div>
                                         <label style="font-size: 12px;">达标邀请(个):</label>
                                         <input type="number" id="invite-count" placeholder="达标邀请数量" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                     </div>
                                 </div>
                                                                   <div style="margin-top: 10px;">
                                                                                <label style="font-size: 12px;">过载电力/个:</label>
                                                                            <input type="number" id="extra-rate" placeholder="过载电力/个" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                  </div>
                                 <button id="save-config-btn" style="width: 100%; padding: 6px; margin-top: 10px; background: rgb(254, 177, 71); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">保存配置</button>
                             </div>

                             <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                                 <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">时间范围</h4>
                                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                     <div>
                                         <label style="font-size: 12px;">年份:</label>
                                         <select id="year-select" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                             <option value="2024">2024年</option>
                                             <option value="2025" selected>2025年</option>
                                             <option value="2026">2026年</option>
                                         </select>
                                     </div>
                                     <div>
                                         <label style="font-size: 12px;">月份:</label>
                                         <select id="month-select" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                             <option value="1">1月</option>
                                             <option value="2">2月</option>
                                             <option value="3">3月</option>
                                             <option value="4">4月</option>
                                             <option value="5">5月</option>
                                             <option value="6">6月</option>
                                             <option value="7">7月</option>
                                             <option value="8">8月</option>
                                             <option value="9">9月</option>
                                             <option value="10">10月</option>
                                             <option value="11">11月</option>
                                             <option value="12">12月</option>
                                         </select>
                                     </div>
                                 </div>
                                                                   <button id="set-current-month-btn" style="width: 100%; padding: 6px; margin-top: 10px; background: rgb(254, 177, 71); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">设为当前月</button>
                             </div>

                                                           <!-- 占位区域，平衡左右高度 -->
                              <div style="flex: 1; min-height: 0; margin-bottom: 5px;"></div>
                         </div>

                         <!-- 右侧：成员管理和统计信息 -->
                         <div style="display: flex; flex-direction: column; gap: 15px; height: 100%;">
                             <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                                 <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">成员管理</h4>
                                 <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                     <div>
                                         <label style="font-size: 12px;">UID:</label>
                                         <input type="text" id="new-uid" placeholder="UID" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                     </div>
                                     <div>
                                         <label style="font-size: 12px;">用户名:</label>
                                         <input type="text" id="new-id" placeholder="用户名" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 12px;">
                                     </div>
                                 </div>
                                 <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 10px;">
                                                                           <button id="add-employee-btn" style="padding: 6px; background: rgb(254, 177, 71); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">添加成员</button>
                                     <button id="add-from-page-btn" style="padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">从个人页添加</button>
                                     <button id="save-employees-btn" style="padding: 6px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">保存列表</button>
                                 </div>
                             </div>

                            <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                                <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">操作</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                    <button id="calculate-all-btn" style="padding: 6px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">计算工资</button>
                                    <button id="gift-all-btn" style="padding: 6px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">发放工资</button>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 0.46fr 0.46fr; gap: 8px; margin-top: 10px;">
                                    <button id="admin-cookie-btn" style="padding: 6px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">管理页面Cookie</button>
                                    <button id="import-data-btn" style="padding: 6px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">导入数据</button>
                                    <button id="export-data-btn" style="padding: 6px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px;">导出数据</button>
                                </div>
                            </div>

                                                                                                                       <!-- 新增：统计信息区域 -->
                               <div style="padding: 12px; border: 1px solid rgb(254, 177, 71); border-radius: 5px; background: rgba(254, 177, 71, 0.1);">
                                   <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                       <h4 style="margin: 0; color: rgb(254, 177, 71); font-size: 14px;">统计信息</h4>
                                       <button id="refresh-stats-btn" style="padding: 4px 8px; background: rgb(254, 177, 71); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 11px;">刷新统计</button>
                                   </div>
                                   <div id="stats-info" style="font-size: 12px; color: #555;">
                                       <div style="margin-bottom: 5px;">总成员数: <span id="total-members">0</span></div>
                                       <div style="margin-bottom: 5px;">已计算: <span id="calculated-count">0</span></div>
                                       <div style="margin-bottom: 5px;">已发放: <span id="paid-count">0</span></div>
                                       <div style="margin-bottom: 5px;">总工资: <span id="total-salary">0</span></div>
                                       <div style="margin-bottom: 5px;">总电力值: <span id="total-power">0</span></div>
                                   </div>
                              </div>
                         </div>
                     </div>

                    <!-- 运行日志区域 -->
                    <div style="padding: 12px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">运行日志</h4>
                        <div id="results" style="height: 120px; overflow-y: auto; border: 1px solid #eee; padding: 8px; background: #f9f9f9; font-family: monospace; font-size: 11px; white-space: pre-wrap;"></div>
                    </div>

                    <!-- 成员列表 -->
                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 14px;">成员列表</h4>
                        <div id="employee-list" style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
                            <!-- 成员列表将在这里动态生成 -->
                        </div>
                    </div>

                </div>
            `;

            // 设置面板样式
                         this.panel.style.cssText = `
                 position: fixed !important;
                 top: 20px !important;
                 right: 20px !important;
                 width: 900px !important;
                 background: white !important;
                 border: 2px solid rgb(254, 177, 71) !important;
                 border-radius: 10px !important;
                 box-shadow: 0 4px 20px rgba(254, 177, 71, 0.3) !important;
                 z-index: 999998 !important;
                 font-family: Arial, sans-serif !important;
                 display: none !important;
             `;

            // 创建切换按钮
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.id = 'salary-toggle-btn';
            this.toggleBtn.innerHTML = '💰';
                         this.toggleBtn.title = 'ZM电力寻家计划';
                         this.toggleBtn.style.cssText = `
                 position: fixed !important;
                 top: 20px !important;
                 right: 20px !important;
                 background: rgb(254, 177, 71) !important;
                 color: #000 !important;
                 border: none !important;
                 border-radius: 50% !important;
                 width: 50px !important;
                 height: 50px !important;
                 font-size: 20px !important;
                 cursor: pointer !important;
                 z-index: 999999 !important;
                 box-shadow: 0 2px 10px rgba(254, 177, 71, 0.3) !important;
                 display: block !important;
                 visibility: visible !important;
                 opacity: 1 !important;
             `;

            this.toggleBtn.onclick = () => {
                this.togglePanel();
            };

            // 添加到页面
            document.body.appendChild(this.panel);
            document.body.appendChild(this.toggleBtn);

            console.log('UI创建完成');
        }

        // 从个人页面添加成员
        addEmployeeFromPersonalPage(uid, username) {
            console.log(`开始添加成员: UID=${uid}, 用户名=${username}, 工作组=${this.currentGroup}`);

            // 检查是否已存在
            const exists = this.config.isEmployeeInGroup(this.currentGroup, uid);
            console.log(`检查成员是否已存在: ${exists}`);

            if (exists) {
                console.warn('成员已存在，无法重复添加');
                this.showMessage('成员已存在', 'error');
                return;
            }

            console.log('成员不存在，准备添加到工作组...');
            this.config.addEmployeeToGroup(this.currentGroup, { uid, id: username, name: username });

            // 自动保存到本地存储
            console.log('保存成员列表到本地存储...');
            GM_setValue('employees', this.config.employeesByGroup);

            console.log('更新成员列表显示...');
            this.updateEmployeeList();

            const message = `已添加成员: ${username} (UID: ${uid})，已自动保存`;
            console.log(message);
            this.showMessage(message);
        }

        togglePanel() {
            const currentDisplay = this.panel.style.display;
            console.log('面板切换:', currentDisplay === 'none' ? '显示' : '隐藏');

            if (currentDisplay === 'none' || currentDisplay === '') {
                this.panel.style.display = 'block';
            } else {
                this.panel.style.display = 'none';
            }
        }

        bindEvents() {
            console.log('开始绑定UI事件...');

            // 关闭面板按钮
            const closeBtn = document.getElementById('close-panel-btn');
            if (closeBtn) {
                console.log('绑定关闭面板按钮事件');
                closeBtn.addEventListener('click', () => {
                    console.log('关闭面板按钮被点击');
                    this.panel.style.display = 'none';
                });
            } else {
                console.error('未找到关闭面板按钮元素');
            }

            // 工作组选择变化时更新配置显示
            const groupSelect = document.getElementById('group-select');
            if (groupSelect) {
                console.log('绑定工作组选择事件');
                groupSelect.addEventListener('change', (e) => {
                    console.log(`工作组选择变化: ${e.target.value}`);
                    this.currentGroup = e.target.value;
                    this.updateConfigDisplay();
                    this.updateEmployeeList(); // 切换组时更新成员列表
                    this.updateStats(); // 切换组时刷新统计
                });
            } else {
                console.error('未找到工作组选择元素');
            }

            // 年月选择变化时更新时间范围
            const yearSelect = document.getElementById('year-select');
            const monthSelect = document.getElementById('month-select');
            if (yearSelect && monthSelect) {
                console.log('绑定年月选择事件');
                yearSelect.addEventListener('change', () => {
                    console.log('年份选择变化');
                    this.updateDateRange();
                });
                monthSelect.addEventListener('change', () => {
                    console.log('月份选择变化');
                    this.updateDateRange();
                });
            } else {
                console.error('未找到年月选择元素');
            }

            // 保存配置按钮
            const saveConfigBtn = document.getElementById('save-config-btn');
            if (saveConfigBtn) {
                console.log('绑定保存配置按钮事件');
                saveConfigBtn.addEventListener('click', () => {
                    console.log('保存配置按钮被点击');
                    this.saveConfig();
                });
            } else {
                console.error('未找到保存配置按钮元素');
            }

            // 设为当前月按钮
            const setCurrentMonthBtn = document.getElementById('set-current-month-btn');
            if (setCurrentMonthBtn) {
                console.log('绑定设为当前月按钮事件');
                setCurrentMonthBtn.addEventListener('click', () => {
                    console.log('设为当前月按钮被点击');
                    this.setCurrentMonth();
                });
            } else {
                console.error('未找到设为当前月按钮元素');
            }

            // 添加成员按钮
            const addEmployeeBtn = document.getElementById('add-employee-btn');
            if (addEmployeeBtn) {
                console.log('绑定添加成员按钮事件');
                addEmployeeBtn.addEventListener('click', () => {
                    console.log('添加成员按钮被点击');
                    this.addEmployee();
                });
            } else {
                console.error('未找到添加成员按钮元素');
            }

            // 从页面添加按钮
            const addFromPageBtn = document.getElementById('add-from-page-btn');
            if (addFromPageBtn) {
                console.log('绑定从页面添加按钮事件');
                addFromPageBtn.addEventListener('click', () => {
                    console.log('从页面添加按钮被点击');

                    // 检查当前页面是否是个人详情页
                    if (window.location.pathname.includes('userdetails.php')) {
                        console.log('检测到个人详情页，尝试自动提取用户信息');

                        // 尝试从URL获取UID
                        const urlParams = new URLSearchParams(window.location.search);
                        const uid = urlParams.get('id');

                        // 尝试从页面DOM获取用户名 - 修复提取逻辑
                        let username = '';

                        // 方法1：从页面内容获取用户名（优先）
                        const usernameElements = document.querySelectorAll('h1, h2, h3, .username, .user-name, .profile-name');
                        for (const element of usernameElements) {
                            const text = element.textContent.trim();
                            if (text && text.length > 0 && text.length < 50 &&
                                !text.includes('用户详情') &&
                                !text.includes('个人资料') &&
                                !text.includes('Profile') &&
                                !text.includes('详情')) {
                                username = text;
                                console.log(`从页面元素提取到用户名: "${username}"`);
                                break;
                            }
                        }

                        // 方法2：从表格内容获取用户名
                        if (!username) {
                            const tableRows = document.querySelectorAll('table tr');
                            for (const row of tableRows) {
                                const cells = row.querySelectorAll('td');
                                for (const cell of cells) {
                                    const text = cell.textContent.trim();
                                    if (text && text.length > 0 && text.length < 50 &&
                                        !text.includes('@') &&
                                        !text.includes('http') &&
                                        !text.includes('用户详情') &&
                                        !text.includes('个人资料')) {
                                        username = text;
                                        console.log(`从表格内容提取到用户名: "${username}"`);
                                        break;
                                    }
                                }
                                if (username) break;
                            }
                        }

                        // 方法3：从页面标题获取（最后尝试，需要过滤无效内容）
                        if (!username) {
                            const pageTitle = document.title;
                            if (pageTitle && pageTitle.includes(' - ')) {
                                const extractedName = pageTitle.split(' - ')[0].trim();
                                // 过滤掉明显无效的标题
                                if (extractedName &&
                                    extractedName.length > 0 &&
                                    extractedName.length < 50 &&
                                    !extractedName.includes('用户详情') &&
                                    !extractedName.includes('个人资料') &&
                                    !extractedName.includes('Profile')) {
                                    username = extractedName;
                                    console.log(`从页面标题提取到用户名: "${username}"`);
                                }
                            }
                        }

                        if (uid && username) {
                            console.log(`自动提取到用户信息: UID=${uid}, 用户名=${username}`);

                            // 自动填充输入框
                            const uidInput = document.getElementById('new-uid');
                            const idInput = document.getElementById('new-id');
                            if (uidInput) uidInput.value = uid;
                            if (idInput) idInput.value = username;

                            // 自动添加成员
                            this.addEmployeeFromPersonalPage(uid, username);
                        } else {
                            console.warn('无法自动提取用户信息');
                            this.showMessage('无法自动获取用户信息，请手动填写', 'warning');
                        }
                    } else {
                        console.log('当前页面不是个人详情页，提示用户');
                        this.showMessage('请在个人详情页面使用此功能，或手动填写用户信息', 'info');
                    }
                });
            } else {
                console.error('未找到从页面添加按钮元素');
            }

            // 保存成员列表按钮
            const saveEmployeesBtn = document.getElementById('save-employees-btn');
            if (saveEmployeesBtn) {
                console.log('绑定保存成员列表按钮事件');
                saveEmployeesBtn.addEventListener('click', () => {
                    console.log('保存成员列表按钮被点击');
                    this.saveEmployees();
                });
            } else {
                console.error('未找到保存成员列表按钮元素');
            }

            // 计算所有成员工资按钮
            const calculateAllBtn = document.getElementById('calculate-all-btn');
            if (calculateAllBtn) {
                console.log('绑定计算所有成员工资按钮事件');
                calculateAllBtn.addEventListener('click', () => {
                    console.log('计算所有成员工资按钮被点击');
                    this.calculateAll();
                });
            } else {
                console.error('未找到计算所有成员工资按钮元素');
            }

            // 批量发放工资按钮
            const giftAllBtn = document.getElementById('gift-all-btn');
            if (giftAllBtn) {
                console.log('绑定批量发放工资按钮事件');
                giftAllBtn.addEventListener('click', () => {
                    console.log('批量发放工资按钮被点击');
                    this.giftAll();
                });
            } else {
                console.error('未找到批量发放工资按钮元素');
            }

            // 管理Cookie按钮
            const adminCookieBtn = document.getElementById('admin-cookie-btn');
            if (adminCookieBtn) {
                console.log('绑定管理Cookie按钮事件');
                adminCookieBtn.addEventListener('click', () => {
                    console.log('管理Cookie按钮被点击');
                    this.showAdminCookieDialog();
                });
            } else {
                console.error('未找到管理Cookie按钮元素');
            }

            // 导入数据按钮
            const importDataBtn = document.getElementById('import-data-btn');
            if (importDataBtn) {
                console.log('绑定导入数据按钮事件');
                importDataBtn.addEventListener('click', () => {
                    console.log('导入数据按钮被点击');
                    this.importData();
                });
            } else {
                console.error('未找到导入数据按钮元素');
            }

            // 导出数据按钮
            const exportDataBtn = document.getElementById('export-data-btn');
            if (exportDataBtn) {
                console.log('绑定导出数据按钮事件');
                exportDataBtn.addEventListener('click', () => {
                    console.log('导出数据按钮被点击');
                    this.exportData();
                });
            } else {
                console.error('未找到导出数据按钮元素');
            }

              // 刷新统计按钮
              const refreshStatsBtn = document.getElementById('refresh-stats-btn');
              if (refreshStatsBtn) {
                  console.log('绑定刷新统计按钮事件');
                  refreshStatsBtn.addEventListener('click', () => {
                      console.log('刷新统计按钮被点击');
                      this.updateStats();
                  });
              } else {
                  console.error('未找到刷新统计按钮元素');
              }


             console.log('UI事件绑定完成');
        }

        loadSavedData() {
            try {
                // 加载保存的配置
                const savedConfig = GM_getValue('salaryConfig', null);
                if (savedConfig) {
                    this.config.groups = { ...this.config.groups, ...savedConfig };
                }

                // 加载成员列表
                const savedEmployees = GM_getValue('employees', {});
                for (const groupName in this.config.groups) {
                    if (savedEmployees[groupName]) {
                        this.config.employeesByGroup[groupName] = savedEmployees[groupName];
                    }
                }

                // 加载工资记录
                const savedRecords = GM_getValue('salaryRecords', {});
                this.config.salaryRecords = savedRecords;

                // 设置默认时间范围
                this.setCurrentMonth();

                                 // 更新显示
                 this.updateEmployeeList();
                 this.updateConfigDisplay();
                 this.updateStats(); // 更新统计信息
            } catch (error) {
                console.error('加载保存数据失败:', error);
            }
        }

        setCurrentMonth() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            const yearSelect = document.getElementById('year-select');
            const monthSelect = document.getElementById('month-select');

            if (yearSelect) yearSelect.value = year;
            if (monthSelect) monthSelect.value = month;

            this.updateDateRange();
        }

        updateDateRange() {
            const yearSelect = document.getElementById('year-select');
            const monthSelect = document.getElementById('month-select');

            if (!yearSelect || !monthSelect) return;

            const year = parseInt(yearSelect.value);
            const month = parseInt(monthSelect.value);

            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = `${year}-${month.toString().padStart(2, '0')}-${new Date(year, month, 0).getDate().toString().padStart(2, '0')}`;

            // 保存到隐藏字段供后续使用
            this.startDate = startDate;
            this.endDate = endDate;

            this.showMessage(`时间范围已设置为: ${year}年${month}月 (${startDate} 至 ${endDate})`);
            // 时间范围变化后，刷新列表和统计
            this.updateEmployeeList();
            this.updateStats();
        }

        updateConfigDisplay() {
            const group = this.config.groups[this.currentGroup];
            if (group) {
                const baseSalaryInput = document.getElementById('base-salary');
                const targetCountInput = document.getElementById('target-count');
                const extraRateInput = document.getElementById('extra-rate');
                const inviteCountInput = document.getElementById('invite-count');

                if (baseSalaryInput) baseSalaryInput.value = group.baseSalary;
                if (targetCountInput) targetCountInput.value = group.targetCount;
                if (extraRateInput) extraRateInput.value = group.extraRate;
                if (inviteCountInput) inviteCountInput.value = group.inviteCount ?? 1;
            }
        }

        saveConfig() {
            const group = this.config.groups[this.currentGroup];
            if (group) {
                const baseSalaryInput = document.getElementById('base-salary');
                const targetCountInput = document.getElementById('target-count');
                const extraRateInput = document.getElementById('extra-rate');
                const inviteCountInput = document.getElementById('invite-count');

                group.baseSalary = parseInt(baseSalaryInput?.value) || group.baseSalary;
                group.targetCount = parseInt(targetCountInput?.value) || group.targetCount;
                group.extraRate = parseInt(extraRateInput?.value) || group.extraRate;
                group.inviteCount = Math.max(0, parseInt(inviteCountInput?.value) || group.inviteCount || 1);

                // 保存到本地存储
                GM_setValue('salaryConfig', this.config.groups);

                this.showMessage('配置已保存');
            }
        }

        addEmployee() {
            const uidInput = document.getElementById('new-uid');
            const idInput = document.getElementById('new-id');

            const uid = uidInput?.value.trim();
            const id = idInput?.value.trim();

            if (!uid || !id) {
                this.showMessage('请填写完整的成员信息', 'error');
                return;
            }

            // 检查是否已存在
            const exists = this.config.isEmployeeInGroup(this.currentGroup, uid);
            if (exists) {
                this.showMessage('成员已存在', 'error');
                return;
            }

            this.config.addEmployeeToGroup(this.currentGroup, { uid, id, name: id }); // 使用用户名作为显示名称

            // 清空输入框
            if (uidInput) uidInput.value = '';
            if (idInput) idInput.value = '';

            this.updateEmployeeList();
            this.showMessage('成员添加成功，请点击"保存列表"按钮保存');
        }

        saveEmployees() {
            GM_setValue('employees', this.config.employeesByGroup);
            this.showMessage('成员列表已保存');
        }

        removeEmployee(uid) {
            this.config.removeEmployeeFromGroup(this.currentGroup, uid);
            this.updateEmployeeList();
            this.showMessage('成员已删除，请点击"保存列表"按钮保存更改');
        }

        updateEmployeeList() {
            const list = document.getElementById('employee-list');
            if (!list) return;

            list.innerHTML = '';

            const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);

            currentEmployees.forEach(emp => {
                                 const item = document.createElement('div');
                                  item.style.cssText = `
                      display: grid;
                      grid-template-columns: 1fr 1.5fr 1fr 0.8fr 1fr 0.8fr 1fr 0.8fr;
                      gap: 10px;
                      align-items: center;
                      padding: 10px;
                      border-bottom: 1px solid #eee;
                      background: white;
                      font-size: 12px;
                  `;

                // 获取当前时间范围与当前组的记录
                const recordKey = `${this.startDate}_${this.endDate}_${this.currentGroup}_${emp.uid}`;
                const record = this.config.salaryRecords[recordKey] || {};

                                 item.innerHTML = `
                     <div><strong>${emp.uid}</strong></div>
                     <div><strong>${emp.id}</strong></div>
                     <div>${(record.displaySeedCount ?? record.seedCount) ?? '-'}</div>
                     <div>${record.isTargetReached ? '✓' : '✗'}</div>
                     <div>${record.salary || '-'}</div>
                     <div>
                         <button class="calc-btn" data-uid="${emp.uid}" style="background: #28a745; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">计算</button>
                     </div>
                     <div>
                         <button class="gift-btn" data-uid="${emp.uid}" style="background: #ffc107; color: #212529; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; ${!record.salary || record.salary <= 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">发放</button>
                     </div>
                     <div>
                         <button class="del-btn" data-uid="${emp.uid}" style="background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px;">删除</button>
                     </div>
                 `;

                list.appendChild(item);
            });

                         // 添加表头
             if (currentEmployees.length > 0) {
                 const header = document.createElement('div');
                                  header.style.cssText = `
                      display: grid;
                      grid-template-columns: 1fr 1.5fr 1fr 0.8fr 1fr 0.8fr 1fr 0.8fr;
                      gap: 10px;
                      align-items: center;
                      padding: 10px;
                      background: rgb(254, 177, 71);
                      color: #000;
                      font-weight: bold;
                      font-size: 12px;
                      border-radius: 5px 5px 0 0;
                  `;
                                 header.innerHTML = `
                     <div>UID</div>
                     <div>用户名</div>
                     <div>种子数</div>
                     <div>达标</div>
                     <div>工资</div>
                     <div>计算</div>
                     <div>发放工资</div>
                     <div>删除</div>
                 `;
                list.insertBefore(header, list.firstChild);
            }

            // 绑定按钮事件
            this.bindEmployeeListEvents();
        }

                 bindEmployeeListEvents() {
             // 绑定计算按钮事件
             const calcBtns = document.querySelectorAll('.calc-btn');
             calcBtns.forEach(btn => {
                 btn.addEventListener('click', (e) => {
                     const uid = e.target.getAttribute('data-uid');
                     this.calculateEmployee(uid);
                 });
             });

             // 绑定发放工资按钮事件
             const giftBtns = document.querySelectorAll('.gift-btn');
             giftBtns.forEach(btn => {
                 btn.addEventListener('click', (e) => {
                     const uid = e.target.getAttribute('data-uid');
                     this.giftEmployee(uid);
                 });
             });

             // 绑定删除按钮事件
             const delBtns = document.querySelectorAll('.del-btn');
             delBtns.forEach(btn => {
                 btn.addEventListener('click', (e) => {
                     const uid = e.target.getAttribute('data-uid');
                     this.removeEmployee(uid);
                 });
             });
         }

        async calculateEmployee(uid) {
            const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);
            const employee = currentEmployees.find(emp => emp.uid === uid);
            if (!employee) return;

            if (!this.startDate || !this.endDate) {
                this.showMessage('请先设置时间范围', 'error');
                return;
            }

            this.showMessage(`正在计算 ${employee.id} 的工资...`, 'info');

            try {
                const seedResult = await this.counter.getSeedCount(employee.id, this.currentGroup, this.startDate, this.endDate);
                const seedCount = (this.currentGroup === 'ZmAudio' && typeof seedResult === 'object') ? seedResult.qualified : seedResult;
                const totalSeeds = (this.currentGroup === 'ZmAudio' && typeof seedResult === 'object') ? seedResult.total : seedCount;
                const salary = this.calculator.calculateSalary(this.currentGroup, seedCount);
                const powerPoints = this.calculator.calculatePowerPoints(salary);
                const isTargetReached = this.calculator.isTargetReached(this.currentGroup, seedCount);

                // 保存结果到员工对象
                employee.seedCount = seedCount;
                if (this.currentGroup === 'ZmAudio') {
                    employee.totalSeeds = totalSeeds;
                }
                employee.salary = salary;
                employee.powerPoints = powerPoints;
                employee.isTargetReached = isTargetReached;
                employee.calculatedAt = new Date().toISOString();

                // 保存到工资记录（包含组）
                const recordKey = `${this.startDate}_${this.endDate}_${this.currentGroup}_${employee.uid}`;
                this.config.salaryRecords[recordKey] = {
                    uid: employee.uid,
                    id: employee.id,
                    group: this.currentGroup,
                    seedCount: seedCount,
                    totalSeeds: totalSeeds,
                    displaySeedCount: (this.currentGroup === 'ZmAudio') ? `${seedCount}(${totalSeeds})` : seedCount,
                    salary: salary,
                    powerPoints: powerPoints,
                    isTargetReached: isTargetReached,
                    isPaid: false,
                    calculatedAt: new Date().toISOString()
                };

                // 保存记录
                GM_setValue('salaryRecords', this.config.salaryRecords);

                const displaySeed = (this.currentGroup === 'ZmAudio') ? `${seedCount}(${totalSeeds})` : `${seedCount}`;
                this.showMessage(`${employee.id}: ${displaySeed}个种子, 工资${salary}, 需发放${powerPoints}电力值`);
                 this.updateEmployeeList();
                 this.updateStats(); // 更新统计信息

            } catch (error) {
                this.showMessage(`计算失败: ${error.message}`, 'error');
            }
        }

                 async calculateAll() {
             if (!this.startDate || !this.endDate) {
                 this.showMessage('请先设置时间范围', 'error');
                 return;
             }

             this.showMessage('正在计算所有成员工资...', 'info');

             const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);
             for (const employee of currentEmployees) {
                 await this.calculateEmployee(employee.uid);
                 // 添加延迟避免请求过快
                 await new Promise(resolve => setTimeout(resolve, 1000));
             }

             this.showMessage('所有成员工资计算完成');
         }

         // 单独为某个员工发放工资
         async giftEmployee(uid) {
             const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);
             const employee = currentEmployees.find(emp => emp.uid === uid);
             if (!employee) return;

             if (!employee.salary || employee.salary <= 0) {
                 this.showMessage('该员工尚未计算工资或工资为0', 'warning');
                 return;
             }

            // 检查是否达标才能发放工资
            if (!employee.isTargetReached) {
                this.showMessage(`${employee.id} 发种数未达标，无法发放工资`, 'warning');
                return;
            }

             const confirmed = confirm(`确定要为 ${employee.id} 发放工资吗？\n工资: ${employee.salary}\n需发放电力值: ${employee.powerPoints}`);
             if (!confirmed) return;

             this.showMessage(`正在为 ${employee.id} 发放工资...`, 'info');

             try {
                // 发放电力工资
                const powerAmount = employee.powerPoints || employee.salary;
                const monthStr = this.getMonthLabel();
                const salaryMessage = `您${monthStr}有声书组工资电力:${powerAmount}`;
                
                await this.gifter.grantPower(employee.uid, powerAmount, salaryMessage);

                 // 如果达标，发放临时邀请
                 if (employee.isTargetReached) {
                     const invites = (this.config.groups[this.currentGroup].inviteCount ?? 1);
                     this.showMessage(`正在为 ${employee.id} 发放临时邀请 x${invites}...`, 'info');
                     await this.gifter.grantTmpInvites(employee.uid, invites, 30, `您${monthStr}有声书组发种达标奖励：临时邀请*${invites}`);
                 }

                 // 更新工资记录为已发放（包含组）
                 const recordKey = `${this.startDate}_${this.endDate}_${this.currentGroup}_${employee.uid}`;
                 if (this.config.salaryRecords[recordKey]) {
                     this.config.salaryRecords[recordKey].isPaid = true;
                     this.config.salaryRecords[recordKey].paidAt = new Date().toISOString();
                 }

                 // 保存记录
                 GM_setValue('salaryRecords', this.config.salaryRecords);

                 const message = employee.isTargetReached ? 
                     `${employee.id} 工资和临时邀请发放成功！` : 
                     `${employee.id} 工资发放成功！`;
                 this.showMessage(message);
                 this.updateEmployeeList(); // 刷新列表显示
                 this.updateStats(); // 更新统计信息

             } catch (error) {
                 this.showMessage(`${employee.id} 工资发放失败: ${error.message}`, 'error');
             }
         }

         // 更新统计信息
         updateStats() {
             const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);
             let totalMembers = currentEmployees.length;
             let calculatedCount = 0;
             let paidCount = 0;
             let totalSalary = 0;
             let totalPower = 0;

             currentEmployees.forEach(emp => {
                 const recordKey = `${this.startDate}_${this.endDate}_${this.currentGroup}_${emp.uid}`;
                 const record = this.config.salaryRecords[recordKey] || {};

                 if (record.salary && record.salary > 0) {
                     calculatedCount++;
                     totalSalary += record.salary;
                     totalPower += record.powerPoints || 0;

                     if (record.isPaid) {
                         paidCount++;
                     }
                 }
             });

             // 更新统计显示
             const totalMembersSpan = document.getElementById('total-members');
             const calculatedCountSpan = document.getElementById('calculated-count');
             const paidCountSpan = document.getElementById('paid-count');
             const totalSalarySpan = document.getElementById('total-salary');
             const totalPowerSpan = document.getElementById('total-power');

             if (totalMembersSpan) totalMembersSpan.textContent = totalMembers;
             if (calculatedCountSpan) calculatedCountSpan.textContent = calculatedCount;
             if (paidCountSpan) paidCountSpan.textContent = paidCount;
             if (totalSalarySpan) totalSalarySpan.textContent = totalSalary;
             if (totalPowerSpan) totalPowerSpan.textContent = totalPower;
         }

        async giftAll() {
            const currentEmployees = this.config.getCurrentEmployees(this.currentGroup);
            // 只包含已计算工资且达标的成员
            const employeesWithSalary = currentEmployees.filter(emp => emp.salary !== undefined && emp.salary > 0 && emp.isTargetReached);

            if (employeesWithSalary.length === 0) {
                this.showMessage('没有达标的成员需要发放工资', 'warning');
                return;
            }

            const confirmed = confirm(`确定要为 ${employeesWithSalary.length} 个成员发放工资吗？`);
            if (!confirmed) return;

            this.showMessage('正在批量发放工资...', 'info');

            for (const employee of employeesWithSalary) {
                try {
                // 发放电力工资
                const powerAmount = employee.powerPoints || employee.salary;
                const monthStr = this.getMonthLabel();
                const salaryMessage = `您${monthStr}有声书组工资电力:${powerAmount}`;
                
                await this.gifter.grantPower(employee.uid, powerAmount, salaryMessage);

                    // 如果达标，发放临时邀请
                    if (employee.isTargetReached) {
                        const invites = (this.config.groups[this.currentGroup].inviteCount ?? 1);
                        this.showMessage(`正在为 ${employee.id} 发放临时邀请 x${invites}...`, 'info');
                        await this.gifter.grantTmpInvites(employee.uid, invites, 30, `您${monthStr}有声书组发种达标奖励：临时邀请*${invites}`);
                    }

                    // 更新工资记录为已发放（包含组）
                    const recordKey = `${this.startDate}_${this.endDate}_${this.currentGroup}_${employee.uid}`;
                    if (this.config.salaryRecords[recordKey]) {
                        this.config.salaryRecords[recordKey].isPaid = true;
                        this.config.salaryRecords[recordKey].paidAt = new Date().toISOString();
                    }

                    const message = employee.isTargetReached ? 
                        `${employee.id} 工资和临时邀请发放成功` : 
                        `${employee.id} 工资发放成功`;
                    this.showMessage(message);

                    // 添加延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 2000));

                } catch (error) {
                    this.showMessage(`${employee.id} 工资发放失败: ${error.message}`, 'error');
                }
            }

            // 保存更新后的记录
            GM_setValue('salaryRecords', this.config.salaryRecords);
            this.updateEmployeeList();
            this.updateStats(); // 更新统计信息

            this.showMessage('批量发放完成');
        }

        importData() {
            // 创建文件输入元素
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            
            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // 验证数据格式
                        if (data.employeesByGroup && data.salaryRecords) {
                            // 导入成员数据
                            this.config.employeesByGroup = data.employeesByGroup;
                            GM_setValue('employees', data.employeesByGroup);
                            
                            // 导入工资记录
                            this.config.salaryRecords = data.salaryRecords;
                            GM_setValue('salaryRecords', data.salaryRecords);
                            
                            // 更新显示
                            this.updateEmployeeList();
                            this.updateStats();
                            
                            this.showMessage('数据导入成功', 'success');
                            console.log('数据导入成功');
                        } else {
                            this.showMessage('数据格式不正确', 'error');
                        }
                    } catch (error) {
                        this.showMessage('文件解析失败：' + error.message, 'error');
                        console.error('文件解析失败:', error);
                    }
                };
                
                reader.readAsText(file);
            };
            
            fileInput.click();
        }

        exportData() {
            const data = {
                group: this.currentGroup,
                groupConfig: this.config.groups[this.currentGroup],
                employees: this.config.employeesByGroup,
                dateRange: {
                    start: this.startDate,
                    end: this.endDate
                },
                salaryRecords: this.config.salaryRecords,
                exportTime: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `工资数据_${this.currentGroup}_${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            URL.revokeObjectURL(url);
            this.showMessage('数据导出成功');
        }

        // 显示管理Cookie对话框
        showAdminCookieDialog() {
            const currentCookie = this.gifter.adminCookieString || '';
            
            // 创建自定义对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
            `;
            
            const content = document.createElement('div');
            content.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                min-width: 500px;
                max-width: 80%;
            `;
            
            content.innerHTML = `
                <h3 style="margin: 0 0 15px 0; color: #333;">请填入 https://zmpt.cc/nexusphp/users 网页中的Cookie</h3>
                <textarea id="cookie-input" style="width: 100%; height: 120px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px; resize: vertical;" placeholder="请粘贴完整的Cookie字符串...">${currentCookie}</textarea>
                <div style="margin-top: 15px; text-align: right;">
                    <button id="cancel-cookie" style="padding: 8px 16px; margin-right: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
                    <button id="confirm-cookie" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">确认</button>
                </div>
            `;
            
            dialog.appendChild(content);
            document.body.appendChild(dialog);
            
            // 绑定事件
            const cookieInput = content.querySelector('#cookie-input');
            const cancelBtn = content.querySelector('#cancel-cookie');
            const confirmBtn = content.querySelector('#confirm-cookie');
            
            cancelBtn.onclick = () => {
                document.body.removeChild(dialog);
            };
            
            confirmBtn.onclick = async () => {
                const cookieValue = cookieInput.value.trim();
                
                if (cookieValue === '') {
                    this.showMessage('Cookie不能为空', 'error');
                    document.body.removeChild(dialog);
                    return;
                }
                
                // 关闭对话框
                document.body.removeChild(dialog);
                
                // 验证Cookie有效性
                this.showMessage('正在验证Cookie有效性...', 'info');
                
                try {
                    const isValid = await this.validateAdminCookie(cookieValue);
                    
                    if (isValid) {
                        // 更新PowerGifter的cookie
                        this.gifter.adminCookieString = cookieValue;
                        
                        // 保存到本地存储
                        GM_setValue('adminCookie', cookieValue);
                        
                        this.showMessage('Cookie验证成功，已保存', 'success');
                        console.log('管理Cookie已更新并验证成功');
                    } else {
                        this.showMessage('Cookie验证失败，请检查Cookie是否正确', 'error');
                    }
                } catch (error) {
                    this.showMessage('Cookie验证失败：' + error.message, 'error');
                }
            };
            
            // 点击背景关闭
            dialog.onclick = (e) => {
                if (e.target === dialog) {
                    document.body.removeChild(dialog);
                }
            };
            
            // 聚焦到输入框
            setTimeout(() => cookieInput.focus(), 100);
        }
        
        // 验证管理员Cookie有效性
        async validateAdminCookie(cookieValue) {
            try {
                // 临时设置cookie进行测试
                const originalCookie = this.gifter.adminCookieString;
                this.gifter.adminCookieString = cookieValue;
                
                // 尝试访问管理员页面
                const response = await this.gifter.getAdminRequest('/nexusphp/users?tableSortColumn=added&tableSortDirection=desc');
                
                // 恢复原始cookie
                this.gifter.adminCookieString = originalCookie;
                
                // 检查响应是否包含管理员界面内容
                if (response.includes('用户管理') || response.includes('tableSortColumn') || response.includes('nexusphp/users')) {
                    return true;
                }
                
                return false;
            } catch (error) {
                console.error('Cookie验证失败:', error);
                return false;
            }
        }

        showMessage(message, type = 'success') {
            const results = document.getElementById('results');
            if (!results) return;

            const div = document.createElement('div');
            div.style.padding = '5px';
            div.style.margin = '5px 0';
            div.style.borderRadius = '3px';

            switch (type) {
                case 'error':
                    div.style.backgroundColor = '#f8d7da';
                    div.style.color = '#721c24';
                    div.style.border = '1px solid #f5c6cb';
                    break;
                case 'info':
                    div.style.backgroundColor = '#d1ecf1';
                    div.style.color = '#0c5460';
                    div.style.border = '1px solid #bee5eb';
                    break;
                case 'warning':
                    div.style.backgroundColor = '#fff3cd';
                    div.style.color = '#856404';
                    div.style.border = '1px solid #ffeaa7';
                    break;
                default:
                    div.style.backgroundColor = '#d4edda';
                    div.style.color = '#155724';
                    div.style.border = '1px solid #c3e6cb';
            }

            div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            results.appendChild(div);
            // 自动滚动到底部，保留历史，用户可通过滚动条查看旧日志
            results.scrollTop = results.scrollHeight;
        }

        // 安全获取月份显示文本，例如 "8月"；若无法解析，则使用当前选择器值或空串
        getMonthLabel() {
            try {
                const yearSelect = document.getElementById('year-select');
                const monthSelect = document.getElementById('month-select');
                // 优先使用内部保存的 startDate（yyyy-mm-dd）
                if (this.startDate) {
                    const m = parseInt(this.startDate.split('-')[1], 10);
                    if (!isNaN(m) && m >= 1 && m <= 12) return `${m}月`;
                }
                // 其次使用UI选择框
                if (monthSelect && monthSelect.value) {
                    const m2 = parseInt(monthSelect.value, 10);
                    if (!isNaN(m2) && m2 >= 1 && m2 <= 12) return `${m2}月`;
                }
                // 回退为空
                return '';
            } catch (_) {
                return '';
            }
        }
    }

    // 初始化函数
    async function init() {
        try {
            console.log('等待页面加载...');
            await waitForPageLoad();

            console.log('页面加载完成，开始创建实例...');

            // 创建全局实例
            window.salaryConfig = new SalaryConfig();
            window.salaryCalculator = new SalaryCalculator(window.salaryConfig);
            window.seedCounter = new SeedCounter();
            window.powerGifter = new PowerGifter();
            window.salaryUI = new SalaryUI(
                window.salaryConfig,
                window.salaryCalculator,
                window.seedCounter,
                window.powerGifter
            );

                         console.log('ZM电力寻家计划已加载');
                 } catch (error) {
             console.error('ZM电力寻家计划初始化失败:', error);
         }
    }

    // 延迟初始化
    setTimeout(init, 1000);

})();

