// ==UserScript==
// @name         Ecosia DuckDuckGo button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a DuckDuckGo button to Ecosia search page.
// @author       reagent
// @modsby       str0be
// @match        https://www.ecosia.org/search?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/392707/Ecosia%20DuckDuckGo%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/392707/Ecosia%20DuckDuckGo%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const icon = document.createElement("img");
    icon.src = "https://www.google.com/s2/favicons?domain=www.duckduckgo.com";

    const link = document.createElement("a");
    link.setAttribute("class", "navbar-link");
    link.appendChild(icon);
    link.appendChild(document.createTextNode("DuckDuckGo"));

    const updateLink = search => link.setAttribute("href", "https://duckduckgo.com/?q=" + encodeURIComponent(search));

    // Class for knowing when element was added to DOM, for hooking events and such
    // Assumes that once element is added, it wont be removed again.
    class DomWatch{
        constructor(){
            this.awaiting = [];
            this.watching = false;
            this.obs = new MutationObserver(this.onMutations.bind(this));
        }
        watch(){
            this.watching = true;
            this.obs.observe(document, {subtree:true, childList: true});
        }
        on(selector, ...fns){
            const found = document.querySelector(selector);
            if(found){
                fns.forEach(fn => fn(found));
                return this;
            }

            const i = this.awaiting.findIndex(item => item.selector === selector);
            if(i === -1){
                this.awaiting.push({selector, fns});
            }else{
                this.awaiting[i].fns = this.awaiting[i].fns.concat(fns);
            }
            if(!this.watching){
                this.watch();
            }

            return this;

        }
        off(){
            this.watching = false;
            this.obs.disconnect();
        }
        onMutations(muts) {
            for(const mut of muts){
                const item = this.awaiting.findIndex(({selector}) => mut.target.matches(selector));
                if(item !== -1){
                    this.awaiting[item].fns.forEach(fn => fn(mut.target));
                    this.awaiting.splice(item, 1);
                }else{
                    let queried = null;
                    const item = this.awaiting.findIndex(({selector}) => queried = mut.target.querySelector(selector));

                    if(item !== -1){
                        this.awaiting[item].fns.forEach(fn => fn(queried));
                        this.awaiting.splice(item, 1);
                    }
                }
                if(this.watching && !this.awaiting.length){
                    return this.off();
                }
            }
        }
    }

    const watch = new DomWatch();

    watch.on("nav.navbar-row", row => {
        const webButton = row.querySelector("div li");
        const search = document.querySelector("input.search-form-input");

        webButton.parentNode.insertBefore((() => {
            let el = document.createElement("li");
            el.setAttribute("class", "navbar-item navbar-item-vertical");
            el.appendChild(link);
            return el;
        })(), webButton)


        if(!search) return console.error("No search found");
        search.addEventListener("keydown", e => updateLink(search.value))

        updateLink(search.value);
    });
})();