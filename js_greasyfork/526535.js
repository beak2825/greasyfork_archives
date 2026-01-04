// ==UserScript==
// @name         网页英语难词悬浮翻译助手（移动端）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测网页中的英语难词，鼠标悬浮显示翻译
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.fanyi.baidu.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/526535/%E7%BD%91%E9%A1%B5%E8%8B%B1%E8%AF%AD%E9%9A%BE%E8%AF%8D%E6%82%AC%E6%B5%AE%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/526535/%E7%BD%91%E9%A1%B5%E8%8B%B1%E8%AF%AD%E9%9A%BE%E8%AF%8D%E6%82%AC%E6%B5%AE%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B%EF%BC%88%E7%A7%BB%E5%8A%A8%E7%AB%AF%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改配置项
    const config = {
        wordFreqThreshold: 8000,     // 调整为更低的难度阈值
        academicWordThreshold: 0.3,  // 降低学术词汇权重
        minWordLength: 4,           // 降低最小单词长度
        enableLemmatization: true,
        excludeProperNouns: true,
        excludeAbbreviations: true,
        maxAbbrLength: 4,
        debugMode: false,
        excludeTags: [
            'SCRIPT', 'STYLE', 'PRE', 'CODE', 'TEXTAREA', 'INPUT',
            'IFRAME', 'NOSCRIPT', 'BUTTON', 'SELECT', 'OPTION'
        ],
        excludeClasses: ['no-translate', 'button', 'btn', 'word-tooltip', 'translation-item', 'phonetic'],
        excludeAttributes: ['onclick', 'onmouseover', 'onmouseenter'],
        buttonTags: ['BUTTON', 'A', 'INPUT[type="button"]', 'INPUT[type="submit"]'],
        apiUrl: 'https://v2.xxapi.cn/api/englishwords?word=',
        fallbackApiUrl: 'https://v.api.aa1.cn/api/api-fanyi-yd/index.php',
        apiHeaders: {
            'User-Agent': 'xiaoxiaoapi/1.0.0 (https://xxapi.cn)'
        },
        maxRetries: 3,
        retryDelay: 1000,
        tooltipDelay: 200,
        tooltipHideDelay: 300,
        contextAwareness: true,     // 启用上下文感知
        dynamicThreshold: true      // 启用动态难度调整
    };

    // 修改悬浮提示框样式
    GM_addStyle(`
        .word-tooltip {
            position: fixed;
            background: rgba(255, 255, 255, 0.98);
            color: #333;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 16px; /* 增大字体大小 */
            line-height: 1.6;
            z-index: 2147483647;
            max-width: 90vw; /* 使用视窗宽度 */
            width: auto;
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            transition: opacity 0.2s ease;
            opacity: 0;
            left: 50% !important; /* 居中显示 */
            transform: translateX(-50%);
            bottom: 20px !important; /* 固定在底部 */
            top: auto !important;
            touch-action: none; /* 防止触摸事件冒泡 */
            pointer-events: auto; /* 允许交互 */
            user-select: text; /* 允许选择文本 */
            -webkit-user-select: text;
        }

        .word-tooltip.active {
            opacity: 1;
        }

        .difficult-word {
            position: relative !important;
            display: inline !important;
            cursor: pointer !important; /* 改为手指图标 */
            padding: 2px 4px !important; /* 增加点击区域 */
            border-radius: 3px !important;
            background: rgba(33, 150, 243, 0.1) !important; /* 添加背景色 */
            margin: 0 1px !important;
            text-decoration: none !important;
            border-bottom: 1px dashed #2196F3 !important; /* 改为虚线下划线 */
        }

        .difficult-word.active {
            background: rgba(33, 150, 243, 0.2) !important;
        }

        /* 添加关闭按钮 */
        .word-tooltip .close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 24px;
            height: 24px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            line-height: 1;
            color: #666;
        }

        /* 移动端适配样式 */
        @media (max-width: 768px) {
            .word-tooltip {
                padding: 16px 20px;
                font-size: 16px;
                max-height: 40vh; /* 限制最大高度 */
                overflow-y: auto; /* 允许滚动 */
                -webkit-overflow-scrolling: touch; /* 平滑滚动 */
            }

            .difficult-word {
                padding: 3px 5px !important; /* 更大的点击区域 */
            }
        }
    `);

    // 添加常用词列表
    const commonWords = new Set([
        // 代词
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
        'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs',
        'this', 'that', 'these', 'those',

        // 常用动词
        'is', 'are', 'was', 'were', 'be', 'been', 'being',
        'have', 'has', 'had', 'do', 'does', 'did',
        'can', 'could', 'will', 'would', 'shall', 'should',
        'may', 'might', 'must', 'need', 'dare',
        'go', 'goes', 'went', 'gone', 'going',
        'come', 'comes', 'came', 'coming',
        'get', 'gets', 'got', 'getting',
        'make', 'makes', 'made', 'making',
        'know', 'knows', 'knew', 'known',
        'think', 'thinks', 'thought', 'thinking',
        'take', 'takes', 'took', 'taken', 'taking',
        'see', 'sees', 'saw', 'seen', 'seeing',
        'want', 'wants', 'wanted', 'wanting',
        'give', 'gives', 'gave', 'given', 'giving',
        'use', 'uses', 'used', 'using',
        'find', 'finds', 'found', 'finding',
        'tell', 'tells', 'told', 'telling',
        'ask', 'asks', 'asked', 'asking',
        'work', 'works', 'worked', 'working',
        'seem', 'seems', 'seemed', 'seeming',
        'feel', 'feels', 'felt', 'feeling',
        'try', 'tries', 'tried', 'trying',
        'leave', 'leaves', 'left', 'leaving',
        'call', 'calls', 'called', 'calling',

        // 常用介词
        'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about',
        'into', 'over', 'after', 'under', 'during', 'before', 'above', 'below',
        'up', 'down', 'off', 'through',

        // 常用连词
        'and', 'but', 'or', 'nor', 'for', 'yet', 'so',
        'because', 'although', 'unless', 'since', 'if', 'when', 'where', 'while',

        // 常用副词
        'very', 'really', 'just', 'now', 'then', 'here', 'there', 'only',
        'also', 'too', 'not', 'never', 'always', 'sometimes', 'often',
        'again', 'ever', 'still', 'already', 'quite', 'well',

        // 常用形容词
        'good', 'bad', 'new', 'old', 'great', 'high', 'low',
        'big', 'small', 'long', 'short', 'many', 'much', 'few',
        'other', 'same', 'different', 'next', 'last', 'first',
        'right', 'wrong', 'true', 'false', 'important',

        // 数词
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'first', 'second', 'third', 'fourth', 'fifth',
        'hundred', 'thousand', 'million', 'billion',

        // 其他高频词
        'time', 'year', 'day', 'week', 'month',
        'way', 'thing', 'life', 'world', 'school',
        'family', 'group', 'company', 'number', 'part',
        'most', 'both', 'all', 'such', 'even',
        'yes', 'no', 'any', 'every', 'each',
        'than', 'what', 'who', 'which', 'whose',
        'why', 'how', 'when', 'where'
    ]);

    // 添加常见缩写列表
    const commonAbbreviations = new Set([
        'ai', 'url', 'http', 'https', 'www', 'html', 'css', 'js',
        'cpu', 'gpu', 'ram', 'rom', 'ssd', 'hdd', 'usb', 'pdf',
        'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif',
        'mp3', 'mp4', 'avi', 'wifi', 'os', 'ui', 'ux', 'api',
        'sdk', 'npm', 'git', 'id', 'ip', 'dns', 'sql', 'json',
        'xml', 'ftp', 'ssl', 'ssh', 'utf'
    ]);

    // 添加学术词汇表
    const academicWords = new Set([
        'abstract', 'analysis', 'approach', 'area', 'assessment', 'assume', 'authority',
        'available', 'benefit', 'concept', 'consistent', 'constitutional', 'context', 'contract',
        'create', 'data', 'definition', 'derived', 'distribution', 'economic', 'environment',
        'established', 'estimate', 'evidence', 'export', 'factor', 'financial', 'formula',
        'function', 'identified', 'income', 'indicate', 'individual', 'interpretation', 'involved',
        'issue', 'labor', 'legal', 'legislation', 'major', 'method', 'occur', 'percent',
        'period', 'policy', 'principle', 'procedure', 'process', 'required', 'research',
        'response', 'role', 'section', 'sector', 'significant', 'similar', 'source',
        'specific', 'structure', 'theory', 'variable', 'traditional', 'technology', 'technique',
        'hypothesis', 'methodology', 'quantitative', 'synthesis', 'paradigm', 'empirical',
        'theoretical', 'phenomenon', 'anthropology', 'psychology', 'sociology', 'philosophy',
        'linguistics', 'cognitive', 'semantic', 'pragmatic', 'syntax', 'morphology', 'etymology'
    ]);

    // 添加技术术语表
    const techTerms = new Set([
        'api', 'json', 'xml', 'html', 'css', 'javascript', 'python', 'java', 'ruby', 'php',
        'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'nginx', 'apache', 'docker', 'kubernetes',
        'git', 'github', 'gitlab', 'bitbucket', 'npm', 'yarn', 'webpack', 'babel', 'react',
        'vue', 'angular', 'node', 'express', 'django', 'flask', 'spring', 'hibernate', 'maven',
        'gradle', 'jenkins', 'travis', 'aws', 'azure', 'gcp', 'linux', 'unix', 'windows',
        'macos', 'ios', 'android', 'kotlin', 'swift', 'objective-c', 'rust', 'golang', 'scala'
    ]);

    // 添加品牌名称表
    const brandNames = new Set([
        'apple', 'google', 'microsoft', 'amazon', 'facebook', 'twitter', 'instagram', 'linkedin',
        'youtube', 'netflix', 'spotify', 'uber', 'airbnb', 'tesla', 'samsung', 'sony', 'lg',
        'hp', 'dell', 'lenovo', 'asus', 'acer', 'intel', 'amd', 'nvidia', 'qualcomm', 'cisco',
        'oracle', 'ibm', 'salesforce', 'adobe', 'autodesk', 'wordpress', 'shopify', 'stripe'
    ]);

    // 创建悬浮提示框
    let tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    document.body.appendChild(tooltip);

    let tooltipTimeout = null;
    let hideTooltipTimeout = null;

    // 修改处理鼠标悬浮事件为点击事件
    let activeWord = null;
    let activeTooltip = false;

    async function handleWordClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const target = event.target;
        if (!target.classList.contains('difficult-word')) return;

        // 如果点击的是当前激活的单词，则关闭提示框
        if (activeWord === target) {
            hideTooltip();
            return;
        }

        // 移除之前激活的单词状态
        if (activeWord) {
            activeWord.classList.remove('active');
        }

        // 激活当前单词
        activeWord = target;
        target.classList.add('active');

        // 如果已经在翻译中，则不重复触发
        if (target.dataset.translating === 'true') return;

        // 如果之前翻译失败，不再重复请求
        if (target.dataset.translationFailed === 'true') {
            showTooltip(target.textContent, target);
            return;
        }

        try {
            // 标记正在翻译
            target.dataset.translating = 'true';
            showTooltip('翻译中...', target);

            const translationHtml = await translationQueue.translateWithCache(target.textContent);
            if (translationHtml && translationHtml !== target.textContent) {
                showTooltip(translationHtml, target);
                target.dataset.translationFailed = 'false';
            } else {
                showTooltip(target.textContent, target);
                target.dataset.translationFailed = 'true';
            }
        } catch (error) {
            console.error('翻译失败:', error);
            showTooltip(target.textContent, target);
            target.dataset.translationFailed = 'true';
        } finally {
            target.dataset.translating = 'false';
        }
    }

    // 显示提示框
    function showTooltip(content, target) {
        // 添加关闭按钮
        if (!tooltip.querySelector('.close-btn')) {
            const closeBtn = document.createElement('div');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', hideTooltip);
            tooltip.appendChild(closeBtn);
        }

        tooltip.innerHTML = content;
        tooltip.classList.add('active');
        activeTooltip = true;

        // 移动端不需要计算位置，因为提示框固定在底部
    }

    // 隐藏提示框
    function hideTooltip() {
        if (activeWord) {
            activeWord.classList.remove('active');
            activeWord = null;
        }
        tooltip.classList.remove('active');
        activeTooltip = false;
    }

    // 获取元素的背景色
    function getBackgroundColor(element) {
        let bg = window.getComputedStyle(element).backgroundColor;
        let parent = element.parentElement;

        // 修复语法错误：添加缺少的右括号
        while (parent && (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)')) {
            bg = window.getComputedStyle(parent).backgroundColor;
            parent = parent.parentElement;
        }

        // 如果找不到背景色，返回默认白色
        if (bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)') {
            return 'rgb(255, 255, 255)';
        }

        return bg;
    }

    // 调整背景色透明度和亮度
    function adjustBackgroundColor(bgColor) {
        // 解析RGB值
        const rgb = bgColor.match(/\d+/g).map(Number);

        // 计算亮度
        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;

        // 根据亮度调整文字颜色
        tooltip.style.color = brightness > 125 ? '#333' : '#fff';

        // 返回半透明的背景色
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.95)`;
    }

    // 定位提示框
    function positionTooltip(rect) {
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 5;

        // 确保提示框不超出视窗
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 5;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = rect.top - tooltipRect.height - 5;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // 扩展不规则动词变化表
    const irregularVerbs = {
        'am': 'be', 'is': 'be', 'are': 'be', 'was': 'be', 'were': 'be', 'been': 'be',
        'has': 'have', 'have': 'have', 'had': 'have',
        'does': 'do', 'did': 'do',
        'goes': 'go', 'went': 'go', 'gone': 'go',
        'makes': 'make', 'made': 'make',
        'came': 'come', 'come': 'come',
        'took': 'take', 'taken': 'take',
        'saw': 'see', 'seen': 'see',
        'knew': 'know', 'known': 'know',
        'grew': 'grow', 'grown': 'grow',
        'wrote': 'write', 'written': 'write',
        'drove': 'drive', 'driven': 'drive',
        'spoke': 'speak', 'spoken': 'speak',
        'broke': 'break', 'broken': 'break',
        'chose': 'choose', 'chosen': 'choose',
        'wore': 'wear', 'worn': 'wear',
        'drew': 'draw', 'drawn': 'draw',
        'flew': 'fly', 'flown': 'fly',
        'threw': 'throw', 'thrown': 'throw',
        'began': 'begin', 'begun': 'begin',
        'swam': 'swim', 'swum': 'swim',
        'sang': 'sing', 'sung': 'sing',
        'rang': 'ring', 'rung': 'ring',
        'drank': 'drink', 'drunk': 'drink',
        'sank': 'sink', 'sunk': 'sink',
        'sprang': 'spring', 'sprung': 'spring',
        'bore': 'bear', 'borne': 'bear',
        'shook': 'shake', 'shaken': 'shake',
        'stole': 'steal', 'stolen': 'steal',
        'rose': 'rise', 'risen': 'rise',
        'fell': 'fall', 'fallen': 'fall',
        'froze': 'freeze', 'frozen': 'freeze'
    };

    // 改进的词形还原规则
    const lemmatizationRules = [
        // 复数规则
        [/([^aeiou])ies$/, '$1y'],     // cities → city
        [/(ss|sh|ch|x|z)es$/, '$1'],   // boxes → box
        [/([^s])s$/, '$1'],            // dogs → dog
        
        // 动词规则
        [/([^aeiou])ied$/, '$1y'],     // studied → study
        [/([aeiou][^aeiou])ed$/, '$1'], // saved → save
        [/(.[^aeiou])ed$/, '$1'],      // jumped → jump
        [/([^e])ing$/, '$1'],          // running → run
        [/ying$/, 'ie'],               // lying → lie
        
        // 形容词规则
        [/([^aeiou])est$/, '$1'],      // biggest → big
        [/([aeiou][^aeiou])er$/, '$1'], // safer → safe
    ];

    // 词形还原函数
    function lemmatize(word) {
        let baseForm = word.toLowerCase();
        
        // 1. 检查不规则动词
        if (irregularVerbs[baseForm]) {
            return irregularVerbs[baseForm];
        }
        
        // 2. 应用词形还原规则
        for (const [pattern, replacement] of lemmatizationRules) {
            if (pattern.test(baseForm)) {
                const lemmatized = baseForm.replace(pattern, replacement);
                // 如果还原后的词在词频表中存在，则采用
                if (wordFrequencyList && wordFrequencyList.has(lemmatized)) {
                    return lemmatized;
                }
            }
        }
        
        return baseForm;
    }

    let wordFrequencyList = null;
    let processedNodes = new WeakMap();
    let isProcessing = false;
    let isInitialized = false;

    // 改进单词提取正则
    const wordRegex = /(?<!\.)\b[a-zA-Z](?:[''-]?[a-zA-Z])+\b(?!\.)/g;

    // 添加 LRU 缓存类
    class LRUCache {
        constructor(limit = 1000) {
            this.cache = new Map();
            this.limit = limit;
        }

        get(key) {
            if (!this.cache.has(key)) return undefined;
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }

        set(key, value) {
            if (this.cache.size >= this.limit) {
                this.cache.delete(this.cache.keys().next().value);
            }
            this.cache.set(key, value);
        }

        has(key) {
            return this.cache.has(key);
        }
    }

    // 创建翻译缓存实例
    const translationCache = new LRUCache(1000);

    // 创建翻译队列处理器
    class TranslationQueue {
        constructor() {
            this.queue = [];
            this.processing = false;
            this.cache = new Map();
            this.processingWords = new Set();
            this.loadCacheFromStorage();
        }

        // 从本地存储加载缓存
        loadCacheFromStorage() {
            try {
                const storedCache = localStorage.getItem('translation_cache');
                if (storedCache) {
                    this.cache = new Map(JSON.parse(storedCache));
                }
            } catch (error) {
                console.error('加载翻译缓存失败:', error);
                this.cache = new Map();
            }
        }

        // 保存缓存到本地存储
        saveCacheToStorage() {
            try {
                localStorage.setItem('translation_cache',
                    JSON.stringify(Array.from(this.cache.entries()))
                );
            } catch (error) {
                console.error('保存翻译缓存失败:', error);
                if (error.name === 'QuotaExceededError') {
                    this.pruneCache();
                }
            }
        }

        // 清理缓存
        pruneCache() {
            const entries = Array.from(this.cache.entries());
            if (entries.length > 10000) { // 限制缓存大小
                this.cache = new Map(entries.slice(-10000));
                this.saveCacheToStorage();
            }
        }

        // 获取翻译（优先从缓存获取）
        async translateWithCache(word) {
            const normalizedWord = word.toLowerCase();

            // 检查缓存
            if (this.cache.has(normalizedWord)) {
                return this.cache.get(normalizedWord);
            }

            try {
                const translationHtml = await fetchTranslation(word);
                if (translationHtml && translationHtml !== word) {
                    this.cache.set(normalizedWord, translationHtml);
                    this.saveCacheToStorage();
                    return translationHtml;
                }
            } catch (error) {
                console.error(`翻译失败: ${word}`, error);
                throw error; // 抛出错误以便上层处理
            }
            return word;
        }
    }

    const translationQueue = new TranslationQueue();

    // 加载词频表
    async function loadWordFrequencyList() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/mahavivo/vocabulary/master/vocabulary/COCA60000.txt');
            const text = await response.text();
            wordFrequencyList = new Map(
                text.split(/\s+/)
                    .map((word, index) => [word.toLowerCase(), index + 1])
            );
            if (config.debugMode) {
                console.log('词频表加载完成:', wordFrequencyList.size, '个单词');
            }
        } catch (error) {
            console.error('词频表加载失败:', error);
        }
    }

    // 获取词频得分（0-1）
    function getFrequencyScore(word) {
        const baseWord = lemmatize(word);
        const frequency = wordFrequencyList.get(baseWord) || 20000;
        return Math.min(1, frequency / 20000); // 频率越高得分越低
    }

    // 获取学术词汇得分
    function getAcademicScore(word) {
        const lowerWord = word.toLowerCase();
        if (academicWords.has(lowerWord)) return 1;
        
        // 检查学术词缀
        const academicSuffixes = [
            'ology', 'tion', 'sion', 'ism', 'ity', 'ment',
            'ance', 'ence', 'able', 'ible', 'ative', 'itive',
            'ical', 'istic', 'ious', 'eous', 'uous'
        ];
        
        for (const suffix of academicSuffixes) {
            if (lowerWord.endsWith(suffix)) return 0.7;
        }
        
        return 0;
    }

    // 获取结构复杂度得分
    function getStructuralComplexity(word) {
        let score = 0;
        
        // 长度分数
        if (word.length >= 8) score += 0.3;
        else if (word.length >= 6) score += 0.2;
        
        // 音节数分数
        const syllables = countSyllables(word);
        if (syllables >= 3) score += 0.2;
        
        // 连续辅音
        if (/[^aeiouy]{3,}/i.test(word)) score += 0.2;
        
        // 特殊字符
        if (/['-]/.test(word)) score += 0.1;
        
        // 复杂前缀
        if (/^(anti|counter|inter|intra|multi|over|under|super|trans)/.test(word)) {
            score += 0.2;
        }
        
        return Math.min(score, 1);
    }

    // 计算音节数
    function countSyllables(word) {
        word = word.toLowerCase();
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        return word.match(/[aeiouy]{1,2}/g)?.length || 1;
    }

    // 改进的生词判断函数
    function isDifficultWord(word, context = '') {
        if (!word || !wordFrequencyList) return false;

        // 清理单词
        word = word.trim();
        const originalWord = word;
        word = word.toLowerCase().replace(/[^a-z'-]/g, '');

        // 基本过滤
        if (word.length < config.minWordLength) return false;
        if (commonWords.has(word)) return false;
        if (techTerms.has(word)) return false;
        if (brandNames.has(word)) return false;

        // 排除缩写
        if (config.excludeAbbreviations) {
            if (commonAbbreviations.has(word)) return false;
            if (word.length <= config.maxAbbrLength &&
                (originalWord === originalWord.toUpperCase() || /\d/.test(originalWord))) {
                return false;
            }
        }

        // 排除专有名词
        if (config.excludeProperNouns &&
            /^[A-Z]/.test(originalWord) &&
            !isStartOfSentence(originalWord)) {
            return false;
        }

        // 多维度评分
        const frequencyScore = getFrequencyScore(word);
        const academicScore = getAcademicScore(word);
        const complexityScore = getStructuralComplexity(word);

        // 根据上下文调整权重
        let weights = { freq: 0.7, academic: 0.2, complex: 0.1 }; // 调整权重，更偏向频率评分
        
        if (isInTechnicalContext(context)) {
            weights = { freq: 0.6, academic: 0.3, complex: 0.1 };
        } else if (isInAcademicContext(context)) {
            weights = { freq: 0.5, academic: 0.4, complex: 0.1 };
        }

        const difficultyScore =
            frequencyScore * weights.freq +
            academicScore * weights.academic +
            complexityScore * weights.complex;

        return difficultyScore > 0.6; // 降低难度阈值
    }

    // 判断是否在技术上下文中
    function isInTechnicalContext(text) {
        const techKeywords = [
            'code', 'programming', 'software', 'developer',
            'algorithm', 'database', 'framework', 'api',
            'function', 'method', 'class', 'object'
        ];
        return techKeywords.some(kw => text.toLowerCase().includes(kw));
    }

    // 判断是否在学术上下文中
    function isInAcademicContext(text) {
        const academicKeywords = [
            'research', 'study', 'analysis', 'theory',
            'experiment', 'hypothesis', 'methodology',
            'conclusion', 'literature', 'journal'
        ];
        return academicKeywords.some(kw => text.toLowerCase().includes(kw));
    }

    // 延迟函数
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 优化翻译函数
    async function fetchTranslation(word, retryCount = 0) {
        try {
            // 首先检查缓存
            const cachedTranslation = translationCache.get(word.toLowerCase());
            if (cachedTranslation) return cachedTranslation;

            // 尝试主API
            const response = await fetch(`${config.apiUrl}${encodeURIComponent(word)}`, {
                headers: config.apiHeaders
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            
            // 如果主API无法找到单词，尝试备用API
            if (data.code === -2 || !data.data) {
                return await fetchFallbackTranslation(word);
            }

            const result = {
                phonetic: data.data.usphone || '',
                translations: []
            };

            // 收集所有词性和释义
            const posMap = new Map();

            // 处理 translations 数组
            if (data.data.translations) {
                data.data.translations.forEach(trans => {
                    if (!posMap.has(trans.pos)) {
                        posMap.set(trans.pos, new Set());
                    }
                    posMap.get(trans.pos).add(trans.tran_cn);
                });
            }

            // 处理 relWords 数组
            if (data.data.relWords) {
                data.data.relWords.forEach(relWord => {
                    if (!posMap.has(relWord.Pos)) {
                        posMap.set(relWord.Pos, new Set());
                    }
                    relWord.Hwds.forEach(hwd => {
                        if (hwd.tran) {
                            hwd.tran.split('；').forEach(tran => {
                                posMap.get(relWord.Pos).add(tran.trim());
                            });
                        }
                    });
                });
            }

            // 如果没有任何翻译，尝试备用API
            if (posMap.size === 0) {
                return await fetchFallbackTranslation(word);
            }

            // 转换为最终的translations数组
            for (const [pos, trans] of posMap.entries()) {
                result.translations.push({
                    pos: pos,
                    tran_cn: Array.from(trans).join('；')
                });
            }

            // 格式化翻译结果为HTML
            let translationHtml = '';
            if (result.phonetic) {
                translationHtml += `<div class="phonetic">[${result.phonetic}]</div>`;
            }

            result.translations.forEach(trans => {
                translationHtml += `<div class="translation-item">
                    <span class="pos">${trans.pos}</span>
                    <span class="trans">${trans.tran_cn}</span>
                </div>`;
            });

            if (translationHtml) {
                translationCache.set(word.toLowerCase(), translationHtml);
                return translationHtml;
            }

            return word;
        } catch (error) {
            console.error(`翻译失败 (第${retryCount + 1}次尝试):`, error);
            if (retryCount < config.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                return fetchTranslation(word, retryCount + 1);
            }
            // 如果主API完全失败，尝试备用API
            return await fetchFallbackTranslation(word);
        }
    }

    // 添加备用翻译API
    async function fetchFallbackTranslation(word) {
        try {
            const response = await fetch(`${config.fallbackApiUrl}?msg=${encodeURIComponent(word)}&type=3`);
            if (!response.ok) throw new Error('Fallback API request failed');

            const text = await response.text();
            const match = text.match(/"text":\s*"([^"]+)"/);
            
            if (match && match[1]) {
                const translation = match[1].trim();
                // 格式化备用API的翻译结果
                const translationHtml = `<div class="translation-item">
                    <span class="trans">${translation}</span>
                </div>`;
                translationCache.set(word.toLowerCase(), translationHtml);
                return translationHtml;
            }
            
            return word;
        } catch (error) {
            console.error('备用翻译API失败:', error);
            return word;
        }
    }

    // 修改节点过滤函数
    function shouldProcessNode(node) {
        if (!node || !node.parentNode) return false;

        // 检查节点是否有效
        try {
            node.textContent;
        } catch (e) {
            return false;
        }

        const parent = node.parentNode;

        // 检查父节点是否有效
        try {
            parent.tagName;
        } catch (e) {
            return false;
        }

        // 检查是否已处理
        if (processedNodes.has(node) || processedNodes.has(parent)) return false;

        // 检查标签名
        if (config.excludeTags.includes(parent.tagName)) return false;

        // 检查可编辑状态
        if (parent.isContentEditable) return false;

        // 检查是否在tooltip内
        let ancestor = parent;
        while (ancestor) {
            if (ancestor.classList && 
                (ancestor.classList.contains('word-tooltip') || 
                 ancestor.classList.contains('translation-item') ||
                 ancestor.classList.contains('phonetic'))) {
                return false;
            }
            ancestor = ancestor.parentElement;
        }

        // 检查父元素的类名
        if (parent.className && typeof parent.className === 'string') {
            if (config.excludeClasses.some(cls => parent.className.includes(cls))) {
                return false;
            }
        }

        // 检查是否有需要排除的属性
        if (config.excludeAttributes.some(attr => parent.hasAttribute(attr))) {
            return false;
        }

        // 检查是否在按钮或链接内
        try {
            let ancestor = parent;
            let depth = 0;
            while (ancestor && depth < 10) { // 限制检查深度
                if (ancestor.tagName === 'BUTTON' ||
                    ancestor.tagName === 'A' ||
                    ancestor.tagName === 'INPUT' ||
                    ancestor.onclick ||
                    ancestor.getAttribute('role') === 'button') {
                    return false;
                }
                ancestor = ancestor.parentElement;
                depth++;
            }
        } catch (e) {
            return false;
        }

        return true;
    }

    // 修改处理可见文本的函数
    async function processVisibleText(doc = document) {
        if (isProcessing) return false;
        isProcessing = true;

        try {
            const walker = doc.createTreeWalker(
                doc.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        try {
                            return shouldProcessNode(node) ?
                                NodeFilter.FILTER_ACCEPT :
                                NodeFilter.FILTER_REJECT;
                        } catch (e) {
                            return NodeFilter.FILTER_REJECT;
                        }
                    }
                }
            );

            const textNodes = [];
            let node;
            let count = 0;
            const maxNodes = 10000; // 限制处理节点数量

            while ((node = walker.nextNode()) && count < maxNodes) {
                textNodes.push(node);
                count++;
            }

            // 分批处理节点
            const batchSize = 100;
            for (let i = 0; i < textNodes.length; i += batchSize) {
                const batch = textNodes.slice(i, i + batchSize);
                await Promise.all(batch.map(node =>
                    processTextNode(node).catch(error => {
                        console.error('处理节点失败:', error);
                        return null;
                    })
                ));
                // 添加小延迟避免阻塞
                await new Promise(resolve => setTimeout(resolve, 1));
            }

            return true;
        } catch (error) {
            console.error('处理页面文本失败:', error);
            return false;
        } finally {
            isProcessing = false;
        }
    }

    // 优化节点处理
    class NodePool {
        constructor() {
            this.pool = [];
        }

        getNode() {
            return this.pool.length > 0 ? this.pool.pop() : document.createElement('span');
        }

        releaseNode(node) {
            if (this.pool.length < 100) { // 限制池大小
                node.className = '';
                node.textContent = '';
                this.pool.push(node);
            }
        }
    }

    const nodePool = new NodePool();

    // 分析页面整体难度
    async function analyzePageDifficulty() {
        const sampleText = document.body.textContent.substring(0, 5000);
        const words = sampleText.match(/[a-zA-Z']+/g) || [];
        
        if (words.length === 0) return;

        const longWordCount = words.filter(w => w.length > 7).length;
        const avgWordLength = words.reduce((a, w) => a + w.length, 0) / words.length;
        
        // 分析上下文类型
        const isAcademic = isInAcademicContext(sampleText);
        const isTechnical = isInTechnicalContext(sampleText);
        
        // 动态调整阈值
        if (isAcademic) {
            config.wordFreqThreshold = 8000; // 学术文章
            config.minWordLength = 6;
        } else if (isTechnical) {
            config.wordFreqThreshold = 7000; // 技术文档
            config.minWordLength = 5;
        } else if (longWordCount > 50 || avgWordLength > 5.5) {
            config.wordFreqThreshold = 6000; // 较难的普通文章
            config.minWordLength = 5;
        } else {
            config.wordFreqThreshold = 5000; // 普通文章
            config.minWordLength = 5;
        }

        if (config.debugMode) {
            console.log('页面分析结果:', {
                avgWordLength,
                longWordCount,
                isAcademic,
                isTechnical,
                newThreshold: config.wordFreqThreshold
            });
        }
    }

    // 修改处理文本节点函数
    async function processTextNode(node) {
        if (!shouldProcessNode(node)) return;

        const text = node.textContent.trim();
        if (!text || !/[a-zA-Z]{3,}/.test(text)) return;

        try {
            const context = getNodeContext(node, 100);
            const words = text.match(wordRegex) || [];
            const difficultWords = words.filter(w => isDifficultWord(w, context));

            if (difficultWords.length === 0) return;

            const wrapper = document.createElement('span');
            wrapper.className = 'translation-wrapper';
            wrapper.style.cssText = 'display: inline !important; position: relative !important;';

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            words.forEach(word => {
                const index = text.indexOf(word, lastIndex);
                if (index > lastIndex) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(lastIndex, index))
                    );
                }

                if (difficultWords.includes(word)) {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'difficult-word';
                    wordSpan.textContent = word;
                    wordSpan.dataset.context = getWordContext(text, index, word.length);
                    
                    // 使用点击事件替代悬浮事件
                    wordSpan.addEventListener('click', handleWordClick, true);
                    wordSpan.addEventListener('touchend', handleWordClick, true);

                    fragment.appendChild(wordSpan);
                } else {
                    fragment.appendChild(document.createTextNode(word));
                }

                lastIndex = index + word.length;
            });

            if (lastIndex < text.length) {
                fragment.appendChild(
                    document.createTextNode(text.slice(lastIndex))
                );
            }

            wrapper.appendChild(fragment);

            if (node.parentNode && !processedNodes.has(node.parentNode)) {
                try {
                    node.parentNode.replaceChild(wrapper, node);
                    processedNodes.set(wrapper, true);
                } catch (error) {
                    console.error('替换节点失败:', error);
                }
            }
        } catch (error) {
            console.error('处理文本节点失败:', error);
        }
    }

    // 获取节点上下文
    function getNodeContext(node, radius) {
        let context = '';
        
        // 获取前文
        let prev = node.previousSibling;
        let prevText = '';
        while (prev && prevText.length < radius) {
            if (prev.nodeType === Node.TEXT_NODE) {
                prevText = prev.textContent + prevText;
            }
            prev = prev.previousSibling;
        }
        context += prevText.slice(-radius);
        
        // 添加当前节点文本
        context += node.textContent;
        
        // 获取后文
        let next = node.nextSibling;
        let nextText = '';
        while (next && nextText.length < radius) {
            if (next.nodeType === Node.TEXT_NODE) {
                nextText += next.textContent;
            }
            next = next.nextSibling;
        }
        context += nextText.slice(0, radius);
        
        return context;
    }

    // 获取单词上下文
    function getWordContext(text, index, length) {
        const contextRadius = 50;
        const start = Math.max(0, index - contextRadius);
        const end = Math.min(text.length, index + length + contextRadius);
        return text.slice(start, end);
    }

    // 修改初始化函数
    async function initialize() {
        if (isInitialized) return;
        isInitialized = true;

        try {
            await loadWordFrequencyList();
            
            // 分析页面难度并调整阈值
            if (config.dynamicThreshold) {
                await analyzePageDifficulty();
            }
            
            // 开始处理页面文本
            processAllFrames().catch(error => {
                console.error('处理页面文本失败:', error);
            });
            
            observeContentChanges();
        } catch (error) {
            console.error('初始化失败:', error);
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 判断单词是否在句首
    function isStartOfSentence(word) {
        const prevText = getPreviousText(word);
        return !prevText || /[.!?]\s+$/.test(prevText);
    }

    // 获取单词前面的文本
    function getPreviousText(word) {
        const node = word.parentNode;
        if (!node) return '';

        const nodeText = node.textContent;
        const wordIndex = nodeText.indexOf(word);
        if (wordIndex === -1) return '';

        return nodeText.substring(0, wordIndex);
    }

    // 处理所有框架的函数
    async function processAllFrames() {
        // 处理主文档
        await processVisibleText(document);

        // 处理所有iframe
        try {
            const frames = document.getElementsByTagName('iframe');
            for (let i = 0; i < frames.length; i++) {
                try {
                    const frameDoc = frames[i].contentDocument;
                    if (frameDoc) {
                        await processVisibleText(frameDoc);
                    }
                } catch (e) {
                    console.warn('无法访问iframe内容:', e);
                }
            }
        } catch (e) {
            console.error('处理框架失败:', e);
        }
    }

    // 处理新节点的函数
    async function processNewNodes(nodes) {
        const textNodes = [];

        // 收集所有文本节点
        for (const node of nodes) {
            const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(textNode) {
                        if (!textNode.parentNode) return NodeFilter.FILTER_REJECT;
                        if (config.excludeTags.includes(textNode.parentNode.tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        if (processedNodes.has(textNode)) return NodeFilter.FILTER_REJECT;
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let textNode;
            while (textNode = walker.nextNode()) {
                textNodes.push(textNode);
            }
        }

        // 并行处理所有文本节点
        await Promise.all(textNodes.map(node => processTextNode(node)));
    }

    // 监听动态内容变化
    function observeContentChanges() {
        let timeout = null;
        const observer = new MutationObserver((mutations) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const addedNodes = new Set();
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            addedNodes.add(node);
                        }
                    });
                });

                if (addedNodes.size > 0) {
                    Array.from(addedNodes).forEach(node => {
                        const walker = document.createTreeWalker(
                            node,
                            NodeFilter.SHOW_TEXT,
                            { acceptNode: shouldProcessNode }
                        );

                        let textNode;
                        while (textNode = walker.nextNode()) {
                            if (!processedNodes.has(textNode)) {
                                processQueue.push(textNode);
                            }
                        }
                    });

                    processNextBatch();
                }
            }, 200); // 延迟处理，避免频繁触发
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 清理函数
    function cleanup() {
        const difficultWords = document.querySelectorAll('.difficult-word');
        difficultWords.forEach(node => {
            const text = document.createTextNode(node.textContent);
            node.parentNode.replaceChild(text, node);
        });
        processedNodes = new WeakMap();
        tooltip.remove();
    }

    // 添加卸载处理
    window.addEventListener('unload', cleanup);

    // 优化节点处理逻辑
    const processQueue = [];
    const processDelay = 100; // 处理间隔时间

    async function processNextBatch() {
        if (isProcessing || processQueue.length === 0) return;
        isProcessing = true;

        try {
            const batch = processQueue.splice(0, 50); // 每次处理50个节点
            await Promise.all(batch.map(node => processTextNode(node)));

            // 添加延迟
            await new Promise(resolve => setTimeout(resolve, processDelay));

            if (processQueue.length > 0) {
                await processNextBatch();
            }
        } catch (error) {
            console.error('处理节点批次失败:', error);
        } finally {
            isProcessing = false;
        }
    }

    // 添加全局点击事件处理
    document.addEventListener('click', (event) => {
        if (!activeTooltip) return;
        
        // 如果点击的不是提示框或难词，则隐藏提示框
        if (!event.target.closest('.word-tooltip') && 
            !event.target.classList.contains('difficult-word')) {
            hideTooltip();
        }
    });

    // 添加触摸事件处理
    document.addEventListener('touchstart', (event) => {
        if (!activeTooltip) return;
        
        // 如果触摸的不是提示框或难词，则隐藏提示框
        if (!event.target.closest('.word-tooltip') && 
            !event.target.classList.contains('difficult-word')) {
            hideTooltip();
        }
    });

})();