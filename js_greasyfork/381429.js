// ==UserScript==
// @name         OPS Preview Tracks
// @version      1.2
// @description  Embed youtube clips for the tracks of a torrent group
// @author       Chameleon
// @include      http*://orpheus.network/torrents.php?*id=*
// @include      http*://orpheus.network/index.php
// @include      http*://orpheus.network/*threadid=1236*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/381429/OPS%20Preview%20Tracks.user.js
// @updateURL https://update.greasyfork.org/scripts/381429/OPS%20Preview%20Tracks.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if(!document.hidden)
    run();
  else
    document.addEventListener('visibilitychange', visibilityChanged);
}());

var scriptLoaded=false;

function visibilityChanged()
{
  if(!document.hidden && !scriptLoaded)
  {
    run();
    scriptLoaded=true;
  }
}

function run()
{
  console.log(document.hidden);
  var settings=getSettings();

  if(settings.useYoutubeAPI)
  {
    // include youtube's elephant of an API
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    // stop including
  }

  var wH=window.location.href;
  if(wH.indexOf('index.php') != -1 && settings.useYoutubeAPI && settings.masterPlayer)
  {
    loadPlayer();
  }
  else if(wH.indexOf('torrents.php') != -1)
    loadTorrent();
  else if(wH.indexOf('threadid=1236') != -1)
    showSettings();
}

function showSettings()
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
  div.innerHTML = '<h2>Preview Tracks Settings</h2><br />';
  var settings = getSettings();

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Master player on /index.php: '+(settings.masterPlayer ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Youtube API: '+(settings.useYoutubeAPI ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = 'Minimize Track Preview: '+(settings.hideTrackPreview ? 'On':'Off');
  a.addEventListener('click', changeSettings.bind(undefined, a, div), false);
  div.appendChild(a);
  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  input.placeholder = 'Youtube quality';
  input.value=settings.quality ? settings.quality:'';
  input.addEventListener('change', changeSettings.bind(undefined, undefined, div), false);
  div.appendChild(input);
  div.appendChild(document.createElement('br'));

  var input=document.createElement('input');
  input.placeholder = 'Youtube volume';
  input.type='number';
  input.value=settings.volume ? settings.volume:'';
  input.addEventListener('change', changeSettings.bind(undefined, undefined, div), false);
  div.appendChild(input);
  div.appendChild(document.createElement('br'));

  var a=document.createElement('a');
  div.appendChild(a);
  a.href='javascript:void(0);';
  a.innerHTML = 'Save';
}

function changeSettings(a, div)
{
  var settings=getSettings();
  var as=div.getElementsByTagName('a');

  if(a == as[0])
  {
    if(as[0].innerHTML.indexOf('Off') != -1) 
    {
      settings.masterPlayer = true;
    }
    else
      settings.masterPlayer = false;
  }

  if(a == as[1])
  {
    if(as[1].innerHTML.indexOf('Off') != -1) 
    {
      settings.useYoutubeAPI = true;
    }
    else
      settings.useYoutubeAPI = false;
  }

  if(a == as[2])
  {
    if(as[2].innerHTML.indexOf('Off') != -1) 
    {
      settings.hideTrackPreview = true;
    }
    else
      settings.hideTrackPreview = false;
  }

  var inputs=div.getElementsByTagName('input');
  settings.quality=inputs[0].value;
  settings.volume=inputs[1].value;

  window.localStorage.previewTracksSettings = JSON.stringify(settings);
  showSettings();
}

function getSettings()
{
  var settings = window.localStorage.previewTracksSettings;
  if(!settings)
  {
    settings = {masterPlayer:false, useYoutubeAPI:true};
  }
  else
    settings = JSON.parse(settings);
  if(settings.useYoutubeAPI !== false)
    settings.useYoutubeAPI=true;
  return settings;
}

function waitForYT(messageDiv)
{
  messageDiv.innerHTML = 'Waiting on Youtube API to load';
  window.setTimeout(loadPlayer.bind(undefined, messageDiv), 1000);
}

