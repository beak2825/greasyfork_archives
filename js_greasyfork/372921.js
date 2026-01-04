// ==UserScript==
// @name     AliExpress hide results containing
// @namespace   conquerist2@gmail.com
// @include  https://www.aliexpress.com/*
// @description Add input box to AliExpress search results and hide matching items
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/372921/AliExpress%20hide%20results%20containing.user.js
// @updateURL https://update.greasyfork.org/scripts/372921/AliExpress%20hide%20results%20containing.meta.js
// ==/UserScript==
// 2018 10 06 v1.0 -- initial version

var items = document.querySelectorAll('li.list-item');

// hide items matching input content
function hide_items() {
  //console.log('called hide_items with this.value=' + this.value);
  
  var regex = new RegExp(this.value, 'i');
  for(var i = 0; i < items.length; i++){
    item_text_node = items[i].querySelector('a.product');
    
    //console.log((i+1) + '/' + items.length);
    if(this.value && item_text_node.textContent.match(regex)) {
    	items[i].style.display = 'none';
      //console.log('match! ');
    } else {
    	items[i].style.display = 'initial'; 
    }
  }
}

// add input box
var search_div = document.createElement('div');
search_div.classList.add('add-keyword');

var search_box = document.createElement('input');
search_div.appendChild(search_box);
search_box.id = 'custom_search_box';
search_box.placeholder = 'exclude...';
search_box.type = 'text';
search_box.classList.add('ui-textfield');
search_box.classList.add('ui-textfield-system');
search_box.classList.add('keyword-search-input');
search_box.addEventListener('input', hide_items, false);

var e = document.querySelector('div.breadcrumb-keyword');
if (e) e.appendChild(search_div);