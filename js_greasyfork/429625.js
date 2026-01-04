// ==UserScript==
// @name         discogs/release/searchlinks(bv)
// @version      0.1.0
// @description  add web search links to discogs
// @author       denlekke
// @include      http*://*discogs.com/*
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/429625/discogsreleasesearchlinks%28bv%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429625/discogsreleasesearchlinks%28bv%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('https://www.discogs.com') != -1)
    showDiscogs();
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.column {float: left;width: 50%;}');
addGlobalStyle('.row:after {content: ""; display: table; clear: both;}');

function showDiscogs()
{
  var pTitle=document.getElementById('profile_title');
  if(pTitle)
  {
    var albumNodes = pTitle.childNodes;
    var album=albumNodes[albumNodes.length-1].textContent.trim();
    if(album==="")
      album=albumNodes[albumNodes.length-2].textContent.trim();

    var span=pTitle.getElementsByTagName('a')[0].parentNode;
    var artist=span.getAttribute('title').replace(/\(.*\)/g, '');

    var page_aside=document.getElementById('page_aside');
    var before=page_aside.firstElementChild.nextElementSibling.nextElementSibling;
    var sect=document.createElement('div');
    var row=document.createElement('div');
    var col1=document.createElement('div');
    var col2=document.createElement('div');
    var row_h3=document.createElement('div');
    var col1_h3=document.createElement('div');
    var col2_h3=document.createElement('div');
    sect.setAttribute('class', 'section');
    row.setAttribute('class', 'row');
    col1.setAttribute('class', 'column');
    col2.setAttribute('class', 'column');
    row_h3.setAttribute('class', 'row');
    col1_h3.setAttribute('class', 'column');
    sect.appendChild(row_h3);
    sect.appendChild(row);
    row_h3.appendChild(col1_h3);
    row_h3.appendChild(col2_h3);
    row.appendChild(col1);
    row.appendChild(col2);
    before.parentNode.insertBefore(sect, before);

    var h3_1=document.createElement('h3');
    var h3_2=document.createElement('h3');
    col1_h3.appendChild(h3_1);
    h3_1.appendChild(document.createTextNode(' Search Web'));


    var year=document.getElementsByClassName('head');
    for(var i=0; i<year.length; i++)
    {
      if(year[i].innerHTML.indexOf('Released')!==-1)
      {
        year=year[i].nextElementSibling.textContent.trim().split(' ');
        year=year[year.length-1];
        break;
      }
    }

    var a=document.createElement('a');
    a.href="https://www.youtube.com/results?search_query="+encodeURIComponent(artist+' '+album);
    a.innerHTML = 'YouTube';
    a.target = '_blank';
    col2.appendChild(a);
    col2.appendChild(document.createElement('br'));

    // if slash present, put either side of it in an "or" search
    var album_for_ebay = album;
    if (album.includes("/")){
        album_for_ebay = "("+album.split("/")[0].trim()+","+ album.split("/")[1].trim()+")";
    }

    var formatID = ""
    var formatString = ""
    var format = document.querySelector("a[href^='/search/?format_exact=Cassette']")
    if (format != null){
        formatID = "176983"
        formatString = "Cassette"
    }
    format = document.querySelector("a[href^='/search/?format_exact=CD']")
    if (format != null){
        formatID = "176984"
        formatString = "CD"
    }
    format = document.querySelector("a[href^='/search/?format_exact=Vinyl']")
    if (format != null){
        formatID = "176985"
        formatString = "Vinyl"
    }
    var a=document.createElement('a');
    a.href="https://www.ebay.com/sch/"+formatID+"/i.html?_from=R40&_blrs=category_constraint&LH_PrefLoc=2&_nkw="+encodeURIComponent(artist.trim()+' '+album_for_ebay.trim());
    a.innerHTML = 'Ebay '+formatString;
    a.target = '_blank';
    col2.appendChild(a)
    col2.appendChild(document.createElement('br'));

    var a=document.createElement('a');
    a.href="https://bandcamp.com/search?q="+encodeURIComponent(artist+' '+album)
    a.innerHTML = 'bandcamp';
    a.target = '_blank';
    col2.appendChild(a);
    col2.appendChild(document.createElement('br'));

    var a=document.createElement('a');
    a.href="https://www.google.com/search?q=\""+encodeURIComponent(artist+' '+album) +"\""
    a.innerHTML = 'Google';
    a.target = '_blank';
    col2.appendChild(a);
    col2.appendChild(document.createElement('br'));

    var a=document.createElement('a');
    a.href="https://www.juno.co.uk/search/?q%5Ball%5D%5B%5D="+encodeURIComponent(artist+' '+album) +"&hide_forthcoming=0"
    a.innerHTML = 'juno';
    a.target = '_blank';
    col2.appendChild(a);
    col2.appendChild(document.createElement('br'));
  }
}
