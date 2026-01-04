// ==UserScript==
// @name        France - callbridge
// @description Ce script ajoute un bouton "Appeler" qui envoie+compose directement l'appel sur le smartphone (IOS/Android) de son choix. Nécessite un compte CallBridge Pro ou CallBridge
// @namespace   *
// @version     1.50
// @include     http:*
// @include     https:*

// @author      mcleed
// @require     http://code.jquery.com/jquery-3.1.0.min.js
// resource    icon28    https://getcallbridge.com/wp-content/uploads/2017/01/call28.png
// resource    icon28W   https://getcallbridge.com/wp-content/uploads/2017/01/call28white.png
// resource    settings28 https://getcallbridge.com/wp-content/uploads/2017/01/settings28.png
// resource    settings28W https://getcallbridge.com/wp-content/uploads/2017/01/settings28W.png
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/33625/France%20-%20callbridge.user.js
// @updateURL https://update.greasyfork.org/scripts/33625/France%20-%20callbridge.meta.js
// ==/UserScript==

$("head").append("<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css\">");

// Les 4 images
var Imgicon28W="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAcCAYAAABoMT8aAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAANPSURBVHjapJRdaBxVGIafc2Znd3Y3m90kZpOuSWriT4I3KgptwIqgVrAXwbS1BateaAuFIqlFVIh3/jdetFC2rdgfmmIuWipIKW1BKFIvqkirtsGq+WltjJKQTTa7bWZ25vPC2XTt7irUDw7DOe/7vd97znznKBHpAPqBacABFDfjKiBAW8maAAEgCXyAiKRFZKWIUGEsF5EVVbAVIrI3AEwBPwHPUB4r/WqxCtglYESJyCngCvBrBdKkb3lJBewuIIWI/CIiq6rY/LfxuIj8qIFcFYv/FXEgHyjO1u0YBngOeFopcFxh/oYAEA0pggGF53nKauo6Pz740s4zxwfBP6BipIA+regueDCd87BMA7vgMZP3aK7VBMIJ3OuZEXvm6oliUqnAO0rRnbM9Cp5m06O1mCyQTIQZnSpw9AeIRxoYPbC2I3/t/LvAYQBdImB6HuRt2P5sHRY5dn+VY+jcHC31FjWJOxg9uJ7s8ElCDe2UOVBK2X9mHZ5fXkfUdEifdUjWRTAiMd4/lWXq8xcwfv8aq/l+wHWKeYsOxLUB6GwKMjItdHdYfLymkSe6wqR7Ddoic+TNJJ7r4NiL+TcFxv5wuDKZ4/JEjgfbohz9LgvBKL3Luhi7/D1b+z9kfGQMx17AcwvlAsqMEI3WMHBylun5Avu2PMzEtQk+6t+AVdvEa1s20t7eimEYaK3LBRCXWFAwTIun0gW+/GyA1riLVd9CY2MDDzz0CPPzWUTkH91UIuApV5nEl9xD+Ju32fPe69xQUV7t28qhA5+yI72fzExm0XC5QCBcqxN3s3C6j/zZ/Ty5+kWWtjazeePL9PSu5fDBTwhZwSI7Vt5IwdgR+8ybq51vdxFKpdBa88a2Pu69r5N9e3dx7MgQbUvb8TwP4HiZgExdHCpcHAzpeOqxeKSOE18cI5OZJRQKorUmdWdL0fowsBvo+TtR5IKIrL+N69wjIuc0/zM0YAD528jNATrgCywDfqtAuu5/wxWwbiCoRGSP/3zfup1ZoNFfnwQSt+AekAwAPwMDFSrEgG3+nzoEzFTgbNJAfZU9vgLM+dU3V+E0aKAJWFMB3Ok/6eEqDlcBnUpEuoC3gHHALunzOaDGn8+WnIEAJtABbP9rAEmWnIMs+vnHAAAAAElFTkSuQmCC"

var Imgicon28= "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAcCAYAAACH81QkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQ/SURBVHjanJVbbFRFGMd/M+fsbvfCXtput4WVZms3KF4Wq/BAeAAND16iEaNC5KYkClKjPkh8MEYiMeENEkNABBV48IWABGMiiY3S6INQlYI2YlsKbLns0tButz17zp4zPuysNgQf5Esmk5nvm//8v5lv/iOARUA3cAHIAwFqJoAKMA006Ka0zwZagU5gD8B+YDW3twSwAkj9h38VcMAEzgF9wFqgCniahQs0AfcCbUABMGawNPW6hAC+0LR6Nd2A7iVQAq4BSSCmN5A6HRdYAvwpgN+AU8AGIKKD1IwdhR6rGWkoYBLYDSw0gTHgsnZO8v/sIpAx9SD8wo7fs8BrUmAKIdxyxcV2NQkFAZ8g6Bd4TlV6yjUi7QuOfv68CAPCBGju6IoD2w0pnvWU4vpNB8M0aYxIGgzFzela8wsHw/DR0DIPZ7KwOJlMDhQKhRpI7pktS4RgnlKKv67ZzJsdYuUjAaRbxXIU7S0hRm5YHDoN/nQGe/Qsgwc3P9zcYGUK0GcCGIFw0ACGijb3zw2xa30Le48PcfiMhzB85FrLPLlgFslshpHeY1w5tAHPniDYdo/BpTPUQFSlUnElzbP87FyVou+Pq3z5q4GjArSGPKZiaT466XDl+DpC/QcwI434MwtwyiUbXTAoT4nSdIWl82PEopJ9PeMsf7CZLY/P4nwxyo3pMVq7bD746mdOez6SqU7c6TKObQt0TZAvViiOV/j+7BjlaZe1S1vZdyKPDDYycu4nVj66GH/hF3YePEbB8jN25RJ2xcLzaqUjARz8SDNE34Uqm/fmyXakef+l+7hcBKd4nne6X4ZUjk2b3iBoeMRiUaSUCMG/IKZEmcqmPRXmu+tzWbPrApd7dhK1hgkmkjSEY0xOjNPRkSGWiGJZVr1s1T8gUkg/gTj+9HzuMocY3r+ObVu34ovE8Vybt95+k2++PsqOj3cRjTdSKFxDCIEQtTOt3U4wHpSpDNX+I0wdfhVfqcgrq9fQ1NTEA7mFbNz4Oiuee5FjR45wfXSURKIRANMwEvUH1pNe/m45lYjknG/fS6tACCfW5i1dtgzheiAk2WyW4aFBPvv0E+ak58hoLE616hTHS5PDQxdHxwXQA5zKzY2X1MTNp427u6Tp2u5ofoR8oYQPaGmKkr8xQSoRoqOjU1iW5VNK9fYPDE66ntdVf4AIMzCIjz48T6I8tz7vN6FarWIAoVAY13WFUsoEBhTMqcf1ANu5M/sQOCEBn1apOzEX8JlapRYBjwEhfWNK6+kEcFULdWzGZkpL56L67WyjllsEmNKL6wCjQForWBvQqMXcBcJaCYdMYFDn1qyFuC7GDvAUkNX/0W7Nsu43gCLwhAlkNHr+lnxz+hvpBdYDA8CPt8RIoNMANgLttwmoaPBW4AfgpE53pnUDi4X+O7qBfp17QFOdAsrAbH24DfocPMDS8w8Be/4eADPZkKk6TcpiAAAAAElFTkSuQmCC"

var Imgsettings28="data:image/png;base64,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"

var Imgsettings28W="data:image/png;base64,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"

// Quel Site

var quSite=0,AvecCallto=0,nAlt=0,ParamOuvert=0;
//quSite=GM_getValue("quSite",0)
var lUrl = document.location.href;

if (lUrl.lastIndexOf("//www.pap.fr/")>=0 )                     quSite=1; // de particutiers à particuliers
if (lUrl.lastIndexOf("//www.pagesjaunes.fr/")>=0)              quSite=2; // pagesjaunes ET pagesblanches
if (lUrl.lastIndexOf("//www.partenaire-europeen.fr/")>=0)      quSite=3; // partenaire-europeen
if (lUrl.lastIndexOf(".leboncoin.fr")>=0)                      quSite=4; // leboncoin
//if (lUrl.lastIndexOf("//cstatic.weborama.fr")>=0)              quSite=4; // leboncoin suite
if (lUrl.lastIndexOf("/www.seloger.com/")>=0)                  quSite=5; // seloger.com
if (lUrl.lastIndexOf("/www.paruvendu.fr/")>=0)                 quSite=6; // paruvendu.fr
if (lUrl.lastIndexOf("/www.lesparticuliers.fr/")>=0)           quSite=7; // lesparticuliers.fr
if (lUrl.lastIndexOf("/www.vivastreet.com/")>=0)               quSite=8; // vivastreet.com
if (lUrl.lastIndexOf("/www.topannonces.fr/")>=0)               quSite=9; // topannonces.fr
if (lUrl.lastIndexOf("/zoomcar.fr/")>=0)                       quSite=10; // zoomcar
if (lUrl.lastIndexOf("/www.lacentrale.fr/")>=0)                quSite=11; // lacentrale
if (lUrl.lastIndexOf("/occasion.autoplus.fr/")>=0)             quSite=12; // occasion.autoplus
if (lUrl.lastIndexOf(".321auto.com/")>=0)                      quSite=13; // 321auto
if (lUrl.lastIndexOf("//www.pagesjaunes.fr/carte")>=0)         quSite=14; // pagesjaunes CARTE
if (lUrl.lastIndexOf("//getcallbridge.com")>=0)                quSite=15; // getcallbridge
if (lUrl.lastIndexOf("//app.salesflare.com")>=0)               quSite=16; // salesflare
if (lUrl.lastIndexOf("//www.tripadvisor.fr")>=0)               quSite=17; // tripadvisor
if (lUrl.lastIndexOf("//www.directmandat.com")>=0)             quSite=18; // directmandat safti

