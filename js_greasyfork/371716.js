// ==UserScript==
// @name            DO User Spy
// @namespace       http://desert-operation.kazeo.com/accueil-c27905706
// @include         http*://*.gamigo.*/world*/userdetails.php?user=*
// @author          Lankou2976
// @name:fr         Do Espionne la connection du Membre
// @description:fr  Espionne la connection du Membre meme si point vert online si connexion vide jouer hors ligne si affiché date heure en ligne
// @description:en  Spy the connection of the same Member if green dot online if connection empty play offline if posted date time online  
// @version        2.1
// @description Espionne la connection du Membre meme si point vert online si connexion vide jouer hors ligne si affiché date heure en ligne
// @downloadURL https://update.greasyfork.org/scripts/371716/DO%20User%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/371716/DO%20User%20Spy.meta.js
// ==/UserScript==
function randomInt(mini, maxi) {
	var nb = mini + (maxi+1-mini)*Math.random();
	return Math.floor(nb);
} if (Userdetails = document.location.href.match(/user=([a0-z9]+)/)) {
	var ConvertDay = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
	var ConvertMonth = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
	function setCookies(sName, sValue) {
		var today = new Date(), expires = new Date();
		expires.setTime(today.getTime() + (24*60*60*1000));
		document.Cookies = sName + "=" + encodeURIComponent(sValue) + ";expires=" + expires.toGMTString();
	} function getCookies(sName) {
		var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
		if (oRegex.test(document.Cookies)) {
			return decodeURIComponent(RegExp["$1"]);
		} else {
			return null;
		}
	} function ConvertDate(Time) {
		var End = new Date(Time);
		message = ConvertDay[End.getDay()] + ' ' + End.getDate() + ' ' + ConvertMonth[End.getMonth()] + ' | ';
		var minutes = End.getMinutes();
		if(minutes < 10) minutes = "0" + minutes;
		message += End.getHours() + 'H' + minutes;
		return message;
	} Cookies = getCookies(Userdetails);
	if (document.body.innerHTML.match(/images\/classic\/icons\/bullet_green.png/g)) {
		if (Cookies == null) {
			Cookies = new Date();
			Table = new Array(Cookies);
		} else {
			Cookies += ';' + new Date();
			var Table = Cookies.split(';');
		}
		setCookies(Userdetails, Cookies);
	} else {
		if (Cookies == null) {
			Table = new Array();
		} else {
			var Table = Cookies.split(';');
		}
	} var Add = "http://desert-operation.kazeo.com" + '<Table width="100%"  border="25" cellpadding="-800" cellspacing="3"><tr bgcolor="#4D4D4D">'
		+ '<td style="";><strong> - Connexion - </strong></td></tr>';
	for (var i = 0, c = Table.length; i < c; i++) {
		if (ConvertDate(Table[i]) != ConvertDate(Table[(i-1)])) {
			Add += '<tr bgcolor="#333333"><td>' + ConvertDate(Table[i]) + '</td></tr>';
		}
	} document.body.innerHTML += Add + '</table>';
}
setTimeout('window.location.reload(true);', randomInt(300000,600000));