function loadPlayer(messageDiv)
{
  var div=document.getElementById('youtubePlayerDiv');
  var thin=document.getElementsByClassName('thin')[0];
  if(!div)
  {
    div=document.createElement('div');
    div.setAttribute('id', 'youtubePlayerDiv');
    div.setAttribute('style', 'background: rgba(0,0,200,0.5); text-align: center; border-radius: 20px; padding-bottom: 10px;');
    thin.insertBefore(div, thin.firstElementChild);

    var messageDiv=document.createElement('div');
    div.appendChild(messageDiv);
  }

  if(typeof(YT) == "undefined")
  {
    waitForYT(messageDiv);
    return;
  }
  messageDiv.innerHTML = '';

  var header=document.createElement('div');
  div.appendChild(header);

  var youtubeDiv=document.createElement('div');
  youtubeDiv.setAttribute('id', 'playlistPlayer');
  div.appendChild(youtubeDiv);

  var playlist=getPlaylist();
  var youtube;
  if(playlist.length === 0)
  {
    messageDiv.innerHTML = 'no videos to play ';
    var a=document.createElement('a');
    messageDiv.appendChild(a);
    a.innerHTML = 'Reload playlist';
    a.href='javascript:void(0);';
    a.addEventListener('click', loadPlayer.bind(undefined, messageDiv), false);
    return;
  }
  else if(!playlist[0].track)
  {
    messageDiv.innerHTML = 'Old playlist, ';
    var a=document.createElement('a');
    messageDiv.appendChild(a);
    a.innerHTML = 'clear it and rebuild';
    a.href='javascript:void(0);';
    a.addEventListener('click', clearAndLoadPlayer.bind(undefined, messageDiv), false);
    return;
  }
  else
  {

    /*var width = thin.clientWidth-20;
    var height = Math.round(width/(16/9));
    youtube=new YT.Player('playlistPlayer', {
      height: height,
      width: width,
      events: {'onReady': playerReady, 'onStateChange': playerStateChanged.bind(undefined, messageDiv)}});*/

    playPlaylistVideo(messageDiv, youtube);
  }

  var a=document.createElement('a');
  a.innerHTML = 'Go to start of playlist';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', playlistResetIndex.bind(undefined, messageDiv, youtube), false);

  header.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  a.innerHTML = 'Clear playlist';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', playlistReset.bind(undefined, messageDiv, youtube), false);

  header.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  a.innerHTML = 'Play';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', playPlaylistVideo.bind(undefined, messageDiv, youtube), false);

  header.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  a.innerHTML = 'Next';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', playNextPlaylistVideo.bind(undefined, messageDiv, youtube), false);

  header.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  a.innerHTML = 'Previous';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', playPrevPlaylistVideo.bind(undefined, messageDiv, youtube), false);

  header.appendChild(document.createTextNode(' | '));
  var a=document.createElement('a');
  a.innerHTML = 'Show playlist';
  a.href='javascript:void(0);';
  header.appendChild(a);
  a.addEventListener('click', showPlaylist.bind(undefined, messageDiv), false);
}

