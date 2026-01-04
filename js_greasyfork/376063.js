t// ==UserScript==
// @name         Link to XPI
// @namespace    https://github.com/AHOHNMYC
// @version      0.0.1
// @author       AHOHNMYC
// @description  Adds direct links to XPI
// @match        https://addons.mozilla.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376063/Link%20to%20XPI.user.js
// @updateURL https://update.greasyfork.org/scripts/376063/Link%20to%20XPI.meta.js
// ==/UserScript==

let jsonEl = document.getElementById`redux-store-state`;
if (jsonEl) {
    let v = JSON.parse(jsonEl.textContent).versions.byId;
	for (let s in v) {
        let l = document.createElement`a`;
        let u = v[s].platformFiles.all.url;
        u = u.substr(0, u.indexOf`?`); // <- url to XPI
        l.href = u;
        l.textContent = `id ${s} : ${u}`;
        l.style.color = 'red';
        document.body.insertBefore(document.createElement`br`, document.body.firstElementChild);
        document.body.insertBefore(l, document.body.firstElementChild);
    }
}
