// ==UserScript==
// @name        Letterboxd.com to PTP
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @namespace   https://greasyfork.org/en/users/4819-chris-dankbutts
// @description It adds a link in the right side panel for searching PTP for torrents with the respective IMDb code(main film page) or Title(pages such as 'user reviewed film').
// @include     *letterboxd.com/*
// @version     3.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/393895/Letterboxdcom%20to%20PTP.user.js
// @updateURL https://update.greasyfork.org/scripts/393895/Letterboxdcom%20to%20PTP.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function addLinkIMDB() {

        //IMDb search
    var imdbUrla = $(".text-link a").first().attr("href");
    var linka = "https://trakt.tv/search/imdb?q=tt" + getImdb(imdbUrla);


    var l = $("#userpanel ul");
    var parent = l[0];

    var listItema = document.createElement('li');
    listItema.setAttribute('id','listitema');
    var aa = document.createElement("a");
    aa.innerHTML="Trakt - Search by IMDb code";
    aa.setAttribute('href', linka);
    listItema.appendChild(aa);

    //IMDb search
    var imdbUrl = $(".text-link a").first().attr("href");
    var link = "https://passthepopcorn.me/torrents.php?action=advanced&searchstr=tt" + getImdb(imdbUrl);



    var listItem = document.createElement('li');
    listItem.setAttribute('id','listitem');
    var a = document.createElement("a");
    a.innerHTML="PTP - Search by IMDb code";
    a.setAttribute('href', link);
    listItem.appendChild(a);

    //DIRECTOR search
    var node    = document.querySelector (
    "#featured-film-header p a span.prettify"
);
var dir = node.textContent
    var link2 = "https://passthepopcorn.me/torrents.php?action=advanced&searchstr=&artistname="+dir;

    var listItem2 = document.createElement('li');
    listItem2.setAttribute('id','listitem2');
    var a2 = document.createElement("a");
    a2.innerHTML="PTP - Search Director";
    a2.setAttribute('href', link2);
    listItem2.appendChild(a2);


    parent.appendChild(listItema);
    parent.appendChild(listItem);
    parent.appendChild(listItem2);
    $(l[0]).listview("refresh");

}

function addLinkTitle() {


    // var parent = document.getElementById('featured-film-header');

    var title = $(".film-title-wrapper a").first().text();
    var link = "https://passthepopcorn.me/torrents.php?action=advanced&searchstr=" + title;
    //alert(link);

    var l = $("#userpanel ul");
    var parent = l[0];

    var listItem = document.createElement('li');
    listItem.setAttribute('id','listitem');
    var a = document.createElement("a");
    a.innerHTML="PTP - Search by Title";
    a.setAttribute('href', link);
    listItem.appendChild(a);

    parent.appendChild(listItem);

    $(l[0]).listview("refresh");


}

function getImdb(href) {
    var from = href.indexOf("imdb.com/title/tt") + 17;
    if(from < 17)
        return null;
    var to = href.indexOf("/", from);
    if(to < 0)
        to = href.length;
    return href.substring(from, to);
}



String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
}

function xpath(query) {
    return document.evaluate(query, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

(function () {
    var href = window.location.href;
    if(!href.contains("letterboxd.com/film/") && href.contains("/film/"))
        addLinkTitle();
    else if(href.contains("letterboxd.com/film/"))
        addLinkIMDB();

})();