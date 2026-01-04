// ==UserScript==
// @name              Bionic Reading Neo
// @namespace         http://tampermonkey.net/
// @version           0.1.4
// @description       Bionic Reading User Script ⌘ + B
// @author            RoCry
// @match             https://*/*
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIMSURBVHgB7ZfvtcFAEMU377zvlEAHOkAFqAAdUAEqoAM6QAV0QAeogA68/W1M3ubPShbn5It7zpDE7OzNzJ3ZI7hrqBLxo0rGl8AvH+fzWbXb7VznWq2mqtWqajQaqt/vm/t3ESBCCNTrdeWLwWCg5vO5IQVWq5XTF7IQF9+PEAAEPRwOYbAgyNwEHI9HdbvdDOnJZPKfPQicTidaMWY6yF07RcZ90kdMv/n90c4mlguaaBRP/JwEptNpKgB+3W435dtqtQoREOAfrfEhAK7XayobvJEPgd1uZ3yJ5d2G1Dep/qyaP4N+e7Nmu92+NgcQrQ2E5wt5CS8CqHg4HJpvOxCq9gUxKpVKOIiyQE/v9/vYM2kle/P1eu09kMggZta5RJhniBQR2VAFRahnQX4XFDHUb3dLHgEIs7k9B5wl0P2uOp1OdE/qL5eL2mw2kQj51gTMtehgPB47JyFGB+g2jMrmJICyGZtJsBEHF8EEkGg2m+ZaDqwsAsRk8xhcJXANInuQ2DYajZ6WgDHM76y18dIcII1JJGdDEpLR2WwWe/4SATv9Ars9XaB8rLXb25sAAXq9Xup5kWmIPnSpzDCL4NIArSKnlhjPlKMlJUbeHJDDbLFYhK3rIuBjOrVhsIKDCIFDAjJvE5DNfQhIFiDiTYCFut5m4+RmRQmA5XJpYgWPhaXh+8fkS6B0An855cAlu9FutwAAAABJRU5ErkJggg==
// @exclude           /\.(js|java|c|cpp|h|py|css|less|scss|json|yaml|yml|xml)(?:\?.+)$/
// @license           MIT
// @run-at            document-end
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_registerMenuCommand
// @grant            GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/523524/Bionic%20Reading%20Neo.user.js
// @updateURL https://update.greasyfork.org/scripts/523524/Bionic%20Reading%20Neo.meta.js
// ==/UserScript==

const defaultConfig = {
    // Whether to automatically apply bionic reading when page loads
    autoBionic: false,

    // Whether to skip processing text inside <a> tags that contain URLs
    skipLinks: true,

    // The ratio of characters to bold at the start of each word (0.0 to 1.0)
    scale: 0.5,

    // Maximum number of characters to bold in any word (null for no limit)
    maxBionicLength: null,

    // Opacity of the bold text (0.0 to 1.0)
    opacity: 1,

    // Number of words to skip between processed words (0 for no skipping)
    // Higher values create a "saccade" effect, mimicking natural eye movement
    saccade: 0,

    // Whether to use special Unicode characters instead of bold text
    symbolMode: false,

    // Whether to skip processing words in the excludeWords list
    skipWords: true,
    // List of common words to skip when skipWords is true
    excludeWords: ['is','and','as','if','the','of','to','be','for','this'],

    // Minimum word length to apply bionic reading (shorter words are skipped)
    minWordLength: 3,

    // Minimum ratio of ASCII characters required to consider content as English
    // (0.0 to 1.0) - Higher values mean stricter English detection
    minAsciiRatio: 0.9,
    // Number of characters to analyze for language detection
    charsToCheck: 300,

    // 400: Normal
    // 500: Medium
    // 600: Semi-bold
    // 700: Bold
    // 800: Extra bold
    // 900: Black (maximum boldness)
    fontWeight: 700,
};

let config = defaultConfig;
try {
    config = (_=>{
        const _config = GM_getValue('config');
        if(!_config) return defaultConfig;
    
        for(let key in defaultConfig){
            if(_config[key] === undefined) _config[key] = defaultConfig[key];
        }
        return _config;
    })();
    
    GM_setValue('config',config);
} catch(e) {
    console.log('Failed to read default config')
}

let isBionic = false;
let body = document.body;

const styleEl = document.createElement('style');
styleEl.textContent = `bbb{font-weight:${config.fontWeight};opacity:${config.opacity}}html[data-site="greasyfork"] a bionic{pointer-events:none}`;

document.documentElement.setAttribute('data-site',location.hostname.replace(/\.\w+$|www\./ig,''))

const excludeNodeNames = [
    'script','style','xmp',
    'input','textarea','select',
    'pre','code',
    'h1','h2',
    'b','strong',
    'svg','embed',
    'img','audio','video',
    'canvas',
    // Additional input-related elements
    'contenteditable','[contenteditable]','[role="textbox"]',
    'form','button','option',
    'search','tel','url','email','password','number','date','time','datetime-local',
    'month','week','color','file','range'
];

