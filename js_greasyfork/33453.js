// ==UserScript==
// @name         PTH colour format links
// @version      0.9
// @description  Colour the links for torrents by format so they stand out
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/33453/PTH%20colour%20format%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/33453/PTH%20colour%20format%20links.meta.js
// ==/UserScript==

(function() {
  'use strict';

  doColours();
})();

function doColours()
{
  var colours = [{format:'FLAC', colour:'#1AC8D8'},
                 {format:'FLAC / 24bit', colour:'#196FD8', source:'Web'},
                 {format:'FLAC / 24bit', colour:'#930DCC', source:'Vinyl'},
                 {format:'FLAC', colour:'#A9CC0E', source:'SACD'},
                 {format:'/', colour:'#D88B19', source:'5.1 Surround'}, // '/' as the format should select all torrents
                 {format:'/', colour:'#D88B19', source:'5.1 Audio'},
                 {format:'/', colour:'#D88B19', source:'Surround'},
                 //{format:'<format here>', colour:'<colour here>'},
                ];

  var torrents = document.getElementsByClassName('group_torrent');
  if(torrents.length === 0)
    return;
  var edition;
  for(var k=0; k<torrents.length; k++)
  {
    var t=torrents[k];
    if(t.getAttribute('class').indexOf(' edition ') !== -1)
    {
      edition=t;
      continue;
    }
    else if(t.getAttribute('class').substr(-7) === "edition")
    {
      edition=t;
      continue;
    }
    else if(t.getAttribute('class').indexOf(' edition_') === -1)
      continue;

    var a=t.getElementsByTagName('a');
    a=a[a.length-1];
    for(var i=0; i<colours.length; i++)
    {
      var c=colours[i];
      if(a.textContent.indexOf(c.format) !== -1)
      {
        if(c.source)
        {
          if(edition.textContent.toLowerCase().indexOf(c.source.toLowerCase()) === -1)
            continue;
        }

        a.setAttribute('style', 'color: '+c.colour+'; text-shadow: 0px 0px 10px;');
      }
    }
  }

  var box=document.createElement('div');
  var inb=document.getElementsByClassName('sidebar')[0].firstElementChild.nextElementSibling;
  if(window.localStorage.hideFilter==="true")
    box.setAttribute('style', 'display: none;');
  inb.parentNode.insertBefore(box, inb);
  box.setAttribute('class', 'box');
  var h=document.createElement('div');
  h.innerHTML='<strong>Torrent Filter</strong>';
  h.setAttribute('class', 'head');
  box.appendChild(h);
  var b=document.createElement('div');
  b.setAttribute('class', 'body');
  box.appendChild(b);

  var format=window.localStorage.filterFormat;
  if(format)
    format=JSON.parse(format);
  else
    format=[];
  var input=document.createElement('input');
  input.value=format.join(', ');
  input.placeholder='FLAC, MP3 / V0, etc';
  input.addEventListener('keyup', update.bind(undefined, 'filterFormat', input));
  b.appendChild(input);

  var source=window.localStorage.filterSource;
  if(source)
    source=JSON.parse(source);
  else
    source=[];
  var input=document.createElement('input');
  input.value=source.join(', ');
  input.placeholder='Web, Surround, etc';
  input.addEventListener('keyup', update.bind(undefined, 'filterSource', input));
  b.appendChild(input);

  var stats=document.createElement('a');
  stats.id='filterStats';
  stats.href='javascript:void(0);';
  stats.innerHTML='0 torrents hidden';
  stats.addEventListener('click', toggleHidden);
  stats.setAttribute('style', 'display: block; text-align: center; margin-top: 5px; font-weight: bold;');
  b.appendChild(document.createElement('br'));
  b.appendChild(stats);

  hide();
}

function update(localStorage, input)
{
  window.localStorage[localStorage]=JSON.stringify(input.value.split(', '));
  hide();
}

function hide()
{
  var count=0;
  var torrents = document.getElementsByClassName('group_torrent');

  for(var i=0; i<torrents.length; i++)
  {
    var t=torrents[i];
    if(t.getAttribute('class').indexOf('hidden') === -1)
    {
      t.style.display='';
    }
  }

  var filterSource=window.localStorage.filterSource;
  if(filterSource)
  {
    filterSource=JSON.parse(filterSource);

    var edition;
    var hide=false;
    for(var k=0; k<torrents.length; k++)
    {
      var t=torrents[k];
      if(t.getAttribute('class').indexOf(' edition ') !== -1)
      {
        edition=t;
        hide=true;
        for(var i=0; i<filterSource.length; i++)
        {
          var f=filterSource[i];
          if(t.textContent.toLowerCase().indexOf(f.toLowerCase()) !== -1)
          {
            hide=false;
          }
        }
        if(hide)
          t.style.display='none';
        continue;
      }
      else if(t.getAttribute('class').indexOf(' edition_') === -1)
        continue;
      if(hide)
      {
        t.style.display='none';
        count++;
      }
    }
  }

  var filterFormat=window.localStorage.filterFormat;
  if(filterFormat)
  {
    filterFormat=JSON.parse(filterFormat);

    var edition;
    var editionCount=0;
    var editionHidden=0;

    for(var k=0; k<torrents.length; k++)
    {
      var t=torrents[k];
      if(t.getAttribute('class').indexOf(' edition ') !== -1)
      {
        if(editionCount > 0 && editionCount === editionHidden && edition)
          edition.style.display='none';
        edition=t;
        editionCount=0;
        editionHidden=0;
        continue;
      }
      else if(t.getAttribute('class').indexOf(' edition_') === -1)
        continue;

      editionCount++;

      var a=t.getElementsByTagName('a');
      a=a[a.length-1];//[0].parentNode.parentNode.lastChild.previousElementSibling;
      var hide=true;
      for(var i=0; i<filterFormat.length; i++)
      {
        var f=filterFormat[i];

        if(a.textContent.toLowerCase().indexOf(f.toLowerCase()) !== -1)
        {
          hide=false;
        }
      }
      if(hide)
      {
        t.style.display='none';
        editionHidden++;
        count++;
      }
    }
    if(editionCount > 0 && editionCount === editionHidden && edition)
      edition.style.display='none';

    var stats=document.getElementById('filterStats');
    if(count > 0)
      stats.innerHTML='Show '+count+' hidden torrents';
    else
      stats.innerHTML='0 hidden torrents';
  }
}

function toggleHidden()
{
  var stats=document.getElementById('filterStats');
  if(stats.innerHTML.indexOf('Show') === 0)
  {
    stats.innerHTML='Hide torrents';

    var torrents = document.getElementsByClassName('group_torrent');

    for(var i=0; i<torrents.length; i++)
    {
      var t=torrents[i];
      if(t.getAttribute('class').indexOf('hidden') === -1)
      {
        t.style.display='';
      }
    }
  }
  else
    hide();
}