if (lUrl.lastIndexOf("//acdn")>=0)                            {quSite=100;return;} // pub
if (lUrl.lastIndexOf("//tr.snapchat")>=0)                     {quSite=100;return;} // pub
if (lUrl.lastIndexOf("//cdn")>=0)                             {quSite=100;return;} // pub
if (lUrl.lastIndexOf("//deazs")>=0)                           {quSite=100;return;} // pub
if (lUrl.lastIndexOf("//scontent")>=0)                        {quSite=100;return;} // pub
if (lUrl.lastIndexOf("//google")>=0)                          {quSite=100;return;} // pub

// console.log(lUrl);

//if (quSite>0) {GM_setValue("quSite",quSite);alert(quSite);

// Bouton APPELER long
var btnAppeler = document.createElement( 'button' );
  btnAppeler.setAttribute( 'type', 'button' );
  btnAppeler.setAttribute( 'style', 'margin-top : 1rem;' );
  btnAppeler.setAttribute( 'title', 'with CallBridge');
  btnAppeler.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">   Appeler le numéro';

// Bouton APPELER court
var btnAppel = document.createElement( 'button' );
  btnAppel.setAttribute( 'type', 'button' );
  btnAppel.setAttribute( 'style', 'margin-top : 1rem;' );
  btnAppel.setAttribute( 'title', 'with CallBridge');
  btnAppel.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">';

// Bouton APPELER court
var btnAppel2 = document.createElement( 'button' );
  btnAppel2.setAttribute( 'type', 'button' );
  btnAppel2.setAttribute( 'style', 'margin-top : 1rem;' );
  btnAppel2.setAttribute( 'title', 'with CallBridge');
  btnAppel2.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">';

// create button ----SMS ----
var btnSms = document.createElement( 'button' );
  btnSms.setAttribute( 'value', 'SMS' );
  btnSms.setAttribute( 'type', 'button' );
  btnSms.setAttribute( 'style', 'margin-top : 1rem;' );
  btnSms.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">sms';

var btnParametres = document.createElement( 'button' );
  btnParametres.setAttribute( 'value', 'Parametre compte CallBridge' );
  btnParametres.setAttribute( 'id', 'settings' );
  btnParametres.setAttribute( 'style', 'margin-top : 1rem;' );
  btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28 + '">   Paramètres CallBridge';

// 1 ligne
var UneLigne = document.createElement( 'span' );
    UneLigne.innerHTML = "<br>";
// 1 Blanc
var UnBlanc = document.createElement( 'span' );
    UnBlanc.innerHTML = " ";

var cbuser     = GM_getValue("cbuser",'');
var sVersion   = GM_info.script.version;

// hors site les protocoles tel: et callto:
// protocoles tel:
setTimeout(function() {
    var els = document.querySelectorAll("a[href^='tel:']");
    for (var i=0;i<els.length;i++) {
        els[i].outerHTML=els[i].outerHTML.replace("tel:","callbridge:");
    };

    // protocoles callto:
    els = document.querySelectorAll("a[href^='callto:']");
    for (var i=0;i<els.length;i++) {
        els[i].outerHTML=els[i].outerHTML.replace("callto:","callbridge:");
    };

    // nouveau protocole callbridge:
    els = document.querySelectorAll("a[href^='callbridge:']");
    for (var i=0;i<els.length;i++) {
        els[i].onclick=function(){jAppelle01()};
    };

},3000);

// pour intercepter ALT+X
window.addEventListener("keydown", keydown);

// Settings sans bouton 'btnParametres'
GM_registerMenuCommand("Fr.CallBridge - Settings", function openInTab() {
    win = window.open("https://www.mcleed.net/getcallbridgeweb?frcallbridge=1");
    win.focus();
});

// remplissage de la Page Fr.CallBridge - Settings sur https://www.mcleed.net/getcallbridgeweb?frcallbridge=1
if (lUrl.lastIndexOf("/getcallbridgeweb")>=0 && document.getElementById("lzA2")) {
    document.getElementById("A2").value=GM_getValue("cbuser",'');
    document.getElementById("A3").value=GM_getValue("cbpassword",'');
    document.getElementById("A6_1").checked=GM_getValue('cbcallto');
    A4.onclick = function () {
        var cbuser = document.getElementById('A2');
        GM_setValue("cbuser", cbuser.value);
        var cbpassword = document.getElementById('A3');
        GM_setValue("cbpassword", cbpassword.value);
        var cbcallto = document.getElementById('A6_1');
        GM_setValue("cbcallto",cbcallto.checked);
        window.close();
}; }


