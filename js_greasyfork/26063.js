// ==UserScript==
// @name			Atla Gel Şaban
// @namespace		http://lab.mertskaplan.com/atlagelsaban
// @description 	AÜ OBS Anket Atlatıcı — Ankara Üniversitesi Kampüs Bilgi Sistemi'nde yer alan ve öğrencilerin notlarını görmeden önce doldurmalı zorunlu tutulan anketleri otomatik olarak doldurma yöntemiyle atlayan, JavaScript dili ve jQuery kütüphanesi ile kodlanmış bir tarayıcı eklentisidir.
// @version			1.1
// @license			CC BY-NC-SA 4.0, https://creativecommons.org/licenses/by-nc-sa/4.0/deed.tr
// @author	  		Mert S. Kaplan, @mertskaplan
// @homepage		https://mertskaplan.com
// @supportURL		https://mertskaplan.com/iletisim
// @contributionURL	https://www.paypal.me/mertskaplan/5
// @icon			http://lab.mertskaplan.com/atlagelsaban/saban-x48.png
// @include			*//obs.ankara.edu.tr/student/lessongradebystudent*
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/26063/Atla%20Gel%20%C5%9Eaban.user.js
// @updateURL https://update.greasyfork.org/scripts/26063/Atla%20Gel%20%C5%9Eaban.meta.js
// ==/UserScript==

