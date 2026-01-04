// ==UserScript==
// @name        Texture Replacer
// @version     0.6.7
// @description ok
// @author      nyannez
// @match       *://*.sploop.io/
// @run-at      document-start
// @namespace https://greasyfork.org/users/960747
// @downloadURL https://update.greasyfork.org/scripts/488374/Texture%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/488374/Texture%20Replacer.meta.js
// ==/UserScript==

//here example

const patterns = {
    ["/items/platform.png"]:  "https://media.discordapp.net/attachments/1046598378647208097/1131063732043264103/0dd9ff4b3ac3a40f.png?ex=65dea72f&is=65cc322f&hm=53b091d4826e17204049df57283e0471a7aacbc3fc13cfe9c3c5c01410140de2&=&format=webp&quality=lossless",
    ["/entity/platform.png"]:  "https://media.discordapp.net/attachments/1046598378647208097/1131063732043264103/0dd9ff4b3ac3a40f.png?ex=65dea72f&is=65cc322f&hm=53b091d4826e17204049df57283e0471a7aacbc3fc13cfe9c3c5c01410140de2&=&format=webp&quality=lossless"
};

const src = Object.getOwnPropertyDescriptor(Image.prototype, "src").set;
Object.defineProperty(Image.prototype, "src", {
    set(link) {
        const replace = Object.entries(patterns).find(a => link.match(a[0]));
        if (replace) {
            link = replace[1];
        }
        return src.call(this, link);
    }
})