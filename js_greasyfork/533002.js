// ==UserScript==
// @name         BOSS直聘智能助手
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  BOSS直聘智能助手 - 自动筛选简历并智能打招呼
// @author       Your Name
// @match        https://www.zhipin.com/*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533002/BOSS%E7%9B%B4%E8%81%98%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533002/BOSS%E7%9B%B4%E8%81%98%E6%99%BA%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 8:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.matchesFilters = matchesFilters;
exports.extractCandidateInfo = extractCandidateInfo;
/**
 * 比较教育水平
 * @param required 要求的教育水平
 * @param actual 实际教育水平
 * @returns 是否满足要求
 */
function compareEducation(required, actual) {
    if (required === 'all')
        return true;
    const educationLevels = [
        '初中及以下',
        '高中',
        '大专',
        '本科',
        '硕士',
        '博士'
    ];
    const requiredIndex = educationLevels.indexOf(required);
    const actualIndex = educationLevels.findIndex(level => actual.includes(level));
    if (requiredIndex === -1 || actualIndex === -1)
        return false;
    return actualIndex >= requiredIndex;
}
/**
 * 比较工作经验
 * @param required 要求的工作经验
 * @param actual 实际工作经验
 * @returns 是否满足要求
 */
function compareExperience(required, actual) {
    if (required === 'all')
        return true;
    // 提取要求的年限数字
    const requiredYearsMatch = required.match(/(\d+)/);
    if (!requiredYearsMatch)
        return true;
    const requiredYears = parseInt(requiredYearsMatch[1]);
    // 提取实际年限数字
    const actualYearsMatch = actual.match(/(\d+)/);
    if (!actualYearsMatch)
        return false;
    const actualYears = parseInt(actualYearsMatch[1]);
    return actualYears >= requiredYears;
}
/**
 * 检查技能匹配
 * @param requiredSkills 要求的技能列表
 * @param actualTags 实际拥有的标签
 * @returns 是否满足要求
 */
function matchesSkills(requiredSkills, actualTags) {
    if (requiredSkills.length === 0)
        return true;
    // 将所有标签转为小写进行比较
    const lowerTags = actualTags.map(tag => tag.toLowerCase());
    // 检查是否至少匹配一个技能
    return requiredSkills.some(skill => lowerTags.some(tag => tag.includes(skill.toLowerCase())));
}
/**
 * 检查年龄是否在范围内
 * @param min 最小年龄
 * @param max 最大年龄
 * @param actual 实际年龄
 * @returns 是否在范围内
 */
function isAgeInRange(min, max, actual) {
    if (min <= 0 && max >= 100)
        return true;
    if (actual <= 0)
        return true; // 年龄未知情况
    return actual >= min && actual <= max;
}
/**
 * 根据筛选条件检查候选人是否符合要求
 * @param filters 筛选条件
 * @param candidate 候选人信息
 * @returns 是否符合筛选条件
 */
function matchesFilters(filters, candidate) {
    // 检查教育背景
    if (!compareEducation(filters.education, candidate.education)) {
        return false;
    }
    // 检查工作经验
    if (!compareExperience(filters.experience, candidate.experience)) {
        return false;
    }
    // 检查技能标签
    if (!matchesSkills(filters.skills, candidate.tags)) {
        return false;
    }
    // 检查年龄范围
    if (!isAgeInRange(filters.ageMin, filters.ageMax, candidate.age)) {
        return false;
    }
    return true;
}
/**
 * 从DOM元素中提取候选人信息
 * @param element 候选人卡片DOM元素
 * @returns 候选人信息对象
 */
function extractCandidateInfo(element) {
    var _a, _b;
    // 根据实际DOM结构提取信息
    console.log('提取候选人信息', element);
    // 提取姓名 - 使用更精确的选择器
    let name = '';
    // 首先尝试使用最精确的选择器匹配span.name
    const nameElement = element.querySelector('span.name, .name-wrap span.name');
    if (nameElement) {
        name = ((_a = nameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
        console.log('使用精确选择器提取到姓名:', name);
    }
    else {
        // 如果上面的选择器没找到，尝试更通用的选择器
        const altNameElement = element.querySelector('.name, [class*="name"], .col-2 .row.name-wrap .name');
        if (altNameElement) {
            name = ((_b = altNameElement.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
            console.log('使用通用选择器提取到姓名:', name);
        }
    }
    // 对姓名进行验证，避免提取到职位信息
    if (name.includes('工程师') || name.includes('开发') || name.length > 10) {
        console.log('姓名可能误提取了职位信息:', name);
        // 尝试从名字中提取更合理的姓名部分
        const possibleName = name.split(/\s+/)[0];
        if (possibleName && possibleName.length <= 5) {
            name = possibleName;
            console.log('修正后的姓名:', name);
        }
        else {
            // 如果无法修正，将姓名置为空字符串，后续流程会处理
            console.log('无法从 "' + name + '" 中提取出合理的姓名，置为空');
            name = '';
        }
    }
    // 提取教育信息
    let education = '';
    // 尝试从基本信息中查找
    const baseInfoElement = element.querySelector('.base-info, [class*="base-info"], .join-text-wrap, .row .base-info');
    if (baseInfoElement) {
        const baseInfoText = baseInfoElement.textContent || '';
        const eduMatch = baseInfoText.match(/(本科|大专|硕士|博士|MBA|EMBA|中专|高中|初中)/);
        if (eduMatch) {
            education = eduMatch[1];
        }
    }
    // 尝试从教育经历中查找
    if (!education) {
        const eduExpSelectors = [
            '.edu-exps',
            '[class*="edu-exps"]',
            '.timeline-wrap.edu-exps',
            '[data-v-8126c9ce].timeline-wrap.edu-exps',
            '.edu-wrap',
            '[class*="edu"] .content'
        ];
        for (const selector of eduExpSelectors) {
            const eduExpElement = element.querySelector(selector);
            if (eduExpElement) {
                const eduText = eduExpElement.textContent || '';
                const eduMatch = eduText.match(/(本科|大专|硕士|博士|MBA|EMBA|中专|高中|初中)/);
                if (eduMatch) {
                    education = eduMatch[1];
                    break;
                }
            }
        }
    }
    console.log('提取到学历:', education);
    // 提取工作经验
    let experience = '';
    // 尝试从基本信息中查找
    if (baseInfoElement) {
        const baseInfoText = baseInfoElement.textContent || '';
        const expMatch = baseInfoText.match(/(\d+)年/);
        if (expMatch) {
            experience = expMatch[0];
        }
    }
    // 如果基本信息中没找到，尝试从工作经历中查找
    if (!experience) {
        const workExpElement = element.querySelector('.work-exps, [class*="work-exps"], .timeline-wrap.work-exps');
        if (workExpElement) {
            const workExpText = workExpElement.textContent || '';
            const expMatch = workExpText.match(/(\d+)年/);
            if (expMatch) {
                experience = expMatch[0];
            }
            else {
                // 如果没有明确显示几年经验，尝试计算最早工作时间到现在
                const earliestWorkTimeMatch = workExpText.match(/(\d{4})[\.年\-]/);
                if (earliestWorkTimeMatch) {
                    const earliestYear = parseInt(earliestWorkTimeMatch[1]);
                    const currentYear = new Date().getFullYear();
                    const yearsOfExperience = currentYear - earliestYear;
                    if (yearsOfExperience > 0) {
                        experience = `${yearsOfExperience}年`;
                    }
                }
            }
        }
    }
    console.log('提取到工作经验:', experience);
    // 提取年龄
    let age = 0;
    // 尝试从基本信息中提取
    if (baseInfoElement) {
        const baseInfoText = baseInfoElement.textContent || '';
        const ageMatch = baseInfoText.match(/(\d+)岁/);
        if (ageMatch) {
            age = parseInt(ageMatch[1]);
        }
    }
    console.log('提取到年龄:', age);
    // 提取标签 - 使用更广泛的选择器
    const tagElements = element.querySelectorAll('.tag-item, [class*="tag-item"], .tag, .tags span, .row.tags [class*="tag-item"], [data-v-d62606c4].tag-item');
    const tags = Array.from(tagElements).map(tag => { var _a; return ((_a = tag.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; }).filter(Boolean);
    // 如果没有找到标签，尝试从优势描述中提取关键词
    if (tags.length === 0) {
        const geekDescElement = element.querySelector('.geek-desc, [class*="desc"], .row-flex .content');
        if (geekDescElement) {
            const descText = geekDescElement.textContent || '';
            // 分析描述文本，提取常见技术关键词
            const techKeywords = [
                'C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'PHP', 'C#', 'Ruby', 'Swift',
                'React', 'Vue', 'Angular', 'Node.js', 'Express', 'Django', 'Spring', 'Flask',
                'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',
                'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Windows',
                'Git', 'CI/CD', 'DevOps', 'Agile', 'Scrum',
                '前端', '后端', '全栈', '架构', '测试', '运维', '安全',
                '机器学习', '深度学习', '数据分析', '数据挖掘', '人工智能',
                '微服务', '分布式', '云计算', '大数据'
            ];
            for (const keyword of techKeywords) {
                if (descText.includes(keyword) && !tags.includes(keyword)) {
                    tags.push(keyword);
                }
            }
        }
    }
    console.log('提取到标签:', tags);
    return {
        name,
        education,
        experience,
        age,
        tags
    };
}


/***/ }),

/***/ 28:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.resetConfig = resetConfig;
exports.updateConfig = updateConfig;
// 默认筛选条件
const defaultFilters = {
    education: 'all',
    experience: 'all',
    skills: [],
    ageMin: 0,
    ageMax: 100
};
// 默认LLM配置
const defaultLLMConfig = {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    customModelName: ''
};
// 默认用户配置
const defaultConfig = {
    filters: defaultFilters,
    operationInterval: 5,
    maxProcessCount: 10, // 默认最多处理10个候选人
    llmConfig: defaultLLMConfig,
    jobRequirements: '请在此处填写您的招聘要求，例如：\n- 熟练掌握 TypeScript 和 React\n- 3年以上前端开发经验\n- 熟悉 Node.js 加分'
};
// 配置键名
const CONFIG_KEY = 'boss_assistant_config';
/**
 * 加载用户配置
 * @returns 用户配置对象
 */
function loadConfig() {
    var _a, _b, _c;
    try {
        const savedConfig = localStorage.getItem(CONFIG_KEY);
        if (!savedConfig) {
            console.log('未找到保存的配置，使用默认配置');
            return defaultConfig;
        }
        // 解析保存的配置
        const parsedConfig = JSON.parse(savedConfig);
        // 合并默认配置以确保兼容性
        // 确保新增的字段如maxProcessCount在旧配置中也有默认值
        return {
            filters: Object.assign(Object.assign({}, defaultFilters), parsedConfig.filters),
            operationInterval: (_a = parsedConfig.operationInterval) !== null && _a !== void 0 ? _a : defaultConfig.operationInterval,
            maxProcessCount: (_b = parsedConfig.maxProcessCount) !== null && _b !== void 0 ? _b : defaultConfig.maxProcessCount, // 确保旧配置也有此字段
            llmConfig: Object.assign(Object.assign({}, defaultLLMConfig), parsedConfig.llmConfig),
            jobRequirements: (_c = parsedConfig.jobRequirements) !== null && _c !== void 0 ? _c : defaultConfig.jobRequirements
        };
    }
    catch (e) {
        console.error('加载配置失败，使用默认配置', e);
        return defaultConfig;
    }
}
/**
 * 保存用户配置
 * @param config 用户配置对象
 */
function saveConfig(config) {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        console.log('配置已保存到localStorage');
    }
    catch (error) {
        console.error('保存配置失败:', error);
    }
}
/**
 * 重置用户配置为默认值
 */
function resetConfig() {
    saveConfig(defaultConfig);
    console.log('配置已重置为默认值');
}
/**
 * 更新部分配置
 * @param partialConfig 部分配置对象
 */
function updateConfig(partialConfig) {
    const currentConfig = loadConfig();
    saveConfig(Object.assign(Object.assign({}, currentConfig), partialConfig));
    console.log('配置已更新');
}


/***/ }),

/***/ 55:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.testLLMConfig = testLLMConfig;
exports.analyzeResumeWithLLM = analyzeResumeWithLLM;
exports.shouldContactCandidate = shouldContactCandidate;
const config_1 = __webpack_require__(28);
/**
 * 测试LLM配置是否正确
 * @param llmConfig LLM配置
 * @returns 测试是否成功
 */
function testLLMConfig(llmConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiUrl = llmConfig.model === 'custom' && llmConfig.customApiUrl
            ? llmConfig.customApiUrl
            : 'https://api.openai.com/v1/chat/completions';
        const modelName = llmConfig.model !== 'custom' ? llmConfig.model :
            (llmConfig.customModelName ? llmConfig.customModelName : undefined);
        if (!modelName) {
            throw new Error('请提供有效的模型名称');
        }
        if (!llmConfig.apiKey) {
            throw new Error('API Key不能为空');
        }
        // 构建一个简单的测试请求
        try {
            const response = yield fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${llmConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [{
                            role: 'user',
                            content: '你好，这是一个测试消息，请回复"测试成功"'
                        }],
                    max_tokens: 10,
                    temperature: 0.7
                })
            });
            console.log('API响应状态:', response.status);
            if (response.ok) {
                const result = yield response.json();
                console.log('API响应:', result);
                if (result.choices && result.choices.length > 0) {
                    return true;
                }
                else if (result.error) {
                    console.error('API错误:', result.error);
                    throw new Error(`API错误: ${result.error.message || '未知错误'}`);
                }
                else {
                    console.error('未知响应结构:', result);
                    throw new Error(`请求失败: 状态码 ${response.status}`);
                }
            }
            else {
                // 尝试获取错误信息
                try {
                    const errorData = yield response.json();
                    throw new Error(`API请求失败: 状态码 ${response.status}, 错误信息: ${((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || JSON.stringify(errorData)}`);
                }
                catch (jsonError) {
                    // 如果无法解析JSON，则使用状态文本
                    throw new Error(`API请求失败: 状态码 ${response.status}, ${response.statusText}`);
                }
            }
        }
        catch (error) {
            console.error('请求错误:', error);
            throw error;
        }
    });
}
/**
 * 使用LLM大模型分析简历内容
 * @param resumeText 简历文本内容
 * @returns Promise<ResumeAnalysis> 简历分析结果
 */
