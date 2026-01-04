// ==UserScript==
// @name        DevDocs TOC
// @namespace   what.ever
// @match       https://devdocs.io/*
// @run-at      document-idle
// @grant       none
// @version     0.3
// @author      sleazy-su
// @description add table of content.
// @downloadURL https://update.greasyfork.org/scripts/498249/DevDocs%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/498249/DevDocs%20TOC.meta.js
// ==/UserScript==

let itv = -1;
function debounce(func, interval){
    if(itv == -1){
        itv = setTimeout(()=>{
            itv = -1;
            func();
        }, interval);
    }else{
        clearInterval(itv);
        itv = -1;
        debounce(func, interval);
    }
}

addToc();
const observer = new MutationObserver(()=>{debounce(addToc, 800)});
observer.observe(document.querySelector('._container'), { childList: true, subtree: true });

function addToc() {
    console.log('updating toc...');

    document.querySelector('#toc-container')?.remove();
    const container = document.createElement('div');
    container.id = 'toc-container';
    container.innerText = 'TOC';
    container.dataset.tagName = container.tagName;
    container.innerHTML = `<style>
        #toc-container{ position: fixed; top: 0; right: 0; height: 100vh; overflow: auto; color: var(--textColor); }
        .toc-item{ cursor: pointer; margin: 0; }
        .toc-item.hide-children::before { content: '+ '; }
        .toc-item.hide-children *{ display: none; }
    </style>`;

    const appWidth = document.querySelector('._app').clientWidth;
    const leftMargin = (document.body.clientWidth - appWidth) / 2 + appWidth;
    container.style.left = leftMargin + 'px';

    const titleEls = document.querySelectorAll('h1, h2, h3');
    const level = { DIV: 0, H1: 1, H2: 2, H3: 3 };

    let parentEl = container;
    const pairs = { titleEls: [], tocEls: [] };
    for (let titleEl of titleEls) {
        const lv = level[titleEl.tagName];
        while (lv <= level[parentEl.dataset.tagName]) {
            parentEl = parentEl.parentElement;
        }
        const tocEl = document.createElement('ul');
        tocEl.innerText = titleEl.innerText;
        tocEl.dataset.tagName = titleEl.tagName;
        tocEl.classList.add('toc-item');
        parentEl.append(tocEl);
        parentEl = tocEl;
        pairs['titleEls'].push(titleEl);
        pairs['tocEls'].push(tocEl);
    }

    document.body.append(container);
    container.addEventListener('click', ev => {
        const index = pairs['tocEls'].indexOf(ev.target);
        pairs['titleEls'][index]?.scrollIntoView();
    });
    container.addEventListener('contextmenu', ev => {
        ev.preventDefault();
        if (ev.target.children.length > 0) {
            const clazz = ev.target.classList;
            const hideFlag = 'hide-children';
            if (clazz.contains(hideFlag)) {
                clazz.remove(hideFlag);
            } else {
                clazz.add(hideFlag);
            }
        }
    });
}
