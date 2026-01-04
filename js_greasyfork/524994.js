// ==UserScript==
// @name         AO3 Tag Reorder
// @description  Rearrange tag order when editing a work or bookmark
// @author       Ifky_
// @namespace    https://greasyfork.org/en/scripts/524994-ao3-tag-reorder
// @version      1.1.0
// @history      1.1.0 — Reorder bookmarker's tags (requested feature). Refactored CSS and added new "sortable" class for lists that can be used for styling.
// @history      1.0.3 — Set increased line height on tag handles. Fix new tags not being draggable.
// @history      1.0.2 — Fix autocomplete not adding tag. Now the input field is also draggable, but this has no effect otherwise.
// @history      1.0.1 — Switch from SortableJS to AlpineJS (which depends on SortableJS), and fix autocomplete adding unintended tags.
// @history      1.0.0 — Rearrange tags. Copy tags for backup.
// @match        https://archiveofourown.org/works/*/edit
// @match        https://archiveofourown.org/works/*/edit_tags
// @match        https://archiveofourown.org/works/*/update_tags
// @match        https://archiveofourown.org/bookmarks/*
// @match        https://archiveofourown.org/users/*/bookmarks
// @match        https://archiveofourown.org/works/*/bookmarks
// @icon         https://archiveofourown.org/images/logo.png
// @require      https://cdn.jsdelivr.net/npm/@alpinejs/sort@3.14.8/dist/cdn.min.js
// @require      https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524994/AO3%20Tag%20Reorder.user.js
// @updateURL https://update.greasyfork.org/scripts/524994/AO3%20Tag%20Reorder.meta.js
// ==/UserScript==
"use strict";
(function () {
    // Utility function for delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const copyToClipboard = async (button, text) => {
        const originalText = button.innerText;
        await navigator.clipboard
            .writeText(text)
            .then(async () => {
            button.innerText = "Copied!";
            await delay(2000);
            button.innerText = originalText;
        })
            .catch(() => {
            alert("ERROR: Failed to copy tags to clipboard. REASON: Browser does not support Clipboard API or permission is disabled.");
        });
    };
    const getTagsCsv = (listElement) => {
        // Get all tags
        const tags = Array.from(listElement.querySelectorAll("li.tag"));
        return tags
            .map((tag) => Array.from(tag.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent)
            .join("")
            .trim())
            .join(",");
    };
    // Style the list items
    const styleTag = document.createElement("style");
    // Add CSS rules
    styleTag.textContent = `
    .sortable .added.tag {
      cursor: grab;
    }

    .sortable .added.tag.sortable-chosen {
      cursor: grabbing;
    }

    .sortable .added.tag::before {
      content: '☰';
      border: 1px dotted;
      border-radius: 5px;
      padding-inline: 3px;
      margin-right: 3px;
      line-height: 2em;
    }

    #tag-string-description {
      line-height: 2;
    }
      
    div[id^=tag-copy-list-] {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1em;
      background: #444;
      color: #fff;
      padding: 5px 8px;
      border-radius: 5px;
      border: 1px dashed;
      margin-bottom: 10px;
    }
      
    div[id^=tag-copy-list-] p {
      margin: 0;
      padding: 0;
      line-height: 2;
    }
      
    div[id^=tag-copy-list-] .info {
      padding: 3px 7px;
      margin: 3px 0;
      font-family: monospace;
      border-radius: 50%;
      border: 1px solid currentColor;
      cursor: pointer;
    }
      
    div[id^=tag-copy-list-] .copy {
      display: inline-block;
      cursor: pointer;
      margin: 0 0 0 auto;
    }
  `;
    // Append the <style> element to the <head>
    document.head.appendChild(styleTag);
    // Make a list sortable
    const makeListSortable = (tagList) => {
        tagList.classList.add("sortable");
        // Insert paragraph for tags (copy text)
        const div = document.createElement("div");
        div.id = `tag-copy-list-${tagList.parentElement.classList[0]}`;
        tagList.parentElement.insertBefore(div, tagList);
        const p = document.createElement("p");
        p.innerText = "Drag and drop tags to reorder";
        div.appendChild(p);
        const info = document.createElement("button");
        info.innerText = "i";
        info.type = "button";
        info.classList.add('info');
        info.addEventListener("click", () => {
            alert(`Copy the tags to the clipboard in case of network issues or hitting AO3's spam filters, in order to mitigate the risk of losing ALL the tags. It's a good idea to copy all the categories and keep them safe in a backup text file. \n\nIn the worst case scenario, you only need to paste them into each respective input field and it will add the tags back, as they are separated by commas. \n\nNB: To save the reordered tags, use the "Save tags" buttons, and not the standard Post/Draft/Update buttons. This saves everything in the work/bookmark, not only the tags, as it's not possible to do a partial save.`);
        });
        div.appendChild(info);
        const copy = document.createElement("button");
        copy.innerText = "Copy tags";
        copy.type = "button";
        copy.classList.add('copy');
        copy.addEventListener("click", () => {
            copyToClipboard(copy, getTagsCsv(tagList));
        });
        div.appendChild(copy);
        // Make sortable
        tagList.setAttribute("x-data", "");
        tagList.setAttribute("x-sort", "");
        tagList.querySelectorAll("li").forEach((li) => {
            li.setAttribute("x-sort:item", "");
        });
        // Setup MutationObserver to monitor for new list items
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList" &&
                    mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === "LI") {
                            node.setAttribute("x-sort:item", "");
                        }
                    });
                }
            }
        });
        // Start observing the tagList for added <li> elements
        observer.observe(tagList, {
            childList: true,
            subtree: false,
        });
    };
    // Find the potential error message in a response
    const getErrorFromResponse = async (response) => {
        const html = new DOMParser().parseFromString(await response.text(), "text/html");
        const error = html.getElementById("error");
        if (error) {
            alert(`${error.innerText}`);
            return true;
        }
        return false;
    };
    const waitForElement = (selector, root) => {
        return new Promise(resolve => {
            const el = root.querySelector(selector);
            if (el)
                return resolve(el);
            const observer = new MutationObserver(() => {
                const el = root.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });
            observer.observe(root, {
                childList: true,
                subtree: true,
            });
        });
    };
    // Add the buttons to the pages and make the tags sortable
    // Two main modes: bookmark tags and work tags
    const URL = window.location.pathname;
    if (URL.includes('bookmarks')) {
        const bookmarksFormPlacement = document.querySelectorAll('[id^=bookmark_form_placement_for_]');
        // Start observing the bookmark form placement for new form
        // Indicating that user has started editing it
        bookmarksFormPlacement.forEach(async (el) => {
            const form = await waitForElement('form', el);
            // Find the tag list and make it sortable
            const tagList = await waitForElement('#tag-string-description + ul.autocomplete', el);
            makeListSortable(tagList);
            // Add button to save tag order
            const tagsContainer = await waitForElement('dd:has(#tag-string-description)', el);
            const post = document.createElement("button");
            post.style.display = "inline-block";
            post.style.cursor = "pointer";
            post.style.margin = "0 1em 1em auto";
            post.style.float = "right";
            post.type = "button";
            post.innerText = "Save tags (Update)";
            post.addEventListener("click", () => saveReorder(form, tagList, post));
            tagsContainer.appendChild(post);
        });
        const saveReorder = async (form, tagList, button) => {
            const oldText = button.innerText;
            button.innerText = "Saving tags...";
            const formData = new FormData(form);
            formData.set("bookmark[tag_string]", "");
            const emptyTags = new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [
                key,
                value.toString(),
            ]));
            await fetch(form.action, {
                method: form.method,
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: emptyTags.toString(),
            })
                .then(async (response) => {
                if (await getErrorFromResponse(response)) {
                    return;
                }
                // Wait a bit before sending next request
                await delay(1000);
                formData.set("bookmark[tag_string]", getTagsCsv(tagList));
                const realTags = new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [
                    key,
                    value.toString(),
                ]));
                await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    body: realTags.toString(),
                })
                    .then(async (response) => {
                    if (!(await getErrorFromResponse(response))) {
                        button.innerText = "Saved!";
                        await delay(2000);
                    }
                })
                    .catch(() => {
                    alert(`ERROR: Failed to save tags. REASON: Possibly network issues. Try again in a minute.`);
                });
            })
                .catch(() => {
                alert(`ERROR: Failed to clear tags. REASON: Possibly network issues. Try again in a minute.`);
            });
            button.innerText = oldText;
        };
    }
    else {
        const form = document.getElementById("work-form");
        const fieldset = form.querySelector(".work.meta");
        // Make the tag lists sortable for re-ordering
        const fandomTags = form.querySelector("dd.fandom>ul:first-of-type");
        const relationshipTags = form.querySelector("form dd.relationship>ul:first-of-type");
        const characterTags = form.querySelector("form dd.character>ul:first-of-type");
        const freeformTags = form.querySelector("form dd.freeform>ul:first-of-type");
        [fandomTags, relationshipTags, characterTags, freeformTags].forEach((tagList) => makeListSortable(tagList));
        // Make the form send two requests: one empty and one with the real tags
        // In order to reset the order on AO3's backend
        if (!URL.endsWith("/new")) {
            const draftButton = document.querySelector("input[name=save_button]");
            if (draftButton) {
                const draft = document.createElement("button");
                draft.style.display = "inline-block";
                draft.style.cursor = "pointer";
                draft.style.margin = "0 1em 1em auto";
                draft.style.float = "right";
                draft.type = "button";
                draft.innerText = "Save tags (Draft)";
                draft.addEventListener("click", () => saveReorder("Save As Draft", draft));
                fieldset.appendChild(draft);
            }
            const post = document.createElement("button");
            post.style.display = "inline-block";
            post.style.cursor = "pointer";
            post.style.margin = "0 1em 1em auto";
            post.style.float = "right";
            post.type = "button";
            post.innerText = "Save tags (Post)";
            post.addEventListener("click", () => saveReorder("Post", post));
            fieldset.appendChild(post);
            const copyAll = document.createElement("button");
            copyAll.style.display = "inline-block";
            copyAll.style.cursor = "pointer";
            copyAll.style.margin = "0 1em 1em auto";
            copyAll.style.float = "right";
            copyAll.type = "button";
            copyAll.innerText = "Copy all tags";
            copyAll.addEventListener("click", () => {
                const csv = [];
                [fandomTags, relationshipTags, characterTags, freeformTags].forEach((list) => {
                    csv.push(getTagsCsv(list));
                });
                copyToClipboard(copyAll, csv.join("\n"));
            });
            fieldset.appendChild(copyAll);
        }
        const saveReorder = async (action, button) => {
            const oldText = button.innerText;
            button.innerText = "Saving tags...";
            const formData = new FormData(form);
            if (action === "Post") {
                formData.set("update_button", action);
            }
            else if (action === "Save As Draft") {
                formData.set("save_button", action);
            }
            formData.set("work[fandom_string]", "."); // Fandom is required, so set a single placeholder fandom
            formData.set("work[relationship_string]", "");
            formData.set("work[character_string]", "");
            formData.set("work[freeform_string]", "");
            const emptyTags = new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [
                key,
                value.toString(),
            ]));
            await fetch(form.action, {
                method: form.method,
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
                body: emptyTags.toString(),
            })
                .then(async (response) => {
                if (await getErrorFromResponse(response)) {
                    return;
                }
                // Wait a bit before sending next request
                await delay(1000);
                formData.set("work[fandom_string]", getTagsCsv(fandomTags));
                formData.set("work[relationship_string]", getTagsCsv(relationshipTags));
                formData.set("work[character_string]", getTagsCsv(characterTags));
                formData.set("work[freeform_string]", getTagsCsv(freeformTags));
                const realTags = new URLSearchParams(Array.from(formData.entries()).map(([key, value]) => [
                    key,
                    value.toString(),
                ]));
                await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    body: realTags.toString(),
                })
                    .then(async (response) => {
                    if (!(await getErrorFromResponse(response))) {
                        button.innerText = "Saved!";
                        await delay(2000);
                    }
                })
                    .catch(() => {
                    alert(`ERROR: Failed to save tags. REASON: Possibly network issues. Try again in a minute.`);
                });
            })
                .catch(() => {
                alert(`ERROR: Failed to clear tags. REASON: Possibly network issues. Try again in a minute.`);
            });
            button.innerText = oldText;
        };
    }
})();