function analyzeResumeWithLLM(resumeText) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = (0, config_1.loadConfig)();
        const llmConfig = config.llmConfig;
        const apiUrl = llmConfig.model === 'custom' && llmConfig.customApiUrl
            ? llmConfig.customApiUrl
            : 'https://api.openai.com/v1/chat/completions';
        const prompt = `
  请根据以下招聘要求，分析以下求职者简历，并从以下几个维度进行评分(1-10分)和分析，返回JSON格式:
  
  招聘要求:
  ${config.jobRequirements}
  
  1. 教育背景
  2. 工作经验
  3. 项目经验
  4. 技能匹配度
  5. 稳定性评估
  
  最后给出是否推荐进一步沟通的建议。如果推荐沟通，请生成一段针对该候选人的开场沟通话术。
  
  简历内容:
  ${resumeText}
  
  回复格式(JSON):
  {
    "educationScore": 分数,
    "workExpScore": 分数,
    "projectExpScore": 分数,
    "skillMatchScore": 分数,
    "stabilityScore": 分数,
    "overallScore": 总分,
    "recommendation": true/false,
    "comments": "总体评价和建议",
    "openingMessage": "如果推荐沟通，这里生成一段开场话术（注意：话术中不要表明自己的公司或身份），否则为空字符串"
  }
  `;
        try {
            const response = yield fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${llmConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: llmConfig.model !== 'custom' ? llmConfig.model :
                        (llmConfig.customModelName ? llmConfig.customModelName : undefined),
                    messages: [{
                            role: 'user',
                            content: prompt
                        }],
                    temperature: 0.7
                })
            });
            if (!response.ok) {
                throw new Error(`API请求失败: 状态码 ${response.status}`);
            }
            const result = yield response.json();
            if (result.choices && result.choices.length > 0) {
                const content = result.choices[0].message.content;
                // 尝试从返回内容中提取JSON
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const analysisResult = JSON.parse(jsonMatch[0]);
                        return analysisResult;
                    }
                    else {
                        throw new Error('无法从LLM返回结果中解析JSON');
                    }
                }
                catch (jsonError) {
                    throw new Error('JSON解析失败: ' + jsonError.message);
                }
            }
            else {
                throw new Error('无法解析LLM返回结果');
            }
        }
        catch (error) {
            console.error('LLM分析请求失败:', error);
            // 返回模拟的分析结果，以便在API失败的情况下仍能继续工作
            return {
                educationScore: 5,
                workExpScore: 5,
                projectExpScore: 5,
                skillMatchScore: 5,
                stabilityScore: 5,
                overallScore: 5,
                recommendation: false,
                comments: "由于API请求失败，无法获取真实分析结果。请检查网络连接或API配置。",
                openingMessage: ""
            };
        }
    });
}
/**
 * 判断分析结果是否推荐进一步沟通
 * @param analysis 分析结果
 * @returns boolean 是否推荐
 */
function shouldContactCandidate(analysis) {
    return analysis.recommendation === true || analysis.overallScore >= 7;
}


/***/ }),

/***/ 60:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createControlPanel = createControlPanel;
exports.updateAnalysisResult = updateAnalysisResult;
exports.clearAnalysisResult = clearAnalysisResult;
exports.getRunningStatus = getRunningStatus;
exports.setRunningStatus = setRunningStatus;
const config_1 = __webpack_require__(28);
const llm_1 = __webpack_require__(55);
// CSS 样式
const CSS_STYLES = `
.boss-assistant-panel {
  position: fixed;
  top: 80px;
  right: 20px;
  width: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-size: 14px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  transition: all 0.3s ease;
}

.boss-assistant-header {
  padding: 12px 15px;
  background-color: #1677ff;
  color: #fff;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
}

.boss-assistant-header h3 {
  margin: 0;
  font-size: 16px;
}

.boss-assistant-toggle {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}

.boss-assistant-body {
  padding: 15px;
}

.boss-assistant-section {
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.boss-assistant-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.boss-assistant-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 60px;
  resize: vertical;
}

.form-group-inline {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-group-inline input {
  flex: 1;
}

.boss-assistant-footer {
  padding: 12px 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}

.boss-assistant-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #fff;
  background-color: #1677ff;
}

.boss-assistant-btn.secondary {
  background-color: #f5f5f5;
  color: #666;
}

.boss-assistant-badge {
  display: inline-block;
  margin-left: 5px;
  padding: 2px 5px;
  background-color: #f56c6c;
  color: white;
  font-size: 12px;
  border-radius: 10px;
}

.resume-analysis {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 12px;
  margin-top: 10px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.score {
  font-weight: bold;
}

.score-high {
  color: #67c23a;
}

.score-medium {
  color: #e6a23c;
}

.score-low {
  color: #f56c6c;
}

.boss-assistant-collapsed {
  height: 40px;
  overflow: hidden;
}

.boss-assistant-mini {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1677ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  font-size: 20px;
}

.highlight-card {
  border: 2px solid #67c23a !important;
  box-shadow: 0 0 5px rgba(103, 194, 58, 0.5) !important;
}
`;
// 全局状态
let isRunning = false;
let isPanelVisible = true;
let resumeAnalysisResult = null;
/**
 * 创建DOM元素
 * @param tag HTML标签
 * @param props 属性对象
 * @param children 子元素
 * @returns HTML元素
 */
function createElement(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        }
        else if (key === 'style') {
            element.setAttribute('style', value);
        }
        else {
            element.setAttribute(key, value);
        }
    });
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        }
        else {
            element.appendChild(child);
        }
    });
    return element;
}
/**
 * 创建筛选条件配置界面
 * @param config 用户配置
 * @returns HTML元素
 */
function createFilterSection(config) {
    const educationSelect = createElement('select', { id: 'education-filter' }, [
        createElement('option', { value: 'all' }, ['不限']),
        createElement('option', { value: '大专' }, ['大专及以上']),
        createElement('option', { value: '本科' }, ['本科及以上']),
        createElement('option', { value: '硕士' }, ['硕士及以上']),
        createElement('option', { value: '博士' }, ['博士'])
    ]);
    const experienceSelect = createElement('select', { id: 'experience-filter' }, [
        createElement('option', { value: 'all' }, ['不限']),
        createElement('option', { value: '1年' }, ['1年以上']),
        createElement('option', { value: '3年' }, ['3年以上']),
        createElement('option', { value: '5年' }, ['5年以上']),
        createElement('option', { value: '10年' }, ['10年以上'])
    ]);
    // 设置选中值
    educationSelect.value = config.filters.education;
    experienceSelect.value = config.filters.experience;
    const skillsInput = createElement('input', {
        type: 'text',
        id: 'skills-filter',
        placeholder: '技能关键词，用逗号分隔',
        value: config.filters.skills.join(', ')
    });
    const ageMinInput = createElement('input', {
        type: 'number',
        id: 'age-min',
        placeholder: '最小年龄',
        value: config.filters.ageMin.toString(),
        style: 'width: 48%'
    });
    const ageMaxInput = createElement('input', {
        type: 'number',
        id: 'age-max',
        placeholder: '最大年龄',
        value: config.filters.ageMax.toString(),
        style: 'width: 48%'
    });
    const section = createElement('div', { className: 'boss-assistant-section' }, [
        createElement('h4', {}, ['筛选条件']),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['学历要求']),
            educationSelect
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['工作经验']),
            experienceSelect
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['技能关键词']),
            skillsInput
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['年龄范围']),
            createElement('div', { className: 'form-group-inline' }, [
                ageMinInput,
                createElement('span', {}, ['-']),
                ageMaxInput
            ])
        ])
    ]);
    return section;
}
/**
 * 创建操作间隔设置界面
 * @param config
 * @returns HTML元素
 */
function createIntervalSection(config) {
    const intervalInput = createElement('input', {
        type: 'number',
        id: 'operation-interval',
        value: config.operationInterval.toString(),
        min: '3',
        max: '30'
    });
    const maxProcessCountInput = createElement('input', {
        type: 'number',
        id: 'max-process-count',
        value: config.maxProcessCount.toString(),
        min: '0',
        placeholder: '0表示处理全部'
    });
    const section = createElement('div', { className: 'boss-assistant-section' }, [
        createElement('h4', {}, ['操作设置']),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['操作间隔(秒)']),
            intervalInput
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['最大处理数量(0表示全部)']),
            maxProcessCountInput
        ])
    ]);
    return section;
}
/**
 * 创建LLM配置界面
 * @param config 用户配置
 * @returns HTML元素
 */
function createLLMSection(config) {
    const apiKeyInput = createElement('input', {
        type: 'password',
        id: 'llm-api-key',
        placeholder: '输入API Key',
        value: config.llmConfig.apiKey
    });
    const modelSelect = createElement('select', { id: 'llm-model' }, [
        createElement('option', { value: 'gpt-3.5-turbo' }, ['GPT-3.5 Turbo']),
        createElement('option', { value: 'gpt-4' }, ['GPT-4']),
        createElement('option', { value: 'custom' }, ['自定义模型'])
    ]);
    modelSelect.value = config.llmConfig.model;
    const customModelNameInput = createElement('input', {
        type: 'text',
        id: 'custom-model-name',
        placeholder: '自定义模型名称',
        value: config.llmConfig.customModelName || '',
        style: modelSelect.value === 'custom' ? '' : 'display: none;'
    });
    const customApiInput = createElement('input', {
        type: 'text',
        id: 'custom-model-api',
        placeholder: '自定义API地址',
        value: config.llmConfig.customApiUrl || '',
        style: modelSelect.value === 'custom' ? '' : 'display: none;'
    });
    // 监听模型选择变化
    modelSelect.addEventListener('change', () => {
        const isCustomModel = modelSelect.value === 'custom';
        customApiInput.style.display = isCustomModel ? '' : 'none';
        customModelNameInput.style.display = isCustomModel ? '' : 'none';
    });
    const section = createElement('div', { className: 'boss-assistant-section' }, [
        createElement('h4', {}, ['LLM大模型设置']),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['API Key']),
            apiKeyInput
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['模型选择']),
            modelSelect
        ]),
        createElement('div', { className: 'form-group', id: 'custom-model-name-container' }, [
            createElement('label', {}, ['自定义模型名称']),
            customModelNameInput
        ]),
        createElement('div', { className: 'form-group', id: 'custom-model-container' }, [
            createElement('label', {}, ['自定义API地址']),
            customApiInput
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('button', {
                className: 'boss-assistant-btn',
                id: 'test-llm-btn',
                style: 'width: auto; margin-top: 8px;'
            }, ['测试LLM配置'])
        ])
    ]);
    return section;
}
/**
 * 创建招聘要求配置界面
 * @param config 用户配置
 * @returns HTML元素
 */
