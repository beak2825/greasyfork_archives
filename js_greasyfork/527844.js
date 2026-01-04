// ==UserScript==
// @name         维基百科纯净文本提取器
// @name         Wikipedia Plain Text Extractor
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动提取维基百科条目正文的纯净文本(去除所有链接、注释等干扰信息)
// @description  Automatically extract clean text from Wikipedia entries (remove all links, annotations, and other distracting information)
// @author       Yuze
// @copyright    2025, Yuze (https://greasyfork.org/users/Yuze Guitar)
// @license      MIT
// @match        https://*.wikipedia.org/wiki/*
// @match        https://*.m.wikipedia.org/wiki/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/527844/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%BA%AF%E5%87%80%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527844/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91%E7%BA%AF%E5%87%80%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即执行的翻译阻止代码
    (function preventTranslation() {
        // 1. 添加元标记
        const meta = document.createElement('meta');
        meta.name = 'google';
        meta.content = 'notranslate';
        document.documentElement.appendChild(meta);

        // 2. 添加HTML属性
        document.documentElement.setAttribute('translate', 'no');
        document.documentElement.setAttribute('class', 'notranslate');
        
        // 3. 添加CSS规则阻止翻译界面
        const css = `
            .skiptranslate,
            #google_translate_element,
            .goog-te-banner-frame,
            .goog-te-gadget,
            .goog-te-spinner-pos,
            .goog-tooltip,
            .goog-tooltip:hover,
            .goog-text-highlight,
            #goog-gt-tt,
            .VIpgJd-ZVi9od-l4eHX-hSRGPd,
            .VIpgJd-ZVi9od-ORHb-OEVmcd,
            .VIpgJd-ZVi9od-SmfZ-OEVmcd-tJHJj {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                width: 0 !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            body {
                position: static !important;
                top: 0 !important;
                min-height: auto !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.documentElement.appendChild(style);

        // 4. 定期检查并移除翻译元素
        const removeTranslateElements = () => {
            const elements = document.querySelectorAll(`
                .skiptranslate,
                #google_translate_element,
                .goog-te-banner-frame,
                .goog-te-gadget,
                .goog-te-spinner-pos,
                .goog-tooltip,
                #goog-gt-tt,
                .VIpgJd-ZVi9od-l4eHX-hSRGPd,
                .VIpgJd-ZVi9od-ORHb-OEVmcd,
                .VIpgJd-ZVi9od-SmfZ-OEVmcd-tJHJj
            `);
            elements.forEach(el => el.remove());

            // 移除由谷歌翻译添加的iframe
            const iframes = document.getElementsByTagName('iframe');
            for (let i = iframes.length - 1; i >= 0; i--) {
                const iframe = iframes[i];
                if (iframe.src.includes('translate.google') || 
                    iframe.id.includes('goog') ||
                    iframe.className.includes('goog')) {
                    iframe.remove();
                }
            }
        };

        // 立即执行一次
        removeTranslateElements();

        // 设置定期检查
        setInterval(removeTranslateElements, 1000);

        // 5. 阻止翻译相关的脚本加载
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'SCRIPT' && 
                        (node.src.includes('translate.google') || 
                         node.src.includes('translate.googleapis'))) {
                        node.remove();
                    }
                });
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    })();

    // 检查是否为移动版并重定向 - 最优先执行
    function redirectToDesktop() {
        const currentURL = window.location.href;
        if (currentURL.includes('.m.wikipedia.org')) {
            const desktopURL = currentURL.replace('.m.wikipedia.org', '.wikipedia.org');
            window.location.replace(desktopURL);
            return true;
        }
        return false;
    }

    // 如果是移动版立即重定向并返回
    if (redirectToDesktop()) {
        return; // 终止后续执行
    }

    // 移除所有图片屏蔽相关的代码,只保留必要的优化
    const customCSS = `
        /* 优化页面布局 */
        #content {
            margin: 0 auto !important;
            max-width: 1000px !important;
            padding: 20px !important;
        }

        /* 隐藏不必要的元素,但保留导航和图片 */
        .banner-container,
        #siteNotice,
        .mw-indicators,
        .mw-editsection,
        #footer-places,
        #footer,
        #p-logo,
        .mw-parser-output > div:first-child:not(#toc):not(.infobox),
        [class*="banner"]:not([class*="vector"]),
        [class*="noprint"]:not(.vector-sticky-pinned-container):not(.vector-toc-pinned-container):not([class*="vector"]) {
            display: none !important;
        }

        /* 确保导航栏显示 */
        .vector-sticky-pinned-container,
        .vector-column-start,
        #mw-panel,
        .vector-menu-portal,
        .vector-menu-content,
        .vector-menu-portal-container {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* 优化导航栏样式 */
        .vector-column-start {
            position: relative !important;
            width: 208px !important;
            margin: 44.8px 0 0 -12px !important;
            font: 16px sans-serif !important;
            color: #202122 !important;
            float: left !important;
        }

        .vector-sticky-pinned-container {
            position: sticky !important;
            top: 0 !important;
            max-height: calc(100vh - 44.8px) !important;
            overflow-y: auto !important;
            z-index: 100 !important;
        }
    `;

    // 检查是否为维基百科首页
    function isWikiMainPage() {
        const currentURL = window.location.href;
        // 检查多语言首页的常见模式
        const mainPagePatterns = [
            '/wiki/Wikipedia:首页',
            '/wiki/Wikipedia:%E9%A6%96%E9%A1%B5', // URL编码的"首页"
            '/wiki/Main_Page',
            '/wiki/Wikipedia:首頁',    // 繁体中文
            '/wiki/Wikipedia:대문',    // 韩文
            '/wiki/Wikipedia:メインページ', // 日文
            '/wiki/Wikipédia:Accueil_principal', // 法文
            '/wiki/Wikipedia:Hauptseite',  // 德文
            'Special:首页',
            'Special:MainPage'
        ];

        return mainPagePatterns.some(pattern => currentURL.includes(pattern));
    }

    // 主程序入口
    function init() {
        // 如果是首页,直接返回不执行任何操作
        if (isWikiMainPage()) {
            return;
        }

        // 添加样式
        const style = document.createElement('style');
        style.textContent = customCSS;
        document.documentElement.appendChild(style);

        // 确保导航栏可见
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureNavigationVisible);
        } else {
            ensureNavigationVisible();
        }

        // 等待主要内容加载完成后再执行提取
        if (document.readyState === 'complete') {
            initializeExtractor();
        } else {
            window.addEventListener('load', initializeExtractor);
        }
    }

    // 初始化提取器
    function initializeExtractor() {
        const content = document.getElementById('mw-content-text');
        if (content) {
            const cleanText = processWikiText();
            if (cleanText) createUI(cleanText);
        } else {
            // 如果还没加载完,使用MutationObserver继续监听
            const observer = new MutationObserver((mutations, obs) => {
                if (document.getElementById('mw-content-text')) {
                    obs.disconnect();
                    const cleanText = processWikiText();
                    if (cleanText) createUI(cleanText);
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    // 智能文本净化处理器
    function processWikiText() {
        // 定位主要内容区域
        const content = document.getElementById('mw-content-text');
        if (!content) return null;

        // 创建克隆对象避免污染原始页面 
        const cleanContent = content.cloneNode(true);

        // 智能清理不需要的元素
        const removables = [
            '.reference',         // 参考文献
            '.navbox',            // 导航框
            '.infobox',           // 信息框
            '.mw-editsection',    // 编辑按钮
            '.metadata',          // 元数据
            '.hatnote',           // 顶部提示
            '.mw-empty-elt',      // 空元素
            'img',                // 图片
            'table',              // 表格
            'sup',                // 上标注释
            '.catlinks',          // 分类链接
            '.ambox',            // 新增:信息框样式
            '.side-box',         // 新增:侧边栏
            '.plainlist',        // 新增:无样式列表
            'link',              // 新增:样式表链接
            'style',             // 新增:内联样式
            'img[src*="CentralAutoLogin"]', // 特定隐藏图片
            '#footer',           // 页脚内容
            '.printfooter',      // 打印页脚
            '.mw-footer',        // 媒体页脚
            '.mw-indicators',    // 页面指示器
            '.mw-authority-control', // 权威控制
            '.mw-redirect',      // 重定向链接
            '.dablink',          // 消歧义链接
            '.navigation-box',   // 导航框补充
            '.external',         // 外部链接
            '.noprint',          // 不打印内容
            '.reflist',           // 新增:参考文献列表
            '.mw-references',     // 新增:参考文献容器
            '.mw-hidden-catlinks',// 隐藏分类链接
            '.mw-jump-link',      // 跳转链接
            '.nomobile'          // 移动端隐藏内容
        ];

        removables.forEach(selector => {
            cleanContent.querySelectorAll(selector).forEach(el => el.remove());
        });

        // 深度清理嵌套链接
        cleanContent.querySelectorAll('a').forEach(link => {
            const parent = link.parentNode;
            while (link.firstChild) {
                parent.insertBefore(link.firstChild, link);
            }
            parent.removeChild(link);
        });

        // 获取最终文本并进行智能处理
        let text = cleanContent.textContent;
        
        // 移除参看和参考资料部分
        text = text.replace(/参看[\s\S]*?(?=\n\n|$)/g, '')  // 移除参看部分
                 .replace(/参考资料[\s\S]*?(?=\n\n|$)/g, '') // 移除参考资料部分
                 .replace(/延伸阅读[\s\S]*?(?=\n\n|$)/g, '') // 移除延伸阅读部分
                 .replace(/参见[\s\S]*?(?=\n\n|$)/g, '')     // 移除参见部分
                 .replace(/外部链接[\s\S]*?(?=\n\n|$)/g, '') // 移除外部链接部分
                 .replace(/注释[\s\S]*?(?=\n\n|$)/g, '')     // 移除注释部分
                 .replace(/参考文献[\s\S]*?(?=\n\n|$)/g, '') // 移除参考文献部分
                 .replace(/分类[\s\S]*?(?=\n\n|$)/g, '')     // 移除分类部分
                 .replace(/目录[\s\S]*?(?=\n\n|$)/g, '')     // 移除目录部分
                 // 增加对引用文献的过滤
                 .replace(/<[^>]+>[^.\n]*?<[^>]+>[^\n]*?\n/g, '') // 移除引用文献行
                 .replace(/\[\d+\]/g, '')                    // 移除引用标记 [1] [2] 等
                 .replace(/<[^>]+>/g, ' ')                   // 清除所有HTML标签
                 // 转换中文括号为英文括号
                 .replace(/\u0028/g, '(')                    // 将中文左圆括号转为英文
                 .replace(/\u0029/g, ')')                    // 将中文右圆括号转为英文
                 .replace(/【/g, '[')                        // 将中文左方括号转为英文
                 .replace(/】/g, ']')                        // 将中文右方括号转为英文
                 .replace(/「/g, '"')                        // 将中文左引号转为英文双引号
                 .replace(/」/g, '"')                        // 将中文右引号转为英文双引号
                 .replace(/『/g, "'")                        // 将中文左书名号转为英文单引号
                 .replace(/』/g, "'")                        // 将中文右书名号转为英文单引号
                 .replace(/\u300a/g, '"')                    // 将中文左书名号转为英文双引号
                 .replace(/\u300b/g, '"')                    // 将中文右书名号转为英文双引号
                 .replace(/〈/g, '<')                        // 将中文左尖括号转为英文
                 .replace(/〉/g, '>')                        // 将中文右尖括号转为英文
                 .replace(/\s*([()[\]<>"])\s*/g, '$1')      // 处理所有括号周围的空格
                 .replace(/(\d)\s*([³²])\s*/g, '$1$2')      // 修复数学上标
                 .replace(/([a-zA-Z])\s+(?=[a-zA-Z])/g, '$1') // 处理英文单词间距
                 .replace(/[^\S\n]/g, ' ')                   // 合并所有空白字符为单个空格
                 .replace(/([.!?;.!?;])\s*/g, '$1\n')       // 在中文和英文句末添加换行
                 .replace(/(\n\s*){2,}/g, '\n\n')           // 标准化段落间距
                 .replace(/^\s+|\s+$/g, '')                 // 去除首尾空格
                 .replace(/([^\x00-\xff])\s+([^\x00-\xff])/g, '$1$2') // 连接被分散的中文字符
                 .replace(/([^\x00-\xff])\s*([a-zA-Z])/g, '$1 $2') // 优化中英文之间的空格
                 .replace(/([a-zA-Z])\s*([^\x00-\xff])/g, '$1 $2') // 优化英中文之间的空格
                 .replace(/\s+/g, ' ')                       // 最终清理多余空格
                 .trim();

        return text;
    }

    // 创建可视化界面
    function createUI(text) {
        // 创建面板基本结构
        const panel = document.createElement('div');
        panel.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 80vh;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            overflow: hidden;
            font-family: system-ui, -apple-system, sans-serif;
            padding: 15px;
        `;

        // 创建标题容器使其可以容纳标题、按钮和语言切换器
        const titleContainer = document.createElement('div');
        titleContainer.style = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            gap: 10px;
        `;

        const title = document.createElement('h3');
        title.textContent = '纯净文本提取结果';
        title.style = 'margin: 0; color: #0366d6;';

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style = `
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        // 创建语言切换按钮
        const langBtn = document.createElement('div');
        langBtn.style = `
            display: flex;
            border: 1px solid #0366d6;
            border-radius: 5px;
            overflow: hidden;
            font-size: 14px;
        `;

        // 获取当前URL的语言
        const currentLang = window.location.href.includes('/zh/') ? 'zh' : 
                           window.location.href.includes('/en/') ? 'en' : 
                           window.location.hostname.startsWith('zh.') ? 'zh' : 'en';

        // 创建中文按钮
        const zhBtn = document.createElement('span');
        zhBtn.textContent = 'ZH';
        zhBtn.style = `
            padding: 4px 8px;
            cursor: pointer;
            background: ${currentLang === 'zh' ? '#0366d6' : 'transparent'};
            color: ${currentLang === 'zh' ? 'white' : '#0366d6'};
        `;

        // 创建英文按钮
        const enBtn = document.createElement('span');
        enBtn.textContent = 'EN';
        enBtn.style = `
            padding: 4px 8px;
            cursor: pointer;
            background: ${currentLang === 'en' ? '#0366d6' : 'transparent'};
            color: ${currentLang === 'en' ? 'white' : '#0366d6'};
        `;

        // 添加点击事件
        zhBtn.onclick = () => switchLanguage('zh');
        enBtn.onclick = () => switchLanguage('en');

        // 创建复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '一键复制';
        copyBtn.style = `
            padding: 6px 12px;
            background: #0366d6;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
            font-size: 14px;
        `;
        copyBtn.onmouseover = () => copyBtn.style.background = '#0356b6';
        copyBtn.onmouseout = () => copyBtn.style.background = '#0366d6';
        copyBtn.onclick = () => {
            GM_setClipboard(text);
            copyBtn.textContent = '✓ 已复制!';
            setTimeout(() => copyBtn.textContent = '一键复制', 2000);
        };

        // 修改内容区域,添加分段加载功能
        const content = document.createElement('div');
        content.style = 'line-height: 1.6; color: #333; overflow-y: auto; max-height: calc(80vh - 100px);';
        
        // 分段加载参数
        const INITIAL_CHUNK = 1200;  // 初始加载字数
        const CHUNK_SIZE = 600;      // 每次增加字数
        const LOAD_INTERVAL = 250;   // 加载间隔(ms)
        
        // 初始显示
        let currentPosition = 0;
        content.textContent = text.slice(0, INITIAL_CHUNK);
        currentPosition = INITIAL_CHUNK;

        // 创建加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.style = `
            text-align: center;
            color: #666;
            font-size: 12px;
            padding: 5px;
            margin-top: 10px;
        `;
        loadingIndicator.textContent = '正在加载更多内容...';
        content.appendChild(loadingIndicator);

        // 分段加载剩余内容
        const loadMoreContent = () => {
            if (currentPosition >= text.length) {
                loadingIndicator.remove();
                return;
            }

            const nextChunk = text.slice(currentPosition, currentPosition + CHUNK_SIZE);
            content.textContent = content.textContent.slice(0, -loadingIndicator.textContent.length) + nextChunk;
            content.appendChild(loadingIndicator);
            currentPosition += CHUNK_SIZE;

            // 计算加载进度
            const progress = Math.min(100, Math.round((currentPosition / text.length) * 100));
            loadingIndicator.textContent = `正在加载更多内容... ${progress}%`;

            setTimeout(loadMoreContent, LOAD_INTERVAL);
        };

        // 开始分段加载
        setTimeout(loadMoreContent, LOAD_INTERVAL);

        // 组装语言切换按钮
        langBtn.append(zhBtn, enBtn);
        buttonContainer.append(langBtn, copyBtn);
        titleContainer.append(title, buttonContainer);
        panel.append(titleContainer, content);
        document.body.appendChild(panel);
    }

    // 语言切换函数
    function switchLanguage(targetLang) {
        // 获取当前URL
        const currentURL = window.location.href;
        
        // 检查当前是否已经是目标语言
        const isCurrentZh = currentURL.includes('zh.wikipedia.org');
        const isCurrentEn = currentURL.includes('en.wikipedia.org');
        
        // 如果当前语言和目标语言相同,则不执行任何操作
        if ((isCurrentZh && targetLang === 'zh') || (isCurrentEn && targetLang === 'en')) {
            return;
        }

        // 首先尝试获取页面上的语言链接
        const langLinks = document.querySelectorAll('.interlanguage-link');
        for (const link of langLinks) {
            const langCode = link.getAttribute('lang') || 
                            link.querySelector('a').getAttribute('lang');
            if ((targetLang === 'zh' && (langCode === 'zh' || langCode === 'zh-Hans')) ||
                (targetLang === 'en' && langCode === 'en')) {
                // 找到目标语言的链接,直接跳转
                const targetURL = new URL(link.querySelector('a').href);
                
                // 添加禁止自动翻译的参数
                targetURL.searchParams.append('notranslate', 'true');
                
                // 跳转前先设置一个会话存储标记
                sessionStorage.setItem('disableAutoTranslate', 'true');
                
                window.location.href = targetURL.toString();
                return;
            }
        }

        // 如果没有找到语言链接,则尝试智能转换
        let newURL;

        // 检查当前页面是否有其他语言版本的链接
        const interwikiLink = document.querySelector(`a[hreflang="${targetLang}"]`);
        if (interwikiLink) {
            const targetURL = new URL(interwikiLink.href);
            targetURL.searchParams.append('notranslate', 'true');
            newURL = targetURL.toString();
        } else {
            // 如果没有直接的语言链接,保持当前页面标题
            const pageName = currentURL.split('/wiki/')[1];
            if (targetLang === 'zh') {
                newURL = `https://zh.wikipedia.org/wiki/${pageName}?notranslate=true`;
            } else {
                newURL = `https://en.wikipedia.org/wiki/${pageName}?notranslate=true`;
            }
        }

        // 设置会话存储标记
        sessionStorage.setItem('disableAutoTranslate', 'true');
        window.location.href = newURL;
    }

    // 在页面加载时禁用自动翻译
    function disableAutoTranslate() {
        if (sessionStorage.getItem('disableAutoTranslate')) {
            // 添加禁止翻译的元标记
            const meta = document.createElement('meta');
            meta.name = 'google';
            meta.content = 'notranslate';
            document.head.appendChild(meta);

            // 给body添加notranslate类
            document.body.classList.add('notranslate');
            
            // 设置translate属性
            document.documentElement.setAttribute('translate', 'no');
            
            // 清除会话存储标记
            sessionStorage.removeItem('disableAutoTranslate');
        }
    }

    // 添加DOM加载完成后的检查
    function ensureNavigationVisible() {
        const navigation = document.querySelector('.vector-sticky-pinned-container');
        if (navigation) {
            navigation.style.setProperty('display', 'block', 'important');
            navigation.style.setProperty('visibility', 'visible', 'important');
            navigation.style.setProperty('opacity', '1', 'important');
        }
    }

    // 启动程序
    init();
})(); 