switch (quSite){
    case 0: // pas de site connu : on ajoute le bouton settings s'il y a callto:
        var body = document.getElementsByTagName('body')[0];
        if (AvecCallto>0) {
            btnParametres.style.position = 'fixed';
            btnParametres.style.textTransform = 'uppercase';
            btnParametres.style.fontWeight = '700';
            btnParametres.style.color = '#303030';
            btnParametres.style.fontFamily = '"Open Sans","Arial","Helvetica",sans-serif';
            btnParametres.style.padding = '10px';
            btnParametres.style.border = 'thin solid rgb(199,199,199)';
            btnParametres.style.boxShadow = '0 0 3rem rgba(48,48,48,0.4)';
            btnParametres.style.borderRadius = '3rem 3rem 3rem 3rem';
            btnParametres.style.bottom = '100px';
            btnParametres.style.right = '10px';
            btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28 + '"> Settings';
            body.appendChild(btnParametres);
        }
        break;
    case 1: // pap.fr ------------------------------------------------------------------------------
        btnAppeler.innerHTML = '<img src="'+ Imgicon28 + '">   Appeler le numéro';
        btnAppel.innerHTML = '<img src="'+ Imgicon28 + '">   Appeler le numéro';
        btnAppel2.innerHTML = '<img src="'+ Imgicon28 + '">   Appeler le numéro';
        btnSms.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28 + '"> SMS';
        btnSms.setAttribute( 'class', 'btn btn-small btn-type-1 btn-icon' );
        btnAppeler.setAttribute( 'class', 'btn btn-small btn-type-1 btn-icon' );
        btnAppel.setAttribute( 'class', 'btn btn-small btn-type-1 btn-icon' );
        btnAppel2.setAttribute( 'class', 'btn btn-small btn-type-1 btn-icon' );
        btnParametres.setAttribute( 'style', 'margin-top : 0rem;' );
        btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28 + '"> Settings';
        btnParametres.setAttribute( 'class', 'btn btn-small dialog-box-handler' ); // btn btn-small btn-type-1 btn-icon
     // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var pbouton = document.getElementsByClassName("header-tools-box");
        if (pbouton.length>0) {pbouton[0].appendChild(btnParametres);}

        var mbouton = document.getElementsByClassName("btn-display-phone  btn-telephone");
        mbouton[0].appendChild( btnAppeler );
        mbouton[0].appendChild( btnSms );
        if (mbouton.length>1) {mbouton[1].appendChild(btnAppel)}
        if (mbouton.length>2) {mbouton[2].appendChild(btnAppel2)}

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function ()  {jAppelle1("Call");}
        btnAppel.onclick=function ()    {jAppelle1("Call");}
        btnAppel2.onclick=function ()   {jAppelle1("Call");}
        btnSms.onclick=function ()      {jAppelle1("SMS");}

        function jAppelle1(pCall){
            var mbouton = document.getElementsByClassName('tel-wrapper')[0];
            if (!mbouton) {return;}
            var lText=mbouton.innerHTML;
            var sTel=leNumerique(lText);
            var mText = document.getElementsByClassName('item-title')[0].innerHTML;
            var sText=chAffichages(mText);
            // alert(sTel+" ; "+sText);
            if (sTel>'')	{Put_Notification(pCall,sTel,1,sText);}
            if (m==2) location.reload();
        };


        break;

    case 2: // pagesjaunes.fr ------------------------------------------------------------------------------
        // 1 bouton "j'appelle" par ligne du tableau
        var uls = document.querySelectorAll('.barre-liens-contact ');
        var markers = [];
        for (let i = 0; i < uls.length; i++) {
            markers[i] = document.createElement('li');
            markers[i].setAttribute( 'class', 'item plan value');
            markers[i].setAttribute( 'id', 'appeler'+i);
            markers[i].setAttribute( 'title', 'with CallBridge');
            markers[i].innerHTML = '<a class="pj-link"><img style="vertical-align: middle;" src="'+ Imgicon28 + '"><span class="value">Appeler</span></a>';
            uls[i].appendChild(markers[i]);
            markers[i].onclick = function(){ ClicAppeler(i);};	// <----- !!!
        }
        btnParametres.style.position = 'fixed';
        btnParametres.style.textTransform = 'uppercase';
        btnParametres.style.fontWeight = '700';
        btnParametres.style.color = '#303030';
        btnParametres.style.fontFamily = '"Open Sans","Arial","Helvetica",sans-serif';
        btnParametres.style.padding = '10px';
        btnParametres.style.border = 'thin solid rgb(199,199,199)';
        btnParametres.style.boxShadow = '0 0 3rem rgba(48,48,48,0.4)';
        btnParametres.style.borderRadius = '3rem 3rem 3rem 3rem';
        btnParametres.style.bottom = '100px';
        btnParametres.style.right = '10px';
        body = document.getElementsByTagName('body')[0];
        body.appendChild(btnParametres);

        // Clic sur "j'appelle"   AfficherMap:map-actions hidden-phone hidden-tablet    ClassN°Tel:item bi-contact-tel   ClassDuBouton:item-cta bi-contact-tel
        function ClicAppeler(pi){
            var ni = 0; ni = pi * 2 + 1;
            var iTit = 0, sTel = '', sText = '', iAdrD = 0, iAdrF = 0, sSep = "", s1='', sRue='', sVille='';

            // Nom du contact
            var lDenomination = document.getElementsByClassName('denomination-links');
            var lNom = sansBlanc(lDenomination[pi].innerHTML);

            // Adresse (rue et ville) du Contact
            var lAdresse = document.getElementsByClassName('adresse-container');
            var sAdr=sansBlanc(chAffichages(lAdresse[pi].innerHTML));

            // Extraction du n° TEL, MOBILE et FAX
            var lNumero = document.getElementsByClassName('item bi-contact-tel');
            var lArcep  = document.getElementsByClassName('main-contact-container clearfix');
            var lTel    = sansBlanc(chAffichages(lArcep[pi].innerHTML));
            var sTel = leNumerique(lTel);
            var lTels=sansBlanc(chAffichages(lNumero[ni].innerHTML));

            if (sTel>'') {Put_Notification("Call",sTel,1,sAdr);} else {alert("sans n° Tel : "+sAdr);}
        }
        function quTitle(pi,pText){
            var iDeb=0, iFin=0, F=1;
            for (i=pi;i<pText.length;i++)
                if (F==1 && pText.substr(i,12)=='"num" title=')      {iDeb=i+13;F=2;}
            if (iDeb===0) return '';
            for (i=iDeb;i<pText.length;i++)
                if (F==2 && pText.substr(i,1)=='"')           {iFin=i;F=3;}
            if (iFin===0) return '';
            var i=iFin-iDeb;
            return pText.substr(iDeb,i);
        }
        break;

    case 3: // partenaire-europeen ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'phone' );
        btnParametres.setAttribute( 'class', 'phone' );
        btnParametres.style.zIndex = '120';
        // Création des boutons callbridge
        var mbouton = document.getElementsByClassName('phone-container')[0];
        document.getElementsByClassName('phone-container')[ 0 ].appendChild( btnAppeler );
        document.getElementsByClassName('phone-container')[ 0 ].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function Notification_Call(){
//         if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
//         if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var mbouton = document.getElementsByClassName('phone-container')[0];
            if (!mbouton) {return;}
            var lText=mbouton.outerHTML;
            var sTx1=chBalise(lText,"href");
            var sTel=extraitChaine(sTx1,2,":");
            var mText = document.getElementsByClassName('product-name')[0].innerHTML;
            var sText=sansBlanc(mText);
            if (sTel>'')	{Put_Notification("Call",sTel,1,sText);}
        };
        break;

    case 4: // leboncoin ------------------------------------------------------------------------------
     // var mBtnMenu = document.getElementsByClassName('clearfix trackable');
     // console.log("the bon coin : 1");
        setTimeout(function() {
            btnAppeler.innerHTML = '<img style="vertical-align: middle;" src='+Imgicon28+'>   Appeler le numéro';
            btnAppeler.setAttribute( 'class', 'button-lightgrey large trackable' );
            btnParametres.setAttribute( 'class', 'button-mediumgrey large' );
            btnParametres.setAttribute( 'style', 'margin : 1rem;' );

            var mbouton = document.getElementsByClassName('_2sPVF')[0];
            var sClass=document.getElementsByClassName('_2sPVF')
            var m=sClass.length-1; //  alert(sClass[m].outerHTML)
//          console.log("the bon coin : 2 - "+sClass.length)
            if (m>=0) {
//              console.log("the bon coin : 3 - "+m);
                sClass[m].appendChild( btnAppeler );
                sClass[m].appendChild( btnParametres );

                // Clic sur "appeler le  numéro"
                btnAppeler.onclick=function (){
                    var mbouton = document.getElementsByClassName('_1Ivo6 _3VNQJ _2ar1Z _2k4S8'); // _2sNbI ObuDQ GXQkc _2xk2l');
                    if (mbouton.length>0) mbouton[0].firstElementChild.click();
                    setTimeout(function() {
                        var Notel = document.getElementsByClassName('_1Ivo6 _3VNQJ _2ar1Z _1-5Yr');
                        var sText = document.getElementsByClassName('_1KQme');
                        if (Notel) {Put_Notification("Call",chAffichages(Notel[0].innerHTML),1,sText[0].innerHTML);}
                    },2000);
                };
            };
        },2000);
        break;

    case 5 : // seloger.com  ------------------------------------------------------------------------------
        btnAppeler.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">   Appeler le numéro';
        btnAppeler.setAttribute( 'class', 'b-btn tagClick  ' );
        btnParametres.setAttribute( 'class', 'b-btn b-warn tagClick  ' );
        // Création des boutons callbridge
        var mbouton = document.getElementsByClassName('form-contact jsLockSubmit')[0];
        document.getElementsByClassName('form-contact jsLockSubmit')[ 0 ].appendChild( btnAppeler );
        document.getElementsByClassName('form-contact jsLockSubmit')[ 0 ].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function (){
//          if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
//          if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var mbouton = document.getElementsByClassName('btn-phone b-btn b-second fi fi-phone tagClick')[0];
            if (!mbouton) {return;}
            var lText=mbouton.outerHTML;
            var sTel=chBalise(lText,"data-phone");
            var mText = document.getElementsByClassName('detail-title title1')[0].innerHTML;
            var sText=sansBlanc(mText);
            if (sTel>'')	{Put_Notification("Call",sTel,1,sText);}
        };
        break;
    case 6 : // paruvendu  ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'im12_cp_form_submit btndetails14_contact a' );
        btnAppel.setAttribute( 'class', 'im12_cp_form_submit btndetails14_contact a' );
        btnAppel.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">   Appeler le numéro';
        btnAppel2.setAttribute( 'class', 'app' );
        btnParametres.setAttribute( 'class', 'im12_cp_form_submit btndetails14_contact a' );
        btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28W + '">   Paramètres CallBridge';
        var sClass=document.getElementsByClassName('btndetails14_contact tel_contact')
        sClass[0].appendChild( btnAppeler );
        sClass[0].appendChild( btnParametres );
        if (sClass.length>1) {sClass[1].appendChild( btnAppel );sClass[1].appendChild( btnParametres );}
 //     document.getElementsByClassName('head17-rappelcrit head17-rappelcrit-shrink')[ 0 ].appendChild( btnAppel );
        var sClas2=document.getElementsByClassName('imdet15-LiensContact');
        if (sClas2.length>0) sClas2[0].appendChild( btnAppel2 );

        // Clic dans le header
        var BtnHeaderApp=document.getElementById('Header_btn_app')
        BtnHeaderApp.innerHTML="Appel+";
        BtnHeaderApp.onclick=function() {jAppelle6(0)};

        // Clic sur "recherche et envoi du N° de téléphone"
        btnAppeler.onclick=function (){jAppelle6(1)};
        btnAppel.onclick=function (){jAppelle6(1)};
        btnAppel2.onclick=function (){jAppelle6(1)};

        function jAppelle6(nOuvre){
 //         if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
            var mbouton = document.getElementsByClassName('btndetails14_contact tel_contact');
//          if (mbouton.length<1)  mbouton = document.getElementsByClassName('btndetails14_contact tel_contact basauto_contact flol');
            if (mbouton.length>0 && nOuvre) {mbouton[0].firstElementChild.click();}
            setTimeout(function() {
                var Notel = document.getElementsByClassName('newpop13-numtel');
                if (Notel.length>0) {
                    var sText = document.getElementsByClassName('newpop13-limitann');
                    var mText = extraitChaine(sText[0].innerHTML,1,"<span");}
                else {
                    Notel = document.getElementsByClassName('im12_tel');
                    var sText = document.getElementsByClassName('newpop13-limitann newpop13-txtann flol');
                    var mText = (sansBlanc(chAffichages(sText[0].innerHTML)))
                }
                sText = sansRC(mText);
                if (Notel)	{Put_Notification("Call",Notel[0].firstElementChild.innerHTML,1,sText);}
                document.getElementsByClassName('fancybox-item fancybox-close')[ 0 ].click();
            }, 2000);
        };
        break;

    case 7 : // lesparticuliers  ------------------------------------------------------------------------------
       $(document).ready(function() {
           var sLien0 = document.getElementsByClassName('showNumberBtn');
           if (sLien0.length>0) {fBtnAppeler(sLien0,'showNumberBtn');}
           var sLien2 = document.getElementsByClassName('showNumber1Btn');
           if (sLien2.length>0) {fBtnAppeler(sLien2,'showNumber1Btn');}
           var sLien3 = document.getElementsByClassName('showNumber2Btn');
           if (sLien3.length>0) {fBtnAppeler(sLien3,'showNumber2Btn');}
           var sLien4 = document.getElementsByClassName('showMailBtn');
           if (sLien4.length>0) {fBtnSetting(sLien4,'showMailBtn');}
       });
        function fBtnAppeler(pLiens,pClass){
            var makers = [];
            for (let i = 0; i < pLiens.length; i++) {
                makers[i] = document.createElement( 'button' );
                makers[i].setAttribute( 'type', 'button' );
                makers[i].setAttribute( 'style', 'margin-top : 1rem;' );
                makers[i].setAttribute( 'title', 'with CallBridge');
                makers[i].innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '"> Appeler Numéro';
                makers[i].setAttribute( 'class', 'btn green icn-only poplight scrollToTopButton' );
                makers[i].style.fontWeight = '300';
                makers[i].style.display = 'block';
                //makers[i].style.backgroundColor = '#a50f78';
                makers[i].style.padding = '7px 14px';
                makers[i].style.color = 'white';
                makers[i].style.border = '0px';
                pLiens[i].appendChild(makers[i]);
                makers[i].onclick=function (){
  //                if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
                    var mbouton = document.getElementsByClassName(pClass)[i];
                    if (mbouton) {mbouton.firstElementChild.click();}
                    setTimeout(function() {
                        var Notel = pLiens[i].getElementsByClassName('btnText')[0].innerHTML;
                        var Notel2 = document.getElementsByClassName('rsva_number');
                        if  (Notel2.length>0) {var s1=extraitChaine(Notel2[0].innerHTML,2,">");Notel=extraitChaine(s1,1,"<");} // Cas 0899...
                        var sText = document.getElementById('scrollcontent');
                        var mText = sansBlanc(sText.innerHTML);
                        if (Notel)	{Put_Notification("Call",Notel,1,mText);}
                    }, 2000);
                };
            }
        }
        function fBtnSetting(pLiens,pVoir){
            var makers = [];
            for (let i = 0; i < pLiens.length; i++) {
                makers[i] = document.createElement( 'button' );
                makers[i].setAttribute( 'type', 'button' );
                makers[i].setAttribute( 'style', 'margin-top : 1rem;' );
                makers[i].innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28W + '"> Settings';
                makers[i].setAttribute( 'class', 'btn green icn-only poplight scrollToTopButton' );
                makers[i].style.fontWeight = '300';
                makers[i].style.display = 'block';
                makers[i].style.backgroundColor = '#f68c21';
                makers[i].style.padding = '7px 14px';
                makers[i].style.color = 'white';
                makers[i].style.border = '0px';
                pLiens[i].appendChild(makers[i]);

                makers[i].onclick=function (){
                    if (menuobj.style.visibility == 'hidden')  {
                        menuobj.style.visibility = 'visible';
                        document.activeElement.blur();
                        menuobj.style.transition = 'right 1s ease-in-out';
                        menuobj.style.WebkitTransition = 'right 1s ease-in-out';
                        menuobj.style.MozTransition = 'right 1s ease-in-out';
                        menuobj.style.right = '1px';
                    }
                    else {
                        menuobj.style.visibility = 'hidden';
                        document.activeElement.blur();
                    }
                };
            }
        }
        break;

    case 8 : // vivastreet.com ------------------------------------------------------------------------------
        var btnAppeler1 = document.createElement( 'button' );
        btnAppeler1.setAttribute( 'type', 'button' );
        btnAppeler1.setAttribute( 'style', 'margin-top : 0rem;' );
        btnAppeler1.setAttribute( 'title', 'with CallBridge');
        btnAppeler1.setAttribute( 'class', 'kiwii-btn kiwii-btn-large' );
        btnAppeler1.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28 + '"><a>   Appeler le numéro</a>';

        var btnAppeler2 = document.createElement( 'button' );
        btnAppeler2.setAttribute( 'type', 'button' );
        btnAppeler2.setAttribute( 'style', 'margin-top : 0rem;' );
        btnAppeler2.setAttribute( 'title', 'with CallBridge');
        btnAppeler2.setAttribute( 'class', 'kiwii-btn kiwii-btn-large' );
        btnAppeler2.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28 + '"><a>   Appeler le numéro</a>';

        btnParametres.setAttribute( 'class', 'kiwii-btn kiwii-btn-large' );
        // Création des boutons callbridge

        var cbuser = GM_getValue("cbuser", '');
        var lClass="kiwii-margin-ver-xxsmall kiwii-table-cell";
        document.getElementsByClassName(lClass)[0].appendChild( btnAppeler1 );
        document.getElementsByClassName(lClass)[1].appendChild( btnAppeler2 );
        document.getElementsByClassName(lClass)[1].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        btnAppeler1.onclick=function (){ Appeler()}
        btnAppeler2.onclick=function (){ Appeler()}

        function Appeler(){
  //        if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
  //        if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var bbouton = document.getElementsByClassName('phone_link phone_link_right')[0];
            bbouton.click();
            var mbouton = document.getElementsByClassName('vs-phone-button kiwii-font-weight-bold kiwii-position-relative kiwii-padding-left-large')[0];
            if (!mbouton) {return;}

            var lText=mbouton.outerHTML;
            var sTel=chBalise(lText,"data-phone-number");
            var mText = document.getElementsByClassName('kiwii-float-left kiwii-span-10')[0].innerHTML;
            var mText2= document.getElementsByClassName('kiwii-breadcrumbs mmlightgrey mmchevron')[0].lastElementChild.innerHTML;
            var sText1 = chBalise(mText2,"title",4);
            if (sText1==='') {sText1 = chBalise(mText2,"title",3);}
            var s1=extraitChaine(mText,2,">");sText=extraitChaine(s1,1,"<");
            if (sTel>'')	{Put_Notification("Call",sTel,1,sText+' '+sText1);}
            document.activeElement.blur();
        };
        break;

    case 9 : // topannonces.fr ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'btn-secondary w-275 h-40 blue contacterAdv w-190 w-border' );
        btnAppeler.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '"><b>   Appeler le numéro</b>';
        btnParametres.setAttribute( 'class', 'btn-secondary w-275 h-40 blue contacterAdv w-190 w-border' );
        btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28W + '"><b>   Paramètres CallBridge</b>';
        // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var lClass="span12 border-button-zone";
        var m=0;
        var mbouton = document.getElementsByClassName(lClass)[m];
        if (!mbouton) {m=1;mbouton = document.getElementsByClassName(lClass)[m];}
        if (!mbouton) return;
        document.getElementsByClassName(lClass)[m].appendChild( btnAppeler );
        document.getElementsByClassName(lClass)[m].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function (){
  //        if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
  //        if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var mbouton = document.getElementsByClassName('span12 border-button-zone')[0];
            if (mbouton) {mbouton.firstElementChild.click();}
            setTimeout(function() {
                var Notel = document.getElementsByClassName('font-15 tatiana')[1].innerHTML;
                var sText = document.getElementsByClassName('spanTitle')[0].innerHTML;
                var s1=extraitChaine(sText,3,">");var s2=extraitChaine(s1,1,"<");
                var s3=extraitChaine(sText,7,">");var s4=extraitChaine(s3,1,"<");
                if (Notel)	{Put_Notification("Call",Notel,1,s2+" "+sansBlanc(s4));}
            }, 2000);
        };

        break;
    case 10 : // zoomcar.fr ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'btn btn-flat telephone ' ); // modal-trigger
        btnParametres.setAttribute( 'class', 'btn btn-flat mail ' );
        btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28W + '"><b>   Paramètres CallBridge</b>';
        // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var lClass="contact-button";
        var m=0;
        var mbouton = document.getElementsByClassName(lClass)[m];
        if (!mbouton) {m++;mbouton = document.getElementsByClassName(lClass)[m];}
        if (!mbouton) return;

        //TEST----------------------
        var liens = document.getElementsByClassName('contact-button');
        //alert(liens.length);
        var makers = [];
        for (let i = 0; i < liens.length; i++) {
            makers[i] = document.createElement( 'button' );
            makers[i].setAttribute( 'type', 'button' );
            makers[i].setAttribute( 'style', 'margin-top : 1rem;' );
            makers[i].setAttribute( 'title', 'with CallBridge');
            makers[i].innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">   Appeler le numéro';
            makers[i].setAttribute( 'class', 'btn btn-flat telephone ' );
            makers[i].style.fontWeight = '300';
            makers[i].onclick = function ()  {jappelle10();} ;
            makers[i].style.display = 'inline-table';
            //makers[i].style.backgroundColor = '#a50f78';
            //makers[i].style.padding = '7px 14px';
            makers[i].style.color = 'white';
            makers[i].style.border = '0px';
            liens[i].appendChild(makers[i]);
        }

        document.getElementsByClassName(lClass)[1].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        function jappelle10(){
 //         if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
 //         if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var voirTelephone = document.getElementsByClassName("btn btn-flat telephone modal-trigger")[0].firstElementChild; // contact-button
 //         voirTelephone.setAttribute("class","btn btn-flat telephone");
            voirTelephone.click();
            setTimeout(function() {
                var sTel  = document.getElementById("telephone-contact-detail-content").firstElementChild.innerHTML;
                var sText = document.getElementsByClassName('sixteen-columns row title-price')[0].childNodes;
                var nText = sText[1].childNodes, xText=sansBlanc(sText[1].innerHTML);
                var yText=sansSpan(xText);sText=sansRC(yText);
                if (sTel)	{Put_Notification("Call",sTel,1,sText);}
                var fermeTelephone = document.getElementsByClassName('modal-action modal-close waves-effect waves-green btn-flat')[1];
                fermeTelephone.click();
            },2000);
            setTimeout(function() {
                var fermeDernier = document.getElementsByClassName('modal-content');
                // alert(fermeDernier[3].innerHTML);
                fermeDernier[3].firstElementChild.click();
            },5000);
        }
        break;
    case 11 : // LaCentrale ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'btnRed' );
        btnAppel.setAttribute( 'class', 'btnRed' );
        btnAppeler.style.width = "180px";
        btnAppel.setAttribute( 'style', 'width : 235px;' );
        btnParametres.setAttribute( 'style', 'width : 235px;' );
        btnParametres.setAttribute( 'class', 'btnRed' );
        btnParametres.innerHTML = '<img style="vertical-align: middle; margin-left : 0.2rem; margin-right : 0rem;" src="'+ Imgsettings28W + '">   Settings CallBridge    ';
        btnAppel.innerHTML = '<img style="vertical-align: middle; ; margin-left : 0.4rem; margin-right : 0.4rem;" src="'+ Imgicon28W + '">  Appeler le numéro      ';
        btnAppeler.innerHTML = '<img style="vertical-align: middle; ; margin-left : 0.4rem; margin-right : 0.4rem;" src="'+ Imgicon28W + '">  Appeler le numéro';
        // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var mBox = document.getElementsByClassName("boxContent");
        if (mBox.length>0) {mBox[0].appendChild( btnAppeler );mBox[0].appendChild( btnParametres );}
        if (mBox.length>1) {mBox[1].appendChild( btnAppel );mBox[1].appendChild( btnParametres );}

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function (){ jAppelle11() }
        btnAppel.onclick=function (){ jAppelle11() }
        function jAppelle11(){
 //         if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
 //         if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var sTel = document.getElementsByClassName("phoneNumber1")[0].firstElementChild.innerHTML;
            var sText = document.getElementsByClassName("iophfzp")[0].firstElementChild.innerHTML;
            sText += " "+document.getElementsByClassName("versionTxt txtGrey7C sizeC mB10 hiddenPhone")[0].innerHTML;
            sText += " "+document.getElementsByClassName("kmTxt sizeC")[0].innerHTML;
            sTel = sansBlanc(sansSpan(sTel));sText = sansBlanc(sansSpan(sText));
            if (sTel)	{Put_Notification("Call",sTel,1,sText);}
        };
        break;
    case 12 : // occasion.autoplus.fr ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'pa-btn js-show-phone' );
        btnParametres.setAttribute( 'class', 'pa-btn js-show-phone' );
        btnParametres.innerHTML = '<img src="'+ Imgsettings28 + '">Settings CallBridge';
        // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var lClass="pa-contact";
        var m=0;
        var mbouton = document.getElementsByClassName(lClass)[m];
        if (!mbouton) {m++;mbouton = document.getElementsByClassName(lClass)[m];}
        if (!mbouton) return;
        document.getElementsByClassName(lClass)[m].appendChild( btnAppeler );
        document.getElementsByClassName(lClass)[m].appendChild( btnParametres );

        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function (){
  //        if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
  //        if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var sTel = document.getElementsByClassName("pa-btn  js-phone")[1].innerHTML;
            var sText = document.getElementsByClassName("pa-make-model")[0].innerHTML;
            sText += " "+document.getElementsByClassName("pa-car")[0].innerHTML;
            sText += " "+document.getElementsByClassName("avg-quotation__price")[0].innerHTML;
            sTel = sansBlanc(sansSpan(sTel));sText = sansBlanc(sansSpan(sText));
            if (sTel)	{Put_Notification("Call",sTel,1,sText);}
        };
        break;
    case 13 : // http://occasion.321auto.com ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'btn bold' );
        btnAppel.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">   Appeler le numéro';
        btnAppel.setAttribute( 'class', 'btn lsearch bold' );
        btnParametres.setAttribute( 'class', 'btn bold' );
        btnParametres.innerHTML = '<img src="'+ Imgsettings28 + '">Settings CallBridge';
        // Création des boutons callbridge
        var cbuser = GM_getValue("cbuser", '');
        var mBox2 = document.getElementsByClassName("contact_action2");
        if (mBox2.length>0) {mBox2[0].appendChild( btnAppeler );mBox2[0].appendChild( btnParametres );}
        var mBox = document.getElementsByClassName("contact_action");
        if (mBox.length>0) {mBox[0].appendChild( btnAppel   );}
        // Clic sur "appeler le  numéro"
        btnAppeler.onclick=function (){ jAppelle13() }
        btnAppel.onclick=function (){   jAppelle13() }

        function jAppelle13(){
  //        if (cbuser<=' ') {menuobj.style.visibility = 'visible';return;}
  //        if (menuobj.style.visibility=='visible') {menuobj.style.visibility='hidden';}
            var voirTelephone = document.getElementsByClassName("bouton btn-red")[0].firstElementChild;
            voirTelephone.click();
            setTimeout(function() {
                var sTel = document.getElementsByClassName("phone")[0].innerHTML;
                var mText = document.getElementById("DetailHeader").innerHTML;
                var sText = document.getElementsByTagName("h1")[0].innerHTML;
                sText += " "+document.getElementsByTagName("p")[0].innerHTML;
                sTel = sansBlanc(sansSpan(sTel));sText = sansBlanc(sansSpan(sText));
                if (sTel)	{Put_Notification("Call",sTel,1,sText);}
            },2000);
        };
        break;
    case 14 : // pagesjaunes/carte ------------------------------------------------------------------------------
        btnAppeler.setAttribute( 'class', 'icon icon-liste' );
        var cbuser = GM_getValue("cbuser", '');
        document.getElementsByClassName("outils")[0].appendChild( btnAppeler );
        btnAppeler.onclick=function(){
            var lTel = document.getElementsByClassName("item bi-contact-tel")[0].innerHTML;
            var sTel = chBalise(lTel,"title");
  //        alert(lTel+" ++++++  "+sTel+" ==== "+sTel.length);
            if (sTel.length>20) sTel = chBalise(lTel,"title",2);
            var lText = document.getElementsByClassName("bloc-denom")[0].innerHTML;
            var sText = chAffichageClass(lText,"denom")+' '+chAffichageClass(lText,"streetAddress")+' '+chAffichageClass(lText,"postalCode")+' '+chAffichageClass(lText,"addressLocality");
            if (sTel)	{Put_Notification("Call",sTel,1,sText);} else {alert("Sans n° Tel+ "+sText)}
        }
        break;
    case 15 : // getcallbridge
        btnParametres.setAttribute( 'class', 'uncode_text_column' );
        var cbuser = GM_getValue("cbuser", '');
        document.getElementsByClassName("paramCB")[0].appendChild( UneLigne );
        document.getElementsByClassName("paramCB")[0].appendChild( btnParametres );
 //     document.getElementsByClassName("paramCB")[0].appendChild( UneLigne );
        break;

    case 16 : // salesflare : Contacts

        btnParametres.innerHTML = '<img style="vertical-align: middle;" src="'+ Imgsettings28 + '">cb';
        btnParametres.setAttribute( 'class', 'icon-36 md-font material-icons sf-icon-add' );

        var els = document.getElementsByClassName("no-touch");
        for (var i=0;i<els.length;i++) {
            els[i].onclick=function(){jAppelle16()};
        };
        var els = document.getElementsByClassName("md-no-style md-button md-ink-ripple");
        for (var i=0;i<els.length;i++) {
            els[i].onclick=function(){jAppelle16()};
        };
        // ouverture d'un contact
        function jAppelle16(){
            setTimeout(function() {
                var els = document.getElementsByClassName("md-no-style md-button md-ink-ripple");
                for (var i=0;i<els.length;i++) {
                    if (els[i].outerHTML.indexOf("callPerson(")>0) {els[i].onclick=function(){jAppelle16_1()}}          // Ajout de l'action CALL:
                    if (els[i].outerHTML.indexOf('aria-label="Contacts"')>0) {
                        var tlb = document.getElementsByClassName("md-toolbar-tools");
                        if (tlb.length>2) tlb[2].appendChild( btnParametres );                                          // Ajout bouton settings "md-toolbar-tools"
                    }
                };
            },1000);
        }
        // clic sur le téléphone
        function jAppelle16_1(){
            var sText='?', sTel='';
            var els=document.activeElement.attributes;
            for (var i=0;i<els.length;i++) {
                if (els[i].name=="aria-label") sTel=els[i].value;
            };
            var els = document.getElementsByClassName("ellipsis flex");
            for (var i=0;i<els.length;i++) {
                sText=els[i].innerHTML;
            };
            if (sTel) {Put_Notification("Call",sTel,2,sText);}
            jAppelle16();
        }
        break;
    case 17 : // www.tripadvisor.fr  ------------------------------------------------------------------------------
   //   btnAppel.setAttribute( 'class', 'ui_icon phone' );
        var nPhone=document.getElementsByClassName("heading_title");
        if (nPhone.length>0) {
            nPhone[0].appendChild( UnBlanc );
            nPhone[0].appendChild( btnAppel );
            btnAppel.onclick=function(){ jAppelle17() };
        };
        var xPhone=document.getElementsByClassName("ui_icon phone");
        if (xPhone.length>0) {
        //  xPhone[0].setAttribute=('title','with CallBridge');
            xPhone[0].onclick=function(){ jAppelle17() };
        };
        function jAppelle17(){
            var mbouton = document.getElementsByClassName('blEntry phone');
            var sTel=chAffichages(mbouton[0].innerHTML);
            var mtexte = document.getElementsByClassName('heading_title');
            var sText=chAffichages(mtexte[0].outerHTML);
            var mtext2 = document.getElementsByClassName('blEntry address  clickable colCnt2');
            if (mtext2) sText+=chAffichages(mtext2[0].outerHTML);
            // alert("Call "+sTel+" "+sText);
            if (mbouton)  {Put_Notification("Call",sTel,1,sText);}
        };

        break;
    case 18: // http://www.directmandat.com/ safti.fr  ------------------------------------------------------------------------------
        var sRc=String.fromCharCode(10);
        var mOnglets = document.getElementsByClassName('detaOnglets');
        var makers = [];
        for (var i=0;i<mOnglets.length;i++) {

            var mOnglet=document.getElementsByClassName('detaOnglets')[i];
            var mText=document.getElementsByClassName('detaTexts')[i];
            var lTexte=chAffichages(mText.outerHTML);
            var sTel=extraitChaine(lTexte,2,sRc);sTel=sansEspace(sTel);


            makers[i]=document.createElement('button');
            makers[i].setAttribute( 'type', 'button' );
            makers[i].setAttribute( 'style', 'margin-top : 1rem;' );
            makers[i].setAttribute( 'title', sTel);
            makers[i].innerHTML = '<img style="vertical-align: middle;" src="'+ Imgicon28W + '">'+sTel;
            makers[i].onclick=function () {Put_Notification("Call",sTel,1,"") };

            mText.outerHTML=mText.outerHTML.replace(sTel,'<a href="callto:'+sTel+'" title="Callbridge:'+sTel+'";>'+sTel+'</a>');
//          mOnglet.append(makers[i]);

        };
        break;

};


