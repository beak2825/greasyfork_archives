// ==UserScript==
// @name        SteamGifts - GOG.com Gift Club User Check
// @namespace   gog.steamgifts
// @match       http://www.steamgifts.com/user/*
// @description Extend the Sidebar on Steamgifts-Userpages to include links to the GOG.com Gift Club group user difference check.
// @author      SilentGuy (Add links to SGTools), Adam Biser
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12566/SteamGifts%20-%20GOGcom%20Gift%20Club%20User%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/12566/SteamGifts%20-%20GOGcom%20Gift%20Club%20User%20Check.meta.js
// ==/UserScript==

var elems = document.getElementsByTagName('*'), i;
var doit=true;
var steamgift=/.*www.steamgifts.com\/user\/([^/]*)(\/|$).*/.exec(window.location.href)[1];
for (i in elems) {
  if(doit && (' ' + elems[i].className + ' ').indexOf(' ' + "sidebar__navigation" + ' ') > -1) {
    var current=elems[i];
    current.parentElement.appendChild(buildHeader("GOG.com Gift Club"));

    var list = buildList();
    current.parentElement.appendChild(list);

    list.appendChild(buildItem("Check user","http://www.steamgifts.com/group/f2hXw/goggift/users/search?q="+steamgift));

    doit=false;
  }
}

function buildItem(displayText, linkTarget){
  var item = document.createElement("li");
  item.className += " sidebar__navigation__item";

  var link = document.createElement("a");
  link.className += " sidebar__navigation__item__link";
  link.href=linkTarget;
  link.target="_blank";
  item.appendChild(link);


  var div = document.createElement("div");
  div.className += " sidebar__navigation__item__name";
  t = document.createTextNode(displayText);
  div.appendChild(t);
  link.appendChild(div);

  div = document.createElement("div");
  div.className += " sidebar__navigation__item__underline";
  link.appendChild(div);

  return item;

}

function buildHeader(displayText){
  var heading = document.createElement("h3");
  heading.className += " sidebar__heading";
  var t = document.createTextNode(displayText);
  heading.appendChild(t);
  return heading;
}

function buildList(){
  var list=document.createElement("ul");
  list.className += " sidebar__navigation";
  return list;
}