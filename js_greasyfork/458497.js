// ==UserScript==
// @name         SDN Forum Araçlar
// @version      1.10.1
// @description  SDN Forum deneyimini iyileştiren özellikler
// @author       Çınar Yılmaz <cinaryilmaz.gnu@gmail.com>
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        https://forum.shiftdelete.net/*
// @icon         https://forum.shiftdelete.net/favicon.ico
// @license      GPLv3
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace    sdn-utils
// @downloadURL https://update.greasyfork.org/scripts/458497/SDN%20Forum%20Ara%C3%A7lar.user.js
// @updateURL https://update.greasyfork.org/scripts/458497/SDN%20Forum%20Ara%C3%A7lar.meta.js
// ==/UserScript==
var $ = window.jQuery;
const pn = window.location.pathname;

$('<style>').text(`.p-navEl-link[data-nav-id="sdnutils"]::before {
  content: "\\f013";
}`).appendTo(document.head)

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

if (GM_getValue('videosil', 'none') === 'none') {
	GM_setValue('videosil', 'false');
}

if (GM_getValue('sorusorsil', 'none') === 'none') {
	GM_setValue('sorusorsil', 'false');
}

if (GM_getValue('temasil', 'none') === 'none') {
	GM_setValue('temasil', 'false');
}

if (GM_getValue('habersil', 'none') === 'none') {
	GM_setValue('habersil', 'false');
}

if (GM_getValue('cevrimicisil', 'none') === 'none') {
	GM_setValue('cevrimicisil', 'false');
}

if (GM_getValue('statsil', 'none') === 'none') {
	GM_setValue('statsil', 'false');
}

if (GM_getValue('pmsil', 'none') === 'none') {
	GM_setValue('pmsil', 'false');
}

if (GM_getValue('ayinuyelerisil', 'none') === 'none') {
	GM_setValue('ayinuyelerisil', 'false');
}

if (GM_getValue('kullanicinormallestir', 'none') === 'none') {
	GM_setValue('kullanicinormallestir', 'false');
}

if (GM_getValue('aramasadelestir', 'none') === 'none') {
	GM_setValue('aramasadelestir', 'false');
}

$.ajaxSetup({
	async: false
});

var scriptElem = document.createElement('script');
scriptElem.innerHTML = 'function copy(text) {var tmp = document.createElement("input");tmp.value = text;document.body.appendChild(tmp);tmp.select();document.execCommand("copy");document.body.removeChild(tmp);alert("Kopyalandı!");}';
document.body.appendChild(scriptElem);

// URL: https://forum.shiftdelete.net/hesap/hesap-detaylari/ignored
// Kara listede bulunan üye sayısını gösterir. Metin olarak indirme imkanı sunar.
if (pn == "/hesap/engellenenler") {
	var blocked = $("a:contains('Yok sayma')").length;
	let userstext = "";
	$("h3.contentRow-header a.username").each(function () {
		userstext += "ID: " + $(this).attr("data-user-id") + ", Username: " + $(this).text() + " | ";
	});

	$(".p-title-value").html("Kara Liste (" + blocked + " üye) <span onclick=\"copy('" + userstext + "')\" style=\"color: #70abcb;\">Listeyi metin olarak kopyala</a>");
}

// URL: https://forum.shiftdelete.net/*
// 'Bu kullanıcının içeriğini görmezden geliyorsunuz' kutularını daha az göze batan hale getirir.
if (GM_getValue('gozardiguzellestir') === "true") {
	$('.messageNotice--ignored').css({ "padding-left": "10px", "margin-top": "5px", "margin-bottom": "5px" });
	$('.messageNotice--ignored').addClass("bbCodeBlock");
	$('.messageNotice--ignored').removeClass("messageNotice--ignored messageNotice");
}

// URL: https://forum.shiftdelete.net/*
// SDN Araçlar Ayarları linkini menüye ekler
$('ul.p-nav-list > li:nth-child(1)').after(`<li class="navsdnutils">
<div class="p-navEl ">
<a href="/hesap/hesap-detaylari?sdn-utils" class="p-navEl-link " data-xf-key="7" data-nav-id="sdnutils">SDN Araçlar Ayarları</a>
</div>
</li>
`);