// ========================================================= utilitaires ==================================================================== utilitaires =========================================
// ========================================================= utilitaires ==================================================================== utilitaires =========================================



// Voir la fenetre Settings
btnParametres.onclick = function () {
    if (ParamOuvert==0) { CreatSettings();}
    if (menuobj.style.visibility == 'hidden')  {
        menuobj.style.visibility = 'visible';
        document.activeElement.blur();
        menuobj.style.transition = 'right 1s ease-in-out';
        menuobj.style.WebkitTransition = 'right 1s ease-in-out';
        menuobj.style.MozTransition = 'right 1s ease-in-out';
        menuobj.style.right = '1px';
    }
    else {
        menuobj.style.visibility = 'hidden';
        document.activeElement.blur();
    }
};

// retourne la balise et la valeur sous la forme : <Balise  xsd:type="xsd:string">Valeur</Balise>
function AjBalise(pBalise,pValeur,pExt) {
    var sValeur=encodeURIComponent(pValeur);
    if (pExt) sValeur=encodeURIComponent(sValeur);
	var sRetour = "<"+pBalise+"  xsd:type=\"xsd:string\" >"+sValeur+"</"+pBalise+">";
	return sRetour;
}

// Prépare la requete Put_Notification (call ou sms) à envoyer par SendHttp
function Put_Notification(pCallSms,pPhone,pImmediat,pText,pCheck) {
    if (pCheck && pCheck==1) {
        var cbcallto=GM_getValue("cbcallto",'');
        if (cbcallto==true) return '';
    }
    if (pPhone.indexOf(";")>7) pPhone=extraitChaine(pPhone,1,";");
    var nPhone=leNumerique(pPhone), cPayant='';
    if (nPhone.indexOf("089")==0 || nPhone.indexOf("3389")==0|| nPhone.indexOf("+3389")==0 || nPhone.indexOf("003389")==0) {cPayant=' payant.';}
    if (pCallSms.lastIndexOf("!")>=0 || pImmediat==2)      {AfficheToast(pPhone+"<br>"+pText);return;}
    if (cPayant>'') pImmediat=0;
    var cbuser = GM_getValue("cbuser", '');
    var cbpassword = GM_getValue("cbpassword", '');
    if (pPhone<=' ') return;
    if (!pText || pText<' ') pText="Call from callbridge ..monkey";
    var requete="";
    requete="<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/1999/XMLSchema\"><soap:Body>";
    requete += AjBalise("pLogin",cbuser);		    	   // Login du compte CallBridge
    requete += AjBalise("pPass",cbpassword);				// Password du compte CallBridge
    requete += AjBalise("pDatetime",TheDateTime() );		// Renvoie sous forme :AAAAMMJJhhmmss  Ex: 20170120093425 pour le 20/01/2017 à 09h34m25s
    requete += AjBalise("pImmediate",pImmediat);			// 1 = appel immédiat    0 = affichage (pour action manuelle de l'utilisateur)
    requete += AjBalise("pRecipients","");			     	// Nom de l'utilisateur (smartphone) qui doit rappeler
    requete += AjBalise("pTitle","CallBridge");				// Titre de la notification
    requete += AjBalise("pPhones",PlusEnDol(pPhone+cPayant));// Les n° de téléphone à appeler
    requete += AjBalise("pText",pText,1);		            // Texte optionnel pour l'appelant (Ext)
    requete += AjBalise("pPost","monkey");					// Poste ayant envoyé la notification
    requete += "</soap:Body></soap:Envelope>";
    var sFonction="Put_Notification_"+pCallSms;
    SendHttp(requete,sFonction,AfficheError,pPhone+"<br>"+pText);	// Envoi de la requete en XML et le nom du Service à contacter
}

