// ==UserScript==
// @version 3
// @name Bandcamp upload helper
// @description Bandcamp helper for getting info to RED uploads
// @include http*://*.bandcamp.com/album/*
// @include http*://*redacted.ch/upload.php*_buh*
// @grant GM.openInTab
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/195861
// @downloadURL https://update.greasyfork.org/scripts/370240/Bandcamp%20upload%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/370240/Bandcamp%20upload%20helper.meta.js
// ==/UserScript==

// Use a unique URL parameter to know when to insert into upload.php
var urlIdentifier = '_buh';
var uploadUrl = 'https://redacted.ch/upload.php?' + urlIdentifier + '=true';

var tagQueryUrl = 'https://redacted.ch/torrents.php?action=autocomplete_tag&query=';

var validTags = [];

// Generate the description from the Bandcamp description and tracklist
function yadgTrack(track) {
  return '[b]' + track.num + '[/b]. ' + track.name + ' [i](' + track.duration + ')[/i]';
}

function yadg(info) {
  
  var res = '';
  
  if (info.desc) {
  	res += '[size=4][b]Description[/b][/size]\n\n';
  	res += info.desc + '\n\n';
  }
  
  res += '[size=4][b]Tracklist[/b][/size]\n\n'
  for (var i=0; i < info.tracks.length; i++) {
    res += yadgTrack(info.tracks[i]) + '\n';
  }
  res += '\n';
  
  res += 'More information: [url]' + info.url + '[/url]';
  
  return res;
}


// Check Bandcamp tag for valid RED tag
function addValidTags(tags) {
  $.map(tags, validTag)
}

function validTag(tag) {
  var details = {
    method: GET,
    url: tagQueryUrl + tag,
    onload: receiveTagResult
  };

  GM.xmlHttpRequest(details);
}

function receiveTagResult(res) {
  var payload = JSON.parse(res.responseText);
  var suggestions = payload.suggestions;
  var tag = payload.query;

  if (suggestions.length === 0) {
    return;
  }

  if (suggestions[0].value !== tag) {
    return;
  }

  validTags.append(tag);
  updateTags();
}

function redifyTag(tag) {
  return tag.split(/[\s-]+/g).join('.');
}

function updateTags() {
  var tagInput = $('#tags');

  var tagString = validTags.join(',');

  $(tagInput).val(tagString);
}


// Extract info from each track on webpage
function trToTrack(idx, tr) {
  var tracknum = $(tr).find('td:nth-child(2)').text().trim();
  tracknum = tracknum.substring(0, tracknum.length - 1);
	var name = $(tr).find('span[itemprop=name]').text().trim();
  var duration = $(tr).find('meta[itemprop=duration]').prop('content').replace(/P(\d+)H(\d+)M(\d+)S/g, '$2:$3');
  
  return {
    num: tracknum,
    name: name,
    duration: duration
  };
}

function generateInfo() {
	var tracks = $('#track_table > tbody > tr.track_row_view').map(trToTrack).get();
  
  var description = $('div[itemprop=description]').text().replace(/[\n\r][\n\r][\n\r][\n\r]/g, '\n\n');
  
  var year = $('meta[itemprop=datePublished]').prop('content').substring(0,4);
  
  var album = $('h2[itemprop=name]').text().trim();
  
  var artist = $('span[itemprop=byArtist] > a').text().trim();
  
  if (artist === 'Various Artists') {
  	artist = $('#band-name-location > span .title').text().trim();
  }

  var tags = $('a .tag').map((idx, el) => redifyTag($(el).text().trim())).get();
  
  var info = {
    tracks: tracks,
    desc: description,
    url: window.location.href,
    year: year,
    album: album,
    artist: artist,
    tags: tags
  };
  
  saveInfo(info);

  GM.openInTab(uploadUrl);
}


// Save the info locally to be used on the upload page
function saveInfo(info) {
  var markup = yadg(info);

  Promise.all(
    [ GM.setValue('artist', info.artist)
  	, GM.setValue('album', info.album)
  	, GM.setValue('year', info.year)
    , GM.setValue('desc', markup)
    , GM.setValue('tags', JSON.stringify(info.tags))
  ]).then((vals) => GM.listValues()).then((vals) => {
    openUploadTab();
  });
}


// On Bandcamp, get info
function initBandcamp() {
	var input=document.createElement("input");
	input.type="button";
	input.value="Generate description";
	input.onclick = generateInfo;
	input.setAttribute("style", "font-size:18px;margin-bottom:1rem;top:120px;right:40px;");
  
  $('#track_table').before(input);
}


// On RED, insert info
function initRedacted() {
  Promise.all(
    [ GM.getValue('year')
    , GM.getValue('artist')
    , GM.getValue('album')
    , GM.getValue('desc')
    , GM.getValue('tags')
  ]).then((vals) => {
  	$('#year').prop('value', vals[0]);
    $('#artist').prop('value', vals[1]);
    $('#title').prop('value', vals[2]);
    $('#album_desc').prop('value', vals[3]);

    addValidTags(JSON.parse(vals[4]));
  });
  
  $('#releasetype > option:nth-child(2)').prop('selected', true);
  $('#format').val('FLAC');
  $('#bitrate').val('Lossless');
  $('#media').val('WEB');
}


// Check where the script is running
function isOnBandcamp() {
  return location.href.indexOf('bandcamp') !== -1;
}

function isOnRedacted() {
  return location.href.indexOf('redacted') !== -1;
}


// Execute when page is finished loading
$(document).ready(function () {  
  var current = location.href;
  if (isOnBandcamp()) {
    initBandcamp();
  } else if (isOnRedacted()) {
    initRedacted();
  } else {
    console.error('Bandcamp Upload Helper error: href mismatch.');
  }
});