// ==UserScript==
// @name         GravityTales CleanUp
// @namespace    http://gravitytales.com
// @include      http://gravitytales.com/novel/*
// @description  Removes unnecessary elements from GravityTales to create a more pleasant reading experience.
// @version      1.0.2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385630/GravityTales%20CleanUp.user.js
// @updateURL https://update.greasyfork.org/scripts/385630/GravityTales%20CleanUp.meta.js
// ==/UserScript==

function removeElementsByClass(className){
  var elements = document.getElementsByClassName(className);
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function removeElementsByTag(tagName){
  var elements = document.getElementsByTagName(tagName);
  while(elements.length > 0){
    elements[0].parentNode.removeChild(elements[0]);
  }
}

removeElementsByClass('side-nav');
removeElementsByClass('header');
removeElementsByClass('comments');
removeElementsByClass('navbar');
removeElementsByTag('footer'); 

document.getElementsByClassName('main-content')[0].setAttribute('style', 'position:relative;left:15%;');
document.querySelector('head').innerHTML += '<style>.cc_banner{display:none;}</style>';

setTimeout(function(){ removeElementsByClass('cc_banner'); }, 1000);