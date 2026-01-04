// ==UserScript==
// @name         Gazelle Folder Name Generator
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  Automatically generate folder names based on release info
// @author       Cilucition
// @grant        GM.setClipboard
// @grant        GM.getValue
// @grant        GM.setValue
// @include      https://orpheus.network/torrents.php?id=*
// @include      https://orpheus.network/forums.php?action=viewthread&threadid=3856
// @downloadURL https://update.greasyfork.org/scripts/388382/Gazelle%20Folder%20Name%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/388382/Gazelle%20Folder%20Name%20Generator.meta.js
// ==/UserScript==

const JSON_URL = 'https://orpheus.network/ajax.php?action=torrent&id=';

function renderFolderStr(context, templateStr) {
    const { group, torrent } = context;
    return new Function('group', 'torrent', "return `" + templateStr + "`;")(group, torrent);
}

function getTorrentId(torrentRow) {
    return $(torrentRow).attr('id').replace('torrent', '');
}

async function getTorrentData(torrentId) {
    const torrentJsonUrl = `${JSON_URL}${torrentId}`;
    let torrentJson = await fetch(torrentJsonUrl, {credentials: 'include'});
    torrentJson = await torrentJson.json();
    return torrentJson.response;
}

async function getFolderStr(torrentRow) {
    const torrentId = getTorrentId(torrentRow);
    const torrentData = await getTorrentData(torrentId);
    const { group, torrent } = torrentData;

    let templateStr;
    templateStr = await GM.getValue('gfng_config');
    if (!templateStr) {
        templateStr = `\
${group.musicInfo.artists.map(it => it.name).join(' & ')} - \
(${group.year}) ${group.name} [${torrent.media} ${torrent.format}${torrent.encoding !== 'Lossless' ? ' ' + torrent.encoding : ''}]\
${
        torrent.remasterYear && group.year !== torrent.remasterYear
        ? ' [' + torrent.remasterYear + ' ' + torrent.remasterTitle + ']'
        : ''
        }\
${
        torrent.remasterRecordLabel
        ? ' (' + torrent.remasterRecordLabel + ')'
        : group.recordLabel
        ? ' (' + group.recordLabel + ')'
        : ''
        }\
${
        torrent.remasterCatalogueNumber
        ? ' (' + torrent.remasterCatalogueNumber + ')'
        : group.catalogueNumber
        ? ' (' + group.catalogueNumber + ')'
        : ''
        }`;

        templateStr = templateStr.trim();
    }
    const folderStr = renderFolderStr(torrentData, templateStr);
    return folderStr;
}

function createBlockQuote(folderStr) {
    return `
        <blockquote>
            <span class="folder-text">${folderStr}</span>
            <button type="button" class="copy-folder-button">Copy</button>
        </blockquote>`;
}

$(document).on('click', '.copy-folder-button', e => {
    const $target = $(e.target);
    const folderText = $target.siblings('.folder-text').text();
    GM.setClipboard(folderText);
});

async function initTorrent() {
    const openTorrent = $('.torrentdetails:visible').prevAll('.torrent_row').first().find('.td_info > a');
    $('.td_info > a').not(openTorrent).on('click', async (e) => {
        const torrentRow = $(e.target).parents('.torrent_row');
        $(e.target).off('click');
        const folderStr = await getFolderStr(torrentRow);
        const $torrentDetails = $(e.target).parents('.torrent_row').nextAll('.torrentdetails').first();
        const blockQuote = createBlockQuote(folderStr);
        $torrentDetails.find('> td').append(blockQuote);
    });
    if($('.torrentdetails:visible').length) {
        const torrentRow = $('.torrentdetails:visible').prevAll('.torrent_row').first();
        const folderStr = await getFolderStr(torrentRow);
        const $torrentDetails = torrentRow.nextAll('.torrentdetails').first();
        const blockQuote = createBlockQuote(folderStr);
        $torrentDetails.find('> td').append(blockQuote);
    }
}

async function initConfig() {
    const postHeaderElem = $('#content40714 span.size5');
    const configVal = await GM.getValue('gfng_config');
    postHeaderElem.after(`
        <br><br>
        <strong><span class="size3">Custom Folder Template:</span></strong>
        <br>
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals">
            HELP: JavaScript Template Literals
        </a>
        <textarea id="gfng-config" />
        <br><br>
        <button type="button" id="save-config-button">Save</button>`);
    $('#gfng-config').val(!!configVal ? configVal : '');
    $('#save-config-button').on('click', e => {
        var configInputVal = $('#gfng-config').val();
        GM.setValue('gfng_config', configInputVal);
    })
}

/**
 * If on a torrent page, return 'torrent', else return 'config'.
 * Detected by doing regex match on window.location.href (current URL)
 */
function getPage() {
    const torrentRegex = /torrents\.php/g
    const configRegex = /&threadid=3856/g;
    const { href } = window.location;
    if (href.match(torrentRegex)) {
        return 'torrent';
    } else if (href.match(configRegex)) {
        return 'config';
    } else {
        return null;
    }

}

(async function() {
    'use strict';
    const page = getPage();
    if (page === 'torrent') {
        initTorrent();
    } else if (page === 'config') {
        initConfig();
    }
})();