// ==UserScript==
// @name       Cinemagia & IMDB To Filelist
// @namespace  http://use.i.E.your.homepage/
// @version    0.9
// @description  Helps you to search movies from cinemagia or IMDB, on filelist
// @match      https://www.cinemagia.ro/*
// @match      https://www.imdb.com/*
// @copyright  2014, mytzusky
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4885/Cinemagia%20%20IMDB%20To%20Filelist.user.js
// @updateURL https://update.greasyfork.org/scripts/4885/Cinemagia%20%20IMDB%20To%20Filelist.meta.js
// ==/UserScript==

var cinemagiaIconSizePx = 23;
var imdbIconSizePx = 25;

var categories = {
    // Filme
    25:{visible: false, id:"25", name:"Filme 3D", img:"https://filelist.io/styles/images/cat/3d.png"},
    6: {visible: true, id:"6", name:"Filme 4K", img:"https://filelist.io/styles/images/cat/4k.png"},
    26:{visible: false, id:"26", name:"Filme 4K Blu-Ray", img:"https://filelist.io/styles/images/cat/4kBD.png"},
    20:{visible: false, id:"20", name:"Filme BluRay", img:"https://filelist.io/styles/images/cat/bluray.png"},
    2: {visible: false, id:"2", name:"Filme DVD", img:"https://filelist.io/styles/images/cat/dvd.png"},
    3: {visible: false, id:"3", name:"Filme DVD-RO", img:"https://filelist.io/styles/images/cat/dvd-ro.png"},
    4: {visible: false, id:"4", name:"Filme HD", img:"https://filelist.io/styles/images/cat/hd.png"},
    19:{visible: true, id:"19", name:"Filme HD-RO", img:"https://filelist.io/styles/images/cat/hd-ro.png"},
    1: {visible: false, id:"1", name:"Filme SD", img:"https://filelist.io/styles/images/cat/sd.png"},

    // Seriale
    27:{visible: false, id:"27", name:"Seriale 4K", img:"https://filelist.io/styles/images/cat/4ks.png"},
    21:{visible: false, id:"21", name:"Seriale HD", img:"https://filelist.io/styles/images/cat/hdtv.png"},
    23:{visible: false, id:"23", name:"Seriale SD", img:"https://filelist.io/styles/images/cat/sdtv.png"},

};

