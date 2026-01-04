// ==UserScript==
// @name         海大一键评教
// @namespace    https://github.com/A0150315
// @version      0.2
// @description  广东海洋大学一键评教
// @author       谭健青
// @match        *://210.38.137.126:8016/*
// @match        *://210.38.137.125:8016/*
// @match        *://210.38.137.124:8016/*
// @match        *://210.38.137.79:8016/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36389/%E6%B5%B7%E5%A4%A7%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/36389/%E6%B5%B7%E5%A4%A7%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function autoComplete(select, ...args) {
    if (select.name.indexOf('DataGrid') > -1) {
      select.value = randomBetweenANB();
    }
    return select;
  }

  function randomBetweenANB(...args) {
    return parseInt((Math.random() * 10)) % 2 === 0 ? 'A' : 'B';
  }
  function isLastItem(...args){
    let pjkc=document.querySelector('#pjkc');
    if(pjkc){
      const selectedIndex=document.querySelector('#pjkc').options.selectedIndex;
      const selectionLength=document.querySelector('#pjkc').options.length;
      if(selectedIndex===selectionLength-1){
        return true;
      }
      return false;
    }
  }
  function getAllSelectionNCompleteIt(...args) {
    let selects = document.getElementsByTagName('select');
    let pjxx = document.getElementById('pjxx');
    let Button1 = document.querySelector('#Button1');
    const Button2 = document.querySelector('#Button2');
    if (selects) {
      if(isLastItem()){
        if(Button2.value===' 提  交 '){
          Button2.click();
        }
        alert('已完成评教');
        return true;
      }
      [].forEach.call(selects, autoComplete);
      if (pjxx) {
        pjxx.value = '谢谢老师悉心指导！';
      }
      if (Button1 && Button2) {
        Button1.click();
      }
    }
    return true;
  }
  const TextBox2=document.querySelector("#TextBox2");
  if(TextBox2){
    TextBox2.style.display='block';
    return true;
  }
  getAllSelectionNCompleteIt();
})();