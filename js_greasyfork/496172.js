// ==UserScript==
// @name         2ch Poster
// @namespace    http://tampermonkey.net/
// @version      2024-09-30
// @description  Перекатчик тредов.
// @match        https://2ch.hk/*
// @match        https://2ch.life/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496172/2ch%20Poster.user.js
// @updateURL https://update.greasyfork.org/scripts/496172/2ch%20Poster.meta.js
// ==/UserScript==

//@ts-check
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @typedef {object} VirtualElement
 * @property {T} tagName
 * @property {Partial<Omit<HTMLElementTagNameMap[T], "style">>} attributes
 * @property {Partial<CSSStyleDeclaration>} style
 * @property {(VirtualElement<any>|string)[]} children
 */
/**
 * @typedef {object} State
 * @property {number} index
 * @property {any[]} arr
 */
/**
 * @template T
 * @typedef {[function():Readonly<T>, function(Partial<T>):void, Readonly<T>]} UseStateReturnTuple
 */
/**
 * @typedef {object} PostPayload
 * @property {string} board 
 * @property {number|null|undefined} threadNumber 
 * @property {string|null|undefined} subject 
 * @property {string|null|undefined} comment 
 * @property {File[]} files 
 */
/**
 * @typedef {object} ThreadToWatch
 * @property {string} board
 * @property {number} threadNumber
 * @property {number} limit
 * @property {boolean} isLeaveLinkToNewThread
 */
/**
 * @typedef {object} NetworkConfig
 * @property {string} domain
 * @property {number} attempts
 * @property {number} updatingDelayMs
 * @property {number} postingDelayMs
 */
/**
 * @async
 * @callback ConfigFormCallback
 * @param {ThreadToWatch} threadToWatch
 * @param {PostPayload} payload
 * @param {NetworkConfig} networkConfig
 * @returns {Promise<void>}
 */
/**
 * @callback LoggerCallback
 * @param {function(...any):void} logger
 * @param {...any} data
 * @returns {void}
 */
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @callback OnChangeCallback
 * @param {HTMLElementTagNameMap[T]} element
 * @return {void}
 */
/**
 * @template {keyof HTMLElementTagNameMap} T
 * @callback OnClickCallback
 * @param {HTMLElementTagNameMap[T]} element
 * @return {void}
 */
