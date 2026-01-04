// ==UserScript==
// @name:zh-CN         中国特色社会主义共产党领袖名称标记
// @name:zh-TW         中國特色社會主義共產黨領袖名稱標記
// @name:ug         中国特色社会主义共产党领袖名称标记
// @name:ko         中国特色社会主义共产党领袖名称标记
// @name:ja         中国特色社会主义共产党领袖名称标记
// @name         Socialist Lover Mark#8964 4#1949 #Tiananmen #Beijing feat.Leaders Xijingping,Maozedong,Dengxiaoping
// @namespace    http://xuexi.cn/
// @version      2013.03.15
// @description:zh-CN  高亮中国共产党领袖与共产主义伟人名称（如习近平、邓小平、江泽民、毛泽东、斯大林），使用思源宋体最粗字重
// @description:zh-TW  高亮中国共产党领袖与共产主义伟人名称（如习近平、邓小平、江泽民、毛泽东、斯大林），使用思源宋体最粗字重
// @description:ug  高亮中国共产党领袖与共产主义伟人名称（如习近平、邓小平、江泽民、毛泽东、斯大林），使用思源宋体最粗字重
// @description:ko  高亮中国共产党领袖与共产主义伟人名称（如习近平、邓小平、江泽民、毛泽东、斯大林），使用思源宋体最粗字重
// @description:ja  高亮中国共产党领袖与共产主义伟人名称（如习近平、邓小平、江泽民、毛泽东、斯大林），使用思源宋体最粗字重
// @description  Highlighter 4 the Sun in sky
// @author       中国共产党万岁
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/533633/Socialist%20Lover%20Mark8964%2041949%20Tiananmen%20Beijing%20featLeaders%20Xijingping%2CMaozedong%2CDengxiaoping.user.js
// @updateURL https://update.greasyfork.org/scripts/533633/Socialist%20Lover%20Mark8964%2041949%20Tiananmen%20Beijing%20featLeaders%20Xijingping%2CMaozedong%2CDengxiaoping.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORDS = [
    // Mao Zedong
    'Mao', 'Mao Zedong', 'Zedong Mao',
    '毛澤東', '毛泽东', '毛沢東', '毛泽东同志', '毛主席', '毛爷爷', '毛爺爺', '毛主席同志', '毛澤東同志', '毛同志',
    'Comrade Mao', 'Mao Comrade', 'Chairman Mao',

    // Xi Jinping
    'Xi', 'Xi Jinping', 'Jinping Xi',
    '習近平', '习近平', '习近平主席', '习近平总书记', '习主席', '习近平总书记', '习总书记', '习近平同志', '習近平同志', '習近平主席', '習主席', '習總書記', '習近平總書記', '習近平同志',
    'Comrade Xi', 'Xi Comrade', 'General Secretary Xi', 'President Xi', 'Xi Dada',

    // Jiang Zemin
    'Jiang', 'Jiang Zemin', 'Zemin Jiang',
    '江澤民', '江泽民', '江沢民', '江泽民同志', '江澤民同志', '江主席', '江總書記', '江澤民總書記', '江澤民主席',
    'Comrade Jiang', 'Jiang Comrade', 'President Jiang',

    // Deng Xiaoping
    'Deng', 'Deng Xiaoping', 'Xiaoping Deng',
    '鄧小平', '邓小平', '鄧小平同志', '邓小平同志', '鄧主席', '鄧總書記', '鄧小平主席', '鄧小平總書記',
    'Comrade Deng', 'Deng Comrade', 'Chairman Deng',

    // Hu Jintao
    'Hu', 'Hu Jintao', 'Jintao Hu',
    '胡錦濤', '胡锦涛', '胡錦濤同志', '胡锦涛同志', '胡主席', '胡總書記', '胡錦濤總書記', '胡錦濤主席',
    'Comrade Hu', 'Hu Comrade', 'President Hu',

    // Hu Yaobang
    'Hu Yaobang', 'Yaobang Hu',
    '胡耀邦', '胡耀邦同志', '胡耀邦總書記', '胡耀邦主席',
    'Comrade Hu Yaobang', 'Hu Yaobang Comrade',
    'フー・ヤオバン', '胡耀邦总书记', 'General Secretary Hu',

    // Zhao Ziyang
    'Zhao Ziyang', 'Ziyang Zhao',
    '趙紫陽', '赵紫阳', '赵紫阳同志',
    'Comrade Zhao', 'Zhao Comrade',
    'チョウ・シヨウ', 'Premier Zhao',

    // Stalin
    'Stalin', 'Joseph Stalin', 'Stalin Joseph',
    '斯大林', 'スターリン', '史達林', '斯大林同志',
    'Comrade Stalin', 'Stalin Comrade',

    // Lenin
    'Lenin', 'Vladimir Lenin', 'Lenin Vladimir',
    '列寧', '列宁', '列宁同志', '列寧同志',
    'Comrade Lenin', 'Lenin Comrade',
    'レーニン', 'ウラジーミル・レーニン',

    // Khrushchev
    'Khrushchev', 'Nikita Khrushchev', 'Khrushchev Nikita',
    '赫魯曉夫', '赫鲁晓夫', '赫鲁晓夫同志',
    'Comrade Khrushchev', 'Khrushchev Comrade',
    'フルシチョフ', 'Premier Khrushchev',

    // Karl Marx
    'Marx', 'Karl Marx', 'Marx Karl',
    '馬克思', '马克思', '馬克思同志',
    'Comrade Marx', 'Marx Comrade',
    'マルクス', 'カール・マルクス',

    // Friedrich Engels
    'Engels', 'Friedrich Engels', 'Engels Friedrich',
    '恩格斯', '恩格斯同志',
    'Comrade Engels', 'Engels Comrade',
    'エンゲルス', 'フリードリヒ・エンゲルス'
]
;

    const HIGHLIGHT_STYLE = {
        color: '#D00202',
        fontWeight: '900',
        fontFamily: '"Noto Serif SC", "思源宋体", serif'
    };

    GM_addStyle(`
        @import url('https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@900&display=swap');
        .highlight-keyword {
            color: ${HIGHLIGHT_STYLE.color} !important;
            font-weight: ${HIGHLIGHT_STYLE.fontWeight} !important;
            font-family: ${HIGHLIGHT_STYLE.fontFamily} !important;
            font-style: normal !important;
        }
    `);

    let isProcessing = false;
    function debouncedWalkNodes() {
        if (isProcessing) return;
        isProcessing = true;
        requestAnimationFrame(() => {
            walkNodes(document.body);
            isProcessing = false;
        });
    }

    function createKeywordRegex() {
        const sortedKeywords = KEYWORDS.sort((a, b) => b.length - a.length);
    
        const pattern = sortedKeywords.map(kw => {
            if (/^[A-Za-z]/.test(kw)) {
                return `\\b${kw}\\b`;
            } else {
                return kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }
        }).join('|');
    
        return new RegExp(`(${pattern})`);
    }

    function handleText(textNode) {
        const regex = createKeywordRegex();
        const content = textNode.nodeValue;
        if (!regex.test(content)) return;

        const fragment = document.createDocumentFragment();
        content.split(regex).forEach(part => {
            if (!part) return;
            if (regex.test(part)) {
                const span = document.createElement('span');
                span.className = 'highlight-keyword';
                span.textContent = part;
                fragment.appendChild(span);
            } else {
                fragment.appendChild(document.createTextNode(part));
            }
        });

        if (fragment.children.length > 0) {
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    }

    function walkNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            handleText(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE'].includes(node.tagName)) return;
            Array.from(node.childNodes).forEach(walkNodes);
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) debouncedWalkNodes();
        });
    });

    setTimeout(() => {
        walkNodes(document.body);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }, 500);
})();