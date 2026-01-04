// ==UserScript==
// @name         favorite artists - nHentai
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Add artists to a favorite list
// @author       lifeAnime / Yhria
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444865/favorite%20artists%20-%20nHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/444865/favorite%20artists%20-%20nHentai.meta.js
// ==/UserScript==

function replacer(key, value) {
	if(value instanceof Map) {
	  return {
		dataType: 'Map',
		value: Array.from(value.entries()), // or with spread: value: [...value]
	  };
	} else {
	  return value;
	}
}

function reviver(key, value) {
	if(typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
	  }
	}
	return value;
}

/**
 * Convert a template string into HTML DOM nodes
 * @param  {String} str The template string
 * @return {Node}       The template HTML
 */
 var stringToHTML = function (str) {
	var dom = document.createElement('div');
	dom.innerHTML = str;
	return dom;
};

function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

function r1(){ // build favorite icon if we are on main page of a doujin
    for (let element of document.querySelectorAll('div.tag-container.field-name:not(.hidden)')){
        if (element.textContent.includes("Artists:")){
			for (let tag_element of element.getElementsByClassName("tag ")){
            	r1_handle_favorite("create", tag_element, tag_element.getElementsByClassName("name")[0].textContent)
			}
        }
    }
}

function edit_list(favorite_artists, artists_thumbnail){
	if (favorite_artists != null)
		localStorage.setItem("favoriteArtists", JSON.stringify(favorite_artists)); // sync new favorite list
	localStorage.setItem("artistsThumbnail", JSON.stringify(artists_thumbnail, replacer)); // sync new artist thumbnail list
	console.log("list synchronized")
}

async function fetch_artist_thumbnail(artist_name, artists_thumbnail){
	await fetch("https://nhentai.net/artist/" + artist_name.replace(/\s/g, '-') +"/popular", {
	"headers": {
		"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		"cache-control": "no-cache",
		"pragma": "no-cache",
		"sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "document",
		"sec-fetch-mode": "navigate",
		"sec-fetch-site": "same-origin",
		"sec-fetch-user": "?1",
		"upgrade-insecure-requests": "1"
	},
	"referrerPolicy": "same-origin",
	"body": null,
	"method": "GET",
	"mode": "cors",
	"credentials": "include"
	}).then(response=>response.text())
	.then(data=>{
		rgx = /https:\/\/t[0-9]{1}\.nhentai\.net\/galleries\/[0-9]{1,8}\/thumb\.jpg/
		res = data.match(rgx)[0]
		console.log(res)
		artists_thumbnail.set(artist_name, data.match(rgx)[0]) // retrieve a thumbnail for that artist
		edit_list(null, artists_thumbnail)
	})
}

function favorite_add_remove(artist_name){
	let favorite_artists = JSON.parse(localStorage.getItem("favoriteArtists")) || []
	let artists_thumbnail = JSON.parse(localStorage.getItem("artistsThumbnail"), reviver) || new Map()

	if (favorite_artists.indexOf(artist_name) < 0) { // add
		favorite_artists.push(artist_name);
		fetch_artist_thumbnail(artist_name, artists_thumbnail) // retrieve a thumbnail for that artist
		console.log("artist " + artist_name + " added.")
	}
	else if (favorite_artists.indexOf(artist_name) > -1){ // remove
		favorite_artists.splice(favorite_artists.indexOf(artist_name), 1)
		artists_thumbnail.delete(artist_name)
		console.log("artist " + artist_name + " removed.")
	}
	edit_list(favorite_artists, artists_thumbnail)
}

function r1_onclick(artist_name, tag_element){
	console.log("clicked!")
	result = favorite_add_remove(artist_name)
	r1_handle_favorite("clicked", tag_element, artist_name)
}

function r1_handle_favorite(mode, tag_element, artist_name){ // handle the favorite button
	let favorite_button = `<i class="far fa-heart favoriteArtistButton ` + artist_name + `" style="color: #ed2553; cursor: pointer;"></i>` // fav button html code
	let favorite_artists = JSON.parse(localStorage.getItem("favoriteArtists")) || [] // get favorite artists list from local storage

	console.log("enter function")
	if (mode == "create"){
		console.log("enter 'create'")
        tag_element.outerHTML += favorite_button
		document.getElementsByClassName("favoriteArtistButton " + artist_name)[0].addEventListener("click", function(){r1_onclick(artist_name, tag_element)}); // add artist if button is clicked, or remove it if already added
    }
	if (favorite_artists.includes(artist_name) == true){
		document.getElementsByClassName("favoriteArtistButton " + artist_name)[0].className = "fa fa-heart favoriteArtistButton " + artist_name // make heart full to indicate artist is now added to favorite list
	}
	else {
		document.getElementsByClassName("favoriteArtistButton " + artist_name)[0].className = "far fa-heart favoriteArtistButton " + artist_name // make heart empty  to indicate artist is now removed from favorite list
	}
	console.log("button updated")
}

