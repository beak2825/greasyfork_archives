// ==UserScript==
// @name         Wahapedia Datasheet Customiser
// @namespace    https://github.com/hamsolo474/
// @version      1.2
// @description  Lets you use the datasheet page of Wahapedia as your game doc
// @author       hamsolo474
// @match        https://wahapedia.ru/*/datasheets.html
// @grant        none
// @license      MIT; https://opensource.org/license/MIT
// @downloadURL https://update.greasyfork.org/scripts/505765/Wahapedia%20Datasheet%20Customiser.user.js
// @updateURL https://update.greasyfork.org/scripts/505765/Wahapedia%20Datasheet%20Customiser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = document.querySelector('#wrapper');
    let divs = container.querySelectorAll('.dsOuterFrame');
    let anchors = container.querySelectorAll('.dsOuterFrame');
    let triples = [];
    let elements = Array.from(container.children);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].tagName.toLowerCase() === 'a'
            && elements[i + 1].tagName.toLowerCase() === 'div'
            && elements[i + 2].tagName.toLowerCase() === 'div') {
            triples.push({ anchor: elements[i], div: elements[i + 1], br: elements[i + 2] });
        }
    }

    triples.forEach((triple, index) => {
        let {anchor, div, br } = triple;

        let indexNum = document.createTextNode(index);

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.style.marginLeft = '10px';
        removeButton.style.padding = '5px';
        removeButton.style.cursor = 'pointer';


        let upButton = document.createElement('button');
        upButton.textContent = 'Up';
        upButton.style.marginLeft = '10px';
        upButton.style.padding = '5px';
        upButton.style.cursor = 'pointer';


        let downButton = document.createElement('button');
        downButton.textContent = 'Down';
        downButton.style.marginLeft = '10px';
        downButton.style.padding = '5px';
        downButton.style.cursor = 'pointer';

        div.appendChild(indexNum);
        div.appendChild(removeButton);
        div.appendChild(upButton);
        div.appendChild(downButton);

        removeButton.addEventListener('click', function() {
            anchor.remove();
            div.remove();
            br.remove();
        });

        upButton.addEventListener('click', function() {
            let prevIndex = triples.findIndex(p => p.anchor === anchor) - 1;
            let prevTriple = triples[prevIndex];
            container.insertBefore(anchor, prevTriple.anchor);
            container.insertBefore(div, prevTriple.div);
            container.insertBefore(br, prevTriple.br);
            triples.splice(prevIndex, 0, triples.splice(prevIndex+1, 1)[0]);
        });

        downButton.addEventListener('click', function() {
            let nextIndex = triples.findIndex(p => p.anchor === anchor) + 1;
            let nextTriple = triples[nextIndex];
            container.insertBefore(anchor, nextTriple.anchor);
            container.insertBefore(div, nextTriple.div);
            container.insertBefore(br, nextTriple.br);
            triples.splice(nextIndex, 0, triples.splice(nextIndex-1, 1)[0]);
        });
    });
})();
