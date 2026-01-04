// ==UserScript==
// @name         DATA_TABLE_COLUMN
// @namespace    hoehleg.userscripts.private
// @version      0.1
// @description  columns object for datatables.net
// @author       Gerrit Höhle
// @require      https://greasyfork.org/scripts/391854-enum/code/Enum.js?version=746956
// @require      https://greasyfork.org/scripts/391608-privateproperty/code/PrivateProperty.js?version=744693
// @grant        none
// ==/UserScript==

/* jshint esnext: true */
/* globals Enum, PrivateProperty */
const DATA_TABLE_COLUMN = (() => {
    
    const _renderFunctions = new PrivateProperty();

    return class DATA_TABLE_COLUMN extends Enum {
   
        constructor(...args) {
            super(...args);

            _renderFunctions.set(this, {});

            Object.defineProperties(this, {
                title: {
                    value: this.text, enumerable: true
                },
                data: {
                    get() {
                        return this._data || null;
                    },
                    set(value) {
                        this._data = value;
                    },
                    enumerable: true
                },
                render: {
                    value: (data, type, row, meta) => {
                        const fnc = _renderFunctions.get(this)[type];
                        return  fnc ? fnc(data, row, meta) : data;
                    },
                    enumerable: true
                }
            });
        }

        set renderFunctions({ any, filter = any, display = any, type = any, sort = any }) { 
            _renderFunctions.set(this, Object.fromEntries(Object.entries({ filter, display, type, sort }).filter(([, v]) => typeof v === "function")));
        }

        get renderFunctions() {        
            return _renderFunctions.get(this);
        }
    };
})();