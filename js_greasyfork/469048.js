// ==UserScript==
// @name         亚马逊评论计算优化版(Enhanced Amazon Review Calculator)
// @namespace    https://github.com/monty8800/amazon-seller-tools
// @version      3.8
// @description  精确计算各星级评价数量及提升评分所需五星好评数，支持全球亚马逊站点
// @author       Monty & Assistant
// @match        *://*.amazon.com/*dp/*
// @match        *://*.amazon.co.uk/*dp/*
// @match        *://*.amazon.de/*dp/*
// @match        *://*.amazon.fr/*dp/*
// @match        *://*.amazon.it/*dp/*
// @match        *://*.amazon.es/*dp/*
// @match        *://*.amazon.co.jp/*dp/*
// @match        *://*.amazon.ca/*dp/*
// @match        *://*.amazon.com.au/*dp/*
// @match        *://*.amazon.in/*dp/*
// @match        *://*.amazon.com.mx/*dp/*
// @match        *://*.amazon.com.br/*dp/*
// @match        *://*.amazon.nl/*dp/*
// @match        *://*.amazon.cn/*dp/*
// @match        *://*.amazon.sg/*dp/*
// @match        *://*.amazon.ae/*dp/*
// @match        *://*.amazon.sa/*dp/*
// @match        *://*.amzn.*/*dp/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://cdn.tailwindcss.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469048/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%AF%84%E8%AE%BA%E8%AE%A1%E7%AE%97%E4%BC%98%E5%8C%96%E7%89%88%28Enhanced%20Amazon%20Review%20Calculator%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469048/%E4%BA%9A%E9%A9%AC%E9%80%8A%E8%AF%84%E8%AE%BA%E8%AE%A1%E7%AE%97%E4%BC%98%E5%8C%96%E7%89%88%28Enhanced%20Amazon%20Review%20Calculator%29.meta.js
// ==/UserScript==

// 添加现代化的CSS样式
GM_addStyle(`
  /* 基础字体设置 */
  .monty-tw {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  
  /* 容器样式 */
  .monty-review-box {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    background-color: white;
    padding: 1rem;
    margin: 1rem 0;
    transition: all 0.3s ease;
  }
  
  /* 标题样式 */
  .monty-review-title {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  /* 折叠/展开按钮 */
  .monty-toggle-btn {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .monty-toggle-btn:hover {
    color: #4b5563;
    background-color: #f3f4f6;
  }
  
  /* 折叠状态样式 */
  .monty-collapsed .monty-detail-section {
    display: none;
  }
  
  .monty-collapsed .monty-summary-section {
    margin-bottom: 0;
  }
  
  /* 目标分数输入框 */
  #monty-target-score {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    width: 4rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
  }
  
  #monty-target-score:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  /* 评论项目样式 */
  .monty-review-item {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 0.375rem 0;
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  /* 高亮文本 */
  .monty-highlight {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-weight: 500;
    color: #2563eb;
  }
  
  /* 语言选择器 */
  .monty-lang-selector {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    background-color: white;
    cursor: pointer;
  }
  
  .monty-lang-selector:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  .monty-lang-selector:hover {
    border-color: #9ca3af;
  }
  
  /* 星级评分样式 */
  .monty-star {
    color: #f59e0b;
  }
  
  /* 分隔线 */
  .monty-divider {
    margin: 0.5rem 0;
    border-top: 1px solid #e5e7eb;
  }
  
  /* 底部版权信息 */
  .monty-footer {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    text-align: right;
    border-top: 1px solid #e5e7eb;
  }
  
  /* 按钮样式 */
  .monty-button {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
    background-color: #2563eb;
    border-radius: 0.25rem;
  }
  
  .monty-button:hover {
    background-color: #1d4ed8;
  }
  
  .monty-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  
  /* 评分条 */
  .monty-rating-bar {
    display: flex;
    align-items: center;
    margin: 0.25rem 0;
  }
  
  .monty-rating-stars {
    width: 4rem;
    flex-shrink: 0;
  }
  
  .monty-rating-meter {
    flex-grow: 1;
    height: 0.5rem;
    background-color: #e5e7eb;
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .monty-rating-meter-fill {
    height: 100%;
    background-color: #f59e0b;
  }
  
  .monty-rating-count {
    margin-left: 0.5rem;
    font-size: 0.75rem;
    color: #4b5563;
    width: 5rem;
    text-align: right;
  }
  
  /* 布局辅助类 */
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .space-x-3 > * + * {
    margin-left: 0.75rem;
  }
  
  .mr-2 {
    margin-right: 0.5rem;
  }
  
  .mb-3 {
    margin-bottom: 0.75rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
  
  .text-gray-500 {
    color: #6b7280;
  }
  
  .text-gray-600 {
    color: #4b5563;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .bg-blue-50 {
    background-color: #eff6ff;
  }
  
  .bg-red-50 {
    background-color: #fef2f2;
  }
  
  .rounded {
    border-radius: 0.25rem;
  }
  
  .border-l-4 {
    border-left-width: 4px;
  }
  
  .border-blue-400 {
    border-color: #60a5fa;
  }
  
  .border-red-400 {
    border-color: #f87171;
  }
  
  .my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`);

