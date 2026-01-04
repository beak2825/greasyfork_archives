// ==UserScript==
// @name        ZLibrary Book Page Search Bar
// @description Adds a search bar on book pages. Search new books or articles without going back to the main page.
// @namespace   T1mL3arn
// @version     1.0.4
// @match       http*://*.b-ok.cc/book/*
// @match       http*://*.bookos-z1.org/book/*
// @match       http*://*.booksc.xyz/book/*
// @match       http*://book4you.org/book/*
// @match       http*://ru1lib.org/book/*
// @match       http*://3lib.net/book/*
// @match       http*://*.zlibraryexau2g3p.onion/book/*
// @grant       none
// @icon        https://github.com/t1ml3arn-userscript-js/ZLibrary-Book-Page-Search-Bar/raw/master/icon.png
// @author      T1mL3arn
// @license     WTFPL 2
// @homepageURL https://github.com/t1ml3arn-userscript-js/ZLibrary-Book-Page-Search-Bar
// @supportURL  https://github.com/t1ml3arn-userscript-js/ZLibrary-Book-Page-Search-Bar/issues
// @downloadURL https://update.greasyfork.org/scripts/406333/ZLibrary%20Book%20Page%20Search%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/406333/ZLibrary%20Book%20Page%20Search%20Bar.meta.js
// ==/UserScript==

