// ==UserScript==
// @name     Remove unwanted news
// @version  1.5
// @grant    none
// @namespace news_filtering
// @description This script helps you to filter out the news that you don't want to see. This example works for zeit.de, spiegel.de and watson.ch (popular swiss newssite)
// @license MIT
// @include        https://www.watson.ch/*
// @match https://www.zeit.de/*
// @match https://www.spiegel.de/*
// @match https://www.reddit.com/*
// @match https://www.facebook.com/*
// @match https://www.nzz.ch/*
// @match https://www.tagblatt.ch/*
// @match https://www.tagesanzeiger.ch/*
// @match https://zueriost.ch/*
// @match https://www.vaterland.li/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @downloadURL https://update.greasyfork.org/scripts/455551/Remove%20unwanted%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/455551/Remove%20unwanted%20news.meta.js
// ==/UserScript==
//https://gist.github.com/BrockA/2625891

function truncate(str, n){
  return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
};

var inform_about_removal = false;

function recurseEl(father,element) {
  if(element.childElementCount === 0) {
    search = /(william)|(stories)|(sponsored)|(kardashian)|(heizen)|(strom)|(macron)|(merz)|(elon)|(ukraine)|(selenskyj)|(liveticker)|(influencer)|(fifa)|(messi)|(infantino)|(corona)|(putin)|(bolsonaro)|(trump)|(trumps)|(arabischen)|(arabisch)|(jong)|(musk)|(promis)|(promi)|(katar)|(boateng)|(russland)|(russen)|(nati)|(weltmeister)/
		if (element.innerText?.toLowerCase().match(search)){
			console.log("removing" + element.innerText)
      if (inform_about_removal){
        $.notify("Removed: " + truncate(element.innerText,60),"success",{position:"right bottom"});
  		}
      element.textContent = '';
      father.style.display = "none";
    }
  } else {
    Array.from(element.children).forEach(child => {
      recurseEl(father,child);
    });
  }
}

function updateHTML()
{
  var href = window.location.host;
  if (href == "www.zeit.de"){
		var selector =  ".zon-teaser-standard, .zon-teaser-wide, .zon-teaser-poster"
  }
  else if (href == "www.watson.ch"){
  	var selector = '.region'
  }
  else if (href == "www.spiegel.de"){
  	var selector = "article"
  }
  else if (href == "www.tagblatt.ch"){
  	var selector = ".widget--1of3, .widget--2of3, .widget--3of3, .widget--1of2, .widget--1of2-top, .widget--2of2"
  }
  else if (href == "www.nzz.ch"){
    var selector = ".widget--article , .teaser--1of3-news, .teaser--1of3-compact"
  }
  else if (href == "www.tagesanzeiger.ch"){
    var selector = ".ArticleTeaser_colorbox__3dUIa, article"
  }
  else if (href == "zueriost.ch"){
    var selector = ".col-xs-12"
  }
  else if (href == "www.vaterland.li"){
    var selector = ".defaultteaser"
  }
  else if (href == "www.facebook.com"){
		var selector = 'svg[viewBox="0 0 20 20"]' //search for the 3 dots in a post
  }
  else if (href == "www.reddit.com"){
    var selector = ".link"
  }
  $(selector).each(function(i, obj) {
    try {
        if (href == "www.facebook.com"){
          var obj = obj.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
          console.log(obj.innerText.toLowerCase())  
          recurseEl(obj,obj);
        }
        else{
          recurseEl(obj,obj);
        }
    	}
    catch (error) {
      console.error(error);
    }
  });
};

var intervalId = window.setInterval(function(){
	updateHTML();
}, 2000);

