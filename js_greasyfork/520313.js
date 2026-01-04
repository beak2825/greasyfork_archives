// ==UserScript==
// @name         Filter Drawings using a Tag
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  A script that adds an input field in the gallery for filtering drawings with tags.
// @match        https://*.drawaria.online/gallery/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @author       Vholran
// @icon         https://www.google.com/s2/favicons?domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520313/Filter%20Drawings%20using%20a%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/520313/Filter%20Drawings%20using%20a%20Tag.meta.js
// ==/UserScript==
 
(($, undefined) => {
    $(() => {
        const currentURL = window.location.href;
        if (currentURL.includes('/img/') || currentURL.includes('?uid=')) return;
 
        const $filterContainer = $('.filtercontainer');
        $filterContainer.css({ display: 'flex', flexDirection: 'row', position: 'relative' });
 
        $filterContainer.prepend(`
        <div id="loadingIndicator" style="display:none; position:absolute; top: 50%; left: 10px; transform: translateY(-50%); font-size: 16px; color: #999;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite;"></div>
        </div>
        <input id="filterInput" type="text" placeholder="Filter using a tag" autocomplete="off" style="width: 100%; padding: 0.25rem 0.5rem; font-size: 0.875rem;">
        <div id="suggestions" style="display:none; border: 1px solid #ccc; background: white; position: absolute; top: 100%; left: 0; width: 100%; max-height: 200px; overflow-y: auto; z-index: 9999;"></div>
    `);
 
        const style = document.createElement('style');
        style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
 
        const fetchSuggestions = query => {
            if (query.trim()) {
                $('#loadingIndicator').show();
                $.get(`/gallery/gettags?s=${encodeURIComponent(query)}`, data => {
                    $('#loadingIndicator').hide();
                    if (Array.isArray(data)) {
                        const suggestions = data
                        .filter(tag => !tag.includes('#'))
                        .map(tag => `<div class="suggestion-item" style="padding: 5px; cursor: pointer;">${tag}</div>`)
                        .join('');
                        $('#suggestions').html(suggestions).toggle(!!suggestions);
                    }
                });
            } else {
                $('#suggestions').empty().hide();
            }
        };
 
        const handleRedirection = tag => {
            window.location.href = tag ? `/gallery/?filter=tag:${encodeURIComponent(tag)}` : '/gallery/';
        };
 
        $('#filterInput')
            .on('input', e => fetchSuggestions($(e.target).val()))
            .on('keydown', e => { if (e.key === 'Enter') handleRedirection($(e.target).val().trim()); });
 
        $(document)
            .on('mouseenter', '.suggestion-item', e => $(e.target).css('background-color', '#e0e0e0'))
            .on('mouseleave', '.suggestion-item', e => $(e.target).css('background-color', ''))
            .on('click', '.suggestion-item', e => {
            const tag = $(e.target).text().trim();
            $('#filterInput').val(tag);
            handleRedirection(tag);
        });
 
        $(document).on('click', e => {
            if (!$(e.target).closest('#filterInput, #suggestions').length) {
                $('#suggestions').hide();
            }
        });
    });
})(window.jQuery.noConflict(true));