const excludeClasses = [
    'highlight',
    'katex',
    'editor',
]

const excludeClassesRegexi = new RegExp(excludeClasses.join('|'),'i');
const linkRegex = /^https?:\/\//;

function isEnglishContent() {
    try {
        const title = document.title || '';
        const firstParagraphs = Array.from(document.getElementsByTagName('p'))
            .slice(0, 3)
            .map(p => p.textContent)
            .join(' ');
        
        const textToAnalyze = (title + ' ' + firstParagraphs)
            .slice(0, config.charsToCheck)
            .replace(/\s+/g, ' ')
            .trim();

        if (!textToAnalyze) return true;

        const asciiChars = textToAnalyze.replace(/[\s\.,\-_'"!?()]/g, '')
            .split('')
            .filter(char => char.charCodeAt(0) <= 127).length;
        
        const totalChars = textToAnalyze.replace(/[\s\.,\-_'"!?()]/g, '').length;
        
        if (totalChars === 0) return true;
        
        const asciiRatio = asciiChars / totalChars;
        console.log('🈂️ ASCII Ratio:', asciiRatio.toFixed(2));
        
        return asciiRatio >= config.minAsciiRatio;
    } catch (e) {
        console.error('Error checking content language:', e);
        return true;
    }
}

const gather = el=>{
    let textEls = [];
    el.childNodes.forEach(el=>{
        if(el.isEnB) return;
        if(el.originEl) return;

        if(el.nodeType === 3){
            textEls.push(el);
        }else if(el.childNodes){
            const nodeName = el.nodeName.toLowerCase();
            if(excludeNodeNames.includes(nodeName)) return;
            if(config.skipLinks){
                if(nodeName === 'a'){
                    if(linkRegex.test(el.textContent)) return;
                }
            }
            if(el.getAttribute){
                if(el.getAttribute('class') && excludeClassesRegexi.test(el.getAttribute('class'))) return;
                if(el.getAttribute('contentEditable') === 'true') return;
            }

            textEls = textEls.concat(gather(el))
        }
    })
    return textEls;
};

const engRegex  = /[a-zA-Z][a-z]+/;
const engRegexg = new RegExp(engRegex,'g');

const getHalfLength = word=>{
    if (word.length < config.minWordLength) return 0;

    let halfLength;
    if(/ing$/.test(word)){
        halfLength = word.length - 3;
    }else if(word.length<5){
        halfLength = Math.floor(word.length * config.scale);
    }else{
        halfLength = Math.ceil(word.length * config.scale);
    }

    if(config.maxBionicLength){
        halfLength = Math.min(halfLength, config.maxBionicLength)
    }
    return halfLength;
}

let count = 0;
const saccadeRound = config.saccade + 1;
const saccadeCounter = _=>{
    return ++count % saccadeRound === 0;
};

const replaceTextByEl = el=>{
    const text = el.data;
    if(!engRegex.test(text))return;

    if(!el.replaceEl){
        const spanEl = document.createElement('bionic');
        spanEl.isEnB = true;
        spanEl.innerHTML = text.replace(/[\u00A0-\u9999<>\&]/g, w=>'&#'+w.charCodeAt(0)+';')
            .replace(engRegexg,word=>{
                if(word.length < config.minWordLength) return word;
                if(config.skipWords && config.excludeWords.includes(word)) return word;
                if(config.saccade && !saccadeCounter()) return word;

                const halfLength = getHalfLength(word);
                if (halfLength === 0) return word;
                return '<bbb>'+word.substr(0,halfLength)+'</bbb>'+word.substr(halfLength);
            });
        spanEl.originEl = el;
        el.replaceEl = spanEl;
    }

    el.after(el.replaceEl);
    el.remove();
};

const replaceTextSymbolModeByEl = el=>{
    const text = el.data;
    if(!engRegex.test(text))return;

    // For symbol mode, we can still use textContent since we're not creating HTML
    el.data = text.replace(engRegexg,word=>{
        if(word.length < config.minWordLength) return word;
        if(config.skipWords && config.excludeWords.includes(word)) return word;
        if(config.saccade && !saccadeCounter()) return word;

        const halfLength = getHalfLength(word);
        if (halfLength === 0) return word;
        const a = word.substr(0,halfLength).
            replace(/[a-z]/g,w=>String.fromCharCode(55349,w.charCodeAt(0)+56717)).
            replace(/[A-Z]/g,w=>String.fromCharCode(55349,w.charCodeAt(0)+56723));
        const b = word.substr(halfLength).
            replace(/[a-z]/g,w=> String.fromCharCode(55349,w.charCodeAt(0)+56665)).
            replace(/[A-Z]/g,w=> String.fromCharCode(55349,w.charCodeAt(0)+56671));
        return a + b;
    })
}

const bionic = (checkIsEnglish = true) => {
    if (checkIsEnglish && !isEnglishContent()) {
        console.log('🈂️ Non-English content detected, skipping bionic reading');
        return;
    }

    const textEls = gather(body);
    isBionic = true;
    count = 0;

    let replaceFunc = config.symbolMode ? replaceTextSymbolModeByEl : replaceTextByEl;
    textEls.forEach(replaceFunc);
    document.head.appendChild(styleEl);
}

const lazy = (func,ms = 15)=> {
    return _=>{
        clearTimeout(func.T)
        func.T = setTimeout(func,ms)
    }
};

const listenerFunc = lazy(_=>{
    if(!isBionic) return;
    // Don't recheck language for updates when bionic is already enabled
    bionic(false);
});

if(window.MutationObserver){
    (new MutationObserver(listenerFunc)).observe(body,{
        childList: true,
        subtree: true,
        attributes: true,
    });
}else{
    const {open,send} = XMLHttpRequest.prototype;
    XMLHttpRequest.prototype.open = function(){
        this.addEventListener('load',listenerFunc);
        return open.apply(this,arguments);
    };
    document.addEventListener('DOMContentLoaded',listenerFunc);
    document.addEventListener('DOMNodeInserted',listenerFunc);
}

if(config.autoBionic){
    window.addEventListener('load', () => bionic(true));
}

const revoke = _=>{
    const els = [...document.querySelectorAll('bionic')];
    els.forEach(el=>{
        const {originEl} = el;
        if(!originEl) return;
        el.after(originEl);
        el.remove();
    })
    isBionic = false;
};

document.addEventListener('keydown',e=>{
    const { ctrlKey , metaKey, key } = e;
    if( ctrlKey || metaKey ){
        if(key === 'b'){
            if(isBionic){
                revoke();
                // Save autoBionic as false when manually disabled
                config.autoBionic = false;
                GM_setValue('config', config);
            }else{
                bionic(false);
                // Save autoBionic as true when manually enabled
                config.autoBionic = true;
                GM_setValue('config', config);
            }
        }
    }
})

GM_addStyle(`
    .bionic-config-dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        z-index: 999999;
        max-width: 500px;
        width: 90%;
    }
    .bionic-config-dialog label {
        display: block;
        margin: 10px 0;
    }
    .bionic-config-dialog input[type="number"] {
        width: 60px;
    }
`);

function showConfigDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'bionic-config-dialog';
    dialog.innerHTML = `
        <h3>Bionic Reading Settings</h3>
        <label>
            <input type="checkbox" id="autoBionic" ${config.autoBionic ? 'checked' : ''}>
            Auto-enable on page load
        </label>
        <label>
            <input type="checkbox" id="skipLinks" ${config.skipLinks ? 'checked' : ''}>
            Skip URL links
        </label>
        <label>
            Bold ratio (0.0-1.0):
            <input type="number" id="scale" min="0" max="1" step="0.1" value="${config.scale}">
        </label>
        <label>
            Bold opacity (0.0-1.0):
            <input type="number" id="opacity" min="0" max="1" step="0.1" value="${config.opacity}">
        </label>
        <label>
            Minimum word length:
            <input type="number" id="minWordLength" min="1" max="10" value="${config.minWordLength}">
        </label>
        <label>
            <input type="checkbox" id="symbolMode" ${config.symbolMode ? 'checked' : ''}>
            Use symbols instead of bold
        </label>
        <label>
            Font Weight (400-900):
            <input type="number" id="fontWeight" min="400" max="900" step="100" value="${config.fontWeight}">
        </label>
        <div>
            <button id="closeBtn">Close</button>
            <button id="saveBtn">Save</button>
        </div>
    `;
    
    // Add event listeners after creating the dialog
    dialog.querySelector('#closeBtn').addEventListener('click', () => dialog.remove());
    dialog.querySelector('#saveBtn').addEventListener('click', () => {
        const newConfig = {
            ...config,
            autoBionic: dialog.querySelector('#autoBionic').checked,
            skipLinks: dialog.querySelector('#skipLinks').checked,
            scale: parseFloat(dialog.querySelector('#scale').value),
            opacity: parseFloat(dialog.querySelector('#opacity').value),
            minWordLength: parseInt(dialog.querySelector('#minWordLength').value),
            symbolMode: dialog.querySelector('#symbolMode').checked,
            fontWeight: parseInt(dialog.querySelector('#fontWeight').value),
        };
        
        config = newConfig;
        GM_setValue('config', config);
        
        // Update style with new font weight
        styleEl.textContent = `bbb{font-weight:${config.fontWeight};opacity:${config.opacity}}html[data-site="greasyfork"] a bionic{pointer-events:none}`;
        
        if (isBionic) {
            revoke();
            bionic(false);
        }
        
        dialog.remove();
    });
    
    document.body.appendChild(dialog);
}

// Register the menu command
GM_registerMenuCommand('Bionic Reading Settings', showConfigDialog);