// Envoi HTTP effectif en POST (Free ou Pro)
function SendHttp(pRequete,pService,pCallBack,pMess) {
	var params = 'xml='+pRequete+'&action='+"urn:CallBridgeProApi/"+pService;
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST","https://www.mcleed.net/CallBridgeProApi_WEB/awws/CallBridgeProApi.awws",true);

	// au retour de la fonction on indique combien sont envoyés
	xmlhttp.onreadystatechange = function() {
	//	alert("Rd:"+xmlhttp.readyState+" st:"+xmlhttp.status+"  tx:"+xmlhttp.statusText )
		if (xmlhttp.readyState==4 && xmlhttp.status==200 ) {
			var lRetour = xmlhttp.responseText,tChaine=[],tReponse=[];
            if (lRetour.indexOf(":Fault>")>1) {tReponse[0]='Erreur de caractère UTF8';alert(lRetour)} else {tChaine = lRetour.split("Result>");tReponse = tChaine[1].split("</");}
			if (pCallBack)	{pCallBack(tReponse[0],pMess);}
  	}	};
	xmlhttp.send(params);
}

// Affiche OK ou OK de sendHttp Erreur ou Compte rendu
function AfficheError(pErreur,pMessage){
	var tMots = pErreur.split('/*');
    var sErreur = tMots[0], lAffiche="";
    if (tMots.length>1) sErreur+=" "+tMots[1];
	if (pErreur.substr(0,2)=="KO") {lAffiche=pErreur;} else {lAffiche=sErreur;}
	var sRc="<br/>";
	sErreur=lAffiche.replace(/;/g,sRc);
    if (pMessage) sErreur+=" : "+pMessage
    AfficheToast(sErreur);
}

