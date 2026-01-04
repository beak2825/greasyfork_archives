// ==UserScript==
// @name         YouTube Links Preview
// @namespace    https://wilchan.org
// @version      1.0
// @description  Umożliwia podgląd linków do YT. W przeciwieństwie do rozszerzenia na embedy pokazuje jedynie tytuł i przenosi na YT po kliknięciu.
// @author       Anonimas
// @match        https://wilchan.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wilchan.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510249/YouTube%20Links%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/510249/YouTube%20Links%20Preview.meta.js
// ==/UserScript==

let iconCss = document.createElement("style");
iconCss.innerHTML = `a.yt-link::before { content: ""; background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAYAAABr5z2BAAABIklEQVQoz53LvUrDUBjG8bOoOammSf1IoBSvoCB4JeIqOHgBLt6AIMRBBQelWurQ2kERnMRBsBUcIp5FJSBI5oQsJVkkUHh8W0o5nhaFHvjBgef/Mq+Q46RJBMkI/vE+aOus956tnEswIZe1LV0QyJ5sE2GzgZfVMtRNIdiDpccEssdlB1mW4bvTwdvWJtRdErM7U+8S/FJykCRJX5qm+KpVce8UMNLRLbulz4iSjTAMh6Iowsd5BeNadp3nUF0VlxAEwZBotXC0Usa4ll3meZdA1iguwvf9vpvDA2wvmKgYGtSud8suDB4TyGr2PF49D/vra9jRZ1BVdknMzgwuCGSnZEObwu6sBnVTCHZiaC7BhFx2PKdxUidiAH/4lLo9Mv0DELVs9qsOHXwAAAAASUVORK5CYII=') center left no-repeat!important; padding-left: 18px; }`;
document.head.appendChild(iconCss);

async function replaceLink(element) {
    if (element.href.search(/youtube\.com|youtu\.be/i) > -1) {
        let response = await fetch(`https://www.youtube.com/oembed?url=${element.href}&format=json`);
        if (response.ok) {
            let json = await response.json();
            element.textContent = json.title;
            element.classList.add("yt-link");
        }
    }
}

document.querySelectorAll(".message a[href]:not(.outcoming-post-mention)").forEach(a => {
    replaceLink(a);
})


window.addEventListener("after-create-post-section-element-event", function (event) {
    let section = event.detail.element;
    section.querySelectorAll(".message a[href]:not(.outcoming-post-mention)").forEach(a => {
        replaceLink(a);
    })
}, false);

