// ==UserScript==
// @name         WOŚP
// @namespace    http://www.wykop.pl/ludzie/polaq/
// @version      2137.0
// @description  XD
// @author       @polaq
// @match        http://www.wykop.pl/*
// @match        https://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26563/WO%C5%9AP.user.js
// @updateURL https://update.greasyfork.org/scripts/26563/WO%C5%9AP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html2 = '<li class="entry iC"> <div class="wblock lcontrast dC " data-id="21322609" data-type="entry"><a name="comment-21322609" style="position: relative; top: -120px">&nbsp;</a><a class="profile" href="http://www.wykop.pl/ludzie/m__b/" title=""><img class="avatar male lazy" src="http://xF.cdn02.imgwykop.pl/c3397992/m__b_Fg7iMydYSe,q40.jpg" alt=""></a><div><div class="author ellipsis "><a class="color-5 showProfileSummary" href="http://www.wykop.pl/ludzie/m__b/" title="" data-hasqtip="0"><b>m__b</b></a><a href="http://www.wykop.pl/wpis/21322609/polecamy-biznes-naszego-wykopowicza-lizawka-hrpc-l/"><small class="affect"><time title="2016-12-27 13:04:23" datetime="2016-12-27T13:04:23+01:00" pubdate="">2 tyg. temu</time></small></a><small class="affect"></small> <p class="vC" data-vc="72" data-vcp="0" data-vcm="0"> <b class=""><span class="c2a7017">+2137</span></b> <a class="button mikro ajax" href="#site" disabled=""><i class="fa fa-plus" disabled=""></i></a> <i class="fa fa-bookmark favourite red"></i></p></div><div class="text"><p>KIEDYŚ SPOTKAŁEM OWSIAKA NA POGRZEBIE JAKIEJŚ SŁAWNEJ OSOBY. PODOCHODZĘ DO NIEGO I MÓWIĘ "CZEŚĆ OWSIAK TY SKURWYSYNU". A ON TYLKO "ELO" I ODWRACA GŁOWĘ. SPRZEDAŁEM MU BLACHĘ W POTYLICĘ I MÓWIĘ "SŁUCHAJ MNIE BO CI NIE DAM KASY NA ZIARNO DLA KUR". JUREK COŚ TUPNĄŁ, COŚ MRUKNĄŁ ALE MÓWI "DOBRA SŁUCHAM CIEBIE CIERPLIWIE, CO MASZ MI DO POWIEDZENIA". "CZEMU SPRZEDAWAŁEŚ URAN CZECZENOM?" NA TO OWSIAK POWIEDZIAŁ DO MNIE - "TY KURWA GNOJU" I PRZYKLEIŁ MI SERDUSZKO DO CZOŁA. POTEM UCIEKŁ DO LASU.<br><br>#<a class="showTagSummary" href="http://www.wykop.pl/tag/wosp" data-hasqtip="1">wosp</a> #<a class="showTagSummary" href="http://www.wykop.pl/tag/truestory" data-hasqtip="2">truestory</a> </p></div><div class="row elements actions"><a href="" class="affect hide" data-login=""><i class="fa fa-reply"></i> odpowiedz</a> <ul class="responsive-menu"> <li><a href="#" class="affect hide"><i class="fa fa-bars"></i></a></li><li><a href="#site" class="affect hide ajax"><i class="fa fa-star"></i> ulubiony</a></li><li><a href="" class="affect hide"><i class="fa fa-flag-o"></i> zgłoś</a></li><li><a href="#site" class="affect hide"><i class="fa fa-chain"></i> link</a></li></ul> <a class="embed-button ajax" data-ajaxurl="http://www.wykop.pl/ajax2/widget/entry/21322609/" href="#"><span>‹</span> embed <span>›</span></a></div></div></div><ul class="sub"></ul> </li>';
    var html = '<h4>KIEDYŚ SPOTKAŁEM OWSIAKA NA POGRZEBIE JAKIEJŚ SŁAWNEJ OSOBY. PODOCHODZĘ DO NIEGO I MÓWIĘ "CZEŚĆ OWSIAK TY SKURWYSYNU". A ON TYLKO "ELO" I ODWRACA GŁOWĘ. SPRZEDAŁEM MU BLACHĘ W POTYLICĘ I MÓWIĘ "SŁUCHAJ MNIE BO CI NIE DAM KASY NA ZIARNO DLA KUR". JUREK COŚ TUPNĄŁ, COŚ MRUKNĄŁ ALE MÓWI "DOBRA SŁUCHAM CIEBIE CIERPLIWIE, CO MASZ MI DO POWIEDZENIA". "CZEMU SPRZEDAWAŁEŚ URAN CZECZENOM?" NA TO OWSIAK POWIEDZIAŁ DO MNIE - "TY KURWA GNOJU" I PRZYKLEIŁ MI SERDUSZKO DO CZOŁA. POTEM UCIEKŁ DO LASU.</h4>';

   $("a[href='http://www.wykop.pl/tracker/49/285/']").attr("href", "#site").click(function(){
       $("ul#itemsStream").html(html2);
   });
})();