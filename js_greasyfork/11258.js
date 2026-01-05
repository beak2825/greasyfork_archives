// ==UserScript==
// @name        youtubespeedchange
// @description Dodaje speed change na youtube
// @namespace   costam
// @include     *youtube.com*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11258/youtubespeedchange.user.js
// @updateURL https://update.greasyfork.org/scripts/11258/youtubespeedchange.meta.js
// ==/UserScript==

var changevideospeed = function(speed)
{
  var obj = document.getElementsByTagName('video');
  if(obj.length > 0)
  {
    obj[0].playbackRate = speed;
  }
}

var changevideospeed05 = function() { changevideospeed(0.5); }
var changevideospeed10 = function() { changevideospeed(1); }
var changevideospeed15 = function() { changevideospeed(1.5); }
var changevideospeed125 = function() { changevideospeed(1.25); }
var changevideospeed175 = function() { changevideospeed(1.75); }
var changevideospeed20 = function() { changevideospeed(2); }

var init_buttons = function()
{
  var obj = document.getElementsByTagName('video');
  if(obj.length > 0 && !document.getElementById('speedchange1'))
  {
    obj = obj[0];
    var elem = document.createElement('div');
    var style = 'border: 2px solid #777777; background: #eeeeee; color: black; padding: 7px 13px; font-size: 14px;';
    var text = '<div style="padding-bottom: 13px; text-align: left;">Speed: ';
    text += '<a href="javascript:void(0)" id="speedchange1" style="'+style+'">0.5x</a> ';
    text += '<a href="javascript:void(0)" id="speedchange2" style="'+style+'">1.0x</a> ';
    text += '<a href="javascript:void(0)" id="speedchange3" style="'+style+'">1.25x</a> ';
    text += '<a href="javascript:void(0)" id="speedchange4" style="'+style+'">1.5x</a> ';
    text += '<a href="javascript:void(0)" id="speedchange5" style="'+style+'">1.75x</a> ';
    text += '<a href="javascript:void(0)" id="speedchange6" style="'+style+'">2.0x</a> ';
    text += '</div>';
    elem.innerHTML = text;
    
    var toapp = document.getElementById('watch-header');
    
    toapp.insertBefore(elem, toapp.firstChild);
    
    document.getElementById('speedchange1').onclick = changevideospeed05;
    document.getElementById('speedchange2').onclick = changevideospeed10;
    document.getElementById('speedchange3').onclick = changevideospeed125;
    document.getElementById('speedchange4').onclick = changevideospeed15;
    document.getElementById('speedchange5').onclick = changevideospeed175;
    document.getElementById('speedchange6').onclick = changevideospeed20;
  }
}

setInterval(init_buttons, 5000);