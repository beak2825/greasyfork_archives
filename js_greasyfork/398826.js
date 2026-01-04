// ==UserScript==
// @name         Diddit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  afbeelding veranderen
// @author       jokkijr007
// @match       *://www.diddit.be/*
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398826/Diddit.user.js
// @updateURL https://update.greasyfork.org/scripts/398826/Diddit.meta.js
// ==/UserScript==

var name = '?';



var text = document.createElement('div');
text.innerHTML = '<h2 style="font-size: 20px; color: white; position: absolute; left: 450px; top: 50px;">IK BEN EEN KABOUTER</h2>'
document.body.appendChild(text);
setInterval(function(){
if (document.getElementsByClassName('ng-binding')[6].innerHTML == name){
    document.getElementsByClassName('widget__image')[0].setAttribute('src', 'https://pluspng.com/img-png/random-png-image-mabel-s-sweater-creator-random-gnome-png-gravity-falls-wiki-fandom-powered-by-wikia-510.png')

    document.getElementsByClassName('profile__preview-picture')[0].children[0].setAttribute('src', 'https://pluspng.com/img-png/random-png-image-mabel-s-sweater-creator-random-gnome-png-gravity-falls-wiki-fandom-powered-by-wikia-510.png')



                                                                                      }
}, 100)