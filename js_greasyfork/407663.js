// ==UserScript==
// @name         Wowhead Items TSM
// @namespace    boail
// @version      1.0a
// @description  Easy TSM Import from Wowhead Item Lists, edited by boail. Original: https://gist.github.com/BobuSumisu/d5a3fccbd4f6ddbc2817
// @author       Øyvind Ingvaldsen <oyvind.ingvaldsen@gmail.com>
// @match        http://*.wowhead.com/*
// @match        https://*.wowhead.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407663/Wowhead%20Items%20TSM.user.js
// @updateURL https://update.greasyfork.org/scripts/407663/Wowhead%20Items%20TSM.meta.js
// ==/UserScript==

function getIds(getAll) {
  var ids = [];
  for (var x = 0, item; item = g_listviews.items.data[x]; x++) {
  	if (getAll || (item.hasOwnProperty('__tr') && item.__tr.className.indexOf('checked') >= 0)) {
  	  ids.push('i:' + item.id);
  	}
  }
  
  return ids;
}

function main() {
  var $btnSelected = $('<input type="button" value="TSMI Selected" style="background-color:#628a2c !important;">').on('click', function () {    
    $outTxt.text(getIds(false));
    $outDiv.show();
  });
  
  var $btnAll = $('<input type="button" value="TSMI All" style="background-color:#628a2c !important;">').on('click', function () {
    $outTxt.text(getIds(true));
    $outDiv.show();
  });
  
  var $nav = $('div.listview-band-top > div.listview-withselected');
  $nav.append($btnSelected);
  $nav.append($btnAll);
  
  var $outDiv = $('<div style="display:none; margin: 20px;"></div>');
  var $outTxt = $('<textarea style="box-sizing: border-box; height:100px; width:100%;"></textarea>').appendTo($outDiv);
  var $refresh = $('<div style="float:left">Click the button again to refresh</div>').appendTo($outDiv);
  var $closeOut = $('<input type="button" value="Close TSMI" style="float:right; background-color:#628a2c; margin:5px;">').appendTo($outDiv).on('click', function () {
    $outDiv.hide();
  });
  
  $outDiv.appendTo('#lv-items > div.listview-band-top');
  $outDiv.appendTo('#tab-items > div.listview-band-top');
}

setTimeout(main, 250);