// ==UserScript==
// @name         GGN Ebook Uploady
// @namespace    https://greasyfork.org
// @license      MIT
// @version      3.1
// @description  Uploady to parse information from GoodReads, Google Books, Amazon
// @author       drlivog
// @match        *://gazellegames.net/upload.php*
// @match        *://www.goodreads.com/book/show/*
// @match        *://www.amazon.com/*
// @match        *://www.google.com/books/edition/*
// @icon         null
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.xmlHttpRequest
// @grant        GM_addValueChangeListener
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/471875/GGN%20Ebook%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/471875/GGN%20Ebook%20Uploady.meta.js
// ==/UserScript==

/* globals $ */
/* jshint esversion: 11 */

const search_timeout = 1800; //time in seconds to consider a search in from GGn and add SaveData button
const max_tries = 10;

const debug = false;

const description_format = "[align=center][b][u]About this E-Book[/u][/b][/align]\n";

const release_description_format = "[align=center][quote]Publisher: [b]{publisher}[/b] | Published: [b]{pubdate}[/b] | Country: [b]{pubcountry}[/b] | Pages: [b]{pages}[/b][/quote][/align]";

const auto_check_anonymous = true;

let tries=0;

(function() {
    'use strict';
    if (window.location.href.includes("gazellegames.net/upload.php")) {
        const upload_type = document.querySelector('#categories');
        upload_type.addEventListener('change', (evt) => {
            if (evt.target.value === "E-Books") {
                GM_setValue('search_timeout', Date.now() + search_timeout*1000);
                tries=0;
                setTimeout(addEbookSearch, 500);
            }
        });
        if (upload_type.value === "E-Books") addEbookSearch();
        GM_addValueChangeListener("uploady", () => {validateEbook(); validateRelease();});
    } else if (window.location.href.includes("goodreads.com/book/show/")) {
        if (Date.now() > GM_getValue('search_timeout')) {
            debugLog("Search Timeout");
            return;
        }
        tries=0;
        awaitPageLoad(copyFromGoodReads);
    } else if (window.location.href.includes("google.com/books/edition/")) {
        if (Date.now() > GM_getValue('search_timeout')) {
            debugLog("Search Timeout");
            return;
        }
        tries=0;
        awaitPageLoad(copyFromGoogleBooks);
    } else if (window.location.href.match(/www\.amazon\.com\/.*/i)) {
        if (Date.now() > GM_getValue('search_timeout')) {
            debugLog("Search Timeout");
            return;
        }
        tries=0;
        setTimeout(awaitPageLoad(copyFromAmazon), 500);
    }
})();

function awaitPageLoad(chkFunc) {
    debugLog(`Tries: ${tries}`);
    if (tries < max_tries && !chkFunc()) {
        console.log(tries++);
        setTimeout( () => {
            awaitPageLoad(chkFunc);
        }, 300);
    }
}

function copyFromGoodReads() {
    const title = document.querySelector('.BookPage__mainContent');
    if (!title || document.querySelector('#uploadybutton')) return false;
    let uploadyBtn = document.createElement("button");
    uploadyBtn.innerText = "Save to GGN Uploady";
    uploadyBtn.id = "uploadybutton";
    title.prepend(uploadyBtn);
    document.querySelector('#uploadybutton').addEventListener("click", () => {
        const tags = Array.from(document.querySelectorAll('.BookPageMetadataSection__genreButton a span'));
        const authors = Array.from(document.querySelectorAll('.ContributorLinksList .ContributorLink__name'));
        const pub = findFromInnerText(".BookDetails__list .EditionDetails .DescListItem dt", "Published")?.nextElementSibling.innerText?.split(" by ");
        let uploady = {};
        uploady.source = "goodreads";
        uploady.title = document.querySelector('.Text__title1')?.innerText?.trim();
        uploady.originalauthors = authors.join(", ");
        uploady.authors = (authors.length>2)?"Various Authors":authors.map(x=>x.innerText?.trim())?.join(" and ");
        uploady.tags = tags.flatMap(x=>x?.innerText.toLowerCase().replaceAll(" ",".").trim())?.join(", ");
        uploady.coverpage = document.querySelector('.BookCover__image img')?.src;
        uploady.link = window.location.href;
        uploady.goodreadsuri = window.location.href;
        uploady.description = document.querySelector('.DetailsLayoutRightParagraph .Formatted')?.innerText?.trim();
        uploady.publisher = pub?.at(1)?.trim();
        uploady.pubdate = formatDate(Date.parse(pub?.at(0)?.trim()));
        uploady.pages = findFromInnerText(".BookDetails__list .EditionDetails .DescListItem dt", "Format")?.nextElementSibling.innerText.match(/(\d+)/)?.at(0);
        uploady.language = findFromInnerText(".BookDetails__list .EditionDetails .DescListItem dt", "Language")?.nextElementSibling.innerText;
        uploady.isbn = removeParentheticals(findFromInnerText(".BookDetails__list .EditionDetails .DescListItem dt", "ISBN")?.nextElementSibling.innerText);
        uploady.addedat = Date.now();
        GM_setValue("uploady", uploady);
        uploadyBtn.innerText = "Copied! Validate on Upload Page.";
        setTimeout(()=>{ uploadyBtn.innerText = "Save to GGN Uploady"; }, 5000);
    });
    setTimeout(()=>{if(!document.querySelector('#uploadybutton')) copyFromGoodReads();}, 2000);
    return true;
}

