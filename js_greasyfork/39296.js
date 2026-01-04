// ==UserScript==
// @name        Craigslist Hover
// @namespace   clhover
// @description Show posts in a popup upon hover.
// @include     https://*.craigslist.tld/*search/*
// @include     https://*.craigslist.tld/*search/*
// @require     https://code.jquery.com/jquery-1.12.4.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant       none
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/39296/Craigslist%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/39296/Craigslist%20Hover.meta.js
// ==/UserScript==
(function() {
  var hovering = false;
  $('body').prepend(
    '<div id="d">' +
      '<iframe style="height:100%; width:100%" id="d_content" src=""></iframe>' +
    '</div>'
  );
  var d = $('#d');
  d.on('mouseleave', function() { d.dialog('close'); });
  d.dialog({
    'autoOpen': false,
    'width': 800,
    'modal': true,
    'height': 600,
    'closeText': '',
    'position': {my:'top', at:'top+50px', of: $('body')}
  });
  $('.ui-dialog').css({
    boxShadow: '0px 0px 8px 10px #aaa',
    zIndex: 9999
  });
  function popup(title, link) {
    if (hovering) {
      console.log("Hovering");
      var dif = $('#d_content').detach();
      dif.attr('src', link);
      dif.appendTo(d);
      d.dialog('option','title', title);
      d.dialog('open');
      hovering = false;
    }
  }
  $('.hdrlnk').hover(function(e) {
    hovering = true;
    var t = $(this);
    var p = t.closest('.result-info');
    setTimeout(function() {
      popup(p.find('.result-date').text() + ' - ' +
        p.find('.result-title').text() + ' - ' +
        p.find('.result-age').text() + ' - ' +
        p.find('.result-hood').text(),
        t.attr('href')
      );
    }, 1000);
  }, function() {hovering = false;});
})();
