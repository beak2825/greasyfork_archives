// ==UserScript==
// @name        titulky.com - show release
// @namespace   monnef.tk
// @description zobrazi nalevo od titulku release, neni tedy potreba najizdet na kazde titulky po jednom
// @include     http://*.titulky.com/*
// @include     https://*.titulky.com/*
// @version     2
// @grant       none
// @require     https://cdn.jsdelivr.net/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32055/titulkycom%20-%20show%20release.user.js
// @updateURL https://update.greasyfork.org/scripts/32055/titulkycom%20-%20show%20release.meta.js
// ==/UserScript==

var debug = false;

this.$ = this.jQuery = jQuery.noConflict(true);

function onLoad() {
  var lightBg = true;
  $('table.soupis a.fixedTip').each(function () {
    var elem = $(this);
    elem.parent()
      .css('position', 'relative')
      .css('overflow', 'visible')
    ;
    var release = elem.attr('title');
    var newElem = $('<span>')
      .text(release)
      .css('position', 'absolute')
      .css('left', '-57em')
      .css('width', '40em')
      .css('text-align', 'right')
      .css('border-radius', '3px')
      .css('height', '1.8em')
      .css('top', '0')
      .css('background-color', lightBg ? '#eee' : '#ddd')
      .css('display', 'flex')
      .css('align-items', 'center')
      .css('justify-content', 'right')
      .css('padding-right', '0.6em')
      .attr('title', 'created by monnef - ' + release)
    ;
    elem.before(newElem);
    lightBg = !lightBg;
  });
  $('div#pagewrap').css('overflow', 'visible'); // fix main wrapper to show elements outside
}

$(onLoad);
