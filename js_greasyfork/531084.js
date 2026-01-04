(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SVResizeObserver = factory());
})(this, (() => {
    class SVResizeObserver {
        constructor(callback) {
            Object.defineProperty(this, "callback", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: callback
            });
            Object.defineProperty(this, "dataset", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
        }
        /**
         * Observing the specified `Element`.
         *
         * @param target - A reference to an `Element` to be observed.
         */
        observe(target, options) {
            const resizeObserver = new ResizeObserver(() => this._checkChange());
            for (let i = 0; i < target.children.length; i++) resizeObserver.observe(target.children[i]);
            const mutationObserver = new MutationObserver(() => {
                this._checkChange();
                this.unobserve(target);
                this.observe.apply(this, arguments);
            });
            mutationObserver.observe(target, { childList: true });
            const [scrollWidth, scrollHeight] = [target.scrollWidth, target.scrollHeight];
            this.dataset.push({
                target,
                entrie: {
                    target,
                    scrollWidth,
                    scrollHeight,
                    previousScrollWidth: scrollWidth,
                    previousScrollHeight: scrollHeight,
                },
                direction: options === null || options === void 0 ? void 0 : options.direction,
                resize: resizeObserver,
                mutation: mutationObserver
            });
        }
        /**
         * Ends the observing of a specified `Element`.
         *
         * @param target - A reference to an `Element` to be unobserved.
         */
        unobserve(target) {
            const dataset = [];
            for (const data of this.dataset) {
                if (data.target === target) {
                    data.resize.disconnect();
                    data.mutation.disconnect();
                } else dataset.push(data);
            }
            this.dataset = dataset;
        }
        /**
         * Unobserves all observed `Element` targets.
         */
        disconnect() {
            for (const data of this.dataset) {
                data.resize.disconnect();
                data.mutation.disconnect();
            }
            this.dataset = [];
        }
        _checkChange() {
            let hasChange = false;
            const entries = [];
            for (const data of this.dataset) {
                const [scrollWidth, scrollHeight] = [data.target.scrollWidth, data.target.scrollHeight];
                const scrollWidthChange = data.entrie.scrollWidth !== scrollWidth;
                const scrollHeightChange = data.entrie.scrollHeight !== scrollHeight;
                switch (data.direction) {
                    case undefined:
                        hasChange = scrollWidthChange || scrollHeightChange;
                        break;
                    case 'x':
                        hasChange = scrollWidthChange;
                        break;
                    case 'y':
                        hasChange = scrollHeightChange;
                        break;
                }
                data.entrie.previousScrollHeight = data.entrie.scrollHeight;
                data.entrie.previousScrollWidth = data.entrie.scrollWidth;
                data.entrie.scrollWidth = scrollWidth;
                data.entrie.scrollHeight = scrollHeight;
                entries.push(Object.freeze(Object.assign({}, data.entrie)));
            }
            if (hasChange) this.callback(entries, this);
        }
    }
    return SVResizeObserver;
}));