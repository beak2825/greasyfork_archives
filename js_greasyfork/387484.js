// ==UserScript==
// @name        PTP Show Group Name
// @namespace   https://passthepopcorn.me/user.php?id=121003
// @include     https://passthepopcorn.me/torrents.php*
// @version     1.2.4
// @grant       none
// @description Shows release group name in the torrents list.
// @icon        https://ptpimg.me/732co1.png
// @downloadURL https://update.greasyfork.org/scripts/387484/PTP%20Show%20Group%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/387484/PTP%20Show%20Group%20Name.meta.js
// ==/UserScript==

(function() {
	const boldfont = true;
	const coloredfont = false;
	const groupnamecolor = '#ff00ff';

	const showblankgroups = false;
	const placeholder = 'NOGRP';

	const delimiter = ' / ';
	const blockedgroup = 'TBB';
	const moviesearchtitle = 'Browse Torrents ::';
	
	function formatText(str){
		var style = [];
		if(boldfont) style.push('font-weight:bold');
		if(coloredfont) style.push(`color:${groupnamecolor}`);
		return `<span style="${style.join(';')}">${str}</span>`;
	}
	
	function setGroupName(groupname, target){
		if(isEmptyOrBlockedGroup(groupname)){
			//Sometimes TBB releases have their group set to blank string (see /torrents.php?id=1412)
			//You can't rely on actual data-releasegroup/ReleaseGroup field
			if($(target).text().split(delimiter).includes(blockedgroup)){
				$(target).html(function(i, htmlsource){
					return htmlsource.replace(delimiter + blockedgroup, '');
				});
				groupname = blockedgroup;
			}
			//it's actually a release without group
			else if(showblankgroups){
				groupname = placeholder;
			}
		}
		if(!isEmpty(groupname)){
			return $(target).append(delimiter).append(formatText(groupname));
		}
	}
	
	//Covers undefined, null, blank and whitespace-only strings
	function isEmpty(str){
		return (!str || String(str).trim().length === 0);
	}
	//I can't even...
	function isEmptyOrBlockedGroup(str){
		return (isEmpty(str) || str === blockedgroup);
	}
	
	if(document.title.indexOf(moviesearchtitle) !== -1){
		var movies = PageData.Movies;
		var releases = [];
		movies.forEach(function(movie){
			movie.GroupingQualities.forEach(function(torrentgroup){
				torrentgroup.Torrents.forEach(function(torrent){
					releases[torrent.TorrentId] = torrent.ReleaseGroup;
				});
			});
		});

		if(PageData.ClosedGroups != 1){
			releases.forEach(function(groupname, index){
				$(`tbody a.torrent-info-link[href$="torrentid=${index}"]`).each(function(){
					setGroupName(groupname, this);
				});
			});
		}
		else{
			var targetNodes = $('tbody');
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			var myObserver = new MutationObserver(mutationHandler);
			var obsConfig = {childList: true, characterData: false, attributes: false, subtree: false};
			
			targetNodes.each(function (){
				myObserver.observe (this, obsConfig);
			});
			
			function mutationHandler (mutationRecords) {
				mutationRecords.forEach ( function (mutation) {
					if (mutation.addedNodes.length > 0) {
						$(mutation.addedNodes).find('a.torrent-info-link').each(function(){
							var mutatedtorrentid = this.href.match(/\btorrentid=(\d+)\b/)[1];
							var groupname = releases[mutatedtorrentid];
							setGroupName(groupname, this);
						});

					}
				});
			}

		}
	}
	else{
		$('table#torrent-table a.torrent-info-link').each(function(){
			var groupname = $(this).parent().parent().data('releasegroup');
			setGroupName(groupname, this);
		});
	}
})();