// ==UserScript==
// @author      FIRAT
// @name        TeknoIZDIRAP-Yedek
// @namespace   http://teknoizdirap.com
// @description Teknoseyir.com için gelişmiş özellikler
// @include     https://teknoseyir.com/*
// @exclude     https://teknoseyir.com/wp-*
// @version     1.0.1
// @icon        http://teknoizdirap.com/izdirap48.png
// @icon64      http://teknoizdirap.com/izdirap64.png
// @require     https://greasyfork.org/scripts/33559-favicon/code/Favicon.js?version=220795
// @require     https://greasyfork.org/scripts/41019-canvas/code/Canvas.js?version=267301
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/41020/TeknoIZDIRAP-Yedek.user.js
// @updateURL https://update.greasyfork.org/scripts/41020/TeknoIZDIRAP-Yedek.meta.js
// ==/UserScript==

function parseLocal (local) {
    var parsed;
    try {
        parsed = JSON.parse(localStorage.getItem(local));
    } catch (e) {
        localStorage.removeItem(local);
        return false;
    }
    return parsed;
}

jqHata= parseLocal("jqHata");
function jqHataKaydet(){
    localStorage.setItem("jqHata", true);
}

if(typeof $ == 'undefined' && jqHata!=true){
    document.body.innerHTML+="<div style='z-index:10000;position:fixed;left:10px;bottom:10px;font-size:28px;font-weight:bold;background-color:#ff0000;color:#fff' id ='update'></div>";
    updateDiv= document.getElementById("update");
    updateDiv.innerHTML= "TeknoIzdırap - Jquery hatası tespit edildi<br><br>";
    updateDiv.innerHTML+= "Eğer script düzgün çalışıyorsa <a id='jqHataKapat' href=''>BURAYA</a> tıklayın <br>(Sayfa yenilenecek ve bu uyarı bir daha görünmeyecektir).<br><br>";
    updateDiv.innerHTML+= "Eğer fonksiyonlar düzgün çalışmıyorsa aşağıdaki satırı olduğu gibi kopyalayıp<br> scriptin ilk 10 satırındaki şekilde scripte ekleyerek tekrar deneyin<br>";
    updateDiv.innerHTML+= "// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js?ver=3.2.1<br><br>";
    updateDiv.innerHTML+= "<a target='_new' href='https://teknoseyir.com/durum/673699'>Yardım için</a>";
    document.getElementById("jqHataKapat").addEventListener ("click", jqHataKaydet, false);
    return;
}

$("body").append("<div class='update' id ='update'></div>");
updateDiv= document.getElementById("update");

$("body").append("<div class='notifications' id ='notifications'></div>");

//VERSİYON AYARLARI
var version = '1.0';
console.log("TeknoIzdırap v"+ version);
lastVersion = localStorage.getItem('lastVersion');
if(!lastVersion) lastVersion='0.0.0';
depoVersion = localStorage.getItem('depoVersion');
if(!depoVersion) depoVersion='0.0.0';
if(version.length==3) version+=".0";
versionFloat=parseFloat(version.substring(0,3));
lastVersionFloat=parseFloat(lastVersion.substring(0,3));
depoVersionFloat=parseFloat(depoVersion.substring(0,3));
versionFullFloat=parseFloat(version.replace(".","").replace(".",""));

//Yeni Sürüm Kontrol
updateTimeout = 0;
updateDelay = 60*60*3;
function versionCheck(){
    var updateFark= new Date().getTime()/1000-localStorage.getItem("versionJsonUp");
    if(localStorage.getItem("versionJson") && updateFark<updateDelay){
        updateTimeout = Math.floor(updateDelay - updateFark);
        window.versionJson = parseLocal("versionJson");
        if(versionJson) versionAlert();
    }else{
        console.log("Yeni Sürüm kontrol ediliyor");
        updateTimeout = updateDelay;
        $.get('https://teknoizdirap.com/j/ver', function (data, textStatus, jqXHR) {
            var jsons = JSON.stringify(data);
            window.versionJson = JSON.parse(jsons);
            if(versionJson){
                localStorage.setItem("versionJson", jsons);
                localStorage.setItem("versionJsonUp", (new Date().getTime())/1000);
                versionAlert();
            }
        });
    }
    console.log("Yeni sürüm " + updateTimeout+" saniye sonra tekrar kontrol edilecek");
    setTimeout(versionCheck,1000+updateTimeout*1000);
}
versionCheck();
function versionAlert(){
    //latestVersionFloat = parseFloat(window.versionJson["ver"].substring(0,3));
    latestVersionFullFloat = parseFloat(window.versionJson["ver"].replace(".","").replace(".",""));
    if(latestVersionFullFloat > versionFullFloat){
        updateDiv.innerHTML= ("TeknoIzdırap Eklentisi Güncellemesi Mevcut (v" + window.versionJson["ver"] + ")...<br>");
        updateDiv.innerHTML+="Güncellemek için <a target='_new' href='https://greasyfork.org/tr/scripts/29000-teknoizdirap'>TIKLAYIN</a>.<br>";
        updateDiv.innerHTML+= "Geri bildirimleri <a target='_new' href='https://teknoseyir.com/durum/673699'>ŞURAYA</a> yazabilirsiniz ?<br>";
        updateDiv.innerHTML+= "Güncelledikten sonra tüm Teknoseyir sekmelerini yenilemeyi unutmayın.";
        updateDiv.innerHTML+="<div id='hideAlert' class='hideAlert'>X</div>";
    }
}

//Güncellendi Uyarısı
if(versionFloat>depoVersionFloat){
    localStorage.setItem('depoVersion',version);
    localStorage.setItem('lastVersion',depoVersion);

    updateDiv.innerHTML= ("TeknoIzdırap Eklentisi Güncellendi (v" + version + ")...<br>");
    updateDiv.innerHTML+="Yeni özellikleri kontrol ve aktive etmek için <a href='https://teknoseyir.com/ayarlar'>ayarlar</a> sayfasına gidin.<br>";
    updateDiv.innerHTML+="Bu uyarı yeni özellik eklediğinde sadece bir kereliğine görüntülenecektir.";
    updateDiv.innerHTML+="<div id='hideAlert' class='hideAlert'>X</div>";
    localStorage.setItem("changelogAktif",true);
}

//TROLSAVAR AYARLARI
trollDay = 3;
trollDo="Gizle";
if(localStorage.getItem('trollDay')) trollDay = localStorage.getItem('trollDay').trim();
if(localStorage.getItem('trollDo')) trollDo = localStorage.getItem('trollDo').trim();

//HORTSAVAR AYARLARI
hortDay = 60;
hortDo="Uyar";
if(localStorage.getItem('hortDay')) hortDay = localStorage.getItem('hortDay').trim();
if(localStorage.getItem('hortDo')) hortDo = localStorage.getItem('hortDo').trim();

//KELİME ENGELLEME AYARLARI
engellenecekler="wcx\nwcex";
if(localStorage.getItem('engellenecekler')) engellenecekler = localStorage.getItem('engellenecekler').trim();
var lines = engellenecekler.toLowerCase().split("\n");

geceModAktif=false;
teknoTwitAktif=false;
aramaAktif=false;
rutbeAktif=false;
uyelikTarihiAktif=false;
trollSavarAktif=false;
hortSavarAktif=false;
kelimeEngelleAktif=false;
durumSayisiAktif=false;
yorumSayisiAktif=false;
uyeDetayJsonLoaded=false;
kesfetReady=false;
darkMode=false;
profilAktif=false;
yorumParlatAktif=false;
spoilerAktif=false;
spoilerButonuAktif=false;
quoteButonuAktif=false;
linkButonuAktif=false;
codeButonuAktif=false;
aboneTabloAktif=true;
aboneTabloAltAktif=false;
changelogAktif=true;
if(localStorage.getItem('aboneTabloAktif')===null) localStorage.setItem('aboneTabloAktif',true);
if(localStorage.getItem('changelogAktif')===null) localStorage.setItem('changelogAktif',true);
if(localStorage.getItem('kesfetT')===null)  localStorage.setItem("kesfetT","gun");
if(localStorage.getItem('kesfetF')===null) localStorage.setItem("kesfetF","okunma");
bildirimSayiDepo=0;
var vimeoJump=5;
if(localStorage.getItem('vimeoJump')) vimeoJump = localStorage.getItem('vimeoJump').trim();


var sonuc = null;
function yaz(s){
    if(!resultDiv){
        setTimeout(yaz(s),1000);
        return;
    }
    if (sonuc) {
        clearTimeout(sonuc);
        sonuc = null;
    }
    console.log(s);
    resultDiv.innerHTML = s;
    sonuc = setTimeout(function(){ resultDiv.innerHTML ='';},5000);
}

//Plus Renk Ayarı
if(!localStorage.getItem("plusBadgeColor")) localStorage.setItem("plusBadgeColor",'#eea236');
plusBadgeColor = localStorage.getItem("plusBadgeColor");

//favicon
if(!localStorage.getItem("favBgColor")) localStorage.setItem("favBgColor",'#1a53ff');
if(!localStorage.getItem("favTextColor")) localStorage.setItem("favTextColor",'#fff');
var favicon=new Favico({
    bgColor : localStorage.getItem("favBgColor"),
    textColor : localStorage.getItem("favTextColor"),
    animation:'none'//slide, fade, pop, popFade, none

    //http://lab.ejci.net/favico.js/
    //fontFamily : 'Arial, Verdana, Times New Roman, serif, sans-serif,...'
    //fontStyle : 'normal, italic, oblique, bold, bolder, lighter, 100, 200, 300, 400, 500, 600, 700, 800, 900',
    //position : 'up, down, left, upleft',
    //type : 'rectangle'
});

if(!localStorage.getItem("bildirimSayi")) localStorage.setItem("bildirimSayi",0);
if(!localStorage.getItem("fontSize")) localStorage.setItem("fontSize",14);



function update(){
    geceModAktif        = parseLocal("geceModAktif");
    teknoTwitAktif      = parseLocal("teknoTwitAktif");
    aramaAktif          = parseLocal("aramaAktif");
    rutbeAktif          = parseLocal("rutbeAktif");
    uyelikTarihiAktif   = parseLocal("uyelikTarihiAktif");
    bildirimAlertAktif  = parseLocal("bildirimAlertAktif");
    bildirimTitleAktif  = parseLocal("bildirimTitleAktif");
    bildirimFaviconAktif= parseLocal("bildirimFaviconAktif");
    profilAktif         = parseLocal("profilAktif");
    trollSavarAktif     = parseLocal("trollSavarAktif");
    hortSavarAktif      = parseLocal("hortSavarAktif");
    kelimeEngelleAktif  = parseLocal("kelimeEngelleAktif");
    durumSayisiAktif    = parseLocal("durumSayisiAktif");
    yorumSayisiAktif    = parseLocal("yorumSayisiAktif");
    fontAktif           = parseLocal("fontAktif");
    fontButonAktif      = parseLocal("fontButonAktif");
    fontSize            = parseLocal("fontSize");
    yorumParlatAktif    = parseLocal("yorumParlatAktif");
    spoilerAktif        = parseLocal("spoilerAktif");
    spoilerButonuAktif  = parseLocal("spoilerButonuAktif");
    quoteButonuAktif    = parseLocal("quoteButonuAktif");
    codeButonuAktif     = parseLocal("codeButonuAktif");
    linkButonuAktif     = parseLocal("linkButonuAktif");
    resimAktif          = parseLocal("resimAktif");
    aboneTabloAktif     = parseLocal("aboneTabloAktif");
    aboneTabloAltAktif  = parseLocal("aboneTabloAltAktif");
    bildirimSayiDepo    = parseLocal("bildirimSayi");
    changelogAktif      = parseLocal("changelogAktif");
    alternateAktif      = parseLocal("alternateAktif");
    sinemaAktif         = parseLocal("sinemaAktif");
}
update();

var fontFirst=false;
function font(){
    if(!fontAktif) return;
    if(location.pathname == '/ayarlar') $(".örnek").css('font-size', fontSize);
    var $window = $(window),
        viewport_top = $window.scrollTop(),
        viewport_height = $window.height(),
        viewport_bottom = viewport_top + viewport_height;

    $("#col-left div.content, textarea").each(function(){
        var top = $(this).offset().top,
            height = $(this).height(),
            bottom = top + height;

        if ( bottom >  viewport_top ) {//sadece ekranın aşağısındakileri büyütüyoruz
            $(this).css('font-size', fontSize);
            $("textarea").css('min-height', fontSize*2);
        }
    });
    if(!fontFirst){
        yorumParlat(true);
        fontFirst=true;
    }
}

