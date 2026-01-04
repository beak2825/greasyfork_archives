// ==UserScript==
// @name         MeWe Extention
// @namespace    https://mewe.com/i/sajad
// @version      0.11
// @description  add download button to audio's
// @match        https://mewe.com/*
// @match        https://www.mewe.com/*
// @match        https://mewe.com/i/*
// @match        https://www.mewe.com/i/*
// @author       Sajad
// @grant        none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/383617/MeWe%20Extention.user.js
// @updateURL https://update.greasyfork.org/scripts/383617/MeWe%20Extention.meta.js
// ==/UserScript==

window.readyHandlers = [];
window.ready = function ready(handler) {
  window.readyHandlers.push(handler);
  handleState();
};

function handleState () {
  if (['interactive', 'complete'].indexOf(document.readyState) > -1) {
    while(window.readyHandlers.length > 0) {
      (window.readyHandlers.shift())();
    }
  }
}

document.onreadystatechange = window.handleState;

document.onreadystatechange = function () {
  var state = document.readyState;
  if (state == 'interactive') {

  } else if (state == 'complete') {
      setInterval(function(){ display(); }, 500);
  }
};


function display(){
  var audios = document.querySelectorAll('.audio_wrapper');
  audios.forEach(function(item){
    var pros=item.dataset.pros;
    if (pros==='done'){}
    else{
      var mp3_link = item.querySelector('audio').src;
      var elaudio= item.querySelector('audio');
      var down_but = '<a id="DBTN" download type="application/octet-stream" target="_blank" href="${mp3_link}" style= "font-weight: bold;border: 2px solid #469dc4;border-radius: 25%;left: 5px;color: #469dc4;-webkit-text-stroke-width: 2px;width: 15px;padding-top: 0px;padding-bottom: 0px;padding-left: 4px;padding-right: 4px;">⬇</a>';
      elaudio.insertAdjacentHTML('beforebegin', down_but);
    	item.dataset.pros = "done";
    }
  });
}