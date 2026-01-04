// ==UserScript==
// @name         Porn Blocker | 色情内容过滤器
// @name:en      Porn Blocker
// @name:zh-CN   色情内容过滤器
// @name:zh-TW   色情內容過濾器
// @name:zh-HK   色情內容過濾器
// @name:ja      アダルトコンテンツブロッカー
// @name:ko      성인 컨텐츠 차단기
// @name:ru      Блокировщик порнографии
// @namespace    https://noctiro.moe
// @version      2.1.7
// @description     A powerful content blocker that helps protect you from inappropriate websites. Features: Auto-detection of adult content, Multi-language support, Smart scoring system, Safe browsing protection.
// @description:en     A powerful content blocker that helps protect you from inappropriate websites. Features: Auto-detection of adult content, Multi-language support, Smart scoring system, Safe browsing protection.
// @description:zh-CN 强大的网页过滤工具，帮助你远离不良网站。功能特点：智能检测色情内容，多语言支持，评分系统，安全浏览保护，支持自定义过滤规则。为了更好的网络环境，从我做起。
// @description:zh-TW 強大的網頁過濾工具，幫助你遠離不良網站。功能特點：智能檢測色情內容，多語言支持，評分系統，安全瀏覽保護，支持自定義過濾規則。為了更好的網絡環境，從我做起。
// @description:zh-HK 強大的網頁過濾工具，幫助你遠離不良網站。功能特點：智能檢測色情內容，多語言支持，評分系統，安全瀏覽保護，支持自定義過濾規則。為了更好的網絡環境，從我做起。
// @description:ja   アダルトコンテンツを自動的にブロックする強力なツールです。機能：アダルトコンテンツの自動検出、多言語対応、スコアリングシステム、カスタマイズ可能なフィルタリング。より良いインターネット環境のために。
// @description:ko   성인 컨텐츠를 자동으로 차단하는 강력한 도구입니다. 기능: 성인 컨텐츠 자동 감지, 다국어 지원, 점수 시스템, 안전 브라우징 보호, 맞춤형 필터링 규칙。
// @description:ru   Мощный инструмент для блокировки неприемлемого контента. Функции: автоматическое определение, многоязычная поддержка, система оценки, настраиваемые правила фильтрации。
// @author       Noctiro
// @license      Apache-2.0
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+CiA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRjhBNjUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAiIHN0b3AtY29sb3I9IiNGRkQ1NEYiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiA8L2RlZnM+CiA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9InVybCgjZ3JhZCkiIHJ4PSI4IiByeT0iOCI+PC9yZWN0PgogPHRleHQgeD0iMzIiIHk9IjQ2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIj5SMTg8L3RleHQ+CiA8bGluZSB4MT0iMTIiIHkxPSIxMiIgeDI9IjUyIiB5Mj0iNTIiIHN0cm9rZT0iI0QzMkYyRiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+
// @match        *://*/*
// @run-at       document-start
// @run-at       document-end
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/526908/Porn%20Blocker%20%7C%20%E8%89%B2%E6%83%85%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526908/Porn%20Blocker%20%7C%20%E8%89%B2%E6%83%85%E5%86%85%E5%AE%B9%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 多语言支持 =====
    const i18n = {
        'en': {
            title: '🚫 Access Denied',
            message: 'This page contains content that may harm your well-being.',
            redirect: 'You will be redirected in <span class="countdown">4</span> seconds…',
            footer: 'Cherish your mind · Stay away from harmful sites',
            debug: {
                reason: 'Block Reason (for false positive report):',
                score: 'Score:',
                keywords: 'Matched Keywords:',
                url: 'URL:'
            }
        },
        'zh-CN': {
            title: '🚫 访问受限',
            message: '该页面包含有害信息，可能危害您的身心健康。',
            redirect: '将在 <span class="countdown">4</span> 秒后自动跳转……',
            footer: '珍爱健康 · 远离有害信息',
            debug: {
                reason: '拦截原因(若误报，反馈时请提供):',
                score: '总分:',
                keywords: '命中关键词:',
                url: 'URL:'
            }
        },
        'zh-TW': {
            title: '🚫 存取受限',
            message: '此頁面含有有害資訊，可能危害您的身心健康。',
            redirect: '將於 <span class="countdown">4</span> 秒後自動跳轉……',
            footer: '珍愛健康 · 遠離有害資訊',
            debug: {
                reason: '攔截原因(如誤判請回報):',
                score: '總分:',
                keywords: '命中關鍵詞:',
                url: 'URL:'
            }
        },
        'zh-HK': {
            title: '🚫 存取受限',
            message: '此網頁含有有害資訊，或會損害您的身心健康。',
            redirect: '<span class="countdown">4</span> 秒後將自動引導離開……',
            footer: '珍重健康 · 遠離有害內容',
            debug: {
                reason: '攔截原因(如誤判請回報):',
                score: '總分:',
                keywords: '命中關鍵詞:',
                url: 'URL:'
            }
        },
        'ja': {
            title: '🚫 アクセス制限',
            message: 'このページには心身に悪影響を及ぼす可能性のある情報が含まれています。',
            redirect: '<span class="countdown">4</span> 秒後に自動的にページが移動します……',
            footer: '心と体を大切に · 有害サイトに近づかない',
            debug: {
                reason: 'ブロック理由（誤判報告時にご記入ください）:',
                score: 'スコア:',
                keywords: '一致したキーワード:',
                url: 'URL:'
            }
        },
        'ko': {
            title: '🚫 접근 제한',
            message: '이 페이지에는 신체와 정신에 해를 끼칠 수 있는 정보가 포함되어 있습니다.',
            redirect: '<span class="countdown">4</span>초 후 자동으로 이동됩니다……',
            footer: '건강을 소중히 · 유해 사이트는 멀리',
            debug: {
                reason: '차단 사유(오탐 시 신고):',
                score: '점수:',
                keywords: '일치 키워드:',
                url: 'URL:'
            }
        },
        'ru': {
            title: '🚫 Доступ ограничен',
            message: 'Эта страница содержит материалы, которые могут нанести вред вашему здоровью.',
            redirect: 'Перенаправление произойдёт через <span class="countdown">4</span> секунды……',
            footer: 'Берегите здоровье · Держитесь подальше от вредных сайтов',
            debug: {
                reason: 'Причина блокировки (для жалоб на ложные срабатывания):',
                score: 'Счёт:',
                keywords: 'Совпавшие ключевые слова:',
                url: 'URL:'
            }
        }
    };

    // ===== 工具函数 =====
    function getUserLanguage() {
        // 优先使用 navigator.languages
        const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || navigator.userLanguage];
        for (const lang of langs) {
            if (i18n[lang]) return lang;
            if (lang.startsWith('zh')) {
                const region = lang.toLowerCase();
                if (region.includes('tw') || region.includes('hant')) return 'zh-TW';
                if (region.includes('hk')) return 'zh-HK';
                return 'zh-CN';
            }
            const shortLang = lang.split('-')[0];
            if (i18n[shortLang]) return shortLang;
        }
        return 'en';
    }

    function getBrowserType() {
        const ua = navigator.userAgent.toLowerCase();

        // 1. User-Agent Client Hints (modern Chromium-based browsers)
        if (navigator.userAgentData && Array.isArray(navigator.userAgentData.brands)) {
            const brands = navigator.userAgentData.brands.map(b => b.brand.toLowerCase());
            if (brands.includes('microsoft edge')) return 'edge';
            if (brands.includes('google chrome')) return 'chrome';
            if (brands.includes('brave')) return 'brave';
            if (brands.includes('vivaldi')) return 'vivaldi';
            if (brands.includes('opera') || brands.includes('opr')) return 'opera';
            if (brands.includes('arc')) return 'arc';
            // If none of the above, it's some other Chromium variant
            if (brands.includes('chromium')) return 'chromium';
        }

        // 2. Arc-specific CSS variable detection (Arc adds --arc-palette-background)
        if (window.getComputedStyle(document.documentElement)
            .getPropertyValue('--arc-palette-background')) {
            return 'arc';
        }

        // 3. Traditional UA substring checks for non-Chromium or unhinted cases
        if (ua.includes('ucbrowser')) return 'uc';
        if (ua.includes('qqbrowser')) return 'qq';
        if (ua.includes('2345explorer')) return '2345';
        if (ua.includes('360') || ua.includes('qihu')) return '360';
        if (ua.includes('maxthon')) return 'maxthon';
        if (ua.includes('via')) return 'via';
        if (ua.includes('waterfox')) return 'waterfox';
        if (ua.includes('palemoon')) return 'palemoon';
        if (ua.includes('torbrowser') || (ua.includes('firefox') && ua.includes('tor'))) return 'tor';
        if (ua.includes('focus')) return 'firefox-focus';
        if (ua.includes('firefox')) return 'firefox';
        if (ua.includes('edg/')) return 'edge'; // Edge Chromium
        if (ua.includes('opr/') || ua.includes('opera')) return 'opera';
        if (ua.includes('brave')) return 'brave';
        if (ua.includes('vivaldi')) return 'vivaldi';
        if (ua.includes('yabrowser')) return 'yandex';

        if (ua.includes('chrome')) return 'chrome';
        if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';

        return 'other';
    }

    function getHomePageUrl() {
        switch (getBrowserType()) {
            case 'firefox': return 'about:home';
            case 'tor': return 'about:home'; // Tor uses Firefox's UI
            case 'waterfox': return 'about:home'; // Waterfox mirrors Firefox
            case 'palemoon': return 'about:home'; // Pale Moon custom but similar
            case 'chrome': return 'chrome://newtab';
            case 'edge': return 'edge://newtab';
            case 'safari': return 'topsites://';
            case 'opera': return 'opera://startpage';
            case 'brave': return 'brave://newtab';
            case 'vivaldi': return 'vivaldi://newtab';
            case 'yandex': return 'yandex://newtab';
            case 'arc': return 'arc://start'; // Arc’s default start page
            case 'via': return 'via://home';
            // Fallbacks for lesser-known or legacy browsers
            case 'uc': return 'ucenterhome://';
            case 'qq': return 'qbrowser://home';
            case '360': return 'se://newtab';
            case 'maxthon': return 'mx://newtab';
            case '2345': return '2345explorer://newtab';
            default: return 'about:blank';
        }
    }

    // ===== 配置项 =====
    const config = {
        // ================== 域名关键词 ==================
        domainDetection: {
            // 常见成人网站域名关键词（权重4）
            'pornhub': 4, 'xvideo': 4, 'redtube': 4,
            'xnxx': 4, 'xhamster': 4, '4tube': 4,
            'youporn': 4, 'spankbang': 4,
            'myfreecams': 4, 'missav': 4,
            'rule34': 4, 'youjizz': 4,
            'onlyfans': 4, 'paidaa': 4,
            'haijiao': 4,

            // 核心违规词（权重3-4）
            'porn': 3, 'nsfw': 3, 'hentai': 3,
            'incest': 4, 'rape': 4, 'childporn': 4,

            // 身体部位关键词（权重2）
            'pussy': 2, 'cock': 2, 'dick': 2,
            'boobs': 2, 'tits': 2, 'ass': 2,
            'beaver': 1,

            // 特定群体（权重2-3）
            'cuckold': 3, 'virgin': 2, 'luoli': 2,
            'gay': 2,

            // 具体违规行为（权重2-3）
            'blowjob': 3, 'creampie': 2,
            'bdsm': 2, 'masturbat': 2, 'handjob': 3,
            'footjob': 3, 'rimjob': 3,

            // 其他相关词汇（权重1-2）
            'camgirl': 2,
            'nude': 3, 'naked': 3, 'upskirt': 2,

            // 特定地区成人站点域名特征（权重4）
            'jav': 4,

            // 域名变体检测（权重3）
            'p0rn': 3, 'pr0n': 3, 'pron': 3,
            's3x': 3, 'sexx': 3,

            // 强豁免词（权重-30）
            'edu': -30, 'health': -30, 'medical': -30, 'science': -30,
            'gov': -30, 'org': -30, 'official': -30,

            // 常用场景豁免（权重-15）
            'academy': -15, 'clinic': -15, 'therapy': -15,
            'university': -4, 'research': -15, 'news': -15,
            'dictionary': -15, 'library': -15, 'museum': -15,

            // 动物/自然相关（权重-1）
            'animal': -4, 'zoo': -1, 'cat': -1, 'dog': -1,
            'pet': -6, 'bird': -1,

            // 科技类（权重-5）
            'tech': -5, 'cloud': -5, 'software': -5, 'cyber': -3,

            // 在线聊天/论坛常用词
            'forum': -10, 'bbs': -10, 'community': -10,
        },

        // ================== 内容检测 ==================
        contentDetection: {
            // 核心违规词（权重3-4）- 严格边界检测
            '\\b(?:porn|pr[o0]n)\\b': 3, // porn及其变体
            'nsfw': 3,
            '\\bhentai\\b': 3,
            '\\binces*t\\b': 4,
            '\\br[a@]pe\\b': 4,
            '(?:child|kid|teen)(?:porn)': 4,
            '海角社区': 4,

            // 身体部位关键词（权重2）- 边界和上下文检测
            'puss(?:y|ies)\\b': 2,
            '\\bco*ck(?:s)?(?!tail|roach|pit|er)\\b': 2, // 排除cocktail等
            '\\bdick(?:s)?(?!ens|tionary|tate)\\b': 2, // 排除dickens等
            '\\bb[o0]{2,}bs?\\b': 2,
            '\\btits?\\b': 2,
            '(?<!cl|gl|gr|br|m|b|h)ass(?:es)?(?!ign|et|ist|ume|ess|ert|embl|oci|ault|essment|emble|ume|uming|ured)\\b': 2, // 优化ass检测
            '\\bbeaver(?!s\\s+dam)\\b': 1, // 排除海狸相关

            // 特定群体（权重2-3）- 上下文敏感
            '\\bteen(?!age\\s+mutant)\\b': 3, // 排除 Teenage Mutant
            '\\bsis(?!ter|temp)\\b': 2, // 排除 sister, system
            '\\bmilfs?\\b': 2,
            '\\bcuck[o0]ld\\b': 3,
            '\\bvirgins?(?!ia|\\s+islands?)\\b': 2, // 排除地名
            'lu[o0]li': 2,
            '\\bg[a@]y(?!lord|le|le\\s+storm)\\b': 2, // 排除人名

            // 具体违规行为（权重2-3）- 严格检测
            '\\banal(?!ys[it]|og)\\b': 3, // 排除analysis等
            '\\bbl[o0]w\\s*j[o0]b\\b': 3,
            'cream\\s*pie(?!\\s+recipe)\\b': 2, // 排除食物相关
            '\\bbdsm\\b': 2,
            'masturba?t(?:ion|e|ing)\\b': 2,
            '\\bhand\\s*j[o0]b\\b': 3,
            '\\bf[o0]{2}t\\s*j[o0]b\\b': 3,
            '\\brim\\s*j[o0]b\\b': 3,

            // 新增违规行为（权重2-3）
            '\\bstr[i1]p(?:p(?:er|ing)|tease)\\b': 3,
            '\\bh[o0]{2}ker(?:s)?\\b': 3,
            'pr[o0]st[i1]tut(?:e|ion)\\b': 3,
            'b[o0]{2}ty(?!\\s+call)\\b': 2, // 排除 booty call
            'sp[a@]nk(?:ing)?\\b': 2,
            'deepthroat': 3,
            'bukk[a@]ke': 3,
            'org(?:y|ies)\\b': 3,
            'gangbang': 3,
            'thr[e3]{2}s[o0]me': 2,
            'c[u|v]msh[o0]t': 3,
            'f[e3]tish': 2,

            // 其他相关词汇（权重1-2）- 上下文敏感
            '\\bcamgirls?\\b': 2,
            '\\bwebcam(?!era)\\b': 2, // 排除webcamera
            '\\ble[a@]ked(?!\\s+(?:pipe|gas|oil))\\b': 2, // 排除工程相关
            '\\bf[a@]p(?:p(?:ing)?)?\\b': 2,
            '\\ber[o0]tic(?!a\\s+books?)\\b': 1, // 排除文学相关
            '\\besc[o0]rt(?!\\s+mission)\\b': 3, // 排除游戏相关
            '\\bnude(?!\\s+color)\\b': 3, // 排除色彩相关
            'n[a@]ked(?!\\s+juice)\\b': 3, // 排除品牌
            '\\bupskirt\\b': 2,
            '\\b[o0]nlyfans\\b': 3,

            // 多语言支持 (按原有配置)
            '情色': 3, '成人': 3, '做爱': 4,
            'セックス': 3, 'エロ': 3, '淫': 4,
            'секс': 3, 'порн': 3, '性爱': 3,
            '無修正': 3, 'ポルノ': 3, 'порно': 3,
            '色情': 3, '骚': 1, '啪啪': 2,
            '自慰': 3, '口交': 3, '肛交': 3,
            '吞精': 3, '诱惑': 1, '全裸': 3,
            '内射': 3, '乳交': 3, '射精': 3,
            '反差': 0.5, '调教': 1.5, '性交': 3,
            '性奴': 3, '高潮': 0.3, '白虎': 0.8,
            '少女': 0.1, '女友': 0.1, '狂操': 3,
            '捆绑': 0.1, '约炮': 3, '鸡吧': 3,
            '鸡巴': 3, '阴茎': 1, '阴道': 1,
            '女优': 3, '裸体': 3, '男优': 3,
            '乱伦': 3, '偷情': 2, '母狗': 3,
            '内射': 4, '喷水': 0.8, '潮吹': 3,
            '轮奸': 2, '少妇': 2, '熟女': 2,

            // 新增中文词汇（更细致的分级）
            '色情': 3, '情色': 3, '黄色': 2,
            '淫(?:秽|荡|乱|贱|液|穴|水)': 4,
            '肉(?:棒|根|穴|缝|臀|奶|体|欲)': 3,
            '(?:巨|大|小|翘|白|圆|肥)(?:乳|臀|胸)': 2,
            '(?:舔|添|吸|吮|插|干|操|草|日|艹)(?:穴|逼|屄|阴|蜜|菊|屌|鸡|肉)': 4,
            '(?:销|骚|浪|淫)(?:魂|女|货|逼|贱|荡)': 3,

            // 新增日语词汇
            'オナニー': 3, // 自慰
            '手コキ': 3, // 手淫
            'パイズリ': 3, // 乳交
            '中出し': 4, // 中出
            '素人': 2, // 素人
            'アヘ顔': 3, // 阿黑颜
            '痴女': 3, // 痴女
            '処女': 2, // 处女

            // 新增韩语词汇
            '섹스': 3, // 性
            '야동': 3, // 成人视频
            '자위': 2, // 自慰
            '음란': 3, // 淫乱
            '성인': 2, // 成人
            '누드': 2, // 裸体

            // 新兴词汇、变体、谐音、emoji（权重2-4）
            // 英文新兴变体
            'lewd': 2, 'fap': 2, 'simp': 2, 'thicc': 2, 'bussy': 2, 'sloot': 2, 'nut': 2, 'noods': 2, 'lewdies': 2,
            'camwhore': 3, 'onlyfams': 3, 'fansly': 3, 'sugardaddy': 2, 'sugarbaby': 2, 'egirl': 2, 'eboy': 2,
            // 谐音与变体
            'pron': 3, 'prawn': 2, 'p0rn': 3, 's3x': 3, 'shex': 2, 'seggs': 2, 's3ggs': 2, 'sx': 2,
            'lo1i': 3, 'l0li': 3, 'loli': 3, 'shota': 3, 'sh0ta': 3, 'sh0t4': 3, '萝莉': 3, '正太': 3,
            // emoji
            '🍆': 0.5, '👅': 0.5, '👙': 0.5, '👠': 0.5, '👄': 0.5, '🔞': 2,
            // 新兴中文网络词
            '涩涩': 2, '涩图': 2, '涩气': 2, '涩女': 2, '涩男': 2, '涩会': 2, '涩图群': 2, '涩图包': 2, '涩图控': 2,
            '色批': 2, '色图': 2, '色气': 2, '色女': 2, '色男': 2, '色会': 2, '色图群': 2, '色图包': 2, '色图控': 2,
            '约p': 3, '约啪': 3, '约炮': 3, '约x': 3, '约会炮': 3, '约会啪': 3, '约会p': 3, '约会x': 3,
            // 日语新兴词
            'エッチ': 2, 'えっち': 2, 'えちえち': 2, 'えち': 2, 'エロい': 2, 'エロ画像': 2, 'エロ動画': 2,
            // 韩语新兴词
            '야짤': 2, '야사': 2, '야한': 2, '야동': 3, '야설': 2,
        },

        // ================== 安全网站白名单（主域名，自动支持子域名） ==================
        safeSites: [
            // 搜索引擎
            'google.com', 'bing.com', 'baidu.com', 'yahoo.com', 'duckduckgo.com',
            'yandex.com', 'so.com', 'sogou.com', 'sm.cn', 'brave.com',
            'ecosia.org', 'qwant.com', 'searx.me', 'startpage.com', 'you.com',
            'naver.com', 'daum.net', 'ask.com', 'aol.com',

            // 社交媒体
            'reddit.com', 'weibo.com', 'bilibili.com', 'zhihu.com', 'douban.com',
            'discord.com', 'telegram.org', 'facebook.com', 'twitter.com', 'instagram.com',
            'linkedin.com', 'quora.com', 'pinterest.com', 'tumblr.com', 'wordpress.com',
            'tiktok.com',

            // 开发相关
            'stackoverflow.com', 'github.com', 'gitlab.com', 'gitee.com', 'bitbucket.org',
            'sourceforge.net', 'csdn.net', 'oschina.net', 'jianshu.com', '51cto.com',
            'segmentfault.com',

            // 云服务
            'cloud.tencent.com', 'aliyun.com', 'huaweicloud.com',
            'dropbox.com', 'microsoft.com', 'apple.com', 'adobe.com',

            // 视频网站
            'netflix.com', 'youtube.com', 'vimeo.com',

            // 购物网站
            'amazon.com', 'aliexpress.com', 'taobao.com', 'jd.com', 'tmall.com',

            // 中文网站
            '163.com', 'sina.com', 'sohu.com', 'ifeng.com', 'qq.com',

            // 通讯工具
            'slack.com', 'whatsapp.com', 'wechat.com', 'line.me', 'viber.com',

            // 教育机构域名后缀（这些会被单独处理）
            'edu', 'gov', 'org'
        ],

        // ================== 阈值配置 ==================
        thresholds: {
            block: 3,
            path: 2
        },

        // ================== 内容检测配置 ==================
        contentCheck: {
            // 成人内容分数
            adultContentThreshold: 25,
            suspiciousTagNames: [
                // 主要内容区域
                'article', 'main', 'section', 'content',
                // 文本块
                'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                // 列表和表格
                'li', 'td', 'th', 'figcaption',
                // 链接和按钮文本
                'a', 'button',
                // 通用容器
                'div.content', 'div.text', 'div.description',
                'span.text', 'span.content'
            ],
            // 文本节点最小长度
            textNodeMinLength: 5,
            // 防抖等待时间（毫秒）
            debounceWait: 1000,
            // 观察者最大运行时间（毫秒）
            observerTimeout: 30000,
            // 添加局部内容检测配置
            localizedCheck: {
                // 单个元素的内容阈值，超过此值才会影响整体评分
                elementThreshold: 8,
                // 需要触发的违规元素数量
                minViolationCount: 3,
                // 违规内容占总内容的比例阈值
                violationRatio: 0.3,
                // 排除检测的元素
                excludeSelectors: [
                    '.comment', '.reply', '.user-content',
                    '[id*="comment"]', '[class*="comment"]',
                    '[id*="reply"]', '[class*="reply"]',
                    '.social-feed', '.user-post'
                ],
                // 高风险元素选择器（权重更高）
                highRiskSelectors: [
                    'article', 'main', '.main-content',
                    '.article-content', '.post-content'
                ]
            }
        }
    };

    // ===== 预编译正则 =====
    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function compileKeywordRegexes(obj) {
        return Object.entries(obj).map(([k, v]) => {
            // 1. /pattern/flags 形式
            if (k.startsWith('/') && (k.endsWith('/i') || k.endsWith('/gi'))) {
                const lastSlash = k.lastIndexOf('/');
                const pattern = k.slice(1, lastSlash);
                const flags = k.slice(lastSlash + 1);
                return { regex: new RegExp(pattern, flags), weight: v, raw: k };
            } else if (k.startsWith('/') && k.endsWith('/')) {
                return { regex: new RegExp(k.slice(1, -1)), weight: v, raw: k };
            }
            // 2. 纯单词（只含字母数字下划线），自动加\b
            else if (/^\w+$/.test(k)) {
                return { regex: new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i'), weight: v, raw: k };
            }
            // 3. 其它复杂正则，直接用，不加\b
            else {
                return { regex: new RegExp(k, 'i'), weight: v, raw: k };
            }
        });
    }

    function compileSafeRegexes(domains) {
        return domains.map(domain => {
            // 检查是否为通用顶级域名（不包含点号）
            if (domain.indexOf('.') === -1) {
                // 通用顶级域名匹配，支持多级子域名
                return new RegExp(`^([^.]+\\.)*${domain}$`, 'i');
            } else {
                // 主域名及其子域名匹配
                // 转义点号，并创建匹配主域名或其任意层级子域名的正则
                const escapedDomain = domain.replace(/\./g, '\\.');
                return new RegExp(`^([^.]+\\.)*${escapedDomain}$`, 'i');
            }
        });
    }

    const compiledDomainRegexes = compileKeywordRegexes(config.domainDetection);
    const compiledContentRegexes = compileKeywordRegexes(config.contentDetection);
    const compiledSafeSites = compileSafeRegexes(config.safeSites);

    function isSafeSite(hostname) {
        return compiledSafeSites.some(re => re.test(hostname));
    }

    // ===== 评分函数 =====
    function calculateScore(text, isDomain = false) {
        if (!text) return 0;
        let score = 0;

        // 如果是安全网站，直接返回负分
        if (isDomain && isSafeSite(text)) {
            return -30;
        }

        // 使用对应的规则集进行评分
        const regexSet = isDomain ? compiledDomainRegexes : compiledContentRegexes;

        for (const { regex, weight, raw } of regexSet) {
            const matches = text.match(regex);
            if (matches) {
                // 代数和：正负分数直接相加
                score += weight * matches.length;
            }
        }

        return score;
    }

    function getAllVisibleText(element) {
        if (!element) return "";
        const textSet = new Set();
        try {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (!parent ||
                            /^(SCRIPT|STYLE|NOSCRIPT|IFRAME|META|LINK)$/i.test(parent.tagName) ||
                            parent.hidden ||
                            getComputedStyle(parent).display === 'none' ||
                            getComputedStyle(parent).visibility === 'hidden' ||
                            getComputedStyle(parent).opacity === '0') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        const text = node.textContent.trim();
                        if (!text || text.length < config.contentCheck.textNodeMinLength) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            let node;
            while (node = walker.nextNode()) {
                textSet.add(node.textContent.trim());
            }
        } catch (e) { }
        return Array.from(textSet).join(' ');
    }

    // ===== 敏感词超级正则编译 =====
    function buildSuperRegexAndMap(obj) {
        const entries = Object.entries(obj);
        const groupMap = {};
        let groupIndex = 1;
        let patternParts = [];
        for (const [k, v] of entries) {
            let pattern = '';
            // 1. /pattern/flags 形式
            if (k.startsWith('/') && (k.endsWith('/i') || k.endsWith('/gi'))) {
                const lastSlash = k.lastIndexOf('/');
                pattern = k.slice(1, lastSlash);
            } else if (k.startsWith('/') && k.endsWith('/')) {
                pattern = k.slice(1, -1);
            } else if (/^\w+$/.test(k)) {
                pattern = `\\b${escapeRegExp(k)}\\b`;
            } else {
                pattern = k;
            }
            // 用命名分组区分
            const groupName = `kw${groupIndex}`;
            patternParts.push(`(?<${groupName}>${pattern})`);
            groupMap[groupName] = { raw: k, weight: v };
            groupIndex++;
        }
        const superPattern = patternParts.join('|');
        const superRegex = new RegExp(superPattern, 'gi');
        return { superRegex, groupMap };
    }

    // ===== 重新编译敏感词超级正则 =====
    const { superRegex: contentSuperRegex, groupMap: contentGroupMap } = buildSuperRegexAndMap(config.contentDetection);

    // ===== detectAdultContent 优化：超级正则批量检测 =====
    function detectAdultContent(debug = false) {
        let totalScore = 0;
        let matches = [];
        let textSet = new Set();
        try {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        const parent = node.parentElement;
                        if (!parent ||
                            /^(SCRIPT|STYLE|NOSCRIPT|IFRAME|META|LINK)$/i.test(parent.tagName) ||
                            parent.hidden ||
                            getComputedStyle(parent).display === 'none' ||
                            getComputedStyle(parent).visibility === 'hidden' ||
                            getComputedStyle(parent).opacity === '0') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        const text = node.textContent.trim();
                        if (!text || text.length < config.contentCheck.textNodeMinLength) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );
            let node;
            while (node = walker.nextNode()) {
                textSet.add(node.textContent.trim());
            }
        } catch (e) { }
        const allText = Array.from(textSet).join(' ').slice(0, 10000);
        // 超级正则批量检测
        let m;
        while ((m = contentSuperRegex.exec(allText)) !== null) {
            for (const group in m.groups) {
                if (m.groups[group]) {
                    const info = contentGroupMap[group];
                    totalScore += info.weight;
                    matches.push(info.raw);
                }
            }
        }
        // 图片alt/title检测
        const images = document.querySelectorAll('img[alt], img[title]');
        for (const img of images) {
            const imgText = `${img.alt} ${img.title}`.trim();
            if (imgText) {
                let m2;
                while ((m2 = contentSuperRegex.exec(imgText)) !== null) {
                    for (const group in m2.groups) {
                        if (m2.groups[group]) {
                            const info = contentGroupMap[group];
                            totalScore += info.weight * 0.3;
                            matches.push(info.raw);
                        }
                    }
                }
            }
        }
        // meta标签检测
        const metaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"]');
        for (const meta of metaTags) {
            const content = meta.content;
            if (content) {
                let m3;
                while ((m3 = contentSuperRegex.exec(content)) !== null) {
                    for (const group in m3.groups) {
                        if (m3.groups[group]) {
                            const info = contentGroupMap[group];
                            totalScore += info.weight * 0.2;
                            matches.push(info.raw);
                        }
                    }
                }
            }
        }
        const isHighRisk = totalScore >= config.contentCheck.adultContentThreshold;
        if (debug) {
            return {
                detected: isHighRisk,
                score: totalScore,
                matches: Array.from(new Set(matches)).filter(Boolean)
            };
        }
        return isHighRisk;
    }

    // ===== 黑名单管理器 =====
    async function gmGet(key, def) {
        if (typeof GM_getValue === 'function') {
            const v = await GM_getValue(key);
            return v === undefined ? def : v;
        }
        return def;
    }

    async function gmSet(key, value) {
        if (typeof GM_setValue === 'function') {
            await GM_setValue(key, value);
        }
    }

    function createBlacklistEntry(host, reason = '', note = '') {
        return {
            host,
            reason,
            note,
            added: Date.now(),
            expire: getExpireTimestamp(),
            version: blacklistManager.CURRENT_VERSION
        };
    }

    function getExpireTimestamp() {
        const BLACKLIST_EXPIRE_DAYS = 30;
        return Date.now() + BLACKLIST_EXPIRE_DAYS * 24 * 60 * 60 * 1000;
    }

    const blacklistManager = {
        BLACKLIST_KEY: 'pornblocker-blacklist',
        BLACKLIST_VERSION_KEY: 'pornblocker-blacklist-version',
        CURRENT_VERSION: '3.0', // 升级数据库版本，弃用旧数据

        // 只在版本号不一致时清空旧数据
        async checkAndUpgradeVersion() {
            const storedVersion = await gmGet(this.BLACKLIST_VERSION_KEY, null);
            if (storedVersion !== this.CURRENT_VERSION) {
                await GM_setValue(this.BLACKLIST_VERSION_KEY, this.CURRENT_VERSION);
                await GM_setValue(this.BLACKLIST_KEY, []);
            }
        },

        // 获取黑名单
        async getBlacklist() {
            // 确保版本检查已完成
            await this.checkAndUpgradeVersion();

            let data = await gmGet(this.BLACKLIST_KEY, []);
            // 自动清理过期和升级结构
            const now = Date.now();
            let changed = false;
            const valid = (Array.isArray(data) ? data : []).filter(item => {
                if (typeof item === 'string') return true; // 兼容老数据
                if (item && item.host && item.expire && item.expire > now) return true;
                changed = true;
                return false;
            }).map(item => {
                if (typeof item === 'string') {
                    changed = true;
                    let entry = createBlacklistEntry(item, 'legacy', '自动升级');
                    // 补全debugInfo字段
                    entry.debugInfo = { reason: 'legacy', score: 0, matches: [], time: Date.now(), url: '' };
                    return entry;
                }
                // 结构升级：补全缺失字段
                if (!item.version) item.version = this.CURRENT_VERSION;
                if (!item.added) item.added = now;
                if (!item.reason) item.reason = '';
                if (!item.note) item.note = '';
                // 补全debugInfo字段
                if (!item.debugInfo) {
                    item.debugInfo = { reason: item.reason || 'blacklist', score: item.score || 0, matches: item.matches || [], time: item.added, url: '' };
                } else {
                    if (!item.debugInfo.reason) item.debugInfo.reason = item.reason || 'blacklist';
                    if (item.debugInfo.score == null && item.score != null) item.debugInfo.score = item.score;
                    if (!item.debugInfo.matches) item.debugInfo.matches = item.matches || [];
                    if (!item.debugInfo.time) item.debugInfo.time = item.added;
                    if (!item.debugInfo.url) item.debugInfo.url = '';
                }
                return item;
            });
            if (changed) {
                this.saveBlacklist(valid);
            }
            return valid;
        },

        async saveBlacklist(list) {
            await gmSet(this.BLACKLIST_KEY, list);
        },

        async addToBlacklist(hostname, reason = '', note = '', debugInfo = undefined) {
            if (!hostname) return false;
            // 安全站点检查，禁止加入黑名单
            if (isSafeSite(hostname)) {
                return false;
            }
            let list = await this.getBlacklist();
            if (list.some(item => (typeof item === 'string' ? item : item.host) === hostname)) return true;
            let entry = createBlacklistEntry(hostname, reason, note);
            // 修正：始终保存debugInfo字段，且补全reason/score/matches
            if (!debugInfo) debugInfo = {};
            if (!debugInfo.reason) debugInfo.reason = reason || 'blacklist';
            if (debugInfo.score == null && entry.score != null) debugInfo.score = entry.score;
            if (!debugInfo.matches) debugInfo.matches = [];
            debugInfo.time = Date.now();
            debugInfo.url = window.location ? window.location.href : '';
            entry.debugInfo = debugInfo;
            list.push(entry);
            await this.saveBlacklist(list);
            return true;
        },

        async isBlacklisted(hostname) {
            let list = await this.getBlacklist();
            return list.some(item => (typeof item === 'string' ? item : item.host) === hostname);
        },

        async removeFromBlacklist(hostname) {
            let list = await this.getBlacklist();
            list = list.filter(item => (typeof item === 'string') ? item : item.host !== hostname);
            await this.saveBlacklist(list);
            return true;
        },

        // 新增批量清理过期条目方法
        async cleanExpired() {
            let list = await this.getBlacklist();
            const now = Date.now();
            const valid = list.filter(item => (typeof item === 'string') || (item && item.expire && item.expire > now));
            await this.saveBlacklist(valid);
            return valid.length;
        }
    };

    // 立即执行版本检查
    (async function initBlacklist() {
        await blacklistManager.checkAndUpgradeVersion();
    })();

    // ===== 检测主流程 =====
    const regexCache = {
        domainRegex: new RegExp(Object.keys(config.domainDetection).join('|'), 'gi'),
        xxxRegex: /\.xxx$/i
    };

    function checkDomainPatterns(hostname) {
        return regexCache.xxxRegex.test(hostname);
    }

    async function checkUrl() {
        const url = new URL(window.location.href);
        const hostname = url.hostname;

        // 优先检查安全网站，如果是安全网站直接返回不拦截
        if (isSafeSite(hostname)) {
            return { shouldBlock: false, url };
        }

        // 从黑名单读取调试信息
        const blackList = await blacklistManager.getBlacklist();
        const blackEntry = blackList.find(item => (typeof item === 'string' ? item : item.host) === hostname);
        if (blackEntry) {
            let debugInfo = blackEntry.debugInfo || {};
            debugInfo.reason = (debugInfo.reason || blackEntry.reason || 'blacklist') + ' (blacklist)';
            debugInfo.score = debugInfo.score != null ? debugInfo.score : blackEntry.score;
            debugInfo.matches = debugInfo.matches || blackEntry.matches || [];
            debugInfo.time = blackEntry.added;
            debugInfo.url = window.location.href;
            return { shouldBlock: true, url, reason: debugInfo.reason, debugInfo };
        }

        // 检查域名模式
        if (checkDomainPatterns(hostname)) {
            const debugInfo = { reason: 'domain-pattern', score: undefined, matches: [], time: Date.now(), url: window.location.href };
            await blacklistManager.addToBlacklist(hostname, 'domain-pattern', '', debugInfo);
            return { shouldBlock: true, url, reason: 'domain-pattern', debugInfo };
        }

        // 检查域名评分
        let score = calculateScore(hostname, true);
        if (score >= config.thresholds.block) {
            const debugInfo = {
                reason: 'domain',
                score: score,
                matches: [],
                time: Date.now(),
                url: window.location.href
            };
            await blacklistManager.addToBlacklist(hostname, 'domain', '', debugInfo);
            return { shouldBlock: true, url, reason: 'domain', score, debugInfo };
        }

        // 检查标题是否违规
        const currentTitle = document.title;
        if (currentTitle) {
            const titleScore = calculateScore(currentTitle);
            if (titleScore >= config.thresholds.block * 0.75) { // 标题评分阈值降低25%
                let matches = [];
                for (const { regex, raw } of compiledContentRegexes) {
                    if (regex.test(currentTitle)) {
                        matches.push(raw);
                    }
                }
                const debugInfo = {
                    reason: 'title',
                    score: titleScore,
                    matches: matches,
                    time: Date.now(),
                    url: window.location.href
                };
                await blacklistManager.addToBlacklist(hostname, 'title', '', debugInfo);
                return { shouldBlock: true, url, reason: 'title', score: titleScore, matches, debugInfo };
            }
        }

        // URL路径检查
        const path = url.pathname + url.search;
        const pathScore = calculateScore(path) * 0.4; // 路径评分权重降低
        if (pathScore >= config.thresholds.block) {
            const debugInfo = {
                reason: 'path',
                score: pathScore,
                matches: [],
                time: Date.now(),
                url: window.location.href
            };
            await blacklistManager.addToBlacklist(hostname, 'path', '', debugInfo);
            return { shouldBlock: true, url, reason: 'path', score: pathScore, debugInfo };
        }

        // 内容检测
        if (document.body) {
            const contentResult = detectAdultContent(true);
            if (contentResult.detected) {
                const debugInfo = { reason: 'content', score: contentResult.score, matches: contentResult.matches, time: Date.now(), url: window.location.href };
                await blacklistManager.addToBlacklist(hostname, 'content', '', debugInfo);
                return { shouldBlock: true, url, reason: 'content', score: contentResult.score, matches: contentResult.matches, debugInfo };
            }
            enhancedDynamicContentCheck();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                const contentResult = detectAdultContent(true);
                if (contentResult.detected) {
                    const debugInfo = { reason: 'content', score: contentResult.score, matches: contentResult.matches, time: Date.now(), url: window.location.href };
                    blacklistManager.addToBlacklist(hostname, 'content', '', debugInfo);
                    handleBlockedContent(debugInfo);
                }
                enhancedDynamicContentCheck();
            });
        }

        // 所有检查通过，不拦截
        return { shouldBlock: false, url };
    }

    // ===== 动态内容与标题检测 =====
    function enhancedDynamicContentCheck() {
        // 智能动态内容检测：结合 MutationObserver 和递增定时检测
        const hostname = window.location.hostname;
        let triggered = false;
        let interval = 3000; // 初始间隔3秒
        const maxInterval = 12000; // 最大间隔12秒
        let timer = null;
        let count = 0;
        let lastMutationTime = Date.now();
        let pendingImmediateCheck = false;

        function checkAndBlock(immediate = false) {
            if (triggered) return;
            const contentResult = detectAdultContent(true);
            if (contentResult.detected) {
                triggered = true;
                const debugInfo = { reason: 'dynamic-content', score: contentResult.score, matches: contentResult.matches, time: Date.now(), url: window.location.href };
                blacklistManager.addToBlacklist(hostname, 'dynamic-content', '', debugInfo);
                handleBlockedContent(debugInfo);
                if (timer) clearTimeout(timer);
                observer.disconnect();
                return;
            }
            // 递增间隔，最大不超过15秒
            if (!immediate) {
                count++;
                interval = Math.min(5000 + count * 1000, maxInterval);
                timer = setTimeout(() => checkAndBlock(false), interval);
            }
        }

        // MutationObserver 监听大规模变动
        const observer = new MutationObserver((mutations) => {
            if (triggered) return;
            let majorChange = false;
            for (const m of mutations) {
                // 只要有主要内容区域变动或节点大增减就算大变动
                if (
                    (m.target && m.target.nodeType === 1 && (
                        m.target.matches && (
                            m.target.matches('main, article, section, .main-content, .article-content, .post-content')
                        )
                    )) ||
                    (m.addedNodes && m.addedNodes.length > 5) ||
                    (m.removedNodes && m.removedNodes.length > 5)
                ) {
                    majorChange = true;
                    break;
                }
            }
            if (majorChange) {
                // 立即检测
                if (!pendingImmediateCheck) {
                    pendingImmediateCheck = true;
                    setTimeout(() => {
                        checkAndBlock(true);
                        pendingImmediateCheck = false;
                    }, 200); // 稍作防抖
                }
            } else {
                // 小变动，刷新递增定时器
                lastMutationTime = Date.now();
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => checkAndBlock(false), interval);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        // 首次检测延迟0.5秒
        timer = setTimeout(() => checkAndBlock(false), 500);

        // 超时自动断开 observer
        setTimeout(() => {
            observer.disconnect();
            if (timer) clearTimeout(timer);
        }, 30000);
    }

    const setupTitleObserver = () => {
        let titleObserver = null;
        try {
            // 监听 title 标签变化
            const titleElement = document.querySelector('title');
            if (titleElement) {
                titleObserver = new MutationObserver(async (mutations) => {
                    for (const mutation of mutations) {
                        const newTitle = mutation.target.textContent;
                        if (!newTitle) continue;
                        console.log(`[Title Change] New title: "${newTitle}"`);

                        // 使用 contentDetection 的规则计算标题分数
                        const titleScore = calculateScore(newTitle || "");
                        // 标题分数权重提高 (因为标题更重要)
                        if (titleScore >= config.thresholds.block * 0.75) {
                            console.log(`[Title Score] ${titleScore} exceeds threshold`);
                            const hostname = window.location.hostname;

                            // 收集匹配到的关键词
                            let matches = [];
                            for (const { regex, raw } of compiledContentRegexes) {
                                if (regex.test(newTitle)) {
                                    matches.push(raw);
                                }
                            }

                            const debugInfo = {
                                reason: 'title',
                                score: titleScore,
                                matches: matches,
                                time: Date.now(),
                                url: window.location.href
                            };

                            await blacklistManager.addToBlacklist(hostname, 'title', '', debugInfo);
                            titleObserver.disconnect();
                            handleBlockedContent(debugInfo);
                            return;
                        }
                    }
                });

                titleObserver.observe(titleElement, {
                    subtree: true,
                    characterData: true,
                    childList: true
                });
            }

            // 监听 title 标签的添加
            const headObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'TITLE') {
                            setupTitleObserver();
                            headObserver.disconnect();
                            return;
                        }
                    }
                }
            });

            headObserver.observe(document.head, {
                childList: true,
                subtree: true
            });

            // 设置超时清理
            setTimeout(() => {
                titleObserver?.disconnect();
                headObserver?.disconnect();
            }, config.contentCheck.observerTimeout);

        } catch (e) {
            console.error('Error in setupTitleObserver:', e);
        }

        return titleObserver;
    };

    // ===== 拦截页面渲染 =====
    function getDebugInfo(result) {
        if (!result) return null;
        // 优先读取debugInfo并补全reason/score/matches
        if (result.debugInfo) {
            let info = { ...result.debugInfo };
            if (!info.reason && result.reason) info.reason = result.reason;
            if (info.score == null && result.score != null) info.score = result.score;
            if (!info.matches && result.matches) info.matches = result.matches;
            if (!info.time) info.time = Date.now();
            if (!info.url) info.url = window.location ? window.location.href : '';
            if (info.reason && !/\(blacklist\)/.test(info.reason)) {
                info.reason = info.reason + ' (blacklist)';
            }
            return info;
        }
        if (result.reason === 'content' || result.reason === 'dynamic-content') {
            return { reason: result.reason, score: result.score, matches: result.matches, time: Date.now(), url: window.location.href };
        }
        let score = result.score || 0;
        let matches = result.matches || [];
        return { reason: result.reason, score, matches, time: Date.now(), url: window.location.href };
    }

    const handleBlockedContent = (debugInfo) => {
        const lang = getUserLanguage();
        const text = i18n[lang];
        document.title = text.title;
        try { window.stop(); } catch (e) { /* ignore */ }
        // 调试信息展示（多语言，保证内容不为空）
        let debugHtml = '';
        if (debugInfo) {
            const d = (text.debug || i18n['en'].debug);
            const reason = debugInfo.reason || '-';
            const score = debugInfo.score != null ? debugInfo.score : '-';
            let keywords = '-';
            if (Array.isArray(debugInfo.matches) && debugInfo.matches.length > 0) {
                keywords = debugInfo.matches.join(', ');
            }
            // 保证每项单独一行且无多余换行
            let debugLines = [
                `<b>${d.reason}</b> ${reason}`,
                `<b>${d.score}</b> ${score}`,
                `<b>${d.keywords}</b> ${keywords}`
            ];
            if (debugInfo.time) debugLines.push(`<b>Time:</b> ${new Date(debugInfo.time).toLocaleString()}`);
            if (debugInfo.url) debugLines.push(`<b>${d.url}</b> ${debugInfo.url}`);
            debugHtml = `<div class="debug-info" style="margin-top:24px;text-align:left;font-size:13px;background:#fffbe6;border:1px solid #ffe58f;padding:12px 16px;border-radius:8px;color:#ad6800;word-break:break-all;">
                ${debugLines.join('<br>')}
            </div>`;
        }
        try {
            document.documentElement.innerHTML = `
            <body>
                <div class="container">
                    <div class="card">
                        <div class="icon-wrapper">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <h1>${text.title}</h1>
                        <p>${text.message}<br>${text.redirect}</p>
                        <div class="footer">${text.footer}</div>
                        ${debugHtml}
                    </div>
                </div>
                <style>
                    :root {
                        --bg-light: #f0f2f5;
                        --card-light: #ffffff;
                        --text-light: #2d3436;
                        --text-secondary-light: #636e72;
                        --text-muted-light: #b2bec3;
                        --accent-light: #ff4757;

                        --bg-dark: #1a1a1a;
                        --card-dark: #2d2d2d;
                        --text-dark: #ffffff;
                        --text-secondary-dark: #a0a0a0;
                        --text-muted-dark: #808080;
                        --accent-dark: #ff6b6b;
                    }

                    @media (prefers-color-scheme: dark) {
                        body {
                            background: var(--bg-dark) !important;
                        }
                        .card {
                            background: var(--card-dark) !important;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                        }
                        h1 { color: var(--text-dark) !important; }
                        p { color: var(--text-secondary-dark) !important; }
                        .footer { color: var(--text-muted-dark) !important; }
                        .icon-wrapper {
                            background: var(--accent-dark) !important; }
                        .countdown {
                            color: var(--accent-dark);
                        }
                    }

                    body {
                        background: var(--bg-light);
                        margin: 0;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .container {
                        max-width: 500px;
                        width: 100%;
                    }

                    .card {
                        background: var(--card-light);
                        border-radius: 16px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        padding: 32px;
                        text-align: center;
                        animation: slideIn 0.5s ease-out;
                    }

                    .icon-wrapper {
                        width: 64px;
                        height: 64px;
                        background: var(--accent-light);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        animation: pulse 2s infinite;
                    }

                    .icon-wrapper svg {
                        stroke: white;
                    }

                    h1 {
                        color: var(--text-light);
                        margin: 0 0 16px;
                        font-size: 24px;
                        font-weight: 600;
                    }

                    p {
                        color: var(--text-secondary-light);
                        margin: 0 0 24px;
                        line-height: 1.6;
                        font-size: 16px;
                    }

                    .footer {
                        color: var(--text-muted-light);
                        font-size: 14px;
                        animation: fadeIn 1s ease-out;
                    }

                    .countdown {
                        font-weight: bold;
                        color: var(--accent-light);
                    }

                    @keyframes slideIn {
                        from { transform: translateY(20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }

                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                        100% { transform: scale(1); }
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    .debug-info { user-select: text; }
                </style>
            </body>
        `;
        } catch (e) {
            // 兼容性容错：如果 innerHTML 报错，降级为简单跳转
            window.location.href = getHomePageUrl();
        }
        let timeLeft = 4;
        const countdownEl = document.querySelector('.countdown');
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                try {
                    const homeUrl = getHomePageUrl();
                    if (window.history.length > 1) {
                        const iframe = document.createElement('iframe');
                        iframe.style.display = 'none';
                        document.body.appendChild(iframe);

                        iframe.onload = () => {
                            try {
                                const prevUrl = iframe.contentWindow.location.href;
                                const prevScore = calculateScore(new URL(prevUrl).hostname, true);

                                if (prevScore >= config.thresholds.block) {
                                    window.location.href = homeUrl;
                                } else {
                                    window.history.back();
                                }
                            } catch (e) {
                                window.location.href = homeUrl;
                            }
                            document.body.removeChild(iframe);
                        };

                        iframe.src = 'about:blank';
                    } else {
                        window.location.href = homeUrl;
                    }
                } catch (e) {
                    window.location.href = getHomePageUrl();
                }
            }
        }, 1000);
    };

    // ===== 主入口 =====
    (async function () {
        const result = await checkUrl();
        if (result.shouldBlock || regexCache.xxxRegex.test(result.url.hostname)) {
            handleBlockedContent(getDebugInfo(result));
        } else {
            setupTitleObserver();
        }
    })();

    // ===== 自动清理黑名单（每天一次） =====
    (function autoCleanBlacklist() {
        try {
            const key = 'pornblocker-last-clean';
            const now = Date.now();
            let last = 0;
            try { last = parseInt(localStorage.getItem(key) || '0', 10); } catch (e) { }
            if (!last || now - last > 86400000) {
                blacklistManager.cleanExpired();
                localStorage.setItem(key, now.toString());
            }
        } catch (e) { }
    })();

})();