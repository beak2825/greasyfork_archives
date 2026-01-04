// ==UserScript==
// @name        DC Helper
// @namespace   https://github.com/KerfuffleV2/
// @match       https://duchinese.net/*
// @match       https://www.duchinese.net/*
// @version     0.6
// @run-at      document-start
// @inject-into page
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @author      KerfuffleV2
// @description Unofficial extensions for DuChinese (Mandarin Chinese learning site)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457745/DC%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/457745/DC%20Helper.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!***********************************!*\
  !*** ./src/index.ts + 10 modules ***!
  \***********************************/

;// CONCATENATED MODULE: ./src/config.ts
class FontFamily {
    constructor(name, typ = 'local', simplified, traditional) {
        this.name = name;
        this.typ = typ ?? 'local';
        this.simplified = simplified ?? false;
        this.traditional = traditional ?? false;
    }
}
const defaultConfig = {
    theme: 'dark',
    hanziType: 'simplified',
    wordSpacing: false,
    hanziToneColors: 'vivid',
    hanziToneColorThreshold: 0,
    sandhiHints: 'on',
    annoType: 'off',
    annoPosition: 'over',
    annoThreshold: 0,
    hintOnlyFirst: 'off',
    hintOnlyHover: 'off',
    audioVolume: 50,
    audioLoop: false,
    audioSpeed: 100,
    fontSize: '20pt',
    fontWeight: 400,
    fontFamilySimplified: 'local:serif',
    fontFamilyTraditional: 'local:serif',
    vocabHskThreshold: 1,
    vocabVerbose: false,
};
const fontFamilies = [
    new FontFamily('default', 'local', true, true),
    new FontFamily('sans-serif', 'local', true, true),
    new FontFamily('serif', 'local', true, true),
    // new FontFamily('AR PL UMing CN', 'local', true, true),
    // new FontFamily('AR PL UKai CN', 'local', true, true),
    new FontFamily('Noto Sans SC', 'google', true, false),
    new FontFamily('Noto Serif SC', 'google', true, false),
    new FontFamily('Noto Sans TC', 'google', false, true),
    new FontFamily('Noto Serif TC', 'google', false, true),
    new FontFamily('ZCOOL XiaoWei', 'google', true, false),
    new FontFamily('ZCOOL QingKe HuangYou', 'google', true, true),
    new FontFamily('Ma Shan Zheng', 'google', true, false),
    new FontFamily('ZCOOL KuaiLe', 'google', true, false),
    new FontFamily('Zhi Mang Xing', 'google', true, false),
];
const themes = {
    dark: {
        backgroundColor: '#001b26',
        border: '3px inset #204b56',
        borderSmall: '1px solid #404b56',
        textColor: '#bbb',
        activeSyllable: 'background-color: rgba(100,150,150,0.4);',
        activeWord: 'background-color: rgba(100,150,150,0.3);',
        activeSentence: 'background-color: rgba(100,150,150,0.1);',
        hoverWord: 'background-color: rgba(100,100,80,0.15);',
        hoverSentence: 'background-color: rgba(100,100,80,0.15);',
        hoverSentenceHint: 'box-shadow: 0px 3px 3px rgba(100,100,150,0.8);',
        toneThemes: {
            vivid: {
                tones: [
                    '#eee',
                    'crimson',
                    'orange',
                    'limegreen',
                    'cornflowerblue',
                    'grey',
                ],
                toneChange: {
                    2: 'border-bottom: .5px double orange; border-radius: 30% 10%;',
                    4: 'border-bottom: .5px double deepskyblue; border-radius: 10% 30%;',
                },
            },
            pastel: {
                tones: ['#ddd', '#cfa0a0', '#cfcfa0', '#a0cfa0', '#a0a0cf', '#9a9a9a'],
                toneChange: {
                    2: 'border-bottom: 1px solid #e0c070; border-radius: 30% 10%;',
                    4: 'border-bottom: 1px solid #8080e0; border-radius: 10% 30%;',
                },
            },
        },
    },
    light: {
        backgroundColor: '#f9f9f9',
        border: '2px inset #a0d0d0',
        borderSmall: '1px solid #80a0a0',
        textColor: 'inherit',
        activeSyllable: 'background-color: rgba(150,150,150,0.4);',
        activeWord: 'background-color: rgba(150,150,150,0.3);',
        activeSentence: 'background-color: rgba(150,150,150,0.2);',
        hoverWord: 'background-color: rgba(100,100,80,0.35);',
        hoverSentence: 'background-color: rgba(100,100,100,0.20);',
        hoverSentenceHint: 'box-shadow: 0px 3px 3px rgba(100,100,150,0.8);',
        toneThemes: {
            vivid: {
                tones: ['inherit', '#a01010', '#a09010', '#109010', '#1010a0', 'gray'],
                toneChange: {
                    2: 'border-bottom: 2px solid #f0e070; border-radius: 30% 10%;',
                    4: 'border-bottom: 2px solid #8080f0; border-radius: 10% 30%;',
                },
            },
            pastel: {
                tones: ['inherit', '#601010', '#606010', '#106010', '#101040', 'gray'],
                toneChange: {
                    2: 'border-bottom: 2px solid #e0c070; border-radius: 30% 10%;',
                    4: 'border-bottom: 2px solid #8080e0; border-radius: 10% 30%;',
                },
            },
        },
    },
};
const configOptions = {
    theme: { name: 'Theme', options: ['dark', 'light'] },
    hanziType: { name: 'Characters', options: ['simplified', 'traditional'] },
    wordSpacing: { name: 'Show spaces between words', options: [true, false] },
    hanziToneColors: { name: 'Tone colors', options: ['off', 'vivid', 'pastel'] },
    hanziToneColorThreshold: {
        name: 'Tone color HSK level threshold',
        options: Array.from({ length: 10 }, (_, idx) => idx),
    },
    sandhiHints: { name: 'Tone sandhi hints', options: ['off', 'on'] },
    annoType: {
        name: 'Annotation type',
        options: [
            'off',
            'pinyin',
            'zhuyin',
            'ipa',
            'tonemark',
            'tonenumber',
            'hsklevel',
            'otherzi',
            'traditionalzi',
            'simplifiedzi',
        ],
    },
    annoPosition: {
        name: 'Annotation position',
        options: [
            'over',
            'under',
            'left',
            'right',
            'left-vertical',
            'right-vertical',
        ],
    },
    annoThreshold: {
        name: 'Annotation HSK level threshold',
        options: Array.from({ length: 10 }, (_, idx) => idx),
    },
    hintOnlyFirst: {
        name: 'Only show annotation or tone color once per word',
        options: ['off', 'both', 'annotation', 'tonecolor'],
    },
    hintOnlyHover: {
        name: 'Only show annotation or tone color when hovered',
        options: ['off', 'both', 'annotation', 'tonecolor'],
    },
    audioVolume: {
        name: 'Initial volume',
        options: Array.from({ length: 11 }, (_, idx) => 10 * idx),
    },
    audioSpeed: {
        name: 'Initial play rate',
        options: Array.from({ length: 20 }, (_, idx) => 10 + 10 * idx),
    },
    fontSize: {
        name: 'Font size',
        options: Array.from({ length: 23 }, (_, idx) => `${8 + idx}pt`),
    },
    fontWeight: {
        name: 'Font weight',
        options: Array.from({ length: 10 }, (_, idx) => 100 + 100 * idx),
    },
    fontFamilySimplified: {
        name: 'Font (simplified)',
        options: fontFamilies
            .filter(x => x.simplified === true)
            .map(x => `${x.typ}:${x.name}`),
    },
    fontFamilyTraditional: {
        name: 'Font (traditional)',
        options: fontFamilies
            .filter(x => x.traditional === true)
            .map(x => `${x.typ}:${x.name}`),
    },
    vocabHskThreshold: {
        name: 'Vocabulary HSK threshold',
        options: Array.from({ length: 7 }, (_, idx) => idx + 1),
    },
    vocabVerbose: {
        name: 'Use verbose vocabulary format',
        options: [true, false],
    },
};
class UserscriptConfigStore {
    constructor(get, set, del) {
        this.getter = get;
        this.setter = set;
        this.deleter = del;
    }
    get() {
        return this.getter('config');
    }
    set(cfg) {
        this.setter('config', cfg);
    }
    clear() {
        this.deleter('config');
    }
}
class Config {
    constructor(bus, store, cfg) {
        cfg = cfg ?? store.get() ?? defaultConfig;
        for (const [k, v] of Object.entries(defaultConfig)) {
            if (v === undefined ||
                configOptions[k]?.options.findIndex(i => i === v) < 0) {
                cfg[k] = defaultConfig[k];
            }
        }
        this.cfg = cfg;
        this.bus = bus;
        this.store = store;
        this.element = this.initElement();
    }
    get(key) {
        return this.cfg[key];
    }
    makeOption(name, option) {
        const el = document.createElement('label');
        const sel = document.createElement('select');
        sel.setAttribute('name', name);
        const bus = this.bus;
        sel.addEventListener('change', evt => {
            if (!evt.target || !('value' in evt.target)) {
                return;
            }
            this.cfg[name] = JSON.parse(evt.target.value);
            bus.dispatchEvent(new CustomEvent('configupdate', { detail: this }));
        });
        el.appendChild(document.createTextNode(`${option.name ?? name}: `));
        el.setAttribute('class', 'dchoptlabel');
        for (const optval of option.options) {
            const oel = document.createElement('option');
            oel.setAttribute('value', JSON.stringify(optval));
            const currval = this.cfg[name] ?? defaultConfig[name] ?? null;
            if (currval === optval) {
                oel.setAttribute('selected', '');
            }
            oel.appendChild(document.createTextNode(`${optval}`));
            sel.appendChild(oel);
        }
        el.appendChild(sel);
        return el;
    }
    initElement() {
        const el = document.createElement('div');
        el.setAttribute('id', 'dchelper-config');
        el.setAttribute('hidden', '');
        for (const [ok, ov] of Object.entries(configOptions)) {
            el.appendChild(this.makeOption(ok, ov));
        }
        const pel = document.createElement('p');
        {
            const lel = document.createElement('a');
            lel.setAttribute('href', '#0');
            lel.appendChild(document.createTextNode('[Save]'));
            lel.addEventListener('click', _evt => {
                this.store.set(this.cfg);
                return false;
            });
            pel.appendChild(lel);
            el.appendChild(pel);
        }
        pel.appendChild(document.createTextNode(' | '));
        {
            const lel = document.createElement('a');
            lel.setAttribute('href', '#0');
            lel.appendChild(document.createTextNode('[Clear]'));
            lel.addEventListener('click', _evt => {
                this.store.clear();
                return false;
            });
            pel.appendChild(lel);
        }
        el.appendChild(pel);
        return el;
    }
}


