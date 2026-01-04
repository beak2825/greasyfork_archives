// ==UserScript==
// @name         Enhanced Past Tense Verb Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Hide past tense verbs, show base form on hover, and reveal past tense on click with improved accuracy
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527395/Enhanced%20Past%20Tense%20Verb%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/527395/Enhanced%20Past%20Tense%20Verb%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 扩展的不规则动词词典
    const irregularVerbs = {
    'arose': 'arise',
    'awoke': 'awake',
    'was': 'be',
    'were': 'be',
    'bore': 'bear',
    'beat': 'beat',
    'became': 'become',
    'began': 'begin',
    'bent': 'bend',
    'bet': 'bet',
    'bound': 'bind',
    'bit': 'bite',
    'bled': 'bleed',
    'blew': 'blow',
    'broke': 'break',
    'bred': 'breed',
    'brought': 'bring',
    'broadcast': 'broadcast',
    'built': 'build',
    'burnt': 'burn',
    'burned': 'burn',
    'burst': 'burst',
    'bought': 'buy',
    'caught': 'catch',
    'chose': 'choose',
    'clung': 'cling',
    'came': 'come',
    'cost': 'cost',
    'crept': 'creep',
    'cut': 'cut',
    'dealt': 'deal',
    'dug': 'dig',
    'did': 'do',
    'drew': 'draw',
    'dreamt': 'dream',
    'dreamed': 'dream',
    'drank': 'drink',
    'drove': 'drive',
    'ate': 'eat',
    'fell': 'fall',
    'fed': 'feed',
    'felt': 'feel',
    'fought': 'fight',
    'found': 'find',
    'flew': 'fly',
    'forbade': 'forbid',
    'forgot': 'forget',
    'forgave': 'forgive',
    'froze': 'freeze',
    'got': 'get',
    'gave': 'give',
    'went': 'go',
    'ground': 'grind',
    'grew': 'grow',
    'hung': 'hang',
    'had': 'have',
    'heard': 'hear',
    'hid': 'hide',
    'hit': 'hit',
    'held': 'hold',
    'hurt': 'hurt',
    'kept': 'keep',
    'knelt': 'kneel',
    'knew': 'know',
    'laid': 'lay',
    'led': 'lead',
    'leant': 'lean',
    'leaned': 'lean',
    'learnt': 'learn',
    'learned': 'learn',
    'left': 'leave',
    'lent': 'lend',
    'lay': 'lie',
    'lied': 'lie',
    'lit': 'light',
    'lighted': 'light',
    'lost': 'lose',
    'made': 'make',
    'meant': 'mean',
    'met': 'meet',
    'mowed': 'mow',
    'overtook': 'overtake',
    'paid': 'pay',
    'put': 'put',
    'read': 'read',
    'rode': 'ride',
    'rang': 'ring',
    'rose': 'rise',
    'ran': 'run',
    'sawed': 'saw',
    'said': 'say',
    'saw': 'see',
    'sold': 'sell',
    'sent': 'send',
    'set': 'set',
    'sewed': 'sew',
    'shook': 'shake',
    'shed': 'shed',
    'shone': 'shine',
    'asked': 'ask',
    'believed': 'believe',
    'called': 'call',
    'changed': 'change',
    'continued': 'continue',
    'cooked': 'cook',
    'danced': 'dance',
    'enjoyed': 'enjoy',
    'followed': 'follow',
    'happened': 'happen',
    'helped': 'help',
    'included': 'include',
    'jumped': 'jump',
    'liked': 'like',
    'lived': 'live',
    'looked': 'look',
    'moved': 'move',
    'needed': 'need',
    'opened': 'open',
    'played': 'play',
    'provided': 'provide',
    'rained': 'rain',
    'seemed': 'seem',
    'showed': 'show',
    'started': 'start',
    'studied': 'study',
    'talked': 'talk',
    'tried': 'try',
    'turned': 'turn',
    'used': 'use',
    'visited': 'visit',
    'walked': 'walk',
    'wanted': 'want',
    'watched': 'watch',
    'worked': 'work',
'phoned': 'phone',
'celebrated': 'celebrate'
    };

    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
        .verb-tooltip {
            color: transparent;
            border-bottom: 1px dotted black;
            cursor: help;
            position: relative;
        }
        .verb-tooltip.show-past {
            color: inherit;
            background-color: yellow;
            transition: color 0.3s, background-color 0.3s;
        }
        .verb-tooltip::before {
            content: attr(data-base-form);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 5px;
            border-radius: 3px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .verb-tooltip:hover::before {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 遍历文本节点的函数
    function walkTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else {
            for (let child of node.childNodes) {
                walkTextNodes(child);
            }
        }
    }

    // 处理文本节点的函数
    function processTextNode(textNode) {
        const text = textNode.nodeValue;
        const regex = /\b(?!(?:hundred|thousand|indeed|need|filled|used|shared|argued)\b)(\w+ed|went|saw|was|were)\b/g;
        let match;
        let lastIndex = 0;
        const fragments = [];
    
        while ((match = regex.exec(text)) !== null) {
            const verb = match[1];
            const baseForm = getBaseForm(verb);
            
            fragments.push(
                document.createTextNode(text.slice(lastIndex, match.index)),
                createHiddenSpan(verb, baseForm)
            );
            
            lastIndex = regex.lastIndex;
        }
    
        if (fragments.length > 0) {
            fragments.push(document.createTextNode(text.slice(lastIndex)));
            const span = document.createElement('span');
            fragments.forEach(fragment => span.appendChild(fragment));
            textNode.parentNode.replaceChild(span, textNode);
        }
    }

    // 改进的获取动词原形的函数
    function getBaseForm(verb) {
        // 检查是否为不规则动词
        if (irregularVerbs[verb]) {
            return irregularVerbs[verb];
        }
        
        // 处理规则动词
        if (verb.endsWith('ed')) {
            // 如果动词以'eed'结尾,只去掉最后一个'd'
            if (verb.endsWith('eed')) {
                return verb.slice(0, -1);
            }
            // 如果动词以'e'结尾加'd',只去掉'd'
            if (verb.length > 3 && verb[verb.length - 3] === 'e') {
                return verb.slice(0, -1);
            }
            // 处理双写辅音字母的情况,如'stopped' -> 'stop'
            if (verb.length > 4 && verb[verb.length - 3] === verb[verb.length - 4]) {
                return verb.slice(0, -3);
            }
            // 处理以'ied'结尾的情况,如'cried' -> 'cry'
            if (verb.endsWith('ied')) {
                return verb.slice(0, -3) + 'y';
            }
            // 处理以'e'结尾的动词，去掉'ed'
            if (verb.length > 3 && verb[verb.length - 3] !== 'e') {
                return verb.slice(0, -2);
            }
        }
        
        // 如果不符合上述规则,返回原形
        return verb;
    }

    // 创建隐藏的span元素
    function createHiddenSpan(verb, baseForm) {
        const span = document.createElement('span');
        span.textContent = verb;
        span.setAttribute('data-base-form', baseForm);
        span.setAttribute('data-past-form', verb);
        span.classList.add('verb-tooltip');
        
        // 添加点击事件监听器
        span.addEventListener('click', function(e) {
            e.preventDefault(); // 防止可能的链接点击
            this.classList.toggle('show-past');
            
            // 3秒后自动隐藏
            setTimeout(() => {
                this.classList.remove('show-past');
            }, 3000);
        });
        
        return span;
    }

    // 在页面加载完成后执行脚本
    window.addEventListener('load', function() {
        walkTextNodes(document.body);
    });
})();
