// ==UserScript==
// @name        Notify.moe Anime search and stream links
// @namespace   https://greasyfork.org/users/412318
// @include     /^https?:\/\/notify\.moe/
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.1
// @author      henrik9999
// @run-at      document-idle
// @description This script adds search and stream links for anime pages on Notify.moe
// @downloadURL https://update.greasyfork.org/scripts/415255/Notifymoe%20Anime%20search%20and%20stream%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/415255/Notifymoe%20Anime%20search%20and%20stream%20links.meta.js
// ==/UserScript==
var pageType;
var pageId;
const api = {};

if (typeof GM_xmlhttpRequest !== 'undefined') {
    api.GM_xmlhttpRequest = GM_xmlhttpRequest;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.xmlHttpRequest !== 'undefined'
) {
    api.GM_xmlhttpRequest = GM.xmlHttpRequest;
}

if (typeof GM_setValue !== 'undefined') {
    api.GM_setValue = GM_setValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.setValue !== 'undefined'
) {
    api.GM_setValue = GM.setValue;
}

if (typeof GM_getValue !== 'undefined') {
    api.GM_getValue = GM_getValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.getValue !== 'undefined'
) {
    api.GM_getValue = GM.getValue;
}


function favicon(domain) {
  if (domain.indexOf('pahe.win') !== -1) return `https://www.google.com/s2/favicons?domain=animepahe.com`;
  return `https://www.google.com/s2/favicons?domain=${domain}`;
}

async function getPageSearch() {
    console.log("getPageSearch")
    var cache = await api.GM_getValue("pageSearchCache");
    var cacheTime = await api.GM_getValue("pageSearchCacheTime");
    if (cache != null && !$.isEmptyObject(cache) && cacheTime != null && new Date().getTime() - parseInt(cacheTime) < 12 * 60 * 60 * 1000) {
        console.log("cache getpagesearch");
        return cache;
    } else {
        console.log("new getpagesearch");
        let pageSearch = await new Promise((resolve, reject) => {
            api.GM_xmlhttpRequest({
                method: "GET",
                url: 'https://api.malsync.moe/general/pagesearch',
                onload: function(response) {
                    if (response.status === 200 && response.responseText) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve({});
                    }
                }
            });
        })
        await api.GM_setValue("pageSearchCacheTime", new Date().getTime());
        await api.GM_setValue("pageSearchCache", pageSearch);
        return pageSearch;
    }
}

async function siteSearch() {
    console.log('Site Search');
    $('<section data-mountable-type="sidebar" class="anime-section mountable mounted"><h3 class="anime-section-name">Streaming</h3><span id="mal-sync-search-links" class="anime-section-name">Search</span><div class="MALSync-search"><a>[Show]</a></section>').insertAfter('#content > div > div.anime-side-column > section:last');
    var pageSearch = await getPageSearch();
    $('.MALSync-search').one('click', async () => {
        $('.MALSync-search').remove();
        var title = $('div.anime-header > div.anime-info > h1').first().text().trim();
        var titleEncoded = encodeURI(title);
        var html = '<div class="light-button-group">';

        for (var key in pageSearch) {
            var page = pageSearch[key];
            if (page.type !== pageType) continue;

            var link = `<a href="${page.searchUrl.replace("##searchkey##",titleEncoded)}" target="_blank" rel="noopener" class="light-button"><img src="${favicon(page.domain)}" class="padded-icon icon-external-link"></img><span>${page.name}</span></a>`

            html += `<div id="${key}"> ${link}</div>`;
        }

        html += "</div>"

        $('#mal-sync-search-links').after(html);
    });
}

async function getMalToStreamApi(type, id) {
    if (!id) return {};
    return new Promise((resolve, reject) => {
        api.GM_xmlhttpRequest({
            method: "GET",
            url: 'https://api.malsync.moe/mal/' + type + '/' + id,
            onload: async function(response) {
                if (response.status === 200) {
                    var data = JSON.parse(response.responseText);
                    for (var pageKey in data.Sites) {
                        if (await api.GM_getValue(pageKey) != null && !await api.GM_getValue(pageKey)) {
                            console.log(pageKey + ' is deactivated');
                            delete data.Sites[pageKey];
                            continue;
                        }
                    }
                    if (data && data.Sites) resolve(data.Sites);
                    resolve({});
                } else {
                    resolve({});
                }
            }
        });
    })
}

async function malToStream() {
    console.log('malToStream');
    getMalToStreamApi(pageType, pageId).then((links) => {
        var html = '<br>';
        for (var pageKey in links) {
            var page = links[pageKey];

            var tempHtml = '';
            var tempUrl = '';
            for (var streamKey in page) {
                var stream = page[streamKey];
                tempHtml += '<div><a target="_blank" href="' + stream['url'] + '">' + stream['title'] + '</a></div>';
                tempUrl = stream['url'];
            }
            html += '<span class="anime-section-name" id="' + pageKey + 'Links"><img src="' + favicon(tempUrl.split('/')[2]) + '"> ' + pageKey + '<span title="' + pageKey + '" class="remove-mal-sync"> [X]</span></span>';
            html += tempHtml;
            html += '<br/>';

        }
        $('div.MALSync-search').after(html);
        $('.remove-mal-sync').click(async function() {
            var key = $(this).attr('title');
            console.log(key)
            await api.GM_setValue(key, false);
            location.reload();
        });
    })
}

let interval;
fullUrlChangeDetect(async function() {
    clearInterval(interval);
    if (!/^https?:\/\/notify\.moe\/(anime|manga)\/[\w_-]+/.test(document.URL)) return;
    interval = waitUntilTrue(
        function() {
            return $("#content > div > div.anime-side-column > section:last").length;
        },
        function() {
            console.log("trigger")
            pageType = document.URL.split("/")[3].toLowerCase();
            var mallink = $('a[href^="https://myanimelist.net/anime/"], a[href^="https://myanimelist.net/manga/"]').first().attr('href');
            siteSearch();
            if (mallink) {
                pageId = mallink.split("/")[4];
                malToStream();
            }
        });
});


function fullUrlChangeDetect(callback) {
    let currentPage = '';
    const intervalId = setInterval(function() {
        if (currentPage !== window.location.href) {
            currentPage = window.location.href;
            callback();
        }
    }, 100);

    return Number(intervalId);
}

function waitUntilTrue(condition, callback, interval = 100) {
    const intervalId = setInterval(function() {
        if (condition()) {
            clearInterval(intervalId);
            callback();
        }
    }, interval);

    return intervalId;
}