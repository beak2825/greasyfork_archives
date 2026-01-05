// ==UserScript==
// @name         PTH Top 10 Cover Art View
// @version      0.6
// @description  Show the top 10 with album art rather than as a list
// @author       Chameleon
// @include      http*://redacted.ch/top10.php
// @include      http*://*redacted.ch/forums.php?*threadid=2625*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25762/PTH%20Top%2010%20Cover%20Art%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/25762/PTH%20Top%2010%20Cover%20Art%20View.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(window.location.href.indexOf('forums.php') != -1)
    showSettings();
  else
    showTop10();
})();

function showTop10()
{
  var div=document.createElement('div');
  var content = document.getElementById('content').firstElementChild;
  content.parentNode.insertBefore(div, content);

  getTop10(div);
}

function getTop10(div)
{ 
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "/ajax.php?action=top10&limit=100");
  xhr.onreadystatechange = xhr_func.bind(undefined, div, xhr, gotTop10.bind(undefined, div), getTop10.bind(undefined, div));
  xhr.send();
}

function alreadyDone(id, done)
{
  for(var i=0; i<done.length; i++)
  {
    if(id == done[i])
      return true;
  }
  return false;
}

function prettyPrint(number)
{
  var amount = number;
  var pow = 0;
  for(var i=10; i<=50; i=i+10)
  {
    if(Math.abs(amount)/Math.pow(2, i) > 1)
      pow=i/10;
  }
  var suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  return (Math.round(amount/Math.pow(2, pow*10)*100))/100+' '+suffixes[pow];
}

function addTorrent(div, t, dlLinkAdd, width)
{
  var d1=document.createElement('div');
  d1.setAttribute('style', 'margin: auto; margin-top: 5px; background: rgba(0,0,0,1); border-radius: 10px; width:'+width+'px');
  div.appendChild(d1);
  var s=document.createElement('span');
  d1.appendChild(s);
  s.innerHTML = t.format+' / '+t.encoding+' / '+t.media+' - '+prettyPrint(t.size);
  d1.appendChild(document.createElement('br'));

  var s=document.createElement('span');
  d1.appendChild(s);
  s.innerHTML = t.snatched;
  s.title='Snatched';
  d1.appendChild(document.createTextNode(' / '));
  var s=document.createElement('span');
  d1.appendChild(s);
  s.innerHTML = t.seeders;
  s.title='Seeders';
  d1.appendChild(document.createTextNode(' / '));
  var s=document.createElement('span');
  d1.appendChild(s);
  s.innerHTML = t.leechers;
  s.title='Leechers';
  d1.appendChild(document.createTextNode(' - '));
  var a=document.createElement('a');
  a.href='/torrents.php?action=download&id='+t.torrentId+dlLinkAdd;
  a.innerHTML = '[DL]';
  d1.appendChild(a);
  //div.appendChild(document.createElement('br'));
}

