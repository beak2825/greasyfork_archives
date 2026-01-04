// ==UserScript==
// @name         托福考位查询增强
// @namespace    https://github.com/exuanbo
// @version      2.0.1
// @author       Exuanbo
// @description  一键查询所选地点所有时间的可预定考位
// @icon         https://raw.githubusercontent.com/exuanbo/toefl-query-seats-enhance/master/src/img/icon48.png
// @match        https://toefl.neea.cn/myHome/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411096/%E6%89%98%E7%A6%8F%E8%80%83%E4%BD%8D%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/411096/%E6%89%98%E7%A6%8F%E8%80%83%E4%BD%8D%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const firstKeyOf = (obj) => Object.keys(obj)[0];
    const calcLeft = (cur, arr) => arr.length - arr.indexOf(cur) - 1;
    const sleep = (ms) => __awaiter(void 0, void 0, void 0, function* () { return yield new Promise(resolve => setTimeout(resolve, ms)); });
    const untilAvailable = (el, fn, interval = 100) => {
        const isAvailable = Boolean(el);
        if (!isAvailable) {
            window.setTimeout(fn, interval);
            return false;
        }
        return true;
    };
    const forEachElOf = (nodeList, cb) => {
        nodeList.forEach((_, index) => {
            cb(nodeList[index], index);
        });
    };
    const mapElOf = (nodeList, cb) => {
        return Array.from(nodeList).map(cb);
    };
    const someElOf = (nodeList, cb) => {
        return Array.from(nodeList).some(cb);
    };
    const isMunicipality = (cityName) => cityName === '北京' ||
        cityName === '上海' ||
        cityName === '天津' ||
        cityName === '重庆';

    const observeMutation = (target, callback, config) => {
        const observeThis = () => observeMutation(target, callback, config);
        if (!untilAvailable(target, observeThis)) {
            return;
        }
        const observer = new MutationObserver(callback);
        observer.observe(target, config);
    };
    const adjustStyle = () => {
        const formWrapper = document.getElementById('centerProvinceCity')
            .parentElement.parentElement;
        const selects = document.querySelectorAll('.form-inline select');
        if (!untilAvailable(formWrapper !== null && selects, adjustStyle)) {
            return;
        }
        formWrapper.classList.remove('offset1');
        formWrapper.style.textAlign = 'center';
        forEachElOf(selects, el => {
            el.style.width = '12em';
        });
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const directives = new WeakMap();
    const directive = (f) => ((...args) => {
        const d = f(...args);
        directives.set(d, true);
        return d;
    });
    const isDirective = (o) => {
        return typeof o === 'function' && directives.has(o);
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const isCEPolyfill = typeof window !== 'undefined' &&
        window.customElements != null &&
        window.customElements.polyfillWrapFlushCallback !==
            undefined;
    const removeNodes = (container, start, end = null) => {
        while (start !== end) {
            const n = start.nextSibling;
            container.removeChild(start);
            start = n;
        }
    };

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const noChange = {};
    const nothing = {};

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
    const nodeMarker = `<!--${marker}-->`;
    const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
    const boundAttributeSuffix = '$lit$';
    class Template {
        constructor(result, element) {
            this.parts = [];
            this.element = element;
            const nodesToRemove = [];
            const stack = [];
            const walker = document.createTreeWalker(element.content, 133 , null, false);
            let lastPartIndex = 0;
            let index = -1;
            let partIndex = 0;
            const { strings, values: { length } } = result;
            while (partIndex < length) {
                const node = walker.nextNode();
                if (node === null) {
                    walker.currentNode = stack.pop();
                    continue;
                }
                index++;
                if (node.nodeType === 1 ) {
                    if (node.hasAttributes()) {
                        const attributes = node.attributes;
                        const { length } = attributes;
                        let count = 0;
                        for (let i = 0; i < length; i++) {
                            if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                                count++;
                            }
                        }
                        while (count-- > 0) {
                            const stringForPart = strings[partIndex];
                            const name = lastAttributeNameRegex.exec(stringForPart)[2];
                            const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                            const attributeValue = node.getAttribute(attributeLookupName);
                            node.removeAttribute(attributeLookupName);
                            const statics = attributeValue.split(markerRegex);
                            this.parts.push({ type: 'attribute', index, name, strings: statics });
                            partIndex += statics.length - 1;
                        }
                    }
                    if (node.tagName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                }
                else if (node.nodeType === 3 ) {
                    const data = node.data;
                    if (data.indexOf(marker) >= 0) {
                        const parent = node.parentNode;
                        const strings = data.split(markerRegex);
                        const lastIndex = strings.length - 1;
                        for (let i = 0; i < lastIndex; i++) {
                            let insert;
                            let s = strings[i];
                            if (s === '') {
                                insert = createMarker();
                            }
                            else {
                                const match = lastAttributeNameRegex.exec(s);
                                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                    s = s.slice(0, match.index) + match[1] +
                                        match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                                }
                                insert = document.createTextNode(s);
                            }
                            parent.insertBefore(insert, node);
                            this.parts.push({ type: 'node', index: ++index });
                        }
                        if (strings[lastIndex] === '') {
                            parent.insertBefore(createMarker(), node);
                            nodesToRemove.push(node);
                        }
                        else {
                            node.data = strings[lastIndex];
                        }
                        partIndex += lastIndex;
                    }
                }
                else if (node.nodeType === 8 ) {
                    if (node.data === marker) {
                        const parent = node.parentNode;
                        if (node.previousSibling === null || index === lastPartIndex) {
                            index++;
                            parent.insertBefore(createMarker(), node);
                        }
                        lastPartIndex = index;
                        this.parts.push({ type: 'node', index });
                        if (node.nextSibling === null) {
                            node.data = '';
                        }
                        else {
                            nodesToRemove.push(node);
                            index--;
                        }
                        partIndex++;
                    }
                    else {
                        let i = -1;
                        while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                            this.parts.push({ type: 'node', index: -1 });
                            partIndex++;
                        }
                    }
                }
            }
            for (const n of nodesToRemove) {
                n.parentNode.removeChild(n);
            }
        }
    }
    const endsWith = (str, suffix) => {
        const index = str.length - suffix.length;
        return index >= 0 && str.slice(index) === suffix;
    };
    const isTemplatePartActive = (part) => part.index !== -1;
    const createMarker = () => document.createComment('');
    const lastAttributeNameRegex =
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    class TemplateInstance {
        constructor(template, processor, options) {
            this.__parts = [];
            this.template = template;
            this.processor = processor;
            this.options = options;
        }
        update(values) {
            let i = 0;
            for (const part of this.__parts) {
                if (part !== undefined) {
                    part.setValue(values[i]);
                }
                i++;
            }
            for (const part of this.__parts) {
                if (part !== undefined) {
                    part.commit();
                }
            }
        }
        _clone() {
            const fragment = isCEPolyfill ?
                this.template.element.content.cloneNode(true) :
                document.importNode(this.template.element.content, true);
            const stack = [];
            const parts = this.template.parts;
            const walker = document.createTreeWalker(fragment, 133 , null, false);
            let partIndex = 0;
            let nodeIndex = 0;
            let part;
            let node = walker.nextNode();
            while (partIndex < parts.length) {
                part = parts[partIndex];
                if (!isTemplatePartActive(part)) {
                    this.__parts.push(undefined);
                    partIndex++;
                    continue;
                }
                while (nodeIndex < part.index) {
                    nodeIndex++;
                    if (node.nodeName === 'TEMPLATE') {
                        stack.push(node);
                        walker.currentNode = node.content;
                    }
                    if ((node = walker.nextNode()) === null) {
                        walker.currentNode = stack.pop();
                        node = walker.nextNode();
                    }
                }
                if (part.type === 'node') {
                    const part = this.processor.handleTextExpression(this.options);
                    part.insertAfterNode(node.previousSibling);
                    this.__parts.push(part);
                }
                else {
                    this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
                }
                partIndex++;
            }
            if (isCEPolyfill) {
                document.adoptNode(fragment);
                customElements.upgrade(fragment);
            }
            return fragment;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const policy = window.trustedTypes &&
        trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
    const commentMarker = ` ${marker} `;
    class TemplateResult {
        constructor(strings, values, type, processor) {
            this.strings = strings;
            this.values = values;
            this.type = type;
            this.processor = processor;
        }
        getHTML() {
            const l = this.strings.length - 1;
            let html = '';
            let isCommentBinding = false;
            for (let i = 0; i < l; i++) {
                const s = this.strings[i];
                const commentOpen = s.lastIndexOf('<!--');
                isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                    s.indexOf('-->', commentOpen + 1) === -1;
                const attributeMatch = lastAttributeNameRegex.exec(s);
                if (attributeMatch === null) {
                    html += s + (isCommentBinding ? commentMarker : nodeMarker);
                }
                else {
                    html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                        attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                        marker;
                }
            }
            html += this.strings[l];
            return html;
        }
        getTemplateElement() {
            const template = document.createElement('template');
            let value = this.getHTML();
            if (policy !== undefined) {
                value = policy.createHTML(value);
            }
            template.innerHTML = value;
            return template;
        }
    }

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const isPrimitive = (value) => {
        return (value === null ||
            !(typeof value === 'object' || typeof value === 'function'));
    };
    const isIterable = (value) => {
        return Array.isArray(value) ||
            !!(value && value[Symbol.iterator]);
    };
    class AttributeCommitter {
        constructor(element, name, strings) {
            this.dirty = true;
            this.element = element;
            this.name = name;
            this.strings = strings;
            this.parts = [];
            for (let i = 0; i < strings.length - 1; i++) {
                this.parts[i] = this._createPart();
            }
        }
        _createPart() {
            return new AttributePart(this);
        }
        _getValue() {
            const strings = this.strings;
            const l = strings.length - 1;
            const parts = this.parts;
            if (l === 1 && strings[0] === '' && strings[1] === '') {
                const v = parts[0].value;
                if (typeof v === 'symbol') {
                    return String(v);
                }
                if (typeof v === 'string' || !isIterable(v)) {
                    return v;
                }
            }
            let text = '';
            for (let i = 0; i < l; i++) {
                text += strings[i];
                const part = parts[i];
                if (part !== undefined) {
                    const v = part.value;
                    if (isPrimitive(v) || !isIterable(v)) {
                        text += typeof v === 'string' ? v : String(v);
                    }
                    else {
                        for (const t of v) {
                            text += typeof t === 'string' ? t : String(t);
                        }
                    }
                }
            }
            text += strings[l];
            return text;
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element.setAttribute(this.name, this._getValue());
            }
        }
    }
    class AttributePart {
        constructor(committer) {
            this.value = undefined;
            this.committer = committer;
        }
        setValue(value) {
            if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
                this.value = value;
                if (!isDirective(value)) {
                    this.committer.dirty = true;
                }
            }
        }
        commit() {
            while (isDirective(this.value)) {
                const directive = this.value;
                this.value = noChange;
                directive(this);
            }
            if (this.value === noChange) {
                return;
            }
            this.committer.commit();
        }
    }
    class NodePart {
        constructor(options) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.options = options;
        }
        appendInto(container) {
            this.startNode = container.appendChild(createMarker());
            this.endNode = container.appendChild(createMarker());
        }
        insertAfterNode(ref) {
            this.startNode = ref;
            this.endNode = ref.nextSibling;
        }
        appendIntoPart(part) {
            part.__insert(this.startNode = createMarker());
            part.__insert(this.endNode = createMarker());
        }
        insertAfterPart(ref) {
            ref.__insert(this.startNode = createMarker());
            this.endNode = ref.endNode;
            ref.endNode = this.startNode;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            if (this.startNode.parentNode === null) {
                return;
            }
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            const value = this.__pendingValue;
            if (value === noChange) {
                return;
            }
            if (isPrimitive(value)) {
                if (value !== this.value) {
                    this.__commitText(value);
                }
            }
            else if (value instanceof TemplateResult) {
                this.__commitTemplateResult(value);
            }
            else if (value instanceof Node) {
                this.__commitNode(value);
            }
            else if (isIterable(value)) {
                this.__commitIterable(value);
            }
            else if (value === nothing) {
                this.value = nothing;
                this.clear();
            }
            else {
                this.__commitText(value);
            }
        }
        __insert(node) {
            this.endNode.parentNode.insertBefore(node, this.endNode);
        }
        __commitNode(value) {
            if (this.value === value) {
                return;
            }
            this.clear();
            this.__insert(value);
            this.value = value;
        }
        __commitText(value) {
            const node = this.startNode.nextSibling;
            value = value == null ? '' : value;
            const valueAsString = typeof value === 'string' ? value : String(value);
            if (node === this.endNode.previousSibling &&
                node.nodeType === 3 ) {
                node.data = valueAsString;
            }
            else {
                this.__commitNode(document.createTextNode(valueAsString));
            }
            this.value = value;
        }
        __commitTemplateResult(value) {
            const template = this.options.templateFactory(value);
            if (this.value instanceof TemplateInstance &&
                this.value.template === template) {
                this.value.update(value.values);
            }
            else {
                const instance = new TemplateInstance(template, value.processor, this.options);
                const fragment = instance._clone();
                instance.update(value.values);
                this.__commitNode(fragment);
                this.value = instance;
            }
        }
        __commitIterable(value) {
            if (!Array.isArray(this.value)) {
                this.value = [];
                this.clear();
            }
            const itemParts = this.value;
            let partIndex = 0;
            let itemPart;
            for (const item of value) {
                itemPart = itemParts[partIndex];
                if (itemPart === undefined) {
                    itemPart = new NodePart(this.options);
                    itemParts.push(itemPart);
                    if (partIndex === 0) {
                        itemPart.appendIntoPart(this);
                    }
                    else {
                        itemPart.insertAfterPart(itemParts[partIndex - 1]);
                    }
                }
                itemPart.setValue(item);
                itemPart.commit();
                partIndex++;
            }
            if (partIndex < itemParts.length) {
                itemParts.length = partIndex;
                this.clear(itemPart && itemPart.endNode);
            }
        }
        clear(startNode = this.startNode) {
            removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
        }
    }
    class BooleanAttributePart {
        constructor(element, name, strings) {
            this.value = undefined;
            this.__pendingValue = undefined;
            if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
                throw new Error('Boolean attributes can only contain a single expression');
            }
            this.element = element;
            this.name = name;
            this.strings = strings;
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const value = !!this.__pendingValue;
            if (this.value !== value) {
                if (value) {
                    this.element.setAttribute(this.name, '');
                }
                else {
                    this.element.removeAttribute(this.name);
                }
                this.value = value;
            }
            this.__pendingValue = noChange;
        }
    }
    class PropertyCommitter extends AttributeCommitter {
        constructor(element, name, strings) {
            super(element, name, strings);
            this.single =
                (strings.length === 2 && strings[0] === '' && strings[1] === '');
        }
        _createPart() {
            return new PropertyPart(this);
        }
        _getValue() {
            if (this.single) {
                return this.parts[0].value;
            }
            return super._getValue();
        }
        commit() {
            if (this.dirty) {
                this.dirty = false;
                this.element[this.name] = this._getValue();
            }
        }
    }
    class PropertyPart extends AttributePart {
    }
    let eventOptionsSupported = false;
    (() => {
        try {
            const options = {
                get capture() {
                    eventOptionsSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', options, options);
            window.removeEventListener('test', options, options);
        }
        catch (_e) {
        }
    })();
    class EventPart {
        constructor(element, eventName, eventContext) {
            this.value = undefined;
            this.__pendingValue = undefined;
            this.element = element;
            this.eventName = eventName;
            this.eventContext = eventContext;
            this.__boundHandleEvent = (e) => this.handleEvent(e);
        }
        setValue(value) {
            this.__pendingValue = value;
        }
        commit() {
            while (isDirective(this.__pendingValue)) {
                const directive = this.__pendingValue;
                this.__pendingValue = noChange;
                directive(this);
            }
            if (this.__pendingValue === noChange) {
                return;
            }
            const newListener = this.__pendingValue;
            const oldListener = this.value;
            const shouldRemoveListener = newListener == null ||
                oldListener != null &&
                    (newListener.capture !== oldListener.capture ||
                        newListener.once !== oldListener.once ||
                        newListener.passive !== oldListener.passive);
            const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
            if (shouldRemoveListener) {
                this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            if (shouldAddListener) {
                this.__options = getOptions(newListener);
                this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
            }
            this.value = newListener;
            this.__pendingValue = noChange;
        }
        handleEvent(event) {
            if (typeof this.value === 'function') {
                this.value.call(this.eventContext || this.element, event);
            }
            else {
                this.value.handleEvent(event);
            }
        }
    }
    const getOptions = (o) => o &&
        (eventOptionsSupported ?
            { capture: o.capture, passive: o.passive, once: o.once } :
            o.capture);

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    class DefaultTemplateProcessor {
        handleAttributeExpressions(element, name, strings, options) {
            const prefix = name[0];
            if (prefix === '.') {
                const committer = new PropertyCommitter(element, name.slice(1), strings);
                return committer.parts;
            }
            if (prefix === '@') {
                return [new EventPart(element, name.slice(1), options.eventContext)];
            }
            if (prefix === '?') {
                return [new BooleanAttributePart(element, name.slice(1), strings)];
            }
            const committer = new AttributeCommitter(element, name, strings);
            return committer.parts;
        }
        handleTextExpression(options) {
            return new NodePart(options);
        }
    }
    const defaultTemplateProcessor = new DefaultTemplateProcessor();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    function templateFactory(result) {
        let templateCache = templateCaches.get(result.type);
        if (templateCache === undefined) {
            templateCache = {
                stringsArray: new WeakMap(),
                keyString: new Map()
            };
            templateCaches.set(result.type, templateCache);
        }
        let template = templateCache.stringsArray.get(result.strings);
        if (template !== undefined) {
            return template;
        }
        const key = result.strings.join(marker);
        template = templateCache.keyString.get(key);
        if (template === undefined) {
            template = new Template(result, result.getTemplateElement());
            templateCache.keyString.set(key, template);
        }
        templateCache.stringsArray.set(result.strings, template);
        return template;
    }
    const templateCaches = new Map();

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const parts = new WeakMap();
    const render = (result, container, options) => {
        let part = parts.get(container);
        if (part === undefined) {
            removeNodes(container, container.firstChild);
            parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
            part.appendInto(container);
        }
        part.setValue(result);
        part.commit();
    };

    /**
     * @license
     * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    if (typeof window !== 'undefined') {
        (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.3.0');
    }
    const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

    const Tabbale = ({ get }) => {
        const cities = get('cities');
        return html `<ul class="nav nav-tabs" style="margin:1em auto 0;width:fit-content">${cities.map(city => html `<li class="${cities.indexOf(city) === 0 ? 'active' : ''}"><a href="#tab-${city}" data-toggle="tab">${translateCityName(city)}</a></li>`)}</ul><div class="tab-content">${cities.map(city => html `<div class="tab-pane ${cities.indexOf(city) === 0 ? 'active' : ''}" id="tab-${city}"></div>`)}</div>`;
    };
    const translateCityName = (cityName) => document.querySelector(`option[value="${cityName}"]`).innerHTML;

    const App = (state) => {
        return html `<div id="progressWrapper"></div>${state.get('city') !== undefined
        ? html `<div id="tables"></div>`
        : html `<div class="tabbable">${Tabbale(state)}</div>`}`;
    };

    /**
     * @license
     * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
     * This code may only be used under the BSD style license found at
     * http://polymer.github.io/LICENSE.txt
     * The complete set of authors may be found at
     * http://polymer.github.io/AUTHORS.txt
     * The complete set of contributors may be found at
     * http://polymer.github.io/CONTRIBUTORS.txt
     * Code distributed by Google as part of the polymer project is also
     * subject to an additional IP rights grant found at
     * http://polymer.github.io/PATENTS.txt
     */
    const previousStylePropertyCache = new WeakMap();
    const styleMap = directive((styleInfo) => (part) => {
        if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
            part.committer.name !== 'style' || part.committer.parts.length > 1) {
            throw new Error('The `styleMap` directive must be used in the style attribute ' +
                'and must be the only part in the attribute.');
        }
        const { committer } = part;
        const { style } = committer.element;
        let previousStyleProperties = previousStylePropertyCache.get(part);
        if (previousStyleProperties === undefined) {
            style.cssText = committer.strings.join(' ');
            previousStylePropertyCache.set(part, previousStyleProperties = new Set());
        }
        previousStyleProperties.forEach((name) => {
            if (!(name in styleInfo)) {
                previousStyleProperties.delete(name);
                if (name.indexOf('-') === -1) {
                    style[name] = null;
                }
                else {
                    style.removeProperty(name);
                }
            }
        });
        for (const name in styleInfo) {
            previousStyleProperties.add(name);
            if (name.indexOf('-') === -1) {
                style[name] = styleInfo[name];
            }
            else {
                style.setProperty(name, styleInfo[name]);
            }
        }
    });

    const Progress = ({ get }) => {
        const btn = document.getElementById('btnQuerySeat');
        const label = document.querySelector('label[for="centerProvinceCity"]');
        const barStyle = {
            margin: '1em auto 0',
            width: `${btn.offsetLeft - label.offsetLeft + label.offsetWidth}px`
        };
        const wellStyle = Object.assign(Object.assign({}, barStyle), { textAlign: 'center' });
        const barWidth = {
            width: `${get('isComplete') ? 100 : get('progress')}%`
        };
        return html `<div class="well" style="${styleMap(wellStyle)}"><div id="statusMsg">${get('isComplete')
        ? html `查询完成，找到 ${get('availableSeats')}个可预定考位${get('err') > 0
            ? html `。请求失败 ${get('err')}次`
            : nothing}`
        : html `正在查询中，剩余 ${get('cities') !== undefined
            ? html `${get('citiesLeft')}个城市 `
            : nothing}${get('datesLeft')}个日期`}</div><div id="progress" class="progress progress-striped" style="${styleMap(barStyle)}"><div class="bar" style="${styleMap(barWidth)}"></div></div></div>`;
    };

    const Table = ({ testDate, testSeats }) => html `<thead><tr style="background-color:#933"><th colspan="4"><span style="color:#fff">考试日期：${testDate}</span><span style="margin-left:.5em;color:#fff"><i class="fa fa-calendar-check-o" aria-hidden="true"></i></span><span style="color:#fff;float:right">考试时间：${firstKeyOf(testSeats).split('|')[0]}<span style="padding-left:30px">最晚到达时间：${firstKeyOf(testSeats).split('|')[2]}</span></span></th></tr><tr><th style="${styleMap(stylesMiddle)}" width="20%">城市</th><th style="${styleMap(stylesMiddle)}">考点</th><th style="text-align:center" width="20%">费用<br>(RMB￥)</th><th style="${styleMap(stylesMiddle)}" width="10%">考位</th></tr></thead><tbody>${testSeats[firstKeyOf(testSeats)].map((seat) => html `${rowTpl(seat)}`)}</tbody>`;
    const rowTpl = (seat) => html `<tr><td style="${styleMap(stylesMiddle)}">${isMunicipality(seat.provinceCn)
    ? html `${seat.cityCn}`
    : html `${seat.provinceCn} ${seat.cityCn}`}</td><td style="${styleMap(stylesMiddle)}"><span><a href="javascript:void(0);" onclick='showTestCenterInfo("考场信息","${seat.centerCode}")' style="text-decoration:underline">${seat.centerCode}</a></span><span style="margin-left:8px">${seat.centerNameCn}</span></td><td style="${styleMap(stylesMiddle)}">${seat.lateRegFlag === 'Y'
    ? html `<span style="color:red">*</span>`
    : nothing} <span><strong>${formatCurrency(seat.testFee / 100)}</strong></span> ${seat.lateRegFlag === 'Y' ? html `<br>(已包含逾期费附加费)` : nothing}</td><td style="${styleMap(stylesMiddle)}">${seat.seatStatus === -1
    ? '已截止'
    : seat.seatStatus === 1
        ? '有名额'
        : '名额暂满'}</td></tr>`;
    const stylesMiddle = {
        textAlign: 'center',
        verticalAlign: 'middle'
    };
    const formatCurrency = (value) => 'RMB￥' + value.toFixed(2);

    const Checkbox = () => html `<span id="toggleAllCheckboxesBtnWrapper" style="float:right;font-size:13px;text-decoration:underline"><a href="javascript:void(0);" @click="${toggleCheck}">全选/全不选</a> </span>${loopProvinceGroup()}`;
    const toggleCheck = () => {
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        const notAllChecked = someElOf(allCheckboxes, box => !box.checked);
        forEachElOf(allCheckboxes, box => {
            box.checked = notAllChecked;
        });
    };
    const loopProvinceGroup = () => {
        const provinceGroups = document.querySelectorAll('#centerProvinceCity optgroup');
        return mapElOf(provinceGroups, (provinceGroup) => {
            const provinceName = provinceGroup.label;
            const cities = provinceGroup.childNodes;
            return html `<div>${mapElOf(cities, (city, index) => html `${isMunicipality(city.label)
            ? nothing
            : html `${index === 0
                ? html `<span class="muted" style="${provinceName.length === 3
                    ? ''
                    : 'margin-right:1em;'}">${provinceName}：</span>`
                : nothing}`}<span style="${isMunicipality(city.label) ? 'margin-left:4em;' : ''}"><input type="checkbox" id="${city.value}" style="margin:0 0 2px"><label for="${city.value}" style="display:inline;margin:${index === cities.length - 1
            ? '0 0 0 4px'
            : '0 8px 0 4px'}">${city.label}</label></span>`)}</div>`;
        });
    };

    const expandBtn = () => html `<button id="expandBtn" class="btn" @click="${() => document.getElementById('checkboxes').classList.toggle('hide')}" style="margin-left:6px">展开多选</button>`;
    const queryBtn = () => html `<button id="queryBtn" class="btn btn-primary" style="margin-left:13px">查询全部日期</button>`;

    const PityMsg = () => html `<div class="alert" style="margin:0 auto 0;width:fit-content"><button type="button" class="close" data-dismiss="alert">×</button> <strong>真遗憾！</strong>没有找到可预定的考位<span style="margin-left:4px;font-size:20px">😨</span></div>`;

    const app = (state) => {
        document.getElementById('checkboxes').classList.add('hide');
        const wrapper = document.getElementById('qrySeatResult');
        render(nothing, wrapper);
        render(App(state), wrapper);
    };
    const progress = (state) => {
        const wrapper = document.getElementById('progressWrapper');
        if (wrapper !== null) {
            render(Progress(state), wrapper);
        }
    };
    const table = (data, { get }) => {
        insertComponent({
            component: Table(data),
            wrapperTag: 'table',
            wrapperAttr: {
                id: `${get('currentCity')}[${get('currentDate')}]`,
                class: 'table table-bordered',
                style: 'margin-top:12px;font-size:16px;'
            },
            target: document.getElementById(`${get('city') !== undefined ? 'tables' : `tab-${get('currentCity')}`}`),
            position: 'beforeend'
        });
    };
    const checkbox = () => {
        const provinceGroup = document.querySelectorAll('#centerProvinceCity optgroup');
        const provinceNum = provinceGroup.length;
        if (!untilAvailable(provinceNum, checkbox)) {
            return;
        }
        if (!untilAvailable(provinceGroup[provinceNum - 1].label === '浙江', checkbox)) {
            return;
        }
        const selectCity = document.getElementById('centerProvinceCity');
        const formWrapper = selectCity.parentElement.parentElement.parentElement;
        insertComponent({
            component: Checkbox(),
            wrapperTag: 'div',
            wrapperAttr: {
                id: 'checkboxes',
                class: 'hide well',
                style: `max-width:fit-content;margin:4px 0 0 ${selectCity.offsetLeft - selectCity.parentElement.offsetLeft}px;padding:1em;`
            },
            target: formWrapper,
            position: 'beforeend'
        });
    };
    const expandBtn$1 = () => {
        insertComponent({
            component: expandBtn(),
            wrapperAttr: { id: 'expandBtnWrapper' },
            target: document.getElementById('centerProvinceCity')
        });
    };
    const queryBtn$1 = () => {
        insertComponent({
            component: queryBtn(),
            wrapperAttr: { id: 'queryBtnWrapper' },
            target: document.getElementById('expandBtn')
        });
    };
    const pityMsg = (state) => {
        render(PityMsg(), document.getElementById(`tab-${state.get('currentCity')}`));
    };
    function insertComponent({ component, wrapperTag = 'span', wrapperAttr, target, position = 'afterend' }) {
        target.insertAdjacentHTML(position, `<${wrapperTag} ${loopAttr(wrapperAttr)}></${wrapperTag}>`);
        render(component, document.getElementById(wrapperAttr.id));
        function loopAttr(attrs) {
            return Object.keys(attrs)
                .map(attr => `${attr}="${attrs[attr]}"`)
                .join(' ');
        }
    }

    const queryBtn$2 = {
        getEl() {
            return document.getElementById('queryBtn');
        },
        onClick(fn) {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            this.getEl().addEventListener('click', fn, { once: true });
        }
    };
    const selectedCity = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const checkedCities = mapElOf(checkboxes, (box) => box.checked ? box.id : null).filter(Boolean);
        const isExpanded = !document
            .getElementById('checkboxes')
            .classList.contains('hide');
        if (checkedCities.length > 0 && isExpanded) {
            return checkedCities;
        }
        else {
            const selectedCity = document.getElementById('centerProvinceCity');
            return selectedCity.value;
        }
    };
    const availableDates = () => {
        const options = document.getElementById('testDays')
            .childNodes;
        return mapElOf(options, (option) => {
            const day = option.value;
            if (day !== undefined && day !== '-1') {
                return day;
            }
        }).filter(Boolean);
    };

    class StateData {
        constructor() {
            this.progress = 0;
            this.availableSeats = 0;
            this.err = 0;
            this.isComplete = false;
            this.dates = availableDates();
            const city = selectedCity();
            if (city instanceof Array && city.length !== 1) {
                this.cities = city;
            }
            else if (city === '-1') {
                return;
            }
            else {
                const singleCity = city instanceof Array ? city[0] : city;
                this.city = singleCity;
            }
            this.sum =
                this.dates.length * (this.city !== undefined ? 1 : this.cities.length);
        }
    }
    class State {
        constructor() {
            this.data = new StateData();
            this.get = (prop) => {
                return this.data[prop];
            };
            this.set = (newData, update = true) => {
                Object.assign(this.data, newData);
                if (update) {
                    this.update();
                }
            };
        }
        update() {
            if (this.data.cities !== undefined) {
                this.data.citiesLeft = calcLeft(this.data.currentCity, this.data.cities);
            }
            this.data.datesLeft = calcLeft(this.data.currentDate, this.data.dates);
            this.data.progress =
                100 -
                    (((this.data.cities !== undefined
                        ? this.data.citiesLeft * this.data.dates.length
                        : 0) +
                        this.data.datesLeft) /
                        this.data.sum) *
                        100;
            progress(this);
        }
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    var toString = Object.prototype.toString;
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }
    function isUndefined(val) {
      return typeof val === 'undefined';
    }
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }
    function isString(val) {
      return typeof val === 'string';
    }
    function isNumber(val) {
      return typeof val === 'number';
    }
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }
      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }
    function forEach(obj, fn) {
      if (obj === null || typeof obj === 'undefined') {
        return;
      }
      if (typeof obj !== 'object') {
        obj = [obj];
      }
      if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }
    function merge() {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }
      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }
    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }
    var buildURL = function buildURL(url, params, paramsSerializer) {
      if (!params) {
        return url;
      }
      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];
        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }
          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }
          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });
        serializedParams = parts.join('&');
      }
      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }
      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };
    var InterceptorManager_1 = InterceptorManager;

    var transformData = function transformData(data, headers, fns) {
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });
      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }
      error.request = request;
      error.response = response;
      error.isAxiosError = true;
      error.toJSON = function toJSON() {
        return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));
              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }
              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }
              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }
              if (secure === true) {
                cookie.push('secure');
              }
              document.cookie = cookie.join('; ');
            },
            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },
            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    var isAbsoluteURL = function isAbsoluteURL(url) {
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;
      if (!headers) { return parsed; }
      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });
      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;
          function resolveURL(url) {
            var href = url;
            if (msie) {
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute('href', href);
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }
          originURL = resolveURL(window.location.href);
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;
        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type'];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }
        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };
          settle(resolve, reject, response);
          request = null;
        };
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }
          reject(createError('Request aborted', config, 'ECONNABORTED', request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(createError('Network Error', config, null, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
            request));
          request = null;
        };
        if (utils.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }
        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        }
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }
        if (config.cancelToken) {
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }
            request.abort();
            reject(cancel);
            request = null;
          });
        }
        if (!requestData) {
          requestData = null;
        }
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }
    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        adapter = xhr;
      }
      return adapter;
    }
    var defaults = {
      adapter: getDefaultAdapter(),
      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],
      transformResponse: [function transformResponse(data) {
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {  }
        }
        return data;
      }],
      timeout: 0,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };
    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };
    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });
    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });
    var defaults_1 = defaults;

    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);
      config.headers = config.headers || {};
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );
      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );
      var adapter = config.adapter || defaults_1.adapter;
      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );
        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }
        return Promise.reject(reason);
      });
    };

    var mergeConfig = function mergeConfig(config1, config2) {
      config2 = config2 || {};
      var config = {};
      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];
      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }
      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }
      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });
      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);
      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });
      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });
      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);
      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });
      utils.forEach(otherKeys, mergeDeepProperties);
      return config;
    };

    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }
    Axios.prototype.request = function request(config) {
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }
      config = mergeConfig(this.defaults, config);
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);
      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });
      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    };
    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });
    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });
    var Axios_1 = Axios;

    function Cancel(message) {
      this.message = message;
    }
    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };
    Cancel.prototype.__CANCEL__ = true;
    var Cancel_1 = Cancel;

    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }
      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });
      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          return;
        }
        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };
    var CancelToken_1 = CancelToken;

    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);
      utils.extend(instance, Axios_1.prototype, context);
      utils.extend(instance, context);
      return instance;
    }
    var axios = createInstance(defaults_1);
    axios.Axios = Axios_1;
    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    };
    axios.Cancel = Cancel_1;
    axios.CancelToken = CancelToken_1;
    axios.isCancel = isCancel;
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;
    var axios_1 = axios;
    var _default = axios;
    axios_1.default = _default;

    var axios$1 = axios_1;

    const getData = ({ get }) => __awaiter(void 0, void 0, void 0, function* () {
        const city = get('currentCity');
        const testDay = get('currentDate');
        const { data } = yield axios$1.get('testSeat/queryTestSeats', {
            params: { city: city, testDay: testDay }
        });
        return filterSeats(data);
    });
    const filterSeats = (data) => {
        if (data.status) {
            const dataDate = Object.keys(data.testSeats)[0];
            const seatDetails = data.testSeats[dataDate];
            const filtered = seatDetails.filter(seatDetail => seatDetail.seatStatus);
            const availableSeats = filtered.length;
            if (availableSeats > 0) {
                data.testSeats[dataDate] = filtered;
                data.availableSeats = availableSeats;
                return data;
            }
        }
        return null;
    };

    const query = () => __awaiter(void 0, void 0, void 0, function* () {
        const state = new State();
        const { get, set } = state;
        if (get('city') === undefined && get('cities') === undefined) {
            layer.msg('请选择考点所在城市', { time: 2000, icon: 0 });
            queryBtn$2.onClick(query);
            return;
        }
        yield start();
        function start() {
            return __awaiter(this, void 0, void 0, function* () {
                queryBtn$2.getEl().innerText = '停止当前查询';
                queryBtn$2.onClick(end);
                app(state);
                if (get('city') !== undefined) {
                    set({ currentCity: get('city') });
                    yield single();
                }
                else {
                    yield multi();
                }
                end();
            });
        }
        function end() {
            set({ isComplete: true });
            queryBtn$2.getEl().innerText = '查询全部日期';
            queryBtn$2.onClick(query);
        }
        function multi() {
            return __awaiter(this, void 0, void 0, function* () {
                for (const city of get('cities')) {
                    set({ currentCity: city });
                    yield single();
                    if (get('isComplete')) {
                        break;
                    }
                    if (get('citiesLeft') > 0) {
                        yield sleep(2000);
                    }
                }
            });
        }
        function single() {
            return __awaiter(this, void 0, void 0, function* () {
                const initialSeatsNum = get('availableSeats');
                for (const testDay of get('dates')) {
                    set({ currentDate: testDay });
                    try {
                        const data = yield getData(state);
                        if (data !== null) {
                            table(data, state);
                            set({ availableSeats: get('availableSeats') + data.availableSeats }, false);
                        }
                    }
                    catch (_a) {
                        set({ err: get('err') + 1 }, false);
                    }
                    if (get('isComplete')) {
                        break;
                    }
                    if (get('datesLeft') > 0) {
                        yield sleep(2000);
                    }
                }
                if (get('cities') !== undefined &&
                    get('availableSeats') === initialSeatsNum) {
                    pityMsg(state);
                }
            });
        }
    });

    observeMutation(document.getElementById('wg_center'), () => {
        if (window.location.href.toString().split('#!')[1] === '/testSeat') {
            adjustStyle();
            checkbox();
            expandBtn$1();
            queryBtn$1();
            queryBtn$2.onClick(query);
        }
    }, { childList: true });

}());
