// ==UserScript==
// @name           TorrentLeech Customiser
// @namespace      https://greasyfork.org/en/users/814-bunta
// @author         Bunta
// @description    Change TL links and formatting
// @include        https://v4.torrentleech.org/*
// @include        https://www.torrentleech.org/*
// @license        http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @version        1.1
// @downloadURL https://update.greasyfork.org/scripts/387283/TorrentLeech%20Customiser.user.js
// @updateURL https://update.greasyfork.org/scripts/387283/TorrentLeech%20Customiser.meta.js
// ==/UserScript==

var $ = unsafeWindow.$;

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("tr.torrent a:visited {color: #ff5050 ! important }");


// Add search bar
//$('<div class="tl-search-wrapper col-md-6 clearfix"><input value="" placeholder="Search..." class="tl-search pull-left" type="text"><div class="tl-search-btn-cnt"><button class="tl-search-btn"><i class="fa fa-search"></i></button></div></div>').insertAfter(".navbar-header");
/**$('<form class="navbar-form navbar-left hidden-sm hidden-xs">'+
'    <div class="nav-tl-search-wrapper">'+
'        <input required="" class="nav-tl-search" placeholder="Search" type="text">'+
'        <button type="button" class="nav-tl-search-btn">'+
'            <i class="fa fa-search"></i>'+
'        </button>'+
'    </div>'+
'</form>').insertAfter(".navbar-header");**/

// Function to perform movie search on button click
function movieSearchEvent(){
    var searchText = document.getElementsByClassName("txt")[0].value;
    var url = "https://www.torrentleech.org/torrents/browse/index/query/" + searchText + "/facets/category%253AMovies_size%253A%255B0%2BTO%2B4831838208%255D_name%253A%252A720p%252A";
    unsafeWindow.location.href = url;
}

// add movie search button
var elem = document.createElement("input");
elem.id = 'movie-search';
elem.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
elem.value = 'Movies';
elem.type = 'button';
elem.addEventListener('click', movieSearchEvent, false);
var filters = document.getElementById('filterTools');
if (filters) { filters.parentNode.insertBefore(elem,filters); }


// Function to view 90 day movie filter on button click
function movieFilterEvent(){
    var url = "https://www.torrentleech.org/torrents/browse/index/facets/category%253AMovies_subcategory%253ABDRip_added%253A%255BNOW%252FHOUR-90DAYS%2BTO%2BNOW%252FHOUR%252B1HOUR%255D/orderby/completed/order/desc";
    unsafeWindow.location.href = url;
}

// add movie filter button
var elem2 = document.createElement("input");
elem2.id = 'movie-filter';
elem2.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
elem2.value = 'Movies 90 days';
elem2.type = 'button';
elem2.addEventListener('click', movieFilterEvent, false);
//var filters = document.getElementById('filterTools');
if (filters) { filters.appendChild(elem2); }


// Function to view 5-30 day game filter on button click
function gameFilterEvent(){
    var url = "https://www.torrentleech.org/torrents/browse/index/facets/category%253AGames_added%253A%255BNOW%252FHOUR-30DAYS%2BTO%2BNOW%252FHOUR-0DAYS%255D/page/1/orderby/completed/order/desc";
    unsafeWindow.location.href = url;
}

// add game filter button
var elem3 = document.createElement("input");
elem3.id = 'movie-filter';
elem3.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only';
elem3.value = 'Games 0-30 days';
elem3.type = 'button';
elem3.addEventListener('click', gameFilterEvent, false);
//var filters = document.getElementById('filterTools');
if (filters) { filters.appendChild(elem3); }

// Highlight bad words Red and good words Green
// Use timeloop as table not always loaded before script executes
/** Currently disabled as this stops torrent lists updating with filter changes
$(function() {
    var updateTableTimer = setInterval(updateTable, 100);
    setTimeout(function(){clearInterval(updateTableTimer);},10000);

    function updateTable() {
        if ($("table.torrents").is(":visible")) {
            var titles = $("tr.torrent div.name a")
            titles.each(function() {
                this.innerHTML = this.innerHTML.replace(/RARBG/i,'<span style="color:red">RARBG</span>');
                this.innerHTML = this.innerHTML.replace(/budyzer/i,'<span style="color:red">budyzer</span>');
                this.innerHTML = this.innerHTML.replace(/x0r/i,'<span style="color:#00FF00">x0r</span>');
                this.innerHTML = this.innerHTML.replace(/GunGravE/i,'<span style="color:green">GunGravE</span>');
                this.innerHTML = this.innerHTML.replace(/-LEGi0N/i,'-<span style="color:green">LEGi0N</span>');
                this.innerHTML = this.innerHTML.replace(/-EVO/i,'-<span style="color:green">EVO</span>');
                this.innerHTML = this.innerHTML.replace(/MAJESTiC/i,'<span style="color:#00FF00">MAJESTiC</span>');
                this.innerHTML = this.innerHTML.replace(/ETRG/i,'<span style="color:green">ETRG</span>');
            });

            clearInterval(updateTableTimer);
        }
    }
});**/

// Create custom popcorn link
$("a.top-menu[title|='Popcorn']").attr('href','/torrents/movies/index/orderBy/trending/year/' + new Date().getFullYear() + '/categories/37%2C43%2C14%2C13');
$("ul.nav li a:contains('Movies')").attr('href','/torrents/movies/index/year/' + new Date().getFullYear() + '/categories/37%2C43%2C14%2C13');

/**
document.body.innerHTML= document.body.innerHTML.replace(/RARBG/g, function(m){
    return '<span style="color:red">'+m+'</span>'
});
*/

//#torrenttable tbody tr td span.title a