;// CONCATENATED MODULE: ./src/styles.ts

function applyStyles(cfg) {
    let sel = document.getElementById('dchelper-styles');
    if (sel) {
        sel.remove();
    }
    else {
        sel = document.createElement('style');
        sel.setAttribute('id', 'dchelper-styles');
    }
    const theme = themes[cfg.theme ?? 'dark'] ?? themes.dark;
    const tonetheme = theme?.toneThemes?.[cfg.hanziToneColors];
    const origfontfamily = cfg[cfg.hanziType === 'simplified'
        ? 'fontFamilySimplified'
        : 'fontFamilyTraditional'];
    const fontfamily = origfontfamily.split(':')[1];
    const annoOnlyHover = ['annotation', 'both'].includes(cfg.hintOnlyHover);
    const tcOnlyHover = ['tonecolor', 'both'].includes(cfg.hintOnlyHover);
    const tonestyles = tonetheme?.tones
        ?.map((v, idx) => `${tcOnlyHover
        ? `.dchchunk:hover .dchtone${idx} , #dchelper-vocab `
        : ''}.dchtone${idx} { color: ${v}; }`)
        .join('\n') ?? '';
    const tonechangestyles = Object.entries(tonetheme?.toneChange ?? {})
        .map(([k, v]) => `.dchtonechange${k} { ${v} }`)
        .join('\n');
    const annoNormal = cfg.annoPosition === 'over' || cfg.annoPosition === 'under';
    const annoVertical = cfg.annoPosition === 'left-vertical' ||
        cfg.annoPosition === 'right-vertical';
    const wordSpacing = cfg.wordSpacing ?? false;
    if (origfontfamily.startsWith('google:')) {
        document.getElementById('dchelper-rstyles')?.remove();
        const el = document.createElement('link');
        el.setAttribute('id', 'dchelper-rstyles');
        el.setAttribute('rel', 'stylesheet');
        el.setAttribute('href', `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontfamily)}`);
        document.head?.appendChild(el);
    }
    const style = `
    .dchcontainer {
      width: 100%;
      font-size: 1.5em;
      background-color: ${theme.backgroundColor};
      border-radius: .5em;
      border: ${theme.border};
      padding: 1em;
    }

    .dchtext {
      font-size: ${cfg.fontSize};
      ${fontfamily !== 'default' ? `font-family: "${fontfamily}";` : ''}
      font-weight: ${cfg.fontWeight};
      padding-bottom: 1em;
      padding-top: .5em;
      color: ${theme.textColor};
      text-rendering: optimizeLegibility;
    }

    #dchelper-config {
      font-size: 1em;
      font-family: sans-serif;
    }

    label.dchoptlabel {
      font-size: 16pt;
      line-height: 17pt;
      font-weight: 600;
      color: ${theme.textColor};
      display: block;
    }
    .dchoptlabel select {
      color: #ccc;
      background-color: #101a1a;
      font-size: 14pt;
      line-height: 15pt;
    }

    #dchelper-audioplayer { height: 1em; }

    #dchelper-translationtext, #dchelper-pinyintext {
      color: ${theme.textColor};
      padding-bottom: .5em;
      padding-top: .5em;
      font-size: 16pt;
      font-weight: normal;
      font-family: serif;
      font-style: normal;
    }

    #dchelper-pinyintext {
      font-family: sans-serif;
    }

    #dchelper-vocab {
      border-radius: .25em;
      border: ${theme.border};
      padding-left: 1em;
      padding-right: 1em;
      margin-top: .5em;
      margin-bottom: 1em;
      padding-top: 0px;
    }

    #dchelper-vocab table {
      margin-top: 1.5em;
      border-collapse: collapse;
      border: ${theme.borderSmall};
      letter-spacing: 1px;
      font-family: sans-serif;
      font-size: 0.8em;
    }
    #dchelper-vocab td, #dchelper-vocab th {
      border: ${theme.borderSmall};
      padding: 4px;
      white-space: nowrap;
    }
    #dchelper-vocab td.dch-vocabdef {
      white-space: normal;
    }

    .dchword {
      ${annoNormal ? `ruby-position: ${cfg.annoPosition};` : ''}
      ruby-align: center;
    }

    .dchword rt {
      white-space: pre-wrap;
      font-weight: 400;
      font-family: monospace;
      padding-left: 2pt;
      padding-right: 2pt;
      ${annoOnlyHover ? 'visibility: collapse;' : ''}
    }
    ${annoOnlyHover ? '.dchchunk:hover rt { visibility: visible; }' : ''}

    ${wordSpacing ? '.dchword + .dchword { padding-left: .3em; }' : ''}

    .dchpad, .dchpadhint { white-space: pre-wrap; }
    .dchpadhint { width: 16pxm; min-width: 16px; }

    .dchactivesyl { ${theme.activeSyllable} }

    .dchactiveword { ${theme.activeWord} }

    .dchactivesent { ${theme.activeSentence} }

    .dchchunk {
      margin: 0;
      padding: 0;
      margin-bottom: .2em;
      line-height: calc(${cfg.fontSize} + 4pt);
    }
    #dchsent0 { font-size: 135%; }
    .dchsent:hover { ${theme.hoverSentence} }
    .dchword:hover { ${theme.hoverWord} }
    .dchsent:hover span.dchpadhint { ${theme.hoverSentenceHint} }
    .dchsyl, .dchword, .dchsent {
      transition: all 0.25s ease;
      border-radius: .15em;
    }
    .dchsyl {
      ${annoVertical
        ? 'writing-mode: vertical-rl; text-orientation: upright;'
        : ''}
      ${annoNormal ? '' : 'display: inline;'}
    }
    ${tonestyles}
    ${tonechangestyles}
  `;
    sel.textContent = style;
    document.head?.append(sel);
}


;// CONCATENATED MODULE: ./src/globals.ts

let configuration;
const bus = new EventTarget();
function set_configuration(cfg) {
    configuration = cfg;
}


;// CONCATENATED MODULE: ./src/util.ts
function mkElementTree(typ, attrs, children) {
    const el = document.createElement(typ);
    if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v ?? ''));
    }
    if (!children) {
        return el;
    }
    if (typeof children === 'string') {
        children = [children];
    }
    const isChild = (v) => typeof v !== 'string';
    for (const child of children) {
        switch (typeof child) {
            case 'string':
                el.appendChild(document.createTextNode(child));
                break;
            case 'object':
                if (child instanceof Element) {
                    el.appendChild(child);
                }
                else if (isChild(child)) {
                    el.appendChild(mkElementTree(child.typ, child.attrs, child.children));
                }
                break;
        }
    }
    return el;
}


;// CONCATENATED MODULE: ./src/pinyin_converter.ts
const unicodeToneRe = /[\u0304\u0301\u030c\u0300]/gu;
const pinyin_initial = [
    'b',
    'p',
    'm',
    'f',
    'd',
    't',
    'n',
    'l',
    'z',
    'c',
    's',
    'zh',
    'ch',
    'sh',
    'r',
    'j',
    'q',
    'x',
    'g',
    'k',
    'h',
];
const zhuyin_initial = [
    'ㄅ',
    'ㄆ',
    'ㄇ',
    'ㄈ',
    'ㄉ',
    'ㄊ',
    'ㄋ',
    'ㄌ',
    'ㄗ',
    'ㄘ',
    'ㄙ',
    'ㄓ',
    'ㄔ',
    'ㄕ',
    'ㄖ',
    'ㄐ',
    'ㄑ',
    'ㄒ',
    'ㄍ',
    'ㄎ',
    'ㄏ',
];
const ipa_initial = [
    'p',
    'pʰ',
    'm',
    'f',
    't',
    'tʰ',
    'n',
    'l',
    'ts',
    'tsʰ',
    's',
    'tʂ',
    'tʂʰ',
    'ʂ',
    'ʐ',
    'tɕ',
    'tɕʰ',
    'ɕ',
    'k',
    'kʰ',
    'x',
];
const pinyin_final = [
    'a',
    'ai',
    'ao',
    'an',
    'ang',
    'e',
    'ei',
    'en',
    'eng',
    'er',
    'o',
    'ou',
    'ong',
    'i',
    'i',
    'ia',
    'iao',
    'ie',
    'iu',
    'ian',
    'iang',
    'in',
    'ing',
    'iong',
    'u',
    'ua',
    'uai',
    'ui',
    'uo',
    'uan',
    'uang',
    'un',
    'eng',
    'v',
    've',
    'van',
    'vn',
];
const pinyin_no_initial = [
    'a',
    'ai',
    'ao',
    'an',
    'ang',
    'e',
    'ei',
    'en',
    'eng',
    'er',
    'o',
    'ou',
    'ong',
    'yi',
    '',
    'ya',
    'yao',
    'ye',
    'you',
    'yan',
    'yang',
    'yin',
    'ying',
    'yong',
    'wu',
    'wa',
    'wai',
    'wei',
    'wo',
    'wan',
    'wang',
    'wen',
    'weng',
    'yu',
    'yue',
    'yuan',
    'yun',
];
const zhuyin_final = [
    'ㄚ',
    'ㄞ',
    'ㄠ',
    'ㄢ',
    'ㄤ',
    'ㄜ',
    'ㄟ',
    'ㄣ',
    'ㄥ',
    'ㄦ',
    'ㄛ',
    'ㄡ',
    'ㄨㄥ',
    'ㄧ',
    '',
    'ㄧㄚ',
    'ㄧㄠ',
    'ㄧㄝ',
    'ㄧㄡ',
    'ㄧㄢ',
    'ㄧㄤ',
    'ㄧㄣ',
    'ㄧㄥ',
    'ㄩㄥ',
    'ㄨ',
    'ㄨㄚ',
    'ㄨㄞ',
    'ㄨㄟ',
    'ㄨㄛ',
    'ㄨㄢ',
    'ㄨㄤ',
    'ㄨㄣ',
    'ㄨㄥ',
    'ㄩ',
    'ㄩㄝ',
    'ㄩㄢ',
    'ㄩㄣ', // yun
];
const ipa_final = [
    'ɑ',
    'aɪ̯',
    'ɑʊ̯',
    'an',
    'ɑŋ',
    'ɯ̯ʌ',
    'eɪ̯',
    'ən',
    'əŋ',
    'ɑɻ',
    'ɔ',
    'ɤʊ̯',
    'ʊŋ',
    'i',
    'ɿ',
    'i̯ɑ',
    'i̯ɑʊ̯',
    'iɛ',
    'i̯ɤʊ̯',
    'iɛn',
    'i̯ɑŋ',
    'in',
    'iŋ',
    'i̯ʊŋ',
    'u',
    'u̯ɑ',
    'u̯aɪ̯',
    'u̯eɪ̯',
    'u̯ɔ',
    'u̯an',
    'u̯ɑŋ',
    'u̯ən',
    'u̯əŋ',
    'y',
    'y̯œ',
    'y̯ɛn',
    'yn', // yun
];
const zhuyin_cache = new Map();
const ipa_cache = new Map();
class PinyinConverter {
    static is_name(pin, meaning) {
        const nmarkre = /\(\s*name\s*\)/i;
        const nre = /^(\p{Lu}[\p{LC}\s]+)/u;
        const spacere = /\s/g;
        if (nmarkre.test(meaning)) {
            return true;
        }
        pin = pin
            .normalize('NFD')
            .replaceAll(unicodeToneRe, '')
            .normalize('NFC')
            .toLowerCase()
            .replaceAll(spacere, '');
        meaning = meaning
            .normalize('NFD')
            .replaceAll(unicodeToneRe, '')
            .normalize('NFC');
        const result = meaning.match(nre);
        if (!result) {
            return false;
        }
        const mpart = result[0].replaceAll(spacere, '').toLowerCase();
        return mpart.length > 0 && pin.length > 0 && mpart === pin;
    }
    static normalize_pinyin(pin) {
        const funkyu = 'ü'.normalize('NFD');
        pin = pin.trim().toLowerCase();
        pin = pin.normalize('NFD').replaceAll(unicodeToneRe, '');
        pin = pin.replaceAll(funkyu, 'v');
        if (pin === 'r') {
            pin = 'er';
        }
        return pin;
    }
    static split_pinyin(pin) {
        const no_initial_chars = new Set(['a', 'e', 'o', 'y', 'w']);
        if (no_initial_chars.has(pin[0])) {
            return [-1, pinyin_no_initial.findIndex(i => i === pin)];
        }
        const ilen = pin[1] === 'h' ? 2 : 1;
        const iidx = pinyin_initial.findIndex(i => i.length === ilen && pin.startsWith(i));
        if (iidx === -1) {
            return [-1, -1];
        }
        const pinitial = pinyin_initial[iidx];
        let pfinal = pin.substr(ilen);
        if ((pinitial === 'j' || pinitial === 'q' || pinitial === 'x') &&
            pfinal[0] === 'u') {
            pfinal = 'v'.concat(pfinal.substr(1));
        }
        return [iidx, pinyin_final.findIndex(i => i === pfinal)];
    }
    static convert_zhuyin(pin, _tone) {
        pin = this.normalize_pinyin(pin);
        const cached = zhuyin_cache.get(pin);
        if (cached) {
            return cached;
        }
        const pi_no_zf = new Set(['zh', 'sh', 'ch', 'z', 's', 'c', 'r']);
        const [iidx, fidx] = this.split_pinyin(pin);
        if (iidx < 0) {
            const result = zhuyin_final[fidx];
            if (result) {
                zhuyin_cache.set(pin, result);
                return result;
            }
            else {
                return '(??P)';
            }
        }
        if (fidx < 0) {
            return '(??F)';
        }
        const zinitial = zhuyin_initial[iidx];
        if (pinyin_final[fidx] === 'i' && pi_no_zf.has(pinyin_initial[iidx])) {
            if (zinitial) {
                zhuyin_cache.set(pin, zinitial);
            }
            return zinitial ?? '??ZI';
        }
        const zfinal = zhuyin_final[fidx];
        if (zinitial && zfinal) {
            zhuyin_cache.set(pin, zinitial.concat(zfinal));
        }
        return zinitial?.concat(zfinal ?? '(?F)') ?? '(?I)';
    }
    static convert_ipa(pin, _tone) {
        pin = this.normalize_pinyin(pin);
        const cached = ipa_cache.get(pin);
        if (cached) {
            return cached;
        }
        const [iidx, fidx] = this.split_pinyin(pin);
        if (iidx < 0) {
            const result = ipa_final[fidx];
            if (result) {
                ipa_cache.set(pin, result);
                return result;
            }
            else {
                return '(??P)';
            }
        }
        if (fidx < 0) {
            return '(??F)';
        }
        const ipainitial = ipa_initial[iidx];
        const ipafinal = ipa_final[fidx];
        if (ipainitial && ipafinal) {
            ipa_cache.set(pin, ipainitial.concat(ipafinal));
        }
        return ipainitial?.concat(ipafinal ?? '(?F)') ?? '(?I)';
    }
}


;// CONCATENATED MODULE: ./src/vocabulary.ts


class Vocabulary {
    constructor(slist, words) {
        this.hskWords = new Array(12);
        const slen = slist.length;
        let uniquewordcount = 0, wordcount = 0, hskwordcount = 0, namecount = 0;
        let hsktotal = 0, onlyhsktotal = 0;
        for (let idx = 0; idx < slen;) {
            const { word, phon, hsk } = slist[idx];
            const wsyls = [];
            for (; idx < slen && slist[idx].word === word; idx++) {
                wsyls.push(slist[idx]);
            }
            const currword = words[word];
            if (!phon || !currword || !currword.meaning || !currword.pinyin) {
                continue;
            }
            const [hskidx, hsklevel] = hsk > 0 && hsk < 10
                ? [hsk - 1, hsk]
                : PinyinConverter.is_name(currword.pinyin, currword.meaning)
                    ? [11, 0]
                    : [10, 10];
            if (hsklevel === 11) {
                namecount++;
            }
            else if (hsklevel > 0) {
                hsktotal += hsklevel;
                wordcount++;
                if (hsk && hsklevel < 10) {
                    onlyhsktotal += hsk;
                    hskwordcount++;
                }
            }
            let wm = this.hskWords[hskidx];
            if (!wm) {
                wm = this.hskWords[hskidx] = new Map();
            }
            const we = wm.get(currword.hanzi) ?? {
                word: words[word],
                syls: wsyls,
                count: 0,
            };
            we.count++;
            if (we.count === 1) {
                uniquewordcount++;
                wm.set(currword.hanzi, we);
            }
        }
        this.uniqueWordCount = uniquewordcount;
        this.hskWordCount = hskwordcount;
        this.wordCount = wordcount;
        this.avgHsk = hskwordcount > 0 ? onlyhsktotal / hskwordcount : 0;
        const nonnamecount = wordcount - namecount;
        this.avgHskAll = nonnamecount > 0 ? hsktotal / nonnamecount : 0;
        this.el = null;
    }
    element(configuration) {
        if (this.el) {
            return this.el;
        }
        const clipael = document
            ?.querySelector('#dchelper-audioplayer')
            ?.cloneNode(true);
        if (!clipael) {
            return null;
        }
        const defaultVolume = Number((configuration.get('audioVolume') ?? 100) / 100);
        let active = null;
        async function playclip(pos, length) {
            if (active || !clipael) {
                return;
            }
            active = Math.round(length * 1000) + 75;
            if (!clipael.paused) {
                clipael.pause();
            }
            clipael.currentTime = Math.max(0, pos - 0.02);
            clipael.volume = defaultVolume;
            try {
                await clipael.play();
            }
            catch (err) {
                active = null;
                console.log('DCHelper: Could not play vocab clip:', err);
            }
        }
        clipael?.addEventListener('playing', _evt => {
            if (!active) {
                clipael.volume = 0.0;
                clipael.pause();
                return;
            }
            setTimeout(() => {
                clipael.volume = 0.0;
                clipael.pause();
                active = null;
            }, active);
        });
        const zityp = configuration.get('hanziType') === 'traditional' ? 'tzi' : 'szi';
        const formatter = new Intl.NumberFormat(undefined, {
            maximumFractionDigits: 3,
        });
        const el = mkElementTree('div', {
            id: 'dchelper-vocab',
            hidden: '',
            class: 'dchvocabcontainer dchtext',
        }, [
            { typ: 'h3', children: 'Vocabulary (click to dismiss)' },
            {
                typ: 'small',
                children: 'Note: Unknown words are counted as HSK 10 when averaging for "all".',
            },
            {
                typ: 'div',
                children: `Word count (unique/HSK only/all): ${this.uniqueWordCount} / ${this.hskWordCount} / ${this.wordCount}`,
            },
            {
                typ: 'div',
                children: `Avg. HSK level (HSK only/all): ${formatter.format(this.avgHsk)} / ${formatter.format(this.avgHskAll)}`,
            },
        ]);
        el.firstChild?.addEventListener('click', () => el.setAttribute('hidden', ''));
        function mkCatName(idx) {
            switch (idx) {
                case 10:
                    return 'Non-HSK';
                case 11:
                    return 'Name';
                default:
                    return `HSK ${idx + 1}`;
            }
        }
        const vocabThreshold = (configuration.get('vocabHskThreshold') ?? 1) - 1;
        const verbose = configuration.get('vocabVerbose') ?? false;
        function buildBrief(wm, idx) {
            if (idx < vocabThreshold) {
                return;
            }
            const wl = Array.from(wm.entries()).sort((i1, i2) => i2[1].count - i1[1].count);
            const lel = mkElementTree('div', null, [
                { typ: 'hr' },
                { typ: 'strong', children: `${mkCatName(idx)} (${wl.length}x):` },
            ]);
            let lastcount = null;
            for (const [_szi, word] of wl) {
                lel.appendChild(mkElementTree('span', { class: 'dchother' }, [
                    lastcount === word.count
                        ? '，'
                        : ((lastcount = word.count), ` 【${word.count}x】`),
                ]));
                const wel = mkElementTree('span', {
                    class: 'dchword',
                    title: `** ${word.word.pinyin} **\n${word.word.meaning ?? ''}`,
                }, word.syls.map(syl => {
                    return {
                        typ: 'span',
                        attrs: { class: `dchsyl dchtone${syl.tone ?? 5}` },
                        children: syl[zityp],
                    };
                }));
                const stime = word.syls[0]?.syltime?.start ?? null;
                let etime = 0;
                if (clipael && stime) {
                    for (const syl of word.syls) {
                        if (syl.syltime?.start) {
                            etime = Math.max(etime, syl.syltime?.end ?? clipael.duration);
                        }
                    }
                    wel.addEventListener('click', evt => {
                        playclip(stime, etime - stime);
                        evt.stopPropagation();
                    });
                }
                lel.appendChild(wel);
            }
            el.appendChild(lel);
        }
        function buildVerbose(tel, wm, idx) {
            if (idx < vocabThreshold) {
                return;
            }
            const wl = Array.from(wm.entries()).sort((i1, i2) => i2[1].count - i1[1].count);
            const catname = mkCatName(idx);
            tel.appendChild(mkElementTree('tr', null, [
                {
                    typ: 'th',
                    children: catname,
                },
                {
                    typ: 'th',
                    attrs: { colspan: '4' },
                    children: `${wl.length} (total)`,
                },
            ]));
            for (const [_szi, word] of wl) {
                const pinyin = word.word.pinyin ?? '', meaning = word.word.meaning ?? '';
                const rel = mkElementTree('tr', null, [
                    {
                        typ: 'td',
                        children: catname,
                    },
                    {
                        typ: 'td',
                        children: word.count.toString(),
                    },
                    {
                        typ: 'td',
                        children: word.syls.map(syl => {
                            return {
                                typ: 'span',
                                attrs: { class: `dchsyl dchtone${syl.tone ?? 5}` },
                                children: syl[zityp],
                            };
                        }),
                    },
                    {
                        typ: 'td',
                        children: pinyin,
                    },
                    {
                        typ: 'td',
                        attrs: { class: 'dch-vocabdef' },
                        children: meaning?.replaceAll('\n', ' ❙ '),
                    },
                ]);
                const stime = word.syls[0]?.syltime?.start ?? null;
                let etime = 0;
                if (clipael && stime) {
                    for (const syl of word.syls) {
                        if (syl.syltime?.start) {
                            etime = Math.max(etime, syl.syltime?.end ?? clipael.duration);
                        }
                    }
                    rel.addEventListener('click', evt => {
                        playclip(stime, etime - stime);
                        evt.stopPropagation();
                    });
                }
                tel.appendChild(rel);
            }
        }
        if (verbose) {
            const tel = mkElementTree('table', null, [
                {
                    typ: 'thead',
                    children: [
                        {
                            typ: 'th',
                            children: 'Type',
                        },
                        {
                            typ: 'th',
                            children: '#',
                        },
                        {
                            typ: 'th',
                            children: '字',
                        },
                        {
                            typ: 'th',
                            children: '拼音',
                        },
                        {
                            typ: 'th',
                            children: 'Meaning',
                        },
                    ],
                },
            ]);
            const tbody = document.createElement('tbody');
            tel.appendChild(tbody);
            this.hskWords.forEach((wm, idx) => buildVerbose(tbody, wm, idx));
            el.appendChild(tel);
        }
        else {
            this.hskWords.forEach(buildBrief);
        }
        this.el = el;
        return el;
    }
}


;// CONCATENATED MODULE: ./src/trackplayback.js
function TrackPlayback(syls, stimes) {
  const me = this;

  this.pos = null;
  this.last = null;
  this.lastsent = null;
  this.lastword = null;

  // From https://stackoverflow.com/a/29018745 because I'm lazy.
  function binarySearch(ar, compare_fn) {
    let m = 0;
    let n = ar.length - 1;
    while (m <= n) {
      const k = (n + m) >> 1;
      const cmp = compare_fn(ar[k]);
      if (cmp > 0) {
        m = k + 1;
      } else if (cmp < 0) {
        n = k - 1;
      } else {
        return k;
      }
    }
    return -m - 1;
  }

  function findSyl(pos) {
    return Math.max(0, Math.abs(binarySearch(stimes, val => pos - val)) - 1);
  }

  this.update = function (pos) {
    if (!pos) {
      me.lastsent?.classList?.remove('dchactivesent');
      me.lastword?.classList?.remove('dchactiveword');
      me.last?.classList?.remove('dchactivesyl');
      me.lastsent = null;
      me.lastword = null;
      me.last = null;
      me.pos = null;
      return;
    }
    me.pos = pos;
    const idx = findSyl(pos);
    const currsyl = syls[idx];
    if (!currsyl) {
      return;
    }
    const [_cel, sel, wel, yel] = currsyl;
    if (me.lastsent !== sel) {
      me.lastsent?.classList?.remove('dchactivesent');
      me.lastsent = sel;
      sel?.classList?.add('dchactivesent');
    }
    if (me.lastword !== wel) {
      me.lastword?.classList?.remove('dchactiveword');
      me.lastword = wel;
      wel?.classList?.add('dchactiveword');
    }
    if (me.last !== yel) {
      me.last?.classList?.remove('dchactivesyl');
      me.last = yel;
      yel?.classList?.add('dchactivesyl');
    }
  };
}



;// CONCATENATED MODULE: ./src/crd.js





function CRD(crdtext) {
  const me = this;

  const toneRe = /[\u0304\u0301\u030c\u0300]/u;
  const spaceRe = /[\s'‘]+/;
  const toneMarkChars = ['\u0304', '\u0301', '\u030c', '\u0300'];
  const toneMap = new Map(toneMarkChars.map((tc, idx) => [tc, idx + 1]));

  const punctFixup = new Map([
    ['，', ', '],
    ['、', ', '],
    ['。', '. '],
    ['：', ': '],
    ['；', '; '],
    ['“', ' "'],
    ['”', '"'],
    ['‘', "'"],
    ['！', '!'],
    ['？', '?'],
  ]);
  function fixPunct(s) {
    if (s.length === 0) {
      return s;
    }
    let mc = 0;
    const out = Array.from(s)
        .map(c => {
          const replacement = punctFixup.get(c);
          return replacement !== undefined ? (mc++, replacement) : s;
        })
        .join(''),
      lastc = out[out.length - 1];
    return mc > 0 && s[s.length - 1] !== '“' && lastc !== "'"
      ? out.concat(' ')
      : out;
  }

  me.crd = JSON.parse(crdtext);
  if (unsafeWindow) {
    unsafeWindow.dc_crd = me.crd;
  }
  me.syls = null;
  me.tracker = null;

  function ensureCRD() {
    if (me.crd === null && me.text !== null) {
      me.crd = JSON.parse(me.text);
      unsafeWindow.dc_crd = me.crd;
      me.text = null;
    }
    if (me.crd !== null && me.syls === null) {
      me.syls = makeSyllables(me.crd);
    }
  }

  ensureCRD();

  function pinyinTones(syllables) {
    return syllables.map(syl => {
      const tmatch = syl.normalize('NFD')?.match(toneRe);
      return tmatch ? toneMap.get(tmatch[0]) : 0;
    });
  }

  function makeSyllables(crd) {
    const syl2imap = [];
    const items = [];
    const encountered = new Set();
    let cidx = 0,
      csize = 0,
      widx = -1,
      sidx = 0,
      iidx = 0;

    for (const word of crd.words) {
      widx++;
      if (widx >= crd.sentence_indices[sidx]) {
        sidx++;
      }
      if (!word.hanzi) {
        continue;
      }
      if (!word.pinyin && word.hanzi.trim().length === 0) {
        if (csize === 0) {
          continue;
        }
        cidx++;
        csize = 0;
        continue;
      }
      if (!word.pinyin || !isNaN(word.pinyin)) {
        const syls = word.pinyin ? Number(word.pinyin) ?? 0 : 0;
        const i = {
          chunk: cidx,
          sentence: sidx,
          word: widx,
          raw: word.hanzi,
        };
        if (syls > 0) {
          i.sy = syl2imap.length;
          if (syls > 1) {
            i.sycount = syls;
          }
        }
        items.push(i);
        for (let i = 0; i < syls; i++) {
          syl2imap.push(iidx);
        }
        iidx++;
        csize++;
        continue;
      }
      const first = !encountered.has(word.hanzi);
      if (first) {
        encountered.add(word.hanzi);
      }
      const psyls = word.pinyin.split(spaceRe);
      if (psyls.length !== word.hanzi.length) {
        console.log('DCH: Unexpected syllable length!', word);
        continue;
      }
      const tones = pinyinTones(psyls);
      tones.forEach((tone, charidx) => {
        const i = {
          chunk: cidx,
          sentence: sidx,
          word: widx,
          sy: syl2imap.length,
          szi: word.hanzi[charidx],
          tzi: word.tc_hanzi[charidx],
          tone: tone,
          phon: psyls[charidx],
          hsk: word.hsk,
        };
        // Note: DC uses "r" for erhua, "er" would be a syllable that is actually spoken. i.e. 婴儿
        const is_erhua = charidx > 0 && i.szi === '儿' && i.phon === 'r';
        if (first) {
          i.firstseen = true;
        }
        if (!is_erhua) {
          i.syltime = {
            start: crd.syllable_times[syl2imap.length - 1] ?? 0.0,
            end: crd.syllable_times[syl2imap.length] ?? null,
          };
          syl2imap.push(iidx);
        } else {
          i.sycount = 0;
        }
        items.push(i);
        iidx++;
        csize++;
      });
    }

    items.forEach((item, idx) => {
      let nitem = items[idx + 1];
      const next_is_erhua = nitem && nitem.szi === '儿' && nitem.phon === 'r';
      if (next_is_erhua && nitem.word === item.word) {
        nitem = items[idx + 2];
      }
      if (
        item.tone === 3 &&
        nitem?.sentence === item.sentence &&
        nitem.tone === 3
      ) {
        item.sandhi = 2;
        return;
      }
      if (item.szi === '一' && item.tone !== 1) {
        item.sandhi = item.tone;
        item.tone = 1;
      } else if (item.szi === '不' && item.tone !== 4) {
        item.sandhi = item.tone;
        item.tone = 4;
      }
    });
    return {s: syl2imap, i: items};
  }

  this.makeElement = function (currEl) {
    ensureCRD();
    const simplified = configuration.get('hanziType') === 'simplified';
    const sandhiHints = configuration.get('sandhiHints') === 'on';
    const toneColorThreshold = configuration.get('hanziToneColorThreshold');
    const annoThreshold = configuration.get('annoThreshold');
    const onlyFirst = configuration.get('hintOnlyFirst');
    let showAnnotations = configuration.get('annoType');
    if (showAnnotations === 'off') {
      showAnnotations = null;
    }
    const annoPos = showAnnotations && configuration.get('annoPosition');
    const annoPosLeft =
      annoPos && (annoPos === 'left' || annoPos === 'left-vertical');

    const transdiv = mkElementTree(
        'div',
        {
          id: 'dchelper-translationtext',
          hidden: '',
        },
        [{typ: 'h3', children: 'Translation'}]
      ),
      pindiv = mkElementTree(
        'div',
        {
          id: 'dchelper-pinyintext',
          hidden: '',
        },
        [{typ: 'h3', children: 'Pinyin'}]
      );
    let pinchunk = null,
      transchunk = null,
      plastword = false;
    const el = currEl ?? document.createElement('div');
    el.innerHTML = '';
    el.setAttribute('class', 'dchtext');
    el.setAttribute('id', 'dchelper-storytext');
    const syels = [];
    let lchunk = -1,
      lsentence = -1,
      lword = -1;
    let cel = null,
      sel = null,
      wel = null;
    let transel = null;
    for (const {
      chunk,
      sentence,
      word,
      sy,
      szi,
      tzi,
      tone,
      sandhi,
      phon,
      sycount,
      raw,
      hsk,
      firstseen,
    } of me.syls.i) {
      if (transel === null) {
        const trans = (me.crd.sentence_translations[lsentence] ?? '').trim();
        if (trans.length > 0) {
          transchunk?.appendChild(document.createTextNode(` ${trans}`));
          transel = mkElementTree(
            'span',
            {class: 'dchpadhint', title: trans},
            '   '
          );
        } else {
          transel = undefined;
        }
      }
      if (chunk !== lchunk) {
        plastword = false;
        pinchunk = mkElementTree('p', {class: 'dchchunk'});
        transchunk = mkElementTree('p', {class: 'dchchunk'});
        transdiv.appendChild(transchunk);
        pindiv.appendChild(pinchunk);
        lchunk = chunk;
        cel = mkElementTree(
          'p',
          {class: 'dchchunk'},
          sentence > 0
            ? [{typ: 'span', attrs: {class: 'dchpad'}, children: '  '}]
            : null
        );
        el.appendChild(cel);
        if (sel !== null && transel) {
          sel.appendChild(transel);
        }
        transel = null;
        sel = null;
        wel = null;
      }
      if (!sel || lsentence !== sentence) {
        if (sel !== null && transel) {
          sel.appendChild(transel);
        }
        transel = null;
        lsentence = sentence;
        wel = null;
        sel = document.createElement('span');
        sel.setAttribute('class', 'dchsent');
        if (sentence === 0) {
          sel.setAttribute('id', 'dchsent0');
        }
        cel.appendChild(sel);
      }
      if (!phon) {
        wel = null;
        plastword = sycount > 0 || !!sy;
        pinchunk?.appendChild(
          document.createTextNode(`${plastword ? ' ' : ''}${fixPunct(raw)}`)
        );
        const oel = mkElementTree('span', {class: 'dchother'}, raw);
        sel.appendChild(oel);
        if (sy) {
          const synum = sycount ?? 1;
          for (let offs = 0; offs < synum; offs++) {
            syels.push([cel, sel, null, oel]);
          }
        }
        const seekpos =
          me.crd.syllable_times[Math.max(0, syels.length - 1)] ?? 0;
        oel.addEventListener('click', _evt => {
          bus.dispatchEvent(new CustomEvent('seek', {detail: seekpos}));
        });
        continue;
      }
      if (!wel || lword !== word) {
        lword = word;
        wel = document.createElement('ruby');
        wel.setAttribute('class', 'dchword');
        const currword = me.crd.words[word] ?? {};
        if (currword.meaning) {
          pinchunk?.appendChild(
            mkElementTree(
              'span',
              {
                class: 'dchword',
                title: `${
                  simplified
                    ? currword.hanzi
                    : currword.tc_hanzi ?? currword.hanzi
                }${currword.hsk > 0 ? ` (HSK${currword.hsk})` : ''}\n${
                  currword.meaning ?? ''
                }`,
              },
              `${plastword ? ' ' : ''}${
                currword.pinyin?.replaceAll(' ', '') ?? ''
              }`
            )
          );
          plastword = true;
          wel.setAttribute(
            'title',
            `${currword.pinyin}${
              currword.hsk > 0 ? ` (HSK${currword.hsk})` : ''
            }\n${currword.meaning ?? ''}`
          );
        }
        sel.appendChild(wel);
      }

      const useAnno =
        firstseen || (onlyFirst !== 'both' && onlyFirst !== 'annotation');
      const useTC =
        firstseen || (onlyFirst !== 'both' && onlyFirst !== 'tonecolor');
      const yel = document.createElement('span');
      yel.setAttribute('class', 'dchsyl');
      if (
        useTC &&
        (toneColorThreshold === 0 ||
          (hsk ?? 0) === 0 ||
          hsk >= toneColorThreshold)
      ) {
        yel.classList.add(`dchtone${tone > 0 ? tone : 5}`);
      }
      yel.appendChild(document.createTextNode(simplified ? szi : tzi));
      if (sandhi && sandhiHints) {
        yel.classList.add(`dchtonechange${sandhi}`);
      }
      let rel;
      if (
        showAnnotations &&
        useAnno &&
        (annoThreshold === 0 || (hsk ?? 0) === 0 || hsk >= annoThreshold)
      ) {
        let anno;
        switch (showAnnotations) {
          case 'pinyin':
            anno = phon ?? '';
            break;
          case 'zhuyin':
            anno = PinyinConverter.convert_zhuyin(phon) ?? '(??Z)';
            break;
          case 'ipa':
            anno = PinyinConverter.convert_ipa(phon) ?? '(??I)';
            break;
          case 'tonemark':
            anno =
              tone > 0 && tone < 5 ? `${toneMarkChars[tone - 1]}\u00A0` : '';
            break;
          case 'tonenumber':
            anno = tone > 0 ? tone.toString() : '';
            break;
          case 'hsklevel':
            anno = hsk > 0 ? hsk.toString() : '+';
            break;
          case 'traditionalzi':
            anno = tzi?.concat('\u200B') ?? '';
            break;
          case 'simplifiedzi':
            anno = szi?.concat('\u200B') ?? '';
            break;
          case 'otherzi':
            anno = (tzi !== szi ? (simplified ? tzi : szi) : '') ?? '';
            break;
          default:
            anno = '';
        }
        if (anno?.length > 0) {
          rel = mkElementTree('rt', {class: `dchsyl dchtone${tone}`}, anno);
        } else {
          rel = document.createElement('rt'); // Necessary to keep annotations aligned.
        }
      }
      if (rel && annoPosLeft) {
        wel.appendChild(rel);
        rel = null;
      }
      wel.appendChild(yel);
      if (rel) {
        wel.appendChild(rel);
      }
      const seekpos = me.crd.syllable_times[Math.max(0, syels.length - 1)] ?? 0;
      yel.addEventListener('click', _evt => {
        bus.dispatchEvent(new CustomEvent('seek', {detail: seekpos}));
      });
      if (sycount !== 0) {
        syels.push([cel, sel, wel, yel]);
      }
    }
    if (sel !== null && transel) {
      sel.appendChild(transel);
      transel = null;
    }
    me.tracker = new TrackPlayback(syels, me.crd.syllable_times);
    el.appendChild(pindiv);
    el.appendChild(transdiv);
    return el;
  };
}



;// CONCATENATED MODULE: ./src/helper_core.js







function DCHState() {
  const me = this;

  this.reset = function () {
    if (me.helper) {
      me.helper.reset();
    }
    me.helper = null;
    me.audio = null;
    me.crd = null;
    me.name = null;
    me.ready = false;
    console.log('DCH: UNREADY');
  };

  function checkReady() {
    const wasReady = me.ready;
    me.ready = me.name && me.crd && me.audio;
    if (me.ready && !wasReady) {
      me.helper = new DCHelper(me.name, me.audio, me.crd);
    }
  }

  this.updateName = function (onlyUnset) {
    if (onlyUnset && me.name !== null) {
      return;
    }
    me.reset();
    if (!document.location.pathname.startsWith('/lessons/')) {
      return;
    }
    const urlParams = new URLSearchParams(document.location.search);
    const chapNum = urlParams.get('chapter');
    const chapName = document.location.pathname.split('/');
    me.name = `${chapName[chapName.length - 1]}${chapNum ? `.${chapNum}` : ''}`;
    console.log('DCH: NAME', me.name);
  };

  this.setAudio = function (audio) {
    me.audio = audio;
    checkReady();
  };

  this.setCrd = function (crd) {
    me.crd = crd;
    checkReady();
  };

  if (document.location.pathname.startsWith('/lessons/')) {
    me.updateName();
  } else {
    me.reset();
  }

  GM_registerMenuCommand('Refresh', () => {
    if (me.helper && me.crd) {
      applyStyles(configuration.cfg);
      document.getElementById('dchelper-container')?.remove();
      me.helper.update();
    } else {
      document.getElementById('dchelper-styles')?.remove();
      document.getElementById('dchelper-container')?.remove();
    }
  });
}

function DCDocState(dchst) {
  let oldNav = [document.location.pathname, document.location.search];

  function checkAudio() {
    if (dchst.name === null || dchst.audio !== null) {
      return;
    }
    const ael = document.querySelector('audio > source[type="audio/mpeg"]');
    if (ael) {
      dchst.setAudio(ael);
    }
  }

  const observer = new MutationObserver(_mutations => {
    const currNav = [document.location.pathname, document.location.search];
    const didnav = oldNav[0] !== currNav[0] || oldNav[1] !== currNav[1];
    if (didnav) {
      console.log('DCH: NAVIGATE', oldNav, currNav);
      oldNav = currNav;
    }
    dchst.updateName(!didnav);
    checkAudio();
  });

  function observe() {
    observer.disconnect();
    const body = document.querySelector('body');
    if (!body) {
      console.log('DCH: No body.');
      return;
    }
    observer.observe(body, {childList: true, subtree: true});
  }

  this.reset = function () {
    dchst.reset();
    observer.disconnect();
    window.removeEventListener('load', observe);
  };

  this.updateCRD = function (responseText) {
    dchst.setCrd(responseText);
    checkAudio();
  };

  window.addEventListener('load', observe);
}

function DCHelper(name, audio, crd) {
  const me = this;

  this.name = name;
  this.audio = audio;
  this.crd = new CRD(crd);
  this.vocab = new Vocabulary(this.crd.syls.i, this.crd.crd.words);

  const docChunk = mkElementTree('div', {
    class: 'dchcontainer',
    id: 'dchelper-container',
  });

  let tid = null;

  me.reset = function () {
    if (tid !== null) {
      clearInterval(tid);
      tid = null;
    }
    me.audio = null;
    if (me.crd) {
      me.crd = null;
    }
    me.vocab = null;
    me.name = null;
    const e = document.getElementById('dchelper-container');
    if (e) {
      e.remove();
    }
  };

  function addChunk() {
    if (me.crd === null) {
      return false;
    }
    if (document.getElementById('dchelper-container')) {
      return true;
    }
    const container = document.querySelector('div.lesson-content-container');
    if (!container) {
      console.log('DCHelper: No lesson container!');
      return false;
    }
    container.before(docChunk);
    return true;
  }

  function updateChunk() {
    if (!addChunk()) {
      return false;
    }
    docChunk.innerHTML = '';
    const addSep = () =>
      docChunk.appendChild(document.createTextNode(' \u00A0 '));

    let ael = null;
    if (me.audio.src) {
      ael = mkElementTree('audio', {id: 'dchelper-audioplayer', controls: ''}, [
        {typ: 'source', attrs: {src: me.audio.src, type: me.audio.type}},
      ]);
      ael.volume = Number((configuration.get('audioVolume') ?? '100') / 100);
      ael.playbackRate = Number(
        (configuration.get('audioSpeed') ?? '100') / 100
      );
      const efseek = evt => {
        if (me.crd === null) {
          bus.removeEventListener('seek', efseek);
          return;
        }
        ael.currentTime = evt.detail;
      };
      const efapos = evt => {
        if (me.crd === null) {
          bus.removeEventListener('audioposition', efseek);
          return;
        }
        me.crd?.tracker?.update(evt.detail);
      };
      bus.addEventListener('seek', efseek);
      bus.addEventListener('audioposition', efapos);
      {
        let prevtime = null;
        ael.addEventListener('play', _evt => {
          if (tid !== null) {
            clearInterval(tid);
          }
          tid = setInterval(() => {
            if (ael.paused) {
              clearInterval(tid);
              tid = null;
              prevtime = null;
              bus.dispatchEvent(
                new CustomEvent('audioposition', {detail: null})
              );
              return;
            }
            if (ael.currentTime !== prevtime) {
              prevtime = ael.currentTime;
              bus.dispatchEvent(
                new CustomEvent('audioposition', {detail: prevtime})
              );
            }
          }, 100);
        });
      }
    }

    if (ael !== null) {
      docChunk.appendChild(ael);
      addSep();
    }

    {
      const el = mkElementTree(
        'a',
        {href: '#0', title: 'Toggle configuration display'},
        '⚙️'
      );
      el.addEventListener('click', _evt => {
        document.getElementById('dchelper-config')?.toggleAttribute('hidden');
        return false;
      });
      docChunk.appendChild(el);
    }

    {
      addSep();
      const el = mkElementTree(
        'a',
        {href: '#0', title: 'Toggle pinyin visibility'},
        '👀'
      );
      el.addEventListener('click', _evt => {
        document
          .getElementById('dchelper-pinyintext')
          ?.toggleAttribute('hidden');
        return false;
      });
      docChunk.appendChild(el);
    }

    {
      addSep();
      const el = mkElementTree(
        'a',
        {href: '#0', title: 'Toggle translation visibility'},
        '📜'
      );
      el.addEventListener('click', _evt => {
        document
          .getElementById('dchelper-translationtext')
          ?.toggleAttribute('hidden');
        return false;
      });
      docChunk.appendChild(el);
    }

    {
      addSep();
      const el = mkElementTree(
        'a',
        {href: '#0', title: 'Copy lesson text to clipboard'},
        '💬'
      );
      el.addEventListener('click', _evt => {
        const txt =
          document.getElementById('lesson-canvas')?.textContent ?? null;
        if (!txt) {
          alert('DCHelper: Could not get text. It may not have loaded yet.');
        } else {
          GM_setClipboard(txt);
        }
        return false;
      });
      docChunk.appendChild(el);
    }

    {
      addSep();
      const el = mkElementTree(
        'a',
        {href: '#0', title: 'Toggle vocabulary visibility'},
        '📚'
      );
      el.addEventListener('click', _evt => {
        document.getElementById('dchelper-vocab')?.toggleAttribute('hidden');
        return false;
      });
      docChunk.appendChild(el);
    }

    if (me.crd !== null) {
      docChunk.appendChild(document.createElement('hr'));
      bus.dispatchEvent(
        new CustomEvent('configupdate', {detail: configuration})
      );
      let el = me.crd.makeElement();
      const ef = _evt => {
        if (me.crd === null) {
          bus.removeEventListener('configupdate', ef);
          return;
        }
        el = me.crd.makeElement(el);
      };
      bus.addEventListener('configupdate', ef);
      docChunk.appendChild(el);
    }
    document
      .getElementById('dchelper-storytext')
      ?.before(configuration.element);
    configuration.element.after(me.vocab.element(configuration));
    return true;
  }
  me.element = docChunk;

  updateChunk();
  me.update = updateChunk;
}



;// CONCATENATED MODULE: ./src/userscript.js





function initUserScript() {
  if (
    typeof window === 'undefined' ||
    window.location?.host?.toLowerCase() !== 'duchinese.net'
  ) {
    return false;
  }
  if (GM_getValue('acceptedterms') !== true) {
    const result = prompt(`
      *** DC Helper ***\n\n

      This userscript may cause the site to break in various ways, including but not limited to performance or display problems.\n
      This is an unsupported third party modification and may stop working at any time, or interfere with normal usage of the site.\n\n
      If you experience ANY issues make sure you disable this script and completely restart your browser then verify the issue persists BEFORE even considering it could be a problem with the site.\n\n
      If you accept the risks and conditions, enter "i agree". (Note that the page will reload.)
    `)
      ?.trim()
      .toLowerCase();
    if (result !== 'i agree') {
      return;
    }
    GM_setValue('acceptedterms', true);
    location.reload();
  }

  bus.addEventListener('configupdate', evt => applyStyles(evt.detail.cfg));
  set_configuration(
    new Config(
      bus,
      new UserscriptConfigStore(GM_getValue, GM_setValue, GM_deleteValue)
    )
  );
  const docstate = new DCDocState(new DCHState());

  const matchCRD =
    /^https?:\/\/static\.duchinese\.net\/[^?]+?\/[0-9a-f]+\.crd\?.*/i;
  const orig_open = unsafeWindow.XMLHttpRequest.prototype.open,
    orig_send = unsafeWindow.XMLHttpRequest.prototype.send;

  const interceptOpen = function (method, url, _async, _user, _password) {
    if (method?.toUpperCase() === 'GET' && matchCRD.test(url ?? '')) {
      this.__dch_intercept = true;
    }
    return orig_open.apply(this, arguments);
  };

  const onloadHook = function () {
    console.log('XHR:LOAD', this.status);
    if (
      this.__dch_intercept &&
      this.status === 200 &&
      this.responseText?.length > 0
    ) {
      const rt = this.responseText;
      // console.log('XHR:LOAD', this.status, rt);
      setTimeout(() => docstate.updateCRD(rt), 0);
    }
    if (this._onload) {
      return this._onload.apply(this, arguments);
    }
  };

  const interceptSend = function (_data) {
    if (this.__dch_intercept) {
      if (this.onload) {
        this._onload = this.onload;
      }
      this.onload = onloadHook;
    }
    return orig_send.apply(this, arguments);
  };

  window.XMLHttpRequest.prototype.open = interceptOpen;
  window.XMLHttpRequest.prototype.send = interceptSend;
  unsafeWindow.XMLHttpRequest.prototype.open = interceptOpen;
  unsafeWindow.XMLHttpRequest.prototype.send = interceptSend;
  return true;
}



;// CONCATENATED MODULE: ./src/index.ts

initUserScript();

/******/ })()
;
