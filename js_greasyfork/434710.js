// ==UserScript==
// @name         aa test torrent websites
// @namespace    hacker09
// @version      0.9
// @description  Delllll
// @author       hacker09
// @include        *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434710/aa%20test%20torrent%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/434710/aa%20test%20torrent%20websites.meta.js
// ==/UserScript==

(function() {
  'use strict';
  GM_registerMenuCommand("Change Method", change); //Adiciona uma opcao no menu

  function change() {
    if (GM_getValue("method") !== 1) { //Se o valor nao for existente,defina como true
      GM_setValue("method", 1); //Define a variavel como true
      location.reload();
    } //Termina a condicao if
    else {
      GM_setValue("method", 2); //Define a variavel como true
      location.reload();
    } //Termina a condicao if
  }
  var downexits = ''

  if (document.querySelector("#down") !== null) {
    downexits = 'Use document.querySelector("#down")? Yes!'
  }

  var UsesCryptoJs = '';
  if (document.body.innerHTML.match('CryptoJS') !== null) {
    UsesCryptoJs = 'CryptoJS? Yes!'
  }

  var Atob64 = '';
  if (document.body.innerHTML.match(/encrypted64|LinkOriginal|btoa/) !== null) {
    Atob64 = 'Atob64? Yes!'
  }

  if (GM_getValue("method") === 1) {
    /*Function.prototype.call = function(){};*/
    Function.prototype.apply = function() {}; /*Function.prototype.bind = function(){};*/
    var test = 'disable js';
  } else {

    test = 'unprotected links array';
    var SavedUnprotectedLinks = []; //Creates a new global array
    var SavedUnprotectedLinksIndex = []; //Creates a new global array
    var AllPageLinks = document.querySelectorAll("a"); //Select and store all links on the page
    for (var i = 0, max = AllPageLinks.length; i < max; i++) /*For every single button Do... */ { //Starts the for condition
      if (AllPageLinks[i].href.match('magnet:') !== null) //If the link is an unprotected magnet link
      { //Starts the if condition
        SavedUnprotectedLinks.push(AllPageLinks[i].href); //Add the unprotected direct magnet link to the array
        SavedUnprotectedLinksIndex.push(i); //Add the unprotected direct magnet index link to the array
      } //Finishes the if condition
    } //Finishes the for condition

    window.onload = function() { //Starts the function when the website finished loading
      var TimesExecuted = 0; //Create a new variable
      for (var i = 0, max = AllPageLinks.length; i < max; i++) /*For every single button Do... */ { //Starts the for condition
        if (SavedUnprotectedLinksIndex.includes(i) === true) //If the current looped a element is found on the SavedUnprotectedLinksIndex array
        { //Starts the if condition
          AllPageLinks[i].href = SavedUnprotectedLinks[TimesExecuted]; //Add the Saved Unprotected Link to AllPageLinks
          TimesExecuted += 1; //Sum the total amount of times that the if condition is true and executed
        } //Finishes the if condition
      } //Finishes the for condition
    }; //Finishes the onload function

  }
  document.querySelector("title").innerText = test + ' ' + Atob64 + ' ' + UsesCryptoJs + ' ' + downexits
})();