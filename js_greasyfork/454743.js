// ==UserScript==
// @name         Typing Sites Discord RPC
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Discordのプレイ中のゲームにタイピングゲーム・サイトを表示する
// @author       You
// @match        https://www.e-typing.ne.jp/*
// @match        https://typing-tube.net/*
// @match        https://typing.twi1.me/*
// @match        http://typingx0.net/pop*
// @match        http://typingwar.trap.games*
// @match        https://zty.pe/
// @match        https://pokedebi.com/game/momotype/
// @match        https://mcz-release.com/live/play/
// @match        http://typingx0.net/easy/
// @match        http://typingx0.net/osakana/
// @match        http://typingx0.net/map/
// @match        http://typingx0.net/map_c/
// @match        http://typingx0.net/az/
// @match        https://sorauchi.com/unity
// @match  　　　https://secure.pasoken.net/maipaso/app/*
// @match  　　　https://manabi-gakushu.benesse.ne.jp/gakushu/typing*
// @match  　　　https://typoly.idolypride.jp/game/
// @match        https://game.nicovideo.jp/atsumaru/games/gm15182
// @match        https://1st.natorisana.love/game/zuho_cpp/
// @match        https://ueken0307.github.io/natori-typing/
// @match        https://www.ntv.co.jp/haken2020/special/
// @match        http://sintyaku.pa.land.to/daken2/tajisakumagosou.htm
// @match        http://sintyaku.pa.land.to/daken2/tajitaji.htm
// @match        https://www.intersteno.org/intersteno-internet-contests/training-with-taki-version/
// @include         *contest/app/pages/index.php?rand=*
// @include         *typrx.com*
// @include         *10fastfingers.com*
// @include         *shakyo.io*
// @include         https://typing-training.net*
// @include        *typingclub.com*
// @include        *typing.io*
// @include        *speedcoder.net*
// @include        *gontyping.com*
// @include        *play.mcz-release.com*
// @include        *typing.playgram.jp*
// @include        *music-typing.net*
// @include        *hakatashi.github.io/YouTyping*
// @include        *typingx0.net/sushida/play*
// @include        *typingerz.com*
// @include        *typing.tanonews.com*
// @include      *type.cgi*
// @icon         https://www.google.com/s2/favicons?domain=e-typing.ne.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454743/Typing%20Sites%20Discord%20RPC.user.js
// @updateURL https://update.greasyfork.org/scripts/454743/Typing%20Sites%20Discord%20RPC.meta.js
// ==/UserScript==
var js__
var Detail__
let State__
let url__ = location.href
let LargeImage__ = ""
let send_interval = 15000
var send_data_interval
var focus_in_interval
var dicord_send_data = localStorage.getItem("discord_rich_presence_userscript_send_data") ? localStorage.getItem("discord_rich_presence_userscript_send_data") : "true"

function add_send_data_setting(Element,position){
	Element.insertAdjacentHTML(position, `
<label style="
    display: block;
    margin-bottom: 4px;
" id="discord_rich_presence_userscript_send_data">
<input type="checkbox"`+(localStorage.getItem("discord_rich_presence_userscript_send_data") == "false"?"":"checked")+`>
</input>Discordに打鍵データを表示する</label>`);

	document.getElementById("discord_rich_presence_userscript_send_data").addEventListener("change",function(event){
		localStorage.setItem("discord_rich_presence_userscript_send_data",event.target.checked)
		dicord_send_data = event.target.checked.toString()
		if(!event.target.checked){
			State__ = undefined
			send_localhost()
		}
	})
}


function send_localhost(){
if(document.hasFocus()){
	console.log("send")
	js__ = '{"Detail":"' + Detail__ + '","State":"' + State__ + '","LargeImage":"' + LargeImage__ + '","url":"' + url__ + '"}'
	var myJSON = new XMLHttpRequest();
	myJSON.open("GET","http://127.0.0.1:8843/post?" + js__, true);
	myJSON.send(null);
}
}

window.addEventListener("blur", function() {
	console.log("blur")
	window.clearInterval(focus_in_interval)
	window.clearInterval(send_data_interval)
});
window.addEventListener("focus", function() {
	console.log("focus")
	send_first_data()
});



