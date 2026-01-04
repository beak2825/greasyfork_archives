// ==UserScript==
// @name        FAKKU Metadata JSON Downloader
// @namespace   en.texx.scriptus
// @author      TeeXX
// @description Adds a button that generates info.json metadata
// @supportURL  https://github.com/TeeXX/FAKKU-Metadata-Downloader/issues
// @license     GPL-3.0-only
// @version     1.2
// @homepage    https://greasyfork.org/en/scripts/449932
// @compatible  firefox Violentmonkey
// @compatible  firefox Tampermonkey
// @compatible  chrome Violentmonkey
// @compatible  chrome Tampermonkey
// @compatible  edge Violentmonkey
// @compatible  edge Tampermonkey
// @match       *://www.fakku.net/hentai/*
// @grant       none
// @require     https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/449932/FAKKU%20Metadata%20JSON%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449932/FAKKU%20Metadata%20JSON%20Downloader.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;

function getReleasedDate(){
    // I have no idea how to get released date
    // for now it gets all comments and picks the oldest's time
    var allDates = [];
    
    var comments = $('div.grid-flow-row-dense:nth-child(1) > div.comment-visible').find('span').each(function(index, element) {
        var e = $(element);
        if (e.text().includes('ago')){ // find span with time inside
            var sDate = e.attr('title');
            var parsedDate = dayjs(sDate.replace('at', ''), "MMMM DD, YYYY h:mm a"); // parse
            allDates.push(parsedDate); // push it to the array
        }
    });
        
    allDates.sort(function(a,b){ return a - b; }); // sort all dates from oldest to newest
    
    var result = String(allDates[0].format('YYYY-MM-DD HH:mm:ss')) + " UTC";
    return result;
}

function getTags() {
    var tagsElements = $('.-mb-2').find("a");
    var tags = [];
    
    tagsElements.each(function(index, element) {
        var tag = toSafeString($(element).text()).toLowerCase();
        if (!tag.includes('+')) {
            tags.push(tag);
        }
    });
    
    return tags;
}

function getRelated() {
    var relatedElements = $('.js-tab-targets').find("a[href*='hentai']:not([class])").not(":visible");
    var related = [];
    
    relatedElements.each(function(index, element) {
        related.push(String($(element).prop('href')));
    });
    
    return related;
}

function getLanguage(url) {
    if (url.includes('english'))
        return "English";
    
    var split = url.split("-");
    var language = split[split.length -1]
    if (!language && language.length == 0)
        language = 'english';
    return toSafeString(language.charAt(0).toUpperCase() + language.slice(1));
}

function toSafeString(notString) {
    return String(notString).trim();
}

function getJsonMetadata() {
    // info parent css selector
    var parent = $('.sm\\:table-cell');
    
    var o = {};
    o.URL = String(window.location.href); // string - url
    o.Title = toSafeString(parent.find('h1').text()); // string
    o.Artist = toSafeString(parent.find('div:contains("Artist")').find('a').text()); // string
    o.Parody = toSafeString(parent.find('div:contains("Parody")').find('a').text()); // string
    o.Magazine = toSafeString(parent.find('div:contains("Magazine")').find('a').text()); // string
    o.Publisher = toSafeString(parent.find('div:contains("Publisher")').find('a').text()); // string
    o.Language = getLanguage(o.URL);
    o.Pages = parseInt(parent.find('div:contains("pages")').find('.table-cell').text().replace( /^\D+/g, '')); // int
    o.Favourites = parseInt(parent.find('div:contains("favorites")').find('.table-cell').text().replace( /^\D+/g, '')); // int
    o.Description = toSafeString(parent.find('div.space-y-2:nth-child(1)').text()); // string
    o.Tags = getTags(); // string array
    o.Thumb = toSafeString($('img.inline-block').prop('src')); // string
    o.Related = getRelated(); // string array
    o.Released = getReleasedDate(); // sring - 'YYYY-MM-DD HH-mm-ss UTC'
    
    return JSON.stringify(o, null, '\t');
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

$(document).ready(function()
{
    var r= 
        '<div class="rounded cursor-pointer left-1 top-1 m-1 sm:left-2 sm:top-2 sm:right-auto overflow-hidden absolute inline-block whitespace-nowrap align-top">' +
        '    <a id="jsonmetadatadownload" class="table text-right" title="JSON Metadata Download" data-tippy-content="JSON Metadata Download">' +
        '        <div class="table-cell bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-base px-2 py-2">' +
        '            <svg height="30" width="30" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17">' +
        '                <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM4.151 15.29a1.176 1.176 0 0 1-.111-.449h.764a.578.578 0 0 0 .255.384c.07.049.154.087.25.114.095.028.201.041.319.041.164 0 .301-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .084-.29.387.387 0 0 0-.152-.326c-.101-.08-.256-.144-.463-.193l-.618-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.352-.367 1.068 1.068 0 0 1-.123-.524c0-.244.064-.457.19-.639.128-.181.304-.322.528-.422.225-.1.484-.149.777-.149.304 0 .564.05.779.152.217.102.384.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.624.624 0 0 0-.246-.181.923.923 0 0 0-.37-.068c-.216 0-.387.05-.512.152a.472.472 0 0 0-.185.384c0 .121.048.22.144.3a.97.97 0 0 0 .404.175l.621.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-3.104-.033a1.32 1.32 0 0 1-.082-.466h.764a.576.576 0 0 0 .074.27.499.499 0 0 0 .454.246c.19 0 .33-.055.422-.164.091-.11.137-.265.137-.466v-2.745h.791v2.725c0 .44-.119.774-.357 1.005-.237.23-.565.345-.985.345a1.59 1.59 0 0 1-.568-.094 1.145 1.145 0 0 1-.407-.266 1.14 1.14 0 0 1-.243-.39Zm9.091-1.585v.522c0 .256-.039.47-.117.641a.862.862 0 0 1-.322.387.877.877 0 0 1-.47.126.883.883 0 0 1-.47-.126.87.87 0 0 1-.32-.387 1.55 1.55 0 0 1-.117-.641v-.522c0-.258.039-.471.117-.641a.87.87 0 0 1 .32-.387.868.868 0 0 1 .47-.129c.177 0 .333.043.47.129a.862.862 0 0 1 .322.387c.078.17.117.383.117.641Zm.803.519v-.513c0-.377-.069-.701-.205-.973a1.46 1.46 0 0 0-.59-.63c-.253-.146-.559-.22-.916-.22-.356 0-.662.074-.92.22a1.441 1.441 0 0 0-.589.628c-.137.271-.205.596-.205.975v.513c0 .375.068.699.205.973.137.271.333.48.589.626.258.145.564.217.92.217.357 0 .663-.072.917-.217.256-.146.452-.355.589-.626.136-.274.205-.598.205-.973Zm1.29-.935v2.675h-.746v-3.999h.662l1.752 2.66h.032v-2.66h.75v4h-.656l-1.761-2.676h-.032Z"></path>' +
        '            </svg>' +
        '        </div>' +
        '    </a>' +
        '</div>';
    
    // inject button
    // thumbnail parent css selector
    $('div.sm\\:inline-block > div:nth-child(1)').eq(0).append(r).click(function() {
        // Generate info.json and save it
        var text = getJsonMetadata();
        var filename = "info.json";

        download(filename, text);
    });
});
