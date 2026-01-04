// ==UserScript==
// @name         Webnovel TagFilter
// @namespace    https://greasyfork.org/en/users/1200276-awesome4
// @author       Awesome
// @version      1.1
// @description  Effortlessly hide or include novels with specific tags on Webnovel.com. Filter novels for a more tailored reading experience.
// @match        https://www.webnovel.com/stories/*
// @match        https://www.webnovel.com/tags/*
// @icon         https://www.yueimg.com/en/images/w_icon.090a4bad.svg
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478011/Webnovel%20TagFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/478011/Webnovel%20TagFilter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let excludedTags = [];
    let includedTags = [];
    let structureVersion;

    if (window.location.pathname.startsWith("/stories/")) {
        structureVersion = "new";
    } else if (window.location.pathname.startsWith("/tags/")) {
        structureVersion = "old";
    }

    function hideNovels(novels, getNovelTags, hideNovel) {
        novels.forEach(novel => {
            const novelTags = getNovelTags(novel);
            const containsExcludedTag = excludedTags.some(tag => novelTags.includes(tag.toLowerCase()));
            const containsIncludedTag = includedTags.length === 0 || includedTags.some(tag => novelTags.includes(tag.toLowerCase()));
            hideNovel(novel, containsExcludedTag || !containsIncludedTag);
        });
    }

    function hideNovelsNewStructure() {
        const novels = document.querySelectorAll('p.mb4.pt4.oh.h16.mb8');
        hideNovels(novels, novel => Array.from(novel.getElementsByTagName('a')).map(tag => tag.textContent.toLowerCase().replace('# ', '')), (novel, shouldHide) => {
            novel.closest('li.fl').style.display = shouldHide ? "none" : "block";
        });
    }

    function hideNovelsOldStructure() {
        const novels = document.querySelectorAll('div[data-report-dt="cbid"]');
        hideNovels(novels, novel => Array.from(novel.querySelectorAll(".g_tags a")).map(tag => tag.textContent.toLowerCase()), (novel, shouldHide) => {
            novel.style.display = shouldHide ? "none" : "block";
        });
    }

    function handleInfiniteScrollChanges(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (structureVersion === "new") {
                    hideNovelsNewStructure();
                } else if (structureVersion === "old") {
                    hideNovelsOldStructure();
                }
            }
        }
    }

    const observer = new MutationObserver(handleInfiniteScrollChanges);
    const filterOptionsDiv = document.createElement("div");
    filterOptionsDiv.style.display = "flex";
    filterOptionsDiv.style.flexDirection = "row";
    filterOptionsDiv.style.alignItems = "center";
    
    const excludedTagsDiv = document.createElement("div");
    const excludedTagsInput = document.createElement("input");
    excludedTagsInput.type = "text";
    excludedTagsInput.placeholder = "Exclude tags, separated by commas";
    excludedTagsInput.style.border = "1px solid #ccc";
    excludedTagsInput.style.borderRadius = "5px";
    excludedTagsInput.style.padding = "5px";
    excludedTagsInput.style.marginBottom = "10px";
    excludedTagsDiv.style.width = "50%";
    excludedTagsInput.style.width = "100%";
    
    
    const includedTagsDiv = document.createElement("div");
    const includedTagsInput = document.createElement("input");
    includedTagsInput.type = "text";
    includedTagsInput.placeholder = "Include tags, separated by commas (leave empty to show all)";
    includedTagsInput.style.border = "1px solid #ccc";
    includedTagsInput.style.borderRadius = "5px";
    includedTagsInput.style.padding = "5px";
    includedTagsInput.style.marginBottom = "10px";
    includedTagsDiv.style.width = "50%";
    includedTagsInput.style.width = "100%";
    
    const excludedTagsList = document.createElement("ul");
    excludedTagsList.style.listStyle = "none";

    const includedTagsList = document.createElement("ul");
    includedTagsList.style.listStyle = "none";
        
    excludedTagsInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            const newTags = excludedTagsInput.value.split(",").map(tag => tag.trim().toLowerCase());
            excludedTags = [...new Set(excludedTags.concat(newTags))];
            localStorage.setItem("excludedTags", JSON.stringify(excludedTags));
            excludedTagsInput.value = "";
            updateFilterTagsList();
            if (structureVersion === "new") {
                hideNovelsNewStructure();
            } else if (structureVersion === "old") {
                hideNovelsOldStructure();
            }
        }
    });

    includedTagsInput.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            const newTags = includedTagsInput.value.split(",").map(tag => tag.trim().toLowerCase());
            includedTags = [...new Set(includedTags.concat(newTags))];
            localStorage.setItem("includedTags", JSON.stringify(includedTags));
            includedTagsInput.value = "";
            updateFilterTagsList();
            if (structureVersion === "new") {
                hideNovelsNewStructure();
            } else if (structureVersion === "old") {
                hideNovelsOldStructure();
            }
        }
    });

    const header = document.querySelector(".g_header_ph");
    header.insertAdjacentElement("afterend", filterOptionsDiv);
    
    excludedTagsDiv.appendChild(excludedTagsInput);
    includedTagsDiv.appendChild(includedTagsInput);
    
    filterOptionsDiv.appendChild(excludedTagsDiv);
    excludedTagsDiv.appendChild(excludedTagsList);

    filterOptionsDiv.appendChild(includedTagsDiv);
    includedTagsDiv.appendChild(includedTagsList);

    if (structureVersion === "new") {
        hideNovelsNewStructure();
    } else if (structureVersion === "old") {
        hideNovelsOldStructure();
    }

    function updateFilterTagsList() {
    excludedTagsList.innerHTML = "";
    includedTagsList.innerHTML = "";
        excludedTags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.textContent = tag;
            tagSpan.style.marginRight = "10px";
            tagSpan.style.padding = "5px";
            tagSpan.style.backgroundColor = "#eee";
            tagSpan.style.borderRadius = "5px";
            tagSpan.style.cursor = "pointer";
            tagSpan.addEventListener("click", () => {
                excludedTags = excludedTags.filter(t => t !== tag);
                localStorage.setItem("excludedTags", JSON.stringify(excludedTags));
                updateFilterTagsList();
                if (structureVersion === "new") {
                    hideNovelsNewStructure();
                } else if (structureVersion === "old") {
                    hideNovelsOldStructure();
                }
            });
            excludedTagsList.appendChild(tagSpan);
        });

        includedTags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.textContent = tag;
            tagSpan.style.marginRight = "10px";
            tagSpan.style.padding = "5px";
            tagSpan.style.backgroundColor = "#a9e2a6"; // Green color for included tags
            tagSpan.style.borderRadius = "5px";
            tagSpan.style.cursor = "pointer";
            tagSpan.addEventListener("click", () => {
                includedTags = includedTags.filter(t => t !== tag);
                localStorage.setItem("includedTags", JSON.stringify(includedTags));
                updateFilterTagsList();
                if (structureVersion === "new") {
                    hideNovelsNewStructure();
                } else if (structureVersion === "old") {
                    hideNovelsOldStructure();
                }
            });
            includedTagsList.appendChild(tagSpan);
        });
    }

    observer.observe(document.body, { childList: true, subtree: true });

    const storedExcludedTags = localStorage.getItem("excludedTags");
    const storedIncludedTags = localStorage.getItem("includedTags");

    if (storedExcludedTags) {
        excludedTags = JSON.parse(storedExcludedTags);
    }

    if (storedIncludedTags) {
        includedTags = JSON.parse(storedIncludedTags);
    }

    updateFilterTagsList();

    if (structureVersion === "new") {
        hideNovelsNewStructure();
    } else if (structureVersion === "old") {
        hideNovelsOldStructure();
    }
})();