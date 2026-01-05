// ==UserScript==
// @name         Geizhals.de geizhals.at geizhals.eu cenowarka.pl skinflint.co.uk item property list beautifier
// @namespace    http://d3c0.de
// @version      01000000
// @description  Beautify key value property list in Geizhals (geizhals.de) article descriptions.
// @author       dx2
// @match        https://geizhals.de/*
// @match        https://geizhals.eu/*
// @match        https://geizhals.at/*
// @match        https://cenowarka.pl/*
// @match        https://skinflint.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28561/Geizhalsde%20geizhalsat%20geizhalseu%20cenowarkapl%20skinflintcouk%20item%20property%20list%20beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/28561/Geizhalsde%20geizhalsat%20geizhalseu%20cenowarkapl%20skinflintcouk%20item%20property%20list%20beautifier.meta.js
// ==/UserScript==
'use strict';
(function main() {
  var desc = document.getElementById('gh_proddesc')
  var keysValues = desc.firstChild
  var text = keysValues.textContent.replace(/•/g, '<br>')
  .replace(/<br>(.*?):/g,"<br><b>$1</b>:")
  .replace(/(.*?):/,"<b>$1</b>:")
  keysValues.textContent = ""
  var elChild = document.createElement('div')
  elChild.innerHTML = text
  //keysValues//desc.innerHTML = text
  desc.insertBefore(elChild,desc.firstChild)
}());