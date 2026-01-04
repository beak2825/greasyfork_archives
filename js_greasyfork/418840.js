// ==UserScript==
// @name Krunker NameTags
// @description NameTags On A Toggle using the [ C ] Key
// @version 0.1
// @author SkidLamer - From The Gaming Gurus
// @supportURL https://discord.gg/2uqj5Y6h7s
// @homepage https://skidlamer.github.io/
// @match *.krunker.io/*
// @exclude *krunker.io/social*
// @run-at document-start
// @grant none
// @noframes
// @namespace https://greasyfork.org/users/704479
// @downloadURL https://update.greasyfork.org/scripts/418840/Krunker%20NameTags.user.js
// @updateURL https://update.greasyfork.org/scripts/418840/Krunker%20NameTags.meta.js
// ==/UserScript==

let rndStr = sz => [...Array(sz)].map(_ => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[~~(Math.random()*52)]).join('');
const _SKID = rndStr(8);
window.Function = new Proxy(Function, {
    construct(target, args) {
        const that = new target(...args);
        if (args.length) {
            let string = args[args.length - 1];
            if (string.length > 38e5) {
                string = `Object.defineProperty(window, "${_SKID}", { value: { nametags: 0 } }) \n document.addEventListener('keydown', e => { switch(e.code) { case "KeyT": window["${_SKID}"].nametags ^= 1; break;} });` + string;
                string = String.prototype.replace.call(string, /windows\['length'\]>\d+.*?0x25/, `0x25`);
                string = String.prototype.replace.call(string, /&&(\w+\['\w+'])\){(if\(\(\w+=\w+\['\w+']\['\w+']\['\w+'])/, `){if(!$1&&!window["${_SKID}"].nametags)continue;$2`);
            }
            if (args[args.length - 1] !== string) {
                args[args.length - 1] = string;
                let patched = new target(...args);
                patched.toString = () => that.toString();
                return patched;
            }
        }
        return that;
    }
})