function r2_onundoclick(artist_name){
	let workspace = document.querySelectorAll('[artist-name="'+ artist_name +'"]')[0];

	favorite_add_remove(artist_name)
	workspace.classList.toggle("removed")
	workspace.getElementsByClassName("special-remove")[0].outerHTML = `
	<div onclick="r2_onremoveclick('`+ artist_name +`')" class="btn btn-primary btn-thin special-remove"><i class="fa fa-minus"></i>
					&nbsp;
					<span class="text">Remove</span></div>
	`
}

window.r2_onundoclick = r2_onundoclick;

function r2_onremoveclick(artist_name){
	let workspace = document.querySelectorAll('[artist-name="'+artist_name+'"]')[0];

	favorite_add_remove(artist_name)
	workspace.classList.toggle("removed")
	workspace.getElementsByClassName("special-remove")[0].outerHTML = `
	<button onclick="r2_onundoclick(('`+ artist_name +`'))" class="btn btn-primary btn-thin special-remove" type="button"><i class="fa fa-undo"></i>
	&nbsp;
	<span class="text">Undo</span></button>
	`
}

window.r2_onremoveclick = r2_onremoveclick;

async function r2_onclick(){
	let workspace = document.getElementById("favcontainer")
	let favorite_artists = JSON.parse(localStorage.getItem("favoriteArtists")) || [] // get favorite artists list from local storage
	let artists_thumbnail = JSON.parse(localStorage.getItem("artistsThumbnail"), reviver) || new Map()

	document.getElementsByClassName("pagination")[0].classList.toggle("hidden")
	document.getElementById("displayFavoriteArtists").outerHTML = `<button onclick="location.href='/favorites';" id="returnToFavorites" class="btn" type="button" style="background-color: #c16f81;"><i class="fa fa-star"></i><span class="text">Favorite Doujins ?</span></button>`
	workspace.innerHTML = ""
	for (let artist of favorite_artists){
		if (artists_thumbnail.get(artist) == undefined || artists_thumbnail.get(artist) == null){
			console.log("thumbnail missing, fetching a new one")
			await fetch_artist_thumbnail(artist, artists_thumbnail)
			artists_thumbnail = JSON.parse(localStorage.getItem("artistsThumbnail"), reviver)
			console.log(artists_thumbnail.get(artist))
		}
		workspace.innerHTML += `
		<div class="gallery-favorite" artist-name="`+ artist +`">
		<div onclick="r2_onremoveclick('`+ artist +`')" class="btn btn-primary btn-thin special-remove"><i class="fa fa-minus"></i>
					&nbsp;
					<span class="text">Remove</span></div>
		<div class="gallery">
		<a href="/artist/`+ artist.replace(/\s/g, '-') + `/" class="cover" style="/* position: absolute; */">
		   <img class="lazyload" width="250" height="353" data-src="`+ artists_thumbnail.get(artist) +`" src="`+ artists_thumbnail.get(artist) +`" style="position: unset;">
		   <noscript><img src="`+ artists_thumbnail.get(artist) +`" width="250" height="353"  /></noscript>
		   <div class="caption">`+artist+`</div>
		</a>
	 </div>
	 </div>
	 `
	}
}

function r2(){ // When on favorite page
	let element = document.getElementById("favorites-random-button")
	let display_favorite_artists = `<button id="displayFavoriteArtists" class="btn" type="button" style="background-color: #df964a;"><i class="fa fa-star"></i><span class="text">Favorite Artists ?</span></button>`

	insertAfter(element, stringToHTML(display_favorite_artists).children[0]) // insert button to display favorite artists
	document.getElementById("displayFavoriteArtists").addEventListener("click", function(){r2_onclick()}); // add artist if button is clicked, or remove it if already added
}

(function() {
    'use strict';

    let url = window.location.href
    let reg_url_1 = /https:\/\/nhentai\.net\/g\/[0-9]*\/$/
	let reg_url_2 = /https:\/\/nhentai\.net\/favorites\/$/
    if (reg_url_1.test(url) == true){
        r1()
    }
	else if (reg_url_2.test(url) == true){
        r2()
    }
})();