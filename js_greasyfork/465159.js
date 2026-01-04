// ==UserScript==
// @name         sakura_hover_ruby
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  only display rubytext when you mouse over, otherwise hide
// @author       Mescyn
// @match        https://jgrpg-sakura.com/reader/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jgrpg-sakura.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465159/sakura_hover_ruby.user.js
// @updateURL https://update.greasyfork.org/scripts/465159/sakura_hover_ruby.meta.js
// ==/UserScript==

// code all originally from fernap3
// https://gist.github.com/fernap3/4203b036e44359463d6d4e749e74ed01
(function() {
    'use strict';
document.addEventListener("mouseover", (evt) =>
{
    const ruby = evt.target;

    if (ruby.tagName !== "RUBY")
    {
        return;
    }

    for (const rt of [...ruby.querySelectorAll("rt")])
    {
        rt.style.opacity = "";
    }
});

document.addEventListener("mouseout", (evt) =>
{
    const ruby = evt.target;

    if (ruby.tagName !== "RUBY")
    {
        return;
    }

    for (const rt of [...ruby.querySelectorAll("rt")])
    {
        rt.style.opacity = "0";
    }
});

const allRt = document.querySelectorAll("rt");
for (const rt of allRt)
{
    rt.style.opacity = "0";
}
})();