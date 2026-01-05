// ==UserScript==
// @name       RYM Custom Chart Filters
// @version     3.3
// @description     adds new filters to the rym custom charts
// @match      http://rateyourmusic.com/customchart*
// @match      https://rateyourmusic.com/customchart*
// @copyright  2012+, quiapz + pandrei rublev
// @namespace  https://greasyfork.org/users/2625
// @grant      GM_getValue
// @grant      GM_setValue
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/2429/RYM%20Custom%20Chart%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/2429/RYM%20Custom%20Chart%20Filters.meta.js
// ==/UserScript==

// Place new elements in the custom charts to let the user filter results in various ways
var contentTable = document.getElementById("content");
var targetBar = contentTable.getElementsByTagName("div")[4];
var newTargetBar = targetBar.cloneNode(true);
var newClearBar = document.createElement('div');
var minRatings = document.createElement('input');
var maxRatings = document.createElement('input');
var startYear = document.createElement('input');
var genreCb = document.createElement('input');
var excludeCb = document.createElement('input');

newTargetBar.innerHTML = '&nbsp';
newTargetBar.style.textAlign = 'left';
newClearBar.setAttribute('class', 'clear');
(targetBar.parentNode).insertBefore(newTargetBar, targetBar);
(targetBar.parentNode).insertBefore(newClearBar, targetBar);

// get albums that are ignored
var albumsRemove = GM_getValue('albumsRemoveCharts');
if (albumsRemove === undefined) {
    albumsRemove = '';
}

notgenres = '<label>exclude genres:</label> <input type="text" size="40" name="notgenres" id="notgenres" value=""';
notgenres += ' onfocus="descriptorattachSuggest(this.id);" autocomplete="off"><br><br>';

$('#include').before(notgenres);

if (document.URL.indexOf('notgenres=') > 0){
    notgens = document.URL.split('notgenres=')[1].split('&')[0].replace(/\+/g,' ').replace(/\%2C/g,',').replace(/\%5B/g,'[').replace(/\%5D/g,']');
    $('#notgenres').val(notgens);
}

document.getElementById('notgenres').addEventListener('change', filterChart, false);

var label4 = document.createElement('span');
label4.innerHTML = '&nbsp&nbsp';
label4.style.float = 'none';
newTargetBar.appendChild(label4);

var label5 = document.createElement('span');
label5.id = 'toggle_exfilter_lbl';
label5.innerHTML = 'Show excluded releases:&nbsp';
label5.style.float = 'none';
newTargetBar.appendChild(label5);

excludeCb.type = 'checkbox';
excludeCb.id = 'excludeCbInput';
excludeCb.style.float = 'none';
excludeCb.style.verticalAlign = '-3px';
excludeCb.addEventListener('click', filterChart, false);
newTargetBar.appendChild(excludeCb);

var label3 = document.createElement('span');
label3.innerHTML = '&nbsp|&nbsp';
label3.style.float = 'none';
newTargetBar.appendChild(label3);

var label = document.createElement('span');
label.id = 'toggle_gfilter_lbl';
label.innerHTML = 'Display releases with ALL genres specified:&nbsp';
label.style.float = 'none';
newTargetBar.appendChild(label);

genreCb.type = 'checkbox';
genreCb.id = 'genreCbInput';
genreCb.style.float = 'none';
genreCb.style.verticalAlign = '-3px';
genreCb.addEventListener('click', filterChart, false);
newTargetBar.appendChild(genreCb);

var label1 = document.createElement('span');
label1.innerHTML = '&nbsp|&nbsp';
label1.style.float = 'none';
newTargetBar.appendChild(label1);

var label2 = document.createElement('span');
label2.id = 'minRatings';
label2.innerHTML = 'Min # of ratings:&nbsp';
label2.style.float = 'none';
newTargetBar.appendChild(label2);

minRatings.type = 'text';
minRatings.id = 'minRatingsInput';
minRatings.size = 7;
minRatings.maxLength = 7;
minRatings.style.float = 'none';
minRatings.style.height = '10px';
minRatings.style.fontSize = '10px';
minRatings.addEventListener('change', filterChart, false);
newTargetBar.appendChild(minRatings);

var label3 = document.createElement('span');
label3.innerHTML = '&nbsp|&nbsp';
label3.style.float = 'none';
newTargetBar.appendChild(label3);

var label4 = document.createElement('span');
label4.id = 'maxRatings';
label4.innerHTML = 'Max # of ratings:&nbsp';
label4.style.float = 'none';
newTargetBar.appendChild(label4);

maxRatings.type = 'text';
maxRatings.id = 'maxRatingsInput';
maxRatings.size = 7;
maxRatings.maxLength = 7;
maxRatings.style.float = 'none';
maxRatings.style.height = '10px';
maxRatings.style.fontSize = '10px';
maxRatings.addEventListener('change', filterChart, false);
newTargetBar.appendChild(maxRatings);

$(newTargetBar).append('<span style="float: none;">&nbsp;|&nbsp;</span>');
$(newTargetBar).append('<span style="float: none;">From (year):&nbsp;</span>');
$(newTargetBar).append('<input type="text" id="startYearInput" size="4" maxlength="4" style="float: none; height: 10px; font-size: 10px;">');
document.getElementById('startYearInput').addEventListener('change', filterChart, false);

