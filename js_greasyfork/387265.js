// ==UserScript==
// @name         Mastodon identicon adder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Apply eyeballs to URIs better.
// @author       feonixrift
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jdenticon@2.1.1
// @match        *://hackers.town/*
// @downloadURL https://update.greasyfork.org/scripts/387265/Mastodon%20identicon%20adder.user.js
// @updateURL https://update.greasyfork.org/scripts/387265/Mastodon%20identicon%20adder.meta.js
// ==/UserScript==

// Techniques learned from https://openuserjs.org/scripts/nokeya/Direct_links_out/source
// Jquery dependency only exists because I can't figure out how to get the jdenticon function to run directly

(function() {
    'use strict';

    function identicate(link){
        if (link.hasAttribute('identicated')){
            return;
        }
        var identicon = document.createElement("svg")
        var holder = document.createElement("div")
        var components = link.href.split("/")
        identicon.setAttribute('data-jdenticon-value', components[2])
        holder.setAttribute('style', 'width: 48px; height: 48px; flex: none; float: inline-end')
        holder.appendChild(identicon)
        jdenticon.update(identicon)
        link.setAttribute('identicated', 'true')
        link.setAttribute('style', 'width: 96px;')
        link.appendChild(holder)
        link.appendChild(link.children[0])
        holder.innerHTML += " "
    }

    function alldenticate(){
        var links = document.getElementsByClassName('status__avatar');
        for (var i=0; i<links.length; ++i){
            identicate(links[i])
        }
    }

    document.addEventListener('DOMNodeInserted', function(event){
        if (!event || !event.target || !(event.target instanceof HTMLElement)){
            return;
        }
        var node = event.target;
        if (node instanceof HTMLAnchorElement){
            if (node.classList.contains('status__avatar')){
                identicate(node)
            }
        }
        var links = node.getElementsByClassName('status__avatar');
        for (var i=0; i<links.length; ++i){
            identicate(links[i]);
        }
    }, false);

    console.log('loading')
    alldenticate()
})();