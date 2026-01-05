// ==UserScript==
// @name        SteamGifts Remember Collapsed Comments
// @namespace   Alpe
// @include     http://www.steamgifts.com/discussion/*
// @version     1
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @run-at      document-end
// @description:en Makes SteamGifts forum remember collapsed comments status.
// @description Makes SteamGifts forum remember collapsed comments status.
// @downloadURL https://update.greasyfork.org/scripts/17085/SteamGifts%20Remember%20Collapsed%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/17085/SteamGifts%20Remember%20Collapsed%20Comments.meta.js
// ==/UserScript==

var maxstorage = 200;

if (!localStorage.sgrcc){ localStorage.sgrcc = JSON.stringify([]); var colapsed = []; } else { var colapsed = JSON.parse(localStorage.sgrcc); }
  
$('i.comment__collapse-button.fa.fa-minus-square-o:gt(0)').click(function() {
  id = $(this).parent().parent().attr('id');
  if (localStorage.sgrcc.indexOf(id) === -1){
    var colapsed = JSON.parse(localStorage.sgrcc);
    colapsed.push(id);
    if (colapsed.length > maxstorage){ colapsed.splice(0,colapsed.length-maxstorage); }
    localStorage.sgrcc = JSON.stringify(colapsed);
  }
});

$('i.comment__expand-button.fa.fa-plus-square-o:gt(0)').click(function() {
  id = $(this).parent().parent().attr('id');
  if (localStorage.sgrcc.indexOf(id) !== -1){
    var colapsed = JSON.parse(localStorage.sgrcc);
    index = colapsed.indexOf(id);
    colapsed.splice(index,1);
    localStorage.sgrcc = JSON.stringify(colapsed);
  }
});

element = $('div.comment__summary:gt(0)');
for (var i=0; i<element.length; i++){
  id = element[i].id;
  if (!!id && colapsed.indexOf(id) !== -1){
    element.parent().parent()[i].className = "comment comment--collapsed";
  }
}

$.noConflict();