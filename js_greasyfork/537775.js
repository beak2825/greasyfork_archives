// ==UserScript==
// @name         LemmeDebug
// @namespace    http://github.com/deeeeone/userscripts
// @version      1.2
// @description  Disable anti-devtools techniques, block unwanted scripts, and bypass debugger spammers.
// @author       Custom
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537775/LemmeDebug.user.js
// @updateURL https://update.greasyfork.org/scripts/537775/LemmeDebug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////////////////////
    // 1) BLOCK USUAL ANTI DEBUG SCRIPTS
    ///////////////////////////

    const BLOCKED_DOMAINS = [
        'theajack.github.io',
    ];

    function isBlockedSrc(src) {
        try {
            const url = new URL(src, location.href);
            return BLOCKED_DOMAINS.includes(url.hostname);
        } catch (e) {
            return false;
        }
    }

    const origCreate = Document.prototype.createElement;
    Document.prototype.createElement = function(tagName, options) {
        const el = origCreate.call(this, tagName, options);
        if (tagName.toLowerCase() === 'script') {
            Object.defineProperty(el, 'src', {
                set(value) {
                    if (isBlockedSrc(value)) {
                        console.warn(`[Blocklist] Blocked script: ${value}`);
                        return;
                    }
                    HTMLScriptElement.prototype.__lookupSetter__('src').call(this, value);
                },
                get() {
                    return HTMLScriptElement.prototype.__lookupGetter__('src').call(this);
                },
                configurable: true,
                enumerable: true
            });
        }
        return el;
    };

    ['appendChild','insertBefore','replaceChild'].forEach(fnName => {
        const orig = Node.prototype[fnName];
        Node.prototype[fnName] = function(newNode, refNode) {
            if (newNode.tagName && newNode.tagName.toLowerCase() === 'script') {
                const src = newNode.src || newNode.getAttribute('src');
                if (src && isBlockedSrc(src)) {
                    console.warn(`[Blocklist] Prevented ${fnName} of blocked: ${src}`);
                    return newNode;
                }
            }
            return orig.call(this, newNode, refNode);
        };
    });

    const origFetch = window.fetch;
    window.fetch = function(input, init) {
        let url = typeof input === 'string' ? input : input.url;
        if (isBlockedSrc(url)) {
            console.warn(`[Blocklist] fetch blocked: ${url}`);
            return new Promise(() => {});
        }
        return origFetch.call(this, input, init);
    };

    const OrigOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        if (isBlockedSrc(url)) {
            console.warn(`[Blocklist] XHR blocked: ${url}`);
            return;
        }
        return OrigOpen.call(this, method, url, async, user, pass);
    };

    ///////////////////////////
    // 2) ANTI-ANTI-DEVTOOLS
    ///////////////////////////

    window.Function = new Proxy(Function, {
        apply(target, thisArg, args) {
            if (typeof args[0] === 'string') args[0] = args[0].replace(/debugger\s*;?/g, '');
            return Reflect.apply(target, thisArg, args);
        },
        construct(target, args) {
            if (typeof args[0] === 'string') args[0] = args[0].replace(/debugger\s*;?/g, '');
            return Reflect.construct(target, args);
        }
    });

    if (console && typeof console.clear === 'function') {
        console.clear = () => console.log('[Anti-Anti] console.clear() blocked');
    }

    window.addEventListener('keydown', e => {
        if ((e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) || e.key === 'F12') {
            e.stopImmediatePropagation(); e.preventDefault();
        }
    }, true);
    window.addEventListener('contextmenu', e => {
        e.stopImmediatePropagation();
    }, true);

    ['outerWidth','outerHeight'].forEach(prop => {
        Object.defineProperty(window, prop, { get: () => 1000, configurable: true });
    });

    const origAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, opts) {
        if (type === 'keydown' || type === 'contextmenu') {
            return origAdd.call(this, type, e => e.stopImmediatePropagation(), opts);
        }
        return origAdd.call(this, type, fn, opts);
    };

    ///////////////////////////
    // 3) DEBUGGER BYPASS
    ///////////////////////////

    const Originals = {
        createElement: document.createElement,
        log: console.log,
        warn: console.warn,
        table: console.table,
        clear: console.clear,
        functionConstructor: window.Function.prototype.constructor,
        setInterval: window.setInterval,
        toString: Function.prototype.toString,
        addEventListener: window.addEventListener
    };

    const cutoffs = {
        table: {amount:5, within:5000},
        clear: {amount:5, within:5000},
        redactedLog: {amount:5, within:5000},
        debugger: {amount:10, within:10000},
        debuggerThrow: {amount:10, within:10000}
    };

    function shouldLog(type) {
        const cutoff = cutoffs[type]; if (cutoff.tripped) return false;
        cutoff.current = cutoff.current||0;
        const now = Date.now(); cutoff.last = cutoff.last||now;
        if (now - cutoff.last > cutoff.within) cutoff.current=0;
        cutoff.last = now; cutoff.current++;
        if (cutoff.current > cutoff.amount) {
            Originals.warn(`Limit reached! Ignoring ${type}`);
            cutoff.tripped = true; return false;
        }
        return true;
    }

    function wrapFn(newFn, old) {
        return new Proxy(newFn, { get(target, prop) {
            return ['apply','bind','call'].includes(prop) ? target[prop] : old[prop];
        }});
    }

    window.console.log = wrapFn((...args) => {
        let redactedCount=0;
        const newArgs = args.map(a => {
            if (typeof a==='function'){redactedCount++;return 'Redacted Function';}
            if (typeof a!=='object'||a===null) return a;
            const props = Object.getOwnPropertyDescriptors(a);
            for(const name in props){
                if(props[name].get){redactedCount++;return 'Redacted Getter';}
                if(name==='toString'){redactedCount++;return 'Redacted Str';}
            }
            if (Array.isArray(a)&&a.length===50&&typeof a[0]==='object'){redactedCount++;return 'Redacted LargeObjArray';}
            return a;
        });
        if (redactedCount>=Math.max(args.length-1,1)&&!shouldLog('redactedLog')) return;
        return Originals.log.apply(console,newArgs);
    }, Originals.log);

    window.console.table = wrapFn(obj=>{
        if(shouldLog('table')) Originals.warn('Redacted table');
    }, Originals.table);

    window.console.clear = wrapFn(()=>{
        if(shouldLog('clear')) Originals.warn('Prevented clear');
    }, Originals.clear);

    let debugCount=0;
    window.Function.prototype.constructor = wrapFn((...args)=>{
        const originalFn = Originals.functionConstructor.apply(this,args);
        const content = args[0]||'';
        if(content.includes('debugger')){
            if(shouldLog('debugger')) Originals.warn('Prevented debugger');
            debugCount++;
            if(debugCount>100){
                if(shouldLog('debuggerThrow')) Originals.warn('Debugger loop! Throwing');
                throw new Error('Execution halted');
            } else {
                setTimeout(()=>debugCount--,1);
            }
            const newArgs=[content.replaceAll('debugger',''), ...args.slice(1)];
            return new Proxy(Originals.functionConstructor.apply(this,newArgs),{
                get(target,prop){ return prop==='toString'?originalFn.toString:target[prop]; }
            });
        }
        return originalFn;
    }, Originals.functionConstructor);

    // keep console preserved inside iframes
    document.createElement = wrapFn((el,o)=>{
        const element = Originals.createElement.call(document,el,o);
        if(el.toLowerCase()==='iframe'){
            element.addEventListener('load',()=>{
                try{ element.contentWindow.console = window.console; }catch{};
            });
        }
        return element;
    }, Originals.createElement);

})();
