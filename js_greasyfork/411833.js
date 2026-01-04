// ==UserScript==
// @name Shikimori Live v2.1e
// @name:en Shikimori Live v2.1 [Watch Anime Online]
// @name:zh-CN 《是克摸日 Live》现场动漫
// @name:ru Shikimori Live v2.1
// @description Мини-расширение проекта Shikimori Live. Возвращает кнопку «Смотреть онлайн» на странице аниме на Shikimori.one. Перезалив
// @description:zh-CN 该脚本返回Shikimori.one上的“在线观看”按钮
// @description:en Userscript of the Shikimori Live project. Returns the "Watch Online" button in the anime page on the Shikimori.one site.
// @version  6.2
// @author   Minat0_, JuniorDEV, masgasatriawirawan
// @icon https://sosoyuh777.github.io/slive/ext-logoSmall.png
// @match  *://shikimori.one/*
// @match  *://shikimori.org/*
// @match *://*.shikimorilive.top/*
// @match *://shikimorilive.test/*
// @include  *://shikimori.one/*
// @include  *://shikimori.org/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @grant    none
// @namespace https://greasyfork.org/users/689944
// @downloadURL https://update.greasyfork.org/scripts/411833/Shikimori%20Live%20v21e.user.js
// @updateURL https://update.greasyfork.org/scripts/411833/Shikimori%20Live%20v21e.meta.js
// ==/UserScript==

if (window.jQuery) {
	$(function(){
	let currentURL = window.location.href;
  
	if (currentURL.split("/")[3] === "animes" && (currentURL.split("/")[3] !== "" || document.readyState === "complete")) {
		setTimeout(addButton, 1000);
	}

	let observer = new MutationObserver(mutationRecords => {
  		mutationRecords.forEach(mutation => {
      		for(let node of mutation.addedNodes) {
        		if (!(node instanceof HTMLElement)) continue;

        		if (currentURL !== window.location.href) {
        			currentURL = window.location.href;
              		$(document).ready(function() {
        				if (currentURL.split("/")[3] !== "" && currentURL.split("/")[3] === "animes" && document.readyState === "complete") {
        					setTimeout(addButton, 1000);
        				}
              		});
        		}
        	}
    	});
  	});

  	observer.observe(window.document, {
  		childList: true, 
  		subtree: true,
  		characterDataOldValue: false
	});
	
	function addButton(type="play") {
    
		let AnimeID = window.location.pathname.split("/")[2].split('-')[0],
      button = document.createElement("div"),
      a = document.createElement("a"), 
      icon = document.createElement("span");

    	$(icon).css({
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "width": "20%",
        "height": "100%",
        "background-color": "#252525",
        "border-radius": "5px 0 0 5px",
      });
    
    	$(a).css({
        "color": "white",
        "text-align": "center",
        "width": "80%"
      });
    
			button.appendChild(icon);
    	button.appendChild(a);
    
    	$(button).css({
        "display": "flex",
        "align-items": "center",
        "margin": "1em auto",
        "height": "35px",
        "max-width": "200px",
        "max-height": "45px",
        "background-color": "#2E2E2E",
        "border-radius": "5px"
      });
    
    	$(button).addClass("slPlayFreePlayButton");
    	
    	if ($('.b-anime_status_tag').first().hasClass("released")) {
       	$(icon).html("&#9658;");
        
        $(a).text("Смотреть онлайн");
        a.href = "https://live.shikimorilive.top/online/" + AnimeID + "/1";

      } else {
        $(icon).html("&#10006;"); 
        $(icon).css("background-color","#c0392b");
        
        $(a).text("Аниме ещё не вышло");
        
        $(button).css({
          "cursor": "not-allowed",     
          "background-color": "#e74c3c"
        });
      }
    
  		$(".c-info-right").append(button);
	}
	});
} else console.log("%c" + "[SLive] Ошибка с загрузкой jQuery, пожалуйста обратитесь к нам в группу: https://vk.com/shikimarilive","color: red; font-size: x-large");