function showPlaylist(messageDiv, onlyifopen)
{
  var div=document.getElementById('playlistDiv');
  if(!div && onlyifopen=="yes")
  {
    div=document.createElement('div');
    div.setAttribute('id', 'playlistDiv');
    div.setAttribute('style', 'margin: 10px; background: rgba(0,0,0,0.6); padding: 10px; border-radius: 10px;');
    var thin=document.getElementsByClassName('thin')[0];
    thin.insertBefore(div, thin.firstElementChild.nextElementSibling);
  }
  div.innerHTML = '';
  var headers=["", "", "Track", "Artist", "Album"];
  var baseHeaderStyle="display: inline-block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
  var headersStyle=["width: 80px;", "width: 30px;", "width: 300px;", "width: 200px; text-align: center;", "width:200px; text-align: center;"];
  var hStyle="text-align: center;";
  var header=document.createElement('div');
  div.appendChild(header);
  for(var i=0; i<headers.length; i++)
  {
    var span=document.createElement('span');
    header.appendChild(span);
    span.innerHTML=headers[i];
    span.setAttribute('style', baseHeaderStyle+headersStyle[i]+hStyle);
  }
  var playlist=getPlaylist();
  var playlistIndex=getPlaylistIndex();
  for(var i=0; i<playlist.length; i++)
  {
    var p=playlist[i];

    var pDiv=document.createElement('div');
    pDiv.setAttribute('playlistItem', JSON.stringify(p));
    if(i===parseInt(playlistIndex))
    {
      pDiv.setAttribute('style', 'background: rgba(0,128,128,0.5);');
    }
    div.appendChild(pDiv);

    var span=document.createElement('span');
    span.setAttribute('style', baseHeaderStyle+headersStyle[0]);
    pDiv.appendChild(span);
    //span.innerHTML = "Up / Down";
    var a=document.createElement('a');
    span.appendChild(a);
    a.innerHTML = '-';
    a.href='javascript:void(0);';
    a.addEventListener('click', removePlaylist.bind(undefined, messageDiv, i), false);
    span.appendChild(document.createTextNode(' / '));
    var a=document.createElement('a');
    span.appendChild(a);
    a.innerHTML = 'Up';
    a.href='javascript:void(0);';
    a.addEventListener('click', movePlaylistUp.bind(undefined, messageDiv, i), false);
    span.appendChild(document.createTextNode(' / '));
    var a=document.createElement('a');
    span.appendChild(a);
    a.innerHTML = 'Down';
    a.href='javascript:void(0);';
    a.addEventListener('click', movePlaylistDown.bind(undefined, messageDiv, i), false);

    var span=document.createElement('span');
    span.setAttribute('style', baseHeaderStyle+headersStyle[1]);
    pDiv.appendChild(span);
    span.innerHTML = i+1;

    var span=document.createElement('a');
    span.setAttribute('style', baseHeaderStyle+headersStyle[2]);
    pDiv.appendChild(span);
    span.innerHTML = p.track;
    span.href='javascript:void(0);';
    span.addEventListener('click', playIndex.bind(undefined, messageDiv, i), false);

    var span=document.createElement('span');
    span.setAttribute('style', baseHeaderStyle+headersStyle[3]);
    pDiv.appendChild(span);
    span.innerHTML = p.artist === '' ? '<Unknown>':p.artist;

    var span=document.createElement('span');
    span.setAttribute('style', baseHeaderStyle+headersStyle[4]);
    pDiv.appendChild(span);
    span.innerHTML = p.album;
  }
}

function removePlaylist(messageDiv, index)
{
  var playlist=getPlaylist();
  playlist.splice(index, 1);
  savePlaylist(playlist);
  showPlaylist(messageDiv);
}

function movePlaylistUp(messageDiv, index)
{
  if(index === 0)
    return;

  var playlist=getPlaylist();
  playlist.splice(index-1, 0, playlist.splice(index, 1)[0]);
  if(index === parseInt(getPlaylistIndex()))
    setPlaylistIndex(index-1);
  savePlaylist(playlist);
  showPlaylist(messageDiv);
}

function movePlaylistDown(messageDiv, index)
{
  var playlist=getPlaylist();
  if(index > playlist.length-2)
    return;

  playlist.splice(index+1, 0, playlist.splice(index, 1)[0]);
  if(index === parseInt(getPlaylistIndex()))
    setPlaylistIndex(index+1);
  savePlaylist(playlist);
  showPlaylist(messageDiv); 
}

function playIndex(messageDiv, index)
{
  setPlaylistIndex(index);
  playPlaylistVideo(messageDiv);
}

function clearAndLoadPlayer(messageDiv)
{
  playlistReset(messageDiv);
  loadPlayer(messageDiv);
}

function playNextPlaylistVideo(messageDiv)
{
  setPlaylistIndex(parseInt(getPlaylistIndex())+1);
  playPlaylistVideo(messageDiv);
}

function playPrevPlaylistVideo(messageDiv)
{
  var index=parseInt(getPlaylistIndex())-1;
  if(index<0)
    index=0;
  setPlaylistIndex(index);
  playPlaylistVideo(messageDiv);
}

function playlistReset(messageDiv)
{
  savePlaylist([]);
  setPlaylistIndex(0);
}

function playlistResetIndex(messageDiv)
{
  setPlaylistIndex(0);
  playPlaylistVideo(messageDiv);
}

