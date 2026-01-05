// ==UserScript==
// @name        E-/ExHentai Favourites Exporter
// @namespace   spittie
// @description Simple script to export/import your favorites from E-hentai and ExHentai, in a simple list to copy/paste wherever you want.
// @include     http://exhentai.org/favorites.php*
// @include     https://exhentai.org/favorites.php*
// @include     http://g.e-hentai.org/favorites.php*
// @include     https://g.e-hentai.org/favorites.php*
// @version     4
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/22271/E-ExHentai%20Favourites%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/22271/E-ExHentai%20Favourites%20Exporter.meta.js
// ==/UserScript==
 
var data = '';
var pageNumber = '';
var list = '';
 
var showImport = 0;
var showExport = 0;
 
function destroyBox() {
    $('#inputFav').remove();
    $('.uselessbr').each(function() {$(this).remove();});
    $('#favbutton').remove();
    $('#selectFav').remove();
 
    $('#exportFav').remove();
}
 
function exportFavorites() {
    if (showImport === 1) { destroyBox(); showImport = 0;}
    if (showExport === 0) {
        showExport = 1;
        $('#nb').append('<br class="uselessbr"/><br class="uselessbr"/>');
        $('#nb').append('<h2 class="uselessbr">Export Favorites');
        $('#nb').append('<textarea id="exportFav" name="Text1" cols="45" rows="10" ... />');
        $('#nb').append('<br class="uselessbr"/>');
    }
    else {
        destroyBox();
        showExport = 0;
    }
 
    var links = [];
    var items = document.getElementsByClassName('id3');
    for (var i = 0; i < items.length; i++) {
        var el = items[i];
        links.push(el.getElementsByTagName('a')[0].href);
    }
 
    $('#exportFav').val(links.join('\n'));
}
 
function addFavorites() {
    category = $('#selectFav').val();
    lines = $('#inputFav').val().split('\n');
    for(var i=0; i < lines.length; i++) {
        gid = lines[i].split('/')[4];
        t = lines[i].split('/')[5];
        url = "http://exhentai.org/gallerypopups.php?gid=" + gid + "&t=" + t + "&act=addfav";
        console.log(url);
        $.post(url, { favcat: category, favnote: "", submit: "Add+to+Favorites" });
    }
    $(document).ajaxStop(function() {
        alert('Done!');
    });
}
 
function importFavorites() {
    if (showExport === 1) { destroyBox(); showExport = 0;}
    if (showImport === 0) {
        $('#nb').append('<br class="uselessbr"/><br class="uselessbr"/>');
        $('#nb').append('<h2 class="uselessbr">Import Favorites');
        $('#nb').append('<textarea id="inputFav" name="Text1" cols="45" rows="10" ... />');
        $('#nb').append('<br class="uselessbr"/>');
        $('#nb').append('<notag class="uselessbr">Category: ');
        $('#nb').append('<select id="selectFav" class="stdinput">');
        for (var i=0; i < 10; i++) {
            $('#selectFav').append('<option value='+i+'>'+i);
        }
        $('#nb').append('<input class="stdbtn" id="favbutton" value="Import Favorites" type="submit">');
        $('#favbutton').click(addFavorites);
        showImport = 1;
    }
    else {
        destroyBox();
        showImport = 0;
    }
}
 
$(document).ready(function(){
    $('#nb').append($('<img>').attr('src','http://st.exhentai.net/img/mr.gif').attr('alt', ' '));
    $('#nb').append(' ');
    $('#nb').append($('<a/>').attr('href','#').attr('id','exportFavorites').text('Export Favorites'));
 
    $('#nb').append($('<img>').attr('src','http://st.exhentai.net/img/mr.gif').attr('alt', ' '));
    $('#nb').append(' ');
    $('#nb').append($('<a/>').attr('href','#').attr('id','importFavorites').text('Import Favorites'));
 
    $('#exportFavorites').click(exportFavorites);
    $('#importFavorites').click(importFavorites);
});