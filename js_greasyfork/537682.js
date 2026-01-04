// ==UserScript==
// @name              GitHub Boldless Title
// @namespace         https://github.com/Vinfall/UserScripts
// @version           1.2.3
// @author            Vinfall
// @match             https://github.com/*
// @match             https://gist.github.com/*
// @exclude-match     https://gist.github.com/auth/*
// @exclude-match     https://gist.github.com/join*
// @exclude-match     https://gist.github.com/login
// @exclude-match     https://github.com/*/*/actions/runs/*
// @exclude-match     https://github.com/*/*/actions/workflows/*
// @exclude-match     https://github.com/*/*/blob/*/*
// @exclude-match     https://github.com/*/*/commit/*
// @exclude-match     https://github.com/*/*/compare/*
// @exclude-match     https://github.com/*/*/graphs/*
// @exclude-match     https://github.com/*/*/issues*
// @exclude-match     https://github.com/*/*/pull/*/files
// @exclude-match     https://github.com/*/*/pulls*
// @exclude-match     https://github.com/*/*/tree/*/*
// @exclude-match     https://github.com/copilot
// @exclude-match     https://github.com/copilot/*
// @exclude-match     https://github.com/git/git/*
// @exclude-match     https://github.com/login
// @exclude-match     https://github.com/login?*
// @exclude-match     https://github.com/login/
// @exclude-match     https://github.com/sessions/*
// @exclude-match     https://github.com/signin
// @grant             none
// @run-at            document-end
// @license           CC0 1.0 Universal (Public Domain)
// @description       Remove strong style in GitHub repo/gist title
// @description:zh-cn GitHub 仓库名取消加粗
// @downloadURL https://update.greasyfork.org/scripts/537682/GitHub%20Boldless%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/537682/GitHub%20Boldless%20Title.meta.js
// ==/UserScript==

(() => {
    function replaceStrongWithAnchor() {
        const isGist = window.location.href.includes('gist');
        const selector = isGist ? 'strong[itemprop="name"].css-truncate-target.mr-1' : 'strong.mr-2.flex-self-stretch';

        const strongElements = document.querySelectorAll(selector);
        for (const strong of strongElements) {
            const anchor = strong.querySelector('a'); // Select the <a> tag inside <strong>
            if (anchor) {
                // Create a new <a> element
                const newAnchor = document.createElement('a');
                newAnchor.href = anchor.href; // Preserve the href
                newAnchor.textContent = anchor.textContent; // Preserve the text content

                // Replace the <strong> element with the new <a> element in the DOM
                strong.parentNode.replaceChild(newAnchor, strong);
            }
        }
    }

    // Run after the window has fully loaded
    window.onload = () => {
        replaceStrongWithAnchor();

        // Observe changes in the page (e.g., for dynamic content)
        const observer = new MutationObserver((_mutations) => {
            replaceStrongWithAnchor();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
})();