(() => {
    
const searchFormHtml = `<form method="get" id="searchForm" action="/s/">
<ul id="searchModeTabs">
    <li class="active"><span>General Search</span></li>
    <li class=""><a href="/fulltext/" style="margin-left: -1px;">Fulltext Search</a></li>
</ul>

<div class="b-search-form">
    <div class="b-search-input g-clearfix">
        <div class="input">
            <input type="text" maxlength="200" name="q" id="searchFieldx" value="" placeholder="Search for title, author, ISBN, publisher, md5.." style="padding-right: 12px;">
        </div>
        <div class="button whiteShadow">
            <div class="inner">
                <button type="submit">
                    <span class="hidden-xs">search</span>
                    <span class="glyphicon glyphicon-search visible-xs-block"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<div style="overflow: hidden;padding-bottom: 5px;">
    <div id="advSearch-wrapper" style="float:left;margin-right: 25px;">
        <div>
            <span id="advSearch-control" style="border-bottom: 1px dashed; color: rgb(119, 119, 119); font-size: 14px; cursor: pointer; display: none;">Search options</span>
        </div>
        <div style="" id="advSearch">
            <input type="checkbox" name="e" value="1" id="ftcb"> <label for="ftcb">Exact matching</label>
            <select name="yearFrom"></select>                    
            <select name="yearTo"></select>                    
            <select name="language"><option value="" selected="">Any Language</option><option value="english">English</option><option value="russian">Russian</option><option value="german">German</option><option value="spanish">Spanish</option><option value="dutch">Dutch</option><option value="french">French</option><option value="italian">Italian</option><option value="ukrainian">Ukrainian</option><option value="polish">Polish</option><option value="portuguese">Portuguese</option><option value="bulgarian">Bulgarian</option><option value="chinese">Chinese</option><option value="greek">Greek</option><option value="romanian">Romanian</option><option value="turkish">Turkish</option><option value="persian">Persian</option><option value="arabic">Arabic</option><option value="japanese">Japanese</option><option value="swedish">Swedish</option><option value="hungarian">Hungarian</option><option value="serbian">Serbian</option><option value="latin">Latin</option><option value="croatian">Croatian</option><option value="czech">Czech</option><option value="kazakh">Kazakh</option><option value="belarusian">Belarusian</option><option value="indonesian">Indonesian</option><option value="lithuanian">Lithuanian</option><option value="catalan">Catalan</option><option value="finnish">Finnish</option><option value="azerbaijani">Azerbaijani</option><option value="korean">Korean</option><option value="bengali">Bengali</option><option value="esperanto">Esperanto</option><option value="hindi">Hindi</option><option value="urdu">Urdu</option><option value="danish">Danish</option><option value="uzbek">Uzbek</option><option value="slovak">Slovak</option><option value="norwegian">Norwegian</option><option value="vietnamese">Vietnamese</option><option value="indigenous">Indigenous</option><option value="bashkir">Bashkir</option><option value="marathi">Marathi</option><option value="kirghiz">Kirghiz</option><option value="tajik">Tajik</option><option value="tatar">Tatar</option><option value="albanian">Albanian</option><option value="somali">Somali</option><option value="icelandic">Icelandic</option><option value="mongolian">Mongolian</option><option value="latvian">Latvian</option><option value="georgian">Georgian</option><option value="sanskrit">Sanskrit</option><option value="hebrew">Hebrew</option><option value="slovenian">Slovenian</option><option value="malayalam">Malayalam</option><option value="afrikaans">Afrikaans</option><option value="nepali">Nepali</option><option value="sinhala">Sinhala</option></select>                    
            <select name="extension"><option value="" selected="">Any Extension</option><option value="pdf">pdf</option><option value="epub">epub</option><option value="djvu">djvu</option><option value="fb2">fb2</option><option value="txt">txt</option><option value="rar">rar</option><option value="mobi">mobi</option><option value="lit">lit</option><option value="doc">doc</option><option value="rtf">rtf</option></select>                
        </div>
    </div>
</div>
</form>`
const KEY_SHOW_SEARCH_BAR = "zlib-search-bar-show"

function onSubmit(e) {
    // Find all inputs
    // and set them disabled if they have no value.
    // No idea for what it is, 
    // just tried to mimic ZLib behavior ¯\_(ツ)_/¯
    $(e.currentTarget)
        .find('select, input')
        .each((i,e) => $(e).val() === "" ? $(e).attr("disabled", "disabled") : null)
}

function setSearchBarVisibilityCookie() {
    const showVal = $("#searchForm").is(":hidden") ? "0" : "1"
    window.localStorage.setItem(KEY_SHOW_SEARCH_BAR, showVal)
}

function BorderHideHack() {
    return $("<div></div>").css({
        'width': '100%',
        'height': '10px',
        'position': 'absolute',
        'bottom': '-5px',
        'left': 0,
        'z-index': 5,
        'background': 'white',
    })
}

function YearSelectOptions(to, from, initial) {
    const list = []

    for (let year = from; year <= to; year++) {
        list.push(new Option(year, year, false, false))
    }

    list.push(new Option(initial, "", true, true))
    list.reverse()

    return list
}

/**
 * 
 * @param {Boolean} articleSearch If `false` - the book search form will be created,
 * otherwise it will be the article search form
 */
function SearchForm(articleSearch = false) {
    const form = $(searchFormHtml)

    // NOTE articles search bar differs with abscence of languages and extension <selects> 
    // and also differs with main input placeholder - "Search for title, author, DOI, journal, md5.."
    // Define book or articel search form
    if (articleSearch) {
        form.find('select[name="language"], select[name="extension"]').remove()
        form.find('#searchFieldx').attr('placeholder', 'Search for title, author, DOI, journal, md5..')
    }

    // set options for year select
    const year = new Date().getFullYear()
    form.find('select[name="yearFrom"]').append(YearSelectOptions(year, 1920, "Year from"))
    form.find('select[name="yearTo"]').append(YearSelectOptions(year, 1920, "Year to"))
    // we cant query id from document,
    // cause at this moment the form is not in the DOM
    form.find("#advSearch-wrapper").css({'font-size': 'smaller'})

    // styling search type tabs
    form.find("#searchModeTabs").css({
        "display": "inline-flex",
        "flex-flow": "row",
        "background-color": "#f6f6f6",
        "padding": "0 20px",
    })
    .find("li").css({
        "padding": "1px 15px",
        "font-size": "smaller",
        "border": "1px solid rgb(178, 178, 178)",
        "border-bottom": "0px",
    })

    form.find('#searchModeTabs li:first-child').css({
        "background-color": "white",
        "color": "rgb(51, 51, 51)",
        'position': 'relative',
    })
    .append(BorderHideHack())

    form.find('#searchModeTabs li > a').css({
        "text-decoration": 'none',
    })
    // -------------------------------

    form.find(".b-search-form").css({
        "position": "relative",
        "z-index": 2,
    })

    form.submit(onSubmit)

    return form
}

function SearchFormTogglerBase() {
    const html = `
    <div>
        <span class="glyphicon glyphicon-search"></span>
    </div>`

    return $(html).click(_ => $("#searchForm").slideToggle(200, setSearchBarVisibilityCookie))
}

function SearchFormToggler() {
    
    // Rule to hide search form toggle button on small screens.
    // Without this the toggler can be seen in two places on the page.
    $("<style></style>").text(`
    @media (max-width: 767px){
        .zlib-search-bar-toggler--d-sm-none {
            display: none !important;
        }
    }
    `).appendTo(window.document.head)

    return SearchFormTogglerBase().css({
        "display": "block", 
        "padding": "15px",
        "box-sizing": "border-box",
        "height": "100%",
        "cursor": "pointer",
    })
    .addClass("zlib-search-bar-toggler--d-sm-none")
    .hover(
        e => $(e.currentTarget).css({ "background-color": "#d6d6d6" })
        , e => $(e.currentTarget).css({ "background-color": "" })
    )
}

function SearchFormToggler_md() {
    const btn = SearchFormTogglerBase()
    btn.find('.glyphicon.glyphicon-search').css({ top: "-2px"})

    return btn.addClass('navbar-toggle')
        .css({ 
            'cursor': 'pointer',
            'height': '34px',
            'margin-right': '4px',
        })
}

// find it is book or article search
const articleHosts = ["booksc.xyz"]
const host = window.location.hostname
const isArticleHost = articleHosts.indexOf(host) !== -1

const searchForm = SearchForm(isArticleHost)

const show = window.localStorage.getItem(KEY_SHOW_SEARCH_BAR)
if (show !== null) {
    if (show === "1")   searchForm.show()
    else                searchForm.hide()
} else {
    searchForm.hide()
}

// add search form on top of a page
$('.col-md-12.itemFullText').prepend(searchForm)

// search button for medium and up screens
$('<li></li>').append(SearchFormToggler()).insertBefore($('.nav.navbar-nav.navbar-right .dropdown').last())

// search button for up to medium screens
SearchFormToggler_md().insertAfter($('.navbar-header button.navbar-toggle'))

// switch search form visibility on double click
// $(document).on('dblclick', _ => searchForm.slideToggle(200))

})()
