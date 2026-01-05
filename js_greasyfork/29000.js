// ==UserScript==
// @author      FIRAT
// @name        TeknoIZDIRAP
// @namespace   http://teknoizdirap.com
// @description Teknoseyir.com için gelişmiş özellikler
// @include     https://teknoseyir.com/*
// @exclude     https://teknoseyir.com/wp-*
// @version     1.3.2
// @icon        http://teknoizdirap.com/izdirap48.png
// @icon64      http://teknoizdirap.com/izdirap64.png
// @require     https://greasyfork.org/scripts/33559-favicon/code/Favicon.js?version=220795
// @require     https://greasyfork.org/scripts/41019-canvas/code/Canvas.js?version=267301
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29000/TeknoIZDIRAP.user.js
// @updateURL https://update.greasyfork.org/scripts/29000/TeknoIZDIRAP.meta.js
// ==/UserScript==
var version = '1.3.2';
var updateLink = "https://greasyfork.org/tr/scripts/29000-teknoizdirap";

(function($) {
    'use strict';

    function parseLocal(local) {
        var parsed;
        try {
            parsed = JSON.parse(localStorage.getItem(local));
        } catch (e) {
            localStorage.removeItem(local);
            return false;
        }
        return parsed;
    }

    var resultDiv,updateDiv;
    $("body").append("<div class='update' id ='update'></div>");
    $("body").append("<div class='notifications' id ='notifications'></div>");
    $("body").append("<div class='kesfetPreview' id ='kesfetPreview'></div>");
    updateDiv= document.getElementById("update");


    //VERSİYON AYARLARI
    console.log("TeknoIzdırap v"+ version);
    var lastVersion = localStorage.getItem('lastVersion');
    if(!lastVersion) lastVersion='0.0.0';
    var depoVersion = localStorage.getItem('depoVersion');
    if(!depoVersion) depoVersion='0.0.0';
    if(version.length==3) version+=".0";
    var versionFloat=parseFloat(version.substring(0,3));
    var lastVersionFloat=parseFloat(lastVersion.substring(0,3));
    var depoVersionFloat=parseFloat(depoVersion.substring(0,3));
    var versionFullFloat=parseFloat(version.replace(".","").replace(".",""));

    //var hataLink = "mailto:admin@teknoizdirap.com?subject=TeknoIzdırap%20Hata%20Bildirimi&body="+navigator.userAgent+"%0D%0AEklenti%20Ad%C4%B1%3A%0D%0ASorun%3A%0D%0ASorun%20olu%C5%9Ftu%C4%9Funda%20F12%27ye%20bas%C4%B1p%20ald%C4%B1%C4%9F%C4%B1n%C4%B1z%20ekran%20g%C3%B6r%C3%BCnt%C3%BCs%C3%BCn%C3%BC%20eklemeyi%20unutmay%C4%B1n.";
    //Yeni Sürüm Kontrol
    var updateTimeout = 0;
    var updateDelay = 60*60*3;
    function versionCheck(){
        return;
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
        var max = 20;
        var min = 3;
        var randomNumber = Math.random() * (max - min) + min;
        console.log("Yeni sürüm " + Math.floor(randomNumber+updateTimeout) +" saniye sonra tekrar kontrol edilecek");
        setTimeout(versionCheck,1000 + (randomNumber+updateTimeout)*1000);
    }
    versionCheck();
    function versionAlert(){
        //latestVersionFloat = parseFloat(window.versionJson["ver"].substring(0,3));
        var latestVersionFullFloat = parseFloat(window.versionJson.ver.replace(".","").replace(".",""));
        if(latestVersionFullFloat > versionFullFloat){
            updateDiv.innerHTML= ("TeknoIzdırap Eklentisi Güncellemesi Mevcut (v" + window.versionJson.ver + ")...<br>");
            updateDiv.innerHTML+="Güncellemek için <a target='_new' href='"+updateLink+"'>TIKLAYIN</a>.<br>";
            //updateDiv.innerHTML+= "Geri bildirimleri <a target='_new' href='"+hataLink+"'>ŞURAYA</a> yazabilirsiniz 🙂<br>";
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
        updateDiv.innerHTML+="CHANGELOG BÖLÜMÜNÜ OKUMAYI UNUTMAYIN.<br>";
        updateDiv.innerHTML+="Bu uyarı yeni özellik eklediğinde sadece bir kereliğine görüntülenecektir.";
        updateDiv.innerHTML+="<div id='hideAlert' class='hideAlert'>X</div>";
        localStorage.setItem("changelogAktif",true);
    }

    //TROLSAVAR AYARLARI
    var trollDay = 3;
    var trollDo="Gizle";
    if(localStorage.getItem('trollDay')) trollDay = localStorage.getItem('trollDay').trim();
    if(localStorage.getItem('trollDo')) trollDo = localStorage.getItem('trollDo').trim();

    //HORTSAVAR AYARLARI
    var hortDay = 60;
    var hortDo="Uyar";
    if(localStorage.getItem('hortDay')) hortDay = localStorage.getItem('hortDay').trim();
    if(localStorage.getItem('hortDo')) hortDo = localStorage.getItem('hortDo').trim();

    //KELİME ENGELLEME AYARLARI
    var engellenecekler="";
    if(localStorage.getItem('engellenecekler')) engellenecekler = localStorage.getItem('engellenecekler').trim().toLowerCase();
    var linesEngelle = engellenecekler.split("\n");

    //AKIŞ DURUM GİZLEME AYARLARI
    var gizlenecekler="";
    if(localStorage.getItem('gizlenecekler')) gizlenecekler = localStorage.getItem('gizlenecekler').trim();
    var linesGizle = gizlenecekler.split("\n");
    var gizleArray = [];
    $.each(linesGizle, function(n, gizleId) {
        if($.inArray(gizleId,gizleArray) === -1){
            gizleArray.push(gizleId);
        }
    });
    //Çoklu girişleri siliyoruz
    gizlenecekler="";
    $.each(gizleArray, function(n, gizleId) {
        gizlenecekler+=gizleId+"\n";
    });
    localStorage.setItem("gizlenecekler",gizlenecekler);


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
    var plusBadgeColor = localStorage.getItem("plusBadgeColor");

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

    //Varsayılan Ayarlar
    var uyeDetayJsonLoaded=false;
    var darkMode=false;
    var vimeoJump=5;
    var vimeoDefault=0;//0=auto
    var brightness=50;

    if(localStorage.getItem('aboneTabloAktif')===null) localStorage.setItem('aboneTabloAktif',true);
    if(localStorage.getItem('changelogAktif')===null) localStorage.setItem('changelogAktif',true);
    if(localStorage.getItem('kesfetT')===null) localStorage.setItem("kesfetT","gun");
    if(localStorage.getItem('kesfetF')===null) localStorage.setItem("kesfetF","okunma");
    if(localStorage.getItem('vimeoJump')) vimeoJump = localStorage.getItem('vimeoJump').trim();
    if(localStorage.getItem('vimeoDefault')) vimeoDefault = localStorage.getItem('vimeoDefault').trim();
    if(localStorage.getItem('kesfetPreviewAktif')===null) localStorage.setItem('kesfetPreviewAktif',true);
    if(localStorage.getItem("bildirimSayi")===null) localStorage.setItem("bildirimSayi",0);
    if(localStorage.getItem("fontSize")===null) localStorage.setItem("fontSize",14);
    if(localStorage.getItem("kesfetHeight")===null) localStorage.setItem("kesfetHeight",500);

    //Bildirim Sayısı
    var bildirimSayiDepo=0;
    var bildirimSon=0;
    var bildirimSayi=0;
    var faviconSayi=-1;

    var geceModAktif, teknoTwitAktif, aramaAktif, rutbeAktif, uyelikTarihiAktif, bildirimAlertAktif,
        bildirimTitleAktif, bildirimFaviconAktif, profilAktif, trollSavarAktif, hortSavarAktif,
        kelimeEngelleAktif, durumSayisiAktif, yorumSayisiAktif, fontAktif , fontButonAktif,
        fontSize, yorumParlatAktif, spoilerAktif, spoilerButonuAktif, quoteButonuAktif,
        codeButonuAktif, linkButonuAktif, resimAktif, resim2Aktif, aboneTabloAktif,
        aboneTabloAltAktif, changelogAktif, alternateAktif, sinemaAktif,
        kesfetPreviewAktif, kesfetHeight;

    function update(){
        geceModAktif = parseLocal("geceModAktif");
        teknoTwitAktif = parseLocal("teknoTwitAktif");
        aramaAktif = parseLocal("aramaAktif");
        rutbeAktif = parseLocal("rutbeAktif");
        uyelikTarihiAktif = parseLocal("uyelikTarihiAktif");
        bildirimAlertAktif = parseLocal("bildirimAlertAktif");
        bildirimTitleAktif = parseLocal("bildirimTitleAktif");
        bildirimFaviconAktif= parseLocal("bildirimFaviconAktif");
        profilAktif = parseLocal("profilAktif");
        trollSavarAktif = parseLocal("trollSavarAktif");
        hortSavarAktif = parseLocal("hortSavarAktif");
        kelimeEngelleAktif = parseLocal("kelimeEngelleAktif");
        durumSayisiAktif = parseLocal("durumSayisiAktif");
        yorumSayisiAktif = parseLocal("yorumSayisiAktif");
        fontAktif = parseLocal("fontAktif");
        fontButonAktif = parseLocal("fontButonAktif");
        fontSize = parseLocal("fontSize");
        yorumParlatAktif = parseLocal("yorumParlatAktif");
        spoilerAktif = parseLocal("spoilerAktif");
        spoilerButonuAktif = parseLocal("spoilerButonuAktif");
        quoteButonuAktif = parseLocal("quoteButonuAktif");
        codeButonuAktif = parseLocal("codeButonuAktif");
        linkButonuAktif = parseLocal("linkButonuAktif");
        resimAktif = parseLocal("resimAktif");
        resim2Aktif = parseLocal("resim2Aktif");
        aboneTabloAktif = parseLocal("aboneTabloAktif");
        aboneTabloAltAktif = parseLocal("aboneTabloAltAktif");
        bildirimSayiDepo = parseLocal("bildirimSayi");
        changelogAktif = parseLocal("changelogAktif");
        alternateAktif = parseLocal("alternateAktif");
        sinemaAktif = parseLocal("sinemaAktif");
        kesfetPreviewAktif = parseLocal("kesfetPreviewAktif");
        kesfetHeight = parseLocal("kesfetHeight");
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

            if ( bottom > viewport_top ) {//sadece ekranın aşağısındakileri büyütüyoruz
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
    var spoil="SPOILER";
    for(var n=0;n<99;n++) spoil+= "-SPOILER";

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
            if(txt.length>0) txt+= "";
            txt+= "<blockquote>" + topic + "</blockquote>";
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
            if(txt.length>0) txt+= "";
            txt+= "<code>" + topic + "</code>";
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
                if(txt.length>0) txt+= "";
                txt+= "<a href='" + link + "'>" + topic + "</a>";
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
    var sunHour = 7;
    var sunMinute = 30;
    var moonHour = 19;
    var moonMinute = 30;

    function geceModu(){
        darkMode = $('#koyu_css-css').length===0 ? false : true;
        if(localStorage.getItem('sunHour')) sunHour = localStorage.getItem('sunHour').trim();
        if(localStorage.getItem('sunMinute')) sunMinute =localStorage.getItem('sunMinute').trim();
        if(localStorage.getItem('moonHour')) moonHour = localStorage.getItem('moonHour').trim();
        if(localStorage.getItem('moonMinute')) moonMinute = localStorage.getItem('moonMinute').trim();

        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        var timeSun = new Date("1923-10-29");
        timeSun.setHours(sunHour, sunMinute,0);

        var timeMoon = new Date("1923-10-29");
        timeMoon.setHours(moonHour, moonMinute,0);


        var timeNow = new Date("1923-10-29");
        timeNow.setHours(h, m, s);


        if (document.getElementById('koyu_tema')) {
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
                localStorage.setItem("clickWaiting", false);
                var l = document.getElementById('koyu_tema').getElementsByTagName('a')[0];
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
            $(".kesfet").attr('class','kesfet widget kesfetLight');
            $("#notifications .notification").removeClass('notification-dark');
            $(".notification-full").removeClass('notification-full-dark');
        }else{

            $(".kesfet").attr('class','kesfet widget kesfetDark');
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
        return;
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
        var max = 15;
        var min = 3;
        var randomNumber = Math.random() * (max - min) + min;
        console.log("Bildirimler " + Math.floor(randomNumber+bildirimUpdateTimeout) + " saniye sonra tekrar kontrol edilecek");
        setTimeout(bildirimCheck, 1000 + (randomNumber+bildirimUpdateTimeout)*1000);
    }
    setTimeout(bildirimCheck,3000);


    var bildirimJsonUpdating = false;
    function bildirimUpdate(){
        return;
        if(bildirimJsonUpdating) return;
        var bildirimIds = parseLocal("bildirimIdJson");
        if(!bildirimIds) {
            bildirimCheck();
            console.log("Bildirim Id Hata, yeniden deneniyor");
            return;
        }
        for(var s=0;s<bildirimIds.length;s++){
            var id = bildirimIds[s].id;
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
                    var fark = new Date().getTime()/1000-localStorage.getItem("bildirimJsonUp");
                    console.log("Bildirim Json " + Math.floor(fark) + " saniye sonra yenilendi");
                    localStorage.setItem("bildirimJsonUp", (new Date().getTime())/1000);
                    bildirimJsonUpdating=false;
                }
            });
        }

        if(bildirimJsonUpdating) return;
        var bildirimData="";
        if(parseLocal("bildirimJson")){
            bildirimData = parseLocal("bildirimJson").d;
        }else{
            console.log("Json Hatası");
            return;
        }

        for(var n=0;n<bildirimData.length;n++){
            var bildirimId = bildirimData[n].id;
            var sum = bildirimData[n].sum;
            var author = bildirimData[n].author;
            var text = bildirimData[n].text;
            var date = bildirimData[n].date;
            if(!bildirimId.length){
                console.log("bildirim hatalı");
                return;
            }
            var idSplit = bildirimId.split("-");
            var id0 = idSplit[0];
            var id1 = idSplit[1];
            var url;
            if(id0=="durum"){
                url="https://teknoseyir.com/durum/"+id1;
            }else{
                url = bildirimData[n].url;
            }
            var title;
            if(id0=="durum"){
                title = "<span>"+ author +"</span><span>&nbsp;bir&nbsp;<a class='notClose' data='" + bildirimId + "' target='_blank' href='" + url + "'>" + id0 + "</a> paylaştı.</span>";
            }
            if(id0=="ızdırap"){
                title = "<span><a target='_blank' href='https://teknoizdirap.com'>TeknoIzdırap</a> bir duyuru paylaştı.</span>";
            }
            Notification(bildirimId,title,sum,text,date,url);
        }
    }

    function Notification(id,title,summary,text,date,url){
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
TÜM DURUM BİLDİRİMLERİNİ SİLMEK İÇİN
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
    var plusUpdateTimeout = 0;
    var plusUpdateDelay = 60*10*1;
    function plusCheck(){
        return;
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
        var max = 15;
        var min = 3;
        var randomNumber = Math.random() * (max - min) + min;
        console.log("Plus Sayısı " + Math.floor(randomNumber+plusUpdateTimeout) +" saniye sonra tekrar kontrol edilecek");
        setTimeout(plusCheck, 1000 + (randomNumber+plusUpdateTimeout)*1000);
    }
    plusCheck();


    //======================PLUS ABONE TABLO======================//

    var aboneTabloHeight=150;
    if(localStorage.getItem('aboneTabloHeight')) aboneTabloHeight = localStorage.getItem('aboneTabloHeight').trim();
    function plusChart() {
        return;
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
                markerType: "none", //"triangle", "circle", "square", "cross", "none"
                //markerColor: "white",
                //markerBorderColor: "red",
                type: "area",
                fillOpacity: 0.3,
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
    };
    //======================PLUS ABONE TABLO SON======================//


    //======================PLUS SAYI VE RENK======================//
    function plusRenk(){
        var plusBadge = document.getElementsByClassName("plus");
        for (var i = 0; i < plusBadge.length; ++i) {
            var item = plusBadge[i];
            item.style.color=plusBadgeColor;
        }
    }
    var abonelik = $("ul.navbar-left li:last-child");
    var abonelikText = abonelik.text();
    function plusUpdate(){
        return;
        $("#plusSayi").text(abonelikText + " ("+window.plusJson.plus+") ");
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
            var rgb;
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
            if(!resim2Aktif && $(".modal.in").length) return;
            $("img, .embed img").not("[brightness]").not(".kesfet").each(function() {//.filter(":onScreen")
                $(this).attr('brightness','1');

                $(this).css("-moz-filter", "brightness("+brightness+"%)");
                $(this).css("filter", "brightness("+brightness+"%)");

            });
        }
        $("#twitSol, #twitSag").not("[brightness]").each(function() {
            //var $col=  $(this);
            $('[id^=twitter-widget]').contents().find('*').not("[brightness]").each(function () {
                $(this).css("background-color", "#333");
                $(this).find('p, span').css("color", "#bbb");
                if(resimAktif){
                    var image = $(this).find('img, div.tcu-imageWrapper').not("[brightness]");
                    image.css("-moz-filter", "brightness("+brightness+"%)");
                    image.css("filter", "brightness("+brightness+"%)");
                    image.css("color", "#bbb");
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
            /*
        $("[data-object_id]").not("[uyeDetay]").each(function(){

            var uid = ($(this).attr("data-object_id"));
            var article_id = $(this).closest('article').attr("id");
            console.log(uid + " - " + article_id);
            $(this).attr("uyeDetay","1");
        });

        return;
        */
            var objs = getAllElementsWithAttribute('data-object_id');
            if(objs === false) return;
            for (var i = 0; i < objs.length; i++) {

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
                            if((!window.uyeDetayJson.u[uid])){
                                time = new Date()-1;
                                tarih ='Bilinmiyor';
                            }else if (window.uyeDetayJson.u[uid].t!==null) {
                                tt = window.uyeDetayJson.u[uid].t;
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
                                        if(trollDo=="Uyar") uyeDetaylar += "-- <b>TROLL OLABİLİR</b>";
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
                                    var trollId = "troll-" + $(this).attr("id");
                                    var trollMesaj=""+
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
                            if((window.uyeDetayJson.u[uid])){
                                if(uyelikTarihiAktif){
                                    uyeDetaylar += ' -- ' + tarih;
                                }
                                if(durumSayisiAktif){
                                    uyeDetaylar += ' -- D:~' + (window.uyeDetayJson.u[uid].d);
                                }
                                if(yorumSayisiAktif){
                                    uyeDetaylar += ' -- Y:~' + (window.uyeDetayJson.u[uid].y);
                                }
                                if(rutbeAktif){
                                    if (window.uyeDetayJson.u[uid].r) {
                                        r = window.uyeDetayJson.r[window.uyeDetayJson.u[uid].r];
                                    } else {
                                        r = window.uyeDetayJson.r[0];
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
    var teknoTwitHeight=0;
    var twitSol="Karma";
    var twitSag="Keşfet";
    var SolDiv,SagDiv;

    if(localStorage.getItem('teknoTwitHeight')) teknoTwitHeight = localStorage.getItem('teknoTwitHeight').trim();
    if(localStorage.getItem('twitSol')) twitSol = localStorage.getItem('twitSol');
    if(localStorage.getItem('twitSag')) twitSag = localStorage.getItem('twitSag');

    var colRight = document.getElementById('col-right');
    var colLeft = document.getElementById('col-move');

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
        var twitRandom = Math.floor(Math.random() * 3);
        if(!teknoTwitAktif) return;
        var data1= '<a class="twitter-timeline" ';
        if(darkMode) data1 += 'data-theme="dark" ';
        if(teknoTwitHeight>0) data1 += 'data-height="'+ teknoTwitHeight +'" ';

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
                    fark = new Date(new Date() - start),
                    gun = fark/1000/60/60/24;
                if(gun-hortDay>=0){
                    console.log("Hort bulundu");
                    //article = $(this).closest('article');

                    if(hortDo=="Uyar") $(this).prepend("<h2 class='hortAlert'>DİKKAT HORT KONU</h2>");
                    if(hortDo=="Sil"){
                        $(this).hide();
                        console.log("HortSavar, Durum Gizlendi");
                    }
                    if(hortDo=="Gizle"){
                        var hortId = "hort-" + $(this).attr("id");
                        var hortMesaj=""+
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
            var article = $(this);
            article.addClass("spoiled");
            var text = article.find('.content').text()+"";
            var embed = article.find('.embed').find('a').attr('href')+"";
            //console.log( text.toLowerCase());
            if (embed.toLowerCase().indexOf("#spoiler") >= 0 || text.toLowerCase().indexOf("#spoiler") >= 0 || text.toLowerCase().indexOf("#spoi̇ler".toLowerCase()) >= 0){
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
    RegExp.escape= function(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };
    Array.prototype.find = function(regex) {
        var arr = this;
        var matches = arr.filter( function(e) { return regex.test(e); } );
        return matches.map(function(e) { return arr.indexOf(e); } );
    };
    function kelimeEngelle(){
        if(kelimeEngelleAktif && location.pathname === '/'){
            $('#col-left').find('article').not("[kelime]").each(function() {
                $(this).attr('kelime', '1');
                //article = $(this).closest('article');
                var article = $(this);
                var text = ($(this).find('.content:first').text()+"").trim();//:first=>sadece durum içeriği var, yorumlar yok
                text= text.replace(/İ/g,"i").replace(/I/g,"i").toLowerCase().replace(/ı/g,"i");//önce İ ve I'yı i yap, sonra küçük harf, sonra da küçük ı'yı i yap
                var embed = ($(this).find('.embed').find('a').attr('href')+"").trim().toLowerCase();
                var textArray = text.split(/[^\w@#ığüşöç]/);
                textArray = textArray.filter(function(n){ return n != "" && n!= undefined});

                $.each(linesEngelle, function(n, kelime) {
                    kelime=kelime.toLowerCase().trim();
                    var jokerFirst=false;
                    var jokerLast=false;
                    if(kelime.slice(0,1)=="*"){
                        jokerFirst=true;
                        kelime=kelime.slice(1);
                    }
                    if(kelime.slice(-1)=="*"){
                        jokerLast=true;
                        kelime=kelime.slice(0,-1);
                    }

                    if (embed.indexOf(kelime) >= 0 && kelime.length > 0){
                        console.log("Engellenecek link bulundu: " + kelime);
                        article.hide();
                        return false;//durum engellenecek bir kelime içeriyor, diğer kelimeleri kontrol etmeden diğer duruma geç
                    }

                    kelime=kelime.replace(/ı/g,"i");
                    if (text.indexOf(kelime) >= 0 && kelime.length > 0){
                        console.log("Kelime aranıyor: " + kelime);
                        var pattern;
                        var kelimeEscaped = RegExp.escape(kelime);
                        if(!jokerFirst && jokerLast) pattern = "^" + kelimeEscaped; // Starts with
                        if(jokerFirst && !jokerLast) pattern = kelimeEscaped + "$"; // Ends with
                        if(jokerFirst && jokerLast) pattern = kelimeEscaped; // Contains
                        if(!jokerFirst && !jokerLast) pattern = "^" + kelimeEscaped + "$";
                        var regexp= new RegExp(pattern);
                        if(textArray.find(regexp).length>0){
                            console.log("Engellenecek kelime bulundu: " + kelime);
                            article.hide();
                            return false;//durum engellenecek bir kelime içeriyor, diğer kelimeleri kontrol etmeden diğer duruma geç
                        }
                    }
                });
            });
        }
    }
    //======================KELIME ENGELLE SON======================//


    //======================GÖNDERİ GİZLE======================//
    function postGizle(){
        //Listedeki postları gizler
        if(location.pathname === '/'){
            $('#col-left').find('article').not("[gizle]").each(function() {
                $(this).attr('gizle','1');
                var article = $(this);
                var id = $(this).attr('id');
                id = id.replace("post-","");
                if($.inArray(id,gizleArray) !== -1){
                    $(this).hide();
                    console.log("Gönderi Gizlendi: "+ id);
                }
            });
        }
    }
    function gizleButonu(){
        //Postlara "Gizle" butonu ekler
        $(".post-actions").not("[gizleButon]").each(function(){
            $(this).attr("gizleButon","");
            var yorumYap = $(this).find(".yorum_yap");
            var gizleDiv = yorumYap.clone();
            gizleDiv.text("Gizle");
            gizleDiv.removeAttr("data-action");
            gizleDiv.attr("ızdırap-action","gizle");
            //gizleDiv.attr("href","");
            yorumYap.after(gizleDiv);
        });
    }
    //======================GÖNDERİ GİZLE SON======================//



    function gifFix(){
        //======================GFYCAT======================//
        $('a[href*="/gfycat.com/"]').each(function() {
            var embedDiv = $(this).closest(".embed.mobil");
            var embedImg = $(this).closest(".embed_img");
            embedImg.addClass("animated_gif");
            embedImg.css( 'cursor', 'pointer' );
            embedImg.append('<span class="gif_button" data-action="img_popup"></span>');
            var gfyHref = $(this).attr('href');
            var gfyId = gfyHref.split(/[/]+/).pop();
            var gfyCatDiv = "<div style='position:relative;padding-bottom:calc(100% / 1.85)'>"+
                "<iframe src='https://www.gfycat.com/ifr/"+gfyId+"' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen>"+
                "</iframe></div>";

            embedImg.on('click', function() {
                embedDiv.html(gfyCatDiv);
                return false;
            });
        });
        //======================GFYCAT SON======================//

        //======================GIF AYARLAR======================//
        $('.gallery').not(".animated_gif").find('img[src$=".gif"]').each(function() {
            var gifWidth = $(this).attr("width");
            var gifHeight = $(this).attr("height");
            if(!gifHeight || !gifWidth){
                gifWidth = $(this).attr("data-width");
                gifHeight = $(this).attr("data-height");
                if(gifWidth>598){
                    gifHeight=Math.floor(598/gifWidth*gifHeight);
                    gifWidth=598;
                }
            }
            var gifSrc = $(this).attr("src");
            var gifDim = "-" + gifWidth + "x" + gifHeight + ".gif";
            var galleryImg = $(this).closest(".gallery");
            //console.log(gifSrc + "=>" + gifWidth + "=>" + gifHeight);
            galleryImg.addClass("animated_gif");
            if(gifSrc.indexOf(gifDim)==-1) return;
            galleryImg.append('<span class="gif_button" data-action="img_popup"></span>');
        });
        //======================GIF AYARLAR SON======================//
    }



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
            setInterval(bildirimUpdate, 5*1000);//notification
            setInterval(faviconUpdate, 1000);
            setInterval(gizleButonu, 500);
            setInterval(postGizle, 1000);
            setInterval(gifFix, 1000);



            //font();


            var css = ".result,.vimeoList{top:50px;background-color:#dcdcdc;color:#000;max-width:300px}.result,.update,.vimeoList{z-index:10000;font-size:20px;position:fixed;font-weight:700}.kesfetPreview,.result,.update,.vimeoList{position:fixed}.result,.update,.vimeoList,.yeni{font-weight:700}#notifications,.notification-full{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif}.result{right:10px}.vimeoList{left:10px}.hideAlert,.update{background-color:#ab1500}.update{left:10px;bottom:10px}.kesfetPreview{z-index:1049;display:none;overflow-y:scroll;padding:10px}.hideAlert{position:absolute;right:5px;top:5px;cursor:pointer;color:#fff}.link{cursor:pointer;color:#337ab7}.kesfet article{display:block;padding:10px;min-height:50px;position:relative;border:1px solid;border-radius:3px;margin:10px 0}#notifications,.fontButtons{position:fixed;z-index:1000}#notifications .notification,.notification-full{max-width:100%;float:right;padding:12px;border-radius:2px;box-sizing:border-box}.kesfetDark article{background-color:#333;border-color:#373737}.kesfetDark h1 a{color:#bbb}.kesfetLight article{background-color:#fff;border-color:#e5e6e9 #dfe0e4 #d0d1d5}.kesfetLight h1 a{color:#333}.yeni{color:red}.fontButtons{bottom:20px;right:55px}.uyeDetaylar{font-size:12px;font-weight:100}.hortAlert{margin:20px;text-align:center}#notifications{font-weight:400;font-size:15px;right:10px;bottom:10px;cursor:default;width:284px;max-width:100%}@media(max-width:332px){#notifications{width:100%;width:calc(100% - 16px);right:8px;bottom:8px}}#notifications .notification{position:relative;z-index:2;color:#000;width:100%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);transition:box-shadow .375s cubic-bezier(.25,.8,.25,1)}#notifications .notification-dark{color:#fff;background:#424242}#notifications .notification+.notification{margin-top:8px}#notifications .notification:hover{box-shadow:0 3px 6px rgba(0,0,0,.16),0 3px 6px rgba(0,0,0,.23)}#notifications .notification .notification-close{position:absolute;right:8px;top:8px;display:inline-block;width:20px;height:20px;cursor:pointer;background:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE5IDYuNEwxNy42IDUgMTIgMTAuNiA2LjQgNSA1IDYuNGw1LjYgNS42TDUgMTcuNiA2LjQgMTlsNS42LTUuNiA1LjYgNS42IDEuNC0xLjQtNS42LTUuNnoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PC9zdmc+) center/contain no-repeat}#notifications .notification-dark .notification-close{background-image:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE5IDYuNEwxNy42IDUgMTIgMTAuNiA2LjQgNSA1IDYuNGw1LjYgNS42TDUgMTcuNiA2LjQgMTlsNS42LTUuNiA1LjYgNS42IDEuNC0xLjQtNS42LTUuNnoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PC9zdmc+)}#notifications .notification .notification-close:hover{background-image:url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjYWIxNTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTE5IDYuNEwxNy42IDUgMTIgMTAuNiA2LjQgNSA1IDYuNGw1LjYgNS42TDUgMTcuNiA2LjQgMTlsNS42LTUuNiA1LjYgNS42IDEuNC0xLjQtNS42LTUuNnoiLz48cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDI0djI0SDB6Ii8+PC9zdmc+)}#notifications .notification .notification-title span{display:inline-block}#notifications .notification .notification-title span a{color:#ab1500;font-weight:500;text-decoration:none}#notifications .notification .notification-title span a:hover{color:#000}#notifications .notification .notification-body .notification-date{font-size:12px;color:#616161}#notifications .notification-dark .notification-body .notification-date{color:#fff}#notifications .notification .notification-body .notification-summary{margin:4px 0 0;font-size:14px;line-height:20px}.notification-full{background-color:#fff;color:#000;display:none;font-weight:400;font-size:15px;position:fixed;bottom:10px;right:300px;z-index:1000;cursor:default;width:284px;border-color:#616161;word-wrap:break-word}.notification-full-dark{background-color:#424242;color:#fff}.inputIzdırap{border:0;outline:0;background-color:transparent}.spoiler{cursor:pointer}.spoiler.on{color:transparent;text-shadow:0 0 10px grey}.spoiler.on a{color:transparent;text-shadow:0 0 10px #23527c}.spoiler.on img{filter:blur(20px)!important;-webkit-filter:blur(20px)!important;-moz-filter:blur(20px)!important}"
            $('head').append('<style>' + css + '</style>');

            /*
            var cssUrl = window.versionJson.css;
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "https://teknoizdirap.com/"+cssUrl
            }).appendTo("head");
            */

            abonelik.html(abonelik.html().replace(abonelikText, '<span id="plusSayi">'+ abonelikText +'</span>'));
            plusUpdate();

            document.onkeyup = function (e) {
                //GIF RELOAD
                if(e.keyCode==82 && $(".modal.in").length) {//R
                    $(".modal.in").find("img").not(".hide").each(function(){
                        var gifImg = $(this);
                        var gifImgId = gifImg.attr("data-imgid");
                        var gifSrc = gifImg.attr("src");
                        $("img[data-imgid="+gifImgId+"]").each(function(){
                            $(this).attr("src","");
                        });
                        setTimeout(function(){
                            $("img[data-imgid="+gifImgId+"]").each(function(){
                                $(this).attr("src",gifSrc);
                            });
                        },50);
                    });
                }

                var evtobj = window.event? event : e
                if ((evtobj.keyCode == 60 || evtobj.keyCode == 226) && evtobj.ctrlKey){
                    $("#update").show();
                    updateDiv.innerHTML = "<div><textarea style='width:100%' id='kelimeListesi'>"+localStorage.getItem("engellenecekler")+"\n</textarea></div>"+
                        "<div id='hideKelimeListesi' class='hideAlert'>X</div>";
                    $('#kelimeListesi').on('input', function() {
                        localStorage.setItem("engellenecekler", $(this).val());
                        yaz("Engellenecekler Kaydedildi");
                    });
                    $(document)
                        .on('click', '#hideKelimeListesi', function() {
                        $("#update").html("");
                        $("[kelime]").removeAttr('kelime');
                        yaz("Yeni liste uygulanıyor");
                        linesEngelle = localStorage.getItem("engellenecekler").trim().toLowerCase().split("\n");
                    });
                }

            };

            $(document)
                .on('click', '[ızdırap-action=gizle]', function() {
                var durumId = $(this).attr("data-object_id");
                var gizlenecekListe = "";
                if(localStorage.getItem('gizlenecekler')) gizlenecekListe = localStorage.getItem('gizlenecekler').trim();
                $("article#post-"+durumId).each(function(){
                    localStorage.setItem("gizlenecekler",gizlenecekListe+"\n"+durumId);
                    gizleArray.push(durumId);
                    $(this).hide();
                    yaz("Gönderi gizlendi: "+durumId+"<br> Geri almak için; <a href='/ayarlar'>ayarlar</a> sayfasına gidip bu numarayı listeden çıkarabilirsiniz.");
                });
                return false;
            });

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
                var limitSum = parseLocal("bildirimJson").limit_sum+3;
                //var limit_text = parseLocal("bildirimJson").limit_text;
                var dataId = ($(this).attr('id'))+"-d";
                var notificationDelay=200;
                if(limitSum!=($(this).attr('data-length'))) notificationDelay*=10;
                notificationTimer=setTimeout(function(){$("#"+dataId).show();}, notificationDelay);
            });
            $(document)
                .on('mouseout', '.notification', function() {
                var dataId = ($(this).attr('id'))+"-d";
                clearTimeout(notificationTimer);
                $("#"+dataId).hide();
            });

            //KEŞFET PREVIEW
            var kesfetShowTimer;
            var kesfetLoadTimer;
            var kesfetHideTimer;
            var kesfetDelay=100;
            var kesfetLoadStop;
            $(document)
                .on('mouseenter', '.kesfet article', function() {
                if(!kesfetPreviewAktif) return;
                clearTimeout(kesfetHideTimer);
                kesfetLoadStop=false;
                var kesfetId = $(this).attr('id').replace("post-","");
                var kesfetUrl= "https://teknoseyir.com/?p="+kesfetId;
                if(kesfetId.indexOf("user-") >=0) kesfetUrl="https://teknoseyir.com/?author="+kesfetId.replace("user-","");
                var kesfetPreviewDiv= $('#kesfetPreview');
                var durumBgColor=$("article").css("background-color");
                if(!darkMode) durumBgColor="#fff";
                var divLeft = $("#col-left").offset().left;
                var divWidth = $("#col-left").width()-(-10);
                var divTop = $(".navbar").height()-(-1);
                var divHeight = $(window).height()-divTop;
                kesfetLoadTimer=setTimeout(function(){
                    //sayfayı önceden yükle
                    kesfetPreviewDiv.load(kesfetUrl + ' #col-left article > *', function() {
                        kesfetShowTimer=setTimeout(function(){
                            kesfetPreviewDiv.css({left: divLeft, top: divTop, width: divWidth, height: divHeight});
                            kesfetPreviewDiv.css("background-color",durumBgColor);
                            if(!kesfetLoadStop){
                                kesfetPreviewDiv.show();
                                kesfetPreviewDiv.scrollTop(0);
                            }
                        }, kesfetDelay*3);
                    });
                }, kesfetDelay*2);


            });
            $(document)
                .on('mouseleave', '.kesfet article', function() {
                clearTimeout(kesfetShowTimer);
                clearTimeout(kesfetLoadTimer);
                kesfetLoadStop=true;
                var kesfetPreviewDiv= $('#kesfetPreview');
                kesfetHideTimer=setTimeout(function(){
                    kesfetPreviewDiv.hide();
                }, kesfetDelay*2);
            });
            $(document)
                .on('mouseover', '#kesfetPreview', function() {
                clearTimeout(kesfetHideTimer);
            });
            $(document)
                .on('mouseout', '#kesfetPreview', function() {
                var kesfetPreviewDiv= $('#kesfetPreview');
                kesfetHideTimer=setTimeout(function(){
                    kesfetPreviewDiv.hide();
                }, kesfetDelay*2);
            });
            //KEŞFET PREVIEW SON


            $(document)
                .on('mouseover', '[brightness=1]', function() {
                $(this).css("-webkit-filter", "brightness("+100+"%)");
                $(this).css("filter", "brightness("+100+"%)");
                $(this).attr("brightness","2");
            });
            /*
            var plusTimer;
            $(document)
                .on('mouseover', '#plusSayi', function() {
                plusTimer=setTimeout(function(){yaz("TeknoIzdırap: <a target='_blank' href='https://teknoseyir.com/blog/teknoseyir-plus-kullanicilar-kulubu'>Teknoseyir Plus Kullanıcılar Kulübü'ne git</a>");}, 350);
            });

            $(document)
                .on('mouseout', '#plusSayi', function() {
                clearTimeout(plusTimer);
            });
            */
            $(document)
                .on('click', '.autogrow-short, #kelimeListesi, #gizlenecekListesi', function() {
                if($(this).attr('id')=="gizlenecekListesi") {
                    $(this).val(localStorage.getItem("gizlenecekler"));
                }
                if($(this).attr('id')=="kelimeListesi") {
                    $(this).val(localStorage.getItem("engellenecekler"));
                }
                if($(this).hasClass('selected')) {
                    return;
                }
                $(this).addClass('selected');
                var scroll_height = $(this).get(0).scrollHeight;
                $(this).css('height', scroll_height + 'px');
            });

            $(document)
                .on('keydown', '.autogrow-short', function() {
                if($(this).hasClass('selected')) {
                    return;
                }
                $(this).addClass('selected');
                var scroll_height = $(this).get(0).scrollHeight;
                $(this).css('height', scroll_height + 'px');
            });
            $(document)
                .on('keyup', '#kelimeListesi, #gizlenecekListesi', function() {
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

                var ayarlar= "<div class='tab-pane' id='izdirap'>"+
                    //"<a href='"+hataLink+"'><h3>SORULAR VE HATA BİLDİRİMİ İÇİN</h3></a>"+

                    //"<div class='link' id='checkUpdate'><h3>YENİ SÜRÜM KONTROL ET</h3></div>"+

                    "<div class='link' id='changelog'><h2>Changelog - Yeni Özellikler (v"+version+")</h2></div>"+
                    "<div id='changelogDetay'";

                if(!changelogAktif) ayarlar+="style='display:none'>";

                ayarlar+= "<hr>"+
                    "<br><b>NOT:</b><br>"+
                    "- <span class='yeni'>Vimeo playerın kendi klavye kısayollarını veya player üzerindeki dişli çarkı kullanmak istiyorsanız CTRL tuşuna basın. "+
                    "Tuşa bastıktan sonra 7 saniye boyunca TeknoIzdırap kısayolları devre dışı kalacak ve playerın kendi kısayolları ile veya üzerindeki dişli çarktan istediğiniz ayarları yapabileceksiniz "+
                    " (CTRL tuşuna istediğiniz zaman tekrar basarak süreyi sıfırlayabilirsiniz, CTRL'ye bastığınız halde olmuyorsa sayfayı yenileyip tekrar deneyin, sorun devam ederse bildirin). "+
                    "</span><br>"+

                    "<br><br><b>1.3:</b><br>"+
                    "- Teknoizdirap.com'un kapanması nedeniyle; durum sayısı, yorum sayısı, üyelik tarihi gösterme, Teknorütbe, Trollsavar, plus abonelik sayısı, plus abonelik tablosu,"+
                    " bildirim sistemi ve güncelleme kontrol sistemi özellikleri çıkarıldı.</span>"+

                    "<br><br><b>1.2:</b><br>"+
                    "- <span class='yeni'>Kelime Engelleme özelliğinde değişiklikler</span> yapıldı. <span class='yeni'>Artık; durum içerisinde geçmeyip sadece yorumda geçen kelimeler dikkate alınmayacak. </span>"+
                    "<span class='yeni'>Diğer ÖNEMLİ değişikliker için</span> engellenecek kelimeler listesi kutucuğunun üstündeki yazıyı <span class='yeni'>OKUYUN</span><br>"+
                    "Anasayfada iken <span class='yeni'>ctrl ile &lt; tuşuna</span> aynı anda basarak <span class='yeni'>kelime engelleme listesini</span> açıp düzenleyebilirsiniz."+

                    "<br><br><b>1.1.1:</b><br>"+
                    "- TeknoTwit bölümündeki Keşfet seçeneği için <span class='yeni'>yükseklik ayarı</span> ve <span class='yeni'>önizleme kutucuğu</span> eklendi."+
                    " Önizleme kutucuğu ile 1.1 sürümünde eklenen önizleme özelliğini açıp kapatabilirsiniz. Yükseklik ayarını sonsuz yapmak için 0 olarak ayarlayabilirsiniz.<br>"+
                    "- Üzerine tıklamadan <span class='yeni'>hareket etmeyen GIF'lere</span>, GIF olduğu anlaşılsın diye <span class='yeni'>oynatma butonu</span> eklendi. <br>"+
                    "- <span class='yeni'>GIF'leri</span> üzerine tıklayıp açtıktan sonra <span class='yeni'>R tuşuna basarak başa alabilirsiniz</span> (Her zaman işe yaramayabilir)."+

                    "<br><br><b>1.1:</b><br>"+
                    "- TeknoTwit bölümünde Keşfet seçeneği seçiliyse; <span class='yeni'>Keşfet bölümündeki paylaşımların</span> üzerine gelince <span class='yeni'> içeriklerinin sayfayı değiştirmeden görüntülenmesi</span> özelliği eklendi.<br>"+
                    "- Resim Karartma özelliğinde değişiklik: Resimlerin üzerine tıklanıp açıldıktan sonraki hali için ayrı ayar eklendi."+

                    "<br><br><b>1.0.7:</b><br>"+
                    "- Akışta kolayca durum/blog/inceleme gizleyebilmek için <span class='yeni'>\"Gizle\" butonu</span> eklendi. <br>"+
                    "- <span class='yeni'>Gfycat</span> gifleri için <span class='yeni'>embed kodu</span> eklendi. Artık site içinden çıkmadan gifleri görebilirsiniz."+

                    "<br><br><b>1.0.6:</b><br>"+
                    "- Vimeo playerı ile izlerken S tuşu ile kayıt sırasında çalması için <span class='yeni'>ses efekti</span> eklendi (ses bir yerden tanıdık geliyor ama neyse...🙂)"+

                    "<br><br><b>1.0.5:</b><br>"+
                    "- Vimeo player <span class='yeni'>oynatma hızını</span> numpad üzerindeki <span class='yeni'>+ ve - tuşlarına</span> basarak 0.5x-2x arasında değiştirebilirsiniz."+

                    "<br><br><b>1.0.4:</b><br>"+
                    "- Vimeo playerı ile izlerken S tuşuna basarak artık <span class='yeni'>birden fazla anı</span> kaydedebilirsiniz, kaydettiğiniz bu süreleri <span class='yeni'>Q tuşuna basarak liste halinde görebilirsiz.</span>"+

                    "<br><br><b>1.0.3:</b><br>"+
                    "- Vimeo playerı ile izlerken <span class='yeni'>S tuşuna basarsanız o anki süreyi kaydeder</span>, "+
                    "<span class='yeni'>D tuşuna basarsanız kaydedilen süreye</span> (5 saniye gerisine) <span class='yeni'>geri döner.</span> "+
                    "Böylece izlerken tekrar dönmek istediğiniz yere video bitince kolayca dönebilirsiniz."+
                    "<b>Şimdilik her video için sadece son kaydettiğiniz süreye dönebilirsiniz, sonraki sürümlerde birden fazla anı kaydetme imkanı eklenecektir.</b>"+

                    "<br><br><b>1.0.2:</b><br>"+
                    "- <span class='yeni'>Vimeo için varsayılan çözünürlük seçme</span> eklendi. Video sayfasının altından seçebilirsiniz. Seçtikten sonra sayfayı yenileyin."+

                    "<br><br><b>1.0:</b><br>"+
                    "-  <span class='yeni'>Bildirim Sistemi</span> eklendi. Site editörleri bir <b>durum</b> paylaştığında sağ alt tarafta bildirim otomatik olarak gösterilecek olup herhangi bir ayar açmanıza gerek yoktur."+
                    "Tasarım: <a href='/u/ozgurg'>@ozgurg</a><br>"+
                    "-  <span class='yeni'>Vimeo kontrolleri</span> eklendi."+
                    " Artık Vimeo playerı aktiften sağ ve sol tuşlar ile <input style='width:40px' type='number'value='" + vimeoJump + "' maxlength='2' size='2' id='vimeoJump'> sn ileri/geri, "+
                    "yukarı ve aşağı tuşları ile ses kontrolü, M tuşu ile de sessize alma, sesi geri açma işlemi yapabilirsiniz. <strong>(F tuşu ile tam ekran yapmak için F tuşuna arka arkaya iki kere basın.)</strong><br>"+
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
                    "- \"Bildirim sayısını sekme adına ekle\" ve \"Bildirim gelince sekmeye geç\" özellikleri için sekmeler arası senkronizasyon sağlandı. Bildirim çanındaki değerden daha doğru bir değer gösteriyor. 🙂<br>"+

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
                    "- Geliştirme süreci 🙂<br>"+
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
                    "<div class='checkbox'><label><input id='resim2' type='checkbox' autocomplete='off'>Üzerine tıklanıp açılmış resimler de karartılsın mı? (Yukarıdaki özellik aktif değilse işe yaramaz.)</label>";
                if(lastVersionFloat<1.1) ayarlar+= "<span class='yeni'> (YENİ)</span><br>";
                ayarlar+=
                    "</div>"+
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
                ayarlar+= "<hr></div>"+
                    //======TWİT SON======//


                    //========PLUS ABONE TABLO========//
                    /*
                    //"<hr>"+
                    "<div class='checkbox'><label><input id='aboneTablo' type='checkbox' autocomplete='off'>Abone Sayısı Tablosu</label>";
                if(lastVersionFloat<1.0) ayarlar+= "<span class='yeni'> (YENİ)</span>";
                ayarlar+="</div>"+

                    "<div id='aboneTabloDetay'>"+
                    "<label><input id='aboneTabloAlt' type='checkbox' autocomplete='off'>Tabloyu sağ sütunun en altına yerleştir</label><br>"+
                    "Tablo Yüksekliği<input style='width:50px' type='number'value='" + aboneTabloHeight + "' maxlength='3' size='3' id='aboneTabloHeight'> piksel"+
                    "<hr></div>"+
                    */
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

                    //========ÜYELİK BİLGİLERİ========//
                    /*
                    "<div class='checkbox'><label><input id='rutbe' type='checkbox' autocomplete='off'>Akışta TeknoRütbe'leri göster."+
                    "(Sitede yapılan paylaşım miktarı ve abonelik yaşına göre belirlenir. Bit, B(Byte), KB(KiloByte)... şeklinde ilerler.)</label></div>"+
                    "<div class='checkbox'><label><input id='uyeliktarihi' type='checkbox' autocomplete='off'>Akışta üyelik tarihlerini göster</label></div>"+
                    "<div class='checkbox'><label><input id='durumsayisi' type='checkbox' autocomplete='off'>Akışta kişilerin yaklaşık durum sayılarını göster</label></div>"+
                    "<div class='checkbox'><label><input id='yorumsayisi' type='checkbox' autocomplete='off'>Akışta kişilerin yaklaşık yorum sayılarını göster</label></div>"+
                    */
                    //========ÜYELİK BİLGİLERİ SON========//

                    //========TROLL========//
                    /*
                    //"<hr>"+
                    "<div class='checkbox'><label><input id='trollsavar' type='checkbox' autocomplete='off'>Troll Savar (açıklama için tıkla)</label></div>"+
                    "<div id='trollSavarDetay'>"+
                    "<input style='width:40px' type='number'value='" + trollDay + "' maxlength='2' size='2' id='trollDay'> günden yeni üyeleri: "+
                    "<select id='trollDo'><option value='Gizle'>Gizle (Gönderiyi gizler, göstermek için buton ekler)</option><option value='Uyar'>Uyar (Gönderiyi gizlemez, sadece uyarı mesajı ekler)</option><option value='Sil'>Sil (Gönderi gizler, uyarı mesajı da eklemez)</option></select>"+
                    "<hr></div>"+
                    */
                    //======TROLL SON======//

                    //========HORT========//
                    //"<hr>"+
                    "<div class='checkbox'><label><input id='hortsavar' type='checkbox' autocomplete='off'>Hort Savar (açıklama için tıkla)</label></div>"+
                    "<div id='hortSavarDetay'>"+
                    "<input style='width:40px' type='number'value='" + hortDay + "' maxlength='2' size='2' id='hortDay'> günden eski konuları: "+
                    "<select id='hortDo'><option value='Gizle'>Gizle (Gönderiyi gizler, göstermek için buton ekler)</option><option value='Uyar'>Uyar (Gönderiyi gizlemez, sadece uyarı mesajı ekler)</option><option value='Sil'>Sil (Gönderi gizler, uyarı mesajı da eklemez)</option></select>"+
                    "<hr></div>"+
                    //======HORT SON======//


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


                    //========KELİME ENGELLE========//
                    //"<hr>"+
                    "<div class='checkbox'><label><input id='kelimeEngelle' type='checkbox' autocomplete='off'>Kelime/Hashtag/Link Engelleme</label>";
                if(lastVersionFloat<0.9) ayarlar+= "<span class='yeni'> (YENİ)</span>";
                ayarlar+=
                    "</div>"+
                    "<div id='kelimeEngelleDetay'>"+
                    "<ul>"+
                    "<li class='yeni'>Liste otomatik kaydedilir</li>"+
                    "<li class='yeni'>Her satıra bir KELİME yazılacak, BİRDEN FAZLA KELİME VEYA KELİME GRUBU YAZMAYIN (linkler hariç)</li>"+
                    "<li>YAZILAN KELİME DURUM İÇİNDE NORMAL YAZI OLARAK GEÇİYORSA VEYA PAYLAŞILAN LİNKİN İÇİNDE GEÇİYORSA O DURUM GİZLENİR, <span class='yeni'>SADECE YORUM İÇİNDE GEÇEN KELİMELER DİKKATE ALINMAZ</span>.</li>"+

                    "<li class='yeni'>Kelimenin başına veya sonuna joker karakter olarak * koyabilirsiniz.</li>"+
                    "<ul>"+
                    "<li>Joker kullanmadan, <span class='yeni'>ara</span> şeklinde yazarsanız => ara içeren durumlar GİZLENİR.<br> #ara, @ara, para, araba, arası, parası gibi ek almış kelimeler ETKİLEMEZ. </li>"+
                    "<li><span class='yeni'>ara*</span> yazarsanız ara ile başlayan kelime içeren durumlar GİZLENİR => ara, arası, arada gibi <br> Ancak #ara, @ara, para, parası başına ek almış kelime içerenler GİZLENMEZ</li>"+
                    "<li><span class='yeni'>*ara</span> yazarsanız ara ile biten kelime içeren durumlar GİZLENİR => ara, #ara, @ara, para, yara gibi <br> Ancak 'ara'dan sonra kelime devam ediyorsa GİZLENMEZ => araba, #araba, paralar...</li>"+
                    "<li><span class='yeni'>*ara*</span> yazarsanız => içinde ara her geçen HER ŞEY GİZLENİR => ara, para, paralar, yara, arası, arada, @ara, @arası, @arada, #ara, #arası, #arada vs., </li>"+

                    "<li class='yeni'>Hashtag engellemek için</li>"+
                    "<ul>"+
                    "<li>#benim yazarsanız => sadece #benim içeren durumlar gizlenir, #benimmasaüstüm GİZLENMEZ.</li>"+
                    "<li>#benim* yazarsanız => #benim ile başlayan herhangi bir hashtag içeren tüm durumlar GİZLENİR (#benimmasaüstüm, #benimızdırabım vs.).</li>"+
                    "<li>*otoseyir yazarsanız => hem kelime olarak otoseyir içeren durumlar hem de #otoseyir etiketi içeren durumlar gizlenir.</li>"+
                    "</ul>"+

                    "<li class='yeni'>Bir siteye ait link içeren durumları engellemek için</li>"+
                    "<ul>"+
                    "<li><span class='yeni'>*züllüyet.com*</span> yazarsanız züllüyet.com sitesine ait link içeren tüm durumlar GİZLENİR (http, www, / vs gibi karakterler kullanmadan girin).</li>"+
                    "</ul>"+

                    "</ul>"+

                    "<li class='yeni'>KELİMELERİ TAMAMI KÜÇÜK HARF OLARAK YAZIN</li>"+
                    "<ul>"+
                    "<li>IoT gibi büyük I harfi ile başlayan yabancı kelimeleri iot olarak yazabilirsiniz</li>"+
                    "</ul>"+
                    "</ul><br>"+

                    "<textarea style='width:100%' id='kelimeListesi'>"+engellenecekler+"\n</textarea>"+
                    "</div>"+
                    //======KELİME ENGELLE SON======//


                    //========AKIŞ GÖNDERİ GİZLE========//
                    "<hr>"+
                    "Akışta Gizlenecek Gönderiler";
                if(lastVersionFloat<1.1) ayarlar+= "<span class='yeni'> (YENİ)</span>";
                ayarlar+="<br><b>Akışta, gizle butonuna basarak gizlediğiniz gönderiler listesi aşağıdadır. Çıkarmak istediğiniz gönderinin numarasını silin.<br>"+
                    "Gönderinin içeriğini görmek için <a href='https://teknoseyir.com?p=GönderiNo'>https://teknoseyir.com?p=GönderiNo</a></b></div><br>"+
                    "<div id='postGizleDetay'>"+
                    "<textarea style='width:100%' id='gizlenecekListesi'>"+gizlenecekler+"\n</textarea>"+
                    "<hr></div>"+
                    //======AKIŞ GÖNDERİ GİZLE SON======//
                    "<hr>";

                //ayarlar+="<div class='checkbox'><label><input id='bildirimAlert' type='checkbox' autocomplete='off'>Bildirim gelince sekmeye geç"+
                //"(<span class='yeni'>DİKKAT!!!</span> Birden fazla sekmede TS açıksa sinir edebilir 🙂)</label></div>"+

                //"<hr><hr><hr><hr>"+
                //"<div class='checkbox'><label><input id='arama' type='checkbox' autocomplete='off'>Gelişmiş Arama (Pek Yakında 🙂)</label></div>"+
                //"<div class='checkbox'><label><input id='emoji' type='checkbox' autocomplete='off'>Emoji Butonu (Pek Yakında 🙂)</label></div>"+
                //"<div class='checkbox'><label><input id='yorum' type='checkbox' autocomplete='off'>Yorumları sırala (Pek Yakın Olmayan Bir Gelecekte 🙂 Belki de asla 🙂)</label></div>";

                for(var basma=0;basma<5;basma++){
                    ayarlar+= "<h2>=================KAYDET'E BASMA=================</h2>";
                }
                ayarlar+= "<div class='checkbox'><label><input id='factoryReset' type='checkbox' autocomplete='off'>TÜM AYARLARI SIFIRLA (BASAR BASMAZ SIFIRLAR)</label></div>"+
                    "<table class='table form-table bildirim'>"+
                    "</table>"+
                    "</div>";

                var ayarDiv = document.createElement('div');
                ayarDiv.id = 'izdirap';
                ayarDiv.className = 'tab-pane';
                document.getElementsByClassName('tab-content')[0].appendChild(ayarDiv);
                ayarDiv.innerHTML = ayarlar;

                //setInterval(function(){
                document.getElementById("gecemod").checked = geceModAktif;
                document.getElementById("resim").checked = resimAktif;
                document.getElementById("resim2").checked = resim2Aktif;
                document.getElementById("teknotwit").checked = teknoTwitAktif;
                //document.getElementById("arama").checked = aramaAktif;
                //document.getElementById("rutbe").checked = rutbeAktif;
                //document.getElementById("uyeliktarihi").checked = uyelikTarihiAktif;
                //document.getElementById("trollsavar").checked = trollSavarAktif;
                document.getElementById("hortsavar").checked = hortSavarAktif;
                document.getElementById("kelimeEngelle").checked = kelimeEngelleAktif;
                //document.getElementById("durumsayisi").checked = durumSayisiAktif;
                //document.getElementById("yorumsayisi").checked = yorumSayisiAktif;
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
                //document.getElementById("aboneTablo").checked = aboneTabloAktif;
                //document.getElementById("aboneTabloAlt").checked = aboneTabloAltAktif;



                if(!geceModAktif) document.getElementById("geceModDetay").style.display="none";
                if(!teknoTwitAktif) document.getElementById("twitDetay").style.display="none";
                //if(!aboneTabloAktif) document.getElementById("aboneTabloDetay").style.display="none";
                //if(!trollSavarAktif) document.getElementById("trollSavarDetay").style.display="none";
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
                    yaz("Kaydedildi (Eklenti kurulmadan önce açılan sekmelere F5 lütfen 🙂)");
                });
                /*
                $('#checkUpdate').click(function() {
                    localStorage.setItem("versionJsonUp",0);
                    yaz("Güncelleştirmeler Kontrol Ediliyor...(Sayfa Yenilenecek)");
                    setTimeout(function(){location.reload();},3000);
                });
                */
                $('#gecemod').click(function() {
                    var gecemod = document.getElementById("gecemod");
                    geceModAktif=gecemod.checked;
                    document.getElementById("geceModDetay").style.display = geceModAktif === true ? "block" : "none";
                    localStorage.setItem("geceModAktif", geceModAktif);
                    yaz("Kaydedildi (Eklenti kurulmadan önce açılan sekmelere F5 lütfen 🙂)");
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
                /*
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
                */
                $('#arama').click(function() {
                    var arama = document.getElementById("arama");
                    aramaAktif = arama.checked;
                    localStorage.setItem("aramaAktif", aramaAktif);
                });
                /*
                $('#rutbe').click(function() {
                    var rutbe = document.getElementById("rutbe");
                    rutbeAktif=rutbe.checked;
                    localStorage.setItem("rutbeAktif", rutbeAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#uyeliktarihi').click(function() {
                    var uyeliktarihi = document.getElementById("uyeliktarihi");
                    uyelikTarihiAktif=uyeliktarihi.checked;
                    localStorage.setItem("uyelikTarihiAktif", uyelikTarihiAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });

                $('#durumsayisi').click(function() {
                    var durumsayisi = document.getElementById("durumsayisi");
                    durumSayisiAktif=durumsayisi.checked;
                    localStorage.setItem("durumSayisiAktif", durumSayisiAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#yorumsayisi').click(function() {
                    var yorumsayisi = document.getElementById("yorumsayisi");
                    yorumSayisiAktif=yorumsayisi.checked;
                    localStorage.setItem("yorumSayisiAktif", yorumSayisiAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#trollsavar').click(function() {
                    var trollsavar = document.getElementById("trollsavar");
                    trollSavarAktif=trollsavar.checked;
                    document.getElementById("trollSavarDetay").style.display = trollSavarAktif === true ? "block" : "none";
                    localStorage.setItem("trollSavarAktif", trollSavarAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                */
                $('#hortsavar').click(function() {
                    var hortsavar = document.getElementById("hortsavar");
                    hortSavarAktif=hortsavar.checked;
                    document.getElementById("hortSavarDetay").style.display = hortSavarAktif === true ? "block" : "none";
                    localStorage.setItem("hortSavarAktif", hortSavarAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#kelimeEngelle').click(function() {
                    var kelimeEngelle = document.getElementById("kelimeEngelle");
                    kelimeEngelleAktif=kelimeEngelle.checked;
                    document.getElementById("kelimeEngelleDetay").style.display = kelimeEngelleAktif === true ? "block" : "none";
                    localStorage.setItem("kelimeEngelleAktif", kelimeEngelleAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#bildirimAlert').click(function() {
                    var bildirimAlert = document.getElementById("bildirimAlert");
                    bildirimAlertAktif=bildirimAlert.checked;
                    localStorage.setItem("bildirimAlertAktif", bildirimAlertAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#bildirimTitle').click(function() {
                    var bildirimTitle = document.getElementById("bildirimTitle");
                    bildirimTitleAktif=bildirimTitle.checked;
                    localStorage.setItem("bildirimTitleAktif", bildirimTitleAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#bildirimFavicon').click(function() {
                    var bildirimFavicon = document.getElementById("bildirimFavicon");
                    bildirimFaviconAktif=bildirimFavicon.checked;
                    localStorage.setItem("bildirimFaviconAktif", bildirimFaviconAktif);
                    document.getElementById("bildirimFaviconDetay").style.display = bildirimFaviconAktif === true ? "block" : "none";
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#font').click(function() {
                    var font = document.getElementById("font");
                    fontAktif=font.checked;
                    document.getElementById("fontDetay").style.display = fontAktif === true ? "block" : "none";
                    localStorage.setItem("fontAktif", fontAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#fontButon').click(function() {
                    var fontButon = document.getElementById("fontButon");
                    fontButonAktif=fontButon.checked;
                    localStorage.setItem("fontButonAktif", fontButonAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#yorumParlat').click(function() {
                    var yorumParlat = document.getElementById("yorumParlat");
                    yorumParlatAktif=yorumParlat.checked;
                    localStorage.setItem("yorumParlatAktif", yorumParlatAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#spoiler').click(function() {
                    var spoiler = document.getElementById("spoiler");
                    spoilerAktif=spoiler.checked;
                    localStorage.setItem("spoilerAktif", spoilerAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#spoilerButonu').click(function() {
                    var spoilerButonu = document.getElementById("spoilerButonu");
                    spoilerButonuAktif=spoilerButonu.checked;
                    localStorage.setItem("spoilerButonuAktif", spoilerButonuAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#quoteButonu').click(function() {
                    var quoteButonu = document.getElementById("quoteButonu");
                    quoteButonuAktif=quoteButonu.checked;
                    localStorage.setItem("quoteButonuAktif", quoteButonuAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#codeButonu').click(function() {
                    var codeButonu = document.getElementById("codeButonu");
                    codeButonuAktif=codeButonu.checked;
                    localStorage.setItem("codeButonuAktif", codeButonuAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#linkButonu').click(function() {
                    var linkButonu = document.getElementById("linkButonu");
                    linkButonuAktif=linkButonu.checked;
                    localStorage.setItem("linkButonuAktif", linkButonuAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#resim').click(function() {
                    var resim = document.getElementById("resim");
                    resimAktif=resim.checked;
                    localStorage.setItem("resimAktif", resimAktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
                });
                $('#resim2').click(function() {
                    var resim2 = document.getElementById("resim2");
                    resim2Aktif=resim2.checked;
                    localStorage.setItem("resim2Aktif", resim2Aktif);
                    yaz("Kaydedildi (Sekmelere F5 lütfen 🙂)");
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
                /*
                $('#aboneTabloHeight').on('input', function() {
                    localStorage.setItem("aboneTabloHeight", $(this).val());
                    yaz("Abone Tablosu Yükseklik Kaydedildi: " + $(this).val());
                });
                */
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
                $('#gizlenecekListesi').on('input', function() {
                    localStorage.setItem("gizlenecekler", $(this).val());
                    yaz("Gizlenecekler Listesi Kaydedildi");
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
                var profilDiv = document.createElement('div');
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
            var bildirimFirst=false;
            function faviconUpdate(){
                bildirimSon=bildirimSayi;
                var bildirimStr=$('#bildirim-count').text();
                if(bildirimStr && bildirimStr.length>0){
                    bildirimSayi = 0 + parseInt(bildirimStr);
                }else{
                    bildirimSayi = 0;
                }
                if(bildirimSayi!=bildirimSon || !bildirimFirst){
                    localStorage.setItem("bildirimSayi", bildirimSayi);
                    bildirimFirst=true;
                }

                var preTitle="";
                if(bildirimSayiDepo>0){
                    preTitle = "[" + bildirimSayiDepo + "] ";
                }

                //titleSayi=document.title.substring(document.title.lastIndexOf("[")+1,document.title.lastIndexOf("]"));
                if(bildirimSayiDepo>0 && bildirimSayiDepo>bildirimSon && bildirimAlertAktif) alert(bildirimSayiDepo + " Adet Bildirim Var");
                if(bildirimSayiDepo>0 && bildirimTitleAktif && document.title.indexOf(preTitle) < 0){
                    for(var m=1;m<=100;m++){
                        document.title = document.title.replace("["+m+"]","");
                    }
                    document.title = preTitle+document.title;
                }
                if(bildirimSayiDepo<1 && document.title.indexOf(preTitle) >= 0){
                    for(var k=1;k<=100;k++){
                        document.title = document.title.replace("["+k+"]","");
                    }
                }
                if(bildirimFaviconAktif && (bildirimSayiDepo!=faviconSayi)){
                    faviconSayi=bildirimSayiDepo;
                    favicon.badge(bildirimSayiDepo);
                }
                //console.log(bildirimSayiDepo);
            }
            //======================BİLDİRİM SAYISI SON======================//


            //======================ÜYELİK TARİHİ======================//
            //if(uyelikTarihiAktif || trollSavarAktif || durumSayisiAktif || yorumSayisiAktif || rutbeAktif){
            if("Tekno"=="Izdırap"){
                var dd = new Date();
                var nn = dd.getTime();
                if(localStorage.getItem.uyeJson && nn/1000-parseLocal("uyeJson").update<2*60*60){
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
            /*if(aboneTabloAktif && $("#col-right").length){
                var containerDiv='<div id="chartContainer" style="margin-bottom:10px; height: '+aboneTabloHeight +'px; width: 300px;"></div>';
                if(aboneTabloAltAktif){
                    $(".copyright").before(containerDiv);
                }else{
                    $("#col-right").prepend(containerDiv);
                }
            }*/
            //======================PLUS ABONE TABLO SON======================//

            //======================KEŞFET======================//
            if(location.pathname == "/") {
                if(teknoTwitAktif && (twitSag=="Keşfet" || twitSol=="Keşfet")){
                    function kesfet(){
                        $('.kesfet-filters #icerik_filter').css({'width':'100%', 'margin-left': '0', 'margin-bottom': '5px'});
                        $('.kesfet-filters #tarih_filter').css({'width':'100%', 'margin-left': '0', 'margin-bottom': '10px'});
                        $('.kesfet .main-head').css({'text-align':'center'});

                        var $kesfetPreviewCheckbox = $(document.createElement("input")).attr({
                            id:    'kesfetPreviewCheckbox',
                            type:  'checkbox',
                            checked:kesfetPreviewAktif
                        });
                        var $kesfetHeight = $(document.createElement("input")).attr({
                            id:    'kesfetHeight',
                            type:  'number',
                            value:kesfetHeight
                        }).css("width","50px").css("margin-right","10px").addClass("inputIzdırap");
                        $(".kesfet .main-head").append("<label>Yükseklik: </label>").append($kesfetHeight);
                        $(".kesfet .main-head").append("<label>Önizleme: </label>").append($kesfetPreviewCheckbox);

                        $('#kesfetPreviewCheckbox').click(function() {
                            kesfetPreviewAktif=document.getElementById("kesfetPreviewCheckbox").checked;
                            localStorage.setItem("kesfetPreviewAktif", kesfetPreviewAktif);
                            yaz("Kaydedildi");
                        });

                        $('#kesfetHeight').on('input', function() {
                            localStorage.setItem("kesfetHeight", $(this).val());
                            yaz("Kaydedildi: "+$(this).val()+ "(F5)");
                        });

                        $('#kesfet_form select').on('change', function(e) {
                            var t = $('.kesfet-filters #tarih_filter').val();
                            var f = $('.kesfet-filters #icerik_filter').val();
                            localStorage.setItem("kesfetT",t);
                            localStorage.setItem("kesfetF",f);
                            kesfetLoad(t,f);
                        });
                    }
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
                    if(kesfetHeight>0){
                        kesfetDiv.height(kesfetHeight+'px');
                        kesfetDiv.css("overflow-y","scroll");
                    }
                    kesfetDiv.attr('class','kesfet');
                    $(".kesfet").addClass("widget");
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
            //var saveAudio = new Audio('https://teknoizdirap.com/camera1.wav');

            var camera1wav = "UklGRp5GAABXQVZFZm10IBAAAAABAAIAIlYAAIhYAQAEABAAZGF0YShGAAAA9AD0AAIAAgD+AP4A+gD6AAQABAAFAAUABQAFAAcABwAWABYACgAKAPsA+wDuAO4A9AD0APwA/AD4APgAEAAQAAkACQDyAPIA+QD5AP8A/wD4APgA9QD1AOcA5wDqAOoA/QD9AAMAAwAUABQABwAHAAMAAwAEAAQADQANAAgACAAHAAcABgAGAAoACgATABMAAgACAPEA8QAKAAoAAQABAAQABADxAPEAAwADAPoA+gD8APwABAAEAAEAAQD4APgA6wDrAPsA+wDuAO4AAAAAAAkACQADAAMABQAFAAQABAD6APoA6ADoAP4A/gD7APsA+wD7AAcABwD+AP4A9QD1APcA9wAKAAoABAAEAAgACAACAAIA/QD9APwA/AAGAAYADAAMAAMAAwAAAAAABQAFAAgACAACAAIABgAGAAcABwADAAMA/wD/AP8A/wACAAIA/gD+AAQABAABAAEAAQABAPoA+gD6APoA+wD7APgA+AAAAAAAAgACAPsA+wD0APQA+gD6AP4A/gD+AP4AAQABAP4A/gD6APoA9gD2APwA/AD4APgAAAAAAAYABgADAAMA+AD4AAEAAQAJAAkA/AD8AAAAAAAJAAkACQAJAP8A/wD9AP0ABQAFAP4A/gD7APsAAwADAAsACwD/AP8AAAAAAAMAAwD8APwA/AD8AAEAAQAHAAcA/QD9APYA9gD+AP4ACAAIAAAAAAD9AP0ACQAJAP4A/gD3APcA/AD8AAMAAwDzAPMAAgACABgAGADvAO8A8ADwAAQABAAMAAwA9QD1AP4A/gANAA0ABgAGAP0A/QDrAOsA/QD9AA0ADQD+AP4A8QDxAA0ADQAUABQA9QD1AOkA6QD+AP4ADAAMAAoACgAIAAgA9QD1AOwA7AD4APgADQANAAkACQAEAAQACAAIAPMA8wDuAO4ABgAGAA0ADQD2APYAAAAAAAwADADuAO4A7wDvABgAGAAZABkA9QD1APwA/AD+AP4A6gDqAP8A/wAcABwA/gD+APIA8gAIAAgA+gD6APUA9QAJAAkAEwATAPsA+wDqAOoAAwADAAAAAADrAOsABgAGABoAGgD2APYA9AD0AAwADAABAAEA9wD3AAEAAQAGAAYA+QD5APsA+wALAAsABQAFAPEA8QAGAAYACgAKAPEA8QD+AP4ABQAFAAEAAQD8APwABQAFAPsA+wD2APYABAAEAAMAAwD+AP4AAAAAAAQABAD4APgA/AD8AAoACgD+AP4A/AD8AAEAAQAEAAQA9wD3APoA+gAMAAwACwALAPcA9wD7APsACAAIAPUA9QD5APkABgAGAAQABAACAAIAAgACAPgA+AD9AP0ABAAEAPsA+wACAAIACwALAPwA/AD1APUACgAKAPwA/AD3APcACwALAAIAAgDxAPEAAQABAA8ADwDzAPMA/QD9AAoACgABAAEA9QD1AP8A/wALAAsA9gD2APoA+gAKAAoAAQABAPYA9gAGAAYAAwADAPEA8QD/AP8ACQAJAAMAAwD3APcAAQABAAIAAgD2APYAAQABAAkACQD+AP4A+QD5AAMAAwAAAAAA+AD4AAIAAgANAA0A/QD9APgA+AABAAEA/QD9APwA/AAEAAQACgAKAPsA+wD7APsA/wD/AP0A/QD+AP4AAwADAAkACQD3APcA/gD+AAMAAwD6APoA/gD+AAkACQAEAAQA9wD3AAEAAQD7APsA/AD8AAcABwACAAIA/AD8AP8A/wABAAEA9gD2AAIAAgAFAAUA/gD+AAAAAAACAAIA/AD8AP0A/QACAAIAAwADAP4A/gD9AP0AAwADAPsA+wD9AP0AAgACAAMAAwAEAAQAAwADAP4A/gD0APQA/wD/AAcABwAJAAkA8wDzAPoA+gACAAIA8wDzAAcABwAVABUAAQABAO4A7gALAAsAAgACAO4A7gAJAAkABAAEAPYA9gABAAEADAAMAPoA+gD3APcA/gD+APkA+QACAAIACQAJAAIAAgAKAAoABwAHAO8A7wD1APUAEgASAP8A/wDTANMA+QD5AC0ALQACAAIA+AD4AB0AHQD+AP4A2QDZAAQABAAEAAQA9AD0APwA/AAYABgAFgAWAN8A3wD1APUACAAIAPgA+ADfAN8ACgAKADAAMAD9AP0A7wDvAP4A/gAdAB0ADAAMANsA2wDWANYACAAIAC0ALQD+AP4A8QDxAPYA9gABAAEACwALABQAFAARABEA3ADcAOYA5gARABEADgAOAOsA6wD8APwACwALAO0A7QD6APoADAAMAAsACwAKAAoA/QD9APIA8gARABEAAAAAAPoA+gALAAsABAAEAOwA7ADyAPIAAQABAP4A/gAAAAAA8wDzAP4A/gAjACMAGwAbAPgA+ADnAOcA7wDvAPwA/AAMAAwAAAAAAPMA8wALAAsACQAJAOkA6QD+AP4ADwAPAAQABAAAAAAACgAKAPwA/ADwAPAAEgASAAwADAD2APYA5QDlAOIA4gD+AP4AHQAdABoAGgAPAA8ADQANAOQA5AD6APoA/AD8AMoAygADAAMAGwAbABQAFAAGAAYA/QD9APsA+wD2APYAHwAfAA8ADwDSANIA3gDeABEAEQAoACgAEgASANwA3ADsAOwADgAOAAsACwD6APoA7ADsAAYABgD9AP0A8gDyABsAGwARABEA6wDrAO8A7wAOAA4ACAAIAOUA5QD/AP8AFgAWAAAAAAD4APgA/gD+ABMAEwD9AP0A+wD7AAUABQDwAPAA+AD4APoA+gAcABwACwALAOgA6AD0APQACgAKAP8A/wD3APcACwALAAkACQAMAAwA+wD7AOwA7AD1APUADgAOAAYABgD0APQA8gDyAPsA+wATABMACAAIAAkACQD1APUA9AD0AP4A/gD+AP4AAgACAPsA+wDuAO4AAQABABoAGgAHAAcACAAIAAsACwALAAsA5QDlAOAA4ADwAPAA+AD4ABMAEwAdAB0AFQAVAPQA9AD0APQA7gDuAPQA9AAIAAgAFQAVABMAEwDuAO4A6QDpAO4A7gALAAsAGwAbAAcABwDyAPIA5ADkAO8A7wAUABQAJgAmAA0ADQDvAO8A7wDvAAMAAwD9AP0A5wDnAP0A/QAEAAQADwAPABIAEgAMAAwA/QD9APoA+gD7APsA7QDtAPUA9QD3APcA+gD6AA0ADQAYABgADAAMAAYABgD+AP4A9gD2AO4A7gDtAO0A/QD9AAcABwALAAsA/gD+AP8A/wAHAAcACAAIAAAAAAD5APkA9QD1APUA9QAGAAYABgAGAAQABAD+AP4A/gD+AAgACAACAAIA8wDzAO8A7wADAAMACAAIABEAEQAMAAwA+wD7AO4A7gDxAPEA/wD/AAYABgAJAAkACAAIAAgACAD5APkA+AD4AP8A/wADAAMA/QD9APUA9QD1APUA+wD7AAkACQANAA0ACQAJAP0A/QD9AP0A9gD2APIA8gD6APoAAQABAAUABQAIAAgACgAKAP0A/QD+AP4A/QD9AP0A/QD9AP0A/gD+AP4A/gD7APsAAwADAAgACAAMAAwAAgACAP4A/gDxAPEA8gDyAP8A/wACAAIACAAIAAsACwAGAAYA+gD6APwA/AD5APkA/AD8AP0A/QD/AP8AAAAAAP0A/QAEAAQABQAFAAMAAwAAAAAABgAGAPwA/AD4APgA+QD5APoA+gAAAAAABgAGAAkACQD/AP8A/gD+APgA+AD7APsA/AD8AAEAAQACAAIAAgACAAoACgACAAIA+wD7APwA/AACAAIA/QD9AAEAAQAEAAQA/wD/AP0A/QD+AP4AAwADAAAAAAACAAIA/QD9APoA+gD3APcAAQABAAYABgADAAMACAAIAAAAAAD6APoA+QD5AP8A/wD+AP4AAwADAAEAAQD8APwA+wD7APwA/AABAAEAAQABAAQABAAAAAAA/gD+APoA+gABAAEAAAAAAAMAAwAJAAkAAwADAP4A/gD4APgA+gD6APwA/AAGAAYABwAHAAIAAgD/AP8A/AD8APsA+wD5APkABAAEAAgACAACAAIA+wD7AP8A/wD7APsA/QD9AAYABgACAAIA/wD/AP0A/QD8APwA9QD1AP4A/gAHAAcABwAHAAAAAAD8APwA+wD7APgA+AABAAEABAAEAAUABQADAAMAAwADAPoA+gD7APsAAgACAAMAAwAFAAUA/wD/AP0A/QD3APcA/wD/AAUABQAGAAYA/gD+AP0A/QD+AP4A/AD8AAMAAwAEAAQAAwADAAAAAAAFAAUA/AD8APcA9wD8APwA/wD/AAQABAABAAEAAQABAPoA+gD+AP4AAAAAAP8A/wD+AP4AAwADAAAAAAD6APoABAAEAAIAAgD+AP4A/wD/AAUABQD9AP0A/QD9AP8A/wD+AP4A/wD/AAEAAQAEAAQA+wD7AAEAAQADAAMA/gD+APsA+wADAAMABAAEAP8A/wAAAAAA/AD8AP8A/wD+AP4AAwADAP4A/gD+AP4AAQABAP8A/wD7APsA/QD9AAIAAgD+AP4ABgAGAAAAAAD9AP0A+wD7AP4A/gD/AP8AAgACAAYABgAAAAAA/gD+APsA+wD9AP0A+wD7AAAAAAADAAMAAgACAPwA/AD+AP4AAQABAAAAAAAIAAgAAgACAP0A/QD8APwA/QD9APwA/AAAAAAABQAFAAUABQABAAEA+wD7AP0A/QD5APkABAAEAAUABQAAAAAA+gD6AP4A/gD8APwA/gD+AAYABgACAAIAAgACAP8A/wAAAAAA9gD2APsA+wACAAIAAwADAAEAAQAAAAAA+wD7APcA9wACAAIABgAGAAYABgAAAAAAAgACAPoA+gD7APsAAgACAAIAAgADAAMAAAAAAAAAAAD3APcA/gD+AAQABAAEAAQA/wD/AP8A/wD9AP0A+gD6AAIAAgAAAAAAAAAAAAEAAQAFAAUA/QD9AP0A/QAAAAAA/wD/AAEAAQAAAAAA/gD+APcA9wD/AP8AAQABAAIAAgAAAAAABAAEAP4A/gD6APoA/wD/AAAAAAADAAMAAgACAAQABAD7APsA/wD/AAEAAQAAAAAA/QD9AAEAAQABAAEA+wD7AP4A/gAAAAAAAgACAP4A/gACAAIA/gD+AP4A/gABAAEAAQABAAEAAQAAAAAAAQABAP8A/wABAAEA/gD+AP0A/QD6APoAAAAAAAEAAQD/AP8ABQAFAP8A/wD9AP0A/QD9AAAAAAD9AP0AAwADAAMAAwABAAEA/gD+AP4A/gAAAAAA/QD9AAEAAQAAAAAAAQABAP0A/QD/AP8A+gD6AP8A/wAGAAYAAwADAP8A/wD8APwA/wD/AP0A/QAGAAYABQAFAAEAAQD8APwA/AD8APsA+wD8APwABQAFAAQABAABAAEA+wD7APsA+wD4APgABAAEAAkACQADAAMA/QD9APsA+wD9AP0A/AD8AAUABQADAAMAAgACAP4A/gAAAAAA+QD5APoA+gAEAAQABQAFAAMAAwD+AP4A/wD/APgA+AADAAMABgAGAAIAAgD/AP8A/wD/AP0A/QD7APsAAgACAAEAAQADAAMA/gD+AAEAAQD6APoA/AD8AAEAAQABAAEAAQABAAAAAAD+AP4A+QD5AAMAAwADAAMAAgACAP4A/gAAAAAA/QD9AP0A/QABAAEA/gD+AP4A/gD/AP8ABAAEAP0A/QD+AP4A/wD/AAAAAAAAAAAABAAEAAIAAgD8APwAAQABAP8A/wD+AP4A/QD9AAIAAgD/AP8A/wD/AAIAAgD/AP8A/AD8AP4A/gACAAIA/AD8AAIAAgD/AP8A/QD9AP0A/QADAAMAAgACAAAAAAADAAMA/wD/AP8A/wD8APwA/gD+APoA+gACAAIABQAFAAAAAAD7APsA/gD+AAAAAAD9AP0ABQAFAAMAAwD/AP8A/AD8AP8A/wD9AP0AAQABAAUABQACAAIA/wD/APwA/AD/AP8A+QD5AAIAAgAFAAUAAQABAPkA+QAAAAAAAwADAAEAAQAHAAcA/wD/APYA9gD3APcAAAAAAP4A/gAFAAUABwAHAAUABQD9AP0A+QD5AP0A/QD+AP4ABgAGAAUABQADAAMA+gD6APsA+wD1APUA+wD7AAEAAQADAAMAAwADAAIAAgAGAAYAAAAAAAUABQABAAEA/gD+APoA+gD+AP4A/AD8AP0A/QAEAAQAAgACAP8A/wD9AP0A/wD/APoA+gAEAAQABgAGAAMAAwD9AP0AAAAAAP4A/gD8APwAAgACAP4A/gD9AP0A/QD9AAMAAwD+AP4ABAAEAAMAAwD9AP0A+wD7AP8A/wAAAAAA/AD8AAMAAwABAAEAAQABAP8A/wAAAAAA+gD6AP0A/QD/AP8A/QD9AP0A/QD/AP8AAQABAPwA/AAFAAUABAAEAAMAAwD+AP4AAAAAAP0A/QD/AP8AAwADAAAAAAD+AP4A/AD8AAIAAgD9AP0AAgACAAEAAQABAAEA/QD9AP8A/wD9AP0A/AD8AAMAAwABAAEA/wD/AP4A/gABAAEA/AD8AAIAAgAFAAUABQAFAP4A/gD8APwA/AD8APkA+QACAAIAAwADAAEAAQD8APwAAAAAAPsA+wAAAAAABgAGAAMAAwD+AP4A/QD9AP4A/gD5APkAAAAAAAAAAAADAAMAAAAAAAEAAQD7APsA+wD7AAIAAgACAAIAAQABAP8A/wAAAAAA+AD4AAEAAQADAAMABQAFAAIAAgABAAEA/gD+APoA+gD/AP8A/wD/AAEAAQD+AP4AAQABAPwA/AABAAEAAwADAAMAAwAAAAAAAQABAP8A/wD7APsAAQABAP4A/gAAAAAAAAAAAAEAAQD6APoA/gD+AAIAAgACAAIAAAAAAP8A/wAAAAAA+gD6AAAAAAAAAAAAAAAAAP4A/gADAAMA/QD9AP0A/QADAAMAAAAAAAAAAAD/AP8AAAAAAPsA+wABAAEAAAAAAAEAAQD9AP0AAAAAAP4A/gD+AP4AAwADAAAAAAD/AP8A/wD/AAIAAgD6APoAAgACAAMAAwABAAEA/gD+AAAAAAD8APwA+wD7AAQABAACAAIA/wD/AP0A/QABAAEA+gD6AAIAAgAEAAQAAwADAP4A/gACAAIA/gD+APsA+wADAAMAAQABAP8A/wD9AP0AAAAAAPsA+wACAAIAAwADAAEAAQD+AP4A/wD/AP0A/QD6APoAAwADAAQABAAEAAQA/gD+AP8A/wD5APkAAAAAAAQABAACAAIA/QD9APwA/AD8APwA+gD6AAIAAgADAAMABgAGAP8A/wAAAAAA+gD6AP8A/wACAAIAAgACAP8A/wD/AP8A/gD+APkA+QACAAIAAQABAAIAAgD/AP8AAQABAPwA/AD+AP4AAQABAAEAAQABAAEA/wD/AP8A/wD7APsAAgACAAIAAgACAAIA/gD+AAIAAgD8APwA/QD9AAEAAQD/AP8A/wD/AP8A/wABAAEA+wD7AAIAAgD/AP8A/wD/AP8A/wACAAIA/QD9AP4A/gADAAMAAQABAP8A/wD+AP4AAAAAAPoA+gACAAIAAgACAP8A/wD7APsA/wD/AP4A/gAAAAAABgAGAP8A/wD+AP4A/wD/AAIAAgD8APwAAwADAAMAAwABAAEA/AD8AP8A/wD8APwA/AD8AAQABAACAAIAAAAAAP0A/QACAAIA+gD6AAAAAAACAAIAAQABAP0A/QABAAEA/wD/APsA+wACAAIAAQABAAEAAQD+AP4AAQABAPoA+gD/AP8AAgACAAIAAgD+AP4A/QD9AP8A/wD9AP0ABQAFAAIAAgABAAEA/QD9AAAAAAD6APoA/wD/AAMAAwACAAIAAAAAAAAAAAD/AP8A+wD7AAMAAwABAAEAAgACAP0A/QAAAAAA+wD7AP8A/wACAAIAAgACAAAAAAAAAAAAAAAAAPoA+gABAAEAAAAAAAEAAQD/AP8AAQABAPoA+gD/AP8AAgACAAEAAQABAAEAAAAAAAAAAAD6APoAAQABAAEAAQABAAEA/gD+AAEAAQD8APwA/QD9AAMAAwABAAEAAAAAAP8A/wAAAAAA+gD6AAEAAQABAAEAAQABAP4A/gABAAEA/QD9AP4A/gADAAMAAQABAAAAAAD+AP4A/wD/APoA+gACAAIAAgACAAEAAQD8APwAAQABAP4A/gD/AP8AAwADAAEAAQD/AP8A/QD9AP8A/wD6APoAAwADAAIAAgACAAIA/gD+AAAAAAD8APwA/gD+AAQABAAAAAAA/wD/AP4A/gD/AP8A+gD6AAMAAwACAAIAAgACAP4A/gABAAEA+wD7APwA/AADAAMAAgACAAEAAQD+AP4AAAAAAPoA+gADAAMAAgACAAEAAQD9AP0AAAAAAPsA+wD+AP4AAwADAAIAAgAAAAAA/wD/AAAAAAD6APoAAgACAAEAAQADAAMA/wD/AAEAAQD6APoA/AD8AAIAAgACAAIAAQABAAAAAAAAAAAA+gD6AAIAAgABAAEAAQABAP4A/gABAAEA+wD7AP8A/wACAAIAAAAAAAAAAAABAAEAAQABAPoA+gABAAEAAAAAAAAAAAD9AP0AAQABAPwA/AD/AP8AAwADAAEAAQAAAAAA/wD/AAEAAQD7APsAAQABAP8A/wAAAAAA/gD+AAIAAgD9AP0A/wD/AAMAAwABAAEA/wD/AP8A/wD/AP8A+gD6AAMAAwACAAIAAQABAPwA/AABAAEA/QD9AAAAAAADAAMAAAAAAP4A/gD+AP4A/wD/APsA+wADAAMAAgACAAIAAgD+AP4AAQABAPsA+wD+AP4AAgACAAIAAgAAAAAA/gD+AP4A/gD6APoAAwADAAIAAgACAAIA/gD+AAEAAQD7APsA/gD+AAIAAgABAAEAAAAAAP8A/wD/AP8A+wD7AAIAAgABAAEAAwADAP8A/wACAAIA+gD6AP4A/gACAAIAAQABAP8A/wD/AP8AAAAAAPsA+wADAAMAAQABAAIAAgD/AP8AAQABAPkA+QD9AP0AAgACAAIAAgABAAEAAQABAP8A/wD6APoAAwADAAEAAQABAAEA/QD9AAAAAAD7APsA/wD/AAIAAgAAAAAAAAAAAAEAAQAAAAAA+wD7AAIAAgAAAAAAAAAAAP0A/QABAAEA+wD7AAAAAAADAAMAAQABAP8A/wD+AP4AAAAAAPsA+wADAAMAAgACAAAAAAD8APwAAAAAAPsA+wAAAAAABAAEAAIAAgD/AP8A/wD/AP4A/gD7APsAAwADAAEAAQABAAEA/QD9AAIAAgD6APoAAAAAAAMAAwACAAIA/wD/AP8A/wD9AP0A+wD7AAMAAwABAAEAAQABAP4A/gABAAEA+wD7AAAAAAACAAIAAwADAP4A/gD+AP4A+wD7APwA/AAEAAQAAgACAAIAAgD+AP4AAAAAAPoA+gACAAIAAgACAAEAAQD+AP4AAAAAAP0A/QD8APwAAgACAAIAAgACAAIA/wD/AAAAAAD5APkAAQABAAEAAQABAAEA/gD+AAEAAQD8APwA/gD+AAMAAwABAAEAAAAAAP8A/wAAAAAA+gD6AAIAAgAAAAAAAQABAP4A/gACAAIA/AD8AP8A/wADAAMAAQABAP8A/wD/AP8A/wD/APsA+wAEAAQAAQABAAAAAAD+AP4AAQABAPsA+wAAAAAAAwADAAEAAQD+AP4A/gD+AP4A/gD7APsABAAEAAEAAQABAAEA/QD9AAEAAQD6APoAAQABAAQABAABAAEA/QD9AP0A/QD+AP4A/gD+AAUABQACAAIAAAAAAP0A/QAAAAAA+gD6AAEAAQACAAIAAgACAP4A/gAAAAAA/AD8APwA/AAFAAUAAgACAAAAAAD9AP0A/wD/APkA+QACAAIAAgACAAIAAgD+AP4AAAAAAP0A/QD9AP0AAwADAAIAAgAAAAAA/gD+AP8A/wD5APkAAQABAAEAAQACAAIA/wD/AAEAAQD8APwA/gD+AAMAAwAAAAAA/wD/AP4A/gAAAAAA+wD7AAIAAgABAAEAAgACAP4A/gABAAEA/AD8AP8A/wADAAMAAAAAAP4A/gD/AP8A/wD/APsA+wAEAAQAAQABAAEAAQD9AP0AAQABAPsA+wAAAAAAAgACAAAAAAD+AP4AAAAAAP8A/wD9AP0ABAAEAAEAAQAAAAAA/QD9AAAAAAD6APoAAQABAAMAAwABAAEA/gD+AP8A/wD9AP0A/QD9AAUABQABAAEAAAAAAPwA/AAAAAAA+gD6AAIAAgACAAIAAgACAP4A/gAAAAAA/QD9APwA/AAEAAQAAgACAAAAAAD9AP0A/wD/APoA+gADAAMAAwADAAIAAgD+AP4AAAAAAPwA/AD9AP0AAwADAAEAAQAAAAAA/wD/AAAAAAD6APoAAgACAAEAAQACAAIA/wD/AAEAAQD8APwA/gD+AAIAAgABAAEA/wD/AP8A/wAAAAAA+wD7AAMAAwACAAIA/wD/AP0A/QACAAIA/AD8AP8A/wABAAEAAAAAAP8A/wAAAAAA/wD/APwA/AADAAMAAQABAAAAAAD9AP0AAAAAAPsA+wABAAEAAQABAAAAAAD+AP4AAQABAP4A/gD9AP0AAwADAAAAAAD/AP8A/gD+AAAAAAD7APsAAwADAAIAAgABAAEA/QD9AAEAAQD8APwA/wD/AAQABAAAAAAA/gD+AP0A/QAAAAAA/AD8AAQABAACAAIAAQABAP0A/QAAAAAA+wD7AAAAAAADAAMAAQABAP8A/wD/AP8A/gD+APsA+wAEAAQAAgACAAEAAQD9AP0AAAAAAPoA+gABAAEAAgACAAEAAQD/AP8AAAAAAP4A/gD8APwABQAFAAAAAAD/AP8A/wD/AAEAAQD6APoAAQABAAEAAQABAAEA/gD+AAEAAQD8APwA/gD+AAMAAwABAAEA/wD/AP8A/wAAAAAA+wD7AAIAAgAAAAAAAgACAP8A/wACAAIA+wD7AP8A/wABAAEAAAAAAP8A/wAAAAAA/wD/APwA/AADAAMAAQABAAAAAAD9AP0AAQABAPwA/AABAAEAAAAAAAAAAAD+AP4AAQABAP4A/gD+AP4ABAAEAAAAAAAAAAAA/QD9AAAAAAD6APoAAgACAAIAAgABAAEA/gD+AAAAAAD8APwA/wD/AAUABQABAAEA/wD/AP0A/QD/AP8A+gD6AAMAAwABAAEAAgACAP4A/gABAAEA+gD6AAEAAQADAAMAAAAAAP8A/wD/AP8A/gD+APsA+wAEAAQAAgACAAEAAQD+AP4AAQABAPoA+gABAAEAAgACAAEAAQD+AP4AAAAAAP0A/QD7APsABAAEAAMAAwABAAEA/gD+AP8A/wD5APkAAQABAAIAAgABAAEA/gD+AAEAAQD9AP0A/gD+AAQABAAAAAAA/wD/AAAAAAABAAEA+gD6AAEAAQAAAAAAAQABAP8A/wACAAIA/AD8AP8A/wACAAIAAAAAAP4A/gD/AP8A/wD/APwA/AADAAMAAQABAAEAAQD9AP0AAQABAPwA/AACAAIAAgACAAAAAAD9AP0A/wD/AP0A/QD9AP0ABAAEAAEAAQAAAAAA/gD+AAAAAAD8APwAAgACAAAAAAACAAIA/QD9AAAAAAD8APwA/gD+AAQABAABAAEAAAAAAP4A/gD/AP8A+wD7AAMAAwABAAEAAQABAP4A/gD/AP8A+gD6AAAAAAAFAAUAAgACAP4A/gD+AP4A/QD9APsA+wADAAMAAQABAAEAAQD+AP4AAQABAPoA+gABAAEAAQABAAEAAQAAAAAAAAAAAPwA/AD7APsAAwADAAIAAgABAAEA/gD+AAEAAQD6APoAAQABAAEAAQABAAEA/gD+AAAAAAD9AP0A/QD9AAMAAwABAAEA/wD/AP8A/wAAAAAA+wD7AAMAAwABAAEAAAAAAP0A/QAAAAAA/AD8AP8A/wADAAMAAQABAP8A/wD+AP4AAQABAPsA+wACAAIAAQABAAAAAAD9AP0AAQABAPwA/AABAAEAAwADAAEAAQD+AP4A/wD/AP4A/gD8APwAAwADAAEAAQABAAEA/AD8AAAAAAD8APwAAwADAAIAAgAAAAAA/AD8AP8A/wD8APwA/gD+AAQABAABAAEAAAAAAP8A/wD/AP8A/AD8AAIAAgACAAIAAgACAPwA/AD/AP8A+gD6AAEAAQAEAAQAAgACAP8A/wD/AP8A/QD9APwA/AADAAMAAQABAAAAAAD+AP4AAAAAAPoA+gACAAIAAgACAAEAAQD+AP4AAQABAPwA/AD+AP4AAgACAAAAAAD/AP8A/wD/AP8A/wD8APwAAwADAAEAAQABAAEA/QD9AAIAAgD6APoAAAAAAAIAAgABAAEA/wD/AAAAAAD+AP4A/QD9AAMAAwABAAEAAAAAAP4A/gAAAAAA+wD7AAIAAgACAAIAAAAAAPwA/AACAAIA/gD+AAAAAAACAAIAAAAAAP4A/gD+AP4A/wD/APwA/AAEAAQAAQABAAEAAQD9AP0AAQABAPwA/AAAAAAAAwADAAAAAAD9AP0A/wD/AP4A/gD+AP4ABAAEAAEAAQAAAAAA/gD+AAAAAAD7APsAAgACAAIAAgACAAIA/AD8AAAAAAD8APwAAQABAAQABAABAAEA/gD+AP4A/gD+AP4A/AD8AAQABAABAAEAAQABAP4A/gAAAAAA+wD7AAAAAAACAAIAAQABAP8A/wAAAAAA/AD8APwA/AADAAMAAQABAAEAAQD/AP8AAAAAAPsA+wACAAIAAQABAAEAAQD+AP4AAQABAPsA+wAAAAAAAgACAAAAAAAAAAAAAQABAP8A/wD8APwAAgACAAAAAAAAAAAA/gD+AAAAAAD7APsAAgACAAIAAgABAAEA/gD+AAIAAgD7APsA/gD+AAIAAgAAAAAA/wD/AAAAAAD/AP8A/QD9AAMAAwABAAEAAAAAAP4A/gAAAAAA+wD7AAEAAQADAAMA/wD/APwA/AABAAEA/wD/AAAAAAADAAMAAAAAAP4A/gD+AP4A/wD/APwA/AADAAMAAQABAAEAAQD+AP4AAQABAPsA+wAAAAAAAgACAAEAAQD/AP8A/wD/APwA/AD9AP0AAwADAAIAAgAAAAAA/wD/AP8A/wD7APsAAgACAAEAAQABAAEA/gD+AAAAAAD7APsAAAAAAAEAAQACAAIAAAAAAAEAAQD9AP0A/AD8AAIAAgAAAAAAAAAAAP8A/wAAAAAA+wD7AAIAAgABAAEAAQABAAAAAAABAAEA+gD6AP4A/gABAAEAAQABAAAAAAABAAEA/gD+APwA/AADAAMAAAAAAAAAAAD+AP4AAAAAAPsA+wADAAMA/wD/AAAAAAD/AP8AAgACAPwA/AD/AP8AAQABAAAAAAD+AP4AAAAAAP4A/gD9AP0AAwADAAEAAQAAAAAA/wD/AAAAAAD6APoAAwADAAIAAgABAAEA/QD9AAAAAAD8APwAAAAAAAMAAwABAAEAAAAAAP8A/wD+AP4A/AD8AAMAAwABAAEAAAAAAP4A/gABAAEA+wD7AAEAAQACAAIAAQABAP4A/gAAAAAA+wD7AP4A/gACAAIAAQABAAAAAAD/AP8A/wD/APwA/AADAAMAAQABAAIAAgD+AP4A/wD/APkA+QABAAEAAgACAAIAAgD/AP8AAQABAPwA/AD+AP4AAgACAAEAAQAAAAAA/wD/AP8A/wD8APwAAQABAAAAAAACAAIAAAAAAAEAAQD7APsAAAAAAAEAAQAAAAAA/wD/AAAAAAD9AP0A/gD+AAMAAwAAAAAAAAAAAP8A/wD+AP4A/AD8AAIAAgAAAAAAAAAAAP4A/gABAAEA/AD8AAEAAQACAAIAAQABAP4A/gAAAAAA/QD9AP0A/QADAAMAAAAAAP8A/wD/AP8AAAAAAPsA+wADAAMAAQABAAEAAQD9AP0AAAAAAPsA+wAAAAAAAgACAAEAAQD/AP8AAAAAAP0A/QD9AP0ABAAEAAEAAQD/AP8A/QD9AP4A/gD8APwAAwADAAMAAwABAAEA/gD+AAAAAAD7APsA/wD/AAIAAgABAAEA/wD/AAAAAAD+AP4A/AD8AAMAAwACAAIAAQABAP4A/gD/AP8A+gD6AAEAAQABAAEAAQABAP4A/gABAAEA/AD8AAAAAAABAAEAAgACAAAAAAD/AP8A/gD+APwA/AACAAIAAAAAAAEAAQAAAAAAAAAAAPwA/AACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AAAAAAAAQABAAEAAQAAAAAAAQABAP4A/gD9AP0AAgACAAAAAAD/AP8A/gD+AAAAAAD7APsAAgACAAEAAQABAAEA/wD/AP8A/wD8APwAAQABAAEAAQAAAAAA/gD+AAAAAAD+AP4A/gD+AAMAAwABAAEAAAAAAP4A/gD/AP8A+wD7AAMAAwABAAEAAAAAAP4A/gAAAAAA+wD7AAEAAQACAAIAAQABAP4A/gD/AP8A/AD8AP4A/gACAAIAAQABAAAAAAAAAAAA/wD/APwA/AACAAIAAgACAAEAAQD9AP0A/wD/APoA+gABAAEAAgACAAIAAgD/AP8AAAAAAPwA/AD+AP4AAgACAAAAAAAAAAAA/wD/AP8A/wD7APsAAQABAAEAAQACAAIAAAAAAAEAAQD7APsAAAAAAAAAAAAAAAAA/wD/AAEAAQD9AP0A/wD/AAMAAwABAAEA/gD+AP8A/wABAAEA/QD9AAEAAQD/AP8AAAAAAP8A/wABAAEA/AD8AAIAAgABAAEAAQABAP4A/gAAAAAA/AD8AP8A/wABAAEAAAAAAP8A/wABAAEA/wD/AP0A/QACAAIAAAAAAAAAAAD+AP4AAAAAAPwA/AACAAIAAQABAAEAAQD+AP4AAAAAAPwA/AAAAAAAAwADAAAAAAD+AP4A/gD+AP4A/gD9AP0ABAAEAAEAAQABAAEA/gD+AP8A/wD7APsAAQABAAEAAQABAAEA/gD+AAEAAQD7APsA/gD+AAMAAwACAAIAAAAAAAAAAAD9AP0A/AD8AAIAAgABAAEAAAAAAP8A/wAAAAAA/AD8AAIAAgABAAEAAAAAAP4A/gACAAIA/AD8AP8A/wABAAEAAQABAP8A/wABAAEA/gD+AP0A/QACAAIAAAAAAAAAAAD+AP4AAAAAAPwA/AAAAAAAAAAAAAIAAgAAAAAAAQABAPsA+wD/AP8AAQABAAAAAAD/AP8AAAAAAP0A/QD/AP8AAwADAAEAAQD/AP8A/wD/AAAAAAD9AP0AAgACAP8A/wD/AP8A/wD/AAEAAQD9AP0AAgACAAEAAQAAAAAA/gD+AAAAAAD8APwAAAAAAAIAAgAAAAAA/wD/AP8A/wD9AP0A/gD+AAQABAABAAEA/wD/AP4A/gD+AP4A+wD7AAIAAgACAAIAAQABAP4A/gAAAAAA/AD8AAAAAAACAAIAAAAAAAAAAAAAAAAA/AD8AP0A/QACAAIAAQABAAAAAAD/AP8A/wD/APwA/AACAAIAAAAAAAAAAAD+AP4AAQABAPoA+gAAAAAAAwADAAIAAgD/AP8A/wD/APwA/AD+AP4AAgACAAEAAQD/AP8AAAAAAP4A/gD9AP0AAwADAAEAAQD/AP8AAAAAAAIAAgD7APsAAAAAAAAAAAABAAEA/wD/AAEAAQD9AP0AAAAAAAIAAgAAAAAA/gD+AP8A/wD+AP4A/gD+AAIAAgAAAAAAAQABAP4A/gD/AP8A/QD9AAMAAwABAAEAAAAAAP4A/gAAAAAA/AD8AAEAAQACAAIAAQABAP4A/gAAAAAA/QD9AP8A/wACAAIAAAAAAAAAAAD/AP8A/gD+APwA/AADAAMAAQABAAAAAAD+AP4AAAAAAPwA/AABAAEAAQABAAAAAAD/AP8A/wD/APoA+gAAAAAABAAEAAIAAgD/AP8A/gD+AP0A/QD9AP0AAwADAAEAAQAAAAAA/wD/AAAAAAD8APwAAgACAAAAAAAAAAAAAAAAAAAAAAD6APoA/wD/AAIAAgABAAEA/wD/AAAAAAD9AP0A/gD+AAIAAgAAAAAA/wD/AP8A/wD/AP8A/AD8AAIAAgABAAEAAAAAAP0A/QABAAEA/QD9AAIAAgABAAEAAAAAAP4A/gAAAAAA/QD9AP8A/wADAAMAAQABAP8A/wAAAAAA/wD/AP0A/QACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AAAAAAAAgACAAEAAQD/AP8A/gD+AP4A/gD/AP8ABAAEAAAAAAD/AP8A/gD+AP8A/wD8APwAAwADAAEAAQABAAEA/gD+AAAAAAD8APwAAQABAAEAAQACAAIA/wD/AP8A/wD8APwA/gD+AAMAAwABAAEAAAAAAP8A/wD+AP4A/AD8AAIAAgAAAAAAAAAAAP8A/wD/AP8A+wD7AAIAAgACAAIAAAAAAP4A/gABAAEA/AD8AAAAAAABAAEAAAAAAP8A/wAAAAAA/gD+AP4A/gADAAMAAAAAAAAAAAD/AP8A/wD/APsA+wACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AAAAAAAAgACAAEAAQD9AP0A/wD/AP8A/wD/AP8AAwADAAAAAAD+AP4A/gD+AP8A/wD8APwAAwADAAEAAQAAAAAA/gD+AAAAAAD8APwAAQABAAIAAgABAAEA/QD9AP8A/wD9AP0AAAAAAAMAAwABAAEA/wD/AP8A/wD+AP4A/AD8AAMAAwABAAEAAQABAP4A/gD/AP8A/AD8AAMAAwACAAIAAAAAAP4A/gAAAAAA/AD8AAEAAQACAAIAAQABAP4A/gAAAAAA/QD9AP8A/wACAAIAAQABAAAAAAD/AP8A/gD+APwA/AACAAIAAQABAAEAAQD/AP8AAAAAAPwA/AABAAEAAQABAAAAAAD+AP4AAAAAAPwA/AAAAAAAAwADAP8A/wD+AP4AAQABAP8A/wD+AP4AAgACAP8A/wD/AP8A/wD/AP8A/wD9AP0AAwADAAAAAAAAAAAA/gD+AAAAAAD8APwAAQABAAEAAQAAAAAA/gD+AAAAAAD9AP0AAAAAAAIAAgAAAAAA/gD+AP8A/wD9AP0A/gD+AAMAAwABAAEA/wD/AP0A/QAAAAAA/gD+AAMAAwAAAAAA/wD/AP0A/QAAAAAA/AD8AAIAAgACAAIAAAAAAP4A/gAAAAAA/QD9AP8A/wACAAIAAgACAP8A/wD+AP4A/QD9AP0A/QADAAMAAQABAAAAAAD+AP4A/wD/APwA/AACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AACAAIAAQABAAAAAAD/AP8AAQABAP0A/QD+AP4AAgACAAAAAAD/AP8A/wD/AP8A/wD9AP0AAwADAAAAAAAAAAAA/wD/AAAAAAD7APsAAQABAAEAAQABAAEA/gD+AAEAAQD9AP0AAQABAAEAAQAAAAAA/gD+AAAAAAD9AP0A/gD+AAMAAwD/AP8A/gD+AAAAAAAAAAAA/QD9AAIAAgAAAAAA/wD/AP4A/gAAAAAA/AD8AAIAAgABAAEAAAAAAP4A/gAAAAAA/AD8AAEAAQADAAMAAAAAAP0A/QD/AP8A/QD9AAAAAAADAAMAAQABAP8A/wD/AP8A/gD+AP0A/QADAAMAAQABAP8A/wD+AP4AAAAAAP0A/QACAAIAAAAAAAAAAAD/AP8AAAAAAPwA/AABAAEAAQABAAAAAAD+AP4AAAAAAP0A/QD/AP8AAgACAAIAAgD/AP8A/gD+APwA/AD+AP4AAwADAAEAAQAAAAAA/wD/AP8A/wD8APwAAgACAAAAAAAAAAAA/wD/AP8A/wD8APwAAgACAAAAAAAAAAAAAAAAAAEAAQD8APwAAAAAAAEAAQAAAAAA/wD/AAAAAAD+AP4A/wD/AAIAAgAAAAAA/wD/AP8A/wD+AP4A/QD9AAMAAwAAAAAA/wD/AP8A/wAAAAAA/QD9AAIAAgABAAEAAAAAAP4A/gAAAAAA/AD8AAEAAQACAAIAAAAAAP4A/gABAAEA/gD+AP8A/wACAAIAAAAAAP8A/wD/AP8A/gD+AP4A/gACAAIAAQABAAAAAAD/AP8AAAAAAPsA+wACAAIAAwADAAAAAAD9AP0A/gD+APwA/AACAAIAAgACAAEAAQD+AP4AAAAAAPwA/AAAAAAAAgACAAAAAAD/AP8A/wD/AP4A/gD+AP4AAgACAAEAAQAAAAAA/wD/AP4A/gD8APwAAgACAAEAAQAAAAAA/wD/AAAAAAD8APwAAQABAAEAAQABAAEA/gD+AP8A/wD8APwAAAAAAAEAAQAAAAAA/wD/AAAAAAD9AP0A/wD/AAIAAgAAAAAA/wD/AP8A/wD+AP4A/gD+AAIAAgD/AP8A/wD/AAAAAAAAAAAA/AD8AAIAAgABAAEAAAAAAP4A/gAAAAAA/AD8AAEAAQABAAEAAAAAAP4A/gAAAAAA/AD8AAAAAAAEAAQAAAAAAP4A/gD/AP8A/gD+AP8A/wADAAMAAQABAP8A/wD/AP8A/wD/APwA/AACAAIAAQABAAAAAAD+AP4AAAAAAPwA/AABAAEAAgACAAEAAQD+AP4A/wD/APwA/AAAAAAAAgACAAEAAQD/AP8AAAAAAP4A/gD9AP0AAgACAAIAAgD/AP8A/wD/AP0A/QD9AP0AAgACAAEAAQAAAAAA/wD/AP8A/wD8APwAAQABAAEAAQAAAAAA/wD/AAAAAAD9AP0AAAAAAAAAAAABAAEAAAAAAAEAAQD9AP0A/wD/AAEAAQAAAAAA/gD+AAAAAAD+AP4A/wD/AAIAAgAAAAAA/wD/AP8A/wD+AP4A/wD/AAIAAgAAAAAA/wD/AP8A/wAAAAAA/QD9AAIAAgABAAEAAAAAAP4A/gD/AP8A/AD8AAEAAQABAAEAAAAAAP8A/wAAAAAA/QD9AAAAAAABAAEAAAAAAP4A/gAAAAAA/QD9AP8A/wACAAIAAQABAP8A/wAAAAAA/gD+AP0A/QAEAAQAAQABAP8A/wD+AP4A/gD+AP0A/QADAAMAAgACAAEAAQD/AP8A/wD/APwA/AABAAEAAQABAAAAAAD+AP4AAAAAAP0A/QD/AP8AAQABAAEAAQAAAAAAAAAAAP0A/QD+AP4AAQABAAAAAAD/AP8AAAAAAP4A/gD+AP4AAgACAAEAAQAAAAAA/gD+AP8A/wD+AP4AAQABAAAAAAD/AP8A/wD/AAAAAAD9AP0AAQABAAEAAQAAAAAA/gD+AAAAAAD9AP0AAAAAAAAAAAAAAAAA/wD/AAEAAQD+AP4A/wD/AAEAAQAAAAAA/gD+AAAAAAD+AP4A/gD+AAIAAgABAAEA/wD/AP8A/wD+AP4A/gD+AAMAAwAAAAAA/gD+AP4A/gAAAAAA/QD9AAIAAgABAAEAAAAAAP4A/gD/AP8A/AD8AAAAAAABAAEAAAAAAP8A/wABAAEA+wD7AP8A/wADAAMAAgACAP8A/wD/AP8A/QD9AP0A/QACAAIAAQABAAAAAAAAAAAA/wD/AP0A/QACAAIAAQABAP8A/wD/AP8AAAAAAPwA/AABAAEAAAAAAAAAAAD/AP8AAAAAAP0A/QAAAAAAAQABAAAAAAD+AP4AAAAAAP0A/QD+AP4AAQABAAEAAQAAAAAAAQABAP0A/QD9AP0AAQABAAAAAAD/AP8AAAAAAP8A/wD9AP0AAgACAAEAAQAAAAAA/gD+AAAAAAD+AP4AAQABAP8A/wD/AP8A/wD/AAEAAQD9AP0AAQABAAEAAQAAAAAA/gD+AAAAAAD9AP0AAAAAAAEAAQAAAAAAAAAAAP8A/wD8APwA/wD/AAMAAwABAAEA/wD/AP8A/wD+AP4A/QD9AAIAAgABAAEAAAAAAP8A/wD/AP8A/QD9AAIAAgABAAEA/wD/AP8A/wAAAAAA/AD8AAEAAQABAAEAAQABAP8A/wAAAAAA/AD8AAAAAAABAAEAAAAAAP8A/wABAAEA/AD8AP0A/QACAAIAAgACAAAAAAAAAAAA/QD9AP0A/QABAAEAAQABAAAAAAAAAAAA/wD/AP0A/QACAAIAAQABAP8A/wD/AP8AAQABAPwA/AAAAAAAAAAAAAAAAAD/AP8AAQABAP0A/QABAAEAAQABAAAAAAD+AP4AAQABAP0A/QD/AP8AAQABAAEAAQD/AP8AAAAAAP0A/QD/AP8AAQABAAAAAAD/AP8AAAAAAP4A/gD+AP4AAgACAAEAAQAAAAAA/wD/AP8A/wD+AP4AAgACAAAAAAD/AP8A/wD/AP8A/wD9AP0AAQABAAEAAQAAAAAA/wD/AAAAAAD8APwAAAAAAAEAAQAAAAAAAAAAAP8A/wD7APsAAAAAAAMAAwABAAEA/wD/AP8A/wD8APwA/gD+AAIAAgABAAEAAAAAAAAAAAD+AP4A/gD+AAIAAgAAAAAA/wD/AAAAAAD+AP4A/AD8AAEAAQABAAEAAAAAAAAAAAAAAAAA/AD8AAEAAQABAAEAAAAAAP8A/wABAAEA+wD7AAAAAAACAAIAAQABAP8A/wAAAAAA/AD8AP8A/wABAAEAAAAAAP8A/wAAAAAA/gD+AP8A/wACAAIAAQABAP8A/wAAAAAA/wD/AP4A/gABAAEAAAAAAP8A/wAAAAAAAAAAAP0A/QACAAIAAQABAAAAAAD/AP8A/wD/APwA/AABAAEAAQABAAEAAQD+AP4A/wD/AP0A/QACAAIAAgACAAAAAAD+AP4A/wD/APwA/AD/AP8AAgACAAEAAQD/AP8AAAAAAP4A/gD/AP8AAQABAAAAAAD/AP8A/wD/AP0A/QD+AP4AAgACAAEAAQAAAAAA/wD/AP4A/gD8APwAAQABAAEAAQAAAAAAAAAAAP4A/gD8APwAAgACAAIAAgABAAEA/gD+AP8A/wD8APwAAAAAAAEAAQABAAEA/wD/AAAAAAD9AP0A/wD/AAEAAQAAAAAA/wD/AAIAAgD9AP0A/QD9AAAAAAAAAAAAAAAAAAEAAQD/AP8A/gD+AAEAAQAAAAAA/wD/AP8A/wD/AP8A/AD8AAEAAQACAAIAAAAAAP4A/gAAAAAA/QD9AAIAAgABAAEAAAAAAP4A/gAAAAAA/AD8AAEAAQABAAEAAQABAP4A/gAAAAAA/gD+AP8A/wAAAAAAAAAAAP8A/wAAAAAA/gD+AP8A/wACAAIAAAAAAP8A/wD/AP8A/gD+AP4A/gABAAEAAQABAAAAAAD9AP0A/gD+AP4A/gADAAMAAQABAP8A/wD+AP4A/gD+APwA/AABAAEAAQABAAEAAQD/AP8AAAAAAP0A/QABAAEAAAAAAAEAAQAAAAAA/wD/APwA/AAAAAAAAQABAAEAAQD/AP8AAAAAAP0A/QD/AP8AAQABAAAAAAD/AP8AAAAAAP0A/QD/AP8AAgACAAAAAAD/AP8AAAAAAP4A/gD+AP4AAQABAAAAAAD/AP8A/wD/AP8A/wD9AP0AAgACAAEAAQD/AP8AAAAAAAEAAQD9AP0AAAAAAP8A/wAAAAAA/wD/AAAAAAD9AP0AAQABAAEAAQAAAAAA/wD/AAAAAAD8APwAAAAAAAIAAgAAAAAA/QD9AAAAAAD+AP4AAAAAAAEAAQAAAAAA/gD+AAAAAAD9AP0A/wD/AAIAAgABAAEA/wD/AAAAAAD/AP8A/gD+AAEAAQABAAEA/wD/AP8A/wD+AP4A/QD9AAIAAgABAAEAAAAAAP8A/wD/AP8A/QD9AAEAAQABAAEAAAAAAP4A/gD/AP8A/QD9AAIAAgABAAEAAAAAAP8A/wAAAAAA/QD9AAAAAAABAAEAAAAAAP8A/wAAAAAA/QD9AAAAAAABAAEAAAAAAAAAAAABAAEA/QD9AP4A/gABAAEAAQABAAAAAAABAAEA/gD+AP4A/gABAAEAAAAAAP8A/wD/AP8A/gD+AP0A/QACAAIAAAAAAP4A/gAAAAAAAAAAAP4A/gABAAEAAAAAAP8A/wD/AP8AAAAAAP0A/QABAAEAAQABAAAAAAD/AP8AAQABAP0A/QAAAAAAAAAAAAAAAAD/AP8AAAAAAP0A/QAAAAAAAQABAAAAAAD/AP8AAAAAAP0A/QD/AP8AAQABAAEAAQD+AP4A/wD/AP4A/gD/AP8AAgACAAAAAAAAAAAA/wD/AP4A/gD9AP0AAgACAAEAAQAAAAAA/wD/AP8A/wD9AP0AAQABAAAAAAABAAEAAAAAAP4A/gD7APsAAAAAAAEAAQABAAEAAAAAAAAAAAD9AP0AAAAAAAAAAAAAAAAA/wD/AAAAAAD9AP0AAQABAAEAAQAAAAAA/wD/AAAAAAD9AP0A/wD/AAEAAQAAAAAA/wD/AAAAAAD+AP4A/wD/AAIAAgAAAAAA/wD/AAEAAQD+AP4A/QD9AAEAAQAAAAAAAAAAAAAAAAD/AP8A/gD+AAEAAQAAAAAA/wD/AP8A/wD/AP8A/QD9AAIAAgAAAAAA/gD+AP8A/wAAAAAA/gD+AAEAAQAAAAAA/wD/AP4A/gAAAAAA/QD9AAEAAQABAAEAAAAAAP8A/wAAAAAA/QD9AAAAAAABAAEAAQABAP4A/gD/AP8A/QD9AAAAAAACAAIAAAAAAP8A/wAAAAAA/QD9AP8A/wABAAEAAAAAAP8A/wD/AP8A/gD+AP8A/wABAAEAAQABAP8A/wAAAAAA/gD+AP4A/gABAAEAAAAAAP8A/wD/AP8A/wD/AP4A/gABAAEAAAAAAAEAAQD/AP8A/gD+APwA/AABAAEAAQABAAAAAAD/AP8AAAAAAP0A/QABAAEAAAAAAAAAAAD/AP8AAAAAAP0A/QACAAIA/wD/AAAAAAAAAAAAAQABAP0A/QAAAAAAAAAAAAAAAAD/AP8AAAAAAP4A/gAAAAAAAQABAAAAAAD+AP4AAAAAAP4A/gD/AP8AAgACAAAAAAD+AP4A/wD/AP4A/gD/AP8AAgACAAAAAAD/AP8A/wD/AP4A/gD+AP4AAgACAAAAAAD+AP4A/wD/AAAAAAD+AP4AAgACAAAAAAD/AP8A/wD/AP8A/wD9AP0AAgACAAEAAQAAAAAA/wD/AP8A/wD9AP0AAAAAAAEAAQABAAEA/gD+AP4A/gD8APwAAQABAAIAAgABAAEA/wD/AAAAAAD9AP0AAAAAAAEAAQAAAAAA/wD/AAAAAAD+AP4A/wD/AAAAAAABAAEAAAAAAAAAAAD9AP0A/gD+AAEAAQAAAAAA/wD/AAAAAAD+AP4A/wD/AAEAAQAAAAAAAAAAAAAAAAD+AP4A/gD+AAIAAgAAAAAA/wD/AP8A/wD/AP8A/gD+AAIAAgAAAAAA/wD/AP8A/wD/AP8A/QD9AAIAAgAAAAAA/wD/AP8A/wAAAAAA/QD9AAEAAQAAAAAA/wD/AP4A/gAAAAAA/QD9AAEAAQABAAEAAAAAAP8A/wAAAAAA/QD9AAAAAAACAAIAAAAAAP4A/gD/AP8A/QD9AAEAAQACAAIAAAAAAP4A/gAAAAAA/gD+AAAAAAABAAEAAAAAAP8A/wAAAAAA/gD+AP8A/wACAAIAAQABAP8A/wD/AP8A/gD+AP8A/wACAAIAAAAAAP8A/wAAAAAA/gD+AP4A/gABAAEAAQABAAAAAAD/AP8A/gD+AP4A/gACAAIAAAAAAP8A/wD/AP8A/wD/AP4A/gABAAEAAAAAAP8A/wD/AP8A/wD/AP4A/gABAAEAAAAAAAAAAAAAAAAAAAAAAP0A/QABAAEAAAAAAAAAAAD/AP8AAAAAAP0A/QABAAEAAQABAAAAAAD/AP8A/wD/AP0A/QACAAIAAQABAP8A/wD+AP4AAAAAAP4A/gABAAEAAQABAAAAAAD+AP4AAAAAAP0A/QAAAAAAAQABAAAAAAD/AP8AAAAAAP4A/gAAAAAAAQABAAAAAAD+AP4AAAAAAP4A/gD/AP8AAgACAAAAAExJU1RKAAAASU5GT0lTRlQ+AAAARmlsZSBjcmVhdGVkIGJ5IEdvbGRXYXZlLiAgR29sZFdhdmUgY29weXJpZ2h0IChDKSBDaHJpcyBDcmFpZw==";
            var saveAudio = new Audio("data:audio/wav;base64," + camera1wav);
            var vimeoPlayer = $("#vimeo-player");
            Number.prototype.round = function(p) {
                p = p || 10;
                return parseFloat( this.toFixed(p) );
            };
            String.prototype.toHHMMSS = function () {
                var sec_num = parseInt(this, 10); // don't forget the second param
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours < 10) {hours = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
            };
            var playerButtonsFirst=true;
            function playerButtons() {
                //Alternatif Player Varsayılan Ayarı
                var alternatePlayer = $("[data-action=alternative_player]");
                if(alternatePlayer.length){
                    var alternateDiv="<div style='margin-right:5px' class='pull-right'><input id='alternate' type='checkbox' autocomplete='off'>";
                    if(!$("#alternate").length) alternatePlayer.before(alternateDiv);
                    document.getElementById("alternate").checked = alternateAktif;
                    $('#alternate').click(function() {
                        var alternate = document.getElementById("alternate");
                        alternateAktif=alternate.checked;
                        localStorage.setItem("alternateAktif", alternateAktif);
                        var alt = alternateAktif === true ? "Youtube" : "Vimeo";
                        yaz(" Varsayılan player: "+ alt);
                    });
                    if(alternateAktif && playerButtonsFirst){
                        alternatePlayer.click();
                        setTimeout(playerButtons, 1000);
                    }
                }
                //Sinema Modu Varsayılan Ayarı
                var sinemaModu = $("[data-action=sinema_modu]");
                if(sinemaModu.length){
                    var sinemaDiv="<div style='margin-right:5px' class='pull-right'><input id='sinema' type='checkbox' autocomplete='off'>";
                    if(!$("#sinema").length) {sinemaModu.before(sinemaDiv);}
                    document.getElementById("sinema").checked = sinemaAktif;
                    $('#sinema').click(function() {
                        var sinema = document.getElementById("sinema");
                        sinemaAktif=sinema.checked;
                        localStorage.setItem("sinemaAktif", sinemaAktif);
                        var sin = sinemaAktif === true ? "Sinema" : "Normal";
                        yaz("Varsayılan mod: " + sin);
                    });
                    if(sinemaAktif && playerButtonsFirst){
                        sinemaModu.click();
                    }
                }
                //Vimeo varsayılan çözünürlük ve süre ayarları
                if(sinemaModu.length && vimeoPlayer.length){
                    var jumpDiv = "<div id='jumpDiv' style='margin-right:5px;' class='pull-right'>Ok tuşları kaç sn: " +
                        "<input class='inputIzdırap' style='width:40px;text-align:center' type='number'value='" + vimeoJump + "' maxlength='2' size='2' id='vimeoJump'>&nbsp;&nbsp;&nbsp;</div>";
                    sinemaModu.after(jumpDiv);
                    $('#vimeoJump').on('input', function() {
                        localStorage.setItem("vimeoJump", $(this).val());
                        yaz("Video atlama süresi kaydedildi: "+$(this).val() + " saniye");
                    });

                    var resSelect="<select class='inputIzdırap'>" +
                        '<option value="1080">1080p</option>'+
                        '<option value="720">720p</option>'+
                        '<option value="540">540p</option>'+
                        '<option value="360">360p</option>'+
                        '<option value="0">auto</option>'+
                        '</select>';
                    var resDiv ="<div id='resDiv' style='margin-right:5px' class='pull-right'>Varsayılan:" + resSelect + "</div>";
                    sinemaModu.after(resDiv);
                    $("#resDiv select").val(vimeoDefault);
                    $('#resDiv select').on('change', function() {
                        localStorage.setItem("vimeoDefault", this.value );
                        vimeoDefault = this.value;
                        yaz("Varsayılan ayarlandı: " + this.value + " (F5)");
                    });
                }
                playerButtonsFirst=false;
            }
            playerButtons();

            if(vimeoPlayer.length){
                var muteVolume=0.5;
                var iframe;
                var player;
                var keyPrevent = true;
                var focusInterval;
                var ctrlTimeout;
                var vimeoId;
                var vimeoLocalName;
                var vimeoSaveLocalName;
                var vimeoSaveListLocalName;
                function vimeoLoader(){
                    if(!$("#vimeo-player").length){
                        setTimeout(vimeoLoad,500);
                        console.log("vimeo tekrar dene");
                        return;
                    }
                    console.log("vimeo ok");
                    iframe = document.querySelector('iframe');
                    player = new Vimeo.Player(iframe);
                    player.on('loaded', function(data) {
                        if(localStorage.getItem("vimeo-ses")) {
                            var savedVol = localStorage.getItem("vimeo-ses");
                            player.setVolume(savedVol);
                        }
                    });
                    player.getVideoId().then(function(id) {
                        vimeoId = id;
                        vimeoLocalName = "vimeo-" + vimeoId;
                        vimeoSaveLocalName = "vimeoo-" + vimeoId;
                        vimeoSaveListLocalName ="vimeo-list-" + vimeoId;
                    });
                    player.on('play', function(data) {
                        focusWindow();
                        if(localStorage.getItem(vimeoLocalName)) {
                            var savedSec = Math.floor(localStorage.getItem(vimeoLocalName));
                            player.setCurrentTime(savedSec-3);
                            console.log("play sn: " + savedSec);
                        }
                        if(localStorage.getItem("vimeo-ses")) {
                            var savedVol = localStorage.getItem("vimeo-ses");
                            player.setVolume(savedVol);
                            console.log("ses ayarlanıyor");
                        }
                    });
                    player.on('pause', function(data) {
                        player.getCurrentTime().then(function(seconds) {
                            player.getVolume().then(function(volume) {
                                seconds = Math.round(seconds);
                                if(seconds < 10) return;
                                localStorage.setItem(vimeoLocalName,seconds-(-2));
                                localStorage.setItem("vimeo-ses",volume);
                                console.log("vimeo saved: " + seconds);
                            });
                        });
                    });
                    player.on('ended', function(data) {
                        localStorage.removeItem(vimeoLocalName);
                    });
                }

                function vimeoLoad(){
                    if(vimeoDefault>0) {
                        vimeoPlayer = $("#vimeo-player");
                        var vimeoSrc= vimeoPlayer.attr("src");
                        if (vimeoSrc.indexOf("?quality") < 0){
                            var vimeoClone = vimeoPlayer.clone();
                            vimeoClone.attr("src", vimeoSrc+"?quality="+vimeoDefault+"p");
                            vimeoPlayer.remove();
                            $(".resp_video").prepend(vimeoClone);
                            iframe = document.querySelector('iframe');
                            player = new Vimeo.Player(iframe);
                            player.on('loaded', function(data) {
                                yaz("Vimeo: " + vimeoDefault+"p yüklendi");
                                vimeoLoader();
                            });
                        }else{
                            console.log("Vimeo Tekrar: " + vimeoDefault+"p yükleniyor");
                            vimeoLoader();
                        }
                    }else{
                        console.log("Vimeo Normal Yükleniyor");
                        vimeoLoader();
                    }
                }
                vimeoLoad();

                function focusWindow(){
                    clearInterval(focusInterval);
                    focusInterval = setInterval(function(){
                        //console.log("focus");
                        $("#vimeo-player").blur();
                        window.focus();
                    }, 500);
                }
                var vimeoSave = setInterval(function(){
                    player.getPaused().then(function(paused) {
                        if(!paused){
                            player.getCurrentTime().then(function(seconds) {
                                player.getVolume().then(function(volume) {
                                    seconds = Math.round(seconds);
                                    if(seconds < 10) return;
                                    localStorage.setItem(vimeoLocalName,seconds);
                                    localStorage.setItem("vimeo-ses",volume);
                                    console.log("vimeo saved: " + seconds);
                                });
                            });
                        }
                    });
                }, 2000);



                function vimeoFF(){
                    player.getCurrentTime().then(function(seconds) {
                        var secFF = Math.floor(seconds-(-vimeoJump));
                        player.setCurrentTime(secFF);
                        console.log("İleri: "+ secFF);
                        localStorage.setItem(vimeoLocalName,secFF);
                        console.log("vimeo saved: " + secFF);
                    });
                }

                function vimeoRew(){
                    player.getCurrentTime().then(function(seconds) {
                        var secRew = Math.floor(seconds-vimeoJump);
                        if (secRew < 0) secRew=0;
                        player.setCurrentTime(secRew);
                        console.log("Geri: "+ secRew);
                        localStorage.setItem(vimeoLocalName,secRew);
                        console.log("vimeo saved: " + secRew);
                    });
                }

                function vimeoSesUp(){
                    player.getVolume().then(function(volume) {
                        var vol = volume+0.05;
                        if (vol > 1) vol = 1;
                        vol=vol.round(3);
                        console.log("Ses: " + vol);
                        player.setVolume(vol);
                    });
                }

                function vimeoSesDown(){
                    player.getVolume().then(function(volume) {
                        var vol = volume-0.05;
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
                    if ( !e.metaKey && e.target.nodeName!='TEXTAREA' && e.target.nodeName!='INPUT') {
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
                        if(e.keyCode==107){//+
                            if(keyPrevent) e.preventDefault();
                            player.getPlaybackRate().then(function(playbackRate) {
                                playbackRate=playbackRate-(-0.25);
                                if(playbackRate>2) playbackRate=2;
                                player.setPlaybackRate(playbackRate).then(function(playbackRateNew) {
                                    yaz("Oynatma hızı ayarlandı: " + playbackRateNew);
                                });
                            });
                        }
                        if(e.keyCode==109){//-
                            if(keyPrevent) e.preventDefault();
                            player.getPlaybackRate().then(function(playbackRate) {
                                playbackRate=playbackRate-(0.25);
                                if(playbackRate<0.5) playbackRate=0.5;
                                player.setPlaybackRate(playbackRate);
                                player.setPlaybackRate(playbackRate).then(function(playbackRateNew) {
                                    yaz("Oynatma hızı ayarlandı: " + playbackRateNew);
                                });
                            });
                        }
                        if(e.keyCode==83){//s
                            if(keyPrevent) e.preventDefault();
                            player.getCurrentTime().then(function(seconds) {
                                seconds = Math.round(seconds);
                                localStorage.setItem(vimeoLocalName,seconds);
                                var vimeoSaveList = "";

                                if(localStorage.getItem(vimeoSaveListLocalName)) vimeoSaveList=localStorage.getItem(vimeoSaveListLocalName);
                                vimeoSaveList += seconds + ",";
                                localStorage.setItem(vimeoSaveListLocalName, vimeoSaveList);
                                console.log("vimeo list saved(s): " + vimeoSaveList);
                                console.log("vimeo saved(s): " + seconds);
                                saveAudio.play();
                            });
                        }
                        if(e.keyCode==68){//d
                            if(keyPrevent) e.preventDefault();
                            if(localStorage.getItem(vimeoSaveLocalName)) {
                                var savedSecc = Math.floor(localStorage.getItem(vimeoSaveLocalName)-5);
                                player.setCurrentTime(savedSecc);
                            }
                        }
                        if(e.keyCode==81){//q
                            if(keyPrevent) e.preventDefault();
                            var vimeoGetList;
                            if (!localStorage.getItem(vimeoSaveListLocalName)){
                                vimeoListDiv.html("Bu video ile ilgili kayıt bulunamadı.");
                                setTimeout(function(){vimeoListDiv.html("");},3000);
                                return;
                            }
                            vimeoGetList = localStorage.getItem(vimeoSaveListLocalName);
                            var arr = [];
                            var vimeoRows = vimeoGetList.split(",");
                            for(var i = 0; i<(vimeoRows.length-1);i++){
                                arr.push(vimeoRows[i]);
                            }
                            arr.sort(function(a, b) {
                                return a - b;
                            });
                            var listeYaz="";
                            for (var l = 0; l < arr.length; l++) {
                                listeYaz += "<div class='link' data='" + arr[l] +"' vimeo-action='vimeoJump'>"+ arr[l].toHHMMSS() +"<br></div>";
                            }
                            listeYaz += "<hr><div class='link' data='-1' vimeo-action='vimeoJump'>Temizle</div>";
                            listeYaz += "<div class='link' data='-2' vimeo-action='vimeoJump'>Kapat</div>";
                            vimeoListDiv.html(listeYaz);
                        }
                        function focusIframe() {
                            var vimeoIframe = $("#vimeo-player")[0];
                            vimeoIframe.contentWindow.focus();
                        }
                        if(e.keyCode==70){//f
                            window.clearInterval(focusInterval);
                            console.log("focus cleared, f");
                            setTimeout(focusIframe, 100);
                            setTimeout(focusWindow, 1000);
                            if(keyPrevent) e.preventDefault();
                        }
                        if(e.keyCode==17){//ctrl
                            window.clearInterval(focusInterval);
                            console.log("focus cleared, ctrl");
                            window.clearTimeout(ctrlTimeout);
                            ctrlTimeout = setTimeout(function(){focusWindow();}, 7000);
                            if(keyPrevent) e.preventDefault();
                        }
                    }
                };

                $(document).on('click', '[data-action=alternative_player]', function() {
                    var video = ($(this).attr("data-video"));
                    console.log(video);
                    if(video == "youtube"){
                        window.clearInterval(focusInterval);
                        keyPrevent=false;
                    }
                    if(video == "vimeo"){
                        keyPrevent=true;
                        setTimeout(vimeoLoad,1000);
                        //focusWindow();
                    }
                    setTimeout(playerButtons, 1000);
                });
                //======================VIMEO LIST DIV======================//
                $("body").append("<div class='vimeoList' id ='vimeoList'></div>");
                var vimeoListDiv = $("#vimeoList");

                $(document).on('click', '[vimeo-action=vimeoJump]', function() {
                    var jumpSec = ($(this).attr("data"));
                    if(jumpSec < 0){
                        if(jumpSec=="-1"){
                            var txt;
                            var r = confirm("Bu video için kaydedilen tüm zamanlar silinsin mi?");
                            if (r == true) {
                                localStorage.removeItem(vimeoSaveListLocalName);
                                $("#vimeoList").html("");
                            }
                        }
                        if(jumpSec=="-2") $("#vimeoList").html("");
                        return;
                    }
                    localStorage.setItem(vimeoLocalName,jumpSec);
                    player.setCurrentTime(jumpSec);
                    console.log("jump: " + jumpSec);
                });
                //======================VIMEO LIST DIV SON======================//

            }
            //======================VIMEO SON======================//



            //======================SPOILER BLUR======================//
            $(document).on('click', '.spoiler', function() {
                var articleBlur = $(this).closest('article');
                articleBlur.find('.spoiler').each(function() {
                    $(this).toggleClass('on');
                });
            });
            //======================SPOILER BLUR SON======================//

            //======================RESULT DIV======================//
            $("body").append("<div class='result' id ='result'></div>");
            resultDiv= document.getElementById("result");
            //======================RESULT DIV SON======================//
        }
    }
})(jQuery);