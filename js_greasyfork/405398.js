// ==UserScript==
// @name         atcoder-refactor
// @namespace    https://github.com/yoshrc/atcoder-refactor
// @version      1.1
// @description  Rewrites variable names in AtCoder problem statements.
// @author       yoshrc
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405398/atcoder-refactor.user.js
// @updateURL https://update.greasyfork.org/scripts/405398/atcoder-refactor.meta.js
// ==/UserScript==

// TODO
// - Inline edit like IDE's multiselection instead of popup
// - Use Roman font for multiple-character variable names
// - Remove variable name setting ... realized by reset variable name when set empty

(function() {
    'use strict';

    const ID_ATTR = 'data-atcoder-refactor-id';

    const storage = (() => {
        const STORAGE_KEY_PREFIX = 'atcoder-refactor-';
        const contest = location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^/?]+)/)[1];
        const task = location.href.match(/^https:\/\/atcoder\.jp\/contests\/[^/?]+\/tasks\/([^/?]+)/)[1];
        const key = STORAGE_KEY_PREFIX + contest + '-' + task;

        return {
            load: () => {
                const idToNameStr = localStorage[key];
                if (!idToNameStr) {
                    return null;
                } else {
                    return JSON.parse(idToNameStr);
                }
            },

            save: idToName => {
                localStorage[key] = JSON.stringify(idToName);
            }
        };
    })();

    // When handlers called, the following setups must be completed:
    // - for all varaible elements, ID_ATTR attribute must be set
    // - id-name mapping should be set in the storage
    const handlers = (() => {
        const forEachVariable = (id, operationOnElement) => {
            document.querySelectorAll(`[${ID_ATTR}=${id}]`).forEach(elem => {
                operationOnElement(elem);
            });
        };

        return {
            onclick: varElem => {
                const idToName = storage.load();
                const id = varElem.getAttribute(ID_ATTR);
                const oldName = idToName[id];
                const newName = prompt('Set variable name', oldName);
                if (!newName || newName === '') {
                    return;
                }

                forEachVariable(id, elem => {
                    elem.textContent = newName;
                });
                idToName[id] = newName;
                storage.save(idToName);
            }
        };
    })();

    MathJax.Hub.Register.StartupHook('End', () => {
        const isVariable = mathJaxCharElem => mathJaxCharElem.textContent.match(/^[A-Za-z]+$/);
        const forEachVariable = operationOnElement => {
            document.querySelectorAll('.mjx-char').forEach(elem => {
                if (!isVariable(elem)) {
                    return;
                }
                operationOnElement(elem);
            });
        };

        const setupStorage = () => {
            const idToName = {};
            forEachVariable(elem => {
                const id = elem.textContent;
                idToName[id] = id;
            });
            storage.save(idToName);
            return idToName;
        };

        // Storage data gets inconsistent if the problem statement is updated
        const fixInconsistentData = idToName => {
            let hasMissingId = false;
            const unnecessaryIds = new Set(Object.keys(idToName));
            forEachVariable(elem => {
                const id = elem.textContent;
                if (idToName[id]) {
                    unnecessaryIds.delete(id);
                } else {
                    idToName[id] = id;
                    hasMissingId = true;
                }
            });

            if (unnecessaryIds.size !== 0) {
                for (let id of unnecessaryIds) {
                    delete idToName[id];
                }
                return true;
            } else {
                return hasMissingId;
            }
        };

        let idToName = storage.load();
        if (!idToName) {
            idToName = setupStorage();
        } else if (fixInconsistentData(idToName)) {
            storage.save(idToName);
        }

        forEachVariable(elem => {
            const id = elem.textContent;
            elem.setAttribute(ID_ATTR, id);
            elem.textContent = idToName[id];
            elem.onclick = () => handlers.onclick(elem);
        });
    });
})();