function copyFromAmazon() {
    const title = document.querySelector('#centerCol');
    if (!title) return false;
    let uploadyBtn = document.createElement("button");
    uploadyBtn.innerText = "Save to GGN Uploady";
    uploadyBtn.id = "uploadybutton";
    title?.prepend(uploadyBtn);
    uploadyBtn.addEventListener("click", () => {
        const tags = Array.from(document.querySelectorAll('#detailBulletsWrapper_feature_div > ul.a-unordered-list li ul li span.a-list-item a'));
        const authors = Array.from(document.querySelectorAll('#bylineInfo_feature_div .author a'));
        const pub = findFromInnerText('#detailBullets_feature_div ul li span span', "Publisher")?.nextElementSibling?.innerText?.split(" (");
        let uploady = {};
        uploady.source = "amazon";
        uploady.title = document.querySelector('#productTitle')?.innerText?.trim();
        uploady.originalauthors = authors.join(", ");
        uploady.authors = (authors.length>2)?"Various Authors":authors.map(x=>x.innerText?.trim())?.join(" and ");
        uploady.tags = processTags(tags.map(x=>x.innerText?.trim())).join(", ");
        uploady.coverpage = document.querySelector('#ebooksImgBlkFront')?.src || document.querySelector('#imgBlkFront')?.src;
        uploady.link = window.location.href;
        uploady.description = document.querySelector('#bookDescription_feature_div')?.outerText?.replace("Read more","")?.trim();
        uploady.publisher = pub?.at(0)?.trim();
        uploady.pubdate = formatDate(Date.parse(pub?.at(1).replaceAll(/[\(\)]/g,"")));
        uploady.pages = findFromInnerText('#detailBullets_feature_div ul li span span', " pages")?.innerText?.match(/(\d+)/)?.at(0);
        uploady.language = findFromInnerText('#detailBullets_feature_div ul li span span', "Language")?.nextElementSibling?.innerText;
        uploady.isbn = findFromInnerText('#detailBullets_feature_div ul li span span', "ISBN")?.nextElementSibling?.innerText;
        uploady.addedat = Date.now();
        GM_setValue("uploady", uploady);
        uploadyBtn.innerText = "Copied! Validate on Upload Page.";
        setTimeout(()=>{ uploadyBtn.innerText = "Save to GGN Uploady"; }, 5000);
    });

    function processTags(tags) {
        let pTags = new Array();
        if (tags === null) return pTags;
        for (let i=0; i< tags.length; i++) {
            let tag = removeParentheticals(tags[i]);
            let mtags = tag.split('&');
            mtags.forEach( (t) => {
                t=t.trim().toLowerCase().replaceAll(" ",".");
                if (!pTags.includes(t)) pTags.push(t);
            });
        }
        return pTags;
    }

    return true;
}

