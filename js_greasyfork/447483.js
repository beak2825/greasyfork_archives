// ==UserScript==
// @name         Box.js
// @namespace    https://github.com/invobzvr
// @version      0.5
// @description  Box for modal / toast
// @author       invobzvr
// @homepageURL  https://github.com/invobzvr/invotoys.js/tree/main/box.js
// @supportURL   https://github.com/invobzvr/invotoys.js/issues
// @license      GPL-3.0
// ==/UserScript==

const LIB_NAME = 'Box';
!function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        module.exports = factory() :
        typeof define === 'function' && define.amd ?
            define(factory) :
            (global = global || self)[LIB_NAME] = factory();
}(this, function () {
    'use strict';
    function element(tag, props, body) {
        let el = document.createElement(tag);
        props && Object.entries(props).forEach(([key, val]) => val && (el[key] = val));
        body && body instanceof HTMLElement ? body.append(el) : typeof body === 'string' && document.querySelector(body).append(el);
        return el;
    }

    class Box {
        constructor(params) {
            this.params = Object.assign({}, params);
            this.build();
            typeof this.params.didBuild === 'function' && this.params.didBuild(this.modal);
            this.register();
            this.await = new Promise(resolve => this.close = async ret => {
                resolve(ret);
                await this.hide();
                this[this.ctnr.childElementCount === 1 ? 'ctnr' : 'modal'].remove();
            });
            if (this.params.toast) {
                let time = this.params.time,
                    bgc = {
                        success: '#0a5',
                        warning: '#fa0',
                        error: '#f25',
                    }[this.params.type];
                Number.isFinite(time) && time > 0 && setTimeout(() => this.close(), time);
                bgc && (this.modal.style.background = bgc);
            }
            this.params.show !== false && this.show();
        }

        static mixin(mixinParams) {
            return class MixinBox extends this {
                constructor(params) {
                    super(Object.assign({}, mixinParams, params));
                }
            }
        }

        build() {
            if (this.params.toast) {
                this.ctnr = document.querySelector('.box-toaster') || element('div', { className: 'box-toaster' }, document.body);
                this.modal = element('div', { className: 'box-toast-item' }, this.ctnr);
            } else {
                this.ctnr = element('div', { className: 'box-container' }, document.body);
                this.modal = element('div', { className: 'box-modal' }, this.ctnr);
            }
            element('div', {
                className: 'box-title',
                innerText: this.params.title,
            }, this.modal);
            element('div', {
                className: 'box-content',
                innerText: this.params.text,
                innerHTML: this.params.html,
            }, this.modal);
            if (this.params.toast) {
                return;
            }
            let actions = element('div', { className: 'box-actions' }, this.modal);
            Object.entries(this.params.actions || { OK: () => this.close() }).forEach(([key, val]) => element('button', {
                className: 'box-button',
                innerText: key,
                onclick: () => this.close(val(this.modal)),
            }, actions));
        }

        register() {
            let ignore = false;
            this.modal.addEventListener('mousedown', () => {
                this.ctnr.addEventListener('mouseup', evt => evt.target === this.ctnr && (ignore = true), { once: true });
            });
            this.ctnr.addEventListener('mousedown', () => {
                this.ctnr.addEventListener('mouseup', evt => (evt.target === this.modal || this.modal.contains(evt.target)) && (ignore = true), { once: true });
            });
            this.ctnr.addEventListener('click', evt => {
                ignore ? ignore = false : evt.target === this.ctnr && this.close();
            });
        }

        show() {
            return new Promise(resolve => {
                setTimeout(() => {
                    !this.params.toast && this.ctnr.classList.add('box-backdrop');
                    this.modal.classList.add('in');
                }, 10);
                this.modal.addEventListener('transitionend', resolve, { once: true });
            });
        }

        hide() {
            return new Promise(resolve => {
                !this.params.toast && this.ctnr.classList.remove('box-backdrop');
                this.modal.classList.remove('in');
                this.modal.addEventListener('transitionend', resolve, { once: true });
            });
        }

        then(onFulfilled) {
            return this.await.then(onFulfilled);
        }
    }

    element('style', null, document.head).innerHTML = `.box-container {
    bottom: 0;
    display: grid;
    left: 0;
    overflow: auto;
    pointer-events: none;
    position: fixed;
    right: 0;
    top: 0;
    transition: .2s;
    z-index: 200;
}

.box-backdrop {
    background: #0006;
    pointer-events: auto;
}

.box-modal {
    align-self: center;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 3px 20px #0006;
    justify-self: center;
    margin: 20px;
    opacity: 0;
    padding: 0 30px;
    transform: scale(.8);
    transition: .2s;
    user-select: none;
}

.box-modal.in {
    opacity: 1;
    transform: scale(1);
}

.box-title {
    font-size: 30px;
    padding: 20px;
    text-align: center;
}

.box-input-group {
    display: table;
    margin-bottom: 10px;
}

.box-label {
    display: table-cell;
    font-size: 16px;
    padding: 0 10px;
    text-align: center;
    width: 100%;
}

.box-input {
    font-size: 20px;
    padding: 5px 9px;
}

.box-input[type=checkbox] {
    vertical-align: middle;
}

.box-options {
    margin: auto;
    width: 80%;
}

.box-option-item {
    margin-right: 12px;
    white-space: nowrap;
}

.box-option-item .box-label {
    font-size: 13px;
    padding: 0 0 0 3px;
}

.box-actions {
    margin: 20px;
    text-align: center;
}

.box-button {
    background: #09f;
    border-radius: 5px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    margin: 5px;
    padding: 10px 18px;
}

.box-toaster {
    display: grid;
    min-width: 360px;
    padding: 10px;
    position: fixed;
    right: 0;
    top: 0;
    width: 27%;
    z-index: 201;
}

.box-toast-item {
    background: #09f;
    border-radius: 7px;
    box-shadow: 0 2px 10px #0005;
    color: #fff;
    margin-bottom: 10px;
    padding: 10px 10px 15px 10px;
    opacity: 0;
    transition: .2s;
    transform: scale(.8);
}

.box-toast-item.in {
    opacity: 1;
    transform: scale(1);
}

.box-toast-item .box-title,
.box-toast-item .box-content {
    padding: 0 10px;
    text-align: left;
    word-break: break-word;
}`;

    return Box;
});
