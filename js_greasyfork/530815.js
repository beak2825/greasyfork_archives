// ==UserScript==
// @name         Tâi-gí「教典」TL ⇄ POJ
// @namespace    aiuanyu
// @version      2.2.1
// @description  予代管當局 ROC 教育部 Tâi-gí 常用詞詞典網站呈現出 POJ！（對臺羅換過來、換轉去）
// @author       Aiuanyu 愛灣語, TongcyDai
// @match        http*://sutian.moe.edu.tw/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531017/T%C3%A2i-g%C3%AD%E3%80%8C%E6%95%99%E5%85%B8%E3%80%8DTL%20%E2%87%84%20POJ.user.js
// @updateURL https://update.greasyfork.org/scripts/531017/T%C3%A2i-g%C3%AD%E3%80%8C%E6%95%99%E5%85%B8%E3%80%8DTL%20%E2%87%84%20POJ.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 預設使用 POJ
    let usePOJ = localStorage.getItem('sutianUsePOJ') !== 'false';

    // Add a flag for Wiktionary mode (default to off)
    let useWiktionaryMode = localStorage.getItem('sutianUseWiktionaryMode') === 'true';

    // 囥原始文字的 mapping table
    const originalTextMap = new WeakMap();

    // Create Wiktionary mode toggle
    function createWiktionaryToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'wiktionary-toggle-btn';
        toggle.textContent = useWiktionaryMode ? 'Wikt Mode: ON' : 'Wikt Mode: OFF';
        toggle.style.position = 'fixed';
        toggle.style.bottom = '80px';
        toggle.style.left = '20px';
        toggle.style.zIndex = '9999';
        toggle.style.padding = '8px 12px';
        toggle.style.backgroundColor = useWiktionaryMode ? '#27ae60' : '#95a5a6';
        toggle.style.color = 'white';
        toggle.style.border = 'none';
        toggle.style.borderRadius = '4px';
        toggle.style.cursor = 'pointer';
        toggle.style.fontWeight = 'bold';
        toggle.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toggle.style.fontSize = '14px';

        // Hover effects
        toggle.addEventListener('mouseover', function() {
            this.style.backgroundColor = useWiktionaryMode ? '#219653' : '#7f8c8d';
        });

        toggle.addEventListener('mouseout', function() {
            this.style.backgroundColor = useWiktionaryMode ? '#27ae60' : '#95a5a6';
        });

        // Toggle Wiktionary mode
        toggle.addEventListener('click', function() {
            useWiktionaryMode = !useWiktionaryMode;
            localStorage.setItem('sutianUseWiktionaryMode', useWiktionaryMode);

            this.textContent = useWiktionaryMode ? 'Wikt Mode: ON' : 'Wikt Mode: OFF';
            this.style.backgroundColor = useWiktionaryMode ? '#27ae60' : '#95a5a6';

            // Refresh the current view if we're in POJ mode
            if (usePOJ) {
                restoreOriginalText(document.body);
                applyPOJTransformation(document.body);
            }
        });

        document.body.appendChild(toggle);
    }

    // 切換揤鈕
    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'poj-toggle-btn';
        button.textContent = usePOJ ? '用臺羅 (TL)' : '用白話字 (POJ)';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.left = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 12px';
        button.style.backgroundColor = '#3498db';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 鼠仔滑過的效果
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2980b9';
        });

        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#3498db';
        });

        // 「揤」事件：切換羅馬字
        button.addEventListener('click', toggleRomanization);

        document.body.appendChild(button);
    }

    // 切換羅馬字
    function toggleRomanization() {
        usePOJ = !usePOJ;
        localStorage.setItem('sutianUsePOJ', usePOJ);

        const button = document.getElementById('poj-toggle-btn');
        if (button) {
            button.textContent = usePOJ ? '用臺羅 (TL)' : '用白話字 (POJ)';
        }

        if (usePOJ) {
            applyPOJTransformation(document.body);
        } else {
            restoreOriginalText(document.body);
        }
    }

    // 共文字對臺羅轉做白話字
    function applyPOJTransformation(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let parent = node.parentNode;
            while (parent) {
                if (parent.id === 'poj-toggle-btn' || parent.id === 'wiktionary-toggle-btn') {
                    return; // 跳過揤鈕文字
                }
                parent = parent.parentNode;
            }
            let text = node.nodeValue;
            const originalText = text;
            const exceptions = [];
            const regex = /\(([a-zA-Z]+)\)/g;
            let match;

            while ((match = regex.exec(text)) !== null) {
                exceptions.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    original: match[0]
                });
            }

            // 先共欲排除个部份用一个暫時个字串取代，才袂予轉換
            let tempText = text;
            const tempMarkers = {};
            exceptions.forEach((exception, index) => {
                const marker = `__TEMP_EXCEPTION_${index}__`;
                tempMarkers[marker] = exception.original;
                tempText = tempText.substring(0, exception.start) + marker + tempText.substring(exception.end);
            });

            // 收囥原始文字 (排除例外以後)
            if (!originalTextMap.has(node)) {
                originalTextMap.set(node, originalText);
            }

            text = tempText.normalize('NFD').normalize('NFC');

            // ts → ch
            text = text.replace(/(?<=^|\W)ts/gi, function(match) { return (match[0] === 'T' ? 'Ch' : 'ch'); });

            // ua → oa
            // 處理 ua 後面接 i、n、t、h 的情形 (調符徙去 a 頂懸)；注意 ua̍ ua̋ 是組合字元愛特別處理
            text = text.replace(/u(?:(a(?:[\u030d\u030b]))|([aáàâǎā]))([inth](?:\W|$))/gi, function(match, combinedA, precomposedA, end) {
              const theVowel = combinedA || precomposedA;
              const prefix = (match[0] === 'U' ? 'O' : 'o');
              return prefix + theVowel + end;
            });

            // 處理孤一个 ua 抑是後壁接 nn 的情形 (調符徙去 o 頂懸，nn 上尾才換)
            text = text.replace(/ua(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'O' : 'o') + 'a'; });
            text = text.replace(/uá(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Ó' : 'ó') + 'a'; });
            text = text.replace(/uà(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Ò' : 'ò') + 'a'; });
            text = text.replace(/uâ(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Ô' : 'ô') + 'a'; });
            text = text.replace(/uǎ(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Õ' : 'õ') + 'a'; });
            text = text.replace(/uā(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Ō' : 'ō') + 'a'; });
            text = text.replace(/ua̍(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'O̍' : 'o̍') + 'a'; });
            text = text.replace(/ua̋(?=nn\W|nn$|\W|$)/gi, function(match) { return (match[0] === 'U' ? 'Ŏ' : 'ŏ') + 'a'; });

            // ue → oe (除了 ueh 以外，調符攏徙去 o 頂懸)
            text = text.replace(/ue/gi, function(match) { return (match[0] === 'U' ? 'O' : 'o') + 'e'; });
            text = text.replace(/ué/gi, function(match) { return (match[0] === 'U' ? 'Ó' : 'ó') + 'e'; });
            text = text.replace(/uè/gi, function(match) { return (match[0] === 'U' ? 'Ò' : 'ò') + 'e'; });
            text = text.replace(/uê/gi, function(match) { return (match[0] === 'U' ? 'Ô' : 'ô') + 'e'; });
            text = text.replace(/uě/gi, function(match) { return (match[0] === 'U' ? 'Õ' : 'õ') + 'e'; });
            text = text.replace(/uē/gi, function(match) { return (match[0] === 'U' ? 'Ō' : 'ō') + 'e'; });
            text = text.replace(/ue̍/gi, function(match) { return (match[0] === 'U' ? 'Oe̍' : 'oe̍'); });
            text = text.replace(/ue̋/gi, function(match) { return (match[0] === 'U' ? 'Ŏ' : 'ŏ') + 'e'; });

            // ui → ui (調符徙去 u 頂懸)
            // text = text.replace(/ui/gi, function(match) { return (match[0] === 'U' ? 'U' : 'u') + 'i'; });
            text = text.replace(/uí/gi, function(match) { return (match[0] === 'U' ? 'Ú' : 'ú') + 'i'; });
            text = text.replace(/uì/gi, function(match) { return (match[0] === 'U' ? 'Ù' : 'ù') + 'i'; });
            text = text.replace(/uî/gi, function(match) { return (match[0] === 'U' ? 'Û' : 'û') + 'i'; });
            text = text.replace(/uǐ/gi, function(match) { return (match[0] === 'U' ? 'Ũ' : 'ũ') + 'i'; });
            text = text.replace(/uī/gi, function(match) { return (match[0] === 'U' ? 'Ū' : 'ū') + 'i'; });
            text = text.replace(/ui̍/gi, function(match) { return (match[0] === 'U' ? 'U̍' : 'u̍') + 'i'; });
            text = text.replace(/ui̋/gi, function(match) { return (match[0] === 'U' ? 'Ŭ' : 'ŭ') + 'i'; });

            // oo → o͘
            text = text.replace(/oo(?=\W|$)/gi, function(match) { return (match[0] === 'O' ? 'O͘' : 'o͘'); });
            text = text.replace(/óo(?=\W|$)/gi, function(match) { return (match[0] === 'Ó' ? 'Ó͘' : 'ó͘'); });
            text = text.replace(/òo(?=\W|$)/gi, function(match) { return (match[0] === 'Ò' ? 'Ò͘' : 'ò͘'); });
            text = text.replace(/ôo(?=\W|$)/gi, function(match) { return (match[0] === 'Ô' ? 'Ô͘' : 'ô͘'); });
            text = text.replace(/ǒo(?=\W|$)/gi, function(match) { return (match[0] === 'Ǒ' ? 'Õ͘' : 'õ͘'); });
            text = text.replace(/ōo(?=\W|$)/gi, function(match) { return (match[0] === 'Ō' ? 'Ō͘' : 'ō͘'); });
            text = text.replace(/ooh(?=\W|$)/gi, function(match) { return (match[0] === 'O' ? 'O͘h' : 'o͘h'); }); // 替代處理，才袂換過頭
            text = text.replace(/o̍oh(?=\W|$)/gi, function(match) { return (match[0] === 'O' ? 'O̍͘h' : 'o̍͘h'); });
            text = text.replace(/őo(?=\W|$)/gi, function(match) { return (match[0] === 'Ő' ? 'Ŏ͘' : 'ŏ͘'); });

            // The following conversions should only run if Wiktionary mode is OFF
            if (!useWiktionaryMode) {
                // ee → e͘
                text = text.replace(/ee/gi, function(match) { return (match[0] === 'E' ? 'E͘' : 'e͘'); });
                text = text.replace(/ée/gi, function(match) { return (match[0] === 'É' ? 'É͘' : 'é͘'); });
                text = text.replace(/èe/gi, function(match) { return (match[0] === 'È' ? 'È͘' : 'è͘'); });
                text = text.replace(/êe/gi, function(match) { return (match[0] === 'Ê' ? 'Ê͘' : 'ê͘'); });
                text = text.replace(/ěe/gi, function(match) { return (match[0] === 'Ě' ? 'Ẽ͘' : 'ẽ͘'); });
                text = text.replace(/ēe/gi, function(match) { return (match[0] === 'Ē' ? 'Ē͘' : 'ē͘'); });
                text = text.replace(/e̍e/gi, function(match) { return (match[0] === 'E' ? 'E̍͘' : 'e̍͘'); });
                text = text.replace(/e̋e/gi, function(match) { return (match[0] === 'E' ? 'Ĕ͘' : 'ĕ͘'); });

                // er → o̤
                text = text.replace(/er/gi, function(match) { return (match[0] === 'E' ? 'O̤' : 'o̤'); });
                text = text.replace(/ér/gi, function(match) { return (match[0] === 'É' ? 'Ó̤' : 'ó̤'); });
                text = text.replace(/èr/gi, function(match) { return (match[0] === 'È' ? 'Ò̤' : 'ò̤'); });
                text = text.replace(/êr/gi, function(match) { return (match[0] === 'Ê' ? 'Ô̤' : 'ô̤'); });
                text = text.replace(/ěr/gi, function(match) { return (match[0] === 'Ě' ? 'Õ̤' : 'õ̤'); });
                text = text.replace(/ēr/gi, function(match) { return (match[0] === 'Ē' ? 'Ō̤' : 'ō̤'); });
                text = text.replace(/e̍r/gi, function(match) { return (match[0] === 'E' ? 'O̤̍' : 'o̤̍'); });
                text = text.replace(/e̋r/gi, function(match) { return (match[0] === 'E' ? 'Ŏ̤' : 'ŏ̤'); });

                // ir → ṳ
                text = text.replace(/ir/gi, function(match) { return (match[0] === 'I' ? 'Ṳ' : 'ṳ'); });
                text = text.replace(/ír/gi, function(match) { return (match[0] === 'Í' ? 'Ṳ́' : 'ṳ́'); });
                text = text.replace(/ìr/gi, function(match) { return (match[0] === 'Ì' ? 'Ṳ̀' : 'ṳ̀'); });
                text = text.replace(/îr/gi, function(match) { return (match[0] === 'Î' ? 'Ṳ̂' : 'ṳ̂'); });
                text = text.replace(/ǐr/gi, function(match) { return (match[0] === 'Ǐ' ? 'Ṳ̃' : 'ṳ̃'); });
                text = text.replace(/īr/gi, function(match) { return (match[0] === 'Ī' ? 'Ṳ̄' : 'ṳ̄'); });
                text = text.replace(/i̍r/gi, function(match) { return (match[0] === 'I' ? 'Ṳ̍' : 'ṳ̍'); });
                text = text.replace(/i̋r/gi, function(match) { return (match[0] === 'I' ? 'Ṳ̆' : 'ṳ̆'); });
            }

            // or → o (白話字無分 o、or)
            text = text.replace(/or/gi, function(match) { return (match[0] === 'O' ? 'O' : 'o'); });
            text = text.replace(/ór/gi, function(match) { return (match[0] === 'Ó' ? 'Ó' : 'ó'); });
            text = text.replace(/òr/gi, function(match) { return (match[0] === 'Ò' ? 'Ò' : 'ò'); });
            text = text.replace(/ôr/gi, function(match) { return (match[0] === 'Ô' ? 'Ô' : 'ô'); });
            text = text.replace(/ǒr/gi, function(match) { return (match[0] === 'Ǒ' ? 'Õ' : 'õ'); });
            text = text.replace(/ōr/gi, function(match) { return (match[0] === 'Ō' ? 'Ō' : 'ō'); });
            text = text.replace(/o̍r/gi, function(match) { return (match[0] === 'O' ? 'O̍' : 'o̍'); });
            text = text.replace(/őr/gi, function(match) { return (match[0] === 'Ő' ? 'Ŏ' : 'ŏ'); });

            // nn → ⁿ (干焦 nn 後壁是空隙抑 - hyphen 時才取代)
            text = text.replace(/nn(?=[ \-,\.!\?/]|\s*$)/gi, 'ⁿ');

            // nnh → hⁿ (干焦 nnh 佇音節尾的時才會換)
            text = text.replace(/nnh(?=\W|$)/gi, 'hⁿ');

            // ing → eng
            text = text.replace(/ing/gi, function(match) { return (match[0] === 'I' ? 'E' : 'e') + 'ng'; });
            text = text.replace(/íng/gi, function(match) { return (match[0] === 'Í' ? 'É' : 'é') + 'ng'; });
            text = text.replace(/ìng/gi, function(match) { return (match[0] === 'Ì' ? 'È' : 'è') + 'ng'; });
            text = text.replace(/îng/gi, function(match) { return (match[0] === 'Î' ? 'Ê' : 'ê') + 'ng'; });
            text = text.replace(/ǐng/gi, function(match) { return (match[0] === 'Ǐ' ? 'Ẽ' : 'ẽ') + 'ng'; });
            text = text.replace(/īng/gi, function(match) { return (match[0] === 'Ī' ? 'Ē' : 'ē') + 'ng'; });
            text = text.replace(/i̋ng/gi, function(match) { return (match[0] === 'I' ? 'Ĕ' : 'ĕ') + 'ng'; });

            // ik → ek
            text = text.replace(/ik/gi, function(match) { return (match[0] === 'I' ? 'E' : 'e') + 'k'; });
            text = text.replace(/i̍k/gi, function(match) { return (match[0] === 'I' ? 'E̍' : 'e̍') + 'k'; });

            text = text.replace(/[Aa]̋/g, function(match) { return match[0] === 'A' ? 'Ă' : 'ă'; });
            text = text.replace(/[Ee]̋/g, function(match) { return match[0] === 'E' ? 'Ĕ' : 'ĕ'; });
            text = text.replace(/[Ii]̋/g, function(match) { return match[0] === 'I' ? 'Ĭ' : 'ĭ'; });
            text = text.replace(/[Őő]/g, function(match) { return match[0] === 'Ő' ? 'Ŏ' : 'ŏ'; });
            text = text.replace(/[Űű]/g, function(match) { return match[0] === 'Ű' ? 'Ŭ' : 'ŭ'; });
            text = text.replace(/[Mm]̋/g, function(match) { return match[0] === 'M' ? 'M̆' : 'm̆'; });
            text = text.replace(/[Nn]̋g/g, function(match) { return match[0] === 'N' ? 'N̆g' : 'n̆g'; });

            // Only convert sixth tone if not in Wiktionary mode
            if (!useWiktionaryMode) {
                text = text.replace(/[Ǎǎ]/g, function(match) { return match[0] === 'Ǎ' ? 'Ã' : 'ã'; });
                text = text.replace(/[Ěě]/g, function(match) { return match[0] === 'Ě' ? 'Ẽ' : 'ẽ'; });
                text = text.replace(/[Ǐǐ]/g, function(match) { return match[0] === 'Ǐ' ? 'Ĩ' : 'ĩ'; });
                text = text.replace(/[Ǒǒ]/g, function(match) { return match[0] === 'Ǒ' ? 'Õ' : 'õ'; });
                text = text.replace(/[Ǔǔ]/g, function(match) { return match[0] === 'Ǔ' ? 'Ũ' : 'ũ'; });
                text = text.replace(/[Mm]̌/g, function(match) { return match[0] === 'M' ? 'M̃' : 'm̃'; });
                text = text.replace(/[Ňň]g/g, function(match) { return match[0] === 'Ň' ? 'Ñg' : 'ñg'; });
            }

            // 共排除个例外囥轉原底个位置
            Object.keys(tempMarkers).forEach(marker => {
                const regexReplace = new RegExp(marker.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
                text = text.replace(regexReplace, tempMarkers[marker]);
            });

            node.nodeValue = text;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 排除切換揤鈕
            if (node.id !== 'poj-toggle-btn' && node.id !== 'wiktionary-toggle-btn') {
                for (let i = 0; i < node.childNodes.length; i++) {
                    applyPOJTransformation(node.childNodes[i]);
                }
            }
        }
    }

    // 共原始文字囥倒轉去
    function restoreOriginalText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (originalTextMap.has(node)) {
                node.nodeValue = originalTextMap.get(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 共切換按鈕跳過
            if (node.id !== 'poj-toggle-btn' && node.id !== 'wiktionary-toggle-btn') {
                for (let i = 0; i < node.childNodes.length; i++) {
                    restoreOriginalText(node.childNodes[i]);
                }
            }
        }
    }

    // 處理動態載入的內容
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        // 共切換按鈕跳過
                        if (node.id === 'poj-toggle-btn' || node.id === 'wiktionary-toggle-btn') continue;

                        // 若這馬咧用 POJ，就使用轉換
                        if (usePOJ) {
                            applyPOJTransformation(node);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 頁面載入的時陣原初化
    window.addEventListener('load', function() {
        createToggleButton();
        createWiktionaryToggle(); // Create the new Wiktionary mode toggle
        setupMutationObserver();

        // 根據使用者的選擇來決定頭起先顯示的方式
        if (usePOJ) {
            applyPOJTransformation(document.body);
        }
    });
})();