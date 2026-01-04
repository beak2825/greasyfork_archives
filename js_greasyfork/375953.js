// ==UserScript==
// @name        nhentai to exhentai
// @include     /.*nhentai\.net\/g\//
// @run-at      document-end
// @author      Vyre
// @description      grabs title from nhentai and searches for it on exhentai
// @grant       none
// @version 0.0.1.30181226024542
// @namespace https://greasyfork.org/users/235081
// @downloadURL https://update.greasyfork.org/scripts/375953/nhentai%20to%20exhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/375953/nhentai%20to%20exhentai.meta.js
// ==/UserScript==

function Url() {
    var html = document.getElementById("info");
    var title = html.querySelector("h1");
    var title2 = title.innerHTML
    const regex = /<.*?>/gm;
    const subst = ``;
    const result = title2.replace(regex, subst);
    var Link = 'exhentai.org/?f_search='+result;
    window.location.href = '//'+Link;
}
Url();