function createJobRequirementsSection(config) {
    const requirementsTextarea = createElement('textarea', {
        id: 'job-requirements',
        placeholder: '输入招聘要求，例如：\\n- 熟练掌握 TypeScript 和 React\\n- 3年以上前端开发经验\\n- 熟悉 Node.js 加分',
        value: config.jobRequirements
    });
    const section = createElement('div', { className: 'boss-assistant-section' }, [
        createElement('h4', {}, ['招聘要求']),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['职位要求描述']),
            requirementsTextarea
        ])
    ]);
    return section;
}
/**
 * 创建简历分析结果展示
 * @param analysis 分析结果
 * @returns HTML元素
 */
function createAnalysisResultView(analysis) {
    const getScoreClass = (score) => {
        if (score >= 8)
            return 'score-high';
        if (score >= 6)
            return 'score-medium';
        return 'score-low';
    };
    return createElement('div', { className: 'resume-analysis' }, [
        createElement('h4', {}, ['简历分析结果']),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['教育背景:']),
            createElement('div', { className: `score ${getScoreClass(analysis.educationScore)}` }, [analysis.educationScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['工作经验:']),
            createElement('div', { className: `score ${getScoreClass(analysis.workExpScore)}` }, [analysis.workExpScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['项目经验:']),
            createElement('div', { className: `score ${getScoreClass(analysis.projectExpScore)}` }, [analysis.projectExpScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['技能匹配:']),
            createElement('div', { className: `score ${getScoreClass(analysis.skillMatchScore)}` }, [analysis.skillMatchScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['稳定性评估:']),
            createElement('div', { className: `score ${getScoreClass(analysis.stabilityScore)}` }, [analysis.stabilityScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['总体评分:']),
            createElement('div', { className: `score ${getScoreClass(analysis.overallScore)}` }, [analysis.overallScore.toString()])
        ]),
        createElement('div', { className: 'analysis-item' }, [
            createElement('div', {}, ['推荐沟通:']),
            createElement('div', { className: `score ${analysis.recommendation ? 'score-high' : 'score-low'}` }, [analysis.recommendation ? '是' : '否'])
        ]),
        createElement('div', { className: 'form-group' }, [
            createElement('label', {}, ['评价意见:']),
            createElement('div', {}, [analysis.comments])
        ])
    ]);
}
/**
 * 从表单收集用户配置
 * @returns 用户配置对象
 */
function collectFormConfig() {
    const educationSelect = document.getElementById('education-filter');
    const experienceSelect = document.getElementById('experience-filter');
    const skillsInput = document.getElementById('skills-filter');
    const ageMinInput = document.getElementById('age-min');
    const ageMaxInput = document.getElementById('age-max');
    const intervalInput = document.getElementById('operation-interval');
    const maxProcessCountInput = document.getElementById('max-process-count');
    const apiKeyInput = document.getElementById('llm-api-key');
    const modelSelect = document.getElementById('llm-model');
    const customModelNameInput = document.getElementById('custom-model-name');
    const customApiInput = document.getElementById('custom-model-api');
    const requirementsTextarea = document.getElementById('job-requirements');
    // 解析技能列表
    const skillsString = skillsInput.value.trim();
    const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(s => s) : [];
    const config = {
        filters: {
            education: educationSelect.value,
            experience: experienceSelect.value,
            skills: skills,
            ageMin: parseInt(ageMinInput.value) || 0,
            ageMax: parseInt(ageMaxInput.value) || 100
        },
        operationInterval: parseInt(intervalInput.value) || 5,
        maxProcessCount: parseInt(maxProcessCountInput.value) || 10,
        llmConfig: {
            apiKey: apiKeyInput.value,
            model: modelSelect.value,
            customApiUrl: modelSelect.value === 'custom' ? customApiInput.value : undefined,
            customModelName: modelSelect.value === 'custom' ? customModelNameInput.value : undefined
        },
        jobRequirements: requirementsTextarea.value
    };
    return config;
}
/**
 * 创建并显示控制面板
 * @returns 面板元素
 */
function createControlPanel() {
    // 添加样式
    addStyles();
    const config = (0, config_1.loadConfig)();
    // 创建主面板
    const panel = createElement('div', { className: 'boss-assistant-panel', id: 'boss-assistant-panel' }, [
        createElement('div', { className: 'boss-assistant-header', id: 'boss-assistant-header' }, [
            createElement('h3', {}, ['BOSS直聘智能助手']),
            createElement('button', { className: 'boss-assistant-toggle', id: 'boss-assistant-toggle' }, ['−'])
        ]),
        createElement('div', { className: 'boss-assistant-body' }, [
            createFilterSection(config),
            createIntervalSection(config),
            createLLMSection(config),
            createJobRequirementsSection(config),
            createElement('div', { id: 'analysis-result-container' }, [])
        ]),
        createElement('div', { className: 'boss-assistant-footer' }, [
            createElement('button', { className: 'boss-assistant-btn secondary', id: 'save-config-btn' }, ['保存配置']),
            createElement('button', { className: 'boss-assistant-btn', id: 'start-auto-btn' }, ['开始自动操作'])
        ])
    ]);
    document.body.appendChild(panel);
    // 事件处理程序
    setupEventHandlers();
    return panel;
}
/**
 * 添加CSS样式
 */
function addStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = CSS_STYLES;
    document.head.appendChild(styleElement);
}
/**
 * 设置事件处理程序
 */
function setupEventHandlers() {
    const panel = document.getElementById('boss-assistant-panel');
    const toggleBtn = document.getElementById('boss-assistant-toggle');
    const saveBtn = document.getElementById('save-config-btn');
    const startBtn = document.getElementById('start-auto-btn');
    const testLLMBtn = document.getElementById('test-llm-btn');
    const header = document.getElementById('boss-assistant-header');
    if (!panel || !toggleBtn || !saveBtn || !startBtn || !header)
        return;
    // 切换面板显示/隐藏
    toggleBtn.addEventListener('click', () => {
        isPanelVisible = !isPanelVisible;
        if (isPanelVisible) {
            panel.classList.remove('boss-assistant-collapsed');
            toggleBtn.textContent = '−';
        }
        else {
            panel.classList.add('boss-assistant-collapsed');
            toggleBtn.textContent = '+';
        }
    });
    // 保存配置
    saveBtn.addEventListener('click', () => {
        const config = collectFormConfig();
        (0, config_1.saveConfig)(config);
        alert('配置已保存');
    });
    // 开始/停止自动操作
    startBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            const config = collectFormConfig();
            (0, config_1.saveConfig)(config);
            startBtn.textContent = '停止自动操作';
            startBtn.classList.add('secondary');
            // 触发自动化操作开始事件
            const event = new CustomEvent('boss-assistant:start', {
                detail: { maxCount: config.maxProcessCount }
            });
            document.dispatchEvent(event);
        }
        else {
            startBtn.textContent = '开始自动操作';
            startBtn.classList.remove('secondary');
            // 触发自动化操作停止事件
            const event = new CustomEvent('boss-assistant:stop');
            document.dispatchEvent(event);
        }
    });
    // 测试LLM配置
    if (testLLMBtn) {
        testLLMBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            // 提取当前的LLM配置
            const apiKeyInput = document.getElementById('llm-api-key');
            const modelSelect = document.getElementById('llm-model');
            const customModelNameInput = document.getElementById('custom-model-name');
            const customApiInput = document.getElementById('custom-model-api');
            const llmConfig = {
                apiKey: apiKeyInput.value,
                model: modelSelect.value,
                customApiUrl: modelSelect.value === 'custom' ? customApiInput.value : undefined,
                customModelName: modelSelect.value === 'custom' ? customModelNameInput.value : undefined
            };
            // 禁用按钮，显示正在测试的状态
            testLLMBtn.disabled = true;
            testLLMBtn.textContent = '测试中...';
            try {
                // 调用测试函数
                const result = yield (0, llm_1.testLLMConfig)(llmConfig);
                alert(result ? '配置测试成功！模型连接正常。' : '配置测试失败，请检查API Key和模型设置。');
            }
            catch (error) {
                alert(`测试失败: ${error instanceof Error ? error.message : String(error)}`);
            }
            finally {
                // 恢复按钮状态
                testLLMBtn.disabled = false;
                testLLMBtn.textContent = '测试LLM配置';
            }
        }));
    }
    // 拖动功能
    makeDraggable(panel, header);
}
/**
 * 使元素可拖动
 * @param element 要拖动的元素
 * @param handle 拖动的手柄元素
 */
function makeDraggable(element, handle) {
    let startX = 0, startY = 0;
    let startLeft = 0, startTop = 0;
    handle.onmousedown = dragMouseDown;
    function dragMouseDown(e) {
        e.preventDefault();
        // 记录初始位置
        startX = e.clientX;
        startY = e.clientY;
        // 获取元素的当前位置
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        // 确保元素使用绝对定位
        element.style.position = 'fixed';
        element.style.right = 'auto';
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        // 添加拖动时的视觉反馈
        handle.style.cursor = 'grabbing';
    }
    function elementDrag(e) {
        e.preventDefault();
        // 计算鼠标移动的距离
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        // 设置元素的新位置
        const newLeft = startLeft + dx;
        const newTop = startTop + dy;
        // 确保元素不会被拖出视口
        const maxLeft = window.innerWidth - element.offsetWidth;
        const maxTop = window.innerHeight - element.offsetHeight;
        element.style.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
        element.style.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
    }
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        handle.style.cursor = 'move';
    }
}
/**
 * 更新简历分析结果显示
 * @param analysis 分析结果
 */
function updateAnalysisResult(analysis) {
    resumeAnalysisResult = analysis;
    const container = document.getElementById('analysis-result-container');
    if (!container)
        return;
    // 清空容器
    container.innerHTML = '';
    // 添加分析结果视图
    container.appendChild(createAnalysisResultView(analysis));
}
/**
 * 清除简历分析结果
 */
function clearAnalysisResult() {
    resumeAnalysisResult = null;
    const container = document.getElementById('analysis-result-container');
    if (!container)
        return;
    container.innerHTML = '';
}
/**
 * 获取当前的运行状态
 * @returns 是否正在运行
 */
function getRunningStatus() {
    return isRunning;
}
/**
 * 设置运行状态
 * @param status 运行状态
 */
function setRunningStatus(status) {
    isRunning = status;
    const startBtn = document.getElementById('start-auto-btn');
    if (!startBtn)
        return;
    if (isRunning) {
        startBtn.textContent = '停止自动操作';
        startBtn.classList.add('secondary');
    }
    else {
        startBtn.textContent = '开始自动操作';
        startBtn.classList.remove('secondary');
    }
}


/***/ }),

/***/ 357:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.autoProcessCandidates = autoProcessCandidates;
exports.initAutoProcess = initAutoProcess;
const config_1 = __webpack_require__(28);
const filter_1 = __webpack_require__(8);
const llm_1 = __webpack_require__(55);
const ui_1 = __webpack_require__(60);
/**
 * 等待指定的毫秒数
 * @param ms 毫秒数
 * @returns Promise
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * 添加随机延时
 * @param baseMs 基础毫秒数
 * @returns 实际延时毫秒数
 */
