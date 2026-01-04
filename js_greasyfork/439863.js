// ==UserScript==
// @name          Improved EH Reader
// @namespace     karoo
// @version       2023.10.30
// @description   Simplifies the reader layout, adds a hotkey and preloads the next image. Inspired by Handy ExHentai, ExHentai - Preload next page, and G.E/EX Keyboard Navigation.
// @match         *://e-hentai.org/s/*
// @match         *://exhentai.org/s/*
// @run-at        document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439863/Improved%20EH%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/439863/Improved%20EH%20Reader.meta.js
// ==/UserScript==

function id(id) {return document.getElementById(id);}
if (window.top !== window.self) {return;}

// hide top panel and front page link
id('i1').firstElementChild.style.display = 'none';
id('i2').style.display = 'none';
document.getElementsByClassName('dp')[0].style.display = 'none';

// hide frame and fix margins
id('i1').style.background = 'none';
id('i1').style.border = 'none';
id('i1').style.margin = '0px auto 0px';

// add extra hotkeys
document.addEventListener('keydown', function(e) {
    // alt+right, next page if no future history
    if (e.altKey && e.keyCode == '39') {
        var currentUrl = window.location.href;
        history.forward();
        // if the url hasn't changed after 20ms, click next
        setTimeout(function() {
            if(currentUrl === window.location.href){
                id('next').click();
            }
        }, 20);
        e.preventDefault();
        return;
    }
    // ignore further hotkeys if a modifier is held
    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey) {return;}
    // q key, return to gallery
    if (e.keyCode == '81') {
        id('i5').firstElementChild.firstElementChild.click();
        return;
    }
    // f key, search all galleries
    if (e.keyCode == '70') {
        var tagSearch = prompt('Search ' + document.location.hostname);
        if (tagSearch !== null) {
            window.location.href = '/?f_search=' + tagSearch;
        }
        return;
    }
});

// insert script to continue preloading beyond initial userscript load
// lookahead http request used to avoid creating an iframe
// doesn't preload when opening pages in new tabs
var script = document.createElement('script');
script.type = 'text/javascript';
script.innerHTML = `
var preload = new Image();
function preloadNext() {
    var href = document.getElementById('next').href;
    if (history.length <= 1 || href == window.location.href) {return;}
    var lookahead = new XMLHttpRequest();
    lookahead.open('GET', href, true);
    lookahead.onload = function(e) {
        var doc = document.implementation.createHTMLDocument('lookahead');
        doc.documentElement.innerHTML = lookahead.responseText;
        var nextImage = doc.getElementById('img').src;
        preload.src = nextImage;
    }
    lookahead.send();
}
var uweo = update_window_extents;
update_window_extents = function() {
    uweo();
    document.getElementById('img').addEventListener('load', preloadNext());
}`;
document.head.appendChild(script);
