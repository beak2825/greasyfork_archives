(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
    typeof define === 'function' && define.amd ? define(['react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.useResizeObserver = factory(global.React));
})(this, (function (react) { 'use strict';
    /* esm.sh - esbuild bundle(use-resize-observer@9.1.0) es2022 development */
    // ../esmd/npm/use-resize-observer@9.1.0/node_modules/.pnpm/use-resize-observer@9.1.0_react-dom@18.3.1_react@18.3.1/node_modules/use-resize-observer/dist/bundle.esm.js
    function useResolvedElement(subscriber, refOrElement) {
        var lastReportRef = react.useRef(null);
        var refOrElementRef = react.useRef(null);
        refOrElementRef.current = refOrElement;
        var cbElementRef = react.useRef(null);
        react.useEffect(function() {
            evaluateSubscription();
        });
        var evaluateSubscription = react.useCallback(function() {
            var cbElement = cbElementRef.current;
            var refOrElement2 = refOrElementRef.current;
            var element = cbElement ? cbElement : refOrElement2 ? refOrElement2 instanceof Element ? refOrElement2 : refOrElement2.current : null;
            if (lastReportRef.current && lastReportRef.current.element === element && lastReportRef.current.subscriber === subscriber) {
                return;
            }
            if (lastReportRef.current && lastReportRef.current.cleanup) {
                lastReportRef.current.cleanup();
            }
            lastReportRef.current = {
                element,
                subscriber,
                // Only calling the subscriber, if there's an actual element to report.
                // Setting cleanup to undefined unless a subscriber returns one, as an existing cleanup function would've been just called.
                cleanup: element ? subscriber(element) : void 0
            };
        }, [subscriber]);
        react.useEffect(function() {
            return function() {
                if (lastReportRef.current && lastReportRef.current.cleanup) {
                    lastReportRef.current.cleanup();
                    lastReportRef.current = null;
                }
            };
        }, []);
        return react.useCallback(function(element) {
            cbElementRef.current = element;
            evaluateSubscription();
        }, [evaluateSubscription]);
    }
    function extractSize(entry, boxProp, sizeType) {
        if (!entry[boxProp]) {
            if (boxProp === "contentBoxSize") {
                return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
            }
            return void 0;
        }
        return entry[boxProp][0] ? entry[boxProp][0][sizeType] : (
            // TS complains about this, because the RO entry type follows the spec and does not reflect Firefox's current
            // behaviour of returning objects instead of arrays for `borderBoxSize` and `contentBoxSize`.
            // @ts-ignore
            entry[boxProp][sizeType]
        );
    }
    function useResizeObserver(opts) {
        if (opts === void 0) {
            opts = {};
        }
        var onResize = opts.onResize;
        var onResizeRef = react.useRef(void 0);
        onResizeRef.current = onResize;
        var round = opts.round || Math.round;
        var resizeObserverRef = react.useRef();
        var _useState = react.useState({
            width: void 0,
            height: void 0
        }), size = _useState[0], setSize = _useState[1];
        var didUnmount = react.useRef(false);
        react.useEffect(function() {
            didUnmount.current = false;
            return function() {
                didUnmount.current = true;
            };
        }, []);
        var previous = react.useRef({
            width: void 0,
            height: void 0
        });
        var refCallback = useResolvedElement(react.useCallback(function(element) {
            if (!resizeObserverRef.current || resizeObserverRef.current.box !== opts.box || resizeObserverRef.current.round !== round) {
                resizeObserverRef.current = {
                    box: opts.box,
                    round,
                    instance: new ResizeObserver(function(entries) {
                        var entry = entries[0];
                        var boxProp = opts.box === "border-box" ? "borderBoxSize" : opts.box === "device-pixel-content-box" ? "devicePixelContentBoxSize" : "contentBoxSize";
                        var reportedWidth = extractSize(entry, boxProp, "inlineSize");
                        var reportedHeight = extractSize(entry, boxProp, "blockSize");
                        var newWidth = reportedWidth ? round(reportedWidth) : void 0;
                        var newHeight = reportedHeight ? round(reportedHeight) : void 0;
                        if (previous.current.width !== newWidth || previous.current.height !== newHeight) {
                            var newSize = {
                                width: newWidth,
                                height: newHeight
                            };
                            previous.current.width = newWidth;
                            previous.current.height = newHeight;
                            if (onResizeRef.current) {
                                onResizeRef.current(newSize);
                            } else {
                                if (!didUnmount.current) {
                                    setSize(newSize);
                                }
                            }
                        }
                    })
                };
            }
            resizeObserverRef.current.instance.observe(element, {
                box: opts.box
            });
            return function() {
                if (resizeObserverRef.current) {
                    resizeObserverRef.current.instance.unobserve(element);
                }
            };
        }, [opts.box, round]), opts.ref);
        return react.useMemo(function() {
            return {
                ref: refCallback,
                width: size.width,
                height: size.height
            };
        }, [refCallback, size.width, size.height]);
    }
    return useResizeObserver;
}));