// ==UserScript==
// @name         GreasyFork Code: Syntax Highlight by CodeMirror
// @namespace    Violentmonkey Scripts
// @grant        none
// @version      0.4.10
// @author       CY Fung
// @description  To syntax highlight GreasyFork Code by CodeMirror
// @run-at       document-start
// @inject-into  page
// @unwrap
// @license      MIT
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
//
// @downloadURL https://update.greasyfork.org/scripts/472051/GreasyFork%20Code%3A%20Syntax%20Highlight%20by%20CodeMirror.user.js
// @updateURL https://update.greasyfork.org/scripts/472051/GreasyFork%20Code%3A%20Syntax%20Highlight%20by%20CodeMirror.meta.js
// ==/UserScript==


(() => {

    const cdn = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16';
    const resoruces = {
        'codemirror.min.js': `${cdn}/lib/codemirror.min.js`,
        'javascript.min.js': `${cdn}/mode/javascript/javascript.min.js`,
        'css.min.js': `${cdn}/mode/css/css.min.js`,
        'stylus.min.js': `${cdn}/mode/stylus/stylus.min.js`,
        'active-line.min.js': `${cdn}/addon/selection/active-line.min.js`,
        'search.js': `${cdn}/addon/search/search.js`,
        'searchcursor.js': `${cdn}/addon/search/searchcursor.js`,
        'jump-to-line.js': `${cdn}/addon/search/jump-to-line.js`,
        'dialog.js': `${cdn}/addon/dialog/dialog.js`,
        'codemirror.min.css': `${cdn}/lib/codemirror.min.css`,
        'dialog.css': `${cdn}/addon/dialog/dialog.css`,
        'material.css': `${cdn}/theme/material.css`,
    }

    const doActionCSS = () => `

        .code-container{
            height:100vh;
        }
        .code-container .CodeMirror, .code-container textarea{
            height:100%;
        }
    `;


    const global_css = () => `

        html {
            line-height: 1.5;
            -webkit-text-size-adjust: 100%;
            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;
            font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
            font-feature-settings: normal;
            font-variation-settings: normal
        }

        .code-container code, .code-container kbd, .code-container pre, .code-container samp {
            font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;
            font-size: 1em
        }

        #script-content > .code-container[class] {
            width: 100%;
        }

        .code-container[class] {
            border-radius: 0;
        }

        .code-container[class] {
            border-radius: 0;
        }

        .code-container > pre:only-child{
            padding:0;
        }

        code.syntax-highlighted[class] {
            font-family: monospace;
            font-size: 13px;
            font-variant-ligatures: contextual;
            line-height: 1.15rem;
            text-shadow: none !important;
        }

        .hljs-comment[class], .hljs-quote[class] {
            font-style: inherit;
            color: #259789;
        }

        .hljs-add-marker-width .marker-fixed-width[class] {
            user-select: none !important;
            width: calc(var(--hljs-marker-width, 0em) + 16px);
            background: #f4f4f4;
            padding-right: 6px;
            margin-right: 4px;
            contain: paint style;
        }

        [dark] .hljs-add-marker-width .marker-fixed-width[class] {
            background: #242424;
            color: #b6b2b2;
        }

        .marker-fixed-width[marker-text]::before {
            content: attr(marker-text);
        }


        @keyframes cmLineNumberAppear {
            from {
                background-position-x: 3px;
            }
            to {
                background-position-x: 4px;
            }
        }

        .CodeMirror-linenumber:not(:empty){
            animation: cmLineNumberAppear 1ms linear 0s 1 normal forwards;
        }

        .CodeMirror-linenumber[marker-text]::before {
            content: attr(marker-text);
        }


    `;


    const cssForCodePage = () => /\/scripts\/\d+[^\s\/\\]*\/code(\/|$)/.test(location.href) ? `

        html:not([dkkfv]) div.code-container {
            visibility: collapse;
        }

        .code-container,
        .code-container pre:only-child,
        .code-container pre:only-child code:only-child {
            max-height: calc(100vh + 4px);
            max-width: calc(100vw + 4px);
        }
    ` : '';


    const cssAdd = () => `

        ${global_css()}

        ${cssForCodePage()}

        .code-container {
            max-width: 100%;
            display: inline-flex;
            flex-direction: column;
            overflow: auto;
            border-radius: 8px;
            max-height: 100%;
            overflow: visible;
        }
        .code-container > pre:only-child {
            max-width: 100%;
            display: inline-flex;
            flex-direction: column;
            flex-grow: 1;
            height: 0;
        }
        .code-container > pre:only-child > code:only-child {
            max-width: 100%;
            flex-grow: 1;
            height: 0;
        }
        .code-container pre code {
            padding: 0;
            font-family: Consolas;
            cursor: text;
            overflow: auto;
            box-sizing: border-box;
        }
        .code-container pre code .marker {
            display: inline-block;
            color: #636d83;
            text-align: right;
            padding-right: 20px;
            user-select: none;
            cursor: auto;
        }

        .code-container[contenteditable]{
          outline: 0 !important;
          contain: strict;
          box-sizing: border-box;
          overflow: hidden;
        }

        .code-container[contenteditable]>pre[contenteditable="false"]{
          contain: strict;
          width: initial;
          box-sizing: border-box;
          overflow: hidden;
        }

        html {
            --token-color-comment: #259789;
            --cm-dialog-background-color: #fefefe;
            --cm-linenumber-background-color: #f4f4f4;
            --cm-linenumber-text-color: #636d83;
            --cm-search-color: #ffeb3ab8;
        }

        [dark] {
            --token-color-comment:#59c6b9;
            --cm-dialog-background-color: #25262d;
            --cm-linenumber-background-color: #242424;
            --cm-linenumber-text-color: #b6b2b2;
            --cm-search-color: #6068bbb8;
        }


        .CodeMirror .cm-comment[class] {
            color: var(--token-color-comment);
        }


        html .CodeMirror .CodeMirror-linenumber[class] {
            background: var(--cm-linenumber-background-color);
            color: var(--cm-linenumber-text-color);
            padding-right: 6px;
            margin-right: 4px;
            contain: paint style;
            user-select: none !important;
        }

        html .CodeMirror[class] {
            background-color: inherit;
        }

        .CodeMirror[class] .cm-searching {
            background-color: var(--cm-search-color);
        }

        .CodeMirror[class] .CodeMirror-dialog[class] {
            background-color: var(--cm-dialog-background-color);
        }

        html .CodeMirror .CodeMirror-activeline-background[class] {
            background: inherit;
            background-color: #8fd9da17;
        }

        div.code-container .CodeMirror .CodeMirror-lines {
            padding: 0;
        }

        div.code-container .CodeMirror {
            font-family: monospace;
            font-size: 13px;
            font-variant-ligatures: contextual;
            line-height: 1.15rem;
            text-shadow: none !important;
        }


    `;

    const Promise = (async function () { })().constructor;

    const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

    const PromiseExternal = ((resolve_, reject_) => {
        const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
        return class PromiseExternal extends Promise {
            constructor(cb = h) {
                super(cb);
                if (cb === h) {
                    /** @type {(value: any) => void} */
                    this.resolve = resolve_;
                    /** @type {(reason?: any) => void} */
                    this.reject = reject_;
                }
            }
        };
    })();

    // -------- fix requestIdleCallback issue for long coding --------

    const pud = new PromiseExternal();
    if (typeof window.requestIdleCallback === 'function' && !window.requestIdleCallback842 && window.requestIdleCallback.length === 1) {
        window.requestIdleCallback842 = window.requestIdleCallback;
        window.requestIdleCallback = function (callback, ...args) {
            return (this || window).requestIdleCallback842(async function () {
                await pud.then();
                return callback.apply(this, arguments);
            }, ...args);
        }
    }

    // -------- fix requestIdleCallback issue for long coding --------

    const pScript = new PromiseExternal();
    const pElementQuery = new PromiseExternal();

    HTMLElement.prototype.getElementsByTagName331 = HTMLElement.prototype.getElementsByTagName;
    Document.prototype.getElementsByTagName331 = Document.prototype.getElementsByTagName;

    HTMLElement.prototype.getElementsByTagName = getElementsByTagName;
    Document.prototype.getElementsByTagName = getElementsByTagName;

    let byPass = true;

    const observablePromise = (proc, timeoutPromise) => {
        let promise = null;
        return {
            obtain() {
                if (!promise) {
                    promise = new Promise(resolve => {
                        let mo = null;
                        const f = () => {
                            let t = proc();
                            if (t) {
                                mo.disconnect();
                                mo.takeRecords();
                                mo = null;
                                resolve(t);
                            }
                        }
                        mo = new MutationObserver(f);
                        mo.observe(document, { subtree: true, childList: true })
                        f();
                        timeoutPromise && timeoutPromise.then(() => {
                            resolve(null)
                        });
                    });
                }
                return promise
            }
        }
    }

    const documentReady = new Promise(resolve => {
        Promise.resolve().then(() => {
            if (document.readyState !== 'loading') {
                resolve();
            } else {
                window.addEventListener("DOMContentLoaded", resolve, false);
            }
        });
    });

    documentReady.then(async () => {
        pud.resolve();
    });

    function getElementsByTagName(tag) {
        if (byPass) {
            if (tag === 'pre' || tag === 'code' || tag === 'xmp') {
                if (location.pathname.endsWith('/code')) {
                    pElementQuery.resolve();
                    return [];
                }
            }
        }
        return this.getElementsByTagName331(tag);
    }

    async function onBodyHeadReadyAsync() {
        await observablePromise(() => document.body && document.head).obtain();
    }


    // Load CSS
    function loadJS(href) {

        return new Promise(resolve => {

            const script = document.createElement('script');
            script.src = href;
            script.onload = () => {
                resolve(script);
            };
            document.head.appendChild(script);

        });

    }

    // Load CSS
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return link;
    }






    /** @param {HTMLElement} pre */
    async function prepareCodeAreaAsync(pre) {

        if (pre.isConnected === false) return;

        for (const li of pre.querySelectorAll('li')) {
            li.append(document.createTextNode('\n'));
        }

        const codeElement = document.createElement('code');
        // codeElement.classList.add('language-javascript');
        codeElement.innerHTML = pre.innerHTML;

        // Clearing the original code container and appending the new one
        // pre.classList = '';
        pre.innerHTML = '';
        // pre.appendChild(codeElement);

        // if (pre.querySelector('code')) return;
        const code = codeElement;

        const codeContainer = pre.closest('.code-container');
        if (codeContainer && codeContainer.querySelector('.code-container>pre:only-child')) {
            // avoid selection to the outside by mouse dragging
            codeContainer.setAttribute('contenteditable', '');
            codeContainer.querySelector('.code-container>pre:only-child').setAttribute('contenteditable', 'false');
        }


        // let parentNode = code.parentNode;
        // let nextNode = code.nextSibling;

        // code.remove();
        let parentNode = pre;
        let nextNode = null;
        await Promise.resolve().then();

        // preset language
        /*
        const text = codeElement.textContent;
        if(/(^|\n)\s*\/\/\s+==UserScript==\s*\n/.test(text)){
            codeElement.classList.add('language-javascript');
        }else if(/(^|\n)\s*\/\*\s+==UserStyle==\s*\n/.test(text)){
            codeElement.classList.add('language-css');
        }
        */


        let preLang = '';

        if (pre.classList.contains('lang-js')) {
            preLang = 'lang-js';
        } else if (pre.classList.contains('lang-css')) {
            preLang = 'lang-css';
        } else if (pre.classList.contains('uglyprint')){
            let m =/\/\/\s*={2,9}(\w+)={2,9}\s*[\r\n]/.exec(codeElement.textContent);
            if(m){
                m = m[1];
                if(m === 'UserScript') preLang = 'lang-js';
                if(m === 'UserStyle') preLang = 'lang-css';
            }
        }

        let className = '';
        if (preLang === 'lang-js') {
            className = 'language-javascript';
        } else if (preLang === 'lang-css') {

            const text = codeElement.textContent;
            let m = /\n@preprocessor\s+([-_a-zA-Z]{3,8})\s*\n/.exec(text);
            className = 'language-css'
            if (m) {
                const preprocessor = m[1];
                if (preprocessor === 'stylus') {
                    className = 'language-stylus';
                } else if (preprocessor === 'uso') {
                    className = 'language-stylus';
                } else if (preprocessor === 'less') {
                    className = 'language-less';
                } else if (preprocessor === 'default') {
                    className = 'language-stylus';
                } else {
                    className = 'language-stylus';
                }
            }


        }


        if (!className) return;

        let mode = '';
        if (className === 'language-javascript') mode = 'javascript';
        if (className === 'language-stylus') mode = 'stylus';
        if (className === 'language-less') mode = 'less';
        if (className === 'language-css') mode = 'css';

        if (!mode) return;



        let textarea = document.createElement('textarea');
        textarea.value = `${code.textContent}`;
        textarea.readOnly = true;
        textarea.id = 'editor651';


        // textarea.classList.add('code-container')

        textarea.style.width = '100%';
        textarea.style.height = '100vh';

        parentNode.insertBefore(textarea, nextNode);


        const editor651 = CodeMirror.fromTextArea(document.querySelector('#editor651'), {

            mode: mode,
            theme: document.documentElement.hasAttribute('dark') ? 'material' : 'default',

            readOnly: true,
            styleActiveLine: true,
            lineNumbers: true,
            extraKeys: { "Alt-F": "findPersistent" }
        });
        editor651.save();
        function refresh() {
            try {
                editor651.display.input.cm.refresh();
            } catch (e) {
            }
        }
        document.documentElement.addEventListener('cm-highlight-refresh', function () {
            setTimeout(refresh, 100);
            requestAnimationFrame(refresh);
            refresh();
        });

    }

    const documentBodyHeadReady = onBodyHeadReadyAsync();

    documentBodyHeadReady.then(async () => {

        if (!location.pathname.endsWith('/code')) {
            return;
        }

        document.head.appendChild(document.createElement('style')).textContent = `${cssAdd()}`;

        await loadJS(resoruces['codemirror.min.js']);

        await Promise.all([
            loadJS(resoruces['javascript.min.js']),
            loadJS(resoruces['css.min.js']),
            loadJS(resoruces['stylus.min.js']),
            loadJS(resoruces['active-line.min.js']),
            loadJS(resoruces['search.js']),
            loadJS(resoruces['searchcursor.js']),
            loadJS(resoruces['jump-to-line.js']),
            loadJS(resoruces['dialog.js'])
        ]);

        if (document.documentElement.hasAttribute('dark')) {

            // TBC
            loadCSS(resoruces['codemirror.min.css']);
            loadCSS(resoruces['dialog.css']);
            loadCSS(resoruces['material.css']);

        } else {

            loadCSS(resoruces['codemirror.min.css']);
            loadCSS(resoruces['dialog.css']);
        }


        pScript.resolve();




    });

    let keydownActive = false;

    documentReady.then(async () => {

        if (!location.pathname.endsWith('/code')) {
            byPass = false;
            return;
        }

        await pScript.then();

        await Promise.race([pElementQuery, delayPn(800)]);

        const targets = document.querySelectorAll('.code-container pre.lang-js, .code-container pre.lang-css, .code-container pre.uglyprint');

        if (targets.length === 0) return;

        await delayPn(40);

        document.head.appendChild(document.createElement('style')).textContent = doActionCSS();

        await delayPn(40);

        byPass = false;

        // Code highlighting
        const promises = [...targets].map(prepareCodeAreaAsync)
        await Promise.all(promises);

        await delayPn(40);
        document.documentElement.setAttribute('dkkfv', '');
        keydownActive = true;
        document.documentElement.dispatchEvent(new CustomEvent('cm-highlight-refresh'));

    });

    function selectAllWithinElement(element) {
        window.getSelection().removeAllRanges();
        let range = document.createRange();
        if (element) {
            range.selectNodeContents(element);
            window.getSelection().addRange(range);
        } else {
            console.error('Element not found with ID:', element);
        }
    }
    document.addEventListener('keydown', (e) => {
        if (keydownActive && e && e.code === 'KeyA' && e.isTrusted && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {

            const target = e.target;
            const container = target ? target.closest('div.code-container') : null;
            const code = container ? container.querySelector('code') : null;

            if (container && code) {

                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                setTimeout(() => {
                    selectAllWithinElement(code);
                }, 1)

            }

        }
    }, true);


    const cmLineNumberAppearFn = (evt) => {
        const elm = evt.target;
        if (!(elm instanceof HTMLElement)) return;

        elm.setAttribute('marker-text', elm.textContent.trim());
        elm.textContent = '';
    }

    document.addEventListener('animationstart', (evt) => {
        const animationName = evt.animationName;
        if (!animationName) return;
        if (animationName === 'cmLineNumberAppear') cmLineNumberAppearFn(evt);
    }, { capture: true, passive: true });


})();