function playPlaylistVideo(messageDiv)
{
  messageDiv.innerHTML = 'loading video';
  var index=getPlaylistIndex();
  var playlist=getPlaylist();
  if(index >= playlist.length)
  {
    messageDiv.innerHTML = 'Finished playlist';
    return;
  }
  showPlaylist(messageDiv, "yes");
  var search=encodeURIComponent((playlist[index].artist+' '+playlist[index].track).trim());
  var xhr = new XMLHttpRequest();
  var apikey='AIzaSyBkMKh0dR1lWSrr2Bia_JdRc1kv7Nue8H8';
  xhr.open('GET', "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&key="+apikey+"&q="+search);
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, playPlayer.bind(undefined, messageDiv), playPlaylistVideo.bind(undefined, messageDiv));
  xhr.send();
}

function playPlayer(messageDiv, response)
{
  messageDiv.innerHTML = 'Got videos';
  /*if(typeof(youtube.loadVideoById) == "undefined")
  {
    window.setTimeout(playPlayer.bind(undefined, messageDiv, youtube, response), 500);
    return;
  }*/
  var data=JSON.parse(response);
  if(data.items.length === 0)
  {
    messageDiv.innerHTML = "Couldn't find any videos :(";
    window.setTimeout(clear.bind(undefined, messageDiv), 5000);
    setPlaylistIndex(parseInt(getPlaylistIndex())+1);
    return;
  }

  var videoId=data.items[0].id.videoId;

  var iframe = document.getElementById('playlistPlayer');
  var t=iframe.parentNode;
  var prev=document.getElementById('playlistPlayer');
  if(prev)
    prev.parentNode.removeChild(prev);
  iframe=document.createElement('div');
  iframe.setAttribute('id', 'playlistPlayer');
  t.appendChild(iframe);
  var width = iframe.parentNode.clientWidth-20;
  var height = Math.round(width/(16/9));
  console.log(videoId);
  console.log(YT);
  new YT.Player('playlistPlayer', {
    height: height,
    width: width,
    videoId: videoId,
    events: {'onReady': playerReady, 'onStateChange': playerStateChanged.bind(undefined, messageDiv)}});
}

function playerReady(event)
{
  event.target.playVideo();
  var settings=getSettings();
  if(settings.quality && settings.quality.length > '')
    event.target.setPlaybackQuality(settings.quality);
}

function playerStateChanged(messageDiv, event)
{
  if(event.target.getPlayerState() === 0)
  {
    setPlaylistIndex(parseInt(getPlaylistIndex())+1);
    playPlaylistVideo(messageDiv);
  }
  if(event.data == YT.PlayerState.BUFFERING)
  {
    var settings=getSettings();
    if(settings.quality && settings.quality.length > '')
      event.target.setPlaybackQuality(settings.quality);
    if(settings.volume)
      event.target.setVolume(settings.volume);
  }
}

function getPlaylistIndex()
{
  var playlistIndex=window.localStorage.youtubeIndex;
  if(!playlistIndex)
    playlistIndex=0;
  return playlistIndex;
}

function setPlaylistIndex(index)
{
  window.localStorage.youtubeIndex=index;
}

function getPlaylist()
{
  var playlist=window.localStorage.youtubePlaylist;
  if(!playlist)
    playlist=[];
  else
    playlist=JSON.parse(playlist);
  return playlist;
}

function savePlaylist(playlist)
{
  window.localStorage.youtubePlaylist = JSON.stringify(playlist);
}

function loadTorrent()
{
  var settings=getSettings();
  var h2 = document.getElementsByTagName('h2')[0];
  var artist = h2.getElementsByTagName('a');
  if(artist.length > 0)
    artist = artist[0].innerHTML;
  else
    artist = '';
  var tracks = document.getElementsByClassName('postlist');
  var tD=document.getElementsByClassName('torrent_description')[0].textContent;
  if(tD.indexOf('discogs.com') != -1 && tD.indexOf('/release/') != -1)
  {
    var discogs_release=parseInt(tD.split('/release/')[1]);
    doDiscogs(discogs_release);
  }
  else if(tracks.length > 0)
  {
    var s=document.createElement('span');
    var a=document.createElement('a');
    s.appendChild(a);
    a.innerHTML = 'Close Videos';
    a.href='javascript:void(0);';
    a.addEventListener('click', closeIframes, false);
    tracks[0].parentNode.insertBefore(s, tracks[0]);
    tracks=tracks[0].getElementsByTagName('li');

    if(settings.useYoutubeAPI)
    {
      var a=document.createElement('a');
      s.appendChild(document.createTextNode(' '));
      s.appendChild(a);
      a.innerHTML = '(enqueue all)';
      a.href='javascript:void(0);';
      var album=h2.getElementsByTagName('span')[0].textContent;
      a.addEventListener('click', enqueueTracks.bind(undefined, a, tracks, artist, album), false);
    }
    doTracks(artist, tracks);
  }
  else
  {
    tracks=makePreview(getTracks);
    doTracks(artist, tracks);
  }
}

