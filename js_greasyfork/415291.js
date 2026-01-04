// ==UserScript==
// @icon https://greasyfork.s3.us-east-2.amazonaws.com/dj7rqyqc1uoe67jap43w07gju9bj
// @name            RespondeAi
// @name:pt-BR      RespondeAi
// @version         3.0
// @namespace       sasd
// @author          R4wwd0G
// @description     Disable the blur effect on answers page.
// @description:pt-br     Disable the blur effect on answers page.
// @include			https://www.respondeai.com.br/*
// @downloadURL https://update.greasyfork.org/scripts/415291/RespondeAi.user.js
// @updateURL https://update.greasyfork.org/scripts/415291/RespondeAi.meta.js
// ==/UserScript==

                 


document.querySelectorAll("*").forEach(a => {
    let b = window.getComputedStyle(a).filter;
    if (b && b.includes("blur")) a.style.filter = "none";
});

Array.from(document.styleSheets).forEach(c => {
    try {
        Array.from(c.cssRules || []).forEach(d => {
            if (d.style && d.style.filter && d.style.filter.includes("blur")) d.style.filter = "none";
        });
    } catch {}
});

let e = document.getElementById("dialog-container");
if (e) e.remove();

const f = new MutationObserver(() => {
    let g = document.getElementById("dialog-container");
    if (g) {
        g.remove();
        f.disconnect();
    }
});

f.observe(document.body, { childList: true, subtree: true });
