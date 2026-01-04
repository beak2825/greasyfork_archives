// ==UserScript==
// @namespace it.intersail.boncri
// @name eprice-test
// @description Eprice test
// @include https://www.eprice.it/black-hour*
// @grant GM.log
// @version 1.3.0
// @downloadURL https://update.greasyfork.org/scripts/35131/eprice-test.user.js
// @updateURL https://update.greasyfork.org/scripts/35131/eprice-test.meta.js
// ==/UserScript==

var skus = [];

function nodeInsertedHandler(event) {
  console.debug('inserted event');
  var item = event.target;
  console.debug(item);
  var found = false;
  var id = item.id;
  console.debug('inserted ' + id);
  for(var i=0; i<skus.length; i++) {
    if(skus[i] == id) {
      found = true;
      break;
    }
  }
  console.debug('Found: ' + found);
  if(!found) {
		btnClick(item);
  }
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}
  
function btnClick(item) {
  var btn = item.getElementsByClassName('btn')[0];
  eventFire(btn, 'click');
}

function epriceLoadPage(event) {
  console.debug('page loaded');
  var parent = document.getElementById('prodottiBlackFriday');
  parent.addEventListener("DOMNodeInserted", nodeInsertedHandler, false);
  console.debug('listener started');
  
  var items = document.getElementsByName('itemSku');
  
  for(var i=0; i<items.length; i++) {
    skus.push(items[i].id);
  }
  
  console.debug(skus);
}

window.addEventListener('load', epriceLoadPage, false);