// URL: https://forum.shiftdelete.net/hesap/hesap-detaylari?sdn-utils
// SDN Araçlar Ayarları
var url = new URL(window.location.href);
if (pn == "/hesap/hesap-detaylari" && url.searchParams.has('sdn-utils')) {
	$('.p-body-sideNav, .p-body-sideNavCol, .blockMessage, .formSubmitRow, .block-formSectionHeader').remove();
	var cont = $('.block-body')[0].children;
	while (cont.length > 0) {
		cont[0].remove();
	}
	$('.block-body')[1].remove();
	$('.p-title-value').text('SDN Forum Araçlar Ayarları');
	$('span:contains("Hesabınız")').parent().attr('href', 'https://forum.shiftdelete.net/hesap/hesap-detaylari?sdn-utils');
	$('span:contains("Hesabınız")').text('SDN Araçlar');
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
	var videosil_sel = "";
	if (GM_getValue('videosil') === "true") {
		videosil_sel = " checked";
	}
	var sorusorsil_sel = "";
	if (GM_getValue('sorusorsil') === "true") {
		sorusorsil_sel = " checked";
	}
	var temasil_sel = "";
	if (GM_getValue('temasil') === "true") {
		temasil_sel = " checked";
	}
	var habersil_sel = "";
	if (GM_getValue('habersil') === "true") {
		habersil_sel = " checked";
	}
	var cevrimicisil_sel = "";
	if (GM_getValue('cevrimicisil') === "true") {
		cevrimicisil_sel = " checked";
	}
	var pmsil_sel = "";
	if (GM_getValue('pmsil') === "true") {
		pmsil_sel = " checked";
	}
	var statsil_sel = "";
	if (GM_getValue('statsil') === "true") {
		statsil_sel = " checked";
	}
	var ayinuyelerisil_sel = "";
	if (GM_getValue('ayinuyelerisil') === "true") {
		ayinuyelerisil_sel = " checked";
	}
	var kullanicinormallestir_sel = "";
	if (GM_getValue('kullanicinormallestir') === "true") {
		kullanicinormallestir_sel = " checked";
	}
	var aramasadelestir_sel = "";
	if (GM_getValue('aramasadelestir') === "true") {
		aramasadelestir_sel = " checked";
	}

	var sabahsaati = GM_getValue('sabahsaati');
	var aksamsaati = GM_getValue('aksamsaati');

	var versionwarn = "";
	$.getJSON("https://greasyfork.org/en/scripts/458497-technopat-sosyal-ara%C3%A7lar.json", function (data) {
		if (data.version !== GM.info.script.version) {
			versionwarn = "<a href=\"https://greasyfork.org/en/scripts/458497\" class=\"button--link button\"><span class=\"button-text\">Guncelle (" + data.version + ")</span></a>";
		}
	});
	$('.block-body')[0].innerHTML = `<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">Mod seçenekleri</label>
</div>
</dt><dd>
<ul class="inputChoices" role="group"><li class="inputChoices-choice">
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
<label class="formRow-label">Sayfa temizliği</label>
</div>
</dt><dd>
<ul class="inputChoices" role="group">

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="gozardiguzellestir" value="1"${gozardiguzellestir_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Göz ardı uyarılarını sadeleştir</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="videosil" value="1"${videosil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Anasayfadaki videoyu sil</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="sorusorsil" value="1"${sorusorsil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Soru sor tuşunu sil</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="temasil" value="1"${temasil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Tema değiştirme tuşunu sil</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="habersil" value="1"${habersil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Teknoloji haberleri tuşunu sil</span>
</label>
</li>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="cevrimicisil" value="1"${cevrimicisil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Ana sayfadan çevrimiçi üyeler listesini sil</span>
</label>
</li>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="pmsil" value="1"${pmsil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Ana sayfadan profil mesajlarını sil</span>
</label>
</li>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="statsil" value="1"${statsil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Ana sayfadan istatistikleri sil</span>
</label>
</li>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="ayinuyelerisil" value="1"${ayinuyelerisil_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Ana sayfadan ayın üyeleri listesini sil</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="kullanicinormallestir" value="1"${kullanicinormallestir_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Kullanıcı renklerini ve etiketlerini sil (kullanıcı sayfası hariç)</span>
</label>
</li>

<li class="inputChoices-choice">
<label class="iconic">
<input type="checkbox" name="aramasadelestir" value="1"${aramasadelestir_sel}>
<i aria-hidden="true"></i>
<span class="iconic-label">Arama tuşunu her zaman navigasyon barında tut ve sayfa içerisindeki arama kutusunun olduğu bölgeyi tamamen kaldır</span>
</label>
</li>

</ul>
</dd>
</dl>
<hr class="formRowSep">
<dl class="formRow">
<dt>
<div class="formRow-labelWrapper">
<label class="formRow-label">SDN Araçlar versiyonu</label>
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
</dl>`;
	$('title').text("SDN Araçlar Ayarları | SDN Forum");
	$('.button--icon--save').click(function () {
		const selectoptions = [
			"gozardiguzellestir",
			"dersmodu",
			"sabahaksam",
			"videosil",
			"sorusorsil",
			"temasil",
			"habersil",
			"cevrimicisil",
			"pmsil",
			"statsil",
			"ayinuyelerisil",
			"kullanicinormallestir",
			"aramasadelestir",
		];

		var el;
		for (let i = 0; i < selectoptions.length; i++) {
			el = selectoptions[i];
			if ($(`[name="${el}"]`).is(':checked')) {
				GM_setValue(el, "true");
			} else {
				GM_setValue(el, "false");
			}
		}

		GM_setValue('sabahsaati', $('[name="sabahsaati"]').val())
		GM_setValue('aksamsaati', $('[name="aksamsaati"]').val())
		location.reload();
	});
	$('form.block').attr({
		action: '/hesap/hesap-detaylari?sdn-utils',
		method: 'get'
	});
}

