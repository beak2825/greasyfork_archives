// ==UserScript==
// @name              JMUL
// @name:zh-CN        自用脚本工具库
// @namespace         https://greasyfork.org/users/34556
// @version           0.1.2
// @description       utilities for monkey scripts
// @description:zh-CN 工具库
// @author            jferroal
// @grant             GM_xmlhttpRequest
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function selectable(je) {
    je.select = select;
    je.getSelection = getSelection;
    je.copyToClipboard = copyToClipboard;
    return je;
    function select(start, end) {
        if (!je.element.focus) {
            console.error('this element can not be selected.');
        }
        je.element.focus();
        start = !!start ? start : 0;
        end = !!end ? end : -1;
        je.element.setSelectionRange(start, end);
    }

    function getSelection(start, end) {
        start = !start ? 0 : start;
        // default will get the selected text
        let result = String.prototype.slice.apply(document.getSelection(), [start, end]);
        // if not selected, get current element's text
        if (!result) {
            this.select(start, end);
            result = String.prototype.slice.apply(document.getSelection(), [start, end === -1 ? end += 1 : end]);
        }
        return result;
    }

    function copyToClipboard(start, end) {
        start = !start ? 0 : start;
        document.getSelection().removeAllRanges();
        const range = document.createRange();
        range.setStart(je.element, start);
        range.setEnd(je.element, end);
        range.selectNode(je.element);
        document.getSelection().addRange(range);
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Oops, unable to copy');
        }
        document.getSelection().removeAllRanges();
    }
}

function addParser(request, parser) {
    request.parse = parse;
    request.sendAndParse = function () {
        return request.send().then((responseText) => {
            return parse(responseText);
        });
    };
    return request;

    function parse(responseText) {
        return new Promise((resolve) => {
            const result = {};
            for (const key of Object.keys(parser.rules)) {
                result[key] = parser.rules[key](responseText);
            }
            resolve(result);
        });
    }
}

