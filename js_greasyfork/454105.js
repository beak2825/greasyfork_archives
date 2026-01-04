// ==UserScript==
// @name         Laravel docs sidebar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Move the table of contents in laravel docs to a sidebar!
// @author       unoqaz
// @match        https://laravel.com/docs/*
// @icon         https://www.google.com/s2/favicons?domain=laravel.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/454105/Laravel%20docs%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/454105/Laravel%20docs%20sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ele= document.createElement('style');
    ele.type = 'text/css';
    ele.innerHTML = `
    @media only screen and (min-width: 1265px) {
       #main-content > ul { position: fixed; top: 33px; right: 15px; height: calc(100vh - 33px); overflow: auto; padding-right: 10px; width: 15vw; z-index: 999}
       ::-webkit-scrollbar { width: 10px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #888; } ::-webkit-scrollbar-thumb:hover { background: #555; }
    }
    html {
	  scroll-behavior: smooth;
    }
  `;
    document.head.appendChild(ele);

    // https://css-tricks.com/sticky-table-of-contents-with-scrolling-active-states/
    const observer = new IntersectionObserver(entries => {
        entries.some((entry, index, entries) => { //using some so that itteration can be stopped in the case that this IntersectionObserver callback is called when document has just rendered
            const id = entry.target.getAttribute('id');
            const sectionArray = [...document.querySelectorAll('h2[id],h3[id]')]
            const indexOfEntry = sectionArray.indexOf(entry.target)

            const highlightMenuItem = function (id){

                const menuItem = document.querySelector(`#main-content li a[href="#${id}"]`)

                menuItem.style.setProperty('color', "rgba(255,124,117)", 'important')

                if(menuItem.getBoundingClientRect().bottom > document.defaultView.innerHeight || (menuItem.getBoundingClientRect().y < 35)){
                    var timer = null;
                    const scrollMenuInView = function() {
                        if(timer !== null) {
                            clearTimeout(timer);
                        }
                        timer = setTimeout(function() {
                            window.removeEventListener('scroll', scrollMenuInView)
                            menuItem.scrollIntoView({behavior: "smooth", block: "center"})
                        }, 111);
                    }
                    window.addEventListener('scroll', scrollMenuInView);
                }
            }

            if (entry.isIntersecting){
                if (entry.boundingClientRect.top >= entry.rootBounds.top){// entry moving upward
                    [...document.querySelectorAll('#main-content>ul li a[style]:not([style=""])')].forEach(item => {
                        item.style.removeProperty('color')
                    })
                }

                highlightMenuItem(id)
            } else {
                if (entry.boundingClientRect.bottom >= entry.rootBounds.bottom){
                    const idToHighlight = sectionArray[indexOfEntry - 1].id;
                    [...document.querySelectorAll('#main-content>ul li a[style]:not([style=""])')].forEach(item => {
                        item.style.removeProperty('color')
                    })
                    highlightMenuItem(idToHighlight)
                }
                if (entries.length === sectionArray.length) return true; // document just rendered so quit itteration.
            }

        });
    }, {rootMargin: "-144px 0px -55% 0px"});

    document.querySelectorAll('h2[id],h3[id]').forEach((section) => {
        const id = section?.id
        if (id && document.querySelector(`#main-content li a[href="#${id}"]`)) {
            observer.observe(section);
        }
    });

})();