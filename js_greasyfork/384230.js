// ==UserScript==
// @name           Modal
// @name:en        Modal
// @description    Generic modal window
// @description:en Generic modal window
// @namespace      https://greasyfork.org/users/174399
// @version        0.1.0
// @include        *://*.mozilla.org/*
// @grant          none
// ==/UserScript==

(function(window, undefined) {
    // const btn = document.body.appendChild(createSElement(`
    // <div style="position: fixed; bottom: 0; right: 0; width: 10%; height: 10%; background: green; z-index: 99999; display: flex;">
        // <label for="modal-cbox" style="flex: 1"></label>
    // </div>
    // `));
    // setTimeout(() => querySelector('label', btn).click(), 2000);
    function Modal({
        content: {
            css: contentCSS = {},
        } = {},
        header: {
            html: headerHTML = '',
            css: headerCSS = {},
            onClick: onClickHeader,
        } = {},
        body: {
            html: bodyHTML = '',
            css: bodyCSS = {},
            onClick: onClickBody,
        } = {},
        footer: {
            html: footerHTML = '',
            css: footerCSS = {},
            onClick: onClickFooter,
        } = {},
        withClose = true,
    } = {}) {
        const wrapper = querySelector('.modal-wrapper') || Modal.create();
        const content = querySelector('.modal-content', wrapper);
        const mheader = querySelector('.modal-header', wrapper);
        const mfooter = querySelector('.modal-footer', wrapper);
        const mbody = querySelector('.modal-body', wrapper);
        // html
        mheader.appendChild(createSElement(headerHTML));
        mfooter.innerHTML = footerHTML;
        mbody.innerHTML = bodyHTML;
        // style
        setStyle(content, contentCSS);
        setStyle(mheader, headerCSS);
        setStyle(mfooter, footerCSS);
        setStyle(mbody, bodyCSS);
        // onclick
        addEventListener(mheader, 'click', onClickHeader);
        addEventListener(mfooter, 'click', onClickFooter);
        addEventListener(mbody, 'click', onClickBody);
        // return object
        this.wrapper = wrapper;
        this.content = content;
        this.header = mheader;
        this.footer = mfooter;
        this.body = mbody;
        this.onClickHeader = onClickHeader;
        this.onClickFooter = onClickFooter;
        this.onClickBody = onClickBody;
    }
    Modal.toggle = function() {
        const btn = querySelector('.modal-wrapper .modal-close-background');
        return btn && btn.click();
    };
    Modal._open = function(visible = true) {
        (querySelector('.modal-wrapper #modal-cbox') || {}).checked = visible;
    };
    Modal.close = function() { Modal._open(false); };
    Modal.open  = function() { Modal._open(true); };
    Modal.WRAPPER_HTML = `
    <div class="modal-wrapper">
        <input type="checkbox" checked style="display: none" id="modal-cbox" />
        <div class="modal-container">
            <label for="modal-cbox" class="modal-close-background" ></label>
            <div class="modal-content">
                <div class="modal-header">
                    <label for="modal-cbox" title="close" class="modal-close-x"><div></div></label>
                </div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>`.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    Modal.WRAPPER_CSS = `
    .modal-container {
        opacity: 0;
        visibility: hidden;
    }
    #modal-cbox:checked + .modal-container {
        position: fixed;
        z-index: 9999999;
        visibility: visible;
        opacity: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity .25s;
    }
    #modal-cbox:checked + .modal-container .modal-content {
        bottom: 0;
    }
    .modal-content {
        position: absolute;
        background-color: gray;
        min-width: 400px;
        min-height: 100px;
        opacity: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        right: 0;
        bottom: -20%;
        transition: all .25s;
    }
    .modal-header {
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
        width: 100%;
        height: 40px;
    }
    .modal-close-x {
        position: absolute;
        right: 10px;
    }
    .modal-close-x div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .modal-close-x,
    .modal-close-x div {
        width: 24px;
        height: 24px;
    }
    .modal-close-x div:after,
    .modal-close-x div:before {
        content: "";
        position: absolute;
        background: #ccc;
        width: 2px;
        height: 24px;
        display: block;
        transform: rotate(45deg);
    }
    .modal-close-x div:before {
        transform: rotate(-45deg);
    }
    .modal-close-background {
        position: absolute;
        background-color: black;
        width: 100%;
        height: 100%;
        opacity: 0.4;
    }
    `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    Modal.create = function() {
        let wrapper = querySelector('.modal-wrapper');
        if (wrapper) {
            return wrapper;
        }
        if (document.readyState === 'loading') {
            throw new Error('you can\'t insert HTMLElement to DOMTree while document is loading');
        }
        const {
            body = querySelector('body'),
            head = querySelector('head'),
        } = document;
        if (!body) {
            throw new Error('document.body not found');
        }
        if (!head) {
            throw new Error('document.head not found');
        }
        wrapper = createSElement(Modal.WRAPPER_HTML);
        const style = createElement('style', Modal.WRAPPER_CSS);
        head.appendChild(style);
        return body.appendChild(wrapper);
    };
    function createSElement(html) {
        return createElement('div', html).firstElementChild;
    }
    function createElement(tag, html) {
        const elem = document.createElement(tag);
        if (typeof html !== 'undefined') {
            elem.innerHTML = html;
        }
        return elem;
    }
    function querySelector(selector, context) {
        return (context || document).querySelector(selector);
    }
    function querySelectorAll(selector, context = document) {
        return (context || document).querySelectorAll(selector);
    }
    function setStyle(elem, css, val) {
        if (!elem) {
            return;
        }
        switch (typeof css) {
            case 'object':
                Object.keys(css).map(toCamelCase).forEach(key => setStyle(elem, key, css[key]));
                break;
            case 'string':
                elem.style[css] = val;
                break;
        }
    }
    function toCamelCase(str) {
        return str.replace(/\-([a-z])/g, (match, p1) => p1.toUpperCase());
    }
    function addEventListener(elem, event, callback) {
        if (!elem || typeof event !== 'string' || typeof callback !== 'function') {
            return;
        }
        return elem.addEventListener(event, callback);
    }
    const { ESModules = {} } = window;
    ESModules.Modal = Modal;
    window.ESModules = ESModules;
    // Modal.create();
    // setTimeout(Modal.toggle, 4000);
})(window);