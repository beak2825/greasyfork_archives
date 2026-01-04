// ==UserScript==
// @name         TWRallyFarm
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Farm player villages
// @author       henriquemac (modded and adapted from fxutility.net)
// @include      https://*.tribalwars.*/game.php?village=*&screen=place
// @include      https://*.tribalwars.*/game.php?screen=place&village=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401410/TWRallyFarm.user.js
// @updateURL https://update.greasyfork.org/scripts/401410/TWRallyFarm.meta.js
// ==/UserScript==

//change coordinates here
coords = '';
var doc = document;

if(window.frames.length>0 && window.main!=null)doc=window.main.document;
url=doc.URL;
coords=coords.split(' ');index=0;
farmcookie=document.cookie.match('(^|;) ?farm=([^;]*)(;|$)');
if(farmcookie!=null)index=parseInt(farmcookie[2]);
if(index>=coords.length)alert('All villages were extracted, now start from the first!');
if(index>=coords.length)index=0;coords=coords[index];coords=coords.split('|');
index=index+1;cookie_date=new Date(2021,3,27);
document.cookie ='farm='+index+';expires='+cookie_date.toGMTString();doc.forms[0].x.value=coords[0];doc.forms[0].y.value=coords[1];

//Change unit amount here
$('#place_target').find('input').val(coords[0]+'|'+coords[1]);doc.forms[0].light.value=3;doc.forms[0].spy.value=1;end();