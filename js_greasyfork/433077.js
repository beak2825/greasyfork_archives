// ==UserScript==
// @name         Evil Link Converter triggered onmouse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I try to pretend evil Facebook's method.
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433077/Evil%20Link%20Converter%20triggered%20onmouse.user.js
// @updateURL https://update.greasyfork.org/scripts/433077/Evil%20Link%20Converter%20triggered%20onmouse.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function () {
  "use strict";

  const target = "https://google.com";
  var buf = "";
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  function main(){
    Array.from(document.getElementsByTagName("a")).forEach((elm) => {
    if (elm.onmousedown === null) {
      if(elm.id === ""){
          elm.id = uuidv4();
      }
      elm.onmousedown = ({elm: elm}) => {
        doChange(elm.id);
      };
      if(elm.onmouseup === null) {
          elm.onmouseup = ({elm: elm}) => {
            undoChange(elm.id);
          };
      }
      if(elm.onmouseleave===null){
          elm.onmouseleave = ({elm: elm}) => {
        undoChange(elm.id);
      };
    }}
  });}
  function doChange(id) {
    var e = document.getElementById(id);
    if (e.href !== target) {
      [buf, e.href] = [e.href, target];
    }
  }
  function undoChange(id) {
    var e = document.getElementById(id);
    if (e.href === target) {
      e.href = buf;
    }
  }
})();
