// ==UserScript==
// @name        KAT - Set User Pic From Wall
// @namespace   Dr.YeTii
// @description Does what it says
// @include     *kat.cr/user/*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10775/KAT%20-%20Set%20User%20Pic%20From%20Wall.user.js
// @updateURL https://update.greasyfork.org/scripts/10775/KAT%20-%20Set%20User%20Pic%20From%20Wall.meta.js
// ==/UserScript==


if (window.location.pathname=='/user/'+$('.usernameProfile').text()+'/') {
  $('.userPicSize100px .userPicHeight img').attr('id', 'userpic');
  $('.userPicSize100px .badgeSiteStatus').append("<script type=\"text/javascript\">$(function() { var cur = $(\"#userpic\"), del = $(\"#deluserpic\"), set = $(\"#setuserpic\"); del.click(function() { if (confirm(\"Are you sure that you want to delete current userpic?\")) { $.fancybox.showActivity(); $.post('/account/deluserpic/', function(data) { $.fancybox.hideActivity(); if (data.method == 'error') { alert('error: ' + data.html); } else { del.fadeOut(); cur.attr('src', '//kastatic.com/images/commentlogo.png'); } }, 'json').error(function(xhr) { $.fancybox.hideActivity(); alert('ajax error: ' + xhr.responseText); }); } return false; }); set.imageSelector({ select: function(images) { $.fancybox.showActivity(); $.ajax({ type: \"POST\", url: '/account/setuserpic/', data: { image_id: images[0].id }, dataType: \"json\", beforeSend: function(response) { cur.attr('src', '//kastatic.com/images/indicator.gif'); }, success: function(response) { $.fancybox.hideActivity(); if (response.method == 'error') { alert('error: ' + response.html); } else { cur.attr('src', response.html); del.fadeIn(); } }, error: function(response) { $.fancybox.hideActivity(); alert('ajax error: ' + response.responseText); } }); } });});</script>"+
                             '<i id="setuserpic" title="Set User Pic" class="ka icon16 ka16 ka-pencil"></i>'+
                             '<i id="deluserpic" title="Delete User Pic" class="ka icon16 ka16 ka-user-remove"></i>');
}