// ==UserScript==
// @name         tranimeizle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  tranimeizle sitesine myanimelist bağlantısı ekler
// @author       ArabadakiZombi
// @match        https://www.tranimeizle.co/anime/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/478189/tranimeizle.user.js
// @updateURL https://update.greasyfork.org/scripts/478189/tranimeizle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var anName = document.querySelector('div.col-xs-12.col-sm-12.mb-5 > dt:nth-child(3)').innerText;
    anName = anName.replace(/&/g, '');
    anName = anName.replace(/\s+/g, '+');

    var yeniDiv = $("<div></div>");
    yeniDiv.addClass("nm-block kutucuk");

    $(".post-footer").after(yeniDiv);

    var spanNOBR = document.querySelector('div.nm-block.kutucuk');

    /*----------------myanimeList-----------------*/
    var myanimeLink = document.createElement('a');
    myanimeLink.href = 'https://myanimelist.net/anime.php?cat=anime&q=' + anName;
    myanimeLink.target = '_blank';
    var myanimeIcon = new Image();
    myanimeIcon.src=  'data:image/x-icon;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwODxAPDgwTExQUExMcGxsbHCAgICAgICAgICD/2wBDAQcHBw0MDRgQEBgaFREVGiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICD/wgARCAAQABADAREAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAID/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgEF/9oADAMBAAIQAxAAAAHLTyQoKLmz/8QAGBABAQEBAQAAAAAAAAAAAAAAAgMEBQH/2gAIAQEAAQUCPE2I2wVkJ9fQG+n65//EABoRAAIDAQEAAAAAAAAAAAAAAAABAgMRFCH/2gAIAQMBAT8B55Eq2hXsd2+Yf//EABkRAAMAAwAAAAAAAAAAAAAAAAABAwIRE//aAAgBAgEBPwHviKmxxQpH/8QAJBAAAgAEBQUBAAAAAAAAAAAAAQIAERIhEyIxQUIDUmKBkqL/2gAIAQEABj8CDCiTBSL923qcM5ZSq0yI5VT0+TFQAsFEtstN/wACMJuimHxXNbW+vlH/xAAdEAEAAgICAwAAAAAAAAAAAAABETEAIUFRYXGB/9oACAEBAAE/IVs+jsOFwTkgqilNIr7JjBycK528i3Jmlp3JVZd7z//aAAwDAQACAAMAAAAQL1//xAAfEQACAQMFAQAAAAAAAAAAAAABEQAhgdFBYXGhwfH/2gAIAQMBAT8QBg6adwITRUu/kHL48xEGBX3zP//EAB0RAAIBBQEBAAAAAAAAAAAAAAERACFBodHxYfD/2gAIAQIBAT8QIje+IIlV1x2FD73cSWy+an//xAAaEAEBAQEBAQEAAAAAAAAAAAABIREAQTFR/9oACAEBAAE/ELzWK2UiqXkGLw7jL4bdFj4LOIQwPYYA4g3PzjV0xoD5TehaT5O//9k=';
    myanimeIcon.alt= 'myanimelist.net';
    myanimeIcon.title= 'myanimelist.net';
    myanimeIcon.setAttribute('width', '16px');
    myanimeIcon.setAttribute('height', '16px');
    myanimeIcon.style.marginLeft = '15px';
    myanimeLink.appendChild(myanimeIcon);
    spanNOBR.appendChild(myanimeLink);
    /*----------------myanimeList-----------------*/

    /*----------------youtube-----------------*/
    var ytbLink = document.createElement('a');
    ytbLink.href = 'https://www.youtube.com/results?search_query='+anName+' trailer';
    ytbLink.target = '_blank';
    var ytbIcon = new Image();
    ytbIcon.src=  'https://images2.imgbox.com/ec/2b/IYWQ6aGr_o.png';
    ytbIcon.alt= 'www.youtube.com';
    ytbIcon.title= 'www.youtube.com';
    ytbIcon.setAttribute('width', '16px');
    ytbIcon.setAttribute('height', '16px');
    ytbIcon.style.marginLeft = '15px';
    ytbLink.appendChild(ytbIcon);
    spanNOBR.appendChild(ytbLink);
    /*----------------youtube-----------------*/

})();

// style

GM_addStyle(`
    .nm-block.kutucuk{ display: block; border-top:2px solid #e0e0e0; padding: 5px 10px;}
`)