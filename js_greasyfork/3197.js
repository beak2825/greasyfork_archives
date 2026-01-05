// ==UserScript==
// @name           FARMASSI 
// @namespace      DSFarmAssistentExtension
// @include        *die-staemme.de/game.php*screen=am_farm*
// @author         Dummbroesel
// @description    DS-FARMASSSI Extension
// @version	   1.4.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3197/FARMASSI.user.js
// @updateURL https://update.greasyfork.org/scripts/3197/FARMASSI.meta.js
// ==/UserScript==

document.onkeypress = function(event) {
  var eCode = (event.keyCode == 0)? event.charCode : event.keyCode;
  
  switch (eCode) {
    case 102: //f
      FARemove();
      break;
    case 81: //Q
      FAFirst();
      break;
    case 113: //q
      FAPrev();
      break;
    case 101: //e
      FANext();
      break;
    case 115: //s
     FASelect();
      break;
    default:
    break;
  }
}

function FARemove() {
  if ($('a.farm_icon_a') != null){
    $('a.farm_icon_a').click(function() {
      $(this).closest("tr").remove();
    });
  }
  if($('a.farm_icon_b') != null){
    $('a.farm_icon_b').click(function() {
      $(this).closest("tr").remove();
    });
  }
  if ($('a.farm_icon_c') != null) {
    $('a.farm_icon_c').click(function() {
      $(this).closest("tr").remove();
    });
  }
  console.log('FARMASSI ACTIVE');
}

function FAFirst() {
  var divCon = $('#am_widget_Farm');
  var allTd = divCon.find('td');
  var navTd = $('div#plunder_list_nav td');
  var navTdChilds = navTd.children();
  navTdChilds.each(function (index) {
    if (this.tagName.toLowerCase() == 'strong' && index > 0) {
      window.location = navTdChilds[0].href;
    }
  });
}

function FAPrev() {
  var divCon = $('#am_widget_Farm');
  var allTd = divCon.find('td');
  var navTd = $('div#plunder_list_nav td');
  var navTdChilds = navTd.children();
  navTdChilds.each(function (index) {
    if (this.tagName.toLowerCase() == 'strong' && index > 0) {
      window.location = navTdChilds[index - 1].href;
    }
  });
}

function FANext() {
  var divCon = $('#am_widget_Farm');
  var allTd = divCon.find('td');
  var navTd = $('div#plunder_list_nav td');
  var navTdChilds = navTd.children();
  navTdChilds.each(function (index) {
    if (this.tagName.toLowerCase() == 'strong' && index < navTdChilds.length -2) {
      window.location = navTdChilds[index+1].href;
    }
  });
}

function FASelect() {
  var divCon = $('#am_widget_Farm');
  var allTd = divCon.find('td');
  var navSelect = $('div#plunder_list_nav select');
  navSelect.focus();
}