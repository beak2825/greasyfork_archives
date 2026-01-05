// ==UserScript==
// @name        Pomocnik wołania (Morimasa)
// @namespace   http://www.wykop.pl/ludzie/Morimasa/
// @description Pomocnik Wołania do obrazków na #randomanimeshit
// @author		Morimasa
// @include     http://www.wykop.pl/moj/*
// @include     http://www.wykop.pl/tag/*
// @include		http://www.wykop.pl/mikroblog/*
// @include		http://www.wykop.pl/wpis/*
// @version     1.04
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22429/Pomocnik%20wo%C5%82ania%20%28Morimasa%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22429/Pomocnik%20wo%C5%82ania%20%28Morimasa%29.meta.js
// ==/UserScript==
//To jest mój pierwszy skrypt. Napisz jak coś nie działa albo co można zmienić.

var nick=['@Arratay', '@MrEid', '@kinky_savage', '@MlodyDziadzioSpamer', '@MlodyDziadzioSpamer', '@SzlomoBronsztajn @xoracy @mattommottam', '@strumienzgor', '@scovil', '@ayasecon', '@MlodyDziadzioSpamer', '@Czerwonoswiatkowiec @Psych0', '@scovil', '@ayasecon', '@strumienzgor', '@Nyankov', '@Czerwonoswiatkowiec', '@raksu', '@Linney', '@SzlomoBronsztajn', '@Evil_Anon', '@Nyankov', '@Linney', '@Sentox', '@kinky_savage', '@Kartinos @Arratay @SzlomoBronsztajn @BlueFeather', '@Nyankov', '@kinky_savage', '@wykopowy_on', '@Magnoolia', '@scovil', '@bigdomin9', '@kinky_savage', '@Czerwonoswiatkowiec', '@Linney', '@MlodyDziadzioSpamer', '@strumienzgor', '@Nyankov', '@scovil', '@BlackReven', '@Linney', '@lewConiriK', '@Linney', '@BlackReven', '@raksu', '@Nyankov', '@arratay', '@scovil', '@scovil', '@zeligauskas', '@Czerwonoswiatkowiec', '@kinky_savage', '@ayasecon @zeligauskas @jarzyna @pcela @seikii', '@SzlomoBronsztajn @Sentox', '@ayasecon', '@Nyankov', '@BlackReven @joookub @2ndLaw @MrEid @DOgi @Kartinos @matejss @SzlomoBronsztajn @Morimasa', '@xoracy', '@wykopowy_on', '@SzlomoBronsztajn', '@RARvolt @Morimasa', '@The_Art_of_Suicide @raksu', '@Arratay', '@raksu', '@wacik3', '@xoracy', '@SzlomoBronsztajn @KaeruKuro @xoracy @mattommottam', '@RARvolt @KaeruKuro', '@zeligauskas', '@flashgordon', '@scovil', '@kedzior1916', '@bigdomin09', '@norypS', '@Axoi', '@ayasecon', '@Kiciuk', '@mar0uk @jarzyna', '@bigdomin09', '@bigdomin09', '@MrEid', '@joookub @Evil_Anon @Morimasa', '@Nyankov', '@raksu', '@kinky_savage', '@ayasecon', '@xoracy', '@wykopowy_on', '@Evil_Anon @SzlomoBronsztajn', '@Nyankov', '@BlackReven', '@zeligauskas', '@SzlomoBronsztajn', '@wykopowy_on', '@Nyankov', '@joookub @Kartinos @jimp', '@kinky_savage', '@jamal013', '@matejss', '@Linney', '@jarzyna @Morimasa', '@Nyankov', '@Nyankov', '@Nyankov', '@kinky_savage @xoracy', '@MrEid', '@raksu', '@Kartinos', '@MrEid', '@kedzior1916', '@MlodyDziadzioSpamer @xoracy', '@strumienzgor', '@strumienzgor', '@kinky_savage', '@arratay @BlueFeather','@BlackReven @BlueFeather @Morimasa','@meister431'];
var tag=['#akame', '#alicenakiri', '#amatsukaze', '#aniol', '#annanishikinomiya', '#architekturanime', '#ayakomichi', '#ayanosugiura', '#ayase', '#blanc', '#cc', '#chikatakami', '#cirno', '#compa', '#czolgi', '#dagashikashi', '#datealive', '#edwardelric', '#ellenbaker', '#fate', '#girlsundpanzer', '#gits', '#gundam', '#haruhisuzumiya', '#hatsunemiku', '#himawarifurutani', '#holo', '#homuraakemi', '#hongmeiling', '#honokakousaka', '#hoppouchan', '#horo', '#hotarushidare', '#hououina', '#jibril', '#karenkujou', '#keion', '#kiratsubasa', '#kirishima (KC)', '#kirito', '#kobato', '#kougami', '#Kuroneko', '#kurumitokisaki', '#kyokosakura', '#kyoufujibayashi', '#kyoukotoshinou', '#kyubey', '#kyubey female', '#leilamacal', '#linainverse', '#loli', '#lovelive', '#madokakaname', '#madokamagica', '#makinishikino', '#makisekurisu', '#makomankanshoku', '#mamitomoe', '#megumin', '#mirainikki', '#mioakiyama', '#mirainikki', '#mitsukinase', '#morgiana', '#naturanime', '#neko', '#Nepgear', '#niateppelin', '#nicoyazawa', '#noire', '#northernprincess', '#nozomitoujou', '#okabe', '#ramu', '#rem', '#remiscarlet', '#renchon', '#rengemiyauchi', '#rikkatakanashi', '#rintohsaka', '#ritsutainaka', '#rorymercury', '#ruikosaten', '#rumia', '#ryougishiki', '#ryuukomatoi', '#saber', '#sakurakooomuro', '#sakuyaizayoi', '#sanaedekomori', '#sanaekochiya', '#satsukikiryuin', '#sayakamiki', '#senjougahara', '#shimakaze', '#shinobu', '#shiro', '#shiroe', '#steinsgate', '#strikewitches', '#suigintou', '#tachibanasylphinford', '#togame', '#tokyoghoul', '#toloveru', '#touhou', '#toukakirishima', '#uni', '#yandere', '#youmukonpaku', '#yuruyuri', '#yuudachi', '#yuzukiyukari','#stopkianime','#pettanko'];
var wolanie='';

$(function(){
	var button = '.mfUploadHolder > .buttons > p:eq(1)';
	var textbox='.mfUploadHolder > .arrow_box > textarea';
	$(button).prepend('<span class="button" href="#" title="">Wołanie</span>');
	$(button).prepend('<input type="text" style="width:70px !important; height:27px !important;fontSize:15px !important;padding:0 !important;" readonly></input>');
	$(button).prepend('<input type="checkbox" value="auto" />');
	$(button+'>span').click(function(){
		wolanie='';
		var pattern;
		for(i=0;i<=tag.length-1;i++){
			if ($('div:last:contains('+tag[i]+')').length > 0) {
				pattern = nick[i].split(' ');
				for(j=0;j<=pattern.length-1;j++){
					if(wolanie.search(pattern[j])==-1)
 						wolanie+=pattern[j]+' ';
				}
			}
		}
		if(wolanie.length>0){
			$(button+'>input:nth-child(2)').val(wolanie);
			console.log($(button+'>input:first:checked').length)
			if($(button+'>input:first:checked').length <= 0)
				$(textbox).val($(textbox).val()+' '+wolanie);
		}
	});
})