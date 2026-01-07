// ==UserScript==
// @name        taigi-sandhi-visualization
// @namespace   hey0wing
// @version     1.6
// @description Highlights tone sandhi changes in Taiwanese romanization on the MOE dictionary site. Changed tones are marked in red with a tooltip showing possible base tone → sandhi tone.
// @author      hey0wing
// @match       https://sutian.moe.edu.tw/*
// @run-at      document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545891/taigi-sandhi-visualization.user.js
// @updateURL https://update.greasyfork.org/scripts/545891/taigi-sandhi-visualization.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    
    // Default settings
    const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
    const isGreasemonkey4Plus = typeof GM !== 'undefined' && typeof GM.setValue !== 'undefined';
    const isTampermonkeyCompatible = typeof GM_setValue !== 'undefined';
    const setValue = async (key, value) => {
        if (isChromeExtension) {
            await chrome.storage.local.set({ [key]: value });
        } else if (isGreasemonkey4Plus) {
            await GM.setValue(key, value);
        } else if (isTampermonkeyCompatible) {
            GM_setValue(key, value);
        } else {
            throw new Error('No compatible storage API available');
        }
    };
    const getValue = async (key, defaultValue) => {
        if (isChromeExtension) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] !== undefined ? result[key] : defaultValue);
                });
            });
        } else if (isGreasemonkey4Plus) {
            return await GM.getValue(key, defaultValue);
        } else if (isTampermonkeyCompatible) {
            return Promise.resolve(GM_getValue(key, defaultValue));
        } else {
            throw new Error('No compatible storage API available');
        }
    };
    var lang = await getValue('lang') || 'zh'
    var region = await getValue('region1') || 'S'
    var syl_id = await getValue('syl_id') || ''
    var syl_color = await getValue('syl_color') || ''

    function refreshLang() {
        const lang_region = document.getElementById('lang_setting')
        lang_region.outerHTML = syl_color == 'blue' ? 
            `<div id="lang_setting" class="d-flex justify-content-between"></div>` :
            `<div id="lang_setting" class="d-flex justify-content-between">
                <div class="w-25 d-flex justify-content-around">
                    ${[["N", "南"], ["S", "北"], ["C", "海"]].map(([en, zh], i) => {
                        let color = region==en ? 'selected' : 'not_selected'
                        let val = lang=='zh' ? zh : en
                        return `<button data-val="${en}" class="btn region ${color}">${val}</button>
                    `}).join('')}
                </div>
                <div class="w-25 d-flex justify-content-around">
                    ${[["zh", "中"], ["en", "Eng"]].map(([k, v], i) => {
                        let color = lang==k ? 'selected' : 'not_selected'
                        return `<button data-val="${k}" class="btn lang ${color}">${v}</button>
                    `}).join('')}
                </div>
            </div>
        `
    }

    function refreshDisplay(old_val, new_val) {
        const syllableCells = document.getElementsByClassName('tone');
        Array.from(syllableCells).forEach(syl => {
            const t = syl.dataset[`sandhi_${new_val.toLowerCase()}`] || syl.dataset.tone
            if (syl_id == `${syl.dataset.tone}_${syl.dataset[`sandhi_${old_val.toLowerCase()}`]}`) {
                syl_id = `${syl.dataset.tone}_${t}`
            }
            syl.innerHTML = t;
        });
    }

    function refreshSandhi() {
        const sandhi_diagram = document.getElementById('sandhi_diagram')
        if (syl_color == 'red') {
            sandhi_diagram.innerHTML = `<svg width="250" height="150" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid of numbers -->
                <text id="1" x="25" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">1</text>
                <text id="2" x="125" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">2</text>
                <text id="4" x="225" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">4</text>
                <text id="5" x="75" y="75" font-size="12" text-anchor="middle" alignment-baseline="central">5</text>
                <text id="7" x="25" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">7</text>
                ${region=='C' ? 
                    `<text id="3" x="125" y="75" font-size="12" text-anchor="middle" alignment-baseline="central">3</text>
                    <text id="6" x="125" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">6</text>` :
                    `<text id="3" x="125" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">3</text>`
                }
                <text id="8" x="225" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">8</text>
                
                <text id="4h" x="175" y="15" font-size="12" text-anchor="middle" alignment-baseline="central">-h</text>
                <text id="8h" x="175" y="115" font-size="12" text-anchor="middle" alignment-baseline="central">-h</text>
                <text id="ptk" x="205" y="75" font-size="12" text-anchor="middle" alignment-baseline="central">-p,t,k</text>
                
                <!-- Horizontal arrows -->
                <path id="2_1" d="M115 25 H35" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="4_2" d="M215 25 H135" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="7_${sandhi_map[false][region][7]}" d="M35 125 H115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="8_${sandhi_map[false][region][8]}" d="M215 125 H135" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                
                <!-- Vertical arrows -->
                ${region!=='C'&&`<path id="1_7" d="M25 35 V115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>`}
                <path id="3_2" d="${region=='C'?'M125 65 V35':'M125 115 V35'}" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="4_8" d="M225 35 V115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="8_4" d="M225 115 V35" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                
                <!-- Diagonal arrows -->
                ${region=='C'&&`<path id="2_5" d="M115 35 L80 65" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>`}
                <path id="${{'N': '5_7', 'S': '5_3', 'C': '5_6'}[region]}" 
                    d="${region=='N'?'M70 85 L35 115':'M80 85 L115 115'}"
                    stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                
                <!-- arrow definition -->
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="black"/>
                    </marker>
                    <marker id="arrow_red" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="red"/>
                    </marker>
                </defs>
            </svg>`
        } else {
            sandhi_diagram.innerHTML = `<svg width="250" height="150" xmlns="http://www.w3.org/2000/svg">
                <!-- Grid of numbers -->
                <text id="2,3" x="25" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">2,3</text>
                <text id="1" x="125" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">1</text>
                <text id="4" x="225" y="25" font-size="12" text-anchor="middle" alignment-baseline="central">4</text>
                <text id="5" x="25" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">5</text>
                <text id="7" x="125" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">7</text>
                <text id="8" x="225" y="125" font-size="12" text-anchor="middle" alignment-baseline="central">8</text>

                <text id="4h" x="175" y="15" font-size="12" text-anchor="middle" alignment-baseline="central">-h</text>
                <text id="8h" x="175" y="115" font-size="12" text-anchor="middle" alignment-baseline="central">-h</text>
                <text id="ptk" x="205" y="75" font-size="12" text-anchor="middle" alignment-baseline="central">-p,t,k</text>

                <!-- Horizontal arrows -->
                <path id="2,3_1" d="M40 25 H115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="4_1" d="M215 25 H135" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="5_7" d="M35 125 H115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="8_7" d="M215 125 H135" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>

                <!-- Vertical arrows -->
                <path id="1_7" d="M125 35 V115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="4_8" d="M225 35 V115" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>
                <path id="8_4" d="M225 115 V35" stroke="black" stroke-width="2" marker-end="url(#arrow)"/>

                <!-- arrow definition -->
                <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="black"/>
                    </marker>
                    <marker id="arrow_blue" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                        <polygon points="0 0, 6 2, 0 4" fill="blue"/>
                    </marker>
                </defs>
            </svg>`
        }
        if (syl_id == '4_8') document.getElementById('8_4').remove();
        if (syl_id == '8_4') document.getElementById('4_8').remove();
        if (['2_1', '3_1'].includes(syl_id) && syl_color == 'blue') syl_id = '2,3_1'

        if (['1_1', '6_6', '7_7'].includes(syl_id)) {
            const text = document.getElementById(syl_id.slice(0,1));
            text.setAttribute('fill', syl_color);
            text.setAttribute('font-size', 16);
        } else if (syl_id) {
            const path = document.getElementById(syl_id);
            path.setAttribute('stroke', syl_color);
            path.setAttribute('marker-end', `url(#arrow_${syl_color})`);
        }
    }

    let sandhi_map = {
        // suffix === á
        true: {
            "N": { 1: 7, 2: 1, 3: 1, 4: 2, 5: 7, 6: 6, 7: 7, 8: 7, 9: 9 },
            "S": { 1: 7, 2: 1, 3: 1, 4: 2, 5: 7, 6: 6, 7: 7, 8: 7, 9: 9 },
            "C": { 1: 7, 2: 1, 3: 1, 4: 2, 5: 7, 6: 6, 7: 7, 8: 7, 9: 9 }, // No credible source was found
        },
        // suffix !== á
        false:  {
            "N": { 1: 7, 2: 1, 3: 2, 4: 2, 5: 7, 6: 6, 7: 3, 8: 3, 9: 9 },
            "S": { 1: 7, 2: 1, 3: 2, 4: 2, 5: 3, 6: 6, 7: 3, 8: 3, 9: 9 },
            "C": { 1: 1, 2: 5, 3: 2, 4: 2, 5: 6, 6: 6, 7: 6, 8: 6, 9: 9 },
        }
    }

    // Function to get the tone number from a syllable
    function getTone({syllable='', sandhi=null, suffix='', neutral=null}) {
        const isChecked = /[pthk]\.?$/.test(syllable);
        const isH = /[h]$/.test(syllable);
        const normalized = syllable.normalize('NFD');
        
        let tone = null;
        for (let i = 0; i < normalized.length; i++) {
            const code = normalized.charCodeAt(i);
            if (code >= 0x0300 && code <= 0x036F) { // Combining diacritics
                tone =  code === 0x0301 ? 2 :
                        code === 0x0300 ? 3 :
                        code === 0x0302 ? 5 :
                        code === 0x030C ? 6 :
                        code === 0x0304 ? 7 :
                        code === 0x030D ? 8 :
                        code === 0x030B && 9
            }
        }
        tone ??= isChecked ? 4 : 1
        let color = (tone != 9 && sandhi) ? (suffix == 'á' ? 'blue': 'red') : null

        if (neutral=='before') return { tone: tone, color: 'green' }
        if (neutral=='after') return { tone: 0, color: 'green' }
        if (!color) return { tone: tone }
        
        return {
            tone, color,
            ...Object.entries(sandhi_map[suffix === 'á']).reduce(
                (obj, [k, v]) => (obj[`sandhi_${k}`] = v[tone], obj), {}
            )
        };
    }

    // Modified from https://github.com/andreihar/taibun.js
    function isCjk(input) {
        return [...input].some(char => {
            const code = char.codePointAt(0);
            return (
                (0x4E00 <= code && code <= 0x9FFF) ||  // BASIC
                (0x3400 <= code && code <= 0x4DBF) ||  // Ext A
                (0x20000 <= code && code <= 0x2A6DF) ||  // Ext B
                (0x2A700 <= code && code <= 0x2EBEF) ||  // Ext C,D,E,F
                (0x30000 <= code && code <= 0x323AF) ||  // Ext G,H
                (0x2EBF0 <= code && code <= 0x2EE5F)  // Ext I
            );
        });
    }

    function highlightSandhi(text) {
        const words = text.replace('/',' / ').split(/\s+/);
        return `
        <div class="d-flex flex-row flex-wrap align-items-end">
            ${words.map((v1, i) => {
                let w1 = v1.split('--');
                return w1.map((v2, j) => {
                    let word = v2.split('-');
                    return word.map((v3, k) => {
                        if (v3 === '/') return '<div>/</div>';
                        let tone;
                        if (k === word.length - 1 && j !== w1.length - 1) {
                            // Word before 輕聲 neutral tone
                            tone = getTone({ syllable: v3, neutral: 'before' });
                        } else if (k === 0 && j !== 0) {
                            // Word after 輕聲 neutral tone
                            tone = getTone({ syllable: v3, neutral: 'after' });
                        } else if (word.length === 1 && i !== words.length - 1 && ![',','.','!'].some(x => v3.includes(x))) {
                            // Monosyllabic and not the final word
                            tone = getTone({ syllable: v3, sandhi: true, suffix: words[i + 1] });
                        } else {
                            tone = getTone({ syllable: v3, sandhi: k !== word.length - 1, suffix: word[k + 1] });
                        }
                        return `
                            <div class="syllable-cell">
                                <div class="tone ${tone.color}" 
                                    data-tone="${tone.tone}" 
                                    ${Object.entries(tone).map(([k, v]) => `data-${k}=${v}`).join(' ')}
                                >
                                    ${tone[`sandhi_${region}`] || tone.tone}
                                </div>
                                <div>${v3}</div>
                            </div>
                        `;
                    }).join('<div>-</div>');
                }).join('<div>--</div>');
            }).join('&nbsp;')}
        </div>`
    }

    function processPage(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let parent = node.parentNode;
            while (parent) {
                parent = parent.parentNode;
            }
            let text = node.nodeValue.trim();
            if (text && /[\-āáàâǎa̍ēéèêěe̍īíìîǐi̍ōóòôǒo̍ūúùûǔu̍͘]/.test(text) && !isCjk(text)) {
                const div = document.createElement('div');
                div.innerHTML = highlightSandhi(text);
                node.parentNode.replaceChild(div, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('syllable-cell')) {
            if (node.tagName === 'UL' && ['fs-4', 'fw-bold', 'list-inline'].every(c => node.classList.contains(c))) {
                replaceUL(node);
            } else {
                for (let i = 0; i < node.childNodes.length; i++) {
                    processPage(node.childNodes[i]);
                }
            }
        }
        return true
    }

    function replaceUL(node) {
        // Get all span texts from li children and join with "/"
        let spanTexts = Array.from(node.querySelectorAll('li'))
            .map(li => li.querySelector('span')?.textContent || '')
            .filter(text => text)
            .join('/');
        node.querySelectorAll('span').forEach(span => span.remove());

        node.parentNode.classList.remove('align-items-baseline');
        node.parentNode.classList.add('align-items-end');
        node.lastChild.classList.remove('slash-divider');
        const div = document.createElement('li');
        div.innerHTML = highlightSandhi(spanTexts);
        div.classList.add('list-inline-item');
        node.insertBefore(div, node.firstChild);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        .custom-tooltip {
            display: none;
            position: absolute;
            background-color: white;
            padding: 5px 10px;
            border: 4px solid black;
            border-radius: 4px;
            font-size: 12px;
            z-index: 100;
        }
        .btn.lang, .btn.region {
            padding: 0;
            font-size: .8rem;
        }
        .selected {
            text-decoration: underline;
        }
        .not_selected {
            color: grey;
        }
        .tone {
            font-size: .8rem;
            text-align: center;
        }
        .tone.red {
            color: red;
            font-weight: 700;
        }
        .tone.blue {
            color: blue;
            font-weight: 700;
        }
        .tone.green {
            color: green;
            font-weight: 700;
        }
        .tone.red:hover, .tone.blue:hover {
            cursor: pointer;
            background-color: #f0f0f0;
        }
    `;
    document.head.appendChild(style);

    const tooltip = document.createElement('div');
    tooltip.id = 'custom-tooltip';
    tooltip.className = 'custom-tooltip';
    tooltip.innerHTML = '<div id="lang_setting"></div>' + '<div id="sandhi_diagram"></div>'
    document.body.appendChild(tooltip);

    document.addEventListener('click', (e) => {
        const tooltip = document.getElementById('custom-tooltip');
        if (e.target.classList.contains('tone') && e.target.dataset.color && e.target.dataset.color != 'green') {
            tooltip.style.display = 'block';
            syl_id = `${e.target.dataset.tone}_${e.target.dataset[`sandhi_${region.toLowerCase()}`]}`
            syl_color = e.target.dataset.color

            const rect = e.target.getBoundingClientRect();
            let left = rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2;
            let top = rect.top + window.scrollY - tooltip.offsetHeight - 10;

            left = Math.max(0, Math.min(left, window.innerWidth - tooltip.offsetWidth));
            top = top < 0 ? rect.top + window.scrollY + rect.height + 10 : top;

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        } else if (['btn', 'lang'].every(c => e.target.classList.contains(c))) {
            lang = e.target.dataset.val
            setValue('lang', lang)
        } else if (['btn', 'region'].every(c => e.target.classList.contains(c))) {
            refreshDisplay(region, e.target.dataset.val)
            region = e.target.dataset.val
            setValue('region1', region)
        } else if (!tooltip.contains(e.target)) {
            tooltip.style.display = 'none';
        }
        refreshLang()
        refreshSandhi()
    });

    // Run initially and observe for changes
    console.log("taigi-sandhi-visualization")
    if (processPage(document.getElementsByTagName('main')[0])) {
        console.log('done')
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    processPage(node)
                }
            });
        });
        console.log('done')
    });
    observer.observe(document.getElementsByTagName('main')[0], { childList: true, subtree: true });
})();