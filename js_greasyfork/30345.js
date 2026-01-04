// ==UserScript==
// @name        pg-bhp
// @namespace   jachoo
// @include     https://enauczanie.pg.edu.pl/moodle/mod/lesson/view.php?id=*
// @include     https://enauczanie.pg.edu.pl/moodle/course/view.php?id=425
// @include     https://enauczanie.pg.edu.pl/moodle/mod/lesson/continue.php
// @version     1
// @grant       none
// @description:pl Skrypt zaliczający szkolenie BHP na PG poprzez enauczanie. Należy wejść na stronę szkolenia BHP mając odblokowane otwieranie okienek. Quiz końcowy należy rozwiązać samemu, no bo już bez przesady ;) https://enauczanie.pg.edu.pl/moodle/course/view.php?id=425
// @description Skrypt zaliczający szkolenie BHP na PG poprzez enauczanie. Należy wejść na stronę szkolenia BHP mając odblokowane otwieranie okienek. Quiz końcowy należy rozwiązać samemu, no bo już bez przesady ;) https://enauczanie.pg.edu.pl/moodle/course/view.php?id=425
// @downloadURL https://update.greasyfork.org/scripts/30345/pg-bhp.user.js
// @updateURL https://update.greasyfork.org/scripts/30345/pg-bhp.meta.js
// ==/UserScript==

if(document.location == "https://enauczanie.pg.edu.pl/moodle/course/view.php?id=425"){
  f = function(index, element){
    try{
    var href = $(this).attr("href");
    var ukonczone = $(this).parent().parent().find("img.smallicon")[0].title;
    console.log("Title: " + ukonczone);
    if(ukonczone.startsWith("Nie")){
      console.log("Otwieram okno: " + href);
      unsafeWindow.open(href);
    }
    }catch(e){console.error(e);}
  };
  
  $(".activityinstance a").each(f);
}

if(document.location.href.startsWith("https://enauczanie.pg.edu.pl/moodle/mod/lesson/view.php")){
  var kontynuacja = $("div.box>span.standardbutton>a:contains(Tak)");
  if(kontynuacja && kontynuacja.length>0){
    console.log("klikam tak");
    kontynuacja[0].click();
  }
  var nastepny = $("input[type=submit][value$=astępna]");
  if(nastepny && nastepny.length>0){
    console.log("klikam 'nastepny'");
    nastepny[0].click();
  }
  var przeslij = $("input[type=submit][value=Prześlij]");
  if(przeslij && przeslij.length>0){
    console.log("sprawdzam poprawna odpowiedz");
    var cmp = function(a,b){
      var aa = parseInt(a.value);
      var bb = parseInt(b.value);
      return aa-bb;
    };
    var odp = $("div.answeroption input[name=answerid][type=radio]");
    console.log("Odpowiedzi: " + odp.length);
    odp = odp.sort(cmp);
    console.log("Posortowalem.");
    console.log("Poprawna odpowiedz: " + odp[1].value);
    odp[1].checked = true;
    przeslij.click();
  }
}

if(document.location.href.startsWith("https://enauczanie.pg.edu.pl/moodle/mod/lesson/continue.php")){
  console.log("klikam 'nastepny'");
  $("input[type=submit][value=Kontynuuj]")[0].click();
}
