// ==UserScript==
// @name         Litnet copy text
// @namespace    http://eldor.besaba.com
// @version      0.1
// @description  try to take over the world! OVER WORLD!
// @author       KoctrX
// @match        https://litnet.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40827/Litnet%20copy%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/40827/Litnet%20copy%20text.meta.js
// ==/UserScript==

getTextPage = () => {
    let text = '';
    let title = null;
    b = document.getElementsByClassName('reader-text')[0].children;
    for(let a of b) {
        if(a.tagName.toLowerCase() === 'p' && a.innerHTML) {
            text+=`<p>${a.innerHTML}</p>`;
        }
        if(a.tagName.toLowerCase() === 'h2') { title = a.innerHTML; }
    }
    return openWindow(text? text : getTextInDiv(b), title);
};

openWindow = (text, title) => {
    let html = `<h2>${title? title: ''}</h2>${text}`;
    window.open('','','width=800, height=500')
        .document.write(html);
};

getTextInDiv = (elements) => {
    let text = '';
    for(let el of elements) {
        if(el.tagName.toLowerCase() === 'div' && !el.getAttribute('class')) {
            text += `<p>${el.children[0].innerHTML.replace(/(<span).*?(span>)/g, '')}</p>`;
        }
    }
    return text;
};

function createElement() {
    let d = document.getElementsByClassName('topbar-nav')[0],
    li = document.createElement('li'),
    a = document.createElement('a');
    a.innerHTML = 'Copy Text';
    a.setAttribute('href', '#');
    a.setAttribute('onclick', 'getTextPage();');
    li.appendChild(a);
    d.appendChild(li);
}

(function(){
    createElement();
})();