// Retourne la date et heure locale sous la forme AAAAMMJJhhmmss
function TheDateTime(){
	var ladate=new Date();
	var Y=ladate.getFullYear();
	var M=ladate.getMonth()+1;
	if (M<10) {M = "0" + M;}
	var D=ladate.getDate();
	if (D<10) {D = "0" + D;}

	var h=ladate.getHours();
	if (h<10) {h = "0" + h;}
	var m=ladate.getMinutes();
	if (m<10) {m = "0" + m;}
	var s=ladate.getSeconds();
	if (s<10) {s = "0" + s;}
	return Y+""+M+""+D+""+h+""+m+""+s;
}

//Menu Icone theme
var headers = document.getElementsByTagName('h2');
var menu =  '<li class="uppercase bold trackable" style="text-align: center;text-transform: uppercase;font-weight: 700;">CallBridge Settings</li><br>';
    menu += '<li>User (email):</li><li><input type="text" id="cbmail" name="email" style="font-size:14px"></li><br>';
    menu += '<li>Password:</li><li><input type="password" id="cbpassword" name="Password"></li><br>';
    menu += "<FORM><INPUT type='checkbox' id='cbcallto' name='cbcallto' value=1>Without notification for 'callto:'<br><br></FORM>"
    menu += '<li><button id="cbenregistre" type="button" title="Register Login and Password">SAVE</button> ';
    menu += '<button id="cbessai" type="button" title="Send a test notification to the smartphone">Test</button> ';
    menu += '<button id="cbclose" type="button" title="Close the settings">Close</button></li>';
    menu += "<p><br><a href='https://getcallbridge.com/fr/appelez-directement-depuis-vos-sites-preferes-avec-callbridge' target='_blank' title='Free User? Click here to subscribe to this plugin'>Go to CallBridge's website</a></p>";
    menu += "<p><br><a href='https://www.mcleed.net/CallBridgeProWeb?mailto=mcleed.fr@gmail.com%Suite ' target='_blank' title='if the plugin does not work anymore on this site'>Mail to the WebMaster</a></p>";
    menu += "<p  style='text-align: center;font-weight:90;font-size:12px;'><br>nb : Alt+X or Alt+Y to send the highlighted text</p>";
    menu += "<p  style='text-align: center;font-weight:90;font-size:12px;'><br>(version "+sVersion+")</p>";
    menu=menu.replace("%Suite","&Login="+GM_getValue("cbuser",'')+"&Titre=probleme+plugin"+"&Sujet=un+site+ne+fonctionne+plus"+"&Message="+document.location.href);

