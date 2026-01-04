// ==UserScript==
// @name        AdditionalButtons
// @namespace   Violentmonkey Scripts
// @match       https://www.allocine.fr/film/fichefilm_*
// @match       https://www.mobygames.com/game/*
// @match       https://www.jeuxvideo.com/jeux/*
// @grant       none
// @version     1.0
// @author      -
// @description Add buttons to movies/games/softwares pages
// @downloadURL https://update.greasyfork.org/scripts/414632/AdditionalButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/414632/AdditionalButtons.meta.js
// ==/UserScript==

console.log("loaded")

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function rfc3986EncodeURIComponent(str) {  
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);  
}

var allocinebutton2 = "html.no-touch.open-modal.rc-visible body#allocine__moviepage.allocine.allocine__moviepage.logged-out.no-ads.font-loaded div.sub-body main#content-layout.content-layout.entity.movie.cf.seance-geoloc-redir section.section.section-wrap.gd-2-cols.gd-gap-30 div.gd-col-left div.card.entity-card.entity-card-overview.entity-card-list.cf div.buttons-holder a.xXx.button.button-sm.button-inverse-full"
var allocinetitle = "html.no-touch.open-modal.rc-visible body#allocine__moviepage.allocine.allocine__moviepage.logged-out.no-ads.font-loaded div.sub-body main#content-layout.content-layout.entity.movie.cf.seance-geoloc-redir div.titlebar.titlebar-page div.titlebar-title.titlebar-title-lg"

//MOVIE
function moviebuttons(mvtitle) {
  var returnbuttons = "";
  //PreDB.ovh
  returnbuttons += " <a style='font-size: 9px;' href='https://predb.ovh/?q=" + rfc3986EncodeURIComponent(mvtitle) + "' target='_blank'><img src='https://files.catbox.moe/nu95xh.ico' alt='PreDB.ovh'></a>";
  //Limetorrents
  returnbuttons += " <a style='font-size: 9px;' href='https://www.limetorrents.info/search/all/" + rfc3986EncodeURIComponent(mvtitle) + "' target='_blank'><img src='https://files.catbox.moe/4xog9y.ico' alt='LimeTorrents'></a>";
  //Kickass
  returnbuttons += " <a style='font-size: 9px;' href='https://kickass.onl/usearch/" + rfc3986EncodeURIComponent(mvtitle) + "/?field=seeders&sorder=desc' target='_blank'><img src='https://files.catbox.moe/h298ic.ico' alt='Kickass'></a>"
  
  return returnbuttons;
}

//GAME
function gamebuttons(gametitle) {
  var returnbuttons = "";
  //PreDB.ovh
  returnbuttons += " <a style='font-size: 9px;' href='https://predb.ovh/?q=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/nu95xh.ico' alt='PreDB.ovh'></a>";
  //Limetorrents
  returnbuttons += " <a style='font-size: 9px;' href='https://www.limetorrents.info/search/all/" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/4xog9y.ico' alt='LimeTorrents'></a>";
  //Kickass
  returnbuttons += " <a style='font-size: 9px;' href='https://kickass.onl/usearch/" + rfc3986EncodeURIComponent(gametitle) + "/?field=seeders&sorder=desc' target='_blank'><img src='https://files.catbox.moe/h298ic.ico' alt='Kickass'></a>";
  //Ziperto.com
  returnbuttons += " <a style='font-size: 9px;' href='https://www.ziperto.com/?s=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/euartc.png' alt='Ziperto'></a>"
  //Gamewii
  returnbuttons += " <a style='font-size: 9px;' href='https://gamewii.net/?s=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/clmv2c.png' alt='Gamewii'></a>"
  //Steamunlocked.net
  returnbuttons += " <a style='font-size: 9px;' href='https://steamunlocked.net/?s=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/2juklf.png' alt='Steamunlocked.net'></a>"
  //IGG-GAMES.COM
  returnbuttons += " <a style='font-size: 9px;' href='https://igg-games.com/?s=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/hd5bf9.jpg' alt='IGG-GAMES.COM'></a>"
  //rutracker.org
  returnbuttons += " <a style='font-size: 9px;' href='https://rutracker.org/forum/tracker.php?nm=" + rfc3986EncodeURIComponent(gametitle) + "' target='_blank'><img src='https://files.catbox.moe/hve55n.png' alt='rutracker.org'></a>"
  return returnbuttons;
}

//Mobygames
if (document.location.href.startsWith("https://www.mobygames.com/game/")){
  console.log("yes")
  document.querySelector(".niceHeaderTitle").innerHTML += gamebuttons(document.querySelector(".niceHeaderTitle a").textContent)
  console.log("yes")
}

//JeuxVideo.COM
if (document.location.href.startsWith("https://www.jeuxvideo.com/jeux/")){
  console.log(encodeURIComponent(document.querySelector(".gameHeaderBanner__title").textContent))
  console.log("yes")
  document.querySelector(".gameHeaderBanner__title").outerHTML += gamebuttons(document.querySelector(".gameHeaderBanner__title").textContent)
}