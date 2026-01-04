// ==UserScript==
// @name         Tumblr Related Tags Blocker
// @license      GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      v1.0.2
// @description  Adds a 'Filter Related Tags' section to https://www.tumblr.com/settings/account, allowing you to find commonly-paired tags and block them all.
// @author       https://greasyfork.org/en/users/1481774-chmod-000
// @match        https://www.tumblr.com/settings/account
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tumblr.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539041/Tumblr%20Related%20Tags%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/539041/Tumblr%20Related%20Tags%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Search this many recent posts to find related tags */
    const POST_LIMIT = 200;
    /* How many related tags to display */
    const TAG_LIMIT = 20;

    const html = `
    <style>
    #filter_related_tags {
        margin-bottom: 15px;
    }
    #filter_related_tags h4 {
        margin-bottom: 10px;
    }
    #filter_related_tags .search-wrapper {
        display: flex;
        align-content: center;
    }
    .search-wrapper--searching > * {
      pointer-events: none;
    }
    .search-wrapper--searching {
      opacity: 0.5;
      cursor: wait;
    }
    #filter_related_tags .search-wrapper button {
        background: #00b8ff;
        color: black;
        padding: 10px;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
    }
    #related_tags_search {
      flex-grow: 1;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
    }
    #related_tags_results {
      margin-top: 10px;
    }
    #related_tags_results ul {
      padding: 10px;
    }
    .related-tag {
      list-style: none;
      display: flex;
      margin-top: 5px;
    }
    .related-tag label {
      flex-grow: 1;
    }
    #related_tags_results button {
      background: red;
      width: 100%;
      color: white;
      padding: 10px;
      font-weight: bold;
    }
    #related_tags_results button .block-tag-count {
      pointer-events: none;
    }
    </style>
    <div id="filter_related_tags">
      <h4>Filter Related Tags</h4>
      <div class="search-wrapper">
          <input id="related_tags_search" type="text" placeholder="#tw bad things">
          <button type="button">Search</button>
      </div>
      <div id="related_tags_results" style="display: none;">
          <ul class="related-tags"></ul>
          <button type="button">Block <b class="block-tag-count"></b> tags</button>
      </div>
    </div>`;
    const relatedTagHtml = `<li class="related-tag"><label for="tag_{{ tag }}">#{{ tag }}</label><input type="checkbox" id="tag_{{ tag }}" name="{{ tag }}" checked></li>`;
    const injectSelector = '#filtered-tags-heading';

    let interval = setInterval(function() {
        if(document.querySelector(injectSelector)) {
            clearInterval(interval);
            main();
        }
    }, 500);
    let elems = {};

    function main() {
        document.querySelector(injectSelector).insertAdjacentHTML("beforebegin", html);
        elems = {
            search: {
                wrapper: document.querySelector('.search-wrapper'),
                btn: document.querySelector('.search-wrapper button'),
                input: document.querySelector('.search-wrapper input')
            },
            results: {
                wrapper: document.getElementById('related_tags_results'),
                btn: document.querySelector('#related_tags_results button'),
                counter: document.querySelector('#related_tags_results .block-tag-count'),
                tagList: document.querySelector('#related_tags_results .related-tags'),
                checkedTags: () => document.querySelectorAll('.related-tag input:checked'),
            }
        }

        elems.search.input.addEventListener('keydown', e => e.key === 'Enter' && handleSearch());
        elems.search.btn.addEventListener('click', handleSearch);
        elems.results.btn.addEventListener('click', handleBlock);
        elems.results.wrapper.addEventListener('change', updateTagCount);
    }

    function error(msg) {
        console.error(msg);
        alert(msg);
    }


    function updateTagCount() {
        elems.results.counter.textContent = elems.results.checkedTags().length;
    }

    async function handleBlock() {
        const tags = Array.from(elems.results.checkedTags()).map(e => e.name);
        await blockTags(tags);
        window.location.reload();
    }

    async function handleSearch() {
        elems.results.wrapper.style.display = "none";
        elems.results.tagList.replaceChildren()
        const searchTag = elems.search.input.value.replace('#', '').split(',')[0].trim();
        if(!searchTag) {
            return;
        }
        elems.search.wrapper.classList.add('search-wrapper--searching');

        const blockedTags = await getBlockedTags();
        const relatedTags = await getRelatedTags(searchTag, POST_LIMIT, TAG_LIMIT, blockedTags);
        elems.search.wrapper.classList.remove('search-wrapper--searching');
        if(!relatedTags.length) {
            error(`No results for ${searchTag}`);
            return;
        }
        relatedTags.forEach(t => {
            let tagHtml = relatedTagHtml.replaceAll('{{ tag }}', t.tag);
            elems.results.tagList.insertAdjacentHTML('beforeend', tagHtml);
        });
        updateTagCount();
        elems.results.wrapper.style.display = "";
    }

    async function getBlockedTags() {
        return (await tumblr.apiFetch(`/v2/user/filtered_tags`))?.response?.filteredTags || [];
    }

    async function blockTags(tags) {
        if(!tags) {
            return;
        }
        const body = {
            filtered_tags: tags,
        }
        return tumblr.apiFetch(`/v2/user/filtered_tags`, {method: "POST", body: body});
    }

    async function getRelatedTags(searchTag, postLimit = POST_LIMIT, tagLimit = TAG_LIMIT, excludedTags = []) {
        if(typeof tumblr?.apiFetch !== 'function') {
            error("Tumblr API Fetch isn't defined, cannot continue.");
            return;
        }
        excludedTags.push(searchTag);
        excludedTags = excludedTags.map(t => t.toLowerCase());
        const sortField = 'posts';
        let tagCounts = {};
        let t = Math.round(Date.now()/1000);
        let postCount = 0;

        for(let i=0; i<Math.ceil(postLimit/20); i++) {
            let results = await tumblr.apiFetch(`/v2/tagged/?tag=${searchTag}&limit=20&before=${t}`);
            if(!results?.response?.length) {
                return [];
            }
            for(const post of results.response) {
                if(postCount >= postLimit) {
                    break;
                }
                postCount++;
                t = Math.min(t, post.timestamp);
                for(const tag of post.tags) {
                    if(excludedTags.includes(tag.toLowerCase())) {
                        continue;
                    }
                    if(!tagCounts[tag]) {
                        tagCounts[tag] = {posts: 0, total_notes: 0};
                    }
                    tagCounts[tag].posts++;
                    tagCounts[tag].total_notes += post.noteCount;
                }
            }
        }
        let sortedTagCounts = Object.entries(tagCounts).sort((a, b) => a[1][sortField] <= b[1][sortField]);
        return sortedTagCounts.slice(0, tagLimit).map(a => Object.assign({tag: a[0]}, a[1]));
    }

})();