// ==UserScript==
// @name         The Chairman's Bao Tools
// @tag          productivity
// @description  Improves the user experience of The Chairman's Bao website.
// @author       Joshua Brest <36625023+JoshuaBrest@users.noreply.github.com>
// @copyright    2024, Joshua Brest
// @version      0.1.3
// @namespace    http://tampermonkey.net/
// @match        https://www.thechairmansbao.com/*
// @match        https://thechairmansbao.com/*
// @match        http://www.thechairmansbao.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508875/The%20Chairman%27s%20Bao%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/508875/The%20Chairman%27s%20Bao%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // MARK: - Utility Functions

    /**
     * A reference to a type.
     * @template T
     */
    class QuickRef {
        /**
         * The current value of the reference.
         * @type {T}
         */
        current = null

        /**
         * Creates a new quick reference.
         * @param {T} [value] The initial value of the reference.
         * @returns {QuickRef<T>} The quick reference.
         */
    }

    /**
     * A class representing a quick element.
     */
    class QuickElement {
        /**
         * The element namespace. (null for automatic (content aware) namespace, or a string for a specific namespace)
         * @type {string|null}
         */
        namespace = null
        /**
         * The element name.
         * @type {string}
         */
        name = ''
        /**
         * The element attributes.
         * @type {Object.<string, string>}
         */
        attributes = {}
        /**
         * The element children.
         * @type {Array.<QuickElement | string>}
         */
        children = []
        /**
         * A QuickRef, a function accepting an HTMLElement, or null.
         * @type {QuickRef<HTMLElement>|Function.<HTMLElement, void>|null}
         */
        ref = null

        /**
         * Creates a new quick element.
         * @param {string} name The element name.
         * @param {Object.<string, string>} [attributes] The element attributes.
         * @param {Array.<QuickElement | string>} [children] The element children.
         * @param {QuickRef<HTMLElement>|Function.<HTMLElement, void>|null}
         * @param {string|null}
         * @returns {QuickElement} The quick element.
         */
        constructor(name, attributes = {}, children = [], ref = null, namespace = null) {
            this.name = name
            this.attributes = attributes
            this.children = children
            this.ref = ref
            this.namespace = namespace
        }

        /** 
         * Create an HTML tree from a quick element.
         * @returns {HTMLElement} The HTML element.
         */
        render() {
            /*
             * The stack used to create the HTML tree.
             * @type {Array.<{parentNS: string|null, parent: HTMLElement|null, element: QuickElement | string}>}
             */
            const stack = [{
                parentNS: this.namespace,
                parent: null,
                element: this
            }];
            /**
             * The root element.
             * @type {HTMLElement}
             */
            let root = null;

            while (stack.length > 0) {
                const { parentNS, parent, element } = stack.pop();

                if (element instanceof QuickElement) {
                    /**
                     * The element namespace.
                     * @type {string|null}
                     */
                    const preferedNS = element.namespace ?? parentNS ?? null;
                    /**
                     * The element.
                     * @type {HTMLElement}
                     */
                    const el = preferedNS === null ? document.createElement(element.name) : document.createElementNS(preferedNS, element.name);

                    // Add the attributes to the element.
                    for (const [key, value] of Object.entries(element.attributes)) {
                        el.setAttribute(key, value);
                    }
                    
                    // Add the child to the parent.
                    if (parent !== null) {
                        parent.appendChild(el);
                    } else {
                        root = el;
                    }

                    // Call the ref function.
                    if (element.ref instanceof QuickRef) {
                        element.ref.current = el;
                    } else if (typeof element.ref === 'function') {
                        element.ref(el);
                    }

                    // Add the children to the stack.
                    for (let i = element.children.length - 1; i >= 0; i--) {
                        stack.push({
                            parentNS: preferedNS,
                            parent: el,
                            element: element.children[i]
                        });
                    }
                } else {
                    const text = document.createTextNode(element);

                    // Add the text to the parent.
                    if (parent !== null) {
                        parent.appendChild(text);
                    } else {
                        // This should never happen, but just in case.
                        root = text;
                    }
                }
            }

            return root;
        }
    }

    /**
     * Shorthand for creating a quick element.
     * @param {string} name The element name.
     * @param {Object.<string, string>} [attributes] The element attributes.
     * @param {Array.<QuickElement | string>} [children] The element children.
     * @param {QuickRef<HTMLElement>|Function.<HTMLElement, void>|null}
     */
    function el(name, attributes = {}, children = [], ref = null, namespace = null) {
        const setNamespace = namespace === null ? attributes.xmlns ?? null : namespace;
        return new QuickElement(name, attributes, children, ref, setNamespace);
    }

    /**
     * Shorthand for creating a quick reference.
     * @param {T} [value] The initial value of the reference.
     * @returns {QuickRef<T>} The quick reference.
     * @template T
     * @returns {QuickRef<T>}
     */
    function ref(value = null) {
        const ref = new QuickRef();
        ref.current = value;
        return ref;
    }

    /**
     * Remove children from an element.
     * @param {HTMLElement} element The element.
     * @returns {void}
     */
    function removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    /**
     * Shorthand for rendering to a root element.
     * @param {QuickElement} element The quick element.
     * @param {HTMLElement} root The root element.
     * @returns {HTMLElement}
     */
    function render(element, root) {
        removeChildren(root);

        const el = element.render();
        root.appendChild(el);
        return el;
    }

    /**
     * Safely make an HTTP request.
     * @param {string} url The URL to request.
     * @param {{method: string, headers: Object.<string, string>, cors: 'cors' | 'no-cors' | 'same-origin', body: string}} [options] The request options.
     * @returns {Promise.<[true, Response] | [false, null]>} The response.
     */
    async function fetchSafe(url, options = {}) {
        try {
            const response = await fetch(url, options);
            return [true, response];
        } catch (error) {
            return [false, null];
        }
    }

    /**
     * Safely parse a JSON response.
     * @param {Response} response The response.
     * @returns {Promise.<[true, any] | [false, null]>} The parsed JSON.
     */
    async function parseJSON(response) {
        try {
            const json = await response.json();
            return [true, json];
        } catch (error) {
            return [false, null];
        }
    }

    /**
     * Inject CSS into the page.
     * @param {string} css The CSS to inject.
     * @param {HTMLElement} [root] The root element to inject the CSS into.
     * @returns {void}
     */
    function injectCSS(css, root = document.head) {
        const style = document.createElement('style');
        style.textContent = '/* INJECTED BY TCBT */\n' + css;
        root.appendChild(style);
    }

    /**
     * Inject default CSS into the page.
     * @param {HTMLElement} [root] The root element to inject the CSS into.
     * @returns {void}
     */
    function injectDefaultCSS(root = document.head) {
        injectCSS(`
            /* Google Fonts (Rubik) */
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

            /* Reset */
            .root {
                font-size: 12pt;
            }

            div, span, h1, h2, h3, h4, h5, h6, p, a, img, ul, ol, li, table, thead, tbody, tfoot, tr, th, td, form, input, button, select, option, textarea {
                margin: 0;
                padding: 0;
                border: 0;
                font-size: 1rem;
                font-weight: normal;
                text-decoration: none;
                list-style: none;
                color: inherit;
                background: transparent;
                vertical-align: baseline;
                font-family: 'Rubik', sans-serif;
                box-sizing: border-box;
                min-width: 0;
                min-height: 0;
                max-width: unset;
                max-height: unset;

                --font-sans: 'Rubik', sans-serif;

                --color-white: #ffffff;
                --color-black: #000000;
                --color-transparent: transparent;
                --color-gray-50: #fafafa;
                --color-gray-100: #f4f4f5;
                --color-gray-200: #e4e4e7;
                --color-gray-300: #d4d4d8;
                --color-gray-400: #a1a1aa;
                --color-gray-500: #71717a;
                --color-gray-600: #52525b;
                --color-gray-700: #3f3f46;
                --color-gray-800: #27272a;
                --color-gray-900: #18181b;
                --color-gray-950: #09090b;
                --color-danger-50: #fef2f2;
                --color-danger-100: #fee2e2;
                --color-danger-200: #fecaca;
                --color-danger-300: #fca5a5;
                --color-danger-400: #f87171;
                --color-danger-500: #ef4444;
                --color-danger-600: #dc2626;
                --color-danger-700: #b91c1c;
                --color-danger-800: #991b1b;
                --color-danger-900: #7f1d1d;
                --color-danger-950: #450a0a;
                --color-caution-50: #fefce8;
                --color-caution-100: #fef9c3;
                --color-caution-200: #fef08a;
                --color-caution-300: #fde047;
                --color-caution-400: #facc15;
                --color-caution-500: #eab308;
                --color-caution-600: #ca8a04;
                --color-caution-700: #a16207;
                --color-caution-800: #854d0e;
                --color-caution-900: #713f12;
                --color-caution-950: #422006;
                --color-success-50: #f0fdf4;
                --color-success-100: #dcfce7;
                --color-success-200: #bbf7d0;
                --color-success-300: #86efac;
                --color-success-400: #4ade80;
                --color-success-500: #22c55e;
                --color-success-600: #16a34a;
                --color-success-700: #15803d;
                --color-success-800: #166534;
                --color-success-900: #14532d;
                --color-success-950: #052e16;
                --color-theme-50: #eff6ff;
                --color-theme-100: #dbeafe;
                --color-theme-200: #bfdbfe;
                --color-theme-300: #93c5fd;
                --color-theme-400: #60a5fa;
                --color-theme-500: #3b82f6;
                --color-theme-600: #2563eb;
                --color-theme-700: #1d4ed8;
                --color-theme-800: #1e40af;
                --color-theme-900: #1e3a8a;
                --color-theme-950: #172554;

                --font-size-xs: 0.75rem;
                --font-size-sm: 0.875rem;
                --font-size-base: 1rem;
                --font-size-lg: 1.125rem;
                --font-size-xl: 1.25rem;
                --font-size-2xl: 1.5rem;
                --font-size-3xl: 1.875rem;
                --font-size-4xl: 2.25rem;
                --font-size-5xl: 3rem;

                --radius-sm: 0.25rem;
                --radius-md: 0.375rem;
                --radius-lg: 0.5rem;
                --radius-xl: 0.75rem;
                --radius-2xl: 1rem;
                --radius-3xl: 1.5rem;
                --radius-full: 999999px;
                --radius-none: 0;

                --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
                --shadow-none: none;

                --font-weight-thin: 100;
                --font-weight-extralight: 200;
                --font-weight-light: 300;
                --font-weight-normal: 400;
                --font-weight-medium: 500;
                --font-weight-semibold: 600;
                --font-weight-bold: 700;

                --padding-xs: 0.5rem;
                --padding-sm: 0.75rem;
                --padding-base: 1rem;
                --padding-lg: 1.5rem;
                --padding-xl: 2rem;
                --padding-2xl: 3rem;
                --padding-3xl: 4rem;
                --padding-4xl: 6rem;
                --padding-5xl: 8rem;
            }
        `, root);
    }

    /**
     * A logging function.
     * @param {'debug' | 'info' | 'warn' | 'error'} type The type of log.
     * @param {string} message The message to log.
     * @param {Array.<unknown>} data The data to log.
     * @returns {void}
     */
    function log(type, message, ...data) {
        console.log(
            '%c[TCBT:%s]%c ' + message,
            'background: #222; color: #bada55',
            type.toUpperCase(),
            '',
            ...data
        );
    }

    /**
     * Get the token for requests.
     * @returns {string} The token.
     */
    function getToken() {
        if (typeof axios === 'undefined') {
            return '';
        }

        return axios.defaults?.headers?.common?.Token ?? '';
    }

    /**
     * Get pathname components.
     * @param {string|null} [pathname] The pathname.
     * @returns {Array.<string>} The pathname components.
     */
    function getPathnameComponents(pathname = window.location.pathname) {
        return pathname.split('/').filter(Boolean);
    }

    /**
     * Compare two arrays.
     * @param {Array.<T>} a The first array.
     * @param {Array.<T>} b The second array.
     * @returns {boolean} Whether the arrays are equal.
     * @template T
     */
    function arraysEqual(a, b) {
        return a.length === b.length && a.every((value, index) => value === b[index]);
    }

    // MARK: - Assignments page script

    /**
     * The assignments page script.
     * This assumes that the pathname is /assignments.
     */
    async function assignmentsPage() {
        const injectionRoot = document.getElementById('page-wrapper');
        if (injectionRoot === null || !(injectionRoot instanceof HTMLElement) || !injectionRoot.firstChild) {
            log('error', 'Could not find the assignments page root element.');
            return;
        }

        injectCSS(`
            .tcbt--assignments-page-root {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                padding: 2rem 0;
            }
        `);

        // Create a element at the top
        const contentRootPage = document.createElement('div');
        contentRootPage.classList.add('tcbt--assignments-page-root');
        injectionRoot.insertBefore(contentRootPage, injectionRoot.firstChild);

        // Create a shadow root
        const shadowRoot = contentRootPage.attachShadow({ mode: 'open' });
        injectDefaultCSS(shadowRoot);

        injectCSS(`
            .root {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                border-radius: var(--radius-lg);
                padding: var(--padding-base);
                background-color: var(--color-gray-900);
                color: var(--color-white);
                height: 40rem;
            }
            .root-header {
                display: flex;
                flex-direction: row;
                gap: 1rem;
                align-items: center;
            }
            .root-header-title {
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-bold);
            }
            .root-header-gap {
                flex: 1;
            }
            .root-header-watermark {
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-base);
            }
            .root-mount-content {
                display: flex;
                flex: 1;
            }
            .content-loading {
                flex: 1;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: var(--font-size-lg);
                border-radius: var(--radius-lg);
                border: 1px dashed var(--color-gray-800);
            }
            .content-table-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                border-radius: var(--radius-lg);
                border: 1px solid var(--color-gray-800);
                overflow-x: hidden;
                overflow-y: scroll;
            }
            .content-table {
                width: 100%;
                height: 100%;
                border-collapse: collapse;
                table-layout: auto;
            }
            .content-table thead th {
                position: sticky;
                top: 0;
                z-index: 1;
                padding: var(--padding-sm);
                text-align: left;
                background-color: var(--color-gray-900);
                box-shadow: inset 0 -1px 0 var(--color-gray-800);
            }
            .content-table tbody tr {
                border-bottom: 1px solid var(--color-gray-700);
                color: var(--color-gray-200);
                background-color: var(--color-gray-800);
            }
            .content-table tbody tr:last-child {
                border-bottom: none;
            }
            .content-table tbody td {
                padding: var(--padding-sm);
            }
            .content-table-link {
                color: var(--color-theme-500);
                text-decoration: none;
                transition: color 0.2s;
            }
            .content-table-link:hover {
                color: var(--color-theme-600);
                text-decoration: underline;
            }
            .content-table-link svg {
                width: 1rem;
                height: 1rem;
                padding-left: 0.5rem;
            }
            .content-table-badge {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: var(--padding-xs) var(--padding-sm);
                border-radius: var(--radius-full);
                width: 4rem;
                width: max-content;
            }
            .content-table-badge--overdue {
                background-color: var(--color-danger-600);
            }
            .content-table-badge--due-soon {
                background-color: var(--color-caution-600);
            }
            .content-table-badge--assigned {
                background-color: var(--color-success-600);
            }
        `, shadowRoot);

        // Create a root element
        const contentMount = ref();
        const root = el('div', { class: 'root' }, [
            el('div', { class: 'root-header' }, [
                el('h1', { class: 'root-header-title' }, ['Assignments']),
                el('div', { class: 'root-header-gap' }),
                el('h2', { class: 'root-header-watermark' }, ['Powered by TCBT'])
            ]),
            el('div', { class: 'root-mount-content' }, [], contentMount)
        ]);

        shadowRoot.appendChild(root.render());

        /**
         * Show the loading screen.
         * @returns {void}
         * @returns {void}
         */
        function contentMountShowLoading() {
            render(el('div', { class: 'content-loading' }, ['Loading...']), contentMount.current);
        }

        /**
         * Fetch the data.
         * @returns {Promise<Array.<{
         *     id: number;
         *     name: string;
         *     publishTime: number;
         *     dueTime: number;
         *     assignmentID: number;
         *     assignmentType: 'listening' | 'other';
         *     postID: number;
         *     postTitle: string;
         *     postThumbnailURL: URL;
         *     teacherID: number;
         *     teacherName: string;
         * }>>} The data.
         */
        async function fetchData() {
            const [didFetch, response] = await fetchSafe('https://sonic.thechairmansbao.com/learning-hub/assignment/pending', {
                headers: {
                    Token: getToken()
                }
            });
            if (!didFetch) {
                return [];
            }

            const [didParse, json] = await parseJSON(response);
            if (!didParse) {
                return [];
            }

            if (!Array.isArray(json)) {
                return [];
            }

            log('debug', 'Fetched assignments %o', json);

            /**
             * Parse a date to a time.
             * @param {string} date The date.
             * @returns {number} The time.
             */
            function parseDateToTime(date) {
                const parts = date.split(' ');
                if (parts.length < 1) return 0;
                
                const dateParts = parts[0].split('-');
                if (dateParts.length < 3) return 0;
                const [day, month, year] = dateParts.map((part) => parseInt(part, 10));

                const timeParts = parts.length > 1 ? parts[1].split(':').map((part) => parseInt(part, 10)) : [0, 0, 0];
                if (timeParts.length < 3) return 0;
                const [hour, minute, second] = timeParts;

                return new Date(year, month - 1, day, hour, minute, second).getTime();
            }

            return json.map((assignment) => ({
                id: assignment.id,
                name: assignment.show_text,
                publishTime: parseDateToTime(assignment.add_time),
                dueTime: parseDateToTime(assignment.due_date_time),
                assignmentID: assignment.assignment.id,
                assignmentType: assignment.assignment.type === 1 ? 'other' : 'listening',
                postID: assignment.assignment.post.ID,
                postTitle: assignment.assignment.post.post_title,
                postThumbnailURL: new URL(assignment.assignment.post.thumbnail),
                teacherID: assignment.teacher.ID,
                teacherName: assignment.teacher.user_nicename ?? assignment.teacher.user_login
            }));
        }

        /**
         * Show the data.
         * @returns {Promise<void>}
         */
        async function contentMountShowData() {
            const data = await fetchData();

            if (data.length === 0) {
                render(el('div', { class: 'content-loading' }, ['No assignments found.']), contentMount.current);
                return;
            }

            const sortedByClosestDueTime = data.sort((a, b) => a.dueTime - b.dueTime);

            render(el('div', { class: 'content-table-wrapper' }, [
                el('table', { class: 'content-table' }, [
                    el('thead', {}, [
                        // Only show relevent information
                        el('tr', {}, [
                            el('th', {}, ['Status']),
                            el('th', {}, ['Title']),
                            el('th', {}, ['Due Date']),
                            el('th', {}, ['Due Time']),
                            el('th', {}, ['Asignee']),
                        ])
                    ]),
                    el('tbody', {}, sortedByClosestDueTime.map((assignment) => el('tr', {}, [
                        el('td', {}, [
                            new Date().getTime() > assignment.dueTime
                                ? el('div', { class: 'content-table-badge content-table-badge--overdue' }, ['Overdue'])
                                : new Date().getTime() > assignment.dueTime - (1000 * 60 * 60 * 24)
                                    ? el('div', { class: 'content-table-badge content-table-badge--due-soon' }, ['Due Soon'])
                                    : el('div', { class: 'content-table-badge content-table-badge--assigned' }, ['Assigned'])
                        ]),
                        el('td', {}, [
                            el('a', {
                                class: 'content-table-link',
                                href: assignment.assignmentType === 'other'
                                    ? '/?p=' + encodeURIComponent(assignment.postID) + '&aid=' + encodeURIComponent(assignment.assignmentID)
                                    : '/quiz?type=listening&id=' + encodeURIComponent(assignment.postID) + '&aid=' + encodeURIComponent(assignment.assignmentID) + '&lh=1',
                                target: '_blank'
                            }, [
                                assignment.name,
                                el('svg', {
                                    xmlns: 'http://www.w3.org/2000/svg',
                                    fill: 'none',
                                    viewBox: '0 0 24 24',
                                    stroke: 'currentColor',
                                    'stroke-width': '1.5',
                                }, [
                                    el('path', {
                                        'stroke-linecap': 'round',
                                        'stroke-linejoin': 'round',
                                        d: 'M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                                    })
                                ])
                            ])
                        ]),
                        el('td', {}, [new Date(assignment.dueTime).toLocaleDateString()]),
                        el('td', {}, [new Date(assignment.dueTime).toLocaleTimeString()]),
                        el('td', {}, [assignment.teacherName]),
                    ])))
                ])
            ]), contentMount.current);
        }


        contentMountShowLoading();
        contentMountShowData();
    }

    // MARK: - Main Script

    /**
     * The main script.
     */
    async function main() {
        // Loaded (:
        log('info', 'Loaded!');

        // Get the pathname components
        const path = getPathnameComponents();

        injectCSS`
        html, body {
            font-size: 12pt !important;
        }`;

        /**
         * Loadable scripts.
         * @type {Map.<Array.<string>, Array.<Function.<Promise.<void>>>>}
         */
        const scripts = new Map([
            [['assignments'], [assignmentsPage]]
        ]);

        for (const [components, script] of scripts) {
            if (arraysEqual(path, components)) {
                log('debug', 'Loaded script for path:', '/' + path.join('/'));
                for (const fn of script) {
                    fn();
                }
                break;
            }
        }
    }

    // Run the main script.
    main();
})();