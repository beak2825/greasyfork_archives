

    // ==UserScript==
    // @name         Hide Shipped and Sponsored Items in Facebook Marketplace
    // @icon         https://www.google.com/s2/favicons?domain=facebook.com
    // @version      1.0.6
    // @description  Hide sponsored and shipped posts in facebook marketplace
    // @match        *://*.facebook.com/marketplace*
    // @exclude      *://*.facebook.com/marketplace/item*
    // @grant        none
    // @author       Russell Aaron Wright III
    // @namespace    AaronWright3.scripts
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433800/Hide%20Shipped%20and%20Sponsored%20Items%20in%20Facebook%20Marketplace.user.js
// @updateURL https://update.greasyfork.org/scripts/433800/Hide%20Shipped%20and%20Sponsored%20Items%20in%20Facebook%20Marketplace.meta.js
    // ==/UserScript==

    // Options for the observer (which mutations to observe)
    const config = { childList: true, attributes: true, subtree: true }

    const isExternalURL = (url) => new URL(url).origin !== location.origin;

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
        if (!window.location.href.includes("item")) {
            { //sponsored facebook listings
                let xpath = "//a[contains(@href,'li.facebook.com') or contains(@href,'l.facebook.com')]";
                let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (matchingElement && matchingElement.closest("span")) {
                    try {
                        matchingElement.closest("span").parentNode.style.display = "none";
                        matchingElement.closest("span").remove();
                    }
                    catch(e) {
                        console.log(matchingElement);
                    }
                }
            }
            { //more sponsored facebook listings
                let xpath = "//a[contains(@href, '?__cft__') and not(contains(@href, '/marketplace'))]";
                let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (matchingElement && matchingElement.closest("span")) {
                    try {
                        matchingElement.closest("span").parentNode.style.display = "none";
                        matchingElement.closest("span").remove();
                    }
                    catch(e) {
                        console.log(matchingElement);
                    }
                }
            }
            { //sponsored facebook listings with an href of '#' (this was a tough one)
                let matchingElement = document.querySelector('a.oajrlxb2.gs1a9yip.g5ia77u1.mtkw9kbi.tlpljxtp.qensuy8j.ppp5ayq2.goun2846.ccm00jje.s44p3ltw.mk2mc5f4.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.rq0escxv.nhd2j8a9.q9uorilb.mg4g778l.btwxx1t3.pfnyh3mw.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.tgvbjcpo.hpfvmrgz.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.l9j0dhe7.i1ao9s8h.esuyzwwr.f1sip0of.du4w35lb.lzcic4wl.n00je7tq.arfg74bv.qs9ysxi8.k77z8yql.abiwlrkh.p8dawk7l.k4urcfbm[href="#"]');
                if (matchingElement && matchingElement.closest("span")) {
                    try {
                        matchingElement.closest("span").parentNode.style.display = "none";
                        matchingElement.closest("span").remove();
                    }
                    catch(e) {
                        console.log(matchingElement);
                    }
                }
            }
            { //sponsored posts or posts that ship to you
                let xpath = "//span[text()='Sponsored' or text()='Ships to you']";
                let matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (matchingElement) {
                    if (matchingElement.closest(".sonix8o1")) {
                        matchingElement.closest(".sonix8o1").parentNode.style.display = "none";
                        matchingElement.closest(".sonix8o1").remove();
                    } else if (matchingElement.closest("a")) {
                        matchingElement.closest("a").parentNode.style.display = "none";
                        matchingElement.closest("a").remove();
                    }
                }
            }
            { //I don't remember what this one is
                let matchingElement = document.querySelector("div.rq0escxv.j83agx80.cbu4d94t.i1fnvgqd.muag1w35.pybr56ya.f10w8fjw.k4urcfbm.c7r68pdi.suyy3zvx");
                if (matchingElement && matchingElement.childElementCount < 3) {
                    console.warn("IT WORKS!!!");
                    if (matchingElement.closest(".sonix8o1")) {
                        matchingElement.closest(".sonix8o1").parentNode.style.display = "none";
                        matchingElement.closest(".sonix8o1").remove();
                    } else if (matchingElement.closest("a")) {
                        matchingElement.closest("a").parentNode.style.display = "none";
                        matchingElement.closest("a").remove();
                    }
                }
            }
            { // removes new style of listings that display the seller icon
                let matchingElement = document.querySelector("div.aov4n071.jifvfom9.idiwt2bm.j83agx80");
                if (matchingElement && matchingElement.childElementCount < 3) {
                    console.warn("IT WORKS!!!");
                    if (matchingElement.closest(".sonix8o1")) {
                        matchingElement.closest(".sonix8o1").parentNode.style.display = "none";
                        matchingElement.closest(".sonix8o1").parentNode.parentNode.style.display = "none";
                        matchingElement.closest(".sonix8o1").remove();
                    } else if (matchingElement.closest("a")) {
                        matchingElement.closest("a").parentNode.style.display = "none";
                        matchingElement.closest("a").remove();
                    }
                }
            }
        }
    }

    // Create an observer instance linked to the callback function and observe
    new MutationObserver(callback).observe(document, config)

window.onLoad = function() {
    callback()
}

