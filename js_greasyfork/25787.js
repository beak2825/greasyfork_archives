// ==UserScript==
// @name         RED search link on discogs
// @version      0.7
// @description  Link to a search from discogs pages to RED
// @author       Chameleon
// @include      http*://*discogs.com/*
// @include      http*://redacted.ch/upload.php*
// @include      http*://redacted.ch/requests.php?action=new*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25787/RED%20search%20link%20on%20discogs.user.js
// @updateURL https://update.greasyfork.org/scripts/25787/RED%20search%20link%20on%20discogs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  if(window.location.href.indexOf('https://www.discogs.com') != -1)
    showDiscogs();
  else if(window.location.href.indexOf('redacted.ch') != -1)
    showPTH();

})();

function showPTH()
{
  var discogs=window.location.href.split('discogs=');
  if(discogs.length == 1)
    return;
  
  discogs=discogs[1];

  if(window.location.href.indexOf('requests.php')!==-1)
  {
    var artist=decodeURIComponent(window.location.search.split('&artist=')[1].split('&')[0]);
    var album=decodeURIComponent(window.location.search.split('&album=')[1].split('&')[0]);
    var year=decodeURIComponent(window.location.search.split('&year=')[1].split('&')[0]);
    document.getElementById('artist').value=artist;
    document.getElementsByName('title')[0].value=album;
    document.getElementsByName('year')[0].value=year;
    return;
  }

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
    var albumNodes = pTitle.childNodes;
    var album=albumNodes[albumNodes.length-1].textContent.trim();
    if(album==="")
      album=albumNodes[albumNodes.length-2].textContent.trim();
    
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
    img.src='https://ptpimg.me/2rwc77.png';
    img.style.height='1em';
    h3.appendChild(img);
    h3.appendChild(document.createTextNode(' RED'));
    var d1=document.createElement('div');
    d1.setAttribute('class', 'section_content');
    div.appendChild(d1);
    
    var a=document.createElement('a');
    a.href="https://redacted.ch/artist.php?artistname="+artist;
    a.innerHTML="Search artist";
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://redacted.ch/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    a.innerHTML = 'Search album';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://redacted.ch/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Upload original';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));

    var a=document.createElement('a');
    a.href="https://redacted.ch/upload.php?discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Upload edition';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));

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
    a.href="https://redacted.ch/requests.php?action=new&discogs="+encodeURIComponent(window.location.href)+'&artist='+encodeURIComponent(artist)+'&album='+encodeURIComponent(album)+'&year='+year;
    a.innerHTML = 'Request';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    /*var a=document.createElement('a');
    a.href="https://redacted.ch/artist.php?artistname="+artist;
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://ptpimg.me/2rwc77.png';
    img.style.height='0.8em';
    a.appendChild(img);
    span.appendChild(document.createTextNode(' '));
    span.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://redacted.ch/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://ptpimg.me/2rwc77.png';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://redacted.ch/upload.php?discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://ptpimg.me/83k157.png';
    a.title='Upload to PTH (Edition)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://redacted.ch/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "pth";
    var img=document.createElement('img');
    img.src='https://ptpimg.me/83k157.png';
    a.title='Upload to PTH (Original)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);*/
  }
}
