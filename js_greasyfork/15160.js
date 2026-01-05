// ==UserScript==
// @name        Gladiatus Pack Viewer
// @namespace   loklizacja
// @description Created by miotacz s17 PL
// @include     https://s*.gladiatus.gameforge.com/game/index.php?mod=guildBankingHouse*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15160/Gladiatus%20Pack%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/15160/Gladiatus%20Pack%20Viewer.meta.js
// ==/UserScript==

var article = document.createElement("article");
document.getElementById("content").appendChild(article);

article.innerHTML =
"\
<br> \
<h2 class=\"section-header\" style=\"cursor: pointer;\">Kalkulator VAT za paczki</h2> \
<section style=\"display: block;\"> \
   <table width=\"100%\" align=\"center\"> \
      <tbody> \
         <tr> \
            <th>Jaki jest twój przeciętny dzienny zarobek?</th> \
            <th align=\"right\"> \
               <input id=\"vi1\" type=\"text\" maxlength=\"10\" style=\"width: 138px; display: inline-block;\" > \
            </th> \
            <th> <img title=\"Złota\" alt=\"złoto\" align=\"absmiddle\" src=\"https://s17-pl.gladiatus.gameforge.com/game/9194/img/res2.gif\" style=\"display: inline-block; float: right;\" /> </th> \
         </tr> \
         <tr> \
            <th>Przez ile tygodni będziesz się pakował?</th> \
            <th align=\"right\"> \
               <input id=\"vi2\" type=\"text\" maxlength=\"2\" style=\"width: 138px;\"> \
            </th> \
            <th style=\"position: relative; right: -2px;\"> <img title=\"tygodni\" alt=\"tygodni\" src=\"http://united.giercmania.pl/GL/Przewodnik/53.gif\" /> </th> \
         </tr> \
         <tr> \
            <th> \
               <input class=\"button2\" type=\"submit\" value=\"Sprawdź!\" id=\"vcheck\"> \
            </th> \
         </tr> \
         <tr> \
            <th id=\"GPV_output\" style=\"\" colspan=\"2\"></th> \
         </tr> \
      </tbody> \
   </table> \
</section> \
";


document.getElementById("vcheck").onclick = function()
{
var vi1 = document.getElementById("vi1").value;
var vi2 = document.getElementById("vi2").value;
var GPV_output = document.getElementById("GPV_output");

if(isNaN(vi1) || isNaN(vi2) || vi1<1000 || vi2<1)
{
    GPV_output.innerHTML = "Wypełnij pola poprawnie !";
}
else
{
    var P = Math.ceil(vi1/50);
    var T = Number(vi2);
    var K = (14*P*T*(T+1))/2;

    GPV_output.innerHTML =
        "\
        Po "+"<b>"+vi2+"</b>"+" tygodniach Pakowania zarabiając codziennie:"+"<br><b>"+vi1+"</b>"+" "+"<img title=\"Złota\" src=\"https://s17-pl.gladiatus.gameforge.com/game/9194/img/res2.gif\" /><br> \
        poniesiesz łączny koszt VAT wszystkich paczek równy: "+"<br><b>"+K+"</b>"+" "+"<img title=\"Złota\" src=\"https://s17-pl.gladiatus.gameforge.com/game/9194/img/res2.gif\"/><br><br><br> \
        <p style=\"color: grey; font-weight: normal;\">- Uwaga! Kapitał początkowy musi być równy 0</p>\
        <p style=\"color: grey; font-weight: normal;\">- 100% zarobku musi być przeznaczone na trening </p>\
        <p style=\"color: grey; font-weight: normal;\">- Algorytm bada jaką stratę poniesiemy po x tygodniach Pakowania</p>\
        <p style=\"color: grey; font-weight: normal;\">- <b>Pakowanie</b> to łączny czas robienia paczek co tydzień</p>\
        <p style=\"color: grey; font-weight: normal;\">- Pakowanie zaczyna się od momentu zrobienia pierwszej paczki </p>\
        <p style=\"color: grey; font-weight: normal;\">- Nie ma znaczenia, czy wykonamy daną paczkę ponownie na początku czy na końcu przyszłego tygodnia </p>\
        <p style=\"color: grey; font-weight: normal;\">- Uwaga! Dziesiąty tydzień pakowania niezależnie od dziennego zarobku daje minimalny zysk! (przy treningu -23%). Każdy kolejny tydzień to pewna strata.</p>\
        <p style=\"color: grey; font-weight: normal;\">- Przykład użycia: Jeżeli Twój kapitał jest równy 0 i za 30 dni jest event -20% treningu to znaczy, że czas pakowania wynosi 4 tygodnie, JEDNAKŻE Pakowanie zaczyna się od momentu zrobienia pierwszej paczki, czyli od dnia ósmego. Te 4 tygodnie to tak naprawdę 3 tygodnie + 2 dni. To będzie uwzględnione w przyszłości (wybór daty w kalendarzu itp).</p>\
        ";
}
};