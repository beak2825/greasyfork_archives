// ==UserScript==
// @name         LocalStorage Clear for Fairfax sites
// @namespace
// @version      0.5.18
// @description  Clear your browser for Local Storage
// @author       ptooey, c/o (https://greasyfork.org/en/scripts/368407-localstorage-clear/code)

// @include *smh.com.au/*
// @include *theage.com.au/*
// @include *brisbanetimes.com.au/*
// @include *watoday.com.au/*
// @include *drive.com.au/*

// @grant        none

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/389738/LocalStorage%20Clear%20for%20Fairfax%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/389738/LocalStorage%20Clear%20for%20Fairfax%20sites.meta.js
// ==/UserScript==
const _usrscr_debug = false;

console.group('userscript');
const resetAllCookie = () => {
    if (_usrscr_debug) console.log(`%c${document.cookie}`, 'color: #00f;');
    const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    const _keys = document.cookie && document.cookie.split(';').map(k => k.trim());
    if (keys && false) {
        if (_usrscr_debug) console.log(keys);
        for(var i = keys.length; i--;) {
            var out = keys[i] + '=0;expires=' + new Date(0).toUTCString();
            if (_usrscr_debug) console.log('%c_%s', 'color: 060;', out);
            document.cookie = out;
        }
    }
    if (_keys) {
        if (_usrscr_debug) console.log(_keys);
        _keys.reverse().forEach(key => {
            const _k = /^([^=]*)=(.*)$/.exec(key),
                  r = [_k[1], '=0;expires=', new Date(0).toUTCString()].join('');
            if (_usrscr_debug) console.log('%c%o: %s', 'color: #09f;', (_o = {}) && (_o[_k[1]] =_k[2]) && _o, r);
            document.cookie = r;
        });
    }
}

if (window.localStorage) {
    localStorage.clear();
    resetAllCookie();
    console.info(`%cUser script loaded %o %c%s`, 'color: #0c9;', localStorage, 'color: #096;', document.cookie);
}
console.groupEnd();