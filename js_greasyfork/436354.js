// ==UserScript==
// @name         🎧Spotify dl + info
// @namespace    http://tampermonkey.net/
// @version      0.8.1
// @description  actualiser la page sur les page d'album pour afficher les bouttons
// @author       DEV314R
// @match       *open.spotify.com/album/*
// @include      http://mp3clan.top/mp3/*.html
// @icon         https://open.spotify.com/favicon.ico
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/436354/%F0%9F%8E%A7Spotify%20dl%20%2B%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/436354/%F0%9F%8E%A7Spotify%20dl%20%2B%20info.meta.js
// ==/UserScript==
if(location.href.search(/spotify.com\/album\//gi)>-1){
setTimeout(()=>{
var alb=document.querySelector(".contentSpacing > div > span > h1").innerText // nom de l'albume
var art=document.querySelector(".contentSpacing > div > div > div > a").innerText //nom de l'artiste
var an=document.querySelector(".contentSpacing > div > div > span:nth-child(2)").innerText //année
var tm=document.querySelector(".contentSpacing > div > div > span:nth-child(3)").innerText.match(/[\d]+(?= [\D]+,)/gi)[0] // titre max
var ep=document.querySelector('.contentSpacing > div > div > span:nth-child(3) > span')// emplacement
ep.parentNode.parentNode.insertAdjacentHTML('afterend','<br><a style="background-color:#222;text-decoration:none;" > Album: '+alb+' | Artiste: '+art+' | Année: '+an+' | Titre max: '+tm+'</a>'+
                                             '<br><a href="http://mp3clan.top/mp3/'+art+'.html" target="_blank" style="background-color:#222;" > 🔍🎧music </a>');

var e=document.querySelectorAll('[data-testid="tracklist-row"]')
for(var f=0;f<e.length;f++){
var c=e[f]
var ar=c.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.innerText
var ti=c.firstElementChild.nextElementSibling.firstElementChild.firstElementChild.innerText
var te=c.lastElementChild.firstElementChild.nextElementSibling.innerText //   beforebegin
c.firstElementChild.nextElementSibling.nextElementSibling.firstElementChild.insertAdjacentHTML('beforebegin','<a href="http://mp3clan.top/mp3/'+ar+' '+ti+' '+te+'.html" target="_blank" style="background-color:#222;width: auto;height: auto;" >🔍🎧</a>');
}},4000)

}else if(location.href.search(/http:\/\/mp3clan.top\/mp3\/.+\.html/gi)>-1){
var che1=decodeURI(location.href.match(/(?<=\/mp3\/).+(?=\.html)/gi)[0])
document.querySelector('[placeholder="Type a song or an artist"]').click()
document.querySelector('input[placeholder="Type a song or an artist"]').value=che1
setTimeout(document.querySelector("div.searchClan-button-left.searchClan-round-left.orange-normal").click(),1500)
}