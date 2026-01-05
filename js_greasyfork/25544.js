// ==UserScript==
// @name        Madth3 Magog
// @description Magog personal adjustments
// @namespace   http://the-magog-forum.freeforums.net
// @include     http://the-magog-forum.freeforums.net/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25544/Madth3%20Magog.user.js
// @updateURL https://update.greasyfork.org/scripts/25544/Madth3%20Magog.meta.js
// ==/UserScript==

setTimeout(function() {
  $(document).ready(function(){
    $('#wrapper').css('width', '75%');
    $('table.list thead').remove()
    $('tr.sticky td').css('background-color','#303838');
    $('tr.thread > td > table').css('width','100%');
    $('span.control-icons').parent().width('60px');
    $('.thread_meta').hide();
    $('.ui-micro-pagination').css('display', 'inline-block');
    $('.ui-micro-pagination').css('float','right');
    $('.ui-micro-pagination').css('margin-top','0');
    $('.views').remove();
    $('.latest').find('br').replaceWith(' ');
    var $profileMenu = $('ul[role=navigation] > li').eq(5)
    var profileLink = $profileMenu.find('a').attr('href');
    $profileMenu.after('<li><a href="'+ profileLink +'/notifications">Notifications</a></li>');
    // PERSONAL STUFF
    $('#thread-26').hide();
    $('#thread-41').hide();
  });
}, 20);
