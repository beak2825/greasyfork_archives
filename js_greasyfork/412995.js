// ==UserScript==
// @name xzcqa_pro
// @author xzcqa_pro
// @description Just a nametag esp
// @grant GM.xmlHttpRequest
// @match *://krunker.io/*
// @run-at document-start
// @version 0.0.1.20201012214155
// @namespace https://greasyfork.org/users/537157
// @downloadURL https://update.greasyfork.org/scripts/412995/xzcqa_pro.user.js
// @updateURL https://update.greasyfork.org/scripts/412995/xzcqa_pro.meta.js
// ==/UserScript==
(async(f) => {
f = await GM.xmlHttpRequest({
url : "https://krunker.io/social.html",
responseType : "json"
});
b = await GM.xmlHttpRequest({
url : `https://krunker.io/pkg/krunker.${/\w.exports="(\w+)"/.exec(f.responseText)[1]}.vries`,
responseType : "arrayBuffer"
});
c = Array.from(new Uint8Array(b.response));
d = 33 ^ c[0];
e = c.map((c) => {
return String.fromCharCode(c ^ d);
}).join("");
Object.defineProperty(Object.prototype, /if\(!\w+\['(\w+)']\)continue/.exec(e)[1], {
get() {
return 0 == this._ || this._;
},
set(next) {
this._ = next;
}
});
})();