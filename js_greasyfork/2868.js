// ==UserScript==
// @description Zeigt bei Zalando an Umsatz
// @grant		none
// @icon		https://static.zalando.de/s/hhe/zalando/img/MAIN/zalando.ico
// @name        Zalando Umsatz
// @namespace   lolnickname
// @include     https://www.zalando.de/benutzerkonto/bestellungen/*
// @version     0.2
// @downloadURL https://update.greasyfork.org/scripts/2868/Zalando%20Umsatz.user.js
// @updateURL https://update.greasyfork.org/scripts/2868/Zalando%20Umsatz.meta.js
// ==/UserScript==

checkLitmit();

function checkLitmit()
{
    var n = document.getElementsByClassName('amount')[0].textContent.match(/(\d+) bis (\d+) \/ (\d+) gesamt/);
    var startOrder = n[1];
    var endOrder = n[2];
    var totalOrders = n[3];
    if ((endOrder == totalOrders) || (endOrder == 200) || (startOrder != 1))
    {
        sumUpTurnOver();
    } else {
        reloadToDisplayAll();
    }
}

function reloadToDisplayAll()
{
    var option = document.createElement("option");
    var n = document.getElementsByClassName('amount')[0].textContent.match(/(\d+) \/ (\d+) gesamt/);
    var totalOrders = n[2];
    totalOrders = (totalOrders > 200) ? 200 : totalOrders;
    option.text = totalOrders;
    option.value = totalOrders;
    document.getElementsByTagName('select')[0].add(option, null);
    document.getElementsByTagName('select')[0].selectedIndex = 3;
    document.getElementsByClassName('limiter')[0].parentNode.submit();
}

function sumUpTurnOver()
{
    var sum = 0.0;
    var oTotal = document.getElementsByClassName('oTotal');
    for (var i = 1; i < oTotal.length; i++)
    {
        var s = oTotal[i].textContent;
        s = s.replace(/\s/,"");
        s = s.replace("€","");
        s = s.replace(",",".");
        sum += parseFloat(s);
        sum = myRound(sum, 2);
    }
    oTotal[0].textContent = "Umsatz = " + sum;
}

function myRound(zahl,n)
{
    var faktor;
    faktor = Math.pow(10,n);
    return(Math.round(zahl * faktor) / faktor);
}