$(newTargetBar).append('<span style="float: none;">&nbsp;|&nbsp;</span>');
$(newTargetBar).append('<span style="float: none;">To (year):&nbsp;</span>');
$(newTargetBar).append('<input type="text" id="endYearInput" size="4" maxlength="4" style="float: none; height: 10px; font-size: 10px;">');
document.getElementById('endYearInput').addEventListener('change', filterChart, false);

function filterChart() {
    var minRatingsNum = parseInt($("#minRatingsInput").val());
    var maxRatingsNum = parseInt($("#maxRatingsInput").val());
    var genreCbVal = (document.getElementById("genreCbInput")).checked;
    var excludeCbVal = (document.getElementById("excludeCbInput")).checked;
    var startYearNum = parseInt((document.getElementById("startYearInput")).value);
    var endYearNum = parseInt((document.getElementById("endYearInput")).value);
    var genres = $("#genres").val().split(',');
    var genresExcluded = $("#notgenres").val().split(',');

    //new start
    $.each($('.mbgen:eq(0)').find('tr'), function(){
        var hideAlbum = false;
        if (!excludeCbVal && albumsRemove.length > 0){
            if (albumsRemove.indexOf($(this).find('.album:eq(0)').attr('title')) > -1){hideAlbum = true;}
        }
        // year filter
        if (!hideAlbum && (!(startYearNum == "") || !(endYearNum === ""))) {
            if (isNaN(startYearNum)) {startYearNum = 0;}
            if (isNaN(endYearNum)) {endYearNum = Number.MAX_VALUE;}
            var albumYear = parseInt($(this).find('.mediumg').text().replace(/[()]/g, ''));
            if ((albumYear < startYearNum) || (albumYear > endYearNum)) {hideAlbum = true;}
        }
        // ratings filter
        if(!hideAlbum && (!(minRatingsNum === "") || !(maxRatingsNum === ""))){
            if (isNaN(minRatingsNum)) {minRatingsNum = 0;}
            if (isNaN(maxRatingsNum)) {maxRatingsNum = Number.MAX_VALUE;}
            var albumRatings = parseInt($(this).find('b:eq(-2)').text());
            if ((albumRatings < minRatingsNum) || (albumRatings > maxRatingsNum)) {hideAlbum = true;}
        }
        // exclude specified genres
        if(!hideAlbum){
            for (i = 0; i < genresExcluded.length; i++) {genresExcluded[i] = genresExcluded[i].trim();}
            genre_plaintext = '';
            $.each($(this).find('.genre'),function(){
                genre_plaintext += $(this).text().toLowerCase();
                if (genresExcluded.indexOf($(this).text().toLowerCase()) > -1){hideAlbum = true;}
            });
            $.each(genresExcluded, function(){
                if(this.indexOf('[') === 0){
                    if(genre_plaintext.indexOf(this.toLowerCase().replace(/[\[\]]/g,'')) >= 0){hideAlbum = true;}
                }});
        }
        // genre include all matching filter
        if(!hideAlbum && genreCbVal){
            for (i = 0; i < genres.length; i++) {genres[i] = genres[i].trim();}
            var matches = 0;
            $.each($(this).find('.genre'),function(){
                if (genres.indexOf($(this).text().toLowerCase()) > -1){matches++;}
            });
            if (matches != genres.length){hideAlbum = true;}
        }
        if(hideAlbum){$(this).hide();}
        else{$(this).show();}
    });
    //end
}

function addAlbum(album) {
    if (albumsRemove.indexOf(album.getAttribute('title')) >= 0) {
        albumsRemove = albumsRemove.replace(album.getAttribute('title', ','), '');
        album.nextSibling.nextSibling.innerHTML = 'x';
        alert(album.innerHTML + ' has been removed from your ignore list.');
    } else {
        albumsRemove = album.getAttribute('title') + ',' + albumsRemove;
        var excludeCbVal = (document.getElementById("excludeCbInput")).checked;

        if (!excludeCbVal) {
            album.parentNode.parentNode.parentNode.parentNode.style.display = "none";
        }
        album.nextSibling.nextSibling.innerHTML = '+';
    }
    GM_setValue('albumsRemoveCharts', albumsRemove);
}
var albumsRemove = GM_getValue('albumsRemoveCharts');
if (albumsRemove === undefined) {
    albumsRemove = '';
}
var albums = document.getElementsByClassName('album');
if (albums !== undefined) {
    for (u = 0; u < albums.length; u++) {

        y = document.createElement('a');
        y.innerHTML = '  ';
        removeButton = document.createElement('a');
        removeButton.setAttribute('href', 'javascript:void(0);');
        removeButton.setAttribute('class', 'smallgray');
        albums[u].parentNode.insertBefore(removeButton, albums[u].nextSibling);
        albums[u].parentNode.insertBefore(y, albums[u].nextSibling);
        removeButton.addEventListener('click', (function (n) {
            return function (e) {
                e.preventDefault();
                addAlbum(n);
            };
        })(albums[u]), false);
        if (albumsRemove.indexOf(albums[u].getAttribute('title')) >= 0) {
            albums[u].parentNode.parentNode.parentNode.parentNode.style.display = "none";
            removeButton.innerHTML = '+';
        } else {
            removeButton.innerHTML = 'x';
        }
    }
}

filterChart();