function copyFromGoogleBooks() {
    const title = document.querySelector('#main div[role="heading"]');
    if (!title) return false;
    let uploadyBtn = document.createElement("button");
    uploadyBtn.innerText = "Save to GGN Uploady";
    uploadyBtn.id = "uploadybutton";
    title?.after(uploadyBtn);
    let coverpage = document.querySelector("#viewport .pageImageDisplay > div > img ")?.src;
    debugLog(coverpage);
    uploadyBtn.addEventListener("click", () => {
        const genres = findFromInnerText('div > div > div > span:nth-child(1)', "Genres")?.nextElementSibling.innerText;
        const authors = findFromInnerText("#bep-tab-content div div span span", "Author")?.nextElementSibling?.innerText?.trim();
        let uploady = {};
        uploady.source = "googlebooks";
        uploady.title = document.querySelector('#main div[role="heading"]')?.innerText?.trim();
        uploady.originalauthors = authors;
        uploady.authors = (authors.split(",").length>2)?"Various Authors":authors.split(",")?.map(x=>x.trim())?.join(" and ");
        uploady.tags = genres;
        uploady.coverpage = coverpage;
        uploady.link = window.location.href;
        uploady.gplayuri = findFromInnerText('div > div > div > a > div > div > div', "Google Play Books")?.parentElement?.parentElement?.parentElement?.href;
        uploady.description = document.querySelector('#bep-tab-content g-expandable-content:nth-child(2) div:nth-child(1) div:nth-child(1)')?.innerText?.replace("--Provided by publisher.","")?.trim();
        uploady.publisher = findFromInnerText('div > div > div > span:nth-child(1)', "Publisher")?.nextElementSibling.innerText;
        uploady.pubdate = formatDate(Date.parse(findFromInnerText('div > div > div > span:nth-child(1)', "Published")?.nextElementSibling.innerText));
        uploady.pages = findFromInnerText('div > div > div > span:nth-child(1)', "Page count")?.nextElementSibling.innerText;
        uploady.language = findFromInnerText('div > div > div > span:nth-child(1)', "Language")?.nextElementSibling.innerText;
        uploady.isbn = findFromInnerText('div > div > div > span:nth-child(1)', "ISBN")?.nextElementSibling.innerText?.split(",")?.at(0);
        uploady.addedat = Date.now();
        GM_setValue("uploady", uploady);
        uploadyBtn.innerText = "Copied! Validate on Upload Page.";
        setTimeout(()=>{ uploadyBtn.innerText = "Save to GGN Uploady"; }, 5000);
    });
    return true;
}

function addEbookSearch() {
    if (!$('#googleplaybooksuri')) {
        if (tries++ >= max_tries) {
            debugLog("Too many tries adding ebook search");
            return false;
        }
        debugLog(`Try: ${tries}`);
        setTimeout(addEbookSearch, 200);
        return false;
    }
    $('#title').after('<input type="button" id="validate_ebook" value="Validate Ebook">')
        .after('<input type="button" id="search_google" value="Search Google Books">')
        .after('<input type="button" id="search_amazon" value="Search Amazon">')
        .after('<input type="button" id="search_goodreads" value="Search GoodReads">');

    $('<input type="button" id="validate_release" value="Validate Release">').insertAfter('#release_title').on("click", validateRelease);

    $(`<td align="left" width="50%">
    <input type="button" id="release_template" value="Insert Template"><br>
    <label>Publisher: <input type="text" id="publisher"></label><br>
    <label>Publish Date: <input type="date" id="pubdate"></label><br>
    <label>Country: <select id="pubcountry"><option disabled selected>Select Country...</option><option>United States</option><option>United Kingdom</option><option>Canada</option></select></label><br>
    <label>Pages: <input type="number" id="pubpages" size=7></label><br>`).insertAfter('td:has(#release_desc)');

    $('#release_template').on("click", () => {
        if ($('#release_desc:visible')) { $('#release_desc').val(release_description_format.replaceAll("{publisher}", "xxx")
                                                                 .replaceAll("{pubdate}", "xxx")
                                                                 .replaceAll("{pubcountry}", "xxx")
                                                                 .replaceAll("{pages}", "xxx"));
                                        }
    });

    $('#publisher').on("change", (evt) => { $('#release_desc:visible').val($('#release_desc:visible').val().replace(/Publisher: \[b\].*?\[\/b\]/, `Publisher: [b]${evt.target.value}[/b]`)); });
    $('#pubdate').on("change", (evt) => { $('#release_desc:visible').val($('#release_desc:visible').val().replace(/Published: \[b\].*?\[\/b\]/, `Published: [b]${evt.target.value}[/b]`)); });
    $('#pubcountry').on("change", (evt) => { $('#release_desc:visible').val($('#release_desc:visible').val().replace(/Country: \[b\].*?\[\/b\]/, `Country: [b]${evt.target.value}[/b]`)); });
    $('#pubpages').on("change", (evt) => { $('#release_desc:visible').val($('#release_desc:visible').val().replace(/Pages: \[b\].*?\[\/b\]/, `Pages: [b]${evt.target.value}[/b]`)); });

    $('<input type="button" id="desc_default_template" value="Insert Template">')
        .insertAfter('#album_desc').on("click", () => {
        $('#album_desc').val(description_format);
    });


    $('#search_goodreads').on("click", (evt) => {
        GM_setValue('search_timeout', Date.now() + search_timeout*1000);
        window.open(`https://www.goodreads.com/search?utf8=%E2%9C%93&query=${$('#title').val()}`, "_blank");
        event.preventDefault();
    });
    $('#search_amazon').on("click", (evt) => {
        GM_setValue('search_timeout', Date.now() + search_timeout*1000);
        window.open(`https://www.amazon.com/s?i=stripbooks&rh=p_28%3A$${$('#title').val()}&s=relevanceexprank&Adv-Srch-Books-Submit.x=0&Adv-Srch-Books-Submit.y=0&unfiltered=1&ref=sr_adv_b`, "_blank");
        event.preventDefault();
    });
    $('#search_google').on("click", (evt) => {
        GM_setValue('search_timeout', Date.now() + search_timeout*1000);
        window.open(`https://www.google.com/search?tbm=bks&q=${$('#title').val()}`, "_blank");
        event.preventDefault();
    });
    $('#validate_ebook').on("click", validateEbook);

    $(`<strong><a target="_blank" rel="noopener noreferrer" id="jsgooglesearchlink" href="http://www.google.com/search?tbm=isch&amp;hl=en&amp;q=">[Search Google]</a></strong>`)
        .insertAfter('input[value="PTPImg It"]').on("mouseup", (evt) => {evt.target.href = "http://www.google.com/search?tbm=isch&hl=en&q="+$('#title').raw().value+" book cover"; });
}