//======================SPOILER BUTONU======================//
spoil="SPOILER";
for(n=0;n<99;n++) spoil+= "-SPOILER";

$(document).on('click', '.btn-spoiler', function() {
    var txt;
    var topic = prompt("Spoiler Ne Hakkında (Örn: Person Of Interest 5x13):");
    if (topic !== null && topic !== ""){
        txt = $(".acik textarea").val();
        if(txt.length>0) txt+= "\n\n";
        txt+= "<code>" + topic + "</code> <code>SPOILER</code> #spoiler\n\n" + spoil + "\n\n";
        $(".acik textarea").val(txt);
        $(".acik textarea").height($(".acik textarea").prop('scrollHeight'));
        $(".acik textarea").focus();
    }
});

setInterval(function(){
    $( "p:contains('SPOILER-SPOILER-SPOILER')" ).each(function() {
        var text = $(this).text();
        $(this).text(text.replace(spoil, ''));
    });
},500);

function spoilerButonu(){
    $(".comment-form-submit").not(".button-spoiler").each(function() {
        $(this).find(".comment_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-xs btn-spoiler" type="button">Spoiler</button>');
        $(this).addClass("button-spoiler");
    });
    if(! $("#submit").hasClass("button-spoiler")){
        $("#submit").find("#post_form_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-sm btn-spoiler" type="button">Spoiler</button>');
        $("#submit").addClass("button-spoiler");
    }
}
//======================SPOILER BUTONU SON======================//


//======================ALINTI BUTONU======================//
$(document).on('click', '.btn-quote', function() {
    var txt;
    var topic = prompt("Alıntılan metni yapıştırın");
    if (topic !== null && topic !== ""){
        txt = $(".acik textarea").val();
        if(txt.length>0) txt+= "\n\n";
        txt+= "<blockquote>" + topic + "</blockquote>\n\n";
        $(".acik textarea").val(txt);
        $(".acik textarea").height($(".acik textarea").prop('scrollHeight'));
        $(".acik textarea").focus();
    }
});

function quoteButonu(){
    if(!quoteButonuAktif) return;
    $(".comment-form-submit").not(".button-quote").each(function() {
        $(this).find(".comment_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-xs btn-quote" type="button">Alıntı</button>');
        $(this).addClass("button-quote");
    });
    /* Durumlarda çalışmıyor
    if(! $("#submit").hasClass("button-quote")){
        $("#submit").find("#post_form_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-sm btn-quote" type="button">Alıntı</button>');
        $("#submit").addClass("button-quote");
    } */

}
//======================ALINTI BUTONU SON======================//

//======================CODE BUTONU======================//
$(document).on('click', '.btn-code', function() {
    var txt;
    var topic = prompt("Kodu yapıştırın");
    if (topic !== null && topic !== ""){
        txt = $(".acik textarea").val();
        if(txt.length>0) txt+= "\n\n";
        txt+= "<code>" + topic + "</code>\n\n";
        $(".acik textarea").val(txt);
        $(".acik textarea").height($(".acik textarea").prop('scrollHeight'));
        $(".acik textarea").focus();
    }
});

function codeButonu(){
    if(!codeButonuAktif) return;
    $(".comment-form-submit").not(".button-code").each(function() {
        $(this).find(".comment_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-xs btn-code" type="button">Kod</button>');
        $(this).addClass("button-code");
    });
    if(! $("#submit").hasClass("button-code")){
        $("#submit").find("#post_form_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-sm btn-code" type="button">Kod</button>');
        $("#submit").addClass("button-code");
    }
}
//======================CODE BUTONU SON======================//


//======================LINK BUTONU======================//
$(document).on('click', '.btn-linkk', function() {
    var txt;
    var topic = prompt("Link Metni");
    if (topic !== null && topic !== ""){
        var link = prompt("Link adresi");
        if (link !== null && link !== ""){
            if(link.substring(0, 4)!="http") link="http://"+link;
            txt = $(".acik textarea").val();
            if(txt.length>0) txt+= "\n\n";
            txt+= "<a href='" + link + "'>" + topic + "</a>\n\n";
            $(".acik textarea").val(txt);
            $(".acik textarea").height($(".acik textarea").prop('scrollHeight'));
            $(".acik textarea").focus();
        }
    }
});

function linkButonu(){
    if(!linkButonuAktif) return;
    $(".comment-form-submit").not(".button-linkk").each(function() {
        $(this).find(".comment_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-xs btn-linkk" type="button">Link</button>');
        $(this).addClass("button-linkk");
    });
    /* Durumlarda çalışmıyor
    if(! $("#submit").hasClass("button-linkk")){
        $("#submit").find("#post_form_iptal").before('<button style="margin-right:10px;" class="btn btn-default pull-right btn-sm btn-linkk" type="button">Link</button>');
        $("#submit").addClass("button-linkk");
    }*/
}
//======================LINK BUTONU SON======================//

//======================GECE MODU======================//
sunHour = 07;
sunMinute = 30;
moonHour = 19;
moonMinute = 30;

function geceModu(){
    darkMode = $('#koyu_css-css').length===0 ? false : true;
    if(localStorage.getItem('sunHour')) sunHour = localStorage.getItem('sunHour').trim();
    if(localStorage.getItem('sunMinute')) sunMinute =localStorage.getItem('sunMinute').trim();
    if(localStorage.getItem('moonHour')) moonHour = localStorage.getItem('moonHour').trim();
    if(localStorage.getItem('moonMinute')) moonMinute = localStorage.getItem('moonMinute').trim();

    d = new Date();
    h = d.getHours();
    m = d.getMinutes();
    s = d.getSeconds();

    timeSun = new Date("1923-10-29");
    timeSun.setHours(sunHour, sunMinute,0);

    timeMoon = new Date("1923-10-29");
    timeMoon.setHours(moonHour, moonMinute,0);


    timeNow = new Date("1923-10-29");
    timeNow.setHours(h, m, s);


    if (document.getElementById('koyu_tema')) {
        l = document.getElementById('koyu_tema').getElementsByTagName('a')[0];
        if(timeNow>timeMoon || timeNow<timeSun){
            sonuc = setTimeout(gece,500);
        }else{
            sonuc = setTimeout(gunduz,500);
        }
    }
}
function gece() {
    if (!darkMode && parseLocal("geceModAktif")) {
        console.log("gece");
        $('head').append('<link rel="stylesheet" id="koyu_css-css" href="https://teknoseyir.com/wp-content/themes/ts/koyu.css?ver=1.13" type="text/css" media="screen">');
        darkMode=true;
        localStorage.setItem("clickWaiting", true);
        setTimeout(geceModClick, 500);
    }
}
function gunduz() {
    if (darkMode && parseLocal("geceModAktif")) {
        console.log("gündüz");
        $( "link" ).remove( "#koyu_css-css" );
        darkMode=false;
        localStorage.setItem("clickWaiting", true);
        setTimeout(geceModClick, 500);
    }
}

function geceModClick(){
    yaz("Tema Ayarlanıyor");
    //sadece aktif pencere tıklasın.
    if(localStorage.getItem("clickWaiting") && !document.hidden){
        if (($('.fa-sun').length > 0 && darkMode===false) || ($('.fa-moon').length > 0 && darkMode===true)){
            clickWaiting = localStorage.setItem("clickWaiting", false);
            l.click();
            console.log("Tıkladık");
            setTimeout(geceModFix, 1100);//geceModu yenilenmesi için en az 1000 bekle
        }
        return;
    }
    console.log("Tıklamadık");
    setTimeout(geceModFix, 1100);//geceModu yenilenmesi için en az 1000 bekle
}

function geceModFix(){
    twitLoad();
    resim();
    fontButon();
    plusChart();
    yorumParlat(false);
    var io = darkMode === true ? "kapat" : "aç";
    var fa = darkMode === true ? "fa-sun" : "fa-moon";

    $('#koyu_tema').html('<a data-action="koyu_tema" href="#"><i class="fa ' + fa + '"></i> Gece modunu '+io+'</a>');
    $("[brightness=1]").each(function(){
        $(this).removeAttr("brightness");
        $(this).css("-moz-filter", "brightness(100%)");
        $(this).css("filter", "brightness(100%)");
    });
    if(!darkMode){
        $(".kesfet").attr('class','kesfet kesfetLight');
        $("#notifications .notification").removeClass('notification-dark');
        $(".notification-full").removeClass('notification-full-dark');
    }else{

        $(".kesfet").attr('class','kesfet kesfetDark');
        $("#notifications .notification").addClass('notification-dark');
        $(".notification-full").addClass('notification-full-dark');
    }

    /*
    if (($('.fa-sun').length >0)) {
        $('.fa-sun').parent().html('<i class="fa fa-moon"></i> Gece modunu aç');
    }else{
        $('.fa-moon').parent().html('<i class="fa fa-sun"></i> Gece modunu kapat');
    }
*/
    yaz("Tema Ayarlandı");
}

//======================GECE MODU SON======================//




//======================BİLDİRİM======================//
var bildirimUpdateTimeout = 0;
var bildirimUpdateDelay = 60*1;
var audio = new Audio('/wp-content/themes/ts/sounds/bildirim.mp3');
var bildirimEkle = true;
//İlk yüklemededen önceki bildirimleri gösterme
if(localStorage.getItem('BildirimKurulum')===null){
    console.log("Bildirim Özelliği Açıldı");
    localStorage.setItem('BildirimKurulum',true);
    bildirimEkle=false;
}
function bildirimCheck(){
    var bildirimUpdateFark = new Date().getTime()/1000-localStorage.getItem("bildirimIdJsonUp");
    if(localStorage.getItem("bildirimIdJson") && bildirimUpdateFark<=bildirimUpdateDelay){
        bildirimUpdateTimeout = Math.floor(bildirimUpdateDelay - bildirimUpdateFark);
        window.bildirimIdJson = parseLocal("bildirimIdJson");
    }else{
        console.log("Bildirim idleri kontrol ediliyor, fark: "+ Math.floor(bildirimUpdateDelay - bildirimUpdateFark));
        bildirimUpdateTimeout = bildirimUpdateDelay;

        $.get('https://teknoizdirap.com/j/tsmin', function (data, textStatus, jqXHR) {
            var jsons = JSON.stringify(data);
            window.bildirimIdJson = JSON.parse(jsons);
            if(bildirimIdJson){
                localStorage.setItem("bildirimIdJson", jsons);
                localStorage.setItem("bildirimIdJsonUp", (new Date().getTime())/1000);
                bildirimUpdate();
            }
        });

    }
    console.log("Bildirimler " + bildirimUpdateTimeout+" saniye sonra tekrar kontrol edilecek");
    setTimeout(bildirimCheck,1000+bildirimUpdateTimeout*1000);
}
setTimeout(bildirimCheck,3000);

var bildirimJsonUpdating = false;
function bildirimUpdate(){
    if(bildirimJsonUpdating) return;
    var bildirimIds = parseLocal("bildirimIdJson");
    if(!bildirimIds) {
        bildirimCheck()
        console.log("Bildirim Id Hata, yeniden deneniyor");
        return;
    }
    for(var s=0;s<bildirimIds.length;s++){
        var id =  bildirimIds[s]["id"];
        if(!localStorage.getItem(id)){
            var bildirimJsonUpdating=true;
            localStorage.setItem(id,0);
        }
    }

    if(bildirimJsonUpdating){
        $.get('https://teknoizdirap.com/j/ts', function (data, textStatus, jqXHR) {
            var jsons = JSON.stringify(data);
            window.bildirimJson = JSON.parse(jsons);
            if(bildirimJson){
                localStorage.setItem("bildirimJson", jsons);
                var fark = new Date().getTime()/1000-localStorage.getItem("bildirimJsonUp")
                console.log("Bildirim Json " + Math.floor(fark) + " saniye sonra yenilendi");
                localStorage.setItem("bildirimJsonUp", (new Date().getTime())/1000);
                bildirimJsonUpdating=false;
            }
        });
    }

    if(bildirimJsonUpdating) return;

    if(parseLocal("bildirimJson")){
        var bildirimData = parseLocal("bildirimJson")["d"];
    }else{
        console.log("Json Hatası");
        return;
    }

    for(var s=0;s<bildirimData.length;s++){
        var id =  bildirimData[s]["id"];
        var sum =  bildirimData[s]["sum"];
        var author =  bildirimData[s]["author"];
        var text =  bildirimData[s]["text"];
        var date =  bildirimData[s]["date"];
        if(!id.length){
            console.log("bildirim hatalı");
            return;
        }
        var idSplit = id.split("-");
        var id0  = idSplit[0];
        var id1 = idSplit[1];
        if(id0=="durum"){
            url="https://teknoseyir.com/durum/"+id1;
        }
        var title;
        if(id0=="durum"){
            title = "<span>"+ author +"</span><span>&nbsp;bir&nbsp;<a class='notClose' data='" + id + "' target='_blank' href='" + url + "'>" + id0 + "</a> paylaştı.</span>";
        }
        if(id0=="ızdırap"){
            title = "<span><a target='_blank' href='https://teknoizdirap.com'>TeknoIzdırap</a> bir duyuru paylaştı.</span>";
        }
        Notification(id,title,sum,text,date,url);
    }
}

function Notification(id,title,summary,text,date){
    var theme="";
    var themeFull="";
    if(darkMode) {
        theme ="notification-dark";
        themeFull="notification-full-dark";
    }
    //daha önce hiç kaydetmedik veya okunmadıysa bildirim oluştur
    if(!localStorage.getItem(id) || localStorage.getItem(id) < 2){
        var div =
            "<div class='notification " + theme + "' data-length='" + summary.length + "' id='"+id+"'>"+
            "<span class='notification-close notClose' data='" + id + "'></span>"+
            "<div class='notification-title'>"+
            title+
            "</div>"+
            "<div class='notification-body'>"+
            "<span class='notification-date'>"+ date +"</span>"+
            "<p class='notification-summary'>" + summary + "</p>"+
            "</div>"+
            "</div>";
        var divd = "<div id='"+id+"-d' class='notification-full " + themeFull + "'>"+text+"</div>";
        //İlk yüklemededen önceki bildirimleri ızdıraplar hariç gösterme
        if(bildirimEkle==true || id.substring(0,8)== "ızdırap-"){
            if(!$('#'+id).length){
                $("#notifications").prepend(div);
                if(localStorage.getItem(id) < 1){
                    audio.play();
                    localStorage.setItem(id,1);
                }
            }
            if(!$('#'+id+"-d").length) $("body").append(divd);
        }else{
            //ilk kurulumda ızdıraplar hariç tüm bildirimleri okundu olarak kaydet
            localStorage.setItem(id,2);
        }
    }
    //okunduysa bildirimi sil
    if(localStorage.getItem(id) && localStorage.getItem(id) >= 2){
        $("#"+id).remove();
        $("#"+id+"-d").remove();
    }
}


/*
var arr = [];
for (var i = 0; i < localStorage.length; i++){
    if (localStorage.key(i).substring(0,6) == 'durum') {
        arr.push(localStorage.key(i));
    }
}
for (var i = 0; i < arr.length; i++) {
    localStorage.removeItem(arr[i]);
}
*/
//======================BİLDİRİM SON======================//


//PLUS ABONE SAYISI
plusUpdateTimeout = 0;
plusUpdateDelay = 60*10*1;
function plusCheck(){
    var plusUpdateFark= new Date().getTime()/1000-localStorage.getItem("plusJsonUp");
    if(localStorage.getItem("plusJson") && plusUpdateFark<=plusUpdateDelay){
        plusUpdateTimeout = Math.floor(plusUpdateDelay - plusUpdateFark);
        window.plusJson = parseLocal("plusJson");
    }else{
        console.log("Plus Sayısı kontrol ediliyor");
        plusUpdateTimeout = plusUpdateDelay;
        $.get('https://teknoizdirap.com/j/plus', function (data, textStatus, jqXHR) {
            var jsons = JSON.stringify(data);
            window.plusJson = JSON.parse(jsons);
            if(plusJson){
                localStorage.setItem("plusJson", jsons);
                localStorage.setItem("plusJsonUp", (new Date().getTime())/1000);
                plusUpdate();
            }
        });
    }
    console.log("Plus Sayısı " + plusUpdateTimeout+" saniye sonra tekrar kontrol edilecek");
    setTimeout(plusCheck,1000+plusUpdateTimeout*1000);
}
plusCheck();


//======================PLUS ABONE TABLO======================//

aboneTabloHeight=150;
if(localStorage.getItem('aboneTabloHeight')) aboneTabloHeight = localStorage.getItem('aboneTabloHeight').trim();
function plusChart() {
    if(!$('#chartContainer').length) return;
    var plusTheme = "dark2";
    if(!darkMode) plusTheme="light2";
    var dataPoints = [];
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: plusTheme,
        zoomEnabled: true,
        title: {
            text: "Abone Sayısı"
        },
        axisY: {
            title: "TS Plus",
            titleFontSize: 16,
            prefix: ""
        },
        data: [{
            markerType: "circle",  //"triangle", "circle", "square", "cross", "none"
            markerColor: "white",
            markerBorderColor: "red",
            type: "area",
            fillOpacity: .3,
            lineColor:"red",
            lineThickness: 4,
            yValueFormatString: "#,##0",
            dataPoints: dataPoints
        }]
    });

    function addData(data) {
        var dps = data;
        for (var i = 0; i < dps.length; i++) {
            dataPoints.push({
                x: new Date(dps[i][0]),
                y: dps[i][1]
            });
        }
        chart.render();
    }
    $.getJSON("https://teknoizdirap.com/j/plusc", addData);
}
window.onload = function(){
    if (aboneTabloAktif) plusChart();
}
//======================PLUS ABONE TABLO SON======================//


//======================PLUS SAYI VE RENK======================//
function plusRenk(){
    var plusBadge = document.getElementsByClassName("plus");
    for (var i = 0; i < plusBadge.length; ++i) {
        var item = plusBadge[i];
        item.style.color=plusBadgeColor;
    }
}
function plusUpdate(){
    $("#plusSayi").text("Abonelik ("+window.plusJson["plus"]+") ");
}
//======================PLUS SAYI VE RENK SON======================//



function fontButon(){
    if(fontButonAktif && fontAktif){
        $("#fontButtons").remove();
        $(".main-wrapper").append('<div id="fontButtons" class="fontButtons">'+
                                  '<input class="btn btn-danger" style="background-color:'+ $("body").css("background-color") + ';color:'+ $("body").css("color") + ';border-color:' + $("body").css("border-color") + ';" id="fontadd" type="button" value="&nbsp;+&nbsp;" />'+
                                  '<input class="btn btn-danger" style="background-color:'+ $("body").css("background-color") + ';color:'+ $("body").css("color") + ';border-color:' + $("body").css("border-color") + ';" id="fontmin" type="button" value="&nbsp;-&nbsp;" />' +
                                  '<div');
    }
}

function yorumParlat(scroll){
    if(window.location.hash.substr(1)!=="" && window.location.hash.substr(1)!=="m" && yorumParlatAktif){
        var $com = $("#"+window.location.hash.substr(1));
        if(!$com.length) return;
        if(!darkMode) {
            rgb = "rgba(255, 240, 204, ";
        }else{
            rgb = "rgba(100, 100, 100, ";
        }
        setTimeout(function(){
            $com.css("background-color", rgb + "0.7)");
        },1500);
        if(scroll){
            $('html, body').animate({
                scrollTop: $com.offset().top-55
            }, 100);
        }
        $com.hover(function() {
            $(this).animate({ 'background-color': rgb + '0)' },1000);
        });
    }
}

//======================RESİM KARART======================//

function resim(){
    if(!darkMode) return;
    if(resimAktif){
        $("img, .embed img").not("[brightness]").not(".kesfet").each(function() {//.filter(":onScreen")
            $(this).attr('brightness','1');
            $src = ($(this).attr('src'));
            brightness=50;

            $(this).css("-moz-filter", "brightness("+brightness+"%)");
            $(this).css("filter", "brightness("+brightness+"%)");

        });
    }
    $("#twitSol, #twitSag").not("[brightness]").each(function() {
        var $col=  $(this);
        $('[id^=twitter-widget]').contents().find('*').not("[brightness]").each(function () {
            $(this).css("background-color", "#333");
            $(this).find('p, span').css("color", "#bbb");
            if(resimAktif){
                $image = $(this).find('img, div.tcu-imageWrapper').not("[brightness]");
                $image.css("-moz-filter", "brightness("+brightness+"%)");
                $image.css("filter", "brightness("+brightness+"%)");
                $image.css("color", "#bbb");
            }
            $(this).attr('brightness','1');
        });
        //$col.attr('brightness','ok');
    });
}
//======================RESİM KARART SON======================//


//======================PROFİL FONKSİYON======================//
var url = window.location.href;
var urlarr = url.split('/');
var userid = "@"+urlarr[4];
function profil() {
    if (!userid || !location.pathname.startsWith('/u/') || !profilAktif) return;
    console.log(userid);
    var dataget = document.body.innerHTML;
    var dataarr = dataget.split('<section id="col-right"');
    var data = dataarr[0];
    var matches = data.match(/id="post-\d+"/g);
    function myFunction(item, index, arr) {
        arr[index] = item.replace(/[^0-9.]/g, '');
    }
    matches.forEach(myFunction);
    var i;
    for (i = 0; i < matches.length; i++) {
        var elemid = 'post-' + matches[i];
        var elem = document.getElementById(elemid);
        if (elem) {
            var elem2 = elem.getElementsByClassName('stream-top') [0];
            if (elem2) {
                var elem3 = elem2.getElementsByClassName('author') [0];
                if (elem3) {
                    var uspan = elem3.getElementsByClassName('username') [0].innerHTML;
                    if (uspan != userid) {
                        elem.style.display="none";
                        console.log("gizlendi");
                    }
                }
            }
        }
    }
}
//======================PROFİL FONKSİYON SON======================//




//======================ÜYE DETAY======================//
function getAllElementsWithAttribute(attribute){
    if(!document.getElementById('col-left')) return false;
    var matchingElements = [];
    var allElements = document.getElementById('col-left').getElementsByTagName('*');
    for (var i = 0, n = allElements.length; i < n; i++){
        if (allElements[i].getAttribute(attribute) !== null){
            matchingElements.push(allElements[i]);
        }
    }
    return matchingElements;
}

function uyeDetay() {
    if(uyeDetayJsonLoaded){
        var objs = getAllElementsWithAttribute('data-object_id');
        if(objs === false) return;
        for (i = 0; i < objs.length; i++) {

            var arts= objs[i].parentNode;
            var art;
            while(arts && arts.getAttribute('id')===null) arts = arts.parentNode;
            if(!arts || !arts.getAttribute('id') || arts.getAttribute('id').startsWith("troll")) continue;
            if(arts.getAttribute('id').startsWith("post") || arts.getAttribute('id').startsWith("comment")) art = arts;

            var cl = objs[i].getAttribute('class');
            var parentcl = objs[i].parentNode.getAttribute('class');
            if (objs[i].getAttribute('data-object_id')) {
                var uid = objs[i].getAttribute('data-object_id');

                if (objs[i].getAttribute('data-action') == 'user_info' && parentcl!="paylas_bilgi" &&(cl == 'comment-heading' || cl == 'author') && uid > 0) {
                    var durum = objs[i].getAttribute('uyeDetay');
                    var arttrollDurum = art.getAttribute('troll');
                    if (!durum) {
                        var artId = art.getAttribute("id");
                        var uyeDetaylar="";
                        var tarih, r, t, tt, time, d, m,y;
                        if((!window.uyeDetayJson['u'][uid])){
                            time = new Date()-1;
                            tarih ='Bilinmiyor';
                        }else if (window.uyeDetayJson['u'][uid]['t']!==null) {
                            tt = window.uyeDetayJson['u'][uid]['t'];
                            time = ((tt)*86400+1399842000)*1000;
                            t = new Date(time);
                            d = t.getDate();
                            m = t.getMonth()+1;
                            y = t.getFullYear();
                            tarih= d+'.'+m+'.'+y;
                        } else {
                            time = new Date()-1;
                            tarih = "Bilinmiyor";//üyelik tarihi bilinmiyor
                        }

                        if(trollSavarAktif){
                            if(!arttrollDurum){
                                var gun = (new Date()-time)/86400000;
                                if(gun<=trollDay){
                                    if(trollDo=="Uyar") uyeDetaylar += ' -- ' + "<b>TROLL OLABİLİR</b>";
                                    if(trollDo=="Sil" && location.pathname == "/" ){
                                        $("#"+artId).hide();
                                        console.log("TrollSavar, Durum Gizlendi");
                                    }
                                    if(trollDo=="Gizle"){
                                        art.setAttribute('troll', '1');
                                    }
                                }
                            }

                            $("[troll=1]").each(function(){
                                var trollId =  "troll-" +  $(this).attr("id");
                                trollMesaj=""+
                                    '<div id="' + $(this).attr("id") + '" style="cursor:pointer" class="stream-top troll">'+
                                    'Troll Şüphesi Olan İçerik Gizlendi (<' + trollDay + ' günlük üye). İçeriği görmek için tıklayın.'+
                                    '<ul class="dropdown-menu"></ul>'+
                                    '</div>'+
                                    '</div>';

                                var mesajYedek = "<div id='" + trollId + "'style='display;'>"+$(this).html()+"</div>";
                                $(this).attr("troll","2");
                                $(this).html( trollMesaj );
                                $(this).append(mesajYedek);
                                $('#'+trollId).hide();
                            });
                        }
                        if((window.uyeDetayJson['u'][uid])){
                            if(uyelikTarihiAktif){
                                uyeDetaylar += ' -- ' + tarih;
                            }
                            if(durumSayisiAktif){
                                uyeDetaylar +=  ' -- D:~' + (window.uyeDetayJson['u'][uid]['d']);
                            }
                            if(yorumSayisiAktif){
                                uyeDetaylar +=  ' -- Y:~' + (window.uyeDetayJson['u'][uid]['y']);
                            }
                            if(rutbeAktif){
                                if (window.uyeDetayJson['u'][uid]['r']) {
                                    r = window.uyeDetayJson['r'][window.uyeDetayJson['u'][uid]['r']];
                                } else {
                                    r = window.uyeDetayJson['r'][0];
                                }
                                uyeDetaylar += ' -- ' + r;
                            }
                        }
                        objs[i].innerHTML += "<span class='uyeDetaylar'>"+uyeDetaylar+"</span>";
                        objs[i].setAttribute('uyeDetay', '1');
                    }
                }
            }
        }
    }
}
//======================ÜYE DETAY SON======================//



//======================TEKNOTWİT======================//
teknoTwitHeight=0;
twitSol="Karma";
twitSag="Keşfet";

if(localStorage.getItem('teknoTwitHeight')) teknoTwitHeight = localStorage.getItem('teknoTwitHeight').trim();
if(localStorage.getItem('twitSol')) twitSol = localStorage.getItem('twitSol');
if(localStorage.getItem('twitSag')) twitSag = localStorage.getItem('twitSag');

colRight = document.getElementById('col-right');
colLeft = document.getElementById('col-move');

$('head').append('<script type="text/javascript" src="https://platform.twitter.com/widgets.js">');

if(colLeft && !document.getElementById("SolDiv")){
    SolDiv = document.createElement('div');
    SolDiv.id = 'twitSol';
    $("#one_cikanlar-8").before(SolDiv);
    $("#twitSol").css("word-wrap","break-word");
}
if(colRight && !document.getElementById("SagDiv")){
    SagDiv = document.createElement('div');
    SagDiv.id = 'twitSag';
    $("#teknoseyir_gundemi-2").after(SagDiv);
    $("#twitSag").css("word-wrap","break-word");
}

function twitLoad(){
    if(location.pathname !== "/") return;//sadece ana sayfada çıksın
    var twitters = ["leventp", "gamsizm", "hkellecioglu"];
    twitRandom = Math.floor(Math.random() * 3);
    if(!teknoTwitAktif) return;
    var data1= '<a class="twitter-timeline" ';
    if(darkMode)  data1 += 'data-theme="dark" ';
    if(teknoTwitHeight>0)  data1 += 'data-height="'+ teknoTwitHeight +'" ';

    if(twitSol=="Karma") twitSol = "teknoizdirap/lists/teknoseyir";
    if(twitSag=="Karma") twitSag = "teknoizdirap/lists/teknoseyir";
    if(colLeft && twitSol!=="Boş" && twitSol!=="Keşfet"){
        if(twitSol=="Döngü"){
            twitSol=twitters[twitRandom];
        }
        SolDiv.innerHTML = data1 + 'data-lang="tr" href="https://twitter.com/'+ twitSol +'"></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> ';
        twttr.widgets.load( $("#twitSol")[0] );
    }
    if(colRight && twitSag!=="Boş" && twitSag!=="Keşfet"){
        if(twitSag=="Döngü"){
            if(twitRandom==2) twitRandom=-1;
            twitSag=twitters[twitRandom+1];
        }
        while(twitSag==twitSol){
            if(twitRandom==2) twitRandom=-1;
            twitRandom++;
            twitSag=twitters[twitRandom];
        }
        SagDiv.innerHTML = data1 + 'data-lang="tr" href="https://twitter.com/'+ twitSag +'"></a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> ';
        twttr.widgets.load( $("#twitSag")[0] );
    }
}
//======================TEKNOTWİT SON======================//


//======================HORTSAVAR======================//
function hortSavar(){
    if(hortSavarAktif && location.pathname === '/'){
        $('#col-left').find('article').not("[hort]").each(function() {
            $(this).attr('hort', '1');
            var start = new Date(($(this).find('.timeago').attr("datetime"))),
                fark  = new Date(new Date() - start),
                gun  = fark/1000/60/60/24;
            if(gun-hortDay>=0){
                console.log("Hort bulundu");
                //article = $(this).closest('article');

                if(hortDo=="Uyar") $(this).prepend("<h2 class='hortAlert'>DİKKAT HORT KONU</h2>");
                if(hortDo=="Sil"){
                    $(this).hide();
                    console.log("HortSavar, Durum Gizlendi");
                }
                if(hortDo=="Gizle"){
                    var hortId =  "hort-" +  $(this).attr("id");
                    hortMesaj=""+
                        '<div id="' + $(this).attr("id") + '" class="stream-top hort">'+
                        'Hort İçerik Gizlendi (' + Math.round(gun) + ' günlük [>' + hortDay + '] gönderi). İçeriği görmek için tıklayın.'+
                        '<ul class="dropdown-menu"></ul>'+
                        '</div>'+
                        '</div>';

                    var mesajYedek = "<div id='" + hortId + "'style='display;'>"+$(this).html()+"</div>";
                    //$(this).attr("hort","2");
                    $(this).html( hortMesaj );
                    $(this).append(mesajYedek);
                    $('#'+hortId).hide();
                }
            }
        });
    }
}
//======================HORTSAVAR SON======================//


//======================SPOILER BLUR FONKSİYON======================//
function spoiler(){
    if(!spoilerAktif) return;
    $('#col-left').find('article').not(".spoiled").each(function(){
        article = $(this);
        article.addClass("spoiled");
        var text = article.find('.content').text()+"";
        var embed = article.find('.embed').find('a').attr('href')+"";
        //console.log( text.toLowerCase());
        if (embed.toLowerCase().indexOf("#spoiler") >= 0 || text.toLowerCase().indexOf("#spoiler") >= 0  || text.toLowerCase().indexOf("#spoi̇ler".toLowerCase()) >= 0){
            console.log("Spoiler bulundu");
            article.find(".content, .gallery, .embed").not(".spoiler").each(function(){
                $(this).addClass("spoiler");
                $(this).addClass("on");
            });
        }
    });
}
/*
function spoiler(){
    if(!spoilerAktif) return;
    $(".hash_tag-spoiler").find(".content, .gallery, .embed").not(".spoiler").each(function(){
        $(this).addClass("spoiler");
        $(this).addClass("on");
    });
}
*/
//======================SPOILER BLUR FONKSİYON SON======================//




//======================KELIME ENGELLE======================//
function kelimeEngelle(){
    if(kelimeEngelleAktif && location.pathname === '/'){
        $('#col-left').find('article').not("[hide]").each(function() {
            $(this).attr('hide', '1');
            //article = $(this).closest('article');
            article = $(this);
            var text = $(this).find('.content').text()+"";
            var embed = $(this).find('.embed').find('a').attr('href')+"";
            $.each(lines, function(n, kelime) {
                if (embed.toLowerCase().indexOf(kelime.toLowerCase()) >= 0 || text.toLowerCase().indexOf(kelime.toLowerCase()) >= 0 ){
                    console.log("Engellenecek kelime bulundu: " + kelime);
                    article.hide();
                    return false;//durum engellenecek bir kelime içeriyor, diğer kelimleri kontrol etmeden diğer duruma geç
                }
            });
        });
    }
}
//======================KELIME ENGELLE SON======================//



document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        setInterval(font, 200);
        update();
        geceModu();
        twitLoad();
        uyeDetay();
        profil();
        yorumParlat(true);
        setInterval(update, 1000);
        setInterval(profil, 1000);
        setInterval(geceModu, 1000);
        setInterval(uyeDetay, 1000);
        setInterval(hortSavar, 1000);
        setInterval(kelimeEngelle, 1000);
        setInterval(plusRenk, 200);
        setInterval(resim, 1000);
        setInterval(spoiler, 1000);
        setInterval(spoilerButonu, 1000);
        setInterval(quoteButonu, 1000);
        setInterval(codeButonu, 1000);
        setInterval(linkButonu, 1000);
        setInterval(plusUpdate, 10*1000);
        setInterval(bildirimUpdate, 5*1000);
        //font();
        var cssUrl = window.versionJson["css"];
        $("<link/>", {
            rel: "stylesheet",
            type: "text/css",
            href: "https://teknoizdirap.com/"+cssUrl
        }).appendTo("head");

        var abonelik = $("ul.navbar-left li:last-child");
        abonelik.html(abonelik.html().replace('Abonelik ', '<span id="plusSayi">Abonelik </span>'));
        plusUpdate();

        $(document)
            .on('click', '.troll', function() {
            $('#'+($(this).attr("id"))).html($('#troll-'+($(this).attr("id"))).html());
        });
        $(document)
            .on('click', '.hort', function() {
            $('#'+($(this).attr("id"))).html($('#hort-'+($(this).attr("id"))).html());
        });
        $(document)
            .on('click', '#hideAlert', function() {
            $("#update").hide();
        });
        $(document)
            .on('click', '#bildirim_btn', function() {
            faviconSayi=-1;
        });

        $(document)
            .on('click', '.notClose', function() {
            var dataId = ($(this).attr('data'));
            $("#"+dataId).remove();
            $("#"+dataId+"-d").remove();
            localStorage.setItem(dataId,2);//okundu
        });
        var notificationTimer;
        $(document)
            .on('mouseover', '.notification', function() {
            var limitSum = parseLocal("bildirimJson")["limit_sum"]+3;
            //var limit_text = parseLocal("bildirimJson")["limit_text"];
            var dataId = ($(this).attr('id'))+"-d";
            var delay=200;
            if(limitSum!=($(this).attr('data-length'))) delay*=25;
            notificationTimer=setTimeout(function(){$("#"+dataId).show();}, delay);
        });

        $(document)
            .on('mouseout', '.notification', function() {
            var dataId = ($(this).attr('id'))+"-d";
            clearTimeout(notificationTimer);
            $("#"+dataId).hide();
        });


        $(document)
            .on('mouseover', '[brightness=1]', function() {
            $(this).css("-webkit-filter", "brightness("+100+"%)");
            $(this).css("filter", "brightness("+100+"%)");
            $(this).attr("brightness","2");
        });
        var plusTimer;
        $(document)
            .on('mouseover', '#plusSayi', function() {
            plusTimer=setTimeout(function(){yaz("TeknoIzdırap: <a target='_blank' href='https://teknoseyir.com/blog/teknoseyir-plus-kullanicilar-kulubu'>Teknoseyir Plus Kullanıcılar Kulübü'ne git</a>");}, 350);
        });

        $(document)
            .on('mouseout', '#plusSayi', function() {
            clearTimeout(plusTimer);
        });
        $(document)
            .on('click', '.autogrow-short, #kelimeListesi', function() {
            var scroll_height = $(this).get(0).scrollHeight;
            $(this).css('height', scroll_height + 'px');
        });
        $(document)
            .on('keydown', '.autogrow-short, #kelimeListesi', function() {
            var scroll_height = $(this).get(0).scrollHeight;
            $(this).css('height', scroll_height + 'px');
        });
        $(document)
            .on('click', '[brightness]', function() {
            var ayarla = $(this).attr("brightness") === 1 ? brightness : 100;
            $(this).css("-moz-filter", "brightness("+ayarla+"%)");
            $(this).css("filter", "brightness("+ayarla+"%)");
        });

        $(document)
            .on('mouseout', '[brightness=2]', function() {
            $(this).css("-moz-filter", "brightness("+brightness+"%)");
            $(this).css("filter", "brightness("+brightness+"%)");
            $(this).attr("brightness","1");
        });

        //======================OTOMATİK GECE MODU AÇ/KAPAT======================//
        var koyu = $("#koyu_tema");
        koyu.after('<li id="koyu_tema_izdirap"></li>');
        setInterval(function(){
            var io = geceModAktif === true ? "kapat" : "aç";
            $('#koyu_tema_izdirap').html('<a href="#"><i class="fa fa-sun"></i> / <i class="fa fa-moon"></i> gece/gündüz <br> otomatik modunu '+io+'</a>');
        },1000);
        $('#koyu_tema_izdirap').click(function() {
            var io = geceModAktif === true ? "kapat" : "aç";
            localStorage.setItem("geceModAktif", !geceModAktif);
            yaz("Otomatik Gece Modu "+io+"ıldı.");
        });
        $('#koyu_tema').click(function() {
            yaz("Tema Ayarlanıyor");
            setTimeout(geceModFix, 1500);//geceModu() yenilenmesi için en az 1000 bekle
        });
        //======================OTOMATİK GECE MODU AÇ/KAPAT SON======================//


        //======================AYARLAR SAYFASI======================//
        if(location.pathname == '/ayarlar') {
            $(document)
                .on('keyup', '#kelimeListesi', function(e) {
                var rows = $(this).val().split("\n");
                $(this).prop('rows', rows.length +1);
            });

            var ul = document.getElementById("profile-tabs");
            var a = document.createElement("a");
            var li = document.createElement("li");

            a.textContent = "TeknoIzdırap";
            a.setAttribute('href', "https://teknoseyir.com/ayarlar#izdirap");
            li.appendChild(a);
            ul.appendChild(li);
            li.setAttribute("id", "tab-izdirap");
            a.setAttribute("data-toggle", "tab");

            ayarlar= "<div class='tab-pane' id='izdirap'>"+
                "<a href='https://teknoseyir.com/durum/673699'><h3>SORULAR VE HATA BİLDİRİMİ İÇİN</h3></a>"+

                "<div class='link' id='checkUpdate'><h3>YENİ SÜRÜM KONTROL ET</h3></div>"+

                "<div class='link' id='changelog'><h2>Changelog - Yeni Özellikler (v"+version+")</h2></div>"+
                "<div id='changelogDetay'";

            if(!changelogAktif) ayarlar+="style='display:none'>";

            ayarlar+= "<br><b>1.0:</b><br>"+
                "-  <span class='yeni'>Bildirim Sistemi</span> eklendi. Site editörleri bir <b>durum</b> paylaştığında sağ alt tarafta bildirim otomatik olarak gösterilecek olup herhangi bir ayar açmanıza gerek yoktur.<br>"+
                "-  <span class='yeni'>Vimeo kontrolleri</span> eklendi."+
                " Artık Vimeo playerı aktiften sağ ve sol tuşlar ile <input style='width:40px' type='number'value='" + vimeoJump + "' maxlength='2' size='2' id='vimeoJump'> sn ileri/geri, "+
                "yukarı ve aşağı tuşları ile ses kontrolü, M tuşu ile de sessize alma, sesi geri açma işlemi yapabilirsiniz. (F tuşu ile tam ekran yapma maalesef devre dışı kalıyor.)<br>"+
                "-  <span class='yeni'>Vimeo'da kalınan yerden devam etme</span> özelliği eklendi. (Sadece aynı tarayıcı içinde)<br>"+
                "-  <span class='yeni'>Sinema Modu ve YouTube/Vimeo için varsayılan seçme</span> özelliği eklendi."+
                "(Video sayfasındaki ilgili butonların yanında birer tane kutucuk eklendi. İlk kutucuk seçili ise varsayılan olarak sinema modu ile açılacak, ikinci kutucuk seçili ise varsayılan olarak YouTube açılacak)<br>"+
                "-  <span class='yeni'>Abone Sayısı Tablosu</span> eklendi<br>"+
                "- <span class='yeni'>Kod, Alıntı ve Link butonları</span> eklendi<br>"+
                "-  Teknotwit bölümündeki \"Keşfet\" özelliğinin <span class='yeni'>liste değiştirme butonları</span> aktif hale getirildi."+
                "(Son seçtiğiniz ayar varsayılan ayar olarak kaydedilir, sayfayı yenilediğinizde de aynı ayarlarla yüklenir.)<br>"+
                "-  <span class='yeni'>Otomatik Gece/Gündüz Modu</span>  ve  <span class='yeni'>Favicon Bildirim Sayısı</span> </span>  özelliklerinde <span class='yeni'>iyileştirmeler</span> yapıldı.<br>"+
                "-  <span class='yeni'>#spoiler</span> etiketi içeren mesajlarda <span class='yeni'>blurlama</span> özelliği iyileştirildi.<br>"+


                "<br><b>0.9.8:</b><br>"+
                "- Navigasyon çubuğundaki \"Abonelik\" bölümünün üzerine gelince <span class='yeni'>\"Teknoseyir Plus Kullanıcılar Kulübü\" için link</span> çıkması eklendi<br>"+

                "<br><b>0.9.7:</b><br>"+
                "- Navigasyon çubuğuna <span class='yeni'>Plus Abone Sayısı</span> eklendi.)<br>"+

                "<br><b>0.9.5:</b><br>"+
                "- <span class='yeni'>Plus İkonu Renk Değiştirme </span> seçeneği eklendi.<br>"+

                "<br><b>0.9:</b><br>"+
                "- <span class='yeni'>Kelime/Hashtag/Link Engelleme </span> özelliği eklendi.<br>"+

                "<br><b>0.8:</b><br>"+
                "- <span class='yeni'>Favicon Bildirim Sayısı </span> özelliği eklendi.<br>"+

                "<br><b>0.7:</b><br>"+
                "- <span class='yeni'>Spoiler Butonu</span> eklendi.<br>"+

                "<br><b>0.6.4:</b><br>"+
                "- Otomatik Gece/Gündüz Modunu hızlı açıp kapatmak için Normal <span class='yeni'>gece modu butonun altına ek buton</span> eklendi.<br>"+
                "- \"Bildirim sayısını sekme adına ekle\" ve \"Bildirim gelince sekmeye geç\" özellikleri için sekmeler arası senkronizasyon sağlandı. Bildirim çanındaki değerden daha doğru bir değer gösteriyor. ?<br>"+

                "<br><b>0.6:</b><br>"+
                "- <span class='yeni'>Dahili Güncelleme</span> sistemi eklendi. Artık " + updateDelay/60/60 + " saatte bir sürüm numarası kontrol edilecek.<br>"+
                "- TeknoTwit için <span class='yeni'>Karma Liste</span> seçeneği eklendi.<br>"+
                "- TeknoTwit için <span class='yeni'>yükseklik</span> ayarı eklendi.<br>"+
                //"- [KALDIRILDI]Gece modu manuel kapatılamama sorunu KISMEN düzeltildi (manuel kapattıktan sonra sayfaları yenilemek gerekiyor), gece modunu manuel değiştirince 8 saatliğine otomatik özelliği kapanıyor.<br>"+

                "<br><b>0.5:</b><br>"+
                "- <span class='yeni'>Spoiler</span> özelliği için <span class='yeni'>ilk adım</span> atıldı.<br>"+
                "- Sekme adındaki bildirim sayılarının arka arkaya eklenmesi düzeltildi.<br>"+
                "- Küçük hata düzeltmeleri.<br>"+

                "<br><b>0.1-0.4:</b><br>"+
                "- Geliştirme süreci ?<br>"+
                "<hr><hr>"+

                "</div>"+

                "<h3 id='izdirap'>TeknoIzdırap Ayarları</h3>"+

                //========GECEMOD========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='gecemod' type='checkbox' autocomplete='off'>Otomatik Gece/Gündüz Modu"+
                "(Aktifken Gece/Gündüz arasında manuel değişim yapamazsınız. Değişim yapmak için önce otomatik modu kapatmanız gerekli.)</label></div>"+
                "<div id='geceModDetay'>"+
                "Gündüz: <input style='width:40px' type='number'value='" + sunHour + "' maxlength='2' size='2' id='sunHour'>:<input style='width:40px' type='number' min='0' max='59' value='" + sunMinute + "'  id='sunMinute'><br>"+
                "Gece  : <input style='width:40px' type='number' value='" + moonHour + "' maxlength='2' size='2' id='moonHour'>:<input style='width:40px' type='number' min='0' max='59' value='" + moonMinute + "'  id='moonMinute'>"+
                "</div>"+
                "<div class='checkbox'><label><input id='resim' type='checkbox' autocomplete='off'>Gece modu aktifken resimleri karart (resimler üzerine gelince aydınlanır)</label></div>"+
                //======GECEMOD SON======//

                //========TWİT========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='teknotwit' type='checkbox' autocomplete='off'>TeknoTwit</label>"+
                "</div>"+
                "<div id='twitDetay'>"+
                "Teknotwit Sütununun Yüksekliği: <input style='width:50px' type='number' value='" + teknoTwitHeight + "' maxlength='4' size='4' id='teknoTwitHeight'> piksel (0=sınırsız)";
            if(lastVersionFloat<0.6) ayarlar+= "<span class='yeni'> (YENİ)</span><br>";

            ayarlar+=
                "Sol Sütun: <select id='twitSol'>"+
                "<option value='Karma'>Karma Liste</option>"+
                "<option value='hkellecioglu'>Hamdi Kellecioğlu</option>"+
                "<option value='gamsizm'>Murat Gamsız</option>"+
                "<option value='leventp'>Levent Pekcan</option>"+
                "<option value='Boş'>Boş Kalsın</option>"+
                "<option value='Döngü'>Döngü</option>"+
                "<option value='Keşfet'>Keşfet</option>"+
                "</select>  "+

                "Sağ Sütun: <select id='twitSag'>"+
                "<option value='Karma'>Karma Liste</option>"+
                "<option value='hkellecioglu'>Hamdi Kellecioğlu</option>"+
                "<option value='gamsizm'>Murat Gamsız</option>"+
                "<option value='leventp'>Levent Pekcan</option>"+
                "<option value='Boş'>Boş Kalsın</option>"+
                "<option value='Döngü'>Döngü</option>"+
                "<option value='Keşfet'>Keşfet</option>"+
                "</select>";

            if(lastVersionFloat<0.6) ayarlar+= "<span class='yeni'> (YENİ SEÇENEK VAR)</span>";
            ayarlar+=  "<hr></div>"+
                //======TWİT SON======//

                //========PLUS ABONE TABLO========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='aboneTablo' type='checkbox' autocomplete='off'>Abone Sayısı Tablosu</label>";
            if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="</div>"+

                "<div id='aboneTabloDetay'>"+
                "<label><input id='aboneTabloAlt' type='checkbox' autocomplete='off'>Tabloyu sağ sütunun en altına yerleştir</label><br>"+
                "Tablo Yüksekliği<input style='width:50px' type='number'value='" + aboneTabloHeight + "' maxlength='3' size='3' id='aboneTabloHeight'> piksel"+
                "<hr></div>"+
                //======PLUS ABONE TABLO SON======//

                //======PLUS RENK======//
                "Plus İkon Rengi";
            if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+=" : <input type='color' id='plusBadgeColor' name='plusBadgeColor' value='" + localStorage.getItem("plusBadgeColor") + "'>"+
                " - <span id='plusReset' class='link'> Orjinal rengine dönmek için tıklayın</span> <br>"+
                //======PLUS RENK SON======//


                //========FAVICON========//
                "<div class='checkbox'><label><input id='bildirimFavicon' type='checkbox' autocomplete='off'>Bildirim sayısını sekmedeki 'TS' logosuna ekler</label>";
            if(lastVersionFloat<0.8) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="</div>"+
                "<div id='bildirimFaviconDetay'>"+

                "Arkaplan: <input type='color' id='favBgColor' name='favBgColor' value='" + localStorage.getItem("favBgColor") + "'><br>"+
                "Yazı: <input type='color' id='favTextColor' name='favTextColor' value='" + localStorage.getItem("favTextColor") + "'>"+
                "<hr></div>"+
                //========FAVICON SON========//

                "<div class='checkbox'><label><input id='bildirimTitle' type='checkbox' autocomplete='off'>Bildirim sayısını sekme adına ekle ([#] şeklinde ekler. Örnek sekme adı: [3] Teknoseyir)</label></div>"+

                "<div class='checkbox'><label><input id='rutbe' type='checkbox' autocomplete='off'>Akışta TeknoRütbe'leri göster."+
                "(Sitede yapılan paylaşım miktarı ve abonelik yaşına göre belirlenir. Bit, B(Byte), KB(KiloByte)... şeklinde ilerler.)</label></div>"+
                "<div class='checkbox'><label><input id='uyeliktarihi' type='checkbox' autocomplete='off'>Akışta üyelik tarihlerini göster</label></div>"+
                "<div class='checkbox'><label><input id='durumsayisi' type='checkbox' autocomplete='off'>Akışta kişilerin yaklaşık durum sayılarını göster</label></div>"+
                "<div class='checkbox'><label><input id='yorumsayisi' type='checkbox' autocomplete='off'>Akışta kişilerin yaklaşık yorum sayılarını göster</label></div>"+

                //========TROLL========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='trollsavar' type='checkbox' autocomplete='off'>Troll Savar (açıklama için tıkla)</label></div>"+
                "<div id='trollSavarDetay'>"+
                "<input style='width:40px' type='number'value='" + trollDay + "' maxlength='2' size='2' id='trollDay'> günden yeni üyeleri: "+
                "<select id='trollDo'><option value='Gizle'>Gizle (Gönderiyi gizler, göstermek için buton ekler)</option><option value='Uyar'>Uyar (Gönderiyi gizlemez, sadece uyarı mesajı ekler)</option><option value='Sil'>Sil (Gönderi gizler, uyarı mesajı da eklemez)</option></select>"+
                "<hr></div>"+
                //======TROLL SON======//

                //========HORT========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='hortsavar' type='checkbox' autocomplete='off'>Hort Savar (açıklama için tıkla)</label></div>"+
                "<div id='hortSavarDetay'>"+
                "<input style='width:40px' type='number'value='" + hortDay + "' maxlength='2' size='2' id='hortDay'> günden eski konuları: "+
                "<select id='hortDo'><option value='Gizle'>Gizle (Gönderiyi gizler, göstermek için buton ekler)</option><option value='Uyar'>Uyar (Gönderiyi gizlemez, sadece uyarı mesajı ekler)</option><option value='Sil'>Sil (Gönderi gizler, uyarı mesajı da eklemez)</option></select>"+
                "<hr></div>"+
                //======HORT SON======//

                //========KELİME ENGELLE========//
                //"<hr>"+
                "<div class='checkbox'><label><input id='kelimeEngelle' type='checkbox' autocomplete='off'>Kelime/Hashtag/Link Engelleme</label>";
            if(lastVersionFloat<0.9) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="<br><b>HER SATIRA BİR KELİME YAZILACAK, YAZILAN KELİME DURUM İÇİNDE NORMAL YAZI OLARAK VEYA LİNK OLARAK VEYA HASHTAG OLARAK GEÇİYORSA O DURUM GİZLENİR.)<br>"+
                "(OTOMATİK KAYDEDİLİR, BÜYÜK/KÜÇÜK HARF DUYARLI DEĞİLDİR)</b></div><br>"+
                "<div id='kelimeEngelleDetay'>"+
                "<textarea style='width:100%' id='kelimeListesi'>"+engellenecekler+"\n</textarea>"+
                "<hr></div>"+
                //======KELİME ENGELLE SON======//

                //========FONT========//
                "<div class='checkbox'><label><input id='font' type='checkbox' autocomplete='off'>Font boyutunu ayarla</label></div>"+
                "<div id='fontDetay'>"+
                'FONT BOYUTU: '+
                '<div class="örnek">Örnek</div>'+
                '<input id="fontadd" type="button" value="&nbsp;+&nbsp;" />'+
                '<input id="fontmin" type="button" value="&nbsp;-&nbsp;" />'+
                "<div class='checkbox'><label><input id='fontButon' type='checkbox' autocomplete='off'>Font boyutu değiştirme butonlarını her sayfada göster.</label></div>"+
                "<hr></div>"+
                //======FONT SON======//

                "<div class='checkbox'><label><input id='yorumParlat' type='checkbox' autocomplete='off'>Yorumlar üzerine gelene kadar parlasın"+
                "(teknoseyir.com/durum/xxxxxx#comments-yyyyy şeklindeki url'ler için)</label></div>"+

                //======SPOILER======//
                "<div class='checkbox'><label><input id='spoiler' type='checkbox' autocomplete='off'>'#spoiler' içeren mesajları blurla</label>"+
                "<span class='yeni'> ";
            if(lastVersionFloat<0.5) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+= "</div>" +

                "<div class='checkbox'><label><input id='spoilerButonu' type='checkbox' autocomplete='off'>Spoiler Butonu</label>";
            if(lastVersionFloat<0.7) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="</div><hr>"+
                //======SPOILER SON======//

                //======BUTONLAR======//
                "<div class='checkbox'><label><input id='quoteButonu' type='checkbox' autocomplete='off'>Alıntı Butonu";
            if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="(Metni blockquote etiketi içine alır, sadece yorumlarda çalışır, mesajı gönderdikten sonra düzenlerseniz normal metine döner)</label></div>"+

                "<div class='checkbox'><label><input id='codeButonu' type='checkbox' autocomplete='off'>Kod Butonu</label>";
            if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="(Metni code etiketi içine alır, hem yorumlarda hem de durumlarda çalışır, mesajı gönderdikten sonra düzenlerseniz normal metine döner)</div>"+

                "<div class='checkbox'><label><input id='linkButonu' type='checkbox' autocomplete='off'>Link Butonu</label>";
            if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
            ayarlar+="(Kolayca link eklemeyi sağlar, sadece yorumlarda çalışır, mesajı gönderdikten sonra düzenlerseniz normal metine döner)</div>"+
                //======BUTONLAR SON======//

                "<hr>";
            //ayarlar+="<div class='checkbox'><label><input id='bildirimAlert' type='checkbox' autocomplete='off'>Bildirim gelince sekmeye geç"+
            //"(<span class='yeni'>DİKKAT!!!</span> Birden fazla sekmede TS açıksa sinir edebilir ?)</label></div>"+

            //"<hr><hr><hr><hr>"+
            //"<div class='checkbox'><label><input id='arama' type='checkbox' autocomplete='off'>Gelişmiş Arama (Pek Yakında ?)</label></div>"+
            //"<div class='checkbox'><label><input id='emoji' type='checkbox' autocomplete='off'>Emoji Butonu (Pek Yakında ?)</label></div>"+
            //"<div class='checkbox'><label><input id='yorum' type='checkbox' autocomplete='off'>Yorumları sırala (Pek Yakın Olmayan Bir Gelecekte ? Belki de asla ?)</label></div>";

            for(basma=0;basma<5;basma++){
                ayarlar+= "<h2>=================KAYDET'E BASMA=================</h2>";
            }
            ayarlar+= "<div class='checkbox'><label><input id='factoryReset' type='checkbox' autocomplete='off'>TÜM AYARLARI SIFIRLA (BASAR BASMAZ SIFIRLAR)</label></div>"+
                "<table class='table form-table bildirim'>"+
                "</table>"+
                "</div>";

            ayarDiv = document.createElement('div');
            ayarDiv.id = 'izdirap';
            ayarDiv.className = 'tab-pane';
            document.getElementsByClassName('tab-content')[0].appendChild(ayarDiv);
            ayarDiv.innerHTML = ayarlar;

            //setInterval(function(){
            document.getElementById("gecemod").checked = geceModAktif;
            document.getElementById("resim").checked = resimAktif;
            document.getElementById("teknotwit").checked = teknoTwitAktif;
            //document.getElementById("arama").checked = aramaAktif;
            document.getElementById("rutbe").checked = rutbeAktif;
            document.getElementById("uyeliktarihi").checked = uyelikTarihiAktif;
            document.getElementById("trollsavar").checked = trollSavarAktif;
            document.getElementById("hortsavar").checked = hortSavarAktif;
            document.getElementById("kelimeEngelle").checked = kelimeEngelleAktif;
            document.getElementById("durumsayisi").checked = durumSayisiAktif;
            document.getElementById("yorumsayisi").checked = yorumSayisiAktif;
            //document.getElementById("bildirimAlert").checked = bildirimAlertAktif;
            document.getElementById("bildirimTitle").checked = bildirimTitleAktif;
            document.getElementById("bildirimFavicon").checked = bildirimFaviconAktif;
            document.getElementById("font").checked = fontAktif;
            document.getElementById("fontButon").checked = fontButonAktif;
            document.getElementById("yorumParlat").checked = yorumParlatAktif;
            document.getElementById("spoiler").checked = spoilerAktif;
            document.getElementById("spoilerButonu").checked = spoilerButonuAktif;
            document.getElementById("quoteButonu").checked = quoteButonuAktif;
            document.getElementById("codeButonu").checked = codeButonuAktif;
            document.getElementById("linkButonu").checked = linkButonuAktif;
            document.getElementById("aboneTablo").checked = aboneTabloAktif;
            document.getElementById("aboneTabloAlt").checked = aboneTabloAltAktif;



            if(!geceModAktif) document.getElementById("geceModDetay").style.display="none";
            if(!teknoTwitAktif) document.getElementById("twitDetay").style.display="none";
            if(!aboneTabloAktif) document.getElementById("aboneTabloDetay").style.display="none";
            if(!trollSavarAktif) document.getElementById("trollSavarDetay").style.display="none";
            if(!hortSavarAktif) document.getElementById("hortSavarDetay").style.display="none";
            if(!kelimeEngelleAktif) document.getElementById("kelimeEngelleDetay").style.display="none";
            if(!fontAktif) document.getElementById("fontDetay").style.display="none";
            if(!bildirimFaviconAktif) document.getElementById("bildirimFaviconDetay").style.display="none";

            $("#twitSol").val(twitSol);
            $("#twitSag").val(twitSag);
            $("#trollDo").val(trollDo);
            $("#hortDo").val(hortDo);
            //},1000);

            $('#plusReset').click(function() {
                localStorage.removeItem("plusBadgeColor");
                yaz("Kaydedildi (Eklenti kurulmadan önce açılan sekmelere F5 lütfen ?)");
            });

            $('#checkUpdate').click(function() {
                localStorage.setItem("versionJsonUp",0);
                yaz("Güncelleştirmeler Kontrol Ediliyor...(Sayfa Yenilenecek)");
                setTimeout(function(){location.reload();},3000);
            });
            $('#gecemod').click(function() {
                var gecemod = document.getElementById("gecemod");
                geceModAktif=gecemod.checked;
                document.getElementById("geceModDetay").style.display = geceModAktif === true ? "block" : "none";
                localStorage.setItem("geceModAktif", geceModAktif);
                yaz("Kaydedildi (Eklenti kurulmadan önce açılan sekmelere F5 lütfen ?)");
            });
            $('#teknotwit').click(function() {
                var teknotwit = document.getElementById("teknotwit");
                teknoTwitAktif=teknotwit.checked;
                document.getElementById("twitDetay").style.display = teknoTwitAktif === true ? "block" : "none";
                localStorage.setItem("teknoTwitAktif", teknoTwitAktif);
                yaz("Kaydedildi");
            });
            $('#changelog').click(function() {
                var changelogDisplay = document.getElementById("changelogDetay").style.display;
                if(changelogDisplay!=="none"){
                    localStorage.setItem("changelogAktif",false);
                    yaz("Changelog kapatıldı");
                }
                document.getElementById("changelogDetay").style.display = changelogDisplay === "none" ? "block" : "none";
            });
            $('#aboneTablo').click(function() {
                var aboneTablo = document.getElementById("aboneTablo");
                aboneTabloAktif=aboneTablo.checked;
                document.getElementById("aboneTabloDetay").style.display = aboneTabloAktif === true ? "block" : "none";
                localStorage.setItem("aboneTabloAktif", aboneTabloAktif);
                yaz("Kaydedildi");
            });
            $('#aboneTabloAlt').click(function() {
                var aboneTabloAlt = document.getElementById("aboneTabloAlt");
                aboneTabloAltAktif=aboneTabloAlt.checked;
                localStorage.setItem("aboneTabloAltAktif", aboneTabloAltAktif);
                yaz("Kaydedildi");
            });
            $('#arama').click(function() {
                var arama = document.getElementById("arama");
                aramaAktif = arama.checked;
                localStorage.setItem("aramaAktif", aramaAktif);
            });
            $('#rutbe').click(function() {
                var rutbe = document.getElementById("rutbe");
                rutbeAktif=rutbe.checked;
                localStorage.setItem("rutbeAktif", rutbeAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#uyeliktarihi').click(function() {
                var uyeliktarihi = document.getElementById("uyeliktarihi");
                uyelikTarihiAktif=uyeliktarihi.checked;
                localStorage.setItem("uyelikTarihiAktif", uyelikTarihiAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#trollsavar').click(function() {
                var trollsavar = document.getElementById("trollsavar");
                trollSavarAktif=trollsavar.checked;
                document.getElementById("trollSavarDetay").style.display = trollSavarAktif === true ? "block" : "none";
                localStorage.setItem("trollSavarAktif", trollSavarAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#hortsavar').click(function() {
                var hortsavar = document.getElementById("hortsavar");
                hortSavarAktif=hortsavar.checked;
                document.getElementById("hortSavarDetay").style.display = hortSavarAktif === true ? "block" : "none";
                localStorage.setItem("hortSavarAktif", hortSavarAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#kelimeEngelle').click(function() {
                var kelimeEngelle = document.getElementById("kelimeEngelle");
                kelimeEngelleAktif=kelimeEngelle.checked;
                document.getElementById("kelimeEngelleDetay").style.display = kelimeEngelleAktif === true ? "block" : "none";
                localStorage.setItem("kelimeEngelleAktif", kelimeEngelleAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#durumsayisi').click(function() {
                var durumsayisi = document.getElementById("durumsayisi");
                durumSayisiAktif=durumsayisi.checked;
                localStorage.setItem("durumSayisiAktif", durumSayisiAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#yorumsayisi').click(function() {
                var yorumsayisi = document.getElementById("yorumsayisi");
                yorumSayisiAktif=yorumsayisi.checked;
                localStorage.setItem("yorumSayisiAktif", yorumSayisiAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });

            $('#bildirimAlert').click(function() {
                var bildirimAlert = document.getElementById("bildirimAlert");
                bildirimAlertAktif=bildirimAlert.checked;
                localStorage.setItem("bildirimAlertAktif", bildirimAlertAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#bildirimTitle').click(function() {
                var bildirimTitle = document.getElementById("bildirimTitle");
                bildirimTitleAktif=bildirimTitle.checked;
                localStorage.setItem("bildirimTitleAktif", bildirimTitleAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#bildirimFavicon').click(function() {
                var bildirimFavicon = document.getElementById("bildirimFavicon");
                bildirimFaviconAktif=bildirimFavicon.checked;
                localStorage.setItem("bildirimFaviconAktif", bildirimFaviconAktif);
                document.getElementById("bildirimFaviconDetay").style.display = bildirimFaviconAktif === true ? "block" : "none";
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#font').click(function() {
                var font = document.getElementById("font");
                fontAktif=font.checked;
                document.getElementById("fontDetay").style.display = fontAktif === true ? "block" : "none";
                localStorage.setItem("fontAktif", fontAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#fontButon').click(function() {
                var fontButon = document.getElementById("fontButon");
                fontButonAktif=fontButon.checked;
                localStorage.setItem("fontButonAktif", fontButonAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#yorumParlat').click(function() {
                var yorumParlat = document.getElementById("yorumParlat");
                yorumParlatAktif=yorumParlat.checked;
                localStorage.setItem("yorumParlatAktif", yorumParlatAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#spoiler').click(function() {
                var spoiler = document.getElementById("spoiler");
                spoilerAktif=spoiler.checked;
                localStorage.setItem("spoilerAktif", spoilerAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#spoilerButonu').click(function() {
                var spoilerButonu = document.getElementById("spoilerButonu");
                spoilerButonuAktif=spoilerButonu.checked;
                localStorage.setItem("spoilerButonuAktif", spoilerButonuAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#quoteButonu').click(function() {
                var quoteButonu = document.getElementById("quoteButonu");
                quoteButonuAktif=quoteButonu.checked;
                localStorage.setItem("quoteButonuAktif", quoteButonuAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#codeButonu').click(function() {
                var codeButonu = document.getElementById("codeButonu");
                codeButonuAktif=codeButonu.checked;
                localStorage.setItem("codeButonuAktif", codeButonuAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#linkButonu').click(function() {
                var linkButonu = document.getElementById("linkButonu");
                linkButonuAktif=linkButonu.checked;
                localStorage.setItem("linkButonuAktif", linkButonuAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });
            $('#resim').click(function() {
                var resim = document.getElementById("resim");
                resimAktif=resim.checked;
                localStorage.setItem("resimAktif", resimAktif);
                yaz("Kaydedildi (Sekmelere F5 lütfen ?)");
            });

            $('#favTextColor').on('input', function() {
                localStorage.setItem("favTextColor", $(this).val());
                yaz("favTextColor: "+$(this).val());
            });
            $('#favBgColor').on('input', function() {
                localStorage.setItem("favBgColor", $(this).val());
                yaz("favBgColor: "+$(this).val());
            });
            $('#plusBadgeColor').on('input', function() {
                localStorage.setItem("plusBadgeColor", $(this).val());
                yaz("Plus İkon Rengi: "+$(this).val());
            });

            $('#sunHour').on('input', function() {
                localStorage.setItem("sunHour", $(this).val());
                yaz("Gündüz Saati Kaydedildi: "+$(this).val());
            });
            $('#sunMinute').on('input', function() {
                localStorage.setItem("sunMinute", $(this).val());
                yaz("Gündüz Dakikası Kaydedildi: "+$(this).val());
            });
            $('#moonHour').on('input', function() {
                localStorage.setItem("moonHour", $(this).val());
                yaz("Gece Saati Kaydedildi: "+$(this).val());
            });
            $('#moonMinute').on('input', function() {
                localStorage.setItem("moonMinute", $(this).val());
                yaz("Gece Dakikası Kaydedildi: "+$(this).val());
            });
            $('#teknoTwitHeight').on('input', function() {
                localStorage.setItem("teknoTwitHeight", $(this).val());
                yaz("TeknoTwit Yükseklik Kaydedildi: " + $(this).val());
            });
            $('#aboneTabloHeight').on('input', function() {
                localStorage.setItem("aboneTabloHeight", $(this).val());
                yaz("Abone Tablosu Yükseklik Kaydedildi: " + $(this).val());
            });
            $('#twitSol').on('input', function() {
                localStorage.setItem("twitSol", $(this).val());
                yaz("Sol Sütun Kaydedildi: "+$(this).val());
            });
            $('#twitSag').on('input', function() {
                localStorage.setItem("twitSag", $(this).val());
                yaz("Sağ Sütun Kaydedildi: "+$(this).val());
            });
            $('#trollDay').on('input', function() {
                localStorage.setItem("trollDay", $(this).val());
                yaz("Troll Gün Kaydedildi: "+$(this).val());
            });
            $('#trollDo').on('input', function() {
                localStorage.setItem("trollDo", $(this).val());
                yaz("Troll İşlemi Kaydedildi: "+$(this).val());
            });
            $('#hortDay').on('input', function() {
                localStorage.setItem("hortDay", $(this).val());
                yaz("Hort Gün Kaydedildi: "+$(this).val());
            });
            $('#hortDo').on('input', function() {
                localStorage.setItem("hortDo", $(this).val());
                yaz("Hort İşlemi Kaydedildi: "+$(this).val());
            });
            $('#kelimeListesi').on('input', function() {
                localStorage.setItem("engellenecekler", $(this).val());
                yaz("Engellenecekler Kaydedildi");
            });
            $('#vimeoJump').on('input', function() {
                localStorage.setItem("vimeoJump", $(this).val());
                yaz("Video atlama süresi kaydedildi: "+$(this).val() + " saniye");
            });
            $('#factoryReset').click(function() {
                localStorage.clear();
                yaz("Ayarlar Sıfırlandı");
                setTimeout(function(){
                    location.reload();
                },1000);
            });

            setInterval(function(){
                if(document.getElementById("tab-izdirap").getAttribute("class")==="active"){
                    document.getElementById("profile_submit").setAttribute("onclick", "javascript:alert('BASMA DEDİK YA');alert('BASMASAN OLMAZDI DEMİ');alert('AL İŞTE BOZDUN');alert('KIRDIN KIRDIN');alert('MUTLU MUSUN?');alert('BEN DEĞİLİM...');alert('ÜZDÜN BENİ');alert('SANA DÜZGÜNCE BASMA DEDİK');alert('...');alert('AL SANA CEZA');window.location.replace('http://teknoizdirap.com');return false;");
                }else{
                    document.getElementById("profile_submit").setAttribute("onclick", "");
                }}, 500);

        }
        //======================AYARLAR SAYFASI SON======================//


        //======================PROFİL SAYFASI======================//
        if(location.pathname.startsWith('/u/')){
            profilDiv = document.createElement('div');
            profilDiv.id = 'profilDiv';
            profilDiv.className = 'profilDivClass';
            document.getElementsByClassName('pull-right')[0].appendChild(profilDiv);
            profilDiv.innerHTML = "<div style='font-size: 14px;' class='checkbox'><label><input style='transform: scale(1.5);' id='profilBox' type='checkbox' autocomplete='off'>Profil Sahibi<br> Dışındaki Kişilerin<br> Gönderilerini Gizle <br>(Tiki kaldırırsanız<br>sayfayı yenileyin)</label></div>";

            document.getElementById("profilBox").checked = profilAktif;

            $('#profilBox').click(function() {
                var profilBox = document.getElementById("profilBox");
                profilAktif=profilBox.checked;
                localStorage.setItem("profilAktif", profilAktif);
                profil();
            });
        }
        //======================PROFİL SAYFASI SON======================//


        //======================BİLDİRİM SAYISI======================//
        bildirimSon=0;
        bildirimSayi=0;
        faviconSayi=-1
        var bildirimFirst=false;
        setInterval(function(){
            bildirimSon=bildirimSayi;
            bildirimStr=$('#bildirim-count').text();
            if(bildirimStr && bildirimStr.length>0){
                bildirimSayi = 0 + parseInt(bildirimStr);
            }else{
                bildirimSayi = 0;
            }
            if(bildirimSayi!=bildirimSon || !bildirimFirst){
                localStorage.setItem("bildirimSayi", bildirimSayi);
                bildirimFirst=true;
            }

            preTitle="";
            if(bildirimSayiDepo>0){
                preTitle = "[" + bildirimSayiDepo + "] ";
            }

            //titleSayi=document.title.substring(document.title.lastIndexOf("[")+1,document.title.lastIndexOf("]"));
            if(bildirimSayiDepo>0 && bildirimSayiDepo>bildirimSon && bildirimAlertAktif) alert(bildirimSayiDepo + " Adet Bildirim Var");
            if(bildirimSayiDepo>0 && bildirimTitleAktif && document.title.indexOf(preTitle) < 0){
                for(m=1;m<=100;m++){
                    document.title = document.title.replace("["+m+"]","");
                }
                document.title = preTitle+document.title;
            }
            if(bildirimSayiDepo<1 && document.title.indexOf(preTitle) >= 0){
                for(m=1;m<=100;m++){
                    document.title = document.title.replace("["+m+"]","");
                }
            }
            if(bildirimFaviconAktif  && (bildirimSayiDepo!=faviconSayi)){
                faviconSayi=bildirimSayiDepo;
                favicon.badge(bildirimSayiDepo);
            }
            //console.log(bildirimSayiDepo);
        }, 1000);
        //======================BİLDİRİM SAYISI SON======================//


        //======================ÜYELİK TARİHİ======================//
        if(uyelikTarihiAktif || trollSavarAktif || durumSayisiAktif || yorumSayisiAktif || rutbeAktif){
            var dd = new Date();
            var nn = dd.getTime();
            if(localStorage.getItem("uyeJson") && nn/1000-parseLocal("uyeJson")["update"]<2*3600){
                window.uyeDetayJson = parseLocal("uyeJson");
                uyeDetayJsonLoaded=true;
            }else{
                $.get('https://teknoizdirap.com/j/uyebilgiler', function (data, textStatus, jqXHR) {
                    var jsons = JSON.stringify(data);
                    window.uyeDetayJson = JSON.parse(jsons);
                    if(uyeDetayJson){
                        uyeDetayJsonLoaded=true;
                        localStorage.setItem("uyeJson", jsons);
                    }
                });
            }
        }
        //======================ÜYELİK TARİHİ SON======================//


        //======================PLUS ABONE TABLO======================//
        if(aboneTabloAktif && $("#col-right").length){
            var containerDiv='<div id="chartContainer" style="margin-bottom:10px; height: '+aboneTabloHeight +'px; width: 300px;"></div>';
            if(aboneTabloAltAktif){
                $(".copyright").before(containerDiv);
            }else{
                $("#col-right").prepend(containerDiv);
            }
        }
        //======================PLUS ABONE TABLO SON======================//

        //======================KEŞFET======================//
        if(location.pathname == "/") {
            if(teknoTwitAktif && (twitSag=="Keşfet" || twitSol=="Keşfet")){
                function kesfet(){
                    $('.kesfet-filters #icerik_filter').css({'width':'100%', 'margin-left': '0', 'margin-bottom': '5px'});
                    $('.kesfet-filters #tarih_filter').css({'width':'100%', 'margin-left': '0'});
                    $('.kesfet .main-head').css({'text-align':'center'});
                    $('#kesfet_form select').on('change', function(e) {
                        var t = $('.kesfet-filters #tarih_filter').val();
                        var f = $('.kesfet-filters #icerik_filter').val();
                        localStorage.setItem("kesfetT",t);
                        localStorage.setItem("kesfetF",f);
                        kesfetLoad(t,f);
                    });
                };
                var kesfetDiv;
                if(colRight && twitSag=="Keşfet"){
                    kesfetDiv = $('#twitSag');
                }if(colLeft && twitSol=="Keşfet"){
                    kesfetDiv = $('#twitSol');
                }
                function kesfetLoad(t,f){
                    kesfetDiv.load('https://teknoseyir.com/kesfet #col-left  > *', { "t": t,"f": f }, function() {
                        kesfet();
                    });
                }
                kesfetLoad(localStorage.getItem("kesfetT"),localStorage.getItem("kesfetF"));
                kesfetDiv.width('300px');
                kesfetDiv.attr('class','kesfet');
                $(".kesfet").css("float","left");
                $(".kesfet").css("padding","10px");
                $(".kesfet").css("padding","10px");
                kesfet();

                if(darkMode){
                    $('.kesfet').addClass('kesfetDark');
                }else{
                    $('.kesfet').addClass('kesfetLight');
                }
            }
        }

        //======================KEŞFET SON======================//

        //======================FONT BUTONLAR======================//
        fontButon();
        $('#fontadd').click(function() {
            fontSize+=2;
            localStorage.setItem('fontSize',fontSize);
            yaz("Font boyutu artırıldı: " + fontSize);
            font();
        });
        $('#fontmin').click(function() {
            fontSize-=2;
            localStorage.setItem('fontSize',fontSize);
            yaz("Font boyutu azaltıldı: " + fontSize);
            font();
        });
        //======================FONT BUTONLAR SON======================//



        //======================VIMEO======================//
        var alternatePlayer = $("[data-action=alternative_player]");
        var sinemaModu = $("[data-action=sinema_modu]");
        if(alternatePlayer.length){
            var alternateDiv="<div class='pull-right'><input id='alternate' type='checkbox' autocomplete='off'>";
            alternatePlayer.before(alternateDiv);
            document.getElementById("alternate").checked = alternateAktif;
            $('#alternate').click(function() {
                var alternate = document.getElementById("alternate");
                alternateAktif=alternate.checked;
                localStorage.setItem("alternateAktif", alternateAktif);
                var alt = alternateAktif === true ? "Youtube" : "Vimeo";
                yaz(" Varsayılan player: "+ alt);
            });
            if(alternateAktif){
                alternatePlayer.click();
                setTimeout(function(){
                    $("[data-action=alternative_player]").before(alternateDiv);
                    document.getElementById("alternate").checked = alternateAktif;
                    $('#alternate').click(function() {
                        var alternate = document.getElementById("alternate");
                        alternateAktif=alternate.checked;
                        localStorage.setItem("alternateAktif", alternateAktif);
                        var alt = alternateAktif === true ? "Youtube" : "Vimeo";
                        yaz(" Varsayılan player: "+ alt);
                    });
                },3000);
            }
        }

        if(sinemaModu.length){
            var sinemaDiv="<div class='pull-right'><input id='sinema' type='checkbox' autocomplete='off'>";
            sinemaModu.before(sinemaDiv);
            document.getElementById("sinema").checked = sinemaAktif;
            $('#sinema').click(function() {
                var sinema = document.getElementById("sinema");
                sinemaAktif=sinema.checked;
                localStorage.setItem("sinemaAktif", sinemaAktif);
                var sin = sinemaAktif === true ? "Sinema" : "Normal";
                yaz("Varsayılan mod: " + sin);
            });
            if(sinemaAktif){
                sinemaModu.click();
                setTimeout(function(){
                    $("[data-action=sinema_modu]").before(sinemaDiv);
                    document.getElementById("sinema").checked = sinemaAktif;
                    $('#sinema').click(function() {
                        var sinema = document.getElementById("sinema");
                        sinemaAktif=sinema.checked;
                        localStorage.setItem("sinemaAktif", sinemaAktif);
                        var sin = sinemaAktif === true ? "Sinema" : "Normal";
                        yaz("Varsayılan mod: " + sin);
                    });
                },3000);
            }
        }



        //if($("[data-action=sinema_modu]").length) $("[data-action=sinema_modu]").click();
        Number.prototype.round = function(p) {
            p = p || 10;
            return parseFloat( this.toFixed(p) );
        };
        var vimeoPlayer = $("#vimeo-player");
        if(vimeoPlayer.length){
            var muteVolume=0.5;
            var iframe = document.querySelector('iframe');
            var player = new Vimeo.Player(iframe);
            var keyPrevent = true;
            var focusInterval;
            function focusWindow(){
                focusInterval = setInterval(function(){window.focus();}, 500);
            }
            var vimeoSave = setInterval(function(){
                player.getPaused().then(function(paused) {
                    if(!paused){
                        player.getVideoId().then(function(id) {
                            player.getCurrentTime().then(function(seconds) {
                                seconds = Math.round(seconds);
                                if(seconds <  10) return;
                                localStorage.setItem("vimeo-"+id,seconds);
                                //console.log("vimeo saved: " + seconds);
                            });
                        });
                    }
                });
            }, 5000);
            $(document).on('click', '[data-action=alternative_player]', function() {
                var video = ($(this).attr("data-video"));
                console.log(video);
                if(video == "youtube"){
                    window.clearInterval(focusInterval);
                    keyPrevent=false;
                }else{
                    keyPrevent=true;
                    function vimeoLoad(){
                        if(!$("#vimeo-player").length){
                            setTimeout(vimeoLoad,500);
                            console.log("vimeo tekrar dene");
                            return;
                        }
                        console.log("vimeo ok");
                        iframe = document.querySelector('iframe');
                        player = new Vimeo.Player(iframe);
                        player.on('play', function(data) {
                            player.getVideoId().then(function(id) {
                                focusWindow();
                                if(localStorage.getItem("vimeo-")+id) {
                                    var savedSec = localStorage.getItem("vimeo-"+id);
                                    player.setCurrentTime(savedSec-3);
                                }
                            });
                        });
                        player.on('pause', function(data) {
                            player.getVideoId().then(function(id) {
                                player.getCurrentTime().then(function(seconds) {
                                    seconds = Math.round(seconds);
                                    localStorage.setItem("vimeo-"+id,seconds+3);
                                    //console.log("vimeo saved: " + seconds);
                                });
                            });
                        });
                    }
                    vimeoLoad();
                    //focusWindow();
                }
            });


            player.on('play', function(data) {
                player.getVideoId().then(function(id) {
                    focusWindow();
                    if(localStorage.getItem("vimeo-")+id) {
                        var savedSec = localStorage.getItem("vimeo-"+id);
                        player.setCurrentTime(savedSec-3);
                    }
                });
            });
            player.on('pause', function(data) {
                player.getVideoId().then(function(id) {
                    player.getCurrentTime().then(function(seconds) {
                        seconds = Math.round(seconds);
                        localStorage.setItem("vimeo-"+id,seconds+3);
                        //console.log("vimeo saved: " + seconds);
                    });
                });
            });


            function vimeoFF(){
                player.getCurrentTime().then(function(seconds) {
                    player.setCurrentTime(seconds+vimeoJump);
                });
            }

            function vimeoRew(){
                player.getCurrentTime().then(function(seconds) {
                    var sec = seconds-vimeoJump;
                    if (sec < 0) sec=0;
                    player.setCurrentTime(sec);
                });
            }

            function vimeoSesUp(){
                player.getVolume().then(function(volume) {
                    var vol = volume+0.1;
                    if (vol > 1) vol = 1;
                    vol=vol.round(3);
                    console.log("Ses: " + vol);
                    player.setVolume(vol);
                });
            }

            function vimeoSesDown(){
                player.getVolume().then(function(volume) {
                    var vol = volume-0.1;
                    if (vol < 0) vol = 0;
                    vol=vol.round(3);
                    console.log("Ses: " + vol);
                    player.setVolume(vol);
                });
            }

            function vimeoMute(){
                player.getVolume().then(function(volume) {
                    if(volume > 0){
                        muteVolume = volume;
                        console.log("Ses: " + 0);
                        player.setVolume(0);
                    }else{
                        player.setVolume(muteVolume);
                        console.log("Ses: " + muteVolume);
                    }
                });
            }


            function vimeoPlayPause(){
                player.getPaused().then(function(paused) {
                    if(paused) player.play();
                    else player.pause();
                });

            }

            document.onkeydown = function (e) {
                if ( !e.metaKey && e.target.nodeName!='TEXTAREA') {
                    if(e.keyCode==37) {//sol
                        if(keyPrevent) e.preventDefault();
                        vimeoRew();
                    }
                    if(e.keyCode==38){//yukarı
                        if(keyPrevent) e.preventDefault();
                        vimeoSesUp();
                    }
                    if(e.keyCode==39) {//sağ
                        if(keyPrevent) e.preventDefault();
                        vimeoFF();
                    }
                    if(e.keyCode==40){//aşağı
                        if(keyPrevent) e.preventDefault();
                        vimeoSesDown();
                    }
                    if(e.keyCode==32){//boşluk
                        if(keyPrevent) e.preventDefault();
                        vimeoPlayPause();
                    }
                    if(e.keyCode==77){//m
                        if(keyPrevent) e.preventDefault();
                        vimeoMute();
                    }
                    if(e.keyCode==70){//f
                        function focusIframe() {
                            var vimeoIframe = $("#vimeo-player")[0];
                            vimeoIframe.contentWindow.focus();
                        }
                        window.clearInterval(focusInterval);
                        setTimeout(focusIframe, 100);
                        setTimeout(focusWindow, 3000);
                        if(keyPrevent) e.preventDefault();
                    }
                }
            };
        }
        //======================VIMEO SON======================//



        //======================SPOILER BLUR======================//
        $(document).on('click', '.spoiler', function() {
            article = $(this).closest('article');
            article.find('.spoiler').each(function() {
                $(this).toggleClass('on');
            });
        });
        //======================SPOILER BLUR SON======================//


        //======================RESULT DIV======================
        $("body").append("<div class='result' id ='result'></div>");
        resultDiv= document.getElementById("result");
        //======================RESULT DIV SON======================
    }
};