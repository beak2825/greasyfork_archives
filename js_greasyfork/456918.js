// ==UserScript==
// @name         Reddit Mobile Enhancement
// @namespace    https://greasyfork.org/users/28298
// @version      1.2
// @description  Remove annoying reminder when using reddit mobile webpage! Auto-expand posts in new reddit.
// @author       Jerry
// @match        *://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @run-at       document-end
// @license      GNU GPLv3
// @require      https://greasyfork.org/scripts/456410-gmlibrary/code/GMLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/456918/Reddit%20Mobile%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/456918/Reddit%20Mobile%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //*************************************************************
    // works for ios safari
    setTimeout(function() {
      var button = findx('//button[text()="Continue"]'); 
      if (button !== null) {
        button.click();
        // triggerevent(button,'click');  // weird, not working.
      }
    }, 2000);

    //*************************************************************
    // works for android kiwi, but not for ios safari
    // copied from https://greasyfork.org/en/scripts/456374-hide-reddit-install-app-notifications
    const localStorageItems = ["xpromo-consolidation", "bannerLastClosed"];
    const stylesheet = `
    .XPromoPopup, .XPromoBottomBar, .TopNav__promoButton, slot[name=use-app], shreddit-async-loader[bundlename=bottom_bar_xpromo] {
        display: none;
    }
    `;
 
    function setLocalStorageItems(localStorageItems) {
        for (const item of localStorageItems) {
            localStorage.setItem(item, new Date().toString());
        }
    }
 
    function appendStylesheet(stylesheet) {
        let head = document.getElementsByTagName("head")[0];
        let s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(stylesheet));
        head.appendChild(s);
    }
 
    setLocalStorageItems(localStorageItems);
    appendStylesheet(stylesheet);

    //*************************************************************
    // copied from https://greasyfork.org/en/scripts/451949-reddit-auto-expand/code
    var excluded_posts = [];
    var auto_expand = true;
 
    function onKeyup(evt) {
        // Use https://keycode.info/ to get keys
        // ` shortcut
        if (evt.keyCode == 192) {
            // expando();
            auto_expand = !auto_expand;
            if (auto_expand) {
                window.alert("Auto-expand enabled.");
            }
            else {
                window.alert("Auto-expand disabled.");
            }
        }
    }
    function mouseClicked(event) {
        const elem = event.target;
        if (elem.className.includes("icon-expand")) {
            // add the post to the excluded list
            const post_id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            if (!excluded_posts.includes(post_id)) {
                excluded_posts.push(post_id);
            }
 
        }
        if (elem.className.includes("icon-collapse")) {
            // add the post to the excluded list
            const post_id = elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
            if (!excluded_posts.includes(post_id)) {
                excluded_posts.push(post_id);
            }
        }
 
    }
    function getPostId(iconElement) {
        let id = iconElement.id;
        while(iconElement !== undefined && (id === undefined || id === "")) {
            iconElement = iconElement.parentElement;
            id = iconElement.id;
        }
        return id;
    }
    function autoExpand() {
        if (auto_expand && !window.location.href.includes("/comments/")) {
            let icons = document.getElementsByClassName("icon-expand");
            for (const icon of icons) {
                const postId = getPostId(icon);
                if (!excluded_posts.includes(postId)) {
                    let button = icon.parentNode
                    button.click();
                }
            }
        }
    }
 
    if (!window.location.href.includes("/comments/")) {
        // listen to "`" to enable / disable auto_expand
        document.addEventListener('keyup', onKeyup, true);
        // listen to click to add to excluded list
        document.addEventListener("click", mouseClicked);
        // listen to page scroll to expand new content
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(function(mutations, observer) {
            autoExpand();
        });
        // TODO: probably tuning this can improve performances
        observer.observe(document, {
            subtree: true,
            attributes: true
        });
    }
})(); // end of main function
