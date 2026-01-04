// ==UserScript==
// @name         Gazelle Music Collage Builder
// @version      1.03
// @author       Anakunda
// @namespace    https://greasyfork.org/users/321857-anakunda
// @description  Scan site torrents that suit criteria and add them to current collage
// @match        https://orpheus.network/collages.php?id=*
// @match        https://redacted.ch/collages.php?id=*
// @match        https://notwhat.cd/collages.php?id=*
// @grant        GM_getValue
// @require      https://openuserjs.org/src/libs/Anakunda/libLocks.min.js
// @require      https://openuserjs.org/src/libs/Anakunda/gazelleApiLib.js
// @downloadURL https://update.greasyfork.org/scripts/397046/Gazelle%20Music%20Collage%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/397046/Gazelle%20Music%20Collage%20Builder.meta.js
// ==/UserScript==

'use strict';

const timeout = 60000; // some collages take long to load

var ref = document.querySelector('div.box_category > div.pad > a');
if (ref == null || ref.textContent.trim() == 'Artists') return;
if (!/\bid=(\d+)\b/i.test(document.location.search)) return;
const collageId = parseInt(RegExp.$1);
if ((ref = document.querySelector('li#nav_userinfo > a.username')) == null || !/\b(?:id)=(\d+)\b/i.test(ref.search)) return;
const userId = parseInt(RegExp.$1);
if ((ref = document.querySelector('input[name="auth"]')) == null) return;
const userAuth = ref.value;
if ((ref = document.querySelector('div.linkbox > br')) == null) return;
if ((ref = document.querySelector('div.sidebar')) == null) return;
var elem = document.createElement('div');
elem.id = 'collage-builder';
elem.className = 'box box_collagebuilder';
elem.style = 'padding: 0 0 10px;';
elem.innerHTML = `
<div class="head" style="margin-bottom: 5px;"><strong>Collage Builder</strong></div>
<div id="cb_message" class="hidden center" style="padding: 10px;"></div>
<form id="collage_builder" style="padding: 10px;">
  <div>Search URL</div>
  <textarea id="cb_filter_url" class="wbbarea noWhutBB" rows="3" style="font-size: 9pt; width: 95%;" placeholder="Site search URL for narrowing the candidates comes here"></textarea>
  <div>
	<label><input name="lookup-type" value="combined" id="lookup-combined" type="radio" checked="1">&nbsp;&nbsp;Combined sorts</label>
	<label style="margin-left: 15px;"><input name="lookup-type" id="lookup-random" value="random" type="radio">&nbsp;&nbsp;Random</label>
  </div>
  <div style="margin-top: 10px;">JS condition:</div>
  <textarea id="cb_condition" class="wbbarea noWhutBB" rows="7" style="font-size: 10pt; width: 95%; font-family: monospace;" placeholder="JS expression that must evaluate to true for every torrent candidate, e.g. /^Naxos(?:\\s+Records)$/.test(torrent.remasterRecordLabel)  |  Leave empty to pass all search results (risky!)"></textarea>
  <input id="cb_submit" style="margin-top: 10px;" type="submit">
  <a target="_blank" href="https://github.com/WhatCD/Gazelle/wiki/JSON-API-Documentation#torrent" style="margin-top: 15px; margin-right: 15px; float: right;">Reference</a>
</form>
`;
ref.append(elem);
var form = document.getElementById('collage_builder');
if (form == null) return;
var message = document.getElementById('cb_message');
var urlFilter = document.getElementById('cb_filter_url');
if (urlFilter == null) return;
var expression = document.getElementById('cb_condition');
if (expression == null) return;
var doBuild = document.getElementById('cb_submit');
if (doBuild == null) return;
urlFilter.ondrop = function(evt) { return dataHandler(evt.target, evt.dataTransfer) };
//urlFilter.onpaste = function(evt) { return dataHandler(evt.target, evt.clipboardData) };
var timer = setTimeout(function() {
  expression.value = '/\\b(?:text required in description)\\b/i.test(torrent.description)';
}, 8000);
expression.oninput = function() {
  if (timer != null) clearTimeout(timer);
  timer = null;
};
doBuild.dataset.value = 'Build collage';
doBuild.value = doBuild.dataset.value;
//doBuild.onclick = build;
form.onsubmit = build;
return;

