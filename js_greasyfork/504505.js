// ==UserScript==
// @name         X.com to Twitter.com Embedded Tweet in Voz
// @namespace    Embedded Tweet in Voz
// @version      2.1
// @description  Replace x.com links with embedded tweets
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voz.vn
// @author       kylyte
// @match        https://voz.vn/t/*
// @match        https://voz.vn/conversations/*
// @match        https://voz.vn/whats-new/profile-posts/*
// @match        https://voz.vn/u/*
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504505/Xcom%20to%20Twittercom%20Embedded%20Tweet%20in%20Voz.user.js
// @updateURL https://update.greasyfork.org/scripts/504505/Xcom%20to%20Twittercom%20Embedded%20Tweet%20in%20Voz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addTwitterWidgetsScript() {
        if (!document.querySelector('script[src="//platform.twitter.com/widgets.js"]')) {
            const script = document.createElement('script');
            script.src = "//platform.twitter.com/widgets.js";
            script.charset = "utf-8";
            document.head.appendChild(script);
        }
    }
    function replaceDivWithBlockquote() {
        const divs = document.querySelectorAll('div.bbCodeBlock--unfurl');
        divs.forEach(div => {
            const anchor = div.querySelector('a[href^="https://x.com"]');
            if (anchor) {
                const href = anchor.getAttribute('href');
                const postIdMatch = href.match(/status\/(\d+)/);
                if (postIdMatch && postIdMatch[1]) {
                    const postId = postIdMatch[1];
                    const blockquote = document.createElement('blockquote');
                    blockquote.className = "twitter-tweet";
                    const link = document.createElement('a');
                    link.href = `https://twitter.com/twitterapi/status/${postId}`;
                    link.target = "_blank";
                    link.textContent = `https://twitter.com/twitterapi/status/${postId}`;
                    blockquote.appendChild(link);
                    div.parentNode.replaceChild(blockquote, div);
                    addTwitterWidgetsScript();
                }
            }
        });
    }

    window.addEventListener('load', replaceDivWithBlockquote);
    const observer = new MutationObserver(replaceDivWithBlockquote);
    observer.observe(document.body, { childList: true, subtree: true });
})();