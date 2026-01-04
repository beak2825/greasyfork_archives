// ==UserScript==
// @name          @mantine_store-umd
// @namespace     flomk.userscripts
// @version       1.0
// @description   UMD of @mantine/store
// @author        flomk
// ==/UserScript==
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineStore = {}, global.React));
})(this, (function (exports, react) { 'use strict';

    function createStore(initialState) {
        let state = initialState;
        let initialized = false;
        const listeners = /* @__PURE__ */ new Set();
        return {
            getState() {
                return state;
            },
            updateState(value) {
                state = typeof value === "function" ? value(state) : value;
            },
            setState(value) {
                this.updateState(value);
                listeners.forEach((listener) => listener(state));
            },
            initialize(value) {
                if (!initialized) {
                    state = value;
                    initialized = true;
                }
            },
            subscribe(callback) {
                listeners.add(callback);
                return () => listeners.delete(callback);
            }
        };
    }
    function useStore(store) {
        return react.useSyncExternalStore(
            store.subscribe,
            () => store.getState(),
            () => store.getState()
        );
    }
    exports.createStore = createStore;
    exports.useStore = useStore;
}));
