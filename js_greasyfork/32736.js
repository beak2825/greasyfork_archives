// ==UserScript==
// @name       Przycisk zgłoszenia
// @namespace  http://www.wykop.pl/*
// @version    1.1
// @description dodaje do menu przy avatarze przycisk zgłoszenia
// @include     *://www.wykop.pl/*
// @copyright  Arkatch
// @downloadURL https://update.greasyfork.org/scripts/32736/Przycisk%20zg%C5%82oszenia.user.js
// @updateURL https://update.greasyfork.org/scripts/32736/Przycisk%20zg%C5%82oszenia.meta.js
// ==/UserScript==
(function(){
var menuClass = document.getElementsByClassName("dropdown right m-hide")[0];
var menuDivUl = menuClass.querySelector("div ul");
var menuElemenHref = "https://www.wykop.pl/naruszenia/moderated/";
var li_node = document.createElement("li");
var a_node = document.createElement("a");
a_node.setAttribute("href", menuElemenHref);
var i_node = document.createElement("i");
i_node.setAttribute("class", "fa fa-exclamation-triangle");
var span_node = document.createElement("span");
span_node.innerHTML = "zgłoszenia";
span_node.setAttribute("style", "margin-left:4px");
a_node.appendChild(i_node);
a_node.appendChild(span_node);
li_node.appendChild(a_node);
menuDivUl.appendChild(li_node);
})();