// ==UserScript==
// @name         [RED/NWCD] Group stats in torrent listings
// @namespace    https://greasyfork.org/cs/users/321857-anakunda
// @version      1.424
// @description  Populating torrent group user's rating, collage and comment counts in torrent listing
// @iconURL      https://redacted.ch/favicon.ico
// @author       Anakunda
// @match        http*://redacted.ch/torrents.php*
// @match        http*://redacted.ch/bookmarks.php?*
// @match        http*://redacted.ch/artist.php?*
// @match        http*://redacted.ch/collages.php?*
// @match        http*://notwhat.cd/torrents.php*
// @match        http*://notwhat.cd/bookmarks.php?*
// @match        http*://notwhat.cd/artist.php?*
// @match        http*://notwhat.cd/collages.php?*
// @connect      redacted.ch
// @connect      notwhat.cd
// @connect      orpheus.network
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/402027/%5BREDNWCD%5D%20Group%20stats%20in%20torrent%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/402027/%5BREDNWCD%5D%20Group%20stats%20in%20torrent%20listings.meta.js
// ==/UserScript==

'use strict';

if (document.location.pathname.toLowerCase() == '/torrents.php'
	&& /\b(?:groupid|torrentid|id)=(\d+)\b/i.test(document.location.search)) return;

const requestDelay = 500; // delay in ms between page fetches

function testDomain(domain) {
  return document.location.hostname.toLowerCase() == domain.toLowerCase();
}
const isRED = testDomain('redacted.ch');
const isNWCD = testDomain('notwhat.cd');
const isOPS = testDomain('orpheus.network');

const path = document.location.pathname.toLowerCase();
const search = document.location.search.toLowerCase();
const isBookmarks = path == '/bookmarks.php' && search.includes('type=torrents');
const isUploads = path == '/torrents.php' && search.includes('type=uploaded');
const isNotifications = !isUploads && path == '/torrents.php'&& search.includes('action=notify');
const isTorrents = !isUploads && !isNotifications && path == '/torrents.php' && !search.startsWith('?id=');
const isArtistGrp = path == '/artist.php';
const isCollage = path == '/collages.php';
//GM_setValue('no_votes', 0);
//GM_setValue('no_collages', 0);
//GM_setValue('no_comments', 0);