if(url__.match('https://www.e-typing.ne.jp')){
	url__ = 'https://www.e-typing.ne.jp'
	function etypingDetailSet(){
		if(event.eventPhase == 2){
			if(window.parent.pp_descriptions){
				sessionStorage.setItem("State__", window.parent.pp_descriptions[0]);
				State__ = sessionStorage.getItem("State__")
			}
			State__ = sessionStorage.getItem("State__") ? sessionStorage.getItem("State__") : ""

			Detail__ = window.parent.name == "typing_content" || document.getElementById("typing_content") != null ? sessionStorage.getItem("Detail__") : "選択中"

			if(window.frameElement && window.frameElement.contentDocument && window.frameElement.contentDocument.querySelector(".title") != null){
				sessionStorage.setItem("Detail__",window.frameElement.contentDocument.querySelector(".title").innerText);
				Detail__ = sessionStorage.getItem("Detail__")
			}

			State__ = State__.replace(Detail__,"").replace("タイピングバラエティ","").replace("英文タイピング","")
			if(State__ == "タイピング"){
				State__ = "今月のタイピング"
			}else if(State__ == "腕試しレベルチェック"){
				State__ = "腕試し"
			}
			Detail__ = Detail__ == "選択中" ? "選択中" : "お題: " + Detail__
			State__ = "ジャンル: " + State__
			var roma_kana_english = sessionStorage.getItem("roma_kana_english")
			if(document.title.match(/英語|ローマ字|かなタイピ/)){
				sessionStorage.setItem("roma_kana_english", document.title.match(/英語|ローマ字|かなタイピ/)[0]);
				roma_kana_english = document.title.match(/英語|ローマ字|かなタイピ/)[0]
			}
			if(roma_kana_english == "英語"){
				LargeImage__ = "english"
			}else if(roma_kana_english == "かなタイピ"){
				LargeImage__ = "kana"
			}else{
				LargeImage__ = "e-typingr"
			}
			if(Detail__ == "選択中" || window.parent.pp_descriptions || window.parent.name && Detail__){
				if(Detail__ == "選択中"){
					State__ = undefined
				}
				send_first_data()
			}
		}
	}
	document.addEventListener("readystatechange",etypingDetailSet)

	window.addEventListener("mouseup",function(event){
		if(event.target.className == "pp_close"){
			Detail__ = "選択中"
			State__ = "選択中"
			sessionStorage.removeItem("Detail__")
			sessionStorage.removeItem("State__")
			send_localhost()
		}
	})

	return;
}else if(url__.match('https://typing-tube.net')){
	url__ = 'https://typing-tube.net'
	LargeImage__ = "main"
	Detail__ = "選曲中"
setTimeout( () =>{
	if(document.getElementById("RoomNameArea") != null){
		State__ = "対戦: "+document.getElementById("RoomNameArea").textContent
	}
},5000)
	if(location.href.match("https://typing-tube.net/movie/edit")){
		Detail__ = "譜面作成・編集中"
		State__ = "tltle: "+document.getElementById("title").value
		document.getElementById("title").addEventListener("change",function(evnet){
			State__ = "tltle: "+event.target.value
			send_localhost()
		})
	}

	if(document.querySelector(".movietitle h1") != null){
		add_send_data_setting(document.getElementsByClassName("share")[0],"afterbegin")
		Detail__ = document.querySelector(".movietitle h1").firstChild.textContent+(document.querySelector(".movietitle h1").lastElementChild != null ? " | Level: "+document.querySelector(".movietitle h1").lastElementChild.innerText.match(/\d/)[0] : "");
		State__ = (document.querySelector(".movietitle h1").lastElementChild != null ? "Level: "+document.querySelector(".movietitle h1").lastElementChild.innerText.match(/\d/)[0] : "開始前");

		function send_type_data(){
			const totalTimeCount = document.getElementById("total-time")
			if(totalTimeCount != null || finished){
				if(dicord_send_data == "true"){
					const typeCount_ = document.getElementById("typing-count-value")
					const missCount_ = document.getElementById("miss-value")
					const typingSpeed_ = document.getElementById("type-speed")
					State__ = (typeCount_ ? typeCount_.textContent : 0) +"打鍵 | "+(missCount_ ? missCount_.textContent:0)+"ミス | "+(typingSpeed_ ? typingSpeed_.textContent:0)+"打/秒 | "+ (totalTimeCount != null ? totalTimeCount.textContent : "end")
				}else{
					State__ = (totalTimeCount != null ? "time: "+totalTimeCount.textContent : "end")
				}
				send_localhost()
			}
		}
		send_data_interval = setInterval(send_type_data,5000)
		window.addEventListener("focus",function(){
			send_data_interval = setInterval(send_type_data,5000)
		})
	}

}else if(url__.match('type.cgi')){
	url__ = 'type.cgi'
	LargeImage__ = "da"
	add_send_data_setting(document.body.firstElementChild,"beforeend")
	Detail__ = encodeURIComponent(document.title.replace("打鍵トレーナー","").replace(/（|）|\(|\)/g,""))
	if(Detail__ == ""){
		Detail__ = location.href
	}
	function daken_interval(){
		const key_value = document.getElementById("daken")
		if(dicord_send_data == "true" && key_value){
			State__ = encodeURIComponent(key_value.innerText + "打 | "+document.getElementById("miss").innerText +"ミス | 残り: "+document.getElementById("time").innerText+"秒")
			send_localhost()
		}
	}

	send_data_interval = setInterval(daken_interval,5000)
	window.addEventListener("focus",function(){
		send_data_interval = setInterval(daken_interval,5000)
	})
}else if(url__.match('https://typing.tanonews.com')){
	const mode_change = location.href.match(/\?e/) && document.getElementById("modeChange") != null ? "エンドレスモード":document.getElementById("modeChange").innerText
	url__ = 'https://typing.tanonews.com'
	LargeImage__ = "taisoku"
	Detail__ = "選択中のお題：今月のお題".replace("選択中のお題：","") +" / "+ mode_change
	State__ = undefined
	add_send_data_setting(document.getElementsByClassName("div_comment")[0],"afterbegin")
	document.addEventListener("click",function(event){
		const mode_change = location.href.match(/\?e/) && document.getElementById("modeChange") != null ? "エンドレスモード":document.getElementById("modeChange").innerText
		if(event.target.id == "cwListBtnCurrent"){
			Detail__ = "選択中のお題：今月のお題".replace("選択中のお題：","")+" / "+ mode_change
			send_localhost()
		}else if(event.target.className.match("btnListSet")){
			Detail__ = document.getElementById("cwListSetCurrent").innerText.replace("選択中のお題：","")+" / "+ mode_change
			send_localhost()
		}else if(event.target.id == "modeChange"){
			Detail__ = document.getElementById("cwListSetCurrent").innerText.replace("選択中のお題：","").replace("（今月のお題）","")+" / "+ mode_change
			send_localhost()
		}
	})
	function taisocu_interval(){
		const key_value = document.getElementById("keystrokesCountValue")
		if(dicord_send_data == "true" && key_value){
			State__ = document.getElementById("keystrokesCountValue").innerText + "打 | "+document.getElementById("misstrokesCountValue").innerText +"ミス | "+document.getElementById("speedRatioValue").innerText+"打鍵/秒"
			send_localhost()
		}
	}

	send_data_interval = setInterval(taisocu_interval,5000)
	window.addEventListener("focus",function(){
		send_data_interval = setInterval(taisocu_interval,5000)
	})

}else if(url__.match('https://typing.twi1.me')){
	url__ = 'https://typing.twi1.me'
	LargeImage__ = "hiyoko"
	var data_name = document.getElementsByClassName("h1Yellow")[0]
	if(!location.href.match("https://typing.twi1.me/game/")){
		Detail__ = "選択中"
		send_first_data()
		return
	}
	Detail__ = data_name.innerText
	State__ = "ID: "+location.href.replace("https://typing.twi1.me/game/","")
}else if(url__.match('https://typingerz.com')){
	url__ = 'https://typingerz.com'
	LargeImage__ = "takeshi"
	Detail__ = "ホーム"

	if(location.href == "https://typingerz.com/stage"){
		Detail__ = "０から始めるタイピング"
		State__ = "選択中"
	}else if(location.href.match(/typingerz.com\/\d+/)){
		Detail__ = "０から始めるタイピング"
		State__ = "ステージ:"+ location.href.match(/typingerz.com\/\d+/)[0].replace("typingerz.com/","")
	}else if(location.href == "https://typingerz.com/colosseum"){
		Detail__ = "タイピングコロシアム"
		State__ = "選択中"
		document.addEventListener("click",function(event){
			if(event.target.parentNode.className.match("enterdekettei")){
				State__ = "ステージ:" + event.target.closest(".kurowaku").querySelector(".aqua").children[0].innerText
				sessionStorage.setItem("State__", event.target.closest(".kurowaku").querySelector(".aqua").children[0].innerText);
				send_localhost()
			}
		})
	}else if(location.href.match(/typingerz.com\/c\d+/)){
		Detail__ = "タイピングコロシアム"
		State__ = "ステージ:"+ sessionStorage.getItem("State__")
	}else if(location.href.match("https://typingerz.com/battlemenu")){
		Detail__ = "オンライン対戦"
		State__ = "準備中"
		window.addEventListener("load",function(){
			document.getElementsByClassName("rightsidebox2")[0].insertAdjacentHTML("afterend", `<label id="discord_rich_presence_userscript_send_rate" style="color:#FFF;font-size:1.2rem;"  ><input type="checkbox" `+(localStorage.getItem("userscript_send_rate_checkbox") == "false"?"":"checked")+`></input>Discordにレートを表示する</label>`);
			document.getElementById("discord_rich_presence_userscript_send_rate").addEventListener("change",function(event){
				localStorage.setItem("userscript_send_rate_checkbox",event.target.checked)
				if(event.target.checked){
					State__ = "Rate: "+ localStorage.getItem("userscript_send_rate")+ " / Rank: "+document.getElementsByClassName("menuRanking")[0].innerText.replace("オンライン対戦ランキング　","")
					send_localhost()
				}
			})

			var menuRanking = document.getElementsByClassName("menuRanking")[0]
			// オブザーバーの作成
			const observer = new MutationObserver(records => {
				localStorage.setItem("userscript_send_rate",document.getElementsByClassName("menuRating")[0].innerText.replace("レーティング　",""))
				localStorage.setItem("userscript_send_ranking",document.getElementsByClassName("menuRanking")[0].innerText.replace("オンライン対戦ランキング　",""))
				if(localStorage.getItem("userscript_send_rate_checkbox") != "false"){
					State__ = "Rate: "+ localStorage.getItem("userscript_send_rate")+ " / Rank: "+localStorage.getItem("userscript_send_ranking")
				}
				send_first_data()
			})
			// 監視の開始
			observer.observe(menuRanking, {
				childList: true
			})
		})
		return;
	}else if(location.href.match("https://typingerz.com/rtbattle")){
		Detail__ = "オンライン対戦"
		if(localStorage.getItem("userscript_send_rate_checkbox") != "false"){
			State__ = "Rate: "+ localStorage.getItem("userscript_send_rate")+ " / Rank: "+localStorage.getItem("userscript_send_ranking")
		}else{
			State__ = "対戦中"
		}
		window.addEventListener("load",function(){
			var newranking = document.getElementById('newRanking')
			// オブザーバーの作成
			const observer = new MutationObserver(records => {
				localStorage.setItem("userscript_send_rate",document.querySelector("#newRating > span > span").innerText.replace(" ",""))
				localStorage.setItem("userscript_send_ranking",document.querySelector("#newRanking > span > span").innerText.replace(" ",""))
				if(localStorage.getItem("userscript_send_rate_checkbox") != "false"){
					State__ = "Rate: "+ localStorage.getItem("userscript_send_rate")+ " / Rank: "+localStorage.getItem("userscript_send_ranking")
					send_localhost()
				}
			})
			// 監視の開始
			observer.observe(newranking, {
				childList: true
			})
			send_first_data()
		})
		return;
	}else if(location.href.match("https://typingerz.com/friendbattle")){
		Detail__ = "フレンド対戦"
		window.addEventListener("load",function(){
			document.getElementsByClassName("handiEnter")[0].insertAdjacentHTML("beforebegin", `<label id="discord_rich_presence_userscript_send_password"><input type="checkbox"`+(localStorage.getItem("discord_rich_presence_userscript_send_password") == "false"?"":"checked")+`></input>Discordにパスワードを表示する</label>`);
			document.getElementById("discord_rich_presence_userscript_send_password").addEventListener("change",function(event){
				localStorage.setItem("discord_rich_presence_userscript_send_password",event.target.checked)
			})
			window.addEventListener("keydown",function(event){
				if(event.key == "Enter" && localStorage.getItem("discord_rich_presence_userscript_send_password") != "false"){
					State__ = "パスワード: "+document.getElementById("battlePass").value
					send_localhost()
				}
			})
		})
		return;
	}
	if(location.href.match("mp3")){
		return;
	}
}else if(url__.match('https://music-typing.net')){
	url__ = 'https://music-typing.net'
	LargeImage__ = "musictyping"
	var Title_musictyping = document.querySelector("#script-meta-info > h1")
	if (Title_musictyping == undefined) {
		Detail__ = "選曲中"
		send_first_data()
		return
	}
	Detail__ = Title_musictyping.innerText
	window.addEventListener("load",function(){
		if(location.href.match("https://music-typing.net/play?")){
			State__ = document.getElementsByClassName("selectKeyTypeButton")[0].innerText
		}
		send_first_data()
	})
	return;
}else if(url__.match('http://typingx0.net/sushida/play')){
	url__ = 'http://typingx0.net/sushida/play'
	LargeImage__ = "sushida"
}else if(url__.match('http://typingx0.net/pop')){
	url__ = 'http://typingx0.net/pop'
	LargeImage__ = "poptyping"
}else if(url__.match('http://typingwar.trap.games')){
	url__ = 'http://typingwar.trap.games'
	LargeImage__ = "typingwar"
}else if(url__.match('https://zty.pe')){
	url__ = 'https://zty.pe'
	LargeImage__ = "ztype"
}else if(url__.match('https://mcz-release.com/') || url__.match('https://play.mcz-release.com')){
	url__ = 'https://mcz-release.com/live/play'
	LargeImage__ = "momota"
}else if(url__.match('https://pokedebi.com/game/momotype/')){
	url__ = 'https://pokedebi.com/game/momotype/'
	LargeImage__ = "momotype"
}else if(url__.match('http://typingx0.net/easy')){
	url__ = 'http://typingx0.net/easy'
	LargeImage__ = "easy_typing"
}else if(url__.match('http://typingx0.net/osakana')){
	url__ = 'http://typingx0.net/osakana'
	LargeImage__ = "osakana_typing"
}else if(url__.match('http://typingx0.net/map_c')){
	url__ = 'http://typingx0.net/map_c'
	LargeImage__ = "map_c_typing"
}else if(url__.match('http://typingx0.net/az')){
	url__ = 'http://typingx0.net/az'
	LargeImage__ = "az_typing"
}else if(url__.match('http://typingx0.net/map')){
	url__ = 'http://typingx0.net/map'
	LargeImage__ = "map_typing"
}else if(url__.match('https://game.nicovideo.jp/atsumaru/games/gm15182')){
	url__ = 'https://game.nicovideo.jp/atsumaru/games/gm15182'
	LargeImage__ = "a"
}else if(url__.match('https://secure.pasoken.net/maipaso/app')){
	url__ = 'https://secure.pasoken.net/maipaso/app'
	LargeImage__ = "maipaso"
}else if(url__.match('https://typoly.idolypride.jp/game')){
	url__ = 'https://typoly.idolypride.jp/game'
	LargeImage__ = "typolypride"
}else if(url__.match('https://sorauchi.com/unity')){
	url__ = 'https://sorauchi.com/unity'
	LargeImage__ = "sorauchi"
}else if(url__.match('https://1st.natorisana.love/game/zuho_cpp') || url__.match('https://ueken0307.github.io/natori-typing')){
	url__ = 'https://1st.natorisana.love/game/zuho_cpp'
	LargeImage__ = "natori"
}else if(url__.match('gontyping.com')){
	url__ = 'gontyping.com'
	LargeImage__ = "a"
}else if(url__.match('https://www.ntv.co.jp/haken2020/special')){
	url__ = 'https://www.ntv.co.jp/haken2020/special'
	LargeImage__ = "a"
}else if(url__.match('http://sintyaku.pa.land.to/daken2/tajisakumagosou.htm')){
	url__ = 'http://sintyaku.pa.land.to/daken2/tajisakumagosou.htm'
	LargeImage__ = "typewellr"
}else if(url__.match('http://sintyaku.pa.land.to/daken2/tajitaji.htm')){
	url__ = 'http://sintyaku.pa.land.to/daken2/tajitaji.htm'
	LargeImage__ = "typewellr"
}else if(url__.match('https://typewell-in-browser.web.app')){
	url__ = 'https://typewell-in-browser.web.app'
	LargeImage__ = "typewellr"
}else if(url__.match('http://hakatashi.github.io/YouTyping')){
	url__ = 'http://hakatashi.github.io/YouTyping'
	LargeImage__ = "youtyping"
	Detail__ = document.getElementsByClassName("btn-primary")[0].innerText
}else if(url__.match('https://www.intersteno.org/intersteno-internet-contests/training-with-taki-version') || url__.match('contest/app/pages/index.php')){
	url__ = 'https://www.intersteno.org/intersteno-internet-contests'
	if(!location.href.match('zav')){
		Detail__ = "Taki Version"
	}
	LargeImage__ = "intersteno"
	if(location.href.match('contest/app/pages/index.php')){
		document.addEventListener("mouseover",function(event){
			if(event.target.tagName == "A" && event.target.textContent[0] == " "){
				State__ = event.target.textContent
				send_localhost()
			}
		})
		return;
	}
}else if(url__.match('https://typing-training.net')){
	url__ = 'https://typing-training.net'
	LargeImage__ = "a"
	if(document.querySelector('[itemtype="http://schema.org/WebPage"]') != null){
		Detail__ = document.querySelector('[itemtype="http://schema.org/WebPage"]').firstElementChild.textContent
		State__ = document.querySelector('[itemtype="http://schema.org/WebPage"]').lastChild.textContent
	}
}else if(url__.match('https://manabi-gakushu.benesse.ne.jp/gakushu/typing')){
	url__ = 'https://manabi-gakushu.benesse.ne.jp/gakushu/typing/nihongonyuryoku.html'
	LargeImage__ = "a"
	if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/nihongonyuryoku.html"){
		Detail__ = "日本語編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/homeposition.html"){
		Detail__ = "ホームポジション　基本編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/eigonyuryoku.html"){
		Detail__ = "英語編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/kokugo.html"){
		Detail__ = "国語問題編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/eigo.html"){
		Detail__ = "英語問題編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/eigokotowaza.html"){
		Detail__ = "英語ことわざ編"
	}else if(location.href == "https://manabi-gakushu.benesse.ne.jp/gakushu/typing/homeposition.html"){
		Detail__ = "モラル・パソコン用語編"
	}
}else if(url__.match('https://typing.playgram.jp')){
	url__ = 'https://typing.playgram.jp'
	LargeImage__ = "playgramtyping"
	Detail__ = "ホーム"
	window.addEventListener("load",function(){
		setTimeout(function(){
			var achievement = document.querySelector(".btn-user-title p")
			if(achievement == undefined){
				if(localStorage.getItem("typist_achievement")){
					State__ = localStorage.getItem("typist_achievement")
				}
			}else{
				localStorage.setItem("typist_achievement",achievement.innerText)
				State__ = achievement.innerText
			}
			if(location.href == "https://typing.playgram.jp/select"){
				Detail__ = "モード選択"
			}else if(location.href == "https://typing.playgram.jp/assessment"){
				Detail__ = "うでだめし"
			}else if(location.href == "https://typing.playgram.jp/training"){
				Detail__ = "基礎練習 ステージ選択"
			}else if(location.href == "https://typing.playgram.jp/advanced"){
				Detail__ = "特訓 ステージ選択"
			}else if(location.href.match(/training\/\d*/)){
				Detail__ = "基礎練習 ステージ "+location.href.match(/training\/\d.*/)[0].replace("training/","").replace("/","-")
			}else if(location.href.match("advanced/play")){
				let advanced_mode
				if(location.href.match("easy")){
					advanced_mode = "かんたん"
				}else if(location.href.match("normal")){
					advanced_mode = "ふつう"
				}else{
					advanced_mode = "むずかしい"
				}
				Detail__ = "特訓 ステージ "+advanced_mode
			}
			send_first_data()
		},500)
	})
	return;
}else if(url__.match('typingclub.com')){
	url__ = 'typingclub.com'
	LargeImage__ = "typingclub"
	Detail__ = "HOME"
	let lesson_name = parent.document.documentElement
	if(lesson_name == undefined){
		send_first_data()
		return;
	}
	Detail__ = lesson_name.outerText.split("\n")[0]
	if(Detail__ == "TypingClub"){
		Detail__ = "HOME"
	}
}else if(url__.match('typrx.com')){
	url__ = 'https://www.typrx.com'
	LargeImage__ = "x"
	Detail__ = "HOME"
	if(localStorage.getItem("WPM")){
		State__ = localStorage.getItem("WPM")+" / "+ localStorage.getItem("races")
	}
	if(location.href == "https://www.typrx.com/"){
		localStorage.setItem("WPM",document.querySelector("[class='page-body text-center pt-4 pb-3'] h2").innerText)
		localStorage.setItem("races",document.querySelector("[class='page-body text-center pt-4 pb-3'] p").innerText.split("\n")[0])
		State__ = localStorage.getItem("WPM")+" / "+ localStorage.getItem("races")
	}else if(location.href == "https://www.typrx.com/race"){
		Detail__ = "Race Now!"
	}
}else if(url__.match('10fastfingers.com')){
	url__ = 'https://10fastfingers.com'
	LargeImage__ = "10fastfingers"
	Detail__ = "HOME"
	State__ = "Language: "
	if(document.getElementsByClassName("active")[0] != null){
		Detail__ = document.getElementsByClassName("active")[0].querySelector("strong").innerText
	}
	if(document.getElementById("language") != null){
		State__ += document.getElementById("language").firstElementChild.innerText
	}else if(document.getElementById("selected-language") != null){
		State__ += document.getElementById("selected-language").innerText
	}
}else if(url__.match('typing.io')){
	url__ = 'typing.io'
	LargeImage__ = "typingio"
	Detail__ = "HOME"
	if(location.href.match("https://typing.io/lesson/") && sessionStorage.getItem("Detail")){
		Detail__ = sessionStorage.getItem("Detail")
		State__ = sessionStorage.getItem("State")
	}
	document.addEventListener("click",function(){
		if(event.currentTarget.URL == "https://typing.io/"){
			Detail__ = "HOME"
			State__ = undefined
		}
		if(event.target.closest(".lesson-button") != null){
			sessionStorage.setItem("Detail","language: "+event.target.closest(".lesson-button").querySelector(".language").innerText)
			sessionStorage.setItem("State","genre: "+event.target.closest(".lesson-button").querySelector(".name").innerText)
			Detail__ = sessionStorage.getItem("Detail")
			State__ = sessionStorage.getItem("State")

			send_localhost()
		}
	})
}else if(url__.match('speedcoder.net')){
	url__ = 'speedcoder.net'
	LargeImage__ = "speedcoder"
	Detail__ = "HOME"
	if(!location.href.match("custom") && location.href.match("https://www.speedcoder.net/lessons/") && sessionStorage.getItem("Detail")){
		Detail__ = sessionStorage.getItem("Detail")
		State__ = sessionStorage.getItem("State")
	}
	if(location.href.match("custom") && sessionStorage.getItem("State")){
		Detail__ = "language: "+location.href.match(/(\d+\/)(\w+)/)[2]
	}
	document.addEventListener("click",function(){
		if(event.target.className.match("lesson")){
			sessionStorage.setItem("Detail","language: "+event.target.firstChild.textContent.replace(" ",""))
			sessionStorage.setItem("State","genre: "+event.target.lastElementChild.innerText)
		}else if(event.target.parentNode.className.match("panel") && location.href == "https://www.speedcoder.net/customcode/"){
			sessionStorage.setItem("State","genre: "+event.target.parentNode.firstElementChild.firstElementChild.innerText)
		}
	})
}else if(url__.match('shakyo.io')){
	url__ = 'shakyo.io'
	LargeImage__ = "shakyoio"
	Detail__ = "ホーム"
	window.addEventListener("load",function(){
		setTimeout(function(){
			var lesson

			if(document.getElementsByClassName("lesson-breadcrumb")[0] != null && document.getElementsByClassName("lesson-breadcrumb")[0].lastElementChild != null){
				lesson = document.getElementsByClassName("lesson-breadcrumb")[0].lastElementChild
				Detail__ = (lesson.textContent+"　").replace("++","＋＋")
				sessionStorage.setItem("choice",Detail__)
			}else if(document.getElementsByClassName("code-info")[0] != null){
				Detail__ = sessionStorage.getItem("choice")
				State__ = document.getElementsByClassName("code-info")[0].firstElementChild.textContent
			}
			if(location.href.match("https://shakyo.io/code")){
				sessionStorage.removeItem("choice")
				Detail__ = document.getElementsByClassName("code-info-lang")[0] ? document.getElementsByClassName("code-info-lang")[0].innerText : "ホーム"

			}
			send_first_data()
		},2500)
	})
	return;
}


function send_first_data(){
	send_localhost()
	focus_in_interval = setInterval(send_localhost,15000)
}
send_first_data()

