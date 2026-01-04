// ==UserScript==
// @name        AudioBook Bay - Add Magnet Link
// @description Add an easy to use magnet link to the top of the page
// @namespace   https://greasyfork.org/en/users/221281-klaufir
// @match       https://audiobookbay.li/*
// @match       https://audiobookbay.is/*
// @match       https://audiobookbay.lu/*
// @match       http://audiobookbay.li/*
// @match       http://audiobookbay.is/*
// @match       http://audiobookbay.lu/*
// @grant       none
// @version     1.3
// @author      klaufir
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464775/AudioBook%20Bay%20-%20Add%20Magnet%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/464775/AudioBook%20Bay%20-%20Add%20Magnet%20Link.meta.js
// ==/UserScript==

trs = Array.from(document.querySelectorAll('table.torrent_info tr'))
dn = document.querySelector('h1').innerText
trackers = trs.filter(e => e.querySelector('td').innerText == 'Tracker:').map(e => e.querySelectorAll('td')[1].innerText)
info_hash = trs.filter(e => e.querySelector('td').innerText == 'Info Hash:').map(e => e.querySelectorAll('td')[1].innerText)[0]

uri = `magnet:?xt=urn:btih:${info_hash}`
uri += encodeURI(`&dn=${dn}&`)
uri += trackers.map(e => encodeURI(`tr=${e}`)).join('&')
document.querySelector('a#magnetLink').setAttribute('href', uri)

function addElem(uri) {
    var datauri='data:image/gif;base64,R0lGODlhDAAMALMPAOXl5ewvErW1tebm5oocDkVFRePj47a2ts0WAOTk5MwVAIkcDesuEs0VAEZGRv///yH5BAEAAA8ALAAAAAAMAAwAAARB8MnnqpuzroZYzQvSNMroUeFIjornbK1mVkRzUgQSyPfbFi/dBRdzCAyJoTFhcBQOiYHyAABUDsiCxAFNWj6UbwQAOw=='
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    var h1=document.querySelector('h1[itemprop="name"]');
    var newEl = document.createElement("div");
    var newAhref = document.createElement("a");
    var newImg = document.createElement("img");
    var span = document.createElement("span");
    newImg.setAttribute('src', datauri);
    newImg.style.paddingRight='5px';
    newEl.appendChild(newAhref);
    newAhref.setAttribute('href', uri)
    span.innerText = "Magnet Link";
    newAhref.appendChild(newImg);
    newAhref.appendChild(span);
    newAhref.style.textDecoration="underline";
    newAhref.style.padding='1.2em';
    newAhref.style.marginTop='.5em';
    newAhref.style.marginBottom='.5em';
    newAhref.style.background='rgb(0, 132, 0)';
    newAhref.style.color='rgb(255, 255, 255)';
    newAhref.style.display='block';
    newAhref.style.textAlign='center';
    newAhref.style.fontSize='xx-large';
    newImg.width =  24;
    newImg.height = 24;
    newImg.style.imageRendering='pixelated';
    insertAfter(h1, newEl);
}

addElem(uri);