class Group {
  getStats() {
	if (!this.URL) return;
	GM_xmlhttpRequest({
	  method: 'GET',
	  url: this.URL,
	  context: this,
	  onload: function(response) {
		if (response.readyState != 4 || response.status != 200) return;
		var dom = new DOMParser().parseFromString(response.responseText, "text/html");
		var elem, node = response.context.node;

		// votes
		if (!GM_getValue('no_votes')) {
		  var votes = dom.getElementById('votes');
		  if (votes != null) {
			var totalvotes = parseInt(dom.getElementById('totalvotes').textContent);
			if (totalvotes > 0) {
			  var upvotes = parseInt(dom.getElementById('upvotes').textContent);
			  var downvotes = parseInt(dom.getElementById('downvotes').textContent);
			  var favoritecount = votes.querySelectorAll('span.favoritecount');
			  var BPCI = parseFloat(favoritecount[3].textContent);
			  var score = favoritecount[4].textContent;
			  if (/\b([\d\.]+)\s*\%/.test(score)) score = parseFloat(RegExp.$1);
			  var color = ['red', 'blue', 'green'][Math.sign(upvotes - downvotes) + 1];
			  elem = document.createElement(isTorrents ? 'div' : 'span');
			  elem.className = 'vote-stats';
			  elem.innerHTML = '<strong style="color: ' + color + ';">' + upvotes +
				'</strong>/<strong style="color: ' + color + ';">' + downvotes + '</strong> - ' +
				'<bpci>' + BPCI + '</bpci>';
			  if (isTorrents) {
				node.children[3].style.maxWidth = '70px';
				node.children[3].append(elem);
			  } else if (isUploads) {
				node.children[2].style.maxWidth = '70px';
				node.children[2].append(elem);
			  } else if (isNotifications) {
				node.children[4].style.maxWidth = '140px';
				node.children[4].append(elem);
			  } else if (isCollage || isBookmarks) {
				elem.style.float = 'right';
				elem.style.marginRight = '10px';
				node.parentNode.insertBefore(elem, node);
			  }
			}
		  }
		}

		// collages
		if (!GM_getValue('no_collages')) {
		  var collages = dom.querySelector('table#collages > tbody > tr.colhead > td:first-of-type');
		  collages = collages != null && /\bin\s+(\d+)\s+collages?\b/i.test(collages.textContent) ?
			parseInt(RegExp.$1) : 0;
		  // Personal colages
		  var cs = null;
		  var persCollages = dom.querySelector('table#personal_collages > tbody > tr.colhead > td:first-of-type');
		  persCollages = persCollages != null && /\bin\s+(\d+)\s+personal\s+collages?\b/i.test(persCollages.textContent) ?
			parseInt(RegExp.$1) : 0;
		  if (collages > 0 || persCollages > 0) {
			elem = document.createElement(isTorrents ? 'div' : 'span');
			elem.className = 'collage-stats';
			let pcStats = persCollages + ' PC';
			elem.innerHTML = collages + ' C / ' + (persCollages > 0 ? pcStats.bold() : pcStats);
			if (isTorrents) {
			  node.children[4].style.maxWidth = '58px';
			  node.children[4].append(elem);
			} else if (isUploads) {
			  node.children[3].style.maxWidth = '58px';
			  node.children[3].append(elem);
			} else if (isNotifications) {
			  node.children[5].style.maxWidth = '58px';
			  node.children[5].append(elem);
			} else if (isCollage || isBookmarks) {
			  elem.style.float = 'right';
			  elem.style.marginLeft = '10px';
			  elem.style.marginRight = '10px';
			  cs = node.appendChild(elem);
			} else if (isArtistGrp) {
			  elem.style.float = 'right';
			  cs = node.appendChild(elem);
			}
		  }
		}

		// user comments
		if (!GM_getValue('no_comments')) {
		  var ref = isCollage || isBookmarks || isArtistGrp ? node : node.querySelector('div.tags');
		  if (ref != null) {
			var comments = dom.querySelectorAll('div#torrent_comments > table[id^="post"]').length;;
			dom.querySelectorAll('div#torrent_comments > div.linkbox strong').forEach(function(strong) {
			  if (/^\s*(\d+)\s*-\s*(\d+)\s*$/.test(strong.textContent) && RegExp.$2 > comments) {
				comments = parseInt(RegExp.$2);
			  }
			});
			if (comments > 0) {
			  elem = document.createElement(isTorrents ? 'div' : 'span');
			  elem.className = 'comment-stats';
			  if (isArtistGrp) elem.style.marginLeft = '10px';
			  if (isCollage || isBookmarks) {
				if (cs == null) elem.style.marginleft = '10px';
				elem.style.marginRight = '10px';
				elem.style.clear = 'none';
			  }
			  elem.innerHTML = comments.toString() + ' cmt';
			  if (comments > 1) elem.innerHTML += 's';
			  ref.insertBefore(elem, cs);
			}
		  }
		}

		// Reports
		if (isOPS && response.context.tid) dom.querySelectorAll('table#torrent_details > tbody > tr.torrent_row').forEach(function(tr) {
		  if (!/^torrent(\d+)$/i.test(tr.id) || parseInt(RegExp.$1) != response.context.tid
			  || tr.querySelector('strong.tl_reported') == null) return;
		  if ((ref = node.querySelector('span.votespan.brackets')) == null) return;
		  ref.previousSibling.nodeValue += ' / ';
		  elem = document.createElement('strong');
		  elem.className = 'torrent_label tl_reported';
		  elem.textContent = 'Reported';
		  ref.parentNode.insertBefore(elem, ref);
		});

		// UA detector
		if (GM_getValue('UA_detector')
			&& ((ref = dom.querySelector('div.torrent_description > div.body span[class] strong')) != null
		   	&& ref.textContent == 'Tracklisting'
			|| (ref = dom.querySelector('div.torrent_description > div.body > div[style] span[class] > strong ~ span[style]')) != null)
		   	&& (ref = node.querySelector('span.votespan.brackets') || node.querySelector('span.add_bookmark')) != null) {
		  elem = document.createElement('strong');
		  elem.style = 'color: darkred; background-color: burlywood; margin-left: 5px; padding: 0 5px; border: solid 1px black;';
		  elem.textContent = 'UA';
		  ref.parentNode.insertBefore(elem, ref);
		}
	  },
	});
  }
};

