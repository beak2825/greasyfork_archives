// ==UserScript==
// @name         FextraLife Tweaks
// @description  Implements various tweaks to FextraLife wiki(s)
// @version      1.2
// @author       Magic <magicoflolis@tuta.io>
// @license      MIT
// @icon         https://fextralife.com/wp-content/uploads/2015/07/flswords-152.png
// @namespace    https://github.com/magicoflolis/userscriptrepo/tree/master/FextraLifeTweaks
// @homepageURL  https://github.com/magicoflolis/userscriptrepo/tree/master/FextraLifeTweaks
// @supportURL   https://github.com/magicoflolis/userscriptrepo/issues/new
// @match        https://*.wiki.fextralife.com/*
// @exclude      https://www.wiki.fextralife.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432905/FextraLife%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/432905/FextraLife%20Tweaks.meta.js
// ==/UserScript==

// Defaults are listed at the end of the user script.
let Remove_Clutter = true, // Removes some clutter + wider page
DisableComments = false, // Disables comments
AutoScroll = true, // Automatically scrolls on page load
Scroll_Amount = 202, // Scroll amount for "Top" button.
debug = false;

const fltCSS = `[id^=div-gpt-ad],.ad-banner,#sidebar-wrapper,.wrap>#content-add-a,.section-heading,.collapse-com>#pmalerts,br{content:"" !important;display:none !important;visibility:hidden !important;margin:0px 0px 0px 0px !important;padding:0px 0px 0px 0px !important;width:0px !important;max-width:0px !important;min-width:0px !important;height:0px !important;max-height:0px !important;min-height:0px !important}#cmt-btn,#top-btn{transition:top 100ms ease-in-out 100ms;cursor:pointer;top:100%;font-weight:bold;font-family:inherit;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;height:auto;border-radius:16px;margin:0 3px;line-height:25px;padding:0 20px;text-transform:uppercase;text-align:center;position:fixed;z-index:10000 !important}#cmt-btn{left:1%}#top-btn{right:1%}.collapse-com{cursor:default !important}
`; // Stylesheet

// Userscript Code
"use strict";
const err = (...error)=>{
    console.error("[%cFLT%c] %cERROR", "color: rgb(180, 178, 176);", "", "color: rgb(249, 24, 128);", ...error);
}, info = (...message)=>{
    if (!debug) {
        return;
    };
    console.info("[%cFLT%c] %cINF", "color: rgb(180, 178, 176);", "", "color: rgb(0, 186, 124);", ...message);
}, log = (...message)=>{
    if (!debug) {
        return;
    };
    console.log("[%cFLT%c] %cDBG", "color: rgb(180, 178, 176);", "", "color: rgb(255, 212, 0);", ...message);
}, ael = (elm = document, event, callback)=>{
    return elm.addEventListener(event, callback);
}, create = (element, type, cname, iname, value)=>{
    let el = document.createElement(element);
    type !== "none" ? el.type = type : false;
    cname ? el.className = cname : false;
    iname ? el.id = iname : false;
    value ? el.value = value : false;
    return el;
}, loadCSS = (css, name = "common")=>{
    info("injecting CSS");
    document.head.insertAdjacentHTML('beforeend', `<style id="flt-${name}">${css}</style>`);
},
query = async (element)=>{
    while(document.querySelector(element) === null){
        await new Promise((resolve)=>requestAnimationFrame(resolve)
        );
    }
    return document.querySelector(element);
}, qs = (element)=>{
    return document.querySelector(element);
}, qsA = (element)=>{
    return document.querySelectorAll(element);
}, cmt_btn = create("input", "button", "btn btn-default btn-xs", "cmt-btn", "Comments"), top_btn = create("input", "button", "btn btn-default btn-xs", "top-btn", "Top"), main = ()=>{
    try {
        info("Running script");
        loadCSS(fltCSS);
        query("#wrapper").then((wrapper)=>{
            if (Remove_Clutter) {
                info("Removing clutter");
                wrapper.setAttribute("style", "padding-left: 0px !important");
                qsA("ul").forEach((item, i)=>{
                    qsA("ul")[i].setAttribute("style", "max-width: 100% !important");
                });
            };
            query("button#btnPostCommentu").then((dw)=>{
                if (DisableComments) {
                    info("Hiding comments");
                    qs(".discussion-wrapper").setAttribute("style", 'display: none !important');
                } else {
                    ael(cmt_btn, "click", ()=>{
                        return dw.scrollIntoView();
                    });
                };
            });
            ael(top_btn, "click", ()=>{
                return wrapper.scrollIntoView();
            });
            info("injecting buttons...");
            wrapper.append(top_btn, cmt_btn);
            AutoScroll ? qs("#page-content-wrapper").scrollIntoView() : false;
            ael(document, "scroll", ()=>{
                return document.documentElement.scrollTop > Scroll_Amount ? (top_btn.setAttribute("style", 'top: 90% !important'), !DisableComments ? cmt_btn.setAttribute("style", 'top: 90% !important') : false) : (top_btn.setAttribute("style", 'top: 100% !important'), !DisableComments ? cmt_btn.setAttribute("style", 'top: 100% !important') : false);
            });
            info("Done!");
        });
    } catch (e) {
        error(e);
    };
};
ael(window, "load", main);


/**
* Defaults:
*
* Remove_Clutter = true // Removes some clutter + wider page
* DisableComments = false,
* AutoScroll = true,
* Scroll_Amount = 202 // Set to 0 disables auto scroll AND "Top" button
*/