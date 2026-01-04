// ==UserScript==
// @name        FIMFiction - hide anthro & EqG.
// @description  Hide stories that have tags "Anthro" or "Equestria Girls" or any other tag specified in settings
// @namespace   anonymous
// @include     http*://*.fimfiction.net/*
// @version     0.35
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34073/FIMFiction%20-%20hide%20anthro%20%20EqG.user.js
// @updateURL https://update.greasyfork.org/scripts/34073/FIMFiction%20-%20hide%20anthro%20%20EqG.meta.js
// ==/UserScript==

// Blocked tags for card view & full view
var blocked = ["anthro", "equestria_girls", "equestria-girls",
		"flash-sentry", "main-7-eqg", "twilight-sparkle-eqg", "rarity-eqg", "rainbow-dash-eqg", "fluttershy-eqg", "applejack-eqg", "pinkie-pie-eqg",
		"adagio-dazzle", "sonata-dusk", "aria-blaze", "the-dazzlings", "spike-eqg", "shadowbolts-eqg", "vice-principal-luna", "principal-celestia"];

// Blocked folder names for groups in personal feed
var folders = ["Anthro", "Anthropomorphic", "Vore"];

// Blocked author names for groups in personal feed
var authors = []

function hideStory(stories, hide_parent) {
	for(var i = 0; i < stories.length; i++)
	{
		var tags = stories[i].querySelectorAll('.story-tags > li > a, .story-card__tags > li > a');
		for(var n = 0; n < tags.length; n++)
		{
			blocked.forEach(function(blockedtag) {
				if ((tags[n].dataset.tag == blockedtag)||(tags[n].className == blockedtag)) {
					stories[i].style.display = 'none';
          if (hide_parent) stories[i].parentNode.style.display = 'none';
				}
			});
		}
	}
}

function hideFeed(stories) {
	for(var i = 0; i < stories.length; i++)
	{
		var folderNames = stories[i].querySelectorAll('.group_stories > li > a');
		for(var n = 0; n < folderNames.length; n++)
		{
			folders.forEach(function(blockedfolder) {
				if (folderNames[n].textContent == blockedfolder) {
          stories[i].style.display = 'none';
        }
			});
		}
    var authorNames = stories[i].querySelectorAll('.group_stories > li > ul > li > a[href^="/user"]');
		for(var n = 0; n < authorNames.length; n++)
		{
			authors.forEach(function(blockedauthor) {
				if (authorNames[n].textContent == blockedauthor) {
          stories[i].style.opacity = '.5';
        }
			});
		}
	}
}

var storycards = document.getElementsByClassName('story-card-container');
hideStory(storycards, true);
var stories = document.getElementsByClassName('story_container');
hideStory(stories);

var group_feed = document.getElementsByClassName('feed_group_item');
hideFeed(group_feed);