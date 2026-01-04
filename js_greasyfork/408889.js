// ==UserScript==
// @name         Hunsearch sorter
// @namespace    com.spudpro
// @version      1.0
// @description  Re-arrange thehun.net search pages into descending date order.
// @author       You
// @match        https://thehun.net/search/*
// @match        http://search.thehun.net/galleries/*
// @match        http://thehun.net/search/*
// @match        https://search.thehun.net/galleries/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408889/Hunsearch%20sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/408889/Hunsearch%20sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';
var elements = []
var collection = []

//Adjust this to filer out certain terms
var exclusionFilter = /(ladyboy|shemale|transsexual|gay)/i

function append(collection){
	for( var i = 0; i < collection.length; i++){
		collection.push(collection[i]);
	}
}

function rm(element){
	element.parentNode.removeChild(element)
}

function rmAll(elements){
	for(var i = elements.length-1; i >= 0; i--){
		rm(elements[i])
	}
}

function nextPage(numPages){
	console.log('scrolling '+numPages);
	if(numPages > 0){
		numPages--;
		window.scrollTo(0, document.body.scrollHeight);
		console.log('now have '+document.getElementsByClassName('hun-link').length+' links')
		append(document.getElementsByClassName('listing'));
		setTimeout(
			function(){
				nextPage(numPages);
			}
			,2000);
	}else{
		console.log('finished with '+document.getElementsByClassName('hun-link').length+'links')

    var collection = document.getElementsByClassName('cube-wrapper')
		console.log("Found "+collection.length+" ads")

		rmAll(collection)

		collection = document.getElementsByClassName('hun-link')
		elements = []

		console.log("Found "+collection.length+" listings")

		for( var i = 0; i < collection.length; i++){
			if( collection[i].innerHTML.match(exclusionFilter) == null
			 && collection[i].getElementsByTagName('ad').length == 0){
				elements.push(collection[i]);
			}else{
				console.log('filtering based on '+collection[i].innerHTML.match(exclusionFilter))
			}
		}

		rmAll(collection)

		console.log("Kept "+elements.length)
		console.log('sorting');
		elements.sort(function(a, b){
			var keyA = a.getElementsByClassName('date')[0].innerHTML;
			var keyB = b.getElementsByClassName('date')[0].innerHTML;
			if(keyA > keyB){
				return 1;
			}
			if(keyA < keyB){
				return -1;
			}
			return 0;
		});

		/*for( var i = 0; i < elements.length; i++){
			console.log(i+": "+elements[i].getElementsByTagName('ad').length)
			console.log(i+": "+elements[i].getElementsByClassName('date')[0].innerHTML)
		}*/
		console.log('sorted');

		var parents = document.getElementsByClassName('hun-link-wrapper')

		var j = 0;
		for(i = elements.length-1; i >= 0; i--){
			parents[j].appendChild(elements[i]);
			j++;
		}
		window.scrollTo(0,0)
		alert('Done!')
	}
}

rm(document.getElementsByTagName('nav')[0])
nextPage(20);
})();