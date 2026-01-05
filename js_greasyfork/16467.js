// ==UserScript==
// @name        GitHub Pulse Sort By
// @namespace   faleij
// @description adds sorting option to repo pulse
// @include     https://github.com/*
// @version     1.1.1
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/16467/GitHub%20Pulse%20Sort%20By.user.js
// @updateURL https://update.greasyfork.org/scripts/16467/GitHub%20Pulse%20Sort%20By.meta.js
// ==/UserScript==
/* jshint esnext:true, node:true, browser:true */
/* globals $  */
'use strict';

const menuItems = [{
    selected: true,
    id: 'sort_changed',
    value: 'time',
    text: 'Last Changed',
    sort: (a, b) => new Date($('time:first', a).attr('datetime')) > new Date($('time:first', b).attr('datetime'))
},{
    id: 'sort_assignee',
    value: 'assignee',
    text: 'Assignee',
    sort: (a, b) => $('.assignee:first', a).text().localeCompare($('.assignee:first', b).text())
},{
    id: 'sort_created',
    value: 'num',
    text: 'Created',
    sort: (a, b) => parseInt($('.num:first', a).text().substr(1)) > parseInt($('.num:first', b).text().substr(1))
}];

let getMenuItemHTML = (args) => `
<div class="select-menu-item js-navigation-item ${args.selected ? 'selected' : ''}">
    <input checked="checked" id="${args.id}" name="sortBy" value="${args.value}" type="radio" />
    <span class="select-menu-item-icon octicon octicon-check"></span>
    <div class="select-menu-item-text">
        ${args.text}
    </div>
</div>`;

const menuHTML = `
<div class="select-menu js-menu-container js-select-menu faleijs-sort-by-menu">
    <button class="btn btn-sm select-menu-button js-menu-target" type="button" aria-haspopup="true">
      <i>Sort By</i>
    </button>

    <div class="select-menu-modal-holder js-menu-content js-navigation-container" aria-hidden="true">
        <div class="select-menu-modal">
            <div class="select-menu-header">
                <span class="select-menu-title">Sort by</span>
                <span class="octicon octicon-remove-close js-menu-close"></span>
            </div>

            <div class="select-menu-list">
                ${ menuItems.map(getMenuItemHTML).join('') }
            </div>
        </div>
    </div>
</div>
</li>`;

const renderProgressHTML = (total, at) => `
<span class="issue-meta-section task-progress">
    <span aria-hidden="true" class="octicon octicon-checklist"></span>
    <span class="task-progress-counts">${at} of ${total}</span>
    <span class="progress-bar">
        <span class="progress" style="width: ${(at/total)*100}%"></span>
    </span>
</span>`;

const target = document.querySelector('#js-repo-pjax-container');
const mutationHandler = () => {
    console.log('event handler', location.pathname.endsWith('/pulse'));
    if (/\/pulse\/|$/.test(location.pathname) && !$('.faleijs-sort-by-menu', target).length) create();
};
const observer = new MutationObserver(mutationHandler);

observer.observe(target, {
    childList: true
});

mutationHandler();

function create() {
    // Load assignees and progress
    $('li>.title').each((index, title) => $.get($(title).attr('href')).then(data => {
        data = $(data);
        let total = $('.comment-body:first input[type=checkbox]', data);

        if (total.length) {
            $(title).parent().append(renderProgressHTML(total.length, total.filter('[checked]').length));
        }

        $(title).parent().append($('.assignee', data).parent().css('float', 'right'));
    }));

    $('input:radio[name="sortBy"]', $(menuHTML).prependTo('.header-with-actions')).change(MenuChangeHandler);
}

function MenuChangeHandler() {
    let menuItem = menuItems.find(el => el.value === this.value);
    $('.repository-content ul').each((index, ul) => $('li', ul).sort(menuItem.sort).appendTo(ul));
}