module.exports = {
    selectable: selectable,
    addParser: addParser,
};
},{}],2:[function(require,module,exports){
function toArray(s) {
    return Array.from(s, (v) => v);
}

class JMElement {
    constructor(tagOrElement) {
        this.element = tagOrElement;
        if (typeof tagOrElement === 'string') {
            this.element = document.createElement(tagOrElement);
        }
    }

    setAttribute(attrName, value) {
        this.element.setAttribute(attrName, value);
    }

    getAttribute(attrName) {
        return this.element.getAttribute(attrName);
    }

    setStyle(styleName, value) {
        this.element.style[styleName] = value;
    }

    setCss(styles) {
        if (!styles) return;
        for (const styleName in styles) {
            if (!styles.hasOwnProperty(styleName)) return;
            this.setStyle(styleName, styles[styleName]);
        }
    }

    setInnerHTML(value) {
        this.element.innerHTML = value;
    }
    setInnerText(value) {
	this.element.innerText = value;
    }

    setId(id) {
        this.setAttribute('id', id);
    }

    _setClass(_class) {
        this.setAttribute('class', _class);
    }

    addClass(newClass) {
        const oldClassStr = this.getAttribute('class');
        if (oldClassStr.indexOf(newClass) < 0) {
            this._setClass(oldClassStr + ' ' + newClass);
        }
        return this;
    }

    removeClass(className) {
        const oldClassStr = this.getAttribute('class');
        const idx = oldClassStr.indexOf(className);
        if (idx > -1) {
            const tmp = toArray(oldClassStr);
            tmp.splice(idx, className.length);
            this._setClass(tmp.join(''));
        }
        return this;
    }

    get innerHTML() {
        return this.element.innerHTML;
    }

    get innerText() {
        return this.element.innerText;
    }

    setValue(value) {
        this.element.value = value;
    }

    position(type) {
        const rect = this.element.getBoundingClientRect();
        switch (type) {
            case 'left-top':
                return {x: rect.left, y: rect.top};
            case 'right-top':
                return {x: rect.right, y: rect.top};
            case 'left-bottom':
                return {x: rect.left, y: rect.bottom};
            case 'right-bottom':
                return {x: rect.right, y: rect.bottom};
            case 'center':
                return {x: rect.left + rect.height / 2, y: rect.top + rect.height / 2};
        }
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    appendChild(child) {
        this.element.appendChild(child.element || child);
    }

    listen(eventName, fn) {
        JMElement.addEvent(this.element, eventName, fn);
    }

    toString() {
        return this.element.toString();
    }

    valueOf() {
        return this.element;
    }

    get value() {
        return this.element.value;
    }

    static query(selector, index) {
        const els = document.querySelectorAll(selector);
        if (!els) throw new Error('element not found. ');
        if (index === -1) return els.map((el) => new JMElement(el));
        if (index === undefined) return new JMElement(els[0]);
        if (els.length < index + 1) throw new Error('index element not found. ');
        return new JMElement(els[index]);
    }

    static addEvent(element, eventName, fn) {
        element.addEventListener(eventName, fn, false);
    }

    static getSelectedPosition(type = 'left-top') {
        const focusNode = document.getSelection().focusNode;
        if (!focusNode) throw new Error('no selection, should not create node');
        const focusParentElement = focusNode.parentElement;
        return (new JMElement(focusParentElement)).position(type);
    }
}

module.exports = JMElement;


},{}],3:[function(require,module,exports){
(function() {
    window.JMUL = {
    Element: require('./element'),
    Decorator: require('./decorator'),
    Request: require('./request').Request,
    Header: require('./request').Header,
    Parser: require('./parser'),
    UI: require('./ui/main'),
};
})();
},{"./decorator":1,"./element":2,"./parser":4,"./request":5,"./ui/main":7}],4:[function(require,module,exports){

const helper = {
    isEmpty: a => !a || !a.length,
    toArray: s => Array.from(s, (v) => v),
};

class JMXMLResult {
    constructor(tagName, innerText, matches) {
        this.tagName = tagName;
        this.innerText = innerText;
        this.matches = matches;
    }
}

class JMParser {
    constructor() {
        this.rules = {};
        this.filters = {};
    }

    addRule(key, pattern) {
        const tmp = {
            tagName: '',
            attrName: '',
            attrValue: '',
            prevCh: '',
            filterName: '',
            filterParams: [],
            currentFilterParams: ''
        };
        this.rules[key] = helper.toArray(pattern).reduce((res, ch, idx) => {
            switch (ch) {
                case ' ':
                    break;
                case '(':
                    tmp.prevCh = ch;
                    break;
                case '@':
                    if (!tmp.tagName) throw new Error('No tagName. ');
                    tmp.prevCh = ch;
                    break;
                case ')':
                    res = JMParser.generate(tmp.tagName, JMParser.attr(tmp.attrName, tmp.attrValue));
                    tmp.prevCh = tmp.tagName = tmp.attrName = tmp.attrValue = '';
                    break;
                case '|':
                    tmp.prevCh = '|';
                    const filter = this.filters[tmp.filterName];
                    if (filter) {
                        res = filter(res, ...tmp.filterParams);
                    }
                    tmp.filterName = tmp.currentFilterParams = '';
                    tmp.filterParams = [];
                    break;
                case ',':
                    tmp.prevCh = ',';
                    if (tmp.currentFilterParams) {
                        tmp.filterParams.push(tmp.currentFilterParams);
                    }
                    tmp.currentFilterParams = '';
                    break;
                default:
                    if (tmp.prevCh === '@') {
                        tmp.attrName += ch;
                    } else if (tmp.prevCh === '(') {
                        tmp.attrValue += ch;
                    } else if(tmp.prevCh === '|') {
                        tmp.filterName += ch;
                    } else if (tmp.prevCh === ',') {
                        tmp.currentFilterParams += ch;
                    } else {
                        tmp.tagName += ch;
                    }
                    break;
            }
            return res;
        }, undefined);
    }

    addFilter(name, fn) {
        this.filters[name] = (prevFn, ...params) => {
            return (responseText) => {
                const parseRes = prevFn(responseText);
                return fn(parseRes, ...params);
            }
        }
    }

    static generate(tagName, attr) {
        const pattern = JMParser.tag(tagName, attr);
        return (responseText) => {
            const allMatch = responseText.match(pattern);
            if (helper.isEmpty(allMatch)) return {found: false};
            return allMatch.reduce((res, matchItem) => {
                const execRes = pattern.exec(matchItem);
                pattern.lastIndex = 0;
                const matchRes = execRes && execRes.slice(1) || [];
                return res.concat([new JMXMLResult(tagName, matchRes[1], matchRes)]);
            }, []);
        }
    }

    static tag(name, attr) {
        return new RegExp(`${name}[\\s\\S]*?${attr}[\\s\\S]*?>([\\s\\S]*?)<\/${name}>`, 'gi');
    }

    static attr(name, value) {
        return `${name}="(${value})"`;
    }
}

module.exports = JMParser;
},{}],5:[function(require,module,exports){
GM_xmlhttpRequest = window.GM_xmlhttpRequest;

const FnMethodNameMap = {
    'abort': 'onabort',
    'failed': 'onerror',
    'fail': 'onerror',
    'error': 'onerror',
    'loaded': 'onload',
    'load': 'onload',
    'success': 'onload',
    'onload': 'onload',
    'progress': 'onprogress',
    'onprogress': 'onprogress',
    'ready': 'onreadystatechange',
    'readystatechange': 'onreadystatechange',
    'onreadystatechange': 'onreadystatechange',
    'timeout': 'ontimeout',
    'ontimeout': 'ontimeout',
};

const MethodNameMap = {
    'get': 'GET',
    'Get': 'GET',
    'GET': 'GET',
    'post': 'POST',
    'Post': 'POST',
    'POST': 'POST',
    'head': 'HEAD',
    'Head': 'HEAD',
    'HEAD': 'HEAD',
    'delete': 'DELETE',
    'Delete': 'DELETE',
    'DELETE': 'DELETE',
    'patch': 'PATCH',
    'Patch': 'PATCH',
    'PATCH': 'PATCH',
    'put': 'PUT',
    'Put': 'PUT',
    'PUT': 'PUT',
};

class JMRequestHeader {
    constructor(headers) {
        if (headers instanceof JMRequestHeader) {
            headers = headers.value();
        }
        this.headerObj = headers;
    }

    option(key, value) {
        this.headerObj[key] = value;
        return this;
    } // chain
    setAccept(value) {
        this._accept = this.headerObj.accept = value;
        return this;
    }

    setAcceptCharset(value) {
        this.acceptCharset = this.headerObj['Accept-Charset'] = value;
        return this;
    }

    setAcceptEncoding(value) {
        this.acceptEncoding = this.headerObj['Accept-Encoding'] = value;
        return this;
    }

    setAge(value) {
        this.age = this.headerObj.age = value;
        return this;
    }

    setAuthorization(value) {
        this.authorization = this.headerObj.Authorization = value;
        return this;
    }

    setContentEncoding(value) {
        this.contentEncoding = this.headerObj['Content-Encoding'] = value;
        return this;
    }

    setContentLength(value) {
        this.contentLength = this.headerObj['Content-Length'] = value;
        return this;
    }

    setContentType(value) {
        this.contentType = this.headerObj['Content-Type'] = value;
        return this;
    }

    setCookie(value) {
        this.cookie = this.headerObj.Cookie = value;
        return this;
    }

    setUA(value) {
        this.ua = this.headerObj['User-Agent'] = value;
        return this;
    }

    value() {
        return this.headerObj;
    }
}

class JMRequest {
    constructor(options) {
        this._method = options.method && MethodNameMap[options.method] || 'GET';
        this._url = options.url || '';
        this.options = {};
        this.options.headers = new JMRequestHeader(options.headers || {});
        for (let key of Object.keys(options)) {
            if (FnMethodNameMap[key] && typeof options[key] === 'function') {
                this.options[FnMethodNameMap[key]] = options[key];
            }
        }
        this.options.data = this.handleRequestData(options.data)
    }

    handleRequestData(data) {
        if (!data) return '';
        const contentType = this.options.headers.contentType;
        if (!contentType || contentType === 'application/json') {
            return JMRequest.toJsonData(data);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            return JMRequest.toFormData(data);
        } else {
            // treat other as plain/text, do not support multipart/form-data
            return data.toString();
        }
    }

    setMethod(_method) {
        this._method = MethodNameMap[_method];
        return this;
    }

    setUrl(_url) {
        this._url = _url;
        return this;
    }

    setHeaders(headers) {
        this.options.headers = headers;
        return this;
    }

    setData(obj) {
        this.options.data = this.handleRequestData(obj);
        return this;
    }

    load(fn) {
        this.options.onload = fn;
        return this;
    }

    error(fn) {
        this.options.onerror = fn;
        return this;
    }

    timeout(fn) {
        this.options.ontimeout = fn;
        return this;
    }

    readyStateChange(fn) {
        this.options.onreadystatechange = fn;
        return this;
    }

    abort(fn) {
        this.options.onabort = fn;
        return this;
    }

    progress(fn) {
        this.options.onprogress = fn;
        return this;
    }

    send() {
        return JMRequest.request(this._method, this._url, this.options);
    }

    static toFormData(data) {
        if (typeof data === 'string') {
            return data;
        } else {
            let result = '';
            for (let key of Object.keys(data)) {
                result += key + '=' + data[key] + '&';
            }
            return result.slice(0, -1);
        }
    }

    static toJsonData(data) {
        if (typeof data === 'object') {
            return JSON.stringify(data);
        } else {
            return data;
        }
    }

    static request(method, url, options) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: MethodNameMap[method],
                url: url,
                headers: options.headers.value(),
                data: options.data,
                onreadystatechange: (response) => {
                    if (!options.onreadystatechange) return console.log('on ready state change. ');
                    const fn = options.onreadystatechange;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                },
                onabort: (response) => {
                    if (!options.onabort) {
                        console.error('on abort. ');
                        reject({cause: 'abort'});
                    } else {
                        const fn = options.onabort;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }

                },
                onerror: (response) => {
                    if (!options.onerror) {
                        console.error('on error. ');
                        reject({cause: 'error', response: response});
                    } else {
                        const fn = options.onerror;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }
                },
                onprogress: (response) => {
                    if (!options.onprogress) return console.log('on progress. ');
                    const fn = options.onprogress;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                }
                ,
                ontimeout: (response) => {
                    if (!options.ontimeout) {
                        console.error('on timeout. ');
                        reject({cause: 'timeout', response: response});
                    }
                    const fn = options.ontimeout;
                    (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                        resolve(res);
                    });
                },
                onload: (response) => {
                    if (!options.onload) {
                        console.log('on load. ');
                        resolve(response);
                    } else {
                        const fn = options.onload;
                        (!fn.then ? Promise.resolve(fn(response)) : fn(response)).then(function (res) {
                            resolve(res);
                        });
                    }
                },
            })
        });
    }

    static get(url, options) {
        return JMRequest.request('GET', url, options);
    }

    static post(url, options) {
        return JMRequest.request('POST', url, options);
    }

    static put(url, options) {
        return JMRequest.request('PUT', url, options);
    }

    static delete(url, options) {
        return JMRequest.request('DELETE', url, options);
    }

    static head(url, options) {
        return JMRequest.request('HEAD', url, options);
    }

    static patch(url, options) {
        return JMRequest.request('PATCH', url, options);
    }
}

