// ==UserScript==
// @name                Reddit show username in all
// @namespace           https://greasyfork.org/users/821661
// @match               https://www.reddit.com/*
// @grant               none
// @version             0.1
// @author              hdyzen
// @description         Show username hover card in posts
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/539536/Reddit%20show%20username%20in%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/539536/Reddit%20show%20username%20in%20all.meta.js
// ==/UserScript==

const observer = new MutationObserver(() => {
	const nodes = document.querySelectorAll("shreddit-post:not(:has([slot='authorName']))");

	for (const node of nodes) {
		const authorName = node.getAttribute("author");
		const avatarUrl = node.getAttribute("icon");
		const creditBar = node.querySelector("[id^='feed-post-credit-bar-']");

		creditBar.insertAdjacentHTML("beforeend", getTemplate(authorName, avatarUrl));
	}
});

observer.observe(document, { childList: true, subtree: true });

function getTemplate(authorName, avatarUrl) {
	return `
    <span slot="authorName"
        class="flex items-center text-neutral-content visited:text-neutral-content-weak font-bold a cursor-pointer">
        <div class="inline-flex items-center max-w-full">

            <faceplate-hovercard enter-delay="500" leave-delay="150" position="bottom-start" data-id="user-hover-card"
                label="${authorName}" mouse-only>
                <faceplate-tracker source="post_credit_bar" action="click" noun="user_profile" class="visible">
                    <span
                        class="inline-flex items-center justify-center w-[1.5rem] h-[1.5rem] nd:visible nd:block nd:animate-pulse nd:bg-neutral-background-selected  mr-2xs"
                        rpl="" avatar="">

                        <span rpl="" class="inline-block rounded-full relative [&>:first-child]:h-full [&>:first-child]:w-full [&>:first-child]:mb-0 [&>:first-child]:rounded-[inherit] h-full w-full [&>:first-child]:overflow-hidden [&>:first-child]:max-h-full">
                            <img src="${avatarUrl}"
                                alt="${authorName}" loading="lazy">
                        </span></span>
                    <a rpl
                        class="author-name whitespace-nowrap text-neutral-content visited:text-neutral-content-weak focus-visible:-outline-offset-1 a cursor-pointer no-visited no-underline hover:no-underline"
                        style="vertical-align: super;"
                        href="/user/${authorName}/">${authorName}</a>
                </faceplate-tracker>
                <div slot="content">
                    <faceplate-partial src="/svc/shreddit/user-hover-card/${authorName}"
                        loading="programmatic">
                        <div class="w-5xl h-4xl flex items-center justify-center">
                            <faceplate-progress value="20" class="animate-spin"></faceplate-progress>
                        </div>
                    </faceplate-partial>
                </div>
            </faceplate-hovercard>
        </div>
    </span>
    `;
}