// Creation menu Setting Create menu
function CreatSettings(){
    if (menu !== '') {
        menuobj = document.createElement('ul');
        menuobj.style.position = 'fixed';
        menuobj.style.top = '57px';
        menuobj.style.right = '-200px';
        menuobj.style.padding = '25px';
        menuobj.style.backgroundColor = '#fff';
        menuobj.style.zIndex = '6535';
        //menuobj.style.border = 'solid 3px #f56b2a';
        menuobj.style.boxShadow = '0 0 3rem rgba(48,48,48,0.4)';
        menuobj.innerHTML = menu;
        menuobj.style.visibility = 'hidden';
        body = document.getElementsByTagName('body')[0];
        body.appendChild(menuobj);
        var cbuser = document.getElementById('cbmail');
        cbuser.value = GM_getValue("cbuser", '');
        var cbpassword = document.getElementById('cbpassword');
        cbpassword.value = GM_getValue("cbpassword", '');
        var cbcallto = document.getElementById('cbcallto');
        cbcallto.checked = GM_getValue("cbcallto", '');
        ParamOuvert=1;
        // sortie de cbmail avec changement : choix automatique Pro/Free 1/2
        cbmail.onchange = function (){
        //    SaveLogin();
        //    Get_Verif_Email();
        };
        // enregistrer les login et password
        cbenregistre.onclick = function () {
            SaveLogin();
            Get_Verif_Email();
            menuobj.style.visibility = 'hidden';
            location.reload();
        };
        // essai d'envoi par callbridge
        cbessai.onclick = function () {
            Put_Notification("Call","0607080910",0);
            menuobj.style.visibility = 'hidden';
        };
        // essai d'envoi par callbridge
        cbclose.onclick = function () {
            menuobj.style.visibility = 'hidden';
        };
    }
}



// Toast <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
var toast='<li id="cbtoast" style="text-align: center;font-weight: 90;">Event Created</li>';
// Create toast
if (toast !== '') {
    toastobj = document.createElement('ul');
    toastobj.style.position = 'fixed';
    //toastobj.style.top = '100px';
    //toastobj.style.right = '10px';
    //toastobj.style.padding = '25px';
    toastobj.style.minWidth = '250px';
    toastobj.style.bottom = '-30px';
    toastobj.style.marginLeft = '-125px';
    toastobj.style.left = '50%';
    toastobj.style.padding = '16px';
    toastobj.style.textAlign = 'center';
    toastobj.style.borderRadius = '2px';
    toastobj.style.backgroundColor = '#333';
    toastobj.style.color = '#fff';
    toastobj.style.zIndex = '15';
    toastobj.style.boxShadow = '0 0 3rem rgba(48,48,48,0.4)';
    toastobj.innerHTML = toast;
    toastobj.style.visibility = 'hidden';
    body = document.getElementsByTagName('body')[0];
    body.appendChild(toastobj);
}

// Affiche le Toast
function AfficheToast(pText) {
//  var sText=pText.replace("<br>",String.fromCharCode(10))
//  chrome.notifications.create("callbridge",{type:"basic",iconUrl:Imgsettings28W,title:sPopupTitle,message:sText});
    var cbtoast = document.getElementById('cbtoast');
    cbtoast.innerHTML=pText;
    toastobj.style.visibility = 'visible';
    toastobj.style.transition = 'bottom 1s ease-in-out';
    toastobj.style.WebkitTransition = 'bottom 1s ease-in-out';
    toastobj.style.MozTransition = 'bottom 1s ease-in-out';
    toastobj.style.bottom = '70px';
    setTimeout(function() {
        toastobj.style.transition = 'bottom 1s ease-in-out';
        toastobj.style.WebkitTransition = 'bottom 1s ease-in-out';
        toastobj.style.MozTransition = 'bottom 1s ease-in-out';
        toastobj.style.bottom = '-70px';
    },1500);
}

// Préparer la requete pour Get_Verif_Email
function Get_Verif_Email(){
   var cbuser = GM_getValue("cbuser",'');
   var cbpassword = GM_getValue("cbpassword",'');
   var requete;
   requete="<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/1999/XMLSchema\"><soap:Body>";
   requete += AjBalise("pDatetime",TheDateTime() );			// Renvoie sous forme :AAAAMMJJhhmmss  Ex: 20170120093425 pour le 20/01/2017 à 09h34m25s
   requete += AjBalise("pEmail",cbuser);		   			// Login du compte CallBridge
   requete += AjBalise("pLang","?");						// en anglais
   requete += "</soap:Body></soap:Envelope>";
   SendHttp(requete,"Get_Verif_Email",MailExiste);		// Envoi de la requete en XML et le nom du Service à contacter
}

// Retour Http
function MailExiste(pTexte){
    if (pTexte.substring(0,2)=="KO") {AfficheToast("KO this email address does not exist");}
}

function SaveLogin(){
   var cbuser = document.getElementById('cbmail');
   GM_setValue("cbuser", cbuser.value);
   var cbpassword = document.getElementById('cbpassword');
   GM_setValue("cbpassword", cbpassword.value);
   var cbcallto = document.getElementById('cbcallto');
   GM_setValue("cbcallto",cbcallto.checked);
}

function chBalise(pText,pBalise,pNeme){
    var sBalise=pBalise+'="',nNeme=1, n=0;
    var iDeb=0, iFin=0, F=1, L=sBalise.length;
    if (pNeme) {nNeme=pNeme;}
    for (i=0;i<pText.length;i++)
        if (F==1 && pText.substr(i,L)==sBalise)      {iDeb=i+L;n++;if (n==nNeme) F=2;}
    if (iDeb<1) return '';
    for (i=iDeb;i<pText.length;i++)
        if (F==2 && pText.substr(i,1)=='"')           {iFin=i;F=3;}
    if (iFin===0) return '';
    var i=iFin-iDeb;
    return pText.substr(iDeb,i);
}

