// ==UserScript==
// @name         Reddit Multi Column
// @namespace    https://gist.github.com/c6p/463892bb243f611f2a3cfa4268c6435e
// @version      0.2.6
// @description  Multi column layout for reddit redesign
// @author       Can Altıparmak
// @homepageURL  https://gist.github.com/c6p/463892bb243f611f2a3cfa4268c6435e
// @match        https://www.reddit.com/*
// @match        https://new.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371490/Reddit%20Multi%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/371490/Reddit%20Multi%20Column.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    const MIN_WIDTH = 400;
    const COLUMNS = 4;
    let columns = COLUMNS;
    let cleanup = null;

    let parent = null;
    const cardIcon = () => document?.querySelector('shreddit-sort-dropdown[header-text="View"]')?.shadowRoot?.querySelector('svg');
    const shouldClean =(icon) => icon === undefined ? false : icon.getAttribute('icon-name') !== "view-card-outline";
    cleanup = shouldClean()

    let postMap = new Map()

    const indexOfSmallest = function (a) {
        let lowest = 0;
        for (let i = 1; i<a.length; i++) {
            if (a[i] < (a[lowest]-1)) lowest = i;
        }
        return lowest;
    };

    const makeLayout = function(changes=[]) {
        if (cleanup) return;
        if (!parent) return;

        if (parent.style.position !== "relative") {
            document.querySelector("main").style.maxWidth = "100%";
            const mainContainer = document.querySelector("div.main-container");
            mainContainer.className = [...mainContainer.classList].filter(c => !c.includes(":grid-cols-")).join(" ") // make wide
            document.querySelector("div.subgrid-container").classList.remove("m:w-[1120px]") // make wide
            document.getElementById("right-sidebar-container").style.display = "none" // hide sidebar
            parent.style.position = "relative"
        }

        const cols = Math.floor(parent.offsetWidth / MIN_WIDTH);
        columns = cols;
        const WIDTH = Math.floor((100-columns)/columns);


        const nodes = [...parent.querySelectorAll("article, shreddit-ad-post, faceplate-partial").values()]
        for (const article of nodes) {
            const key = article.ariaLabel
            if (key === null) /* faceplate-partial */ {
            } else if (key in postMap) {
                const post = postMap[key]
                if (post.height !== article.offsetHeight) {
                     post.height = article.offsetHeight
                }
            } else {
                postMap.set(key, {height:article.offsetHeight, col:0, top:0})
            }
        }

        let tops = Array(columns).fill(0);
        for (const post of postMap.values()) {
            post.col = indexOfSmallest(tops)
            post.top = tops[post.col]
            tops[post.col] += post.height
        }
        const height = Math.max(...tops)
        if (height) {
            parent.style.height = height + 500 + "px"
        }

        for (const article of nodes) {
            const key = article.ariaLabel
            const {col, top} = postMap.get(key) ?? {col:0, top:tops[0]}
            article.setAttribute("style", cleanup ? "" : `position:absolute; width:${WIDTH}%; top:${top}px; left:${col*(WIDTH+1)}%`)
        }

        for (const batch of parent.querySelectorAll("faceplate-batch").values()) {
            if (!batch.style.height) {
                batch.style.height = [...batch.childNodes].reduce((height,c) => height + c.clientHeight, 0) + "px"
            }
        }
    };

    const setLayout = function(changes, observer) {
        const c = shouldClean(cardIcon());
        if (c !== cleanup) {
            cleanup = c;
            window.requestAnimationFrame(makeLayout)
        }
    };

    const requestLayout = () => window.requestAnimationFrame(makeLayout)
    const pageChange = new MutationObserver(requestLayout);
    window.addEventListener('resize', requestLayout);
    window.addEventListener('scrollend', requestLayout);
    const layoutSwitch = new MutationObserver(setLayout);

    const watch = function(changes, observer) {
        postMap = new Map()
        parent = document.querySelector("article + hr + faceplate-partial").parentNode
        if (parent === null) return;
        pageChange.observe(parent, {childList: true});
        const timeout = setTimeout(() => {
            const icon = cardIcon();
            if (icon !== undefined) {
                clearTimeout(timeout);
                layoutSwitch.observe(icon, {attributes: true});
            }
        })
        window.requestAnimationFrame(makeLayout);
    };

    const apply = new MutationObserver(watch);
    const app = document.querySelector("shreddit-app")
    apply.observe(app, {attributes: true});
    watch();
})();