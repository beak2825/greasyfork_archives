// ==UserScript==
// @name         PTH Non-Jam Top 10
// @version      0.5
// @description  Hide torrents with jam.band on the "Top 10"
// @author       Chameleon
// @include      http*://redacted.ch/*
// @include      http*://apollo.rip/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25753/PTH%20Non-Jam%20Top%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/25753/PTH%20Non-Jam%20Top%2010.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('threadid=3392') != -1 && window.location.href.indexOf('redacted.ch') != -1)
    showSettings();
  if(window.location.href.indexOf('threadid=4281') != -1 && window.location.href.indexOf('apollo.rip') != -1)
    showSettings();

  document.getElementById('nav_top10').getElementsByTagName('a')[0].href="/top10.php?type=torrents&limit=100&nonjam=true";
  if(window.location.href.indexOf("/top10.php?type=torrents&limit=100&nonjam=true") != -1)
    filterTop100();
})();

function filterTop100()
{
  document.getElementsByTagName('h2')[0].innerHTML = 'Top 10 Torrents';
  var h3s = document.getElementsByTagName('h3');
  for(var i=0; i<h3s.length; i++)
  {
    h3s[i].innerHTML = h3s[i].innerHTML.replace(/100/, "10");
  }

  var settings = getSettings();
  var tables = document.getElementsByClassName('torrent_table');
  for(var i=0; i<tables.length; i++)
  {
    var count=0;
    var trs=tables[i].getElementsByTagName('tr');
    for(var j=1; j<trs.length; j++)
    {
      var tags=trs[j].getElementsByClassName('tags')[0];
      var hasTag=false;
      for(var k=0; k<settings.blacklist.length; k++)
      {
        if(tags.innerHTML.indexOf(settings.blacklist[k]) != -1 || count >= 10)
        {
          trs[j].style.display='none';
          hasTag=true;
          break;
        }
      }
      var artist=trs[j].getElementsByTagName('a')[1].textContent;
      for(var k=0; k<settings.artists.length; k++)
      {
        if(artist === settings.artists[k] || count >= 10)
        {
          trs[j].style.display='none';
          hasTag=true;
          break;
        }
      }
      if(!hasTag)
        count++;
    }
  }
}

function showSettings(message)
{
  var div=document.getElementById('ChameleonSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'ChameleonSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Non-Jam Top 10 Settings</h2><br />';
  var settings = getSettings();

  var labelStyle = '';

  var label = document.createElement('span');
  label.setAttribute('style', labelStyle+' margin-left: 10px;');
  label.innerHTML = 'Ignore Tags: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 20em;');
  input.placeholder='Ignore torrents with these tags';
  input.value = settings.blacklist ? settings.blacklist.join(', '):'';
  div.appendChild(input);
  input.addEventListener('change', changeSettings.bind(undefined, div), false);

  div.appendChild(document.createElement('br'));

  var label = document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Ignore Artists: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 20em;');
  input.placeholder='Ignore torrents with these artists';
  input.value = settings.artists ? settings.artists.join(', '):'';
  div.appendChild(input);
  input.addEventListener('change', changeSettings.bind(undefined, div), false);

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Save';
  div.appendChild(document.createElement('br'));
  div.appendChild(a);
}

function changeSettings(div, nul, message)
{
  var settings = getSettings();
  var inputs=div.getElementsByTagName('input');

  settings.blacklist = inputs[0].value.split(', ');
  settings.artists = inputs[1].value.split(', ');

  window.localStorage.nonJamTop10Settings = JSON.stringify(settings);
  showSettings(message);
}

function getSettings()
{
  var settings = window.localStorage.nonJamTop10Settings;
  if(!settings)
  {
    settings = {blacklist:['jam.band', 'jam.rock']};
  }
  else
    settings = JSON.parse(settings);
  if(!settings.ignoreTags)
    settings.ignoreTags='';
  return settings;
}
