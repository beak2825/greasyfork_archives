// ==UserScript==
// @name         Technopat Sosyal Araçlar
// @version      1.6.2
// @description  Technopat Sosyal deneyimini iyilestiren ozellikler
// @author       Çınar Yılmaz <cinaryilmaz.gnu@gmail.com>
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        https://www.technopat.net/sosyal/*
// @icon         https://camroku.tech/tpsutils.png
// @license      GPLv3
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    tps-utils
// @downloadURL https://update.greasyfork.org/scripts/443823/Technopat%20Sosyal%20Ara%C3%A7lar.user.js
// @updateURL https://update.greasyfork.org/scripts/443823/Technopat%20Sosyal%20Ara%C3%A7lar.meta.js
// ==/UserScript==
var $ = window.jQuery;

if (GM_getValue('gozardiguzellestir', 'none') === 'none') {
  GM_setValue('gozardiguzellestir', 'true');
}

if (GM_getValue('dersmodu', 'none') === 'none') {
  GM_setValue('dersmodu', 'false');
}

if (GM_getValue('sabahaksam', 'none') === 'none') {
  GM_setValue('sabahaksam', 'false');
}

if (GM_getValue('sabahsaati', 'none') === 'none') {
  GM_setValue('sabahsaati', 6);
}

if (GM_getValue('aksamsaati', 'none') === 'none') {
  GM_setValue('aksamsaati', 20);
}

if (GM_getValue('bansil', 'none') === 'none') {
  GM_setValue('bansil', 'false');
}

$.ajaxSetup({
  async: false
});

var scriptElem = document.createElement('script');
scriptElem.innerHTML = 'function copy(text) {var tmp = document.createElement("input");tmp.value = text;document.body.appendChild(tmp);tmp.select();document.execCommand("copy");document.body.removeChild(tmp);alert("Kopyalandı!");}';
document.body.appendChild(scriptElem);

// URL: https://www.technopat.net/sosyal/hesap/ignored
// Kara listede bulunan üye sayısını gösterir. Metin olarak indirme imkanı sunar.
if (window.location.pathname == "/sosyal/hesap/ignored") {
  var blocked = $("a:contains('Görünür Yap')").length;
  let userstext = "";
  $("h3.contentRow-header a.username").each(function(){
    userstext += "ID: " + $(this).attr("data-user-id") + ", Username: " + $(this).text() + " | ";
  });

  $(".p-title-value").html("Kara Liste (" + blocked + " üye) <span onclick=\"copy('" + userstext + "')\" style=\"color: #70abcb;\">Listeyi metin olarak kopyala</a>");
}

// URL: https://www.technopat.net/sosyal/*
// 'Bu kullanıcının içeriğini görmezden geliyorsunuz' kutularını daha az göze batan hale getirir.
if (GM_getValue('gozardiguzellestir') === "true") {
  $('.messageNotice--ignored').css({"padding-left": "10px", "margin-top": "5px", "margin-bottom": "5px"});
  $('.messageNotice--ignored').addClass("bbCodeBlock");
  $('.messageNotice--ignored').removeClass("messageNotice--ignored messageNotice");
}

// URL: https://www.technopat.net/sosyal/*
// TPS Araçlar Ayarları linkini menüye ekler
$('ul.p-nav-list > li:nth-child(2)').after('<li><div class="p-navEl" data-has-children="false"><a href="/sosyal/hesap?tps-utils" class="p-navEl-link" data-nav-id="tps-utils">TPS Araçlar Ayarları</a></div></li>');

// URL: https://www.technopat.net/sosyal/*
// Banlı kullanıcılarda gözüken "kısıtlandınız" uyarısını kaldırır.
if (GM_getValue('bansil') === "true") {
  $('li[data-notice-id="6"]').remove();
}

