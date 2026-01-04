// ==UserScript==
// @name         Pastebin skipper for NSFW Leak Telegram Channels
// @description  Autoredirect to the links found in pastebin pages used as intermediary steps to get to the final download link.
// @version      1.0
// @namespace    https://greasyfork.org/users/980489
// @match        https://pastelink.net/*
// @match        https://rentry.org/*
// @match        https://rentry.co/*
// @match        https://justpaste.it/*
// @match        https://telegra.ph/*
// @match        https://graph.org/*
// @match        https://pastemode.com/*
// @match        https://notecanyon.com/*
// @match        https://pastetoday.com/*
// @match        https://pastecanyon.com/*
// @match        https://leakutopia.click/b/*
// @match        https://pastetoday.com/clone/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/516871/Pastebin%20skipper%20for%20NSFW%20Leak%20Telegram%20Channels.user.js
// @updateURL https://update.greasyfork.org/scripts/516871/Pastebin%20skipper%20for%20NSFW%20Leak%20Telegram%20Channels.meta.js
// ==/UserScript==

//---Pastebin skipper----
(function() {
    "use strict";

    function processLinks(selector) {
        const admavenDomains = ["best-links.org", "free-leaks.com"];
        const l1nkv3rt1s3Domains = ["direct-link.net", "link-target.net", "link-hub.net", "link-center.net", "link-to.net"];
        const shortenerDomains = ["vnshortener.com"];
        const filehostDomains = ["mega.nz", "pixeldrain.com", "1fichier.com", "mediafire.com", "gofile.io", "bunkr", "dood", "dooood"];
        const domains = admavenDomains.concat(l1nkv3rt1s3Domains, shortenerDomains, filehostDomains);
        let foundLinks = [];
        const links = document.querySelectorAll(selector);
        links.forEach(link => {
            domains.forEach(domain => {
                if (link.href.includes(domain)) {
                    //alert(link.href);
                    foundLinks.push(link.href);
                }
            });
        });
        if (foundLinks.length === 1) {
            window.location.href = foundLinks[0];
        }
    }

    //document.addEventListener("DOMContentLoaded", function() {

        if (/^https:\/\/(pastelink\.net|rentry\.org|rentry\.co|justpaste\.it|telegra\.ph|graph\.org)\/.*$/.test(window.location.href)) {
            //alert('ok1');
            //document.addEventListener("DOMContentLoaded", function() {
                processLinks('a');
            //});


        } else if (/^https:\/\/(pastemode\.com|notecanyon\.com|pastecanyon\.com|pastetoday\.com)\/.*$/.test(window.location.href)) {
            function waitForLinks() {
                const observer = new MutationObserver((mutations, obs) => {
                    if (document.querySelector('a.url-link')) {
                        obs.disconnect();
                        processLinks('a.url-link');
                    }
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
            //document.addEventListener("DOMContentLoaded", function() {
                waitForLinks();
            //});


        } else if (/^https:\/\/(leakutopia\.click)\/.*$/.test(window.location.href)) {
            //document.addEventListener("DOMContentLoaded", function() {
                processLinks('a.text-\\[\\#3366CC\\]:nth-child(1)');
                setInterval(() => processLinks('a.text-\\[\\#3366CC\\]:nth-child(1)'), 1000); // Check every 1 seconds
            //});


        } else if (/^https:\/\/pastetoday\.com\/clone\/.*$/.test(window.location.href)) {
            //window.addEventListener('load', function() {
                const textarea = document.querySelector('textarea.form-control');
                if (textarea && textarea.value.includes('mega.nz')) {
                    const megaLinkMatch = textarea.value.match(/https:\/\/mega\.nz[^\s]+/);
                    if (megaLinkMatch) {
                        window.location.href = megaLinkMatch[0];
                    }
                }
            //});


        }

    //});

})();
//---Pastebin skipper----