var version = "v1.1";
$('.buttonH').after('<a original-title="Ne ki bu?" type="button" class="buttonH bDefault tipS" id="msk-NeKiBu" style="margin-left:0; border-radius:0px 2px 2px 0px;" href="/manipulating"><i class="icos-info"></i></a><input id="msk-AtlaGelSaban" class="buttonH bRed tipE" type="button" value="Atla Gel Şaban" original-title="Anketleri atla da gel!" style="margin-right:0; border-radius:2px 0px 0px 2px;">');
$('#msk-AtlaGelSaban').click(function () {
	setTimeout(function () {$('.noteview-survey:first').click();}, 0);

	setTimeout(function () {$('input:radio[id=q_708]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_722]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_742]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_746]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_750]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_752]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_759]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_765]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_771]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_777]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_783]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_789]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_795]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_801]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_807]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_813]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_819]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_825]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_831]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_837]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_843]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_849]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_855]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_861]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_867]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_873]').click();}, 1000);

	setTimeout(function () {$('input:radio[id=q_708]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_722]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_742]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_746]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_750]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_752]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_759]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_765]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_771]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_777]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_783]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_789]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_795]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_801]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_807]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_813]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_819]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_825]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_831]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_837]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_843]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_849]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_855]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_861]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_867]').click();}, 1000);
	setTimeout(function () {$('input:radio[id=q_873]').click();}, 1000);

	setTimeout(function () {$('.ui-dialog-buttonset button').trigger('click');}, 1050); 
});
$('a#msk-NeKiBu').live('click', function (n) {
	n.preventDefault();
	var t,
	r,
	i,
	u;
	return t = $(this),
	r = t.attr('href'),
	i = t.attr('original-title'),
	u = $('#menu-pathno').val(),
	i || (i = t.attr('title')),
	$dialog.html($ajaxLoader),
	$dialog.dialog('option', 'buttons', {}),
	$dialog.dialog({
		title: i,
		width: 600,
		height: 400
	}),
	$.ajax({
		url: r,
		data: {
			no: u
		},
		cache: !1,
		type: 'GET',
		success: function (n) {
			n.Action && n.Action == 'Failure' ? ExecuteResult(n)  : $dialog.html(n)
		},
		error: function () {
			$dialog.html('<div style="padding:10px"><h3 style="margin-bottom:10px">Atla Gel Şaban<small style="font-size:60%; margin-left:5px">' + version + '</small></h3><p><img class="tipE" style="float: right; margin-left: 10px; margin-top:5px;" alt="Atla Gel Şaban" original-title="Aaa! Mahmut Hoca. Sende mi kaçtın?" width="48" height="48" src="http://lab.mertskaplan.com/atlagelsaban/saban-x48.png">Atla Gel Şaban; Ankara Üniversitesi Kampüs Bilgi Sistemi\'nde yer alan ve öğrencilerin notlarını görmeden önce doldurmalı zorunlu tutulan <strong>anketleri otomatik olarak</strong> doldurma yöntemiyle <strong>atlayan</strong>, JavaScript dili ve jQuery kütüphanesi ile kodlanmış <strong>bir tarayıcı eklentisidir.</strong></p><h4 style="margin-top:20px; margin-bottom:10px">Neden ihtiyaç duyuldu?</h4><p style="margin-bottom:10px">Anket yönteminin sağlıklı verilere ulaşma konusunda halihazırda sorunlu olduğu düşünülürken bir de bunun ders notunu öğrenmek için sabırsızlanan öğrencilerin önüne tam da bu duygular doruk yapmışken koymak, üstelik de zorunlu tutmak verilerin büyük ölçüde gerçeği yansıtmayacağını garanti edecektir.  Hal böyle olunca, not görüntüleme ekranından hemen önce gelen doldurulması zorunlu olan anketlerin hiçbir geçerliliğinden söz edilemez ve yalnızca zaman kaybı oldukları aşikardır. Bu zaman kaybını bir nebze telafi etmek ve zorunlu anket uygulamasını manipüle ederek protesto etmek için böyle bir eklenti ihtiyacı ortaya çıkmıştır.</p><p>Anketleri doldurma zorunluluğu kaldırılana ve anketler not görüntüleme ekranından daha uygun bir sayfaya taşınana kadar bu eklenti yapılacak olası müdahalelere karşı güncellenerek çalışmaya devam edecektir.</p><h4 style="margin-top:20px; margin-bottom:10px">Adını nereden alıyor?</h4><p style="margin-bottom:10px">Eklenti adını feodaliteyi, başlık parasını, berdeli, anti-sendikal hareketi en ciddi filmlerde bile kolay rastlanmayacak sertlikte eleştiren ve bu eleştiriyi yaparken seyirciyi gülmekten yerlere yatıran Kemal Sunal\'ın başrolünde olduğu "Atla Gel Şaban" adlı filmden almıştır. Ayrıca eklenti, sistemin dayattıklarına karşı o sistemin ve temsilcilerinin sınırlarından çıkıp sistemi ve temsilcilerini rezil ederek yenmesini vurgulayarak; <strong>Kemal Sunal\'a adanmıştır.</strong></p><p><strong>İlgilisine:</strong> Kemal Sunal, "Beni kimse araştırmayacak galiba, ben yapayım" diyerek "<a target="_blank" href="https://yadi.sk/i/D2CBsQ8mcdR3Q">Televizyon ve Sinemada Kemal Sunal Güldürüsü</a>" başlıklı Yüksek Lisans tezini hazırlamış ve bu tezinde hepimizin gülerek izlediği İnek Şaban karakterini anarşist olarak tanımlamıştır. (<a target="_blank&quot;" href="http://onedio.com/haber/kemal-sunal-in-yuksek-lisans-tezinden-alintilarla-inek-saban-degil-anarsist-saban-622175" style="font-style:italic; font-size:11px">Popüler kültürün hazır yiyicilerine özel bağlantı</a>)</p><ul style="margin-top:20px;"><strong>Künye</strong><li><strong>Yazar:</strong> <a target="_blank" href="https://mertskaplan.com">Mert S. Kaplan</a></li><li><strong>İletişim:</strong> <a target="_blank" href="mailto:mail@mertskaplan.com">mail@mertskaplan.com</a></li><li><strong>Eklenti Lisansı:</strong> <a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.tr" class="tipW" original-title="Creative Commons Alıntı-Gayriticari-LisansDevam 4.0 Uluslararası Lisansı">CC BY-NC-SA 4.0</a></li></ul></div>')
		}
	}),
	$dialog.dialog('open'),
	!1
});