function doDiscogs(id)
{
  var messageDiv=document.getElementById('previewTracksMessages');
  if(!messageDiv)
  {
    messageDiv=document.createElement('div');
    messageDiv.setAttribute('style', 'position: fixed; background: rgba(0,0,0,0.7); top: 50px; margin: auto; left: 0; right: 0; text-align: center; font-size: 2em;');
    messageDiv.setAttribute('id', 'previewTracksMessages');
    document.body.appendChild(messageDiv);
  }
  messageDiv.innerHTML = 'Getting tracklist from discogs.com';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://api.discogs.com/releases/"+id);
  xhr.onreadystatechange = xhr_func.bind(undefined, messageDiv, xhr, gotDiscogs.bind(undefined, messageDiv), doDiscogs.bind(undefined, id));
  xhr.send();
}

function gotDiscogs(messageDiv, response)
{
  messageDiv.innerHTML = '';
  var r=JSON.parse(response);
  console.log(r.tracklist);

  var tracks=makePreview(getDiscogTracks.bind(undefined, r.tracklist));

  doTracks(r.artists[0].name.split('(')[0], tracks);
}

function getDiscogTracks(tracks)
{
  var result=[];
  for(var i=0; i<tracks.length; i++)
  {
    if(tracks[i].title.length > 0)
      result.push(tracks[i].title);
  }
  return result;
}

function doTracks(artist, tracks)
{
  var settings=getSettings();
  for(var i=0; i<tracks.length; i++)
  {
    var input=document.createElement('input');
    var t=tracks[i];
    var track=t.textContent;
    input.value=(artist+' '+track).trim();
    t.innerHTML = '';
    var span=document.createElement('span');
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.setAttribute('class', 'previewLinks');
    a.innerHTML = track;
    a.addEventListener('click', preview.bind(undefined, a, t, span, artist, track, i, input), false);
    t.appendChild(a);
    t.appendChild(document.createTextNode(' '));
    if(settings.useYoutubeAPI)
    {
      var a=document.createElement('a');
      a.href='javascript:void(0);';
      a.innerHTML = '(enqueue)';
      var album=document.getElementsByTagName('h2')[0].getElementsByTagName('span')[0].textContent;
      a.addEventListener('click', enqueueTrack.bind(undefined, a, artist, track, album), false);
      t.appendChild(a);
      t.appendChild(document.createTextNode(' '));
    }
    var a=document.createElement('a');
    a.href='javascript:void(0);';
    a.innerHTML = '(show search)';
    a.addEventListener('click', toggleShow.bind(undefined, input, a), false);
    t.appendChild(a);
    t.appendChild(document.createTextNode(' '));
    t.appendChild(input);
    input.style.display='none';
    t.appendChild(span);
  }
}

function toggleShow(el, link)
{
  if(el.style.display=='none')
  {
    link.innerHTML=link.innerHTML.replace(/show/, 'hide');
    el.style.display='';
  }
  else
  {
    link.innerHTML=link.innerHTML.replace(/hide/, 'show');
    el.style.display='none';    
  }
}

function enqueueTrack(a, artist, track, album)
{
  var playlist=getPlaylist();
  playlist.push({artist:artist, album:album, track:track});
  savePlaylist(playlist);
  a.innerHTML = '(enqueued)';
}

function enqueueTracks(a, trackLis, artist, album)
{
  var playlist=getPlaylist();
  for(var i=0; i<trackLis.length; i++)
  {
    playlist.push({artist:artist, album:album, track:trackLis[i].getElementsByTagName('a')[0].textContent.trim()});
  }
  savePlaylist(playlist);
  a.innerHTML='(enqueued all)';
}

function closeIframes()
{
  var prev=document.getElementById('previewIframe');
  if(prev)
    prev.parentNode.removeChild(prev);
}

function toggle(div)
{
  if(div.style.display == 'none')
    div.style.display = 'initial';
  else
    div.style.display = 'none';
}

