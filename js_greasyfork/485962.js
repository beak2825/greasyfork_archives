// ==UserScript==
// @name         hookPropertyName
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  hook property name
// @author       Gnosis
// ==/UserScript==

function hookPropertyName(prop, getter, setter) {
    const raw_prop = prop + '$raw'
    const has_getter = typeof getter === 'function'
    const has_setter = typeof setter === 'function'
    Object.defineProperty(Object.prototype, prop, {
        get() {
            return has_getter ? (getter.call(this, this[raw_prop]) ?? this[raw_prop]) : this[raw_prop]
        },
        set(val) {
            this[raw_prop] = has_setter ? ((setter.call(this, this[raw_prop], val)) ?? val) : val
        }
    })
}