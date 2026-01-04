// ==UserScript==
// @name         Gazelle API links
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.02
// @description  Show link for viewing current page as JSON (where available)
// @author       Anakunda
// @match        https://redacted.ch/*
// @match        https://orpheus.network/*
// @match        https://notwhat.cd/*
// @downloadURL https://update.greasyfork.org/scripts/396618/Gazelle%20API%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/396618/Gazelle%20API%20links.meta.js
// ==/UserScript==

'use strict';

const params = new URLSearchParams(document.location.search);
var apiParams = new URLSearchParams();
var id = parseInt(params.get('id'));

switch (document.location.pathname) {
  case '/index.php':
	apiParams.set('action', 'index');
	break;
  case '/torrents.php': {
	if (params.get('action') == 'notify') {
	  apiParams.set('action', 'notifications');
	  setApiParam('page');
	  document.querySelectorAll('table.torrent_table > tbody > tr.torrent > td > div > span').forEach(processRow);
	} else if (params.get('type') == 'uploaded') {
	  apiParams.set('action', 'browse');
	  apiParams.set('type', 'uploaded');
	  id = params.get('userid');
	  if (!id) return;
	  setApiParam('userid', id);
	  document.querySelectorAll('table.torrent_table > tbody > tr.torrent > td > div > span').forEach(processRow);
	} else if (params.get('action') == 'basic' || params.get('action') == 'advanced' || !id) {
	  apiParams.set('action', 'browse');
	  document.querySelectorAll('table#torrent_table > tbody > tr.group_torrent > td > span').forEach(processRow);
	} else if (id) {
	  apiParams.set('action', 'torrentgroup');
	  apiParams.set('id', id);
	  document.querySelectorAll('table#torrent_details > tbody > tr.torrent_row[id] > td > span').forEach(processRow);
	  break;
	}
	[
	  'search', 'searchstr', 'page', 'taglist', 'tags_type', 'order_by', 'order_way', 'filter_cat', 'freetorrent',
	  'vanityhouse', 'scene', 'log', 'cue', 'releasetype', 'media', 'format', 'encoding', 'artistname', 'filelist',
	  'groupname', 'recordlabel', 'cataloguenumber', 'year', 'remastertitle', 'remasteryear',
	  'remasterrecordlabel', 'remastercataloguenumber', 'bitrate', 'trumpable', 'reported', 'tags', 'order', 'way',
	].forEach(setApiParam);
	break;

	function processRow(span) {
	  if (span.classList.contains('votespan')) return;
	  var a = span.parentNode.querySelector(':scope > a:last-of-type')
	  	|| span.parentNode.querySelector('strong > a:last-of-type');
	  if (!/^torrent(\d+)$/i.test(span.parentNode.parentNode.id)
		  && (a == null || !/\btorrentid=(\d+)\b/i.test(a.href))) return;
	  var id = parseInt(RegExp.$1);
	  a = document.createElement('a');
	  a.className = 'tooltip button_api';
	  var apiParams = new URLSearchParams({ action: 'torrent', id: id });
	  a.href = '/ajax.php?'.concat(apiParams);
	  a.target = '_blank';
	  a.textContent = 'API';
	  var ref = span.lastChild.nodeType == Node.TEXT_NODE ? span.lastChild : null;
	  span.insertBefore(document.createTextNode(' | '), ref);
	  span.insertBefore(a, ref);
	}
  }
  case '/user.php':
	apiParams.set('action', 'user');
	if (params.get('action') == 'search') {
	  ['search', 'page'].forEach(setApiParam);
	} else {
	  if (!id) return;
	  apiParams.set('id', id);
	}
	break;
  case '/requests.php':
	if (params.get('action') == 'search') {
	  apiParams.set('action', 'requests');
	  [
		'search', 'page', 'tag', 'tag_type', 'show_filled', 'filter_cat', 'releases', 'bitrates', 'formats', 'media',
	  ].forEach(setApiParam);
	} else {
	  apiParams.set('action', 'request');
	  if (!id || params.get('action') != 'view') return;
	  apiParams.set('id', id);
	}
	break;
  case '/artist.php':
	apiParams.set('action', 'artist');
	if (!id) return;
	apiParams.set('id', id);
	break;
  case '/collages.php':
	apiParams.set('action', 'collage');
	if (!id) return;
	apiParams.set('id', id);
	break;
  case '/forums.php':
	apiParams.set('action', 'forum');
	if (params.get('action') == 'viewthread') {
	  if (!(id = params.get('threadid'))) return null;
	  apiParams.set('type', 'viewthread');
	  apiParams.set('threadid', id);
	  setApiParam('page');
	} else if (params.get('action') == 'viewforum') {
	  if (!(id = params.get('threadid'))) return null;
	  apiParams.set('type', 'viewforum');
	  apiParams.set('forumid', id);
	  setApiParam('page');
	} else apiParams.set('type', 'main');
	break;
  case '/userhistory.php':
	if (params.get('action') != 'subscriptions') return;
	apiParams.set('action', 'subscriptions');
	setApiParam('showunread');
	break;
  case '/bookmarks.php':
	apiParams.set('action', 'bookmarks');
	setApiParam('type');
	break;
  case '/top10.php':
	apiParams.set('action', 'top10');
	['type', 'limit', 'advanced', 'tags', 'anyall', 'format'].forEach(setApiParam);
	break;
  case '/inbox.php':
	apiParams.set('action', 'inbox');
	if (params.get('action') == 'viewconv') {
	  apiParams.set('type', 'viewconv');
	  if (!id) return;
	  apiParams.set('id', id);
	} else {
	  ['type', 'page', 'sort', 'search', 'search', 'searchtype'].forEach(setApiParam);
	}
	break;
  default:
	return;
}

if (!apiParams.get('action')) return;
var url = new URL(document.location.origin.concat('/ajax.php'));
var a = document.createElement('a');
a.className = 'brackets';
a.target = '_blank';
a.textContent = 'View through API';
url.search = apiParams;
a.href = url;
var ref = document.querySelector('div.linkbox > div.center') || document.querySelector('div.linkbox');
if (ref != null) {
  let br = ref.querySelector('br');
  ref.insertBefore(document.createTextNode('\u00A0\u00A0\u00A0'), br);
  ref.insertBefore(a, br);
} else if ((ref = document.querySelector('div.header')) != null) {
  a.style.float = 'right';
  ref.append(a);
}

function setApiParam(param) {
  var value = params.get(param);
  if (value != null) apiParams.set(param, value);
}
