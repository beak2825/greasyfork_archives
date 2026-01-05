// ==UserScript==
// @name         SiG Poster View
// @namespace    SoItGoes
// @version      0.25
// @description  Create movie posters view on Movies & TV page
// @author       cykage
// @match        https://intotheinter.net/?c=Movies*
// @match        https://intotheinter.net/?c=TV*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/25206/SiG%20Poster%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/25206/SiG%20Poster%20View.meta.js
// ==/UserScript==

(function() {
    'use strict';
	//add toggle to middle bar
	var toggle = document.createElement('div');
	toggle.style.display = "inline-block";
	toggle.innerHTML = '<a><button id="poster-button">Poster Mode</button></a>';

	var middlebar = document.querySelector('#middlebar');
	var rightButtons = middlebar.childNodes[4];
	middlebar.insertBefore(toggle, rightButtons);
	
	
	if (GM_getValue('postersEnabled') === undefined) {
		GM_setValue('postersEnabled', false);
	} else if (GM_getValue('postersEnabled') === true) {
		document.querySelector('#poster-button').setAttribute('style', 'color: white !important');
		showPosters();
	}
	
	
	toggle.addEventListener('click', function() {
		if (!GM_getValue('postersEnabled')) {
			showPosters();
			GM_setValue('postersEnabled', true);
			document.querySelector('#poster-button').setAttribute('style', 'color: white !important');
		} else {
			//remove posters, bring back table
			document.querySelector('#poster-container').remove();
			document.querySelector('#links').style.display='block';
			document.querySelector('#poster-button').setAttribute('style', 'color: black !important');
			GM_setValue('postersEnabled', false);
		}
	});
	


	function showPosters(addedLinks=0) {
		//if Load More is clicked, addedLinks will be the list of the new links
		var posters = [];
		var links = document.querySelector('#links');
		var media;
		if (document.querySelectorAll('.row.Movies').length > 0) {
			media = addedLinks || document.querySelectorAll('.row.Movies');
		} else if (document.querySelectorAll('.row.TV')) {
			media = addedLinks || document.querySelectorAll('.row.TV');
		}


		if (addedLinks || document.querySelectorAll('.row.Movies'));
		if (media.length<1) {
			media = addedLinks || document.querySelectorAll('.row.TV');
		}

		for (var m of media) {
			var img = m.querySelector('img');
			var resTags = m.querySelector('.tags').innerText;
			var sigLink = m.querySelectorAll('a')[1].href;
			var tv_ep;
			if (document.querySelectorAll('.row.TV').length>1) {
				console.log(m.childNodes[1].innerText);
				var ep_text = m.childNodes[1].innerText;

				if (ep_text.match(/([sS]\d\d[eE]\d\d)/) !== null) {
					tv_ep = ep_text.match(/([sS]\d\d[eE]\d\d)/)[0];
				} else if(ep_text.match(/([sS]eason \d\d)/) !== null) {
					tv_ep = ep_text.match(/([sS]eason \d\d)/)[0];
				} else if (ep_text.match(/([sS]eason \d)/) !== null) {
					tv_ep = ep_text.match(/([sS]eason \d)/)[0];
				} else {
					tv_ep = '';
				}
				
			}
			if (img) {
				var src = img.src;
				var res;
				
				if ( resTags.includes('720P') ) {
					res = '720P';
				} else if ( resTags.includes('1080P') ) {
					res = '1080P';
				} else if ( resTags.includes('UHD') || resTags.includes('4K') || resTags.includes('2160p')) {
					res = 'UDH/4K';
				} else if ( resTags.includes('SD') || resTags.includes('480P')) {
					res = '480P';
				} else {
					res = '';
				}
				posters.push( {'src': src, 'res': res, 'link': sigLink, 'tv_ep': tv_ep} );
			}
		}
		
		//hide link table, create container and posters
		links.style.display = 'none';

		var posterContainer = document.createElement('div');
		posterContainer.setAttribute('id', 'poster-container');
		posterContainer.setAttribute('style','display:flex; justify-content: space-around; -webkit-flex-flow: row wrap');
		posterContainer.setAttribute('class', 'sixteen columns');
		
		var mainContainer = document.querySelector('#mainpage');
		
		if (addedLinks === 0) {
			//if Load More wasn't clicked, create new container
			mainContainer.insertBefore(posterContainer, links);
			
		} else {
			//if Load More was clicked, use existing container
			posterContainer = document.querySelector('#poster-container');
		}

		for (var poster of posters) {
			var posterImg = document.createElement('div');

			posterImg.innerHTML = (`
			<div style="padding:10px; position: relative">
				<a href="${poster.link}"><img style="width: 100%" src="${poster.src}" /></a>
				<span style="
					position: absolute; 
					top: 10px; 
					left: 10px;  
					color: white !important; 
					font: bold 11px/16px Helvetica, Sans-Serif; 
					letter-spacing: -1px;  
					background: rgb(0, 0, 0); /* fallback color */
					background: rgba(0, 0, 0, 0.4);
					padding: 3px; ">
					${poster.res}
				</span>
			</div>`);
			
			
			if (document.querySelectorAll('.row.TV').length > 1) {
				posterImg.innerHTML = (`
				<div style="padding:10px; position: relative">
					<a href="${poster.link}"><img style="width: 100%" src="${poster.src}" /></a>
					<span style="
						position: absolute; 
						top: 10px; 
						left: 10px;  
						color: white !important; 
						font: bold 11px/16px Helvetica, Sans-Serif; 
						letter-spacing: -1px;  
						background: rgb(0, 0, 0); /* fallback color */
						background: rgba(0, 0, 0, 0.4);
						padding: 3px; ">
						${poster.res}
					</span>
					<span style="
						position: absolute; 
						top: 10px; 
						right: 10px;  
						color: white !important; 
						font: bold 11px/16px Helvetica, Sans-Serif; 
						letter-spacing: 0px;  
						background: rgb(0, 0, 0); /* fallback color */
						background: rgba(0, 0, 0, 0.4);
						padding: 3px; ">
						${poster.tv_ep}
					</span>
				</div>`);
			}
			posterImg.style.width = "150px";
			posterContainer.appendChild(posterImg);
		}
	}
	
	//watch for new links added with Load More and add new divs to poster container
    var linkTable = document.querySelector('#links');
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
			if (GM_getValue('postersEnabled')) {
				showPosters(mutation.addedNodes);
			}
        });
    });

    observer.observe(linkTable, {childList: true });


})();