// URL: https://www.technopat.net/sosyal/hesap?tps-utils
// TPS Araçlar Ayarları
var url = new URL(window.location.href);
if (window.location.pathname == "/sosyal/hesap" && url.searchParams.has('tps-utils')) {
  $('.block-body *, .p-body-sideNav, .p-body-sideNavCol, .blockMessage, .formSubmitRow').remove();
  $('.p-title-value').text('Technopat Sosyal Araçlar Ayarları');
  $('span:contains("Hesabınız")').parent().attr('href', 'https://www.technopat.net/sosyal/hesap?tps-utils');
  $('span:contains("Hesabınız")').text('TPS Araçlar');
  var gozardiguzellestir_sel = "";
  if (GM_getValue('gozardiguzellestir') === "true") {
    gozardiguzellestir_sel = " checked";
  }
  var dersmodu_sel = "";
  if (GM_getValue('dersmodu') === "true") {
    dersmodu_sel = " checked";
  }
  var sabahaksam_sel = "";
  if (GM_getValue('sabahaksam') === "true") {
    sabahaksam_sel = " checked";
  }
  var sabahsaati = GM_getValue('sabahsaati');
  var aksamsaati = GM_getValue('aksamsaati');
  var bansil_sel = "";
  if (GM_getValue('bansil') === "true") {
    bansil_sel = " checked";
  }

  var versionwarn = "";
  $.getJSON("https://greasyfork.org/en/scripts/443823-technopat-sosyal-ara%C3%A7lar.json", function(data){
    if (data.version !== GM.info.script.version){
      versionwarn = "<a href=\"https://greasyfork.org/en/scripts/443823\" class=\"button--link button\"><span class=\"button-text\">Guncelle (" + data.version + ")</span></a>";
    }
  });
  $('.block-body').html(`<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">Mod seçenekleri</label>
</div>
</dt><dd>
<ul class="inputChoices" role="group">
<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="gozardiguzellestir" value="1"${gozardiguzellestir_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Göz ardı uyarılarını sadeleştir</span>
</label>
</li><li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="dersmodu" value="1"${dersmodu_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Ders modu</span>
</label>
</li>
<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="sabahaksam" value="1"${sabahaksam_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Sabah ve akşam farklı tema göster</span>
</label>
</li>
<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="bansil" value="1"${bansil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Kural ihlali uyarısını sil</span>
</label>
</li>
</ul>
</dd>
</dl>
<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">Sabah saati</label>
</div>
</dt><dd>
<input type="number" class="input" name="sabahsaati" value="${sabahsaati}" maxlength="50" placeholder="Sabah Saati">
</dd>
</dl>
<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">Akşam saati</label>
</div>
</dt><dd>
<input type="number" class="input" name="aksamsaati" value="${aksamsaati}" maxlength="50" placeholder="Akşam Saati">
</dd>
</dl>
<hr class="formRowSep">
<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">TPS Araçlar versiyonu</label>
</div>
</dt>
<dd>
${GM.info.script.version}
${versionwarn}
</dd>
</dl>
<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">${GM.info.scriptHandler} versiyonu</label>
</div>
</dt>
<dd>${GM.info.version}</dd>
</dl>
<dl class="formRow formSubmitRow formSubmitRow--sticky" data-xf-init="form-submit-row" style="height: 42.1875px;">
<dt></dt>
<dd>
<div class="formSubmitRow-main" style="">
<div class="formSubmitRow-bar"></div>
<div class="formSubmitRow-controls"><button type="submit" class="button--primary button button--icon button--icon--save"><span class="button-text">Kaydet</span></button></div>
</div>
</dd>
</dl>`);
  $('title').text("TPS Araçlar Ayarları | Technopat Sosyal");
  $('.button--icon--save').click(function(){
    if ($('[name="gozardiguzellestir"]').is(':checked')) {
      GM_setValue('gozardiguzellestir', "true")
    } else {
      GM_setValue('gozardiguzellestir', "false")
    }
    if ($('[name="dersmodu"]').is(':checked')) {
      GM_setValue('dersmodu', "true")
    } else {
      GM_setValue('dersmodu', "false")
    }
    if ($('[name="sabahaksam"]').is(':checked')) {
      GM_setValue('sabahaksam', "true")
    } else {
      GM_setValue('sabahaksam', "false")
    }
    if ($('[name="sabahaksam"]').is(':checked')) {
      GM_setValue('sabahaksam', "true")
    } else {
      GM_setValue('sabahaksam', "false")
    }
    if ($('[name="bansil"]').is(':checked')) {
      GM_setValue('bansil', "true")
    } else {
      GM_setValue('bansil', "false")
    }
    GM_setValue('sabahsaati', $('[name="sabahsaati"]').val())
    GM_setValue('aksamsaati', $('[name="aksamsaati"]').val())
    location.reload();
  });
  $('form.block').attr({
      action: '/sosyal/hesap?tps-utils',
      method: 'get'
  });
}

