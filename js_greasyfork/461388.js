// @ts-check
// ==UserScript==
// @name         Mindfulgram for Instagram
// @version      0.8
// @description  Mindfulgram allows you to use Instagram in a mindful way, by removing the addictive content consuming aspects, and just leaving the useful aspects. Learn more on https://www.mindfulgram.app
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @namespace    MINDFULGRAM.APP
// @author       MINDFULGRAM.APP
// @supportURL   https://www.mindfulgram.app
// @downloadURL https://update.greasyfork.org/scripts/461388/Mindfulgram%20for%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/461388/Mindfulgram%20for%20Instagram.meta.js
// ==/UserScript==

(function () {
  'use strict';
  {
    const $0dc44d32083a85be$var$throttle = (func, timeFrame)=>{
    let lastTime = 0;
    let timeoutId;
    const throttledFunc = ()=>{
        const timeSinceLastCall = Date.now() - lastTime;
        const runFunc = ()=>{
            func();
            lastTime = Date.now();
            timeoutId = undefined;
        };
        if (timeSinceLastCall >= timeFrame) {
            clearTimeout(timeoutId);
            runFunc();
        } else if (!timeoutId) timeoutId = window.setTimeout(runFunc, timeFrame - timeSinceLastCall);
    };
    return throttledFunc;
}; // Nuke explore and reels page
const $0dc44d32083a85be$var$nukeExploreAndReelsPage = ()=>{
    const _URL = new URL(window.location.href), pathname = _URL.pathname;
    const main = document.querySelector("main");
    const exploreRootPath = "/explore/";
    const reelsRootPath = "/reels/";
    if (pathname === exploreRootPath || pathname.startsWith(reelsRootPath)) {
        if (main) {
            main.style.display = "none";
            return;
        }
    }
    if (main) main.style.display = "flex";
};
const $0dc44d32083a85be$var$nukeStories = ()=>{
    const stories = Array.from(document.querySelectorAll('button[aria-label^="Story by"]'));
    stories.forEach((elem)=>elem.style.visibility = "hidden");
};
const $0dc44d32083a85be$var$nukePostsFromPeopleYouDontFollow = ()=>{
    const posts = Array.from(document.querySelectorAll('article[role="presentation"]'));
    const _URL2 = new URL(window.location.href), pathname = _URL2.pathname;
    const unwantedPosts = posts.filter((post)=>{
        if (pathname !== "/") return false; // if you're not on the root page, don't hide
        const button = post.querySelector("article button");
        if (button && button.textContent === "Follow") return true; // if you don't follow the person, hide
        const header = post.querySelector("header");
        if (header && header.textContent && header.textContent.toLowerCase().includes("Paid partnership".toLowerCase())) return true; // if it is an ad, obviously, hide
        return false; // default to not hiding
    });
    unwantedPosts.forEach((elem)=>elem.style.visibility = "hidden");
};
const $0dc44d32083a85be$var$nukeCommentsOnFeed = ()=>{
    const comments = Array.from(document.querySelectorAll('article[role="presentation"] button svg[aria-label="Like"], article[role="presentation"] button svg[aria-label="Unlike"]'));
    comments.forEach((post)=>{
        const btn = post.closest("button");
        const elmToHide = btn && btn.parentElement && btn.parentElement.parentElement && btn.parentElement.parentElement.parentElement && btn.parentElement.parentElement.parentElement.parentElement;
        if (elmToHide) {
            const roleAttribute = elmToHide.getAttribute("role");
            if (roleAttribute !== "presentation") elmToHide.style.visibility = "hidden";
        }
    });
};
const $0dc44d32083a85be$var$nukeCommentsOnPostPage = ()=>{
    const comments = Array.from(document.querySelectorAll('article[role="presentation"] ul ul'));
    comments.forEach((elem)=>elem.style.visibility = "hidden");
};
const $0dc44d32083a85be$var$nukeCommentsOnCommentsPage = ()=>{
    const _URL3 = new URL(window.location.href), pathname = _URL3.pathname;
    if (pathname.endsWith("/comments/")) {
        const moreComments = Array.from(document.querySelectorAll("h3"));
        moreComments.forEach((elem)=>{
            const grandParent = elem.parentElement && elem.parentElement.parentElement && elem.parentElement.parentElement.parentElement;
            if (grandParent) grandParent.style.visibility = "hidden";
        });
    }
};
const $0dc44d32083a85be$var$main = ()=>{
    $0dc44d32083a85be$var$nukeExploreAndReelsPage();
    $0dc44d32083a85be$var$nukeStories();
    $0dc44d32083a85be$var$nukePostsFromPeopleYouDontFollow();
    $0dc44d32083a85be$var$nukeCommentsOnFeed();
    $0dc44d32083a85be$var$nukeCommentsOnPostPage();
    $0dc44d32083a85be$var$nukeCommentsOnCommentsPage();
};
const $0dc44d32083a85be$export$af6040c61d629c1c = ()=>{
    const throttledMain = $0dc44d32083a85be$var$throttle($0dc44d32083a85be$var$main, 250);
    const observer = new MutationObserver(()=>throttledMain());
    observer.observe(document, {
        subtree: true,
        attributes: true
    });
};


(0, $0dc44d32083a85be$export$af6040c61d629c1c)();



  }
})();
