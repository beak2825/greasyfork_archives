// ==UserScript==
// @name         TOC to RFC
// @namespace    https://github.com/nameldk/user-script
// @version      0.1
// @description  add TOC menu to RFC.
// @author       nameldk
// @match        https://datatracker.ietf.org/doc/html/*
// @icon         https://www.google.com/s2/favicons?domain=ietf.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427502/TOC%20to%20RFC.user.js
// @updateURL https://update.greasyfork.org/scripts/427502/TOC%20to%20RFC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let elList = document.querySelectorAll('.h1,.h2,.h3,.h4,.h5');
    let elUl = document.createElement('ul');
    elUl.id = 'my-toc';
    elList.forEach(elH => {
        let text = elH.innerText;
        let elA = elH.querySelector('a');
        let elLi = document.createElement('li');
        elLi.className = 'my-' + elH.className;
        if (elA && elA.href) {
            let elLia = document.createElement('a');
            elLia.href = elA.href;
            elLia.innerText = text;
            elLi.appendChild(elLia);
        } else {
            elLi.innerText = text;
        }
        elUl.appendChild(elLi);
    });
    document.body.appendChild(elUl);

    let style = `<style>
#my-toc {
    position: fixed;
    top: 10px;
    right: 10px;
    max-height: 600px;
    max-width: 450px;
    overflow-y: scroll;
    list-style: none;
}
#my-toc li {
    padding: 2px 0;
}
#my-toc a {
    text-decoration: none;
}
#my-toc .my-h3 {
    margin-left: 10px;
}
#my-toc .my-h4 {
    margin-left: 20px;
}
#my-toc .my-h5 {
    margin-left: 30px;
}
</style>`;
    document.body.insertAdjacentHTML('beforeend', style);
})();