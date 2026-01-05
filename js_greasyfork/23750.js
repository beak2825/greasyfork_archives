// ==UserScript==
// @name         Caravelle inventaire
// @namespace    
// @version      0.1
// @description  Aucune
// @author       Thathanka Iyothanka
// @match        http://tw-db.info/?strana=invent&x=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23750/Caravelle%20inventaire.user.js
// @updateURL https://update.greasyfork.org/scripts/23750/Caravelle%20inventaire.meta.js
// ==/UserScript==

(function() {
$('#char_server').after('&nbsp;<a href="#" id="caravelle">Caravelle</a>');
$('#caravelle').on('click',function(){
var names = ["Tabac","Coton","Pyrite","Dindon","Peau de castor","Peau de bison","Haricots","Maïs","Orange","Poudre d'or","Myrtille","Peau de serpent","Peau de puma","Rubis","Émeraude brute","Diamant brut","Café moulu","Bâton de cérémonie","Piment vert","Peau d'alligator"];
var items = ["702000","704000","708000","709000","714000","724000","746000","748000","791000","1791000","1811000","1820000","1824000","1828000","1829000","1830000","2162000","2444000","2447000","2455000"];
var prices = [100,150,500,400,300,1000,350,400,300,2500,200,1750,1500,7500,7500,10000,50,5000,1250,2000];
var numbers = [];
var total = 0;
var data = "[SIZE=4][B]<br/>";
for (i=0;i<items.length;i++){
if (document.getElementById('i'+items[i])!==null){
numbers[i]=parseInt(document.getElementById('i'+items[i]).textContent);
total += numbers[i] * prices [i];
data +=  names[i] + ' [COLOR=#0000ff]' + prices[i] + '$ x' + numbers[i] + ' = [COLOR=#ff0000]'+ numbers[i] * prices [i] +'$[/COLOR][/COLOR]<br/>';
} else {
data += names[i] + ' [COLOR=#0000ff]' + prices[i] + '$[/COLOR]<br/>';
}
}
data+='<br/>[COLOR=#ff0000][COLOR=#000000]TOTAL[/COLOR] '+total+'$[/COLOR]<br/>[/B][/SIZE]';
myWindow = window.open("data:text/html;charset=utf-8," + encodeURIComponent(data),"_blank");
myWindow.focus();
});
})();