// On enlève les blancs devant et derrière
function sansBlanc(pText){
    var d=0,f=0,sRc=String.fromCharCode(10),sNl=String.fromCharCode(13),sortie='';

    // les RC remplacés en blanc
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,1)==sRc)  {sortie+=' ';} else {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // les blancs non sécables sont remplacés
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,6)=='&nbsp;')  {sortie+=' ';i+=5;} else {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // les doubles blancs en 1 blanc
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,2)!='  ')  {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // les <br> sont remplacés
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,4)=='<br>')  {sortie+='; ';i+=3;} else {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // on délimite
    for (i=0;i<pText.length;i++) {
        if (pText.substr(i,1)==' ' || pText.substr(i,1)==sRc || pText.substr(i,1)<"!")  {d=i;} else {d=i;i=pText.length;}}
    for (i=pText.length;i>0;i--) {
        if (pText.substr(i,1)==' ' || pText.substr(i,1)==sRc || pText.substr(i,1)<"!")  {f=i;} else {f=i;i=0;}}

    return pText.substr(d,f-d+1);
}

// On enlève les RC/NL
function sansRC(pText){
    var sRc=String.fromCharCode(10),sNl=String.fromCharCode(13),sortie='';
    for (i=0;i<pText.length;i++) {
        if (pText.substr(i,1)==sRc || pText.substr(i,1)==sNl)  {sortie+=' ';} else {sortie+=pText.substr(i,1);}}
    return sortie;
}

// on divise la chaine pText avec le séparateur (",")
function extraitChaine(pText,pIndice,pSep){
    var sChaines=[], j0=1, L=pSep.length, s1='',i0=0;
    sChaines[j0]='';sChaines[pIndice]='';
    for (i0=0;i0<pText.length;i0++) {
        if (pText.substr(i0,L)==pSep)  {j0++;sChaines[j0]='';} else {sChaines[j0]+=pText.substr(i0,1);}
    }
    if (sChaines[pIndice]==='') {s1=' ';} else {s1=sChaines[pIndice].replace("&nbsp;"," ");}
    return s1;
}

// Sans Espaces devant et derrière
function sansEspace(pText){
    var s1='', i0=0, j0=0, k0=0;
    // Dernier non blanc
    for (i0=0;i0<pText.length;i0++) {
        if (pText.substr(i0,1)>" ")           {k0=i0};
    }
    // les non blancs de l'intérieur
    for (i0=0;i0<=k0;i0++) {
        if (pText.substr(i0,1)>" ") {j0=1};
        if (j0>0) {s1+=pText.substr(i0,1)};
    }

    return s1;
}


// Tout ce qui est affiché <balise>..affiché..</balise>
function chAffichages(pText){
    var j0=0,k0=0,sortie='',sText2='',sText3='',i0=0;
    for (i0=0;i0<pText.length;i0++){
        if (pText.substr(i0,1)=='>')  {k0=1;j0=1;i0++;}
        if (pText.substr(i0,1)=='<')  {k0=1;j0=0;i0++;}
        if (j0==1 && pText.charCodeAt(i0)!='9') sortie+=pText.charAt(i0);
    }
    if (k0=0) sortie=pText;
    do {
      sText3=sortie;
      sText2=sortie.replace("&amp;","&");sortie=sText2;
      sText2=sortie.replace("&nbsp;"," ");sortie=sText2;
    } while (sortie!=sText3)

    return sortie;
}

// Tout ce qui est affiché pour la class xxx   :   <balise class="xxx">..affiché..</balise>
function chAffichageClass(pText,pClass){
    var j=0,k=0,sortie='',sText2='';
    var iDebut = pText.indexOf(pClass);
    if (iDebut<0) return '';
    for (i=iDebut;i<pText.length;i++){
        if (pText.substr(i,1)=='>' && j==0)  {j=1;i++;}
        if (pText.substr(i,1)=='<')  {j=2;i++;}
        if (j==1) sortie+=pText.substr(i,1);
    }
    sText2=sortie.replace("&amp;","&");sortie=sText2;
    sText2=sortie.replace("&amp;","&");sortie=sText2;
    return sortie;
}

// Sans les balises <span>  et <i> .. </i>  et les NL
function sansSpan(pText){
    var sortie='',enSpan=0;
    // On enlève les <span>
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,6)=='<span>')  {sortie+=' ';i+=5;} else {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // On enlève les </span>
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,7)=='</span>')  {sortie+=' ';i+=6;} else {sortie+=pText.substr(i,1);}
    pText=sortie;sortie='';

    // On enlève les <span .. >
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,6)=='<span ')  {
            sortie+=' ';i+=5;enSpan=1;}
        else {
            if (enSpan==1 && pText.substr(i,1)==">" ) {i++;enSpan=0;}
            if (enSpan===0) sortie+=pText.substr(i,1);
        }
    pText=sortie;sortie='';enSpan=0;

    // On enlève les <i .. </i>
    for (i=0;i<pText.length;i++)
        if (pText.substr(i,3)=='<i ' || pText.substr(i,3)=='<i>')  {
            sortie+=' ';i+=2;enSpan=1;}
        else {
            if (enSpan==1 && pText.substr(i,4)=="</i>" ) {i+=4;enSpan=0;}
            if (enSpan===0) sortie+=pText.substr(i,1);
        }

    return sortie;
}

// Donne la 1ère partie numérique
function leNumerique(pText,pDeb){
  var cars='',car1='',nums='',fin=0,car='',nl=String.fromCharCode(10);
  if (!pText) return '';
  if (!pDeb || pDeb<0) pDeb=0;
  for (i=pDeb,l=pText.length;i<l;i++){
    car=pText.substr(i,1);fin=0
    if (car==' ' || car=='.')              continue;
    if (car=='+' && cars=='')              {car1='00';continue}        // débuter par le caractere + = 00
    if (car>='0' && car<='9')              {cars+=car1+car;car1='';continue}    // le caractere est numérique
    if (car=='(' && cars.length>4)         fin=1                       // fin : parenthese trop loin
    if (car>'9'  && cars>'' || car==nl)    fin=1                       // fin : caractère alpha après des car num
    if (fin==1 && cars.length>nums.length) {nums=cars;}                // on prend le plus long numérique
    if (fin==1 && nums>' ' && pDeb>0)      break;                      // sortir si une position de départ a été demandée (et n° tel trouvé)
    if (fin==1)                            {cars='';car1=''}           // maz
  }
  if (cars.length>nums.length)             nums=cars;
  return nums;
}

// Extraire le N° de telephone nommé Tel ou Tél ...
function leNumTel(pText){
  var sTel='',i=pText.length;
  var iPos=pText.indexOf("tel");
  if (iPos<0)  iPos=pText.indexOf("Tel");
  if (iPos<0)  iPos=pText.indexOf("tél");
  if (iPos<0)  iPos=pText.indexOf("Tél");
  if (iPos<0)  iPos=pText.indexOf("TEL");
  return leNumerique(pText,iPos);
}

// Texte entre x .. y
function texteEntre(pText,pGauche,pDroite){
    var iDeb=pText.indexOf(pGauche);
    if (iDeb<0) return '2!'+pGauche+'!'+pText;
    var iFin=pText.indexOf(pDroite,iDeb);
    if (iFin<0) return '3'+pDroite+'!'+pText;
    iDeb+=pGauche.length;
    return pText.substring(iDeb,iFin);
}

// controle AltX AltY pour envoi vers callbridge
function keydown(e){
    if (e.keyCode==18)                {nAlt=1;return ''}   // ALT
    if (!nAlt==1)                     {nAlt=0;return ''}  // pas ALT
    if (e.keyCode<88 || e.keyCode>89) {nAlt=0;return ''}  // ni alt+x ni alt+y
    var sText = window.getSelection().toString();
//    alert(sText);return '';
    if (sText<='')                    {nAlt=0;return ''}  // pas de texte surligné
    var sTel=leNumTel(sText);
    if (sTel=="") {sTel=".";var sCall="Info"} else {var sCall="Call"}
    if (e.keyCode==88) {Put_Notification(sCall,sTel,1,sText,0)}; // envoyer  le Call AltX
    if (e.keyCode==89) {Put_Notification(sCall,sTel,0,sText,0)}; // afficher le Call AltY
    nAlt=0;
}

function jAppelle01(){
//  alert(document.activeElement.outerHTML);
    var sTel=texteEntre(document.activeElement.outerHTML,':','"');
    var sText=chAffichages(document.activeElement.parentElement.innerHTML);
    if (sTel>'')  {Put_Notification("Call",sTel,1,sText,1);}
}

function PlusEnDol(pText){
  var sText2=pText.replace("+","$")
  return sText2;

}

