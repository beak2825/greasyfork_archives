// ==UserScript==
// @name Game Tags
// @namespace http://breadlord.org/rblx/main/
// @version	1.0.0
// @description Applies tags to ROBLOX games based upon an external server and modifies the genre of the game.
// @author Stelonlevo
// @match *://www.roblox.com/games/*
// @grant none
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377899/Game%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/377899/Game%20Tags.meta.js
// ==/UserScript==

String.prototype.capitalize = function() { //Converts first letter to a capital
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function applyTags() {
	var string  = window.location.pathname.split('/'); //Get game id
	var id = string[2] 
	var url = 'https://breadlord.org/rblx/main/'+id+'.json'; //Fetch game info.

	fetch(url, {
		method: 'get',
		redirect: 'follow',
		referrer: 'http://roblox.com/tag-api'
	}).then(function(response) {
		return response.json(); //Parse to JSON
	}).then(function (data) {
		var div = document.createElement('div'); //Make the tag container and style it
		div.id = 'tag-box';
		div.setAttribute('style', 'overflow: auto;'); 
		data.tags.forEach(function(tag) {
			var tagE = document.createElement('p'); //Make each tag
			tagE.id = tag
			tagE.textContent = tag
			tagE.setAttribute('style', 'color: #fff; background-color: #32B5FF; float: left; margin: .1em;font-size: .8em;border-radius: .2em;padding-top: .1em;padding-left: .2em;padding-right: .2em;')
			div.appendChild(tagE)
		});
		var genrebutton = $("p:contains('Genre')").parent().find('.text-lead').find('a')[0]; //Find and modify the genre button
		genrebutton.innerHTML = data.genre.capitalize();
		genrebutton.setAttribute('href', 'https://breadlord.org/rblx/genre/'+data.genre);
		document.getElementsByClassName('game-title-container')[0].appendChild(div); //Attach it all
	});
}

$(applyTags()) //Apply after page load