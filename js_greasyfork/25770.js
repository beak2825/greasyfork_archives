// ==UserScript==
// @name         PTH Collector
// @version      1.8
// @description  Download multiple torrents by some criteria on PTH
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @require      https://greasyfork.org/scripts/19855-jszip/code/jszip.js?version=126859
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25770/PTH%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/25770/PTH%20Collector.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var wH=window.location.href;
  if(wH.indexOf('artist.php?id=') != -1)
  {
    addToX(compileArtist);
  }
  else if(wH.indexOf('threadid=3543') != -1)
    showSettings();
  else if(wH.indexOf('collages.php?id=') != -1)
    addToX(compileCollage);
  else if(wH.indexOf('bookmarks.php?type=torrents') != -1)
    addToX(compileCollage.bind('Bookmarks'));
  //else if(wH.indexOf('torrents.php') != -1 && wH.indexOf('?id=') == -1)
    //addToSearch();
})();

function addToSearch()
{
  var sidebar=document.createElement('div');
  sidebar.setAttribute('class', 'sidebar');
  sidebar.setAttribute('style', 'float: initial; margin: auto;');
  /*var left=(document.body.clientWidth/2)+425;
  sidebar.setAttribute('style', 'position: absolute; left: '+left+'px;');
  var before=document.getElementsByClassName('header')[0].nextElementSibling;
  before.parentNode.insertBefore(sidebar, before);*/
  document.getElementsByClassName('thin')[0].appendChild(sidebar);
  
  addToX(compileCollage.bind('Search'));
}

function showSettings()
{
  var div=document.getElementById('collectorSettings');
  if(!div)
  {
    var before = document.getElementsByClassName('forum_post')[0];
    div = document.createElement('div');
    div.setAttribute('id', 'collectorSettings');
    before.parentNode.insertBefore(div, before);
    div.setAttribute('style', 'width: 100%; text-align: center; padding-bottom: 10px;');
    div.setAttribute('class', 'box');
  }
  div.innerHTML = '<h2>Collector Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Sequential torrent download: '+(settings.sequential ? 'On':'Off');
  a.addEventListener('click', changeLink.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Include summary txt in .zip: '+(settings.summary ? 'On':'Off');
  a.addEventListener('click', changeLink.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));
}

function changeLink(a, div)
{
  if(a.innerHTML.indexOf('On') != -1)
    a.innerHTML = a.innerHTML.replace(/On/, 'Off');
  else
    a.innerHTML = a.innerHTML.replace(/Off/, 'On');

  changeSettings(div);
}

function changeSettings(div)
{
  var settings = getSettings();
  var as=div.getElementsByTagName('a');

  if(as[0].innerHTML.indexOf('On') != -1)
    settings.sequential=true;
  else
    settings.sequential=false;

  if(as[1].innerHTML.indexOf('On') != -1)
    settings.summary=true;
  else
    settings.summary=false;

  setSettings(settings);
  showSettings();
}

function setSettings(settings)
{
  window.localStorage.collectorOperationSettings = JSON.stringify(settings);
}

function getSettings()
{
  var settings = window.localStorage.collectorOperationSettings;
  if(!settings)
  {
    settings = {sequential:false};
  }
  else
  {
    settings = JSON.parse(settings);
  }
  return settings;
}

