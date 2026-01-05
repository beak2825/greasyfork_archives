// ==UserScript==
// @name        KAT - Rearrange Navigation Bar
// @namespace   Dr.YeTii
// @description Changes the navigation bar around a bit and adds values for the feedback and messages tabs
// @include     *//kickass.to/*
// @include     *kat.cr/*
// @version     3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11295/KAT%20-%20Rearrange%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/11295/KAT%20-%20Rearrange%20Navigation%20Bar.meta.js
// ==/UserScript==

if ($('header [href="/auth/login/"]').length == 0) {
  
  
  
var orderOfDisplay = ["messenger","feedback","browse","upload","bookmarks","community","user"]; // left to right
var respectivehtml = ["","","","","","",""]; // html of above
var orderOfRemoval = ["community","bookmarks","upload"]; // only needs first 3, left to right
for (var i=0;i<orderOfDisplay.length;i++) {
  var elhtml = $('#navigation > li > a[href^="/'+orderOfDisplay[i]+'"]').first().closest('li').clone().wrap("<div>").parent().html();
  respectivehtml[i] = elhtml;
}
var color = $('.valueBubble').first().css('background-color');
$('#navigation').prepend('<style>.navValue {left: 38px; position: absolute; top: -10px; color: '+color+'}'+
                         '.navValueSmall {left: 45px;}'+
                         '.valueBubbleUser {display:none;}</style>');
checkWidth();
navValueCheck();
window.onresize = function(event) {
  checkWidth();
  navValueCheck();
};

/*
var cF = $('li a[href^="/feedback/"] .valueBlock').last().text();
if (cF=="")
  cF = 0;*/

var vcF = "";
var vcF2 = "";
if (cF>0) {
  vcF = '<i class="valueBubble"></i>';
  vcF2 = '<i class="navValue">'+cF+'</i>';
  
}
$('li a[href^="/feedback/"] .ka-thumbs-up').first().append(vcF);
$('li a[href^="/feedback/"] .menuItem').first().after(vcF2);
navValueCheck(); // check after creation
// Update html with values
respectivehtml[orderOfDisplay.indexOf('feedback')] = $('li a[href^="/feedback/"]').first().closest('li').clone().wrap("<div>").parent().html();
respectivehtml[orderOfDisplay.indexOf('messenger')] = $('li a[href^="/messenger/"]').first().closest('li').clone().wrap("<div>").parent().html();
  
  
  
  
}


function clearNavBar() {
  $('#navigation > li').remove();
  for (var i=0;i<respectivehtml.length;i++) {
    $('#navigation').append(respectivehtml[i]);
  }
}
function checkWidth() {
  clearNavBar();
  $('#navigation > li').show();
  $('a[href^="/feedback/"], a[href^="/bookmarks/"]', $('#navigation > li > a[href^="/user/"]').next()).parent().hide();
  var a = $('#torrentSearch').offset().left;
  var b = $('#navigation').offset().left;
  var c = $('#torrentSearch').width();
  var d = $('#navigation').width();
  if (a+c > b) {
    $('#navigation > li > a[href^="/'+orderOfRemoval[0]+'/"] .menuItem').hide();
    //Re check widths
    a = $('#torrentSearch').offset().left;
    b = $('#navigation').offset().left;
    c = $('#torrentSearch').width();
    d = $('#navigation').width();
    if (a+c > b) {
      $('#navigation > li > a[href^="/'+orderOfRemoval[1]+'/"] .menuItem').hide();
      //Re check widths
      a = $('#torrentSearch').offset().left;
      b = $('#navigation').offset().left;
      c = $('#torrentSearch').width();
      d = $('#navigation').width();
      if (a+c > b) {
        $('#navigation > li > a[href^="/'+orderOfRemoval[2]+'/"] .menuItem').hide();
      }
    }
  }
}
function navValueCheck() {
  $('.navValue').each(function() {
    if ($(this).prev().is(':visible')==false) {
      $(this).addClass('navValueSmall')
    }else{
      $(this).removeClass('navValueSmall');
    }
  });
}