// ==UserScript==
// @name         PTH Torrent quickview
// @version      0.6
// @description  Add a hover that shows the album art and files for a torrent from the artist page
// @author       Chameleon
// @include      http*://redacted.ch/artist.php?id=*
// @include      http*://redacted.ch/torrents.php?id=*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25763/PTH%20Torrent%20quickview.user.js
// @updateURL https://update.greasyfork.org/scripts/25763/PTH%20Torrent%20quickview.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var torrents = document.getElementsByClassName('torrent_row');
  for(var i=0; i<torrents.length; i++)
  {
    var t=torrents[i];
    var torrentLink=t.getElementsByTagName('a');
    torrentLink=torrentLink[torrentLink.length-1];
    var groupid=parseInt(torrentLink.href.split('id=')[1].split('&')[0]);
    var torrentid=torrentLink.href.split('torrentid=');
    if(torrentid.length > 1)
      torrentid = torrentid[1];
    else
      torrentid=torrentLink.outerHTML.split("#torrent_")[1].split("'")[0];

    t.addEventListener('mouseover', mouseOver.bind(undefined, t, torrentid, groupid), false);
    t.addEventListener('mouseout', mouseOut.bind(undefined, t, torrentid), false);
  }
})();

function mouseOver(tr, torrentid, groupid, event)
{
  if(event.shiftKey)
    return;
  var div=document.getElementById('quickview_'+torrentid);
  if(!div)
  {
    div=document.createElement('div');
    document.body.appendChild(div);
    div.setAttribute('id', 'quickview_'+torrentid);
    var rect=tr.getBoundingClientRect();
    var top=rect.top+window.scrollY-50;
    var width=500;
    var leftOffset=50;
    var left=rect.left+window.scrollX-width+leftOffset-20;
    if(left < leftOffset)
      left=leftOffset;
    div.setAttribute('style', 'position: absolute; top: '+top+'px; left: '+left+'px; width: '+(width-leftOffset)+'px; background: black; color: white; border-radius: 10px; padding: 10px; z-index: 1000;');
    div.innerHTML = 'Loading data';
    div.addEventListener('mouseout', mouseOut.bind(undefined, tr, torrentid), false);
  }

  var dataDiv=document.getElementById('quickviewData_'+groupid);
  if(!dataDiv)
  {
    loadData(groupid, torrentid, div);
    return;
  }

  showData(dataDiv);
}

function loadData(groupid, torrentid, messageDiv)
{
  var dataDiv = document.getElementById('quickviewData_'+groupid);
  if(!dataDiv)
  {
    dataDiv = document.createElement('div');
    dataDiv.setAttribute('id', 'quickviewData_'+groupid);
    dataDiv.setAttribute('style', 'display: none;');
    document.body.appendChild(dataDiv);
    dataDiv.setAttribute('loading', 'true');
  }

  if(window.location.href.indexOf('torrents.php') == -1)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/torrents.php?id='+groupid);
    xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, gotGroup.bind(undefined, groupid, torrentid, dataDiv), loadData.bind(undefined, groupid, torrentid, messageDiv));
    xhr.send();
  }
  else
  {
    gotGroup(groupid, torrentid, dataDiv, document.body.innerHTML);
  }
}

function gotGroup(groupid, torrentid, dataDiv, response)
{
  var div=document.implementation.createHTMLDocument();
  div.body.innerHTML = response;
  var result={};

  var h2=div.getElementsByTagName('h2')[0];
  result.artist = h2.getElementsByTagName('a')[0].innerHTML;
  result.album = h2.getElementsByTagName('span')[0].innerHTML;
  result.year = parseInt(h2.textContent.split('[')[1]);
  var art = div.getElementById('cover_div_0');
  if(art)
    result.albumArt = art.getElementsByTagName('img')[0].src;
  result.torrents = [];
  var details = div.getElementsByClassName('torrentdetails');
  for(var i=0; i<details.length; i++)
  {
    var d=details[i];
    var torrent = {};
    torrent.id = d.getAttribute('id').split('_')[1];
    torrent.files = [];
    var file_trs = div.getElementById('files_'+torrent.id).getElementsByTagName('tr');
    for(var j=1; j<file_trs.length; j++)
    {
      var f=file_trs[j].getElementsByTagName('td');
      var file={name:f[0].innerHTML, size:f[1].innerHTML};
      torrent.files.push(file);
    }
    result.torrents.push(torrent);
  }

  dataDiv.setAttribute('data', JSON.stringify(result));
  dataDiv.setAttribute('loading', 'false');

  showData(dataDiv);
}

function showData(dataDiv)
{
  if(dataDiv.getAttribute('loading') == 'true')
    return;
  var data=JSON.parse(dataDiv.getAttribute('data'));
  for(var i=0; i<data.torrents.length; i++)
  {
    var t=data.torrents[i];
    var div = document.getElementById('quickview_'+t.id);
    if(!div)
      continue;
    showAlbum(data, t, div);
  }
}

function showAlbum(data, t, div)
{
  div.innerHTML = '';
  var header = document.createElement('div');
  div.appendChild(header);
  header.setAttribute('style', 'height: 200px;');
  if(data.albumArt)
  {
    var img=document.createElement('img');
    img.src=data.albumArt;
    header.appendChild(img);
    img.setAttribute('style', 'width: 180px;');
  }
  var meta = document.createElement('div');
  header.appendChild(meta);
  meta.setAttribute('style', 'width: 250px; height: 200px; float: right; text-align: left;');
  meta.innerHTML = '<span style="font-size:1.2em; font-style:bold;">'+data.album+'</span><br />'+data.artist+'<br />'+data.year;

  var torrents = document.createElement('div');
  div.appendChild(torrents);
  for(var i=0; i<t.files.length; i++)
  {
    var f=t.files[i];
    var d=document.createElement('div');
    torrents.appendChild(d);
    var span = document.createElement('span');
    span.setAttribute('style', 'display: inline-block; text-align: left; white-space: nowrap;');
    d.appendChild(span);
    span.innerHTML = f.name;
    span.title=span.textContent;
    span.innerHTML = f.name+'...';
    var count=0;
    if(span.clientWidth >= 350)
    {
      while(span.clientWidth >= 350)
      {
        span.innerHTML = span.innerHTML.slice(0, -4)+'...';
        count++;
        if(count > 100)
          break;
      }
    }
    else
    {
      span.innerHTML = span.innerHTML.slice(0, -3);
    }

    var span = document.createElement('span');
    d.appendChild(span);
    span.innerHTML = f.size;
    span.setAttribute('style', 'float: right;');
  }
}

function mouseOut(tr, torrentid, event)
{
  var div=document.getElementById('quickview_'+torrentid);
  if(event.relatedTarget == tr || isDescendant(div, event.relatedTarget) || event.relatedTarget == div)
    return;

  document.body.removeChild(div);
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
  var node = child.parentNode;
  while(node != null)
  {
    if(node == parent)
      return true;
    node = node.parentNode;
  }
  return false;
}
