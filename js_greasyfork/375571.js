// ==UserScript==
// @name         Unfix Fixed Elements
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Intelligently reverses ill-conceived element fixing on sites like Medium.com
// @author       reagent
// @match        *://*/*
// @noframes
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document_start
// @downloadURL https://update.greasyfork.org/scripts/375571/Unfix%20Fixed%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/375571/Unfix%20Fixed%20Elements.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let classNames = ["anti-fixing"]; // Odds of colliding with another class must be low
    let exemptions = [];

    const inlineElements = [ // Non-block elements (along with html & body) which we will ignore
        "html", "script", "head", "meta", "title", "style", "script", "body",
        "a", "b", "label", "form", "abbr", "legend", "address", "link",
        "area", "mark", "audio", "meter", "b", "cite", "optgroup",
        "code", "option", "del", "q", "details", "small", "dfn", "select",
        "command", "source", "datalist", "span", "em", "strong", "font",
        "sub", "i", "summary", "iframe", "sup", "img", "tbody", "input",
        "td", "ins", "time", "kbd", "var"
    ];
    const fullBlockSelector = inlineElements.map(tag => ":not(" + tag + ")").join("");
    const ltdBlockSelector = "div,header,footer,nav";

    class FixedWatcher {
        constructor(thorough = true) {
            this.watcher = new MutationObserver(this.onMutation.bind(this));
            this.selector = thorough ? fullBlockSelector : ltdBlockSelector;
            this.awaitingTick = false;
            this.modal = false;
            this.body = null;
            this.top = [];
            this.bottom = [];
            this.onScroll = this.onScroll.bind(this);
        }

        start() {
            this.trackAll();
            this.watcher.observe(document, {
                childList: true,
                attributes: true,
                subtree: true,
                attributeFilter: ["class", "style"],
                attributeOldValue: true
            });
            window.addEventListener("scroll", this.onScroll);
        }
        onScroll() {
            if (this.awaitingTick || this.modal) return;
            this.awaitingTick = true;
            window.requestAnimationFrame(() => {
                const max = document.body.scrollHeight - window.innerHeight;
                const y = window.scrollY;

                for (const item of this.top) {
                    item.className = item.el.className;
                    if (y === 0) {
                        this.unFix(item.el);
                    } else {
                        this.fix(item.el);
                    }
                }

                for (const item of this.bottom) {
                    item.className = item.el.className;
                    if (y === max) {
                        this.unFix(item.el);
                    } else {
                        this.fix(item.el);
                    }
                }
                this.awaitingTick = false;
            })
        }
        onMutation(mutations) {
            for (let mutation of mutations) {
                if (mutation.type === "childList") {
                    for (let node of mutation.removedNodes)
                        this.untrack(node)
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;

                        if (node.matches(this.selector)) this.track(node);
                        node.querySelectorAll(this.selector).forEach(el => this.track(el));
                    }
                } else if (mutation.type === "attributes") {
                    if (this.friendlyMutation(mutation)) continue;


                    if (mutation.target.matches(this.selector)) {
                        this.track(mutation.target);
                    }
                    if(mutation.target === document.body){
                        const style = this.body || (this.body = getComputedStyle(document.body));
                        if(this.modal = style.overflowY === "hidden"){
                            window.requestAnimationFrame(() => this.restore());
                        }
                    }
                }
            }

        }

        friendlyMutation(mutation) { // Mutation came from us
            if (mutation.attributeName === "class") {
                if (this.top.findIndex(({ el, className }) => el === mutation.target && className === mutation.oldValue) !== -1) return true;
                if (this.bottom.findIndex(({ el, className }) => el === mutation.target && className === mutation.oldValue) !== -1) return true;
            }
            return false;
        }
        untrack(_el) {
            let i = this.top.findIndex(({ el }) => el.isSameNode(_el) || _el.contains(el));
            if (i !== -1) return !!this.top.splice(i, 1);
            i = this.bottom.findIndex(({ el }) => el.isSameNode(_el) || _el.contains(el));
            if (i !== -1) return !!this.bottom.splice(i, 1);
            return false;
        }
        trackAll() {
            const els = document.querySelectorAll(this.selector);
            for (const el of els)
                this.track(el);
        }
        fix(el) {
            for (const className of classNames)
                el.classList.add(className);
        }
        unFix(el) {
            for (const className of classNames)
                el.classList.remove(className);
        }
        getClassAttribs(el) {
            // Last-ditch effort to help figure out if the developer intended the fixed element to be fullscreen
            // i.e. explicitly defined both the top and bottom rules. If they did, then we leave the element alone.
            // Unfortunately, we can't get this info from .style or computedStyle, since .style only
            // applies when the rules are added directly to the element, and computedStyle automatically generates a value
            // for top/bottom if the opposite is set. Leaving us no way to know if the developer actually set the other value.
            const rules = [];
            for (const styleSheet of document.styleSheets) {
                try {
                    for (const rule of styleSheet.cssRules) {
                        if (el.matches(rule.selectorText)) {
                            rules.push({ height: rule.style.height, top: rule.style.top, bottom: rule.style.bottom });
                        }
                    }
                } catch (e) {
                    continue;
                }
            }

            return rules.reduce((current, next) => ({
                height: next.height || current.height,
                top: next.top || current.top,
                bottom: next.bottom || current.bottom
            }), {
                height: "",
                top: "",
                bottom: ""
            });
        }

        isAutoBottom(el, style) {
            if (style.bottom === "auto") return true;
            if (style.bottom === "0px") return false;
            if (el.style.bottom.length) return false;
            const { height, bottom } = this.getClassAttribs(el);

            if (height === "100%" || bottom.length) return false;

            return true;
        }
        isAutoTop(el, style) {
            if (style.top === "auto") return true;
            if (style.top === "0px") return false;
            if (el.style.top.length) return false;
            const { height, top } = this.getClassAttribs(el);

            if (height === "100%" || top.length) return false;

            return true;
        }
        topTracked(el) {
            return this.top.findIndex(({ el: _el }) => _el === el) !== -1;
        }
        bottomTracked(el) {
            return this.bottom.findIndex(({ el: _el }) => _el === el) !== -1;
        }
        isTop(el, style){
            const top = parseFloat(style.top);
            if(top > 0){
                const i = this.top.findIndex(({style}) => parseFloat(style.top)
                                             + parseFloat(style.height)
                                             + parseFloat(style.paddingTop)
                                             + parseFloat(style.paddingBottom) === top);
                if(i === -1) return false;
            }
            return !this.topTracked(el) && this.isAutoBottom(el, style);
        }
        isBottom(el, style){
            const bottom = parseFloat(style.bottom);
            if(bottom > 0){
                const i = this.bottom.findIndex(({style}) => parseFloat(style.bottom)
                                                + parseFloat(style.height)
                                                + parseFloat(style.paddingTop)
                                                + parseFloat(style.paddingBottom) === bottom);
                if(i === -1) return false;
            }
            return !this.bottomTracked(el) && this.isAutoTop(el, style);
        }
        track(el) {
            const style = window.getComputedStyle(el);

            if (style.position === "fixed" || style.position === "sticky") {
                if (this.isTop(el, style)) {
                    this.top.push({ el, style, className: el.className});
                    this.onScroll();
                } else if (this.isBottom(el, style)) {
                    this.bottom.push({ el, style, className: el.className });
                    this.onScroll();
                }
            }
        }

        stop() {
            this.watcher.disconnect();
            window.removeEventListener("scroll", this.onScroll);
        }

        restore() {
            const all = this.top.concat(this.bottom);

            for (let {el} of all) {
                for(const className of classNames){
                    el.classList.remove(className);
                }
            }
        }

    }
    const getSelectors = cssRule => cssRule.selectorText.split(",")[0].split(".").filter(i => i.length);
    const rankSelector = selector => selector.selectorText.split(".").length * -1;
    const getBestClass = cssRules => cssRules.reduce((bestSelector, curSelector) => rankSelector(bestSelector) < rankSelector(curSelector) ? curSelector :bestSelector)
    const getSurrogates = () => {
        const applicableRules = Array.from(document.styleSheets)
        .filter(sheet => { try { sheet.cssRules; return true } catch (e) { return false } })
        .map(sheet => Array.from(sheet.cssRules))
        .flat()
        .filter(cssClass => cssClass.style
                && cssClass.style.length === 1
                && cssClass.style[0] === "display"
                && cssClass.style.display === "none"
                && !cssClass.selectorText.match(/[\ \[\]\:\>\~\+]/g));
        if (!applicableRules.length) return;

        const narrowed = applicableRules.filter(cssClass => cssClass.style.getPropertyPriority("display") === "important");

        return narrowed.length ? getBestClass(narrowed) : getBestClass(applicableRules);
    }
    const insertSheet = () => new Promise((resolve, reject) => {
        document.documentElement.appendChild((() => {
            let el = document.createElement("style");
            el.setAttribute("type", "text/css");
            el.appendChild(document.createTextNode(`.${classNames[0]}{ display: none !important }`));
            el.addEventListener("load", resolve);
            return el;
        })());
        setTimeout(reject, 50);
    });

    const isExempt = host => exemptions.indexOf(host) !== -1;
    const addExempt = host => !isExempt(host) && exemptions.push(host) && saveExempt();
    const removeExempt = host => (exemptions = exemptions.filter(e => e !== host)) && saveExempt();
    const saveExempt = () => GM.setValue("exemptions", JSON.stringify(exemptions));
    const init = () => {
        insertSheet()
            .catch(() => new Promise(resolve => {
                const surrogates = getSurrogates();
                if (!surrogates) throw "Unable to create stylesheet, and unable to find suitable alternatives";
                console.log("Unable to create stylesheet, using alternative selectors:", surrogates);
                classNames = getSelectors(surrogates);
                resolve();
            }))
            .then(async () => JSON.parse(await GM.getValue("exemptions", "[]")))
            .then(_exemptions => {
                exemptions = _exemptions;

                if (!isExempt(document.location.host)) {
                    window.fixer = new FixedWatcher();
                    window.fixer.start();
                }
            })
            .then(() => window.addEventListener("keydown", e => {
                if (e.altKey && e.key === "F") { // ALT + SHIFT + F
                    e.preventDefault();
                    if (window.fixer) {
                        const host = document.location.host;
                        console.log("Removing fixer and exempting", host, "from fixing");
                        addExempt(host);

                        window.fixer.stop();
                        window.fixer.restore();
                        window.fixer = null;
                    } else {
                        console.log("Adding fixer");
                        removeExempt(document.location.host);

                        window.fixer = new FixedWatcher();
                        window.fixer.start();
                    }
                }
            }))
    }

    init();
})()