function makePreview(getTracksFunc)
{
  var settings=getSettings();
  var div=document.createElement('div');
  div.setAttribute('class', 'box torrent_description');
  var before=document.getElementsByClassName('torrent_description')[0];
  before.parentNode.insertBefore(div, before);
  var clone=before.getElementsByClassName('head')[0].cloneNode(true);
  div.appendChild(clone);
  clone.getElementsByTagName('strong')[0].innerHTML = 'Track Preview';
  var body=document.createElement('div');
  if(settings.hideTrackPreview)
    body.style.display='none';
  var a=document.createElement('a');
  a.href='javascript:void(0);';
  a.innerHTML = '(toggle)';
  clone.appendChild(document.createTextNode(' '));
  clone.appendChild(a);
  a.addEventListener('click', toggle.bind(undefined, body), false);
  var a=document.createElement('a');
  a.setAttribute('style', 'float: right;');
  a.innerHTML='Settings';
  a.href='/forums.php?action=viewthread&threadid=1236';
  clone.appendChild(a);
  div.appendChild(body);
  body.setAttribute('class', 'body');
  body.innerHTML = 'Track List:<br />';
  var a=document.createElement('a');
  a.innerHTML = 'Close Videos';
  a.href='javascript:void(0);';
  a.addEventListener('click', closeIframes, false);
  body.appendChild(a);
  var tracks=getTracksFunc();

  if(settings.useYoutubeAPI)
  {
    var a=document.createElement('a');
    body.appendChild(document.createTextNode(' '));
    body.appendChild(a);
    a.innerHTML = '(enqueue all)';
    a.href='javascript:void(0);';
  }

  var ol=document.createElement('ol');
  ol.setAttribute('class', 'postlist');
  body.appendChild(ol);
  var result = [];
  for(var i=0; i<tracks.length; i++)
  {
    var li=document.createElement('li');
    li.innerHTML = tracks[i];
    ol.appendChild(li);
    result.push(li);
  }

  if(settings.useYoutubeAPI)
  {
    var h2 = document.getElementsByTagName('h2')[0];
    var artist = h2.getElementsByTagName('a');
    if(artist.length > 0)
      artist = artist[0].innerHTML;
    else
      artist = '';
    var album=h2.getElementsByTagName('span')[0].textContent;
    a.addEventListener('click', enqueueTracks.bind(undefined, a, result, artist, album), false);
  }

  return result;
}

function getTracks(offset)
{
  if(!offset)
    offset=0;
  var torrent_row = document.getElementsByClassName('torrent_row')[offset];
  var type = torrent_row.getElementsByTagName('a');
  type = type[type.length-1].innerHTML.split(' / ')[0].toLowerCase();
  var filelist = document.getElementsByClassName('filelist_table')[offset].getElementsByTagName('tr');
  var files=[];
  for(var i=1; i<filelist.length; i++)
  {
    var f=filelist[i].getElementsByTagName('td')[0].innerHTML;
    if(f.indexOf(type) != f.length-type.length)
      continue;
    var f1 = f.split('/');
    if(f1.length > 1)
      f=f1[f1.length-1];
    f1 = f.split(f.match(/\d+/));
    if(f1.length > 1)
      f=f1[1];
    f = f.replace(/^[0-9]+\.?/, '').replace(/ - /g, ' ').replace(new RegExp("."+type), '').replace(/_/g, ' ').replace(/-/g, ' ');
    var artist = document.getElementsByTagName('h2')[0].getElementsByTagName('a');
    if(artist.length > 0)
      artist = artist[0].innerHTML;
    else
      artist='';
    var l=f.toLowerCase().indexOf(artist.toLowerCase());
    if( l != -1)
      f=f.substr(0, l)+f.substr(l+artist.length);
    //f = f.split('(')[0];
    files.push(f);
  }
  if(files.length === 0)
    return getTracks(offset+1);
  return files;
}

