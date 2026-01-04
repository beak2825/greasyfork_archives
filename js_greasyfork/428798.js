// ==UserScript==
// @name         dislike dick dale
// @namespace    https://offtopic.com
// @version      0.1.2
// @description  dick dale is not very likable
// @author       definitely not dick dale
// @match        https://offtopic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428798/dislike%20dick%20dale.user.js
// @updateURL https://update.greasyfork.org/scripts/428798/dislike%20dick%20dale.meta.js
// ==/UserScript==

/* global jQuery */

jQuery(function ($) {
    const dislike_all_posts = () => {
        $('.template-search_results .p-body-pageContent').find('.contentRow-title > a').each(function () {
            const found = this.href.match(/post-(?<post_id>\d+)$/);
            if (! found || ! found.groups || ! found.groups.post_id) {
                return;
            }
            const post_id = found.groups.post_id;
            $.post(`/posts/${post_id}/react?reaction_id=4`, {
                _xfRequestUri: this.href,
                _xfWithData: 1,
                _xfToken: $('[name="_xfToken"]')[0].value,
                _xfResponseType: 'json'
            }).then(function () {
                $.post(`/posts/${post_id}/react?reaction_id=7`, {
                    _xfRequestUri: this.href,
                    _xfWithData: 1,
                    _xfToken: $('[name="_xfToken"]')[0].value,
                    _xfResponseType: 'json'
                });
            });
        });
    }

    $('.template-search_results .p-body-header .p-title')
        .append('<button type="button">Dislike all posts</button>')
        .on('click', dislike_all_posts);
});
