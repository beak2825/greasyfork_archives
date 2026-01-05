// ==UserScript==
// @name rec-tube
// @match rec-tube.com/*
// @run-at document-end
// @grant none
// @require https://code.jquery.com/jquery-2.2.3.min.js
// ==/UserScript== 
start();

function start() {
 $('a[href^="/watch"]').each(function(i, n) {
  var glory = $(".images-rotation", n).data("images");
  if(!glory) return;
  var hole = glory[0].substring(8, glory[0].length - 6);

  $(n).parent().trigger('imageRotationRemove');
  $(n).attr("href", "/file/" + btoa(hole) + "/");
 }); 
}