function gotTop10(div, response)
{
  var settings = getSettings();
  var r=JSON.parse(response);
  var width=Math.floor((document.getElementById('content').clientWidth)/settings.horizontalCoverCount)-1;
  var margin=5;
  var innerWidth=width-(2*margin);
  var borderRadius=15;
  var dlLinkAdd="&authkey="+document.getElementsByClassName('group_info')[0].getElementsByTagName('a')[0].href.split('authkey=')[1];
  console.log(r);

  for(var j=0; j<r.response.length; j++)
  {
    var done=[];
    var r1=r.response[j];
    var torrents=r1.results;
    var section=document.createElement('section');
    section.setAttribute('style', 'text-align: center; border-radius: '+borderRadius+'px;');
    section.setAttribute('class', 'box');
    div.appendChild(section);
    var hr=document.createElement('hr');
    hr.setAttribute('style', 'width: '+((width*settings.horizontalCoverCount)-(2*borderRadius))+'px; margin: auto;');
    section.appendChild(hr);
    var a=document.createElement('a');
    a.setAttribute('style', 'text-align: center; display: block; font-size: 2em;');
    section.appendChild(a);
    a.innerHTML = "Top "+settings.topX+" "+r1.caption.replace("Torrents", "Groups");
    a.href='javascript:void(0);';
    var torrentSection = document.createElement('div');
    a.addEventListener('click', toggle.bind(undefined, torrentSection), false);
    section.appendChild(torrentSection);
    var alCount=0;
    for(var i=0; i<torrents.length && alCount<settings.topX; i++)
    {
      var t=torrents[i];
      if(alreadyDone(t.groupId, done))
      {
        var tDiv=document.getElementById('overlayGroup_'+t.groupId+'_'+j);
        var tDiv1=document.createElement('div');
        tDiv.appendChild(tDiv1);

        addTorrent(tDiv1, t, dlLinkAdd, innerWidth-6);

        continue;
      }
      if(!t.artist)
        continue;
      var ignoreTags = settings.ignoreTags.split(',');
      var hasIgnoredTag = false;
      for(var k=0; k<ignoreTags.length; k++)
      {
        for(var l=0; l<t.tags.length; l++)
        {
          if(ignoreTags[k].trim().toLowerCase() == t.tags[l].trim().toLowerCase())
          {
            hasIgnoredTag=true;
            break;
          }
        }
        if(hasIgnoredTag)
          break;
      }
      if(hasIgnoredTag)
        continue;

      done.push(t.groupId);
      alCount++;

      var torrentDiv = document.createElement('div');
      torrentDiv.setAttribute('style', 'width: '+innerWidth+'px; border-radius: '+borderRadius+'px; background: rgba(0,0,0,0.5); margin: '+margin+'px; display:inline-block; text-align: center;');
      torrentDiv.setAttribute('id', 'topX_'+t.groupId+'_'+j);
      torrentSection.appendChild(torrentDiv);

      var tDiv = document.createElement('div');
      tDiv.setAttribute('id', 'overlayGroup_'+t.groupId+'_'+j);
      tDiv.setAttribute('class', 'overlayGroup');
      var tDiv1=document.createElement('div');
      tDiv.appendChild(tDiv1);

      addTorrent(tDiv1, t, dlLinkAdd, innerWidth-6);
      /*
      var rect=torrentDiv.getBoundingClientRect();
      var top=rect.top+window.scrollY;
      var left=rect.left+window.scrollX;
      tDiv.setAttribute('style', 'position: absolute; top: '+top+'px; left: '+left+'px; background: rgba(0,0,0,0.8); width: '+innerWidth+'px; height: '+innerWidth+'px; border-radius: '+borderRadius+'px '+borderRadius+'px 0 0;');*/
      torrentDiv.addEventListener('mouseover', mouseOver.bind(undefined, tDiv), false);
      torrentDiv.addEventListener('mouseout', mouseOut.bind(undefined, torrentDiv, tDiv), false);
      tDiv.addEventListener('mouseout', mouseOut.bind(undefined, torrentDiv, tDiv), false);
      document.body.appendChild(tDiv);

      var a=document.createElement('a');
      a.href='/torrents.php?id='+t.groupId+'&torrentid='+t.torrentId;
      torrentDiv.appendChild(a);
      var img=document.createElement('img');
      a.appendChild(img);
      img.src=t.wikiImage;
      img.setAttribute('style', 'width: '+innerWidth+'px; height: '+innerWidth+'px; border-radius: '+borderRadius+'px '+borderRadius+'px 0 0;');

      var meta=document.createElement('div');
      torrentDiv.appendChild(meta);

      var s=document.createElement('span');
      s.setAttribute('style', 'display: inline-block; white-space: nowrap;');
      s.innerHTML=t.artist;
      s.title=s.textContent;
      s.innerHTML = t.artist+'...';
      meta.appendChild(s);
      count=0;
      if(s.clientWidth >= innerWidth)
      {
        while(s.clientWidth >= innerWidth)
        {
          s.innerHTML = s.innerHTML.slice(0, -4)+'...';
          count++;
          if(count > 500)
            break;
        }
      }
      else
      {
        s.innerHTML = s.innerHTML.slice(0, -3);
      }
      meta.appendChild(document.createElement('br'));

      var s=document.createElement('span');
      s.setAttribute('style', 'display: inline-block; white-space: nowrap;');
      s.innerHTML = t.groupName+' ['+t.groupYear+']';
      s.title = s.innerHTML;
      s.innerHTML = t.groupName+'... ['+t.groupYear+']';
      meta.appendChild(s);
      count=0;
      var gName=t.groupName;
      if(s.clientWidth >= innerWidth)
      {
        while(s.clientWidth >= innerWidth)
        {
          gName = gName.slice(0, -1);
          s.innerHTML = '<a href="/torrents.php?id='+t.groupId+'" style="font-weight: bold;">'+gName+'...</a> ['+t.groupYear+']';
          count++;
          if(count > 500)
            break;
        }
      }
      else
      {
        s.innerHTML = '<a href="/torrents.php?id='+t.groupId+'" style="font-weight: bold;">'+t.groupName+'</a> ['+t.groupYear+']';
      }
      meta.appendChild(document.createElement('br'));

      if(t.tags.length > 0)
      {
        var s=document.createElement('span');
        s.setAttribute('style', 'white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: inline-block; max-width: 224px; padding: 0;');
        s.setAttribute('class', 'tags');
        meta.appendChild(s);
        for(var k=0; k<t.tags.length; k++)
        {
          var ta=t.tags[k];
          var a=document.createElement('a');
          a.href='/torrents.php?taglist='+ta;
          a.innerHTML=ta;
          if(k > 0)
            s.appendChild(document.createTextNode(', '));
          s.appendChild(a);
        }
      }
      meta.appendChild(document.createElement('br'));

      /*var s=document.createElement('span');
      s.innerHTML = t.format+' / '+t.encoding+' / '+t.media;
      meta.appendChild(s);
      meta.appendChild(document.createElement('br'));*/

      var s=document.createElement('span');
      meta.appendChild(s);
      /*var a=document.createElement('a');
      a.href='/torrents.php?action=download&id='+t.torrentId+dlLinkAdd;
      a.innerHTML = '[DL]';
      s.appendChild(a);
      s.appendChild(document.createTextNode(' '));*/
      var clonedBookmark=document.getElementById('bookmarklink_torrent_'+t.groupId);
      if(clonedBookmark)
        clonedBookmark=clonedBookmark.cloneNode(true);
      else
      {
        clonedBookmark=document.createElement('a');
        clonedBookmark.href='#';
        clonedBookmark.setAttribute('id', 'bookmarklink_torrent_'+t.groupId);
        clonedBookmark.setAttribute('class', 'bookmarklink_torrent_'+t.groupId+' brackets');
        clonedBookmark.onclick="Bookmark('torrent', "+t.groupId+", 'Remove bookmark'); return false;";
        clonedBookmark.innerHTML = 'Bookmark';
      }
      s.appendChild(clonedBookmark);
    }
  }

  var overlays=document.getElementsByClassName('overlayGroup');
  for(var j=0; j<r.response.length; j++)
  {
    for(var i=0; i<overlays.length; i++)
    {
      var tDiv=overlays[i];
      var id=tDiv.id.split('_')[1];
      j=tDiv.id.split('_')[2];
      var torrentDiv=document.getElementById('topX_'+id+'_'+j);
      var rect=torrentDiv.getBoundingClientRect();
      var top=rect.top+window.scrollY;
      var left=rect.left+window.scrollX;
      tDiv.setAttribute('style', 'position: absolute; top: '+top+'px; left: '+left+'px; background: rgba(0,0,0,0.8); width: '+innerWidth+'px; height: '+innerWidth+'px; border-radius: '+borderRadius+'px '+borderRadius+'px 0 0; text-align: center;');
      tDiv.style.display='none';
    }
  }
}