function randomDelay(baseMs) {
    // 添加随机延时，模拟人工操作
    const randomMs = Math.floor(Math.random() * 2000);
    return sleep(baseMs + randomMs);
}
/**
 * 获取iframe文档对象
 * @returns iframe的document对象，如果找不到则返回null
 */
function getIframeDocument() {
    var _a, _b, _c;
    try {
        // 尝试查找所有可能的iframe元素
        const iframes = document.querySelectorAll('iframe');
        console.log(`找到 ${iframes.length} 个iframe元素`);
        if (iframes.length === 0) {
            console.log('页面中没有iframe元素');
            return null;
        }
        // 检查每个iframe
        for (const iframe of Array.from(iframes)) {
            try {
                console.log('检查iframe:', iframe.src || '无src属性', iframe.id || '无id属性', iframe.name || '无name属性');
                // 尝试访问iframe的内容
                const iframeDoc = iframe.contentDocument || ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document);
                if (iframeDoc) {
                    // 检查是否可以访问iframe内容（同源策略）
                    try {
                        const bodyContent = (_b = iframeDoc.body) === null || _b === void 0 ? void 0 : _b.innerHTML;
                        if (bodyContent && bodyContent.length > 0) {
                            console.log('成功访问iframe文档内容，内容长度:', bodyContent.length);
                            // 检查是否包含简历相关内容
                            const hasResumeContent = bodyContent.includes('resume') ||
                                bodyContent.includes('简历') ||
                                iframeDoc.querySelector('.resume-detail-wrap, .lib-resume-recommend, [class*="resume"]');
                            if (hasResumeContent) {
                                console.log('iframe中发现简历相关内容');
                                return iframeDoc;
                            }
                            else {
                                console.log('此iframe不包含简历相关内容');
                            }
                        }
                        else {
                            console.log('iframe body为空或无法访问');
                        }
                    }
                    catch (e) {
                        console.log('无法读取iframe内容（可能受同源策略限制）:', e);
                    }
                }
                else {
                    console.log('无法获取iframe文档');
                }
            }
            catch (frameError) {
                console.log('访问iframe时发生错误:', frameError);
            }
        }
        // 如果没有找到包含简历的iframe，返回第一个可访问的iframe
        for (const iframe of Array.from(iframes)) {
            try {
                const iframeDoc = iframe.contentDocument || ((_c = iframe.contentWindow) === null || _c === void 0 ? void 0 : _c.document);
                if (iframeDoc && iframeDoc.body) {
                    console.log('返回第一个可访问的iframe文档');
                    return iframeDoc;
                }
            }
            catch (e) {
                // 忽略访问错误
            }
        }
        console.log('无法找到可用的iframe文档');
        return null;
    }
    catch (error) {
        console.error('获取iframe文档失败', error);
        return null;
    }
}
/**
 * 从简历详情页提取候选人信息
 * @returns 提取的简历信息对象
 */
function extractResumeDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
            console.log('开始提取简历详情');
            // 等待简历详情页面完全加载
            yield sleep(1000);
            // 创建简历信息对象
            let resume = {
                text: '' // 初始化text字段
            };
            // 查找简历详情弹窗 - 包含更多针对boss-dynamic-dialog的选择器
            const dialogSelectors = [
                // 直接针对test.html提供的结构
                '#boss-dynamic-dialog-1iou6r9m7',
                '.dialog-wrap.active',
                '.boss-popup__wrapper.boss-dialog.boss-dialog__wrapper dialog-lib-resume',
                '.lib-resume-recommend.lib-standard-resume',
                // 通用选择器
                '.resume-detail-wrap',
                '.lib-resume-recommend',
                '.boss-dialog__body',
                '.boss-popup__content',
                '[data-type="boss-dialog"]',
                '[class*="dialog"]',
                '[class*="popup"]',
                '.boss-dialog__wrapper',
                '.boss-layer__wrapper',
                '[id^="boss-dynamic-dialog"]',
                '.dialog-lib-resume',
                '.lib-standard-resume'
            ];
            // 首先尝试在主文档中查找简历详情容器
            let resumeContainer = null;
            for (const selector of dialogSelectors) {
                resumeContainer = document.querySelector(selector);
                if (resumeContainer) {
                    console.log(`找到简历详情容器: ${selector}`);
                    break;
                }
            }
            // 如果在主文档中没找到，尝试在iframe中查找
            if (!resumeContainer) {
                console.log('在主文档中未找到简历详情容器，尝试在iframe中查找');
                const iframeDoc = getIframeDocument();
                if (iframeDoc) {
                    for (const selector of dialogSelectors) {
                        resumeContainer = iframeDoc.querySelector(selector);
                        if (resumeContainer) {
                            console.log(`在iframe中找到简历详情容器: ${selector}`);
                            break;
                        }
                    }
                }
            }
            if (!resumeContainer) {
                console.error('无法找到简历详情容器');
                return null;
            }
            console.log('开始解析简历详情');
            // 尝试提取姓名
            // 注意：在提供的HTML中可能无法直接获取姓名，可能需要从其他地方获取
            const nameSelectors = [
                '.resume-right-side .geek-name .name',
                // 移除 '.resume-anonymous-geek-card .name' 选择器，因为它可能指向其他推荐候选人
                '.name, .geek-name',
                'h1, h2, header h3',
                '.candidate-name'
            ];
            // 先检查是否有推荐候选人卡片，如果有则排除此区域查找姓名
            const anonymousGeekCard = resumeContainer.querySelector('.resume-anonymous-geek-card, .resume-anonymous-geek-card.v2');
            if (anonymousGeekCard) {
                console.log('发现推荐候选人卡片区域，将排除此区域查找姓名');
            }
            for (const selector of nameSelectors) {
                let nameElement = null;
                // 如果存在推荐候选人卡片，确保不从其中查找姓名
                if (anonymousGeekCard) {
                    // 只在非推荐卡片区域查找姓名
                    const allNameElements = resumeContainer.querySelectorAll(selector);
                    for (const element of Array.from(allNameElements)) {
                        if (!anonymousGeekCard.contains(element)) {
                            nameElement = element;
                            break;
                        }
                    }
                }
                else {
                    nameElement = resumeContainer.querySelector(selector);
                }
                if (nameElement) {
                    resume.name = (_a = nameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                    console.log(`提取到姓名: ${resume.name}`);
                    break;
                }
            }
            // 如果无法从简历中提取姓名，将使用processCandidate传入的候选人信息
            if (!resume.name) {
                console.log('无法从简历详情中提取姓名，将在生成文本时使用列表项中的姓名');
            }
            // 提取基本信息（年龄、工作经验等）
            const infoSelectors = [
                '.anonymous-info-labels',
                '.resume-section.geek-position-experience-wrap',
                '.section-content .join-text-wrap',
                '.basic-info',
                '.candidate-info-content',
                '[class*="info"]',
                '.base-info-wrap'
            ];
            let basicInfoElement = null;
            for (const selector of infoSelectors) {
                basicInfoElement = resumeContainer.querySelector(selector);
                if (basicInfoElement) {
                    console.log(`找到基本信息元素: ${selector}`);
                    break;
                }
            }
            if (basicInfoElement) {
                const basicInfoText = ((_b = basicInfoElement.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                console.log('提取到基本信息文本:', basicInfoText);
                // 尝试提取年龄
                const ageMatch = basicInfoText.match(/(\d+)岁/) ||
                    basicInfoText.match(/年龄[：:]\s*(\d+)/) ||
                    basicInfoText.match(/(\d+)\s*岁/);
                if (ageMatch && ageMatch[1]) {
                    resume.age = ageMatch[1];
                    console.log(`提取到年龄: ${resume.age}`);
                }
                // 尝试提取工作经验
                const expMatch = basicInfoText.match(/(\d+)年经验/) ||
                    basicInfoText.match(/经验[：:]\s*(\d+)/) ||
                    basicInfoText.match(/(\d+)年/) ||
                    basicInfoText.match(/(\d+)个月/);
                if (expMatch && expMatch[1]) {
                    const unit = basicInfoText.includes('月') ? '个月' : '年';
                    resume.experience = expMatch[1] + unit;
                    console.log(`提取到工作经验: ${resume.experience}`);
                }
            }
            // 检查岗位经验部分
            const positionExpElement = resumeContainer.querySelector('.resume-section.geek-position-experience-wrap');
            if (positionExpElement && !resume.experience) {
                const posExpText = ((_c = positionExpElement.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                const expMatch = posExpText.match(/(\d+)年(\d+)个月/) ||
                    posExpText.match(/(\d+)年/) ||
                    posExpText.match(/(\d+)个月/);
                if (expMatch) {
                    resume.experience = expMatch[0];
                    console.log(`从岗位经验提取到工作经验: ${resume.experience}`);
                }
            }
            // 提取教育经历
            const eduSelectors = [
                '.resume-section.geek-education-experience-wrap',
                '.edu-wrap .school-name-wrap',
                '.education',
                '[class*="education"]',
                '.edu-exp',
                '[data-view-name="resume_education"]',
                '.school-name'
            ];
            let educationElement = null;
            for (const selector of eduSelectors) {
                educationElement = resumeContainer.querySelector(selector);
                if (educationElement) {
                    console.log(`找到教育经历元素: ${selector}`);
                    break;
                }
            }
            if (educationElement) {
                resume.education = (_d = educationElement.textContent) === null || _d === void 0 ? void 0 : _d.trim();
                // 提取简要的教育信息
                const schoolMatch = resume.education.match(/([\u4e00-\u9fa5]+大学|学院|学校)/);
                const degreeMatch = resume.education.match(/(本科|硕士|博士|大专|高中|中专)/);
                if (schoolMatch && degreeMatch) {
                    resume.education = `${schoolMatch[1]} ${degreeMatch[1]}`;
                }
                console.log(`提取到教育经历: ${resume.education}`);
            }
            // 提取期望薪资
            const expectSelectors = [
                '.resume-section.geek-expect-wrap',
                '[class*="salary"]',
                '[class*="expect"]',
                '.expect-salary',
                '.salary-wrap'
            ];
            let salaryElement = null;
            for (const selector of expectSelectors) {
                salaryElement = resumeContainer.querySelector(selector);
                if (salaryElement) {
                    console.log(`找到期望薪资元素: ${selector}`);
                    break;
                }
            }
            if (salaryElement) {
                const salaryText = ((_e = salaryElement.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || '';
                const salaryMatch = salaryText.match(/(\d+-\d+[KkWw万])|(\d+[KkWw万]-\d+[KkWw万])/);
                if (salaryMatch) {
                    resume.salary = salaryMatch[0];
                }
                else {
                    resume.salary = salaryText;
                }
                console.log(`提取到期望薪资: ${resume.salary}`);
            }
            // 提取技能标签
            const tagSelectors = [
                '.resume-section.geek-position-experience-wrap .tags .tag',
                '.work-wrap .tags .tag',
                '.skill-tag',
                '[class*="skill"]',
                '[class*="tag"]',
                '.tag-item',
                '.match-labels .label'
            ];
            const skillTags = [];
            for (const selector of tagSelectors) {
                const tagElements = resumeContainer.querySelectorAll(selector);
                if (tagElements && tagElements.length > 0) {
                    console.log(`找到技能标签元素: ${selector}, 数量: ${tagElements.length}`);
                    const tags = Array.from(tagElements)
                        .map(tag => { var _a; return (_a = tag.textContent) === null || _a === void 0 ? void 0 : _a.trim(); })
                        .filter(Boolean);
                    skillTags.push(...tags);
                }
            }
            if (skillTags.length > 0) {
                // 去重
                resume.skills = Array.from(new Set(skillTags));
                console.log(`提取到技能: ${resume.skills.join(', ')}`);
            }
            // 提取个人简介或自我评价
            const descSelectors = [
                '.geek-desc',
                '.resume-section .geek-desc',
                '[data-high-light="true"].geek-desc',
                '.summary',
                '[class*="summary"]',
                '[class*="evaluate"]',
                '.self-evaluation'
            ];
            let summaryElement = null;
            for (const selector of descSelectors) {
                summaryElement = resumeContainer.querySelector(selector);
                if (summaryElement) {
                    console.log(`找到个人简介元素: ${selector}`);
                    break;
                }
            }
            if (summaryElement) {
                // 获取原始HTML并移除<span>标签，保留文本内容
                const originalHtml = summaryElement.innerHTML;
                let summaryText = '';
                if (originalHtml.includes('font-highlight')) {
                    // 如果有高亮内容，尝试提取纯文本
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = originalHtml;
                    summaryText = tempDiv.textContent || '';
                }
                else {
                    summaryText = ((_f = summaryElement.textContent) === null || _f === void 0 ? void 0 : _f.trim()) || '';
                }
                resume.summary = summaryText;
                console.log(`提取到自我评价: ${resume.summary.substring(0, 50)}...`);
            }
            // 尝试提取工作经历
            const workSelectors = [
                '.resume-section.geek-work-experience-wrap .work-wrap',
                '.work-wrap',
                '.timeline-item',
                '.geek-work-experience-wrap',
                '[class*="work-exp"]'
            ];
            let workElements = null;
            for (const selector of workSelectors) {
                workElements = resumeContainer.querySelectorAll(selector);
                if (workElements && workElements.length > 0) {
                    console.log(`找到工作经历元素: ${selector}, 数量: ${workElements.length}`);
                    break;
                }
            }
            if (workElements && workElements.length > 0) {
                const workHistory = Array.from(workElements)
                    .map(workItem => {
                    var _a, _b, _c, _d;
                    // 提取公司名称、职位和时间
                    const companyElem = workItem.querySelector('.company-name, .company-name-wrap');
                    const positionElem = workItem.querySelector('.position');
                    const periodElem = workItem.querySelector('.period');
                    const contentElem = workItem.querySelector('.item-content');
                    let workText = '';
                    if (companyElem)
                        workText += ((_a = companyElem.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                    if (positionElem)
                        workText += ' ' + (((_b = positionElem.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '');
                    if (periodElem)
                        workText += ' ' + (((_c = periodElem.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '');
                    if (contentElem)
                        workText += '\n' + (((_d = contentElem.textContent) === null || _d === void 0 ? void 0 : _d.trim()) || '');
                    return workText.trim();
                })
                    .filter(Boolean)
                    .join(' | ');
                resume.workHistory = workHistory;
                console.log(`提取到工作经历: ${workHistory.substring(0, 50)}...`);
            }
            // 生成完整文本用于兼容原有代码
            resume.text = `
姓名：${resume.name || '未知'}
年龄：${resume.age || '未知'}
工作经验：${resume.experience || '未知'}
教育经历：${resume.education || '未知'}
期望薪资：${resume.salary || '未知'}
技能：${((_g = resume.skills) === null || _g === void 0 ? void 0 : _g.join(', ')) || '未知'}
简介：${resume.summary || '未知'}
工作经历：${resume.workHistory || '未知'}
    `;
            console.log('简历信息提取完成');
            return resume;
        }
        catch (error) {
            console.error('提取简历信息时发生错误', error);
            return null;
        }
    });
}
/**
 * 高亮符合条件的候选人卡片
 * @param card 候选人卡片元素
 */
function highlightCard(card) {
    card.classList.add('highlight-card');
}
/**
 * 查找所有候选人卡片
 * @param processedCards 已处理过的卡片数组，用于排除已处理的卡片
 * @returns 候选人卡片元素列表（未处理的）
 */
function findCandidateCards(processedCards = new Set()) {
    // 首先尝试获取iframe内容
    const iframeDoc = getIframeDocument();
    const doc = iframeDoc || document;
    console.log('开始在页面中查找候选人卡片');
    // 首先尝试查找列表元素，确保按照DOM顺序处理
    const cardList = doc.querySelector('.card-list, [class*="card-list"], .recommend-list, [data-v-b753c1ac].card-list');
    let cards = [];
    if (cardList) {
        console.log('找到卡片列表容器，按列表顺序查找卡片');
        // 如果找到列表容器，按列表项顺序处理
        cards = Array.from(cardList.querySelectorAll('li.card-item, [class*="card-item"], li'));
    }
    else {
        // 按照提供的实际DOM结构查找候选人卡片 - 更新选择器
        cards = Array.from(doc.querySelectorAll('.candidate-card-wrap, .card-inner[data-geek], [data-geekid], ' +
            'li.card-item, [data-v-b753c1ac].card-item, ' +
            '.card-list li, [class*="card-list"] li, ' +
            '[class*="candidate-recommend"] li, [class*="recommend-list"] li'));
        // 如果没有找到卡片，尝试更通用的选择器
        if (cards.length === 0) {
            console.log('尝试使用更通用的选择器查找候选人卡片');
            cards = Array.from(doc.querySelectorAll('[class*="candidate-card"], [class*="card-inner"], [class*="card-wrap"], ' +
                '[class*="card-item"], [data-v-b753c1ac], ' +
                '[data-v*="card"], [data-v*="candidate"], ' +
                '[class*="list"] > li, .candidate-card-wrap, ' +
                '[data-geek], [data-geekid]'));
        }
    }
    console.log(`找到 ${cards.length} 个候选人卡片`);
    // 过滤掉已处理过的卡片
    const newCards = cards.filter(card => !processedCards.has(card));
    console.log(`其中 ${newCards.length} 个卡片未处理`);
    return newCards;
}
// 默认配置
const config = {
    autoGreet: true,
    greetingMessages: [
        '您好，看到您的简历很感兴趣，方便聊一下吗？',
        '您好，我们正在招聘相关岗位，您是否有兴趣了解一下？',
        '您好，我对您的经历很感兴趣，想进一步了解一下，方便沟通吗？'
    ]
};
/**
 * 等待指定选择器的元素出现在DOM中
 * @param selector CSS选择器
 * @param context 查询上下文，默认为主文档
 * @param timeout 超时时间（毫秒）
 * @returns 找到的元素或null
 */
function waitForElement(selector_1) {
    return __awaiter(this, arguments, void 0, function* (selector, context = document, timeout = 7000) {
        const contextName = context === document ? 'main document' : 'specified context';
        console.log(`Waiting for element: ${selector} in ${contextName}`);
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = context.querySelector(selector);
            if (element) {
                console.log(`Element found: ${selector} in ${contextName}`);
                yield sleep(300); // 确保元素渲染稳定
                return element;
            }
            yield sleep(100); // 每100毫秒检查一次
        }
        console.log(`Timeout waiting for element: ${selector} in ${contextName}`);
        return null;
    });
}
/**
 * 点击候选人卡片的查看按钮或卡片本身
 * @param card 要点击的卡片元素 (来自 iframe)
 * @returns 是否成功打开简历详情
 */
function clickViewButton(card) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // 尝试从卡片中提取姓名用于日志
            const nameElement = card.querySelector('span.name, .name-wrap .name, .geek-name, .name, [class*="name"]');
            const candidateName = ((_a = nameElement === null || nameElement === void 0 ? void 0 : nameElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '未知姓名 (从卡片提取)';
            console.log(`尝试点击卡片查看 ${candidateName} 的简历`);
            // 检查卡片元素是否存在
            if (!card) {
                console.error('传递给clickViewButton的卡片元素无效');
                return false;
            }
            // 检查是否已经有打开的简历详情弹窗
            const existingDialogSelectors = [
                // 针对test.html的特定结构
                '[id^="boss-dynamic-dialog"]',
                '.dialog-wrap.active',
                '.boss-popup__wrapper.boss-dialog',
                '.boss-popup__content',
                '.lib-resume-recommend',
                // 通用选择器
                '.resume-detail-wrap',
                '.boss-dialog__body',
                '[class*="dialog"][class*="active"]',
                '[class*="popup"][style*="z-index"]'
            ];
            for (const selector of existingDialogSelectors) {
                const existingDialog = document.querySelector(selector);
                if (existingDialog) {
                    console.log(`页面上已经有打开的简历详情弹窗: ${selector}`);
                    return true;
                }
            }
            // 优先尝试点击卡片本身或卡片内的可点击区域来触发简历详情
            console.log('尝试点击卡片本身触发简历详情...');
            // 尝试找到卡片中的可点击区域
            const clickableAreaSelectors = [
                '.card-inner',
                '.candidate-card-content',
                '[class*="inner"]',
                '[class*="content"]',
                '.row.name-wrap',
                '.avatar-wrap',
                '.col-2',
                '.candidate-card-wrap',
                '[data-geek]',
                '[data-geekid]',
                '.card-item'
            ];
            let clickableArea = null;
            for (const selector of clickableAreaSelectors) {
                clickableArea = card.querySelector(selector);
                if (clickableArea) {
                    console.log(`找到卡片内可点击区域 (${selector})，点击...`);
                    break;
                }
            }
            if (clickableArea) {
                console.log('开始点击卡片可点击区域...');
                // 尝试使用不同的点击方法
                try {
                    clickableArea.click();
                    console.log('已使用Element.click方法点击');
                }
                catch (clickError) {
                    console.log('Element.click方法失败，尝试模拟鼠标点击', clickError);
                    // 模拟鼠标点击
                    try {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        clickableArea.dispatchEvent(clickEvent);
                        console.log('已模拟鼠标点击事件');
                    }
                    catch (mouseError) {
                        console.error('模拟鼠标点击失败', mouseError);
                    }
                }
                console.log('已点击卡片可点击区域，等待简历详情出现...');
            }
            else {
                // 直接点击卡片
                console.log('开始点击整个卡片...');
                try {
                    card.click();
                    console.log('已使用Element.click方法点击卡片');
                }
                catch (clickError) {
                    console.log('Element.click方法失败，尝试模拟鼠标点击', clickError);
                    // 模拟鼠标点击
                    try {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        card.dispatchEvent(clickEvent);
                        console.log('已模拟鼠标点击事件');
                    }
                    catch (mouseError) {
                        console.error('模拟鼠标点击失败', mouseError);
                    }
                }
                console.log('已点击整个卡片，等待简历详情出现...');
            }
            // 等待简历详情出现
            console.log('等待简历详情弹窗出现...');
            yield sleep(1200);
            // 直接检查特定的弹窗元素 - 针对test.html提供的结构
            const specificDialogSelectors = [
                '[id^="boss-dynamic-dialog"]',
                '.dialog-wrap.active',
                '.boss-popup__wrapper',
                '.boss-dialog',
                '.boss-popup__content',
                '.lib-resume-recommend',
                '.lib-standard-resume'
            ];
            for (const selector of specificDialogSelectors) {
                const dialogElement = document.querySelector(selector);
                if (dialogElement) {
                    console.log(`成功找到简历详情弹窗: ${selector}`);
                    return true;
                }
            }
            // 检查是否存在任何对话框或弹窗元素
            const genericDialogSelectors = [
                '[class*="dialog"]',
                '[class*="popup"]',
                '[class*="resume"]',
                '[class*="modal"]',
                '[role="dialog"]',
                '.drawer',
                '.layer'
            ];
            for (const selector of genericDialogSelectors) {
                const dialogElement = document.querySelector(selector);
                if (dialogElement && (dialogElement.classList.contains('active') ||
                    (dialogElement.getAttribute('style') && dialogElement.getAttribute('style').includes('z-index')) ||
                    dialogElement.classList.contains('boss-dialog') ||
                    dialogElement.classList.contains('boss-popup'))) {
                    console.log(`找到活跃的对话框元素: ${selector}`);
                    return true;
                }
            }
            // 尝试强制检测document.body的变化
            const bodyChildren = document.body.children;
            for (let i = 0; i < bodyChildren.length; i++) {
                const child = bodyChildren[i];
                if (child.classList.contains('boss-dialog') ||
                    child.classList.contains('boss-popup') ||
                    child.classList.contains('dialog-wrap') ||
                    child.id.startsWith('boss-dynamic-dialog') ||
                    (child.getAttribute('style') && child.getAttribute('style').includes('z-index'))) {
                    console.log(`从document.body直接找到弹窗元素: ${child.tagName}#${child.id}.${Array.from(child.classList).join('.')}`);
                    return true;
                }
            }
            // 备用检测：递归检查DOM中的弹窗元素
            function findDialogInElement(element, depth = 0) {
                if (depth > 3)
                    return null; // 限制搜索深度
                // 检查当前元素是否是对话框
                if (element.id.startsWith('boss-dynamic-dialog') ||
                    element.classList.contains('dialog-wrap') ||
                    element.classList.contains('boss-dialog') ||
                    element.classList.contains('boss-popup') ||
                    element.classList.contains('lib-resume-recommend')) {
                    return element;
                }
                // 递归检查子元素
                for (let i = 0; i < element.children.length; i++) {
                    const result = findDialogInElement(element.children[i], depth + 1);
                    if (result)
                        return result;
                }
                return null;
            }
            const dialogElement = findDialogInElement(document.body);
            if (dialogElement) {
                console.log(`递归查找找到弹窗元素: ${dialogElement.tagName}#${dialogElement.id}.${Array.from(dialogElement.classList).join('.')}`);
                return true;
            }
            // 尝试通过定时任务再次检查
            let dialogFound = false;
            for (let attempt = 1; attempt <= 3; attempt++) {
                console.log(`第${attempt}次额外检查弹窗...`);
                yield sleep(500);
                // 检查特定选择器
                for (const selector of [...specificDialogSelectors, ...genericDialogSelectors]) {
                    const dialogElement = document.querySelector(selector);
                    if (dialogElement) {
                        console.log(`额外检查找到简历详情弹窗: ${selector}`);
                        dialogFound = true;
                        break;
                    }
                }
                if (dialogFound)
                    break;
            }
            if (dialogFound) {
                return true;
            }
            console.log('无法检测到简历详情或对话框元素，点击可能未生效');
            return false;
        }
        catch (error) {
            console.error('在卡片点击或详情视图检测过程中发生错误:', error);
            return false;
        }
    });
}
/**
 * 关闭简历详情
 */
function closeResumeDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[closeResumeDetail] 尝试关闭简历详情');
        // 复用 extractResumeDetails 的弹窗查找逻辑来确定上下文
        const dialogSelectors = [
            '#boss-dynamic-dialog-1iou6r9m7',
            '.dialog-wrap.active',
            '.boss-popup__wrapper.boss-dialog.boss-dialog__wrapper dialog-lib-resume',
            '.lib-resume-recommend.lib-standard-resume',
            '.resume-detail-wrap',
            '.lib-resume-recommend',
            '.boss-dialog__body',
            '.boss-popup__content',
            '[data-type="boss-dialog"]',
            '[class*="dialog"]',
            '[class*="popup"]',
            '.boss-dialog__wrapper',
            '.boss-layer__wrapper',
            '[id^="boss-dynamic-dialog"]',
            '.dialog-lib-resume',
            '.lib-standard-resume'
        ];
        let resumeContainer = null;
        let containerContext = null;
        let containerSelector = '';
        // 尝试在主文档中查找
        console.log('[closeResumeDetail] 在主文档中查找弹窗容器...');
        for (const selector of dialogSelectors) {
            resumeContainer = document.querySelector(selector);
            if (resumeContainer) {
                console.log(`[closeResumeDetail] 在主文档找到容器: ${selector}`);
                containerContext = document;
                containerSelector = selector;
                break;
            }
        }
        // 如果主文档找不到，尝试在 iframe 中查找
        if (!resumeContainer) {
            console.log('[closeResumeDetail] 主文档未找到，尝试在 iframe 中查找...');
            const iframeDoc = getIframeDocument();
            if (iframeDoc) {
                for (const selector of dialogSelectors) {
                    resumeContainer = iframeDoc.querySelector(selector);
                    if (resumeContainer) {
                        console.log(`[closeResumeDetail] 在 iframe 中找到容器: ${selector}`);
                        containerContext = iframeDoc;
                        containerSelector = selector;
                        break;
                    }
                }
            }
        }
        if (!resumeContainer || !containerContext) {
            console.warn('[closeResumeDetail] 未能定位到简历弹窗容器，无法继续关闭操作。尝试后备方案...');
            // 尝试后备方案：直接在 document 查找关闭按钮和 ESC
            yield attemptFallbackClose(document);
            return;
        }
        console.log(`[closeResumeDetail] 定位到弹窗容器: ${containerSelector}，在其内部和父级查找关闭按钮`);
        // 优先尝试在弹窗容器内部查找关闭按钮
        let closeButton = yield findCloseButtonInContext(resumeContainer);
        // 如果在容器内部找不到，尝试在容器的父级元素查找（有时关闭按钮在弹窗外部）
        if (!closeButton && resumeContainer.parentElement) {
            console.log('[closeResumeDetail] 在容器内部未找到关闭按钮，尝试查找父级元素...');
            closeButton = yield findCloseButtonInContext(resumeContainer.parentElement);
        }
        // 如果找到关闭按钮，点击它
        if (closeButton) {
            console.log(`[closeResumeDetail] 找到关闭按钮，点击...`);
            closeButton.click();
            yield sleep(1000); // 等待关闭动画
            console.log('[closeResumeDetail] 简历详情已关闭 (通过按钮点击)');
        }
        else {
            // 如果找不到按钮，使用后备方案
            console.warn('[closeResumeDetail] 在容器及其父级中未找到关闭按钮，尝试后备方案 (返回按钮 / ESC)...');
            yield attemptFallbackClose(containerContext);
        }
    });
}
// 辅助函数：在指定上下文中查找关闭按钮
function findCloseButtonInContext(contextElement) {
    return __awaiter(this, void 0, void 0, function* () {
        const closeSelectors = [
            '.boss-popup__close .icon-close', // 优先用户提供的
            '.icon-close',
            '.close-icon',
            '[class*="close"]',
            'button[class*="close"]', // 更具体的按钮
            '.boss-dialog__close',
            '.close-wrapper'
        ];
        console.log(`[findCloseButtonInContext] 在元素 <${contextElement.tagName.toLowerCase()}> 内查找关闭按钮`);
        for (const selector of closeSelectors) {
            const button = contextElement.querySelector(selector);
            if (button) {
                console.log(`[findCloseButtonInContext] 找到按钮: ${selector}`);
                return button;
            }
        }
        console.log(`[findCloseButtonInContext] 在元素 <${contextElement.tagName.toLowerCase()}> 内未找到任何关闭按钮`);
        return null;
    });
}
// 辅助函数：尝试后备关闭方法（返回按钮或ESC）
function attemptFallbackClose(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[attemptFallbackClose] 尝试后备关闭方法...');
        const backButton = doc.querySelector('.header-back, [class*="back"], .go-back');
        if (backButton) {
            console.log('[attemptFallbackClose] 找到返回按钮，点击...');
            backButton.click();
            yield sleep(1000);
            console.log('[attemptFallbackClose] 已点击返回按钮');
            return;
        }
        console.log('[attemptFallbackClose] 尝试按ESC键关闭...');
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        doc.dispatchEvent(escEvent);
        yield sleep(1000);
        console.log('[attemptFallbackClose] 已尝试按ESC键');
    });
}
/**
 * 发送打招呼消息
 * @param candidateName 候选人姓名
 * @returns 是否成功发送打招呼消息
 */
function sendGreeting(candidateName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('准备发送打招呼消息');
            // 确保有问候消息配置
            if (!config.greetingMessages || config.greetingMessages.length === 0) {
                console.error('未配置问候消息，无法发送');
                return false;
            }
            // 从配置的问候语中选择一条
            let greeting = '';
            const randomIndex = Math.floor(Math.random() * config.greetingMessages.length);
            greeting = config.greetingMessages[randomIndex];
            // 如果有候选人姓名，替换问候语中的{name}占位符
            if (candidateName) {
                greeting = greeting.replace(/{name}/g, candidateName);
            }
            // 发送消息
            return yield sendMessage(greeting);
        }
        catch (error) {
            console.error('发送打招呼消息时发生错误', error);
            return false;
        }
    });
}
/**
 * 处理单个候选人
 * @param card 候选人卡片元素
 * @returns 是否处理成功 (成功定义为LLM推荐且尝试了打招呼)
 */
