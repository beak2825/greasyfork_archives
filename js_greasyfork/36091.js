// ==UserScript==
// @name         w o b h o u s e
// @version      1.0
// @description  w o b
// @author       l i l Z
// @match        https://discordapp.com/channels/*
// @grant        GM_addStyle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/en/users/162166
// @downloadURL https://update.greasyfork.org/scripts/36091/w%20o%20b%20h%20o%20u%20s%20e.user.js
// @updateURL https://update.greasyfork.org/scripts/36091/w%20o%20b%20h%20o%20u%20s%20e.meta.js
// ==/UserScript==

var WAIT_FOR_LOAD_TRY_INTERVAL = 0.5e3;
var iconChannel = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" class="iconHash"><path id="pathHash" fill="currentColor" d="M2.27333333,12 L2.74666667,9.33333333 L0.08,9.33333333 L0.313333333,8 L2.98,8 L3.68666667,4 L1.02,4 L1.25333333,2.66666667 L3.92,2.66666667 L4.39333333,0 L5.72666667,0 L5.25333333,2.66666667 L9.25333333,2.66666667 L9.72666667,0 L11.06,0 L10.5866667,2.66666667 L13.2533333,2.66666667 L13.02,4 L10.3533333,4 L9.64666667,8 L12.3133333,8 L12.08,9.33333333 L9.41333333,9.33333333 L8.94,12 L7.60666667,12 L8.08,9.33333333 L4.08,9.33333333 L3.60666667,12 L2.27333333,12 L2.27333333,12 Z M5.02,4 L4.31333333,8 L8.31333333,8 L9.02,4 L5.02,4 L5.02,4 Z" transform="translate(1.333 2)"></path></svg>';


GM_addStyle(`
  .toggleCollapse {
    z-index:1000;
    width:24px;
    height:24px;
    margin:0 4px;
    padding:0px;
    color:white;
    background:transparent;
  }
  .userExpand #pathHash{
    fill:#ADAEB1 !important;
  }
  .collapse {
    width:0px;
  }
  div[class^=channels]{
    overflow: hidden;
  div[class^=guilds-wrapper]{
    overflow: hidden;
  }
`);
function createBtn(){
  let btn = $('<button class="toggleCollapse"><span></span></button>');
  btn.click(function(){
    $('[class^=channels]').toggleClass('collapse');
    $('[class^=guilds-wrapper]').toggleClass('collapse');
    $('.toggleCollapse span').toggleClass('userExpand');
  });
  return btn;
}

function addBtn(){
  const people = $('[name^=People]');
  if (!people.length) {
    return false;
  }
  people.after(createBtn());
  $('.toggleCollapse span').html(iconChannel);
}

function tryRunFunc(fn, interval) {
  if ([null, false].includes(fn())) {
    setTimeout(() => tryRunFunc(fn, interval), interval)
  }
}
function main() {
  tryRunFunc(addBtn, WAIT_FOR_LOAD_TRY_INTERVAL);
}
main();