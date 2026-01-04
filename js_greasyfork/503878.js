// ==UserScript==
// @name         Detect-Nav
// @description  Detect url change on Chrome/Firefox (Greasemonkey, Firemonkey, Violentmonkey, Tampermonkey)
// @author       GTK
// @namespace    https://greasyfork.org/en/users/1352961-gtk
// @version      0.1
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/503878/Detect-Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/503878/Detect-Nav.meta.js
// ==/UserScript==


// ============================================================
// `GMCompat` Compatibility shim
//  adapted from `https://github.com/chocolateboy/gm-compat`
// ============================================================

const $unsafeWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow.wrappedJSObject || unsafeWindow : window;
const GMCompat = Object.freeze({
    unsafeWindow:  $unsafeWindow,

    CLONE_INTO_OPTIONS: {
        cloneFunctions: true,
        target: $unsafeWindow,
        wrapReflectors: true
    },

    EXPORT_FUNCTION_OPTIONS: {
        target: $unsafeWindow,
    },

    apply: function($this, fn, _args) {
        const args = [].slice.call(_args)
        return fn.apply($this, this.cloneInto(args))
    },

    call: function($this, fn, ..._args) {
        const args = this.cloneInto(_args)
        return fn.call($this, ...args)
    },

    cloneInto: function(object, _options) {
        const options = Object.assign({}, this.CLONE_INTO_OPTIONS, _options)
        const _cloneInto = (typeof cloneInto === 'function') ? cloneInto : object => object
        return _cloneInto(object, options.target, options)
    },

    export: function(value, options) {
        return (typeof value === 'function') ? this.exportFunction(value, options) : this.cloneInto(value, options)
    },

    exportFunction: function(fn, _options) {
        const options = Object.assign({}, this.EXPORT_FUNCTION_OPTIONS, _options)
        const _exportFunction = (typeof exportFunction === 'function') ? exportFunction : (fn, { defineAs, target = $unsafeWindow } = {}) => { return defineAs ? (target[defineAs] = fn) : fn }

        return _exportFunction(fn, options.target, options)
    },

    unwrap: function(value) {
        return value ? (value.wrappedJSObject || value) : value
    }
});


// ============================================================
//  Navigation detection & CustomEvent dispatch
// ============================================================

if (window.navigation) {
    console.info('Using Navigation API.');
    window.navigation.addEventListener('navigatesuccess', e => {
        notify(e.type, e.currentTarget.currentEntry.url);
    });

} else if (window.onurlchange === null) {
    console.info('Using window.onurlchange.');
    window.addEventListener('urlchange', e => {
        notify('urlchange', e.url);
    });

} else {
    console.info('Using patch.');
    (window.location.hostname === 'www.youtube.com' ? handleYoutube : patchHistory)();
}



let oldUrl;
function notify(method, url){
    const absUrl = new URL(url || window.location.href, window.location.origin).href;
    const detail = GMCompat.export({ method: method, oldUrl: oldUrl, newUrl: absUrl });
    const event = new CustomEvent('detectnavigate', { bubbles: true, detail: detail });
    document.dispatchEvent(event);
    oldUrl = absUrl;
}

function patchHistory(){
    ['pushState', 'replaceState'].forEach(method => {
        const original = GMCompat.unsafeWindow.history[method];
        const patched = function(){
            GMCompat.apply(this, original, arguments);
            notify(method, arguments[2]);
        };

        GMCompat.unsafeWindow.history[method] = GMCompat.export(patched);
    });

    window.addEventListener('popstate', e => {
        notify(e.type);
    });
}

function handleYoutube(){
    window.addEventListener('yt-navigate-finish', e => {
        notify(e.type, e.detail.response.url);
    });
}