module.exports = {
    Request: JMRequest,
    Header: JMRequestHeader,
};
},{}],6:[function(require,module,exports){
const JMElement = require('../element');

class BaseButton extends JMElement {
    constructor() {
        super('button');
        this.btnClickedStyleChangeTimeout = undefined;
    }

    setNormalBtnBoxShadow() {
        this.setStyle('boxShadow', '0 0 2px 2px rgba(0, 0, 0, 0.08)');
    }

    setClickedBtnBoxShadow() {
        this.setStyle('boxShadow', 'none');
    }

    listenClick(fn) {
        this.listen('click', (e) => {
            this.setClickedBtnBoxShadow();
            if (this.btnClickedStyleChangeTimeout) {
                clearTimeout(this.btnClickedStyleChangeTimeout);
                this.btnClickedStyleChangeTimeout = null;
            }
            this.btnClickedStyleChangeTimeout = setTimeout(() => {
                this.setNormalBtnBoxShadow();
            }, 100);
            fn(e, this);
        })
    }
}
class IconButton {
    constructor(icon, size, clickFn) {
        this.button = new BaseButton();
        IconButton.initBtnStyle(this.button, typeof size === 'string' ? '128px' : size + 'px');
        this.image = new JMElement('img');
        this.image.setAttribute('src', icon);
        IconButton.initImageStyle(this.image);
        this.button.appendChild(this.image);
        this.button.listenClick(clickFn)
    }

    appendTo(parent) {
        this.button.appendTo(parent);
    }

    get element() {
        return this.button;
    }

    static initBtnStyle(button, size) {
        button.setCss({
            position: 'relative',
            height: size,
            width: size,
            padding: '0',
            borderRadius: '50%',
            border: 'none',
            outline: 'none',
        });
    }

    static initImageStyle(image) {
        image.setCss({
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            cursor: 'pointer'
        })
    }
}

class NormalButton {
    constructor(label, size, clickFn) {
        this.button = new BaseButton();
        NormalButton.initBtnStyle(this.button, NormalButton._handleSizeParam(size));
        this.label = new JMElement('p');
        NormalButton.initLabelStyle(this.label);
        this.label.innerText(label);
        this.button.appendChild(this.label);
        this.button.listenClick(clickFn)
    }

    appendTo(parent) {
        this.button.appendTo(parent);
    }

    get element() {
        return this.button;
    }

    static initBtnStyle(button, size) {
        button.setCss({
            height: size.height || '24px',
            width: '64px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'skyblue',
            cursor: 'pointer',
            outline: 'none',
        });
    }

    static initLabelStyle(label) {
        label.setCss({
            fontSize: '12px',
            color: 'rgba(255, 255,255, 0.87)',
            lineHeight: '100%',
            margin: '0',
        });
    }

    static _handleSizeParam(size) {
        switch (typeof size) {
            case 'object':
                return {
                    height: typeof size.height === 'string' ? size.height : size.height + 'px',
                    width: typeof size.width === 'string' ? size.width : size.width + 'px',
                };
            case 'string':
                return {height: size, width: size};
            case 'number':
                return {height: size + 'px', width: size + 'px'};
        }
    }
}

class JMButtonFactory {
    constructor() {
        if (!JMButtonFactory.ButtonFactory) {
            JMButtonFactory.ButtonFactory = this;
        }
        return JMButtonFactory.ButtonFactory;
    }

    static create(type, iconOrLabel, size, clickFn) {
        switch (type) {
            case 'icon':
                return new IconButton(iconOrLabel, size, clickFn);
            case 'normal':
            default:
                return new NormalButton(iconOrLabel, size, clickFn);
        }
    }
}
JMButtonFactory.ButtonFactory = null;

module.exports = JMButtonFactory;

},{"../element":2}],7:[function(require,module,exports){
module.exports = {
    Button: require('./button')
}
},{"./button":6}]},{},[3]);
