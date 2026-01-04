// ==UserScript==
// @name          @mantine_nprogress-umd
// @namespace     flomk.userscripts
// @version       1.0
// @description   UMD of @mantine/nprogress
// @author        flomk
// ==/UserScript==

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react/jsx-runtime'), require('react'), require('@mantine/core'), require('@mantine/hooks')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react/jsx-runtime', 'react', '@mantine/core', '@mantine/hooks'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MantineNavigationProgress = {}, global.ReactJSXRuntime, global.React, global.Mantine, global.MantineHooks));
})(this, (function (exports, jsxRuntime, react, core, hooks) { 'use strict';

    /* esm.sh - esbuild bundle(@mantine/nprogress@7.11.1) es2022 development */
    // ../esmd/npm/@mantine/nprogress@7.11.1/node_modules/.pnpm/@mantine+nprogress@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/nprogress/esm/NavigationProgress.mjs
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

    // ../esmd/npm/@mantine/nprogress@7.11.1/node_modules/.pnpm/@mantine+nprogress@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/nprogress/esm/nprogress.store.mjs
    function getIntervalProgressValue(currentProgress) {
        let next = 0.5;
        if (currentProgress >= 0 && currentProgress <= 20) {
            next = 10;
        } else if (currentProgress >= 20 && currentProgress <= 50) {
            next = 4;
        } else if (currentProgress >= 50 && currentProgress <= 80) {
            next = 2;
        } else if (currentProgress >= 80 && currentProgress <= 99) {
            next = 1;
        } else if (currentProgress >= 99 && currentProgress <= 100) {
            next = 0;
        }
        return currentProgress + next;
    }
    var createNprogressStore = () => createStore({
        mounted: false,
        progress: 0,
        interval: 0,
        step: 1,
        stepInterval: 100,
        timeouts: []
    });
    var useNprogress = (store) => useStore(store);
    function updateNavigationProgressStateAction(update, store) {
        const state = store.getState();
        store.setState({ ...state, ...update(store.getState()) });
    }
    function decrementNavigationProgressAction(store) {
        updateNavigationProgressStateAction(
            (state) => ({ progress: Math.max(state.progress - state.step, 0) }),
            store
        );
    }
    function setNavigationProgressAction(value, store) {
        updateNavigationProgressStateAction(
            () => ({ progress: hooks.clamp(value, 0, 100), mounted: true }),
            store
        );
    }
    function cleanupNavigationProgressAction(store) {
        updateNavigationProgressStateAction((state) => {
            window.clearInterval(state.interval);
            state.timeouts.forEach((timeout) => window.clearTimeout(timeout));
            return { timeouts: [] };
        }, store);
    }
    function completeNavigationProgressAction(store) {
        cleanupNavigationProgressAction(store);
        updateNavigationProgressStateAction((state) => {
            const mountedTimeout = window.setTimeout(() => {
                updateNavigationProgressStateAction(() => ({ mounted: false }), store);
            }, 50);
            const resetTimeout = window.setTimeout(() => {
                updateNavigationProgressStateAction(() => ({ progress: 0 }), store);
            }, state.stepInterval + 50);
            return { progress: 100, timeouts: [mountedTimeout, resetTimeout] };
        }, store);
    }
    function startNavigationProgressAction(store) {
        updateNavigationProgressStateAction(
            (s) => ({ progress: getIntervalProgressValue(s.progress), mounted: true }),
            store
        );
        updateNavigationProgressStateAction((state) => {
            window.clearInterval(state.interval);
            const interval = window.setInterval(() => {
                updateNavigationProgressStateAction(
                    (s) => ({ progress: getIntervalProgressValue(s.progress), mounted: true }),
                    store
                );
            }, state.stepInterval);
            return { interval, mounted: true };
        }, store);
    }
    function stopNavigationProgressAction(store) {
        updateNavigationProgressStateAction((state) => {
            window.clearInterval(state.interval);
            return { interval: -1 };
        }, store);
    }
    function resetNavigationProgressAction(store) {
        cleanupNavigationProgressAction(store);
        stopNavigationProgressAction(store);
        updateNavigationProgressStateAction(() => ({ progress: 0, mounted: false }), store);
    }
    function incrementNavigationProgressAction(store) {
        updateNavigationProgressStateAction((state) => {
            const nextValue = Math.min(state.progress + state.step, 100);
            const nextMounted = nextValue !== 100 && nextValue !== 0;
            if (!nextMounted) {
                const timeout = window.setTimeout(
                    () => resetNavigationProgressAction(store),
                    state.stepInterval + 50
                );
                return {
                    progress: nextValue,
                    mounted: nextMounted,
                    timeouts: [...state.timeouts, timeout]
                };
            }
            return {
                progress: nextValue,
                mounted: nextMounted
            };
        }, store);
    }
    function createNprogress() {
        const store = createNprogressStore();
        const actions = {
            start: () => startNavigationProgressAction(store),
            stop: () => stopNavigationProgressAction(store),
            reset: () => resetNavigationProgressAction(store),
            set: (value) => setNavigationProgressAction(value, store),
            increment: () => incrementNavigationProgressAction(store),
            decrement: () => decrementNavigationProgressAction(store),
            complete: () => completeNavigationProgressAction(store),
            cleanup: () => cleanupNavigationProgressAction(store)
        };
        return [store, actions];
    }
    var [nprogressStore, nprogress] = createNprogress();
    var {
        start: startNavigationProgress,
        stop: stopNavigationProgress,
        reset: resetNavigationProgress,
        set: setNavigationProgress,
        increment: incrementNavigationProgress,
        decrement: decrementNavigationProgress,
        complete: completeNavigationProgress,
        cleanup: cleanupNavigationProgress
    } = nprogress;

    // ../esmd/npm/@mantine/nprogress@7.11.1/node_modules/.pnpm/@mantine+nprogress@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/nprogress/esm/NavigationProgress.module.css.mjs
    var classes = { "root": "m_8f2832ae", "section": "m_7a0fe999" };

    // ../esmd/npm/@mantine/nprogress@7.11.1/node_modules/.pnpm/@mantine+nprogress@7.11.1_@mantine+core@7.11.1_@mantine+hooks@7.11.1_react-dom@18.3.1_react@18.3.1/node_modules/@mantine/nprogress/esm/NavigationProgress.mjs
    function NavigationProgress({
        initialProgress = 0,
        color,
        size = 3,
        stepInterval = 500,
        withinPortal = true,
        portalProps,
        zIndex = core.getDefaultZIndex("max"),
        store = nprogressStore,
        ...others
    }) {
        store.initialize({
            mounted: false,
            progress: initialProgress,
            interval: -1,
            step: 1,
            stepInterval,
            timeouts: []
        });
        const state = useNprogress(store);
        react.useEffect(() => () => resetNavigationProgressAction(store), [store]);
        return /* @__PURE__ */ jsxRuntime.jsx(core.OptionalPortal, { ...portalProps, withinPortal, children: /* @__PURE__ */ jsxRuntime.jsx(
            core.Progress,
            {
                radius: 0,
                value: state.progress,
                size,
                color,
                classNames: classes,
                "data-mounted": state.mounted || void 0,
                __vars: { "--nprogress-z-index": zIndex?.toString() },
                ...others
            }
        ) });
    }
    NavigationProgress.displayName = "@mantine/nprogress/NavigationProgress";

    exports.NavigationProgress = NavigationProgress;
    exports.cleanupNavigationProgress = cleanupNavigationProgress;
    exports.cleanupNavigationProgressAction = cleanupNavigationProgressAction;
    exports.completeNavigationProgress = completeNavigationProgress;
    exports.completeNavigationProgressAction = completeNavigationProgressAction;
    exports.createNprogress = createNprogress;
    exports.createNprogressStore = createNprogressStore;
    exports.decrementNavigationProgress = decrementNavigationProgress;
    exports.decrementNavigationProgressAction = decrementNavigationProgressAction;
    exports.incrementNavigationProgress = incrementNavigationProgress;
    exports.incrementNavigationProgressAction = incrementNavigationProgressAction;
    exports.nprogress = nprogress;
    exports.nprogressStore = nprogressStore;
    exports.resetNavigationProgress = resetNavigationProgress;
    exports.resetNavigationProgressAction = resetNavigationProgressAction;
    exports.setNavigationProgress = setNavigationProgress;
    exports.setNavigationProgressAction = setNavigationProgressAction;
    exports.startNavigationProgress = startNavigationProgress;
    exports.startNavigationProgressAction = startNavigationProgressAction;
    exports.stopNavigationProgress = stopNavigationProgress;
    exports.stopNavigationProgressAction = stopNavigationProgressAction;
    exports.updateNavigationProgressStateAction = updateNavigationProgressStateAction;
    exports.useNprogress = useNprogress;

}));