function processCandidate(card) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let shouldClosePopup = false; // 标记是否需要关闭弹窗
        try {
            console.log('[processCandidate] 开始处理候选人卡片:', card);
            const candidate = (0, filter_1.extractCandidateInfo)(card);
            // 优先从卡片中正确提取姓名
            let candidateName = '';
            const nameElementInCard = card.querySelector('span.name, .name-wrap .name');
            if (nameElementInCard) {
                candidateName = ((_a = nameElementInCard.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                console.log(`[processCandidate] 从卡片直接提取到候选人姓名: ${candidateName}`);
            }
            // 如果直接从卡片提取失败，则使用extractCandidateInfo的结果
            if (!candidateName && candidate.name) {
                candidateName = candidate.name;
            }
            console.log('[processCandidate] 提取到卡片信息:', {
                name: candidateName || candidate.name,
                education: candidate.education,
                experience: candidate.experience,
                tags: candidate.tags
            });
            const config = (0, config_1.loadConfig)();
            // 1. 检查技能筛选
            if (config.filters.skills && config.filters.skills.length > 0) {
                const candidateSkills = candidate.tags || [];
                const requiredSkills = config.filters.skills;
                const hasMatchingSkill = requiredSkills.some((skill) => candidateSkills.some((candidateSkill) => candidateSkill.toLowerCase().includes(skill.toLowerCase())));
                if (!hasMatchingSkill) {
                    console.log(`[processCandidate] 候选人 ${candidateName} 技能不符合筛选条件，跳过`);
                    return false; // 不符合，直接返回，不打开详情
                }
                console.log(`[processCandidate] 候选人 ${candidateName} 技能符合筛选条件`);
            }
            highlightCard(card);
            console.log(`[processCandidate] 已高亮 ${candidateName} 卡片`);
            const delayTime = config.operationInterval * 1000 || 1000;
            console.log(`[processCandidate] 添加 ${delayTime}ms 延时...`);
            yield randomDelay(delayTime);
            // 2. 点击查看简历详情
            console.log(`[processCandidate] 尝试点击查看 ${candidateName} 简历详情...`);
            let viewSuccess = yield clickViewButton(card);
            if (!viewSuccess) {
                console.log(`[processCandidate] 无法打开 ${candidateName} 简历详情，跳过`);
                return false; // 打开失败，无法继续
            }
            shouldClosePopup = true; // 成功打开，标记需要关闭
            console.log(`[processCandidate] 成功打开 ${candidateName} 简历详情`);
            // 3. 等待弹窗加载并提取内容
            console.log('[processCandidate] 等待弹窗加载 (1500ms)...');
            yield sleep(1500);
            console.log('[processCandidate] 开始提取简历详情文本...');
            let resumeDetails = yield extractResumeDetails(); // 注意这里返回的是包含 text 的对象
            // 重试逻辑
            let retryCount = 0;
            const maxRetries = 3;
            while (!resumeDetails && retryCount < maxRetries) {
                retryCount++;
                console.log(`[processCandidate] 提取简历失败，第 ${retryCount} 次重试...`);
                yield sleep(1000 + retryCount * 500); // 增加重试等待时间
                resumeDetails = yield extractResumeDetails();
            }
            if (!resumeDetails || !resumeDetails.text) { // 确保 resumeDetails 和 text 都存在
                console.error('[processCandidate] 多次尝试后仍无法提取简历信息，跳过 LLM 分析');
                yield closeResumeDetail(); // 尝试关闭弹窗
                return false;
            }
            // 直接使用从卡片中提取的候选人姓名，不依赖简历详情中提取的姓名
            if (candidateName) {
                console.log(`[processCandidate] 使用卡片中的姓名: ${candidateName}`);
                resumeDetails.name = candidateName;
                // 替换简历文本中的姓名行
                resumeDetails.text = resumeDetails.text.replace(/姓名：.*?\n/, `姓名：${candidateName}\n`);
            }
            else if (!resumeDetails.name || resumeDetails.name.includes('工程师') || resumeDetails.name.includes('开发') || resumeDetails.name === '未知') {
                // 如果姓名中包含"工程师"或"开发"等职位相关词汇，很可能是职位被误识别为姓名
                console.log('[processCandidate] 简历详情中可能将职位误识别为姓名，将使用"未知"替代');
                resumeDetails.name = '未知候选人';
                resumeDetails.text = resumeDetails.text.replace(/姓名：.*?\n/, `姓名：未知候选人\n`);
            }
            console.log('[processCandidate] 成功提取简历详情文本:', resumeDetails.text.substring(0, 100) + '...');
            // 4. LLM 分析简历
            console.log('[processCandidate] 开始 LLM 分析...');
            const analysis = yield (0, llm_1.analyzeResumeWithLLM)(resumeDetails.text); // 确保传递的是 text 字段
            console.log('[processCandidate] LLM 分析完成');
            (0, ui_1.updateAnalysisResult)(analysis);
            // 5. 根据分析结果决定是否打招呼
            let greetAttempted = false;
            if ((0, llm_1.shouldContactCandidate)(analysis)) {
                console.log(`[processCandidate] LLM 推荐与 ${candidateName} 沟通，尝试点击打招呼...`);
                greetAttempted = yield clickGreetButtonOnCard(card);
                if (greetAttempted) {
                    console.log(`[processCandidate] 已成功在卡片上点击 ${candidateName} 的打招呼按钮`);
                    // 等待按钮变成继续沟通
                    yield sleep(2000);
                    // 再次点击继续沟通按钮
                    const continueButton = card.querySelector('.btn-continue, button.btn-continue, .button-chat-wrap button.btn-continue');
                    if (continueButton) {
                        continueButton.click();
                        console.log(`[processCandidate] 已点击继续沟通按钮`);
                        // 等待聊天窗口加载
                        yield sleep(2000);
                        // 查找聊天输入框
                        const chatInput = document.querySelector('#boss-chat-global-input');
                        if (chatInput) {
                            // 设置AI建议的内容
                            chatInput.textContent = analysis.openingMessage;
                            // 触发input事件
                            chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                            // 等待一下确保内容设置成功
                            yield sleep(500);
                            // 查找发送按钮并点击
                            const sendButton = document.querySelector('.btn-send:not(.btn-disabled)');
                            if (sendButton) {
                                sendButton.click();
                                console.log('[processCandidate] 已发送AI建议的沟通内容');
                                // 等待消息发送
                                yield sleep(1000);
                                // 查找并点击关闭按钮
                                const closeButton = document.querySelector('.iboss-close');
                                if (closeButton) {
                                    closeButton.click();
                                    console.log('[processCandidate] 已关闭聊天窗口');
                                }
                            }
                        }
                    }
                    else {
                        console.warn(`[processCandidate] 未找到继续沟通按钮`);
                    }
                }
                else {
                    console.warn(`[processCandidate] 未能在卡片上找到 ${candidateName} 的打招呼/沟通按钮`);
                }
            }
            else {
                console.log(`[processCandidate] LLM 不推荐与 ${candidateName} 沟通`);
            }
            // 6. 关闭简历详情弹窗
            console.log('[processCandidate] 准备关闭简历详情弹窗...');
            yield closeResumeDetail();
            shouldClosePopup = false; // 标记已关闭
            return greetAttempted; // 返回是否尝试了打招呼
        }
        catch (error) {
            console.error('[processCandidate] 处理候选人时发生严重错误:', error);
            if (shouldClosePopup) {
                console.log('[processCandidate] 发生错误，尝试关闭可能打开的弹窗...');
                yield closeResumeDetail(); // 确保异常时也尝试关闭
            }
            return false; // 出错则认为未成功处理
        }
    });
}
/**
 * 在候选人卡片元素上查找并点击打招呼或继续沟通按钮
 * @param card 候选人卡片 HTMLElement
 * @returns 是否成功点击了按钮
 */
