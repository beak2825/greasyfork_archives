// ==UserScript==
// @name        Add quick jump on GitHub link
// @namespace   Violentmonkey Scripts
// @match       https://bluesky.crowdin.com/*
// @grant       none
// @version     2.1
// @author      Signez (@signez.fr)
// @description This adds a "Lookup on GitHub" link in Crowdin interface, to quickly jump to the code to understand how a string is used.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/539992/Add%20quick%20jump%20on%20GitHub%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/539992/Add%20quick%20jump%20on%20GitHub%20link.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function addGithubLink() {
        const suggestions = document.getElementById("suggestions");
        if (suggestions) {
            const context = suggestions.querySelectorAll("#suggestions .translation-context > div");

            for (const contextDiv of context) {
              const githubUrls = (contextDiv?.innerText ?? "")
                .split('\n')
                .filter(line => line.trim().startsWith('#: src/') && line.trim().match(/:([0-9]+)$/))
                .map(line => line.trim().slice(3).replace(/:([0-9]+)$/, '#L$1'))
                .map(path => `https://github.com/bluesky-social/social-app/blob/main/${path}`);

              if (!githubUrls.length) continue;

              const nextElement = contextDiv.nextElementSibling;
              const isGithubLinks = nextElement?.classList.contains('github-links');

              if (isGithubLinks) {
                const links = [...nextElement.querySelectorAll("a")].map((a) => a.href.toString());

                if (links.toString() === githubUrls.toString()) continue;
              }

              const urlCount = githubUrls.length;
              const githubLinks = isGithubLinks ? nextElement : document.createElement("div");

              githubLinks.className = 'github-links';
              githubLinks.style = 'display: flex; flex-flow: row wrap; gap: 5px;';
              githubLinks.replaceChildren(...githubUrls.map((href, idx) => {
                let githubLink = document.createElement("a");
                githubLink.href = href;
                githubLink.target = '_blank';
                githubLink.className = 'github-link';
                githubLink.innerText = idx > 0 ? `[${idx + 1}]` : `Lookup on GitHub${idx === 0 && urlCount > 1 ? ' [1]' : ''}`;
                return githubLink;
              }, []));

              if (!isGithubLinks) {
                contextDiv.after(githubLinks);
              }
            }
        }
    }

    addGithubLink();

    const observer = new MutationObserver((mutations) => {
        addGithubLink();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();