// URL: https://forum.shiftdelete.net/* -x https://forum.shiftdelete.net/hesap/hesap-detaylari?sdn-utils
// Ders modu
if (!(pn == "/hesap/hesap-detaylari" && url.searchParams.has('sdn-utils')) && GM_getValue('dersmodu') === "true") {
	$('head *').remove();
	$('head').html('<meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=Edge"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Ders modu aktif | SDN Forum</title><meta name="theme-color" content="#1e1e1e"><style>html{font:15px / 1.4 sans-serif;font-family:\'Segoe UI\',\'Helvetica Neue\',Helvetica,Roboto,Oxygen,Ubuntu,Cantarell,\'Fira Sans\',\'Droid Sans\',sans-serif;font-weight:400;color:#9aa0a6;margin:0;padding:0;word-wrap:break-word;background-color:#202124}body{max-width:1300px;padding:0 10px;margin:0 auto}a{color:#e2e4e8;text-decoration:none}a:hover{color:#fff;text-decoration:underline}.p-offline-header{padding:0;font-size:22px;font-weight:400}.p-offline-main{margin-bottom:20px;padding:10px 12px;color:#9aa0a6;background:#292a2d;border-width:1px;border-style:solid;border-top-color:#39393b;border-right-color:#39393b;border-bottom-color:#464648;border-left-color:#39393b;box-shadow:2px 2px 2px rgba(0,0,0,0.04);border-radius:4px;background-image:none}.p-offline-main:before,.p-offline-main:after{content:" ";display:table}.p-offline-main:after{clear:both}.button,a.button{display:inline-block;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer;border:1px solid transparent;white-space:nowrap;-webkit-transition: background-color .075s ease, border-color .075s ease, color .075s ease;transition: background-color .075s ease, border-color .075s ease, color .075s ease;font-size:13px;border-radius:4px;padding-top:8px;padding-right:10px;padding-bottom:8px;padding-left:10px;text-align:center;color:#fff;background:#333435;border-color:#262728 #404142 #404142 #262728}.button.button--splitTrigger>.button-text,a.button.button--splitTrigger>.button-text{border-right-color:#404142}.button.button--splitTrigger>.button-menu,a.button.button--splitTrigger>.button-menu{border-left-color:#262728}.button:not(.button--splitTrigger):hover,a.button:not(.button--splitTrigger):hover,.button.button--splitTrigger>.button-text:hover,a.button.button--splitTrigger>.button-text:hover,.button.button--splitTrigger>.button-menu:hover,a.button.button--splitTrigger>.button-menu:hover,.button:not(.button--splitTrigger):focus,a.button:not(.button--splitTrigger):focus,.button.button--splitTrigger>.button-text:focus,a.button.button--splitTrigger>.button-text:focus,.button.button--splitTrigger>.button-menu:focus,a.button.button--splitTrigger>.button-menu:focus,.button:not(.button--splitTrigger):active,a.button:not(.button--splitTrigger):active,.button.button--splitTrigger>.button-text:active,a.button.button--splitTrigger>.button-text:active,.button.button--splitTrigger>.button-menu:active,a.button.button--splitTrigger>.button-menu:active{background-color:#47484a}</style>');
	$('body *').remove();
	$('body').html('<h1 class="p-offline-header">SDN Forum</h1><div class="p-offline-main">Ders Modu aktif. SDN Forum\'ı Ders Modu aktifken kullanamazsınız.<br><a href="/hesap/hesap-detaylari?sdn-utils" class="button">SDN Araclar Ayarlari</a></div>');
}

