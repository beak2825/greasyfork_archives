// ==UserScript==
// @name         GitHub Gist Search Box
// @namespace    me.nzws.us.gist_box
// @version      1.0.0
// @description  Show search box in gist's userpage
// @author       nzws
// @match        https://gist.github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395318/GitHub%20Gist%20Search%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/395318/GitHub%20Gist%20Search%20Box.meta.js
// ==/UserScript==

const html = `
<div class="mb-3 mb-md-0 mr-md-3 flex-auto">
<input type="search" class="form-control width-full" placeholder="Find a public gist…" />
</div>

<div class="d-flex">
<button class="text-center btn btn-primary ml-3">
Search
</button>
</div>
`;
const $ = e => document.querySelector(e);

const onSearch = () => {
    const username = window.location.pathname.slice(1);
    const input = `user:${username} ${$('#gist-search-box input').value}`;
    location.href = `/search?q=${encodeURIComponent(input)}`;
};

(function() {
    'use strict';

    const checkUserPage = $('.reponav-item.selected[aria-label="All gists"]');
    if (!checkUserPage) return;

    const newNode = document.createElement('div');
    newNode.className = 'd-block d-md-flex mb-4';
    newNode.id = 'gist-search-box';
    newNode.innerHTML = html;

    const pagehead = $('.pagehead');
    pagehead.parentNode.insertBefore(newNode, pagehead);

    $('#gist-search-box button').onclick = onSearch;
    $('#gist-search-box input').onkeypress = e => e.keyCode === 13 ? onSearch() : true;
})();
