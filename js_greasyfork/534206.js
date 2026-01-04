// ==UserScript==
// @name         学习监督助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在打开特定网站时，替换指定选择器元素
// @author       L
// @match        *://*/*
// @grant        GM_addStyle
// @grant        window.close
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534206/%E5%AD%A6%E4%B9%A0%E7%9B%91%E7%9D%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534206/%E5%AD%A6%E4%B9%A0%E7%9B%91%E7%9D%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 标记和样式类 ---
    const MODIFIED_MARKER = 'data-learning-assistant-modified';
    const VISIBLE_CLASS = 'la-visible';
    const HIDING_STYLE_ID = 'learning-assistant-hiding-style';

    // --- 状态跟踪 ---
    const scheduledPostActions = {};

    // --- !!! 新增：警醒话语 ---
    const motivationalQuotes = [
        "无聊？那就驯服无聊。雕刻命运得靠心智自我引导：去构造使得自己不无聊的状态",
        "带着不适继续前行，突破边界逐步适应，日拱一卒匀速前进",
        "打发时间？滑动屏幕，不如雕刻肌肉",
        "与其在像素瀑布里打捞空虚，不如用雕刻肌肉对抗缺乏魅力",
        "不耐烦、无聊？凝视脑海中的深渊，深渊就会强化回响。放下，就会消失。",
        "我自己创业自然可以做到996",
        "现在不主动，永远是被动",
        "亲手选择杀死未来，或增援未来",
        "现在的逃避，是未来的“本可以”",
        "“就5分钟”会修改人生剧本——主角变群演",
        "拖延症患者的墓碑上永远刻着‘最佳准备期’——死于无限期预售",
        "你羡慕的逆袭故事，主角此刻正在戒掉你此刻沉迷的东西",
        "那个‘等有空再做’的梦想，最终会成为临终监护仪上的心电图杂波",
        "当算法成为你的新上帝，你供奉的祭品是自己未开发的大脑皮层",
        "你在短视频里见证千万种人生，唯独缺席了自己那版",
        "每次的“就一会儿”，都是中年危机的“就差一点”",
        "此刻若逃避，也会塑造第一反应，带来的困难将如同复利",
        "你在创造历史还是消费历史？此刻的行为正在投票",
        "当手指第37次下滑刷新时，人生进度条正被偷偷设置1.5倍速播放",
        "代价是真实世界那个可能更精彩的你",
        "你以为在kill time，其实是time在悄悄kill你",
        "当别人用你刷剧的时间在技能树上加点时，你的角色正在降级",
        "此刻的选择正在生成两种平行宇宙——你是自己人生的观测者坍缩者",
        "别再用“晚点做”喂养你的平庸了，行动！就现在！",
        "你所谓的“放松”，不过是给未来的自己挖坑。",
        "每一次向诱惑低头，都是对你梦想的一次背叛。",
        "别骗自己了，舒适区就是埋葬你潜力的温柔乡。",
        "拖延不是就一次“稍后再做”，拖延是“永不去做”的开始。",
        "放下工业生产的廉价快乐，才能用双手创造精彩的未来。",
        "“下次”和“明天”是失败者最动听的借口。你的行动呢？",
        "你不是没时间，你只是没把时间用在真正重要的事情上。",
        "停止幻想，开始做事。你的未来不是靠想出来的。",
        "感到痛苦？只是疲惫。休息一下继续出发：成长本就不该执着于舒适。",
        "不要等到后悔莫及，才想起本可以不一样的今天。",
        "真正杀死你的不是压力，而是你面对压力时的逃避。",
        "你刷掉的每一个短视频，都在拉开你和别人的差距。",
        "所谓的“选择困难”，常常只是“害怕失败”的伪装。",
        "别让任何人打乱你的节奏，除了那个“更好的自己”。",
        "你的天赋，经不起你日复一日的挥霍。",
        "今天重复昨天的活法，凭什么期待不一样的明天？",
        "放弃只需要一句话，成功却需要一辈子。别轻言放弃！",
        "你所浪费的今天，是昨天死去的人奢望的明天。",
        "每一次点击诱惑，都是对未来的一次背叛。",
    ];

    /**
     * 获取一句随机的警醒话语
     * @returns {string}
     */
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        return motivationalQuotes[randomIndex];
    }


    // --- 1. 配置规则 ---
    const rules = [
        {
            name: '屏蔽 Bilibili 推荐',
            match: (url) => url.includes('bilibili.com'),
            selector: '.feed-card, .bili-video-card__wrap, #reco_list, .recommend-container, [class*="recommend-list"], .vui_carousel, .floor-card, .bili-live-card',
            conditions: {
                // timeRanges: [ { start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' } ]
            },
            contentGenerator: (conditions, rule) => `
                <div style="padding: 20px 40px; text-align: center; border: 2px dashed #ccc; background-color: #f9f9f9; color: #333; min-height: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h2>学习时间！🚫</h2>
                    <b>无念即净</b>
                    <p style="font-style: italic; margin: 10px 0; color: #555;">"${getRandomQuote()}"</p>
                    <p style="font-size: small;">当前时段屏蔽 (生效于: ${conditions.timeRanges?.map(tr => `${tr.start}-${tr.end}`).join(', ') || '总是'})</p>
                    ${rule.postAction && scheduledPostActions[rule.name] ? `<p style="color: red; font-weight: bold; font-size: small;">将在 ${rule.postAction.delay / 1000} 秒后 ${rule.postAction.description || '执行后操作'}...</p>` : ''}
                </div>
            `,
            postAction: {
                delay: 60000, description: "自动关闭页面",
                action: function(rule) {
                    console.log(`[LA] 执行规则 "${rule.name}" 的网站级后操作：${this.description}`);
                    try { window.close(); setTimeout(() => window.location.href = 'about:blank', 100); }
                    catch (e) { console.warn('[LA] window.close() 被阻止，跳转'); window.location.href = 'about:blank'; }
                }
            }
        },
        {
            name: '屏蔽 YouTube 首页推荐',
            match: (url) => url.includes('youtube.com') && url.endsWith('youtube.com/'),
            selector: '#contents.ytd-rich-grid-renderer, ytd-browse[page-subtype="home"] #contents',
            conditions: { timeRanges: [ { start: '08:00', end: '22:00' } ] },
            contentGenerator: (conditions, rule) => `
                <div style="padding: 30px 50px; text-align: center; border: 3px solid red; background-color: #fff0f0; color: #333; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                     <h1>Focus on Your Goals! 🎯</h1>
                     <p style="font-style: italic; margin: 15px 0; color: #d32f2f;">"${getRandomQuote()}"</p>
                     <p style="font-size: small;">Distraction zone blocked.</p>
                </div>
            `
        },
        {
            name: '屏蔽知乎推荐',
            match: (url) => url.includes('zhihu.com'),
            selector: '.Topstory-recommend .Feed, .Card.TopstoryItem.TopstoryItem-isRecommend',
            conditions: {},
            contentGenerator: (conditions, rule) => `
                <div style="padding: 20px 30px; text-align: center; border: 2px solid orange; background-color: #fff8e1; color: #333; min-height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h2>别刷知乎了，去学习！📚</h2>
                    <b>无念即净</b>
                    <p style="font-style: italic; margin: 10px 0; color: #e65100;">"${getRandomQuote()}"</p>
                    ${rule.postAction && scheduledPostActions[rule.name] ? `<p style="font-size: small; color: grey;">将在 ${rule.postAction.delay / 1000} 秒后 ${rule.postAction.description || '执行后操作'}...</p>` : ''}
                </div>
            `,
             postAction: {
                 delay: 30000, description: "跳转到空白页",
                 action: function(rule) {
                     console.log(`[LA] 执行规则 "${rule.name}" 的网站级后操作：${this.description}`);
                     window.location.href = 'about:blank';
                 }
             }
        },
        // --- 在这里添加更多规则 ---
    ];

    // --- 2. 辅助函数 ---
    // isTimeWithinRange 和 checkConditions 函数保持不变 (省略)
    function isTimeWithinRange(start, end) { try { const now=new Date(), cM=now.getHours()*60+now.getMinutes(), [sH,sM]=start.split(':').map(Number), sS=sH*60+sM, [eH,eM]=end.split(':').map(Number), eE=eH*60+eM; return sS>eE ? cM>=sS||cM<eE : cM>=sS&&cM<eE; } catch(e){ console.error('[LA] 时间解析错误:',{start,end},e); return false; } }
    function checkConditions(conditions={}) { if (conditions.timeRanges?.length>0) { let tM=false; for(const r of conditions.timeRanges){ if(r.start&&r.end&&isTimeWithinRange(r.start, r.end)){ tM=true; break; } } if(!tM) return false; } return true; }

    /**
     * 生成并注入用于初始隐藏元素的 CSS
     * 使用 :where() 降低注入规则的特异性
     */
    function injectInitialCSS(rulesToInject) {
        const selectors = rulesToInject
            .map(rule => rule.selector)
            .filter(Boolean)
            // --- !!! 修改点： 使用 :where() ---
            .map(selector => `:where(${selector}):not(.${VISIBLE_CLASS})`)
            .join(',\n');

        if (selectors) {
            const css = `
/* CSS injected by Learning Assistant UserScript (v0.8) */
${selectors} {
    visibility: hidden !important;
    min-height: 30px !important; /* 保持占位 */
    /* border: 1px dotted lime !important; /* 调试用 */
}
`;
            const existingStyle = document.getElementById(HIDING_STYLE_ID);
            if (existingStyle) existingStyle.remove();
            const styleElement = GM_addStyle(css);
            styleElement.id = HIDING_STYLE_ID;
            console.log('[LA] 已注入初始隐藏 CSS (使用 :where):', rulesToInject.map(r=>r.selector).filter(Boolean).join(', '));
        } else {
            console.log('[LA] 无需预隐藏的选择器。');
        }
    }


    /**
     * 应用规则，修改元素内容并添加 'la-visible' 类
     * @param {object} rule - 单个规则对象
     */
    function applyRuleToAllMatches(rule) {
        if (!rule || !rule.selector || !rule.contentGenerator) return;

        try {
            const elements = document.querySelectorAll(`${rule.selector}:not([${MODIFIED_MARKER}])`);

            if (elements.length > 0) {
                // console.log(`[LA] 应用规则 "${rule.name || '未命名'}" 到 ${elements.length} 个新元素。`);
                const content = rule.contentGenerator(rule.conditions || {}, rule);

                elements.forEach((element) => {
                    if (element.hasAttribute(MODIFIED_MARKER)) return;

                    element.innerHTML = content;
                    element.classList.add(VISIBLE_CLASS); // 添加可见类

                    // 强制样式 (保持)
                    element.style.setProperty('display', 'block', 'important'); // or flex/grid
                    element.style.setProperty('height', 'auto', 'important');
                    element.style.setProperty('min-height', '100px', 'important');
                    element.style.setProperty('opacity', '1', 'important');

                    element.setAttribute(MODIFIED_MARKER, 'true');
                });
            }
        } catch (error) {
            console.error(`[LA] 应用规则 "${rule.name || '未命名'}" 时出错:`, error);
            console.error(`选择器: ${rule.selector}`);
        }
    }

    // --- 3. 主逻辑 ---
    // processRules 函数保持不变 (省略，内部调用 applyRuleToAllMatches 和安排后操作的逻辑不变)
     function processRules() {
        const currentUrl = window.location.href;
        let applicableRulesForCSS = [];
        rules.forEach(rule => {
            try {
                if (rule.match(currentUrl)) {
                    applicableRulesForCSS.push(rule);
                    if (checkConditions(rule.conditions)) {
                        applyRuleToAllMatches(rule);
                        if (rule.postAction && typeof rule.postAction.action === 'function' && rule.postAction.delay >= 0 && !scheduledPostActions[rule.name]) {
                            scheduledPostActions[rule.name] = true;
                            console.log(`[LA] 规则 "${rule.name}" 安排网站级后操作: ${rule.postAction.description || '无描述'} (${rule.postAction.delay}ms)`);
                            setTimeout(() => {
                                try { rule.postAction.action.call(rule.postAction, rule); }
                                catch (postActionError) { console.error(`[LA] 执行后操作 "${rule.name}" 出错:`, postActionError); }
                            }, rule.postAction.delay);
                        }
                    }
                }
            } catch (error) { console.error(`[LA] 处理规则 "${rule.name}" 出错:`, error); }
        });
        return applicableRulesForCSS;
    }

    // --- 4. 处理动态内容加载 ---
    // setupMutationObserver 函数保持不变 (省略)
     function setupMutationObserver() {
        let debounceTimer;
        const debouncedProcessRules = () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(processRules, 400); };
        const observer = new MutationObserver((mutationsList) => {
            let relevantChange = false;
            for(const m of mutationsList) { if (m.type==='childList'&&m.addedNodes.length>0){ relevantChange=true; break; } }
            if(relevantChange) debouncedProcessRules();
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        console.log('[LA] MutationObserver 已启动。');
    }

    // --- 5. 脚本入口 ---
    console.log('[LA] 学习助手脚本 v0.8 开始运行 (@run-at document-start)');

    // 初始执行并注入 CSS
    const potentiallyApplicableRules = processRules();
    if (potentiallyApplicableRules.length > 0) {
        injectInitialCSS(potentiallyApplicableRules);
    } else {
        console.log('[LA] 当前 URL 无匹配规则或条件不满足，不注入初始 CSS。');
    }

    // DOM 加载后启动 Observer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[LA] DOMContentLoaded 触发，启动 Observer。');
            setupMutationObserver();
        });
    } else {
         console.log('[LA] DOM 已加载 (非 loading)，启动 Observer。');
         setupMutationObserver();
    }

})();