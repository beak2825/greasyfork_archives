// ==UserScript==
// @name          PTP and BTN Links on IMDb
// @namespace     PTP-BTN-links-on-imdb
// @version       1.1
// @description   Adds links on IMDb title pages to other relevant sites
// @author        Ineluctable (Based on a script created by Chameleon)
// @include       *imdb.com/title/tt*
// @include       *.archive.org/web/*/*.imdb.com/title/tt*
// @downloadURL https://update.greasyfork.org/scripts/13039/PTP%20and%20BTN%20Links%20on%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/13039/PTP%20and%20BTN%20Links%20on%20IMDb.meta.js
// ==/UserScript==
// Changelog:
//   1.1: Added Google Spreadsheet link code to handle single and double quotes in titles, cleaned up script.
//   1.0: Added link for easy adding an IMDB page to a Google Spreadsheet
//   0.9: Improved code that obtains the title from the page - now looks for element with itemprop=name.
//   0.8: Code now handles updated IMDB page, added Amazon search, did some refactoring
//   0.7: Changed positioning of search links, fixed a link generation problem, other small changes.
//   0.6: Added FlixSearch
//   0.5: Added Netflix search
//   0.4: links will now open in a new tab/window.

var sites = [
    {acronym: 'PTP', search_string: 'https://tls.passthepopcorn.me/torrents.php?imdb=tt<imdb_id>'},
    {acronym: 'BTN', search_string: 'https://broadcasthe.net/torrents.php?imdb=tt<imdb_id>'},
    {acronym: 'Netflix', search_string: 'http://www.netflix.com/search/<imdb_title>'},
    {acronym: 'FlixSearch', search_string: 'https://flixsearch.io/search/<imdb_title>'},
    {acronym: 'Amazon', search_string: 'https://www.amazon.com/s/?url=search-alias=prime-instant-video&field-keywords=<imdb_title>'},
    {acronym: 'SS', search_string: 'javascript:void(0);'} // js place-holder to be hooked onto later via .onclick
];


var imdb_id = document.querySelector("link[rel='canonical']");
if (imdb_id)
    imdb_id = imdb_id.href.split('/tt')[1].substring(0,7);
else
    imdb_id = document.URL.split('/tt')[1].substring(0,7);

var imdb_header = document.getElementsByClassName('header')[0];
if (!imdb_header)
    imdb_header = document.getElementsByTagName('h1')[0];
var imdb_year = imdb_header.getElementsByTagName('span')[1];

var imdb_title = document.querySelector('[itemprop=name]').childNodes[0].textContent;
imdb_title = imdb_title.trim(); // seperated trim from the other statement to hopefully make for easier debugging


var link_holder = document.createElement('span');
var links = document.createElement('span');
links.id = 'search_links';

if (imdb_year) // old style IMDB
{
    links.style.fontSize = "15px";

    link_holder.appendChild(document.createTextNode('('));
    link_holder.appendChild(links);
    link_holder.appendChild(document.createTextNode(')'));
    imdb_header.parentNode.insertBefore(link_holder, imdb_header.nextSibling);
}
else
{
    links.style.fontSize = "12px";

    var subtext = document.getElementsByClassName('subtext')[0];
    subtext.appendChild(document.createElement('br'));
    subtext.appendChild(document.createElement('br'));

    link_holder.innerHTML = 'Search: ';
    link_holder.appendChild(links);
    subtext.appendChild(link_holder);
}


add_links();


function add_links()
{
    var search_links = document.getElementById('search_links');
    search_links.innerHTML = '';

    for(var i = 0; i < sites.length; i++)
    {
        if (i == 2) {
            search_links.appendChild(document.createTextNode(' - '));
        }
        else if (i !== 0) {
            search_links.appendChild(document.createTextNode(', '));
        }
        
        var search_str = sites[i].search_string;
        search_str = search_str.replace('<imdb_id>', imdb_id);
        search_str = search_str.replace('<imdb_title>', imdb_title);

        var a = document.createElement('a');
        a.innerHTML = sites[i].acronym;
        a.id = "search_" + sites[i].acronym; // assign unique IDs to each link for further targetting
        a.href = search_str;
        a.setAttribute('target', '_blank');

        search_links.appendChild(a);
    }
}



if (spreadsheet_link = document.getElementById("search_SS")) {
    spreadsheet_link.setAttribute('target', '_self');
    spreadsheet_link.onclick = function() {
        imdb_title = imdb_title.replace(/\"/g, '""');
        void(prompt("Copy the text below (Ctrl+C) and paste it into a spreadsheet cell.", '=HYPERLINK("http://www.imdb.com/title/tt' + imdb_id + '/","' + imdb_title + '")'));
    };
}