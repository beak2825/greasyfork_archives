// ==UserScript==
// @name           FBase Lib
// @description    Base library
// @version        0.0.12
// ==/UserScript==
    const FOUR_MINUTES = 4 * 60 * 1000;
    const wait = (msMin, msMax) => new Promise(resolve => setTimeout(resolve, msMin && msMax && rndInt(msMin, msMax) || msMin || 3000));
    const rndInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

    Element.prototype.isVisible = function() {
        return !!(this.offsetWidth||this.offsetHeight||this.getClientRects().length);
    };
    Element.prototype.isUserFriendly = function(selector) {
        let e = selector ? this.querySelector(selector) : this;
        return e && e.isVisible()  ? e : null;
    };
    Document.prototype.isUserFriendly = Element.prototype.isUserFriendly;

    async function triggerClick(elm, x =0, y = 0) {
        if (!elm) return;
        elm.dispatchEvent(new MouseEvent('mouseover'));
        await wait(100, 300);
        elm.dispatchEvent(new MouseEvent('mousedown'));
        await wait(100, 300);
        elm.dispatchEvent(new MouseEvent('mouseup'));
        await wait(100, 300);
        elm.dispatchEvent(new MouseEvent('click'));
    };
    function typer(inputElm, value) {
        let lastValue = inputElm.value;
        inputElm.value = value;
        let event = new Event('input', { bubbles: true });
        event.simulated = true;
        let tracker = inputElm._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        inputElm.dispatchEvent(event);
    }

    class CrawlerWidget {
        constructor(params) {
            if (!params || (!params.selector && !params.fnSelector)) {
                throw new Error('CrawlerWidget requires a selector or a function selector parameter');
            }
            this.context = this.context || document;
            Object.assign(this, params);
        }

        get isUserFriendly() {
            if (this.selector) {
                this.element = this.context.isUserFriendly(this.selector);
                return this.element;
            } else {
                this.element = this.fnSelector();
                return this.element;
            }
        }
    }

    class CaptchaWidget extends CrawlerWidget {
        constructor(params) {
            super(params);
        }

        solve() { return true; }

        async isSolved() { return false; }
    }

    class HCaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: '.h-captcha > iframe',
                waitMs: [1000, 5000],
                timeoutMs: FOUR_MINUTES
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        async isSolved() {
            return wait().then( () => {
                if (this.isUserFriendly && this.element.hasAttribute('data-hcaptcha-response') && this.element.getAttribute('data-hcaptcha-response').length > 0) {
                    return Promise.resolve(true);
                }
                return this.isSolved();
            });
        }
    }

    class RecaptchaWidget extends CaptchaWidget {
        constructor(params) {
            let defaultParams = {
                selector: function() { return grecaptcha },
                waitMs: [1000, 5000],
                timeoutMs: 4 * 60 * 1000
            };
            for (let p in params) {
                defaultParams[p] = params[p];
            }
            super(defaultParams);
        }

        get isUserFriendly() {
            try {
                this.element = grecaptcha;
                return this.element;
            } catch(err) { return false; }
        }

        isInvisible() {
            let frames = [...document.querySelectorAll('iframe')];
            let anchor = frames.filter(x => x.src.toLowerCase().includes('/recaptcha/api2/anchor'));
            anchor = anchor.length > 0  ? anchor[0] : false;
            let bframe = frames.filter(x => x.src.toLowerCase().includes('/recaptcha/api2/bframe'));
            bframe = bframe.length > 0  ? bframe[0] : false;
            let isInvisibleAnchor = anchor && anchor.src.toLowerCase().includes('size=invisible');
            return !(anchor && !isInvisibleAnchor);
        }

        async isSolved() {
            return wait().then( () => {
                try {
                    if (this.isUserFriendly) {
                        if (this.isInvisible()) {
                            return Promise.resolve(true);
                        }
                        if(this.element.hasOwnProperty('getPageId') && this.element.getPageId() && this.element.hasOwnProperty('getResponse') && (typeof(this.element.getResponse) == 'function')
                        && this.element.getResponse().length > 0) {
                            return Promise.resolve(true);
                        }
                    }
                } catch (err) {}
                return this.isSolved();
            });
        }
    }

    class OuoSolver {
        constructor() {
            this.btnImHuman;
        }

        async doClick() {
            this.btnImHuman = document.querySelector('#btn-main:not(.disabled)');
            if (!this.btnImHuman) {
                await wait(1000, 3000);
                return this.doClick();
            }
            this.btnImHuman.click();
        }

        async start() {
            return this.doClick();
        }
    }
