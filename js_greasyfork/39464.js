// ==UserScript==
// @name            GMail Compact-View with Buttons and Search
// @name:pl         GMail - kompaktowy widok z przyciskami i paskiem wyszukiwania
// @author          Jimi
// @namespace       https://greasyfork.org/pl/users/174756-jimi
// @version         1.15beta
// @description     Add buttons to hide sidebar and topbar, inbox and compose. Some css changes
// @description:pl  Dodaje przyciski do ukrycia paska bocznego i górnego, skrzynki odbiorczej oraz nowej wiadomości. Trochę zmian w css
// @grant           GM_listValues
// @require         http://code.jquery.com/jquery-latest.js
// @include         /^https?:\/\/mail\.google\.com(?:.*)$/
// @downloadURL https://update.greasyfork.org/scripts/39464/GMail%20Compact-View%20with%20Buttons%20and%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/39464/GMail%20Compact-View%20with%20Buttons%20and%20Search.meta.js
// ==/UserScript==
/* global $ */
$(window).on("load", function() {

  function setCookie(name, val, days, path, domain, secure) {
    if (navigator.cookieEnabled) {
        const cookieName = encodeURIComponent(name);
        const cookieVal = encodeURIComponent(val);
        let cookieText = cookieName + "=" + cookieVal;
        if (typeof days === "number") {
            const data = new Date();
            data.setTime(data.getTime() + (days * 24*60*60*1000));
            cookieText += "; expires=" + data.toGMTString();
        }
        if (path) {
            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;
    }
  }
  function getCookie(name) {
    if (document.cookie != "") {
        const cookies = document.cookie.split(/; */);
        for (let i=0; i<cookies.length; i++) {
            const cookieName = cookies[i].split("=")[0];
            const cookieVal = cookies[i].split("=")[1];
            if (cookieName === decodeURIComponent(name)) {
                return decodeURIComponent(cookieVal);
            }
        }
        return false;
    }
  }
  function deleteCookie(name) {
    const cookieName = encodeURIComponent(name);
    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  const languages = ['pl', 'en'];
  var sideBarText = [], topBarText = [], inboxButtonText = [], composeButtonText = [], posBarLeftText = [], posBarRightText = [], settingsMenuText = [], setFormMBR = [], setFormTitle = [], setFormMBRTS = [],
      setFormSPC = [], setFormHBOS = [], setFormCA = [], setFormCF = [], setFormSBHW = [], setFormSBBG = [], setFormSBC = [], setFormSBHC = [],
      setFormBtnReset = [], setFormBtnResetTitle = [], setFormBtnSave = [], setFormBtnSaveTitle = [], setFormBtnCancel = [], setFormBtnCancelTitle = [],
      setFormTmplStyle = [];

  //config --------------------------
  var myBarRight = (getCookie('myBarRight')) ? getCookie('myBarRight') : 450; //try to change the right margin of div with buttons; default: 450
  var myBarRightTopShow = (getCookie('myBarRightTopShow')) ? getCookie('myBarRightTopShow') : 150;
  var showPosControls = (getCookie('showPosControls') == 'true') ? true : false; //default: false
  var hideBarsOnStart = (getCookie('hideBarsOnStart') == 'false') ? false : true; //default: true
  var cssAdd = (getCookie('cssAdd') == 'false') ? false : true; //default: true
  var cssFont = (getCookie('cssFont')) ? getCookie('cssFont') : "Neuton, monospace"; // eg. Domina, Exo 2, Play, Neuton...
  var sideBarHiddenWidth = (getCookie('sideBarHiddenWidth')) ? getCookie('sideBarHiddenWidth') : 25;
  var sideBarBackground = (getCookie('sideBarBackground')) ? getCookie('sideBarBackground') : "steelblue";
  var sideBarColor = (getCookie('sideBarColor')) ? getCookie('sideBarColor') : "white";
  var sideBarHighlightColor = (getCookie('sideBarHighlightColor')) ? getCookie('sideBarHighlightColor') : "navy";
  var tmplBlackStyle = (getCookie('tmplBlackStyle')) ? getCookie('tmplBlackStyle') : false;

  //config - languages, tooltips texts
  //english
  sideBarText.en = "Show/Hide SideBar";
  topBarText.en = "Show/Hide TopBar";
  inboxButtonText.en = "INBOX";
  composeButtonText.en = "Compose";
  posBarLeftText.en = "Move bar LEFT. Current value: ";
  posBarRightText.en = "Move bar RIGHT. Current value: ";
  settingsMenuText.en = "My BARs settings";
  setFormTitle.en = "BARs settings";
  setFormMBR.en = "Right margin of div with buttons";
  setFormMBRTS.en = "Right margin of div with buttons when Top is show";
  setFormSPC.en = "Show position controls";
  setFormHBOS.en = "Hide BARs on start";
  setFormCA.en = "Add some CSS entries";
  setFormCF.en = "Main font";
  setFormSBHW.en = "Width of SideBar when is hidden";
  setFormSBBG.en = "Background color of SideBar";
  setFormSBC.en = "Text color of SideBar";
  setFormSBHC.en = "Highlight color of SideBar";
  setFormBtnReset.en = "Reset";
  setFormBtnResetTitle.en = "Reset settings to default";
  setFormBtnSave.en = "Save";
  setFormBtnSaveTitle.en = "Save settings";
  setFormBtnCancel.en = "Cancel";
  setFormBtnCancelTitle.en = "Close this window";
  //polski
  sideBarText.pl = "Pokaż/ukryj pasek boczny";
  topBarText.pl = "Pokaż/ukryj pasek górny";
  inboxButtonText.pl = "Odebrane";
  composeButtonText.pl = "Napisz wiadomość";
  posBarLeftText.pl = "Przesuń panel w LEWO. Aktualna wartość myBarRight: ";
  posBarRightText.pl = "Przesuń panel w PREAWO. Aktualna wartość myBarRight: ";
  settingsMenuText.pl = "Ustawienia moich pasków";
  setFormTitle.pl = "Ustawienia moich pasków";
  setFormMBR.pl = "Prawy margines diva z przyciskami";
  setFormMBRTS.pl = "Prawy margines diva z przyciskami, gdy górny pasek jest widoczny";
  setFormSPC.pl = "Pokaż przyciski pozycji";
  setFormHBOS.pl = "Ukryj paski na starcie";
  setFormCA.pl = "Dodaj kilka wpisów CSS";
  setFormCF.pl = "Główny font";
  setFormSBHW.pl = "Szerokość paska bocznego gdy jest ukryty";
  setFormSBBG.pl = "Kolor tła paska bocznego";
  setFormSBC.pl = "Kolor tekstu paska bocznego";
  setFormSBHC.pl = "Kolor podświetlenia tekstu paska bocznego";
  setFormBtnReset.pl = "Reset";
  setFormBtnResetTitle.pl = "Przywróć domyślne ustawienia";
  setFormBtnSave.pl = "Zapisz";
  setFormBtnSaveTitle.pl = "Zapisz ustawienia";
  setFormBtnCancel.pl = "Anuluj";
  setFormBtnCancelTitle.pl = "Zamknij to okno";
  //end of config :) ----------------

  //set language
  var lang;
  if (typeof navigator.browserLanguage != "undefined") {lang = navigator.browserLanguage.substr(0,2);}
  if (typeof navigator.language != "undefined") {lang = navigator.language.substr(0,2);}
  if (languages.indexOf(lang) === -1) {lang = 'en';}

  //set values
  var sideBarHidden = hideBarsOnStart;
  var composeBtn = document.querySelector('.T-I-KE');
  var inboxBtn = document.querySelector('.J-Ke.n0'); //.J-Ke.n0 OR .TN.bzz.aHS-bnt ??
  var settMenu = $('.J-M.asi.aYO.jQjAxd');
  var leftText = posBarLeftText[lang]+myBarRight, rightText = posBarLeftText[lang]+myBarRight;
  var tmpButSt1 = '', tmpButSide1 = '-21px', tmpButTop1 = '-84px';
  if (showPosControls) {
    tmpButSt1 = 'height: 16px; ';
    tmpButSide1 = '-17px';
    tmpButTop1 = '-89px';
  }

  $('head').append('<style id="myBarStyle">#my-Bar {position: absolute; left: auto; right: '+myBarRight+'px; top: 15px; z-index: 6;}</style>');
  $('head').append('<style id="myBarsStyle">#gm-sideBar, #gm-topBar {'+tmpButSt1+'-moz-user-select: none;} #gm-sideBar > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/sprite_black2.png) '+tmpButSide1+' -84px no-repeat; width: 21px; height: 21px; transform: rotate(-90deg);} #gm-topBar > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/sprite_black2.png) -21px '+tmpButTop1+' no-repeat; width: 21px; height: 21px;}</style>');
  $('head').append('<style id="myInboxStyle">#gm-myinbox {user-select: none; background: lightgreen;} #gm-myinbox > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/sprite_black2.png) -84px -41px no-repeat; width: 21px; height: 21px;}</style>');
  $('head').append('<style id="myLeftStyle">#gm-barLeft {position: absolute; top: 18px; left: 0; height: 9px; -moz-user-select: none;} #gm-barLeft > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/skinnable/skinnable_ltr_light_1x.png) -35px -11px no-repeat; width: 18px; height: 18px; transform: rotate(180deg);}</style>');
  $('head').append('<style id="myRightStyle">#gm-barRight {position: absolute; top: 18px; left: 56px; height: 9px; -moz-user-select: none;} #gm-barRight > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/skinnable/skinnable_ltr_light_1x.png) -35px -22px no-repeat; width: 18px; height: 18px;}</style>');
  $('head').append('<style id="myCompoStyle">#gm-compo {user-select: none; color: white; background: -webkit-linear-gradient(top,#4387fd,#4683ea); background: linear-gradient(top,#4387fd,#4683ea);} #gm-compo > .bjy {background: url(//ssl.gstatic.com/ui/v1/icons/mail/skinnable/skinnable_ltr_light_1x.png) -56px -115px no-repeat; width: 21px; height: 21px; -webkit-filter: invert(100%);}</style>');
  $('head').append('<style id="mySettingsStyle">#my-settings {display: none; position: absolute; overflow: hidden; background: snow; padding: 10px; margin: auto; height: auto; width: 500px; top: 50%; left: 50%; transform: translateY(-50%); margin-left: -250px; border-radius: 5px; box-shadow: 0 0 15px 5px darkslategrey;} #my-settings h2 {text-align: center;}</style>');
  $('head').append('<style id="mySettForm">#my-setformbuttons {text-align: center;} #my-settings input {height: 1em;} #my-settings select {neight: 1.5em; font-size: 12px;} #my-set-reset {background: lightblue;} #my-set-save {background: lightcoral;} #my-set-cancel {background: lightgreen;}</style>');
  $('body').append('<div id="my-settings"><form action=""><h2>'+setFormTitle[lang]+'</h2><table><tr><td>'+setFormMBR[lang]+'</td><td><input type="text" name="myBarRight" value="'+myBarRight+'"></td></tr></table></form></div>');
  $('#my-settings table').append('<tr><td>'+setFormMBRTS[lang]+'</td><td><input type="text" name="myBarRightTopShow" value="'+myBarRightTopShow+'"></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormSPC[lang]+'</td><td><input type="checkbox" name="showPosControls" '+((showPosControls) ? 'checked="checked"' : '')+'></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormHBOS[lang]+'</td><td><input type="checkbox" name="hideBarsOnStart" '+((hideBarsOnStart) ? 'checked="checked"' : '')+'></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormCA[lang]+'</td><td><input type="checkbox" name="cssAdd" '+((cssAdd) ? 'checked="checked"' : '')+'></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormCF[lang]+'</td><td><input type="text" name="cssFont" value="'+cssFont+'"></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormSBHW[lang]+'</td><td><input type="text" name="sideBarHiddenWidth" value="'+sideBarHiddenWidth+'"></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormSBBG[lang]+'</td><td><input type="text" name="sideBarBackground" value="'+sideBarBackground+'"></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormSBC[lang]+'</td><td><input type="text" name="sideBarColor" value="'+sideBarColor+'"></td></tr>');
  $('#my-settings table').append('<tr><td>'+setFormSBHC[lang]+'</td><td><input type="text" name="sideBarHighlightColor" value="'+sideBarHighlightColor+'"></td></tr>');
  $('#my-settings form').append('<div id="my-setformbuttons"></div>');
  $('#my-setformbuttons').append('<div class="T-I J-J5-Ji nu T-I-ax7 L3" id="my-set-reset" data-tooltip="'+setFormBtnResetTitle[lang]+'">'+setFormBtnReset[lang]+'</div>');
  $('#my-setformbuttons').append('<div class="T-I J-J5-Ji nu T-I-ax7 L3" id="my-set-save" data-tooltip="'+setFormBtnSaveTitle[lang]+'">'+setFormBtnSave[lang]+'</div>');
  $('#my-setformbuttons').append('<div class="T-I J-J5-Ji nu T-I-ax7 L3" id="my-set-cancel" data-tooltip="'+setFormBtnCancelTitle[lang]+'">'+setFormBtnCancel[lang]+'</div>');
  $('<div id="my-Bar"></div>').prependTo($("body:not(.xE.Su)"));
  $('<div id="gm-sideBar" class="T-I J-J5-Ji lR T-I-ax7 T-I-Js-IF ar7" role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="'+sideBarText[lang]+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').appendTo('#my-Bar');
  $('<div id="gm-topBar"  class="T-I J-J5-Ji nN T-I-ax7 T-I-Js-Gs T-I-Js-IF ar7"  role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="'+topBarText[lang]+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').insertAfter("#gm-sideBar");
  $('<div id="gm-myinbox" class="T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs T-I-Js-IF ar7" role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="'+inboxButtonText[lang]+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').insertAfter('#gm-topBar');
  if (showPosControls) {
    $('<div id="gm-barLeft"   class="T-I J-J5-Ji lR T-I-ax7 T-I-Js-IF ar7" role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="'+leftText+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').insertAfter('#gm-myinbox');
    $('<div id="gm-barRight"  class="T-I J-J5-Ji nN T-I-ax7 T-I-Js-Gs T-I-Js-IF ar7"  role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" data-tooltip="'+rightText+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').insertAfter("#gm-barLeft");
  }
  $('<div id="gm-compo" class="T-I J-J5-Ji m9 T-I-ax7 T-I-Js-Gs ar7" role="button" tabindex="0" aria-haspopup="false" aria-expanded="false" gh="cm" data-tooltip="'+composeButtonText[lang]+'"><div class="bjy T-I-J3 J-J5-Ji"></div></div>').insertAfter('#gm-myinbox');
  $('#gm-myinbox').hover(function() {$(this).addClass("T-I-JW");}, function() {$(this).removeClass("T-I-JW");});
  $('#gm-sideBar').hover(function() {$(this).addClass("T-I-JW");}, function() {$(this).removeClass("T-I-JW");});
  $('#gm-topBar').hover(function() {$(this).addClass("T-I-JW");}, function() {$(this).removeClass("T-I-JW");});
  $('#gm-compo').hover(function() {$(this).addClass("T-I-JW");}, function() {$(this).removeClass("T-I-JW");});
  $("#my-Bar>.T-I").css("padding", "0 0px");
  $("#gbqfqw").css("height", "29px");
  $("#gbqfb").css("height", "29px");
  var gmMainView = $('.nH.bkK.nn'), gmMainViewWidth = $('.nH.bkK.nn').width();
  var sideBar = $(".nH.oy8Mbf.nn.aeN"), sideBar2 = $(".Ls77Lb.aZ6"), sideBarWidth = sideBar.width(), sideBarMoreEt = $(".aBA");
  var hPanel = $(".J-KU-Jg.J-KU-Jg-Zc.aj5"), hPanelWidth = hPanel.width(), hPanelLastView = hPanel.children("div:last-child").css("display");
  var topBar = $(".nH.w-asV.aiw"), div1 = $('.nH.age.apP.aZ6.apk.nn'), div2 = $('.nH.aNW.apk.nn'), div3 = $('.nH.nn .apj');
  var he1 = $('[role=banner]'), df1 = $("#gb").children("div:first-child").children("div:nth-child(1)"), db1 = $("#gb").children("div:first-child").children("div:nth-child(2)");
  var height1 = he1.height();
  var se1 = $('#gbq2'), spad1 = se1.css("padding-top"), swidth1 = se1.css("width");
  var se3 = $("#gb").children("div:first-child").children("div:nth-child(3)"), seh3 = se3.css("height"), sew3 = se3.css("width");
  var tbheight = topBar.height();
  sideBar.css("transition-property", "width").css("transition-duration", "0.5s").css("transition-timing-function", "easy-out");
  //gmMainView.css("transition-property", "width");gmMainView.css("transition-duration", "0.5s");
  he1.css("transition-property", "height");he1.css("transition-duration", "0.5s");
  se3.css("transition-property", "left");se3.css("transition-duration", "0.5s");
  db1.css("transition-property", "height");db1.css("transition-duration", "0.5s");
  //$('#my-Bar').css("transition-property", "right");$('#my-Bar').css("transition-duration", "0.5s");
  if ($('.yO').css('background-color') == 'rgba(5, 5, 5, 0.85)') {tmplBlackStyle = true;} else {tmplBlackStyle = false;}
//console.log($('.yO').css('background-color'));

  function saveSettings () {
      setCookie('myBarRight', $('input[name=myBarRight]').val(), 365);
      setCookie('myBarRightTopShow', $('input[name=myBarRightTopShow]').val(), 365);
      setCookie('showPosControls', ($('input[name=showPosControls]').is(':checked') ? 'true' : 'false'), 365);
      setCookie('hideBarsOnStart', ($('input[name=hideBarsOnStart]').is(':checked') ? 'true' : 'false'), 365);
      setCookie('cssAdd', ($('input[name=cssAdd]').is(':checked') ? 'true' : 'false'), 365);
      setCookie('cssFont', $('input[name=cssFont]').val(), 365);
      setCookie('sideBarHiddenWidth', $('input[name=sideBarHiddenWidth]').val(), 365);
      setCookie('sideBarBackground', $('input[name=sideBarBackground]').val(), 365);
      setCookie('sideBarColor', $('input[name=sideBarColor]').val(), 365);
      setCookie('sideBarHighlightColor', $('input[name=sideBarHighlightColor]').val(), 365);
  }
  function loadSettings () {
    myBarRight = (getCookie('myBarRight')) ? getCookie('myBarRight') : 450;
    myBarRightTopShow = (getCookie('myBarRightTopShow')) ? getCookie('myBarRightTopShow') : 150;
    showPosControls = (getCookie('showPosControls') == 'true') ? getCookie('showPosControls') : false;
    hideBarsOnStart = (getCookie('hideBarsOnStart') == 'true') ? getCookie('hideBarsOnStart') : true;
    cssAdd = (getCookie('cssAdd') == 'true') ? getCookie('cssAdd') : true;
    cssFont = (getCookie('cssFont')) ? getCookie('cssFont') : "Neuton, monospace";
    sideBarHiddenWidth = (getCookie('sideBarHiddenWidth')) ? getCookie('sideBarHiddenWidth') : 25;
    sideBarBackground = (getCookie('sideBarBackground')) ? getCookie('sideBarBackground') : "steelblue";
    sideBarColor = (getCookie('sideBarColor')) ? getCookie('sideBarColor') : "white";
    sideBarHighlightColor = (getCookie('sideBarHighlightColor')) ? getCookie('sideBarHighlightColor') : "navy";
  }
  function resetSettings () {
      deleteCookie('myBarRight');
      deleteCookie('myBarRightTopShow');
      deleteCookie('showPosControls');
      deleteCookie('hideBarsOnStart');
      deleteCookie('cssAdd');
      deleteCookie('cssFont');
      deleteCookie('sideBarHiddenWidth');
      deleteCookie('sideBarBackground');
      deleteCookie('sideBarColor');
      deleteCookie('sideBarHighlightColor');
      deleteCookie('tmplBlackStyle');
  }

  function toggleSettings () {
      $('#my-settings').toggle();
      settMenu.toggle();
  }

  function addSettingsMenu (x) {
    $('<div class="J-Kh" aria-disabled="true" role="separator" mysep="my-settings-sep" style="user-select: none;"></div>').prependTo(x);
    $('<div class="J-N" role="menuitem" myid="my-settings-btn" style="user-select: none;"><div class="J-N-Jz" style="user-select: none;">'+settingsMenuText[lang]+'</div></div>').prependTo(x);
    $("[myid=my-settings-btn]").click(function () {toggleSettings();});
    $("[myid=my-settings-btn]").hover(function () {$(this).addClass("J-N-JT");}, function () {$(this).removeClass("J-N-JT");});

  }

  function setPosBarTexts () {
    leftText = posBarLeftText[lang]+myBarRight;
    rightText = posBarLeftText[lang]+myBarRight;
    $('#gm-barLeft').attr('data-tooltip', leftText);
    $('#gm-barRight').attr('data-tooltip', rightText);
  }

  function setSearchLeft () {
          se3.css("height", "0px").css("left", "calc("+$("#my-Bar").css("left")+" - 16px - 200px - "+db1.width()+"px)").css("width", "0");
  }

  function checkIcons () {
      //mark as read
      $("[act=1]").find(".Bn").html('<div class="T-I-J3 J-J5-Ji" style="background: transparent url(//ssl.gstatic.com/mail/sprites/general_black-2eb471de5e5ea7371fa18ebc5339694d.png) 0px 291px; width: 22px; height: 21px;" data-tooltip="Oznacz jako przeczytane"></div>');
      //delete
      $("[act=10]").css("background-color", "red");
      //archiv
      $("[act=7]").css("background-color", "yellow");
      //del etiquette
      $("[act=13]").find(".Bn").html('<div class="T-I-J3 J-J5-Ji" style="background: transparent url(//ssl.gstatic.com/mail/sprites/general_black-2eb471de5e5ea7371fa18ebc5339694d.png) 0px 267px; width: 22px; height: 21px;"></div><div class="T-I-J3 J-J5-Ji" style="background: transparent url(//ssl.gstatic.com/mail/sprites/general_black-2eb471de5e5ea7371fa18ebc5339694d.png) 0px 220px; width: 22px; height: 21px;"></div>');
      //
  }

  function winRes () {
    if(sideBarHidden) {
      gmMainView.width("calc(100% - "+sideBarHiddenWidth+"px");
    } else {
        sideBarWidth = sideBar.width();
        gmMainView.css("width", "calc(100% - "+sideBarWidth+"px)");
        gmMainViewWidth = gmMainView.width();
    }
    if (he1.css("height") == "0px") {
      se3.css("left", "calc("+$("#my-Bar").css("left")+" - 16px - 200px - "+db1.width()+"px)");
    }
  }

  function topBarHide () {
    $('head').append('<style id="GATBnew">.G-atb{padding: 0 0 4px 0;}</style>');
    $('#my-Bar').css('right', myBarRight+'px');
    topBar.css("margin-bottom", "0").css("width", "0");
    $("#my-Bar").css("top", "4px");
    df1.css("display", "none");
    db1.css("height", "0");
    he1.css("height", "0");
    se1.css("padding-top", "4px");
    setSearchLeft();
    //se3l = se3.css("left");
    $('.b8.UC > .J-J5-Ji').css("top", "47px");
    div1.height(div1.outerHeight()+tbheight);
    div2.height(div2.outerHeight()+tbheight);
    div3.height(div3.outerHeight()+tbheight);
    checkIcons();
  }

  function topBarShow () {
    $('#GATBnew').remove();
    $('#my-Bar').css('right', myBarRightTopShow+'px');
    topBar.css("margin-bottom", "5px").css("width", "100%");
    $("#my-Bar").css("top", "15px");
    df1.css("display", "flex");
    db1.css("height", height1);
    he1.css("height", height1);
    se1.css("padding-top", spad1);
    se3.css("height", seh3).css("left", "0").css("width", sew3);
    //se3l = se3.css("left");
    $('.b8.UC > .J-J5-Ji').css("top", "0");
    div1.height(div1.outerHeight()-tbheight);
    div2.height(div2.outerHeight()-tbheight);
    div3.height(div3.outerHeight()-tbheight);
  }

  function sideBarHide (gmV = true) {
    sideBar.css("width", sideBarHiddenWidth-5+"px");
    sideBar2.css("visibility", "hidden");
    sideBarMoreEt.css("display", "none");
    hPanel.css("width", "0");
    hPanel.children("div").css("display", "none");
    if (gmV) {
      $('head').append('<style id="NQnew">.NQ{background-color: '+sideBarHighlightColor+';}</style>');
      gmMainView.width("calc(100% - "+sideBarHiddenWidth+"px)");
      sideBar.css("position", "absolute");
      sideBar.css("background", sideBarBackground);
      sideBar.find('a, span').css("color", sideBarColor);
      sideBar.css("z-index", "100");
      sideBar.css("border-radius", "0 15px 15px 0");
      gmMainView.css("margin-left", sideBarHiddenWidth+"px");
    }
    checkIcons();
  }

  function sideBarShow (gmV = true) {
    sideBar.css("width", sideBarWidth);
    sideBar2.css("visibility", "initial");
    sideBarMoreEt.css("display", "block");
    hPanel.css("width", hPanelWidth);
    hPanel.children("div").css("display", "inline-block");
    hPanel.children("div:last-child").css("display", hPanelLastView);
    if (gmV) {
      $('#NQnew').remove();
      gmMainView.css("margin-left", "initial");
      sideBar.css("position", "relative");
      sideBar.css("background", "initial");
      sideBar.find('a, span').css("color", "");
      sideBar.css("z-index", "initial");
      sideBar.css("border-radius", "initial");
      gmMainView.css("width", "calc(100% - "+sideBarWidth+"px)");
      gmMainViewWidth = gmMainView.width();
    }
    $(".wT").css("width", "auto");
  }

  $("#gb").children("div:first-child").css("height", "0");
  $('.nH.bkL > .no').css("width", "100%");

  $("#gm-myinbox").click(function() {
      inboxBtn.click();
  });

  $("#gm-compo").click(function() {
     var mousedownEvent = new MouseEvent('mousedown');
     composeBtn.dispatchEvent(mousedownEvent);
     var mouseupEvent = new MouseEvent('mouseup');
     composeBtn.dispatchEvent(mouseupEvent);
  });

  $("#gbq").focusin(function() {
    if (he1.css("height") == "0px") {
      se3.css("width", sew3);
      se3.css("left", "calc("+$("#my-Bar").css("left")+" - 16px - "+se3.css("width")+" - "+db1.width()+"px)");
      $(".gstl_50.gssb_c").css("left", se3.css("left"));
    }
  });

  $("#gbq").focusout(function() {
    if (he1.css("height") == "0px" && $(".ZF-Av").css("visibility") == "hidden") {
      se3.css("width", "0");
      se3.css("left", "calc("+$("#my-Bar").css("left")+" - 16px - 200px - "+db1.width()+"px)");
      $(".gstl_50.gssb_c").css("left", se3.css("left"));
    }
  });

  $(".aoq").click(function () {
    if (he1.css("height") == "0px") {
      se3.css("width", sew3);
      se3.css("left", "calc("+$("#my-Bar").css("left")+" - 16px - "+se3.css("width")+" - "+db1.width()+"px)");
      $(".gstl_50.gssb_c").css("left", se3.css("left"));
    }
  });

  $("body").on('click', function () {
    $('.J-M.asi.aYO.jQjAxd>div').each(function(){
      if (!$(this).find('[mysep=my-settings-sep]').length) {
        addSettingsMenu(this);
      }

    });
  });

  $(document).on("click", "#gm-sideBar", function() {
    if(sideBarHidden) {sideBarShow(); sideBarHidden = false;} else {sideBarHide(); sideBarHidden = true;}
  });

  $(document).on("click", "#gm-topBar", function() {
      if(he1.css("height") == "0px") {topBarShow();} else {topBarHide();}
  });

  $(document).on("mouseover", ".nH.oy8Mbf.nn.aeN", function() {
      if (sideBarHidden) {
          sideBarShow(false);
          hPanel.css("background", sideBarBackground);
          hPanel.css("color", sideBarColor);
      }
  });

  $(document).on("mouseout", ".nH.oy8Mbf.nn.aeN", function() {
      if (sideBarHidden) {
          sideBarHide(false);
          hPanel.css("background", "initial");
          hPanel.css("color", "initial");
      }
  });

  $(document).on("click", "#gm-barLeft", function() {
    myBarRight++;
    $('#my-Bar').css('right', myBarRight);
    setSearchLeft();
    setPosBarTexts()
    console.log(myBarRight);
  });

  $(document).on("click", "#gm-barRight", function() {
    myBarRight--;
    $('#my-Bar').css('right', myBarRight);
    setSearchLeft();
    setPosBarTexts()
    console.log(myBarRight);
  });

  $('#my-set-reset').click(function(){
      resetSettings();
      loadSettings();
      $('#my-settings form').submit();
  });
  $('#my-set-cancel').click(function(){
      $('#my-settings').css('display', 'none');
  });
  $('#my-set-save').click(function(){
      saveSettings();
      loadSettings();
      if (db1.css('height') == '0px') {$('#my-Bar').css('right', myBarRight+'px'); setSearchLeft();} else {$('#my-Bar').css('right', myBarRightTopShow+'px');}
      if (sideBarHidden) {
          sideBar.css("width", sideBarHiddenWidth-5+"px");
          gmMainView.width("calc(100% - "+sideBarHiddenWidth+"px)");
          sideBar.css("background", sideBarBackground);
          sideBar.find('a, span').css("color", sideBarColor);
          gmMainView.css("margin-left", sideBarHiddenWidth+"px");
          hPanel.css("background", sideBarBackground);
          hPanel.css("color", sideBarColor);
          sideBarShow(false);
          //setTimeout(function(){}, 700);
          sideBarHide(false);
      }
      $('#my-settings').css('display', 'none');
      if ($('input[name=hideBarsOnStart]').is(':checked')) {sideBarHide(); topBarHide(); sideBarHidden = true;}
  });

  $(".l2.ov").css("padding-bottom", "0px");

  if (cssAdd) {
    checkIcons();
    var styles = 'body, td, input, .ii, .Ak, .ao5, .LW-avf, table.message tbody tr td font {font: normal 14px '+cssFont+' !important; font-size: 14px !important; font-family: '+cssFont+' !important;}';
    styles = styles + '.zE {background: ' + (tmplBlackStyle ? 'dimgray' : 'lightblue') + ';} .TK span{font: normal 14px arial !important;} .xY {padding-top: 0 !important; padding-bottom: 0 !important;} .Wg {padding-top: 0 !important;}';
    styles = styles + ' .aps {background: ' + (tmplBlackStyle ? 'cadetblue' : 'lightgreen') + ';} .aps.yO {background: ' + (tmplBlackStyle ? 'darkslategray' : 'lightyellow') + ' !important;} .zA:nth-child(2n-1) {color: ' + (tmplBlackStyle ? 'ghostwhite' : 'blue') + ';}';
    styles = styles + ' .G-atb {margin-left: 0; padding-left: 0;}';
  //  styles = styles + '.zA:hover {background: aliceblue !important;}';
    var heads = $('head');
    if (heads.length > 0) {
      var node = document.createElement('style');
      node.type = 'text/css';
      node.appendChild(document.createTextNode(styles));
      heads[0].appendChild(node);
    }
  }

  if (hideBarsOnStart) {
      sideBarHide();
      topBarHide();
  } else {topBarShow(false);}

  $(window).resize(function () {winRes();});
});