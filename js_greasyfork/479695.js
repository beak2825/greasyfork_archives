// ==UserScript==
// @name         עכלב שבמערע
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.fxp.co.il/private_chat.php?do=showpm&pmid=*
// @match        https://discord.com/channels/*
// @match        https://www.fxp.co.il/show*
// @icon         https://i.imagesup.co/images2/1f5b29851f85a4af094405438bc2820dc9f1763a.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479695/%D7%A2%D7%9B%D7%9C%D7%91%20%D7%A9%D7%91%D7%9E%D7%A2%D7%A8%D7%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/479695/%D7%A2%D7%9B%D7%9C%D7%91%20%D7%A9%D7%91%D7%9E%D7%A2%D7%A8%D7%A2.meta.js
// ==/UserScript==
const discord = ['**ע**', '*ע*', '~~ע~~'];
const fxp = ['[B]ע[/B]', '[I]ע[/I]', '[U]ע[/U]'];

function replacer(text, symbols) {
    let index = 0;
    return text.replace(/א|ה|ע/g, function() {
        const symbol = symbols[index % symbols.length];
        index++;
        return symbol;
    });
}

XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.send = function(data) {
    if (/postreply|editpost|private_chat/.test(this._url)) {
        const searchParams = new URLSearchParams(data);
        const message = decodeURIComponent(searchParams.get('message'));
        const final = message.split('E]').map(v => (v.includes('[QU') ? v + 'E]' : replacer(v, fxp))).join('');
        searchParams.set('message', final);
        data = searchParams.toString();
    } else if (this._url.endsWith('/messages')) {
        data = replacer(data, discord);
    }
    this.realSend(data);
}
XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    this.realOpen.apply(this, arguments);
}