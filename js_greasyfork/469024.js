// ==UserScript==
// @name         Vollbild-Funktion für Mobilgeräte
// @namespace    https://greasyfork.org/de/scripts/469024-vollbild-funktion-f%C3%BCr-mobilger%C3%A4te
// @version      1.7
// @description  Fügt den Schriftzug "Vollbildmodus an" bsw ,"Vollbildmodus aus" der Navigation auf Leitstellenspiel.de hinzu.
// @author       TorBEngel
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469024/Vollbild-Funktion%20f%C3%BCr%20Mobilger%C3%A4te.user.js
// @updateURL https://update.greasyfork.org/scripts/469024/Vollbild-Funktion%20f%C3%BCr%20Mobilger%C3%A4te.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (window.top === window.self) {
// Vollbildmodus in Navigation
    var vollbildLi = document.createElement('li');
    vollbildLi.innerHTML = 'Vollbildmodus an';
    vollbildLi.style.cursor = 'pointer';
    vollbildLi.style.color = '#fff';
    vollbildLi.style.lineHeight = '19px';
    vollbildLi.style.paddingBottom = '10px';
    vollbildLi.style.paddingTop = '10px';
    vollbildLi.style.paddingLeft = '15px';
// Hyperlink zum Verband
var linkLi = document.createElement('li');
var hyperlink = document.createElement('a');
hyperlink.href = '/alliances/46664'; // Hier den Link deiner Wahl einfügen
hyperlink.textContent = 'Stark in Schleswig-Holstein🚨';
hyperlink.classList.add('lightbox-open');
linkLi.appendChild(hyperlink);
var newsElement = document.getElementById('news_li');
var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
if (screenWidth <= 786 && newsElement) {
        newsElement.parentNode.insertBefore(vollbildLi, newsElement);
    }
if (screenWidth <= 786 && newsElement) {
        newsElement.parentNode.insertBefore(linkLi, newsElement);
    }
function toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
vollbildLi.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', updateFullscreenText);
    document.addEventListener('webkitfullscreenchange', updateFullscreenText);
    document.addEventListener('mozfullscreenchange', updateFullscreenText);
    document.addEventListener('MSFullscreenChange', updateFullscreenText);
function updateFullscreenText() {
        if (document.fullscreenElement || document.webkitFullscreenElement ||
            document.mozFullScreenElement || document.msFullscreenElement) {
            vollbildLi.innerHTML = 'Vollbildmodus aus';
        } else {
            vollbildLi.innerHTML = 'Vollbildmodus an';
        }
    }
}})();