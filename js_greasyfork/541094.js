// ==UserScript==
// @name         Enhance Incubator Plus 2.0
// @namespace    https://lit.link/toracatman
// @version      2026-01-15
// @description  Enhances Incubator Plus 2.0.
// @author       トラネコマン
// @match        https://incubator.miraheze.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541094/Enhance%20Incubator%20Plus%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/541094/Enhance%20Incubator%20Plus%2020.meta.js
// ==/UserScript==

let css = `
.allpagesredirect a {
    color: green;
}
.delete {
    color: red !important;
}
`;

(() => {
    let style = document.createElement("style");
    style.textContent = css;
    document.body.appendChild(style);

    let member = {};
    let dct = "Category:Maintenance:Delete";
    fetch(`${location.origin}/w/api.php?action=query&list=categorymembers&cmtitle=${dct}&cmprop=title&cmlimit=500&format=json`)
        .then((response) => response.json())
        .then((data) => {
        let m = data.query.categorymembers;
        for (let i = 0; i < m.length; i++) {
            member[m[i].title] = true;
        }
        let a = document.querySelectorAll("#bodyContent a");
        for (let i = 0; i < a.length; i++) {
            if (a[i].title in member) {
                a[i].classList.add("delete");
            }
        }
    });
})();