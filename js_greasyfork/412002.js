// ==UserScript==
// @name         Nhentai Favorites Scraper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Scrapes the magic numbers out of your Nhentai favorites list, returning the list as a text file.  My first introduction to JavaScript, so don't expect perfection.
// @author       zzzb123
// @match        *://nhentai.net/favorites/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/412002/Nhentai%20Favorites%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/412002/Nhentai%20Favorites%20Scraper.meta.js
// ==/UserScript==

//this is the one value you may want to tinker around with, Nhentai will complain if it is too low, but it will be slow if it is too high\
//if your internet is not NASA level fast, 0 should work just fine, this is mostly as a 'just in case' so you dont have to mod the code too much
var sleep_interval = 0;




function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function genSetString(s){
    var ret = '';
    for(var a of s){
        ret += a + ',';
    }
    return ret;
}

function getLocalStorageSet(){
    var ret = new Set();
    try{
        for (var a of localStorage.getItem('parser-data').split(',')){
            ret.add(a);
        }
    }
    catch(e){}
    return ret;
}

function check_state(){
	var state = localStorage.getItem('parser-state');
	if(state == null){
		state = '0';
		localStorage.setItem('parser-state',state);
	}
	return state;
}

function activate_and_start(){
	localStorage.setItem('parser-state','1');
	location.href = '/favorites/';
}

function disable_parser(){
	localStorage.setItem('parser-state','0');
}

function start(sleepfor){
	var button = document.createElement('button');
	button.innerHTML = 'save list';
	button.onclick = activate_and_start;
	document.getElementsByClassName('menu right')[0].children[0].children[0].replaceWith(button); //injects the parser enable button into the page in place of the favorites button
	if(check_state() == '0'){
		return;
	}
	button.innerHTML = 'cancel';
	button.onclick = disable_parser;
    var s = getLocalStorageSet();
    for(var fav of document.getElementsByClassName('gallery-favorite')){
        s.add(fav.dataset.id);
    }
    localStorage.setItem('parser-data',genSetString(s));
    sleep(sleepfor).then(() => {
        try{
            document.getElementsByClassName('next')[0].click();
        }
        catch(e){
			disable_parser();
			button.innerHTML = 'DONE';
            download('list.txt',localStorage.getItem('parser-data'));
        }
    });
}

start(sleep_interval);