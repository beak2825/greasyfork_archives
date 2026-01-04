// ==UserScript==
// @name              Scratch Question mark fix
// @name:zh-cn        谁家问号暗飞声？
// @name:ja           ハテナマークを何とか消せるやつ
// @namespace         ScratchStorageFix
// @version           1.0
// @description       Fix question marks on Scratch without reloading.
// @description:zh-cn 修复 Scratch 问号问题而无需刷新页面。
// @description:ja    リロード不要でハテナマーク問題をバッチリ解決。
// @author            FurryR
// @license           MIT
// @match             https://scratch.mit.edu/projects/*
// @match             https://aerfaying.com/Projects/*
// @match             https://gitblock.cn/Projects/*
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/519361/Scratch%20Question%20mark%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/519361/Scratch%20Question%20mark%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default to 64 for best performance.
    const MAX_PARALLEL_REQUESTS = 64;

    function trap(callback) {
        const _bind = Function.prototype.bind;
        Function.prototype.bind = function (self2, ...args) {
            if (typeof self2 === "object" && self2 !== null && Object.prototype.hasOwnProperty.call(self2, "editingTarget") && Object.prototype.hasOwnProperty.call(self2, "runtime")) {
                Function.prototype.bind = _bind;
                callback(self2);
                return _bind.call(this, self2, ...args);
            }
            return _bind.call(this, self2, ...args);
        };
    }
    function withResolvers() {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { resolve, reject, promise };
    }
    trap(vm => {
        const attachStorage = vm.runtime.attachStorage;
        vm.runtime.attachStorage = storage => {
            let reqs = [];
            const load = storage.load;
            storage.load = async (...args) => {
                const { resolve, reject, promise } = withResolvers();
                reqs.push({ resolve, reject, args });
                return promise;
            };
            requestIdleCallback(function idle() {
                const processReqs = reqs.splice(0, MAX_PARALLEL_REQUESTS);
                Promise.allSettled(processReqs.map(req => load.call(storage, ...req.args).then(req.resolve, req.reject))).then(() => {
                    requestIdleCallback(idle);
                });
            });
            return attachStorage.call(vm.runtime, storage);
        };
    });
})();