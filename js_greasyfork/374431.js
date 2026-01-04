// ==UserScript==
// @name         Wikitube - YouTube on Wikipedia & 百度百科
// @name:zh-CN   Wikitube - YouTube on 维基百科 & 百度百科
// @name:zh-TW   Wikitube - YouTube on 維基百科 & 百度百科
// @namespace    WYOWW
// @version      3.3.10
// @description  Adds relevant YouTube videos to Wikipedia & 百度百科
// @description:zh-cn  Adds relevant YouTube videos to 维基百科 & 百度百科
// @description:zh-TW  Adds relevant YouTube videos to 維基百科 & 百度百科
// @include      http*://*.wikipedia.org/wiki*
// @include      http*://baike.baidu.com/item/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author       Mark Dunne | http://markdunne.github.io/ | https://chrome.google.com/webstore/detail/wikitube/aneddidibfifdpbeppmpoackniodpekj
// @developer    vinc, drhouse
// @icon         https://en.wikipedia.org/static/favicon/wikipedia.ico
// @downloadURL https://update.greasyfork.org/scripts/374431/Wikitube%20-%20YouTube%20on%20Wikipedia%20%20%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/374431/Wikitube%20-%20YouTube%20on%20Wikipedia%20%20%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

$(document).ready(function () {

    const YOUTUBE_DATA_API_CREDENTIAL_1 = 'AIzaSyCMR8K-6fANDUBdlbHxFAo57mmlfAnPVFw';

    // pages of wikipedia which should disable Wikitube
    var banned_paths = [
        '/wiki/Main_Page',
		];
    var banned_paths_prefix = [
        '/wiki/Help:',
        '/wiki/Wikipedia:',
        '/wiki/User:',
        '/wiki/Special:'
    ];

	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}

	addGlobalStyle('#wikitube_container { padding-bottom: 30px; overflow-y:hidden; white-space: nowrap; }');
	addGlobalStyle('#wikitube_container::-webkit-scrollbar { width: 0px; background: transparent; }');
	addGlobalStyle('#wikitube_container div { width: auto; height: 200px; margin-right: 5px; display: inline-block; box-shadow: 0 0 5px #888; }');
	addGlobalStyle('#wikitube_container .plusBtn { width: 100px;	text-align: center;	border-radius: 5px;	background-color: rgb(192, 62, 62);	background-position: center;	background-repeat: no-repeat;	cursor: pointer;}');
	addGlobalStyle('#wikitube_container .plusBtn:hover { background-color: rgb(192, 92, 92); }');

	var allow_path = function(path){
        console.log(path);
        for (var i = 0; i < banned_paths_prefix.length; i++){
			if(path.startsWith(banned_paths_prefix[i])){
               return false;
            }
        }
		for (var i = 0; i < banned_paths.length; i++) {
            if(path == banned_paths[i]){
				return false;
            }
		}
		return true;
	}

	var title_text;
	var num_videos_to_load;
	var num_videos_loaded = 0;
	var more_videos_button = $('<div class="plusBtn" title="Load more videos!"></div>');
	var container = $('<div id="wikitube_container"></div>');

	var first_load = function(){
        if( $('#mw-content-text').length ){ // wikipedia
            container.insertBefore('#mw-content-text');
        }else if( $('.main-content').length ){ // 百度百科
            container.insertBefore('.main-content');
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

        $('iframe').ready(function(){
            vinc_set_horiz_scroll();
        });
	}

	var load_new_videos = function(is_first_load){
		var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q='+title_text+'&key=' + YOUTUBE_DATA_API_CREDENTIAL_1 + '&maxResults='+(num_videos_loaded+num_videos_to_load);
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
			var videoHtml = '<div class="vinc_yt"><iframe width="350" height="200" frameborder="0" allowfullscreen src="//www.youtube.com/embed/'+video['id']['videoId']+'"></iframe></div>';
			more_videos_button.before(videoHtml);
		};
	}

	var test_func = function(){
		url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=memes&key=' + YOUTUBE_DATA_API_CREDENTIAL_1;
		$.getJSON(url, function(response){
			console.log(response);
		})
	}

    var vinc_set_horiz_scroll = function(){
        $('#wikitube_container').on('mousewheel DOMMouseScroll', function(e){
            var delt = null;

            if (e.type == 'mousewheel') {
                delt = (e.originalEvent.wheelDelta * -1);
            }
            else if (e.type == 'DOMMouseScroll') {
                delt = 40 * e.originalEvent.detail;
            }

            if (delt) {
                e.preventDefault();
                $(this).scrollLeft(delt + $(this).scrollLeft());
            }
        });
    }

    // main code
    if(allow_path(window.location.pathname)){
        if( $('#mw-content-text').length ){ // wikipedia

            // title_text = document.getElementById('firstHeading').innerText;
            title_text = $("#firstHeading")[0].textContent;
            num_videos_to_load = Math.floor($('#bodyContent').width() / 350) + 1; //video width = 350px

            // append a youtube link icon after title
            var search_url = "https://www.youtube.com/results?search_query=" + title_text;
            var youtube_icon_url = "data:image/png;base64,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"
            $("#firstHeading").append(" &nbsp;<a href='" + search_url + "' target='_blank'><img height='17px' src='" + youtube_icon_url + "'></img></a>")

        }else if( $('.main-content').length ){ // 百度百科
             title_text = $(".lemmaWgt-lemmaTitle-title h1")[0].textContent;
            num_videos_to_load = Math.floor($('.body-wrapper .content-wrapper .content').width() / 350) + 1; //video width = 350px

        }
        load_new_videos(true);
    }

});
