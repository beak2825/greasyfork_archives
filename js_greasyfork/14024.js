// ==UserScript==
// @name         Vietnamnet Filter
// @namespace    https://greasyfork.org/vi/users/20451-anh-nguyen/
// @version      0.3
// @description  Edit UI Vietnamnet.vn
// @author       Paul Nguyen
// @grant        none

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include        /^http?://vietnamnet\.vn/.*$/

// @downloadURL https://update.greasyfork.org/scripts/14024/Vietnamnet%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/14024/Vietnamnet%20Filter.meta.js
// ==/UserScript==

$('div.VnnAdsPos').empty();
$('div.VnnAdsPos').css("display","none");
$('div#TopWraper').remove();
$('div#MenuTopWraper').remove();
$('div#BodyRightWraper').remove();
$('div.fmsidWidgetTaskbar').remove();
$('div#footer').remove();
$('div.BottomWraper').remove();
$('div.VnnBox').remove();
$('div#MidRightWraper').remove();
$('div#MidLeftWraper').css("margin","0 auto");
$('div#MidLeftWraper').css("float","none");
$('div#BodyWraper .clearfix:first').css("width","700px");
$('div#BodyWraper .clearfix:first').css("margin","0 auto");
$('body').css("margin-top","-30px");
$('div.VnnWeatherBox').remove();
$('div.ngoaite-title').next('div.margin-top-5').remove();
$('div.ngoaite-title').next('div.ngoaite-data').remove();
$('div.ngoaite-title').remove();
$('div.vang-data').next('a').remove();
$('div.vang-ngoaite').prependTo('div.topHotAndLastestTab');
