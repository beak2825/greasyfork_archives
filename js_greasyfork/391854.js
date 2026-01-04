// ==UserScript==
// @name         Enum
// @namespace    hoehleg.userscripts.private
// @version      0.3
// @description  Enumeration class. Each enum propertiy has the properties "ordinal", "name" and "text".
// @author       Gerrit Höhle
// @grant        none
// ==/UserScript==

/* jslint esnext: true */
const Enum = class EnumBase {

    constructor({ name, ordinal, text } = {}) {
        if (new.target === EnumBase) {
            throw TypeError("Instantiation of abstract enum class");
        }

        if (typeof text !== "undefined") {
            text = String(text);
        }

        Object.assign(this, {
            get ordinal() { return ordinal; },
            get name() { return name; },
            get text() { return text; }
        });
    }

    valueOf() { 
        return this.ordinal; 
    }

    toString() { 
        return (typeof this.text === "undefined") ? this.name : this.text;
    }

    static init(enumDef = [], firstOrdinal = 0, ordinalSupplier = previousOrdinal => previousOrdinal + 1) {
        if (Object.isFrozen(this)) {
            throw TypeError("Reinitialization of finalized enum class");
        }

        let ordinal;
        const ordinals = [];
        for (let enumDefObj of (Array.isArray(enumDef) ? enumDef : [ enumDef ])) {
            if (typeof enumDefObj !== 'object') {
                enumDefObj = { [enumDefObj]: undefined };
            }
            for (let [name, text] of Object.entries(enumDefObj)) {
                ordinal = Number.parseInt((typeof ordinal === "undefined") ? firstOrdinal : ordinalSupplier(ordinal));
                console.assert(typeof this[name] === "undefined", `duplicate enum [${name}]`);
                console.assert(typeof this[ordinal] === "undefined", `duplicate ordinal [${ordinal}] for enum [${name}]`);

                this[name] = new this({ ordinal, name, text });
                Object.defineProperty(this, ordinal, { 
                    value: this[name] 
                });

                ordinals.push(ordinal);
            }
        }

        const enums = ordinals.sort().map(ordinal => this[ordinal]);
        Object.defineProperty(this, Symbol.iterator, { value: () => enums[Symbol.iterator]() });

        return Object.freeze(this);
    }
};