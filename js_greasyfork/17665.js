// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         openload
// @version      0.14.8
// @description  Remove anti-adblock, ads, popups and timer waits, and show direct download link
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAA/FBMVEUAAAAeP2MAmNkAoN8hNlgSSWwXLUgEITELKT8OMEkAn94Ant4AmtsAldQBW4MFh8YAktQBicxjT5sAnt4AX4lEcbUTeLBgVqBcXKMAnNxMS4pKbbEuQGwAmtoAY44xebwAk9QGjM1jT5tcTZUPM01jT5s7OGZfWKEAaJUAod8Ak9VYYqhSZKgVg8Ujf8AKSm4Agr5mPZRmPZRmPZRlR5gAod8AldNXXKEAltQAjMcAmNVWZKpeWaJUZqtKbbE+dbg+dLdEcLM7d7omgMExersAk9RgVqA7aKUAod8Ak9UAn99lR5gAm9wJhshRaa0ue74mgMEAjdBmPZQ7d7qePASIAAAASHRSTlMAOP75GiksAgcPxb3QS0Nh0+T+0hj+Yv796m3PSLNc0eF0vYgg7l/DOPDs/ejo11dV+LpM8et8qaduicHV0L7Jrer75omU6GL8xLQIAAABaklEQVR42u1S2XaCMBQMaxJAAcUFRcG673Zzb9VWW4Pi0v7/vzSCcDz9hfY+3pnMmZkb8IcG8YIoVNDtQhRFPlyg+LQgy3JhE4fBAjLr5evrbFS2fAqeJDl3v9+zrDbwGShtv6VSh0M7O89hipearsuZTotliaMiAFH6/fidWnU67WymShmx5pZLpjHAaY2QggiQ2j0dbQrg3DyTeHoE8nYrNXzpuOZseKjq3sm2Aiv1xO4BcNvnIrp66wtwoHtez4KB+1p1dw+oABPFgwON4v0wn3i3+6KEQiXCY9rZ0yMcVAKCJIaFUPysFxGGNwqBh/A9Oeuqoa6ZWw80hRykoDjRSzDePdnMTQragysVDWSoCiGtEr4QjotPHvG1ut8DnnKuayYVxWRJa4ghrZY2ucrnXzrZTKKMAcRD0w1u4UwQBJeue9dbfJR56F9zLCmKIo0bYTxmuaAKs5GFwvyGIAgG/PVB6Ov/ieYHpLEydStkqm4AAAAASUVORK5CYII=
// @include      http://openload.co
// @include      /^(https?:)?\/\/(openload\.(co|pw)|oload\.(\w+)|oladblock\.(me|services|xyz))\/*.*/
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/17665/openload.user.js
// @updateURL https://update.greasyfork.org/scripts/17665/openload.meta.js
// ==/UserScript==
(function(){
 //
 // @run-at document-start
 //
 window.adblock=false;
 window.adblock2=false;
 window.turnoff=true;
 window.open=function(){};
 //
 // @run-at document-end
 //
 function onready(fn){if(document.readyState!='loading')fn();else document.addEventListener('DOMContentLoaded',fn);}

 onready(function(){
  if( document.location.href.match(/\/embed\//) || $('#realdl>a') )
  {
   $('#btnView').hide();
   $('#btnDl').hide();
   $('.dlButtonContainer').show();
   $('h3.dlfile.h-method').hide();
   $('.col-md-4.col-centered-sm *').remove();
   $('#mgiframe,#main>div[id]').remove();
   $('#downloadTimer').hide();
   $('#mediaspace_wrapper').prepend( $('<div/>').attr('id', 'realdl')
    .attr('style', 'position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: .5em 0;')
    .on('mouseenter', function(){ $(this).fadeTo(500, 1); }).on('mouseleave', function(){ $(this).fadeTo(500, 0); })
    .append( $('<a/>').attr('href', '').attr('style', 'color: #fff; text-decoration: none; -moz-user-select: none;').text('DOWNLOAD') )
    .append( $('<span/>').attr('style', 'color: #fff; padding-left: 1em;').attr('id', 'steamcopy') ) );
   $('#realdl').show();
   var streamurl_tmr = setInterval(function(){
    // <@snippet edited author="https://greasyfork.org/forum/profile/daedelus" src="https://greasyfork.org/forum/discussion/36362/x">
    var streamurl_src;
    var streamurl_end = false;
    $('p[id]').each(function(){
     if( !streamurl_end )
     {
      streamurl_src = streamurl_src || ($(this).text().match(/^[\w\.~-]+$/) /*TEMP_FIX: && $(this).text().match(/~/) */) ? $(this).text() : streamurl_src;
      if( streamurl_src )
       streamurl_end = true;
     }
    });
    // </@snippet>
    if( streamurl_src )
    {
     var streamurl_url = location.origin + '/stream/' + /*TEMP_FIX: streamurl_src + */$('#DtsBlkVFQx').text();
     $('#realdl a').attr('href', streamurl_url);
     $('#steamcopy').text( streamurl_url );
     $('#videooverlay').click();
     $('div[style]').each(function(){ if(this.style.zIndex&&this.id!='realdl') this.remove(); });
     clearInterval(streamurl_tmr);
    }
   },100);
  }
  window.onclick=function(){};
  document.onclick=function(){};
  document.body.onclick=function(){};
 });

})();