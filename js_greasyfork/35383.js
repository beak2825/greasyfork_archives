// ==UserScript==
// @name         GM.addStyle Polyfill
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.01
// @description  Polyfill for GM.addStyle, for some reason their script doesn't work?
// @author       NeutronNoir
// 
// ==/UserScript==
GM.addStyle = function (aCss) {
  'use strict';
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
};