function clickGreetButtonOnCard(card) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('[clickGreetButtonOnCard] 开始在卡片上查找打招呼/沟通按钮...');
        const buttonSelectors = [
            'button.btn-greet',
            '.button-chat button',
            'button.btn-sure-v2',
            'button[class*="greet"]',
            '.button-chat-wrap button.btn-continue',
            '.button-chat-wrap button',
            'button.chat-btn',
            'button.btn-continue',
            '.btn-continue',
            '.button-list button',
            '[class*="button-chat"] button'
        ];
        let targetButton = null;
        for (const selector of buttonSelectors) {
            targetButton = card.querySelector(selector);
            if (targetButton) {
                console.log(`[clickGreetButtonOnCard] 找到按钮 (${selector})`);
                break;
            }
        }
        if (targetButton) {
            console.log('[clickGreetButtonOnCard] 点击按钮...');
            targetButton.click();
            yield sleep(500); // 短暂等待确保点击生效
            console.log('[clickGreetButtonOnCard] 已点击按钮');
            return true;
        }
        else {
            console.warn('[clickGreetButtonOnCard] 在卡片上未找到任何打招呼或继续沟通按钮');
            return false;
        }
    });
}
/**
 * 滚动页面以加载更多候选人卡片
 * @returns 是否成功加载更多卡片
 */
function scrollToLoadMore() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('滚动页面以加载更多候选人');
        // 获取iframe文档
        const iframeDoc = getIframeDocument();
        const doc = iframeDoc || document;
        // 记录滚动前的卡片数量
        const beforeCount = findCandidateCards().length;
        // 找到候选人列表容器
        const container = doc.querySelector('.candidate-list-content, [class*="list-content"], .recommend-list-content');
        if (container) {
            // 滚动到容器底部
            container.scrollTop = container.scrollHeight;
            console.log('已滚动到列表底部');
        }
        else {
            // 如果找不到特定容器，则滚动整个文档
            doc.documentElement.scrollTop = doc.documentElement.scrollHeight;
            console.log('已滚动到页面底部');
        }
        // 等待新内容加载
        yield sleep(2000);
        // 检查是否加载了新卡片
        const afterCount = findCandidateCards().length;
        return afterCount > beforeCount;
    });
}
/**
 * 自动处理所有候选人 (顺序处理当前页，处理完滚动加载)
 * @param maxCount 最大处理数量，默认为10，设为0表示处理所有
 */
function autoProcessCandidates() {
    return __awaiter(this, arguments, void 0, function* (maxCount = 10) {
        (0, ui_1.setRunningStatus)(true);
        (0, ui_1.clearAnalysisResult)();
        let totalProcessedCount = 0;
        let totalSuccessCount = 0;
        const totalToProcess = maxCount > 0 ? maxCount : Number.MAX_SAFE_INTEGER;
        console.log(`[autoProcessCandidates] 计划处理最多 ${totalToProcess === Number.MAX_SAFE_INTEGER ? '全部' : totalToProcess} 位候选人`);
        // 跟踪已处理过的卡片，避免重复处理
        const processedCards = new Set();
        let noMoreCards = false;
        while (totalProcessedCount < totalToProcess && (0, ui_1.getRunningStatus)() && !noMoreCards) {
            console.log(`[autoProcessCandidates] --- 开始新一轮处理 (已处理 ${totalProcessedCount} / ${totalToProcess}) ---`);
            // 获取未处理的卡片
            let cardsToProcess = findCandidateCards(processedCards);
            console.log(`[autoProcessCandidates] 找到 ${cardsToProcess.length} 个未处理的卡片`);
            if (cardsToProcess.length === 0) {
                console.log('[autoProcessCandidates] 页面无未处理卡片，尝试滚动...');
                // 尝试滚动加载
                const loadedMore = yield scrollToLoadMore();
                if (!loadedMore) {
                    console.log('[autoProcessCandidates] 无法加载更多卡片，停止处理');
                    noMoreCards = true;
                    continue; // 结束外层while循环
                }
                // 滚动后重新获取卡片
                cardsToProcess = findCandidateCards(processedCards);
                console.log(`[autoProcessCandidates] 滚动后找到 ${cardsToProcess.length} 个未处理卡片`);
                if (cardsToProcess.length === 0) {
                    console.log('[autoProcessCandidates] 滚动后仍无未处理卡片，停止处理');
                    noMoreCards = true;
                    continue; // 结束外层while循环
                }
            }
            // 获取当前批次要处理的卡片数量（不超过剩余总数）
            const remainingToProcess = totalToProcess - totalProcessedCount;
            const batchSize = Math.min(cardsToProcess.length, remainingToProcess);
            console.log(`[autoProcessCandidates] 本轮将处理 ${batchSize} 个卡片`);
            // 顺序处理卡片 - 按照DOM中的顺序
            for (let i = 0; i < batchSize && (0, ui_1.getRunningStatus)(); i++) {
                const card = cardsToProcess[i];
                // 标记卡片为处理中
                card.setAttribute('data-processing', 'true');
                console.log(`[autoProcessCandidates] 处理第 ${i + 1} / ${batchSize} 个卡片 (总计 ${totalProcessedCount + 1})`);
                try {
                    // 确保只处理未处理过的卡片
                    if (!processedCards.has(card)) {
                        const success = yield processCandidate(card);
                        // 将卡片加入已处理集合
                        processedCards.add(card);
                        if (success) {
                            totalSuccessCount++;
                            console.log(`[autoProcessCandidates] 候选人处理成功 (总成功 ${totalSuccessCount})`);
                        }
                        else {
                            console.log('[autoProcessCandidates] 候选人处理未通过或失败');
                        }
                        totalProcessedCount++;
                    }
                    else {
                        console.log('[autoProcessCandidates] 跳过已处理的卡片');
                    }
                }
                catch (error) {
                    console.error('[autoProcessCandidates] 处理候选人时发生严重错误:', error);
                    // 出错也标记为已处理，避免死循环
                    processedCards.add(card);
                    totalProcessedCount++;
                }
                finally {
                    // 移除处理中标记
                    card.removeAttribute('data-processing');
                }
                // 添加短暂延时，确保页面响应和界面更新
                yield sleep(1000);
                // 检查是否达到处理上限
                if (totalProcessedCount >= totalToProcess) {
                    break;
                }
            }
            // 如果还没达到总目标，尝试滚动加载更多卡片
            if (totalProcessedCount < totalToProcess && (0, ui_1.getRunningStatus)()) {
                const visibleCardsCount = findCandidateCards(processedCards).length;
                if (visibleCardsCount === 0) {
                    console.log('[autoProcessCandidates] 当前页面所有卡片已处理，尝试滚动加载下一页...');
                    const loadedMore = yield scrollToLoadMore();
                    if (!loadedMore) {
                        console.log('[autoProcessCandidates] 无法加载更多卡片，停止处理');
                        noMoreCards = true;
                    }
                }
                else {
                    console.log(`[autoProcessCandidates] 当前页面还有 ${visibleCardsCount} 个未处理卡片，继续处理`);
                }
            }
        }
        // 处理完成
        (0, ui_1.setRunningStatus)(false);
        alert(`自动操作完成\n总共尝试处理了 ${totalProcessedCount} 位候选人\n其中 ${totalSuccessCount} 位符合条件并已点击打招呼`);
        console.log(`[autoProcessCandidates] 自动操作完成。尝试处理: ${totalProcessedCount}, 成功打招呼: ${totalSuccessCount}`);
    });
}
/**
 * 初始化自动处理功能
 */
function initAutoProcess() {
    // 监听开始自动处理事件
    document.addEventListener('boss-assistant:start', ((event) => {
        var _a;
        // 从事件中获取最大处理数量，默认为10
        const customEvent = event;
        const maxCount = ((_a = customEvent.detail) === null || _a === void 0 ? void 0 : _a.maxCount) || 10;
        autoProcessCandidates(maxCount);
    }));
    // 监听停止自动处理事件
    document.addEventListener('boss-assistant:stop', () => {
        (0, ui_1.setRunningStatus)(false);
    });
}
/**
 * 浏览候选人简历，自动点击多个候选人卡片
 * @param count 要浏览的候选人数量
 */
