// ==UserScript==
// @name         Pawoo Always Show Spoilers
// @namespace    https://github.com/TaleirOfDeynai/
// @version      1.0
// @description  Automatically shows spoilers on media when browsing Pawoo through the web client.
// @author       Taleir
// @match        https://pawoo.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/385055/Pawoo%20Always%20Show%20Spoilers.user.js
// @updateURL https://update.greasyfork.org/scripts/385055/Pawoo%20Always%20Show%20Spoilers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper functions.
    function logError(ex) {
        console.error(`[UserScript:Pawoo Always Show Spoilers] Encountered an error; ${ex.message}`);
        console.error(ex);
    }

    function isDetached(node) {
        while (node) {
            if (node === document.documentElement) return false;
            node = node.parentNode;
        }
        return true;
    }

    function createTrial(fn) {
        return function(arg) {
            try { fn(arg); }
            catch (ex) { logError(ex); }
        };
    }

    // Helper classes.
    class Observable {
        constructor(source) {
            this._source = Observable.toSource(source);
        }

        static toSource(obj) {
            switch (true) {
                case typeof obj.forEach === "function":
                    return obj.forEach.bind(obj);
                case typeof obj === "function":
                    return obj;
                default:
                    return (iterator) => iterator(obj);
            }
        }

        static join(...args) {
            args = args.map(Observable.toSource);
            return new Observable(iterator => args.forEach(source => source(iterator)));
        }

        forEach(fn) {
            try { this._source(fn); }
            catch (ex) { logError(ex); }
            return this;
        }

        map(fn) {
            var mappedSource = (iterator) => this._source(val => iterator(fn(val)));
            return new Observable(mappedSource);
        }

        flat() {
            var flattenedSource = (iterator) => this._source(val => {
                Observable.toSource(val)(iterator);
            });
            return new Observable(flattenedSource);
        }

        flatMap(fn) {
            var flatMappedSource = (iterator) => this._source(val => {
                Observable.toSource(fn(val))(iterator);
            });
            return new Observable(flatMappedSource);
        }

        collect(fn) {
            var collectedSource = (iterator) => this._source(val => {
                var result = fn(val);
                if (typeof result !== "undefined") iterator(result);
            });
            return new Observable(collectedSource);
        }

        filter(fn) {
            var filteredSource = (iterator) => this._source(val => fn(val) && iterator(val));
            return new Observable(filteredSource);
        }

        zip(fn) {
            var zippedSource = (iterator) => this._source(left => {
                Observable.toSource(fn(left))(right => {
                    iterator(Array.isArray(left) ? [...left, right] : [left, right]);
                });
            });
            return new Observable(zippedSource);
        }
    }

    class NodeObserver {
        constructor(parent, selector) {
            this.disconnected = false;
            this._callbacks = [];
            this._nodes = new Set();

            var addNode = (added) => {
                if (this._nodes.has(added)) return;
                this._callbacks.forEach(fn => fn(added));
                this._nodes.add(added);
            };

            var tryAddNode = (added) => {
                if (!added.matches) return;
                if (added.matches(selector)) return addNode(added);
                added.querySelectorAll(selector).forEach(addNode);
            };

            // Attach to all existing nodes that match.
            parent.querySelectorAll(selector).forEach(addNode);

            this._observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(tryAddNode);
                    if (mutation.removedNodes.length > 0)
                        for (var node of this._nodes)
                            if (isDetached(node))
                                this._nodes.delete(node);
                });
            });

            this._observer.observe(parent, { childList: true, subtree: true });
        }

        disconnect() {
            if (this.disconnected) return;
            this._observer.disconnect();
            this._callbacks = [];
            this._nodes = new Set();
            this.disconnected = true;
        }

        forEach(fn) {
            if (this.disconnected) return;
            fn = createTrial(fn);
            this._nodes.forEach(fn);
            this._callbacks.push(fn);
        }

        toObservable() {
            return new Observable(this);
        }
    }

    // Inject style for revealed articles.
    var styleNode = document.createElement("style");
    styleNode.innerHTML = `
        .app-body > .app-holder article .status__wrapper.PASS_ext__revealed,
        .app-body > .app-holder .detailed-status__wrapper .status.PASS_ext__revealed,
        .app-body > .app-holder .detailed-status__wrapper .detailed-status.PASS_ext__revealed,
        .container.pawoo-wide .entry.PASS_ext__revealed {
            position: relative;
        }

        .PASS_ext__revealed > * {
            background-color: transparent !important;
        }

        .PASS_ext__revealed::before {
            background-color: rgba(255, 0, 0, 0.05);
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            pointer-events: none;
        }
    `;
    document.head.appendChild(styleNode);

    // Actual work of the script starts here.
    var applyModifications = (tuple) => {
        tuple[0].setAttribute("data-pass-ext-visited", "");
        tuple[0].classList.add("PASS_ext__revealed");
        tuple[1].click();
    };

    // Observe on the main application entry points.
    var app = new NodeObserver(document.documentElement, `.app-body > .app-holder`).toObservable();
    var act = new NodeObserver(document.documentElement, `.container.pawoo-wide`).toObservable();

    // Observe on the main app's articles list.
    var appArticles = app.flatMap(node => new NodeObserver(node, `.item-list[role="feed"] article .status__wrapper`));

    // Observe on the main app's detailed view.
    var appView = app.flatMap(node => new NodeObserver(node, `.detailed-status__wrapper`));
    var appViewStatus = appView.flatMap(node => new NodeObserver(node, `.status`));
    var appViewDetail = appView.flatMap(node => new NodeObserver(node, `.detailed-status`));

    // Observe on the activity stream entries and detailed views.
    var actEntries = act.flatMap(node => new NodeObserver(node, `.h-feed .entry`));
    var actDetail = act.flatMap(node => new NodeObserver(node, `.h-entry .entry`));

    // Apply the modifications.
    Observable.join(appArticles, appViewStatus, appViewDetail, actEntries, actDetail)
        .zip(node => new NodeObserver(node, `button.media-spoiler`))
        .filter(tuple => !tuple[0].hasAttribute("data-pass-ext-visited"))
        .forEach(applyModifications);
})();