(function() {
    'use strict';

    const DEFAULT_TARGET_SCORE = 4.3;
    const DEBUG_MODE = true; // 生产环境中关闭调试模式
    
    // 获取用户设置的目标分数
    function getTargetScore() {
        const savedScore = GM_getValue('target_score', DEFAULT_TARGET_SCORE);
        // 确保分数在1-5之间
        return Math.min(5, Math.max(1, parseFloat(savedScore)));
    }
    
    // 设置用户目标分数
    function setTargetScore(score) {
        const validScore = Math.min(5, Math.max(1, parseFloat(score)));
        log('设置目标分数:', validScore);
        GM_setValue('target_score', validScore);
        return validScore;
    }
    
    // 日志输出函数
    function log(...args) {
        if (DEBUG_MODE) {
            console.log('[Review Calculator]', ...args);
        }
    }
    
    // 等待元素出现在页面上
    async function waitForElement(selector, timeout = 10000) {
        log(`等待元素出现: ${selector}`);
        const startTime = Date.now();
        
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) {
                log(`找到元素: ${selector}`);
                return element;
            }
            
            // 等待100ms再检查
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        log(`等待元素超时: ${selector}`);
        return null;
    }

    // 获取用户语言偏好
    function getUserLanguage() {
        // 获取用户保存的语言偏好，默认为中文
        const savedLanguage = GM_getValue('user_language', 'zh');
        log('用户语言偏好:', savedLanguage);
        return savedLanguage;
    }
    
    // 设置用户语言偏好
    function setUserLanguage(language) {
        log('设置用户语言偏好:', language);
        GM_setValue('user_language', language);
    }
    
    // 获取本地化文本
    function getLocalizedText() {
        // 优先使用用户选择的语言
        const userLanguage = getUserLanguage();
        log('获取本地化文本, 用户语言:', userLanguage);
        
        // 如果没有用户选择的语言或者设置为自动，则根据域名自动检测
        if (!userLanguage || userLanguage === 'auto') {
            const domain = window.location.hostname;
            log('当前域名:', domain);
            
            // 根据域名确定语言
            let detectedLanguage = 'en'; // 默认英语
            
            if (domain.includes('.fr')) detectedLanguage = 'fr';
            else if (domain.includes('.de')) detectedLanguage = 'de';
            else if (domain.includes('.it')) detectedLanguage = 'it';
            else if (domain.includes('.es')) detectedLanguage = 'es';
            else if (domain.includes('.co.jp') || domain.includes('.jp')) detectedLanguage = 'jp';
            else if (domain.includes('.cn')) detectedLanguage = 'zh';
            else if (domain.includes('.nl')) detectedLanguage = 'nl';
            else if (domain.includes('.com.br')) detectedLanguage = 'pt-br';
            else if (domain.includes('.com.mx')) detectedLanguage = 'es-mx';
            else if (domain.includes('.in')) detectedLanguage = 'en-in';
            else if (domain.includes('.ca')) detectedLanguage = domain.includes('/fr/') ? 'fr-ca' : 'en-ca';
            
            log('检测到语言:', detectedLanguage);
            return getLocalizedTextByLanguage(detectedLanguage);
        }
        
        // 如果用户选择了日语，但实际使用的是'ja'，而我们的代码中使用的是'jp'
        if (userLanguage === 'ja') {
            log('将日语代码从 ja 转换为 jp');
            return getLocalizedTextByLanguage('jp');
        }
        
        return getLocalizedTextByLanguage(userLanguage);
    }
    
    // 根据指定语言获取本地化文本
    function getLocalizedTextByLanguage(language) {
        log('使用语言:', language);
        
        // 各种语言的本地化文本
        const localizedTexts = {
            // 评论数文本
            ratingsText: {
                'en': 'ratings',
                'fr': 'évaluations',
                'de': 'Bewertungen',
                'it': 'recensioni',
                'es': 'valoraciones',
                'es-mx': 'calificaciones',
                'jp': '件の評価',
                'zh': '条评论',
                'nl': 'beoordelingen',
                'pt-br': 'avaliações',
                'en-in': 'ratings',
                'en-ca': 'ratings',
                'fr-ca': 'évaluations'
            },
            
            // 星级文本 (用于匹配评分文本)
            starText: {
                'en': 'out of 5 stars',
                'fr': 'sur 5 étoiles',
                'de': 'von 5 Sternen',
                'it': 'su 5 stelle',
                'es': 'de 5 estrellas',
                'es-mx': 'de 5 estrellas',
                'jp': '5つ星のうち',
                'zh': '5 星，最多 5 星',
                'nl': 'van de 5 sterren',
                'pt-br': 'de 5 estrelas',
                'en-in': 'out of 5 stars',
                'en-ca': 'out of 5 stars',
                'fr-ca': 'sur 5 étoiles'
            },
            
            // 结果面板文本
            resultText: {
                'en': {
                    title: 'Review Analysis',
                    currentScore: 'Current Rating:',
                    required: 'Need additional',
                    fiveStarReviews: '5-star reviews',
                    toReach: 'to reach',
                    noNeed: 'Current rating already exceeds',
                    noNeedSuffix: ', no additional reviews needed',
                    error: 'Review Analysis Error',
                    errorHelp: 'Please refresh the page or contact the developer for help',
                    targetScore: 'Target Score',
                    star: 'stars',
                    requiredReviews: 'Required 5-star reviews:',
                    alreadyAchieved: 'Target score already achieved',
                    impossibleTarget: 'Cannot reach this target score',
                    toggleView: 'Toggle view'
                },
                'fr': {
                    title: 'Analyse des avis',
                    currentScore: 'Note actuelle:',
                    required: 'Besoin de',
                    fiveStarReviews: 'avis 5 étoiles supplémentaires',
                    toReach: 'pour atteindre',
                    noNeed: 'La note actuelle dépasse déjà',
                    noNeedSuffix: ', aucun avis supplémentaire nécessaire',
                    error: 'Erreur d\'analyse',
                    errorHelp: 'Veuillez rafraîchir la page ou contacter le développeur pour obtenir de l\'aide',
                    targetScore: 'Score cible',
                    star: 'étoiles',
                    requiredReviews: 'Avis 5 étoiles nécessaires:',
                    alreadyAchieved: 'Score cible déjà atteint',
                    impossibleTarget: 'Impossible d\'atteindre ce score cible',
                    toggleView: 'Afficher/masquer'
                },
                'de': {
                    title: 'Bewertungsanalyse',
                    currentScore: 'Aktuelle Bewertung:',
                    required: 'Benötigt zusätzlich',
                    fiveStarReviews: '5-Sterne-Bewertungen',
                    toReach: 'um zu erreichen',
                    noNeed: 'Aktuelle Bewertung überschreitet bereits',
                    noNeedSuffix: ', keine zusätzlichen Bewertungen erforderlich',
                    error: 'Analysefehler',
                    errorHelp: 'Bitte aktualisieren Sie die Seite oder kontaktieren Sie den Entwickler für Hilfe',
                    targetScore: 'Zielbewertung',
                    star: 'Sterne',
                    requiredReviews: 'Benötigte 5-Sterne-Bewertungen:',
                    alreadyAchieved: 'Zielbewertung bereits erreicht',
                    impossibleTarget: 'Dieses Zielbewertung kann nicht erreicht werden',
                    toggleView: 'Ein-/Ausblenden'
                },
                'zh': {
                    title: '评论分析结果',
                    currentScore: '当前评分:',
                    required: '需要额外',
                    fiveStarReviews: '个五星好评',
                    toReach: '才能达到',
                    noNeed: '当前评分已达到',
                    noNeedSuffix: '分，无需额外好评',
                    error: '评论分析出错',
                    errorHelp: '请刷新页面或联系开发者获取帮助',
                    targetScore: '目标分数',
                    star: '星',
                    requiredReviews: '需要的五星好评数:',
                    alreadyAchieved: '已达到目标分数，无需额外好评',
                    impossibleTarget: '无法达到该目标分数',
                    toggleView: '展开/折叠视图'
                },
                'jp': {
                    title: 'レビュー分析',
                    currentScore: '現在の評価:',
                    required: 'あと',
                    fiveStarReviews: '件の5つ星レビューが必要',
                    toReach: '目標の',
                    noNeed: '現在の評価は既に',
                    noNeedSuffix: 'を超えています。追加レビュー不要',
                    error: '分析エラー',
                    errorHelp: 'ページを更新するか、開発者にお問い合わせください',
                    targetScore: '目標スコア',
                    star: '星',
                    requiredReviews: '必要な5つ星レビュー:',
                    alreadyAchieved: '目標スコアは既に達成されています',
                    impossibleTarget: 'この目標スコアには到達できません',
                    toggleView: '表示切替'
                },
                'ja': {
                    title: 'レビュー分析',
                    currentScore: '現在の評価:',
                    required: 'あと',
                    fiveStarReviews: '件の5つ星レビューが必要',
                    toReach: '目標の',
                    noNeed: '現在の評価は既に',
                    noNeedSuffix: 'を超えています。追加レビュー不要',
                    error: '分析エラー',
                    errorHelp: 'ページを更新するか、開発者にお問い合わせください',
                    targetScore: '目標スコア',
                    star: '星',
                    requiredReviews: '必要な5つ星レビュー:',
                    alreadyAchieved: '目標スコアは既に達成されています',
                    impossibleTarget: 'この目標スコアには到達できません',
                    toggleView: '表示切替'
                }
                // 可以根据需要添加更多语言
            }
        };
        
        // 如果没有特定语言的翻译，使用英语作为后备
        const getTextWithFallback = (category, lang) => {
            return localizedTexts[category][lang] || localizedTexts[category]['en'];
        };
        
        return {
            ratingsText: getTextWithFallback('ratingsText', language),
            starText: getTextWithFallback('starText', language),
            resultText: localizedTexts.resultText[language] || localizedTexts.resultText['en']
        };
    }

    // 清洗数字格式（处理千位分隔符）
    function sanitizeNumber(numStr) {
        return numStr.replace(/[.,\s]/g, '')
                    .replace(/[^\d]/g, '');
    }

    // 计算加权平均分
    function calculateWeightedAverage(ratings) {
        const total = ratings.reduce((sum, r) => sum + r.count, 0);
        if (total === 0) return 0;

        return ratings.reduce((sum, r) => {
            return sum + (r.stars * r.count);
        }, 0) / total;
    }

    // 计算所需五星好评
    function calculateRequiredReviews(currentScore, totalReviews, targetScore = getTargetScore()) {
        // 如果当前评分已经达到目标，则不需要额外的好评
        if (currentScore >= targetScore) {
            return 0;
        }
        
        // 特殊情况：如果目标分数是5分，使用不同的计算方法
        if (targetScore >= 5) {
            // 计算达到5分需要的五星评价数
            // 公式：(5 * (totalReviews + x) - currentScore * totalReviews) / (totalReviews + x) = 5
            // 简化：x = (5 - currentScore) * totalReviews / (5 - 5) 无法计算
            // 因此使用另一种方法：计算将所有非5星评价抵消所需的5星评价数
            const nonFiveStarWeight = totalReviews * (5 - currentScore);
            return Math.ceil(nonFiveStarWeight);
        }
        
        // 常规情况：计算公式
        // (目标评分 * (总评论数 + x) - 当前评分 * 总评论数) / (总评论数 + x) = 目标评分
        // 简化后：x = (目标评分 * 总评论数 - 当前评分 * 总评论数) / (5 - 目标评分)
        const numerator = targetScore * totalReviews - currentScore * totalReviews;
        const denominator = 5 - targetScore;
        
        return Math.ceil(numerator / denominator);
    }

    // 主处理函数
    async function processReviews() {
        try {
            log('开始处理评论数据...');
            log('当前URL:', window.location.href);
            
            // 等待评分直方图加载 - 使用最新的选择器
            log('等待评分直方图加载...');
            const histogram = await waitForElement('#histogramTable');
            if (!histogram) {
                log('错误: 找不到评分直方图');
                throw new Error('找不到评分直方图');
            }
            log('成功找到评分直方图:', histogram);

            // 获取本地化文本
            const localizedText = getLocalizedText();
            log('本地化文本:', localizedText);
            
            // 直接使用data-hook属性查找总评论数
            const totalElement = document.querySelector('[data-hook="total-review-count"]');
            log('总评论数元素:', totalElement);
            
            if (!totalElement) {
                log('错误: 找不到总评论数元素');
                throw new Error('找不到总评论数元素');
            }

            log('总评论数文本:', totalElement.textContent);
            const totalReviews = parseInt(sanitizeNumber(totalElement.textContent));
            log('解析后的总评论数:', totalReviews);
            
            if (isNaN(totalReviews)) {
                log('错误: 总评论数格式错误');
                throw new Error('总评论数格式错误');
            }

            // 获取各星级评价 - 使用最新的选择器
            log('查找评分条...');
            const ratingBars = [...document.querySelectorAll('#histogramTable li a')];
            log('找到评分条数量:', ratingBars.length);
            
            if (ratingBars.length !== 5) {
                log('错误: 找不到完整的五星评价数据, 只找到', ratingBars.length, '条');
                throw new Error('找不到完整的五星评价数据');
            }

            log('开始提取各星级评价数据...');
            const ratings = ratingBars.map((bar, index) => {
                // 获取星级 (5星到1星)
                const stars = 5 - index;
                log(`处理 ${stars} 星评价...`);
                
                // 获取百分比 - 从aria-valuenow属性获取
                let percent = 0;
                const meter = bar.querySelector('.a-meter');
                log(`${stars}星评价条元素:`, meter);
                
                if (meter && meter.getAttribute('aria-valuenow')) {
                    percent = parseInt(meter.getAttribute('aria-valuenow')) / 100;
                    log(`${stars}星评价 - 从aria-valuenow获取百分比:`, percent);
                }
                
                // 如果无法从aria-valuenow获取，尝试从style.width获取
                if (percent === 0 && meter && meter.querySelector('.a-meter-bar')) {
                    const meterBar = meter.querySelector('.a-meter-bar');
                    const widthStyle = meterBar.style.width;
                    log(`${stars}星评价 - meter-bar宽度样式:`, widthStyle);
                    
                    if (widthStyle) {
                        percent = parseInt(widthStyle) / 100;
                        log(`${stars}星评价 - 从style.width获取百分比:`, percent);
                    }
                }
                
                // 如果仍然无法获取百分比，尝试从文本中提取
                if (percent === 0) {
                    log(`${stars}星评价 - 尝试从文本提取百分比...`);
                    const percentTexts = bar.querySelectorAll('.a-text-right, .aok-nowrap');
                    log(`${stars}星评价 - 找到可能包含百分比的文本元素:`, percentTexts.length);
                    
                    for (const el of percentTexts) {
                        log(`${stars}星评价 - 文本内容:`, el.textContent);
                        const percentMatch = el.textContent.match(/(\d+)%/);
                        if (percentMatch) {
                            percent = parseInt(percentMatch[1]) / 100;
                            log(`${stars}星评价 - 从文本提取的百分比:`, percent);
                            break;
                        }
                    }
                }
                
                const count = Math.round(totalReviews * percent);
                log(`${stars}星评价 - 最终数据:`, { stars, percent, count });
                
                return {
                    stars: stars,
                    percent: percent,
                    count: count
                };
            });

            // 计算当前评分
            log('计算加权平均分...');
            const currentScore = calculateWeightedAverage(ratings);
            log('计算得到的当前评分:', currentScore);

            // 获取目标分数
            const targetScore = getTargetScore();
            log('目标评分:', targetScore);
            
            // 计算结果
            log('计算所需五星好评数...');
            const required = calculateRequiredReviews(currentScore, totalReviews, targetScore);
            log('需要的五星好评数:', required);

            // 生成结果面板
            const resultBox = document.createElement('div');
            resultBox.className = 'monty-review-box';
            resultBox.id = 'monty-review-box';
            
            // 使用本地化文本
            const rt = localizedText.resultText;
            
            // 创建语言选择器
            const currentLang = getUserLanguage();
            const langOptions = {
                'zh': '中文',
                'en': 'English',
                'ja': '日本語',
                'de': 'Deutsch',
                'fr': 'Français',
                'es': 'Español'
            };
            
            let langSelector = `
                <select id="monty-lang-selector" class="monty-lang-selector text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
            `;
            
            Object.entries(langOptions).forEach(([code, name]) => {
                langSelector += `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${name}</option>`;
            });
            
            langSelector += '</select>';
            
            // 生成星级评分条
            let ratingBarsHtml = '';
            ratings.forEach(rating => {
                const percent = (rating.percent * 100).toFixed(0);
                const starText = `${rating.stars} ${rt.star}`;
                
                ratingBarsHtml += `
                <div class="flex items-center space-x-2 py-1">
                    <div class="w-16 text-sm">${starText}</div>
                    <div class="flex-grow h-5 bg-gray-200 rounded overflow-hidden">
                        <div class="h-full bg-yellow-400" style="width: ${percent}%"></div>
                    </div>
                    <div class="w-16 text-right text-sm">${rating.count} (${percent}%)</div>
                </div>`;
            });
            
            // 生成所需好评数HTML
            let requiredHtml = '';
            if (required > 0) {
                requiredHtml = `
                <div class="monty-divider"></div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.targetScore}</span>
                    <div class="flex items-center">
                        <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                            value="${targetScore}" min="1" max="5" step="0.1">
                    </div>
                </div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.requiredReviews}</span>
                    <span class="monty-highlight text-lg">${required}</span>
                </div>`;
            } else if (required === 0) {
                requiredHtml = `
                <div class="monty-divider"></div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.targetScore}</span>
                    <div class="flex items-center">
                        <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                            value="${targetScore}" min="1" max="5" step="0.1">
                    </div>
                </div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.alreadyAchieved}</span>
                </div>`;
            } else {
                requiredHtml = `
                <div class="monty-divider"></div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.targetScore}</span>
                    <div class="flex items-center">
                        <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                            value="${targetScore}" min="1" max="5" step="0.1">
                    </div>
                </div>
                <div class="monty-review-item flex justify-between">
                    <span>${rt.impossibleTarget}</span>
                </div>`;
            }
            
            // 生成结果面板HTML
            resultBox.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center">
                            <h3 class="text-lg font-semibold text-gray-800">${rt.title}</h3>
                            <button id="monty-toggle-btn" class="monty-toggle-btn ml-2" title="${rt.toggleView || '展开/折叠视图'}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                        </div>
                        ${langSelector}
                    </div>
                    
                    <!-- 重要信息摘要（始终显示） -->
                    <div class="monty-summary-section mb-3">
                        <div class="flex justify-between items-center py-1">
                            <span class="text-gray-700">${rt.currentScore}</span>
                            <span class="font-medium text-blue-600 text-lg">${currentScore.toFixed(2)}</span>
                        </div>
                        
                        <!-- 如果有需要的好评数，显示在摘要中 -->
                        ${required > 0 ? `
                        <div class="flex justify-between items-center py-1">
                            <span class="text-gray-700">${rt.requiredReviews}</span>
                            <span class="font-medium text-blue-600 text-lg">${required}</span>
                        </div>` : ''}
                    </div>
                    
                    <!-- 详细信息（可折叠） -->
                    <div class="monty-detail-section">
                        <!-- 评分分布图表 -->
                        <div class="mb-3">
                            ${ratingBarsHtml}
                        </div>
                        
                        <div class="border-t border-gray-200 my-2"></div>
                        
                        <!-- 目标分数设置 -->
                        <div class="flex justify-between items-center py-1">
                            <span class="text-gray-700">${rt.targetScore}</span>
                            <div class="flex items-center">
                                <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                                    value="${targetScore}" min="1" max="5" step="0.1">
                            </div>
                        </div>
                        ${required < 0 ? `
                        <div class="flex justify-between items-center py-1">
                            <span class="text-gray-700">${rt.impossibleTarget}</span>
                        </div>` : ''}
                        ${required === 0 ? `
                        <div class="flex justify-between items-center py-1">
                            <span class="text-gray-700">${rt.alreadyAchieved}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="border-t border-gray-200 mt-3 pt-2 text-right text-xs text-gray-500">
                        &copy; 2025 Monty Ng. All rights reserved.
                    </div>
                </div>
            `;
            
            // 将结果面板插入到页面中
            log('将结果面板插入到页面中...');
            const insertPoints = [
                '#averageCustomerReviews',
                '#reviewsMedley',
                '#productTitle',
                '.product-title-word-break'
            ];
            
            let inserted = false;
            for (const selector of insertPoints) {
                const element = document.querySelector(selector);
                if (element) {
                    log(`在 ${selector} 后插入结果面板`);
                    element.parentNode.insertBefore(resultBox, element.nextSibling);
                    inserted = true;
                    break;
                }
            }
            
            if (!inserted) {
                log('找不到合适的插入点，插入到页面底部');
                document.body.appendChild(resultBox);
            }
            
            // 存储数据到面板中，便于重新生成
            resultBox.dataset.currentScore = currentScore;
            resultBox.dataset.totalReviews = totalReviews;
            resultBox.dataset.required = required;
            resultBox.dataset.ratings = JSON.stringify(ratings);
            
            // 添加事件监听器
            const newLangSelector = document.getElementById('monty-lang-selector');
            if (newLangSelector) {
                newLangSelector.addEventListener('change', function() {
                    const newLang = this.value;
                    log('切换语言到:', newLang);
                    setUserLanguage(newLang);
                    regenerateResultPanel(resultBox);
                });
            }
            
            // 添加目标分数输入框事件监听器
            const targetScoreInput = document.getElementById('monty-target-score');
            if (targetScoreInput) {
                targetScoreInput.addEventListener('change', function() {
                    const newScore = parseFloat(this.value);
                    if (!isNaN(newScore) && newScore >= 1 && newScore <= 5) {
                        log('修改目标分数:', newScore);
                        const validScore = setTargetScore(newScore);
                        this.value = validScore; // 确保显示有效的值
                        
                        // 重新计算所需评论数
                        const newRequired = calculateRequiredReviews(currentScore, totalReviews, validScore);
                        resultBox.dataset.required = newRequired;
                        
                        // 重新生成结果面板
                        regenerateResultPanel(resultBox);
                    } else {
                        // 恢复为有效值
                        this.value = getTargetScore();
                    }
                });
            }
            
            // 添加折叠/展开按钮事件监听器
            const toggleBtn = document.getElementById('monty-toggle-btn');
            if (toggleBtn) {
                // 检查是否有保存的折叠状态
                const isPanelCollapsed = localStorage.getItem('monty-panel-collapsed') === 'true';
                
                // 根据保存的状态设置初始折叠状态
                if (isPanelCollapsed) {
                    resultBox.classList.add('monty-collapsed');
                    toggleBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    `;
                }
                
                toggleBtn.addEventListener('click', function() {
                    resultBox.classList.toggle('monty-collapsed');
                    const isCollapsed = resultBox.classList.contains('monty-collapsed');
                    
                    // 保存折叠状态到localStorage
                    localStorage.setItem('monty-panel-collapsed', isCollapsed);
                    
                    // 更新按钮图标
                    if (isCollapsed) {
                        this.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                            </svg>
                        `;
                    } else {
                        this.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        `;
                    }
                });
            }
            
            log('结果面板生成完成');
        } catch (error) {
            log('处理评论数据时出错:', error);
            showError(`处理评论数据时出错: ${error.message}`);
        }
}

// ...

// 显示错误信息
function showError(message) {
    if (DEBUG_MODE) console.error('[Review Calculator]', message);
    
    // 创建错误提示框
    const errorBox = document.createElement('div');
    errorBox.className = 'monty-review-box bg-red-50 border-l-4 border-red-400';
    errorBox.id = 'monty-error-box';
    
    // 使用Tailwind CSS样式
    errorBox.innerHTML = `
        <div class="p-4">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">亚马逊评论计算器错误</h3>
                    <div class="mt-2 text-sm text-red-700">
                        ${message}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 尝试在页面上找到合适的插入点
    const insertPoints = [
        '#averageCustomerReviews',
        '#reviewsMedley',
        '#productTitle',
        '.product-title-word-break'
    ];
    
    for (const selector of insertPoints) {
        const element = document.querySelector(selector);
        if (element) {
            element.parentNode.insertBefore(errorBox, element.nextSibling);
            return;
        }
    }
    
    // 如果找不到合适的插入点，插入到页面底部
    document.body.appendChild(errorBox);
}
    
    // 初始化
    function init() {
        log('初始化脚本...');
        const targetScore = getTargetScore();
        log('目标评分:', targetScore);
        
        // 确保我们在产品页面上
        log('当前页面路径:', window.location.pathname);
        if (!window.location.pathname.includes('/dp/')) {
            log('不是产品页面，脚本不执行');
            return;
        }
        
        // 等待DOM完全加载
        log('当前文档状态:', document.readyState);
        if (document.readyState === 'loading') {
            log('文档仍在加载中，等待DOMContentLoaded事件...');
            document.addEventListener('DOMContentLoaded', () => {
                log('DOM已加载，延迟1500ms执行主函数');
                setTimeout(processReviews, 1500);
            });
        } else {
            // 如果DOM已加载，给页面一些时间来完成动态内容加载
            log('DOM已加载，延迟1500ms执行主函数');
            setTimeout(processReviews, 1500);
        }
    }
    
    // 重新生成结果面板
    function regenerateResultPanel(panel) {
        if (!panel || !panel.dataset) {
            log('错误: 无法重新生成结果面板，面板不存在');
            return;
        }
        
        log('重新生成结果面板...');
        
        // 获取面板数据
        const currentScore = parseFloat(panel.dataset.currentScore || '0');
        const totalReviews = parseInt(panel.dataset.totalReviews || '0');
        const required = parseInt(panel.dataset.required || '0');
        const ratings = JSON.parse(panel.dataset.ratings || '[]');
        
        // 获取本地化文本
        const localizedText = getLocalizedText();
        const rt = localizedText.resultText;
        
        // 创建语言选择器
        const currentLang = getUserLanguage();
        log('当前语言:', currentLang);
        const langOptions = {
            'zh': '中文',
            'en': 'English',
            'ja': '日本語',  // 注意这里使用'ja'作为日语代码
            'de': 'Deutsch',
            'fr': 'Français',
            'es': 'Español'
        };
        
        let langSelector = `
            <select id="monty-lang-selector" class="monty-lang-selector text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
        `;
        
        Object.entries(langOptions).forEach(([code, name]) => {
            langSelector += `<option value="${code}" ${code === currentLang ? 'selected' : ''}>${name}</option>`;
        });
        
        langSelector += '</select>';
        
        // 生成星级评分条
        let ratingBarsHtml = '';
        ratings.forEach(rating => {
            const percent = (rating.percent * 100).toFixed(0);
            const starText = `${rating.stars} ${rt.star}`;
            
            ratingBarsHtml += `
            <div class="flex items-center space-x-2 py-1">
                <div class="w-16 text-sm">${starText}</div>
                <div class="flex-grow h-5 bg-gray-200 rounded overflow-hidden">
                    <div class="h-full bg-yellow-400" style="width: ${percent}%"></div>
                </div>
                <div class="w-16 text-right text-sm">${rating.count} (${percent}%)</div>
            </div>`;
        });
        
        // 生成所需好评数HTML
        let requiredHtml = '';
        const targetScore = getTargetScore();
        
        if (required > 0) {
            requiredHtml = `
            <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">${rt.targetScore}</span>
                <div class="flex items-center">
                    <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                        value="${targetScore}" min="1" max="5" step="0.1">
                </div>
            </div>`;
        } else if (required === 0) {
            requiredHtml = `
            <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">${rt.targetScore}</span>
                <div class="flex items-center">
                    <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                        value="${targetScore}" min="1" max="5" step="0.1">
                </div>
            </div>
            <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">${rt.alreadyAchieved}</span>
            </div>`;
        } else {
            requiredHtml = `
            <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">${rt.targetScore}</span>
                <div class="flex items-center">
                    <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                        value="${targetScore}" min="1" max="5" step="0.1">
                </div>
            </div>
            <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">${rt.impossibleTarget}</span>
            </div>`;
        }
        
        // 生成结果面板HTML
        panel.innerHTML = `
            <div class="p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center">
                        <h3 class="text-lg font-semibold text-gray-800">${rt.title}</h3>
                        <button id="monty-toggle-btn" class="monty-toggle-btn ml-2" title="${rt.toggleView || '展开/折叠视图'}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                    ${langSelector}
                </div>
                
                <!-- 重要信息摘要（始终显示） -->
                <div class="monty-summary-section mb-3">
                    <div class="flex justify-between items-center py-1">
                        <span class="text-gray-700">${rt.currentScore}</span>
                        <span class="font-medium text-blue-600 text-lg">${currentScore.toFixed(2)}</span>
                    </div>
                    
                    <!-- 如果有需要的好评数，显示在摘要中 -->
                    ${required > 0 ? `
                    <div class="flex justify-between items-center py-1">
                        <span class="text-gray-700">${rt.requiredReviews}</span>
                        <span class="font-medium text-blue-600 text-lg">${required}</span>
                    </div>` : ''}
                </div>
                
                <!-- 详细信息（可折叠） -->
                <div class="monty-detail-section">
                    <!-- 评分分布图表 -->
                    <div class="mb-3">
                        ${ratingBarsHtml}
                    </div>
                    
                    <div class="border-t border-gray-200 my-2"></div>
                    
                    <!-- 目标分数设置 -->
                    <div class="flex justify-between items-center py-1">
                        <span class="text-gray-700">${rt.targetScore}</span>
                        <div class="flex items-center">
                            <input type="number" id="monty-target-score" class="w-16 px-2 py-1 mr-2 text-center border border-gray-300 rounded" 
                                value="${targetScore}" min="1" max="5" step="0.1">
                        </div>
                    </div>
                    ${required < 0 ? `
                    <div class="flex justify-between items-center py-1">
                        <span class="text-gray-700">${rt.impossibleTarget}</span>
                    </div>` : ''}
                    ${required === 0 ? `
                    <div class="flex justify-between items-center py-1">
                        <span class="text-gray-700">${rt.alreadyAchieved}</span>
                    </div>` : ''}
                </div>
                
                <div class="border-t border-gray-200 mt-3 pt-2 text-right text-xs text-gray-500">
                    &copy; 2025 Monty Ng. All rights reserved.
                </div>
            </div>
        `;
        
        // 重新添加事件监听器
        const newLangSelector = document.getElementById('monty-lang-selector');
        if (newLangSelector) {
            newLangSelector.addEventListener('change', function() {
                const newLang = this.value;
                log('切换语言到:', newLang);
                setUserLanguage(newLang);
                regenerateResultPanel(panel);
            });
        }
        
        // 重新添加目标分数输入框事件监听器
        const targetScoreInput = document.getElementById('monty-target-score');
        if (targetScoreInput) {
            targetScoreInput.addEventListener('change', function() {
                const newScore = parseFloat(this.value);
                if (!isNaN(newScore) && newScore >= 1 && newScore <= 5) {
                    log('修改目标分数:', newScore);
                    const validScore = setTargetScore(newScore);
                    
                    // 重新计算所需的五星好评数
                    const currentScore = parseFloat(panel.dataset.currentScore || '0');
                    const totalReviews = parseInt(panel.dataset.totalReviews || '0');
                    const newRequired = calculateRequiredReviews(currentScore, totalReviews, validScore);
                    
                    // 更新面板数据集
                    panel.dataset.required = newRequired;
                    
                    // 重新生成结果面板
                    regenerateResultPanel(panel);
                }
            });
        }
        
        // 添加折叠/展开按钮事件监听器
        const toggleBtn = document.getElementById('monty-toggle-btn');
        if (toggleBtn) {
            // 检查是否有保存的折叠状态
            const isPanelCollapsed = localStorage.getItem('monty-panel-collapsed') === 'true';
            
            // 根据保存的状态设置初始折叠状态
            if (isPanelCollapsed) {
                panel.classList.add('monty-collapsed');
                toggleBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="18 15 12 9 6 15"></polyline>
                    </svg>
                `;
            }
            
            toggleBtn.addEventListener('click', function() {
                panel.classList.toggle('monty-collapsed');
                const isCollapsed = panel.classList.contains('monty-collapsed');
                
                // 保存折叠状态到localStorage
                localStorage.setItem('monty-panel-collapsed', isCollapsed);
                
                // 更新按钮图标
                if (isCollapsed) {
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    `;
                } else {
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    `;
                    // 恢复为有效值
                    this.value = getTargetScore();
                }
            });
        }
    }
    
    // 启动脚本
    try {
        log('脚本开始执行...');
        log('浏览器信息:', navigator.userAgent);
        init();
    } catch (error) {
        log('初始化失败:', error);
        showError(`初始化失败: ${error.message}`);
    }
})();