// URL: https://www.technopat.net/sosyal/* -x https://www.technopat.net/sosyal/hesap?tps-utils
// Ders modu
if (!(window.location.pathname == "/sosyal/hesap" && url.searchParams.has('tps-utils')) && GM_getValue('dersmodu') === "true") {
  $('head *').remove();
  $('head').html('<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Ders modu aktif | Technopat Sosyal</title><meta name="theme-color" content="#1e1e1e"><style>html{font:15px / 1.4 sans-serif;font-family:\'Segoe UI\',\'Helvetica Neue\',Helvetica,Roboto,Oxygen,Ubuntu,Cantarell,\'Fira Sans\',\'Droid Sans\',sans-serif;font-weight:400;color:#c8c8c8;margin:0;padding:0;word-wrap:break-word;background-color:#191919}body{max-width:1200px;padding:0 10px;margin:0 auto}a{color:#70abcb;text-decoration:none}a:hover{color:#c8c8c8;text-decoration:underline}.p-offline-header{padding:0;font-size:24px;font-weight:400}.p-offline-main{margin-bottom:20px;padding:6px 10px;color:#c8c8c8;background:#282828;border:1px solid #c8c8c8;border-top-color:#373737;border-right-color:#373737;border-bottom-color:#373737;border-left-color:#373737;border-radius:4px;background-image:none}.p-offline-main:before,.p-offline-main:after{content:" ";display:table}.p-offline-main:after{clear:both}.button,a.button{display:inline-block;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;border:1px solid transparent;white-space:nowrap;-webkit-transition: background-color .125s ease, border-color .125s ease, color .125s ease;transition: background-color .125s ease, border-color .125s ease, color .125s ease;font-size:13px;border-radius:4px;padding-top:5px;padding-right:10px;padding-bottom:5px;padding-left:10px;text-align:center;color:#fff;background:#185886;border-color:#282828 !important;border-color:#144a70 #1c669c #1c669c #144a70}.button.button--splitTrigger>.button-text,a.button.button--splitTrigger>.button-text{border-right-color:#1c669c}.button.button--splitTrigger>.button-menu,a.button.button--splitTrigger>.button-menu{border-left-color:#144a70}.button:not(.button--splitTrigger):hover,a.button:not(.button--splitTrigger):hover,.button.button--splitTrigger>.button-text:hover,a.button.button--splitTrigger>.button-text:hover,.button.button--splitTrigger>.button-menu:hover,a.button.button--splitTrigger>.button-menu:hover,.button:not(.button--splitTrigger):focus,a.button:not(.button--splitTrigger):focus,.button.button--splitTrigger>.button-text:focus,a.button.button--splitTrigger>.button-text:focus,.button.button--splitTrigger>.button-menu:focus,a.button.button--splitTrigger>.button-menu:focus,.button:not(.button--splitTrigger):active,a.button:not(.button--splitTrigger):active,.button.button--splitTrigger>.button-text:active,a.button.button--splitTrigger>.button-text:active,.button.button--splitTrigger>.button-menu:active,a.button.button--splitTrigger>.button-menu:active{background-color:#1e6fa9}</style>');
  $('body *').remove();
  $('body').html('<h1 class="p-offline-header">Technopat Sosyal</h1><div class="p-offline-main">Ders Modu aktif. Technopat Sosyal\'i Ders Modu aktifken kullanamazsınız.<br><a href="/sosyal/hesap?tps-utils" class="button">TPS Araclar Ayarlari</a></div>');
}

// URL: https://www.technopat.net/sosyal/*
// Footer'a TPS Araçlar yazısı
$('.p-footer-copyright').append('<br /><a href="https://greasyfork.org/en/scripts/443823-technopat-sosyal-utils" class="u-concealed" dir="ltr" target="_blank" rel="sponsored noopener">TPS Araçlar ' + GM.info.script.version + '</a>')

// URL: https://www.technopat.net/sosyal/*
// Sabah aydınlık, akşam karanlık tema.
if (GM_getValue('sabahaksam') === "true") {
  const saat = new Date().getHours();
  const sabah = saat > parseInt(GM_getValue("sabahsaati")) && saat < parseInt(GM_getValue("aksamsaati"));
  if (sabah) {
    if ($("html").css("color") == "rgb(200, 200, 200)") {
      $.get("https://www.technopat.net/sosyal/cesitli/style", function(data){
        var njq = $('<div/>').html(data);
        window.location.href = njq.find("a:contains('Varsayılan Stil').menu-linkRow").attr("href");
      });
    }
  } else {
    if ($("html").css("color") == "rgb(20, 20, 20)") {
      $.get("https://www.technopat.net/sosyal/cesitli/style", function(data){
        var njq = $('<div/>').html(data);
        window.location.href = njq.find("a:contains('Karanlık Stil').menu-linkRow").attr("href");
      });
    }
  }
}