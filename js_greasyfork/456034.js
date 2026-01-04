// ==UserScript==
// @name               Basic Functions (For userscripts)
// @name:zh-CN         常用函数（用户脚本）
// @name:en            Basic Functions (For userscripts)
// @namespace          PY-DNG Userscripts
// @version            1.12.1
// @description        Useful functions for myself
// @description:zh-CN  自用函数
// @description:en     Useful functions for myself
// @author             PY-DNG
// @license            GPL-3.0-or-later
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// Note: version 0.8.2.1 is modified just the license and it's not uploaded to GF yet 23-11-26 15:03
// Note: version 0.8.3.1 is added just the description of parseArgs and has not uploaded to GF yet 24-02-03 18:55

let [
    // Console & Debug
    LogLevel, DoLog, Err, Assert,

    // DOM
    $, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent,

    // Data
    copyProp, copyProps, parseArgs, escJsStr, replaceText,

    // Environment & Browser
    getUrlArgv, dl_browser, dl_GM,

    // Logic & Task
    AsyncManager, queueTask, FunctionLoader, loadFuncs, require, isLoaded, default_pool
] = (function() {
    const [LogLevel, DoLog] = (function() {
        /**
         * level defination for DoLog function, bigger ones has higher possibility to be printed in console
         * @typedef {Object} LogLevel
         * @property {0} None - 0
         * @property {1} Error - 1
         * @property {2} Success - 2
         * @property {3} Warning - 3
         * @property {4} Info - 4
         */
        /** @type {LogLevel} */
        const LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        };

        return [LogLevel, DoLog];

        /**
         * @overload
         * @param {String} content - log content
         */
        /**
         * @overload
         * @param {Number} level - level specified in LogLevel object
         * @param {String} content - log content
         */
        /**
         * Logger with level and logger function specification
         * @overload
         * @param {Number} level - level specified in LogLevel object
         * @param {String} content - log content
         * @param {String} logger - which log function to use (in window.console[logger])
         */
        function DoLog() {
            // Get window
            const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

            const LogLevelMap = {};
            LogLevelMap[LogLevel.None] = {
                prefix: '',
                color: 'color:#ffffff'
            }
            LogLevelMap[LogLevel.Error] = {
                prefix: '[Error]',
                color: 'color:#ff0000'
            }
            LogLevelMap[LogLevel.Success] = {
                prefix: '[Success]',
                color: 'color:#00aa00'
            }
            LogLevelMap[LogLevel.Warning] = {
                prefix: '[Warning]',
                color: 'color:#ffa500'
            }
            LogLevelMap[LogLevel.Info] = {
                prefix: '[Info]',
                color: 'color:#888888'
            }
            LogLevelMap[LogLevel.Elements] = {
                prefix: '[Elements]',
                color: 'color:#000000'
            }

            // Current log level
            DoLog.logLevel = (win.isPY_DNG && win.userscriptDebugging) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

            // Log counter
            DoLog.logCount === undefined && (DoLog.logCount = 0);

            // Get args
            let [level, logContent, logger] = parseArgs([...arguments], [
                [2],
                [1,2],
                [1,2,3]
            ], [LogLevel.Info, 'DoLog initialized.', 'log']);

            let msg = '%c' + LogLevelMap[level].prefix + (typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + (LogLevelMap[level].prefix ? ' ' : '');
            let subst = LogLevelMap[level].color;

            switch (typeof(logContent)) {
                case 'string':
                    msg += '%s';
                    break;
                case 'number':
                    msg += '%d';
                    break;
                default:
                    msg += '%o';
                    break;
            }

            // Log when log level permits
            if (level <= DoLog.logLevel) {
                // Log to console when log level permits
                if (level <= DoLog.logLevel) {
                    if (++DoLog.logCount > 512) {
                        console.clear();
                        DoLog.logCount = 0;
                    }
                    console[logger](msg, subst, logContent);
                }
            }
        }
    }) ();

    /**
     * Throw an error
     * @param {String} msg - the error message
     * @param {typeof Error} [ErrorConstructor=Error] - which error constructor to use, defaulting to Error()
     */
    function Err(msg, ErrorConstructor=Error) {
        throw new ErrorConstructor((typeof GM_info === 'object' ? `[${GM_info.script.name}]` : '') + msg);
    }

    /**
     * Assert given condition is true-like, otherwise throws given error
     * @param {*} condition 
     * @param {string} errmsg 
     * @param {typeof Error} [ErrorConstructor=Error] 
     */
    function Assert(condition, errmsg, ErrorConstructor=Error) {
        condition || Err(errmsg, ErrorConstructor);
    }

    /**
     * Convenient function to querySelector
     * @overload
     * @param {Element|Document|DocumentFragment} [root] - which target to call querySelector on
     * @param {string} selector - querySelector selector
     * @returns {Element|null}
     */
    function $() {
        switch(arguments.length) {
            case 2:
                return arguments[0].querySelector(arguments[1]);
            default:
                return document.querySelector(arguments[0]);
        }
    }
    /**
     * Convenient function to querySelectorAll
     * @overload
     * @param {Element|Document|DocumentFragment} [root] - which target to call querySelectorAll on
     * @param {string} selector - querySelectorAll selector
     * @returns {NodeList}
     */
    function $All() {
        switch(arguments.length) {
            case 2:
                return arguments[0].querySelectorAll(arguments[1]);
                break;
            default:
                return document.querySelectorAll(arguments[0]);
        }
    }
    /**
     * Convenient function to querySelectorAll
     * @overload
     * @param {Document} [root] - which document to call createElement on
     * @param {string} tagName
     * @returns {HTMLElement}
     */
    function $CrE() {
        switch(arguments.length) {
            case 2:
                return arguments[0].createElement(arguments[1]);
                break;
            default:
                return document.createElement(arguments[0]);
        }
    }
    /**
     * Convenient function to addEventListener
     * @overload
     * @param {EventTarget} target - which target to call addEventListener on
     * @param {string} type
     * @param {EventListenerOrEventListenerObject | null} callback
     * @param {AddEventListenerOptions | boolean} [options]
     */
    function $AEL(...args) {
        /** @type {EventTarget} */
        const target = args.shift();
        return target.addEventListener.apply(target, args);
    }
    /**
     * @typedef {[type: string, callback: EventListenerOrEventListenerObject | null, options: AddEventListenerOptions | boolean]} $AEL_Arguments 
     */
    /**
     * @typedef {Object} $$CrE_Options
     * @property {string} tagName
     * @property {object} [props] - properties set by `element[prop] = value;`
     * @property {object} [attrs] - attributes set by `element.setAttribute(attr, value);`
     * @property {string | string[]} [classes] - class names to be set
     * @property {object} [styles] - styles set by `element[style_name] = style_value;`
     * @property {$AEL_Arguments[]} [listeners] - event listeners added by `$AEL(element, ...listener);`
     */
    /**
     * @overload
     * @param {$$CrE_Options} options
     * @returns {HTMLElement}
     */
    /**
     * Create configorated element
     * @overload
     * @param {string} tagName
     * @param {object} [props] - properties set by `element[prop] = value;`
     * @param {object} [attrs] - attributes set by `element.setAttribute(attr, value);`
     * @param {string | string[]} [classes] - class names to be set
     * @param {object} [styles] - styles set by `element[style_name] = style_value;`
     * @param {$AEL_Arguments[]} [listeners] - event listeners added by `$AEL(element, ...listener);`
     * @returns {HTMLElement}
     */
    function $$CrE() {
        const [tagName, props, attrs, classes, styles, listeners] = parseArgs([...arguments], [
            function(args, defaultValues) {
                const arg = args[0];
                return {
                    'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
                    'object': () => ['tagName', 'props', 'attrs', 'classes', 'styles', 'listeners'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
                }[typeof arg]();
            },
            [1,2],
            [1,2,3],
            [1,2,3,4],
            [1,2,3,4,5]
        ], ['div', {}, {}, [], {}, []]);
        const elm = $CrE(tagName);
        for (const [name, val] of Object.entries(props)) {
            elm[name] = val;
        }
        for (const [name, val] of Object.entries(attrs)) {
            elm.setAttribute(name, val);
        }
        for (const cls of Array.isArray(classes) ? classes : [classes]) {
            elm.classList.add(cls);
        }
        for (const [name, val] of Object.entries(styles)) {
            elm.style[name] = val;
        }
        for (const listener of listeners) {
            $AEL(elm, ...listener);
        }
        return elm;
    }

    /**
     * @overload
     * @param {string} css - css content
     * @returns {HTMLStyleElement}
     */
    /**
     * @overload
     * @param {string} css - css content
     * @param {string} id - `id` attribute for <style> element
     * @returns {HTMLStyleElement}
     */
    /**
     * Append a style text to document(<head>) with a <style> element \
     * removes existing <style> elements with same id if id provided, so style updates can be done by using one same id
     * 
     * Uses `GM_addElement` if `GM_addElement` exists and param `id` not specified. (`GM_addElement` uses id attribute, so specifing id manually when using `GM_addElement` takes no effect) \
     * In another case `GM_addStyle` instead of `GM_addElement` exists, and both `id` and `parentElement` not specified, `GM_addStyle` will be used. \
     * `document.createElement('style')` will be used otherwise.
     * @overload
     * @param {HTMLElement} parentElement - parent element to place <style> element
     * @param {string} css - css content
     * @param {string} id - `id` attribute for <style> element
     * @returns {HTMLStyleElement}
     */
    function addStyle() {
        // Get arguments
        const [parentElement, css, id] = parseArgs([...arguments], [
            [2],
            [2,3],
            [1,2,3]
        ], [null, '', null]);

        if (typeof GM_addElement === 'function' && id === null) {
            return GM_addElement(parentElement, 'style', { textContent: css });
        } else if (typeof GM_addStyle === 'function' && parentElement === null && id === null) {
            return GM_addStyle(css);
        } else {
            // Make <style>
            const style = $CrE('style');
            style.innerHTML = css;
            id !== null && (style.id = id);
            id !== null && Array.from($All(parentElement ?? document, `style#${id}`)).forEach(elm => elm.remove());

            // Append to parentElement
            (parentElement ?? document.head).appendChild(style);
            return style;
        }
    }

    /**
     * @typedef {Object} detectDom_options
     * @property {Node} root - root target to observe on
     * @property {string | string[]} [selector] - selector(s) to observe for, be aware that in options object it is named selector, but is named selectors in param
     * @property {boolean} [attributes] - whether to observe existing elements' attribute changes
     * @property {function} [callback] - if provided, use callback instead of Promise when selector element found
     */
    /**
     * @overload
     * @param {string | string[]} selector - selector(s) to observe for, be aware that in options object it is named selector, but is named selectors in param
     * @returns {Promise<HTMLElement>}
     */
    /**
     * @overload
     * @param {detectDom_options} options
     * @returns {MutationObserver}
     */
    /**
     * Get callback / resolve promise when specific dom/element appearce in document \
     * uses MutationObserver for implementation \
     * This behavior is different from versions that equals to or older than 0.8.4.2, so be careful when using it.
     * @overload
     * @param {Node} root - root target to observe on
     * @param {string | string[]} [selectors] - selector(s) to observe for
     * @param {boolean} [attributes] - whether to observe existing elements' attribute changes
     * @param {function} [callback] - if provided, use callback instead of Promise when selector element found
     * @returns {MutationObserver}
     */
    function detectDom() {
        let [selectors, root, attributes, callback] = parseArgs([...arguments], [
            function(args, defaultValues) {
                const arg = args[0];
                return {
                    'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
                    'object': () => ['selector', 'root', 'attributes', 'callback'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
                }[typeof arg]();
            },
            [2,1],
            [2,1,3],
            [2,1,3,4],
        ], [[''], document, false, null]);
        !Array.isArray(selectors) && (selectors = [selectors]);

        if (select(root, selectors)) {
            for (const elm of selectAll(root, selectors)) {
                if (callback) {
                    setTimeout(callback.bind(null, elm));
                } else {
                    return Promise.resolve(elm);
                }
            }
        }

        const observer = new MutationObserver(mCallback);
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes,
        });

        let isPromise = !callback;
        return callback ? observer : new Promise((resolve, reject) => callback = resolve);

        function mCallback(mutationList, observer) {
            const addedNodes = mutationList.reduce((an, mutation) => {
                switch (mutation.type) {
                    case 'childList':
                        an.push(...mutation.addedNodes);
                        break;
                    case 'attributes':
                        an.push(mutation.target);
                        break;
                }
                return an;
            }, []);
            const addedSelectorNodes = addedNodes.reduce((nodes, anode) => {
                if (anode.matches && match(anode, selectors)) {
                    nodes.add(anode);
                }
                const childMatches = anode.querySelectorAll ? selectAll(anode, selectors) : [];
                for (const cm of childMatches) {
                    nodes.add(cm);
                }
                return nodes;
            }, new Set());
            for (const node of addedSelectorNodes) {
                callback(node);
                isPromise && observer.disconnect();
            }
        }

        function selectAll(elm, selectors) {
            !Array.isArray(selectors) && (selectors = [selectors]);
            return selectors.map(selector => [...$All(elm, selector)]).reduce((all, arr) => {
                all.push(...arr);
                return all;
            }, []);
        }

        function select(elm, selectors) {
            const all = selectAll(elm, selectors);
            return all.length ? all[0] : null;
        }

        function match(elm, selectors) {
            return !!elm.matches && selectors.some(selector => elm.matches(selector));
        }
    }

    /**
     * Just stopPropagation and preventDefault
     * @param {Event} e
     */
    function destroyEvent(e) {
        if (!e) {return false;};
        if (!e instanceof Event) {return false;};
        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * copy property value from obj1 to obj2 if exists
     * @param {object} obj1
     * @param {object} obj2
     * @param {string|Symbol} prop
     */
    function copyProp(obj1, obj2, prop) {obj1.hasOwnProperty(prop) && (obj2[prop] = obj1[prop]);}
    /**
     * copy property values from obj1 to obj2 if exists
     * @param {object} obj1 
     * @param {object} obj2 
     * @param {string|Symbol} [props] - properties to copy, copy all enumerable properties if not specified
     */
    function copyProps(obj1, obj2, props) {(props ?? Object.keys(obj1)).forEach((prop) => (copyProp(obj1, obj2, prop)));}

    /**
     * Argument parser with sorting and defaultValue support \
     * See use cases in other functions
     * @param {Array} args - original arguments' value to be parsed 
     * @param {(number[]|function)[]} rules - rules to sort arguments or custom function to parse arguments
     * @param {Array} defaultValues - default values for arguments not provided a value
     * @returns {Array}
     */
    function parseArgs(args, rules, defaultValues=[]) {
        // args and rules should be array, but not just iterable (string is also iterable)
        if (!Array.isArray(args) || !Array.isArray(rules)) {
            throw new TypeError('parseArgs: args and rules should be array')
        }

        // fill rules[0]
        (!Array.isArray(rules[0]) || rules[0].length === 1) && rules.splice(0, 0, []);

        // max arguments length
        const count = rules.length - 1;

        // args.length must <= count
        if (args.length > count) {
            throw new TypeError(`parseArgs: args has more elements(${args.length}) longer than ruless'(${count})`);
        }

        // rules[i].length should be === i if rules[i] is an array, otherwise it should be a function
        for (let i = 1; i <= count; i++) {
            const rule = rules[i];
            if (Array.isArray(rule)) {
                if (rule.length !== i) {
                    throw new TypeError(`parseArgs: rules[${i}](${rule}) should have ${i} numbers, but given ${rules[i].length}`);
                }
                if (!rule.every((num) => (typeof num === 'number' && num <= count))) {
                    throw new TypeError(`parseArgs: rules[${i}](${rule}) should contain numbers smaller than count(${count}) only`);
                }
            } else if (typeof rule !== 'function') {
                throw new TypeError(`parseArgs: rules[${i}](${rule}) should be an array or a function.`)
            }
        }

        // Parse
        const rule = rules[args.length];
        let parsed;
        if (Array.isArray(rule)) {
            parsed = [...defaultValues];
            for (let i = 0; i < rule.length; i++) {
                parsed[rule[i]-1] = args[i];
            }
        } else {
            parsed = rule(args, defaultValues);
        }
        return parsed;
    }

    /**
     * escape str into javascript written format
     * @param {string} str
     * @param {string} [quote] 
     * @returns 
     */
    function escJsStr(str, quote='"') {
        str = str.replaceAll('\\', '\\\\').replaceAll(quote, '\\' + quote).replaceAll('\t', '\\t');
        str = quote === '`' ? str.replaceAll(/(\$\{[^\}]*\})/g, '\\$1') : str.replaceAll('\r', '\\r').replaceAll('\n', '\\n');
        return quote + str + quote;
    }
    
    /**
     * Replace given text with no mismatching of replacing replaced text
     * 
     * e.g. replaceText('aaaabbbbccccdddd', {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e'}) === 'bbbbccccddddeeee' \
     *      replaceText('abcdAABBAA', {'BB': 'AA', 'AAAAAA': 'This is a trap!'}) === 'abcdAAAAAA' \
     *      replaceText('abcd{AAAA}BB}', {'{AAAA}': '{BB', '{BBBB}': 'This is a trap!'}) === 'abcd{BBBB}' \
     *      replaceText('abcd', {}) === 'abcd'
     * 
     * **Note**: \
     *  replaceText will replace in sort of replacer's iterating sort \
     *  e.g. currently replaceText('abcdAABBAA', {'BBAA': 'TEXT', 'AABB': 'TEXT'}) === 'abcdAATEXT' \
     *  but remember: (As MDN Web Doc said,) Although the keys of an ordinary Object are ordered now, this was \
     *  not always the case, and the order is complex. As a result, it's best not to rely on property order. \
     *  So, don't expect replaceText will treat replacer key-values in any specific sort. Use replaceText to \
     *  replace irrelevance replacer keys only.
     * @param {string} text 
     * @param {object} replacer 
     * @returns {string}
     */
    function replaceText(text, replacer) {
        if (Object.entries(replacer).length === 0) {return text;}
        const [models, targets] = Object.entries(replacer);
        const len = models.length;
        let text_arr = [{text: text, replacable: true}];
        for (const [model, target] of Object.entries(replacer)) {
            text_arr = replace(text_arr, model, target);
        }
        return text_arr.map((text_obj) => (text_obj.text)).join('');

        function replace(text_arr, model, target) {
            const result_arr = [];
            for (const text_obj of text_arr) {
                if (text_obj.replacable) {
                    const splited = text_obj.text.split(model);
                    for (const part of splited) {
                        result_arr.push({text: part, replacable: true});
                        result_arr.push({text: target, replacable: false});
                    }
                    result_arr.pop();
                } else {
                    result_arr.push(text_obj);
                }
            }
            return result_arr;
        }
    }

    /**
     * @typedef {Object} getUrlArgv_options
     * @property {string} name
     * @property {string} [url]
     * @property {string} [defaultValue]
     * @property {function} [dealFunc] - function that inputs original getUrlArgv result and outputs final return value
     */
    /**
     * @overload
     * @param {Object} getUrlArgv_options
     * @returns 
     */
    /**
     * Get a url argument from location.href
     * @param {string} name
     * @param {string} [url]
     * @param {string} [defaultValue]
     * @param {function} [dealFunc] - function that inputs original getUrlArgv result and outputs final return value
     */
    function getUrlArgv() {
        const [name, url, defaultValue, dealFunc] = parseArgs([...arguments], [
            function(args, defaultValues) {
                const arg = args[0];
                return {
                    'string': () => [arg, ...defaultValues.filter((arg, i) => i > 0)],
                    'object': () => ['name', 'url', 'defaultValue', 'dealFunc'].map((prop, i) => arg.hasOwnProperty(prop) ? arg[prop] : defaultValues[i])
                }[typeof arg]();
            },
            [2,1],
            [2,1,3],
            [2,1,3,4]
        ], [null, location.href, null, a => a]);

        if (name === null) { return null; }

        const search = new URL(url).search;
        const objSearch = new URLSearchParams(search);
        const raw = objSearch.has(name) ? objSearch.get(name) : defaultValue;
        const argv = dealFunc(raw);

        return argv;
    }

    /**
     * download file from given url by simulating <a download="..." href=""></a> clicks \
     * a common use case is to download Blob objects as file from `URL.createObjectURL`
     * @param {string} url 
     * @param {string} filename 
     */
    function dl_browser(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    /**
     * File download function \
     * details looks like the detail of GM_xmlhttpRequest \
     * onload function will be called after file saved to disk
     * @param {object} details
     */
    function dl_GM(details) {
        if (!details.url || !details.name) {return false;};

        // Configure request object
        const requestObj = {
            url: details.url,
            responseType: 'blob',
            onload: function(e) {
                // Save file
                dl_browser(URL.createObjectURL(e.response), details.name);

                // onload callback
                details.onload ? details.onload(e) : function() {};
            }
        }
        if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
        if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
        if (details.onerror           ) {requestObj.onerror            = details.onerror;};
        if (details.onabort           ) {requestObj.onabort            = details.onabort;};
        if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
        if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

        // Send request
        Assert(typeof GM_xmlhttpRequest === 'function', 'GM_xmlhttpRequest should be provided in order to use dl_GM', TypeError);
        GM_xmlhttpRequest(requestObj);
    }

    /**
     * Manager to manager async tasks \
     * This was written when I haven't learnt Promise, so for fluent promise users, just ignore it:)
     * 
     * # Usage
     * ```javascript
     * // This simulates a async task, it can be a XMLHttpRequest, some file reading, or so on...
     * function someAsyncTask(callback, duration) {
     *     const result = Math.random(); 
     *     setTimeout(() => callback(result), duration);
     * }
     * 
     * // Do 10 async tasks, and log all results when all async tasks finished
     * const AM = new AsyncManager();
     * const results = [];
     * AM.onfinish = function() {
     *     console.log('All tasks finished!');
     *     console.log(results);
     * }
     * 
     * for (let i = 0; i < 10; i++) {
     *     AM.add();
     *     const duration = (Math.random() * 5 + 5) * 1000;
     *     const index = i;
     *     someAsyncTask(result => {
     *         console.log(`Task ${index} finished after ${duration}ms!`);
     *         results[index] = result;
     *     }, duration);
     *     console.log(`Task ${index} started!`);
     * }
     * 
     * // Set AM.finishEvent to true after all tasks added, allowing AsyncManager to call onfinish callback 
     * ```
     * @constructor
     */
    function AsyncManager() {
        const AM = this;

        // Ongoing tasks count
        this.taskCount = 0;

        // Whether generate finish events
        let finishEvent = false;
        Object.defineProperty(this, 'finishEvent', {
            configurable: true,
            enumerable: true,
            get: () => (finishEvent),
            set: (b) => {
                finishEvent = b;
                b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
            }
        });

        // Add one task
        this.add = () => (++AM.taskCount);

        // Finish one task
        this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
    }

    /**
     * Put tasks in specific queue and order their execution \
     * Set `queueTask[queueId].max`, `queueTask[queueId].sleep` to custom queue's max ongoing tasks and sleep time between tasks
     * @param {function} task - task function to run
     * @param {string | Symbol} queueId - identifier to specify a target queue. if provided, given task will be added into specified queue. 
     * @returns 
     */
    function queueTask(task, queueId='default') {
        init();

        return new Promise((resolve, reject) => {
            queueTask.hasOwnProperty(queueId) || (queueTask[queueId] = { tasks: [], ongoing: 0 });
            queueTask[queueId].tasks.push({task, resolve, reject});
            checkTask(queueId);
        });

        function init() {
            if (!queueTask[queueId]?.initialized) {
                queueTask[queueId] = {
                    // defaults
                    tasks: [],
                    ongoing: 0,
                    max: 3,
                    sleep: 500,

                    // user's pre-sets
                    ...(queueTask[queueId] || {}),

                    // initialized flag
                    initialized: true
                }
            };
        }

        function checkTask() {
            const queue = queueTask[queueId];
            setTimeout(() => {
                if (queue.ongoing < queue.max && queue.tasks.length) {
                    const task = queue.tasks.shift();
                    queue.ongoing++;
                    setTimeout(
                        () => task.task().then(v => {
                            queue.ongoing--;
                            task.resolve(v);
                            checkTask(queueId);
                        }).catch(e => {
                            queue.ongoing--;
                            task.reject(e);
                            checkTask(queueId);
                        }),
                        queue.sleep
                    );
                }
            });
        }
    }

    const { FunctionLoader, loadFuncs, require, isLoaded, default_pool } = (function() {
        /**
         * 一般用作函数对象oFunc的加载条件，检测当前环境是否适合/需要该oFunc加载
         * @typedef {Object} checker_func
         * @property {string} type - checker's identifier
         * @property {function} func - actual internal judgement implementation
         */
        /**
         * 一般用作函数对象oFunc的加载条件，检测当前环境是否适合/需要该oFunc加载
         * @typedef {Object} checker
         * @property {string} type - checker's identifier
         * @property {*} value - param that goes into checker function
         */
        /**
         * 需要使用的substorage名称
         * @typedef {"GM_setValue" | "GM_getValue" | "GM_listValues" | "GM_deleteValue"} substorage_value
         */
        /**
         * 可以传入params的字符串名称
         * @typedef {'oFunc' | substorage_value} param
         */
        /**
         * 被加载函数对象的func函数
         * @callback oFuncBody
         * @param {oFunc} oFunc
         * @returns {*|Promise<*>}
         */
        /**
         * 被加载执行的函数对象
         * @typedef {Object} oFunc
         * @property {string} id - 每次load（每个FuncPool实例）内唯一的标识符
         * @property {boolean} [disabled] - 为真值时，无论checkers还是detectDom等任何其他条件通过或未通过，均不执行此函数对象；默认为false
         * @property {checker[]|checker} [checkers] - oFunc执行的条件
         * @property {string[]|string} [detectDom] - 如果提供，开始checker检查前会首先等待其中所有css选择器对应的元素在document中出现
         * @property {string[]|string} [dependencies] - 如果提供，应为其他函数对象的id或者id列表；开始checker检查前会首先等待其中所有指定的函数对象加载完毕
         * @property {boolean} [readonly] - 指定该函数的返回值是否应该被Proxy保护为不可修改对象
         * @property {param[]|param} params - 可选，指定传入oFunc.func的参数列表；可以为参数本身或其组成的数组
         * 参数可以为 字符串 或是 其他类型，如果是字符串就传入对应的FunctionLoader提供的内置值（见下），如果是其他类型则按照原样传入
         * - "oFunc":
         *     函数对象本身
         * - "GM_setValue", "GM_getValue", "GM_listValues", "GM_deleteValue":
         *     和脚本管理器提供的函数一致，但是读取和写入的对象是以oFunc.id为键的子空间
         *     比如，GM_getValue("prop") 就相当于调用脚本管理器提供的的 GM_getValue(oFunc.id)["prop"]
         * @property {oFuncBody} func - 实际实现了功能的函数
         * @property {boolean} [STOP] - [调试用] 指定不执行此函数对象
         */

        const registered_checkers = {
			switch: value => value,
			url: value => location.href === value,
			path: value => location.pathname === value,
			regurl: value => !!location.href.match(value),
			regpath: value => !!location.pathname.match(value),
			starturl: value => location.href.startsWith(value),
			startpath: value => location.pathname.startsWith(value),
			func: value => value()
		};

        class FuncPool extends EventTarget {
            static #STILL_LOADING = Symbol('oFunc still loading');
            static FunctionNotFound = Symbol('Function not found');
            static FunctionNotLoaded = Symbol('Function not loaded');
            static CheckerNotPass = Symbol('Function checker does not pass');
            static ErrorWhileLoad = Symbol('Error caught when function loading');

            /** @typedef {symbol|*} return_value */
            /** @type {Map<oFunc, return_value>} */
            #oFuncs = new Map();

            #GM_funcs;

            /** @typedef {{error: Error, oFunc: oFunc}} load_error */
            /** @type {load_error[]} */
            errors;

            /** @type {boolean} */
            catch_errors;

            /**
             * {@link FuncPool} 所能处理的和脚本存储空间相关的GM_*函数
             * @typedef {Object} GM_funcs
             * @property {function} [GM_getValue]
             * @property {function} [GM_setValue]
             * @property {function} [GM_deleteValue]
             * @property {function} [GM_listValues]
             * @property {function} [GM_addValueChangeListener]
             * @property {function} [GM_removeValueChangeListener]
             */
            /**
             * 创建新函数池
             * @param {Object} [details={}] - 可选，默认为{}空对象
             * @param {GM_funcs} [details.GM_funcs] - 可选，和脚本存储空间相关的GM_*函数；如果不提供，使用上下文（通常是脚本管理器提供的运行环境）中的值
             * @param {oFunc | oFunc[]} [details.oFuncs] - 可选，需要立即加载的函数对象
             * @param {boolean} [details.catch_errors=false] - 可选，是否自动捕获错误，默认为false
             * @returns {FuncPool}
             */
            constructor({
                GM_funcs = {},
                oFuncs = [],
                catch_errors = false,
            } = {}) {
                super();
                this.#GM_funcs = Object.assign({
                    GM_getValue: typeof GM_getValue === 'function' ? GM_getValue : null,
                    GM_setValue: typeof GM_setValue === 'function' ? GM_setValue : null,
                    GM_deleteValue: typeof GM_deleteValue === 'function' ? GM_deleteValue : null,
                    GM_listValues: typeof GM_listValues === 'function' ? GM_listValues : null,
                    GM_addValueChangeListener: typeof GM_addValueChangeListener === 'function' ? GM_addValueChangeListener : null,
                    GM_removeValueChangeListener: typeof GM_removeValueChangeListener === 'function' ? GM_removeValueChangeListener : null,
                }, GM_funcs);
                this.errors = [];
                this.catch_errors = catch_errors;
                this.load(oFuncs);
            }

            /**
             * 加载提供的一个或多个函数对象，并将其加入到函数池中 \
             * 异步函数，当所有传入的函数对象都彻底load完毕/checkers确定不加载时resolve
             * @param {oFunc[] | oFunc | Record<string, Omit<oFunc, 'id'>>} [oFuncs] - 可选，需要加载的函数对象或其数组，不提供时默认为空数组
             */
            async load(oFuncs=[]) {
                // 将oFuncs标准化转换为 @type {oFunc[]} 类型
                if (Array.isArray(oFuncs)) {
                    // 格式已正确，无需转换
                } else if (Object.hasOwn(oFuncs, 'id')) {
                    // @type {oFunc} 格式
                    oFuncs = [oFuncs];
                } else {
                    // @type {Record<string, Omit<oFunc, 'id'>>} 格式
                    oFuncs = Object.entries(oFuncs).map(([id, oFunc]) => ({ id, ...oFunc }));
                }
                await Promise.all(oFuncs.map(oFunc => this.#load(oFunc)));
            }

            /**
             * 加载一个函数对象，并将其加入到函数池中 \
             * 当id重复时，直接报错RedeclarationError \
             * 异步函数，当彻底load完毕/checkers确定不加载时resolve \
             * 当加载完毕时，广播load事件；如果全部加载完毕，还广播all_load事件
             * @todo 当checker确定不加载时，广播什么事件？后续all_load是否仍然触发？
             * @param {oFunc} oFunc
             * @returns {Promise<boolean>} 本次调用是否成功执行了加载并顺利加载完毕
             */
            async #load(oFunc) {
                const that = this;

                // disabled的函数对象，不执行
                if (oFunc.disabled) {
                    return false;
                }

                // 已经在函数池中的函数对象，不重复load
                if (this.#oFuncs.has(oFunc)) {
                    return false;
                }

                // 检查有无重复id
                for (const o of this.#oFuncs.keys()) {
                    if (o.id === oFunc.id) {
                        throw new RedeclarationError(`Attempts to load oFunc with id already in use: ${oFunc.id}`);
                    }
                }

                // 设置当前返回值为STILL_LOADING
                this.#oFuncs.set(oFunc, FuncPool.#STILL_LOADING);

                // 加载依赖
                const dependencies = Array.isArray(oFunc.dependencies) ? oFunc.dependencies : ( oFunc.dependencies ? [oFunc.dependencies] : [] );
                await Promise.all(dependencies.map(id => this.require(id, true)));

                // 检测checkers加载条件
                const checkers = Array.isArray(oFunc.checkers) ? oFunc.checkers : ( oFunc.checkers ? [oFunc.checkers] : [] );
                if (!testCheckers(checkers, oFunc)) {
                    this.#oFuncs.set(oFunc, FuncPool.CheckerNotPass);
                    return false;
                }

                // 检测detectDOM中css选择器指定的元素出现
                const selectors = Array.isArray(oFunc.detectDom) ? oFunc.detectDom : ( oFunc.detectDom ? [oFunc.detectDom] : [] );
                await Promise.all(selectors.map(selector => detectDom(selector)));

                // 处理substorage
                const substorage = this.#MakeSubStorage(oFunc.id);

                // 处理函数参数
                const builtins = {
                    oFunc,
                    ...substorage
                };
                const params = oFunc.params ? (Array.isArray(oFunc.params) ? oFunc.params : [oFunc.params]) : [];
                const args = params.map(param => typeof param === 'string' ? builtins[param] : param);

                // 执行函数对象
                let raw_return_value, return_value;
                try {
                    raw_return_value = oFunc.func(...args);
                    return_value = await Promise.resolve(raw_return_value);
                } catch (error) {
                    // 当出现错误时
                    if (this.catch_errors) {
                        // 错误捕获已开启：广播错误事件，储存错误信息，设置错误状态，返回false
                        const load_error = { error, oFunc };
                        this.#broadcast('error', load_error);
                        this.errors.push(load_error);
                        this.#oFuncs.set(oFunc, FuncPool.ErrorWhileLoad);
                        return false;
                    } else {
                        // 错误捕获未开启：直接抛出错误
                        throw error;
                    }
                }

                // 设置返回值
                this.#oFuncs.set(oFunc, return_value);

                // 广播事件
                this.#broadcast('load', { oFunc, id: oFunc.id, return_value });
                Array.from(this.#oFuncs.values()).every(v => v !== FuncPool.#STILL_LOADING) &&
                    this.#broadcast('all_load');
                
                return true;
            }

            /**
             * 获取指定函数对象的返回值  
             * 如果wait=false:
             * - 如果指定的函数对象不存在，返回FuncPool.FunctionNotFound  
             * - 如果指定的函数对象存在但尚未加载，返回FuncPool.FunctionNotLoaded  
             * 
             * 如果wait=false:
             * - 如果指定的函数对象不存在，返回FuncPool.FunctionNotFound  
             * - 如果指定的函数对象存在但尚未加载，返回FuncPool.FunctionNotLoaded  
             * 
             * 如果函数对象指定了readonly为真值，则返回前用Proxy包装返回值，使其不可修改
             * @template {boolean} B
             * @param {string} id - 函数对象的id
             * @param {B} [wait=false] - 是否等待加载完毕
             * @returns {B extends true ? Promise : *}
             */
            require(id, wait=false) {
                if (wait) {
                    // wait模式，返回Promise，resolve为返回值
                    // 加载完毕就会resolve为函数对象返回值的promise
                    return new Promise((resolve, reject) => {
                        const return_value = this.require(id, false);
                        const not_available = [
                            FuncPool.FunctionNotLoaded,
                            FuncPool.FunctionNotFound
                        ];
                        if (!not_available.includes(return_value)) {
                            resolve(return_value);
                        } else {
                            $AEL(this, 'load', e => e.detail.oFunc.id === id && resolve(e.detail.return_value));
                        }
                    });
                } else {
                    // 非wait模式，有返回值直接返回，无返回值返回对应Symbol标志
                    for (const [oFunc, return_value] of this.#oFuncs.entries()) {
                        if (oFunc.id === id) {
                            if (return_value === FuncPool.#STILL_LOADING) {
                                return FuncPool.FunctionNotLoaded;
                            } else {
                                return oFunc.readonly ? FuncPool.#MakeReadonlyObj(return_value) : return_value;
                            }
                        }
                    }
                    return FuncPool.FunctionNotFound;
                }
            }

            isLoaded(id) {
                for (const [oFunc, return_value] of this.#oFuncs.entries()) {
                    if (oFunc.id === id) {
                        if (return_value === FuncPool.#STILL_LOADING) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return false;
                }
            }

            /**
             * 调用this.dispatchEvent分发自定义事件
             * 同时对可分发的事件名称进行限制
             * @param {'load' | 'all_load' | 'error'} evt_name 
             * @param {*} [detail] 
             */
            #broadcast(evt_name, detail) {
                return this.dispatchEvent(new CustomEvent(evt_name, { detail }));
            }

            /** (只读) 未经包装的原始GM_funcs */
            get GM_funcs() {
                return { ...this.#GM_funcs };
            }

            /**
             * 以Proxy包装value，使其属性只读 \
             * 如果传入的不是object，则直接返回value \
             * @param {Object} val
             * @returns {Proxy}
             */
            static #MakeReadonlyObj(val) {
                return isObject(val) ? new Proxy(val, {
                    get: function(target, property, receiver) {
                        return FuncPool.#MakeReadonlyObj(target[property]);
                    },
                    set: function(target, property, value, receiver) {},
                    has: function(target, prop) {},
                    setPrototypeOf(target, newProto) {
                        return false;
                    },
                    defineProperty(target, property, descriptor) {
                        return true;
                    },
                    deleteProperty(target, property) {
                        return false;
                    },
                    preventExtensions(target) {
                        return false;
                    }
                }) : val;

                function isObject(value) {
                    return ['object', 'function'].includes(typeof value) && value !== null;
                }
            }

            /**
             * 创建适用于子功能函数的{@link GM_funcs}函数  
             * 调用返回的`GM_setValue(str, val)`相当于对脚本管理器提供的GM*函数进行如下调用：
             * ``` javascript
             * const obj = GM_getValue(key, {});
             * if (typeof obj !== 'object' or obj === null) { throw new TypeError(''); }
             * obj[str] = val;
             * GM_setValue(key, obj);
             * ```
             * 其他函数依照和GM_setValue同样的设计理念
             * @param {string} key - 实际调用用户脚本管理器的GM*函数时提供的key，一般是子功能函数id
             * @returns {{ GM_setValue: function, GM_getValue: function, GM_deleteValue: function, GM_listValues: function }}
             */
            #MakeSubStorage(key) {
                const GM_funcs = this.#GM_funcs;
                return {
                    GM_setValue(name, val) {
                        checkGrant(['GM_setValue', 'GM_getValue'], 'GM_setValue');
                        const obj = GM_funcs.GM_getValue(key, {});
                        Assert(isObject(obj), `FunctionLoader: storage item of key ${name} should be an object`, TypeError);
                        obj[name] = val;
                        GM_funcs.GM_setValue(key, obj);
                    },
                    GM_getValue(name, default_value=null) {
                        checkGrant(['GM_getValue'], 'GM_getValue');
                        const obj = GM_funcs.GM_getValue(key, {});
                        return obj.hasOwnProperty(name) ? obj[name] : default_value;
                    },
                    GM_deleteValue(name) {
                        checkGrant(['GM_setValue', 'GM_getValue'], 'GM_deleteValue');
                        const obj = GM_funcs.GM_getValue(key, {});
                        delete obj[name];
                        GM_funcs.GM_setValue(key, obj);
                    },
                    GM_listValues() {
                        checkGrant(['GM_getValue'], 'GM_listValues');
                        const obj = GM_funcs.GM_getValue(key, {});
                        return Object.keys(obj);
                    },
                    GM_addValueChangeListener(listen_key, callback) {
                        checkGrant(['GM_addValueChangeListener'], 'GM_addValueChangeListener');
                        return GM_funcs.GM_addValueChangeListener(key, (key, oldValue, newValue, remote) => {
                            if (oldValue === newValue) { return; }
                            if (oldValue?.[listen_key] === newValue?.[listen_key]) { return; }
                            if (JSON.stringify(oldValue?.[listen_key]) === JSON.stringify(newValue?.[listen_key])) { return; }
                            callback(listen_key, oldValue?.[listen_key], newValue?.[listen_key], remote);
                        });
                    },
                    GM_removeValueChangeListener(listener_id) {
                        checkGrant(['GM_removeValueChangeListener'], 'GM_removeValueChangeListener');
                        return GM_funcs.GM_removeValueChangeListener(listener_id);
                    },

                };

                /**
                 * 检查指定的GM_*函数是否存在，不存在就抛出错误
                 * @param {string|string[]} funcnames
                 * @param {string} calling - 正在调用的GM_函数的名字，输出错误信息时用
                 */
                function checkGrant(funcnames, calling) {
                    Array.isArray(funcnames) || (funcnames = [funcnames]);
                    for (const funcname of funcnames) {
                        Assert(GM_funcs[funcname], `FunctionLoader: @grant ${funcname} in userscript metadata before using ${calling}`, TypeError);
                    }
                }

                function isObject(val) {
                    return typeof val === 'object' && val !== null;
                }
            }
        }
        class RedeclarationError extends TypeError {}
        class CircularDependencyError extends ReferenceError {}


        // 预置的函数池
        const default_pool = new FuncPool();

        /**
         * 在预置的函数池中加载函数对象或其数组
         * @param {oFunc[] | oFunc | Record<string, Omit<oFunc, 'id'>>} oFuncs - 需要执行的函数对象
         * @returns {FuncPool}
         */
        function loadFuncs(oFuncs) {
            default_pool.load(oFuncs);
            return default_pool;
        }

        /**
         * 在预置的函数池中获取函数对象的返回值
         * @type {typeof FuncPool.prototype.require}
         */
        function require(id, wait) {
            return default_pool.require(id, wait);
        }

        /**
         * 在预置的函数池中检查指定函数对象是否已经加载完毕（有返回值可用）
         * @param {string} id - 函数对象的字符串id
         * @returns {boolean}
         */
        function isLoaded(id) {
            return default_pool.isLoaded(id);
        }

        /**
         * 测试给定checker是否检测通过 \
         * 给定多个checker时，checkers之间是 或 关系，有一个checker通过即算作整体通过 \
         * 注意此函数设计和旧版testChecker的设计不同，旧版中一个checker可以有多个值，还可通过checker.all指定多值之间的关系为 与 还是 或
         * @param {checker[]|checker} [checkers] - 需要检测的checkers
         * @param {oFunc|*} [this_value] - 如提供，将用作checkers运行时的this值；一般而言为checkers所属的函数对象
         * @returns {boolean}
         */
        function testCheckers(checkers=[], this_value=null) {
            checkers = Array.isArray(checkers) ? checkers : [checkers];
            return checkers.length === 0 || checkers.some(checker => !!registered_checkers[checker.type]?.call(this_value, checker.value));
        }

        /**
         * 注册新checker \
         * 如果给定type已经被其他checker占用，则会报错RedeclarationError \
         * @param {string} type - checker类名
         * @param {function} func - checker implementation
         */
        function registerChecker(type, func) {
            if (registered_checkers.hasOwnProperty(type)) {
                throw RedeclarationError(`Attempts to register checker with type already in use: ${type}`);
            }
            registered_checkers[type] = func;
        }

        const FunctionLoader = {
            FuncPool,
            testCheckers,
            registerChecker,
            get checkers() {
                return Object.assign({}, registered_checkers);
            },
            Error: {
                RedeclarationError,
                CircularDependencyError
            },

            // 仅用于JSDoc类型导出，无实际作用
            _types: {
                /** @type {oFunc} */
                oFunc: {},
                /** @type {checker} */
                checker: {},
            }
        };
        return { FunctionLoader, loadFuncs, require, isLoaded, default_pool };
    }) ();

    return [
        // Console & Debug
        LogLevel, DoLog, Err, Assert,

        // DOM
        $, $All, $CrE, $AEL, $$CrE, addStyle, detectDom, destroyEvent,

        // Data
        copyProp, copyProps, parseArgs, escJsStr, replaceText,

        // Environment & Browser
        getUrlArgv, dl_browser, dl_GM,

        // Logic & Task
        AsyncManager, queueTask, FunctionLoader, loadFuncs, require, isLoaded, default_pool
    ];
}) ();