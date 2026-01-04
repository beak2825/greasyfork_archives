// ==UserScript==
// @name         Danbooru - Quick Sort & Trim
// @description  Fast and easy sort type adding to Danbooru queries
// @namespace    https://greasyfork.org/en/users/1269846-piuztqgni0m9bfkuvr0bfcnux
// @version      2024-08-11
// @author       PIuztQgnI0M9bfKuvR0bfCNuX
// @match        *://*.donmai.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503339/Danbooru%20-%20Quick%20Sort%20%20Trim.user.js
// @updateURL https://update.greasyfork.org/scripts/503339/Danbooru%20-%20Quick%20Sort%20%20Trim.meta.js
// ==/UserScript==

(() => {
    let query;
    const params = (new URL(document.location)).searchParams;
    if (params.has('q')) {
        query = params.get('q').split(' ');
    } else if (params.has('tags')) {
        query = params.get('tags').split(' ');
    } else return;

    const sortTypes = ['favcount', 'score', 'random'];

    const sortedUrl = (tag) => `/posts?tags=${encodeURIComponent(`${query.filter(item => !item.includes('order:')).join(' ').trim()} ${tag}`)}`;

    const trimmedUrl = (tag) => `/posts?tags=${encodeURIComponent(`${query.filter(item => item !== tag).join(' ')}`.trim())}`;

    const searchForm = document.getElementById('search-box');

    const orderSection = document.createElement('section');
    orderSection.id = 'order-box';

    const orderHeader = document.createElement('h2');
    orderHeader.appendChild(document.createTextNode('Order'));

    const orderList = document.createElement('ul');
    orderList.class = 'tag-list search-tag-list';

    searchForm.after(orderSection);
    orderSection.appendChild(orderHeader);
    orderSection.appendChild(orderList);

    sortTypes.forEach(type => {
        if (!query.includes(`order:${type}`)) {
            const newLine = document.createElement('li');
            const typeItem = document.createElement('a');
            typeItem.href = sortedUrl(`order:${type}`);
            typeItem.appendChild(document.createTextNode(type));
            typeItem.class = 'tag-type-0';
            orderList.appendChild(newLine);
            newLine.appendChild(typeItem);
        }
    });

    const trimSection = document.createElement('section');
    trimSection.id = 'trim-box';

    const trimHeader = document.createElement('h2');
    trimHeader.appendChild(document.createTextNode('Trim'));

    const trimList = document.createElement('ul');
    trimList.class = 'tag-list search-tag-list';

    orderSection.after(trimSection)
    trimSection.appendChild(trimHeader)
    trimSection.appendChild(trimList);

    query.forEach(tag => {
        const newLine = document.createElement('li');
        const typeItem = document.createElement('a');
        typeItem.href = trimmedUrl(tag);
        typeItem.appendChild(document.createTextNode(tag));
        typeItem.class = 'tag-type-0';
        trimList.appendChild(newLine);
        newLine.appendChild(typeItem);
    });

})();