function mouseOver(div)
{
  div.style.display = 'initial';
}

function mouseOut(div1, div2, event)
{
  if(event.relatedTarget == div1 || isDescendant(div2, event.relatedTarget) || event.relatedTarget == div2)
    return;
  div2.style.display = 'none';
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
  div.innerHTML = '<h2>Top 10 Cover Art View Settings</h2><br />';
  var settings = getSettings();

  var labelStyle = '';

  var label = document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Covers per Row: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 4em;');
  input.placeholder='Covers per row';
  input.type='number';
  input.value = settings.horizontalCoverCount ? settings.horizontalCoverCount:5;
  div.appendChild(input);
  input.addEventListener('change', changeSettings.bind(undefined, div), false);

  div.appendChild(document.createElement('br'));
  var label = document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Top X: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 4em;');
  input.placeholder='Show X albums per category';
  input.type='number';
  input.value = settings.topX ? settings.topX:10;
  div.appendChild(input);
  input.addEventListener('change', changeSettings.bind(undefined, div), false);

  div.appendChild(document.createElement('br'));
  var label = document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Ignore Tags: ';
  div.appendChild(label);
  var input=document.createElement('input');
  input.setAttribute('style', 'width: 20em;');
  input.placeholder='Ignore torrents with these tags';
  input.value = settings.ignoreTags ? settings.ignoreTags:'';
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
  settings.horizontalCoverCount = parseInt(inputs[0].value);
  if(isNaN(settings.horizontalCoverCount))
    settings.horizontalCoverCount = 5;

  settings.topX = parseInt(inputs[1].value);
  if(isNaN(settings.topX))
    settings.topX = 10;

  settings.ignoreTags = inputs[2].value;

  window.localStorage.top10CoverArtViewSettings = JSON.stringify(settings);
  showSettings(message);
}

function getSettings()
{
  var settings = window.localStorage.top10CoverArtViewSettings;
  if(!settings)
  {
    settings = {horizontalCoverCount:5, topX:10, ignoreTags:''};
  }
  else
    settings = JSON.parse(settings);
  if(!settings.ignoreTags)
    settings.ignoreTags='';
  return settings;
}

function toggle(div)
{
  if(div.style.display == 'none')
    div.style.display = 'initial';
  else
    div.style.display = 'none';
}

function xhr_func(messageDiv, xhr, func, repeatFunc)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
      func(xhr.responseText);
    else
    {
      messageDiv.innerHTML = 'Error: '+xhr.status+'<br />retrying in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}

function isDescendant(parent, child)
{
  if(child === null)
    return false;
  var node = child.parentNode;
  while(node !== null)
  {
    if(node == parent)
      return true;
    node = node.parentNode;
  }
  return false;
}
