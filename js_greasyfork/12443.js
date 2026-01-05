// ==UserScript==
// @name        Konwerter RW dla u4k
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   homoklikus84@gmail.com
// @description precell
// @include    	http://s1.universe4k.com/game/msg_read.php?o=3
// @version     1.0.1
// @grant       precell z TVmaniacy.pl
// @downloadURL https://update.greasyfork.org/scripts/12443/Konwerter%20RW%20dla%20u4k.user.js
// @updateURL https://update.greasyfork.org/scripts/12443/Konwerter%20RW%20dla%20u4k.meta.js
// ==/UserScript==

$(document).ready(function() {

$('td[style="text-align:left;"]').addClass('RW'); //Dodanie klasy do komórki tabeli odpowiedzialnej za RW
$('td[colspan="5"]').before('<td class="main"></td><td class="main"></td>');
$('td[colspan="5"]').after('<td class="main"></td><td class="main"></td>');
$('td[colspan="2"]').before('<td></td>');
$('td[colspan="3"]').after('<td class="main"></td>');

var MyRC = $('.RW').html();

MyRC = MyRC.replace(/<center>/g, '[align=center][color=#006666][b]');
MyRC = MyRC.replace(/<\/center>/g, '[/b][/color][/align]');
MyRC = MyRC.replace(/<table style=\"text-align:center;\" width=\"99%\">/g, '[table]');
MyRC = MyRC.replace(/<\/table>/g, '[/table]');
MyRC = MyRC.replace(/<td class=\"main\" width=\"180\">/g, '[td]');

MyRC = MyRC.replace(/<tbody>/g, '');
MyRC = MyRC.replace(/<\/tbody>/g, '');
MyRC = MyRC.replace(/<tr>/g, '[tr]');
MyRC = MyRC.replace(/<\/tr>/g, '[/tr]');
MyRC = MyRC.replace(/<td colspan=\"5\" class=\"main\">/g, '[td]');
MyRC = MyRC.replace(/<td colspan=\"2\" class=\"main\">/g, '[td]');
MyRC = MyRC.replace(/<td>/g, '[td]');
MyRC = MyRC.replace(/<\/td>/g, '[/td]');
MyRC = MyRC.replace(/<td class=\"main\" width=\"20%\">/g, '[td]');
MyRC = MyRC.replace(/<td class=\"main\" width=\"15%\">/g, '[td]');
MyRC = MyRC.replace(/<td class=\"main\">/g, '[td]');
MyRC = MyRC.replace(/<td colspan=\"5\">/g, '');
MyRC = MyRC.replace(/<td class=\"main\" valign=\"top\">/g, '[td]');
MyRC = MyRC.replace(/<td colspan=\"2\">/g, '[td]');
MyRC = MyRC.replace(/<td colspan=\"3\">/g, '[td]');
MyRC = MyRC.replace(/<br>/g, '');
MyRC = MyRC.replace(/<a href="(.*?)">/g, '');
MyRC = MyRC.replace(/<a class=\"tip_trigger\" href="(.*?)">/g, '');
MyRC = MyRC.replace(/<\/a>/g, '');
//Angielski//
MyRC = MyRC.replace(/Battle round 1/g, '[color=#0000FF][b]Battle round 1[/b][/color]');
MyRC = MyRC.replace(/Battle round 2/g, '[color=#0000FF][b]Battle round 2[/b][/color]');
MyRC = MyRC.replace(/Battle round 3/g, '[color=#0000FF][b]Battle round 3[/b][/color]');
MyRC = MyRC.replace(/Battle round 4/g, '[color=#0000FF][b]Battle round 4[/b][/color]');
MyRC = MyRC.replace(/Battle round 5/g, '[color=#0000FF][b]Battle round 5[/b][/color]');
MyRC = MyRC.replace(/Units/g, '[b][color=#804000]Units[/color][/b]');
MyRC = MyRC.replace(/Sum/g, '[color=#00BF40][b]Sum [/b][/color]');
MyRC = MyRC.replace(/Destroyed/g, '[b][color=#FF0000]Destroyed [/color][/b]');
MyRC = MyRC.replace(/Captured/g, '[b][color=#009900]Captured[/color][/b]');
MyRC = MyRC.replace(/Details/g, '[b][color=#996600]Details[/color][/b]');
MyRC = MyRC.replace(/Iron/g, '[b]Iron[/b]');
MyRC = MyRC.replace(/Lutinum/g, '[b]Lutinum[/b]');
MyRC = MyRC.replace(/Water/g, '[b]Water[/b]');
MyRC = MyRC.replace(/Hydrogen/g, '[b]Hydrogen	[/b]');
MyRC = MyRC.replace(/Resources/g, '[b][color=#009900]Resources[/color][/b]');
//Polski//

//Niemiecki//

$('.RW').append('<div><form action="noaction"><textarea id="bbcode" cols="50" rows="6">'+MyRC+'</textarea><input type="button"  class="planet" value="Zaznacz bbCode" onClick="javascript:bbcode.focus();bbcode.select();"></form></div>'); //Dodanie pola tekstowego pod każdym raportem
$('#bbcode').append('Generator RW by Precell z [url]http://tvmaniacy.pl[/url]');


});