function browse(count) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`开始浏览 ${count} 个候选人简历`);
            // 获取iframe文档对象
            const iframeDoc = getIframeDocument();
            if (!iframeDoc) {
                console.error('未找到iframe文档，无法浏览候选人');
                return;
            }
            // 查找所有候选人卡片
            const cards = iframeDoc.querySelectorAll('.card-inner[data-geek], .card-inner[data-geekid], [data-geekid], .recommend-card-wrap');
            console.log(`找到 ${cards.length} 个候选人卡片`);
            if (cards.length === 0) {
                console.error('未找到候选人卡片，无法浏览');
                return;
            }
            // 确定实际浏览数量（不超过卡片总数）
            const browseCount = Math.min(count, cards.length);
            console.log(`将浏览 ${browseCount} 个候选人简历`);
            for (let i = 0; i < browseCount; i++) {
                console.log(`开始浏览第 ${i + 1} 个候选人简历`);
                // 点击当前索引的候选人卡片查看按钮
                const viewSuccess = yield clickViewButton(cards[i]);
                if (viewSuccess) {
                    console.log(`成功打开第 ${i + 1} 个候选人简历`);
                    // 提取简历详情
                    const resumeDetails = yield extractResumeDetails();
                    const resumeText = (resumeDetails === null || resumeDetails === void 0 ? void 0 : resumeDetails.text) || '';
                    console.log(`简历内容长度: ${resumeText.length} 字符`);
                    // 自动点击打招呼按钮（如果设置了自动打招呼）
                    if (config.autoGreet) {
                        console.log('尝试点击打招呼按钮');
                        // 关闭简历详情，回到列表页面
                        yield closeResumeDetail();
                        yield sleep(800);
                        // 查找打招呼或继续沟通按钮
                        const greetButtonSelectors = [
                            'button.btn-greet',
                            '.button-chat button',
                            'button.btn-sure-v2',
                            'button[class*="greet"]',
                            '.button-chat-wrap button.btn-continue',
                            '.button-chat-wrap button',
                            'button.chat-btn',
                            'button.btn-continue',
                            '.btn-continue',
                            '.button-list button',
                            '[class*="button-chat"] button'
                        ];
                        let greetButton = null;
                        for (const selector of greetButtonSelectors) {
                            greetButton = cards[i].querySelector(selector);
                            if (greetButton) {
                                console.log(`找到打招呼按钮 (${selector})，点击...`);
                                break;
                            }
                        }
                        if (greetButton) {
                            console.log('开始点击打招呼按钮...');
                            greetButton.click();
                            console.log('已点击打招呼按钮，系统会自动发送问候消息');
                            // 简单等待一下确保按钮点击成功
                            yield sleep(500);
                            console.log('成功点击打招呼按钮');
                        }
                        else {
                            console.log('未找到打招呼按钮，尝试寻找继续沟通按钮');
                            // 尝试找到"继续沟通"按钮
                            const continueButtonSelectors = [
                                '.btn-continue',
                                'button.btn-continue',
                                '.button-chat-wrap button.btn-continue',
                                '.button-list .btn-continue-wrap button',
                                '[class*="button-chat"] button.btn-continue'
                            ];
                            let continueButton = null;
                            for (const selector of continueButtonSelectors) {
                                continueButton = cards[i].querySelector(selector);
                                if (continueButton) {
                                    console.log(`找到继续沟通按钮 (${selector})，点击...`);
                                    break;
                                }
                            }
                            if (continueButton) {
                                console.log('开始点击继续沟通按钮...');
                                continueButton.click();
                                console.log('已点击继续沟通按钮，系统会自动发送问候消息');
                                // 简单等待一下确保按钮点击成功
                                yield sleep(500);
                                console.log('成功点击继续沟通按钮');
                            }
                            else {
                                console.log('未找到任何沟通按钮，跳过打招呼');
                            }
                        }
                    }
                    else {
                        // 关闭简历详情，返回到列表页
                        console.log('关闭简历详情...');
                        yield closeResumeDetail();
                    }
                }
                else {
                    console.log(`无法打开第 ${i + 1} 个候选人简历，跳过`);
                }
                // 在浏览下一个简历前等待
                yield sleep(2000);
            }
            console.log(`已完成 ${browseCount} 个候选人简历的浏览`);
        }
        catch (error) {
            console.error('浏览候选人简历过程中发生错误', error);
        }
    });
}
/**
 * 自动向候选人点击打招呼按钮
 */
function autoGreet() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('开始自动点击打招呼按钮...');
            // 等待加载
            yield sleep(1000);
            // 查找打招呼或继续沟通按钮
            const greetButtonSelectors = [
                'button.btn-greet',
                '.button-chat button',
                'button.btn-sure-v2',
                'button[class*="greet"]',
                '.button-chat-wrap button.btn-continue',
                '.button-chat-wrap button',
                'button.chat-btn',
                'button.btn-continue',
                '.btn-continue',
                '.button-list button',
                '[class*="button-chat"] button'
            ];
            const doc = getIframeDocument() || document;
            let greetButton = null;
            for (const selector of greetButtonSelectors) {
                greetButton = doc.querySelector(selector);
                if (greetButton) {
                    console.log(`找到打招呼按钮 (${selector})，点击...`);
                    break;
                }
            }
            if (greetButton) {
                console.log('开始点击打招呼按钮...');
                greetButton.click();
                console.log('已点击打招呼按钮，系统会自动发送问候消息');
                // 简单等待一下确保按钮点击成功
                yield sleep(500);
                console.log('成功点击打招呼按钮');
                return true;
            }
            else {
                console.log('未找到打招呼按钮，尝试寻找继续沟通按钮');
                // 尝试找到"继续沟通"按钮
                const continueButtonSelectors = [
                    '.btn-continue',
                    'button.btn-continue',
                    '.button-chat-wrap button.btn-continue',
                    '.button-list .btn-continue-wrap button',
                    '[class*="button-chat"] button.btn-continue'
                ];
                let continueButton = null;
                for (const selector of continueButtonSelectors) {
                    continueButton = doc.querySelector(selector);
                    if (continueButton) {
                        console.log(`找到继续沟通按钮 (${selector})，点击...`);
                        break;
                    }
                }
                if (continueButton) {
                    console.log('开始点击继续沟通按钮...');
                    continueButton.click();
                    console.log('已点击继续沟通按钮，系统会自动发送问候消息');
                    // 简单等待一下确保按钮点击成功
                    yield sleep(500);
                    console.log('成功点击继续沟通按钮');
                    return true;
                }
                else {
                    console.log('未找到任何沟通按钮，无法自动打招呼');
                    return false;
                }
            }
        }
        catch (error) {
            console.error('自动点击打招呼按钮过程中发生错误:', error);
            return false;
        }
    });
}
// 处理简历和建议回复
function handleResumeAndSuggestReplies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 提取简历信息
            const resumeInfo = yield extractResumeDetails();
            if (!resumeInfo) {
                console.log('无法提取简历信息');
                return;
            }
            // 根据简历信息生成回复建议
            console.log('根据简历生成回复建议');
            // 这里可以添加生成回复建议的逻辑
            // 例如根据技能、经验等生成相关的问候语
            // 将建议回复显示在界面上
            // ... 实现显示建议回复的代码
        }
        catch (error) {
            console.error('处理简历和生成回复建议时发生错误:', error);
        }
    });
}
/**
 * 发送消息
 * @param message 要发送的消息内容
 * @returns 是否发送成功
 */
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 获取文档对象（主文档或iframe）
            const iframeDoc = getIframeDocument();
            const doc = iframeDoc || document;
            // 查找聊天输入框
            const inputElement = doc.querySelector('textarea[placeholder*="发送"], textarea.chat-input, [contenteditable="true"][class*="input"]');
            if (!inputElement) {
                console.error('未找到聊天输入框');
                return false;
            }
            // 根据元素类型设置消息内容
            if (inputElement instanceof HTMLTextAreaElement) {
                inputElement.value = message;
                // 触发input事件
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
            else if (inputElement.getAttribute('contenteditable') === 'true') {
                inputElement.textContent = message;
                // 触发input事件
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
            else {
                console.error('无法识别的输入元素类型');
                return false;
            }
            // 等待输入完成
            yield sleep(500);
            // 查找发送按钮
            const sendButton = doc.querySelector('button[class*="send"], .send-btn, button.chat-btn');
            if (!sendButton) {
                console.error('未找到发送按钮');
                return false;
            }
            // 点击发送按钮
            sendButton.click();
            // 等待发送完成
            yield sleep(500);
            console.log('消息发送成功');
            return true;
        }
        catch (error) {
            console.error('发送消息时发生错误', error);
            return false;
        }
    });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

// ==UserScript==
// @name         BOSS直聘智能助手
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  自动筛选简历、分析简历并智能打招呼的BOSS直聘助手
// @author       Your Name
// @match        https://www.zhipin.com/*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        none
// @connect      api.openai.com
// @connect      *
// @license      MIT
// ==/UserScript==
__webpack_unused_export__ = ({ value: true });
const ui_1 = __webpack_require__(60);
const auto_1 = __webpack_require__(357);
// 直接执行代码，不等待window.load事件
console.log('BOSS直聘智能助手脚本已加载');
// 定义一个全局变量表示脚本是否已初始化
let scriptInitialized = false;
/**
 * 主入口函数
 */
function main() {
    // 避免重复初始化
    if (scriptInitialized) {
        console.log('脚本已初始化，跳过重复执行');
        return;
    }
    scriptInitialized = true;
    console.log('BOSS直聘智能助手初始化...');
    console.log('当前URL:', window.location.href);
    console.log('文档准备状态:', document.readyState);
    // 判断是否为候选人列表页
    if (isRecommendPage()) {
        console.log('检测到推荐候选人页面，准备加载控制面板');
        try {
            // 创建控制面板
            (0, ui_1.createControlPanel)();
            // 初始化自动处理功能
            (0, auto_1.initAutoProcess)();
            console.log('BOSS直聘智能助手已启动');
        }
        catch (error) {
            console.error('BOSS直聘智能助手启动失败:', error);
        }
    }
    else {
        console.log('当前页面不是推荐候选人页面，不加载控制面板');
    }
}
/**
 * 判断当前页面是否为推荐候选人页面
 * @returns 是否为推荐页面
 */
function isRecommendPage() {
    const url = window.location.href;
    console.log('检查URL是否为推荐页面:', url);
    // 检查多种可能的URL模式
    return (url.includes('web/chat/recommend') ||
        url.includes('web/boss/recommend') ||
        url.includes('web/geek/recommend') ||
        url.includes('boss/recommend') ||
        url.includes('geek/recommend') ||
        url.includes('brc/') ||
        url.includes('bossguide/') ||
        url.includes('bosspage/') ||
        url.includes('bpc_geek_rcmd') ||
        // 检查DOM中是否有候选人列表相关元素
        !!document.querySelector('.candidate-recommend, .candidate-list, .recommend-list, .card-list, .card-inner'));
}
// 尝试多种方式启动脚本
// 1. 当DOM内容加载完成时执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
}
else {
    // 如果DOM已经加载完成，立即执行
    main();
}
// 2. 当页面完全加载完成时执行（包括图片等资源）
window.addEventListener('load', main);
// 3. 定时检查页面，处理SPA应用
setTimeout(main, 1000);
setTimeout(main, 3000);
// 监听URL变化
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
    if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        console.log('URL已变化，重新检查页面:', lastUrl);
        setTimeout(main, 1000);
    }
});
observer.observe(document, { subtree: true, childList: true });
// 暴露给油猴使用
(function () {
    'use strict';
    // 这里不需要额外代码，因为上面已经注册了各种事件
})();

})();

/******/ })()
;