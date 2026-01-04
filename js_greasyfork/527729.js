// ==UserScript==
// @name         Mubu Search Sync (V8 - Purple Theme)dd
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Adjusts UI colors to match Mubu's purple theme (#5856d5), keeps V7 fixes.
// @author       YourName (Optimized by Assistant)
// @match        https://mubu.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/527729/Mubu%20Search%20Sync%20%28V8%20-%20Purple%20Theme%29dd.user.js
// @updateURL https://update.greasyfork.org/scripts/527729/Mubu%20Search%20Sync%20%28V8%20-%20Purple%20Theme%29dd.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        historySize: 64, mask: 0x3F, mutationDebounce: 250, cacheTTL: 2304, throttleTime: 110,
        selectors: { originalInput: 'input[placeholder="搜索关键词"]:not([disabled])', domObserverTarget: '#root > div', },
        observerConfig: { attributes: true, attributeFilter: ['value'], attributeOldValue: true },
        // *** CSS Updated with Purple Theme ***
        css: `
            .custom-search-container {
                position: fixed; top: 1px; left: 50%; transform: translateX(-50%); z-index: 10001;
                background: rgba(255, 255, 255, 0.98); padding: 6px; border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.15); display: flex; gap: 8px; align-items: center;
                backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
            }
            .custom-search-input {
                padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 20px;
                width: 300px; font-size: 14px; transition: all .2s ease-in-out;
                background: #f8f9fa; color: #303133; box-sizing: border-box;
            }
            /* Focus state uses Mubu purple */
            .custom-search-input:focus {
                border-color: #5856d5; /* Purple border */
                outline: 0; background: #fff;
                box-shadow: 0 0 0 1px #5856d5; /* Lighter purple glow */
            }
            .history-btn {
                padding: 6px 12px; background: #f0f2f5; border: 1px solid #dcdfe6; border-radius: 20px;
                cursor: pointer; transition: all .2s ease-in-out; font-weight: 500; color: #606266;
                flex-shrink: 0; user-select: none;
            }
            /* Hover state uses Mubu purple for text color */
            .history-btn:hover {
                background: #e9e9eb; /* Slightly darker background on hover */
                color: #5856d5; /* Purple text */
                border-color: #c0c4cc; /* Keep border subtle */
            }
            .history-btn:active {
                transform: scale(.95); background: #dcdfe6;
            }
        `
    };

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    const debounce = (fn, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), delay); }; };
    const throttle = (fn, delay) => { let l=0; return (...a) => { const n=performance.now(); if(n-l>=delay){ requestAnimationFrame(()=>fn.apply(this,a)); l=n; } }; };
    const optimizedFindSearchBox = (() => { let c=null,t=0; return ()=>{const n=performance.now();if(c&&c.isConnected&&(n-t<config.cacheTTL))return c;c=document.querySelector(config.selectors.originalInput);if(c)t=n;return c;};})();
    const historyManager = (() => {
        const buffer = new Array(config.historySize); let writePtr = 0; let count = 0; let currentIndex = -1;
        return { add: (value) => { const trimmed = String(value).trim(); if (!trimmed) return; const prevIndex = (writePtr - 1 + config.historySize) & config.mask; if (count > 0 && trimmed === buffer[prevIndex]) { currentIndex = historyManager.size() - 1; return; } buffer[writePtr] = trimmed; writePtr = (writePtr + 1) & config.mask; count = Math.min(count + 1, config.historySize); currentIndex = historyManager.size() - 1; }, get: (index) => { if (index < 0 || index >= count) return null; const actualIndex = (writePtr - count + index + config.historySize) & config.mask; return buffer[actualIndex]; }, size: () => count, getCurrentIndex: () => currentIndex, setCurrentIndex: (index) => { currentIndex = index; }, resetIndexToCurrent: () => { currentIndex = -1; } };
     })();
    const createControlPanel = () => {
        const container=document.createElement('div');container.className='custom-search-container';container.id='custom-search-sync-container';const prevBtn=document.createElement('button');prevBtn.className='history-btn';prevBtn.textContent='←';prevBtn.title='Previous Search';const nextBtn=document.createElement('button');nextBtn.className='history-btn';nextBtn.textContent='→';nextBtn.title='Next Search';const input=document.createElement('input');input.className='custom-search-input';input.type='search';input.placeholder='Filter / Search History...';input.setAttribute('autocomplete','off');container.append(prevBtn,nextBtn,input);document.body.appendChild(container);return {container,input,prevBtn,nextBtn};
     };
    let isSyncing = false; let originalInput = null; let customInput = null; let domObserver = null; let valueObserver = null; let originalInputHandler = null; let lastSyncedValue = null;
    const runSynced = (action) => { if(isSyncing)return;isSyncing=true;try{action();}finally{queueMicrotask(()=>{isSyncing=false;});} };
    const updateCustomInputAndHistory = (newValue) => { if(customInput.value!==newValue){customInput.value=newValue;}historyManager.add(newValue); };
    const syncFromOriginal = (sourceElement) => { if(!customInput||!sourceElement)return;const currentValue=sourceElement.value;if(currentValue===lastSyncedValue)return;lastSyncedValue=currentValue;runSynced(()=>{updateCustomInputAndHistory(currentValue);}); };
    const syncToOriginal = () => { if(!originalInput||!customInput)return;const currentValue=customInput.value;runSynced(()=>{if(originalInput.value!==currentValue){nativeInputValueSetter.call(originalInput,currentValue);originalInput.dispatchEvent(inputEvent);lastSyncedValue=currentValue;}historyManager.resetIndexToCurrent();}); };
    const handleOriginalInputChange = (event) => { if (isSyncing) return; syncFromOriginal(event.target); historyManager.resetIndexToCurrent(); };
    const handleCustomInputChange = () => { if(isSyncing)return;syncToOriginal(); };
    const handleValueAttributeChange = (mutationsList) => { if(isSyncing)return;for(const m of mutationsList){if(m.type==='attributes'&&m.attributeName==='value'){const t=m.target,n=t.value,o=m.oldValue;if(n!==o&&n!==lastSyncedValue){syncFromOriginal(t);break;}}} };
    const handleHistoryNavigation = throttle((direction) => { if (!originalInput || !customInput) return; const currentIdx = historyManager.getCurrentIndex(); const size = historyManager.size(); if (size === 0) return; let newIndex; if (currentIdx === -1) { if (direction === -1) { if (size > 0) { newIndex = size - 1; } else { return; } } else { return; } } else { newIndex = currentIdx + direction; newIndex = Math.max(-1, Math.min(newIndex, size - 1)); } if (newIndex === currentIdx) return; historyManager.setCurrentIndex(newIndex); runSynced(() => { let displayValue = (newIndex === -1) ? (lastSyncedValue ?? '') : (historyManager.get(newIndex) ?? ''); if (customInput.value !== displayValue) { customInput.value = displayValue; } if (originalInput.value !== displayValue) { nativeInputValueSetter.call(originalInput, displayValue); originalInput.dispatchEvent(inputEvent); lastSyncedValue = displayValue; } else { lastSyncedValue = displayValue; } }); }, config.throttleTime);
    const setupInputSync = (targetInput) => { if(!targetInput||!customInput)return;if(originalInput&&originalInput!==targetInput){if(originalInputHandler){originalInput.removeEventListener('input',originalInputHandler);}valueObserver?.disconnect();}originalInput=targetInput;lastSyncedValue=originalInput.value;runSynced(()=>{if(customInput.value!==lastSyncedValue){customInput.value=lastSyncedValue;}if(lastSyncedValue){historyManager.add(lastSyncedValue);}else{historyManager.resetIndexToCurrent();}});originalInputHandler=handleOriginalInputChange;originalInput.addEventListener('input',originalInputHandler,{passive:true});valueObserver=new MutationObserver(handleValueAttributeChange);valueObserver.observe(originalInput,config.observerConfig);customInput.removeEventListener('input',handleCustomInputChange);customInput.addEventListener('input',handleCustomInputChange,{passive:true}); };
    const cleanup = () => { domObserver?.disconnect();valueObserver?.disconnect();domObserver=null;valueObserver=null;if(originalInput&&originalInputHandler){originalInput.removeEventListener('input',originalInputHandler);}originalInput=null;originalInputHandler=null;if(customInput){customInput.removeEventListener('input',handleCustomInputChange);}customInput=null;const c=document.getElementById('custom-search-sync-container');c?.remove();lastSyncedValue=null;isSyncing=false; };
    const init = () => { if(!document.getElementById('custom-search-sync-container')){GM_addStyle(config.css);const{input,prevBtn,nextBtn}=createControlPanel();customInput=input;prevBtn.addEventListener('click',()=>handleHistoryNavigation(-1));nextBtn.addEventListener('click',()=>handleHistoryNavigation(1));}else{customInput=document.querySelector('.custom-search-input');}const findAndSetupDebounced=debounce(()=>{const n=optimizedFindSearchBox();if(n&&n!==originalInput){setupInputSync(n);}else if(!n&&originalInput){if(originalInputHandler){originalInput.removeEventListener('input',originalInputHandler);originalInputHandler=null;}valueObserver?.disconnect();originalInput=null;lastSyncedValue=null;}},config.mutationDebounce);const t=document.querySelector(config.selectors.domObserverTarget)||document.body;if(!t){console.error("Mubu Search Sync: Observer target node not found.");return;}domObserver=new MutationObserver(()=>findAndSetupDebounced());domObserver.observe(t,{childList:true,subtree:true});findAndSetupDebounced();window.addEventListener('unload',cleanup); };
    if(document.readyState==='complete'||document.readyState==='interactive'){init();}else{window.addEventListener('DOMContentLoaded',init,{once:true});}

})();