function addToX(compileFunc)
{
  var style=document.createElement('style');
  style.innerHTML = '.collectorAdded { background-color: #151 !important; } ';
  style.innerHTML+= '.collectorAddedSuboptimal { background-color: #551 !important; } ';
  style.innerHTML+= '.collectorMissing { background: rgba(255, 0, 0, 0.2) !important;} ';
  style.innerHTML+= '.collectorSuboptimal { background: rgba(255, 255, 0, 0.2) !important;}';
  document.head.appendChild(style);

  var settings=getPersistence();

  var sidebar=document.getElementsByClassName('sidebar')[0];
  var box=document.createElement('div');
  box.setAttribute('class', 'box');
  sidebar.appendChild(box);
  //sidebar.insertBefore(box, sidebar.firstElementChild);
  var head=document.createElement('div');
  box.appendChild(head);
  head.setAttribute('class', 'head');
  head.innerHTML = '<strong>Collector</strong>';
  var list=document.createElement('ul');
  box.appendChild(list);
  list.setAttribute('class', 'nobullet');

  var labelStyle='';
  var inputStyle='';

  var li=document.createElement('li');
  list.appendChild(li);
  var label=document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Format [?]: ';
  var options = ["Any", "FLAC", "MP3", "AAC", "AC3", "DTS"];
  li.addEventListener('mouseover', mouseOverLabel.bind(undefined, options), false);
  li.addEventListener('mouseout', mouseOutLabel.bind(undefined, options), false);
  li.appendChild(label);
  var format=document.createElement('input');
  format.setAttribute('style', inputStyle);
  li.appendChild(format);
  format.value = settings.format.join(', ');
  format.placeholder="Format";

  var li=document.createElement('li');
  list.appendChild(li);
  var label=document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Bitrate  [?]: ';
  var options = ["Any", "192", "APS (VBR)", "V2 (VBR)", "V1 (VBR)", "256", "APX", "V0 (VBR)", "320", "Lossless", "24bit Lossless", "Other"];
  li.addEventListener('mouseover', mouseOverLabel.bind(undefined, options), false);
  li.addEventListener('mouseout', mouseOutLabel.bind(undefined, options), false);
  li.appendChild(label);
  var bitrate=document.createElement('input');
  bitrate.setAttribute('style', inputStyle);
  li.appendChild(bitrate);
  bitrate.value = settings.bitrate.join(', ');
  bitrate.placeholder="Bitrate";

  var li=document.createElement('li');
  list.appendChild(li);
  var label=document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Media [?]: ';
  var options = ["Any", "CD", "DVD", "Vinyl", "Soundboard", "SACD", "DAT", "Cassette", "WEB", "Blu-Ray"];
  li.addEventListener('mouseover', mouseOverLabel.bind(undefined, options), false);
  li.addEventListener('mouseout', mouseOutLabel.bind(undefined, options), false);
  li.appendChild(label);
  var media=document.createElement('input');
  media.setAttribute('style', inputStyle);
  li.appendChild(media);
  media.value = settings.media.join(', ');
  media.placeholder="Media";

  var li=document.createElement('li');
  list.appendChild(li);
  var label=document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Type: ';
  li.appendChild(label);
  var type=document.createElement('input');
  type.placeholder = 'Release Type';
  type.value = settings.types.join(', ');
  type.setAttribute('style', inputStyle);
  li.appendChild(type);

  var li=document.createElement('li');
  list.appendChild(li);
  var label=document.createElement('span');
  label.setAttribute('style', labelStyle);
  label.innerHTML = 'Minimum number of seeders: ';
  li.appendChild(label);
  var minSeedCount=document.createElement('input');
  minSeedCount.type='number';
  minSeedCount.value = settings.minSeedCount;
  minSeedCount.setAttribute('style', inputStyle);
  li.appendChild(minSeedCount);

  var messageDiv=document.createElement('div');
  messageDiv.setAttribute('style', 'text-align: center;');

  format.addEventListener('keyup', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  bitrate.addEventListener('keyup', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  media.addEventListener('keyup', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  type.addEventListener('keyup', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  minSeedCount.addEventListener('keyup', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  minSeedCount.addEventListener('change', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);
  minSeedCount.addEventListener('click', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv), false);

  var div=document.createElement('div');
  div.setAttribute('style', 'text-align: center;');
  box.appendChild(div);
  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'Collect';
  a.addEventListener('click', save.bind(undefined, messageDiv), false);

  div.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'Preview';
  a.setAttribute('id', 'collectorPreviewLink');
  a.addEventListener('click', compileFunc.bind(undefined, {format:format, bitrate:bitrate, media:media, type:type, minSeedCount:minSeedCount}, messageDiv, true), false);


  div.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'List';
  a.addEventListener('click', listC.bind(undefined, messageDiv), false);

  var div=document.createElement('div');
  div.setAttribute('style', 'text-align: center; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;');
  box.appendChild(div);
  div.id='collectorList';

  box.appendChild(messageDiv);
}

function listC(messageDiv)
{
  var div=document.getElementById('collectorList');
  div.innerHTML='';

  var torrentList=messageDiv.getAttribute('torrentList');
  if(!torrentList)
    messageDiv.innerHTML = "You need to preview first";
  torrentList=JSON.parse(torrentList);
  for(var i=0; i<torrentList.length; i++)
  {
    var t=torrentList[i];
    var id=parseInt(t.dl.split('id=')[1]);
    var name=t.name.split('.torrent')[0];
    div.innerHTML+='<br /><a href="/torrents.php?torrentid='+id+'" title="'+name+'">'+name+'</a>';
  }
}

function mouseOverLabel(options, event)
{
  var div=document.createElement('div');
  document.body.appendChild(div);
  div.setAttribute('class', 'labelPopups');
  div.setAttribute('style', 'position: fixed; left: '+event.clientX+'px; top: '+event.clientY+'px; border-radius: 10px; padding: 10px; background: rgba(0,0,0,0.8); color: white;');
  for(var i=0; i<options.length; i++)
  {
    div.innerHTML+=options[i]+'<br />';
  }
}

function mouseOutLabel()
{
  var l=document.getElementsByClassName('labelPopups');
  for(var i=0; i<l.length; i++)
  {
    l[i].parentNode.removeChild(l[i]);
  }
}

function compileCollage(filters, messageDiv, hilight)
{
  setPersistence(filters);
  var pers=getPersistence();

  var format = pers.format;
  var bitrate = pers.bitrate;
  var media = pers.media;
  var minSeedCount = pers.minSeedCount;

  var collage=document.getElementsByTagName('h2')[0].textContent;
  if(this == "Bookmarks")
    collage="Bookmarks";

  var title = "Collection Collage - "+collage+".zip";//+" - "+format+"_"+bitrate+"_"+media+".zip";
  messageDiv.setAttribute('zipName', title);

  messageDiv.innerHTML = 'Collecting torrents';
  var torrents=[];

  var missed=[];
  var suboptimal=[];
  var albumCount=0;

  if(hilight)
  {
    var tRows = document.getElementsByClassName('torrent_row');
    for(var i=0; i<tRows.length; i++)
    {
      var t=tRows[i];
      t.setAttribute('class', t.getAttribute('class').replace(' collectorAddedSuboptimal', ''));
      t.setAttribute('class', t.getAttribute('class').replace(' collectorAdded', ''));
      if(t.getAttribute('collectorPreviewing') != "true")
      {
        t.addEventListener('click', addAnywayFunc.bind(undefined, t), false);
        t.setAttribute('collectorPreviewing', "true");
      }
    }
    var groups=document.getElementsByClassName('group');
    for(var i=0; i<groups.length; i++)
    {
      groups[i].setAttribute('class', groups[i].getAttribute('class').replace(' collectorMissing', ''));
      groups[i].setAttribute('class', groups[i].getAttribute('class').replace(' collectorSuboptimal', ''));
    }
  }

  var totalSize=0;

  var groups=document.getElementsByClassName('group');
  for(var i=0; i<groups.length; i++)
  {
    var g=groups[i];
    var album=g.getElementsByTagName('strong');
    if(album.length === 0)
      album=g.getElementsByClassName('group_info')[0].getElementsByTagName('a');
    else
      album = album[0].getElementsByTagName('a');
    var artist=album[0].innerHTML;
    album = album[album.length-1].innerHTML;
    g.setAttribute('artist', artist);
    g.setAttribute('album', album);
  }

  var output=doGroups(groups, torrents, hilight, albumCount, suboptimal, missed);

  torrents=output.torrents;
  totalSize+=output.totalSize;
  albumCount=output.albumCount;
  suboptimal=output.suboptimal;
  missed=output.missed;


  messageDiv.innerHTML = '';

  var summaryText=(title.replace(/.zip$/, ''))+"\n\nDate: "+Date()+"\n\nTorrent groups analyzed: "+albumCount;
  if(missed.length > 0)
    summaryText+="\nTorrent groups filtered: "+missed.length+"\nTorrents downloaded: "+(albumCount-missed.length);
  if(suboptimal.length > 0)
    summaryText+="\nSuboptimal torrents: "+suboptimal.length;
  summaryText+="\n\nFormat filter: "+format.join(', ')+'\nBitrate filter: '+bitrate.join(', ')+'\nMedia filter: '+media.join(', ');
  summaryText+="\n\nTotal size of torrents (ratio hit): "+prettySize(totalSize);
  if(missed.length > 0)
  {
    summaryText+="\n\nAlbums unavailable within your criteria (consider making a request for your desired format):";
    for(var i=0; i<missed.length; i++)
    {
      var m=missed[i];
      summaryText+="\n/torrents.php?id="+m.groupid+" - "+m.artist+" - "+m.album;
    }
  }
  if(suboptimal.length > 0)
  {
    summaryText+="\n\nAlbums suboptimal within your criteria (consider making a request for your optimal format):";
    for(var i=0; i<suboptimal.length; i++)
    {
      var m=suboptimal[i];
      summaryText+="\n/torrents.php?id="+m.groupid+" - "+m.artist+" - "+m.album;
    }
  }

  messageDiv.setAttribute('summaryText', summaryText);

  if(missed.length > 0)
  {
    messageDiv.innerHTML = "Missing "+missed.length+" of "+albumCount+" groups";
  }
  else
  {
    messageDiv.innerHTML = 'Added torrents from all '+albumCount+' groups';
  }
  if(suboptimal.length > 0)
  {
    messageDiv.innerHTML+= '<br />'+suboptimal.length+' of '+(albumCount-missed.length)+' selected are suboptimal';
  }
  messageDiv.innerHTML+="<br />Total size: "+prettySize(totalSize);
  messageDiv.setAttribute('torrentList', JSON.stringify(torrents));
}

function getPersistence()
{
  var settings = window.localStorage.collectorSettings;
  if(!settings)
  {
    settings = {format: [], bitrate: [], media: [], types: [], minSeedCount: 0};
  }
  else
  {
    settings = JSON.parse(settings);
  }
  if(typeof(settings.format) != "object")
    settings = {format: [], bitrate: [], media: [], types: [], minSeedCount: 0};
  return settings;
}

function setPersistence(filters)
{
  var settings = {
    format: filters.format.value.split(', '),
    bitrate: filters.bitrate.value.split(', '),
    media: filters.media.value.split(', '),
    types: filters.type.value.split(', '),
    minSeedCount: parseInt(filters.minSeedCount.value),
  };
  if(isNaN(settings.minSeedCount))
    settings.minSeedCount=0;
  window.localStorage.collectorSettings = JSON.stringify(settings);
}

function compileArtist(filters, messageDiv, hilight)
{
  setPersistence(filters);
  var pers=getPersistence();

  var format = pers.format;
  var bitrate = pers.bitrate;
  var media = pers.media;
  var types = pers.types;

  var artist=document.getElementsByTagName('h2')[0].textContent;
  var title = "Collection Artist - "+artist+".zip";//+" - "+format+"_"+bitrate+"_"+media+".zip";
  messageDiv.setAttribute('zipName', title);

  messageDiv.innerHTML = 'Collecting torrents';
  var torrents=[];

  var missed=[];
  var suboptimal=[];
  var albumCount=0;

  if(hilight)
  {
    var tRows = document.getElementsByClassName('torrent_row');
    for(var i=0; i<tRows.length; i++)
    {
      var t=tRows[i];
      t.setAttribute('class', t.getAttribute('class').replace(' collectorAddedSuboptimal', ''));
      t.setAttribute('class', t.getAttribute('class').replace(' collectorAdded', ''));
      if(t.getAttribute('collectorPreviewing') != "true")
      {
        t.addEventListener('click', addAnywayFunc.bind(undefined, t), false);
        t.setAttribute('collectorPreviewing', "true");
      }
    }
    var groups=document.getElementsByClassName('group');
    for(var i=0; i<groups.length; i++)
    {
      groups[i].setAttribute('class', groups[i].getAttribute('class').replace(' collectorMissing', ''));
      groups[i].setAttribute('class', groups[i].getAttribute('class').replace(' collectorSuboptimal', ''));
    }
  }
  
  for(var i=0; i<groups.length; i++)
  {
    var g=groups[i];
    var album=g.getElementsByClassName('group_info')[0].getElementsByTagName('strong')[0].getElementsByTagName('a');
    album = album[album.length-1].innerHTML;
    g.setAttribute('artist', artist);
    g.setAttribute('album', album);
  }

  var totalSize=0;

  var tables = document.getElementsByClassName('release_table');
  for(var i=0; i<tables.length; i++)
  {
    var t=tables[i];
    var releaseType=t.getElementsByTagName('tr')[0].getElementsByTagName('strong')[0].innerHTML;

    var inTypes=false;
    for(var m=0; m<types.length; m++)
    {
      if(types[m] == releaseType)
      {
        inTypes=true;
        break;
      }
    }
    if(!inTypes && !(types[0] == '' && types.length == 1))
      continue;

    var groups=t.getElementsByClassName('group');

    var output=doGroups(groups, torrents, hilight, albumCount, suboptimal, missed);

    torrents=output.torrents;
    totalSize+=output.totalSize;
    albumCount=output.albumCount;
    suboptimal=output.suboptimal;
    missed=output.missed;
  }

  messageDiv.innerHTML = '';

  var summaryText=(title.replace(/.zip$/, ''))+"\n\nDate: "+Date()+"\n\nTorrent groups analyzed: "+albumCount;
  if(missed.length > 0)
    summaryText+="\nTorrent groups filtered: "+missed.length+"\nTorrents downloaded: "+(albumCount-missed.length);
  if(suboptimal.length > 0)
    summaryText+="\nSuboptimal torrents: "+suboptimal.length;
  summaryText+="\n\nFormat filter: "+format.join(', ')+'\nBitrate filter: '+bitrate.join(', ')+'\nMedia filter: '+media.join(', ')+'\nRelease type filter: '+types.join(', ');
  summaryText+="\n\nTotal size of torrents (ratio hit): "+prettySize(totalSize);
  if(missed.length > 0)
  {
    summaryText+="\n\nAlbums unavailable within your criteria (consider making a request for your desired format):";
    for(var i=0; i<missed.length; i++)
    {
      var m=missed[i];
      summaryText+="\n/torrents.php?id="+m.groupid+" - "+m.artist+" - "+m.album;
    }
  }
  if(suboptimal.length > 0)
  {
    summaryText+="\n\nAlbums suboptimal within your criteria (consider making a request for your optimal format):";
    for(var i=0; i<suboptimal.length; i++)
    {
      var m=suboptimal[i];
      summaryText+="\n/torrents.php?id="+m.groupid+" - "+m.artist+" - "+m.album;
    }
  }

  messageDiv.setAttribute('summaryText', summaryText);

  if(missed.length > 0)
  {
    messageDiv.innerHTML = "Missing "+missed.length+" of "+albumCount+" groups";
  }
  else
  {
    messageDiv.innerHTML = 'Added torrents from all '+albumCount+' groups';
  }
  if(suboptimal.length > 0)
  {
    messageDiv.innerHTML+= '<br />'+suboptimal.length+' of '+(albumCount-missed.length)+' selected are suboptimal';
  }
  messageDiv.innerHTML+="<br />Total size: "+prettySize(totalSize);
  messageDiv.setAttribute('torrentList', JSON.stringify(torrents));
}

function doGroups(groups, torrents, hilight, albumCount, suboptimal, missed)
{
  var searchPage=false;
  if(window.location.href.indexOf('torrents.php') != -1 && window.location.href.indexOf('?id=') == -1)
    searchPage=true;
  var totalSize=0;
  for(var j=0; j<groups.length; j++)
  {
    var g=groups[j];
    var groupId=g.getElementsByTagName('div')[0].getAttribute('id').split('_')[1];
    var artist=g.getAttribute('artist');
    var album=g.getAttribute('album');
    var editions=document.getElementsByClassName('groupid_'+groupId+' edition');
    var added=0;
    var allEditions=[];
    for(var k=0; k<editions.length; k++)
    {
      var editionMeta=editions[k].textContent.split(' / ');
      var editionMedia = editionMeta[editionMeta.length-1].trim();

      var torrentRows = document.getElementsByClassName('torrent_row groupid_'+groupId+' edition_'+(k+1));
      if(searchPage)
      {
        torrentRows = document.getElementsByClassName('groupid_'+groupId+' edition_'+(k+1));
      }
      for(var l=0; l<torrentRows.length; l++)
      {
        var e=torrentRows[l];
        e.setAttribute('media', editionMedia);
        allEditions.push(e);
      }
    }
    var best=getBest(allEditions);
    var addIndexes=[];
    var score=best.score;
    for(var k=0; k<allEditions.length; k++)
    {
      var e=allEditions[k];
      var addAnyway = e.getAttribute('addAnyway');
      if(addAnyway == "true")
      {
        var score1=getBest([e]).score;
        addIndexes.push({index:k, score:score1});
        if(score1 < score)
          score=score1;
      }
      if(addIndexes.length === 0 && best.index != -1 && allEditions[best.index].getAttribute('addAnyway') != "false")
        addIndexes.push(best);
    }
    var secondCount=0;
    for(var l=0; l<addIndexes.length; l++)
    {
      var e=allEditions[addIndexes[l].index];

      var as=e.getElementsByTagName('a');
      var dl=as[0].href;
      var linkCount=1;
      while(dl.indexOf('authkey') == -1)
      {
        dl=as[linkCount].href;
        linkCount++;
      }
      var meta=as[as.length-1].innerHTML.split(' / ');
      var tdIndex=1;
      if(searchPage)
        tdIndex=3;
      var size=unPretty(e.getElementsByTagName('td')[tdIndex].textContent);
      var editionMedia=e.getAttribute('media');
      totalSize+=size;

      var addAnyway = e.getAttribute('addAnyway');
      if(addAnyway == "false")
        continue;

      var torrentId=as[as.length-1].href.split('&torrentid=')[1];
      var torrentName=artist+' - '+album+' - '+meta[0]+"_"+meta[1]+"_"+editionMedia+" - "+torrentId+".torrent";

      torrents.push({dl:dl, name:torrentName});
      if(hilight)
      {
        if(score === 0)
          e.setAttribute('class', e.getAttribute('class')+' collectorAdded');
        else if(addIndexes.length > 0)
          e.setAttribute('class', e.getAttribute('class')+' collectorAddedSuboptimal');
      }
      secondCount++;
    }
    if(score === 0)
      added=1;
    else if(addIndexes.length > 0)
      added=2;
    if(secondCount === 0)
      added=0;
    albumCount++;
    if(added === 0)
    {
      if(hilight)
        g.setAttribute('class', g.getAttribute('class')+' collectorMissing');
      missed.push({groupid:groupId, artist:artist, album:album});
    }
    else if(added == 2)
    {
      if(hilight)
        g.setAttribute('class', g.getAttribute('class')+' collectorSuboptimal');
      suboptimal.push({groupid:groupId, artist:artist, album:album});
    }
  }

  return {totalSize:totalSize, torrents:torrents, albumCount:albumCount, suboptimal:suboptimal, missed:missed};
}

function unPretty(size)
{
  var s=parseFloat(size);
  if(size.indexOf('KB') != -1)
    s = s*Math.pow(2, 10);
  else if(size.indexOf('MB') != -1)
    s = s*Math.pow(2, 20);
  else if(size.indexOf('GB') != -1)
    s = s*Math.pow(2, 30);
  else if(size.indexOf('TB') != -1)
    s = s*Math.pow(2, 40);
  else if(size.indexOf('PB') != -1)
    s = s*Math.pow(2, 50);

  return Math.round(s);
}

function prettySize(size)
{
  var newSize=size;
  var i=0;
  while(newSize > 1)
  {
    i++;
    newSize = size/Math.pow(2, i*10);
  }
  i--;
  if(i<0)
    i=0;
  newSize=size/Math.pow(2, (i)*10);

  var suffixes=["B", "KB", "MB", "GB", "TB", "PB"];

  newSize = Math.round(newSize*100)/100;
  newSize = newSize+' '+suffixes[i];
  return newSize;
}

function getBest(rows)
{
  var pers=getPersistence();

  var best={index:-1, score:100000};

  for(var i=0; i<rows.length; i++)
  {
    var e=rows[i];
    var editionMedia=e.getAttribute('media');
    if(e.getAttribute('addAnyway') == "false")
      continue;

    var seedCount=parseInt(e.getElementsByTagName('td')[3].textContent);
    if(seedCount < pers.minSeedCount)
      continue;

    var meta=e.getElementsByTagName('a');
    meta=meta[meta.length-1].innerHTML.split(' / ');

    if(meta[0] == pers.format[0] && meta[1] == pers.bitrate[0] && editionMedia == pers.media[0])
    {
      best.index=i;
      best.score=0;
      break;
    }

    if(pers.format.length === 0)
      pers.format.push("Any");
    if(pers.bitrate.length === 0)
      pers.format.push("Any");
    if(pers.media.length === 0)
      pers.format.push("Any");


    for(var j=0; j<pers.format.length; j++)
    {
      var f=pers.format[j];
      if(f==='')
        f='Any';
      if(f=="Any" || meta[0]==f)
      {
        for(var k=0; k<pers.bitrate.length; k++)
        {
          var b=pers.bitrate[k];
          if(b==='')
            b='Any';
          if(b=="Any" || meta[1]==b)
          {
            for(var l=0; l<pers.media.length; l++)
            {
              var m=pers.media[l];
              if(m==='')
                m='Any';
              if(m=="Any" || editionMedia==m)
              {
                var score = (j*100)+(k*10)+l;
                if(score < best.score)
                {
                  best.index=i;
                  best.score=score;
                }
              }
            }
          }
        }
      }
    }
  }
  return best;
}

function addAnywayFunc(tr, event)
{
  if(!event.ctrlKey && !event.metaKey)
    return;

  event.preventDefault();

  var addAnyway = tr.getAttribute("addAnyway");
  var adding = tr.getAttribute('class').indexOf('collectorAdded') != -1;
  if(adding)
  {
    tr.setAttribute("addAnyway", false);
    document.getElementById('collectorPreviewLink').click();
    return;
  }
  else
  {
    tr.setAttribute("addAnyway", true);
    document.getElementById('collectorPreviewLink').click();
    return;
  }
}

function save(messageDiv)
{
  var torrentList=messageDiv.getAttribute('torrentList');
  if(!torrentList)
    messageDiv.innerHTML = "You need to preview first";
  torrentList=JSON.parse(torrentList);
  var opSettings = getSettings();
  if(opSettings.sequential)
  {
    messageDiv.setAttribute('stopSequential', "false");
    sequentialGet(torrentList, 0, messageDiv);
  }
  else
  {
    var zip=new JSZip();

    var settings=getSettings();
    if(settings.summary)
    {
      var name=messageDiv.getAttribute('zipName').replace(/zip$/, "txt");
      var text=messageDiv.getAttribute('summaryText');
      zip.file(name.replace(/\//g, '_'), text);
    }

    getTorrent(torrentList, 0, zip, messageDiv);
  }
}

function sequentialGet(list, index, messageDiv)
{
  if(messageDiv.getAttribute('stopSequential') == "true")
  {
    messageDiv.innerHTML = 'Stopped';
    return;
  }
  if(index >= list.length)
  {
    messageDiv.innerHTML = 'Finished';
    return;
  }

  messageDiv.innerHTML = "Downloading torrent "+(index+1)+" of "+list.length+"<br />";
  var a=document.createElement('a');
  messageDiv.appendChild(a);
  a.innerHTML='Stop';
  a.href='javascript:void(0);';
  a.addEventListener('click', stopSequential.bind(undefined, messageDiv), false);

  var a=document.createElement('a');
  a.href=list[index].dl;
  a.download=list[index].name;
  document.body.appendChild(a);
  a.click();

  window.setTimeout(sequentialGet.bind(undefined, list, index+1, messageDiv), 1000);
}

function stopSequential(messageDiv)
{
  messageDiv.setAttribute('stopSequential', "true");
}

function getTorrent(list, index, zip, messageDiv)
{
  if(index >= list.length)
  {
    gotTorrents(zip, messageDiv);
    return;
  }
  messageDiv.innerHTML = "Getting torrent "+(index+1)+" of "+list.length+"<br />"+list[index].name;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', list[index].dl);
  xhr.responseType = "arraybuffer";
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, gotTorrent.bind(undefined, list, index, zip, messageDiv), getTorrent.bind(undefined, list, index, zip, messageDiv), true);
  xhr.send();
}

function gotTorrent(list, index, zip, messageDiv, response)
{
  zip.file(list[index].name.replace(/\//g, '_'), response);
  window.setTimeout(getTorrent.bind(undefined, list, index+1, zip, messageDiv), 1000);
}

function gotTorrents(zip, messageDiv)
{
  messageDiv.innerHTML = 'Generating zip file of torrents';
  zip.generateAsync({type:"blob"}).then(saveLink.bind(undefined, messageDiv));
}

function saveLink(messageDiv, blob)
{
  messageDiv.innerHTML = '';
  var a=document.createElement('a');
  messageDiv.appendChild(a);
  var name=messageDiv.getAttribute('zipName');
  a.innerHTML = name;
  a.href = URL.createObjectURL(blob);
  a.download = name;
}

function xhr_func(messageDiv, xhr, func, repeatFunc, binary)
{
  if(xhr.readyState == 4)
  {
    if(xhr.status == 200)
    {
      if(binary)
      {
        var byteArray = new Uint8Array(xhr.response);
        func(byteArray);
      }
      else
      {
        func(xhr.responseText);
      }
    }
    else
    {
      messageDiv.innerHTML = 'Error: '+xhr.status+'<br />retrying in 1 second';
      window.setTimeout(repeatFunc, 1000);
    }
  }
}
