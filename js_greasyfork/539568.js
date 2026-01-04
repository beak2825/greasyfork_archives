// ==UserScript==
// @name         Discogs
// @namespace    https://rix.li/
// @version      2025-06-01
// @description  Discogs helpers
// @author       Rix
// @license      MIT
// @match        *://*.discogs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discogs.com
// @run-at       document-idle
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/539568/Discogs.user.js
// @updateURL https://update.greasyfork.org/scripts/539568/Discogs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.pathname === '/sell/cart') {
        ShoppingCart();
    } else if (window.location.pathname.startsWith('/sell/order/')) {
        OrderPage();
    } else if (window.location.pathname.startsWith('/release/')) {
        ReleasePage();
    }

    function normalize(str) {
        return str.replace(/\(\d+\)$/, '').replace(/[\/\\\s]+/g, ' ').trim();
    }

    function ReleasePage() {
        const dsdata = JSON.parse(document.querySelector('#dsdata').innerHTML);
        const releaseID = parseInt(window.location.pathname.match(/^\/release\/(\d+)/)[1]);
        const release = dsdata.data[`Release:{"discogsId":${releaseID}}`];
        const label = release.labels.find(l => l.labelRole === 'LABEL');
        const artists = [];
        const artistsByID = {};
        for (const artistData of release.primaryArtists) {
            const artistID = artistData.artist['__ref'].match(/Artist:\{"discogsId":(\d+)\}/)[1];
            if (artistsByID[artistID] == null) {
                artists.push(artistsByID[artistID] = {});
            }
            const artist = artistsByID[artistID];
            for (const key of ['displayName', 'nameVariation']) {
                let name = artistData[key];
                if (name == null || ('' + name).match(/^\s*$/)) {
                    continue;
                }
                name = name.replace(/\(\d+\)$/, '').trim();
                if (name.match(/^[\x00-\x7F]+$/)) {
                    artist.latinName = name;
                } else {
                    artist.nativeName = name;
                }
            }
        }
        const year = release.released.match(/^(\d{4})/)[1];
        function formatArtists() {
            if (artists.length > 1) {
                return 'Various';
            }
            const artist = artists[0];
            if (artist.latinName != null && artist.nativeName != null) {
                return `${artist.latinName} (${artist.nativeName})`;
            } else if (artist.latinName != null) {
                return artist.latinName;
            }
            return artist.nativeName;
        }
        function formatTitle() {
            const m = release.title.match(/^([^=]+)=([^=]+)$/);
            if (m == null) {
                return release.title;
            }
            for (const part of [m[1], m[2]]) {
                if (part.match(/[^\x00-\x7F]/)) {
                    return part;
                }
            }
            return m[1];
        }
        const folderName = `${normalize(formatArtists())} - ${normalize(formatTitle())} (${year}) {${normalize(label.displayName)}, ${normalize(label.catalogNumber)}, 192kHz, 24bit, Vinyl} [FLAC]`;
        document.querySelector('#release-actions').insertAdjacentHTML('beforeEnd', `
            <div>
                <button id="copy-folder-name" type="button" class="_button_yjcsc_1 button_PsVhv _dense_yjcsc_54 _notHasTextNode_yjcsc_32 _notHasTextNodeFirst_yjcsc_32 _notHasTextNodeLast_yjcsc_37 _secondary_yjcsc_60">
                    <div class="_buttonContent_yjcsc_21">
                        <svg aria-hidden="true" viewBox="0 0 448 512" class="icon_lTSTG" role="img"><path d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"/></svg>
                        Copy Folder Name
                    </div>
                </button>
            </div>
        `);
        document.querySelector('#copy-folder-name').addEventListener('click', function() {
            GM_setClipboard(folderName);
        });
    }

    function OrderPage() {
        const dsdata = unsafeWindow.dsdata();
        const controlButtons = window.document.querySelector('.order-control-buttons');
        controlButtons.insertAdjacentHTML('afterBegin', `<a class="button add-to-collection" href="javascript:void(0)"><i class="icon icon-plus-square" role="img" aria-hidden="true"></i>Add to collection</a>`);
        controlButtons.querySelector('.add-to-collection').addEventListener('click', function() {
            // dsdata.order.itemization

            fetch("https://www.discogs.com/service/catalog/api/graphql", {
              "headers": {
                "accept": "*/*",
                "accept-language": "en",
                "apollographql-client-name": "release-page-client",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not;A=Brand\";v=\"99\", \"Google Chrome\";v=\"139\", \"Chromium\";v=\"139\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
              },
              "referrer": "https://www.discogs.com/release/20063065-%E6%B2%A2%E7%94%B0%E4%BA%9C%E7%9F%A2%E5%AD%90-%E3%83%80%E3%83%B3%E3%82%B9%E3%81%AB%E5%A4%A2%E4%B8%AD",
              "body": "{\"operationName\":\"AddReleaseToCollection\",\"variables\":{\"input\":{\"discogsReleaseId\":20063065}},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"60200b3acb935a2304a8b7eb19e6b480aa05ca656a24206d9ac41ca0d7c0aac9\"}}}",
              "method": "POST",
              "mode": "cors",
              "credentials": "include"
            });
        });
    }


    function ShoppingCart() {
        const releaseIDToRows = {};

        document.querySelectorAll('.order_container').forEach(order => {
            const itemIDs = [];
            const releaseIDs = [];
            order.querySelectorAll('.order_row').forEach(row => {
                const itemID = row.getAttribute('data-item-id');
                const releaseID = row.getAttribute('data-release-id');
                const thumbnailLink = row.querySelector('a.thumbnail_link');
                thumbnailLink.href = `/release/${releaseID}`;
                thumbnailLink.setAttribute('target', '_blank');
                itemIDs.push(itemID);
                releaseIDs.push(releaseID);
                if (releaseIDToRows[releaseID] == null) {
                    releaseIDToRows[releaseID] = [row];
                } else {
                    releaseIDToRows[releaseID].push(row);
                }
            });
            order.querySelector('.order_summary').insertAdjacentHTML('afterBegin', `
                <div class="summary_section tools_section">
                    <h3 class="no-margin">Tools</h3>
                    <div>
                        <a class="open-all-releases" href="javascript:void(0)">Open all releases</a>
                    </div>
                    <div>
                        <a class="open-all-releases-listings" href="javascript:void(0)">Open all releases market listings</a>
                    </div>
                    <div>
                        <a class="open-all-items" href="javascript:void(0)">Open all items</a>
                    </div>
                </div>
            `);
            order.querySelector('.open-all-releases').addEventListener('click', function() {
                for (const releaseID of releaseIDs) {
                    GM_openInTab(`https://www.discogs.com/release/${releaseID}`);
                }
            });
            order.querySelector('.open-all-items').addEventListener('click', function() {
                for (const itemID of itemIDs) {
                    GM_openInTab(`https://www.discogs.com/sell/item/${itemID}`);
                }
            });
            order.querySelector('.open-all-releases-listings').addEventListener('click', function() {
                for (const releaseID of releaseIDs) {
                    GM_openInTab(`https://www.discogs.com/sell/release/${releaseID}`);
                }
            });
        });

        for (const [releaseID, rows] of Object.entries(releaseIDToRows)) {
            if (rows.length < 2) {
                continue;
            }
            for (const row of rows) {
                row.querySelector('.item_link').insertAdjacentHTML('afterend', `<span style="font-size: 14px;color: #fff;background-color: #BF3A38;border-radius: 3px;margin-left: 5px;padding: 3px 5px 2px 3px;"><i class="icon icon-exclamation-circle" fa-solid="" style="padding: 0 3px;"></i>Duplicate</span>`);
            }
        }
    }

    // Your code here...
})();