function validateEbook() {
    const uploady = GM_getValue('uploady');
    if (!$('#title:enabled')?.val()?.includes(" by ")) $('#title').val(uploady.title+" by "+uploady.authors);
    if ($('#tags:enabled')?.val()?.length<1) $('#tags').val(uploady.tags);
    if ($('#image:enabled')?.val()?.length<1) $('#image').val(uploady.coverpage);
    if (uploady?.goodreadsuri) $('#goodreadsuri:enabled').val(uploady.goodreadsuri);
    if (uploady?.gplayuri) $('#googleplaybooksuri:enabled').val(uploady.gplayuri);
    if (uploady?.description && $('#album_desc:enabled')?.raw()?.value.length<1) $('#album_desc').val(description_format+uploady.description);
}

function validateRelease() {
    const uploady = GM_getValue('uploady');
    if ($('#language:visible')?.val() === "---" && uploady.language) $('#language').val(uploady.language).change();
    if ($('#isbn:visible')?.val()?.length<1 && uploady.isbn) $('#isbn').val(uploady.isbn);
    if ($('#release_desc:visible')?.val()?.length<1 && release_description_format) { $('#release_desc').val(release_description_format.replaceAll("{publisher}", uploady?.publisher || "xxx")
                                                                                                            .replaceAll("{pubdate}", uploady?.pubdate || "xxx")
                                                                                                            .replaceAll("{pubcountry}", uploady?.pubcountry || "xxx")
                                                                                                            .replaceAll("{pages}", uploady?.pages || "xxx"));
                                                                                   }
    $('#publisher').val(uploady?.publisher || "");
    $('#pubdate').val(uploady?.pubdate || "");
    if (uploady?.pubcountry) $('#pubcountry').val(uploady?.pubcountry);
    $('#pubpages').val(uploady?.pages || "");
    if (auto_check_anonymous) $('#anonymous:visible').prop("checked", true);
}

function findFromInnerText(query, text) {
    return Array.from(document.querySelectorAll(query)).find(x=>x?.innerText.includes(text));
}

//formats a Date object as YYYY-MM-DD
function formatDate(d) {
    if (typeof d === "number") d = new Date(d);
    if (d instanceof Date) return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return null;
}

//remove everything between parenthesis
function removeParentheticals(s) {
    if (typeof s === "string") return s.replaceAll(/\(.*\)/ig,"").trim();
    return null;
}

function debugLog(s) {
    if (debug) console.log(s);
}