var subtitles = {
    1:{visible: true, url:'https://titrari.ro/index.php?page=cautare&z1=0&z2=##search##&z3=1&z4=1', img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7dNrxHptt_IcvaHt5xGoLsqVo8bWPqHTuMw&usqp=CAU"}
}


$(function() {
    var pathname = window.location.pathname;
    console.log("Filelist script enabled on : " + pathname);

    // h1 > a: Pagina unui film (la titlu)
    // .title > h2 > a: Filme pe categorii sau an. Ex: http://www.cinemagia.ro/filme-animatie/2013/
    //		 Filme de urmarit la TV
    //.film a: Box Office section
    //.movie a: BoxOffice page. Ex: http://www.cinemagia.ro/boxoffice/romania/
    // .info > h2 > a: https://www.cinemagia.ro/program-tv/filme-la-tv/
    $('h1 > a, .title > h2 > a, .film a, td.movie a, .info > h2 > a').filter(function() {
        return this.href.match('(http|https)://www.cinemagia.ro/filme/[^/]*/$');
    }).each(function() {
        var origTitle = $(this).html();
        for (subtitle in subtitles) {
            if (subtitles[subtitle].visible){
                addCinemagiaSearchSubIcon(this, origTitle, subtitles[subtitle]);
            }
        }
        for (categ in categories) {
            if (categories[categ].visible){
                addCinemagiaSearchIcon(this, origTitle, categories[categ]);
            }
        }
    });

    // http://www.cinemagia.ro/club/pagina-mea/filme/
    $('.list_7 a').filter(function() {
        return (this.href.match('^(http|https)://www.cinemagia.ro/filme/[a-zA-Z0-9]'));
    }).each(function() {
        var origTitle = $(this).find("strong").html();
        for (subtitle in subtitles) {
            if (subtitles[subtitle].visible){
                addCinemagiaSearchSubIcon(this, origTitle, subtitles[subtitle]);
            }
        }
        for (categ in categories) {
            if (categories[categ].visible){
                addCinemagiaSearchIcon(this, origTitle, categories[categ]);
            }
        }
    });

    $('.title_wrapper h1').each(function() {
        var origTitle = $(this).html();
        for (categ in categories) {
            if (categories[categ].visible){
                addIMDBSearchIcon(this, origTitle, categories[categ]);
            }
        }
        for (subtitle in subtitles) {
            if (subtitles[subtitle].visible){
                addIMDBSearchSubIcon(this, origTitle, subtitles[subtitle]);
            }
        }
    });
});

var order = 0;
function addCinemagiaSearchIcon(movieLink, movieTitle, category) {
    order++;
    var searchTerm = movieTitle.replace(" ", "+");
    console.log(order + ". "+searchTerm);
    var iconHtml = getCinemagiaFilelistIcon(searchTerm, category, cinemagiaIconSizePx);
    $(movieLink).parent().prepend(iconHtml);
}

function addIMDBSearchIcon(movieLink, movieTitle, category) {
    order++;
    var searchTerm = movieTitle.substring(0, movieTitle.indexOf('&nbsp')).replace(" ", "+");
    console.log(order + ". "+searchTerm);
    var iconHtml = getIMDBFilelistIcon(searchTerm, category, imdbIconSizePx);
    $('.title_wrapper').append(iconHtml);
}

function getCinemagiaFilelistIcon(searchTerm, category, size) {
    return '<a href="https://filelist.io/browse.php?search='+searchTerm+'&cat='+category.id+'" style="margin-right:5px;"><img style="border: 1px solid;" width="'+size+'" height="'+size+'" src="'+category.img+'"></a>';
}

function getIMDBFilelistIcon(searchTerm, category, size) {
    return '<a href="https://filelist.io/browse.php?search='+searchTerm+'&cat='+category.id+'" style="margin-right:5px;"><img style="margin-top:5px; border: 1px solid;" width="'+size+'" height="'+size+'" src="'+category.img+'"></a>';
}

function addCinemagiaSearchSubIcon(movieLink, movieTitle, subtitle) {
    order++;
    var searchTerm = movieTitle.replace(" ", "+");
    console.log(order + ". "+searchTerm);
    var iconHtml = getCinemagiaSubtitleIcon(searchTerm, subtitle, cinemagiaIconSizePx);
    $(movieLink).parent().prepend(iconHtml);
}

function getCinemagiaSubtitleIcon(searchTerm, subtitle, size) {
    var searchUrl = subtitle.url.replace("##search##", searchTerm);
    return '<a href="'+searchUrl+'" style="margin-right:5px;"><img style="border: 1px solid;" width="'+size+'" height="'+size+'" src="'+subtitle.img+'"></a>';
}

function addIMDBSearchSubIcon(movieLink, movieTitle, subtitle) {
    order++;
    var searchTerm = movieTitle.substring(0, movieTitle.indexOf('&nbsp')).replace(" ", "+");
    console.log(order + ". "+searchTerm);
    var iconHtml = getIMDBSubtitleIcon(searchTerm, subtitle, imdbIconSizePx);
    $('.title_wrapper').append(iconHtml);
}

function getIMDBSubtitleIcon(searchTerm, subtitle, size) {
    var searchUrl = subtitle.url.replace("##search##", searchTerm);
    return '<a href="'+searchUrl+'" style="margin-right:5px;"><img style="margin-top:5px; border: 1px solid;" width="'+size+'" height="'+size+'" src="'+subtitle.img+'"></a>';
}