(function () {
    'use strict';
    //--------------------------------------------------------------------------
    /**
     * Virtual DOM rendering tools.
     * Is is not effective, just experimental and proof of concept.
     */
    class MiniReact {
        /**
         * @param {File[]} files
         * @returns {FileList}
         */
        static filesToFileList(files) {
            const transfer = new DataTransfer();
            files.forEach(file => transfer.items.add(file));
            return transfer.files;
        }

        /**
         * @param {File} file
         * @param {string} newName
         * @returns {File}
         */
        static removeFileName(file, newName = "image") {
            const blob = file.slice(0, file.size, file.type);
            return new File([blob], newName, { type: file.type });
        }

        /**
        * @template T
        * @param {function():void} render
        * @param {State} state
        * @param {function(function():void, State, T):UseStateReturnTuple<T>} pureUseState
        * @returns {function(T):UseStateReturnTuple<T>}
        */
        createStateManager(render, state, pureUseState) {
            return (initialValue) => pureUseState(render, state, initialValue);
        }

        /**
         * Simple state manager.
         * 
         * @template T
         * @param {function():void} render
         * @param {State} state
         * @param {T} initialValue
         * @returns {UseStateReturnTuple<T>}
         */
        pureUseState(render, state, initialValue) {
            const currentIndex = state.index;
            if (!(currentIndex in state.arr)) {
                state.arr[currentIndex] = initialValue;
            }

            ++(state.index);
            return [() => state.arr[currentIndex], (stateUpdate) => {
                if (typeof stateUpdate === 'object' && stateUpdate !== null) {
                    const newState = {};
                    for (const [key, value] of Object.entries(state.arr[currentIndex])) {
                        newState[key] = (Object.hasOwn(stateUpdate, key) ? stateUpdate[key] : value);
                    }
                    state.arr[currentIndex] = newState;
                }
                else {
                    state.arr[currentIndex] = stateUpdate;
                }
                console.debug("New state", state.arr);
                // stateIndex = 0;
                render();
            }, initialValue];
        }

        /**
         * @template {keyof HTMLElementTagNameMap} T
         * @param {VirtualElement<T>} element
         * @returns {HTMLElementTagNameMap[T]|Text}
         */
        mountElementOnce(element) {
            if (element.attributes.id === undefined) {
                throw new Error("Unable to find id of virtual element");
            }
            const old = document.getElementById(element.attributes.id);
            if (old !== null) {
                // @ts-ignore
                return old;
            }
            const domElem = this.#buildVirtualElement(element);
            document.body.prepend(domElem);
            return domElem;
        }

        /**
         * @template {keyof HTMLElementTagNameMap} T
         * @param {Node} old
         * @param {VirtualElement<T>|string} modern
         * @param {number} depth
         * @returns {void}
         */
        renderNode(old, modern, depth = 1) {
            if (!(old instanceof HTMLElement || old instanceof Text)) {
                console.warn("Unsupported type of DOM node:", old.nodeType);
                return;
            }

            if (typeof modern === "string") {
                if (old instanceof Text) {
                    if (old.wholeText !== modern) {
                        this.#replaceNode(old, modern);
                    }
                    return;
                }
                this.#replaceNode(old, modern);
                return;
            }
            if (old instanceof Text) {
                this.#replaceNode(old, modern);
                return;
            }
            if (modern.tagName !== old.tagName.toLowerCase()) {
                this.#replaceNode(old, modern);
                return;
            }
            this.#renderAttributes(old, modern);

            // process children.
            const oldChildren = old.childNodes;
            const modernChildren = modern.children;
            for (let i = oldChildren.length - 1; i >= modernChildren.length; i--) {
                console.debug(`${i}) Removed old child:`, oldChildren[i]);
                old.removeChild(oldChildren[i]);
            }
            for (let i = 0; i < oldChildren.length; i++) {
                this.renderNode(oldChildren[i], modernChildren[i], depth + 1);
            }
            // Length of oldChildren is changing during appending new nodes.
            const countOfNewNodes = modernChildren.length - oldChildren.length;
            const firstNewNodeIndex = oldChildren.length;
            for (let i = firstNewNodeIndex; i < firstNewNodeIndex + countOfNewNodes; i++) {
                console.debug(`${i}) Appended modern child:`, modernChildren[i]);
                old.appendChild(this.#buildVirtualElement(modernChildren[i]));
            }
        }

        /**
         * @template {keyof HTMLElementTagNameMap} T
         * @param {Node} old
         * @param {VirtualElement<T>|string} modern
         * @returns {void}
         */
        #replaceNode(old, modern) {
            old.parentElement.replaceChild(this.#buildVirtualElement(modern), old);
            console.debug("Replaced:", { "old": old }, { "modern": modern });
        }

        /**
         * @param {Partial<CSSStyleDeclaration>} style
         * @param {HTMLElement} element
         * @returns {void}
         */
        #applyStyle(element, style) {
            if (Object.keys(style).length === 0) {
                element.removeAttribute("style");
                return;
            }

            // Now we just reset all style attributes.
            for (const [name, value] of Object.entries(style)) {
                element.style[name] = value;
            }
        }

        /**
         * @template {keyof HTMLElementTagNameMap} T
         * @param {VirtualElement<T>|string} virtual
         * @param {boolean} isRecursive
         * @returns {HTMLElementTagNameMap[T]|Text}
         */
        #buildVirtualElement(virtual, isRecursive = true) {
            if (typeof virtual === "string") {
                return document.createTextNode(virtual);
            }

            const element = document.createElement(virtual.tagName);
            this.#applyStyle(element, virtual.style);
            // Set both attributes and event listeners.
            Object.entries(virtual.attributes).forEach(([name, value]) => element[name] = value);

            if (isRecursive) {
                element.append(...virtual.children.map((child) => this.#buildVirtualElement(child)));
            }
            return element;
        }

        /**
         * @template {keyof HTMLElementTagNameMap} T
         * @param {HTMLElement} old
         * @param {VirtualElement<T>} modern
         * @returns {void}
         */
        #renderAttributes(old, modern) {
            const tempModern = document.createElement(modern.tagName);
            const modernAttributes = Object.entries(modern.attributes);
            modernAttributes.forEach(([name, value]) => tempModern[name] = value);

            this.#applyStyle(old, modern.style);
            for (const [modernName, modernValue] of modernAttributes) {
                const oldValue = old[modernName];
                if (typeof modernValue === "function") {
                    // Just always reset event listeners.
                    old[modernName] = modernValue;
                }
                else if (oldValue === null) {
                    console.debug(`New attr set: ${modern.tagName}.${modernName}`, modernValue);
                    old[modernName] = modernValue;
                    continue;
                }
                else if (!this.#areAttributesEqual(oldValue, modernValue)) {
                    console.debug(`Attr changed: ${modern.tagName}.${modernName}`,
                        { "from": oldValue }, { "to": modernValue });
                    old[modernName] = modernValue;
                    continue;
                }
            }
            for (const oldAttr of old.attributes) {
                if (oldAttr.name !== "style" && tempModern.getAttribute(oldAttr.name) === null) {
                    console.debug(`Old attr removed: ${modern.tagName}`, oldAttr);
                    old.removeAttribute(oldAttr.name);
                }
            }
        }

        /**
         * @param {any} first
         * @param {any} second
         * @returns {boolean}
         */
        #areAttributesEqual(first, second) {
            if (!(first instanceof FileList && second instanceof FileList)) {
                return first === second;
            }
            if (first.length !== second.length) {
                return false;
            }
            let isEqual = true;
            for (let i = 0; i < first.length; i++) {
                if (first.item(i) !== second.item(i)) {
                    isEqual = false;
                }
            }
            return isEqual;
        }
    }

    /**
     * Effective fixed-size array.
     * 
     * @template T
     * @see https://stackoverflow.com/a/48061123/
     * @see https://en.wikipedia.org/wiki/Circular_buffer
     */
    class RingBuffer {
        /**
         * @type {T[]}
         */
        container;

        /**
         * @param {number} size 
         */
        constructor(size) {
            this.container = new Array(size);
            this.offset = 0;
        }

        /**
         * @param {T} value
         * @returns {void}
         */
        add(value) {
            this.container[this.offset++] = value;
            this.offset %= this.container.length;
        }

        /**
         * @param {number} i
         * @returns {T}
         */
        get(i) {
            const lastItemIndex = this.offset - 1;
            return this.container[(this.container.length + lastItemIndex - i) % this.container.length];
        }

        /**
         * @template A
         * @param {function(A,T):A} callback
         * @param {A} initialValue
         * @param {boolean} isSkipNotExisted
         * @returns {A}
         */
        reduceReverse(callback, initialValue, isSkipNotExisted = true) {
            let accumulator = initialValue;
            for (let i = 0; i < this.container.length; i++) {
                if (isSkipNotExisted && this.get(i) === undefined) {
                    continue;
                }
                accumulator = callback(accumulator, this.get(i));
            }
            return accumulator;
        }
    }

    class DvachAPI {
        /**
         * @param {LoggerCallback} logger 
         */
        constructor(logger) {
            this.logMsg = logger;
        }

        /**
         * @param {string} domain
         * @param {string} board 
         * @param {number} threadNumber 
         * @returns {Promise<number>}
         */
        async getPostsCount(domain, board, threadNumber) {
            const response = await fetch(`https://${domain}/api/mobile/v2/info/${board}/${threadNumber}`);
            if (response.ok) {
                const json = await response.json();
                return (json?.thread?.posts ?? 0) + 1; // op-post is not counted by API.
            }
            this.logMsg(console.error, `Ошибка HTTP во время получения количества постов:`, response.status);
            return 0;
        }

        /**
         * @param {PostPayload} payload
         * @param {NetworkConfig} networkConfig
         * @returns {Promise<object>} Thread or post.
         */
        async sendPost(payload, networkConfig) {
            const formData = new FormData();
            formData.append("board", payload.board);
            payload.subject && formData.append("subject", payload.subject);
            payload.comment && formData.append("comment", payload.comment);
            payload.threadNumber && formData.append("thread", payload.threadNumber.toString());
            payload.files.forEach(file => formData.append("file[]", MiniReact.removeFileName(file)));
            const send = async () => {
                const response = await fetch(`https://${networkConfig.domain}/user/posting`, {
                    method: "POST",
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP во время отправки поста: ${response.status}`)
                }
                const result = await response.json();
                const [errorCode, errorMsg] = [result?.error?.code ?? 0, result?.error?.message];
                if (errorCode !== 0) {
                    throw new Error(`Ошибка сервера во время отправки поста: ${errorCode}: ${errorMsg}`);
                }
                this.logPost(networkConfig.domain, payload, result);
                return result;
            };

            let lastError = null;
            for (let i = 1; i <= networkConfig.attempts; i++) {
                try {
                    return await send();
                }
                catch (e) {
                    lastError = e;
                    this.logMsg(console.warn, `Попытка ${i}/${networkConfig.attempts}) Не удалось отправить форму!`, e);
                    await this.delay(networkConfig.postingDelayMs);
                }
            }
            throw new Error(`Не удалось отправить форму после всех ${networkConfig.attempts} попыток: ${lastError}`);
        }

        /**
         * @param {ThreadToWatch} threadToWatch
         * @param {PostPayload} payload
         * @param {NetworkConfig} networkConfig
         * @returns {Promise<any>} Thread or post.
         */
        async sendPostAfterLimit(threadToWatch, payload, networkConfig) {
            let postsCount = 0;
            while (threadToWatch.board && postsCount < threadToWatch.limit) {
                postsCount = await this.getPostsCount(networkConfig.domain, threadToWatch.board, threadToWatch.threadNumber);
                this.logMsg(console.info, "Текущее количество постов:", postsCount, "/", threadToWatch.limit);
                await this.delay(networkConfig.updatingDelayMs);
            }
            const post = await this.sendPost(payload, networkConfig);
            if (threadToWatch.isLeaveLinkToNewThread && post?.thread) {
                await this.sendPost({
                    board: threadToWatch.board,
                    threadNumber: threadToWatch.threadNumber,
                    subject: null,
                    comment: `[b]Перекат: >>${post.thread}[/b]\n`.repeat(3),
                    files: [],
                }, networkConfig);
            }
            return post;
        }

        /**
         * @param {number} ms 
         * @returns {Promise<void>}
         */
        async delay(ms) {
            return new Promise(function (resolve) {
                setTimeout(resolve, ms);
            });
        }

        /**
         * @param {string} domain
         * @param {string} board 
         * @param {number} threadNumber 
         * @param {number|null} postNumber 
         * @returns {string}
         */
        getThreadURL(domain, board, threadNumber, postNumber = null) {
            const num = postNumber === null ? '' : `#${postNumber}`;
            return `https://${domain}/${board}/res/${threadNumber}.html${num}`;
        }

        /**
         * @param {string} domain
         * @param {PostPayload} payload
         * @param {any} post 
         */
        logPost(domain, payload, post) {
            if (post?.thread !== undefined) {
                const url = this.getThreadURL(domain, payload.board, post.thread);
                this.logMsg(console.info, "Тред создан:", url, post);
            }
            else if (post?.num !== undefined && payload.threadNumber !== null) {
                const url = this.getThreadURL(domain, payload.board, payload.threadNumber, post.num)
                this.logMsg(console.info, "Пост отправлен:", url, post);
            }
            else {
                this.logMsg(console.warn, "Неизвестный тип поста", post);
            }
        }
    }
    //--------------------------------------------------------------------------
    // Functions.
    /**
     * @param {string} id 
     * @param {(VirtualElement<any>|string)[]} nodes 
     * @returns {VirtualElement<"div">}
     */
    function createContainer(id, ...nodes) {
        return {
            tagName: "div",
            attributes: {
                id: id,
            },
            style: {},
            children: nodes,
        };
    }

    /**
     * @template {keyof HTMLElementTagNameMap} T
     * @param {T} element
     * @param {string} flexDirection
     * @param {string|null|undefined} justifyContent
     * @param {(VirtualElement<any>|string)[]} nodes 
     * @returns {VirtualElement<T>}
     */
    function createFlex(element, flexDirection, justifyContent, ...nodes) {
        return {
            tagName: element,
            attributes: {},
            style: {
                display: "flex",
                flexDirection: flexDirection,
                justifyContent: justifyContent ?? "space-between",
                flexWrap: "wrap",
                gap: "0.3em",
            },
            children: nodes,
        };
    }

    /**
     * @param {string} type 
     * @param {string} name 
     * @param {string} label 
     * @param {string|number|boolean|File[]} value
     * @param {OnChangeCallback<"input">} onChange 
     * @param {string|null|undefined} placeholder
     * @param {Partial<Omit<HTMLElementTagNameMap["input"], "style">>} extraAttrs
     * @returns {VirtualElement<"div">}
     */
    function createInput(type, name, label, value, onChange, placeholder = null, extraAttrs = {}) {
        const id = `poster_${name}`;
        /** @type {VirtualElement<"input">} */
        const input = {
            tagName: "input",
            attributes: {
                id: id,
                type: type,
                name: name,
                title: placeholder ?? label,
                placeholder: placeholder ?? "",
                onchange: (event) => {
                    if (!(event.target instanceof HTMLInputElement)) {
                        throw new Error(`Unable to find an input with id ${id}`);
                    }
                    onChange(event.target);
                },
            },
            style: {},
            children: [],
        };
        if (value) {
            if (typeof value === "boolean") {
                input.attributes.checked = value;
            }
            else if (Array.isArray(value)) {
                input.attributes.files = MiniReact.filesToFileList(value);
            }
            else {
                input.attributes.value = value.toString();
            }
        }
        Object.entries(extraAttrs).forEach(([key, value]) => input.attributes[key] = value);

        /** @type {VirtualElement<"label">} */
        const labelElement = {
            tagName: "label",
            attributes: {
                htmlFor: input.attributes.id
            },
            style: {},
            children: [label],
        };
        return createFlex("div", "column", null, labelElement, input);
    };

    /**
     * @param {string} name 
     * @param {string} placeholder 
     * @param {string} value
     * @param {OnChangeCallback<"textarea">|null} onChange
     * @param {Partial<Omit<HTMLElementTagNameMap["textarea"], "style">>} extraAttrs
     * @param {Partial<CSSStyleDeclaration>} extraStyle
     * @returns {VirtualElement<"textarea">}
     */
    function createTextarea(name, placeholder, value, onChange = null, extraAttrs = {}, extraStyle = {}) {
        let realOnChange = null;
        if (onChange) {
            realOnChange = (event) => {
                if (!(event.target instanceof HTMLTextAreaElement)) {
                    throw new Error(`Unable to find a textarea with name ${name}`);
                }
                onChange(event.target);
            };
        }

        /** @type {VirtualElement<"textarea">} */
        const textarea = {
            tagName: "textarea",
            attributes: {
                name: name,
                placeholder: placeholder,
                title: placeholder,
                value: value,
                onchange: realOnChange,
            },
            style: {
                minHeight: "15em",
                minWidth: "20em",
            },
            children: [],
        };
        Object.entries(extraAttrs).forEach(([key, value]) => textarea.attributes[key] = value);
        Object.entries(extraStyle).forEach(([key, value]) => textarea.style[key] = value);
        return textarea;
    };

    /**
     * @param {string} id 
     * @param {string} value 
     * @param {boolean} isDisabled
     * @param {OnClickCallback<"button">} onClick
     * @returns {VirtualElement<"button">}
     */
    function createButton(id, value, isDisabled, onClick) {
        return {
            tagName: "button",
            attributes: {
                type: "button",
                id: id,
                disabled: isDisabled,
                onclick: (event) => {
                    if (!(event.target instanceof HTMLButtonElement)) {
                        throw new Error(`Unable to find a button with id ${id}`);
                    }
                    onClick(event.target);
                },
            },
            style: {
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
            },
            children: [value],
        };
    }

    /**
     * @param {string} legend 
     * @param {VirtualElement<any>[]} nodes
     * @returns {VirtualElement<"fieldset">}
     */
    function createFieldSet(legend, ...nodes) {
        /** @type {VirtualElement<"legend">} */
        const legendElem = {
            tagName: "legend",
            attributes: {},
            style: {},
            children: [legend],
        };
        return createFlex("fieldset", "column", "flex-start", legendElem, ...nodes);
    }

    /**
     * @param {string} id 
     * @param {boolean} isDisplayed
     * @param {VirtualElement<any>[]} nodes
     * @returns {VirtualElement<"form">}
     */
    function createForm(id, isDisplayed, ...nodes) {
        return {
            tagName: "form",
            attributes: {
                id: id,
            },
            style: {
                display: isDisplayed ? "flex" : "none",
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0.3em",
                backdropFilter: "blur(1em)",
                padding: "0.3em",
                zIndex: "1000",
            },
            children: nodes,
        };
    }

    /**
     * @param {ThreadToWatch} threadToWatch
     * @param {PostPayload} payload
     * @param {NetworkConfig} networkConfig
     * @returns {Promise<void>}
     */
    async function validateInput(threadToWatch, payload, networkConfig) {
        console.info("User input for validation:", threadToWatch, networkConfig, payload);
        if ((threadToWatch.threadNumber ? threadToWatch.threadNumber >= 0 : true)
            && (threadToWatch.limit ? threadToWatch.limit >= 0 : true)
            && networkConfig.attempts > 0
            && networkConfig.postingDelayMs > 0
            && (threadToWatch.threadNumber > 0 ? networkConfig.updatingDelayMs > 0 : true)
            && payload.board
            && (payload.threadNumber ? payload.threadNumber > 0 : true)
            && (payload.subject || payload.comment || payload.files.length > 0)
        ) {
            return;
        }
        throw new Error("Введены неверные данные.");
    }

    /**
     * @param {number} maxSize
     * @param {function(string):void} containerUpdater
     * @returns {LoggerCallback}
     */
    function createLogger(maxSize, containerUpdater) {
        /**
         * @type {RingBuffer<string>}
         */
        const buffer = new RingBuffer(maxSize);
        return function (logger, ...data) {
            logger(...data);
            const time = (new Date).toLocaleTimeString();
            const stringData = data.map((value) => typeof value === "object"
                ? JSON.stringify(value, Object.getOwnPropertyNames(value))
                : value).join(" ");
            buffer.add(`${time}) ${stringData}`);
            const text = buffer.reduceReverse((accumulator, value) => accumulator += value + "\n", "");
            containerUpdater(text);
        }
    }

    {
        /** @type {State} */
        const state = { "index": 0, "arr": [] };
        const logSize = 100;
        const miniReact = new MiniReact();
        const useState = miniReact.createStateManager(render, state, miniReact.pureUseState);
        //----------------------------------------------------------------------
        const [getLogText, setLogText] = useState("");
        const [getIsFormDisplayed, setIsFormDisplayed] = useState(false);
        const [getStartButtonState, setStartButtonState, startButtonInitialState]
            = useState({ disabled: false, value: "Старт" });
        const [getShowFormButtonText, setShowFormButtonText, showFormButtonInitialText] = useState("Показать форму");
        const [getThreadToWatch, setThreadToWatch] = useState(/** @type {ThreadToWatch} */({
            board: "",
            threadNumber: 0,
            limit: 500,
            isLeaveLinkToNewThread: true,
        }));
        const [getNetworkConfig, setNetworkConfig] = useState(/** @type {NetworkConfig} */({
            domain: "2ch.hk",
            attempts: 120,
            updatingDelayMs: 500,
            postingDelayMs: 10,
        }));
        const [getPayload, setPayload] = useState(/** @type {PostPayload} */({
            board: "",
            threadNumber: null,
            subject: null,
            comment: null,
            files: [],
        }));
        //----------------------------------------------------------------------
        const logMsg = createLogger(logSize, setLogText);
        const api = new DvachAPI(logMsg);

        function render() {
            const showFormButton = createButton("poster_show_form_button", getShowFormButtonText(), false, (button) => {
                if (!getIsFormDisplayed()) {
                    setIsFormDisplayed(true);
                    setShowFormButtonText("Скрыть форму");
                    button.scrollIntoView();
                    return;
                }
                setIsFormDisplayed(false);
                setShowFormButtonText(showFormButtonInitialText);
            });
            const startButton = createButton("poster_start_button",
                getStartButtonState().value,
                getStartButtonState().disabled,
                () => {
                    logMsg(console.info, "Запущено...");
                    setStartButtonState({ disabled: true, value: "Запущено..." });
                    validateInput(getThreadToWatch(), getPayload(), getNetworkConfig())
                        .then(() => api.sendPostAfterLimit(getThreadToWatch(), getPayload(), getNetworkConfig()))
                        .catch(error => logMsg(console.error, error))
                        .finally(() => {
                            setStartButtonState(startButtonInitialState);
                        });
                });

            const msgLeaveBlank = "Оставьте пустым для немедленной публикации";
            const form = createForm("poster_config_form", getIsFormDisplayed(),
                createFieldSet(
                    "Тред для наблюдения",
                    createInput("text", "threadToWatchBoard", "Борда",
                        getThreadToWatch().board,
                        (input) => {
                            setThreadToWatch({ board: input.value });
                            if (!getPayload().board) {
                                setPayload({ board: input.value });
                            }
                        },
                        msgLeaveBlank,
                    ), createInput("number", "threadToWatchNumber", "Номер треда",
                        getThreadToWatch().threadNumber,
                        (input) => setThreadToWatch({ threadNumber: Number(input.value) }),
                        msgLeaveBlank,
                    ), createInput("number", "limit", "Отправить после этого поста",
                        getThreadToWatch().limit,
                        (input) => setThreadToWatch({ limit: Number(input.value) }),
                        msgLeaveBlank,
                    ), createInput("checkbox", "isLeaveLinkToNewThread", "Опубликовать ссылку на новый тред",
                        getThreadToWatch().isLeaveLinkToNewThread,
                        (input) => setThreadToWatch({ isLeaveLinkToNewThread: input.checked }),
                    ),
                ), createFieldSet(
                    "Настройки сети",
                    createInput("text", "domain", "Домен",
                        getNetworkConfig().domain,
                        (input) => setNetworkConfig({ domain: input.value }),
                    ), createInput("number", "attempts", "Число попыток публикации",
                        getNetworkConfig().attempts,
                        (input) => setNetworkConfig({ attempts: Number(input.value) }),
                    ), createInput("number", "updatingDelayMs", "Пауза между обновлениями треда, мс",
                        getNetworkConfig().updatingDelayMs,
                        (input) => setNetworkConfig({ updatingDelayMs: Number(input.value) }),
                    ), createInput("number", "postingDelayMs", "Пауза между попытками публикации, мс",
                        getNetworkConfig().postingDelayMs,
                        (input) => setNetworkConfig({ postingDelayMs: Number(input.value) }),
                    ),
                ), createFieldSet(
                    "Пост",
                    createInput("text", "payloadBoard", "Борда",
                        getPayload().board,
                        (input) => setPayload({ board: input.value }),
                    ), createInput("number", "payloadThreadNumber", "Номер треда",
                        getPayload().threadNumber ?? "",
                        (input) => setPayload({ threadNumber: Number(input.value) }),
                        "Оставьте пустым для создания нового",
                    ), createInput("text", "subject", "Тема",
                        getPayload().subject ?? "",
                        (input) => setPayload({ subject: input.value }),
                    ), createTextarea("comment", "Комментарий",
                        getPayload().comment ?? "",
                        (textarea) => setPayload({ comment: textarea.value }),
                    ), createInput("file", "file[]", "Файлы",
                        getPayload().files,
                        (input) => setPayload({ files: Array.from(input.files ?? []) }),
                        null, { multiple: true },
                    ),
                    startButton,
                ), createFieldSet(
                    "Лог",
                    createTextarea("poster_log", "Лог", getLogText(),
                        (textarea) => setLogText(textarea.value),
                        { disabled: true },
                        { height: "100%" },
                    ),
                ));

            const app = createContainer("poster_app",
                showFormButton,
                form,
            );
            miniReact.renderNode(
                miniReact.mountElementOnce(createContainer(app.attributes.id)),
                app,
            );
        };

        // initial render
        render();
    }
})();
