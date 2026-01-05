// ==UserScript==
// @name        Etat des Topic JVC
// @namespace   ?
// @description Script qui permet de voir l'état des topics sur le site jeuxvideos.com
// @include     http://www.jeuxvideo.com/forums/0-*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27587/Etat%20des%20Topic%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/27587/Etat%20des%20Topic%20JVC.meta.js
// ==/UserScript==     
 
if (document.getElementsByClassName("topic-count")[1].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 445px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[1].innerText < 19 && document.getElementsByClassName("topic-count")[1].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 445px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[1].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 445px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[1].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 445px; left: 750px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[2].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 467px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[2].innerText < 19 && document.getElementsByClassName("topic-count")[2].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 467px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[2].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 467px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[2].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 467px; left: 740px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[3].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 489px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[3].innerText < 19 && document.getElementsByClassName("topic-count")[3].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 489px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[3].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 489px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[3].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 489px; left: 740px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[4].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 511px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[4].innerText < 19 && document.getElementsByClassName("topic-count")[4].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 511px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[4].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 511px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[4].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 511px; left: 740px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[5].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 533px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[5].innerText < 19 && document.getElementsByClassName("topic-count")[5].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 533px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[5].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 533px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[5].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 533px; left: 740px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[6].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 555px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[6].innerText < 19 && document.getElementsByClassName("topic-count")[6].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 555px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[6].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 555px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[6].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 555px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[7].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 577px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[7].innerText < 19 && document.getElementsByClassName("topic-count")[7].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 577px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[7].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 577px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[7].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 577px; left: 740px;  color: black;">Bide</a>');
} 



if (document.getElementsByClassName("topic-count")[8].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 599px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[8].innerText < 19 && document.getElementsByClassName("topic-count")[8].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 599px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[8].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 599px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[8].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 599px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[9].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 621px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[9].innerText < 19 && document.getElementsByClassName("topic-count")[9].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 621px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[9].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 621px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[9].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 621px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[10].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 643px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[10].innerText < 19 && document.getElementsByClassName("topic-count")[10].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 643px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[10].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 643px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[10].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 643px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[11].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 665px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[11].innerText < 19 && document.getElementsByClassName("topic-count")[11].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 665px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[11].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 665px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[11].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 665px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[12].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 687px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[12].innerText < 19 && document.getElementsByClassName("topic-count")[12].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 687px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[12].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 687px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[12].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 687px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[13].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 709px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[13].innerText < 19 && document.getElementsByClassName("topic-count")[13].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 709px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[13].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 709px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[13].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 709px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[14].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 731px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[14].innerText < 19 && document.getElementsByClassName("topic-count")[14].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 731px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[14].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 731px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[14].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 731px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[15].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 753px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[15].innerText < 19 && document.getElementsByClassName("topic-count")[15].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 753px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[15].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 753px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[15].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 753px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[16].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 775px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[16].innerText < 19 && document.getElementsByClassName("topic-count")[16].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 775px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[16].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 775px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[16].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 775px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[17].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 797px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[17].innerText < 19 && document.getElementsByClassName("topic-count")[17].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 797px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[17].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 797px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[17].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 797px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[18].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 819px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[18].innerText < 19 && document.getElementsByClassName("topic-count")[18].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 819px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[18].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 819px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[18].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 819px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[19].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 841px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[19].innerText < 19 && document.getElementsByClassName("topic-count")[19].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 841px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[19].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 841px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[19].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 841px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[20].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 863px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[20].innerText < 19 && document.getElementsByClassName("topic-count")[20].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 863px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[20].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 863px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[20].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 863px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[21].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 885px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[21].innerText < 19 && document.getElementsByClassName("topic-count")[21].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 885px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[21].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 885px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[21].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 885px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[22].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 907px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[22].innerText < 19 && document.getElementsByClassName("topic-count")[22].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 907px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[22].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 907px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[22].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 907px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[23].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 929px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[23].innerText < 19 && document.getElementsByClassName("topic-count")[23].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 929px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[23].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 929px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[23].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 929px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[24].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 951px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[24].innerText < 19 && document.getElementsByClassName("topic-count")[24].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 951px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[24].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 951px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[24].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 951px; left: 740px;  color: black;">Bide</a>');
}



if (document.getElementsByClassName("topic-count")[25].innerText >= 20) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 973px; left: 740px; color: red;">Hot</a>');
}

if (document.getElementsByClassName("topic-count")[25].innerText < 19 && document.getElementsByClassName("topic-count")[25].innerText > 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 973px; left: 740px; color: green;">Normal</a>');
}

if (document.getElementsByClassName("topic-count")[25].innerText == 19) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 973px; left: 740px; color: blue;">Hop</a>');
}

if (document.getElementsByClassName("topic-count")[25].innerText == 0) {
   $('a[class="xXx lien-jv"]').prepend('<a style="position: absolute; top: 973px; left: 740px;  color: black;">Bide</a>');
}