// ==UserScript==
// @name                Twitter/X filter media tab
// @namespace           https://greasyfork.org/users/821661
// @match               https://x.com/*
// @grant               GM_addStyle
// @version             1.3
// @author              hdyzen
// @description         filter twitter/x media tab
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/539500/TwitterX%20filter%20media%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/539500/TwitterX%20filter%20media%20tab.meta.js
// ==/UserScript==

function createFilterButtons() {
	const filterContainer = document.createElement("div");
	filterContainer.id = "media-filter-controls";
	filterContainer.style.cssText = `
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            border-radius: 12px;
            padding: 6px;
            gap: 8px;
            backdrop-filter: blur(10px);
        `;


	const allBtn = document.createElement("button");
	allBtn.id = "all";
	allBtn.textContent = "All";
	allBtn.onclick = () => document.body.removeAttribute("filter-by");

	const imagesBtn = document.createElement("button");
	imagesBtn.id = "images";
	imagesBtn.textContent = "Images";
	imagesBtn.onclick = () => document.body.setAttribute("filter-by", "images");

	const videosBtn = document.createElement("button");
	videosBtn.id = "videos";
	videosBtn.textContent = "Videos";
	videosBtn.onclick = () => document.body.setAttribute("filter-by", "videos");

	filterContainer.appendChild(allBtn);
	filterContainer.appendChild(imagesBtn);
	filterContainer.appendChild(videosBtn);

	document.body.appendChild(filterContainer);
}
createFilterButtons();

GM_addStyle(`
    body:not([filter-by]) #media-filter-controls #all, [filter-by="images"] #media-filter-controls #images, [filter-by="videos"] #media-filter-controls #videos {
        background:rgb(26, 77, 216) !important;
        scale: 1.05 !important;
    }
    body:has([data-testid="primaryColumn"] [role="navigation"] [href$="/media"][aria-selected="true"]) #media-filter-controls {
        display: flex !important;
    }
    #media-filter-controls > button {
        padding: 6px 12px;
        border: none;
        border-radius: 8px;
        background: #1d9bf0;
        color: white;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
    }
    [filter-by="videos"] [data-testid="primaryColumn"]:has([role="navigation"] [href$="/media"][aria-selected="true"]) [role="region"] [role="listitem"]:has(a[href*="/photo/"]) {
        display: none;
    }
    [filter-by="images"] [data-testid="primaryColumn"]:has([role="navigation"] [href$="/media"][aria-selected="true"]) [role="region"] [role="listitem"]:has(a[href*="/video/"]) {
        display: none;
    }
    [data-testid="primaryColumn"]:has([role="navigation"][aria-live="polite"]) section[role="region"]:has(> h1[role="heading"] + div[aria-label^="Timeline:"] > div > div[data-testid="cellInnerDiv"]) > div {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 4px;
        margin: 4px 4px 0;
    }
    [data-testid="primaryColumn"]:has([role="navigation"][aria-live="polite"]) section[role="region"]:has(> h1[role="heading"] + div[aria-label^="Timeline:"] > div > div[data-testid="cellInnerDiv"]) > div *:not([role="listitem"], [role="listitem"] *) {
        display: contents;
    }
`);
