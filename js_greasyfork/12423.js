// ==UserScript==
// @name         Wikitube - YouTube on Wikipedia & Wikiwand
// @namespace    WYOWW
// @version      4.0
// @description  Adds relevant YouTube videos to Wikipedia and Wikiwand.
// @include      http*://*.wikipedia.org/wiki*
// @include      http*://www.wikiwand.com/*/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @author       drhouse
// @developer    Mark Dunne | http://markdunne.github.io/ | https://chrome.google.com/webstore/detail/wikitube/aneddidibfifdpbeppmpoackniodpekj
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=wikipedia.com
// @downloadURL https://update.greasyfork.org/scripts/12423/Wikitube%20-%20YouTube%20on%20Wikipedia%20%20Wikiwand.user.js
// @updateURL https://update.greasyfork.org/scripts/12423/Wikitube%20-%20YouTube%20on%20Wikipedia%20%20Wikiwand.meta.js
// ==/UserScript==
 
$(document).ready(function () {
 
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
 
	addGlobalStyle('#wikitube_container { padding-bottom: 2px;margin-bottom: 5px;border-bottom: 1px solid #aaa; overflow-x:hidden; overflow-y:hidden; white-space: nowrap; margin-top: -10px;}');
	addGlobalStyle('#wikitube_container:hover {	overflow-x:scroll; }');
	addGlobalStyle('#wikitube_container div {width: auto; height: 200px; margin-right: 5px; display: inline-block; box-shadow: 0 0 5px #888; }');
	addGlobalStyle('#wikitube_container .plusBtn {	width: 100px;	text-align: center;	border-radius: 5px;	background-color: rgb(192, 62, 62);	background-position: center;	background-repeat: no-repeat;	cursor: pointer;}');
	addGlobalStyle('#wikitube_container .plusBtn:hover { background-color: rgb(192, 92, 92); }');
 
	var allow_path = function(path){
		var banned_paths = [
			//landing pages
			'/wiki/Main_Page',
			'/wiki/Wikipedia:Portada',
			'/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
			'/wiki/Wikip%C3%A9dia:Accueil_principal',
			'/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal',
			'/wiki/Wikipedia:%E9%A6%96%E9%A1%B5',
			'/wiki/Wikipedia:Strona_g%C5%82%C3%B3wna',
			'/wiki/Pagina_principale',
			'/wiki/Wikipedia:Hauptseite',
			'/wiki/%D0%97%D0%B0%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F_%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D0%B0'
		];
		for (var i = 0; i < banned_paths.length; i++) {
			if(path == banned_paths[i]){
				return false;
			}
		}
		if (path.indexOf(':') != -1) {
			//portals, users, categories
			return false;
		}
		return true;
	}
 
	var title_text;
	var num_videos_to_load;
	var num_videos_loaded = 0;
	var more_videos_button = $('<div class="plusBtn" title="Load more videos!"></div>'); 
	var container = $('<div id="wikitube_container"></div>');
 
	var first_load = function(){
		if( $('#mw-content-text').length )         //wikipedia  
		{
			container.insertBefore('#mw-content-text');
		}
		if( $('#fullContent').length )         //wikiwand
		{
			container.insertBefore('#fullContent');
		}
 
		container.append(more_videos_button);
		
		var plusImgURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtv\
UhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcA\
YCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ\
5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X\
48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL'+'/'+'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\
Th0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fy\
nQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAMZQTFRFERER////ERERE\
RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER\
ERERERERERERERERERERERERERERERERERERERERERERlvLzngAAAEF0Uk5TAAABAgMEBQYHCAkKCwwNDg8QEhUXGBkaHR4gISMkJSYpKy4xMjM0Nzg7PUFGR0hNZWZnr7fHyNrb5ufo8vP19v4deCuTAAACGklEQVRYw+2XWXOiQBSFnV6jgmy2gqC4oSgGY3RMJjEL//9PxQAd\
DTFTtD0PTlXO65WvKLvv4ZzKL0lVLgJQOS0AIMKEEIwgAKd/8jcAgJhWFU03dE2pUQyBIAAgWtetltNxO07L0usUASEAQFcNy/aHk2k4nQx922pcnSJ8C9g/r7Hu6GZ995Q83a1Xoy7TThG+BxC16cfbhOt37DdVIgCAVdNdPCQH/Vm4ZhWWByCFDTbJsTYDpqDyAKzZwcsnwEtga\
7g8gBhumHxW6BqkPICa3qwAmHkmFQH05gXAvPcDuHxAZj80l8r6UQEQ9ZmaTw8edQAARPb2Y5i5mBfEBUAceCyfGppSJelyfwD2+6+azHa9XqZ+EC0LgGUU9LOh59rMVFN74IB3/2i6gyCczTNF8fILYBlH2XAWBgO3mRoMB0DaYP5i85yU1PNm4bMGhRwAcN3qXj8mAnq87lp1DDi\
A6s5omwhpO7J1ygGwZvmrRFAr36rBHICU1nAtClgPWwrKAVhzJveigPuJo+EcQPTOdCcK2E07OuGAvQO+igJe303yX72B9H+AlPY5p9D+OIWz7sHt0T047yY6h5uY7kIssQt8G0ufxK6wjdwPxmX9YFz0A2lHkvdEeVf++bRdJEAyZEnHvK9BczcWCprSUTcN28cG8SAYtotxfysa9/\
PCsTq7cEhXHl662meXrqz21SRqn1Dx/M/L9xutmnjEud3T6wAAAABJRU5ErkJggg==';
		
		more_videos_button.css('background-image', 'url(' + plusImgURL + ')');
 
		more_videos_button.click(function(){
			load_new_videos(false);
		});
	}
 
	var load_new_videos = function(is_first_load){
		var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+title_text+'&key=AIzaSyAvOc6qi9lUkM8eSoH1To3zCFF0X4hNf0Y&maxResults='+(num_videos_loaded+num_videos_to_load);
		$.getJSON(url, function(response){
			if(response['items'].length > 0){
				if (is_first_load) {
					first_load();
				}
				var new_videos = videos = response['items'];
				new_videos = new_videos.slice(num_videos_loaded);
				num_videos_loaded += num_videos_to_load;
				add_videos_to_page(new_videos);
			}
		});
	}
 
	var add_videos_to_page = function(new_videos){
		for (var i = 0; i < new_videos.length; i++) {
			video = new_videos[i];
			var videoHtml = '<div><iframe width="350" height="200" frameborder="0" allowfullscreen src="//www.youtube.com/embed/'+video['id']['videoId']+'"></iframe></div>';
			more_videos_button.before(videoHtml);
		};
	}
 
	var test_func = function(){
		url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=memes&key=AIzaSyAvOc6qi9lUkM8eSoH1To3zCFF0X4hNf0Y';
		$.getJSON(url, function(response){
			console.log(response);
		})
	}
 
	$(document).ready(function(){
		if(allow_path(window.location.pathname)){
 
			if( $('#mw-content-text').length )       //wikipedia  
			{
				title_text = document.getElementById('firstHeading').innerText;
				num_videos_to_load = Math.floor($('#bodyContent').width() / 350); //video width = 350px
			}
			if( $('#fullContent').length )         //wikiwand
			{
				title_text = $('.firstHeading > span').text();
				num_videos_to_load = Math.floor($('#article_content_wrapper').width() / 350); //video width = 350px
			}
			load_new_videos(true);
		}
	});
 
});