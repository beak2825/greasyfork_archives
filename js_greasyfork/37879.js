// ==UserScript==
// @name         Exhentai Search box and Favorite box hidden
// @namespace    Exhentai
// @version      1.1.2
// @description  Hide the search box and the favorite box and add a button to make them appear
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwAQMAAABtzGvEAAAABlBMVEUAAABmBhHV14kpAAAAAXRSTlMAQObYZgAAADFJREFUeAFjIB4w//9BLPWBgSLq//HH/w8QQYE18GOj6hgwKCBCpcDOZQaZQpgiGgAA0dhUnSJVLdEAAAAASUVORK5CYII=
// @author       Catgrills
// @include      https://e-hentai.org/*
// @include      https://exhentai.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/37879/Exhentai%20Search%20box%20and%20Favorite%20box%20hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/37879/Exhentai%20Search%20box%20and%20Favorite%20box%20hidden.meta.js
// ==/UserScript==

// Exhentai Home Searchbox button
var header = document.getElementById('nb');
var box = document.getElementById('searchbox');
var advanced = document.getElementsByClassName('itss');
var file = document.getElementById('fsdiv');
if(box) {
    var trigger_box = document.createElement('button');
    trigger_box.id = 'trigger-box-btn';
    var text_trigger_box = document.createTextNode('Search');
    trigger_box.appendChild(text_trigger_box);
    header.appendChild(trigger_box);
    trigger_box.onclick = function() {
        box.getElementsByTagName('form')[0].style.visibility = 'visible';
    };
    var close = document.createElement('button');
    close.id = 'close-btn';
    var text_close = document.createTextNode('c');
    close.appendChild(text_close);
    box.getElementsByTagName('form')[0].appendChild(close);
    close.onclick = function() {
        box.getElementsByTagName('form')[0].style.visibility = 'hidden';
    };
    var thumbnail = document.getElementsByTagName('img');
    for(var i=0; i < thumbnail.length; i++) {
        thumbnail[i].src = thumbnail[i].src.replace('_l','_250');
    }
    box.getElementsByTagName('form')[0].appendChild(file);
}

// Exhentai Favorite Box
var box2 = document.getElementsByClassName('ido');
var fav = document.getElementsByClassName('fp');
if(fav[0]) {
    var trigger_box_2 = document.createElement('button');
    trigger_box_2.id = 'trigger-box-btn-2';
    var text_trigger_box_2 = document.createTextNode('Categories');
    trigger_box_2.appendChild(text_trigger_box_2);
    header.appendChild(trigger_box_2);
    trigger_box_2.onclick = function() {
        box2[0].getElementsByTagName('div')[0].style.display = 'block';
    };
    var close = document.createElement('button');
    close.id = 'close-btn';
    var text_close = document.createTextNode('c');
    close.appendChild(text_close);
    box2[0].getElementsByTagName('div')[0].appendChild(close);
    close.onclick = function() {
        box2[0].getElementsByTagName('div')[0].style.display = 'none';
    };
    var thumbnail = document.getElementsByTagName('img');
    for(var i=0; i < thumbnail.length; i++) {
        thumbnail[i].src = thumbnail[i].src.replace('_l','_250');
    }
}