// ==UserScript==
// @name         NWCD search link on Discogs
// @version      0.65
// @description  Link to a search from discogs pages to NWCD
// @author       Chameleon
// @include      http*://*discogs.com/*
// @include      http*://notwhat.cd/upload.php*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/26230/NWCD%20search%20link%20on%20Discogs.user.js
// @updateURL https://update.greasyfork.org/scripts/26230/NWCD%20search%20link%20on%20Discogs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  if(window.location.href.indexOf('https://www.discogs.com') != -1)
    showDiscogs();
  else if(window.location.href.indexOf('notwhat.cd') != -1)
    showPTH();

})();

function showPTH()
{
  var discogs=window.location.href.split('discogs=');
  if(discogs.length == 1)
    return;
  
  discogs=discogs[1];
  var yadg_input=document.getElementById('yadg_input');
  if(!yadg_input)
  {
    window.setTimeout(showPTH, 500);
    return;
  }
  yadg_input.value=decodeURIComponent(discogs);
  var yadg_target=document.getElementById('yadg_target');
  if(window.location.href.indexOf('edition=0') != -1)
  {
    yadg_target.value="original";
  }
  else
  {
    yadg_target.value="other";
  }
  document.getElementById('yadg_submit').click();
}

function showDiscogs()
{
  var pTitle=document.getElementById('profile_title');
  if(pTitle)
  {
    var album = pTitle.getElementsByTagName('span');
    album=album[album.length-1].textContent.trim();
    
    var span=pTitle.getElementsByTagName('a')[0].parentNode;
    var artist=span.getAttribute('title').replace(/\(.*\)/g, '');
    
    var page_aside=document.getElementById('page_aside');
    var before=page_aside.firstElementChild.nextElementSibling.nextElementSibling;
    var div=document.createElement('div');
    div.setAttribute('class', 'section');
    before.parentNode.insertBefore(div, before);
    var h3=document.createElement('h3');
    div.appendChild(h3);
    var img=document.createElement('img');
    img.src='https://art.notwhat.co/5e795d5cad9e.png';
    img.style.height='1em';
    h3.appendChild(img);
    h3.appendChild(document.createTextNode(' NWCD'));
    var d1=document.createElement('div');
    d1.setAttribute('class', 'section_content');
    div.appendChild(d1);
    
    var a=document.createElement('a');
    a.href="https://notwhat.cd/artist.php?artistname="+artist;
    a.innerHTML="Search artist";
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://notwhat.cd/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    a.innerHTML = 'Search album';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://notwhat.cd/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Upload original';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://notwhat.cd/upload.php?discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Upload edition';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    /*var a=document.createElement('a');
    a.href="https://notwhat.cd/artist.php?artistname="+artist;
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://art.notwhat.co/5e795d5cad9e.png';
    img.style.height='0.8em';
    a.appendChild(img);
    span.appendChild(document.createTextNode(' '));
    span.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://notwhat.cd/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://art.notwhat.co/5e795d5cad9e.png';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://notwhat.cd/upload.php?discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://art.notwhat.co/5e795d5cad9e.png';
    a.title='Upload to NWCD (Edition)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://notwhat.cd/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://art.notwhat.co/5e795d5cad9e.png';
    a.title='Upload to NWCD (Original)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);*/
  }
}