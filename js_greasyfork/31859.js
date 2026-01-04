// ==UserScript==
// @name         HBrowse Mobile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  izi pizi
// @author       Nutt
// @match        http://www.hbrowse.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31859/HBrowse%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/31859/HBrowse%20Mobile.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    $('link[rel=stylesheet]').remove();// $('#main').insertAfter('#container');
    $('html').append('<style>iframe, #sidebar, #menu, #footer, .overlay, #pageTable > tbody > tr:nth-child(1), #pageTable > tbody > tr:nth-child(2), #container > div:nth-child(5) { display: none !important; }body { margin:0px;padding:0px;font-family:tahoma; font-size:0.9em;}#container, #pageContainer { margin-left:10px;margin-right:10px; }#mangaImage, .thumbTable { width: 100% !important; }a { text-decoration:none;color:teal; }#querySearch > div > div {width:100% !important;max-width:300px;}.thumbImg {width:50% !important;max-width:300px;}#pageBottomOffset {float:none !important;display:block;}#pageTable, #pageBottomOffset {text-align:center !important;}#main > table:nth-child(2) > tbody > tr > td, #main > table:nth-child(2) > tbody > tr > td > a > img {width:100% !important;display:block !important; border:0 !important; margin: 0 !important;}#main > table:nth-child(2) {border-spacing:2px !important; position:absolute; left:0px; width:100%;}</style>');

    // This fetches all of the <img> tags and stores them in "tags".
    var tags = document.getElementsByTagName('img');

    // This loops over all of the <img> tags.
    for (var i = 0; i < tags.length; i++) {

        // This replaces the src attribute of the tag with the modified one
        tags[i].src = tags[i].src.replace('/zzz/', '/');
    }
    
    $(".browseLabel").each(function(index){
        var $IDs = $(this).parent().attr('onmouseover').replace("hoverOverNoDate('",'').replace("')",'');
        $(this).children("a").html("<img src='http://www.hbrowse.com/thumbnails/" + $IDs + "_1.jpg' width='50%'>" + "<img src='http://www.hbrowse.com/thumbnails/" + $IDs + "_2.jpg'  width='50%'>");
    });

    var url = $(location).attr('href');
    var chapter = url.split("/c");
      var chapters = new Array();
      $('.listRight').each(function(){
        chapters.push($(this).find('a').attr('href'));
      });
      $("#main > table:nth-child(2) > tbody > tr > td > a").attr("href",chapters[Number(chapter[1])+1]);
})();