function preview(a, t, span, artist, track, index1, input)
{
  var existingSearch=a.getAttribute('search');
  if(existingSearch == input.value)
  {
    var videoIds = t.getAttribute('videoIds');
    if(videoIds)
    {
      var index = parseInt(t.getAttribute('index'));
      videoIds = JSON.parse(videoIds);
      if(index >= videoIds.length)
      {
        span.innerHTML = 'Already on last video';
        window.setTimeout(clear.bind(undefined, span), 5000);
        return;
      }
      addEmbed(t, span, videoIds[index]);
      t.setAttribute('index', index+1);
      return;
    }
  }
  a.setAttribute('search', input.value);
  t.parentNode.setAttribute('index', index1);
  span.innerHTML = 'Getting videos';
  //track = track.split('(')[0];
  var xhr = new XMLHttpRequest();
  var apikey='AIzaSyBkMKh0dR1lWSrr2Bia_JdRc1kv7Nue8H8';
  var search=input.value.trim();
  //xhr.open('GET', "https://gdata.youtube.com/feeds/api/videos?v=2&alt=json&orderby=relevance&q="+encodeURIComponent(artist+' '+track));
  xhr.open('GET', "https://www.googleapis.com/youtube/v3/search?part=snippet&order=relevance&type=video&key="+apikey+"&q="+encodeURIComponent(search));
  xhr.onreadystatechange = xhr_func.bind(undefined, span, xhr, previewing.bind(undefined, t, span), preview.bind(undefined, a, t, span, artist, track, input));
  xhr.send();
}

function previewing(t, span, response)
{
  span.innerHTML = 'Got videos';
  var data=JSON.parse(response);
  if(data.items.length === 0)
  {
    span.innerHTML = "Couldn't find any videos :(";
    window.setTimeout(clear.bind(undefined, span), 5000);
    return;
  }
  var videoIds = [];
  for(var i=0; i<data.items.length; i++)
  {
    videoIds.push(data.items[i].id.videoId);
  }
  t.setAttribute('videoIds', JSON.stringify(videoIds));
  t.setAttribute('index', 1);

  addEmbed(t, span, data.items[0].id.videoId);
}

function addEmbed(t, span, videoId)
{
  var settings=getSettings();
  var iframe = t.getElementsByTagName('iframe');
  if(iframe.length === 0)
  {
    var prev=document.getElementById('previewIframe');
    if(prev)
      prev.parentNode.removeChild(prev);
    if(settings.useYoutubeAPI)
    {
      iframe=document.createElement('div');
      iframe.setAttribute('id', 'previewIframe');
      t.appendChild(iframe);
      var width = t.parentNode.clientWidth-20;
      var height = Math.round(width/(16/9));
      new YT.Player('previewIframe', {
        height: height,
        width: width,
        videoId: videoId,
        events: {'onReady': previewReady, 'onStateChange': previewStateChanged}});
    }
    else
    {
      iframe = document.createElement('iframe');
      iframe.setAttribute('id', 'previewIframe');
      t.appendChild(iframe);
      iframe.width = t.parentNode.clientWidth-20;
      iframe.height = iframe.width/(16/9);
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.frameBorder='0';
    }
  }
  else
    iframe = iframe[0];
  iframe.src='https://www.youtube.com/embed/'+videoId+'?autoplay=1';
  //iframe.setAttribute('autoplay', true);
  span.innerHTML = ' Added youtube embed';
  var link=document.getElementById('youtubeLink');
  if(link)
    link.parentNode.removeChild(link);
  link=document.createElement('a');
  span.parentNode.insertBefore(link, span);
  link.href='https://youtu.be/'+videoId;
  link.innerHTML='(Link)';
  link.id='youtubeLink';
  window.setTimeout(clear.bind(undefined, span), 5000);
}

function previewReady(event)
{
  event.target.playVideo();
  var settings=getSettings();
  if(settings.quality && settings.quality.length > '')
    event.target.setPlaybackQuality(settings.quality);
}

function previewStateChanged(event)
{
  if(event.target.getPlayerState() === 0)
  {
    //console.log('ended');
    var as=document.getElementsByClassName('previewLinks');
    var index=parseInt(as[0].parentNode.parentNode.getAttribute('index'))+1;
    if(index < as.length)
      as[index].click();
  }
  if(event.data == YT.PlayerState.BUFFERING)
  {
    var settings=getSettings();
    if(settings.quality && settings.quality.length > '')
      event.target.setPlaybackQuality(settings.quality);
    if(settings.volume)
      event.target.setVolume(settings.volume);
  }
}

function clear(span)
{
  span.innerHTML = '';
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