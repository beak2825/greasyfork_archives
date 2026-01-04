// ==UserScript==
// @name         Enlace de búsqueda de Efecto Doppler en Discogs
// @version      0.7
// @description  Enlace para buscar desde páginas de Discogs hacia Efecto Doppler
// @author       enremolinos92, based on Chameleon and Lunanox previous scripts
// @include      http*://*discogs.com/*
// @include      http*://efectodoppler.pw/upload.php*
// @include      http*://efectodoppler.pw/requests.php?action=new*
// @grant        none
// @namespace https://greasyfork.org/es/users/224625
// @downloadURL https://update.greasyfork.org/scripts/374143/Enlace%20de%20b%C3%BAsqueda%20de%20Efecto%20Doppler%20en%20Discogs.user.js
// @updateURL https://update.greasyfork.org/scripts/374143/Enlace%20de%20b%C3%BAsqueda%20de%20Efecto%20Doppler%20en%20Discogs.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  if(window.location.href.indexOf('https://www.discogs.com') != -1)
    showDiscogs();
  else if(window.location.href.indexOf('efectodoppler.pw') != -1)
    showED();

})();

function showED()
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
    window.setTimeout(showED, 500);
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
    img.src='https://imgur.com/voC2bwe.png';
    img.style.height='1em';
    h3.appendChild(img);
    h3.appendChild(document.createTextNode(' ED'));
    var d1=document.createElement('div');
    d1.setAttribute('class', 'section_content');
    div.appendChild(d1);
    
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/artist.php?artistname="+artist;
    a.innerHTML="Buscar artista";
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    a.innerHTML = 'Buscar album';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Subir original';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));

    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/upload.php?discogs="+encodeURIComponent(window.location.href);
    a.innerHTML = 'Subir edición';
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
    a.href="https://efectodoppler.pw/requests.php?action=new&discogs="+encodeURIComponent(window.location.href)+'&artist='+encodeURIComponent(artist)+'&album='+encodeURIComponent(album)+'&year='+year;
    a.innerHTML = 'Hacer petición';
    d1.appendChild(a);
    d1.appendChild(document.createElement('br'));
    
    /*var a=document.createElement('a');
    a.href="https://efectodoppler.pw/artist.php?artistname="+artist;
    //a.innerHTML = "ed";
    var img=document.createElement('img');
    img.src='https://imgur.com/voC2bwe.png';
    img.style.height='0.8em';
    a.appendChild(img);
    span.appendChild(document.createTextNode(' '));
    span.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/torrents.php?searchstr="+encodeURIComponent(artist+' '+album);
    //a.innerHTML = "ed";
    var img=document.createElement('img');
    img.src='https://imgur.com/voC2bwe.png';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/upload.php?discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "ed";
    var img=document.createElement('img');
    img.src='https://imgur.com/4PriRTE.png';
    a.title='Subir a Efecto Doppler (Edición)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);
        
    var a=document.createElement('a');
    a.href="https://efectodoppler.pw/upload.php?edition=0&discogs="+encodeURIComponent(window.location.href);
    //a.innerHTML = "ed";
    var img=document.createElement('img');
    img.src='https://imgur.com/4PriRTE.png';
    a.title='Subir a Efecto Doppler (Original)';
    img.style.height='0.8em';
    a.appendChild(img);
    pTitle.appendChild(document.createTextNode(' '));
    pTitle.appendChild(a);*/
  }
}