function build(evt) {
  message.classList.add('hidden');
  queryAjaxAPI('collage', { id: collageId }).then(function(collage) {
	doBuild.disabled = true;
	doBuild.value = 'Performing lookups, patience...';
	doBuild.style = 'background-color: #800000C0;';
	var torrentGroups = new Set(collage.torrentGroupIDList.map(id => parseInt(id)));
	var searchUrl = new URL(urlFilter.value), searchParams = new URLSearchParams(searchUrl.search);
	new Promise(function(resolve, reject) {
	  switch (document.querySelector('input[name="lookup-type"]:checked').value) {
		case 'combined':
		  var order_by = ['time', 'year', 'size', 'snatched', 'seeders', 'leechers'];
		  var order_way = ['asc', 'desc'];
		  break;
		case 'random':
		  order_by = ['random'];
		  order_way = [];
		  var repeats = 40;
		  break;
		default:
		  throw 'Invalid method value';
	  }
	  var torrentIds = [], order_by_ndx = 0, order_way_ndx = 0, counter = 0;
	  searchInternal();

	  function searchInternal(page) {
		var query = {};
		[
		  'search', 'searchstr', 'taglist', 'tags_type', 'filter_cat', 'freetorrent', 'vanityhouse', 'scene',
		  'log', 'cue', 'releasetype', 'media', 'format', 'encoding', 'artistname', 'filelist', 'groupname',
		  'recordlabel', 'cataloguenumber', 'year', 'remastertitle', 'remasteryear', 'description',
		  'remasterrecordlabel', 'remastercataloguenumber', 'bitrate', 'trumpable', 'reported', 'tags',
		].forEach(param => { if (searchParams.has(param)) query[param] = searchParams.get(param) });
		if (order_by_ndx < order_by.length) query.order_by = order_by[order_by_ndx];
		if (order_way_ndx < order_way.length) query.order_way = order_way[order_way_ndx];
		if (page) query.page = page;
		queryAjaxAPI('browse', query).then(function(result) {
		  console.debug('searchInternal order_by:', order_by[order_by_ndx],
			  'order_way:', order_way[order_way_ndx], 'page:', result.currentPage);
		  result.results.forEach(function(result) {
			if (torrentGroups.has(result.groupId) || !Array.isArray(result.torrents)) return;
			result.torrents.forEach(function(torrent) {
			  if (!torrentIds.includes(torrent.torrentId)) torrentIds.push(torrent.torrentId);
			});
		  });
		  if (result.currentPage < Math.min(result.pages, 20)) searchInternal(result.currentPage + 1); else {
			if (result.results.length < 50 || result.pages < 20 && !(repeats > 1)) return done();
			if (++order_way_ndx >= order_way.length) {
			  if (++order_by_ndx >= order_by.length) {
				if (++counter >= (repeats || 0)) return done();
				order_by_ndx = 0;
			  }
			  order_way_ndx = 0;
			}
			searchInternal();
		  }

		  function done() {
			console.debug('searchInternal resolving with', torrentIds, 'torrents found');
			resolve(torrentIds);
		  }
		});
	  }
	}).then(function(torrentIds) {
	  message.textContent = 'Lookup done, evaluating ' + torrentIds.length + ' candidates and filling the collage';
	  message.classList.remove('hidden');
	  doBuild.value = 'Filtering and adding...';
	  var expr = expression.value.trim().replace(/\b(?:group|torrent)\b/g, 'result.$&')
	  	.replace(/\bresult\.(?=result\.(?:group|torrent)\b)/g, '');
	  var counter = 0;
	  return Promise.all(torrentIds.map(torrentId => queryAjaxAPI('torrent', { id: torrentId }).then(function(result) {
		if (torrentGroups.has(result.group.id)) return 'This group already added';
		try {
		  let txt = document.createElement("textarea");
		  if (expr.length > 0 && !eval(expr)) return 'Condition not met';

		  function decodeHTML(html) {
				txt.innerHTML = html;
				return txt.value;
			}
		} catch(e) {
		  console.error('Invalid expression:', expr, e);
		  message.innerHTML = '<span style="color: #FF0000;">The expression is invalid</span>';
		  return e;
		}
		torrentGroups.add(result.group.id);
		return new Promise(function(resolve) {
		  var formData = new URLSearchParams({
			action: 'add_torrent',
			auth: userAuth,
			collageid: collageId,
			groupid: result.group.id,
			url: document.location.origin.concat('/torrents.php?id=', result.group.id),
		  });
		  var xhr = new XMLHttpRequest();
		  xhr.open('POST', '/collages.php', true);
		  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		  xhr.onerror = xhr.ontimeout = xhr.onload = function() { resolve(xhr.status) };
		  xhr.send(formData.toString());
		  ++counter;
		});
	  })));
	}).then(function(results) {
	  resetBuildButton();
	  var msg = 'Finihsed, ' + results.filter(result => result >= 200 && result < 400).length + ' groups added';
	  message.innerHTML = '<span style="color: #008000;">' + msg + '</span>';
	  alert(msg);
	}).catch(function(reason) {
	  resetBuildButton();
	  message.innerHTML = '<span style="color: #800000;">' + reason + '</span>';
	  message.classList.remove('hidden');
	});
  }).catch(function(reason) {
	resetBuildButton();
	message.innerHTML = '<span style="color: #800000;">' + reason + '</span>';
	message.classList.remove('hidden');
  });
  return false;
}

function resetBuildButton() {
  doBuild.disabled = false;
  doBuild.value = doBuild.dataset.value;
  doBuild.style = null;
}

function defaultErrorHandler(xhr) {
  var str = 'XHR readyState=' + xhr.readyState + ', status=' + xhr.status;
  if (xhr.statusText) str += ' (' + xhr.statusText + ')';
  if (xhr.error) str += ' (' + xhr.error + ')';
  const e = new Error(str);
  console.error(e);
  return e;
}
function defaultTimeoutHandler() {
  const e = 'XHR: timeout';
  console.error(e);
  return e;
}

function dataHandler(target, data) {
  var text = data.getData('text/plain');
  if (!text) return true;
  target.value = text;
  return false;
}
