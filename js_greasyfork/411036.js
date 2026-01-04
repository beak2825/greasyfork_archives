// ==UserScript==
// @name         ExP+
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  כי לפעמים צריך לגוון – חווית גלישה נעימה יותר ב־FxP.
// @author       Croason - Niv
// @match        https://www.fxp.co.il/misc.php?do=getsmilies&editorid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411036/ExP%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/411036/ExP%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fxp = document.getElementsByClassName("smilielist")[0];
    fxp.id = "FXP";

    let blocksubhead = document.getElementsByClassName("blocksubhead")[0];

    let style = document.createElement("STYLE");
    style.innerText = `a {
        color: blue !important;
    }`;
    document.head.appendChild(style);

    var url = "https://jsonp.afeld.me/?url=" + encodeURIComponent("https://exparnaki.000webhostapp.com/index.json");
    fetch(url)
    .then(response => response.json())
    .then(data => {

        let catsNames = ["FXP"];

        let h3 = document.createElement("DIV");
h3.className = "blocksubhead"
blocksubhead.after(h3);

h3.innerHTML += `<a href="javascript:niv('FXP')">FXP</a> | `

let cats = [];
for (var cat in data) {
cats.push(cat)
}
for (var cat in data) {
    console.log(cat)
// return;

let ul = document.createElement('ul');
ul.className = 'smilielist';

let catP = cat.split("|");
let catId = catP[0];
let catName = catP[1];

catsNames.push(catId);
ul.id = catId;
ul.hidden = true;
document.querySelector('#smilies .blockrow').append(ul);


h3.innerHTML += `<a href="javascript:niv('${catId}')">${catName}</a>`;
if (cats.indexOf(cat) !== cats.length-1) h3.innerHTML += ` | `;


let Es = data[cat];

for (var E in Es) {
console.log(E)

let name = E;
let url = Es[E];

let s = document.createElement('li');
s.title = name;
s.innerHTML = '<div class="smilie"><div class="table"><div class="tablecell"><img src="' + url + '" id="' + name + '" alt="[img]' + url + '[/img]" title="' + name + '"></div></div></div><div class="label">' + name + '</div>';
ul.append(s);
};
};

    let niv = document.createElement("SCRIPT");
    let s = document.createTextNode(`
        let nivCats = "${catsNames}".split(",");

        const niv = id => {
        document.querySelectorAll('ul')
        .forEach(element => {
        if (!nivCats.includes(element.id)) return;
        element.hidden = element.id !== id;
        })
        }

        let nivCats2 = "${catsNames}".split(",").slice(1);

        for (const category of nivCats2) {
            window.opener.vB_Editor[new URLSearchParams(location.search).get('editorid')].init_smilies(fetch_object(category));
        }`);
    niv.appendChild(s);
    document.head.appendChild(niv)
});
})();