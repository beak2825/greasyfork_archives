   // ==UserScript==
// @name         Novel Updates Filter Tags
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Filter Novels based on Genre
// @author       Makarov
// @match        https://www.novelupdates.com/series-finder/*
// @match https://www.novelupdates.com/stag/*
// @match        https://www.novelupdates.com/series-ranking/*
// @match        https://www.novelupdates.com/novelslisting/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380496/Novel%20Updates%20Filter%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/380496/Novel%20Updates%20Filter%20Tags.meta.js
// ==/UserScript==

(function() {
    'use strict';
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var a = document.querySelector('#text-2');
var divEl = document.createElement('div');
divEl.className += "myTags";
divEl.style.float='left';
var b = document.createElement('span');
b.className += "gennew";
b.innerText = 'Sort';
//a.prepend(b);
b.style.margin = '2px 2px';
var hiddenTagList = [];
var c = document.querySelectorAll('div.search_genre');
document.querySelector('h3.widgettitle').remove();
var countTags = 0;
var tagList = [];

c.forEach(function(i){
	var tags = i.children;
	for(var j=0;j<tags.length;j++){
		if(!tagList.includes(tags[j].innerText)){
			tagList[countTags] = tags[j].innerText;
			countTags++;
		    //console.log(tags[j].innerText);
		}
	}
});

function removeNovels(currTag){
	//console.log('removing');
    c = document.querySelectorAll('div.search_genre');
    if(!hiddenTagList.includes(currTag)){
        hiddenTagList.push(currTag);
    }
    c.forEach(function(i){
        for(var j=0;j<i.children.length;j++){
         	if(i.children[j].innerText == currTag){
				i.parentElement.parentElement.hidden = true;
				break;
            }
        }
    });
}


function getBackNovels(currTag){
    var elIndex = hiddenTagList.indexOf(currTag);
    hiddenTagList.splice(elIndex, 1);
    c = document.querySelectorAll('div.search_genre');
    c.forEach(function(i){
        for(var j=0;j<i.children.length;j++){
            if(i.children[j].innerText == currTag){
                i.parentElement.parentElement.hidden = false;
                break;
            }
        }
    });
    hiddenTagList.forEach(function(i){
        removeNovels(i);});
}

function checkStateAndAssignAction(){
    console.log(this.style.color);
    if(this.style.color=='red'){
        this.style.color = 'green';
        this.style.backgroundColor = 'red';
        this.style.border = '2px solid black';
        removeNovels(this.innerText);
    }else{
        this.style.color='red';
        this.style.backgroundColor = '#375878';
        this.style.border = '';
        getBackNovels(this.innerText);
    }setCookie("hideTagList",hiddenTagList,1);
    //console.log(hiddenTagList);
}

a.prepend(divEl);
tagList.forEach(function(i){
	var f = b.cloneNode();
	f.innerText = i;
	f.style.float = 'left';
	f.style.padding = '0px 10px';
    f.style.color = 'red';
    f.addEventListener('click',checkStateAndAssignAction);
    divEl.append(f);
});

var x = getCookie("hideTagList").split(",");
x.forEach(function(i){
	var myTags = document.querySelectorAll('div.myTags > span.gennew');
    myTags.forEach(function(j){
        if(i==j.innerText){
            j.style.color = 'green';
            j.style.backgroundColor = 'red';
            j.style.border = '2px solid black';
            removeNovels(j.innerText);
        }
    });
});

})();