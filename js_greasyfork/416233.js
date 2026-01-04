// ==UserScript==
// @name         Chase - Show combined balance
// @namespace    https://chase.com/
// @version      0.4
// @description  Shows current balance + pending balance added together above the current balance.
// @author       You
// @match        https://*.chase.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416233/Chase%20-%20Show%20combined%20balance.user.js
// @updateURL https://update.greasyfork.org/scripts/416233/Chase%20-%20Show%20combined%20balance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    class SiteWatch {
        constructor() {
            this.components = [];
            this.currentComponents = this.getApplicableComponents();
            this.lastURL = document.location.href;
            this.observer = new MutationObserver(muts => {
                if (document.location.href !== this.lastURL) {
                    this.applyComponents(this.getApplicableComponents());
                }
                if (!this.currentComponents)
                    return;
                this.currentChecker(muts);
            });
        }
        getApplicableComponents() {
            const href = document.location.href;
            const nextModules = this.components.filter(({ url }) => url instanceof RegExp ? url.test(href) : href.indexOf(url) !== -1);
            return nextModules.length ? nextModules : undefined;
        }
        applyComponents(nextComponents) {
            const _nextComponents = nextComponents || [];
            const _currentComponents = this.currentComponents || [];
            const unMount = () => _nextComponents
            .filter(component => _currentComponents.indexOf(component) === -1)
            .forEach(component => component.onUmount());
            const mount = () => _currentComponents
            .filter(component => _nextComponents.indexOf(component) === -1)
            .forEach(component => component.onMount());
            if (!nextComponents) {
                unMount();
                this.currentComponents = undefined;
                this.currentChecker = undefined;
            } else {
                unMount();
                mount();
                this.currentComponents = nextComponents;
                this.currentChecker = this.getCheckAll(nextComponents);
            }
        }
        getCheckAll(components) {
            const allRemovedChecks = this.mergeChecks(components.map(component => component.checkRemoved));
            const allAddedChecks = this.mergeChecks(components.map(component => component.checkAdded));
            const allModifiedChecks = this.mergeChecks(components.map(component => component.checkModified));
            return (muts) => {
                for (let mut of muts) {
                    if (mut.type === 'childList') {
                        for (let node of mut.removedNodes) {
                            if(node.nodeType === Node.TEXT_NODE) continue;
                            for (let [query, fns] of allRemovedChecks) {
                                if (node.matches(query)) {
                                    fns.forEach(fn => fn(node));
                                }
                                else {
                                    const child = node.querySelector(query);
                                    if (child) {
                                        fns.forEach(fn => fn(child));
                                    }
                                }
                            }
                        }
                        for (let node of mut.addedNodes) {
                            if(node.nodeType === Node.TEXT_NODE) continue;
                            for (let [query, fns] of allAddedChecks) {
                                if (node.matches(query)) {
                                    fns.forEach(fn => fn(node));
                                }
                                else {
                                    const child = node.querySelector(query);
                                    if (child) {
                                        fns.forEach(fn => fn(child));
                                    }
                                }
                            }
                        }
                    }
                    for (let [query, fns] of allModifiedChecks) {
                        if (mut.target.matches(query))
                            fns.forEach(fn => fn(mut.target));
                    }
                }
            };
        }
        mergeChecks(allChecks) {
            const nextChecks = new Map();
            for (const check of allChecks)
                for (const [query, fn] of check) {
                    nextChecks.set(query, (nextChecks.get(query) || []).concat(fn));
                }
            return nextChecks;
        }
        add(page) {
            this.components.push(page);
        }
        start() {
            const attribs = this.components.map(page => page.attribs)
            .reduce((all, attrib) => all.concat(attrib.reduce((unlisted, _attrib) => all.indexOf(_attrib) === -1 ? unlisted.concat(_attrib) : unlisted, [])), []);
            this.applyComponents(this.getApplicableComponents());
            this.lastURL = document.location.href;
            if (this.currentComponents) {
                this.currentComponents.forEach(component => {
                    component.onMount();
                    for (let [query, fn] of component.checkAdded) {
                        const el = document.querySelector(query);
                        if (el)
                            fn(el);
                    }
                });
            }
            this.observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: attribs
            });
        }
        destroy() {
            this.observer.disconnect();
            this.components = [];
            this.currentComponents = undefined;
            this.currentChecker = undefined;
        }
    }
    class Component {
        constructor(url) {
            this.url = url;
            this.attribs = [];
            this.checkAdded = new Map();
            this.checkRemoved = new Map();
            this.checkModified = new Map();
        }
        onMount() {
        }
        onUmount() {
        }
        onAll(query, fn, attribs) {
            this.onTree(query, fn);
            if (attribs) {
                this.onModified(query, fn, attribs);
            }
            else {
                this.checkModified.set(query, fn);
            }
        }
        onTree(query, fn) {
            this.checkAdded.set(query, fn);
            this.checkRemoved.set(query, fn);
        }
        onModified(query, fn, attribs) {
            this.checkModified.set(query, fn);
            this.appendAttribs(attribs);
        }
        appendAttribs(attribs) {
            for (let attrib of attribs) {
                if (this.attribs.indexOf(attrib) === -1) {
                    this.attribs = this.attribs.concat(attrib);
                }
            }
        }
    }
    class Overview extends Component{
        constructor() {
            super('dashboard/overview');
            this.balanceElement = null;
            this.onAll('[id*="currentBalance-dataItem"]', this.onBalanceElement.bind(this));
            this.onAll('.mds-activity-table', this.onActivityTable.bind(this));
            const [infoParent, setInfo] = this.getInfoEl();
            this.infoParent = infoParent;
            this.setInfo = setInfo;
        }
        onBalanceElement(el){
            this.balanceElement = el || null;
            console.log('Chase', 'Found balance element', this.balanceElement);
            this.update();
        }
        onActivityTable(el){
            this.activityTable = el || null;
            console.log('Chase', 'Found activity table', this.activityTable);
            this.update();
        }
        getInfoEl(){
            const parentEl = document.createElement('div');
            const label = document.createElement('strong');
            const total = document.createElement('span');

            label.textContent = 'True balance: ';
            parentEl.appendChild(label);
            parentEl.appendChild(total);

            return [parentEl, nextQty => total.textContent = nextQty];
        }
        toNumber(str){

            const [_, sign, quantity] = str.match(/([^\$]*)\$([0-9\,\.]+)/) || [, '', '0'];
            const finalNumber = quantity.split(',').join('');
            const signHex = sign.charCodeAt(0).toString(16);
            const isNegative = ['2d', '2010', '2212', '2013', '2014'].indexOf(signHex) !== -1;

            return parseFloat(finalNumber) * (isNegative ? -1 : 1);
        }
        update(){
            if(this.balanceElement && this.activityTable){
                if(!this.balanceElement.parentElement.contains(this.infoParent)){
                    this.balanceElement.parentElement.appendChild(this.infoParent);
                }
                const balance = this.balanceElement.textContent.trim();
                const pending = Array.from(this.activityTable.querySelectorAll('[data-values^="Pending"] td:nth-last-child(2)'))
                .map(td => this.toNumber(td.textContent))
                .reduce((cur, total) => total + cur, 0)

                console.log('Chase-US', this.toNumber(balance), pending);

                const total = this.toNumber(balance) + pending;
                console.log('Chase-US', 'total', total);

                this.setInfo('$' + total.toFixed(2));
            }
        }
    }

    const watcher = new SiteWatch();
    const overview = new Overview();

    console.log('hello');

    watcher.add(overview);
    watcher.start();
})();