document.head.appendChild(document.createElement('style')).innerHTML = `
.vote-stats {
  text-align: right
  font-style: normal; font-weight: normal;
}

.collage-stats {
  color: darkturquoise;
  text-align: right;
  font-style: normal; font-weight: normal;
}

.comment-stats {
  color: teal;
  float: right;
  clear: right;
  font-style: normal; font-weight: normal;
}

.tl_reported { color: red; }
.tl_snatched { color: cornflowerblue; }
strong.new { color: yellowgreen; }
`;

var ref = isUploads && document.querySelector('table.torrent_table > tbody > tr:first-of-type > td:nth-of-type(2)')
	|| isTorrents && document.querySelector('table.torrent_table > tbody > tr:first-of-type > td:nth-of-type(3)')
	|| (isArtistGrp || isNotifications || isBookmarks || isCollage) && document.querySelector('div.linkbox');
if (!(ref instanceof HTMLElement)) return;
var showStatsBtn = document.createElement('a');
showStatsBtn.href = '#';
showStatsBtn.textContent = 'Show stats';
if (isArtistGrp || isNotifications || isBookmarks || isCollage) {
  showStatsBtn.className = 'brackets';
  if (isNotifications) showStatsBtn.style.marginLeft = '10px';
} else {
  showStatsBtn.textContent += ' (server load)';
  showStatsBtn.style.color = 'darkkhaki';
  showStatsBtn.style.float = 'right';
}
showStatsBtn.onclick = function(e) {
  var index = 0;
  groups.forEach(it => { setTimeout(() => { it.getStats() }, requestDelay * ++index) });
  this.remove();
  return false;
}
ref.append(showStatsBtn);

var groups = [], group, node;

if (isTorrents) document.querySelectorAll('table > tbody > tr.group').forEach(function(tr) {
  addGroup(tr, 'div.group_info.clear > a:last-of-type');
});
if (isUploads) document.querySelectorAll('table > tbody > tr.torrent').forEach(function(tr) {
  addGroup(tr, 'div.group_info.clear > a:last-of-type');
});
if (isNotifications) document.querySelectorAll('table > tbody > tr.torrent').forEach(function(tr) {
  addGroup(tr, 'div.group_info.clear > strong > a:last-of-type');
});
if (isCollage || isBookmarks) document.querySelectorAll('table.torrent_table > tbody > tr[id^="group_"]').forEach(function(tr) {
  group = new Group();
  if (/^group_(\d+)$/i.test(tr.id)) group.URL = document.location.origin + '/torrents.php?id=' + RegExp.$1;
  group.node = tr.querySelector('td > div.tags');
  if (group.node != null) groups.push(group);
});
if (isArtistGrp) document.querySelectorAll('table.torrent_table > tbody > tr.group').forEach(function(tr) {
  group = new Group();
  group.URL = tr.querySelector('div.group_info > strong > a:first-of-type');
  group.URL = group.URL != null ? group.URL.href : null;
  group.node = tr.querySelector('div.group_info > div.tags');
  if (group.node != null) groups.push(group);
});

function addGroup(tr, selector) {
  group = new Group();
  node = tr.querySelector(selector);
  if (node != null) group.URL = node.href.replace(/\&torrentid=\d+\b/, '');
  if (/\btorrentid=(\d+)\b/i.test(node.search)) group.tid = parseInt(RegExp.$1);
  group.node = tr;
  groups.push(group);
}
