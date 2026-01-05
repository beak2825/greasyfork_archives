// ==UserScript==
// @name        HWM_Tavern_AutoAccept
// @author      Zeleax
// @namespace   Zeleax
// @description Автоматически принимает предложение играть в таверне
// @include /https?:\/\/(www.heroeswm.ru|178.248.235.15|www.lordswm.com|my.lordswm.com)\/(tavern.php)/
// @version     1.2
// @license MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19849/HWM_Tavern_AutoAccept.user.js
// @updateURL https://update.greasyfork.org/scripts/19849/HWM_Tavern_AutoAccept.meta.js
// ==/UserScript==
var s=getI("(//a[contains(@href,'acard_game.php')])[1]");
if(s.snapshotLength>0) window.open(s.snapshotItem(0),'_self');

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