// URL: https://forum.shiftdelete.net/*
// Footer'a SDN Araçlar yazısı
$('.xb-footer-block p').append('<br /><br /><a href="https://greasyfork.org/en/scripts/458497" class="u-concealed" dir="ltr" target="_blank" rel="sponsored noopener">SDN Araçlar ' + GM.info.script.version + '</a>')

// URL: https://forum.shiftdelete.net/*
// Sabah aydınlık, akşam karanlık tema.
if (GM_getValue('sabahaksam') === "true") {
	const saat = new Date().getHours();
	const sabah = saat > parseInt(GM_getValue("sabahsaati")) && saat < parseInt(GM_getValue("aksamsaati"));
	if (sabah) {
		if ($("html").css("color") == "rgb(154, 160, 166)") {
			$.get("https://forum.shiftdelete.net/diger/style", function (data) {
				var njq = $('<div/>').html(data);
				window.location.href = njq.find("a:contains('New (Day)').menu-linkRow").attr("href").split('&')[0];
			});
		}
	} else {
		if ($("html").css("color") == "rgb(29, 29, 29)") {
			$.get("https://forum.shiftdelete.net/diger/style", function (data) {
				var njq = $('<div/>').html(data);
				window.location.href = njq.find("a:contains('New (Night)').menu-linkRow").attr("href");
			});
		}
	}
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki öne çıkarılan SDN videosunu kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('videosil') === "true") {
	$('.reklamyoutube-container').remove();
}

// URL: https://forum.shiftdelete.net/*
// Navigasyon barından SORU SOR tuşunu kaldırır
if (GM_getValue('sorusorsil') === "true") {
	$('.navsorusor').remove();
}

// URL: https://forum.shiftdelete.net/*
// Navigasyon barından tema değiştirme tuşunu kaldırır
if (GM_getValue('temasil') === "true") {
	$('.p-navgroup-link--switch').remove();
}

// URL: https://forum.shiftdelete.net/*
// Navigasyon barından teknoloji haberleri tuşunu kaldırır
if (GM_getValue('habersil') === "true") {
	$('.navteknolojihaberleri').remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki çevrimiçi üyeler listesini kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('cevrimicisil') === "true") {
	$('[data-widget-definition="members_online"]').remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki profil mesajları kutusunu kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('pmsil') === "true") {
	$('[data-widget-definition="new_profile_posts"]').remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki istatistikleri kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('statsil') === "true") {
	$('[data-widget-definition="forum_statistics"]').remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki ayın üyeleri listesini kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('ayinuyelerisil') === "true") {
	$('[data-widget-definition="tpm_widget"]').remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki sağ sütun tamamen kaldırıldıysa boşluğu da kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (
	GM_getValue('cevrimicisil') === "true" &&
	GM_getValue('pmsil') === "true" &&
	GM_getValue('statsil') === "true" &&
	GM_getValue('ayinuyelerisil') === "true"
) {
	$('.p-body-sidebarCol, .p-sidebarWrapper').remove();
}

// URL: https://forum.shiftdelete.net/*
// Kullanıcı renklerini ve etiketlerini silerek kullanıcı eşitliğini sağlar
if (!(pn.startsWith("/members/") && !(pn == "/members/ayin-uyeleri/" || pn == "/members/list/" || pn == "/members/")) && GM_getValue('kullanicinormallestir') === "true") {
	var es = $('.username span');
	for (let i = 0; i < es.length; i++) {
		var text = es[i].textContent;
		var parent = es[i].parentElement;
		es[i].remove();
		parent.innerHTML = text;
	}

	$(".userBanner").remove();
}

// URL: https://forum.shiftdelete.net/*
// Anasayfadaki ayın üyeleri listesini kaldırır
// Ekstra not: Kod diğer sayfalarda hiçbir şey yapmayacağı için URL özel olarak ayarlanmadı
if (GM_getValue('aramasadelestir') === "true") {
	$('<style>').text(".p-navgroup.p-discovery{display:block;margin-left:0}.p-navgroup-linkText{display:inline!important}").appendTo(document.head);
	$('.p-header').remove();
}